// ============================================================================
// LANGO — 40-SCENE IDENTIFY VISUAL VOCABULARY GENERATOR & WEBP RENDERER
// Renders 36 custom 1200×900 visual scenes (with 0 embedded text labels) where
// every assigned vocabulary object is explicitly drawn at its exact normalized
// bounding box, and converts each scene via Chromium + ImageMagick to .webp.
// Also preserves the 4 verified real photographic scenes (Total = 40 scenes).
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OUT_DIR = path.join(process.cwd(), 'public/assets/identify/regenerated');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ----------------------------------------------------------------------------
// 1. Environment Background Renderer (1200 × 900)
// ----------------------------------------------------------------------------
function renderEnvironmentBackground(envType, variant = 1) {
  switch (envType) {
    case 'kitchen':
    case 'dining':
    case 'cafe':
    case 'restaurant':
      return `
        <defs>
          <linearGradient id="bg-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${variant === 1 ? '#FBF7F0' : '#F4EFE6'}"/>
            <stop offset="100%" stop-color="${variant === 1 ? '#EFE6D5' : '#E5DAC7'}"/>
          </linearGradient>
          <linearGradient id="bg-counter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#D7C0A3"/>
            <stop offset="18%" stop-color="#B99976"/>
            <stop offset="100%" stop-color="#8C6B4A"/>
          </linearGradient>
          <pattern id="tile-grid" width="60" height="30" patternUnits="userSpaceOnUse">
            <rect width="60" height="30" fill="none" stroke="#E2D6C3" stroke-width="1.5"/>
          </pattern>
        </defs>
        <rect width="1200" height="540" fill="url(#bg-wall)"/>
        <rect y="180" width="1200" height="360" fill="url(#tile-grid)" opacity="0.65"/>
        <rect y="530" width="1200" height="16" fill="#A07E5B"/>
        <rect y="546" width="1200" height="354" fill="url(#bg-counter)"/>
      `;

    case 'bedroom':
    case 'living':
    case 'library':
    case 'office':
    case 'classroom':
      return `
        <defs>
          <linearGradient id="bg-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${variant === 1 ? '#EEF3F8' : '#F7F3EB'}"/>
            <stop offset="100%" stop-color="${variant === 1 ? '#DCE5F0' : '#E8DFCF'}"/>
          </linearGradient>
          <linearGradient id="bg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C8A27A"/>
            <stop offset="100%" stop-color="#9C744F"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="580" fill="url(#bg-wall)"/>
        <rect y="568" width="1200" height="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect y="584" width="1200" height="316" fill="url(#bg-floor)"/>
        <g stroke="#87603C" stroke-width="1.5" opacity="0.35">
          <line x1="0" y1="640" x2="1200" y2="640"/>
          <line x1="0" y1="710" x2="1200" y2="710"/>
          <line x1="0" y1="790" x2="1200" y2="790"/>
          <line x1="0" y1="870" x2="1200" y2="870"/>
        </g>
      `;

    case 'bathroom':
    case 'clinic':
    case 'market':
    case 'gym':
      return `
        <defs>
          <linearGradient id="bg-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F0F9FF"/>
            <stop offset="100%" stop-color="#E0F2FE"/>
          </linearGradient>
          <linearGradient id="bg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#CBD5E1"/>
            <stop offset="100%" stop-color="#94A3B8"/>
          </linearGradient>
          <pattern id="clean-tile" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" fill="none" stroke="#BAE6FD" stroke-width="1.5"/>
          </pattern>
        </defs>
        <rect width="1200" height="570" fill="url(#bg-wall)"/>
        <rect width="1200" height="570" fill="url(#clean-tile)" opacity="0.6"/>
        <rect y="570" width="1200" height="330" fill="url(#bg-floor)"/>
      `;

    case 'park':
    case 'playground':
    case 'outdoor-market':
      return `
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="60%" stop-color="#BAE6FD"/>
            <stop offset="100%" stop-color="#E0F2FE"/>
          </linearGradient>
          <linearGradient id="lawn-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#86EFAC"/>
            <stop offset="45%" stop-color="#4ADE80"/>
            <stop offset="100%" stop-color="#22C55E"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="420" fill="url(#sky-grad)"/>
        <path d="M0,420 Q300,370 600,405 T1200,395 L1200,900 L0,900 Z" fill="url(#lawn-grad)"/>
      `;

    case 'street':
    case 'transit':
    case 'station':
      return `
        <defs>
          <linearGradient id="urban-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#60A5FA"/>
            <stop offset="100%" stop-color="#DBEAFE"/>
          </linearGradient>
          <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#64748B"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="440" fill="url(#urban-sky)"/>
        <rect y="440" width="1200" height="130" fill="#CBD5E1"/>
        <rect y="570" width="1200" height="330" fill="url(#asphalt)"/>
      `;

    default:
      return `<rect width="1200" height="900" fill="#F8FAFC"/>`;
  }
}

// ----------------------------------------------------------------------------
// 2. Detailed Object Illustration Renderer Inside Exact Pixel Box (px, py, pw, ph)
//    Draws unmistakable, richly shaded, realistic vector graphics for each object
//    with ZERO text labels inside the image.
// ----------------------------------------------------------------------------
function renderObjectArtwork(vocabId, iconType, px, py, pw, ph) {
  const cx = px + pw / 2;
  const cy = py + ph / 2;
  const r = Math.min(pw, ph) / 2;

  // Soft ground/surface contact shadow under object
  const shadow = `<ellipse cx="${cx}" cy="${py + ph - 6}" rx="${pw * 0.42}" ry="${Math.max(6, ph * 0.06)}" fill="#0F172A" opacity="0.16"/>`;

  let body = '';

  switch (vocabId) {
    // ================= KITCHEN & DINING =================
    case 'k-pot':
      body = `
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.28}" width="${pw * 0.72}" height="${ph * 0.62}" rx="16" fill="#94A3B8" stroke="#334155" stroke-width="5"/>
        <rect x="${px + pw * 0.20}" y="${py + ph * 0.34}" width="${pw * 0.22}" height="${ph * 0.50}" rx="8" fill="#CBD5E1" opacity="0.65"/>
        <path d="M${px + pw * 0.04},${py + ph * 0.42} H${px + pw * 0.14} M${px + pw * 0.86},${py + ph * 0.42} H${px + pw * 0.96}" stroke="#1E293B" stroke-width="10" stroke-linecap="round"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.28}" rx="${pw * 0.37}" ry="${ph * 0.08}" fill="#CBD5E1" stroke="#334155" stroke-width="5"/>
        <circle cx="${cx}" cy="${py + ph * 0.18}" r="${Math.min(pw, ph) * 0.06}" fill="#1E293B"/>
      `;
      break;

    case 'k-pan':
      body = `
        <ellipse cx="${px + pw * 0.42}" cy="${py + ph * 0.58}" rx="${pw * 0.36}" ry="${ph * 0.28}" fill="#1E293B" stroke="#0F172A" stroke-width="6"/>
        <ellipse cx="${px + pw * 0.42}" cy="${py + ph * 0.58}" rx="${pw * 0.29}" ry="${ph * 0.21}" fill="#334155"/>
        <circle cx="${px + pw * 0.36}" cy="${py + ph * 0.55}" r="${Math.min(pw, ph) * 0.10}" fill="#FEF9C3"/>
        <circle cx="${px + pw * 0.36}" cy="${py + ph * 0.55}" r="${Math.min(pw, ph) * 0.05}" fill="#F59E0B"/>
        <line x1="${px + pw * 0.74}" y1="${py + ph * 0.48}" x2="${px + pw * 0.96}" y2="${py + ph * 0.28}" stroke="#0F172A" stroke-width="14" stroke-linecap="round"/>
      `;
      break;

    case 'k-plate':
    case 'dr-plate':
    case 'rs-plate':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.44}" ry="${ph * 0.38}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="5"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.31}" ry="${ph * 0.26}" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
      `;
      break;

    case 'k-knife':
    case 'dr-knife':
    case 'rs-knife':
      body = `
        <path d="M${px + pw * 0.18},${py + ph * 0.78} L${px + pw * 0.45},${py + ph * 0.52}" stroke="#451A03" stroke-width="16" stroke-linecap="round"/>
        <path d="M${px + pw * 0.45},${py + ph * 0.52} L${px + pw * 0.86},${py + ph * 0.14} Q${px + pw * 0.92},${py + ph * 0.28} ${px + pw * 0.54},${py + ph * 0.62} Z" fill="#E2E8F0" stroke="#475569" stroke-width="4"/>
      `;
      break;

    case 'k-spoon':
    case 'dr-spoon':
    case 'cf-teaspoon':
      body = `
        <line x1="${px + pw * 0.22}" y1="${py + ph * 0.78}" x2="${px + pw * 0.62}" y2="${py + ph * 0.38}" stroke="#94A3B8" stroke-width="10" stroke-linecap="round"/>
        <ellipse cx="${px + pw * 0.72}" cy="${py + ph * 0.28}" rx="${pw * 0.16}" ry="${ph * 0.12}" transform="rotate(-40 ${px + pw * 0.72} ${py + ph * 0.28})" fill="#E2E8F0" stroke="#64748B" stroke-width="4"/>
      `;
      break;

    case 'k-fork':
    case 'dr-fork':
    case 'rs-fork':
      body = `
        <line x1="${px + pw * 0.22}" y1="${py + ph * 0.80}" x2="${px + pw * 0.60}" y2="${py + ph * 0.42}" stroke="#94A3B8" stroke-width="10" stroke-linecap="round"/>
        <path d="M${px + pw * 0.54},${py + ph * 0.46} L${px + pw * 0.66},${py + ph * 0.34} M${px + pw * 0.60},${py + ph * 0.38} L${px + pw * 0.78},${py + ph * 0.20} M${px + pw * 0.54},${py + ph * 0.34} L${px + pw * 0.72},${py + ph * 0.16} M${px + pw * 0.66},${py + ph * 0.44} L${px + pw * 0.84},${py + ph * 0.26}" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'dr-glass':
    case 'rs-glass':
      body = `
        <polygon points="${px + pw * 0.26},${py + ph * 0.16} ${px + pw * 0.74},${py + ph * 0.16} ${px + pw * 0.66},${py + ph * 0.86} ${px + pw * 0.34},${py + ph * 0.86}" fill="#E0F2FE" fill-opacity="0.78" stroke="#0284C7" stroke-width="4"/>
        <polygon points="${px + pw * 0.29},${py + ph * 0.38} ${px + pw * 0.71},${py + ph * 0.38} ${px + pw * 0.65},${py + ph * 0.83} ${px + pw * 0.35},${py + ph * 0.83}" fill="#38BDF8" fill-opacity="0.55"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.16}" rx="${pw * 0.24}" ry="${ph * 0.05}" fill="#F0F9FF" stroke="#0284C7" stroke-width="3"/>
      `;
      break;

    case 'dr-cup':
    case 'cf-cup':
    case 'cf-cup-coffee':
      body = `
        <ellipse cx="${cx}" cy="${py + ph * 0.82}" rx="${pw * 0.38}" ry="${ph * 0.09}" fill="#F1F5F9" stroke="#94A3B8" stroke-width="4"/>
        <path d="M${px + pw * 0.24},${py + ph * 0.30} H${px + pw * 0.72} V${py + ph * 0.62} Q${px + pw * 0.72},${py + ph * 0.80} ${px + pw * 0.48},${py + ph * 0.80} Q${px + pw * 0.24},${py + ph * 0.80} ${px + pw * 0.24},${py + ph * 0.62} Z" fill="#FFFFFF" stroke="#64748B" stroke-width="4"/>
        <path d="M${px + pw * 0.72},${py + ph * 0.38} Q${px + pw * 0.90},${py + ph * 0.38} ${px + pw * 0.90},${py + ph * 0.52} Q${px + pw * 0.90},${py + ph * 0.66} ${px + pw * 0.72},${py + ph * 0.66}" fill="none" stroke="#64748B" stroke-width="6"/>
        <ellipse cx="${px + pw * 0.48}" cy="${py + ph * 0.30}" rx="${pw * 0.24}" ry="${ph * 0.06}" fill="#78350F" stroke="#451A03" stroke-width="3"/>
      `;
      break;

    case 'dr-napkin':
      body = `
        <polygon points="${px + pw * 0.20},${py + ph * 0.76} ${px + pw * 0.50},${py + ph * 0.20} ${px + pw * 0.82},${py + ph * 0.76}" fill="#FEE2E2" stroke="#EF4444" stroke-width="4"/>
        <polygon points="${px + pw * 0.28},${py + ph * 0.76} ${px + pw * 0.50},${py + ph * 0.32} ${px + pw * 0.74},${py + ph * 0.76}" fill="#FECACA" stroke="#F87171" stroke-width="2"/>
      `;
      break;

    // ================= BEDROOM, LIVING ROOM, FURNITURE =================
    case 'bd-wardrobe':
      body = `
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.06}" width="${pw * 0.76}" height="${ph * 0.88}" rx="8" fill="#92400E" stroke="#451A03" stroke-width="5"/>
        <rect x="${px + pw * 0.17}" y="${py + ph * 0.11}" width="${pw * 0.31}" height="${ph * 0.78}" fill="#B45309" stroke="#78350F" stroke-width="3"/>
        <rect x="${px + pw * 0.52}" y="${py + ph * 0.11}" width="${pw * 0.31}" height="${ph * 0.78}" fill="#B45309" stroke="#78350F" stroke-width="3"/>
        <circle cx="${px + pw * 0.44}" cy="${cy}" r="6" fill="#FDE68A"/>
        <circle cx="${px + pw * 0.56}" cy="${cy}" r="6" fill="#FDE68A"/>
      `;
      break;

    case 'bd-mirror':
    case 'ba-mirror':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.36}" ry="${ph * 0.44}" fill="#93C5FD" stroke="#D97706" stroke-width="10"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.31}" ry="${ph * 0.39}" fill="#E0F2FE"/>
        <line x1="${cx - pw * 0.18}" y1="${cy - ph * 0.24}" x2="${cx + pw * 0.10}" y2="${cy - ph * 0.34}" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx - pw * 0.14}" y1="${cy + ph * 0.10}" x2="${cx + pw * 0.18}" y2="${cy - ph * 0.12}" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'bd-lamp':
    case 'lr-lamp':
    case 'lb-lamp':
      body = `
        <rect x="${cx - pw * 0.18}" y="${py + ph * 0.82}" width="${pw * 0.36}" height="${ph * 0.10}" rx="6" fill="#475569"/>
        <line x1="${cx}" y1="${py + ph * 0.42}" x2="${cx}" y2="${py + ph * 0.82}" stroke="#64748B" stroke-width="8"/>
        <polygon points="${px + pw * 0.26},${py + ph * 0.14} ${px + pw * 0.74},${py + ph * 0.14} ${px + pw * 0.86},${py + ph * 0.44} ${px + pw * 0.14},${py + ph * 0.44}" fill="#FEF08A" stroke="#CA8A04" stroke-width="4"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.46}" rx="${pw * 0.28}" ry="${ph * 0.08}" fill="#FDE047" opacity="0.6"/>
      `;
      break;

    case 'bd-bed':
    case 'hp-bed':
      body = `
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.18}" width="${pw * 0.12}" height="${ph * 0.68}" rx="6" fill="#78350F"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.46}" width="${pw * 0.76}" height="${ph * 0.28}" rx="10" fill="#FFFFFF" stroke="#94A3B8" stroke-width="4"/>
        <rect x="${px + pw * 0.36}" y="${py + ph * 0.48}" width="${pw * 0.56}" height="${ph * 0.26}" rx="10" fill="#3B82F6"/>
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.70}" width="${pw * 0.84}" height="${ph * 0.16}" rx="4" fill="#92400E"/>
      `;
      break;

    case 'bd-pillow':
      body = `
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.24}" width="${pw * 0.72}" height="${ph * 0.52}" rx="22" fill="#FFFFFF" stroke="#94A3B8" stroke-width="4"/>
        <path d="M${px + pw * 0.24},${py + ph * 0.38} Q${cx},${py + ph * 0.48} ${px + pw * 0.76},${py + ph * 0.38}" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      `;
      break;

    case 'bd-rug':
    case 'lr-rug':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.45}" ry="${ph * 0.34}" fill="#B91C1C" stroke="#FDE68A" stroke-width="6" stroke-dasharray="10,6"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.32}" ry="${ph * 0.22}" fill="#DC2626" stroke="#FEF08A" stroke-width="3"/>
      `;
      break;

    case 'lr-sofa':
      body = `
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.22}" width="${pw * 0.76}" height="${ph * 0.38}" rx="16" fill="#2563EB" stroke="#1E40AF" stroke-width="4"/>
        <rect x="${px + pw * 0.04}" y="${py + ph * 0.38}" width="${pw * 0.14}" height="${ph * 0.38}" rx="12" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
        <rect x="${px + pw * 0.82}" y="${py + ph * 0.38}" width="${pw * 0.14}" height="${ph * 0.38}" rx="12" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="4"/>
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.50}" width="${pw * 0.72}" height="${ph * 0.26}" rx="10" fill="#3B82F6" stroke="#1E40AF" stroke-width="4"/>
      `;
      break;

    case 'lr-bookshelf':
    case 'lb-shelf':
      body = `
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.08}" width="${pw * 0.76}" height="${ph * 0.84}" rx="6" fill="#78350F" stroke="#451A03" stroke-width="5"/>
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.14}" width="${pw * 0.64}" height="${ph * 0.22}" fill="#FEF3C7"/>
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.40}" width="${pw * 0.64}" height="${ph * 0.22}" fill="#FEF3C7"/>
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.66}" width="${pw * 0.64}" height="${ph * 0.20}" fill="#FEF3C7"/>
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.18}" width="${pw * 0.08}" height="${ph * 0.18}" fill="#EF4444"/>
        <rect x="${px + pw * 0.32}" y="${py + ph * 0.16}" width="${pw * 0.09}" height="${ph * 0.20}" fill="#2563EB"/>
        <rect x="${px + pw * 0.43}" y="${py + ph * 0.19}" width="${pw * 0.08}" height="${ph * 0.17}" fill="#10B981"/>
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.44}" width="${pw * 0.10}" height="${ph * 0.18}" fill="#F59E0B"/>
        <rect x="${px + pw * 0.36}" y="${py + ph * 0.42}" width="${pw * 0.09}" height="${ph * 0.20}" fill="#8B5CF6"/>
      `;
      break;

    case 'lr-window':
    case 'bd-window':
    case 'pt-window':
      body = `
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.10}" width="${pw * 0.76}" height="${ph * 0.80}" rx="8" fill="#BAE6FD" stroke="#475569" stroke-width="8"/>
        <line x1="${cx}" y1="${py + ph * 0.10}" x2="${cx}" y2="${py + ph * 0.90}" stroke="#475569" stroke-width="6"/>
        <line x1="${px + pw * 0.12}" y1="${cy}" x2="${px + pw * 0.88}" y2="${cy}" stroke="#475569" stroke-width="6"/>
      `;
      break;

    // ================= BATHROOM =================
    case 'ba-shower':
      body = `
        <path d="M${px + pw * 0.25},${py + ph * 0.85} V${py + ph * 0.18} Q${px + pw * 0.25},${py + ph * 0.08} ${px + pw * 0.52},${py + ph * 0.12}" fill="none" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="${px + pw * 0.56}" cy="${py + ph * 0.16}" rx="${pw * 0.18}" ry="${ph * 0.07}" fill="#94A3B8" stroke="#334155" stroke-width="4"/>
        <g stroke="#38BDF8" stroke-width="3" stroke-dasharray="6,6">
          <line x1="${px + pw * 0.46}" y1="${py + ph * 0.24}" x2="${px + pw * 0.40}" y2="${py + ph * 0.78}"/>
          <line x1="${px + pw * 0.56}" y1="${py + ph * 0.24}" x2="${px + pw * 0.56}" y2="${py + ph * 0.78}"/>
          <line x1="${px + pw * 0.66}" y1="${py + ph * 0.24}" x2="${px + pw * 0.72}" y2="${py + ph * 0.78}"/>
        </g>
      `;
      break;

    case 'ba-bathtub':
      body = `
        <path d="M${px + pw * 0.08},${py + ph * 0.36} H${px + pw * 0.92} V${py + ph * 0.64} Q${px + pw * 0.92},${py + ph * 0.86} ${px + pw * 0.68},${py + ph * 0.86} H${px + pw * 0.32} Q${px + pw * 0.08},${py + ph * 0.86} ${px + pw * 0.08},${py + ph * 0.64} Z" fill="#FFFFFF" stroke="#64748B" stroke-width="5"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.36}" rx="${pw * 0.42}" ry="${ph * 0.08}" fill="#BAE6FD" stroke="#64748B" stroke-width="4"/>
      `;
      break;

    case 'ba-towel':
    case 'gm-towel':
    case 'bn-towel':
      body = `
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.16}" width="${pw * 0.68}" height="${ph * 0.68}" rx="10" fill="#EF4444" stroke="#991B1B" stroke-width="4"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.28}" width="${pw * 0.68}" height="${ph * 0.12}" fill="#FFFFFF"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.52}" width="${pw * 0.68}" height="${ph * 0.12}" fill="#FFFFFF"/>
      `;
      break;

    case 'ba-sink':
    case 'k-sink':
      body = `
        <ellipse cx="${cx}" cy="${py + ph * 0.56}" rx="${pw * 0.40}" ry="${ph * 0.24}" fill="#FFFFFF" stroke="#64748B" stroke-width="5"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.56}" rx="${pw * 0.30}" ry="${ph * 0.16}" fill="#E0F2FE"/>
        <path d="M${cx},${py + ph * 0.32} V${py + ph * 0.16} Q${cx},${py + ph * 0.08} ${cx + pw * 0.14},${py + ph * 0.16}" fill="none" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
      `;
      break;

    case 'ba-faucet':
      body = `
        <path d="M${px + pw * 0.28},${py + ph * 0.78} V${py + ph * 0.32} Q${px + pw * 0.28},${py + ph * 0.14} ${px + pw * 0.56},${py + ph * 0.14} Q${px + pw * 0.74},${py + ph * 0.14} ${px + pw * 0.74},${py + ph * 0.38}" fill="none" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.74}" width="${pw * 0.28}" height="${ph * 0.12}" rx="4" fill="#334155"/>
        <circle cx="${px + pw * 0.74}" cy="${py + ph * 0.56}" r="8" fill="#38BDF8"/>
      `;
      break;

    case 'ba-soap':
      body = `
        <ellipse cx="${cx}" cy="${py + ph * 0.64}" rx="${pw * 0.38}" ry="${ph * 0.18}" fill="#CBD5E1" stroke="#64748B" stroke-width="3"/>
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.36}" width="${pw * 0.52}" height="${ph * 0.28}" rx="18" fill="#F472B6" stroke="#DB2777" stroke-width="4"/>
      `;
      break;

    case 'ba-toothbrush':
      body = `
        <line x1="${px + pw * 0.18}" y1="${py + ph * 0.78}" x2="${px + pw * 0.78}" y2="${py + ph * 0.22}" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
        <rect x="${px + pw * 0.64}" y="${py + ph * 0.14}" width="${pw * 0.20}" height="${ph * 0.12}" rx="3" transform="rotate(-43 ${px + pw * 0.74} ${py + ph * 0.20})" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
      `;
      break;

    case 'ba-toothpaste':
      body = `
        <polygon points="${px + pw * 0.16},${py + ph * 0.36} ${px + pw * 0.72},${py + ph * 0.44} ${px + pw * 0.72},${py + ph * 0.66} ${px + pw * 0.16},${py + ph * 0.74}" fill="#FFFFFF" stroke="#0284C7" stroke-width="4"/>
        <rect x="${px + pw * 0.32}" y="${py + ph * 0.46}" width="${pw * 0.26}" height="${ph * 0.18}" fill="#0284C7"/>
        <rect x="${px + pw * 0.72}" y="${py + ph * 0.48}" width="${pw * 0.12}" height="${ph * 0.14}" rx="3" fill="#0369A1"/>
      `;
      break;

    // ================= SUPERMARKET & FARMERS MARKET =================
    case 'sm-apple':
    case 'fm-apple':
      body = `
        <circle cx="${cx}" cy="${py + ph * 0.56}" r="${Math.min(pw, ph) * 0.34}" fill="#EF4444" stroke="#991B1B" stroke-width="4"/>
        <path d="M${cx},${py + ph * 0.24} Q${cx + 8},${py + ph * 0.10} ${cx + 18},${py + ph * 0.14}" fill="none" stroke="#451A03" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="${cx + 16}" cy="${py + ph * 0.18}" rx="12" ry="6" fill="#22C55E"/>
      `;
      break;

    case 'sm-banana':
      body = `
        <path d="M${px + pw * 0.20},${py + ph * 0.68} Q${px + pw * 0.48},${py + ph * 0.88} ${px + pw * 0.82},${py + ph * 0.24} Q${px + pw * 0.66},${py + ph * 0.64} ${px + pw * 0.20},${py + ph * 0.68} Z" fill="#FACC15" stroke="#CA8A04" stroke-width="5"/>
      `;
      break;

    case 'sm-milk':
      body = `
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.30}" width="${pw * 0.44}" height="${ph * 0.58}" rx="6" fill="#FFFFFF" stroke="#0284C7" stroke-width="4"/>
        <polygon points="${px + pw * 0.28},${py + ph * 0.30} ${cx},${py + ph * 0.14} ${px + pw * 0.72},${py + ph * 0.30}" fill="#BAE6FD" stroke="#0284C7" stroke-width="4"/>
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.48}" width="${pw * 0.44}" height="${ph * 0.20}" fill="#38BDF8"/>
      `;
      break;

    case 'sm-cheese':
      body = `
        <polygon points="${px + pw * 0.14},${py + ph * 0.68} ${px + pw * 0.84},${py + ph * 0.68} ${px + pw * 0.84},${py + ph * 0.34} ${px + pw * 0.48},${py + ph * 0.22}" fill="#FDE047" stroke="#CA8A04" stroke-width="4"/>
        <circle cx="${px + pw * 0.46}" cy="${py + ph * 0.52}" r="10" fill="#EAB308"/>
        <circle cx="${px + pw * 0.68}" cy="${py + ph * 0.56}" r="8" fill="#EAB308"/>
        <circle cx="${px + pw * 0.62}" cy="${py + ph * 0.40}" r="7" fill="#EAB308"/>
      `;
      break;

    case 'sm-bread':
      body = `
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.32}" width="${pw * 0.72}" height="${ph * 0.46}" rx="28" fill="#D97706" stroke="#78350F" stroke-width="4"/>
        <path d="M${px + pw * 0.32},${py + ph * 0.38} L${px + pw * 0.40},${py + ph * 0.54} M${px + pw * 0.48},${py + ph * 0.38} L${px + pw * 0.56},${py + ph * 0.54} M${px + pw * 0.64},${py + ph * 0.38} L${px + pw * 0.72},${py + ph * 0.54}" stroke="#FEF3C7" stroke-width="4" stroke-linecap="round"/>
      `;
      break;

    case 'sm-basket':
    case 'fm-basket':
      body = `
        <polygon points="${px + pw * 0.16},${py + ph * 0.42} ${px + pw * 0.84},${py + ph * 0.42} ${px + pw * 0.74},${py + ph * 0.84} ${px + pw * 0.26},${py + ph * 0.84}" fill="#D97706" stroke="#78350F" stroke-width="4"/>
        <path d="M${px + pw * 0.28},${py + ph * 0.42} Q${cx},${py + ph * 0.08} ${px + pw * 0.72},${py + ph * 0.42}" fill="none" stroke="#78350F" stroke-width="7"/>
      `;
      break;

    case 'sm-cart':
      body = `
        <polygon points="${px + pw * 0.22},${py + ph * 0.26} ${px + pw * 0.84},${py + ph * 0.30} ${px + pw * 0.76},${py + ph * 0.64} ${px + pw * 0.28},${py + ph * 0.64}" fill="none" stroke="#475569" stroke-width="5"/>
        <line x1="${px + pw * 0.12}" y1="${py + ph * 0.18}" x2="${px + pw * 0.28}" y2="${py + ph * 0.74}" stroke="#334155" stroke-width="6"/>
        <circle cx="${px + pw * 0.34}" cy="${py + ph * 0.82}" r="12" fill="#1E293B"/>
        <circle cx="${px + pw * 0.72}" cy="${py + ph * 0.82}" r="12" fill="#1E293B"/>
      `;
      break;

    case 'sm-checkout':
      body = `
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.48}" width="${pw * 0.64}" height="${ph * 0.36}" rx="6" fill="#334155" stroke="#0F172A" stroke-width="4"/>
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.18}" width="${pw * 0.44}" height="${ph * 0.28}" rx="4" fill="#38BDF8" stroke="#1E293B" stroke-width="4"/>
      `;
      break;

    case 'sm-bag':
      body = `
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.32}" width="${pw * 0.52}" height="${ph * 0.56}" rx="6" fill="#FDE68A" stroke="#B45309" stroke-width="4"/>
        <path d="M${px + pw * 0.36},${py + ph * 0.32} Q${cx},${py + ph * 0.12} ${px + pw * 0.64},${py + ph * 0.32}" fill="none" stroke="#B45309" stroke-width="5"/>
      `;
      break;

    case 'fm-tomato':
      body = `
        <circle cx="${cx}" cy="${py + ph * 0.56}" r="${Math.min(pw, ph) * 0.34}" fill="#DC2626" stroke="#7F1D1D" stroke-width="4"/>
        <path d="M${cx - 12},${py + ph * 0.24} L${cx},${py + ph * 0.30} L${cx + 12},${py + ph * 0.24} M${cx},${py + ph * 0.18} V${py + ph * 0.32}" stroke="#15803D" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'fm-cucumber':
      body = `
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.38}" width="${pw * 0.68}" height="${ph * 0.26}" rx="20" fill="#15803D" stroke="#14532D" stroke-width="4"/>
      `;
      break;

    case 'fm-carrot':
      body = `
        <polygon points="${px + pw * 0.24},${py + ph * 0.28} ${px + pw * 0.44},${py + ph * 0.22} ${px + pw * 0.78},${py + ph * 0.82}" fill="#F97316" stroke="#C2410C" stroke-width="4"/>
        <path d="M${px + pw * 0.32},${py + ph * 0.24} L${px + pw * 0.20},${py + ph * 0.10} M${px + pw * 0.36},${py + ph * 0.24} L${px + pw * 0.34},${py + ph * 0.08}" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'fm-potato':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.38}" ry="${ph * 0.28}" fill="#D97706" stroke="#78350F" stroke-width="4"/>
        <circle cx="${cx - 12}" cy="${cy - 6}" r="3" fill="#78350F"/>
        <circle cx="${cx + 14}" cy="${cy + 8}" r="3" fill="#78350F"/>
      `;
      break;

    case 'fm-pear':
      body = `
        <path d="M${cx},${py + ph * 0.20} Q${cx + pw * 0.16},${py + ph * 0.22} ${cx + pw * 0.20},${py + ph * 0.44} Q${cx + pw * 0.34},${py + ph * 0.76} ${cx},${py + ph * 0.82} Q${cx - pw * 0.34},${py + ph * 0.76} ${cx - pw * 0.20},${py + ph * 0.44} Q${cx - pw * 0.16},${py + ph * 0.22} ${cx},${py + ph * 0.20} Z" fill="#A3E635" stroke="#4D7C0F" stroke-width="4"/>
      `;
      break;

    case 'fm-flowers':
    case 'pk-flower':
      body = `
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${py + ph * 0.88}" stroke="#16A34A" stroke-width="6"/>
        <circle cx="${cx - 14}" cy="${cy - 10}" r="14" fill="#F43F5E"/>
        <circle cx="${cx + 14}" cy="${cy - 10}" r="14" fill="#F43F5E"/>
        <circle cx="${cx - 14}" cy="${cy + 10}" r="14" fill="#F43F5E"/>
        <circle cx="${cx + 14}" cy="${cy + 10}" r="14" fill="#F43F5E"/>
        <circle cx="${cx}" cy="${cy}" r="12" fill="#FACC15"/>
      `;
      break;

    // ================= PEOPLE (TEACHER, STUDENT, DOCTOR, NURSE, WAITER, BARISTA, SELLER, PASSENGER, PEDESTRIAN, READER, CHILD) =================
    case 'fm-seller':
    case 'cf-barista':
    case 'rs-waiter':
    case 'cl-teacher':
    case 'cl-student':
    case 'lb-reader':
    case 'pg-child':
    case 'cs-pedestrian':
    case 'at-passenger':
    case 'hp-doctor':
    case 'hp-nurse': {
      const shirtColor =
        vocabId === 'hp-doctor'
          ? '#F8FAFC'
          : vocabId === 'hp-nurse'
          ? '#0284C7'
          : vocabId === 'cf-barista' || vocabId === 'fm-seller'
          ? '#15803D'
          : vocabId === 'rs-waiter'
          ? '#1E293B'
          : vocabId === 'cl-teacher'
          ? '#1D4ED8'
          : vocabId === 'cl-student'
          ? '#EA580C'
          : '#7C3AED';
      const hairColor =
        vocabId === 'cl-teacher' || vocabId === 'rs-waiter' || vocabId === 'hp-doctor'
          ? '#334155'
          : vocabId === 'hp-nurse' || vocabId === 'cf-barista'
          ? '#78350F'
          : '#92400E';
      const headR = Math.min(pw, ph) * 0.16;
      const headY = py + ph * 0.27;
      const roleAccessory =
        vocabId === 'cl-teacher'
          ? `<line x1="${px + pw * 0.72}" y1="${py + ph * 0.62}" x2="${px + pw * 0.92}" y2="${py + ph * 0.22}" stroke="#92400E" stroke-width="5" stroke-linecap="round"/>`
          : vocabId === 'hp-doctor' || vocabId === 'hp-nurse'
          ? `<path d="M${cx - 8},${py + ph * 0.58} H${cx + 8} M${cx},${py + ph * 0.50} V${py + ph * 0.66}" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>`
          : vocabId === 'cf-barista' || vocabId === 'fm-seller'
          ? `<rect x="${px + pw * 0.34}" y="${py + ph * 0.50}" width="${pw * 0.32}" height="${ph * 0.34}" rx="4" fill="#FEF3C7" stroke="#B45309" stroke-width="2"/>`
          : vocabId === 'rs-waiter'
          ? `<polygon points="${cx - 10},${py + ph * 0.46} ${cx + 10},${py + ph * 0.52} ${cx + 10},${py + ph * 0.46} ${cx - 10},${py + ph * 0.52}" fill="#DC2626"/>`
          : '';
      body = `
        <path d="M${px + pw * 0.24},${py + ph * 0.88} V${py + ph * 0.52} Q${px + pw * 0.24},${py + ph * 0.41} ${cx},${py + ph * 0.41} Q${px + pw * 0.76},${py + ph * 0.41} ${px + pw * 0.76},${py + ph * 0.52} V${py + ph * 0.88} Z" fill="${shirtColor}" stroke="#1E293B" stroke-width="4"/>
        <circle cx="${cx}" cy="${headY}" r="${headR}" fill="#FDBA74" stroke="#9A3412" stroke-width="3.5"/>
        <path d="M${cx - headR},${headY - 2} A${headR},${headR} 0 0,1 ${cx + headR},${headY - 2} Q${cx},${headY - headR * 0.6} ${cx - headR},${headY - 2} Z" fill="${hairColor}"/>
        <circle cx="${cx - headR * 0.35}" cy="${headY + 2}" r="3" fill="#1E293B"/>
        <circle cx="${cx + headR * 0.35}" cy="${headY + 2}" r="3" fill="#1E293B"/>
        <path d="M${cx - headR * 0.32},${headY + headR * 0.42} Q${cx},${headY + headR * 0.62} ${cx + headR * 0.32},${headY + headR * 0.42}" fill="none" stroke="#9A3412" stroke-width="2.5" stroke-linecap="round"/>
        ${roleAccessory}
      `;
      break;
    }

    // ================= CAFE & RESTAURANT =================
    case 'cf-coffee':
      body = `
        <rect x="${px + pw * 0.26}" y="${py + ph * 0.24}" width="${pw * 0.48}" height="${ph * 0.62}" rx="8" fill="#78350F" stroke="#451A03" stroke-width="4"/>
        <ellipse cx="${cx}" cy="${py + ph * 0.54}" rx="${pw * 0.14}" ry="${ph * 0.10}" fill="#FDE68A"/>
      `;
      break;

    case 'cf-pastry':
      body = `
        <path d="M${px + pw * 0.18},${py + ph * 0.68} Q${cx},${py + ph * 0.22} ${px + pw * 0.82},${py + ph * 0.68} Q${cx},${py + ph * 0.52} ${px + pw * 0.18},${py + ph * 0.68} Z" fill="#F59E0B" stroke="#B45309" stroke-width="4"/>
      `;
      break;

    case 'cf-menu':
    case 'rs-menu':
    case 'rs-bill':
      body = `
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.14}" width="${pw * 0.52}" height="${ph * 0.72}" rx="6" fill="#1E293B" stroke="#F59E0B" stroke-width="4"/>
        <line x1="${px + pw * 0.34}" y1="${py + ph * 0.32}" x2="${px + pw * 0.66}" y2="${py + ph * 0.32}" stroke="#FDE68A" stroke-width="4"/>
        <line x1="${px + pw * 0.34}" y1="${py + ph * 0.46}" x2="${px + pw * 0.66}" y2="${py + ph * 0.46}" stroke="#FDE68A" stroke-width="4"/>
        <line x1="${px + pw * 0.34}" y1="${py + ph * 0.60}" x2="${px + pw * 0.58}" y2="${py + ph * 0.60}" stroke="#FDE68A" stroke-width="4"/>
      `;
      break;

    case 'rs-food':
    case 'rs-dish':
      body = `
        <ellipse cx="${cx}" cy="${py + ph * 0.62}" rx="${pw * 0.42}" ry="${ph * 0.24}" fill="#FFFFFF" stroke="#64748B" stroke-width="4"/>
        <path d="M${px + pw * 0.22},${py + ph * 0.60} Q${cx},${py + ph * 0.18} ${px + pw * 0.78},${py + ph * 0.60} Z" fill="#F59E0B" stroke="#B45309" stroke-width="4"/>
      `;
      break;

    // ================= CLASSROOM, LIBRARY & OFFICE =================
    case 'cl-board':
    case 'at-board':
      body = `
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.14}" width="${pw * 0.84}" height="${ph * 0.68}" rx="8" fill="${vocabId === 'at-board' ? '#0F172A' : '#14532D'}" stroke="#92400E" stroke-width="8"/>
        <line x1="${px + pw * 0.20}" y1="${py + ph * 0.34}" x2="${px + pw * 0.76}" y2="${py + ph * 0.34}" stroke="#FEF08A" stroke-width="4"/>
        <line x1="${px + pw * 0.20}" y1="${py + ph * 0.50}" x2="${px + pw * 0.68}" y2="${py + ph * 0.50}" stroke="#FEF08A" stroke-width="4"/>
      `;
      break;

    case 'cl-book':
    case 'lb-book':
      body = `
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.20}" width="${pw * 0.64}" height="${ph * 0.62}" rx="6" fill="#2563EB" stroke="#1E3A8A" stroke-width="4"/>
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.24}" width="${pw * 0.54}" height="${ph * 0.54}" fill="#FFFFFF"/>
        <line x1="${cx}" y1="${py + ph * 0.24}" x2="${cx}" y2="${py + ph * 0.78}" stroke="#94A3B8" stroke-width="3"/>
      `;
      break;

    case 'cl-notebook':
    case 'lb-notebook':
      body = `
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.16}" width="${pw * 0.56}" height="${ph * 0.68}" rx="4" fill="#FDE047" stroke="#CA8A04" stroke-width="4"/>
        <line x1="${px + pw * 0.30}" y1="${py + ph * 0.16}" x2="${px + pw * 0.30}" y2="${py + ph * 0.84}" stroke="#CA8A04" stroke-width="3"/>
      `;
      break;

    case 'cl-pen':
      body = `
        <line x1="${px + pw * 0.22}" y1="${py + ph * 0.78}" x2="${px + pw * 0.78}" y2="${py + ph * 0.22}" stroke="#1D4ED8" stroke-width="12" stroke-linecap="round"/>
      `;
      break;

    case 'cl-pencil':
      body = `
        <line x1="${px + pw * 0.22}" y1="${py + ph * 0.78}" x2="${px + pw * 0.78}" y2="${py + ph * 0.22}" stroke="#F59E0B" stroke-width="12" stroke-linecap="round"/>
      `;
      break;

    case 'cl-backpack':
      body = `
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.24}" width="${pw * 0.56}" height="${ph * 0.64}" rx="18" fill="#DC2626" stroke="#7F1D1D" stroke-width="4"/>
        <rect x="${px + pw * 0.30}" y="${py + ph * 0.52}" width="${pw * 0.40}" height="${ph * 0.26}" rx="8" fill="#EF4444" stroke="#7F1D1D" stroke-width="3"/>
      `;
      break;

    case 'of-laptop':
      body = `
        <rect x="${px + pw * 0.20}" y="${py + ph * 0.18}" width="${pw * 0.60}" height="${ph * 0.46}" rx="6" fill="#1E293B" stroke="#475569" stroke-width="4"/>
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.22}" width="${pw * 0.52}" height="${ph * 0.38}" fill="#38BDF8"/>
        <polygon points="${px + pw * 0.12},${py + ph * 0.64} ${px + pw * 0.88},${py + ph * 0.64} ${px + pw * 0.94},${py + ph * 0.78} ${px + pw * 0.06},${py + ph * 0.78}" fill="#94A3B8" stroke="#475569" stroke-width="4"/>
      `;
      break;

    case 'of-monitor':
      body = `
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.14}" width="${pw * 0.76}" height="${ph * 0.54}" rx="6" fill="#0F172A" stroke="#334155" stroke-width="5"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.18}" width="${pw * 0.68}" height="${ph * 0.46}" fill="#0284C7"/>
        <rect x="${cx - pw * 0.06}" y="${py + ph * 0.68}" width="${pw * 0.12}" height="${ph * 0.14}" fill="#475569"/>
        <rect x="${cx - pw * 0.22}" y="${py + ph * 0.82}" width="${pw * 0.44}" height="${ph * 0.06}" rx="3" fill="#334155"/>
      `;
      break;

    case 'of-phone':
      body = `
        <rect x="${px + pw * 0.30}" y="${py + ph * 0.14}" width="${pw * 0.40}" height="${ph * 0.72}" rx="12" fill="#0F172A" stroke="#475569" stroke-width="4"/>
        <rect x="${px + pw * 0.34}" y="${py + ph * 0.20}" width="${pw * 0.32}" height="${ph * 0.56}" rx="4" fill="#38BDF8"/>
      `;
      break;

    case 'of-printer':
      body = `
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.14}" width="${pw * 0.44}" height="${ph * 0.24}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.34}" width="${pw * 0.72}" height="${ph * 0.42}" rx="8" fill="#E2E8F0" stroke="#475569" stroke-width="4"/>
        <rect x="${px + pw * 0.26}" y="${py + ph * 0.64}" width="${pw * 0.48}" height="${ph * 0.22}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
      `;
      break;

    // ================= GYM & FITNESS =================
    case 'gm-dumbbell':
      body = `
        <line x1="${px + pw * 0.22}" y1="${cy}" x2="${px + pw * 0.78}" y2="${cy}" stroke="#64748B" stroke-width="10"/>
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.24}" width="${pw * 0.14}" height="${ph * 0.52}" rx="6" fill="#1E293B"/>
        <rect x="${px + pw * 0.72}" y="${py + ph * 0.24}" width="${pw * 0.14}" height="${ph * 0.52}" rx="6" fill="#1E293B"/>
      `;
      break;

    case 'gm-barbell':
      body = `
        <line x1="${px + pw * 0.06}" y1="${cy}" x2="${px + pw * 0.94}" y2="${cy}" stroke="#475569" stroke-width="8"/>
        <rect x="${px + pw * 0.12}" y="${py + ph * 0.16}" width="${pw * 0.10}" height="${ph * 0.68}" rx="4" fill="#0F172A"/>
        <rect x="${px + pw * 0.78}" y="${py + ph * 0.16}" width="${pw * 0.10}" height="${ph * 0.68}" rx="4" fill="#0F172A"/>
      `;
      break;

    case 'gm-treadmill':
      body = `
        <polygon points="${px + pw * 0.12},${py + ph * 0.76} ${px + pw * 0.88},${py + ph * 0.68} ${px + pw * 0.88},${py + ph * 0.84} ${px + pw * 0.12},${py + ph * 0.88}" fill="#1E293B"/>
        <line x1="${px + pw * 0.76}" y1="${py + ph * 0.72}" x2="${px + pw * 0.68}" y2="${py + ph * 0.20}" stroke="#475569" stroke-width="10"/>
        <rect x="${px + pw * 0.54}" y="${py + ph * 0.12}" width="${pw * 0.28}" height="${ph * 0.16}" rx="4" fill="#0F172A"/>
      `;
      break;

    case 'gm-mat':
      body = `
        <polygon points="${px + pw * 0.10},${py + ph * 0.68} ${px + pw * 0.76},${py + ph * 0.42} ${px + pw * 0.92},${py + ph * 0.64} ${px + pw * 0.26},${py + ph * 0.88}" fill="#8B5CF6" stroke="#5B21B6" stroke-width="4"/>
      `;
      break;

    case 'gm-bottle':
      body = `
        <rect x="${px + pw * 0.32}" y="${py + ph * 0.26}" width="${pw * 0.36}" height="${ph * 0.62}" rx="10" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
        <rect x="${px + pw * 0.40}" y="${py + ph * 0.12}" width="${pw * 0.20}" height="${ph * 0.14}" rx="4" fill="#1E293B"/>
      `;
      break;

    // ================= PARK, PLAYGROUND & BEACH NATURE =================
    case 'pk-tree':
    case 'pg-tree':
    case 'bn-tree':
      body = `
        <rect x="${cx - pw * 0.08}" y="${py + ph * 0.48}" width="${pw * 0.16}" height="${ph * 0.44}" rx="4" fill="#78350F"/>
        <circle cx="${cx}" cy="${py + ph * 0.34}" r="${Math.min(pw, ph) * 0.28}" fill="#16A34A" stroke="#14532D" stroke-width="4"/>
        <circle cx="${cx - pw * 0.16}" cy="${py + ph * 0.42}" r="${Math.min(pw, ph) * 0.20}" fill="#22C55E"/>
        <circle cx="${cx + pw * 0.16}" cy="${py + ph * 0.42}" r="${Math.min(pw, ph) * 0.20}" fill="#15803D"/>
      `;
      break;

    case 'pk-bird':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.26}" ry="${ph * 0.18}" fill="#0284C7" stroke="#0369A1" stroke-width="4"/>
        <circle cx="${cx + pw * 0.20}" cy="${cy - ph * 0.10}" r="${Math.min(pw, ph) * 0.12}" fill="#0284C7"/>
        <polygon points="${cx + pw * 0.30},${cy - ph * 0.12} ${cx + pw * 0.44},${cy - ph * 0.08} ${cx + pw * 0.30},${cy - ph * 0.04}" fill="#F59E0B"/>
      `;
      break;

    case 'pg-slide':
      body = `
        <line x1="${px + pw * 0.20}" y1="${py + ph * 0.86}" x2="${px + pw * 0.28}" y2="${py + ph * 0.20}" stroke="#475569" stroke-width="8"/>
        <path d="M${px + pw * 0.28},${py + ph * 0.20} Q${px + pw * 0.56},${py + ph * 0.54} ${px + pw * 0.88},${py + ph * 0.84}" fill="none" stroke="#FACC15" stroke-width="18" stroke-linecap="round"/>
      `;
      break;

    case 'pg-swing':
      body = `
        <line x1="${px + pw * 0.16}" y1="${py + ph * 0.14}" x2="${px + pw * 0.84}" y2="${py + ph * 0.14}" stroke="#475569" stroke-width="8"/>
        <line x1="${px + pw * 0.36}" y1="${py + ph * 0.14}" x2="${px + pw * 0.36}" y2="${py + ph * 0.68}" stroke="#64748B" stroke-width="4"/>
        <line x1="${px + pw * 0.64}" y1="${py + ph * 0.14}" x2="${px + pw * 0.64}" y2="${py + ph * 0.68}" stroke="#64748B" stroke-width="4"/>
        <rect x="${px + pw * 0.30}" y="${py + ph * 0.68}" width="${pw * 0.40}" height="${ph * 0.08}" rx="4" fill="#EF4444"/>
      `;
      break;

    case 'pg-ball':
      body = `
        <circle cx="${cx}" cy="${cy}" r="${Math.min(pw, ph) * 0.36}" fill="#EF4444" stroke="#991B1B" stroke-width="4"/>
        <path d="M${cx - r * 0.6},${cy} Q${cx},${cy - r * 0.5} ${cx + r * 0.6},${cy}" fill="none" stroke="#FACC15" stroke-width="6"/>
      `;
      break;

    case 'bn-sun':
      body = `
        <circle cx="${cx}" cy="${cy}" r="${Math.min(pw, ph) * 0.34}" fill="#FACC15" stroke="#F59E0B" stroke-width="6"/>
      `;
      break;

    case 'bn-mountain':
      body = `
        <polygon points="${px + pw * 0.06},${py + ph * 0.88} ${px + pw * 0.42},${py + ph * 0.14} ${px + pw * 0.76},${py + ph * 0.88}" fill="#64748B" stroke="#334155" stroke-width="4"/>
        <polygon points="${px + pw * 0.36},${py + ph * 0.88} ${px + pw * 0.68},${py + ph * 0.24} ${px + pw * 0.94},${py + ph * 0.88}" fill="#475569" stroke="#1E293B" stroke-width="4"/>
      `;
      break;

    case 'bn-sea':
    case 'bn-lake':
    case 'bn-wave':
      body = `
        <rect x="${px + pw * 0.06}" y="${py + ph * 0.24}" width="${pw * 0.88}" height="${ph * 0.56}" rx="14" fill="#0284C7" stroke="#0369A1" stroke-width="4"/>
        <path d="M${px + pw * 0.14},${cy} Q${px + pw * 0.34},${cy - 14} ${cx},${cy} T${px + pw * 0.86},${cy}" fill="none" stroke="#E0F2FE" stroke-width="6" stroke-linecap="round"/>
      `;
      break;

    // ================= STREET, TRANSIT, AIRPORT & CLINIC =================
    case 'cs-car':
    case 'pt-bus':
    case 'pt-tram':
    case 'at-train': {
      const vehColor =
        vocabId === 'pt-bus'
          ? '#FACC15'
          : vocabId === 'pt-tram'
          ? '#EF4444'
          : vocabId === 'at-train'
          ? '#2563EB'
          : '#3B82F6';
      body = `
        <rect x="${px + pw * 0.10}" y="${py + ph * 0.28}" width="${pw * 0.80}" height="${ph * 0.46}" rx="14" fill="${vehColor}" stroke="#1E293B" stroke-width="4"/>
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.34}" width="${pw * 0.26}" height="${ph * 0.20}" rx="4" fill="#E0F2FE"/>
        <rect x="${px + pw * 0.52}" y="${py + ph * 0.34}" width="${pw * 0.26}" height="${ph * 0.20}" rx="4" fill="#E0F2FE"/>
        <circle cx="${px + pw * 0.28}" cy="${py + ph * 0.76}" r="14" fill="#0F172A"/>
        <circle cx="${px + pw * 0.72}" cy="${py + ph * 0.76}" r="14" fill="#0F172A"/>
      `;
      break;
    }

    case 'cs-bicycle':
      body = `
        <circle cx="${px + pw * 0.26}" cy="${py + ph * 0.68}" r="${Math.min(pw, ph) * 0.20}" fill="none" stroke="#1E293B" stroke-width="6"/>
        <circle cx="${px + pw * 0.74}" cy="${py + ph * 0.68}" r="${Math.min(pw, ph) * 0.20}" fill="none" stroke="#1E293B" stroke-width="6"/>
        <polyline points="${px + pw * 0.26},${py + ph * 0.68} ${px + pw * 0.46},${py + ph * 0.38} ${px + pw * 0.70},${py + ph * 0.38} ${px + pw * 0.74},${py + ph * 0.68}" fill="none" stroke="#EF4444" stroke-width="6"/>
      `;
      break;

    case 'cs-light':
      body = `
        <rect x="${cx - pw * 0.18}" y="${py + ph * 0.12}" width="${pw * 0.36}" height="${ph * 0.68}" rx="10" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
        <circle cx="${cx}" cy="${py + ph * 0.26}" r="10" fill="#EF4444"/>
        <circle cx="${cx}" cy="${py + ph * 0.46}" r="10" fill="#FACC15"/>
        <circle cx="${cx}" cy="${py + ph * 0.66}" r="10" fill="#22C55E"/>
      `;
      break;

    case 'at-airplane':
      body = `
        <ellipse cx="${cx}" cy="${cy}" rx="${pw * 0.42}" ry="${ph * 0.14}" fill="#FFFFFF" stroke="#0284C7" stroke-width="4"/>
        <polygon points="${cx - pw * 0.08},${cy} ${cx - pw * 0.24},${py + ph * 0.14} ${cx + pw * 0.10},${cy}" fill="#38BDF8"/>
        <polygon points="${cx - pw * 0.36},${cy} ${cx - pw * 0.44},${py + ph * 0.22} ${cx - pw * 0.26},${cy}" fill="#0284C7"/>
      `;
      break;

    case 'at-suitcase':
    case 'at-luggage':
      body = `
        <rect x="${px + pw * 0.24}" y="${py + ph * 0.28}" width="${pw * 0.52}" height="${ph * 0.58}" rx="10" fill="#2563EB" stroke="#1E3A8A" stroke-width="4"/>
        <path d="M${px + pw * 0.38},${py + ph * 0.28} V${py + ph * 0.14} H${px + pw * 0.62} V${py + ph * 0.28}" fill="none" stroke="#334155" stroke-width="6"/>
      `;
      break;

    case 'hp-thermometer':
      body = `
        <rect x="${cx - 10}" y="${py + ph * 0.14}" width="20" height="${ph * 0.62}" rx="10" fill="#FFFFFF" stroke="#475569" stroke-width="4"/>
        <circle cx="${cx}" cy="${py + ph * 0.76}" r="18" fill="#EF4444" stroke="#475569" stroke-width="4"/>
        <line x1="${cx}" y1="${py + ph * 0.34}" x2="${cx}" y2="${py + ph * 0.72}" stroke="#EF4444" stroke-width="8"/>
      `;
      break;

    case 'hp-medicine':
    case 'hp-bandage':
    case 'hp-pharmacy':
      body = `
        <rect x="${px + pw * 0.20}" y="${py + ph * 0.22}" width="${pw * 0.60}" height="${ph * 0.58}" rx="10" fill="#FFFFFF" stroke="#16A34A" stroke-width="5"/>
        <path d="M${cx},${py + ph * 0.34} V${py + ph * 0.68} M${cx - pw * 0.16},${cy} H${cx + pw * 0.16}" stroke="#16A34A" stroke-width="12" stroke-linecap="round"/>
      `;
      break;

    case 'hp-stethoscope':
      body = `
        <path d="M${px + pw * 0.28},${py + ph * 0.18} V${py + ph * 0.46} Q${px + pw * 0.28},${py + ph * 0.70} ${cx},${py + ph * 0.70} Q${px + pw * 0.72},${py + ph * 0.70} ${px + pw * 0.72},${py + ph * 0.46} V${py + ph * 0.18}" fill="none" stroke="#334155" stroke-width="7"/>
        <circle cx="${cx}" cy="${py + ph * 0.80}" r="14" fill="#94A3B8" stroke="#1E293B" stroke-width="4"/>
      `;
      break;

    case 'k-table':
    case 'lr-table':
    case 'dr-table':
    case 'cf-table':
    case 'cl-desk':
    case 'of-desk':
    case 'lb-table':
      body = `
        <polygon points="${px + pw * 0.08},${py + ph * 0.42} ${px + pw * 0.92},${py + ph * 0.42} ${px + pw * 0.84},${py + ph * 0.28} ${px + pw * 0.16},${py + ph * 0.28}" fill="#B45309" stroke="#78350F" stroke-width="4"/>
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.42}" width="${pw * 0.84}" height="${ph * 0.09}" fill="#92400E" stroke="#451A03" stroke-width="3"/>
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.51}" width="${pw * 0.08}" height="${ph * 0.38}" fill="#78350F"/>
        <rect x="${px + pw * 0.76}" y="${py + ph * 0.51}" width="${pw * 0.08}" height="${ph * 0.38}" fill="#78350F"/>
      `;
      break;

    case 'k-chair':
    case 'dr-chair':
    case 'cf-chair':
    case 'lb-chair':
    case 'of-chair':
    case 'lr-armchair':
    case 'pt-seat':
      body = `
        <rect x="${px + pw * 0.26}" y="${py + ph * 0.14}" width="${pw * 0.48}" height="${ph * 0.38}" rx="8" fill="#D97706" stroke="#78350F" stroke-width="4"/>
        <rect x="${px + pw * 0.20}" y="${py + ph * 0.48}" width="${pw * 0.60}" height="${ph * 0.12}" rx="6" fill="#B45309" stroke="#78350F" stroke-width="4"/>
        <rect x="${px + pw * 0.26}" y="${py + ph * 0.60}" width="${pw * 0.08}" height="${ph * 0.28}" fill="#78350F"/>
        <rect x="${px + pw * 0.66}" y="${py + ph * 0.60}" width="${pw * 0.08}" height="${ph * 0.28}" fill="#78350F"/>
      `;
      break;

    case 'gm-bench':
    case 'pk-bench':
    case 'pg-bench':
      body = `
        <rect x="${px + pw * 0.10}" y="${py + ph * 0.32}" width="${pw * 0.80}" height="${ph * 0.16}" rx="4" fill="#B45309" stroke="#78350F" stroke-width="4"/>
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.52}" width="${pw * 0.84}" height="${ph * 0.12}" rx="4" fill="#92400E" stroke="#451A03" stroke-width="4"/>
        <rect x="${px + pw * 0.18}" y="${py + ph * 0.64}" width="${pw * 0.08}" height="${ph * 0.24}" fill="#334155"/>
        <rect x="${px + pw * 0.74}" y="${py + ph * 0.64}" width="${pw * 0.08}" height="${ph * 0.24}" fill="#334155"/>
      `;
      break;

    case 'gm-machine':
      body = `
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.12}" width="${pw * 0.56}" height="${ph * 0.76}" rx="8" fill="#334155" stroke="#0F172A" stroke-width="5"/>
        <rect x="${px + pw * 0.32}" y="${py + ph * 0.22}" width="${pw * 0.36}" height="${ph * 0.42}" fill="#1E293B"/>
        <line x1="${px + pw * 0.28}" y1="${py + ph * 0.34}" x2="${px + pw * 0.72}" y2="${py + ph * 0.34}" stroke="#38BDF8" stroke-width="6"/>
      `;
      break;

    case 'lb-library':
      body = `
        <rect x="${px + pw * 0.10}" y="${py + ph * 0.12}" width="${pw * 0.80}" height="${ph * 0.76}" rx="10" fill="#FEF3C7" stroke="#92400E" stroke-width="5"/>
        <path d="M${px + pw * 0.22},${py + ph * 0.88} V${py + ph * 0.36} A${pw * 0.28},${ph * 0.24} 0 0,1 ${px + pw * 0.78},${py + ph * 0.36} V${py + ph * 0.88}" fill="#BAE6FD" stroke="#78350F" stroke-width="4"/>
      `;
      break;

    case 'pk-grass':
      body = `
        <rect x="${px + pw * 0.08}" y="${py + ph * 0.42}" width="${pw * 0.84}" height="${ph * 0.44}" rx="14" fill="#22C55E" stroke="#15803D" stroke-width="4"/>
        <path d="M${px + pw * 0.24},${py + ph * 0.64} L${px + pw * 0.20},${py + ph * 0.32} M${px + pw * 0.50},${py + ph * 0.64} L${px + pw * 0.52},${py + ph * 0.28} M${px + pw * 0.74},${py + ph * 0.64} L${px + pw * 0.78},${py + ph * 0.32}" stroke="#14532D" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'pk-path':
    case 'cs-road':
    case 'cs-sidewalk':
    case 'at-platform':
      body = `
        <polygon points="${px + pw * 0.26},${py + ph * 0.18} ${px + pw * 0.74},${py + ph * 0.18} ${px + pw * 0.92},${py + ph * 0.86} ${px + pw * 0.08},${py + ph * 0.86}" fill="${vocabId === 'cs-road' ? '#475569' : '#CBD5E1'}" stroke="#334155" stroke-width="4"/>
        <line x1="${cx}" y1="${py + ph * 0.24}" x2="${cx}" y2="${py + ph * 0.80}" stroke="#FACC15" stroke-width="5" stroke-dasharray="12,10"/>
      `;
      break;

    case 'pk-bush':
    case 'pk-leaves':
      body = `
        <circle cx="${cx - pw * 0.16}" cy="${cy + ph * 0.06}" r="${Math.min(pw, ph) * 0.22}" fill="#16A34A"/>
        <circle cx="${cx + pw * 0.16}" cy="${cy + ph * 0.06}" r="${Math.min(pw, ph) * 0.22}" fill="#15803D"/>
        <circle cx="${cx}" cy="${cy - ph * 0.06}" r="${Math.min(pw, ph) * 0.26}" fill="#22C55E" stroke="#14532D" stroke-width="4"/>
      `;
      break;

    case 'pg-sandbox':
    case 'bn-sand':
    case 'bn-beach':
      body = `
        <polygon points="${px + pw * 0.10},${py + ph * 0.44} ${px + pw * 0.90},${py + ph * 0.44} ${px + pw * 0.82},${py + ph * 0.84} ${px + pw * 0.18},${py + ph * 0.84}" fill="#FDE047" stroke="#CA8A04" stroke-width="5"/>
        <path d="M${px + pw * 0.26},${py + ph * 0.56} Q${cx},${py + ph * 0.22} ${px + pw * 0.74},${py + ph * 0.56} Z" fill="#FACC15" stroke="#D97706" stroke-width="3"/>
      `;
      break;

    case 'cs-building':
      body = `
        <rect x="${px + pw * 0.20}" y="${py + ph * 0.10}" width="${pw * 0.60}" height="${ph * 0.78}" rx="4" fill="#94A3B8" stroke="#334155" stroke-width="4"/>
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.20}" width="${pw * 0.16}" height="${ph * 0.16}" fill="#FEF08A"/>
        <rect x="${px + pw * 0.56}" y="${py + ph * 0.20}" width="${pw * 0.16}" height="${ph * 0.16}" fill="#FEF08A"/>
        <rect x="${px + pw * 0.28}" y="${py + ph * 0.44}" width="${pw * 0.16}" height="${ph * 0.16}" fill="#E0F2FE"/>
        <rect x="${px + pw * 0.56}" y="${py + ph * 0.44}" width="${pw * 0.16}" height="${ph * 0.16}" fill="#E0F2FE"/>
      `;
      break;

    case 'cs-sign':
    case 'pt-stop':
    case 'pt-metro':
      body = `
        <line x1="${cx}" y1="${py + ph * 0.36}" x2="${cx}" y2="${py + ph * 0.88}" stroke="#475569" stroke-width="8"/>
        <circle cx="${cx}" cy="${py + ph * 0.32}" r="${Math.min(pw, ph) * 0.24}" fill="#2563EB" stroke="#FFFFFF" stroke-width="5"/>
        <path d="M${cx - 14},${py + ph * 0.38} L${cx},${py + ph * 0.22} L${cx + 14},${py + ph * 0.38}" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      `;
      break;

    case 'pt-doors':
      body = `
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.12}" width="${pw * 0.68}" height="${ph * 0.76}" rx="6" fill="#CBD5E1" stroke="#334155" stroke-width="5"/>
        <line x1="${cx}" y1="${py + ph * 0.12}" x2="${cx}" y2="${py + ph * 0.88}" stroke="#1E293B" stroke-width="4"/>
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.20}" width="${pw * 0.22}" height="${ph * 0.36}" fill="#BAE6FD"/>
        <rect x="${px + pw * 0.56}" y="${py + ph * 0.20}" width="${pw * 0.22}" height="${ph * 0.36}" fill="#BAE6FD"/>
      `;
      break;

    case 'pt-ticket':
    case 'at-ticket':
      body = `
        <rect x="${px + pw * 0.16}" y="${py + ph * 0.28}" width="${pw * 0.68}" height="${ph * 0.44}" rx="8" fill="#FEF08A" stroke="#CA8A04" stroke-width="4"/>
        <line x1="${px + pw * 0.62}" y1="${py + ph * 0.28}" x2="${px + pw * 0.62}" y2="${py + ph * 0.72}" stroke="#CA8A04" stroke-width="3" stroke-dasharray="6,6"/>
      `;
      break;

    case 'bn-stone':
      body = `
        <polygon points="${px + pw * 0.16},${py + ph * 0.76} ${px + pw * 0.28},${py + ph * 0.32} ${px + pw * 0.64},${py + ph * 0.26} ${px + pw * 0.86},${py + ph * 0.72}" fill="#64748B" stroke="#334155" stroke-width="4"/>
      `;
      break;

    default:
      body = `
        <rect x="${px + pw * 0.14}" y="${py + ph * 0.20}" width="${pw * 0.72}" height="${ph * 0.62}" rx="12" fill="#E2E8F0" stroke="#334155" stroke-width="5"/>
        <rect x="${px + pw * 0.22}" y="${py + ph * 0.28}" width="${pw * 0.56}" height="${ph * 0.46}" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
      `;
      break;
  }

  return `<g id="obj-${vocabId}">${shadow}${body}</g>`;
}

// ----------------------------------------------------------------------------
// 3. Well-Spaced Non-Overlapping Object Layout Slots for Custom Scenes (4..6 Objects)
// ----------------------------------------------------------------------------
const CUSTOM_SCENE_BOXES = [
  { x: 0.06, y: 0.10, width: 0.24, height: 0.32, centerX: 0.18, centerY: 0.26 },
  { x: 0.38, y: 0.10, width: 0.24, height: 0.32, centerX: 0.50, centerY: 0.26 },
  { x: 0.70, y: 0.10, width: 0.24, height: 0.32, centerX: 0.82, centerY: 0.26 },
  { x: 0.06, y: 0.54, width: 0.24, height: 0.32, centerX: 0.18, centerY: 0.70 },
  { x: 0.38, y: 0.54, width: 0.24, height: 0.32, centerX: 0.50, centerY: 0.70 },
  { x: 0.70, y: 0.54, width: 0.24, height: 0.32, centerX: 0.82, centerY: 0.70 },
];

// ----------------------------------------------------------------------------
// 4. All 36 Regenerated Scene Specifications
//    (Combined with the 4 kept verified photographs = 40 Total Scenes)
// ----------------------------------------------------------------------------
export const REGENERATED_SCENES_MANIFEST = [
  // Category 1: Kitchen (Scene 1 is kept photo kitchen_02.webp; Scene 2 is regenerated cookware & cutlery)
  {
    sceneId: 'kitchen-scene-2',
    categoryId: 'kitchen',
    envType: 'kitchen',
    variant: 2,
    vocabIds: ['k-pot', 'k-pan', 'k-plate', 'k-knife', 'k-spoon', 'k-fork'],
  },
  // Category 2: Bedroom (Scene 1 is kept photo bedroom_01.webp; Scene 2 is regenerated wardrobe, mirror & lamp)
  {
    sceneId: 'bedroom-scene-2',
    categoryId: 'bedroom',
    envType: 'bedroom',
    variant: 2,
    vocabIds: ['bd-wardrobe', 'bd-mirror', 'bd-lamp', 'bd-bed', 'bd-pillow', 'bd-rug'],
  },
  // Category 3: Bathroom (Scenes 1 & 2 regenerated)
  {
    sceneId: 'bathroom-scene-1',
    categoryId: 'bathroom',
    envType: 'bathroom',
    variant: 1,
    vocabIds: ['ba-shower', 'ba-mirror', 'ba-towel', 'ba-bathtub', 'ba-sink'],
  },
  {
    sceneId: 'bathroom-scene-2',
    categoryId: 'bathroom',
    envType: 'bathroom',
    variant: 2,
    vocabIds: ['ba-mirror', 'ba-faucet', 'ba-towel', 'ba-sink', 'ba-soap', 'ba-toothbrush', 'ba-toothpaste'].slice(0, 6),
  },
  // Category 4: Living Room (Scene 1 is kept photo living-room_01.webp; Scene 2 is regenerated sofa, bookshelf & window)
  {
    sceneId: 'living-room-scene-2',
    categoryId: 'living-room',
    envType: 'living',
    variant: 2,
    vocabIds: ['lr-window', 'lr-bookshelf', 'lr-tv', 'lr-sofa', 'lr-table', 'lr-rug'],
  },
  // Category 5: Dining Room (Scenes 1 & 2 regenerated)
  {
    sceneId: 'dining-room-scene-1',
    categoryId: 'dining-room',
    envType: 'dining',
    variant: 1,
    vocabIds: ['dr-plate', 'dr-glass', 'dr-napkin', 'dr-table', 'dr-chair', 'dr-fork'],
  },
  {
    sceneId: 'dining-room-scene-2',
    categoryId: 'dining-room',
    envType: 'dining',
    variant: 2,
    vocabIds: ['dr-cup', 'dr-plate', 'dr-spoon', 'dr-knife', 'dr-table', 'dr-chair'],
  },
  // Category 6: Supermarket (Scenes 1 & 2 regenerated)
  {
    sceneId: 'supermarket-scene-1',
    categoryId: 'supermarket',
    envType: 'market',
    variant: 1,
    vocabIds: ['sm-apple', 'sm-banana', 'sm-milk', 'sm-cheese', 'sm-bread'],
  },
  {
    sceneId: 'supermarket-scene-2',
    categoryId: 'supermarket',
    envType: 'market',
    variant: 2,
    vocabIds: ['sm-checkout', 'sm-basket', 'sm-cart', 'sm-bag', 'sm-milk'],
  },
  // Category 7: Farmers Market (Scenes 1 & 2 regenerated)
  {
    sceneId: 'farmers-market-scene-1',
    categoryId: 'farmers-market',
    envType: 'outdoor-market',
    variant: 1,
    vocabIds: ['fm-tomato', 'fm-cucumber', 'fm-carrot', 'fm-potato', 'fm-basket'],
  },
  {
    sceneId: 'farmers-market-scene-2',
    categoryId: 'farmers-market',
    envType: 'outdoor-market',
    variant: 2,
    vocabIds: ['fm-seller', 'fm-apple', 'fm-pear', 'fm-flowers', 'fm-basket'],
  },
  // Category 8: Café (Scenes 1 & 2 regenerated)
  {
    sceneId: 'cafe-scene-1',
    categoryId: 'cafe',
    envType: 'cafe',
    variant: 1,
    vocabIds: ['cf-barista', 'cf-menu', 'cf-coffee', 'cf-cup', 'cf-pastry'],
  },
  {
    sceneId: 'cafe-scene-2',
    categoryId: 'cafe',
    envType: 'cafe',
    variant: 2,
    vocabIds: ['cf-cup-coffee', 'cf-pastry', 'cf-teaspoon', 'cf-table', 'cf-chair'],
  },
  // Category 9: Restaurant (Scenes 1 & 2 regenerated)
  {
    sceneId: 'restaurant-scene-1',
    categoryId: 'restaurant',
    envType: 'restaurant',
    variant: 1,
    vocabIds: ['rs-waiter', 'rs-menu', 'rs-dish', 'rs-plate', 'rs-glass'],
  },
  {
    sceneId: 'restaurant-scene-2',
    categoryId: 'restaurant',
    envType: 'restaurant',
    variant: 2,
    vocabIds: ['rs-food', 'rs-plate', 'rs-glass', 'rs-fork', 'rs-knife', 'rs-bill'],
  },
  // Category 10: Classroom (Scenes 1 & 2 regenerated)
  {
    sceneId: 'classroom-scene-1',
    categoryId: 'classroom',
    envType: 'classroom',
    variant: 1,
    vocabIds: ['cl-board', 'cl-teacher', 'cl-student', 'cl-desk', 'cl-book'],
  },
  {
    sceneId: 'classroom-scene-2',
    categoryId: 'classroom',
    envType: 'classroom',
    variant: 2,
    vocabIds: ['cl-book', 'cl-notebook', 'cl-pen', 'cl-pencil', 'cl-backpack', 'cl-desk'],
  },
  // Category 11: Office (Scene 1 is kept photo office_01.webp; Scene 2 is regenerated laptop, phone & printer)
  {
    sceneId: 'office-scene-2',
    categoryId: 'office',
    envType: 'office',
    variant: 2,
    vocabIds: ['of-laptop', 'of-monitor', 'of-phone', 'of-printer', 'of-desk', 'of-chair'],
  },
  // Category 12: Library (Scenes 1 & 2 regenerated)
  {
    sceneId: 'library-scene-1',
    categoryId: 'library',
    envType: 'library',
    variant: 1,
    vocabIds: ['lb-library', 'lb-shelf', 'lb-reader', 'lb-table', 'lb-chair'],
  },
  {
    sceneId: 'library-scene-2',
    categoryId: 'library',
    envType: 'library',
    variant: 2,
    vocabIds: ['lb-book', 'lb-notebook', 'lb-lamp', 'lb-shelf', 'lb-table'],
  },
  // Category 13: Gym & Fitness (Scenes 1 & 2 regenerated)
  {
    sceneId: 'gym-fitness-scene-1',
    categoryId: 'gym-fitness',
    envType: 'gym',
    variant: 1,
    vocabIds: ['gm-dumbbell', 'gm-barbell', 'gm-machine', 'gm-bench', 'gm-towel'],
  },
  {
    sceneId: 'gym-fitness-scene-2',
    categoryId: 'gym-fitness',
    envType: 'gym',
    variant: 2,
    vocabIds: ['gm-treadmill', 'gm-mat', 'gm-towel', 'gm-bottle'],
  },
  // Category 14: Park & Garden (Scenes 1 & 2 regenerated)
  {
    sceneId: 'park-garden-scene-1',
    categoryId: 'park-garden',
    envType: 'park',
    variant: 1,
    vocabIds: ['pk-tree', 'pk-bush', 'pk-bench', 'pk-path', 'pk-grass'],
  },
  {
    sceneId: 'park-garden-scene-2',
    categoryId: 'park-garden',
    envType: 'park',
    variant: 2,
    vocabIds: ['pk-bird', 'pk-leaves', 'pk-tree', 'pk-flower', 'pk-grass'],
  },
  // Category 15: Playground (Scenes 1 & 2 regenerated)
  {
    sceneId: 'playground-scene-1',
    categoryId: 'playground',
    envType: 'playground',
    variant: 1,
    vocabIds: ['pg-swing', 'pg-slide', 'pg-tree', 'pg-sandbox', 'pg-bench'],
  },
  {
    sceneId: 'playground-scene-2',
    categoryId: 'playground',
    envType: 'playground',
    variant: 2,
    vocabIds: ['pg-child', 'pg-slide', 'pg-ball', 'pg-sandbox', 'pg-bench'],
  },
  // Category 16: City Streets (Scenes 1 & 2 regenerated)
  {
    sceneId: 'city-streets-scene-1',
    categoryId: 'city-streets',
    envType: 'street',
    variant: 1,
    vocabIds: ['cs-light', 'cs-pedestrian', 'cs-car', 'cs-road', 'cs-sidewalk'],
  },
  {
    sceneId: 'city-streets-scene-2',
    categoryId: 'city-streets',
    envType: 'street',
    variant: 2,
    vocabIds: ['cs-building', 'cs-sign', 'cs-bicycle', 'cs-sidewalk', 'cs-road'],
  },
  // Category 17: Public Transportation (Scenes 1 & 2 regenerated)
  {
    sceneId: 'public-transportation-scene-1',
    categoryId: 'public-transportation',
    envType: 'transit',
    variant: 1,
    vocabIds: ['pt-stop', 'pt-metro', 'pt-bus', 'pt-tram'],
  },
  {
    sceneId: 'public-transportation-scene-2',
    categoryId: 'public-transportation',
    envType: 'transit',
    variant: 2,
    vocabIds: ['pt-window', 'pt-doors', 'pt-seat', 'pt-ticket'],
  },
  // Category 18: Airport & Train Station (Scenes 1 & 2 regenerated)
  {
    sceneId: 'airport-train-scene-1',
    categoryId: 'airport-train',
    envType: 'station',
    variant: 1,
    vocabIds: ['at-airplane', 'at-board', 'at-passenger', 'at-suitcase', 'at-ticket'],
  },
  {
    sceneId: 'airport-train-scene-2',
    categoryId: 'airport-train',
    envType: 'station',
    variant: 2,
    vocabIds: ['at-board', 'at-train', 'at-platform', 'at-luggage', 'at-suitcase'],
  },
  // Category 19: Hospital & Pharmacy (Scenes 1 & 2 regenerated)
  {
    sceneId: 'hospital-pharmacy-scene-1',
    categoryId: 'hospital-pharmacy',
    envType: 'clinic',
    variant: 1,
    vocabIds: ['hp-doctor', 'hp-nurse', 'hp-stethoscope', 'hp-bed', 'hp-thermometer'],
  },
  {
    sceneId: 'hospital-pharmacy-scene-2',
    categoryId: 'hospital-pharmacy',
    envType: 'clinic',
    variant: 2,
    vocabIds: ['hp-pharmacy', 'hp-doctor', 'hp-medicine', 'hp-bandage', 'hp-thermometer'],
  },
];

async function generateAllRegeneratedScenes() {
  // 1. Write SVG files for the 34 custom category scenes
  for (const spec of REGENERATED_SCENES_MANIFEST) {
    const bgSvg = renderEnvironmentBackground(spec.envType, spec.variant);
    const objectsSvg = spec.vocabIds
      .map((vocabId, idx) => {
        const box = CUSTOM_SCENE_BOXES[idx];
        const px = Math.round(box.x * 1200);
        const py = Math.round(box.y * 900);
        const pw = Math.round(box.width * 1200);
        const ph = Math.round(box.height * 900);
        return renderObjectArtwork(vocabId, vocabId, px, py, pw, ph);
      })
      .join('\n');

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
      ${bgSvg}
      ${objectsSvg}
    </svg>`;

    const svgPath = path.join(OUT_DIR, `${spec.sceneId}.svg`);
    fs.writeFileSync(svgPath, fullSvg, 'utf8');
  }

  // Copy the 2 rich Beach & Nature pilot SVGs into regenerated/ as beach-nature-scene-1.svg and beach-nature-scene-2.svg
  fs.copyFileSync(
    path.join(process.cwd(), 'public/assets/identify/pilot/beach-nature-pilot-a.svg'),
    path.join(OUT_DIR, 'beach-nature-scene-1.svg')
  );
  fs.copyFileSync(
    path.join(process.cwd(), 'public/assets/identify/pilot/beach-nature-pilot-b.svg'),
    path.join(OUT_DIR, 'beach-nature-scene-2.svg')
  );

  // 2. Render all 36 SVGs via headless Chromium to PNG and convert to crisp 1200x900 .webp
  const { chromium } = await import('/root/.bun/install/global/node_modules/playwright/index.mjs');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const allSceneIds = [
    ...REGENERATED_SCENES_MANIFEST.map((s) => s.sceneId),
    'beach-nature-scene-1',
    'beach-nature-scene-2',
  ];

  for (const sceneId of allSceneIds) {
    const svgPath = path.join(OUT_DIR, `${sceneId}.svg`);
    const pngTmp = `/tmp/${sceneId}.png`;
    const webpPath = path.join(OUT_DIR, `${sceneId}.webp`);
    await page.goto(`file://${svgPath}`);
    await page.screenshot({ path: pngTmp });
    execSync(`convert "${pngTmp}" -quality 90 "${webpPath}"`);
    fs.unlinkSync(pngTmp);
  }

  await browser.close();
  console.log(`Generated ${allSceneIds.length} high-resolution 1200x900 .webp scenes in ${OUT_DIR}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllRegeneratedScenes().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { renderEnvironmentBackground, renderObjectArtwork, CUSTOM_SCENE_BOXES, OUT_DIR };

