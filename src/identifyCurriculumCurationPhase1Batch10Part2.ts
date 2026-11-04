// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 10 — PARTIAL STAGE 2 / 4
// (MANIFEST POSITIONS 51..100 OF 200 REMAINING LEGACY NOUNS)
// ============================================================================
// IMPORTANT STAGE BOUNDARY:
// - This file is clearly labeled BATCH 10 — PARTIAL STAGE 2 / 4.
// - It reviews ONLY manifest positions 51..100 from
//   `IDENTIFY_BATCH_10_FROZEN_MANIFEST` (`src/identifyCurriculumCurationPhase1Batch10Manifest.ts`).
// - It preserves `src/identifyCurriculumCurationPhase1Batch10Part1.ts` (Stage 1)
//   and its verified checkpoint (`9741262454a601d5c37f1662f4d75c0be7fe03f6083dcb3c68a7c91f0a35ba7f`)
//   completely untouched.
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

export const IDENTIFY_BATCH_10_STAGE_2_LABEL =
  'BATCH 10 — PARTIAL STAGE 2 / 4' as const;

export type ExplicitBatch10Stage2Assessment = ExplicitBatch4Assessment;
export type IdentifyBatch10Stage2SemanticRelationshipType =
  IdentifyBatch7SemanticRelationshipType;

export const IDENTIFY_BATCH_10_STAGE_2_MANIFEST_SLICE: readonly IdentifyBatch10ManifestEntry[] =
  IDENTIFY_BATCH_10_FROZEN_MANIFEST.slice(50, 100);

// ----------------------------------------------------------------------------
// 1. Batch 10 Stage 2 Semantic Duplicate & Relationship Records (Positions 51..100)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage2SemanticRelationshipRecord {
  batchNumber: 10;
  stageNumber: 2;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage2SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

interface RawBatch10Stage2SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  comparedBatchNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  relationshipType: IdentifyBatch10Stage2SemanticRelationshipType;
  candidateAction: 'exclude_from_1200' | 'keep_distinct_concept' | 'review';
  countsAsDuplicateConcept: boolean;
  canonicalResolutionNoteEn: string;
}

const RAW_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_SEEDS: readonly RawBatch10Stage2SemanticRelationshipSeed[] =
  [
    // === A. 11 CANONICAL DUPLICATE EXCLUSIONS (countsAsDuplicateConcept: true) ===
    {
      candidateVocabularyId: 'id-v2-1785',
      comparedVocabularyId: 'id-v2-1298',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'лава́ш тонкий (flatbread lavash, noun-concept-0605) is a modifier-padded duplicate of approved Batch 8 KEEP id-v2-1298 (лава́ш, flatbread (lavash), noun-concept-0742).',
    },
    {
      candidateVocabularyId: 'id-v2-1786',
      comparedVocabularyId: 'id-v2-503',
      comparedBatchNumber: 2,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'пампу́шка з часнико́м (garlic pampushka bun, noun-concept-0623) is a modifier-padded duplicate of approved Batch 2 KEEP id-v2-503 (па́мпушка, pampushka garlic bun, noun-concept-0595).',
    },
    {
      candidateVocabularyId: 'id-v2-1804',
      comparedVocabularyId: 'id-v2-1244',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'імби́р ко́рінь (ginger rhizome, noun-concept-0624) is a modifier-padded duplicate of approved Batch 8 KEEP id-v2-1244 (імби́р, ginger root, noun-concept-0627).',
    },
    {
      candidateVocabularyId: 'id-v2-1787',
      comparedVocabularyId: 'id-v2-500',
      comparedBatchNumber: 6,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'бублик з ма́ком (poppy-seed bublyk ring, noun-concept-0644) is a modifier-padded duplicate of approved Batch 6 KEEP id-v2-500 (бу́блик, bublyk / bagel, noun-concept-0538).',
    },
    {
      candidateVocabularyId: 'id-v2-1805',
      comparedVocabularyId: 'id-v2-1247',
      comparedBatchNumber: 8,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'гвозди́ка пря́ність (whole cloves, noun-concept-0645) is an unparenthesized duplicate of approved Batch 8 KEEP id-v2-1247 (гвозди́ка (пряність), cloves (spice), noun-concept-0464).',
    },
    {
      candidateVocabularyId: 'id-v2-1788',
      comparedVocabularyId: 'id-v2-1288',
      comparedBatchNumber: 10,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'сухарі́ панірува́льні (toasted breadcrumbs / rusk, noun-concept-0662) is an inverted-word-order duplicate of approved Batch 10 Stage 1 KEEP id-v2-1288 (панірува́льні сухарі́, breadcrumbs, noun-concept-0564).',
    },
    {
      candidateVocabularyId: 'id-v2-1789',
      comparedVocabularyId: 'id-v2-522',
      comparedBatchNumber: 6,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'вівся́ні пластівці́ (rolled oats, noun-concept-0679) shares the exact same master English gloss ("rolled oats") and intended visual meaning ("clearly visible rolled oats in coffeehouse, desserts & pastry counter") as approved Batch 6 KEEP id-v2-522 (вівся́нка, rolled oats, noun-concept-0615); excluded as a synonymous phrasal duplicate of the same teaching concept.',
    },
    {
      candidateVocabularyId: 'id-v2-1792',
      comparedVocabularyId: 'id-v2-467',
      comparedBatchNumber: 5,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'сочеви́ця черво́на (red lentils, noun-concept-0729) is a color-modified subtype duplicate of approved Batch 5 KEEP id-v2-467 (сочеви́ця, lentils, noun-concept-0593).',
    },
    {
      candidateVocabularyId: 'id-v2-1793',
      comparedVocabularyId: 'id-v2-468',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'нут (туре́цький горо́х) (chickpeas, noun-concept-0744) is a parenthetically glossed duplicate of approved Batch 5 KEEP id-v2-468 (нут, chickpeas, noun-concept-0612).',
    },
    {
      candidateVocabularyId: 'id-v2-1362',
      comparedVocabularyId: 'id-v2-223',
      comparedBatchNumber: 4,
      relationshipType: 'MORE_SPECIFIC_SUBTYPE',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'стела́ж торго́вий (store display gondola, noun-concept-0853) is a modifier-padded duplicate of approved Batch 4 KEEP id-v2-223 (стела́ж, shelving unit, noun-concept-0314).',
    },
    {
      candidateVocabularyId: 'id-v2-1969',
      comparedVocabularyId: 'id-v2-1478',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: true,
      canonicalResolutionNoteEn:
        'диктофо́н цифрови́й (handheld voice recorder, noun-concept-0866) is a modifier-padded duplicate of approved Batch 7 KEEP id-v2-1478 (диктофо́н, voice recorder, noun-concept-1239).',
    },

    // === B. 23 NON-DUPLICATE SEMANTIC COMPARISONS (countsAsDuplicateConcept: false) ===
    {
      candidateVocabularyId: 'id-v2-1803',
      comparedVocabularyId: 'id-v2-531',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'хрін ко́рінь (horseradish root, noun-concept-0606) is compared against Batch 3 EXCLUDE id-v2-531 (хрін, horseradish, noun-concept-0438); held in REVIEW as a culturally significant Ukrainian market/Easter root rather than linked to an EXCLUDE record.',
    },
    {
      candidateVocabularyId: 'id-v2-1291',
      comparedVocabularyId: 'id-v2-1289',
      comparedBatchNumber: 10,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кукуру́дзяна крупа́ (yellow cornmeal / polenta grits for banosh and mamalyha, noun-concept-0621) is a distinct grain product from approved Stage 1 KEEP id-v2-1289 (перло́ва крупа́, pearl barley, noun-concept-0585).',
    },
    {
      candidateVocabularyId: 'id-v2-1312',
      comparedVocabularyId: 'id-v2-1313',
      comparedBatchNumber: 10,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'review',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'бали́к копче́ний (cured smoked pork loin, noun-concept-0678) is a distinct deli charcuterie product compared to oven-baked spiced pork roast id-v2-1313 (бужени́на, Stage 2 KEEP); held in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1313',
      comparedVocabularyId: 'id-v2-546',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'бужени́на (baked spiced lean pork roast, noun-concept-0694) is a distinct traditional Ukrainian meat dish compared to cured white fatback id-v2-546 (са́ло, Batch 2 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1790',
      comparedVocabularyId: 'id-v2-522',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кукурудзя́ні пластівці́ (crunchy golden cornflakes breakfast cereal, noun-concept-0695; full two-word headword retained to avoid ambiguity with oat flakes) is a distinct everyday breakfast food from rolled oats id-v2-522 (вівся́нка, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1224',
      comparedVocabularyId: 'id-v2-445',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'брюссе́льська капу́ста (miniature green Brussels sprouts, noun-concept-0707) is a visually and botanically distinct vegetable variety from a full white cabbage head id-v2-445 (капу́ста білокача́нна, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1314',
      comparedVocabularyId: 'id-v2-547',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кров’я́нка (traditional Ukrainian dark buckwheat blood sausage ring, noun-concept-0711) is a culturally and visually distinct Ukrainian culinary specialty compared to general sausage id-v2-547 (ковбаса́, Batch 2 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1791',
      comparedVocabularyId: 'id-v2-524',
      comparedBatchNumber: 7,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'манна крупа́ (semolina groats, noun-concept-0712) is the formal two-word variant of Batch 7 REVIEW id-v2-524 (ма́нка, semolina, noun-concept-0653); excluded without setting duplicateOfVocabularyId so only the base headword ма́нка remains in REVIEW.',
    },
    {
      candidateVocabularyId: 'id-v2-1279',
      comparedVocabularyId: 'sm-cheese',
      comparedBatchNumber: 1,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пла́влений сир (foil-wrapped processed cheese triangle / block, noun-concept-0713) is a distinct everyday Ukrainian grocery and soup ingredient compared to general hard cheese sm-cheese (сир, Batch 1 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1225',
      comparedVocabularyId: 'id-v2-445',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'пекі́нська капу́ста (elongated ruffled Napa cabbage, noun-concept-0725) is a visually distinct everyday salad vegetable contrasted with round white cabbage head id-v2-445 (капу́ста білокача́нна, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1226',
      comparedVocabularyId: 'id-v2-445',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'червонокача́нна капу́ста (normalized to черво́на капу́ста, deep purple-red cabbage head, noun-concept-0740) is a visually distinct vegetable variety contrasted with white cabbage id-v2-445 (капу́ста білокача́нна, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1316',
      comparedVocabularyId: 'id-v2-568',
      comparedBatchNumber: 2,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'холодник / окро́шка (normalized to холодни́к, chilled summer beet/kefir soup with diced cucumber and egg, noun-concept-0743) is a distinct seasonal soup compared to hot red borscht id-v2-568 (борщ, Batch 2 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1968',
      comparedVocabularyId: 'id-v2-1374',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'радіоприйма́ч ре́тро (normalized to радіоприйма́ч, tabletop FM broadcast radio receiver, noun-concept-0854) is a core household appliance distinct from handheld two-way walkie-talkie id-v2-1374 (ра́ція портати́вна, Batch 6 REVIEW).',
    },
    {
      candidateVocabularyId: 'id-v2-1998',
      comparedVocabularyId: 'id-v2-362',
      comparedBatchNumber: 3,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'різе́ць по де́реву (стаме́ска) (woodcarving gouge chisel, noun-concept-0855) overlaps with Batch 3 EXCLUDE id-v2-362 (стаме́ска, wood chisel, noun-concept-0178); excluded on specialist woodworking grounds without counting as a duplicate of a KEEP item.',
    },
    {
      candidateVocabularyId: 'id-v2-1331',
      comparedVocabularyId: 'id-v2-374',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'поже́жна драби́на (exterior building fire escape ladder, noun-concept-0863) is a fixed architectural safety feature on urban facades, distinct from a portable household stepladder id-v2-374 (драби́на, Batch 6 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1999',
      comparedVocabularyId: 'id-v2-360',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'лобзик ручни́й для фане́ри (manual coping fret saw, noun-concept-0867) is compared against Batch 3 EXCLUDE id-v2-360 (електроло́бзик, electric jigsaw, noun-concept-0140); excluded as a specialist craft tool.',
    },
    {
      candidateVocabularyId: 'id-v2-1332',
      comparedVocabularyId: 'id-v2-323',
      comparedBatchNumber: 3,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'водості́чна труба́ (vertical building downspout pipe, noun-concept-0878) is kept as a visually prominent street-level facade element compared to roof-edge horizontal rain gutter id-v2-323 (ринва, Batch 3 REVIEW).',
    },
    {
      candidateVocabularyId: 'id-v2-1364',
      comparedVocabularyId: 'id-v2-163',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ваги́ торгове́льні (normalized to торгове́льні ваги́, supermarket/market commercial produce scale with pole display, noun-concept-0880) is a distinct retail fixture compared to small home countertop kitchen scale id-v2-163 (кухо́нні ваги́, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1970',
      comparedVocabularyId: 'id-v2-1134',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'ка́мертон на резона́торному я́щику (mounted acoustic tuning fork, noun-concept-0881) is a physics-lab variant of Batch 5 EXCLUDE id-v2-1134 (камерто́н, tuning fork, noun-concept-1903); excluded on specialist grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1971',
      comparedVocabularyId: 'id-v2-1122',
      comparedBatchNumber: 5,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'підборі́дник скри́пки (violin chinrest, noun-concept-0891) is a specialist sub-part of approved Batch 5 KEEP id-v2-1122 (скри́пка, violin, noun-concept-1901) rather than a standalone everyday concept; excluded on specialist part-whole grounds.',
    },
    {
      candidateVocabularyId: 'id-v2-1334',
      comparedVocabularyId: 'id-v2-614',
      comparedBatchNumber: 7,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'keep_distinct_concept',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'вказівни́к напря́мку (normalized to вказівни́к, directional wayfinding signpost with place names/arrows, noun-concept-0897) is a distinct navigation object from regulatory vehicle traffic sign id-v2-614 (доро́жній знак, Batch 7 KEEP).',
    },
    {
      candidateVocabularyId: 'id-v2-1927',
      comparedVocabularyId: 'id-v2-1329',
      comparedBatchNumber: 5,
      relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'флю́гер на стодо́лі (barn roof weathervane, noun-concept-0899) is a locative-modified variant of Batch 5 EXCLUDE id-v2-1329 (флю́гер, weathervane, noun-concept-0838); excluded consistently without counting as a duplicate of a KEEP entry.',
    },
    {
      candidateVocabularyId: 'id-v2-1973',
      comparedVocabularyId: 'id-v2-1119',
      comparedBatchNumber: 6,
      relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
      candidateAction: 'exclude_from_1200',
      countsAsDuplicateConcept: false,
      canonicalResolutionNoteEn:
        'кілки́ скри́пкові / гіта́рні (instrument tuning pegs, noun-concept-0911) is a specialist instrument hardware sub-part compared to approved Batch 6 KEEP id-v2-1119 (гіта́ра акусти́чна, acoustic guitar, noun-concept-1963); excluded on specialist part-whole grounds.',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch10Stage2SemanticRelationshipRecord[] =
  RAW_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_SEEDS.map((seed) => {
    const candidateMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.candidateVocabularyId
    );
    const comparedMaster: IdentifyMasterNounEntry = resolveMasterNounById(
      seed.comparedVocabularyId
    );
    return {
      batchNumber: 10,
      stageNumber: 2,
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
// 2. Batch 10 Stage 2 Learner Headword Normalizations (Non-Destructive Layer)
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage2HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 10;
  stageNumber: 2;
  normalizationReasonEn: string;
}

interface RawBatch10Stage2HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  normalizationReasonEn: string;
}

const RAW_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_SEEDS: readonly RawBatch10Stage2HeadwordNormalizationSeed[] =
  [
    {
      vocabularyId: 'id-v2-1309',
      preferredLearnerHeadwordUk: 'мармела́д',
      acceptedConversationalSynonymsUk: [
        'мармела́д фрукто́вий',
        'фрукто́вий мармела́д',
      ],
      normalizationReasonEn:
        'Strips redundant modifier фрукто́вий so learners practice natural everyday sweet noun мармела́д (fruit jelly candy).',
    },
    {
      vocabularyId: 'id-v2-1311',
      preferredLearnerHeadwordUk: 'пастила́',
      acceptedConversationalSynonymsUk: [
        'пастила́ я́блучна',
        'я́блучна пастила́',
        'фрукто́ва пастила́',
      ],
      normalizationReasonEn:
        'Normalizes пастила́ я́блучна to concise single-word confectionery noun пастила́ (fruit leather / pastila).',
    },
    {
      vocabularyId: 'id-v2-1296',
      preferredLearnerHeadwordUk: 'лаза́нья',
      acceptedConversationalSynonymsUk: [
        'листи́ для лаза́ньї',
        'лаза́нья (листи)',
      ],
      normalizationReasonEn:
        'Strips parenthetical packaging note (листи) so learners practice natural culinary noun лаза́нья.',
    },
    {
      vocabularyId: 'id-v2-1315',
      preferredLearnerHeadwordUk: 'паште́т',
      acceptedConversationalSynonymsUk: [
        'паште́т печінко́вий',
        'печінко́вий паште́т',
      ],
      normalizationReasonEn:
        'Normalizes inverted catalog phrase паште́т печінко́вий to concise everyday food noun паште́т (pâté).',
    },
    {
      vocabularyId: 'id-v2-1226',
      preferredLearnerHeadwordUk: 'черво́на капу́ста',
      acceptedConversationalSynonymsUk: [
        'червонокача́нна капу́ста',
        'си́ня капу́ста',
      ],
      normalizationReasonEn:
        'Normalizes formal agronomic term червонокача́нна капу́ста to natural conversational черво́на капу́ста (and regional си́ня капу́ста).',
    },
    {
      vocabularyId: 'id-v2-1316',
      preferredLearnerHeadwordUk: 'холодни́к',
      acceptedConversationalSynonymsUk: [
        'окро́шка',
        'холодник / окро́шка',
        'холо́дний борщ',
      ],
      normalizationReasonEn:
        'Resolves slash-compound холодник / окро́шка to traditional Ukrainian headword холодни́к while accepting окро́шка.',
    },
    {
      vocabularyId: 'id-v2-1968',
      preferredLearnerHeadwordUk: 'радіоприйма́ч',
      acceptedConversationalSynonymsUk: ['ра́діо', 'радіоприйма́ч ре́тро'],
      normalizationReasonEn:
        'Strips stylistic adjective ре́тро from радіоприйма́ч ре́тро and accepts conversational ра́діо.',
    },
    {
      vocabularyId: 'id-v2-1364',
      preferredLearnerHeadwordUk: 'торгове́льні ваги́',
      acceptedConversationalSynonymsUk: [
        'ваги́ торгове́льні',
        'ваги́',
        'ри́нкові ваги́',
      ],
      normalizationReasonEn:
        'Reorders inverted catalog phrase ваги́ торгове́льні to natural Ukrainian adjective-noun order торгове́льні ваги́.',
    },
    {
      vocabularyId: 'id-v2-1334',
      preferredLearnerHeadwordUk: 'вказівни́к',
      acceptedConversationalSynonymsUk: [
        'вказівни́к напря́мку',
        'доро́жній вказівни́к',
      ],
      normalizationReasonEn:
        'Strips redundant genitive complement напря́мку so learners practice natural single-word noun вказівни́к (signpost).',
    },
    {
      vocabularyId: 'id-v2-1351',
      preferredLearnerHeadwordUk: 'сире́на',
      acceptedConversationalSynonymsUk: [
        'сире́на опові́щення',
        'ву́лична сире́на',
      ],
      normalizationReasonEn:
        'Normalizes сире́на опові́щення to high-frequency single-word noun сире́на (warning siren).',
    },
    {
      vocabularyId: 'id-v2-1929',
      preferredLearnerHeadwordUk: 'дощува́ч',
      acceptedConversationalSynonymsUk: [
        'дощува́ч газо́нний',
        'газо́нний дощува́ч',
        'розбри́зкувач',
      ],
      normalizationReasonEn:
        'Normalizes inverted phrase дощува́ч газо́нний to concise single-word noun дощува́ч (lawn sprinkler).',
    },
  ];

export const IDENTIFY_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch10Stage2HeadwordNormalizationRecord[] =
  RAW_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_SEEDS.map((seed) => {
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
      stageNumber: 2,
      normalizationReasonEn: seed.normalizationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 3. Independent Pedagogical Justifications for Stage 2 essential_everyday KEEP
// ----------------------------------------------------------------------------

export interface IdentifyBatch10Stage2EssentialEverydayReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  stageNumber: 2;
  independentPedagogicalJustificationEn: string;
}

const RAW_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS: ReadonlyArray<{
  vocabularyId: string;
  independentPedagogicalJustificationEn: string;
}> = [
  {
    vocabularyId: 'id-v2-1790',
    independentPedagogicalJustificationEn:
      'кукурудзя́ні пластівці́ (cornflakes cereal, retaining the full natural adjective-noun headword to distinguish cornflakes from rolled oat flakes) is a core, high-frequency everyday breakfast and supermarket grocery noun in contemporary Ukrainian households.',
  },
  {
    vocabularyId: 'id-v2-1334',
    independentPedagogicalJustificationEn:
      'вказівни́к напря́мку (normalized to вказівни́к, directional signpost) is an indispensable urban navigation, pedestrian wayfinding, and transit-station noun across Ukrainian cities.',
  },
];

export const IDENTIFY_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS: readonly IdentifyBatch10Stage2EssentialEverydayReason[] =
  RAW_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS.map((item) => {
    const master = resolveMasterNounById(item.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      stageNumber: 2,
      independentPedagogicalJustificationEn:
        item.independentPedagogicalJustificationEn,
    };
  });

// ----------------------------------------------------------------------------
// 4. Explicit Batch 10 Stage 2 Assessments (Manifest Positions 51..100 Only)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_10_STAGE_2_ASSESSMENTS: Readonly<
  Record<string, ExplicitBatch10Stage2Assessment>
> = {
  // Position 51: id-v2-1308 (козина́ки — nut or seed brittle)
  'id-v2-1308': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen', 'market'],
    rationaleEn:
      'Keep (common_situational): козина́ки (sunflower-seed or nut brittle bar) is an iconic, widely consumed everyday sweet in Ukrainian grocery stores and markets.',
  },
  // Position 52: id-v2-1785 (лава́ш тонкий — flatbread lavash)
  'id-v2-1785': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['bakery', 'kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1298',
    canonicalConceptId: resolveMasterConceptId('id-v2-1298'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1298 (лава́ш, flatbread lavash, noun-concept-0742).',
  },
  // Position 53: id-v2-1803 (хрін ко́рінь — horseradish root)
  'id-v2-1803': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'kitchen'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: хрін ко́рінь (horseradish root) is a culturally traditional Ukrainian culinary and Easter market root, held in REVIEW because pale unpeeled roots require market context to distinguish from parsnip.',
  },
  // Position 54: id-v2-1291 (кукуру́дзяна крупа́ — cornmeal / polenta grits)
  'id-v2-1291': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'market'],
    rationaleEn:
      'Keep (common_situational): кукуру́дзяна крупа́ (bright yellow cornmeal / grits) is a staple Ukrainian pantry grain essential for Carpathian banosh and mamalyha.',
  },
  // Position 55: id-v2-1309 (мармела́д фрукто́вий — fruit jelly candy)
  'id-v2-1309': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): мармела́д фрукто́вий (normalized to мармела́д, fruit jelly candy) is a ubiquitous Ukrainian tea-time confection.',
  },
  // Position 56: id-v2-1786 (пампу́шка з часнико́м — garlic pampushka bun)
  'id-v2-1786': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'restaurant', 'kitchen'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-503',
    canonicalConceptId: resolveMasterConceptId('id-v2-503'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 2 KEEP id-v2-503 (па́мпушка, pampushka garlic bun, noun-concept-0595).',
  },
  // Position 57: id-v2-1804 (імби́р ко́рінь — ginger rhizome)
  'id-v2-1804': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'market', 'kitchen'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1244',
    canonicalConceptId: resolveMasterConceptId('id-v2-1244'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1244 (імби́р, ginger root, noun-concept-0627).',
  },
  // Position 58: id-v2-1292 (кус-ку́с — couscous)
  'id-v2-1292': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Hold for review: кус-ку́с (couscous) is a common grain in contemporary Ukrainian supermarkets, held in REVIEW because fine yellow granules require labeled packaging to distinguish from millet or corn grits.',
  },
  // Position 59: id-v2-1787 (бублик з ма́ком — poppy-seed bublyk ring)
  'id-v2-1787': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['bakery', 'cafe', 'kitchen'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-500',
    canonicalConceptId: resolveMasterConceptId('id-v2-500'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-500 (бу́блик, bublyk / bagel, noun-concept-0538).',
  },
  // Position 60: id-v2-1805 (гвозди́ка пря́ність — whole cloves)
  'id-v2-1805': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'market'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1247',
    canonicalConceptId: resolveMasterConceptId('id-v2-1247'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 8 KEEP id-v2-1247 (гвозди́ка (пряність), cloves spice, noun-concept-0464).',
  },
  // Position 61: id-v2-1257 (брази́льський горі́х — Brazil nut)
  'id-v2-1257': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['obscure_or_rare', 'compositional_phrase'],
    rationaleEn:
      'Exclude: брази́льський горі́х (Brazil nut) is a low-frequency imported nut variety with low pedagogical priority compared to core everyday nuts.',
  },
  // Position 62: id-v2-1293 (булгу́р — bulgur wheat)
  'id-v2-1293': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): булгу́р (bulgur wheat) is a staple everyday side-dish grain in contemporary Ukrainian kitchens and supermarkets.',
  },
  // Position 63: id-v2-1311 (пастила́ я́блучна — fruit leather roll)
  'id-v2-1311': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['market', 'supermarket', 'cafe'],
    rationaleEn:
      'Keep (common_situational): пастила́ я́блучна (normalized to пастила́, apple fruit leather roll) is a very popular natural fruit snack in Ukrainian markets, cafés, and grocery stores.',
  },
  // Position 64: id-v2-1788 (сухарі́ панірува́льні — toasted breadcrumbs / rusk)
  'id-v2-1788': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1288',
    canonicalConceptId: resolveMasterConceptId('id-v2-1288'),
    rationaleEn:
      'Exclude as inverted-word-order canonical duplicate of approved Batch 10 Stage 1 KEEP id-v2-1288 (панірува́льні сухарі́, breadcrumbs, noun-concept-0564).',
  },
  // Position 65: id-v2-1294 (кіно́а — quinoa grains)
  'id-v2-1294': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Hold for review: кіно́а (quinoa grains) is a familiar modern supermarket grain, held in REVIEW because small round seeds require package or bowl context.',
  },
  // Position 66: id-v2-1312 (бали́к копче́ний — smoked pork loin)
  'id-v2-1312': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'dining_room'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Hold for review: бали́к копче́ний (smoked cured pork loin) is a distinct Ukrainian deli cut compared to baked бужени́на, held in REVIEW as an extended charcuterie noun.',
  },
  // Position 67: id-v2-1789 (вівся́ні пластівці́ — rolled oats)
  'id-v2-1789': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-522',
    canonicalConceptId: resolveMasterConceptId('id-v2-522'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 6 KEEP id-v2-522 (вівся́нка, rolled oats, noun-concept-0615), which shares the exact same master gloss ("rolled oats") and intended visual meaning.',
  },
  // Position 68: id-v2-1313 (бужени́на — baked spiced pork roast)
  'id-v2-1313': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'kitchen', 'restaurant'],
    rationaleEn:
      'Keep (common_situational): бужени́на (baked garlic-and-spice pork roast) is a signature traditional Ukrainian meat dish.',
  },
  // Position 69: id-v2-1790 (кукурудзя́ні пластівці́ — cornflakes cereal)
  'id-v2-1790': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    rationaleEn:
      'Keep (essential_everyday): кукурудзя́ні пластівці́ (cornflakes breakfast cereal; full natural two-word headword retained to avoid ambiguity with oat flakes) is a foundational everyday breakfast noun distinct from rolled oats (вівся́нка).',
  },
  // Position 70: id-v2-1224 (брюссе́льська капу́ста — Brussels sprouts)
  'id-v2-1224': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'market', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): брюссе́льська капу́ста (Brussels sprouts) is a visually unmistakable vegetable variety sold in Ukrainian supermarkets.',
  },
  // Position 71: id-v2-1296 (лаза́нья (листи) — lasagna sheets)
  'id-v2-1296': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'restaurant'],
    rationaleEn:
      'Keep (common_situational): лаза́нья (листи) (normalized to лаза́нья, lasagna pasta sheets / dish) is a common culinary and grocery noun in Ukraine.',
  },
  // Position 72: id-v2-1314 (кров’я́нка — buckwheat blood sausage)
  'id-v2-1314': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['market', 'dining_room', 'restaurant'],
    rationaleEn:
      'Keep (common_situational): кров’я́нка (traditional Ukrainian dark buckwheat sausage ring) is an iconic, culturally authentic Ukrainian market and restaurant food.',
  },
  // Position 73: id-v2-1791 (манна крупа́ — semolina groats)
  'id-v2-1791': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['compositional_phrase'],
    rationaleEn:
      'Exclude: манна крупа́ (semolina groats) is the formal two-word variant of Batch 7 REVIEW id-v2-524 (ма́нка, semolina) and is visually ambiguous white powder without packaging.',
  },
  // Position 74: id-v2-1279 (пла́влений сир — processed cheese triangle)
  'id-v2-1279': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): пла́влений сир (foil-wrapped processed cheese triangle) is a ubiquitous everyday Ukrainian grocery item distinct from hard block cheese.',
  },
  // Position 75: id-v2-1225 (пекі́нська капу́ста — Napa cabbage)
  'id-v2-1225': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'market', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): пекі́нська капу́ста (elongated ruffled Napa cabbage) is a staple year-round salad vegetable in Ukrainian supermarkets and kitchens.',
  },
  // Position 76: id-v2-1315 (паште́т печінко́вий — liver pâté)
  'id-v2-1315': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining_room', 'supermarket'],
    rationaleEn:
      'Keep (common_situational): паште́т печінко́вий (normalized to паште́т, liver pâté) is a high-frequency everyday Ukrainian breakfast and appetizer spread.',
  },
  // Position 77: id-v2-1792 (сочеви́ця черво́на — red lentils)
  'id-v2-1792': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-467',
    canonicalConceptId: resolveMasterConceptId('id-v2-467'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-467 (сочеви́ця, lentils, noun-concept-0593).',
  },
  // Position 78: id-v2-1226 (червонокача́нна капу́ста — red cabbage)
  'id-v2-1226': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['market', 'supermarket', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): червонокача́нна капу́ста (normalized to черво́на капу́ста, purple-red cabbage head) is a visually unmistakable everyday vegetable distinct from white cabbage.',
  },
  // Position 79: id-v2-1316 (холодник / окро́шка — chilled summer soup)
  'id-v2-1316': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining_room', 'restaurant', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): холодник / окро́шка (normalized to холодни́к, chilled summer soup) is a classic seasonal dish in Ukrainian home and restaurant dining.',
  },
  // Position 80: id-v2-1793 (нут (туре́цький горо́х) — chickpeas)
  'id-v2-1793': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-468',
    canonicalConceptId: resolveMasterConceptId('id-v2-468'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 5 KEEP id-v2-468 (нут, chickpeas, noun-concept-0612).',
  },
  // Position 81: id-v2-1346 (остріве́ць безпе́ки — pedestrian refuge island)
  'id-v2-1346': {
    recommendation: 'keep',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street'],
    rationaleEn:
      'Keep (useful_extended): остріве́ць безпе́ки (pedestrian refuge island at a crosswalk) is a clear, recognizable modern urban traffic-safety feature on Ukrainian city avenues.',
  },
  // Position 82: id-v2-1362 (стела́ж торго́вий — store display gondola)
  'id-v2-1362': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-223',
    canonicalConceptId: resolveMasterConceptId('id-v2-223'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 4 KEEP id-v2-223 (стела́ж, shelving unit, noun-concept-0314).',
  },
  // Position 83: id-v2-1968 (радіоприйма́ч ре́тро — tabletop FM radio receiver)
  'id-v2-1968': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living_room', 'kitchen'],
    rationaleEn:
      'Keep (common_situational): радіоприйма́ч ре́тро (normalized to радіоприйма́ч, tabletop FM radio receiver) is a core household media appliance not yet represented by any prior KEEP entry.',
  },
  // Position 84: id-v2-1998 (різе́ць по де́реву (стаме́ска) — woodcarving gouge chisel)
  'id-v2-1998': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['workshop'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: різе́ць по де́реву (стаме́ска) (woodcarving gouge chisel) is a specialist woodworking tool matching Batch 3 EXCLUDE id-v2-362 (стаме́ска).',
  },
  // Position 85: id-v2-1331 (поже́жна драби́на — fire escape ladder)
  'id-v2-1331': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'courtyard'],
    rationaleEn:
      'Keep (common_situational): поже́жна драби́на (exterior building fire escape ladder) is a visually distinct architectural element on urban facades, distinct from a portable stepladder.',
  },
  // Position 86: id-v2-1969 (диктофо́н цифрови́й — handheld voice recorder)
  'id-v2-1969': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-1478',
    canonicalConceptId: resolveMasterConceptId('id-v2-1478'),
    rationaleEn:
      'Exclude as canonical duplicate of approved Batch 7 KEEP id-v2-1478 (диктофо́н, voice recorder, noun-concept-1239).',
  },
  // Position 87: id-v2-1999 (лобзик ручни́й для фане́ри — coping fret saw)
  'id-v2-1999': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['workshop'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: лобзик ручни́й для фане́ри (coping fret saw) is a specialized craft woodworking saw with low everyday learner utility.',
  },
  // Position 88: id-v2-1332 (водості́чна труба́ — downspout pipe)
  'id-v2-1332': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'courtyard'],
    rationaleEn:
      'Keep (common_situational): водості́чна труба́ (vertical building downspout pipe) is a ubiquitous, visually unmistakable exterior feature on Ukrainian residential and street facades.',
  },
  // Position 89: id-v2-1364 (ваги́ торгове́льні — produce scale)
  'id-v2-1364': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'market'],
    rationaleEn:
      'Keep (common_situational): ваги́ торгове́льні (normalized to торгове́льні ваги́, supermarket/market produce scale) is a daily shopping fixture in Ukrainian supermarkets and farmers markets.',
  },
  // Position 90: id-v2-1970 (ка́мертон на резона́торному я́щику — mounted acoustic tuning fork)
  'id-v2-1970': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: ка́мертон на резона́торному я́щику (mounted acoustic tuning fork) is a physics-lab apparatus variant matching Batch 5 EXCLUDE id-v2-1134 (камерто́н).',
  },
  // Position 91: id-v2-2000 (випа́лювач по де́реву (піро́граф) — woodburning pyrography pen)
  'id-v2-2000': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['workshop'],
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: випа́лювач по де́реву (піро́граф) (woodburning pyrography pen) is a niche hobbyist craft tool with very low everyday vocabulary utility.',
  },
  // Position 92: id-v2-1971 (підборі́дник скри́пки — violin chinrest)
  'id-v2-1971': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: підборі́дник скри́пки (violin chinrest) is a specialist instrument sub-part rather than a standalone everyday learner concept.',
  },
  // Position 93: id-v2-1334 (вказівни́к напря́мку — directional signpost)
  'id-v2-1334': {
    recommendation: 'keep',
    recommendedPriority: 'essential_everyday',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'train_station', 'park'],
    rationaleEn:
      'Keep (essential_everyday): вказівни́к напря́мку (normalized to вказівни́к, directional signpost) is a foundational urban wayfinding noun distinct from regulatory road traffic signs.',
  },
  // Position 94: id-v2-1927 (флю́гер на стодо́лі — barn roof weathervane)
  'id-v2-1927': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    issueFlags: ['compositional_phrase', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: флю́гер на стодо́лі (barn roof weathervane) is a locative-modified variant of Batch 5 EXCLUDE id-v2-1329 (флю́гер).',
  },
  // Position 95: id-v2-1972 (каніфо́ль у коро́бочці — violin bow rosin cake)
  'id-v2-1972': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'Exclude: каніфо́ль у коро́бочці (violin bow rosin cake) is a specialist string-instrument accessory with poor visual recognizability.',
  },
  // Position 96: id-v2-1335 (інформаці́йний стенд — city map board)
  'id-v2-1335': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'park', 'train_station', 'classroom'],
    rationaleEn:
      'Keep (common_situational): інформаці́йний стенд (public information / city map board) is a common fixture in Ukrainian city centers, parks, schools, and transit hubs.',
  },
  // Position 97: id-v2-1351 (сире́на опові́щення — public warning siren)
  'id-v2-1351': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street'],
    rationaleEn:
      'Keep (common_situational): сире́на опові́щення (normalized to сире́на, public warning siren) is a high-salience contemporary Ukrainian urban and civic noun.',
  },
  // Position 98: id-v2-1973 (кілки́ скри́пкові / гіта́рні — tuning pegs)
  'id-v2-1973': {
    recommendation: 'exclude',
    recommendedPriority: 'none_exclude',
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    issueFlags: ['overly_specialized', 'compositional_phrase'],
    rationaleEn:
      'Exclude: кілки́ скри́пкові / гіта́рні (instrument tuning pegs) is a specialist hardware sub-part of string instruments.',
  },
  // Position 99: id-v2-1336 (афі́шна ту́мба — poster kiosk column)
  'id-v2-1336': {
    recommendation: 'review',
    recommendedPriority: 'useful_extended',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city_street', 'park'],
    rationaleEn:
      'Hold for review: афі́шна ту́мба (cylindrical street poster column) is a recognizable cultural street fixture in historic Ukrainian city centers such as Lviv, Kyiv, and Odesa.',
  },
  // Position 100: id-v2-1929 (дощува́ч газо́нний — oscillating lawn sprinkler)
  'id-v2-1929': {
    recommendation: 'keep',
    recommendedPriority: 'common_situational',
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park', 'countryside'],
    rationaleEn:
      'Keep (common_situational): дощува́ч газо́нний (normalized to дощува́ч, lawn sprinkler) is a clear, recognizable outdoor park and garden object.',
  },
};

// ----------------------------------------------------------------------------
// 5. Compact Stage 2 Partial Report Helper
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL =
  '007a7d741069582ec0a303bc4e48944f9f39aab01a70710cba6115d3342bfff5' as const;

export const IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX =
  '007a7d741069582e' as const;

export interface IdentifyBatch10Stage2PartialSummary {
  reportVersion: '10.2.0-batch10-stage2-partial';
  stageLabel: typeof IDENTIFY_BATCH_10_STAGE_2_LABEL;
  batchNumber: 10;
  stageNumber: 2;
  manifestPositionsCovered: readonly [51, 100];
  manifestSha256Full: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL;
  manifestSha256Prefix: typeof IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX;
  verifiedStage1DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL;
  verifiedStage1DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX;
  stage2DecisionSha256Full: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL;
  stage2DecisionSha256Prefix: typeof IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX;
  candidatesReviewedInStage2Count: 50;
  stage2RecommendedKeepCount: 24;
  stage2RecommendedReviewCount: 5;
  stage2RecommendedExcludeCount: 21;
  stage2PriorityBreakdownOfKept: {
    essential_everyday: 2;
    common_situational: 21;
    useful_extended: 1;
  };
  semanticRelationshipsInStage2Count: number;
  canonicalDuplicateRelationshipsInStage2Count: 11;
  nonDuplicateSemanticComparisonsInStage2Count: 23;
  headwordNormalizationsInStage2Count: 11;
  essentialEverydayJustificationsInStage2Count: 2;
  registeredInCumulativeApprovedStore: false;
}

export function getBatch10Stage2PartialReport(): IdentifyBatch10Stage2PartialSummary {
  return {
    reportVersion: '10.2.0-batch10-stage2-partial',
    stageLabel: IDENTIFY_BATCH_10_STAGE_2_LABEL,
    batchNumber: 10,
    stageNumber: 2,
    manifestPositionsCovered: [51, 100],
    manifestSha256Full: IDENTIFY_BATCH_10_MANIFEST_SHA256_FULL,
    manifestSha256Prefix: IDENTIFY_BATCH_10_MANIFEST_SHA256_PREFIX,
    verifiedStage1DecisionSha256Full:
      IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_FULL,
    verifiedStage1DecisionSha256Prefix:
      IDENTIFY_BATCH_10_STAGE_1_DECISION_SHA256_PREFIX,
    stage2DecisionSha256Full: IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_FULL,
    stage2DecisionSha256Prefix: IDENTIFY_BATCH_10_STAGE_2_DECISION_SHA256_PREFIX,
    candidatesReviewedInStage2Count: 50,
    stage2RecommendedKeepCount: 24,
    stage2RecommendedReviewCount: 5,
    stage2RecommendedExcludeCount: 21,
    stage2PriorityBreakdownOfKept: {
      essential_everyday: 2,
      common_situational: 21,
      useful_extended: 1,
    },
    semanticRelationshipsInStage2Count:
      IDENTIFY_BATCH_10_STAGE_2_SEMANTIC_RELATIONSHIP_RECORDS.length,
    canonicalDuplicateRelationshipsInStage2Count: 11,
    nonDuplicateSemanticComparisonsInStage2Count: 23,
    headwordNormalizationsInStage2Count:
      IDENTIFY_BATCH_10_STAGE_2_HEADWORD_NORMALIZATION_RECORDS.length as 11,
    essentialEverydayJustificationsInStage2Count:
      IDENTIFY_BATCH_10_STAGE_2_ESSENTIAL_EVERYDAY_REASONS.length as 2,
    registeredInCumulativeApprovedStore: false,
  };
}
