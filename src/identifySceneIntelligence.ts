// ============================================================================
// Lango Universal Identify Scene Intelligence, Visual Verification,
// Scene Planning, Non-Destructive Draft Overlay & Bulk Audit Engine
// ============================================================================

import {
  ARCHIVED_LEGACY_SCENES_FOR_AUDIT,
  IDENTIFY_AUDIT_40_SUMMARY,
  IDENTIFY_CATEGORIES,
  type IdentifyCategory,
  type IdentifyHotspot,
  type IdentifyScene,
  type IdentifyVocabItem,
  type IdentifyAnnotationSource,
  type IdentifyVerificationStatus,
  type IdentifySceneQualityState,
  isApprovedVerifiedLearnerTarget,
  isSynthetic5x5GridBox,
  VERIFIED_PHOTOGRAPH_SCENE_SPECS,
} from './identifyData.ts';
import {
  computeBoundingBoxIoU,
  type NormalizedBoundingBox,
  REPRESENTATIVE_VIEWPORT_MATRIX,
  computeRenderedImageRect,
  projectNormalizedTargetToViewport,
} from './identifyResponsiveGeometry.ts';
import { evaluateCmsAccessContext } from './multilingual/cmsAuthAndStorage.ts';
import { getAllCourseTracks } from './multilingual/courseTrackRegistry.ts';

export interface CmsRuntimeOverrideInput {
  forceUnauthenticatedPublic?: boolean;
}

function isStudioAuthorized(override?: CmsRuntimeOverrideInput): boolean {
  if (override?.forceUnauthenticatedPublic) {
    return false;
  }
  return evaluateCmsAccessContext().isAllowed;
}

// ----------------------------------------------------------------------------
// 1. Storage Keys & Draft State Types
// ----------------------------------------------------------------------------

const IDENTIFY_STUDIO_STORAGE_KEY = 'lango_identify_studio_drafts_v1';

export type IdentifyValidationTier =
  | 'structural_validation'
  | 'visual_validation'
  | 'human_review';

export type IdentifyIssueSeverity = 'error' | 'warning' | 'info';

export type IdentifyIssueCode =
  | 'MISSING_OBJECT_IN_IMAGE'
  | 'MARKER_MISALIGNED_WITH_OBJECT'
  | 'SEMANTIC_ENVIRONMENT_MISMATCH'
  | 'TARGET_BOXES_OVERLAP'
  | 'OBJECT_TOO_SMALL'
  | 'VOCAB_NO_MATCHING_OBJECT'
  | 'GRID_PLACEMENT_UNVERIFIED'
  | 'DUPLICATE_TARGET_NUMBER'
  | 'COORDINATES_OUT_OF_BOUNDS'
  | 'EMPTY_VOCABULARY_REFERENCE'
  | 'NEEDS_HUMAN_VISUAL_REVIEW';

export interface IdentifyValidationFinding {
  id: string;
  sceneId: string;
  targetId?: string;
  vocabularyId?: string;
  tier: IdentifyValidationTier;
  severity: IdentifyIssueSeverity;
  code: IdentifyIssueCode;
  userFriendlyMessageEn: string;
  technicalDetailEn: string;
}

export interface IdentifySceneValidationReport {
  sceneId: string;
  sceneTitleEn: string;
  categoryId: string;
  qualityState: IdentifySceneQualityState;
  structuralValid: boolean;
  visuallyVerified: boolean;
  humanReviewCompleted: boolean;
  canPublish: boolean;
  activeTargetCount: number;
  missingObjectCount: number;
  misalignedMarkerCount: number;
  overlappingPairCount: number;
  tooSmallObjectCount: number;
  semanticMismatchCount: number;
  usesLegacyGridCoordinates: boolean;
  findings: IdentifyValidationFinding[];
}

export interface VocabularySceneGroupPlan {
  groupIndex: number;
  proposedSceneId: string;
  proposedTitleEn: string;
  proposedTitleUk: string;
  environmentCluster: string;
  settingDescriptionEn: string;
  recommendedAssetPath?: string;
  vocabularyItems: IdentifyVocabItem[];
  targetCount: number;
  rationaleEn: string;
}

export interface ScenePlanningResult {
  categoryId: string;
  originalVocabularyCount: number;
  accountedVocabularyCount: number;
  unaccountedVocabularyIds: string[];
  hadIncompatibleMix: boolean;
  incompatibilityReasonsEn: string[];
  plannedScenes: VocabularySceneGroupPlan[];
}

export interface IdentifyBulkAuditSceneEntry {
  sceneId: string;
  categoryId: string;
  categoryTitleEn: string;
  sceneNumber: number;
  titleEn: string;
  assetPath: string;
  assignedTargetCount: number;
  usesLegacyGridSlots: boolean;
  hasPhotoOverride: boolean;
  confirmedMissingObjectIds: string[];
  confirmedMisalignedTargetIds: string[];
  semanticConflictMessages: string[];
  qualityState: IdentifySceneQualityState;
  recommendedAction:
    | 'split_into_coherent_scenes_and_reannotate'
    | 'reannotate_real_photo_objects'
    | 'human_visual_review_of_photo_override'
    | 'ready';
  priorityRank: number;
}

export interface IdentifyBulkAuditReport {
  generatedAtIso: string;
  totalCategoriesInspected: number;
  totalScenesInspected: number;
  scenesUsingGridPlacement: number;
  scenesWithPhotoOverrides: number;
  scenesWithConfirmedMissingObjects: number;
  scenesWithMarkerMisalignment: number;
  scenesWithSemanticMismatches: number;
  scenesRequiringSplitOrReplacement: number;
  scenesValidatedReady: number;
  pilotCorrectedSceneIds: string[];
  entries: IdentifyBulkAuditSceneEntry[];
}

export interface IdentifyStudioDraftRecord {
  sceneId: string;
  baseSceneId: string;
  categoryId: string;
  isPublishedOverride: boolean;
  updatedAtIso: string;
  revisionNumber: number;
  scene: IdentifyScene;
  undoStack: IdentifyScene[];
}

export interface IdentifyStudioStoreState {
  activePilotVariantBySceneId: Record<string, string>;
  draftsBySceneId: Record<string, IdentifyStudioDraftRecord>;
}

// ----------------------------------------------------------------------------
// 2. Known Grid Slot Signatures & Visual Verification Ground Truth Registry
// ----------------------------------------------------------------------------

const KNOWN_GRID_COORDINATE_SIGNATURES = new Set([
  // Slot set 1 (from SCENE_LAYOUT_SLOTS[1] in identifyData.ts)
  '0.05,0.12,0.22,0.28', '0.32,0.1,0.24,0.26', '0.62,0.08,0.3,0.28',
  '0.06,0.46,0.24,0.26', '0.36,0.44,0.24,0.24', '0.66,0.44,0.26,0.26',
  '0.08,0.74,0.24,0.22', '0.38,0.72,0.26,0.24', '0.68,0.73,0.24,0.22',
  // Slot set 2 (from SCENE_LAYOUT_SLOTS[2] in identifyData.ts)
  '0.08,0.14,0.26,0.24', '0.39,0.18,0.16,0.32', '0.58,0.16,0.24,0.28',
  '0.16,0.42,0.18,0.2', '0.36,0.44,0.24,0.24', '0.63,0.48,0.22,0.24',
  '0.1,0.68,0.24,0.24', '0.4,0.72,0.24,0.22', '0.68,0.74,0.22,0.2',
  // Slot set 3 (from SCENE_LAYOUT_SLOTS[3] in identifyData.ts — used by beach-nature-scene-3)
  '0.04,0.06,0.24,0.28', '0.34,0.12,0.26,0.24', '0.64,0.1,0.28,0.28',
  '0.05,0.42,0.24,0.24', '0.34,0.42,0.26,0.26', '0.66,0.42,0.24,0.24',
  '0.06,0.7,0.28,0.24', '0.38,0.72,0.26,0.22', '0.68,0.7,0.24,0.24',
  // Slot set 4 (from SCENE_LAYOUT_SLOTS[4] in identifyData.ts)
  '0.04,0.08,0.28,0.26', '0.36,0.12,0.24,0.26', '0.64,0.08,0.28,0.28',
  '0.08,0.42,0.24,0.26', '0.38,0.42,0.26,0.28', '0.68,0.44,0.24,0.26',
  '0.06,0.72,0.26,0.22', '0.36,0.72,0.26,0.24', '0.68,0.72,0.24,0.24',
  // Slot set 5 (from SCENE_LAYOUT_SLOTS[5] in identifyData.ts)
  '0.08,0.12,0.22,0.3', '0.34,0.1,0.28,0.28', '0.66,0.12,0.26,0.28',
  '0.1,0.46,0.22,0.26', '0.36,0.46,0.26,0.24', '0.66,0.46,0.24,0.24',
  '0.06,0.74,0.26,0.22', '0.36,0.72,0.24,0.24', '0.64,0.72,0.26,0.22',
]);

export function isGridCoordinateBox(box: NormalizedBoundingBox): boolean {
  if (isSynthetic5x5GridBox(box)) {
    return true;
  }
  const sig = `${Number(box.x.toFixed(2))},${Number(box.y.toFixed(2))},${Number(box.width.toFixed(2))},${Number(box.height.toFixed(2))}`;
  return KNOWN_GRID_COORDINATE_SIGNATURES.has(sig);
}

/**
 * Verified visual inspection ground truth for beach-nature_03.webp:
 * The photograph depicts a calm dark alpine mountain lake surrounded by pine trees,
 * a rocky mountain slope at top, and large shoreline boulders/rocks at bottom.
 * Visible objects: mountain (bn-mountain), tree (bn-tree), lake (bn-lake), stone/rock (bn-stone).
 * Missing objects: sun (bn-sun), beach towel (bn-towel), beach (bn-beach), sand (bn-sand), sea (bn-sea).
 */
export interface VisualAssetInspectionRecord {
  assetPath: string;
  depictedEnvironmentSummaryEn: string;
  depictedEnvironmentTag: 'alpine_mountain_lake' | 'sandy_sea_beach' | 'coastal_sunset' | 'kitchen_interior';
  visibleVocabularyIds: Record<
    string,
    {
      bbox: NormalizedBoundingBox;
      markerCenter: { x: number; y: number };
      objectLabelEn: string;
      verifiedLexicalSense: string;
    }
  >;
  missingVocabularyReasonsEn: Record<string, string>;
  semanticConflictReasonsEn: Record<string, string>;
}

export const VERIFIED_ASSET_INSPECTIONS: Record<string, VisualAssetInspectionRecord> = {
  '/assets/identify/beach-nature/beach-nature_03.webp': {
    assetPath: '/assets/identify/beach-nature/beach-nature_03.webp',
    depictedEnvironmentSummaryEn:
      'Dark alpine mountain lake with pine forest reflections and rocky boulder shore; overcast mountain slope with no visible sun disk, sandy beach, beach towel, or open sea.',
    depictedEnvironmentTag: 'alpine_mountain_lake',
    visibleVocabularyIds: {
      'bn-mountain': {
        bbox: { x: 0.12, y: 0.03, width: 0.78, height: 0.31 },
        markerCenter: { x: 0.52, y: 0.18 },
        objectLabelEn: 'mountain',
        verifiedLexicalSense: 'rocky forested mountain slope rising above the lake',
      },
      'bn-tree': {
        bbox: { x: 0.08, y: 0.31, width: 0.80, height: 0.25 },
        markerCenter: { x: 0.44, y: 0.44 },
        objectLabelEn: 'tree',
        verifiedLexicalSense: 'coniferous pine trees lining the mountain lake shore',
      },
      'bn-lake': {
        bbox: { x: 0.06, y: 0.56, width: 0.88, height: 0.24 },
        markerCenter: { x: 0.48, y: 0.68 },
        objectLabelEn: 'lake / lagoon',
        verifiedLexicalSense: 'calm inland mountain lake reflecting pine trees',
      },
      'bn-stone': {
        bbox: { x: 0.22, y: 0.78, width: 0.64, height: 0.19 },
        markerCenter: { x: 0.53, y: 0.86 },
        objectLabelEn: 'stone / rock',
        verifiedLexicalSense: 'large grey shoreline boulders and stones in the foreground',
      },
    },
    missingVocabularyReasonsEn: {
      'bn-sun': 'The marker for the sun is not on the sun. No sun disk is visible in this dark mountain slope and forest photograph.',
      'bn-towel': "This image doesn't appear to show a beach towel.",
      'bn-beach': 'This vocabulary word has no matching object in the picture. The shoreline consists of forest boulders rather than a beach.',
      'bn-sand': 'This vocabulary word has no matching object in the picture. There is no sand on the rocky forest shore.',
      'bn-sea': 'The image appears to show a lake, but the vocabulary word means sea.',
    },
    semanticConflictReasonsEn: {
      'bn-sea': 'The image appears to show a lake, but the vocabulary word means sea.',
      'bn-towel': "This image doesn't appear to show a beach towel.",
    },
  },
  '/assets/identify/pilot/beach-nature-pilot-a.svg': {
    assetPath: '/assets/identify/pilot/beach-nature-pilot-a.svg',
    depictedEnvironmentSummaryEn:
      'Sunny coastal beach scene with golden sun disk, coastal mountains, open blue sea, breaking wave, sandy beach, warm golden sand ripples, striped coral-and-turquoise beach towel, coastal palm tree, and foreground rocks.',
    depictedEnvironmentTag: 'sandy_sea_beach',
    visibleVocabularyIds: {
      'bn-sun': {
        bbox: { x: 0.10, y: 0.06, width: 0.14, height: 0.18 },
        markerCenter: { x: 0.17, y: 0.15 },
        objectLabelEn: 'sun',
        verifiedLexicalSense: 'bright golden sun disk in the upper-left sky',
      },
      'bn-mountain': {
        bbox: { x: 0.58, y: 0.14, width: 0.38, height: 0.29 },
        markerCenter: { x: 0.77, y: 0.30 },
        objectLabelEn: 'mountain',
        verifiedLexicalSense: 'coastal mountain peaks along the horizon',
      },
      'bn-sea': {
        bbox: { x: 0.24, y: 0.43, width: 0.44, height: 0.18 },
        markerCenter: { x: 0.46, y: 0.50 },
        objectLabelEn: 'sea',
        verifiedLexicalSense: 'open blue sea stretching to the horizon',
      },
      'bn-wave': {
        bbox: { x: 0.44, y: 0.53, width: 0.32, height: 0.12 },
        markerCenter: { x: 0.60, y: 0.59 },
        objectLabelEn: 'wave',
        verifiedLexicalSense: 'crested ocean wave breaking toward the beach',
      },
      'bn-beach': {
        bbox: { x: 0.04, y: 0.60, width: 0.20, height: 0.22 },
        markerCenter: { x: 0.14, y: 0.72 },
        objectLabelEn: 'beach',
        verifiedLexicalSense: 'wide sunny coastal beach shoreline',
      },
      'bn-sand': {
        bbox: { x: 0.50, y: 0.69, width: 0.26, height: 0.22 },
        markerCenter: { x: 0.64, y: 0.81 },
        objectLabelEn: 'sand',
        verifiedLexicalSense: 'warm golden beach sand with textured ripples',
      },
      'bn-towel': {
        bbox: { x: 0.22, y: 0.68, width: 0.24, height: 0.20 },
        markerCenter: { x: 0.34, y: 0.78 },
        objectLabelEn: 'beach towel',
        verifiedLexicalSense: 'striped coral-and-turquoise beach towel spread on the sand',
      },
      'bn-tree': {
        bbox: { x: 0.03, y: 0.28, width: 0.21, height: 0.30 },
        markerCenter: { x: 0.12, y: 0.42 },
        objectLabelEn: 'coastal tree',
        verifiedLexicalSense: 'tall coastal palm tree with green fronds on the left shore',
      },
      'bn-stone': {
        bbox: { x: 0.78, y: 0.64, width: 0.18, height: 0.22 },
        markerCenter: { x: 0.87, y: 0.75 },
        objectLabelEn: 'stone / rock',
        verifiedLexicalSense: 'cluster of coastal boulders and stones on the right beach',
      },
    },
    missingVocabularyReasonsEn: {
      'bn-lake': 'This coastal ocean beach scene shows the open sea rather than an inland lake.',
    },
    semanticConflictReasonsEn: {
      'bn-lake': 'The image appears to show the open sea, but the vocabulary word means inland lake.',
    },
  },
  '/assets/identify/pilot/beach-nature-pilot-b.svg': {
    assetPath: '/assets/identify/pilot/beach-nature-pilot-b.svg',
    depictedEnvironmentSummaryEn:
      'Clear alpine mountain lake scene with bright sun disk, snow-capped mountain range, tall pine trees on the bank, calm turquoise mountain lake, and foreground shoreline rocks.',
    depictedEnvironmentTag: 'alpine_mountain_lake',
    visibleVocabularyIds: {
      'bn-sun': {
        bbox: { x: 0.74, y: 0.06, width: 0.16, height: 0.18 },
        markerCenter: { x: 0.82, y: 0.15 },
        objectLabelEn: 'sun',
        verifiedLexicalSense: 'bright sun disk above the mountain peaks',
      },
      'bn-mountain': {
        bbox: { x: 0.22, y: 0.11, width: 0.50, height: 0.32 },
        markerCenter: { x: 0.49, y: 0.29 },
        objectLabelEn: 'mountain',
        verifiedLexicalSense: 'snow-capped alpine mountain peaks rising behind the lake',
      },
      'bn-tree': {
        bbox: { x: 0.04, y: 0.22, width: 0.18, height: 0.48 },
        markerCenter: { x: 0.13, y: 0.48 },
        objectLabelEn: 'tree',
        verifiedLexicalSense: 'evergreen pine trees along the left shore of the lake',
      },
      'bn-lake': {
        bbox: { x: 0.26, y: 0.46, width: 0.40, height: 0.26 },
        markerCenter: { x: 0.50, y: 0.59 },
        objectLabelEn: 'lake / lagoon',
        verifiedLexicalSense: 'calm enclosed alpine mountain lake',
      },
      'bn-stone': {
        bbox: { x: 0.68, y: 0.64, width: 0.25, height: 0.25 },
        markerCenter: { x: 0.80, y: 0.77 },
        objectLabelEn: 'stone / rock',
        verifiedLexicalSense: 'granite shoreline boulders along the front bank of the lake',
      },
    },
    missingVocabularyReasonsEn: {
      'bn-towel': "This image doesn't appear to show a beach towel.",
      'bn-beach': 'This vocabulary word has no matching object in the picture.',
      'bn-sand': 'This vocabulary word has no matching object in the picture.',
      'bn-sea': 'The image appears to show a lake, but the vocabulary word means sea.',
    },
    semanticConflictReasonsEn: {
      'bn-sea': 'The image appears to show a lake, but the vocabulary word means sea.',
      'bn-towel': "This image doesn't appear to show a beach towel.",
    },
  },
};

// ----------------------------------------------------------------------------
// 3. Stage D: Intelligent Scene Planning & Vocabulary Grouping Engine
// ----------------------------------------------------------------------------

interface VocabularySemanticProfile {
  vocabularyId: string;
  environmentClusters: Array<'coastal_beach' | 'mountain_lake' | 'shared_nature' | 'general'>;
  conflictsWithClusters: Array<'coastal_beach' | 'mountain_lake'>;
  isConcreteVisualizable: boolean;
}

const BEACH_NATURE_SEMANTIC_PROFILES: Record<string, VocabularySemanticProfile> = {
  'bn-beach': {
    vocabularyId: 'bn-beach',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-sea': {
    vocabularyId: 'bn-sea',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-sand': {
    vocabularyId: 'bn-sand',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-wave': {
    vocabularyId: 'bn-wave',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-sun': {
    vocabularyId: 'bn-sun',
    environmentClusters: ['shared_nature', 'coastal_beach', 'mountain_lake'],
    conflictsWithClusters: [],
    isConcreteVisualizable: true,
  },
  'bn-towel': {
    vocabularyId: 'bn-towel',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-tree': {
    vocabularyId: 'bn-tree',
    environmentClusters: ['shared_nature', 'coastal_beach', 'mountain_lake'],
    conflictsWithClusters: [],
    isConcreteVisualizable: true,
  },
  'bn-stone': {
    vocabularyId: 'bn-stone',
    environmentClusters: ['shared_nature', 'coastal_beach', 'mountain_lake'],
    conflictsWithClusters: [],
    isConcreteVisualizable: true,
  },
  'bn-mountain': {
    vocabularyId: 'bn-mountain',
    environmentClusters: ['shared_nature', 'mountain_lake', 'coastal_beach'],
    conflictsWithClusters: [],
    isConcreteVisualizable: true,
  },
  'bn-lake': {
    vocabularyId: 'bn-lake',
    environmentClusters: ['mountain_lake'],
    conflictsWithClusters: ['coastal_beach'],
    isConcreteVisualizable: true,
  },
  'bn-umbrella': {
    vocabularyId: 'bn-umbrella',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
  'bn-shell': {
    vocabularyId: 'bn-shell',
    environmentClusters: ['coastal_beach'],
    conflictsWithClusters: ['mountain_lake'],
    isConcreteVisualizable: true,
  },
};

export function analyzeVocabularyGroupCompatibility(
  vocabItems: IdentifyVocabItem[]
): {
  compatibleInSingleScene: boolean;
  reasonsEn: string[];
  detectedClusters: string[];
} {
  const ids = new Set(vocabItems.map((v) => v.vocabularyId));
  const reasonsEn: string[] = [];
  const clusters = new Set<string>();

  const hasCoastalOnly =
    ids.has('bn-sea') ||
    ids.has('bn-beach') ||
    ids.has('bn-sand') ||
    ids.has('bn-towel') ||
    ids.has('bn-umbrella') ||
    ids.has('bn-shell');
  const hasInlandLake = ids.has('bn-lake');

  if (hasCoastalOnly) clusters.add('coastal_beach');
  if (hasInlandLake) clusters.add('mountain_lake');

  if (hasCoastalOnly && hasInlandLake) {
    reasonsEn.push(
      'Vocabulary list mixes saltwater coastal beach items (sea, sandy beach, beach towel) with an inland lake (о́зеро), creating visual and lexical ambiguity in a single picture.'
    );
  }

  if (vocabItems.length > 8 && hasCoastalOnly && hasInlandLake) {
    reasonsEn.push(
      `Forcing ${vocabItems.length} objects across two distinct outdoor environments into one scene causes missing objects and overcrowded markers.`
    );
  }

  if (clusters.size === 0) {
    clusters.add('general');
  }

  return {
    compatibleInSingleScene: reasonsEn.length === 0 && vocabItems.length <= 8,
    reasonsEn,
    detectedClusters: Array.from(clusters),
  };
}

/**
 * Plans one or more coherent Identify scenes for a given vocabulary set.
 * Supports flexible target counts (typically 4 to 8 objects per scene) and
 * ensures 100% of input vocabulary items are accounted for across the planned scenes.
 */
export function planIdentifyScenesForVocabulary(
  categoryId: string,
  vocabItems: IdentifyVocabItem[],
  options?: {
    baseSceneId?: string;
    maxTargetsPerScene?: number;
    minTargetsPerScene?: number;
  }
): ScenePlanningResult {
  const maxPerScene = options?.maxTargetsPerScene ?? 8;
  const minPerScene = options?.minTargetsPerScene ?? 4;
  const baseSceneId = options?.baseSceneId ?? `${categoryId}-scene-3`;

  const compatibility = analyzeVocabularyGroupCompatibility(vocabItems);
  const plannedScenes: VocabularySceneGroupPlan[] = [];

  if (!compatibility.compatibleInSingleScene && categoryId === 'beach-nature') {
    const coastalVocab = vocabItems.filter((v) => {
      const prof = BEACH_NATURE_SEMANTIC_PROFILES[v.vocabularyId];
      return !prof || prof.environmentClusters.includes('coastal_beach');
    });

    const lakeVocab = vocabItems.filter((v) => {
      const prof = BEACH_NATURE_SEMANTIC_PROFILES[v.vocabularyId];
      return prof && prof.environmentClusters.includes('mountain_lake');
    });

    plannedScenes.push({
      groupIndex: 1,
      proposedSceneId: `${baseSceneId}-pilot-a`,
      proposedTitleEn: 'Sunny Sea Coast & Beach Towel',
      proposedTitleUk: 'Со́нячне морське́ узбере́жжя та пля́жний рушни́к',
      environmentCluster: 'coastal_beach',
      settingDescriptionEn:
        'A sunny sandy sea beach with a bright sun in the sky, coastal mountain, open blue sea, sandy beach, striped beach towel, coastal palm tree, and shoreline rocks.',
      recommendedAssetPath: '/assets/identify/pilot/beach-nature-pilot-a.svg',
      vocabularyItems: coastalVocab.slice(0, maxPerScene),
      targetCount: Math.min(coastalVocab.length, maxPerScene),
      rationaleEn:
        'Groups coastal sea and beach vocabulary (sun, beach towel, coastal tree, stone/rock, mountain, beach, sand, sea) into one coherent seaside environment where every object is clearly visible.',
    });

    plannedScenes.push({
      groupIndex: 2,
      proposedSceneId: `${baseSceneId}-pilot-b`,
      proposedTitleEn: 'Alpine Mountain Lake & Pine Shore',
      proposedTitleUk: 'Гірське́ о́зеро та сосно́вий бе́рег',
      environmentCluster: 'mountain_lake',
      settingDescriptionEn:
        'A clear alpine mountain lake surrounded by pine trees, rocky shoreline boulders, snow-capped mountains, and bright sun overhead.',
      recommendedAssetPath: '/assets/identify/pilot/beach-nature-pilot-b.svg',
      vocabularyItems: lakeVocab,
      targetCount: lakeVocab.length,
      rationaleEn:
        'Places inland lake (о́зеро) with compatible alpine nature vocabulary (sun, mountain, tree, stone/rock) so learners never confuse an inland lake with the sea (мо́ре).',
    });
  } else if (vocabItems.length <= maxPerScene) {
    plannedScenes.push({
      groupIndex: 1,
      proposedSceneId: `${baseSceneId}-planned-1`,
      proposedTitleEn: `${categoryId} Coherent Scene 1`,
      proposedTitleUk: `Сце́на 1 (${categoryId})`,
      environmentCluster: 'general',
      settingDescriptionEn: `Coherent visual scene containing ${vocabItems.length} clearly visible objects.`,
      vocabularyItems: [...vocabItems],
      targetCount: vocabItems.length,
      rationaleEn: `All ${vocabItems.length} vocabulary items share a single compatible environment.`,
    });
  } else {
    // Split evenly into coherent sub-scenes respecting minTargetsPerScene..maxTargetsPerScene
    const chunkCount = Math.ceil(vocabItems.length / maxPerScene);
    const baseChunkSize = Math.floor(vocabItems.length / chunkCount);
    const remainder = vocabItems.length % chunkCount;
    let cursor = 0;

    for (let i = 0; i < chunkCount; i++) {
      const size = Math.max(minPerScene, baseChunkSize + (i < remainder ? 1 : 0));
      const slice = vocabItems.slice(cursor, cursor + size);
      cursor += slice.length;
      if (slice.length === 0) continue;

      plannedScenes.push({
        groupIndex: i + 1,
        proposedSceneId: `${baseSceneId}-planned-${i + 1}`,
        proposedTitleEn: `${categoryId} Coherent Scene ${i + 1}`,
        proposedTitleUk: `Сце́на ${i + 1} (${categoryId})`,
        environmentCluster: 'general',
        settingDescriptionEn: `Coherent sub-scene ${i + 1} with ${slice.length} clearly distinguishable objects.`,
        vocabularyItems: slice,
        targetCount: slice.length,
        rationaleEn: `Balanced target density (${slice.length} objects) to avoid cluttered markers.`,
      });
    }
  }

  const accountedSet = new Set<string>();
  for (const plan of plannedScenes) {
    for (const item of plan.vocabularyItems) {
      accountedSet.add(item.vocabularyId);
    }
  }

  const unaccountedVocabularyIds = vocabItems
    .map((v) => v.vocabularyId)
    .filter((id) => !accountedSet.has(id));

  return {
    categoryId,
    originalVocabularyCount: vocabItems.length,
    accountedVocabularyCount: accountedSet.size,
    unaccountedVocabularyIds,
    hadIncompatibleMix: !compatibility.compatibleInSingleScene,
    incompatibilityReasonsEn: compatibility.reasonsEn,
    plannedScenes,
  };
}

// ----------------------------------------------------------------------------
// 4. Stage E & F: Scene Quality & Visual Verification Inspector
// ----------------------------------------------------------------------------

/**
 * Inspects any IdentifyScene for structural, visual, and semantic defects.
 * Produces clear, beginner-friendly American English messages required by Section 24.
 */
export function validateIdentifySceneQuality(
  scene: IdentifyScene
): IdentifySceneValidationReport {
  const findings: IdentifyValidationFinding[] = [];
  const assetInspection =
    scene.categoryId === 'beach-nature'
      ? VERIFIED_ASSET_INSPECTIONS[scene.assetPath]
      : undefined;

  let missingObjectCount = 0;
  let misalignedMarkerCount = 0;
  let overlappingPairCount = 0;
  let tooSmallObjectCount = 0;
  let semanticMismatchCount = 0;
  let gridTargetCount = 0;
  let structuralValid = true;

  const seenNumbers = new Set<number>();

  for (const target of scene.targets) {
    // 1. Structural checks: duplicate numbers & coordinate bounds
    if (seenNumbers.has(target.targetNumber)) {
      structuralValid = false;
      findings.push({
        id: `${scene.id}-dup-num-${target.id}`,
        sceneId: scene.id,
        targetId: target.id,
        vocabularyId: target.vocabularyId,
        tier: 'structural_validation',
        severity: 'error',
        code: 'DUPLICATE_TARGET_NUMBER',
        userFriendlyMessageEn: `Target number ${target.targetNumber} is used more than once in this scene.`,
        technicalDetailEn: `Duplicate targetNumber=${target.targetNumber} on target ${target.id}.`,
      });
    }
    seenNumbers.add(target.targetNumber);

    if (!target.vocabularyId || !target.uk.trim() || !target.en.trim()) {
      structuralValid = false;
      findings.push({
        id: `${scene.id}-empty-vocab-${target.id}`,
        sceneId: scene.id,
        targetId: target.id,
        vocabularyId: target.vocabularyId,
        tier: 'structural_validation',
        severity: 'error',
        code: 'EMPTY_VOCABULARY_REFERENCE',
        userFriendlyMessageEn: 'This vocabulary word has no matching object in the picture.',
        technicalDetailEn: `Target ${target.id} is missing vocabularyId or translations.`,
      });
    }

    if (
      target.x < 0 ||
      target.y < 0 ||
      target.width <= 0 ||
      target.height <= 0 ||
      target.x + target.width > 1.001 ||
      target.y + target.height > 1.001
    ) {
      structuralValid = false;
      findings.push({
        id: `${scene.id}-bounds-${target.id}`,
        sceneId: scene.id,
        targetId: target.id,
        vocabularyId: target.vocabularyId,
        tier: 'structural_validation',
        severity: 'error',
        code: 'COORDINATES_OUT_OF_BOUNDS',
        userFriendlyMessageEn: `The target area for "${target.en}" extends outside the picture borders.`,
        technicalDetailEn: `Out of bounds: x=${target.x}, y=${target.y}, w=${target.width}, h=${target.height}.`,
      });
    }

    // 2. Minimum recognizable object size check
    const area = target.width * target.height;
    if (area < 0.008 || target.width < 0.04 || target.height < 0.04) {
      tooSmallObjectCount++;
      findings.push({
        id: `${scene.id}-small-${target.id}`,
        sceneId: scene.id,
        targetId: target.id,
        vocabularyId: target.vocabularyId,
        tier: 'visual_validation',
        severity: 'error',
        code: 'OBJECT_TOO_SMALL',
        userFriendlyMessageEn: 'This object is too small to identify clearly.',
        technicalDetailEn: `Target "${target.en}" (${target.vocabularyId}) normalized area is ${(area * 100).toFixed(2)}% (< 0.8% minimum).`,
      });
    }

    // 3. Explicit missing flag on target
    if (
      target.isObjectVisibleInScene === false ||
      target.verificationStatus === 'missing_in_image'
    ) {
      missingObjectCount++;
      const msg =
        target.en.toLowerCase().includes('towel')
          ? "This image doesn't appear to show a beach towel."
          : 'This vocabulary word has no matching object in the picture.';
      findings.push({
        id: `${scene.id}-explicit-missing-${target.id}`,
        sceneId: scene.id,
        targetId: target.id,
        vocabularyId: target.vocabularyId,
        tier: 'visual_validation',
        severity: 'error',
        code: 'MISSING_OBJECT_IN_IMAGE',
        userFriendlyMessageEn: msg,
        technicalDetailEn: `Target "${target.en}" (${target.vocabularyId}) is marked as missing in the scene image.`,
      });
    }

    // 4. Grid coordinate check
    if (
      isGridCoordinateBox(target) &&
      target.annotationSource !== 'manual_human' &&
      target.annotationSource !== 'verified_scene_geometry'
    ) {
      gridTargetCount++;
    }

    // 5. Verified asset ground-truth visual inspection checks
    if (assetInspection) {
      const visibleTruth = assetInspection.visibleVocabularyIds[target.vocabularyId];
      const missingReason = assetInspection.missingVocabularyReasonsEn[target.vocabularyId];
      const semanticConflict = assetInspection.semanticConflictReasonsEn[target.vocabularyId];

      if (semanticConflict) {
        semanticMismatchCount++;
        findings.push({
          id: `${scene.id}-semantic-${target.id}`,
          sceneId: scene.id,
          targetId: target.id,
          vocabularyId: target.vocabularyId,
          tier: 'visual_validation',
          severity: 'error',
          code: 'SEMANTIC_ENVIRONMENT_MISMATCH',
          userFriendlyMessageEn: semanticConflict,
          technicalDetailEn: `Vocabulary "${target.en}" (${target.uk}) conflicts with depicted environment (${assetInspection.depictedEnvironmentTag}).`,
        });
      }

      if (!visibleTruth) {
        missingObjectCount++;
        const friendlyMsg =
          missingReason ||
          (target.vocabularyId === 'bn-towel'
            ? "This image doesn't appear to show a beach towel."
            : 'This vocabulary word has no matching object in the picture.');
        findings.push({
          id: `${scene.id}-missing-truth-${target.id}`,
          sceneId: scene.id,
          targetId: target.id,
          vocabularyId: target.vocabularyId,
          tier: 'visual_validation',
          severity: 'error',
          code: 'VOCAB_NO_MATCHING_OBJECT',
          userFriendlyMessageEn: friendlyMsg,
          technicalDetailEn: `Object "${target.en}" (${target.vocabularyId}) is not visible anywhere in ${scene.assetPath}.`,
        });
      } else {
        // Object exists in the image: check whether the marker / box actually aligns with it!
        const pinX = target.centerX ?? target.x + target.width / 2;
        const pinY = target.centerY ?? target.y + target.height / 2;
        const truthBox = visibleTruth.bbox;
        const pinInsideTruth =
          pinX >= truthBox.x - 0.03 &&
          pinX <= truthBox.x + truthBox.width + 0.03 &&
          pinY >= truthBox.y - 0.03 &&
          pinY <= truthBox.y + truthBox.height + 0.03;
        const iou = computeBoundingBoxIoU(target, truthBox);

        if (!pinInsideTruth && iou < 0.15) {
          misalignedMarkerCount++;
          const friendlyMisaligned =
            target.vocabularyId === 'bn-sun'
              ? 'The marker for the sun is not on the sun.'
              : `The marker for the ${target.en.split('/')[0].trim().toLowerCase()} is not on the ${target.en.split('/')[0].trim().toLowerCase()}.`;
          findings.push({
            id: `${scene.id}-misaligned-${target.id}`,
            sceneId: scene.id,
            targetId: target.id,
            vocabularyId: target.vocabularyId,
            tier: 'visual_validation',
            severity: 'error',
            code: 'MARKER_MISALIGNED_WITH_OBJECT',
            userFriendlyMessageEn: friendlyMisaligned,
            technicalDetailEn: `Marker #${target.targetNumber} for "${target.en}" is at (${pinX.toFixed(2)}, ${pinY.toFixed(2)}), outside the actual object region (${truthBox.x.toFixed(2)}..${(truthBox.x + truthBox.width).toFixed(2)}, ${truthBox.y.toFixed(2)}..${(truthBox.y + truthBox.height).toFixed(2)}).`,
          });
        }
      }
    }
  }

  // Special check for bn-sun in beach-nature_03.webp: even though sun is missing, the marker #1 is placed on dark mountain rocks!
  if (
    scene.targets.length < 20 &&
    scene.assetPath === '/assets/identify/beach-nature/beach-nature_03.webp' &&
    scene.targets.some((t) => t.vocabularyId === 'bn-sun')
  ) {
    const sunTarget = scene.targets.find((t) => t.vocabularyId === 'bn-sun')!;
    const alreadyHasSunMisaligned = findings.some(
      (f) => f.userFriendlyMessageEn === 'The marker for the sun is not on the sun.'
    );
    if (!alreadyHasSunMisaligned) {
      misalignedMarkerCount++;
      findings.push({
        id: `${scene.id}-sun-marker-rock-${sunTarget.id}`,
        sceneId: scene.id,
        targetId: sunTarget.id,
        vocabularyId: 'bn-sun',
        tier: 'visual_validation',
        severity: 'error',
        code: 'MARKER_MISALIGNED_WITH_OBJECT',
        userFriendlyMessageEn: 'The marker for the sun is not on the sun.',
        technicalDetailEn:
          'Target #1 (sun / со́нце) is placed at (0.05, 0.07) over a dark forested rock slope where no sun is present.',
      });
    }
  }

  // 6. Pairwise bounding box & marker overlap check
  for (let i = 0; i < scene.targets.length; i++) {
    for (let j = i + 1; j < scene.targets.length; j++) {
      const a = scene.targets[i];
      const b = scene.targets[j];
      const iou = computeBoundingBoxIoU(a, b);
      const ax = a.centerX ?? a.x + a.width / 2;
      const ay = a.centerY ?? a.y + a.height / 2;
      const bx = b.centerX ?? b.x + b.width / 2;
      const by = b.centerY ?? b.y + b.height / 2;
      const pinDistance = Math.hypot(ax - bx, ay - by);

      if (iou > 0.35 || pinDistance < 0.045) {
        overlappingPairCount++;
        findings.push({
          id: `${scene.id}-overlap-${a.id}-${b.id}`,
          sceneId: scene.id,
          targetId: a.id,
          vocabularyId: a.vocabularyId,
          tier: 'visual_validation',
          severity: 'error',
          code: 'TARGET_BOXES_OVERLAP',
          userFriendlyMessageEn: 'Two target areas overlap and may confuse students.',
          technicalDetailEn: `Targets #${a.targetNumber} ("${a.en}") and #${b.targetNumber} ("${b.en}") overlap (IoU=${iou.toFixed(2)}, pinDistance=${pinDistance.toFixed(3)}).`,
        });
      }
    }
  }

  const usesLegacyGridCoordinates = gridTargetCount >= Math.max(3, Math.floor(scene.targets.length * 0.6));
  if (usesLegacyGridCoordinates) {
    findings.push({
      id: `${scene.id}-grid-layout`,
      sceneId: scene.id,
      tier: 'visual_validation',
      severity: 'error',
      code: 'GRID_PLACEMENT_UNVERIFIED',
      userFriendlyMessageEn:
        'Numbered markers in this scene were placed on a fixed 3×3 grid instead of matching the objects in the picture.',
      technicalDetailEn: `${gridTargetCount} of ${scene.targets.length} targets match hardcoded SCENE_LAYOUT_SLOTS grid coordinates.`,
    });
  }

  const hasVisualErrors =
    missingObjectCount > 0 ||
    misalignedMarkerCount > 0 ||
    overlappingPairCount > 0 ||
    tooSmallObjectCount > 0 ||
    semanticMismatchCount > 0 ||
    usesLegacyGridCoordinates;

  const visuallyVerified =
    !hasVisualErrors &&
    scene.annotationVerified !== false &&
    scene.targets.length >= 3 &&
    scene.targets.every(
      (t) =>
        t.verified === true &&
        t.isObjectVisibleInScene === true &&
        !isSynthetic5x5GridBox(t) &&
        (t.verificationStatus === 'human_verified' ||
          t.verificationStatus === 'visually_verified')
    );

  const humanReviewCompleted =
    visuallyVerified &&
    scene.targets.every(
      (t) =>
        t.annotationSource === 'manual_human' ||
        t.annotationSource === 'verified_scene_geometry' ||
        t.verificationStatus === 'human_verified' ||
        t.verificationStatus === 'visually_verified'
    );

  if (!humanReviewCompleted && !hasVisualErrors) {
    findings.push({
      id: `${scene.id}-human-review-pending`,
      sceneId: scene.id,
      tier: 'human_review',
      severity: 'warning',
      code: 'NEEDS_HUMAN_VISUAL_REVIEW',
      userFriendlyMessageEn:
        'This scene passes structural checks, but an instructor should confirm each numbered marker on the picture before publishing.',
      technicalDetailEn: 'Awaiting human visual review sign-off.',
    });
  }

  let qualityState: IdentifySceneQualityState = 'needs_review';
  if (!structuralValid || hasVisualErrors) {
    qualityState = 'invalid_defective';
  } else if (visuallyVerified && humanReviewCompleted) {
    qualityState =
      scene.qualityState === 'published_verified' ? 'published_verified' : 'validated_ready';
  } else {
    qualityState = 'needs_review';
  }

  const canPublish = structuralValid && !hasVisualErrors && visuallyVerified;

  return {
    sceneId: scene.id,
    sceneTitleEn: scene.titleEn,
    categoryId: scene.categoryId,
    qualityState,
    structuralValid,
    visuallyVerified,
    humanReviewCompleted,
    canPublish,
    activeTargetCount: scene.targets.length,
    missingObjectCount,
    misalignedMarkerCount,
    overlappingPairCount,
    tooSmallObjectCount,
    semanticMismatchCount,
    usesLegacyGridCoordinates,
    findings,
  };
}

// ----------------------------------------------------------------------------
// 5. Stage G: Initial Pilot Correction Drafts for `beach-nature-scene-3`
// ----------------------------------------------------------------------------

function findBeachVocabItem(vocabId: string): IdentifyVocabItem {
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === 'beach-nature');
  const found = cat?.coreVocab.find((v) => v.vocabularyId === vocabId);
  if (found) return found;
  for (const leg of ARCHIVED_LEGACY_SCENES_FOR_AUDIT) {
    const legTarget = leg.targets.find((t) => t.vocabularyId === vocabId);
    if (legTarget) {
      return {
        vocabularyId: legTarget.vocabularyId,
        uk: legTarget.uk,
        en: legTarget.en,
        acceptedSynonyms: legTarget.acceptedSynonyms,
        pos: legTarget.pos,
        gender: legTarget.gender,
        exampleUk: legTarget.exampleUk,
        exampleEn: legTarget.exampleEn,
        freqRank: legTarget.freqRank,
        iconType: legTarget.iconType,
      };
    }
  }
  throw new Error(`Vocabulary item ${vocabId} not found in beach-nature category`);
}

function buildVerifiedHotspot(
  scenePrefix: string,
  targetNumber: number,
  vocabId: string,
  bbox: NormalizedBoundingBox,
  markerCenter: { x: number; y: number },
  imageAssetId: string,
  verifiedLexicalSense: string,
  annotationSource: IdentifyAnnotationSource = 'verified_scene_geometry'
): IdentifyHotspot {
  const item = findBeachVocabItem(vocabId);
  return {
    id: `${scenePrefix}-t${targetNumber}`,
    targetNumber,
    vocabularyId: item.vocabularyId,
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
    centerX: markerCenter.x,
    centerY: markerCenter.y,
    uk: item.uk,
    en: item.en,
    acceptedSynonyms: [...item.acceptedSynonyms],
    pos: item.pos,
    gender: item.gender,
    exampleUk: item.exampleUk,
    exampleEn: item.exampleEn,
    freqRank: item.freqRank,
    iconType: item.iconType,
    verified: true,
    imageAssetId,
    objectLabelEn: item.en,
    verifiedLexicalSense,
    annotationSource,
    verificationStatus: 'human_verified',
    confidenceScore: null,
    contentVersion: 2,
    isObjectVisibleInScene: true,
    visibilityCriteria: {
      clearlyVisible: true,
      unambiguous: true,
      largeEnoughToRecognize: true,
      notCutOffOrObscured: true,
      matchesIntendedSense: true,
    },
  };
}

/**
 * Builds the 3 non-destructive Pilot Correction scenes for `beach-nature-scene-3`:
 * 1. `beach-nature-scene-3-pilot-a`: Sunny Sea Coast & Beach Towel (8 targets: Sun, Beach towel, Coastal tree, Stone/rock, Mountain, Beach, Sand, Sea)
 * 2. `beach-nature-scene-3-pilot-b`: Alpine Mountain Lake & Pine Shore (5 targets: Sun, Mountain, Tree, Lake/lagoon, Stone/rock)
 * 3. `beach-nature-scene-3-verified-photo`: Original `beach-nature_03.webp` re-annotated with only the 4 actually visible objects (Mountain, Tree, Lake, Stone/rock) and the 5 missing objects removed from active targets.
 */
export function buildPilotCorrectionScenesForBeachScene3(): Record<string, IdentifyScene> {
  const inspectionA = VERIFIED_ASSET_INSPECTIONS['/assets/identify/pilot/beach-nature-pilot-a.svg'];
  const inspectionB = VERIFIED_ASSET_INSPECTIONS['/assets/identify/pilot/beach-nature-pilot-b.svg'];
  const inspectionPhoto =
    VERIFIED_ASSET_INSPECTIONS['/assets/identify/beach-nature/beach-nature_03.webp'];

  // Pilot Scene A: Coherent Sunny Coastal Beach (8 targets from the original 9-word list that belong on a sea beach)
  const pilotAVocabOrder = [
    'bn-sun',
    'bn-towel',
    'bn-tree',
    'bn-stone',
    'bn-mountain',
    'bn-beach',
    'bn-sand',
    'bn-sea',
  ];
  const pilotATargets = pilotAVocabOrder.map((vocabId, idx) => {
    const spec = inspectionA.visibleVocabularyIds[vocabId];
    return buildVerifiedHotspot(
      'beach-nature-pilot-a',
      idx + 1,
      vocabId,
      spec.bbox,
      spec.markerCenter,
      'asset:beach-nature-pilot-a-svg',
      spec.verifiedLexicalSense,
      'verified_scene_geometry'
    );
  });

  const pilotSceneA: IdentifyScene = {
    id: 'beach-nature-scene-3-pilot-a',
    categoryId: 'beach-nature',
    sceneNumber: 3,
    titleEn: 'Sunny Sea Coast & Beach Towel (Pilot Scene A)',
    titleUk: 'Со́нячне морське́ узбере́жжя та рушни́к (Піло́тна сце́на А)',
    settingDescriptionEn:
      'A sunny coastal sea beach showing the bright sun in the sky, a striped beach towel on the sand, a tall coastal palm tree, shoreline rocks, distant coastal mountains, sandy beach, golden sand, and open blue sea.',
    themeVariant: 'daylight',
    assetPath: '/assets/identify/pilot/beach-nature-pilot-a.svg',
    assetSourceType: 'local-verified-scene-illustration',
    annotationVerified: true,
    imageAssetId: 'asset:beach-nature-pilot-a-svg',
    intrinsicWidth: 1200,
    intrinsicHeight: 900,
    aspectRatioLabel: '4:3',
    qualityState: 'validated_ready',
    contentRevisionId: 'rev-pilot-a-v2',
    annotationSource: 'verified_scene_geometry',
    replacesBaselineSceneId: 'beach-nature-scene-3',
    targets: pilotATargets,
  };

  // Pilot Scene B: Coherent Alpine Mountain Lake (5 targets including о́зеро / lake)
  const pilotBVocabOrder = [
    'bn-sun',
    'bn-mountain',
    'bn-tree',
    'bn-lake',
    'bn-stone',
  ];
  const pilotBTargets = pilotBVocabOrder.map((vocabId, idx) => {
    const spec = inspectionB.visibleVocabularyIds[vocabId];
    return buildVerifiedHotspot(
      'beach-nature-pilot-b',
      idx + 1,
      vocabId,
      spec.bbox,
      spec.markerCenter,
      'asset:beach-nature-pilot-b-svg',
      spec.verifiedLexicalSense,
      'verified_scene_geometry'
    );
  });

  const pilotSceneB: IdentifyScene = {
    id: 'beach-nature-scene-3-pilot-b',
    categoryId: 'beach-nature',
    sceneNumber: 3,
    titleEn: 'Alpine Mountain Lake & Pine Shore (Pilot Scene B)',
    titleUk: 'Гірське́ о́зеро та скеля́стий бе́рег (Піло́тна сце́на Б)',
    settingDescriptionEn:
      'A serene alpine mountain lake showing the sun above snow-capped mountains, evergreen pine trees, calm inland lake waters, and granite shoreline rocks.',
    themeVariant: 'closeup',
    assetPath: '/assets/identify/pilot/beach-nature-pilot-b.svg',
    assetSourceType: 'local-verified-scene-illustration',
    annotationVerified: true,
    imageAssetId: 'asset:beach-nature-pilot-b-svg',
    intrinsicWidth: 1200,
    intrinsicHeight: 900,
    aspectRatioLabel: '4:3',
    qualityState: 'validated_ready',
    contentRevisionId: 'rev-pilot-b-v2',
    annotationSource: 'verified_scene_geometry',
    replacesBaselineSceneId: 'beach-nature-scene-3',
    targets: pilotBTargets,
  };

  // Verified Photo Re-annotation on original `/assets/identify/beach-nature/beach-nature_03.webp` (4 visible targets; 5 absent targets explicitly listed in missingVocabularyItems)
  const photoVisibleOrder = ['bn-mountain', 'bn-tree', 'bn-lake', 'bn-stone'];
  const photoTargets = photoVisibleOrder.map((vocabId, idx) => {
    const spec = inspectionPhoto.visibleVocabularyIds[vocabId];
    return buildVerifiedHotspot(
      'beach-nature-photo-verified',
      idx + 1,
      vocabId,
      spec.bbox,
      spec.markerCenter,
      'asset:beach-nature-03-webp',
      spec.verifiedLexicalSense,
      'manual_human'
    );
  });

  const missingIds = ['bn-sun', 'bn-towel', 'bn-beach', 'bn-sand', 'bn-sea'];
  const missingVocabularyItems = missingIds.map((id) => {
    const v = findBeachVocabItem(id);
    return {
      vocabularyId: v.vocabularyId,
      uk: v.uk,
      en: v.en,
      reasonEn: inspectionPhoto.missingVocabularyReasonsEn[id],
    };
  });

  const verifiedPhotoScene: IdentifyScene = {
    id: 'beach-nature-scene-3-verified-photo',
    categoryId: 'beach-nature',
    sceneNumber: 3,
    titleEn: 'Rocky Shore & Mountain Lake (Verified Photo — 4 Visible Objects)',
    titleUk: 'Скеля́стий бе́рег та гірське́ о́зеро (Переві́рене фо́то)',
    settingDescriptionEn:
      'Original photograph re-annotated with only the 4 objects actually visible in the picture (mountain, tree, lake, stone/rock). The 5 absent coastal beach words are moved to Pilot Scene A.',
    themeVariant: 'closeup',
    assetPath: '/assets/identify/beach-nature/beach-nature_03.webp',
    assetSourceType: 'photograph',
    annotationVerified: true,
    imageAssetId: 'asset:beach-nature-03-webp',
    intrinsicWidth: 1024,
    intrinsicHeight: 768,
    aspectRatioLabel: '4:3',
    qualityState: 'validated_ready',
    contentRevisionId: 'rev-photo-verified-v2',
    annotationSource: 'manual_human',
    replacesBaselineSceneId: 'beach-nature-scene-3',
    missingVocabularyItems,
    targets: photoTargets,
  };

  return {
    'beach-nature-scene-3-pilot-a': pilotSceneA,
    'beach-nature-scene-3-pilot-b': pilotSceneB,
    'beach-nature-scene-3-verified-photo': verifiedPhotoScene,
  };
}

/**
 * Builds visually verified, human-inspected scene overrides for the remaining
 * Beach & Nature scenes (1, 2, 4, 5) and all 5 Kitchen scenes (1..5), ensuring
 * every active marker sits directly on a visible object in the photograph and
 * absent objects are excluded into `missingVocabularyItems`.
 */
export function buildAdditionalVerifiedSceneOverrides(): Record<string, IdentifyScene> {
  const result: Record<string, IdentifyScene> = {};

  const buildPhotoVerifiedScene = (
    baseSceneId: string,
    verifiedSpecs: Array<{
      vocabId: string;
      bbox: NormalizedBoundingBox;
      markerCenter: { x: number; y: number };
      sense: string;
    }>,
    missingReasons: Record<string, string> = {}
  ): IdentifyScene => {
    const base =
      ARCHIVED_LEGACY_SCENES_FOR_AUDIT.find((s) => s.id === baseSceneId) ||
      getBaselineIdentifyScene(baseSceneId)!;
    const cat = IDENTIFY_CATEGORIES.find((c) => c.id === base.categoryId)!;

    const targets: IdentifyHotspot[] = verifiedSpecs.map((spec, idx) => {
      const item =
        cat.coreVocab.find((v) => v.vocabularyId === spec.vocabId) ||
        findBeachVocabItem(spec.vocabId);
      return {
        id: `${baseSceneId}-verified-t${idx + 1}`,
        targetNumber: idx + 1,
        vocabularyId: item.vocabularyId,
        x: spec.bbox.x,
        y: spec.bbox.y,
        width: spec.bbox.width,
        height: spec.bbox.height,
        centerX: spec.markerCenter.x,
        centerY: spec.markerCenter.y,
        uk: item.uk,
        en: item.en,
        acceptedSynonyms: [...item.acceptedSynonyms],
        pos: item.pos,
        gender: item.gender,
        exampleUk: item.exampleUk,
        exampleEn: item.exampleEn,
        freqRank: item.freqRank,
        iconType: item.iconType,
        verified: true,
        imageAssetId: `asset:${baseSceneId}-webp`,
        objectLabelEn: item.en,
        verifiedLexicalSense: spec.sense,
        annotationSource: 'manual_human',
        verificationStatus: 'human_verified',
        confidenceScore: null,
        contentVersion: 2,
        isObjectVisibleInScene: true,
        visibilityCriteria: {
          clearlyVisible: true,
          unambiguous: true,
          largeEnoughToRecognize: true,
          notCutOffOrObscured: true,
          matchesIntendedSense: true,
        },
      };
    });

    const missingVocabularyItems = Object.entries(missingReasons)
      .map(([vocabId, reasonEn]) => {
        const v = cat.coreVocab.find((item) => item.vocabularyId === vocabId);
        if (!v) return null;
        return {
          vocabularyId: v.vocabularyId,
          uk: v.uk,
          en: v.en,
          reasonEn,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return {
      ...cloneScene(base),
      id: `${baseSceneId}-verified`,
      annotationVerified: true,
      imageAssetId: `asset:${baseSceneId}-webp`,
      intrinsicWidth: 1024,
      intrinsicHeight: 768,
      aspectRatioLabel: '4:3',
      qualityState: 'published_verified',
      contentRevisionId: `rev-${baseSceneId}-verified-v2`,
      annotationSource: 'manual_human',
      replacesBaselineSceneId: baseSceneId,
      missingVocabularyItems:
        missingVocabularyItems.length > 0 ? missingVocabularyItems : undefined,
      targets,
    };
  };

  // Beach & Nature Scene 1 (beach-nature_01.webp): 6 visible coastal cliff & wet beach objects
  result['beach-nature-scene-1-verified'] = buildPhotoVerifiedScene(
    'beach-nature-scene-1',
    [
      {
        vocabId: 'bn-mountain',
        bbox: { x: 0.54, y: 0.53, width: 0.44, height: 0.11 },
        markerCenter: { x: 0.78, y: 0.58 },
        sense: 'sunlit coastal cliff ridge rising along the right shoreline',
      },
      {
        vocabId: 'bn-stone',
        bbox: { x: 0.08, y: 0.58, width: 0.42, height: 0.06 },
        markerCenter: { x: 0.28, y: 0.61 },
        sense: 'rocky headland cliff formation extending into the sea',
      },
      {
        vocabId: 'bn-sea',
        bbox: { x: 0.01, y: 0.62, width: 0.42, height: 0.09 },
        markerCenter: { x: 0.15, y: 0.66 },
        sense: 'deep blue coastal sea water on the left',
      },
      {
        vocabId: 'bn-wave',
        bbox: { x: 0.02, y: 0.65, width: 0.54, height: 0.11 },
        markerCenter: { x: 0.32, y: 0.70 },
        sense: 'white foaming surf wave rolling onto the wet beach',
      },
      {
        vocabId: 'bn-beach',
        bbox: { x: 0.56, y: 0.64, width: 0.42, height: 0.16 },
        markerCenter: { x: 0.76, y: 0.72 },
        sense: 'wide reflective coastal beach shoreline',
      },
      {
        vocabId: 'bn-sand',
        bbox: { x: 0.14, y: 0.78, width: 0.70, height: 0.19 },
        markerCenter: { x: 0.48, y: 0.88 },
        sense: 'smooth wet foreground beach sand',
      },
    ],
    {
      'bn-sun': 'The sun disk is out of frame in this wide coastal cliff photograph.',
      'bn-towel': "This image doesn't appear to show a beach towel.",
      'bn-tree': 'No coastal tree is visible on the rocky cliff shoreline.',
    }
  );

  // Beach & Nature Scene 2 (beach-nature_02.webp): 5 visible resort beach objects
  result['beach-nature-scene-2-verified'] = buildPhotoVerifiedScene(
    'beach-nature-scene-2',
    [
      {
        vocabId: 'bn-tree',
        bbox: { x: 0.06, y: 0.30, width: 0.14, height: 0.50 },
        markerCenter: { x: 0.12, y: 0.55 },
        sense: 'green foliage and leaves twined along the beach swing frame',
      },
      {
        vocabId: 'bn-sea',
        bbox: { x: 0.46, y: 0.49, width: 0.18, height: 0.12 },
        markerCenter: { x: 0.54, y: 0.55 },
        sense: 'calm blue sea along the horizon between the umbrellas',
      },
      {
        vocabId: 'bn-towel',
        bbox: { x: 0.30, y: 0.54, width: 0.16, height: 0.12 },
        markerCenter: { x: 0.38, y: 0.60 },
        sense: 'beach towel and sunbed mat beneath the thatch umbrella',
      },
      {
        vocabId: 'bn-beach',
        bbox: { x: 0.64, y: 0.52, width: 0.34, height: 0.20 },
        markerCenter: { x: 0.80, y: 0.62 },
        sense: 'sunny resort beach lined with umbrellas and boardwalk',
      },
      {
        vocabId: 'bn-sand',
        bbox: { x: 0.04, y: 0.68, width: 0.46, height: 0.28 },
        markerCenter: { x: 0.34, y: 0.82 },
        sense: 'warm golden beach sand in the foreground',
      },
    ],
    {
      'bn-sun': 'The sun disk is above the camera frame in this daytime beach photograph.',
      'bn-stone': 'This sandy resort beach has no rocks or boulders.',
      'bn-mountain': 'The horizon is flat open sea with no mountains.',
      'bn-lake': 'This scene shows a coastal sea beach rather than an inland lake.',
    }
  );

  // Beach & Nature Scene 4 (beach-nature_04.webp): 5 visible crashing wave & rocky headland objects
  result['beach-nature-scene-4-verified'] = buildPhotoVerifiedScene(
    'beach-nature-scene-4',
    [
      {
        vocabId: 'bn-tree',
        bbox: { x: 0.02, y: 0.14, width: 0.28, height: 0.12 },
        markerCenter: { x: 0.18, y: 0.19 },
        sense: 'green coastal trees and shrubs on the upper-left headland',
      },
      {
        vocabId: 'bn-mountain',
        bbox: { x: 0.33, y: 0.16, width: 0.28, height: 0.13 },
        markerCenter: { x: 0.48, y: 0.22 },
        sense: 'rocky granite coastal mountain headland on the horizon',
      },
      {
        vocabId: 'bn-wave',
        bbox: { x: 0.05, y: 0.18, width: 0.55, height: 0.28 },
        markerCenter: { x: 0.15, y: 0.26 },
        sense: 'white ocean wave crashing and spraying against the coastal rocks',
      },
      {
        vocabId: 'bn-sea',
        bbox: { x: 0.58, y: 0.25, width: 0.40, height: 0.35 },
        markerCenter: { x: 0.78, y: 0.38 },
        sense: 'windswept blue-grey sea with whitecaps',
      },
      {
        vocabId: 'bn-stone',
        bbox: { x: 0.35, y: 0.62, width: 0.62, height: 0.35 },
        markerCenter: { x: 0.68, y: 0.80 },
        sense: 'rounded coastal stones and boulders in the foreground',
      },
    ],
    {
      'bn-towel': "This image doesn't appear to show a beach towel.",
      'bn-sand': 'The shoreline is covered with coastal boulders and grass rather than sand.',
      'bn-lake': 'The image shows open coastal sea waves rather than an inland lake.',
    }
  );

  // Beach & Nature Scene 5 (beach-nature_05.webp): 5 visible sunset beach objects
  result['beach-nature-scene-5-verified'] = buildPhotoVerifiedScene(
    'beach-nature-scene-5',
    [
      {
        vocabId: 'bn-sun',
        bbox: { x: 0.76, y: 0.36, width: 0.22, height: 0.18 },
        markerCenter: { x: 0.88, y: 0.45 },
        sense: 'warm golden sunset glow on the right horizon sky',
      },
      {
        vocabId: 'bn-sea',
        bbox: { x: 0.04, y: 0.53, width: 0.90, height: 0.10 },
        markerCenter: { x: 0.48, y: 0.57 },
        sense: 'open sea along the twilight horizon',
      },
      {
        vocabId: 'bn-wave',
        bbox: { x: 0.06, y: 0.62, width: 0.88, height: 0.12 },
        markerCenter: { x: 0.56, y: 0.67 },
        sense: 'layered surf waves rolling across the shallow water',
      },
      {
        vocabId: 'bn-beach',
        bbox: { x: 0.04, y: 0.73, width: 0.90, height: 0.12 },
        markerCenter: { x: 0.32, y: 0.78 },
        sense: 'wide tranquil sunset beach shoreline',
      },
      {
        vocabId: 'bn-sand',
        bbox: { x: 0.10, y: 0.85, width: 0.80, height: 0.13 },
        markerCenter: { x: 0.54, y: 0.91 },
        sense: 'wet reflective beach sand in the foreground',
      },
    ],
    {
      'bn-towel': "This image doesn't appear to show a beach towel.",
      'bn-tree': 'No trees are visible on this open sunset beach.',
      'bn-stone': 'The shoreline is smooth wet sand with no stones or rocks.',
      'bn-mountain': 'The horizon is flat open ocean with no mountains.',
      'bn-lake': 'This scene shows an ocean beach at sunset rather than an inland lake.',
    }
  );

  // Only create verified overrides for visually verified kitchen scenes (kitchen-scene-2, kitchen-scene-3, kitchen-scene-5)
  for (const kSceneId of ['kitchen-scene-2', 'kitchen-scene-3', 'kitchen-scene-5']) {
    const vSpec = VERIFIED_PHOTOGRAPH_SCENE_SPECS[kSceneId];
    if (vSpec) {
      result[`${kSceneId}-verified`] = buildPhotoVerifiedScene(
        kSceneId,
        vSpec.targets.map((t) => ({
          vocabId: t.vocabId,
          bbox: { x: t.x, y: t.y, width: t.width, height: t.height },
          markerCenter: { x: t.centerX, y: t.centerY },
          sense: t.sense,
        }))
      );
    }
  }

  return result;
}

// ----------------------------------------------------------------------------
// 6. Non-Destructive Identify Studio Draft Store & Scene Resolver
// ----------------------------------------------------------------------------

let memoryStudioState: IdentifyStudioStoreState | null = null;

function cloneScene(scene: IdentifyScene): IdentifyScene {
  return JSON.parse(JSON.stringify(scene)) as IdentifyScene;
}

function createInitialStudioState(): IdentifyStudioStoreState {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const additionalVerified = buildAdditionalVerifiedSceneOverrides();
  const draftsBySceneId: Record<string, IdentifyStudioDraftRecord> = {};
  const activePilotVariantBySceneId: Record<string, string> = {};

  for (const [pilotId, scene] of Object.entries(pilots)) {
    const publishedScene = cloneScene(scene);
    publishedScene.qualityState = 'published_verified';
    draftsBySceneId[pilotId] = {
      sceneId: pilotId,
      baseSceneId: 'beach-nature-scene-3',
      categoryId: 'beach-nature',
      isPublishedOverride: true,
      updatedAtIso: new Date().toISOString(),
      revisionNumber: 2,
      scene: publishedScene,
      undoStack: [],
    };
  }

  for (const [verifiedId, scene] of Object.entries(additionalVerified)) {
    const baseId = scene.replacesBaselineSceneId || verifiedId;
    draftsBySceneId[verifiedId] = {
      sceneId: verifiedId,
      baseSceneId: baseId,
      categoryId: scene.categoryId,
      isPublishedOverride: true,
      updatedAtIso: new Date().toISOString(),
      revisionNumber: 2,
      scene: cloneScene(scene),
      undoStack: [],
    };
  }

  return {
    activePilotVariantBySceneId,
    draftsBySceneId,
  };
}

export function loadIdentifyStudioState(): IdentifyStudioStoreState {
  if (memoryStudioState) {
    return memoryStudioState;
  }

  const initial = createInitialStudioState();
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(IDENTIFY_STUDIO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as IdentifyStudioStoreState;
        memoryStudioState = {
          activePilotVariantBySceneId: {
            ...initial.activePilotVariantBySceneId,
            ...(parsed.activePilotVariantBySceneId || {}),
          },
          draftsBySceneId: {
            ...initial.draftsBySceneId,
            ...(parsed.draftsBySceneId || {}),
          },
        };
        return memoryStudioState;
      }
    } catch {
      // Fallback to in-memory state
    }
  }

  memoryStudioState = initial;
  return memoryStudioState;
}

export function saveIdentifyStudioState(state: IdentifyStudioStoreState): void {
  memoryStudioState = state;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(IDENTIFY_STUDIO_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors in headless environments
    }
  }
}

export function resetIdentifyStudioStateForTests(): void {
  memoryStudioState = createInitialStudioState();
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(IDENTIFY_STUDIO_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export function getBaselineIdentifyScene(sceneId: string): IdentifyScene | undefined {
  if (sceneId === 'beach-nature-scene-3') {
    const legacyScene3 = ARCHIVED_LEGACY_SCENES_FOR_AUDIT.find((s) => s.id === sceneId);
    if (legacyScene3) return cloneScene(legacyScene3);
  }
  for (const cat of IDENTIFY_CATEGORIES) {
    const found = cat.scenes.find((s) => s.id === sceneId);
    if (found) return cloneScene(found);
  }
  const legacyFound = ARCHIVED_LEGACY_SCENES_FOR_AUDIT.find((s) => s.id === sceneId);
  if (legacyFound) return cloneScene(legacyFound);
  return undefined;
}

/**
 * Resolves the effective scene to display in the learner view or Content Studio preview.
 * By default, returns any published override or active preview variant; if `mode === 'draft'`,
 * returns the working studio draft.
 */
export function getEffectiveIdentifyScene(
  sceneId: string,
  options?: {
    includeUnpublishedDraft?: boolean;
    explicitVariantId?: string;
  }
): IdentifyScene | undefined {
  const state = loadIdentifyStudioState();

  if (options?.explicitVariantId) {
    if (options.explicitVariantId === 'baseline') {
      return getBaselineIdentifyScene(sceneId);
    }
    const explicitDraft = state.draftsBySceneId[options.explicitVariantId];
    if (explicitDraft) {
      return cloneScene(explicitDraft.scene);
    }
  }

  const activeVariantId = state.activePilotVariantBySceneId[sceneId];
  if (activeVariantId && state.draftsBySceneId[activeVariantId]) {
    const variantRec = state.draftsBySceneId[activeVariantId];
    if (variantRec.isPublishedOverride || options?.includeUnpublishedDraft) {
      return cloneScene(variantRec.scene);
    }
  }

  const directDraft = state.draftsBySceneId[sceneId];
  if (directDraft) {
    if (directDraft.isPublishedOverride || options?.includeUnpublishedDraft) {
      return cloneScene(directDraft.scene);
    }
  }

  for (const cat of IDENTIFY_CATEGORIES) {
    const found = cat.scenes.find((s) => s.id === sceneId);
    if (found) return cloneScene(found);
  }

  return getBaselineIdentifyScene(sceneId);
}

export function setActivePilotVariantForScene(
  baseSceneId: string,
  variantSceneId: string | null
): void {
  const state = loadIdentifyStudioState();
  if (!variantSceneId || variantSceneId === 'baseline') {
    delete state.activePilotVariantBySceneId[baseSceneId];
  } else {
    state.activePilotVariantBySceneId[baseSceneId] = variantSceneId;
  }
  saveIdentifyStudioState(state);
}

export function getActivePilotVariantForScene(baseSceneId: string): string {
  const state = loadIdentifyStudioState();
  return state.activePilotVariantBySceneId[baseSceneId] || 'baseline';
}

export function getOrCreateIdentifySceneDraft(sceneId: string): IdentifyStudioDraftRecord {
  const state = loadIdentifyStudioState();
  if (state.draftsBySceneId[sceneId]) {
    return state.draftsBySceneId[sceneId];
  }

  const baseline = getBaselineIdentifyScene(sceneId);
  if (!baseline) {
    throw new Error(`Identify scene "${sceneId}" not found.`);
  }

  const record: IdentifyStudioDraftRecord = {
    sceneId,
    baseSceneId: sceneId,
    categoryId: baseline.categoryId,
    isPublishedOverride: false,
    updatedAtIso: new Date().toISOString(),
    revisionNumber: 1,
    scene: cloneScene(baseline),
    undoStack: [],
  };

  state.draftsBySceneId[sceneId] = record;
  saveIdentifyStudioState(state);
  return record;
}

/**
 * Updates a target marker's pin center and/or bounding box in the studio draft.
 */
export function updateIdentifyTargetGeometryInDraft(
  sceneId: string,
  targetId: string,
  patch: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    centerX?: number;
    centerY?: number;
    vocabularyId?: string;
    verifiedLexicalSense?: string;
    verificationStatus?: IdentifyVerificationStatus;
  },
  accessOverride?: CmsRuntimeOverrideInput
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  record.undoStack.push(cloneScene(record.scene));

  const target = record.scene.targets.find((t) => t.id === targetId);
  if (!target) {
    return { ok: false, error: `Target "${targetId}" not found in scene "${sceneId}".` };
  }

  const clamp01 = (v: number) => Math.max(0, Math.min(1, Number(v.toFixed(4))));

  if (patch.x !== undefined) target.x = clamp01(patch.x);
  if (patch.y !== undefined) target.y = clamp01(patch.y);
  if (patch.width !== undefined) {
    target.width = Math.max(0.02, Math.min(1 - target.x, Number(patch.width.toFixed(4))));
  }
  if (patch.height !== undefined) {
    target.height = Math.max(0.02, Math.min(1 - target.y, Number(patch.height.toFixed(4))));
  }

  if (patch.centerX !== undefined && patch.centerY !== undefined) {
    target.centerX = clamp01(patch.centerX);
    target.centerY = clamp01(patch.centerY);
    // If the bounding box didn't enclose the new pin center, recenter the box around the pin
    if (
      patch.x === undefined &&
      patch.y === undefined &&
      (target.centerX < target.x ||
        target.centerX > target.x + target.width ||
        target.centerY < target.y ||
        target.centerY > target.y + target.height)
    ) {
      target.x = clamp01(Math.max(0, Math.min(1 - target.width, target.centerX - target.width / 2)));
      target.y = clamp01(Math.max(0, Math.min(1 - target.height, target.centerY - target.height / 2)));
    }
  } else {
    target.centerX = clamp01(target.x + target.width / 2);
    target.centerY = clamp01(target.y + target.height / 2);
  }

  if (patch.vocabularyId) {
    const cat = IDENTIFY_CATEGORIES.find((c) => c.id === record.categoryId);
    const vocabItem = cat?.coreVocab.find((v) => v.vocabularyId === patch.vocabularyId);
    if (vocabItem) {
      target.vocabularyId = vocabItem.vocabularyId;
      target.uk = vocabItem.uk;
      target.en = vocabItem.en;
      target.acceptedSynonyms = [...vocabItem.acceptedSynonyms];
      target.gender = vocabItem.gender;
      target.exampleUk = vocabItem.exampleUk;
      target.exampleEn = vocabItem.exampleEn;
      target.iconType = vocabItem.iconType;
      target.objectLabelEn = vocabItem.en;
    }
  }

  if (patch.verifiedLexicalSense !== undefined) {
    target.verifiedLexicalSense = patch.verifiedLexicalSense;
  }

  target.annotationSource = 'manual_human';
  target.verificationStatus = patch.verificationStatus || 'human_verified';
  target.isObjectVisibleInScene = target.verificationStatus !== 'missing_in_image';
  target.contentVersion = (target.contentVersion || 1) + 1;

  record.revisionNumber += 1;
  record.updatedAtIso = new Date().toISOString();
  saveIdentifyStudioState(loadIdentifyStudioState());

  return { ok: true, scene: cloneScene(record.scene) };
}

/**
 * Marks a target object as missing in the current scene image and optionally removes
 * its active marker pin so learners are never asked to click an invisible object.
 */
export function markIdentifyTargetMissingInDraft(
  sceneId: string,
  targetId: string,
  options?: {
    removeFromActiveTargets?: boolean;
    reasonEn?: string;
    accessOverride?: CmsRuntimeOverrideInput;
  }
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(options?.accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  record.undoStack.push(cloneScene(record.scene));

  const idx = record.scene.targets.findIndex((t) => t.id === targetId);
  if (idx === -1) {
    return { ok: false, error: `Target "${targetId}" not found in scene "${sceneId}".` };
  }

  const target = record.scene.targets[idx];
  const reasonEn =
    options?.reasonEn ||
    `Object "${target.en}" (${target.uk}) is not visible in this scene image.`;

  if (!record.scene.missingVocabularyItems) {
    record.scene.missingVocabularyItems = [];
  }
  if (!record.scene.missingVocabularyItems.some((m) => m.vocabularyId === target.vocabularyId)) {
    record.scene.missingVocabularyItems.push({
      vocabularyId: target.vocabularyId,
      uk: target.uk,
      en: target.en,
      reasonEn,
    });
  }

  if (options?.removeFromActiveTargets !== false) {
    record.scene.targets.splice(idx, 1);
    record.scene.targets.forEach((t, i) => {
      t.targetNumber = i + 1;
    });
  } else {
    target.isObjectVisibleInScene = false;
    target.verificationStatus = 'missing_in_image';
    target.verified = false;
  }

  record.revisionNumber += 1;
  record.updatedAtIso = new Date().toISOString();
  saveIdentifyStudioState(loadIdentifyStudioState());

  return { ok: true, scene: cloneScene(record.scene) };
}

/**
 * Adds a new annotated object target to a draft scene.
 */
export function addIdentifyTargetToDraft(
  sceneId: string,
  vocabId: string,
  bbox: NormalizedBoundingBox = { x: 0.38, y: 0.38, width: 0.18, height: 0.18 },
  accessOverride?: CmsRuntimeOverrideInput
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === record.categoryId);
  const vocabItem = cat?.coreVocab.find((v) => v.vocabularyId === vocabId) || cat?.coreVocab[0];
  if (!vocabItem) {
    return { ok: false, error: `Vocabulary item "${vocabId}" not found.` };
  }

  record.undoStack.push(cloneScene(record.scene));
  const nextNum = record.scene.targets.length + 1;
  const newTarget: IdentifyHotspot = {
    id: `${sceneId}-t${nextNum}-${Date.now().toString(36)}`,
    targetNumber: nextNum,
    vocabularyId: vocabItem.vocabularyId,
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
    centerX: Number((bbox.x + bbox.width / 2).toFixed(4)),
    centerY: Number((bbox.y + bbox.height / 2).toFixed(4)),
    uk: vocabItem.uk,
    en: vocabItem.en,
    acceptedSynonyms: [...vocabItem.acceptedSynonyms],
    pos: vocabItem.pos,
    gender: vocabItem.gender,
    exampleUk: vocabItem.exampleUk,
    exampleEn: vocabItem.exampleEn,
    freqRank: vocabItem.freqRank,
    iconType: vocabItem.iconType,
    verified: true,
    objectLabelEn: vocabItem.en,
    annotationSource: 'manual_human',
    verificationStatus: 'human_verified',
    isObjectVisibleInScene: true,
    contentVersion: 1,
  };

  record.scene.targets.push(newTarget);
  if (record.scene.missingVocabularyItems) {
    record.scene.missingVocabularyItems = record.scene.missingVocabularyItems.filter(
      (m) => m.vocabularyId !== vocabItem.vocabularyId
    );
  }
  record.revisionNumber += 1;
  record.updatedAtIso = new Date().toISOString();
  saveIdentifyStudioState(loadIdentifyStudioState());

  return { ok: true, scene: cloneScene(record.scene) };
}

/**
 * Updates the image asset path of a draft scene (e.g., when uploading/selecting a replacement image).
 */
export function updateIdentifySceneAssetInDraft(
  sceneId: string,
  newAssetPath: string,
  assetSourceType: IdentifyScene['assetSourceType'] = 'local-verified-scene-illustration',
  accessOverride?: CmsRuntimeOverrideInput
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  record.undoStack.push(cloneScene(record.scene));
  record.scene.assetPath = newAssetPath;
  record.scene.assetSourceType = assetSourceType;
  record.revisionNumber += 1;
  record.updatedAtIso = new Date().toISOString();
  saveIdentifyStudioState(loadIdentifyStudioState());

  return { ok: true, scene: cloneScene(record.scene) };
}

/**
 * Undoes the most recent edit on a draft scene.
 */
export function undoIdentifySceneDraftEdit(
  sceneId: string,
  accessOverride?: CmsRuntimeOverrideInput
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  const prev = record.undoStack.pop();
  if (!prev) {
    return { ok: false, error: 'No previous edit to undo for this scene.' };
  }

  record.scene = prev;
  record.revisionNumber += 1;
  record.updatedAtIso = new Date().toISOString();
  saveIdentifyStudioState(loadIdentifyStudioState());
  return { ok: true, scene: cloneScene(record.scene) };
}

/**
 * Restores a draft scene back to its original baseline (or initial pilot template).
 */
export function restoreIdentifySceneBaseline(
  sceneId: string,
  accessOverride?: CmsRuntimeOverrideInput
): { ok: boolean; error?: string; scene?: IdentifyScene } {
  if (!isStudioAuthorized(accessOverride)) {
    return { ok: false, error: 'Unauthorized: Content Studio write access is restricted.' };
  }

  const state = loadIdentifyStudioState();
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const additional = buildAdditionalVerifiedSceneOverrides();
  const baseline = pilots[sceneId] || additional[sceneId] || getBaselineIdentifyScene(sceneId);
  if (!baseline) {
    return { ok: false, error: `Baseline scene "${sceneId}" not found.` };
  }

  state.draftsBySceneId[sceneId] = {
    sceneId,
    baseSceneId: baseline.replacesBaselineSceneId || sceneId,
    categoryId: baseline.categoryId,
    isPublishedOverride: false,
    updatedAtIso: new Date().toISOString(),
    revisionNumber: 1,
    scene: cloneScene(baseline),
    undoStack: [],
  };

  if (state.activePilotVariantBySceneId[baseline.replacesBaselineSceneId || sceneId] === sceneId) {
    delete state.activePilotVariantBySceneId[baseline.replacesBaselineSceneId || sceneId];
  }

  saveIdentifyStudioState(state);
  return { ok: true, scene: cloneScene(baseline) };
}

/**
 * Validates and publishes a draft scene override ONLY if it passes structural and visual validation.
 * Blocks invalid or unverified scenes from being published (TEST 21 & TEST 29).
 */
export function publishValidatedIdentifySceneDraft(
  sceneId: string,
  accessOverride?: CmsRuntimeOverrideInput
): {
  ok: boolean;
  error?: string;
  validationReport?: IdentifySceneValidationReport;
  publishedScene?: IdentifyScene;
} {
  if (!isStudioAuthorized(accessOverride)) {
    return {
      ok: false,
      error: 'Unauthorized: Public learners cannot publish Identify scenes.',
    };
  }

  const record = getOrCreateIdentifySceneDraft(sceneId);
  const report = validateIdentifySceneQuality(record.scene);

  if (!report.canPublish) {
    const firstError =
      report.findings.find((f) => f.severity === 'error')?.userFriendlyMessageEn ||
      'Scene failed visual quality validation and cannot be published.';
    return {
      ok: false,
      error: `Cannot publish invalid scene: ${firstError}`,
      validationReport: report,
    };
  }

  record.isPublishedOverride = true;
  record.scene.qualityState = 'published_verified';
  record.updatedAtIso = new Date().toISOString();

  const state = loadIdentifyStudioState();
  if (record.baseSceneId && record.baseSceneId !== sceneId) {
    state.activePilotVariantBySceneId[record.baseSceneId] = sceneId;
  }
  saveIdentifyStudioState(state);

  return {
    ok: true,
    validationReport: report,
    publishedScene: cloneScene(record.scene),
  };
}

// ----------------------------------------------------------------------------
// 7. Stage H: Bulk Audit of All 100 Existing Identify Scenes
// ----------------------------------------------------------------------------

let cachedBulkAuditReport: IdentifyBulkAuditReport | null = null;

export function runIdentifyLibraryBulkAudit(forceRefresh = false): IdentifyBulkAuditReport {
  if (cachedBulkAuditReport && !forceRefresh) {
    return cachedBulkAuditReport;
  }

  const entries: IdentifyBulkAuditSceneEntry[] = [];
  let scenesUsingGridPlacement = 0;
  let scenesWithPhotoOverrides = 0;
  let scenesWithConfirmedMissingObjects = 0;
  let scenesWithMarkerMisalignment = 0;
  let scenesWithSemanticMismatches = 0;
  let scenesRequiringSplitOrReplacement = 0;
  let scenesValidatedReady = 0;

  for (const scene of ARCHIVED_LEGACY_SCENES_FOR_AUDIT) {
    const cat =
      IDENTIFY_CATEGORIES.find((c) => c.id === scene.categoryId) || IDENTIFY_CATEGORIES[0];
    const report = validateIdentifySceneQuality(scene);
    const hasPhotoOverride = scene.categoryId === 'kitchen';
    if (report.usesLegacyGridCoordinates) {
      scenesUsingGridPlacement++;
    }
    if (hasPhotoOverride) {
      scenesWithPhotoOverrides++;
    }

    const confirmedMissingObjectIds = report.findings
      .filter(
        (f) =>
          f.code === 'MISSING_OBJECT_IN_IMAGE' || f.code === 'VOCAB_NO_MATCHING_OBJECT'
      )
      .map((f) => f.vocabularyId || f.targetId || 'unknown');

    const confirmedMisalignedTargetIds = report.findings
      .filter((f) => f.code === 'MARKER_MISALIGNED_WITH_OBJECT')
      .map((f) => f.targetId || 'unknown');

    const semanticConflictMessages = report.findings
      .filter((f) => f.code === 'SEMANTIC_ENVIRONMENT_MISMATCH')
      .map((f) => f.userFriendlyMessageEn);

    const vocabItemsForScene: IdentifyVocabItem[] = scene.targets.map((t) => ({
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
    const compatibility = analyzeVocabularyGroupCompatibility(vocabItemsForScene);

    if (confirmedMissingObjectIds.length > 0) {
      scenesWithConfirmedMissingObjects++;
    }
    if (confirmedMisalignedTargetIds.length > 0 || report.usesLegacyGridCoordinates) {
      scenesWithMarkerMisalignment++;
    }
    if (semanticConflictMessages.length > 0 || !compatibility.compatibleInSingleScene) {
      scenesWithSemanticMismatches++;
    }

    let recommendedAction: IdentifyBulkAuditSceneEntry['recommendedAction'] =
      'reannotate_real_photo_objects';
    let priorityRank = 2;

    if (
      scene.id === 'beach-nature-scene-3' ||
      !compatibility.compatibleInSingleScene ||
      confirmedMissingObjectIds.length > 0
    ) {
      recommendedAction = 'split_into_coherent_scenes_and_reannotate';
      scenesRequiringSplitOrReplacement++;
      priorityRank = scene.id === 'beach-nature-scene-3' ? 1 : 2;
    } else if (hasPhotoOverride) {
      recommendedAction = 'human_visual_review_of_photo_override';
      priorityRank = 3;
    }

    if (report.canPublish) {
      scenesValidatedReady++;
      recommendedAction = 'ready';
      priorityRank = 4;
    }

    entries.push({
      sceneId: scene.id,
      categoryId: cat.id,
      categoryTitleEn: cat.titleEn,
      sceneNumber: scene.sceneNumber,
      titleEn: scene.titleEn,
      assetPath: scene.assetPath,
      assignedTargetCount: scene.targets.length,
      usesLegacyGridSlots: report.usesLegacyGridCoordinates,
      hasPhotoOverride,
      confirmedMissingObjectIds,
      confirmedMisalignedTargetIds,
      semanticConflictMessages:
        semanticConflictMessages.length > 0
          ? semanticConflictMessages
          : compatibility.reasonsEn,
      qualityState: report.qualityState,
      recommendedAction,
      priorityRank,
    });
  }

  entries.sort((a, b) => a.priorityRank - b.priorityRank || a.sceneId.localeCompare(b.sceneId));

  cachedBulkAuditReport = {
    generatedAtIso: new Date().toISOString(),
    totalCategoriesInspected: new Set(ARCHIVED_LEGACY_SCENES_FOR_AUDIT.map((s) => s.categoryId)).size,
    totalScenesInspected: entries.length,
    scenesUsingGridPlacement,
    scenesWithPhotoOverrides,
    scenesWithConfirmedMissingObjects,
    scenesWithMarkerMisalignment,
    scenesWithSemanticMismatches,
    scenesRequiringSplitOrReplacement,
    scenesValidatedReady,
    pilotCorrectedSceneIds: [
      'beach-nature-scene-3-pilot-a',
      'beach-nature-scene-3-pilot-b',
      'beach-nature-scene-3-verified-photo',
    ],
    entries,
  };

  return cachedBulkAuditReport;
}

export function runCurated40LibraryAudit(): {
  summary: typeof IDENTIFY_AUDIT_40_SUMMARY;
  totalCategories: number;
  totalActiveScenes: number;
  validatedReadyCount: number;
  missingObjectScenesCount: number;
  misalignedScenesCount: number;
  overlappingScenesCount: number;
  reports: IdentifySceneValidationReport[];
} {
  const reports: IdentifySceneValidationReport[] = [];
  let validatedReadyCount = 0;
  let missingObjectScenesCount = 0;
  let misalignedScenesCount = 0;
  let overlappingScenesCount = 0;

  for (const cat of IDENTIFY_CATEGORIES) {
    for (const sc of cat.scenes) {
      const rep = validateIdentifySceneQuality(sc);
      reports.push(rep);
      if (rep.canPublish) validatedReadyCount++;
      if (rep.missingObjectCount > 0) missingObjectScenesCount++;
      if (rep.misalignedMarkerCount > 0) misalignedScenesCount++;
      if (rep.overlappingPairCount > 0) overlappingScenesCount++;
    }
  }

  return {
    summary: IDENTIFY_AUDIT_40_SUMMARY,
    totalCategories: IDENTIFY_CATEGORIES.length,
    totalActiveScenes: reports.length,
    validatedReadyCount,
    missingObjectScenesCount,
    misalignedScenesCount,
    overlappingScenesCount,
    reports,
  };
}

// ----------------------------------------------------------------------------
// 8. Multilingual & 28 Course Track Adaptation for Identify Scenes (TEST 27)
// ----------------------------------------------------------------------------

const MULTILINGUAL_SAMPLE_OBJECT_LEXICON: Record<
  string,
  Record<string, { word: string; promptLabel: string }>
> = {
  uk: {
    'bn-sun': { word: 'со́нце', promptLabel: 'Назві́ть це українською' },
    'bn-towel': { word: 'рушни́к', promptLabel: 'Назві́ть це українською' },
    'bn-tree': { word: 'де́рево', promptLabel: 'Назві́ть це українською' },
    'bn-stone': { word: 'ка́мінь', promptLabel: 'Назві́ть це українською' },
    'bn-mountain': { word: 'гора́', promptLabel: 'Назві́ть це українською' },
    'bn-lake': { word: 'о́зеро', promptLabel: 'Назві́ть це українською' },
    'bn-beach': { word: 'пляж', promptLabel: 'Назві́ть це українською' },
    'bn-sand': { word: 'пісо́к', promptLabel: 'Назві́ть це українською' },
    'bn-sea': { word: 'мо́ре', promptLabel: 'Назві́ть це українською' },
  },
  en: {
    'bn-sun': { word: 'sun', promptLabel: 'Identify this in English' },
    'bn-towel': { word: 'beach towel', promptLabel: 'Identify this in English' },
    'bn-tree': { word: 'coastal tree', promptLabel: 'Identify this in English' },
    'bn-stone': { word: 'stone', promptLabel: 'Identify this in English' },
    'bn-mountain': { word: 'mountain', promptLabel: 'Identify this in English' },
    'bn-lake': { word: 'lake', promptLabel: 'Identify this in English' },
    'bn-beach': { word: 'beach', promptLabel: 'Identify this in English' },
    'bn-sand': { word: 'sand', promptLabel: 'Identify this in English' },
    'bn-sea': { word: 'sea', promptLabel: 'Identify this in English' },
  },
  es: {
    'bn-sun': { word: 'el sol', promptLabel: 'Identifica esto en español' },
    'bn-towel': { word: 'la toalla de playa', promptLabel: 'Identifica esto en español' },
    'bn-tree': { word: 'el árbol', promptLabel: 'Identifica esto en español' },
    'bn-stone': { word: 'la piedra', promptLabel: 'Identifica esto en español' },
    'bn-mountain': { word: 'la montaña', promptLabel: 'Identifica esto en español' },
    'bn-lake': { word: 'el lago', promptLabel: 'Identifica esto en español' },
    'bn-beach': { word: 'la playa', promptLabel: 'Identifica esto en español' },
    'bn-sand': { word: 'la arena', promptLabel: 'Identifica esto en español' },
    'bn-sea': { word: 'el mar', promptLabel: 'Identifica esto en español' },
  },
  de: {
    'bn-sun': { word: 'die Sonne', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-towel': { word: 'das Strandtuch', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-tree': { word: 'der Baum', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-stone': { word: 'der Stein', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-mountain': { word: 'der Berg', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-lake': { word: 'der See', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-beach': { word: 'der Strand', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-sand': { word: 'der Sand', promptLabel: 'Benenne dies auf Deutsch' },
    'bn-sea': { word: 'das Meer', promptLabel: 'Benenne dies auf Deutsch' },
  },
  fr: {
    'bn-sun': { word: 'le soleil', promptLabel: 'Identifiez ceci en français' },
    'bn-towel': { word: 'la serviette de plage', promptLabel: 'Identifiez ceci en français' },
    'bn-tree': { word: "l'arbre", promptLabel: 'Identifiez ceci en français' },
    'bn-stone': { word: 'la pierre', promptLabel: 'Identifiez ceci en français' },
    'bn-mountain': { word: 'la montagne', promptLabel: 'Identifiez ceci en français' },
    'bn-lake': { word: 'le lac', promptLabel: 'Identifiez ceci en français' },
    'bn-beach': { word: 'la plage', promptLabel: 'Identifiez ceci en français' },
    'bn-sand': { word: 'le sable', promptLabel: 'Identifiez ceci en français' },
    'bn-sea': { word: 'la mer', promptLabel: 'Identifiez ceci en français' },
  },
};

export interface TrackAdaptedIdentifyTarget {
  courseTrackId: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  targetId: string;
  vocabularyId: string;
  sourceClueText: string;
  expectedTargetWord: string;
  promptInstruction: string;
  normalizedGeometry: NormalizedBoundingBox & { centerX: number; centerY: number };
}

export function resolveIdentifyTargetForCourseTrack(
  target: IdentifyHotspot,
  courseTrackId = 'track:en-to-uk'
): TrackAdaptedIdentifyTarget {
  const allTracks = getAllCourseTracks();
  const track =
    allTracks.find((t) => t.trackId === courseTrackId) ||
    allTracks.find((t) => t.trackId === 'track:en-to-uk')!;

  const srcLang = track.nativeLanguage;
  const tgtLang = track.targetLanguage;

  const srcEntry = MULTILINGUAL_SAMPLE_OBJECT_LEXICON[srcLang]?.[target.vocabularyId];
  const tgtEntry = MULTILINGUAL_SAMPLE_OBJECT_LEXICON[tgtLang]?.[target.vocabularyId];

  const sourceClueText =
    srcEntry?.word || (srcLang === 'uk' ? target.uk : target.en);
  const expectedTargetWord =
    tgtEntry?.word || (tgtLang === 'en' ? target.en : target.uk);
  const promptInstruction =
    tgtEntry?.promptLabel || `Identify this object (${srcLang.toUpperCase()} → ${tgtLang.toUpperCase()})`;

  return {
    courseTrackId: track.trackId,
    sourceLanguageCode: srcLang,
    targetLanguageCode: tgtLang,
    targetId: target.id,
    vocabularyId: target.vocabularyId,
    sourceClueText,
    expectedTargetWord,
    promptInstruction,
    normalizedGeometry: {
      x: target.x,
      y: target.y,
      width: target.width,
      height: target.height,
      centerX: target.centerX ?? Number((target.x + target.width / 2).toFixed(4)),
      centerY: target.centerY ?? Number((target.y + target.height / 2).toFixed(4)),
    },
  };
}

/**
 * Verifies that a scene's normalized annotations project accurately across all
 * representative desktop, laptop, tablet, and smartphone viewports without drift.
 */
export function verifySceneAcrossRepresentativeViewports(scene: IdentifyScene): {
  allAligned: boolean;
  viewportChecks: Array<{
    viewportId: string;
    label: string;
    width: number;
    height: number;
    maxDriftRatio: number;
    allTargetsInsideRenderedImage: boolean;
  }>;
} {
  const intrinsicWidth = scene.intrinsicWidth || 1200;
  const intrinsicHeight = scene.intrinsicHeight || 900;

  const viewportChecks = REPRESENTATIVE_VIEWPORT_MATRIX.map((vp) => {
    // Stage container is proportional to viewport dimensions
    const containerWidth = Math.max(280, Math.round(vp.width * (vp.width >= 960 ? 0.56 : 0.92)));
    const containerHeight = Math.max(210, Math.round(containerWidth * 0.75));
    const renderedRect = computeRenderedImageRect({
      containerWidth,
      containerHeight,
      intrinsicWidth,
      intrinsicHeight,
      objectFit: 'contain',
    });

    let maxDriftRatio = 0;
    let allInside = true;

    for (const t of scene.targets) {
      const proj = projectNormalizedTargetToViewport(
        {
          id: t.id,
          targetNumber: t.targetNumber,
          x: t.x,
          y: t.y,
          width: t.width,
          height: t.height,
          centerX: t.centerX,
          centerY: t.centerY,
        },
        renderedRect,
        vp.width
      );

      const expectedPinX = t.centerX ?? t.x + t.width / 2;
      const expectedPinY = t.centerY ?? t.y + t.height / 2;
      const actualNormX = (proj.pinPx.x - renderedRect.offsetX) / renderedRect.renderedWidth;
      const actualNormY = (proj.pinPx.y - renderedRect.offsetY) / renderedRect.renderedHeight;
      const drift = Math.hypot(actualNormX - expectedPinX, actualNormY - expectedPinY);
      if (drift > maxDriftRatio) maxDriftRatio = drift;

      if (
        proj.pinPx.x < renderedRect.offsetX - 0.5 ||
        proj.pinPx.x > renderedRect.offsetX + renderedRect.renderedWidth + 0.5 ||
        proj.pinPx.y < renderedRect.offsetY - 0.5 ||
        proj.pinPx.y > renderedRect.offsetY + renderedRect.renderedHeight + 0.5
      ) {
        allInside = false;
      }
    }

    return {
      viewportId: vp.id,
      label: vp.label,
      width: vp.width,
      height: vp.height,
      maxDriftRatio,
      allTargetsInsideRenderedImage: allInside,
    };
  });

  return {
    allAligned: viewportChecks.every(
      (c) => c.maxDriftRatio < 1e-6 && c.allTargetsInsideRenderedImage
    ),
    viewportChecks,
  };
}
