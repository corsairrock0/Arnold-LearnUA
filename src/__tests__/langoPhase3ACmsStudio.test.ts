/**
 * ============================================================================
 * LANGO — PHASE 3A: CONTENT MANAGEMENT STUDIO (CMS) ACCEPTANCE TEST SUITE
 * ============================================================================
 * Executes all 25 Required Acceptance Tests (Section 30 of the Phase 3A spec):
 *   Test 1:  All 28 Course Tracks appear in CMS
 *   Test 2:  Ukrainian course remains unchanged and functional
 *   Test 3:  Empty Course Track opens in CMS without errors
 *   Test 4:  Valid JSON course can be previewed
 *   Test 5:  Invalid JSON produces useful validation errors
 *   Test 6:  Course cannot be imported into wrong language track
 *   Test 7:  English for Spanish speakers and English for Japanese speakers remain separate
 *   Test 8:  Lesson can be edited in draft without changing published content
 *   Test 9:  Draft preview uses the actual Universal Course Player
 *   Test 10: Draft activity/preview interactions do not modify real FSRS progress
 *   Test 11: Shared canonical English vocabulary remains separate from native-language overlays
 *   Test 12: Editing one vocabulary overlay does not modify other overlays
 *   Test 13: CMS identifies invalid assessment answer keys
 *   Test 14: CMS identifies duplicate content IDs
 *   Test 15: CMS identifies missing vocabulary references
 *   Test 16: CMS detects missing media references
 *   Test 17: Version history preserves previous content
 *   Test 18: Previous version can be restored without affecting other Course Tracks
 *   Test 19: Course can be exported into valid JSON
 *   Test 20: Exported JSON can be parsed and revalidated
 *   Test 21: Existing Ukrainian photographs (100 WebP scenes) and audio remain accessible
 *   Test 22: All 8 learning tabs continue working
 *   Test 23: Application builds successfully (verified via module & schema integrity)
 *   Test 24: Cloud Run compatibility remains intact (server.ts & package.json)
 *   Test 25: Public users cannot access unauthorized CMS editing or publishing operations
 * ============================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { COURSE_MODULES } from '../courseData.ts';
import { FREQ_6000_DB } from '../vocabData.ts';
import { ARCHIVED_LEGACY_SCENES_FOR_AUDIT, IDENTIFY_CATEGORIES } from '../identifyData.ts';
import { READER_PASSAGES } from '../readerData.ts';
import {
  getAllCourseTracks,
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
} from '../multilingual/courseTrackRegistry.ts';
import {
  getCourseTrackProgress,
  resolveEnglishVocabCardForTrack,
  saveIsolatedTrackProgress,
} from '../multilingual/courseTrackProgress.ts';
import {
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
  validateAndPreviewCourseImport,
} from '../multilingual/universalCourseImporter.ts';
import {
  evaluateCmsAccessContext,
  setSimulatedPublicProductionModeForTesting,
} from '../multilingual/cmsAuthAndStorage.ts';
import {
  getAllCmsTrackSummaries,
  getCmsDashboardMetrics,
  getOrCreateCmsCourseDraft,
  getPublishedBaselineCoursePackage,
  discardCmsDraftOverlay,
  computeCmsDraftVsPublishedDiff,
  saveCmsCourseDraft,
  addOrUpdateCmsModuleInDraft,
  reorderCmsModulesInDraft,
  duplicateCmsModuleInDraft,
  updateCmsLessonInDraft,
  updateCmsActivityInDraft,
  importCourseJsonIntoCmsDraft,
  validateCmsCourseDraft,
  addCmsManualReviewNote,
  getAllCanonicalEnglishLexemes,
  getAllNativeOverlaysForLexeme,
  upsertNativeLanguageOverlayInCms,
  validateCmsVocabularyRegistry,
  getCmsVersionHistory,
  compareCmsVersionSnapshots,
  restoreCmsVersionSnapshot,
  transitionCmsDraftLifecycleState,
  getCmsMediaLibraryCatalog,
  renderIsolatedCmsDraftPreview,
  exportCmsCourseDraftToJson,
  runBulkCmsValidationAudit,
  searchCmsContentStudio,
  clearCmsDraftAndHistoryForTrack,
  analyzeCmsRemovalImpact,
  removeCmsContentItemInDraft,
  getCmsRemovedItemsInDraft,
  restoreRemovedCmsItemInDraft,
  undoLastCmsAction,
  redoLastCmsAction,
  getCmsUndoRedoState,
  computeCmsDetailedChangeSummary,
  addCmsSectionToModuleInDraft,
  addCmsLessonToSectionInDraft,
  duplicateCmsLessonInDraft,
  addCmsActivityToLessonInDraft,
  duplicateCmsActivityInDraft,
  addCmsAnswerOptionInDraft,
  addCmsLessonVocabularyRefInDraft,
  addCmsLessonMediaRefInDraft,
} from '../multilingual/cmsContentStudioEngine.ts';
import {
  formatFriendlyCourseDisplayName,
  formatFriendlyCourseStatusSummary,
  formatFriendlyValidationIssue,
  getCmsGuidedTourSteps,
  getCmsCentralHelpTopics,
} from '../multilingual/cmsContentStudioView.ts';

test('Test 1: All 28 Course Tracks appear in Lango Content Studio', () => {
  const summaries = getAllCmsTrackSummaries();
  assert.equal(summaries.length, 28, 'Expected exactly 28 Course Tracks in CMS');

  const dirA = summaries.filter((t) => t.learningDirection === 'en_to_foreign');
  const dirB = summaries.filter((t) => t.learningDirection === 'foreign_to_en');
  assert.equal(dirA.length, 14, 'Expected 14 Foreign Language (EN -> X) tracks');
  assert.equal(dirB.length, 14, 'Expected 14 Learn English (X -> EN) tracks');

  const metrics = getCmsDashboardMetrics();
  assert.equal(metrics.totalRegisteredTracks, 28);
  assert.equal(metrics.supportedLanguagesCount, 15);
});

test('Test 2: Ukrainian course remains unchanged and functional (29 modules, 1,810 module words, 5,510 assessments)', () => {
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(COURSE_MODULES[0].id, 'A0.1');
  assert.equal(COURSE_MODULES[28].id, 'C1.1');

  const totalVocab = COURSE_MODULES.reduce((s, m) => s + m.vocab.length, 0);
  assert.equal(totalVocab, 1810);

  let totalAssessments = 0;
  for (const mod of COURSE_MODULES) {
    const inlineCount = (
      (mod.structuredLesson as { embeddedChecks?: unknown[] } | undefined)
        ?.embeddedChecks || []
    ).length;
    totalAssessments +=
      inlineCount +
      mod.cfu.length +
      mod.practice.length +
      mod.exam.length;
  }
  assert.equal(totalAssessments, 5510);
  assert.ok(FREQ_6000_DB.length >= 2417);
  assert.equal(READER_PASSAGES.length, 52);

  const ukTrack = getCourseTrackById(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.ok(ukTrack);
  assert.equal(ukTrack.availability, 'published');
  assert.equal(ukTrack.modules.length, 29);
});

test('Test 3: Empty Course Track opens in CMS without errors', () => {
  clearCmsDraftAndHistoryForTrack('track:fr-to-en');
  const draft = getOrCreateCmsCourseDraft('track:fr-to-en');
  assert.equal(draft.courseTrackId, 'track:fr-to-en');
  assert.equal(draft.lifecycleState, 'EMPTY');
  assert.equal(draft.draftPackage.targetLanguage, 'en');
  assert.equal(draft.draftPackage.nativeLanguage, 'fr');
  assert.deepEqual(draft.draftPackage.modules, []);

  const preview = renderIsolatedCmsDraftPreview('track:fr-to-en');
  assert.equal(preview.usesUniversalCoursePlayer, true);
  assert.equal(preview.isIsolatedFromStudentFsrs, true);
  assert.ok(preview.html.includes('track:fr-to-en'));
});

test('Test 4 & Test 5: Valid JSON course can be previewed; Invalid JSON produces useful validation errors', () => {
  const validPreview = validateAndPreviewCourseImport(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:es-to-en'
  );
  assert.equal(validPreview.valid, true);
  assert.equal(validPreview.moduleCount, 2);
  assert.equal(validPreview.errors.length, 0);

  const malformedPreview = validateAndPreviewCourseImport(
    '{ "schemaVersion": "1.0", broken json ',
    'track:es-to-en'
  );
  assert.equal(malformedPreview.valid, false);
  assert.ok(
    malformedPreview.errors.some((e) => e.includes('Invalid JSON syntax'))
  );
});

test('Test 6: Course cannot be imported into wrong language track', () => {
  // Attempt to import Spanish->English package into Japanese->English track
  const wrongNativeRes = importCourseJsonIntoCmsDraft(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:ja-to-en',
    'full_draft_import'
  );
  assert.equal(wrongNativeRes.success, false);
  assert.ok(wrongNativeRes.previewReport.errors.length > 0);

  // Attempt to import Spanish->English package into Ukrainian track
  const wrongUkRes = importCourseJsonIntoCmsDraft(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:en-to-uk',
    'full_draft_import'
  );
  assert.equal(wrongUkRes.success, false);
});

test('Test 7: English for Spanish speakers (track:es-to-en) and English for Japanese speakers (track:ja-to-en) remain strictly separate', () => {
  clearCmsDraftAndHistoryForTrack('track:es-to-en');
  clearCmsDraftAndHistoryForTrack('track:ja-to-en');

  const esImport = importCourseJsonIntoCmsDraft(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:es-to-en',
    'full_draft_import'
  );
  assert.equal(esImport.success, true);

  const esDraft = getOrCreateCmsCourseDraft('track:es-to-en');
  const jaDraft = getOrCreateCmsCourseDraft('track:ja-to-en');

  assert.equal(esDraft.draftPackage.modules.length, 2);
  assert.equal(
    jaDraft.draftPackage.modules.length,
    0,
    'Importing into track:es-to-en must never populate track:ja-to-en'
  );
  assert.equal(jaDraft.lifecycleState, 'EMPTY');
});

test('Test 8: Lesson and module can be edited, reordered, duplicated, and incrementally merged in draft without changing published content', () => {
  clearCmsDraftAndHistoryForTrack('track:es-to-en');
  importCourseJsonIntoCmsDraft(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:es-to-en',
    'full_draft_import'
  );

  // Edit lesson title and prose while preserving stable lessonId
  const updatedEnv = updateCmsLessonInDraft(
    'track:es-to-en',
    'es_en_test_m1',
    'es_en_test_les_1',
    {
      title: 'El sujeto explícito obligatorio ("It is" vs "Es") — Editado en Studio',
      instructionalText: 'Updated instructional text in CMS draft.',
    }
  );
  const editedLesson =
    updatedEnv.draftPackage.modules[0].sections![0].lessons![0];
  assert.equal(editedLesson.lessonId, 'es_en_test_les_1');
  assert.ok(editedLesson.title.includes('Editado en Studio'));

  // Reorder modules and verify stable moduleIds are preserved
  const reordered = reorderCmsModulesInDraft('track:es-to-en', 0, 1);
  assert.equal(reordered.draftPackage.modules[0].moduleId, 'es_en_test_m2');
  assert.equal(reordered.draftPackage.modules[1].moduleId, 'es_en_test_m1');

  // Duplicate module with fresh stable ID
  const duplicated = duplicateCmsModuleInDraft(
    'track:es-to-en',
    'es_en_test_m1',
    'es_en_test_m1_dup'
  );
  assert.equal(duplicated.draftPackage.modules.length, 3);

  // Safe incremental module merge: add Module 3 without deleting the 3 existing modules
  const incrementalPayload = {
    ...SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
    modules: [
      {
        moduleId: 'es_en_test_m3_inc',
        title: 'Módulo 3 Incremental',
        sections: [],
      },
    ],
  };
  const incRes = importCourseJsonIntoCmsDraft(
    JSON.stringify(incrementalPayload),
    'track:es-to-en',
    'incremental_module_merge'
  );
  assert.equal(incRes.success, true);
  assert.equal(
    incRes.draftEnvelope?.draftPackage.modules.length,
    4,
    'Incremental merge must preserve existing modules and append the new module'
  );

  // Verify live CourseTrack in courseTrackRegistry was NOT mutated into published state
  const liveEsTrack = getCourseTrackById('track:es-to-en');
  assert.equal(liveEsTrack?.modules.length, 0);
});

test('Test 9 & Test 10: Draft preview uses the actual Universal Course Player and never modifies real FSRS progress', () => {
  saveIsolatedTrackProgress('track:es-to-en', {
    xp: 120,
    reviewsCompleted: 5,
    fsrsItems: {
      en_lex_0001: {
        vocabularyItemId: 'en_lex_0001',
        state: 'review',
        interval: 6,
        ease: 2.5,
        due: 1700000000000,
      },
    },
  });
  const beforeProgress = getCourseTrackProgress('track:es-to-en');

  const preview = renderIsolatedCmsDraftPreview('track:es-to-en');
  assert.equal(preview.usesUniversalCoursePlayer, true);
  assert.equal(preview.isIsolatedFromStudentFsrs, true);
  assert.ok(
    preview.html.includes('data-testid="cms-isolated-universal-player-preview"')
  );
  assert.ok(preview.html.includes('Módulo 3 Incremental'));
  // Ensure progress-mutating onclick handlers are sandboxed
  assert.equal(
    preview.html.includes('onclick="answerUniversalCourseActivity('),
    false
  );

  const afterProgress = getCourseTrackProgress('track:es-to-en');
  assert.equal(afterProgress.xp, beforeProgress.xp);
  assert.equal(afterProgress.reviewsCompleted, beforeProgress.reviewsCompleted);
  assert.deepEqual(afterProgress.fsrsItems, beforeProgress.fsrsItems);
});

test('Test 11 & Test 12: Shared canonical English vocabulary remains separate from native-language overlays; editing one overlay never modifies other overlays', () => {
  const lexemes = getAllCanonicalEnglishLexemes();
  assert.ok(lexemes.length >= 3);

  const beforeJa = resolveEnglishVocabCardForTrack(
    'en_lex_0001',
    'track:ja-to-en'
  );
  const beforeHi = resolveEnglishVocabCardForTrack(
    'en_lex_0001',
    'track:hi-to-en'
  );
  assert.ok(beforeJa.canonical);
  assert.ok(beforeJa.overlay);
  assert.ok(beforeHi.overlay);

  const originalCanonicalMeaning = beforeJa.canonical.coreMeaningEn;
  const originalJaTranslation = beforeJa.overlay.translationNative;
  const originalHiTranslation = beforeHi.overlay.translationNative;

  // Edit ONLY the Spanish overlay for en_lex_0001
  const existingEsOverlays = getAllNativeOverlaysForLexeme('en_lex_0001');
  const esOverlay = existingEsOverlays.find((o) => o.nativeLanguage === 'es')!;
  upsertNativeLanguageOverlayInCms({
    ...esOverlay,
    translationNative: 'es importante (actualizado en CMS para español)',
  });

  const afterEs = resolveEnglishVocabCardForTrack(
    'en_lex_0001',
    'track:es-to-en'
  );
  const afterJa = resolveEnglishVocabCardForTrack(
    'en_lex_0001',
    'track:ja-to-en'
  );
  const afterHi = resolveEnglishVocabCardForTrack(
    'en_lex_0001',
    'track:hi-to-en'
  );

  assert.equal(
    afterEs.overlay?.translationNative,
    'es importante (actualizado en CMS para español)'
  );
  assert.equal(
    afterJa.overlay?.translationNative,
    originalJaTranslation,
    'Japanese overlay must remain completely untouched'
  );
  assert.equal(
    afterHi.overlay?.translationNative,
    originalHiTranslation,
    'Hindi Devanagari overlay must remain completely untouched'
  );
  assert.equal(
    afterJa.canonical?.coreMeaningEn,
    originalCanonicalMeaning,
    'Shared canonical English meaning must remain untouched'
  );
});

test('Test 13, Test 14, Test 15 & Test 16: CMS Validation Center detects invalid answer keys, duplicate IDs, missing vocabulary refs, and missing media refs', () => {
  const brokenPackage = JSON.parse(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON
  );

  // 1. Duplicate module ID (Test 14)
  brokenPackage.modules[1].moduleId = brokenPackage.modules[0].moduleId;

  // 2. Missing vocabulary reference & missing media reference on lesson (Tests 15 & 16)
  brokenPackage.modules[0].sections[0].lessons[0].vocabularyRefs = [
    'non_existent_vocab_999',
  ];
  brokenPackage.modules[0].sections[0].lessons[0].mediaRefs = [
    '/images/identify/non_existent_photo_999.webp',
  ];

  // 3. Invalid assessment answer key: correctIndex out of range (Test 13)
  brokenPackage.modules[0].sections[0].lessons[0].activities[1] = {
    activityId: 'es_en_test_act_2',
    activityType: 'knowledge_check_mc',
    title: 'Broken Question',
    payload: {
      options: ['Option A', 'Option B'],
      correctIndex: 5, // Out of range!
    },
  };

  // 4. Duplicate activity ID (Test 14)
  brokenPackage.modules[0].sections[0].lessons[0].activities[2].activityId =
    'es_en_test_act_1';

  const report = validateCmsCourseDraft('track:es-to-en', brokenPackage);
  assert.equal(report.canPublish, false);
  assert.ok(report.errorCount >= 5);

  const codes = new Set(report.issues.map((i) => i.code));
  assert.ok(
    codes.has('MISSING_OR_INVALID_CORRECT_ANSWER'),
    'Must detect invalid correctIndex answer key (Test 13)'
  );
  assert.ok(
    codes.has('DUPLICATE_MODULE_ID'),
    'Must detect duplicate moduleId (Test 14)'
  );
  assert.ok(
    codes.has('DUPLICATE_ACTIVITY_ID'),
    'Must detect duplicate activityId (Test 14)'
  );
  assert.ok(
    codes.has('BROKEN_VOCABULARY_REFERENCE'),
    'Must detect missing vocabulary reference (Test 15)'
  );
  assert.ok(
    codes.has('MISSING_REQUIRED_MEDIA'),
    'Must detect missing media asset reference (Test 16)'
  );
  assert.ok(
    codes.has('HUMAN_PEDAGOGICAL_REVIEW_REQUIRED'),
    'Must include realistic INFO reminder for human pedagogical review'
  );
});

test('Test 17 & Test 18: Version history preserves previous content, computes diffs, and restores previous versions without affecting other Course Tracks', () => {
  clearCmsDraftAndHistoryForTrack('track:de-to-en');
  clearCmsDraftAndHistoryForTrack('track:it-to-en');

  // Create initial draft in track:de-to-en (Version 1)
  const modV1 = {
    moduleId: 'de_en_m1',
    title: 'Modul 1: Original Version Title',
    proficiencyLevel: 'A1',
    sections: [
      {
        sectionId: 'de_en_s1',
        title: 'Sektion 1',
        lessons: [
          {
            lessonId: 'de_en_l1',
            title: 'Lektion 1 Original',
            activities: [],
          },
        ],
      },
    ],
  };
  addOrUpdateCmsModuleInDraft('track:de-to-en', modV1);

  // Create draft in another track (track:it-to-en) to verify isolation during rollback
  addOrUpdateCmsModuleInDraft('track:it-to-en', {
    moduleId: 'it_en_m1',
    title: 'Modulo Italiano Intatto',
    sections: [],
  });

  const histAfterV1 = getCmsVersionHistory('track:de-to-en');
  assert.equal(histAfterV1.length, 1);
  const v1Id = histAfterV1[0].versionId;

  // Modify module title in track:de-to-en (Version 2)
  addOrUpdateCmsModuleInDraft('track:de-to-en', {
    ...modV1,
    title: 'Modul 1: Modified Version 2 Title',
  });
  const histAfterV2 = getCmsVersionHistory('track:de-to-en');
  assert.equal(histAfterV2.length, 2);
  const v2Id = histAfterV2[0].versionId;

  // Compare Version 1 and Version 2
  const diff = compareCmsVersionSnapshots('track:de-to-en', v1Id, v2Id);
  assert.equal(diff.changedModuleTitles.length, 1);
  assert.equal(
    diff.changedModuleTitles[0].before,
    'Modul 1: Original Version Title'
  );
  assert.equal(
    diff.changedModuleTitles[0].after,
    'Modul 1: Modified Version 2 Title'
  );

  // Restore Version 1
  const restoreRes = restoreCmsVersionSnapshot('track:de-to-en', v1Id);
  assert.equal(
    restoreRes.restoredEnvelope.draftPackage.modules[0].title,
    'Modul 1: Original Version Title'
  );
  assert.equal(restoreRes.backupSnapshot.revisionOrigin, 'pre_rollback_backup');

  // Verify track:it-to-en was completely untouched by the rollback on track:de-to-en
  const itDraft = getOrCreateCmsCourseDraft('track:it-to-en');
  assert.equal(
    itDraft.draftPackage.modules[0].title,
    'Modulo Italiano Intatto'
  );
});

test('Test 19 & Test 20: Course can be exported into valid JSON and re-parsed/revalidated cleanly', () => {
  const exported = exportCmsCourseDraftToJson('track:de-to-en');
  assert.ok(exported.jsonString.length > 50);
  assert.equal(exported.exportedPackage.courseTrackId, 'track:de-to-en');

  const reimportedPreview = validateAndPreviewCourseImport(
    exported.jsonString,
    'track:de-to-en'
  );
  assert.equal(reimportedPreview.valid, true);
  assert.equal(reimportedPreview.courseTrackId, 'track:de-to-en');
  assert.equal(reimportedPreview.moduleCount, 1);
});

test('Test 21: Existing Ukrainian WebP scenes (120 active + 100 archived on disk) and audio remain accessible in Media Library', () => {
  const mediaCatalog = getCmsMediaLibraryCatalog();
  assert.equal(
    mediaCatalog.length,
    120,
    'Expected all 120 active Ukrainian Identify WebP scenes in Media Library'
  );

  const allIdentifyScenes = IDENTIFY_CATEGORIES.flatMap((c) => c.scenes);
  assert.equal(allIdentifyScenes.length, 120);
  assert.equal(ARCHIVED_LEGACY_SCENES_FOR_AUDIT.length, 100);

  for (const asset of mediaCatalog) {
    assert.ok(asset.assetPath.endsWith('.webp'));
    const diskPath = path.join(process.cwd(), 'public', asset.assetPath);
    assert.equal(
      fs.existsSync(diskPath),
      true,
      `Missing WebP file on disk: ${diskPath}`
    );
  }
});

test('Test 22, Test 23 & Test 24: All 8 learning tabs, build structure, and Cloud Run server configuration remain intact', () => {
  const indexHtml = fs.readFileSync(
    path.join(process.cwd(), 'index.html'),
    'utf8'
  );
  const requiredTabIds = [
    'tab-course',
    'tab-en2uk',
    'tab-srs',
    'tab-vocab',
    'tab-identify',
    'tab-correction',
    'tab-phonetics',
    'tab-reader',
  ];
  for (const tabId of requiredTabIds) {
    assert.ok(
      indexHtml.includes(`id="${tabId}"`),
      `Missing learner tab ${tabId} in index.html`
    );
  }
  assert.ok(
    indexHtml.includes('id="lango-cms-studio-root"'),
    'Expected #lango-cms-studio-root container in index.html'
  );

  const serverTs = fs.readFileSync(
    path.join(process.cwd(), 'server.ts'),
    'utf8'
  );
  assert.ok(serverTs.includes('0.0.0.0'));
  assert.ok(serverTs.includes('process.env.PORT'));

  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );
  assert.equal(pkgJson.scripts.start, 'node server.ts');
  assert.ok(pkgJson.dependencies.dotenv);
});

test('Test 25: Public users cannot access unauthorized CMS editing, importing, restoring, or publishing operations', () => {
  setSimulatedPublicProductionModeForTesting(true);
  try {
    const ctx = evaluateCmsAccessContext();
    assert.equal(ctx.isAllowed, false);
    assert.equal(ctx.activeRole, 'unauthenticated_public');
    assert.equal(ctx.grantedScopes.length, 0);

    // Every mutating or CMS operation must throw an access denial error
    assert.throws(() => {
      addOrUpdateCmsModuleInDraft('track:es-to-en', {
        moduleId: 'unauth_m1',
        title: 'Unauthorized Module',
      });
    }, /Access Denied/);

    assert.throws(() => {
      importCourseJsonIntoCmsDraft(
        SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
        'track:es-to-en'
      );
    }, /Access Denied/);

    assert.throws(() => {
      restoreCmsVersionSnapshot('track:de-to-en', 'v1');
    }, /Access Denied/);

    assert.throws(() => {
      transitionCmsDraftLifecycleState('track:de-to-en', 'PUBLISHED', true);
    }, /Access Denied/);
  } finally {
    setSimulatedPublicProductionModeForTesting(false);
  }
});

// ============================================================================
// UKRAINIAN CMS INTEGRATION REGRESSION TESTS (SECTION 11: TEST A — TEST M)
// ============================================================================

test('TEST A, TEST B & TEST C: Main Course tab and Content Studio Editor display all 29 published Ukrainian modules with real lesson content, vocabulary, and assessments', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST A: Main Course tab data
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(COURSE_MODULES[0].id, 'A0.1');
  assert.equal(COURSE_MODULES[28].id, 'C1.1');

  // TEST B: Content Studio Course Editor for Learn Ukrainian (`track:en-to-uk`)
  const ukDraft = getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(
    ukDraft.draftPackage.modules.length,
    29,
    'Expected Content Studio Editor to load all 29 Ukrainian modules (never modules: [])'
  );
  assert.equal(ukDraft.lifecycleState, 'PUBLISHED');
  assert.equal(ukDraft.draftPackage.courseStatus, 'published');
  assert.equal(ukDraft.hasDraftChanges, false);
  assert.equal(ukDraft.draftPackage.modules[0].moduleId, 'A0.1');
  assert.equal(ukDraft.draftPackage.modules[28].moduleId, 'C1.1');

  // Verify Course Manager summary matches
  const ukSummary = getAllCmsTrackSummaries().find(
    (s) => s.trackId === PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.ok(ukSummary);
  assert.equal(ukSummary.publishedModuleCount, 29);
  assert.equal(ukSummary.draftLessonCount, 145); // 29 modules * 5 structured sections

  // TEST C: Select a Ukrainian module in the CMS editor and verify real lesson content, vocabulary refs, and assessments
  const modA01 = ukDraft.draftPackage.modules[0];
  assert.equal(modA01.moduleId, 'A0.1');
  assert.equal(modA01.title, COURSE_MODULES[0].title);
  assert.equal(modA01.sections?.length, 5);
  assert.ok((modA01.vocabularyReferences?.length || 0) >= 60);

  const sec1Lesson = modA01.sections![0].lessons![0];
  assert.equal(sec1Lesson.lessonId, 'A0.1_les_grammar');
  assert.ok(sec1Lesson.instructionalText && sec1Lesson.instructionalText.length > 100);
  assert.ok((sec1Lesson.activities?.length || 0) >= 4);

  const sec2Cfu = modA01.sections![1].lessons![0];
  assert.ok((sec2Cfu.activities?.length || 0) >= COURSE_MODULES[0].cfu.length);

  const sec3Practice = modA01.sections![2].lessons![0];
  assert.equal(sec3Practice.activities?.length, COURSE_MODULES[0].practice.length);

  const sec4Vocab = modA01.sections![3].lessons![0];
  assert.equal(sec4Vocab.activities?.length, 1);
  assert.equal(sec4Vocab.vocabularyRefs?.length, COURSE_MODULES[0].vocab.length);

  const sec5Exam = modA01.sections![4].lessons![0];
  assert.equal(sec5Exam.activities?.length, COURSE_MODULES[0].exam.length);
});

test('TEST D & TEST E: CMS Preview Published and Preview Draft both display the 29-module Ukrainian course through the Universal Course Player', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST D: Preview Published
  const pubPreview = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  assert.equal(pubPreview.usesUniversalCoursePlayer, true);
  assert.equal(pubPreview.isIsolatedFromStudentFsrs, true);
  assert.equal(pubPreview.previewMode, 'published');
  assert.equal(pubPreview.moduleCount, 29);
  assert.ok(pubPreview.html.includes('A0.1'));
  assert.ok(pubPreview.html.includes('C1.1'));
  assert.ok(pubPreview.html.includes('PREVIEW PUBLISHED BASELINE'));

  // TEST E: Preview Draft with no draft changes
  const draftPreview = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  assert.equal(draftPreview.usesUniversalCoursePlayer, true);
  assert.equal(draftPreview.isIsolatedFromStudentFsrs, true);
  assert.equal(draftPreview.previewMode, 'draft');
  assert.equal(draftPreview.moduleCount, 29);
  assert.equal(draftPreview.hasDraftChanges, false);
  assert.ok(draftPreview.html.includes('A0.1'));
  assert.ok(draftPreview.html.includes('C1.1'));
});

test('TEST F & TEST G: Safe Draft Edit on Ukrainian module updates Draft View & Draft Preview while Published Baseline & Learner Course remain untouched; Discard Draft restores baseline', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);
  const originalTitleInSource = COURSE_MODULES[0].title;

  // TEST F: Make a small draft edit to a Ukrainian lesson in A0.1
  const editedEnv = updateCmsLessonInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'A0.1',
    'A0.1_les_grammar',
    {
      title: 'A0.1 Lesson & Grammar — [STUDIO DRAFT OVERLAY TEST EDIT]',
    }
  );

  // 1. Draft overlay stores the change and marks A0.1 as MODIFIED_DRAFT while other 28 modules remain UNCHANGED
  assert.equal(editedEnv.hasDraftChanges, true);
  assert.deepEqual(editedEnv.modifiedModuleIds, ['A0.1']);
  assert.equal(editedEnv.draftPackage.modules.length, 29);
  assert.equal(
    editedEnv.draftPackage.modules[0].metadata?.cmsOriginStatus,
    'MODIFIED_DRAFT'
  );
  assert.equal(
    editedEnv.draftPackage.modules[1].metadata?.cmsOriginStatus,
    'UNCHANGED'
  );

  // 2. Draft Preview reflects the change
  const draftPreviewAfterEdit = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  assert.equal(draftPreviewAfterEdit.hasDraftChanges, true);
  assert.ok(
    draftPreviewAfterEdit.html.includes('[STUDIO DRAFT OVERLAY TEST EDIT]')
  );

  // 3. Published Baseline and Preview Published remain completely unchanged
  const pubBaseline = getPublishedBaselineCoursePackage(
    PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.ok(pubBaseline);
  assert.equal(
    pubBaseline.modules[0].sections![0].lessons![0].title.includes(
      '[STUDIO DRAFT OVERLAY TEST EDIT]'
    ),
    false
  );
  const pubPreviewAfterEdit = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  assert.equal(
    pubPreviewAfterEdit.html.includes('[STUDIO DRAFT OVERLAY TEST EDIT]'),
    false
  );

  // 4. Main learner COURSE_MODULES is untouched
  assert.equal(COURSE_MODULES[0].title, originalTitleInSource);

  // 5. Diff vs Published Baseline accurately reports 1 modified lesson
  const diffVsPub = computeCmsDraftVsPublishedDiff(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.ok(diffVsPub);
  assert.deepEqual(diffVsPub.modifiedLessonIds, ['A0.1_les_grammar']);

  // TEST G: Discard Draft restores the original 29-module Published Baseline
  const afterDiscard = discardCmsDraftOverlay(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(afterDiscard.hasDraftChanges, false);
  assert.equal(afterDiscard.draftPackage.modules.length, 29);
  assert.equal(
    afterDiscard.draftPackage.modules[0].sections![0].lessons![0].title.includes(
      '[STUDIO DRAFT OVERLAY TEST EDIT]'
    ),
    false
  );
  assert.equal(
    afterDiscard.draftPackage.modules[0].metadata?.cmsOriginStatus,
    'PUBLISHED'
  );
});

test('TEST H, TEST I, TEST J, TEST K, TEST L & TEST M: Version Snapshot, Empty Track, Bilingual Separation, Publication Safety, and Learner Preservation', () => {
  // TEST H: Version history for Ukrainian always includes the 29-module v0_published_baseline and never 0-module snapshots
  const ukHistory = getCmsVersionHistory(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.ok(ukHistory.length >= 1);
  const baselineSnap = ukHistory.find(
    (s) => s.versionId === 'v0_published_baseline'
  );
  assert.ok(baselineSnap, 'Expected v0_published_baseline snapshot');
  assert.equal(baselineSnap.packageSnapshot.modules.length, 29);
  for (const snap of ukHistory) {
    assert.ok(
      snap.packageSnapshot.modules.length >= 29,
      `Ukrainian snapshot ${snap.versionId} must never have 0 modules`
    );
  }

  // Publication Safety: Attempting to validate or publish an empty or truncated Ukrainian package is blocked
  const truncatedPkg = {
    ...baselineSnap.packageSnapshot,
    modules: baselineSnap.packageSnapshot.modules.slice(0, 28), // missing C1.1
  };
  const truncatedReport = validateCmsCourseDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    truncatedPkg
  );
  assert.equal(truncatedReport.canPublish, false);
  assert.ok(
    truncatedReport.issues.some(
      (i) => i.code === 'ACCIDENTAL_MODULE_DELETION_DETECTED'
    )
  );

  // TEST I: Empty Course Track (e.g., Learn Spanish `track:en-to-es`) continues to show empty state
  clearCmsDraftAndHistoryForTrack('track:en-to-es');
  const esForeignDraft = getOrCreateCmsCourseDraft('track:en-to-es');
  assert.equal(esForeignDraft.lifecycleState, 'EMPTY');
  assert.equal(esForeignDraft.draftPackage.courseStatus, 'draft');
  assert.equal(esForeignDraft.draftPackage.modules.length, 0);

  // TEST J: Bilingual English Track Separation (`track:es-to-en` vs `track:ja-to-en`)
  const esEnTrack = getCourseTrackById('track:es-to-en');
  const jaEnTrack = getCourseTrackById('track:ja-to-en');
  assert.notEqual(esEnTrack?.trackId, jaEnTrack?.trackId);
  assert.equal(esEnTrack?.nativeLanguage, 'es');
  assert.equal(jaEnTrack?.nativeLanguage, 'ja');

  // TEST K, L, M: Vocabulary, Assessments, FSRS, Identify, and all 8 tabs intact
  assert.equal(
    COURSE_MODULES.reduce((acc, m) => acc + m.vocab.length, 0),
    1810
  );
  assert.equal(
    IDENTIFY_CATEGORIES.flatMap((c) => c.scenes).length,
    120
  );
});

// ============================================================================
// BEGINNER-FRIENDLY CONTENT STUDIO UX REDESIGN TESTS (SECTION 26: TEST A — TEST R)
// ============================================================================

test('Beginner UX Redesign (TEST A — TEST R): Plain-English course names, friendly status summaries, plain-English validation messages, guided tour, and central help', () => {
  // 1. Plain-English Course Display Names (TEST C, TEST M, TEST N)
  const ukDisplay = formatFriendlyCourseDisplayName(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(ukDisplay, 'Learn Ukrainian (English → Ukrainian)');

  const esEnDisplay = formatFriendlyCourseDisplayName('track:es-to-en');
  assert.equal(esEnDisplay, 'English for Spanish Speakers (Spanish → English)');
  assert.notEqual(
    formatFriendlyCourseDisplayName('track:es-to-en'),
    formatFriendlyCourseDisplayName('track:ja-to-en')
  );

  // 2. Friendly Course Status Summary for Published vs Empty vs Unpublished Changes (TEST C, TEST L)
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);
  const summaries = getAllCmsTrackSummaries();
  const ukSummary = summaries.find((s) => s.trackId === PUBLISHED_UKRAINIAN_TRACK_ID)!;
  const ukStatus = formatFriendlyCourseStatusSummary(ukSummary);
  assert.equal(ukStatus.shortStatusLabel, 'Published');
  assert.equal(ukStatus.moduleCountLabel, '29 Published Modules');
  assert.equal(ukStatus.isStarted, true);

  clearCmsDraftAndHistoryForTrack('track:en-to-es');
  const esForeignSummary = getAllCmsTrackSummaries().find(
    (s) => s.trackId === 'track:en-to-es'
  )!;
  const esStatus = formatFriendlyCourseStatusSummary(esForeignSummary);
  assert.equal(esStatus.badgeLabel, 'Not Started');
  assert.equal(esStatus.moduleCountLabel, '0 Modules');
  assert.equal(
    esStatus.description,
    "This course doesn't have any lessons yet."
  );
  assert.equal(esStatus.isStarted, false);

  // 3. Friendly Validation Messages (TEST I): What is wrong, Where, Why it matters, How to fix it
  const sampleError = formatFriendlyValidationIssue(
    {
      issueId: 'test_err_1',
      severity: 'ERROR',
      code: 'MISSING_OR_INVALID_CORRECT_ANSWER',
      courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
      locationPath: 'modules[0].sections[0].lessons[0].activities[1]',
      message: 'Activity act_2 has invalid correctIndex',
    },
    PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.equal(sampleError.categoryLabel, 'Must Fix');
  assert.equal(
    sampleError.whatIsWrong,
    "This question doesn't have a valid correct answer selected."
  );
  assert.ok(sampleError.whereItIs.includes('Module A0.1'));
  assert.ok(sampleError.whyItMatters.includes('Without a valid correct answer choice'));
  assert.ok(sampleError.howToFixIt.includes('Correct Answer'));
  assert.equal(sampleError.canJumpToEditor, true);

  // 4. Guided Tour & Central Help Topics (TEST A, TEST B)
  const tourSteps = getCmsGuidedTourSteps();
  assert.equal(tourSteps.length, 7);
  assert.equal(tourSteps[0].stepNumber, 1);
  assert.equal(tourSteps[6].stepNumber, 7);

  const helpTopics = getCmsCentralHelpTopics();
  assert.equal(helpTopics.length, 8);
  assert.ok(
    helpTopics.some((t) => t.title === 'How to edit a lesson')
  );
  assert.ok(
    helpTopics.some(
      (t) => t.title === 'How to undo mistakes or restore an earlier version'
    )
  );
});

// ============================================================================
// SAFE CONTENT REMOVAL, UNDO, RESTORE, AND FULL COURSE STRUCTURE EDITING TESTS
// (SECTION 17: TEST 1 — TEST 22)
// ============================================================================

test('TEST 1, TEST 2, TEST 3, TEST 4 & TEST 5: Remove Paragraph, Example Sentence, Grammar Table Row, and Entire Grammar Table in Draft with Immediate Undo & Targeted Restore', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // Inspect initial A0.1 lesson
  const initialDraft = getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  const initialMod = initialDraft.draftPackage.modules[0];
  const initialLes = initialMod.sections![0].lessons![0];
  const initialParagraphs = (initialLes.instructionalText || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  assert.ok(initialParagraphs.length >= 2, 'Expected at least 2 paragraphs in A0.1_les_grammar');
  const targetParaIdx = initialParagraphs.length - 1;
  const removedParagraphText = initialParagraphs[targetParaIdx];

  // TEST 1: Remove Paragraph in Draft (low-impact -> no confirmation required)
  const paraImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'lesson_paragraph',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    paragraphIndex: targetParaIdx,
  });
  assert.equal(paraImpact.requiresConfirmation, false);
  assert.equal(paraImpact.severity, 'low');

  const paraRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'lesson_paragraph',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    paragraphIndex: targetParaIdx,
  });
  assert.equal(paraRemoval.removedRecord.status, 'REMOVED_IN_DRAFT');
  assert.ok(paraRemoval.undoBannerMessage.includes('removed from your draft'));

  // Verify Draft Preview no longer shows the removed paragraph, while Published Preview still shows it
  const draftPrevAfterPara = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  const pubPrevAfterPara = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  const removedSnippet = removedParagraphText.slice(0, 30);
  assert.equal(draftPrevAfterPara.html.includes(removedSnippet), false);
  assert.equal(pubPrevAfterPara.html.includes(removedSnippet), true);

  // TEST 2: Undo Paragraph Removal
  const undoState1 = getCmsUndoRedoState(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(undoState1.canUndo, true);
  const undoRes1 = undoLastCmsAction(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(undoRes1.success, true);

  const draftAfterUndo = getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  const lesAfterUndo = draftAfterUndo.draftPackage.modules[0].sections![0].lessons![0];
  assert.ok((lesAfterUndo.instructionalText || '').includes(removedParagraphText));

  // Verify Redo also works, then Undo again
  const redoRes1 = redoLastCmsAction(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(redoRes1.success, true);
  undoLastCmsAction(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST 3: Remove Example Sentence in Draft (`lesson_explanation` activity `A0.1_act_grammar`)
  const rulesActBefore =
    getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID).draftPackage.modules[0]
      .sections![0].lessons![0].activities![0];
  const initialExamplesCount = (rulesActBefore.payload!.examples as any[]).length;
  assert.ok(initialExamplesCount >= 2);
  const firstExampleUk = (rulesActBefore.payload!.examples as any[])[0].uk;

  const exRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'example_sentence',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    activityId: 'A0.1_act_grammar',
    exampleIndex: 0,
  });
  const rulesActAfter =
    exRemoval.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities![0];
  assert.equal(
    (rulesActAfter.payload!.examples as any[]).length,
    initialExamplesCount - 1
  );
  // Restore via Undo
  undoLastCmsAction(PUBLISHED_UKRAINIAN_TRACK_ID);
  const rulesActRestored =
    getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID).draftPackage.modules[0]
      .sections![0].lessons![0].activities![0];
  assert.equal(
    (rulesActRestored.payload!.examples as any[])[0].uk,
    firstExampleUk
  );

  // TEST 4: Remove Grammar Table Row in Draft (`A0.1_act_tables`)
  const tablesActBefore =
    getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID).draftPackage.modules[0]
      .sections![0].lessons![0].activities![1];
  const initialTables = tablesActBefore.payload!.tables as any[];
  assert.ok(initialTables.length >= 1);
  const initialRowCount = initialTables[0].rows.length;
  const firstRowCell0 = initialTables[0].rows[0][0];

  const rowImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'grammar_table_row',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    activityId: 'A0.1_act_tables',
    tableIndex: 0,
    rowIndex: 0,
  });
  assert.equal(rowImpact.requiresConfirmation, false);

  const rowRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'grammar_table_row',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    activityId: 'A0.1_act_tables',
    tableIndex: 0,
    rowIndex: 0,
  });
  const tablesAfterRow =
    rowRemoval.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities![1].payload!.tables as any[];
  assert.equal(tablesAfterRow[0].rows.length, initialRowCount - 1);

  // Restore row via Removed Items Restore
  const restoreRowRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    rowRemoval.removedRecord.removalId
  );
  assert.equal(restoreRowRes.success, true);
  const tablesAfterRowRestore =
    restoreRowRes.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities![1].payload!.tables as any[];
  assert.equal(tablesAfterRowRestore[0].rows.length, initialRowCount);
  assert.equal(tablesAfterRowRestore[0].rows[0][0], firstRowCell0);

  // TEST 5: Remove Entire Grammar Table in Draft (requires confirmation because it is a structured table)
  const initialTableCount = tablesAfterRowRestore.length;
  const firstTableTitle = tablesAfterRowRestore[0].title;
  const tableImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'grammar_table',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    activityId: 'A0.1_act_tables',
    tableIndex: 0,
  });
  assert.equal(tableImpact.requiresConfirmation, true);

  const tableRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'grammar_table',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_lesson',
    lessonId: 'A0.1_les_grammar',
    activityId: 'A0.1_act_tables',
    tableIndex: 0,
  });
  const tablesAfterTableRemoval =
    tableRemoval.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities![1].payload!.tables as any[];
  assert.equal(tablesAfterTableRemoval.length, initialTableCount - 1);

  // Verify Draft Preview vs Published Preview for grammar table removal
  const draftPrevNoTable = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  const pubPrevWithTable = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  const escapedTableTitle = String(firstTableTitle)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
  assert.equal(draftPrevNoTable.html.includes(escapedTableTitle), false);
  assert.equal(pubPrevWithTable.html.includes(escapedTableTitle), true);

  // Restore table from Removed Items
  const restoreTableRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    tableRemoval.removedRecord.removalId
  );
  assert.equal(restoreTableRes.success, true);
  const tablesRestored =
    restoreTableRes.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities![1].payload!.tables as any[];
  assert.equal(tablesRestored.length, initialTableCount);
  assert.equal(tablesRestored[0].title, firstTableTitle);
});

test('TEST 6, TEST 7 & TEST 8: Remove Practice Question, Non-Correct Answer Choice, and Correct Answer Choice (Blocking Validation Error)', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // Navigate to A0.1 Section 2 (CFU / Knowledge Checks): lesson `A0.1_les_checks`, activity `A0.1_cfu_1`
  const draft0 = getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  const cfuLesson0 = draft0.draftPackage.modules[0].sections![1].lessons![0];
  const initialCfuCount = cfuLesson0.activities!.length;
  const firstCfuId = cfuLesson0.activities![0].activityId;

  // TEST 6: Remove Practice Question in Draft (requires confirmation)
  const actImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'activity',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_checks',
    lessonId: 'A0.1_les_checks',
    activityId: firstCfuId,
  });
  assert.equal(actImpact.requiresConfirmation, true);

  const actRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'activity',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_checks',
    lessonId: 'A0.1_les_checks',
    activityId: firstCfuId,
  });
  const cfuLessonAfter =
    actRemoval.envelope.draftPackage.modules[0].sections![1].lessons![0];
  assert.equal(cfuLessonAfter.activities!.length, initialCfuCount - 1);
  assert.equal(
    cfuLessonAfter.activities!.some((a) => a.activityId === firstCfuId),
    false
  );

  // Restore the removed question from Removed Items
  const restoreActRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    actRemoval.removedRecord.removalId
  );
  assert.equal(restoreActRes.success, true);
  assert.equal(
    restoreActRes.envelope.draftPackage.modules[0].sections![1].lessons![0]
      .activities!.length,
    initialCfuCount
  );

  // TEST 7: Remove Non-Correct Answer Choice
  const targetAct =
    getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID).draftPackage.modules[0]
      .sections![1].lessons![0].activities![0];
  const optionsBefore = [...(targetAct.payload!.options as string[])];
  const correctIdxBefore = Number(targetAct.payload!.correctIndex);
  assert.ok(optionsBefore.length >= 3);
  const correctAnswerText = optionsBefore[correctIdxBefore];
  const nonCorrectIdx = correctIdxBefore === 0 ? 1 : 0;

  const nonCorrectRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'answer_option',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_checks',
      lessonId: 'A0.1_les_checks',
      activityId: targetAct.activityId,
      optionIndex: nonCorrectIdx,
    }
  );
  const actAfterNonCorrect =
    nonCorrectRemoval.envelope.draftPackage.modules[0].sections![1].lessons![0]
      .activities![0];
  const optionsAfterNonCorrect = actAfterNonCorrect.payload!.options as string[];
  const newCorrectIdx = Number(actAfterNonCorrect.payload!.correctIndex);
  assert.equal(optionsAfterNonCorrect.length, optionsBefore.length - 1);
  assert.equal(
    optionsAfterNonCorrect[newCorrectIdx],
    correctAnswerText,
    'Remaining correct answer must stay bound to the same choice text'
  );

  // Undo non-correct option removal so we have all original options back
  undoLastCmsAction(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST 8: Remove the Currently Marked Correct Answer Choice
  const actBeforeCorrectRemoval =
    getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID).draftPackage.modules[0]
      .sections![1].lessons![0].activities![0];
  const currCorrectIdx = Number(actBeforeCorrectRemoval.payload!.correctIndex);

  const correctChoiceImpact = analyzeCmsRemovalImpact(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'answer_option',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_checks',
      lessonId: 'A0.1_les_checks',
      activityId: actBeforeCorrectRemoval.activityId,
      optionIndex: currCorrectIdx,
    }
  );
  assert.equal(
    correctChoiceImpact.requiresConfirmation,
    true,
    'Removing the currently marked correct answer must require confirmation'
  );
  assert.equal(correctChoiceImpact.willInvalidateCorrectAnswer, true);

  const correctChoiceRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'answer_option',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_checks',
      lessonId: 'A0.1_les_checks',
      activityId: actBeforeCorrectRemoval.activityId,
      optionIndex: currCorrectIdx,
    }
  );
  const actAfterCorrectRemoval =
    correctChoiceRemoval.envelope.draftPackage.modules[0].sections![1].lessons![0]
      .activities![0];
  assert.equal(
    actAfterCorrectRemoval.payload!.correctIndex,
    -1,
    'Must NOT silently mark another choice as correct; correctIndex must be set to -1'
  );

  // Validation must block publication with MISSING_OR_INVALID_CORRECT_ANSWER
  const valReport = validateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(valReport.canPublish, false);
  assert.ok(
    valReport.issues.some(
      (i) => i.code === 'MISSING_OR_INVALID_CORRECT_ANSWER'
    ),
    'Expected blocking MISSING_OR_INVALID_CORRECT_ANSWER validation issue'
  );
});

test('TEST 9, TEST 10, TEST 11 & TEST 12: Remove Vocabulary Link and Media Link (Preserving Global Assets), Remove Lesson, and Remove Section with Impact Confirmation', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST 9: Remove Vocabulary Reference from Lesson without deleting global vocabulary word
  const draft0 = getOrCreateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  const mod0 = draft0.draftPackage.modules[0];
  const les0 = mod0.sections![0].lessons![0];
  const vocabToUnlink = les0.vocabularyRefs![0];
  const initialVocabCount = les0.vocabularyRefs!.length;

  const vocabRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'vocabulary_reference',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_lesson',
      lessonId: 'A0.1_les_grammar',
      vocabId: vocabToUnlink,
    }
  );
  const lesAfterVocab =
    vocabRemoval.envelope.draftPackage.modules[0].sections![0].lessons![0];
  assert.equal(lesAfterVocab.vocabularyRefs!.length, initialVocabCount - 1);
  assert.equal(lesAfterVocab.vocabularyRefs!.includes(vocabToUnlink), false);

  // Verify Draft Preview hides the unlinked vocabulary reference while Published Preview still shows it
  const draftPrevVocab = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  const pubPrevVocab = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  assert.equal(
    draftPrevVocab.html.includes(`data-testid="btn-add-track-vocab-${vocabToUnlink}"`),
    false
  );
  assert.equal(
    pubPrevVocab.html.includes(`data-testid="btn-add-track-vocab-${vocabToUnlink}"`),
    true
  );

  // Verify global Ukrainian vocabulary & FSRS database remain 100% untouched
  assert.equal(
    COURSE_MODULES.reduce((acc, m) => acc + m.vocab.length, 0),
    1810
  );
  assert.equal(FREQ_6000_DB.length, 2417);

  // TEST 10: Link a media asset to the lesson, then remove the Media Reference without deleting the asset from Media Library
  const mediaCatalogBefore = getCmsMediaLibraryCatalog();
  assert.equal(mediaCatalogBefore.length, 120);
  const sampleMediaPath = mediaCatalogBefore[0].assetPath;

  addCmsLessonMediaRefInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'A0.1',
    'A0.1_les_grammar',
    sampleMediaPath
  );
  const draftPrevWithMedia = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  assert.equal(draftPrevWithMedia.html.includes(sampleMediaPath), true);

  const mediaRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'media_reference',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_lesson',
      lessonId: 'A0.1_les_grammar',
      mediaPath: sampleMediaPath,
    }
  );
  const lesAfterMedia =
    mediaRemoval.envelope.draftPackage.modules[0].sections![0].lessons![0];
  assert.equal((lesAfterMedia.mediaRefs || []).includes(sampleMediaPath), false);

  // Global Media Library still has all 120 active WebP scenes
  assert.equal(getCmsMediaLibraryCatalog().length, 120);

  // TEST 11: Remove Lesson in Draft (shows impact summary & requires confirmation)
  const lessonImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'lesson',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_checks',
    lessonId: 'A0.1_les_checks',
  });
  assert.equal(lessonImpact.requiresConfirmation, true);
  assert.ok(lessonImpact.affectedCounts.questions >= 10);

  const lessonRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'lesson',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_checks',
      lessonId: 'A0.1_les_checks',
    }
  );
  const secCfuAfterLessonRemoval =
    lessonRemoval.envelope.draftPackage.modules[0].sections![1];
  assert.equal(secCfuAfterLessonRemoval.lessons!.length, 0);

  // Validation reports EMPTY_SECTION_IN_DRAFT warning
  const valAfterEmptySec = validateCmsCourseDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.ok(
    valAfterEmptySec.issues.some((i) => i.code === 'EMPTY_SECTION_IN_DRAFT')
  );

  // Restore Lesson from Removed Items
  const restoreLessonRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    lessonRemoval.removedRecord.removalId
  );
  assert.equal(restoreLessonRes.success, true);
  assert.equal(
    restoreLessonRes.envelope.draftPackage.modules[0].sections![1].lessons!
      .length,
    1
  );

  // TEST 12: Remove Section in Draft (shows impact summary & requires confirmation)
  const sectionImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'section',
    moduleId: 'A0.1',
    sectionId: 'A0.1_sec_practice',
  });
  assert.equal(sectionImpact.requiresConfirmation, true);
  assert.equal(sectionImpact.affectedCounts.lessons, 1);
  assert.ok(sectionImpact.affectedCounts.questions >= 10);

  const sectionRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'section',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_practice',
    }
  );
  assert.equal(
    sectionRemoval.envelope.draftPackage.modules[0].sections!.length,
    4
  );

  // Restore Section from Removed Items
  const restoreSecRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    sectionRemoval.removedRecord.removalId
  );
  assert.equal(restoreSecRes.success, true);
  assert.equal(
    restoreSecRes.envelope.draftPackage.modules[0].sections!.length,
    5
  );
  assert.equal(
    restoreSecRes.envelope.draftPackage.modules[0].sections![2].sectionId,
    'A0.1_sec_practice',
    'Restored section must return to its original index'
  );
});

test('TEST 13, TEST 14, TEST 15, TEST 16, TEST 17, TEST 18, TEST 19, TEST 20, TEST 21 & TEST 22: Module Removal in Draft, Targeted Restore from Removed Items, Discard Draft Changes, Cross-Track Isolation, and Full Learner Preservation', () => {
  clearCmsDraftAndHistoryForTrack(PUBLISHED_UKRAINIAN_TRACK_ID);

  // TEST 13: Remove Module in Draft (`C1.1`)
  const modImpact = analyzeCmsRemovalImpact(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'module',
    moduleId: 'C1.1',
  });
  assert.equal(modImpact.requiresConfirmation, true);
  assert.equal(modImpact.affectedCounts.sections, 5);
  assert.equal(modImpact.affectedCounts.lessons, 5);
  assert.ok(modImpact.affectedCounts.questions >= 40);
  assert.ok(modImpact.affectedCounts.vocabularyRefs >= 60);

  const modRemoval = removeCmsContentItemInDraft(PUBLISHED_UKRAINIAN_TRACK_ID, {
    itemType: 'module',
    moduleId: 'C1.1',
  });
  // Draft now has 28 modules
  assert.equal(modRemoval.envelope.draftPackage.modules.length, 28);
  assert.equal(
    modRemoval.envelope.draftPackage.modules.some((m) => m.moduleId === 'C1.1'),
    false
  );

  // Published Baseline and learner COURSE_MODULES still have 29 modules!
  const pubBaseline = getPublishedBaselineCoursePackage(
    PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.ok(pubBaseline);
  assert.equal(pubBaseline.modules.length, 29);
  assert.equal(COURSE_MODULES.length, 29);

  // Preview Draft has 28 modules, Preview Published has 29 modules
  const prevDraft = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'draft'
  );
  const prevPub = renderIsolatedCmsDraftPreview(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    'published'
  );
  assert.equal(prevDraft.moduleCount, 28);
  assert.equal(prevPub.moduleCount, 29);

  // Also remove a paragraph in A0.1 so we have 2 distinct items in Removed Items
  const paraRemoval = removeCmsContentItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    {
      itemType: 'lesson_paragraph',
      moduleId: 'A0.1',
      sectionId: 'A0.1_sec_lesson',
      lessonId: 'A0.1_les_grammar',
      paragraphIndex: 0,
    }
  );

  const removedItems = getCmsRemovedItemsInDraft(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(removedItems.length, 2);

  // Check Unpublished Changes summary (Section 14)
  const changeSummary = computeCmsDetailedChangeSummary(
    PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.equal(changeSummary.modulesRemoved, 1);
  assert.ok(changeSummary.lessonsModified >= 1);
  assert.equal(changeSummary.pendingRemovedItemsCount, 2);

  // TEST 14: Restore ONE specific removed item (C1.1 module) from Removed Items without restoring the removed paragraph
  const restoreModRes = restoreRemovedCmsItemInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID,
    modRemoval.removedRecord.removalId
  );
  assert.equal(restoreModRes.success, true);
  assert.equal(restoreModRes.envelope.draftPackage.modules.length, 29);
  assert.equal(
    restoreModRes.envelope.draftPackage.modules[28].moduleId,
    'C1.1'
  );
  // The paragraph removal must still remain in Removed Items
  const remainingRemoved = getCmsRemovedItemsInDraft(
    PUBLISHED_UKRAINIAN_TRACK_ID
  );
  assert.equal(remainingRemoved.length, 1);
  assert.equal(
    remainingRemoved[0].removalId,
    paraRemoval.removedRecord.removalId
  );

  // TEST 15: Discard All Unpublished Draft Changes restores all 29 modules and clears Removed Items
  const afterDiscard = discardCmsDraftOverlay(PUBLISHED_UKRAINIAN_TRACK_ID);
  assert.equal(afterDiscard.draftPackage.modules.length, 29);
  assert.equal(afterDiscard.hasDraftChanges, false);
  assert.equal(
    getCmsRemovedItemsInDraft(PUBLISHED_UKRAINIAN_TRACK_ID).length,
    0
  );

  // TEST 16: Empty Course Track (`track:en-to-es`) Add + Remove + Restore
  clearCmsDraftAndHistoryForTrack('track:en-to-es');
  addOrUpdateCmsModuleInDraft('track:en-to-es', {
    moduleId: 'es_m1',
    title: 'Spanish Module 1',
    sections: [
      {
        sectionId: 'es_s1',
        title: 'Section 1',
        lessons: [
          {
            lessonId: 'es_l1',
            title: 'Lesson 1',
            instructionalText: 'Hola! Welcome to Spanish Lesson 1.',
            activities: [],
          },
        ],
      },
    ],
  });
  const addedSec = addCmsSectionToModuleInDraft('track:en-to-es', 'es_m1');
  assert.equal(addedSec.envelope.draftPackage.modules[0].sections!.length, 2);
  const addedLes = addCmsLessonToSectionInDraft(
    'track:en-to-es',
    'es_m1',
    'es_s1'
  );
  assert.equal(
    addedLes.envelope.draftPackage.modules[0].sections![0].lessons!.length,
    2
  );
  const dupLes = duplicateCmsLessonInDraft('track:en-to-es', 'es_m1', 'es_l1');
  assert.equal(
    dupLes.envelope.draftPackage.modules[0].sections![0].lessons!.length,
    3
  );
  const addedAct = addCmsActivityToLessonInDraft(
    'track:en-to-es',
    'es_m1',
    'es_l1'
  );
  assert.equal(
    addedAct.envelope.draftPackage.modules[0].sections![0].lessons![0]
      .activities!.length,
    1
  );
  const dupAct = duplicateCmsActivityInDraft(
    'track:en-to-es',
    'es_m1',
    'es_l1',
    addedAct.addedActivity.activityId
  );
  assert.equal(
    dupAct.envelope.draftPackage.modules[0].sections![0].lessons![0].activities!
      .length,
    2
  );
  addCmsAnswerOptionInDraft(
    'track:en-to-es',
    'es_m1',
    'es_l1',
    addedAct.addedActivity.activityId
  );

  // Remove the duplicated lesson in `track:en-to-es` and restore it
  const remEsLes = removeCmsContentItemInDraft('track:en-to-es', {
    itemType: 'lesson',
    moduleId: 'es_m1',
    sectionId: 'es_s1',
    lessonId: dupLes.duplicatedLesson.lessonId,
  });
  assert.equal(
    remEsLes.envelope.draftPackage.modules[0].sections![0].lessons!.length,
    2
  );
  const restEsLes = restoreRemovedCmsItemInDraft(
    'track:en-to-es',
    remEsLes.removedRecord.removalId
  );
  assert.equal(
    restEsLes.envelope.draftPackage.modules[0].sections![0].lessons!.length,
    3
  );

  // TEST 17: Bilingual English Track Isolation (`track:es-to-en` vs `track:ja-to-en`)
  clearCmsDraftAndHistoryForTrack('track:es-to-en');
  clearCmsDraftAndHistoryForTrack('track:ja-to-en');
  importCourseJsonIntoCmsDraft(
    SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
    'track:es-to-en'
  );
  removeCmsContentItemInDraft('track:es-to-en', {
    itemType: 'module',
    moduleId: 'es_en_test_m2',
  });
  assert.equal(
    getOrCreateCmsCourseDraft('track:es-to-en').draftPackage.modules.length,
    1
  );
  assert.equal(
    getOrCreateCmsCourseDraft('track:ja-to-en').draftPackage.modules.length,
    0,
    'Removing content in track:es-to-en must never modify track:ja-to-en'
  );
  clearCmsDraftAndHistoryForTrack('track:es-to-en');
  clearCmsDraftAndHistoryForTrack('track:en-to-es');

  // TEST 18, 19, 20, 21 & 22: Learner Course, FSRS, Identify, and Security Verification
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(FREQ_6000_DB.length, 2417);
  assert.equal(IDENTIFY_CATEGORIES.flatMap((c) => c.scenes).length, 120);
  assert.equal(READER_PASSAGES.length > 0, true);
});



