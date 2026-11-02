// ============================================================================
// LangoUA — IDENTIFY VISUAL VOCABULARY UI CONTROLLER & UNIVERSAL RESPONSIVE RENDERER
// Supports:
// - 120 Scenes across 9 Topic Groups & 28 Categories (2,000 Unique Nouns, 2,520 Associations)
// - Adaptive 5-, 8-, and 10-Question Practice Rounds (Quick / Standard / Extended)
// - Separate Round Completion, Scene Coverage, and Scene Mastery Indicators
// - Dedicated Explore Mode (inspect all 20–22 objects without quiz scoring)
// - End-of-Round Results Panel with Idempotent XP Guard
// - Synchronized Zoom & Pan (Zoom In, Zoom Out, Fit Image, Reset Zoom, Drag-to-Pan)
// ============================================================================

import {
  getApprovedLearnerTargets,
  IDENTIFY_CATEGORIES,
  IDENTIFY_TOPIC_GROUPS,
  IdentifyCategory,
  IdentifyHotspot,
  IdentifyScene,
  isScenePlayableForStudents,
  renderIdentifySceneSvgDataUri,
} from './identifyData';
import {
  claimIdentifyRoundXpIfEligible,
  computeIdentifyRoundSummary,
  computeIdentifySceneSummary,
  ensureActiveIdentifyRound,
  generateIdentifyMultipleChoiceOptions,
  IdentifyExplorationMode,
  IdentifyPersistentProgress,
  IdentifyQuizMode,
  IdentifyRoundLength,
  loadIdentifyProgress,
  normalizeIdentifyUk,
  recordIdentifyAttempt,
  recordIdentifyExploreInspection,
  recordIdentifyShowAnswer,
  saveIdentifyProgress,
  startIdentifyPracticeRound,
  transliterateUkToPronunciation,
  validateIdentifyTypedAnswer,
} from './identifyEngine';
import {
  clampZoomPanState,
  computeRenderedImageRect,
  DEFAULT_ZOOM_PAN_STATE,
  IdentifyZoomPanState,
  isPointerGesturePanDrag,
  ObjectFitMode,
} from './identifyResponsiveGeometry';
import {
  getEffectiveIdentifyScene,
  getActivePilotVariantForScene,
  setActivePilotVariantForScene,
  validateIdentifySceneQuality,
} from './identifySceneIntelligence';

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
let activeTopicGroupFilter: string = 'all';
let sceneFitMode: ObjectFitMode = 'contain';
let showBoundingBoxOutlines: boolean = false;
let zoomPanState: IdentifyZoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
let lastPanDragEndedAtMs = 0;
let hooks: IdentifyExternalHooks | null = null;
let viewportResizeObserver: ResizeObserver | null = null;
let windowResizeBound = false;

export function registerIdentifyHooks(extHooks: IdentifyExternalHooks): void {
  hooks = extHooks;
}

export function getIdentifyZoomPanState(): IdentifyZoomPanState {
  return { ...zoomPanState };
}

function escapeSingleQuotes(s: string): string {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');
}

function escapeHtml(s: string): string {
  return String(s || '')
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
  const baseScene =
    cat.scenes.find((s) => s.id === identifyProgress.activeSceneId) ||
    cat.scenes[0];

  const effective = getEffectiveIdentifyScene(baseScene.id, {
    includeUnpublishedDraft: true,
  });
  return effective || baseScene;
}

function syncActiveHotspot(scene: IdentifyScene): IdentifyHotspot | undefined {
  const approvedTargets = getApprovedLearnerTargets(scene);
  if (approvedTargets.length === 0) {
    activeHotspotId = '';
    return undefined;
  }

  const sp = identifyProgress.scenes[scene.id];
  const ar = ensureActiveIdentifyRound(identifyProgress, scene);
  const roundTargetSet = new Set(ar.targetIds);

  if (identifyProgress.explorationMode === 'explore') {
    const found = approvedTargets.find((t) => t.id === activeHotspotId);
    if (found) return found;
    activeHotspotId = approvedTargets[0]?.id || '';
    return approvedTargets[0];
  }

  // In 'guided' or 'free' practice mode, prioritize targets in the active 5/8/10-question round
  const roundTargets = approvedTargets.filter((t) => roundTargetSet.has(t.id));
  const pool = roundTargets.length > 0 ? roundTargets : approvedTargets;

  if (identifyProgress.explorationMode === 'guided') {
    const current = pool.find((t) => t.id === activeHotspotId);
    if (current && !ar.completedInRoundTargetIds.includes(current.id)) {
      const st = sp?.targets[current.id]?.status || 'unanswered';
      if (st === 'unanswered' || st === 'incorrect' || ar.roundNumber > 1) {
        return current;
      }
    }
    const nextUnresolved = pool.find((t) => {
      if (ar.completedInRoundTargetIds.includes(t.id)) return false;
      if (ar.roundNumber > 1) return true;
      const st = sp?.targets[t.id]?.status || 'unanswered';
      return st === 'unanswered' || st === 'incorrect';
    });
    if (nextUnresolved) {
      activeHotspotId = nextUnresolved.id;
      return nextUnresolved;
    }
  }

  const foundInPool = pool.find((t) => t.id === activeHotspotId);
  if (foundInPool) return foundInPool;

  const foundAny = approvedTargets.find((t) => t.id === activeHotspotId);
  if (foundAny) return foundAny;

  activeHotspotId = pool[0]?.id || approvedTargets[0]?.id || '';
  return pool[0] || approvedTargets[0];
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
// UNIVERSAL RESPONSIVE OVERLAY & ZOOM/PAN SYNCHRONIZER
// Aligns `.identify-hotspot-layer` to the exact rendered image box inside
// `#identify-zoom-stage-el` across any screen size, aspect ratio, letterboxing,
// zoom scale, or pan offset WITHOUT marker drift.
// ============================================================================

export function applyIdentifyZoomStageTransform(): void {
  if (typeof document === 'undefined') return;
  const viewportEl = document.getElementById('identify-scene-viewport-el');
  const stageEl = document.getElementById('identify-zoom-stage-el');
  const zoomBadgeEl = document.getElementById('identify-zoom-pct-badge');
  if (!stageEl) return;

  const cw = viewportEl?.clientWidth || 800;
  const ch = viewportEl?.clientHeight || 600;
  zoomPanState = clampZoomPanState(zoomPanState, cw, ch);

  stageEl.style.transform = `translate(${zoomPanState.panX}px, ${zoomPanState.panY}px) scale(${zoomPanState.scale})`;
  stageEl.setAttribute('data-zoom-scale', String(zoomPanState.scale));
  stageEl.setAttribute('data-pan-x', String(zoomPanState.panX));
  stageEl.setAttribute('data-pan-y', String(zoomPanState.panY));

  if (viewportEl) {
    viewportEl.style.cursor = zoomPanState.scale > 1.01 ? 'grab' : 'default';
  }
  if (zoomBadgeEl) {
    zoomBadgeEl.textContent = `${Math.round(zoomPanState.scale * 100)}%`;
  }
}

export function syncIdentifyRenderedImageOverlay(): void {
  if (typeof document === 'undefined') return;
  const viewportEl = document.getElementById('identify-scene-viewport-el');
  const imgEl = document.getElementById('identify-scene-img-el') as HTMLImageElement | null;
  const overlayEl = document.getElementById('identify-hotspot-layer-el');

  if (!viewportEl || !imgEl || !overlayEl) return;

  const containerWidth = viewportEl.clientWidth || 800;
  const containerHeight = viewportEl.clientHeight || 600;
  const intrinsicWidth =
    imgEl.naturalWidth ||
    Number(imgEl.getAttribute('data-intrinsic-width')) ||
    1200;
  const intrinsicHeight =
    imgEl.naturalHeight ||
    Number(imgEl.getAttribute('data-intrinsic-height')) ||
    900;

  const rect = computeRenderedImageRect({
    containerWidth,
    containerHeight,
    intrinsicWidth,
    intrinsicHeight,
    objectFit: sceneFitMode,
  });

  overlayEl.style.left = `${rect.offsetX.toFixed(2)}px`;
  overlayEl.style.top = `${rect.offsetY.toFixed(2)}px`;
  overlayEl.style.width = `${rect.renderedWidth.toFixed(2)}px`;
  overlayEl.style.height = `${rect.renderedHeight.toFixed(2)}px`;
  overlayEl.setAttribute('data-rendered-width', String(Math.round(rect.renderedWidth)));
  overlayEl.setAttribute('data-rendered-height', String(Math.round(rect.renderedHeight)));
  overlayEl.setAttribute('data-offset-x', String(Math.round(rect.offsetX)));
  overlayEl.setAttribute('data-offset-y', String(Math.round(rect.offsetY)));

  applyIdentifyZoomStageTransform();
}

function attachZoomPanPointerHandlers(): void {
  if (typeof document === 'undefined') return;
  const viewportEl = document.getElementById('identify-scene-viewport-el');
  if (!viewportEl || viewportEl.getAttribute('data-zoom-bound') === 'true') return;
  viewportEl.setAttribute('data-zoom-bound', 'true');

  let isDragging = false;
  let startClientX = 0;
  let startClientY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  viewportEl.addEventListener('pointerdown', (ev: PointerEvent) => {
    if (zoomPanState.scale <= 1.01) return;
    isDragging = true;
    startClientX = ev.clientX;
    startClientY = ev.clientY;
    initialPanX = zoomPanState.panX;
    initialPanY = zoomPanState.panY;
    viewportEl.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (ev: PointerEvent) => {
    if (!isDragging) return;
    const dx = ev.clientX - startClientX;
    const dy = ev.clientY - startClientY;
    const cw = viewportEl.clientWidth || 800;
    const ch = viewportEl.clientHeight || 600;
    zoomPanState = clampZoomPanState(
      {
        scale: zoomPanState.scale,
        panX: initialPanX + dx,
        panY: initialPanY + dy,
      },
      cw,
      ch
    );
    applyIdentifyZoomStageTransform();
  });

  window.addEventListener('pointerup', (ev: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    if (isPointerGesturePanDrag(startClientX, startClientY, ev.clientX, ev.clientY)) {
      lastPanDragEndedAtMs = Date.now();
    }
    viewportEl.style.cursor = zoomPanState.scale > 1.01 ? 'grab' : 'default';
  });

  viewportEl.addEventListener(
    'wheel',
    (ev: WheelEvent) => {
      if (!ev.ctrlKey && !ev.metaKey && zoomPanState.scale <= 1.01) return;
      ev.preventDefault();
      const delta = ev.deltaY < 0 ? 0.2 : -0.2;
      const cw = viewportEl.clientWidth || 800;
      const ch = viewportEl.clientHeight || 600;
      zoomPanState = clampZoomPanState(
        {
          scale: zoomPanState.scale + delta,
          panX: zoomPanState.panX,
          panY: zoomPanState.panY,
        },
        cw,
        ch
      );
      applyIdentifyZoomStageTransform();
    },
    { passive: false }
  );
}

function attachResponsiveViewportObservers(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const viewportEl = document.getElementById('identify-scene-viewport-el');
  const imgEl = document.getElementById('identify-scene-img-el') as HTMLImageElement | null;

  if (imgEl) {
    if (imgEl.complete) {
      syncIdentifyRenderedImageOverlay();
    } else {
      imgEl.addEventListener('load', () => syncIdentifyRenderedImageOverlay(), { once: true });
    }
  }

  if (typeof ResizeObserver !== 'undefined' && viewportEl) {
    if (viewportResizeObserver) {
      viewportResizeObserver.disconnect();
    }
    viewportResizeObserver = new ResizeObserver(() => {
      syncIdentifyRenderedImageOverlay();
    });
    viewportResizeObserver.observe(viewportEl);
  }

  if (!windowResizeBound) {
    windowResizeBound = true;
    window.addEventListener('resize', () => {
      syncIdentifyRenderedImageOverlay();
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => syncIdentifyRenderedImageOverlay(), 60);
    });
  }

  attachZoomPanPointerHandlers();
  syncIdentifyRenderedImageOverlay();
}

// ============================================================================
// ZOOM & PAN CONTROLS (Section 22)
// ============================================================================
export function zoomIdentifySceneIn(): void {
  hooks?.triggerHaptic('light');
  const viewportEl =
    typeof document !== 'undefined' ? document.getElementById('identify-scene-viewport-el') : null;
  const cw = viewportEl?.clientWidth || 800;
  const ch = viewportEl?.clientHeight || 600;
  zoomPanState = clampZoomPanState(
    {
      scale: Number((zoomPanState.scale + 0.35).toFixed(2)),
      panX: zoomPanState.panX,
      panY: zoomPanState.panY,
    },
    cw,
    ch
  );
  applyIdentifyZoomStageTransform();
}

export function zoomIdentifySceneOut(): void {
  hooks?.triggerHaptic('light');
  const viewportEl =
    typeof document !== 'undefined' ? document.getElementById('identify-scene-viewport-el') : null;
  const cw = viewportEl?.clientWidth || 800;
  const ch = viewportEl?.clientHeight || 600;
  zoomPanState = clampZoomPanState(
    {
      scale: Number((zoomPanState.scale - 0.35).toFixed(2)),
      panX: zoomPanState.panX,
      panY: zoomPanState.panY,
    },
    cw,
    ch
  );
  applyIdentifyZoomStageTransform();
}

export function resetIdentifySceneZoom(): void {
  hooks?.triggerHaptic('light');
  zoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
  applyIdentifyZoomStageTransform();
}

export function fitIdentifySceneView(): void {
  hooks?.triggerHaptic('light');
  sceneFitMode = sceneFitMode === 'contain' ? 'cover' : 'contain';
  zoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
  renderIdentifyTab();
}

export function panIdentifySceneBy(dx: number, dy: number): void {
  const viewportEl =
    typeof document !== 'undefined' ? document.getElementById('identify-scene-viewport-el') : null;
  const cw = viewportEl?.clientWidth || 800;
  const ch = viewportEl?.clientHeight || 600;
  zoomPanState = clampZoomPanState(
    {
      scale: zoomPanState.scale,
      panX: zoomPanState.panX + dx,
      panY: zoomPanState.panY + dy,
    },
    cw,
    ch
  );
  applyIdentifyZoomStageTransform();
}

// ============================================================================
// INTERACTIVE HANDLERS
// ============================================================================
export function selectIdentifyCategory(categoryId: string): void {
  hooks?.triggerHaptic('light');
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return;
  identifyProgress.activeCategoryId = cat.id;
  const playableFirst = cat.scenes.find((s) => isScenePlayableForStudents(s)) || cat.scenes[0];
  identifyProgress.activeSceneId = playableFirst.id;
  const effectiveScene = getActiveScene(cat);
  ensureActiveIdentifyRound(identifyProgress, effectiveScene);
  activeHotspotId = '';
  syncActiveHotspot(effectiveScene);
  zoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
  showCategoryBrowser = false;
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function selectIdentifyScene(sceneId: string): void {
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const baseScene = cat.scenes.find((s) => s.id === sceneId);
  if (!baseScene) return;
  identifyProgress.activeSceneId = baseScene.id;
  const effectiveScene = getActiveScene(cat);
  ensureActiveIdentifyRound(identifyProgress, effectiveScene);
  activeHotspotId = '';
  syncActiveHotspot(effectiveScene);
  zoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function switchIdentifyPilotVariant(firstArg: string, secondArg?: string): void {
  hooks?.triggerHaptic('medium');
  const baseSceneId = secondArg !== undefined ? firstArg : 'beach-nature-scene-3';
  const variantId = secondArg !== undefined ? secondArg : firstArg;
  setActivePilotVariantForScene(baseSceneId, variantId === 'baseline' ? null : variantId);
  const cat = getActiveCategory();
  const effectiveScene = getActiveScene(cat);
  activeHotspotId = effectiveScene.targets[0]?.id || '';
  showSceneSummaryModal = false;
  renderIdentifyTab();
}

export function setIdentifySceneFitMode(mode: ObjectFitMode): void {
  hooks?.triggerHaptic('light');
  sceneFitMode = mode;
  renderIdentifyTab();
}

export function toggleIdentifyBoundingBoxes(force?: boolean): void {
  hooks?.triggerHaptic('light');
  showBoundingBoxOutlines =
    typeof force === 'boolean' ? force : !showBoundingBoxOutlines;
  renderIdentifyTab();
}

export function setIdentifyExplorationMode(mode: IdentifyExplorationMode): void {
  hooks?.triggerHaptic('light');
  identifyProgress.explorationMode = mode;
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const approvedTargets = getApprovedLearnerTargets(scene);
  activeHotspotId = '';
  syncActiveHotspot(scene);
  if (mode === 'explore' && activeHotspotId) {
    const target = approvedTargets.find((t) => t.id === activeHotspotId);
    if (target) recordIdentifyExploreInspection(identifyProgress, scene, target);
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

export function setIdentifyRoundLength(len: IdentifyRoundLength): void {
  hooks?.triggerHaptic('light');
  const validLen: IdentifyRoundLength = len === 5 || len === 8 || len === 10 ? len : 8;
  identifyProgress.roundLength = validLen;
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  startIdentifyPracticeRound(identifyProgress, scene, { roundLength: validLen });
  activeHotspotId = '';
  syncActiveHotspot(scene);
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function practiceMoreIdentifyWords(): void {
  hooks?.triggerHaptic('medium');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  if (identifyProgress.explorationMode === 'explore') {
    identifyProgress.explorationMode = 'guided';
  }
  startIdentifyPracticeRound(identifyProgress, scene, {
    roundLength: identifyProgress.roundLength || 8,
    advanceRoundCounter: true,
  });
  activeHotspotId = '';
  syncActiveHotspot(scene);
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function reviewIdentifyRoundMistakes(): void {
  hooks?.triggerHaptic('medium');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  if (identifyProgress.explorationMode === 'explore') {
    identifyProgress.explorationMode = 'guided';
  }
  startIdentifyPracticeRound(identifyProgress, scene, {
    roundLength: identifyProgress.roundLength || 8,
    mistakeReviewOnly: true,
    advanceRoundCounter: true,
  });
  activeHotspotId = '';
  syncActiveHotspot(scene);
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function selectIdentifyHotspot(hotspotId: string): void {
  // Ignore accidental hotspot clicks within 160ms of completing a drag-pan gesture
  if (Date.now() - lastPanDragEndedAtMs < 160) {
    return;
  }
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const approvedTargets = getApprovedLearnerTargets(scene);
  const target = approvedTargets.find((t) => t.id === hotspotId);
  if (!target) return;

  activeHotspotId = hotspotId;
  if (identifyProgress.explorationMode === 'explore') {
    recordIdentifyExploreInspection(identifyProgress, scene, target);
    saveIdentifyProgress(identifyProgress);
    hooks?.speakUkrainian(target.uk);
  }
  showSceneSummaryModal = false;
  renderIdentifyTab();
}

export function getActiveIdentifyHotspotId(): string {
  return activeHotspotId;
}

export function handleIdentifyMCOption(hotspotId: string, chosenUk: string): void {
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const approvedTargets = getApprovedLearnerTargets(scene);
  const target = approvedTargets.find((t) => t.id === hotspotId);
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
  claimIdentifyRoundXpIfEligible(identifyProgress, scene);
  saveIdentifyProgress(identifyProgress);

  if (isCorrect) {
    hooks?.speakUkrainian(target.uk);
  }
  renderIdentifyTab();
}

export function submitIdentifyTypedAnswer(hotspotId: string): void {
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const approvedTargets = getApprovedLearnerTargets(scene);
  const target = approvedTargets.find((t) => t.id === hotspotId);
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
  claimIdentifyRoundXpIfEligible(identifyProgress, scene);
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
  const approvedTargets = getApprovedLearnerTargets(scene);
  const target = approvedTargets.find((t) => t.id === hotspotId);
  if (!target) return;

  hooks?.triggerHaptic('medium');
  recordIdentifyShowAnswer(identifyProgress, scene, target);
  claimIdentifyRoundXpIfEligible(identifyProgress, scene);
  saveIdentifyProgress(identifyProgress);
  hooks?.speakUkrainian(target.uk);
  renderIdentifyTab();
}

export function advanceIdentifyNextTarget(): void {
  hooks?.triggerHaptic('light');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  const approvedTargets = getApprovedLearnerTargets(scene);
  if (approvedTargets.length === 0) return;

  const sp = identifyProgress.scenes[scene.id];
  const ar = ensureActiveIdentifyRound(identifyProgress, scene);

  const pool =
    identifyProgress.explorationMode === 'explore'
      ? approvedTargets
      : approvedTargets.filter((t) => ar.targetIds.includes(t.id));
  const activePool = pool.length > 0 ? pool : approvedTargets;

  const currentIdx = activePool.findIndex((t) => t.id === activeHotspotId);
  for (let offset = 1; offset <= activePool.length; offset++) {
    const candidate = activePool[(currentIdx + offset) % activePool.length];
    if (identifyProgress.explorationMode === 'explore') {
      activeHotspotId = candidate.id;
      recordIdentifyExploreInspection(identifyProgress, scene, candidate);
      saveIdentifyProgress(identifyProgress);
      renderIdentifyTab();
      return;
    }
    const isCompletedInRound = ar.completedInRoundTargetIds.includes(candidate.id);
    const st = sp?.targets[candidate.id]?.status || 'unanswered';
    if (!isCompletedInRound && (ar.roundNumber > 1 || st === 'unanswered' || st === 'incorrect')) {
      activeHotspotId = candidate.id;
      renderIdentifyTab();
      return;
    }
  }

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

export function filterIdentifyByTopicGroup(groupId: string): void {
  hooks?.triggerHaptic('light');
  activeTopicGroupFilter = groupId;
  renderIdentifyTab();
}

export function retryIdentifyMistakes(): void {
  reviewIdentifyRoundMistakes();
}

export function resetIdentifyScene(): void {
  hooks?.triggerHaptic('medium');
  const cat = getActiveCategory();
  const scene = getActiveScene(cat);
  delete identifyProgress.scenes[scene.id];
  ensureActiveIdentifyRound(identifyProgress, scene);
  activeHotspotId = '';
  syncActiveHotspot(scene);
  showSceneSummaryModal = false;
  saveIdentifyProgress(identifyProgress);
  renderIdentifyTab();
}

export function goIdentifyNextScene(): void {
  hooks?.triggerHaptic('light');
  // Advance to the next verified playable scene across all categories
  const playableScenes: Array<{ catId: string; sceneId: string }> = [];
  for (const c of IDENTIFY_CATEGORIES) {
    for (const s of c.scenes) {
      const eff = getEffectiveIdentifyScene(s.id, { includeUnpublishedDraft: true }) || s;
      if (isScenePlayableForStudents(eff)) {
        playableScenes.push({ catId: c.id, sceneId: s.id });
      }
    }
  }
  if (playableScenes.length > 0) {
    const curIdx = playableScenes.findIndex((p) => p.sceneId === identifyProgress.activeSceneId);
    const next = playableScenes[(curIdx + 1) % playableScenes.length];
    identifyProgress.activeCategoryId = next.catId;
    selectIdentifyScene(next.sceneId);
    return;
  }

  const cat = getActiveCategory();
  const baseSceneId = identifyProgress.activeSceneId;
  const idx = cat.scenes.findIndex((s) => s.id === baseSceneId);
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
  const approvedTargets = getApprovedLearnerTargets(scene);
  let count = 0;
  for (const t of approvedTargets) {
    if (hooks?.addWordByUkToFSRS(t.uk, t.en)) {
      count++;
    }
  }
  const btn = document.getElementById('identify-add-scene-fsrs-btn');
  if (btn) {
    btn.innerText = count > 0 ? `✓ Added ${count} Verified Words to FSRS` : '✓ All Verified Scene Words in FSRS';
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
  const approvedTargets = getApprovedLearnerTargets(scene);
  const ar = ensureActiveIdentifyRound(identifyProgress, scene);
  const activeTarget = syncActiveHotspot(scene);
  const summary = computeIdentifySceneSummary(identifyProgress, scene);
  const roundSummary = computeIdentifyRoundSummary(identifyProgress, scene);
  const sp = identifyProgress.scenes[scene.id];
  const targetProg = activeTarget ? sp?.targets[activeTarget.id] : undefined;
  const targetStatus = targetProg?.status || 'unanswered';
  const isTargetResolved = Boolean(
    activeTarget &&
      (ar.completedInRoundTargetIds.includes(activeTarget.id) ||
        (ar.roundNumber === 1 &&
          (targetStatus === 'correct-mc' ||
            targetStatus === 'correct-fill' ||
            targetStatus === 'revealed')))
  );

  let totalScenesCompleted = 0;
  let totalObjectsMastered = 0;
  for (const c of IDENTIFY_CATEGORIES) {
    for (const s of c.scenes) {
      const m = computeIdentifySceneSummary(identifyProgress, s);
      if (m.isSceneComplete) totalScenesCompleted++;
      totalObjectsMastered += m.masteredCount;
    }
  }

  const q = categorySearchQuery.trim().toLowerCase();
  const filteredCats = IDENTIFY_CATEGORIES.filter((c) => {
    if (activeTopicGroupFilter !== 'all' && c.topicGroupId !== activeTopicGroupFilter) {
      return false;
    }
    if (!q) return true;
    return (
      c.titleEn.toLowerCase().includes(q) ||
      c.titleUk.toLowerCase().includes(q) ||
      c.coreVocab.some(
        (v) => v.en.toLowerCase().includes(q) || normalizeIdentifyUk(v.uk).includes(q)
      )
    );
  });

  const totalLibraryScenes = IDENTIFY_CATEGORIES.reduce((acc, c) => acc + c.scenes.length, 0);

  const topicGroupFilterPillsHtml = [
    `<button type="button" class="stage-pill ${activeTopicGroupFilter === 'all' ? 'active' : ''}" onclick="filterIdentifyByTopicGroup('all')">All 9 Topic Groups (120 Scenes)</button>`,
    ...IDENTIFY_TOPIC_GROUPS.map(
      (g) =>
        `<button type="button" class="stage-pill ${activeTopicGroupFilter === g.id ? 'active' : ''}" onclick="filterIdentifyByTopicGroup('${g.id}')">${g.number}. ${escapeHtml(g.titleEn)} (${g.targetSceneCount})</button>`
    ),
  ].join('');

  const categoryBrowserHtml = showCategoryBrowser
    ? `
      <div class="card" style="margin-bottom:14px; border:2px solid var(--accent);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <h2 style="margin:0; font-size:17px; font-weight:800;">🗂️ All ${IDENTIFY_CATEGORIES.length} Visual Categories (${totalLibraryScenes} Scenes • 2,000 Unique Nouns)</h2>
            <p style="margin:2px 0 0 0; font-size:12.5px; color:var(--text-secondary);">Organized across 9 Topic Groups with 20–22 concrete visual objects per scene (2,520 total associations).</p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <input type="search" class="input-box" style="min-height:38px; font-size:13.5px; max-width:220px;" placeholder="Search categories or 2,000 nouns..." value="${escapeHtml(categorySearchQuery)}" oninput="filterIdentifyCategories(this.value)">
            <button type="button" class="btn btn-sec" style="min-height:38px; padding:6px 12px;" onclick="toggleIdentifyCategoryDrawer(false)">✕ Close</button>
          </div>
        </div>
        <div class="stage-bar" style="margin-bottom:10px;">
          ${topicGroupFilterPillsHtml}
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
                    <span class="identify-cat-thumb-badge">${c.icon} ${completedScenes}/${c.scenes.length}</span>
                  </div>
                  <div style="font-weight:800; font-size:14px; color:var(--text); margin-top:6px;">${c.number}. ${escapeHtml(c.titleEn)}</div>
                  <div style="font-size:12.5px; color:var(--accent); font-weight:700;">${escapeHtml(c.titleUk)}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${c.coreVocab.length} unique nouns • ${c.scenes.length} scenes</div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  const categoryPillsHtml = IDENTIFY_CATEGORIES.map((c) => {
    const isAct = c.id === cat.id;
    return `<button type="button" class="stage-pill ${isAct ? 'active' : ''}" onclick="selectIdentifyCategory('${c.id}')">${c.icon} ${c.number}. ${escapeHtml(c.titleEn)}</button>`;
  }).join('');

  const scenePillsHtml = cat.scenes
    .map((s) => {
      const effectiveS = getEffectiveIdentifyScene(s.id, { includeUnpublishedDraft: true }) || s;
      const sm = computeIdentifySceneSummary(identifyProgress, effectiveS);
      const isAct = s.id === identifyProgress.activeSceneId;
      const isPlayable = sm.totalTargets > 0;
      const badge = !isPlayable
        ? '⏳ Awaiting Verification'
        : sm.isSceneMastered
        ? '★ Mastered'
        : `✓ ${sm.resolvedCount}/${sm.totalTargets} Verified`;
      return `
        <button type="button" class="stage-pill identify-scene-pill ${isAct ? 'active' : ''}" onclick="selectIdentifyScene('${s.id}')">
          <img src="${effectiveS.assetPath}" alt="" loading="lazy" decoding="async" class="identify-scene-pill-thumb" />
          <span>Scene ${s.sceneNumber}: ${escapeHtml(s.titleEn)}</span>
          <span style="opacity:0.85; font-size:11px; margin-left:4px;">(${badge})</span>
        </button>
      `;
    })
    .join('');

  const activeBaseSceneId = identifyProgress.activeSceneId;
  const activePilotVariant = getActivePilotVariantForScene(activeBaseSceneId);
  const validationReport = validateIdentifySceneQuality(scene);
  const hasVerifiedCategoryOverride =
    activeBaseSceneId.startsWith('beach-nature-scene-') ||
    activeBaseSceneId.startsWith('kitchen-scene-') ||
    activeBaseSceneId.startsWith('park-garden-scene-') ||
    activeBaseSceneId.startsWith('farmers-market-scene-');

  const pilotVariantBarHtml =
    activeBaseSceneId === 'beach-nature-scene-3'
      ? `
        <div data-testid="identify-pilot-variant-switcher" style="margin-bottom:10px; padding:10px 12px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
            <span style="font-size:12px; font-weight:800; color:var(--text);">
              🔬 Published Scene Verification Mode (Scene 3 — Beach & Nature):
            </span>
            <span class="tag" style="background:${
              validationReport.canPublish ? 'var(--success-container)' : 'var(--warn-container)'
            }; color:${
              validationReport.canPublish
                ? 'var(--success-on-container)'
                : 'var(--warn-on-container)'
            }; font-weight:800; font-size:11px;">
              ${
                validationReport.canPublish
                  ? `✓ Published & Visually Verified (${scene.targets.length} objects)`
                  : `⚠️ ${validationReport.findings.length} Quality Findings`
              }
            </span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-pilot-a' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-pilot-a')">
              🏖️ Pilot Scene A: Sunny Sea Beach (8 Objects)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-pilot-b' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-pilot-b')">
              🏔️ Pilot Scene B: Alpine Mountain Lake (5 Objects)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-verified-photo' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-verified-photo')">
              📷 Verified Photo Only (4 Visible Objects)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'baseline' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'baseline')">
              Original Baseline (Before Fix — 9 Targets)
            </button>
          </div>
        </div>
      `
      : hasVerifiedCategoryOverride
      ? `
        <div data-testid="identify-pilot-variant-switcher" style="margin-bottom:10px; padding:10px 12px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="font-size:12px; font-weight:800; color:var(--text);">
                🎯 Object Verification Mode:
              </span>
              <button type="button" class="stage-pill ${
                activePilotVariant !== 'baseline' ? 'active' : ''
              }" onclick="switchIdentifyPilotVariant('${activeBaseSceneId}', '${activeBaseSceneId}-verified')">
                ✓ Verified Object Locations (${scene.targets.length} Objects)
              </button>
              <button type="button" class="stage-pill ${
                activePilotVariant === 'baseline' ? 'active' : ''
              }" onclick="switchIdentifyPilotVariant('${activeBaseSceneId}', 'baseline')">
                Original Baseline
              </button>
            </div>
            <span class="tag" style="background:${
              validationReport.canPublish ? 'var(--success-container)' : 'var(--warn-container)'
            }; color:${
              validationReport.canPublish
                ? 'var(--success-on-container)'
                : 'var(--warn-on-container)'
            }; font-weight:800; font-size:11px;">
              ${
                validationReport.canPublish
                  ? `✓ Published & Visually Verified (${scene.targets.length} objects)`
                  : `⚠️ ${validationReport.findings.length} Quality Findings`
              }
            </span>
          </div>
        </div>
      `
      : '';

  const sceneImgSrc = renderIdentifySceneSvgDataUri(scene);
  const roundTargetSet = new Set(ar.targetIds);

  // Build co-registered hotspots inside the rendered-image overlay box ONLY for approved verified targets.
  const hotspotsOverlayHtml = approvedTargets
    .map((t) => {
      const tp = sp?.targets[t.id];
      const st = tp?.status || 'unanswered';
      const isSelected = Boolean(activeTarget && t.id === activeTarget.id);
      const inCurrentRound =
        identifyProgress.explorationMode === 'explore' || roundTargetSet.has(t.id);
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

      const pinCenterX = t.centerX ?? t.x + t.width / 2;
      const pinCenterY = t.centerY ?? t.y + t.height / 2;
      const relPinX =
        t.width > 0 ? Math.max(8, Math.min(92, ((pinCenterX - t.x) / t.width) * 100)) : 50;
      const relPinY =
        t.height > 0 ? Math.max(8, Math.min(92, ((pinCenterY - t.y) / t.height) * 100)) : 50;

      const showWordLabel =
        identifyProgress.explorationMode === 'explore' || isResolved;
      const ariaLabel = showWordLabel
        ? `Target ${t.targetNumber}: ${t.uk} (${t.en})`
        : `Target ${t.targetNumber}: ${t.en}`;

      const resolvedChip = showWordLabel
        ? `<span class="identify-hotspot-word">${escapeHtml(t.uk)}</span>`
        : '';

      const dimStyle =
        !inCurrentRound && !isSelected && !isResolved ? 'opacity:0.55;' : '';

      return `
        <button
          type="button"
          id="identify-hotspot-${escapeHtml(t.id)}"
          data-target-id="${escapeHtml(t.id)}"
          data-vocabulary-id="${escapeHtml(t.vocabularyId)}"
          data-in-active-round="${inCurrentRound ? 'true' : 'false'}"
          data-norm-x="${t.x}"
          data-norm-y="${t.y}"
          data-norm-w="${t.width}"
          data-norm-h="${t.height}"
          data-norm-cx="${pinCenterX.toFixed(4)}"
          data-norm-cy="${pinCenterY.toFixed(4)}"
          class="identify-hotspot ${stateClass} ${isSelected ? 'selected' : ''} ${
            showBoundingBoxOutlines ? 'show-bbox' : ''
          }"
          style="left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; ${dimStyle}"
          onclick="selectIdentifyHotspot('${t.id}')"
          aria-label="${escapeHtml(ariaLabel)}"
          title="${escapeHtml(ariaLabel)}"
        >
          <span
            class="identify-hotspot-pin-anchor"
            style="position:absolute; left:${relPinX.toFixed(1)}%; top:${relPinY.toFixed(1)}%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; pointer-events:none;"
          >
            <span class="identify-hotspot-badge">${badgeSymbol}</span>
            ${resolvedChip}
          </span>
        </button>
      `;
    })
    .join('');

  const targetBarList =
    identifyProgress.explorationMode === 'explore'
      ? approvedTargets
      : approvedTargets.filter((t) => roundTargetSet.has(t.id));

  const accessibleTargetListHtml =
    targetBarList.length > 0
      ? targetBarList
          .map((t) => {
            const tp = sp?.targets[t.id];
            const st = tp?.status || 'unanswered';
            const isSelected = Boolean(activeTarget && t.id === activeTarget.id);
            const isResolved =
              st === 'correct-mc' || st === 'correct-fill' || st === 'revealed';

            let icon = `#${t.targetNumber}`;
            if (st === 'correct-mc' || st === 'correct-fill') icon = `✓ #${t.targetNumber}`;
            else if (st === 'revealed') icon = `👁️ #${t.targetNumber}`;
            else if (st === 'incorrect') icon = `✗ #${t.targetNumber}`;

            const labelText =
              identifyProgress.explorationMode === 'explore' || isResolved
                ? `${icon} ${escapeHtml(t.uk)} (${escapeHtml(t.en)})`
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
          .join('')
      : `<div style="font-size:12px; color:var(--text-secondary);">No visually verified hotspots are active on this photograph yet.</div>`;

  const mcOptions = activeTarget ? generateIdentifyMultipleChoiceOptions(activeTarget, cat) : [];
  const pronunciationGuide = activeTarget ? transliterateUkToPronunciation(activeTarget.uk) : '';
  const synonymsLine =
    activeTarget && activeTarget.acceptedSynonyms.length > 0
      ? `<div style="font-size:12.5px; color:var(--text-secondary); margin-top:4px;"><b>Accepted synonyms:</b> ${activeTarget.acceptedSynonyms.map(escapeHtml).join(', ')}</div>`
      : '';

  const shortenedRoundNoticeHtml = roundSummary.shortenedExplanationEn
    ? `
      <div data-testid="identify-shortened-round-notice" style="margin-bottom:10px; padding:8px 12px; border-radius:var(--radius-sm); background:var(--warn-container); color:var(--warn-on-container); font-size:12px; font-weight:700;">
        ℹ️ ${escapeHtml(roundSummary.shortenedExplanationEn)}
      </div>
    `
    : '';

  const unverifiedSceneCardHtml = !activeTarget
    ? `
      <div data-testid="identify-unverified-scene-notice" style="padding:14px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-subtle);">
        <div style="font-size:14px; font-weight:800; color:var(--text); margin-bottom:6px;">
          ⏳ Scene Awaiting AI Image Generation & Hotspot Verification
        </div>
        <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
          To protect learner accuracy, Lango only displays and quizzes vocabulary objects that are visually verified to exist in the photograph with a verified hotspot on the real object.
          This scene's <b>${(scene.plannedTargets ?? scene.targets).length} planned curriculum nouns</b> are preserved in Content Studio for upcoming AI image generation.
        </div>
        <button type="button" class="btn btn-success" onclick="goIdentifyNextScene()">
          ▶ Switch to Next Verified Playable Scene →
        </button>
      </div>
    `
    : '';

  // Dedicated Explore Mode Inspection Card (Section 20)
  const exploreModeCardHtml =
    activeTarget && identifyProgress.explorationMode === 'explore'
      ? `
        <div id="identify-explore-card" data-testid="identify-explore-card" class="identify-answer-card correct" style="margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">
            <div>
              <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
                🔍 Explore Mode • Visual Inspection (Unscored)
              </span>
              <div style="font-size:26px; font-weight:900; color:var(--text); margin-top:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
                🔊 ${escapeHtml(activeTarget.uk)}
              </div>
              <div style="font-size:13.5px; font-weight:700; color:var(--text-secondary); margin-top:2px;">
                Pronunciation: <b>${escapeHtml(pronunciationGuide)}</b>
              </div>
              <div style="font-size:16px; font-weight:800; color:var(--accent); margin-top:2px;">
                ${escapeHtml(activeTarget.en)}
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                ${formatGenderBadge(activeTarget.gender)} ${
                  activeTarget.verifiedLexicalSense
                    ? `• Sense: ${escapeHtml(activeTarget.verifiedLexicalSense)}`
                    : ''
                }
              </div>
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
            <button type="button" class="btn btn-success" style="padding:8px 14px; font-size:13px; margin-left:auto;" onclick="setIdentifyExplorationMode('guided')">🎯 Start Practice Round →</button>
          </div>
        </div>
      `
      : '';

  const wordDetailCardHtml =
    activeTarget && identifyProgress.explorationMode !== 'explore' && isTargetResolved
      ? `
        <div class="identify-answer-card ${targetStatus === 'revealed' ? 'revealed' : 'correct'}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">
            <div>
              <span class="tag" style="background:${targetStatus === 'revealed' ? 'var(--warn-container)' : 'var(--success-container)'}; color:${targetStatus === 'revealed' ? 'var(--warn-on-container)' : 'var(--success-on-container)'}; font-weight:800;">
                ${targetStatus === 'revealed' ? '👁️ Answer Revealed • Needs Practice' : '✅ Correct in Round'}
              </span>
              <div style="font-size:26px; font-weight:900; color:var(--text); margin-top:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
                🔊 ${escapeHtml(activeTarget.uk)}
              </div>
              <div style="font-size:13px; color:var(--text-secondary);">Pronunciation: <b>${escapeHtml(pronunciationGuide)}</b></div>
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
            <button type="button" class="btn btn-success" style="padding:8px 14px; font-size:13px; margin-left:auto;" onclick="advanceIdentifyNextTarget()">Next Question →</button>
          </div>
        </div>
      `
      : '';

  const quizControlsHtml =
    activeTarget && identifyProgress.explorationMode !== 'explore' && !isTargetResolved
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
    activeTarget && identifyProgress.explorationMode !== 'explore' && targetProg?.lastFeedback
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

  // End-of-Round Results Panel (Section 21)
  const showSummary =
    showSceneSummaryModal ||
    (identifyProgress.explorationMode !== 'explore' && roundSummary.isRoundComplete);

  const summaryPanelHtml = showSummary
    ? `
      <div id="identify-round-results-panel" data-testid="identify-round-results-panel" class="card" style="margin-top:14px; border:2px solid var(--success); background:var(--surface-1);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <span class="tag" style="background:var(--success-container); color:var(--success-on-container); font-weight:800;">
              ${
                roundSummary.isSceneMastered
                  ? '🌟 Full Scene Mastered!'
                  : roundSummary.isRoundComplete
                  ? `🎉 Round ${roundSummary.roundNumber} Complete (${roundSummary.questionsCompletedInRound} of ${roundSummary.totalQuestionsInRound} Questions)!`
                  : '📊 Practice Round & Scene Coverage Summary'
              }
            </span>
            <h3 style="margin:6px 0 0 0; font-size:18px; font-weight:800;">
              ${escapeHtml(cat.titleEn)} — Scene ${scene.sceneNumber}: ${escapeHtml(scene.titleEn)}
            </h3>
            <p style="margin:2px 0 0 0; font-size:12.5px; color:var(--text-secondary);">
              Scene Vocabulary Coverage: <b>${roundSummary.scenePracticedObjectsCount} of ${roundSummary.sceneTotalObjects} objects practiced (${roundSummary.sceneCoveragePercent}%)</b> • Mastered: <b>${roundSummary.sceneMasteredObjectsCount} / ${roundSummary.sceneTotalObjects}</b>
            </p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" data-testid="identify-practice-more-btn" class="btn btn-success" onclick="practiceMoreIdentifyWords()">
              🔄 Practice More Words (Round ${roundSummary.roundNumber + 1})
            </button>
            <button type="button" data-testid="identify-review-mistakes-btn" class="btn btn-warn" onclick="reviewIdentifyRoundMistakes()">
              🎯 Review Mistakes (${roundSummary.wordsNeedingReview.length || summary.needsPracticeTargets.length})
            </button>
            <button type="button" data-testid="identify-explore-scene-btn" class="btn btn-sec" onclick="setIdentifyExplorationMode('explore')">
              🔍 Explore Scene (${scene.targets.length} Objects)
            </button>
            <button type="button" data-testid="identify-next-scene-btn" class="btn btn-sec" onclick="goIdentifyNextScene()">
              🗺️ Choose Another Scene →
            </button>
          </div>
        </div>

        <div class="identify-summary-metrics">
          <div class="identify-metric-box">
            <div class="identify-metric-val">${roundSummary.questionsAttemptedInRound} / ${roundSummary.totalQuestionsInRound}</div>
            <div class="identify-metric-lbl">Round Questions Attempted</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);">${roundSummary.correctCountInRound}</div>
            <div class="identify-metric-lbl">Round Correct</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--danger);">${roundSummary.incorrectOrRevealedCountInRound}</div>
            <div class="identify-metric-lbl">Round Incorrect / Revealed</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--accent);">${roundSummary.accuracyPercent}%</div>
            <div class="identify-metric-lbl">Round Accuracy</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val">${roundSummary.newlyIntroducedWords.length} new / ${roundSummary.previouslyStudiedWords.length} rev</div>
            <div class="identify-metric-lbl">Newly Introduced vs Studied</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--secondary);">${roundSummary.scenePracticedObjectsCount} / ${roundSummary.sceneTotalObjects}</div>
            <div class="identify-metric-lbl">Total Scene Coverage (${roundSummary.sceneCoveragePercent}%)</div>
          </div>
        </div>

        ${
          summary.needsPracticeTargets.length > 0
            ? `
              <div style="margin-top:12px; padding:12px; background:var(--surface-2); border-radius:var(--radius-md);">
                <div style="font-size:13px; font-weight:800; color:var(--warn); margin-bottom:8px;">
                  📌 Words Needing Review (${summary.needsPracticeTargets.length}):
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
                🌟 Great accuracy in this round! Click "Practice More Words" to rotate through the remaining objects in this ${scene.targets.length}-object scene.
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
          🗂️ Browse All ${IDENTIFY_CATEGORIES.length} Categories (${totalScenesCompleted}/${totalLibraryScenes} Scenes)
        </button>
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
          Mastered Objects: ${totalObjectsMastered} / 2,520
        </span>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button type="button" id="identify-add-scene-fsrs-btn" class="btn btn-success" style="min-height:38px; padding:6px 12px; font-size:12.5px;" onclick="addIdentifySceneWordsToFSRS()">
          + Add Scene Vocab to FSRS
        </button>
        <button type="button" class="btn btn-sec" style="min-height:38px; padding:6px 12px; font-size:12.5px;" onclick="toggleIdentifySummaryView()">
          📊 Round & Scene Summary (${roundSummary.scenePracticedObjectsCount}/${roundSummary.sceneTotalObjects})
        </button>
      </div>
    </div>

    ${categoryBrowserHtml}

    <div class="card" style="margin-bottom:12px; padding:12px 14px;">
      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
        1. Everyday Category (${cat.number}/${IDENTIFY_CATEGORIES.length} — ${escapeHtml(cat.titleEn)} • ${escapeHtml(cat.titleUk)}):
      </div>
      <div class="stage-bar" style="margin-bottom:10px;">
        ${categoryPillsHtml}
      </div>

      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
        2. Visual Scene (${scene.sceneNumber}/${cat.scenes.length} — ${escapeHtml(scene.titleUk)}):
      </div>
      <div class="stage-bar" style="margin-bottom:10px;">
        ${scenePillsHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:8px; border-top:1px solid var(--border-subtle);">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Mode:</span>
          <button type="button" data-testid="identify-mode-explore" class="stage-pill ${identifyProgress.explorationMode === 'explore' ? 'active' : ''}" onclick="setIdentifyExplorationMode('explore')">🔍 Explore Scene (${scene.targets.length})</button>
          <button type="button" data-testid="identify-mode-free" class="stage-pill ${identifyProgress.explorationMode === 'free' ? 'active' : ''}" onclick="setIdentifyExplorationMode('free')">🧭 Free Practice</button>
          <button type="button" data-testid="identify-mode-guided" class="stage-pill ${identifyProgress.explorationMode === 'guided' ? 'active' : ''}" onclick="setIdentifyExplorationMode('guided')">🎯 Guided Round</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Round Size:</span>
          <button type="button" data-testid="identify-round-len-5" class="stage-pill ${identifyProgress.roundLength === 5 ? 'active' : ''}" onclick="setIdentifyRoundLength(5)">⚡ Quick (5)</button>
          <button type="button" data-testid="identify-round-len-8" class="stage-pill ${(identifyProgress.roundLength || 8) === 8 ? 'active' : ''}" onclick="setIdentifyRoundLength(8)">🎯 Standard (8)</button>
          <button type="button" data-testid="identify-round-len-10" class="stage-pill ${identifyProgress.roundLength === 10 ? 'active' : ''}" onclick="setIdentifyRoundLength(10)">🔥 Extended (10)</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Quiz Type:</span>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'mc' ? 'active' : ''}" onclick="setIdentifyQuizMode('mc')">🅰️ Multiple Choice</button>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'fill' ? 'active' : ''}" onclick="setIdentifyQuizMode('fill')">⌨️ Fill in the Blank</button>
        </div>
      </div>

      <!-- Separate Round Progress vs Scene Coverage vs Scene Mastery Strip (Section 17) -->
      <div data-testid="identify-progress-strip" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:10px; padding-top:8px; border-top:1px dashed var(--border-subtle);">
        <span data-testid="identify-round-progress-badge" class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
          🎯 Round ${roundSummary.roundNumber}: ${roundSummary.questionsCompletedInRound} of ${roundSummary.totalQuestionsInRound} Questions
        </span>
        <span data-testid="identify-scene-coverage-badge" class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
          📊 Scene Coverage: ${roundSummary.scenePracticedObjectsCount} of ${roundSummary.sceneTotalObjects} Practiced (${roundSummary.sceneCoveragePercent}%)
        </span>
        <span data-testid="identify-scene-mastery-badge" class="tag" style="background:${roundSummary.isSceneMastered ? 'var(--success-container)' : 'var(--surface-2)'}; color:${roundSummary.isSceneMastered ? 'var(--success-on-container)' : 'var(--text-secondary)'}; font-weight:800;">
          ${roundSummary.isSceneMastered ? `🌟 Scene Mastered (${roundSummary.sceneMasteredObjectsCount}/${roundSummary.sceneTotalObjects})` : `🏆 Mastery: ${roundSummary.sceneMasteredObjectsCount}/${roundSummary.sceneTotalObjects} Objects`}
        </span>
      </div>
    </div>

    ${pilotVariantBarHtml}

    <div class="identify-stage-split">
      <!-- LEFT / TOP: Interactive Scene Canvas + Zoom/Pan Controls + Accessible Target Bar -->
      <div class="card" style="margin-bottom:0; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <div>
            <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
              ${cat.icon} Scene ${scene.sceneNumber} of ${cat.scenes.length} • ${scene.targets.length} Total Objects
            </span>
            <h2 style="margin:4px 0 0 0; font-size:16.5px; font-weight:800;">
              ${escapeHtml(scene.titleEn)} <span style="color:var(--accent); font-weight:700;">(${escapeHtml(scene.titleUk)})</span>
            </h2>
          </div>
          <!-- Zoom & Pan Controls (Section 22) -->
          <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
            <button type="button" data-testid="identify-zoom-out-btn" class="stage-pill" style="font-size:11.5px; padding:4px 8px;" onclick="zoomIdentifySceneOut()" title="Zoom Out">➖ Zoom Out</button>
            <span id="identify-zoom-pct-badge" style="font-size:11.5px; font-weight:800; min-width:42px; text-align:center;">${Math.round(zoomPanState.scale * 100)}%</span>
            <button type="button" data-testid="identify-zoom-in-btn" class="stage-pill" style="font-size:11.5px; padding:4px 8px;" onclick="zoomIdentifySceneIn()" title="Zoom In">➕ Zoom In</button>
            <button type="button" data-testid="identify-zoom-fit-btn" class="stage-pill" style="font-size:11.5px; padding:4px 8px;" onclick="fitIdentifySceneView()" title="Fit Image">📐 Fit Image</button>
            <button type="button" data-testid="identify-zoom-reset-btn" class="stage-pill" style="font-size:11.5px; padding:4px 8px;" onclick="resetIdentifySceneZoom()" title="Reset Zoom">🔄 Reset</button>
            <button type="button" class="stage-pill ${showBoundingBoxOutlines ? 'active' : ''}" style="font-size:11px; padding:4px 8px;" onclick="toggleIdentifyBoundingBoxes()">
              📦 Boxes
            </button>
          </div>
        </div>

        <div id="identify-scene-viewport-el" class="identify-scene-viewport" data-fit-mode="${sceneFitMode}" style="overflow:hidden;">
          <div id="identify-zoom-stage-el" style="position:relative; width:100%; height:100%; transform-origin:center center; transition:transform 0.08s ease-out;">
            <img
              id="identify-scene-img-el"
              src="${sceneImgSrc}"
              data-intrinsic-width="${scene.intrinsicWidth || 1200}"
              data-intrinsic-height="${scene.intrinsicHeight || 900}"
              alt="${escapeHtml(scene.titleEn)} — ${escapeHtml(scene.settingDescriptionEn)}"
              class="identify-scene-img"
              style="object-fit:${sceneFitMode};"
              draggable="false"
            />
            <div id="identify-hotspot-layer-el" class="identify-hotspot-layer">
              ${hotspotsOverlayHtml}
            </div>
          </div>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
            🎯 ${
              identifyProgress.explorationMode === 'explore'
                ? `Explore All ${approvedTargets.length} Verified Scene Objects (Click any object to inspect):`
                : `Active Round Targets (${roundSummary.totalQuestionsInRound} of ${approvedTargets.length} verified scene objects in Round ${roundSummary.roundNumber}):`
            }
          </div>
          <div class="identify-target-bar" role="list" aria-label="Scene Vocabulary Targets">
            ${accessibleTargetListHtml}
          </div>
        </div>
      </div>

      <!-- RIGHT / BOTTOM: Active Object Quiz or Explore Inspection Card -->
      <div class="card" style="margin-bottom:0; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
          <div>
            <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
              ${activeTarget ? `Target #${activeTarget.targetNumber} of ${approvedTargets.length} Verified` : '⏳ 0 Verified Objects'}
            </span>
            <h3 style="margin:6px 0 0 0; font-size:18px; font-weight:800;">
              Object: <span style="color:var(--accent);">${activeTarget ? escapeHtml(activeTarget.en) : 'Unavailable (Awaiting Verification)'}</span>
            </h3>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="btn btn-sec" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="practiceMoreIdentifyWords()" title="Rotate to a new adaptive set of words">
              🔄 New Round
            </button>
            <button type="button" class="btn btn-sec" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="advanceIdentifyNextTarget()">
              Skip / Next →
            </button>
          </div>
        </div>

        ${shortenedRoundNoticeHtml}
        ${unverifiedSceneCardHtml}
        ${exploreModeCardHtml}
        ${feedbackBannerHtml}
        ${quizControlsHtml}
        ${wordDetailCardHtml}
      </div>
    </div>

    ${summaryPanelHtml}
  `;

  attachResponsiveViewportObservers();
}

// Expose all interactive handlers on window so inline onclick attributes work seamlessly
if (typeof window !== 'undefined') {
  Object.assign(window as unknown as Record<string, unknown>, {
    selectIdentifyCategory,
    selectIdentifyScene,
    switchIdentifyPilotVariant,
    setIdentifySceneFitMode,
    toggleIdentifyBoundingBoxes,
    setIdentifyExplorationMode,
    setIdentifyQuizMode,
    setIdentifyRoundLength,
    practiceMoreIdentifyWords,
    reviewIdentifyRoundMistakes,
    selectIdentifyHotspot,
    handleIdentifyMCOption,
    submitIdentifyTypedAnswer,
    insertIdentifyChar,
    revealIdentifyAnswer,
    advanceIdentifyNextTarget,
    toggleIdentifyCategoryDrawer,
    toggleIdentifySummaryView,
    filterIdentifyCategories,
    filterIdentifyByTopicGroup,
    retryIdentifyMistakes,
    resetIdentifyScene,
    goIdentifyNextScene,
    addIdentifyWordToFSRS,
    addIdentifySceneWordsToFSRS,
    zoomIdentifySceneIn,
    zoomIdentifySceneOut,
    resetIdentifySceneZoom,
    fitIdentifySceneView,
    panIdentifySceneBy,
  });
}
