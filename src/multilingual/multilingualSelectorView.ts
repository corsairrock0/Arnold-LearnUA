// ============================================================================
// LANGO PHASE 1 — GLOBAL LANGUAGE & LEARNING-DIRECTION SELECTOR UI,
// COMING SOON WORKSPACE & DEVELOPER COURSE JSON IMPORTER PREVIEW MODAL
// ============================================================================

import {
  getAllLanguages,
  getAllTargetLanguages,
  getInterfaceText,
  getLanguageByCode,
  getLanguageHtmlAttributes,
  getSupportedNativeLanguagesForEnglish,
  inspectHindiScriptMetadata,
} from './languageRegistry.ts';
import {
  getAllCourseTracks,
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
  resetDevPilotTrackState,
  resolveCourseTrack,
  type CourseTrack,
} from './courseTrackRegistry.ts';
import {
  getCourseTrackProgress,
  getSelectedCourseTrackId,
  getSelectedInterfaceLanguage,
  setSelectedCourseTrackId,
  setSelectedInterfaceLanguage,
} from './courseTrackProgress.ts';
import {
  commitDevPilotCourseImport,
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
  validateAndPreviewCourseImport,
  type CourseImportPreviewReport,
  type UniversalCoursePackageV1,
} from './universalCourseImporter.ts';
import {
  renderUniversalImportedCourseWorkspace,
  syncAllTabsForActiveTrack,
  SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON,
} from './universalCoursePlayer.ts';
import { evaluateCmsAccessContext } from './cmsAuthAndStorage.ts';

let pendingModalTargetLanguage: string | null = null;
let lastImportPreviewReport: CourseImportPreviewReport | null = null;
let onTrackChangedCallback: ((track: CourseTrack) => void) | null = null;

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function registerOnCourseTrackChanged(
  cb: (track: CourseTrack) => void
): void {
  onTrackChangedCallback = cb;
}

export function getActiveCourseTrack(): CourseTrack {
  const id = getSelectedCourseTrackId();
  return (
    getCourseTrackById(id) || getCourseTrackById(PUBLISHED_UKRAINIAN_TRACK_ID)!
  );
}

/**
 * Updates the top header pill and the Course tab banner/workspace whenever
 * the selected Course Track changes.
 */
export function syncMultilingualTrackUI(): void {
  const track = getActiveCourseTrack();
  const targetLang = getLanguageByCode(track.targetLanguage);
  const nativeLang = getLanguageByCode(track.nativeLanguage);

  // 1. Update sidebar and mobile language selector button labels
  const cleanLabel =
    track.learningDirection === 'foreign_to_en'
      ? `English (from ${nativeLang?.nameEn || track.nativeLanguage})`
      : `${targetLang?.nameEn || track.targetLanguage}`;
  const topPillEl = document.getElementById('lango-top-track-label');
  if (topPillEl) {
    topPillEl.textContent = cleanLabel;
  }
  const mobilePillEl = document.getElementById('lango-mobile-track-label');
  if (mobilePillEl) {
    mobilePillEl.textContent = cleanLabel;
  }

  // 1b. Sync Content Studio button visibility for trusted dev environment
  const isCmsAllowed = evaluateCmsAccessContext().isAllowed;
  const topStudioBtn = document.getElementById('lango-open-cms-studio-btn');
  if (topStudioBtn) {
    topStudioBtn.style.display = isCmsAllowed ? '' : 'none';
  }

  // 2. Render the minimal VocabBuilder-style Course Track Metadata Strip
  const bannerContainer = document.getElementById('lango-course-track-banner');
  if (bannerContainer) {
    const isUkPublished = track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID;
    const statusBadgeBg =
      track.availability === 'published'
        ? 'var(--success-container)'
        : track.availability === 'dev_pilot_imported'
          ? 'var(--warn-container)'
          : 'var(--secondary-container)';
    const statusBadgeColor =
      track.availability === 'published'
        ? 'var(--success-on-container)'
        : track.availability === 'dev_pilot_imported'
          ? 'var(--warn-on-container)'
          : 'var(--secondary-on-container)';
    const statusText =
      track.availability === 'published'
        ? '29 CEFR Modules'
        : track.availability === 'dev_pilot_imported'
          ? 'Pilot Imported'
          : 'Coming Soon';

    bannerContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:13px; font-weight:600; color:var(--text);" data-testid="active-course-track-title">
            ${escapeHtml(track.courseTitle)}
          </span>
          <span class="tag" style="background:${statusBadgeBg}; color:${statusBadgeColor}; font-weight:600; font-size:11px; margin:0;" data-testid="active-course-track-status">
            ${escapeHtml(statusText)}
          </span>
          <span class="hint">
            ${escapeHtml(nativeLang?.nameEn || track.nativeLanguage)} → ${escapeHtml(targetLang?.nameEn || track.targetLanguage)}
          </span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          ${
            !isUkPublished
              ? `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:12px;" data-testid="btn-return-ukrainian" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">Ukrainian Course</button>`
              : ''
          }
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:12px;" data-testid="btn-open-language-selector" onclick="openLanguageSelectorModal()">Change language</button>
          ${
            isCmsAllowed
              ? `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:12px;" data-testid="btn-banner-open-cms-studio" onclick="openLangoContentStudio(undefined, '${escapeHtml(track.trackId)}')">Content Studio</button>
                 <button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:12px;" data-testid="btn-open-dev-importer" onclick="openDevCourseImporterModal('${escapeHtml(track.trackId)}')">Import JSON</button>`
              : ''
          }
        </div>
      </div>
    `;
  }

  // 3. Toggle between the published Ukrainian course workspace and the Blank/Coming Soon track workspace
  const heroBarEl = document.querySelector('#tab-course .course-hero-bar') as HTMLElement | null;
  const syllabusDrawerEl = document.getElementById('course-syllabus-drawer');
  const filterBarEl = document.getElementById('course-level-filter-bar');
  const moduleGridEl = document.getElementById('module-grid');
  const moduleWorkspaceEl = document.getElementById('module-workspace');
  let comingSoonEl = document.getElementById('lango-coming-soon-workspace');

  if (!comingSoonEl && moduleWorkspaceEl?.parentElement) {
    comingSoonEl = document.createElement('div');
    comingSoonEl.id = 'lango-coming-soon-workspace';
    moduleWorkspaceEl.parentElement.insertBefore(
      comingSoonEl,
      moduleWorkspaceEl
    );
  }

  const isUkrainianTrack = track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID;

  if (isUkrainianTrack) {
    heroBarEl?.classList.remove('hidden');
    filterBarEl?.classList.remove('hidden');
    moduleGridEl?.classList.remove('hidden');
    moduleWorkspaceEl?.classList.remove('hidden');
    if (comingSoonEl) {
      comingSoonEl.classList.add('hidden');
      comingSoonEl.innerHTML = '';
    }
    if (typeof window !== 'undefined' && window.updateSidebarStats) {
      window.updateSidebarStats();
    }
  } else {
    heroBarEl?.classList.add('hidden');
    syllabusDrawerEl?.classList.add('hidden');
    filterBarEl?.classList.add('hidden');
    moduleGridEl?.classList.add('hidden');
    moduleWorkspaceEl?.classList.add('hidden');
    if (comingSoonEl) {
      comingSoonEl.classList.remove('hidden');
      comingSoonEl.innerHTML = renderNonUkrainianTrackWorkspace(track);
    }
  }

  // 4. Sync all 8 tabs & top/sidebar telemetry for active track
  syncAllTabsForActiveTrack(track);
}

function renderNonUkrainianTrackWorkspace(track: CourseTrack): string {
  const targetLang = getLanguageByCode(track.targetLanguage);
  const nativeLang = getLanguageByCode(track.nativeLanguage);
  const instrLang = getLanguageByCode(track.instructionalLanguage);
  const progress = getCourseTrackProgress(track.trackId);

  // Determine script direction and font attributes for native/target display
  const scriptDisplayLang =
    track.learningDirection === 'foreign_to_en'
      ? nativeLang
      : targetLang;
  const htmlAttrs = getLanguageHtmlAttributes(
    scriptDisplayLang?.code || track.targetLanguage
  );

  // If Hindi is involved (either target='hi' or native='hi'), inspect Devanagari sample
  const hindiSample =
    track.targetLanguage === 'hi' || track.nativeLanguage === 'hi'
      ? inspectHindiScriptMetadata(track.nativeContextTitle)
      : null;

  // If a developer pilot package was imported into this track in-memory during testing,
  // render the interactive Phase 2 Universal Course Player!
  if (
    track.availability === 'dev_pilot_imported' &&
    track.importedPackageData
  ) {
    return renderUniversalImportedCourseWorkspace(
      track,
      track.importedPackageData as UniversalCoursePackageV1
    );
  }

  return `
    <div class="card" data-testid="course-coming-soon-card" style="padding:24px; border:1px solid var(--border-strong); background:var(--surface-1);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
        <div>
          <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800; font-size:12px;" data-testid="coming-soon-badge">
            Course Coming Soon
          </span>
          <h2 style="margin:8px 0 4px 0; font-size:22px; font-weight:800; color:var(--text);" data-testid="coming-soon-heading">
            ${escapeHtml(track.comingSoonTitle)}
          </h2>
          <div
            lang="${escapeHtml(htmlAttrs.lang)}"
            dir="${escapeHtml(htmlAttrs.dir)}"
            style="font-size:18px; font-weight:700; color:var(--accent); margin-top:4px; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
            data-testid="coming-soon-native-subtitle"
          >
            ${escapeHtml(track.nativeContextTitle)}
          </div>
        </div>
        <span class="tag" style="background:var(--surface-2); color:var(--text-secondary); font-weight:700;">
          Published Modules: 0 (Blank State)
        </span>
      </div>

      <p style="font-size:15px; line-height:1.6; color:var(--text); margin:0 0 16px 0;" data-testid="coming-soon-description">
        ${escapeHtml(track.comingSoonMessage)}
      </p>

      <div
        lang="${escapeHtml(htmlAttrs.lang)}"
        dir="${escapeHtml(htmlAttrs.dir)}"
        style="padding:12px 14px; background:var(--surface-2); border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:16px; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
        data-testid="coming-soon-script-sample"
      >
        <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; direction:ltr; text-align:left; margin-bottom:4px;">
          Script &amp; Direction Verification (${escapeHtml(scriptDisplayLang?.scriptNameEn || '')} • dir="${escapeHtml(htmlAttrs.dir)}")
        </div>
        <div style="font-size:17px; font-weight:700; color:var(--text);">
          ${escapeHtml(scriptDisplayLang?.sampleGreetingNative || '')}
        </div>
        ${
          scriptDisplayLang?.sampleGreetingTranslit
            ? `<div style="font-size:12.5px; color:var(--accent); direction:ltr; text-align:left; margin-top:2px;">Transliteration: ${escapeHtml(scriptDisplayLang.sampleGreetingTranslit)}</div>`
            : ''
        }
        ${
          hindiSample
            ? `<div style="font-size:12px; color:var(--success); direction:ltr; text-align:left; margin-top:4px;" data-testid="hindi-devanagari-meta">
                ✓ Devanagari NFC Verified • Base consonants: ${hindiSample.baseConsonants.length} • Dependent vowel matras: ${hindiSample.dependentVowelSignsMatras.length} (${escapeHtml(hindiSample.dependentVowelSignsMatras.join(' '))})
              </div>`
            : ''
        }
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:16px;">
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Course Track ID</div>
          <div style="font-size:13.5px; font-weight:800; color:var(--text); margin-top:2px;" data-testid="coming-soon-track-id">${escapeHtml(track.trackId)}</div>
        </div>
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Target Language</div>
          <div style="font-size:13.5px; font-weight:800; color:var(--text); margin-top:2px;">${escapeHtml(targetLang?.nameEn || track.targetLanguage)} (${escapeHtml(track.targetLanguage)} • ${escapeHtml(track.targetVariety)})</div>
        </div>
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Learner Native Language</div>
          <div style="font-size:13.5px; font-weight:800; color:var(--text); margin-top:2px;">${escapeHtml(nativeLang?.nameEn || track.nativeLanguage)} (${escapeHtml(track.nativeLanguage)})</div>
        </div>
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Instructional Language</div>
          <div style="font-size:13.5px; font-weight:800; color:var(--text); margin-top:2px;">${escapeHtml(instrLang?.nameEn || track.instructionalLanguage)} (${escapeHtml(track.instructionalLanguage)})</div>
        </div>
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Isolated Progress Scope</div>
          <div style="font-size:12.5px; font-weight:700; color:var(--accent); margin-top:2px;" data-testid="coming-soon-progress-ns">${escapeHtml(track.progressNamespace)} (${progress.xp} XP)</div>
        </div>
        <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:11px; font-weight:800; color:var(--text-secondary); text-transform:uppercase;">Vocabulary Registry</div>
          <div style="font-size:12.5px; font-weight:700; color:var(--text); margin-top:2px;">${escapeHtml(track.vocabularyAssociation.canonicalVocabularyId)}</div>
        </div>
      </div>

      <div style="background:var(--surface-2); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:16px;">
        <div style="font-size:12.5px; font-weight:700; color:var(--text); margin-bottom:4px;">
          Independent Curriculum Autonomy (${escapeHtml(track.courseTitle)})
        </div>
        <ul style="margin:0 0 0 18px; padding:0; font-size:13px; color:var(--text-secondary); line-height:1.55;">
          ${track.autonomyMetadata.l1ContrastiveConsiderations
            .map((note) => `<li>${escapeHtml(note)}</li>`)
            .join('')}
        </ul>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button type="button" class="btn" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">
          🇺🇦 Switch to Published Ukrainian Course (29 Modules)
        </button>
        <button type="button" class="btn btn-sec" onclick="openLanguageSelectorModal()">
          🌐 Choose Another Language or Track
        </button>
        <button type="button" class="btn btn-sec" onclick="openDevCourseImporterModal('${escapeHtml(track.trackId)}')">
          🛠️ Test JSON Import into This Track (Dev Only)
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// GLOBAL LANGUAGE & LEARNING-DIRECTION SELECTOR MODAL (SECTION 10)
// ============================================================================

function ensureLanguageSelectorModalElement(): HTMLElement {
  let modal = document.getElementById('lango-language-selector-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'lango-language-selector-modal';
  modal.className = 'hidden';
  modal.style.cssText =
    'position:fixed; inset:0; background:rgba(0,0,0,0.62); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:1100; display:none; align-items:center; justify-content:center; padding:16px; overflow-y:auto;';
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLanguageSelectorModal();
    }
  });
  document.body.appendChild(modal);
  return modal;
}

export function openLanguageSelectorModal(
  preselectTargetLang?: string
): void {
  const activeTrack = getActiveCourseTrack();
  pendingModalTargetLanguage =
    preselectTargetLang !== undefined
      ? preselectTargetLang
      : activeTrack.targetLanguage === 'en'
        ? 'en'
        : null;

  const modal = ensureLanguageSelectorModalElement();
  renderLanguageSelectorModalContent(modal);
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

export function closeLanguageSelectorModal(): void {
  const modal = document.getElementById('lango-language-selector-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

export function selectTargetLanguageInModal(targetLangCode: string): void {
  const cleanCode = (targetLangCode || '').toLowerCase().trim();
  if (cleanCode === 'en') {
    // Direction B: Prompt for learner's Native Language (14 choices)
    pendingModalTargetLanguage = 'en';
    const modal = ensureLanguageSelectorModalElement();
    renderLanguageSelectorModalContent(modal);
    return;
  }

  // Direction A: English speaker learning a foreign language -> resolve 'track:en-to-<lang>'
  const track = resolveCourseTrack(cleanCode, 'en');
  if (track) {
    selectCourseTrackById(track.trackId);
    closeLanguageSelectorModal();
  }
}

export function selectNativeLanguageForEnglishInModal(
  nativeLangCode: string
): void {
  const cleanNative = (nativeLangCode || '').toLowerCase().trim();
  const track = resolveCourseTrack('en', cleanNative);
  if (track) {
    selectCourseTrackById(track.trackId);
    closeLanguageSelectorModal();
  }
}

export function selectCourseTrackById(trackId: string): CourseTrack {
  const track = setSelectedCourseTrackId(trackId);
  syncMultilingualTrackUI();
  if (onTrackChangedCallback) {
    onTrackChangedCallback(track);
  }
  return track;
}

export function resetDevPilotCourseTrack(trackId: string): void {
  resetDevPilotTrackState(trackId);
  syncMultilingualTrackUI();
}

function renderLanguageSelectorModalContent(modal: HTMLElement): void {
  const activeTrack = getActiveCourseTrack();
  const targetLanguages = getAllTargetLanguages(); // 14 foreign languages + English = 15
  const nativeLanguagesForEn = getSupportedNativeLanguagesForEnglish(); // 14 foreign languages
  const isChoosingNativeForEnglish = pendingModalTargetLanguage === 'en';
  const interfaceLang = getSelectedInterfaceLanguage();

  const targetGridHtml = targetLanguages
    .map((lang) => {
      const isSelectedTarget =
        (isChoosingNativeForEnglish && lang.code === 'en') ||
        (!isChoosingNativeForEnglish &&
          activeTrack.targetLanguage === lang.code &&
          activeTrack.learningDirection === 'en_to_foreign');
      const isUkPublished = lang.code === 'uk';
      const isEnglishTarget = lang.code === 'en';
      const htmlAttrs = getLanguageHtmlAttributes(lang.code);

      return `
        <button
          type="button"
          data-testid="target-lang-option-${escapeHtml(lang.code)}"
          onclick="selectTargetLanguageInModal('${escapeHtml(lang.code)}')"
          style="display:flex; flex-direction:column; align-items:flex-start; justify-content:space-between; padding:11px 13px; border-radius:var(--radius-md); border:${isSelectedTarget ? '2px solid var(--accent)' : '1px solid var(--border-strong)'}; background:${isSelectedTarget ? 'var(--accent-container)' : 'var(--surface-2)'}; color:var(--text); cursor:pointer; text-align:left; min-height:76px; transition:all 0.15s ease;"
        >
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:6px;">
            <strong style="font-size:14.5px; color:var(--text);">${escapeHtml(lang.nameEn)}</strong>
            <span class="tag" style="font-size:10.5px; font-weight:800; padding:2px 6px; background:${isUkPublished ? 'var(--success-container)' : isEnglishTarget ? 'var(--accent)' : 'var(--surface-1)'}; color:${isUkPublished ? 'var(--success-on-container)' : isEnglishTarget ? 'var(--accent-on)' : 'var(--text-secondary)'};">
              ${isUkPublished ? '29 Modules' : isEnglishTarget ? '14 L1 Tracks' : 'Coming Soon'}
            </span>
          </div>
          <div
            lang="${escapeHtml(htmlAttrs.lang)}"
            dir="${escapeHtml(htmlAttrs.dir)}"
            style="font-size:13.5px; font-weight:700; color:var(--accent); margin-top:4px; width:100%; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
          >
            ${escapeHtml(lang.nativeName)} <span style="font-size:11px; color:var(--text-secondary); direction:ltr;">(${escapeHtml(lang.code)})</span>
          </div>
        </button>
      `;
    })
    .join('');

  const nativeChooserSectionHtml = isChoosingNativeForEnglish
    ? `
      <div data-testid="native-language-chooser-section" style="margin-top:16px; padding:16px; background:var(--surface-2); border:2px solid var(--accent); border-radius:var(--radius-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
          <div>
            <span class="tag" style="background:var(--accent); color:var(--accent-on); font-weight:800; font-size:11px;">
              DIRECTION B — LEARN ENGLISH (ESL / EFL)
            </span>
            <h4 style="margin:6px 0 2px 0; font-size:17px; font-weight:800; color:var(--text);" data-testid="native-language-prompt-heading">
              WHAT IS YOUR NATIVE LANGUAGE?
            </h4>
            <p style="margin:0; font-size:12.5px; color:var(--text-secondary);">
              Each native language below loads its own independently designed English curriculum track (not a generic translated course).
            </p>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(175px, 1fr)); gap:8px;">
          ${nativeLanguagesForEn
            .map((nLang) => {
              const resolvedTrack = resolveCourseTrack('en', nLang.code);
              const isSelectedNative =
                activeTrack.targetLanguage === 'en' &&
                activeTrack.nativeLanguage === nLang.code;
              const htmlAttrs = getLanguageHtmlAttributes(nLang.code);
              return `
                <button
                  type="button"
                  data-testid="native-lang-option-${escapeHtml(nLang.code)}"
                  onclick="selectNativeLanguageForEnglishInModal('${escapeHtml(nLang.code)}')"
                  style="display:flex; flex-direction:column; align-items:flex-start; padding:10px 12px; border-radius:var(--radius-sm); border:${isSelectedNative ? '2px solid var(--accent)' : '1px solid var(--border-strong)'}; background:${isSelectedNative ? 'var(--accent-container)' : 'var(--surface-1)'}; color:var(--text); cursor:pointer; text-align:left;"
                >
                  <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                    <strong style="font-size:13.5px;">${escapeHtml(nLang.nameEn)}</strong>
                    <span style="font-size:11px; color:var(--text-secondary); font-weight:700;">${escapeHtml(nLang.code)} → en</span>
                  </div>
                  <div
                    lang="${escapeHtml(htmlAttrs.lang)}"
                    dir="${escapeHtml(htmlAttrs.dir)}"
                    style="font-size:13px; color:var(--accent); font-weight:700; margin-top:2px; width:100%; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
                  >
                    ${escapeHtml(nLang.nativeName)}
                  </div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
                    ${escapeHtml(resolvedTrack?.courseTitle || `English for ${nLang.nameEn} Speakers`)}
                  </div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  const allUiLanguages = getAllLanguages();

  modal.innerHTML = `
    <div class="card" style="max-width:860px; width:100%; max-height:90dvh; overflow-y:auto; background:var(--surface-1); border:1px solid var(--border-strong); box-shadow:var(--shadow-theater); margin:0; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
        <div>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
            Lango Multilingual Platform • 28 Course Tracks • Interface: ${escapeHtml(interfaceLang.toUpperCase())}
          </span>
          <h3 style="margin:6px 0 2px 0; font-size:21px; font-weight:800; color:var(--text);" data-testid="target-language-prompt-heading">
            ${escapeHtml(getInterfaceText('selector.whatLanguageToLearn', interfaceLang).toUpperCase())}
          </h3>
          <p style="margin:0; font-size:13px; color:var(--text-secondary);">
            Choose one of 14 foreign languages (for English speakers) or select <b>English</b> to choose among 14 native-language-specific English curricula.
          </p>
        </div>
        <button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12.5px;" onclick="closeLanguageSelectorModal()">✕ Close</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(175px, 1fr)); gap:8px;">
        ${targetGridHtml}
      </div>

      ${nativeChooserSectionHtml}

      <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:12.5px; color:var(--text-secondary);">
        <div>
          Current Active Track: <b style="color:var(--text);">${escapeHtml(activeTrack.courseTitle)} (${escapeHtml(activeTrack.trackId)})</b>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <label for="lango-interface-lang-select" style="font-size:12px; font-weight:700;">Interface Language (UI):</label>
          <select
            id="lango-interface-lang-select"
            data-testid="interface-lang-select"
            class="input-box"
            style="min-height:32px; padding:2px 8px; font-size:12px;"
            onchange="changeInterfaceLanguageInModal(this.value)"
          >
            ${allUiLanguages
              .map(
                (l) =>
                  `<option value="${escapeHtml(l.code)}" ${l.code === interfaceLang ? 'selected' : ''}>${escapeHtml(l.nameEn)} (${escapeHtml(l.nativeName)})</option>`
              )
              .join('')}
          </select>
          ${
            evaluateCmsAccessContext().isAllowed
              ? `<button type="button" class="btn" data-testid="btn-modal-open-cms-studio" style="min-height:36px; padding:5px 12px; font-size:12px;" onclick="closeLanguageSelectorModal(); openLangoContentStudio(undefined, '${escapeHtml(activeTrack.trackId)}');">
                  🎛️ Open Lango Content Studio (CMS)
                </button>
                <button type="button" class="btn btn-sec" style="min-height:36px; padding:5px 10px; font-size:12px;" onclick="closeLanguageSelectorModal(); openDevCourseImporterModal('${escapeHtml(activeTrack.trackId)}');">
                  🛠️ Developer JSON Importer &amp; Track Registry
                </button>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

export function changeInterfaceLanguageInModal(langCode: string): void {
  setSelectedInterfaceLanguage(langCode);
  const modal = document.getElementById('lango-language-selector-modal');
  if (modal) {
    renderLanguageSelectorModalContent(modal);
  }
  syncMultilingualTrackUI();
}

// ============================================================================
// DEVELOPER-ONLY UNIVERSAL COURSE JSON IMPORTER & PREVIEW MODAL (SECTIONS 14–17)
// ============================================================================

function ensureDevImporterModalElement(): HTMLElement {
  let modal = document.getElementById('lango-dev-importer-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'lango-dev-importer-modal';
  modal.className = 'hidden';
  modal.style.cssText =
    'position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:1150; display:none; align-items:center; justify-content:center; padding:16px; overflow-y:auto;';
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDevCourseImporterModal();
    }
  });
  document.body.appendChild(modal);
  return modal;
}

export function openDevCourseImporterModal(defaultTrackId?: string): void {
  const modal = ensureDevImporterModalElement();
  const tracks = getAllCourseTracks();
  const initialTrackId =
    defaultTrackId && defaultTrackId !== PUBLISHED_UKRAINIAN_TRACK_ID
      ? defaultTrackId
      : 'track:es-to-en';

  lastImportPreviewReport = null;

  modal.innerHTML = `
    <div class="card" style="max-width:900px; width:100%; max-height:90dvh; overflow-y:auto; background:var(--surface-1); border:1px solid var(--border-strong); box-shadow:var(--shadow-theater); margin:0; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:12px;">
        <div>
          <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
            🔒 Developer-Only Tooling • Not Publicly Writable
          </span>
          <h3 style="margin:6px 0 2px 0; font-size:20px; font-weight:800; color:var(--text);">
            Universal Course JSON Importer &amp; Preview Validator
          </h3>
          <p style="margin:0; font-size:12.8px; color:var(--text-secondary);">
            Validates schemaVersion, targetLanguage, nativeLanguage, instructionalLanguage, courseTrackId, duplicate IDs, missing references, and unsupported activity types before requiring explicit confirmation.
          </p>
        </div>
        <button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12.5px;" onclick="closeDevCourseImporterModal()">✕ Close</button>
      </div>

      <div style="display:grid; grid-template-columns:1fr auto; gap:10px; align-items:end; margin-bottom:10px;">
        <div>
          <label for="dev-importer-track-select" style="font-size:12.5px; font-weight:800; display:block; margin-bottom:4px;">
            Destination Course Track (28 Registered Tracks):
          </label>
          <select id="dev-importer-track-select" class="input-box" style="width:100%; font-size:13.5px;" data-testid="dev-importer-track-select">
            ${tracks
              .map(
                (t) =>
                  `<option value="${escapeHtml(t.trackId)}" ${t.trackId === initialTrackId ? 'selected' : ''}>
                    ${escapeHtml(t.trackId)} — ${escapeHtml(t.courseTitle)} (${escapeHtml(t.nativeLanguage)} → ${escapeHtml(t.targetLanguage)} • ${escapeHtml(t.availability)})
                  </option>`
              )
              .join('')}
          </select>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:42px; font-size:12px;" data-testid="btn-load-synthetic-fixture" onclick="loadSyntheticCourseJsonFixture()">
            📄 Fixture A: Spanish → English (es → en)
          </button>
          <button type="button" class="btn btn-sec" style="min-height:42px; font-size:12px;" data-testid="btn-load-synthetic-hindi-fixture" onclick="loadSyntheticHindiCourseJsonFixture()">
            🕉️ Fixture B: English → Hindi (en → hi)
          </button>
        </div>
      </div>

      <label for="dev-importer-json-textarea" style="font-size:12.5px; font-weight:800; display:block; margin-bottom:4px;">
        Course Package JSON (Schema v1.0):
      </label>
      <textarea
        id="dev-importer-json-textarea"
        data-testid="dev-importer-json-textarea"
        class="input-box"
        rows="9"
        style="width:100%; font-family:ui-monospace, SFMono-Regular, monospace; font-size:12px; line-height:1.45; margin-bottom:10px;"
        placeholder="Paste Course Package JSON or click 'Load Synthetic Test Fixture'..."
      >${escapeHtml(SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON)}</textarea>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
        <button type="button" class="btn" data-testid="btn-validate-preview-import" onclick="runDevImportPreview()">
          🔍 Validate &amp; Preview Import
        </button>
      </div>

      <div id="dev-importer-preview-box" data-testid="dev-importer-preview-box"></div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

export function closeDevCourseImporterModal(): void {
  const modal = document.getElementById('lango-dev-importer-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

export function loadSyntheticCourseJsonFixture(): void {
  const textarea = document.getElementById(
    'dev-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  const selectEl = document.getElementById(
    'dev-importer-track-select'
  ) as HTMLSelectElement | null;
  if (textarea) {
    textarea.value = SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON;
  }
  if (selectEl) {
    selectEl.value = 'track:es-to-en';
  }
  runDevImportPreview();
}

export function loadSyntheticHindiCourseJsonFixture(): void {
  const textarea = document.getElementById(
    'dev-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  const selectEl = document.getElementById(
    'dev-importer-track-select'
  ) as HTMLSelectElement | null;
  if (textarea) {
    textarea.value = SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON;
  }
  if (selectEl) {
    selectEl.value = 'track:en-to-hi';
  }
  runDevImportPreview();
}

export function runDevImportPreview(): void {
  const textarea = document.getElementById(
    'dev-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  const selectEl = document.getElementById(
    'dev-importer-track-select'
  ) as HTMLSelectElement | null;
  const previewBox = document.getElementById('dev-importer-preview-box');
  if (!textarea || !selectEl || !previewBox) return;

  const report = validateAndPreviewCourseImport(
    textarea.value,
    selectEl.value
  );
  lastImportPreviewReport = report;

  const statusColor =
    report.validationStatus === 'rejected'
      ? 'var(--danger)'
      : report.validationStatus === 'valid_with_warnings'
        ? 'var(--warn)'
        : 'var(--success)';

  previewBox.innerHTML = `
    <div style="padding:14px; background:var(--surface-2); border:2px solid ${statusColor}; border-radius:var(--radius-md);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <strong style="font-size:15px; color:var(--text);">
          Import Preview &amp; Validation Report
        </strong>
        <span class="tag" style="background:${statusColor}; color:#fff; font-weight:800;" data-testid="import-preview-validation-status">
          Status: ${escapeHtml(report.validationStatus.toUpperCase())}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:8px; font-size:12.5px; margin-bottom:10px;">
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Course Title:</b><br>${escapeHtml(report.courseTitle || '—')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Course Track:</b><br>${escapeHtml(report.courseTrackId || '—')} (Dest: ${escapeHtml(report.expectedCourseTrackId)})
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Target Language:</b><br>${escapeHtml(report.targetLanguage || '—')} (${escapeHtml(report.targetVariety || '—')})
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Native Language:</b><br>${escapeHtml(report.nativeLanguage || '—')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Instructional Language:</b><br>${escapeHtml(report.instructionalLanguage || '—')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Schema Version:</b><br>${escapeHtml(report.schemaVersion || '—')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);" data-testid="import-preview-counts">
          <b>Structure Counts:</b><br>${report.moduleCount} Modules • ${report.sectionCount} Sections • ${report.lessonCount} Lessons
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Included Activity Types:</b><br>${escapeHtml(report.includedActivityTypes.join(', ') || 'None')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);" data-testid="import-preview-unsupported">
          <b>Unsupported Content Types:</b><br>${escapeHtml(report.unsupportedActivityTypes.join(', ') || 'None')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Missing References:</b><br>${escapeHtml(report.missingReferences.join(', ') || 'None')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Duplicate Identifiers:</b><br>${escapeHtml(report.duplicateIdentifiers.join(', ') || 'None')}
        </div>
        <div style="padding:8px; background:var(--surface-1); border-radius:var(--radius-xs);">
          <b>Potential Conflicts:</b><br>${escapeHtml(report.potentialConflicts.join(' | ') || 'None')}
        </div>
      </div>

      ${
        report.errors.length > 0
          ? `<div style="padding:10px; background:var(--danger-container); color:var(--danger-on-container); border-radius:var(--radius-sm); font-size:12.5px; margin-bottom:8px;" data-testid="import-preview-errors">
              <b>❌ Validation Errors (${report.errors.length}):</b>
              <ul style="margin:4px 0 0 18px; padding:0;">
                ${report.errors.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}
              </ul>
            </div>`
          : ''
      }

      ${
        report.warnings.length > 0
          ? `<div style="padding:10px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-sm); font-size:12.5px; margin-bottom:8px;">
              <b>⚠️ Warnings &amp; Extension Notices (${report.warnings.length}):</b>
              <ul style="margin:4px 0 0 18px; padding:0;">
                ${report.warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join('')}
              </ul>
            </div>`
          : ''
      }

      ${
        report.valid
          ? `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:10px; padding-top:10px; border-top:1px solid var(--border-subtle);">
              <span style="font-size:12.5px; font-weight:700; color:var(--text);">
                Explicit confirmation required: Commit this package to <b>${escapeHtml(report.expectedCourseTrackId)}</b> in dev session?
              </span>
              <button type="button" class="btn btn-success" data-testid="btn-confirm-dev-import" onclick="confirmDevPilotImport()">
                ✅ Confirm &amp; Commit Dev Pilot Import
              </button>
            </div>`
          : ''
      }
    </div>
  `;
}

export function confirmDevPilotImport(): void {
  const textarea = document.getElementById(
    'dev-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  const selectEl = document.getElementById(
    'dev-importer-track-select'
  ) as HTMLSelectElement | null;
  const previewBox = document.getElementById('dev-importer-preview-box');
  if (!textarea || !selectEl || !previewBox || !lastImportPreviewReport?.valid) {
    return;
  }

  const destTrackId = selectEl.value;
  const result = commitDevPilotCourseImport(textarea.value, destTrackId, {
    confirmedByDeveloper: true,
    isDevelopmentEnvironment: true,
  });

  if (result.committed) {
    selectCourseTrackById(destTrackId);
    closeDevCourseImporterModal();
  } else {
    previewBox.insertAdjacentHTML(
      'beforeend',
      `<div style="margin-top:8px; color:var(--danger); font-weight:700;">${escapeHtml(result.message)}</div>`
    );
  }
}
