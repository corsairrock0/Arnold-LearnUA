// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 10 — PARTIAL STAGE 4 / 4
// (MANIFEST POSITIONS 151..200 OF 200 REMAINING LEGACY NOUNS)
// ============================================================================
// IMPORTANT STAGE BOUNDARY:
// - This file is clearly labeled BATCH 10 — PARTIAL STAGE 4 / 4.
// - It reviews ONLY manifest positions 151..200 from
//   `IDENTIFY_BATCH_10_FROZEN_MANIFEST` (`src/identifyCurriculumCurationPhase1Batch10Manifest.ts`).
// - It preserves `src/identifyCurriculumCurationPhase1Batch10Manifest.ts`,
//   `src/identifyCurriculumCurationPhase1Batch10Part1.ts` (Stage 1),
//   `src/identifyCurriculumCurationPhase1Batch10Part2.ts` (Stage 2), and
//   `src/identifyCurriculumCurationPhase1Batch10Part3.ts` (Stage 3) completely
//   untouched.
// - It does NOT modify `src/identifyCurriculumCurationPhase1.ts` or register
//   staged Batch 10 decisions into `approvedDecisionsStore`. Official
//   cumulative totals remain fixed at 1,800 reviewed (1,103 KEEP, 291 REVIEW,
//   406 EXCLUDE, 200 unreviewed) until cumulative Batch 10 integration.
// ============================================================================

import type { IdentifyMasterNounEntry } from './identifyMasterNouns.ts';
import type { ExplicitBatch4Assessment } from './identifyCurriculumCurationPhase1Batch4.ts';
import {
  resolveMasterNounById,
  resolveMasterConceptId,
  type IdentifyBatch7SemanticRelationshipType,
} from './identifyCurriculumCurationPhase1Batch7.ts';
import {
  IDENTIFY_BATCH_10_FROZEN_MANIFEST,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
  IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
  type IdentifyBatch10ManifestEntry,
} from './identifyCurriculumCurationPhase1Batch10Manifest.ts';
import {
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part1.ts';
import {
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part2.ts';
import {
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
  IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX,
} from './identifyCurriculumCurationPhase1Batch10Part3.ts';

export const IDENTIFY_BATCH_10_STAGE_4_LABEL =
  'BATCH 10 — PARTIAL STAGE 4 / 4' as const;

export type ExplicitBatch10Stage4Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch10Stage4SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

export const IDENTIFY_BATCH_10_STAGE_4_MANIFEST_SLICE: readonly IdentifyBatch10ManifestEntry[] =
  IDENTIFY_BATCH_10_FROZEN_MANIFEST.slice(150, 200);

// ----------------------------------------------------------------------------
// 1. Batch 10 Stage 4 Semantic Duplicate & Relationship Records (Positions 151..200)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage4SemanticRelationshipRecord {
  batchNumber: 10;
  stageNumber: 4;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage4SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

interface RawBatch10Stage4SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage4SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch10Stage4SemanticRelationshipSeed[] =
  [
    // === A. 1 CANONICAL DUPLICATE EXCLUSION (countsAsDuplicateConcept: true) ===
    {
      candidateVocabularyId: 'id-v2-1950',
      comparedVocabularyId: 'id-v2-1040',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'тренаже́р велоерго́метр (stationary exercise bike, noun-concept-1695) is a technical/clinical synonym duplicate of approved Batch 4 KEEP id-v2-1040 (велотренаже́р, stationary exercise bike, noun-concept-1704).',
    },

    // === B. 36 NON-DUPLICATE SEMANTIC COMPARISONS (countsAsDuplicateConcept: false) ===
    {
      candidateVocabularyId: 'id-v2-1586',
      comparedVocabularyId: 'id-v2-1923',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'жо́лоб для пої́ння (watering trough, noun-concept-1670) is a compositional livestock-trough phrase overlapping in farmyard function with approved Batch 9 KEEP id-v2-1923 (корито для худо́би, normalized to кори́то, wooden watering trough, noun-concept-1450); excluded independently without claiming lexical equivalence between жо́лоб and кори́то.',
    },
    {
      candidateVocabularyId: 'id-v2-1610',
      comparedVocabularyId: 'id-v2-984',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ле́лече гніздо́ (stork nest, noun-concept-1672) is a distinct bird-nest structure on rural roofs and utility poles compared to the stork bird itself id-v2-984 (леле́ка, stork, Batch 2 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1622',
      comparedVocabularyId: 'id-v2-1624',
      comparedBatchNumber: 8,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'морськи́й ко́ник (seahorse, noun-concept-1673) is a marine fish species completely distinct from land insect id-v2-1624 (ко́ник-стрибуне́ць, grasshopper, Batch 8 KEEP); modifier морськи́й is mandatory to preserve meaning.',
    },
    {
      candidateVocabularyId: 'id-v2-1670',
      comparedVocabularyId: 'id-v2-1669',
      comparedBatchNumber: 10,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'дро́тик для да́ртсу (normalized to дро́тик, feathered dart, noun-concept-1691) is the small thrown projectile paired with Stage 4 KEEP id-v2-1669 (міше́нь для да́ртсу, dartboard, noun-concept-1738); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1940',
      comparedVocabularyId: 'hp-stethoscope',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'отоско́п лі́карський (ear otoscope light, noun-concept-1694) is a specialist ENT examination instrument compared to foundational clinical instrument hp-stethoscope (стетоско́п, Batch 1 KEEP); excluded on specialist medical grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1671',
      comparedVocabularyId: 'id-v2-1672',
      comparedBatchNumber: 10,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'лук спортивний (normalized to лук, archery bow, noun-concept-1713) is a distinct weapon/sporting object paired with Stage 4 KEEP id-v2-1672 (стріла́ для лу́ка, normalized to стріла́, arrow, noun-concept-1733).',
    },
    {
      candidateVocabularyId: 'id-v2-1951',
      comparedVocabularyId: 'id-v2-1040',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'тренаже́р орбітре́к (normalized to орбітре́к, elliptical trainer, noun-concept-1717) is a distinct standing cardio machine compared to seated stationary bike id-v2-1040 (велотренаже́р, Batch 4 KEEP) and treadmill gm-treadmill (бігова́ дорі́жка, Batch 1 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1942',
      comparedVocabularyId: 'id-v2-1010',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'зуболіка́рський зонд (dental explorer probe, noun-concept-1736) is a fine handheld dental instrument excluded alongside Batch 4 EXCLUDE id-v2-1010 (бормаши́на, dental handpiece / drill).',
    },
    {
      candidateVocabularyId: 'id-v2-1952',
      comparedVocabularyId: 'gm-barbell',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'стійка для штанги (barbell squat rack, noun-concept-1737) is a secondary gym support frame for approved Batch 1 KEEP gm-barbell (шта́нга, barbell, noun-concept-1698); excluded as specialist gym hardware.',
    },
    {
      candidateVocabularyId: 'id-v2-1683',
      comparedVocabularyId: 'id-v2-1176',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'канат для ла́зіння (normalized to кана́т, heavy climbing rope / cable, noun-concept-1755) is a distinct thick braided rope concept compared to thin household clothesline id-v2-1176 (моту́зка для біли́зни, Batch 3 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1943',
      comparedVocabularyId: 'id-v2-1011',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'дзеркальце стоматологі́чне (angled dental mouth mirror, noun-concept-1757) is a diminutive variant of Batch 5 EXCLUDE id-v2-1011 (дзеркало стоматологі́чне, dental mirror, noun-concept-1721); excluded consistently without canonicalizing to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1953',
      comparedVocabularyId: 'id-v2-1045',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'млинець для штанги (cast-iron weight plate, noun-concept-1758) matches Batch 4 EXCLUDE id-v2-1045 (млине́ць (диск для штанги), weight plate, noun-concept-1806) as a sub-part of Batch 1 KEEP gm-barbell (шта́нга); excluded without canonicalizing to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1676',
      comparedVocabularyId: 'id-v2-1077',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'трамплі́н для стрибкі́в у во́ду (normalized to трамплі́н, diving board, noun-concept-1759) is a visually distinct springboard structure beside approved Batch 7 KEEP id-v2-1077 (басе́йн пла́вальний, swimming pool).',
    },
    {
      candidateVocabularyId: 'id-v2-1677',
      comparedVocabularyId: 'id-v2-1077',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'дорі́жка розділювальна (pool lane rope, noun-concept-1760) is a secondary floating divider line inside approved Batch 7 KEEP id-v2-1077 (басе́йн пла́вальний, swimming pool); excluded as granular pool hardware.',
    },
    {
      candidateVocabularyId: 'id-v2-1934',
      comparedVocabularyId: 'id-v2-1647',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ростомі́р меди́чний (clinic height stadiometer, noun-concept-1778) is a modifier-padded variant of Batch 7 EXCLUDE id-v2-1647 (ростомі́р, stadiometer height rod, noun-concept-1832); excluded consistently without canonicalizing to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1944',
      comparedVocabularyId: 'id-v2-1664',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'капа стоматологі́чна (clear dental aligner / mouthguard, noun-concept-1779) is a specialist orthodontic/dental tray excluded alongside Batch 9 EXCLUDE id-v2-1664 (ка́па боксе́рська, mouthguard).',
    },
    {
      candidateVocabularyId: 'id-v2-1954',
      comparedVocabularyId: 'id-v2-852',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'рукави́чки атлети́чні (weightlifting fingerless gloves, noun-concept-1780) is a specialized gym-glove subtype compared to approved Batch 2 KEEP id-v2-852 (рукави́чки, gloves, noun-concept-1276); excluded for low everyday utility.',
    },
    {
      candidateVocabularyId: 'id-v2-1935',
      comparedVocabularyId: 'id-v2-319',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ваги́ меди́чні (clinical balance scale, noun-concept-1797) is a specialized clinic mechanical scale compared to everyday household bathroom scale id-v2-319 (підло́гові ваги́, Batch 3 KEEP); excluded as specialist clinic equipment.',
    },
    {
      candidateVocabularyId: 'id-v2-1955',
      comparedVocabularyId: 'id-v2-735',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'магне́зія спортивна (gym chalk block, noun-concept-1799) is specialist weightlifting magnesium carbonate chalk compared to everyday school/board chalk id-v2-735 (кре́йда, Batch 4 KEEP); excluded for low everyday relevance.',
    },
    {
      candidateVocabularyId: 'id-v2-1666',
      comparedVocabularyId: 'id-v2-1665',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'стіл те́нісний (normalized to те́нісний стіл, ping-pong table, noun-concept-1813) is the full table-tennis playing table paired with approved Batch 9 KEEP id-v2-1665 (раке́тка для насті́льного те́нісу, ping-pong paddle, noun-concept-1794).',
    },
    {
      candidateVocabularyId: 'id-v2-1936',
      comparedVocabularyId: 'id-v2-1007',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'негатоско́п для зні́мків (X-ray light box viewer, noun-concept-1815) is a specialist radiology wall viewer compared to Batch 5 REVIEW id-v2-1007 (рентге́нівський зні́мок, X-ray film); excluded on specialist clinical grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1946',
      comparedVocabularyId: 'id-v2-1631',
      comparedBatchNumber: 8,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пухи́р для льо́ду (medical ice pack bag, noun-concept-1816) is a clinical cold-compress bladder compared to everyday household hot-water bottle id-v2-1631 (грі́лка гу́мова, Batch 8 KEEP); excluded as niche medical terminology.',
    },
    {
      candidateVocabularyId: 'id-v2-1956',
      comparedVocabularyId: 'id-v2-1077',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'стартова ту́мба в басе́йні (swimming pool starting block, noun-concept-1817) is a competition pool deck pedestal compared to approved Batch 7 KEEP id-v2-1077 (басе́йн пла́вальний, swimming pool); excluded as granular sports-facility hardware.',
    },
    {
      candidateVocabularyId: 'id-v2-1937',
      comparedVocabularyId: 'id-v2-1014',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'джгут кровоспи́нний (medical tourniquet band, noun-concept-1818) is a synonymous variant of Batch 5 EXCLUDE id-v2-1014 (джгут меди́чний, tourniquet, noun-concept-1784); excluded consistently without canonicalizing to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1938',
      comparedVocabularyId: 'id-v2-779',
      comparedBatchNumber: 5,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пробі́рка вакута́йнер (blood collection tube, noun-concept-1819) is a clinical vacutainer subtype of Batch 5 EXCLUDE id-v2-779 (пробі́рка, test tube, noun-concept-1145); excluded on specialist laboratory/clinical grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1668',
      comparedVocabularyId: 'id-v2-1675',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ку́ля білья́рдна (normalized to білья́рдна ку́ля, billiard ball, noun-concept-1852) is a distinct table-game ball compared to large ten-pin bowling ball id-v2-1675 (ку́ля для бо́улінгу, Batch 9 KEEP); modifier білья́рдна is retained to preserve distinction.',
    },
    {
      candidateVocabularyId: 'id-v2-1948',
      comparedVocabularyId: 'id-v2-1005',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ходунки́ реабілітаці́йні (normalized to ходунки́, folding walking frame, noun-concept-1855) is a distinct four-legged mobility walker compared to underarm crutches id-v2-1005 (ми́лиці, Batch 4 KEEP) and wheelchair id-v2-1004 (інвалі́дний візо́к, Batch 5 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1958',
      comparedVocabularyId: 'id-v2-1492',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'рятува́льна ви́шка (lifeguard high chair / observation tower, noun-concept-1856) is a beach/pool structure distinct from the lifeguard person id-v2-1492 (рятува́льник пля́жний, Batch 9 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1679',
      comparedVocabularyId: 'id-v2-686',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'нарука́вники надувні́ (normalized to надувні́ нарука́вники, inflatable water wings, noun-concept-1871) is a children’s swim-aid accessory distinct from full torso life vest id-v2-686 (рятува́льний жиле́т, Batch 4 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1939',
      comparedVocabularyId: 'id-v2-378',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'шпа́тель меди́чний (wooden tongue depressor, noun-concept-1873) is a disposable clinic stick distinct from construction putty knife id-v2-378 (шпа́тель, Batch 1 EXCLUDE); excluded due to low everyday relevance and visual ambiguity.',
    },
    {
      candidateVocabularyId: 'id-v2-1151',
      comparedVocabularyId: 'id-v2-365',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'сантиметро́ва стрі́чка (flexible tailor measuring tape, noun-concept-1886) is a distinct household sewing/body measuring ribbon compared to retractable metal construction tape measure id-v2-365 (руле́тка будіве́льна, Batch 3 KEEP) and rigid ruler id-v2-759 (ліні́йка, Batch 4 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1736',
      comparedVocabularyId: 'id-v2-1119',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'медіа́тор гіта́рний (normalized to медіа́тор, guitar pick / plectrum, noun-concept-1894) is a handheld plectrum accessory used with approved Batch 6 KEEP id-v2-1119 (гіта́ра акусти́чна, acoustic guitar); held in REVIEW because its small size requires close-up framing.',
    },
    {
      candidateVocabularyId: 'id-v2-1746',
      comparedVocabularyId: 'id-v2-261',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'рамка баге́тна (ornate wooden molding frame, noun-concept-1937) is a specialized framing-shop subtype compared to everyday picture frame id-v2-261 (фотора́мка, Batch 2 KEEP) and framed painting id-v2-260 (ка́ртина, Batch 2 KEEP); excluded independently without claiming exact lexical identity.',
    },
    {
      candidateVocabularyId: 'id-v2-1154',
      comparedVocabularyId: 'id-v2-1153',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'гачо́к для в’яза́ння (single hooked crochet needle, noun-concept-1949) is a distinct yarn-craft tool compared to a pair of straight knitting needles id-v2-1153 (спи́ці в’яза́льні, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1150',
      comparedVocabularyId: 'id-v2-1147',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'шпи́лька краве́цька (normalized to краве́цька шпи́лька, ball-headed straight tailoring pin, noun-concept-1989) is a distinct pinning fastener compared to an eyed sewing needle id-v2-1147 (го́лка шве́йна, Batch 5 KEEP) and hairpin id-v2-1514 (шпи́лька для воло́сся, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1741',
      comparedVocabularyId: 'id-v2-1136',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'етю́дник худо́жній (pochade sketchbox, noun-concept-1998) is a specialist plein-air painter’s tripod box compared to approved Batch 6 KEEP id-v2-1136 (мольбе́рт, wooden easel, noun-concept-1946); excluded on specialist art-equipment grounds.',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch10Stage4SemanticRelationshipRecord[] =
  RAW_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 10,
      stageNumber: 4,
      candidateVocabularyId: candidateMaster.vocabularyId,
      candidateConceptId: candidateMaster.conceptId,
      candidateUk: candidateMaster.uk,
      candidateEn: candidateMaster.en,
      comparedVocabularyId: comparedMaster.vocabularyId,
      comparedConceptId: comparedMaster.conceptId,
      comparedUk: comparedMaster.uk,
      comparedEn: comparedMaster.en,
      comparedBatchNumber: seed.comparedBatchNumber,
      relationshipType: seed.relationshipType,
      candidateAction: seed.candidateAction,
      countsAsDuplicateConcept: seed.countsAsDuplicateConcept,
      canonicalResolutionNoteEn: seed.canonicalResolutionNoteEn,
    };
  });

// ----------------------------------------------------------------------------
// 2. Batch 10 Stage 4 Learner Headword Normalizations (Non-Destructive Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage4HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 10;
  stageNumber: 4;
  normalizationReasonEn: string;
}

interface RawBatch10Stage4HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch10Stage4HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1610',
      preferredLearnerHeadwordUk: 'леле́че гніздо́',
      acceptedConversationalSynonymsUk: [
        'ле́лече гніздо́',
        'гніздо́',
        'пташи́не гніздо́',
      ],
      normalizationReasonEn:
        'Preserves the stork-nest meaning with standard Ukrainian stress леле́че гніздо́ while accepting general noun гніздо́ (nest) as a conversational synonym.',
    },
    {
      vocabularyId: 'id-v2-1914',
      preferredLearnerHeadwordUk: 'смола́',
      acceptedConversationalSynonymsUk: [
        'живи́ця',
        'сосно́ва смола́',
        'смола́ сосно́ва (живи́ця)',
      ],
      normalizationReasonEn:
        'Strips parenthetical synonym and botanical modifier so learners practice primary Ukrainian noun смола́ (resin / sap) while accepting живи́ця.',
    },
    {
      vocabularyId: 'id-v2-1670',
      preferredLearnerHeadwordUk: 'дро́тик',
      acceptedConversationalSynonymsUk: ['дро́тик для да́ртсу'],
      normalizationReasonEn:
        'Strips redundant purpose phrase для да́ртсу so learners practice concise noun дро́тик (dart).',
    },
    {
      vocabularyId: 'id-v2-1671',
      preferredLearnerHeadwordUk: 'лук',
      acceptedConversationalSynonymsUk: ['лук спортивний', 'спортивний лук'],
      normalizationReasonEn:
        'Strips redundant adjective спортивний so learners practice core single-word Ukrainian noun лук (archery bow).',
    },
    {
      vocabularyId: 'id-v2-1951',
      preferredLearnerHeadwordUk: 'орбітре́к',
      acceptedConversationalSynonymsUk: [
        'тренаже́р орбітре́к',
        'еліпти́чний тренаже́р',
      ],
      normalizationReasonEn:
        'Normalizes appositive catalog phrase тренаже́р орбітре́к to natural everyday Ukrainian gym noun орбітре́к (elliptical trainer).',
    },
    {
      vocabularyId: 'id-v2-1672',
      preferredLearnerHeadwordUk: 'стріла́',
      acceptedConversationalSynonymsUk: ['стріла́ для лу́ка'],
      normalizationReasonEn:
        'Strips redundant prepositional modifier для лу́ка so learners practice core single-word Ukrainian noun стріла́ (arrow).',
    },
    {
      vocabularyId: 'id-v2-1669',
      preferredLearnerHeadwordUk: 'міше́нь',
      acceptedConversationalSynonymsUk: ['міше́нь для да́ртсу', 'да́ртс'],
      normalizationReasonEn:
        'Strips redundant modifier phrase для да́ртсу so learners practice versatile core noun міше́нь (target / dartboard).',
    },
    {
      vocabularyId: 'id-v2-1683',
      preferredLearnerHeadwordUk: 'кана́т',
      acceptedConversationalSynonymsUk: [
        'канат для ла́зіння',
        'спортивний кана́т',
      ],
      normalizationReasonEn:
        'Strips redundant purpose phrase для ла́зіння so learners practice core single-word noun кана́т (heavy rope / climbing rope).',
    },
    {
      vocabularyId: 'id-v2-1676',
      preferredLearnerHeadwordUk: 'трамплі́н',
      acceptedConversationalSynonymsUk: [
        'трамплі́н для стрибкі́в у во́ду',
        'водни́й трамплі́н',
      ],
      normalizationReasonEn:
        'Strips lengthy explanatory phrase для стрибкі́в у во́ду so learners practice natural single-word noun трамплі́н (diving board / springboard).',
    },
    {
      vocabularyId: 'id-v2-1666',
      preferredLearnerHeadwordUk: 'те́нісний стіл',
      acceptedConversationalSynonymsUk: [
        'стіл те́нісний',
        'стіл для насті́льного те́нісу',
      ],
      normalizationReasonEn:
        'Reorders inverted catalog phrase стіл те́нісний to natural Ukrainian adjective-first order те́нісний стіл (ping-pong table).',
    },
    {
      vocabularyId: 'id-v2-1667',
      preferredLearnerHeadwordUk: 'білья́рдний кий',
      acceptedConversationalSynonymsUk: ['кий', 'кий білья́рдний'],
      normalizationReasonEn:
        'Reorders inverted catalog phrase кий білья́рдний to natural Ukrainian adjective-first order білья́рдний кий while accepting single-word кий.',
    },
    {
      vocabularyId: 'id-v2-1668',
      preferredLearnerHeadwordUk: 'білья́рдна ку́ля',
      acceptedConversationalSynonymsUk: ['ку́ля білья́рдна'],
      normalizationReasonEn:
        'Reorders inverted catalog phrase ку́ля білья́рдна to natural Ukrainian adjective-first order білья́рдна ку́ля while retaining білья́рдна to distinguish from bowling ball and hot-air balloon.',
    },
    {
      vocabularyId: 'id-v2-1948',
      preferredLearnerHeadwordUk: 'ходунки́',
      acceptedConversationalSynonymsUk: [
        'ходунки́ реабілітаці́йні',
        'меди́чні ходунки́',
      ],
      normalizationReasonEn:
        'Strips clinical modifier реабілітаці́йні so learners practice natural conversational Ukrainian plural noun ходунки́ (walking frame / walker).',
    },
    {
      vocabularyId: 'id-v2-1679',
      preferredLearnerHeadwordUk: 'надувні́ нарука́вники',
      acceptedConversationalSynonymsUk: [
        'нарука́вники надувні́',
        'нарука́вники для пла́вання',
      ],
      normalizationReasonEn:
        'Reorders inverted catalog phrase нарука́вники надувні́ to natural adjective-first order надувні́ нарука́вники while retaining надувні́ to specify inflatable swim water wings.',
    },
    {
      vocabularyId: 'id-v2-1151',
      preferredLearnerHeadwordUk: 'сантиметро́ва стрі́чка',
      acceptedConversationalSynonymsUk: ['сантиме́тр', 'краве́цький сантиме́тр'],
      normalizationReasonEn:
        'Retains natural Ukrainian headword сантиметро́ва стрі́чка (tailor measuring tape) while accepting everyday colloquial synonym сантиме́тр.',
    },
    {
      vocabularyId: 'id-v2-1736',
      preferredLearnerHeadwordUk: 'медіа́тор',
      acceptedConversationalSynonymsUk: [
        'медіа́тор гіта́рний',
        'гіта́рний медіа́тор',
      ],
      normalizationReasonEn:
        'Strips redundant modifier гіта́рний so learners practice standard single-word Ukrainian musical noun медіа́тор (guitar pick).',
    },
    {
      vocabularyId: 'id-v2-1154',
      preferredLearnerHeadwordUk: 'гачо́к для в’яза́ння',
      acceptedConversationalSynonymsUk: ['в’яза́льний гачо́к'],
      normalizationReasonEn:
        'Retains distinguishing qualifier для в’яза́ння (crochet hook, distinct from wall hook or fishhook) while accepting adjective-first variant в’яза́льний гачо́к.',
    },
    {
      vocabularyId: 'id-v2-1744',
      preferredLearnerHeadwordUk: 'бюст',
      acceptedConversationalSynonymsUk: ['гіпсовий бюст', 'погру́ддя'],
      normalizationReasonEn:
        'Strips material modifier гіпсовий so learners practice general sculpture/art noun бюст alongside native Ukrainian synonym погру́ддя.',
    },
    {
      vocabularyId: 'id-v2-1150',
      preferredLearnerHeadwordUk: 'краве́цька шпи́лька',
      acceptedConversationalSynonymsUk: [
        'шпи́лька краве́цька',
        'була́вка',
        'шпи́лька',
      ],
      normalizationReasonEn:
        'Reorders inverted catalog phrase шпи́лька краве́цька to natural adjective-first order краве́цька шпи́лька (retaining краве́цька to distinguish from hairpin шпи́лька для воло́сся).',
    },
    {
      vocabularyId: 'id-v2-1156',
      preferredLearnerHeadwordUk: 'п’я́льця',
      acceptedConversationalSynonymsUk: ['п’я́льця для вишива́ння'],
      normalizationReasonEn:
        'Strips redundant purpose phrase для вишива́ння so learners practice natural single-word pluralia tantum noun п’я́льця (embroidery hoop).',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch10Stage4HeadwordNormalizationRecord[] =
  RAW_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
    const master = resolveMasterNounById(seed.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      originalMasterHeadwordUk: master.uk,
      preferredLearnerHeadwordUk: seed.preferredLearnerHeadwordUk,
      acceptedConversationalSynonymsUk: seed.acceptedConversationalSynonymsUk,
      englishGlossEn: master.en,
      gender: master.gender,
      reviewedInBatchNumber: 10,
      stageNumber: 4,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Stage 4 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage4EssentialEverydayReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  stageNumber: 4;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [];

export const IDENTIFY_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS: readonly IdentifyBatch10Stage4EssentialEverydayReason[] =
  RAW_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
    const master = resolveMasterNounById(item.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      stageNumber: 4,
      independentPedagogicalJustificationEn:
        item.independentPedagogicalJustificationEn,
    };
  });

// ----------------------------------------------------------------------------
// 4. Explicit Batch 10 Stage 4 Assessments (Manifest Positions 151..200 Only)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_10_STAGE_4_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch10Stage4Assessment>
> = {
  // Position 151: id-v2-1586 (жо́лоб для пої́ння — watering trough)
  'id-v2-1586': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: жо́лоб для пої́ння (livestock watering trough) is a compositional agricultural phrase functionally redundant alongside approved Batch 9 KEEP id-v2-1923 (корито для худо́би, normalized to кори́то, wooden watering trough).',
  },
  // Position 152: id-v2-1610 (ле́лече гніздо́ — stork nest)
  'id-v2-1610': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park'],
    rationaleEn:
      'Keep (common_situational): ле́лече гніздо́ (normalized to леле́че гніздо́, accepting гніздо́, stork nest) is an iconic, visually unmistakable sight on utility poles and roofs across Ukrainian villages and countryside scenes, and provides the only bird-nest entry in the 2,000-noun registry.',
  },
  // Position 153: id-v2-1622 (морськи́й ко́ник — seahorse)
  'id-v2-1622': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'classroom'],
    rationaleEn:
      'Hold for review: морськи́й ко́ник (seahorse; full compound retained to distinguish from grasshopper ко́ник-стрибуне́ць) is a visually unmistakable marine creature held in REVIEW for aquarium and nature scenes.',
  },
  // Position 154: id-v2-1914 (смола́ сосно́ва (живи́ця) — amber pine resin drop)
  'id-v2-1914': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['countryside', 'park'],
    rationaleEn:
      'Hold for review: смола́ сосно́ва (живи́ця) (normalized to смола́, accepting живи́ця, pine resin / sap) is a useful natural-world noun held in REVIEW because a resin drop on tree bark requires close-up framing.',
  },
  // Position 155: id-v2-1670 (дро́тик для да́ртсу — feathered dart)
  'id-v2-1670': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'park'],
    rationaleEn:
      'Hold for review: дро́тик для да́ртсу (normalized to дро́тик, feathered dart) is a recognizable recreation projectile held in REVIEW alongside Stage 4 KEEP id-v2-1669 (міше́нь для да́ртсу, dartboard).',
  },
  // Position 156: id-v2-1940 (отоско́п лі́карський — ear otoscope light)
  'id-v2-1940': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: отоско́п лі́карський (ear otoscope light) is a specialist ENT clinical diagnostic instrument outside core everyday vocabulary.',
  },
  // Position 157: id-v2-1950 (тренаже́р велоерго́метр — stationary exercise bike)
  'id-v2-1950': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1040',
    canonicalConceptId: resolveMasterConceptId('id-v2-1040'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-1040 (велотренаже́р, stationary exercise bike, noun-concept-1704).',
  },
  // Position 158: id-v2-1671 (лук спортивний — archery bow)
  'id-v2-1671': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'sports_venue'],
    rationaleEn:
      'Keep (useful_extended): лук спортивний (normalized to лук, archery bow) is a fundamental, visually unmistakable Ukrainian noun that pairs naturally with стріла́ (id-v2-1672).',
  },
  // Position 159: id-v2-1941 (рефлекто́р лобови́й — doctor head mirror)
  'id-v2-1941': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: рефлекто́р лобови́й (doctor head mirror) is a dated specialist ENT reflector rarely encountered in contemporary 2020s medical clinics.',
  },
  // Position 160: id-v2-1951 (тренаже́р орбітре́к — elliptical trainer)
  'id-v2-1951': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Hold for review: тренаже́р орбітре́к (normalized to орбітре́к, elliptical trainer) is a common gym cardio machine held in REVIEW alongside Batch 1 KEEP gm-treadmill (бігова́ дорі́жка) and Batch 4 KEEP id-v2-1040 (велотренаже́р).',
  },
  // Position 161: id-v2-1672 (стріла́ для лу́ка — arrow)
  'id-v2-1672': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'sports_venue'],
    rationaleEn:
      'Keep (useful_extended): стріла́ для лу́ка (normalized to стріла́, arrow) is a core, visually unmistakable Ukrainian noun paired with лук (id-v2-1671).',
  },
  // Position 162: id-v2-1942 (зуболіка́рський зонд — dental explorer probe)
  'id-v2-1942': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: зуболіка́рський зонд (dental explorer probe) is a fine specialist dental pick with poor standalone visual distinctiveness in scene images.',
  },
  // Position 163: id-v2-1952 (стійка для штанги — barbell squat rack)
  'id-v2-1952': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: стійка для штанги (barbell squat rack) is a secondary gym support frame for approved Batch 1 KEEP gm-barbell (шта́нга, barbell).',
  },
  // Position 164: id-v2-1669 (міше́нь для да́ртсу — dartboard)
  'id-v2-1669': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'office', 'park'],
    rationaleEn:
      'Keep (common_situational): міше́нь для да́ртсу (normalized to міше́нь, target / dartboard) teaches the high-utility Ukrainian noun міше́нь with an unmistakable concentric bullseye visual profile.',
  },
  // Position 165: id-v2-1683 (канат для ла́зіння — climbing rope)
  'id-v2-1683': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym', 'classroom', 'park'],
    rationaleEn:
      'Keep (common_situational): канат для ла́зіння (normalized to кана́т, climbing rope / thick cable) provides the core Ukrainian noun кана́т in school-gymnasium and playground scenes.',
  },
  // Position 166: id-v2-1943 (дзеркальце стоматологі́чне — angled dental mouth mirror)
  'id-v2-1943': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: дзеркальце стоматологі́чне (angled dental mouth mirror) is a diminutive variant of Batch 5 EXCLUDE id-v2-1011 (дзеркало стоматологі́чне) and is a specialist dental instrument.',
  },
  // Position 167: id-v2-1953 (млинець для штанги — cast-iron weight plate)
  'id-v2-1953': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: млинець для штанги (cast-iron weight plate) matches Batch 4 EXCLUDE id-v2-1045 (млине́ць (диск для штанги)) as a component sub-part of Batch 1 KEEP gm-barbell (шта́нга).',
  },
  // Position 168: id-v2-1676 (трамплі́н для стрибкі́в у во́ду — diving board)
  'id-v2-1676': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['sports_venue', 'gym'],
    rationaleEn:
      'Keep (common_situational): трамплі́н для стрибкі́в у во́ду (normalized to трамплі́н, diving board / springboard) is a visually unmistakable swimming-pool fixture and core Ukrainian noun.',
  },
  // Position 169: id-v2-1677 (дорі́жка розділювальна — pool lane rope)
  'id-v2-1677': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['sports_venue'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: дорі́жка розділювальна (pool lane rope) is a secondary floating divider line inside a swimming pool (id-v2-1077).',
  },
  // Position 170: id-v2-1934 (ростомі́р меди́чний — clinic height stadiometer)
  'id-v2-1934': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: ростомі́р меди́чний (clinic height stadiometer) is a modifier-padded variant of Batch 7 EXCLUDE id-v2-1647 (ростомі́р, stadiometer height rod).',
  },
  // Position 171: id-v2-1944 (капа стоматологі́чна — clear dental aligner / mouthguard)
  'id-v2-1944': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital', 'bathroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: капа стоматологі́чна (clear dental aligner / mouthguard) is a specialist orthodontic tray with poor visual visibility in realistic scenes.',
  },
  // Position 172: id-v2-1954 (рукави́чки атлети́чні — weightlifting fingerless gloves)
  'id-v2-1954': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: рукави́чки атлети́чні (weightlifting fingerless gloves) is a specialized gym accessory redundant alongside approved Batch 2 KEEP id-v2-852 (рукави́чки, gloves).',
  },
  // Position 173: id-v2-1935 (ваги́ меди́чні — clinical balance scale)
  'id-v2-1935': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: ваги́ меди́чні (clinical balance scale) is a specialized clinic scale redundant alongside household bathroom scale id-v2-319 (підло́гові ваги́, Batch 3 KEEP), kitchen scale id-v2-163 (Batch 7 KEEP), and produce scale id-v2-1364 (Stage 2 KEEP).',
  },
  // Position 174: id-v2-1955 (магне́зія спортивна — gym chalk block)
  'id-v2-1955': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: магне́зія спортивна (gym chalk block) is specialist weightlifting magnesium carbonate chalk with poor visual distinctiveness.',
  },
  // Position 175: id-v2-1666 (стіл те́нісний — ping-pong table)
  'id-v2-1666': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym', 'park', 'classroom'],
    rationaleEn:
      'Keep (common_situational): стіл те́нісний (normalized to те́нісний стіл, ping-pong table) is a ubiquitous, visually unmistakable table-tennis table in Ukrainian parks, courtyards, schools, and recreation rooms.',
  },
  // Position 176: id-v2-1936 (негатоско́п для зні́мків — X-ray light box viewer)
  'id-v2-1936': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: негатоско́п для зні́мків (X-ray light box viewer) is specialist medical radiology hardware outside everyday learner vocabulary.',
  },
  // Position 177: id-v2-1946 (пухи́р для льо́ду — medical ice pack bag)
  'id-v2-1946': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital', 'pharmacy'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: пухи́р для льо́ду (medical ice pack bag) is formal clinical terminology with low everyday conversational frequency.',
  },
  // Position 178: id-v2-1956 (стартова ту́мба в басе́йні — swimming pool starting block)
  'id-v2-1956': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['sports_venue'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: стартова ту́мба в басе́йні (swimming pool starting block) is a competition-pool deck pedestal sub-part.',
  },
  // Position 179: id-v2-1937 (джгут кровоспи́нний — medical tourniquet band)
  'id-v2-1937': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital', 'pharmacy'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: джгут кровоспи́нний (medical tourniquet band) matches Batch 5 EXCLUDE id-v2-1014 (джгут меди́чний, tourniquet) as a specialized clinical/first-aid strap.',
  },
  // Position 180: id-v2-1938 (пробі́рка вакута́йнер — blood collection tube)
  'id-v2-1938': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: пробі́рка вакута́йнер (blood collection tube) is a specialist phlebotomy subtype of Batch 5 EXCLUDE id-v2-779 (пробі́рка, test tube).',
  },
  // Position 181: id-v2-1667 (кий білья́рдний — billiard cue stick)
  'id-v2-1667': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'cafe'],
    rationaleEn:
      'Keep (useful_extended): кий білья́рдний (normalized to білья́рдний кий, accepting кий, billiard cue stick) is a visually unmistakable recreation item in billiard and game-room scenes.',
  },
  // Position 182: id-v2-1668 (ку́ля білья́рдна — billiard ball)
  'id-v2-1668': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'cafe'],
    rationaleEn:
      'Keep (useful_extended): ку́ля білья́рдна (normalized to білья́рдна ку́ля, billiard ball) is a visually unmistakable numbered billiard ball pairing with білья́рдний кий (id-v2-1667).',
  },
  // Position 183: id-v2-1678 (до́шка для пла́вання — kickboard)
  'id-v2-1678': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['sports_venue', 'gym'],
    rationaleEn:
      'Hold for review: до́шка для пла́вання (foam swimming kickboard) is a recognizable pool training aid held in REVIEW alongside Batch 8 REVIEW id-v2-1957 (колоба́шка / нудл для басе́йну).',
  },
  // Position 184: id-v2-1948 (ходунки́ реабілітаці́йні — folding walking frame)
  'id-v2-1948': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital', 'pharmacy', 'living_room'],
    rationaleEn:
      'Keep (common_situational): ходунки́ реабілітаці́йні (normalized to ходунки́, folding walking frame / walker) is a practical, visually unmistakable medical mobility aid distinct from crutches (ми́лиці) and wheelchairs (інвалі́дний візо́к).',
  },
  // Position 185: id-v2-1958 (рятува́льна ви́шка — lifeguard high chair)
  'id-v2-1958': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'sports_venue'],
    rationaleEn:
      'Hold for review: рятува́льна ви́шка (lifeguard high chair / tower) is a recognizable beach and poolside structure held in REVIEW alongside Batch 9 KEEP id-v2-1492 (рятува́льник пля́жний, lifeguard).',
  },
  // Position 186: id-v2-1679 (нарука́вники надувні́ — inflatable water wings)
  'id-v2-1679': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'sports_venue'],
    rationaleEn:
      'Hold for review: нарука́вники надувні́ (normalized to надувні́ нарука́вники, inflatable swim water wings) is a recognizable children’s swimming aid held in REVIEW.',
  },
  // Position 187: id-v2-1939 (шпа́тель меди́чний — wooden tongue depressor)
  'id-v2-1939': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: шпа́тель меди́чний (wooden tongue depressor) is a disposable clinic wooden blade visually ambiguous against a craft/popsicle stick.',
  },
  // Position 188: id-v2-1151 (сантиметро́ва стрі́чка — tailor measuring tape)
  'id-v2-1151': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'living_room', 'clothing_store'],
    rationaleEn:
      'Keep (common_situational): сантиметро́ва стрі́чка (accepting colloquial сантиме́тр, flexible tailor measuring tape) is a common household sewing and clothing-measurement ribbon distinct from a metal construction tape measure (руле́тка будіве́льна).',
  },
  // Position 189: id-v2-1736 (медіа́тор гіта́рний — guitar pick / plectrum)
  'id-v2-1736': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living_room'],
    rationaleEn:
      'Hold for review: медіа́тор гіта́рний (normalized to медіа́тор, guitar pick / plectrum) is a common musical accessory held in REVIEW because its small triangular shape requires close-up framing.',
  },
  // Position 190: id-v2-1738 (педа́ль ефе́ктів — guitar effects pedal)
  'id-v2-1738': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living_room'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: педа́ль ефе́ктів (guitar effects stompbox pedal) is specialist electric-guitar audio hardware outside core everyday vocabulary.',
  },
  // Position 191: id-v2-1746 (рамка баге́тна — ornate wooden frame)
  'id-v2-1746': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: рамка баге́тна (ornate wooden molding frame) is a specialized framing-shop subtype redundant alongside approved Batch 2 KEEP id-v2-261 (фотора́мка, picture frame) and id-v2-260 (ка́ртина, painting).',
  },
  // Position 192: id-v2-1154 (гачо́к для в’яза́ння — crochet hook)
  'id-v2-1154': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): гачо́к для в’яза́ння (crochet hook, accepting в’яза́льний гачо́к) is a common household yarn-craft tool distinct from straight knitting needles (спи́ці в’яза́льні, id-v2-1153).',
  },
  // Position 193: id-v2-1739 (підста́вка для гіта́ри — guitar stand)
  'id-v2-1739': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'living_room'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: підста́вка для гіта́ри (guitar stand) is a secondary instrument support rack for approved Batch 6 KEEP id-v2-1119 (гіта́ра акусти́чна).',
  },
  // Position 194: id-v2-1740 (чохо́л для гіта́ри — guitar case)
  'id-v2-1740': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'living_room', 'city_street'],
    rationaleEn:
      'Hold for review: чохо́л для гіта́ри (padded guitar gig bag / case) is a recognizable music-student and street-musician item held in REVIEW alongside Batch 9 REVIEW id-v2-1985 (чохо́л для скри́пки).',
  },
  // Position 195: id-v2-1744 (гіпсовий бюст — plaster bust cast)
  'id-v2-1744': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: гіпсовий бюст (normalized to бюст, accepting погру́ддя, plaster bust sculpture) is a classic art-studio and museum object held in REVIEW.',
  },
  // Position 196: id-v2-1150 (шпи́лька краве́цька — straight pin)
  'id-v2-1150': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'bedroom', 'clothing_store'],
    rationaleEn:
      'Keep (common_situational): шпи́лька краве́цька (normalized to краве́цька шпи́лька, ball-headed straight tailoring pin) is a common household sewing fastener distinct from an eyed sewing needle (го́лка шве́йна, id-v2-1147) and a hairpin (шпи́лька для воло́сся, id-v2-1514).',
  },
  // Position 197: id-v2-1156 (п’я́льця для вишива́ння — embroidery hoop)
  'id-v2-1156': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'bedroom', 'classroom'],
    rationaleEn:
      'Keep (common_situational): п’я́льця для вишива́ння (normalized to п’я́льця, circular embroidery hoop) is a culturally resonant and visually unmistakable Ukrainian needlecraft tool.',
  },
  // Position 198: id-v2-1741 (етю́дник худо́жній — pochade sketchbox)
  'id-v2-1741': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'park'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: етю́дник худо́жній (pochade sketchbox) is a specialist plein-air painter’s tripod box redundant alongside approved Batch 6 KEEP id-v2-1136 (мольбе́рт, wooden easel) and id-v2-1138 (палі́тра худо́жня, artist palette).',
  },
  // Position 199: id-v2-1745 (сте́ка для лі́плення — clay modeling tool)
  'id-v2-1745': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: сте́ка для лі́плення (clay modeling tool) is a specialist sculpting spatula with low everyday relevance and poor visual distinctiveness.',
  },
  // Position 200: id-v2-1747 (тка́цький верста́т — handloom)
  'id-v2-1747': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'countryside'],
    rationaleEn:
      'Hold for review: тка́цький верста́т (traditional wooden handloom) is a visually unmistakable Ukrainian folk-weaving craft loom held in REVIEW alongside Batch 9 REVIEW id-v2-1748 (веретено́ / прядка).',
  },
};

// ----------------------------------------------------------------------------
// 5. Compact Stage 4 Partial Report Helper
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL =
  '14c0d230d708a129921d29e53a0290dceb407a4d30323d742704e4aa3c51e100' as const;

export const IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_PREFIX =
  '14c0d230d708a129' as const;

export const BATCH_10_STAGED_200_DECISION_SHA256 =
  '05074dfffc9e1d68af69d90a584f120e70392f9d119599c651f95d7affd5ff80' as const;

export const BATCH_10_STAGED_200_DECISION_SHA256_PREFIX =
  '05074dfffc9e1d68' as const;

export interface IdentifyBatch10Stage4PartialSummary {
  reportVersion: '10.4.0-batch10-stage4-partial';
  stageLabel: typeof IDENTIFY_BATCH_10_STAGE_4_LABEL;
  batchNumber: 10;
  stageNumber: 4;
  manifestPositionsCovered: readonly [151, 200];
  manifestSha256Full: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL;
  manifestSha256Prefix: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX;
  verifiedStage1DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL;
  verifiedStage1DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX;
  verifiedStage2DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL;
  verifiedStage2DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX;
  verifiedStage3DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL;
  verifiedStage3DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX;
  stage4DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL;
  stage4DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_PREFIX;
  combinedStaged200DecisionSha256Full: typeof BATCH_10_STAGED_200_DECISION_SHA256;
  combinedStaged200DecisionSha256Prefix: typeof BATCH_10_STAGED_200_DECISION_SHA256_PREFIX;
  candidatesReviewedInStage4Count: 50;
  stage4RecommendedKeepCount: 14;
  stage4RecommendedReviewCount: 11;
  stage4RecommendedExcludeCount: 25;
  stage4PriorityBreakdownOfKept: {
    essential_everyday: 0;
    common_situational: 10;
    useful_extended: 4;
  };
  semanticRelationshipsInStage4Count: number;
  canonicalDuplicateRelationshipsInStage4Count: 1;
  nonDuplicateSemanticComparisonsInStage4Count: 36;
  headwordNormalizationsInStage4Count: 20;
  essentialEverydayJustificationsInStage4Count: 0;
  registeredInCumulativeApprovedStore: false;
}

export function getBatch10Stage4PartialReport(): IdentifyBatch10Stage4PartialSummary {
  return {
    reportVersion: '10.4.0-batch10-stage4-partial',
    stageLabel: IDENTIFY_BATCH_10_STAGE_4_LABEL,
    batchNumber: 10,
    stageNumber: 4,
    manifestPositionsCovered: [151, 200],
    manifestSha256Full: IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
    manifestSha256Prefix: IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
    verifiedStage1DecisionSha256Full:
      IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
    verifiedStage1DecisionSha256Prefix:
      IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
    verifiedStage2DecisionSha256Full:
      IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
    verifiedStage2DecisionSha256Prefix:
      IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX,
    verifiedStage3DecisionSha256Full:
      IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
    verifiedStage3DecisionSha256Prefix:
      IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX,
    stage4DecisionSha256Full: IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_FULL,
    stage4DecisionSha256Prefix: IDENTIFY_BATCH_10_STAGE_4_DECISION_SHA256_PREFIX,
    combinedStaged200DecisionSha256Full: BATCH_10_STAGED_200_DECISION_SHA256,
    combinedStaged200DecisionSha256Prefix:
      BATCH_10_STAGED_200_DECISION_SHA256_PREFIX,
    candidatesReviewedInStage4Count: 50,
    stage4RecommendedKeepCount: 14,
    stage4RecommendedReviewCount: 11,
    stage4RecommendedExcludeCount: 25,
    stage4PriorityBreakdownOfKept: {
      essential_everyday: 0,
      common_situational: 10,
      useful_extended: 4,
    },
    semanticRelationshipsInStage4Count:
      IDENTIFY_BATCH_10_STAGE_4_SEMANTIC_RELATIONSHIP_RECORDS.length,
    canonicalDuplicateRelationshipsInStage4Count: 1,
    nonDuplicateSemanticComparisonsInStage4Count: 36,
    headwordNormalizationsInStage4Count:
      IDENTIFY_BATCH_10_STAGE_4_HEADWORD_NORMALIZATION_RECORDS.length as 20,
    essentialEverydayJustificationsInStage4Count:
      IDENTIFY_BATCH_10_STAGE_4_ESSENTIAL_EVERYDAY_REASONS.length as 0,
    registeredInCumulativeApprovedStore: false,
  };
}
