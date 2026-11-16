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
  candidateNormalizedBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  hotspotReviewStatus?:
    | 'verified_playable'
    | 'needs_human_review'
    | 'unannotated';
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
    | 'generated_verified_on_disk'
    | 'blocked_by_ai_studio_image_quota';
  verificationStatus:
    | 'verified_playable'
    | 'planned_unverified_not_exposed_to_learners';
  learnerExposureAllowed: boolean;
  containsForeignLandmarks: false;
  targetCount: 18;
  verifiedHotspotCount: number;
  candidateHotspotCount?: number;
  batchExecutionNumber?: number | null;
  imageDimensions?: {
    width: number;
    height: number;
    aspectRatio: '16:9' | '4:3';
  } | null;
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
  generatedAssetPath?: string;
  batchExecutionNumber?: number;
  imageDimensions?: {
    width: number;
    height: number;
    aspectRatio: '16:9' | '4:3';
  };
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

  // 11–80: 70 Planned Contemporary Ukrainian Photorealistic Scenes (Batch 1 completed for Scenes 11–12)
  {
    sceneCode: 'uk_scene_11_dining_festive_ukrainian_table',
    categoryId: 'dining-room',
    titleUk: 'Святко́вий обі́дній стіл з варе́никами та узва́ром',
    titleEn: 'Festive Ukrainian Dining Table with Varenyky and Uzvar',
    settingEn: 'Bright Ukrainian dining room table set with varenyky, borscht, sour cream, glass pitcher of uzvar, napkins, plates, and cutlery.',
    anchorsEn: ['Embroidered table runner (рушник)', 'Kosiv painted serving bowl with varenyky'],
    visualFraming: 'food_table_display',
    generatedAssetPath: '/assets/identify/dining-room/uk_scene_11_dining_festive_ukrainian_table.jpg',
    batchExecutionNumber: 1,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_12_dining_family_supper',
    categoryId: 'dining-room',
    titleUk: 'Вече́ря у віта́льні-їда́льні',
    titleEn: 'Family Supper in a Modern Ukrainian Dining Room',
    settingEn: 'Contemporary Kyiv apartment dining area with oak table, chairs, chandelier, flower vase, breadbasket, salt shaker, and pepper mill.',
    anchorsEn: ['Dark Ukrainian rye bread (житній хліб)', 'Bouquet of sunflowers and viburnum (калина) in a glass vase'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/dining-room/uk_scene_12_dining_family_supper.jpg',
    batchExecutionNumber: 1,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_13_living_room_kyiv_apartment',
    categoryId: 'living-room',
    titleUk: 'Суча́сна віта́льня в ки́ївській кварти́рі',
    titleEn: 'Modern Living Room in a Kyiv Apartment',
    settingEn: 'Comfortable Ukrainian living room with sofa, throw pillows, coffee table, television, bookshelf, floor lamp, and woven rug.',
    anchorsEn: ['Ukrainian books on shelf (Кобзар, сучасна українська література)', 'Carpathian wool throw blanket (ліжник)'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/living-room/uk_scene_13_living_room_kyiv_apartment.jpg',
    batchExecutionNumber: 2,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_14_living_room_music_corner',
    categoryId: 'living-room',
    titleUk: 'Музи́чний куто́чок з банду́рою та сопі́лкою',
    titleEn: 'Home Music Corner with Bandura, Sopilka, and Guitar',
    settingEn: 'Sunlit apartment corner featuring an acoustic guitar, Ukrainian bandura, wooden sopilka on a stand, armchair, curtains, and framed art.',
    anchorsEn: ['Chernihiv concert bandura (бандура)', 'Carved wooden sopilka (сопілка)'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/living-room/uk_scene_14_living_room_music_corner.jpg',
    batchExecutionNumber: 2,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_15_bedroom_master_suite',
    categoryId: 'bedroom',
    titleUk: 'Спа́льня з дерев’я́ним лі́жком та ша́фою',
    titleEn: 'Ukrainian Apartment Bedroom with Wardrobe and Bed',
    settingEn: 'Calm contemporary bedroom with double bed, pillows, duvet, nightstand, alarm clock, desk lamp, wardrobe, and clothes hangers.',
    anchorsEn: ['Linen bedding with subtle geometric embroidery', 'Ukrainian wall calendar in Cyrillic'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/bedroom/uk_scene_15_bedroom_master_suite.jpg',
    batchExecutionNumber: 3,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_16_bedroom_dressing_vanity',
    categoryId: 'bedroom',
    titleUk: 'Туале́тний сто́лик та гардеро́б',
    titleEn: 'Bedroom Vanity Table and Wardrobe Mirror',
    settingEn: 'Close-up bedroom dressing area with mirror, hairbrush, comb, scrunchie, hairpin, perfume bottle, jewelry box, and folded sweaters.',
    anchorsEn: ['Red coral necklace (коралове намисто) in jewelry dish', 'Embroidered vyshyvanka hanging on wardrobe door'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/bedroom/uk_scene_16_bedroom_dressing_vanity.jpg',
    batchExecutionNumber: 3,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_17_bedroom_child_nursery',
    categoryId: 'bedroom',
    titleUk: 'Дитя́ча кімна́та з і́грашками',
    titleEn: 'Children’s Room with Toys and Study Desk',
    settingEn: 'Bright Ukrainian children’s bedroom with bunk bed, teddy bear, doll, toy blocks, globe, colored pencils, and picture books.',
    anchorsEn: ['Ukrainian alphabet poster (Абетка) on the wall', 'Illustrated Ukrainian fairy-tale book (Казки)'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/bedroom/uk_scene_17_bedroom_child_nursery.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_18_bathroom_modern_apartment',
    categoryId: 'bathroom',
    titleUk: 'Ва́нна кімна́та з пра́льною маши́ною',
    titleEn: 'Modern Ukrainian Apartment Bathroom and Laundry',
    settingEn: 'Tiled apartment bathroom with bathtub, shower head, sink, faucet, mirror, washing machine, laundry hamper, and bath towels.',
    anchorsEn: ['Heated chrome towel rail (рушникосушарка) typical of Ukrainian apartments', 'Detergent box labeled Пральний порошок'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/bathroom/uk_scene_18_bathroom_modern_apartment.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_19_bathroom_vanity_hygiene',
    categoryId: 'bathroom',
    titleUk: 'Поли́чка у ва́нній: засоби гігіє́ни',
    titleEn: 'Bathroom Sink Shelf and Personal Hygiene Items',
    settingEn: 'Close-up of a bright bathroom counter with liquid soap dispenser, toothbrush, toothpaste, shampoo, sponge, razor, tweezers, and hairdryer.',
    anchorsEn: ['Ukrainian herbal shampoo bottle (Шампунь з ромашкою)', 'Ceramic soap dish'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/bathroom/uk_scene_19_bathroom_vanity_hygiene.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_20_hallway_apartment_entry',
    categoryId: 'hallway-entry',
    titleUk: 'Передпо́кій кварти́ри: вхі́дні две́рі та взуття́',
    titleEn: 'Apartment Entry Hallway with Coat Rack and Shoes',
    settingEn: 'Ukrainian apartment entrance corridor with front door, lock, keys, intercom handset, coat rack, umbrella, sneakers, boots, and shoehorn.',
    anchorsEn: ['Apartment intercom panel (домофон)', 'Communal utility meter display in hallway'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/hallway-entry/uk_scene_20_hallway_apartment_entry.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_21_balcony_urban_garden',
    categoryId: 'balcony-garden',
    titleUk: 'Зати́шний ки́ївський балко́н з вазо́нами',
    titleEn: 'Sunny Kyiv Apartment Balcony with Potted Plants',
    settingEn: 'Glazed and open Ukrainian apartment balcony with flowerpots, watering can, folding chair, clothes drying rack, and courtyard view.',
    anchorsEn: ['Geranium and petunia planters along balcony rail', 'Courtyard chestnut trees (київські каштани) in background'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/balcony-garden/uk_scene_21_balcony_urban_garden.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_22_home_workshop_tools',
    categoryId: 'home-workshop',
    titleUk: 'Дома́шня майсте́рня та інструме́нти',
    titleEn: 'Home Workshop Workbench and Hand Tools',
    settingEn: 'Organized garage or apartment tool bench with hammer, screwdriver, pliers, wrench, saw, tape measure, level, nails, screws, and flashlight.',
    anchorsEn: ['Metric tape measure (рулетка / сантиметрова стрічка)', 'Toolboxes labeled Інструменти'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/home-workshop/uk_scene_22_home_workshop_tools.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_23_supermarket_fresh_produce',
    categoryId: 'supermarket',
    titleUk: 'Відді́л о́вочів та фру́ктів у суперма́ркеті',
    titleEn: 'Supermarket Fresh Produce Section',
    settingEn: 'Modern Ukrainian supermarket produce aisle with apples, pears, bananas, lemons, tomatoes, cucumbers, potatoes, carrots, onions, and shopping basket.',
    anchorsEn: ['Ukrainian price tags in hryvnias (грн / ₴)', 'Signage Овочі та фрукти'],
    visualFraming: 'market_counter_display',
    generatedAssetPath: '/assets/identify/supermarket/uk_scene_23_supermarket_fresh_produce.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_24_supermarket_dairy_bakery',
    categoryId: 'supermarket',
    titleUk: 'Моло́чний та хлі́бний відді́л суперма́ркету',
    titleEn: 'Supermarket Dairy, Cheese, and Bakery Aisle',
    settingEn: 'Refrigerated dairy display and bakery rack with milk, kefir, ryazhanka, butter, sour cream, cottage cheese, eggs, loaf of bread, and lavash.',
    anchorsEn: ['Ukrainian dairy labels (Молоко, Кефір, Ряжанка, Сметана, Масло)', 'Hryvnia shelf labels (₴)'],
    visualFraming: 'market_counter_display',
    generatedAssetPath: '/assets/identify/supermarket/uk_scene_24_supermarket_dairy_bakery.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_25_supermarket_checkout_counter',
    categoryId: 'supermarket',
    titleUk: 'Ка́са в українському суперма́ркеті',
    titleEn: 'Supermarket Checkout Counter and Payment Terminal',
    settingEn: 'Supermarket checkout lane with cashier, conveyor belt, barcode scanner, payment terminal, receipt, wallet, bank card, coins, and shopping cart.',
    anchorsEn: ['Ukrainian hryvnia banknotes and coins (гривні)', 'Receipt printed in Ukrainian (Фіскальний чек)'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/supermarket/uk_scene_25_supermarket_checkout_counter.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_26_farmers_market_bazaar',
    categoryId: 'farmers-market',
    titleUk: 'Ферме́рський ри́нок: мед, горі́хи та я́годи',
    titleEn: 'Ukrainian Farmers’ Market Stall with Honey and Berries',
    settingEn: 'Outdoor Ukrainian farmers’ market counter with jars of golden honey, walnuts, strawberries, cherries, plums, raspberries, scale, and seller in apron.',
    anchorsEn: ['Handwritten price cards in грн/кг', 'Carpathian wildflower honey jars (Мед карпатський)'],
    visualFraming: 'market_counter_display',
    generatedAssetPath: '/assets/identify/farmers-market/uk_scene_26_farmers_market_bazaar.jpg',
    batchExecutionNumber: 4,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_27_farmers_market_vegetables_herbs',
    categoryId: 'farmers-market',
    titleUk: 'Овоче́вий ряд на база́рі: буря́к, гарбу́з та зе́лень',
    titleEn: 'Market Vegetable Row with Beetroot, Pumpkin, and Dill',
    settingEn: 'Vibrant market stall displaying beetroot, cabbage, pumpkin, zucchini, eggplant, bell peppers, garlic braids, fresh dill, parsley, and wicker baskets.',
    anchorsEn: ['Braided Ukrainian garlic garlands', 'Signage Домашні овочі'],
    visualFraming: 'market_counter_display',
    generatedAssetPath: '/assets/identify/farmers-market/uk_scene_27_farmers_market_vegetables_herbs.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_28_bakery_craft_pastry',
    categoryId: 'bakery',
    titleUk: 'Пека́рня: паляни́ця, бу́лочки та пиріжки́',
    titleEn: 'Ukrainian Craft Bakery with Palianytsia and Pastries',
    settingEn: 'Warm neighborhood bakery in Kyiv with crusty wheat palianytsia, braided kolach, poppy-seed roll, croissants, baker in apron, and glass display case.',
    anchorsEn: ['Signage Свіжа випічка / Пекарня', 'Traditional scored Ukrainian паляниця loaf'],
    visualFraming: 'market_counter_display',
    generatedAssetPath: '/assets/identify/bakery/uk_scene_28_bakery_craft_pastry.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_29_cafe_lviv_coffeehouse',
    categoryId: 'cafe',
    titleUk: 'Льві́вська кав’я́рня: ка́ва в дже́зві та сирни́к',
    titleEn: 'Lviv Coffeehouse with Cezve Coffee and Syrnyk Cheesecake',
    settingEn: 'Cozy Lviv café interior with espresso machine, copper cezve (турка), coffee cup, Lviv syrnyk cake, menu board, barista, and marble table.',
    anchorsEn: ['Lviv syrnyk with chocolate glaze', 'Menu board in Ukrainian (Кава по-львівськи, Сирник)'],
    visualFraming: 'food_table_display',
    generatedAssetPath: '/assets/identify/cafe/uk_scene_29_cafe_lviv_coffeehouse.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_30_restaurant_ukrainian_bistro',
    categoryId: 'restaurant',
    titleUk: 'Суча́сний украї́нський рестора́н',
    titleEn: 'Contemporary Ukrainian Bistro Dining Table',
    settingEn: 'Modern Ukrainian restaurant table with waiter holding tray, bill folder, grilled sausage, cutlets, salad bowl, kvass mug, ketchup, and mayonnaise.',
    anchorsEn: ['Ukrainian bistro menu (Меню)', 'Clay crockery and linen napkins'],
    visualFraming: 'food_table_display',
    generatedAssetPath: '/assets/identify/restaurant/uk_scene_30_restaurant_ukrainian_bistro.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_31_clothing_store_boutique',
    categoryId: 'clothing-store',
    titleUk: 'Магази́н о́дягу: вишива́нки, су́кні та сорочки́',
    titleEn: 'Ukrainian Clothing Store with Vyshyvankas and Everyday Wear',
    settingEn: 'Bright clothing boutique in Kyiv displaying embroidered vyshyvankas, dresses, shirts, jeans, skirts, jackets, fitting room mirror, and price tags.',
    anchorsEn: ['Contemporary Ukrainian vyshyvankas with linen embroidery', 'Sale signage in Ukrainian (Нова колекція)'],
    visualFraming: 'clothing_wardrobe_display',
    generatedAssetPath: '/assets/identify/clothing-store/uk_scene_31_clothing_store_boutique.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_32_clothing_winter_outerwear',
    categoryId: 'clothing-store',
    titleUk: 'Зимо́вий о́дяг та аксесуа́ри',
    titleEn: 'Winter Outerwear, Boots, Mittens, and Scarves Display',
    settingEn: 'Seasonal clothing display with wool coat, down jacket, knitted hat, scarf, mittens, leather gloves, tall boots, belt, zipper detail, and backpack.',
    anchorsEn: ['Carpathian patterned knitwear', 'Size labels in Ukrainian'],
    visualFraming: 'clothing_wardrobe_display',
    generatedAssetPath: '/assets/identify/clothing-store/uk_scene_32_clothing_winter_outerwear.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_33_shoe_and_tailor_atelier',
    categoryId: 'clothing-store',
    titleUk: 'Ательє́ кравця́ та майсте́рня о́дягу',
    titleEn: 'Tailor Atelier with Sewing Machine, Fabric, and Buttons',
    settingEn: 'Ukrainian tailor studio with tailor, sewing machine, spool of thread, needle, pins, scissors, buttons, zipper, fabric rolls, and measuring tape.',
    anchorsEn: ['Signage Ательє ремонту одягу', 'Traditional Ukrainian embroidery thread spools'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/clothing-store/uk_scene_33_shoe_and_tailor_atelier.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_34_city_street_kyiv_chestnuts',
    categoryId: 'city-streets',
    titleUk: 'Ву́лиця у це́нтрі Ки́єва під кашта́нами',
    titleEn: 'Central Kyiv Street Under Blossoming Chestnut Trees',
    settingEn: 'Daylight Kyiv street with crosswalk, traffic light, road sign, streetlamp, sidewalk, bench, trash bin, pharmacy sign, and parked car.',
    anchorsEn: ['Blossoming white-and-pink Kyiv chestnut trees', 'Ukrainian street signs (вул. Хрещатик / Перехід)'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_34_city_street_kyiv_chestnuts.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_35_city_square_lviv_rynok',
    categoryId: 'city-streets',
    titleUk: 'Істори́чна пло́ща з ра́тушею та фонта́ном',
    titleEn: 'Historic Ukrainian City Square with City Hall and Fountain',
    settingEn: 'Cobblestone Ukrainian square inspired by Lviv Rynok Square with city hall tower, clock, fountain, pigeons, outdoor café umbrella, and street musician.',
    anchorsEn: ['Lviv Rynok Square architectural facade', 'Ukrainian blue-and-yellow flag on city hall tower'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_35_city_square_lviv_rynok.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_36_city_rainy_sidewalk',
    categoryId: 'city-streets',
    titleUk: 'Дощови́й день у мі́сті: парасо́льки та калю́жі',
    titleEn: 'Rainy Day on a Ukrainian City Sidewalk with Puddles',
    settingEn: 'Wet urban street after rain showing rain puddles, pedestrians with umbrellas and raincoats, storm drain grate, shop window, and rainbow in the sky.',
    anchorsEn: ['Coffee kiosk labeled Кава з собою', 'Reflected Ukrainian signage in rain puddle'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_36_city_rainy_sidewalk.jpg',
    batchExecutionNumber: 5,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_37_city_winter_snow_street',
    categoryId: 'city-streets',
    titleUk: 'Зимо́ва ву́лиця: сніг, буру́льки та ліхтарі́',
    titleEn: 'Winter Street in Ukraine with Snow and Icicles',
    settingEn: 'Snow-covered Ukrainian neighborhood street with icicles hanging from roof eaves, snowman, sled, shovel, warm streetlights, and brick houses.',
    anchorsEn: ['Carpathian or Kyiv winter roofline with icicles', 'Signage Пекарня glowing in evening snow'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_37_city_winter_snow_street.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_38_public_transport_tram_trolleybus',
    categoryId: 'public-transportation',
    titleUk: 'Зупи́нка трамва́я та троле́йбуса',
    titleEn: 'Ukrainian City Tram and Trolleybus Stop',
    settingEn: 'Modern low-floor Ukrainian tram and trolleybus at a city transit shelter with route map, ticket validator, passengers, bicycle lane, and taxi.',
    anchorsEn: ['Yellow-and-blue municipal tram (Електрон)', 'Transit stop sign Зупинка громадського транспорту'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/public-transportation/uk_scene_38_public_transport_tram_trolleybus.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_39_public_transport_kyiv_metro',
    categoryId: 'public-transportation',
    titleUk: 'Ста́нція ки́ївського метро́',
    titleEn: 'Kyiv Metro Station Platform and Escalator',
    settingEn: 'Clean Kyiv metro station interior with escalator, turnstiles, metro train car, platform bench, directional signage, and arched marble columns.',
    anchorsEn: ['Green «М» Kyiv Metro emblem', 'Wayfinding signs in Ukrainian (Вихід у місто / Поїзди до станції)'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/public-transportation/uk_scene_39_public_transport_kyiv_metro.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_40_railway_station_ukrposhta_uz',
    categoryId: 'airport-train-station',
    titleUk: 'Залізни́чний вокза́л та по́тяг «Укрзалізни́ці»',
    titleEn: 'Ukrainian Railway Station Platform and Passenger Train',
    settingEn: 'Central railway station platform in Ukraine with blue-and-yellow passenger railcar, locomotive, departure board, conductor, suitcase, and ticket.',
    anchorsEn: ['Ukrzaliznytsia (УЗ) blue passenger coach', 'Electronic departure board Києва — Львів — Одеса'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/airport-train-station/uk_scene_40_railway_station_ukrposhta_uz.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_41_airport_terminal_check_in',
    categoryId: 'airport-train-station',
    titleUk: 'Терміна́л аеропо́рту: па́спортний контро́ль та бага́ж',
    titleEn: 'Airport Terminal Check-In and Airplane Window View',
    settingEn: 'Modern airport departure hall with check-in desk, biometric Ukrainian passport, boarding pass, luggage scale, rolling suitcase, and airplane visible through window.',
    anchorsEn: ['Biometric Ukrainian passport with Trident (Тризуб)', 'Bilingual Ukrainian/English departure signage (Реєстрація / Відліт)'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/airport-train-station/uk_scene_41_airport_terminal_check_in.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_42_automotive_car_service',
    categoryId: 'city-streets',
    titleUk: 'Автомобі́ль та автосервіс',
    titleEn: 'Passenger Car Exterior, Open Trunk, and Tire Service',
    settingEn: 'Daylight parking area showing a modern hatchback car with open trunk, steering wheel, headlights, side mirror, license plate, spare tire, and jack.',
    anchorsEn: ['Ukrainian UA license plate with blue-and-yellow flag band', 'Roadside sign Автосервіс / Шиномонтаж'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_42_automotive_car_service.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_43_hospital_clinic_consultation',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Кабіне́т сіме́йного лі́каря в поліклі́ніці',
    titleEn: 'Family Doctor’s Office in a Ukrainian Clinic',
    settingEn: 'Bright Ukrainian medical clinic room with doctor in white coat, stethoscope, blood pressure monitor (тонометр), thermometer, anatomical heart chart, and medical record.',
    anchorsEn: ['Wall chart Будова серця та здоров’я', 'Clinic door sign Сімейний лікар'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_43_hospital_clinic_consultation.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_44_hospital_first_aid_treatment',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Перша меди́чна допомо́га та перев’я́зувальна',
    titleEn: 'First-Aid Treatment Room and Medical Supplies',
    settingEn: 'Clean first-aid station showing first-aid kit, bandage, adhesive plaster, syringe, blood sample tube, bruise and minor burn treatment gel, crutches, and walker.',
    anchorsEn: ['First-aid kit labeled Аптечка першої допомоги', 'Ukrainian medical supply labels'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_44_hospital_first_aid_treatment.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_45_pharmacy_apotheca',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Украї́нська апте́ка: лі́ки, вітамі́ни та реце́пт',
    titleEn: 'Ukrainian Pharmacy Counter with Pharmacist and Medicines',
    settingEn: 'Modern green-cross Ukrainian pharmacy interior with pharmacist, prescription slip, pill blister packs, cough syrup bottle, eye drops, medical mask, and glasses.',
    anchorsEn: ['Green cross signage АПТЕКА', 'Medicine boxes labeled Вітаміни / Сироп від кашлю'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_45_pharmacy_apotheca.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_46_dental_and_optics_clinic',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Стоматологі́чний кабіне́т та о́птика',
    titleEn: 'Dental Clinic Chair and Eyewear Display',
    settingEn: 'Modern Ukrainian dental and vision clinic showing dentist, dental chair, tooth model, mirror, eyeglasses, contact lens case, and eye chart.',
    anchorsEn: ['Ukrainian Cyrillic Snellen eye chart (Ш Б М Н К)', 'Signage Стоматологія та Оптика'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_46_dental_and_optics_clinic.jpg',
    batchExecutionNumber: 6,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_47_portrait_human_face_features',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Портре́т люди́ни: ри́си обличчя та емо́ції',
    titleEn: 'Close-Up Human Portrait Showing Facial Features',
    settingEn: 'Clear educational studio portrait highlighting face, eyes, eyebrows, eyelashes, nose, mouth, lips, teeth, tongue, chin, cheeks, forehead, ear, hair, braid, and teardrop.',
    anchorsEn: ['Woven Ukrainian hair braid (коса) and embroidered collar detail', 'Clean studio lighting for unambiguous anatomical hotspots'],
    visualFraming: 'human_body_portrait_illustration',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_47_portrait_human_face_features.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_48_portrait_human_body_posture',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Ті́ло люди́ни: поста́ва, ру́ки та но́ги',
    titleEn: 'Full-Body Athletic Portrait Showing Limbs and Joints',
    settingEn: 'Bright sports studio portrait showing head, neck, shoulders, chest, back, arm, elbow, wrist, hand, fingers, leg, knee, ankle, and foot.',
    anchorsEn: ['Ukrainian blue-and-yellow athletic tracksuit', 'Clear anatomical visibility of all major joints'],
    visualFraming: 'human_body_portrait_illustration',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_48_portrait_human_body_posture.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_49_school_classroom_lesson',
    categoryId: 'classroom',
    titleUk: 'Шкільни́й клас: уро́к украї́нської мо́ви',
    titleEn: 'Ukrainian School Classroom During a Language Lesson',
    settingEn: 'Sunny Ukrainian classroom with teacher, students, chalkboard, chalk, school desks, chairs, backpacks, globe, wall map of Ukraine, and projector.',
    anchorsEn: ['Chalkboard inscription Класна робота', 'Physical map of Ukraine (Карта України) on the wall'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/classroom/uk_scene_49_school_classroom_lesson.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_50_school_desk_stationery',
    categoryId: 'classroom',
    titleUk: 'Шкільна́ па́рта: підру́чник, зо́шит та пена́л',
    titleEn: 'Close-Up Student Desk with Textbook, Notebook, and Pencil Case',
    settingEn: 'Overhead close-up of a wooden school desk with Ukrainian textbook, dictionary, lined notebook, pen, pencil, eraser, ruler, sharpener, pencil case, bookmark, and compass.',
    anchorsEn: ['Textbook cover Українська мова', 'Bookmark with Ukrainian ornament'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/classroom/uk_scene_50_school_desk_stationery.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_51_school_science_laboratory',
    categoryId: 'classroom',
    titleUk: 'Кабіне́т природозна́вства: мікроско́п та телеско́п',
    titleEn: 'School Science Room with Microscope, Telescope, and Magnifying Glass',
    settingEn: 'Ukrainian high-school science room with microscope, magnifying glass, telescope by the window, magnet, hourglass, thermometer, diploma, and mineral samples.',
    anchorsEn: ['Poster Природничі науки в Україні', 'Certificate (Диплом) with Ukrainian emblem'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/classroom/uk_scene_51_school_science_laboratory.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_52_library_reading_hall',
    categoryId: 'library',
    titleUk: 'Читальний зал бібліоте́ки у Льво́ві',
    titleEn: 'University Library Reading Hall in Lviv',
    settingEn: 'Quiet library reading room with tall wooden bookshelves, librarian, books, magazine, newspaper, reading lamp, laptop, headphones, and notebook.',
    anchorsEn: ['Signage Читальний зал / Тиша в бібліотеці', 'Ukrainian literary journals and newspapers'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/library/uk_scene_52_library_reading_hall.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_53_office_it_coworking_kyiv',
    categoryId: 'office',
    titleUk: 'Суча́сний о́фіс та ково́ркінг у Ки́єві',
    titleEn: 'Modern Coworking Office and Desk Setup in Kyiv',
    settingEn: 'Bright Kyiv tech office with desk, ergonomic chair, monitor, laptop, keyboard, computer mouse, printer, folders, calendar, whiteboard, and water cooler.',
    anchorsEn: ['Wall clock and Kyiv skyline view through window', 'Whiteboard notes in Ukrainian'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/office/uk_scene_53_office_it_coworking_kyiv.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_54_office_electronics_accessories',
    categoryId: 'office',
    titleUk: 'Електро́ніка та га́джети на робо́чому столі́',
    titleEn: 'Close-Up Desk Electronics: Smartphone, Charger, and Flash Drive',
    settingEn: 'Close-up desktop arrangement with smartphone, tablet, power bank, charger, USB cable, flash drive, battery, extension cord, wall outlet, and router.',
    anchorsEn: ['Smartphone screen displaying Ukrainian interface (Дія / Погода у Києві)', 'Power bank (павербанк) widely used in Ukrainian daily life'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/office/uk_scene_54_office_electronics_accessories.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_55_post_office_ukrposhta',
    categoryId: 'office',
    titleUk: 'Відді́лення по́шти: поси́лка, конве́рт та ма́рка',
    titleEn: 'Ukrainian Post Office Counter with Parcels and Stamps',
    settingEn: 'Modern postal branch counter with mail carrier, cardboard parcel box, paper envelope, postage stamp, postcard, scale, packing tape, and mailbox.',
    anchorsEn: ['Yellow-and-blue postal branding (Пошта)', 'Ukrainian commemorative postage stamp and postcard'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/office/uk_scene_55_post_office_ukrposhta.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_56_bank_and_administrative_center',
    categoryId: 'office',
    titleUk: 'Банк та центр надання адміністрати́вних по́слуг (ЦНАП)',
    titleEn: 'Bank Branch, ATM, and Citizen Service Desk',
    settingEn: 'Modern Ukrainian service hall with ATM (банкомат), teller window, safe, document folder, contract, stamp seal, signature pen, queue ticket, and ID card.',
    anchorsEn: ['ATM screen in Ukrainian (Банкомат — видача готівки)', 'Signage Центр надання послуг'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/office/uk_scene_56_bank_and_administrative_center.jpg',
    batchExecutionNumber: 7,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_57_park_shevchenko_autumn',
    categoryId: 'park-garden',
    titleUk: 'Осі́нній міськи́й парк з кашта́нами та ла́вками',
    titleEn: 'Autumn City Park in Kyiv with Chestnuts and Benches',
    settingEn: 'Golden autumn park alley in Kyiv with wooden bench, wrought-iron streetlamp, fountain, oak and birch trees, fallen leaves, squirrel, and dog on a leash.',
    anchorsEn: ['Spiky chestnut burrs and glossy brown chestnuts on the path', 'Park sign Парк імені Тараса Шевченка'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/park-garden/uk_scene_57_park_shevchenko_autumn.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_58_botanical_garden_flowers',
    categoryId: 'park-garden',
    titleUk: 'Ботані́чний сад: со́няшники, троя́нди та кали́на',
    titleEn: 'Ukrainian Botanical Garden with Sunflowers, Roses, and Viburnum',
    settingEn: 'Lush garden path showcasing blooming sunflowers, red poppies, roses, tulips, dandelions, viburnum bush (калина), honeybee, butterfly, and greenhouse.',
    anchorsEn: ['Ukrainian sunflower and red poppy floral bed', 'Ripe red viburnum (калина) clusters'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/park-garden/uk_scene_58_botanical_garden_flowers.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_59_backyard_garden_tools',
    categoryId: 'park-garden',
    titleUk: 'Садо́ва діля́нка: лопа́та, граблі́ та та́чка',
    titleEn: 'Orchard and Garden Shed with Wheelbarrow and Tools',
    settingEn: 'Sunny Ukrainian cottage garden (дача / садок) with apple tree, wheelbarrow, shovel, rake, pruning shears, garden hose, watering can, fence, and birdhouse.',
    anchorsEn: ['Whitewashed orchard tree trunks typical of Ukrainian gardens', 'Wooden birdhouse (шпаківня)'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/park-garden/uk_scene_59_backyard_garden_tools.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_60_playground_family_courtyard',
    categoryId: 'playground',
    titleUk: 'Дитя́чий майда́нчик у дворі́ житло́вого буди́нку',
    titleEn: 'Neighborhood Courtyard Playground with Swing and Slide',
    settingEn: 'Modern Ukrainian apartment courtyard playground with slide, swing, sandbox, seesaw, trampoline, baby stroller, kick scooter, bicycle, and parents with children.',
    anchorsEn: ['Colorful Ukrainian residential courtyard mural', 'Signage Дитячий майданчик'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/playground/uk_scene_60_playground_family_courtyard.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_61_gym_fitness_studio',
    categoryId: 'gym-fitness',
    titleUk: 'Спортивний зал: ганте́лі, бігова́ дорі́жка та килимо́к',
    titleEn: 'Modern Fitness Gym with Dumbbells, Treadmill, and Yoga Mat',
    settingEn: 'Well-lit Ukrainian fitness club with treadmill, stationary bike, barbell, dumbbells, kettlebell, yoga mat, pull-up bar, climbing rope, water bottle, and locker.',
    anchorsEn: ['Wall motivational banner in Ukrainian (Спорт та здоров’я)', 'Blue-and-yellow gym mat accents'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/gym-fitness/uk_scene_61_gym_fitness_studio.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_62_sports_stadium_court',
    categoryId: 'gym-fitness',
    titleUk: 'Стадіо́н та спорти́вний майда́нчик',
    titleEn: 'Outdoor Sports Field with Soccer Ball, Basketball Hoop, and Bow',
    settingEn: 'Community sports complex in Ukraine with soccer goal, soccer ball, basketball hoop, tennis racket, badminton shuttlecock, archery bow and target, whistle, and trophy.',
    anchorsEn: ['Scoreboard in Ukrainian (Рахунок)', 'Track lanes around green football pitch'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/gym-fitness/uk_scene_62_sports_stadium_court.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_63_swimming_pool_and_winter_rink',
    categoryId: 'gym-fitness',
    titleUk: 'Басе́йн та зимо́вий спорт: ли́жі, ковзани́ та трамплі́н',
    titleEn: 'Sports Complex Pool Diving Board and Winter Gear Rack',
    settingEn: 'Dual-zone Ukrainian sports center showing indoor swimming pool with diving board, swim goggles, and winter sports corner with skis, ice skates, hockey stick, and helmet.',
    anchorsEn: ['Bukovel / Ukrainian winter sports poster', 'Lane markers and pool signage Басейн'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/gym-fitness/uk_scene_63_swimming_pool_and_winter_rink.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_64_countryside_ukrainian_village_yard',
    categoryId: 'countryside',
    titleUk: 'Украї́нське село́: ха́та, крини́ця та леле́че гніздо́',
    titleEn: 'Ukrainian Village Homestead with Well and Stork Nest',
    settingEn: 'Scenic Ukrainian village yard with whitewashed cottage, wooden fence, covered water well (криниця), stork in a stork nest (лелече гніздо) on a pole, sunflower patch, and clay jugs on fence posts.',
    anchorsEn: ['White stork (лелека) nesting on a utility pole', 'Clay pots (глечики) drying on a wattle fence (тин)'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/countryside/uk_scene_64_countryside_ukrainian_village_yard.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_65_countryside_farmyard_animals',
    categoryId: 'countryside',
    titleUk: 'Сільське́ подві́р’я: кінь, коро́ва, коза́ та інди́к',
    titleEn: 'Ukrainian Farmyard with Horse, Cow, Goat, Pig, and Poultry',
    settingEn: 'Sunny rural Ukrainian farmstead showing barn, tractor, haystack, scythe, horse, cow, goat, sheep, pig, rooster, hen, duck, goose, and live turkey (індик).',
    anchorsEn: ['Carpathian wooden hayrick (оборіг)', 'Traditional wooden barn and pasture'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/countryside/uk_scene_65_countryside_farmyard_animals.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_66_countryside_wheat_and_sunflower_fields',
    categoryId: 'countryside',
    titleUk: 'Украї́нський степ: пшени́чне по́ле, со́няшники та вітря́к',
    titleEn: 'Ukrainian Steppe Landscape with Wheat Field, Sunflowers, and Windmill',
    settingEn: 'Wide golden wheat field and blooming sunflower field under a blue sky in central Ukraine with country road, wooden windmill, beehive apiary, and combine harvester.',
    anchorsEn: ['Natural blue sky over golden wheat horizon echoing the Ukrainian landscape', 'Traditional wooden beehive frames (пасіка)'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/countryside/uk_scene_66_countryside_wheat_and_sunflower_fields.jpg',
    batchExecutionNumber: 8,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_67_carpathian_forest_wildlife',
    categoryId: 'countryside',
    titleUk: 'Карпа́тський ліс: ве́дмідь, о́лень, їжа́к та гриби́',
    titleEn: 'Carpathian Forest Trail with Deer, Hedgehog, Hare, and Mushrooms',
    settingEn: 'Sunlit Carpathian woodland clearing showing pine and oak trees, forest stream, wooden footbridge, deer, fox, hare (заєць), hedgehog, owl, woodpecker, porcini mushroom, and fern.',
    anchorsEn: ['Carpathian biosphere trail marker', 'Edible white porcini mushroom (білий гриб) and forest berries'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/countryside/uk_scene_67_carpathian_forest_wildlife.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_68_carpathian_camping_bonfire',
    categoryId: 'camping-nature',
    titleUk: 'Ке́мпінг у Карпа́тах: на́мет, бага́ття та рюкзáк',
    titleEn: 'Carpathian Mountain Campsite with Tent and Campfire',
    settingEn: 'Evening campsite in the Ukrainian Carpathians with tent, crackling campfire (багаття), sleeping bag, thermos, compass, binoculars, folding knife, lantern, and starry sky with moon.',
    anchorsEn: ['Hoverla / Chornohora ridge silhouette at dusk', 'Enamel mug of Carpathian berry tea by the fire'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/camping-nature/uk_scene_68_carpathian_camping_bonfire.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_69_river_dnipro_boating_fishing',
    categoryId: 'beach-nature',
    titleUk: 'Бе́рег Дніпра́: чо́вен, ву́дка та міст',
    titleEn: 'Dnipro Riverbank with Rowboat, Fishing Rod, and Bridge',
    settingEn: 'Calm riverbank along the Dnipro with wooden rowboat, oar, anchor, lifebuoy, fisherman with fishing rod, bucket, swan, frog on a water lily, and arched river bridge.',
    anchorsEn: ['Wide Dnipro hills and willow trees along the water', 'Wooden pier with Ukrainian river marker'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/beach-nature/uk_scene_69_river_dnipro_boating_fishing.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_70_nature_insects_and_garden_macro',
    categoryId: 'park-garden',
    titleUk: 'Світ приро́ди зблизька́: бджола́, сонечко, мура́ха та павути́ння',
    titleEn: 'Macro Nature Scene with Honeybee, Ladybug, Ant, and Dewy Web',
    settingEn: 'Detailed outdoor garden close-up showing honeybee on clover, ladybug, ant (мураха), housefly (муха), dragonfly, snail, caterpillar, spiderweb with dewdrop, acorn, and pinecone.',
    anchorsEn: ['Blooming Ukrainian linden and clover blossoms', 'Wooden apiary frame edge'],
    visualFraming: 'close_up_detail',
    generatedAssetPath: '/assets/identify/park-garden/uk_scene_70_nature_insects_and_garden_macro.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_71_pet_shop_and_vet_clinic',
    categoryId: 'hospital-pharmacy',
    titleUk: 'Зоомагази́н та ветерина́рна клі́ніка',
    titleEn: 'Ukrainian Pet Shop and Veterinary Corner',
    settingEn: 'Bright pet care store in Kyiv with cat, puppy, dog collar and leash, pet carrier, food bowl, aquarium with goldfish, parrot in cage, hamster, and turtle.',
    anchorsEn: ['Signage Зоомагазин та Ветеринарна аптека', 'Pet food bags labeled Корм для котів і собак'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/hospital-pharmacy/uk_scene_71_pet_shop_and_vet_clinic.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_72_zoo_exotic_animals_kyiv',
    categoryId: 'park-garden',
    titleUk: 'Екскурсія в зоопа́рку: слон, жира́фа, лев та пінгві́н',
    titleEn: 'Ukrainian City Zoo Enclosure Walk with Exotic Animals',
    settingEn: 'Educational zoo panorama in Kyiv showing elephant, giraffe, lion, tiger, zebra, monkey, kangaroo, camel, crocodile, penguin, dolphin pool, and shark aquarium window.',
    anchorsEn: ['Bilingual Ukrainian educational plaques (Київський зоопарк)', 'Landscaped naturalistic habitats'],
    visualFraming: 'outdoor_nature_scene',
    generatedAssetPath: '/assets/identify/park-garden/uk_scene_72_zoo_exotic_animals_kyiv.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_73_art_studio_and_museum',
    categoryId: 'art-studio',
    titleUk: 'Худо́жня майсте́рня та ви́ставка живо́пису',
    titleEn: 'Ukrainian Painter’s Studio with Easel, Palette, and Sculpture',
    settingEn: 'Sunlit art studio in Odesa with painter, wooden easel, canvas, paint palette, paintbrush, paint tubes, framed landscape painting, marble bust sculpture, and ceramic pottery wheel.',
    anchorsEn: ['Canvas depicting Carpathian mountains and Ukrainian village', 'Kosiv painted ceramics on studio shelf'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/art-studio/uk_scene_73_art_studio_and_museum.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_74_theater_and_concert_hall',
    categoryId: 'art-studio',
    titleUk: 'О́перний теа́тр та конце́ртна сце́на',
    titleEn: 'Ukrainian Opera & Theater Stage with Grand Piano and Violin',
    settingEn: 'Elegant Ukrainian theater stage inspired by Lviv or Odesa Opera with velvet stage curtains, spotlight, microphone, grand piano, violin, cello, accordion, drum, trumpet, and audience seats.',
    anchorsEn: ['Ornate Ukrainian theater balcony gilding', 'Concert program poster in Ukrainian (Концерт класичної музики)'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/art-studio/uk_scene_74_theater_and_concert_hall.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_75_photo_and_media_studio',
    categoryId: 'office',
    titleUk: 'Фотосту́дія та медіаце́нтр',
    titleEn: 'Photography and Podcast Studio with Camera and Tripod',
    settingEn: 'Contemporary Kyiv media studio with photographer, digital camera, lens, tripod, studio umbrella light, microphone on boom arm, headphones, video monitor, and clapperboard.',
    anchorsEn: ['Studio signage Фотостудія Київ', 'Framed Ukrainian documentary photographs on brick wall'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/office/uk_scene_75_photo_and_media_studio.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_76_hair_salon_barbershop',
    categoryId: 'bathroom',
    titleUk: 'Перука́рня та салон краси́',
    titleEn: 'Ukrainian Hair Salon and Barbershop Station',
    settingEn: 'Modern hair salon in Dnipro with hairdresser, salon chair, large mirror, hairdryer, curling iron, electric trimmer, hair scissors, comb, spray bottle, cape, and nail polish rack.',
    anchorsEn: ['Signage Перукарня / Салон краси', 'Price list in hryvnias (Стрижка, Укладка)'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/bathroom/uk_scene_76_hair_salon_barbershop.jpg',
    batchExecutionNumber: 9,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_77_hotel_reception_and_room',
    categoryId: 'hotel',
    titleUk: 'Готе́ль у Карпа́тах: рецепція та но́мер',
    titleEn: 'Boutique Carpathian Hotel Lobby and Guest Room',
    settingEn: 'Warm Ukrainian boutique hotel showing reception desk, bell, keycard, elevator doors, luggage cart, guest room bed, safe, minibar, bathrobe, and mountain view.',
    anchorsEn: ['Signage Готель «Карпати» — Рецепція', 'Carpathian wood carving behind front desk'],
    visualFraming: 'public_service_environment',
    generatedAssetPath: '/assets/identify/hotel/uk_scene_77_hotel_reception_and_room.jpg',
    batchExecutionNumber: 10,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_78_emergency_and_civic_services',
    categoryId: 'city-streets',
    titleUk: 'Рятува́льні та міські́ слу́жби України',
    titleEn: 'Ukrainian Emergency Vehicles: Fire Truck, Ambulance, and Police',
    settingEn: 'Civic safety plaza in Ukraine showing red fire truck, firefighter in helmet with fire hose and fire extinguisher, white ambulance, paramedic, police officer, and traffic cone.',
    anchorsEn: ['Ukrainian ДСНС fire truck markings (101) and Швидка допомога (103)', 'Blue-and-yellow National Police vehicle markings (Поліція 102)'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_78_emergency_and_civic_services.jpg',
    batchExecutionNumber: 10,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_79_architecture_church_and_castle',
    categoryId: 'city-streets',
    titleUk: 'Архітекту́ра України: собо́р, дзвіни́ця та форте́ця',
    titleEn: 'Ukrainian Architectural Heritage: Golden-Domed Cathedral and Fortress',
    settingEn: 'Panoramic Ukrainian cultural heritage view combining a golden-domed cathedral with bell tower, stone arch, wrought-iron gates, monument statue, and medieval Kamianets-Podilskyi fortress towers.',
    anchorsEn: ['Ukrainian Baroque golden domes and cross', 'Kamianets-Podilskyi stone tower roof silhouette'],
    visualFraming: 'street_urban_scene',
    generatedAssetPath: '/assets/identify/city-streets/uk_scene_79_architecture_church_and_castle.jpg',
    batchExecutionNumber: 10,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
  },
  {
    sceneCode: 'uk_scene_80_family_celebration_gift_exchange',
    categoryId: 'living-room',
    titleUk: 'Родинне свя́то вдо́ма: подару́нки, торт та свічки́',
    titleEn: 'Ukrainian Family Celebration with Birthday Cake, Gifts, and Balloons',
    settingEn: 'Joyful three-generation Ukrainian family gathering in a living room with grandmother, grandfather, mother, father, son, daughter, birthday cake with candles, wrapped gift box with ribbon, balloons, and greeting card.',
    anchorsEn: ['Greeting card inscribed З Днем народження!', 'Family dressed in contemporary smart casual and modern vyshyvankas'],
    visualFraming: 'full_room_scene',
    generatedAssetPath: '/assets/identify/living-room/uk_scene_80_family_celebration_gift_exchange.jpg',
    batchExecutionNumber: 10,
    imageDimensions: { width: 1376, height: 768, aspectRatio: '16:9' },
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

const BATCH_9_VERIFIED_COMPATIBLE_CONCEPT_CATEGORIES: Record<string, readonly string[]> = {
  'cl-backpack': ['camping-nature'],
  'id-v2-960': ['hospital-pharmacy'],
  'id-v2-930': ['beach-nature'],
  'id-v2-1489': ['beach-nature'],
  'id-v2-554': ['beach-nature'],
  'id-v2-990': ['beach-nature'],
  'id-v2-594': ['art-studio'],
  'ext-v2-0004': ['art-studio'],
  'id-v2-1310': ['art-studio'],
  'id-v2-518': ['art-studio'],
  'id-v2-582': ['art-studio'],
  'id-v2-529': ['office'],
  'id-v2-1247': ['office'],
  'id-v2-555': ['office'],
  'fm-tomato': ['office'],
  'fm-cucumber': ['office'],
  'id-v2-1790': ['bathroom'],
  'id-v2-1230': ['bathroom'],
  'id-v2-1233': ['bathroom'],
  'id-v2-1286': ['bathroom'],
  'id-v2-466': ['bathroom'],
};

function isConceptBaselineCompatibleWithSceneCategory(
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

export function isConceptSemanticallyCompatibleWithSceneCategory(
  concept: IdentifyFinal1200CurriculumConcept,
  sceneCategoryId: string
): boolean {
  if (isConceptBaselineCompatibleWithSceneCategory(concept, sceneCategoryId)) {
    return true;
  }
  const batch9Cats = BATCH_9_VERIFIED_COMPATIBLE_CONCEPT_CATEGORIES[concept.vocabularyId];
  return Boolean(batch9Cats && batch9Cats.includes(sceneCategoryId));
}

function scoreConceptForSceneBlueprint(
  concept: IdentifyFinal1200CurriculumConcept,
  bp: RawUkrainianSceneBlueprint
): number {
  const normCats = normalizeConceptSceneCategories(concept.candidateSceneCategories);
  const compatible = isConceptBaselineCompatibleWithSceneCategory(
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

  // Sub-pass 2C: Batch 1 semantic dining-room primary alignment
  // Replaces false single-word substring matches ('glass' -> magnifying glass / stained-glass window;
  // 'flower' -> flower kiosk) with core dining-room tableware (тарі́лка, виде́лка, ло́жка)
  const swapPrimaryConceptsBetweenScenes = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 0; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  // Scene 11 (index 10): swap id-v2-786 (magnifying glass) <-> k-plate (plate), and id-v2-1819 (stained-glass window) <-> k-fork (fork)
  swapPrimaryConceptsBetweenScenes(10, 'id-v2-786', 'k-plate');
  swapPrimaryConceptsBetweenScenes(10, 'id-v2-1819', 'k-fork');
  // Scene 12 (index 11): swap id-v2-1338 (flower kiosk) <-> k-spoon (spoon)
  swapPrimaryConceptsBetweenScenes(11, 'id-v2-1338', 'k-spoon');

  // Batch 2 semantic living-room & music-corner alignment (Scenes 13 and 14)
  // Scene 13 (index 12): replace escalator & patio with coffee table (id-v2-222) and floor lamp (id-v2-248)
  swapPrimaryConceptsBetweenScenes(12, 'id-v2-628', 'id-v2-222');
  swapPrimaryConceptsBetweenScenes(12, 'id-v2-329', 'id-v2-248');
  // Scene 14 (index 13): replace fallback outdoor/automotive/pharmacy concepts with music-corner & living-room concepts
  const scene14PrimarySwaps: readonly [string, string][] = [
    ['id-v2-1218', 'id-v2-1126'], // sopilka wooden flute
    ['id-v2-331', 'id-v2-1119'],  // acoustic guitar
    ['id-v2-392', 'id-v2-1122'],  // violin
    ['id-v2-395', 'id-v2-1125'],  // flute
    ['id-v2-601', 'id-v2-1129'],  // accordion
    ['id-v2-620', 'id-v2-1706'],  // vinyl LP record
    ['id-v2-630', 'id-v2-1093'],  // speaker
    ['id-v2-660', 'id-v2-1092'],  // headphones
    ['id-v2-662', 'id-v2-1103'],  // remote control
    ['id-v2-664', 'id-v2-260'],   // painting
    ['id-v2-723', 'id-v2-262'],   // wall clock
    ['id-v2-724', 'id-v2-220'],   // ottoman / pouf
    ['id-v2-726', 'id-v2-268'],   // candle
    ['id-v2-797', 'id-v2-269'],   // candlestick
  ];
  for (const [fromId, toId] of scene14PrimarySwaps) {
    swapPrimaryConceptsBetweenScenes(13, fromId, toId);
  }

  // Batch 3 Semantic Visual Audit: Ensure Scene 15 (index 14) and Scene 16 (index 15) have 100% bedroom/vanity objects
  const scene15PrimarySwaps: Array<[string, string]> = [
    ['id-v2-405', 'id-v2-213'],   // bedsheet (простирадло)
    ['id-v2-867', 'id-v2-250'],   // desk lamp (настільна лампа)
    ['id-v2-1505', 'id-v2-229'],  // clothes hanger (плічка)
  ];
  for (const [fromId, toId] of scene15PrimarySwaps) {
    swapPrimaryConceptsBetweenScenes(14, fromId, toId);
  }

  const scene16PrimarySwaps: Array<[string, string]> = [
    ['id-v2-633', 'id-v2-867'],   // necklace / coral beads (намисто)
    ['id-v2-634', 'id-v2-1898'],  // compact powder case (пудрениця з дзеркальцем)
    ['id-v2-1001', 'id-v2-1899'], // makeup blush brush (пензлик для макіяжу)
    ['id-v2-1013', 'id-v2-1532'], // pendant / locket (кулон / медальйон)
    ['id-v2-636', 'id-v2-1515'],  // headband (обруч для волосся)
  ];
  for (const [fromId, toId] of scene16PrimarySwaps) {
    swapPrimaryConceptsBetweenScenes(15, fromId, toId);
  }

  // Batch 4 (Scenes 17–26) semantic adjustments to ensure all 15 primary targets per scene
  // are authentic, concrete, visually unambiguous objects for their setting
  const batch4PrimarySwaps: Array<[number, string, string]> = [
    // Scene 17 (idx 16, bedroom - child nursery)
    [16, 'id-v2-1013', 'id-v2-405'],
    [16, 'id-v2-521', 'id-v2-406'],
    [16, 'id-v2-430', 'pg-ball'],
    [16, 'id-v2-236', 'id-v2-741'],
    [16, 'id-v2-571', 'cl-book'],
    [16, 'id-v2-726', 'cl-pencil'],
    [16, 'id-v2-883', 'cl-notebook'],
    [16, 'id-v2-517', 'id-v2-751'],
    [16, 'id-v2-337', 'id-v2-397'],
    [16, 'id-v2-546', 'id-v2-1141'],
    [16, 'id-v2-152', 'id-v2-410'],
    // Scene 18 (idx 17, bathroom - modern apartment bathroom & laundry)
    [17, 'gm-machine', 'id-v2-234'],
    [17, 'id-v2-1023', 'id-v2-295'],
    [17, 'id-v2-1146', 'id-v2-296'],
    [17, 'id-v2-715', 'id-v2-242'],
    // Scene 19 (idx 18, bathroom - sink shelf & personal hygiene)
    [18, 'id-v2-634', 'id-v2-306'],
    [18, 'id-v2-1001', 'id-v2-302'],
    // Scene 20 (idx 19, hallway-entry - apartment entry hallway)
    [19, 'id-v2-1500', 'id-v2-1171'],
    [19, 'id-v2-600', 'id-v2-259'],
    [19, 'id-v2-209', 'id-v2-340'],
    // Scene 21 (idx 20, balcony-garden - sunny Kyiv apartment balcony)
    [20, 'id-v2-232', 'id-v2-389'],
    [20, 'id-v2-1500', 'id-v2-388'],
    [20, 'id-v2-1207', 'id-v2-391'],
    [20, 'id-v2-579', 'ext-v2-0003'],
    [20, 'id-v2-1160', 'id-v2-395'],
    [20, 'id-v2-1923', 'id-v2-1753'],
    [20, 'id-v2-1948', 'id-v2-1162'],
    [20, 'id-v2-1322', 'id-v2-256'],
    // Scene 22 (idx 21, home-workshop - workbench and hand tools)
    [21, 'id-v2-1452', 'id-v2-357'],
    [21, 'pk-bench', 'id-v2-350'],
    [21, 'id-v2-333', 'id-v2-1455'],
    [21, 'id-v2-411', 'ext-v2-0001'],
    // Scene 23 (idx 22, supermarket - fresh produce section)
    [22, 'id-v2-1161', 'id-v2-414'],
    [22, 'id-v2-1298', 'id-v2-419'],
    [22, 'id-v2-1310', 'id-v2-422'],
    [22, 'sm-milk', 'id-v2-447'],
    [22, 'sm-cheese', 'id-v2-448'],
    // Scene 24 (idx 23, supermarket - dairy, cheese, and bakery aisle)
    [23, 'id-v2-578', 'sm-milk'],
    [23, 'id-v2-573', 'sm-cheese'],
    [23, 'id-v2-194', 'id-v2-486'],
    [23, 'sm-checkout', 'id-v2-492'],
    [23, 'sm-bag', 'id-v2-1297'],
    [23, 'id-v2-647', 'id-v2-498'],
    [23, 'id-v2-648', 'id-v2-500'],
    [23, 'id-v2-805', 'id-v2-497'],
    [23, 'id-v2-1272', 'id-v2-502'],
    [23, 'id-v2-554', 'id-v2-1298'],
    [23, 'id-v2-646', 'id-v2-1363'],
    // Scene 25 (idx 24, supermarket - checkout counter)
    [24, 'noun-bank-financial', 'sm-checkout'],
    [24, 'id-v2-408', 'sm-bag'],
    [24, 'id-v2-854', 'id-v2-647'],
    [24, 'id-v2-606', 'id-v2-648'],
    [24, 'id-v2-607', 'id-v2-646'],
    [24, 'id-v2-653', 'id-v2-805'],
    // Scene 26 (idx 25, farmers-market - honey, nuts, and berries)
    [25, 'id-v2-284', 'id-v2-472'],
    [25, 'id-v2-319', 'id-v2-474'],
    [25, 'id-v2-676', 'id-v2-423'],
    [25, 'id-v2-1993', 'id-v2-424'],
    [25, 'ext-v2-0006', 'id-v2-426'],
    [25, 'id-v2-163', 'id-v2-1921'],
  ];
  for (const [sceneIdx, fromId, toId] of batch4PrimarySwaps) {
    swapPrimaryConceptsBetweenScenes(sceneIdx, fromId, toId);
  }

  // Batch 4 Semantic Audit Repair: Re-allocate the 810 primary concepts across ungenerated
  // future Scenes 27–80 (indices 26–79) using semantic blueprint scoring so that concepts
  // swapped out of Scenes 11–26 land in their authentic future scenes rather than arbitrary swap slots.
  const lockedPrimaryVocabIds = new Set<string>();
  for (let idx = 0; idx < 26; idx++) {
    for (const c of scenePrimaryConcepts[idx]) {
      lockedPrimaryVocabIds.add(c.vocabularyId);
    }
  }
  for (let idx = 26; idx < 80; idx++) {
    scenePrimaryConcepts[idx] = [];
  }

  const futureSceneOrder = sceneOrder.filter((idx) => idx >= 26);

  // Future Sub-pass A: Direct/keyword/related semantic matches (score >= 20)
  for (const sceneIdx of futureSceneOrder) {
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[sceneIdx];
    const existingInScene = new Set([
      ...scenePrimaryConcepts[sceneIdx].map((c) => c.vocabularyId),
      ...sceneReviewConcepts[sceneIdx].map((c) => c.vocabularyId),
    ]);

    const candidates = concepts
      .filter(
        (c) =>
          !lockedPrimaryVocabIds.has(c.vocabularyId) &&
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
      lockedPrimaryVocabIds.add(entry.concept.vocabularyId);
      existingInScene.add(entry.concept.vocabularyId);
    }
  }

  // Future Sub-pass B: Fill remaining slots in Scenes 27–80 with compatible highest-scoring concepts
  for (const sceneIdx of futureSceneOrder) {
    if (scenePrimaryConcepts[sceneIdx].length >= 15) continue;
    const bp = UKRAINIAN_80_SCENE_BLUEPRINTS[sceneIdx];
    const existingInScene = new Set([
      ...scenePrimaryConcepts[sceneIdx].map((c) => c.vocabularyId),
      ...sceneReviewConcepts[sceneIdx].map((c) => c.vocabularyId),
    ]);

    const remaining = concepts
      .filter(
        (c) =>
          !lockedPrimaryVocabIds.has(c.vocabularyId) &&
          !existingInScene.has(c.vocabularyId)
      )
      .map((c) => ({
        concept: c,
        score: scoreConceptForSceneBlueprint(c, bp),
        compatible: isConceptBaselineCompatibleWithSceneCategory(c, bp.categoryId),
      }))
      .sort((a, b) => {
        if (a.compatible !== b.compatible) return a.compatible ? -1 : 1;
        if (b.score !== a.score) return b.score - a.score;
        return a.concept.finalRank - b.concept.finalRank;
      });

    for (const entry of remaining) {
      if (scenePrimaryConcepts[sceneIdx].length >= 15) break;
      scenePrimaryConcepts[sceneIdx].push(entry.concept);
      lockedPrimaryVocabIds.add(entry.concept.vocabularyId);
      existingInScene.add(entry.concept.vocabularyId);
    }
  }

  // Future Sub-pass C: Place displaced domain concepts into their exact semantic future scenes (indices >= 26)
  const futureDomainSwaps: Array<[number, string]> = [
    [27, 'id-v2-517'],           // боро́шно (flour) -> Scene 28 Craft Bakery
    [29, 'id-v2-571'],           // деруни́ (potato pancakes) -> Scene 30 Ukrainian Bistro
    [29, 'ext-v2-0006'],         // м’я́со (meat) -> Scene 30 Ukrainian Bistro
    [33, 'noun-bank-financial'], // банк (bank building) -> Scene 34 Central Kyiv Street
    [33, 'id-v2-653'],           // поже́жна маши́на (fire truck) -> Scene 34 Central Kyiv Street
    [34, 'id-v2-607'],           // фонта́н (fountain) -> Scene 35 Historic City Square with Fountain
    [41, 'id-v2-726'],           // бензоколо́нка (fuel pump) -> Scene 42 Car Service & Gas Station
    [60, 'gm-machine'],          // тренаже́р (exercise machine) -> Scene 61 Modern Fitness Gym
  ];
  for (const [targetSceneIdx, vocabIdToPlace] of futureDomainSwaps) {
    if (scenePrimaryConcepts[targetSceneIdx].some((c) => c.vocabularyId === vocabIdToPlace)) {
      continue;
    }
    const targetBp = UKRAINIAN_80_SCENE_BLUEPRINTS[targetSceneIdx];
    let sourceSceneIdx = -1;
    let sourcePos = -1;
    for (let i = 26; i < 80; i++) {
      const p = scenePrimaryConcepts[i].findIndex((c) => c.vocabularyId === vocabIdToPlace);
      if (p !== -1) {
        sourceSceneIdx = i;
        sourcePos = p;
        break;
      }
    }
    if (sourceSceneIdx === -1) continue;
    const sourceBp = UKRAINIAN_80_SCENE_BLUEPRINTS[sourceSceneIdx];
    // Find a concept in targetSceneIdx (pref lowest score for targetBp that is compatible with sourceBp)
    let bestTargetPos = -1;
    let bestScore = Infinity;
    for (let p = 0; p < scenePrimaryConcepts[targetSceneIdx].length; p++) {
      const cand = scenePrimaryConcepts[targetSceneIdx][p];
      if (futureDomainSwaps.some(([, vId]) => vId === cand.vocabularyId)) continue;
      if (!isConceptBaselineCompatibleWithSceneCategory(cand, sourceBp.categoryId)) continue;
      const sc = scoreConceptForSceneBlueprint(cand, targetBp);
      if (sc < bestScore) {
        bestScore = sc;
        bestTargetPos = p;
      }
    }
    if (bestTargetPos !== -1) {
      const temp = scenePrimaryConcepts[targetSceneIdx][bestTargetPos];
      scenePrimaryConcepts[targetSceneIdx][bestTargetPos] =
        scenePrimaryConcepts[sourceSceneIdx][sourcePos];
      scenePrimaryConcepts[sourceSceneIdx][sourcePos] = temp;
    }
  }

  // Batch 5 (Scenes 27–36, indices 26–35) semantic scene preparation:
  // Swap only within ungenerated scenes (indices >= 26) so Scenes 1–26 remain 100% locked
  // and all 8 Batch 4 relocated primaries remain in their validated scenes.
  const swapFuturePrimaryConcepts = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 26; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  const batch5PrimarySwaps: Array<[number, string, string]> = [
    // Scene 27 (idx 26, farmers-market: vegetables & herbs)
    [26, 'id-v2-503', 'fm-carrot'],
    [26, 'id-v2-1324', 'id-v2-453'],
    [26, 'id-v2-570', 'id-v2-464'],
    [26, 'id-v2-183', 'id-v2-446'],
    // Scene 28 (idx 27, bakery: craft pastry)
    [27, 'id-v2-582', 'id-v2-504'],
    [27, 'dr-glass', 'id-v2-505'],
    [27, 'id-v2-1322', 'id-v2-507'],
    [27, 'ext-v2-0002', 'id-v2-508'],
    [27, 'ext-v2-0004', 'id-v2-509'],
    [27, 'id-v2-1293', 'id-v2-1304'],
    [27, 'id-v2-1499', 'id-v2-173'],
    // Scene 29 (idx 28, cafe: Lviv coffeehouse)
    [28, 'id-v2-637', 'id-v2-573'],
    [28, 'id-v2-172', 'id-v2-587'],
    [28, 'id-v2-1335', 'id-v2-588'],
    [28, 'id-v2-703', 'id-v2-596'],
    [28, 'at-board', 'id-v2-1306'],
    [28, 'id-v2-231', 'id-v2-512'],
    [28, 'id-v2-1146', 'id-v2-1194'],
    // Scene 30 (idx 29, restaurant: Ukrainian bistro)
    [29, 'id-v2-1200', 'id-v2-570'],
    [29, 'id-v2-1597', 'id-v2-1322'],
    [29, 'id-v2-288', 'id-v2-1320'],
    [29, 'id-v2-1500', 'id-v2-503'],
    // Scene 31 (idx 30, clothing-store: boutique)
    [30, 'id-v2-715', 'id-v2-829'],
    // Scene 32 (idx 31, clothing-store: winter outerwear)
    [31, 'id-v2-1053', 'id-v2-824'],
    [31, 'id-v2-1354', 'id-v2-834'],
    [31, 'id-v2-1636', 'id-v2-1524'],
    [31, 'id-v2-1643', 'id-v2-1892'],
    // Scene 33 (idx 32, clothing-store: tailor atelier)
    [32, 'id-v2-179', 'id-v2-1146'],
    [32, 'id-v2-1195', 'id-v2-1150'],
    [32, 'id-v2-1452', 'id-v2-1486'],
    [32, 'id-v2-865', 'id-v2-861'],
    [32, 'id-v2-866', 'id-v2-1152'],
    [32, 'id-v2-868', 'id-v2-1156'],
    // Scene 34 (idx 33, city-streets: central Kyiv street)
    [33, 'id-v2-1836', 'cs-light'],
    [33, 'id-v2-1837', 'cs-sign'],
    [33, 'id-v2-1351', 'id-v2-615'],
    // Scene 35 (idx 34, city-streets: Lviv Rynok square)
    [34, 'id-v2-661', 'id-v2-602'],
    [34, 'id-v2-674', 'id-v2-605'],
    [34, 'id-v2-655', 'id-v2-606'],
    [34, 'id-v2-719', 'id-v2-604'],
    [34, 'id-v2-1429', 'pk-bench'],
    [34, 'id-v2-1427', 'id-v2-812'],
    [34, 'id-v2-1346', 'id-v2-1335'],
    [34, 'id-v2-722', 'id-v2-1334'],
    [34, 'id-v2-721', 'id-v2-1333'],
    [34, 'id-v2-1344', 'pk-bird'],
    [34, 'id-v2-1430', 'cs-building'],
    // Scene 36 (idx 35, city-streets: rainy sidewalk)
    [35, 'ext-v2-0023', 'ext-v2-0027'],
    [35, 'id-v2-678', 'cs-sidewalk'],
    [35, 'id-v2-1404', 'cs-road'],
    [35, 'id-v2-1407', 'cs-pedestrian'],
    [35, 'id-v2-1413', 'id-v2-612'],
    [35, 'id-v2-1418', 'cs-car'],
    [35, 'id-v2-1393', 'id-v2-624'],
    [35, 'id-v2-716', 'id-v2-1332'],
    [35, 'id-v2-1310', 'id-v2-1218'],
    [35, 'id-v2-686', 'id-v2-245'],
    [35, 'id-v2-1053', 'id-v2-631'],
    [35, 'fm-tomato', 'id-v2-620'],
    [35, 'fm-cucumber', 'id-v2-630'],
    [35, 'fm-potato', 'id-v2-1344'],
    [35, 'id-v2-1500', 'id-v2-1529'],
    // Future-scene category compatibility preservation for Scenes 48, 69, 71, 74
    [47, 'ext-v2-0002', 'id-v2-320'],
    [68, 'fm-potato', 'id-v2-1579'],
    [70, 'id-v2-703', 'id-v2-163'],
    [73, 'id-v2-1427', 'id-v2-1725'],
  ];
  for (const [sceneIdx, fromId, toId] of batch5PrimarySwaps) {
    swapFuturePrimaryConcepts(sceneIdx, fromId, toId);
  }

  // Batch 6 (Scenes 37–46, indices 36–45) semantic scene preparation:
  // Swap strictly within ungenerated scenes (indices >= 36) so Scenes 1–36 remain 100% locked
  // and all relocated primaries (including id-v2-726 in Scene 42 and gm-machine in Scene 61) remain intact.
  const swapBatch6PrimaryConcepts = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 36; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  const batch6PrimarySwaps: Array<[number, string, string]> = [
    // Scene 37 (idx 36, city-streets: winter snow street)
    [36, 'fm-pear', 'ext-v2-0028'],
    [36, 'id-v2-554', 'id-v2-936'],
    [36, 'id-v2-421', 'id-v2-1076'],
    [36, 'id-v2-1324', 'id-v2-381'],
    [36, 'id-v2-1200', 'id-v2-1837'],
    [36, 'id-v2-465', 'id-v2-1073'],
    [36, 'id-v2-466', 'id-v2-1075'],
    [36, 'id-v2-582', 'id-v2-321'],
    [36, 'ext-v2-0004', 'id-v2-324'],
    [36, 'id-v2-522', 'id-v2-601'],
    [36, 'id-v2-288', 'id-v2-331'],
    [36, 'ext-v2-0007', 'id-v2-332'],
    [36, 'ext-v2-0011', 'id-v2-891'],
    [36, 'id-v2-518', 'id-v2-1613'],
    // Scene 38 (idx 37, public-transportation: tram & trolleybus stop)
    [37, 'id-v2-1432', 'pt-doors'],
    [37, 'id-v2-1433', 'cs-bicycle'],
    [37, 'id-v2-687', 'id-v2-1417'],
    [37, 'pt-metro', 'id-v2-811'],
    // Scene 39 (idx 38, public-transportation: Kyiv metro station)
    [38, 'ext-v2-0018', 'pt-metro'],
    [38, 'at-train', 'id-v2-703'],
    [38, 'id-v2-727', 'id-v2-638'],
    [38, 'id-v2-722', 'id-v2-655'],
    [38, 'id-v2-1429', 'id-v2-1350'],
    [38, 'id-v2-692', 'id-v2-790'],
    [38, 'id-v2-1713', 'id-v2-791'],
    [38, 'id-v2-684', 'id-v2-1698'],
    [38, 'id-v2-1490', 'id-v2-1091'],
    [38, 'id-v2-1434', 'id-v2-1107'],
    [38, 'id-v2-676', 'id-v2-637'],
    // Scene 40 (idx 39, airport-train-station: railway station & Ukrzaliznytsia train)
    [39, 'id-v2-1403', 'ext-v2-0018'],
    [39, 'id-v2-774', 'at-train'],
    [39, 'cl-board', 'id-v2-694'],
    [39, 'id-v2-737', 'id-v2-692'],
    [39, 'id-v2-715', 'id-v2-1847'],
    [39, 'ext-v2-0019', 'at-board'],
    [39, 'id-v2-1841', 'at-luggage'],
    [39, 'id-v2-677', 'id-v2-1434'],
    [39, 'id-v2-681', 'id-v2-688'],
    [39, 'id-v2-707', 'id-v2-628'],
    // Scene 41 (idx 40, airport-train-station: airport terminal check-in)
    [40, 'id-v2-727', 'ext-v2-0019'],
    [40, 'id-v2-1393', 'id-v2-674'],
    [40, 'id-v2-319', 'id-v2-684'],
    [40, 'id-v2-1499', 'id-v2-676'],
    [40, 'id-v2-774', 'id-v2-677'],
    [40, 'cl-board', 'id-v2-678'],
    [40, 'id-v2-713', 'id-v2-1840'],
    [40, 'id-v2-1392', 'id-v2-680'],
    [40, 'id-v2-706', 'id-v2-681'],
    [40, 'id-v2-708', 'id-v2-1841'],
    [40, 'id-v2-714', 'id-v2-1842'],
    // Scene 42 (idx 41, city-streets: automotive & car service)
    [41, 'id-v2-579', 'id-v2-722'],
    [41, 'id-v2-1035', 'id-v2-723'],
    [41, 'id-v2-1036', 'id-v2-724'],
    [41, 'id-v2-1027', 'id-v2-719'],
    [41, 'id-v2-1030', 'id-v2-713'],
    [41, 'id-v2-415', 'id-v2-714'],
    [41, 'id-v2-416', 'id-v2-715'],
    [41, 'id-v2-425', 'id-v2-712'],
    [41, 'id-v2-427', 'id-v2-716'],
    [41, 'id-v2-428', 'id-v2-720'],
    [41, 'id-v2-431', 'id-v2-721'],
    [41, 'id-v2-432', 'id-v2-1836'],
    [41, 'id-v2-433', 'id-v2-1427'],
    // Scene 43 (idx 42, hospital-pharmacy: family doctor clinic consultation)
    [42, 'id-v2-1635', 'hp-doctor'],
    [42, 'id-v2-1643', 'ext-v2-0024'],
    [42, 'id-v2-181', 'ext-v2-0023'],
    [42, 'id-v2-244', 'hp-stethoscope'],
    [42, 'id-v2-1354', 'hp-thermometer'],
    [42, 'id-v2-1052', 'id-v2-999'],
    [42, 'id-v2-1036', 'id-v2-319'],
    [42, 'id-v2-1034', 'id-v2-749'],
    [42, 'id-v2-797', 'id-v2-777'],
    [42, 'id-v2-808', 'id-v2-775'],
    [42, 'id-v2-809', 'id-v2-1477'],
    [42, 'id-v2-906', 'id-v2-773'],
    [42, 'id-v2-907', 'id-v2-1867'],
    [42, 'id-v2-987', 'id-v2-274'],
    // Scene 44 (idx 43, hospital-pharmacy: first-aid treatment room)
    [43, 'id-v2-1036', 'hp-nurse'],
    [43, 'id-v2-1674', 'id-v2-320'],
    [43, 'id-v2-1153', 'hp-bandage'],
    [43, 'id-v2-1691', 'id-v2-1013'],
    [43, 'id-v2-1692', 'id-v2-1001'],
    [43, 'id-v2-1728', 'id-v2-1636'],
    [43, 'id-v2-1665', 'id-v2-1643'],
    [43, 'id-v2-1968', 'id-v2-1640'],
    [43, 'id-v2-1154', 'id-v2-1641'],
    [43, 'id-v2-1195', 'id-v2-1005'],
    [43, 'id-v2-1659', 'id-v2-1948'],
    [43, 'id-v2-1668', 'id-v2-1004'],
    [43, 'id-v2-176', 'id-v2-1631'],
    [43, 'id-v2-177', 'id-v2-1642'],
    [43, 'id-v2-174', 'id-v2-659'],
    // Scene 45 (idx 44, hospital-pharmacy: pharmacy apotheca)
    [44, 'id-v2-988', 'hp-pharmacy'],
    [44, 'id-v2-990', 'id-v2-797'],
    [44, 'id-v2-246', 'hp-medicine'],
    [44, 'id-v2-1185', 'id-v2-1015'],
    [44, 'id-v2-1186', 'id-v2-1635'],
    [44, 'id-v2-1323', 'id-v2-1018'],
    [44, 'id-v2-1657', 'id-v2-1019'],
    [44, 'id-v2-1284', 'id-v2-1022'],
    [44, 'id-v2-1790', 'id-v2-1012'],
    [44, 'gm-dumbbell', 'id-v2-1195'],
    [44, 'id-v2-546', 'id-v2-776'],
    [44, 'id-v2-152', 'id-v2-907'],
    [44, 'id-v2-987', 'id-v2-746'],
    [44, 'id-v2-576', 'id-v2-1451'],
    [44, 'id-v2-543', 'cl-pen'],
    // Scene 46 (idx 45, hospital-pharmacy: dental & optics clinic)
    [45, 'id-v2-1597', 'id-v2-798'],
    [45, 'id-v2-511', 'id-v2-1030'],
    [45, 'id-v2-231', 'id-v2-1029'],
    [45, 'id-v2-325', 'id-v2-1026'],
    [45, 'id-v2-595', 'id-v2-1530'],
    [45, 'id-v2-1563', 'id-v2-1896'],
    [45, 'id-v2-1561', 'id-v2-786'],
    [45, 'id-v2-1482', 'id-v2-778'],
    [45, 'id-v2-161', 'id-v2-276'],
    [45, 'id-v2-159', 'id-v2-1756'],
    [45, 'id-v2-160', 'id-v2-1161'],
    [45, 'id-v2-156', 'ext-v2-0016'],
    [45, 'id-v2-158', 'id-v2-1453'],
    [45, 'id-v2-561', 'id-v2-769'],
    // Future-scene category compatibility preservation across Scenes 54..73
    [53, 'ext-v2-0004', 'id-v2-575'],
    [54, 'id-v2-582', 'id-v2-150'],
    [54, 'id-v2-579', 'id-v2-393'],
    [55, 'id-v2-431', 'id-v2-394'],
    [60, 'id-v2-1323', 'id-v2-1674'],
    [62, 'id-v2-465', 'id-v2-663'],
    [66, 'ext-v2-0011', 'ext-v2-0004'],
    [68, 'id-v2-554', 'ext-v2-0011'],
    [71, 'cl-board', 'id-v2-554'],
    [72, 'id-v2-428', 'cl-board'],
    [72, 'id-v2-425', 'id-v2-1351'],
  ];
  for (const [sceneIdx, fromId, toId] of batch6PrimarySwaps) {
    swapBatch6PrimaryConcepts(sceneIdx, fromId, toId);
  }

  // Batch 7 (Scenes 47–56, indices 46–55) semantic scene preparation:
  // Swap strictly within ungenerated scenes (indices >= 46) so Scenes 1–46 remain 100% locked
  // and all relocated primaries (including gm-machine in Scene 61) remain intact.
  const swapBatch7PrimaryConcepts = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 46; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  const batch7PrimarySwaps: Array<[number, string, string]> = [
    // Scene 47 (idx 46, hospital-pharmacy: human facial features portrait)
    [46, 'id-v2-428', 'id-v2-1024'],
    [46, 'id-v2-582', 'id-v2-1023'],
    [46, 'id-v2-434', 'id-v2-1025'],
    [46, 'id-v2-435', 'id-v2-1499'],
    [46, 'id-v2-436', 'ext-v2-0008'],
    [46, 'id-v2-437', 'id-v2-1028'],
    [46, 'id-v2-439', 'ext-v2-0009'],
    [46, 'id-v2-440', 'ext-v2-0010'],
    [46, 'id-v2-454', 'id-v2-1027'],
    [46, 'id-v2-462', 'id-v2-1031'],
    [46, 'id-v2-467', 'id-v2-1497'],
    [46, 'id-v2-468', 'id-v2-1498'],
    [46, 'id-v2-473', 'id-v2-1516'],
    [46, 'id-v2-475', 'id-v2-866'],
    [46, 'id-v2-476', 'id-v2-304'],
    // Scene 48 (idx 47, hospital-pharmacy: human body posture & athletic limbs)
    [47, 'id-v2-579', 'id-v2-1032'],
    [47, 'id-v2-477', 'id-v2-1035'],
    [47, 'id-v2-431', 'ext-v2-0007'],
    [47, 'id-v2-479', 'id-v2-1033'],
    [47, 'id-v2-480', 'ext-v2-0011'],
    [47, 'id-v2-481', 'id-v2-1034'],
    [47, 'id-v2-1323', 'id-v2-1036'],
    [47, 'id-v2-520', 'id-v2-1037'],
    [47, 'id-v2-465', 'id-v2-864'],
    [47, 'id-v2-523', 'id-v2-868'],
    [47, 'id-v2-525', 'id-v2-1662'],
    [47, 'id-v2-526', 'id-v2-1657'],
    [47, 'id-v2-529', 'id-v2-1659'],
    [47, 'id-v2-548', 'id-v2-1652'],
    [47, 'id-v2-549', 'id-v2-1049'],
    // Scene 49 (idx 48, classroom: Ukrainian school classroom lesson)
    [48, 'id-v2-156', 'cl-student'],
    [48, 'id-v2-159', 'id-v2-792'],
    [48, 'id-v2-548', 'id-v2-793'],
    [48, 'id-v2-987', 'cl-board'],
    [48, 'id-v2-755', 'id-v2-737'],
    [48, 'id-v2-757', 'cl-desk'],
    [48, 'id-v2-759', 'id-v2-739'],
    [48, 'id-v2-561', 'id-v2-1354'],
    [48, 'id-v2-747', 'id-v2-1751'],
    [48, 'id-v2-1561', 'id-v2-345'],
    // Scene 50 (idx 49, classroom: close-up student desk stationery)
    [49, 'id-v2-156', 'id-v2-747'],
    [49, 'id-v2-1980', 'id-v2-757'],
    [49, 'id-v2-595', 'id-v2-759'],
    [49, 'id-v2-745', 'id-v2-755'],
    [49, 'id-v2-808', 'id-v2-1452'],
    [49, 'id-v2-1482', 'id-v2-766'],
    [49, 'id-v2-787', 'id-v2-1443'],
    // Scene 51 (idx 50, classroom: school science & STEAM laboratory)
    [50, 'id-v2-990', 'id-v2-787'],
    [50, 'id-v2-561', 'id-v2-951'],
    [50, 'id-v2-670', 'id-v2-1993'],
    [50, 'id-v2-543', 'id-v2-1691'],
    [50, 'id-v2-1482', 'id-v2-1692'],
    [50, 'id-v2-772', 'id-v2-1693'],
    [50, 'id-v2-1478', 'id-v2-898'],
    [50, 'id-v2-156', 'id-v2-889'],
    [50, 'id-v2-160', 'id-v2-1056'],
    // Scene 52 (idx 51, library: university library reading hall in Lviv)
    [51, 'id-v2-930', 'id-v2-745'],
    [51, 'id-v2-1136', 'id-v2-772'],
    [51, 'id-v2-1987', 'id-v2-1116'],
    [51, 'id-v2-661', 'id-v2-325'],
    [51, 'id-v2-990', 'id-v2-326'],
    [51, 'id-v2-595', 'id-v2-327'],
    [51, 'id-v2-1496', 'id-v2-201'],
    [51, 'id-v2-1495', 'id-v2-279'],
    // Scene 53 (idx 52, office: modern IT coworking office in Kyiv)
    [52, 'id-v2-546', 'id-v2-1094'],
    [52, 'id-v2-481', 'id-v2-1478'],
    [52, 'id-v2-158', 'id-v2-629'],
    [52, 'id-v2-1563', 'id-v2-1831'],
    [52, 'id-v2-1987', 'id-v2-1669'],
    [52, 'id-v2-1127', 'id-v2-1666'],
    [52, 'id-v2-576', 'id-v2-1665'],
    [52, 'id-v2-1085', 'id-v2-203'],
    [52, 'id-v2-686', 'id-v2-204'],
    // Scene 54 (idx 53, office: close-up desk electronics & accessories)
    [53, 'id-v2-575', 'id-v2-1980'],
    [53, 'id-v2-408', 'id-v2-1968'],
    [53, 'id-v2-633', 'id-v2-1725'],
    [53, 'id-v2-634', 'id-v2-1714'],
    [53, 'id-v2-1482', 'id-v2-310'],
    [53, 'id-v2-543', 'id-v2-200'],
    [53, 'id-v2-636', 'id-v2-199'],
    [53, 'id-v2-930', 'id-v2-595'],
    [53, 'id-v2-1052', 'id-v2-179'],
    // Scene 55 (idx 54, office: Ukrainian post office Ukrposhta)
    [54, 'id-v2-1053', 'id-v2-1484'],
    [54, 'id-v2-576', 'id-v2-633'],
    [54, 'id-v2-408', 'id-v2-634'],
    [54, 'id-v2-1154', 'id-v2-636'],
    [54, 'id-v2-177', 'id-v2-632'],
    [54, 'id-v2-661', 'id-v2-163'],
    [54, 'id-v2-582', 'id-v2-708'],
    [54, 'id-v2-150', 'id-v2-707'],
    [54, 'id-v2-431', 'id-v2-343'],
    [54, 'id-v2-479', 'id-v2-347'],
    [54, 'id-v2-393', 'id-v2-1174'],
    [54, 'id-v2-437', 'id-v2-241'],
    [54, 'id-v2-231', 'id-v2-246'],
    // Scene 56 (idx 55, office: bank branch & citizen administrative service center TsNAP)
    [55, 'id-v2-462', 'id-v2-411'],
    [55, 'id-v2-579', 'id-v2-408'],
    [55, 'id-v2-520', 'id-v2-236'],
    [55, 'id-v2-454', 'id-v2-244'],
    [55, 'id-v2-465', 'id-v2-346'],
    [55, 'id-v2-1521', 'id-v2-808'],
    [55, 'id-v2-1728', 'id-v2-809'],
    [55, 'id-v2-709', 'id-v2-810'],
    [55, 'id-v2-174', 'id-v2-802'],
    [55, 'id-v2-467', 'id-v2-1490'],
    [55, 'id-v2-468', 'id-v2-1482'],
    [55, 'id-v2-394', 'id-v2-1500'],
    // Future-scene category compatibility preservation across Scenes 62..80
    [61, 'id-v2-549', 'id-v2-795'],
    [61, 'id-v2-523', 'id-v2-796'],
    [61, 'id-v2-475', 'ext-v2-0012'],
    [68, 'id-v2-480', 'ext-v2-0013'],
    [70, 'id-v2-686', 'id-v2-549'],
    [72, 'id-v2-465', 'id-v2-150'],
    [74, 'id-v2-1323', 'id-v2-686'],
    [74, 'id-v2-454', 'id-v2-329'],
    [74, 'id-v2-520', 'id-v2-288'],
    [74, 'id-v2-467', 'id-v2-392'],
    [75, 'id-v2-476', 'id-v2-660'],
    [75, 'id-v2-434', 'id-v2-662'],
    [75, 'id-v2-473', 'id-v2-664'],
    [75, 'id-v2-468', 'id-v2-153'],
    [75, 'id-v2-428', 'id-v2-1495'],
    [75, 'id-v2-436', 'id-v2-393'],
    [75, 'id-v2-439', 'id-v2-1176'],
    [75, 'id-v2-440', 'id-v2-1154'],
  ];
  for (const [sceneIdx, fromId, toId] of batch7PrimarySwaps) {
    swapBatch7PrimaryConcepts(sceneIdx, fromId, toId);
  }

  // Batch 8 (Scenes 57–66, indices 56–65) semantic scene coherence preparation:
  // Swap strictly within ungenerated scenes (indices >= 56) so Scenes 1–56 remain 100% locked
  // and all relocated primaries (including gm-machine in Scene 61) remain intact.
  const swapBatch8PrimaryConcepts = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 56; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  const batch8PrimarySwaps: Array<[number, string, string]> = [
    // Scene 57 (idx 56, park-garden: autumn city park in Kyiv)
    [56, 'id-v2-425', 'id-v2-1598'],
    [56, 'noun-zamok-castle', 'id-v2-390'],
    [56, 'id-v2-456', 'id-v2-1612'],
    [56, 'id-v2-1616', 'id-v2-987'],
    [56, 'id-v2-1608', 'pk-path'],
    [56, 'id-v2-1603', 'pk-bush'],
    [56, 'id-v2-385', 'pk-grass'],
    [56, 'id-v2-421', 'id-v2-1538'],
    [56, 'id-v2-993', 'noun-lystok-leaf'],
    [56, 'id-v2-1552', 'id-v2-883'],
    // Scene 58 (idx 57, park-garden: Ukrainian botanical garden)
    [57, 'id-v2-1608', 'id-v2-1561'],
    [57, 'id-v2-1603', 'id-v2-1563'],
    [57, 'id-v2-456', 'id-v2-1552'],
    [57, 'id-v2-518', 'id-v2-910'],
    [57, 'id-v2-1624', 'pk-flower'],
    [57, 'id-v2-1625', 'id-v2-901'],
    [57, 'id-v2-1578', 'id-v2-912'],
    [57, 'id-v2-1929', 'id-v2-1581'],
    [57, 'id-v2-1553', 'id-v2-991'],
    // Scene 59 (idx 58, park-garden: orchard and garden tools)
    [58, 'id-v2-993', 'id-v2-385'],
    [58, 'id-v2-654', 'id-v2-382'],
    [58, 'id-v2-456', 'id-v2-1931'],
    [58, 'noun-zamok-castle', 'id-v2-1929'],
    [58, 'id-v2-1293', 'id-v2-1585'],
    [58, 'id-v2-1554', 'id-v2-1582'],
    [58, 'id-v2-1555', 'id-v2-394'],
    [58, 'id-v2-1685', 'fm-pear'],
    [58, 'id-v2-1672', 'id-v2-425'],
    [58, 'id-v2-916', 'id-v2-428'],
    [58, 'id-v2-924', 'id-v2-1797'],
    // Scene 60 (idx 59, playground: neighborhood courtyard playground)
    [59, 'id-v2-1433', 'id-v2-1685'],
    [59, 'id-v2-687', 'id-v2-1083'],
    [59, 'id-v2-1419', 'id-v2-1687'],
    [59, 'id-v2-1420', 'id-v2-1688'],
    [59, 'id-v2-710', 'pg-child'],
    // Scene 61 (idx 60, gym-fitness: modern fitness gym, preserving gm-machine)
    [60, 'id-v2-1674', 'gm-dumbbell'],
    [60, 'id-v2-176', 'id-v2-1683'],
    [60, 'id-v2-879', 'id-v2-1052'],
    [60, 'id-v2-1578', 'id-v2-1053'],
    [60, 'id-v2-941', 'id-v2-1057'],
    [60, 'id-v2-177', 'id-v2-1055'],
    // Scene 62 (idx 61, gym-fitness: outdoor sports stadium & court)
    [61, 'id-v2-1675', 'id-v2-1672'],
    [61, 'id-v2-941', 'id-v2-1067'],
    [61, 'id-v2-177', 'id-v2-1071'],
    [61, 'id-v2-160', 'id-v2-1072'],
    [61, 'id-v2-795', 'id-v2-711'],
    [61, 'id-v2-796', 'id-v2-1418'],
    [61, 'noun-mysha-animal', 'id-v2-1420'],
    [61, 'ext-v2-0012', 'id-v2-1085'],
    // Scene 63 (idx 62, gym-fitness: sports complex pool & winter gear rack)
    [62, 'id-v2-663', 'id-v2-1521'],
    [62, 'id-v2-209', 'id-v2-686'],
    [62, 'id-v2-1207', 'id-v2-284'],
    [62, 'id-v2-1667', 'id-v2-285'],
    // Scene 64 (idx 63, countryside: Ukrainian village homestead yard)
    [63, 'id-v2-435', 'id-v2-941'],
    [63, 'id-v2-527', 'id-v2-1562'],
    [63, 'id-v2-966', 'id-v2-543'],
    [63, 'id-v2-963', 'id-v2-1587'],
    [63, 'id-v2-1574', 'id-v2-272'],
    [63, 'id-v2-1609', 'id-v2-1262'],
    [63, 'id-v2-1554', 'id-v2-431'],
    // Scene 65 (idx 64, countryside: Ukrainian farmyard animals & barn)
    [64, 'id-v2-1583', 'id-v2-963'],
    [64, 'noun-zamok-castle', 'id-v2-966'],
    [64, 'id-v2-1626', 'id-v2-1987'],
    // Scene 66 (idx 65, countryside: Ukrainian steppe wheat & sunflower fields)
    [65, 'id-v2-1404', 'noun-mysha-animal'],
    [65, 'id-v2-1200', 'id-v2-1626'],
    [65, 'id-v2-579', 'id-v2-1624'],
    [65, 'id-v2-456', 'ext-v2-0025'],
    [65, 'id-v2-1293', 'id-v2-1541'],
    [65, 'id-v2-1607', 'id-v2-430'],
    [65, 'id-v2-1604', 'id-v2-523'],
    // Future-scene category compatibility preservation across Scenes 69..77
    [68, 'id-v2-518', 'id-v2-1604'],
    [68, 'id-v2-579', 'id-v2-916'],
    [72, 'id-v2-1555', 'noun-zamok-castle'],
    [72, 'id-v2-1616', 'id-v2-1608'],
    [73, 'id-v2-1578', 'id-v2-990'],
    [76, 'id-v2-1603', 'id-v2-1323'],
  ];
  for (const [sceneIdx, fromId, toId] of batch8PrimarySwaps) {
    swapBatch8PrimaryConcepts(sceneIdx, fromId, toId);
  }

  // Batch 9 (Scenes 67–76, indices 66–75) semantic scene coherence preparation:
  // Swap strictly within ungenerated scenes (indices >= 66) so Scenes 1–66 remain 100% locked.
  const swapBatch9PrimaryConcepts = (
    sceneIdxA: number,
    vocabIdInA: string,
    vocabIdToMoveIntoA: string
  ) => {
    const posA = scenePrimaryConcepts[sceneIdxA].findIndex(
      (c) => c.vocabularyId === vocabIdInA
    );
    if (posA === -1) return;
    let sceneIdxB = -1;
    let posB = -1;
    for (let i = 66; i < 80; i++) {
      const idx = scenePrimaryConcepts[i].findIndex(
        (c) => c.vocabularyId === vocabIdToMoveIntoA
      );
      if (idx !== -1) {
        sceneIdxB = i;
        posB = idx;
        break;
      }
    }
    if (sceneIdxB === -1 || posB === -1 || sceneIdxA === sceneIdxB) return;
    const temp = scenePrimaryConcepts[sceneIdxA][posA];
    scenePrimaryConcepts[sceneIdxA][posA] = scenePrimaryConcepts[sceneIdxB][posB];
    scenePrimaryConcepts[sceneIdxB][posB] = temp;
  };

  const batch9PrimarySwaps: Array<[number, string, string]> = [
    // Scene 67 (idx 66, countryside: Carpathian forest wildlife & mushrooms)
    [66, 'id-v2-481', 'id-v2-1554'],
    [66, 'ext-v2-0004', 'id-v2-1555'],
    [66, 'id-v2-1433', 'id-v2-1578'],
    [66, 'id-v2-1324', 'id-v2-1603'],
    [66, 'id-v2-654', 'id-v2-427'],
    // Scene 68 (idx 67, camping-nature: Carpathian mountain campsite & campfire)
    [67, 'id-v2-1293', 'id-v2-392'],
    [67, 'id-v2-1204', 'id-v2-393'],
    [67, 'ext-v2-0012', 'id-v2-575'],
    [67, 'id-v2-1203', 'k-pot'],
    [67, 'id-v2-561', 'id-v2-180'],
    [67, 'id-v2-416', 'id-v2-576'],
    [67, 'id-v2-529', 'id-v2-521'],
    [67, 'id-v2-456', 'id-v2-579'],
    [67, 'id-v2-1574', 'ext-v2-0002'],
    // Scene 69 (idx 68, beach-nature: Dnipro riverbank boating & fishing)
    [68, 'id-v2-1604', 'id-v2-930'],
    [68, 'id-v2-1618', 'id-v2-1407'],
    [68, 'ext-v2-0013', 'id-v2-1413'],
    [68, 'id-v2-893', 'id-v2-1403'],
    [68, 'id-v2-916', 'id-v2-1404'],
    [68, 'id-v2-993', 'id-v2-1489'],
    [68, 'id-v2-1625', 'id-v2-554'],
    [68, 'id-v2-1615', 'id-v2-990'],
    // Scene 70 (idx 69, park-garden: macro nature insects & botanical harvest)
    [69, 'id-v2-156', 'id-v2-993'],
    [69, 'id-v2-1675', 'id-v2-1625'],
    [69, 'id-v2-916', 'id-v2-893'],
    [69, 'id-v2-525', 'id-v2-437'],
    [69, 'id-v2-1136', 'id-v2-435'],
    [69, 'id-v2-1668', 'id-v2-436'],
    [69, 'id-v2-1790', 'id-v2-434'],
    [69, 'id-v2-526', 'id-v2-439'],
    [69, 'id-v2-1284', 'id-v2-440'],
    [69, 'id-v2-181', 'id-v2-432'],
    [69, 'id-v2-710', 'id-v2-415'],
    [69, 'id-v2-1331', 'id-v2-416'],
    [69, 'id-v2-654', 'id-v2-462'],
    [69, 'id-v2-1674', 'id-v2-456'],
    // Scene 71 (idx 70, hospital-pharmacy: Ukrainian pet shop & veterinary corner)
    [70, 'id-v2-549', 'id-v2-1615'],
    [70, 'id-v2-550', 'id-v2-1597'],
    [70, 'id-v2-551', 'id-v2-1779'],
    [70, 'id-v2-555', 'sm-cart'],
    [70, 'id-v2-577', 'id-v2-522'],
    [70, 'id-v2-172', 'id-v2-1293'],
    [70, 'id-v2-1346', 'id-v2-1289'],
    [70, 'id-v2-661', 'id-v2-1291'],
    [70, 'id-v2-183', 'id-v2-520'],
    [70, 'id-v2-1247', 'id-v2-465'],
    [70, 'id-v2-1230', 'id-v2-467'],
    [70, 'id-v2-1286', 'id-v2-468'],
    [70, 'id-v2-1233', 'id-v2-454'],
    // Scene 72 (idx 71, park-garden: Kyiv city zoo & wildlife habitats)
    [71, 'ext-v2-0013', 'id-v2-1607'],
    [71, 'id-v2-687', 'id-v2-916'],
    [71, 'id-v2-1136', 'id-v2-1604'],
    [71, 'id-v2-177', 'id-v2-1616'],
    [71, 'id-v2-1675', 'id-v2-988'],
    [71, 'id-v2-181', 'id-v2-1608'],
    [71, 'id-v2-796', 'id-v2-475'],
    [71, 'id-v2-1430', 'id-v2-473'],
    [71, 'id-v2-159', 'id-v2-476'],
    [71, 'id-v2-548', 'id-v2-477'],
    [71, 'id-v2-160', 'id-v2-479'],
    [71, 'id-v2-466', 'id-v2-480'],
    [71, 'id-v2-1200', 'id-v2-481'],
    // Scene 73 (idx 72, art-studio: Ukrainian painter's studio & museum gallery)
    [72, 'id-v2-150', 'id-v2-1495'],
    [72, 'id-v2-1728', 'id-v2-1136'],
    [72, 'id-v2-670', 'id-v2-1153'],
    [72, 'id-v2-181', 'id-v2-1154'],
    [72, 'id-v2-1900', 'id-v2-1574'],
    [72, 'id-v2-1351', 'id-v2-1675'],
    [72, 'id-v2-1202', 'id-v2-1674'],
    [72, 'id-v2-1128', 'id-v2-1668'],
    [72, 'id-v2-161', 'id-v2-1667'],
    [72, 'id-v2-333', 'id-v2-594'],
    // Scene 74 (idx 73, art-studio: Ukrainian opera & theater stage)
    [73, 'id-v2-546', 'id-v2-1128'],
    [73, 'id-v2-549', 'id-v2-1728'],
    [73, 'id-v2-806', 'id-v2-1496'],
    [73, 'id-v2-550', 'id-v2-181'],
    [73, 'id-v2-687', 'ext-v2-0004'],
    [73, 'id-v2-174', 'id-v2-511'],
    [73, 'id-v2-1331', 'id-v2-1310'],
    [73, 'id-v2-156', 'id-v2-518'],
    [73, 'id-v2-709', 'id-v2-194'],
    [73, 'id-v2-814', 'id-v2-1200'],
    [73, 'id-v2-663', 'id-v2-561'],
    [73, 'id-v2-176', 'id-v2-582'],
    // Scene 75 (idx 74, office: commercial photography & media studio)
    [74, 'id-v2-1429', 'id-v2-814'],
    [74, 'id-v2-1331', 'id-v2-183'],
    [74, 'id-v2-1186', 'id-v2-177'],
    [74, 'id-v2-209', 'id-v2-174'],
    [74, 'id-v2-231', 'id-v2-176'],
    [74, 'id-v2-670', 'id-v2-1204'],
    [74, 'id-v2-1351', 'id-v2-1203'],
    [74, 'id-v2-329', 'id-v2-1206'],
    [74, 'ext-v2-0013', 'id-v2-1207'],
    [74, 'id-v2-288', 'id-v2-1247'],
    [74, 'id-v2-706', 'id-v2-555'],
    [74, 'id-v2-578', 'fm-tomato'],
    [74, 'id-v2-337', 'fm-cucumber'],
    // Scene 76 (idx 75, bathroom: hair salon, laundry alcove & spa refreshment counter)
    [75, 'id-v2-660', 'id-v2-1900'],
    [75, 'id-v2-662', 'id-v2-879'],
    [75, 'id-v2-664', 'id-v2-231'],
    [75, 'id-v2-153', 'id-v2-209'],
    [75, 'id-v2-795', 'id-v2-159'],
    [75, 'ext-v2-0013', 'id-v2-156'],
    [75, 'id-v2-161', 'id-v2-1790'],
    [75, 'id-v2-150', 'id-v2-1230'],
    [75, 'id-v2-1185', 'id-v2-1233'],
    [75, 'id-v2-670', 'id-v2-1286'],
    [75, 'id-v2-550', 'id-v2-466'],
  ];
  for (const [sceneIdx, fromId, toId] of batch9PrimarySwaps) {
    swapBatch9PrimaryConcepts(sceneIdx, fromId, toId);
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

  // Ensure Scene 14 (index 13) spiral reviews match the verified visible music-corner objects:
  // lr-armchair (крісло), bd-curtains (штори), id-v2-265 (вазон)
  sceneReviewConcepts[13] = [
    conceptByVocabId.get('lr-armchair')!,
    conceptByVocabId.get('bd-curtains')!,
    conceptByVocabId.get('id-v2-265')!,
  ];

  // Ensure Scene 15 (index 14) and Scene 16 (index 15) spiral reviews match the verified visible bedroom/vanity objects
  sceneReviewConcepts[14] = [
    conceptByVocabId.get('id-v2-217')!,
    conceptByVocabId.get('bd-blanket')!,
    conceptByVocabId.get('bd-wardrobe')!,
  ];
  sceneReviewConcepts[15] = [
    conceptByVocabId.get('id-v2-304')!,
    conceptByVocabId.get('id-v2-879')!,
    conceptByVocabId.get('bd-mirror')!,
  ];

  // Ensure Batch 4 (Scenes 17–26, indices 16–25) spiral reviews match verified visible objects
  sceneReviewConcepts[16] = [
    conceptByVocabId.get('id-v2-401')!,
    conceptByVocabId.get('id-v2-402')!,
    conceptByVocabId.get('id-v2-403')!,
  ];
  sceneReviewConcepts[17] = [
    conceptByVocabId.get('id-v2-284')!,
    conceptByVocabId.get('id-v2-319')!,
    conceptByVocabId.get('id-v2-1160')!,
  ];
  sceneReviewConcepts[18] = [
    conceptByVocabId.get('id-v2-301')!,
    conceptByVocabId.get('ba-toothpaste')!,
    conceptByVocabId.get('ba-sink')!,
  ];
  sceneReviewConcepts[19] = [
    conceptByVocabId.get('bd-mirror')!,
    conceptByVocabId.get('id-v2-1170')!,
    conceptByVocabId.get('id-v2-339')!,
  ];
  sceneReviewConcepts[20] = [
    conceptByVocabId.get('id-v2-229')!,
    conceptByVocabId.get('id-v2-961')!,
    conceptByVocabId.get('dr-cup')!,
  ];
  sceneReviewConcepts[21] = [
    conceptByVocabId.get('id-v2-852')!,
    conceptByVocabId.get('id-v2-763')!,
    conceptByVocabId.get('id-v2-409')!,
  ];
  sceneReviewConcepts[22] = [
    conceptByVocabId.get('id-v2-1364')!,
    conceptByVocabId.get('sm-cart')!,
    conceptByVocabId.get('id-v2-1758')!,
  ];
  sceneReviewConcepts[23] = [
    conceptByVocabId.get('sm-bread')!,
    conceptByVocabId.get('id-v2-483')!,
    conceptByVocabId.get('sm-basket')!,
  ];
  sceneReviewConcepts[24] = [
    conceptByVocabId.get('sm-cart')!,
    conceptByVocabId.get('sm-basket')!,
    conceptByVocabId.get('sm-milk')!,
  ];
  sceneReviewConcepts[25] = [
    conceptByVocabId.get('id-v2-189')!,
    conceptByVocabId.get('sm-basket')!,
    conceptByVocabId.get('id-v2-421')!,
  ];

  // Ensure Batch 5 (Scenes 27–36, indices 26–35) spiral reviews match verified visible objects
  sceneReviewConcepts[26] = [
    conceptByVocabId.get('id-v2-445')!,
    conceptByVocabId.get('id-v2-448')!,
    conceptByVocabId.get('id-v2-441')!,
  ];
  sceneReviewConcepts[27] = [
    conceptByVocabId.get('id-v2-1363')!,
    conceptByVocabId.get('id-v2-502')!,
    conceptByVocabId.get('id-v2-497')!,
  ];
  sceneReviewConcepts[28] = [
    conceptByVocabId.get('dr-cup')!,
    conceptByVocabId.get('id-v2-222')!,
    conceptByVocabId.get('ext-v2-0003')!,
  ];
  sceneReviewConcepts[29] = [
    conceptByVocabId.get('id-v2-568')!,
    conceptByVocabId.get('k-plate')!,
    conceptByVocabId.get('k-fork')!,
  ];
  sceneReviewConcepts[30] = [
    conceptByVocabId.get('bd-mirror')!,
    conceptByVocabId.get('id-v2-645')!,
    conceptByVocabId.get('id-v2-229')!,
  ];
  sceneReviewConcepts[31] = [
    conceptByVocabId.get('id-v2-846')!,
    conceptByVocabId.get('id-v2-858')!,
    conceptByVocabId.get('id-v2-854')!,
  ];
  sceneReviewConcepts[32] = [
    conceptByVocabId.get('id-v2-1151')!,
    conceptByVocabId.get('id-v2-858')!,
    conceptByVocabId.get('id-v2-815')!,
  ];
  sceneReviewConcepts[33] = [
    conceptByVocabId.get('id-v2-623')!,
    conceptByVocabId.get('ext-v2-0021')!,
    conceptByVocabId.get('id-v2-328')!,
  ];
  sceneReviewConcepts[34] = [
    conceptByVocabId.get('id-v2-625')!,
    conceptByVocabId.get('id-v2-608')!,
    conceptByVocabId.get('id-v2-1352')!,
  ];
  sceneReviewConcepts[35] = [
    conceptByVocabId.get('id-v2-874')!,
    conceptByVocabId.get('id-v2-1505')!,
    conceptByVocabId.get('id-v2-841')!,
  ];

  // Ensure Batch 6 (Scenes 37–46, indices 36–45) spiral reviews match verified visible objects
  sceneReviewConcepts[36] = [
    conceptByVocabId.get('id-v2-615')!,
    conceptByVocabId.get('cs-road')!,
    conceptByVocabId.get('id-v2-1333')!,
  ];
  sceneReviewConcepts[37] = [
    conceptByVocabId.get('cs-light')!,
    conceptByVocabId.get('cs-sign')!,
    conceptByVocabId.get('cs-sidewalk')!,
  ];
  sceneReviewConcepts[38] = [
    conceptByVocabId.get('id-v2-1334')!,
    conceptByVocabId.get('pk-bench')!,
    conceptByVocabId.get('pt-doors')!,
  ];
  sceneReviewConcepts[39] = [
    conceptByVocabId.get('id-v2-702')!,
    conceptByVocabId.get('pt-ticket')!,
    conceptByVocabId.get('at-platform')!,
  ];
  sceneReviewConcepts[40] = [
    conceptByVocabId.get('at-suitcase')!,
    conceptByVocabId.get('at-board')!,
    conceptByVocabId.get('at-passenger')!,
  ];
  sceneReviewConcepts[41] = [
    conceptByVocabId.get('cs-car')!,
    conceptByVocabId.get('noun-klyuch-wrench')!,
    conceptByVocabId.get('cs-road')!,
  ];
  sceneReviewConcepts[42] = [
    conceptByVocabId.get('of-computer')!,
    conceptByVocabId.get('k-chair')!,
    conceptByVocabId.get('id-v2-262')!,
  ];
  sceneReviewConcepts[43] = [
    conceptByVocabId.get('id-v2-999')!,
    conceptByVocabId.get('hp-thermometer')!,
    conceptByVocabId.get('id-v2-1646')!,
  ];
  sceneReviewConcepts[44] = [
    conceptByVocabId.get('id-v2-862')!,
    conceptByVocabId.get('hp-bandage')!,
    conceptByVocabId.get('hp-thermometer')!,
  ];
  sceneReviewConcepts[45] = [
    conceptByVocabId.get('id-v2-862')!,
    conceptByVocabId.get('bd-mirror')!,
    conceptByVocabId.get('ba-toothbrush')!,
  ];

  // Ensure Batch 7 (Scenes 47–56, indices 46–55) spiral reviews match verified visible objects
  sceneReviewConcepts[46] = [
    conceptByVocabId.get('id-v2-1026')!,
    conceptByVocabId.get('id-v2-1029')!,
    conceptByVocabId.get('id-v2-1030')!,
  ];
  sceneReviewConcepts[47] = [
    conceptByVocabId.get('id-v2-1023')!,
    conceptByVocabId.get('id-v2-1031')!,
    conceptByVocabId.get('id-v2-840')!,
  ];
  sceneReviewConcepts[48] = [
    conceptByVocabId.get('id-v2-741')!,
    conceptByVocabId.get('cl-backpack')!,
    conceptByVocabId.get('k-chair')!,
  ];
  sceneReviewConcepts[49] = [
    conceptByVocabId.get('cl-notebook')!,
    conceptByVocabId.get('cl-pen')!,
    conceptByVocabId.get('cl-pencil')!,
  ];
  sceneReviewConcepts[50] = [
    conceptByVocabId.get('id-v2-778')!,
    conceptByVocabId.get('id-v2-786')!,
    conceptByVocabId.get('id-v2-741')!,
  ];
  sceneReviewConcepts[51] = [
    conceptByVocabId.get('cl-book')!,
    conceptByVocabId.get('id-v2-250')!,
    conceptByVocabId.get('id-v2-1092')!,
  ];
  sceneReviewConcepts[52] = [
    conceptByVocabId.get('of-computer')!,
    conceptByVocabId.get('of-mouse')!,
    conceptByVocabId.get('of-printer')!,
  ];
  sceneReviewConcepts[53] = [
    conceptByVocabId.get('id-v2-1089')!,
    conceptByVocabId.get('id-v2-1096')!,
    conceptByVocabId.get('id-v2-1097')!,
  ];
  sceneReviewConcepts[54] = [
    conceptByVocabId.get('id-v2-776')!,
    conceptByVocabId.get('noun-arkush-sheet')!,
    conceptByVocabId.get('id-v2-763')!,
  ];
  sceneReviewConcepts[55] = [
    conceptByVocabId.get('id-v2-749')!,
    conceptByVocabId.get('id-v2-1867')!,
    conceptByVocabId.get('id-v2-649')!,
  ];

  // Ensure Batch 8 (Scenes 57–66, indices 56–65) spiral reviews match verified visible objects
  sceneReviewConcepts[56] = [
    conceptByVocabId.get('pk-bench')!,
    conceptByVocabId.get('id-v2-615')!,
    conceptByVocabId.get('id-v2-890')!,
  ];
  sceneReviewConcepts[57] = [
    conceptByVocabId.get('id-v2-905')!,
    conceptByVocabId.get('id-v2-904')!,
    conceptByVocabId.get('id-v2-908')!,
  ];
  sceneReviewConcepts[58] = [
    conceptByVocabId.get('id-v2-381')!,
    conceptByVocabId.get('id-v2-388')!,
    conceptByVocabId.get('id-v2-331')!,
  ];
  sceneReviewConcepts[59] = [
    conceptByVocabId.get('cs-bicycle')!,
    conceptByVocabId.get('pk-bench')!,
    conceptByVocabId.get('pg-ball')!,
  ];
  sceneReviewConcepts[60] = [
    conceptByVocabId.get('id-v2-1659')!,
    conceptByVocabId.get('id-v2-1049')!,
    conceptByVocabId.get('id-v2-296')!,
  ];
  sceneReviewConcepts[61] = [
    conceptByVocabId.get('pg-ball')!,
    conceptByVocabId.get('id-v2-1056')!,
    conceptByVocabId.get('id-v2-840')!,
  ];
  sceneReviewConcepts[62] = [
    conceptByVocabId.get('id-v2-1073')!,
    conceptByVocabId.get('id-v2-1075')!,
    conceptByVocabId.get('id-v2-296')!,
  ];
  sceneReviewConcepts[63] = [
    conceptByVocabId.get('id-v2-1183')!,
    conceptByVocabId.get('id-v2-331')!,
    conceptByVocabId.get('id-v2-453')!,
  ];
  sceneReviewConcepts[64] = [
    conceptByVocabId.get('id-v2-1923')!,
    conceptByVocabId.get('id-v2-1595')!,
    conceptByVocabId.get('id-v2-543')!,
  ];
  sceneReviewConcepts[65] = [
    conceptByVocabId.get('id-v2-905')!,
    conceptByVocabId.get('id-v2-992')!,
    conceptByVocabId.get('id-v2-472')!,
  ];

  // Ensure Batch 9 (Scenes 67–76, indices 66–75) spiral reviews match verified visible objects
  sceneReviewConcepts[66] = [
    conceptByVocabId.get('id-v2-972')!,
    conceptByVocabId.get('id-v2-973')!,
    conceptByVocabId.get('id-v2-898')!,
  ];
  sceneReviewConcepts[67] = [
    conceptByVocabId.get('cl-backpack')!,
    conceptByVocabId.get('id-v2-1195')!,
    conceptByVocabId.get('k-knife')!,
  ];
  sceneReviewConcepts[68] = [
    conceptByVocabId.get('id-v2-672')!,
    conceptByVocabId.get('pk-bench')!,
    conceptByVocabId.get('id-v2-1680')!,
  ];
  sceneReviewConcepts[69] = [
    conceptByVocabId.get('id-v2-992')!,
    conceptByVocabId.get('id-v2-994')!,
    conceptByVocabId.get('id-v2-1626')!,
  ];
  sceneReviewConcepts[70] = [
    conceptByVocabId.get('hp-thermometer')!,
    conceptByVocabId.get('id-v2-960')!,
    conceptByVocabId.get('id-v2-961')!,
  ];
  sceneReviewConcepts[71] = [
    conceptByVocabId.get('id-v2-982')!,
    conceptByVocabId.get('id-v2-989')!,
    conceptByVocabId.get('id-v2-972')!,
  ];
  sceneReviewConcepts[72] = [
    conceptByVocabId.get('id-v2-260')!,
    conceptByVocabId.get('id-v2-1529')!,
    conceptByVocabId.get('id-v2-202')!,
  ];
  sceneReviewConcepts[73] = [
    conceptByVocabId.get('id-v2-1122')!,
    conceptByVocabId.get('id-v2-1094')!,
    conceptByVocabId.get('bd-curtains')!,
  ];
  sceneReviewConcepts[74] = [
    conceptByVocabId.get('id-v2-1108')!,
    conceptByVocabId.get('id-v2-1110')!,
    conceptByVocabId.get('id-v2-1700')!,
  ];
  sceneReviewConcepts[75] = [
    conceptByVocabId.get('bd-mirror')!,
    conceptByVocabId.get('id-v2-304')!,
    conceptByVocabId.get('id-v2-301')!,
  ];

  // Batch 10 (Scenes 77–80, indices 76–79) final 4-scene primary & spiral-review alignment:
  // Partitions the exact 60 remaining primary concepts across Scenes 77–80 (indices 76–79)
  // so that each scene's 15 primaries + 3 spiral reviews match the 18 visible objects in its photograph.
  scenePrimaryConcepts[76] = [
    'id-v2-728',
    'id-v2-729',
    'id-v2-731',
    'id-v2-1216',
    'id-v2-288',
    'id-v2-337',
    'id-v2-150',
    'id-v2-152',
    'id-v2-153',
    'id-v2-158',
    'id-v2-160',
    'id-v2-161',
    'id-v2-1185',
    'id-v2-1186',
    'id-v2-1202',
  ].map((id) => conceptByVocabId.get(id)!);

  scenePrimaryConcepts[77] = [
    'id-v2-333',
    'id-v2-1331',
    'id-v2-1351',
    'id-v2-670',
    'id-v2-1429',
    'id-v2-1430',
    'id-v2-806',
    'id-v2-654',
    'id-v2-1392',
    'id-v2-1346',
    'id-v2-709',
    'id-v2-710',
    'id-v2-660',
    'id-v2-706',
    'id-v2-727',
  ].map((id) => conceptByVocabId.get(id)!);

  scenePrimaryConcepts[78] = [
    'id-v2-1393',
    'id-v2-661',
    'id-v2-662',
    'id-v2-663',
    'id-v2-664',
    'id-v2-1432',
    'id-v2-687',
    'id-v2-1433',
    'id-v2-329',
    'id-v2-578',
    'id-v2-525',
    'id-v2-526',
    'id-v2-1296',
    'id-v2-1284',
    'id-v2-1288',
  ].map((id) => conceptByVocabId.get(id)!);

  scenePrimaryConcepts[79] = [
    'id-v2-795',
    'id-v2-796',
    'ext-v2-0012',
    'ext-v2-0013',
    'id-v2-577',
    'id-v2-569',
    'id-v2-546',
    'id-v2-1323',
    'id-v2-549',
    'id-v2-1324',
    'id-v2-550',
    'id-v2-551',
    'id-v2-1315',
    'id-v2-548',
    'id-v2-581',
  ].map((id) => conceptByVocabId.get(id)!);

  sceneReviewConcepts[76] = [
    conceptByVocabId.get('id-v2-1842')!,
    conceptByVocabId.get('at-luggage')!,
    conceptByVocabId.get('id-v2-295')!,
  ];
  sceneReviewConcepts[77] = [
    conceptByVocabId.get('id-v2-653')!,
    conceptByVocabId.get('id-v2-658')!,
    conceptByVocabId.get('id-v2-659')!,
  ];
  sceneReviewConcepts[78] = [
    conceptByVocabId.get('id-v2-332')!,
    conceptByVocabId.get('id-v2-606')!,
    conceptByVocabId.get('id-v2-605')!,
  ];
  sceneReviewConcepts[79] = [
    conceptByVocabId.get('id-v2-506')!,
    conceptByVocabId.get('cf-pastry')!,
    conceptByVocabId.get('id-v2-268')!,
  ];

  const BATCH_CANDIDATE_HOTSPOTS_BY_SCENE_CODE: Record<
    string,
    Record<string, { x: number; y: number; width: number; height: number }>
  > = {
    uk_scene_11_dining_festive_ukrainian_table: {
      'id-v2-483': { x: 0.54, y: 0.64, width: 0.08, height: 0.11 },
      'id-v2-568': { x: 0.44, y: 0.49, width: 0.15, height: 0.17 },
      'id-v2-1183': { x: 0.18, y: 0.30, width: 0.13, height: 0.25 },
      'id-v2-202': { x: 0.56, y: 0.33, width: 0.10, height: 0.25 },
      'id-v2-513': { x: 0.83, y: 0.69, width: 0.08, height: 0.11 },
      'id-v2-420': { x: 0.89, y: 0.69, width: 0.07, height: 0.09 },
      'k-plate': { x: 0.54, y: 0.79, width: 0.24, height: 0.20 },
      'k-fork': { x: 0.51, y: 0.77, width: 0.08, height: 0.16 },
      'ext-v2-0005': { x: 0.16, y: 0.59, width: 0.13, height: 0.12 },
      'id-v2-1208': { x: 0.10, y: 0.59, width: 0.23, height: 0.21 },
      'id-v2-1317': { x: 0.74, y: 0.50, width: 0.11, height: 0.09 },
      'id-v2-1321': { x: 0.29, y: 0.50, width: 0.15, height: 0.11 },
      'id-v2-1313': { x: 0.60, y: 0.58, width: 0.13, height: 0.12 },
      'id-v2-1316': { x: 0.65, y: 0.67, width: 0.13, height: 0.14 },
      'id-v2-1318': { x: 0.72, y: 0.58, width: 0.13, height: 0.15 },
      'dr-glass': { x: 0.32, y: 0.51, width: 0.05, height: 0.14 },
      'id-v2-569': { x: 0.35, y: 0.63, width: 0.18, height: 0.19 },
      'ext-v2-0002': { x: 0.33, y: 0.39, width: 0.04, height: 0.11 },
    },
    uk_scene_12_dining_family_supper: {
      'id-v2-192': { x: 0.25, y: 0.67, width: 0.035, height: 0.10 },
      'id-v2-193': { x: 0.21, y: 0.56, width: 0.04, height: 0.19 },
      'id-v2-519': { x: 0.19, y: 0.72, width: 0.055, height: 0.10 },
      'id-v2-449': { x: 0.30, y: 0.72, width: 0.12, height: 0.05 },
      'id-v2-247': { x: 0.40, y: 0.00, width: 0.26, height: 0.20 },
      'id-v2-264': { x: 0.10, y: 0.58, width: 0.08, height: 0.23 },
      'k-spoon': { x: 0.56, y: 0.72, width: 0.07, height: 0.10 },
      'id-v2-908': { x: 0.02, y: 0.32, width: 0.22, height: 0.26 },
      'dr-cup': { x: 0.49, y: 0.65, width: 0.065, height: 0.10 },
      'dr-napkin': { x: 0.54, y: 0.72, width: 0.13, height: 0.14 },
      'id-v2-1295': { x: 0.55, y: 0.58, width: 0.13, height: 0.085 },
      'id-v2-1302': { x: 0.71, y: 0.51, width: 0.075, height: 0.15 },
      'id-v2-1305': { x: 0.72, y: 0.65, width: 0.105, height: 0.065 },
      'id-v2-552': { x: 0.42, y: 0.62, width: 0.12, height: 0.07 },
      'id-v2-572': { x: 0.61, y: 0.66, width: 0.13, height: 0.10 },
      'id-v2-600': { x: 0.78, y: 0.08, width: 0.21, height: 0.39 },
      'id-v2-1322': { x: 0.41, y: 0.75, width: 0.16, height: 0.14 },
      'id-v2-448': { x: 0.34, y: 0.65, width: 0.06, height: 0.08 },
    },
    uk_scene_13_living_room_kyiv_apartment: {
      'id-v2-222': { x: 0.47, y: 0.65, width: 0.17, height: 0.21 },
      'id-v2-1602': { x: 0.91, y: 0.43, width: 0.085, height: 0.23 },
      'ext-v2-0015': { x: 0.25, y: 0.00, width: 0.48, height: 0.14 },
      'id-v2-257': { x: 0.26, y: 0.11, width: 0.30, height: 0.09 },
      'id-v2-261': { x: 0.54, y: 0.59, width: 0.05, height: 0.085 },
      'id-v2-1755': { x: 0.08, y: 0.69, width: 0.11, height: 0.30 },
      'id-v2-1163': { x: 0.29, y: 0.19, width: 0.22, height: 0.35 },
      'id-v2-258': { x: 0.28, y: 0.53, width: 0.26, height: 0.04 },
      'id-v2-961': { x: 0.34, y: 0.59, width: 0.075, height: 0.085 },
      'id-v2-1709': { x: 0.63, y: 0.61, width: 0.045, height: 0.04 },
      'id-v2-1705': { x: 0.67, y: 0.55, width: 0.07, height: 0.105 },
      'id-v2-223': { x: 0.00, y: 0.00, width: 0.12, height: 0.99 },
      'id-v2-226': { x: 0.58, y: 0.73, width: 0.095, height: 0.18 },
      'id-v2-270': { x: 0.76, y: 0.59, width: 0.11, height: 0.21 },
      'id-v2-248': { x: 0.27, y: 0.37, width: 0.06, height: 0.18 },
      'lr-tv': { x: 0.61, y: 0.34, width: 0.12, height: 0.19 },
      'lr-sofa': { x: 0.14, y: 0.55, width: 0.30, height: 0.37 },
      'ext-v2-0014': { x: 0.41, y: 0.86, width: 0.48, height: 0.13 },
    },
    uk_scene_14_living_room_music_corner: {
      'id-v2-1121': { x: 0.28, y: 0.35, width: 0.12, height: 0.50 },
      'id-v2-1126': { x: 0.53, y: 0.54, width: 0.13, height: 0.055 },
      'id-v2-1119': { x: 0.17, y: 0.36, width: 0.11, height: 0.54 },
      'id-v2-1122': { x: 0.76, y: 0.28, width: 0.08, height: 0.32 },
      'id-v2-1125': { x: 0.54, y: 0.58, width: 0.14, height: 0.035 },
      'id-v2-1129': { x: 0.73, y: 0.59, width: 0.13, height: 0.19 },
      'id-v2-1706': { x: 0.55, y: 0.43, width: 0.12, height: 0.13 },
      'id-v2-1093': { x: 0.42, y: 0.43, width: 0.065, height: 0.155 },
      'id-v2-1092': { x: 0.47, y: 0.47, width: 0.05, height: 0.115 },
      'id-v2-1103': { x: 0.495, y: 0.57, width: 0.035, height: 0.03 },
      'id-v2-260': { x: 0.49, y: 0.04, width: 0.245, height: 0.35 },
      'id-v2-262': { x: 0.78, y: 0.045, width: 0.09, height: 0.16 },
      'id-v2-220': { x: 0.31, y: 0.84, width: 0.20, height: 0.155 },
      'id-v2-268': { x: 0.70, y: 0.40, width: 0.025, height: 0.065 },
      'id-v2-269': { x: 0.685, y: 0.45, width: 0.045, height: 0.16 },
      'lr-armchair': { x: 0.78, y: 0.46, width: 0.215, height: 0.53 },
      'bd-curtains': { x: 0.20, y: 0.00, width: 0.11, height: 0.80 },
      'id-v2-265': { x: 0.01, y: 0.37, width: 0.17, height: 0.58 },
    },
    uk_scene_15_bedroom_master_suite: {
      'id-v2-263': { x: 0.14, y: 0.64, width: 0.055, height: 0.11 },
      'id-v2-213': { x: 0.21, y: 0.62, width: 0.11, height: 0.14 },
      'id-v2-216': { x: 0.40, y: 0.50, width: 0.27, height: 0.31 },
      'id-v2-1435': { x: 0.19, y: 0.51, width: 0.07, height: 0.075 },
      'id-v2-1100': { x: 0.045, y: 0.77, width: 0.035, height: 0.08 },
      'id-v2-250': { x: 0.05, y: 0.37, width: 0.18, height: 0.45 },
      'id-v2-862': { x: 0.17, y: 0.72, width: 0.065, height: 0.06 },
      'id-v2-870': { x: 0.92, y: 0.54, width: 0.075, height: 0.22 },
      'id-v2-857': { x: 0.805, y: 0.30, width: 0.025, height: 0.16 },
      'id-v2-831': { x: 0.815, y: 0.24, width: 0.08, height: 0.32 },
      'id-v2-847': { x: 0.77, y: 0.04, width: 0.095, height: 0.09 },
      'id-v2-229': { x: 0.78, y: 0.15, width: 0.11, height: 0.11 },
      'id-v2-855': { x: 0.86, y: 0.13, width: 0.035, height: 0.36 },
      'id-v2-818': { x: 0.735, y: 0.22, width: 0.095, height: 0.285 },
      'id-v2-821': { x: 0.76, y: 0.59, width: 0.13, height: 0.115 },
      'id-v2-217': { x: 0.015, y: 0.71, width: 0.24, height: 0.285 },
      'bd-blanket': { x: 0.305, y: 0.51, width: 0.145, height: 0.27 },
      'bd-wardrobe': { x: 0.72, y: 0.00, width: 0.275, height: 0.99 },
    },
    uk_scene_16_bedroom_dressing_vanity: {
      'id-v2-219': { x: 0.00, y: 0.55, width: 0.64, height: 0.44 },
      'id-v2-305': { x: 0.24, y: 0.61, width: 0.10, height: 0.17 },
      'id-v2-1514': { x: 0.335, y: 0.77, width: 0.06, height: 0.05 },
      'id-v2-1750': { x: 0.57, y: 0.56, width: 0.04, height: 0.115 },
      'id-v2-867': { x: 0.405, y: 0.60, width: 0.105, height: 0.115 },
      'id-v2-1898': { x: 0.155, y: 0.59, width: 0.08, height: 0.17 },
      'id-v2-1899': { x: 0.21, y: 0.67, width: 0.095, height: 0.13 },
      'id-v2-1532': { x: 0.465, y: 0.66, width: 0.105, height: 0.135 },
      'id-v2-1515': { x: 0.305, y: 0.56, width: 0.11, height: 0.115 },
      'id-v2-823': { x: 0.645, y: 0.07, width: 0.145, height: 0.46 },
      'id-v2-836': { x: 0.82, y: 0.14, width: 0.165, height: 0.23 },
      'id-v2-839': { x: 0.84, y: 0.48, width: 0.10, height: 0.165 },
      'id-v2-845': { x: 0.82, y: 0.74, width: 0.115, height: 0.195 },
      'id-v2-873': { x: 0.045, y: 0.47, width: 0.19, height: 0.25 },
      'id-v2-877': { x: 0.515, y: 0.77, width: 0.09, height: 0.09 },
      'id-v2-304': { x: 0.34, y: 0.68, width: 0.10, height: 0.13 },
      'id-v2-879': { x: 0.505, y: 0.52, width: 0.06, height: 0.135 },
      'bd-mirror': { x: 0.16, y: 0.00, width: 0.40, height: 0.53 },
    },
    uk_scene_17_bedroom_child_nursery: {
      'id-v2-1508': { x: 0.02, y: 0.28, width: 0.125, height: 0.66 },
      'id-v2-1519': { x: 0.145, y: 0.065, width: 0.09, height: 0.095 },
      'id-v2-405': { x: 0.365, y: 0.75, width: 0.145, height: 0.155 },
      'id-v2-406': { x: 0.51, y: 0.79, width: 0.115, height: 0.155 },
      'pg-ball': { x: 0.57, y: 0.67, width: 0.06, height: 0.11 },
      'id-v2-741': { x: 0.73, y: 0.35, width: 0.09, height: 0.20 },
      'cl-book': { x: 0.66, y: 0.53, width: 0.17, height: 0.115 },
      'cl-pencil': { x: 0.75, y: 0.74, width: 0.075, height: 0.07 },
      'cl-notebook': { x: 0.68, y: 0.62, width: 0.145, height: 0.125 },
      'id-v2-751': { x: 0.81, y: 0.63, width: 0.08, height: 0.11 },
      'id-v2-281': { x: 0.435, y: 0.30, width: 0.025, height: 0.04 },
      'id-v2-397': { x: 0.145, y: 0.37, width: 0.265, height: 0.62 },
      'id-v2-1700': { x: 0.815, y: 0.33, width: 0.085, height: 0.30 },
      'id-v2-1141': { x: 0.81, y: 0.735, width: 0.115, height: 0.145 },
      'id-v2-410': { x: 0.88, y: 0.60, width: 0.118, height: 0.225 },
      'id-v2-401': { x: 0.245, y: 0.43, width: 0.075, height: 0.145 },
      'id-v2-402': { x: 0.315, y: 0.415, width: 0.065, height: 0.185 },
      'id-v2-403': { x: 0.41, y: 0.66, width: 0.095, height: 0.09 },
    },
    uk_scene_18_bathroom_modern_apartment: {
      'id-v2-1177': { x: 0.775, y: 0.405, width: 0.06, height: 0.13 },
      'ba-shower': { x: 0.17, y: 0.035, width: 0.085, height: 0.64 },
      'ba-bathtub': { x: 0.00, y: 0.695, width: 0.265, height: 0.30 },
      'ba-sink': { x: 0.53, y: 0.525, width: 0.22, height: 0.075 },
      'ba-faucet': { x: 0.62, y: 0.465, width: 0.025, height: 0.07 },
      'id-v2-230': { x: 0.665, y: 0.695, width: 0.125, height: 0.29 },
      'id-v2-301': { x: 0.195, y: 0.82, width: 0.065, height: 0.07 },
      'bd-mirror': { x: 0.53, y: 0.05, width: 0.20, height: 0.375 },
      'id-v2-234': { x: 0.795, y: 0.56, width: 0.17, height: 0.40 },
      'id-v2-295': { x: 0.44, y: 0.20, width: 0.09, height: 0.515 },
      'id-v2-296': { x: 0.495, y: 0.90, width: 0.09, height: 0.075 },
      'id-v2-242': { x: 0.885, y: 0.845, width: 0.11, height: 0.15 },
      'id-v2-318': { x: 0.89, y: 0.485, width: 0.055, height: 0.055 },
      'ba-toothpaste': { x: 0.655, y: 0.46, width: 0.025, height: 0.075 },
      'ba-towel': { x: 0.35, y: 0.30, width: 0.08, height: 0.215 },
      'id-v2-284': { x: 0.05, y: 0.025, width: 0.27, height: 0.84 },
      'id-v2-319': { x: 0.39, y: 0.865, width: 0.09, height: 0.06 },
      'id-v2-1160': { x: 0.335, y: 0.18, width: 0.11, height: 0.355 },
    },
    uk_scene_19_bathroom_vanity_hygiene: {
      'id-v2-297': { x: 0.58, y: 0.36, width: 0.10, height: 0.07 },
      'ba-soap': { x: 0.595, y: 0.33, width: 0.07, height: 0.065 },
      'ba-toothbrush': { x: 0.735, y: 0.20, width: 0.025, height: 0.125 },
      'id-v2-210': { x: 0.515, y: 0.175, width: 0.055, height: 0.215 },
      'id-v2-298': { x: 0.445, y: 0.135, width: 0.05, height: 0.235 },
      'id-v2-309': { x: 0.73, y: 0.66, width: 0.10, height: 0.095 },
      'id-v2-312': { x: 0.79, y: 0.77, width: 0.075, height: 0.045 },
      'id-v2-1901': { x: 0.755, y: 0.83, width: 0.145, height: 0.135 },
      'id-v2-306': { x: 0.295, y: 0.485, width: 0.16, height: 0.155 },
      'id-v2-302': { x: 0.81, y: 0.375, width: 0.05, height: 0.11 },
      'id-v2-1903': { x: 0.485, y: 0.53, width: 0.11, height: 0.095 },
      'id-v2-878': { x: 0.875, y: 0.735, width: 0.055, height: 0.17 },
      'id-v2-1768': { x: 0.13, y: 0.065, width: 0.12, height: 0.265 },
      'id-v2-1175': { x: 0.185, y: 0.26, width: 0.025, height: 0.105 },
      'id-v2-1769': { x: 0.05, y: 0.73, width: 0.105, height: 0.25 },
      'id-v2-301': { x: 0.315, y: 0.59, width: 0.095, height: 0.15 },
      'ba-toothpaste': { x: 0.76, y: 0.205, width: 0.045, height: 0.13 },
      'ba-sink': { x: 0.38, y: 0.625, width: 0.39, height: 0.31 },
    },
    uk_scene_20_hallway_apartment_entry: {
      'noun-zamok-lock': { x: 0.24, y: 0.43, width: 0.025, height: 0.045 },
      'noun-klyuch-door': { x: 0.645, y: 0.565, width: 0.03, height: 0.03 },
      'id-v2-336': { x: 0.78, y: 0.00, width: 0.215, height: 0.98 },
      'id-v2-874': { x: 0.37, y: 0.475, width: 0.055, height: 0.365 },
      'id-v2-1222': { x: 0.32, y: 0.22, width: 0.038, height: 0.14 },
      'id-v2-840': { x: 0.465, y: 0.755, width: 0.08, height: 0.135 },
      'id-v2-841': { x: 0.53, y: 0.68, width: 0.07, height: 0.23 },
      'id-v2-842': { x: 0.60, y: 0.81, width: 0.055, height: 0.11 },
      'id-v2-843': { x: 0.66, y: 0.83, width: 0.075, height: 0.11 },
      'id-v2-825': { x: 0.41, y: 0.22, width: 0.065, height: 0.40 },
      'id-v2-1171': { x: 0.475, y: 0.575, width: 0.29, height: 0.345 },
      'id-v2-259': { x: 0.09, y: 0.81, width: 0.26, height: 0.18 },
      'id-v2-228': { x: 0.35, y: 0.14, width: 0.125, height: 0.70 },
      'id-v2-340': { x: 0.325, y: 0.45, width: 0.025, height: 0.04 },
      'id-v2-1169': { x: 0.48, y: 0.12, width: 0.11, height: 0.075 },
      'bd-mirror': { x: 0.595, y: 0.085, width: 0.135, height: 0.38 },
      'id-v2-1170': { x: 0.755, y: 0.60, width: 0.025, height: 0.225 },
      'id-v2-339': { x: 0.235, y: 0.40, width: 0.03, height: 0.03 },
    },
    uk_scene_21_balcony_urban_garden: {
      'id-v2-1505': { x: 0.405, y: 0.25, width: 0.06, height: 0.385 },
      'id-v2-389': { x: 0.51, y: 0.395, width: 0.095, height: 0.155 },
      'id-v2-265': { x: 0.765, y: 0.535, width: 0.14, height: 0.385 },
      'id-v2-233': { x: 0.05, y: 0.62, width: 0.36, height: 0.375 },
      'id-v2-388': { x: 0.59, y: 0.75, width: 0.03, height: 0.10 },
      'id-v2-221': { x: 0.375, y: 0.54, width: 0.195, height: 0.415 },
      'id-v2-267': { x: 0.64, y: 0.47, width: 0.07, height: 0.10 },
      'id-v2-391': { x: 0.88, y: 0.365, width: 0.105, height: 0.145 },
      'ext-v2-0003': { x: 0.545, y: 0.74, width: 0.045, height: 0.085 },
      'id-v2-395': { x: 0.635, y: 0.77, width: 0.32, height: 0.225 },
      'id-v2-1753': { x: 0.255, y: 0.065, width: 0.115, height: 0.515 },
      'id-v2-1162': { x: 0.03, y: 0.00, width: 0.35, height: 0.77 },
      'id-v2-1818': { x: 0.66, y: 0.555, width: 0.095, height: 0.15 },
      'id-v2-256': { x: 0.035, y: 0.02, width: 0.215, height: 0.675 },
      'id-v2-328': { x: 0.455, y: 0.465, width: 0.54, height: 0.53 },
      'id-v2-229': { x: 0.26, y: 0.64, width: 0.10, height: 0.065 },
      'id-v2-961': { x: 0.775, y: 0.435, width: 0.085, height: 0.11 },
      'dr-cup': { x: 0.505, y: 0.745, width: 0.04, height: 0.055 },
    },
    uk_scene_22_home_workshop_tools: {
      'id-v2-365': { x: 0.56, y: 0.525, width: 0.05, height: 0.095 },
      'noun-klyuch-wrench': { x: 0.68, y: 0.695, width: 0.065, height: 0.185 },
      'id-v2-768': { x: 0.72, y: 0.535, width: 0.07, height: 0.10 },
      'id-v2-357': { x: 0.32, y: 0.37, width: 0.13, height: 0.25 },
      'id-v2-351': { x: 0.605, y: 0.63, width: 0.09, height: 0.255 },
      'id-v2-379': { x: 0.39, y: 0.64, width: 0.06, height: 0.22 },
      'id-v2-1151': { x: 0.455, y: 0.655, width: 0.055, height: 0.21 },
      'id-v2-350': { x: 0.02, y: 0.325, width: 0.31, height: 0.425 },
      'id-v2-1455': { x: 0.59, y: 0.70, width: 0.045, height: 0.17 },
      'id-v2-352': { x: 0.725, y: 0.675, width: 0.065, height: 0.20 },
      'ext-v2-0001': { x: 0.445, y: 0.52, width: 0.10, height: 0.125 },
      'id-v2-353': { x: 0.775, y: 0.69, width: 0.085, height: 0.18 },
      'id-v2-380': { x: 0.825, y: 0.67, width: 0.08, height: 0.075 },
      'id-v2-367': { x: 0.85, y: 0.77, width: 0.075, height: 0.105 },
      'id-v2-368': { x: 0.91, y: 0.78, width: 0.065, height: 0.09 },
      'id-v2-852': { x: 0.23, y: 0.65, width: 0.17, height: 0.235 },
      'id-v2-763': { x: 0.515, y: 0.695, width: 0.065, height: 0.18 },
      'id-v2-409': { x: 0.01, y: 0.085, width: 0.245, height: 0.20 },
    },
    uk_scene_23_supermarket_fresh_produce: {
      'sm-basket': { x: 0.245, y: 0.555, width: 0.16, height: 0.21 },
      'id-v2-414': { x: 0.59, y: 0.25, width: 0.14, height: 0.145 },
      'id-v2-1265': { x: 0.635, y: 0.425, width: 0.115, height: 0.135 },
      'id-v2-645': { x: 0.655, y: 0.045, width: 0.335, height: 0.185 },
      'id-v2-419': { x: 0.71, y: 0.445, width: 0.125, height: 0.14 },
      'id-v2-422': { x: 0.805, y: 0.30, width: 0.19, height: 0.355 },
      'id-v2-1244': { x: 0.445, y: 0.545, width: 0.14, height: 0.165 },
      'id-v2-1264': { x: 0.22, y: 0.42, width: 0.165, height: 0.155 },
      'id-v2-1266': { x: 0.70, y: 0.265, width: 0.19, height: 0.16 },
      'id-v2-1235': { x: 0.525, y: 0.53, width: 0.17, height: 0.235 },
      'id-v2-1224': { x: 0.60, y: 0.61, width: 0.16, height: 0.20 },
      'sm-apple': { x: 0.24, y: 0.315, width: 0.135, height: 0.11 },
      'sm-banana': { x: 0.54, y: 0.395, width: 0.12, height: 0.13 },
      'id-v2-447': { x: 0.695, y: 0.63, width: 0.185, height: 0.26 },
      'id-v2-448': { x: 0.83, y: 0.685, width: 0.165, height: 0.295 },
      'id-v2-1364': { x: 0.42, y: 0.045, width: 0.175, height: 0.405 },
      'sm-cart': { x: 0.015, y: 0.36, width: 0.235, height: 0.605 },
      'id-v2-1758': { x: 0.345, y: 0.51, width: 0.12, height: 0.305 },
    },
    uk_scene_24_supermarket_dairy_bakery: {
      'id-v2-1279': { x: 0.10, y: 0.535, width: 0.115, height: 0.13 },
      'id-v2-495': { x: 0.765, y: 0.39, width: 0.155, height: 0.12 },
      'id-v2-1280': { x: 0.00, y: 0.75, width: 0.18, height: 0.245 },
      'id-v2-487': { x: 0.00, y: 0.575, width: 0.155, height: 0.20 },
      'sm-milk': { x: 0.00, y: 0.02, width: 0.34, height: 0.27 },
      'sm-cheese': { x: 0.20, y: 0.48, width: 0.165, height: 0.31 },
      'id-v2-486': { x: 0.17, y: 0.325, width: 0.15, height: 0.15 },
      'id-v2-492': { x: 0.165, y: 0.70, width: 0.125, height: 0.20 },
      'id-v2-1297': { x: 0.865, y: 0.38, width: 0.13, height: 0.165 },
      'id-v2-498': { x: 0.725, y: 0.55, width: 0.125, height: 0.13 },
      'id-v2-500': { x: 0.89, y: 0.615, width: 0.108, height: 0.165 },
      'id-v2-497': { x: 0.81, y: 0.59, width: 0.11, height: 0.13 },
      'id-v2-502': { x: 0.685, y: 0.21, width: 0.205, height: 0.11 },
      'id-v2-1298': { x: 0.655, y: 0.505, width: 0.12, height: 0.13 },
      'id-v2-1363': { x: 0.00, y: 0.00, width: 0.51, height: 0.99 },
      'sm-bread': { x: 0.665, y: 0.385, width: 0.12, height: 0.10 },
      'id-v2-483': { x: 0.00, y: 0.32, width: 0.17, height: 0.19 },
      'sm-basket': { x: 0.55, y: 0.715, width: 0.145, height: 0.27 },
    },
    uk_scene_25_supermarket_checkout_counter: {
      'id-v2-649': { x: 0.835, y: 0.79, width: 0.065, height: 0.095 },
      'id-v2-640': { x: 0.51, y: 0.64, width: 0.11, height: 0.18 },
      'id-v2-641': { x: 0.165, y: 0.67, width: 0.45, height: 0.325 },
      'sm-checkout': { x: 0.55, y: 0.345, width: 0.175, height: 0.46 },
      'sm-bag': { x: 0.815, y: 0.445, width: 0.17, height: 0.28 },
      'id-v2-647': { x: 0.71, y: 0.805, width: 0.13, height: 0.105 },
      'id-v2-1528': { x: 0.77, y: 0.67, width: 0.18, height: 0.11 },
      'id-v2-650': { x: 0.88, y: 0.745, width: 0.118, height: 0.15 },
      'id-v2-1101': { x: 0.31, y: 0.385, width: 0.055, height: 0.175 },
      'ext-v2-0017': { x: 0.60, y: 0.80, width: 0.24, height: 0.17 },
      'id-v2-1307': { x: 0.21, y: 0.40, width: 0.09, height: 0.15 },
      'id-v2-648': { x: 0.56, y: 0.81, width: 0.21, height: 0.17 },
      'id-v2-646': { x: 0.625, y: 0.615, width: 0.06, height: 0.14 },
      'id-v2-623': { x: 0.405, y: 0.025, width: 0.24, height: 0.15 },
      'id-v2-805': { x: 0.42, y: 0.285, width: 0.135, height: 0.39 },
      'sm-cart': { x: 0.00, y: 0.46, width: 0.175, height: 0.465 },
      'sm-basket': { x: 0.29, y: 0.56, width: 0.19, height: 0.26 },
      'sm-milk': { x: 0.245, y: 0.655, width: 0.06, height: 0.27 },
    },
    uk_scene_26_farmers_market_bazaar: {
      'fm-seller': { x: 0.38, y: 0.11, width: 0.225, height: 0.525 },
      'id-v2-1364': { x: 0.14, y: 0.30, width: 0.215, height: 0.345 },
      'id-v2-514': { x: 0.02, y: 0.635, width: 0.19, height: 0.275 },
      'id-v2-1921': { x: 0.215, y: 0.63, width: 0.195, height: 0.175 },
      'id-v2-472': { x: 0.17, y: 0.77, width: 0.12, height: 0.135 },
      'id-v2-474': { x: 0.29, y: 0.78, width: 0.11, height: 0.125 },
      'id-v2-423': { x: 0.41, y: 0.55, width: 0.16, height: 0.185 },
      'id-v2-424': { x: 0.40, y: 0.71, width: 0.125, height: 0.205 },
      'id-v2-441': { x: 0.705, y: 0.35, width: 0.13, height: 0.24 },
      'id-v2-445': { x: 0.735, y: 0.505, width: 0.16, height: 0.19 },
      'id-v2-458': { x: 0.765, y: 0.65, width: 0.225, height: 0.285 },
      'id-v2-426': { x: 0.505, y: 0.795, width: 0.10, height: 0.115 },
      'id-v2-413': { x: 0.56, y: 0.52, width: 0.155, height: 0.095 },
      'id-v2-417': { x: 0.57, y: 0.605, width: 0.095, height: 0.11 },
      'id-v2-418': { x: 0.645, y: 0.61, width: 0.105, height: 0.105 },
      'id-v2-189': { x: 0.43, y: 0.275, width: 0.13, height: 0.30 },
      'sm-basket': { x: 0.18, y: 0.29, width: 0.16, height: 0.27 },
      'id-v2-421': { x: 0.595, y: 0.71, width: 0.205, height: 0.22 },
    },
    uk_scene_27_farmers_market_vegetables_herbs: {
      'id-v2-450': { x: 0.005, y: 0.405, width: 0.175, height: 0.24 },
      'id-v2-451': { x: 0.17, y: 0.43, width: 0.145, height: 0.16 },
      'id-v2-452': { x: 0.27, y: 0.325, width: 0.155, height: 0.25 },
      'id-v2-460': { x: 0.10, y: 0.56, width: 0.20, height: 0.39 },
      'id-v2-461': { x: 0.245, y: 0.55, width: 0.15, height: 0.35 },
      'id-v2-1226': { x: 0.35, y: 0.47, width: 0.13, height: 0.34 },
      'id-v2-1794': { x: 0.385, y: 0.75, width: 0.125, height: 0.175 },
      'id-v2-1225': { x: 0.45, y: 0.535, width: 0.105, height: 0.305 },
      'fm-carrot': { x: 0.55, y: 0.675, width: 0.105, height: 0.195 },
      'id-v2-453': { x: 0.54, y: 0.46, width: 0.08, height: 0.13 },
      'id-v2-444': { x: 0.615, y: 0.46, width: 0.105, height: 0.37 },
      'id-v2-464': { x: 0.645, y: 0.59, width: 0.16, height: 0.245 },
      'id-v2-443': { x: 0.71, y: 0.565, width: 0.225, height: 0.225 },
      'id-v2-446': { x: 0.765, y: 0.48, width: 0.14, height: 0.205 },
      'id-v2-1758': { x: 0.645, y: 0.23, width: 0.205, height: 0.335 },
      'id-v2-445': { x: 0.83, y: 0.325, width: 0.12, height: 0.215 },
      'id-v2-448': { x: 0.88, y: 0.47, width: 0.118, height: 0.18 },
      'id-v2-441': { x: 0.905, y: 0.61, width: 0.092, height: 0.155 },
    },
    uk_scene_28_bakery_craft_pastry: {
      'id-v2-1301': { x: 0.01, y: 0.625, width: 0.26, height: 0.265 },
      'id-v2-1251': { x: 0.155, y: 0.78, width: 0.11, height: 0.135 },
      'id-v2-189': { x: 0.435, y: 0.26, width: 0.15, height: 0.415 },
      'id-v2-504': { x: 0.25, y: 0.745, width: 0.185, height: 0.205 },
      'id-v2-505': { x: 0.295, y: 0.64, width: 0.135, height: 0.115 },
      'id-v2-507': { x: 0.435, y: 0.78, width: 0.155, height: 0.15 },
      'id-v2-508': { x: 0.435, y: 0.655, width: 0.105, height: 0.125 },
      'id-v2-509': { x: 0.54, y: 0.62, width: 0.085, height: 0.155 },
      'id-v2-499': { x: 0.625, y: 0.635, width: 0.135, height: 0.095 },
      'id-v2-804': { x: 0.38, y: 0.07, width: 0.265, height: 0.605 },
      'id-v2-1308': { x: 0.675, y: 0.705, width: 0.16, height: 0.095 },
      'id-v2-1304': { x: 0.595, y: 0.755, width: 0.095, height: 0.165 },
      'id-v2-1311': { x: 0.67, y: 0.76, width: 0.075, height: 0.16 },
      'id-v2-173': { x: 0.72, y: 0.53, width: 0.195, height: 0.05 },
      'id-v2-517': { x: 0.835, y: 0.64, width: 0.145, height: 0.135 },
      'id-v2-1363': { x: 0.06, y: 0.225, width: 0.345, height: 0.445 },
      'id-v2-502': { x: 0.735, y: 0.765, width: 0.15, height: 0.165 },
      'id-v2-497': { x: 0.875, y: 0.755, width: 0.122, height: 0.18 },
    },
    uk_scene_29_cafe_lviv_coffeehouse: {
      'cf-barista': { x: 0.655, y: 0.075, width: 0.21, height: 0.585 },
      'cf-coffee': { x: 0.22, y: 0.74, width: 0.085, height: 0.045 },
      'cf-menu': { x: 0.69, y: 0.365, width: 0.13, height: 0.265 },
      'cf-pastry': { x: 0.365, y: 0.72, width: 0.065, height: 0.07 },
      'id-v2-1191': { x: 0.405, y: 0.45, width: 0.12, height: 0.15 },
      'id-v2-155': { x: 0.325, y: 0.25, width: 0.30, height: 0.34 },
      'id-v2-573': { x: 0.355, y: 0.815, width: 0.20, height: 0.145 },
      'id-v2-506': { x: 0.815, y: 0.52, width: 0.14, height: 0.115 },
      'id-v2-592': { x: 0.58, y: 0.195, width: 0.075, height: 0.335 },
      'id-v2-587': { x: 0.255, y: 0.42, width: 0.11, height: 0.225 },
      'id-v2-588': { x: 0.505, y: 0.67, width: 0.085, height: 0.165 },
      'id-v2-596': { x: 0.345, y: 0.455, width: 0.03, height: 0.18 },
      'id-v2-1306': { x: 0.685, y: 0.64, width: 0.13, height: 0.115 },
      'id-v2-512': { x: 0.805, y: 0.715, width: 0.19, height: 0.105 },
      'id-v2-1194': { x: 0.215, y: 0.835, width: 0.10, height: 0.05 },
      'dr-cup': { x: 0.20, y: 0.735, width: 0.11, height: 0.13 },
      'id-v2-222': { x: 0.14, y: 0.745, width: 0.525, height: 0.25 },
      'ext-v2-0003': { x: 0.465, y: 0.56, width: 0.12, height: 0.13 },
    },
    uk_scene_30_restaurant_ukrainian_bistro: {
      'rs-waiter': { x: 0.115, y: 0.025, width: 0.265, height: 0.52 },
      'rs-bill': { x: 0.275, y: 0.345, width: 0.125, height: 0.145 },
      'id-v2-1314': { x: 0.24, y: 0.51, width: 0.16, height: 0.12 },
      'id-v2-532': { x: 0.78, y: 0.555, width: 0.08, height: 0.13 },
      'id-v2-570': { x: 0.74, y: 0.68, width: 0.195, height: 0.195 },
      'id-v2-1322': { x: 0.52, y: 0.745, width: 0.115, height: 0.14 },
      'id-v2-198': { x: 0.05, y: 0.41, width: 0.20, height: 0.055 },
      'id-v2-191': { x: 0.865, y: 0.55, width: 0.115, height: 0.155 },
      'id-v2-196': { x: 0.745, y: 0.44, width: 0.15, height: 0.165 },
      'id-v2-1320': { x: 0.615, y: 0.60, width: 0.14, height: 0.145 },
      'id-v2-547': { x: 0.415, y: 0.49, width: 0.185, height: 0.155 },
      'id-v2-533': { x: 0.51, y: 0.59, width: 0.10, height: 0.135 },
      'id-v2-571': { x: 0.295, y: 0.61, width: 0.185, height: 0.14 },
      'id-v2-503': { x: 0.09, y: 0.56, width: 0.16, height: 0.125 },
      'ext-v2-0006': { x: 0.605, y: 0.48, width: 0.175, height: 0.165 },
      'id-v2-568': { x: 0.17, y: 0.705, width: 0.18, height: 0.205 },
      'k-plate': { x: 0.45, y: 0.73, width: 0.235, height: 0.215 },
      'k-fork': { x: 0.625, y: 0.845, width: 0.20, height: 0.13 },
    },
    uk_scene_31_clothing_store_boutique: {
      'id-v2-816': { x: 0.30, y: 0.40, width: 0.23, height: 0.475 },
      'ext-v2-0021': { x: 0.00, y: 0.00, width: 0.995, height: 0.995 },
      'id-v2-1361': { x: 0.005, y: 0.045, width: 0.25, height: 0.87 },
      'id-v2-829': { x: 0.545, y: 0.665, width: 0.115, height: 0.14 },
      'id-v2-833': { x: 0.685, y: 0.23, width: 0.105, height: 0.49 },
      'id-v2-856': { x: 0.715, y: 0.275, width: 0.03, height: 0.03 },
      'id-v2-1889': { x: 0.695, y: 0.275, width: 0.07, height: 0.105 },
      'id-v2-1893': { x: 0.915, y: 0.65, width: 0.065, height: 0.095 },
      'id-v2-858': { x: 0.62, y: 0.36, width: 0.025, height: 0.18 },
      'id-v2-854': { x: 0.66, y: 0.735, width: 0.06, height: 0.055 },
      'id-v2-815': { x: 0.855, y: 0.23, width: 0.14, height: 0.37 },
      'id-v2-832': { x: 0.79, y: 0.30, width: 0.09, height: 0.525 },
      'id-v2-846': { x: 0.42, y: 0.195, width: 0.045, height: 0.09 },
      'id-v2-838': { x: 0.505, y: 0.215, width: 0.055, height: 0.085 },
      'id-v2-828': { x: 0.515, y: 0.37, width: 0.07, height: 0.26 },
      'bd-mirror': { x: 0.25, y: 0.10, width: 0.13, height: 0.745 },
      'id-v2-645': { x: 0.305, y: 0.84, width: 0.028, height: 0.11 },
      'id-v2-229': { x: 0.37, y: 0.33, width: 0.09, height: 0.09 },
    },
    uk_scene_32_clothing_winter_outerwear: {
      'id-v2-827': { x: 0.05, y: 0.275, width: 0.20, height: 0.56 },
      'id-v2-1506': { x: 0.165, y: 0.285, width: 0.155, height: 0.515 },
      'id-v2-826': { x: 0.235, y: 0.245, width: 0.155, height: 0.60 },
      'id-v2-852': { x: 0.765, y: 0.485, width: 0.125, height: 0.08 },
      'id-v2-850': { x: 0.46, y: 0.17, width: 0.085, height: 0.265 },
      'id-v2-822': { x: 0.345, y: 0.285, width: 0.105, height: 0.45 },
      'id-v2-853': { x: 0.905, y: 0.36, width: 0.09, height: 0.175 },
      'id-v2-824': { x: 0.43, y: 0.215, width: 0.155, height: 0.49 },
      'id-v2-834': { x: 0.585, y: 0.175, width: 0.155, height: 0.64 },
      'cl-backpack': { x: 0.645, y: 0.215, width: 0.135, height: 0.32 },
      'id-v2-1524': { x: 0.64, y: 0.68, width: 0.055, height: 0.115 },
      'id-v2-1892': { x: 0.685, y: 0.805, width: 0.09, height: 0.105 },
      'id-v2-817': { x: 0.845, y: 0.71, width: 0.148, height: 0.12 },
      'id-v2-819': { x: 0.71, y: 0.655, width: 0.15, height: 0.14 },
      'id-v2-830': { x: 0.765, y: 0.78, width: 0.185, height: 0.18 },
      'id-v2-846': { x: 0.475, y: 0.05, width: 0.06, height: 0.115 },
      'id-v2-858': { x: 0.095, y: 0.33, width: 0.025, height: 0.485 },
      'id-v2-854': { x: 0.80, y: 0.865, width: 0.105, height: 0.105 },
    },
    uk_scene_33_shoe_and_tailor_atelier: {
      'id-v2-1146': { x: 0.15, y: 0.525, width: 0.27, height: 0.31 },
      'id-v2-1147': { x: 0.335, y: 0.845, width: 0.105, height: 0.095 },
      'id-v2-1148': { x: 0.065, y: 0.66, width: 0.10, height: 0.23 },
      'id-v2-763': { x: 0.50, y: 0.84, width: 0.13, height: 0.095 },
      'id-v2-1150': { x: 0.435, y: 0.76, width: 0.07, height: 0.085 },
      'id-v2-1486': { x: 0.385, y: 0.11, width: 0.21, height: 0.60 },
      'id-v2-835': { x: 0.19, y: 0.165, width: 0.195, height: 0.545 },
      'id-v2-848': { x: 0.26, y: 0.04, width: 0.085, height: 0.08 },
      'id-v2-851': { x: 0.595, y: 0.225, width: 0.11, height: 0.455 },
      'id-v2-859': { x: 0.765, y: 0.32, width: 0.035, height: 0.06 },
      'id-v2-860': { x: 0.73, y: 0.195, width: 0.075, height: 0.085 },
      'id-v2-861': { x: 0.81, y: 0.24, width: 0.04, height: 0.40 },
      'id-v2-1152': { x: 0.70, y: 0.725, width: 0.10, height: 0.15 },
      'id-v2-1156': { x: 0.555, y: 0.72, width: 0.14, height: 0.10 },
      'id-v2-872': { x: 0.855, y: 0.565, width: 0.142, height: 0.24 },
      'id-v2-1151': { x: 0.455, y: 0.285, width: 0.07, height: 0.33 },
      'id-v2-858': { x: 0.54, y: 0.835, width: 0.20, height: 0.11 },
      'id-v2-815': { x: 0.68, y: 0.19, width: 0.165, height: 0.45 },
    },
    uk_scene_34_city_street_kyiv_chestnuts: {
      'id-v2-669': { x: 0.665, y: 0.855, width: 0.032, height: 0.09 },
      'id-v2-1352': { x: 0.895, y: 0.105, width: 0.035, height: 0.055 },
      'id-v2-1820': { x: 0.298, y: 0.585, width: 0.12, height: 0.20 },
      'id-v2-1349': { x: 0.478, y: 0.705, width: 0.11, height: 0.095 },
      'cs-light': { x: 0.648, y: 0.51, width: 0.022, height: 0.085 },
      'cs-sign': { x: 0.605, y: 0.55, width: 0.038, height: 0.065 },
      'id-v2-615': { x: 0.58, y: 0.035, width: 0.06, height: 0.765 },
      'id-v2-1355': { x: 0.033, y: 0.52, width: 0.048, height: 0.13 },
      'noun-bank-financial': { x: 0.825, y: 0.15, width: 0.175, height: 0.555 },
      'id-v2-653': { x: 0.702, y: 0.595, width: 0.145, height: 0.19 },
      'id-v2-603': { x: 0.605, y: 0.26, width: 0.11, height: 0.39 },
      'id-v2-608': { x: 0.482, y: 0.785, width: 0.21, height: 0.105 },
      'id-v2-621': { x: 0.70, y: 0.785, width: 0.152, height: 0.21 },
      'id-v2-622': { x: 0.892, y: 0.53, width: 0.092, height: 0.20 },
      'id-v2-625': { x: 0.125, y: 0.47, width: 0.128, height: 0.12 },
      'id-v2-623': { x: 0.108, y: 0.405, width: 0.125, height: 0.08 },
      'ext-v2-0021': { x: 0.105, y: 0.40, width: 0.15, height: 0.435 },
      'id-v2-328': { x: 0.103, y: 0.26, width: 0.168, height: 0.145 },
    },
    uk_scene_35_city_square_lviv_rynok: {
      'id-v2-602': { x: 0.405, y: 0.08, width: 0.165, height: 0.475 },
      'id-v2-605': { x: 0.635, y: 0.00, width: 0.115, height: 0.56 },
      'id-v2-606': { x: 0.555, y: 0.375, width: 0.04, height: 0.215 },
      'id-v2-604': { x: 0.635, y: 0.00, width: 0.265, height: 0.58 },
      'id-v2-1328': { x: 0.75, y: 0.06, width: 0.12, height: 0.225 },
      'id-v2-1360': { x: 0.025, y: 0.48, width: 0.035, height: 0.12 },
      'pk-bench': { x: 0.405, y: 0.715, width: 0.23, height: 0.23 },
      'id-v2-1338': { x: 0.75, y: 0.435, width: 0.15, height: 0.255 },
      'id-v2-812': { x: 0.55, y: 0.635, width: 0.09, height: 0.275 },
      'id-v2-1335': { x: 0.675, y: 0.50, width: 0.06, height: 0.205 },
      'id-v2-1334': { x: 0.77, y: 0.305, width: 0.105, height: 0.495 },
      'id-v2-1333': { x: 0.925, y: 0.335, width: 0.055, height: 0.045 },
      'pk-bird': { x: 0.105, y: 0.635, width: 0.03, height: 0.04 },
      'cs-building': { x: 0.00, y: 0.00, width: 0.34, height: 0.64 },
      'id-v2-607': { x: 0.085, y: 0.355, width: 0.42, height: 0.50 },
      'id-v2-625': { x: 0.125, y: 0.40, width: 0.15, height: 0.12 },
      'id-v2-608': { x: 0.61, y: 0.70, width: 0.185, height: 0.16 },
      'id-v2-1352': { x: 0.45, y: 0.02, width: 0.025, height: 0.035 },
    },
    uk_scene_36_city_rainy_sidewalk: {
      'ext-v2-0027': { x: 0.25, y: 0.00, width: 0.25, height: 0.24 },
      'cs-sidewalk': { x: 0.255, y: 0.45, width: 0.68, height: 0.545 },
      'cs-road': { x: 0.00, y: 0.45, width: 0.39, height: 0.545 },
      'cs-pedestrian': { x: 0.535, y: 0.39, width: 0.10, height: 0.455 },
      'id-v2-612': { x: 0.00, y: 0.66, width: 0.33, height: 0.125 },
      'cs-car': { x: 0.225, y: 0.435, width: 0.15, height: 0.195 },
      'id-v2-624': { x: 0.775, y: 0.00, width: 0.10, height: 0.645 },
      'id-v2-1332': { x: 0.885, y: 0.00, width: 0.05, height: 0.82 },
      'id-v2-1218': { x: 0.73, y: 0.48, width: 0.04, height: 0.18 },
      'id-v2-245': { x: 0.935, y: 0.635, width: 0.062, height: 0.35 },
      'id-v2-631': { x: 0.915, y: 0.315, width: 0.08, height: 0.175 },
      'id-v2-620': { x: 0.395, y: 0.385, width: 0.028, height: 0.245 },
      'id-v2-630': { x: 0.65, y: 0.485, width: 0.22, height: 0.325 },
      'id-v2-1344': { x: 0.00, y: 0.86, width: 0.265, height: 0.06 },
      'id-v2-1529': { x: 0.53, y: 0.625, width: 0.035, height: 0.16 },
      'id-v2-874': { x: 0.52, y: 0.325, width: 0.14, height: 0.10 },
      'id-v2-1505': { x: 0.54, y: 0.395, width: 0.095, height: 0.32 },
      'id-v2-841': { x: 0.565, y: 0.715, width: 0.045, height: 0.13 },
    },
    uk_scene_37_city_winter_snow_street: {
      'ext-v2-0028': { x: 0.35, y: 0.65, width: 0.35, height: 0.34 },
      'id-v2-936': { x: 0.00, y: 0.00, width: 0.99, height: 0.16 },
      'id-v2-1076': { x: 0.14, y: 0.42, width: 0.165, height: 0.43 },
      'id-v2-381': { x: 0.045, y: 0.445, width: 0.095, height: 0.435 },
      'id-v2-1837': { x: 0.565, y: 0.80, width: 0.34, height: 0.19 },
      'id-v2-1073': { x: 0.305, y: 0.725, width: 0.175, height: 0.18 },
      'id-v2-1075': { x: 0.35, y: 0.64, width: 0.095, height: 0.135 },
      'id-v2-321': { x: 0.00, y: 0.12, width: 0.17, height: 0.45 },
      'id-v2-322': { x: 0.48, y: 0.12, width: 0.25, height: 0.14 },
      'id-v2-324': { x: 0.56, y: 0.06, width: 0.04, height: 0.12 },
      'id-v2-601': { x: 0.72, y: 0.05, width: 0.275, height: 0.66 },
      'id-v2-331': { x: 0.70, y: 0.54, width: 0.16, height: 0.19 },
      'id-v2-332': { x: 0.855, y: 0.53, width: 0.14, height: 0.28 },
      'id-v2-891': { x: 0.485, y: 0.23, width: 0.185, height: 0.44 },
      'id-v2-1613': { x: 0.625, y: 0.405, width: 0.075, height: 0.115 },
      'id-v2-615': { x: 0.415, y: 0.125, width: 0.065, height: 0.555 },
      'cs-road': { x: 0.28, y: 0.58, width: 0.68, height: 0.41 },
      'id-v2-1333': { x: 0.03, y: 0.30, width: 0.105, height: 0.065 },
    },
    uk_scene_38_public_transport_tram_trolleybus: {
      'id-v2-700': { x: 0.41, y: 0.33, width: 0.175, height: 0.28 },
      'pt-tram': { x: 0.00, y: 0.20, width: 0.395, height: 0.54 },
      'pt-ticket': { x: 0.535, y: 0.545, width: 0.03, height: 0.035 },
      'pt-stop': { x: 0.57, y: 0.19, width: 0.345, height: 0.56 },
      'id-v2-702': { x: 0.555, y: 0.45, width: 0.045, height: 0.125 },
      'id-v2-697': { x: 0.00, y: 0.68, width: 0.42, height: 0.315 },
      'id-v2-699': { x: 0.495, y: 0.425, width: 0.09, height: 0.175 },
      'id-v2-704': { x: 0.445, y: 0.525, width: 0.12, height: 0.165 },
      'id-v2-1345': { x: 0.62, y: 0.34, width: 0.095, height: 0.255 },
      'id-v2-1347': { x: 0.725, y: 0.34, width: 0.095, height: 0.24 },
      'pt-bus': { x: 0.355, y: 0.40, width: 0.075, height: 0.19 },
      'pt-doors': { x: 0.195, y: 0.35, width: 0.105, height: 0.345 },
      'cs-bicycle': { x: 0.785, y: 0.59, width: 0.195, height: 0.305 },
      'id-v2-1417': { x: 0.58, y: 0.74, width: 0.415, height: 0.255 },
      'id-v2-811': { x: 0.065, y: 0.375, width: 0.065, height: 0.125 },
      'cs-light': { x: 0.92, y: 0.20, width: 0.045, height: 0.165 },
      'cs-sign': { x: 0.87, y: 0.19, width: 0.055, height: 0.14 },
      'cs-sidewalk': { x: 0.42, y: 0.67, width: 0.35, height: 0.32 },
    },
    uk_scene_39_public_transport_kyiv_metro: {
      'pt-metro': { x: 0.00, y: 0.24, width: 0.37, height: 0.56 },
      'at-platform': { x: 0.15, y: 0.66, width: 0.56, height: 0.335 },
      'pt-seat': { x: 0.165, y: 0.52, width: 0.06, height: 0.11 },
      'id-v2-703': { x: 0.68, y: 0.57, width: 0.315, height: 0.39 },
      'id-v2-638': { x: 0.825, y: 0.525, width: 0.035, height: 0.045 },
      'id-v2-656': { x: 0.59, y: 0.40, width: 0.075, height: 0.415 },
      'id-v2-655': { x: 0.36, y: 0.15, width: 0.06, height: 0.085 },
      'id-v2-1350': { x: 0.555, y: 0.155, width: 0.035, height: 0.045 },
      'id-v2-807': { x: 0.895, y: 0.375, width: 0.09, height: 0.35 },
      'id-v2-790': { x: 0.73, y: 0.57, width: 0.075, height: 0.25 },
      'id-v2-791': { x: 0.39, y: 0.14, width: 0.21, height: 0.075 },
      'id-v2-1698': { x: 0.495, y: 0.41, width: 0.03, height: 0.04 },
      'id-v2-1091': { x: 0.455, y: 0.52, width: 0.035, height: 0.05 },
      'id-v2-1107': { x: 0.46, y: 0.565, width: 0.04, height: 0.05 },
      'id-v2-637': { x: 0.785, y: 0.27, width: 0.18, height: 0.29 },
      'id-v2-1334': { x: 0.28, y: 0.12, width: 0.115, height: 0.59 },
      'pk-bench': { x: 0.33, y: 0.595, width: 0.125, height: 0.135 },
      'pt-doors': { x: 0.13, y: 0.355, width: 0.11, height: 0.355 },
    },
    uk_scene_40_railway_station_ukrposhta_uz: {
      'ext-v2-0018': { x: 0.42, y: 0.00, width: 0.575, height: 0.52 },
      'at-train': { x: 0.00, y: 0.15, width: 0.48, height: 0.65 },
      'id-v2-690': { x: 0.34, y: 0.27, width: 0.15, height: 0.35 },
      'id-v2-691': { x: 0.00, y: 0.16, width: 0.35, height: 0.62 },
      'id-v2-694': { x: 0.275, y: 0.405, width: 0.085, height: 0.435 },
      'id-v2-692': { x: 0.01, y: 0.30, width: 0.145, height: 0.21 },
      'id-v2-1847': { x: 0.02, y: 0.33, width: 0.12, height: 0.14 },
      'at-board': { x: 0.48, y: 0.15, width: 0.225, height: 0.165 },
      'at-passenger': { x: 0.38, y: 0.38, width: 0.105, height: 0.47 },
      'at-suitcase': { x: 0.45, y: 0.62, width: 0.075, height: 0.25 },
      'at-luggage': { x: 0.56, y: 0.56, width: 0.155, height: 0.30 },
      'id-v2-1434': { x: 0.545, y: 0.52, width: 0.18, height: 0.385 },
      'id-v2-685': { x: 0.855, y: 0.34, width: 0.135, height: 0.48 },
      'id-v2-688': { x: 0.68, y: 0.30, width: 0.165, height: 0.35 },
      'id-v2-628': { x: 0.52, y: 0.35, width: 0.14, height: 0.26 },
      'id-v2-702': { x: 0.325, y: 0.53, width: 0.03, height: 0.045 },
      'pt-ticket': { x: 0.36, y: 0.52, width: 0.03, height: 0.035 },
      'at-platform': { x: 0.18, y: 0.68, width: 0.78, height: 0.315 },
    },
    uk_scene_41_airport_terminal_check_in: {
      'ext-v2-0019': { x: 0.00, y: 0.00, width: 0.995, height: 0.45 },
      'at-airplane': { x: 0.48, y: 0.25, width: 0.49, height: 0.28 },
      'id-v2-671': { x: 0.62, y: 0.40, width: 0.27, height: 0.085 },
      'id-v2-672': { x: 0.54, y: 0.45, width: 0.24, height: 0.095 },
      'id-v2-673': { x: 0.895, y: 0.49, width: 0.10, height: 0.34 },
      'id-v2-674': { x: 0.35, y: 0.35, width: 0.075, height: 0.38 },
      'id-v2-684': { x: 0.425, y: 0.37, width: 0.065, height: 0.36 },
      'id-v2-676': { x: 0.115, y: 0.685, width: 0.085, height: 0.095 },
      'id-v2-677': { x: 0.20, y: 0.695, width: 0.08, height: 0.08 },
      'id-v2-678': { x: 0.275, y: 0.69, width: 0.095, height: 0.08 },
      'id-v2-1840': { x: 0.61, y: 0.59, width: 0.08, height: 0.21 },
      'id-v2-680': { x: 0.38, y: 0.54, width: 0.155, height: 0.38 },
      'id-v2-681': { x: 0.695, y: 0.56, width: 0.205, height: 0.29 },
      'id-v2-1841': { x: 0.01, y: 0.29, width: 0.145, height: 0.36 },
      'id-v2-1842': { x: 0.73, y: 0.25, width: 0.21, height: 0.32 },
      'at-suitcase': { x: 0.405, y: 0.56, width: 0.10, height: 0.285 },
      'at-board': { x: 0.16, y: 0.06, width: 0.265, height: 0.19 },
      'at-passenger': { x: 0.25, y: 0.39, width: 0.095, height: 0.31 },
    },
    uk_scene_42_automotive_car_service: {
      'id-v2-726': { x: 0.835, y: 0.26, width: 0.155, height: 0.49 },
      'id-v2-725': { x: 0.72, y: 0.03, width: 0.275, height: 0.68 },
      'id-v2-722': { x: 0.16, y: 0.695, width: 0.13, height: 0.215 },
      'id-v2-723': { x: 0.295, y: 0.66, width: 0.085, height: 0.205 },
      'id-v2-724': { x: 0.535, y: 0.48, width: 0.095, height: 0.105 },
      'id-v2-719': { x: 0.635, y: 0.47, width: 0.145, height: 0.14 },
      'id-v2-713': { x: 0.455, y: 0.625, width: 0.105, height: 0.235 },
      'id-v2-714': { x: 0.45, y: 0.615, width: 0.115, height: 0.255 },
      'id-v2-715': { x: 0.365, y: 0.39, width: 0.06, height: 0.105 },
      'id-v2-712': { x: 0.00, y: 0.28, width: 0.155, height: 0.34 },
      'id-v2-716': { x: 0.56, y: 0.575, width: 0.085, height: 0.075 },
      'id-v2-720': { x: 0.51, y: 0.19, width: 0.265, height: 0.24 },
      'id-v2-721': { x: 0.065, y: 0.20, width: 0.175, height: 0.47 },
      'id-v2-1836': { x: 0.415, y: 0.43, width: 0.045, height: 0.055 },
      'id-v2-1427': { x: 0.66, y: 0.685, width: 0.11, height: 0.06 },
      'cs-car': { x: 0.07, y: 0.19, width: 0.75, height: 0.69 },
      'noun-klyuch-wrench': { x: 0.39, y: 0.85, width: 0.11, height: 0.085 },
      'cs-road': { x: 0.00, y: 0.62, width: 0.99, height: 0.375 },
    },
    uk_scene_43_hospital_clinic_consultation: {
      'hp-doctor': { x: 0.24, y: 0.13, width: 0.245, height: 0.60 },
      'ext-v2-0024': { x: 0.65, y: 0.16, width: 0.29, height: 0.82 },
      'ext-v2-0023': { x: 0.00, y: 0.00, width: 0.24, height: 0.62 },
      'hp-stethoscope': { x: 0.31, y: 0.32, width: 0.115, height: 0.21 },
      'hp-thermometer': { x: 0.435, y: 0.725, width: 0.075, height: 0.085 },
      'id-v2-999': { x: 0.23, y: 0.695, width: 0.185, height: 0.19 },
      'id-v2-1646': { x: 0.51, y: 0.51, width: 0.22, height: 0.275 },
      'id-v2-319': { x: 0.015, y: 0.79, width: 0.125, height: 0.165 },
      'id-v2-749': { x: 0.88, y: 0.32, width: 0.095, height: 0.205 },
      'id-v2-777': { x: 0.59, y: 0.625, width: 0.085, height: 0.115 },
      'id-v2-775': { x: 0.385, y: 0.39, width: 0.04, height: 0.065 },
      'id-v2-1477': { x: 0.525, y: 0.08, width: 0.12, height: 0.22 },
      'id-v2-773': { x: 0.84, y: 0.15, width: 0.135, height: 0.165 },
      'id-v2-1867': { x: 0.295, y: 0.05, width: 0.18, height: 0.28 },
      'id-v2-274': { x: 0.675, y: 0.03, width: 0.155, height: 0.44 },
      'of-computer': { x: 0.06, y: 0.495, width: 0.205, height: 0.265 },
      'k-chair': { x: 0.79, y: 0.46, width: 0.19, height: 0.52 },
      'id-v2-262': { x: 0.185, y: 0.055, width: 0.08, height: 0.145 },
    },
    uk_scene_44_hospital_first_aid_treatment: {
      'hp-nurse': { x: 0.34, y: 0.05, width: 0.25, height: 0.53 },
      'id-v2-320': { x: 0.14, y: 0.46, width: 0.185, height: 0.285 },
      'hp-bandage': { x: 0.32, y: 0.585, width: 0.105, height: 0.135 },
      'id-v2-1013': { x: 0.32, y: 0.725, width: 0.125, height: 0.115 },
      'id-v2-1001': { x: 0.445, y: 0.695, width: 0.125, height: 0.085 },
      'id-v2-1636': { x: 0.435, y: 0.59, width: 0.085, height: 0.10 },
      'id-v2-1643': { x: 0.535, y: 0.525, width: 0.10, height: 0.195 },
      'id-v2-1640': { x: 0.65, y: 0.19, width: 0.105, height: 0.54 },
      'id-v2-1641': { x: 0.71, y: 0.45, width: 0.185, height: 0.44 },
      'id-v2-1005': { x: 0.81, y: 0.39, width: 0.185, height: 0.53 },
      'id-v2-1948': { x: 0.56, y: 0.72, width: 0.125, height: 0.125 },
      'id-v2-1004': { x: 0.01, y: 0.50, width: 0.28, height: 0.44 },
      'id-v2-1631': { x: 0.04, y: 0.12, width: 0.09, height: 0.19 },
      'id-v2-1642': { x: 0.135, y: 0.12, width: 0.09, height: 0.19 },
      'id-v2-659': { x: 0.25, y: 0.21, width: 0.055, height: 0.215 },
      'id-v2-999': { x: 0.115, y: 0.75, width: 0.155, height: 0.135 },
      'hp-thermometer': { x: 0.275, y: 0.775, width: 0.055, height: 0.095 },
      'id-v2-1646': { x: 0.62, y: 0.625, width: 0.11, height: 0.125 },
    },
    uk_scene_45_pharmacy_apotheca: {
      'hp-pharmacy': { x: 0.01, y: 0.02, width: 0.27, height: 0.22 },
      'id-v2-797': { x: 0.34, y: 0.07, width: 0.28, height: 0.56 },
      'hp-medicine': { x: 0.62, y: 0.05, width: 0.36, height: 0.48 },
      'id-v2-1015': { x: 0.355, y: 0.76, width: 0.125, height: 0.115 },
      'id-v2-1635': { x: 0.465, y: 0.695, width: 0.12, height: 0.14 },
      'id-v2-1018': { x: 0.58, y: 0.555, width: 0.085, height: 0.24 },
      'id-v2-1019': { x: 0.675, y: 0.745, width: 0.125, height: 0.095 },
      'id-v2-1022': { x: 0.245, y: 0.735, width: 0.115, height: 0.13 },
      'id-v2-1012': { x: 0.435, y: 0.20, width: 0.07, height: 0.075 },
      'id-v2-1195': { x: 0.64, y: 0.695, width: 0.05, height: 0.105 },
      'id-v2-776': { x: 0.315, y: 0.665, width: 0.04, height: 0.095 },
      'id-v2-907': { x: 0.825, y: 0.505, width: 0.155, height: 0.20 },
      'id-v2-746': { x: 0.145, y: 0.74, width: 0.115, height: 0.125 },
      'id-v2-1451': { x: 0.085, y: 0.585, width: 0.07, height: 0.18 },
      'cl-pen': { x: 0.205, y: 0.75, width: 0.055, height: 0.075 },
      'id-v2-862': { x: 0.43, y: 0.155, width: 0.075, height: 0.045 },
      'hp-bandage': { x: 0.75, y: 0.665, width: 0.075, height: 0.105 },
      'hp-thermometer': { x: 0.805, y: 0.75, width: 0.11, height: 0.085 },
    },
    uk_scene_46_dental_and_optics_clinic: {
      'id-v2-798': { x: 0.08, y: 0.11, width: 0.215, height: 0.61 },
      'id-v2-1030': { x: 0.225, y: 0.37, width: 0.09, height: 0.12 },
      'id-v2-1029': { x: 0.185, y: 0.66, width: 0.11, height: 0.105 },
      'id-v2-1026': { x: 0.03, y: 0.56, width: 0.155, height: 0.22 },
      'id-v2-1530': { x: 0.53, y: 0.675, width: 0.11, height: 0.095 },
      'id-v2-1896': { x: 0.65, y: 0.665, width: 0.085, height: 0.10 },
      'id-v2-786': { x: 0.625, y: 0.745, width: 0.09, height: 0.08 },
      'id-v2-778': { x: 0.715, y: 0.735, width: 0.075, height: 0.07 },
      'dr-glass': { x: 0.31, y: 0.545, width: 0.04, height: 0.085 },
      'id-v2-276': { x: 0.76, y: 0.505, width: 0.085, height: 0.235 },
      'id-v2-1756': { x: 0.455, y: 0.44, width: 0.09, height: 0.44 },
      'id-v2-1161': { x: 0.84, y: 0.59, width: 0.09, height: 0.18 },
      'ext-v2-0016': { x: 0.96, y: 0.49, width: 0.035, height: 0.055 },
      'id-v2-1453': { x: 0.38, y: 0.875, width: 0.12, height: 0.08 },
      'id-v2-769': { x: 0.56, y: 0.755, width: 0.065, height: 0.055 },
      'id-v2-862': { x: 0.655, y: 0.24, width: 0.20, height: 0.34 },
      'bd-mirror': { x: 0.555, y: 0.48, width: 0.095, height: 0.20 },
      'ba-toothbrush': { x: 0.295, y: 0.665, width: 0.055, height: 0.105 },
    },
    uk_scene_47_portrait_human_face_features: {
      'id-v2-1024': { x: 0.34, y: 0.16, width: 0.195, height: 0.42 },
      'id-v2-1023': { x: 0.525, y: 0.02, width: 0.215, height: 0.59 },
      'id-v2-1025': { x: 0.53, y: 0.02, width: 0.195, height: 0.23 },
      'id-v2-1499': { x: 0.295, y: 0.42, width: 0.085, height: 0.56 },
      'ext-v2-0008': { x: 0.38, y: 0.275, width: 0.065, height: 0.04 },
      'id-v2-1028': { x: 0.425, y: 0.32, width: 0.05, height: 0.115 },
      'ext-v2-0009': { x: 0.405, y: 0.445, width: 0.08, height: 0.065 },
      'ext-v2-0010': { x: 0.355, y: 0.35, width: 0.065, height: 0.11 },
      'id-v2-1027': { x: 0.715, y: 0.245, width: 0.03, height: 0.125 },
      'id-v2-1031': { x: 0.36, y: 0.52, width: 0.105, height: 0.13 },
      'id-v2-1497': { x: 0.545, y: 0.37, width: 0.175, height: 0.24 },
      'id-v2-1498': { x: 0.565, y: 0.38, width: 0.12, height: 0.055 },
      'id-v2-1516': { x: 0.315, y: 0.83, width: 0.065, height: 0.095 },
      'id-v2-866': { x: 0.335, y: 0.345, width: 0.025, height: 0.11 },
      'id-v2-304': { x: 0.17, y: 0.40, width: 0.08, height: 0.31 },
      'id-v2-1026': { x: 0.39, y: 0.31, width: 0.045, height: 0.04 },
      'id-v2-1029': { x: 0.58, y: 0.41, width: 0.09, height: 0.06 },
      'id-v2-1030': { x: 0.41, y: 0.455, width: 0.065, height: 0.04 },
    },
    uk_scene_48_portrait_human_body_posture: {
      'id-v2-1032': { x: 0.34, y: 0.16, width: 0.075, height: 0.13 },
      'id-v2-1035': { x: 0.295, y: 0.16, width: 0.095, height: 0.29 },
      'ext-v2-0007': { x: 0.665, y: 0.495, width: 0.06, height: 0.09 },
      'id-v2-1033': { x: 0.67, y: 0.365, width: 0.125, height: 0.12 },
      'ext-v2-0011': { x: 0.37, y: 0.33, width: 0.045, height: 0.075 },
      'id-v2-1034': { x: 0.40, y: 0.525, width: 0.055, height: 0.095 },
      'id-v2-1036': { x: 0.40, y: 0.59, width: 0.07, height: 0.33 },
      'id-v2-1037': { x: 0.76, y: 0.61, width: 0.05, height: 0.09 },
      'id-v2-864': { x: 0.405, y: 0.49, width: 0.03, height: 0.04 },
      'id-v2-868': { x: 0.41, y: 0.515, width: 0.03, height: 0.025 },
      'id-v2-1662': { x: 0.355, y: 0.43, width: 0.028, height: 0.065 },
      'id-v2-1657': { x: 0.095, y: 0.735, width: 0.85, height: 0.26 },
      'id-v2-1659': { x: 0.015, y: 0.635, width: 0.05, height: 0.22 },
      'id-v2-1652': { x: 0.05, y: 0.00, width: 0.18, height: 0.835 },
      'id-v2-1049': { x: 0.215, y: 0.55, width: 0.135, height: 0.25 },
      'id-v2-1023': { x: 0.355, y: 0.015, width: 0.07, height: 0.16 },
      'id-v2-1031': { x: 0.69, y: 0.32, width: 0.035, height: 0.05 },
      'id-v2-840': { x: 0.40, y: 0.88, width: 0.10, height: 0.095 },
    },
    uk_scene_49_school_classroom_lesson: {
      'cl-teacher': { x: 0.40, y: 0.315, width: 0.095, height: 0.43 },
      'cl-student': { x: 0.16, y: 0.465, width: 0.145, height: 0.48 },
      'id-v2-792': { x: 0.70, y: 0.465, width: 0.125, height: 0.48 },
      'id-v2-793': { x: 0.76, y: 0.48, width: 0.16, height: 0.51 },
      'cl-board': { x: 0.355, y: 0.245, width: 0.305, height: 0.26 },
      'id-v2-735': { x: 0.475, y: 0.41, width: 0.022, height: 0.03 },
      'id-v2-737': { x: 0.475, y: 0.485, width: 0.025, height: 0.022 },
      'cl-desk': { x: 0.515, y: 0.635, width: 0.36, height: 0.36 },
      'id-v2-742': { x: 0.605, y: 0.075, width: 0.115, height: 0.15 },
      'id-v2-1436': { x: 0.665, y: 0.22, width: 0.25, height: 0.30 },
      'id-v2-739': { x: 0.785, y: 0.05, width: 0.08, height: 0.10 },
      'id-v2-1354': { x: 0.53, y: 0.085, width: 0.042, height: 0.105 },
      'id-v2-1751': { x: 0.095, y: 0.21, width: 0.055, height: 0.27 },
      'ext-v2-0022': { x: 0.00, y: 0.12, width: 0.18, height: 0.38 },
      'id-v2-345': { x: 0.33, y: 0.72, width: 0.18, height: 0.27 },
      'id-v2-741': { x: 0.595, y: 0.53, width: 0.08, height: 0.185 },
      'cl-backpack': { x: 0.295, y: 0.74, width: 0.085, height: 0.24 },
      'k-chair': { x: 0.475, y: 0.675, width: 0.145, height: 0.32 },
    },
    uk_scene_50_school_desk_stationery: {
      'id-v2-743': { x: 0.235, y: 0.035, width: 0.29, height: 0.34 },
      'id-v2-744': { x: 0.09, y: 0.32, width: 0.28, height: 0.345 },
      'id-v2-747': { x: 0.425, y: 0.125, width: 0.435, height: 0.435 },
      'id-v2-758': { x: 0.63, y: 0.515, width: 0.048, height: 0.07 },
      'id-v2-757': { x: 0.685, y: 0.55, width: 0.082, height: 0.085 },
      'id-v2-759': { x: 0.53, y: 0.59, width: 0.135, height: 0.295 },
      'id-v2-755': { x: 0.605, y: 0.615, width: 0.098, height: 0.285 },
      'id-v2-756': { x: 0.655, y: 0.66, width: 0.095, height: 0.25 },
      'id-v2-736': { x: 0.718, y: 0.66, width: 0.095, height: 0.29 },
      'id-v2-764': { x: 0.798, y: 0.51, width: 0.122, height: 0.155 },
      'id-v2-765': { x: 0.785, y: 0.63, width: 0.11, height: 0.095 },
      'id-v2-767': { x: 0.835, y: 0.295, width: 0.06, height: 0.225 },
      'id-v2-1452': { x: 0.88, y: 0.345, width: 0.07, height: 0.215 },
      'id-v2-766': { x: 0.785, y: 0.725, width: 0.105, height: 0.25 },
      'id-v2-1443': { x: 0.038, y: 0.265, width: 0.215, height: 0.28 },
      'cl-notebook': { x: 0.255, y: 0.405, width: 0.345, height: 0.44 },
      'cl-pen': { x: 0.462, y: 0.505, width: 0.115, height: 0.275 },
      'cl-pencil': { x: 0.50, y: 0.52, width: 0.12, height: 0.315 },
    },
    uk_scene_51_school_science_laboratory: {
      'id-v2-1727': { x: 0.095, y: 0.205, width: 0.225, height: 0.60 },
      'id-v2-787': { x: 0.292, y: 0.815, width: 0.085, height: 0.08 },
      'id-v2-951': { x: 0.362, y: 0.578, width: 0.095, height: 0.175 },
      'id-v2-1715': { x: 0.642, y: 0.225, width: 0.145, height: 0.37 },
      'id-v2-1993': { x: 0.795, y: 0.51, width: 0.12, height: 0.095 },
      'id-v2-1735': { x: 0.575, y: 0.605, width: 0.20, height: 0.09 },
      'id-v2-1729': { x: 0.912, y: 0.27, width: 0.082, height: 0.34 },
      'id-v2-1690': { x: 0.585, y: 0.68, width: 0.255, height: 0.175 },
      'id-v2-1691': { x: 0.682, y: 0.68, width: 0.075, height: 0.095 },
      'id-v2-1692': { x: 0.615, y: 0.825, width: 0.058, height: 0.05 },
      'id-v2-1693': { x: 0.685, y: 0.83, width: 0.17, height: 0.085 },
      'id-v2-898': { x: 0.00, y: 0.29, width: 0.165, height: 0.305 },
      'id-v2-906': { x: 0.268, y: 0.32, width: 0.145, height: 0.375 },
      'id-v2-889': { x: 0.39, y: 0.745, width: 0.195, height: 0.165 },
      'id-v2-1056': { x: 0.875, y: 0.06, width: 0.078, height: 0.225 },
      'id-v2-778': { x: 0.228, y: 0.45, width: 0.105, height: 0.345 },
      'id-v2-786': { x: 0.212, y: 0.775, width: 0.142, height: 0.10 },
      'id-v2-741': { x: 0.445, y: 0.365, width: 0.142, height: 0.34 },
    },
    uk_scene_52_library_reading_hall: {
      'lb-library': { x: 0.25, y: 0.00, width: 0.50, height: 0.22 },
      'id-v2-801': { x: 0.16, y: 0.435, width: 0.09, height: 0.21 },
      'id-v2-800': { x: 0.545, y: 0.515, width: 0.17, height: 0.48 },
      'lb-shelf': { x: 0.00, y: 0.23, width: 0.175, height: 0.39 },
      'id-v2-745': { x: 0.462, y: 0.702, width: 0.10, height: 0.065 },
      'of-laptop': { x: 0.595, y: 0.658, width: 0.102, height: 0.105 },
      'id-v2-771': { x: 0.075, y: 0.495, width: 0.145, height: 0.18 },
      'id-v2-772': { x: 0.00, y: 0.59, width: 0.142, height: 0.405 },
      'id-v2-1819': { x: 0.46, y: 0.215, width: 0.108, height: 0.32 },
      'id-v2-1116': { x: 0.47, y: 0.75, width: 0.118, height: 0.08 },
      'id-v2-325': { x: 0.845, y: 0.155, width: 0.155, height: 0.52 },
      'id-v2-326': { x: 0.895, y: 0.32, width: 0.10, height: 0.26 },
      'id-v2-327': { x: 0.845, y: 0.155, width: 0.15, height: 0.32 },
      'id-v2-201': { x: 0.742, y: 0.655, width: 0.038, height: 0.11 },
      'id-v2-279': { x: 0.442, y: 0.485, width: 0.016, height: 0.025 },
      'cl-book': { x: 0.595, y: 0.75, width: 0.148, height: 0.065 },
      'id-v2-250': { x: 0.695, y: 0.525, width: 0.085, height: 0.258 },
      'id-v2-1092': { x: 0.605, y: 0.515, width: 0.06, height: 0.075 },
    },
    uk_scene_53_office_it_coworking_kyiv: {
      'id-v2-1086': { x: 0.258, y: 0.568, width: 0.084, height: 0.24 },
      'id-v2-1696': { x: 0.342, y: 0.83, width: 0.145, height: 0.078 },
      'id-v2-1095': { x: 0.412, y: 0.512, width: 0.032, height: 0.025 },
      'id-v2-1094': { x: 0.465, y: 0.55, width: 0.178, height: 0.215 },
      'id-v2-774': { x: 0.025, y: 0.08, width: 0.128, height: 0.56 },
      'id-v2-1105': { x: 0.778, y: 0.505, width: 0.025, height: 0.032 },
      'id-v2-1104': { x: 0.76, y: 0.428, width: 0.042, height: 0.108 },
      'id-v2-1478': { x: 0.592, y: 0.798, width: 0.032, height: 0.058 },
      'id-v2-629': { x: 0.818, y: 0.11, width: 0.142, height: 0.81 },
      'id-v2-1831': { x: 0.966, y: 0.508, width: 0.022, height: 0.105 },
      'id-v2-1669': { x: 0.692, y: 0.298, width: 0.054, height: 0.095 },
      'id-v2-1666': { x: 0.648, y: 0.475, width: 0.128, height: 0.158 },
      'id-v2-1665': { x: 0.692, y: 0.48, width: 0.028, height: 0.025 },
      'id-v2-203': { x: 0.565, y: 0.65, width: 0.03, height: 0.165 },
      'id-v2-204': { x: 0.204, y: 0.805, width: 0.074, height: 0.09 },
      'of-computer': { x: 0.346, y: 0.525, width: 0.17, height: 0.30 },
      'of-mouse': { x: 0.512, y: 0.80, width: 0.028, height: 0.045 },
      'of-printer': { x: 0.052, y: 0.535, width: 0.205, height: 0.325 },
    },
    uk_scene_54_office_electronics_accessories: {
      'id-v2-1712': { x: 0.275, y: 0.688, width: 0.052, height: 0.075 },
      'id-v2-280': { x: 0.752, y: 0.278, width: 0.048, height: 0.098 },
      'id-v2-282': { x: 0.394, y: 0.634, width: 0.23, height: 0.095 },
      'id-v2-283': { x: 0.526, y: 0.618, width: 0.025, height: 0.058 },
      'id-v2-1966': { x: 0.548, y: 0.574, width: 0.056, height: 0.108 },
      'id-v2-1713': { x: 0.362, y: 0.39, width: 0.154, height: 0.22 },
      'id-v2-1980': { x: 0.408, y: 0.732, width: 0.074, height: 0.092 },
      'id-v2-1968': { x: 0.548, y: 0.224, width: 0.12, height: 0.328 },
      'id-v2-1725': { x: 0.636, y: 0.434, width: 0.182, height: 0.222 },
      'id-v2-1714': { x: 0.158, y: 0.212, width: 0.286, height: 0.31 },
      'id-v2-310': { x: 0.648, y: 0.638, width: 0.098, height: 0.178 },
      'id-v2-200': { x: 0.824, y: 0.508, width: 0.174, height: 0.20 },
      'id-v2-199': { x: 0.754, y: 0.686, width: 0.151, height: 0.112 },
      'id-v2-595': { x: 0.795, y: 0.605, width: 0.095, height: 0.145 },
      'id-v2-179': { x: 0.88, y: 0.772, width: 0.086, height: 0.106 },
      'id-v2-1089': { x: 0.062, y: 0.705, width: 0.235, height: 0.278 },
      'id-v2-1096': { x: 0.136, y: 0.402, width: 0.205, height: 0.298 },
      'id-v2-1097': { x: 0.325, y: 0.775, width: 0.064, height: 0.062 },
    },
    uk_scene_55_post_office_ukrposhta: {
      'id-v2-1484': { x: 0.428, y: 0.152, width: 0.185, height: 0.54 },
      'id-v2-633': { x: 0.288, y: 0.632, width: 0.168, height: 0.198 },
      'id-v2-634': { x: 0.325, y: 0.772, width: 0.178, height: 0.162 },
      'id-v2-635': { x: 0.398, y: 0.845, width: 0.172, height: 0.152 },
      'id-v2-636': { x: 0.535, y: 0.805, width: 0.128, height: 0.122 },
      'id-v2-409': { x: 0.582, y: 0.152, width: 0.142, height: 0.45 },
      'id-v2-632': { x: 0.738, y: 0.165, width: 0.26, height: 0.43 },
      'id-v2-163': { x: 0.655, y: 0.368, width: 0.172, height: 0.362 },
      'id-v2-708': { x: 0.16, y: 0.315, width: 0.142, height: 0.20 },
      'id-v2-707': { x: 0.245, y: 0.222, width: 0.112, height: 0.215 },
      'id-v2-343': { x: 0.165, y: 0.605, width: 0.235, height: 0.152 },
      'id-v2-347': { x: 0.388, y: 0.01, width: 0.17, height: 0.38 },
      'id-v2-1174': { x: 0.635, y: 0.532, width: 0.025, height: 0.142 },
      'id-v2-241': { x: 0.045, y: 0.515, width: 0.052, height: 0.24 },
      'id-v2-246': { x: 0.08, y: 0.595, width: 0.082, height: 0.145 },
      'id-v2-776': { x: 0.525, y: 0.585, width: 0.032, height: 0.085 },
      'noun-arkush-sheet': { x: 0.585, y: 0.72, width: 0.202, height: 0.175 },
      'id-v2-763': { x: 0.702, y: 0.722, width: 0.105, height: 0.08 },
    },
    uk_scene_56_bank_and_administrative_center: {
      'id-v2-411': { x: 0.878, y: 0.58, width: 0.12, height: 0.222 },
      'id-v2-408': { x: 0.365, y: 0.702, width: 0.045, height: 0.098 },
      'id-v2-865': { x: 0.652, y: 0.625, width: 0.022, height: 0.03 },
      'id-v2-658': { x: 0.72, y: 0.245, width: 0.168, height: 0.135 },
      'id-v2-1348': { x: 0.898, y: 0.285, width: 0.085, height: 0.13 },
      'id-v2-236': { x: 0.035, y: 0.575, width: 0.068, height: 0.195 },
      'id-v2-244': { x: 0.542, y: 0.785, width: 0.068, height: 0.062 },
      'id-v2-346': { x: 0.105, y: 0.71, width: 0.21, height: 0.28 },
      'id-v2-808': { x: 0.158, y: 0.21, width: 0.062, height: 0.355 },
      'id-v2-809': { x: 0.205, y: 0.215, width: 0.058, height: 0.38 },
      'id-v2-810': { x: 0.242, y: 0.258, width: 0.058, height: 0.395 },
      'id-v2-802': { x: 0.284, y: 0.23, width: 0.075, height: 0.498 },
      'id-v2-1490': { x: 0.345, y: 0.24, width: 0.095, height: 0.52 },
      'id-v2-1482': { x: 0.538, y: 0.335, width: 0.172, height: 0.358 },
      'id-v2-1500': { x: 0.602, y: 0.335, width: 0.085, height: 0.088 },
      'id-v2-749': { x: 0.374, y: 0.768, width: 0.175, height: 0.205 },
      'id-v2-1867': { x: 0.475, y: 0.648, width: 0.076, height: 0.112 },
      'id-v2-649': { x: 0.586, y: 0.75, width: 0.046, height: 0.04 },
    },
    uk_scene_57_park_shevchenko_autumn: {
      'id-v2-960': { x: 0.21, y: 0.57, width: 0.20, height: 0.35 },
      'id-v2-1598': { x: 0.33, y: 0.63, width: 0.04, height: 0.06 },
      'id-v2-1599': { x: 0.00, y: 0.47, width: 0.34, height: 0.21 },
      'noun-lystok-leaf': { x: 0.06, y: 0.85, width: 0.09, height: 0.11 },
      'id-v2-883': { x: 0.00, y: 0.72, width: 0.22, height: 0.25 },
      'id-v2-890': { x: 0.20, y: 0.00, width: 0.17, height: 0.72 },
      'id-v2-1915': { x: 0.27, y: 0.31, width: 0.04, height: 0.13 },
      'id-v2-976': { x: 0.24, y: 0.21, width: 0.06, height: 0.11 },
      'id-v2-390': { x: 0.33, y: 0.03, width: 0.07, height: 0.17 },
      'id-v2-1612': { x: 0.38, y: 0.08, width: 0.035, height: 0.05 },
      'pk-bush': { x: 0.37, y: 0.37, width: 0.15, height: 0.24 },
      'pk-grass': { x: 0.11, y: 0.53, width: 0.44, height: 0.22 },
      'id-v2-987': { x: 0.50, y: 0.46, width: 0.035, height: 0.05 },
      'pk-bench': { x: 0.51, y: 0.50, width: 0.19, height: 0.26 },
      'id-v2-1356': { x: 0.58, y: 0.30, width: 0.16, height: 0.25 },
      'id-v2-615': { x: 0.76, y: 0.12, width: 0.035, height: 0.47 },
      'id-v2-1538': { x: 0.54, y: 0.00, width: 0.45, height: 0.55 },
      'pk-path': { x: 0.27, y: 0.51, width: 0.73, height: 0.49 },
    },
    uk_scene_58_botanical_garden_flowers: {
      'id-v2-905': { x: 0.09, y: 0.13, width: 0.15, height: 0.26 },
      'id-v2-991': { x: 0.18, y: 0.24, width: 0.05, height: 0.07 },
      'id-v2-908': { x: 0.01, y: 0.47, width: 0.14, height: 0.18 },
      'id-v2-1561': { x: 0.01, y: 0.62, width: 0.23, height: 0.24 },
      'id-v2-910': { x: 0.02, y: 0.85, width: 0.37, height: 0.14 },
      'id-v2-904': { x: 0.21, y: 0.32, width: 0.22, height: 0.28 },
      'pk-flower': { x: 0.25, y: 0.61, width: 0.11, height: 0.18 },
      'id-v2-901': { x: 0.29, y: 0.72, width: 0.05, height: 0.07 },
      'id-v2-1552': { x: 0.39, y: 0.58, width: 0.08, height: 0.16 },
      'id-v2-992': { x: 0.41, y: 0.62, width: 0.05, height: 0.08 },
      'id-v2-1563': { x: 0.32, y: 0.64, width: 0.30, height: 0.30 },
      'id-v2-896': { x: 0.28, y: 0.01, width: 0.31, height: 0.37 },
      'id-v2-1543': { x: 0.43, y: 0.36, width: 0.14, height: 0.25 },
      'id-v2-1544': { x: 0.54, y: 0.36, width: 0.16, height: 0.31 },
      'id-v2-1581': { x: 0.73, y: 0.06, width: 0.27, height: 0.31 },
      'id-v2-1487': { x: 0.83, y: 0.21, width: 0.10, height: 0.33 },
      'id-v2-1560': { x: 0.65, y: 0.79, width: 0.21, height: 0.21 },
      'id-v2-912': { x: 0.90, y: 0.74, width: 0.08, height: 0.10 },
    },
    uk_scene_59_backyard_garden_tools: {
      'id-v2-386': { x: 0.01, y: 0.61, width: 0.25, height: 0.32 },
      'id-v2-1582': { x: 0.05, y: 0.56, width: 0.38, height: 0.29 },
      'id-v2-381': { x: 0.30, y: 0.49, width: 0.05, height: 0.37 },
      'id-v2-382': { x: 0.31, y: 0.42, width: 0.09, height: 0.42 },
      'id-v2-1931': { x: 0.35, y: 0.49, width: 0.09, height: 0.33 },
      'id-v2-1585': { x: 0.47, y: 0.38, width: 0.05, height: 0.15 },
      'id-v2-387': { x: 0.48, y: 0.43, width: 0.16, height: 0.31 },
      'id-v2-384': { x: 0.62, y: 0.63, width: 0.05, height: 0.04 },
      'id-v2-388': { x: 0.59, y: 0.70, width: 0.10, height: 0.14 },
      'id-v2-385': { x: 0.58, y: 0.82, width: 0.11, height: 0.09 },
      'id-v2-1929': { x: 0.51, y: 0.88, width: 0.10, height: 0.07 },
      'id-v2-394': { x: 0.70, y: 0.35, width: 0.20, height: 0.16 },
      'id-v2-331': { x: 0.00, y: 0.31, width: 0.31, height: 0.11 },
      'id-v2-421': { x: 0.71, y: 0.74, width: 0.07, height: 0.09 },
      'id-v2-425': { x: 0.78, y: 0.76, width: 0.07, height: 0.09 },
      'fm-pear': { x: 0.84, y: 0.71, width: 0.08, height: 0.09 },
      'id-v2-428': { x: 0.86, y: 0.77, width: 0.07, height: 0.08 },
      'id-v2-1797': { x: 0.88, y: 0.81, width: 0.08, height: 0.10 },
    },
    uk_scene_60_playground_family_courtyard: {
      'pg-sandbox': { x: 0.00, y: 0.67, width: 0.39, height: 0.27 },
      'pg-ball': { x: 0.03, y: 0.73, width: 0.05, height: 0.08 },
      'pg-child': { x: 0.21, y: 0.63, width: 0.07, height: 0.16 },
      'id-v2-1687': { x: 0.27, y: 0.71, width: 0.12, height: 0.19 },
      'id-v2-1688': { x: 0.40, y: 0.69, width: 0.12, height: 0.18 },
      'id-v2-1686': { x: 0.52, y: 0.62, width: 0.11, height: 0.27 },
      'pg-swing': { x: 0.11, y: 0.28, width: 0.12, height: 0.31 },
      'id-v2-1685': { x: 0.31, y: 0.29, width: 0.07, height: 0.26 },
      'pg-slide': { x: 0.43, y: 0.23, width: 0.15, height: 0.36 },
      'id-v2-1684': { x: 0.40, y: 0.54, width: 0.15, height: 0.12 },
      'id-v2-1083': { x: 0.52, y: 0.57, width: 0.18, height: 0.17 },
      'id-v2-1682': { x: 0.66, y: 0.28, width: 0.21, height: 0.33 },
      'id-v2-398': { x: 0.72, y: 0.49, width: 0.10, height: 0.21 },
      'id-v2-794': { x: 0.81, y: 0.49, width: 0.05, height: 0.12 },
      'pk-bench': { x: 0.83, y: 0.53, width: 0.10, height: 0.16 },
      'cs-bicycle': { x: 0.71, y: 0.58, width: 0.29, height: 0.35 },
      'id-v2-1341': { x: 0.88, y: 0.76, width: 0.12, height: 0.24 },
      'id-v2-600': { x: 0.00, y: 0.00, width: 0.59, height: 0.48 },
    },
    uk_scene_61_gym_fitness_studio: {
      'gm-treadmill': { x: 0.03, y: 0.36, width: 0.34, height: 0.53 },
      'gm-bottle': { x: 0.085, y: 0.57, width: 0.025, height: 0.09 },
      'id-v2-1040': { x: 0.25, y: 0.39, width: 0.17, height: 0.40 },
      'id-v2-296': { x: 0.28, y: 0.46, width: 0.04, height: 0.11 },
      'id-v2-1047': { x: 0.33, y: 0.15, width: 0.12, height: 0.13 },
      'id-v2-1683': { x: 0.41, y: 0.01, width: 0.06, height: 0.70 },
      'gm-machine': { x: 0.45, y: 0.28, width: 0.11, height: 0.39 },
      'gm-barbell': { x: 0.52, y: 0.34, width: 0.27, height: 0.12 },
      'id-v2-1659': { x: 0.32, y: 0.77, width: 0.26, height: 0.18 },
      'gm-dumbbell': { x: 0.48, y: 0.82, width: 0.10, height: 0.10 },
      'id-v2-1044': { x: 0.59, y: 0.76, width: 0.05, height: 0.13 },
      'id-v2-1050': { x: 0.58, y: 0.89, width: 0.10, height: 0.08 },
      'id-v2-1049': { x: 0.65, y: 0.63, width: 0.14, height: 0.25 },
      'id-v2-1419': { x: 0.69, y: 0.60, width: 0.06, height: 0.34 },
      'id-v2-1052': { x: 0.81, y: 0.17, width: 0.05, height: 0.39 },
      'id-v2-1053': { x: 0.91, y: 0.21, width: 0.065, height: 0.21 },
      'id-v2-1057': { x: 0.89, y: 0.50, width: 0.08, height: 0.17 },
      'id-v2-1055': { x: 0.88, y: 0.68, width: 0.11, height: 0.06 },
    },
    uk_scene_62_sports_stadium_court: {
      'id-v2-1066': { x: 0.00, y: 0.49, width: 0.24, height: 0.23 },
      'id-v2-1061': { x: 0.10, y: 0.75, width: 0.16, height: 0.11 },
      'id-v2-1063': { x: 0.11, y: 0.85, width: 0.04, height: 0.05 },
      'id-v2-1067': { x: 0.26, y: 0.69, width: 0.10, height: 0.28 },
      'id-v2-840': { x: 0.27, y: 0.84, width: 0.12, height: 0.09 },
      'id-v2-1064': { x: 0.24, y: 0.36, width: 0.16, height: 0.15 },
      'pg-ball': { x: 0.36, y: 0.54, width: 0.02, height: 0.035 },
      'id-v2-1491': { x: 0.41, y: 0.37, width: 0.04, height: 0.20 },
      'id-v2-1671': { x: 0.46, y: 0.64, width: 0.17, height: 0.14 },
      'id-v2-1672': { x: 0.52, y: 0.55, width: 0.035, height: 0.21 },
      'id-v2-1056': { x: 0.60, y: 0.48, width: 0.035, height: 0.11 },
      'id-v2-1085': { x: 0.52, y: 0.06, width: 0.06, height: 0.09 },
      'id-v2-1065': { x: 0.64, y: 0.25, width: 0.04, height: 0.06 },
      'id-v2-1071': { x: 0.71, y: 0.60, width: 0.06, height: 0.07 },
      'id-v2-1072': { x: 0.77, y: 0.63, width: 0.06, height: 0.07 },
      'id-v2-711': { x: 0.72, y: 0.54, width: 0.21, height: 0.45 },
      'id-v2-1420': { x: 0.85, y: 0.80, width: 0.05, height: 0.06 },
      'id-v2-1418': { x: 0.88, y: 0.61, width: 0.10, height: 0.18 },
    },
    uk_scene_63_swimming_pool_and_winter_rink: {
      'id-v2-1077': { x: 0.00, y: 0.43, width: 0.34, height: 0.26 },
      'id-v2-1676': { x: 0.04, y: 0.53, width: 0.09, height: 0.21 },
      'id-v2-1680': { x: 0.18, y: 0.56, width: 0.13, height: 0.09 },
      'id-v2-1080': { x: 0.02, y: 0.73, width: 0.13, height: 0.14 },
      'id-v2-1681': { x: 0.15, y: 0.75, width: 0.06, height: 0.07 },
      'id-v2-837': { x: 0.21, y: 0.75, width: 0.13, height: 0.11 },
      'id-v2-1521': { x: 0.33, y: 0.74, width: 0.05, height: 0.05 },
      'id-v2-686': { x: 0.37, y: 0.74, width: 0.09, height: 0.24 },
      'id-v2-284': { x: 0.42, y: 0.21, width: 0.14, height: 0.45 },
      'id-v2-285': { x: 0.48, y: 0.23, width: 0.06, height: 0.10 },
      'id-v2-1160': { x: 0.56, y: 0.27, width: 0.05, height: 0.28 },
      'id-v2-296': { x: 0.565, y: 0.36, width: 0.03, height: 0.12 },
      'id-v2-1068': { x: 0.65, y: 0.14, width: 0.16, height: 0.60 },
      'id-v2-1069': { x: 0.73, y: 0.69, width: 0.04, height: 0.04 },
      'id-v2-1073': { x: 0.73, y: 0.25, width: 0.06, height: 0.43 },
      'id-v2-1075': { x: 0.78, y: 0.32, width: 0.07, height: 0.39 },
      'id-v2-657': { x: 0.90, y: 0.21, width: 0.08, height: 0.11 },
      'id-v2-1070': { x: 0.88, y: 0.49, width: 0.10, height: 0.15 },
    },
    uk_scene_64_countryside_ukrainian_village_yard: {
      'id-v2-941': { x: 0.08, y: 0.21, width: 0.28, height: 0.65 },
      'id-v2-1923': { x: 0.05, y: 0.80, width: 0.19, height: 0.14 },
      'id-v2-331': { x: 0.00, y: 0.56, width: 0.54, height: 0.26 },
      'id-v2-1183': { x: 0.02, y: 0.57, width: 0.09, height: 0.07 },
      'id-v2-905': { x: 0.19, y: 0.39, width: 0.23, height: 0.18 },
      'id-v2-1488': { x: 0.29, y: 0.45, width: 0.09, height: 0.39 },
      'id-v2-1562': { x: 0.41, y: 0.39, width: 0.13, height: 0.20 },
      'id-v2-1596': { x: 0.40, y: 0.65, width: 0.10, height: 0.15 },
      'id-v2-1588': { x: 0.55, y: 0.50, width: 0.05, height: 0.11 },
      'id-v2-1587': { x: 0.63, y: 0.38, width: 0.02, height: 0.03 },
      'id-v2-1595': { x: 0.64, y: 0.69, width: 0.13, height: 0.18 },
      'id-v2-543': { x: 0.61, y: 0.81, width: 0.07, height: 0.12 },
      'id-v2-1610': { x: 0.77, y: 0.09, width: 0.07, height: 0.07 },
      'id-v2-984': { x: 0.78, y: 0.03, width: 0.045, height: 0.07 },
      'id-v2-1262': { x: 0.83, y: 0.10, width: 0.17, height: 0.45 },
      'id-v2-272': { x: 0.73, y: 0.51, width: 0.27, height: 0.25 },
      'id-v2-453': { x: 0.82, y: 0.63, width: 0.05, height: 0.07 },
      'id-v2-431': { x: 0.875, y: 0.65, width: 0.05, height: 0.055 },
    },
    uk_scene_65_countryside_farmyard_animals: {
      'id-v2-962': { x: 0.02, y: 0.39, width: 0.16, height: 0.52 },
      'id-v2-963': { x: 0.18, y: 0.45, width: 0.15, height: 0.23 },
      'id-v2-965': { x: 0.25, y: 0.61, width: 0.15, height: 0.26 },
      'id-v2-964': { x: 0.39, y: 0.60, width: 0.09, height: 0.19 },
      'id-v2-966': { x: 0.43, y: 0.64, width: 0.12, height: 0.17 },
      'id-v2-1923': { x: 0.35, y: 0.74, width: 0.19, height: 0.17 },
      'id-v2-943': { x: 0.27, y: 0.17, width: 0.16, height: 0.38 },
      'id-v2-1592': { x: 0.31, y: 0.35, width: 0.06, height: 0.20 },
      'id-v2-1594': { x: 0.37, y: 0.35, width: 0.04, height: 0.21 },
      'id-v2-942': { x: 0.42, y: 0.31, width: 0.12, height: 0.20 },
      'id-v2-969': { x: 0.55, y: 0.57, width: 0.08, height: 0.16 },
      'id-v2-543': { x: 0.64, y: 0.62, width: 0.05, height: 0.11 },
      'id-v2-970': { x: 0.59, y: 0.72, width: 0.07, height: 0.18 },
      'id-v2-545': { x: 0.66, y: 0.78, width: 0.08, height: 0.15 },
      'id-v2-544': { x: 0.71, y: 0.61, width: 0.11, height: 0.24 },
      'id-v2-1595': { x: 0.61, y: 0.44, width: 0.22, height: 0.26 },
      'id-v2-1987': { x: 0.68, y: 0.22, width: 0.27, height: 0.16 },
      'fm-potato': { x: 0.84, y: 0.63, width: 0.11, height: 0.19 },
    },
    uk_scene_66_countryside_wheat_and_sunflower_fields: {
      'id-v2-944': { x: 0.05, y: 0.16, width: 0.18, height: 0.22 },
      'id-v2-1624': { x: 0.04, y: 0.25, width: 0.05, height: 0.08 },
      'id-v2-1591': { x: 0.18, y: 0.44, width: 0.15, height: 0.44 },
      'noun-mysha-animal': { x: 0.15, y: 0.82, width: 0.06, height: 0.08 },
      'id-v2-1609': { x: 0.37, y: 0.82, width: 0.10, height: 0.09 },
      'id-v2-1626': { x: 0.47, y: 0.63, width: 0.12, height: 0.12 },
      'id-v2-940': { x: 0.46, y: 0.24, width: 0.10, height: 0.19 },
      'ext-v2-0025': { x: 0.00, y: 0.00, width: 0.78, height: 0.41 },
      'id-v2-989': { x: 0.59, y: 0.05, width: 0.10, height: 0.14 },
      'id-v2-1583': { x: 0.58, y: 0.33, width: 0.15, height: 0.26 },
      'id-v2-905': { x: 0.54, y: 0.40, width: 0.46, height: 0.36 },
      'id-v2-1541': { x: 0.78, y: 0.00, width: 0.22, height: 0.45 },
      'id-v2-945': { x: 0.63, y: 0.60, width: 0.19, height: 0.30 },
      'id-v2-992': { x: 0.66, y: 0.71, width: 0.04, height: 0.04 },
      'id-v2-472': { x: 0.75, y: 0.72, width: 0.08, height: 0.16 },
      'id-v2-527': { x: 0.84, y: 0.64, width: 0.04, height: 0.20 },
      'id-v2-523': { x: 0.82, y: 0.81, width: 0.10, height: 0.12 },
      'id-v2-430': { x: 0.88, y: 0.72, width: 0.10, height: 0.16 },
    },
    uk_scene_67_carpathian_forest_wildlife: {
      'id-v2-1611': { x: 0.08, y: 0.23, width: 0.055, height: 0.12 },
      'id-v2-1537': { x: 0.14, y: 0.00, width: 0.72, height: 0.34 },
      'id-v2-974': { x: 0.35, y: 0.25, width: 0.16, height: 0.36 },
      'id-v2-923': { x: 0.37, y: 0.56, width: 0.28, height: 0.43 },
      'id-v2-977': { x: 0.13, y: 0.67, width: 0.10, height: 0.11 },
      'id-v2-469': { x: 0.19, y: 0.80, width: 0.09, height: 0.12 },
      'id-v2-975': { x: 0.27, y: 0.56, width: 0.09, height: 0.22 },
      'id-v2-1272': { x: 0.34, y: 0.69, width: 0.08, height: 0.13 },
      'id-v2-1606': { x: 0.56, y: 0.55, width: 0.13, height: 0.15 },
      'id-v2-1553': { x: 0.56, y: 0.71, width: 0.07, height: 0.12 },
      'id-v2-1554': { x: 0.63, y: 0.72, width: 0.07, height: 0.13 },
      'id-v2-1555': { x: 0.70, y: 0.69, width: 0.08, height: 0.14 },
      'id-v2-1578': { x: 0.73, y: 0.47, width: 0.16, height: 0.20 },
      'id-v2-1603': { x: 0.81, y: 0.31, width: 0.15, height: 0.20 },
      'id-v2-427': { x: 0.80, y: 0.73, width: 0.18, height: 0.23 },
      'id-v2-972': { x: 0.20, y: 0.36, width: 0.11, height: 0.20 },
      'id-v2-973': { x: 0.64, y: 0.36, width: 0.11, height: 0.20 },
      'id-v2-898': { x: 0.01, y: 0.52, width: 0.14, height: 0.24 },
    },
    uk_scene_68_carpathian_camping_bonfire: {
      'id-v2-932': { x: 0.81, y: 0.05, width: 0.07, height: 0.12 },
      'id-v2-947': { x: 0.10, y: 0.49, width: 0.19, height: 0.15 },
      'id-v2-948': { x: 0.31, y: 0.42, width: 0.18, height: 0.29 },
      'id-v2-946': { x: 0.02, y: 0.26, width: 0.32, height: 0.36 },
      'id-v2-950': { x: 0.22, y: 0.78, width: 0.07, height: 0.10 },
      'ext-v2-0026': { x: 0.00, y: 0.02, width: 0.78, height: 0.34 },
      'id-v2-392': { x: 0.67, y: 0.39, width: 0.25, height: 0.34 },
      'id-v2-393': { x: 0.66, y: 0.36, width: 0.24, height: 0.06 },
      'id-v2-575': { x: 0.70, y: 0.35, width: 0.19, height: 0.08 },
      'k-pot': { x: 0.36, y: 0.34, width: 0.09, height: 0.12 },
      'id-v2-180': { x: 0.39, y: 0.81, width: 0.08, height: 0.09 },
      'id-v2-576': { x: 0.47, y: 0.73, width: 0.12, height: 0.13 },
      'id-v2-521': { x: 0.60, y: 0.73, width: 0.12, height: 0.13 },
      'id-v2-579': { x: 0.72, y: 0.75, width: 0.14, height: 0.13 },
      'ext-v2-0002': { x: 0.86, y: 0.59, width: 0.11, height: 0.26 },
      'cl-backpack': { x: 0.02, y: 0.54, width: 0.13, height: 0.33 },
      'id-v2-1195': { x: 0.14, y: 0.60, width: 0.07, height: 0.27 },
      'k-knife': { x: 0.29, y: 0.79, width: 0.10, height: 0.10 },
    },
    uk_scene_69_river_dnipro_boating_fishing: {
      'noun-bereh-riverbank': { x: 0.00, y: 0.58, width: 0.32, height: 0.40 },
      'id-v2-931': { x: 0.57, y: 0.17, width: 0.42, height: 0.12 },
      'id-v2-985': { x: 0.52, y: 0.52, width: 0.10, height: 0.15 },
      'id-v2-933': { x: 0.50, y: 0.05, width: 0.03, height: 0.05 },
      'id-v2-928': { x: 0.35, y: 0.20, width: 0.22, height: 0.11 },
      'id-v2-956': { x: 0.10, y: 0.67, width: 0.25, height: 0.12 },
      'id-v2-1579': { x: 0.02, y: 0.22, width: 0.31, height: 0.09 },
      'id-v2-930': { x: 0.25, y: 0.54, width: 0.31, height: 0.39 },
      'id-v2-1407': { x: 0.36, y: 0.45, width: 0.18, height: 0.08 },
      'id-v2-1413': { x: 0.25, y: 0.18, width: 0.08, height: 0.22 },
      'id-v2-1403': { x: 0.47, y: 0.25, width: 0.19, height: 0.12 },
      'id-v2-1404': { x: 0.72, y: 0.31, width: 0.19, height: 0.11 },
      'id-v2-1489': { x: 0.43, y: 0.28, width: 0.09, height: 0.33 },
      'id-v2-554': { x: 0.40, y: 0.74, width: 0.13, height: 0.09 },
      'id-v2-990': { x: 0.51, y: 0.39, width: 0.06, height: 0.11 },
      'id-v2-672': { x: 0.03, y: 0.61, width: 0.32, height: 0.28 },
      'pk-bench': { x: 0.14, y: 0.56, width: 0.12, height: 0.21 },
      'id-v2-1680': { x: 0.50, y: 0.23, width: 0.20, height: 0.25 },
    },
    uk_scene_70_nature_insects_and_garden_macro: {
      'id-v2-993': { x: 0.21, y: 0.36, width: 0.06, height: 0.08 },
      'id-v2-1625': { x: 0.18, y: 0.52, width: 0.12, height: 0.08 },
      'id-v2-893': { x: 0.21, y: 0.65, width: 0.09, height: 0.16 },
      'id-v2-437': { x: 0.31, y: 0.72, width: 0.09, height: 0.12 },
      'id-v2-435': { x: 0.35, y: 0.53, width: 0.12, height: 0.18 },
      'id-v2-436': { x: 0.45, y: 0.67, width: 0.08, height: 0.12 },
      'id-v2-434': { x: 0.42, y: 0.79, width: 0.09, height: 0.11 },
      'id-v2-439': { x: 0.53, y: 0.69, width: 0.10, height: 0.16 },
      'id-v2-440': { x: 0.48, y: 0.47, width: 0.12, height: 0.19 },
      'id-v2-433': { x: 0.60, y: 0.55, width: 0.10, height: 0.14 },
      'id-v2-432': { x: 0.61, y: 0.20, width: 0.14, height: 0.36 },
      'id-v2-415': { x: 0.64, y: 0.73, width: 0.09, height: 0.12 },
      'id-v2-416': { x: 0.72, y: 0.55, width: 0.12, height: 0.18 },
      'id-v2-462': { x: 0.79, y: 0.34, width: 0.13, height: 0.25 },
      'id-v2-456': { x: 0.78, y: 0.68, width: 0.19, height: 0.21 },
      'id-v2-992': { x: 0.09, y: 0.34, width: 0.07, height: 0.09 },
      'id-v2-994': { x: 0.08, y: 0.77, width: 0.08, height: 0.09 },
      'id-v2-1626': { x: 0.01, y: 0.02, width: 0.23, height: 0.31 },
    },
    uk_scene_71_pet_shop_and_vet_clinic: {
      'id-v2-1615': { x: 0.04, y: 0.22, width: 0.10, height: 0.25 },
      'id-v2-1597': { x: 0.18, y: 0.79, width: 0.10, height: 0.09 },
      'id-v2-1779': { x: 0.04, y: 0.79, width: 0.08, height: 0.08 },
      'sm-cart': { x: 0.27, y: 0.52, width: 0.13, height: 0.36 },
      'id-v2-522': { x: 0.39, y: 0.37, width: 0.05, height: 0.11 },
      'id-v2-1293': { x: 0.44, y: 0.37, width: 0.05, height: 0.11 },
      'id-v2-1289': { x: 0.49, y: 0.37, width: 0.05, height: 0.11 },
      'id-v2-1291': { x: 0.54, y: 0.37, width: 0.05, height: 0.11 },
      'id-v2-520': { x: 0.59, y: 0.37, width: 0.05, height: 0.11 },
      'id-v2-465': { x: 0.39, y: 0.52, width: 0.06, height: 0.08 },
      'id-v2-467': { x: 0.45, y: 0.52, width: 0.06, height: 0.08 },
      'id-v2-468': { x: 0.51, y: 0.52, width: 0.06, height: 0.08 },
      'id-v2-1252': { x: 0.57, y: 0.52, width: 0.06, height: 0.08 },
      'id-v2-454': { x: 0.42, y: 0.65, width: 0.09, height: 0.11 },
      'id-v2-1232': { x: 0.52, y: 0.66, width: 0.09, height: 0.10 },
      'hp-thermometer': { x: 0.72, y: 0.42, width: 0.11, height: 0.15 },
      'id-v2-960': { x: 0.76, y: 0.57, width: 0.17, height: 0.37 },
      'id-v2-961': { x: 0.15, y: 0.27, width: 0.18, height: 0.19 },
    },
    uk_scene_72_zoo_exotic_animals_kyiv: {
      'id-v2-1618': { x: 0.05, y: 0.27, width: 0.16, height: 0.17 },
      'id-v2-924': { x: 0.29, y: 0.16, width: 0.12, height: 0.29 },
      'id-v2-1607': { x: 0.20, y: 0.55, width: 0.11, height: 0.12 },
      'id-v2-916': { x: 0.42, y: 0.17, width: 0.17, height: 0.24 },
      'id-v2-1604': { x: 0.61, y: 0.18, width: 0.17, height: 0.33 },
      'id-v2-1616': { x: 0.42, y: 0.44, width: 0.21, height: 0.25 },
      'id-v2-988': { x: 0.79, y: 0.16, width: 0.08, height: 0.16 },
      'id-v2-1608': { x: 0.89, y: 0.12, width: 0.08, height: 0.14 },
      'id-v2-475': { x: 0.35, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-473': { x: 0.44, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-476': { x: 0.53, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-477': { x: 0.62, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-479': { x: 0.71, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-480': { x: 0.80, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-481': { x: 0.89, y: 0.77, width: 0.08, height: 0.12 },
      'id-v2-982': { x: 0.06, y: 0.49, width: 0.08, height: 0.19 },
      'id-v2-989': { x: 0.14, y: 0.71, width: 0.12, height: 0.12 },
      'id-v2-972': { x: 0.43, y: 0.25, width: 0.14, height: 0.21 },
    },
    uk_scene_73_art_studio_and_museum: {
      'id-v2-813': { x: 0.24, y: 0.15, width: 0.25, height: 0.84 },
      'id-v2-1495': { x: 0.50, y: 0.25, width: 0.08, height: 0.43 },
      'id-v2-1136': { x: 0.08, y: 0.00, width: 0.27, height: 0.98 },
      'id-v2-1138': { x: 0.33, y: 0.52, width: 0.14, height: 0.13 },
      'id-v2-1139': { x: 0.02, y: 0.58, width: 0.10, height: 0.29 },
      'id-v2-1140': { x: 0.07, y: 0.82, width: 0.16, height: 0.10 },
      'id-v2-1153': { x: 0.64, y: 0.64, width: 0.12, height: 0.11 },
      'id-v2-1154': { x: 0.72, y: 0.73, width: 0.06, height: 0.04 },
      'id-v2-1574': { x: 0.08, y: 0.24, width: 0.22, height: 0.40 },
      'noun-zamok-castle': { x: 0.59, y: 0.26, width: 0.23, height: 0.24 },
      'id-v2-1675': { x: 0.82, y: 0.61, width: 0.09, height: 0.15 },
      'id-v2-1674': { x: 0.90, y: 0.48, width: 0.05, height: 0.27 },
      'id-v2-1668': { x: 0.89, y: 0.73, width: 0.035, height: 0.06 },
      'id-v2-1667': { x: 0.91, y: 0.42, width: 0.07, height: 0.57 },
      'id-v2-594': { x: 0.78, y: 0.60, width: 0.04, height: 0.14 },
      'id-v2-260': { x: 0.01, y: 0.00, width: 0.21, height: 0.34 },
      'id-v2-1529': { x: 0.58, y: 0.72, width: 0.09, height: 0.28 },
      'id-v2-202': { x: 0.73, y: 0.56, width: 0.06, height: 0.16 },
    },
    uk_scene_74_theater_and_concert_hall: {
      'id-v2-1117': { x: 0.11, y: 0.26, width: 0.23, height: 0.41 },
      'id-v2-1127': { x: 0.33, y: 0.42, width: 0.06, height: 0.28 },
      'id-v2-1128': { x: 0.47, y: 0.51, width: 0.09, height: 0.06 },
      'id-v2-1130': { x: 0.58, y: 0.49, width: 0.12, height: 0.21 },
      'id-v2-1728': { x: 0.07, y: 0.76, width: 0.13, height: 0.09 },
      'id-v2-1496': { x: 0.83, y: 0.22, width: 0.12, height: 0.47 },
      'id-v2-181': { x: 0.28, y: 0.85, width: 0.10, height: 0.09 },
      'ext-v2-0004': { x: 0.38, y: 0.55, width: 0.12, height: 0.38 },
      'id-v2-511': { x: 0.64, y: 0.69, width: 0.10, height: 0.18 },
      'id-v2-1310': { x: 0.75, y: 0.56, width: 0.07, height: 0.26 },
      'id-v2-518': { x: 0.50, y: 0.69, width: 0.07, height: 0.13 },
      'id-v2-194': { x: 0.51, y: 0.76, width: 0.14, height: 0.14 },
      'id-v2-1200': { x: 0.57, y: 0.86, width: 0.18, height: 0.14 },
      'id-v2-561': { x: 0.80, y: 0.70, width: 0.18, height: 0.10 },
      'id-v2-582': { x: 0.73, y: 0.81, width: 0.26, height: 0.18 },
      'id-v2-1122': { x: 0.03, y: 0.49, width: 0.26, height: 0.27 },
      'id-v2-1094': { x: 0.69, y: 0.26, width: 0.03, height: 0.43 },
      'bd-curtains': { x: 0.08, y: 0.00, width: 0.34, height: 0.55 },
    },
    uk_scene_75_photo_and_media_studio: {
      'id-v2-814': { x: 0.06, y: 0.05, width: 0.21, height: 0.92 },
      'id-v2-172': { x: 0.52, y: 0.57, width: 0.42, height: 0.24 },
      'id-v2-183': { x: 0.47, y: 0.74, width: 0.11, height: 0.13 },
      'id-v2-177': { x: 0.54, y: 0.72, width: 0.23, height: 0.23 },
      'id-v2-174': { x: 0.66, y: 0.70, width: 0.21, height: 0.25 },
      'id-v2-176': { x: 0.75, y: 0.74, width: 0.23, height: 0.23 },
      'id-v2-1204': { x: 0.78, y: 0.17, width: 0.14, height: 0.33 },
      'id-v2-1203': { x: 0.79, y: 0.48, width: 0.15, height: 0.12 },
      'id-v2-1206': { x: 0.54, y: 0.38, width: 0.06, height: 0.16 },
      'id-v2-1207': { x: 0.53, y: 0.11, width: 0.23, height: 0.37 },
      'id-v2-1247': { x: 0.59, y: 0.52, width: 0.09, height: 0.06 },
      'id-v2-529': { x: 0.69, y: 0.32, width: 0.06, height: 0.24 },
      'id-v2-555': { x: 0.58, y: 0.58, width: 0.19, height: 0.13 },
      'fm-tomato': { x: 0.73, y: 0.52, width: 0.11, height: 0.13 },
      'fm-cucumber': { x: 0.80, y: 0.55, width: 0.10, height: 0.14 },
      'id-v2-1108': { x: 0.22, y: 0.20, width: 0.11, height: 0.25 },
      'id-v2-1110': { x: 0.14, y: 0.45, width: 0.23, height: 0.54 },
      'id-v2-1700': { x: 0.33, y: 0.12, width: 0.13, height: 0.72 },
    },
    uk_scene_76_hair_salon_barbershop: {
      'id-v2-1485': { x: 0.01, y: 0.23, width: 0.12, height: 0.48 },
      'id-v2-1900': { x: 0.20, y: 0.58, width: 0.11, height: 0.13 },
      'id-v2-879': { x: 0.31, y: 0.55, width: 0.06, height: 0.14 },
      'id-v2-243': { x: 0.19, y: 0.76, width: 0.17, height: 0.18 },
      'id-v2-231': { x: 0.41, y: 0.45, width: 0.20, height: 0.33 },
      'id-v2-232': { x: 0.54, y: 0.35, width: 0.04, height: 0.12 },
      'id-v2-1176': { x: 0.41, y: 0.09, width: 0.22, height: 0.19 },
      'id-v2-209': { x: 0.64, y: 0.33, width: 0.17, height: 0.22 },
      'id-v2-159': { x: 0.84, y: 0.23, width: 0.15, height: 0.45 },
      'id-v2-156': { x: 0.76, y: 0.42, width: 0.09, height: 0.19 },
      'id-v2-1790': { x: 0.61, y: 0.55, width: 0.13, height: 0.16 },
      'id-v2-1230': { x: 0.83, y: 0.62, width: 0.17, height: 0.21 },
      'id-v2-1233': { x: 0.82, y: 0.79, width: 0.17, height: 0.20 },
      'id-v2-1286': { x: 0.64, y: 0.69, width: 0.18, height: 0.25 },
      'id-v2-466': { x: 0.73, y: 0.60, width: 0.12, height: 0.15 },
      'bd-mirror': { x: 0.10, y: 0.03, width: 0.19, height: 0.47 },
      'id-v2-304': { x: 0.17, y: 0.51, width: 0.08, height: 0.03 },
      'id-v2-301': { x: 0.30, y: 0.38, width: 0.08, height: 0.15 },
    },
    uk_scene_77_hotel_reception_and_room: {
      'id-v2-728': { x: 0.01, y: 0.47, width: 0.28, height: 0.50 },
      'id-v2-729': { x: 0.21, y: 0.47, width: 0.04, height: 0.03 },
      'id-v2-731': { x: 0.41, y: 0.30, width: 0.22, height: 0.43 },
      'id-v2-1216': { x: 0.42, y: 0.31, width: 0.09, height: 0.15 },
      'id-v2-288': { x: 0.31, y: 0.48, width: 0.06, height: 0.17 },
      'id-v2-337': { x: 0.53, y: 0.20, width: 0.10, height: 0.30 },
      'id-v2-150': { x: 0.63, y: 0.22, width: 0.12, height: 0.49 },
      'id-v2-152': { x: 0.63, y: 0.63, width: 0.17, height: 0.32 },
      'id-v2-153': { x: 0.80, y: 0.01, width: 0.14, height: 0.29 },
      'id-v2-158': { x: 0.76, y: 0.42, width: 0.05, height: 0.07 },
      'id-v2-160': { x: 0.81, y: 0.43, width: 0.06, height: 0.12 },
      'id-v2-161': { x: 0.86, y: 0.44, width: 0.06, height: 0.11 },
      'id-v2-1185': { x: 0.83, y: 0.53, width: 0.10, height: 0.15 },
      'id-v2-1186': { x: 0.85, y: 0.48, width: 0.14, height: 0.31 },
      'id-v2-1202': { x: 0.86, y: 0.80, width: 0.13, height: 0.07 },
      'id-v2-1842': { x: 0.02, y: 0.38, width: 0.07, height: 0.15 },
      'at-luggage': { x: 0.17, y: 0.53, width: 0.16, height: 0.45 },
      'id-v2-295': { x: 0.38, y: 0.29, width: 0.07, height: 0.34 },
    },
    uk_scene_78_emergency_and_civic_services: {
      'id-v2-333': { x: 0.08, y: 0.32, width: 0.15, height: 0.41 },
      'id-v2-1331': { x: 0.25, y: 0.05, width: 0.05, height: 0.43 },
      'id-v2-1351': { x: 0.28, y: 0.05, width: 0.04, height: 0.08 },
      'id-v2-670': { x: 0.06, y: 0.63, width: 0.09, height: 0.23 },
      'id-v2-1429': { x: 0.15, y: 0.81, width: 0.08, height: 0.15 },
      'id-v2-1430': { x: 0.23, y: 0.83, width: 0.06, height: 0.13 },
      'id-v2-806': { x: 0.27, y: 0.55, width: 0.07, height: 0.26 },
      'id-v2-654': { x: 0.26, y: 0.68, width: 0.05, height: 0.10 },
      'id-v2-1392': { x: 0.40, y: 0.14, width: 0.22, height: 0.19 },
      'id-v2-1346': { x: 0.52, y: 0.61, width: 0.10, height: 0.11 },
      'id-v2-709': { x: 0.63, y: 0.69, width: 0.16, height: 0.20 },
      'id-v2-710': { x: 0.72, y: 0.67, width: 0.14, height: 0.27 },
      'id-v2-660': { x: 0.74, y: 0.44, width: 0.17, height: 0.22 },
      'id-v2-706': { x: 0.81, y: 0.60, width: 0.18, height: 0.31 },
      'id-v2-727': { x: 0.90, y: 0.53, width: 0.08, height: 0.46 },
      'id-v2-653': { x: 0.08, y: 0.47, width: 0.33, height: 0.28 },
      'id-v2-658': { x: 0.38, y: 0.56, width: 0.14, height: 0.10 },
      'id-v2-659': { x: 0.43, y: 0.52, width: 0.13, height: 0.11 },
    },
    uk_scene_79_architecture_church_and_castle: {
      'id-v2-1393': { x: 0.26, y: 0.07, width: 0.05, height: 0.11 },
      'id-v2-661': { x: 0.48, y: 0.03, width: 0.21, height: 0.55 },
      'id-v2-662': { x: 0.52, y: 0.45, width: 0.13, height: 0.18 },
      'id-v2-663': { x: 0.68, y: 0.55, width: 0.09, height: 0.10 },
      'id-v2-664': { x: 0.76, y: 0.56, width: 0.13, height: 0.12 },
      'id-v2-1432': { x: 0.18, y: 0.67, width: 0.10, height: 0.22 },
      'id-v2-687': { x: 0.22, y: 0.67, width: 0.09, height: 0.18 },
      'id-v2-1433': { x: 0.33, y: 0.66, width: 0.04, height: 0.06 },
      'id-v2-329': { x: 0.49, y: 0.63, width: 0.50, height: 0.36 },
      'id-v2-578': { x: 0.58, y: 0.80, width: 0.19, height: 0.14 },
      'id-v2-525': { x: 0.68, y: 0.74, width: 0.11, height: 0.10 },
      'id-v2-526': { x: 0.79, y: 0.72, width: 0.10, height: 0.10 },
      'id-v2-1296': { x: 0.73, y: 0.81, width: 0.14, height: 0.12 },
      'id-v2-1284': { x: 0.85, y: 0.87, width: 0.09, height: 0.09 },
      'id-v2-1288': { x: 0.87, y: 0.78, width: 0.10, height: 0.11 },
      'id-v2-332': { x: 0.36, y: 0.41, width: 0.05, height: 0.10 },
      'id-v2-606': { x: 0.23, y: 0.42, width: 0.04, height: 0.12 },
      'id-v2-605': { x: 0.73, y: 0.06, width: 0.07, height: 0.39 },
    },
    uk_scene_80_family_celebration_gift_exchange: {
      'id-v2-795': { x: 0.15, y: 0.10, width: 0.23, height: 0.50 },
      'id-v2-796': { x: 0.36, y: 0.16, width: 0.21, height: 0.44 },
      'ext-v2-0012': { x: 0.54, y: 0.11, width: 0.17, height: 0.49 },
      'ext-v2-0013': { x: 0.68, y: 0.07, width: 0.27, height: 0.53 },
      'id-v2-577': { x: 0.13, y: 0.74, width: 0.18, height: 0.17 },
      'id-v2-569': { x: 0.26, y: 0.61, width: 0.14, height: 0.15 },
      'id-v2-546': { x: 0.31, y: 0.68, width: 0.20, height: 0.23 },
      'id-v2-1323': { x: 0.44, y: 0.57, width: 0.13, height: 0.13 },
      'id-v2-549': { x: 0.46, y: 0.77, width: 0.16, height: 0.15 },
      'id-v2-1324': { x: 0.52, y: 0.66, width: 0.14, height: 0.13 },
      'id-v2-550': { x: 0.60, y: 0.60, width: 0.14, height: 0.11 },
      'id-v2-551': { x: 0.62, y: 0.72, width: 0.19, height: 0.19 },
      'id-v2-1315': { x: 0.74, y: 0.60, width: 0.12, height: 0.15 },
      'id-v2-548': { x: 0.84, y: 0.61, width: 0.14, height: 0.12 },
      'id-v2-581': { x: 0.82, y: 0.72, width: 0.17, height: 0.21 },
      'id-v2-506': { x: 0.02, y: 0.40, width: 0.16, height: 0.20 },
      'cf-pastry': { x: 0.01, y: 0.69, width: 0.15, height: 0.16 },
      'id-v2-268': { x: 0.19, y: 0.49, width: 0.06, height: 0.27 },
    },
  };

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
    const sceneCandidateBoxes = BATCH_CANDIDATE_HOTSPOTS_BY_SCENE_CODE[bp.sceneCode];

    const targets: IdentifyUkrainian80SceneTargetAssociation[] = orderedEntries.map(
      (entry, slotIdx) => {
        const c = entry.concept;
        const verifiedHotspot = verifiedMap.get(c.vocabularyId);
        const isHotspotVerified = Boolean(verifiedHotspot && isVerifiedPlayable);
        const candidateBox = sceneCandidateBoxes?.[c.vocabularyId] ?? null;

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
          candidateNormalizedBoundingBox: candidateBox,
          hotspotReviewStatus: isHotspotVerified
            ? 'verified_playable'
            : candidateBox
            ? 'needs_human_review'
            : 'unannotated',
        };
      }
    );

    const verifiedCount = targets.filter((t) => t.hotspotVerified).length;
    const candidateCount = targets.filter((t) => Boolean(t.candidateNormalizedBoundingBox)).length;

    const targetListForPrompt = targets
      .slice(0, 12)
      .map((t) => `${t.en} (${t.uk})`)
      .join(', ');

    const generationPromptEn = `Photorealistic eye-level photograph set in Contemporary 2020s Ukraine (${bp.titleEn} / ${bp.titleUk}). Setting: ${bp.settingEn}. Authentic Ukrainian cultural anchors: ${bp.anchorsEn.join('; ')}. All visible signage and packaging strictly in Ukrainian Cyrillic (zero Russian or foreign landmarks). Clearly visible, unoccluded, well-separated everyday objects for language-learning hotspot identification: ${targetListForPrompt}. Natural daylight, 4:3 aspect ratio, crisp focus across foreground and midground.`;

    const resolvedAssetPath = bp.verifiedAssetPath ?? bp.generatedAssetPath ?? null;
    const hasAssetOnDisk = Boolean(isVerifiedPlayable || bp.generatedAssetPath);

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
      assetPath: resolvedAssetPath,
      assetExistsOnDisk: hasAssetOnDisk,
      imageGenerationStatus: isVerifiedPlayable
        ? 'verified_existing_asset_on_disk'
        : bp.generatedAssetPath
        ? 'generated_verified_on_disk'
        : 'blocked_by_ai_studio_image_quota',
      verificationStatus: isVerifiedPlayable
        ? 'verified_playable'
        : 'planned_unverified_not_exposed_to_learners',
      learnerExposureAllowed: isVerifiedPlayable,
      containsForeignLandmarks: false,
      targetCount: 18,
      verifiedHotspotCount: verifiedCount,
      candidateHotspotCount: candidateCount,
      batchExecutionNumber: bp.batchExecutionNumber ?? null,
      imageDimensions: bp.imageDimensions ?? null,
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

