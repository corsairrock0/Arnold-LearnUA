// ============================================================================
// LangoUA — IDENTIFY VISUAL VOCABULARY UI CONTROLLER & RENDERER
// ============================================================================

import {
  IDENTIFY_CATEGORIES,
  IdentifyCategory,
  IdentifyHotspot,
  IdentifyScene,
  renderIdentifySceneSvgDataUri,
} from './identifyData';
import {
  computeIdentifySceneSummary,
  generateIdentifyMultipleChoiceOptions,
  IdentifyExplorationMode,
  IdentifyPersistentProgress,
  IdentifyQuizMode,
  loadIdentifyProgress,
  normalizeIdentifyUk,
  recordIdentifyAttempt,
  recordIdentifyShowAnswer,
  saveIdentifyProgress,
  validateIdentifyTypedAnswer,
} from './identifyEngine';
import { FREQ_6000_DB } from './vocabData';

export interface IdentifyExternalHooks {
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  speakUkrainian: (text: string) => void;
  inspectCourseWord: (uk: string) => void;
  addWordByUkToFSRS: (uk: string, en: string) => boolean;
}

let identifyProgress: IdentifyPersistentProgress = loadIdentifyProgress();
let activeHotspotId: string = '';
let showCategoryBrowser: boolean = false;
let showSceneSummaryModal: boolean = false;
let categorySearchQuery: string = '';
let hooks: IdentifyExternalHooks | null = null;

export function registerIdentifyHooks(extHooks: IdentifyExternalHooks): void {
  hooks = extHooks;
}

function escapeSingleQuotes(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getActiveCategory(): IdentifyCategory {
  return (
    IDENTIFY_CATEGORIES.find((c) => c.id === identifyProgress.activeCategoryId) ||
    IDENTIFY_CATEGORIES[0]
  );
}

function getActiveScene(cat: IdentifyCategory): IdentifyScene {
  return (
    cat.scenes.find((s) => s.id === identifyProgress.activeSceneId) ||
    cat.scenes[0]
  );
}

function syncActiveHotspot(scene: IdentifyScene): IdentifyHotspot {
  const sp = identifyProgress.scenes[scene.id];

  if (identifyProgress.explorationMode === 'guided') {
    // If current hotspot is valid and still unanswered/incorrect, keep it; otherwise pick first unresolved
    const current = scene.targets.find((t) => t.id === activeHotspotId);
    if (current) {
      const st = sp?.targets[current.id]?.status || 'unanswered';
      if (st === 'unanswered' || st === 'incorrect') {
        return current;
      }
    }
    const nextUnresolved = scene.targets.find((t) => {
      const st = sp?.targets[t.id]?.status || 'unanswered';
      return st === 'unanswered' || st === 'incorrect';
    });
    if (nextUnresolved) {
      activeHotspotId = nextUnresolved.id;
      return nextUnresolved;
    }
  }

  const found = scene.targets.find((t) => t.id === activeHotspotId);
  if (found) return found;
  activeHotspotId = scene.targets[0].id;
  return scene.targets[0];
}

function formatGenderBadge(gender: IdentifyHotspot['gender']): string {
  switch (gender) {
    case 'm':
      return 'Masculine noun (ч.р.)';
    case 'f':
      return 'Feminine noun (ж.р.)';
    case 'n':
      return 'Neuter noun (с.р.)';
    case 'pl':
      return 'Plural noun (мн.)';
  }
}

// ============================================================================
// INTERACTIVE HANDLERS BOUND TO WINDOW
// ============================================================================
export function selectIdentifyCategory(categoryId: string): void {
  hooks?.triggerHaptic('light');
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return;
  identifyProgress.activeCategoryId = cat.id;
  identifyProgress.activeSceneId = cat.scenes[0].id;
  activeHotspotId = cat.scenes[0].targets[0].id;
  showCategoryBrowser = false;
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function selectIdentifyScene(sceneId: string): void {
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const scene = cat.scenes.find((s) => s.id === sceneId);
  if (!scene) return;
  identifyProgress.activeSceneId = scene.id;
  activeHotspotId = scene.targets[0].id;
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function setIdentifyExplorationMode(mode: IdentifyExplorationMode): void {
  hooks?.triggerHaptic('light');
  identifyProgress.explorationMode = mode;
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  if (mode === 'guided') {
    const sp = identifyProgress.scenes[scene.id];
    const nextUnresolved = scene.targets.find((t) => {
      const st = sp?.targets[t.id]?.status || 'unanswered';
      return st === 'unanswered' || st === 'incorrect';
    });
    if (nextUnresolved) activeHotspotId = nextUnresolved.id;
  }
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function setIdentifyQuizMode(mode: IdentifyQuizMode): void {
  hooks?.triggerHaptic('light');
  identifyProgress.quizMode = mode;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function selectIdentifyHotspot(hotspotId: string): void {
  hooks?.triggerHaptic('light');
  activeHotspotId = hotspotId;
  showSceneSummaryModal = false;
  renderIdentifyTab();
}

export function handleIdentifyMCOption(hotspotId: string, chosenUk: string): void {
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const target = scene.targets.find((t) => t.id === hotspotId);
  if (!target) return;

  const isCorrect = normalizeIdentifyUk(chosenUk) === normalizeIdentifyUk(target.uk);
  const feedback = isCorrect
    ? `✅ Правильно! "${target.uk}" — ${target.en}.`
    : `❌ "${chosenUk}" is not right for this object. Try another option or click "👁️ Show Answer".`;

  hooks?.triggerHaptic(isCorrect ? 'heavy' : 'light');
  recordIdentifyAttempt(
    identifyProgress,
    scene,
    target,
    'mc',
    isCorrect,
    chosenUk,
    feedback
  );
  saveIdentifyProgress(identifyProgress);

  if (isCorrect) {
    hooks?.speakUkrainian(target.uk);
  }
  renderIdentifyTab();
}

export function submitIdentifyTypedAnswer(hotspotId: string): void {
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const target = scene.targets.find((t) => t.id === hotspotId);
  if (!target) return;

  const inputEl = document.getElementById('identify-fill-input') as HTMLInputElement | null;
  const rawVal = inputEl ? inputEl.value : '';
  const validation = validateIdentifyTypedAnswer(rawVal, target);

  if (validation.errorType === 'empty') {
    hooks?.triggerHaptic('light');
    const fbEl = document.getElementById('identify-live-feedback');
    if (fbEl) {
      fbEl.innerHTML = `<div style="padding:10px 12px; border-radius:var(--radius-sm); background:var(--warn-container); color:var(--warn-on-container); font-size:13px; font-weight:700;">${escapeHtml(validation.feedback)}</div>`;
    }
    return;
  }

  hooks?.triggerHaptic(validation.isCorrect ? 'heavy' : 'light');
  recordIdentifyAttempt(
    identifyProgress,
    scene,
    target,
    'fill',
    validation.isCorrect,
    rawVal.trim(),
    validation.feedback
  );
  saveIdentifyProgress(identifyProgress);

  if (validation.isCorrect) {
    hooks?.speakUkrainian(target.uk);
  }
  renderIdentifyTab();
}

export function insertIdentifyChar(ch: string): void {
  hooks?.triggerHaptic('light');
  const inputEl = document.getElementById('identify-fill-input') as HTMLInputElement | null;
  if (!inputEl) return;
  const start = inputEl.selectionStart ?? inputEl.value.length;
  const end = inputEl.selectionEnd ?? inputEl.value.length;
  inputEl.value = inputEl.value.slice(0, start) + ch + inputEl.value.slice(end);
  inputEl.focus();
  inputEl.setSelectionRange(start + ch.length, start + ch.length);
}

export function revealIdentifyAnswer(hotspotId: string): void {
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const target = scene.targets.find((t) => t.id === hotspotId);
  if (!target) return;

  hooks?.triggerHaptic('medium');
  recordIdentifyShowAnswer(identifyProgress, scene, target);
  saveIdentifyProgress(identifyProgress);
  hooks?.speakUkrainian(target.uk);
  renderIdentifyTab();
}

export function advanceIdentifyNextTarget(): void {
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const sp = identifyProgress.scenes[scene.id];

  const currentIdx = scene.targets.findIndex((t) => t.id === activeHotspotId);
  // Look for next unresolved target starting after currentIdx
  for (let offset = 1; offset <= scene.targets.length; offset++) {
    const candidate = scene.targets[(currentIdx + offset) % scene.targets.length];
    const st = sp?.targets[candidate.id]?.status || 'unanswered';
    if (st === 'unanswered' || st === 'incorrect') {
      activeHotspotId = candidate.id;
      renderIdentifyTab();
      return;
    }
  }

  // If all targets are resolved, open the Scene Summary view
  showSceneSummaryModal = true;
  renderIdentifyTab();
}

export function toggleIdentifyCategoryDrawer(force?: boolean): void {
  hooks?.triggerHaptic('light');
  showCategoryBrowser = typeof force === 'boolean' ? force : !showCategoryBrowser;
  renderIdentifyTab();
}

export function toggleIdentifySummaryView(force?: boolean): void {
  hooks?.triggerHaptic('light');
  showSceneSummaryModal = typeof force === 'boolean' ? force : !showSceneSummaryModal;
  renderIdentifyTab();
}

export function filterIdentifyCategories(query: string): void {
  categorySearchQuery = query;
  renderIdentifyTab();
}

export function retryIdentifyMistakes(): void {
  hooks?.triggerHaptic('medium');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const sp = identifyProgress.scenes[scene.id];
  if (sp) {
    for (const t of scene.targets) {
      const tp = sp.targets[t.id];
      if (tp && (tp.status === 'revealed' || tp.status === 'incorrect' || tp.incorrectAttempts > 0)) {
        delete sp.targets[t.id];
      }
    }
  }
  showSceneSummaryModal = false;
  const firstUnanswered = scene.targets.find((t) => !sp?.targets[t.id]);
  activeHotspotId = firstUnanswered ? firstUnanswered.id : scene.targets[0].id;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function resetIdentifyScene(): void {
  hooks?.triggerHaptic('medium');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  delete identifyProgress.scenes[scene.id];
  activeHotspotId = scene.targets[0].id;
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function goIdentifyNextScene(): void {
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const idx = cat.scenes.findIndex((s) => s.id === scene.id);
  if (idx + 1 < cat.scenes.length) {
    selectIdentifyScene(cat.scenes[idx + 1].id);
  } else {
    const catIdx = IDENTIFY_CATEGORIES.findIndex((c) => c.id === cat.id);
    const nextCat = IDENTIFY_CATEGORIES[(catIdx + 1) % IDENTIFY_CATEGORIES.length];
    selectIdentifyCategory(nextCat.id);
  }
}

export function addIdentifyWordToFSRS(uk: string, en: string): void {
  hooks?.triggerHaptic('heavy');
  const added = hooks?.addWordByUkToFSRS(uk, en);
  const btn = document.getElementById('identify-add-fsrs-btn');
  if (btn) {
    btn.innerText = added ? '✓ Added to Flashcards!' : '✓ Already in Flashcards';
  }
}

export function addIdentifySceneWordsToFSRS(): void {
  hooks?.triggerHaptic('heavy');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  let count = 0;
  for (const t of scene.targets) {
    if (hooks?.addWordByUkToFSRS(t.uk, t.en)) {
      count++;
    }
  }
  const btn = document.getElementById('identify-add-scene-fsrs-btn');
  if (btn) {
    btn.innerText = count > 0 ? `✓ Added ${count} Words to FSRS` : '✓ All Scene Words in FSRS';
  }
}

// ============================================================================
// MAIN RENDERER FOR #tab-identify
// ============================================================================
export function renderIdentifyTab(): void {
  const container = document.getElementById('identify-workspace-root');
  if (!container) return;

  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const activeTarget = syncActiveHotspot(scene);
  const summary = computeIdentifySceneSummary(identifyProgress, scene);
  const sp = identifyProgress.scenes[scene.id];
  const targetProg = sp?.targets[activeTarget.id];
  const targetStatus = targetProg?.status || 'unanswered';
  const isTargetResolved =
    targetStatus === 'correct-mc' ||
    targetStatus === 'correct-fill' ||
    targetStatus === 'revealed';

  // Compute global statistics across all 20 categories and 100 scenes
  let totalScenesCompleted = 0;
  let totalObjectsMastered = 0;
  for (const c of IDENTIFY_CATEGORIES) {
    for (const s of c.scenes) {
      const m = computeIdentifySceneSummary(identifyProgress, s);
      if (m.isSceneComplete) totalScenesCompleted++;
      totalObjectsMastered += m.correctMCCount + m.correctTypedCount;
    }
  }

  // Category gallery drawer (toggleable so learners can either browse all 20 categories or focus on the active scene)
  const q = categorySearchQuery.trim().toLowerCase();
  const filteredCats = IDENTIFY_CATEGORIES.filter(
    (c) =>
      !q ||
      c.titleEn.toLowerCase().includes(q) ||
      c.titleUk.toLowerCase().includes(q) ||
      c.coreVocab.some(
        (v) => v.en.toLowerCase().includes(q) || normalizeIdentifyUk(v.uk).includes(q)
      )
  );

  const categoryBrowserHtml = showCategoryBrowser
    ? `
      <div class="card" style="margin-bottom:14px; border:2px solid var(--accent);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <h2 style="margin:0; font-size:17px; font-weight:800;">🗂️ All 20 Visual Categories (100 Scenes)</h2>
            <p style="margin:2px 0 0 0; font-size:12.5px; color:var(--text-secondary);">Select any everyday environment to explore its 5 interactive photographic scenes.</p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <input type="search" class="input-box" style="min-height:38px; font-size:13.5px; max-width:220px;" placeholder="Search 20 categories or words..." value="${escapeHtml(categorySearchQuery)}" oninput="filterIdentifyCategories(this.value)">
            <button type="button" class="btn btn-sec" style="min-height:38px; padding:6px 12px;" onclick="toggleIdentifyCategoryDrawer(false)">✕ Close</button>
          </div>
        </div>
        <div class="identify-category-grid">
          ${filteredCats
            .map((c) => {
              let completedScenes = 0;
              for (const s of c.scenes) {
                if (computeIdentifySceneSummary(identifyProgress, s).isSceneComplete) {
                  completedScenes++;
                }
              }
              const isCurrent = c.id === cat.id;
              const thumbSrc = c.scenes[0].assetPath;
              return `
                <button type="button" class="identify-cat-card ${isCurrent ? 'active' : ''}" onclick="selectIdentifyCategory('${c.id}')">
                  <div class="identify-cat-thumb-wrap">
                    <img src="${thumbSrc}" alt="${escapeHtml(c.titleEn)}" loading="lazy" decoding="async" class="identify-cat-thumb" />
                    <span class="identify-cat-thumb-badge">${c.icon} ${completedScenes}/5</span>
                  </div>
                  <div style="font-weight:800; font-size:14px; color:var(--text); margin-top:6px;">${c.number}. ${escapeHtml(c.titleEn)}</div>
                  <div style="font-size:12.5px; color:var(--accent); font-weight:700;">${escapeHtml(c.titleUk)}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${c.coreVocab.length} core words • 5 photos</div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  // Compact horizontal category strip + scene selector
  const categoryPillsHtml = IDENTIFY_CATEGORIES.map((c) => {
    const isAct = c.id === cat.id;
    return `<button type="button" class="stage-pill ${isAct ? 'active' : ''}" onclick="selectIdentifyCategory('${c.id}')">${c.icon} ${c.number}. ${escapeHtml(c.titleEn)}</button>`;
  }).join('');

  const scenePillsHtml = cat.scenes
    .map((s) => {
      const sm = computeIdentifySceneSummary(identifyProgress, s);
      const isAct = s.id === scene.id;
      const badge = sm.isSceneComplete
        ? '✓'
        : `${sm.resolvedCount}/${sm.totalTargets}`;
      return `
        <button type="button" class="stage-pill identify-scene-pill ${isAct ? 'active' : ''}" onclick="selectIdentifyScene('${s.id}')">
          <img src="${s.assetPath}" alt="" loading="lazy" decoding="async" class="identify-scene-pill-thumb" />
          <span>Scene ${s.sceneNumber}: ${escapeHtml(s.titleEn)}</span>
          <span style="opacity:0.85; font-size:11px; margin-left:4px;">(${badge})</span>
        </button>
      `;
    })
    .join('');

  // Render real photographic scene & hotspot overlay
  const sceneImgSrc = renderIdentifySceneSvgDataUri(scene);

  const hotspotsOverlayHtml = scene.targets
    .map((t) => {
      const tp = sp?.targets[t.id];
      const st = tp?.status || 'unanswered';
      const isSelected = t.id === activeTarget.id;
      const isResolved =
        st === 'correct-mc' || st === 'correct-fill' || st === 'revealed';

      let stateClass = 'unanswered';
      let badgeSymbol = String(t.targetNumber);
      if (st === 'correct-mc' || st === 'correct-fill') {
        stateClass = 'correct';
        badgeSymbol = '✓';
      } else if (st === 'revealed') {
        stateClass = 'revealed';
        badgeSymbol = '👁️';
      } else if (st === 'incorrect') {
        stateClass = 'incorrect';
        badgeSymbol = '!';
      }

      const leftPct = (t.x * 100).toFixed(2);
      const topPct = (t.y * 100).toFixed(2);
      const widthPct = (t.width * 100).toFixed(2);
      const heightPct = (t.height * 100).toFixed(2);

      // Accessible label never leaks the Ukrainian answer before it is answered/revealed
      const ariaLabel = isResolved
        ? `Target ${t.targetNumber}: ${t.uk} (${t.en})`
        : `Target ${t.targetNumber}: ${t.en}`;

      const resolvedChip = isResolved
        ? `<span class="identify-hotspot-word">${escapeHtml(t.uk)}</span>`
        : '';

      return `
        <button
          type="button"
          class="identify-hotspot ${stateClass} ${isSelected ? 'selected' : ''}"
          style="left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%;"
          onclick="selectIdentifyHotspot('${t.id}')"
          aria-label="${escapeHtml(ariaLabel)}"
          title="${escapeHtml(ariaLabel)}"
        >
          <span class="identify-hotspot-badge">${badgeSymbol}</span>
          ${resolvedChip}
        </button>
      `;
    })
    .join('');

  // Accessible numbered target selector list below the image
  const accessibleTargetListHtml = scene.targets
    .map((t) => {
      const tp = sp?.targets[t.id];
      const st = tp?.status || 'unanswered';
      const isSelected = t.id === activeTarget.id;
      const isResolved =
        st === 'correct-mc' || st === 'correct-fill' || st === 'revealed';

      let icon = `#${t.targetNumber}`;
      if (st === 'correct-mc' || st === 'correct-fill') icon = `✓ #${t.targetNumber}`;
      else if (st === 'revealed') icon = `👁️ #${t.targetNumber}`;
      else if (st === 'incorrect') icon = `✗ #${t.targetNumber}`;

      const labelText = isResolved
        ? `${icon} ${escapeHtml(t.uk)}`
        : `${icon} (${escapeHtml(t.en)})`;

      return `
        <button
          type="button"
          class="identify-target-chip ${st} ${isSelected ? 'selected' : ''}"
          onclick="selectIdentifyHotspot('${t.id}')"
        >
          ${labelText}
        </button>
      `;
    })
    .join('');

  // Right-hand (or bottom) Interactive Quiz & Answer Panel
  const mcOptions = generateIdentifyMultipleChoiceOptions(activeTarget, cat);
  const synonymsLine =
    activeTarget.acceptedSynonyms.length > 0
      ? `<div style="font-size:12.5px; color:var(--text-secondary); margin-top:4px;"><b>Accepted synonyms:</b> ${activeTarget.acceptedSynonyms.map(escapeHtml).join(', ')}</div>`
      : '';

  const wordDetailCardHtml = isTargetResolved
    ? `
      <div class="identify-answer-card ${targetStatus === 'revealed' ? 'revealed' : 'correct'}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">
          <div>
            <span class="tag" style="background:${targetStatus === 'revealed' ? 'var(--warn-container)' : 'var(--success-container)'}; color:${targetStatus === 'revealed' ? 'var(--warn-on-container)' : 'var(--success-on-container)'}; font-weight:800;">
              ${targetStatus === 'revealed' ? '👁️ Answer Revealed • Needs Practice' : '✅ Mastered in Scene'}
            </span>
            <div style="font-size:26px; font-weight:900; color:var(--text); margin-top:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
              🔊 ${escapeHtml(activeTarget.uk)}
            </div>
            <div style="font-size:16px; font-weight:800; color:var(--accent);">${escapeHtml(activeTarget.en)}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${formatGenderBadge(activeTarget.gender)}</div>
            ${synonymsLine}
          </div>
        </div>

        <div class="example-chip" style="margin-top:12px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.exampleUk)}')">
          <div style="font-weight:800; font-size:14px; color:var(--text);">🔊 ${escapeHtml(activeTarget.exampleUk)}</div>
          <div style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(activeTarget.exampleEn)}</div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
          <button type="button" class="btn" style="padding:8px 14px; font-size:13px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">🔊 Hear Word</button>
          <button type="button" class="btn btn-sec" style="padding:8px 14px; font-size:13px;" onclick="inspectCourseWord('${escapeSingleQuotes(activeTarget.uk)}')">🔍 7-Case Table</button>
          <button type="button" id="identify-add-fsrs-btn" class="btn btn-sec" style="padding:8px 14px; font-size:13px;" onclick="addIdentifyWordToFSRS('${escapeSingleQuotes(activeTarget.uk)}', '${escapeSingleQuotes(activeTarget.en)}')">+ Add to Flashcards</button>
          <button type="button" class="btn btn-success" style="padding:8px 14px; font-size:13px; margin-left:auto;" onclick="advanceIdentifyNextTarget()">Next Object →</button>
        </div>
      </div>
    `
    : '';

  const quizControlsHtml = !isTargetResolved
    ? identifyProgress.quizMode === 'mc'
      ? `
        <div style="margin-top:10px;">
          <div style="font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            Choose the correct Ukrainian word for <b>Target #${activeTarget.targetNumber} (${escapeHtml(activeTarget.en)})</b>:
          </div>
          ${mcOptions
            .map((opt) => {
              const wasWrongPick =
                targetProg?.status === 'incorrect' &&
                targetProg.lastUserAnswer === opt;
              return `
                <button
                  type="button"
                  class="option-btn ${wasWrongPick ? 'wrong' : ''}"
                  onclick="handleIdentifyMCOption('${activeTarget.id}', '${escapeSingleQuotes(opt)}')"
                >
                  ${escapeHtml(opt)}
                </button>
              `;
            })
            .join('')}
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <button
              type="button"
              class="btn btn-warn"
              id="identify-show-answer-btn"
              onclick="revealIdentifyAnswer('${activeTarget.id}')"
            >
              👁️ Show Answer
            </button>
            <span style="font-size:12px; color:var(--text-secondary);">Unsure? Reveal the word to study it now.</span>
          </div>
        </div>
      `
      : `
        <div style="margin-top:10px;">
          <label for="identify-fill-input" style="display:block; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">
            Type the Ukrainian word for <b>Target #${activeTarget.targetNumber} (${escapeHtml(activeTarget.en)})</b>:
          </label>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            ${['ґ', 'є', 'і', 'ї', '’', 'щ', 'ю', 'я']
              .map(
                (ch) =>
                  `<button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 10px; font-size:14px;" onclick="insertIdentifyChar('${ch}')">${ch}</button>`
              )
              .join('')}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input
              id="identify-fill-input"
              type="text"
              class="input-box"
              style="flex:1; min-width:170px;"
              placeholder="Введі́ть слово украї́нською..."
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              onkeydown="if(event.key==='Enter'){event.preventDefault(); submitIdentifyTypedAnswer('${activeTarget.id}');}"
            >
            <button type="button" class="btn" onclick="submitIdentifyTypedAnswer('${activeTarget.id}')">Check Answer</button>
          </div>
          <div style="font-size:11.5px; color:var(--text-secondary); margin-top:6px;">
            Stress marks and capitalization are optional. Ukrainian letters (<b>г/ґ, і/ї, и/і, е/є</b>) are checked accurately.
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <button
              type="button"
              class="btn btn-warn"
              id="identify-show-answer-btn"
              onclick="revealIdentifyAnswer('${activeTarget.id}')"
            >
              👁️ Show Answer
            </button>
            <span style="font-size:12px; color:var(--text-secondary);">Don't know this word yet? Click Show Answer.</span>
          </div>
        </div>
      `
    : '';

  const feedbackBannerHtml =
    targetProg?.lastFeedback
      ? `
        <div id="identify-live-feedback" style="margin-top:10px;">
          <div style="padding:10px 12px; border-radius:var(--radius-sm); font-size:13px; font-weight:700; background:${
            targetStatus === 'correct-mc' || targetStatus === 'correct-fill'
              ? 'var(--success-container)'
              : targetStatus === 'revealed'
              ? 'var(--warn-container)'
              : 'var(--danger-container)'
          }; color:${
            targetStatus === 'correct-mc' || targetStatus === 'correct-fill'
              ? 'var(--success-on-container)'
              : targetStatus === 'revealed'
              ? 'var(--warn-on-container)'
              : 'var(--danger-on-container)'
          };">
            ${escapeHtml(targetProg.lastFeedback)}
          </div>
        </div>
      `
      : '<div id="identify-live-feedback" style="margin-top:8px;"></div>';

  // End-of-scene summary panel
  const showSummary = showSceneSummaryModal || summary.isSceneComplete;
  const summaryPanelHtml = showSummary
    ? `
      <div class="card" style="margin-top:14px; border:2px solid var(--success); background:var(--surface-1);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <span class="tag" style="background:var(--success-container); color:var(--success-on-container); font-weight:800;">
              ${summary.isSceneComplete ? '🎉 Scene Complete!' : '📊 Scene Progress Summary'}
            </span>
            <h3 style="margin:6px 0 0 0; font-size:18px; font-weight:800;">
              ${escapeHtml(cat.titleEn)} — Scene ${scene.sceneNumber}: ${escapeHtml(scene.titleEn)}
            </h3>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${
              summary.needsPracticeTargets.length > 0
                ? `<button type="button" class="btn btn-warn" onclick="retryIdentifyMistakes()">🔄 Retry Mistakes / Revealed (${summary.needsPracticeTargets.length})</button>`
                : ''
            }
            <button type="button" class="btn btn-sec" onclick="resetIdentifyScene()">🔁 Reset Scene</button>
            <button type="button" class="btn btn-success" onclick="goIdentifyNextScene()">➡️ Next Scene</button>
            <button type="button" class="btn btn-sec" onclick="toggleIdentifyCategoryDrawer(true)">🗂️ All Categories</button>
          </div>
        </div>

        <div class="identify-summary-metrics">
          <div class="identify-metric-box">
            <div class="identify-metric-val">${summary.resolvedCount} / ${summary.totalTargets}</div>
            <div class="identify-metric-lbl">Objects Completed</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);">${summary.correctMCCount}</div>
            <div class="identify-metric-lbl">Correct (Multiple Choice)</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--accent);">${summary.correctTypedCount}</div>
            <div class="identify-metric-lbl">Correct (Typed Recall)</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--danger);">${summary.incorrectAttemptsTotal}</div>
            <div class="identify-metric-lbl">Incorrect Attempts</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--warn);">${summary.revealedCount}</div>
            <div class="identify-metric-lbl">Revealed (Show Answer)</div>
          </div>
        </div>

        ${
          summary.needsPracticeTargets.length > 0
            ? `
              <div style="margin-top:12px; padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
                <div style="font-size:13px; font-weight:800; color:var(--warn); margin-bottom:8px;">
                  📌 Words Needing Practice in This Scene (${summary.needsPracticeTargets.length}):
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  ${summary.needsPracticeTargets
                    .map(
                      (t) => `
                        <button type="button" class="stage-pill" onclick="selectIdentifyHotspot('${t.id}'); speakUkrainian('${escapeSingleQuotes(t.uk)}')">
                          🔊 <b>${escapeHtml(t.uk)}</b> — ${escapeHtml(t.en)}
                        </button>
                      `
                    )
                    .join('')}
                </div>
              </div>
            `
            : `
              <div style="margin-top:10px; font-size:13.5px; color:var(--success); font-weight:700;">
                🌟 Flawless mastery! Every object in this scene was identified independently without needing Show Answer.
              </div>
            `
        }
      </div>
    `
    : '';

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
        <button type="button" class="btn btn-sec" style="min-height:38px; padding:6px 12px;" onclick="toggleIdentifyCategoryDrawer()">
          🗂️ Browse All 20 Categories (${totalScenesCompleted}/100 Scenes)
        </button>
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
          Mastered Objects: ${totalObjectsMastered}
        </span>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button type="button" id="identify-add-scene-fsrs-btn" class="btn btn-success" style="min-height:38px; padding:6px 12px; font-size:12.5px;" onclick="addIdentifySceneWordsToFSRS()">
          + Add Scene Vocab to FSRS
        </button>
        <button type="button" class="btn btn-sec" style="min-height:38px; padding:6px 12px; font-size:12.5px;" onclick="toggleIdentifySummaryView()">
          📊 Scene Summary (${summary.resolvedCount}/${summary.totalTargets})
        </button>
      </div>
    </div>

    ${categoryBrowserHtml}

    <div class="card" style="margin-bottom:12px; padding:12px 14px;">
      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
        1. Everyday Category (${cat.number}/20 — ${escapeHtml(cat.titleEn)} • ${escapeHtml(cat.titleUk)}):
      </div>
      <div class="stage-bar" style="margin-bottom:10px;">
        ${categoryPillsHtml}
      </div>

      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
        2. Photographic Scene (${scene.sceneNumber}/5 — ${escapeHtml(scene.titleUk)}):
      </div>
      <div class="stage-bar" style="margin-bottom:10px;">
        ${scenePillsHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:8px; border-top:1px solid var(--border-subtle);">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Exploration:</span>
          <button type="button" class="stage-pill ${identifyProgress.explorationMode === 'free' ? 'active' : ''}" onclick="setIdentifyExplorationMode('free')">🧭 Free Exploration</button>
          <button type="button" class="stage-pill ${identifyProgress.explorationMode === 'guided' ? 'active' : ''}" onclick="setIdentifyExplorationMode('guided')">🎯 Guided Practice</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Quiz Mode:</span>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'mc' ? 'active' : ''}" onclick="setIdentifyQuizMode('mc')">🅰️ Multiple Choice</button>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'fill' ? 'active' : ''}" onclick="setIdentifyQuizMode('fill')">⌨️ Fill in the Blank</button>
        </div>
      </div>
    </div>

    <div class="identify-stage-split">
      <!-- LEFT / TOP: Interactive Scene Canvas + Accessible Target Bar -->
      <div class="card" style="margin-bottom:0; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <div>
            <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
              ${cat.icon} Scene ${scene.sceneNumber} of 5
            </span>
            <h2 style="margin:4px 0 0 0; font-size:16.5px; font-weight:800;">
              ${escapeHtml(scene.titleEn)} <span style="color:var(--accent); font-weight:700;">(${escapeHtml(scene.titleUk)})</span>
            </h2>
          </div>
          <span style="font-size:12px; font-weight:700; color:var(--text-secondary);">
            ${summary.resolvedCount} / ${summary.totalTargets} identified
          </span>
        </div>

        <div class="identify-scene-viewport">
          <img
            src="${sceneImgSrc}"
            alt="${escapeHtml(scene.titleEn)} — ${escapeHtml(scene.settingDescriptionEn)}"
            class="identify-scene-img"
          />
          <div class="identify-hotspot-layer">
            ${hotspotsOverlayHtml}
          </div>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
            🎯 Accessible Target Selector (Click or Tab to any object in the scene):
          </div>
          <div class="identify-target-bar" role="list" aria-label="Scene Vocabulary Targets">
            ${accessibleTargetListHtml}
          </div>
        </div>
      </div>

      <!-- RIGHT / BOTTOM: Active Object Quiz & Vocabulary Breakdown -->
      <div class="card" style="margin-bottom:0; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
          <div>
            <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
              Target #${activeTarget.targetNumber} of ${scene.targets.length}
            </span>
            <h3 style="margin:6px 0 0 0; font-size:18px; font-weight:800;">
              Object: <span style="color:var(--accent);">${escapeHtml(activeTarget.en)}</span>
            </h3>
          </div>
          <button type="button" class="btn btn-sec" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="advanceIdentifyNextTarget()">
            Skip / Next →
          </button>
        </div>

        ${feedbackBannerHtml}
        ${quizControlsHtml}
        ${wordDetailCardHtml}
      </div>
    </div>

    ${summaryPanelHtml}
  `;
}
