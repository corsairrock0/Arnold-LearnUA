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
  IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS,
  IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS,
  IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS,
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
  getSavedCurationDecision,
  getAllSavedCurationDecisions,
  recordCandidateCurationDecision,
  getApprovedUniqueNounCount,
  getNextRecommendedBatchPreview,
} from '../identifyCurriculumCurationPhase1.ts';
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

  const swabsPluralDup = getSavedCurationDecision('id-v2-1771'); // ва́тні па́лички -> id-v2-316 (ва́тна па́личка)
  assert.ok(swabsPluralDup);
  assert.equal(swabsPluralDup.recommendation, 'exclude');
  assert.equal(swabsPluralDup.duplicateOfVocabularyId, 'id-v2-316');

  assert.ok(IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS.length >= 10);
  assert.equal(IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS.length, 12);
  assert.equal(IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES.length, 7);
});

test('Phase 1 Cumulative Progress, Batch 4, Batch 5 & Batch 6 Integrity, Semantic Relationships & Decision Store: verifies Batches 1–6 (1,200 reviewed, 816 accepted), 34 protected missing concepts, and Batch 7 preview', () => {
  // 1. Batch 4 & Batch 5 remain intact
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

  // 2. Batch 6 contains exactly 200 new candidates (108 KEEP, 38 REVIEW, 54 EXCLUDE)
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

  // 3. Zero overlap between Batch 6 and Batches 1–5; all 1,200 reviewed candidates have unique vocabulary IDs and concept IDs
  const prev1000Reviews = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
  ];
  const prev1000VocabIds = new Set(prev1000Reviews.map((r) => r.vocabularyId));
  const prev1000ConceptIds = new Set(prev1000Reviews.map((r) => r.conceptId));
  for (const r of BATCH_6_CANDIDATE_REVIEWS) {
    assert.equal(r.batchNumber, 6);
    assert.equal(prev1000VocabIds.has(r.vocabularyId), false);
    assert.equal(prev1000ConceptIds.has(r.conceptId), false);
    assert.ok(['keep', 'review', 'exclude'].includes(r.recommendation));
  }

  const all1200Reviews = [...prev1000Reviews, ...BATCH_6_CANDIDATE_REVIEWS];
  assert.equal(all1200Reviews.length, 1200);
  const all1200VocabIds = new Set(all1200Reviews.map((r) => r.vocabularyId));
  const all1200ConceptIds = new Set(all1200Reviews.map((r) => r.conceptId));
  assert.equal(all1200VocabIds.size, 1200);
  assert.equal(all1200ConceptIds.size, 1200);

  // 4. Cumulative progress across Batches 1–6
  const progress = computeCumulativeCurationProgress();
  assert.equal(progress.targetUniqueNouns, 1200);
  assert.equal(progress.totalMasterCandidates, 2000);
  assert.deepEqual(progress.batchesCompleted, [1, 2, 3, 4, 5, 6]);
  assert.equal(progress.batch1Stats.recommendedKeepCount, 150);
  assert.equal(progress.batch2Stats.recommendedKeepCount, 154);
  assert.equal(progress.batch3Stats.recommendedKeepCount, 132);
  assert.equal(progress.batch4Stats.recommendedKeepCount, 146);
  assert.equal(progress.batch5Stats.recommendedKeepCount, 126);
  assert.equal(progress.batch6Stats.recommendedKeepCount, 108);
  assert.equal(progress.totalCandidatesReviewed, 1200);
  assert.equal(progress.totalRecommendedKeep, 816);
  assert.equal(progress.totalRecommendedReview, 172);
  assert.equal(progress.totalRecommendedExclude, 212);
  assert.equal(progress.totalUniqueProvisionallyAcceptedConcepts, 816);
  assert.equal(progress.remainingUnreviewedCandidates, 800);
  assert.equal(progress.remainingNeededToReach1200Target, 384);

  // Decision store has all 1,200 decisions and 816 unique accepted concepts
  assert.equal(getAllSavedCurationDecisions().length, 1200);
  assert.equal(getApprovedUniqueNounCount(), 816);

  // Refuses silent overwrite of approved Batch 3 decision
  const washingMachineDecision = getSavedCurationDecision('id-v2-151');
  assert.ok(washingMachineDecision);
  const blockedAttempt = recordCandidateCurationDecision({
    ...washingMachineDecision,
    recommendation: 'exclude',
  });
  assert.equal(blockedAttempt.ok, false);
  assert.equal(getSavedCurationDecision('id-v2-151')?.recommendation, 'keep');

  // 5. Coverage-gap classifications, Batch 5 reconciliation view, and Batch 6 headword/suitability report are preserved
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
  assert.equal(
    IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER.length,
    batch6GapReport.headwordNormalizationTracker.length
  );
  assert.equal(
    IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS.length,
    batch6GapReport.missingConceptVisualSuitabilityAssessments.length
  );

  // 6. Next batch preview now points to Batch 7 with 800 remaining unreviewed candidates
  const batch7Preview = getNextRecommendedBatchPreview(200);
  assert.equal(batch7Preview.nextBatchNumber, 7);
  assert.equal(batch7Preview.targetBatchSize, 200);
  assert.equal(batch7Preview.totalRemainingUnreviewedCandidates, 800);
  assert.equal(batch7Preview.sampleTopCandidatesForNextBatch.length, 25);
});

test('Phase 1 Referential Integrity Regression Suite (Batches 1–6): verifies master identity, duplicate/canonical/comparison links, shortlist flags, assessment keys, and priority-list ID alignment', async () => {
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

  // B. Primary curation decisions across all 1,200 reviewed candidates
  const allReviews = [
    ...BATCH_1_CANDIDATE_REVIEWS,
    ...BATCH_2_CANDIDATE_REVIEWS,
    ...BATCH_3_CANDIDATE_REVIEWS,
    ...BATCH_4_CANDIDATE_REVIEWS,
    ...BATCH_5_CANDIDATE_REVIEWS,
    ...BATCH_6_CANDIDATE_REVIEWS,
  ];
  assert.equal(allReviews.length, 1200);
  const reviewByVocabId = new Map(allReviews.map((r) => [r.vocabularyId, r]));
  assert.equal(reviewByVocabId.size, 1200);

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

  // G. Preserve existing totals and verify priority-tier distributions
  const progress = computeCumulativeCurationProgress();
  assert.equal(progress.totalCandidatesReviewed, 1200);
  assert.equal(progress.totalRecommendedKeep, 816);
  assert.equal(progress.totalRecommendedReview, 172);
  assert.equal(progress.totalRecommendedExclude, 212);
  assert.equal(progress.remainingUnreviewedCandidates, 800);

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

  // H. Learner safety (10 verified scenes, 49 active targets, 2,471 unverified excluded)
  const coverageSummary = computeMasterVocabularyCoverageSummary();
  assert.equal(coverageSummary.scenesReadyForStudentsCount, 10);
  assert.equal(coverageSummary.verifiedActiveTargetAssociationsCount, 49);
  assert.equal(coverageSummary.unverifiedPlannedAssociationsCount, 2471);
});

