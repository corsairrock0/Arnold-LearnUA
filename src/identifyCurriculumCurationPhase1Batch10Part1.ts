// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 10 — PARTIAL STAGE 1 / 4
// (MANIFEST POSITIONS 1..50 OF 200 REMAINING LEGACY NOUNS)
// ============================================================================
// IMPORTANT STAGE BOUNDARY:
// - This file is clearly labeled BATCH 10 — PARTIAL STAGE 1 / 4.
// - It reviews ONLY manifest positions 1..50 from
//   `IDENTIFY_BATCH_10_FROZEN_MANIFEST` (`src/identifyCurriculumCurationPhase1Batch10Manifest.ts`).
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

export const IDENTIFY_BATCH_10_STAGE_1_LABEL =
  'BATCH 10 — PARTIAL STAGE 1 / 4' as const;

export type ExplicitBatch10Stage1Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch10SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

export const IDENTIFY_BATCH_10_STAGE_1_MANIFEST_SLICE: readonly IdentifyBatch10ManifestEntry[] =
  IDENTIFY_BATCH_10_FROZEN_MANIFEST.slice(0, 50);

// ----------------------------------------------------------------------------
// 1. Batch 10 Stage 1 Semantic Duplicate & Relationship Records (Positions 1..50)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage1SemanticRelationshipRecord {
  batchNumber: 10;
  stageNumber: 1;
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

interface RawBatch10Stage1SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch10Stage1SemanticRelationshipSeed[] =
  [
    // === A. 12 CANONICAL DUPLICATE EXCLUSIONS (countsAsDuplicateConcept: true) ===
    {
      candidateVocabularyId: 'id-v2-1752',
      comparedVocabularyId: 'id-v2-258',
      comparedBatchNumber: 3,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'підвіко́ння мармуро́ве (marble windowsill) is a material-modified duplicate of approved Batch 3 KEEP id-v2-258 (підвіко́ння, windowsill, noun-concept-0195).',
    },
    {
      candidateVocabularyId: 'id-v2-1754',
      comparedVocabularyId: 'id-v2-275',
      comparedBatchNumber: 3,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'обігріва́ч масляни́й (oil-filled radiator heater) is a modifier-padded duplicate of approved Batch 3 KEEP id-v2-275 (обігріва́ч, space heater, noun-concept-0115).',
    },
    {
      candidateVocabularyId: 'id-v2-1776',
      comparedVocabularyId: 'id-v2-243',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'таз пласти́ковий (plastic washbasin) is a material-modified duplicate of approved Batch 3 KEEP id-v2-243 (таз, washbasin, noun-concept-0295).',
    },
    {
      candidateVocabularyId: 'id-v2-1777',
      comparedVocabularyId: 'id-v2-244',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'ганчі́рка з мікрофі́бри (microfiber cleaning cloth) is a material-modified duplicate of approved Batch 4 KEEP id-v2-244 (ганчі́рка, cleaning cloth, noun-concept-0315).',
    },
    {
      candidateVocabularyId: 'id-v2-1778',
      comparedVocabularyId: 'id-v2-388',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'пульвериза́тор для води́ (trigger spray bottle, noun-concept-0372) and approved Batch 3 KEEP id-v2-388 (лі́йка-розпи́лювач, spray bottle, noun-concept-0250) both denote a handheld household misting/trigger spray bottle (whereas garden/indoor watering cans are represented separately by Batch 7 KEEP id-v2-267 лійка садо́ва).',
    },
    {
      candidateVocabularyId: 'id-v2-1164',
      comparedVocabularyId: 'lb-shelf',
      comparedBatchNumber: 1,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'підвісна́ поли́ця (floating wall shelf) is a modifier-padded duplicate of approved Batch 1 KEEP lb-shelf (поли́ця, bookshelf / shelf, noun-concept-1209).',
    },
    {
      candidateVocabularyId: 'id-v2-1780',
      comparedVocabularyId: 'id-v2-267',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'лі́йка садо́ва кімна́тна (indoor watering can) is a modifier-padded duplicate of approved Batch 7 KEEP id-v2-267 (лійка садо́ва, watering can, noun-concept-0343).',
    },
    {
      candidateVocabularyId: 'id-v2-1795',
      comparedVocabularyId: 'id-v2-1251',
      comparedBatchNumber: 10,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'мак харчови́й (culinary poppy seeds) is a duplicate of approved Batch 10 Stage 1 KEEP id-v2-1251 (ма́кове насі́ння, poppy seeds, noun-concept-0544).',
    },
    {
      candidateVocabularyId: 'id-v2-1796',
      comparedVocabularyId: 'id-v2-438',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'фі́нік суше́ний (dried date fruit) is a modifier-padded duplicate of approved Batch 4 KEEP id-v2-438 (фі́нік, date (fruit), noun-concept-0698).',
    },
    {
      candidateVocabularyId: 'id-v2-1798',
      comparedVocabularyId: 'id-v2-430',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'каву́н ски́бка (watermelon slice) is a portion-modified duplicate of approved Batch 2 KEEP id-v2-430 (каву́н, watermelon, noun-concept-0553).',
    },
    {
      candidateVocabularyId: 'id-v2-1800',
      comparedVocabularyId: 'id-v2-1230',
      comparedBatchNumber: 10,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'селера́ ко́рінь (inverted catalog headword for celeriac) is an inverted-word-order duplicate of approved Batch 10 Stage 1 KEEP id-v2-1230 (корі́нь селе́ри, celeriac / celery root, noun-concept-0483).',
    },
    {
      candidateVocabularyId: 'id-v2-1253',
      comparedVocabularyId: 'id-v2-1794',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'насі́ння гарбуза́ (pumpkin seeds / pepitas) is a genitive-phrased duplicate of approved Batch 8 KEEP id-v2-1794 (насі́ння гарбузо́ве, pumpkin seeds (pepitas), noun-concept-0427).',
    },

    // === B. 17 NON-DUPLICATE SEMANTIC COMPARISONS (countsAsDuplicateConcept: false) ===
    {
      candidateVocabularyId: 'id-v2-1182',
      comparedVocabularyId: 'id-v2-208',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'гу́бка метале́ва (steel wool scrubber / metal scouring pad, noun-concept-0337) is a distinct physical cleaning tool made of coiled metal wire for scouring pots, not a lexical duplicate of soft foam dish sponge id-v2-208 (гу́бка для по́суду, dish sponge, noun-concept-0014); held in REVIEW as a related kitchen cleaning object.',
    },
    {
      candidateVocabularyId: 'id-v2-1290',
      comparedVocabularyId: 'id-v2-1289',
      comparedBatchNumber: 10,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'я́чна крупа́ (crushed unpolished barley groats, noun-concept-0603) and перло́ва крупа́ (whole polished pearl barley, id-v2-1289, noun-concept-0585) are distinct commercial barley grain products rather than synonymous headwords; id-v2-1290 is held in REVIEW alongside KEEP id-v2-1289 because fine crushed groats require packaging context in visual scenes.',
    },
    {
      candidateVocabularyId: 'id-v2-1203',
      comparedVocabularyId: 'id-v2-758',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'точи́лка для ножі́в (kitchen knife sharpener) is a distinct kitchen tool compared to approved Batch 4 KEEP id-v2-758 (струга́чка, pencil sharpener, noun-concept-1243).',
    },
    {
      candidateVocabularyId: 'id-v2-1205',
      comparedVocabularyId: 'id-v2-1204',
      comparedBatchNumber: 9,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'магні́тна пла́нка (magnetic wall knife strip) is held for review alongside approved Batch 9 KEEP id-v2-1204 (підста́вка для ножі́в, countertop knife block, noun-concept-0338).',
    },
    {
      candidateVocabularyId: 'id-v2-1162',
      comparedVocabularyId: 'bd-window',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'віконна ра́ма (window frame / casement) is kept as a distinct structural window component alongside approved Batch 1 KEEP bd-window (вікно́, window, noun-concept-0189).',
    },
    {
      candidateVocabularyId: 'id-v2-1208',
      comparedVocabularyId: 'dr-napkin',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'сервірува́льна серве́тка (woven or cork table placemat under plates) is kept as a distinct dining-table item alongside approved Batch 1 KEEP dr-napkin (серве́тка, napkin, noun-concept-0107).',
    },
    {
      candidateVocabularyId: 'id-v2-1758',
      comparedVocabularyId: 'sm-basket',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ко́шик плете́ний (wicker storage basket, noun-concept-0407) depicts a woven household/traditional wicker basket visually distinct from supermarket handheld shopping basket sm-basket (ко́шик, shopping basket, noun-concept-0532, Batch 1 KEEP); KEEP decision retained while flagging bare-headword ко́шик overlap for Phase 2 shortlist reconciliation.',
    },
    {
      candidateVocabularyId: 'id-v2-1299',
      comparedVocabularyId: 'id-v2-1298',
      comparedBatchNumber: 8,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пі́та (round pocket pita bread) is kept as a distinct bakery bread item contrasted with thin sheet flatbread id-v2-1298 (лава́ш, Batch 8 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1282',
      comparedVocabularyId: 'id-v2-487',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'топлене ма́сло (clarified butter in a glass jar) is held for review as a traditional cooking fat distinct from solid butter block id-v2-487 (вершко́ве ма́сло, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1300',
      comparedVocabularyId: 'id-v2-500',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'су́шка / бара́нки (crunchy mini tea bread rings) is kept as a distinct everyday Ukrainian tea-time snack contrasted with soft bakery bagel/bublyk id-v2-500 (бу́блик, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1230',
      comparedVocabularyId: 'id-v2-454',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'корі́нь селе́ри (bulbous celeriac root) is a visually distinct root vegetable widely used in Ukrainian soups and salads, contrasted with green celery stalks id-v2-454 (селе́ра, Batch 5 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1799',
      comparedVocabularyId: 'id-v2-1228',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'рі́па жо́вта (yellow turnip root) is a color-modified variant of Batch 7 EXCLUDE id-v2-1228 (рі́па, turnip, noun-concept-0441); excluded without counting as a duplicate of an approved KEEP entry.',
    },
    {
      candidateVocabularyId: 'id-v2-1233',
      comparedVocabularyId: 'id-v2-453',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'редька чо́рна (normalized to ре́дька, large winter black radish) is a distinct Ukrainian root vegetable contrasted with small pink spring salad radish id-v2-453 (реди́ска, Batch 5 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1251',
      comparedVocabularyId: 'id-v2-908',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ма́кове насі́ння (culinary poppy seeds in a bowl) is a distinct kitchen and baking ingredient contrasted with red field poppy blossom id-v2-908 (мак, poppy flower, Batch 2 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1288',
      comparedVocabularyId: 'id-v2-501',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'панірува́льні сухарі́ (fine breadcrumbs for breading cutlets) is a distinct everyday cooking staple compared to whole tea rusk id-v2-501 (суха́р, Batch 6 REVIEW).',
    },
    {
      candidateVocabularyId: 'id-v2-1801',
      comparedVocabularyId: 'id-v2-455',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'спа́ржа зеле́на (green asparagus spears) is a color-modified variant of Batch 5 REVIEW id-v2-455 (спа́ржа, asparagus, noun-concept-0699); excluded so only the base headword in REVIEW remains canonical.',
    },
    {
      candidateVocabularyId: 'id-v2-1325',
      comparedVocabularyId: 'fm-tomato',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'марино́ваний помідо́р (preserved pickled tomato) is held for review alongside fresh tomato fm-tomato (помідо́р, Batch 1 KEEP).',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch10Stage1SemanticRelationshipRecord[] =
  RAW_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 10,
      stageNumber: 1,
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
// 2. Batch 10 Stage 1 Learner Headword Normalizations (Non-Destructive Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage1HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 10;
  stageNumber: 1;
  normalizationReasonEn: string;
}

interface RawBatch10Stage1HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch10Stage1HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1163',
      preferredLearnerHeadwordUk: 'ши́бка',
      acceptedConversationalSynonymsUk: [
        'ши́бка віко́нна',
        'віко́нна ши́бка',
        'віко́нне скло',
      ],
      normalizationReasonEn:
        'Strips redundant relational adjective віко́нна so learners practice natural single-word noun ши́бка (windowpane).',
    },
    {
      vocabularyId: 'id-v2-1300',
      preferredLearnerHeadwordUk: 'су́шка',
      acceptedConversationalSynonymsUk: [
        'су́шки',
        'бара́нки',
        'су́шка / бара́нки',
      ],
      normalizationReasonEn:
        'Resolves slash-compound су́шка / бара́нки to primary Ukrainian headword су́шка while accepting бара́нки as a conversational synonym.',
    },
    {
      vocabularyId: 'id-v2-1301',
      preferredLearnerHeadwordUk: 'плеті́нка',
      acceptedConversationalSynonymsUk: [
        'плеті́нка з ма́ком',
        'ма́кова плеті́нка',
      ],
      normalizationReasonEn:
        'Normalizes плеті́нка з ма́ком to concise bakery headword плеті́нка while accepting the full poppy-seed phrase.',
    },
    {
      vocabularyId: 'id-v2-1284',
      preferredLearnerHeadwordUk: 'дрі́жджі',
      acceptedConversationalSynonymsUk: [
        'дрі́жджі пресо́вані',
        'пека́рські дрі́жджі',
      ],
      normalizationReasonEn:
        'Strips technical packaging adjective пресо́вані so learners acquire core everyday pluralia tantum noun дрі́жджі (yeast).',
    },
    {
      vocabularyId: 'id-v2-1285',
      preferredLearnerHeadwordUk: 'розпу́шувач',
      acceptedConversationalSynonymsUk: [
        'розпу́шувач ті́ста',
        'розпу́шувач для ті́ста',
      ],
      normalizationReasonEn:
        'Normalizes розпу́шувач ті́ста to concise everyday baking noun розпу́шувач (baking powder).',
    },
    {
      vocabularyId: 'id-v2-1321',
      preferredLearnerHeadwordUk: 'зра́зи',
      acceptedConversationalSynonymsUk: [
        'зра́зи картопля́ні',
        'картопля́ні зра́зи',
      ],
      normalizationReasonEn:
        'Normalizes inverted catalog phrase зра́зи картопля́ні to natural culinary headword зра́зи (potato zrazy).',
    },
    {
      vocabularyId: 'id-v2-1286',
      preferredLearnerHeadwordUk: 'крохма́ль',
      acceptedConversationalSynonymsUk: [
        'крохма́ль картопля́ний',
        'картопля́ний крохма́ль',
      ],
      normalizationReasonEn:
        'Strips botanical modifier картопля́ний so learners practice core pantry noun крохма́ль (starch).',
    },
    {
      vocabularyId: 'id-v2-1304',
      preferredLearnerHeadwordUk: 'стру́дель',
      acceptedConversationalSynonymsUk: [
        'стру́дель я́блучний',
        'я́блучний стру́дель',
        'штру́дель',
      ],
      normalizationReasonEn:
        'Normalizes стру́дель я́блучний to concise café pastry noun стру́дель and accepts conversational variant штру́дель.',
    },
    {
      vocabularyId: 'id-v2-1233',
      preferredLearnerHeadwordUk: 'ре́дька',
      acceptedConversationalSynonymsUk: ['редька чо́рна', 'чо́рна ре́дька'],
      normalizationReasonEn:
        'Normalizes inverted catalog phrase редька чо́рна to natural base noun ре́дька (winter radish).',
    },
    {
      vocabularyId: 'id-v2-1306',
      preferredLearnerHeadwordUk: 'безе́',
      acceptedConversationalSynonymsUk: ['мере́нга', 'безе́ / мере́нга'],
      normalizationReasonEn:
        'Resolves slash-compound безе́ / мере́нга to primary conversational Ukrainian noun безе́ while accepting мере́нга.',
    },
    {
      vocabularyId: 'id-v2-1307',
      preferredLearnerHeadwordUk: 'халва́',
      acceptedConversationalSynonymsUk: [
        'халва́ со́няшникова',
        'со́няшникова халва́',
      ],
      normalizationReasonEn:
        'Normalizes халва́ со́няшникова to concise single-word sweet noun халва́ (halva).',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch10Stage1HeadwordNormalizationRecord[] =
  RAW_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
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
      stageNumber: 1,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Stage 1 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage1EssentialEverydayReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  stageNumber: 1;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [
  {
    vocabularyId: 'id-v2-1284',
    independentPedagogicalJustificationEn:
      'дрі́жджі пресо́вані (normalized to дрі́жджі, baker’s yeast) is a core, high-frequency everyday baking and grocery noun in Ukrainian home cooking.',
  },
  {
    vocabularyId: 'id-v2-1251',
    independentPedagogicalJustificationEn:
      'ма́кове насі́ння (poppy seeds) is a culturally central, high-frequency Ukrainian culinary staple used across everyday pastries, kutia, makivnyk, and varenyky.',
  },
];

export const IDENTIFY_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS: readonly IdentifyBatch10Stage1EssentialEverydayReason[] =
  RAW_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
    const master = resolveMasterNounById(item.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      stageNumber: 1,
      independentPedagogicalJustificationEn:
        item.independentPedagogicalJustificationEn,
    };
  });

// ----------------------------------------------------------------------------
// 4. Explicit Batch 10 Stage 1 Assessments (Manifest Positions 1..50 Only)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_10_STAGE_1_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch10Stage1Assessment>
> = {
  // Position 1: id-v2-1752 (підвіко́ння мармуро́ве — marble windowsill)
  'id-v2-1752': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-258',
    canonicalConceptId: resolveMasterConceptId('id-v2-258'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-258 (підвіко́ння, windowsill).',
  },
  // Position 2: id-v2-1774 (пемза космети́чна — pumice stone)
  'id-v2-1774': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: пемза космети́чна (cosmetic pumice stone) is a small porous stone visually ambiguous against soap or sponge in a bathroom scene.',
  },
  // Position 3: id-v2-1159 (підсві́тка кухо́нна — under-cabinet light)
  'id-v2-1159': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: підсві́тка кухо́нна (under-cabinet LED strip lighting) is an ambient lighting effect rather than a primary discrete noun object.',
  },
  // Position 4: id-v2-1203 (точи́лка для ножі́в — knife sharpener)
  'id-v2-1203': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (common_situational): точи́лка для ножі́в (knife sharpener) is a recognizable everyday kitchen tool distinct from a desk pencil sharpener (струга́чка).',
  },
  // Position 5: id-v2-1182 (гу́бка метале́ва — steel wool scrubber)
  'id-v2-1182': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: гу́бка метале́ва (steel wool scrubber / metal scouring pad) is a physically and visually distinct coiled-metal pot scrubber (not a lexical duplicate of soft foam dish sponge id-v2-208 гу́бка для по́суду); held in REVIEW as a secondary kitchen cleaning tool.',
  },
  // Position 6: id-v2-1754 (обігріва́ч масляни́й — oil-filled radiator heater)
  'id-v2-1754': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-275',
    canonicalConceptId: resolveMasterConceptId('id-v2-275'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-275 (обігріва́ч, space heater).',
  },
  // Position 7: id-v2-1776 (таз пласти́ковий — plastic washbasin)
  'id-v2-1776': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-243',
    canonicalConceptId: resolveMasterConceptId('id-v2-243'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-243 (таз, washbasin).',
  },
  // Position 8: id-v2-1205 (магні́тна пла́нка — magnetic knife strip)
  'id-v2-1205': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Hold for review: магні́тна пла́нка (magnetic wall knife strip) is a recognizable modern kitchen fixture but secondary to підста́вка для ножі́в (knife block).',
  },
  // Position 9: id-v2-1777 (ганчі́рка з мікрофі́бри — microfiber cleaning cloth)
  'id-v2-1777': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'bathroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-244',
    canonicalConceptId: resolveMasterConceptId('id-v2-244'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-244 (ганчі́рка, cleaning cloth).',
  },
  // Position 10: id-v2-1162 (віконна ра́ма — window frame)
  'id-v2-1162': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): віконна ра́ма (window frame / casement) is a clear, high-frequency structural component in home scenes.',
  },
  // Position 11: id-v2-1206 (ба́нка для спе́цій — spice jar)
  'id-v2-1206': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (common_situational): ба́нка для спе́цій (labeled glass spice jar) is a ubiquitous, visually clear kitchen countertop and shelf object.',
  },
  // Position 12: id-v2-1778 (пульвериза́тор для води́ — trigger spray bottle)
  'id-v2-1778': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'living_room'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-388',
    canonicalConceptId: resolveMasterConceptId('id-v2-388'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-388 (лі́йка-розпи́лювач, spray bottle, noun-concept-0250), which already represents the handheld misting/trigger spray bottle concept.',
  },
  // Position 13: id-v2-1163 (ши́бка віко́нна — windowpane)
  'id-v2-1163': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): ши́бка віко́нна (normalized to ши́бка, windowpane) is a natural everyday Ukrainian household noun.',
  },
  // Position 14: id-v2-1207 (поли́чка для спе́цій — spice rack)
  'id-v2-1207': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (common_situational): поли́чка для спе́цій (spice rack) is a visually distinct and common kitchen wall or countertop organizer.',
  },
  // Position 15: id-v2-1757 (ла́нцюжок дверни́й — door security chain)
  'id-v2-1757': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['apartment_hallway'],
    rationaleEn:
      'Hold for review: ла́нцюжок дверни́й (door security chain) is a recognizable apartment-entryway hardware detail.',
  },
  // Position 16: id-v2-1164 (підвісна́ поли́ця — floating wall shelf)
  'id-v2-1164': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'lb-shelf',
    canonicalConceptId: resolveMasterConceptId('lb-shelf'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 1 KEEP lb-shelf (поли́ця, bookshelf / shelf).',
  },
  // Position 17: id-v2-1208 (сервірува́льна серве́тка — placemat)
  'id-v2-1208': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'kitchen', 'cafe'],
    rationaleEn:
      'Keep (common_situational): сервірува́льна серве́тка (woven table placemat) is a clear, high-frequency dining table object distinct from a paper/cloth napkin.',
  },
  // Position 18: id-v2-1758 (ко́шик плете́ний — wicker storage basket)
  'id-v2-1758': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'kitchen'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Keep (common_situational): ко́шик плете́ний (wicker storage basket) depicts a woven household/traditional Ukrainian basket visually distinct from supermarket shopping basket sm-basket (ко́шик); flagged with modifier_padded_duplicate so Phase 2 shortlist reconciliation tracks bare-headword ко́шик overlap.',
  },
  // Position 19: id-v2-1780 (лі́йка садо́ва кімна́тна — indoor watering can)
  'id-v2-1780': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'balcony'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-267',
    canonicalConceptId: resolveMasterConceptId('id-v2-267'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 7 KEEP id-v2-267 (лійка садо́ва, watering can).',
  },
  // Position 20: id-v2-1299 (пі́та — pita bread pocket)
  'id-v2-1299': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['bakery', 'kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): пі́та (round pita bread pocket) is a recognizable bakery and street-food bread distinct from thin sheet lavash.',
  },
  // Position 21: id-v2-1317 (капусня́к — sauerkraut soup)
  'id-v2-1317': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'kitchen', 'restaurant'],
    rationaleEn:
      'Keep (common_situational): капусня́к (traditional Ukrainian sauerkraut soup) is an iconic, culturally authentic Ukrainian dish.',
  },
  // Position 22: id-v2-1246 (муска́тний горі́х — nutmeg)
  'id-v2-1246': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'market'],
    rationaleEn:
      'Hold for review: муска́тний горі́х (whole/grated nutmeg) is a recognizable culinary spice best suited for close-up spice displays.',
  },
  // Position 23: id-v2-1282 (топлене ма́сло — clarified butter / ghee)
  'id-v2-1282': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Hold for review: топлене ма́сло (clarified butter in a glass jar) is a traditional Ukrainian cooking fat that requires clear jar framing to distinguish from honey or oil.',
  },
  // Position 24: id-v2-1300 (су́шка / бара́нки — mini bread rings (sushky))
  'id-v2-1300': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'bakery', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): су́шка / бара́нки (normalized to су́шка, crunchy mini bread rings) is a ubiquitous Ukrainian tea-table snack.',
  },
  // Position 25: id-v2-1318 (кулі́ш — Cossack millet stew)
  'id-v2-1318': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'countryside'],
    rationaleEn:
      'Keep (useful_extended): кулі́ш (traditional Ukrainian Cossack millet porridge/stew) is a culturally resonant Ukrainian dish.',
  },
  // Position 26: id-v2-1795 (мак харчови́й — culinary poppy seeds)
  'id-v2-1795': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1251',
    canonicalConceptId: resolveMasterConceptId('id-v2-1251'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 10 Stage 1 KEEP id-v2-1251 (ма́кове насі́ння, poppy seeds).',
  },
  // Position 27: id-v2-1301 (плеті́нка з ма́ком — braided poppy-seed loaf)
  'id-v2-1301': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['bakery', 'kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): плеті́нка з ма́ком (normalized to плеті́нка, braided poppy-seed loaf) is a classic, visually unmistakable Ukrainian bakery item.',
  },
  // Position 28: id-v2-1796 (фі́нік суше́ний — dried date fruit)
  'id-v2-1796': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'market'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-438',
    canonicalConceptId: resolveMasterConceptId('id-v2-438'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-438 (фі́нік, date fruit).',
  },
  // Position 29: id-v2-1230 (корі́нь селе́ри — celeriac / celery root)
  'id-v2-1230': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): корі́нь селе́ри (celeriac / celery root) is a staple Ukrainian market and supermarket root vegetable visually distinct from green celery stalks.',
  },
  // Position 30: id-v2-1284 (дрі́жджі пресо́вані — baker’s yeast block)
  'id-v2-1284': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): дрі́жджі пресо́вані (normalized to дрі́жджі, baker’s yeast) is a foundational everyday Ukrainian baking noun.',
  },
  // Position 31: id-v2-1285 (розпу́шувач ті́ста — baking powder packet)
  'id-v2-1285': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): розпу́шувач ті́ста (normalized to розпу́шувач, baking powder packet) is a common everyday home-baking ingredient.',
  },
  // Position 32: id-v2-1321 (зра́зи картопля́ні — stuffed potato cakes (zrazy))
  'id-v2-1321': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'kitchen', 'restaurant'],
    rationaleEn:
      'Keep (common_situational): зра́зи картопля́ні (normalized to зра́зи, stuffed potato cakes) is a beloved everyday Ukrainian dish.',
  },
  // Position 33: id-v2-1798 (каву́н ски́бка — watermelon slice)
  'id-v2-1798': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'market'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-430',
    canonicalConceptId: resolveMasterConceptId('id-v2-430'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 2 KEEP id-v2-430 (каву́н, watermelon).',
  },
  // Position 34: id-v2-1286 (крохма́ль картопля́ний — potato starch)
  'id-v2-1286': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): крохма́ль картопля́ний (normalized to крохма́ль, potato starch) is a standard everyday Ukrainian kitchen and pantry staple.',
  },
  // Position 35: id-v2-1304 (стру́дель я́блучний — apple strudel)
  'id-v2-1304': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'bakery', 'dining_room'],
    rationaleEn:
      'Keep (common_situational): стру́дель я́блучний (normalized to стру́дель, apple strudel) is a signature Lviv and Ukrainian café pastry.',
  },
  // Position 36: id-v2-1799 (рі́па жо́вта — turnip root)
  'id-v2-1799': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market'],
    issueFlags: ['modifier_padded_duplicate', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: рі́па жо́вта (yellow turnip) is a color-modified variant of Batch 7 EXCLUDE id-v2-1228 (рі́па).',
  },
  // Position 37: id-v2-1233 (редька чо́рна — black radish)
  'id-v2-1233': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): редька чо́рна (normalized to ре́дька, black winter radish) is a traditional Ukrainian market vegetable distinct from small pink spring radish (реди́ска).',
  },
  // Position 38: id-v2-1251 (ма́кове насі́ння — poppy seeds)
  'id-v2-1251': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'bakery'],
    rationaleEn:
      'Keep (essential_everyday): ма́кове насі́ння (poppy seeds) is a culturally indispensable everyday Ukrainian culinary and baking ingredient.',
  },
  // Position 39: id-v2-1800 (селера́ ко́рінь — celeriac / celery stalk)
  'id-v2-1800': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1230',
    canonicalConceptId: resolveMasterConceptId('id-v2-1230'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 10 Stage 1 KEEP id-v2-1230 (корі́нь селе́ри, celeriac / celery root).',
  },
  // Position 40: id-v2-1252 (насі́ння льо́ну — flaxseeds)
  'id-v2-1252': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): насі́ння льо́ну (flaxseeds) is a common Ukrainian supermarket and healthy-breakfast seed topping.',
  },
  // Position 41: id-v2-1288 (панірува́льні сухарі́ — breadcrumbs)
  'id-v2-1288': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): панірува́льні сухарі́ (breadcrumbs) is an everyday Ukrainian kitchen staple used for breading cutlets and fish.',
  },
  // Position 42: id-v2-1306 (безе́ / мере́нга — meringue kiss)
  'id-v2-1306': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'bakery'],
    rationaleEn:
      'Keep (common_situational): безе́ / мере́нга (normalized to безе́, meringue kiss) is a visually distinctive and common Ukrainian bakery/café confection.',
  },
  // Position 43: id-v2-1801 (спа́ржа зеле́на — asparagus spears)
  'id-v2-1801': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'market'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: спа́ржа зеле́на (green asparagus spears) is a color-modified variant of Batch 5 REVIEW id-v2-455 (спа́ржа).',
  },
  // Position 44: id-v2-1253 (насі́ння гарбуза́ — pumpkin seeds / pepitas)
  'id-v2-1253': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1794',
    canonicalConceptId: resolveMasterConceptId('id-v2-1794'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1794 (насі́ння гарбузо́ве, pumpkin seeds).',
  },
  // Position 45: id-v2-1289 (перло́ва крупа́ — pearl barley)
  'id-v2-1289': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): перло́ва крупа́ (pearl barley) is a staple Ukrainian pantry grain used in soups and side dishes.',
  },
  // Position 46: id-v2-1307 (халва́ со́няшникова — sunflower halva)
  'id-v2-1307': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen', 'market'],
    rationaleEn:
      'Keep (common_situational): халва́ со́няшникова (normalized to халва́, sunflower halva) is an iconic, ubiquitous Ukrainian sweet sold in every grocery store and market.',
  },
  // Position 47: id-v2-1325 (марино́ваний помідо́р — pickled tomato)
  'id-v2-1325': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining_room'],
    rationaleEn:
      'Hold for review: марино́ваний помідо́р (pickled tomato) is a traditional Ukrainian preserved food held in REVIEW alongside fresh помідо́р.',
  },
  // Position 48: id-v2-1802 (артишо́к — artichoke bud)
  'id-v2-1802': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: артишо́к (artichoke bud) is an imported specialty vegetable with low everyday relevance in Ukrainian households.',
  },
  // Position 49: id-v2-1254 (кедро́вий горі́х — pine nuts)
  'id-v2-1254': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Hold for review: кедро́вий горі́х (pine nuts) is a recognizable culinary nut/seed ingredient.',
  },
  // Position 50: id-v2-1290 (я́чна крупа́ — cracked barley grits)
  'id-v2-1290': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: я́чна крупа́ (cracked unpolished barley groats) is a distinct Ukrainian grocery grain product from whole polished pearl barley (id-v2-1289 перло́ва крупа́), held in REVIEW because fine crushed groats require labeled packaging context in visual scenes.',
  },
};

// ----------------------------------------------------------------------------
// 5. Compact Stage 1 Partial Report Helper
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_10_STAGE_1_INITIAL_DECISION_SHA256_FULL =
  '7d20628c3bf615edf1b5ba27d52d91a3a5ba32c9f63b049ab09dd54e360bf808' as const;

export const IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL =
  '9741262454a601d5c37f1662f4d75c0be7fe03f6083dcb3c68a7c91f0a35ba7f' as const;

export const IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX =
  '9741262454a601d5' as const;

export interface IdentifyBatch10Stage1PartialSummary {
  reportVersion: '10.1.1-batch10-stage1-semantic-repair';
  stageLabel: typeof IDENTIFY_BATCH_10_STAGE_1_LABEL;
  batchNumber: 10;
  stageNumber: 1;
  manifestPositionsCovered: readonly [1, 50];
  manifestSha256Full: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL;
  manifestSha256Prefix: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX;
  initialStage1DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_1_INITIAL_DECISION_SHA256_FULL;
  stage1DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL;
  stage1DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX;
  candidatesReviewedInStage1Count: 50;
  stage1RecommendedKeepCount: 25;
  stage1RecommendedReviewCount: 8;
  stage1RecommendedExcludeCount: 17;
  stage1PriorityBreakdownOfKept: {
    essential_everyday: 2;
    common_situational: 22;
    useful_extended: 1;
  };
  semanticRelationshipsInStage1Count: number;
  canonicalDuplicateRelationshipsInStage1Count: 12;
  nonDuplicateSemanticComparisonsInStage1Count: 17;
  headwordNormalizationsInStage1Count: 11;
  essentialEverydayJustificationsInStage1Count: 2;
  registeredInCumulativeApprovedStore: false;
}

export function getBatch10Stage1PartialReport(): IdentifyBatch10Stage1PartialSummary {
  return {
    reportVersion: '10.1.1-batch10-stage1-semantic-repair',
    stageLabel: IDENTIFY_BATCH_10_STAGE_1_LABEL,
    batchNumber: 10,
    stageNumber: 1,
    manifestPositionsCovered: [1, 50],
    manifestSha256Full: IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
    manifestSha256Prefix: IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
    initialStage1DecisionSha256Full:
      IDENTIFY_BATCH_10_STAGE_1_INITIAL_DECISION_SHA256_FULL,
    stage1DecisionSha256Full: IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
    stage1DecisionSha256Prefix: IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
    candidatesReviewedInStage1Count: 50,
    stage1RecommendedKeepCount: 25,
    stage1RecommendedReviewCount: 8,
    stage1RecommendedExcludeCount: 17,
    stage1PriorityBreakdownOfKept: {
      essential_everyday: 2,
      common_situational: 22,
      useful_extended: 1,
    },
    semanticRelationshipsInStage1Count:
      IDENTIFY_BATCH_10_STAGE_1_SEMANTIC_RELATIONSHIP_RECORDS.length,
    canonicalDuplicateRelationshipsInStage1Count: 12,
    nonDuplicateSemanticComparisonsInStage1Count: 17,
    headwordNormalizationsInStage1Count:
      IDENTIFY_BATCH_10_STAGE_1_HEADWORD_NORMALIZATION_RECORDS.length as 11,
    essentialEverydayJustificationsInStage1Count:
      IDENTIFY_BATCH_10_STAGE_1_ESSENTIAL_EVERYDAY_REASONS.length as 2,
    registeredInCumulativeApprovedStore: false,
  };
}
