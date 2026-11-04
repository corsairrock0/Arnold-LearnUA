// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 10 — PARTIAL STAGE 3 / 4
// (MANIFEST POSITIONS 101..150 OF 200 REMAINING LEGACY NOUNS)
// ============================================================================
// IMPORTANT STAGE BOUNDARY:
// - This file is clearly labeled BATCH 10 — PARTIAL STAGE 3 / 4.
// - It reviews ONLY manifest positions 101..150 from
//   `IDENTIFY_BATCH_10_FROZEN_MANIFEST` (`src/identifyCurriculumCurationPhase1Batch10Manifest.ts`).
// - It preserves `src/identifyCurriculumCurationPhase1Batch10Manifest.ts`,
//   `src/identifyCurriculumCurationPhase1Batch10Part1.ts` (Stage 1), and
//   `src/identifyCurriculumCurationPhase1Batch10Part2.ts` (Stage 2) completely
//   untouched.
// - It does NOT modify `src/identifyCurriculumCurationPhase1.ts` or register
//   partial Batch 10 decisions into `approvedDecisionsStore`. Official
//   cumulative totals remain fixed at 1,800 reviewed (1,103 KEEP, 291 REVIEW,
//   406 EXCLUDE, 200 unreviewed) until all four Batch 10 stages are completed.
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

export const IDENTIFY_BATCH_10_STAGE_3_LABEL =
  'BATCH 10 — PARTIAL STAGE 3 / 4' as const;

export type ExplicitBatch10Stage3Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch10Stage3SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

export const IDENTIFY_BATCH_10_STAGE_3_MANIFEST_SLICE: readonly IdentifyBatch10ManifestEntry[] =
  IDENTIFY_BATCH_10_FROZEN_MANIFEST.slice(100, 150);

// ----------------------------------------------------------------------------
// 1. Batch 10 Stage 3 Semantic Duplicate & Relationship Records (Positions 101..150)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage3SemanticRelationshipRecord {
  batchNumber: 10;
  stageNumber: 3;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage3SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

interface RawBatch10Stage3SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage3SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch10Stage3SemanticRelationshipSeed[] =
  [
    // === A. 5 CANONICAL DUPLICATE EXCLUSIONS (countsAsDuplicateConcept: true) ===
    {
      candidateVocabularyId: 'id-v2-1932',
      comparedVocabularyId: 'id-v2-1592',
      comparedBatchNumber: 9,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'коса́ травоко́сна (traditional scythe, noun-concept-0942) is a modifier-padded duplicate of approved Batch 9 KEEP id-v2-1592 (коса́ ручна́, scythe, noun-concept-1548).',
    },
    {
      candidateVocabularyId: 'id-v2-1401',
      comparedVocabularyId: 'id-v2-1847',
      comparedBatchNumber: 9,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'поли́ця спа́льна (у вагоні) (train sleeping berth, noun-concept-1087) is a synonymous phrasal duplicate of approved Batch 9 KEEP id-v2-1847 (поли́ця купе́йна, sleeping berth bunk, noun-concept-1021).',
    },
    {
      candidateVocabularyId: 'id-v2-1906',
      comparedVocabularyId: 'id-v2-775',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'бейджик іменни́й (name badge lanyard, noun-concept-1314) is a diminutive modifier-padded duplicate of approved Batch 5 KEEP id-v2-775 (бейдж, ID badge, noun-concept-1129).',
    },
    {
      candidateVocabularyId: 'id-v2-1897',
      comparedVocabularyId: 'id-v2-1635',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'табле́тниця кишенько́ва (pocket pillbox, noun-concept-1331) is a synonymous duplicate of approved Batch 8 KEEP id-v2-1635 (контейнер для табле́ток, pill organizer box, noun-concept-1792).',
    },
    {
      candidateVocabularyId: 'id-v2-1880',
      comparedVocabularyId: 'id-v2-1506',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'вітро́вка спортивна (lightweight windbreaker jacket, noun-concept-1382) is an orthographic and modifier-padded duplicate of approved Batch 6 KEEP id-v2-1506 (вітрі́вка, windbreaker jacket, noun-concept-1394).',
    },

    // === B. 28 NON-DUPLICATE SEMANTIC COMPARISONS (countsAsDuplicateConcept: false) ===
    {
      candidateVocabularyId: 'id-v2-1912',
      comparedVocabularyId: 'id-v2-912',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'лата́ття бі́ле (водяна́ лі́лія) (water lily pad, noun-concept-1632) combines a botanical species headword with an English leaf-pad gloss ("water lily pad", matching Batch 8 REVIEW id-v2-1565 лата́ття бі́ле), whereas approved Batch 4 KEEP id-v2-912 (лі́лія водяна́ / лата́ття, water lily, noun-concept-1473) represents the flowering aquatic plant; excluded independently without claiming canonical plant-vs-leaf equivalence.',
    },
    {
      candidateVocabularyId: 'id-v2-1974',
      comparedVocabularyId: 'id-v2-1119',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'гриф гіта́рний з лада́ми (fretted guitar neck, noun-concept-0919) is a structural sub-part of approved Batch 6 KEEP id-v2-1119 (гіта́ра акусти́чна, acoustic guitar, noun-concept-1963); excluded on specialist part-whole grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1749',
      comparedVocabularyId: 'id-v2-1750',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'писачо́к для писанок (kistka wax stylus, noun-concept-0927) is the traditional wax-resist decorating stylus used to make approved Batch 2 KEEP id-v2-1750 (пи́санка, pysanka Easter egg, noun-concept-0934); held in REVIEW as a distinct cultural craft tool.',
    },
    {
      candidateVocabularyId: 'id-v2-1975',
      comparedVocabularyId: 'id-v2-1119',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'дека резона́нсна (spruce soundboard, noun-concept-0929) is an acoustic instrument sub-part compared to approved Batch 6 KEEP id-v2-1119 (гіта́ра акусти́чна, acoustic guitar); excluded on specialist part-whole grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1338',
      comparedVocabularyId: 'id-v2-1820',
      comparedBatchNumber: 8,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'квітко́вий павільйо́н (glass-walled street flower pavilion / flower shop, noun-concept-0932) is a distinct urban retail kiosk type compared to press/newspaper kiosk id-v2-1820 (кіо́ск з пре́сою, Batch 8 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1931',
      comparedVocabularyId: 'id-v2-383',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'сапа́ (моти́ка) (normalized to сапа́, garden hoe, noun-concept-0935) and Batch 3 REVIEW id-v2-383 (моти́ка, garden hoe, noun-concept-0161) are Ukrainian synonyms for the exact same physical garden weeding hoe; id-v2-1931 is kept as the primary conversational headword (сапа́, accepting моти́ка) with countsAsDuplicateConcept: false only because id-v2-383 is in REVIEW rather than KEEP, and id-v2-383 is flagged for final curriculum reconciliation so both synonyms are never counted as two distinct concepts in the 1,200 shortlist.',
    },
    {
      candidateVocabularyId: 'id-v2-1976',
      comparedVocabularyId: 'id-v2-1117',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кла́віші роя́ля (ivory and ebony piano keys, noun-concept-0936) is an instrument sub-part of approved Batch 4 KEEP id-v2-1117 (піані́но / роя́ль, piano, noun-concept-1921); excluded on part-whole granularity grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1339',
      comparedVocabularyId: 'of-phone',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'телефо́нна бу́дка (street telephone booth, noun-concept-0939) is a distinct street enclosure compared to the telephone device itself of-phone (телефо́н, Batch 1 KEEP); held in REVIEW due to declining presence in 2020s urban scenes.',
    },
    {
      candidateVocabularyId: 'id-v2-1355',
      comparedVocabularyId: 'id-v2-1333',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'меморіа́льна до́шка (stone or bronze commemorative facade plaque, noun-concept-0940) is a distinct civic heritage object compared to standard municipal street-name sign id-v2-1333 (табли́чка з на́звою ву́лиці, Batch 9 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1977',
      comparedVocabularyId: 'id-v2-1117',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'педа́ль фортепіа́нна (brass piano sustain pedal, noun-concept-0943) is a hardware sub-part of approved Batch 4 KEEP id-v2-1117 (піані́но / роя́ль, piano); excluded on specialist part-whole grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1988',
      comparedVocabularyId: 'id-v2-1126',
      comparedBatchNumber: 2,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'сопі́лка яворо́ва (maple folk flute, noun-concept-1088) is a material-modified variant of Batch 2 REVIEW id-v2-1126 (сопі́лка, sopilka wooden flute, noun-concept-1985); excluded without setting duplicateOfVocabularyId so only the base noun сопі́лка remains in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1388',
      comparedVocabularyId: 'id-v2-672',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'трап надувни́й (emergency evacuation slide, noun-concept-1093) is an emergency-only aviation chute distinct from everyday passenger boarding stairs id-v2-672 (трап посадко́вий, Batch 4 KEEP); excluded for low everyday relevance.',
    },
    {
      candidateVocabularyId: 'id-v2-1933',
      comparedVocabularyId: 'id-v2-1593',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'серп жнива́рський (crescent harvesting sickle, noun-concept-1095) is a modifier-padded variant of Batch 8 EXCLUDE id-v2-1593 (серп, sickle, noun-concept-1569); excluded consistently without linking to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1389',
      comparedVocabularyId: 'id-v2-1012',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кисне́ва ма́ска (medical/aviation oxygen breathing mask, noun-concept-1102) is a distinct clinical/emergency mask compared to everyday disposable surgical mask id-v2-1012 (меди́чна ма́ска, Batch 5 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1960',
      comparedVocabularyId: 'id-v2-1100',
      comparedBatchNumber: 6,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'блок жи́влення ноутбу́ка (laptop power brick adapter, noun-concept-1104) is a device-specific power-cord component compared to approved Batch 6 KEEP id-v2-1100 (заря́дний при́стрій, charger adapter, noun-concept-1940); excluded as redundant hardware detail.',
    },
    {
      candidateVocabularyId: 'id-v2-1990',
      comparedVocabularyId: 'id-v2-1125',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'окари́на керамі́чна (ceramic ocarina whistle flute, noun-concept-1105) is a niche folk clay flute compared to approved Batch 5 KEEP id-v2-1125 (фле́йта, flute); excluded for low everyday relevance.',
    },
    {
      candidateVocabularyId: 'id-v2-1390',
      comparedVocabularyId: 'id-v2-1410',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'штурва́л літака́ (aircraft control yoke, noun-concept-1109) is a specialist cockpit flight control compared to Batch 7 EXCLUDE id-v2-1410 (штурва́л корабе́льний, ship’s wheel); excluded on specialist aviation grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1876',
      comparedVocabularyId: 'id-v2-1195',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'лійка скляна́ лабораторна (glass laboratory filter funnel, noun-concept-1123) is specialist chemistry glassware compared to everyday kitchen measuring cup id-v2-1195 (мі́рна скля́нка, Batch 3 KEEP); excluded on specialist laboratory grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1877',
      comparedVocabularyId: 'id-v2-1472',
      comparedBatchNumber: 9,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ступка́ порцеля́нова (porcelain lab mortar, noun-concept-1143) matches Batch 9 EXCLUDE id-v2-1472 (ступка фарфо́рова, porcelain mortar, noun-concept-1204) and Batch 4 EXCLUDE id-v2-184 (ступка́); excluded consistently without linking to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1878',
      comparedVocabularyId: 'id-v2-785',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ске́льце предметне (microscope glass slide, noun-concept-1162) is an inverted-word-order variant of Batch 6 EXCLUDE id-v2-785 (предме́тне ске́льце, microscope slide, noun-concept-1117); excluded on specialist laboratory grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1875',
      comparedVocabularyId: 'id-v2-781',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'мензу́рка мі́рна (graduated cylinder, noun-concept-1257) is a modifier-padded variant of Batch 5 EXCLUDE id-v2-781 (ме́нзурка, graduated cylinder / beaker, noun-concept-1147); excluded on specialist laboratory grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1884',
      comparedVocabularyId: 'id-v2-831',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'плахта тка́на (traditional woven Ukrainian wrap skirt plakhta, noun-concept-1272) is a culturally specific folk-dress garment compared to everyday modern skirt id-v2-831 (спідни́ця, Batch 2 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1894',
      comparedVocabularyId: 'id-v2-1525',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'підо́шва череви́ка (boot tread sole, noun-concept-1273) overlaps with Batch 8 EXCLUDE id-v2-1525 (підо́шва взуття́, shoe sole, noun-concept-1381) as a footwear sub-part; excluded consistently.',
    },
    {
      candidateVocabularyId: 'id-v2-1887',
      comparedVocabularyId: 'id-v2-1512',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'запонки сорочко́ві (shirt cufflinks, noun-concept-1330) is a modifier-padded variant of Batch 6 EXCLUDE id-v2-1512 (за́понки, cufflinks, noun-concept-1327); excluded as a small formal accessory.',
    },
    {
      candidateVocabularyId: 'id-v2-1888',
      comparedVocabularyId: 'id-v2-1513',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'затиска́ч для крава́тки (tie clip bar, noun-concept-1349) is a synonymous variant of Batch 6 EXCLUDE id-v2-1513 (шпи́лька для крава́тки, tie clip, noun-concept-1346); excluded as a small formal accessory.',
    },
    {
      candidateVocabularyId: 'id-v2-1899',
      comparedVocabularyId: 'id-v2-1139',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пензлик для макія́жу (soft cosmetic makeup blush brush, noun-concept-1366) is a distinct personal-care grooming tool compared to fine-art paintbrush id-v2-1139 (пензлик худо́жній, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1881',
      comparedVocabularyId: 'id-v2-826',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'парка зимо́ва (normalized to па́рка, hooded winter parka, noun-concept-1397) is a specific winter coat subtype compared to general jacket id-v2-826 (ку́ртка, Batch 2 KEEP) and puffer jacket id-v2-827 (пухови́к, Batch 4 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1911',
      comparedVocabularyId: 'id-v2-900',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'очере́т озе́рний (cattail reed / bulrush, noun-concept-1611) is a modifier-padded variant of Batch 4 REVIEW id-v2-900 (очере́т, reeds / cattails, noun-concept-1432); excluded without setting duplicateOfVocabularyId so only the base noun очере́т remains in REVIEW.',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch10Stage3SemanticRelationshipRecord[] =
  RAW_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 10,
      stageNumber: 3,
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
// 2. Batch 10 Stage 3 Learner Headword Normalizations (Non-Destructive Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage3HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 10;
  stageNumber: 3;
  normalizationReasonEn: string;
}

interface RawBatch10Stage3HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch10Stage3HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1749',
      preferredLearnerHeadwordUk: 'писачо́к',
      acceptedConversationalSynonymsUk: ['писачо́к для писанок', 'кі́стка'],
      normalizationReasonEn:
        'Strips redundant purpose phrase для писанок so learners practice concise folk-craft noun писачо́к.',
    },
    {
      vocabularyId: 'id-v2-1354',
      preferredLearnerHeadwordUk: 'герб',
      acceptedConversationalSynonymsUk: [
        'герб на фаса́ді',
        'держа́вний герб',
        'три́зуб',
      ],
      normalizationReasonEn:
        'Strips locative prepositional phrase на фаса́ді so learners practice foundational civic noun герб (coat of arms).',
    },
    {
      vocabularyId: 'id-v2-1931',
      preferredLearnerHeadwordUk: 'сапа́',
      acceptedConversationalSynonymsUk: [
        'моти́ка',
        'са́пка',
        'сапа́ (моти́ка)',
      ],
      normalizationReasonEn:
        'Strips parenthetical synonym (моти́ка) and normalizes to primary conversational Ukrainian garden noun сапа́.',
    },
    {
      vocabularyId: 'id-v2-1987',
      preferredLearnerHeadwordUk: 'трембі́та',
      acceptedConversationalSynonymsUk: ['трембі́та карпа́тська'],
      normalizationReasonEn:
        'Strips geographic modifier карпа́тська so learners practice iconic single-word Ukrainian instrument noun трембі́та.',
    },
    {
      vocabularyId: 'id-v2-1989',
      preferredLearnerHeadwordUk: 'дри́мба',
      acceptedConversationalSynonymsUk: ['варга́н'],
      normalizationReasonEn:
        'Normalizes slash-compound and non-standard orthography дрымба / варга́н to standard Ukrainian spelling дри́мба while accepting standard Ukrainian synonym варга́н.',
    },
    {
      vocabularyId: 'id-v2-1884',
      preferredLearnerHeadwordUk: 'пла́хта',
      acceptedConversationalSynonymsUk: ['плахта тка́на', 'тка́на пла́хта'],
      normalizationReasonEn:
        'Strips redundant material modifier тка́на so learners practice traditional Ukrainian garment noun пла́хта.',
    },
    {
      vocabularyId: 'id-v2-1881',
      preferredLearnerHeadwordUk: 'па́рка',
      acceptedConversationalSynonymsUk: ['парка зимо́ва', 'зимо́ва па́рка'],
      normalizationReasonEn:
        'Strips redundant seasonal adjective зимо́ва so learners practice concise outerwear noun па́рка.',
    },
    {
      vocabularyId: 'id-v2-1882',
      preferredLearnerHeadwordUk: 'кожу́х',
      acceptedConversationalSynonymsUk: ['кожу́х ове́чий', 'ове́чий кожу́х'],
      normalizationReasonEn:
        'Strips redundant material adjective ове́чий so learners practice traditional Ukrainian winter coat noun кожу́х.',
    },
    {
      vocabularyId: 'id-v2-1892',
      preferredLearnerHeadwordUk: 'у́стілка',
      acceptedConversationalSynonymsUk: [
        'устілка для взуття́',
        'взуттє́ва у́стілка',
      ],
      normalizationReasonEn:
        'Strips redundant purpose phrase для взуття́ so learners practice natural single-word noun у́стілка (shoe insole).',
    },
    {
      vocabularyId: 'id-v2-1903',
      preferredLearnerHeadwordUk: 'бігуді́',
      acceptedConversationalSynonymsUk: ['бігуді́ для воло́сся'],
      normalizationReasonEn:
        'Strips redundant purpose phrase для воло́сся so learners practice natural single-word pluralia tantum noun бігуді́.',
    },
    {
      vocabularyId: 'id-v2-1583',
      preferredLearnerHeadwordUk: 'опу́дало',
      acceptedConversationalSynonymsUk: [
        'опудало городнє',
        'горо́днє опу́дало',
        'чу́чело',
      ],
      normalizationReasonEn:
        'Strips locative modifier городнє so learners practice concise everyday noun опу́дало (scarecrow).',
    },
    {
      vocabularyId: 'id-v2-1921',
      preferredLearnerHeadwordUk: 'стільники́',
      acceptedConversationalSynonymsUk: [
        'стільники́ медо́ві',
        'медо́ві стільники́',
      ],
      normalizationReasonEn:
        'Strips redundant modifier медо́ві so learners practice natural Ukrainian plural noun стільники́ (honeycomb).',
    },
    {
      vocabularyId: 'id-v2-1537',
      preferredLearnerHeadwordUk: 'сосно́вий бір',
      acceptedConversationalSynonymsUk: ['бір', 'бір сосно́вий', 'сосно́вий ліс'],
      normalizationReasonEn:
        'Reorders inverted catalog phrase бір сосно́вий to natural Ukrainian adjective-noun order сосно́вий бір while accepting single-word бір.',
    },
    {
      vocabularyId: 'id-v2-1585',
      preferredLearnerHeadwordUk: 'дощова́ ді́жка',
      acceptedConversationalSynonymsUk: [
        'ді́жка дощова́',
        'ді́жка для дощово́ї води́',
        'ді́жка',
        'бо́чка',
      ],
      normalizationReasonEn:
        'Reorders inverted catalog phrase ді́жка дощова́ to natural Ukrainian adjective-first order дощова́ ді́жка (rain barrel) while accepting ді́жка and бо́чка.',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch10Stage3HeadwordNormalizationRecord[] =
  RAW_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
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
      stageNumber: 3,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Stage 3 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage3EssentialEverydayReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  stageNumber: 3;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [];

export const IDENTIFY_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS: readonly IdentifyBatch10Stage3EssentialEverydayReason[] =
  RAW_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
    const master = resolveMasterNounById(item.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      stageNumber: 3,
      independentPedagogicalJustificationEn:
        item.independentPedagogicalJustificationEn,
    };
  });

// ----------------------------------------------------------------------------
// 4. Explicit Batch 10 Stage 3 Assessments (Manifest Positions 101..150 Only)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_10_STAGE_3_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch10Stage3Assessment>
> = {
  // Position 101: id-v2-1974 (гриф гіта́рний з лада́ми — fretted guitar neck)
  'id-v2-1974': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: гриф гіта́рний з лада́ми (fretted guitar neck) is a specialist structural sub-part of an acoustic guitar (id-v2-1119) rather than a standalone everyday learner concept.',
  },
  // Position 102: id-v2-1749 (писачо́к для писанок — kistka wax stylus)
  'id-v2-1749': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living_room'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: писачо́к для писанок (normalized to писачо́к, kistka wax stylus) is a culturally authentic Ukrainian Easter pysanka craft tool held in REVIEW for folk-art scenes.',
  },
  // Position 103: id-v2-1975 (дека резона́нсна — spruce soundboard)
  'id-v2-1975': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: дека резона́нсна (spruce soundboard) is a technical luthier/instrument-body sub-part with poor standalone visual identifiability.',
  },
  // Position 104: id-v2-1338 (квітко́вий павільйо́н — flower kiosk)
  'id-v2-1338': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'market'],
    rationaleEn:
      'Keep (common_situational): квітко́вий павільйо́н (street flower pavilion / flower kiosk) is a ubiquitous, visually unmistakable retail fixture on contemporary Ukrainian city streets.',
  },
  // Position 105: id-v2-1354 (герб на фаса́ді — coat of arms plaque)
  'id-v2-1354': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'classroom', 'office'],
    rationaleEn:
      'Keep (common_situational): герб на фаса́ді (normalized to герб, coat of arms) is an important, culturally salient Ukrainian civic and architectural noun seen on public buildings, schools, and official documents.',
  },
  // Position 106: id-v2-1931 (сапа́ (моти́ка) — garden hoe)
  'id-v2-1931': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park'],
    rationaleEn:
      'Keep (common_situational): сапа́ (моти́ка) (normalized to primary conversational headword сапа́, accepting моти́ка, garden hoe) is an everyday Ukrainian garden weeding tool; synonymous Batch 3 REVIEW id-v2-383 (моти́ка) is flagged for final curriculum reconciliation so both entries are never counted as two distinct concepts.',
  },
  // Position 107: id-v2-1976 (кла́віші роя́ля — ivory and ebony piano keys)
  'id-v2-1976': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living_room'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: кла́віші роя́ля (piano keys) is a component sub-part of approved Batch 4 KEEP id-v2-1117 (піані́но / роя́ль, piano).',
  },
  // Position 108: id-v2-1339 (телефо́нна бу́дка — telephone booth)
  'id-v2-1339': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street'],
    rationaleEn:
      'Hold for review: телефо́нна бу́дка (telephone booth) is a visually clear street structure held in REVIEW because payphone booths are rare in contemporary 2020s Ukrainian cities.',
  },
  // Position 109: id-v2-1355 (меморіа́льна до́шка — commemorative plaque)
  'id-v2-1355': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street'],
    rationaleEn:
      'Keep (common_situational): меморіа́льна до́шка (commemorative wall plaque) is a common architectural heritage feature on building facades in Ukrainian cities.',
  },
  // Position 110: id-v2-1932 (коса́ травоко́сна — traditional scythe)
  'id-v2-1932': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1592',
    canonicalConceptId: resolveMasterConceptId('id-v2-1592'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 9 KEEP id-v2-1592 (коса́ ручна́, scythe, noun-concept-1548).',
  },
  // Position 111: id-v2-1977 (педа́ль фортепіа́нна — brass piano sustain pedal)
  'id-v2-1977': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: педа́ль фортепіа́нна (brass piano sustain pedal) is a specialist hardware sub-part of a piano (id-v2-1117).',
  },
  // Position 112: id-v2-1987 (трембі́та карпа́тська — Carpathian wooden trembita horn)
  'id-v2-1987': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'classroom'],
    rationaleEn:
      'Keep (useful_extended): трембі́та карпа́тська (normalized to трембі́та, Carpathian wooden alpine horn) is an iconic, visually unmistakable Ukrainian cultural and musical instrument.',
  },
  // Position 113: id-v2-1401 (поли́ця спа́льна (у вагоні) — train sleeping berth)
  'id-v2-1401': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['train_station'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1847',
    canonicalConceptId: resolveMasterConceptId('id-v2-1847'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 9 KEEP id-v2-1847 (поли́ця купе́йна, sleeping berth bunk, noun-concept-1021).',
  },
  // Position 114: id-v2-1988 (сопі́лка яворо́ва — maple folk flute)
  'id-v2-1988': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['compositional_phrase', 'overly_specialized'],
    rationaleEn:
      'Exclude: сопі́лка яворо́ва (maple folk flute) is a wood-species-modified variant of Batch 2 REVIEW id-v2-1126 (сопі́лка, sopilka wooden flute).',
  },
  // Position 115: id-v2-1388 (трап надувни́й — emergency evacuation slide)
  'id-v2-1388': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport'],
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: трап надувни́й (inflatable aircraft emergency evacuation slide) is a rare emergency-only aviation device outside normal everyday passenger scenes.',
  },
  // Position 116: id-v2-1933 (серп жнива́рський — crescent harvesting sickle)
  'id-v2-1933': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['compositional_phrase', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: серп жнива́рський (crescent harvesting sickle) is a modifier-padded variant of Batch 8 EXCLUDE id-v2-1593 (серп, sickle) with low contemporary everyday utility.',
  },
  // Position 117: id-v2-1989 (дрымба / варга́н — jaw harp (drymba))
  'id-v2-1989': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'countryside'],
    rationaleEn:
      'Hold for review: дрымба / варга́н (normalized to дри́мба, Carpathian jaw harp) is a traditional Hutsul folk instrument held in REVIEW because its small metal frame requires close-up framing.',
  },
  // Position 118: id-v2-1389 (кисне́ва ма́ска — oxygen mask)
  'id-v2-1389': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital', 'airport'],
    rationaleEn:
      'Hold for review: кисне́ва ма́ска (oxygen mask) is a recognizable medical and aviation safety item held in REVIEW as a situational clinical/emergency noun.',
  },
  // Position 119: id-v2-1960 (блок жи́влення ноутбу́ка — laptop power brick adapter)
  'id-v2-1960': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'living_room'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: блок жи́влення ноутбу́ка (laptop power brick adapter) is a device-specific cord brick redundant alongside approved Batch 6 KEEP id-v2-1100 (заря́дний при́стрій, charger adapter).',
  },
  // Position 120: id-v2-1990 (окари́на керамі́чна — ceramic ocarina whistle flute)
  'id-v2-1990': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: окари́на керамі́чна (ceramic ocarina whistle flute) is a niche clay folk flute with low everyday vocabulary utility.',
  },
  // Position 121: id-v2-1390 (штурва́л літака́ — aircraft control yoke)
  'id-v2-1390': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: штурва́л літака́ (aircraft cockpit control yoke) is specialist pilot-cockpit hardware not encountered in everyday passenger travel scenes.',
  },
  // Position 122: id-v2-1961 (док-ста́нція USB-C — multi-port USB hub dock)
  'id-v2-1961': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: док-ста́нція USB-C (multi-port USB-C hub dongle) is a technical computer peripheral visually ambiguous against a power bank or external drive.',
  },
  // Position 123: id-v2-1991 (кастаньє́ти дерев’я́ні — wooden castanets)
  'id-v2-1991': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: кастаньє́ти дерев’я́ні (wooden castanets) is a niche non-Ukrainian percussion instrument with low everyday relevance.',
  },
  // Position 124: id-v2-1876 (лійка скляна́ лабораторна — glass filter funnel)
  'id-v2-1876': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: лійка скляна́ лабораторна (glass laboratory filter funnel) is specialist chemistry-lab glassware outside everyday core vocabulary.',
  },
  // Position 125: id-v2-1877 (ступка́ порцеля́нова — porcelain lab mortar)
  'id-v2-1877': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: ступка́ порцеля́нова (porcelain lab mortar) is specialist laboratory equipment matching Batch 9 EXCLUDE id-v2-1472 (ступка фарфо́рова) and Batch 4 EXCLUDE id-v2-184 (ступка́).',
  },
  // Position 126: id-v2-1878 (ске́льце предметне — microscope glass slide)
  'id-v2-1878': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: ске́льце предметне (microscope glass slide) is an inverted-word-order variant of Batch 6 EXCLUDE id-v2-785 (предме́тне ске́льце) with poor visual distinctiveness.',
  },
  // Position 127: id-v2-1875 (мензу́рка мі́рна — graduated cylinder)
  'id-v2-1875': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: мензу́рка мі́рна (graduated cylinder) is a modifier-padded variant of Batch 5 EXCLUDE id-v2-781 (ме́нзурка, graduated cylinder / beaker).',
  },
  // Position 128: id-v2-1884 (плахта тка́на — woven Ukrainian wrap skirt (plakhta))
  'id-v2-1884': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing_store'],
    rationaleEn:
      'Hold for review: плахта тка́на (normalized to пла́хта, woven Ukrainian wrap skirt) is a traditional Ukrainian national costume garment held in REVIEW for cultural dress scenes.',
  },
  // Position 129: id-v2-1894 (підо́шва череви́ка — boot tread sole)
  'id-v2-1894': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway', 'clothing_store'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: підо́шва череви́ка (boot tread sole) is a footwear sub-part matching Batch 8 EXCLUDE id-v2-1525 (підо́шва взуття́, shoe sole).',
  },
  // Position 130: id-v2-1906 (бейджик іменни́й — name badge lanyard)
  'id-v2-1906': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-775',
    canonicalConceptId: resolveMasterConceptId('id-v2-775'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-775 (бейдж, ID badge, noun-concept-1129).',
  },
  // Position 131: id-v2-1887 (запонки сорочко́ві — shirt cufflinks)
  'id-v2-1887': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'clothing_store'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: запонки сорочко́ві (shirt cufflinks) is a modifier-padded variant of Batch 6 EXCLUDE id-v2-1512 (за́понки, cufflinks) and is too small for multi-object scene hotspots.',
  },
  // Position 132: id-v2-1897 (табле́тниця кишенько́ва — pocket pillbox)
  'id-v2-1897': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['pharmacy', 'bedroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1635',
    canonicalConceptId: resolveMasterConceptId('id-v2-1635'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1635 (контейнер для табле́ток, pill organizer box, noun-concept-1792).',
  },
  // Position 133: id-v2-1888 (затиска́ч для крава́тки — tie clip bar)
  'id-v2-1888': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'clothing_store'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: затиска́ч для крава́тки (tie clip bar) matches Batch 6 EXCLUDE id-v2-1513 (шпи́лька для крава́тки, tie clip) as a tiny formal accessory.',
  },
  // Position 134: id-v2-1899 (пензлик для макія́жу — makeup blush brush)
  'id-v2-1899': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): пензлик для макія́жу (makeup blush brush; full phrase retained to distinguish from artist paintbrush) is a common everyday personal-care item.',
  },
  // Position 135: id-v2-1880 (вітро́вка спортивна — lightweight windbreaker jacket)
  'id-v2-1880': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing_store', 'hallway', 'park'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1506',
    canonicalConceptId: resolveMasterConceptId('id-v2-1506'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-1506 (вітрі́вка, windbreaker jacket, noun-concept-1394).',
  },
  // Position 136: id-v2-1890 (пря́жка ременя́ — belt buckle)
  'id-v2-1890': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing_store', 'bedroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: пря́жка ременя́ (belt buckle) is a hardware sub-part of approved Batch 5 KEEP id-v2-854 (ремі́нь / па́сок, leather belt).',
  },
  // Position 137: id-v2-1900 (ті́ні для пові́к — eyeshadow palette)
  'id-v2-1900': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): ті́ні для пові́к (eyeshadow compact palette; full natural phrase retained) is a common everyday cosmetics item with clear visual recognizability.',
  },
  // Position 138: id-v2-1881 (парка зимо́ва — hooded winter parka)
  'id-v2-1881': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing_store', 'hallway'],
    rationaleEn:
      'Hold for review: парка зимо́ва (normalized to па́рка, hooded winter parka) is a common winter coat subtype held in REVIEW alongside Batch 2 KEEP id-v2-826 (ку́ртка, jacket / parka) and Batch 4 KEEP id-v2-827 (пухови́к, down puffer jacket).',
  },
  // Position 139: id-v2-1882 (кожу́х ове́чий — sheepskin coat (kozhukh))
  'id-v2-1882': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing_store', 'countryside'],
    rationaleEn:
      'Hold for review: кожу́х ове́чий (normalized to кожу́х, traditional sheepskin coat) is a culturally recognizable Ukrainian winter garment held in REVIEW alongside Batch 6 REVIEW id-v2-1507 (дубля́нка).',
  },
  // Position 140: id-v2-1892 (устілка для взуття́ — shoe insole)
  'id-v2-1892': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway', 'clothing_store', 'pharmacy'],
    rationaleEn:
      'Keep (common_situational): устілка для взуття́ (normalized to у́стілка, removable shoe insole) is a practical everyday footwear and orthopedic care noun distinct from the outer boot sole.',
  },
  // Position 141: id-v2-1903 (бігуді́ для воло́сся — hair curler rollers)
  'id-v2-1903': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): бігуді́ для воло́сся (normalized to бігуді́, hair curler rollers) is a visually unmistakable personal-care item in bathroom and dressing-table scenes.',
  },
  // Position 142: id-v2-1583 (опудало городнє — scarecrow)
  'id-v2-1583': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): опудало городнє (normalized to опу́дало, garden scarecrow) is a culturally familiar, visually unmistakable figure in Ukrainian kitchen-garden and countryside scenes.',
  },
  // Position 143: id-v2-1911 (очере́т озе́рний — cattail reed / bulrush)
  'id-v2-1911': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'countryside'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Exclude: очере́т озе́рний (lake cattail reed) is a modifier-padded variant of Batch 4 REVIEW id-v2-900 (очере́т, reeds / cattails).',
  },
  // Position 144: id-v2-1584 (компо́стний я́щик — compost bin)
  'id-v2-1584': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: компо́стний я́щик (slatted garden compost bin) is a recognizable yard/garden container held in REVIEW as an extended gardening noun.',
  },
  // Position 145: id-v2-1912 (лата́ття бі́ле (водяна́ лі́лія) — water lily pad)
  'id-v2-1912': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'countryside'],
    issueFlags: ['compositional_phrase', 'overly_specialized'],
    rationaleEn:
      'Exclude: лата́ття бі́ле (водяна́ лі́лія) pairs a botanical species headword with an English leaf-pad gloss ("water lily pad", overlapping Batch 8 REVIEW id-v2-1565 лата́ття бі́ле), whereas the flowering plant is already covered by Batch 4 KEEP id-v2-912 (лі́лія водяна́ / лата́ття, water lily).',
  },
  // Position 146: id-v2-1921 (стільники́ медо́ві — beeswax honeycomb frame)
  'id-v2-1921': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'countryside', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): стільники́ медо́ві (normalized to стільники́, beeswax honeycomb) is a visually unmistakable, culturally important Ukrainian beekeeping and farmers-market food concept distinct from a wooden beehive box (ву́лик).',
  },
  // Position 147: id-v2-1926 (жо́лоб кормови́й (я́сла) — barn feed manger)
  'id-v2-1926': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: жо́лоб кормови́й (я́сла) (livestock barn feed manger) is specialized agricultural livestock equipment outside everyday contemporary learner needs.',
  },
  // Position 148: id-v2-1537 (бір сосно́вий — pine forest)
  'id-v2-1537': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'countryside'],
    rationaleEn:
      'Keep (common_situational): бір сосно́вий (normalized to сосно́вий бір, pine forest) is a signature Ukrainian natural landscape concept distinct from an individual pine tree (сосна́).',
  },
  // Position 149: id-v2-1585 (ді́жка дощова́ — rain barrel)
  'id-v2-1585': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'market'],
    rationaleEn:
      'Keep (common_situational): ді́жка дощова́ (normalized to natural adjective-first дощова́ ді́жка, accepting ді́жка and бо́чка, rain barrel) is a recognizable yard and countryside rainwater barrel not yet represented by any prior KEEP entry.',
  },
  // Position 150: id-v2-1913 (річні́ кі́льця на пні — tree trunk growth rings)
  'id-v2-1913': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park', 'countryside'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: річні́ кі́льця на пні (tree trunk growth rings) is an overly granular botanical detail of a tree stump (пеньо́к) and trunk (стовбу́р).',
  },
};

// ----------------------------------------------------------------------------
// 5. Compact Stage 3 Partial Report Helper
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_10_STAGE_3_INITIAL_DECISION_SHA256_FULL =
  '0364840a913577cf98fadfb0260c82be1a1c3581fac388c5e433249c8f162fdd' as const;

export const IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL =
  'aef5c08120194d3dc1ecf474224864f68a66bc26fa84b258cb488218e57c47d6' as const;

export const IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX =
  'aef5c08120194d3d' as const;

export interface IdentifyBatch10Stage3PartialSummary {
  reportVersion: '10.3.0-batch10-stage3-partial';
  stageLabel: typeof IDENTIFY_BATCH_10_STAGE_3_LABEL;
  batchNumber: 10;
  stageNumber: 3;
  manifestPositionsCovered: readonly [101, 150];
  manifestSha256Full: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL;
  manifestSha256Prefix: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX;
  verifiedStage1DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL;
  verifiedStage1DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX;
  verifiedStage2DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL;
  verifiedStage2DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX;
  stage3DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL;
  stage3DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX;
  candidatesReviewedInStage3Count: 50;
  stage3RecommendedKeepCount: 13;
  stage3RecommendedReviewCount: 8;
  stage3RecommendedExcludeCount: 29;
  stage3PriorityBreakdownOfKept: {
    essential_everyday: 0;
    common_situational: 12;
    useful_extended: 1;
  };
  semanticRelationshipsInStage3Count: number;
  canonicalDuplicateRelationshipsInStage3Count: 5;
  nonDuplicateSemanticComparisonsInStage3Count: 28;
  headwordNormalizationsInStage3Count: 14;
  essentialEverydayJustificationsInStage3Count: 0;
  registeredInCumulativeApprovedStore: false;
}

export function getBatch10Stage3PartialReport(): IdentifyBatch10Stage3PartialSummary {
  return {
    reportVersion: '10.3.0-batch10-stage3-partial',
    stageLabel: IDENTIFY_BATCH_10_STAGE_3_LABEL,
    batchNumber: 10,
    stageNumber: 3,
    manifestPositionsCovered: [101, 150],
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
    stage3DecisionSha256Full: IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_FULL,
    stage3DecisionSha256Prefix: IDENTIFY_BATCH_10_STAGE_3_DECISION_SHA256_PREFIX,
    candidatesReviewedInStage3Count: 50,
    stage3RecommendedKeepCount: 13,
    stage3RecommendedReviewCount: 8,
    stage3RecommendedExcludeCount: 29,
    stage3PriorityBreakdownOfKept: {
      essential_everyday: 0,
      common_situational: 12,
      useful_extended: 1,
    },
    semanticRelationshipsInStage3Count:
      IDENTIFY_BATCH_10_STAGE_3_SEMANTIC_RELATIONSHIP_RECORDS.length,
    canonicalDuplicateRelationshipsInStage3Count: 5,
    nonDuplicateSemanticComparisonsInStage3Count: 28,
    headwordNormalizationsInStage3Count:
      IDENTIFY_BATCH_10_STAGE_3_HEADWORD_NORMALIZATION_RECORDS.length as 14,
    essentialEverydayJustificationsInStage3Count:
      IDENTIFY_BATCH_10_STAGE_3_ESSENTIAL_EVERYDAY_REASONS.length as 0,
    registeredInCumulativeApprovedStore: false,
  };
}
