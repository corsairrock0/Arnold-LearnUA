// ============================================================================
// LANGO CONTENT STUDIO — IDENTIFY SCENE MANAGER, VISUAL ANNOTATION EDITOR,
// QUALITY CHECKER & 100-SCENE BULK AUDIT CONTROLLER (STAGE F, G, H)
// ============================================================================

import {
  computeMasterVocabularyCoverageSummary,
  IDENTIFY_CATEGORIES,
  IdentifyHotspot,
  IdentifyScene,
} from '../identifyData.ts';
import { getIdentifyGenerationQueueSummary } from '../identifyGenerationQueue.ts';
import {
  addIdentifyTargetToDraft,
  buildAdditionalVerifiedSceneOverrides,
  buildPilotCorrectionScenesForBeachScene3,
  getBaselineIdentifyScene,
  getOrCreateIdentifySceneDraft,
  markIdentifyTargetMissingInDraft,
  planIdentifyScenesForVocabulary,
  publishValidatedIdentifySceneDraft,
  resolveIdentifyTargetForCourseTrack,
  restoreIdentifySceneBaseline,
  runIdentifyLibraryBulkAudit,
  setActivePilotVariantForScene,
  undoIdentifySceneDraftEdit,
  updateIdentifySceneAssetInDraft,
  updateIdentifyTargetGeometryInDraft,
  validateIdentifySceneQuality,
} from '../identifySceneIntelligence.ts';
import { getAllCourseTracks } from './courseTrackRegistry.ts';
import {
  selectIdentifyCategory,
  selectIdentifyScene,
  setIdentifyExplorationMode,
  setIdentifyRoundLength,
  switchIdentifyPilotVariant,
} from '../identifyView.ts';

export interface CmsIdentifyEditorUiState {
  selectedSceneId: string;
  selectedTargetId: string;
  categoryFilter: string;
  qualityFilter: 'all' | 'validated_ready' | 'invalid_defective' | 'pilot';
  searchQuery: string;
  selectedTrackId: string;
  clickToolMode: 'select_object' | 'move_marker' | 'adjust_area';
  showBulkAuditPanel: boolean;
  showScenePlannerPanel: boolean;
  showMasterCoverageDashboard: boolean;
  statusMessage: {
    type: 'success' | 'warn' | 'danger';
    text: string;
  } | null;
}

const identifyStudioUiState: CmsIdentifyEditorUiState = {
  selectedSceneId: 'beach-nature-scene-3-pilot-a',
  selectedTargetId: 'beach-nature-pilot-a-t1',
  categoryFilter: 'beach-nature',
  qualityFilter: 'all',
  searchQuery: '',
  selectedTrackId: 'track:en-to-uk',
  clickToolMode: 'move_marker',
  showBulkAuditPanel: false,
  showScenePlannerPanel: false,
  showMasterCoverageDashboard: true,
  statusMessage: null,
};


let onRequestStudioRerender: (() => void) | null = null;

export function registerIdentifyStudioRerenderHook(fn: () => void): void {
  onRequestStudioRerender = fn;
}

function triggerRerender(): void {
  if (onRequestStudioRerender) {
    onRequestStudioRerender();
  }
}

function escapeHtml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getAllManageableScenes(): IdentifyScene[] {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const additional = buildAdditionalVerifiedSceneOverrides();
  const legacyScene3 = getBaselineIdentifyScene('beach-nature-scene-3');
  const list: IdentifyScene[] = [
    pilots['beach-nature-scene-3-pilot-a'],
    pilots['beach-nature-scene-3-pilot-b'],
    pilots['beach-nature-scene-3-verified-photo'],
    ...(legacyScene3 ? [legacyScene3] : []),
    ...Object.values(additional),
  ];

  for (const cat of IDENTIFY_CATEGORIES) {
    for (const sc of cat.scenes) {
      list.push(sc);
    }
  }
  return list;
}

function ensureSelectedSceneAndTarget(): {
  draftRecord: ReturnType<typeof getOrCreateIdentifySceneDraft>;
  scene: IdentifyScene;
  activeTarget: IdentifyHotspot | undefined;
} {
  const draftRecord = getOrCreateIdentifySceneDraft(identifyStudioUiState.selectedSceneId);
  const scene = draftRecord.scene;
  let activeTarget = scene.targets.find((t) => t.id === identifyStudioUiState.selectedTargetId);
  if (!activeTarget && scene.targets.length > 0) {
    activeTarget = scene.targets[0];
    identifyStudioUiState.selectedTargetId = activeTarget.id;
  }
  return { draftRecord, scene, activeTarget };
}

// ============================================================================
// INTERACTIVE HANDLERS BOUND TO WINDOW
// ============================================================================

export function selectCmsIdentifyScene(sceneId: string): void {
  identifyStudioUiState.selectedSceneId = sceneId;
  const rec = getOrCreateIdentifySceneDraft(sceneId);
  identifyStudioUiState.selectedTargetId = rec.scene.targets[0]?.id || '';
  identifyStudioUiState.statusMessage = null;
  triggerRerender();
}

export function selectCmsIdentifyTarget(targetId: string): void {
  identifyStudioUiState.selectedTargetId = targetId;
  triggerRerender();
}

export function setCmsIdentifyFilter(
  kind: 'category' | 'quality' | 'search' | 'track' | 'tool',
  value: string
): void {
  if (kind === 'category') identifyStudioUiState.categoryFilter = value;
  if (kind === 'quality') {
    identifyStudioUiState.qualityFilter = value as CmsIdentifyEditorUiState['qualityFilter'];
  }
  if (kind === 'search') identifyStudioUiState.searchQuery = value;
  if (kind === 'track') identifyStudioUiState.selectedTrackId = value;
  if (kind === 'tool') {
    identifyStudioUiState.clickToolMode = value as CmsIdentifyEditorUiState['clickToolMode'];
  }
  triggerRerender();
}

export function toggleCmsIdentifyBulkAuditPanel(force?: boolean): void {
  identifyStudioUiState.showBulkAuditPanel =
    typeof force === 'boolean' ? force : !identifyStudioUiState.showBulkAuditPanel;
  triggerRerender();
}

export function toggleCmsIdentifyScenePlannerPanel(force?: boolean): void {
  identifyStudioUiState.showScenePlannerPanel =
    typeof force === 'boolean' ? force : !identifyStudioUiState.showScenePlannerPanel;
  triggerRerender();
}

export function toggleCmsIdentifyMasterCoverageDashboard(force?: boolean): void {
  identifyStudioUiState.showMasterCoverageDashboard =
    typeof force === 'boolean' ? force : !identifyStudioUiState.showMasterCoverageDashboard;
  triggerRerender();
}


export function handleCmsIdentifyCanvasClick(event: MouseEvent): void {
  const canvasEl = document.getElementById('cms-identify-annotation-canvas');
  if (!canvasEl) return;

  const { scene, activeTarget } = ensureSelectedSceneAndTarget();
  if (!activeTarget) return;

  const rect = canvasEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const normX = Math.max(0.02, Math.min(0.98, (event.clientX - rect.left) / rect.width));
  const normY = Math.max(0.02, Math.min(0.98, (event.clientY - rect.top) / rect.height));

  if (identifyStudioUiState.clickToolMode === 'move_marker') {
    const halfW = activeTarget.width / 2;
    const halfH = activeTarget.height / 2;
    const newX = Math.max(0, Math.min(1 - activeTarget.width, normX - halfW));
    const newY = Math.max(0, Math.min(1 - activeTarget.height, normY - halfH));
    const res = updateIdentifyTargetGeometryInDraft(scene.id, activeTarget.id, {
      x: newX,
      y: newY,
      centerX: normX,
      centerY: normY,
    });
    if (res.ok) {
      identifyStudioUiState.statusMessage = {
        type: 'success',
        text: `Moved marker #${activeTarget.targetNumber} (${activeTarget.en}) to (${(normX * 100).toFixed(1)}%, ${(normY * 100).toFixed(1)}%) in draft.`,
      };
    }
    triggerRerender();
  }
}

export function handleCmsIdentifySaveGeometryInputs(): void {
  const { scene, activeTarget } = ensureSelectedSceneAndTarget();
  if (!activeTarget) return;

  const cxEl = document.getElementById('cms-id-input-cx') as HTMLInputElement | null;
  const cyEl = document.getElementById('cms-id-input-cy') as HTMLInputElement | null;
  const xEl = document.getElementById('cms-id-input-x') as HTMLInputElement | null;
  const yEl = document.getElementById('cms-id-input-y') as HTMLInputElement | null;
  const wEl = document.getElementById('cms-id-input-w') as HTMLInputElement | null;
  const hEl = document.getElementById('cms-id-input-h') as HTMLInputElement | null;
  const vocabEl = document.getElementById('cms-id-select-vocab') as HTMLSelectElement | null;
  const senseEl = document.getElementById('cms-id-input-sense') as HTMLInputElement | null;

  const res = updateIdentifyTargetGeometryInDraft(scene.id, activeTarget.id, {
    centerX: cxEl ? Number(cxEl.value) / 100 : undefined,
    centerY: cyEl ? Number(cyEl.value) / 100 : undefined,
    x: xEl ? Number(xEl.value) / 100 : undefined,
    y: yEl ? Number(yEl.value) / 100 : undefined,
    width: wEl ? Number(wEl.value) / 100 : undefined,
    height: hEl ? Number(hEl.value) / 100 : undefined,
    vocabularyId: vocabEl?.value || undefined,
    verifiedLexicalSense: senseEl?.value || undefined,
  });

  if (res.ok) {
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `Saved draft annotation for Target #${activeTarget.targetNumber} (${activeTarget.en}).`,
    };
  } else {
    identifyStudioUiState.statusMessage = {
      type: 'danger',
      text: res.error || 'Could not update target annotation.',
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyNudgeTarget(
  dxPct: number,
  dyPct: number,
  dwPct = 0,
  dhPct = 0
): void {
  const { scene, activeTarget } = ensureSelectedSceneAndTarget();
  if (!activeTarget) return;

  const curCx = activeTarget.centerX ?? activeTarget.x + activeTarget.width / 2;
  const curCy = activeTarget.centerY ?? activeTarget.y + activeTarget.height / 2;
  const newW = Math.max(0.04, Math.min(0.85, activeTarget.width + dwPct / 100));
  const newH = Math.max(0.04, Math.min(0.85, activeTarget.height + dhPct / 100));
  const newCx = Math.max(0.03, Math.min(0.97, curCx + dxPct / 100));
  const newCy = Math.max(0.03, Math.min(0.97, curCy + dyPct / 100));
  const newX = Math.max(0, Math.min(1 - newW, activeTarget.x + dxPct / 100));
  const newY = Math.max(0, Math.min(1 - newH, activeTarget.y + dyPct / 100));

  updateIdentifyTargetGeometryInDraft(scene.id, activeTarget.id, {
    x: newX,
    y: newY,
    width: newW,
    height: newH,
    centerX: newCx,
    centerY: newCy,
  });
  identifyStudioUiState.statusMessage = {
    type: 'success',
    text: `Adjusted Target #${activeTarget.targetNumber} (${activeTarget.en}) in draft.`,
  };
  triggerRerender();
}

export function handleCmsIdentifyMarkTargetMissing(): void {
  const { scene, activeTarget } = ensureSelectedSceneAndTarget();
  if (!activeTarget) return;

  const removedLabel = activeTarget.en;
  const res = markIdentifyTargetMissingInDraft(scene.id, activeTarget.id, {
    removeFromActiveTargets: true,
    reasonEn: `Instructor marked "${removedLabel}" as missing in this picture.`,
  });

  if (res.ok && res.scene) {
    identifyStudioUiState.selectedTargetId = res.scene.targets[0]?.id || '';
    identifyStudioUiState.statusMessage = {
      type: 'warn',
      text: `Marked "${removedLabel}" as missing in the picture and removed its active marker pin from the draft.`,
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyAddTarget(): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === scene.categoryId);
  const unusedVocab =
    cat?.coreVocab.find((v) => !scene.targets.some((t) => t.vocabularyId === v.vocabularyId)) ||
    cat?.coreVocab[0];
  if (!unusedVocab) return;

  const res = addIdentifyTargetToDraft(scene.id, unusedVocab.vocabularyId);
  if (res.ok && res.scene) {
    const newest = res.scene.targets[res.scene.targets.length - 1];
    if (newest) identifyStudioUiState.selectedTargetId = newest.id;
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `Added new target "${unusedVocab.en}" (${unusedVocab.uk}) to draft. Click on the image to place its marker.`,
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyChangeAssetPath(assetPath: string): void {
  if (!assetPath) return;
  const { scene } = ensureSelectedSceneAndTarget();
  const isSvg = assetPath.endsWith('.svg');
  const res = updateIdentifySceneAssetInDraft(
    scene.id,
    assetPath,
    isSvg ? 'local-verified-scene-illustration' : 'photograph'
  );
  if (res.ok) {
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `Updated scene image asset to "${assetPath}" in draft.`,
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyUndoDraft(): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const res = undoIdentifySceneDraftEdit(scene.id);
  identifyStudioUiState.statusMessage = {
    type: res.ok ? 'success' : 'warn',
    text: res.ok ? 'Undid last scene annotation change.' : res.error || 'Nothing to undo.',
  };
  triggerRerender();
}

export function handleCmsIdentifyRestoreBaseline(): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const res = restoreIdentifySceneBaseline(scene.id);
  if (res.ok && res.scene) {
    identifyStudioUiState.selectedTargetId = res.scene.targets[0]?.id || '';
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `Restored "${res.scene.titleEn}" to its baseline state.`,
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyCheckScene(): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const report = validateIdentifySceneQuality(scene);
  if (report.canPublish) {
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `✅ Check Scene Passed: All ${scene.targets.length} object markers are visually verified, non-overlapping, and ready to preview or publish.`,
    };
  } else {
    const firstMsg =
      report.findings[0]?.userFriendlyMessageEn || 'Issues found in this scene.';
    identifyStudioUiState.statusMessage = {
      type: 'danger',
      text: `⚠️ Scene Check Found ${report.findings.length} Issue(s): ${firstMsg}`,
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyPublishScene(): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const res = publishValidatedIdentifySceneDraft(scene.id);
  if (res.ok) {
    identifyStudioUiState.statusMessage = {
      type: 'success',
      text: `🚀 Published verified scene "${scene.titleEn}" (${scene.targets.length} objects).`,
    };
  } else {
    identifyStudioUiState.statusMessage = {
      type: 'danger',
      text: res.error || 'Cannot publish unverified scene.',
    };
  }
  triggerRerender();
}

export function handleCmsIdentifyPreviewInLearnerApp(
  modeOrRoundLen?: 'explore' | 5 | 8 | 10
): void {
  const { scene } = ensureSelectedSceneAndTarget();
  const baseSceneId = scene.replacesBaselineSceneId || scene.id;

  if (scene.replacesBaselineSceneId) {
    setActivePilotVariantForScene(scene.replacesBaselineSceneId, scene.id);
  } else {
    setActivePilotVariantForScene(baseSceneId, null);
  }

  selectIdentifyCategory(scene.categoryId);
  selectIdentifyScene(baseSceneId);
  if (scene.replacesBaselineSceneId) {
    switchIdentifyPilotVariant(scene.replacesBaselineSceneId, scene.id);
  }
  if (modeOrRoundLen === 'explore') {
    setIdentifyExplorationMode('explore');
  } else if (modeOrRoundLen === 5 || modeOrRoundLen === 8 || modeOrRoundLen === 10) {
    setIdentifyExplorationMode('guided');
    setIdentifyRoundLength(modeOrRoundLen);
  }

  const closeStudioFn = (window as unknown as Record<string, () => void>).closeLangoContentStudio;
  if (typeof closeStudioFn === 'function') {
    closeStudioFn();
  }
  const switchTabFn = (window as unknown as Record<string, (t: string) => void>).switchTab;
  if (typeof switchTabFn === 'function') {
    switchTabFn('identify');
  }
}


// ============================================================================
// MAIN RENDERER FOR CONTENT STUDIO IDENTIFY SCENE MANAGER TAB (`identify`)
// ============================================================================

export function renderCmsIdentifySceneManagerTab(): string {
  const allScenes = getAllManageableScenes();
  const { draftRecord, scene, activeTarget } = ensureSelectedSceneAndTarget();
  const report = validateIdentifySceneQuality(scene);
  const cat =
    IDENTIFY_CATEGORIES.find((c) => c.id === scene.categoryId) || IDENTIFY_CATEGORIES[0];

  // Filter scenes in sidebar
  const q = identifyStudioUiState.searchQuery.trim().toLowerCase();
  const filteredScenes = allScenes.filter((s) => {
    if (
      identifyStudioUiState.categoryFilter !== 'all' &&
      s.categoryId !== identifyStudioUiState.categoryFilter
    ) {
      return false;
    }
    const rep = validateIdentifySceneQuality(getOrCreateIdentifySceneDraft(s.id).scene);
    if (identifyStudioUiState.qualityFilter === 'validated_ready' && !rep.canPublish) {
      return false;
    }
    if (identifyStudioUiState.qualityFilter === 'invalid_defective' && rep.canPublish) {
      return false;
    }
    if (
      identifyStudioUiState.qualityFilter === 'pilot' &&
      !s.id.startsWith('beach-nature-scene-3')
    ) {
      return false;
    }
    if (!q) return true;
    return (
      s.id.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.titleUk.toLowerCase().includes(q) ||
      s.targets.some(
        (t) => t.en.toLowerCase().includes(q) || t.uk.toLowerCase().includes(q)
      )
    );
  });

  // Multilingual track adaptation preview for the active target
  const adaptedTrackTarget = activeTarget
    ? resolveIdentifyTargetForCourseTrack(activeTarget, identifyStudioUiState.selectedTrackId)
    : null;

  // Scene planner demonstration for the 9 words of `beach-nature-scene-3`
  const baselineScene3 =
    getBaselineIdentifyScene('beach-nature-scene-3') || scene;
  const scene3VocabList = baselineScene3.targets.map((t) => ({
    vocabularyId: t.vocabularyId,
    uk: t.uk,
    en: t.en,
    acceptedSynonyms: t.acceptedSynonyms,
    pos: t.pos,
    gender: t.gender,
    exampleUk: t.exampleUk,
    exampleEn: t.exampleEn,
    freqRank: t.freqRank,
    iconType: t.iconType,
  }));
  const plannerResult = planIdentifyScenesForVocabulary('beach-nature', scene3VocabList, {
    baseSceneId: 'beach-nature-scene-3',
  });

  const bulkAudit = identifyStudioUiState.showBulkAuditPanel
    ? runIdentifyLibraryBulkAudit()
    : null;

  const statusBannerHtml = identifyStudioUiState.statusMessage
    ? `
      <div data-testid="cms-identify-status-banner" style="margin-bottom:12px; padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; font-weight:700; background:${
        identifyStudioUiState.statusMessage.type === 'success'
          ? 'var(--success-container)'
          : identifyStudioUiState.statusMessage.type === 'warn'
          ? 'var(--warn-container)'
          : 'var(--danger-container)'
      }; color:${
        identifyStudioUiState.statusMessage.type === 'success'
          ? 'var(--success-on-container)'
          : identifyStudioUiState.statusMessage.type === 'warn'
          ? 'var(--warn-on-container)'
          : 'var(--danger-on-container)'
      };">
        ${escapeHtml(identifyStudioUiState.statusMessage.text)}
      </div>
    `
    : '';

  const canvasMarkersHtml = scene.targets
    .map((t) => {
      const isSelected = t.id === activeTarget?.id;
      const pinX = t.centerX ?? t.x + t.width / 2;
      const pinY = t.centerY ?? t.y + t.height / 2;
      const relPinX =
        t.width > 0 ? Math.max(8, Math.min(92, ((pinX - t.x) / t.width) * 100)) : 50;
      const relPinY =
        t.height > 0 ? Math.max(8, Math.min(92, ((pinY - t.y) / t.height) * 100)) : 50;

      return `
        <div
          data-testid="cms-identify-canvas-target-${escapeHtml(t.id)}"
          onclick="event.stopPropagation(); selectCmsIdentifyTarget('${escapeHtml(t.id)}');"
          style="position:absolute; left:${(t.x * 100).toFixed(2)}%; top:${(t.y * 100).toFixed(2)}%; width:${(t.width * 100).toFixed(2)}%; height:${(t.height * 100).toFixed(2)}%; border:${
            isSelected ? '2.5px solid #22c55e' : '1.5px dashed rgba(255,255,255,0.85)'
          }; background:${
            isSelected ? 'rgba(34,197,94,0.18)' : 'rgba(15,23,42,0.12)'
          }; border-radius:8px; cursor:pointer; box-sizing:border-box;"
          title="#${t.targetNumber}: ${escapeHtml(t.en)} (${escapeHtml(t.uk)})"
        >
          <span
            style="position:absolute; left:${relPinX.toFixed(1)}%; top:${relPinY.toFixed(1)}%; transform:translate(-50%, -50%); background:${
              isSelected ? '#16a34a' : '#2563eb'
            }; color:#fff; font-weight:800; font-size:11.5px; padding:2px 7px; border-radius:999px; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.5); white-space:nowrap;"
          >
            #${t.targetNumber} ${escapeHtml(t.en.split('/')[0].trim())}
          </span>
        </div>
      `;
    })
    .join('');

  const masterCoverage = computeMasterVocabularyCoverageSummary();
  const queueSummary = getIdentifyGenerationQueueSummary();

  const masterCoverageHtml = identifyStudioUiState.showMasterCoverageDashboard
    ? `
      <div class="card" data-testid="cms-identify-master-coverage-dashboard" style="padding:16px; margin-bottom:14px; border:2px solid var(--accent);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <div style="font-size:11px; font-weight:800; color:var(--accent);">
              SECTION 27 — MASTER VOCABULARY COVERAGE DASHBOARD & SAFETY VERIFICATION STATUS
            </div>
            <h3 style="margin:2px 0 0 0; font-size:16.5px; font-weight:800;">
              📈 2,000-Noun Registry • ${masterCoverage.plannedScenesCount} Planned Scenes • ${masterCoverage.scenesReadyForStudentsCount} Verified Student-Ready Scenes
            </h3>
          </div>
          <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="toggleCmsIdentifyMasterCoverageDashboard(false)">Hide Dashboard</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(155px, 1fr)); gap:8px; margin-bottom:12px;" data-testid="cms-identify-safety-verification-metrics">
          <div class="identify-metric-box">
            <div class="identify-metric-val" data-testid="cms-cov-planned-scenes">${masterCoverage.plannedScenesCount}</div>
            <div class="identify-metric-lbl">PLANNED SCENES</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);" data-testid="cms-cov-verified-images">${masterCoverage.scenesWithVerifiedImagesCount}</div>
            <div class="identify-metric-lbl">SCENES WITH VERIFIED IMAGES</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);" data-testid="cms-cov-verified-hotspots">${masterCoverage.scenesWithVerifiedHotspotsCount}</div>
            <div class="identify-metric-lbl">SCENES WITH VERIFIED HOTSPOTS</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);" data-testid="cms-cov-ready-for-students">${masterCoverage.scenesReadyForStudentsCount}</div>
            <div class="identify-metric-lbl">SCENES READY FOR STUDENTS</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--warn);" data-testid="cms-cov-awaiting-ai">${masterCoverage.scenesAwaitingAiGenerationCount}</div>
            <div class="identify-metric-lbl">SCENES AWAITING AI GENERATION</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);" data-testid="cms-cov-verified-targets">${masterCoverage.verifiedActiveTargetAssociationsCount}</div>
            <div class="identify-metric-lbl">Verified Active Learner Targets</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--text-secondary);" data-testid="cms-cov-unverified-associations">${masterCoverage.unverifiedPlannedAssociationsCount}</div>
            <div class="identify-metric-lbl">Unverified Planned Associations</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:8px; margin-bottom:12px;">
          <div class="identify-metric-box">
            <div class="identify-metric-val" data-testid="cms-cov-target-nouns">${masterCoverage.totalTargetUniqueNouns}</div>
            <div class="identify-metric-lbl">Target Unique Nouns</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--success);" data-testid="cms-cov-actual-nouns">${masterCoverage.actualUniqueNounsRepresented}</div>
            <div class="identify-metric-lbl">Actual Unique Nouns</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" data-testid="cms-cov-total-scenes">${masterCoverage.totalScenes}</div>
            <div class="identify-metric-lbl">Total Planned Scenes</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--accent);" data-testid="cms-cov-total-associations">${masterCoverage.totalSceneWordAssociations}</div>
            <div class="identify-metric-lbl">Planned Associations (${masterCoverage.averageObjectsPerScene} avg)</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:${masterCoverage.missingNounsCount === 0 ? 'var(--success)' : 'var(--danger)'};" data-testid="cms-cov-missing-nouns">${masterCoverage.missingNounsCount}</div>
            <div class="identify-metric-lbl">Missing Nouns from Plan</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val">${masterCoverage.nounsRepeatedAcrossScenesCount} / ${masterCoverage.nounsAppearingOnceCount}</div>
            <div class="identify-metric-lbl">Repeated / Single-Appearance</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val">${masterCoverage.foundationalCount} / ${masterCoverage.intermediateCount} / ${masterCoverage.specializedCount}</div>
            <div class="identify-metric-lbl">Foundational / Interm. / Spec.</div>
          </div>
          <div class="identify-metric-box">
            <div class="identify-metric-val" style="color:var(--warn);">${queueSummary.pilotScenesVerifiedCount} Pilots • 0 SVG</div>
            <div class="identify-metric-lbl">AI Queue (${queueSummary.pauseReason === 'quota_exhausted_free_tier' ? '429 Quota Gate' : 'Ready'})</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px; font-size:12px;">
          ${masterCoverage.topicGroupBreakdown
            .map(
              (g) => `
                <div style="padding:8px 10px; background:var(--surface-2); border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
                  <div style="font-weight:800; color:var(--text);">${escapeHtml(g.titleEn)}</div>
                  <div style="font-size:11px; color:var(--text-secondary);">
                    Scenes: <b>${g.actualSceneCount}/${g.targetSceneCount}</b> • Unique Nouns: <b>${g.uniqueNounsInGroup}</b> • Associations: <b>${g.totalAssociationsInGroup}</b>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>

        <div style="margin-top:10px; padding:9px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:11.5px; color:var(--text-secondary);">
          <b>🛡️ Safety Repair & AI Generation Queue Status:</b> Corrected <b>${masterCoverage.invalidSceneFlagsCorrectedCount}</b> invalid scene flags and <b>${masterCoverage.invalidTargetFlagsCorrectedCount}</b> synthetic 5×5 grid target flags. ${escapeHtml(queueSummary.freeTierProbeResult)} (Estimated Paid Cost if approved: <b>$${queueSummary.estimatedTotalPaidCostUsd.toFixed(2)} USD</b> for ${queueSummary.totalScenes} scenes; Procedural Substitutes: <b>${queueSummary.proceduralSubstitutesCount}</b>).
        </div>
      </div>
    `
    : '';

  return `
    <div data-testid="cms-identify-scene-manager-view">
      <!-- Header & Pilot Before/After Quick Switcher -->
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">
              STAGE F, G, H & 11 — 120-SCENE VISUAL VOCABULARY STUDIO & 2,000-NOUN COVERAGE DASHBOARD
            </div>
            <h2 style="margin:2px 0 4px 0; font-size:18px; font-weight:800;">
              🎯 Identify Scene Manager & Object Annotation Studio (120 Scenes • 2,520 Associations)
            </h2>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              Inspect, re-annotate, preview 5/8/10-question practice rounds or Explore Mode, and audit 2,000-noun coverage.
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-master-coverage"
              onclick="toggleCmsIdentifyMasterCoverageDashboard()"
            >
              📈 2,000-Noun Coverage Dashboard
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-scene-planner"
              onclick="toggleCmsIdentifyScenePlannerPanel()"
            >
              🧩 Scene Planner (${plannerResult.plannedScenes.length} Coherent Scenes)
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-bulk-audit"
              onclick="toggleCmsIdentifyBulkAuditPanel()"
            >
              📊 100-Scene Bulk Audit Report
            </button>
            <button
              type="button"
              class="btn"
              data-testid="cms-identify-btn-preview-exercise"
              onclick="handleCmsIdentifyPreviewInLearnerApp()"
            >
              ▶ Preview (8-Q Round)
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-preview-explore"
              onclick="handleCmsIdentifyPreviewInLearnerApp('explore')"
            >
              🔍 Preview Explore Mode
            </button>
          </div>
        </div>

        <!-- Pilot Before & After Quick Switcher -->
        <div style="margin-top:12px; padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:800; color:var(--text);">
            🔬 Pilot Scenes & Before/After Verification:
          </span>
          <button
            type="button"
            data-testid="cms-pilot-switch-pilot-1-kitchen"
            class="stage-pill ${scene.id === 'kitchen-scene-2' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('kitchen-scene-2')"
          >
            🍳 Pilot 1: Indoor Cabin Kitchen (21 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-pilot-2-park"
            class="stage-pill ${scene.id === 'park-garden-scene-2' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('park-garden-scene-2')"
          >
            🌹 Pilot 2: Outdoor Rose Garden (21 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-pilot-3-market"
            class="stage-pill ${scene.id === 'farmers-market-scene-1' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('farmers-market-scene-1')"
          >
            🍎 Pilot 3: Farmers Market Stall (20 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-pilot-a"
            class="stage-pill ${scene.id === 'beach-nature-scene-3-pilot-a' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('beach-nature-scene-3-pilot-a')"
          >
            🏖️ Pilot Scene A: Sunny Sea Beach (8 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-pilot-b"
            class="stage-pill ${scene.id === 'beach-nature-scene-3-pilot-b' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('beach-nature-scene-3-pilot-b')"
          >
            🏔️ Pilot Scene B: Alpine Mountain Lake (5 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-verified-photo"
            class="stage-pill ${scene.id === 'beach-nature-scene-3-verified-photo' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('beach-nature-scene-3-verified-photo')"
          >
            📷 Verified Original Photo (4 Objects)
          </button>
          <button
            type="button"
            data-testid="cms-pilot-switch-defective-baseline"
            class="stage-pill ${scene.id === 'beach-nature-scene-3' ? 'active' : ''}"
            onclick="selectCmsIdentifyScene('beach-nature-scene-3')"
          >
            ⚠️ Original Defective Scene (Before Fix — 9 Grid Targets)
          </button>
        </div>
      </div>

      ${masterCoverageHtml}

      ${statusBannerHtml}


      ${
        identifyStudioUiState.showScenePlannerPanel
          ? `
            <div class="card" data-testid="cms-identify-planner-panel" style="padding:16px; margin-bottom:14px; border:2px solid var(--accent);">
              <h3 style="margin:0 0 6px 0; font-size:16px; font-weight:800;">
                🧩 Intelligent Scene Planner: Resolving Incompatible Vocabulary in "Rocky Shore & Mountain Lake"
              </h3>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:10px;">
                ${plannerResult.incompatibilityReasonsEn.map((r) => `<div>• ${escapeHtml(r)}</div>`).join('')}
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
                ${plannerResult.plannedScenes
                  .map(
                    (plan) => `
                      <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                        <div style="font-weight:800; font-size:14px; color:var(--text);">
                          ${escapeHtml(plan.proposedTitleEn)} (${plan.targetCount} Objects)
                        </div>
                        <div style="font-size:12px; color:var(--accent); font-weight:700; margin-top:2px;">
                          ${escapeHtml(plan.proposedTitleUk)}
                        </div>
                        <div style="font-size:12px; color:var(--text-secondary); margin-top:6px;">
                          ${escapeHtml(plan.rationaleEn)}
                        </div>
                        <div style="margin-top:8px; display:flex; gap:5px; flex-wrap:wrap;">
                          ${plan.vocabularyItems
                            .map(
                              (v) =>
                                `<span class="tag" style="font-size:11px;"><b>${escapeHtml(v.uk)}</b> (${escapeHtml(v.en)})</span>`
                            )
                            .join('')}
                        </div>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          `
          : ''
      }

      ${
        bulkAudit
          ? `
            <div class="card" data-testid="cms-identify-bulk-audit-panel" style="padding:16px; margin-bottom:14px; border:2px solid var(--warn);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                <h3 style="margin:0; font-size:16px; font-weight:800;">
                  📊 Bulk Audit of All ${bulkAudit.totalScenesInspected} Identify Scenes (${bulkAudit.totalCategoriesInspected} Categories)
                </h3>
                <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="toggleCmsIdentifyBulkAuditPanel(false)">✕ Close Audit</button>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:8px; margin-bottom:12px;">
                <div class="identify-metric-box">
                  <div class="identify-metric-val">${bulkAudit.totalScenesInspected}</div>
                  <div class="identify-metric-lbl">Total Scenes Audited</div>
                </div>
                <div class="identify-metric-box">
                  <div class="identify-metric-val" style="color:var(--danger);">${bulkAudit.scenesUsingGridPlacement}</div>
                  <div class="identify-metric-lbl">Using Fixed 3×3 Grid Slots</div>
                </div>
                <div class="identify-metric-box">
                  <div class="identify-metric-val" style="color:var(--warn);">${bulkAudit.scenesWithPhotoOverrides}</div>
                  <div class="identify-metric-lbl">Kitchen Photo Overrides</div>
                </div>
                <div class="identify-metric-box">
                  <div class="identify-metric-val" style="color:var(--danger);">${bulkAudit.scenesWithSemanticMismatches}</div>
                  <div class="identify-metric-lbl">Env / Word Mismatches</div>
                </div>
                <div class="identify-metric-box">
                  <div class="identify-metric-val" style="color:var(--success);">${bulkAudit.pilotCorrectedSceneIds.length}</div>
                  <div class="identify-metric-lbl">Verified Pilot Drafts</div>
                </div>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); max-height:210px; overflow-y:auto; border-top:1px solid var(--border-subtle); padding-top:8px;">
                ${bulkAudit.entries
                  .slice(0, 15)
                  .map(
                    (e) => `
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--border-subtle);">
                        <span><b>${escapeHtml(e.sceneId)}</b> — ${escapeHtml(e.titleEn)} (${e.assignedTargetCount} targets)</span>
                        <span style="color:${e.usesLegacyGridSlots ? 'var(--danger)' : 'var(--warn)'}; font-weight:700;">
                          ${e.usesLegacyGridSlots ? 'Grid Coordinates • Needs Re-annotation' : 'Photo Override • Human Review'}
                        </span>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          `
          : ''
      }

      <div class="cms-three-col-grid">
        <!-- LEFT COLUMN: Scene Browser & Filters -->
        <div class="card" style="padding:14px;">
          <div style="font-size:13px; font-weight:800; margin-bottom:8px;">
            1. Browse Identify Scenes (${filteredScenes.length})
          </div>

          <input
            type="search"
            data-testid="cms-identify-search-input"
            class="input-box"
            style="width:100%; min-height:34px; font-size:12.5px; margin-bottom:8px;"
            placeholder="Search scene or object word..."
            value="${escapeHtml(identifyStudioUiState.searchQuery)}"
            oninput="setCmsIdentifyFilter('search', this.value)"
          />

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
            <select
              aria-label="Filter by category"
              class="input-box"
              style="min-height:34px; font-size:12px;"
              onchange="setCmsIdentifyFilter('category', this.value)"
            >
              <option value="all" ${identifyStudioUiState.categoryFilter === 'all' ? 'selected' : ''}>All 20 Categories</option>
              ${IDENTIFY_CATEGORIES.map(
                (c) =>
                  `<option value="${c.id}" ${identifyStudioUiState.categoryFilter === c.id ? 'selected' : ''}>${c.number}. ${escapeHtml(c.titleEn)}</option>`
              ).join('')}
            </select>

            <select
              aria-label="Filter by quality state"
              class="input-box"
              style="min-height:34px; font-size:12px;"
              onchange="setCmsIdentifyFilter('quality', this.value)"
            >
              <option value="all" ${identifyStudioUiState.qualityFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="pilot" ${identifyStudioUiState.qualityFilter === 'pilot' ? 'selected' : ''}>Pilot Scene 3 Variants</option>
              <option value="validated_ready" ${identifyStudioUiState.qualityFilter === 'validated_ready' ? 'selected' : ''}>Validated Ready</option>
              <option value="invalid_defective" ${identifyStudioUiState.qualityFilter === 'invalid_defective' ? 'selected' : ''}>Needs Fix / Grid</option>
            </select>
          </div>

          <div style="max-height:500px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
            ${filteredScenes
              .slice(0, 35)
              .map((s) => {
                const rep = validateIdentifySceneQuality(getOrCreateIdentifySceneDraft(s.id).scene);
                const isSelected = s.id === scene.id;
                const badgeText = rep.canPublish ? '✓ Verified' : `${rep.findings.length} Issues`;
                return `
                  <button
                    type="button"
                    data-testid="cms-identify-scene-item-${escapeHtml(s.id)}"
                    class="btn ${isSelected ? '' : 'btn-sec'}"
                    style="justify-content:space-between; text-align:left; min-height:42px; padding:7px 10px; font-size:12px;"
                    onclick="selectCmsIdentifyScene('${escapeHtml(s.id)}')"
                  >
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                      <b>${escapeHtml(s.titleEn)}</b>
                      <br/>
                      <span style="font-size:10.5px; opacity:0.85;">${escapeHtml(s.id)} • ${s.targets.length} objects</span>
                    </span>
                    <span class="tag" style="font-size:10px; flex-shrink:0;">${badgeText}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- CENTER COLUMN: Visual Annotation Canvas & Action Toolbar -->
        <div class="card" style="padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <div>
              <h3 style="margin:0; font-size:15.5px; font-weight:800;">
                2. Visual Annotation Editor: ${escapeHtml(scene.titleEn)}
              </h3>
              <div style="font-size:11.5px; color:var(--text-secondary);">
                Click any numbered marker to select an object, or click on the picture to move the active marker directly onto the object.
              </div>
            </div>
            <span class="tag" style="background:${
              report.canPublish ? 'var(--success-container)' : 'var(--danger-container)'
            }; color:${
              report.canPublish ? 'var(--success-on-container)' : 'var(--danger-on-container)'
            }; font-weight:800;">
              ${report.canPublish ? '✅ Validated Ready' : `⚠️ ${report.findings.length} Quality Issue(s)`}
            </span>
          </div>

          <!-- Beginner-Friendly Action Toolbar (Section 23) -->
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; padding:8px; background:var(--surface-2); border-radius:var(--radius-sm);">
            <button
              type="button"
              class="stage-pill ${identifyStudioUiState.clickToolMode === 'select_object' ? 'active' : ''}"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="setCmsIdentifyFilter('tool', 'select_object')"
            >
              👆 Select Object
            </button>
            <button
              type="button"
              class="stage-pill ${identifyStudioUiState.clickToolMode === 'move_marker' ? 'active' : ''}"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="setCmsIdentifyFilter('tool', 'move_marker')"
            >
              📍 Move Marker
            </button>
            <button
              type="button"
              class="stage-pill ${identifyStudioUiState.clickToolMode === 'adjust_area' ? 'active' : ''}"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="setCmsIdentifyFilter('tool', 'adjust_area')"
            >
              📐 Adjust Target Area
            </button>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="handleCmsIdentifyAddTarget()"
            >
              + Add Object
            </button>
            <button
              type="button"
              class="btn btn-warn"
              data-testid="cms-identify-btn-object-missing"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="handleCmsIdentifyMarkTargetMissing()"
            >
              🚫 Object Missing
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-check-scene"
              style="min-height:32px; padding:4px 10px; font-size:11.5px;"
              onclick="handleCmsIdentifyCheckScene()"
            >
              🔍 Check Scene
            </button>
          </div>

          <!-- Interactive Scene Canvas -->
          <div
            id="cms-identify-annotation-canvas"
            data-testid="cms-identify-annotation-canvas"
            onclick="handleCmsIdentifyCanvasClick(event)"
            style="position:relative; width:100%; aspect-ratio:4 / 3; border-radius:var(--radius-sm); overflow:hidden; border:2px solid var(--border-strong); background:#0f172a; cursor:crosshair; user-select:none;"
          >
            <img
              src="${escapeHtml(scene.assetPath)}"
              alt="${escapeHtml(scene.titleEn)}"
              style="width:100%; height:100%; object-fit:fill; display:block; pointer-events:none;"
            />
            ${canvasMarkersHtml}
          </div>

          <!-- Object Target Selector Strip -->
          <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
            ${scene.targets
              .map(
                (t) => `
                  <button
                    type="button"
                    data-testid="cms-identify-chip-${escapeHtml(t.id)}"
                    class="stage-pill ${t.id === activeTarget?.id ? 'active' : ''}"
                    style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                    onclick="selectCmsIdentifyTarget('${escapeHtml(t.id)}')"
                  >
                    #${t.targetNumber} ${escapeHtml(t.en)} (${escapeHtml(t.uk)})
                  </button>
                `
              )
              .join('')}
          </div>

          <!-- Missing Vocabulary Notice (if any objects were flagged as missing in the picture) -->
          ${
            scene.missingVocabularyItems && scene.missingVocabularyItems.length > 0
              ? `
                <div data-testid="cms-identify-missing-vocab-box" style="margin-top:10px; padding:10px 12px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-sm); font-size:12px;">
                  <b>🚫 Vocabulary Words Flagged as Missing in This Picture (${scene.missingVocabularyItems.length}):</b>
                  <ul style="margin:4px 0 0 18px; padding:0;">
                    ${scene.missingVocabularyItems
                      .map(
                        (m) =>
                          `<li><b>${escapeHtml(m.en)} (${escapeHtml(m.uk)})</b> — ${escapeHtml(m.reasonEn)}</li>`
                      )
                      .join('')}
                  </ul>
                </div>
              `
              : ''
          }

          <!-- Scene Quality Checker Findings List -->
          <div style="margin-top:12px; border-top:1px solid var(--border-subtle); padding-top:10px;">
            <div style="font-size:12.5px; font-weight:800; margin-bottom:6px;">
              🔍 Scene Quality Checker (${report.findings.length} Finding${report.findings.length === 1 ? '' : 's'})
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; font-size:11px;">
              <span class="tag">Structural: ${report.structuralValid ? '✓ Pass' : '✗ Fail'}</span>
              <span class="tag">Visual Verification: ${report.visuallyVerified ? '✓ Verified' : '✗ Unverified'}</span>
              <span class="tag">Human Review: ${report.humanReviewCompleted ? '✓ Complete' : '⏳ Pending'}</span>
            </div>
            ${
              report.findings.length === 0
                ? `<div data-testid="cms-identify-quality-pass" style="padding:10px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700;">
                    ✅ Every target marker in this scene sits on a clearly visible object with zero overlapping boxes or missing items.
                  </div>`
                : `<div data-testid="cms-identify-quality-findings" style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto;">
                    ${report.findings
                      .map(
                        (f) => `
                          <div style="padding:8px 10px; background:var(--surface-2); border-left:4px solid ${
                            f.severity === 'error' ? 'var(--danger)' : 'var(--warn)'
                          }; border-radius:var(--radius-xs); font-size:12px;">
                            <div style="font-weight:800; color:var(--text);">
                              ${escapeHtml(f.userFriendlyMessageEn)}
                            </div>
                            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                              [${escapeHtml(f.tier)}] ${escapeHtml(f.technicalDetailEn)}
                            </div>
                          </div>
                        `
                      )
                      .join('')}
                  </div>`
            }
          </div>
        </div>

        <!-- RIGHT COLUMN: Selected Object Properties, Multilingual Track Preview & Save/Publish -->
        <div class="card" style="padding:14px;">
          <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:800;">
            3. Object Marker & Vocabulary Settings
          </h3>

          ${
            activeTarget
              ? `
                <div style="display:flex; flex-direction:column; gap:9px;">
                  <div>
                    <label for="cms-id-select-vocab" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">
                      Choose Vocabulary Word (#${activeTarget.targetNumber})
                    </label>
                    <select
                      id="cms-id-select-vocab"
                      data-testid="cms-id-select-vocab"
                      class="input-box"
                      style="width:100%; min-height:36px; font-size:12.5px; font-weight:700;"
                      onchange="handleCmsIdentifySaveGeometryInputs()"
                    >
                      ${cat.coreVocab
                        .map(
                          (v) =>
                            `<option value="${escapeHtml(v.vocabularyId)}" ${
                              v.vocabularyId === activeTarget.vocabularyId ? 'selected' : ''
                            }>${escapeHtml(v.en)} — ${escapeHtml(v.uk)}</option>`
                        )
                        .join('')}
                    </select>
                  </div>

                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <div>
                      <label for="cms-id-input-cx" style="font-size:11px; font-weight:800; color:var(--text-secondary); display:block;">Marker Pin X (%)</label>
                      <input
                        id="cms-id-input-cx"
                        data-testid="cms-id-input-cx"
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        class="input-box"
                        style="width:100%; min-height:34px; font-size:12.5px;"
                        value="${(((activeTarget.centerX ?? activeTarget.x + activeTarget.width / 2) * 100)).toFixed(1)}"
                      />
                    </div>
                    <div>
                      <label for="cms-id-input-cy" style="font-size:11px; font-weight:800; color:var(--text-secondary); display:block;">Marker Pin Y (%)</label>
                      <input
                        id="cms-id-input-cy"
                        data-testid="cms-id-input-cy"
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        class="input-box"
                        style="width:100%; min-height:34px; font-size:12.5px;"
                        value="${(((activeTarget.centerY ?? activeTarget.y + activeTarget.height / 2) * 100)).toFixed(1)}"
                      />
                    </div>
                  </div>

                  <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:6px;">
                    <div>
                      <label for="cms-id-input-x" style="font-size:10.5px; font-weight:800; color:var(--text-secondary); display:block;">Box X%</label>
                      <input id="cms-id-input-x" type="number" step="1" min="0" max="98" class="input-box" style="width:100%; min-height:32px; font-size:11.5px; padding:4px 6px;" value="${(activeTarget.x * 100).toFixed(1)}" />
                    </div>
                    <div>
                      <label for="cms-id-input-y" style="font-size:10.5px; font-weight:800; color:var(--text-secondary); display:block;">Box Y%</label>
                      <input id="cms-id-input-y" type="number" step="1" min="0" max="98" class="input-box" style="width:100%; min-height:32px; font-size:11.5px; padding:4px 6px;" value="${(activeTarget.y * 100).toFixed(1)}" />
                    </div>
                    <div>
                      <label for="cms-id-input-w" style="font-size:10.5px; font-weight:800; color:var(--text-secondary); display:block;">Width%</label>
                      <input id="cms-id-input-w" type="number" step="1" min="4" max="95" class="input-box" style="width:100%; min-height:32px; font-size:11.5px; padding:4px 6px;" value="${(activeTarget.width * 100).toFixed(1)}" />
                    </div>
                    <div>
                      <label for="cms-id-input-h" style="font-size:10.5px; font-weight:800; color:var(--text-secondary); display:block;">Height%</label>
                      <input id="cms-id-input-h" type="number" step="1" min="4" max="95" class="input-box" style="width:100%; min-height:32px; font-size:11.5px; padding:4px 6px;" value="${(activeTarget.height * 100).toFixed(1)}" />
                    </div>
                  </div>

                  <!-- Quick Nudge Controls -->
                  <div style="display:flex; gap:4px; flex-wrap:wrap;">
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(-2, 0)">← Left</button>
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(2, 0)">Right →</button>
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(0, -2)">↑ Up</button>
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(0, 2)">↓ Down</button>
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(0, 0, 2, 2)">+ Larger Area</button>
                    <button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11px;" onclick="handleCmsIdentifyNudgeTarget(0, 0, -2, -2)">- Smaller Area</button>
                  </div>

                  <div>
                    <label for="cms-id-input-sense" style="font-size:11px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:2px;">
                      Verified Visual Sense Description
                    </label>
                    <input
                      id="cms-id-input-sense"
                      type="text"
                      class="input-box"
                      style="width:100%; min-height:34px; font-size:12px;"
                      value="${escapeHtml(activeTarget.verifiedLexicalSense || activeTarget.en)}"
                    />
                  </div>

                  <button
                    type="button"
                    class="btn"
                    data-testid="cms-identify-btn-save-draft"
                    onclick="handleCmsIdentifySaveGeometryInputs()"
                  >
                    💾 Save Draft
                  </button>
                </div>
              `
              : '<div style="font-size:12.5px; color:var(--text-secondary);">No active targets in this scene. Click "+ Add Object" to add one.</div>'
          }

          <!-- Replace / Select Scene Picture Asset -->
          <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle);">
            <label for="cms-id-select-asset" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">
              🖼️ Scene Image Asset (Manual Upload / Verified Scene Selection):
            </label>
            <select
              id="cms-id-select-asset"
              class="input-box"
              style="width:100%; min-height:34px; font-size:12px;"
              onchange="handleCmsIdentifyChangeAssetPath(this.value)"
            >
              <option value="${escapeHtml(scene.assetPath)}" selected>Current: ${escapeHtml(scene.assetPath)}</option>
              <option value="/assets/identify/pilot/beach-nature-pilot-a.svg">Verified Pilot A: Sunny Sea Coast & Beach Towel (.svg)</option>
              <option value="/assets/identify/pilot/beach-nature-pilot-b.svg">Verified Pilot B: Alpine Mountain Lake & Pine Shore (.svg)</option>
              <option value="/assets/identify/beach-nature/beach-nature_03.webp">Original Photo: beach-nature_03.webp</option>
              <option value="/assets/identify/beach-nature/beach-nature_01.webp">Photo: beach-nature_01.webp</option>
              <option value="/assets/identify/beach-nature/beach-nature_02.webp">Photo: beach-nature_02.webp</option>
            </select>
          </div>

          <!-- Multilingual 28-Course Track Adaptation Preview -->
          <div style="margin-top:12px; padding:10px; background:var(--surface-2); border-radius:var(--radius-sm);">
            <label for="cms-id-select-track" style="font-size:11px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">
              🌐 Multilingual Track Adaptation (28 Course Tracks):
            </label>
            <select
              id="cms-id-select-track"
              data-testid="cms-id-select-track"
              class="input-box"
              style="width:100%; min-height:32px; font-size:11.5px; margin-bottom:6px;"
              onchange="setCmsIdentifyFilter('track', this.value)"
            >
              ${getAllCourseTracks().map(
                (tr) =>
                  `<option value="${tr.trackId}" ${
                    tr.trackId === identifyStudioUiState.selectedTrackId ? 'selected' : ''
                  }>${escapeHtml(tr.courseTitle)} (${tr.trackId})</option>`
              ).join('')}
            </select>
            ${
              adaptedTrackTarget
                ? `<div style="font-size:11.5px; color:var(--text);">
                    <div><b>Clue (${adaptedTrackTarget.sourceLanguageCode.toUpperCase()}):</b> ${escapeHtml(adaptedTrackTarget.sourceClueText)}</div>
                    <div><b>Target Answer (${adaptedTrackTarget.targetLanguageCode.toUpperCase()}):</b> ${escapeHtml(adaptedTrackTarget.expectedTargetWord)}</div>
                  </div>`
                : ''
            }
          </div>

          <!-- Draft Undo, Restore Baseline & Publish Controls -->
          <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle); display:flex; gap:6px; flex-wrap:wrap;">
            <button
              type="button"
              class="btn btn-sec"
              style="flex:1; min-height:34px; font-size:12px;"
              onclick="handleCmsIdentifyUndoDraft()"
            >
              ↩ Undo (${draftRecord.undoStack.length})
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-identify-btn-restore"
              style="flex:1; min-height:34px; font-size:12px;"
              onclick="handleCmsIdentifyRestoreBaseline()"
            >
              ⏪ Restore
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-testid="cms-identify-btn-publish"
              style="width:100%; min-height:38px; font-size:13px;"
              onclick="handleCmsIdentifyPublishScene()"
            >
              🚀 Publish Verified Scene
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  Object.assign(window, {
    toggleCmsIdentifyMasterCoverageDashboard,
  });
}

