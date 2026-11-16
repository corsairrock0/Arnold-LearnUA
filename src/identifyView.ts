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
import {
  canToggleIdentifyAdminPreviewInUi,
  closeIdentifyAdminPreviewSession,
  findPlayableLegacySceneById,
  getActiveIdentifyAdminPreviewSession,
  getAdjacentIdentify80Scenes,
  getApprovedCurriculumIdentifyScene,
  getApprovedCurriculumScenesForCategory,
  getIdentify80CategoriesWithSceneCounts,
  getIdentify80SceneBrowserList,
  getIdentify80SceneByCodeOrNumber,
  isIdentifyAdminPreviewAuthorized,
  resolveSceneViewerHotspots,
  selectAdminPreviewTargetSlot,
  setAdminPreviewPracticeMode,
  setIdentifyAdminPreviewUiToggle,
  startIdentifyAdminPreviewSession,
  stepAdminPreviewTargetSlot,
  submitAdminPreviewMultipleChoice,
  submitAdminPreviewTypedAnswer,
  revealAdminPreviewTargetAnswer,
  type Identify80BrowserStatusFilter,
} from './identifyCurriculumPreview';

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

// 80-Scene Ukrainian Curriculum Browser, Full-Screen Viewer & Admin Preview Practice UI state
let show80SceneCurriculumBrowser: boolean = false;
let curriculum80CategoryFilter: string = 'all';
let curriculum80StatusFilter: Identify80BrowserStatusFilter = 'all';
let curriculum80SearchQuery: string = '';
let activeFullScreenViewerSceneCode: string | null = null;
let viewerShowHotspotsOverlay: boolean = false;
let viewerSelectedHotspotSlot: number | null = null;
let viewerZoomScale: number = 1;
let viewerPanX: number = 0;
let viewerPanY: number = 0;
let previewZoomScale: number = 1;
let previewPanX: number = 0;
let previewPanY: number = 0;

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

function getPlayableScenesForCategory(cat: IdentifyCategory): IdentifyScene[] {
  const legacyPlayable = cat.scenes.filter((s) => {
    const effectiveS =
      getEffectiveIdentifyScene(s.id, { includeUnpublishedDraft: true }) || s;
    return computeIdentifySceneSummary(identifyProgress, effectiveS).totalTargets > 0;
  });
  const approvedCurriculum = getApprovedCurriculumScenesForCategory(cat.id);
  const existingIds = new Set(legacyPlayable.map((s) => s.id));
  const merged = [...legacyPlayable];
  for (const cs of approvedCurriculum) {
    if (!existingIds.has(cs.id)) {
      merged.push(cs);
      existingIds.add(cs.id);
    }
  }
  return merged;
}

function getActiveScene(cat: IdentifyCategory): IdentifyScene {
  const approvedCurriculumScene = getApprovedCurriculumIdentifyScene(
    identifyProgress.activeSceneId
  );
  if (approvedCurriculumScene) {
    return approvedCurriculumScene.scene;
  }

  const baseScene =
    cat.scenes.find((s) => s.id === identifyProgress.activeSceneId) ||
    getPlayableScenesForCategory(cat)[0] ||
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
  const playableForCat = getPlayableScenesForCategory(cat);
  const playableFirst =
    playableForCat[0] ||
    cat.scenes.find((s) => isScenePlayableForStudents(s)) ||
    cat.scenes[0];
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
  const approvedCurriculumScene = getApprovedCurriculumIdentifyScene(sceneId);
  if (approvedCurriculumScene) {
    identifyProgress.activeCategoryId = approvedCurriculumScene.scene.categoryId;
    identifyProgress.activeSceneId = approvedCurriculumScene.scene.id;
    const cat = getActiveCategory();
    const effectiveScene = getActiveScene(cat);
    ensureActiveIdentifyRound(identifyProgress, effectiveScene);
    activeHotspotId = '';
    syncActiveHotspot(effectiveScene);
    zoomPanState = { ...DEFAULT_ZOOM_PAN_STATE };
    showSceneSummaryModal = false;
    saveIdentifyProgress(identifyProgress);
    renderIdentifyTab();
    return;
  }

  const cat = getActiveCategory();
  const baseScene =
    cat.scenes.find((s) => s.id === sceneId) ||
    IDENTIFY_CATEGORIES.flatMap((c) => c.scenes).find((s) => s.id === sceneId);
  if (!baseScene) return;
  identifyProgress.activeCategoryId = baseScene.categoryId;
  identifyProgress.activeSceneId = baseScene.id;
  const effectiveScene = getActiveScene(getActiveCategory());
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
  // Advance to the next verified playable scene across all categories (including all 67 approved scenes)
  const playableScenes: Array<{ catId: string; sceneId: string }> = [];
  for (const c of IDENTIFY_CATEGORIES) {
    for (const s of getPlayableScenesForCategory(c)) {
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
// 80-SCENE UKRAINIAN CURRICULUM BROWSER, FULL-SCREEN SCENE VIEWER &
// ADMINISTRATOR-ONLY PREVIEW PRACTICE CONTROLLERS
// ============================================================================

export function toggleIdentify80SceneBrowser(force?: boolean): void {
  hooks?.triggerHaptic('light');
  show80SceneCurriculumBrowser =
    typeof force === 'boolean' ? force : !show80SceneCurriculumBrowser;
  renderIdentifyTab();
}

export function filterIdentify80ByCategory(categoryId: string): void {
  hooks?.triggerHaptic('light');
  curriculum80CategoryFilter = categoryId || 'all';
  renderIdentifyTab();
}

export function filterIdentify80ByStatus(status: Identify80BrowserStatusFilter): void {
  hooks?.triggerHaptic('light');
  curriculum80StatusFilter = status;
  renderIdentifyTab();
}

export function searchIdentify80Scenes(query: string): void {
  curriculum80SearchQuery = query;
  renderIdentifyTab();
}

export function toggleIdentifyAdminPreviewMode(force?: boolean): void {
  hooks?.triggerHaptic('medium');
  const nextVal =
    typeof force === 'boolean' ? force : !isIdentifyAdminPreviewAuthorized();
  setIdentifyAdminPreviewUiToggle(nextVal);
  if (!isIdentifyAdminPreviewAuthorized()) {
    viewerShowHotspotsOverlay = false;
    viewerSelectedHotspotSlot = null;
  }
  renderIdentifyTab();
}

export function openIdentifyFullScreenViewer(
  sceneCodeOrNumber: string | number
): void {
  hooks?.triggerHaptic('light');
  const entry = getIdentify80SceneByCodeOrNumber(sceneCodeOrNumber);
  if (!entry || !entry.canViewSceneImage) return;
  closeIdentifyAdminPreviewSession();
  activeFullScreenViewerSceneCode = entry.sceneCode;
  viewerSelectedHotspotSlot = null;
  viewerZoomScale = 1;
  viewerPanX = 0;
  viewerPanY = 0;
  renderIdentifyTab();
}

export function closeIdentifyFullScreenViewer(): void {
  hooks?.triggerHaptic('light');
  activeFullScreenViewerSceneCode = null;
  viewerSelectedHotspotSlot = null;
  viewerZoomScale = 1;
  viewerPanX = 0;
  viewerPanY = 0;
  renderIdentifyTab();
}

export function navigateIdentifyFullScreenViewer(sceneCode: string): void {
  hooks?.triggerHaptic('light');
  const entry = getIdentify80SceneByCodeOrNumber(sceneCode);
  if (!entry || !entry.canViewSceneImage) return;
  activeFullScreenViewerSceneCode = entry.sceneCode;
  viewerSelectedHotspotSlot = null;
  viewerZoomScale = 1;
  viewerPanX = 0;
  viewerPanY = 0;
  renderIdentifyTab();
}

export function toggleIdentifyViewerHotspots(force?: boolean): void {
  hooks?.triggerHaptic('light');
  viewerShowHotspotsOverlay =
    typeof force === 'boolean' ? force : !viewerShowHotspotsOverlay;
  viewerSelectedHotspotSlot = null;
  renderIdentifyTab();
}

export function selectIdentifyViewerHotspotSlot(slotNumber: number): void {
  hooks?.triggerHaptic('light');
  viewerSelectedHotspotSlot = slotNumber;
  if (activeFullScreenViewerSceneCode) {
    const resolved = resolveSceneViewerHotspots(activeFullScreenViewerSceneCode);
    const hit = resolved.hotspots.find((h) => h.slotNumber === slotNumber);
    if (hit) {
      hooks?.speakUkrainian(hit.uk);
    }
  }
  renderIdentifyTab();
}

export function zoomIdentifyViewerBy(delta: number): void {
  hooks?.triggerHaptic('light');
  viewerZoomScale = Math.max(1, Math.min(3, Number((viewerZoomScale + delta).toFixed(2))));
  if (viewerZoomScale === 1) {
    viewerPanX = 0;
    viewerPanY = 0;
  }
  renderIdentifyTab();
}

export function resetIdentifyViewerZoom(): void {
  hooks?.triggerHaptic('light');
  viewerZoomScale = 1;
  viewerPanX = 0;
  viewerPanY = 0;
  renderIdentifyTab();
}

export function panIdentifyViewerBy(dx: number, dy: number): void {
  if (viewerZoomScale <= 1) return;
  const maxPan = (viewerZoomScale - 1) * 320;
  viewerPanX = Math.max(-maxPan, Math.min(maxPan, viewerPanX + dx));
  viewerPanY = Math.max(-maxPan, Math.min(maxPan, viewerPanY + dy));
  renderIdentifyTab();
}

export function startIdentifyLearnerPracticeFrom80Browser(
  sceneNumberOrCode: number | string
): void {
  hooks?.triggerHaptic('medium');
  const entry = getIdentify80SceneByCodeOrNumber(sceneNumberOrCode);
  if (!entry || !entry.linkedPlayableSceneId) return;
  const found = findPlayableLegacySceneById(entry.linkedPlayableSceneId);
  if (!found) return;

  activeFullScreenViewerSceneCode = null;
  show80SceneCurriculumBrowser = false;
  closeIdentifyAdminPreviewSession();
  identifyProgress.activeCategoryId = found.category.id;
  selectIdentifyScene(found.scene.id);
  if (typeof document !== 'undefined') {
    const stageEl = document.getElementById('identify-learner-practice-stage');
    stageEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function startIdentifyAdminPreviewPractice(
  sceneCodeOrNumber: string | number,
  initialMode: 'mc' | 'fill' | 'explore' = 'mc'
): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  hooks?.triggerHaptic('medium');
  activeFullScreenViewerSceneCode = null;
  previewZoomScale = 1;
  previewPanX = 0;
  previewPanY = 0;
  startIdentifyAdminPreviewSession(sceneCodeOrNumber, initialMode);
  renderIdentifyTab();
}

export function closeIdentifyAdminPreviewPractice(): void {
  hooks?.triggerHaptic('light');
  closeIdentifyAdminPreviewSession();
  previewZoomScale = 1;
  previewPanX = 0;
  previewPanY = 0;
  renderIdentifyTab();
}

export function switchIdentifyAdminPreviewMode(
  mode: 'mc' | 'fill' | 'explore'
): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  hooks?.triggerHaptic('light');
  setAdminPreviewPracticeMode(mode);
  renderIdentifyTab();
}

export function selectIdentifyAdminPreviewSlot(slotNumber: number): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  hooks?.triggerHaptic('light');
  const session = selectAdminPreviewTargetSlot(slotNumber);
  const st = session.targetStates[slotNumber];
  if (st && (session.mode === 'explore' || st.status !== 'unanswered')) {
    hooks?.speakUkrainian(st.uk);
  }
  renderIdentifyTab();
}

export function stepIdentifyAdminPreviewSlot(delta: 1 | -1): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  hooks?.triggerHaptic('light');
  stepAdminPreviewTargetSlot(delta);
  renderIdentifyTab();
}

export function submitIdentifyAdminPreviewMCOption(chosenUk: string): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  const res = submitAdminPreviewMultipleChoice(chosenUk);
  hooks?.triggerHaptic(res.isCorrect ? 'heavy' : 'light');
  if (res.isCorrect) {
    hooks?.speakUkrainian(res.target.uk);
  }
  renderIdentifyTab();
}

export function submitIdentifyAdminPreviewFillAnswer(): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  const inputEl = document.getElementById(
    'identify-admin-preview-fill-input'
  ) as HTMLInputElement | null;
  const rawVal = inputEl ? inputEl.value : '';
  const res = submitAdminPreviewTypedAnswer(rawVal);
  hooks?.triggerHaptic(res.isCorrect ? 'heavy' : 'light');
  if (res.isCorrect) {
    hooks?.speakUkrainian(res.target.uk);
  }
  renderIdentifyTab();
}

export function insertIdentifyAdminPreviewChar(ch: string): void {
  hooks?.triggerHaptic('light');
  const inputEl = document.getElementById(
    'identify-admin-preview-fill-input'
  ) as HTMLInputElement | null;
  if (!inputEl) return;
  const start = inputEl.selectionStart ?? inputEl.value.length;
  const end = inputEl.selectionEnd ?? inputEl.value.length;
  inputEl.value = inputEl.value.slice(0, start) + ch + inputEl.value.slice(end);
  inputEl.focus();
  inputEl.setSelectionRange(start + ch.length, start + ch.length);
}

export function revealIdentifyAdminPreviewTarget(): void {
  if (!isIdentifyAdminPreviewAuthorized()) return;
  hooks?.triggerHaptic('medium');
  const res = revealAdminPreviewTargetAnswer();
  hooks?.speakUkrainian(res.target.uk);
  renderIdentifyTab();
}

export function zoomIdentifyPreviewBy(delta: number): void {
  hooks?.triggerHaptic('light');
  previewZoomScale = Math.max(
    1,
    Math.min(3, Number((previewZoomScale + delta).toFixed(2)))
  );
  if (previewZoomScale === 1) {
    previewPanX = 0;
    previewPanY = 0;
  }
  renderIdentifyTab();
}

export function resetIdentifyPreviewZoom(): void {
  hooks?.triggerHaptic('light');
  previewZoomScale = 1;
  previewPanX = 0;
  previewPanY = 0;
  renderIdentifyTab();
}

export function panIdentifyPreviewBy(dx: number, dy: number): void {
  if (previewZoomScale <= 1) return;
  const maxPan = (previewZoomScale - 1) * 300;
  previewPanX = Math.max(-maxPan, Math.min(maxPan, previewPanX + dx));
  previewPanY = Math.max(-maxPan, Math.min(maxPan, previewPanY + dy));
  renderIdentifyTab();
}

function renderFullScreenSceneViewerModalHtml(): string {
  if (!activeFullScreenViewerSceneCode) return '';
  const resolved = resolveSceneViewerHotspots(activeFullScreenViewerSceneCode);
  const entry = resolved.entry;
  const filteredList = getIdentify80SceneBrowserList({
    categoryId: curriculum80CategoryFilter,
    statusFilter: curriculum80StatusFilter,
    searchQuery: curriculum80SearchQuery,
  });
  const { prevScene, nextScene } = getAdjacentIdentify80Scenes(
    entry.sceneCode,
    filteredList
  );
  const adminAuthorized = isIdentifyAdminPreviewAuthorized();
  const canToggleHotspots =
    entry.availabilityState === 'approved_playable' ||
    (adminAuthorized && entry.candidateHotspotCount > 0);

  const selectedHotspot =
    viewerShowHotspotsOverlay && viewerSelectedHotspotSlot !== null
      ? resolved.hotspots.find((h) => h.slotNumber === viewerSelectedHotspotSlot) ??
        null
      : null;

  const hotspotPinsHtml =
    viewerShowHotspotsOverlay && canToggleHotspots
      ? resolved.hotspots
          .map((h) => {
            const leftPct = (h.box.x * 100).toFixed(2);
            const topPct = (h.box.y * 100).toFixed(2);
            const widthPct = (h.box.width * 100).toFixed(2);
            const heightPct = (h.box.height * 100).toFixed(2);
            const isSelected = viewerSelectedHotspotSlot === h.slotNumber;
            const borderColor = h.isApprovedLearnerHotspot
              ? '#10b981'
              : '#f59e0b';
            return `
              <button
                type="button"
                data-testid="viewer-hotspot-pin-${h.slotNumber}"
                onclick="selectIdentifyViewerHotspotSlot(${h.slotNumber})"
                title="#${h.slotNumber}: ${escapeHtml(h.uk)} (${escapeHtml(h.en)})"
                style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; border:2px ${
                  h.isCandidatePreviewHotspot ? 'dashed' : 'solid'
                } ${borderColor}; background:${
                  isSelected
                    ? 'rgba(245, 158, 11, 0.26)'
                    : 'rgba(15, 23, 42, 0.14)'
                }; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:${
                  isSelected ? '0 0 0 3px rgba(245,158,11,0.55)' : 'none'
                };"
              >
                <span style="background:${borderColor}; color:#fff; font-size:11.5px; font-weight:900; padding:2px 7px; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,0.45); white-space:nowrap;">
                  #${h.slotNumber} ${escapeHtml(h.uk)}
                </span>
              </button>
            `;
          })
          .join('')
      : '';

  return `
    <div id="identify-fullscreen-scene-viewer" data-testid="identify-fullscreen-scene-viewer" class="card" style="margin-bottom:16px; padding:16px; border:2px solid var(--accent); background:var(--surface-1); box-shadow:0 12px 32px rgba(0,0,0,0.22);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
        <div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:900;">
              Scene #${entry.sceneNumber} of 80
            </span>
            <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
              ${entry.categoryIconSvg} ${escapeHtml(entry.categoryTitleEn)} (${escapeHtml(entry.categoryTitleUk)})
            </span>
            <span class="tag" style="background:${
              entry.availabilityState === 'approved_playable'
                ? 'var(--success-container)'
                : 'var(--warn-container)'
            }; color:${
              entry.availabilityState === 'approved_playable'
                ? 'var(--success-on-container)'
                : 'var(--warn-on-container)'
            }; font-weight:800;">
              ${escapeHtml(entry.statusBadgeLabel)}
            </span>
          </div>
          <h2 style="margin:6px 0 2px 0; font-size:20px; font-weight:900; color:var(--text);">
            ${escapeHtml(entry.titleEn)} <span style="color:var(--accent);">— ${escapeHtml(entry.titleUk)}</span>
          </h2>
          <p style="margin:0; font-size:12.5px; color:var(--text-secondary);">
            ${escapeHtml(entry.settingDescriptionEn)} • Resolution: <b>${entry.imageDimensions.width}×${entry.imageDimensions.height} (${entry.imageDimensions.aspectRatio})</b>
          </p>
        </div>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          ${
            prevScene
              ? `<button type="button" data-testid="viewer-prev-scene-btn" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="navigateIdentifyFullScreenViewer('${prevScene.sceneCode}')">← Scene #${prevScene.sceneNumber}</button>`
              : `<button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px; opacity:0.45;" disabled>← First Scene</button>`
          }
          ${
            nextScene
              ? `<button type="button" data-testid="viewer-next-scene-btn" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="navigateIdentifyFullScreenViewer('${nextScene.sceneCode}')">Scene #${nextScene.sceneNumber} →</button>`
              : `<button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px; opacity:0.45;" disabled>Last Scene →</button>`
          }
          ${
            entry.canStartLearnerPractice
              ? `<button type="button" data-testid="viewer-start-practice-btn" class="btn btn-success" style="min-height:36px; padding:6px 14px; font-size:12.5px;" onclick="startIdentifyLearnerPracticeFrom80Browser(${entry.sceneNumber})">🎯 Practice (${entry.verifiedHotspotCount} Approved)</button>`
              : ''
          }
          ${
            entry.canStartAdminPreviewPractice
              ? `<button type="button" data-testid="viewer-start-preview-practice-btn" class="btn" style="min-height:36px; padding:6px 14px; font-size:12.5px; background:#d97706; color:#fff;" onclick="startIdentifyAdminPreviewPractice('${entry.sceneCode}', 'mc')">🧪 Preview Practice (${entry.candidateHotspotCount} Candidates)</button>`
              : ''
          }
          <button type="button" data-testid="viewer-close-btn" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="closeIdentifyFullScreenViewer()">✕ Close Viewer</button>
        </div>
      </div>

      ${
        resolved.noticeBanner
          ? `<div data-testid="viewer-preview-notice-banner" style="margin-bottom:10px; padding:8px 12px; border-radius:var(--radius-sm); background:var(--warn-container); color:var(--warn-on-container); font-size:12.5px; font-weight:800; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span>🔍 ${escapeHtml(resolved.noticeBanner)}</span>
              <span style="font-size:11.5px; font-weight:700;">Cultural anchors: ${entry.culturalAnchorsEn.map(escapeHtml).join(' • ')}</span>
            </div>`
          : ''
      }

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <button type="button" data-testid="viewer-zoom-out-btn" class="stage-pill" onclick="zoomIdentifyViewerBy(-0.25)">➖ Zoom Out</button>
          <span data-testid="viewer-zoom-badge" style="font-size:12px; font-weight:800; min-width:48px; text-align:center;">${Math.round(viewerZoomScale * 100)}%</span>
          <button type="button" data-testid="viewer-zoom-in-btn" class="stage-pill" onclick="zoomIdentifyViewerBy(0.25)">➕ Zoom In</button>
          <button type="button" data-testid="viewer-zoom-reset-btn" class="stage-pill" onclick="resetIdentifyViewerZoom()">🔄 100% Reset</button>
          ${
            viewerZoomScale > 1
              ? `
                <button type="button" class="stage-pill" onclick="panIdentifyViewerBy(-90, 0)">⬅ Pan Left</button>
                <button type="button" class="stage-pill" onclick="panIdentifyViewerBy(90, 0)">➡ Pan Right</button>
                <button type="button" class="stage-pill" onclick="panIdentifyViewerBy(0, -70)">⬆ Pan Up</button>
                <button type="button" class="stage-pill" onclick="panIdentifyViewerBy(0, 70)">⬇ Pan Down</button>
              `
              : ''
          }
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          ${
            canToggleHotspots
              ? `<button type="button" data-testid="viewer-toggle-hotspots-btn" class="stage-pill ${viewerShowHotspotsOverlay ? 'active' : ''}" onclick="toggleIdentifyViewerHotspots()">
                  ${viewerShowHotspotsOverlay ? `🙈 Hide Hotspots (${resolved.hotspots.length})` : `👁️ Show Hotspots (${resolved.hotspots.length})`}
                </button>`
              : `<span style="font-size:12px; color:var(--text-secondary);">Hotspot overlay unavailable (${entry.candidateHotspotCount === 0 && entry.verifiedHotspotCount === 0 ? '0 hotspots annotated' : 'restricted to administrator preview'})</span>`
          }
        </div>
      </div>

      <div style="position:relative; width:100%; background:#0f172a; border-radius:var(--radius-md); overflow:hidden; display:flex; align-items:center; justify-content:center; min-height:420px; max-height:74vh;">
        <div style="position:relative; display:inline-block; max-width:100%; max-height:74vh; transform:translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerZoomScale}); transform-origin:center center; transition:transform 0.1s ease-out;">
          <img
            id="identify-fullscreen-viewer-img"
            data-testid="identify-fullscreen-viewer-img"
            src="${escapeHtml(entry.assetPath || '')}"
            alt="${escapeHtml(entry.titleEn)} (${escapeHtml(entry.titleUk)})"
            style="display:block; max-width:100%; max-height:72vh; width:auto; height:auto; object-fit:contain; margin:0 auto;"
            draggable="false"
          />
          <div style="position:absolute; inset:0; pointer-events:${viewerShowHotspotsOverlay ? 'auto' : 'none'};">
            ${hotspotPinsHtml}
          </div>
        </div>
      </div>

      ${
        selectedHotspot
          ? `
            <div data-testid="viewer-selected-hotspot-card" style="margin-top:12px; padding:12px 14px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
                  ${selectedHotspot.isApprovedLearnerHotspot ? '✓ Approved Learner Hotspot' : '🧪 Candidate Hotspot Awaiting Verification'} • Slot #${selectedHotspot.slotNumber}
                </span>
                <div style="font-size:18px; font-weight:900; color:var(--text); margin-top:4px;">
                  🔊 ${escapeHtml(selectedHotspot.uk)} <span style="font-size:13px; color:var(--text-secondary); font-weight:700;">[${escapeHtml(selectedHotspot.pronunciation)}]</span> — <span style="color:var(--accent);">${escapeHtml(selectedHotspot.en)}</span>
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">
                  Concept ID: <code>${escapeHtml(selectedHotspot.conceptId)}</code> • Vocab ID: <code>${escapeHtml(selectedHotspot.vocabularyId)}</code> • Box: (${selectedHotspot.box.x.toFixed(2)}, ${selectedHotspot.box.y.toFixed(2)}, ${selectedHotspot.box.width.toFixed(2)}×${selectedHotspot.box.height.toFixed(2)})
                </div>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="speakUkrainian('${escapeSingleQuotes(selectedHotspot.uk)}')">🔊 Hear Ukrainian</button>
                ${
                  entry.canStartAdminPreviewPractice
                    ? `<button type="button" class="btn" style="min-height:36px; padding:6px 12px; font-size:12.5px; background:#d97706; color:#fff;" onclick="startIdentifyAdminPreviewPractice('${entry.sceneCode}', 'mc'); selectIdentifyAdminPreviewSlot(${selectedHotspot.slotNumber});">🧪 Test This Hotspot in Preview Practice →</button>`
                    : ''
                }
              </div>
            </div>
          `
          : ''
      }
    </div>
  `;
}

function renderAdminPreviewPracticeWorkspaceHtml(): string {
  const session = getActiveIdentifyAdminPreviewSession();
  if (!session) return '';

  const entry = getIdentify80SceneByCodeOrNumber(session.sceneCode);
  const filteredList = getIdentify80SceneBrowserList({
    categoryId: curriculum80CategoryFilter,
    statusFilter: curriculum80StatusFilter,
    searchQuery: curriculum80SearchQuery,
  });
  const { prevScene, nextScene } = getAdjacentIdentify80Scenes(
    session.sceneCode,
    filteredList
  );

  const activeTarget =
    session.provisionalTargets.find(
      (t) => t.targetNumber === session.activeSlotNumber
    ) ?? session.provisionalTargets[0];
  const activeState = session.targetStates[activeTarget.targetNumber];

  const resolvedSlotsCount = Object.values(session.targetStates).filter(
    (s) =>
      s.status === 'correct_mc' ||
      s.status === 'correct_fill' ||
      s.status === 'revealed'
  ).length;

  const candidatePinsHtml = session.provisionalTargets
    .map((t) => {
      const st = session.targetStates[t.targetNumber];
      const isSelected = t.targetNumber === activeTarget.targetNumber;
      const isResolved =
        st?.status === 'correct_mc' ||
        st?.status === 'correct_fill' ||
        st?.status === 'revealed';

      let bg = 'rgba(217, 119, 6, 0.92)';
      let borderCol = '#f59e0b';
      if (st?.status === 'correct_mc' || st?.status === 'correct_fill') {
        bg = 'rgba(16, 185, 129, 0.94)';
        borderCol = '#10b981';
      } else if (st?.status === 'revealed') {
        bg = 'rgba(14, 165, 233, 0.94)';
        borderCol = '#0ea5e9';
      } else if (st?.status === 'wrong') {
        bg = 'rgba(239, 68, 68, 0.94)';
        borderCol = '#ef4444';
      }

      const leftPct = (t.x * 100).toFixed(2);
      const topPct = (t.y * 100).toFixed(2);
      const widthPct = (t.width * 100).toFixed(2);
      const heightPct = (t.height * 100).toFixed(2);
      const showLabel = session.mode === 'explore' || isResolved;

      return `
        <button
          type="button"
          data-testid="admin-preview-hotspot-${t.targetNumber}"
          onclick="selectIdentifyAdminPreviewSlot(${t.targetNumber})"
          title="Candidate #${t.targetNumber}: ${escapeHtml(t.en)}"
          style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; border:2px ${
            isSelected ? 'solid' : 'dashed'
          } ${borderCol}; background:${
            isSelected ? 'rgba(245, 158, 11, 0.24)' : 'rgba(15, 23, 42, 0.10)'
          }; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:${
            isSelected ? '0 0 0 3px rgba(245, 158, 11, 0.55)' : 'none'
          };"
        >
          <span style="background:${bg}; color:#fff; font-size:11.5px; font-weight:900; padding:2px 7px; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,0.45); white-space:nowrap;">
            #${t.targetNumber}${showLabel ? ` ${escapeHtml(t.uk)}` : ''}
          </span>
        </button>
      `;
    })
    .join('');

  const slotPillsHtml = session.provisionalTargets
    .map((t) => {
      const st = session.targetStates[t.targetNumber];
      const isSelected = t.targetNumber === activeTarget.targetNumber;
      const isResolved =
        st?.status === 'correct_mc' ||
        st?.status === 'correct_fill' ||
        st?.status === 'revealed';
      const prefix =
        st?.status === 'correct_mc' || st?.status === 'correct_fill'
          ? '✓ '
          : st?.status === 'revealed'
          ? '👁️ '
          : st?.status === 'wrong'
          ? '✗ '
          : '';
      return `
        <button
          type="button"
          data-testid="admin-preview-chip-${t.targetNumber}"
          class="identify-target-chip ${isSelected ? 'selected' : ''}"
          style="${isSelected ? 'border-color:#d97706; font-weight:900;' : ''}"
          onclick="selectIdentifyAdminPreviewSlot(${t.targetNumber})"
        >
          ${prefix}#${t.targetNumber} ${
            session.mode === 'explore' || isResolved
              ? `${escapeHtml(t.uk)} (${escapeHtml(t.en)})`
              : escapeHtml(t.en)
          }
        </button>
      `;
    })
    .join('');

  const isTargetResolved =
    activeState.status === 'correct_mc' ||
    activeState.status === 'correct_fill' ||
    activeState.status === 'revealed';

  const interactionBodyHtml =
    session.mode === 'explore' || isTargetResolved
      ? `
        <div data-testid="admin-preview-answer-card" class="identify-answer-card correct" style="margin-top:10px;">
          <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
            ${
              session.mode === 'explore'
                ? '🔍 Candidate Hotspot Inspection'
                : activeState.status === 'revealed'
                ? '👁️ Answer Revealed (Preview Only)'
                : '✅ Verified Candidate Match (Preview Only)'
            }
          </span>
          <div style="font-size:26px; font-weight:900; color:var(--text); margin-top:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
            🔊 ${escapeHtml(activeTarget.uk)}
          </div>
          <div style="font-size:13.5px; color:var(--text-secondary); font-weight:700;">
            Pronunciation: <b>${escapeHtml(activeTarget.pronunciation)}</b>
          </div>
          <div style="font-size:16px; font-weight:800; color:var(--accent); margin-top:2px;">
            ${escapeHtml(activeTarget.en)}
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
            ${formatGenderBadge(activeTarget.gender)} • Candidate Box: (${activeTarget.x.toFixed(2)}, ${activeTarget.y.toFixed(2)}, ${activeTarget.width.toFixed(2)}×${activeTarget.height.toFixed(2)})
          </div>
          <div class="example-chip" style="margin-top:10px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.exampleUk)}')">
            <div style="font-weight:800; font-size:13.5px; color:var(--text);">🔊 ${escapeHtml(activeTarget.exampleUk)}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(activeTarget.exampleEn)}</div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
            <button type="button" class="btn" style="padding:8px 14px; font-size:13px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">🔊 Hear Word</button>
            <button type="button" data-testid="admin-preview-next-target-btn" class="btn btn-success" style="padding:8px 14px; font-size:13px; margin-left:auto;" onclick="stepIdentifyAdminPreviewSlot(1)">Next Candidate Target →</button>
          </div>
        </div>
      `
      : session.mode === 'mc'
      ? `
        <div style="margin-top:10px;">
          <div style="font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            Choose the Ukrainian word for <b>Candidate #${activeTarget.targetNumber} (${escapeHtml(activeTarget.en)})</b>:
          </div>
          ${activeState.mcOptions
            .map((opt, idx) => {
              const wasWrong =
                activeState.status === 'wrong' &&
                activeState.lastSubmittedAnswer === opt;
              return `
                <button
                  type="button"
                  data-testid="admin-preview-mc-option-${idx}"
                  class="option-btn ${wasWrong ? 'wrong' : ''}"
                  onclick="submitIdentifyAdminPreviewMCOption('${escapeSingleQuotes(opt)}')"
                >
                  ${escapeHtml(opt)}
                </button>
              `;
            })
            .join('')}
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <button
              type="button"
              data-testid="admin-preview-show-answer-btn"
              class="btn btn-warn"
              onclick="revealIdentifyAdminPreviewTarget()"
            >
              👁️ Show Answer
            </button>
            <span style="font-size:12px; color:var(--text-secondary);">Preview attempts do not affect student stats.</span>
          </div>
        </div>
      `
      : `
        <div style="margin-top:10px;">
          <label for="identify-admin-preview-fill-input" style="display:block; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">
            Type the Ukrainian word for <b>Candidate #${activeTarget.targetNumber} (${escapeHtml(activeTarget.en)})</b>:
          </label>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            ${['ґ', 'є', 'і', 'ї', '’', 'щ', 'ю', 'я']
              .map(
                (ch) =>
                  `<button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 10px; font-size:14px;" onclick="insertIdentifyAdminPreviewChar('${ch}')">${ch}</button>`
              )
              .join('')}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input
              id="identify-admin-preview-fill-input"
              data-testid="identify-admin-preview-fill-input"
              type="text"
              class="input-box"
              style="flex:1; min-width:170px;"
              placeholder="Введі́ть слово украї́нською..."
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              onkeydown="if(event.key==='Enter'){event.preventDefault(); submitIdentifyAdminPreviewFillAnswer();}"
            />
            <button type="button" data-testid="admin-preview-fill-submit-btn" class="btn" onclick="submitIdentifyAdminPreviewFillAnswer()">Check Answer</button>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <button
              type="button"
              data-testid="admin-preview-show-answer-btn"
              class="btn btn-warn"
              onclick="revealIdentifyAdminPreviewTarget()"
            >
              👁️ Show Answer
            </button>
            <span style="font-size:12px; color:var(--text-secondary);">Stress marks are optional.</span>
          </div>
        </div>
      `;

  return `
    <div id="identify-admin-preview-workspace" data-testid="identify-admin-preview-workspace" class="card" style="margin-bottom:16px; padding:16px; border:2px solid #d97706; background:var(--surface-1); box-shadow:0 12px 28px rgba(217, 119, 6, 0.14);">
      <div data-testid="admin-preview-notice-banner" style="padding:10px 14px; border-radius:var(--radius-sm); background:var(--warn-container); color:var(--warn-on-container); font-weight:900; font-size:13.5px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span>🧪 ${escapeHtml(session.previewNoticeBanner)}</span>
        <span style="font-size:11.5px; font-weight:700;">Isolated Admin Session • 0 XP / 0 FSRS / 0 Learner Progress Mutation</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
        <div>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
            Scene #${session.sceneNumber} of 80 • ${entry?.categoryTitleEn ?? session.categoryId}
          </span>
          <h2 style="margin:4px 0 0 0; font-size:19px; font-weight:900;">
            ${escapeHtml(session.titleEn)} <span style="color:var(--accent);">(${escapeHtml(session.titleUk)})</span>
          </h2>
        </div>

        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          ${
            prevScene && prevScene.candidateHotspotCount > 0
              ? `<button type="button" data-testid="admin-preview-prev-scene-btn" class="btn btn-sec" style="min-height:36px; padding:6px 10px; font-size:12px;" onclick="startIdentifyAdminPreviewPractice('${prevScene.sceneCode}', '${session.mode}')">← Scene #${prevScene.sceneNumber}</button>`
              : ''
          }
          ${
            nextScene && nextScene.candidateHotspotCount > 0
              ? `<button type="button" data-testid="admin-preview-next-scene-btn" class="btn btn-sec" style="min-height:36px; padding:6px 10px; font-size:12px;" onclick="startIdentifyAdminPreviewPractice('${nextScene.sceneCode}', '${session.mode}')">Scene #${nextScene.sceneNumber} →</button>`
              : ''
          }
          <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 10px; font-size:12px;" onclick="openIdentifyFullScreenViewer('${session.sceneCode}')">🔍 Full-Screen Image</button>
          <button type="button" data-testid="admin-preview-close-btn" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="closeIdentifyAdminPreviewPractice()">✕ Exit Preview Practice</button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text-secondary);">Preview Mode:</span>
          <button type="button" data-testid="admin-preview-mode-mc" class="stage-pill ${session.mode === 'mc' ? 'active' : ''}" onclick="switchIdentifyAdminPreviewMode('mc')">🅰️ Multiple Choice</button>
          <button type="button" data-testid="admin-preview-mode-fill" class="stage-pill ${session.mode === 'fill' ? 'active' : ''}" onclick="switchIdentifyAdminPreviewMode('fill')">⌨️ Fill in the Blank</button>
          <button type="button" data-testid="admin-preview-mode-explore" class="stage-pill ${session.mode === 'explore' ? 'active' : ''}" onclick="switchIdentifyAdminPreviewMode('explore')">🔍 Explore / Inspect All 18</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span class="tag" style="background:var(--surface-2); color:var(--text); font-weight:800;">
            Tested in Session: ${resolvedSlotsCount} / ${session.provisionalTargets.length} Candidate Hotspots
          </span>
          <button type="button" class="stage-pill" onclick="zoomIdentifyPreviewBy(-0.25)">➖</button>
          <span style="font-size:11.5px; font-weight:800;">${Math.round(previewZoomScale * 100)}%</span>
          <button type="button" class="stage-pill" onclick="zoomIdentifyPreviewBy(0.25)">➕</button>
          <button type="button" class="stage-pill" onclick="resetIdentifyPreviewZoom()">🔄 Reset</button>
        </div>
      </div>

      <div class="identify-stage-split">
        <div class="card" style="margin-bottom:0; padding:12px;">
          <div style="position:relative; width:100%; background:#0f172a; border-radius:var(--radius-sm); overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <div style="position:relative; display:inline-block; width:100%; transform:translate(${previewPanX}px, ${previewPanY}px) scale(${previewZoomScale}); transform-origin:center center; transition:transform 0.1s ease-out;">
              <img
                src="${escapeHtml(session.assetPath)}"
                alt="${escapeHtml(session.titleEn)}"
                style="display:block; width:100%; height:auto; object-fit:contain;"
                draggable="false"
              />
              <div style="position:absolute; inset:0;">
                ${candidatePinsHtml}
              </div>
            </div>
          </div>

          <div style="margin-top:10px;">
            <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
              🎯 Candidate Hotspots (1–${session.provisionalTargets.length}) — Click any object on the image or chip below:
            </div>
            <div class="identify-target-bar">
              ${slotPillsHtml}
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:0; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
            <div>
              <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
                Candidate Hotspot #${activeTarget.targetNumber} of ${session.provisionalTargets.length}
              </span>
              <h3 style="margin:6px 0 0 0; font-size:18px; font-weight:800;">
                Clue: <span style="color:var(--accent);">${escapeHtml(activeTarget.en)}</span>
              </h3>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" data-testid="admin-preview-prev-slot-btn" class="btn btn-sec" style="min-height:34px; padding:4px 10px; font-size:12px;" onclick="stepIdentifyAdminPreviewSlot(-1)">← Prev</button>
              <button type="button" data-testid="admin-preview-next-slot-btn" class="btn btn-sec" style="min-height:34px; padding:4px 10px; font-size:12px;" onclick="stepIdentifyAdminPreviewSlot(1)">Next →</button>
            </div>
          </div>

          ${
            activeState.lastFeedbackMessage
              ? `<div data-testid="admin-preview-feedback" style="margin-top:10px; padding:9px 12px; border-radius:var(--radius-sm); font-size:12.5px; font-weight:800; background:${
                  activeState.status === 'correct_mc' || activeState.status === 'correct_fill'
                    ? 'var(--success-container)'
                    : activeState.status === 'revealed'
                    ? 'var(--warn-container)'
                    : 'var(--danger-container)'
                }; color:${
                  activeState.status === 'correct_mc' || activeState.status === 'correct_fill'
                    ? 'var(--success-on-container)'
                    : activeState.status === 'revealed'
                    ? 'var(--warn-on-container)'
                    : 'var(--danger-on-container)'
                };">
                  ${escapeHtml(activeState.lastFeedbackMessage)}
                </div>`
              : ''
          }

          ${interactionBodyHtml}
        </div>
      </div>
    </div>
  `;
}

function render80SceneCurriculumBrowserHtml(): string {
  const all80 = getIdentify80SceneBrowserList();
  const filtered80 = getIdentify80SceneBrowserList({
    categoryId: curriculum80CategoryFilter,
    statusFilter: curriculum80StatusFilter,
    searchQuery: curriculum80SearchQuery,
  });
  const categoriesWithCounts = getIdentify80CategoriesWithSceneCounts();
  const adminAuthorized = isIdentifyAdminPreviewAuthorized();
  const canToggleAdmin = canToggleIdentifyAdminPreviewInUi();

  const approvedCount = all80.filter(
    (e) => e.availabilityState === 'approved_playable'
  ).length;
  const previewReadyCount = all80.filter(
    (e) => e.availabilityState === 'awaiting_review_with_candidates'
  ).length;
  const underReviewTotalCount = all80.filter(
    (e) =>
      e.availabilityState === 'awaiting_review_with_candidates' ||
      e.availabilityState === 'awaiting_review_image_only'
  ).length;

  const totalApprovedHotspots = all80.reduce(
    (sum, e) => sum + e.verifiedHotspotCount,
    0
  );

  if (!show80SceneCurriculumBrowser) {
    return '';
  }

  return `
    <div id="identify-80-scene-browser" data-testid="identify-80-scene-browser" class="card" style="margin-bottom:14px; padding:16px; border:1px solid var(--border-strong);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <h2 style="margin:0; font-size:17px; font-weight:800; color:var(--text);">
              All ${approvedCount} Verified Scenes (${totalApprovedHotspots.toLocaleString()} Playable Hotspots)
            </h2>
            ${
              adminAuthorized
                ? `<span data-testid="identify-admin-mode-badge" class="tag" style="background:var(--success-container); color:var(--success-on-container); font-weight:700;">Admin View</span>`
                : `<span data-testid="identify-learner-mode-badge" class="tag" style="background:var(--surface-2); color:var(--text-secondary); font-weight:700;">Student View</span>`
            }
          </div>
          <p style="margin:2px 0 0 0; font-size:12.5px; color:var(--text-secondary);">
            Click <b>Practice</b> on any photograph to jump straight into interactive hotspot training, or <b>View Scene</b> to inspect full-screen.
          </p>
        </div>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          ${
            canToggleAdmin
              ? `<button type="button" data-testid="toggle-admin-preview-role-btn" class="btn btn-sec" style="min-height:34px; padding:5px 11px; font-size:12px;" onclick="toggleIdentifyAdminPreviewMode()">
                  ${adminAuthorized ? 'Student View' : 'Admin Preview'}
                </button>`
              : ''
          }
          <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 11px; font-size:12px;" onclick="toggleIdentify80SceneBrowser(false)">
            Close Browser
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" data-testid="filter-80-status-all" class="stage-pill ${curriculum80StatusFilter === 'all' ? 'active' : ''}" onclick="filterIdentify80ByStatus('all')">
            All Scenes (${all80.length})
          </button>
          <button type="button" data-testid="filter-80-status-approved" class="stage-pill ${curriculum80StatusFilter === 'approved' ? 'active' : ''}" onclick="filterIdentify80ByStatus('approved')">
            Approved & Playable (${approvedCount})
          </button>
          ${
            previewReadyCount > 0
              ? `<button type="button" data-testid="filter-80-status-preview-ready" class="stage-pill ${curriculum80StatusFilter === 'preview_ready' ? 'active' : ''}" onclick="filterIdentify80ByStatus('preview_ready')">
                  Preview Ready (${previewReadyCount})
                </button>`
              : ''
          }
          ${
            underReviewTotalCount > 0
              ? `<button type="button" data-testid="filter-80-status-under-review" class="stage-pill ${curriculum80StatusFilter === 'under_review' ? 'active' : ''}" onclick="filterIdentify80ByStatus('under_review')">
                  Under Review (${underReviewTotalCount})
                </button>`
              : ''
          }
        </div>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <select
            data-testid="filter-80-category-select"
            class="input-box"
            style="min-height:36px; font-size:12.5px; padding:4px 10px; max-width:220px;"
            onchange="filterIdentify80ByCategory(this.value)"
          >
            <option value="all" ${curriculum80CategoryFilter === 'all' ? 'selected' : ''}>All Categories (${all80.length} Scenes)</option>
            ${categoriesWithCounts
              .map(
                (c) =>
                  `<option value="${escapeHtml(c.categoryId)}" ${
                    curriculum80CategoryFilter === c.categoryId ? 'selected' : ''
                  }>${escapeHtml(c.titleEn)} — ${escapeHtml(c.titleUk)} (${c.totalScenes})</option>`
              )
              .join('')}
          </select>

          <input
            type="search"
            data-testid="search-80-scenes-input"
            class="input-box"
            style="min-height:36px; font-size:12.5px; min-width:230px;"
            placeholder="Search scene, title, or Ukrainian word..."
            value="${escapeHtml(curriculum80SearchQuery)}"
            oninput="searchIdentify80Scenes(this.value)"
          />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(255px, 1fr)); gap:12px; max-height:540px; overflow-y:auto; padding:4px 2px;">
        ${filtered80
          .map((entry) => {
            const badgeBg =
              entry.statusBadgeTone === 'emerald'
                ? 'var(--success-container)'
                : entry.statusBadgeTone === 'amber'
                ? 'var(--warn-container)'
                : 'var(--secondary-container)';
            const badgeColor =
              entry.statusBadgeTone === 'emerald'
                ? 'var(--success-on-container)'
                : entry.statusBadgeTone === 'amber'
                ? 'var(--warn-on-container)'
                : 'var(--secondary-on-container)';

            return `
              <div
                data-testid="curriculum-80-scene-card-${entry.sceneNumber}"
                data-scene-code="${escapeHtml(entry.sceneCode)}"
                style="display:flex; flex-direction:column; justify-content:space-between; border-radius:var(--radius-md); border:1px solid var(--border-subtle); background:var(--surface-2); overflow:hidden; transition:transform 0.12s ease;"
              >
                <div>
                  <div
                    style="position:relative; width:100%; aspect-ratio:16/9; background:#0f172a; overflow:hidden; cursor:pointer;"
                    onclick="openIdentifyFullScreenViewer('${entry.sceneCode}')"
                  >
                    ${
                      entry.canViewSceneImage && entry.assetPath
                        ? `<img
                            src="${escapeHtml(entry.assetPath)}"
                            alt="Scene #${entry.sceneNumber}: ${escapeHtml(entry.titleEn)}"
                            loading="lazy"
                            decoding="async"
                            style="width:100%; height:100%; object-fit:cover; display:block;"
                          />`
                        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:12px; font-weight:700;">Image Unavailable</div>`
                    }
                    <span style="position:absolute; top:8px; left:8px; background:rgba(15,23,42,0.86); color:#fff; font-size:11px; font-weight:900; padding:3px 8px; border-radius:999px;">
                      Scene #${entry.sceneNumber}
                    </span>
                    <span style="position:absolute; top:8px; right:8px; background:rgba(15,23,42,0.82); color:#e2e8f0; font-size:10.5px; font-weight:800; padding:3px 7px; border-radius:999px;">
                      ${entry.categoryIconSvg} ${escapeHtml(entry.categoryTitleEn)}
                    </span>
                  </div>

                  <div style="padding:10px 12px 6px 12px;">
                    <span class="tag" style="background:${badgeBg}; color:${badgeColor}; font-weight:800; font-size:10.5px; display:inline-block; margin-bottom:5px;">
                      ${escapeHtml(entry.statusBadgeLabel)}
                    </span>
                    <div style="font-weight:800; font-size:13.5px; color:var(--text); line-height:1.3;">
                      ${escapeHtml(entry.titleEn)}
                    </div>
                    <div style="font-size:12px; color:var(--accent); font-weight:700; margin-top:2px;">
                      ${escapeHtml(entry.titleUk)}
                    </div>
                  </div>
                </div>

                <div style="padding:8px 12px 10px 12px; display:flex; gap:6px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); margin-top:6px;">
                  ${
                    entry.canViewSceneImage
                      ? `<button
                          type="button"
                          data-testid="scene-card-view-btn-${entry.sceneNumber}"
                          class="btn btn-sec"
                          style="flex:1; min-height:32px; padding:4px 8px; font-size:11.5px;"
                          onclick="openIdentifyFullScreenViewer('${entry.sceneCode}')"
                        >
                          🔍 View Scene
                        </button>`
                      : ''
                  }
                  ${
                    entry.canStartLearnerPractice
                      ? `<button
                          type="button"
                          data-testid="scene-card-practice-btn-${entry.sceneNumber}"
                          class="btn btn-success"
                          style="flex:1; min-height:32px; padding:4px 8px; font-size:11.5px;"
                          onclick="startIdentifyLearnerPracticeFrom80Browser(${entry.sceneNumber})"
                        >
                          🎯 Practice (${entry.verifiedHotspotCount})
                        </button>`
                      : ''
                  }
                  ${
                    entry.canStartAdminPreviewPractice
                      ? `<button
                          type="button"
                          data-testid="scene-card-preview-practice-btn-${entry.sceneNumber}"
                          class="btn"
                          style="flex:1; min-height:32px; padding:4px 8px; font-size:11.5px; background:#d97706; color:#fff;"
                          onclick="startIdentifyAdminPreviewPractice('${entry.sceneCode}', 'mc')"
                        >
                          🧪 Preview Practice (${entry.candidateHotspotCount})
                        </button>`
                      : ''
                  }
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
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
    for (const s of getPlayableScenesForCategory(c)) {
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
      <div class="card" style="margin-bottom:14px; border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <h2 style="margin:0; font-size:16.5px; font-weight:700;">All ${IDENTIFY_CATEGORIES.length} Visual Categories (${totalLibraryScenes} Scenes · 2,000 Unique Nouns)</h2>
            <p style="margin:2px 0 0 0; font-size:12.5px; color:var(--text-secondary);">Organized across 9 Topic Groups with concrete visual objects per scene.</p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <input type="search" class="input-box" style="min-height:36px; font-size:13px; max-width:220px;" placeholder="Search categories or nouns..." value="${escapeHtml(categorySearchQuery)}" oninput="filterIdentifyCategories(this.value)">
            <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px;" onclick="toggleIdentifyCategoryDrawer(false)">Close</button>
          </div>
        </div>
        <div class="stage-bar" style="margin-bottom:10px;">
          ${topicGroupFilterPillsHtml}
        </div>
        <div class="identify-category-grid">
          ${filteredCats
            .map((c) => {
              const catPlayable = getPlayableScenesForCategory(c);
              let completedScenes = 0;
              for (const s of catPlayable) {
                if (computeIdentifySceneSummary(identifyProgress, s).isSceneComplete) {
                  completedScenes++;
                }
              }
              const isCurrent = c.id === cat.id;
              const thumbSrc = (catPlayable[0] || c.scenes[0]).assetPath;
              return `
                <button type="button" class="identify-cat-card ${isCurrent ? 'active' : ''}" onclick="selectIdentifyCategory('${c.id}')">
                  <div class="identify-cat-thumb-wrap">
                    <img src="${thumbSrc}" alt="${escapeHtml(c.titleEn)}" loading="lazy" decoding="async" class="identify-cat-thumb" />
                    <span class="identify-cat-thumb-badge">${c.icon} ${completedScenes}/${catPlayable.length || c.scenes.length}</span>
                  </div>
                  <div style="font-weight:800; font-size:14px; color:var(--text); margin-top:6px;">${c.number}. ${escapeHtml(c.titleEn)}</div>
                  <div style="font-size:12.5px; color:var(--accent); font-weight:700;">${escapeHtml(c.titleUk)}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${c.coreVocab.length} unique nouns • ${catPlayable.length || c.scenes.length} approved scenes</div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  const playableCategoryScenes = getPlayableScenesForCategory(cat);
  const visibleCategoryScenes =
    playableCategoryScenes.length > 0 ? playableCategoryScenes : [];

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
        <details data-testid="identify-pilot-variant-switcher" style="margin-bottom:10px; padding:7px 12px; border-radius:var(--radius-sm); background:var(--surface-1); border:1px solid var(--border-subtle);">
          <summary style="cursor:pointer; font-size:12px; font-weight:600; color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center;">
            <span>Scene Verification Variants (Scene 3 — Beach &amp; Nature · ${scene.targets.length} verified objects)</span>
            <span style="color:var(--accent); font-weight:700;">Options</span>
          </summary>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-pilot-a' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-pilot-a')">
              Pilot Scene A: Sunny Sea Beach (8)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-pilot-b' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-pilot-b')">
              Pilot Scene B: Alpine Lake (5)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'beach-nature-scene-3-verified-photo' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'beach-nature-scene-3-verified-photo')">
              Verified Photo Only (4)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'baseline' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('beach-nature-scene-3', 'baseline')">
              Original Baseline (9)
            </button>
          </div>
        </details>
      `
      : hasVerifiedCategoryOverride
      ? `
        <details data-testid="identify-pilot-variant-switcher" style="margin-bottom:10px; padding:7px 12px; border-radius:var(--radius-sm); background:var(--surface-1); border:1px solid var(--border-subtle);">
          <summary style="cursor:pointer; font-size:12px; font-weight:600; color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center;">
            <span>Object Verification Diagnostics (${validationReport.canPublish ? `Verified · ${scene.targets.length} objects` : `${validationReport.findings.length} findings`})</span>
            <span style="color:var(--accent); font-weight:700;">Inspect</span>
          </summary>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
            <button type="button" class="stage-pill ${
              activePilotVariant !== 'baseline' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('${activeBaseSceneId}', '${activeBaseSceneId}-verified')">
              Verified Object Locations (${scene.targets.length} Objects)
            </button>
            <button type="button" class="stage-pill ${
              activePilotVariant === 'baseline' ? 'active' : ''
            }" onclick="switchIdentifyPilotVariant('${activeBaseSceneId}', 'baseline')">
              Original Baseline
            </button>
          </div>
        </details>
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

  const matchingCat80Scenes = getIdentify80SceneBrowserList({ categoryId: cat.id });
  const unverifiedSceneCardHtml = !activeTarget
    ? `
      <div data-testid="identify-unverified-scene-notice" style="padding:14px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-subtle);">
        <div style="font-size:14px; font-weight:800; color:var(--text); margin-bottom:6px;">
          ⏳ Legacy Library Scene Awaiting Human Hotspot Approval
        </div>
        <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
          To protect learner accuracy, standard student practice only quizzes hotspots that have completed human verification.
          However, all <b>80 generated Ukrainian curriculum scenes</b> (including <b>${matchingCat80Scenes.length} scenes in ${escapeHtml(cat.titleEn)}</b>) are unlocked above for <b>View Scene</b> and administrator <b>Preview Practice</b>!
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${
            matchingCat80Scenes.length > 0
              ? `<button type="button" class="btn" onclick="openIdentifyFullScreenViewer('${matchingCat80Scenes[0].sceneCode}')">
                  🔍 View ${escapeHtml(cat.titleEn)} Scene #${matchingCat80Scenes[0].sceneNumber}
                </button>`
              : ''
          }
          ${
            matchingCat80Scenes.find((m) => m.canStartAdminPreviewPractice)
              ? `<button type="button" class="btn" style="background:#d97706; color:#fff;" onclick="startIdentifyAdminPreviewPractice('${
                  matchingCat80Scenes.find((m) => m.canStartAdminPreviewPractice)!.sceneCode
                }', 'mc')">
                  🧪 Preview Practice Scene #${
                    matchingCat80Scenes.find((m) => m.canStartAdminPreviewPractice)!.sceneNumber
                  } (${
                  matchingCat80Scenes.find((m) => m.canStartAdminPreviewPractice)!
                    .candidateHotspotCount
                } Hotspots)
                </button>`
              : ''
          }
          <button type="button" class="btn btn-success" onclick="goIdentifyNextScene()">
            ▶ Switch to Next Approved Learner Scene →
          </button>
        </div>
      </div>
    `
    : '';

  // Dedicated Explore Mode Inspection Card (Section 20)
  const exploreModeCardHtml =
    activeTarget && identifyProgress.explorationMode === 'explore'
      ? `
        <div id="identify-explore-card" data-testid="identify-explore-card" class="identify-answer-card correct" style="margin-top:12px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">
            <div>
              <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:600;">
                Explore · Visual inspection
              </span>
              <div class="word" style="font-size:30px; color:var(--text); margin-top:8px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
                ${escapeHtml(activeTarget.uk)}
              </div>
              <div class="hint" style="margin-top:4px;">
                Sounds like <b style="color:var(--text);">${escapeHtml(pronunciationGuide)}</b>
              </div>
              <div style="font-size:17px; font-weight:600; color:var(--text); margin-top:4px;">
                ${escapeHtml(activeTarget.en)}
              </div>
              <div class="hint" style="margin-top:2px;">
                ${formatGenderBadge(activeTarget.gender)} ${
                  activeTarget.verifiedLexicalSense
                    ? `· ${escapeHtml(activeTarget.verifiedLexicalSense)}`
                    : ''
                }
              </div>
              ${synonymsLine}
            </div>
          </div>

          <div class="example-chip" style="margin-top:12px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.exampleUk)}')">
            <div class="word" style="font-size:16px; color:var(--text);">${escapeHtml(activeTarget.exampleUk)}</div>
            <div class="hint" style="margin-top:3px;">${escapeHtml(activeTarget.exampleEn)}</div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
            <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">Hear word</button>
            <button type="button" class="btn btn-sec" onclick="inspectCourseWord('${escapeSingleQuotes(activeTarget.uk)}')">7-Case table</button>
            <button type="button" id="identify-add-fsrs-btn" class="btn btn-sec" onclick="addIdentifyWordToFSRS('${escapeSingleQuotes(activeTarget.uk)}', '${escapeSingleQuotes(activeTarget.en)}')">+ Add to deck</button>
            <button type="button" class="btn" style="margin-left:auto;" onclick="setIdentifyExplorationMode('guided')">Start round →</button>
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
              <span class="tag" style="background:${targetStatus === 'revealed' ? 'var(--warn-container)' : 'var(--success-container)'}; color:${targetStatus === 'revealed' ? 'var(--warn-on-container)' : 'var(--success-on-container)'}; font-weight:600;">
                ${targetStatus === 'revealed' ? 'Here it is · Needs practice' : 'Right'}
              </span>
              <div class="word" style="font-size:30px; color:var(--text); margin-top:8px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">
                ${escapeHtml(activeTarget.uk)}
              </div>
              <div class="hint" style="margin-top:3px;">Sounds like <b style="color:var(--text);">${escapeHtml(pronunciationGuide)}</b></div>
              <div style="font-size:17px; font-weight:600; color:var(--text); margin-top:3px;">${escapeHtml(activeTarget.en)}</div>
              <div class="hint" style="margin-top:2px;">${formatGenderBadge(activeTarget.gender)}</div>
              ${synonymsLine}
            </div>
          </div>

          <div class="example-chip" style="margin-top:12px;" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.exampleUk)}')">
            <div class="word" style="font-size:16px; color:var(--text);">${escapeHtml(activeTarget.exampleUk)}</div>
            <div class="hint" style="margin-top:3px;">${escapeHtml(activeTarget.exampleEn)}</div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
            <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(activeTarget.uk)}')">Hear word</button>
            <button type="button" class="btn btn-sec" onclick="inspectCourseWord('${escapeSingleQuotes(activeTarget.uk)}')">7-Case table</button>
            <button type="button" id="identify-add-fsrs-btn" class="btn btn-sec" onclick="addIdentifyWordToFSRS('${escapeSingleQuotes(activeTarget.uk)}', '${escapeSingleQuotes(activeTarget.en)}')">+ Add to deck</button>
            <button type="button" class="btn" style="margin-left:auto;" onclick="advanceIdentifyNextTarget()">Continue →</button>
          </div>
        </div>
      `
      : '';

  const quizControlsHtml =
    activeTarget && identifyProgress.explorationMode !== 'explore' && !isTargetResolved
      ? identifyProgress.quizMode === 'mc'
        ? `
          <div style="margin-top:12px;">
            <div style="font-size:15px; font-weight:600; color:var(--text); margin-bottom:10px; letter-spacing:-0.01em;">
              What is marked at #${activeTarget.targetNumber} <span style="color:var(--muted); font-weight:400;">(${escapeHtml(activeTarget.en)})</span>?
            </div>
            <div class="identify-options-grid" role="group" aria-label="Choose its Ukrainian name">
              ${mcOptions
                .map((opt, idx) => {
                  const wasWrongPick =
                    targetProg?.status === 'incorrect' &&
                    targetProg.lastUserAnswer === opt;
                  return `
                    <button
                      type="button"
                      class="option-btn ${wasWrongPick ? 'wrong' : ''}"
                      onclick="handleIdentifyMCOption('${activeTarget.id}', '${escapeSingleQuotes(opt)}')"
                    >
                      <kbd class="vb-kbd" data-slot="kbd" aria-hidden="true">${idx + 1}</kbd>
                      <span class="word" style="font-size:1.18rem; flex:1;">${escapeHtml(opt)}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:14px; flex-wrap:wrap;">
              <button
                type="button"
                class="btn btn-sec"
                id="identify-show-answer-btn"
                onclick="revealIdentifyAnswer('${activeTarget.id}')"
              >
                Show answer
              </button>
              <span class="hint">Reveal if you have not met this word yet.</span>
            </div>
          </div>
        `
        : `
          <div style="margin-top:12px;">
            <label for="identify-fill-input" style="display:block; font-size:15px; font-weight:600; color:var(--text); margin-bottom:10px;">
              Name what is marked at #${activeTarget.targetNumber} <span style="color:var(--muted); font-weight:400;">(${escapeHtml(activeTarget.en)})</span>
            </label>
            <input
              id="identify-fill-input"
              type="text"
              class="answer-line"
              placeholder="Type in Ukrainian…"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              onkeydown="if(event.key==='Enter'){event.preventDefault(); submitIdentifyTypedAnswer('${activeTarget.id}');}"
            >
            <div style="display:flex; gap:5px; justify-content:center; flex-wrap:wrap; margin:10px 0 12px 0;">
              ${['ґ', 'є', 'і', 'ї', '’', 'щ', 'ю', 'я']
                .map(
                  (ch) =>
                    `<button type="button" class="btn btn-sec" style="min-height:32px; padding:3px 10px; font-family:var(--font-word); font-size:15px;" onclick="insertIdentifyChar('${ch}')">${ch}</button>`
                )
                .join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
              <button
                type="button"
                class="btn btn-sec"
                id="identify-show-answer-btn"
                onclick="revealIdentifyAnswer('${activeTarget.id}')"
              >
                Show answer
              </button>
              <button type="button" class="btn" onclick="submitIdentifyTypedAnswer('${activeTarget.id}')">Check</button>
            </div>
            <div class="hint" style="margin-top:8px;">
              Stress marks and capitalisation are optional; Ukrainian letters (г/ґ, і/ї, и/і, е/є) are checked accurately.
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

  const all80Count = getIdentify80SceneBrowserList().length;
  const fullScreenViewerHtml = renderFullScreenSceneViewerModalHtml();
  const adminPreviewWorkspaceHtml = renderAdminPreviewPracticeWorkspaceHtml();
  const curriculum80BrowserHtml = render80SceneCurriculumBrowserHtml();

  container.innerHTML = `
    ${fullScreenViewerHtml}
    ${adminPreviewWorkspaceHtml}

    <header class="section-header" id="identify-learner-practice-stage" style="align-items:flex-end; margin-bottom:16px;">
      <div>
        <h1 class="section-title">Pictures</h1>
        <p class="section-subtitle">
          Name what the marker points to in everyday Ukrainian scenes · ${all80Count} scenes · ${totalObjectsMastered} mastered
        </p>
      </div>

      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <div class="identify-segmented-switch" role="tablist" aria-label="Identify View Mode">
          <button
            type="button"
            class="identify-seg-btn ${!show80SceneCurriculumBrowser ? 'active' : ''}"
            onclick="toggleIdentify80SceneBrowser(false)"
          >
            Practice
          </button>
          <button
            type="button"
            data-testid="toggle-80-scene-browser-btn"
            class="identify-seg-btn ${show80SceneCurriculumBrowser ? 'active' : ''}"
            onclick="toggleIdentify80SceneBrowser(${!show80SceneCurriculumBrowser})"
          >
            All ${all80Count} scenes
          </button>
        </div>
        <button type="button" class="btn btn-sec" onclick="toggleIdentifyCategoryDrawer()">
          Topics (${IDENTIFY_CATEGORIES.length})
        </button>
        <button type="button" id="identify-add-scene-fsrs-btn" class="btn btn-sec" onclick="addIdentifySceneWordsToFSRS()">
          + Add scene
        </button>
        <button type="button" class="btn btn-sec" onclick="toggleIdentifySummaryView()">
          Summary (${roundSummary.scenePracticedObjectsCount}/${roundSummary.sceneTotalObjects})
        </button>
      </div>
    </header>

    ${curriculum80BrowserHtml}
    ${categoryBrowserHtml}

    <div class="card" style="margin-bottom:12px; padding:10px 14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1; min-width:260px;">
          <label for="identify-quick-cat-select" style="font-size:11.5px; font-weight:700; color:var(--text-secondary);">Category:</label>
          <select id="identify-quick-cat-select" class="input-box" style="min-height:34px; padding:4px 10px; font-size:13px; max-width:240px;" onchange="selectIdentifyCategory(this.value)">
            ${IDENTIFY_CATEGORIES.map(
              (c) =>
                `<option value="${escapeHtml(c.id)}" ${c.id === cat.id ? 'selected' : ''}>${c.number}. ${escapeHtml(c.titleEn)} (${escapeHtml(c.titleUk)})</option>`
            ).join('')}
          </select>

          <label for="identify-quick-scene-select" style="font-size:11.5px; font-weight:700; color:var(--text-secondary); margin-left:4px;">Scene:</label>
          <select id="identify-quick-scene-select" class="input-box" style="min-height:34px; padding:4px 10px; font-size:13px; flex:1; min-width:210px; max-width:380px;" onchange="selectIdentifyScene(this.value)">
            ${visibleCategoryScenes
              .map((s) => {
                const effectiveS = getEffectiveIdentifyScene(s.id, { includeUnpublishedDraft: true }) || s;
                const sm = computeIdentifySceneSummary(identifyProgress, effectiveS);
                return `<option value="${escapeHtml(s.id)}" ${s.id === identifyProgress.activeSceneId ? 'selected' : ''}>Scene ${s.sceneNumber}: ${escapeHtml(s.titleEn)} (${sm.resolvedCount}/${sm.totalTargets})</option>`;
              })
              .join('')}
          </select>
        </div>

        <div data-testid="identify-progress-strip" style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
          <span data-testid="identify-round-progress-badge" class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:700;">
            Round ${roundSummary.roundNumber}: ${roundSummary.questionsCompletedInRound}/${roundSummary.totalQuestionsInRound}
          </span>
          <span data-testid="identify-scene-coverage-badge" class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:700;">
            Coverage: ${roundSummary.scenePracticedObjectsCount}/${roundSummary.sceneTotalObjects} (${roundSummary.sceneCoveragePercent}%)
          </span>
          <span data-testid="identify-scene-mastery-badge" class="tag" style="background:${roundSummary.isSceneMastered ? 'var(--success-container)' : 'var(--surface-2)'}; color:${roundSummary.isSceneMastered ? 'var(--success-on-container)' : 'var(--text-secondary)'}; font-weight:700;">
            ${roundSummary.isSceneMastered ? `Mastered (${roundSummary.sceneMasteredObjectsCount}/${roundSummary.sceneTotalObjects})` : `Mastery: ${roundSummary.sceneMasteredObjectsCount}/${roundSummary.sceneTotalObjects}`}
          </span>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:8px; border-top:1px solid var(--border-subtle);">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:11.5px; font-weight:700; color:var(--text-secondary);">Mode:</span>
          <button type="button" data-testid="identify-mode-explore" class="stage-pill ${identifyProgress.explorationMode === 'explore' ? 'active' : ''}" onclick="setIdentifyExplorationMode('explore')">Explore (${scene.targets.length})</button>
          <button type="button" data-testid="identify-mode-free" class="stage-pill ${identifyProgress.explorationMode === 'free' ? 'active' : ''}" onclick="setIdentifyExplorationMode('free')">Free Practice</button>
          <button type="button" data-testid="identify-mode-guided" class="stage-pill ${identifyProgress.explorationMode === 'guided' ? 'active' : ''}" onclick="setIdentifyExplorationMode('guided')">Guided Round</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:11.5px; font-weight:700; color:var(--text-secondary);">Round:</span>
          <button type="button" data-testid="identify-round-len-5" class="stage-pill ${identifyProgress.roundLength === 5 ? 'active' : ''}" onclick="setIdentifyRoundLength(5)">Quick (5)</button>
          <button type="button" data-testid="identify-round-len-8" class="stage-pill ${(identifyProgress.roundLength || 8) === 8 ? 'active' : ''}" onclick="setIdentifyRoundLength(8)">Standard (8)</button>
          <button type="button" data-testid="identify-round-len-10" class="stage-pill ${identifyProgress.roundLength === 10 ? 'active' : ''}" onclick="setIdentifyRoundLength(10)">Extended (10)</button>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:11.5px; font-weight:700; color:var(--text-secondary);">Quiz:</span>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'mc' ? 'active' : ''}" onclick="setIdentifyQuizMode('mc')">Multiple Choice</button>
          <button type="button" class="stage-pill ${identifyProgress.quizMode === 'fill' ? 'active' : ''}" onclick="setIdentifyQuizMode('fill')">Fill in Blank</button>
        </div>
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
    // 80-Scene Browser, Full-Screen Viewer & Admin Preview Practice handlers
    toggleIdentify80SceneBrowser,
    filterIdentify80ByCategory,
    filterIdentify80ByStatus,
    searchIdentify80Scenes,
    toggleIdentifyAdminPreviewMode,
    openIdentifyFullScreenViewer,
    closeIdentifyFullScreenViewer,
    navigateIdentifyFullScreenViewer,
    toggleIdentifyViewerHotspots,
    selectIdentifyViewerHotspotSlot,
    zoomIdentifyViewerBy,
    resetIdentifyViewerZoom,
    panIdentifyViewerBy,
    startIdentifyLearnerPracticeFrom80Browser,
    startIdentifyAdminPreviewPractice,
    closeIdentifyAdminPreviewPractice,
    switchIdentifyAdminPreviewMode,
    selectIdentifyAdminPreviewSlot,
    stepIdentifyAdminPreviewSlot,
    submitIdentifyAdminPreviewMCOption,
    submitIdentifyAdminPreviewFillAnswer,
    insertIdentifyAdminPreviewChar,
    revealIdentifyAdminPreviewTarget,
    zoomIdentifyPreviewBy,
    resetIdentifyPreviewZoom,
    panIdentifyPreviewBy,
  });
}
