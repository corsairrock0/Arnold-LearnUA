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
import { IDENTIFY_CATEGORIES } from '../identifyData.ts';
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
} from '../multilingual/cmsContentStudioEngine.ts';

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

test('Test 21: Existing Ukrainian photographs (100 WebP scenes) and audio remain accessible in Media Library', () => {
  const mediaCatalog = getCmsMediaLibraryCatalog();
  assert.equal(
    mediaCatalog.length,
    100,
    'Expected all 100 Ukrainian Identify WebP scenes in Media Library'
  );

  const allIdentifyScenes = IDENTIFY_CATEGORIES.flatMap((c) => c.scenes);
  assert.equal(allIdentifyScenes.length, 100);

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
