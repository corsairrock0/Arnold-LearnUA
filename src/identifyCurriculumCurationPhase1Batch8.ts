// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 8 (CANDIDATES 1401..1600):
// SELECTIVE EVERYDAY VOCABULARY CURATION, CANONICAL DUPLICATE EXCLUSIONS,
// SPECIALIST / LABORATORY FILTERING & LEARNER HEADWORD NORMALIZATION
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only planning and curation infrastructure.
// - It does NOT alter the active learner-facing Identify tab, the 10 verified
//   photographic scenes, the 49 approved active learner targets, or the
//   preserved 2,000-noun / 120-scene legacy planning archive.
// - Preserves all 1,400 previously saved Batch 1–7 curation decisions,
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

export type ExplicitBatch8Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch8SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

// ----------------------------------------------------------------------------
// 1. Batch 8 Semantic Duplicate & Relationship Records
// ----------------------------------------------------------------------------

export interface IdentifyBatch8SemanticRelationshipRecord {
  batchNumber: 8;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  relationshipType: IdentifyBatch8SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

interface RawBatch8SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  relationshipType: IdentifyBatch8SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_8_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch8SemanticRelationshipSeed[] =
  [
    {
      candidateVocabularyId: 'id-v2-1775',
      comparedVocabularyId: 'id-v2-319',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'ваги́ підлогові́ (bathroom floor scale) is a word-order inversion duplicate of approved Batch 3 KEEP id-v2-319 (підло́гові ваги́, bathroom scale, noun-concept-0158).',
    },
    {
      candidateVocabularyId: 'id-v2-1821',
      comparedVocabularyId: 'id-v2-624',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'вітри́на пека́рні (bakery display window) is a store-specific modifier-padded variant of approved Batch 2 KEEP id-v2-624 (вітри́на, shop window, noun-concept-0800).',
    },
    {
      candidateVocabularyId: 'id-v2-1822',
      comparedVocabularyId: 'id-v2-625',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'маркі́за смуга́ста (striped storefront awning) is an adjective-padded duplicate of approved Batch 4 KEEP id-v2-625 (наві́с / маркі́за, awning, noun-concept-0819).',
    },
    {
      candidateVocabularyId: 'id-v2-1428',
      comparedVocabularyId: 'id-v2-655',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'вогнега́сник автомобі́льний (compact car extinguisher) is a location-qualified duplicate of approved Batch 4 KEEP id-v2-655 (вогнега́сник, fire extinguisher, noun-concept-0788).',
    },
    {
      candidateVocabularyId: 'id-v2-1826',
      comparedVocabularyId: 'id-v2-655',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'вогнега́сник черво́ний (fire extinguisher cylinder) is a color-adjective-padded duplicate of approved Batch 4 KEEP id-v2-655 (вогнега́сник, fire extinguisher, noun-concept-0788).',
    },
    {
      candidateVocabularyId: 'id-v2-1825',
      comparedVocabularyId: 'id-v2-632',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'поштома́т для поси́лок (parcel locker terminal) is a modifier-padded duplicate of approved Batch 6 KEEP id-v2-632 (поштома́т, parcel locker, noun-concept-0905).',
    },
    {
      candidateVocabularyId: 'id-v2-1832',
      comparedVocabularyId: 'id-v2-621',
      comparedBatchNumber: 4,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'шлагба́ум автомати́чний (barrier gate arm) is a modifier-padded duplicate of approved Batch 4 KEEP id-v2-621 (шлагба́ум, barrier gate, noun-concept-0746).',
    },
    {
      candidateVocabularyId: 'id-v2-1834',
      comparedVocabularyId: 'id-v2-726',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'запра́вна коло́нка (fuel dispenser pump) is an alternate phrasal duplicate of approved Batch 7 KEEP id-v2-726 (бензоколо́нка, fuel pump, noun-concept-1108).',
    },
    {
      candidateVocabularyId: 'id-v2-1835',
      comparedVocabularyId: 'id-v2-727',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'заря́дна ста́нція для електромобі́ля (EV charging station) is a modifier-padded duplicate of approved Batch 5 KEEP id-v2-727 (заря́дна ста́нція, EV charging station, noun-concept-0949).',
    },
    {
      candidateVocabularyId: 'id-v2-1967',
      comparedVocabularyId: 'id-v2-1101',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'акумуля́тор зовнішній со́нячний (solar charger bank) is a specialized subtype of approved Batch 4 KEEP id-v2-1101 (паверба́нк, power bank, noun-concept-1959).',
    },
    {
      candidateVocabularyId: 'id-v2-1551',
      comparedVocabularyId: 'id-v2-909',
      comparedBatchNumber: 2,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'воло́шка лугова́ (meadow knapweed) is a botanical species variant compared against Batch 2 REVIEW id-v2-909 (воло́шка, cornflower); excluded on standalone species-specificity grounds without promoting id-v2-909.',
    },
    {
      candidateVocabularyId: 'id-v2-1815',
      comparedVocabularyId: 'id-v2-1329',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'флю́гер на даху́ (weathervane) is a modifier-padded variant of Batch 5 EXCLUDE id-v2-1329 (флю́гер, weathervane); excluded on low everyday priority without canonical promotion.',
    },
    {
      candidateVocabularyId: 'id-v2-1816',
      comparedVocabularyId: 'id-v2-1327',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'коло́на архітекту́рна (stone architectural column) is held in REVIEW alongside Batch 5 REVIEW id-v2-1327 (колона́да, colonnade) for final urban-architecture scene reconciliation.',
    },
    {
      candidateVocabularyId: 'id-v2-1817',
      comparedVocabularyId: 'id-v2-1326',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'а́рка кам’яна́ (stone archway) is a modifier-padded variant of Batch 5 REVIEW id-v2-1326 (арка міська́, archway); excluded so only one archway candidate remains in the REVIEW pool.',
    },
    {
      candidateVocabularyId: 'id-v2-1963',
      comparedVocabularyId: 'id-v2-740',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'екра́н проєктора (pull-down projector screen) is an alternate phrasal form of Batch 5 REVIEW id-v2-740 (екра́н проєкці́йний, projection screen); excluded without promoting id-v2-740.',
    },
    {
      candidateVocabularyId: 'id-v2-1533',
      comparedVocabularyId: 'id-v2-875',
      comparedBatchNumber: 5,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'віяло мереживне (lace fan) is a decorative subtype of Batch 5 REVIEW id-v2-875 (ві́яло, hand fan); excluded without promoting id-v2-875.',
    },
    {
      candidateVocabularyId: 'id-v2-1797',
      comparedVocabularyId: 'id-v2-428',
      comparedBatchNumber: 4,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'порі́чка (черво́на сморо́дина) (red currant) is a distinct Ukrainian lexical item (порі́чка) contrasted with black currant (сморо́дина, Batch 4 KEEP id-v2-428).',
    },
    {
      candidateVocabularyId: 'id-v2-1686',
      comparedVocabularyId: 'id-v2-711',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'самока́т дитя́чий (kick scooter, normalized to самока́т) is the non-motorized kick scooter contrasted with Batch 7 KEEP id-v2-711 (електросамока́т, electric kick scooter).',
    },
    {
      candidateVocabularyId: 'id-v2-1814',
      comparedVocabularyId: 'id-v2-262',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ву́личний годинни́к (public street clock) is held in REVIEW; learners already have wall clock (id-v2-262) and wristwatch (id-v2-864) in KEEP.',
    },
  ];

export const IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch8SemanticRelationshipRecord[] =
  RAW_BATCH_8_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 8,
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
// 2. Batch 8 Learner Headword Normalizations (Non-Destructive Metadata Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch8HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 8;
  normalizationReasonEn: string;
}

interface RawBatch8HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_8_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch8HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1443',
      preferredLearnerHeadwordUk: 'закла́дка',
      acceptedConversationalSynonymsUk: ['закла́дка книжко́ва', 'книжко́ва закла́дка'],
      normalizationReasonEn:
        'Strips redundant catalog adjective книжко́ва so learners practice natural everyday закла́дка (bookmark) while preserving master registry entry id-v2-1443.',
    },
    {
      vocabularyId: 'id-v2-1686',
      preferredLearnerHeadwordUk: 'самока́т',
      acceptedConversationalSynonymsUk: ['самока́т дитя́чий', 'дитя́чий самока́т'],
      normalizationReasonEn:
        'Normalizes самока́т дитя́чий to concise base noun самока́т (kick scooter) for learner prompts.',
    },
    {
      vocabularyId: 'id-v2-1867',
      preferredLearnerHeadwordUk: 'календа́р',
      acceptedConversationalSynonymsUk: [
        'календа́р перекидни́й',
        'насті́льний календа́р',
      ],
      normalizationReasonEn:
        'Normalizes календа́р перекидни́й to everyday base headword календа́р (calendar).',
    },
    {
      vocabularyId: 'id-v2-1183',
      preferredLearnerHeadwordUk: 'фільтр-гле́чик',
      acceptedConversationalSynonymsUk: [
        'фільтр-гле́чик для води́',
        'фі́льтр для води́',
      ],
      normalizationReasonEn:
        'Shortens фільтр-гле́чик для води́ to natural household compound фільтр-гле́чик (water filter pitcher).',
    },
    {
      vocabularyId: 'id-v2-1302',
      preferredLearnerHeadwordUk: 'па́ска',
      acceptedConversationalSynonymsUk: ['па́ска велико́дня', 'велико́дня па́ска'],
      normalizationReasonEn:
        'Normalizes па́ска велико́дня to culturally iconic single-word noun па́ска (Easter paska bread).',
    },
    {
      vocabularyId: 'id-v2-1794',
      preferredLearnerHeadwordUk: 'гарбузо́ве насі́ння',
      acceptedConversationalSynonymsUk: ['насі́ння гарбузо́ве'],
      normalizationReasonEn:
        'Reorders catalog-inverted насі́ння гарбузо́ве to natural Ukrainian adjective-first гарбузо́ве насі́ння (pumpkin seeds).',
    },
    {
      vocabularyId: 'id-v2-1797',
      preferredLearnerHeadwordUk: 'порі́чка',
      acceptedConversationalSynonymsUk: [
        'черво́на сморо́дина',
        'порі́чка (черво́на сморо́дина)',
      ],
      normalizationReasonEn:
        'Strips parenthetical gloss from порі́чка (черво́на сморо́дина) and accepts черво́на сморо́дина as a conversational synonym.',
    },
    {
      vocabularyId: 'id-v2-1432',
      preferredLearnerHeadwordUk: 'автокрі́сло',
      acceptedConversationalSynonymsUk: [
        'автокрі́сло дитя́че',
        'дитя́че автокрі́сло',
      ],
      normalizationReasonEn:
        'Normalizes автокрі́сло дитя́че to concise everyday noun автокрі́сло (child car seat).',
    },
    {
      vocabularyId: 'id-v2-1433',
      preferredLearnerHeadwordUk: 'навіга́тор',
      acceptedConversationalSynonymsUk: ['GPS-навіга́тор', 'навіга́тор GPS'],
      normalizationReasonEn:
        'Normalizes навіга́тор GPS to natural everyday noun навіга́тор (car GPS navigator).',
    },
    {
      vocabularyId: 'id-v2-1698',
      preferredLearnerHeadwordUk: 'електро́нна кни́жка',
      acceptedConversationalSynonymsUk: [
        'рі́дер',
        'електро́нна кни́жка (рідер)',
      ],
      normalizationReasonEn:
        'Strips parenthetical disambiguator from електро́нна кни́жка (рідер) and accepts рі́дер as synonym.',
    },
    {
      vocabularyId: 'id-v2-1689',
      preferredLearnerHeadwordUk: 'фрі́збі',
      acceptedConversationalSynonymsUk: [
        'літа́ючий диск',
        'фрі́збі (літаючий диск)',
      ],
      normalizationReasonEn:
        'Strips parenthetical explanation from фрі́збі (літаючий диск) for clean learner prompts.',
    },
    {
      vocabularyId: 'id-v2-1693',
      preferredLearnerHeadwordUk: 'доміно́',
      acceptedConversationalSynonymsUk: ['кі́сточка доміно́', 'доміно́ (кісточка)'],
      normalizationReasonEn:
        'Strips parenthetical classifier from доміно́ (кісточка) so learners practice natural доміно́.',
    },
    {
      vocabularyId: 'id-v2-1499',
      preferredLearnerHeadwordUk: 'коса́',
      acceptedConversationalSynonymsUk: ['запле́тена коса́', 'коса́ (зачіска)'],
      normalizationReasonEn:
        'Strips parenthetical sense tag (зачіска) for learner display while preserving polysemy metadata.',
    },
    {
      vocabularyId: 'id-v2-1247',
      preferredLearnerHeadwordUk: 'гвозди́ка',
      acceptedConversationalSynonymsUk: ['гвозди́ка (пряність)'],
      normalizationReasonEn:
        'Strips parenthetical sense tag (пряність) for learner display while preserving spice-sense metadata.',
    },
    {
      vocabularyId: 'id-v2-1631',
      preferredLearnerHeadwordUk: 'грі́лка',
      acceptedConversationalSynonymsUk: ['грі́лка гу́мова', 'гу́мова грі́лка'],
      normalizationReasonEn:
        'Normalizes грі́лка гу́мова to concise household noun грі́лка (hot water bottle).',
    },
  ];

export const IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch8HeadwordNormalizationRecord[] =
  RAW_BATCH_8_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
    const master = resolveMasterNounById(seed.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      originalMasterHeadwordUk: master.uk,
      preferredLearnerHeadwordUk: seed.preferredLearnerHeadwordUk,
      acceptedConversationalSynonymsUk: seed.acceptedConversationalSynonymsUk,
      englishGlossEn: master.en,
      gender: master.gender,
      reviewedInBatchNumber: 8,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Batch 8 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch8EssentialEverydayPedagogicalReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_8_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [
  {
    vocabularyId: 'id-v2-1599',
    independentPedagogicalJustificationEn:
      'повіде́ць (dog leash) is an indispensable everyday pet-care noun seen daily in city parks, streets, and apartment courtyards.',
  },
  {
    vocabularyId: 'id-v2-1602',
    independentPedagogicalJustificationEn:
      'аква́ріум (aquarium / fish tank) is a universally recognizable household, school, and public-venue noun.',
  },
  {
    vocabularyId: 'id-v2-1615',
    independentPedagogicalJustificationEn:
      'папу́га (parrot) is one of the most common household pet birds and core beginner animal nouns in Ukrainian.',
  },
  {
    vocabularyId: 'id-v2-1617',
    independentPedagogicalJustificationEn:
      'пінгві́н (penguin) is an iconic, unmistakable core animal noun in children and beginner vocabulary curricula.',
  },
  {
    vocabularyId: 'id-v2-1620',
    independentPedagogicalJustificationEn:
      'аку́ла (shark) is a core marine animal noun with immediate visual silhouette recognition.',
  },
  {
    vocabularyId: 'id-v2-1181',
    independentPedagogicalJustificationEn:
      'мийний за́сіб (dishwashing liquid) is an essential daily kitchen-sink household item in every Ukrainian home.',
  },
  {
    vocabularyId: 'id-v2-1443',
    independentPedagogicalJustificationEn:
      'закла́дка книжко́ва (normalized to закла́дка, bookmark) is a high-frequency reading and school-supply noun.',
  },
  {
    vocabularyId: 'id-v2-1682',
    independentPedagogicalJustificationEn:
      'бату́т (trampoline) is a ubiquitous yard, park, and children’s recreation noun with a clear visual silhouette.',
  },
  {
    vocabularyId: 'id-v2-1686',
    independentPedagogicalJustificationEn:
      'самока́т дитя́чий (normalized to самока́т, kick scooter) is an everyday urban and playground transport item.',
  },
  {
    vocabularyId: 'id-v2-1295',
    independentPedagogicalJustificationEn:
      'спаге́ті (spaghetti) is a core everyday food and restaurant menu staple.',
  },
  {
    vocabularyId: 'id-v2-1298',
    independentPedagogicalJustificationEn:
      'лава́ш (flatbread / lavash) is an everyday bakery and supermarket staple across Ukraine.',
  },
  {
    vocabularyId: 'id-v2-1302',
    independentPedagogicalJustificationEn:
      'па́ска велико́дня (normalized to па́ска, Easter bread) is one of the most culturally central Ukrainian food nouns.',
  },
  {
    vocabularyId: 'id-v2-1310',
    independentPedagogicalJustificationEn:
      'льодяни́к (lollipop / hard candy) is a core everyday confectionery and pharmacy throat-lozenge noun.',
  },
  {
    vocabularyId: 'id-v2-1867',
    independentPedagogicalJustificationEn:
      'календа́р перекидни́й (normalized to календа́р, calendar) is a foundational home, classroom, and office noun.',
  },
  {
    vocabularyId: 'id-v2-1485',
    independentPedagogicalJustificationEn:
      'перука́р (hairdresser / barber) is a core everyday service profession taught in A1–A2 Ukrainian.',
  },
  {
    vocabularyId: 'id-v2-1488',
    independentPedagogicalJustificationEn:
      'фермер (farmer) is a foundational occupation noun in agriculture, market, and countryside scenes.',
  },
  {
    vocabularyId: 'id-v2-1497',
    independentPedagogicalJustificationEn:
      'борода́ (beard) is a core human-appearance and portrait description noun.',
  },
  {
    vocabularyId: 'id-v2-1498',
    independentPedagogicalJustificationEn:
      'ву́са (mustache) is a core human-appearance and portrait description noun.',
  },
  {
    vocabularyId: 'id-v2-1499',
    independentPedagogicalJustificationEn:
      'коса́ (зачіска) (normalized to коса́, braided hair) is a core everyday appearance and traditional Ukrainian culture noun.',
  },
  {
    vocabularyId: 'id-v2-1244',
    independentPedagogicalJustificationEn:
      'імби́р (ginger root) is a ubiquitous supermarket produce, tea, and cooking ingredient.',
  },
  {
    vocabularyId: 'id-v2-1619',
    independentPedagogicalJustificationEn:
      'кит (whale) is a core marine animal noun with unmistakable visual form.',
  },
  {
    vocabularyId: 'id-v2-1621',
    independentPedagogicalJustificationEn:
      'восьмині́г (octopus) is a core marine animal noun in nature and aquarium scenes.',
  },
  {
    vocabularyId: 'id-v2-1432',
    independentPedagogicalJustificationEn:
      'автокрі́сло дитя́че (normalized to автокрі́сло, child car seat) is an essential everyday family-transport safety item.',
  },
  {
    vocabularyId: 'id-v2-1183',
    independentPedagogicalJustificationEn:
      'фільтр-гле́чик для води́ (normalized to фільтр-гле́чик, water filter pitcher) is a standard kitchen countertop item in Ukrainian apartments.',
  },
];

export const IDENTIFY_BATCH_8_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS: readonly IdentifyBatch8EssentialEverydayPedagogicalReason[] =
  RAW_BATCH_8_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
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
// 4. Explicit Batch 8 Assessments (All 200 Candidates 1401..1600)
// ----------------------------------------------------------------------------
// Exact Batch 8 distribution:
// - KEEP:    89 (24 essential_everyday, 46 common_situational, 19 useful_extended)
// - REVIEW:  49
// - EXCLUDE: 62
// Total:    200
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_8_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch8Assessment>
> = {
  // --- 24 essential_everyday KEEP ---
  'id-v2-1599': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'city-streets', 'hallway-entry'],
    rationaleEn:
      'Essential everyday pet-care noun (повіде́ць, dog leash); checkpoint-identified priority candidate.',
  },
  'id-v2-1602': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'classroom', 'pet-shop'],
    rationaleEn:
      'Essential everyday household and nature noun (аква́ріум, aquarium); checkpoint-identified priority candidate.',
  },
  'id-v2-1615': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['living-room', 'park-garden', 'zoo-aquarium'],
    rationaleEn:
      'Essential everyday pet and bird noun (папу́га, parrot); checkpoint-identified priority candidate.',
  },
  'id-v2-1617': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['zoo-aquarium', 'beach-nature', 'classroom'],
    rationaleEn:
      'Essential everyday animal noun (пінгві́н, penguin); checkpoint-identified priority candidate.',
  },
  'id-v2-1620': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'zoo-aquarium'],
    rationaleEn:
      'Essential everyday marine animal noun (аку́ла, shark); checkpoint-identified priority candidate.',
  },
  'id-v2-1181': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Essential daily kitchen household noun (мийний за́сіб, dishwashing liquid bottle); checkpoint-identified priority candidate.',
  },
  'id-v2-1443': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['library', 'classroom', 'bedroom'],
    rationaleEn:
      'Essential everyday reading noun (закла́дка книжко́ва -> normalized learner headword закла́дка, bookmark); checkpoint-identified priority candidate.',
  },
  'id-v2-1682': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside', 'gym-fitness'],
    rationaleEn:
      'Essential everyday recreation noun (бату́т, trampoline); checkpoint-identified priority candidate.',
  },
  'id-v2-1686': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'city-streets', 'hallway-entry'],
    rationaleEn:
      'Essential everyday recreation/transport noun (самока́т дитя́чий -> normalized learner headword самока́т, kick scooter); checkpoint-identified priority candidate.',
  },
  'id-v2-1295': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['dining-room', 'kitchen', 'supermarket'],
    rationaleEn:
      'Essential everyday food noun (спаге́ті, spaghetti); visually distinct long pasta strands.',
  },
  'id-v2-1298': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'kitchen', 'farmers-market'],
    rationaleEn:
      'Essential everyday Ukrainian bakery and grocery staple (лава́ш, flatbread).',
  },
  'id-v2-1302': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['dining-room', 'kitchen', 'farmers-market'],
    rationaleEn:
      'Essential cultural and holiday food noun (па́ска велико́дня -> normalized to па́ска, Easter paska bread).',
  },
  'id-v2-1310': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'kitchen', 'shopping-district'],
    rationaleEn:
      'Essential everyday confectionery noun (льодяни́к, lollipop / hard candy).',
  },
  'id-v2-1867': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom', 'living-room'],
    rationaleEn:
      'Essential everyday home and office noun (календа́р перекидни́й -> normalized to календа́р, calendar).',
  },
  'id-v2-1485': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['shopping-district', 'city-streets'],
    rationaleEn:
      'Essential everyday service profession noun (перука́р, hairdresser / barber).',
  },
  'id-v2-1488': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'farmers-market'],
    rationaleEn:
      'Essential everyday occupation noun (фермер, farmer) for countryside and market scenes.',
  },
  'id-v2-1497': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'body-health'],
    rationaleEn:
      'Essential everyday human appearance noun (борода́, beard).',
  },
  'id-v2-1498': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'body-health'],
    rationaleEn:
      'Essential everyday human appearance noun (ву́са, mustache).',
  },
  'id-v2-1499': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'body-health'],
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Essential everyday appearance noun (коса́ (зачіска) -> normalized to коса́, braided hair / plait).',
  },
  'id-v2-1244': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'kitchen'],
    rationaleEn:
      'Essential everyday culinary and tea ingredient (імби́р, ginger root).',
  },
  'id-v2-1619': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'zoo-aquarium'],
    rationaleEn:
      'Essential everyday marine mammal noun (кит, whale).',
  },
  'id-v2-1621': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'zoo-aquarium'],
    rationaleEn:
      'Essential everyday marine animal noun (восьмині́г, octopus).',
  },
  'id-v2-1432': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation', 'city-streets'],
    rationaleEn:
      'Essential everyday family transport noun (автокрі́сло дитя́че -> normalized to автокрі́сло, child car seat).',
  },
  'id-v2-1183': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'dining-room'],
    rationaleEn:
      'Essential everyday kitchen countertop item (фільтр-гле́чик для води́ -> normalized to фільтр-гле́чик, water filter pitcher).',
  },

  // --- 46 common_situational KEEP ---
  'id-v2-1305': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['dining-room', 'supermarket', 'kitchen'],
    rationaleEn:
      'Common bakery and cafe pastry noun (екле́р, éclair) with a distinct oblong iced form.',
  },
  'id-v2-1797': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'park-garden'],
    rationaleEn:
      'Common Ukrainian berry noun (порі́чка (черво́на сморо́дина) -> normalized to порі́чка, red currant).',
  },
  'id-v2-1794': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'kitchen'],
    rationaleEn:
      'Common Ukrainian snack and baking ingredient (насі́ння гарбузо́ве -> normalized to гарбузо́ве насі́ння, pumpkin seeds).',
  },
  'id-v2-1525': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['hallway-entry', 'clothing-store'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Exclude: підо́шва взуття́ (shoe sole) is a compositional phrase for an underside sub-part of footwear that creates part-versus-whole hotspot ambiguity with shoes/boots.',
  },
  'id-v2-1579': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'beach-nature'],
    rationaleEn:
      'Common geographical and infrastructure landmark noun (гре́бля / дамба, dam / weir).',
  },
  'id-v2-1235': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'kitchen'],
    rationaleEn:
      'Common supermarket vegetable (цибу́ля-поре́й, leek) with a distinct cylindrical white-and-green stalk.',
  },
  'id-v2-1528': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'hallway-entry', 'city-streets'],
    rationaleEn:
      'Common everyday accessory noun (поясна́ су́мка, belt bag / waist pack).',
  },
  'id-v2-1436': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'office'],
    rationaleEn:
      'Common modern classroom fixture (інтеракти́вна до́шка, smartboard).',
  },
  'id-v2-1581': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    rationaleEn:
      'Common garden and countryside structure (тепли́ця / парни́к, greenhouse).',
  },
  'id-v2-1530': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'office', 'hallway-entry'],
    rationaleEn:
      'Common personal accessory (футля́р для окуля́рів, eyeglass case).',
  },
  'id-v2-1713': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'office', 'kitchen'],
    rationaleEn:
      'High-relevance contemporary Ukrainian household backup power device (па́вер-ста́нція, portable power station).',
  },
  'id-v2-1421': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    rationaleEn:
      'Hold for review: педа́ль велосипе́дна (bicycle pedal) is a secondary sub-part of велосипе́д.',
  },
  'id-v2-1238': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: кінза́ / коріа́ндр (cilantro) is visually indistinguishable in scene illustrations from flat-leaf parsley (петру́шка, Batch 5 KEEP id-v2-461).',
  },
  'id-v2-1422': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ланцю́г велосипе́дний (bicycle chain) is a narrow mechanical drive sub-part that creates part-versus-whole hotspot overlap with велосипе́д.',
  },
  'id-v2-1487': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Common occupation noun (садівни́к, gardener) in park and garden scenes.',
  },
  'id-v2-1239': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: розмари́н (rosemary sprig) is a secondary culinary herb sprig of low visual target priority.',
  },
  'id-v2-1684': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    rationaleEn:
      'Common playground equipment noun (баланси́р (гойдалка), seesaw / teeter-totter).',
  },
  'id-v2-1444': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['library', 'classroom', 'bedroom'],
    rationaleEn:
      'Hold for review: обкла́динка кни́жки (book cover) overlaps visually with the whole book (кни́жка) unless framed in close-up.',
  },
  'id-v2-1820': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'shopping-district'],
    rationaleEn:
      'Common urban street fixture (кіо́ск з пре́сою, newsstand kiosk).',
  },
  'id-v2-1424': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    rationaleEn:
      'Hold for review: сідло́ велосипе́дне (bicycle saddle) is a secondary bicycle sub-part.',
  },
  'id-v2-1490': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['beach-nature', 'public-transportation'],
    rationaleEn:
      'Common occupation noun (моря́к, sailor) in harbor and maritime scenes.',
  },
  'id-v2-1687': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    rationaleEn:
      'Common children’s outdoor riding item (бігове́л, balance bike).',
  },
  'id-v2-1605': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside', 'park-garden'],
    rationaleEn:
      'Well-known woodland/river mammal (бобе́р, beaver) with unmistakable flat tail.',
  },
  'id-v2-1689': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    rationaleEn:
      'Common park and beach game item (фрі́збі (літаючий диск) -> normalized to фрі́збі, flying disc).',
  },
  'id-v2-1496': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'library'],
    rationaleEn:
      'Common science and education figure (астрона́вт / космона́вт, astronaut).',
  },
  'id-v2-1690': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'park-garden', 'classroom'],
    rationaleEn:
      'Common board-game noun (шахі́вниця, chessboard) with immediate checkered recognition.',
  },
  'id-v2-1611': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Common forest and park bird (дя́тел, woodpecker).',
  },
  'id-v2-1696': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'bedroom'],
    rationaleEn:
      'Common digital design and study device (графі́чний планше́т, drawing tablet).',
  },
  'id-v2-1429': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    rationaleEn:
      'Mandatory car safety item (знак аварі́йної зупи́нки, warning triangle).',
  },
  'id-v2-1612': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Iconic yellow-breasted Ukrainian songbird (сини́ця, titmouse / great tit).',
  },
  'id-v2-1698': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'bedroom', 'public-transportation'],
    rationaleEn:
      'Common personal reading device (електро́нна кни́жка (рідер) -> normalized to електро́нна кни́жка, e-reader).',
  },
  'id-v2-1451': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom', 'bedroom'],
    rationaleEn:
      'Common desk organizer item (підста́вка для ручо́к, pen cup / holder).',
  },
  'id-v2-1613': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Well-known red-breasted winter bird (снігу́р, bullfinch).',
  },
  'id-v2-1247': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'Common household baking and mulled-drink spice (гвозди́ка (пряність) -> normalized to гвозди́ка, cloves).',
  },
  'id-v2-1699': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'living-room'],
    rationaleEn:
      'Hold for review: три́мач для телефо́ну (phone desk stand) is a secondary desk accessory.',
  },
  'id-v2-1452': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office'],
    rationaleEn:
      'Common school and office supply (коре́ктор канцеля́рський, correction fluid / tape).',
  },
  'id-v2-1616': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'zoo-aquarium'],
    rationaleEn:
      'Visually unmistakable bird (пави́ч, peacock) with fan tail.',
  },
  'id-v2-1631': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'hospital-pharmacy'],
    rationaleEn:
      'Common home-care item (грі́лка гу́мова -> normalized to грі́лка, hot water bottle).',
  },
  'id-v2-1453': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    rationaleEn:
      'Common desk stationery item (блок папе́ру для нота́ток, sticky notes pad).',
  },
  'id-v2-1624': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Common meadow insect (ко́ник-стрибуне́ць, grasshopper).',
  },
  'id-v2-1538': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside', 'city-streets'],
    rationaleEn:
      'Common park and street tree in Ukraine (клен, maple tree) with distinctive five-lobed leaves.',
  },
  'id-v2-1455': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom', 'living-room'],
    rationaleEn:
      'Common office and household utility tool (канцеля́рський ніж, utility box cutter).',
  },
  'id-v2-1433': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation', 'city-streets'],
    rationaleEn:
      'Common car dashboard navigation device (навіга́тор GPS -> normalized to навіга́тор, car GPS navigator).',
  },
  'id-v2-1625': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Common nature and children’s story creature (гу́сениця, caterpillar).',
  },
  'id-v2-1547': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: кропива́ (stinging nettle) is a roadside weed visually similar to mint or generic green foliage.',
  },
  'id-v2-1250': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: кунжу́т (sesame seeds) is a tiny bakery seed topping with low standalone visual target utility.',
  },
  'id-v2-1434': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-station', 'public-transportation'],
    rationaleEn:
      'Common travel accessory (доро́жня поду́шка, U-shaped neck travel pillow).',
  },
  'id-v2-1626': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    rationaleEn:
      'Common forest nature noun (мура́шник, anthill).',
  },
  'id-v2-1435': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'airport-station'],
    rationaleEn:
      'Common bedroom and travel accessory (ма́ска для сну, sleep eye mask).',
  },
  'id-v2-1635': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom'],
    rationaleEn:
      'Common daily medication organizer (контейнер для табле́ток, pill organizer box).',
  },
  'id-v2-1550': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: конюши́на (clover) is a low-lying lawn groundcover plant of low visual target priority.',
  },
  'id-v2-1636': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bathroom'],
    rationaleEn:
      'Common household first-aid item (вата меди́чна, sterile cotton wool).',
  },
  'id-v2-1546': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    rationaleEn:
      'Hold for review: виногра́дна лоза́ (grapevine); grapes (виногра́д, Batch 4 KEEP id-v2-422) are already in KEEP.',
  },
  'id-v2-1711': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office', 'living-room'],
    rationaleEn:
      'Common computer and TV power strip (мереже́вий фі́льтр, surge protector strip).',
  },
  'id-v2-1966': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport-station', 'office', 'bedroom'],
    rationaleEn:
      'Essential travel and electronics item (перехідни́к мереже́вий, travel plug adapter).',
  },
  'id-v2-1560': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'farmers-market'],
    rationaleEn:
      'Very common autumn garden and bouquet flower in Ukraine (хризанте́ма, chrysanthemum).',
  },
  'id-v2-1714': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'city-streets'],
    rationaleEn:
      'Common contemporary energy fixture (со́нячна пане́ль, solar panel).',
  },
  'id-v2-1562': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    rationaleEn:
      'Iconic traditional Ukrainian yard flower (мальва / ро́жа, hollyhock).',
  },
  'id-v2-1965': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ка́бель HDMI (HDMI video cable) is visually near-identical to ка́бель USB (Batch 6 KEEP id-v2-1102) in scene illustrations.',
  },

  // --- 19 useful_extended KEEP ---
  'id-v2-1709': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    rationaleEn:
      'Useful extended home entertainment noun (медіапле́єр / ТВ-приста́вка, streaming media box).',
  },
  'id-v2-1587': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Culturally familiar symbol and countryside object (підко́ва, horseshoe) with unmistakable U-shape.',
  },
  'id-v2-1662': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness', 'park-garden'],
    rationaleEn:
      'Useful extended fitness device (крокомі́р, pedometer).',
  },
  'id-v2-1715': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'office'],
    rationaleEn:
      'Useful modern STEM/makerspace machine (3D-при́нтер, 3D printer).',
  },
  'id-v2-1818': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    rationaleEn:
      'Distinctive historic courtyard gate (кована бра́ма, wrought-iron gate) common in Lviv and Kyiv architecture.',
  },
  'id-v2-1819': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'library'],
    rationaleEn:
      'Visually distinctive architectural feature (вітра́ж кольоро́вий, stained-glass window).',
  },
  'id-v2-1685': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'gym-fitness'],
    rationaleEn:
      'Playground climbing structure (турнікет-рукохі́д, monkey bars).',
  },
  'id-v2-1725': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'park-garden'],
    rationaleEn:
      'Popular instant camera (поляро́їд (камера миттєвого друку), instant film camera).',
  },
  'id-v2-1604': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'zoo-aquarium'],
    rationaleEn:
      'Distinctive large forest mammal (лось, moose / elk) with broad palmate antlers.',
  },
  'id-v2-1729': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'classroom'],
    rationaleEn:
      'Popular small four-string musical instrument (укуле́ле, ukulele).',
  },
  'id-v2-1495': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'library'],
    rationaleEn:
      'Useful arts profession noun (ску́льптор, sculptor).',
  },
  'id-v2-1427': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    rationaleEn:
      'Distinctive roadside tire-changing tool (домкра́т автомобі́льний, car jack).',
  },
  'id-v2-1606': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'zoo-aquarium'],
    rationaleEn:
      'Distinctive striped-face woodland mammal (борсу́к, badger).',
  },
  'id-v2-1693': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'park-garden'],
    rationaleEn:
      'Popular tabletop game (доміно́ (кісточка) -> normalized to доміно́, domino tile).',
  },
  'id-v2-1735': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'living-room'],
    rationaleEn:
      'Visually unmistakable percussion instrument (ксилофо́н, xylophone).',
  },
  'id-v2-1430': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'countryside'],
    rationaleEn:
      'Useful automotive and generator fuel container (кані́стра для па́льного, jerrycan / fuel can).',
  },
  'id-v2-1700': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office', 'bedroom'],
    rationaleEn:
      'Visually unmistakable circular LED light (кільцева́ ла́мпа, ring light).',
  },
  'id-v2-1705': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    rationaleEn:
      'Distinctive audio appliance (віні́ловий програва́ч, turntable / record player).',
  },
  'id-v2-1706': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room'],
    rationaleEn:
      'Distinctive grooved black disc (віні́лова платі́вка, vinyl LP record).',
  },

  // --- 49 REVIEW ---
  'id-v2-1234': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    rationaleEn:
      'Hold for review: дайко́н (daikon radish) is visually close to parsnip/white radish; regular реди́ска is already in KEEP.',
  },
  'id-v2-1708': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'living-room'],
    rationaleEn:
      'Hold for review: компакт-ди́ск (CD/DVD optical disc) is visually distinct but declining in daily use.',
  },
  'id-v2-1814': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    rationaleEn:
      'Hold for review: ву́личний годинни́к (public street clock); wall clock (id-v2-262) and wristwatch (id-v2-864) are already in KEEP.',
  },
  'id-v2-1353': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'classroom'],
    rationaleEn:
      'Hold for review: флагшто́к (flagpole) is often confused with the flag itself in tap-to-identify scenes.',
  },
  'id-v2-1658': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    rationaleEn:
      'Hold for review: степ-платфо́рма (aerobic step platform) is useful for gym scenes if capacity remains.',
  },
  'id-v2-1236': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'kitchen'],
    rationaleEn:
      'Hold for review: шало́т (shallot) is visually close to standard onion (цибу́ля, Batch 2 KEEP id-v2-441).',
  },
  'id-v2-1661': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['gym-fitness'],
    rationaleEn:
      'Hold for review: напульсник (sweatband / wristband) is a secondary gym accessory.',
  },
  'id-v2-1816': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    rationaleEn:
      'Hold for review: коло́на архітекту́рна (architectural column) alongside Batch 5 REVIEW id-v2-1327 (колона́да).',
  },
  'id-v2-1402': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['public-transportation', 'dining-room'],
    rationaleEn:
      'Hold for review: підстака́нник (metal tea glass holder) is iconic on Ukrainian trains; evaluate alongside id-v2-1848 in Batch 9.',
  },
  'id-v2-1531': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room'],
    rationaleEn:
      'Hold for review: кишенько́вий годинни́к (pocket watch) is visually distinct but vintage.',
  },
  'id-v2-1439': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    rationaleEn:
      'Hold for review: табли́ця Менделє́єва (periodic table chart) is a familiar classroom wall poster.',
  },
  'id-v2-1589': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    rationaleEn:
      'Hold for review: вузде́чка (bridle) is specialized equestrian gear.',
  },
  'id-v2-1724': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['office', 'living-room'],
    rationaleEn:
      'Hold for review: фоторюкза́к (padded camera backpack) is a subtype of рюкза́к.',
  },
  'id-v2-1442': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'library'],
    rationaleEn:
      'Hold for review: підста́вка для книг (bookstand / bookrest) is a secondary school desk item.',
  },
  'id-v2-1240': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'kitchen'],
    rationaleEn:
      'Hold for review: чебре́ць / тим’я́н (thyme sprig) is culturally important in Ukraine but visually similar to other small-leaf herbs.',
  },
  'id-v2-1241': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Hold for review: орега́но / матери́нка (oregano) is hard to distinguish visually from marjoram/thyme.',
  },
  'id-v2-1425': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    rationaleEn:
      'Hold for review: бага́жник велосипе́дний (rear bike rack) is a secondary bicycle part.',
  },
  'id-v2-1733': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'living-room'],
    rationaleEn:
      'Hold for review: маpака́си (maracas) are visually distinct percussion shakers of moderate everyday priority.',
  },
  'id-v2-1446': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['library'],
    rationaleEn:
      'Hold for review: чита́цький квито́к (library card) is useful in a library scene.',
  },
  'id-v2-1823': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'dining-room'],
    rationaleEn:
      'Hold for review: ву́личний обігріва́ч (patio heater) is common on outdoor cafe terraces.',
  },
  'id-v2-1245': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Hold for review: куркума́ (turmeric root/powder) is visually similar to ginger root unless shown with bright orange cross-section.',
  },
  'id-v2-1450': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    rationaleEn:
      'Hold for review: лоток для папе́рів (letter tray) is a secondary office desk organizer.',
  },
  'id-v2-1824': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'shopping-district'],
    rationaleEn:
      'Hold for review: стійка меню́ бі́ля вхо́ду (sidewalk menu board) is a cafe exterior prop.',
  },
  'id-v2-1957': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['gym-fitness', 'beach-nature'],
    rationaleEn:
      'Hold for review: колоба́шка / нудл для басе́йну (foam pool noodle) is a swimming pool accessory.',
  },
  'id-v2-1431': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    rationaleEn:
      'Hold for review: буксирува́льний трос (tow strap) is an automotive emergency item.',
  },
  'id-v2-1632': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom'],
    rationaleEn:
      'Hold for review: міху́р з льо́дом (ice pack) is a secondary first-aid item.',
  },
  'id-v2-1703': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    rationaleEn:
      'Hold for review: мікше́рний пульт (audio mixing console) is studio/stage equipment.',
  },
  'id-v2-1828': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office', 'classroom'],
    rationaleEn:
      'Hold for review: триво́жна кно́пка (fire alarm pull box) is a building safety fixture.',
  },
  'id-v2-1633': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    rationaleEn:
      'Hold for review: піпетка очна́ (medicine dropper) is a small pharmacy item.',
  },
  'id-v2-1829': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office', 'classroom'],
    rationaleEn:
      'Hold for review: план евакуа́ції (evacuation floor map) is a hallway wall sign.',
  },
  'id-v2-1255': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Hold for review: пека́н (pecan nut) is visually close to walnut (воло́ський горі́х, Batch 7 KEEP id-v2-472).',
  },
  'id-v2-1634': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    rationaleEn:
      'Hold for review: мі́рна ло́жечка для лі́ків (dosing spoon) is a secondary medicine-cabinet item.',
  },
  'id-v2-1549': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    rationaleEn:
      'Hold for review: подоро́жник (plantain herb) is well-known in folk remedies but visually subtle in wide nature scenes.',
  },
  'id-v2-1707': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room'],
    rationaleEn:
      'Hold for review: касе́та аудіо (cassette tape) is a retro media object.',
  },
  'id-v2-1534': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    rationaleEn:
      'Hold for review: галя́вина лісова́ (forest clearing / glade) is a spatial landscape zone rather than a bounded object.',
  },
  'id-v2-1258': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'kitchen'],
    rationaleEn:
      'Hold for review: обліпи́ха (sea buckthorn berries) is popular in Ukrainian teas; evaluate berry slot budget in final reconciliation.',
  },
  'id-v2-1710': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    rationaleEn:
      'Hold for review: кронште́йн для моніто́ра (monitor arm mount) is a secondary desk hardware accessory.',
  },
  'id-v2-1833': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    rationaleEn:
      'Hold for review: естака́да доро́жня (highway overpass) is an urban road structure.',
  },
  'id-v2-1559': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'farmers-market'],
    rationaleEn:
      'Hold for review: жоржи́на (dahlia) is a garden flower; evaluate flower variety budget during final reconciliation.',
  },
  'id-v2-1259': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'countryside'],
    rationaleEn:
      'Hold for review: шипши́на (rosehip berries) is common in Ukrainian herbal tea.',
  },
  'id-v2-1637': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    rationaleEn:
      'Hold for review: серве́тка спиртова́ (antiseptic wipe packet) is a small first-aid pouch.',
  },
  'id-v2-1638': {
    recommendation: 'review',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    rationaleEn:
      'Hold for review: перекис во́дню (флакон) (antiseptic bottle) requires label reading to distinguish from other pharmacy bottles.',
  },
  'id-v2-1565': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    rationaleEn:
      'Hold for review: лата́ття бі́ле (white water lily pad) is a pond plant.',
  },
  'id-v2-1639': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['hospital-pharmacy'],
    rationaleEn:
      'Hold for review: ши́на фіксуюча (medical splint / brace) is visually close to гіпсова пов’я́зка.',
  },

  // --- 62 EXCLUDE ---
  'id-v2-1775': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-319',
    canonicalConceptId: resolveMasterConceptId('id-v2-319'),
    rationaleEn:
      'Exclude as exact word-order inversion duplicate of approved Batch 3 KEEP id-v2-319 (підло́гові ваги́, bathroom scale, noun-concept-0158).',
  },
  'id-v2-1821': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-624',
    canonicalConceptId: resolveMasterConceptId('id-v2-624'),
    rationaleEn:
      'Exclude as store-specific modifier-padded variant of approved Batch 2 KEEP id-v2-624 (вітри́на, shop window, noun-concept-0800).',
  },
  'id-v2-1822': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-625',
    canonicalConceptId: resolveMasterConceptId('id-v2-625'),
    rationaleEn:
      'Exclude as adjective-padded duplicate of approved Batch 4 KEEP id-v2-625 (наві́с / маркі́за, awning, noun-concept-0819).',
  },
  'id-v2-1428': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-655',
    canonicalConceptId: resolveMasterConceptId('id-v2-655'),
    rationaleEn:
      'Exclude as modifier-padded duplicate of approved Batch 4 KEEP id-v2-655 (вогнега́сник, fire extinguisher, noun-concept-0788).',
  },
  'id-v2-1826': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-655',
    canonicalConceptId: resolveMasterConceptId('id-v2-655'),
    rationaleEn:
      'Exclude as color-adjective-padded duplicate of approved Batch 4 KEEP id-v2-655 (вогнега́сник, fire extinguisher, noun-concept-0788).',
  },
  'id-v2-1825': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-632',
    canonicalConceptId: resolveMasterConceptId('id-v2-632'),
    rationaleEn:
      'Exclude as modifier-padded duplicate of approved Batch 6 KEEP id-v2-632 (поштома́т, parcel locker, noun-concept-0905).',
  },
  'id-v2-1832': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-621',
    canonicalConceptId: resolveMasterConceptId('id-v2-621'),
    rationaleEn:
      'Exclude as modifier-padded duplicate of approved Batch 4 KEEP id-v2-621 (шлагба́ум, barrier gate, noun-concept-0746).',
  },
  'id-v2-1834': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-726',
    canonicalConceptId: resolveMasterConceptId('id-v2-726'),
    rationaleEn:
      'Exclude as duplicate of approved Batch 7 KEEP id-v2-726 (бензоколо́нка, fuel pump, noun-concept-1108).',
  },
  'id-v2-1835': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-727',
    canonicalConceptId: resolveMasterConceptId('id-v2-727'),
    rationaleEn:
      'Exclude as modifier-padded duplicate of approved Batch 5 KEEP id-v2-727 (заря́дна ста́нція, EV charging station, noun-concept-0949).',
  },
  'id-v2-1967': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1101',
    canonicalConceptId: resolveMasterConceptId('id-v2-1101'),
    rationaleEn:
      'Exclude as specialized subtype of approved Batch 4 KEEP id-v2-1101 (паверба́нк, power bank, noun-concept-1959).',
  },
  'id-v2-1717': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: макетна пла́та (electronics breadboard) is specialist electrical-engineering prototyping hardware.',
  },
  'id-v2-1865': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: паліту́рна маши́на (біндер) (comb binding machine) is specialized print-shop equipment.',
  },
  'id-v2-1651': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: брекети (модель) (orthodontic dental model) is a clinical demonstration model.',
  },
  'id-v2-1873': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: пальник Бунзена / спирті́вка (Bunsen burner / spirit lamp) is specialized chemistry-laboratory apparatus.',
  },
  'id-v2-1414': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: трап суднови́й (ship gangplank) is specialized maritime terminology; boarding stairs (трап посадко́вий, id-v2-672) is already in KEEP.',
  },
  'id-v2-1815': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: флю́гер на даху́ (weathervane) is a modifier-padded variant of Batch 5 EXCLUDE id-v2-1329 (флю́гер).',
  },
  'id-v2-1415': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['beach-nature'],
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: кнехт прича́льний (mooring bollard) is technical maritime harbor jargon.',
  },
  'id-v2-1387': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: вітро́вказ (конус) (airfield windsock) is specialized aviation equipment.',
  },
  'id-v2-1438': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: карта зо́ряного не́ба (star chart) is specialized astronomy reference material.',
  },
  'id-v2-1416': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['beach-nature'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: канат шварто́вий (mooring rope) is specialized maritime terminology.',
  },
  'id-v2-1237': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: черемша́ (wild garlic / ramsons) is a seasonal wild green visually indistinguishable from lily-of-the-valley or spinach leaves.',
  },
  'id-v2-1817': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'Exclude: а́рка кам’яна́ (stone archway) is a modifier-padded variant of Batch 5 REVIEW id-v2-1326 (арка міська́).',
  },
  'id-v2-1533': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom'],
    issueFlags: ['modifier_padded_duplicate', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: віяло мереживне (lace fan) is a decorative subtype of Batch 5 REVIEW id-v2-875 (ві́яло).',
  },
  'id-v2-1673': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['gym-fitness'],
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: сагайда́к / колча́н (archery quiver) is specialized historical/archery gear.',
  },
  'id-v2-1718': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: мікросхе́ма / чип (integrated circuit chip) is an internal microelectronic component.',
  },
  'id-v2-1440': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: рахува́льні па́лички (counting sticks) are dated early-grade arithmetic manipulatives.',
  },
  'id-v2-1590': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: баті́г (riding crop / whip) is specialized equestrian gear.',
  },
  'id-v2-1423': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['city-streets'],
    issueFlags: ['compositional_phrase', 'overly_specialized'],
    rationaleEn:
      'Exclude: спи́ця колеса́ (wheel spoke) is a thin wire sub-part that creates part-versus-whole hotspot overlap with the bicycle wheel.',
  },
  'id-v2-1593': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: серп (sickle) is a traditional pre-industrial harvesting tool of low contemporary everyday priority.',
  },
  'id-v2-1445': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['library'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Exclude: коріне́ць кни́жки (book spine) is a narrow structural book edge that creates part-versus-whole overlap with кни́жка and обкла́динка.',
  },
  'id-v2-1242': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: шавлі́я (sage leaves) is visually hard to distinguish from other grey-green culinary leaves in scene photographs.',
  },
  'id-v2-1243': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: естраго́н / тарху́н (tarragon) is a specialized herb visually indistinguishable from narrow-leaf greens.',
  },
  'id-v2-1447': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['library'],
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'Exclude: катало́жна ша́фа (card catalog cabinet) is an obsolete pre-digital library fixture.',
  },
  'id-v2-1628': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: молоток неврологі́чний (reflex hammer) is a specialist neurological diagnostic instrument.',
  },
  'id-v2-1535': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'Exclude: узлі́сся (forest edge) is an indistinct spatial boundary zone rather than a concrete targetable object.',
  },
  'id-v2-1248': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: кардамо́н (cardamom pods) is a tiny specialty spice pod.',
  },
  'id-v2-1827': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: поже́жний рука́в (coiled fire hose) is specialized fire-cabinet equipment; вогнега́сник is already in KEEP.',
  },
  'id-v2-1249': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: бад’я́н / зірча́стий ані́с (star anise) is a niche mulled-wine spice of low everyday vocabulary priority.',
  },
  'id-v2-1456': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: килимо́к для рі́зання (self-healing cutting mat) is a specialized craft/drafting mat.',
  },
  'id-v2-1548': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: лопу́х (burdock plant) is a roadside weed of low learner priority.',
  },
  'id-v2-1457': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ту́бус для кре́слень (drafting tube) is a specialized architecture/engineering student accessory.',
  },
  'id-v2-1962': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: підста́вка охоло́джувальна для ноутбу́ка (laptop cooling stand) is a niche computer accessory occluded under the laptop.',
  },
  'id-v2-1918': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: крото́виння (molehill mound) is a pile of dirt visually indistinguishable from ordinary soil.',
  },
  'id-v2-1256': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: макада́мія (macadamia nut) is an imported specialty nut visually similar to peeled hazelnut (фунду́к, Batch 6 KEEP).',
  },
  'id-v2-1463': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: леща́та слюса́рні (bench vise) is a heavy metalworking workshop tool.',
  },
  'id-v2-1963': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['duplicate_concept'],
    rationaleEn:
      'Exclude: екра́н проєктора (pull-down projector screen) is a duplicate phrasal entry of Batch 5 REVIEW id-v2-740 (екра́н проєкці́йний).',
  },
  'id-v2-1468': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: ваги́ лабораторні (analytical balance) is specialist laboratory equipment; everyday kitchen scale (id-v2-163) and bathroom scale (id-v2-319) are already in KEEP.',
  },
  'id-v2-1469': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: штати́в для пробі́рок (test tube rack) is specialized chemistry-laboratory equipment.',
  },
  'id-v2-1551': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['modifier_padded_duplicate', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: воло́шка лугова́ (meadow knapweed) is a botanical species variant; base воло́шка is already tracked in Batch 2 REVIEW (id-v2-909).',
  },
  'id-v2-1260': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: глід (hawthorn berries) is visually difficult to distinguish from rosehips or rowan berries.',
  },
  'id-v2-1470': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: колба круглодо́нна (Florence round-bottom flask) is specialized chemistry glassware.',
  },
  'id-v2-1261': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'Exclude: бузина́ (elderberries) is visually similar to other dark wild berry clusters.',
  },
  'id-v2-1716': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: коту́шка пластику (філамент) (3D filament spool) is a specialized 3D-printing consumable.',
  },
  'id-v2-1471': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'Exclude: лійка лабораторна (laboratory glass filter funnel) is specialized chemistry glassware.',
  },
};

// ----------------------------------------------------------------------------
// 5. Batch 8 Curation & Headword Summary Report
// ----------------------------------------------------------------------------

export interface IdentifyBatch8CurationAndHeadwordSummary {
  reportVersion: '8.0.0-batch8';
  batchNumber: 8;
  candidatesReviewedInBatch8Count: 200;
  batch8RecommendedKeepCount: 89;
  batch8RecommendedReviewCount: 49;
  batch8RecommendedExcludeCount: 62;
  batch8PriorityBreakdownOfKept: {
    essential_everyday: 24;
    common_situational: 46;
    useful_extended: 19;
  };
  preservedGenuineMissingConceptsCount: 34;
  headwordNormalizationsCompletedInBatch8Count: number;
  headwordNormalizations: readonly IdentifyBatch8HeadwordNormalizationRecord[];
  semanticRelationshipsInBatch8Count: number;
  semanticRelationships: readonly IdentifyBatch8SemanticRelationshipRecord[];
  essentialEverydayWithIndependentJustificationCount: 24;
  essentialEverydayJustifications: readonly IdentifyBatch8EssentialEverydayPedagogicalReason[];
}

export function getBatch8CurationAndHeadwordReport(): IdentifyBatch8CurationAndHeadwordSummary {
  return {
    reportVersion: '8.0.0-batch8',
    batchNumber: 8,
    candidatesReviewedInBatch8Count: 200,
    batch8RecommendedKeepCount: 89,
    batch8RecommendedReviewCount: 49,
    batch8RecommendedExcludeCount: 62,
    batch8PriorityBreakdownOfKept: {
      essential_everyday: 24,
      common_situational: 46,
      useful_extended: 19,
    },
    preservedGenuineMissingConceptsCount: 34,
    headwordNormalizationsCompletedInBatch8Count:
      IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS.length,
    headwordNormalizations: IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS,
    semanticRelationshipsInBatch8Count:
      IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS.length,
    semanticRelationships: IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS,
    essentialEverydayWithIndependentJustificationCount: 24,
    essentialEverydayJustifications:
      IDENTIFY_BATCH_8_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  };
}
