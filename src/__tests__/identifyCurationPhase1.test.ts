import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_MODULES } from '../courseData.ts';
import { getAllCourseTracks } from '../multilingual/courseTrackRegistry.ts';
import {
  IDENTIFY_1200_CURRICULUM_ARCHITECTURE,
  IDENTIFY_CURATION_METHODOLOGY_V1,
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
  IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS,
  IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_8_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS,
  IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS,
  IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
  IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS,
  IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS,
  IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER,
  IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES,
  IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES,
  IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS,
  auditLegacy2000NounRegistry,
  computeCurationBatchStatistics,
  computeCumulativeCurationProgress,
  getIdentifyVocabularyCoverageGapReport,
  getBatch4CorrectedVocabularyGapReport,
  getBatch5CoverageGapPlanningView,
  getBatch6CoverageGapAndHeadwordReport,
  getBatch7CurationAndHeadwordReport,
  getBatch8CurationAndHeadwordReport,
  getBatch9CurationAndHeadwordReport,
  getBatch10CurationAndHeadwordReport,
  getSavedCurationDecision,
  getAllSavedCurationDecisions,
  recordCandidateCurationDecision,
  getApprovedUniqueNounCount,
  getNextRecommendedBatchPreview,
} from '../identifyCurriculumCurationPhase1.ts';
import {
  IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28,
  IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28,
  IDENTIFY_CONTEXTUAL_NON_CLICKABLE_MISSING_WORDS_6,
  IDENTIFY_RECONCILED_DEMOTED_PROVISIONAL_KEEPS_14,
  IDENTIFY_RECONCILED_PROMOTED_REVIEWS_7,
  IDENTIFY_LEGACY_HOTSPOT_ALIAS_MAP,
  IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS,
  IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN,
  IDENTIFY_IMAGE_GENERATION_PROBE_RESULT,
  resolveCanonicalVocabularyIdForHotspot,
  isConceptSemanticallyCompatibleWithSceneCategory,
  getIdentifyFinal1200And80SceneSummary,
} from '../identifyCurriculumFinal1200.ts';
import {
  computeMasterVocabularyCoverageSummary,
  getApprovedLearnerTargets,
  getPlayableIdentifyCategories,
  IDENTIFY_EXPANSION_120_SUMMARY,
  IDENTIFY_MASTER_2000_NOUNS,
} from '../identifyData.ts';

test('Phase 1 Curation Architecture: defines 1,200-noun / 80-scene / 1,440-association target and preserves legacy 2,000-noun archive', () => {
  assert.equal(
    IDENTIFY_1200_CURRICULUM_ARCHITECTURE.targetUniqueNounConcepts,
    1200
  );
  assert.equal(IDENTIFY_1200_CURRICULUM_ARCHITECTURE.targetTotalScenes, 80);
  assert.equal(
    IDENTIFY_1200_CURRICULUM_ARCHITECTURE.targetSceneWordAssociations,
    1440
  );
  assert.deepEqual(
    IDENTIFY_1200_CURRICULUM_ARCHITECTURE.supportedPracticeRoundLengths,
    [5, 8, 10]
  );

  // Verify legacy 2,000-noun registry and 120-scene archive are untouched
  assert.equal(IDENTIFY_MASTER_2000_NOUNS.length, 2000);
  assert.equal(IDENTIFY_EXPANSION_120_SUMMARY.totalScenes, 120);

  // Verify active learner-facing safety boundary (10 scenes, 49 verified targets, 2,471 unverified excluded)
  assert.equal(IDENTIFY_EXPANSION_120_SUMMARY.verifiedPlayableScenesCount, 10);
  assert.equal(IDENTIFY_EXPANSION_120_SUMMARY.verifiedActiveTargetsCount, 49);
  assert.equal(
    IDENTIFY_EXPANSION_120_SUMMARY.scenesAwaitingAiGenerationCount,
    110
  );

  const coverageSummary = computeMasterVocabularyCoverageSummary();
  assert.equal(coverageSummary.scenesReadyForStudentsCount, 10);
  assert.equal(coverageSummary.verifiedActiveTargetAssociationsCount, 49);
  assert.equal(coverageSummary.unverifiedPlannedAssociationsCount, 2471);

  const playableCategories = getPlayableIdentifyCategories();
  const playableScenes = playableCategories.flatMap((c) => c.scenes);
  assert.equal(playableScenes.length, 10);
  const activeTargetCount = playableScenes.reduce(
    (sum, s) => sum + getApprovedLearnerTargets(s).length,
    0
  );
  assert.equal(activeTargetCount, 49);

  // Verify course modules and tracks are unaffected
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(getAllCourseTracks().length, 28);
});

test('Phase 1 Legacy 2,000-Noun Audit: accurately exposes compiler bug and distinguishes instructional sequence rank from statistical corpus frequency', () => {
  const audit = auditLegacy2000NounRegistry();
  assert.equal(audit.totalMasterNouns, 2000);
  assert.equal(audit.recordedFreqRankCount, 86);
  assert.equal(audit.unrecordedFreqRankCount, 1914);
  assert.equal(audit.actualMatchesInFreq6000Db, 306);
  assert.equal(audit.missedFreq6000DbMatchesDueToCompilerBug, 220);
  assert.equal(audit.actualMatchesInCourseModules, 233);
  assert.equal(audit.unverifiedSupplementalNounsCount, 1694);
  assert.equal(IDENTIFY_CURATION_METHODOLOGY_V1.batchSize, 200);
  assert.equal(IDENTIFY_CURATION_METHODOLOGY_V1.totalBatchesPlanned, 10);
  assert.equal(IDENTIFY_CURATION_METHODOLOGY_V1.evaluationCriteria.length, 10);
  assert.ok(
    audit.compilerFindingsEn.some((f) =>
      f.includes('not an external statistical corpus')
    )
  );
});

test('Phase 1 Batch 1, Batch 2 & Batch 3 Review Integrity (Candidates 1..600): preserves Batch 1 & 2 and reviews 200 new Batch 3 candidates with zero overlap', () => {
  // Batch 1 integrity
  assert.equal(BATCH_1_CANDIDATE_REVIEWS.length, 200);
  const stats1 = computeCurationBatchStatistics(BATCH_1_CANDIDATE_REVIEWS);
  assert.equal(stats1.batchNumber, 1);
  assert.equal(stats1.candidatesReviewedCount, 200);
  assert.equal(stats1.recommendedKeepCount, 150);
  assert.equal(stats1.recommendedExcludeCount, 30);
  assert.equal(stats1.recommendedReviewCount, 20);
  assert.equal(
    stats1.recommendedKeepCount +
      stats1.recommendedExcludeCount +
      stats1.recommendedReviewCount,
    200
  );

  // Batch 2 integrity & zero overlap with Batch 1
  assert.equal(BATCH_2_CANDIDATE_REVIEWS.length, 200);

  const masterByVocabId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
  );
  const batch1VocabIds = new Set(
    BATCH_1_CANDIDATE_REVIEWS.map((r) => r.vocabularyId)
  );
  const batch1ConceptIds = new Set(
    BATCH_1_CANDIDATE_REVIEWS.map((r) => r.conceptId)
  );
  const batch2VocabIds = new Set<string>();
  const batch2ConceptIds = new Set<string>();

  for (const r of BATCH_2_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 2);
    assert.equal(
      batch1VocabIds.has(r.vocabularyId),
      false,
      `Batch 2 candidate ${r.vocabularyId} must not overlap with Batch 1`
    );
    assert.equal(
      batch1ConceptIds.has(r.conceptId),
      false,
      `Batch 2 concept ${r.conceptId} must not overlap with Batch 1`
    );

    const masterEntry = masterByVocabId.get(r.vocabularyId);
    assert.ok(
      masterEntry,
      `Batch 2 candidate ${r.vocabularyId} must exist in IDENTIFY_MASTER_2000_NOUNS`
    );
    assert.equal(r.conceptId, masterEntry.conceptId);
    assert.equal(r.uk, masterEntry.uk);
    assert.equal(r.independentStatisticalCorpusRank, null);
    assert.ok(r.recommendedVisualFraming);
    assert.ok(r.rationaleEn.length > 15);

    batch2VocabIds.add(r.vocabularyId);
    batch2ConceptIds.add(r.conceptId);
  }

  assert.equal(batch2VocabIds.size, 200);
  assert.equal(batch2ConceptIds.size, 200);

  const stats2 = computeCurationBatchStatistics(BATCH_2_CANDIDATE_REVIEWS);
  assert.equal(stats2.batchNumber, 2);
  assert.equal(stats2.candidatesReviewedCount, 200);
  assert.equal(stats2.recommendedKeepCount, 154);
  assert.equal(stats2.recommendedReviewCount, 22);
  assert.equal(stats2.recommendedExcludeCount, 24);
  assert.equal(
    stats2.recommendedKeepCount +
      stats2.recommendedReviewCount +
      stats2.recommendedExcludeCount,
    200
  );

  // Batch 3 integrity & zero overlap with Batch 1 and Batch 2
  assert.equal(BATCH_3_CANDIDATE_REVIEWS.length, 200);
  const batch3VocabIds = new Set<string>();
  const batch3ConceptIds = new Set<string>();

  for (const r of BATCH_3_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 3);
    assert.equal(
      batch1VocabIds.has(r.vocabularyId),
      false,
      `Batch 3 candidate ${r.vocabularyId} must not overlap with Batch 1`
    );
    assert.equal(
      batch2VocabIds.has(r.vocabularyId),
      false,
      `Batch 3 candidate ${r.vocabularyId} must not overlap with Batch 2`
    );
    assert.equal(
      batch1ConceptIds.has(r.conceptId),
      false,
      `Batch 3 concept ${r.conceptId} must not overlap with Batch 1`
    );
    assert.equal(
      batch2ConceptIds.has(r.conceptId),
      false,
      `Batch 3 concept ${r.conceptId} must not overlap with Batch 2`
    );

    const masterEntry = masterByVocabId.get(r.vocabularyId);
    assert.ok(
      masterEntry,
      `Batch 3 candidate ${r.vocabularyId} must exist in IDENTIFY_MASTER_2000_NOUNS`
    );
    assert.equal(r.conceptId, masterEntry.conceptId);
    assert.equal(r.uk, masterEntry.uk);
    assert.equal(r.independentStatisticalCorpusRank, null);
    assert.ok(r.recommendedVisualFraming);
    assert.ok(r.rationaleEn.length > 15);

    batch3VocabIds.add(r.vocabularyId);
    batch3ConceptIds.add(r.conceptId);
  }

  assert.equal(batch3VocabIds.size, 200);
  assert.equal(batch3ConceptIds.size, 200);

  const stats3 = computeCurationBatchStatistics(BATCH_3_CANDIDATE_REVIEWS);
  assert.equal(stats3.batchNumber, 3);
  assert.equal(stats3.candidatesReviewedCount, 200);
  assert.equal(stats3.recommendedKeepCount, 132);
  assert.equal(stats3.recommendedReviewCount, 30);
  assert.equal(stats3.recommendedExcludeCount, 38);
  assert.equal(
    stats3.recommendedKeepCount +
      stats3.recommendedReviewCount +
      stats3.recommendedExcludeCount,
    200
  );
});

test('Phase 1 Batch 2 & Batch 3 High-Value Candidates & Duplicate/Lexical Sense Resolution: handles cross-batch duplicates, inflected plurals, calques, and high-utility nouns', () => {
  const highValueBatch2KeepIds = [
    'id-v2-1026', // о́ко
    'id-v2-1023', // голова́
    'id-v2-932',  // мі́сяць (небесне тіло)
    'id-v2-518',  // цу́кор
    'id-v2-519',  // сіль
    'id-v2-554',  // ри́ба
    'id-v2-568',  // борщ
    'id-v2-569',  // варе́ники
    'id-v2-800',  // студе́нт
    'id-v2-790',  // чолові́к
    'id-v2-795',  // діду́сь
    'id-v2-796',  // бабу́ся
    'id-v2-704',  // таксі́
    'id-v2-815',  // соро́чка
    'id-v2-832',  // су́кня
    'id-v2-824',  // пальто́
    'id-v2-846',  // ша́пка
    'id-v2-874',  // парасо́лька
    'id-v2-680',  // па́спорт
    'id-v2-441',  // цибу́ля
    'id-v2-552',  // котле́та
    'id-v2-547',  // ковбаса́
    'id-v2-483',  // смета́на
  ];

  for (const id of highValueBatch2KeepIds) {
    const decision = getSavedCurationDecision(id);
    assert.ok(decision, `Expected saved Batch 2 decision for ${id}`);
    assert.equal(decision.batchNumber, 2);
    assert.equal(decision.recommendation, 'keep', `Expected ${id} (${decision.uk}) to be KEEP`);
  }

  // Batch 3 high-value everyday KEEP decisions
  const highValueBatch3KeepIds = [
    'id-v2-245',  // смітни́к
    'id-v2-858',  // бли́скавка (застібка)
    'id-v2-935',  // весе́лка
    'id-v2-722',  // бага́жник
    'id-v2-258',  // підвіко́ння
    'id-v2-1486', // краве́ць
    'id-v2-804',  // пе́кар
    'id-v2-572',  // нали́сники
    'id-v2-154',  // електроча́йник
    'id-v2-155',  // кавова́рка
    'id-v2-157',  // бле́ндер
    'id-v2-169',  // друшля́к
    'id-v2-171',  // те́ртка
    'id-v2-190',  // хлі́бниця
    'id-v2-211',  // матра́ц
    'id-v2-212',  // на́волочка
    'id-v2-233',  // суша́рка для одя́гу
    'id-v2-253',  // ла́мпочка
    'id-v2-254',  // што́ра
    'id-v2-275',  // обігріва́ч
    'id-v2-295',  // хала́т
    'id-v2-296',  // ка́пці
    'id-v2-379',  // ліхта́рик
    'id-v2-380',  // навісни́й замо́к
    'id-v2-381',  // лопа́та
    'id-v2-401',  // плю́шевий ведме́дик
    'id-v2-402',  // ля́лька
  ];

  for (const id of highValueBatch3KeepIds) {
    const decision = getSavedCurationDecision(id);
    assert.ok(decision, `Expected saved Batch 3 decision for ${id}`);
    assert.equal(decision.batchNumber, 3);
    assert.equal(decision.recommendation, 'keep', `Expected ${id} (${decision.uk}) to be KEEP`);
  }

  // Batch 3 cross-batch & within-batch duplicate exclusions
  const doorLockDup = getSavedCurationDecision('id-v2-338'); // замо́к дверни́й -> noun-zamok-lock
  assert.ok(doorLockDup);
  assert.equal(doorLockDup.recommendation, 'exclude');
  assert.equal(doorLockDup.duplicateOfVocabularyId, 'noun-zamok-lock');

  const trayCalqueDup = getSavedCurationDecision('id-v2-1214'); // підно́с сніданко́вий -> id-v2-198 (та́ця)
  assert.ok(trayCalqueDup);
  assert.equal(trayCalqueDup.recommendation, 'exclude');
  assert.equal(trayCalqueDup.duplicateOfVocabularyId, 'id-v2-198');

  const swabsPluralDup = getSavedCurationDecision('id-v2-1771'); // ва́тні па́лички (comparison-only against REVIEW id-v2-316 ва́тна па́личка)
  assert.ok(swabsPluralDup);
  assert.equal(swabsPluralDup.recommendation, 'exclude');
  assert.equal(swabsPluralDup.duplicateOfVocabularyId, undefined);

  assert.ok(IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS.length >= 10);
  assert.equal(IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS.length, 12);
  assert.equal(IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES.length, 7);
});

test('Phase 1 Cumulative Progress, Batches 4–7 Integrity, Headword Normalizations, Semantic Relationships & Decision Store: verifies Batches 1–7 (1,400 reviewed, 920 accepted), 34 protected missing concepts, and Batch 8 preview', () => {
  // 1. Batch 4, Batch 5 & Batch 6 remain intact
  assert.equal(BATCH_4_CANDIDATE_REVIEWS.length, 200);
  const stats4 = computeCurationBatchStatistics(BATCH_4_CANDIDATE_REVIEWS);
  assert.equal(stats4.batchNumber, 4);
  assert.equal(stats4.candidatesReviewedCount, 200);
  assert.equal(stats4.recommendedKeepCount, 146);
  assert.equal(stats4.recommendedReviewCount, 26);
  assert.equal(stats4.recommendedExcludeCount, 28);
  assert.equal(IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS.length, 14);

  assert.equal(BATCH_5_CANDIDATE_REVIEWS.length, 200);
  const stats5 = computeCurationBatchStatistics(BATCH_5_CANDIDATE_REVIEWS);
  assert.equal(stats5.batchNumber, 5);
  assert.equal(stats5.candidatesReviewedCount, 200);
  assert.equal(stats5.recommendedKeepCount, 126);
  assert.equal(stats5.recommendedReviewCount, 36);
  assert.equal(stats5.recommendedExcludeCount, 38);
  assert.equal(
    stats5.recommendedKeepCount +
      stats5.recommendedReviewCount +
      stats5.recommendedExcludeCount,
    200
  );
  assert.equal(IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS.length, 23);

  assert.equal(BATCH_6_CANDIDATE_REVIEWS.length, 200);
  const stats6 = computeCurationBatchStatistics(BATCH_6_CANDIDATE_REVIEWS);
  assert.equal(stats6.batchNumber, 6);
  assert.equal(stats6.candidatesReviewedCount, 200);
  assert.equal(stats6.recommendedKeepCount, 108);
  assert.equal(stats6.recommendedReviewCount, 38);
  assert.equal(stats6.recommendedExcludeCount, 54);
  assert.equal(
    stats6.recommendedKeepCount +
      stats6.recommendedReviewCount +
      stats6.recommendedExcludeCount,
    200
  );
  assert.equal(IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS.length, 28);

  // 2. Batch 7 contains exactly 200 new candidates (105 KEEP, 36 REVIEW, 59 EXCLUDE)
  assert.equal(BATCH_7_CANDIDATE_REVIEWS.length, 200);
  const stats7 = computeCurationBatchStatistics(BATCH_7_CANDIDATE_REVIEWS);
  assert.equal(stats7.batchNumber, 7);
  assert.equal(stats7.candidatesReviewedCount, 200);
  assert.equal(stats7.recommendedKeepCount, 105);
  assert.equal(stats7.recommendedReviewCount, 36);
  assert.equal(stats7.recommendedExcludeCount, 59);
  assert.equal(
    stats7.recommendedKeepCount +
      stats7.recommendedReviewCount +
      stats7.recommendedExcludeCount,
    200
  );
  assert.equal(IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS.length, 36);
  assert.equal(IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS.length, 10);
  assert.equal(IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS.length, 34);
  assert.equal(IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS.length, 12);

  // 3. Zero overlap between Batch 7 and Batches 1–6; all 1,400 reviewed candidates have unique vocabulary IDs and concept IDs
  const prev1200Reviews = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
  ];
  const prev1200VocabIds = new Set(prev1200Reviews.map((r) => r.vocabularyId));
  const prev1200ConceptIds = new Set(prev1200Reviews.map((r) => r.conceptId));
  for (const r of BATCH_7_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 7);
    assert.equal(prev1200VocabIds.has(r.vocabularyId), false);
    assert.equal(prev1200ConceptIds.has(r.conceptId), false);
    assert.ok(['keep', 'review', 'exclude'].includes(r.recommendation));
  }

  const all1400Reviews = [...prev1200Reviews, ...BATCH_7_CANDIDATE_REVIEWS];
  assert.equal(all1400Reviews.length, 1400);
  const all1400VocabIds = new Set(all1400Reviews.map((r) => r.vocabularyId));
  const all1400ConceptIds = new Set(all1400Reviews.map((r) => r.conceptId));
  assert.equal(all1400VocabIds.size, 1400);
  assert.equal(all1400ConceptIds.size, 1400);

  // 3b. Batch 8 contains 200 new candidates (89 KEEP, 49 REVIEW, 62 EXCLUDE) with zero overlap against Batches 1–7
  assert.equal(BATCH_8_CANDIDATE_REVIEWS.length, 200);
  const stats8 = computeCurationBatchStatistics(BATCH_8_CANDIDATE_REVIEWS);
  assert.equal(stats8.batchNumber, 8);
  assert.equal(stats8.candidatesReviewedCount, 200);
  assert.equal(stats8.recommendedKeepCount, 89);
  assert.equal(stats8.recommendedReviewCount, 49);
  assert.equal(stats8.recommendedExcludeCount, 62);
  assert.equal(
    stats8.recommendedKeepCount +
      stats8.recommendedReviewCount +
      stats8.recommendedExcludeCount,
    200
  );
  for (const r of BATCH_8_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 8);
    assert.equal(all1400VocabIds.has(r.vocabularyId), false);
    assert.equal(all1400ConceptIds.has(r.conceptId), false);
  }
  const all1600Reviews = [...all1400Reviews, ...BATCH_8_CANDIDATE_REVIEWS];
  assert.equal(all1600Reviews.length, 1600);
  const all1600VocabIds = new Set(all1600Reviews.map((r) => r.vocabularyId));
  const all1600ConceptIds = new Set(all1600Reviews.map((r) => r.conceptId));
  assert.equal(all1600VocabIds.size, 1600);
  assert.equal(all1600ConceptIds.size, 1600);

  // 3c. Batch 9 contains 200 new candidates (93 KEEP, 34 REVIEW, 73 EXCLUDE) with zero overlap against Batches 1–8
  assert.equal(BATCH_9_CANDIDATE_REVIEWS.length, 200);
  const stats9 = computeCurationBatchStatistics(BATCH_9_CANDIDATE_REVIEWS);
  assert.equal(stats9.batchNumber, 9);
  assert.equal(stats9.candidatesReviewedCount, 200);
  assert.equal(stats9.recommendedKeepCount, 93);
  assert.equal(stats9.recommendedReviewCount, 34);
  assert.equal(stats9.recommendedExcludeCount, 73);
  assert.equal(
    stats9.recommendedKeepCount +
      stats9.recommendedReviewCount +
      stats9.recommendedExcludeCount,
    200
  );
  for (const r of BATCH_9_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 9);
    assert.equal(all1600VocabIds.has(r.vocabularyId), false);
    assert.equal(all1600ConceptIds.has(r.conceptId), false);
  }
  const all1800Reviews = [...all1600Reviews, ...BATCH_9_CANDIDATE_REVIEWS];
  assert.equal(all1800Reviews.length, 1800);
  const all1800VocabIds = new Set(all1800Reviews.map((r) => r.vocabularyId));
  const all1800ConceptIds = new Set(all1800Reviews.map((r) => r.conceptId));
  assert.equal(all1800VocabIds.size, 1800);
  assert.equal(all1800ConceptIds.size, 1800);

  // 3d. Batch 10 contains the final 200 candidates (76 KEEP, 32 REVIEW, 92 EXCLUDE) with zero overlap against Batches 1–9
  assert.equal(BATCH_10_CANDIDATE_REVIEWS.length, 200);
  const stats10 = computeCurationBatchStatistics(BATCH_10_CANDIDATE_REVIEWS);
  assert.equal(stats10.batchNumber, 10);
  assert.equal(stats10.candidatesReviewedCount, 200);
  assert.equal(stats10.recommendedKeepCount, 76);
  assert.equal(stats10.recommendedReviewCount, 32);
  assert.equal(stats10.recommendedExcludeCount, 92);
  assert.equal(
    stats10.recommendedKeepCount +
      stats10.recommendedReviewCount +
      stats10.recommendedExcludeCount,
    200
  );
  for (const r of BATCH_10_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 10);
    assert.equal(all1800VocabIds.has(r.vocabularyId), false);
    assert.equal(all1800ConceptIds.has(r.conceptId), false);
  }
  const all2000Reviews = [...all1800Reviews, ...BATCH_10_CANDIDATE_REVIEWS];
  assert.equal(all2000Reviews.length, 2000);
  assert.equal(new Set(all2000Reviews.map((r) => r.vocabularyId)).size, 2000);
  assert.equal(new Set(all2000Reviews.map((r) => r.conceptId)).size, 2000);

  // 4. Verify pending Batch 7 headword normalizations (id-v2-487 вершко́ве ма́сло -> ма́сло, id-v2-646 чек ка́совий -> чек)
  const butterDecision = getSavedCurationDecision('id-v2-487');
  assert.ok(butterDecision);
  assert.equal(butterDecision.batchNumber, 7);
  assert.equal(butterDecision.recommendation, 'keep');
  assert.equal(butterDecision.recommendedPriority, 'essential_everyday');

  const receiptDecision = getSavedCurationDecision('id-v2-646');
  assert.ok(receiptDecision);
  assert.equal(receiptDecision.batchNumber, 7);
  assert.equal(receiptDecision.recommendation, 'keep');
  assert.equal(receiptDecision.recommendedPriority, 'essential_everyday');

  const batteryDecision = getSavedCurationDecision('id-v2-1712');
  assert.ok(batteryDecision);
  assert.equal(batteryDecision.batchNumber, 7);
  assert.equal(batteryDecision.recommendation, 'keep');
  assert.equal(batteryDecision.recommendedPriority, 'essential_everyday');

  // 5. Cumulative progress across Batches 1–10 (all 2,000 candidates reviewed)
  const progress = computeCumulativeCurationProgress();
  assert.equal(progress.targetUniqueNouns, 1200);
  assert.equal(progress.totalMasterCandidates, 2000);
  assert.deepEqual(progress.batchesCompleted, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(progress.batch1Stats.recommendedKeepCount, 150);
  assert.equal(progress.batch2Stats.recommendedKeepCount, 154);
  assert.equal(progress.batch3Stats.recommendedKeepCount, 132);
  assert.equal(progress.batch4Stats.recommendedKeepCount, 146);
  assert.equal(progress.batch5Stats.recommendedKeepCount, 126);
  assert.equal(progress.batch6Stats.recommendedKeepCount, 108);
  assert.equal(progress.batch7Stats.recommendedKeepCount, 105);
  assert.equal(progress.batch8Stats.recommendedKeepCount, 89);
  assert.equal(progress.batch9Stats.recommendedKeepCount, 93);
  assert.equal(progress.batch10Stats?.recommendedKeepCount, 76);
  assert.equal(progress.totalCandidatesReviewed, 2000);
  assert.equal(progress.totalRecommendedKeep, 1179);
  assert.equal(progress.totalRecommendedReview, 323);
  assert.equal(progress.totalRecommendedExclude, 498);
  assert.equal(progress.totalUniqueProvisionallyAcceptedConcepts, 1179);
  assert.equal(progress.remainingUnreviewedCandidates, 0);
  assert.equal(progress.remainingNeededToReach1200Target, 21);

  // Decision store has all 2,000 decisions and 1,179 unique accepted concepts
  assert.equal(getAllSavedCurationDecisions().length, 2000);
  assert.equal(getApprovedUniqueNounCount(), 1179);

  // Refuses silent overwrite of approved Batch 3 decision
  const washingMachineDecision = getSavedCurationDecision('id-v2-151');
  assert.ok(washingMachineDecision);
  const blockedAttempt = recordCandidateCurationDecision({
    ...washingMachineDecision,
    recommendation: 'exclude',
  });
  assert.equal(blockedAttempt.ok, false);
  assert.equal(getSavedCurationDecision('id-v2-151')?.recommendation, 'keep');

  // 6. Coverage-gap classifications, Batch 5 reconciliation view, Batch 6 report, Batch 7 report, Batch 8 report, Batch 9 report, and Batch 10 report are preserved
  const gapReport = getIdentifyVocabularyCoverageGapReport();
  assert.equal(gapReport.totalDomainsAudited, 13);
  assert.equal(IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES.length, gapReport.entries.length);
  assert.equal(IDENTIFY_MASTER_2000_NOUNS.length, 2000);

  const correctedGapReport = getBatch4CorrectedVocabularyGapReport();
  assert.equal(correctedGapReport.auditVersion, '4.0.0-batch4');
  assert.equal(correctedGapReport.totalRecordsAudited, 54);
  assert.equal(correctedGapReport.genuinelyMissingConceptsCount, 34);
  assert.equal(correctedGapReport.reclassifiedNonMissingCount, 20);
  assert.equal(
    IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.length,
    correctedGapReport.records.length
  );

  const gapPlanView = getBatch5CoverageGapPlanningView();
  assert.equal(gapPlanView.planningVersion, '5.0.0-batch5');
  assert.equal(gapPlanView.preservedTotalGapAuditRecordsCount, 54);
  assert.equal(gapPlanView.genuineMissingConceptsCount, 34);
  assert.equal(gapPlanView.reclassifiedNonMissingConceptsCount, 20);
  assert.equal(gapPlanView.genuineMissingConcepts.length, 34);
  assert.equal(
    IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS.length,
    gapPlanView.reconciliationCandidatesFlaggedForFinalShortlist.length
  );

  const batch6GapReport = getBatch6CoverageGapAndHeadwordReport();
  assert.equal(batch6GapReport.reportVersion, '6.0.0-batch6');
  assert.equal(batch6GapReport.preservedGapAuditRecordsCount, 54);
  assert.equal(batch6GapReport.preservedGenuineMissingConceptsCount, 34);
  assert.equal(batch6GapReport.preservedReclassifiedNonMissingCount, 20);
  assert.equal(batch6GapReport.headwordNormalizationsCompletedInBatch6Count, 3);
  assert.equal(batch6GapReport.headwordNormalizationsPendingInBatch7Count, 2);

  const batch7Report = getBatch7CurationAndHeadwordReport();
  assert.equal(batch7Report.reportVersion, '7.0.0-batch7');
  assert.equal(batch7Report.preservedGenuineMissingConceptsCount, 34);
  assert.equal(batch7Report.headwordNormalizationsCompletedInBatch7Count, 10);
  assert.equal(batch7Report.essentialEverydayWithIndependentJustificationCount, 34);
  assert.equal(batch7Report.priorBatchPriorityReconciliationFlagsCount, 12);

  const batch8Report = getBatch8CurationAndHeadwordReport();
  assert.equal(batch8Report.reportVersion, '8.0.0-batch8');
  assert.equal(batch8Report.preservedGenuineMissingConceptsCount, 34);
  assert.equal(batch8Report.headwordNormalizationsCompletedInBatch8Count, 15);
  assert.equal(batch8Report.essentialEverydayWithIndependentJustificationCount, 24);
  assert.equal(batch8Report.semanticRelationshipsInBatch8Count, 19);
  assert.equal(
    batch8Report.semanticRelationships.filter((r) => r.countsAsDuplicateConcept).length,
    10
  );

  const batch9Report = getBatch9CurationAndHeadwordReport();
  assert.equal(batch9Report.reportVersion, '9.0.0-batch9');
  assert.equal(batch9Report.preservedGenuineMissingConceptsCount, 34);
  assert.equal(batch9Report.headwordNormalizationsCompletedInBatch9Count, 17);
  assert.equal(batch9Report.essentialEverydayWithIndependentJustificationCount, 22);
  assert.equal(batch9Report.semanticRelationshipsInBatch9Count, 31);
  assert.equal(
    batch9Report.semanticRelationships.filter((r) => r.countsAsDuplicateConcept).length,
    21
  );

  const batch10Report = getBatch10CurationAndHeadwordReport();
  assert.equal(batch10Report.reportVersion, '10.0.0-batch10');
  assert.equal(batch10Report.preservedGenuineMissingConceptsCount, 34);
  assert.equal(batch10Report.headwordNormalizationsCompletedInBatch10Count, 56);
  assert.equal(batch10Report.essentialEverydayWithIndependentJustificationCount, 4);
  assert.equal(batch10Report.semanticRelationshipsInBatch10Count, 133);
  assert.equal(batch10Report.canonicalDuplicateRelationshipsCount, 29);
  assert.equal(batch10Report.comparisonOnlyRelationshipsCount, 104);

  // 7. Next batch preview now shows 0 remaining unreviewed candidates (and supports explicit Batch 10 historical preview)
  const completedPreview = getNextRecommendedBatchPreview(200);
  assert.equal(completedPreview.totalRemainingUnreviewedCandidates, 0);
  assert.equal(completedPreview.sampleTopCandidatesForNextBatch.length, 0);

  const batch10HistoricalPreview = getNextRecommendedBatchPreview(200, { forBatchNumber: 10 });
  assert.equal(batch10HistoricalPreview.nextBatchNumber, 10);
  assert.equal(batch10HistoricalPreview.totalRemainingUnreviewedCandidates, 200);
  assert.equal(batch10HistoricalPreview.sampleTopCandidatesForNextBatch.length, 25);
});

test('Phase 1 Referential Integrity Regression Suite (Batches 1–9): verifies master identity, duplicate/canonical/comparison links, shortlist flags, assessment keys, and priority-list ID alignment', async () => {
  const fs = await import('node:fs');
  const { EXPLICIT_BATCH_2_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch2.ts'
  );
  const { EXPLICIT_BATCH_3_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch3.ts'
  );
  const { EXPLICIT_BATCH_4_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch4.ts'
  );
  const { EXPLICIT_BATCH_5_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch5.ts'
  );
  const { EXPLICIT_BATCH_6_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch6.ts'
  );
  const { EXPLICIT_BATCH_7_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch7.ts'
  );
  const { EXPLICIT_BATCH_8_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch8.ts'
  );
  const { EXPLICIT_BATCH_9_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch9.ts'
  );

  // A. Master registry identity (2,000 unique vocabularyIds and 2,000 unique conceptIds)
  assert.equal(IDENTIFY_MASTER_2000_NOUNS.length, 2000);
  const masterByVocabId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
  );
  const masterByConceptId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.conceptId, m])
  );
  assert.equal(masterByVocabId.size, 2000);
  assert.equal(masterByConceptId.size, 2000);

  // B. Primary curation decisions across all 2,000 reviewed candidates
  const allReviews = [
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
  assert.equal(allReviews.length, 2000);
  const reviewByVocabId = new Map(allReviews.map((r) => [r.vocabularyId, r]));
  assert.equal(reviewByVocabId.size, 2000);

  for (const r of allReviews) {
    const master = masterByVocabId.get(r.vocabularyId);
    assert.ok(master, `Review ${r.vocabularyId} must exist in IDENTIFY_MASTER_2000_NOUNS`);
    assert.equal(r.conceptId, master.conceptId);
    assert.equal(r.uk, master.uk);
    assert.equal(r.en, master.en);
    assert.equal(r.gender, master.gender);
    assert.equal(r.intendedLexicalSenseEn, master.intendedMeaningEn);
  }

  // C. Duplicate, canonical, and semantic comparison references
  for (const r of allReviews) {
    if (r.duplicateOfVocabularyId) {
      assert.notEqual(
        r.duplicateOfVocabularyId,
        r.vocabularyId,
        `duplicateOfVocabularyId on ${r.vocabularyId} must not self-reference`
      );
      const targetMaster = masterByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(
        targetMaster,
        `duplicateOfVocabularyId ${r.duplicateOfVocabularyId} on ${r.vocabularyId} must exist in master registry`
      );
      if (r.canonicalConceptId) {
        assert.equal(
          r.canonicalConceptId,
          targetMaster.conceptId,
          `canonicalConceptId on ${r.vocabularyId} must match ${r.duplicateOfVocabularyId}'s master conceptId`
        );
      }
    }
  }

  const canonicalDuplicateTables = [
    ...IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS,
    ...IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS,
    ...IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS,
  ];
  for (const rec of canonicalDuplicateTables) {
    const candMaster = masterByVocabId.get(rec.candidateVocabularyId);
    assert.ok(candMaster, `Candidate ${rec.candidateVocabularyId} must exist in master`);
    assert.equal(rec.candidateConceptId, candMaster.conceptId);
    assert.equal(rec.candidateUk, candMaster.uk);

    const canonMaster = masterByVocabId.get(rec.canonicalVocabularyId);
    assert.ok(canonMaster, `Canonical ${rec.canonicalVocabularyId} must exist in master`);
    assert.equal(
      rec.canonicalConceptId,
      canonMaster.conceptId,
      `Canonical conceptId for ${rec.canonicalVocabularyId} (referenced by ${rec.candidateVocabularyId}) must match master`
    );
  }

  const comparisonTables = [
    ...IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS,
    ...IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS,
  ];
  for (const rec of comparisonTables) {
    const candMaster = masterByVocabId.get(rec.candidateVocabularyId);
    assert.ok(candMaster, `Candidate ${rec.candidateVocabularyId} must exist in master`);
    assert.equal(rec.candidateConceptId, candMaster.conceptId);
    assert.equal(rec.candidateUk, candMaster.uk);

    const compMaster = masterByVocabId.get(rec.comparedVocabularyId);
    assert.ok(compMaster, `Compared ${rec.comparedVocabularyId} must exist in master`);
    assert.equal(
      rec.comparedConceptId,
      compMaster.conceptId,
      `Compared conceptId for ${rec.comparedVocabularyId} (referenced by ${rec.candidateVocabularyId}) must match master`
    );
  }

  for (const rec of [
    ...IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS,
    ...IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS,
  ]) {
    const compMaster = masterByVocabId.get(rec.comparedVocabularyId)!;
    assert.equal(rec.comparedUk, compMaster.uk);
    assert.equal(rec.comparedEn, compMaster.en);
  }

  // C2. Batch 7, Batch 8, Batch 9 & Batch 10 headword normalizations, essential_everyday pedagogical justifications, and prior-batch priority flags
  for (const norm of [
    ...IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS,
    ...IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS,
  ]) {
    const master = masterByVocabId.get(norm.vocabularyId);
    assert.ok(master, `Headword normalization ${norm.vocabularyId} must exist in master`);
    assert.equal(norm.conceptId, master.conceptId);
    assert.equal(norm.originalMasterHeadwordUk, master.uk);
    assert.equal(norm.englishGlossEn, master.en);
    assert.equal(norm.gender, master.gender);
    const saved = reviewByVocabId.get(norm.vocabularyId);
    assert.ok(saved, `Headword normalization ${norm.vocabularyId} must be reviewed`);
    assert.equal(saved.batchNumber, norm.reviewedInBatchNumber);
    if (norm.reviewedInBatchNumber === 10) {
      assert.equal(
        saved.recommendation === 'keep' || saved.recommendation === 'review',
        true,
        `Batch 10 headword normalization ${norm.vocabularyId} must be KEEP or REVIEW`
      );
    } else {
      assert.equal(saved.recommendation, 'keep');
    }
  }

  const batch7EssentialIds = new Set(
    BATCH_7_CANDIDATE_REVIEWS.filter(
      (r) => r.recommendation === 'keep' && r.recommendedPriority === 'essential_everyday'
    ).map((r) => r.vocabularyId)
  );
  assert.equal(batch7EssentialIds.size, 34);
  for (const reason of IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS) {
    const master = masterByVocabId.get(reason.vocabularyId);
    assert.ok(master);
    assert.equal(reason.conceptId, master.conceptId);
    assert.equal(reason.uk, master.uk);
    assert.equal(reason.en, master.en);
    assert.equal(batch7EssentialIds.has(reason.vocabularyId), true);
  }

  const batch8EssentialIds = new Set(
    BATCH_8_CANDIDATE_REVIEWS.filter(
      (r) => r.recommendation === 'keep' && r.recommendedPriority === 'essential_everyday'
    ).map((r) => r.vocabularyId)
  );
  assert.equal(batch8EssentialIds.size, 24);
  for (const reason of IDENTIFY_BATCH_8_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS) {
    const master = masterByVocabId.get(reason.vocabularyId);
    assert.ok(master);
    assert.equal(reason.conceptId, master.conceptId);
    assert.equal(reason.uk, master.uk);
    assert.equal(reason.en, master.en);
    assert.equal(batch8EssentialIds.has(reason.vocabularyId), true);
  }

  const batch9EssentialIds = new Set(
    BATCH_9_CANDIDATE_REVIEWS.filter(
      (r) => r.recommendation === 'keep' && r.recommendedPriority === 'essential_everyday'
    ).map((r) => r.vocabularyId)
  );
  assert.equal(batch9EssentialIds.size, 22);
  for (const reason of IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS) {
    const master = masterByVocabId.get(reason.vocabularyId);
    assert.ok(master);
    assert.equal(reason.conceptId, master.conceptId);
    assert.equal(reason.uk, master.uk);
    assert.equal(reason.en, master.en);
    assert.equal(batch9EssentialIds.has(reason.vocabularyId), true);
  }

  const batch10EssentialIds = new Set(
    BATCH_10_CANDIDATE_REVIEWS.filter(
      (r) => r.recommendation === 'keep' && r.recommendedPriority === 'essential_everyday'
    ).map((r) => r.vocabularyId)
  );
  assert.equal(batch10EssentialIds.size, 4);
  for (const reason of IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS) {
    const master = masterByVocabId.get(reason.vocabularyId);
    assert.ok(master);
    assert.equal(reason.conceptId, master.conceptId);
    assert.equal(reason.uk, master.uk);
    assert.equal(reason.en, master.en);
    assert.equal(batch10EssentialIds.has(reason.vocabularyId), true);
  }

  for (const flag of IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS) {
    const master = masterByVocabId.get(flag.vocabularyId);
    assert.ok(master);
    assert.equal(flag.conceptId, master.conceptId);
    assert.equal(flag.uk, master.uk);
    assert.equal(flag.en, master.en);
    const priorSaved = reviewByVocabId.get(flag.vocabularyId);
    assert.ok(priorSaved);
    assert.equal(priorSaved.batchNumber, flag.batchNumber);
    assert.equal(priorSaved.recommendedPriority, flag.currentPriority);
  }

  // D. Shortlist reconciliation references
  for (const flag of IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS) {
    const master = masterByVocabId.get(flag.acceptedLegacyVocabularyId);
    assert.ok(master, `Shortlist flag ${flag.acceptedLegacyVocabularyId} must exist in master`);
    assert.equal(flag.acceptedLegacyConceptId, master.conceptId);
    assert.equal(flag.acceptedLegacyUk, master.uk);

    const saved = reviewByVocabId.get(flag.acceptedLegacyVocabularyId);
    assert.ok(saved, `Shortlist flag ${flag.acceptedLegacyVocabularyId} must be reviewed`);
    assert.equal(saved.batchNumber, flag.acceptedInBatchNumber);
    assert.equal(saved.recommendation, 'keep');
  }

  // E. Explicit assessment keys belong to their intended batch (zero orphan keys)
  const { EXPLICIT_BATCH_10_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch10.ts'
  );
  const batchAssessmentPairs: Array<{
    batchNumber: number;
    reviews: readonly { vocabularyId: string }[];
    assessments: Record<string, unknown>;
  }> = [
    { batchNumber: 2, reviews: BATCH_2_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_2_ASSESSMENTS },
    { batchNumber: 3, reviews: BATCH_3_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_3_ASSESSMENTS },
    { batchNumber: 4, reviews: BATCH_4_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_4_ASSESSMENTS },
    { batchNumber: 5, reviews: BATCH_5_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_5_ASSESSMENTS },
    { batchNumber: 6, reviews: BATCH_6_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_6_ASSESSMENTS },
    { batchNumber: 7, reviews: BATCH_7_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_7_ASSESSMENTS },
    { batchNumber: 8, reviews: BATCH_8_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_8_ASSESSMENTS },
    { batchNumber: 9, reviews: BATCH_9_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_9_ASSESSMENTS },
    { batchNumber: 10, reviews: BATCH_10_CANDIDATE_REVIEWS, assessments: EXPLICIT_BATCH_10_ASSESSMENTS },
  ];

  for (const { batchNumber, reviews, assessments } of batchAssessmentPairs) {
    const batchVocabIds = new Set(reviews.map((r) => r.vocabularyId));
    for (const key of Object.keys(assessments)) {
      assert.equal(
        batchVocabIds.has(key),
        true,
        `Explicit Batch ${batchNumber} assessment key ${key} must belong to Batch ${batchNumber} candidates`
      );
    }
  }

  // F. Priority-list ID integrity in src/identifyCurriculumCurationPhase1.ts
  const phase1Source = fs.readFileSync(
    new URL('../identifyCurriculumCurationPhase1.ts', import.meta.url),
    'utf8'
  );
  const stripStress = (s: string) => s.replace(/\u0301/g, '').trim().toLowerCase();
  for (const line of phase1Source.split('\n')) {
    const match = line.match(/^\s*'(id-v2-\d+)'\s*,\s*\/\/\s*(.+)$/);
    if (match) {
      const vocabId = match[1];
      const commentUk = match[2].trim();
      const master = masterByVocabId.get(vocabId);
      assert.ok(master, `Priority list ID ${vocabId} must exist in master registry`);
      assert.equal(
        stripStress(master.uk),
        stripStress(commentUk),
        `Priority list ID ${vocabId} (${master.uk}) must match inline comment (${commentUk})`
      );
      const rev = reviewByVocabId.get(vocabId);
      assert.ok(rev, `Priority list ID ${vocabId} must belong to a reviewed batch`);
    }
  }

  // G. Preserve existing totals and verify priority-tier distributions across Batches 1–10
  const progress = computeCumulativeCurationProgress();
  assert.equal(progress.totalCandidatesReviewed, 2000);
  assert.equal(progress.totalRecommendedKeep, 1179);
  assert.equal(progress.totalRecommendedReview, 323);
  assert.equal(progress.totalRecommendedExclude, 498);
  assert.equal(progress.remainingUnreviewedCandidates, 0);

  assert.deepEqual(progress.batch1Stats.priorityBreakdownOfKept, {
    essential_everyday: 80,
    common_situational: 50,
    useful_extended: 20,
  });
  assert.deepEqual(progress.batch2Stats.priorityBreakdownOfKept, {
    essential_everyday: 53,
    common_situational: 89,
    useful_extended: 12,
  });
  assert.deepEqual(progress.batch3Stats.priorityBreakdownOfKept, {
    essential_everyday: 21,
    common_situational: 107,
    useful_extended: 4,
  });
  assert.deepEqual(progress.batch4Stats.priorityBreakdownOfKept, {
    essential_everyday: 48,
    common_situational: 90,
    useful_extended: 8,
  });
  assert.deepEqual(progress.batch5Stats.priorityBreakdownOfKept, {
    essential_everyday: 62,
    common_situational: 53,
    useful_extended: 11,
  });
  assert.deepEqual(progress.batch6Stats.priorityBreakdownOfKept, {
    essential_everyday: 38,
    common_situational: 65,
    useful_extended: 5,
  });
  assert.deepEqual(progress.batch7Stats.priorityBreakdownOfKept, {
    essential_everyday: 34,
    common_situational: 57,
    useful_extended: 14,
  });
  assert.deepEqual(progress.batch8Stats.priorityBreakdownOfKept, {
    essential_everyday: 24,
    common_situational: 46,
    useful_extended: 19,
  });
  assert.deepEqual(progress.batch9Stats.priorityBreakdownOfKept, {
    essential_everyday: 22,
    common_situational: 60,
    useful_extended: 11,
  });
  assert.deepEqual(progress.batch10Stats?.priorityBreakdownOfKept, {
    essential_everyday: 4,
    common_situational: 65,
    useful_extended: 7,
  });

  // H. Learner safety (10 verified scenes, 49 active targets, 2,471 unverified excluded)
  const coverageSummary = computeMasterVocabularyCoverageSummary();
  assert.equal(coverageSummary.scenesReadyForStudentsCount, 10);
  assert.equal(coverageSummary.verifiedActiveTargetAssociationsCount, 49);
  assert.equal(coverageSummary.unverifiedPlannedAssociationsCount, 2471);
});

test('Phase 1 Batch 7 Semantic Integrity & Headword Clarity Regression Suite: enforces canonical target rules and all 10 semantic/headword regression checks', () => {
  const masterByVocabId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
  );
  const allReviews = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
    ...BATCH_7_CANDIDATE_REVIEWS,
  ];
  const reviewByVocabId = new Map(allReviews.map((r) => [r.vocabularyId, r]));
  const batch7RelByCandidate = new Map(
    IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS.map((r) => [r.candidateVocabularyId, r])
  );
  const batch7NormByVocabId = new Map(
    IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS.map((n) => [n.vocabularyId, n])
  );

  // -------------------------------------------------------------------------
  // 1. Structural Checks
  // -------------------------------------------------------------------------
  // A. Every duplicateOfVocabularyId / canonicalConceptId across all 1,400 reviewed records:
  //    - exists in IDENTIFY_MASTER_2000_NOUNS
  //    - matches its target conceptId
  //    - does not self-reference
  //    - NEVER points to an UNREVIEWED entry (must belong to reviewByVocabId)
  for (const r of allReviews) {
    if (r.duplicateOfVocabularyId) {
      assert.notEqual(r.duplicateOfVocabularyId, r.vocabularyId);
      const targetMaster = masterByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(targetMaster, `Target ${r.duplicateOfVocabularyId} must exist in master`);
      if (r.canonicalConceptId) {
        assert.equal(r.canonicalConceptId, targetMaster.conceptId);
      }
      const targetReview = reviewByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(
        targetReview,
        `duplicateOfVocabularyId ${r.duplicateOfVocabularyId} on ${r.vocabularyId} must not reference an UNREVIEWED candidate`
      );
    }
  }

  // B. In Batch 7 specifically, every duplicateOfVocabularyId and every countsAsDuplicateConcept=true
  //    relationship record resolves strictly to an approved KEEP target (never REVIEW, EXCLUDE, or UNREVIEWED).
  //    Comparison-only references (countsAsDuplicateConcept=false) may reference REVIEW candidates without promoting them.
  for (const r of BATCH_7_CANDIDATE_REVIEWS) {
    if (r.duplicateOfVocabularyId) {
      const targetReview = reviewByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(targetReview, `Batch 7 duplicate target ${r.duplicateOfVocabularyId} must be reviewed`);
      assert.equal(
        targetReview.recommendation,
        'keep',
        `Batch 7 canonical duplicate target ${r.duplicateOfVocabularyId} (referenced by ${r.vocabularyId}) must be an approved KEEP concept`
      );
    }
  }

  for (const rel of IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS) {
    const comparedReview = reviewByVocabId.get(rel.comparedVocabularyId);
    assert.ok(
      comparedReview,
      `Batch 7 compared target ${rel.comparedVocabularyId} (referenced by ${rel.candidateVocabularyId}) must be reviewed`
    );
    if (rel.countsAsDuplicateConcept) {
      assert.equal(
        comparedReview.recommendation,
        'keep',
        `Batch 7 duplicate relationship target ${rel.comparedVocabularyId} (from ${rel.candidateVocabularyId}) with countsAsDuplicateConcept=true must have recommendation === 'keep'`
      );
    }
  }

  // -------------------------------------------------------------------------
  // 2. Explicit Semantic Regression Checks (10 Pairs)
  // -------------------------------------------------------------------------

  // Pair 1: Airplane window (id-v2-684 ілюміна́тор) vs. metal tea-glass holder (id-v2-1848 підскля́нник метале́вий)
  const airplaneWindow = reviewByVocabId.get('id-v2-684')!;
  const teaGlassHolderMaster = masterByVocabId.get('id-v2-1848')!;
  assert.equal(airplaneWindow.uk, 'ілюміна́тор');
  assert.equal(airplaneWindow.en, 'airplane window');
  assert.equal(airplaneWindow.intendedLexicalSenseEn, masterByVocabId.get('id-v2-684')!.intendedMeaningEn);
  assert.equal(airplaneWindow.recommendation, 'keep');
  assert.equal(airplaneWindow.recommendedPriority, 'common_situational');
  assert.equal(airplaneWindow.duplicateOfVocabularyId, undefined);
  assert.equal(airplaneWindow.canonicalConceptId, undefined);
  assert.equal(teaGlassHolderMaster.uk, 'підскля́нник метале́вий');
  assert.equal(reviewByVocabId.has('id-v2-1848'), false); // remains unreviewed
  assert.equal(batch7RelByCandidate.has('id-v2-684'), false);

  // Pair 2: Ship porthole (id-v2-1411 ілюміна́тор корабе́льний) vs. airplane window (id-v2-684 ілюміна́тор)
  const shipPorthole = reviewByVocabId.get('id-v2-1411')!;
  assert.equal(shipPorthole.uk, 'ілюміна́тор корабе́льний');
  assert.equal(shipPorthole.en, 'porthole');
  assert.equal(shipPorthole.recommendation, 'exclude');
  assert.equal(shipPorthole.recommendedPriority, 'none_exclude');
  assert.equal(shipPorthole.duplicateOfVocabularyId, undefined);
  assert.equal(shipPorthole.canonicalConceptId, undefined);
  const shipPortholeRel = batch7RelByCandidate.get('id-v2-1411')!;
  assert.ok(shipPortholeRel);
  assert.equal(shipPortholeRel.comparedVocabularyId, 'id-v2-684');
  assert.equal(shipPortholeRel.comparedConceptId, airplaneWindow.conceptId);
  assert.equal(shipPortholeRel.comparedConceptId, 'noun-concept-1098');
  assert.equal(shipPortholeRel.relationshipType, 'RELATED_BUT_DISTINCT_OBJECT');
  assert.equal(shipPortholeRel.countsAsDuplicateConcept, false);

  // Pair 3: Subway car (id-v2-698 ваго́н метро́) vs. railcar (id-v2-691 ваго́н) vs. locomotive (id-v2-690 локомоти́в)
  const subwayCar = reviewByVocabId.get('id-v2-698')!;
  const railcar = reviewByVocabId.get('id-v2-691')!;
  const locomotive = reviewByVocabId.get('id-v2-690')!;
  assert.equal(subwayCar.uk, 'ваго́н метро́');
  assert.equal(subwayCar.recommendation, 'exclude');
  assert.equal(subwayCar.duplicateOfVocabularyId, 'id-v2-691');
  assert.equal(subwayCar.canonicalConceptId, railcar.conceptId);
  assert.notEqual(subwayCar.duplicateOfVocabularyId, locomotive.vocabularyId);
  const subwayCarRel = batch7RelByCandidate.get('id-v2-698')!;
  assert.equal(subwayCarRel.comparedVocabularyId, 'id-v2-691');
  assert.equal(subwayCarRel.comparedUk, 'ваго́н');
  assert.equal(subwayCarRel.relationshipType, 'MORE_SPECIFIC_SUBTYPE');
  assert.equal(subwayCarRel.countsAsDuplicateConcept, true);

  // Pair 4: Rain boots (id-v2-1522 гумові чо́боти) vs. boots (id-v2-841 чо́боти) vs. swimsuit (id-v2-836 купа́льник)
  const rainBoots = reviewByVocabId.get('id-v2-1522')!;
  const tallBoots = reviewByVocabId.get('id-v2-841')!;
  const swimsuit = reviewByVocabId.get('id-v2-836')!;
  assert.equal(rainBoots.uk, 'гумові чо́боти');
  assert.equal(rainBoots.recommendation, 'exclude');
  assert.equal(rainBoots.duplicateOfVocabularyId, 'id-v2-841');
  assert.equal(rainBoots.canonicalConceptId, tallBoots.conceptId);
  assert.notEqual(rainBoots.duplicateOfVocabularyId, swimsuit.vocabularyId);
  const rainBootsRel = batch7RelByCandidate.get('id-v2-1522')!;
  assert.equal(rainBootsRel.comparedVocabularyId, 'id-v2-841');
  assert.equal(rainBootsRel.comparedUk, 'чо́боти');
  assert.equal(rainBootsRel.relationshipType, 'MORE_SPECIFIC_SUBTYPE');
  assert.equal(rainBootsRel.countsAsDuplicateConcept, true);

  // Pair 5: Street bollard (id-v2-1813 стовпчик обмежувальний) vs. street bollard (id-v2-1342 стовпчи́к тротуа́рний) vs. footbridge (id-v2-1357 місто́к парковий)
  const streetBollard7 = reviewByVocabId.get('id-v2-1813')!;
  const streetBollard5 = reviewByVocabId.get('id-v2-1342')!;
  const footbridge6 = reviewByVocabId.get('id-v2-1357')!;
  assert.equal(streetBollard7.uk, 'стовпчик обмежувальний');
  assert.equal(streetBollard7.recommendation, 'exclude');
  assert.equal(streetBollard7.duplicateOfVocabularyId, undefined);
  assert.equal(streetBollard7.canonicalConceptId, undefined);
  assert.equal(streetBollard5.recommendation, 'review'); // not promoted to keep
  assert.equal(footbridge6.uk, 'місто́к парковий');
  const bollardRel = batch7RelByCandidate.get('id-v2-1813')!;
  assert.equal(bollardRel.comparedVocabularyId, 'id-v2-1342');
  assert.notEqual(bollardRel.comparedVocabularyId, 'id-v2-1357');
  assert.equal(bollardRel.relationshipType, 'SYNONYM_OR_ALTERNATE_HEADWORD');
  assert.equal(bollardRel.countsAsDuplicateConcept, false);

  // Pair 6: Glacier (id-v2-1575 льодови́к) vs. woven skirt (id-v2-1884 плахта тка́на)
  const glacier = reviewByVocabId.get('id-v2-1575')!;
  const wovenSkirtMaster = masterByVocabId.get('id-v2-1884')!;
  assert.equal(glacier.uk, 'льодови́к');
  assert.equal(glacier.en, 'glacier');
  assert.equal(glacier.recommendation, 'exclude');
  assert.equal(glacier.duplicateOfVocabularyId, undefined);
  assert.equal(glacier.canonicalConceptId, undefined);
  assert.equal(wovenSkirtMaster.uk, 'плахта тка́на');
  assert.equal(batch7RelByCandidate.has('id-v2-1575'), false);

  // Pair 7: Olive oil (id-v2-528 оли́вкова олі́я) vs. sunflower oil (id-v2-527 олі́я со́няшникова)
  const oliveOil = reviewByVocabId.get('id-v2-528')!;
  const sunflowerOil = reviewByVocabId.get('id-v2-527')!;
  const sunflowerOilNorm = batch7NormByVocabId.get('id-v2-527')!;
  assert.equal(oliveOil.uk, 'оли́вкова олі́я');
  assert.equal(oliveOil.recommendation, 'exclude');
  assert.equal(oliveOil.duplicateOfVocabularyId, undefined);
  assert.equal(oliveOil.canonicalConceptId, undefined);
  assert.equal(sunflowerOil.uk, 'олі́я со́няшникова');
  assert.equal(sunflowerOil.en, 'sunflower oil');
  assert.equal(sunflowerOil.recommendation, 'keep');
  assert.equal(sunflowerOilNorm.preferredLearnerHeadwordUk, 'олі́я');
  const oliveOilRel = batch7RelByCandidate.get('id-v2-528')!;
  assert.equal(oliveOilRel.comparedVocabularyId, 'id-v2-527');
  assert.equal(oliveOilRel.relationshipType, 'RELATED_BUT_DISTINCT_OBJECT');
  assert.equal(oliveOilRel.countsAsDuplicateConcept, false);

  // Pair 8: Open-faced sandwich (id-v2-579 бутербро́д) vs. closed sandwich (id-v2-580 сендвіч)
  const buterbrod = reviewByVocabId.get('id-v2-579')!;
  const sendvich = reviewByVocabId.get('id-v2-580')!;
  assert.equal(buterbrod.uk, 'бутербро́д');
  assert.equal(buterbrod.recommendation, 'keep');
  assert.equal(sendvich.uk, 'сендвіч');
  assert.equal(sendvich.recommendation, 'exclude');
  assert.equal(sendvich.duplicateOfVocabularyId, undefined);
  assert.equal(sendvich.canonicalConceptId, undefined);
  const sendvichRel = batch7RelByCandidate.get('id-v2-580')!;
  assert.equal(sendvichRel.comparedVocabularyId, 'id-v2-579');
  assert.equal(sendvichRel.relationshipType, 'RELATED_BUT_DISTINCT_OBJECT');
  assert.equal(sendvichRel.countsAsDuplicateConcept, false);

  // Pair 9: Teapot (id-v2-591 чайник зава́рювальний) vs. electric kettle (id-v2-154 електроча́йник)
  const teapot = reviewByVocabId.get('id-v2-591')!;
  const electricKettle = reviewByVocabId.get('id-v2-154')!;
  const teapotNorm = batch7NormByVocabId.get('id-v2-591')!;
  assert.equal(teapot.uk, 'чайник зава́рювальний');
  assert.equal(teapot.recommendation, 'keep');
  assert.equal(electricKettle.uk, 'електроча́йник');
  assert.equal(electricKettle.recommendation, 'keep');
  assert.equal(teapotNorm.preferredLearnerHeadwordUk, 'зава́рник');
  assert.deepEqual(teapotNorm.acceptedConversationalSynonymsUk, [
    'зава́рювальний ча́йник',
    'чайник зава́рювальний',
  ]);
  const teapotRel = batch7RelByCandidate.get('id-v2-591')!;
  assert.equal(teapotRel.comparedVocabularyId, 'id-v2-154');
  assert.equal(teapotRel.relationshipType, 'RELATED_BUT_DISTINCT_OBJECT');
  assert.equal(teapotRel.countsAsDuplicateConcept, false);

  // Pair 10: Leaf lettuce (id-v2-458 сала́т листови́й)
  const leafLettuce = reviewByVocabId.get('id-v2-458')!;
  const leafLettuceNorm = batch7NormByVocabId.get('id-v2-458')!;
  assert.equal(leafLettuce.uk, 'сала́т листови́й');
  assert.equal(leafLettuce.en, 'lettuce');
  assert.equal(leafLettuce.recommendation, 'keep');
  assert.equal(leafLettuceNorm.preferredLearnerHeadwordUk, 'листови́й сала́т');
  assert.deepEqual(leafLettuceNorm.acceptedConversationalSynonymsUk, [
    'сала́т',
    'сала́т листови́й',
  ]);
});

test('Phase 1 Historical Batch Immutability & Cross-Batch Canonical Reference Regression Suite (Batches 1–7): locks per-batch decision checksums and enforces KEEP-only canonical targets across all 1,400 records', async () => {
  const crypto = await import('node:crypto');

  const masterByVocabId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
  );

  const batches = [
    {
      num: 1,
      arr: BATCH_1_CANDIDATE_REVIEWS,
      expectedKeep: 150,
      expectedReview: 20,
      expectedExclude: 30,
      expectedSha256Prefix: 'b30fdd7ea129e22b',
    },
    {
      num: 2,
      arr: BATCH_2_CANDIDATE_REVIEWS,
      expectedKeep: 154,
      expectedReview: 22,
      expectedExclude: 24,
      expectedSha256Prefix: '8f6ea51ae50c25c5',
    },
    {
      num: 3,
      arr: BATCH_3_CANDIDATE_REVIEWS,
      expectedKeep: 132,
      expectedReview: 30,
      expectedExclude: 38,
      expectedSha256Prefix: '0f1c983c7438a289',
    },
    {
      num: 4,
      arr: BATCH_4_CANDIDATE_REVIEWS,
      expectedKeep: 146,
      expectedReview: 26,
      expectedExclude: 28,
      expectedSha256Prefix: 'a58500c00629cc30',
    },
    {
      num: 5,
      arr: BATCH_5_CANDIDATE_REVIEWS,
      expectedKeep: 126,
      expectedReview: 36,
      expectedExclude: 38,
      expectedSha256Prefix: 'c3a55adc3f563b90',
    },
    {
      num: 6,
      arr: BATCH_6_CANDIDATE_REVIEWS,
      expectedKeep: 108,
      expectedReview: 38,
      expectedExclude: 54,
      expectedSha256Prefix: 'c28f2180f8c04040',
    },
    {
      num: 7,
      arr: BATCH_7_CANDIDATE_REVIEWS,
      expectedKeep: 105,
      expectedReview: 36,
      expectedExclude: 59,
      expectedSha256Prefix: '431a3eb85109035b',
    },
    {
      num: 8,
      arr: BATCH_8_CANDIDATE_REVIEWS,
      expectedKeep: 89,
      expectedReview: 49,
      expectedExclude: 62,
      expectedSha256Prefix: 'a1c7c87a123d5e3e',
    },
    {
      num: 9,
      arr: BATCH_9_CANDIDATE_REVIEWS,
      expectedKeep: 93,
      expectedReview: 34,
      expectedExclude: 73,
      expectedSha256Prefix: 'e90df04d48b2e16c',
    },
    {
      num: 10,
      arr: BATCH_10_CANDIDATE_REVIEWS,
      expectedKeep: 76,
      expectedReview: 32,
      expectedExclude: 92,
      expectedSha256Prefix: '5f0657bb9dd0c49f',
    },
  ] as const;

  // 1–3 & 10. Verify each batch has 200 items, exact KEEP/REVIEW/EXCLUDE counts, and immutable (vocabularyId:conceptId:recommendation) SHA-256 checksum
  let totalKeep = 0;
  let totalReview = 0;
  let totalExclude = 0;
  for (const b of batches) {
    assert.equal(b.arr.length, 200, `Batch ${b.num} must contain 200 items`);
    const keepCount = b.arr.filter((r) => r.recommendation === 'keep').length;
    const reviewCount = b.arr.filter((r) => r.recommendation === 'review').length;
    const excludeCount = b.arr.filter((r) => r.recommendation === 'exclude').length;
    assert.equal(keepCount, b.expectedKeep, `Batch ${b.num} KEEP count mismatch`);
    assert.equal(reviewCount, b.expectedReview, `Batch ${b.num} REVIEW count mismatch`);
    assert.equal(excludeCount, b.expectedExclude, `Batch ${b.num} EXCLUDE count mismatch`);

    const decisionDigest = crypto
      .createHash('sha256')
      .update(
        b.arr
          .map((r) => `${r.vocabularyId}:${r.conceptId}:${r.recommendation}`)
          .join('|')
      )
      .digest('hex')
      .slice(0, 16);
    assert.equal(
      decisionDigest,
      b.expectedSha256Prefix,
      `Batch ${b.num} historical decision checksum must remain immutable`
    );

    totalKeep += keepCount;
    totalReview += reviewCount;
    totalExclude += excludeCount;
  }

  assert.equal(totalKeep, 1179);
  assert.equal(totalReview, 323);
  assert.equal(totalExclude, 498);
  assert.equal(totalKeep + totalReview + totalExclude, 2000);

  // 4 & 5. Zero overlap of vocabularyId or conceptId across Batches 1–10, and 100% master field fidelity
  const allReviews = batches.flatMap((b) => b.arr);
  assert.equal(allReviews.length, 2000);
  const reviewByVocabId = new Map(allReviews.map((r) => [r.vocabularyId, r]));
  const seenConceptIds = new Set(allReviews.map((r) => r.conceptId));
  assert.equal(reviewByVocabId.size, 2000);
  assert.equal(seenConceptIds.size, 2000);
  assert.equal(IDENTIFY_MASTER_2000_NOUNS.length - reviewByVocabId.size, 0);

  for (const r of allReviews) {
    const master = masterByVocabId.get(r.vocabularyId);
    assert.ok(master, `Reviewed vocabularyId ${r.vocabularyId} must exist in master`);
    assert.equal(r.conceptId, master.conceptId);
    assert.equal(r.uk, master.uk);
    assert.equal(r.en, master.en);
    assert.equal(r.gender, master.gender);
    assert.equal(r.intendedLexicalSenseEn, master.intendedMeaningEn);
  }

  // 6. Universal canonical-target rule across ALL 2,000 reviewed records (Batches 1–10):
  //    Every duplicateOfVocabularyId / canonicalConceptId on a review record must resolve to an approved KEEP target
  for (const r of allReviews) {
    if (r.duplicateOfVocabularyId || r.canonicalConceptId) {
      assert.ok(
        r.duplicateOfVocabularyId,
        `Record ${r.vocabularyId} with canonicalConceptId must also specify duplicateOfVocabularyId`
      );
      assert.notEqual(
        r.duplicateOfVocabularyId,
        r.vocabularyId,
        `Record ${r.vocabularyId} must not self-reference`
      );
      const targetMaster = masterByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(
        targetMaster,
        `Canonical target ${r.duplicateOfVocabularyId} on ${r.vocabularyId} must exist in master`
      );
      if (r.canonicalConceptId) {
        assert.equal(
          r.canonicalConceptId,
          targetMaster.conceptId,
          `canonicalConceptId on ${r.vocabularyId} must match ${r.duplicateOfVocabularyId}'s master conceptId`
        );
      }
      const targetReview = reviewByVocabId.get(r.duplicateOfVocabularyId);
      assert.ok(
        targetReview,
        `Canonical target ${r.duplicateOfVocabularyId} on ${r.vocabularyId} (Batch ${r.batchNumber}) must be a reviewed record`
      );
      assert.equal(
        targetReview.recommendation,
        'keep',
        `Canonical target ${r.duplicateOfVocabularyId} (${targetReview.uk}, Batch ${targetReview.batchNumber} ${targetReview.recommendation}) referenced by ${r.vocabularyId} (Batch ${r.batchNumber}) must have recommendation === 'keep'`
      );
    }
  }

  // 7. Universal rule across all duplicate/relationship tables in Batches 2–10:
  //    Any record where countsAsDuplicateConcept !== false must resolve to an approved KEEP target.
  const batch2To4Tables = [
    ...IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.canonicalVocabularyId,
      targetConceptId: rec.canonicalConceptId,
      countsAsDuplicateConcept: true,
    })),
    ...IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.canonicalVocabularyId,
      targetConceptId: rec.canonicalConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept ?? true,
    })),
    ...IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.canonicalVocabularyId,
      targetConceptId: rec.canonicalConceptId,
      countsAsDuplicateConcept: true,
    })),
  ];

  const batch5To10Tables = [
    ...IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
    ...IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
    ...IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
    ...IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
    ...IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
    ...IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.map((rec) => ({
      batchNumber: rec.batchNumber,
      candidateVocabularyId: rec.candidateVocabularyId,
      targetVocabularyId: rec.comparedVocabularyId,
      targetConceptId: rec.comparedConceptId,
      countsAsDuplicateConcept: rec.countsAsDuplicateConcept,
    })),
  ];

  for (const rel of [...batch2To4Tables, ...batch5To10Tables]) {
    const targetMaster = masterByVocabId.get(rel.targetVocabularyId);
    assert.ok(targetMaster);
    assert.equal(rel.targetConceptId, targetMaster.conceptId);
    const targetReview = reviewByVocabId.get(rel.targetVocabularyId);
    assert.ok(
      targetReview,
      `Target ${rel.targetVocabularyId} referenced in Batch ${rel.batchNumber} relationship table must be reviewed`
    );
    if (rel.countsAsDuplicateConcept) {
      assert.equal(
        targetReview.recommendation,
        'keep',
        `Duplicate relationship target ${rel.targetVocabularyId} (from ${rel.candidateVocabularyId} in Batch ${rel.batchNumber}) with countsAsDuplicateConcept=true must have recommendation === 'keep'`
      );
    }
  }

  // 8. Explicit regression checks for the 6 older canonical reference defects
  // Case 1: Batch 3 id-v2-1771 (ва́тні па́лички, cotton swabs, exclude) vs. id-v2-316 (ва́тна па́личка, cotton swab, review)
  const cottonSwabsPlural = reviewByVocabId.get('id-v2-1771')!;
  const cottonSwabSingular = reviewByVocabId.get('id-v2-316')!;
  assert.equal(cottonSwabsPlural.batchNumber, 3);
  assert.equal(cottonSwabsPlural.uk, 'ва́тні па́лички');
  assert.equal(cottonSwabsPlural.en, 'cotton swabs');
  assert.equal(cottonSwabsPlural.recommendation, 'exclude');
  assert.equal(cottonSwabsPlural.duplicateOfVocabularyId, undefined);
  assert.equal(cottonSwabsPlural.canonicalConceptId, undefined);
  assert.equal(cottonSwabSingular.batchNumber, 3);
  assert.equal(cottonSwabSingular.uk, 'ва́тна па́личка');
  assert.equal(cottonSwabSingular.recommendation, 'review');
  const batch3SwabsRel = IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS.find(
    (r) => r.candidateVocabularyId === 'id-v2-1771'
  )!;
  assert.equal(batch3SwabsRel.canonicalVocabularyId, 'id-v2-316');
  assert.equal(batch3SwabsRel.countsAsDuplicateConcept, false);

  // Case 2: Batch 3 id-v2-1772 (ва́тні ди́ски, cotton makeup pads, exclude) vs. id-v2-317 (ва́тний диск, cotton pad, review)
  const cottonPadsPlural = reviewByVocabId.get('id-v2-1772')!;
  const cottonPadSingular = reviewByVocabId.get('id-v2-317')!;
  assert.equal(cottonPadsPlural.batchNumber, 3);
  assert.equal(cottonPadsPlural.uk, 'ва́тні ди́ски');
  assert.equal(cottonPadsPlural.en, 'cotton makeup pads');
  assert.equal(cottonPadsPlural.recommendation, 'exclude');
  assert.equal(cottonPadsPlural.duplicateOfVocabularyId, undefined);
  assert.equal(cottonPadsPlural.canonicalConceptId, undefined);
  assert.equal(cottonPadSingular.batchNumber, 3);
  assert.equal(cottonPadSingular.uk, 'ва́тний диск');
  assert.equal(cottonPadSingular.recommendation, 'review');
  const batch3PadsRel = IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS.find(
    (r) => r.candidateVocabularyId === 'id-v2-1772'
  )!;
  assert.equal(batch3PadsRel.canonicalVocabularyId, 'id-v2-317');
  assert.equal(batch3PadsRel.countsAsDuplicateConcept, false);

  // Case 3: Batch 3 id-v2-1764 (щі́тка для уніта́за (йоржик), toilet bowl brush, exclude)
  //         must NOT reference id-v2-1166 (камі́нна поли́ця, mantelpiece, Batch 1 exclude)
  //         or id-v2-292 (йоржик, toilet brush, Batch 1 exclude) as an approved canonical target
  const toiletBrush3 = reviewByVocabId.get('id-v2-1764')!;
  const mantelpiece1 = reviewByVocabId.get('id-v2-1166')!;
  const toiletBrush1 = reviewByVocabId.get('id-v2-292')!;
  assert.equal(toiletBrush3.batchNumber, 3);
  assert.equal(toiletBrush3.uk, 'щі́тка для уніта́за (йоржик)');
  assert.equal(toiletBrush3.en, 'toilet bowl brush');
  assert.equal(toiletBrush3.recommendation, 'exclude');
  assert.equal(toiletBrush3.duplicateOfVocabularyId, undefined);
  assert.equal(toiletBrush3.canonicalConceptId, undefined);
  assert.equal(mantelpiece1.batchNumber, 1);
  assert.equal(mantelpiece1.uk, 'камі́нна поли́ця');
  assert.equal(mantelpiece1.en, 'mantelpiece');
  assert.equal(mantelpiece1.recommendation, 'exclude');
  assert.equal(toiletBrush1.batchNumber, 1);
  assert.equal(toiletBrush1.uk, 'йоржик');
  assert.equal(toiletBrush1.en, 'toilet brush');
  assert.equal(toiletBrush1.recommendation, 'exclude');

  // Case 4: Batch 5 id-v2-1964 (шредер (зни́щувач папе́рів), office paper shredder, exclude)
  //         vs. Batch 5 id-v2-770 (шре́дер, paper shredder, review)
  const officeShredder5 = reviewByVocabId.get('id-v2-1964')!;
  const paperShredder5 = reviewByVocabId.get('id-v2-770')!;
  assert.equal(officeShredder5.batchNumber, 5);
  assert.equal(officeShredder5.uk, 'шредер (зни́щувач папе́рів)');
  assert.equal(officeShredder5.en, 'office paper shredder');
  assert.equal(officeShredder5.recommendation, 'exclude');
  assert.equal(officeShredder5.duplicateOfVocabularyId, undefined);
  assert.equal(officeShredder5.canonicalConceptId, undefined);
  assert.equal(paperShredder5.batchNumber, 5);
  assert.equal(paperShredder5.uk, 'шре́дер');
  assert.equal(paperShredder5.recommendation, 'review');
  const batch5ShredderRel = IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS.find(
    (r) => r.candidateVocabularyId === 'id-v2-1964'
  )!;
  assert.equal(batch5ShredderRel.comparedVocabularyId, 'id-v2-770');
  assert.equal(batch5ShredderRel.countsAsDuplicateConcept, false);

  // Case 5: Batch 6 id-v2-1384 (рука́в посадко́вий (телетрап), aerobridge / jet bridge, exclude)
  //         vs. Batch 6 id-v2-1843 (телетра́п (рука́в посадкóвий), jet bridge walkway, review)
  const jetBridgeA6 = reviewByVocabId.get('id-v2-1384')!;
  const jetBridgeB6 = reviewByVocabId.get('id-v2-1843')!;
  assert.equal(jetBridgeA6.batchNumber, 6);
  assert.equal(jetBridgeA6.uk, 'рука́в посадко́вий (телетрап)');
  assert.equal(jetBridgeA6.en, 'aerobridge / jet bridge');
  assert.equal(jetBridgeA6.recommendation, 'exclude');
  assert.equal(jetBridgeA6.duplicateOfVocabularyId, undefined);
  assert.equal(jetBridgeA6.canonicalConceptId, undefined);
  assert.equal(jetBridgeB6.batchNumber, 6);
  assert.equal(jetBridgeB6.uk, 'телетра́п (рука́в посадкóвий)');
  assert.equal(jetBridgeB6.recommendation, 'review');
  const batch6JetBridgeRel = IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS.find(
    (r) => r.candidateVocabularyId === 'id-v2-1384'
  )!;
  assert.equal(batch6JetBridgeRel.comparedVocabularyId, 'id-v2-1843');
  assert.equal(batch6JetBridgeRel.countsAsDuplicateConcept, false);

  // Case 6: Batch 6 id-v2-1806 (бруківка кам’яна́, cobblestone pavement, exclude)
  //         vs. Batch 4 id-v2-609 (брукі́вка, cobblestone pavement, review)
  const cobblestone6 = reviewByVocabId.get('id-v2-1806')!;
  const cobblestone4 = reviewByVocabId.get('id-v2-609')!;
  assert.equal(cobblestone6.batchNumber, 6);
  assert.equal(cobblestone6.uk, 'бруківка кам’яна́');
  assert.equal(cobblestone6.en, 'cobblestone pavement');
  assert.equal(cobblestone6.recommendation, 'exclude');
  assert.equal(cobblestone6.duplicateOfVocabularyId, undefined);
  assert.equal(cobblestone6.canonicalConceptId, undefined);
  assert.equal(cobblestone4.batchNumber, 4);
  assert.equal(cobblestone4.uk, 'брукі́вка');
  assert.equal(cobblestone4.recommendation, 'review');
  const batch6CobblestoneRel = IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS.find(
    (r) => r.candidateVocabularyId === 'id-v2-1806'
  )!;
  assert.equal(batch6CobblestoneRel.comparedVocabularyId, 'id-v2-609');
  assert.equal(batch6CobblestoneRel.countsAsDuplicateConcept, false);

  // 11–13. Verify 34 genuine missing concepts, 29 course modules, 28 tracks, and 10 scenes / 49 active targets / 2,471 unverified excluded
  const gapReport = getBatch4CorrectedVocabularyGapReport();
  assert.equal(gapReport.genuinelyMissingConceptsCount, 34);
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(getAllCourseTracks().length, 28);
  const coverageSummary = computeMasterVocabularyCoverageSummary();
  assert.equal(coverageSummary.scenesReadyForStudentsCount, 10);
  assert.equal(coverageSummary.verifiedActiveTargetAssociationsCount, 49);
  assert.equal(coverageSummary.unverifiedPlannedAssociationsCount, 2471);
});

test('Phase 1 Batch 8 Selective Everyday Vocabulary Curation & Duplicate/Specialist Exclusion Suite: verifies 10 checkpoint-identified everyday candidates, 6 specialist exclusions, and cross-batch duplicate links', () => {
  // 1. Verify the 9 checkpoint-identified non-duplicate everyday concepts are KEEP in Batch 8
  const batch8KeepCheckpointIds = [
    'id-v2-1599', // повіде́ць (dog leash)
    'id-v2-1602', // аква́ріум (fish tank / aquarium)
    'id-v2-1615', // папу́га (parrot)
    'id-v2-1617', // пінгві́н (penguin)
    'id-v2-1620', // аку́ла (shark)
    'id-v2-1181', // мийний за́сіб (dishwashing liquid bottle)
    'id-v2-1443', // закла́дка книжко́ва (bookmark)
    'id-v2-1682', // бату́т (trampoline)
    'id-v2-1686', // самока́т дитя́чий (kick scooter)
  ];
  for (const id of batch8KeepCheckpointIds) {
    const decision = getSavedCurationDecision(id);
    assert.ok(decision, `Expected Batch 8 decision for ${id}`);
    assert.equal(decision.batchNumber, 8);
    assert.equal(decision.recommendation, 'keep');
  }

  // 2. Verify the 10th checkpoint-identified candidate (id-v2-1775 ваги́ підлогові́) is in Batch 8 and excluded as a word-order duplicate of Batch 3 KEEP id-v2-319 (підло́гові ваги́)
  const floorScale8 = getSavedCurationDecision('id-v2-1775')!;
  const floorScale3 = getSavedCurationDecision('id-v2-319')!;
  assert.ok(floorScale8);
  assert.equal(floorScale8.batchNumber, 8);
  assert.equal(floorScale8.uk, 'ваги́ підлогові́');
  assert.equal(floorScale8.recommendation, 'exclude');
  assert.equal(floorScale8.duplicateOfVocabularyId, 'id-v2-319');
  assert.equal(floorScale8.canonicalConceptId, floorScale3.conceptId);
  assert.equal(floorScale3.batchNumber, 3);
  assert.equal(floorScale3.recommendation, 'keep');

  // 3. Verify all 6 specialist / technical / low-value examples are in Batch 8 and excluded
  const specialistExcludeIds = [
    'id-v2-1468', // ваги́ лабораторні (analytical balance)
    'id-v2-1470', // колба круглодо́нна (Florence flask)
    'id-v2-1651', // брекети (модель) (orthodontic model)
    'id-v2-1717', // макетна пла́та (electronics breadboard)
    'id-v2-1718', // мікросхе́ма / чип (integrated circuit chip)
    'id-v2-1865', // паліту́рна маши́на (біндер) (comb binding machine)
  ];
  for (const id of specialistExcludeIds) {
    const decision = getSavedCurationDecision(id);
    assert.ok(decision, `Expected Batch 8 decision for specialist item ${id}`);
    assert.equal(decision.batchNumber, 8);
    assert.equal(decision.recommendation, 'exclude');
  }

  // 4. Verify Batch 8 semantic relationships (19 total, 10 duplicate-concept links) and headword normalizations (15 total)
  assert.equal(IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS.length, 19);
  const duplicateLinks = IDENTIFY_BATCH_8_SEMANTIC_RELATIONSHIP_RECORDS.filter(
    (r) => r.countsAsDuplicateConcept
  );
  assert.equal(duplicateLinks.length, 10);
  assert.equal(IDENTIFY_BATCH_8_HEADWORD_NORMALIZATION_RECORDS.length, 15);
});

test('Phase 1 Batch 9 Selective Vocabulary Curation and Semantic Integrity: verifies 200 candidates, priority breakdown, union literals, 31 semantic relationships, 17 headword normalizations, 22 essential justifications, and 34 missing concepts', async () => {
  const { EXPLICIT_BATCH_9_ASSESSMENTS } = await import(
    '../identifyCurriculumCurationPhase1Batch9.ts'
  );

  const masterByVocabId = new Map(
    IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
  );
  const prev1600Reviews = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
    ...BATCH_7_CANDIDATE_REVIEWS,
    ...BATCH_8_CANDIDATE_REVIEWS,
  ];
  const prevVocabIds = new Set(prev1600Reviews.map((r) => r.vocabularyId));
  const prevConceptIds = new Set(prev1600Reviews.map((r) => r.conceptId));
  const all1800Reviews = [...prev1600Reviews, ...BATCH_9_CANDIDATE_REVIEWS];
  const reviewByVocabId = new Map(all1800Reviews.map((r) => [r.vocabularyId, r]));

  // A. Candidate coverage
  assert.equal(BATCH_9_CANDIDATE_REVIEWS.length, 200);
  const batch9VocabIds = new Set<string>();
  const batch9ConceptIds = new Set<string>();
  for (const r of BATCH_9_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 9);
    assert.equal(prevVocabIds.has(r.vocabularyId), false);
    assert.equal(prevConceptIds.has(r.conceptId), false);
    const master = masterByVocabId.get(r.vocabularyId);
    assert.ok(master, `Batch 9 candidate ${r.vocabularyId} must exist in master`);
    assert.equal(r.conceptId, master.conceptId);
    assert.equal(r.uk, master.uk);
    assert.equal(r.en, master.en);
    assert.equal(r.gender, master.gender);
    assert.equal(r.intendedLexicalSenseEn, master.intendedMeaningEn);
    batch9VocabIds.add(r.vocabularyId);
    batch9ConceptIds.add(r.conceptId);
  }
  assert.equal(batch9VocabIds.size, 200);
  assert.equal(batch9ConceptIds.size, 200);

  // B. Recommendation counts and priority breakdown
  const stats9 = computeCurationBatchStatistics(BATCH_9_CANDIDATE_REVIEWS);
  assert.equal(stats9.recommendedKeepCount, 93);
  assert.equal(stats9.recommendedReviewCount, 34);
  assert.equal(stats9.recommendedExcludeCount, 73);
  assert.deepEqual(stats9.priorityBreakdownOfKept, {
    essential_everyday: 22,
    common_situational: 60,
    useful_extended: 11,
  });

  // C. Assessment metadata & valid union literals
  const assessmentKeys = Object.keys(EXPLICIT_BATCH_9_ASSESSMENTS);
  assert.equal(assessmentKeys.length, 200);
  for (const key of assessmentKeys) {
    assert.equal(batch9VocabIds.has(key), true, `No orphan assessment key ${key}`);
  }

  const allowedPriorities = new Set([
    'essential_everyday',
    'common_situational',
    'useful_extended',
    'none_exclude',
  ]);
  const allowedRelevance = new Set([
    'high_daily',
    'moderate_situational',
    'low_niche',
  ]);
  const allowedVisual = new Set([
    'clear_distinct_object',
    'context_dependent',
    'poor_or_ambiguous',
  ]);
  const allowedFlags = new Set([
    'duplicate_concept',
    'inflected_plural_duplicate',
    'modifier_padded_duplicate',
    'compositional_phrase',
    'hypernym_ambiguous',
    'obscure_or_rare',
    'overly_specialized',
    'unnatural_scene_filler',
    'polysemy_sense_preserved',
  ]);
  const allowedFramings = new Set([
    'full_room_scene',
    'close_up_detail',
    'food_table_display',
    'market_counter_display',
    'clothing_wardrobe_display',
    'human_body_portrait_illustration',
    'street_urban_scene',
    'public_service_environment',
    'outdoor_nature_scene',
  ]);

  for (const r of BATCH_9_CANDIDATE_REVIEWS) {
    assert.equal(allowedPriorities.has(r.recommendedPriority), true);
    assert.equal(allowedRelevance.has(r.everydayRelevance), true);
    assert.equal(allowedVisual.has(r.visualRecognizability), true);
    const explicitAssessment = EXPLICIT_BATCH_9_ASSESSMENTS[r.vocabularyId];
    assert.ok(explicitAssessment);
    assert.equal(
      allowedFramings.has(explicitAssessment.recommendedVisualFraming),
      true,
      `Expected valid IdentifyVisualSceneFraming for ${r.vocabularyId}`
    );
    for (const flag of r.issueFlags) {
      assert.equal(allowedFlags.has(flag), true);
    }
  }

  // D. Semantic relationships (31 total: 21 approved canonical duplicates + 10 non-duplicate comparisons)
  assert.equal(IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS.length, 31);
  const dupRels = IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS.filter(
    (r) => r.countsAsDuplicateConcept
  );
  const nonDupRels = IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS.filter(
    (r) => !r.countsAsDuplicateConcept
  );
  assert.equal(dupRels.length, 21);
  assert.equal(nonDupRels.length, 10);

  for (const rel of IDENTIFY_BATCH_9_SEMANTIC_RELATIONSHIP_RECORDS) {
    assert.notEqual(rel.candidateVocabularyId, rel.comparedVocabularyId);
    const candMaster = masterByVocabId.get(rel.candidateVocabularyId);
    const compMaster = masterByVocabId.get(rel.comparedVocabularyId);
    assert.ok(candMaster);
    assert.ok(compMaster);
    assert.equal(rel.candidateConceptId, candMaster.conceptId);
    assert.equal(rel.candidateUk, candMaster.uk);
    assert.equal(rel.candidateEn, candMaster.en);
    assert.equal(rel.comparedConceptId, compMaster.conceptId);
    assert.equal(rel.comparedUk, compMaster.uk);
    assert.equal(rel.comparedEn, compMaster.en);

    const candReview = reviewByVocabId.get(rel.candidateVocabularyId);
    const compReview = reviewByVocabId.get(rel.comparedVocabularyId);
    assert.ok(candReview);
    assert.ok(compReview);

    if (rel.countsAsDuplicateConcept) {
      assert.equal(compReview.recommendation, 'keep');
      assert.equal(candReview.recommendation, 'exclude');
      assert.equal(candReview.duplicateOfVocabularyId, rel.comparedVocabularyId);
      assert.equal(candReview.canonicalConceptId, compMaster.conceptId);
    } else {
      assert.equal(candReview.duplicateOfVocabularyId, undefined);
      assert.equal(candReview.canonicalConceptId, undefined);
    }
  }

  // Targeted Batch 9 semantic assertions
  // 1. id-v2-1844 (ілюміна́тор літака́, airplane oval window) vs approved Batch 7 KEEP id-v2-684 (ілюміна́тор, airplane window)
  const airplaneWindowDup9 = reviewByVocabId.get('id-v2-1844')!;
  const airplaneWindowCanon7 = reviewByVocabId.get('id-v2-684')!;
  assert.equal(airplaneWindowDup9.uk, 'ілюміна́тор літака́');
  assert.equal(airplaneWindowDup9.en, 'airplane oval window');
  assert.equal(airplaneWindowDup9.recommendation, 'exclude');
  assert.equal(airplaneWindowDup9.duplicateOfVocabularyId, 'id-v2-684');
  assert.equal(airplaneWindowDup9.canonicalConceptId, airplaneWindowCanon7.conceptId);
  assert.equal(airplaneWindowCanon7.recommendation, 'keep');

  // 2. id-v2-1839 (валі́за на коліща́тах, rolling carry-on suitcase) vs approved Batch 1 KEEP at-suitcase (валі́за, suitcase)
  const wheeledSuitcase9 = reviewByVocabId.get('id-v2-1839')!;
  const suitcaseCanon1 = reviewByVocabId.get('at-suitcase')!;
  assert.equal(wheeledSuitcase9.uk, 'валі́за на коліща́тах');
  assert.equal(wheeledSuitcase9.en, 'rolling carry-on suitcase');
  assert.equal(wheeledSuitcase9.recommendation, 'exclude');
  assert.equal(wheeledSuitcase9.duplicateOfVocabularyId, 'at-suitcase');
  assert.equal(wheeledSuitcase9.canonicalConceptId, suitcaseCanon1.conceptId);
  assert.equal(suitcaseCanon1.recommendation, 'keep');

  // 3. id-v2-1860 (пена́л шкільни́й, zippered pencil case) vs approved Batch 4 KEEP id-v2-751 (пена́л, pencil case)
  const pencilCaseDup9 = reviewByVocabId.get('id-v2-1860')!;
  const pencilCaseCanon4 = reviewByVocabId.get('id-v2-751')!;
  assert.equal(pencilCaseDup9.uk, 'пена́л шкільни́й');
  assert.equal(pencilCaseDup9.en, 'zippered pencil case');
  assert.equal(pencilCaseDup9.recommendation, 'exclude');
  assert.equal(pencilCaseDup9.duplicateOfVocabularyId, 'id-v2-751');
  assert.equal(pencilCaseDup9.canonicalConceptId, pencilCaseCanon4.conceptId);
  assert.equal(pencilCaseCanon4.recommendation, 'keep');

  // 4. id-v2-1902 (щи́пчики для брів (пінце́т), eyebrow tweezers) vs approved Batch 5 KEEP id-v2-312 (пінце́т, tweezers)
  const eyebrowTweezers9 = reviewByVocabId.get('id-v2-1902')!;
  const tweezersCanon5 = reviewByVocabId.get('id-v2-312')!;
  assert.equal(eyebrowTweezers9.uk, 'щи́пчики для брів (пінце́т)');
  assert.equal(eyebrowTweezers9.en, 'eyebrow tweezers');
  assert.equal(eyebrowTweezers9.recommendation, 'exclude');
  assert.equal(eyebrowTweezers9.duplicateOfVocabularyId, 'id-v2-312');
  assert.equal(eyebrowTweezers9.canonicalConceptId, tweezersCanon5.conceptId);
  assert.equal(tweezersCanon5.recommendation, 'keep');

  // 5. id-v2-1928 (тепли́ця скляна́ (оранжере́я), garden greenhouse) vs approved Batch 8 KEEP id-v2-1581 (тепли́ця / парни́к, greenhouse)
  const glassGreenhouse9 = reviewByVocabId.get('id-v2-1928')!;
  const greenhouseCanon8 = reviewByVocabId.get('id-v2-1581')!;
  assert.equal(glassGreenhouse9.uk, 'тепли́ця скляна́ (оранжере́я)');
  assert.equal(glassGreenhouse9.en, 'garden greenhouse');
  assert.equal(glassGreenhouse9.recommendation, 'exclude');
  assert.equal(glassGreenhouse9.duplicateOfVocabularyId, 'id-v2-1581');
  assert.equal(glassGreenhouse9.canonicalConceptId, greenhouseCanon8.conceptId);
  assert.equal(greenhouseCanon8.recommendation, 'keep');

  // 6. id-v2-1930 (сека́тор садо́вий, hand pruning shears) vs approved Batch 3 KEEP id-v2-384 (сека́тор, pruning shears)
  const gardenSecateurs9 = reviewByVocabId.get('id-v2-1930')!;
  const secateursCanon3 = reviewByVocabId.get('id-v2-384')!;
  assert.equal(gardenSecateurs9.uk, 'сека́тор садо́вий');
  assert.equal(gardenSecateurs9.en, 'hand pruning shears');
  assert.equal(gardenSecateurs9.recommendation, 'exclude');
  assert.equal(gardenSecateurs9.duplicateOfVocabularyId, 'id-v2-384');
  assert.equal(gardenSecateurs9.canonicalConceptId, secateursCanon3.conceptId);
  assert.equal(secateursCanon3.recommendation, 'keep');

  // 7. id-v2-1592 (коса́ ручна́, scythe) preserved as distinct polysemous sense vs Batch 8 KEEP id-v2-1499 (коса́ (зачіска), braided hair)
  const scythe9 = reviewByVocabId.get('id-v2-1592')!;
  const braidedHair8 = reviewByVocabId.get('id-v2-1499')!;
  assert.equal(scythe9.uk, 'коса́ ручна́');
  assert.equal(scythe9.en, 'scythe');
  assert.equal(scythe9.recommendation, 'keep');
  assert.equal(scythe9.issueFlags.includes('polysemy_sense_preserved'), true);
  assert.equal(scythe9.duplicateOfVocabularyId, undefined);
  assert.equal(braidedHair8.uk, 'коса́ (зачіска)');
  assert.equal(braidedHair8.recommendation, 'keep');

  // E. Headword normalizations (17 records, non-destructive to master registry)
  assert.equal(IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS.length, 17);
  for (const norm of IDENTIFY_BATCH_9_HEADWORD_NORMALIZATION_RECORDS) {
    const master = masterByVocabId.get(norm.vocabularyId);
    assert.ok(master);
    assert.equal(norm.conceptId, master.conceptId);
    assert.equal(norm.originalMasterHeadwordUk, master.uk);
    assert.equal(norm.englishGlossEn, master.en);
    assert.equal(norm.gender, master.gender);
    assert.equal(norm.reviewedInBatchNumber, 9);
    assert.ok(norm.preferredLearnerHeadwordUk.length > 0);
    assert.notEqual(master.uk, norm.preferredLearnerHeadwordUk);
  }

  // F. Essential everyday justifications (22 records matching all 22 Batch 9 essential_everyday KEEP items)
  assert.equal(IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS.length, 22);
  const essentialKeepIds9 = new Set(
    BATCH_9_CANDIDATE_REVIEWS.filter(
      (r) =>
        r.recommendation === 'keep' &&
        r.recommendedPriority === 'essential_everyday'
    ).map((r) => r.vocabularyId)
  );
  assert.equal(essentialKeepIds9.size, 22);
  for (const reason of IDENTIFY_BATCH_9_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS) {
    const master = masterByVocabId.get(reason.vocabularyId);
    assert.ok(master);
    assert.equal(reason.conceptId, master.conceptId);
    assert.equal(reason.uk, master.uk);
    assert.equal(reason.en, master.en);
    assert.equal(essentialKeepIds9.has(reason.vocabularyId), true);
    assert.ok(reason.independentPedagogicalJustificationEn.length > 20);
  }

  // G. Preserve 34 genuine missing everyday concepts separate from master and Batch 9
  const correctedGap = getBatch4CorrectedVocabularyGapReport();
  assert.equal(correctedGap.totalRecordsAudited, 54);
  assert.equal(correctedGap.reclassifiedNonMissingCount, 20);
  assert.equal(correctedGap.genuinelyMissingConceptsCount, 34);
  assert.equal(correctedGap.records.length, 54);

  const batch9NormalizedUkSet = new Set(
    BATCH_9_CANDIDATE_REVIEWS.map((r) => r.uk.trim().toLowerCase())
  );
  const missingConceptRecords = correctedGap.records.filter(
    (rec) => rec.countsAsMissingConcept
  );
  assert.equal(missingConceptRecords.length, 34);

  const distinctMissingIdentities = new Set<string>();
  for (const rec of missingConceptRecords) {
    assert.equal(rec.countsAsMissingConcept, true);
    assert.equal(rec.relationshipType, 'GENUINELY_MISSING_CONCEPT');
    assert.equal(rec.canonicalStatusInCuration, 'missing_from_2000_registry');
    assert.equal(rec.existingMasterVocabularyIds.length, 0);
    assert.equal(rec.existingMasterUkForms.length, 0);
    for (const existingId of rec.existingMasterVocabularyIds) {
      assert.equal(batch9VocabIds.has(existingId), false);
      assert.equal(masterByVocabId.has(existingId), false);
    }
    assert.equal(
      batch9NormalizedUkSet.has(rec.proposedUk.trim().toLowerCase()),
      false
    );
    const identityKey = `${rec.proposedUk.trim().toLowerCase()}::${rec.proposedEn.trim().toLowerCase()}`;
    distinctMissingIdentities.add(identityKey);
  }
  assert.equal(distinctMissingIdentities.size, 34);
});

test('Phase 1 Batch 10 Final Curation, Final 1,200-Concept Curriculum Reconciliation & 80-Scene Ukrainian Plan: verifies all 200 Batch 10 decisions, 1,200 unique final concepts, 80 contemporary Ukrainian scenes, and learner safety gates', () => {
  // 1. Batch 10 exact counts (76 KEEP: 4 essential, 65 common, 7 useful; 32 REVIEW; 92 EXCLUDE)
  assert.equal(BATCH_10_CANDIDATE_REVIEWS.length, 200);
  const stats10 = computeCurationBatchStatistics(BATCH_10_CANDIDATE_REVIEWS);
  assert.equal(stats10.recommendedKeepCount, 76);
  assert.equal(stats10.recommendedReviewCount, 32);
  assert.equal(stats10.recommendedExcludeCount, 92);
  assert.deepEqual(stats10.priorityBreakdownOfKept, {
    essential_everyday: 4,
    common_situational: 65,
    useful_extended: 7,
  });

  // 2. Batch 10 semantic relationships (133 total: 29 canonical duplicates, 104 comparison-only)
  assert.equal(IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.length, 133);
  const batch10DupRels = IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.filter(
    (r) => r.countsAsDuplicateConcept
  );
  const batch10NonDupRels = IDENTIFY_BATCH_10_SEMANTIC_RELATIONSHIP_RECORDS.filter(
    (r) => !r.countsAsDuplicateConcept
  );
  assert.equal(batch10DupRels.length, 29);
  assert.equal(batch10NonDupRels.length, 104);
  assert.equal(IDENTIFY_BATCH_10_HEADWORD_NORMALIZATION_RECORDS.length, 56);
  assert.equal(IDENTIFY_BATCH_10_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS.length, 4);

  // 3. Final 1,200-Concept Reconciliation math & uniqueness
  assert.equal(IDENTIFY_RECONCILED_DEMOTED_PROVISIONAL_KEEPS_14.length, 14);
  assert.equal(IDENTIFY_RECONCILED_PROMOTED_REVIEWS_7.length, 7);
  assert.equal(IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28.length, 28);
  assert.equal(IDENTIFY_CONTEXTUAL_NON_CLICKABLE_MISSING_WORDS_6.length, 6);
  assert.equal(
    IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28.length +
      IDENTIFY_CONTEXTUAL_NON_CLICKABLE_MISSING_WORDS_6.length,
    34
  );

  assert.equal(IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.length, 1200);
  const conceptIdSet = new Set(
    IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.map((c) => c.conceptId)
  );
  const vocabIdSet = new Set(
    IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.map((c) => c.vocabularyId)
  );
  assert.equal(conceptIdSet.size, 1200);
  assert.equal(vocabIdSet.size, 1200);

  const retainedKeeps = IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.filter(
    (c) => c.sourcePool === 'legacy_master_provisional_keep'
  ).length;
  const promotedReviews = IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.filter(
    (c) => c.sourcePool === 'legacy_master_promoted_review'
  ).length;
  const missingExtensions = IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.filter(
    (c) => c.sourcePool === 'missing_concept_extension_28'
  ).length;
  assert.equal(retainedKeeps, 1165);
  assert.equal(promotedReviews, 7);
  assert.equal(missingExtensions, 28);
  assert.equal(retainedKeeps + promotedReviews + missingExtensions, 1200);

  // 4. 80-Scene Ukrainian Photorealistic Curriculum Plan
  assert.equal(IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.length, 80);
  const coveredConceptIds = new Set<string>();
  let totalAssociations = 0;
  let verifiedHotspots = 0;
  let unverifiedHotspots = 0;
  let readyScenes = 0;
  let plannedScenes = 0;

  for (const scene of IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN) {
    assert.equal(scene.languageCode, 'uk');
    assert.equal(scene.targetCount, 18);
    assert.equal(scene.targets.length, 18);
    assert.equal(scene.containsForeignLandmarks, false);
    assert.ok(scene.ukrainianCulturalAnchorsEn.length >= 2);
    assert.ok(scene.generationPromptEn.includes('Contemporary 2020s Ukraine'));

    const sceneVocabIds = new Set<string>();
    for (const t of scene.targets) {
      sceneVocabIds.add(t.vocabularyId);
      coveredConceptIds.add(t.conceptId);
      totalAssociations++;
      if (t.hotspotVerified) {
        verifiedHotspots++;
      } else {
        unverifiedHotspots++;
      }
    }
    assert.equal(sceneVocabIds.size, 18, `Scene ${scene.sceneCode} must have 18 unique targets`);

    if (scene.learnerExposureAllowed && scene.verificationStatus === 'verified_playable') {
      readyScenes++;
    } else {
      plannedScenes++;
    }
  }

  assert.equal(totalAssociations, 1440);
  assert.equal(coveredConceptIds.size, 1200);
  assert.equal(readyScenes, 10);
  assert.equal(plannedScenes, 70);
  assert.equal(verifiedHotspots, 49);
  assert.equal(unverifiedHotspots, 1391);
  assert.equal(IDENTIFY_IMAGE_GENERATION_PROBE_RESULT.probeStatus, 'RESOURCE_EXHAUSTED');

  // 5. Independent Verification of Repaired Missing-Concept Extensions (ext-v2-0001..0028)
  //    and Retirement of Outdated Pre-Batch-4 Extensions (ext-v1-0001..0028)
  assert.equal(IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28.length, 28);
  const retiredIds = new Set(
    IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28.map((r) => r.retiredVocabularyId)
  );
  for (const r of IDENTIFY_RETIRED_OUTDATED_EXTENSIONS_28) {
    assert.equal(r.retirementStatus, 'retired_never_reused');
    assert.equal(vocabIdSet.has(r.retiredVocabularyId), false);
    assert.equal(conceptIdSet.has(r.retiredConceptId), false);
  }

  const stripStress = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0301]/g, '')
      .normalize('NFC')
      .toLowerCase()
      .trim();

  const genuine34Records = IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.filter(
    (rec) => rec.countsAsMissingConcept
  );
  assert.equal(genuine34Records.length, 34);
  const genuine34ProposedUkSet = new Set(
    genuine34Records.map((r) => stripStress(r.proposedUk))
  );

  for (const ext of IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28) {
    assert.equal(ext.vocabularyId.startsWith('ext-v2-'), true);
    assert.equal(ext.conceptId.startsWith('missing-concept-v2-'), true);
    assert.equal(retiredIds.has(ext.vocabularyId), false);
    assert.equal(
      genuine34ProposedUkSet.has(stripStress(ext.originalAuditProposedUk)),
      true,
      `Extension ${ext.vocabularyId} (${ext.originalAuditProposedUk}) must come from the 34 genuine missing concepts`
    );
  }
  for (const ctx of IDENTIFY_CONTEXTUAL_NON_CLICKABLE_MISSING_WORDS_6) {
    assert.equal(
      genuine34ProposedUkSet.has(stripStress(ctx.uk)),
      true,
      `Contextual word ${ctx.contextualId} (${ctx.uk}) must come from the 34 genuine missing concepts`
    );
  }

  // 6. Verify 14 Demoted Provisional KEEPs and 7 Promoted REVIEWs match actual Batch 1..10 review records
  const all2000Reviews = [
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
  const reviewById = new Map(all2000Reviews.map((r) => [r.vocabularyId, r]));

  for (const dem of IDENTIFY_RECONCILED_DEMOTED_PROVISIONAL_KEEPS_14) {
    const rev = reviewById.get(dem.vocabularyId);
    assert.ok(rev, `Demoted keep ${dem.vocabularyId} must exist in 2,000 reviews`);
    assert.equal(rev.recommendation, 'keep');
    assert.equal(dem.conceptId, rev.conceptId);
    assert.equal(dem.uk, rev.uk);
    assert.equal(dem.en, rev.en);
    assert.equal(dem.originalBatchNumber, rev.batchNumber);
    assert.equal(vocabIdSet.has(dem.vocabularyId), false);
    assert.equal(
      vocabIdSet.has(dem.retainedCounterpartVocabularyId),
      true,
      `Retained counterpart ${dem.retainedCounterpartVocabularyId} must be in final 1,200`
    );
  }

  for (const prom of IDENTIFY_RECONCILED_PROMOTED_REVIEWS_7) {
    const rev = reviewById.get(prom.vocabularyId);
    assert.ok(rev, `Promoted review ${prom.vocabularyId} must exist in 2,000 reviews`);
    assert.equal(rev.recommendation, 'review');
    assert.equal(prom.conceptId, rev.conceptId);
    assert.equal(prom.originalBatchNumber, rev.batchNumber);
    assert.equal(vocabIdSet.has(prom.vocabularyId), true);
  }

  // 7. Zero Lexical or Semantic Duplication Across All 1,200 Final Concepts
  const prefUkSet = new Set<string>();
  const enGlossSet = new Set<string>();
  for (const c of IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS) {
    const normUk = stripStress(c.preferredLearnerHeadwordUk);
    const normEn = c.en.toLowerCase().trim();
    assert.equal(
      prefUkSet.has(normUk),
      false,
      `Duplicate preferred Ukrainian headword in final 1,200: ${c.preferredLearnerHeadwordUk} (${c.vocabularyId})`
    );
    assert.equal(
      enGlossSet.has(normEn),
      false,
      `Duplicate English gloss in final 1,200: ${c.en} (${c.vocabularyId})`
    );
    prefUkSet.add(normUk);
    enGlossSet.add(normEn);
  }
  assert.equal(prefUkSet.size, 1200);
  assert.equal(enGlossSet.size, 1200);

  // 8. Semantic Scene Allocation, Primary vs Spiral Review Counts, and Verified Hotspot Integrity
  const conceptByVocabId = new Map(
    IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.map((c) => [c.vocabularyId, c])
  );
  const primaryIntroVocabIds = new Set<string>();
  let totalPrimaryIntros = 0;
  let totalSpiralReviews = 0;

  for (const scene of IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN) {
    const scenePrimaries = scene.targets.filter((t) => t.isPrimaryIntroduction);
    const sceneReviews = scene.targets.filter((t) => !t.isPrimaryIntroduction);
    assert.equal(
      scenePrimaries.length,
      15,
      `Scene ${scene.sceneCode} must have exactly 15 primary introductions`
    );
    assert.equal(
      sceneReviews.length,
      3,
      `Scene ${scene.sceneCode} must have exactly 3 spiral-review targets`
    );
    totalPrimaryIntros += scenePrimaries.length;
    totalSpiralReviews += sceneReviews.length;

    for (const p of scenePrimaries) {
      assert.equal(
        primaryIntroVocabIds.has(p.vocabularyId),
        false,
        `Concept ${p.vocabularyId} must be introduced as primary in at most one scene`
      );
      primaryIntroVocabIds.add(p.vocabularyId);
    }

    for (const t of scene.targets) {
      const c = conceptByVocabId.get(t.vocabularyId);
      assert.ok(c, `Target ${t.vocabularyId} must exist in final 1,200`);
      assert.equal(t.conceptId, c.conceptId);
      assert.equal(t.uk, c.preferredLearnerHeadwordUk);
      assert.equal(t.en, c.en);
      assert.equal(
        isConceptSemanticallyCompatibleWithSceneCategory(c, scene.categoryId),
        true,
        `Target ${c.vocabularyId} (${c.preferredLearnerHeadwordUk} / ${c.en}) must be semantically compatible with scene ${scene.sceneCode} (${scene.categoryId})`
      );
      assert.equal(t.isTargetPlayableForLearner, t.hotspotVerified);
      if (!scene.learnerExposureAllowed) {
        assert.equal(t.hotspotVerified, false);
        assert.equal(t.isTargetPlayableForLearner, false);
        assert.equal(t.normalizedBoundingBox, null);
      }
    }
  }
  assert.equal(totalPrimaryIntros, 1200);
  assert.equal(totalSpiralReviews, 240);
  assert.equal(primaryIntroVocabIds.size, 1200);

  // 9. Targeted Regression Check: Kitchen Table vs Bank Bug & Exact 49 Verified Hotspot Alignment
  const scene1Kitchen = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[0];
  assert.equal(scene1Kitchen.sceneCode, 'uk_scene_01_kitchen_family_breakfast');
  assert.equal(scene1Kitchen.categoryId, 'kitchen');
  const slot1Kitchen = scene1Kitchen.targets[0];
  assert.equal(slot1Kitchen.vocabularyId, 'k-table');
  assert.equal(slot1Kitchen.uk, 'стіл');
  assert.equal(slot1Kitchen.en, 'table');
  assert.equal(slot1Kitchen.hotspotVerified, true);
  assert.deepEqual(slot1Kitchen.normalizedBoundingBox, {
    x: 0.44,
    y: 0.48,
    width: 0.27,
    height: 0.24,
  });
  // Verify that noun-bank-financial (банк) is NOT in kitchen-scene-2 and instead appears in a city-streets scene
  assert.equal(
    scene1Kitchen.targets.some((t) => t.vocabularyId === 'noun-bank-financial'),
    false,
    'noun-bank-financial (банк) must never be assigned to a kitchen scene or kitchen table hotspot'
  );

  // Verify all 49 verified hotspots across the 10 playable scenes match getApprovedLearnerTargets 1-to-1
  const playableCategories = getPlayableIdentifyCategories();
  const playableScenes = playableCategories.flatMap((c) => c.scenes);
  assert.equal(playableScenes.length, 10);
  const allApprovedTargets = playableScenes.flatMap((s) =>
    getApprovedLearnerTargets(s)
  );
  assert.equal(allApprovedTargets.length, 49);

  for (const alias of IDENTIFY_LEGACY_HOTSPOT_ALIAS_MAP) {
    assert.equal(
      vocabIdSet.has(alias.canonicalVocabularyId),
      true,
      `Alias ${alias.legacyHotspotVocabularyId} -> ${alias.canonicalVocabularyId} must resolve to a valid final 1,200 concept`
    );
  }

  for (let i = 0; i < 10; i++) {
    const planScene = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[i];
    const verifiedTargetsInPlan = planScene.targets.filter(
      (t) => t.hotspotVerified
    );
    const liveScene = playableScenes.find(
      (s) => s.assetPath === planScene.assetPath
    );
    assert.ok(liveScene, `Plan scene ${planScene.sceneCode} must match a live playable scene`);
    const liveApproved = getApprovedLearnerTargets(liveScene);
    assert.equal(verifiedTargetsInPlan.length, liveApproved.length);
    for (let j = 0; j < liveApproved.length; j++) {
      const vt = verifiedTargetsInPlan[j];
      const lt = liveApproved[j];
      assert.equal(
        vt.vocabularyId,
        resolveCanonicalVocabularyIdForHotspot(lt.vocabularyId)
      );
      assert.equal(vt.legacyHotspotVocabularyId, lt.vocabularyId);
      assert.equal(vt.verifiedHotspotId, lt.id);
      assert.equal(vt.uk, lt.uk);
      assert.deepEqual(vt.normalizedBoundingBox, {
        x: lt.x,
        y: lt.y,
        width: lt.width,
        height: lt.height,
      });
    }
  }

  const finalSummary = getIdentifyFinal1200And80SceneSummary();
  assert.equal(finalSummary.final1200TotalCount, 1200);
  assert.equal(finalSummary.primaryIntroductionAssociationsCount, 1200);
  assert.equal(finalSummary.spiralReviewAssociationsCount, 240);
  assert.equal(finalSummary.all1200CoveredAtLeastOnce, true);
  assert.equal(finalSummary.foreignLandmarksCount, 0);
});

test('Visual Batches 1–5: Scenes 11–36 Real Image Assets, 468 Candidate Hotspots, and Learner-Safety Gating', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  const expectedBatchScenes: Array<{
    sceneNumber: number;
    sceneCode: string;
    assetPath: string;
    batchExecutionNumber: number;
  }> = [
    {
      sceneNumber: 11,
      sceneCode: 'uk_scene_11_dining_festive_ukrainian_table',
      assetPath: '/assets/identify/dining-room/uk_scene_11_dining_festive_ukrainian_table.jpg',
      batchExecutionNumber: 1,
    },
    {
      sceneNumber: 12,
      sceneCode: 'uk_scene_12_dining_family_supper',
      assetPath: '/assets/identify/dining-room/uk_scene_12_dining_family_supper.jpg',
      batchExecutionNumber: 1,
    },
    {
      sceneNumber: 13,
      sceneCode: 'uk_scene_13_living_room_kyiv_apartment',
      assetPath: '/assets/identify/living-room/uk_scene_13_living_room_kyiv_apartment.jpg',
      batchExecutionNumber: 2,
    },
    {
      sceneNumber: 14,
      sceneCode: 'uk_scene_14_living_room_music_corner',
      assetPath: '/assets/identify/living-room/uk_scene_14_living_room_music_corner.jpg',
      batchExecutionNumber: 2,
    },
    {
      sceneNumber: 15,
      sceneCode: 'uk_scene_15_bedroom_master_suite',
      assetPath: '/assets/identify/bedroom/uk_scene_15_bedroom_master_suite.jpg',
      batchExecutionNumber: 3,
    },
    {
      sceneNumber: 16,
      sceneCode: 'uk_scene_16_bedroom_dressing_vanity',
      assetPath: '/assets/identify/bedroom/uk_scene_16_bedroom_dressing_vanity.jpg',
      batchExecutionNumber: 3,
    },
    {
      sceneNumber: 17,
      sceneCode: 'uk_scene_17_bedroom_child_nursery',
      assetPath: '/assets/identify/bedroom/uk_scene_17_bedroom_child_nursery.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 18,
      sceneCode: 'uk_scene_18_bathroom_modern_apartment',
      assetPath: '/assets/identify/bathroom/uk_scene_18_bathroom_modern_apartment.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 19,
      sceneCode: 'uk_scene_19_bathroom_vanity_hygiene',
      assetPath: '/assets/identify/bathroom/uk_scene_19_bathroom_vanity_hygiene.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 20,
      sceneCode: 'uk_scene_20_hallway_apartment_entry',
      assetPath: '/assets/identify/hallway-entry/uk_scene_20_hallway_apartment_entry.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 21,
      sceneCode: 'uk_scene_21_balcony_urban_garden',
      assetPath: '/assets/identify/balcony-garden/uk_scene_21_balcony_urban_garden.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 22,
      sceneCode: 'uk_scene_22_home_workshop_tools',
      assetPath: '/assets/identify/home-workshop/uk_scene_22_home_workshop_tools.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 23,
      sceneCode: 'uk_scene_23_supermarket_fresh_produce',
      assetPath: '/assets/identify/supermarket/uk_scene_23_supermarket_fresh_produce.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 24,
      sceneCode: 'uk_scene_24_supermarket_dairy_bakery',
      assetPath: '/assets/identify/supermarket/uk_scene_24_supermarket_dairy_bakery.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 25,
      sceneCode: 'uk_scene_25_supermarket_checkout_counter',
      assetPath: '/assets/identify/supermarket/uk_scene_25_supermarket_checkout_counter.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 26,
      sceneCode: 'uk_scene_26_farmers_market_bazaar',
      assetPath: '/assets/identify/farmers-market/uk_scene_26_farmers_market_bazaar.jpg',
      batchExecutionNumber: 4,
    },
    {
      sceneNumber: 27,
      sceneCode: 'uk_scene_27_farmers_market_vegetables_herbs',
      assetPath: '/assets/identify/farmers-market/uk_scene_27_farmers_market_vegetables_herbs.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 28,
      sceneCode: 'uk_scene_28_bakery_craft_pastry',
      assetPath: '/assets/identify/bakery/uk_scene_28_bakery_craft_pastry.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 29,
      sceneCode: 'uk_scene_29_cafe_lviv_coffeehouse',
      assetPath: '/assets/identify/cafe/uk_scene_29_cafe_lviv_coffeehouse.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 30,
      sceneCode: 'uk_scene_30_restaurant_ukrainian_bistro',
      assetPath: '/assets/identify/restaurant/uk_scene_30_restaurant_ukrainian_bistro.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 31,
      sceneCode: 'uk_scene_31_clothing_store_boutique',
      assetPath: '/assets/identify/clothing-store/uk_scene_31_clothing_store_boutique.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 32,
      sceneCode: 'uk_scene_32_clothing_winter_outerwear',
      assetPath: '/assets/identify/clothing-store/uk_scene_32_clothing_winter_outerwear.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 33,
      sceneCode: 'uk_scene_33_shoe_and_tailor_atelier',
      assetPath: '/assets/identify/clothing-store/uk_scene_33_shoe_and_tailor_atelier.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 34,
      sceneCode: 'uk_scene_34_city_street_kyiv_chestnuts',
      assetPath: '/assets/identify/city-streets/uk_scene_34_city_street_kyiv_chestnuts.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 35,
      sceneCode: 'uk_scene_35_city_square_lviv_rynok',
      assetPath: '/assets/identify/city-streets/uk_scene_35_city_square_lviv_rynok.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 36,
      sceneCode: 'uk_scene_36_city_rainy_sidewalk',
      assetPath: '/assets/identify/city-streets/uk_scene_36_city_rainy_sidewalk.jpg',
      batchExecutionNumber: 5,
    },
    {
      sceneNumber: 37,
      sceneCode: 'uk_scene_37_city_winter_snow_street',
      assetPath: '/assets/identify/city-streets/uk_scene_37_city_winter_snow_street.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 38,
      sceneCode: 'uk_scene_38_public_transport_tram_trolleybus',
      assetPath: '/assets/identify/public-transportation/uk_scene_38_public_transport_tram_trolleybus.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 39,
      sceneCode: 'uk_scene_39_public_transport_kyiv_metro',
      assetPath: '/assets/identify/public-transportation/uk_scene_39_public_transport_kyiv_metro.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 40,
      sceneCode: 'uk_scene_40_railway_station_ukrposhta_uz',
      assetPath: '/assets/identify/airport-train-station/uk_scene_40_railway_station_ukrposhta_uz.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 41,
      sceneCode: 'uk_scene_41_airport_terminal_check_in',
      assetPath: '/assets/identify/airport-train-station/uk_scene_41_airport_terminal_check_in.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 42,
      sceneCode: 'uk_scene_42_automotive_car_service',
      assetPath: '/assets/identify/city-streets/uk_scene_42_automotive_car_service.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 43,
      sceneCode: 'uk_scene_43_hospital_clinic_consultation',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_43_hospital_clinic_consultation.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 44,
      sceneCode: 'uk_scene_44_hospital_first_aid_treatment',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_44_hospital_first_aid_treatment.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 45,
      sceneCode: 'uk_scene_45_pharmacy_apotheca',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_45_pharmacy_apotheca.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 46,
      sceneCode: 'uk_scene_46_dental_and_optics_clinic',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_46_dental_and_optics_clinic.jpg',
      batchExecutionNumber: 6,
    },
    {
      sceneNumber: 47,
      sceneCode: 'uk_scene_47_portrait_human_face_features',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_47_portrait_human_face_features.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 48,
      sceneCode: 'uk_scene_48_portrait_human_body_posture',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_48_portrait_human_body_posture.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 49,
      sceneCode: 'uk_scene_49_school_classroom_lesson',
      assetPath: '/assets/identify/classroom/uk_scene_49_school_classroom_lesson.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 50,
      sceneCode: 'uk_scene_50_school_desk_stationery',
      assetPath: '/assets/identify/classroom/uk_scene_50_school_desk_stationery.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 51,
      sceneCode: 'uk_scene_51_school_science_laboratory',
      assetPath: '/assets/identify/classroom/uk_scene_51_school_science_laboratory.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 52,
      sceneCode: 'uk_scene_52_library_reading_hall',
      assetPath: '/assets/identify/library/uk_scene_52_library_reading_hall.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 53,
      sceneCode: 'uk_scene_53_office_it_coworking_kyiv',
      assetPath: '/assets/identify/office/uk_scene_53_office_it_coworking_kyiv.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 54,
      sceneCode: 'uk_scene_54_office_electronics_accessories',
      assetPath: '/assets/identify/office/uk_scene_54_office_electronics_accessories.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 55,
      sceneCode: 'uk_scene_55_post_office_ukrposhta',
      assetPath: '/assets/identify/office/uk_scene_55_post_office_ukrposhta.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 56,
      sceneCode: 'uk_scene_56_bank_and_administrative_center',
      assetPath: '/assets/identify/office/uk_scene_56_bank_and_administrative_center.jpg',
      batchExecutionNumber: 7,
    },
    {
      sceneNumber: 57,
      sceneCode: 'uk_scene_57_park_shevchenko_autumn',
      assetPath: '/assets/identify/park-garden/uk_scene_57_park_shevchenko_autumn.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 58,
      sceneCode: 'uk_scene_58_botanical_garden_flowers',
      assetPath: '/assets/identify/park-garden/uk_scene_58_botanical_garden_flowers.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 59,
      sceneCode: 'uk_scene_59_backyard_garden_tools',
      assetPath: '/assets/identify/park-garden/uk_scene_59_backyard_garden_tools.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 60,
      sceneCode: 'uk_scene_60_playground_family_courtyard',
      assetPath: '/assets/identify/playground/uk_scene_60_playground_family_courtyard.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 61,
      sceneCode: 'uk_scene_61_gym_fitness_studio',
      assetPath: '/assets/identify/gym-fitness/uk_scene_61_gym_fitness_studio.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 62,
      sceneCode: 'uk_scene_62_sports_stadium_court',
      assetPath: '/assets/identify/gym-fitness/uk_scene_62_sports_stadium_court.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 63,
      sceneCode: 'uk_scene_63_swimming_pool_and_winter_rink',
      assetPath: '/assets/identify/gym-fitness/uk_scene_63_swimming_pool_and_winter_rink.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 64,
      sceneCode: 'uk_scene_64_countryside_ukrainian_village_yard',
      assetPath: '/assets/identify/countryside/uk_scene_64_countryside_ukrainian_village_yard.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 65,
      sceneCode: 'uk_scene_65_countryside_farmyard_animals',
      assetPath: '/assets/identify/countryside/uk_scene_65_countryside_farmyard_animals.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 66,
      sceneCode: 'uk_scene_66_countryside_wheat_and_sunflower_fields',
      assetPath: '/assets/identify/countryside/uk_scene_66_countryside_wheat_and_sunflower_fields.jpg',
      batchExecutionNumber: 8,
    },
    {
      sceneNumber: 67,
      sceneCode: 'uk_scene_67_carpathian_forest_wildlife',
      assetPath: '/assets/identify/countryside/uk_scene_67_carpathian_forest_wildlife.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 68,
      sceneCode: 'uk_scene_68_carpathian_camping_bonfire',
      assetPath: '/assets/identify/camping-nature/uk_scene_68_carpathian_camping_bonfire.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 69,
      sceneCode: 'uk_scene_69_river_dnipro_boating_fishing',
      assetPath: '/assets/identify/beach-nature/uk_scene_69_river_dnipro_boating_fishing.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 70,
      sceneCode: 'uk_scene_70_nature_insects_and_garden_macro',
      assetPath: '/assets/identify/park-garden/uk_scene_70_nature_insects_and_garden_macro.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 71,
      sceneCode: 'uk_scene_71_pet_shop_and_vet_clinic',
      assetPath: '/assets/identify/hospital-pharmacy/uk_scene_71_pet_shop_and_vet_clinic.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 72,
      sceneCode: 'uk_scene_72_zoo_exotic_animals_kyiv',
      assetPath: '/assets/identify/park-garden/uk_scene_72_zoo_exotic_animals_kyiv.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 73,
      sceneCode: 'uk_scene_73_art_studio_and_museum',
      assetPath: '/assets/identify/art-studio/uk_scene_73_art_studio_and_museum.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 74,
      sceneCode: 'uk_scene_74_theater_and_concert_hall',
      assetPath: '/assets/identify/art-studio/uk_scene_74_theater_and_concert_hall.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 75,
      sceneCode: 'uk_scene_75_photo_and_media_studio',
      assetPath: '/assets/identify/office/uk_scene_75_photo_and_media_studio.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 76,
      sceneCode: 'uk_scene_76_hair_salon_barbershop',
      assetPath: '/assets/identify/bathroom/uk_scene_76_hair_salon_barbershop.jpg',
      batchExecutionNumber: 9,
    },
    {
      sceneNumber: 77,
      sceneCode: 'uk_scene_77_hotel_reception_and_room',
      assetPath: '/assets/identify/hotel/uk_scene_77_hotel_reception_and_room.jpg',
      batchExecutionNumber: 10,
    },
    {
      sceneNumber: 78,
      sceneCode: 'uk_scene_78_emergency_and_civic_services',
      assetPath: '/assets/identify/city-streets/uk_scene_78_emergency_and_civic_services.jpg',
      batchExecutionNumber: 10,
    },
    {
      sceneNumber: 79,
      sceneCode: 'uk_scene_79_architecture_church_and_castle',
      assetPath: '/assets/identify/city-streets/uk_scene_79_architecture_church_and_castle.jpg',
      batchExecutionNumber: 10,
    },
    {
      sceneNumber: 80,
      sceneCode: 'uk_scene_80_family_celebration_gift_exchange',
      assetPath: '/assets/identify/living-room/uk_scene_80_family_celebration_gift_exchange.jpg',
      batchExecutionNumber: 10,
    },
  ];

  const batchScenes = expectedBatchScenes.map((exp) => {
    const s = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[exp.sceneNumber - 1];
    assert.equal(s.sceneNumber, exp.sceneNumber);
    assert.equal(s.sceneCode, exp.sceneCode);
    assert.equal(s.assetPath, exp.assetPath);
    assert.equal(s.batchExecutionNumber, exp.batchExecutionNumber);
    return s;
  });

  // Verify real files on disk and all 1260 candidate hotspots across Scenes 11–80
  for (const s of batchScenes) {
    assert.equal(s.assetExistsOnDisk, true);
    assert.equal(s.imageGenerationStatus, 'generated_verified_on_disk');
    assert.deepEqual(s.imageDimensions, {
      width: 1376,
      height: 768,
      aspectRatio: '16:9',
    });
    assert.equal(s.candidateHotspotCount, 18);
    assert.equal(s.learnerExposureAllowed, false);

    const diskPath = path.resolve(process.cwd(), 'public' + s.assetPath!);
    assert.equal(fs.existsSync(diskPath), true, `Expected saved image at ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 100000, `Expected non-empty real photograph at ${diskPath}`);

    for (const t of s.targets) {
      assert.ok(
        t.candidateNormalizedBoundingBox,
        `Scene ${s.sceneCode} target ${t.vocabularyId} must have a candidateNormalizedBoundingBox`
      );
      const box = t.candidateNormalizedBoundingBox!;
      assert.ok(box.x >= 0 && box.x <= 1);
      assert.ok(box.y >= 0 && box.y <= 1);
      assert.ok(box.width >= 0.015 && box.width <= 1);
      assert.ok(box.height >= 0.02 && box.height <= 1);
      assert.ok(box.x + box.width <= 1.0001);
      assert.ok(box.y + box.height <= 1.0001);
      assert.equal(t.hotspotReviewStatus, 'needs_human_review');
      assert.equal(t.hotspotVerified, false);
      assert.equal(t.isTargetPlayableForLearner, false);
      assert.equal(t.normalizedBoundingBox, null);
    }
  }

  // Verify persistent checkpoint file src/identifyVisualBatchProgress.json and 1-to-1 hotspot-to-vocabulary identity
  const progressPath = path.resolve(process.cwd(), 'src/identifyVisualBatchProgress.json');
  assert.equal(fs.existsSync(progressPath), true);
  const progressJson = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  assert.equal(progressJson.lastBatchNumber, 10);
  assert.equal(progressJson.cumulativeProgress.batchesCompleted, 10);
  assert.equal(progressJson.cumulativeProgress.scenesWithVerifiedImagesTotal, 80);
  assert.equal(progressJson.cumulativeProgress.batchGeneratedScenesWithImagesCount, 70);
  assert.equal(progressJson.cumulativeProgress.scenesRemainingWithoutImagesCount, 0);
  assert.equal(
    progressJson.cumulativeProgress.batchCreatedCandidateHotspotsAwaitingHumanReviewCount,
    1260
  );

  for (const s of batchScenes) {
    const checkpointScene = progressJson.scenes[s.sceneCode];
    assert.ok(checkpointScene, `Missing checkpoint entry for ${s.sceneCode}`);
    assert.equal(checkpointScene.actualSavedImagePath, s.assetPath);
    assert.equal(checkpointScene.imageGenerationStatus, 'image_verified');
    assert.equal(checkpointScene.hotspotsCreated, 18);
    assert.equal(checkpointScene.hotspotsVerified, 0);
    assert.equal(checkpointScene.hotspotReviewStatus, 'needs_human_review');
    assert.equal(checkpointScene.learnerExposureAllowed, false);
    assert.equal(checkpointScene.vocabularyAssignments.length, 18);
    assert.equal(checkpointScene.candidateHotspots.length, 18);

    for (let i = 0; i < 18; i++) {
      const target = s.targets[i];
      const ch = checkpointScene.candidateHotspots[i];
      assert.equal(checkpointScene.vocabularyAssignments[i], target.vocabularyId);
      assert.equal(ch.slotNumber, i + 1);
      assert.equal(ch.vocabularyId, target.vocabularyId);
      assert.equal(ch.uk, target.uk);
      assert.equal(ch.isPrimaryIntroduction, target.isPrimaryIntroduction);
      assert.equal(ch.reviewStatus, 'needs_human_review');
      assert.deepEqual(ch.normalizedBoundingBox, target.candidateNormalizedBoundingBox);
    }
  }
});

test('Batch 4–10 Semantic Integrity Audit & 1260-Hotspot Authoritative Identity Verification: verifies all 1260 pending candidate hotspots across Scenes 11–80, conflicted IDs, ext-v2-0001/ext-v2-0003 meanings, Scene 25 barcode scanner geometry, and displaced primary destinations', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const masterById = new Map(IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m]));
  const extById = new Map(
    IDENTIFY_MISSING_CONCEPT_EXTENSIONS_28.map((e) => [e.vocabularyId, e])
  );
  const finalById = new Map(
    IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.map((c) => [c.vocabularyId, c])
  );

  // 1. Verify ext-v2-0001 (дріт / electrical wire) and ext-v2-0003 (чай / tea) retain their authoritative identities
  const ext0001 = extById.get('ext-v2-0001');
  assert.ok(ext0001);
  assert.equal(ext0001.conceptId, 'missing-concept-v2-0001');
  assert.equal(ext0001.originalAuditProposedUk, 'дріт');
  assert.equal(ext0001.en, 'electrical wire / cord');

  const ext0003 = extById.get('ext-v2-0003');
  assert.ok(ext0003);
  assert.equal(ext0003.conceptId, 'missing-concept-v2-0003');
  assert.equal(ext0003.originalAuditProposedUk, 'чай');
  assert.equal(ext0003.en, 'tea (cup/pot of tea)');

  // 2. Verify all 22 audited conflict/extension IDs match their authoritative Ukrainian headwords and English glosses
  const authoritativeIdentityExpectations: ReadonlyArray<{
    vocabularyId: string;
    uk: string;
    en: string;
    sceneNumber: number;
    slotNumber: number;
  }> = [
    { vocabularyId: 'id-v2-1508', uk: 'комбінезо́н', en: 'overalls / jumpsuit', sceneNumber: 17, slotNumber: 1 },
    { vocabularyId: 'id-v2-1519', uk: 'пана́ма', en: 'bucket hat', sceneNumber: 17, slotNumber: 2 },
    { vocabularyId: 'id-v2-1177', uk: 'пра́льний порошо́к', en: 'laundry detergent box', sceneNumber: 18, slotNumber: 1 },
    { vocabularyId: 'id-v2-1901', uk: 'туш для вій', en: 'mascara wand tube', sceneNumber: 19, slotNumber: 8 },
    { vocabularyId: 'id-v2-1903', uk: 'бігуді́', en: 'hair curler rollers', sceneNumber: 19, slotNumber: 11 },
    { vocabularyId: 'id-v2-1768', uk: 'три́мач для рушникі́в', en: 'towel ring / bar', sceneNumber: 19, slotNumber: 13 },
    { vocabularyId: 'id-v2-336', uk: 'коридо́р', en: 'hallway', sceneNumber: 20, slotNumber: 3 },
    { vocabularyId: 'id-v2-339', uk: 'дверна́ ру́чка', en: 'door handle', sceneNumber: 20, slotNumber: 18 },
    { vocabularyId: 'id-v2-1505', uk: 'дощови́к', en: 'hooded rain poncho', sceneNumber: 21, slotNumber: 1 },
    { vocabularyId: 'ext-v2-0003', uk: 'чай', en: 'tea (cup/pot of tea)', sceneNumber: 21, slotNumber: 9 },
    { vocabularyId: 'id-v2-365', uk: 'руле́тка будіве́льна', en: 'tape measure', sceneNumber: 22, slotNumber: 1 },
    { vocabularyId: 'id-v2-1151', uk: 'сантиметро́ва стрі́чка', en: 'tailor measuring tape', sceneNumber: 22, slotNumber: 7 },
    { vocabularyId: 'ext-v2-0001', uk: 'дріт', en: 'electrical wire / cord', sceneNumber: 22, slotNumber: 11 },
    { vocabularyId: 'id-v2-1264', uk: 'айва́', en: 'quince', sceneNumber: 23, slotNumber: 8 },
    { vocabularyId: 'id-v2-1266', uk: 'поме́ло', en: 'pomelo', sceneNumber: 23, slotNumber: 9 },
    { vocabularyId: 'id-v2-1279', uk: 'пла́влений сир', en: 'processed cheese triangle', sceneNumber: 24, slotNumber: 1 },
    { vocabularyId: 'id-v2-1280', uk: 'згуще́не молоко́', en: 'condensed milk tin', sceneNumber: 24, slotNumber: 3 },
    { vocabularyId: 'id-v2-640', uk: 'ска́нер штрих-ко́дів', en: 'barcode scanner', sceneNumber: 25, slotNumber: 2 },
    { vocabularyId: 'id-v2-1101', uk: 'паверба́нк', en: 'power bank', sceneNumber: 25, slotNumber: 9 },
    { vocabularyId: 'id-v2-445', uk: 'капу́ста', en: 'cabbage head', sceneNumber: 26, slotNumber: 10 },
    { vocabularyId: 'id-v2-417', uk: 'пе́рсик', en: 'peach', sceneNumber: 26, slotNumber: 14 },
    { vocabularyId: 'id-v2-418', uk: 'абрико́с', en: 'apricot', sceneNumber: 26, slotNumber: 15 },
  ];

  for (const exp of authoritativeIdentityExpectations) {
    const authSource = masterById.get(exp.vocabularyId) ?? extById.get(exp.vocabularyId);
    assert.ok(authSource, `Expected ${exp.vocabularyId} in authoritative master or extension registry`);
    const finalConcept = finalById.get(exp.vocabularyId);
    assert.ok(finalConcept, `Expected ${exp.vocabularyId} in final 1,200 curriculum`);
    assert.equal(finalConcept.conceptId, authSource.conceptId);
    assert.equal(finalConcept.preferredLearnerHeadwordUk, exp.uk);
    assert.equal(finalConcept.en, exp.en);

    const scene = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[exp.sceneNumber - 1];
    const target = scene.targets[exp.slotNumber - 1];
    assert.equal(target.vocabularyId, exp.vocabularyId);
    assert.equal(target.conceptId, authSource.conceptId);
    assert.equal(target.uk, exp.uk);
    assert.equal(target.en, exp.en);
  }

  // 3. Verify repaired Scene 25 barcode scanner geometry (distinct from POS payment terminal id-v2-646)
  const scene25 = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[24];
  const scannerTarget = scene25.targets.find((t) => t.vocabularyId === 'id-v2-640')!;
  const terminalTarget = scene25.targets.find((t) => t.vocabularyId === 'id-v2-646')!;
  assert.deepEqual(scannerTarget.candidateNormalizedBoundingBox, {
    x: 0.51,
    y: 0.64,
    width: 0.11,
    height: 0.18,
  });
  assert.notDeepEqual(
    scannerTarget.candidateNormalizedBoundingBox,
    terminalTarget.candidateNormalizedBoundingBox
  );

  // 4. Verify all 1260 pending candidate hotspots across Scenes 11–80 resolve to authoritative master/extension records
  const progressPath = path.resolve(process.cwd(), 'src/identifyVisualBatchProgress.json');
  const progressJson = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  assert.equal(progressJson.batch4SemanticAudit.status, 'PASSED_AFTER_REPAIR');
  assert.equal(progressJson.batch4SemanticAudit.totalPendingCandidateHotspotsVerifiedCount, 288);
  assert.equal(progressJson.batch5PreBatchAudit.auditPassed, true);
  assert.equal(progressJson.batch5PreBatchAudit.sourceIdentityErrorCount, 0);

  let verifiedPendingCount = 0;
  for (let idx = 10; idx < 80; idx++) {
    const scene = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN[idx];
    const cpScene = progressJson.scenes[scene.sceneCode];
    assert.ok(cpScene);
    for (let slotIdx = 0; slotIdx < 18; slotIdx++) {
      const t = scene.targets[slotIdx];
      const ch = cpScene.candidateHotspots[slotIdx];
      const fc = finalById.get(t.vocabularyId)!;
      assert.ok(fc);
      const authSource = masterById.get(t.vocabularyId) ?? extById.get(t.vocabularyId);
      assert.ok(authSource, `Missing authoritative source for ${t.vocabularyId}`);
      assert.equal(t.conceptId, fc.conceptId);
      assert.equal(t.uk, fc.preferredLearnerHeadwordUk);
      assert.equal(t.en, fc.en);
      assert.equal(ch.vocabularyId, t.vocabularyId);
      assert.equal(ch.conceptId, fc.conceptId);
      assert.equal(ch.uk, fc.preferredLearnerHeadwordUk);
      assert.equal(ch.en, fc.en);
      assert.equal(t.hotspotReviewStatus, 'needs_human_review');
      assert.equal(t.hotspotVerified, false);
      assert.equal(t.isTargetPlayableForLearner, false);
      verifiedPendingCount++;
    }
  }
  assert.equal(verifiedPendingCount, 1260);

  // 5. Verify displaced primary concepts from Batch 1–4 swaps landed in semantically appropriate scenes (Scenes 27–80)
  const expectedDisplacedDestinations: ReadonlyArray<[string, number, string]> = [
    ['id-v2-517', 28, 'uk_scene_28_bakery_craft_pastry'],
    ['id-v2-571', 30, 'uk_scene_30_restaurant_ukrainian_bistro'],
    ['ext-v2-0006', 30, 'uk_scene_30_restaurant_ukrainian_bistro'],
    ['noun-bank-financial', 34, 'uk_scene_34_city_street_kyiv_chestnuts'],
    ['id-v2-653', 34, 'uk_scene_34_city_street_kyiv_chestnuts'],
    ['id-v2-607', 35, 'uk_scene_35_city_square_lviv_rynok'],
    ['id-v2-726', 42, 'uk_scene_42_automotive_car_service'],
    ['gm-machine', 61, 'uk_scene_61_gym_fitness_studio'],
  ];
  for (const [vocabId, expectedSceneNum, expectedSceneCode] of expectedDisplacedDestinations) {
    const destScene = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.find((s) =>
      s.targets.some((t) => t.isPrimaryIntroduction && t.vocabularyId === vocabId)
    );
    assert.ok(destScene, `Expected primary introduction scene for ${vocabId}`);
    assert.equal(destScene.sceneNumber, expectedSceneNum);
    assert.equal(destScene.sceneCode, expectedSceneCode);
  }
});




