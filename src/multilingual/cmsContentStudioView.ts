/**
 * ============================================================================
 * LANGO — PHASE 3A: VISUAL CONTENT MANAGEMENT STUDIO (CMS) VIEW CONTROLLER
 * ============================================================================
 * Provides the full developer-facing Lango Content Studio interface at `/studio`
 * (or `?studio=1`, or via the top-bar `🎛️ Studio` button in development mode):
 *   1. Dashboard (`dashboard`) — Real telemetry across 28 Course Tracks,
 *      storage backend transparency, recent audit log, and import history.
 *   2. Course Manager (`courses`) — Browse, search, filter, sort, open,
 *      preview, validate, and export all 28 Course Tracks (`track:en-to-*` +
 *      `track:*-to-en`).
 *   3. Hierarchical Editor (`editor`) — Visual Course → Module → Section →
 *      Lesson → Activity editor with Module Reordering, Duplication, Lesson
 *      prose/metadata editing, Activity prompt/options/answer-key editing,
 *      and raw JSON source inspector.
 *   4. JSON Import & Merge Manager (`importer`) — Full draft import and
 *      safe incremental module/lesson merge (`incremental_module_merge`)
 *      with synthetic fixture loaders (Spanish → English, Hindi → English,
 *      and incremental module patch).
 *   5. Vocabulary & Overlay Manager (`vocabulary`) — Canonical English
 *      Lexeme registry (`CanonicalEnglishLexeme`) kept strictly separate from
 *      the 14 Native-Language Overlays (`NativeLanguageEnglishVocabOverlay`).
 *   6. Validation Center (`validation`) — Structural, Pedagogical &
 *      Integrity checks (`ERROR`, `WARNING`, `INFO`), Manual Pedagogical
 *      Review Notes, and Bulk 28-Track Audit.
 *   7. Version History, Diff & Rollback (`versions`) — Snapshot timeline,
 *      side-by-side structured diff comparison, and safe rollback with
 *      automatic pre-rollback backup.
 *   8. Media Library (`media`) — Visual browser and search across all 100
 *      Ukrainian Identify WebP photographs (`20` categories × `5` scenes).
 *   9. Isolated Draft Preview (`preview`) — Sandboxed preview rendered via
 *      the real Phase 2 Universal Course Player (`renderIsolatedCmsDraftPreview`)
 *      without modifying learner FSRS or XP.
 *  10. Export & Round-Trip Validator (`export`) — Clean `UniversalCoursePackageV1`
 *      JSON export, download, and instant round-trip re-import validation.
 * ============================================================================
 */

import {
  getAllCourseTracks,
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
} from './courseTrackRegistry.ts';
import { getForeignLanguages } from './languageRegistry.ts';
import {
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
  validateAndPreviewCourseImport,
} from './universalCourseImporter.ts';
import { SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON } from './universalCoursePlayer.ts';
import {
  cmsStorageAdapter,
  evaluateCmsAccessContext,
} from './cmsAuthAndStorage.ts';
import {
  getAllCmsTrackSummaries,
  getCmsDashboardMetrics,
  getOrCreateCmsCourseDraft,
  getPublishedBaselineCoursePackage,
  discardCmsDraftOverlay,
  computeCmsDraftVsPublishedDiff,
  addOrUpdateCmsModuleInDraft,
  reorderCmsModulesInDraft,
  duplicateCmsModuleInDraft,
  updateCmsLessonInDraft,
  updateCmsActivityInDraft,
  importCourseJsonIntoCmsDraft,
  validateCmsCourseDraft,
  addCmsManualReviewNote,
  getCmsManualReviewNotes,
  getAllCanonicalEnglishLexemes,
  getAllNativeOverlaysForLexeme,
  upsertCanonicalEnglishLexemeInCms,
  upsertNativeLanguageOverlayInCms,
  validateCmsVocabularyRegistry,
  getCmsVersionHistory,
  createCmsVersionSnapshot,
  compareCmsVersionSnapshots,
  restoreCmsVersionSnapshot,
  transitionCmsDraftLifecycleState,
  getCmsMediaLibraryCatalog,
  renderIsolatedCmsDraftPreview,
  exportCmsCourseDraftToJson,
  runBulkCmsValidationAudit,
  searchCmsContentStudio,
  type CmsContentOriginStatus,
  type CmsLifecycleState,
  type CmsTrackSummary,
  type CmsValidationIssue,
  type CmsValidationReport,
} from './cmsContentStudioEngine.ts';

export type CmsWorkspaceTab =
  | 'dashboard'
  | 'courses'
  | 'editor'
  | 'importer'
  | 'vocabulary'
  | 'validation'
  | 'versions'
  | 'media'
  | 'preview'
  | 'export';

interface CmsStudioUiState {
  isOpen: boolean;
  activeTab: CmsWorkspaceTab;
  selectedTrackId: string;
  // Course Manager filters
  courseSearchQuery: string;
  courseDirectionFilter: 'all' | 'en_to_foreign' | 'foreign_to_en';
  courseStatusFilter: 'all' | CmsLifecycleState;
  courseSortBy: 'title' | 'modules' | 'updated';
  // Editor selection
  selectedModuleId: string;
  selectedSectionId: string;
  selectedLessonId: string;
  selectedActivityId: string;
  showSourceJsonDrawer: boolean;
  showDraftVsPublishedDiffDrawer: boolean;
  // Preview mode
  previewMode: 'draft' | 'published';
  // Importer state
  importMode: 'full_draft_import' | 'incremental_module_merge';
  importJsonText: string;
  lastImportBannerHtml: string;
  // Vocabulary state
  selectedLexemeId: string;
  selectedOverlayLang: string;
  vocabSearchQuery: string;
  // Validation state
  lastBulkAuditSummary: {
    auditedTrackCount: number;
    totalErrors: number;
    totalWarnings: number;
  } | null;
  // Version diff state
  diffLeftVersionId: string;
  diffRightVersionId: string;
  // Media library state
  mediaSearchQuery: string;
  // Export round-trip state
  exportStatusMessage: string;
  // Global search
  globalSearchQuery: string;
  // Toast notification
  bannerNotification: {
    type: 'success' | 'warn' | 'danger';
    message: string;
  } | null;
}

const cmsUiState: CmsStudioUiState = {
  isOpen: false,
  activeTab: 'dashboard',
  selectedTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
  courseSearchQuery: '',
  courseDirectionFilter: 'all',
  courseStatusFilter: 'all',
  courseSortBy: 'title',
  selectedModuleId: '',
  selectedSectionId: '',
  selectedLessonId: '',
  selectedActivityId: '',
  showSourceJsonDrawer: false,
  showDraftVsPublishedDiffDrawer: false,
  previewMode: 'draft',
  importMode: 'full_draft_import',
  importJsonText: '',
  lastImportBannerHtml: '',
  selectedLexemeId: 'en_lex_0001',
  selectedOverlayLang: 'es',
  vocabSearchQuery: '',
  lastBulkAuditSummary: null,
  diffLeftVersionId: '',
  diffRightVersionId: '',
  mediaSearchQuery: '',
  exportStatusMessage: '',
  globalSearchQuery: '',
  bannerNotification: null,
};

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setCmsBanner(
  type: 'success' | 'warn' | 'danger',
  message: string
): void {
  cmsUiState.bannerNotification = { type, message };
}

function ensureEditorSelectionForDraft(trackId: string): void {
  const draft = getOrCreateCmsCourseDraft(trackId);
  const pkg = draft.draftPackage;
  if (!pkg.modules || pkg.modules.length === 0) {
    cmsUiState.selectedModuleId = '';
    cmsUiState.selectedSectionId = '';
    cmsUiState.selectedLessonId = '';
    cmsUiState.selectedActivityId = '';
    return;
  }
  let mod = pkg.modules.find((m) => m.moduleId === cmsUiState.selectedModuleId);
  if (!mod) {
    mod = pkg.modules[0];
    cmsUiState.selectedModuleId = mod.moduleId;
  }
  const sections = mod.sections || [];
  let sec = sections.find((s) => s.sectionId === cmsUiState.selectedSectionId);
  if (!sec && sections.length > 0) {
    sec = sections[0];
    cmsUiState.selectedSectionId = sec.sectionId;
  }
  const lessons = sec?.lessons || mod.lessons || [];
  let les = lessons.find((l) => l.lessonId === cmsUiState.selectedLessonId);
  if (!les && lessons.length > 0) {
    les = lessons[0];
    cmsUiState.selectedLessonId = les.lessonId;
  }
  const activities = les?.activities || [];
  let act = activities.find(
    (a) => a.activityId === cmsUiState.selectedActivityId
  );
  if (!act && activities.length > 0) {
    act = activities[0];
    cmsUiState.selectedActivityId = act.activityId;
  } else if (activities.length === 0) {
    cmsUiState.selectedActivityId = '';
  }
}

// ============================================================================
// 1. OPEN / CLOSE & ROUTE DETECTION
// ============================================================================

export function openLangoContentStudio(
  initialTab?: CmsWorkspaceTab,
  trackId?: string
): void {
  const rootEl = document.getElementById('lango-cms-studio-root');
  const appShellEl = document.querySelector('.app-shell') as HTMLElement | null;
  if (!rootEl) return;

  const access = evaluateCmsAccessContext();
  if (!access.isAllowed) {
    rootEl.classList.remove('hidden');
    rootEl.style.display = 'block';
    rootEl.innerHTML = `
      <div style="max-width:720px; margin:48px auto; padding:28px; background:var(--surface-1); border:2px solid var(--danger); border-radius:var(--radius-lg);">
        <h2 style="margin:0 0 10px 0; color:var(--danger);">🔒 Lango Content Studio — Developer Access Required</h2>
        <p style="margin:0 0 16px 0; color:var(--text-secondary); font-size:14px;">
          ${escapeHtml(access.denialReason || 'Unauthorized CMS access.')}
        </p>
        <button type="button" class="btn" onclick="closeLangoContentStudio()">← Return to Learner Application</button>
      </div>
    `;
    return;
  }

  cmsUiState.isOpen = true;
  if (initialTab) cmsUiState.activeTab = initialTab;
  if (trackId) cmsUiState.selectedTrackId = trackId;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);

  if (appShellEl) appShellEl.classList.add('hidden');
  rootEl.classList.remove('hidden');
  rootEl.style.display = 'block';
  renderLangoContentStudio();
}

export function closeLangoContentStudio(): void {
  cmsUiState.isOpen = false;
  const rootEl = document.getElementById('lango-cms-studio-root');
  const appShellEl = document.querySelector('.app-shell') as HTMLElement | null;
  if (rootEl) {
    rootEl.classList.add('hidden');
    rootEl.style.display = 'none';
  }
  if (appShellEl) {
    appShellEl.classList.remove('hidden');
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.pathname === '/studio' ||
      window.location.search.includes('studio=1'))
  ) {
    window.history.replaceState({}, '', '/');
  }
}

export function switchCmsWorkspaceTab(
  tab: CmsWorkspaceTab,
  trackId?: string
): void {
  cmsUiState.activeTab = tab;
  if (trackId) {
    cmsUiState.selectedTrackId = trackId;
    ensureEditorSelectionForDraft(trackId);
  }
  renderLangoContentStudio();
}

export function selectCmsActiveTrack(trackId: string): void {
  cmsUiState.selectedTrackId = trackId;
  ensureEditorSelectionForDraft(trackId);
  renderLangoContentStudio();
}

// ============================================================================
// 2. MAIN STUDIO RENDERER
// ============================================================================

export function renderLangoContentStudio(): void {
  const rootEl = document.getElementById('lango-cms-studio-root');
  if (!rootEl || !cmsUiState.isOpen) return;

  const access = evaluateCmsAccessContext();
  const selectedTrack = getCourseTrackById(cmsUiState.selectedTrackId);
  const trackOptionsHtml = getAllCourseTracks()
    .map(
      (t) =>
        `<option value="${t.trackId}" ${t.trackId === cmsUiState.selectedTrackId ? 'selected' : ''}>${escapeHtml(t.courseTitle)} (${t.trackId}) [${t.availability}]</option>`
    )
    .join('');

  const navItems: Array<{ id: CmsWorkspaceTab; icon: string; label: string }> = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'courses', icon: '🗂️', label: 'Course Manager (28)' },
    { id: 'editor', icon: '✏️', label: 'Course & Lesson Editor' },
    { id: 'importer', icon: '📥', label: 'JSON Import & Merge' },
    { id: 'vocabulary', icon: '🔤', label: 'Vocabulary & Overlays' },
    { id: 'validation', icon: '🛡️', label: 'Validation Center' },
    { id: 'versions', icon: '🕒', label: 'Versions & Rollback' },
    { id: 'media', icon: '🖼️', label: 'Media Library (100)' },
    { id: 'preview', icon: '👁️', label: 'Isolated Player Preview' },
    { id: 'export', icon: '📤', label: 'Export & Round-Trip' },
  ];

  const bannerHtml = cmsUiState.bannerNotification
    ? `<div data-testid="cms-status-banner" style="margin-bottom:14px; padding:10px 14px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; gap:10px; background:${
        cmsUiState.bannerNotification.type === 'success'
          ? 'var(--success-container)'
          : cmsUiState.bannerNotification.type === 'warn'
            ? 'var(--warn-container)'
            : 'var(--danger-container)'
      }; color:${
        cmsUiState.bannerNotification.type === 'success'
          ? 'var(--success-on-container)'
          : cmsUiState.bannerNotification.type === 'warn'
            ? 'var(--warn-on-container)'
            : 'var(--danger-on-container)'
      }; font-size:13px; font-weight:700;">
        <span>${escapeHtml(cmsUiState.bannerNotification.message)}</span>
        <button type="button" class="btn btn-sec" style="min-height:26px; padding:2px 8px; font-size:11px;" onclick="dismissCmsBanner()">Dismiss</button>
      </div>`
    : '';

  let workspaceBodyHtml = '';
  switch (cmsUiState.activeTab) {
    case 'dashboard':
      workspaceBodyHtml = renderCmsDashboardTab();
      break;
    case 'courses':
      workspaceBodyHtml = renderCmsCoursesTab();
      break;
    case 'editor':
      workspaceBodyHtml = renderCmsEditorTab();
      break;
    case 'importer':
      workspaceBodyHtml = renderCmsImporterTab();
      break;
    case 'vocabulary':
      workspaceBodyHtml = renderCmsVocabularyTab();
      break;
    case 'validation':
      workspaceBodyHtml = renderCmsValidationTab();
      break;
    case 'versions':
      workspaceBodyHtml = renderCmsVersionsTab();
      break;
    case 'media':
      workspaceBodyHtml = renderCmsMediaTab();
      break;
    case 'preview':
      workspaceBodyHtml = renderCmsPreviewTab();
      break;
    case 'export':
      workspaceBodyHtml = renderCmsExportTab();
      break;
  }

  const globalSearchHtml = cmsUiState.globalSearchQuery.trim()
    ? renderGlobalSearchResultsOverlay(cmsUiState.globalSearchQuery)
    : '';

  rootEl.innerHTML = `
    <div data-testid="lango-cms-studio-shell" class="cms-studio-shell">
      <!-- Studio Top Header -->
      <div class="card" style="margin-bottom:14px; padding:14px 18px; background:linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%); border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; border-radius:12px; background:var(--accent); color:var(--accent-on); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; flex-shrink:0;">
              🎛️
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h1 style="margin:0; font-size:19px; font-weight:900; color:var(--text);">Lango Content Studio</h1>
                <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-size:11px; font-weight:800;">Phase 3A Developer CMS</span>
                <span class="tag" style="background:var(--surface-1); color:var(--success); font-size:11px; font-weight:700;">🔒 ${escapeHtml(access.activeRole)} (${escapeHtml(access.persistenceMode)})</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                Manage 28 Multilingual Course Tracks • Isolated Drafts, Version Snapshots, Safe Rollback & Canonical English Overlays
              </div>
            </div>
          </div>

          <div class="cms-header-controls">
            <input
              id="cms-global-search-input"
              data-testid="cms-global-search-input"
              type="search"
              class="input-box"
              style="width:230px; min-height:36px; padding:5px 10px; font-size:12.5px;"
              placeholder="🔍 Search tracks, lessons, vocab..."
              value="${escapeHtml(cmsUiState.globalSearchQuery)}"
              oninput="handleCmsGlobalSearchInput(this.value)"
            />
            <select
              id="cms-active-track-select"
              data-testid="cms-active-track-select"
              class="input-box"
              style="width:270px; min-height:36px; padding:5px 10px; font-size:12.5px; font-weight:700;"
              onchange="selectCmsActiveTrack(this.value)"
            >
              ${trackOptionsHtml}
            </select>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="btn-close-cms-studio"
              style="min-height:36px; padding:6px 12px; font-size:12.5px; font-weight:800;"
              onclick="closeLangoContentStudio()"
            >
              ← Return to Learner App
            </button>
          </div>
        </div>

        <!-- Studio Navigation Bar -->
        <div class="cms-nav-bar">
          ${navItems
            .map(
              (item) => `
              <button
                type="button"
                data-testid="cms-tab-${item.id}"
                class="stage-pill ${cmsUiState.activeTab === item.id ? 'active' : ''}"
                style="min-height:34px; padding:5px 12px; font-size:12px;"
                onclick="switchCmsWorkspaceTab('${item.id}')"
              >
                ${item.icon} ${escapeHtml(item.label)}
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      ${bannerHtml}
      ${globalSearchHtml}

      <!-- Active Track Context Strip -->
      <div style="margin-bottom:14px; padding:8px 14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:12px;">
        <div>
          Active Track in Studio: <b>${escapeHtml(selectedTrack?.courseTitle || cmsUiState.selectedTrackId)}</b>
          (<code>${escapeHtml(cmsUiState.selectedTrackId)}</code> • <code>${escapeHtml(selectedTrack?.nativeLanguage || '')} → ${escapeHtml(selectedTrack?.targetLanguage || '')}</code>)
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 9px; font-size:11px;" onclick="switchCmsWorkspaceTab('editor')">✏️ Edit Track</button>
          <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 9px; font-size:11px;" onclick="switchCmsWorkspaceTab('validation')">🛡️ Validate</button>
          <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 9px; font-size:11px;" onclick="switchCmsWorkspaceTab('preview')">👁️ Preview</button>
          <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 9px; font-size:11px;" onclick="switchCmsWorkspaceTab('versions')">🕒 Versions</button>
        </div>
      </div>

      <!-- Workspace Body -->
      <div id="cms-workspace-body">
        ${workspaceBodyHtml}
      </div>
    </div>
  `;
}

function renderGlobalSearchResultsOverlay(query: string): string {
  const results = searchCmsContentStudio(query);
  return `
    <div class="card" data-testid="cms-global-search-results" style="margin-bottom:14px; padding:12px 16px; border:2px solid var(--accent);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="font-size:13px; font-weight:800;">
          🔍 Global Studio Search Results for "${escapeHtml(query)}" (${results.length} matches)
        </div>
        <button type="button" class="btn btn-sec" style="min-height:26px; padding:2px 8px; font-size:11px;" onclick="handleCmsGlobalSearchInput('')">Clear Search</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
        ${
          results
            .slice(0, 10)
            .map(
              (r) =>
                `<div style="padding:4px 0; border-bottom:1px solid var(--border-subtle);">
                  <span class="tag" style="font-size:10px;">${escapeHtml(r.resultType)}</span>
                  <a href="javascript:void(0)" style="color:var(--accent); font-weight:700;" onclick="handleSearchResultClick('${r.resultType}', '${r.courseTrackId}', '${r.itemId}')">${escapeHtml(r.title)}</a>
                  <span style="color:var(--text-secondary);"> — ${escapeHtml(r.subtitle)}</span>
                </div>`
            )
            .join('') || '<div style="color:var(--text-secondary);">No matching items found.</div>'
        }
      </div>
    </div>
  `;
}

// ============================================================================
// 3. TAB 1: DASHBOARD
// ============================================================================

function renderCmsDashboardTab(): string {
  const m = getCmsDashboardMetrics();
  return `
    <div data-testid="cms-dashboard-view">
      <!-- Top Telemetry Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:16px;">
        <div class="card" style="padding:14px;">
          <div style="font-size:11.5px; color:var(--text-secondary); font-weight:700;">REGISTERED COURSE TRACKS</div>
          <div style="font-size:26px; font-weight:900; color:var(--accent); margin-top:4px;" data-testid="cms-metric-total-tracks">${m.totalRegisteredTracks}</div>
          <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">14 Foreign (EN→X) + 14 English (X→EN)</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:11.5px; color:var(--text-secondary); font-weight:700;">PUBLISHED / DRAFT / EMPTY</div>
          <div style="font-size:22px; font-weight:900; color:var(--success); margin-top:4px;">
            ${m.publishedCoursesCount} Pub • ${m.draftCoursesCount} Draft • ${m.emptyCoursesCount} Empty
          </div>
          <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Strict Draft vs. Published Isolation</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:11.5px; color:var(--text-secondary); font-weight:700;">UKRAINIAN FLAGSHIP (EN → UK)</div>
          <div style="font-size:22px; font-weight:900; color:var(--text); margin-top:4px;" data-testid="cms-metric-uk-summary">
            ${m.ukrainianPublishedModules} Mods • ${m.ukrainianCourseVocabCount} Words
          </div>
          <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">5,510 Assessments • ${m.ukrainianFsrsLexiconCount} FSRS Lexicon</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:11.5px; color:var(--text-secondary); font-weight:700;">CANONICAL EN + 14 OVERLAYS</div>
          <div style="font-size:22px; font-weight:900; color:var(--accent); margin-top:4px;">
            ${m.canonicalEnglishLexemesCount} Lexemes • ${m.nativeEnglishOverlaysCount} Overlays
          </div>
          <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">${m.mediaAssetsCount} Identify WebP Scenes</div>
        </div>
      </div>

      <!-- Storage Transparency Notice -->
      <div class="card" style="margin-bottom:16px; padding:14px 16px; border-left:4px solid var(--accent);">
        <div style="font-size:13.5px; font-weight:800; margin-bottom:4px;">🗄️ Storage Backend Transparency: <code>${escapeHtml(m.storageAdapterName)}</code></div>
        <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.5;">
          Phase 3A operates in local development exportable storage (in-memory + browser localStorage under <code>lango_cms_studio_v1:*</code>) with clean JSON export/re-import and pluggable <code>ICmsStorageAdapter</code> readiness for future Firebase Firestore + Cloud Storage.
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
        <div class="card" style="padding:16px;">
          <h3 style="margin:0 0 10px 0; font-size:15px; font-weight:800;">⚡ Quick Studio Workflows</h3>
          <div class="cms-quick-actions-grid">
            <button type="button" class="btn" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('courses')">🗂️ Open 28-Track Manager</button>
            <button type="button" class="btn btn-sec" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('importer')">📥 Import / Merge Course JSON</button>
            <button type="button" class="btn btn-sec" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('vocabulary')">🔤 Edit 14 Language Overlays</button>
            <button type="button" class="btn btn-sec" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('validation')">🛡️ Run 28-Track Bulk Audit</button>
            <button type="button" class="btn btn-sec" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('media')">🖼️ Browse 100 WebP Photos</button>
            <button type="button" class="btn btn-sec" style="font-size:12.5px;" onclick="switchCmsWorkspaceTab('export')">📤 Export Clean Course JSON</button>
          </div>
        </div>

        <div class="card" style="padding:16px;">
          <h3 style="margin:0 0 10px 0; font-size:15px; font-weight:800;">🕒 Recent Studio Audit Log (${m.recentAuditLogs.length})</h3>
          ${
            m.recentAuditLogs.length === 0
              ? '<div style="font-size:12.5px; color:var(--text-secondary);">No studio mutations recorded in this session yet. Edit a draft, import a JSON package, or create a snapshot to populate the audit log.</div>'
              : `<div style="max-height:190px; overflow-y:auto; font-size:12px;">
                  ${m.recentAuditLogs
                    .slice(0, 8)
                    .map(
                      (ev) => `
                      <div style="padding:6px 0; border-bottom:1px solid var(--border-subtle);">
                        <div style="font-weight:700;"><code>${escapeHtml(ev.operation)}</code> — <span style="color:var(--accent);">${escapeHtml(ev.courseTrackId)}</span></div>
                        <div style="color:var(--text-secondary);">${escapeHtml(ev.summary)} (${new Date(ev.timestamp).toLocaleTimeString()})</div>
                      </div>
                    `
                    )
                    .join('')}
                </div>`
          }
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 4. TAB 2: COURSE MANAGER (ALL 28 COURSE TRACKS)
// ============================================================================

function renderCmsCoursesTab(): string {
  let tracks = getAllCmsTrackSummaries();

  if (cmsUiState.courseDirectionFilter !== 'all') {
    tracks = tracks.filter(
      (t) => t.learningDirection === cmsUiState.courseDirectionFilter
    );
  }
  if (cmsUiState.courseStatusFilter !== 'all') {
    tracks = tracks.filter(
      (t) => t.lifecycleState === cmsUiState.courseStatusFilter
    );
  }
  if (cmsUiState.courseSearchQuery.trim()) {
    const q = cmsUiState.courseSearchQuery.trim().toLowerCase();
    tracks = tracks.filter(
      (t) =>
        t.trackId.toLowerCase().includes(q) ||
        t.courseTitle.toLowerCase().includes(q) ||
        t.nativeLanguage.toLowerCase().includes(q) ||
        t.targetLanguage.toLowerCase().includes(q)
    );
  }

  tracks.sort((a, b) => {
    if (cmsUiState.courseSortBy === 'modules')
      return (
        b.publishedModuleCount +
        b.draftModuleCount -
        (a.publishedModuleCount + a.draftModuleCount)
      );
    if (cmsUiState.courseSortBy === 'updated')
      return (b.lastModifiedAt || 0) - (a.lastModifiedAt || 0);
    return a.courseTitle.localeCompare(b.courseTitle);
  });

  return `
    <div data-testid="cms-courses-view">
      <div class="card" style="margin-bottom:14px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">🗂️ Visual Course Track Registry (${tracks.length} / 28 Tracks Shown)</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Inspect, edit in draft, validate, preview, or export any of the 14 Foreign Language tracks or 14 English for Speakers of Other Languages tracks.
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input
              type="search"
              data-testid="cms-course-filter-search"
              class="input-box"
              style="width:200px; min-height:34px; font-size:12px;"
              placeholder="Filter by title or code..."
              value="${escapeHtml(cmsUiState.courseSearchQuery)}"
              oninput="setCmsCourseManagerFilter('search', this.value)"
            />
            <select class="input-box" style="width:185px; min-height:34px; font-size:12px;" onchange="setCmsCourseManagerFilter('direction', this.value)">
              <option value="all" ${cmsUiState.courseDirectionFilter === 'all' ? 'selected' : ''}>All Directions (28)</option>
              <option value="en_to_foreign" ${cmsUiState.courseDirectionFilter === 'en_to_foreign' ? 'selected' : ''}>Foreign Languages (EN → X) (14)</option>
              <option value="foreign_to_en" ${cmsUiState.courseDirectionFilter === 'foreign_to_en' ? 'selected' : ''}>Learn English (X → EN) (14)</option>
            </select>
            <select class="input-box" style="width:155px; min-height:34px; font-size:12px;" onchange="setCmsCourseManagerFilter('status', this.value)">
              <option value="all" ${cmsUiState.courseStatusFilter === 'all' ? 'selected' : ''}>All Lifecycle States</option>
              <option value="PUBLISHED" ${cmsUiState.courseStatusFilter === 'PUBLISHED' ? 'selected' : ''}>PUBLISHED</option>
              <option value="DRAFT" ${cmsUiState.courseStatusFilter === 'DRAFT' ? 'selected' : ''}>DRAFT</option>
              <option value="VALIDATED" ${cmsUiState.courseStatusFilter === 'VALIDATED' ? 'selected' : ''}>VALIDATED</option>
              <option value="EMPTY" ${cmsUiState.courseStatusFilter === 'EMPTY' ? 'selected' : ''}>EMPTY</option>
            </select>
            <select class="input-box" style="width:145px; min-height:34px; font-size:12px;" onchange="setCmsCourseManagerFilter('sort', this.value)">
              <option value="title" ${cmsUiState.courseSortBy === 'title' ? 'selected' : ''}>Sort: Title</option>
              <option value="modules" ${cmsUiState.courseSortBy === 'modules' ? 'selected' : ''}>Sort: Module Count</option>
              <option value="updated" ${cmsUiState.courseSortBy === 'updated' ? 'selected' : ''}>Sort: Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
        ${tracks.map((t) => renderCmsCourseTrackCard(t)).join('')}
      </div>
    </div>
  `;
}

function renderCmsOriginStatusBadge(
  status?: CmsContentOriginStatus | unknown,
  testId?: string
): string {
  const s = (status as CmsContentOriginStatus | undefined) || 'PUBLISHED';
  const styleMap: Record<
    CmsContentOriginStatus,
    { bg: string; fg: string; label: string }
  > = {
    PUBLISHED: {
      bg: 'var(--success-container)',
      fg: 'var(--success-on-container)',
      label: 'PUBLISHED',
    },
    UNCHANGED: {
      bg: 'var(--surface-2)',
      fg: 'var(--text-secondary)',
      label: 'UNCHANGED',
    },
    MODIFIED_DRAFT: {
      bg: 'var(--warn-container)',
      fg: 'var(--warn-on-container)',
      label: 'MODIFIED DRAFT',
    },
    NEW_DRAFT: {
      bg: 'var(--accent-container)',
      fg: 'var(--accent-on-container)',
      label: 'NEW DRAFT',
    },
  };
  const cfg = styleMap[s] || styleMap.PUBLISHED;
  return `<span ${testId ? `data-testid="${escapeHtml(testId)}"` : ''} class="tag" style="background:${cfg.bg}; color:${cfg.fg}; font-size:9.5px; padding:1px 6px; font-weight:800;">${cfg.label}</span>`;
}

function renderCmsCourseTrackCard(t: CmsTrackSummary): string {
  const badgeColor =
    t.lifecycleState === 'PUBLISHED'
      ? 'var(--success-container)'
      : t.lifecycleState === 'DRAFT' || t.lifecycleState === 'VALIDATED'
        ? 'var(--accent-container)'
        : 'var(--surface-2)';
  const badgeText =
    t.lifecycleState === 'PUBLISHED'
      ? 'var(--success-on-container)'
      : t.lifecycleState === 'DRAFT' || t.lifecycleState === 'VALIDATED'
        ? 'var(--accent-on-container)'
        : 'var(--text-secondary)';

  const modDisplay =
    t.publishedModuleCount > 0
      ? t.hasDraft
        ? `${t.publishedModuleCount} Pub (+${t.draftModuleCount} Draft)`
        : `${t.publishedModuleCount} Pub`
      : `${t.draftModuleCount} Draft`;

  return `
    <div class="card" data-testid="cms-track-card-${t.trackId}" style="padding:14px; display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
          <div>
            <div style="font-size:14.5px; font-weight:800; color:var(--text);">${escapeHtml(t.courseTitle)}</div>
            <div style="font-size:12px; color:var(--text-secondary);"><code>${escapeHtml(t.trackId)}</code> • <code>${escapeHtml(t.nativeLanguage)} → ${escapeHtml(t.targetLanguage)}</code></div>
          </div>
          <span class="tag" style="background:${badgeColor}; color:${badgeText}; font-size:10.5px; font-weight:800;">
            ${escapeHtml(t.lifecycleState)}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-top:10px; padding:8px; background:var(--surface-2); border-radius:var(--radius-xs); text-align:center; font-size:11px;">
          <div>
            <div style="font-weight:800; font-size:12.5px;">${escapeHtml(modDisplay)}</div>
            <div style="color:var(--text-secondary);">Mods</div>
          </div>
          <div>
            <div style="font-weight:800; font-size:12.5px;">${t.draftLessonCount}</div>
            <div style="color:var(--text-secondary);">Lessons</div>
          </div>
          <div>
            <div style="font-weight:800; font-size:12.5px;">${t.versionCount}</div>
            <div style="color:var(--text-secondary);">Versions</div>
          </div>
          <div>
            <div style="font-weight:800; font-size:12.5px; color:${t.validationStatus === 'errors' ? 'var(--danger)' : 'var(--success)'};">
              ${escapeHtml(t.validationStatus)}
            </div>
            <div style="color:var(--text-secondary);">Audit</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button type="button" class="btn" data-testid="cms-card-btn-editor-${t.trackId}" style="flex:1; min-height:30px; padding:4px 8px; font-size:11.5px;" onclick="switchCmsWorkspaceTab('editor', '${t.trackId}')">✏️ Editor</button>
        <button type="button" class="btn btn-sec" data-testid="cms-card-btn-preview-${t.trackId}" style="min-height:30px; padding:4px 8px; font-size:11.5px;" onclick="switchCmsWorkspaceTab('preview', '${t.trackId}')">👁️ Preview</button>
        <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 8px; font-size:11.5px;" onclick="switchCmsWorkspaceTab('validation', '${t.trackId}')">🛡️ Audit</button>
        <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 8px; font-size:11.5px;" onclick="switchCmsWorkspaceTab('export', '${t.trackId}')">📤 Export</button>
      </div>
    </div>
  `;
}

// ============================================================================
// 5. TAB 3: HIERARCHICAL COURSE, MODULE, LESSON & ACTIVITY EDITOR
// ============================================================================

function renderCmsEditorTab(): string {
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const pkg = draft.draftPackage;
  const baselinePkg = getPublishedBaselineCoursePackage(
    cmsUiState.selectedTrackId
  );
  const hasPublishedBaseline = Boolean(
    baselinePkg && baselinePkg.modules.length > 0
  );
  const activeMod = pkg.modules.find(
    (m) => m.moduleId === cmsUiState.selectedModuleId
  );
  const activeSec = (activeMod?.sections || []).find(
    (s) => s.sectionId === cmsUiState.selectedSectionId
  );
  const activeLesson = (activeSec?.lessons || activeMod?.lessons || []).find(
    (l) => l.lessonId === cmsUiState.selectedLessonId
  );
  const activeActivity = (activeLesson?.activities || []).find(
    (a) => a.activityId === cmsUiState.selectedActivityId
  );

  const isBuiltinUk =
    cmsUiState.selectedTrackId === PUBLISHED_UKRAINIAN_TRACK_ID;
  const modifiedCount = draft.modifiedModuleIds?.length || 0;
  const newDraftCount = draft.newDraftModuleIds?.length || 0;
  const hasDraftEdits = Boolean(draft.hasDraftChanges);

  const pubVsDraftDiff =
    cmsUiState.showDraftVsPublishedDiffDrawer && hasPublishedBaseline
      ? computeCmsDraftVsPublishedDiff(cmsUiState.selectedTrackId)
      : null;

  const sourceOverlayBannerHtml = hasPublishedBaseline
    ? `
      <div data-testid="cms-editor-source-banner" style="margin-top:10px; padding:10px 12px; border-radius:var(--radius-xs); background:${hasDraftEdits ? 'var(--warn-container)' : 'var(--surface-2)'}; color:${hasDraftEdits ? 'var(--warn-on-container)' : 'var(--text)'}; border-left:4px solid ${hasDraftEdits ? 'var(--warn)' : 'var(--success)'}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:12px;">
        <div>
          <div style="font-weight:800;">
            ${
              hasDraftEdits
                ? `✏️ Effective Curriculum View: ${baselinePkg?.modules.length || 29} Published Baseline Modules + Unpublished Draft Overlay (${modifiedCount} Modified, ${newDraftCount} New Draft Module(s))`
                : `🏛️ Source: Published Baseline (${baselinePkg?.modules.length || 29} Authoritative Modules Loaded • 0 Unpublished Draft Changes)`
            }
          </div>
          <div style="font-size:11.5px; opacity:0.9; margin-top:2px;">
            🔒 Built-in Ukrainian curriculum in <code>src/courseData.ts</code> is read-only. Any edits you save here are stored strictly in an isolated Studio Draft overlay until published or discarded.
          </div>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-btn-compare-published"
            style="min-height:28px; padding:3px 9px; font-size:11.5px;"
            onclick="toggleCmsDraftVsPublishedDiffDrawer()"
          >
            ${cmsUiState.showDraftVsPublishedDiffDrawer ? 'Hide Published vs Draft Diff' : '🔍 Compare Draft vs Published'}
          </button>
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-editor-btn-preview-published"
            style="min-height:28px; padding:3px 9px; font-size:11.5px;"
            onclick="openCmsPreviewWithMode('published')"
          >
            🏛️ Preview Published
          </button>
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-editor-btn-preview-draft"
            style="min-height:28px; padding:3px 9px; font-size:11.5px;"
            onclick="openCmsPreviewWithMode('draft')"
          >
            👁️ Preview Draft
          </button>
          ${
            hasDraftEdits
              ? `<button
                  type="button"
                  class="btn btn-sec"
                  data-testid="cms-btn-discard-draft"
                  style="min-height:28px; padding:3px 10px; font-size:11.5px; border-color:var(--danger); color:var(--danger);"
                  onclick="handleDiscardCmsDraftOverlay()"
                >
                  🗑️ Discard Draft Changes
                </button>`
              : ''
          }
        </div>
      </div>
    `
    : '';

  return `
    <div data-testid="cms-editor-view">
      <!-- Top Draft Header & Lifecycle Controls -->
      <div class="card" style="margin-bottom:14px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <h2 style="margin:0; font-size:16px; font-weight:800;">✏️ Course Curriculum Editor: ${escapeHtml(pkg.courseTitle)}</h2>
              <span class="tag" data-testid="cms-editor-lifecycle-tag" style="background:var(--accent-container); color:var(--accent-on-container); font-size:11px; font-weight:800;">State: ${escapeHtml(draft.lifecycleState)}</span>
              <span class="tag" data-testid="cms-editor-module-count-tag" style="background:var(--surface-2); color:var(--text); font-size:11px; font-weight:800;">${pkg.modules.length} Module(s)</span>
              <span class="tag" style="background:var(--surface-2); color:var(--text-secondary); font-size:11px;">Schema v${escapeHtml(pkg.schemaVersion)}</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:3px;">
              ${
                isBuiltinUk
                  ? 'Inspecting & editing the 29-module Learn Ukrainian curriculum via non-destructive Published Baseline + Studio Draft Overlay.'
                  : 'All edits occur in isolated DRAFT storage until explicitly validated and published to the active Course Track.'
              }
            </div>
          </div>

          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="handleAddCmsModulePrompt()">+ Add Module</button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-inspect-json" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="toggleCmsSourceJsonDrawer()">
              ${cmsUiState.showSourceJsonDrawer ? 'Hide Source JSON' : '{ } Inspect Source JSON'}
            </button>
            <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="handleCreateManualSnapshot()">📸 Save Version Snapshot</button>
            <button type="button" class="btn btn-success" data-testid="cms-btn-publish-draft" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="handleCmsLifecycleTransition('PUBLISHED')">🚀 Validate & Publish</button>
          </div>
        </div>

        ${sourceOverlayBannerHtml}

        ${
          pubVsDraftDiff
            ? `<div data-testid="cms-published-vs-draft-diff-drawer" style="margin-top:12px; padding:12px; background:var(--surface-2); border:1px solid var(--border-strong); border-radius:var(--radius-xs); font-size:12px;">
                <div style="font-weight:800; margin-bottom:6px;">🔍 Comparison: Published Baseline (<code>v0_published_baseline</code>) vs Effective Draft</div>
                <div><b>Total Differences:</b> ${pubVsDraftDiff.totalDifferences}</div>
                <div style="margin-top:3px;"><b>Added Draft Modules:</b> ${pubVsDraftDiff.addedModuleIds.join(', ') || 'None'} • <b>Removed Modules:</b> ${pubVsDraftDiff.removedModuleIds.join(', ') || 'None'}</div>
                <div style="margin-top:3px;"><b>Changed Module Titles:</b> ${pubVsDraftDiff.changedModuleTitles.map((c) => `${c.moduleId} ("${escapeHtml(c.before)}" → "${escapeHtml(c.after)}")`).join(' | ') || 'None'}</div>
                <div style="margin-top:3px;"><b>Modified Lessons:</b> ${pubVsDraftDiff.modifiedLessonIds.join(', ') || 'None (Matches Published Baseline)'}</div>
                <div style="margin-top:3px;"><b>Modified Activity Answer Keys:</b> ${pubVsDraftDiff.changedActivityAnswerKeys.map((a) => a.activityId).join(', ') || 'None'}</div>
              </div>`
            : ''
        }

        ${
          cmsUiState.showSourceJsonDrawer
            ? `<div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border-subtle);">
                <div style="font-size:12px; font-weight:800; margin-bottom:6px;">Raw UniversalCoursePackageV1 Effective Curriculum JSON (${pkg.modules.length} Modules — Read-Only Inspector):</div>
                <textarea data-testid="cms-editor-source-json-textarea" readonly class="input-box" style="width:100%; min-height:200px; font-family:monospace; font-size:11.5px;">${escapeHtml(JSON.stringify(pkg, null, 2))}</textarea>
              </div>`
            : ''
        }
      </div>

      ${
        pkg.modules.length === 0
          ? `<div class="card" data-testid="cms-editor-empty-state" style="padding:28px; text-align:center;">
              <h3 style="margin:0 0 8px 0;">📭 This Course Track Has No Draft Modules Yet</h3>
              <p style="margin:0 0 16px 0; color:var(--text-secondary); font-size:13px;">
                Start by creating a new module below or importing a JSON package in the Import & Merge tab.
              </p>
              <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn" data-testid="cms-btn-create-first-module" onclick="handleAddCmsModulePrompt()">+ Create First Module in Draft</button>
                <button type="button" class="btn btn-sec" onclick="switchCmsWorkspaceTab('importer')">📥 Import Course JSON Fixture</button>
              </div>
            </div>`
          : `
          <!-- 3-Column Hierarchical Editor Layout -->
          <div class="cms-three-col-grid">
            <!-- Column 1: Module, Section & Lesson Tree -->
            <div class="card" style="padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:12.5px; font-weight:800;" data-testid="cms-editor-tree-header">📚 Modules (${pkg.modules.length})</span>
                <button type="button" class="btn btn-sec" style="min-height:26px; padding:2px 8px; font-size:11px;" onclick="handleAddCmsModulePrompt()">+ Mod</button>
              </div>
              <div data-testid="cms-editor-module-tree-list" style="max-height:580px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
                ${pkg.modules
                  .map((m, mIdx) => {
                    const isSelectedMod =
                      m.moduleId === cmsUiState.selectedModuleId;
                    const modOrigin =
                      (m.metadata?.cmsOriginStatus as
                        | CmsContentOriginStatus
                        | undefined) ||
                      (hasPublishedBaseline
                        ? hasDraftEdits
                          ? 'UNCHANGED'
                          : 'PUBLISHED'
                        : 'NEW_DRAFT');
                    return `
                      <div data-testid="cms-tree-module-${m.moduleId}" style="padding:8px; border-radius:var(--radius-xs); border:1px solid ${isSelectedMod ? 'var(--accent)' : 'var(--border-subtle)'}; background:${isSelectedMod ? 'var(--surface-2)' : 'var(--surface-1)'};">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:4px;">
                          <div style="cursor:pointer; font-size:12.5px; font-weight:800; color:var(--text);" onclick="selectCmsEditorModule('${m.moduleId}')">
                            <span class="tag" style="font-size:10px; padding:1px 5px;">${escapeHtml(m.proficiencyLevel || 'A1')}</span>
                            ${escapeHtml(m.title)}
                          </div>
                          <div style="display:flex; gap:3px; flex-shrink:0;">
                            <button type="button" class="btn btn-sec" title="Move Up" style="min-height:22px; padding:1px 5px; font-size:10px;" ${mIdx === 0 ? 'disabled' : ''} onclick="handleMoveCmsModule(${mIdx}, ${mIdx - 1})">↑</button>
                            <button type="button" class="btn btn-sec" title="Move Down" style="min-height:22px; padding:1px 5px; font-size:10px;" ${mIdx === pkg.modules.length - 1 ? 'disabled' : ''} onclick="handleMoveCmsModule(${mIdx}, ${mIdx + 1})">↓</button>
                            <button type="button" class="btn btn-sec" title="Duplicate Module" style="min-height:22px; padding:1px 5px; font-size:10px;" onclick="handleDuplicateCmsModule('${m.moduleId}')">⧉</button>
                          </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-top:4px;">
                          <span style="font-size:10.5px; color:var(--text-secondary);">ID: <code>${escapeHtml(m.moduleId)}</code> • ${(m.vocabularyReferences || []).length} Vocab</span>
                          ${renderCmsOriginStatusBadge(modOrigin, `cms-module-origin-badge-${m.moduleId}`)}
                        </div>
                        ${
                          isSelectedMod
                            ? `<div style="margin-top:8px; padding-left:8px; border-left:2px solid var(--accent); display:flex; flex-direction:column; gap:6px;">
                                ${(m.sections || [])
                                  .map(
                                    (sec) => `
                                    <div>
                                      <div style="font-size:10.5px; font-weight:800; color:var(--text-secondary); margin:2px 0 3px 0;">
                                        📂 ${escapeHtml(sec.title)}
                                      </div>
                                      <div style="display:flex; flex-direction:column; gap:3px;">
                                        ${(sec.lessons || [])
                                          .map((les) => {
                                            const isLesSel =
                                              les.lessonId ===
                                              cmsUiState.selectedLessonId;
                                            return `
                                              <button
                                                type="button"
                                                data-testid="cms-tree-lesson-${les.lessonId}"
                                                class="btn ${isLesSel ? '' : 'btn-sec'}"
                                                style="text-align:left; justify-content:space-between; min-height:28px; padding:4px 8px; font-size:11.5px;"
                                                onclick="selectCmsEditorLesson('${m.moduleId}', '${sec.sectionId}', '${les.lessonId}')"
                                              >
                                                <span>📄 ${escapeHtml(les.title)}</span>
                                              </button>
                                            `;
                                          })
                                          .join('')}
                                      </div>
                                    </div>
                                  `
                                  )
                                  .join('')}
                              </div>`
                            : ''
                        }
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- Column 2: Lesson Content & Metadata Editor -->
            <div class="card" style="padding:14px;">
              ${
                activeLesson
                  ? (() => {
                      const lesOrigin =
                        (activeLesson.metadata?.cmsOriginStatus as
                          | CmsContentOriginStatus
                          | undefined) ||
                        (activeMod?.metadata?.cmsOriginStatus as
                          | CmsContentOriginStatus
                          | undefined) ||
                        'PUBLISHED';
                      const ukExt = activeMod?.metadata
                        ?.legacyUkrainianModuleExtension as
                        | {
                            subtitle?: string;
                            grammarFocus?: string[];
                            vocabCount?: number;
                            inlineChecksCount?: number;
                            practiceDrillsCount?: number;
                            examQuestionsCount?: number;
                            dialoguesCount?: number;
                          }
                        | undefined;

                      return `
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px;">
                          <div>
                            <h3 style="margin:0; font-size:15px; font-weight:800;">📄 Lesson Editor</h3>
                            <div style="font-size:11px; color:var(--text-secondary);">Stable Lesson ID: <code>${escapeHtml(activeLesson.lessonId)}</code> (Module: <code>${escapeHtml(activeMod?.moduleId || '')}</code>)</div>
                          </div>
                          ${renderCmsOriginStatusBadge(lesOrigin, 'cms-active-lesson-origin-badge')}
                        </div>

                        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
                          <span class="tag" style="font-size:10.5px;">📚 ${(activeLesson.vocabularyRefs || []).length} Vocab Ref(s)</span>
                          <span class="tag" style="font-size:10.5px;">🖼️ ${(activeLesson.mediaRefs || []).length} Media Ref(s)</span>
                          <span class="tag" style="font-size:10.5px;">🎯 ${(activeLesson.activities || []).length} Activity Item(s)</span>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                          <div>
                            <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Lesson Title</label>
                            <input
                              id="cms-edit-lesson-title"
                              data-testid="cms-edit-lesson-title"
                              type="text"
                              class="input-box"
                              style="width:100%; font-size:13px; font-weight:700;"
                              value="${escapeHtml(activeLesson.title)}"
                            />
                          </div>
                          <div>
                            <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Summary / Subtitle</label>
                            <input
                              id="cms-edit-lesson-summary"
                              data-testid="cms-edit-lesson-summary"
                              type="text"
                              class="input-box"
                              style="width:100%; font-size:12.5px;"
                              value="${escapeHtml(activeLesson.summary || '')}"
                            />
                          </div>
                          <div>
                            <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Instructional Prose</label>
                            <textarea
                              id="cms-edit-lesson-text"
                              data-testid="cms-edit-lesson-text"
                              class="input-box"
                              style="width:100%; min-height:150px; font-size:12.5px; line-height:1.5;"
                            >${escapeHtml(activeLesson.instructionalText || '')}</textarea>
                          </div>
                          <button
                            type="button"
                            class="btn"
                            data-testid="cms-btn-save-lesson"
                            onclick="handleSaveCmsLessonEdits()"
                          >
                            💾 Save Lesson Changes to Draft Overlay
                          </button>

                          ${
                            ukExt
                              ? `<div data-testid="cms-ukrainian-extension-inspector" style="margin-top:6px; padding:10px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); font-size:11.5px;">
                                  <div style="font-weight:800; margin-bottom:4px;">🇺🇦 Preserved Ukrainian Module Metadata (${escapeHtml(activeMod?.moduleId || '')})</div>
                                  <div style="color:var(--text-secondary);">
                                    <b>Subtitle:</b> ${escapeHtml(ukExt.subtitle || '')}<br/>
                                    <b>Grammar Focus:</b> ${escapeHtml((ukExt.grammarFocus || []).join(' • '))}<br/>
                                    <b>Authoritative Counts:</b> ${ukExt.vocabCount || 0} Vocab Words • ${ukExt.inlineChecksCount || 0} Inline Checks • ${ukExt.practiceDrillsCount || 0} Practice Drills • ${ukExt.examQuestionsCount || 0} Exam Items • ${ukExt.dialoguesCount || 0} Dialogues
                                  </div>
                                </div>`
                              : ''
                          }
                        </div>
                      `;
                    })()
                  : '<div style="font-size:13px; color:var(--text-secondary);">Select a lesson from the module tree to edit its prose and metadata.</div>'
              }
            </div>

            <!-- Column 3: Activity & Assessment Editor -->
            <div class="card" style="padding:14px;">
              ${
                activeLesson
                  ? `
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div>
                      <h3 style="margin:0; font-size:15px; font-weight:800;">🎯 Lesson Activities (${activeLesson.activities?.length || 0})</h3>
                      <div style="font-size:11px; color:var(--text-secondary);">Edit prompts, multiple-choice options, answer keys, and explanations.</div>
                    </div>
                  </div>

                  <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; max-height:110px; overflow-y:auto;">
                    ${(activeLesson.activities || [])
                      .map(
                        (act, idx) => `
                        <button
                          type="button"
                          data-testid="cms-activity-pill-${act.activityId}"
                          class="stage-pill ${act.activityId === cmsUiState.selectedActivityId ? 'active' : ''}"
                          style="min-height:28px; padding:3px 10px; font-size:11.5px;"
                          onclick="selectCmsEditorActivity('${act.activityId}')"
                        >
                          #${idx + 1} (${escapeHtml(act.activityType)})
                        </button>
                      `
                      )
                      .join('')}
                  </div>

                  ${
                    activeActivity
                      ? (() => {
                          const payload = (activeActivity.payload || {}) as {
                            options?: string[];
                            correctIndex?: number;
                            explanation?: string;
                          };
                          return `
                            <div style="display:flex; flex-direction:column; gap:10px;">
                              <div style="font-size:11px; color:var(--text-secondary);">Activity ID: <code>${escapeHtml(activeActivity.activityId)}</code> • Type: <b>${escapeHtml(activeActivity.activityType)}</b></div>
                              <div>
                                <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Activity Title</label>
                                <input
                                  id="cms-edit-activity-title"
                                  type="text"
                                  class="input-box"
                                  style="width:100%; font-size:12.5px; font-weight:700;"
                                  value="${escapeHtml(activeActivity.title || '')}"
                                />
                              </div>
                              <div>
                                <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Question / Activity Prompt</label>
                                <input
                                  id="cms-edit-activity-prompt"
                                  data-testid="cms-edit-activity-prompt"
                                  type="text"
                                  class="input-box"
                                  style="width:100%; font-size:12.5px;"
                                  value="${escapeHtml(activeActivity.prompt || '')}"
                                />
                              </div>
                              <div>
                                <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Options (One Option per Line)</label>
                                <textarea
                                  id="cms-edit-activity-options"
                                  class="input-box"
                                  style="width:100%; min-height:85px; font-size:12px;"
                                >${escapeHtml((payload.options || []).join('\n'))}</textarea>
                              </div>
                              <div>
                                <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Correct Index (0-based)</label>
                                <input
                                  id="cms-edit-activity-correct-idx"
                                  type="number"
                                  class="input-box"
                                  style="width:100%; font-size:12.5px;"
                                  value="${typeof payload.correctIndex === 'number' ? payload.correctIndex : 0}"
                                />
                              </div>
                              <div>
                                <label style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">Pedagogical Explanation</label>
                                <textarea
                                  id="cms-edit-activity-explanation"
                                  class="input-box"
                                  style="width:100%; min-height:60px; font-size:12px;"
                                >${escapeHtml(payload.explanation || '')}</textarea>
                              </div>
                              <button
                                type="button"
                                class="btn"
                                data-testid="cms-btn-save-activity"
                                onclick="handleSaveCmsActivityEdits()"
                              >
                                💾 Save Activity Changes to Draft
                              </button>
                            </div>
                          `;
                        })()
                      : '<div style="font-size:12.5px; color:var(--text-secondary);">No activities in this lesson yet.</div>'
                  }
                `
                  : '<div style="font-size:13px; color:var(--text-secondary);">Select a lesson to inspect or edit its activities.</div>'
              }
            </div>
          </div>
        `
      }
    </div>
  `;
}

// ============================================================================
// 6. TAB 4: JSON IMPORT & SAFE INCREMENTAL MERGE MANAGER
// ============================================================================

function renderCmsImporterTab(): string {
  return `
    <div data-testid="cms-importer-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <h2 style="margin:0 0 6px 0; font-size:16px; font-weight:800;">📥 Course JSON Import & Safe Incremental Merge Manager</h2>
        <p style="margin:0 0 12px 0; font-size:12.5px; color:var(--text-secondary);">
          All JSON imports land in <b>DRAFT</b> state first, automatically create a version snapshot, and enforce strict <code>courseTrackId</code> and language-pair matching so a course can never be imported into the wrong track.
        </p>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span style="font-size:12px; font-weight:800;">Import Mode:</span>
            <select
              id="cms-import-mode-select"
              data-testid="cms-import-mode-select"
              class="input-box"
              style="width:280px; min-height:34px; font-size:12px; font-weight:700;"
              onchange="setCmsImportMode(this.value)"
            >
              <option value="full_draft_import" ${cmsUiState.importMode === 'full_draft_import' ? 'selected' : ''}>Full Course Draft Import (Replaces Draft)</option>
              <option value="incremental_module_merge" ${cmsUiState.importMode === 'incremental_module_merge' ? 'selected' : ''}>Incremental Module Merge (Preserves Existing Modules)</option>
            </select>
          </div>

          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-es" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('es-to-en')">Load Spanish → English Fixture</button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-hi" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('en-to-hi')">Load English → Hindi (Devanagari) Fixture</button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-inc" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('es-incremental-mod3')">Load Incremental Module 3 Patch (es-to-en)</button>
          </div>
        </div>

        <textarea
          id="cms-importer-json-textarea"
          data-testid="cms-importer-json-textarea"
          class="input-box"
          style="width:100%; min-height:240px; font-family:monospace; font-size:12px; margin-bottom:10px;"
          placeholder="Paste a UniversalCoursePackageV1 JSON payload here..."
        >${escapeHtml(cmsUiState.importJsonText)}</textarea>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn" data-testid="cms-btn-execute-import" onclick="handleExecuteCmsDraftImport()">
            📥 Validate & Import into Draft (${escapeHtml(cmsUiState.selectedTrackId)})
          </button>
        </div>

        ${cmsUiState.lastImportBannerHtml ? `<div style="margin-top:12px;">${cmsUiState.lastImportBannerHtml}</div>` : ''}
      </div>
    </div>
  `;
}

// ============================================================================
// 7. TAB 5: VOCABULARY & 14 NATIVE-LANGUAGE OVERLAY MANAGER
// ============================================================================

function renderCmsVocabularyTab(): string {
  const allLexemes = getAllCanonicalEnglishLexemes();
  const filteredLexemes = cmsUiState.vocabSearchQuery.trim()
    ? allLexemes.filter(
        (l) =>
          l.headwordEn
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase()) ||
          l.lexemeId
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase()) ||
          l.coreMeaningEn
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase())
      )
    : allLexemes;

  const activeLexeme =
    allLexemes.find((l) => l.lexemeId === cmsUiState.selectedLexemeId) ||
    allLexemes[0];
  const overlaysForLexeme = activeLexeme
    ? getAllNativeOverlaysForLexeme(activeLexeme.lexemeId)
    : [];
  const activeOverlay = overlaysForLexeme.find(
    (ov) => ov.nativeLanguage === cmsUiState.selectedOverlayLang
  );
  const vocabIssues = validateCmsVocabularyRegistry();
  const foreignLanguages = getForeignLanguages();

  return `
    <div data-testid="cms-vocabulary-view">
      <div class="card" style="padding:14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">🔤 Shared Canonical English Lexemes & 14 Native-Language Overlays</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Architectural Rule: Canonical English lexemes (<code>en_lex_*</code>) store shared English definitions & IPA once. Each of the 14 learner languages has an isolated overlay so editing Spanish glosses never mutates Japanese or Hindi overlays.
            </div>
          </div>
          <span class="tag" style="background:${vocabIssues.length === 0 ? 'var(--success-container)' : 'var(--warn-container)'}; color:${vocabIssues.length === 0 ? 'var(--success-on-container)' : 'var(--warn-on-container)'}; font-size:11.5px; font-weight:800;">
            Vocabulary Audit: ${vocabIssues.length} Issue(s)
          </span>
        </div>
      </div>

      <div class="cms-three-col-grid">
        <!-- Column 1: Canonical English Lexeme List -->
        <div class="card" style="padding:12px;">
          <div style="font-size:12.5px; font-weight:800; margin-bottom:8px;">🇬🇧 Canonical English Lexemes (${filteredLexemes.length})</div>
          <input
            type="search"
            class="input-box"
            style="width:100%; min-height:32px; font-size:12px; margin-bottom:8px;"
            placeholder="Filter canonical English..."
            value="${escapeHtml(cmsUiState.vocabSearchQuery)}"
            oninput="setCmsVocabSearch(this.value)"
          />
          <div style="max-height:420px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
            ${filteredLexemes
              .map(
                (lex) => `
                <button
                  type="button"
                  data-testid="cms-lexeme-item-${lex.lexemeId}"
                  class="btn ${lex.lexemeId === activeLexeme?.lexemeId ? '' : 'btn-sec'}"
                  style="justify-content:space-between; text-align:left; min-height:34px; padding:6px 10px; font-size:12px;"
                  onclick="selectCmsVocabLexeme('${lex.lexemeId}')"
                >
                  <span><b>${escapeHtml(lex.headwordEn)}</b> <span style="opacity:0.75;">(${escapeHtml(lex.pos)})</span></span>
                  <span class="tag" style="font-size:10px;">${escapeHtml(lex.lexemeId)}</span>
                </button>
              `
              )
              .join('')}
          </div>
        </div>

        <!-- Column 2: Canonical English Lexeme Editor -->
        <div class="card" style="padding:14px;">
          ${
            activeLexeme
              ? `
              <h3 style="margin:0 0 4px 0; font-size:15px; font-weight:800;">🇬🇧 Canonical English Concept</h3>
              <div style="font-size:11px; color:var(--text-secondary); margin-bottom:10px;">ID: <code>${escapeHtml(activeLexeme.lexemeId)}</code> (Shared across all 14 X → EN tracks)</div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div>
                  <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">English Headword</label>
                  <input id="cms-lex-headword" type="text" class="input-box" style="width:100%; font-size:13px; font-weight:700;" value="${escapeHtml(activeLexeme.headwordEn)}" />
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                  <div>
                    <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">Part of Speech</label>
                    <input id="cms-lex-pos" type="text" class="input-box" style="width:100%; font-size:12px;" value="${escapeHtml(activeLexeme.pos)}" />
                  </div>
                  <div>
                    <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">US IPA</label>
                    <input id="cms-lex-ipa" type="text" class="input-box" style="width:100%; font-size:12px;" value="${escapeHtml(activeLexeme.ipaUs)}" />
                  </div>
                </div>
                <div>
                  <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">Canonical English Core Meaning</label>
                  <textarea id="cms-lex-meaning" class="input-box" style="width:100%; min-height:60px; font-size:12px;">${escapeHtml(activeLexeme.coreMeaningEn)}</textarea>
                </div>
                <button type="button" class="btn" onclick="handleSaveCanonicalLexeme('${activeLexeme.lexemeId}')">
                  💾 Save Canonical English Lexeme
                </button>
              </div>
            `
              : ''
          }
        </div>

        <!-- Column 3: Isolated 14 Native-Language Overlay Editor -->
        <div class="card" style="padding:14px;">
          ${
            activeLexeme
              ? `
              <h3 style="margin:0 0 4px 0; font-size:15px; font-weight:800;">🌐 Native-Language Overlay (${escapeHtml(cmsUiState.selectedOverlayLang.toUpperCase())})</h3>
              <div style="font-size:11px; color:var(--text-secondary); margin-bottom:10px;">
                Isolated overlay for <code>track:${escapeHtml(cmsUiState.selectedOverlayLang)}-to-en</code>. Editing this never alters any other language overlay.
              </div>

              <div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px;">
                ${foreignLanguages
                  .map(
                    (lang) => `
                    <button
                      type="button"
                      data-testid="cms-overlay-lang-${lang.code}"
                      class="stage-pill ${lang.code === cmsUiState.selectedOverlayLang ? 'active' : ''}"
                      style="min-height:26px; padding:2px 8px; font-size:11px;"
                      onclick="selectCmsOverlayLanguage('${lang.code}')"
                    >
                      ${escapeHtml(lang.code.toUpperCase())} (${escapeHtml(lang.nativeName)})
                    </button>
                  `
                  )
                  .join('')}
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                <div>
                  <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">Native Translation (${escapeHtml(cmsUiState.selectedOverlayLang.toUpperCase())})</label>
                  <input
                    id="cms-overlay-translation"
                    data-testid="cms-overlay-translation"
                    type="text"
                    class="input-box"
                    style="width:100%; font-size:13px; font-weight:700;"
                    value="${escapeHtml(activeOverlay?.translationNative || '')}"
                  />
                </div>
                <div>
                  <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">Native Explanation</label>
                  <textarea
                    id="cms-overlay-explanation"
                    data-testid="cms-overlay-explanation"
                    class="input-box"
                    style="width:100%; min-height:65px; font-size:12px;"
                  >${escapeHtml(activeOverlay?.explanationNative || '')}</textarea>
                </div>
                <div>
                  <label style="font-size:11px; font-weight:800; color:var(--text-secondary);">Pronunciation Tip for Native Speaker</label>
                  <input
                    id="cms-overlay-tip"
                    type="text"
                    class="input-box"
                    style="width:100%; font-size:12px;"
                    value="${escapeHtml(activeOverlay?.pronunciationTipForNativeSpeaker || '')}"
                  />
                </div>
                <button
                  type="button"
                  class="btn"
                  data-testid="cms-btn-save-overlay"
                  onclick="handleSaveNativeOverlay('${activeLexeme.lexemeId}', '${cmsUiState.selectedOverlayLang}')"
                >
                  💾 Save ${escapeHtml(cmsUiState.selectedOverlayLang.toUpperCase())} Overlay Only
                </button>
              </div>
            `
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 8. TAB 6: VALIDATION CENTER & BULK 28-TRACK AUDIT
// ============================================================================

function renderCmsValidationTab(): string {
  const report: CmsValidationReport = validateCmsCourseDraft(
    cmsUiState.selectedTrackId
  );
  const notes = getCmsManualReviewNotes(cmsUiState.selectedTrackId);

  return `
    <div data-testid="cms-validation-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">🛡️ Course Validation & Pedagogical Review Center</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Validating <code>${escapeHtml(cmsUiState.selectedTrackId)}</code> — Publication Ready: <b style="color:${report.canPublish ? 'var(--success)' : 'var(--danger)'};">${report.canPublish ? 'YES (0 Blocking Errors)' : `NO (${report.errorCount} Blocking Error(s) or Empty/Synthetic)`}</b>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" data-testid="cms-btn-run-bulk-audit" onclick="handleRunCmsBulkAudit()">
              🔍 Run Bulk Audit Across All 28 Tracks
            </button>
          </div>
        </div>

        <!-- Issue Breakdown Pills -->
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
          <span class="tag" style="background:var(--danger-container); color:var(--danger-on-container); font-weight:800;">❌ ${report.errorCount} Blocking Errors</span>
          <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">⚠️ ${report.warningCount} Warnings</span>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">ℹ️ ${report.infoCount} Pedagogical Info Notices</span>
        </div>

        <!-- Issue List -->
        <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
          ${
            report.issues.length === 0
              ? '<div style="font-size:12.5px; color:var(--text-secondary);">No validation issues reported for this track.</div>'
              : report.issues
                  .map((iss: CmsValidationIssue) => {
                    const borderCol =
                      iss.severity === 'ERROR'
                        ? 'var(--danger)'
                        : iss.severity === 'WARNING'
                          ? 'var(--warn)'
                          : 'var(--accent)';
                    return `
                      <div style="padding:10px 12px; background:var(--surface-2); border-left:4px solid ${borderCol}; border-radius:var(--radius-xs); font-size:12.5px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                          <span><b>[${escapeHtml(iss.severity)}]</b> <code>${escapeHtml(iss.code)}</code></span>
                          <span style="font-size:11px; color:var(--text-secondary);"><code>${escapeHtml(iss.locationPath)}</code></span>
                        </div>
                        <div style="margin-top:4px; color:var(--text);">${escapeHtml(iss.message)}</div>
                      </div>
                    `;
                  })
                  .join('')
          }
        </div>
      </div>

      <!-- Manual Human Pedagogical Review Notes -->
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:800;">📝 Human Pedagogical Reviewer Notes (${notes.length})</h3>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
          <input id="cms-review-note-input" type="text" class="input-box" style="flex:1; min-width:240px; font-size:12.5px;" placeholder="Add a manual linguistic/pedagogical review note for this draft..." />
          <select id="cms-review-status-select" class="input-box" style="width:190px; font-size:12px;">
            <option value="approved_by_reviewer">approved_by_reviewer</option>
            <option value="needs_revision">needs_revision</option>
            <option value="pending_review">pending_review</option>
          </select>
          <button type="button" class="btn btn-sec" onclick="handleAddCmsReviewerNote()">+ Add Review Note</button>
        </div>
        ${
          notes.length === 0
            ? '<div style="font-size:12px; color:var(--text-secondary);">No human review notes recorded yet for this track.</div>'
            : notes
                .map(
                  (n) => `
                  <div style="padding:8px 10px; background:var(--surface-2); border-radius:var(--radius-xs); margin-bottom:6px; font-size:12px;">
                    <b>[${escapeHtml(n.reviewerStatus)}]</b> ${escapeHtml(n.noteText)} — <span style="color:var(--text-secondary);">(${new Date(n.createdAt).toLocaleTimeString()})</span>
                  </div>
                `
                )
                .join('')
        }
      </div>

      ${
        cmsUiState.lastBulkAuditSummary
          ? `
          <div class="card" data-testid="cms-bulk-audit-results" style="padding:16px;">
            <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:800;">
              📊 Bulk 28-Track Audit Summary (${cmsUiState.lastBulkAuditSummary.auditedTrackCount} Tracks Audited • ${cmsUiState.lastBulkAuditSummary.totalErrors} Total Errors • ${cmsUiState.lastBulkAuditSummary.totalWarnings} Total Warnings)
            </h3>
          </div>
        `
          : ''
      }
    </div>
  `;
}

// ============================================================================
// 9. TAB 7: VERSION HISTORY, STRUCTURED DIFFS & SAFE ROLLBACK
// ============================================================================

function renderCmsVersionsTab(): string {
  const history = getCmsVersionHistory(cmsUiState.selectedTrackId);
  const leftId =
    cmsUiState.diffLeftVersionId ||
    history[1]?.versionId ||
    history[0]?.versionId ||
    '';
  const rightId = cmsUiState.diffRightVersionId || history[0]?.versionId || '';
  const diff =
    leftId &&
    rightId &&
    history.some((h) => h.versionId === leftId) &&
    history.some((h) => h.versionId === rightId)
      ? compareCmsVersionSnapshots(cmsUiState.selectedTrackId, leftId, rightId)
      : null;

  return `
    <div data-testid="cms-versions-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">🕒 Version History & Safe Rollback (${history.length} Snapshots)</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Every draft save, import, publication, and rollback records an immutable version snapshot for <code>${escapeHtml(cmsUiState.selectedTrackId)}</code>.
            </div>
          </div>
          <button type="button" class="btn btn-sec" onclick="handleCreateManualSnapshot()">📸 Create Manual Snapshot Now</button>
        </div>

        ${
          history.length === 0
            ? '<div style="font-size:12.5px; color:var(--text-secondary);">No snapshots created yet for this track. Edit or import a draft, or click "Create Manual Snapshot Now".</div>'
            : `<div style="display:flex; flex-direction:column; gap:8px;">
                ${history
                  .map(
                    (snap, idx) => `
                    <div data-testid="cms-version-row-${idx}" style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:12.5px;">
                      <div>
                        <span class="tag" style="font-size:10.5px; font-weight:800;">${escapeHtml(snap.versionId)}</span>
                        <b>${escapeHtml(snap.changeSummary)}</b>
                        <span style="color:var(--text-secondary); font-size:11.5px;">
                          • <code>${escapeHtml(snap.revisionOrigin)}</code> • ${snap.packageSnapshot.modules.length} Mod(s) • ${new Date(snap.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style="display:flex; gap:6px;">
                        <button
                          type="button"
                          class="btn btn-sec"
                          data-testid="cms-btn-restore-version-${idx}"
                          style="min-height:28px; padding:3px 10px; font-size:11.5px;"
                          onclick="handleRestoreCmsSnapshot('${snap.versionId}')"
                        >
                          ⏪ Restore ${escapeHtml(snap.versionId)}
                        </button>
                      </div>
                    </div>
                  `
                  )
                  .join('')}
              </div>`
        }
      </div>

      ${
        history.length >= 1
          ? `
          <div class="card" style="padding:16px;">
            <h3 style="margin:0 0 10px 0; font-size:15px; font-weight:800;">🔍 Structured Version Diff Comparison</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
              <select class="input-box" style="flex:1; min-width:220px; font-size:12px;" onchange="setCmsDiffSelection('left', this.value)">
                ${history
                  .map(
                    (h) =>
                      `<option value="${h.versionId}" ${h.versionId === leftId ? 'selected' : ''}>From: ${escapeHtml(h.versionId)} — ${escapeHtml(h.changeSummary)}</option>`
                  )
                  .join('')}
              </select>
              <select class="input-box" style="flex:1; min-width:220px; font-size:12px;" onchange="setCmsDiffSelection('right', this.value)">
                ${history
                  .map(
                    (h) =>
                      `<option value="${h.versionId}" ${h.versionId === rightId ? 'selected' : ''}>To: ${escapeHtml(h.versionId)} — ${escapeHtml(h.changeSummary)}</option>`
                  )
                  .join('')}
              </select>
            </div>
            ${
              diff
                ? `<div data-testid="cms-diff-summary-box" style="padding:12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px;">
                    <div><b>Total Structural Differences:</b> ${diff.totalDifferences}</div>
                    <div style="margin-top:4px;"><b>Modules Added:</b> ${diff.addedModuleIds.join(', ') || 'None'} • <b>Removed:</b> ${diff.removedModuleIds.join(', ') || 'None'}</div>
                    <div style="margin-top:4px;"><b>Modified Lessons:</b> ${diff.modifiedLessonIds.join(', ') || 'None'}</div>
                    <div style="margin-top:4px;"><b>Changed Answer Keys:</b> ${diff.changedActivityAnswerKeys.map((k) => k.activityId).join(', ') || 'None'}</div>
                  </div>`
                : ''
            }
          </div>
        `
          : ''
      }
    </div>
  `;
}

// ============================================================================
// 10. TAB 8: MEDIA LIBRARY (100 UKRAINIAN IDENTIFY WEBP SCENES)
// ============================================================================

function renderCmsMediaTab(): string {
  const fullCatalog = getCmsMediaLibraryCatalog();
  const q = cmsUiState.mediaSearchQuery.trim().toLowerCase();
  const catalog = q
    ? fullCatalog.filter(
        (m) =>
          m.assetId.toLowerCase().includes(q) ||
          m.sceneTitleEn.toLowerCase().includes(q) ||
          (m.sceneTitleUk || '').toLowerCase().includes(q) ||
          m.categoryTitle.toLowerCase().includes(q)
      )
    : fullCatalog;

  return `
    <div data-testid="cms-media-view">
      <div class="card" style="padding:14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">🖼️ Visual Media Asset Library (${catalog.length} / 100 WebP Scenes)</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              All 100 original Ukrainian Identify WebP photographs across 20 thematic categories are preserved and indexed for course authoring.
            </div>
          </div>
          <input
            type="search"
            data-testid="cms-media-search-input"
            class="input-box"
            style="width:260px; min-height:34px; font-size:12px;"
            placeholder="Search 100 WebP scenes..."
            value="${escapeHtml(cmsUiState.mediaSearchQuery)}"
            oninput="setCmsMediaSearch(this.value)"
          />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:12px;">
        ${catalog
          .slice(0, 24)
          .map(
            (asset) => `
            <div class="card" data-testid="cms-media-card-${asset.assetId}" style="padding:10px;">
              <img
                src="${escapeHtml(asset.assetPath)}"
                alt="${escapeHtml(asset.sceneTitleEn)}"
                loading="lazy"
                style="width:100%; height:130px; object-fit:cover; border-radius:var(--radius-xs); background:var(--surface-2);"
              />
              <div style="font-size:12.5px; font-weight:800; margin-top:6px;">${escapeHtml(asset.sceneTitleUk || asset.sceneTitleEn)}</div>
              <div style="font-size:11.5px; color:var(--text-secondary);">${escapeHtml(asset.sceneTitleEn)} • ${escapeHtml(asset.categoryTitle)}</div>
              <div style="font-size:10.5px; color:var(--text-secondary); margin-top:3px; font-family:monospace; word-break:break-all;">${escapeHtml(asset.assetPath)}</div>
            </div>
          `
          )
          .join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 11. TAB 9: ISOLATED DRAFT PREVIEW (UNIVERSAL COURSE PLAYER)
// ============================================================================

function renderCmsPreviewTab(): string {
  const preview = renderIsolatedCmsDraftPreview(
    cmsUiState.selectedTrackId,
    cmsUiState.previewMode
  );
  const baselinePkg = getPublishedBaselineCoursePackage(
    cmsUiState.selectedTrackId
  );
  const hasPublishedBaseline = Boolean(
    baselinePkg && baselinePkg.modules.length > 0
  );

  return `
    <div data-testid="cms-preview-view">
      <div class="card" style="padding:14px; margin-bottom:14px; border-left:4px solid var(--success);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">👁️ Isolated Universal Course Player Preview</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Sandboxed Mode: Renders <code>${escapeHtml(cmsUiState.selectedTrackId)}</code> in <b>${cmsUiState.previewMode.toUpperCase()}</b> mode (${preview.moduleCount} module(s)) using the real Phase 2 Universal Course Player. Completing activities here <b>never</b> modifies student FSRS decks, XP, or published course state.
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button
              type="button"
              data-testid="cms-btn-preview-draft"
              class="stage-pill ${cmsUiState.previewMode === 'draft' ? 'active' : ''}"
              style="min-height:30px; padding:4px 10px; font-size:11.5px;"
              onclick="setCmsPreviewMode('draft')"
            >
              ✏️ Preview Draft (${preview.hasDraftChanges ? 'With Draft Edits' : 'Effective View'})
            </button>
            <button
              type="button"
              data-testid="cms-btn-preview-published"
              class="stage-pill ${cmsUiState.previewMode === 'published' ? 'active' : ''}"
              style="min-height:30px; padding:4px 10px; font-size:11.5px;"
              onclick="setCmsPreviewMode('published')"
            >
              🏛️ Preview Published (${hasPublishedBaseline ? `${baselinePkg?.modules.length} Baseline Mods` : 'Published Only'})
            </button>
            <span class="tag" style="background:var(--success-container); color:var(--success-on-container); font-size:11px; font-weight:800;">
              🔒 FSRS & XP Untouched
            </span>
          </div>
        </div>
      </div>

      <div id="cms-isolated-player-preview-container" data-testid="cms-isolated-player-preview-container">
        ${preview.html}
      </div>
    </div>
  `;
}

// ============================================================================
// 12. TAB 10: EXPORT & ROUND-TRIP VALIDATOR
// ============================================================================

function renderCmsExportTab(): string {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  return `
    <div data-testid="cms-export-view">
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:800;">📤 Export Clean Versioned Course JSON (${escapeHtml(cmsUiState.selectedTrackId)})</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Schema: <code>UniversalCoursePackageV1</code> • Validation Errors: <b>${exported.validationReport.errorCount}</b>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" data-testid="cms-btn-verify-roundtrip" onclick="handleVerifyCmsExportRoundTrip()">
              ✅ Verify Round-Trip Re-Import
            </button>
            <button type="button" class="btn btn-sec" onclick="handleDownloadCmsExportJson()">
              ⬇️ Download .json File
            </button>
          </div>
        </div>

        ${
          cmsUiState.exportStatusMessage
            ? `<div data-testid="cms-export-roundtrip-banner" style="margin-bottom:12px; padding:10px 12px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700;">
                ${escapeHtml(cmsUiState.exportStatusMessage)}
              </div>`
            : ''
        }

        <textarea
          id="cms-export-json-textarea"
          data-testid="cms-export-json-textarea"
          readonly
          class="input-box"
          style="width:100%; min-height:320px; font-family:monospace; font-size:12px;"
        >${escapeHtml(exported.jsonString)}</textarea>
      </div>
    </div>
  `;
}

// ============================================================================
// 13. INTERACTIVE HANDLERS EXPOSED TO WINDOW
// ============================================================================

export function dismissCmsBanner(): void {
  cmsUiState.bannerNotification = null;
  renderLangoContentStudio();
}

export function handleCmsGlobalSearchInput(query: string): void {
  cmsUiState.globalSearchQuery = query;
  renderLangoContentStudio();
}

export function handleSearchResultClick(
  resultType: string,
  courseTrackId: string,
  itemId: string
): void {
  cmsUiState.globalSearchQuery = '';
  if (resultType === 'vocabulary') {
    cmsUiState.selectedLexemeId = itemId;
    cmsUiState.activeTab = 'vocabulary';
  } else {
    cmsUiState.selectedTrackId = courseTrackId;
    cmsUiState.activeTab = 'editor';
    ensureEditorSelectionForDraft(courseTrackId);
  }
  renderLangoContentStudio();
}

export function setCmsCourseManagerFilter(
  kind: 'search' | 'direction' | 'status' | 'sort',
  value: string
): void {
  if (kind === 'search') cmsUiState.courseSearchQuery = value;
  if (kind === 'direction')
    cmsUiState.courseDirectionFilter =
      value as CmsStudioUiState['courseDirectionFilter'];
  if (kind === 'status')
    cmsUiState.courseStatusFilter =
      value as CmsStudioUiState['courseStatusFilter'];
  if (kind === 'sort')
    cmsUiState.courseSortBy = value as CmsStudioUiState['courseSortBy'];
  renderLangoContentStudio();
}

export function selectCmsEditorModule(moduleId: string): void {
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = '';
  cmsUiState.selectedLessonId = '';
  cmsUiState.selectedActivityId = '';
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  renderLangoContentStudio();
}

export function selectCmsEditorLesson(
  moduleId: string,
  sectionId: string,
  lessonId: string
): void {
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = sectionId;
  cmsUiState.selectedLessonId = lessonId;
  cmsUiState.selectedActivityId = '';
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  renderLangoContentStudio();
}

export function selectCmsEditorActivity(activityId: string): void {
  cmsUiState.selectedActivityId = activityId;
  renderLangoContentStudio();
}

export function toggleCmsSourceJsonDrawer(): void {
  cmsUiState.showSourceJsonDrawer = !cmsUiState.showSourceJsonDrawer;
  renderLangoContentStudio();
}

export function toggleCmsDraftVsPublishedDiffDrawer(): void {
  cmsUiState.showDraftVsPublishedDiffDrawer =
    !cmsUiState.showDraftVsPublishedDiffDrawer;
  renderLangoContentStudio();
}

export function setCmsPreviewMode(mode: 'draft' | 'published'): void {
  cmsUiState.previewMode = mode;
  renderLangoContentStudio();
}

export function openCmsPreviewWithMode(mode: 'draft' | 'published'): void {
  cmsUiState.previewMode = mode;
  cmsUiState.activeTab = 'preview';
  renderLangoContentStudio();
}

export function handleDiscardCmsDraftOverlay(): void {
  const restored = discardCmsDraftOverlay(cmsUiState.selectedTrackId);
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner(
    'success',
    `Discarded unpublished draft changes for ${cmsUiState.selectedTrackId}. Restored ${restored.draftPackage.modules.length} published baseline module(s).`
  );
  renderLangoContentStudio();
}

export function handleAddCmsModulePrompt(): void {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const nextNum = draft.draftPackage.modules.length + 1;
  const newModId = `${cmsUiState.selectedTrackId.replace('track:', '').replace(/-/g, '_')}_mod_${nextNum}`;
  const newSecId = `${newModId}_sec_1`;
  const newLesId = `${newModId}_les_1`;
  const newActId = `${newModId}_act_1`;

  addOrUpdateCmsModuleInDraft(cmsUiState.selectedTrackId, {
    moduleId: newModId,
    proficiencyLevel: 'A1',
    title: `Module ${nextNum}: Foundations & Core Expressions`,
    learningObjectives: [
      `Master core communicative patterns in Module ${nextNum}`,
    ],
    sections: [
      {
        sectionId: newSecId,
        title: 'Section 1: Core Concepts & Practice',
        lessons: [
          {
            lessonId: newLesId,
            title: `Lesson ${nextNum}.1: Essential Communication`,
            summary: 'Core patterns and guided practice',
            instructionalText:
              'Welcome to this draft lesson created in Lango Content Studio. Review the key patterns and complete the interactive check below.',
            vocabularyRefs: ['en_lex_0001'],
            activities: [
              {
                activityId: newActId,
                activityType: 'knowledge_check_mc',
                title: 'Quick Check',
                prompt: 'Which expression is a polite greeting?',
                payload: {
                  options: ['Hello!', 'Goodbye', 'Never'],
                  correctIndex: 0,
                  explanation: '"Hello!" is the standard polite greeting.',
                },
              },
            ],
          },
        ],
      },
    ],
  });

  cmsUiState.selectedModuleId = newModId;
  cmsUiState.selectedSectionId = newSecId;
  cmsUiState.selectedLessonId = newLesId;
  cmsUiState.selectedActivityId = newActId;
  setCmsBanner(
    'success',
    `Added Module "${newModId}" to ${cmsUiState.selectedTrackId} draft.`
  );
  renderLangoContentStudio();
}

export function handleMoveCmsModule(fromIndex: number, toIndex: number): void {
  reorderCmsModulesInDraft(cmsUiState.selectedTrackId, fromIndex, toIndex);
  setCmsBanner(
    'success',
    `Reordered module from position ${fromIndex + 1} to ${toIndex + 1} in draft.`
  );
  renderLangoContentStudio();
}

export function handleDuplicateCmsModule(moduleId: string): void {
  const newId = `${moduleId}_copy_${Date.now().toString().slice(-4)}`;
  duplicateCmsModuleInDraft(cmsUiState.selectedTrackId, moduleId, newId);
  setCmsBanner('success', `Duplicated module "${moduleId}" as "${newId}".`);
  renderLangoContentStudio();
}

export function handleSaveCmsLessonEdits(): void {
  const titleEl = document.getElementById(
    'cms-edit-lesson-title'
  ) as HTMLInputElement | null;
  const subEl = document.getElementById(
    'cms-edit-lesson-summary'
  ) as HTMLInputElement | null;
  const textEl = document.getElementById(
    'cms-edit-lesson-text'
  ) as HTMLTextAreaElement | null;
  if (!titleEl || !cmsUiState.selectedLessonId) return;

  updateCmsLessonInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    {
      title: titleEl.value.trim(),
      summary: subEl ? subEl.value.trim() : undefined,
      instructionalText: textEl ? textEl.value.trim() : undefined,
    }
  );

  setCmsBanner(
    'success',
    `Saved lesson "${cmsUiState.selectedLessonId}" in ${cmsUiState.selectedTrackId} draft.`
  );
  renderLangoContentStudio();
}

export function handleSaveCmsActivityEdits(): void {
  const titleEl = document.getElementById(
    'cms-edit-activity-title'
  ) as HTMLInputElement | null;
  const promptEl = document.getElementById(
    'cms-edit-activity-prompt'
  ) as HTMLInputElement | null;
  const optsEl = document.getElementById(
    'cms-edit-activity-options'
  ) as HTMLTextAreaElement | null;
  const idxEl = document.getElementById(
    'cms-edit-activity-correct-idx'
  ) as HTMLInputElement | null;
  const expEl = document.getElementById(
    'cms-edit-activity-explanation'
  ) as HTMLTextAreaElement | null;

  if (!cmsUiState.selectedActivityId) return;

  const opts = optsEl
    ? optsEl.value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const correctIndex = idxEl ? parseInt(idxEl.value, 10) : 0;

  updateCmsActivityInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    cmsUiState.selectedActivityId,
    {
      title: titleEl ? titleEl.value.trim() : undefined,
      prompt: promptEl ? promptEl.value.trim() : undefined,
      payload: {
        options: opts,
        correctIndex: Number.isNaN(correctIndex) ? 0 : correctIndex,
        explanation: expEl ? expEl.value.trim() : '',
      },
    }
  );

  setCmsBanner(
    'success',
    `Saved activity "${cmsUiState.selectedActivityId}" in ${cmsUiState.selectedTrackId} draft.`
  );
  renderLangoContentStudio();
}

export function handleCreateManualSnapshot(): void {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const snap = createCmsVersionSnapshot(
    cmsUiState.selectedTrackId,
    draft.draftPackage,
    'Manual Studio Checkpoint Snapshot',
    'manual_edit',
    draft.lifecycleState
  );
  setCmsBanner(
    'success',
    `Created Version Snapshot ${snap.versionId} for ${cmsUiState.selectedTrackId}.`
  );
  renderLangoContentStudio();
}

export function handleCmsLifecycleTransition(
  targetState: CmsLifecycleState
): void {
  const res = transitionCmsDraftLifecycleState(
    cmsUiState.selectedTrackId,
    targetState,
    true
  );
  if (res.success) {
    setCmsBanner('success', res.message);
  } else {
    setCmsBanner('danger', res.message);
  }
  renderLangoContentStudio();
}

export function setCmsImportMode(
  mode: 'full_draft_import' | 'incremental_module_merge'
): void {
  cmsUiState.importMode = mode;
}

export function loadCmsSampleFixture(
  kind: 'es-to-en' | 'en-to-hi' | 'es-incremental-mod3'
): void {
  if (kind === 'es-to-en') {
    cmsUiState.selectedTrackId = 'track:es-to-en';
    cmsUiState.importMode = 'full_draft_import';
    cmsUiState.importJsonText = SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON;
  } else if (kind === 'en-to-hi') {
    cmsUiState.selectedTrackId = 'track:en-to-hi';
    cmsUiState.importMode = 'full_draft_import';
    cmsUiState.importJsonText = SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON;
  } else if (kind === 'es-incremental-mod3') {
    cmsUiState.selectedTrackId = 'track:es-to-en';
    cmsUiState.importMode = 'incremental_module_merge';
    const patch = {
      ...SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
      courseStatus: 'draft',
      modules: [
        {
          moduleId: 'es_en_test_m3',
          title:
            'Módulo 3 (Incremental Merge): Phrasal Verbs Cotidianos vs Verbos Latinos',
          proficiencyLevel: 'Foundational-3',
          learningObjectives: [
            'Dominar put off, look into y figure out en conversación diaria',
          ],
          vocabularyReferences: ['en_lex_0001'],
          sections: [
            {
              sectionId: 'es_en_test_sec_3',
              title: '1. Verbos Frasales de Alta Frecuencia',
              lessons: [
                {
                  lessonId: 'es_en_test_les_3',
                  title: 'Look into vs Investigar',
                  summary:
                    'El inglés hablado prefiere verbos frasales como "look into" o "figure out".',
                  instructionalText:
                    'Use "Let us look into this schedule" in everyday professional English.',
                  vocabularyRefs: ['en_lex_0002'],
                  activities: [
                    {
                      activityId: 'es_en_test_act_5',
                      activityType: 'knowledge_check_mc',
                      title: 'Phrasal Verb Check',
                      prompt:
                        'Which phrasal verb means "to investigate or examine"?',
                      payload: {
                        options: ['look into', 'give up', 'turn off'],
                        correctIndex: 0,
                        explanation: '"Look into" means to investigate.',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    cmsUiState.importJsonText = JSON.stringify(patch, null, 2);
  }
  renderLangoContentStudio();
}

export function handleExecuteCmsDraftImport(): void {
  const textarea = document.getElementById(
    'cms-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  if (textarea) cmsUiState.importJsonText = textarea.value;

  const res = importCourseJsonIntoCmsDraft(
    cmsUiState.importJsonText,
    cmsUiState.selectedTrackId,
    cmsUiState.importMode
  );

  if (res.success) {
    ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
    cmsUiState.lastImportBannerHtml = `
      <div data-testid="cms-import-success-box" style="padding:10px 12px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700;">
        ✅ ${escapeHtml(res.message)} (Modules in Draft: ${res.draftEnvelope?.draftPackage.modules.length || 0})
      </div>
    `;
    setCmsBanner('success', res.message);
  } else {
    cmsUiState.lastImportBannerHtml = `
      <div data-testid="cms-import-error-box" style="padding:10px 12px; background:var(--danger-container); color:var(--danger-on-container); border-radius:var(--radius-xs); font-size:12.5px;">
        <div style="font-weight:800;">❌ ${escapeHtml(res.message)}</div>
      </div>
    `;
    setCmsBanner('danger', 'Course JSON import failed validation.');
  }
  renderLangoContentStudio();
}

export function setCmsVocabSearch(query: string): void {
  cmsUiState.vocabSearchQuery = query;
  renderLangoContentStudio();
}

export function selectCmsVocabLexeme(lexemeId: string): void {
  cmsUiState.selectedLexemeId = lexemeId;
  renderLangoContentStudio();
}

export function selectCmsOverlayLanguage(lang: string): void {
  cmsUiState.selectedOverlayLang = lang;
  renderLangoContentStudio();
}

export function handleSaveCanonicalLexeme(lexemeId: string): void {
  const hw =
    (document.getElementById('cms-lex-headword') as HTMLInputElement | null)
      ?.value || '';
  const pos =
    (document.getElementById('cms-lex-pos') as HTMLInputElement | null)
      ?.value || '';
  const ipa =
    (document.getElementById('cms-lex-ipa') as HTMLInputElement | null)
      ?.value || '';
  const meaning =
    (document.getElementById('cms-lex-meaning') as HTMLTextAreaElement | null)
      ?.value || '';

  const existing = getAllCanonicalEnglishLexemes().find(
    (l) => l.lexemeId === lexemeId
  );

  upsertCanonicalEnglishLexemeInCms({
    lexemeId,
    headwordEn: hw.trim(),
    pos: pos.trim(),
    ipaUs: ipa.trim(),
    ipaGb: existing?.ipaGb || ipa.trim(),
    coreMeaningEn: meaning.trim(),
    canonicalExamplesEn: existing?.canonicalExamplesEn || [],
  });
  setCmsBanner('success', `Saved canonical English lexeme "${lexemeId}".`);
  renderLangoContentStudio();
}

export function handleSaveNativeOverlay(
  lexemeId: string,
  lang: string
): void {
  const trans =
    (
      document.getElementById(
        'cms-overlay-translation'
      ) as HTMLInputElement | null
    )?.value || '';
  const exp =
    (
      document.getElementById(
        'cms-overlay-explanation'
      ) as HTMLTextAreaElement | null
    )?.value || '';
  const tip =
    (document.getElementById('cms-overlay-tip') as HTMLInputElement | null)
      ?.value || '';

  const existing = getAllNativeOverlaysForLexeme(lexemeId).find(
    (o) => o.nativeLanguage === lang
  );

  upsertNativeLanguageOverlayInCms({
    overlayId: existing?.overlayId || `vocab-overlay:en:for-${lang}`,
    courseTrackId: `track:${lang}-to-en`,
    nativeLanguage: lang,
    lexemeId,
    translationNative: trans.trim(),
    explanationNative: exp.trim(),
    pronunciationTipForNativeSpeaker: tip.trim(),
    bilingualExamples: existing?.bilingualExamples || [],
    pedagogicalSequenceOrder: existing?.pedagogicalSequenceOrder || 1,
  });

  setCmsBanner(
    'success',
    `Saved isolated ${lang.toUpperCase()} native overlay for "${lexemeId}" without modifying other overlays.`
  );
  renderLangoContentStudio();
}

export function handleRunCmsBulkAudit(): void {
  const res = runBulkCmsValidationAudit();
  cmsUiState.lastBulkAuditSummary = {
    auditedTrackCount: res.auditedTrackCount,
    totalErrors: res.totalErrors,
    totalWarnings: res.totalWarnings,
  };
  setCmsBanner(
    'success',
    `Completed bulk validation audit across all ${res.auditedTrackCount} Course Tracks.`
  );
  renderLangoContentStudio();
}

export function handleAddCmsReviewerNote(): void {
  const noteInput = document.getElementById(
    'cms-review-note-input'
  ) as HTMLInputElement | null;
  const statusSelect = document.getElementById(
    'cms-review-status-select'
  ) as HTMLSelectElement | null;
  if (!noteInput || !noteInput.value.trim()) return;

  addCmsManualReviewNote(
    cmsUiState.selectedTrackId,
    noteInput.value.trim(),
    (statusSelect?.value as any) || 'pending_review'
  );
  setCmsBanner('success', 'Added manual pedagogical review note.');
  renderLangoContentStudio();
}

export function handleRestoreCmsSnapshot(versionId: string): void {
  const res = restoreCmsVersionSnapshot(cmsUiState.selectedTrackId, versionId);
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner(
    'success',
    `Restored snapshot "${versionId}" for ${cmsUiState.selectedTrackId} (pre-rollback backup: ${res.backupSnapshot.versionId}).`
  );
  renderLangoContentStudio();
}

export function setCmsDiffSelection(
  side: 'left' | 'right',
  versionId: string
): void {
  if (side === 'left') cmsUiState.diffLeftVersionId = versionId;
  if (side === 'right') cmsUiState.diffRightVersionId = versionId;
  renderLangoContentStudio();
}

export function setCmsMediaSearch(query: string): void {
  cmsUiState.mediaSearchQuery = query;
  renderLangoContentStudio();
}

export function handleVerifyCmsExportRoundTrip(): void {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  const reimportCheck = validateAndPreviewCourseImport(
    exported.jsonString,
    cmsUiState.selectedTrackId
  );
  if (reimportCheck.valid) {
    cmsUiState.exportStatusMessage = `✅ Round-Trip Verified: Exported JSON for ${cmsUiState.selectedTrackId} parsed cleanly with 0 schema errors (${reimportCheck.moduleCount} modules, ${reimportCheck.lessonCount} lessons, ${reimportCheck.activityCount} activities).`;
  } else {
    cmsUiState.exportStatusMessage = `⚠️ Round-Trip Notice: ${reimportCheck.errors.join(' | ')}`;
  }
  renderLangoContentStudio();
}

export function handleDownloadCmsExportJson(): void {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  const blob = new Blob([exported.jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cmsUiState.selectedTrackId.replace(':', '-')}-${exported.exportedPackage.schemaVersion}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function bootCmsStudioRouteIfRequested(): void {
  if (typeof window === 'undefined') return;
  if (
    window.location.pathname === '/studio' ||
    window.location.search.includes('studio=1')
  ) {
    openLangoContentStudio('dashboard');
  }
}

export { cmsStorageAdapter };
