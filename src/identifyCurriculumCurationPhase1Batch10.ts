// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 10 (CANDIDATES 1,801..2,000):
// UNIFIED FINAL LEGACY VOCABULARY CURATION MODULE (COMPOSING STAGES 1–4)
// ============================================================================
// Combines the four audited 50-candidate stages:
// - Stage 1 (Positions 1..50):   25 KEEP,  8 REVIEW, 17 EXCLUDE (SHA-256: 9741262454a601d5c37f1662f4d75c0be7fe03f6083dcb3c68a7c91f0a35ba7f)
// - Stage 2 (Positions 51..100): 24 KEEP,  5 REVIEW, 21 EXCLUDE (SHA-256: 007a7d741069582ec0a303bc4e48944f9f39aab01a70710cba6115d3342bfff5)
// - Stage 3 (Positions 101..150):13 KEEP,  9 REVIEW, 28 EXCLUDE (SHA-256: aef5c08120194d3dc1ecf474224864f68a66bc26fa84b258cb488218e57c47d6)
// - Stage 4 (Positions 151..200):14 KEEP, 10 REVIEW, 26 EXCLUDE (SHA-256: 14c0d230d708a129921d29e53a0290dceb407a4d30323d742704e4aa3c51e100)
//
// Combined Batch 10 Totals (200 candidates):
// - KEEP:    76 (4 essential_everyday, 65 common_situational, 7 useful_extended)
// - REVIEW:  32
// - EXCLUDE: 92
// - Semantic relationship records: 133 (29 canonical duplicates, 104 comparison-only)
// - Headword normalizations: 56
// - Essential everyday justifications: 4
// ============================================================================

import type { ExplicitBatch4Assessment } from './identifyCurriculumCurationPhase1Batch4.ts';
import type { IdentifyBatch7SemanticRelationshipType } from './identifyCurriculumCurationPhase1Batch7.ts';
import {
  IDENTIFY_BATCH_10_FROZEN_MANIFEST,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
  type IdentifyBatch10ManifestEntry,
} from './identifyCurriculumCurationPhase1Batch10Manifest.ts';
import {
  EXPLICIT_BATCH_10_STAGE_1_ASSESSMENTS,
  IDENTIFY_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS,
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part1.ts';
import {
  EXPLICIT_BATCH_10_STAGE_2_ASSESSMENTS,
  IDENTIFY_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS,
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part2.ts';
import {
  EXPLICIT_BATCH_10_STAGE_3_ASSESSMENTS,
  IDENTIFY_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS,
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part3.ts';
import {
  EXPLICIT_BATCH_10_STAGE_4_ASSESSMENTS,
  IDENTIFY_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS,
  IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part4.ts';

export {
  IDENTIFY_BATCH_10_FROZEN_MANIFEST,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX,
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX,
  IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_PREFIX,
};
export type { IdentifyBatch10ManifestEntry };

export type ExplicitBatch10Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch10SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

export interface IdentifyBatch10SemanticRelationshipRecord {
  batchNumber: 10;
  stageNumber: 1 | 2 | 3 | 4;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

export interface IdentifyBatch10HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 10;
  stageNumber: 1 | 2 | 3 | 4;
  normalizationRationaleEn?: string;
  rationaleEn?: string;
}

export interface IdentifyBatch10EssentialEverydayPedagogicalReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  stageNumber: 1 | 2 | 3 | 4;
  independentPedagogicalJustificationEn: string;
}

export const IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch10SemanticRelationshipRecord[] =
  [
    ...IDENTIFY_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_RECORDS,
  ];

export const IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch10HeadwordNormalizationRecord[] =
  [
    ...IDENTIFY_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_RECORDS,
  ];

export const IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS: readonly IdentifyBatch10EssentialEverydayPedagogicalReason[] =
  [
    ...IDENTIFY_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS,
    ...IDENTIFY_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS,
    ...IDENTIFY_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS,
    ...IDENTIFY_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS,
  ];

export const EXPLICIT_BATCH_10_ASSESSMENTS: Record<
  string,
  ExplicitBatch10Assessment
> = {
  ...EXPLICIT_BATCH_10_STAGE_1_ASSESSMENTS,
  ...EXPLICIT_BATCH_10_STAGE_2_ASSESSMENTS,
  ...EXPLICIT_BATCH_10_STAGE_3_ASSESSMENTS,
  ...EXPLICIT_BATCH_10_STAGE_4_ASSESSMENTS,
};

// 3-field pipe-joined (vocabularyId:conceptId:recommendation) SHA-256 checksum
export const IDENTIFY_BATCH_10_PIPE_DECISION_SHA256_FULL =
  '5f0657bb9dd0c49f83f8991ba9c5a6973ee1f002e0f3cbb82e9689e8c136b7bf' as const;
export const IDENTIFY_BATCH_10_PIPE_DECISION_SHA256_PREFIX =
  '5f0657bb9dd0c49f' as const;

// 7-field newline-joined SHA-256 checksum across all 200 Batch 10 decisions
export const IDENTIFY_BATCH_10_FULL_DECISION_SHA256_FULL =
  '05074dfffc9e1d68af69d90a584f120e70392f9d119599c651f95d7affd5ff80' as const;
export const IDENTIFY_BATCH_10_FULL_DECISION_SHA256_PREFIX =
  '05074dfffc9e1d68' as const;

export interface IdentifyBatch10CurationAndHeadwordSummary {
  reportVersion: '10.0.0-batch10';
  preservedGenuineMissingConceptsCount: 34;
  headwordNormalizationsCompletedInBatch10Count: number;
  essentialEverydayWithIndependentJustificationCount: number;
  semanticRelationshipsInBatch10Count: number;
  canonicalDuplicateRelationshipsCount: number;
  comparisonOnlyRelationshipsCount: number;
  stageChecksums: {
    manifestSha256: string;
    stage1DecisionSha256: string;
    stage2DecisionSha256: string;
    stage3DecisionSha256: string;
    stage4DecisionSha256: string;
    batch10PipeDecisionSha256: string;
    batch10FullDecisionSha256: string;
  };
  headwordNormalizations: readonly IdentifyBatch10HeadwordNormalizationRecord[];
  essentialEverydayReasons: readonly IdentifyBatch10EssentialEverydayPedagogicalReason[];
  semanticRelationships: readonly IdentifyBatch10SemanticRelationshipRecord[];
}

export function getBatch10CurationAndHeadwordReport(): IdentifyBatch10CurationAndHeadwordSummary {
  const canonicalDupCount =
    IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.filter(
      (r) => r.countsAsDuplicateConcept
    ).length;
  const comparisonOnlyCount =
    IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.filter(
      (r) => !r.countsAsDuplicateConcept
    ).length;

  return {
    reportVersion: '10.0.0-batch10',
    preservedGenuineMissingConceptsCount: 34,
    headwordNormalizationsCompletedInBatch10Count:
      IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS.length,
    essentialEverydayWithIndependentJustificationCount:
      IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS.length,
    semanticRelationshipsInBatch10Count:
      IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.length,
    canonicalDuplicateRelationshipsCount: canonicalDupCount,
    comparisonOnlyRelationshipsCount: comparisonOnlyCount,
    stageChecksums: {
      manifestSha256: IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
      stage1DecisionSha256: IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
      stage2DecisionSha256: IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
      stage3DecisionSha256: IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
      stage4DecisionSha256: IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL,
      batch10PipeDecisionSha256: IDENTIFY_BATCH_10_PIPE_DECISION_SHA256_FULL,
      batch10FullDecisionSha256: IDENTIFY_BATCH_10_FULL_DECISION_SHA256_FULL,
    },
    headwordNormalizations: IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS,
    essentialEverydayReasons:
      IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
    semanticRelationships: IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS,
  };
}
