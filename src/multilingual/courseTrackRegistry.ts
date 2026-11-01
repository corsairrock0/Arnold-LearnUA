// ============================================================================
// LANGO PHASE 1 — CENTRAL COURSE-TRACK ARCHITECTURE & 28-TRACK REGISTRY
// ============================================================================

import { COURSE_MODULES, type CourseModule } from '../courseData.ts';
import {
  getForeignLanguages,
  getLanguageByCode,
  type LanguageDefinition,
} from './languageRegistry.ts';

export type LearningDirection = 'en_to_foreign' | 'foreign_to_en';

export type CourseTrackAvailability =
  | 'published'
  | 'coming_soon'
  | 'dev_pilot_imported';

export type EntitlementScope =
  | 'target_language'
  | 'course_track'
  | 'course_collection'
  | 'premium_vocabulary';

export interface CourseTrackVocabularyAssociation {
  canonicalVocabularyId: string;
  targetLexiconSize: number;
  usesSharedCanonicalLexemeIdentity: boolean;
  presentationOverlayId?: string;
  supportsL1SpecificTranslations: boolean;
  supportsL1SpecificExplanations: boolean;
  supportsL1SpecificTeachingSequence: boolean;
}

export interface CourseTrackEntitlementConfig {
  freePublishedModuleLimit: number;
  supportedScopes: EntitlementScope[];
  trackScopeKey: string;
  targetLanguageScopeKey: string;
  collectionScopeKey: string;
  vocabularyScopeKey: string;
}

export interface CourseTrackPronunciationConfig {
  targetBcp47Locale: string;
  instructionalBcp47Locale: string;
  scriptCode: string;
  textDirection: 'ltr' | 'rtl';
  supportsTransliteration: boolean;
  phoneticNotation: string;
}

export interface CourseTrackAutonomyMetadata {
  isUkrainianCourseTemplateImposed: false;
  allowsCustomModuleCount: true;
  allowsCustomProficiencyScale: true;
  allowsCustomLessonAndSectionTypes: true;
  allowsCustomAssessmentDesign: true;
  l1ContrastiveConsiderations: string[];
}

export interface CourseTrack {
  trackId: string; // e.g., 'track:en-to-uk', 'track:es-to-en', 'track:hi-to-en'
  courseId: string; // e.g., 'course:uk:from-en:v1', 'course:en:for-es:v1'
  learningDirection: LearningDirection;
  targetLanguage: string; // 'uk', 'es', ..., 'hi', or 'en'
  nativeLanguage: string; // 'en' for Direction A; 'es', 'fr', ..., 'hi' for Direction B
  instructionalLanguage: string; // 'en' for Direction A; nativeLanguage by default for Direction B
  targetVariety: string; // e.g., 'uk-UA', 'hi-IN', 'en-US'
  nativeVariety: string; // e.g., 'en-US', 'es-419', 'hi-IN'
  courseTitle: string;
  courseSubtitle: string;
  nativeContextTitle: string;
  availability: CourseTrackAvailability;
  curriculumVersion: string;
  moduleRegistryRef: string;
  courseContentRef: string;
  modules: CourseModule[];
  importedPackageData?: unknown;
  vocabularyAssociation: CourseTrackVocabularyAssociation;
  assessmentAssociationRef: string;
  pronunciationConfig: CourseTrackPronunciationConfig;
  progressNamespace: string;
  assessmentProgressNamespace: string;
  entitlementConfig: CourseTrackEntitlementConfig;
  comingSoonTitle: string;
  comingSoonMessage: string;
  autonomyMetadata: CourseTrackAutonomyMetadata;
  extensibleMetadata: Record<string, unknown>;
}

const NATIVE_ENGLISH_TRACK_TITLES_NATIVE: Record<string, string> = {
  es: 'Inglés para hablantes de español — Próximamente',
  fr: 'Anglais pour francophones — Bientôt disponible',
  it: 'Inglese per italofoni — Prossimamente',
  pt: 'Inglês para falantes de português — Em breve',
  ru: 'Английский язык для русскоязычных — Скоро',
  uk: 'Англі́йська мо́ва для україномо́вних — Незаба́ром',
  pl: 'Język angielski dla Polaków — Wkrótce',
  de: 'Englisch für Deutschsprachige — Demnächst verfügbar',
  zh: '面向中文母语者的英语课程 — 即将推出',
  vi: 'Tiếng Anh dành cho người Việt — Sắp ra mắt',
  ko: '한국어 원어민을 위한 영어 과정 — 출시 예정',
  ja: '日本語話者のための英語コース — 近日公開',
  ar: 'اللغة الإنجليزية للناطقين بالعربية — قريباً',
  hi: 'हिन्दी भाषियों के लिए अंग्रेज़ी पाठ्यक्रम — शीघ्र आ रहा है',
};

const FOREIGN_COURSE_NATIVE_SUBTITLES: Record<string, string> = {
  es: 'Curso de Español (A0–C1)',
  fr: 'Cours de Français (A0–C1)',
  it: 'Corso di Italiano (A0–C1)',
  pt: 'Curso de Português (A0–C1)',
  ru: 'Курс русского языка',
  uk: 'По́вний курс украї́нської мо́ви (A0 → C1 • 29 мо́дулів)',
  pl: 'Kurs języka polskiego',
  de: 'Deutschkurs',
  zh: '中文综合课程',
  vi: 'Khóa học Tiếng Việt',
  ko: '한국어 종합 과정',
  ja: '日本語総合コース',
  ar: 'دورة اللغة العربية الشاملة',
  hi: 'हिन्दी भाषा पाठ्यक्रम (देवनागरी लिपि और व्याकरण)',
};

const L1_TO_ENGLISH_CONTRASTIVE_NOTES: Record<string, string[]> = {
  es: [
    'Contrast English explicit subject pronouns with Spanish pro-drop patterns',
    'Address initial /s/ + consonant clusters (e.g., school/speak without prosthetic /e/) and short vs tense vowel contrasts (/ɪ/ vs /iː/)',
    'Clarify false friends (actual/currently, asistir/attend, realizar/carry out) and phrasal verbs vs single Latinate verbs',
  ],
  fr: [
    'Contrast English lexical word stress and vowel reduction to schwa [ə] with French phrase-final rhythm',
    'Develop English /h/ aspiration and dental fricatives /θ, ð/',
    'Contrast English present perfect vs simple past with French passé composé',
  ],
  it: [
    'Contrast English consonant-final closed syllables without paragogic vowel release',
    'Develop English dental fricatives /θ, ð/ and vowel length/quality contrasts',
    'Contrast English definite/zero article usage with Italian generalized definite articles',
  ],
  pt: [
    'Contrast English syllable-final /l/, /m/, /n/, andunaspirated/aspirated stops with Portuguese vocalization and nasalization',
    'Address English prepositions (in/on/at) vs Portuguese em',
    'Develop English auxiliary do-support in questions and negation',
  ],
  ru: [
    'Build the English article system (a/an/the/zero) from a zero-article Slavic L1 baseline',
    'Contrast English fixed SVO word order and mandatory copula (am/is/are) with Russian flexible order and present zero-copula',
    'Develop English /w/ vs /v/, /θ, ð/, and progressive/perfect aspect matrix vs binary Slavic aspect',
  ],
  uk: [
    'Build English article mastery (a/an/the/zero) and mandatory present-tense copula from a Ukrainian L1 baseline',
    'Leverage Ukrainian bilabial в [w] while contrasting labiodental [v] and interdental [θ, ð]',
    'Contrast English tense-aspect combinations (Present Perfect vs Past Simple) with Ukrainian доконаний/недоконаний вид',
  ],
  pl: [
    'Build the English article system and tense-aspect matrix from a Polish L1 baseline',
    'Prevent final obstruent devoicing in English words (e.g., bag vs back, bed vs bet)',
    'Contrast English prepositional relationships and phrasal verbs with Polish case-governed constructions',
  ],
  de: [
    'Contrast English SVO subordinate clause order with German verb-final (SOV) subordinate clauses',
    'Prevent word-final obstruent devoicing and develop English /w/ vs /v/ and /θ, ð/',
    'Contrast English progressive aspect and present perfect (since/for) with German Präsens and Perfekt',
  ],
  zh: [
    'Develop English inflectional morphology (tense/agreement -s/-ed, plural -s) and case-marked pronouns (he/him/his) from an analytic L1',
    'Contrast English stress-timed rhythm and consonant clusters with Mandarin syllable-timed tonal phonology',
    'Build English article selection and relative clause post-modification vs Chinese pre-nominal modifiers',
  ],
  vi: [
    'Develop English word-final consonant clusters and multi-syllable word stress from a monosyllabic tonal L1',
    'Build English tense/aspect inflection (-ed, -s, auxiliary chains) and copula usage',
    'Contrast English pre-nominal adjective placement with Vietnamese post-nominal modifiers',
  ],
  ko: [
    'Transition from Korean SOV postpositional head-final syntax to English SVO prepositional head-initial syntax',
    'Develop English /f/ vs /p/, /v/ vs /b/, /l/ vs /r/, and consonant clusters without epenthetic vowels',
    'Build English article usage and relative clause construction from a particle-based L1',
  ],
  ja: [
    'Transition from Japanese SOV postpositional structure and topic-prominent framing to English SVO subject-prominent syntax',
    'Contrast English stress-timed rhythm, /l/ vs /r/, /θ, ð/, and closed syllables with Japanese mora-timed CV phonotactics',
    'Build English countable/uncountable noun distinction, plurals, and articles',
  ],
  ar: [
    'Transition from Right-to-Left (RTL) Arabic script and VSO/nominal clause patterns to Left-to-Right (LTR) English SVO clauses',
    'Develop English /p/ vs /b/, /v/ vs /f/, vowel inventory (12+ English vowels vs 3 Arabic vowel qualities), and initial consonant clusters',
    'Contrast English indefinite/definite article system and explicit present-tense copula with Arabic al- and resumptive pronouns in relative clauses',
  ],
  hi: [
    'Transition from Hindi SOV postpositional syntax (में, पर, से) to English SVO prepositional syntax',
    'Contrast English stress-timed rhythm, alveolar /t, d/ (vs Hindi dental त/द and retroflex ट/ड), and /w/ vs /v/ (vs Hindi labiodental approximant व [ʋ])',
    'Guide appropriate use of English Simple Present vs Present Continuous (avoiding overextension of -ing stative forms transferred from Hindi रहा है)',
  ],
};

function createForeignLanguageTrack(lang: LanguageDefinition): CourseTrack {
  const isUkrainian = lang.code === 'uk';
  const trackId = `track:en-to-${lang.code}`;
  const courseId = `course:${lang.code}:from-en:v1`;

  return {
    trackId,
    courseId,
    learningDirection: 'en_to_foreign',
    targetLanguage: lang.code,
    nativeLanguage: 'en',
    instructionalLanguage: 'en',
    targetVariety: lang.pronunciationMetadata.defaultVariety,
    nativeVariety: 'en-US',
    courseTitle: `Learn ${lang.nameEn}`,
    courseSubtitle: isUkrainian
      ? 'Step-by-Step Ukrainian Course (A0 → C1 • 29 Modules)'
      : `${lang.nameEn} for English Speakers`,
    nativeContextTitle:
      FOREIGN_COURSE_NATIVE_SUBTITLES[lang.code] || lang.nativeName,
    availability: isUkrainian ? 'published' : 'coming_soon',
    curriculumVersion: isUkrainian ? '1.0.0' : '0.0.0-pending',
    moduleRegistryRef: isUkrainian
      ? 'registry:uk:course_modules_a0_c1'
      : `registry:${lang.code}:from-en:pending`,
    courseContentRef: isUkrainian
      ? 'content:uk:29_modules_published'
      : `content:${lang.code}:from-en:empty`,
    // Non-destructive compatibility adapter: reference existing COURSE_MODULES for Ukrainian;
    // keep all other 13 foreign-language tracks strictly empty ([]).
    modules: isUkrainian ? COURSE_MODULES : [],
    vocabularyAssociation: {
      canonicalVocabularyId: isUkrainian
        ? 'vocab:uk:freq_6000_db'
        : `vocab:${lang.code}:freq_6000_pending`,
      targetLexiconSize: 6000,
      usesSharedCanonicalLexemeIdentity: false,
      supportsL1SpecificTranslations: true,
      supportsL1SpecificExplanations: true,
      supportsL1SpecificTeachingSequence: true,
    },
    assessmentAssociationRef: isUkrainian
      ? 'assessments:uk:expanded_5510_suite'
      : `assessments:track:${trackId}:pending`,
    pronunciationConfig: {
      targetBcp47Locale: lang.pronunciationMetadata.defaultBcp47Locale,
      instructionalBcp47Locale: 'en-US',
      scriptCode: lang.scriptCode,
      textDirection: lang.direction,
      supportsTransliteration: Boolean(
        lang.pronunciationMetadata.transliterationSystem
      ),
      phoneticNotation: lang.pronunciationMetadata.phoneticNotation,
    },
    // Preserve exact legacy storage namespaces for Ukrainian so zero progress is lost!
    progressNamespace: isUkrainian
      ? 'slovo_ua_6000_anki_v1'
      : `lango_track_progress_v1::${trackId}`,
    assessmentProgressNamespace: isUkrainian
      ? 'slovo_ua_course_assessments_v1'
      : `lango_track_assessments_v1::${trackId}`,
    entitlementConfig: {
      freePublishedModuleLimit: 4,
      supportedScopes: [
        'course_track',
        'target_language',
        'course_collection',
        'premium_vocabulary',
      ],
      trackScopeKey: `entitlement:track:${trackId}`,
      targetLanguageScopeKey: `entitlement:lang:${lang.code}`,
      collectionScopeKey: 'entitlement:collection:foreign_languages',
      vocabularyScopeKey: `entitlement:vocab:${lang.code}:6000`,
    },
    comingSoonTitle: isUkrainian
      ? 'Learn Ukrainian — Published (29 Modules)'
      : `${lang.nameEn} for English Speakers — Coming Soon.`,
    comingSoonMessage: isUkrainian
      ? 'Complete 29-module A0–C1 Ukrainian course is active and ready.'
      : 'This course is currently being developed. Lessons will become available when the curriculum is ready.',
    autonomyMetadata: {
      isUkrainianCourseTemplateImposed: false,
      allowsCustomModuleCount: true,
      allowsCustomProficiencyScale: true,
      allowsCustomLessonAndSectionTypes: true,
      allowsCustomAssessmentDesign: true,
      l1ContrastiveConsiderations: lang.grammarMetadata.specialNotes,
    },
    extensibleMetadata: {
      scriptNameEn: lang.scriptNameEn,
      sampleGreetingNative: lang.sampleGreetingNative,
      sampleGreetingTranslit: lang.sampleGreetingTranslit || '',
      sampleGreetingEn: lang.sampleGreetingEn,
    },
  };
}

function createEnglishForNativeSpeakerTrack(
  nativeLang: LanguageDefinition
): CourseTrack {
  const trackId = `track:${nativeLang.code}-to-en`;
  const courseId = `course:en:for-${nativeLang.code}:v1`;

  return {
    trackId,
    courseId,
    learningDirection: 'foreign_to_en',
    targetLanguage: 'en',
    nativeLanguage: nativeLang.code,
    instructionalLanguage: nativeLang.code,
    targetVariety: 'en-US',
    nativeVariety: nativeLang.pronunciationMetadata.defaultVariety,
    courseTitle: `English for ${nativeLang.nameEn} Speakers`,
    courseSubtitle: `Independent ESL/EFL Curriculum for Native ${nativeLang.nameEn} (${nativeLang.nativeName}) Learners`,
    nativeContextTitle:
      NATIVE_ENGLISH_TRACK_TITLES_NATIVE[nativeLang.code] ||
      `English for ${nativeLang.nameEn} Speakers — Coming Soon`,
    availability: 'coming_soon',
    curriculumVersion: '0.0.0-pending',
    moduleRegistryRef: `registry:en:for-${nativeLang.code}:pending`,
    courseContentRef: `content:en:for-${nativeLang.code}:empty`,
    // Strictly empty in Phase 1 — do not fabricate modules or translate a generic English course
    modules: [],
    vocabularyAssociation: {
      canonicalVocabularyId: 'vocab:en:canonical_shared_6000',
      targetLexiconSize: 6000,
      usesSharedCanonicalLexemeIdentity: true,
      presentationOverlayId: `vocab-overlay:en:for-${nativeLang.code}`,
      supportsL1SpecificTranslations: true,
      supportsL1SpecificExplanations: true,
      supportsL1SpecificTeachingSequence: true,
    },
    assessmentAssociationRef: `assessments:track:${trackId}:pending`,
    pronunciationConfig: {
      targetBcp47Locale: 'en-US',
      instructionalBcp47Locale:
        nativeLang.pronunciationMetadata.defaultBcp47Locale,
      scriptCode: 'Latn',
      textDirection: 'ltr',
      supportsTransliteration: true,
      phoneticNotation: 'IPA',
    },
    progressNamespace: `lango_track_progress_v1::${trackId}`,
    assessmentProgressNamespace: `lango_track_assessments_v1::${trackId}`,
    entitlementConfig: {
      freePublishedModuleLimit: 4,
      supportedScopes: [
        'course_track',
        'target_language',
        'course_collection',
        'premium_vocabulary',
      ],
      trackScopeKey: `entitlement:track:${trackId}`,
      targetLanguageScopeKey: 'entitlement:lang:en',
      collectionScopeKey: 'entitlement:collection:english_esl_tracks',
      vocabularyScopeKey: `entitlement:vocab:en:for-${nativeLang.code}:6000`,
    },
    comingSoonTitle: `English for ${nativeLang.nameEn} Speakers — Coming Soon.`,
    comingSoonMessage:
      'This course is currently being developed. Lessons will become available when the curriculum is ready.',
    autonomyMetadata: {
      isUkrainianCourseTemplateImposed: false,
      allowsCustomModuleCount: true,
      allowsCustomProficiencyScale: true,
      allowsCustomLessonAndSectionTypes: true,
      allowsCustomAssessmentDesign: true,
      l1ContrastiveConsiderations:
        L1_TO_ENGLISH_CONTRASTIVE_NOTES[nativeLang.code] || [],
    },
    extensibleMetadata: {
      nativeLanguageNameEn: nativeLang.nameEn,
      nativeLanguageNativeName: nativeLang.nativeName,
      nativeScriptCode: nativeLang.scriptCode,
      nativeTextDirection: nativeLang.direction,
      sampleGreetingNative: nativeLang.sampleGreetingNative,
    },
  };
}

function buildInitialCourseTracks(): Map<string, CourseTrack> {
  const map = new Map<string, CourseTrack>();
  const foreignLanguages = getForeignLanguages();

  // 1. Register 14 Direction A Tracks: English Speakers Learning a Foreign Language
  for (const lang of foreignLanguages) {
    const track = createForeignLanguageTrack(lang);
    map.set(track.trackId, track);
  }

  // 2. Register 14 Direction B Tracks: Native Speakers of 14 Languages Learning English
  for (const nativeLang of foreignLanguages) {
    const track = createEnglishForNativeSpeakerTrack(nativeLang);
    map.set(track.trackId, track);
  }

  return map;
}

const courseTrackRegistryMap = buildInitialCourseTracks();

export const PUBLISHED_UKRAINIAN_TRACK_ID = 'track:en-to-uk';

export function getAllCourseTracks(): CourseTrack[] {
  return Array.from(courseTrackRegistryMap.values());
}

export function getDirectionACourseTracks(): CourseTrack[] {
  return Array.from(courseTrackRegistryMap.values()).filter(
    (t) => t.learningDirection === 'en_to_foreign'
  );
}

export function getDirectionBCourseTracks(): CourseTrack[] {
  return Array.from(courseTrackRegistryMap.values()).filter(
    (t) => t.learningDirection === 'foreign_to_en'
  );
}

export function getCourseTrackById(trackId: string): CourseTrack | undefined {
  if (!trackId) return undefined;
  return courseTrackRegistryMap.get(trackId.trim());
}

/**
 * Resolves the exact CourseTrack for a given (targetLanguage, nativeLanguage) pair.
 * Never assumes targetLanguage alone identifies a course:
 * - resolveCourseTrack('en', 'es') -> 'track:es-to-en' (English for Spanish Speakers)
 * - resolveCourseTrack('en', 'ja') -> 'track:ja-to-en' (English for Japanese Speakers)
 * - resolveCourseTrack('uk', 'en') -> 'track:en-to-uk' (Published Ukrainian Course)
 * - resolveCourseTrack('hi', 'en') -> 'track:en-to-hi' (Hindi for English Speakers)
 */
export function resolveCourseTrack(
  targetLanguage: string,
  nativeLanguage = 'en'
): CourseTrack | undefined {
  const cleanTarget = (targetLanguage || '').toLowerCase().trim();
  const cleanNative = (nativeLanguage || 'en').toLowerCase().trim();

  if (cleanTarget === 'en') {
    const candidateId = `track:${cleanNative}-to-en`;
    if (courseTrackRegistryMap.has(candidateId)) {
      return courseTrackRegistryMap.get(candidateId);
    }
  } else {
    const candidateId = `track:${cleanNative}-to-${cleanTarget}`;
    if (courseTrackRegistryMap.has(candidateId)) {
      return courseTrackRegistryMap.get(candidateId);
    }
  }

  return Array.from(courseTrackRegistryMap.values()).find(
    (t) =>
      t.targetLanguage === cleanTarget && t.nativeLanguage === cleanNative
  );
}

/**
 * Extensibility hook: allows new CourseTracks to be registered in the future
 * without modifying the core architecture. Protects 'track:en-to-uk' from accidental replacement.
 */
export function registerCustomCourseTrack(track: CourseTrack): void {
  if (track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    throw new Error(
      'Cannot overwrite published Ukrainian course track (track:en-to-uk).'
    );
  }
  courseTrackRegistryMap.set(track.trackId, track);
}

/**
 * Updates an empty track in-memory during a developer-confirmed pilot JSON import
 * and allows resetting it back to its original empty Coming Soon state.
 */
export function updateDevPilotTrackState(
  trackId: string,
  importedPackage: unknown,
  adaptedModules: CourseModule[] = []
): CourseTrack {
  if (trackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    throw new Error(
      'Security Guardrail: Cannot import into or overwrite the published Ukrainian course (track:en-to-uk).'
    );
  }
  const existing = courseTrackRegistryMap.get(trackId);
  if (!existing) {
    throw new Error(`Unknown course track ID: ${trackId}`);
  }
  const updated: CourseTrack = {
    ...existing,
    availability: 'dev_pilot_imported',
    importedPackageData: importedPackage,
    modules: adaptedModules,
  };
  courseTrackRegistryMap.set(trackId, updated);
  return updated;
}

export function resetDevPilotTrackState(trackId: string): CourseTrack {
  if (trackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    return courseTrackRegistryMap.get(PUBLISHED_UKRAINIAN_TRACK_ID)!;
  }
  const existing = courseTrackRegistryMap.get(trackId);
  if (!existing) {
    throw new Error(`Unknown course track ID: ${trackId}`);
  }
  const targetLangDef = getLanguageByCode(existing.targetLanguage);
  const nativeLangDef = getLanguageByCode(existing.nativeLanguage);

  const restored =
    existing.learningDirection === 'en_to_foreign' && targetLangDef
      ? createForeignLanguageTrack(targetLangDef)
      : existing.learningDirection === 'foreign_to_en' && nativeLangDef
        ? createEnglishForNativeSpeakerTrack(nativeLangDef)
        : {
            ...existing,
            availability: 'coming_soon' as const,
            importedPackageData: undefined,
            modules: [],
          };

  courseTrackRegistryMap.set(trackId, restored);
  return restored;
}
