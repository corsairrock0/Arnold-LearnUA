// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 9 (CANDIDATES 1601..1800):
// SELECTIVE EVERYDAY VOCABULARY CURATION, CANONICAL DUPLICATE EXCLUSIONS,
// SPECIALIST / LABORATORY FILTERING & LEARNER HEADWORD NORMALIZATION
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only planning and curation infrastructure.
// - It does NOT alter the active learner-facing Identify tab, the 10 verified
//   photographic scenes, the 49 approved active learner targets, or the
//   preserved 2,000-noun / 120-scene legacy planning archive.
// - Preserves all 1,600 previously saved Batch 1–8 curation decisions,
//   all 34 genuine missing everyday concepts, and all 12 prior-batch priority
//   reconciliation flags untouched.
// ============================================================================

import type { IdentifyMasterNounEntry } from './identifyMasterNouns.ts';
import type { ExplicitBatch4Assessment } from './identifyCurriculumCurationPhase1Batch4.ts';
import {
  resolveMasterNounById,
  resolveMasterConceptId,
  type IdentifyBatch7SemanticRelationshipType,
} from './identifyCurriculumCurationPhase1Batch7.ts';

export type ExplicitBatch9Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch9SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

// ----------------------------------------------------------------------------
// 1. Batch 9 Semantic Duplicate & Relationship Records
// ----------------------------------------------------------------------------

export interface IdentifyBatch9SemanticRelationshipRecord {
  batchNumber: 9;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  relationshipType: IdentifyBatch9SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

interface RawBatch9SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  relationshipType: IdentifyBatch9SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_9_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch9SemanticRelationshipSeed[] =
  [
    {
      candidateVocabularyId: 'id-v2-1860',
      comparedVocabularyId: 'id-v2-751',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'пена́л шкільни́й (zippered pencil case) is an adjective-padded duplicate of approved Batch 4 KEEP id-v2-751 (пена́л, pencil case, noun-concept-1154).',
    },
    {
      candidateVocabularyId: 'id-v2-1839',
      comparedVocabularyId: 'at-suitcase',
      comparedBatchNumber: 1,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'валі́за на коліща́тах (rolling carry-on suitcase) is a modifier-padded duplicate of approved Batch 1 KEEP at-suitcase (валі́за, suitcase, noun-concept-1053).',
    },
    {
      candidateVocabularyId: 'id-v2-1909',
      comparedVocabularyId: 'id-v2-1562',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'мальва садо́ва (hollyhock flower) is an adjective-padded duplicate of approved Batch 8 KEEP id-v2-1562 (мальва / ро́жа, hollyhock, noun-concept-1668).',
    },
    {
      candidateVocabularyId: 'id-v2-1861',
      comparedVocabularyId: 'id-v2-786',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'лу́па чита́цька (magnifying glass) is an adjective-padded duplicate of approved Batch 4 KEEP id-v2-786 (лі́нза / лу́па, magnifying glass, noun-concept-1137).',
    },
    {
      candidateVocabularyId: 'id-v2-1868',
      comparedVocabularyId: 'id-v2-776',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'штамп самонабірни́й (self-inking office stamp) is a modifier-padded duplicate of approved Batch 4 KEEP id-v2-776 (печа́тка / штамп, rubber stamp, noun-concept-1232).',
    },
    {
      candidateVocabularyId: 'id-v2-1844',
      comparedVocabularyId: 'id-v2-684',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'ілюміна́тор літака́ (airplane oval window) is a modifier-padded duplicate of approved Batch 7 KEEP id-v2-684 (ілюміна́тор, airplane window, noun-concept-1098).',
    },
    {
      candidateVocabularyId: 'id-v2-1916',
      comparedVocabularyId: 'id-v2-390',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'шпакі́вня дерев’я́на (wooden birdhouse) is a material-adjective-padded duplicate of approved Batch 3 KEEP id-v2-390 (шпакі́вня, birdhouse, noun-concept-0284).',
    },
    {
      candidateVocabularyId: 'id-v2-1845',
      comparedVocabularyId: 'id-v2-688',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'відкидни́й сто́лик у літаку́ (seatback tray table) is a location-padded duplicate of approved Batch 5 KEEP id-v2-688 (відкидни́й сто́лик, tray table, noun-concept-1000).',
    },
    {
      candidateVocabularyId: 'id-v2-1919',
      comparedVocabularyId: 'id-v2-1626',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'мура́шник лісови́й (forest anthill mound) is an adjective-padded duplicate of approved Batch 8 KEEP id-v2-1626 (мура́шник, anthill, noun-concept-1509).',
    },
    {
      candidateVocabularyId: 'id-v2-1978',
      comparedVocabularyId: 'id-v2-1138',
      comparedBatchNumber: 6,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'палі́тра акваре́льна з лу́нками (ceramic mixing palette) is a modifier-padded duplicate of approved Batch 6 KEEP id-v2-1138 (палі́тра худо́жня, artist palette, noun-concept-1987).',
    },
    {
      candidateVocabularyId: 'id-v2-1924',
      comparedVocabularyId: 'id-v2-1587',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'підко́ва стале́ва (iron horseshoe) is a material-adjective-padded duplicate of approved Batch 8 KEEP id-v2-1587 (підко́ва, horseshoe, noun-concept-1445).',
    },
    {
      candidateVocabularyId: 'id-v2-1337',
      comparedVocabularyId: 'id-v2-1820',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'газе́тний кіо́ск (newsstand kiosk) is a synonymous duplicate of approved Batch 8 KEEP id-v2-1820 (кіо́ск з пре́сою, newsstand kiosk, noun-concept-0756).',
    },
    {
      candidateVocabularyId: 'id-v2-1830',
      comparedVocabularyId: 'id-v2-630',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'пандус для візкі́в (wheelchair access ramp) is a prepositional-phrase-padded duplicate of approved Batch 6 KEEP id-v2-630 (пандус, wheelchair ramp, noun-concept-0886).',
    },
    {
      candidateVocabularyId: 'id-v2-1902',
      comparedVocabularyId: 'id-v2-312',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'щи́пчики для брів (пінце́т) (eyebrow tweezers) is a phrasal duplicate of approved Batch 5 KEEP id-v2-312 (пінце́т, tweezers, noun-concept-0396).',
    },
    {
      candidateVocabularyId: 'id-v2-1928',
      comparedVocabularyId: 'id-v2-1581',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'тепли́ця скляна́ (оранжере́я) (garden greenhouse) is a modifier-padded duplicate of approved Batch 8 KEEP id-v2-1581 (тепли́ця / парни́к, greenhouse, noun-concept-1568).',
    },
    {
      candidateVocabularyId: 'id-v2-1930',
      comparedVocabularyId: 'id-v2-384',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'сека́тор садо́вий (hand pruning shears) is an adjective-padded duplicate of approved Batch 3 KEEP id-v2-384 (сека́тор, pruning shears, noun-concept-0179).',
    },
    {
      candidateVocabularyId: 'id-v2-1859',
      comparedVocabularyId: 'id-v2-758',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'струга́чка насті́льна (rotary desk pencil sharpener) is a modifier-padded duplicate of approved Batch 4 KEEP id-v2-758 (струга́чка, pencil sharpener, noun-concept-1243).',
    },
    {
      candidateVocabularyId: 'id-v2-1853',
      comparedVocabularyId: 'id-v2-956',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'весло́ дерев’я́не (wooden rowboat oar) is a material-adjective-padded duplicate of approved Batch 5 KEEP id-v2-956 (весло́, oar / paddle, noun-concept-1458).',
    },
    {
      candidateVocabularyId: 'id-v2-1907',
      comparedVocabularyId: 'id-v2-1554',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'пролісок весня́ний (snowdrop flower) is an adjective-padded duplicate of approved Batch 6 KEEP id-v2-1554 (пролі́сок, scilla / bluebell, noun-concept-1503).',
    },
    {
      candidateVocabularyId: 'id-v2-1908',
      comparedVocabularyId: 'id-v2-1563',
      comparedBatchNumber: 2,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'барві́нок хреща́тий (periwinkle vine) is a botanical-epithet-padded duplicate of approved Batch 2 KEEP id-v2-1563 (барві́нок, periwinkle, noun-concept-1443).',
    },
    {
      candidateVocabularyId: 'id-v2-1917',
      comparedVocabularyId: 'id-v2-391',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'годі́вниця для птахі́в (hanging bird feeder) is a prepositional-phrase-padded duplicate of approved Batch 3 KEEP id-v2-391 (годівни́ця, bird feeder, noun-concept-0302).',
    },
    {
      candidateVocabularyId: 'id-v2-1910',
      comparedVocabularyId: 'id-v2-909',
      comparedBatchNumber: 2,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'воло́шка польова́ (blue cornflower) is a botanical-epithet variant of Batch 2 REVIEW id-v2-909 (воло́шка, cornflower); excluded on modifier-redundancy grounds without promoting id-v2-909.',
    },
    {
      candidateVocabularyId: 'id-v2-1895',
      comparedVocabularyId: 'id-v2-875',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'віяло склада́не (folding hand fan) is a modifier-padded variant of Batch 5 REVIEW id-v2-875 (ві́яло, hand fan); excluded without promoting id-v2-875.',
    },
    {
      candidateVocabularyId: 'id-v2-1472',
      comparedVocabularyId: 'id-v2-184',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ступка фарфо́рова (porcelain mortar) is a laboratory variant of Batch 4 EXCLUDE id-v2-184 (ступка́, mortar); excluded on specialist laboratory grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1474',
      comparedVocabularyId: 'id-v2-1134',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'камерто́н фізи́чний (acoustic resonance fork) is a physics-lab variant of Batch 5 EXCLUDE id-v2-1134 (камерто́н, tuning fork); excluded on specialist grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1848',
      comparedVocabularyId: 'id-v2-1402',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'підскля́нник метале́вий (train tea glass holder) is a modifier-padded variant of Batch 8 REVIEW id-v2-1402 (підстака́нник, metal tea glass holder); excluded so only the base candidate remains in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1850',
      comparedVocabularyId: 'id-v2-1415',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кнехт порто́вий (mooring bollard) is a maritime technical variant of Batch 8 EXCLUDE id-v2-1415 (кнехт прича́льний, mooring bollard); excluded on specialist maritime grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1852',
      comparedVocabularyId: 'id-v2-1414',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'трап корабе́льний (ship gangway) is a maritime variant of Batch 8 EXCLUDE id-v2-1414 (трап суднови́й, gangplank); excluded on specialist maritime grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1925',
      comparedVocabularyId: 'id-v2-1589',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'вузде́чка кі́нська (horse bridle and reins) is a modifier-padded variant of Batch 8 REVIEW id-v2-1589 (вузде́чка, bridle); excluded without promoting id-v2-1589.',
    },
    {
      candidateVocabularyId: 'id-v2-1904',
      comparedVocabularyId: 'id-v2-307',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пло́йка / випрямля́ч для воло́сся (curling iron / hair straightener) overlaps with Batch 5 REVIEW id-v2-307 (пло́йка, curling iron); excluded so the base headword in REVIEW remains canonical.',
    },
    {
      candidateVocabularyId: 'id-v2-1980',
      comparedVocabularyId: 'id-v2-1092',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'наву́шники-вкла́диші бездрото́ві (wireless earbuds in charging case) is kept as a distinct modern everyday object contrasted with over-ear headphones (Batch 4 KEEP id-v2-1092).',
    },
  ];

export const IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch9SemanticRelationshipRecord[] =
  RAW_BATCH_9_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 9,
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
// 2. Batch 9 Learner Headword Normalizations (Non-Destructive Metadata Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch9HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 9;
  normalizationReasonEn: string;
}

interface RawBatch9HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_9_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch9HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1297',
      preferredLearnerHeadwordUk: 'баге́т',
      acceptedConversationalSynonymsUk: ['баге́т францу́зький', 'францу́зький баге́т'],
      normalizationReasonEn:
        'Strips redundant origin adjective францу́зький so learners practice natural everyday баге́т (baguette).',
    },
    {
      vocabularyId: 'id-v2-1320',
      preferredLearnerHeadwordUk: 'галу́шки',
      acceptedConversationalSynonymsUk: ['галу́шки полта́вські', 'полта́вські галу́шки'],
      normalizationReasonEn:
        'Normalizes галу́шки полта́вські to iconic everyday culinary noun галу́шки (Ukrainian dumplings).',
    },
    {
      vocabularyId: 'id-v2-1674',
      preferredLearnerHeadwordUk: 'ке́гля',
      acceptedConversationalSynonymsUk: ['ке́гля боулінго́ва', 'боулінго́ва ке́гля'],
      normalizationReasonEn:
        'Normalizes ке́гля боулінго́ва to concise single-word noun ке́гля (bowling pin).',
    },
    {
      vocabularyId: 'id-v2-1915',
      preferredLearnerHeadwordUk: 'дупло́',
      acceptedConversationalSynonymsUk: ['дупло́ в де́реві'],
      normalizationReasonEn:
        'Strips explanatory locative phrase в де́реві so learners practice natural single-word дупло́ (tree hollow).',
    },
    {
      vocabularyId: 'id-v2-1923',
      preferredLearnerHeadwordUk: 'кори́то',
      acceptedConversationalSynonymsUk: ['корито для худо́би'],
      normalizationReasonEn:
        'Normalizes корито для худо́би to concise base noun кори́то (trough).',
    },
    {
      vocabularyId: 'id-v2-1352',
      preferredLearnerHeadwordUk: 'пра́пор',
      acceptedConversationalSynonymsUk: ['пра́пор держа́вний', 'держа́вний пра́пор'],
      normalizationReasonEn:
        'Normalizes пра́пор держа́вний to foundational single-word noun пра́пор (flag).',
    },
    {
      vocabularyId: 'id-v2-1947',
      preferredLearnerHeadwordUk: 'мили́ця',
      acceptedConversationalSynonymsUk: ['мили́ця підпахвова́', 'мили́ці'],
      normalizationReasonEn:
        'Strips medical subtype adjective підпахвова́ so learners practice everyday мили́ця (crutch).',
    },
    {
      vocabularyId: 'id-v2-1959',
      preferredLearnerHeadwordUk: 'пісо́чниця',
      acceptedConversationalSynonymsUk: ['пісо́чниця дерев’я́на з дашко́м'],
      normalizationReasonEn:
        'Strips catalog visual descriptors дерев’я́на з дашко́м so learners practice everyday пісо́чниця (sandbox).',
    },
    {
      vocabularyId: 'id-v2-1598',
      preferredLearnerHeadwordUk: 'наши́йник',
      acceptedConversationalSynonymsUk: ['наши́йник соба́чий', 'соба́чий наши́йник'],
      normalizationReasonEn:
        'Normalizes наши́йник соба́чий to concise single-word pet noun наши́йник (dog collar).',
    },
    {
      vocabularyId: 'id-v2-1886',
      preferredLearnerHeadwordUk: 'нами́сто',
      acceptedConversationalSynonymsUk: ['нами́сто кора́лове', 'кора́лове нами́сто'],
      normalizationReasonEn:
        'Normalizes нами́сто кора́лове to core everyday jewelry/cultural noun нами́сто (necklace).',
    },
    {
      vocabularyId: 'id-v2-1889',
      preferredLearnerHeadwordUk: 'підтя́жки',
      acceptedConversationalSynonymsUk: ['підтя́жки для штані́в'],
      normalizationReasonEn:
        'Strips redundant prepositional phrase для штані́в so learners practice natural підтя́жки (suspenders).',
    },
    {
      vocabularyId: 'id-v2-1891',
      preferredLearnerHeadwordUk: 'шнурі́вка',
      acceptedConversationalSynonymsUk: ['шнурі́вка взуттє́ва', 'шнуро́к'],
      normalizationReasonEn:
        'Strips catalog adjective взуттє́ва so learners practice natural шнурі́вка / шнуро́к (shoelace).',
    },
    {
      vocabularyId: 'id-v2-1920',
      preferredLearnerHeadwordUk: 'ву́лик',
      acceptedConversationalSynonymsUk: ['ву́лик бджоли́ний', 'бджоли́ний ву́лик'],
      normalizationReasonEn:
        'Normalizes ву́лик бджоли́ний to concise single-word noun ву́лик (beehive).',
    },
    {
      vocabularyId: 'id-v2-1922',
      preferredLearnerHeadwordUk: 'стіг сі́на',
      acceptedConversationalSynonymsUk: ['сі́но в копи́ці (стіг)', 'копи́ця сі́на', 'сі́но'],
      normalizationReasonEn:
        'Normalizes parenthetical catalog entry сі́но в копи́ці (стіг) to natural Ukrainian стіг сі́на / копи́ця сі́на (haystack).',
    },
    {
      vocabularyId: 'id-v2-1603',
      preferredLearnerHeadwordUk: 'ди́кий каба́н',
      acceptedConversationalSynonymsUk: ['каба́н ди́кий', 'каба́н', 'вепр'],
      normalizationReasonEn:
        'Reorders inverted каба́н ди́кий to natural Ukrainian ди́кий каба́н / каба́н (wild boar).',
    },
    {
      vocabularyId: 'id-v2-1885',
      preferredLearnerHeadwordUk: 'віно́к',
      acceptedConversationalSynonymsUk: [
        'украї́нський віно́к',
        'очі́пок / віно́к український',
      ],
      normalizationReasonEn:
        'Focuses learner prompt on the visually distinct Ukrainian flower crown віно́к while preserving master entry metadata.',
    },
    {
      vocabularyId: 'id-v2-1893',
      preferredLearnerHeadwordUk: 'підбо́ри',
      acceptedConversationalSynonymsUk: ['каблу́к', 'підбо́ри (каблу́к)'],
      normalizationReasonEn:
        'Strips parenthetical gloss from підбо́ри (каблу́к) and accepts каблу́к as a conversational synonym.',
    },
  ];

export const IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch9HeadwordNormalizationRecord[] =
  RAW_BATCH_9_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
    const master = resolveMasterNounById(seed.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      originalMasterHeadwordUk: master.uk,
      preferredLearnerHeadwordUk: seed.preferredLearnerHeadwordUk,
      acceptedConversationalSynonymsUk: seed.acceptedConversationalSynonymsUk,
      englishGlossEn: master.en,
      gender: master.gender,
      reviewedInBatchNumber: 9,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Batch 9 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch9EssentialEverydayPedagogicalReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_9_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [
  {
    vocabularyId: 'id-v2-1280',
    independentPedagogicalJustificationEn:
      'згуще́не молоко́ (condensed milk) is an iconic, high-frequency everyday grocery and dessert staple in Ukrainian households.',
  },
  {
    vocabularyId: 'id-v2-1297',
    independentPedagogicalJustificationEn:
      'баге́т францу́зький (normalized to баге́т, baguette) is a daily bakery and supermarket bread noun.',
  },
  {
    vocabularyId: 'id-v2-1320',
    independentPedagogicalJustificationEn:
      'галу́шки полта́вські (normalized to галу́шки, Ukrainian dumplings) is a culturally central traditional Ukrainian dish.',
  },
  {
    vocabularyId: 'id-v2-1322',
    independentPedagogicalJustificationEn:
      'котле́та по-ки́ївськи (Chicken Kyiv) is one of the most famous Ukrainian restaurant and culinary nouns.',
  },
  {
    vocabularyId: 'id-v2-1323',
    independentPedagogicalJustificationEn:
      'ква́шена капу́ста (sauerkraut) is an everyday home-cooking, market, and dining table staple in Ukraine.',
  },
  {
    vocabularyId: 'id-v2-1324',
    independentPedagogicalJustificationEn:
      'соло́ний огіро́к (dill pickle) is an indispensable everyday Ukrainian food item.',
  },
  {
    vocabularyId: 'id-v2-1161',
    independentPedagogicalJustificationEn:
      'ко́шик для папе́рів (wastepaper basket) is a core office, classroom, and home-study object.',
  },
  {
    vocabularyId: 'id-v2-1204',
    independentPedagogicalJustificationEn:
      'підста́вка для ножі́в (knife block) is a visually distinct countertop fixture in almost every kitchen scene.',
  },
  {
    vocabularyId: 'id-v2-1333',
    independentPedagogicalJustificationEn:
      'табли́чка з на́звою ву́лиці (street name sign) is an essential urban navigation and city-street object.',
  },
  {
    vocabularyId: 'id-v2-1348',
    independentPedagogicalJustificationEn:
      'сміттє́вий бак (dumpster / exterior trash bin) is a ubiquitous urban courtyard and street utility noun.',
  },
  {
    vocabularyId: 'id-v2-1350',
    independentPedagogicalJustificationEn:
      'ка́мера відеоспостере́ження (security camera) is a high-frequency modern public-space and building-entrance noun.',
  },
  {
    vocabularyId: 'id-v2-1352',
    independentPedagogicalJustificationEn:
      'пра́пор держа́вний (normalized to пра́пор, flag) is a foundational civic and public-building noun in Ukrainian.',
  },
  {
    vocabularyId: 'id-v2-1596',
    independentPedagogicalJustificationEn:
      'соба́ча бу́дка (doghouse) is a classic, unmistakable yard and countryside scene noun.',
  },
  {
    vocabularyId: 'id-v2-1597',
    independentPedagogicalJustificationEn:
      'ми́ска для корму́ (pet food bowl) is an everyday household pet-care item.',
  },
  {
    vocabularyId: 'id-v2-1598',
    independentPedagogicalJustificationEn:
      'наши́йник соба́чий (normalized to наши́йник, dog collar) is a core daily pet-care noun.',
  },
  {
    vocabularyId: 'id-v2-1831',
    independentPedagogicalJustificationEn:
      'кно́пка ви́клику лі́фта (elevator call button) is a daily apartment-building and office-hallway object.',
  },
  {
    vocabularyId: 'id-v2-1886',
    independentPedagogicalJustificationEn:
      'нами́сто кора́лове (normalized to нами́сто, necklace) is both a core personal-accessory noun and an iconic Ukrainian cultural symbol.',
  },
  {
    vocabularyId: 'id-v2-1891',
    independentPedagogicalJustificationEn:
      'шнурі́вка взуттє́ва (normalized to шнурі́вка / шнуро́к, shoelace) is an essential everyday footwear noun.',
  },
  {
    vocabularyId: 'id-v2-1901',
    independentPedagogicalJustificationEn:
      'туш для вій (mascara) is one of the most common everyday personal-care and cosmetics nouns.',
  },
  {
    vocabularyId: 'id-v2-1920',
    independentPedagogicalJustificationEn:
      'ву́лик бджоли́ний (normalized to ву́лик, beehive) is a culturally and visually iconic Ukrainian countryside noun.',
  },
  {
    vocabularyId: 'id-v2-1947',
    independentPedagogicalJustificationEn:
      'мили́ця підпахвова́ (normalized to мили́ця, crutch) is a core medical and hospital-scene noun.',
  },
  {
    vocabularyId: 'id-v2-1959',
    independentPedagogicalJustificationEn:
      'пісо́чниця дерев’я́на з дашко́м (normalized to пісо́чниця, sandbox) is a foundational playground and courtyard noun.',
  },
];

export const IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS: readonly IdentifyBatch9EssentialEverydayPedagogicalReason[] =
  RAW_BATCH_9_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
    const master = resolveMasterNounById(item.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      independentPedagogicalJustificationEn:
        item.independentPedagogicalJustificationEn,
    };
  });

// ----------------------------------------------------------------------------
// 4. Explicit Batch 9 Assessments for All 200 Candidates
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_9_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch9Assessment>
> = {
  'id-v2-1280': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): згуще́не молоко́ (condensed milk tin) is an iconic, high-frequency everyday grocery staple in Ukraine.',
  },
  'id-v2-1674': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (common_situational): ке́гля боулінго́ва (normalized to ке́гля, bowling pin) is a visually unmistakable recreation object.',
  },
  'id-v2-1860': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-751',
    canonicalConceptId: resolveMasterConceptId('id-v2-751'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-751 (пена́л, pencil case).',
  },
  'id-v2-1839': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'at-suitcase',
    canonicalConceptId: resolveMasterConceptId('at-suitcase'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 1 KEEP at-suitcase (валі́за, suitcase).',
  },
  'id-v2-1909': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1562',
    canonicalConceptId: resolveMasterConceptId('id-v2-1562'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1562 (мальва / ро́жа, hollyhock).',
  },
  'id-v2-1152': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): клубо́к во́вни (ball of yarn) is a visually distinct household and craft noun.',
  },
  'id-v2-1297': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['bakery', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): баге́т францу́зький (normalized to баге́т, baguette) is a high-frequency bakery staple.',
  },
  'id-v2-1675': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (common_situational): ку́ля для бо́улінгу (bowling ball) is an immediately recognizable three-hole recreation sphere.',
  },
  'id-v2-1861': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-786',
    canonicalConceptId: resolveMasterConceptId('id-v2-786'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-786 (лі́нза / лу́па, magnifying glass).',
  },
  'id-v2-1840': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport'],
    rationaleEn:
      'Keep (common_situational): бі́рка бага́жна (luggage tag) is a practical airport and travel-scene item.',
  },
  'id-v2-1910': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: воло́шка польова́ (blue cornflower) is a modifier-padded variant of Batch 2 REVIEW id-v2-909 (воло́шка); excluded without promoting id-v2-909.',
  },
  'id-v2-1153': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): спи́ці в’яза́льні (knitting needles) are a clear household craft item.',
  },
  'id-v2-1320': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'kitchen'],
    rationaleEn:
      'Keep (essential_everyday): галу́шки полта́вські (normalized to галу́шки, Ukrainian dumplings) is a culturally iconic traditional dish.',
  },
  'id-v2-1680': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): матра́ц надувни́й (inflatable pool/beach float) is a common summer and beach-scene object.',
  },
  'id-v2-1868': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-776',
    canonicalConceptId: resolveMasterConceptId('id-v2-776'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-776 (печа́тка / штамп, rubber stamp).',
  },
  'id-v2-1841': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport'],
    rationaleEn:
      'Keep (common_situational): рамка металошукача́ (walk-through metal detector) is a prominent airport security checkpoint fixture.',
  },
  'id-v2-1915': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'forest'],
    rationaleEn:
      'Keep (common_situational): дупло́ в де́реві (normalized to дупло́, tree hollow) is a classic forest and park-scene noun.',
  },
  'id-v2-1160': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    rationaleEn:
      'Keep (common_situational): суша́рка для рушникі́в (heated towel rail) is a standard fixture in Ukrainian apartment bathrooms.',
  },
  'id-v2-1322': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant'],
    rationaleEn:
      'Keep (essential_everyday): котле́та по-ки́ївськи (Chicken Kyiv) is a world-famous Ukrainian culinary dish.',
  },
  'id-v2-1681': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): ма́ска з тру́бкою (snorkel and diving mask) is a clear beach and swimming object.',
  },
  'id-v2-1869': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    rationaleEn:
      'Hold for review: ште́мпельна поду́шка (stamp ink pad) is secondary to rubber stamp (id-v2-776).',
  },
  'id-v2-1844': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-684',
    canonicalConceptId: resolveMasterConceptId('id-v2-684'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 7 KEEP id-v2-684 (ілюміна́тор, airplane window).',
  },
  'id-v2-1916': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-390',
    canonicalConceptId: resolveMasterConceptId('id-v2-390'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-390 (шпакі́вня, birdhouse).',
  },
  'id-v2-1161': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office', 'classroom'],
    rationaleEn:
      'Keep (essential_everyday): ко́шик для папе́рів (wastepaper basket) is an everyday office, classroom, and study object.',
  },
  'id-v2-1323': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): ква́шена капу́ста (sauerkraut) is a staple Ukrainian everyday food.',
  },
  'id-v2-1688': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park'],
    rationaleEn:
      'Keep (common_situational): триколі́сний велосипе́д (tricycle) is a clear children’s playground and park vehicle.',
  },
  'id-v2-1845': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-688',
    canonicalConceptId: resolveMasterConceptId('id-v2-688'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-688 (відкидни́й сто́лик, tray table).',
  },
  'id-v2-1919': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1626',
    canonicalConceptId: resolveMasterConceptId('id-v2-1626'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1626 (мура́шник, anthill).',
  },
  'id-v2-1202': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (common_situational): ніж для пі́ци (pizza wheel cutter) is a distinct rotary kitchen utensil.',
  },
  'id-v2-1324': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): соло́ний огіро́к (dill pickle) is an everyday Ukrainian table and pantry staple.',
  },
  'id-v2-1691': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): ша́хова фігу́ра (chess piece) is a classic board-game noun with an iconic silhouette.',
  },
  'id-v2-1978': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1138',
    canonicalConceptId: resolveMasterConceptId('id-v2-1138'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-1138 (палі́тра худо́жня, artist palette).',
  },
  'id-v2-1923': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (useful_extended): корито для худо́би (normalized to кори́то, trough) is a traditional countryside and folktale noun.',
  },
  'id-v2-1204': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (essential_everyday): підста́вка для ножі́в (knife block) is a core kitchen-countertop object.',
  },
  'id-v2-1692': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): гра́льний ку́бик (six-sided die) is an unmistakable board-game object.',
  },
  'id-v2-1980': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'living_room'],
    rationaleEn:
      'Keep (useful_extended): наву́шники-вкла́диші бездрото́ві (wireless earbuds in charging case) is a ubiquitous modern personal-tech object distinct from over-ear headphones (id-v2-1092).',
  },
  'id-v2-1924': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1587',
    canonicalConceptId: resolveMasterConceptId('id-v2-1587'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1587 (підко́ва, horseshoe).',
  },
  'id-v2-1333': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (essential_everyday): табли́чка з на́звою ву́лиці (street name sign) is an essential urban street fixture.',
  },
  'id-v2-1947': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Keep (essential_everyday): мили́ця підпахвова́ (normalized to мили́ця, crutch) is a foundational hospital and injury-aid noun.',
  },
  'id-v2-1337': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1820',
    canonicalConceptId: resolveMasterConceptId('id-v2-1820'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1820 (кіо́ск з пре́сою, newsstand kiosk).',
  },
  'id-v2-1949': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital', 'gym'],
    rationaleEn:
      'Hold for review: банда́ж еласти́чний (orthopedic knee brace) is a useful medical/sports support item.',
  },
  'id-v2-1347': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (common_situational): зупи́нковий павільйо́н (transit waiting shelter) is a familiar urban bus/tram stop structure.',
  },
  'id-v2-1959': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park'],
    rationaleEn:
      'Keep (essential_everyday): пісо́чниця дерев’я́на з дашко́м (normalized to пісо́чниця, sandbox) is a core children’s playground fixture.',
  },
  'id-v2-1348': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (essential_everyday): сміттє́вий бак (wheeled dumpster / exterior trash bin) is a ubiquitous urban utility object.',
  },
  'id-v2-1349': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (common_situational): конте́йнер для сортува́ння (recycling bin) is a common modern city-courtyard fixture.',
  },
  'id-v2-1350': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): ка́мера відеоспостере́ження (CCTV security camera) is a high-frequency urban and commercial object.',
  },
  'id-v2-1352': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (essential_everyday): пра́пор держа́вний (normalized to пра́пор, flag) is an indispensable civic and urban scene noun.',
  },
  'id-v2-1363': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'cafe'],
    rationaleEn:
      'Keep (common_situational): холоди́льна вітри́на (refrigerated display case) is a core supermarket, deli, and bakery fixture.',
  },
  'id-v2-1491': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['stadium'],
    rationaleEn:
      'Keep (common_situational): суддя́ спортивний (sports referee) is a key stadium and sports-match role noun.',
  },
  'id-v2-1492': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): рятува́льник пля́жний (lifeguard) is a core beach and swimming-pool role noun.',
  },
  'id-v2-1596': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (essential_everyday): соба́ча бу́дка (doghouse) is an unmistakable yard and countryside scene object.',
  },
  'id-v2-1597': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    rationaleEn:
      'Keep (essential_everyday): ми́ска для корму́ (pet food bowl) is a daily household pet-care item.',
  },
  'id-v2-1598': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park', 'living_room'],
    rationaleEn:
      'Keep (essential_everyday): наши́йник соба́чий (normalized to наши́йник, dog collar) is a core everyday pet item.',
  },
  'id-v2-1753': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'living_room'],
    rationaleEn:
      'Keep (common_situational): москі́тна сі́тка (window insect screen) is a very common apartment-window item in Ukraine.',
  },
  'id-v2-1755': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): очи́щувач пові́тря (air purifier) is a common modern household appliance.',
  },
  'id-v2-1830': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-630',
    canonicalConceptId: resolveMasterConceptId('id-v2-630'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-630 (пандус, wheelchair ramp).',
  },
  'id-v2-1831': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['apartment_hallway', 'office'],
    rationaleEn:
      'Keep (essential_everyday): кно́пка ви́клику лі́фта (elevator call button) is a daily apartment and office building fixture.',
  },
  'id-v2-1886': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['clothing_store', 'bedroom'],
    rationaleEn:
      'Keep (essential_everyday): нами́сто кора́лове (normalized to нами́сто, necklace) is a core jewelry and Ukrainian cultural wardrobe noun.',
  },
  'id-v2-1889': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['clothing_store'],
    rationaleEn:
      'Keep (common_situational): підтя́жки для штані́в (normalized to підтя́жки, suspenders) is a visually clear clothing accessory.',
  },
  'id-v2-1891': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['apartment_hallway', 'clothing_store'],
    rationaleEn:
      'Keep (essential_everyday): шнурі́вка взуттє́ва (normalized to шнурі́вка / шнуро́к, shoelace) is an essential everyday footwear part.',
  },
  'id-v2-1895': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: віяло склада́не (folding hand fan) is a modifier-padded variant of Batch 5 REVIEW id-v2-875 (ві́яло); excluded without promoting id-v2-875.',
  },
  'id-v2-1896': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): серве́тка для окуля́рів (microfiber lens cloth) is an everyday eyeglass-care accessory.',
  },
  'id-v2-1898': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): пудре́ниця з дзеркальцем (compact powder case) is a recognizable cosmetics item.',
  },
  'id-v2-1901': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    rationaleEn:
      'Keep (essential_everyday): туш для вій (mascara) is a top-frequency everyday cosmetics item.',
  },
  'id-v2-1902': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-312',
    canonicalConceptId: resolveMasterConceptId('id-v2-312'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-312 (пінце́т, tweezers).',
  },
  'id-v2-1905': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    rationaleEn:
      'Hold for review: помазо́к для голі́ння (shaving brush) is visually clear but lower daily frequency than razor.',
  },
  'id-v2-1920': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (essential_everyday): ву́лик бджоли́ний (normalized to ву́лик, beehive) is a culturally iconic Ukrainian countryside noun.',
  },
  'id-v2-1922': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): сі́но в копи́ці (стіг) (normalized to стіг сі́на, haystack) is a classic Ukrainian rural landscape noun.',
  },
  'id-v2-1928': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1581',
    canonicalConceptId: resolveMasterConceptId('id-v2-1581'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1581 (тепли́ця / парни́к, greenhouse).',
  },
  'id-v2-1930': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-384',
    canonicalConceptId: resolveMasterConceptId('id-v2-384'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-384 (сека́тор, pruning shears).',
  },
  'id-v2-1262': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): шовкови́ця (mulberry) is a very familiar summer berry tree across Ukraine.',
  },
  'id-v2-1640': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Keep (common_situational): гіпсова пов’я́зка (plaster cast) is a high-recognition hospital and first-aid concept.',
  },
  'id-v2-1719': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: бінокуля́рна лу́па (headband jeweler/watchmaker magnifier) is a specialist optical tool.',
  },
  'id-v2-1472': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ступка фарфо́рова (porcelain laboratory mortar) is specialized chemistry equipment.',
  },
  'id-v2-1993': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Keep (common_situational): гуа́ш у ба́ночках (gouache paint jars) is a standard school art-class supply in Ukraine.',
  },
  'id-v2-1836': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (common_situational): запасне́ колесо́ (spare tire) is a practical everyday driving and roadside noun.',
  },
  'id-v2-1566': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): кора́л морськи́й (sea coral) is a visually unmistakable marine nature noun.',
  },
  'id-v2-1572': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Hold for review: лагу́на (lagoon) is visually close to bay/cove in general coastal scenes.',
  },
  'id-v2-1263': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Hold for review: кизи́л (cornelian cherry) is known in Ukrainian cuisine but visually close to other small red berries.',
  },
  'id-v2-1641': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Keep (common_situational): пов’я́зка підтри́муюча (arm sling) is a visually clear hospital and injury-care item.',
  },
  'id-v2-1720': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: бленда об’єкти́ва (camera lens hood) is a specialist photography accessory.',
  },
  'id-v2-1474': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: камерто́н фізи́чний (acoustic resonance fork) is specialized physics laboratory apparatus.',
  },
  'id-v2-1994': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: туш кресля́рська в пля́шечці (drafting India ink bottle) is a specialized drafting/calligraphy supply.',
  },
  'id-v2-1837': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Keep (common_situational): щі́тка-скребо́к для льо́ду (windshield ice scraper) is an essential winter car tool in Ukraine.',
  },
  'id-v2-1567': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): морська́ зі́рка (starfish) is an iconic, high-recognition marine animal noun.',
  },
  'id-v2-1573': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Hold for review: гейзер (geyser) is geographically recognizable but low everyday conversational frequency.',
  },
  'id-v2-1264': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Keep (useful_extended): айва́ (quince) is a well-known autumn fruit in Ukrainian markets.',
  },
  'id-v2-1642': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Keep (common_situational): бахі́ли меди́чні (disposable clinic shoe covers) are a ubiquitous everyday reality in Ukrainian clinics and hospitals.',
  },
  'id-v2-1721': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: кри́шка об’єкти́ва (camera lens cap) is a minor equipment sub-part.',
  },
  'id-v2-1475': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: при́зма скляна́ (optical glass prism) is a specialized physics-lab optical object.',
  },
  'id-v2-1995': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: перо́ каліграфі́чне (calligraphy nib pen) is a specialist calligraphy tool.',
  },
  'id-v2-1838': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['street'],
    rationaleEn:
      'Hold for review: бага́жник на даху́ авто́ (car roof cargo box) is visually distinct; base бага́жник (car trunk, id-v2-722) is already in KEEP.',
  },
  'id-v2-1569': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Keep (common_situational): водорості морські́ (seaweed / kelp) is a core marine and aquarium nature noun.',
  },
  'id-v2-1574': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): вулка́н (volcano) is a foundational geography and nature noun with an unmistakable silhouette.',
  },
  'id-v2-1265': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Keep (common_situational): нектари́н (nectarine) is a common everyday supermarket fruit.',
  },
  'id-v2-1643': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital', 'pharmacy'],
    rationaleEn:
      'Keep (common_situational): рукави́чки меди́чні (medical exam gloves) are a distinct clinical and household hygiene item.',
  },
  'id-v2-1722': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: світловідбива́ч студі́йний (studio photo reflector) is specialized studio photography gear.',
  },
  'id-v2-1476': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: моде́ль молеку́ли (molecular ball-and-stick model) is a specialized chemistry-classroom teaching prop.',
  },
  'id-v2-1996': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: папі́р акваре́льний факту́рний (textured watercolor pad) is visually indistinguishable from a regular sketchbook.',
  },
  'id-v2-1842': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport', 'train_station'],
    rationaleEn:
      'Keep (common_situational): інформаці́йна сті́йка (airport/station information desk) is a high-utility travel navigation concept.',
  },
  'id-v2-1570': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    rationaleEn:
      'Hold for review: скеля́стий мис (rocky headland / cape) overlaps visually with cliff (id-v2-975).',
  },
  'id-v2-1595': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): курни́к (chicken coop) is a core rural farmyard structure.',
  },
  'id-v2-1266': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Keep (useful_extended): поме́ло (pomelo) is a common citrus fruit in Ukrainian supermarkets.',
  },
  'id-v2-1644': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Hold for review: ша́почка хірургі́чна (surgical cap) is a secondary clinical attire item.',
  },
  'id-v2-1723': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: фон студі́йний (photography backdrop roll) is specialized studio equipment.',
  },
  'id-v2-1479': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office'],
    rationaleEn:
      'Hold for review: лазерна ука́зка (laser pointer) is a familiar presentation tool.',
  },
  'id-v2-1997': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: пластилі́н скульпту́рний (sculptor’s modeling clay) is redundant alongside standard school plasticine.',
  },
  'id-v2-1846': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['train_station'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: стоп-кра́н у по́їзді (emergency brake handle) is a modifier-padded variant of Batch 6 EXCLUDE id-v2-1400 (стоп-кра́н).',
  },
  'id-v2-1577': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    rationaleEn:
      'Hold for review: валун мохови́й (mossy boulder) is a descriptive nature scene element.',
  },
  'id-v2-1607': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (useful_extended): видрá (river otter) is a well-known semi-aquatic mammal.',
  },
  'id-v2-1267': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: кумква́т (kumquat) is a niche exotic citrus fruit with low everyday priority.',
  },
  'id-v2-1645': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Hold for review: ши́рма меди́чна (clinical privacy screen) is a recognizable examination-room fixture.',
  },
  'id-v2-1726': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['theater'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: біно́кль театра́льний (opera glasses) is a niche subtype; standard binoculars (id-v2-951) are already in KEEP.',
  },
  'id-v2-1480': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: академі́чна ша́почка (graduation mortarboard cap) has a clear silhouette for education scenes.',
  },
  'id-v2-1847': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['train_station'],
    rationaleEn:
      'Keep (common_situational): поли́ця купе́йна (sleeping berth bunk) is an iconic, high-frequency Ukrainian overnight train (Укрзалізниця) concept.',
  },
  'id-v2-1578': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest', 'countryside'],
    rationaleEn:
      'Keep (common_situational): джерело́ лісове́ (natural spring) is a core Ukrainian nature and water-source noun.',
  },
  'id-v2-1608': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    rationaleEn:
      'Keep (common_situational): кажа́н (bat) is a core animal noun with an unmistakable winged silhouette.',
  },
  'id-v2-1268': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Hold for review: мараку́йя (passionfruit) is a recognizable tropical fruit flavor and supermarket item.',
  },
  'id-v2-1646': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hospital'],
    rationaleEn:
      'Keep (common_situational): куше́тка оглядо́ва (medical examination table) is the central furniture piece in any doctor’s office scene.',
  },
  'id-v2-1727': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'living_room'],
    rationaleEn:
      'Keep (common_situational): телеско́п астрономі́чний (refractor telescope) is an iconic science and hobby instrument with a clear silhouette.',
  },
  'id-v2-1854': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: ка́федра ле́ктора (lecturer podium) overlaps with Batch 4 REVIEW id-v2-738 (ка́федра / трибу́на).',
  },
  'id-v2-1848': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['train_station'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: підскля́нник метале́вий (train tea glass holder) overlaps with Batch 8 REVIEW id-v2-1402 (підстака́нник).',
  },
  'id-v2-1580': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: шлюз річкови́й (canal lock) is specialized hydraulic infrastructure.',
  },
  'id-v2-1609': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): кріт (mole) is a well-known garden and children’s story mammal.',
  },
  'id-v2-1269': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Hold for review: папа́йя (papaya) is an extended tropical fruit candidate.',
  },
  'id-v2-1648': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: лінза очкова (optometry trial lens) is specialized optometrist testing equipment.',
  },
  'id-v2-1728': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): гу́бна гармо́ніка (harmonica) is a well-known portable musical instrument.',
  },
  'id-v2-1856': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: лека́ло кресля́рське (French curve template) is a modifier-padded variant of Batch 6 EXCLUDE id-v2-1460 (лека́ло).',
  },
  'id-v2-1849': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['train_station'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: шпа́ла бето́нна (concrete railway tie) is a modifier-padded variant of Batch 7 EXCLUDE id-v2-696 (шпа́ла).',
  },
  'id-v2-1582': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): гря́дка садо́ва (garden bed / vegetable patch) is a core Ukrainian dacha and backyard gardening noun.',
  },
  'id-v2-1694': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    rationaleEn:
      'Hold for review: монобло́к (all-in-one desktop computer) is visually close to desktop monitor.',
  },
  'id-v2-1270': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: лі́чі (lychee) is a low-frequency exotic fruit.',
  },
  'id-v2-1649': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    rationaleEn:
      'Hold for review: іррига́тор ротово́ї порожни́ни (water flosser) is a modern dental hygiene device.',
  },
  'id-v2-1734': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: трику́тник музи́чний (musical triangle) is visually clear for music-classroom scenes.',
  },
  'id-v2-1857': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: ко́синець кресля́рський (drafting set square) is a modifier-padded variant of Batch 4 EXCLUDE id-v2-760 (коси́нець).',
  },
  'id-v2-1850': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['port'],
    issueFlags: ['overly_specialized', 'modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: кнехт порто́вий (mooring bollard) is a specialist maritime term matching Batch 8 EXCLUDE id-v2-1415.',
  },
  'id-v2-1588': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): сідло́ кінське́ (horse riding saddle) is a core countryside and equestrian object.',
  },
  'id-v2-1737': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: капода́стр (guitar capo) is a specialized musician accessory.',
  },
  'id-v2-1271': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: фе́йхоа (feijoa) is visually similar to green lime/guava and low everyday frequency.',
  },
  'id-v2-1652': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (common_situational): шведська сті́нка (gymnastic wall bars) is a ubiquitous fixture in Ukrainian school gyms and apartments.',
  },
  'id-v2-1858': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: гри́фель для олівця́ (mechanical pencil lead refill) is a tiny stationery sub-part.',
  },
  'id-v2-1851': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['port'],
    rationaleEn:
      'Keep (useful_extended): рятува́льна шлю́пка (ship lifeboat) is a visually clear maritime safety vessel.',
  },
  'id-v2-1591': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (useful_extended): сноп пшени́ці (wheat sheaf) is a culturally iconic Ukrainian harvest symbol.',
  },
  'id-v2-1742': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: мастихі́н (artist palette knife) is a specialist oil-painting tool.',
  },
  'id-v2-1272': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): гли́ви (oyster mushrooms) are one of the two most common supermarket mushrooms in Ukraine alongside печери́ці.',
  },
  'id-v2-1653': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Hold for review: кі́льця гімнасти́чні (gymnastic rings) are visually clear gymnasium apparatus.',
  },
  'id-v2-1859': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-758',
    canonicalConceptId: resolveMasterConceptId('id-v2-758'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-758 (струга́чка, pencil sharpener).',
  },
  'id-v2-1852': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['port'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: трап корабе́льний (ship gangway) matches Batch 8 EXCLUDE id-v2-1414 (трап суднови́й).',
  },
  'id-v2-1592': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Keep (useful_extended): коса́ ручна́ (agricultural scythe) is a classic rural harvesting tool; distinct sense from коса́ (braided hair, id-v2-1499).',
  },
  'id-v2-1743': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: ба́ночка-непролива́йка (spill-proof paint water cup) is a common Ukrainian elementary school art supply.',
  },
  'id-v2-1273': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest', 'supermarket'],
    rationaleEn:
      'Hold for review: опе́ньки (honey mushrooms) are culturally popular in Ukraine though mushroom species require detailed visual depiction.',
  },
  'id-v2-1654': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Hold for review: бру́си парале́льні (parallel bars) are recognizable gymnasium/outdoor workout bars.',
  },
  'id-v2-1862': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['library'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: формуляр читача́ (paper library checkout card) is an dated administrative form.',
  },
  'id-v2-1853': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-956',
    canonicalConceptId: resolveMasterConceptId('id-v2-956'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-956 (весло́, oar / paddle).',
  },
  'id-v2-1594': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Keep (common_situational): ви́ла садо́ві (pitchfork) is a core farmyard and gardening tool.',
  },
  'id-v2-1748': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Hold for review: веретено́ / прядка (spinning wheel) is a traditional folk-craft object with high visual distinctness.',
  },
  'id-v2-1274': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: маслюки́ (slippery jack mushrooms) are difficult to distinguish visually from general bolete mushrooms.',
  },
  'id-v2-1655': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Hold for review: коло́да гімнасти́чна (balance beam) is a clear gymnastics apparatus.',
  },
  'id-v2-1863': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: різа́к для папе́ру (guillotine paper trimmer) is specialized print-shop/office equipment.',
  },
  'id-v2-1979': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: мікрофо́нна сті́йка-жураве́ль (boom microphone stand) is specialized recording-studio hardware.',
  },
  'id-v2-1600': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): дря́пка для кота́ (cat scratching post) is a very common apartment pet-furniture item.',
  },
  'id-v2-1751': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living_room'],
    rationaleEn:
      'Keep (useful_extended): витина́нка (Ukrainian decorative paper cutout art) is a culturally distinctive Ukrainian folk art noun.',
  },
  'id-v2-1275': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ри́жики (saffron milk cap mushrooms) are too species-specific for general visual identification.',
  },
  'id-v2-1656': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: козе́л гімнасти́чний (vaulting horse) is specialized competitive gymnastics equipment.',
  },
  'id-v2-1864': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ламіна́тор о́фісний (thermal laminator) is specialized office equipment.',
  },
  'id-v2-1981': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Hold for review: пульт ді-дже́я (контро́лер) (DJ controller) has a recognizable dual-jogwheel layout.',
  },
  'id-v2-1601': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Keep (common_situational): клі́тка для пта́шки (birdcage) is a classic household pet enclosure with a clear silhouette.',
  },
  'id-v2-1756': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'bedroom'],
    rationaleEn:
      'Keep (common_situational): терморегуля́тор (wall/radiator thermostat dial) is a practical modern apartment heating control.',
  },
  'id-v2-1276': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket'],
    rationaleEn:
      'Hold for review: сулугу́ні (suluguni cheese) is very popular in Ukraine, though cheese varieties share visual similarities.',
  },
  'id-v2-1657': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (common_situational): мат спортивний (gym landing mat) is a core school gym and fitness floor item.',
  },
  'id-v2-1866': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: візи́тниця насті́льна (desk business card holder) is low-utility office clutter.',
  },
  'id-v2-1982': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: сабву́фер акусти́чний (subwoofer speaker box) is redundant alongside general speaker (коло́нка).',
  },
  'id-v2-1603': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    rationaleEn:
      'Keep (common_situational): каба́н ди́кий (normalized to ди́кий каба́н, wild boar) is a core European forest wildlife noun.',
  },
  'id-v2-1779': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'countryside'],
    rationaleEn:
      'Keep (useful_extended): мишоло́вка (mousetrap) is a household utility noun with an unmistakable spring-bar silhouette.',
  },
  'id-v2-1277': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Hold for review: фе́та (feta cheese) is a common salad ingredient, held for food-scene cheese subtype review.',
  },
  'id-v2-1659': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (useful_extended): ро́лик маса́жний (foam roller) is a common modern gym and physical-therapy cylinder.',
  },
  'id-v2-1870': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: те́ка на зав’я́зках (archival tie folder) is redundant alongside file folder (па́пка для докуме́нтів, id-v2-749).',
  },
  'id-v2-1983': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Hold for review: підси́лювач гіта́рний (ко́мбік) (guitar amplifier) is a recognizable music-band item.',
  },
  'id-v2-1907': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['forest'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1554',
    canonicalConceptId: resolveMasterConceptId('id-v2-1554'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-1554 (пролі́сок, snowdrop / scilla).',
  },
  'id-v2-1879': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['clothing_store', 'street'],
    rationaleEn:
      'Hold for review: плащ-дощови́к (hooded rain poncho) is compared against Batch 2 KEEP id-v2-825 (плащ, trench coat / raincoat).',
  },
  'id-v2-1278': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Hold for review: пармеза́н (Parmesan cheese wedge) is a common grocery and pasta topping item.',
  },
  'id-v2-1660': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: пля́шка спортивна (sports squeeze bottle) is redundant alongside Batch 1 KEEP gm-bottle (пля́шка, gym water bottle).',
  },
  'id-v2-1871': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: короб архі́вний (archive storage box) is specialized office storage.',
  },
  'id-v2-1984': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: пюпі́тр оркестро́вий (orchestra music stand) is a modifier-padded variant of Batch 5 EXCLUDE id-v2-1132 (пюпі́тр).',
  },
  'id-v2-1908': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1563',
    canonicalConceptId: resolveMasterConceptId('id-v2-1563'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 2 KEEP id-v2-1563 (барві́нок, periwinkle).',
  },
  'id-v2-1885': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['clothing_store'],
    rationaleEn:
      'Keep (common_situational): очі́пок / віно́к український (normalized to віно́к, Ukrainian flower crown) is an iconic cultural headpiece.',
  },
  'id-v2-1281': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: па́хта / масля́нка (buttermilk) is a white liquid visually indistinguishable from milk or kefir.',
  },
  'id-v2-1663': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Hold for review: шоло́м боксе́рський (boxing headgear) is recognizable combat-sports gear.',
  },
  'id-v2-1872': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: штати́в лабораторний (laboratory retort stand) is specialized chemistry apparatus.',
  },
  'id-v2-1985': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: чохо́л для скри́пки (violin case) has a distinctive contoured instrument-case shape.',
  },
  'id-v2-1917': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-391',
    canonicalConceptId: resolveMasterConceptId('id-v2-391'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 3 KEEP id-v2-391 (годівни́ця, bird feeder).',
  },
  'id-v2-1893': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing_store', 'apartment_hallway'],
    rationaleEn:
      'Keep (common_situational): підбо́ри (каблу́к) (normalized to підбо́ри, shoe heel) is a high-frequency everyday footwear noun.',
  },
  'id-v2-1283': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Hold for review: маргари́н (baking margarine block) is visually close to butter (вершко́ве ма́сло).',
  },
  'id-v2-1664': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ка́па боксе́рська (boxing mouthguard) is a small specialist sports item.',
  },
  'id-v2-1874': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: піпе́тка градуйо́вана (graduated laboratory pipette) matches Batch 5 EXCLUDE id-v2-782.',
  },
  'id-v2-1986': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room'],
    rationaleEn:
      'Hold for review: лі́ра колі́сна (Ukrainian hurdy-gurdy / kolisna lira) is a culturally significant Ukrainian folk instrument.',
  },
  'id-v2-1925': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: вузде́чка кі́нська (horse bridle and reins) is a modifier-padded variant of Batch 8 REVIEW id-v2-1589 (вузде́чка).',
  },
  'id-v2-1904': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: пло́йка / випрямля́ч для воло́сся overlaps with Batch 5 REVIEW id-v2-307 (пло́йка, curling iron).',
  },
  'id-v2-1287': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: желати́н (gelatin sheets/powder) has poor visual recognizability in a kitchen scene.',
  },
  'id-v2-1665': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym'],
    rationaleEn:
      'Keep (common_situational): раке́тка для насті́льного те́нісу (ping-pong paddle) is a common recreation and school-gym object.',
  },
};

// ----------------------------------------------------------------------------
// 5. Batch 9 Curation & Headword Summary Report
// ----------------------------------------------------------------------------

export interface IdentifyBatch9CurationAndHeadwordSummary {
  reportVersion: '9.0.0-batch9';
  batchNumber: 9;
  candidatesReviewedInBatch9Count: 200;
  batch9RecommendedKeepCount: 93;
  batch9RecommendedReviewCount: 34;
  batch9RecommendedExcludeCount: 73;
  batch9PriorityBreakdownOfKept: {
    essential_everyday: 22;
    common_situational: 60;
    useful_extended: 11;
  };
  preservedGenuineMissingConceptsCount: 34;
  headwordNormalizationsCompletedInBatch9Count: number;
  headwordNormalizations: readonly IdentifyBatch9HeadwordNormalizationRecord[];
  semanticRelationshipsInBatch9Count: number;
  semanticRelationships: readonly IdentifyBatch9SemanticRelationshipRecord[];
  essentialEverydayWithIndependentJustificationCount: 22;
  essentialEverydayJustifications: readonly IdentifyBatch9EssentialEverydayPedagogicalReason[];
}

export function getBatch9CurationAndHeadwordReport(): IdentifyBatch9CurationAndHeadwordSummary {
  return {
    reportVersion: '9.0.0-batch9',
    batchNumber: 9,
    candidatesReviewedInBatch9Count: 200,
    batch9RecommendedKeepCount: 93,
    batch9RecommendedReviewCount: 34,
    batch9RecommendedExcludeCount: 73,
    batch9PriorityBreakdownOfKept: {
      essential_everyday: 22,
      common_situational: 60,
      useful_extended: 11,
    },
    preservedGenuineMissingConceptsCount: 34,
    headwordNormalizationsCompletedInBatch9Count:
      IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS.length,
    headwordNormalizations: IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS,
    semanticRelationshipsInBatch9Count:
      IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS.length,
    semanticRelationships: IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS,
    essentialEverydayWithIndependentJustificationCount: 22,
    essentialEverydayJustifications:
      IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  };
}
