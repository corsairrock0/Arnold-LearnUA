// ============================================================================
// LANGO PHASE 2 — UNIVERSAL MULTILINGUAL COURSE PLAYER, TRACK-AWARE MULTI-TAB
// WORKSPACE, TRACK-ISOLATED FSRS ENGINE & ENTITLEMENT SIMULATOR
// ============================================================================

import {
  getLanguageByCode,
  getLanguageHtmlAttributes,
  inspectHindiScriptMetadata,
} from './languageRegistry.ts';
import {
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
  type CourseTrack,
} from './courseTrackRegistry.ts';
import {
  evaluateCourseTrackModuleAccess,
  getCourseTrackProgress,
  registerCanonicalEnglishLexeme,
  registerNativeLanguageVocabOverlay,
  resolveEnglishVocabCardForTrack,
  saveIsolatedTrackProgress,
  type EntitlementGrant,
  type TrackFsrsItemState,
} from './courseTrackProgress.ts';
import {
  SUPPORTED_ACTIVITY_TYPES,
  type UniversalActivityItemV1,
  type UniversalCoursePackageV1,
  type UniversalLessonV1,
  type UniversalModuleV1,
  type UniversalSectionV1,
} from './universalCourseImporter.ts';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================================
// 1. SEED CANONICAL ENGLISH LEXEME & 14 NATIVE-LANGUAGE OVERLAYS (SECTION 19)
// ============================================================================

let canonicalSeedsInitialized = false;

export function ensureCanonicalEnglishOverlaySeeds(): void {
  if (canonicalSeedsInitialized) return;
  canonicalSeedsInitialized = true;

  registerCanonicalEnglishLexeme({
    lexemeId: 'en_lex_0001',
    headwordEn: 'it is important',
    pos: 'phrase / dummy subject structure',
    ipaUs: '/ɪt ɪz ɪmˈpɔːrtənt/',
    ipaGb: '/ɪt ɪz ɪmˈpɔːtənt/',
    coreMeaningEn:
      'Mandatory explicit dummy subject "it" used in English impersonal statements.',
    canonicalExamplesEn: [
      'It is important to practice every day.',
      'It is raining outside right now.',
    ],
  });

  registerCanonicalEnglishLexeme({
    lexemeId: 'en_lex_0002',
    headwordEn: 'schedule',
    pos: 'noun / verb',
    ipaUs: '/ˈskɛdʒuːl/',
    ipaGb: '/ˈʃɛdjuːl/',
    coreMeaningEn: 'A plan for carrying out a process or procedure, giving lists of intended events and times.',
    canonicalExamplesEn: [
      'What is your work schedule this week?',
      'Let us schedule a meeting for Tuesday morning.',
    ],
  });

  registerCanonicalEnglishLexeme({
    lexemeId: 'en_lex_0003',
    headwordEn: 'ship vs. sheep',
    pos: 'minimal pair (noun)',
    ipaUs: '/ʃɪp/ vs. /ʃiːp/',
    ipaGb: '/ʃɪp/ vs. /ʃiːp/',
    coreMeaningEn:
      'Lax high front vowel /ɪ/ (ship = vessel) contrasted with tense high front vowel /iː/ (sheep = animal).',
    canonicalExamplesEn: [
      'The cargo ship arrived at the port.',
      'The sheep are grazing on the green hill.',
    ],
  });

  const overlays: Array<{
    lang: string;
    translation1: string;
    explanation1: string;
    tip1: string;
    ex1Native: string;
  }> = [
    {
      lang: 'es',
      translation1: 'es importante (con sujeto explícito obligatorio "It")',
      explanation1:
        'En español el sujeto impersonal se omite ("Es importante"), pero en inglés jamás se puede decir "*Is important"; siempre requiere "It is important".',
      tip1: 'Pronuncia la "i" corta /ɪ/ en "It is" sin alargarla como la "i" española.',
      ex1Native: 'Es importante practicar todos los días.',
    },
    {
      lang: 'fr',
      translation1: 'il est important',
      explanation1:
        'Comme le pronom impersonnel français « il », l’anglais exige « it » devant « is important ».',
      tip1: 'Ne prononcez pas de /h/ initial et gardez la voyelle /ɪ/ relâchée.',
      ex1Native: 'Il est important de pratiquer chaque jour.',
    },
    {
      lang: 'it',
      translation1: 'è importante (con soggetto obbligatorio "It")',
      explanation1:
        'In italiano il soggetto impersonale è sottinteso («È importante»), mentre in inglese «It» è obbligatorio.',
      tip1: 'Evita di aggiungere una vocale finale dopo la -t di «it».',
      ex1Native: 'È importante esercitarsi ogni giorno.',
    },
    {
      lang: 'pt',
      translation1: 'é importante (com sujeito obrigatório "It")',
      explanation1:
        'Em português dizemos apenas «É importante», mas em inglês o pronome neutro «It» nunca pode ser omitido.',
      tip1: 'Evite transformar o -t final de «it» em «tch» (/tʃ/) antes de consoantes.',
      ex1Native: 'É importante praticar todos os dias.',
    },
    {
      lang: 'ru',
      translation1: 'это важно / важно (с обязательным подлежащим "It" и связкой "is")',
      explanation1:
        'В русском языке в настоящем времени нет глагола-связки («Важно практиковаться»), а в английском обязательны и формальное подлежащее «It», и глагол «is».',
      tip1: 'Краткий звук /ɪ/ в «it is» ближе к русскому «ы/и» без смягчения согласного.',
      ex1Native: 'Важно практиковаться каждый день.',
    },
    {
      lang: 'uk',
      translation1: 'це важливо / важливо (з обов’язковим формальним підметом "It" та дієсловом "is")',
      explanation1:
        'В українській мові безособове речення не потребує підмета («Важливо практикуватися»), тоді як в англійській обов’язково вживається «It is important».',
      tip1: 'Вимовляйте короткий ненапружений голосний /ɪ/ у словах «it is».',
      ex1Native: 'Важливо практикуватися щодня.',
    },
    {
      lang: 'pl',
      translation1: 'to ważne / ważne jest (z obowiązkowym podmiotem "It")',
      explanation1:
        'Po polsku mówimy „Ważne jest, aby…”, natomiast w języku angielskim zdanie musi mieć formalny podmiot „It” przed czasownikiem „is”.',
      tip1: 'Samogłoska /ɪ/ w „it” jest pośrednia między polskim „i” a „y”.',
      ex1Native: 'Ważne jest, aby ćwiczyć każdego dnia.',
    },
    {
      lang: 'de',
      translation1: 'es ist wichtig',
      explanation1:
        'Genau wie das deutsche unpersönliche „es“ in „Es ist wichtig“ verlangt das Englische hier zwingend das Pronomen „It“.',
      tip1: 'Vermeiden Sie Auslautverhärtung bei stimmhaften englischen Endkonsonanten.',
      ex1Native: 'Es ist wichtig, jeden Tag zu üben.',
    },
    {
      lang: 'zh',
      translation1: '……很重要（必须包含形式主语 "It" 和系动词 "is"）',
      explanation1:
        '中文可以说“每天练习很重要”，不需要形式主语或“是”；但英语必须使用形式主语 It 和系动词 is（It is important to...）。',
      tip1: '注意短元音 /ɪ/ 不要发成中文的长音“衣” /iː/，词尾 /t/ 轻轻停住即可，不要加元音。',
      ex1Native: '每天练习是很重要的。',
    },
    {
      lang: 'vi',
      translation1: 'điều quan trọng là (bắt buộc có chủ ngữ giả "It" và động từ to be "is")',
      explanation1:
        'Trong tiếng Việt tính từ đứng một mình làm vị ngữ ("Rất quan trọng"), nhưng tiếng Anh bắt buộc phải có chủ ngữ giả "It" + động từ "is".',
      tip1: 'Phát âm rõ âm cuối /z/ trong "is" và /t/ cuối trong "important".',
      ex1Native: 'Việc luyện tập mỗi ngày rất quan trọng.',
    },
    {
      lang: 'ko',
      translation1: '~하는 것이 중요하다 (형식 주어 "It"과 be동사 "is" 필수)',
      explanation1:
        '한국어는 어순이 주어-목적어-동사(SOV)이고 가주어가 필요 없지만, 영어는 문장 맨 앞에 형식 주어 "It is important to..."를 먼저 배치합니다.',
      tip1: '"important"의 두 번째 음절 /-pɔːr-/에 강세를 두어 발음하세요.',
      ex1Native: '매일 연습하는 것이 중요합니다.',
    },
    {
      lang: 'ja',
      translation1: '〜することが重要です（形式主語 "It" と be動詞 "is" が必須）',
      explanation1:
        '日本語では主語を省略して「毎日練習することが大切です」と言えますが、英語では文頭に形式主語 "It" と動詞 "is" を置く必要があります。',
      tip1: '「イット・イズ」とカタカナで母音を足さず、/ɪt ɪz/ とリンキングして発音しましょう。',
      ex1Native: '毎日練習することが重要です。',
    },
    {
      lang: 'ar',
      translation1: 'من المهم أن... (مع الضمير الصوري الإلزامي "It" وفعل الكينونة "is")',
      explanation1:
        'في اللغة العربية نستخدم الجملة الاسمية في المضارع دون فعل كينونة («من المهم الممارسة»)، أما في الإنجليزية فلا بد من وجود الفاعل الصوري "It" متبوعاً بالفعل "is".',
      tip1: 'ميّز بوضوح بين صوت /p/ المهموس في "important" وصوت /b/ المجهور.',
      ex1Native: 'من المهم أن تتدرب كل يوم.',
    },
    {
      lang: 'hi',
      translation1: 'यह महत्वपूर्ण है (अनिवार्य औपचारिक कर्ता "It" और क्रिया "is" के साथ)',
      explanation1:
        'हिन्दी में क्रिया वाक्य के अंत में आती है ("रोज़ अभ्यास करना महत्वपूर्ण है"), जबकि अंग्रेज़ी में SVO क्रम के कारण वाक्य के आरम्भ में "It is important to..." लगाना अनिवार्य है।',
      tip1: '"It is" में ह्रस्व इ (/ɪ/) का उच्चारण हल्का रखें और "important" के दूसरे अक्षर (-por-) पर बलाघात (stress) दें।',
      ex1Native: 'हर दिन अभ्यास करना महत्वपूर्ण है।',
    },
  ];

  for (const item of overlays) {
    const trackId = `track:${item.lang}-to-en`;
    registerNativeLanguageVocabOverlay({
      overlayId: `vocab-overlay:en:for-${item.lang}`,
      courseTrackId: trackId,
      nativeLanguage: item.lang,
      lexemeId: 'en_lex_0001',
      translationNative: item.translation1,
      explanationNative: item.explanation1,
      pronunciationTipForNativeSpeaker: item.tip1,
      bilingualExamples: [
        {
          en: 'It is important to practice every day.',
          native: item.ex1Native,
        },
      ],
      pedagogicalSequenceOrder: 1,
    });
  }
}

// ============================================================================
// 2. SYNTHETIC HINDI (EN -> HI) PILOT FIXTURE FOR DEV TESTING
// ============================================================================

export const SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE: UniversalCoursePackageV1 = {
  schemaVersion: '1.0',
  courseId: 'course:hi:from-en:v1',
  courseTrackId: 'track:en-to-hi',
  targetLanguage: 'hi',
  nativeLanguage: 'en',
  instructionalLanguage: 'en',
  targetVariety: 'hi-IN',
  nativeVariety: 'en-US',
  courseTitle:
    '[SYNTHETIC TEST FIXTURE] Hindi for English Speakers — Devanagari Matras & SOV Foundations',
  courseStatus: 'synthetic_test_fixture_do_not_publish',
  sourceProvenance: {
    fixtureType: 'phase2_dev_only_synthetic_hindi_validation_package',
    publishable: false,
  },
  metadata: {
    isSyntheticTestFixture: true,
    proficiencyFramework: 'Custom-SOV-Devanagari-Foundations',
  },
  vocabularyCatalogIds: ['hi_lex_namaste', 'hi_lex_kitab'],
  pronunciationCatalogIds: ['pron_hi_aspirated_stops'],
  modules: [
    {
      moduleId: 'hi_test_m1',
      title: '[TEST] Devanagari Dependent Vowel Signs (मात्राएँ) & SOV Word Order',
      proficiencyLevel: 'Devanagari-1',
      learningObjectives: [
        'Read and combine Devanagari dependent vowel signs (ा, ि, ी, ु, ू, े, ै, ो, औ) with base consonants',
        'Construct basic Hindi Subject–Object–Verb (SOV) sentences with हूँ (hū̃) and है (hai)',
      ],
      vocabularyReferences: ['hi_lex_namaste', 'hi_lex_kitab'],
      pronunciationReferences: ['pron_hi_aspirated_stops'],
      sections: [
        {
          sectionId: 'hi_test_sec_1',
          title: '1. Combining Matras & Nasalization (अनुस्वार / चन्द्रबिन्दु)',
          lessons: [
            {
              lessonId: 'hi_test_les_1',
              title: 'How Matras Modify the Inherent Schwa (अ)',
              summary:
                'Every Devanagari consonant carries an inherent schwa /ə/ (क = ka) unless modified by a vowel matra (का = kā, कि = ki, की = kī) or muted with a halant (क् = k).',
              instructionalText:
                'In Hindi, postpositions follow the noun (घर में = in the house) and the conjugated verb stands at the end of the clause (मैं हिन्दी सीखता हूँ = I Hindi learn am).',
              vocabularyRefs: ['hi_lex_namaste', 'hi_lex_kitab'],
              activities: [
                {
                  activityId: 'hi_test_act_1',
                  activityType: 'lesson_explanation',
                  title: 'Devanagari Matra & Halant Breakdown (हिन्दी = हि + न् + दी)',
                  prompt:
                    'Observe how न् (na + halant ्) joins द + ी to form the conjunct in हिन्दी (Hindī).',
                },
                {
                  activityId: 'hi_test_act_2',
                  activityType: 'knowledge_check_mc',
                  title: 'Quick Check: Hindi SOV Clause Order',
                  prompt:
                    'Which Hindi sentence follows natural Subject–Object–Verb (SOV) order for "I read a book"?',
                  payload: {
                    options: [
                      'मैं किताब पढ़ता हूँ। (Maĩ kitāb paṛhtā hū̃.)',
                      'मैं पढ़ता हूँ किताब।',
                      'किताब हूँ मैं पढ़ता।',
                    ],
                    correctIndex: 0,
                    explanation:
                      'Hindi places the Subject (मैं) first, the Object (किताब) second, and the Verb + Auxiliary (पढ़ता हूँ) at the end.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON = JSON.stringify(
  SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE,
  null,
  2
);

// ============================================================================
// 3. INTERACTIVE UNIVERSAL COURSE PLAYER STATE & HANDLERS
// ============================================================================

interface PlayerTrackViewState {
  selectedModuleIndex: number;
  selectedSectionIndex: number;
  selectedLessonIndex: number;
  answeredActivities: Record<
    string,
    { selectedIndex: number; isCorrect: boolean }
  >;
}

const playerStateByTrack = new Map<string, PlayerTrackViewState>();
let simulatedEntitlementGrants: EntitlementGrant[] = [];
let simulatePaywallEnforcement = false;

export function getSimulatedEntitlementState(): {
  enforcePaywall: boolean;
  grants: EntitlementGrant[];
} {
  return {
    enforcePaywall: simulatePaywallEnforcement,
    grants: [...simulatedEntitlementGrants],
  };
}

export function setSimulatedEntitlementState(
  enforcePaywall: boolean,
  grants: EntitlementGrant[]
): void {
  simulatePaywallEnforcement = enforcePaywall;
  simulatedEntitlementGrants = [...grants];
}

function getOrCreatePlayerState(trackId: string): PlayerTrackViewState {
  if (!playerStateByTrack.has(trackId)) {
    playerStateByTrack.set(trackId, {
      selectedModuleIndex: 0,
      selectedSectionIndex: 0,
      selectedLessonIndex: 0,
      answeredActivities: {},
    });
  }
  return playerStateByTrack.get(trackId)!;
}

export function speakMultilingualText(text: string, bcp47Locale: string): void {
  if (
    typeof window === 'undefined' ||
    typeof window.speechSynthesis === 'undefined'
  ) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = bcp47Locale || 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors in headless environments
  }
}

export function selectUniversalCourseModule(
  trackId: string,
  moduleIndex: number
): void {
  const st = getOrCreatePlayerState(trackId);
  st.selectedModuleIndex = Math.max(0, moduleIndex);
  st.selectedSectionIndex = 0;
  st.selectedLessonIndex = 0;
  if (typeof window !== 'undefined') {
    if (window.syncMultilingualTrackUI) {
      window.syncMultilingualTrackUI();
    }
    if ((window as unknown as { renderLangoContentStudio?: () => void }).renderLangoContentStudio) {
      (window as unknown as { renderLangoContentStudio: () => void }).renderLangoContentStudio();
    }
  }
}

export function selectUniversalCourseLesson(
  trackId: string,
  sectionIndex: number,
  lessonIndex: number
): void {
  const st = getOrCreatePlayerState(trackId);
  st.selectedSectionIndex = Math.max(0, sectionIndex);
  st.selectedLessonIndex = Math.max(0, lessonIndex);
  if (typeof window !== 'undefined') {
    if (window.syncMultilingualTrackUI) {
      window.syncMultilingualTrackUI();
    }
    if ((window as unknown as { renderLangoContentStudio?: () => void }).renderLangoContentStudio) {
      (window as unknown as { renderLangoContentStudio: () => void }).renderLangoContentStudio();
    }
  }
}

export function answerUniversalCourseActivity(
  trackId: string,
  activityId: string,
  selectedIndex: number,
  correctIndex: number
): void {
  const st = getOrCreatePlayerState(trackId);
  const isCorrect = selectedIndex === correctIndex;
  st.answeredActivities[activityId] = { selectedIndex, isCorrect };

  if (trackId !== PUBLISHED_UKRAINIAN_TRACK_ID) {
    const prog = getCourseTrackProgress(trackId);
    const completedAssessments = new Set(prog.completedAssessmentIds);
    completedAssessments.add(activityId);
    saveIsolatedTrackProgress(trackId, {
      xp: prog.xp + (isCorrect ? 15 : 5),
      reviewsCompleted: prog.reviewsCompleted + 1,
      completedAssessmentIds: Array.from(completedAssessments),
    });
  }

  if (typeof window !== 'undefined' && window.syncMultilingualTrackUI) {
    window.syncMultilingualTrackUI();
  }
}

export function markUniversalLessonComplete(
  trackId: string,
  moduleId: string,
  lessonId: string
): void {
  if (trackId === PUBLISHED_UKRAINIAN_TRACK_ID) return;
  const prog = getCourseTrackProgress(trackId);
  const completedLessons = new Set(prog.completedLessonIds);
  const completedModules = new Set(prog.completedModuleIds);
  completedLessons.add(lessonId);
  completedModules.add(moduleId);

  saveIsolatedTrackProgress(trackId, {
    xp: prog.xp + 25,
    completedLessonIds: Array.from(completedLessons),
    completedModuleIds: Array.from(completedModules),
  });

  if (typeof window !== 'undefined' && window.syncMultilingualTrackUI) {
    window.syncMultilingualTrackUI();
  }
}

export function addTrackVocabItemToIsolatedFsrs(
  trackId: string,
  vocabItemId: string
): void {
  if (trackId === PUBLISHED_UKRAINIAN_TRACK_ID) return;
  const prog = getCourseTrackProgress(trackId);
  const nextFsrs: Record<string, TrackFsrsItemState> = { ...prog.fsrsItems };
  if (!nextFsrs[vocabItemId]) {
    nextFsrs[vocabItemId] = {
      vocabularyItemId: vocabItemId,
      state: 'new',
      interval: 0,
      ease: 2.5,
      due: Date.now(),
    };
    saveIsolatedTrackProgress(trackId, {
      xp: prog.xp + 10,
      fsrsItems: nextFsrs,
    });
  }
  if (typeof window !== 'undefined' && window.syncMultilingualTrackUI) {
    window.syncMultilingualTrackUI();
  }
}

export function gradeTrackIsolatedFsrsItem(
  trackId: string,
  vocabItemId: string,
  grade: 1 | 2 | 3 | 4
): void {
  if (trackId === PUBLISHED_UKRAINIAN_TRACK_ID) return;
  const prog = getCourseTrackProgress(trackId);
  const existing = prog.fsrsItems[vocabItemId] || {
    vocabularyItemId: vocabItemId,
    state: 'new',
    interval: 0,
    ease: 2.5,
    due: Date.now(),
  };

  let nextInterval = 1;
  let nextState: 'new' | 'learning' | 'review' = 'review';
  let nextEase = existing.ease;

  if (grade === 1) {
    nextInterval = 0;
    nextState = 'learning';
    nextEase = Math.max(1.3, existing.ease - 0.2);
  } else if (grade === 2) {
    nextInterval = Math.max(1, Math.round((existing.interval || 1) * 1.2));
    nextState = 'review';
    nextEase = Math.max(1.3, existing.ease - 0.15);
  } else if (grade === 3) {
    nextInterval = Math.max(
      1,
      Math.round((existing.interval || 1) * existing.ease)
    );
    nextState = 'review';
  } else {
    nextInterval = Math.max(
      4,
      Math.round((existing.interval || 2) * existing.ease * 1.3)
    );
    nextState = 'review';
    nextEase = existing.ease + 0.15;
  }

  const nextFsrs: Record<string, TrackFsrsItemState> = {
    ...prog.fsrsItems,
    [vocabItemId]: {
      vocabularyItemId: vocabItemId,
      state: nextState,
      interval: nextInterval,
      ease: Number(nextEase.toFixed(2)),
      due: Date.now() + nextInterval * 86400000,
    },
  };

  saveIsolatedTrackProgress(trackId, {
    xp: prog.xp + 10,
    reviewsCompleted: prog.reviewsCompleted + 1,
    fsrsItems: nextFsrs,
  });

  if (typeof window !== 'undefined' && window.syncMultilingualTrackUI) {
    window.syncMultilingualTrackUI();
  }
}

// ============================================================================
// 4. RENDER INTERACTIVE UNIVERSAL COURSE PACKAGE WORKSPACE
// ============================================================================

export function renderUniversalImportedCourseWorkspace(
  track: CourseTrack,
  pkg: UniversalCoursePackageV1
): string {
  ensureCanonicalEnglishOverlaySeeds();
  const state = getOrCreatePlayerState(track.trackId);
  const progress = getCourseTrackProgress(track.trackId);
  const targetLang = getLanguageByCode(track.targetLanguage);
  const instrLang = getLanguageByCode(track.instructionalLanguage);
  const targetHtmlAttrs = getLanguageHtmlAttributes(track.targetLanguage);
  const instrHtmlAttrs = getLanguageHtmlAttributes(track.instructionalLanguage);

  const modules: UniversalModuleV1[] = Array.isArray(pkg.modules)
    ? pkg.modules
    : [];
  const activeModIdx = Math.min(
    state.selectedModuleIndex,
    Math.max(0, modules.length - 1)
  );
  const activeModule: UniversalModuleV1 | undefined = modules[activeModIdx];

  const accessDecision = evaluateCourseTrackModuleAccess(
    track.trackId,
    activeModIdx,
    simulatedEntitlementGrants,
    simulatePaywallEnforcement
  );

  // Module Selector Bar
  const modulePillsHtml = modules
    .map((m, idx) => {
      const isSelected = idx === activeModIdx;
      const isCompleted = progress.completedModuleIds.includes(m.moduleId);
      const modAccess = evaluateCourseTrackModuleAccess(
        track.trackId,
        idx,
        simulatedEntitlementGrants,
        simulatePaywallEnforcement
      );
      return `
        <button
          type="button"
          data-testid="universal-mod-pill-${idx}"
          onclick="selectUniversalCourseModule('${escapeHtml(track.trackId)}', ${idx})"
          class="mod-pill ${isSelected ? 'active' : ''}"
          style="display:flex; flex-direction:column; align-items:flex-start; gap:4px; padding:10px 12px; border-radius:var(--radius-md); border:${isSelected ? '2px solid var(--accent)' : '1px solid var(--border-strong)'}; background:${isSelected ? 'var(--accent-container)' : 'var(--surface-2)'}; color:var(--text); cursor:pointer; text-align:left;"
        >
          <div style="display:flex; justify-content:space-between; width:100%; align-items:center; gap:6px;">
            <span class="tag" style="font-size:10.5px; font-weight:800; background:var(--surface-1); color:var(--accent);">
              ${escapeHtml(m.moduleId)} • ${escapeHtml(m.proficiencyLevel || `Module ${idx + 1}`)}
            </span>
            <span style="font-size:11px; font-weight:800; color:${isCompleted ? 'var(--success)' : modAccess.isUnlocked ? 'var(--text-secondary)' : 'var(--warn)'};">
              ${isCompleted ? '✓ Completed' : modAccess.isUnlocked ? (modAccess.isFreeTierModule ? 'Free Tier' : 'Unlocked') : '🔒 Premium'}
            </span>
          </div>
          <div style="font-size:13.5px; font-weight:800; color:var(--text); line-height:1.3;">
            ${escapeHtml(m.title)}
          </div>
        </button>
      `;
    })
    .join('');

  if (!activeModule) {
    return `<div class="card">No modules found in imported package.</div>`;
  }

  const sections: UniversalSectionV1[] = Array.isArray(activeModule.sections)
    ? activeModule.sections
    : [];
  const activeSecIdx = Math.min(
    state.selectedSectionIndex,
    Math.max(0, sections.length - 1)
  );
  const activeSection: UniversalSectionV1 | undefined = sections[activeSecIdx];
  const lessons: UniversalLessonV1[] = Array.isArray(activeSection?.lessons)
    ? activeSection!.lessons!
    : Array.isArray(activeModule.lessons)
      ? activeModule.lessons!
      : [];
  const activeLesIdx = Math.min(
    state.selectedLessonIndex,
    Math.max(0, lessons.length - 1)
  );
  const activeLesson: UniversalLessonV1 | undefined = lessons[activeLesIdx];

  const activities: UniversalActivityItemV1[] = Array.isArray(
    activeLesson?.activities
  )
    ? activeLesson!.activities!
    : Array.isArray(activeSection?.activities)
      ? activeSection!.activities!
      : Array.isArray(activeModule.activities)
        ? activeModule.activities!
        : [];

  const vocabRefs = Array.from(
    new Set([
      ...(activeModule.vocabularyReferences || []),
      ...(activeLesson?.vocabularyRefs || []),
    ])
  );

  const vocabCardsHtml = vocabRefs
    .map((vRef) => {
      const inFsrs = Boolean(progress.fsrsItems[vRef]);
      if (track.targetLanguage === 'en') {
        const resolved = resolveEnglishVocabCardForTrack(vRef, track.trackId);
        if (resolved.canonical) {
          return `
            <div style="padding:12px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
              <div>
                <div style="font-size:15px; font-weight:800; color:var(--text);">
                  ${escapeHtml(resolved.canonical.headwordEn)}
                  <span style="font-size:12px; color:var(--accent); font-weight:600; margin-left:6px;">${escapeHtml(resolved.canonical.ipaUs)}</span>
                </div>
                <div style="font-size:13px; color:var(--accent); font-weight:700; margin-top:2px;" lang="${escapeHtml(instrHtmlAttrs.lang)}" dir="${escapeHtml(instrHtmlAttrs.dir)}">
                  ${escapeHtml(resolved.overlay?.translationNative || resolved.canonical.coreMeaningEn)}
                </div>
                <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;" lang="${escapeHtml(instrHtmlAttrs.lang)}" dir="${escapeHtml(instrHtmlAttrs.dir)}">
                  ${escapeHtml(resolved.overlay?.explanationNative || '')}
                </div>
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="speakMultilingualText('${escapeHtml(resolved.canonical.headwordEn)}', '${escapeHtml(track.pronunciationConfig.targetBcp47Locale)}')">
                  🔊 Hear English
                </button>
                <button
                  type="button"
                  class="btn ${inFsrs ? 'btn-sec' : 'btn-success'}"
                  style="min-height:32px; padding:4px 10px; font-size:12px;"
                  data-testid="btn-add-track-vocab-${escapeHtml(vRef)}"
                  onclick="addTrackVocabItemToIsolatedFsrs('${escapeHtml(track.trackId)}', '${escapeHtml(vRef)}')"
                >
                  ${inFsrs ? '✓ In Track FSRS' : '+ Add to Track FSRS'}
                </button>
              </div>
            </div>
          `;
        }
      }

      return `
        <div style="padding:10px 12px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div>
            <b style="font-size:13.5px; color:var(--text);">Vocabulary Ref: ${escapeHtml(vRef)}</b>
            <span style="font-size:12px; color:var(--text-secondary); margin-left:6px;">(${escapeHtml(track.vocabularyAssociation.canonicalVocabularyId)})</span>
          </div>
          <button
            type="button"
            class="btn ${inFsrs ? 'btn-sec' : 'btn-success'}"
            style="min-height:32px; padding:4px 10px; font-size:12px;"
            data-testid="btn-add-track-vocab-${escapeHtml(vRef)}"
            onclick="addTrackVocabItemToIsolatedFsrs('${escapeHtml(track.trackId)}', '${escapeHtml(vRef)}')"
          >
            ${inFsrs ? '✓ In Track FSRS' : '+ Add to Track FSRS'}
          </button>
        </div>
      `;
    })
    .join('');

  const activitiesHtml = activities
    .slice(0, 40)
    .map((act) => {
      const isSupported = SUPPORTED_ACTIVITY_TYPES.has(act.activityType);
      const answered = state.answeredActivities[act.activityId];
      const payload = (act.payload || {}) as {
        options?: string[];
        correctIndex?: number;
        explanation?: string;
        rules?: string[];
        examples?: Array<{ uk: string; en: string }>;
        dialogueTitle?: string;
        dialogueLines?: Array<{ speaker: string; uk: string; en: string }>;
        vocabItems?: Array<[string, string, string, string?, string?]>;
        items?: Array<{ promptEn: string; answerUk: string; hint: string }>;
      };

      if (!isSupported) {
        return `
          <div data-testid="unsupported-activity-card-${escapeHtml(act.activityId)}" style="padding:12px 14px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-md); border-left:4px solid var(--warn);">
            <div style="font-size:11.5px; font-weight:800; text-transform:uppercase;">
              ⚠️ Extension Activity Type Preserved (${escapeHtml(act.activityType)})
            </div>
            <div style="font-size:14px; font-weight:800; margin-top:2px;">
              ${escapeHtml(act.title || act.activityId)}
            </div>
            <div style="font-size:12.5px; margin-top:4px;">
              This curriculum activity uses custom type <code>${escapeHtml(act.activityType)}</code>. Its metadata and pronunciation references (${escapeHtml((act.pronunciationRefs || []).join(', ') || 'none')}) are preserved intact by the Universal Course Importer without falsifying renderer support.
            </div>
          </div>
        `;
      }

      if (
        (act.activityType === 'knowledge_check_mc' ||
          act.activityType === 'guided_practice_drill' ||
          act.activityType === 'module_mastery_exam') &&
        Array.isArray(payload.options) &&
        payload.options.length >= 2
      ) {
        const correctIdx =
          typeof payload.correctIndex === 'number' ? payload.correctIndex : 0;
        return `
          <div data-testid="interactive-activity-card-${escapeHtml(act.activityId)}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-strong); border-radius:var(--radius-md);">
            <div style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
              ✓ Interactive Assessment (${escapeHtml(act.activityType)})
            </div>
            <div style="font-size:15px; font-weight:800; color:var(--text); margin:4px 0 8px 0;">
              ${escapeHtml(act.title || 'Knowledge Check')}
            </div>
            ${act.prompt ? `<p style="margin:0 0 10px 0; font-size:13.5px; color:var(--text);">${escapeHtml(act.prompt)}</p>` : ''}
            <div style="display:grid; gap:8px;">
              ${payload.options
                .map((opt, oIdx) => {
                  const isChosen = answered?.selectedIndex === oIdx;
                  const borderCol = isChosen
                    ? answered.isCorrect
                      ? 'var(--success)'
                      : 'var(--danger)'
                    : 'var(--border-subtle)';
                  return `
                    <button
                      type="button"
                      data-testid="activity-mc-opt-${escapeHtml(act.activityId)}-${oIdx}"
                      onclick="answerUniversalCourseActivity('${escapeHtml(track.trackId)}', '${escapeHtml(act.activityId)}', ${oIdx}, ${correctIdx})"
                      style="padding:10px 12px; border-radius:var(--radius-sm); border:2px solid ${borderCol}; background:var(--surface-1); color:var(--text); font-weight:700; font-size:13.5px; text-align:left; cursor:pointer;"
                    >
                      ${escapeHtml(opt)}
                    </button>
                  `;
                })
                .join('')}
            </div>
            ${
              answered
                ? `<div data-testid="activity-feedback-${escapeHtml(act.activityId)}" style="margin-top:10px; padding:10px 12px; border-radius:var(--radius-sm); background:${answered.isCorrect ? 'var(--success-container)' : 'var(--warn-container)'}; color:${answered.isCorrect ? 'var(--success-on-container)' : 'var(--warn-on-container)'}; font-size:12.5px; font-weight:700;">
                    ${answered.isCorrect ? '✅ Correct! (+15 Track XP)' : '💡 Review Explanation (+5 Track XP)'}
                    ${payload.explanation ? `<div style="margin-top:4px; font-weight:500;">${escapeHtml(payload.explanation)}</div>` : ''}
                  </div>`
                : ''
            }
          </div>
        `;
      }

      if (
        act.activityType === 'lesson_explanation' &&
        Array.isArray(payload.rules) &&
        payload.rules.length > 0
      ) {
        return `
          <div data-testid="interactive-activity-card-${escapeHtml(act.activityId)}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
            <div style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
              📘 Grammar &amp; Core Rules (${payload.rules.length} Rules)
            </div>
            <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:4px 0 8px 0;">
              ${escapeHtml(act.title || act.activityId)}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text); line-height:1.55;">
              ${payload.rules
                .map(
                  (r) =>
                    `<div style="padding:8px 10px; background:var(--surface-1); border-radius:var(--radius-xs);">${r}</div>`
                )
                .join('')}
            </div>
            ${
              Array.isArray(payload.examples) && payload.examples.length > 0
                ? `<div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--border-subtle);">
                    <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">Key Examples:</div>
                    ${payload.examples
                      .map(
                        (ex) =>
                          `<div style="font-size:12.5px; margin-bottom:4px;"><b>${escapeHtml(ex.uk)}</b> — <span style="color:var(--text-secondary);">${escapeHtml(ex.en)}</span></div>`
                      )
                      .join('')}
                  </div>`
                : ''
            }
          </div>
        `;
      }

      if (
        act.activityType === 'contextual_dialogue' &&
        Array.isArray(payload.dialogueLines) &&
        payload.dialogueLines.length > 0
      ) {
        return `
          <div data-testid="interactive-activity-card-${escapeHtml(act.activityId)}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
            <div style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
              💬 Contextual Dialogue
            </div>
            <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:4px 0 8px 0;">
              ${escapeHtml(act.title || payload.dialogueTitle || 'Dialogue')}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${payload.dialogueLines
                .map(
                  (line) => `
                  <div style="padding:8px 10px; background:var(--surface-1); border-radius:var(--radius-xs); font-size:13px;">
                    <b>${escapeHtml(line.speaker)}:</b> <span style="color:var(--accent); font-weight:700;">${escapeHtml(line.uk)}</span>
                    <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(line.en)}</div>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      if (
        act.activityType === 'vocabulary_introduction' &&
        Array.isArray(payload.vocabItems) &&
        payload.vocabItems.length > 0
      ) {
        return `
          <div data-testid="interactive-activity-card-${escapeHtml(act.activityId)}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
            <div style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
              🔤 Module Vocabulary (${payload.vocabItems.length} Words)
            </div>
            <div style="font-size:14.5px; font-weight:800; color:var(--text); margin:4px 0 8px 0;">
              ${escapeHtml(act.title || 'Vocabulary Introduction')}
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:8px; max-height:360px; overflow-y:auto;">
              ${payload.vocabItems
                .map(
                  (tuple) => `
                  <div style="padding:8px 10px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); font-size:12.5px;">
                    <div><b style="color:var(--accent); font-size:13.5px;">${escapeHtml(tuple[0])}</b> <span style="color:var(--text-secondary); font-size:11px;">(${escapeHtml(tuple[2] || '')})</span></div>
                    <div style="font-weight:700; color:var(--text); margin-top:2px;">${escapeHtml(tuple[1])}</div>
                    ${tuple[3] ? `<div style="font-size:11.5px; color:var(--text-secondary); margin-top:3px;">${escapeHtml(tuple[3])}</div>` : ''}
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      return `
        <div data-testid="interactive-activity-card-${escapeHtml(act.activityId)}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
              📘 ${escapeHtml(act.activityType.replace(/_/g, ' '))}
            </span>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:30px; padding:4px 10px; font-size:11.5px;"
              onclick="answerUniversalCourseActivity('${escapeHtml(track.trackId)}', '${escapeHtml(act.activityId)}', 0, 0)"
            >
              ${answered ? '✓ Completed (+15 XP)' : 'Mark Activity Studied'}
            </button>
          </div>
          <div style="font-size:14.5px; font-weight:800; color:var(--text); margin-top:4px;">
            ${escapeHtml(act.title || act.activityId)}
          </div>
          ${act.prompt ? `<p style="margin:6px 0 0 0; font-size:13.5px; color:var(--text-secondary); line-height:1.5;">${escapeHtml(act.prompt)}</p>` : ''}
        </div>
      `;
    })
    .join('');

  const sectionLessonNavHtml =
    sections.length > 1 || lessons.length > 1
      ? `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
          ${sections
            .map((sec, sIdx) =>
              (sec.lessons || []).map((les, lIdx) => {
                const isActive = sIdx === activeSecIdx && lIdx === activeLesIdx;
                return `
                  <button
                    type="button"
                    data-testid="universal-section-pill-${sIdx}-${lIdx}"
                    class="stage-pill ${isActive ? 'active' : ''}"
                    style="min-height:32px; padding:4px 10px; font-size:12px;"
                    onclick="selectUniversalCourseLesson('${escapeHtml(track.trackId)}', ${sIdx}, ${lIdx})"
                  >
                    ${escapeHtml(sec.title || les.title)}
                  </button>
                `;
              }).join('')
            )
            .join('')}
        </div>`
      : '';

  const isLessonCompleted =
    activeLesson && progress.completedLessonIds.includes(activeLesson.lessonId);

  return `
    <div class="card" data-testid="dev-pilot-imported-workspace" style="border:2px solid var(--warn); background:var(--surface-1); padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
        <div>
          <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
            🧪 DEVELOPER PILOT CURRICULUM PLAYER (${escapeHtml(pkg.courseStatus || 'pilot')})
          </span>
          <h2 style="margin:8px 0 4px 0; font-size:20px; font-weight:800; color:var(--text);">
            ${escapeHtml(pkg.courseTitle || track.courseTitle)}
          </h2>
          <div style="font-size:12.5px; color:var(--text-secondary);">
            Track: <b>${escapeHtml(track.trackId)}</b> •
            Target: <b>${escapeHtml(targetLang?.nameEn || track.targetLanguage)} (${escapeHtml(track.targetVariety)})</b> •
            Instructional: <b>${escapeHtml(instrLang?.nameEn || track.instructionalLanguage)} (${escapeHtml(track.instructionalLanguage)})</b> •
            Isolated Track XP: <b data-testid="pilot-track-xp">${progress.xp} XP</b> •
            Track FSRS Cards: <b data-testid="pilot-track-fsrs-count">${Object.keys(progress.fsrsItems).length}</b>
          </div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-warn" style="min-height:36px; padding:6px 12px; font-size:12px;" data-testid="btn-reset-dev-pilot-track" onclick="resetDevPilotCourseTrack('${escapeHtml(track.trackId)}')">
            🔄 Reset Track to Empty "Coming Soon"
          </button>
          <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">
            🇺🇦 Back to Ukrainian
          </button>
        </div>
      </div>

      <!-- Module Selector Pills -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px; margin-bottom:16px;">
        ${modulePillsHtml}
      </div>

      ${
        !accessDecision.isUnlocked
          ? `<div style="padding:18px; background:var(--surface-2); border:2px solid var(--warn); border-radius:var(--radius-md);">
              <h3 style="margin:0 0 6px 0; font-size:17px;">🔒 Premium Module Access Required (Entitlement Simulation Active)</h3>
              <p style="margin:0; font-size:13.5px; color:var(--text-secondary);">
                Module ${activeModIdx + 1} is beyond the ${track.entitlementConfig.freePublishedModuleLimit} free published modules for <b>${escapeHtml(track.trackId)}</b>. Grant a track-level (<code>${escapeHtml(track.entitlementConfig.trackScopeKey)}</code>) or target-language-level (<code>${escapeHtml(track.entitlementConfig.targetLanguageScopeKey)}</code>) entitlement in the Developer Importer &amp; Entitlement Simulator to unlock.
              </p>
            </div>`
          : `
            <!-- Active Module & Lesson Player -->
            <div style="background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                <div>
                  <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
                    ${escapeHtml(activeModule.proficiencyLevel || `Module ${activeModIdx + 1}`)} • ${escapeHtml(activeModule.moduleId)}
                  </span>
                  <h3
                    lang="${escapeHtml(targetHtmlAttrs.lang)}"
                    dir="${escapeHtml(targetHtmlAttrs.dir)}"
                    style="margin:6px 0 4px 0; font-size:18px; font-weight:800; color:var(--text);"
                  >
                    ${escapeHtml(activeModule.title)}
                  </h3>
                </div>
                ${
                  activeLesson
                    ? `<button
                        type="button"
                        class="btn ${isLessonCompleted ? 'btn-sec' : 'btn-success'}"
                        style="min-height:36px; padding:6px 14px; font-size:12.5px;"
                        data-testid="btn-complete-universal-lesson"
                        onclick="markUniversalLessonComplete('${escapeHtml(track.trackId)}', '${escapeHtml(activeModule.moduleId)}', '${escapeHtml(activeLesson.lessonId)}')"
                      >
                        ${isLessonCompleted ? '✓ Lesson Completed' : '✅ Complete Lesson (+25 XP)'}
                      </button>`
                    : ''
                }
              </div>

              ${
                Array.isArray(activeModule.learningObjectives) &&
                activeModule.learningObjectives.length > 0
                  ? `<div style="margin-bottom:12px; padding:10px 12px; background:var(--surface-1); border-radius:var(--radius-sm);">
                      <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px;">Learning Objectives</div>
                      <ul style="margin:0 0 0 18px; padding:0; font-size:13px; color:var(--text);">
                        ${activeModule.learningObjectives.map((obj) => `<li>${escapeHtml(obj)}</li>`).join('')}
                      </ul>
                    </div>`
                  : ''
              }

              ${sectionLessonNavHtml}

              ${
                activeLesson
                  ? `<div
                      lang="${escapeHtml(instrHtmlAttrs.lang)}"
                      dir="${escapeHtml(instrHtmlAttrs.dir)}"
                      style="margin-bottom:14px; padding:12px 14px; background:var(--surface-1); border-left:4px solid var(--accent); border-radius:var(--radius-sm);"
                    >
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:15px; color:var(--text);">${escapeHtml(activeLesson.title)}</strong>
                        <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="speakMultilingualText('${escapeHtml(activeLesson.summary || activeLesson.title)}', '${escapeHtml(track.pronunciationConfig.instructionalBcp47Locale)}')">
                          🔊 Listen (${escapeHtml(track.instructionalLanguage.toUpperCase())})
                        </button>
                      </div>
                      ${activeLesson.summary ? `<p style="margin:6px 0 0 0; font-size:13.5px; color:var(--text); line-height:1.55;">${escapeHtml(activeLesson.summary)}</p>` : ''}
                      ${activeLesson.instructionalText ? `<p style="margin:6px 0 0 0; font-size:13px; color:var(--text-secondary); line-height:1.55;">${escapeHtml(activeLesson.instructionalText)}</p>` : ''}
                    </div>`
                  : ''
              }

              ${
                vocabCardsHtml
                  ? `<div style="margin-bottom:14px;">
                      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; margin-bottom:6px;">
                        Track Vocabulary &amp; Native-Language Overlay Cards
                      </div>
                      <div style="display:grid; gap:8px;">
                        ${vocabCardsHtml}
                      </div>
                    </div>`
                  : ''
              }

              ${
                activitiesHtml
                  ? `<div>
                      <div style="font-size:12px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; margin-bottom:6px;">
                        Lesson Activities (${activities.length})
                      </div>
                      <div style="display:grid; gap:10px;">
                        ${activitiesHtml}
                      </div>
                    </div>`
                  : ''
              }
            </div>
          `
      }
    </div>
  `;
}

// ============================================================================
// 5. TRACK-AWARE MULTI-TAB WORKSPACE RENDERER FOR NON-UKRAINIAN TRACKS
// ============================================================================

const SECONDARY_TAB_IDS = [
  'srs',
  'en2uk',
  'vocab',
  'identify',
  'correction',
  'phonetics',
  'reader',
] as const;

export function syncAllTabsForActiveTrack(track: CourseTrack): void {
  ensureCanonicalEnglishOverlaySeeds();
  const isUkrainian = track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID;
  const targetLang = getLanguageByCode(track.targetLanguage);
  const nativeLang = getLanguageByCode(track.nativeLanguage);

  // 1. Update Top Header Brand Badge & Subtitle non-destructively
  const brandBadgeEl = document.querySelector('.brand-badge');
  const brandSubtitleEl = document.querySelector('.brand-subtitle');
  if (brandBadgeEl) {
    brandBadgeEl.textContent = isUkrainian
      ? 'UA'
      : track.learningDirection === 'foreign_to_en'
        ? `${track.nativeLanguage.toUpperCase()}→EN`
        : track.targetLanguage.toUpperCase();
  }
  if (brandSubtitleEl) {
    brandSubtitleEl.textContent = isUkrainian
      ? 'Ukrainian FSRS & Grammar'
      : `${track.courseTitle} (${track.trackId})`;
  }

  // 2. Update Navigation Direction Labels for EN->Target / Target->EN
  const en2ukNavLabel = document.querySelector(
    '.nav-btn[onclick*="switchTab(\'en2uk\'"] span:last-child'
  );
  const srsNavLabel = document.querySelector(
    '.nav-btn[onclick*="switchTab(\'srs\'"] span:last-child'
  );
  if (en2ukNavLabel && srsNavLabel) {
    if (isUkrainian) {
      en2ukNavLabel.textContent = 'EN→UK';
      srsNavLabel.textContent = 'UK→EN';
    } else {
      en2ukNavLabel.textContent = `${track.nativeLanguage.toUpperCase()}→${track.targetLanguage.toUpperCase()}`;
      srsNavLabel.textContent = `${track.targetLanguage.toUpperCase()}→${track.nativeLanguage.toUpperCase()}`;
    }
  }

  // 3. Sync Top & Sidebar Stats for Non-Ukrainian Tracks (or restore Ukrainian stats)
  if (!isUkrainian) {
    const prog = getCourseTrackProgress(track.trackId);
    const fsrsCount = Object.keys(prog.fsrsItems).length;
    const xpEl = document.getElementById('xp-display');
    const deckEl = document.getElementById('deck-count');
    const drillsEl = document.getElementById('drills-display');
    const modsEl = document.getElementById('mods-display');
    const xpTop = document.getElementById('xp-top-display');
    const deckTop = document.getElementById('deck-top-count');

    if (xpEl) xpEl.innerText = String(prog.xp);
    if (deckEl) deckEl.innerText = String(fsrsCount);
    if (drillsEl) drillsEl.innerText = String(prog.reviewsCompleted);
    if (modsEl) modsEl.innerText = String(prog.completedModuleIds.length);
    if (xpTop) xpTop.innerText = String(prog.xp);
    if (deckTop) deckTop.innerText = String(fsrsCount);
  }

  // 4. Toggle secondary tabs between original Ukrainian DOM and Track-Aware Non-Ukrainian Workspace
  for (const tabId of SECONDARY_TAB_IDS) {
    const sectionEl = document.getElementById(`tab-${tabId}`);
    if (!sectionEl) continue;

    let overlayEl = document.getElementById(
      `lango-track-tab-workspace-${tabId}`
    );
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.id = `lango-track-tab-workspace-${tabId}`;
      sectionEl.prepend(overlayEl);
    }

    const directChildren = Array.from(sectionEl.children).filter(
      (ch) => ch.id !== `lango-track-tab-workspace-${tabId}`
    );

    if (isUkrainian) {
      overlayEl.classList.add('hidden');
      overlayEl.innerHTML = '';
      for (const ch of directChildren) {
        ch.classList.remove('hidden');
      }
    } else {
      for (const ch of directChildren) {
        ch.classList.add('hidden');
      }
      overlayEl.classList.remove('hidden');
      overlayEl.innerHTML = renderSecondaryTabForNonUkrainianTrack(
        tabId,
        track,
        targetLang?.nameEn || track.targetLanguage,
        nativeLang?.nameEn || track.nativeLanguage
      );
    }
  }
}

function renderSecondaryTabForNonUkrainianTrack(
  tabId: (typeof SECONDARY_TAB_IDS)[number],
  track: CourseTrack,
  targetNameEn: string,
  nativeNameEn: string
): string {
  const prog = getCourseTrackProgress(track.trackId);
  const fsrsEntries = Object.values(prog.fsrsItems);
  const scriptLang =
    track.learningDirection === 'foreign_to_en'
      ? getLanguageByCode(track.nativeLanguage)
      : getLanguageByCode(track.targetLanguage);
  const htmlAttrs = getLanguageHtmlAttributes(
    scriptLang?.code || track.targetLanguage
  );

  // If this is the SRS or Recall or Vocab tab, show the Track-Isolated FSRS Queue & Canonical Overlay Inspector
  if (tabId === 'srs' || tabId === 'en2uk' || tabId === 'vocab') {
    const canonicalSample =
      track.targetLanguage === 'en'
        ? resolveEnglishVocabCardForTrack('en_lex_0001', track.trackId)
        : null;
    const activeFsrsCard = fsrsEntries[0];

    return `
      <div class="card" data-testid="track-secondary-tab-${escapeHtml(tabId)}" style="padding:20px; border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
          <div>
            <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
              🗂️ Track-Isolated Vocabulary &amp; FSRS Deck • ${escapeHtml(track.trackId)}
            </span>
            <h2 style="margin:6px 0 2px 0; font-size:20px; font-weight:800; color:var(--text);">
              ${escapeHtml(track.courseTitle)} — ${
                tabId === 'srs'
                  ? `${escapeHtml(targetNameEn)} → ${escapeHtml(nativeNameEn)} Recognition`
                  : tabId === 'en2uk'
                    ? `${escapeHtml(nativeNameEn)} → ${escapeHtml(targetNameEn)} Active Recall`
                    : 'Vocabulary & Canonical Lexicon Registry'
              }
            </h2>
            <p style="margin:0; font-size:13px; color:var(--text-secondary);">
              Progress Namespace: <code>${escapeHtml(track.progressNamespace)}</code> •
              Canonical Registry: <code>${escapeHtml(track.vocabularyAssociation.canonicalVocabularyId)}</code>
              ${track.vocabularyAssociation.presentationOverlayId ? ` • L1 Overlay: <code>${escapeHtml(track.vocabularyAssociation.presentationOverlayId)}</code>` : ''}
            </p>
          </div>
          <button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12px;" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">
            🇺🇦 Switch to Ukrainian (6,000-Word Lexicon)
          </button>
        </div>

        ${
          activeFsrsCard
            ? `<div data-testid="track-isolated-fsrs-stage" style="padding:16px; background:var(--surface-2); border:2px solid var(--accent); border-radius:var(--radius-md); margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="tag" style="background:var(--accent); color:var(--accent-on); font-weight:800;">
                    Active FSRS Card (${escapeHtml(activeFsrsCard.state.toUpperCase())} • Interval: ${activeFsrsCard.interval}d • Ease: ${activeFsrsCard.ease})
                  </span>
                  <span style="font-size:12px; font-weight:700; color:var(--text-secondary);">
                    Cards in ${escapeHtml(track.trackId)}: ${fsrsEntries.length}
                  </span>
                </div>
                <div style="font-size:20px; font-weight:800; color:var(--text); margin-bottom:8px;">
                  ${escapeHtml(activeFsrsCard.vocabularyItemId)}
                </div>
                <div class="anki-grade-bar" style="margin-top:12px;">
                  <button type="button" class="anki-btn anki-again" data-testid="btn-grade-track-fsrs-1" onclick="gradeTrackIsolatedFsrsItem('${escapeHtml(track.trackId)}', '${escapeHtml(activeFsrsCard.vocabularyItemId)}', 1)"><small>&lt; 1m</small>Again</button>
                  <button type="button" class="anki-btn anki-hard" data-testid="btn-grade-track-fsrs-2" onclick="gradeTrackIsolatedFsrsItem('${escapeHtml(track.trackId)}', '${escapeHtml(activeFsrsCard.vocabularyItemId)}', 2)"><small>1d</small>Hard</button>
                  <button type="button" class="anki-btn anki-good" data-testid="btn-grade-track-fsrs-3" onclick="gradeTrackIsolatedFsrsItem('${escapeHtml(track.trackId)}', '${escapeHtml(activeFsrsCard.vocabularyItemId)}', 3)"><small>3d</small>Good</button>
                  <button type="button" class="anki-btn anki-easy" data-testid="btn-grade-track-fsrs-4" onclick="gradeTrackIsolatedFsrsItem('${escapeHtml(track.trackId)}', '${escapeHtml(activeFsrsCard.vocabularyItemId)}', 4)"><small>5d</small>Easy</button>
                </div>
              </div>`
            : `<div style="padding:14px; background:var(--surface-2); border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:14px; font-size:13.5px; color:var(--text-secondary);">
                <b>Course Coming Soon — 0 Published Vocabulary Items:</b> The verified 6,000-word lexicon for <b>${escapeHtml(track.courseTitle)}</b> has not been generated yet. No fabricated frequency lists are shown.
              </div>`
        }

        ${
          canonicalSample?.canonical && canonicalSample.overlay
            ? `<div data-testid="canonical-english-overlay-preview" style="padding:14px; background:var(--surface-2); border-left:4px solid var(--accent); border-radius:var(--radius-md);">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                  <span style="font-size:11.5px; font-weight:800; color:var(--accent); text-transform:uppercase;">
                    Shared Canonical English Lexeme + Native-Language Overlay (${escapeHtml(track.nativeLanguage.toUpperCase())} → EN)
                  </span>
                  <button
                    type="button"
                    class="btn btn-success"
                    style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                    data-testid="btn-add-canonical-seed-fsrs"
                    onclick="addTrackVocabItemToIsolatedFsrs('${escapeHtml(track.trackId)}', 'en_lex_0001')"
                  >
                    + Add Sample Lexeme to ${escapeHtml(track.trackId)} FSRS
                  </button>
                </div>
                <div style="font-size:16px; font-weight:800; color:var(--text);">
                  Canonical English: "${escapeHtml(canonicalSample.canonical.headwordEn)}" <span style="font-size:12.5px; color:var(--accent);">${escapeHtml(canonicalSample.canonical.ipaUs)}</span>
                </div>
                <div
                  lang="${escapeHtml(htmlAttrs.lang)}"
                  dir="${escapeHtml(htmlAttrs.dir)}"
                  style="font-size:14.5px; font-weight:700; color:var(--accent); margin-top:4px; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
                >
                  ${escapeHtml(nativeNameEn)} Overlay Translation: ${escapeHtml(canonicalSample.overlay.translationNative)}
                </div>
                <div
                  lang="${escapeHtml(htmlAttrs.lang)}"
                  dir="${escapeHtml(htmlAttrs.dir)}"
                  style="font-size:13px; color:var(--text); margin-top:4px; line-height:1.5; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
                >
                  <b>L1 Contrastive Note:</b> ${escapeHtml(canonicalSample.overlay.explanationNative)}
                </div>
                <div
                  lang="${escapeHtml(htmlAttrs.lang)}"
                  dir="${escapeHtml(htmlAttrs.dir)}"
                  style="font-size:12.5px; color:var(--text-secondary); margin-top:4px; font-family:${escapeHtml(htmlAttrs.styleFontFamily)};"
                >
                  <b>Pronunciation Coaching:</b> ${escapeHtml(canonicalSample.overlay.pronunciationTipForNativeSpeaker)}
                </div>
              </div>`
            : ''
        }
      </div>
    `;
  }

  // Phonetics, Reader, Identify, Sentence tabs for non-Ukrainian tracks
  const hindiCheck =
    track.targetLanguage === 'hi' || track.nativeLanguage === 'hi'
      ? inspectHindiScriptMetadata(track.nativeContextTitle)
      : null;

  return `
    <div class="card" data-testid="track-secondary-tab-${escapeHtml(tabId)}" style="padding:20px; border:1px solid var(--border-strong);">
      <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
        ⏳ ${escapeHtml(track.courseTitle)} • ${escapeHtml(tabId.toUpperCase())} Coming Soon
      </span>
      <h2 style="margin:8px 0 4px 0; font-size:20px; font-weight:800; color:var(--text);">
        ${escapeHtml(track.comingSoonTitle)}
      </h2>
      <p style="margin:0 0 12px 0; font-size:14px; color:var(--text-secondary); line-height:1.55;">
        ${escapeHtml(track.comingSoonMessage)}
      </p>
      <div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-sm); font-size:13px; color:var(--text-secondary); margin-bottom:14px;">
        <div><b>Active Course Track:</b> ${escapeHtml(track.trackId)} (${escapeHtml(nativeNameEn)} → ${escapeHtml(targetNameEn)})</div>
        <div><b>Target Locale &amp; Script:</b> ${escapeHtml(track.pronunciationConfig.targetBcp47Locale)} • ${escapeHtml(track.pronunciationConfig.scriptCode)} (dir="${escapeHtml(track.pronunciationConfig.textDirection)}")</div>
        ${hindiCheck ? `<div><b>Devanagari Combining Signs Verified:</b> ${hindiCheck.dependentVowelSignsMatras.length} matras preserved in NFC</div>` : ''}
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" class="btn" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">
          🇺🇦 Return to Published Ukrainian Track
        </button>
        <button type="button" class="btn btn-sec" onclick="openLanguageSelectorModal()">
          🌐 Change Course Track
        </button>
      </div>
    </div>
  `;
}
