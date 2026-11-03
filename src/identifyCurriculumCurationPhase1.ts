// ============================================================================
// LANGO IDENTIFY — PHASE 1: 1,200-NOUN EVERYDAY VOCABULARY CURATION WORKFLOW
// & BATCH 1 (FIRST 200 HIGH-PRIORITY CANDIDATES) REVIEW REGISTRY
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only planning and curation infrastructure.
// - It does NOT alter the active learner-facing Identify tab, the 10 verified
//   photographic scenes, the 49 approved active learner targets, or the
//   preserved 2,000-noun / 120-scene legacy planning archive.
// ============================================================================

import { COURSE_MODULES } from './courseData.ts';
import {
  IDENTIFY_MASTER_2000_NOUNS,
  type IdentifyMasterNounEntry,
} from './identifyMasterNouns.ts';
import { FREQ_6000_DB } from './vocabData.ts';
import {
  EXPLICIT_BATCH_2_ASSESSMENTS,
  IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES,
  getIdentifyVocabularyCoverageGapReport,
  type IdentifyVisualSceneFraming,
  type IdentifyDuplicateAndSenseResolutionRecord,
  type IdentifyCoverageDomainId,
  type IdentifyMissingVocabularyGapEntry,
  type IdentifyVocabularyCoverageGapReport,
} from './identifyCurriculumCurationPhase1Batch2.ts';
import {
  EXPLICIT_BATCH_3_ASSESSMENTS,
  IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES,
  type IdentifyBatch3DuplicateAndSenseRecord,
} from './identifyCurriculumCurationPhase1Batch3.ts';
import {
  EXPLICIT_BATCH_4_ASSESSMENTS,
  IDENTIFY_BATCH_4_DOMAIN_BUCKET_ORDER,
  IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  classifyEntryIntoPedagogicalDomainBucket,
  getBatch4CorrectedVocabularyGapReport,
  parseMasterVocabularyNumericId,
  type IdentifyBatch4PedagogicalDomainBucket,
  type IdentifyBatch4DuplicateAndSenseRecord,
  type IdentifyLexicalGapRelationshipType,
  type IdentifyLexicalGapAuditRecord,
  type IdentifyBatch4CorrectedGapSummary,
} from './identifyCurriculumCurationPhase1Batch4.ts';
import {
  EXPLICIT_BATCH_5_ASSESSMENTS,
  IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS,
  IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS,
  getBatch5VocabularyGapReconciliationPlan,
  type ExplicitBatch5Assessment,
  type IdentifyBatch5SemanticRelationshipType,
  type IdentifyBatch5SemanticDuplicateRecord,
  type IdentifyShortlistReconciliationCandidate,
  type IdentifyBatch5CoverageGapPlanningView,
} from './identifyCurriculumCurationPhase1Batch5.ts';
import {
  EXPLICIT_BATCH_6_ASSESSMENTS,
  IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS,
  IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER,
  getBatch6CoverageGapAndHeadwordReport,
  type ExplicitBatch6Assessment,
  type IdentifyBatch6SemanticRelationshipType,
  type IdentifyBatch6SemanticRelationshipRecord,
  type IdentifyMissingConceptReconciliationCategory,
  type IdentifyMissingConceptVisualSuitabilityAssessment,
  type IdentifyCanonicalHeadwordNormalizationStatus,
  type IdentifyBatch6CoverageGapAndHeadwordSummary,
} from './identifyCurriculumCurationPhase1Batch6.ts';
import {
  EXPLICIT_BATCH_7_ASSESSMENTS,
  IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS,
  getBatch7CurationAndHeadwordReport,
  resolveMasterNounById,
  resolveMasterConceptId,
  type ExplicitBatch7Assessment,
  type IdentifyBatch7SemanticRelationshipType,
  type IdentifyBatch7SemanticRelationshipRecord,
  type IdentifyBatch7HeadwordNormalizationRecord,
  type IdentifyBatch7EssentialEverydayPedagogicalReason,
  type IdentifyPriorBatchPriorityReconciliationFlag,
  type IdentifyBatch7CurationAndHeadwordSummary,
} from './identifyCurriculumCurationPhase1Batch7.ts';

export {
  IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS,
  IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS,
  IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES,
  IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES,
  IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS,
  IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS,
  IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER,
  IDENTIFY_BATCH_4_DOMAIN_BUCKET_ORDER,
  getIdentifyVocabularyCoverageGapReport,
  getBatch4CorrectedVocabularyGapReport,
  getBatch5VocabularyGapReconciliationPlan,
  getBatch6CoverageGapAndHeadwordReport,
  getBatch7CurationAndHeadwordReport,
  resolveMasterNounById,
  resolveMasterConceptId,
  classifyEntryIntoPedagogicalDomainBucket,
  type IdentifyVisualSceneFraming,
  type IdentifyDuplicateAndSenseResolutionRecord,
  type IdentifyBatch3DuplicateAndSenseRecord,
  type IdentifyBatch4DuplicateAndSenseRecord,
  type IdentifyBatch4PedagogicalDomainBucket,
  type IdentifyLexicalGapRelationshipType,
  type IdentifyLexicalGapAuditRecord,
  type IdentifyBatch4CorrectedGapSummary,
  type ExplicitBatch5Assessment,
  type IdentifyBatch5SemanticRelationshipType,
  type IdentifyBatch5SemanticDuplicateRecord,
  type IdentifyShortlistReconciliationCandidate,
  type IdentifyBatch5CoverageGapPlanningView,
  type ExplicitBatch6Assessment,
  type IdentifyBatch6SemanticRelationshipType,
  type IdentifyBatch6SemanticRelationshipRecord,
  type IdentifyMissingConceptReconciliationCategory,
  type IdentifyMissingConceptVisualSuitabilityAssessment,
  type IdentifyCanonicalHeadwordNormalizationStatus,
  type IdentifyBatch6CoverageGapAndHeadwordSummary,
  type ExplicitBatch7Assessment,
  type IdentifyBatch7SemanticRelationshipType,
  type IdentifyBatch7SemanticRelationshipRecord,
  type IdentifyBatch7HeadwordNormalizationRecord,
  type IdentifyBatch7EssentialEverydayPedagogicalReason,
  type IdentifyPriorBatchPriorityReconciliationFlag,
  type IdentifyBatch7CurationAndHeadwordSummary,
  type IdentifyCoverageDomainId,
  type IdentifyMissingVocabularyGapEntry,
  type IdentifyVocabularyCoverageGapReport,
};




// ----------------------------------------------------------------------------
// 1. Target Curriculum Architecture (1,200 Nouns / ~80 Scenes / ~1,440 Associations)
// ----------------------------------------------------------------------------

export type IdentifyCurriculumPriorityLevel =
  | 'essential_everyday'
  | 'common_situational'
  | 'useful_extended'
  | 'none_exclude';

export type IdentifyCurationRecommendation = 'keep' | 'review' | 'exclude';

export type IdentifyFrequencyEvidenceStatus =
  | 'verified_in_registry_and_freq_db'
  | 'verified_in_freq_db_unrecorded_in_registry'
  | 'verified_in_course_modules_only'
  | 'unverified_supplemental_no_rank';

export type IdentifyCandidateIssueFlag =
  | 'duplicate_concept'
  | 'inflected_plural_duplicate'
  | 'modifier_padded_duplicate'
  | 'compositional_phrase'
  | 'hypernym_ambiguous'
  | 'obscure_or_rare'
  | 'overly_specialized'
  | 'unnatural_scene_filler'
  | 'polysemy_sense_preserved';

export interface Identify1200CurriculumArchitectureSpec {
  curriculumVersion: 'identify-1200-v1-planning';
  lifecycleStage: 'development_planning_only';
  targetUniqueNounConcepts: 1200;
  targetTotalScenes: 80;
  targetObjectsPerSceneMin: 15;
  targetObjectsPerSceneMax: 20;
  targetAverageObjectsPerScene: 18;
  targetSceneWordAssociations: 1440;
  supportedPracticeRoundLengths: readonly [5, 8, 10];
  priorityLevelTargets: {
    essential_everyday: 700;
    common_situational: 350;
    useful_extended: 150;
  };
  legacyArchivePreserved: {
    masterNounsCount: 2000;
    plannedScenesCount: 120;
    plannedAssociationsCount: 2520;
    activeVerifiedScenesCount: 10;
    activeVerifiedTargetsCount: 49;
  };
}

export const IDENTIFY_1200_CURRICULUM_ARCHITECTURE: Identify1200CurriculumArchitectureSpec = {
  curriculumVersion: 'identify-1200-v1-planning',
  lifecycleStage: 'development_planning_only',
  targetUniqueNounConcepts: 1200,
  targetTotalScenes: 80,
  targetObjectsPerSceneMin: 15,
  targetObjectsPerSceneMax: 20,
  targetAverageObjectsPerScene: 18,
  targetSceneWordAssociations: 1440,
  supportedPracticeRoundLengths: [5, 8, 10],
  priorityLevelTargets: {
    essential_everyday: 700,
    common_situational: 350,
    useful_extended: 150,
  },
  legacyArchivePreserved: {
    masterNounsCount: 2000,
    plannedScenesCount: 120,
    plannedAssociationsCount: 2520,
    activeVerifiedScenesCount: 10,
    activeVerifiedTargetsCount: 49,
  },
};

// ----------------------------------------------------------------------------
// 2. Selection Methodology & 10-Criteria Evaluation Specification
// ----------------------------------------------------------------------------

export const IDENTIFY_CURATION_METHODOLOGY_V1 = {
  id: 'lango-identify-curation-methodology-v1',
  batchSize: 200,
  totalBatchesPlanned: 10,
  evaluationCriteria: [
    '1. Frequency of usage in ordinary Ukrainian (verified against FREQ_6000_DB and COURSE_MODULES)',
    '2. Frequency of encountering the corresponding physical object in everyday life',
    '3. Practical usefulness for daily conversation',
    '4. Relevance to common everyday environments',
    '5. Suitability for beginner and intermediate learners (CEFR A0–B1)',
    '6. Visual identifiability as a concrete object in a scene',
    '7. Semantic clarity and homograph/polysemy disambiguation',
    '8. Breadth of usefulness across multiple everyday scene categories',
    '9. Appropriate Ukrainian cultural and daily-life context',
    '10. Avoidance of obscure, industrial, hyper-specialized, or modifier-padded quota vocabulary',
  ],
  priorityDefinitions: {
    essential_everyday: {
      targetCount: 700,
      descriptionEn:
        'High-frequency everyday nouns encountered daily in home, food, clothing, personal belongings, transportation, furniture, family/people, and basic public places.',
    },
    common_situational: {
      targetCount: 350,
      descriptionEn:
        'Practical nouns used regularly in school, work, shopping, dining, travel, health, and common city services.',
    },
    useful_extended: {
      targetCount: 150,
      descriptionEn:
        'Concrete nouns useful for recreation, nature, common household tools, everyday hobbies, and less frequent but practical situations.',
    },
  },
} as const;

// ----------------------------------------------------------------------------
// 3. Forensic Audit of Legacy 2,000-Noun Registry (`src/identifyMasterNouns.ts`)
// ----------------------------------------------------------------------------

export function stripUkrainianStressAndParens(raw: string): string {
  return (raw || '')
    .replace(/\u0301/g, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim()
    .toLowerCase();
}

interface InternalFreqDbNounMatch {
  rank: number;
  uk: string;
  en: string;
  level: string;
}

interface InternalCourseNounMatch {
  moduleId: string;
  level: string;
  uk: string;
  en: string;
}

function buildInternalEvidenceMaps(): {
  freqNounByBareUk: Map<string, InternalFreqDbNounMatch>;
  courseNounByBareUk: Map<string, InternalCourseNounMatch>;
} {
  const freqNounByBareUk = new Map<string, InternalFreqDbNounMatch>();
  for (const item of FREQ_6000_DB) {
    if ((item.pos || '').toUpperCase().startsWith('NOUN')) {
      const key = stripUkrainianStressAndParens(item.ru);
      if (key && !freqNounByBareUk.has(key)) {
        freqNounByBareUk.set(key, {
          rank: item.rank,
          uk: item.ru,
          en: item.en,
          level: item.level,
        });
      }
    }
  }

  const courseNounByBareUk = new Map<string, InternalCourseNounMatch>();
  for (const mod of COURSE_MODULES) {
    for (const tuple of mod.vocab || []) {
      const [uk, pos, en] = tuple;
      if ((pos || '').toUpperCase().startsWith('NOUN')) {
        const key = stripUkrainianStressAndParens(uk);
        if (key && !courseNounByBareUk.has(key)) {
          courseNounByBareUk.set(key, {
            moduleId: mod.id,
            level: mod.level,
            uk,
            en,
          });
        }
      }
    }
  }

  return { freqNounByBareUk, courseNounByBareUk };
}

export interface Legacy2000RegistryForensicAudit {
  totalMasterNouns: number;
  recordedFreqRankCount: number;
  unrecordedFreqRankCount: number;
  actualMatchesInFreq6000Db: number;
  missedFreq6000DbMatchesDueToCompilerBug: number;
  actualMatchesInCourseModules: number;
  unverifiedSupplementalNounsCount: number;
  totalNounsInFreq6000Db: number;
  totalNounsInCourseModules: number;
  duplicateBaseEnglishGlossGroupsCount: number;
  compilerFindingsEn: string[];
}

export function auditLegacy2000NounRegistry(): Legacy2000RegistryForensicAudit {
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  let recordedFreqRankCount = 0;
  let actualMatchesInFreq6000Db = 0;
  let actualMatchesInCourseModules = 0;
  let unverifiedSupplementalNounsCount = 0;

  const byBaseEn = new Map<string, IdentifyMasterNounEntry[]>();

  for (const entry of IDENTIFY_MASTER_2000_NOUNS) {
    const hasRecordedRank = typeof entry.freqRank === 'number';
    if (hasRecordedRank) recordedFreqRankCount++;

    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const inFreqDb = freqNounByBareUk.has(bareUk);
    const inCourse = courseNounByBareUk.has(bareUk);

    if (inFreqDb) actualMatchesInFreq6000Db++;
    if (inCourse) actualMatchesInCourseModules++;
    if (!hasRecordedRank && !inFreqDb && !inCourse) {
      unverifiedSupplementalNounsCount++;
    }

    const baseEn = entry.en
      .toLowerCase()
      .split('/')[0]
      .replace(/\s*\(.*?\)/g, '')
      .trim();
    if (!byBaseEn.has(baseEn)) byBaseEn.set(baseEn, []);
    byBaseEn.get(baseEn)!.push(entry);
  }

  const duplicateBaseEnglishGlossGroupsCount = Array.from(byBaseEn.values()).filter(
    (group) => group.length > 1
  ).length;

  return {
    totalMasterNouns: IDENTIFY_MASTER_2000_NOUNS.length,
    recordedFreqRankCount,
    unrecordedFreqRankCount: IDENTIFY_MASTER_2000_NOUNS.length - recordedFreqRankCount,
    actualMatchesInFreq6000Db,
    missedFreq6000DbMatchesDueToCompilerBug:
      actualMatchesInFreq6000Db - recordedFreqRankCount,
    actualMatchesInCourseModules,
    unverifiedSupplementalNounsCount,
    totalNounsInFreq6000Db: freqNounByBareUk.size,
    totalNounsInCourseModules: courseNounByBareUk.size,
    duplicateBaseEnglishGlossGroupsCount,
    compilerFindingsEn: [
      '1. Only 86 of 2,000 entries in IDENTIFY_MASTER_2000_NOUNS have a recorded freqRank (inherited from the original 20-category Identify core vocabulary).',
      '2. In scripts/compileIdentify2000And120Scenes.mjs (lines 598–618), freqLookup checked entry.pos === "noun" and entry.uk, whereas FREQ_6000_DB in src/vocabData.ts uses uppercase entry.pos === "NOUN" and entry.ru. Consequently, freqLookup was empty (0 matches) and missed 220 additional nouns present in FREQ_6000_DB.',
      '3. Similarly, courseLookup checked mod.vocabulary instead of mod.vocab, missing 233 course noun matches.',
      '4. Priority tiers in IDENTIFY_MASTER_2000_NOUNS (1,200 foundational, 500 intermediate, 300 specialized) were assigned purely by array index (idx < 1200, idx < 1700, idx >= 1700) after round-robin scene interleaving, placing items like roasting pan (гусятниця), meat thermometer (термо́метр для м’я́са), toilet brush (йоржик), and jigsaw (електроло́бзик) in the top 150 "foundational" slots.',
      '5. FREQ_6000_DB itself is an internal instructional A0–C1 sequence (1,411 curated core entries followed by module vocabulary additions up to rank 2,417), not an external statistical corpus.',
      '6. Exactly 50 English gloss groups have duplicate or modifier-padded entries in IDENTIFY_MASTER_2000_NOUNS (e.g., замо́к (дверни́й) vs замо́к дверни́й; ми́ша (комп’ю́терна) vs ми́ша vs ми́ша комп’ю́терна; ключ (га́йковий) vs га́йковий ключ; ми́льниця vs ми́льниця керамі́чна; таз vs таз пласти́ковий).',
    ],
  };
}

// ----------------------------------------------------------------------------
// 4. Candidate Review Record Structure & Deterministic Batch Selector
// ----------------------------------------------------------------------------

export interface IdentifyCandidateReviewRecord {
  batchNumber: number;
  reviewOrder: number;
  conceptId: string;
  vocabularyId: string;
  uk: string;
  en: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  intendedLexicalSenseEn: string;
  recordedRegistryFreqRank: number | null;
  /**
   * Instructional vocabulary sequence rank in `FREQ_6000_DB` (`src/vocabData.ts`).
   * NOTE: `FREQ_6000_DB` is Lango's internal A0–C1 instructional sequence (2,417 entries),
   * NOT an external statistical corpus frequency ranking.
   */
  crossReferencedFreqDbRank: number | null;
  /**
   * Course module ID (`A0.1`–`C1.1`) in `COURSE_MODULES` (`src/courseData.ts`) if present.
   */
  crossReferencedCourseModuleId: string | null;
  /**
   * External statistical corpus frequency rank. Explicitly `null` because no external
   * statistical corpus is bundled in the repository; never fabricated.
   */
  independentStatisticalCorpusRank?: null;
  frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
  everydayRelevance: 'high_daily' | 'moderate_situational' | 'low_niche';
  visualRecognizability: 'clear_distinct_object' | 'context_dependent' | 'poor_or_ambiguous';
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  recommendedVisualFraming?: IdentifyVisualSceneFraming;
  candidateSceneCategories: string[];
  recommendation: IdentifyCurationRecommendation;
  issueFlags: IdentifyCandidateIssueFlag[];
  duplicateOfVocabularyId?: string;
  canonicalConceptId?: string;
  rationaleEn: string;
}

/**
 * Selects the 200 Batch 1 candidates using defensible evidence ordering rather
 * than taking raw array indices 0..199 blindly:
 * - Part 1 (10 candidates): Explicit polysemy & homograph benchmark concepts (`noun-concept-0001`..`0010`)
 * - Part 2 (139 candidates): All original 20-category Identify core vocabulary (`!vocabularyId.startsWith('id-v2-')`),
 *   which includes 100% of the 86 recorded-freqRank nouns and all 49 verified active learner targets.
 * - Part 3 (51 candidates): The first 51 supplemental `id-v2-*` entries (`noun-concept-0012`..`0081`),
 *   exposing the early home/kitchen supplemental entries that were interleaved into Scene 1 slots.
 */
export function selectBatch1CandidateEntries(): IdentifyMasterNounEntry[] {
  const nonV2 = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !n.vocabularyId.startsWith('id-v2-')
  );
  const first51V2 = IDENTIFY_MASTER_2000_NOUNS.filter((n) =>
    n.vocabularyId.startsWith('id-v2-')
  ).slice(0, 51);
  return [...nonV2, ...first51V2];
}

// Explicit per-candidate curation overrides and pedagogical judgments for Batch 1 (200 candidates)
interface CandidateManualAssessment {
  everydayRelevance: 'high_daily' | 'moderate_situational' | 'low_niche';
  visualRecognizability: 'clear_distinct_object' | 'context_dependent' | 'poor_or_ambiguous';
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  candidateSceneCategories: string[];
  recommendation: IdentifyCurationRecommendation;
  issueFlags?: IdentifyCandidateIssueFlag[];
  duplicateOfVocabularyId?: string;
  rationaleEn: string;
}

const DEFAULT_CATEGORY_REUSE_BY_PREFIX: Record<string, string[]> = {
  k: ['kitchen', 'dining-room', 'cafe', 'restaurant'],
  bd: ['bedroom', 'living-room', 'hotel'],
  ba: ['bathroom', 'hotel'],
  lr: ['living-room', 'bedroom', 'office'],
  dr: ['dining-room', 'kitchen', 'cafe', 'restaurant'],
  sm: ['supermarket', 'farmers-market', 'kitchen'],
  fm: ['farmers-market', 'supermarket', 'kitchen'],
  cf: ['cafe', 'restaurant', 'kitchen', 'dining-room'],
  rs: ['restaurant', 'cafe', 'dining-room'],
  cs: ['city-streets', 'public-transportation', 'park-garden'],
  pt: ['public-transportation', 'city-streets', 'airport-train'],
  at: ['airport-train', 'public-transportation', 'hotel'],
  cl: ['classroom', 'library', 'office', 'bedroom'],
  of: ['office', 'classroom', 'library', 'bedroom'],
  lb: ['library', 'classroom', 'office', 'living-room'],
  pk: ['park-garden', 'beach-nature', 'city-streets'],
  bn: ['beach-nature', 'park-garden'],
  gm: ['gym-fitness', 'playground'],
  pg: ['playground', 'park-garden'],
  hp: ['hospital-pharmacy'],
};

const EXPLICIT_BATCH_1_ASSESSMENTS: Record<string, CandidateManualAssessment> = {
  // --- Part 1: 10 Explicit Polysemy & Homograph Benchmark Candidates ---
  'noun-bank-financial': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['city-streets', 'civic-services'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Essential city-services noun (A1 in FREQ_6000_DB #1606); preserves explicit distinction between фінансовий банк and річковий берег.',
  },
  'noun-bereh-riverbank': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Useful nature/geography noun (riverbank/shore) contrasted with English false-friend "bank"; clearly identifiable along river and lake scenes.',
  },
  'noun-zamok-castle': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['city-streets', 'travel-landmarks'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Preserves stressed homograph pair за́мок (castle, stress on first syllable) vs замо́к (door lock, stress on second syllable).',
  },
  'noun-zamok-lock': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['hallway-entry', 'bedroom', 'city-streets'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'High-utility daily household security object замо́к (door lock); primary canonical entry (supersedes duplicate id-v2-338).',
  },
  'noun-mysha-computer': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['office', 'classroom', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'of-mouse',
    rationaleEn:
      'Duplicate lexical sense of active verified core item of-mouse (ми́ша, computer mouse). Retain disambiguation metadata on of-mouse and exclude duplicate slot.',
  },
  'of-mouse': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['office', 'classroom', 'bedroom', 'library'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Active verified everyday office/study noun ми́ша (computer mouse); preserves disambiguated technology sense contrasted with noun-mysha-animal (field mouse).',
  },
  'noun-mysha-animal': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['farm-wildlife', 'park-garden'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Preserves distinct biological sense ми́ша (field mouse) contrasted with computer mouse (of-mouse).',
  },
  'noun-klyuch-door': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['hallway-entry', 'kitchen', 'bedroom', 'office'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Top-tier A1 everyday personal object (FREQ_6000_DB #242); clearly identifiable on entryway table or key hook.',
  },
  'noun-klyuch-wrench': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['home-workshop', 'garage-auto'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Canonical entry for the tool sense ключ (га́йковий) / spanner; supersedes duplicate id-v2-355.',
  },
  'noun-lystok-leaf': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Preserves botanical leaf sense листо́к (де́рева) contrasted with а́ркуш (папе́ру) for learners whose native language uses "sheet/leaf" interchangeably.',
  },
  'noun-arkush-sheet': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['classroom', 'office', 'library'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Essential classroom and office noun а́ркуш (sheet of paper); clearly distinct from botanical листо́к.',
  },

  // --- Duplicates, Inflected Plurals, Compositional Phrases & Hypernyms in Core 139 ---
  'lr-bookshelf': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['living-room', 'library', 'bedroom', 'office'],
    recommendation: 'review',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'lb-shelf',
    rationaleEn:
      'Overlaps with lb-shelf (поли́ця, bookshelf/shelf). Review whether to merge книжко́ва поли́ця as an accepted synonym of поли́ця or keep solely for living-room bookcase.',
  },
  'rs-food': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['restaurant', 'kitchen', 'dining-room', 'supermarket'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'High-frequency A1 noun (FREQ_6000_DB #226), but as a superordinate hypernym ("food/meal") it is visually ambiguous if placed on a single ingredient; requires full meal spread framing.',
  },
  'rs-dish': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['restaurant', 'dining-room', 'kitchen'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'Useful dining word (FREQ_6000_DB #677), but visually overlaps with тарі́лка (plate) unless framed specifically as a prepared culinary entree.',
  },
  'fm-flowers': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['farmers-market', 'park-garden', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['inflected_plural_duplicate'],
    duplicateOfVocabularyId: 'pk-flower',
    rationaleEn:
      'Inflected nominative plural (кві́ти) of pk-flower (кві́тка, FREQ_6000_DB #312). Per Section 4 rules, inflected forms must not be counted as separate noun concepts.',
  },
  'cf-cup-coffee': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['cafe', 'kitchen', 'restaurant'],
    recommendation: 'exclude',
    issueFlags: ['compositional_phrase', 'duplicate_concept'],
    duplicateOfVocabularyId: 'cf-coffee',
    rationaleEn:
      'Compositional two-word phrase (ча́шка ка́ви) that duplicates dr-cup (ча́шка) + cf-coffee (ка́ва). Exclude from unique noun count.',
  },
  'cf-teaspoon': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['cafe', 'kitchen', 'dining-room'],
    recommendation: 'review',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'k-spoon',
    rationaleEn:
      'Diminutive ло́жечка (teaspoon) visually overlaps with k-spoon (ло́жка) unless contrasted directly beside a saucer and teacup.',
  },
  'lb-book': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['library', 'classroom', 'bedroom', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'cl-book',
    rationaleEn:
      'Visual synonym duplicate of cl-book (кни́жка, FREQ_6000_DB #129). Keep кни́жка as the canonical concept and include кни́га in acceptedSynonyms.',
  },
  'lb-reader': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['library', 'classroom', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'Person role noun чита́ч (reader, FREQ_6000_DB #1826); visually overlaps with student/person unless depicted actively reading in a library hall.',
  },
  'pk-leaves': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'noun-lystok-leaf',
    rationaleEn:
      'Collective noun ли́стя (foliage/leaves) overlaps visually with noun-lystok-leaf (листо́к). Review whether to merge as collective synonym or restrict to autumn foliage.',
  },
  'gm-mat': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'bd-rug',
    rationaleEn:
      'Uses uninscribed diminutive килимо́к, which also means small floor mat/rug; requires clear rolled yoga/exercise mat context in gym scenes.',
  },
  'gm-bench': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'pk-bench',
    rationaleEn:
      'Near-synonym ла́ва (workout bench) overlaps with pk-bench (ла́вка); keep under review for gym-specific weight bench disambiguation.',
  },

  // --- Part 3: First 51 Supplemental `id-v2-*` Candidates (`noun-concept-0012`..`0081`) ---
  'id-v2-166': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'гусятниця (specialty poultry roasting pan) is rare in everyday conversation and visually indistinguishable from a covered casserole pot.',
  },
  'id-v2-187': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'термо́метр для м’я́са (meat probe thermometer) is an overly specialized culinary gadget that is too small and niche for a 1,200-noun core curriculum.',
  },
  'id-v2-208': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['kitchen', 'bathroom'],
    recommendation: 'keep',
    rationaleEn:
      'гу́бка для по́суду (dish sponge) is encountered daily at every kitchen sink and is visually clear.',
  },
  'id-v2-229': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['bedroom', 'hallway-entry', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'плі́чка (clothes hanger) is an essential everyday wardrobe and shopping object with unmistakable shape.',
  },
  'id-v2-250': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['office', 'bedroom', 'classroom', 'library'],
    recommendation: 'keep',
    rationaleEn:
      'насті́льна ла́мпа (desk lamp) is a high-utility everyday study and bedroom object.',
  },
  'id-v2-271': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['house-exterior', 'city-streets'],
    recommendation: 'review',
    rationaleEn:
      'димохі́д (chimney) is visually clear on house exteriors but belongs only in outdoor architectural scenes, never indoor rooms.',
  },
  'id-v2-292': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'йоржик (toilet brush) has low conversational priority for beginner/intermediate learners compared to core bathroom fixtures.',
  },
  'id-v2-313': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'манікю́рні но́жиці (nail scissors) is a specific subtype of general но́жиці (scissors); review after core stationery/household но́жиці is placed.',
  },
  'id-v2-334': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['house-interior'],
    recommendation: 'review',
    rationaleEn:
      'підва́л (basement/cellar) is an entire room/space rather than a discrete pointable object inside a room; requires architectural cutaway or dedicated scene.',
  },
  'id-v2-355': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'noun-klyuch-wrench',
    rationaleEn:
      'Exact duplicate of noun-klyuch-wrench (ключ (га́йковий), wrench/spanner). Exclude to prevent double-counting.',
  },
  'id-v2-376': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'review',
    rationaleEn:
      'ва́лик маля́рний (paint roller) is recognizable in a home renovation/workshop scene but lower priority than basic hand tools.',
  },
  'id-v2-398': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['park-garden', 'city-streets', 'playground', 'hallway-entry'],
    recommendation: 'keep',
    rationaleEn:
      'дитя́чий візо́к (baby stroller) is a common everyday object seen across parks, streets, and family homes.',
  },
  'id-v2-1165': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'poor_or_ambiguous' as unknown as IdentifyCandidateIssueFlag].filter(
      (x): x is IdentifyCandidateIssueFlag => x === 'overly_specialized'
    ),
    rationaleEn:
      'дверни́й кося́к (doorframe/jamb) is an architectural sub-part that visually collides with две́рі (door) hotspots.',
  },
  'id-v2-1187': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'скиборі́зка (rotary deli food slicer) is a specialized commercial/deli appliance rarely found in ordinary home kitchens.',
  },
  'id-v2-1209': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['dining-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'кільце́ для серве́тки (napkin ring) is a tiny formal table ornament that collides with серве́тка (napkin) markers.',
  },
  'id-v2-1759': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bedroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'органа́йзер для біли́зни (drawer divider organizer) is an interior closet insert with low communicative value.',
  },
  'id-v2-1781': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['balcony-garden'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'unnatural_scene_filler'],
    rationaleEn:
      'кашпо́ підвісне́ (hanging planter pot) is a modifier-padded variant of вазо́н / горщик для квітів.',
  },
  'id-v2-377': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['home-workshop', 'art-studio'],
    recommendation: 'review',
    rationaleEn:
      'ба́нка з фа́рбою (paint can) is suitable for a workshop or hardware store scene if tool/renovation scenes are included.',
  },
  'id-v2-399': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bedroom', 'playground'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'брязкальце (baby rattle) was previously misassigned to kitchen_01.webp; too narrow compared to general і́грашка (toy) and ля́лька (doll).',
  },
  'id-v2-1166': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'камі́нна поли́ця (mantelpiece) is an architectural sub-part of камі́н (fireplace) that was previously misassigned to kitchen scenes.',
  },
  'id-v2-1188': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'суша́рка для о́вочів (food dehydrator) is a niche specialty appliance rarely needed in everyday Ukrainian conversation.',
  },
  'id-v2-1210': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['dining-room'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'етаже́рка для фру́ктів (tiered fruit stand) is an overly specific serving piece that duplicates ми́ска / ва́за для фру́ктів.',
  },
  'id-v2-1760': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bedroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'чохо́л для о́дягу (garment cover bag) is a low-utility storage accessory.',
  },
  'id-v2-1782': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['living-room', 'balcony-garden'],
    recommendation: 'exclude',
    issueFlags: ['unnatural_scene_filler'],
    rationaleEn:
      'підста́вка для кві́тів (plant stand) is a minor furniture accessory that collides with potted plant markers.',
  },
  'id-v2-167': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['kitchen', 'bakery'],
    recommendation: 'keep',
    rationaleEn:
      'деко́ (baking sheet / oven tray) is a genuine, frequently used Ukrainian kitchen noun with clear visual form near an oven.',
  },
  'id-v2-188': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'прихва́тка (oven mitt / potholder) is a practical everyday kitchen item clearly recognizable hanging by a stove.',
  },
  'id-v2-209': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'суша́рка для по́суду (dish drying rack) is common beside kitchen sinks; review whether to keep as a multi-word kitchen item.',
  },
  'id-v2-230': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['bathroom', 'bedroom', 'laundry'],
    recommendation: 'keep',
    rationaleEn:
      'ко́шик для біли́зни (laundry hamper) is a common household item in bathroom and laundry scenes.',
  },
  'id-v2-251': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['bedroom'],
    recommendation: 'review',
    rationaleEn:
      'нічни́к (nightlight) visually overlaps with насті́льна ла́мпа / ла́мпа unless depicted as a small plug-in or children’s bedside glow light.',
  },
  'id-v2-272': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['living-room', 'camping-nature', 'farm-countryside'],
    recommendation: 'keep',
    rationaleEn:
      'дрова́ (firewood) is a common everyday and countryside Ukrainian noun, visually clear in hearth or outdoor campfire scenes.',
  },
  'id-v2-293': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'рушникосуша́рка (heated towel rail) is very common in Ukrainian apartment bathrooms, though markers must not collide with the hanging рушни́к.',
  },
  'id-v2-314': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'кні́псер (nail clipper) is a tiny personal grooming tool (too small for clear room-scene hotspots and a specialized loanword).',
  },
  'id-v2-335': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['house-interior'],
    recommendation: 'review',
    rationaleEn:
      'гори́ще (attic) is an architectural space rather than a discrete object; review for house cross-section scene only.',
  },
  'id-v2-356': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'noun-klyuch-wrench',
    rationaleEn:
      'розвідни́й ключ (adjustable wrench) is an overly specific subtype of ключ (га́йковий) (noun-klyuch-wrench).',
  },
  'id-v2-378': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'шпа́тель (putty knife / drywall spatula) is a specialized plastering tool not needed in the core 1,200-noun curriculum.',
  },
  'id-v2-400': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['bedroom', 'family-home'],
    recommendation: 'review',
    rationaleEn:
      'пусту́шка (pacifier) is a common baby item but very small in full-room scenes; review for close-up nursery/family context.',
  },
  'id-v2-1167': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'камі́нна реші́тка (fireplace grate) was previously misassigned to kitchen_01.webp and is an overly specific sub-part of камі́н.',
  },
  'id-v2-1189': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'йогуртниця (yogurt maker) is a rare specialty appliance with low conversational frequency.',
  },
  'id-v2-1211': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['kitchen', 'dining-room'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'фрукто́вниця (pedestal fruit bowl) is better covered by core ми́ска (bowl) + visible fruits rather than a specialized vessel noun.',
  },
  'id-v2-1761': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bedroom', 'hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'ро́лик для чи́щення о́дягу (adhesive lint roller) is a three-word minor accessory phrase unsuited to core vocabulary.',
  },
  'id-v2-1783': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['living-room', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'сві́чка аромати́чна (scented jar candle) is a modifier-padded duplicate of core сві́чка (candle, id-v2-268).',
  },
  'id-v2-168': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['kitchen', 'bakery'],
    recommendation: 'review',
    rationaleEn:
      'фо́рма для випіка́ння (cake/baking pan) is a multi-word descriptive phrase; review alongside single-word деко́ (baking sheet).',
  },
  'id-v2-189': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['kitchen', 'cafe', 'bakery', 'farmers-market'],
    recommendation: 'keep',
    rationaleEn:
      'фарту́х (apron) is a high-utility everyday noun visible in home kitchens, cafés, bakeries, and market stalls.',
  },
  'id-v2-210': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['bathroom', 'kitchen', 'public-restroom'],
    recommendation: 'keep',
    rationaleEn:
      'доза́тор ми́ла (liquid soap dispenser) is ubiquitous beside modern bathroom and kitchen sinks.',
  },
  'id-v2-231': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    candidateSceneCategories: ['bedroom', 'laundry', 'living-room'],
    recommendation: 'keep',
    rationaleEn:
      'прасува́льна до́шка (ironing board) pairs naturally with пра́ска (iron) in household laundry scenes.',
  },
  'id-v2-252': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['living-room', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'абажу́р (lampshade) is a sub-part of ла́мпа / торше́р; requires non-overlapping pin placement if both lamp and shade are targeted.',
  },
  'id-v2-273': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'кочерга́ (fireplace poker) is a rare hearth tool that was previously cited in the user problem statement as inappropriate filler.',
  },
  'id-v2-294': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'ba-towel',
    rationaleEn:
      'ба́нний рушни́к (bath towel) is a modifier-padded duplicate of core ba-towel (рушни́к, FREQ_6000_DB #693).',
  },
  'id-v2-315': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'пи́лка для ні́гтів (nail file) is too small to identify reliably in a room-scale visual scene.',
  },
  'id-v2-336': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    candidateSceneCategories: ['hallway-entry', 'school-corridor', 'hotel', 'office'],
    recommendation: 'keep',
    rationaleEn:
      'коридо́р (hallway / corridor) is an essential everyday Ukrainian architectural noun used across home, school, hotel, and office contexts.',
  },
  'id-v2-357': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    candidateSceneCategories: ['home-workshop', 'garage-auto'],
    recommendation: 'keep',
    rationaleEn:
      'дриль (power drill) is one of the most recognizable and practical household repair tools for a workshop scene.',
  },
};

function buildBatch1Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch1CandidateEntries();
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  return candidates.map((entry, idx) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = freqMatch ? freqMatch.rank : null;
    const crossReferencedCourseModuleId = courseMatch ? courseMatch.moduleId : null;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_1_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 1,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    // Standard original 20-category core vocabulary item (e.g., k-table, bd-bed, sm-bread, cs-car, etc.)
    const prefix = entry.vocabularyId.split('-')[0];
    const defaultCats = DEFAULT_CATEGORY_REUSE_BY_PREFIX[prefix] || [
      entry.suitableCategoryIds[0] || 'kitchen',
    ];

    const isHighDailyPrefix = [
      'k',
      'bd',
      'ba',
      'lr',
      'dr',
      'sm',
      'fm',
      'cf',
      'cs',
      'pt',
    ].includes(prefix);
    const isExtendedPrefix = ['gm', 'pg', 'bn'].includes(prefix);

    const recommendedPriority: IdentifyCurriculumPriorityLevel = isHighDailyPrefix
      ? 'essential_everyday'
      : isExtendedPrefix &&
          (crossReferencedFreqDbRank === null || crossReferencedFreqDbRank > 1000)
        ? 'useful_extended'
        : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const rankNote =
      recordedRegistryFreqRank !== null
        ? `verified in FREQ_6000_DB (#${recordedRegistryFreqRank})`
        : crossReferencedFreqDbRank !== null
          ? `present in FREQ_6000_DB (#${crossReferencedFreqDbRank}, previously unlinked)`
          : crossReferencedCourseModuleId !== null
            ? `taught in Ukrainian Course Module ${crossReferencedCourseModuleId}`
            : 'core 20-category everyday noun';

    return {
      batchNumber: 1,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      candidateSceneCategories: defaultCats,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility everyday concrete noun (${rankNote}); visually unmistakable and reusable across ${defaultCats.join(', ')}.`,
    };
  });
}

export const BATCH_1_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch1Reviews();

export function getBatch1CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_1_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 4B. Batch 2 (Candidates 201..400) Deterministic Selector & Review Builder
// ----------------------------------------------------------------------------

/**
 * Deterministically selects the 200 Batch 2 candidates using the exact
 * evidence-priority ordering over all 1,800 remaining unreviewed entries
 * after Batch 1 (prioritizing verified `FREQ_6000_DB` instructional sequence
 * rank and `COURSE_MODULES` curriculum presence).
 */
export function selectBatch2CandidateEntries(): IdentifyMasterNounEntry[] {
  const reviewedBatch1Ids = new Set(
    BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId)
  );
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  const unreviewedAfterBatch1 = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedBatch1Ids.has(n.vocabularyId)
  );

  const scored = unreviewedAfterBatch1.map((entry) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);
    const freqBonus = freqMatch ? 10000 - freqMatch.rank : 0;
    const courseBonus = courseMatch ? 3000 : 0;
    return {
      entry,
      score: freqBonus + courseBonus,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.conceptId.localeCompare(b.entry.conceptId);
  });

  return scored.slice(0, 200).map((s) => s.entry);
}

function inferDefaultVisualFramingForBatch2Entry(
  entry: IdentifyMasterNounEntry
): IdentifyVisualSceneFraming {
  const topic = entry.topicGroupId;
  const uk = entry.uk;
  const en = entry.en.toLowerCase();

  if (
    topic === 'body-health' ||
    ['обли́ччя', 'о́ко', 'голова́', 'спина́', 'нога́', 'ву́хо', 'зуб', 'па́лець'].includes(uk)
  ) {
    return 'human_body_portrait_illustration';
  }
  if (
    en.includes('driver') ||
    en.includes('chef') ||
    en.includes('painter') ||
    en.includes('musician') ||
    en.includes('fisherman') ||
    en.includes('mail carrier') ||
    en.includes('firefighter') ||
    en.includes('tailor') ||
    en.includes('baker') ||
    en.includes('dentist')
  ) {
    return 'public_service_environment';
  }
  if (
    topic === 'clothing-belongings' ||
    en.includes('shirt') ||
    en.includes('dress') ||
    en.includes('coat') ||
    en.includes('boots') ||
    en.includes('shoes') ||
    en.includes('socks') ||
    en.includes('skirt') ||
    en.includes('jacket') ||
    en.includes('gloves') ||
    en.includes('scarf') ||
    en.includes('hat') ||
    en.includes('necktie') ||
    en.includes('poncho') ||
    en.includes('vyshyvanka')
  ) {
    return 'clothing_wardrobe_display';
  }
  if (
    en.includes('button') ||
    en.includes('zipper') ||
    en.includes('wallet') ||
    en.includes('comb') ||
    en.includes('perfume') ||
    en.includes('necklace') ||
    en.includes('syringe') ||
    en.includes('bandage') ||
    en.includes('envelope') ||
    en.includes('parcel') ||
    en.includes('postcard') ||
    en.includes('diploma') ||
    en.includes('dictionary') ||
    en.includes('textbook') ||
    en.includes('pysanka') ||
    en.includes('hammer')
  ) {
    return 'close_up_detail';
  }
  if (topic === 'food-dining') {
    if (
      en.includes('beetroot') ||
      en.includes('garlic') ||
      en.includes('watermelon') ||
      en.includes('lemon') ||
      en.includes('orange') ||
      en.includes('plum') ||
      en.includes('cherry') ||
      en.includes('strawberry') ||
      en.includes('shrimp') ||
      en.includes('turkey') ||
      en.includes('chicken')
    ) {
      return 'market_counter_display';
    }
    return 'food_table_display';
  }
  if (
    topic === 'nature-animals' ||
    en.includes('river') ||
    en.includes('waterfall') ||
    en.includes('cave') ||
    en.includes('island') ||
    en.includes('cliff') ||
    en.includes('rainbow') ||
    en.includes('star') ||
    en.includes('sunflower') ||
    en.includes('rose') ||
    en.includes('dandelion') ||
    en.includes('poppy') ||
    en.includes('stork') ||
    en.includes('hedgehog') ||
    en.includes('horse') ||
    en.includes('honeybee') ||
    en.includes('dolphin')
  ) {
    return 'outdoor_nature_scene';
  }
  if (
    en.includes('trolleybus') ||
    en.includes('cathedral') ||
    en.includes('city hall') ||
    en.includes('bell tower') ||
    en.includes('church') ||
    en.includes('shop window') ||
    en.includes('gates') ||
    en.includes('roof') ||
    en.includes('porch') ||
    en.includes('balcony') ||
    en.includes('car trunk') ||
    en.includes('atm')
  ) {
    return 'street_urban_scene';
  }
  return 'full_room_scene';
}

function inferCleanSceneCategoriesForBatch2Entry(
  entry: IdentifyMasterNounEntry,
  framing: IdentifyVisualSceneFraming
): string[] {
  switch (framing) {
    case 'human_body_portrait_illustration':
      return ['body-health', 'hospital-pharmacy', 'portrait-family'];
    case 'clothing_wardrobe_display':
      return ['bedroom', 'clothing-store', 'hallway-entry'];
    case 'market_counter_display':
      return ['farmers-market', 'supermarket', 'kitchen'];
    case 'food_table_display':
      return ['kitchen', 'dining-room', 'cafe', 'restaurant', 'supermarket'];
    case 'outdoor_nature_scene':
      return ['park-garden', 'beach-nature', 'countryside'];
    case 'street_urban_scene':
      return ['city-streets', 'public-transportation', 'shopping-district'];
    case 'public_service_environment':
      return ['office', 'classroom', 'city-streets', 'hospital-pharmacy'];
    case 'close_up_detail':
      return ['bedroom', 'office', 'classroom', 'hospital-pharmacy'];
    default:
      return ['kitchen', 'bedroom', 'living-room', 'bathroom'];
  }
}

function buildBatch2Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch2CandidateEntries();
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  return candidates.map((entry, idx) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = freqMatch ? freqMatch.rank : null;
    const crossReferencedCourseModuleId = courseMatch ? courseMatch.moduleId : null;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_2_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 2,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch2Entry(entry);
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch2Entry(
      entry,
      recommendedVisualFraming
    );

    const isEssentialRank =
      crossReferencedFreqDbRank !== null && crossReferencedFreqDbRank <= 860;
    const isExtendedNatureOrLandmark =
      recommendedVisualFraming === 'outdoor_nature_scene' &&
      crossReferencedFreqDbRank !== null &&
      crossReferencedFreqDbRank > 1000;

    const recommendedPriority: IdentifyCurriculumPriorityLevel = isEssentialRank
      ? 'essential_everyday'
      : isExtendedNatureOrLandmark
        ? 'useful_extended'
        : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : 'supplemental everyday noun';

    return {
      batchNumber: 2,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

export const BATCH_2_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch2Reviews();

export function getBatch2CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_2_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 4B. Batch 3 Candidate Selection & Curation (Next 200 Candidates: 401..600)
// ----------------------------------------------------------------------------

function selectBatch3CandidateEntries(): IdentifyMasterNounEntry[] {
  const batch1And2VocabIds = new Set<string>([
    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
  ]);
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !batch1And2VocabIds.has(n.vocabularyId)
  );

  const scored = unreviewed.map((entry) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);
    const freqBonus = freqMatch ? 10000 - freqMatch.rank : 0;
    const courseBonus = courseMatch ? 3000 : 0;
    return {
      entry,
      score: freqBonus + courseBonus,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.conceptId.localeCompare(b.entry.conceptId);
  });

  return scored.slice(0, 200).map((s) => s.entry);
}

function inferDefaultVisualFramingForBatch3Entry(
  entry: IdentifyMasterNounEntry
): IdentifyVisualSceneFraming {
  const uk = entry.uk.toLowerCase();
  const en = entry.en.toLowerCase();

  if (
    en.includes('tailor') ||
    en.includes('baker') ||
    en.includes('intercom') ||
    en.includes('doorbell')
  ) {
    return 'public_service_environment';
  }
  if (
    en.includes('bathrobe') ||
    en.includes('slippers') ||
    en.includes('coat') ||
    en.includes('apron')
  ) {
    return 'clothing_wardrobe_display';
  }
  if (
    en.includes('crepes') ||
    en.includes('cheese') ||
    en.includes('mustard') ||
    en.includes('teapot') ||
    en.includes('tray')
  ) {
    return 'food_table_display';
  }
  if (
    en.includes('rainbow') ||
    en.includes('shovel') ||
    en.includes('rake') ||
    en.includes('watering can') ||
    en.includes('hose') ||
    en.includes('wheelbarrow') ||
    en.includes('lawnmower') ||
    en.includes('mailbox') ||
    uk.includes('весе́лка') ||
    uk.includes('лопа́та') ||
    uk.includes('граблі́')
  ) {
    return 'outdoor_nature_scene';
  }
  if (en.includes('car trunk') || uk.includes('бага́жник')) {
    return 'street_urban_scene';
  }
  if (
    en.includes('zipper') ||
    en.includes('outlet') ||
    en.includes('socket') ||
    en.includes('switch') ||
    en.includes('extension cord') ||
    en.includes('padlock') ||
    en.includes('keychain') ||
    en.includes('corkscrew') ||
    en.includes('peeler') ||
    en.includes('grater') ||
    en.includes('strainer') ||
    en.includes('tongs') ||
    en.includes('ladle') ||
    en.includes('spatula') ||
    en.includes('whisk') ||
    en.includes('opener') ||
    en.includes('sponge') ||
    en.includes('soap dish') ||
    en.includes('toothbrush') ||
    en.includes('toothpaste') ||
    en.includes('razor') ||
    en.includes('tweezers') ||
    en.includes('scissors') ||
    en.includes('clippers') ||
    en.includes('file') ||
    en.includes('screwdriver') ||
    en.includes('pliers') ||
    en.includes('wrench') ||
    en.includes('tape measure') ||
    en.includes('screw') ||
    en.includes('nail') ||
    en.includes('flashlight') ||
    en.includes('candle')
  ) {
    return 'close_up_detail';
  }
  return 'full_room_scene';
}

function inferCleanSceneCategoriesForBatch3Entry(
  entry: IdentifyMasterNounEntry,
  framing: IdentifyVisualSceneFraming
): string[] {
  const en = entry.en.toLowerCase();
  if (framing === 'outdoor_nature_scene') {
    return ['park-garden', 'countryside'];
  }
  if (framing === 'street_urban_scene') {
    return ['city-streets', 'public-transportation'];
  }
  if (framing === 'public_service_environment') {
    return ['city-streets', 'hallway-entry', 'shopping-district'];
  }
  if (framing === 'clothing_wardrobe_display') {
    return ['bedroom', 'bathroom', 'hallway-entry'];
  }
  if (framing === 'food_table_display') {
    return ['kitchen', 'dining-room', 'cafe'];
  }
  if (
    en.includes('shower') ||
    en.includes('bathtub') ||
    en.includes('toilet') ||
    en.includes('towel') ||
    en.includes('soap') ||
    en.includes('shampoo') ||
    en.includes('sponge') ||
    en.includes('Scale') ||
    en.includes('scale') ||
    en.includes('razor') ||
    en.includes('toothbrush') ||
    en.includes('hairdryer') ||
    en.includes('washbasin') ||
    en.includes('faucet') ||
    en.includes('laundry') ||
    en.includes('clothespin')
  ) {
    return ['bathroom'];
  }
  if (
    en.includes('mattress') ||
    en.includes('pillowcase') ||
    en.includes('duvet') ||
    en.includes('sheet') ||
    en.includes('bedspread') ||
    en.includes('dresser') ||
    en.includes('nightstand') ||
    en.includes('hanger') ||
    en.includes('alarm') ||
    en.includes('doll') ||
    en.includes('teddy') ||
    en.includes('blocks') ||
    en.includes('puzzle')
  ) {
    return ['bedroom', 'living-room'];
  }
  if (
    en.includes('sofa') ||
    en.includes('armchair') ||
    en.includes('coffee table') ||
    en.includes('bookcase') ||
    en.includes('shelf') ||
    en.includes('curtain') ||
    en.includes('blinds') ||
    en.includes('chandelier') ||
    en.includes('floor lamp') ||
    en.includes('sconce') ||
    en.includes('vase') ||
    en.includes('frame') ||
    en.includes('clock') ||
    en.includes('heater') ||
    en.includes('fan') ||
    en.includes('air conditioner') ||
    en.includes('fireplace')
  ) {
    return ['living-room', 'bedroom'];
  }
  if (
    en.includes('drill') ||
    en.includes('screwdriver') ||
    en.includes('pliers') ||
    en.includes('wrench') ||
    en.includes('tape measure') ||
    en.includes('toolbox') ||
    en.includes('ladder') ||
    en.includes('nail') ||
    en.includes('screw') ||
    en.includes('padlock')
  ) {
    return ['garage-workshop', 'hallway-entry'];
  }
  return ['kitchen', 'dining-room'];
}

function buildBatch3Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch3CandidateEntries();
  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();

  return candidates.map((entry, idx) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = freqMatch ? freqMatch.rank : null;
    const crossReferencedCourseModuleId = courseMatch ? courseMatch.moduleId : null;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_3_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 3,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch3Entry(entry);
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch3Entry(
      entry,
      recommendedVisualFraming
    );

    const isEssentialHousehold =
      crossReferencedFreqDbRank !== null ||
      crossReferencedCourseModuleId !== null ||
      [
        'id-v2-234', // пра́льна маши́на
        'id-v2-154', // електроча́йник
        'id-v2-155', // кавова́рка
        'id-v2-211', // матра́ц
        'id-v2-217', // ту́мбочка
        'id-v2-218', // комо́д
        'id-v2-222', // журна́льний сто́лик
        'id-v2-277', // кондиціоне́р
        'id-v2-276', // вентиля́тор
        'id-v2-275', // обігріва́ч
        'id-v2-238', // шва́бра
        'id-v2-239', // ві́ник
        'id-v2-254', // што́ра
        'id-v2-284', // душова́ кабі́на
        'id-v2-318', // туале́тний папі́р
        'id-v2-1177', // пра́льний порошо́к
        'id-v2-295', // хала́т
        'id-v2-296', // ка́пці
        'id-v2-280', // розе́тка
      ].includes(entry.vocabularyId);

    const isExtendedToolOrToy =
      entry.en.toLowerCase().includes('wrench') ||
      entry.en.toLowerCase().includes('pliers') ||
      entry.en.toLowerCase().includes('wheelbarrow') ||
      entry.en.toLowerCase().includes('lawnmower') ||
      entry.en.toLowerCase().includes('sconce') ||
      entry.en.toLowerCase().includes('pouf');

    const recommendedPriority: IdentifyCurriculumPriorityLevel = isEssentialHousehold
      ? 'essential_everyday'
      : isExtendedToolOrToy
        ? 'useful_extended'
        : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : 'supplemental everyday household/lifestyle noun';

    return {
      batchNumber: 3,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

export const BATCH_3_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch3Reviews();

export function getBatch3CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_3_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 4C. Batch 4 Multi-Domain Pedagogical Selection & Curation (Candidates 601..800)
// ----------------------------------------------------------------------------

function buildSlashAwareEvidenceMaps(): {
  freqRankByPartUk: Map<string, number>;
  courseModuleByPartUk: Map<string, string>;
} {
  const freqRankByPartUk = new Map<string, number>();
  for (const item of FREQ_6000_DB) {
    if ((item.pos || '').toUpperCase().startsWith('NOUN')) {
      for (const part of item.ru.split('/')) {
        const key = stripUkrainianStressAndParens(part);
        if (key && !freqRankByPartUk.has(key)) {
          freqRankByPartUk.set(key, item.rank);
        }
      }
    }
  }

  const courseModuleByPartUk = new Map<string, string>();
  for (const mod of COURSE_MODULES) {
    for (const tuple of mod.vocab || []) {
      const [uk, pos] = tuple;
      if ((pos || '').toUpperCase().startsWith('NOUN')) {
        for (const part of uk.split('/')) {
          const key = stripUkrainianStressAndParens(part);
          if (key && !courseModuleByPartUk.has(key)) {
            courseModuleByPartUk.set(key, mod.id);
          }
        }
      }
    }
  }

  return { freqRankByPartUk, courseModuleByPartUk };
}

function rankUnreviewedByMultiDomainPedagogicalUtility(
  unreviewed: readonly IdentifyMasterNounEntry[]
): Array<{
  entry: IdentifyMasterNounEntry;
  bucket: IdentifyBatch4PedagogicalDomainBucket;
  bestFreqRank: number | null;
  bestCourseModuleId: string | null;
  score: number;
}> {
  const { freqRankByPartUk, courseModuleByPartUk } = buildSlashAwareEvidenceMaps();

  const allScored = unreviewed.map((entry) => {
    const parts = entry.uk.split('/').map(stripUkrainianStressAndParens);
    let bestFreqRank: number | null = null;
    let bestCourseModuleId: string | null = null;

    for (const p of parts) {
      const fRank = freqRankByPartUk.get(p);
      if (
        typeof fRank === 'number' &&
        (bestFreqRank === null || fRank < bestFreqRank)
      ) {
        bestFreqRank = fRank;
      }
      const cMod = courseModuleByPartUk.get(p);
      if (cMod && !bestCourseModuleId) {
        bestCourseModuleId = cMod;
      }
    }

    const idNum = parseMasterVocabularyNumericId(entry.vocabularyId);
    const hasCurriculumEvidence =
      bestFreqRank !== null || bestCourseModuleId !== null;
    const freqBonus = bestFreqRank !== null ? 10000 - bestFreqRank : 0;
    const courseBonus = bestCourseModuleId !== null ? 3000 : 0;
    const coreRangeBonus = idNum <= 1149 ? 2500 : 0;
    const bareNoParens = stripUkrainianStressAndParens(entry.uk);
    const isSingleWordOrSlashPair =
      !bareNoParens.includes(' ') || entry.uk.includes('/');
    const headwordSimplicityBonus = isSingleWordOrSlashPair ? 400 : 0;

    return {
      entry,
      bucket: classifyEntryIntoPedagogicalDomainBucket(entry),
      hasCurriculumEvidence,
      bestFreqRank,
      bestCourseModuleId,
      idNum,
      score:
        freqBonus +
        courseBonus +
        coreRangeBonus +
        headwordSimplicityBonus,
    };
  });

  const evidenceMatched = allScored
    .filter((x) => x.hasCurriculumEvidence)
    .sort((a, b) => b.score - a.score || a.idNum - b.idNum);
  const nonEvidence = allScored.filter((x) => !x.hasCurriculumEvidence);

  const byBucket = new Map<
    IdentifyBatch4PedagogicalDomainBucket,
    typeof nonEvidence
  >();
  for (const b of IDENTIFY_BATCH_4_DOMAIN_BUCKET_ORDER) {
    byBucket.set(
      b,
      nonEvidence
        .filter((x) => x.bucket === b)
        .sort(
          (a, b) =>
            b.score - a.score ||
            a.idNum - b.idNum ||
            a.entry.conceptId.localeCompare(b.entry.conceptId)
        )
    );
  }

  const ordered = [...evidenceMatched];
  let idx = 0;
  while (ordered.length < unreviewed.length) {
    let added = false;
    for (const b of IDENTIFY_BATCH_4_DOMAIN_BUCKET_ORDER) {
      const arr = byBucket.get(b)!;
      if (idx < arr.length) {
        ordered.push(arr[idx]);
        added = true;
      }
    }
    if (!added) break;
    idx++;
  }

  return ordered;
}

function selectBatch4CandidateEntries(): Array<{
  entry: IdentifyMasterNounEntry;
  bucket: IdentifyBatch4PedagogicalDomainBucket;
  bestFreqRank: number | null;
  bestCourseModuleId: string | null;
}> {
  const reviewedVocabIds = new Set<string>([
    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
  ]);

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedVocabIds.has(n.vocabularyId)
  );

  return rankUnreviewedByMultiDomainPedagogicalUtility(unreviewed).slice(0, 200);
}

function inferDefaultVisualFramingForBatch4Entry(
  entry: IdentifyMasterNounEntry,
  bucket: IdentifyBatch4PedagogicalDomainBucket
): IdentifyVisualSceneFraming {
  const en = entry.en.toLowerCase();
  const uk = entry.uk.toLowerCase();

  if (
    uk.includes('воло́сся') ||
    uk.includes('ніс') ||
    uk.includes('рот') ||
    uk.includes('ши́я') ||
    uk.includes('плече́') ||
    uk.includes('колі́но') ||
    uk.includes('стопа́') ||
    uk.includes('рука́')
  ) {
    return 'human_body_portrait_illustration';
  }
  if (
    en.includes('flight attendant') ||
    en.includes('photographer') ||
    en.includes('tour guide') ||
    en.includes('terminal') ||
    en.includes('scanner') ||
    en.includes('conveyor') ||
    en.includes('counter') ||
    en.includes('carousel') ||
    en.includes('overhead bin') ||
    en.includes('validator') ||
    en.includes('projector')
  ) {
    return 'public_service_environment';
  }
  if (bucket === 'clothing_belongings') {
    return 'clothing_wardrobe_display';
  }
  if (bucket === 'food_dining') {
    return 'market_counter_display';
  }
  if (bucket === 'nature_animals') {
    if (en.includes('compass') || en.includes('petal') || en.includes('stem') || en.includes('bud')) {
      return 'close_up_detail';
    }
    return 'outdoor_nature_scene';
  }
  if (bucket === 'city_shopping' || bucket === 'travel_transport') {
    if (en.includes('keycard') || en.includes('life vest') || en.includes('luggage tag')) {
      return 'close_up_detail';
    }
    return 'street_urban_scene';
  }
  if (
    bucket === 'school_office' ||
    bucket === 'tech_media' ||
    en.includes('corkscrew') ||
    en.includes('candlestick') ||
    en.includes('cloth')
  ) {
    if (
      en.includes('globe') ||
      en.includes('piano') ||
      en.includes('tripod') ||
      en.includes('drone')
    ) {
      return 'full_room_scene';
    }
    return 'close_up_detail';
  }
  return 'full_room_scene';
}

function inferCleanSceneCategoriesForBatch4Entry(
  entry: IdentifyMasterNounEntry,
  bucket: IdentifyBatch4PedagogicalDomainBucket,
  framing: IdentifyVisualSceneFraming
): string[] {
  if (framing === 'human_body_portrait_illustration') {
    return ['body-health', 'hospital-pharmacy', 'portrait-family'];
  }
  switch (bucket) {
    case 'food_dining':
      return ['farmers-market', 'supermarket', 'kitchen', 'dining-room'];
    case 'clothing_belongings':
      return ['bedroom', 'clothing-store', 'hallway-entry'];
    case 'body_health_sports':
      return ['gym-fitness', 'park-garden', 'hospital-pharmacy'];
    case 'tech_media':
      return ['office', 'living-room', 'bedroom'];
    case 'school_office':
      return ['classroom', 'office', 'library'];
    case 'city_shopping':
      return ['city-streets', 'supermarket', 'shopping-district'];
    case 'travel_transport':
      return ['airport-station', 'public-transportation', 'city-streets'];
    case 'nature_animals':
      return ['park-garden', 'beach-nature', 'countryside'];
    case 'home_household':
    default:
      return ['living-room', 'kitchen', 'bedroom'];
  }
}

function buildBatch4Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch4CandidateEntries();

  return candidates.map((item, idx) => {
    const { entry, bucket, bestFreqRank, bestCourseModuleId } = item;

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = bestFreqRank;
    const crossReferencedCourseModuleId = bestCourseModuleId;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_4_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 4,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch4Entry(
      entry,
      bucket
    );
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch4Entry(
      entry,
      bucket,
      recommendedVisualFraming
    );

    const isEssentialEveryday =
      crossReferencedFreqDbRank !== null ||
      crossReferencedCourseModuleId !== null ||
      [
        'id-v2-413', // мандари́н
        'id-v2-417', // пе́рсик
        'id-v2-418', // абрико́с
        'id-v2-421', // чере́шня
        'id-v2-422', // виногра́д
        'id-v2-424', // мали́на
        'id-v2-817', // футбо́лка
        'id-v2-819', // све́тр
        'id-v2-827', // пухови́к
        'id-v2-829', // джи́нси
        'id-v2-830', // шо́рти
        'id-v2-835', // піжа́ма
        'id-v2-842', // ту́флі
        'id-v2-843', // кросі́вки
        'id-v2-1025', // воло́сся
        'id-v2-1028', // ніс
        'id-v2-1029', // рот
        'id-v2-1031', // ши́я
        'id-v2-1032', // плече́
        'id-v2-1037', // колі́но
        'id-v2-1089', // планше́т
        'id-v2-1092', // наву́шники
        'id-v2-1096', // ро́утер / маршрутиза́тор
        'id-v2-1097', // фле́шка
        'id-v2-1101', // паверба́нк
        'id-v2-1108', // фотоапара́т
        'id-v2-741', // гло́бус
        'id-v2-746', // блокно́т
        'id-v2-751', // пена́л
        'id-v2-755', // флома́стер
        'id-v2-757', // гу́мка / стира́чка
        'id-v2-759', // ліні́йка
        'id-v2-606', // па́м’ятник
        'id-v2-607', // фонта́н
        'id-v2-623', // ви́віска
        'id-v2-638', // платі́жний терміна́л
        'id-v2-653', // поже́жна маши́на
        'id-v2-691', // ваго́н
        'id-v2-707', // вантажі́вка
        'id-v2-934', // хма́ра
        'id-v2-247', // лю́стра
        'id-v2-265', // вазо́н
      ].includes(entry.vocabularyId);

    const isExtendedItem =
      enIncludesAny(entry.en, [
        'kettlebell',
        'pull-up bar',
        'stability ball',
        'drone',
        'tripod',
        'beehive',
        'icicle',
        'candlestick',
      ]);

    const recommendedPriority: IdentifyCurriculumPriorityLevel =
      isEssentialEveryday
        ? 'essential_everyday'
        : isExtendedItem
          ? 'useful_extended'
          : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : `high-utility ${bucket.replace(/_/g, ' ')} noun`;

    return {
      batchNumber: 4,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

function enIncludesAny(en: string, substrings: readonly string[]): boolean {
  const lower = en.toLowerCase();
  return substrings.some((s) => lower.includes(s));
}

export const BATCH_4_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch4Reviews();

export function getBatch4CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_4_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 4D. Batch 5 Multi-Domain Pedagogical Selection & Curation (Candidates 801..1000)
// ----------------------------------------------------------------------------

function selectBatch5CandidateEntries(): Array<{
  entry: IdentifyMasterNounEntry;
  bucket: IdentifyBatch4PedagogicalDomainBucket;
  bestFreqRank: number | null;
  bestCourseModuleId: string | null;
}> {
  const reviewedVocabIds = new Set<string>([
    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
  ]);

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedVocabIds.has(n.vocabularyId)
  );

  return rankUnreviewedByMultiDomainPedagogicalUtility(unreviewed).slice(0, 200);
}

function buildBatch5Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch5CandidateEntries();

  return candidates.map((item, idx) => {
    const { entry, bucket, bestFreqRank, bestCourseModuleId } = item;

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = bestFreqRank;
    const crossReferencedCourseModuleId = bestCourseModuleId;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_5_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 5,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch4Entry(
      entry,
      bucket
    );
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch4Entry(
      entry,
      bucket,
      recommendedVisualFraming
    );

    const isEssentialEveryday =
      crossReferencedFreqDbRank !== null ||
      crossReferencedCourseModuleId !== null ||
      [
        'id-v2-288', // уніта́з
        'id-v2-330', // парка́н
        'id-v2-333', // гара́ж
        'id-v2-352', // викру́тка
        'id-v2-447', // бро́колі
        'id-v2-450', // баклажа́н
        'id-v2-451', // кабачо́к
        'id-v2-452', // гарбу́з
        'id-v2-453', // реди́ска
        'id-v2-456', // шпина́т
        'id-v2-460', // кріп
        'id-v2-461', // петру́шка
        'id-v2-464', // кукуру́дза
        'id-v2-465', // горо́х
        'id-v2-466', // квасо́ля
        'id-v2-469', // печери́ця
        'id-v2-658', // поліце́йська маши́на
        'id-v2-687', // ремі́нь безпе́ки
        'id-v2-694', // ко́лія залізни́чна
        'id-v2-702', // квиткова́ ка́са
        'id-v2-703', // автома́т квитко́вий
        'id-v2-713', // лобове́ скло
        'id-v2-728', // рецепція готе́лю
        'id-v2-731', // но́мер готе́льний
        'id-v2-747', // щоде́нник шкільни́й
        'id-v2-769', // калькуля́тор
        'id-v2-848', // ке́пка / бейсбо́лка
        'id-v2-851', // ху́стка
        'id-v2-859', // кише́ня
        'id-v2-860', // комі́р
        'id-v2-861', // рука́в
        'id-v2-864', // нару́чний годинни́к
        'id-v2-865', // каблу́чка / пе́рстень
        'id-v2-866', // сере́жки
        'id-v2-868', // брасле́т
        'id-v2-872', // портфе́ль
        'id-v2-968', // кро́лик
        'id-v2-969', // півень
        'id-v2-971', // ведмі́дь
        'id-v2-972', // вовк
        'id-v2-973', // лиси́ця
        'id-v2-974', // оле́нь
        'id-v2-979', // жа́ба
        'id-v2-980', // черепа́ха
        'id-v2-981', // змія́
        'id-v2-986', // го́луб
        'id-v2-994', // мура́ха
        'id-v2-995', // паву́к
        'id-v2-1004', // інвалі́дний візо́к
        'id-v2-1012', // меди́чна ма́ска
        'id-v2-1070', // ко́взани
        'id-v2-1073', // ли́жі
        'id-v2-1122', // скри́пка
        'id-v2-1130', // бараба́н
      ].includes(entry.vocabularyId);

    const isExtendedItem = enIncludesAny(entry.en, [
      'oar',
      'paddle',
      'shuttlecock',
      'flippers',
      'swim fins',
      'kite',
      'easel',
      'colonnade',
      'gazebo',
      'speed bump',
      'bollard',
    ]);

    const recommendedPriority: IdentifyCurriculumPriorityLevel =
      isEssentialEveryday
        ? 'essential_everyday'
        : isExtendedItem
          ? 'useful_extended'
          : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : `high-utility ${bucket.replace(/_/g, ' ')} noun`;

    return {
      batchNumber: 5,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

export const BATCH_5_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch5Reviews();

export function getBatch5CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_5_CANDIDATE_REVIEWS;
}

export function getBatch5CoverageGapPlanningView(): IdentifyBatch5CoverageGapPlanningView {
  const acceptedVocabularyIds = new Set<string>();
  for (const r of [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
    ...BATCH_7_CANDIDATE_REVIEWS,
  ]) {
    if (r.recommendation === 'keep' && !r.duplicateOfVocabularyId) {
      acceptedVocabularyIds.add(r.vocabularyId);
    }
  }
  return getBatch5VocabularyGapReconciliationPlan(acceptedVocabularyIds);
}

// ----------------------------------------------------------------------------
// 4E. Batch 6 Multi-Domain Pedagogical Selection & Curation (Candidates 1001..1200)
// ----------------------------------------------------------------------------

function selectBatch6CandidateEntries(): Array<{
  entry: IdentifyMasterNounEntry;
  bucket: IdentifyBatch4PedagogicalDomainBucket;
  bestFreqRank: number | null;
  bestCourseModuleId: string | null;
}> {
  const reviewedVocabIds = new Set<string>([
    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_5_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
  ]);

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedVocabIds.has(n.vocabularyId)
  );

  return rankUnreviewedByMultiDomainPedagogicalUtility(unreviewed).slice(0, 200);
}

function buildBatch6Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch6CandidateEntries();

  return candidates.map((item, idx) => {
    const { entry, bucket, bestFreqRank, bestCourseModuleId } = item;

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = bestFreqRank;
    const crossReferencedCourseModuleId = bestCourseModuleId;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_6_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 6,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch4Entry(
      entry,
      bucket
    );
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch4Entry(
      entry,
      bucket,
      recommendedVisualFraming
    );

    const isEssentialEveryday =
      crossReferencedFreqDbRank !== null ||
      crossReferencedCourseModuleId !== null ||
      [
        'id-v2-878', // пома́да губна́
        'id-v2-374', // драби́на
        'id-v2-486', // йо́гурт
        'id-v2-492', // яйце́
        'id-v2-495', // бато́н
        'id-v2-498', // круаса́н
        'id-v2-500', // бу́блик
        'id-v2-504', // пиріжо́к
        'id-v2-509', // ва́фля
        'id-v2-515', // варе́ння
        'id-v2-520', // рі́с
        'id-v2-522', // вівся́нка
        'id-v2-599', // хмарочо́с
        'id-v2-600', // багатоповерхі́вка
        'id-v2-611', // бордю́р
        'id-v2-645', // цінни́к
        'id-v2-647', // купю́ра
        'id-v2-648', // моне́та
        'id-v2-632', // поштома́т
        'id-v2-628', // ескала́тор
        'id-v2-627', // турніке́т
        'id-v2-1506', // вітрі́вка
        'id-v2-1521', // в’єтна́мки / шльо́панці
        'id-v2-1524', // шнурі́вка
        'id-v2-1529', // екосу́мка / шо́пер
        'id-v2-955', // чо́вен веслови́й
        'id-v2-1392', // гелікопте́р / вертолі́т
        'id-v2-1019', // мазь у тю́бику
        'id-v2-1022', // реце́пт ліка́рський
        'id-v2-1057', // меда́ль спортивна
        'id-v2-1061', // те́нісна раке́тка
        'id-v2-1064', // воро́та футбо́льні
        'id-v2-947', // спа́льний мішо́к
        'id-v2-1100', // заря́дний при́стрій
        'id-v2-1102', // ка́бель USB
        'id-v2-1103', // пульт дистанці́йного керува́ння
        'id-v2-1119', // гіта́ра акусти́чна
        'id-v2-1138', // палі́тра худо́жня
        'id-v2-1139', // пензлик худо́жній
      ].includes(entry.vocabularyId);

    const isExtendedItem = enIncludesAny(entry.en, [
      'hot air balloon',
      'hammock',
      'deckchair',
      'cradle',
      'haystack',
      'pinecone',
      'skewer',
      'Concrete mixer',
      'concrete mixer',
      'bulldozer',
    ]);

    const recommendedPriority: IdentifyCurriculumPriorityLevel =
      isEssentialEveryday
        ? 'essential_everyday'
        : isExtendedItem
          ? 'useful_extended'
          : 'common_situational';

    const everydayRelevance: 'high_daily' | 'moderate_situational' =
      recommendedPriority === 'essential_everyday'
        ? 'high_daily'
        : 'moderate_situational';

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : `high-utility ${bucket.replace(/_/g, ' ')} noun`;

    return {
      batchNumber: 6,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance,
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority,
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `High-utility concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

export const BATCH_6_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch6Reviews();

export function getBatch6CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_6_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 4F. Batch 7 Core-Completion & Multi-Domain Selection & Curation (Candidates 1201..1400)
// ----------------------------------------------------------------------------

function isBatch7PriorityCoreOrHeadwordEntry(entry: IdentifyMasterNounEntry): boolean {
  const idNum = parseMasterVocabularyNumericId(entry.vocabularyId);
  return idNum <= 1149 || entry.vocabularyId === 'id-v2-1712';
}

function selectBatch7CandidateEntries(): Array<{
  entry: IdentifyMasterNounEntry;
  bucket: IdentifyBatch4PedagogicalDomainBucket;
  bestFreqRank: number | null;
  bestCourseModuleId: string | null;
}> {
  const reviewedVocabIds = new Set<string>([
    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_5_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
    ...BATCH_6_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
  ]);

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedVocabIds.has(n.vocabularyId)
  );

  // Prioritize the 155 remaining core-range unreviewed entries (id-v2-150..1149,
  // including id-v2-487 вершко́ве ма́сло and id-v2-646 чек ка́совий) plus id-v2-1712
  // (акумуля́торна батаре́йка -> батаре́йка) before drawing from the 1150..1999
  // expansion tail so that high-utility everyday home/food items are not deferred
  // behind obscure expansion items from depleted domain buckets.
  const coreOrHeadwordUnreviewed = unreviewed.filter(
    isBatch7PriorityCoreOrHeadwordEntry
  );
  const expansionUnreviewed = unreviewed.filter(
    (n) => !isBatch7PriorityCoreOrHeadwordEntry(n)
  );

  return [
    ...rankUnreviewedByMultiDomainPedagogicalUtility(coreOrHeadwordUnreviewed),
    ...rankUnreviewedByMultiDomainPedagogicalUtility(expansionUnreviewed),
  ].slice(0, 200);
}

function buildBatch7Reviews(): IdentifyCandidateReviewRecord[] {
  const candidates = selectBatch7CandidateEntries();

  return candidates.map((item, idx) => {
    const { entry, bucket, bestFreqRank, bestCourseModuleId } = item;

    const recordedRegistryFreqRank =
      typeof entry.freqRank === 'number' ? entry.freqRank : null;
    const crossReferencedFreqDbRank = bestFreqRank;
    const crossReferencedCourseModuleId = bestCourseModuleId;

    let frequencyEvidenceStatus: IdentifyFrequencyEvidenceStatus;
    if (recordedRegistryFreqRank !== null && crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_registry_and_freq_db';
    } else if (crossReferencedFreqDbRank !== null) {
      frequencyEvidenceStatus = 'verified_in_freq_db_unrecorded_in_registry';
    } else if (crossReferencedCourseModuleId !== null) {
      frequencyEvidenceStatus = 'verified_in_course_modules_only';
    } else {
      frequencyEvidenceStatus = 'unverified_supplemental_no_rank';
    }

    const explicit = EXPLICIT_BATCH_7_ASSESSMENTS[entry.vocabularyId];
    if (explicit) {
      return {
        batchNumber: 7,
        reviewOrder: idx + 1,
        conceptId: entry.conceptId,
        vocabularyId: entry.vocabularyId,
        uk: entry.uk,
        en: entry.en,
        gender: entry.gender,
        intendedLexicalSenseEn: entry.intendedMeaningEn,
        recordedRegistryFreqRank,
        crossReferencedFreqDbRank,
        crossReferencedCourseModuleId,
        independentStatisticalCorpusRank: null,
        frequencyEvidenceStatus,
        everydayRelevance: explicit.everydayRelevance,
        visualRecognizability: explicit.visualRecognizability,
        recommendedPriority: explicit.recommendedPriority,
        recommendedVisualFraming: explicit.recommendedVisualFraming,
        candidateSceneCategories: explicit.candidateSceneCategories,
        recommendation: explicit.recommendation,
        issueFlags: explicit.issueFlags || [],
        duplicateOfVocabularyId: explicit.duplicateOfVocabularyId,
        canonicalConceptId: explicit.canonicalConceptId,
        rationaleEn: explicit.rationaleEn,
      };
    }

    const recommendedVisualFraming = inferDefaultVisualFramingForBatch4Entry(
      entry,
      bucket
    );
    const candidateSceneCategories = inferCleanSceneCategoriesForBatch4Entry(
      entry,
      bucket,
      recommendedVisualFraming
    );

    const evidenceSummary =
      crossReferencedFreqDbRank !== null
        ? `FREQ_6000_DB instructional sequence #${crossReferencedFreqDbRank}`
        : crossReferencedCourseModuleId !== null
          ? `COURSE_MODULES ${crossReferencedCourseModuleId}`
          : `familiar ${bucket.replace(/_/g, ' ')} noun`;

    // All 34 essential_everyday and 14 useful_extended KEEP items in Batch 7
    // are explicitly assessed in EXPLICIT_BATCH_7_ASSESSMENTS using independent
    // pedagogical judgment rather than automatic frequency-match promotion.
    return {
      batchNumber: 7,
      reviewOrder: idx + 1,
      conceptId: entry.conceptId,
      vocabularyId: entry.vocabularyId,
      uk: entry.uk,
      en: entry.en,
      gender: entry.gender,
      intendedLexicalSenseEn: entry.intendedMeaningEn,
      recordedRegistryFreqRank,
      crossReferencedFreqDbRank,
      crossReferencedCourseModuleId,
      independentStatisticalCorpusRank: null,
      frequencyEvidenceStatus,
      everydayRelevance: 'moderate_situational',
      visualRecognizability: 'clear_distinct_object',
      recommendedPriority: 'common_situational',
      recommendedVisualFraming,
      candidateSceneCategories,
      recommendation: 'keep',
      issueFlags: [],
      rationaleEn: `Common situational concrete Ukrainian noun (${evidenceSummary}); visually teachable via ${recommendedVisualFraming} in ${candidateSceneCategories.slice(0, 3).join(', ')}.`,
    };
  });
}

export const BATCH_7_CANDIDATE_REVIEWS: readonly IdentifyCandidateReviewRecord[] =
  buildBatch7Reviews();

export function getBatch7CandidateReviews(): readonly IdentifyCandidateReviewRecord[] {
  return BATCH_7_CANDIDATE_REVIEWS;
}

// ----------------------------------------------------------------------------
// 5. Selection Statistics & Reusable Multi-Batch Curation State
// ----------------------------------------------------------------------------

export interface IdentifyCurationBatchStatistics {
  batchNumber: number;
  candidatesReviewedCount: number;
  recommendedKeepCount: number;
  recommendedExcludeCount: number;
  recommendedReviewCount: number;
  duplicateOrAmbiguousCount: number;
  polysemySensesPreservedCount: number;
  verifiedFrequencyInRegistryCount: number;
  verifiedFrequencyInDbUnlinkedCount: number;
  verifiedInCourseModulesOnlyCount: number;
  unverifiedSupplementalNoRankCount: number;
  unsupportedFoundationalTierClaimsInBatchCount: number;
  priorityBreakdownOfKept: {
    essential_everyday: number;
    common_situational: number;
    useful_extended: number;
  };
}

export function computeCurationBatchStatistics(
  reviews: readonly IdentifyCandidateReviewRecord[] = BATCH_1_CANDIDATE_REVIEWS
): IdentifyCurationBatchStatistics {
  let recommendedKeepCount = 0;
  let recommendedExcludeCount = 0;
  let recommendedReviewCount = 0;
  let duplicateOrAmbiguousCount = 0;
  let polysemySensesPreservedCount = 0;
  let verifiedFrequencyInRegistryCount = 0;
  let verifiedFrequencyInDbUnlinkedCount = 0;
  let verifiedInCourseModulesOnlyCount = 0;
  let unverifiedSupplementalNoRankCount = 0;
  let unsupportedFoundationalTierClaimsInBatchCount = 0;

  const priorityBreakdownOfKept = {
    essential_everyday: 0,
    common_situational: 0,
    useful_extended: 0,
  };

  for (const r of reviews) {
    if (r.recommendation === 'keep') {
      recommendedKeepCount++;
      if (r.recommendedPriority === 'essential_everyday') {
        priorityBreakdownOfKept.essential_everyday++;
      } else if (r.recommendedPriority === 'common_situational') {
        priorityBreakdownOfKept.common_situational++;
      } else if (r.recommendedPriority === 'useful_extended') {
        priorityBreakdownOfKept.useful_extended++;
      }
    } else if (r.recommendation === 'exclude') {
      recommendedExcludeCount++;
    } else if (r.recommendation === 'review') {
      recommendedReviewCount++;
    }

    if (
      r.issueFlags.includes('duplicate_concept') ||
      r.issueFlags.includes('inflected_plural_duplicate') ||
      r.issueFlags.includes('modifier_padded_duplicate') ||
      r.issueFlags.includes('compositional_phrase') ||
      r.issueFlags.includes('hypernym_ambiguous')
    ) {
      duplicateOrAmbiguousCount++;
    }

    if (r.issueFlags.includes('polysemy_sense_preserved')) {
      polysemySensesPreservedCount++;
    }

    if (r.frequencyEvidenceStatus === 'verified_in_registry_and_freq_db') {
      verifiedFrequencyInRegistryCount++;
    } else if (r.frequencyEvidenceStatus === 'verified_in_freq_db_unrecorded_in_registry') {
      verifiedFrequencyInDbUnlinkedCount++;
    } else if (r.frequencyEvidenceStatus === 'verified_in_course_modules_only') {
      verifiedInCourseModulesOnlyCount++;
    } else {
      unverifiedSupplementalNoRankCount++;
    }

    if (
      r.frequencyEvidenceStatus === 'unverified_supplemental_no_rank' &&
      r.recommendation !== 'keep'
    ) {
      unsupportedFoundationalTierClaimsInBatchCount++;
    }
  }

  return {
    batchNumber: reviews[0]?.batchNumber ?? 1,
    candidatesReviewedCount: reviews.length,
    recommendedKeepCount,
    recommendedExcludeCount,
    recommendedReviewCount,
    duplicateOrAmbiguousCount,
    polysemySensesPreservedCount,
    verifiedFrequencyInRegistryCount,
    verifiedFrequencyInDbUnlinkedCount,
    verifiedInCourseModulesOnlyCount,
    unverifiedSupplementalNoRankCount,
    unsupportedFoundationalTierClaimsInBatchCount,
    priorityBreakdownOfKept,
  };
}

// ----------------------------------------------------------------------------
// 6. Non-Destructive Curation Decision Store, Cumulative Progress & Next-Batch Planner
// ----------------------------------------------------------------------------

const approvedDecisionsStore = new Map<string, IdentifyCandidateReviewRecord>();
for (const r of BATCH_1_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_2_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_3_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_4_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_5_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_6_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}
for (const r of BATCH_7_CANDIDATE_REVIEWS) {
  approvedDecisionsStore.set(r.vocabularyId, r);
}

export function getSavedCurationDecision(
  vocabularyId: string
): IdentifyCandidateReviewRecord | undefined {
  return approvedDecisionsStore.get(vocabularyId);
}

export function getAllSavedCurationDecisions(): IdentifyCandidateReviewRecord[] {
  return Array.from(approvedDecisionsStore.values());
}

/**
 * Saves or updates a candidate curation decision.
 * Refuses to silently overwrite an already-approved ('keep') decision unless
 * `options.allowOverwriteApproved === true` is explicitly provided.
 */
export function recordCandidateCurationDecision(
  decision: IdentifyCandidateReviewRecord,
  options?: { allowOverwriteApproved?: boolean }
): { ok: boolean; error?: string; totalKeptUniqueNouns: number } {
  const existing = approvedDecisionsStore.get(decision.vocabularyId);
  if (
    existing &&
    existing.recommendation === 'keep' &&
    !options?.allowOverwriteApproved
  ) {
    return {
      ok: false,
      error: `Refusing to silently overwrite already-approved ('keep') decision for ${decision.vocabularyId} (${decision.uk}). Pass allowOverwriteApproved: true to override.`,
      totalKeptUniqueNouns: getApprovedUniqueNounCount(),
    };
  }
  approvedDecisionsStore.set(decision.vocabularyId, decision);
  return {
    ok: true,
    totalKeptUniqueNouns: getApprovedUniqueNounCount(),
  };
}

/**
 * Returns the count of unique provisionally accepted ('keep') noun concepts
 * across all saved curation batches.
 * - Excludes 'review' and 'exclude' items.
 * - Deduplicates by `canonicalConceptId ?? conceptId` and `duplicateOfVocabularyId`
 *   so that any duplicate concept is never counted twice toward the 1,200 target.
 */
export function getApprovedUniqueNounCount(): number {
  const acceptedCanonicalConceptIds = new Set<string>();
  for (const r of approvedDecisionsStore.values()) {
    if (r.recommendation === 'keep' && !r.duplicateOfVocabularyId) {
      acceptedCanonicalConceptIds.add(r.canonicalConceptId ?? r.conceptId);
    }
  }
  return acceptedCanonicalConceptIds.size;
}

export interface IdentifyCumulativeCurationProgress {
  targetUniqueNouns: 1200;
  totalMasterCandidates: number;
  batchesCompleted: readonly [1, 2, 3, 4, 5, 6, 7];
  batch1Stats: IdentifyCurationBatchStatistics;
  batch2Stats: IdentifyCurationBatchStatistics;
  batch3Stats: IdentifyCurationBatchStatistics;
  batch4Stats: IdentifyCurationBatchStatistics;
  batch5Stats: IdentifyCurationBatchStatistics;
  batch6Stats: IdentifyCurationBatchStatistics;
  batch7Stats: IdentifyCurationBatchStatistics;
  totalCandidatesReviewed: number;
  totalRecommendedKeep: number;
  totalRecommendedReview: number;
  totalRecommendedExclude: number;
  totalUniqueProvisionallyAcceptedConcepts: number;
  remainingUnreviewedCandidates: number;
  remainingNeededToReach1200Target: number;
  duplicateOrAmbiguousCandidatesIdentifiedTotal: number;
  potentialMissingHighValueNounsCount: number;
  potentialModifierOnlyNounsNeedingBaseNormalizationCount: number;
}

export function computeCumulativeCurationProgress(): IdentifyCumulativeCurationProgress {
  const batch1Stats = computeCurationBatchStatistics(BATCH_1_CANDIDATE_REVIEWS);
  const batch2Stats = computeCurationBatchStatistics(BATCH_2_CANDIDATE_REVIEWS);
  const batch3Stats = computeCurationBatchStatistics(BATCH_3_CANDIDATE_REVIEWS);
  const batch4Stats = computeCurationBatchStatistics(BATCH_4_CANDIDATE_REVIEWS);
  const batch5Stats = computeCurationBatchStatistics(BATCH_5_CANDIDATE_REVIEWS);
  const batch6Stats = computeCurationBatchStatistics(BATCH_6_CANDIDATE_REVIEWS);
  const batch7Stats = computeCurationBatchStatistics(BATCH_7_CANDIDATE_REVIEWS);
  const correctedGapSummary = getBatch4CorrectedVocabularyGapReport();

  const allReviewed = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
    ...BATCH_7_CANDIDATE_REVIEWS,
  ];
  const uniqueReviewedIds = new Set(allReviewed.map((r) => r.vocabularyId));

  const acceptedConcepts = new Set<string>();
  for (const r of allReviewed) {
    if (r.recommendation === 'keep' && !r.duplicateOfVocabularyId) {
      acceptedConcepts.add(r.canonicalConceptId ?? r.conceptId);
    }
  }

  const totalRecommendedKeep =
    batch1Stats.recommendedKeepCount +
    batch2Stats.recommendedKeepCount +
    batch3Stats.recommendedKeepCount +
    batch4Stats.recommendedKeepCount +
    batch5Stats.recommendedKeepCount +
    batch6Stats.recommendedKeepCount +
    batch7Stats.recommendedKeepCount;
  const totalRecommendedReview =
    batch1Stats.recommendedReviewCount +
    batch2Stats.recommendedReviewCount +
    batch3Stats.recommendedReviewCount +
    batch4Stats.recommendedReviewCount +
    batch5Stats.recommendedReviewCount +
    batch6Stats.recommendedReviewCount +
    batch7Stats.recommendedReviewCount;
  const totalRecommendedExclude =
    batch1Stats.recommendedExcludeCount +
    batch2Stats.recommendedExcludeCount +
    batch3Stats.recommendedExcludeCount +
    batch4Stats.recommendedExcludeCount +
    batch5Stats.recommendedExcludeCount +
    batch6Stats.recommendedExcludeCount +
    batch7Stats.recommendedExcludeCount;
  const totalUniqueProvisionallyAcceptedConcepts = acceptedConcepts.size;

  return {
    targetUniqueNouns: 1200,
    totalMasterCandidates: IDENTIFY_MASTER_2000_NOUNS.length,
    batchesCompleted: [1, 2, 3, 4, 5, 6, 7],
    batch1Stats,
    batch2Stats,
    batch3Stats,
    batch4Stats,
    batch5Stats,
    batch6Stats,
    batch7Stats,
    totalCandidatesReviewed: uniqueReviewedIds.size,
    totalRecommendedKeep,
    totalRecommendedReview,
    totalRecommendedExclude,
    totalUniqueProvisionallyAcceptedConcepts,
    remainingUnreviewedCandidates:
      IDENTIFY_MASTER_2000_NOUNS.length - uniqueReviewedIds.size,
    remainingNeededToReach1200Target:
      1200 - totalUniqueProvisionallyAcceptedConcepts,
    duplicateOrAmbiguousCandidatesIdentifiedTotal:
      batch1Stats.duplicateOrAmbiguousCount +
      batch2Stats.duplicateOrAmbiguousCount +
      batch3Stats.duplicateOrAmbiguousCount +
      batch4Stats.duplicateOrAmbiguousCount +
      batch5Stats.duplicateOrAmbiguousCount +
      batch6Stats.duplicateOrAmbiguousCount +
      batch7Stats.duplicateOrAmbiguousCount,
    potentialMissingHighValueNounsCount:
      correctedGapSummary.genuinelyMissingConceptsCount,
    potentialModifierOnlyNounsNeedingBaseNormalizationCount:
      correctedGapSummary.reclassifiedNonMissingCount,
  };
}

export interface NextBatchRecommendationPreview {
  nextBatchNumber: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  targetBatchSize: number;
  totalRemainingUnreviewedCandidates: number;
  unreviewedWithVerifiedFreqDbMatchCount: number;
  unreviewedWithCourseModuleMatchCount: number;
  sampleTopCandidatesForNextBatch: Array<{
    conceptId: string;
    vocabularyId: string;
    uk: string;
    en: string;
    topicGroupId: string;
    crossReferencedFreqDbRank: number | null;
    crossReferencedCourseModuleId: string | null;
  }>;
  /** Backwards-compatible alias for callers expecting `sampleTopCandidatesForBatch2`. */
  sampleTopCandidatesForBatch2: Array<{
    conceptId: string;
    vocabularyId: string;
    uk: string;
    en: string;
    topicGroupId: string;
    crossReferencedFreqDbRank: number | null;
    crossReferencedCourseModuleId: string | null;
  }>;
  selectionStrategyEn: string;
}

/**
 * Identifies the next `batchSize` (default 200) highest-priority unreviewed
 * candidates for the upcoming batch (now Batch 8, after Batches 1–7 are saved)
 * without executing Batch 8 curation decisions.
 */
export function getNextRecommendedBatchPreview(
  batchSize = 200,
  options?: { forBatchNumber?: 2 | 3 | 4 | 5 | 6 | 7 | 8 }
): NextBatchRecommendationPreview {
  const targetBatchNumber = options?.forBatchNumber ?? 8;
  const reviewedVocabIds = new Set<string>(
    targetBatchNumber === 2
      ? BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId)
      : targetBatchNumber === 3
        ? [
            ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
            ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
          ]
        : targetBatchNumber === 4
          ? [
              ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
              ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
              ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
            ]
          : targetBatchNumber === 5
            ? [
                ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
              ]
            : targetBatchNumber === 6
              ? [
                   ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ...BATCH_5_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                ]
              : targetBatchNumber === 7
                ? [
                    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_5_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_6_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ]
                : [
                    ...BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_2_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_3_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_4_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_5_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_6_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                    ...BATCH_7_CANDIDATE_REVIEWS.map((r) => r.vocabularyId),
                  ]
  );

  const unreviewed = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => !reviewedVocabIds.has(n.vocabularyId)
  );

  if (targetBatchNumber >= 4) {
    const ranked =
      targetBatchNumber === 7
        ? [
            ...rankUnreviewedByMultiDomainPedagogicalUtility(
              unreviewed.filter(isBatch7PriorityCoreOrHeadwordEntry)
            ),
            ...rankUnreviewedByMultiDomainPedagogicalUtility(
              unreviewed.filter((n) => !isBatch7PriorityCoreOrHeadwordEntry(n))
            ),
          ]
        : rankUnreviewedByMultiDomainPedagogicalUtility(unreviewed);
    let unreviewedWithVerifiedFreqDbMatchCount = 0;
    let unreviewedWithCourseModuleMatchCount = 0;
    for (const item of ranked) {
      if (item.bestFreqRank !== null) unreviewedWithVerifiedFreqDbMatchCount++;
      if (item.bestCourseModuleId !== null) unreviewedWithCourseModuleMatchCount++;
    }
    const nextSlice = ranked.slice(0, batchSize);
    const sampleTop = nextSlice.slice(0, 25).map((item) => ({
      conceptId: item.entry.conceptId,
      vocabularyId: item.entry.vocabularyId,
      uk: item.entry.uk,
      en: item.entry.en,
      topicGroupId: item.entry.topicGroupId,
      crossReferencedFreqDbRank: item.bestFreqRank,
      crossReferencedCourseModuleId: item.bestCourseModuleId,
    }));

    return {
      nextBatchNumber: targetBatchNumber,
      targetBatchSize: batchSize,
      totalRemainingUnreviewedCandidates: unreviewed.length,
      unreviewedWithVerifiedFreqDbMatchCount,
      unreviewedWithCourseModuleMatchCount,
      sampleTopCandidatesForNextBatch: sampleTop,
      sampleTopCandidatesForBatch2: sampleTop,
      selectionStrategyEn:
        'Multi-domain pedagogical priority selector: evaluates slash-compound/lemma curriculum evidence, prioritizes core everyday vocabulary (id-v2-150..1149) and concise headwords over the modifier-padded expansion tail, and round-robin interleaves across all 9 everyday domains while preserving all remaining candidates for future batches.',
    };
  }

  const { freqNounByBareUk, courseNounByBareUk } = buildInternalEvidenceMaps();
  let unreviewedWithVerifiedFreqDbMatchCount = 0;
  let unreviewedWithCourseModuleMatchCount = 0;

  const scoredUnreviewed = unreviewed.map((entry) => {
    const bareUk = stripUkrainianStressAndParens(entry.uk);
    const freqMatch = freqNounByBareUk.get(bareUk);
    const courseMatch = courseNounByBareUk.get(bareUk);

    if (freqMatch) unreviewedWithVerifiedFreqDbMatchCount++;
    if (courseMatch) unreviewedWithCourseModuleMatchCount++;

    const freqBonus = freqMatch ? 10000 - freqMatch.rank : 0;
    const courseBonus = courseMatch ? 3000 : 0;
    return {
      entry,
      freqRank: freqMatch ? freqMatch.rank : null,
      courseModuleId: courseMatch ? courseMatch.moduleId : null,
      score: freqBonus + courseBonus,
    };
  });

  scoredUnreviewed.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.conceptId.localeCompare(b.entry.conceptId);
  });

  const nextSlice = scoredUnreviewed.slice(0, batchSize);
  const sampleTop = nextSlice.slice(0, 25).map((item) => ({
    conceptId: item.entry.conceptId,
    vocabularyId: item.entry.vocabularyId,
    uk: item.entry.uk,
    en: item.entry.en,
    topicGroupId: item.entry.topicGroupId,
    crossReferencedFreqDbRank: item.freqRank,
    crossReferencedCourseModuleId: item.courseModuleId,
  }));

  return {
    nextBatchNumber: targetBatchNumber,
    targetBatchSize: batchSize,
    totalRemainingUnreviewedCandidates: unreviewed.length,
    unreviewedWithVerifiedFreqDbMatchCount,
    unreviewedWithCourseModuleMatchCount,
    sampleTopCandidatesForNextBatch: sampleTop,
    sampleTopCandidatesForBatch2: sampleTop,
    selectionStrategyEn:
      targetBatchNumber === 2
        ? 'Batch 2 selects the 200 highest-evidence remaining candidates after Batch 1, sorted by FREQ_6000_DB instructional sequence rank and COURSE_MODULES presence.'
        : 'Batch 3 reviews the next 200 highest-priority unreviewed candidates from the 1,600 remaining entries in IDENTIFY_MASTER_2000_NOUNS after Batches 1 and 2.',
  };
}



