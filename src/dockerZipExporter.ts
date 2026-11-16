import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execFileSync } from 'child_process';
import type { IncomingMessage, ServerResponse } from 'http';
import { REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES } from './identifyCurriculumPreview.ts';

export interface DockerZipManifest {
  ok: boolean;
  mode: 'full' | 'lightweight';
  filename: string;
  totalBytes: number;
  totalMegabytes: string;
  chunkSize: number;
  totalChunks: number;
  filesCount: number;
  generatedAtIso: string;
}

const CHUNK_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB chunks (safe well under Cloud Run 32 MB limit)
const TMP_CACHE_DIR = '/tmp/lango-docker-export-cache';
const TMP_IMG_CACHE_DIR = path.join(TMP_CACHE_DIR, 'optimized-images');

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntryInput {
  relPath: string;
  data: Buffer;
}

/**
 * Pure Node.js standard PKZIP archive builder.
 * Uses STORE (0) for already-compressed image formats (.jpg, .jpeg, .png, .webp)
 * and DEFLATE (8) for source code, JSON, HTML, Markdown, and Dockerfiles.
 */
function buildPkZipBuffer(entries: ZipEntryInput[]): Buffer {
  const localFileChunks: Buffer[] = [];
  const centralDirChunks: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const normalizedPath = entry.relPath.replace(/\\/g, '/');
    const nameBuf = Buffer.from(normalizedPath, 'utf8');
    const rawData = entry.data;
    const uncompressedSize = rawData.length;
    const fileCrc = crc32(rawData);

    const ext = path.extname(normalizedPath).toLowerCase();
    const isAlreadyCompressed =
      ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';

    let compressedData: Buffer;
    let compressionMethod: number;

    if (isAlreadyCompressed || uncompressedSize < 128) {
      compressedData = rawData;
      compressionMethod = 0; // STORE
    } else {
      compressedData = zlib.deflateRawSync(rawData, { level: 9 });
      compressionMethod = 8; // DEFLATE
      if (compressedData.length >= uncompressedSize) {
        compressedData = rawData;
        compressionMethod = 0;
      }
    }

    const compressedSize = compressedData.length;

    // Local file header (30 bytes + filename)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0x0800, 6); // General purpose bit flag (UTF-8)
    localHeader.writeUInt16LE(compressionMethod, 8);
    localHeader.writeUInt16LE(0, 10); // Last mod file time
    localHeader.writeUInt16LE(0x5421, 12); // Last mod file date
    localHeader.writeUInt32LE(fileCrc, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // Extra field length
    nameBuf.copy(localHeader, 30);

    localFileChunks.push(localHeader, compressedData);

    // Central directory header (46 bytes + filename)
    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    centralHeader.writeUInt16LE(20, 4); // Version made by
    centralHeader.writeUInt16LE(20, 6); // Version needed to extract
    centralHeader.writeUInt16LE(0x0800, 8); // General purpose bit flag (UTF-8)
    centralHeader.writeUInt16LE(compressionMethod, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x5421, 14);
    centralHeader.writeUInt32LE(fileCrc, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30); // Extra field length
    centralHeader.writeUInt16LE(0, 32); // File comment length
    centralHeader.writeUInt16LE(0, 34); // Disk number start
    centralHeader.writeUInt16LE(0, 36); // Internal file attributes
    centralHeader.writeUInt32LE(0, 38); // External file attributes
    centralHeader.writeUInt32LE(offset, 42); // Relative offset of local header
    nameBuf.copy(centralHeader, 46);

    centralDirChunks.push(centralHeader);
    offset += localHeader.length + compressedData.length;
  }

  const centralDirSize = centralDirChunks.reduce((acc, b) => acc + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // End of central directory signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Disk where central directory starts
  eocd.writeUInt16LE(entries.length, 8); // Number of central directory records on this disk
  eocd.writeUInt16LE(entries.length, 10); // Total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12); // Size of central directory
  eocd.writeUInt32LE(offset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...localFileChunks, ...centralDirChunks, eocd]);
}

function getOptimizedImageBuffer(absPath: string, relPath: string): Buffer {
  const rawStat = fs.statSync(absPath);
  // Only recompress JPEGs larger than 240 KB so the entire full zip stays ~16 MB (< 32 MB Cloud Run limit)
  if (rawStat.size <= 240 * 1024 || !relPath.toLowerCase().endsWith('.jpg')) {
    return fs.readFileSync(absPath);
  }

  try {
    fs.mkdirSync(TMP_IMG_CACHE_DIR, { recursive: true });
    const cacheKey = relPath.replace(/[^a-zA-Z0-9._-]/g, '_');
    const cachedImgPath = path.join(TMP_IMG_CACHE_DIR, cacheKey);
    if (fs.existsSync(cachedImgPath)) {
      const cachedStat = fs.statSync(cachedImgPath);
      if (cachedStat.size > 15000) {
        return fs.readFileSync(cachedImgPath);
      }
    }
    execFileSync('convert', [absPath, '-quality', '60', cachedImgPath], {
      stdio: 'ignore',
    });
    if (fs.existsSync(cachedImgPath) && fs.statSync(cachedImgPath).size > 15000) {
      return fs.readFileSync(cachedImgPath);
    }
  } catch {
    // Fallback to raw image if ImageMagick convert is unavailable
  }

  return fs.readFileSync(absPath);
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.aistudio',
  '.playwright-cli',
  'downloads',
]);

const cachedArchives: Record<
  'full' | 'lightweight',
  { buffer: Buffer; filesCount: number; generatedAtIso: string } | null
> = {
  full: null,
  lightweight: null,
};

export function getOrBuildDockerZipArchive(
  mode: 'full' | 'lightweight' = 'full',
  workspaceRoot: string = process.cwd()
): { buffer: Buffer; filesCount: number; generatedAtIso: string; filename: string } {
  const filename =
    mode === 'lightweight'
      ? 'lango-ukrainian-docker-port-4000-lightweight.zip'
      : 'lango-ukrainian-docker-port-4000.zip';

  const cached = cachedArchives[mode];
  if (cached) {
    return { ...cached, filename };
  }

  const entries: ZipEntryInput[] = [];

  function walk(dir: string): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        if (EXCLUDED_DIRS.has(item.name)) continue;
        walk(path.join(dir, item.name));
      } else if (item.isFile()) {
        if (item.name.endsWith('.zip')) continue;
        const fullPath = path.join(dir, item.name);
        const relPath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');

        // Skip duplicate raw AI Studio generation artifacts under public/assets/aistudio
        if (relPath.startsWith('public/assets/aistudio/')) {
          continue;
        }

        // Skip the 13 removed incoherent scenes from the Docker distribution to keep it clean and fast
        const baseNameNoExt = path.basename(item.name, path.extname(item.name));
        if (REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(baseNameNoExt)) {
          continue;
        }

        if (mode === 'lightweight' && relPath.startsWith('public/assets/identify/')) {
          // In lightweight mode, include only the 10 legacy core scene photos so the zip is ~3.5 MB
          if (baseNameNoExt.startsWith('uk_scene_')) {
            continue;
          }
        }

        const data = relPath.startsWith('public/assets/identify/')
          ? getOptimizedImageBuffer(fullPath, relPath)
          : fs.readFileSync(fullPath);

        entries.push({ relPath, data });
      }
    }
  }

  walk(workspaceRoot);

  const buffer = buildPkZipBuffer(entries);
  const generatedAtIso = new Date().toISOString();
  cachedArchives[mode] = {
    buffer,
    filesCount: entries.length,
    generatedAtIso,
  };

  return {
    buffer,
    filesCount: entries.length,
    generatedAtIso,
    filename,
  };
}

export function buildDockerZipManifest(
  mode: 'full' | 'lightweight' = 'full',
  workspaceRoot: string = process.cwd()
): DockerZipManifest {
  const archive = getOrBuildDockerZipArchive(mode, workspaceRoot);
  const totalBytes = archive.buffer.length;
  const totalChunks = Math.max(1, Math.ceil(totalBytes / CHUNK_SIZE_BYTES));
  return {
    ok: true,
    mode,
    filename: archive.filename,
    totalBytes,
    totalMegabytes: (totalBytes / (1024 * 1024)).toFixed(2),
    chunkSize: CHUNK_SIZE_BYTES,
    totalChunks,
    filesCount: archive.filesCount,
    generatedAtIso: archive.generatedAtIso,
  };
}

/**
 * Handles `/downloads/lango-ukrainian-docker-port-4000.zip`,
 * `/api/docker-zip/manifest`, and `/api/docker-zip/chunk` in both
 * Vite dev server (`vite.config.ts`) and production Express (`server.ts`).
 */
export function handleDockerZipHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  workspaceRoot: string = process.cwd()
): boolean {
  const rawUrl = req.url || '';
  const parsedUrl = new URL(rawUrl, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const modeParam =
    parsedUrl.searchParams.get('mode') === 'lightweight' ? 'lightweight' : 'full';

  if (pathname === '/api/docker-zip/manifest') {
    const manifest = buildDockerZipManifest(modeParam, workspaceRoot);
    const body = JSON.stringify(manifest);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
    return true;
  }

  if (pathname === '/api/docker-zip/chunk') {
    const archive = getOrBuildDockerZipArchive(modeParam, workspaceRoot);
    const chunkIndex = Math.max(0, Number(parsedUrl.searchParams.get('index') || '0'));
    const start = chunkIndex * CHUNK_SIZE_BYTES;
    const end = Math.min(archive.buffer.length, start + CHUNK_SIZE_BYTES);

    if (start >= archive.buffer.length) {
      res.statusCode = 416;
      res.end('Requested chunk out of range');
      return true;
    }

    const slice = archive.buffer.subarray(start, end);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', String(slice.length));
    res.setHeader('Cache-Control', 'no-store');
    res.end(slice);
    return true;
  }

  if (
    pathname === '/downloads/lango-ukrainian-docker-port-4000.zip' ||
    pathname === '/downloads/lango-ukrainian-docker-port-4000-lightweight.zip' ||
    pathname === '/api/docker-zip/download'
  ) {
    const effectiveMode = pathname.includes('lightweight')
      ? 'lightweight'
      : modeParam;
    const archive = getOrBuildDockerZipArchive(effectiveMode, workspaceRoot);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${archive.filename}"`
    );
    res.setHeader('Content-Length', String(archive.buffer.length));
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'HEAD') {
      res.end();
      return true;
    }
    res.end(archive.buffer);
    return true;
  }

  return false;
}
