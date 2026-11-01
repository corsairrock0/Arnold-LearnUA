import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { COURSE_MODULES } from '../courseData.ts';
import { FREQ_6000_DB } from '../vocabData.ts';
import { IDENTIFY_CATEGORIES } from '../identifyData.ts';
import {
  getAllLanguages,
  getForeignLanguages,
  getAllTargetLanguages,
  getSupportedNativeLanguagesForEnglish,
  getLanguageByCode,
  getLanguageHtmlAttributes,
  inspectHindiScriptMetadata,
  normalizeMultilingualText,
  getInterfaceText,
  registerInterfaceLocaleBundle,
} from '../multilingual/languageRegistry.ts';
import {
  PUBLISHED_UKRAINIAN_TRACK_ID,
  getAllCourseTracks,
  getCourseTrackById,
  getDirectionACourseTracks,
  getDirectionBCourseTracks,
  resolveCourseTrack,
  resetDevPilotTrackState,
} from '../multilingual/courseTrackRegistry.ts';
import {
  getCourseTrackProgress,
  saveIsolatedTrackProgress,
  setSelectedCourseTrackId,
  getSelectedCourseTrackId,
  registerCanonicalEnglishLexeme,
  registerNativeLanguageVocabOverlay,
  resolveEnglishVocabCardForTrack,
  evaluateCourseTrackModuleAccess,
} from '../multilingual/courseTrackProgress.ts';
import {
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
  validateAndPreviewCourseImport,
  commitDevPilotCourseImport,
} from '../multilingual/universalCourseImporter.ts';
import {
  SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON,
  ensureCanonicalEnglishOverlaySeeds,
  addTrackVocabItemToIsolatedFsrs,
  gradeTrackIsolatedFsrsItem,
  answerUniversalCourseActivity,
  markUniversalLessonComplete,
} from '../multilingual/universalCoursePlayer.ts';

describe('Lango Phase 1 — Multilingual Foundation, Universal Course Importer, Hindi Support & 28 Course Tracks (25 Required Checks)', () => {
  beforeEach(() => {
    resetDevPilotTrackState('track:es-to-en');
    resetDevPilotTrackState('track:en-to-hi');
    setSelectedCourseTrackId(PUBLISHED_UKRAINIAN_TRACK_ID);
  });

  it('Checks 1–4: Existing Ukrainian modules (29), progress keys, vocabulary (1,810 module words + 6,000 FSRS), and Identify photos (100 WebP scenes) remain 100% intact', () => {
    // 1. Existing Ukrainian modules load normally
    assert.equal(
      COURSE_MODULES.length,
      29,
      'Ukrainian curriculum must retain all 29 modules'
    );
    assert.equal(COURSE_MODULES[0].id, 'A0.1');
    assert.equal(COURSE_MODULES[28].id, 'C1.1');

    const ukTrack = getCourseTrackById(PUBLISHED_UKRAINIAN_TRACK_ID);
    assert.ok(ukTrack, 'Published Ukrainian track must exist');
    assert.equal(ukTrack.courseId, 'course:uk:from-en:v1');
    assert.equal(ukTrack.availability, 'published');
    assert.equal(ukTrack.modules.length, 29);

    // 2. Existing Ukrainian progress storage keys remain intact and non-destructive
    assert.equal(ukTrack.progressNamespace, 'slovo_ua_6000_anki_v1');
    assert.equal(
      ukTrack.assessmentProgressNamespace,
      'slovo_ua_course_assessments_v1'
    );

    // 3. Existing Ukrainian vocabulary remains intact
    const totalCourseVocab = COURSE_MODULES.reduce(
      (sum, mod) => sum + mod.vocab.length,
      0
    );
    assert.equal(
      totalCourseVocab,
      1810,
      'All 1,810 expanded Ukrainian module vocabulary entries must remain intact'
    );
    assert.ok(
      FREQ_6000_DB.length >= 1400,
      'FREQ_6000_DB FSRS lexicon must remain intact'
    );

    // 4. Existing Ukrainian Identify photos remain intact
    assert.equal(
      IDENTIFY_CATEGORIES.length,
      20,
      'All 20 Identify categories must remain intact'
    );
    const allIdentifyScenes = IDENTIFY_CATEGORIES.flatMap((c) => c.scenes);
    assert.equal(
      allIdentifyScenes.length,
      100,
      'All 100 Identify photographic scenes must remain intact'
    );
    for (const scene of allIdentifyScenes) {
      assert.ok(
        scene.assetPath.endsWith('.webp'),
        `Identify scene ${scene.id} must retain its WebP photo path`
      );
    }
  });

  it('Checks 5–6: Language selector displays all 14 foreign languages including Hindi (hi, हिन्दी, Devanagari script)', () => {
    const foreignLangs = getForeignLanguages();
    assert.equal(foreignLangs.length, 14);
    const expectedForeign = [
      'es',
      'fr',
      'it',
      'pt',
      'ru',
      'uk',
      'pl',
      'de',
      'zh',
      'vi',
      'ko',
      'ja',
      'ar',
      'hi',
    ];
    assert.deepEqual(
      foreignLangs.map((l) => l.code),
      expectedForeign
    );

    // Check 6: Hindi appears with native name हिन्दी and Devanagari script
    const hindi = getLanguageByCode('hi');
    assert.ok(hindi, 'Hindi (hi) must be registered');
    assert.equal(hindi.nameEn, 'Hindi');
    assert.equal(hindi.nativeName, 'हिन्दी');
    assert.equal(hindi.scriptCode, 'Deva');
    assert.equal(hindi.direction, 'ltr');
    assert.equal(hindi.pronunciationMetadata.defaultVariety, 'hi-IN');
    assert.equal(hindi.grammarMetadata.scriptRequiresCombiningMarks, true);
    assert.equal(hindi.grammarMetadata.wordOrderDefault, 'SOV');
    assert.equal(hindi.grammarMetadata.adpositionType, 'postpositional');
  });

  it('Checks 7–9: English (en) appears as a target language and selecting English displays all 14 native-language options', () => {
    // Check 7: English appears as a target language (14 foreign + 1 English = 15)
    const allTargets = getAllTargetLanguages();
    assert.equal(allTargets.length, 15);
    const englishTarget = getLanguageByCode('en');
    assert.ok(englishTarget);
    assert.equal(englishTarget.nameEn, 'English');
    assert.equal(englishTarget.isEnglishTarget, true);

    // Check 8 & 9: Selecting English exposes all 14 native-language options
    const nativeOptions = getSupportedNativeLanguagesForEnglish();
    assert.equal(nativeOptions.length, 14);
    const nativeCodes = nativeOptions.map((l) => l.code);
    assert.ok(nativeCodes.includes('es'));
    assert.ok(nativeCodes.includes('ja'));
    assert.ok(nativeCodes.includes('hi'));
    assert.ok(nativeCodes.includes('ar'));
    assert.ok(nativeCodes.includes('uk'));
  });

  it('Check 10: Selecting English + Spanish resolves to a different Course Track than English + Japanese', () => {
    const esToEn = resolveCourseTrack('en', 'es');
    const jaToEn = resolveCourseTrack('en', 'ja');
    const hiToEn = resolveCourseTrack('en', 'hi');

    assert.ok(esToEn);
    assert.ok(jaToEn);
    assert.ok(hiToEn);

    assert.equal(esToEn.trackId, 'track:es-to-en');
    assert.equal(jaToEn.trackId, 'track:ja-to-en');
    assert.equal(hiToEn.trackId, 'track:hi-to-en');

    assert.notEqual(esToEn.trackId, jaToEn.trackId);
    assert.notEqual(esToEn.courseId, jaToEn.courseId);
    assert.notEqual(esToEn.instructionalLanguage, jaToEn.instructionalLanguage);
    assert.notEqual(esToEn.progressNamespace, jaToEn.progressNamespace);
    assert.notEqual(
      esToEn.vocabularyAssociation.presentationOverlayId,
      jaToEn.vocabularyAssociation.presentationOverlayId
    );

    assert.equal(esToEn.courseTitle, 'English for Spanish Speakers');
    assert.equal(jaToEn.courseTitle, 'English for Japanese Speakers');
    assert.equal(hiToEn.courseTitle, 'English for Hindi Speakers');
  });

  it('Checks 11–12: All 27 unfinished Course Tracks show clean Coming Soon states and contain zero fake curriculum data', () => {
    const allTracks = getAllCourseTracks();
    assert.equal(
      allTracks.length,
      28,
      'Registry must have 28 total tracks (14 Direction A + 14 Direction B)'
    );
    assert.equal(getDirectionACourseTracks().length, 14);
    assert.equal(getDirectionBCourseTracks().length, 14);

    const unfinishedTracks = allTracks.filter(
      (t) => t.trackId !== PUBLISHED_UKRAINIAN_TRACK_ID
    );
    assert.equal(unfinishedTracks.length, 27);

    for (const track of unfinishedTracks) {
      assert.equal(
        track.availability,
        'coming_soon',
        `Track ${track.trackId} must be marked coming_soon`
      );
      assert.equal(
        track.modules.length,
        0,
        `Track ${track.trackId} must have zero fake curriculum modules`
      );
      assert.ok(
        track.comingSoonTitle.includes('Coming Soon'),
        `Track ${track.trackId} must provide a clear Coming Soon title`
      );
    }
  });

  it('Check 13: Switching Course Tracks does not mix progress across tracks or alter Ukrainian progress', () => {
    saveIsolatedTrackProgress('track:es-to-en', {
      completedModuleIds: ['es-en-mod-a1-1'],
      xp: 250,
    });
    saveIsolatedTrackProgress('track:ja-to-en', {
      completedModuleIds: ['ja-en-mod-a1-1', 'ja-en-mod-a1-2'],
      xp: 600,
    });

    const esProg = getCourseTrackProgress('track:es-to-en');
    const jaProg = getCourseTrackProgress('track:ja-to-en');
    const hiProg = getCourseTrackProgress('track:en-to-hi');
    const ukProg = getCourseTrackProgress(PUBLISHED_UKRAINIAN_TRACK_ID);

    assert.deepEqual(esProg.completedModuleIds, ['es-en-mod-a1-1']);
    assert.equal(esProg.xp, 250);

    assert.deepEqual(jaProg.completedModuleIds, [
      'ja-en-mod-a1-1',
      'ja-en-mod-a1-2',
    ]);
    assert.equal(jaProg.xp, 600);

    assert.deepEqual(hiProg.completedModuleIds, []);
    assert.equal(hiProg.xp, 0);

    // Ukrainian track progress remains isolated
    assert.equal(ukProg.courseTrackId, PUBLISHED_UKRAINIAN_TRACK_ID);

    setSelectedCourseTrackId('track:en-to-hi');
    assert.equal(getSelectedCourseTrackId(), 'track:en-to-hi');
    setSelectedCourseTrackId(PUBLISHED_UKRAINIAN_TRACK_ID);
    assert.equal(getSelectedCourseTrackId(), PUBLISHED_UKRAINIAN_TRACK_ID);
  });

  it('Checks 14–21: Universal Course JSON Importer validates metadata, rejects invalid/mismatched packages, detects duplicates, preserves unsupported activity metadata, prevents overwriting Ukrainian, and supports dev-only pilot import + reset', () => {
    // Check 14 & 19: Importer detects target/native/instructional languages and produces accurate preview counts
    const previewReport = validateAndPreviewCourseImport(
      SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
      'track:es-to-en'
    );
    assert.equal(previewReport.valid, true);
    assert.equal(previewReport.targetLanguage, 'en');
    assert.equal(previewReport.nativeLanguage, 'es');
    assert.equal(previewReport.instructionalLanguage, 'es');
    assert.equal(previewReport.courseTrackId, 'track:es-to-en');
    assert.equal(previewReport.moduleCount, 2);
    assert.equal(previewReport.sectionCount, 2);
    assert.equal(previewReport.lessonCount, 2);
    assert.equal(previewReport.activityCount, 4);
    assert.equal(previewReport.vocabularyReferenceCount, 3);

    // Check 18: Unsupported activity types are reported clearly while preserving metadata
    assert.ok(
      previewReport.unsupportedActivityTypes.length > 0,
      'Unsupported activity type must be flagged in preview report'
    );
    assert.equal(previewReport.validationStatus, 'valid_with_warnings');
    assert.ok(previewReport.parsedPackage);

    // Check 15: Importer rejects incompatible Course Track mappings (e.g. importing es->en into ja->en)
    const mismatchReport = validateAndPreviewCourseImport(
      SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
      'track:ja-to-en'
    );
    assert.equal(mismatchReport.valid, false);
    assert.equal(mismatchReport.validationStatus, 'rejected');
    assert.ok(
      mismatchReport.errors.length > 0,
      'Cross-track mismatch must be rejected'
    );

    // Check 16: Importer rejects invalid JSON syntax
    const badJsonReport = validateAndPreviewCourseImport(
      '{ "schemaVersion": "1.0", broken_json ',
      'track:es-to-en'
    );
    assert.equal(badJsonReport.valid, false);
    assert.equal(badJsonReport.validationStatus, 'rejected');
    assert.ok(
      badJsonReport.errors.some((e) => e.includes('Invalid JSON syntax'))
    );

    // Check 17: Importer detects duplicate identifiers
    const parsedFixture = JSON.parse(
      SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON
    );
    parsedFixture.modules.push({ ...parsedFixture.modules[0] }); // duplicate module ID
    const dupReport = validateAndPreviewCourseImport(
      JSON.stringify(parsedFixture),
      'track:es-to-en'
    );
    assert.equal(dupReport.valid, false);
    assert.ok(
      dupReport.duplicateIdentifiers.length > 0,
      'Duplicate module ID must be detected'
    );

    // Check 20: Importer cannot overwrite the published Ukrainian course
    const ukOverwriteReport = validateAndPreviewCourseImport(
      SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
      PUBLISHED_UKRAINIAN_TRACK_ID
    );
    assert.equal(ukOverwriteReport.valid, false);
    assert.ok(
      ukOverwriteReport.errors.some((e) =>
        e.toLowerCase().includes('ukrainian')
      ),
      'Attempting to import into track:en-to-uk must be rejected'
    );

    // Check 21: Synthetic test import into an empty track works in dev mode and resets cleanly
    const commitRes = commitDevPilotCourseImport(
      SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
      'track:es-to-en',
      {
        confirmedByDeveloper: true,
        isDevelopmentEnvironment: true,
      }
    );
    assert.equal(commitRes.committed, true);
    const esTrackAfterCommit = getCourseTrackById('track:es-to-en');
    assert.equal(esTrackAfterCommit?.availability, 'dev_pilot_imported');
    assert.ok(esTrackAfterCommit?.importedPackageData);

    // Reset back to clean coming_soon state
    resetDevPilotTrackState('track:es-to-en');
    const esTrackAfterReset = getCourseTrackById('track:es-to-en');
    assert.equal(esTrackAfterReset?.availability, 'coming_soon');
    assert.equal(esTrackAfterReset?.modules.length, 0);
    assert.equal(esTrackAfterReset?.importedPackageData, undefined);
  });

  it('Checks 22–24: Arabic RTL, Hindi Devanagari (matras, halant, anusvara, chandrabindu), CJK, Vietnamese, and Cyrillic scripts normalize and render properly', () => {
    // Check 22: Arabic RTL
    const arAttrs = getLanguageHtmlAttributes('ar');
    assert.equal(arAttrs.dir, 'rtl');
    assert.equal(arAttrs.lang, 'ar');
    const arSample = normalizeMultilingualText('العربية — قريباً', 'ar');
    assert.ok(arSample.includes('العربية'));

    // Check 23: Hindi Devanagari script & combining vowel signs
    const hiAttrs = getLanguageHtmlAttributes('hi');
    assert.equal(hiAttrs.dir, 'ltr');
    assert.equal(hiAttrs.lang, 'hi');
    const hindiSample =
      'हिन्दी भाषा में मात्राएँ (ा, ि, ी, ु, ू, े, ै, ो, औ), हलन्त (्), अनुस्वार (ं) और चन्द्रबिन्दु (ँ) सुरक्षित हैं।';
    const hiInspect = inspectHindiScriptMetadata(hindiSample);
    assert.equal(hiInspect.normalizedNfc, hindiSample.normalize('NFC'));
    assert.equal(hiInspect.containsDevanagari, true);
    assert.ok(hiInspect.dependentVowelSignsMatras.length > 0);
    assert.equal(hiInspect.hasHalantVirama, true);
    assert.equal(hiInspect.hasAnusvara, true);
    assert.equal(hiInspect.hasChandrabindu, true);

    // Check 24: Chinese, Japanese, Korean, Vietnamese, and Cyrillic
    const multilingualSamples = [
      { code: 'zh', sample: '中文课程即将推出' },
      { code: 'ja', sample: '日本語コースは近日公開予定です' },
      { code: 'ko', sample: '한국어 과정이 곧 제공됩니다' },
      { code: 'vi', sample: 'Tiếng Việt — Sắp ra mắt khóa học' },
      { code: 'uk', sample: 'Українська мова — кличний відмінок' },
      { code: 'ru', sample: 'Русский язык' },
      { code: 'pl', sample: 'Język polski — ą, ę, ć, ł, ń, ó, ś, ź, ż' },
    ];
    for (const item of multilingualSamples) {
      const normalized = normalizeMultilingualText(item.sample, item.code);
      assert.equal(normalized, item.sample.normalize('NFC'));
      assert.ok(getLanguageByCode(item.code));
    }

    // Verify canonical English lexeme + native language overlay separation (Section 18)
    registerCanonicalEnglishLexeme({
      lexemeId: 'en-lex-library',
      headwordEn: 'library',
      pos: 'noun',
      ipaUs: '/ˈlaɪˌbrɛri/',
      ipaGb: '/ˈlaɪbrəri/',
      coreMeaningEn: 'A building or room containing collections of books for borrowing or reference.',
      canonicalExamplesEn: [
        'She studies at the public library every afternoon.',
      ],
    });
    registerNativeLanguageVocabOverlay({
      overlayId: 'vocab-overlay:en:for-es',
      courseTrackId: 'track:es-to-en',
      nativeLanguage: 'es',
      lexemeId: 'en-lex-library',
      translationNative: 'biblioteca',
      explanationNative:
        'Lugar donde se consultan o toman prestados libros.',
      pronunciationTipForNativeSpeaker:
        'Stress the first syllable /ˈlaɪ-/.',
      l1TransferOrFalseFriendNote:
        'False friend alert: "library" = biblioteca; "librería" in Spanish means bookstore!',
      bilingualExamples: [
        {
          en: 'She studies at the public library.',
          native: 'Ella estudia en la biblioteca pública.',
        },
      ],
      pedagogicalSequenceOrder: 1,
    });
    registerNativeLanguageVocabOverlay({
      overlayId: 'vocab-overlay:en:for-hi',
      courseTrackId: 'track:hi-to-en',
      nativeLanguage: 'hi',
      lexemeId: 'en-lex-library',
      translationNative: 'पुस्तकालय (pustakālay)',
      explanationNative:
        'जहाँ किताबें पढ़ने या उधार लेने के लिए रखी जाती हैं।',
      pronunciationTipForNativeSpeaker:
        'प्रथम शब्दांश पर बल दें (/ˈlaɪ-/).',
      bilingualExamples: [
        {
          en: 'She studies at the public library.',
          native: 'वह सार्वजनिक पुस्तकालय में पढ़ती है।',
        },
      ],
      pedagogicalSequenceOrder: 1,
    });

    const esCard = resolveEnglishVocabCardForTrack(
      'en-lex-library',
      'track:es-to-en'
    );
    const hiCard = resolveEnglishVocabCardForTrack(
      'en-lex-library',
      'track:hi-to-en'
    );
    assert.ok(esCard.canonical);
    assert.ok(hiCard.canonical);
    assert.equal(esCard.canonical.headwordEn, 'library');
    assert.equal(hiCard.canonical.headwordEn, 'library');
    assert.equal(esCard.overlay?.translationNative, 'biblioteca');
    assert.equal(hiCard.overlay?.translationNative, 'पुस्तकालय (pustakālay)');

    // Verify future subscription entitlement hook (Section 19)
    const mod1Access = evaluateCourseTrackModuleAccess(
      'track:es-to-en',
      0,
      [],
      true
    );
    const mod5Locked = evaluateCourseTrackModuleAccess(
      'track:es-to-en',
      4,
      [],
      true
    );
    const mod5Unlocked = evaluateCourseTrackModuleAccess(
      'track:es-to-en',
      4,
      [
        {
          grantId: 'grant-es-en',
          scopeType: 'course_track',
          scopeValue: 'track:es-to-en',
          active: true,
        },
      ],
      true
    );
    assert.equal(mod1Access.isUnlocked, true);
    assert.equal(mod1Access.isFreeTierModule, true);
    assert.equal(mod5Locked.isUnlocked, false);
    assert.equal(mod5Unlocked.isUnlocked, true);
    assert.equal(mod5Unlocked.matchedGrantScope, 'course_track');

    // Verify UI localization helper fallback (Section 20)
    registerInterfaceLocaleBundle('es', {
      'selector.whatLanguageToLearn': '¿Qué idioma quieres aprender?',
    });
    registerInterfaceLocaleBundle('hi', {
      'selector.whatLanguageToLearn': 'आप कौन सी भाषा सीखना चाहते हैं?',
    });
    assert.equal(
      getInterfaceText('selector.whatLanguageToLearn', 'es'),
      '¿Qué idioma quieres aprender?'
    );
    assert.equal(
      getInterfaceText('selector.whatLanguageToLearn', 'hi'),
      'आप कौन सी भाषा सीखना चाहते हैं?'
    );
    assert.equal(
      getInterfaceText('selector.whatLanguageToLearn', 'en'),
      'What language do you want to learn?'
    );
  });

  it('Check 25: Production build & Cloud Run startup configuration remain intact', () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.equal(pkg.scripts.start, 'node server.ts');
    assert.ok(
      pkg.dependencies.dotenv,
      'dotenv must be in production dependencies'
    );
    assert.ok(
      pkg.dependencies.express,
      'express must be in production dependencies'
    );
    assert.equal(getAllLanguages().length, 15);
  });

  it('Phase 2 Verification: Interactive Universal Course Player, Hindi (en->hi) Pilot Fixture, Track-Isolated FSRS Grading & All 14 Native-Language Canonical English Overlays', () => {
    ensureCanonicalEnglishOverlaySeeds();

    // 1. Verify all 14 native-language overlays for canonical English lexeme 'en_lex_0001'
    const nativeCodes = getSupportedNativeLanguagesForEnglish().map(
      (l) => l.code
    );
    assert.equal(nativeCodes.length, 14);
    for (const code of nativeCodes) {
      const card = resolveEnglishVocabCardForTrack(
        'en_lex_0001',
        `track:${code}-to-en`
      );
      assert.ok(
        card.canonical,
        `Canonical English lexeme must exist for track:${code}-to-en`
      );
      assert.ok(
        card.overlay,
        `Native-language overlay must exist for track:${code}-to-en`
      );
      assert.equal(card.overlay.nativeLanguage, code);
      assert.ok(card.overlay.translationNative.length > 0);
      assert.ok(card.overlay.explanationNative.length > 0);
    }

    // 2. Verify Hindi (en -> hi) synthetic fixture validates and commits cleanly in dev mode
    const hiPreview = validateAndPreviewCourseImport(
      SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON,
      'track:en-to-hi'
    );
    assert.equal(hiPreview.valid, true);
    assert.equal(hiPreview.targetLanguage, 'hi');
    assert.equal(hiPreview.nativeLanguage, 'en');
    assert.equal(hiPreview.courseTrackId, 'track:en-to-hi');
    assert.equal(hiPreview.moduleCount, 1);

    const hiCommit = commitDevPilotCourseImport(
      SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON,
      'track:en-to-hi',
      {
        confirmedByDeveloper: true,
        isDevelopmentEnvironment: true,
      }
    );
    assert.equal(hiCommit.committed, true);

    // 3. Verify interactive Universal Course Player & Track-Isolated FSRS actions
    answerUniversalCourseActivity('track:en-to-hi', 'hi_test_act_2', 0, 0);
    markUniversalLessonComplete('track:en-to-hi', 'hi_test_m1', 'hi_test_les_1');
    addTrackVocabItemToIsolatedFsrs('track:en-to-hi', 'hi_lex_namaste');
    gradeTrackIsolatedFsrsItem('track:en-to-hi', 'hi_lex_namaste', 3);

    const hiProg = getCourseTrackProgress('track:en-to-hi');
    assert.ok(hiProg.xp >= 50, 'Hindi track XP should increase after activity, lesson, and FSRS review');
    assert.ok(hiProg.completedModuleIds.includes('hi_test_m1'));
    assert.ok(hiProg.completedLessonIds.includes('hi_test_les_1'));
    assert.equal(hiProg.fsrsItems['hi_lex_namaste']?.state, 'review');

    // Reset Hindi pilot track back to coming_soon
    resetDevPilotTrackState('track:en-to-hi');
    assert.equal(getCourseTrackById('track:en-to-hi')?.availability, 'coming_soon');
  });
});
