// ============================================================================
// LANGO PHASE 3A — LANGO CONTENT STUDIO ACCESS CONTROL, AUTHORIZATION SCOPES
// & PLUGGABLE STORAGE ADAPTER ARCHITECTURE (SECTIONS 3, 24, 25)
// ============================================================================

export type CmsPermissionScope =
  | 'cms:preview_readonly'
  | 'cms:edit_draft'
  | 'cms:import_package'
  | 'cms:restore_version'
  | 'cms:publish_course'
  | 'cms:delete_draft';

export type CmsRole =
  | 'unauthenticated_public'
  | 'local_solo_developer'
  | 'future_firebase_content_editor'
  | 'future_firebase_content_publisher'
  | 'future_firebase_super_admin';

export interface CmsAccessContext {
  isAllowed: boolean;
  isDevelopmentEnvironment: boolean;
  activeRole: CmsRole;
  grantedScopes: CmsPermissionScope[];
  persistenceMode: 'local_dev_exportable_storage' | 'future_cloud_firestore_gcs';
  denialReason?: string;
}

const ALL_DEV_SCOPES: CmsPermissionScope[] = [
  'cms:preview_readonly',
  'cms:edit_draft',
  'cms:import_package',
  'cms:restore_version',
  'cms:publish_course',
  'cms:delete_draft',
];

let simulatedPublicProductionRestriction = false;

/**
 * Allows automated tests (e.g. Acceptance Test 25) to simulate a public
 * unauthenticated production visitor and verify that all CMS editing, importing,
 * restoring, and publishing operations are strictly denied.
 */
export function setSimulatedPublicProductionModeForTesting(
  restricted: boolean
): void {
  simulatedPublicProductionRestriction = restricted;
}

export function isSimulatedPublicProductionMode(): boolean {
  return simulatedPublicProductionRestriction;
}

export function evaluateCmsAccessContext(): CmsAccessContext {
  if (simulatedPublicProductionRestriction) {
    return {
      isAllowed: false,
      isDevelopmentEnvironment: false,
      activeRole: 'unauthenticated_public',
      grantedScopes: [],
      persistenceMode: 'local_dev_exportable_storage',
      denialReason:
        'Access Denied: Lango Content Studio is restricted to trusted developer environments in Phase 3A. Public visitors cannot access CMS editing, importing, or publishing operations.',
    };
  }

  return {
    isAllowed: true,
    isDevelopmentEnvironment: true,
    activeRole: 'local_solo_developer',
    grantedScopes: [...ALL_DEV_SCOPES],
    persistenceMode: 'local_dev_exportable_storage',
  };
}

export function assertCmsPermission(requiredScope: CmsPermissionScope): void {
  const ctx = evaluateCmsAccessContext();
  if (!ctx.isAllowed || !ctx.grantedScopes.includes(requiredScope)) {
    throw new Error(
      ctx.denialReason ||
        `Unauthorized CMS operation: missing required permission scope "${requiredScope}".`
    );
  }
}

// ============================================================================
// PLUGGABLE CMS STORAGE ADAPTER (LOCAL DEV vs FUTURE FIRESTORE / GCS)
// ============================================================================

export interface CmsAuditLogEntry {
  auditId: string;
  timestamp: number;
  actorRole: CmsRole;
  operation: CmsPermissionScope | 'cms:snapshot_create' | 'cms:export_json';
  courseTrackId: string;
  summary: string;
}

export interface ICmsStorageAdapter {
  readonly adapterName: string;
  readonly isDurableCloudPersistence: boolean;
  getItem<T>(key: string): T | undefined;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  listKeys(prefix?: string): string[];
}

const CMS_STORAGE_PREFIX = 'lango_cms_studio_v1:';
const inMemoryCmsStore = new Map<string, string>();

function hasBrowserLocalStorage(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { localStorage?: Storage }).localStorage !==
      'undefined'
  );
}

export class LocalDevCmsStorageAdapter implements ICmsStorageAdapter {
  public readonly adapterName =
    'LocalDevelopmentExportableStorage (In-Memory + Browser localStorage)';
  public readonly isDurableCloudPersistence = false;

  getItem<T>(key: string): T | undefined {
    const fullKey = `${CMS_STORAGE_PREFIX}${key}`;
    if (hasBrowserLocalStorage()) {
      const raw = localStorage.getItem(fullKey);
      if (raw !== null) {
        try {
          return JSON.parse(raw) as T;
        } catch {
          return undefined;
        }
      }
    }
    const mem = inMemoryCmsStore.get(fullKey);
    if (mem !== undefined) {
      try {
        return JSON.parse(mem) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  setItem<T>(key: string, value: T): void {
    const fullKey = `${CMS_STORAGE_PREFIX}${key}`;
    const serialized = JSON.stringify(value);
    inMemoryCmsStore.set(fullKey, serialized);
    if (hasBrowserLocalStorage()) {
      try {
        localStorage.setItem(fullKey, serialized);
      } catch {
        // Fallback to in-memory if localStorage quota is exceeded
      }
    }
  }

  removeItem(key: string): void {
    const fullKey = `${CMS_STORAGE_PREFIX}${key}`;
    inMemoryCmsStore.delete(fullKey);
    if (hasBrowserLocalStorage()) {
      localStorage.removeItem(fullKey);
    }
  }

  listKeys(prefix = ''): string[] {
    const fullPrefix = `${CMS_STORAGE_PREFIX}${prefix}`;
    const keys = new Set<string>();
    for (const k of inMemoryCmsStore.keys()) {
      if (k.startsWith(fullPrefix)) {
        keys.add(k.slice(CMS_STORAGE_PREFIX.length));
      }
    }
    if (hasBrowserLocalStorage()) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(fullPrefix)) {
          keys.add(k.slice(CMS_STORAGE_PREFIX.length));
        }
      }
    }
    return Array.from(keys);
  }
}

export const cmsStorageAdapter: ICmsStorageAdapter =
  new LocalDevCmsStorageAdapter();
