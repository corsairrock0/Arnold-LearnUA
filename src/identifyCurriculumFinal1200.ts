// ============================================================================
// LANGO IDENTIFY — FINAL 1,200-CONCEPT CURRICULUM RECONCILIATION &
// 80-SCENE CONTEMPORARY UKRAINIAN PHOTOREALISTIC CURRICULUM PLAN
// ============================================================================
// Phase 2 & Phase 3 Deliverable:
// 1. Reconciles the 2,000-noun Phase 1 curation pool (1,179 provisional KEEP,
//    323 REVIEW, 498 EXCLUDE) + the 34 protected genuine missing everyday
//    concepts into the exact 1,200-concept final Identify curriculum:
//    - 28 visually teachable clickable missing concepts added as extension
//      entries (`ext-v1-0001`..`ext-v1-0028`, `missing-concept-0001`..`0028`).
//    - 6 contextual-only setting/role missing words (`ву́лиця`, `пло́ща`,
//      `ри́нок`, `університе́т`, `інжене́р`, `програмі́ст`) documented as
//      non-clickable scene-setting/role context (`ctx-v1-0001`..`ctx-v1-0006`).
//    - 14 redundant or lower-value provisional KEEPs demoted (9 cross-batch
//      overlapping headwords + 5 Batch 5 shortlist-reconciliation items),
//      reducing 1,179 provisional KEEPs to 1,165 retained KEEPs.
//    - 7 high-value, visually unmistakable REVIEW items promoted to KEEP
//      (`id-v2-209` суша́рка для по́суду, `id-v2-896` кали́на, `id-v2-890` бере́за,
//      `id-v2-1126` сопі́лка, `id-v2-1191` ту́рка / дже́зва, `id-v2-999` тоно́метр,
//      `id-v2-853` рукави́ці), bringing the final curriculum to:
//      1,165 + 7 + 28 = 1,200 unique, canonical, visually teachable concepts.
// 2. Allocates all 1,200 final concepts across 80 contemporary Ukrainian
//    photorealistic scenes (`languageCode: 'uk'`), with 18 targets per scene
//    (1,440 total scene-word associations; 1,200 unique + 240 spiral review
//    reinforcements of high-frequency essential nouns).
// 3. Enforces learner safety: only the 10 verified photographic/SVG scenes
//    (49 verified active hotspots) are exposed to students; all 70 ungenerated
//    scenes (and 1,391 unverified target associations) remain strictly gated
//    behind `learnerExposureAllowed: false` until AI Studio image generation
//    quota is restored and human hotspot verification is completed.
// ============================================================================

import {
  BATCH_1_CANDIDATE_REVIEWS,
  BATCH_2_CANDIDATE_REVIEWS,
  BATCH_3_CANDIDATE_REVIEWS,
  BATCH_4_CANDIDATE_REVIEWS,
  BATCH_5_CANDIDATE_REVIEWS,
  BATCH_6_CANDIDATE_REVIEWS,
  BATCH_7_CANDIDATE_REVIEWS,
  BATCH_8_CANDIDATE_REVIEWS,
  BATCH_9_CANDIDATE_REVIEWS,
  BATCH_10_CANDIDATE_REVIEWS,
  IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER,
  IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS,
  type IdentifyCandidateReviewRecord,
  type IdentifyCurriculumPriorityLevel,
  type IdentifyVisualSceneFraming,
} from './identifyCurriculumCurationPhase1.ts';
import {
  getPlayableIdentifyCategories,
  getApprovedLearnerTargets,
  IDENTIFY_MASTER_2000_NOUNS,
} from './identifyData.ts';

// // ----------------------------------------------------------------------------
// 1. 34 Protected Missing Concepts -> 28 Clickable Visual Extensions + 6 Contextual
//    (Plus Retired Outdated Pre-Batch-4 Extension Audit Registry)
// ----------------------------------------------------------------------------

export interface IdentifyRetiredOutdatedExtensionRecord {
  retiredVocabularyId: string;
  retiredConceptId: string;
  uk: string;
  en: string;
  retirementStatus: 'retired_never_reused';
  retirementReasonCategory:
    | 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP'
    | 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34';
  collidingLegacyVocabularyId: string | null;
  collidingLegacyBatchNumber: number | null;
  retirementExplanationEn: string;
}

export const IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28: readonly IdentifyRetiredOutdatedExtensionRecord[] = [
  {
    retiredVocabularyId: 'ext-v1-0001',
    retiredConceptId: 'missing-concept-0001',
    uk: 'серве́тка',
    en: 'napkin / tissue',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'dr-napkin',
    collidingLegacyBatchNumber: 1,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 1 KEEP dr-napkin (серве́тка, napkin).',
  },
  {
    retiredVocabularyId: 'ext-v1-0002',
    retiredConceptId: 'missing-concept-0002',
    uk: 'зубочи́стка',
    en: 'toothpick',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: null,
    collidingLegacyBatchNumber: null,
    retirementExplanationEn: 'Retired: came from outdated pre-Batch-4 list rather than IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS (countsAsMissingConcept === true).',
  },
  {
    retiredVocabularyId: 'ext-v1-0003',
    retiredConceptId: 'missing-concept-0003',
    uk: 'ва́за',
    en: 'flower vase',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-264',
    collidingLegacyBatchNumber: 3,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 3 KEEP id-v2-264 (ва́за, vase).',
  },
  {
    retiredVocabularyId: 'ext-v1-0004',
    retiredConceptId: 'missing-concept-0004',
    uk: 'гребіне́ць',
    en: 'hair comb',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-304',
    collidingLegacyBatchNumber: 2,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 2 KEEP id-v2-304 (гребіне́ць, comb).',
  },
  {
    retiredVocabularyId: 'ext-v1-0005',
    retiredConceptId: 'missing-concept-0005',
    uk: 'гу́мка для воло́сся',
    en: 'hair tie / scrunchie',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-1516',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-1516 (гу́мка для воло́сся, hair tie / scrunchie).',
  },
  {
    retiredVocabularyId: 'ext-v1-0006',
    retiredConceptId: 'missing-concept-0006',
    uk: 'шпи́лька для воло́сся',
    en: 'hairpin / bobby pin',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-1514',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-1514 (шпи́лька для воло́сся, hairpin / barrette).',
  },
  {
    retiredVocabularyId: 'ext-v1-0007',
    retiredConceptId: 'missing-concept-0007',
    uk: 'дезодора́нт',
    en: 'deodorant',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-309',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-309 (дезодора́нт, Batch 5 REVIEW) and not among the 34 genuine missing concepts.',
  },
  {
    retiredVocabularyId: 'ext-v1-0008',
    retiredConceptId: 'missing-concept-0008',
    uk: 'серце́',
    en: 'heart',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-1041',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-1041 (се́рце, Batch 5 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0009',
    retiredConceptId: 'missing-concept-0009',
    uk: 'кров',
    en: 'blood (blood sample tube)',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-1019',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-1019 (ана́ліз кро́ві, Batch 5 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0010',
    retiredConceptId: 'missing-concept-0010',
    uk: 'сльоза́',
    en: 'teardrop',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: null,
    collidingLegacyBatchNumber: null,
    retirementExplanationEn: 'Retired: came from outdated pre-Batch-4 list rather than IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS (countsAsMissingConcept === true).',
  },
  {
    retiredVocabularyId: 'ext-v1-0011',
    retiredConceptId: 'missing-concept-0011',
    uk: 'синя́к',
    en: 'bruise',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-1022',
    collidingLegacyBatchNumber: 2,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-1022 (сине́ць, Batch 2 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0012',
    retiredConceptId: 'missing-concept-0012',
    uk: 'опі́к',
    en: 'burn mark',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-1023',
    collidingLegacyBatchNumber: 3,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-1023 (опі́к, Batch 3 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0013',
    retiredConceptId: 'missing-concept-0013',
    uk: 'кефі́р',
    en: 'kefir (fermented milk drink)',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-492',
    collidingLegacyBatchNumber: 2,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-492 (кефі́р, Batch 2 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0014',
    retiredConceptId: 'missing-concept-0014',
    uk: 'ря́жанка',
    en: 'ryazhanka (baked fermented milk)',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-1275',
    collidingLegacyBatchNumber: 9,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-1275 (ря́жанка, Batch 9 REVIEW) and not among the 34 genuine missing concepts.',
  },
  {
    retiredVocabularyId: 'ext-v1-0015',
    retiredConceptId: 'missing-concept-0015',
    uk: 'ковба́ска',
    en: 'sausage link',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-499',
    collidingLegacyBatchNumber: 2,
    retirementExplanationEn: 'Retired: covered by accepted Batch 2 KEEP id-v2-499 (ковбаса́, sausage) and id-v2-500 (соси́ска, frankfurter).',
  },
  {
    retiredVocabularyId: 'ext-v1-0016',
    retiredConceptId: 'missing-concept-0016',
    uk: 'лава́ш',
    en: 'flatbread (lavash)',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-1298',
    collidingLegacyBatchNumber: 8,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 8 KEEP id-v2-1298 (лава́ш, flatbread (lavash)).',
  },
  {
    retiredVocabularyId: 'ext-v1-0017',
    retiredConceptId: 'missing-concept-0017',
    uk: 'кетчу́п',
    en: 'ketchup',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-532',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-532 (ке́тчуп, ketchup).',
  },
  {
    retiredVocabularyId: 'ext-v1-0018',
    retiredConceptId: 'missing-concept-0018',
    uk: 'майоне́з',
    en: 'mayonnaise',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-533',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-533 (майоне́з, mayonnaise).',
  },
  {
    retiredVocabularyId: 'ext-v1-0019',
    retiredConceptId: 'missing-concept-0019',
    uk: 'узва́р',
    en: 'uzvar (Ukrainian dried-fruit compote)',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-587',
    collidingLegacyBatchNumber: 3,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-587 (узва́р, Batch 3 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0020',
    retiredConceptId: 'missing-concept-0020',
    uk: 'квас',
    en: 'kvass',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-588',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-588 (квас, Batch 5 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0021',
    retiredConceptId: 'missing-concept-0021',
    uk: 'бага́ття',
    en: 'campfire / bonfire',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-948',
    collidingLegacyBatchNumber: 4,
    retirementExplanationEn: 'Retired: semantic and synonym collision with accepted Batch 4 KEEP id-v2-948 (во́гнище / бага́ття, campfire).',
  },
  {
    retiredVocabularyId: 'ext-v1-0022',
    retiredConceptId: 'missing-concept-0022',
    uk: 'калю́жа',
    en: 'rain puddle',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-934',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-934 (калю́жа, Batch 5 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0023',
    retiredConceptId: 'missing-concept-0023',
    uk: 'буру́лька',
    en: 'icicle',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-936',
    collidingLegacyBatchNumber: 4,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 4 KEEP id-v2-936 (буру́лька, icicle).',
  },
  {
    retiredVocabularyId: 'ext-v1-0024',
    retiredConceptId: 'missing-concept-0024',
    uk: 'за́єць',
    en: 'hare / wild rabbit',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-975',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-975 (за́єць, hare).',
  },
  {
    retiredVocabularyId: 'ext-v1-0025',
    retiredConceptId: 'missing-concept-0025',
    uk: 'коза́',
    en: 'goat',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-965',
    collidingLegacyBatchNumber: 7,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 7 KEEP id-v2-965 (коза́, goat).',
  },
  {
    retiredVocabularyId: 'ext-v1-0026',
    retiredConceptId: 'missing-concept-0026',
    uk: 'інди́к',
    en: 'live turkey',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-969',
    collidingLegacyBatchNumber: 3,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-969 (інди́к, Batch 3 REVIEW) and reclassified as non-missing in Batch 4.',
  },
  {
    retiredVocabularyId: 'ext-v1-0027',
    retiredConceptId: 'missing-concept-0027',
    uk: 'мура́ха',
    en: 'ant',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'DUPLICATE_OF_ACCEPTED_LEGACY_KEEP',
    collidingLegacyVocabularyId: 'id-v2-994',
    collidingLegacyBatchNumber: 5,
    retirementExplanationEn: 'Retired: directly duplicates accepted Batch 5 KEEP id-v2-994 (мура́ха, ant).',
  },
  {
    retiredVocabularyId: 'ext-v1-0028',
    retiredConceptId: 'missing-concept-0028',
    uk: 'му́ха',
    en: 'housefly',
    retirementStatus: 'retired_never_reused',
    retirementReasonCategory: 'PRE_BATCH_4_OUTDATED_GAP_CANDIDATE_NOT_IN_GENUINE_34',
    collidingLegacyVocabularyId: 'id-v2-996',
    collidingLegacyBatchNumber: 4,
    retirementExplanationEn: 'Retired: already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-996 (му́ха, Batch 4 REVIEW) and reclassified as non-missing in Batch 4.',
  },
];

export interface IdentifyMissingConceptExtensionEntry {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  originalAuditProposedUk: string;
  en: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  recommendedPriority: 'essential_everyday' | 'common_situational';
  recommendedVisualFraming: IdentifyVisualSceneFraming;
  imageHotspotSuitability:
    | 'high_direct_object_or_region'
    | 'requires_contextual_framing_or_container';
  domainId: string;
  candidateSceneCategories: readonly string[];
  acceptedSynonymsUk: readonly string[];
  visualHotspotDescriptionEn: string;
}

export interface IdentifyContextualNonClickableMissingEntry {
  contextualId: string;
  uk: string;
  en: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  domainId: string;
  reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT';
  rationaleEn: string;
}

export const IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28: readonly IdentifyMissingConceptExtensionEntry[] = [
  {
    vocabularyId: 'ext-v2-0001',
    conceptId: 'missing-concept-v2-0001',
    uk: 'дріт',
    originalAuditProposedUk: 'дріт',
    en: 'electrical wire / cord',
    gender: 'm',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'home_and_furniture',
    candidateSceneCategories: ['home-workshop', 'office', 'living-room'],
    acceptedSynonymsUk: ['дріт', 'електри́чний дріт', 'про́від'],
    visualHotspotDescriptionEn: 'Insulated copper electrical wire spool and appliance cord on a Ukrainian home workshop bench.',
  },
  {
    vocabularyId: 'ext-v2-0002',
    conceptId: 'missing-concept-v2-0002',
    uk: 'вода́',
    originalAuditProposedUk: 'вода́',
    en: 'water (glass/pitcher of water)',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'food_and_drinks',
    candidateSceneCategories: ['kitchen', 'dining-room', 'cafe', 'restaurant'],
    acceptedSynonymsUk: ['вода́', 'питна́ вода́', 'скля́нка води́'],
    visualHotspotDescriptionEn: 'Clear glass pitcher and pouring stream of drinking water on a dining table (non-overlapping with empty glass tumbler).',
  },
  {
    vocabularyId: 'ext-v2-0003',
    conceptId: 'missing-concept-v2-0003',
    uk: 'чай',
    originalAuditProposedUk: 'чай',
    en: 'tea (cup/pot of tea)',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'food_and_drinks',
    candidateSceneCategories: ['kitchen', 'cafe', 'dining-room', 'restaurant'],
    acceptedSynonymsUk: ['чай', 'ча́шка ча́ю', 'чо́рний чай'],
    visualHotspotDescriptionEn: 'Amber brewed tea with a visible tea bag tag and lemon slice in a transparent glass mug.',
  },
  {
    vocabularyId: 'ext-v2-0004',
    conceptId: 'missing-concept-v2-0004',
    uk: 'сік',
    originalAuditProposedUk: 'сік',
    en: 'juice (glass/carton of juice)',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'food_and_drinks',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket', 'cafe'],
    acceptedSynonymsUk: ['сік', 'фрукто́вий сік', 'апельси́новий сік'],
    visualHotspotDescriptionEn: 'Carton labeled Сік and filled glass of bright orange juice on a Ukrainian breakfast table.',
  },
  {
    vocabularyId: 'ext-v2-0005',
    conceptId: 'missing-concept-v2-0005',
    uk: 'суп',
    originalAuditProposedUk: 'суп',
    en: 'soup',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'food_and_drinks',
    candidateSceneCategories: ['dining-room', 'kitchen', 'restaurant', 'cafe'],
    acceptedSynonymsUk: ['суп', 'ку́рячий суп', 'овоче́вий суп'],
    visualHotspotDescriptionEn: 'Steaming golden broth soup with diced carrots, potatoes, and herbs in a wide ceramic soup bowl.',
  },
  {
    vocabularyId: 'ext-v2-0006',
    conceptId: 'missing-concept-v2-0006',
    uk: 'м’я́со',
    originalAuditProposedUk: 'м’я́со',
    en: 'meat',
    gender: 'n',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'food_and_drinks',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    acceptedSynonymsUk: ['м’я́со', 'сві́же м’я́со'],
    visualHotspotDescriptionEn: 'Fresh butcher cut of red meat displayed on a Ukrainian market butcher counter with Cyrillic label М’ясо.',
  },
  {
    vocabularyId: 'ext-v2-0007',
    conceptId: 'missing-concept-v2-0007',
    uk: 'живі́т',
    originalAuditProposedUk: 'живі́т',
    en: 'stomach / belly',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'body_parts',
    candidateSceneCategories: ['hospital-pharmacy', 'gym-fitness'],
    acceptedSynonymsUk: ['живі́т', 'черево'],
    visualHotspotDescriptionEn: 'Clearly delineated abdominal / belly region on a clinical human anatomy wall chart or medical checkup scene.',
  },
  {
    vocabularyId: 'ext-v2-0008',
    conceptId: 'missing-concept-v2-0008',
    uk: 'брова́',
    originalAuditProposedUk: 'брова́',
    en: 'eyebrow',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'body_parts',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom', 'bathroom'],
    acceptedSynonymsUk: ['брова́', 'бро́ви'],
    visualHotspotDescriptionEn: 'Clearly visible eyebrow arch above the eye in a close-up facial portrait illustration.',
  },
  {
    vocabularyId: 'ext-v2-0009',
    conceptId: 'missing-concept-v2-0009',
    uk: 'губа́',
    originalAuditProposedUk: 'губа́ / гу́би',
    en: 'lip / lips',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'body_parts',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom', 'bathroom'],
    acceptedSynonymsUk: ['губа́', 'гу́би', 'губа́ / гу́би'],
    visualHotspotDescriptionEn: 'Clearly visible upper and lower lips in a close-up facial anatomy portrait.',
  },
  {
    vocabularyId: 'ext-v2-0010',
    conceptId: 'missing-concept-v2-0010',
    uk: 'щока́',
    originalAuditProposedUk: 'щока́',
    en: 'cheek',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'body_parts',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom', 'bathroom'],
    acceptedSynonymsUk: ['щока́', 'що́ки'],
    visualHotspotDescriptionEn: 'Clearly defined facial cheek region between cheekbone and jawline in a close-up portrait.',
  },
  {
    vocabularyId: 'ext-v2-0011',
    conceptId: 'missing-concept-v2-0011',
    uk: 'лі́коть',
    originalAuditProposedUk: 'лі́коть',
    en: 'elbow',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'body_parts',
    candidateSceneCategories: ['hospital-pharmacy', 'gym-fitness'],
    acceptedSynonymsUk: ['лі́коть', 'лі́кті'],
    visualHotspotDescriptionEn: 'Bent outer elbow joint clearly visible on a short-sleeved arm in a medical/anatomy scene.',
  },
  {
    vocabularyId: 'ext-v2-0012',
    conceptId: 'missing-concept-v2-0012',
    uk: 'ма́ма',
    originalAuditProposedUk: 'ма́ма',
    en: 'mother / mom',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'family_and_people',
    candidateSceneCategories: ['living-room', 'dining-room', 'park-garden'],
    acceptedSynonymsUk: ['ма́ма', 'ма́ти', 'мату́ся'],
    visualHotspotDescriptionEn: 'Mother holding her young child alongside the father and grandparents in a multi-generation Ukrainian family portrait.',
  },
  {
    vocabularyId: 'ext-v2-0013',
    conceptId: 'missing-concept-v2-0013',
    uk: 'ба́тько',
    originalAuditProposedUk: 'ба́тько / та́то',
    en: 'father / dad',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'family_and_people',
    candidateSceneCategories: ['living-room', 'dining-room', 'park-garden'],
    acceptedSynonymsUk: ['ба́тько', 'та́то', 'ба́тько / та́то'],
    visualHotspotDescriptionEn: 'Father standing with his arm around his child and spouse in a multi-generation Ukrainian family portrait.',
  },
  {
    vocabularyId: 'ext-v2-0014',
    conceptId: 'missing-concept-v2-0014',
    uk: 'підло́га',
    originalAuditProposedUk: 'підло́га',
    en: 'floor',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'home_and_furniture',
    candidateSceneCategories: ['living-room', 'bedroom', 'hallway-entry', 'kitchen'],
    acceptedSynonymsUk: ['підло́га', 'дерев’я́на підло́га'],
    visualHotspotDescriptionEn: 'Exposed herringbone oak parquet flooring plane in an interior room (separate from any area rug).',
  },
  {
    vocabularyId: 'ext-v2-0015',
    conceptId: 'missing-concept-v2-0015',
    uk: 'сте́ля',
    originalAuditProposedUk: 'сте́ля',
    en: 'ceiling',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'home_and_furniture',
    candidateSceneCategories: ['living-room', 'bedroom', 'dining-room'],
    acceptedSynonymsUk: ['сте́ля'],
    visualHotspotDescriptionEn: 'Upper white plaster ceiling plane with crown molding in an apartment room (separate from the chandelier).',
  },
  {
    vocabularyId: 'ext-v2-0016',
    conceptId: 'missing-concept-v2-0016',
    uk: 'стіна́',
    originalAuditProposedUk: 'стіна́',
    en: 'wall',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'home_and_furniture',
    candidateSceneCategories: ['living-room', 'bedroom', 'hallway-entry', 'office'],
    acceptedSynonymsUk: ['стіна́', 'сті́ни'],
    visualHotspotDescriptionEn: 'Unobstructed vertical interior room wall surface (separate from windows, doors, or wall frames).',
  },
  {
    vocabularyId: 'ext-v2-0017',
    conceptId: 'missing-concept-v2-0017',
    uk: 'гро́ші',
    originalAuditProposedUk: 'гро́ші',
    en: 'money / cash',
    gender: 'pl',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'personal_belongings',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'cafe', 'city-streets'],
    acceptedSynonymsUk: ['гро́ші', 'готі́вка', 'гри́вні'],
    visualHotspotDescriptionEn: 'Fanned Ukrainian hryvnia banknotes and coins (гроші / готівка) at a checkout counter.',
  },
  {
    vocabularyId: 'ext-v2-0018',
    conceptId: 'missing-concept-v2-0018',
    uk: 'вокза́л',
    originalAuditProposedUk: 'вокза́л',
    en: 'train station building',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'transportation',
    candidateSceneCategories: ['airport-train-station', 'public-transportation', 'city-streets'],
    acceptedSynonymsUk: ['вокза́л', 'залізни́чний вокза́л'],
    visualHotspotDescriptionEn: 'Ukrainian railway station terminal building facade with clock tower and ВОКЗАЛ signage overlooking the train platform.',
  },
  {
    vocabularyId: 'ext-v2-0019',
    conceptId: 'missing-concept-v2-0019',
    uk: 'аеропо́рт',
    originalAuditProposedUk: 'аеропо́рт',
    en: 'airport terminal',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'transportation',
    candidateSceneCategories: ['airport-train-station'],
    acceptedSynonymsUk: ['аеропо́рт', 'терміна́л аеропо́рту'],
    visualHotspotDescriptionEn: 'Modern glass airport terminal building with control tower, jet bridge, and АЕРОПОРТ facade signage.',
  },
  {
    vocabularyId: 'ext-v2-0020',
    conceptId: 'missing-concept-v2-0020',
    uk: 'по́шта',
    originalAuditProposedUk: 'по́шта',
    en: 'post office',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'city_infrastructure',
    candidateSceneCategories: ['city-streets'],
    acceptedSynonymsUk: ['по́шта', 'пошто́ве відді́лення'],
    visualHotspotDescriptionEn: 'Ukrainian post office branch exterior and service counter with postal horn emblem and ПОШТА signage.',
  },
  {
    vocabularyId: 'ext-v2-0021',
    conceptId: 'missing-concept-v2-0021',
    uk: 'магази́н',
    originalAuditProposedUk: 'магази́н',
    en: 'store / shop',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'shopping',
    candidateSceneCategories: ['city-streets', 'clothing-store', 'supermarket'],
    acceptedSynonymsUk: ['магази́н', 'крамни́ця'],
    visualHotspotDescriptionEn: 'Street-level retail shopfront with glass display window, awning, and МАГАЗИН / КРАМНИЦЯ sign.',
  },
  {
    vocabularyId: 'ext-v2-0022',
    conceptId: 'missing-concept-v2-0022',
    uk: 'шко́ла',
    originalAuditProposedUk: 'шко́ла',
    en: 'school building',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'education',
    candidateSceneCategories: ['classroom', 'city-streets', 'playground'],
    acceptedSynonymsUk: ['шко́ла'],
    visualHotspotDescriptionEn: 'Ukrainian school building entrance with courtyard, Ukrainian flag, and ШКОЛА facade lettering.',
  },
  {
    vocabularyId: 'ext-v2-0023',
    conceptId: 'missing-concept-v2-0023',
    uk: 'ліка́рня',
    originalAuditProposedUk: 'ліка́рня',
    en: 'hospital',
    gender: 'f',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'health',
    candidateSceneCategories: ['hospital-pharmacy', 'city-streets'],
    acceptedSynonymsUk: ['ліка́рня', 'клі́ніка'],
    visualHotspotDescriptionEn: 'Modern Ukrainian hospital building exterior with red cross emblem, emergency entrance, and ЛІКАРНЯ signage.',
  },
  {
    vocabularyId: 'ext-v2-0024',
    conceptId: 'missing-concept-v2-0024',
    uk: 'паціє́нт',
    originalAuditProposedUk: 'паціє́нт',
    en: 'patient',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    domainId: 'health',
    candidateSceneCategories: ['hospital-pharmacy'],
    acceptedSynonymsUk: ['паціє́нт', 'паціє́нтка', 'хво́рий'],
    visualHotspotDescriptionEn: 'Patient seated on a clinic examination couch with a blood-pressure cuff while being examined by a doctor in a white coat.',
  },
  {
    vocabularyId: 'ext-v2-0025',
    conceptId: 'missing-concept-v2-0025',
    uk: 'не́бо',
    originalAuditProposedUk: 'не́бо',
    en: 'sky',
    gender: 'n',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'everyday_nature',
    candidateSceneCategories: ['park-garden', 'countryside', 'beach-nature', 'camping-nature'],
    acceptedSynonymsUk: ['не́бо', 'блаки́тне не́бо'],
    visualHotspotDescriptionEn: 'Expansive clear blue sky dome above the horizon in an outdoor Ukrainian landscape scene (separate from individual clouds or sun).',
  },
  {
    vocabularyId: 'ext-v2-0026',
    conceptId: 'missing-concept-v2-0026',
    uk: 'ліс',
    originalAuditProposedUk: 'ліс',
    en: 'forest / woods',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'everyday_nature',
    candidateSceneCategories: ['camping-nature', 'countryside', 'park-garden', 'beach-nature'],
    acceptedSynonymsUk: ['ліс', 'бір', 'гай'],
    visualHotspotDescriptionEn: 'Dense Carpathian pine and oak forest canopy bordering a woodland clearing (distinct from a single foreground tree).',
  },
  {
    vocabularyId: 'ext-v2-0027',
    conceptId: 'missing-concept-v2-0027',
    uk: 'дощ',
    originalAuditProposedUk: 'дощ',
    en: 'rain',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'everyday_nature',
    candidateSceneCategories: ['city-streets', 'park-garden', 'countryside'],
    acceptedSynonymsUk: ['дощ', 'зли́ва'],
    visualHotspotDescriptionEn: 'Falling rain streaks and splashes visible against a dark cloud and wet pavement above an open umbrella.',
  },
  {
    vocabularyId: 'ext-v2-0028',
    conceptId: 'missing-concept-v2-0028',
    uk: 'сніг',
    originalAuditProposedUk: 'сніг',
    en: 'snow',
    gender: 'm',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    imageHotspotSuitability: 'high_direct_object_or_region',
    domainId: 'everyday_nature',
    candidateSceneCategories: ['park-garden', 'countryside', 'city-streets'],
    acceptedSynonymsUk: ['сніг', 'снігопа́д'],
    visualHotspotDescriptionEn: 'Fresh white snowdrifts blanketing the ground in a Ukrainian winter park scene.',
  },
];

export const IDENTIFY_CONTEXTUAL_NON_CLICKABLE_MISSING_WORDS_6: readonly IdentifyContextualNonClickableMissingEntry[] = [
  {
    contextualId: 'ctx-v1-0001',
    uk: 'ву́лиця',
    en: 'street',
    gender: 'f',
    domainId: 'city_infrastructure',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Whole-scene urban setting noun taught via scene titles and dialogue prompts rather than a single bounding box.',
  },
  {
    contextualId: 'ctx-v1-0002',
    uk: 'пло́ща',
    en: 'city square / plaza',
    gender: 'f',
    domainId: 'city_infrastructure',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Whole-scene civic plaza setting noun; bounding box would encompass the entire image.',
  },
  {
    contextualId: 'ctx-v1-0003',
    uk: 'ри́нок',
    en: 'farmers market / bazaar',
    gender: 'm',
    domainId: 'shopping',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Whole-scene market environment noun; taught as scene category/header while stalls, scale, and produce are clickable.',
  },
  {
    contextualId: 'ctx-v1-0004',
    uk: 'університе́т',
    en: 'university building',
    gender: 'm',
    domainId: 'education',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Institution / whole-campus setting noun taught via scene context while lecture hall objects are clickable.',
  },
  {
    contextualId: 'ctx-v1-0005',
    uk: 'інжене́р',
    en: 'engineer',
    gender: 'm',
    domainId: 'work',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Occupation role lacking a single invariant uniform in a general office scene without relying on stereotype props (Batch 6 category D).',
  },
  {
    contextualId: 'ctx-v1-0006',
    uk: 'програмі́ст',
    en: 'software developer / programmer',
    gender: 'm',
    domainId: 'work',
    reconciliationCategory: 'SCENE_SETTING_OR_ROLE_CONTEXT_NOT_CLICKABLE_HOTSPOT',
    rationaleEn: 'Occupation role visually indistinguishable from any laptop user; taught in conversational/reading modules (Batch 6 category D).',
  },
];

// ----------------------------------------------------------------------------
// 2. Final 1,200 Reconciliation Adjustments (14 Cross-Batch Duplicate Demotions & 7 Promotions)
// ----------------------------------------------------------------------------

export interface IdentifyReconciledDemotedKeepRecord {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  originalBatchNumber: number;
  retainedCounterpartVocabularyId: string;
  demotionReasonEn: string;
}

export interface IdentifyReconciledPromotedReviewRecord {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  originalBatchNumber: number;
  promotedPriority: 'essential_everyday' | 'common_situational';
  promotionRationaleEn: string;
}

export const IDENTIFY_RECONCILED_DEMOTED_PROVISIONAL_KEEPS_14: readonly IdentifyReconciledDemotedKeepRecord[] = [
  {
    vocabularyId: 'id-v2-803',
    conceptId: 'noun-concept-1337',
    uk: 'барі́ста',
    en: 'barista',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'cf-barista',
    demotionReasonEn: 'Orthographic duplicate of accepted Batch 1 KEEP cf-barista (бари́ста, barista); retain canonical cf-barista.',
  },
  {
    vocabularyId: 'id-v2-643',
    conceptId: 'noun-concept-0849',
    uk: 'ко́шик покупця́',
    en: 'shopping basket',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'sm-basket',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 1 KEEP sm-basket (ко́шик, shopping basket); retain canonical sm-basket.',
  },
  {
    vocabularyId: 'id-v2-614',
    conceptId: 'noun-concept-0885',
    uk: 'доро́жній знак',
    en: 'road sign',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'cs-sign',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 1 KEEP cs-sign (знак, road sign); retain canonical cs-sign.',
  },
  {
    vocabularyId: 'id-v2-1959',
    conceptId: 'noun-concept-1875',
    uk: 'пісо́чниця дерев’я́на з дашко́м',
    en: 'canopied playground sandbox',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'pg-sandbox',
    demotionReasonEn: 'Modifier-padded subtype duplicate of accepted Batch 1 KEEP pg-sandbox (пісо́чниця, sandbox); retain canonical pg-sandbox.',
  },
  {
    vocabularyId: 'id-v2-1886',
    conceptId: 'noun-concept-1312',
    uk: 'нами́сто кора́лове',
    en: 'red coral bead necklace (namysto)',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-867',
    demotionReasonEn: 'Subtype duplicate of accepted Batch 2 KEEP id-v2-867 (нами́сто, necklace / coral beads); retain canonical id-v2-867.',
  },
  {
    vocabularyId: 'id-v2-1920',
    conceptId: 'noun-concept-1612',
    uk: 'ву́лик бджоли́ний',
    en: 'wooden beehive box',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-945',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 4 KEEP id-v2-945 (ву́лик, beehive); retain canonical id-v2-945.',
  },
  {
    vocabularyId: 'id-v2-1922',
    conceptId: 'noun-concept-1675',
    uk: 'сі́но в копи́ці (стіг)',
    en: 'haystack / hay bale',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-943',
    demotionReasonEn: 'Duplicate of accepted Batch 6 KEEP id-v2-943 (стіг сі́на -> стіг, haystack); retain canonical id-v2-943.',
  },
  {
    vocabularyId: 'id-v2-1891',
    conceptId: 'noun-concept-1398',
    uk: 'шнурі́вка взуттє́ва',
    en: 'shoelace',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-1524',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 6 KEEP id-v2-1524 (шнурі́вка, shoelace); retain canonical id-v2-1524.',
  },
  {
    vocabularyId: 'id-v2-1885',
    conceptId: 'noun-concept-1293',
    uk: 'очі́пок / віно́к український',
    en: 'Ukrainian flower crown (vinok)',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-1500',
    demotionReasonEn: 'Duplicate of accepted Batch 6 KEEP id-v2-1500 (віно́к український -> віно́к, Ukrainian flower crown); retain canonical id-v2-1500.',
  },
  {
    vocabularyId: 'id-v2-978',
    conceptId: 'noun-concept-1664',
    uk: 'ми́ша (тварина)',
    en: 'mouse (animal)',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'noun-mysha-animal',
    demotionReasonEn: 'Biological animal sense duplicate of accepted Batch 1 KEEP noun-mysha-animal (ми́ша (польова́), field mouse (animal)); retain noun-mysha-animal.',
  },
  {
    vocabularyId: 'id-v2-1082',
    conceptId: 'noun-concept-1749',
    uk: 'гі́рка дитя́ча',
    en: 'playground slide',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'pg-slide',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 1 KEEP pg-slide (гі́рка, slide); retain canonical pg-slide.',
  },
  {
    vocabularyId: 'id-v2-1397',
    conceptId: 'noun-concept-1047',
    uk: 'шлагба́ум переї́зний',
    en: 'level crossing barrier',
    originalBatchNumber: 6,
    retainedCounterpartVocabularyId: 'id-v2-621',
    demotionReasonEn: 'Modifier-padded subtype duplicate of accepted Batch 4 KEEP id-v2-621 (шлагба́ум, barrier gate); retain canonical id-v2-621.',
  },
  {
    vocabularyId: 'id-v2-1812',
    conceptId: 'noun-concept-0812',
    uk: 'паркома́т ву́личний',
    en: 'parking meter kiosk',
    originalBatchNumber: 7,
    retainedCounterpartVocabularyId: 'id-v2-620',
    demotionReasonEn: 'Modifier-padded duplicate of accepted Batch 6 KEEP id-v2-620 (паркома́т, parking meter); retain canonical id-v2-620.',
  },
  {
    vocabularyId: 'id-v2-1947',
    conceptId: 'noun-concept-1836',
    uk: 'мили́ця підпахвова́',
    en: 'underarm walking crutch',
    originalBatchNumber: 9,
    retainedCounterpartVocabularyId: 'id-v2-1005',
    demotionReasonEn: 'Singular/subtype duplicate of accepted Batch 4 KEEP id-v2-1005 (ми́лиці, crutches); retain canonical id-v2-1005.',
  },
];

export const IDENTIFY_RECONCILED_PROMOTED_REVIEWS_7: readonly IdentifyReconciledPromotedReviewRecord[] = [
  {
    vocabularyId: 'id-v2-209',
    conceptId: 'noun-concept-0053',
    uk: 'суша́рка для по́суду',
    en: 'dish drying rack',
    originalBatchNumber: 1,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Ubiquitous Ukrainian kitchen sink fixture; visually unmistakable next to plates and mugs.',
  },
  {
    vocabularyId: 'id-v2-896',
    conceptId: 'noun-concept-1594',
    uk: 'кали́на',
    en: 'viburnum / guelder-rose',
    originalBatchNumber: 2,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Iconic Ukrainian cultural and botanical symbol with unmistakable bright red berry clusters.',
  },
  {
    vocabularyId: 'id-v2-890',
    conceptId: 'noun-concept-1431',
    uk: 'бере́за',
    en: 'birch tree',
    originalBatchNumber: 2,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Common Ukrainian park and forest tree with unmistakable white-and-black bark.',
  },
  {
    vocabularyId: 'id-v2-1126',
    conceptId: 'noun-concept-1985',
    uk: 'сопі́лка',
    en: 'sopilka wooden flute',
    originalBatchNumber: 2,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Core Ukrainian folk woodwind instrument pairing naturally with банду́ра in music scenes.',
  },
  {
    vocabularyId: 'id-v2-1191',
    conceptId: 'noun-concept-0104',
    uk: 'ту́рка / дже́зва',
    en: 'cezve coffee pot',
    originalBatchNumber: 3,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Extremely common in Lviv and Kyiv coffee culture and Ukrainian home kitchens.',
  },
  {
    vocabularyId: 'id-v2-999',
    conceptId: 'noun-concept-1678',
    uk: 'тоно́метр',
    en: 'blood pressure cuff',
    originalBatchNumber: 4,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'Standard medical device in every Ukrainian pharmacy, clinic, and family home.',
  },
  {
    vocabularyId: 'id-v2-853',
    conceptId: 'noun-concept-1277',
    uk: 'рукави́ці',
    en: 'mittens',
    originalBatchNumber: 5,
    promotedPriority: 'common_situational',
    promotionRationaleEn: 'High-frequency winter clothing item distinct from fingered gloves (рукави́чки).',
  },
];

// ----------------------------------------------------------------------------
// 2B. Legacy Hotspot Vocabulary ID Alias & Reconciliation Map
//     Ensures all 49 verified hotspots across the 10 playable scenes and any
//     historical learner progress IDs map losslessly to canonical 1,200 concepts.
// ----------------------------------------------------------------------------

export interface IdentifyLegacyHotspotAliasRecord {
  legacyHotspotVocabularyId: string;
  canonicalVocabularyId: string;
  canonicalUk: string;
  canonicalEn: string;
  aliasReasonEn: string;
}

export const IDENTIFY_LEGACY_HOTSPOT_ALIAS_MAP: readonly IdentifyLegacyHotspotAliasRecord[] = [
  {
    legacyHotspotVocabularyId: 'lr-lamp',
    canonicalVocabularyId: 'bd-lamp',
    canonicalUk: 'ла́мпа',
    canonicalEn: 'lamp',
    aliasReasonEn: 'Maps living-room-scene-1 lamp hotspot ID (lr-lamp) to canonical lamp concept bd-lamp (ла́мпа).',
  },
  {
    legacyHotspotVocabularyId: 'lr-table',
    canonicalVocabularyId: 'k-table',
    canonicalUk: 'стіл',
    canonicalEn: 'table',
    aliasReasonEn: 'Maps living-room-scene-1 table hotspot ID (lr-table, стіл) to canonical table concept k-table (стіл).',
  },
  {
    legacyHotspotVocabularyId: 'lr-rug',
    canonicalVocabularyId: 'bd-rug',
    canonicalUk: 'ки́лим',
    canonicalEn: 'rug / carpet',
    aliasReasonEn: 'Maps living-room-scene-1 rug hotspot ID (lr-rug, ки́лим) to canonical rug concept bd-rug (ки́лим).',
  },
  {
    legacyHotspotVocabularyId: 'of-desk',
    canonicalVocabularyId: 'k-table',
    canonicalUk: 'стіл',
    canonicalEn: 'table',
    aliasReasonEn: 'Maps office-scene-1 desk hotspot ID (of-desk, стіл) to canonical table concept k-table (стіл).',
  },
  {
    legacyHotspotVocabularyId: 'of-chair',
    canonicalVocabularyId: 'lr-armchair',
    canonicalUk: 'крі́сло',
    canonicalEn: 'armchair',
    aliasReasonEn: 'Maps office-scene-1 chair hotspot ID (of-chair, крі́сло) to canonical armchair/chair concept lr-armchair (крі́сло).',
  },
  {
    legacyHotspotVocabularyId: 'bn-tree',
    canonicalVocabularyId: 'pk-tree',
    canonicalUk: 'де́рево',
    canonicalEn: 'tree',
    aliasReasonEn: 'Maps beach-nature-scene-2/3/4 coastal tree hotspot ID (bn-tree, де́рево) to canonical tree concept pk-tree (де́рево).',
  },
  {
    legacyHotspotVocabularyId: 'bd-blanket',
    canonicalVocabularyId: 'bd-blanket',
    canonicalUk: 'ко́вдра',
    canonicalEn: 'blanket / duvet',
    aliasReasonEn: 'Direct identity mapping for bedroom-scene-1 blanket hotspot (bd-blanket, ко́вдра).',
  },
  {
    legacyHotspotVocabularyId: 'lv-armchair',
    canonicalVocabularyId: 'lr-armchair',
    canonicalUk: 'крі́сло',
    canonicalEn: 'armchair',
    aliasReasonEn: 'Maps legacy lv-armchair prefix to canonical lr-armchair (крі́сло).',
  },
  {
    legacyHotspotVocabularyId: 'lv-curtains',
    canonicalVocabularyId: 'bd-curtains',
    canonicalUk: 'што́ри',
    canonicalEn: 'curtains',
    aliasReasonEn: 'Maps legacy lv-curtains prefix to canonical bd-curtains (што́ри).',
  },
  {
    legacyHotspotVocabularyId: 'bn-rock',
    canonicalVocabularyId: 'bn-stone',
    canonicalUk: 'ка́мінь',
    canonicalEn: 'stone / rock',
    aliasReasonEn: 'Maps legacy bn-rock ID to canonical bn-stone (ка́мінь, stone / rock).',
  },
  {
    legacyHotspotVocabularyId: 'bn-forest',
    canonicalVocabularyId: 'ext-v2-0026',
    canonicalUk: 'ліс',
    canonicalEn: 'forest / woods',
    aliasReasonEn: 'Maps legacy bn-forest ID to canonical missing-concept extension ext-v2-0026 (ліс, forest / woods).',
  },
];

// ----------------------------------------------------------------------------
// 3. Build the Authoritative Final 1,200 Curriculum Concepts List
// ----------------------------------------------------------------------------

export interface IdentifyFinal1200CurriculumConcept {
  finalRank: number;
  vocabularyId: string;
  conceptId: string;
  originalUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedSynonymsUk: readonly string[];
  en: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  priority: 'essential_everyday' | 'common_situational' | 'useful_extended';
  visualFraming: IdentifyVisualSceneFraming;
  sourcePool:
    | 'legacy_master_provisional_keep'
    | 'legacy_master_promoted_review'
    | 'missing_concept_extension_28';
  sourceBatchNumber: number | null;
  candidateSceneCategories: readonly string[];
}

function buildHeadwordNormalizationLookup(): Map<
  string,
  { preferredUk: string; synonymsUk: readonly string[] }
> {
  const map = new Map<string, { preferredUk: string; synonymsUk: readonly string[] }>();

  for (const rec of IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER) {
    if (rec.statusAfterBatch6 === 'accepted_and_normalized_in_batch_6') {
      map.set(rec.legacyVocabularyId, {
        preferredUk: rec.preferredHeadwordUk,
        synonymsUk: [rec.legacyUkInMasterRegistry],
      });
    }
  }
  for (const rec of [
    ...IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS,
  ]) {
    map.set(rec.vocabularyId, {
      preferredUk: rec.preferredLearnerHeadwordUk,
      synonymsUk: rec.acceptedConversationalSynonymsUk,
    });
  }
  return map;
}

function buildFinal1200CurriculumConcepts(): readonly IdentifyFinal1200CurriculumConcept[] {
  const all2000Reviews: readonly IdentifyCandidateReviewRecord[] = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
    ...BATCH_7_CANDIDATE_REVIEWS,
    ...BATCH_8_CANDIDATE_REVIEWS,
    ...BATCH_9_CANDIDATE_REVIEWS,
    ...BATCH_10_CANDIDATE_REVIEWS,
  ];

  const demotedIds = new Set(
    IDENTIFY_RECONCILED_DEMOTED_PROVISIONAL_KEEPS_14.map((d) => d.vocabularyId)
  );
  const promotedMap = new Map(
    IDENTIFY_RECONCILED_PROMOTED_REVIEWS_7.map((p) => [p.vocabularyId, p])
  );
  const normLookup = buildHeadwordNormalizationLookup();

  const items: IdentifyFinal1200CurriculumConcept[] = [];

  for (const r of all2000Reviews) {
    if (r.recommendation === 'keep' && !demotedIds.has(r.vocabularyId)) {
      const norm = normLookup.get(r.vocabularyId);
      const priority =
        r.recommendedPriority === 'none_exclude'
          ? 'common_situational'
          : r.recommendedPriority;
      items.push({
        finalRank: items.length + 1,
        vocabularyId: r.vocabularyId,
        conceptId: r.conceptId,
        originalUk: r.uk,
        preferredLearnerHeadwordUk: norm ? norm.preferredUk : r.uk,
        acceptedSynonymsUk: norm ? norm.synonymsUk : [r.uk],
        en: r.en,
        gender: r.gender,
        priority,
        visualFraming: r.recommendedVisualFraming ?? 'full_room_scene',
        sourcePool: 'legacy_master_provisional_keep',
        sourceBatchNumber: r.batchNumber,
        candidateSceneCategories: r.candidateSceneCategories,
      });
    } else if (r.recommendation === 'review' && promotedMap.has(r.vocabularyId)) {
      const prom = promotedMap.get(r.vocabularyId)!;
      const norm = normLookup.get(r.vocabularyId);
      items.push({
        finalRank: items.length + 1,
        vocabularyId: r.vocabularyId,
        conceptId: r.conceptId,
        originalUk: r.uk,
        preferredLearnerHeadwordUk: norm ? norm.preferredUk : prom.uk,
        acceptedSynonymsUk: norm ? norm.synonymsUk : [r.uk],
        en: r.en,
        gender: r.gender,
        priority: prom.promotedPriority,
        visualFraming: r.recommendedVisualFraming ?? 'full_room_scene',
        sourcePool: 'legacy_master_promoted_review',
        sourceBatchNumber: r.batchNumber,
        candidateSceneCategories: r.candidateSceneCategories,
      });
    }
  }

  for (const ext of IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28) {
    items.push({
      finalRank: items.length + 1,
      vocabularyId: ext.vocabularyId,
      conceptId: ext.conceptId,
      originalUk: ext.originalAuditProposedUk,
      preferredLearnerHeadwordUk: ext.uk,
      acceptedSynonymsUk: ext.acceptedSynonymsUk,
      en: ext.en,
      gender: ext.gender,
      priority: ext.recommendedPriority,
      visualFraming: ext.recommendedVisualFraming,
      sourcePool: 'missing_concept_extension_28',
      sourceBatchNumber: null,
      candidateSceneCategories: ext.candidateSceneCategories,
    });
  }

  return items;
}

export const IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS: readonly IdentifyFinal1200CurriculumConcept[] =
  buildFinal1200CurriculumConcepts();

// ----------------------------------------------------------------------------
// 4. 80-Scene Contemporary Ukrainian Photorealistic Curriculum Plan
// ----------------------------------------------------------------------------

export interface IdentifyUkrainian80SceneTargetAssociation {
  slotNumber: number; // 1..18
  vocabularyId: string;
  legacyHotspotVocabularyId: string | null;
  verifiedHotspotId: string | null;
  conceptId: string;
  uk: string;
  en: string;
  priority: 'essential_everyday' | 'common_situational' | 'useful_extended';
  isPrimaryIntroduction: boolean;
  hotspotVerified: boolean;
  isTargetPlayableForLearner: boolean;
  normalizedBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface IdentifyUkrainian80SceneSpec {
  sceneNumber: number; // 1..80
  sceneCode: string;
  languageCode: 'uk';
  categoryId: string;
  titleUk: string;
  titleEn: string;
  contemporaryUkrainianSettingDescriptionEn: string;
  ukrainianCulturalAnchorsEn: readonly string[];
  visualFraming: IdentifyVisualSceneFraming;
  generationPromptEn: string;
  assetPath: string | null;
  assetExistsOnDisk: boolean;
  imageGenerationStatus:
    | 'verified_existing_asset_on_disk'
    | 'blocked_by_ai_studio_image_quota';
  verificationStatus:
    | 'verified_playable'
    | 'planned_unverified_not_exposed_to_learners';
  learnerExposureAllowed: boolean;
  containsForeignLandmarks: false;
  targetCount: 18;
  verifiedHotspotCount: number;
  targets: readonly IdentifyUkrainian80SceneTargetAssociation[];
}

interface RawUkrainianSceneBlueprint {
  sceneCode: string;
  categoryId: string;
  titleUk: string;
  titleEn: string;
  settingEn: string;
  anchorsEn: readonly string[];
  visualFraming: IdentifyVisualSceneFraming;
  verifiedPlayableSceneId?: string;
  verifiedAssetPath?: string;
}

const UKRAINIAN_80_SCENE_BLUEPRINTS: readonly RawUkrainianSceneBlueprint[] = [
  // 1–10: Mapped to the exact 10 verified playable scenes in identifyData.ts (49 verified active hotspots)
  {
    sceneCode: 'uk_scene_01_kitchen_family_breakfast',
    categoryId: 'kitchen',
    titleUk: 'Сіме́йний сніда́нок на ки́ївській ку́хні',
    titleEn: 'Family Breakfast in a Kyiv Kitchen',
    settingEn: 'Contemporary Kyiv apartment kitchen counter with gas stove, frying pan, cutting board, fresh bread, and dairy products.',
    anchorsEn: ['Ukrainian Cyrillic milk/kefir cartons (Молоко, Кефір)', 'Embroidered kitchen towel (рушник)'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'kitchen-scene-2',
    verifiedAssetPath: '/assets/identify/kitchen/kitchen_02.webp',
  },
  {
    sceneCode: 'uk_scene_02_kitchen_cooking_borscht',
    categoryId: 'kitchen',
    titleUk: 'Приготува́ння о́біду та борщу́',
    titleEn: 'Preparing Lunch and Borscht in a Ukrainian Kitchen',
    settingEn: 'Warm home kitchen in Vinnytsia with stainless stockpot, colander, grater, fresh beetroot, cabbage, garlic, and sour cream.',
    anchorsEn: ['Clay borscht tureen (глиняний горщик)', 'Ukrainian spice jars in Cyrillic'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'kitchen-scene-3',
    verifiedAssetPath: '/assets/identify/kitchen/kitchen_03.webp',
  },
  {
    sceneCode: 'uk_scene_03_kitchen_evening_tea',
    categoryId: 'kitchen',
    titleUk: 'Вечі́рнє чаюва́ння вдо́ма',
    titleEn: 'Evening Tea in a Ukrainian Home Kitchen',
    settingEn: 'Cozy kitchen table in Poltava with teapot, honey jar, baking sheet, oven mitt, and fruit bowl.',
    anchorsEn: ['Opishnia ceramic teapot (заварник)', 'Carpathian herbal tea box (Карпатський чай)'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'kitchen-scene-5',
    verifiedAssetPath: '/assets/identify/kitchen/kitchen_05.webp',
  },
  {
    sceneCode: 'uk_scene_04_bedroom_apartment_suite',
    categoryId: 'bedroom',
    titleUk: 'Зати́шна спа́льня у льві́вській кварти́рі',
    titleEn: 'Cozy Bedroom in a Lviv Apartment',
    settingEn: 'Sunlit modern Ukrainian bedroom with wooden bed, pillows, blanket, nightstand, reading lamp, wardrobe, and curtains.',
    anchorsEn: ['Carpathian woven throw blanket (ліжник)', 'Ukrainian books on bedside table'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'bedroom-scene-1',
    verifiedAssetPath: '/assets/identify/bedroom/bedroom_01.webp',
  },
  {
    sceneCode: 'uk_scene_05_living_room_family_lounge',
    categoryId: 'living-room',
    titleUk: 'Суча́сна віта́льня у ки́ївській кварти́рі',
    titleEn: 'Modern Living Room in a Kyiv Apartment',
    settingEn: 'Bright Ukrainian living room with sofa, cushions, coffee table, bookshelf, floor lamp, and patterned carpet.',
    anchorsEn: ['Framed Ukrainian landscape art', 'Kosiv ceramic vase on coffee table'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'living-room-scene-1',
    verifiedAssetPath: '/assets/identify/living-room/living-room_01.webp',
  },
  {
    sceneCode: 'uk_scene_06_office_workspace_desk',
    categoryId: 'office',
    titleUk: 'Робо́чий кабіне́т та письмо́вий стіл',
    titleEn: 'Contemporary Ukrainian Home Office and Study Desk',
    settingEn: 'Organized study and office desk in Kyiv with laptop, monitor, keyboard, mouse, desk lamp, notebook, and bookshelf.',
    anchorsEn: ['Ukrainian desk calendar in Cyrillic', 'Kyiv skyline visible through window'],
    visualFraming: 'full_room_scene',
    verifiedPlayableSceneId: 'office-scene-1',
    verifiedAssetPath: '/assets/identify/office/office_01.webp',
  },
  {
    sceneCode: 'uk_scene_07_black_sea_coast_odesa',
    categoryId: 'beach-nature',
    titleUk: 'Чорномо́рське узбере́жжя бі́ля Оде́си',
    titleEn: 'Black Sea Coastline Near Odesa',
    settingEn: 'Daylight coastal cliff and sandy Black Sea shoreline with rolling surf waves, wet sand, and coastal rocks.',
    anchorsEn: ['Limestone Black Sea coastal bluff', 'Ukrainian lifesaving station sign in Cyrillic'],
    visualFraming: 'outdoor_nature_scene',
    verifiedPlayableSceneId: 'beach-nature-scene-1',
    verifiedAssetPath: '/assets/identify/beach-nature/beach-nature_01.webp',
  },
  {
    sceneCode: 'uk_scene_08_sunny_beach_lazurne',
    categoryId: 'beach-nature',
    titleUk: 'Лі́тній пляж з парасо́льками',
    titleEn: 'Sunny Ukrainian Summer Beach with Umbrellas',
    settingEn: 'Warm sandy beach along the Ukrainian coast with sun umbrellas, striped beach towel, calm sea horizon, and boardwalk.',
    anchorsEn: ['Ukrainian beach boardwalk signage (Пляж)', 'Blue-and-yellow striped beach towel'],
    visualFraming: 'outdoor_nature_scene',
    verifiedPlayableSceneId: 'beach-nature-scene-2',
    verifiedAssetPath: '/assets/identify/beach-nature/beach-nature_02.webp',
  },
  {
    sceneCode: 'uk_scene_09_carpathian_lake_synevyr',
    categoryId: 'beach-nature',
    titleUk: 'Гірське́ о́зеро в Карпа́тах (Синеви́р)',
    titleEn: 'Carpathian Mountain Lake (Lake Synevyr)',
    settingEn: 'Clear alpine lake in the Ukrainian Carpathians surrounded by spruce trees, mountain ridges, and shoreline boulders.',
    anchorsEn: ['Carpathian spruce forest reflection', 'Wooden trail signpost in Ukrainian Cyrillic'],
    visualFraming: 'outdoor_nature_scene',
    verifiedPlayableSceneId: 'beach-nature-scene-3',
    verifiedAssetPath: '/assets/identify/beach-nature/beach-nature_03.webp',
  },
  {
    sceneCode: 'uk_scene_10_rocky_headland_waves',
    categoryId: 'beach-nature',
    titleUk: 'Скеля́стий бе́рег та морські́ хви́лі',
    titleEn: 'Rocky Headland and Crashing Sea Waves',
    settingEn: 'Windswept rocky shoreline with foaming waves, granite boulders, coastal shrubs, and open sea.',
    anchorsEn: ['Granite coastal boulders', 'Seagulls above Black Sea whitecaps'],
    visualFraming: 'outdoor_nature_scene',
    verifiedPlayableSceneId: 'beach-nature-scene-4',
    verifiedAssetPath: '/assets/identify/beach-nature/beach-nature_04.webp',
  },

  // 11–80: 70 Planned Contemporary Ukrainian Photorealistic Scenes
  {
    sceneCode: 'uk_scene_11_dining_festive_ukrainian_table',
    categoryId: 'dining-room',
    titleUk: 'Святко́вий обі́дній стіл з варе́никами та узва́ром',
    titleEn: 'Festive Ukrainian Dining Table with Varenyky and Uzvar',
    settingEn: 'Bright Ukrainian dining room table set with varenyky, borscht, sour cream, glass pitcher of uzvar, napkins, plates, and cutlery.',
    anchorsEn: ['Embroidered table runner (рушник)', 'Kosiv painted serving bowl with varenyky'],
    visualFraming: 'food_table_display',
  },
  {
    sceneCode: 'uk_scene_12_dining_family_supper',
    categoryId: 'dining-room',
    titleUk: 'Вече́ря у віта́льні-їда́льні',
    titleEn: 'Family Supper in a Modern Ukrainian Dining Room',
    settingEn: 'Contemporary Kyiv apartment dining area with oak table, chairs, chandelier, flower vase, breadbasket, salt shaker, and pepper mill.',
    anchorsEn: ['Dark Ukrainian rye bread (житній хліб)', 'Bouquet of sunflowers and viburnum (калина) in a glass vase'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_13_living_room_kyiv_apartment',
    categoryId: 'living-room',
    titleUk: 'Суча́сна віта́льня в ки́ївській кварти́рі',
    titleEn: 'Modern Living Room in a Kyiv Apartment',
    settingEn: 'Comfortable Ukrainian living room with sofa, throw pillows, coffee table, television, bookshelf, floor lamp, and woven rug.',
    anchorsEn: ['Ukrainian books on shelf (Кобзар, сучасна українська література)', 'Carpathian wool throw blanket (ліжник)'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_14_living_room_music_corner',
    categoryId: 'living-room',
    titleUk: 'Музи́чний куто́чок з банду́рою та сопі́лкою',
    titleEn: 'Home Music Corner with Bandura, Sopilka, and Guitar',
    settingEn: 'Sunlit apartment corner featuring an acoustic guitar, Ukrainian bandura, wooden sopilka on a stand, armchair, curtains, and framed art.',
    anchorsEn: ['Chernihiv concert bandura (бандура)', 'Carved wooden sopilka (сопілка)'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_15_bedroom_master_suite',
    categoryId: 'bedroom',
    titleUk: 'Спа́льня з дерев’я́ним лі́жком та ша́фою',
    titleEn: 'Ukrainian Apartment Bedroom with Wardrobe and Bed',
    settingEn: 'Calm contemporary bedroom with double bed, pillows, duvet, nightstand, alarm clock, desk lamp, wardrobe, and clothes hangers.',
    anchorsEn: ['Linen bedding with subtle geometric embroidery', 'Ukrainian wall calendar in Cyrillic'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_16_bedroom_dressing_vanity',
    categoryId: 'bedroom',
    titleUk: 'Туале́тний сто́лик та гардеро́б',
    titleEn: 'Bedroom Vanity Table and Wardrobe Mirror',
    settingEn: 'Close-up bedroom dressing area with mirror, hairbrush, comb, scrunchie, hairpin, perfume bottle, jewelry box, and folded sweaters.',
    anchorsEn: ['Red coral necklace (коралове намисто) in jewelry dish', 'Embroidered vyshyvanka hanging on wardrobe door'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_17_bedroom_child_nursery',
    categoryId: 'bedroom',
    titleUk: 'Дитя́ча кімна́та з і́грашками',
    titleEn: 'Children’s Room with Toys and Study Desk',
    settingEn: 'Bright Ukrainian children’s bedroom with bunk bed, teddy bear, doll, toy blocks, globe, colored pencils, and picture books.',
    anchorsEn: ['Ukrainian alphabet poster (Абетка) on the wall', 'Illustrated Ukrainian fairy-tale book (Казки)'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_18_bathroom_modern_apartment',
    categoryId: 'bathroom',
    titleUk: 'Ва́нна кімна́та з пра́льною маши́ною',
    titleEn: 'Modern Ukrainian Apartment Bathroom and Laundry',
    settingEn: 'Tiled apartment bathroom with bathtub, shower head, sink, faucet, mirror, washing machine, laundry hamper, and bath towels.',
    anchorsEn: ['Heated chrome towel rail (рушникосушарка) typical of Ukrainian apartments', 'Detergent box labeled Пральний порошок'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_19_bathroom_vanity_hygiene',
    categoryId: 'bathroom',
    titleUk: 'Поли́чка у ва́нній: засоби гігіє́ни',
    titleEn: 'Bathroom Sink Shelf and Personal Hygiene Items',
    settingEn: 'Close-up of a bright bathroom counter with liquid soap dispenser, toothbrush, toothpaste, shampoo, sponge, razor, tweezers, and hairdryer.',
    anchorsEn: ['Ukrainian herbal shampoo bottle (Шампунь з ромашкою)', 'Ceramic soap dish'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_20_hallway_apartment_entry',
    categoryId: 'hallway-entry',
    titleUk: 'Передпо́кій кварти́ри: вхі́дні две́рі та взуття́',
    titleEn: 'Apartment Entry Hallway with Coat Rack and Shoes',
    settingEn: 'Ukrainian apartment entrance corridor with front door, lock, keys, intercom handset, coat rack, umbrella, sneakers, boots, and shoehorn.',
    anchorsEn: ['Apartment intercom panel (домофон)', 'Communal utility meter display in hallway'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_21_balcony_urban_garden',
    categoryId: 'balcony-garden',
    titleUk: 'Зати́шний ки́ївський балко́н з вазо́нами',
    titleEn: 'Sunny Kyiv Apartment Balcony with Potted Plants',
    settingEn: 'Glazed and open Ukrainian apartment balcony with flowerpots, watering can, folding chair, clothes drying rack, and courtyard view.',
    anchorsEn: ['Geranium and petunia planters along balcony rail', 'Courtyard chestnut trees (київські каштани) in background'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_22_home_workshop_tools',
    categoryId: 'home-workshop',
    titleUk: 'Дома́шня майсте́рня та інструме́нти',
    titleEn: 'Home Workshop Workbench and Hand Tools',
    settingEn: 'Organized garage or apartment tool bench with hammer, screwdriver, pliers, wrench, saw, tape measure, level, nails, screws, and flashlight.',
    anchorsEn: ['Metric tape measure (рулетка / сантиметрова стрічка)', 'Toolboxes labeled Інструменти'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_23_supermarket_fresh_produce',
    categoryId: 'supermarket',
    titleUk: 'Відді́л о́вочів та фру́ктів у суперма́ркеті',
    titleEn: 'Supermarket Fresh Produce Section',
    settingEn: 'Modern Ukrainian supermarket produce aisle with apples, pears, bananas, lemons, tomatoes, cucumbers, potatoes, carrots, onions, and shopping basket.',
    anchorsEn: ['Ukrainian price tags in hryvnias (грн / ₴)', 'Signage Овочі та фрукти'],
    visualFraming: 'market_counter_display',
  },
  {
    sceneCode: 'uk_scene_24_supermarket_dairy_bakery',
    categoryId: 'supermarket',
    titleUk: 'Моло́чний та хлі́бний відді́л суперма́ркету',
    titleEn: 'Supermarket Dairy, Cheese, and Bakery Aisle',
    settingEn: 'Refrigerated dairy display and bakery rack with milk, kefir, ryazhanka, butter, sour cream, cottage cheese, eggs, loaf of bread, and lavash.',
    anchorsEn: ['Ukrainian dairy labels (Молоко, Кефір, Ряжанка, Сметана, Масло)', 'Hryvnia shelf labels (₴)'],
    visualFraming: 'market_counter_display',
  },
  {
    sceneCode: 'uk_scene_25_supermarket_checkout_counter',
    categoryId: 'supermarket',
    titleUk: 'Ка́са в українському суперма́ркеті',
    titleEn: 'Supermarket Checkout Counter and Payment Terminal',
    settingEn: 'Supermarket checkout lane with cashier, conveyor belt, barcode scanner, payment terminal, receipt, wallet, bank card, coins, and shopping cart.',
    anchorsEn: ['Ukrainian hryvnia banknotes and coins (гривні)', 'Receipt printed in Ukrainian (Фіскальний чек)'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_26_farmers_market_bazaar',
    categoryId: 'farmers-market',
    titleUk: 'Ферме́рський ри́нок: мед, горі́хи та я́годи',
    titleEn: 'Ukrainian Farmers’ Market Stall with Honey and Berries',
    settingEn: 'Outdoor Ukrainian farmers’ market counter with jars of golden honey, walnuts, strawberries, cherries, plums, raspberries, scale, and seller in apron.',
    anchorsEn: ['Handwritten price cards in грн/кг', 'Carpathian wildflower honey jars (Мед карпатський)'],
    visualFraming: 'market_counter_display',
  },
  {
    sceneCode: 'uk_scene_27_farmers_market_vegetables_herbs',
    categoryId: 'farmers-market',
    titleUk: 'Овоче́вий ряд на база́рі: буря́к, гарбу́з та зе́лень',
    titleEn: 'Market Vegetable Row with Beetroot, Pumpkin, and Dill',
    settingEn: 'Vibrant market stall displaying beetroot, cabbage, pumpkin, zucchini, eggplant, bell peppers, garlic braids, fresh dill, parsley, and wicker baskets.',
    anchorsEn: ['Braided Ukrainian garlic garlands', 'Signage Домашні овочі'],
    visualFraming: 'market_counter_display',
  },
  {
    sceneCode: 'uk_scene_28_bakery_craft_pastry',
    categoryId: 'bakery',
    titleUk: 'Пека́рня: паляни́ця, бу́лочки та пиріжки́',
    titleEn: 'Ukrainian Craft Bakery with Palianytsia and Pastries',
    settingEn: 'Warm neighborhood bakery in Kyiv with crusty wheat palianytsia, braided kolach, poppy-seed roll, croissants, baker in apron, and glass display case.',
    anchorsEn: ['Signage Свіжа випічка / Пекарня', 'Traditional scored Ukrainian паляниця loaf'],
    visualFraming: 'market_counter_display',
  },
  {
    sceneCode: 'uk_scene_29_cafe_lviv_coffeehouse',
    categoryId: 'cafe',
    titleUk: 'Льві́вська кав’я́рня: ка́ва в дже́зві та сирни́к',
    titleEn: 'Lviv Coffeehouse with Cezve Coffee and Syrnyk Cheesecake',
    settingEn: 'Cozy Lviv café interior with espresso machine, copper cezve (турка), coffee cup, Lviv syrnyk cake, menu board, barista, and marble table.',
    anchorsEn: ['Lviv syrnyk with chocolate glaze', 'Menu board in Ukrainian (Кава по-львівськи, Сирник)'],
    visualFraming: 'food_table_display',
  },
  {
    sceneCode: 'uk_scene_30_restaurant_ukrainian_bistro',
    categoryId: 'restaurant',
    titleUk: 'Суча́сний украї́нський рестора́н',
    titleEn: 'Contemporary Ukrainian Bistro Dining Table',
    settingEn: 'Modern Ukrainian restaurant table with waiter holding tray, bill folder, grilled sausage, cutlets, salad bowl, kvass mug, ketchup, and mayonnaise.',
    anchorsEn: ['Ukrainian bistro menu (Меню)', 'Clay crockery and linen napkins'],
    visualFraming: 'food_table_display',
  },
  {
    sceneCode: 'uk_scene_31_clothing_store_boutique',
    categoryId: 'clothing-store',
    titleUk: 'Магази́н о́дягу: вишива́нки, су́кні та сорочки́',
    titleEn: 'Ukrainian Clothing Store with Vyshyvankas and Everyday Wear',
    settingEn: 'Bright clothing boutique in Kyiv displaying embroidered vyshyvankas, dresses, shirts, jeans, skirts, jackets, fitting room mirror, and price tags.',
    anchorsEn: ['Contemporary Ukrainian vyshyvankas with linen embroidery', 'Sale signage in Ukrainian (Нова колекція)'],
    visualFraming: 'clothing_wardrobe_display',
  },
  {
    sceneCode: 'uk_scene_32_clothing_winter_outerwear',
    categoryId: 'clothing-store',
    titleUk: 'Зимо́вий о́дяг та аксесуа́ри',
    titleEn: 'Winter Outerwear, Boots, Mittens, and Scarves Display',
    settingEn: 'Seasonal clothing display with wool coat, down jacket, knitted hat, scarf, mittens, leather gloves, tall boots, belt, zipper detail, and backpack.',
    anchorsEn: ['Carpathian patterned knitwear', 'Size labels in Ukrainian'],
    visualFraming: 'clothing_wardrobe_display',
  },
  {
    sceneCode: 'uk_scene_33_shoe_and_tailor_atelier',
    categoryId: 'clothing-store',
    titleUk: 'Ательє́ кравця́ та майсте́рня о́дягу',
    titleEn: 'Tailor Atelier with Sewing Machine, Fabric, and Buttons',
    settingEn: 'Ukrainian tailor studio with tailor, sewing machine, spool of thread, needle, pins, scissors, buttons, zipper, fabric rolls, and measuring tape.',
    anchorsEn: ['Signage Ательє ремонту одягу', 'Traditional Ukrainian embroidery thread spools'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_34_city_street_kyiv_chestnuts',
    categoryId: 'city-streets',
    titleUk: 'Ву́лиця у це́нтрі Ки́єва під кашта́нами',
    titleEn: 'Central Kyiv Street Under Blossoming Chestnut Trees',
    settingEn: 'Daylight Kyiv street with crosswalk, traffic light, road sign, streetlamp, sidewalk, bench, trash bin, pharmacy sign, and parked car.',
    anchorsEn: ['Blossoming white-and-pink Kyiv chestnut trees', 'Ukrainian street signs (вул. Хрещатик / Перехід)'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_35_city_square_lviv_rynok',
    categoryId: 'city-streets',
    titleUk: 'Істори́чна пло́ща з ра́тушею та фонта́ном',
    titleEn: 'Historic Ukrainian City Square with City Hall and Fountain',
    settingEn: 'Cobblestone Ukrainian square inspired by Lviv Rynok Square with city hall tower, clock, fountain, pigeons, outdoor café umbrella, and street musician.',
    anchorsEn: ['Lviv Rynok Square architectural facade', 'Ukrainian blue-and-yellow flag on city hall tower'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_36_city_rainy_sidewalk',
    categoryId: 'city-streets',
    titleUk: 'Дощови́й день у мі́сті: парасо́льки та калю́жі',
    titleEn: 'Rainy Day on a Ukrainian City Sidewalk with Puddles',
    settingEn: 'Wet urban street after rain showing rain puddles, pedestrians with umbrellas and raincoats, storm drain grate, shop window, and rainbow in the sky.',
    anchorsEn: ['Coffee kiosk labeled Кава з собою', 'Reflected Ukrainian signage in rain puddle'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_37_city_winter_snow_street',
    categoryId: 'city-streets',
    titleUk: 'Зимо́ва ву́лиця: сніг, буру́льки та ліхтарі́',
    titleEn: 'Winter Street in Ukraine with Snow and Icicles',
    settingEn: 'Snow-covered Ukrainian neighborhood street with icicles hanging from roof eaves, snowman, sled, shovel, warm streetlights, and brick houses.',
    anchorsEn: ['Carpathian or Kyiv winter roofline with icicles', 'Signage Пекарня glowing in evening snow'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_38_public_transport_tram_trolleybus',
    categoryId: 'public-transportation',
    titleUk: 'Зупи́нка трамва́я та троле́йбуса',
    titleEn: 'Ukrainian City Tram and Trolleybus Stop',
    settingEn: 'Modern low-floor Ukrainian tram and trolleybus at a city transit shelter with route map, ticket validator, passengers, bicycle lane, and taxi.',
    anchorsEn: ['Yellow-and-blue municipal tram (Електрон)', 'Transit stop sign Зупинка громадського транспорту'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_39_public_transport_kyiv_metro',
    categoryId: 'public-transportation',
    titleUk: 'Ста́нція ки́ївського метро́',
    titleEn: 'Kyiv Metro Station Platform and Escalator',
    settingEn: 'Clean Kyiv metro station interior with escalator, turnstiles, metro train car, platform bench, directional signage, and arched marble columns.',
    anchorsEn: ['Green «М» Kyiv Metro emblem', 'Wayfinding signs in Ukrainian (Вихід у місто / Поїзди до станції)'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_40_railway_station_ukrposhta_uz',
    categoryId: 'airport-train-station',
    titleUk: 'Залізни́чний вокза́л та по́тяг «Укрзалізни́ці»',
    titleEn: 'Ukrainian Railway Station Platform and Passenger Train',
    settingEn: 'Central railway station platform in Ukraine with blue-and-yellow passenger railcar, locomotive, departure board, conductor, suitcase, and ticket.',
    anchorsEn: ['Ukrzaliznytsia (УЗ) blue passenger coach', 'Electronic departure board Києва — Львів — Одеса'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_41_airport_terminal_check_in',
    categoryId: 'airport-train-station',
    titleUk: 'Терміна́л аеропо́рту: па́спортний контро́ль та бага́ж',
    titleEn: 'Airport Terminal Check-In and Airplane Window View',
    settingEn: 'Modern airport departure hall with check-in desk, biometric Ukrainian passport, boarding pass, luggage scale, rolling suitcase, and airplane visible through window.',
    anchorsEn: ['Biometric Ukrainian passport with Trident (Тризуб)', 'Bilingual Ukrainian/English departure signage (Реєстрація / Відліт)'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_42_automotive_car_service',
    categoryId: 'city-streets',
    titleUk: 'Автомобі́ль та автосервіс',
    titleEn: 'Passenger Car Exterior, Open Trunk, and Tire Service',
    settingEn: 'Daylight parking area showing a modern hatchback car with open trunk, steering wheel, headlights, side mirror, license plate, spare tire, and jack.',
    anchorsEn: ['Ukrainian UA license plate with blue-and-yellow flag band', 'Roadside sign Автосервіс / Шиномонтаж'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_43_hospital_clinic_consultation',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Кабіне́т сіме́йного лі́каря в поліклі́ніці',
    titleEn: 'Family Doctor’s Office in a Ukrainian Clinic',
    settingEn: 'Bright Ukrainian medical clinic room with doctor in white coat, stethoscope, blood pressure monitor (тонометр), thermometer, anatomical heart chart, and medical record.',
    anchorsEn: ['Wall chart Будова серця та здоров’я', 'Clinic door sign Сімейний лікар'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_44_hospital_first_aid_treatment',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Перша меди́чна допомо́га та перев’я́зувальна',
    titleEn: 'First-Aid Treatment Room and Medical Supplies',
    settingEn: 'Clean first-aid station showing first-aid kit, bandage, adhesive plaster, syringe, blood sample tube, bruise and minor burn treatment gel, crutches, and walker.',
    anchorsEn: ['First-aid kit labeled Аптечка першої допомоги', 'Ukrainian medical supply labels'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_45_pharmacy_apotheca',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Украї́нська апте́ка: лі́ки, вітамі́ни та реце́пт',
    titleEn: 'Ukrainian Pharmacy Counter with Pharmacist and Medicines',
    settingEn: 'Modern green-cross Ukrainian pharmacy interior with pharmacist, prescription slip, pill blister packs, cough syrup bottle, eye drops, medical mask, and glasses.',
    anchorsEn: ['Green cross signage АПТЕКА', 'Medicine boxes labeled Вітаміни / Сироп від кашлю'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_46_dental_and_optics_clinic',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Стоматологі́чний кабіне́т та о́птика',
    titleEn: 'Dental Clinic Chair and Eyewear Display',
    settingEn: 'Modern Ukrainian dental and vision clinic showing dentist, dental chair, tooth model, mirror, eyeglasses, contact lens case, and eye chart.',
    anchorsEn: ['Ukrainian Cyrillic Snellen eye chart (Ш Б М Н К)', 'Signage Стоматологія та Оптика'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_47_portrait_human_face_features',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Портре́т люди́ни: ри́си обличчя та емо́ції',
    titleEn: 'Close-Up Human Portrait Showing Facial Features',
    settingEn: 'Clear educational studio portrait highlighting face, eyes, eyebrows, eyelashes, nose, mouth, lips, teeth, tongue, chin, cheeks, forehead, ear, hair, braid, and teardrop.',
    anchorsEn: ['Woven Ukrainian hair braid (коса) and embroidered collar detail', 'Clean studio lighting for unambiguous anatomical hotspots'],
    visualFraming: 'human_body_portrait_illustration',
  },
  {
    sceneCode: 'uk_scene_48_portrait_human_body_posture',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Ті́ло люди́ни: поста́ва, ру́ки та но́ги',
    titleEn: 'Full-Body Athletic Portrait Showing Limbs and Joints',
    settingEn: 'Bright sports studio portrait showing head, neck, shoulders, chest, back, arm, elbow, wrist, hand, fingers, leg, knee, ankle, and foot.',
    anchorsEn: ['Ukrainian blue-and-yellow athletic tracksuit', 'Clear anatomical visibility of all major joints'],
    visualFraming: 'human_body_portrait_illustration',
  },
  {
    sceneCode: 'uk_scene_49_school_classroom_lesson',
    categoryId: 'classroom',
    titleUk: 'Шкільни́й клас: уро́к украї́нської мо́ви',
    titleEn: 'Ukrainian School Classroom During a Language Lesson',
    settingEn: 'Sunny Ukrainian classroom with teacher, students, chalkboard, chalk, school desks, chairs, backpacks, globe, wall map of Ukraine, and projector.',
    anchorsEn: ['Chalkboard inscription Класна робота', 'Physical map of Ukraine (Карта України) on the wall'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_50_school_desk_stationery',
    categoryId: 'classroom',
    titleUk: 'Шкільна́ па́рта: підру́чник, зо́шит та пена́л',
    titleEn: 'Close-Up Student Desk with Textbook, Notebook, and Pencil Case',
    settingEn: 'Overhead close-up of a wooden school desk with Ukrainian textbook, dictionary, lined notebook, pen, pencil, eraser, ruler, sharpener, pencil case, bookmark, and compass.',
    anchorsEn: ['Textbook cover Українська мова', 'Bookmark with Ukrainian ornament'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_51_school_science_laboratory',
    categoryId: 'classroom',
    titleUk: 'Кабіне́т природозна́вства: мікроско́п та телеско́п',
    titleEn: 'School Science Room with Microscope, Telescope, and Magnifying Glass',
    settingEn: 'Ukrainian high-school science room with microscope, magnifying glass, telescope by the window, magnet, hourglass, thermometer, diploma, and mineral samples.',
    anchorsEn: ['Poster Природничі науки в Україні', 'Certificate (Диплом) with Ukrainian emblem'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_52_library_reading_hall',
    categoryId: 'library',
    titleUk: 'Читальний зал бібліоте́ки у Льво́ві',
    titleEn: 'University Library Reading Hall in Lviv',
    settingEn: 'Quiet library reading room with tall wooden bookshelves, librarian, books, magazine, newspaper, reading lamp, laptop, headphones, and notebook.',
    anchorsEn: ['Signage Читальний зал / Тиша в бібліотеці', 'Ukrainian literary journals and newspapers'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_53_office_it_coworking_kyiv',
    categoryId: 'office',
    titleUk: 'Суча́сний о́фіс та ково́ркінг у Ки́єві',
    titleEn: 'Modern Coworking Office and Desk Setup in Kyiv',
    settingEn: 'Bright Kyiv tech office with desk, ergonomic chair, monitor, laptop, keyboard, computer mouse, printer, folders, calendar, whiteboard, and water cooler.',
    anchorsEn: ['Wall clock and Kyiv skyline view through window', 'Whiteboard notes in Ukrainian'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_54_office_electronics_accessories',
    categoryId: 'office',
    titleUk: 'Електро́ніка та га́джети на робо́чому столі́',
    titleEn: 'Close-Up Desk Electronics: Smartphone, Charger, and Flash Drive',
    settingEn: 'Close-up desktop arrangement with smartphone, tablet, power bank, charger, USB cable, flash drive, battery, extension cord, wall outlet, and router.',
    anchorsEn: ['Smartphone screen displaying Ukrainian interface (Дія / Погода у Києві)', 'Power bank (павербанк) widely used in Ukrainian daily life'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_55_post_office_ukrposhta',
    categoryId: 'office',
    titleUk: 'Відді́лення по́шти: поси́лка, конве́рт та ма́рка',
    titleEn: 'Ukrainian Post Office Counter with Parcels and Stamps',
    settingEn: 'Modern postal branch counter with mail carrier, cardboard parcel box, paper envelope, postage stamp, postcard, scale, packing tape, and mailbox.',
    anchorsEn: ['Yellow-and-blue postal branding (Пошта)', 'Ukrainian commemorative postage stamp and postcard'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_56_bank_and_administrative_center',
    categoryId: 'office',
    titleUk: 'Банк та центр надання адміністрати́вних по́слуг (ЦНАП)',
    titleEn: 'Bank Branch, ATM, and Citizen Service Desk',
    settingEn: 'Modern Ukrainian service hall with ATM (банкомат), teller window, safe, document folder, contract, stamp seal, signature pen, queue ticket, and ID card.',
    anchorsEn: ['ATM screen in Ukrainian (Банкомат — видача готівки)', 'Signage Центр надання послуг'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_57_park_shevchenko_autumn',
    categoryId: 'park-garden',
    titleUk: 'Осі́нній міськи́й парк з кашта́нами та ла́вками',
    titleEn: 'Autumn City Park in Kyiv with Chestnuts and Benches',
    settingEn: 'Golden autumn park alley in Kyiv with wooden bench, wrought-iron streetlamp, fountain, oak and birch trees, fallen leaves, squirrel, and dog on a leash.',
    anchorsEn: ['Spiky chestnut burrs and glossy brown chestnuts on the path', 'Park sign Парк імені Тараса Шевченка'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_58_botanical_garden_flowers',
    categoryId: 'park-garden',
    titleUk: 'Ботані́чний сад: со́няшники, троя́нди та кали́на',
    titleEn: 'Ukrainian Botanical Garden with Sunflowers, Roses, and Viburnum',
    settingEn: 'Lush garden path showcasing blooming sunflowers, red poppies, roses, tulips, dandelions, viburnum bush (калина), honeybee, butterfly, and greenhouse.',
    anchorsEn: ['Ukrainian sunflower and red poppy floral bed', 'Ripe red viburnum (калина) clusters'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_59_backyard_garden_tools',
    categoryId: 'park-garden',
    titleUk: 'Садо́ва діля́нка: лопа́та, граблі́ та та́чка',
    titleEn: 'Orchard and Garden Shed with Wheelbarrow and Tools',
    settingEn: 'Sunny Ukrainian cottage garden (дача / садок) with apple tree, wheelbarrow, shovel, rake, pruning shears, garden hose, watering can, fence, and birdhouse.',
    anchorsEn: ['Whitewashed orchard tree trunks typical of Ukrainian gardens', 'Wooden birdhouse (шпаківня)'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_60_playground_family_courtyard',
    categoryId: 'playground',
    titleUk: 'Дитя́чий майда́нчик у дворі́ житло́вого буди́нку',
    titleEn: 'Neighborhood Courtyard Playground with Swing and Slide',
    settingEn: 'Modern Ukrainian apartment courtyard playground with slide, swing, sandbox, seesaw, trampoline, baby stroller, kick scooter, bicycle, and parents with children.',
    anchorsEn: ['Colorful Ukrainian residential courtyard mural', 'Signage Дитячий майданчик'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_61_gym_fitness_studio',
    categoryId: 'gym-fitness',
    titleUk: 'Спортивний зал: ганте́лі, бігова́ дорі́жка та килимо́к',
    titleEn: 'Modern Fitness Gym with Dumbbells, Treadmill, and Yoga Mat',
    settingEn: 'Well-lit Ukrainian fitness club with treadmill, stationary bike, barbell, dumbbells, kettlebell, yoga mat, pull-up bar, climbing rope, water bottle, and locker.',
    anchorsEn: ['Wall motivational banner in Ukrainian (Спорт та здоров’я)', 'Blue-and-yellow gym mat accents'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_62_sports_stadium_court',
    categoryId: 'gym-fitness',
    titleUk: 'Стадіо́н та спорти́вний майда́нчик',
    titleEn: 'Outdoor Sports Field with Soccer Ball, Basketball Hoop, and Bow',
    settingEn: 'Community sports complex in Ukraine with soccer goal, soccer ball, basketball hoop, tennis racket, badminton shuttlecock, archery bow and target, whistle, and trophy.',
    anchorsEn: ['Scoreboard in Ukrainian (Рахунок)', 'Track lanes around green football pitch'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_63_swimming_pool_and_winter_rink',
    categoryId: 'gym-fitness',
    titleUk: 'Басе́йн та зимо́вий спорт: ли́жі, ковзани́ та трамплі́н',
    titleEn: 'Sports Complex Pool Diving Board and Winter Gear Rack',
    settingEn: 'Dual-zone Ukrainian sports center showing indoor swimming pool with diving board, swim goggles, and winter sports corner with skis, ice skates, hockey stick, and helmet.',
    anchorsEn: ['Bukovel / Ukrainian winter sports poster', 'Lane markers and pool signage Басейн'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_64_countryside_ukrainian_village_yard',
    categoryId: 'countryside',
    titleUk: 'Украї́нське село́: ха́та, крини́ця та леле́че гніздо́',
    titleEn: 'Ukrainian Village Homestead with Well and Stork Nest',
    settingEn: 'Scenic Ukrainian village yard with whitewashed cottage, wooden fence, covered water well (криниця), stork in a stork nest (лелече гніздо) on a pole, sunflower patch, and clay jugs on fence posts.',
    anchorsEn: ['White stork (лелека) nesting on a utility pole', 'Clay pots (глечики) drying on a wattle fence (тин)'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_65_countryside_farmyard_animals',
    categoryId: 'countryside',
    titleUk: 'Сільське́ подві́р’я: кінь, коро́ва, коза́ та інди́к',
    titleEn: 'Ukrainian Farmyard with Horse, Cow, Goat, Pig, and Poultry',
    settingEn: 'Sunny rural Ukrainian farmstead showing barn, tractor, haystack, scythe, horse, cow, goat, sheep, pig, rooster, hen, duck, goose, and live turkey (індик).',
    anchorsEn: ['Carpathian wooden hayrick (оборіг)', 'Traditional wooden barn and pasture'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_66_countryside_wheat_and_sunflower_fields',
    categoryId: 'countryside',
    titleUk: 'Украї́нський степ: пшени́чне по́ле, со́няшники та вітря́к',
    titleEn: 'Ukrainian Steppe Landscape with Wheat Field, Sunflowers, and Windmill',
    settingEn: 'Wide golden wheat field and blooming sunflower field under a blue sky in central Ukraine with country road, wooden windmill, beehive apiary, and combine harvester.',
    anchorsEn: ['Natural blue sky over golden wheat horizon echoing the Ukrainian landscape', 'Traditional wooden beehive frames (пасіка)'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_67_carpathian_forest_wildlife',
    categoryId: 'countryside',
    titleUk: 'Карпа́тський ліс: ве́дмідь, о́лень, їжа́к та гриби́',
    titleEn: 'Carpathian Forest Trail with Deer, Hedgehog, Hare, and Mushrooms',
    settingEn: 'Sunlit Carpathian woodland clearing showing pine and oak trees, forest stream, wooden footbridge, deer, fox, hare (заєць), hedgehog, owl, woodpecker, porcini mushroom, and fern.',
    anchorsEn: ['Carpathian biosphere trail marker', 'Edible white porcini mushroom (білий гриб) and forest berries'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_68_carpathian_camping_bonfire',
    categoryId: 'camping-nature',
    titleUk: 'Ке́мпінг у Карпа́тах: на́мет, бага́ття та рюкзáк',
    titleEn: 'Carpathian Mountain Campsite with Tent and Campfire',
    settingEn: 'Evening campsite in the Ukrainian Carpathians with tent, crackling campfire (багаття), sleeping bag, thermos, compass, binoculars, folding knife, lantern, and starry sky with moon.',
    anchorsEn: ['Hoverla / Chornohora ridge silhouette at dusk', 'Enamel mug of Carpathian berry tea by the fire'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_69_river_dnipro_boating_fishing',
    categoryId: 'beach-nature',
    titleUk: 'Бе́рег Дніпра́: чо́вен, ву́дка та міст',
    titleEn: 'Dnipro Riverbank with Rowboat, Fishing Rod, and Bridge',
    settingEn: 'Calm riverbank along the Dnipro with wooden rowboat, oar, anchor, lifebuoy, fisherman with fishing rod, bucket, swan, frog on a water lily, and arched river bridge.',
    anchorsEn: ['Wide Dnipro hills and willow trees along the water', 'Wooden pier with Ukrainian river marker'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_70_nature_insects_and_garden_macro',
    categoryId: 'park-garden',
    titleUk: 'Світ приро́ди зблизька́: бджола́, сонечко, мура́ха та павути́ння',
    titleEn: 'Macro Nature Scene with Honeybee, Ladybug, Ant, and Dewy Web',
    settingEn: 'Detailed outdoor garden close-up showing honeybee on clover, ladybug, ant (мураха), housefly (муха), dragonfly, snail, caterpillar, spiderweb with dewdrop, acorn, and pinecone.',
    anchorsEn: ['Blooming Ukrainian linden and clover blossoms', 'Wooden apiary frame edge'],
    visualFraming: 'close_up_detail',
  },
  {
    sceneCode: 'uk_scene_71_pet_shop_and_vet_clinic',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Зоомагази́н та ветерина́рна клі́ніка',
    titleEn: 'Ukrainian Pet Shop and Veterinary Corner',
    settingEn: 'Bright pet care store in Kyiv with cat, puppy, dog collar and leash, pet carrier, food bowl, aquarium with goldfish, parrot in cage, hamster, and turtle.',
    anchorsEn: ['Signage Зоомагазин та Ветеринарна аптека', 'Pet food bags labeled Корм для котів і собак'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_72_zoo_exotic_animals_kyiv',
    categoryId: 'park-garden',
    titleUk: 'Екскурсія в зоопа́рку: слон, жира́фа, лев та пінгві́н',
    titleEn: 'Ukrainian City Zoo Enclosure Walk with Exotic Animals',
    settingEn: 'Educational zoo panorama in Kyiv showing elephant, giraffe, lion, tiger, zebra, monkey, kangaroo, camel, crocodile, penguin, dolphin pool, and shark aquarium window.',
    anchorsEn: ['Bilingual Ukrainian educational plaques (Київський зоопарк)', 'Landscaped naturalistic habitats'],
    visualFraming: 'outdoor_nature_scene',
  },
  {
    sceneCode: 'uk_scene_73_art_studio_and_museum',
    categoryId: 'art-studio',
    titleUk: 'Худо́жня майсте́рня та ви́ставка живо́пису',
    titleEn: 'Ukrainian Painter’s Studio with Easel, Palette, and Sculpture',
    settingEn: 'Sunlit art studio in Odesa with painter, wooden easel, canvas, paint palette, paintbrush, paint tubes, framed landscape painting, marble bust sculpture, and ceramic pottery wheel.',
    anchorsEn: ['Canvas depicting Carpathian mountains and Ukrainian village', 'Kosiv painted ceramics on studio shelf'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_74_theater_and_concert_hall',
    categoryId: 'art-studio',
    titleUk: 'О́перний теа́тр та конце́ртна сце́на',
    titleEn: 'Ukrainian Opera & Theater Stage with Grand Piano and Violin',
    settingEn: 'Elegant Ukrainian theater stage inspired by Lviv or Odesa Opera with velvet stage curtains, spotlight, microphone, grand piano, violin, cello, accordion, drum, trumpet, and audience seats.',
    anchorsEn: ['Ornate Ukrainian theater balcony gilding', 'Concert program poster in Ukrainian (Концерт класичної музики)'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_75_photo_and_media_studio',
    categoryId: 'office',
    titleUk: 'Фотосту́дія та медіаце́нтр',
    titleEn: 'Photography and Podcast Studio with Camera and Tripod',
    settingEn: 'Contemporary Kyiv media studio with photographer, digital camera, lens, tripod, studio umbrella light, microphone on boom arm, headphones, video monitor, and clapperboard.',
    anchorsEn: ['Studio signage Фотостудія Київ', 'Framed Ukrainian documentary photographs on brick wall'],
    visualFraming: 'full_room_scene',
  },
  {
    sceneCode: 'uk_scene_76_hair_salon_barbershop',
    categoryId: 'bathroom',
    titleUk: 'Перука́рня та салон краси́',
    titleEn: 'Ukrainian Hair Salon and Barbershop Station',
    settingEn: 'Modern hair salon in Dnipro with hairdresser, salon chair, large mirror, hairdryer, curling iron, electric trimmer, hair scissors, comb, spray bottle, cape, and nail polish rack.',
    anchorsEn: ['Signage Перукарня / Салон краси', 'Price list in hryvnias (Стрижка, Укладка)'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_77_hotel_reception_and_room',
    categoryId: 'hotel',
    titleUk: 'Готе́ль у Карпа́тах: рецепція та но́мер',
    titleEn: 'Boutique Carpathian Hotel Lobby and Guest Room',
    settingEn: 'Warm Ukrainian boutique hotel showing reception desk, bell, keycard, elevator doors, luggage cart, guest room bed, safe, minibar, bathrobe, and mountain view.',
    anchorsEn: ['Signage Готель «Карпати» — Рецепція', 'Carpathian wood carving behind front desk'],
    visualFraming: 'public_service_environment',
  },
  {
    sceneCode: 'uk_scene_78_emergency_and_civic_services',
    categoryId: 'city-streets',
    titleUk: 'Рятува́льні та міські́ слу́жби України',
    titleEn: 'Ukrainian Emergency Vehicles: Fire Truck, Ambulance, and Police',
    settingEn: 'Civic safety plaza in Ukraine showing red fire truck, firefighter in helmet with fire hose and fire extinguisher, white ambulance, paramedic, police officer, and traffic cone.',
    anchorsEn: ['Ukrainian ДСНС fire truck markings (101) and Швидка допомога (103)', 'Blue-and-yellow National Police vehicle markings (Поліція 102)'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_79_architecture_church_and_castle',
    categoryId: 'city-streets',
    titleUk: 'Архітекту́ра України: собо́р, дзвіни́ця та форте́ця',
    titleEn: 'Ukrainian Architectural Heritage: Golden-Domed Cathedral and Fortress',
    settingEn: 'Panoramic Ukrainian cultural heritage view combining a golden-domed cathedral with bell tower, stone arch, wrought-iron gates, monument statue, and medieval Kamianets-Podilskyi fortress towers.',
    anchorsEn: ['Ukrainian Baroque golden domes and cross', 'Kamianets-Podilskyi stone tower roof silhouette'],
    visualFraming: 'street_urban_scene',
  },
  {
    sceneCode: 'uk_scene_80_family_celebration_gift_exchange',
    categoryId: 'living-room',
    titleUk: 'Родинне свя́то вдо́ма: подару́нки, торт та свічки́',
    titleEn: 'Ukrainian Family Celebration with Birthday Cake, Gifts, and Balloons',
    settingEn: 'Joyful three-generation Ukrainian family gathering in a living room with grandmother, grandfather, mother, father, son, daughter, birthday cake with candles, wrapped gift box with ribbon, balloons, and greeting card.',
    anchorsEn: ['Greeting card inscribed З Днем народження!', 'Family dressed in contemporary smart casual and modern vyshyvankas'],
    visualFraming: 'full_room_scene',
  },
];

const SCENE_CATEGORY_TAG_NORMALIZATION: Record<string, string> = {
  living_room: 'living-room',
  dining_room: 'dining-room',
  city_street: 'city-streets',
  street: 'city-streets',
  'civic-services': 'city-streets',
  'post-office': 'city-streets',
  'shopping-district': 'city-streets',
  'travel-landmarks': 'city-streets',
  'airport-train': 'airport-train-station',
  'airport-station': 'airport-train-station',
  airport: 'airport-train-station',
  train_station: 'airport-train-station',
  hospital: 'hospital-pharmacy',
  pharmacy: 'hospital-pharmacy',
  'body-health': 'hospital-pharmacy',
  'optometry-clinic': 'hospital-pharmacy',
  market: 'farmers-market',
  beach: 'beach-nature',
  port: 'beach-nature',
  park: 'park-garden',
  courtyard: 'park-garden',
  'zoo-aquarium': 'park-garden',
  forest: 'park-garden',
  'night-sky-nature': 'camping-nature',
  'farm-wildlife': 'countryside',
  gym: 'gym-fitness',
  stadium: 'gym-fitness',
  sports_venue: 'gym-fitness',
  'garage-workshop': 'home-workshop',
  'garage-auto': 'home-workshop',
  apartment_hallway: 'hallway-entry',
  hallway: 'hallway-entry',
  clothing_store: 'clothing-store',
  'tailor-atelier': 'clothing-store',
  'hair-salon': 'clothing-store',
  'cultural-music': 'art-studio',
  'hotel-room': 'hotel',
  laundry: 'bathroom',
  'public-restroom': 'bathroom',
  'school-corridor': 'classroom',
  'pet-shop': 'park-garden',
  'portrait-family': 'hospital-pharmacy',
};

const RELATED_SCENE_CATEGORIES_BY_CATEGORY: Record<string, readonly string[]> = {
  kitchen: ['dining-room', 'supermarket', 'farmers-market', 'bakery', 'cafe', 'restaurant', 'living-room', 'hotel'],
  'dining-room': ['kitchen', 'cafe', 'restaurant', 'bakery', 'supermarket', 'living-room', 'hotel'],
  supermarket: ['farmers-market', 'kitchen', 'bakery', 'dining-room', 'cafe', 'restaurant', 'clothing-store', 'city-streets', 'hospital-pharmacy'],
  'farmers-market': ['supermarket', 'kitchen', 'countryside', 'bakery', 'dining-room', 'park-garden'],
  bakery: ['cafe', 'kitchen', 'supermarket', 'dining-room', 'restaurant'],
  cafe: ['bakery', 'restaurant', 'dining-room', 'kitchen', 'supermarket', 'city-streets', 'hotel'],
  restaurant: ['cafe', 'dining-room', 'kitchen', 'bakery', 'hotel'],
  bedroom: ['living-room', 'clothing-store', 'bathroom', 'hallway-entry', 'hotel', 'office', 'classroom', 'art-studio'],
  'living-room': ['bedroom', 'dining-room', 'office', 'hallway-entry', 'hotel', 'art-studio', 'library', 'balcony-garden', 'kitchen'],
  bathroom: ['bedroom', 'hotel', 'hospital-pharmacy', 'hallway-entry', 'gym-fitness'],
  'hallway-entry': ['bedroom', 'living-room', 'clothing-store', 'city-streets', 'office', 'hotel'],
  'balcony-garden': ['park-garden', 'living-room', 'bedroom', 'countryside', 'kitchen'],
  'home-workshop': ['office', 'city-streets', 'countryside', 'hallway-entry', 'art-studio', 'classroom'],
  office: ['classroom', 'library', 'living-room', 'art-studio', 'city-streets', 'bedroom', 'hotel', 'hospital-pharmacy', 'airport-train-station'],
  classroom: ['library', 'office', 'art-studio', 'playground', 'living-room', 'bedroom'],
  library: ['classroom', 'office', 'living-room', 'art-studio'],
  'art-studio': ['classroom', 'living-room', 'office', 'library', 'clothing-store', 'bedroom', 'home-workshop'],
  'clothing-store': ['bedroom', 'hallway-entry', 'supermarket', 'city-streets', 'gym-fitness', 'living-room', 'hotel'],
  'city-streets': ['public-transportation', 'airport-train-station', 'supermarket', 'park-garden', 'clothing-store', 'cafe', 'farmers-market', 'playground', 'countryside', 'home-workshop', 'office', 'hospital-pharmacy'],
  'public-transportation': ['city-streets', 'airport-train-station'],
  'airport-train-station': ['public-transportation', 'city-streets', 'hotel', 'office', 'cafe'],
  'hospital-pharmacy': ['bathroom', 'office', 'bedroom', 'supermarket', 'gym-fitness', 'classroom', 'living-room'],
  'park-garden': ['countryside', 'beach-nature', 'camping-nature', 'playground', 'balcony-garden', 'city-streets', 'farmers-market'],
  playground: ['park-garden', 'gym-fitness', 'classroom', 'bedroom', 'city-streets', 'beach-nature'],
  'gym-fitness': ['playground', 'park-garden', 'hospital-pharmacy', 'clothing-store', 'beach-nature', 'bedroom'],
  countryside: ['park-garden', 'farmers-market', 'camping-nature', 'beach-nature', 'kitchen', 'balcony-garden', 'city-streets'],
  'camping-nature': ['countryside', 'park-garden', 'beach-nature', 'kitchen'],
  'beach-nature': ['park-garden', 'camping-nature', 'countryside', 'gym-fitness', 'playground'],
  hotel: ['bedroom', 'living-room', 'bathroom', 'dining-room', 'airport-train-station', 'office', 'cafe', 'kitchen'],
};

// Explicit primary introduction scene number (1..10) for each of the 29 unique canonical concepts
// represented across the 49 verified hotspots in Scenes 1..10.
const VERIFIED_HOTSPOT_PRIMARY_SCENE_NUMBER: Record<string, number> = {
  'k-table': 1,
  'k-chair': 1,
  'k-oven': 1,
  'k-stove': 1,
  'k-sink': 1,
  'k-pan': 2,
  'k-knife': 2,
  'k-fridge': 3,
  'bd-bed': 4,
  'bd-pillow': 4,
  'bd-blanket': 4,
  'bd-window': 4,
  'bd-curtains': 4,
  'bd-rug': 4,
  'lr-armchair': 5,
  'bd-lamp': 5,
  'lr-tv': 5,
  'of-computer': 6,
  'of-monitor': 6,
  'of-keyboard': 6,
  'of-mouse': 6,
  'bn-mountain': 7,
  'bn-sea': 7,
  'bn-beach': 7,
  'bn-sand': 7,
  'pk-tree': 8,
  'bn-lake': 9,
  'bn-wave': 10,
  'bn-stone': 10,
};

export function resolveCanonicalVocabularyIdForHotspot(hotspotVocabularyId: string): string {
  const alias = IDENTIFY_LEGACY_HOTSPOT_ALIAS_MAP.find(
    (entry) => entry.legacyHotspotVocabularyId === hotspotVocabularyId
  );
  return alias ? alias.canonicalVocabularyId : hotspotVocabularyId;
}

export function normalizeConceptSceneCategories(
  rawCategories: readonly string[]
): readonly string[] {
  const out: string[] = [];
  for (const raw of rawCategories) {
    const norm = SCENE_CATEGORY_TAG_NORMALIZATION[raw] ?? raw;
    if (!out.includes(norm)) {
      out.push(norm);
    }
  }
  return out;
}

const MASTER_TOPIC_GROUP_TO_SCENE_CATEGORIES: Record<string, readonly string[]> = {
  'group-1-home': ['kitchen', 'dining-room', 'living-room', 'bedroom', 'bathroom', 'hallway-entry', 'balcony-garden', 'home-workshop', 'hotel', 'office'],
  'group-2-food': ['kitchen', 'dining-room', 'supermarket', 'farmers-market', 'bakery', 'cafe', 'restaurant'],
  'group-3-city': ['city-streets', 'supermarket', 'farmers-market', 'clothing-store', 'cafe', 'restaurant', 'public-transportation', 'airport-train-station', 'park-garden', 'office', 'home-workshop'],
  'group-4-travel': ['airport-train-station', 'public-transportation', 'city-streets', 'hotel', 'camping-nature', 'beach-nature', 'park-garden'],
  'group-5-education': ['classroom', 'library', 'office', 'art-studio', 'bedroom', 'living-room'],
  'group-6-people': ['living-room', 'dining-room', 'city-streets', 'office', 'classroom', 'hospital-pharmacy', 'cafe', 'supermarket', 'park-garden', 'art-studio', 'hotel'],
  'group-7-nature': ['park-garden', 'countryside', 'beach-nature', 'camping-nature', 'balcony-garden', 'farmers-market', 'city-streets'],
  'group-8-health': ['hospital-pharmacy', 'bathroom', 'gym-fitness', 'bedroom', 'playground', 'park-garden'],
  'group-9-tech': ['office', 'living-room', 'bedroom', 'classroom', 'city-streets', 'home-workshop', 'kitchen'],
};

const MASTER_NOUN_BY_VOCAB_ID = new Map(
  IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
);

export function isConceptSemanticallyCompatibleWithSceneCategory(
  concept: IdentifyFinal1200CurriculumConcept,
  sceneCategoryId: string
): boolean {
  const master = MASTER_NOUN_BY_VOCAB_ID.get(concept.vocabularyId);
  const normCats = normalizeConceptSceneCategories([
    ...concept.candidateSceneCategories,
    ...(master ? master.suitableCategoryIds : []),
    ...(master ? (MASTER_TOPIC_GROUP_TO_SCENE_CATEGORIES[master.topicGroupId] ?? []) : []),
  ]);
  if (normCats.includes(sceneCategoryId)) {
    return true;
  }
  const related = RELATED_SCENE_CATEGORIES_BY_CATEGORY[sceneCategoryId] ?? [];
  return normCats.some((c) => related.includes(c));
}

function scoreConceptForSceneBlueprint(
  concept: IdentifyFinal1200CurriculumConcept,
  bp: RawUkrainianSceneBlueprint
): number {
  const normCats = normalizeConceptSceneCategories(concept.candidateSceneCategories);
  const compatible = isConceptSemanticallyCompatibleWithSceneCategory(
    concept,
    bp.categoryId
  );
  if (!compatible) {
    return 0;
  }

  const settingWords = new Set(
    `${bp.titleEn} ${bp.settingEn} ${bp.titleUk}`
      .toLowerCase()
      .replace(/[^a-zа-яіїєґ0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3)
  );
  const enTokens = concept.en
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .split(/[\s/,_-]+/)
    .filter(
      (tok) =>
        tok.length >= 4 &&
        tok !== 'with' &&
        tok !== 'from' &&
        tok !== 'room' &&
        tok !== 'table' &&
        tok !== 'hand'
    );

  let score = 0;

  // 1. Direct whole-word keyword mention in scene title/setting description (only when semantically compatible)
  for (const tok of enTokens) {
    if (settingWords.has(tok)) {
      score += 120;
      break;
    }
  }

  // 2. Direct category match
  const directIdx = normCats.indexOf(bp.categoryId);
  if (directIdx === 0) {
    score += 90;
  } else if (directIdx > 0) {
    score += 70 - Math.min(directIdx * 5, 20);
  } else {
    // 3. Related domain category match
    const related = RELATED_SCENE_CATEGORIES_BY_CATEGORY[bp.categoryId] ?? [];
    const relIdx = normCats.findIndex((c) => related.includes(c));
    if (relIdx !== -1) {
      score += 35 - Math.min(relIdx * 3, 15);
    } else {
      score += 22;
    }
  }

  // 4. Visual framing alignment bonus
  if (concept.visualFraming === bp.visualFraming) {
    score += 15;
  }

  // 5. Priority bonus (essential first)
  if (concept.priority === 'essential_everyday') {
    score += 6;
  } else if (concept.priority === 'common_situational') {
    score += 3;
  }

  // 6. Specificity bonus (fewer candidate categories = more specialized to its matched category)
  if (directIdx !== -1) {
    score += Math.max(0, 12 - normCats.length * 2);
  }

  return score;
}

function build80SceneUkrainianCurriculumPlan(): readonly IdentifyUkrainian80SceneSpec[] {
  const concepts = IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS;
  const playableCategories = getPlayableIdentifyCategories();
  const playableScenesById = new Map(
    playableCategories.flatMap((c) => c.scenes).map((s) => [s.id, s])
  );
  const conceptByVocabId = new Map(concepts.map((c) => [c.vocabularyId, c]));

  // Track primary concepts and spiral-review concepts per scene (index 0..79)
  const scenePrimaryConcepts: IdentifyFinal1200CurriculumConcept[][] = Array.from(
    { length: 80 },
    () => []
  );
  const sceneReviewConcepts: IdentifyFinal1200CurriculumConcept[][] = Array.from(
    { length: 80 },
    () => []
  );
  const sceneVerifiedHotspotByCanonVocabId: Map<
    string,
    {
      hotspotId: string;
      legacyHotspotVocabularyId: string;
      uk: string;
      en: string;
      x: number;
      y: number;
      width: number;
      height: number;
      isPrimaryIntroduction: boolean;
    }
  >[] = Array.from({ length: 80 }, () => new Map());

  const assignedPrimaryVocabIds = new Set<string>();

  // Pass 1: Bind all 49 verified hotspots in Scenes 1..10 to their exact canonical concepts and coordinates
  for (let idx = 0; idx < UKRAINIAN_80_SCENE_BLUEPRINTS.length; idx++) {
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[idx];
    const sceneNumber = idx + 1;
    const verifiedScene = bp.verifiedPlayableSceneId
      ? playableScenesById.get(bp.verifiedPlayableSceneId)
      : undefined;
    const approvedTargets = verifiedScene
      ? getApprovedLearnerTargets(verifiedScene)
      : [];

    for (const ht of approvedTargets) {
      const canonVocabId = resolveCanonicalVocabularyIdForHotspot(ht.vocabularyId);
      const concept = conceptByVocabId.get(canonVocabId);
      if (!concept) {
        throw new Error(
          `Verified hotspot ${ht.id} (${ht.vocabularyId}) in scene ${bp.sceneCode} failed to resolve to a canonical 1,200 concept`
        );
      }
      const isPrimary =
        VERIFIED_HOTSPOT_PRIMARY_SCENE_NUMBER[canonVocabId] === sceneNumber;
      sceneVerifiedHotspotByCanonVocabId[idx].set(canonVocabId, {
        hotspotId: ht.id,
        legacyHotspotVocabularyId: ht.vocabularyId,
        uk: ht.uk,
        en: ht.en,
        x: ht.x,
        y: ht.y,
        width: ht.width,
        height: ht.height,
        isPrimaryIntroduction: isPrimary,
      });

      if (isPrimary) {
        scenePrimaryConcepts[idx].push(concept);
        assignedPrimaryVocabIds.add(concept.vocabularyId);
      } else {
        sceneReviewConcepts[idx].push(concept);
      }
    }
  }

  // Pass 2: Semantic allocation of the remaining 1,171 primary concepts (15 primary introductions per scene)
  // Order scenes so specialized/smaller-category scenes claim their exact domain items first,
  // while preserving deterministic ordering.
  const categorySceneCount = new Map<string, number>();
  for (const bp of UKRAINIAN_80_SCENE_BLUEPRINTS) {
    categorySceneCount.set(bp.categoryId, (categorySceneCount.get(bp.categoryId) ?? 0) + 1);
  }

  const sceneOrder = Array.from({ length: 80 }, (_, i) => i).sort((a, b) => {
    const catA = UKRAINIAN_80_SCENE_BLUEPRINTS[a].categoryId;
    const catB = UKRAINIAN_80_SCENE_BLUEPRINTS[b].categoryId;
    const countDiff = (categorySceneCount.get(catA) ?? 0) - (categorySceneCount.get(catB) ?? 0);
    if (countDiff !== 0) return countDiff;
    return a - b;
  });

  // Sub-pass 2A: Fill scenes using direct/keyword/related semantic matches (score >= 20)
  for (const sceneIdx of sceneOrder) {
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[sceneIdx];
    const existingInScene = new Set([
      ...scenePrimaryConcepts[sceneIdx].map((c) => c.vocabularyId),
      ...sceneReviewConcepts[sceneIdx].map((c) => c.vocabularyId),
    ]);

    const candidates = concepts
      .filter(
        (c) =>
          !assignedPrimaryVocabIds.has(c.vocabularyId) &&
          !existingInScene.has(c.vocabularyId)
      )
      .map((c) => ({
        concept: c,
        score: scoreConceptForSceneBlueprint(c, bp),
      }))
      .filter((entry) => entry.score >= 20)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.concept.finalRank - b.concept.finalRank;
      });

    for (const entry of candidates) {
      if (scenePrimaryConcepts[sceneIdx].length >= 15) break;
      scenePrimaryConcepts[sceneIdx].push(entry.concept);
      assignedPrimaryVocabIds.add(entry.concept.vocabularyId);
      existingInScene.add(entry.concept.vocabularyId);
    }
  }

  // Sub-pass 2B: Any remaining scenes with < 15 primary concepts take highest-scoring remaining concepts
  for (const sceneIdx of sceneOrder) {
    if (scenePrimaryConcepts[sceneIdx].length >= 15) continue;
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[sceneIdx];
    const existingInScene = new Set([
      ...scenePrimaryConcepts[sceneIdx].map((c) => c.vocabularyId),
      ...sceneReviewConcepts[sceneIdx].map((c) => c.vocabularyId),
    ]);

    const remaining = concepts
      .filter(
        (c) =>
          !assignedPrimaryVocabIds.has(c.vocabularyId) &&
          !existingInScene.has(c.vocabularyId)
      )
      .map((c) => ({
        concept: c,
        score: scoreConceptForSceneBlueprint(c, bp),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.concept.finalRank - b.concept.finalRank;
      });

    for (const entry of remaining) {
      if (scenePrimaryConcepts[sceneIdx].length >= 15) break;
      scenePrimaryConcepts[sceneIdx].push(entry.concept);
      assignedPrimaryVocabIds.add(entry.concept.vocabularyId);
      existingInScene.add(entry.concept.vocabularyId);
    }
  }

  // Pass 3: Populate spiral-review slots (3 per scene) with semantically compatible essential/common concepts
  const reviewUsageCount = new Map<string, number>();
  for (let idx = 0; idx < 80; idx++) {
    for (const rev of sceneReviewConcepts[idx]) {
      reviewUsageCount.set(rev.vocabularyId, (reviewUsageCount.get(rev.vocabularyId) ?? 0) + 1);
    }
  }

  for (let idx = 0; idx < 80; idx++) {
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[idx];
    const existingInScene = new Set([
      ...scenePrimaryConcepts[idx].map((c) => c.vocabularyId),
      ...sceneReviewConcepts[idx].map((c) => c.vocabularyId),
    ]);

    const reviewCandidates = concepts
      .filter((c) => !existingInScene.has(c.vocabularyId))
      .map((c) => {
        const baseScore = scoreConceptForSceneBlueprint(c, bp);
        const usedPenalty = (reviewUsageCount.get(c.vocabularyId) ?? 0) * 25;
        return {
          concept: c,
          score: baseScore - usedPenalty,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.concept.finalRank - b.concept.finalRank;
      });

    for (const entry of reviewCandidates) {
      if (sceneReviewConcepts[idx].length >= 3) break;
      sceneReviewConcepts[idx].push(entry.concept);
      existingInScene.add(entry.concept.vocabularyId);
      reviewUsageCount.set(
        entry.concept.vocabularyId,
        (reviewUsageCount.get(entry.concept.vocabularyId) ?? 0) + 1
      );
    }
  }

  // Pass 4: Assemble final IdentifyUkrainian80SceneSpec objects with verified hotspots first in Scenes 1..10
  return UKRAINIAN_80_SCENE_BLUEPRINTS.map((bp, idx) => {
    const sceneNumber = idx + 1;
    const verifiedScene = bp.verifiedPlayableSceneId
      ? playableScenesById.get(bp.verifiedPlayableSceneId)
      : undefined;
    const approvedTargets = verifiedScene
      ? getApprovedLearnerTargets(verifiedScene)
      : [];
    const verifiedMap = sceneVerifiedHotspotByCanonVocabId[idx];

    const orderedEntries: {
      concept: IdentifyFinal1200CurriculumConcept;
      isPrimary: boolean;
    }[] = [];
    const placedVocabIds = new Set<string>();

    // Place verified hotspots first in the exact order of approvedTargets
    for (const ht of approvedTargets) {
      const canonVocabId = resolveCanonicalVocabularyIdForHotspot(ht.vocabularyId);
      const concept = conceptByVocabId.get(canonVocabId)!;
      const vMeta = verifiedMap.get(canonVocabId)!;
      orderedEntries.push({
        concept,
        isPrimary: vMeta.isPrimaryIntroduction,
      });
      placedVocabIds.add(canonVocabId);
    }

    // Place remaining unverified primary introductions
    for (const c of scenePrimaryConcepts[idx]) {
      if (!placedVocabIds.has(c.vocabularyId)) {
        orderedEntries.push({ concept: c, isPrimary: true });
        placedVocabIds.add(c.vocabularyId);
      }
    }

    // Place remaining unverified spiral reviews
    for (const c of sceneReviewConcepts[idx]) {
      if (!placedVocabIds.has(c.vocabularyId)) {
        orderedEntries.push({ concept: c, isPrimary: false });
        placedVocabIds.add(c.vocabularyId);
      }
    }

    const isVerifiedPlayable = Boolean(verifiedScene && bp.verifiedAssetPath);

    const targets: IdentifyUkrainian80SceneTargetAssociation[] = orderedEntries.map(
      (entry, slotIdx) => {
        const c = entry.concept;
        const verifiedHotspot = verifiedMap.get(c.vocabularyId);
        const isHotspotVerified = Boolean(verifiedHotspot && isVerifiedPlayable);

        return {
          slotNumber: slotIdx + 1,
          vocabularyId: c.vocabularyId,
          legacyHotspotVocabularyId: verifiedHotspot
            ? verifiedHotspot.legacyHotspotVocabularyId
            : null,
          verifiedHotspotId: verifiedHotspot ? verifiedHotspot.hotspotId : null,
          conceptId: c.conceptId,
          uk: c.preferredLearnerHeadwordUk,
          en: c.en,
          priority: c.priority,
          isPrimaryIntroduction: entry.isPrimary,
          hotspotVerified: isHotspotVerified,
          isTargetPlayableForLearner: isHotspotVerified,
          normalizedBoundingBox: verifiedHotspot
            ? {
                x: verifiedHotspot.x,
                y: verifiedHotspot.y,
                width: verifiedHotspot.width,
                height: verifiedHotspot.height,
              }
            : null,
        };
      }
    );

    const verifiedCount = targets.filter((t) => t.hotspotVerified).length;

    const targetListForPrompt = targets
      .slice(0, 12)
      .map((t) => `${t.en} (${t.uk})`)
      .join(', ');

    const generationPromptEn = `Photorealistic eye-level photograph set in Contemporary 2020s Ukraine (${bp.titleEn} / ${bp.titleUk}). Setting: ${bp.settingEn}. Authentic Ukrainian cultural anchors: ${bp.anchorsEn.join('; ')}. All visible signage and packaging strictly in Ukrainian Cyrillic (zero Russian or foreign landmarks). Clearly visible, unoccluded, well-separated everyday objects for language-learning hotspot identification: ${targetListForPrompt}. Natural daylight, 4:3 aspect ratio, crisp focus across foreground and midground.`;

    return {
      sceneNumber,
      sceneCode: bp.sceneCode,
      languageCode: 'uk',
      categoryId: bp.categoryId,
      titleUk: bp.titleUk,
      titleEn: bp.titleEn,
      contemporaryUkrainianSettingDescriptionEn: bp.settingEn,
      ukrainianCulturalAnchorsEn: bp.anchorsEn,
      visualFraming: bp.visualFraming,
      generationPromptEn,
      assetPath: bp.verifiedAssetPath ?? null,
      assetExistsOnDisk: isVerifiedPlayable,
      imageGenerationStatus: isVerifiedPlayable
        ? 'verified_existing_asset_on_disk'
        : 'blocked_by_ai_studio_image_quota',
      verificationStatus: isVerifiedPlayable
        ? 'verified_playable'
        : 'planned_unverified_not_exposed_to_learners',
      learnerExposureAllowed: isVerifiedPlayable,
      containsForeignLandmarks: false,
      targetCount: 18,
      verifiedHotspotCount: verifiedCount,
      targets,
    };
  });
}

export const IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN: readonly IdentifyUkrainian80SceneSpec[] =
  build80SceneUkrainianCurriculumPlan();

// ----------------------------------------------------------------------------
// 5. Image Generation Probe Record & Summary Helper
// ----------------------------------------------------------------------------

export const IDENTIFY_IMAGE_GENERATION_PROBE_RESULT = {
  probedAtIso: '2026-11-04T12:19:50-08:00',
  toolCalled: 'generate_image',
  probedImageName: 'kitchen_02_ukrainian_breakfast',
  probeStatus: 'RESOURCE_EXHAUSTED' as const,
  exactErrorMessage:
    'Cannot call generate_image: google_api_error: "generic::resource_exhausted: You exceeded your current quota, please check your plan and billing details."',
  safetyActionTakenEn:
    'Halted further generate_image calls immediately per protocol; recorded all 70 ungenerated Ukrainian scene prompts in IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN with learnerExposureAllowed=false so zero unverified hotspots or synthetic placeholder images are ever exposed to students.',
} as const;

export interface IdentifyFinal1200And80SceneSummary {
  legacyMasterTotal: 2000;
  legacyReviewedTotal: 2000;
  legacyProvisionalKeepCount: 1179;
  legacyProvisionalReviewCount: 323;
  legacyProvisionalExcludeCount: 498;
  reconciledDemotedKeepsCount: 14;
  reconciledRetainedKeepsCount: 1165;
  reconciledPromotedReviewsCount: 7;
  reconciledRemainingReviewsCount: 316;
  protectedMissingConceptsTotal: 34;
  addedVisualMissingExtensionsCount: 28;
  contextualNonClickableMissingCount: 6;
  retiredOutdatedExtensionsCount: 28;
  final1200TotalCount: number;
  final1200PriorityBreakdown: {
    essential_everyday: number;
    common_situational: number;
    useful_extended: number;
  };
  ukrainian80ScenesTotalCount: number;
  totalSceneWordAssociationsCount: number;
  primaryIntroductionAssociationsCount: number;
  spiralReviewAssociationsCount: number;
  uniqueFinalConceptsCoveredAcross80ScenesCount: number;
  all1200CoveredAtLeastOnce: boolean;
  scenesReadyForStudentsCount: number;
  scenesPlannedAwaitingImageGenerationCount: number;
  verifiedActiveHotspotsCount: number;
  unverifiedPlannedHotspotsExcludedCount: number;
  foreignLandmarksCount: 0;
  imageGenerationProbeResult: typeof IDENTIFY_IMAGE_GENERATION_PROBE_RESULT;
}

export function getIdentifyFinal1200And80SceneSummary(): IdentifyFinal1200And80SceneSummary {
  const priorityBreakdown = {
    essential_everyday: 0,
    common_situational: 0,
    useful_extended: 0,
  };
  for (const c of IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS) {
    priorityBreakdown[c.priority]++;
  }

  const coveredConceptIds = new Set<string>();
  let totalAssociations = 0;
  let primaryIntroductionAssociationsCount = 0;
  let spiralReviewAssociationsCount = 0;
  let verifiedActiveHotspotsCount = 0;
  let unverifiedPlannedHotspotsExcludedCount = 0;
  let scenesReadyForStudentsCount = 0;
  let scenesPlannedAwaitingImageGenerationCount = 0;

  for (const scene of IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN) {
    if (scene.learnerExposureAllowed && scene.verificationStatus === 'verified_playable') {
      scenesReadyForStudentsCount++;
    } else {
      scenesPlannedAwaitingImageGenerationCount++;
    }
    for (const t of scene.targets) {
      totalAssociations++;
      coveredConceptIds.add(t.conceptId);
      if (t.isPrimaryIntroduction) {
        primaryIntroductionAssociationsCount++;
      } else {
        spiralReviewAssociationsCount++;
      }
      if (t.hotspotVerified) {
        verifiedActiveHotspotsCount++;
      } else {
        unverifiedPlannedHotspotsExcludedCount++;
      }
    }
  }

  return {
    legacyMasterTotal: 2000,
    legacyReviewedTotal: 2000,
    legacyProvisionalKeepCount: 1179,
    legacyProvisionalReviewCount: 323,
    legacyProvisionalExcludeCount: 498,
    reconciledDemotedKeepsCount: 14,
    reconciledRetainedKeepsCount: 1165,
    reconciledPromotedReviewsCount: 7,
    reconciledRemainingReviewsCount: 316,
    protectedMissingConceptsTotal: 34,
    addedVisualMissingExtensionsCount: 28,
    contextualNonClickableMissingCount: 6,
    retiredOutdatedExtensionsCount: IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28.length as 28,
    final1200TotalCount: IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.length,
    final1200PriorityBreakdown: priorityBreakdown,
    ukrainian80ScenesTotalCount: IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.length,
    totalSceneWordAssociationsCount: totalAssociations,
    primaryIntroductionAssociationsCount,
    spiralReviewAssociationsCount,
    uniqueFinalConceptsCoveredAcross80ScenesCount: coveredConceptIds.size,
    all1200CoveredAtLeastOnce: coveredConceptIds.size === 1200,
    scenesReadyForStudentsCount,
    scenesPlannedAwaitingImageGenerationCount,
    verifiedActiveHotspotsCount,
    unverifiedPlannedHotspotsExcludedCount,
    foreignLandmarksCount: 0,
    imageGenerationProbeResult: IDENTIFY_IMAGE_GENERATION_PROBE_RESULT,
  };
}

