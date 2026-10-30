// ============================================================================
// LangoUA — AI Ukrainian Conversation & Grammar Analysis Engine
// ============================================================================

import {
  CONVERSATION_MODES,
  CORRECTION_INTENSITY_OPTIONS,
  CEFR_LEVEL_CONFIGS,
  CONVERSATION_SCENARIOS,
  PRONUNCIATION_GUIDES,
  getScenarioById,
  type AIConversationState,
  type ConversationMode,
  type CorrectionIntensity,
  type ConvoCefrLevel,
  type FormalityPreference,
  type GeminiVoiceName,
  type GrammarCorrectionCardData,
  type GrammarErrorCategory,
  type ConversationTurn,
  type ManualHelpActionId,
  type SessionReviewData,
  type TutorPracticeExercise,
  type UtteranceStatus,
} from './aiConversationData.ts';
import { COURSE_MODULES } from './courseData.ts';
import { FREQ_6000_DB, type VocabItem } from './vocabData.ts';

export const AI_CONVO_STORAGE_KEY = 'slovo_ai_convo_state_v1';

const VERIFIED_MODULE_MAP = new Map<string, { id: string; title: string; level: string }>(
  COURSE_MODULES.map((m) => [m.id, { id: m.id, title: m.title, level: m.level }])
);

export function getVerifiedCourseModule(moduleId: string): {
  id: string;
  title: string;
  level: string;
} {
  return (
    VERIFIED_MODULE_MAP.get(moduleId) ||
    VERIFIED_MODULE_MAP.get('A1.4') || {
      id: 'A1.4',
      title: 'Family, Saying What You Have & Basic Locations (Genitive & Locative Intro)',
      level: 'A1',
    }
  );
}

// ============================================================================
// 1. STATE INITIALIZATION & INDEPENDENT MODE / CORRECTION INTENSITY LOGIC
// ============================================================================

export function createInitialConversationState(
  overrides?: Partial<AIConversationState>
): AIConversationState {
  const initialMode: ConversationMode = overrides?.conversationMode ?? 'friendly';
  const defaultIntensityForMode =
    CONVERSATION_MODES[initialMode].defaultCorrectionIntensity;
  const initialIntensity: CorrectionIntensity =
    overrides?.correctionIntensity ?? defaultIntensityForMode;

  return {
    sessionId: `convo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sessionStartedAt: Date.now(),
    isSessionActive: false,
    conversationMode: initialMode,
    correctionIntensity: initialIntensity,
    hasUserCustomizedCorrectionIntensity:
      overrides?.hasUserCustomizedCorrectionIntensity ??
      (overrides?.correctionIntensity !== undefined),
    includeSessionReview: overrides?.includeSessionReview ?? true,
    cefrLevel: overrides?.cefrLevel ?? 'A1',
    scenarioId: overrides?.scenarioId ?? 'free-conversation',
    formalityPreference: overrides?.formalityPreference ?? 'auto',
    voicePreference: overrides?.voicePreference ?? 'Zephyr',
    speakingSpeed: overrides?.speakingSpeed ?? 1.0,
    transcriptVisibility: overrides?.transcriptVisibility ?? true,
    translationVisibility: overrides?.translationVisibility ?? 'on-demand',
    microphoneState: 'idle',
    connectionState: 'ready',
    aiSpeakingState: 'idle',
    activeCorrectionUtteranceId: null,
    activeExplanationLevel: 'simple',
    activeRightPanelTab: 'feedback',
    turns: [],
    recurringErrorCategories: {},
    lastSessionReview: null,
    ...overrides,
  };
}

/**
 * Switches the Conversation Mode ('friendly' | 'tutor').
 * CRITICAL REQUIREMENT (Parts 2, 3, 23):
 * - Conversation Mode and Correction Intensity are independent settings.
 * - Switching modes NEVER overwrites a user's customized/saved Correction Intensity,
 *   and NEVER clears or resets the conversation transcript (`turns`).
 * - Only when `useModeDefaultIfNotCustomized` is explicitly true AND the user has NOT
 *   customized correction intensity AND no session is active will it apply the mode default.
 */
export function setConversationMode(
  state: AIConversationState,
  newMode: ConversationMode,
  options?: { applyModeDefaultIntensity?: boolean }
): AIConversationState {
  let nextIntensity = state.correctionIntensity;
  if (
    options?.applyModeDefaultIntensity === true &&
    !state.hasUserCustomizedCorrectionIntensity &&
    !state.isSessionActive &&
    state.turns.length === 0
  ) {
    nextIntensity = CONVERSATION_MODES[newMode].defaultCorrectionIntensity;
  }

  return {
    ...state,
    conversationMode: newMode,
    correctionIntensity: nextIntensity,
  };
}

/**
 * Sets the Correction Intensity ('off' | 'discreet' | 'gentle' | 'balanced' | 'intensive').
 * CRITICAL REQUIREMENT:
 * - Never modifies `conversationMode`.
 * - Marks `hasUserCustomizedCorrectionIntensity: true` so mode switches never overwrite it.
 * - Preserves `turns` and `sessionId` when changed mid-session.
 */
export function setCorrectionIntensity(
  state: AIConversationState,
  newIntensity: CorrectionIntensity
): AIConversationState {
  return {
    ...state,
    correctionIntensity: newIntensity,
    hasUserCustomizedCorrectionIntensity: true,
  };
}

export function setIncludeSessionReview(
  state: AIConversationState,
  includeSessionReview: boolean
): AIConversationState {
  return {
    ...state,
    includeSessionReview,
  };
}

export interface EffectiveTurnBehavior {
  mode: ConversationMode;
  intensity: CorrectionIntensity;
  personaTitleEn: string;
  intensityLabelEn: string;
  shouldAnalyzeUtterance: boolean;
  shouldDisplayInlineBadge: boolean;
  shouldAutoOpenCorrectionCard: boolean;
  shouldIncludeSpokenCorrection: boolean;
  shouldFilterToMeaningChangingOrRecurring: boolean;
  shouldOfferRetryExercise: boolean;
  shouldFollowStructuredTutorCurriculum: boolean;
}

/**
 * Computes the exact runtime behavior for any of the 10 combinations:
 * {friendly, tutor} x {off, discreet, gentle, balanced, intensive}
 */
export function getEffectiveTurnBehavior(
  mode: ConversationMode,
  intensity: CorrectionIntensity
): EffectiveTurnBehavior {
  const modeCfg = CONVERSATION_MODES[mode];
  const intCfg = CORRECTION_INTENSITY_OPTIONS[intensity];

  return {
    mode,
    intensity,
    personaTitleEn: modeCfg.titleEn,
    intensityLabelEn: intCfg.fullLabel,
    shouldAnalyzeUtterance: intCfg.analyzeInBackground,
    shouldDisplayInlineBadge: intCfg.showInlineBadge,
    shouldAutoOpenCorrectionCard: intCfg.autoExpandCard,
    shouldIncludeSpokenCorrection: intCfg.includeSpokenCorrectionInReply,
    shouldFilterToMeaningChangingOrRecurring:
      intCfg.onlyMeaningChangingOrRecurring,
    shouldOfferRetryExercise: intCfg.offerImmediateRetryPrompt,
    shouldFollowStructuredTutorCurriculum: mode === 'tutor',
  };
}

/**
 * Determines whether a specific GrammarCorrectionCardData should surface live
 * during the conversation under the active `correctionIntensity`.
 */
export function shouldSurfaceLiveCorrection(
  analysis: GrammarCorrectionCardData,
  intensity: CorrectionIntensity,
  recurringErrorCategories: Record<string, number> = {}
): {
  showInlineBadge: boolean;
  autoOpenCard: boolean;
  speakCorrectionAloud: boolean;
} {
  if (
    analysis.status === 'correct-and-natural' ||
    analysis.status === 'acceptable-colloquial'
  ) {
    return {
      showInlineBadge: false,
      autoOpenCard: false,
      speakCorrectionAloud: false,
    };
  }

  if (intensity === 'off') {
    return {
      showInlineBadge: false,
      autoOpenCard: false,
      speakCorrectionAloud: false,
    };
  }

  if (intensity === 'discreet') {
    return {
      showInlineBadge: true,
      autoOpenCard: false,
      speakCorrectionAloud: false,
    };
  }

  const categoryCount = recurringErrorCategories[analysis.category] || 0;
  const isMeaningChangingOrRecurring =
    analysis.severity === 'meaning-changing' ||
    analysis.severity === 'moderate' ||
    categoryCount >= 2;

  if (intensity === 'gentle') {
    if (!isMeaningChangingOrRecurring || analysis.isEuphonyOnly) {
      return {
        showInlineBadge: false,
        autoOpenCard: false,
        speakCorrectionAloud: false,
      };
    }
    return {
      showInlineBadge: true,
      autoOpenCard: false,
      speakCorrectionAloud: true,
    };
  }

  if (intensity === 'balanced') {
    if (analysis.isEuphonyOnly) {
      return {
        showInlineBadge: true,
        autoOpenCard: false,
        speakCorrectionAloud: false,
      };
    }
    return {
      showInlineBadge: true,
      autoOpenCard: true,
      speakCorrectionAloud: true,
    };
  }

  // intensity === 'intensive'
  return {
    showInlineBadge: true,
    autoOpenCard: true,
    speakCorrectionAloud: true,
  };
}

// ============================================================================
// 2. SEPARATE UKRAINIAN GRAMMAR-ANALYSIS ENGINE (PARTS 8, 9, 10, 11, 12)
// ============================================================================

interface DiagnosticRuleMatch {
  status: UtteranceStatus;
  severity: 'none' | 'minor-style' | 'moderate' | 'meaning-changing';
  category: GrammarErrorCategory;
  categoryLabelEn: string;
  correctedUk: string;
  englishMeaning: string;
  whatChangedSummary: string;
  grammarRuleSummary: string;
  additionalExampleUk: string;
  additionalExampleEn: string;
  practicePromptEn: string;
  practiceTargetUk: string;
  isEuphonyOnly: boolean;
  isColloquialAcceptable: boolean;
  explanationLevels: GrammarCorrectionCardData['explanationLevels'];
  naturalAlternatives: GrammarCorrectionCardData['naturalAlternatives'];
  tutorExercise: TutorPracticeExercise;
}

const COLLOQUIAL_ACCEPTABLE_PATTERNS: Array<{
  regex: RegExp;
  meaningEn: string;
  noteEn: string;
}> = [
  {
    regex: /класно.*давай\s+зустрінемось/i,
    meaningEn: 'Oh, awesome! Let’s meet up tomorrow.',
    noteEn:
      '«Кла́сно» and the short reflexive ending «-сь» in «зустрі́немось» are completely natural, authentic everyday spoken Ukrainian.',
  },
  {
    regex: /^(о,?\s*)?(класно|супер|файно|чудово|домовились|домовилися|звісно|авжеж)/i,
    meaningEn: 'Natural spoken Ukrainian expression of agreement or enthusiasm.',
    noteEn:
      'Spoken Ukrainian frequently uses expressive adverbs like «кла́сно», «фа́йно», «су́пер», and «домо́вились». This is natural colloquial usage, not a grammar mistake.',
  },
];

const CITY_LOCATIVE_RULES: Array<{
  nomRegex: RegExp;
  rawCityNom: string;
  correctPrepAndLoc: string;
  cityEn: string;
  nomForm: string;
  genForm: string;
  datForm: string;
  accForm: string;
  instForm: string;
  locForm: string;
  vocForm: string;
  stemNoteEn: string;
}> = [
  {
    nomRegex: /(?:^|\s)(?:в|у)\s+львів(?=$|[\s,.;:!?»"()—\-])/i,
    rawCityNom: 'Львів',
    correctPrepAndLoc: 'у Льво́ві',
    cityEn: 'Lviv',
    nomForm: 'Львів',
    genForm: 'Льво́ва',
    datForm: 'Льво́ву',
    accForm: 'Львів',
    instForm: 'Льво́вом',
    locForm: 'у Льво́ві',
    vocForm: 'Льво́ве',
    stemNoteEn:
      'In closed syllables «і» alternates with «о» in open syllables (і → о ikavism): Львів → у Льво́ві. Also, before the consonant cluster «Льв-», Ukrainian euphony prefers the preposition «у» rather than «в».',
  },
  {
    nomRegex: /(?:^|\s)(?:в|у)\s+київ(?=$|[\s,.;:!?»"()—\-])/i,
    rawCityNom: 'Ки́їв',
    correctPrepAndLoc: 'у Ки́єві',
    cityEn: 'Kyiv',
    nomForm: 'Ки́їв',
    genForm: 'Ки́єва',
    datForm: 'Ки́єву',
    accForm: 'Ки́їв',
    instForm: 'Ки́євом',
    locForm: 'у Ки́єві',
    vocForm: 'Ки́єве',
    stemNoteEn:
      'In «Ки́їв», the vowel «ї» [ji] alternates with «є» [jɛ] when the syllable opens before a case ending: Ки́їв → у Ки́єві.',
  },
  {
    nomRegex: /(?:^|\s)(?:в|у)\s+харків(?=$|[\s,.;:!?»"()—\-])/i,
    rawCityNom: 'Ха́рків',
    correctPrepAndLoc: 'у Ха́ркові',
    cityEn: 'Kharkiv',
    nomForm: 'Ха́рків',
    genForm: 'Ха́ркова',
    datForm: 'Ха́ркову',
    accForm: 'Ха́рків',
    instForm: 'Ха́рковом',
    locForm: 'у Ха́ркові',
    vocForm: 'Ха́ркове',
    stemNoteEn:
      'Closed-syllable «і» alternates with «о» when a case ending is added: Ха́рків → у Ха́ркові.',
  },
  {
    nomRegex: /(?:^|\s)(?:в|у)\s+одеса(?=$|[\s,.;:!?»"()—\-])/i,
    rawCityNom: 'Оде́са',
    correctPrepAndLoc: 'в Оде́сі',
    cityEn: 'Odesa',
    nomForm: 'Оде́са',
    genForm: 'Оде́си',
    datForm: 'Оде́сі',
    accForm: 'Оде́су',
    instForm: 'Оде́сою',
    locForm: 'в Оде́сі',
    vocForm: 'Оде́со',
    stemNoteEn:
      'First-declension feminine nouns ending in «-а» take «-і» in the Locative case: Оде́са → в Оде́сі.',
  },
  {
    nomRegex: /(?:^|\s)(?:в|у)\s+україна(?=$|[\s,.;:!?»"()—\-])/i,
    rawCityNom: 'Украї́на',
    correctPrepAndLoc: 'в Украї́ні',
    cityEn: 'Ukraine',
    nomForm: 'Украї́на',
    genForm: 'Украї́ни',
    datForm: 'Украї́ні',
    accForm: 'Украї́ну',
    instForm: 'Украї́ною',
    locForm: 'в Украї́ні',
    vocForm: 'Украї́но',
    stemNoteEn:
      'After «в/у» indicating static location ("in Ukraine"), feminine nouns in «-а» take the Locative ending «-і»: Украї́на → в Украї́ні.',
  },
];

function extractVocabularyFromText(textUk: string): Array<{
  uk: string;
  en: string;
  pos: string;
  caseOrGrammarNote: string;
}> {
  const tokens = textUk
    .toLowerCase()
    .replace(/[.,!?;:«»"()—\-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  const seen = new Set<string>();
  const results: Array<{
    uk: string;
    en: string;
    pos: string;
    caseOrGrammarNote: string;
  }> = [];

  for (const tok of tokens) {
    const cleanTok = tok.replace(/\u0301/g, '');
    const found = FREQ_6000_DB.find((entry: VocabItem) => {
      const cleanUk = entry.ru.toLowerCase().replace(/\u0301/g, '');
      return (
        cleanUk === cleanTok ||
        (cleanTok.length >= 4 && cleanUk.startsWith(cleanTok.slice(0, -1)))
      );
    });
    if (found && !seen.has(found.ru)) {
      seen.add(found.ru);
      const inferredCefr =
        found.rank <= 1000
          ? 'A1'
          : found.rank <= 2000
          ? 'A2'
          : found.rank <= 3500
          ? 'B1'
          : found.rank <= 4800
          ? 'B2'
          : 'C1';
      results.push({
        uk: found.ru,
        en: found.en,
        pos: found.pos || 'word',
        caseOrGrammarNote: `CEFR ${inferredCefr} core vocabulary`,
      });
      if (results.length >= 5) break;
    }
  }

  return results;
}

/**
 * Deterministic + linguistically accurate Ukrainian grammar analyzer.
 * Distinguishes:
 * 1. Grammatically incorrect Ukrainian ('incorrect-grammar')
 * 2. Grammatically correct but unnatural phrasing ('correct-but-unnatural')
 * 3. Grammatically correct and natural Ukrainian ('correct-and-natural')
 * 4. Acceptable spoken/colloquial Ukrainian ('acceptable-colloquial')
 * 5. Uncertain speech-recognition transcription ('uncertain-transcription')
 */
export function analyzeUkrainianUtterance(
  rawText: string,
  utteranceId: string,
  context?: {
    cefrLevel?: ConvoCefrLevel;
    formalityPreference?: FormalityPreference;
    scenarioId?: string;
  }
): GrammarCorrectionCardData {
  const trimmed = (rawText || '').trim();
  const normalized = trimmed.replace(/\u0301/g, '');
  const lower = normalized.toLowerCase();
  const vocabList = extractVocabularyFromText(trimmed);

  // 0. Check for uncertain / empty / garbled transcription
  const hasCyrillic = /[а-яіїєґА-ЯІЇЄҐ]/.test(trimmed);
  if (!trimmed || trimmed.length < 2 || (!hasCyrillic && trimmed.length < 4)) {
    const mod = getVerifiedCourseModule('A0.3');
    return {
      utteranceId,
      status: 'uncertain-transcription',
      severity: 'none',
      category: 'vocabulary',
      categoryLabelEn: 'Unclear Audio / Transcription Check',
      youSaidUk: trimmed || '(нерозбі́рливо)',
      correctUkrainian: 'Перепро́шую, повторі́ть, будь ла́ска, ще раз.',
      englishMeaning: 'Could you please repeat or edit your message?',
      whatChangedSummary:
        'The microphone pickup was very short or unclear. You can edit your transcript text directly or say it again.',
      grammarRuleSummary:
        'Instead of guessing a grammar mistake from unclear audio, LangoUA lets you clarify or edit what you meant to say.',
      additionalExampleUk: 'Приві́т! Мене́ зва́ти Оле́на.',
      additionalExampleEn: 'Hi! My name is Olena.',
      practicePromptEn: 'Try saying or typing a complete Ukrainian phrase:',
      practiceTargetUk: 'Приві́т! Як у те́бе спра́ви?',
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple:
          'We couldn’t clearly hear a full Ukrainian word or phrase. Tap "Edit" on your message or speak again clearly.',
        detailed:
          'Speech recognition sometimes mishears short sounds. Editing your transcript re-runs grammar analysis immediately.',
        advanced: {
          linguisticSummary:
            'Automatic speech recognition confidence was too low to parse morphological endings reliably.',
          morphologicalNote: 'No grammar error was recorded for this turn.',
          exceptionsNote: 'You can always use the text box below the microphone to verify spelling.',
          tableTitle: 'Helpful Conversational Starters',
          tableRows: [
            { formLabel: 'Greeting', ukrainianForm: 'Приві́т! Як спра́ви?', englishNote: 'Hi! How are things?', isTargetForm: true },
            { formLabel: 'Clarification', ukrainianForm: 'Повторі́ть, будь ла́ска.', englishNote: 'Please repeat.' },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed || '—',
        correctedGrammarUk: 'Приві́т! Як у те́бе спра́ви?',
        casualUk: 'Приві́т! Як ти?',
        casualNoteEn: 'Friendly everyday greeting among friends.',
        neutralUk: 'Віта́ю! Як у те́бе спра́ви?',
        neutralNoteEn: 'Warm, versatile greeting for any situation.',
        formalUk: 'До́брий день! Як Ва́ші спра́ви?',
        formalNoteEn: 'Polite formal greeting with «Ви».',
        colloquialUk: 'Приві́т! Як воно́?',
        colloquialNoteEn: 'Relaxed spoken Ukrainian among close friends.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'repeat-corrected',
        titleEn: 'Say a Clear Opening Phrase',
        promptEn: 'Say or type this natural Ukrainian greeting:',
        promptUk: 'Приві́т! У ме́не все до́бре.',
        expectedAnswerUk: 'Привіт! У мене все добре.',
        acceptedVariantsUk: ['Привіт! У мене все добре.', 'У мене все добре'],
        hintEn: 'Start with Приві́т! (Hi!) followed by У ме́не все до́бре.',
        grammarFocus: 'Everyday Greetings',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 1. Check for Locative case errors after в/у with cities/countries (e.g. "Я живу в Львів" -> "Я живу у Львові")
  for (const cityRule of CITY_LOCATIVE_RULES) {
    if (cityRule.nomRegex.test(normalized) && /(жив|мешка|був|була|працю|навча|зараз)/i.test(normalized)) {
      const corrected = normalized
        .replace(cityRule.nomRegex, (m) =>
          m.startsWith(' ') ? ` ${cityRule.correctPrepAndLoc}` : cityRule.correctPrepAndLoc
        )
        .replace(/^я\s+живу(?=\s|$)/i, 'Я живу́');
      const mod = getVerifiedCourseModule('A1.4');
      return {
        utteranceId,
        status: 'incorrect-grammar',
        severity: 'meaning-changing',
        category: 'cases',
        categoryLabelEn: 'Locative Case (Місце́вий відмі́нок) After «у / в»',
        youSaidUk: trimmed,
        correctUkrainian: corrected,
        englishMeaning: `I live in ${cityRule.cityEn}.`,
        whatChangedSummary: `Changed Nominative «${cityRule.rawCityNom}» to the Locative case «${cityRule.correctPrepAndLoc}» to express static location ("in ${cityRule.cityEn}").`,
        grammarRuleSummary: `After the prepositions «у / в» and «на» answering «Де?» (Where? / In what place?), Ukrainian nouns must take the Locative case (Місце́вий відмі́нок), usually ending in «-і». ${cityRule.stemNoteEn}`,
        additionalExampleUk: 'Мій друг живе́ у Ки́єві, а сестра́ навча́ється у Льво́ві.',
        additionalExampleEn: 'My friend lives in Kyiv, and my sister studies in Lviv.',
        practicePromptEn: `Say this sentence again using the Locative case (${cityRule.correctPrepAndLoc}):`,
        practiceTargetUk: corrected.replace(/\u0301/g, ''),
        isEuphonyOnly: false,
        isColloquialAcceptable: false,
        explanationLevels: {
          simple: `When you say where you live or are located ("in ${cityRule.cityEn}"), Ukrainian changes the end of the city name after «у / в»: «${cityRule.rawCityNom}» becomes «${cityRule.correctPrepAndLoc}».`,
          detailed: `The preposition «у / в» can mean either "in" (location, answering Де?) or "to/into" (motion, answering Куди́?). With verbs of location like «жи́ти» (to live), «бу́ти» (to be), or «працюва́ти» (to work), «у / в» requires the Locative case (Місце́вий відмі́нок). ${cityRule.stemNoteEn}`,
          advanced: {
            linguisticSummary: `Second-declension masculine toponyms ending in a hard consonant take the Locative singular desinence «-і». Because adding «-і» opens the final syllable, historical «о» is restored in the root (${cityRule.nomForm} → ${cityRule.locForm}).`,
            morphologicalNote: cityRule.stemNoteEn,
            exceptionsNote:
              'Note that for motion toward a city ("to Lviv"), Ukrainian prefers «до + Genitive» («до Льво́ва») rather than «в + Accusative».',
            tableTitle: `7-Case Declension of «${cityRule.rawCityNom}» (${cityRule.cityEn})`,
            tableRows: [
              { formLabel: 'Nominative (Називни́й — Хто? Що?)', ukrainianForm: cityRule.nomForm, englishNote: 'Subject form' },
              { formLabel: 'Genitive (Родови́й — Кого́? Чого́? / до...)', ukrainianForm: cityRule.genForm, englishNote: `to/from ${cityRule.cityEn} (до/з ${cityRule.genForm})` },
              { formLabel: 'Dative (Дава́льний — Кому́? Чому́?)', ukrainianForm: cityRule.datForm, englishNote: `to/for ${cityRule.cityEn}` },
              { formLabel: 'Accusative (Знахі́дний — Кого́? Що?)', ukrainianForm: cityRule.accForm, englishNote: 'Direct object' },
              { formLabel: 'Instrumental (Ору́дний — Ким? Чим?)', ukrainianForm: cityRule.instForm, englishNote: `with/by ${cityRule.cityEn}` },
              { formLabel: 'Locative (Місце́вий — На/у ко́му? чо́му?)', ukrainianForm: cityRule.locForm, englishNote: `in ${cityRule.cityEn} (Target Form)`, isTargetForm: true },
              { formLabel: 'Vocative (Кли́чний — зверта́ння)', ukrainianForm: cityRule.vocForm, englishNote: 'Direct address' },
            ],
            relatedCourseModuleId: mod.id,
            relatedCourseModuleTitle: mod.title,
            inspectWordUk: cityRule.rawCityNom.replace(/\u0301/g, ''),
          },
        },
        naturalAlternatives: {
          originalSentenceUk: trimmed,
          correctedGrammarUk: corrected,
          casualUk: `Я за́раз живу́ ${cityRule.correctPrepAndLoc}.`,
          casualNoteEn: 'Natural everyday phrasing with «за́раз» (right now).',
          neutralUk: corrected,
          neutralNoteEn: 'Standard, clear Ukrainian sentence.',
          formalUk: `На да́ний час я ме́шкаю ${cityRule.correctPrepAndLoc}.`,
          formalNoteEn: 'Uses the elevated verb «ме́шкати» (to reside) suitable for formal introductions.',
          colloquialUk: `Я зі ${cityRule.genForm} / живу́ ${cityRule.correctPrepAndLoc}.`,
          colloquialNoteEn: 'Everyday spoken way to mention your city.',
        },
        tutorExercise: {
          id: `ex_${utteranceId}`,
          exerciseType: 'apply-case',
          titleEn: 'Apply the Locative Case (Де? — Where?)',
          promptEn: `Say the corrected sentence in Ukrainian using the Locative form «${cityRule.correctPrepAndLoc}»:`,
          promptUk: corrected,
          expectedAnswerUk: corrected.replace(/\u0301/g, ''),
          acceptedVariantsUk: [
            corrected.replace(/\u0301/g, ''),
            `Я мешкаю ${cityRule.correctPrepAndLoc.replace(/\u0301/g, '')}`,
          ],
          hintEn: `Remember to change «${cityRule.rawCityNom}» to «${cityRule.correctPrepAndLoc}».`,
          grammarFocus: 'Locative Case after у/в',
        },
        keyVocabularyWords: vocabList,
      };
    }
  }

  // 2. Check for pure Euphony adjustment ("в Львові" -> "у Львові") where case is ALREADY Locative!
  if (/(?:^|\s)в\s+львові(?=$|[\s,.;:!?])/i.test(normalized)) {
    const corrected = normalized.replace(/(^|\s)в\s+львові(?=$|[\s,.;:!?])/i, '$1у Льво́ві');
    const mod = getVerifiedCourseModule('C1.1');
    return {
      utteranceId,
      status: 'correct-but-unnatural',
      severity: 'minor-style',
      category: 'euphony',
      categoryLabelEn: 'Ukrainian Euphony (Милозву́чність: «у» vs. «в»)',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: 'I live in Lviv.',
      whatChangedSummary:
        'Your Locative case ending «Льво́ві» is 100% grammatically correct! For smoother pronunciation before the consonant cluster «Льв-», Ukrainian euphony prefers «у Льво́ві» instead of «в Льво́ві».',
      grammarRuleSummary:
        'Ukrainian euphony (милозву́чність) alternates «у» and «в» to avoid hard consonant clusters. Before words starting with «в», «ф», or clusters like «льв-, св-, тв-, хв-», always use «у».',
      additionalExampleUk: 'Ми зустрі́лися у Льво́ві в затишні́й кав’я́рні.',
      additionalExampleEn: 'We met in Lviv in a cozy coffeehouse.',
      practicePromptEn: 'Try saying it smoothly with the vowel preposition «у»:',
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: true,
      isColloquialAcceptable: true,
      explanationLevels: {
        simple:
          'Your grammar («Льво́ві») is right! Just swap «в» to «у» before «Льво́ві» so two «в» sounds don’t clash.',
        detailed:
          'This is a stylistic euphony refinement (милозву́чність), not a case error. Because «Льво́ві» begins with the consonant cluster «Льв-» containing «в», using the vowel «у» makes the phrase flow melodiously.',
        advanced: {
          linguisticSummary:
            'Prepositional allomorphy between vocalic «у» [u] and consonantal/glide «в» [w] is governed by syllable structure and adjacent labiodental/bilabial approximants.',
          morphologicalNote:
            'Before initial /v, w, f/ or consonant clusters containing /v, f/ (льв-, св-, цв-, хв-), «у» is mandatory in standard Ukrainian orthography.',
          exceptionsNote:
            'In rapid informal speech, native speakers understand both, so this is classified as a minor euphony refinement rather than a grammatical error.',
          tableTitle: 'Ukrainian Euphony Alternation («у» vs. «в»)',
          tableRows: [
            { formLabel: 'Before «в, ф, льв, св, хв»', ukrainianForm: 'у Льво́ві, у ва́зі, у свя́то', englishNote: 'Always use «у»', isTargetForm: true },
            { formLabel: 'Between two vowels', ukrainianForm: 'була́ в Оде́сі, жила́ в Украї́ні', englishNote: 'Always use «в»' },
            { formLabel: 'After vowel before single consonant', ukrainianForm: 'ї́ду в Ки́їв / живу́ в Полта́ві', englishNote: 'Prefer «в»' },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: 'Я живу́ у Льво́ві.',
        casualNoteEn: 'Smooth everyday phrasing.',
        neutralUk: corrected,
        neutralNoteEn: 'Standard euphonic Ukrainian.',
        formalUk: 'Я прожива́ю у мі́сті Льво́ві.',
        formalNoteEn: 'Formal administrative/biographical register.',
        colloquialUk: 'Я у Льво́ві живу́.',
        colloquialNoteEn: 'Natural conversational word order.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'repeat-corrected',
        titleEn: 'Practice Smooth Euphony («у Льво́ві»)',
        promptEn: 'Repeat the sentence using «у Льво́ві»:',
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [corrected.replace(/\u0301/g, '')],
        hintEn: 'Use «у» before «Льво́ві».',
        grammarFocus: 'Euphony (у/в)',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 3. Check for Accusative feminine direct object errors (e.g., "Я читаю книга", "Я п'ю кава", "Я люблю музика", "Я вивчаю українська мова")
  const accFemMatch = normalized.match(
    /(?:^|\s)(читаю|читаєш|п'ю|п’ю|пю|хочу|замовлю|візьму|люблю|вивчаю|слухаю|шукаю|купую|готую)\s+(цікава\s+|українська\s+|гаряча\s+|нову\s+|нова\s+)?(книга|кава|вода|музика|мова|вишиванка|куртка|історія|пісня)(?=$|[\s,.;:!?»"()—\-])/i
  );
  if (accFemMatch) {
    const verb = accFemMatch[1];
    const rawAdj = (accFemMatch[2] || '').trim();
    const rawNoun = accFemMatch[3].toLowerCase();

    const nounAccMap: Record<string, { acc: string; en: string; gen: string; inst: string; loc: string }> = {
      книга: { acc: 'кни́гу', en: 'book', gen: 'кни́ги', inst: 'кни́гою', loc: 'у кни́зі' },
      кава: { acc: 'ка́ву', en: 'coffee', gen: 'ка́ви', inst: 'ка́вою', loc: 'у ка́ві' },
      вода: { acc: 'во́ду', en: 'water', gen: 'води́', inst: 'водо́ю', loc: 'у воді́' },
      музика: { acc: 'му́зику', en: 'music', gen: 'му́зики', inst: 'му́зикою', loc: 'у му́зиці' },
      мова: { acc: 'мо́ву', en: 'language', gen: 'мо́ви', inst: 'мо́вою', loc: 'у мо́ві' },
      вишиванка: { acc: 'вишива́нку', en: 'vyshyvanka', gen: 'вишива́нки', inst: 'вишива́нкою', loc: 'у вишива́нці' },
      куртка: { acc: 'ку́ртку', en: 'jacket', gen: 'ку́ртки', inst: 'ку́рткою', loc: 'у ку́ртці' },
      історія: { acc: 'істо́рію', en: 'story / history', gen: 'істо́рії', inst: 'істо́рією', loc: 'в істо́рії' },
      пісня: { acc: 'пі́сню', en: 'song', gen: 'пі́сні', inst: 'пі́снею', loc: 'у пі́сні' },
    };

    const adjAccMap: Record<string, string> = {
      цікава: 'ціка́ву ',
      українська: 'украї́нську ',
      гаряча: 'гаря́чу ',
      нова: 'нову́ ',
      нову: 'нову́ ',
    };

    const targetNoun = nounAccMap[rawNoun] || {
      acc: rawNoun.replace(/а$/, 'у').replace(/я$/, 'ю'),
      en: 'noun',
      gen: rawNoun.replace(/а$/, 'и'),
      inst: rawNoun.replace(/а$/, 'ою'),
      loc: rawNoun.replace(/а$/, 'і'),
    };
    const targetAdj = rawAdj ? adjAccMap[rawAdj.toLowerCase()] || rawAdj.replace(/а$/i, 'у') + ' ' : '';
    const leadSpace = accFemMatch[0].startsWith(' ') ? ' ' : '';
    const corrected = normalized.replace(
      accFemMatch[0],
      `${leadSpace}${verb} ${targetAdj}${targetNoun.acc}`
    );
    const mod = getVerifiedCourseModule('A1.3');

    return {
      utteranceId,
      status: 'incorrect-grammar',
      severity: 'meaning-changing',
      category: 'cases',
      categoryLabelEn: 'Accusative Case (Знахі́дний відмі́нок) Direct Object',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: `I ${verb.toLowerCase().includes('чита') ? ' am reading' : verb.toLowerCase().includes('вивча') ? ' am learning' : ' want/use'} ${targetNoun.en}.`,
      whatChangedSummary: `Changed the feminine direct object «${rawAdj ? rawAdj + ' ' : ''}${rawNoun}» (Nominative) to «${targetAdj}${targetNoun.acc}» (Accusative case).`,
      grammarRuleSummary:
        'Transitive verbs like «чита́ти» (to read), «пи́ти» (to drink), «вивча́ти» (to study), «люби́ти» (to love), and «замовля́ти» (to order) require the Accusative case (Знахі́дний відмі́нок) for the direct object. Feminine nouns ending in «-а / -я» change to «-у / -ю», and feminine adjectives change «-а» to «-у».',
      additionalExampleUk: 'Я щодня́ вивча́ю украї́нську мо́ву і чита́ю ціка́ву кни́гу.',
      additionalExampleEn: 'Every day I study the Ukrainian language and read an interesting book.',
      practicePromptEn: `Repeat the sentence with the Accusative ending «${targetAdj}${targetNoun.acc}»:`,
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple: `Because «${rawNoun}» is the thing receiving the action of «${verb}», its ending changes from «-а/-я» to «-у/-ю»: «${targetAdj}${targetNoun.acc}».`,
        detailed: `In Ukrainian, the dictionary form («${rawNoun}») is the Nominative case, used for the subject of a sentence. When a feminine noun is the direct object of an action verb (answering Кого́? Що?), it takes the Accusative case: hard stems change «-а → -у» and soft stems change «-я → -ю».`,
        advanced: {
          linguisticSummary:
            'First-declension feminine nouns mark the Accusative singular with «-у» (hard/mixed stems) or «-ю» (soft stems), while modifying feminine adjectives take the Accusative desinence «-у / -ю».',
          morphologicalNote: `Nominative «${rawNoun}» → Accusative «${targetNoun.acc}».`,
          exceptionsNote:
            'Unlike masculine inanimate nouns (where Accusative equals Nominative, e.g., «Я п’ю чай»), feminine nouns ALWAYS change their ending in the Accusative singular.',
          tableTitle: `Declension of Feminine Noun «${rawNoun}»`,
          tableRows: [
            { formLabel: 'Nominative (Хто? Що?)', ukrainianForm: rawNoun, englishNote: `Subject (${targetNoun.en})` },
            { formLabel: 'Genitive (Кого́? Чого́?)', ukrainianForm: targetNoun.gen, englishNote: `of ${targetNoun.en} / without ${targetNoun.en}` },
            { formLabel: 'Accusative (Кого́? Що? — Direct Object)', ukrainianForm: targetNoun.acc, englishNote: 'Direct object (Target Form)', isTargetForm: true },
            { formLabel: 'Instrumental (Ким? Чим?)', ukrainianForm: targetNoun.inst, englishNote: `with/by ${targetNoun.en}` },
            { formLabel: 'Locative (На/у чо́му?)', ukrainianForm: targetNoun.loc, englishNote: `in/on ${targetNoun.en}` },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
          inspectWordUk: rawNoun,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: corrected,
        casualNoteEn: 'Natural everyday spoken Ukrainian.',
        neutralUk: corrected,
        neutralNoteEn: 'Standard grammatical sentence.',
        formalUk: `Я із задово́ленням ${verb} ${targetAdj}${targetNoun.acc}.`,
        formalNoteEn: 'Polite, expressive register.',
        colloquialUk: `За́раз ${verb} ${targetAdj}${targetNoun.acc}.`,
        colloquialNoteEn: 'Natural conversational phrasing dropping «я» when context is clear.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'apply-case',
        titleEn: 'Practice Feminine Accusative (-а → -у)',
        promptEn: `Say the corrected sentence using «${targetAdj}${targetNoun.acc}»:`,
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [corrected.replace(/\u0301/g, '')],
        hintEn: `Change «${rawNoun}» to «${targetNoun.acc}».`,
        grammarFocus: 'Accusative Case Direct Object',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 4. Check for Past Time Adverb + Present Tense Verb mismatch (e.g., "Ми йдемо в магазин вчора" / "Вчора я роблю")
  if (
    /(?:^|\s)(вчора|учора|минулого\s+року|минулого\s+тижня)(?=$|[\s,.;:!?])/i.test(normalized) &&
    /(?:^|\s)(йдемо|ідемо|йду|іду|роблю|робимо|читаю|працюю|живу|купую|дивимося)(?=$|[\s,.;:!?])/i.test(normalized)
  ) {
    const corrected =
      /(?:^|\s)ми(?=\s|$)/i.test(normalized) && /(?:^|\s)(йдемо|ідемо)(?=\s|$)/i.test(normalized)
        ? 'Учо́ра ми ходи́ли в магази́н.'
        : 'Учо́ра я ходи́в (ходи́ла) у спра́вах.';
    const mod = getVerifiedCourseModule('A2.1');
    return {
      utteranceId,
      status: 'incorrect-grammar',
      severity: 'meaning-changing',
      category: 'verb-conjugation',
      categoryLabelEn: 'Past Tense & Time Agreement (Мину́лий час)',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: 'Yesterday we went to the store.',
      whatChangedSummary:
        'Changed the present-tense verb to the past tense («ходи́ли») so it agrees with the past time marker «учо́ра» (yesterday).',
      grammarRuleSummary:
        'When a sentence includes a past time expression like «учо́ра» (yesterday) or «мину́лого ро́ку» (last year), the verb must be in the past tense (-в, -ла, -ло, -ли). For a completed round-trip ("went to the store and came back"), Ukrainian uses the multidirectional past «ходи́ли».',
      additionalExampleUk: 'Учо́ра вве́чері ми ходи́ли в кіно́ і пили́ чай.',
      additionalExampleEn: 'Yesterday evening we went to the cinema and drank tea.',
      practicePromptEn: 'Say this sentence in the past tense with «ходи́ли»:',
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple:
          'Because «учо́ра» means "yesterday", we need the past-tense verb «ходи́ли» (went) instead of the present-tense «йдемо́» (are going).',
        detailed:
          'In Ukrainian, past-tense verbs are formed from the infinitive stem + «-в» (masculine), «-ла» (feminine), «-ло» (neuter), or «-ли» (plural). Also, for a completed round-trip in the past, Ukrainian uses «ходи́ти → ходи́ли».',
        advanced: {
          linguisticSummary:
            'Temporal deictic adverbs such as «учо́ра» require past-tense verbal morphology. Furthermore, determinate «іти́» denotes a single ongoing motion in one direction, whereas indeterminate «ходи́ти» in the past («ходи́ли») encodes a completed round trip.',
          morphologicalNote: 'іти́ (present: ми йдемо́) vs. ходи́ти (past plural: ми ходи́ли).',
          exceptionsNote:
            'Putting «Учо́ра» at the beginning of the sentence is also the most natural Ukrainian word order for setting the time frame.',
          tableTitle: 'Past Tense Forms by Gender & Number',
          tableRows: [
            { formLabel: 'Masculine (я, ти, він)', ukrainianForm: 'ходи́в / пішо́в', englishNote: 'went (male speaker)' },
            { formLabel: 'Feminine (я, ти, вона́)', ukrainianForm: 'ходи́ла / пішла́', englishNote: 'went (female speaker)' },
            { formLabel: 'Plural (ми, ви, вони́)', ukrainianForm: 'ходи́ли / пішли́', englishNote: 'we/you/they went (Target Form)', isTargetForm: true },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
          inspectWordUk: 'ходити',
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: 'Ми вчо́ра ходи́ли в магази́н.',
        casualNoteEn: 'Natural conversational word order.',
        neutralUk: corrected,
        neutralNoteEn: 'Clear standard Ukrainian sentence.',
        formalUk: 'Учо́ра ми відві́дали магази́н.',
        formalNoteEn: 'More formal verb «відві́дати» (to visit).',
        colloquialUk: 'Учо́ра забіга́ли в магази́н.',
        colloquialNoteEn: 'Colloquial «забіга́ли» ("popped into the store").',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'change-tense',
        titleEn: 'Convert Present Tense to Past Tense',
        promptEn: 'Say the sentence in the past tense with «Учо́ра ми ходи́ли...»:',
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [
          corrected.replace(/\u0301/g, ''),
          'Вчора ми ходили в магазин.',
          'Ми вчора ходили в магазин.',
        ],
        hintEn: 'Use the plural past tense ending «-ли»: ми ходи́ли.',
        grammarFocus: 'Past Tense & Motion Verbs',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 5. Check for Instrumental case after «з/із/зі» (e.g. "кава з молоко", "чай з лимон", "розмовляю з друг")
  const instAfterZ = normalized.match(/(?:^|\s)(з|із|зі)\s+(молоко|лимон|цукор|сир|м'ясо|друг|сестра|брат)(?=$|[\s,.;:!?])/i);
  if (instAfterZ) {
    const rawNoun = instAfterZ[2].toLowerCase();
    const instMap: Record<string, { inst: string; en: string }> = {
      молоко: { inst: 'молоко́м', en: 'with milk' },
      лимон: { inst: 'лимо́ном', en: 'with lemon' },
      цукор: { inst: 'цу́кром', en: 'with sugar' },
      сир: { inst: 'си́ром', en: 'with cheese' },
      "м'ясо": { inst: 'м’я́сом', en: 'with meat' },
      друг: { inst: 'дру́гом', en: 'with a friend' },
      сестра: { inst: 'сестро́ю', en: 'with my sister' },
      брат: { inst: 'бра́том', en: 'with my brother' },
    };
    const target = instMap[rawNoun] || { inst: `${rawNoun}ом`, en: `with ${rawNoun}` };
    const leadSpace = instAfterZ[0].startsWith(' ') ? ' ' : '';
    const corrected = normalized.replace(instAfterZ[0], `${leadSpace}з ${target.inst}`);
    const mod = getVerifiedCourseModule('A2.2');
    return {
      utteranceId,
      status: 'incorrect-grammar',
      severity: 'meaning-changing',
      category: 'cases',
      categoryLabelEn: 'Instrumental Case (Ору́дний відмі́нок) After «з / із / зі»',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: `...${target.en}.`,
      whatChangedSummary: `Changed «${instAfterZ[0]}» to the Instrumental case «з ${target.inst}».`,
      grammarRuleSummary:
        'When the preposition «з / із / зі» means "with / accompanied by" (Компа́нія або́ дода́ток: з ким? з чим?), the following noun must take the Instrumental case (Ору́дний відмі́нок): masculine/neuter «-ом / -ем» and feminine «-ою / -ею».',
      additionalExampleUk: 'Я люблю́ ка́ву з молоко́м і спілкува́тися з дру́зями.',
      additionalExampleEn: 'I love coffee with milk and chatting with friends.',
      practicePromptEn: `Repeat the phrase using «з ${target.inst}»:`,
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple: `After «з» meaning "with", add the Instrumental ending: «${rawNoun}» becomes «з ${target.inst}».`,
        detailed:
          'The Instrumental case (Ору́дний відмі́нок) expresses accompaniment or ingredients after «з / із / зі». Hard masculine and neuter nouns add «-ом», while feminine nouns in «-а» change to «-ою».',
        advanced: {
          linguisticSummary:
            'Comitative and ingredient phrases headed by «з / із / зі» govern the Instrumental case across all declension classes.',
          morphologicalNote: `Nominative «${rawNoun}» → Instrumental «${target.inst}».`,
          exceptionsNote:
            'Be careful: «з + Genitive» means "from" (e.g., «з Ки́єва» = from Kyiv), whereas «з + Instrumental» means "with" (e.g., «з молоко́м» = with milk).',
          tableTitle: `Instrumental Case Contrast for «${rawNoun}»`,
          tableRows: [
            { formLabel: 'Nominative (Що? Хто?)', ukrainianForm: rawNoun, englishNote: 'Dictionary form' },
            { formLabel: 'Instrumental (З ким? З чим?)', ukrainianForm: `з ${target.inst}`, englishNote: target.en, isTargetForm: true },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
          inspectWordUk: rawNoun,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: corrected,
        casualNoteEn: 'Natural everyday phrasing.',
        neutralUk: corrected,
        neutralNoteEn: 'Standard Ukrainian.',
        formalUk: `Дозво́льте замо́вити це з ${target.inst}.`,
        formalNoteEn: 'Polite formal ordering phrase.',
        colloquialUk: corrected,
        colloquialNoteEn: 'Common spoken phrasing.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'apply-case',
        titleEn: 'Practice Instrumental Case After «з»',
        promptEn: `Say the corrected sentence with «з ${target.inst}»:`,
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [corrected.replace(/\u0301/g, '')],
        hintEn: `Use the Instrumental ending in «з ${target.inst}».`,
        grammarFocus: 'Instrumental Case after з',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 6. Check for Genitive case after «немає / нема / багато / до» (e.g., "У мене немає час", "Я їду до Київ")
  const genAfterPrep = normalized.match(/(?:^|\s)(немає|нема|багато|до)\s+(час|гроші|робота|київ|львів|одеса|вокзал|метро)(?=$|[\s,.;:!?])/i);
  if (genAfterPrep && genAfterPrep[2].toLowerCase() !== 'метро') {
    const trigger = genAfterPrep[1];
    const rawNoun = genAfterPrep[2].toLowerCase();
    const genMap: Record<string, { gen: string; en: string }> = {
      час: { gen: 'ча́су', en: 'time' },
      робота: { gen: 'робо́ти', en: 'work' },
      київ: { gen: 'Ки́єва', en: 'Kyiv' },
      львів: { gen: 'Льво́ва', en: 'Lviv' },
      одеса: { gen: 'Оде́си', en: 'Odesa' },
      вокзал: { gen: 'вокза́лу', en: 'the station' },
      гроші: { gen: 'гро́шей', en: 'money' },
    };
    const target = genMap[rawNoun] || { gen: `${rawNoun}у`, en: rawNoun };
    const leadSpace = genAfterPrep[0].startsWith(' ') ? ' ' : '';
    const corrected = normalized.replace(genAfterPrep[0], `${leadSpace}${trigger} ${target.gen}`);
    const mod = getVerifiedCourseModule('A1.4');
    return {
      utteranceId,
      status: 'incorrect-grammar',
      severity: 'meaning-changing',
      category: 'cases',
      categoryLabelEn: `Genitive Case (Родови́й відмі́нок) After «${trigger}»`,
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: `...${trigger.toLowerCase() === 'до' ? 'to' : 'of'} ${target.en}.`,
      whatChangedSummary: `Changed «${rawNoun}» to the Genitive case «${target.gen}» after «${trigger}».`,
      grammarRuleSummary: `In Ukrainian, negation with «нема́є» (there is no), quantity words like «бага́то» (many/much), and the directional preposition «до» (to/toward) always require the Genitive case (Родови́й відмі́нок: Кого́? Чого́?).`,
      additionalExampleUk: 'Сього́дні у ме́не нема́є ві́льного ча́су, бо я ї́ду до Ки́єва.',
      additionalExampleEn: 'Today I do not have free time because I am traveling to Kyiv.',
      practicePromptEn: `Say the sentence using the Genitive form «${target.gen}»:`,
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple: `After «${trigger}», change «${rawNoun}» to the Genitive form «${target.gen}».`,
        detailed: `The Genitive case (Родови́й відмі́нок) marks absence («нема́є ча́су»), quantity («бага́то робо́ти»), and movement toward a goal («до Льво́ва, до вокза́лу»).`,
        advanced: {
          linguisticSummary:
            'Genitive of negation («нема́є + Genitive»), partitive/quantifier Genitive («бага́то + Genitive»), and allative prepositional governance («до + Genitive») are core syntactic triggers of the Ukrainian Genitive.',
          morphologicalNote: `Nominative «${rawNoun}» → Genitive «${target.gen}».`,
          exceptionsNote:
            'Indeclinable loanwords like «метро́» or «таксі́» keep the same form in all cases («до метро́»).',
          tableTitle: `Genitive Case Trigger for «${rawNoun}»`,
          tableRows: [
            { formLabel: 'Nominative (Хто? Що?)', ukrainianForm: rawNoun, englishNote: 'Dictionary form' },
            { formLabel: `Genitive after «${trigger}»`, ukrainianForm: `${trigger} ${target.gen}`, englishNote: 'Required Genitive form', isTargetForm: true },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
          inspectWordUk: rawNoun,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: corrected,
        casualNoteEn: 'Natural everyday Ukrainian.',
        neutralUk: corrected,
        neutralNoteEn: 'Standard grammatical Ukrainian.',
        formalUk: corrected,
        formalNoteEn: 'Appropriate in formal contexts as well.',
        colloquialUk: corrected.replace(/немає/i, 'нема́'),
        colloquialNoteEn: 'Shortened «нема́» is very common in spoken Ukrainian.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'apply-case',
        titleEn: `Apply the Genitive Case After «${trigger}»`,
        promptEn: `Repeat the corrected sentence with «${trigger} ${target.gen}»:`,
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [corrected.replace(/\u0301/g, '')],
        hintEn: `Use «${target.gen}» after «${trigger}».`,
        grammarFocus: 'Genitive Case',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 7. Check for Formality Register Mixing (mixing «ти» and «Ви» in the same turn)
  const hasTy = /(?:^|[\s,.;:!?])(ти|тебе|тобі|тобою|твій|твоя|твоє|твої)(?=$|[\s,.;:!?])/i.test(normalized);
  const hasVy = /(?:^|[\s,.;:!?])(ви|вас|вам|вами|ваш|ваша|ваше|ваші|підкажіть|скажіть|принесіть)(?=$|[\s,.;:!?])/i.test(normalized);
  if (hasTy && hasVy) {
    const preferFormal = context?.formalityPreference === 'formal';
    const corrected = preferFormal
      ? 'Добро́го дня! Як Ва́ші спра́ви? Чи Ви за́раз ві́льні?'
      : 'Приві́т! Як твої́ спра́ви? Ти за́раз ві́льний?';
    const mod = getVerifiedCourseModule('A0.3');
    return {
      utteranceId,
      status: 'incorrect-grammar',
      severity: 'moderate',
      category: 'formality',
      categoryLabelEn: 'Formality Register Consistency («ти» vs. «Ви»)',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: 'Hello! How are things with you? Are you free right now?',
      whatChangedSummary:
        'Aligned the pronouns so the sentence consistently uses either informal «ти» or polite formal «Ви» instead of mixing both.',
      grammarRuleSummary:
        'In Ukrainian, address a friend or peer consistently with singular «ти» (твій, у те́бе), and address a stranger, elder, or professional contact consistently with plural/polite «Ви» (Ваш, у Вас, plural verb endings «-те»).',
      additionalExampleUk: 'Informal: Як у те́бе спра́ви? · Formal: Як у Вас спра́ви?',
      additionalExampleEn: 'Informal: How are things with you? · Formal: How are things with you (polite)?',
      practicePromptEn: 'Try saying the sentence with consistent formality:',
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: false,
      explanationLevels: {
        simple:
          'Your sentence mixed informal «ти» and formal «Ви». Stick to one register for the same person!',
        detailed:
          'When using polite «Ви» for one person, verbs take plural endings («Ви зна́єте», «Скажі́ть, будь ла́ска») and possessive pronouns match «Ваш / Ва́ша / Ва́ші». When using «ти», use singular verbs («ти зна́єш») and «твій / твоя́ / твої́».',
        advanced: {
          linguisticSummary:
            'Ukrainian T–V pronominal distinction requires strict morphosyntactic agreement across finite verbs, imperatives, and possessive determiners within the discourse turn.',
          morphologicalNote: 'ти (2sg) ↔ Ви (2pl polite honorific).',
          exceptionsNote:
            'In plural predicate adjectives addressing a single person politely with «Ви», standard Ukrainian often uses plural («Чи Ви ві́льні?») or gender-matched singular.',
          tableTitle: 'Informal «ти» vs. Polite Formal «Ви»',
          tableRows: [
            { formLabel: 'Pronoun (Genitive / Dative)', ukrainianForm: 'у те́бе / тобі́ ↔ у Вас / Вам', englishNote: 'Informal vs. Formal', isTargetForm: true },
            { formLabel: 'Possessive', ukrainianForm: 'твої́ спра́ви ↔ Ва́ші спра́ви', englishNote: 'your things' },
            { formLabel: 'Verb / Imperative', ukrainianForm: 'скажи́ ↔ скажі́ть', englishNote: 'tell me' },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: 'Приві́т! Як твої́ спра́ви? Ти ві́льний?',
        casualNoteEn: 'Consistent informal «ти» register.',
        neutralUk: 'Віта́ю! Як у те́бе спра́ви?',
        neutralNoteEn: 'Friendly everyday register.',
        formalUk: 'Добро́го дня! Як Ва́ші спра́ви? Чи ма́єте Ви хви́линку?',
        formalNoteEn: 'Consistent polite «Ви» register.',
        colloquialUk: 'Приві́т! Як ти? Ма́єш час?',
        colloquialNoteEn: 'Natural spoken Ukrainian among friends.',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'repeat-corrected',
        titleEn: 'Keep Register Consistent («ти» or «Ви»)',
        promptEn: 'Say the sentence with a consistent pronoun register:',
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [
          'Привіт! Як твої справи? Ти зараз вільний?',
          'Доброго дня! Як Ваші справи? Чи Ви зараз вільні?',
        ],
        hintEn: 'Use either «твої́ ... ти» or «Ва́ші ... Ви».',
        grammarFocus: 'Formality Agreement (ти vs Ви)',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 8. Check for Calque / Correct-but-Unnatural phrasing (e.g., "Я роблю сніданок" -> "Я готую сніданок" or "Я маю питання" -> "У мене є запитання")
  if (/(?:^|\s)(роблю|робиш|робить)\s+(сніданок|обід|вечерю|їжу|каву)(?=$|[\s,.;:!?])/i.test(normalized)) {
    const corrected = normalized.replace(
      /(^|\s)(роблю|робиш|робить)(?=\s)/i,
      (_full, sp, m) => `${sp}${m.toLowerCase() === 'роблю' ? 'готу́ю' : m.toLowerCase() === 'робиш' ? 'готу́єш' : 'готу́є'}`
    );
    const mod = getVerifiedCourseModule('A1.3');
    return {
      utteranceId,
      status: 'correct-but-unnatural',
      severity: 'minor-style',
      category: 'vocabulary',
      categoryLabelEn: 'Natural Ukrainian Collocation (Словосполу́чення)',
      youSaidUk: trimmed,
      correctUkrainian: corrected,
      englishMeaning: 'I am making (preparing) breakfast/food.',
      whatChangedSummary:
        'Your grammar is understandable, but native Ukrainian speakers say «готува́ти сніда́нок / ка́ву» (to prepare breakfast/coffee) rather than the literal English translation «роби́ти» (to make/do).',
      grammarRuleSummary:
        'For meals, drinks, and dishes, use the verb «готува́ти» (imperfective) / «приготува́ти» (perfective) instead of «роби́ти».',
      additionalExampleUk: 'Щора́нку я готу́ю смачни́й сніда́нок і зава́рюю ка́ву.',
      additionalExampleEn: 'Every morning I prepare a tasty breakfast and brew coffee.',
      practicePromptEn: 'Try saying it with the natural verb «готу́ю»:',
      practiceTargetUk: corrected.replace(/\u0301/g, ''),
      isEuphonyOnly: false,
      isColloquialAcceptable: true,
      explanationLevels: {
        simple:
          'Your sentence makes sense! To sound like a native speaker, use «готу́ю» (prepare/cook) instead of «роблю́» (do/make) with food.',
        detailed:
          'English uses "make breakfast / make coffee", which learners often translate word-for-word with «роби́ти». In natural Ukrainian, meals take «готува́ти» and hot drinks take «готува́ти» or «зава́рювати».',
        advanced: {
          linguisticSummary:
            'Lexical collocation refinement: avoid English calques with «роби́ти» when the object is a culinary noun.',
          morphologicalNote: 'готува́ти → я готу́ю, ти готу́єш, ми готу́ємо.',
          exceptionsNote:
            'In casual speech «зроби́ти ка́ву / бутербро́д» is occasionally heard, so this is marked as a natural phrasing upgrade rather than a grammar error.',
          tableTitle: 'Natural Ukrainian Verb Collocations',
          tableRows: [
            { formLabel: 'Meals & Dishes', ukrainianForm: 'готува́ти сніда́нок / вече́рю', englishNote: 'to make breakfast / dinner', isTargetForm: true },
            { formLabel: 'Coffee & Tea', ukrainianForm: 'вари́ти ка́ву / зава́рювати чай', englishNote: 'to brew coffee / tea' },
            { formLabel: 'Photos', ukrainianForm: 'роби́ти фотогра́фії / фотографува́ти', englishNote: 'to take photos' },
          ],
          relatedCourseModuleId: mod.id,
          relatedCourseModuleTitle: mod.title,
          inspectWordUk: 'готувати',
        },
      },
      naturalAlternatives: {
        originalSentenceUk: trimmed,
        correctedGrammarUk: corrected,
        casualUk: corrected,
        casualNoteEn: 'Natural everyday phrasing.',
        neutralUk: corrected,
        neutralNoteEn: 'Standard idiomatic Ukrainian.',
        formalUk: 'За́раз я готу́ю ра́нішній сніда́нок.',
        formalNoteEn: 'Slightly more elevated phrasing.',
        colloquialUk: 'За́раз швиденько приготу́ю сніда́нок.',
        colloquialNoteEn: 'Warm spoken Ukrainian with diminutive adverb «швиденько».',
      },
      tutorExercise: {
        id: `ex_${utteranceId}`,
        exerciseType: 'repeat-corrected',
        titleEn: 'Use the Natural Collocation «готу́ю»',
        promptEn: 'Say the sentence using «готу́ю»:',
        promptUk: corrected,
        expectedAnswerUk: corrected.replace(/\u0301/g, ''),
        acceptedVariantsUk: [corrected.replace(/\u0301/g, '')],
        hintEn: 'Replace «роблю́» with «готу́ю».',
        grammarFocus: 'Natural Verb Collocations',
      },
      keyVocabularyWords: vocabList,
    };
  }

  // 9. Check for Acceptable Colloquial Ukrainian (e.g. "О, класно! Давай зустрінемось завтра.")
  for (const colloq of COLLOQUIAL_ACCEPTABLE_PATTERNS) {
    if (colloq.regex.test(lower)) {
      const mod = getVerifiedCourseModule('C1.1');
      return {
        utteranceId,
        status: 'acceptable-colloquial',
        severity: 'none',
        category: 'vocabulary',
        categoryLabelEn: 'Authentic Colloquial Ukrainian (Жива́ розмо́вна мо́ва)',
        youSaidUk: trimmed,
        correctUkrainian: trimmed,
        englishMeaning: colloq.meaningEn,
        whatChangedSummary:
          'Nothing needs to be fixed! Your sentence uses authentic, natural spoken Ukrainian.',
        grammarRuleSummary: colloq.noteEn,
        additionalExampleUk: 'О, су́пер! Тоді́ домо́вились на за́втра!',
        additionalExampleEn: 'Oh, super! Then we have a deal for tomorrow!',
        practicePromptEn: 'You can also try the formal equivalent if speaking in a business setting:',
        practiceTargetUk: 'Чудово! Дава́йте зустрі́немося за́втра.',
        isEuphonyOnly: false,
        isColloquialAcceptable: true,
        explanationLevels: {
          simple:
            'Great job! This is natural, everyday spoken Ukrainian. No correction needed.',
          detailed: colloq.noteEn,
          advanced: {
            linguisticSummary:
              'Postfix «-сь» (shortened allomorph of reflexive «-ся» after vowels) and expressive discourse particles («О, кла́сно!») are standard features of colloquial Ukrainian.',
            morphologicalNote: 'зустрі́немося ↔ зустрі́немось (both valid in standard and spoken Ukrainian).',
            exceptionsNote: 'In formal academic or legal writing, the full ending «-ся» is preferred.',
            tableTitle: 'Register Comparison (Colloquial vs. Formal)',
            tableRows: [
              { formLabel: 'Colloquial / Friendly', ukrainianForm: trimmed, englishNote: 'Your natural spoken sentence', isTargetForm: true },
              { formLabel: 'Neutral Standard', ukrainianForm: 'Чудо́во! Дава́й зустрі́немося за́втра.', englishNote: 'Neutral standard phrasing' },
              { formLabel: 'Formal / Business', ukrainianForm: 'Чудо́во! Пропону́ю зустрі́тися за́втра.', englishNote: 'Formal professional phrasing' },
            ],
            relatedCourseModuleId: mod.id,
            relatedCourseModuleTitle: mod.title,
          },
        },
        naturalAlternatives: {
          originalSentenceUk: trimmed,
          correctedGrammarUk: trimmed,
          casualUk: trimmed,
          casualNoteEn: 'Your phrasing is already spot-on casual Ukrainian!',
          neutralUk: 'Чудо́во! Дава́й зустрі́немося за́втра.',
          neutralNoteEn: 'Neutral standard phrasing with «чудо́во» and «-ся».',
          formalUk: 'Чудо́во! Пропону́ю зустрі́тися за́втра.',
          formalNoteEn: 'Polite formal phrasing for colleagues or clients.',
          colloquialUk: 'О, кла́сно! Тоді́ спи́шемось і поба́чимось за́втра!',
          colloquialNoteEn: 'Very natural everyday idiom among close friends.',
        },
        tutorExercise: {
          id: `ex_${utteranceId}`,
          exerciseType: 'expand-sentence',
          titleEn: 'Add Time & Place to Your Plan',
          promptEn: 'Expand your sentence by adding where or at what time you want to meet:',
          promptUk: 'О, кла́сно! Дава́й зустрі́немось за́втра о дру́гій годи́ні в кав’я́рні.',
          expectedAnswerUk: 'О, класно! Давай зустрінемось завтра о другій годині в кав’ярні.',
          acceptedVariantsUk: [
            'Давай зустрінемось завтра в кав’ярні',
            'О, класно! Давай зустрінемось завтра.',
          ],
          hintEn: 'Add «о дру́гій годи́ні» (at 2 o’clock) or «у кав’я́рні» (at a coffeehouse).',
          grammarFocus: 'Time & Location Expressions',
        },
        keyVocabularyWords: vocabList,
      };
    }
  }

  // 10. Default: Grammatically correct and natural Ukrainian!
  // Still provide rich 3-level grammar breakdown, natural register variants, and a tutor expansion exercise.
  const mod = getVerifiedCourseModule(
    context?.scenarioId ? getScenarioById(context.scenarioId).relatedCourseModuleId : 'A1.2'
  );
  return {
    utteranceId,
    status: 'correct-and-natural',
    severity: 'none',
    category: 'sentence-structure',
    categoryLabelEn: 'Grammatically Correct & Natural Ukrainian',
    youSaidUk: trimmed,
    correctUkrainian: trimmed,
    englishMeaning: inferSimpleEnglishMeaning(trimmed),
    whatChangedSummary:
      'Well said! Your Ukrainian sentence is grammatically accurate and sounds natural.',
    grammarRuleSummary:
      'Your word order, verb agreement, and case endings fit this conversational context cleanly.',
    additionalExampleUk: 'Мені́ ду́же приє́мно спілкува́тися з тобо́ю украї́нською мо́вою!',
    additionalExampleEn: 'It is very pleasant for me to converse with you in Ukrainian!',
    practicePromptEn: 'Want to stretch your skills? Try expanding your thought with «тому́ що» (because):',
    practiceTargetUk: `${trimmed.replace(/[.!?]+$/, '')}, тому́ що це ду́же ціка́во.`,
    isEuphonyOnly: false,
    isColloquialAcceptable: true,
    explanationLevels: {
      simple:
        'Your Ukrainian sentence is well-formed and natural! Check out the "Say It More Naturally" tab if you want to see casual, formal, and colloquial variations.',
      detailed:
        'Your verb forms and noun endings agree properly. In Ukrainian conversation, you can also connect your clauses with «тому́ що» (because), «а та́кож» (and also), or «до ре́чі» (by the way) to build longer turns.',
      advanced: {
        linguisticSummary:
          'Syntactically well-formed Ukrainian clause with appropriate lexical selection and register alignment.',
        morphologicalNote:
          'Click any Ukrainian word in the transcript to open its full 7-Case Grammar Inspector table.',
        exceptionsNote:
          'Ukrainian flexible word order (SVO baseline) allows placing known topic information first and new emphasis (rheme) at the end of the clause.',
        tableTitle: 'Discourse Connectors to Expand Your Turn',
        tableRows: [
          { formLabel: 'Giving a reason', ukrainianForm: 'тому́ що / бо', englishNote: 'because / since', isTargetForm: true },
          { formLabel: 'Adding a thought', ukrainianForm: 'до ре́чі / крім то́го', englishNote: 'by the way / besides' },
          { formLabel: 'Expressing opinion', ukrainianForm: 'на мою́ ду́мку / як на ме́не', englishNote: 'in my opinion / as for me' },
        ],
        relatedCourseModuleId: mod.id,
        relatedCourseModuleTitle: mod.title,
      },
    },
    naturalAlternatives: {
      originalSentenceUk: trimmed,
      correctedGrammarUk: trimmed,
      casualUk: `Слу́хай, ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`,
      casualNoteEn: 'Adds the friendly conversational opener «Слу́хай» ("Listen / Hey").',
      neutralUk: trimmed,
      neutralNoteEn: 'Your sentence is already clear, natural standard Ukrainian.',
      formalUk: `Дозво́льте зазначити: ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`,
      formalNoteEn: 'Polite formal framing suitable for professional settings.',
      colloquialUk: `Та взагалі́, ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`,
      colloquialNoteEn: 'Adds the natural spoken particle «Та взагалі́» ("Honestly / In general").',
    },
    tutorExercise: {
      id: `ex_${utteranceId}`,
      exerciseType: 'expand-sentence',
      titleEn: 'Expand Your Sentence with a Reason («тому́ що»)',
      promptEn: 'Say your sentence again and add a short reason using «тому́ що»:',
      promptUk: `${trimmed.replace(/[.!?]+$/, '')}, тому́ що мені́ це подо́бається.`,
      expectedAnswerUk: `${trimmed.replace(/[.!?]+$/, '')}, тому що мені це подобається.`,
      acceptedVariantsUk: [trimmed.replace(/\u0301/g, '')],
      hintEn: 'Connect a second clause using «тому́ що...» (because...).',
      grammarFocus: 'Connecting Ideas (тому́ що)',
    },
    keyVocabularyWords: vocabList,
  };
}

function inferSimpleEnglishMeaning(textUk: string): string {
  const lower = textUk.toLowerCase().replace(/\u0301/g, '');
  if (lower.includes('привіт') && lower.includes('звати')) {
    return 'Hi! My name is... (friendly self-introduction).';
  }
  if (lower.includes('все добре') || lower.includes('все чудово')) {
    return 'Everything is going well / great with me!';
  }
  if (lower.includes('каву') || lower.includes('сирник') || lower.includes('борщ')) {
    return 'Ordering food or drinks in Ukrainian.';
  }
  if (lower.includes('живу') || lower.includes('мешкаю')) {
    return 'Describing where I live.';
  }
  if (lower.includes('вивчаю українську')) {
    return 'I am studying the Ukrainian language.';
  }
  if (lower.includes('подобається')) {
    return 'Expressing what I like / enjoy doing.';
  }
  return 'Clear Ukrainian conversational statement.';
}

/**
 * Attaches a completed `GrammarCorrectionCardData` to the exact matching `ConversationTurn`
 * by `utteranceId`. Never overwrites or attaches to a different turn.
 */
export function attachGrammarAnalysisToTurn(
  turns: ConversationTurn[],
  analysis: GrammarCorrectionCardData
): ConversationTurn[] {
  return turns.map((turn) => {
    if (turn.utteranceId !== analysis.utteranceId) {
      return turn;
    }
    return {
      ...turn,
      grammarAnalysis: analysis,
    };
  });
}

// ============================================================================
// 3. SYSTEM PROMPT BUILDER & CONVERSATION RESPONSE GENERATOR
// ============================================================================

export function buildSystemInstructionForSession(params: {
  conversationMode: ConversationMode;
  correctionIntensity: CorrectionIntensity;
  cefrLevel: ConvoCefrLevel;
  formalityPreference: FormalityPreference;
  scenarioId: string;
}): string {
  const modeCfg = CONVERSATION_MODES[params.conversationMode];
  const intCfg = CORRECTION_INTENSITY_OPTIONS[params.correctionIntensity];
  const cefrCfg = CEFR_LEVEL_CONFIGS[params.cefrLevel];
  const scenario = getScenarioById(params.scenarioId);

  const effectiveFormality =
    params.formalityPreference === 'auto'
      ? scenario.defaultFormality === 'formal'
        ? 'formal (Ви)'
        : 'informal (ти)'
      : params.formalityPreference === 'formal'
      ? 'formal (Ви)'
      : 'informal (ти)';

  return [
    `You are LangoUA's AI Ukrainian language partner and tutor. Always be transparent that you are an AI partner/tutor (never claim to be a human).`,
    `ACTIVE CONVERSATION MODE: ${modeCfg.titleEn} (${modeCfg.id}). ${modeCfg.aiPersonaSummary}`,
    params.conversationMode === 'tutor'
      ? `Follow the 8-step tutor sequence: introduce/model a structure, demonstrate a Ukrainian example, invite the learner to use it, evaluate, correct per the correction setting, offer a brief retry when helpful, reinforce, and continue.`
      : `Prioritize warm, natural conversational flow, authentic Ukrainian expressions, and engaging follow-up questions.`,
    `INDEPENDENT GRAMMAR CORRECTION SETTING: ${intCfg.fullLabel} (${intCfg.id}).`,
    params.correctionIntensity === 'off'
      ? `CRITICAL: Corrections During Conversation is set to OFF. Do NOT give unsolicited grammar corrections during your reply. Simply respond naturally to the learner's message and keep the dialogue moving.`
      : params.correctionIntensity === 'discreet'
      ? `CRITICAL: Corrections During Conversation is set to DISCREET. Keep your spoken/written reply natural and conversational without lecturing; the UI badge will show the detailed grammar card silently.`
      : params.correctionIntensity === 'gentle'
      ? `Corrections During Conversation is set to GENTLE. Only mention a correction briefly if the learner's mistake changes the meaning or is confusing; otherwise just continue naturally.`
      : params.correctionIntensity === 'balanced'
      ? `Corrections During Conversation is set to BALANCED. Briefly model the corrected Ukrainian sentence when the learner makes a grammar or phrasing mistake, give a 1-sentence reason, and continue the conversation.`
      : `Corrections During Conversation is set to INTENSIVE. Provide a clear corrected Ukrainian sentence, explain the case/verb rule briefly, and invite the learner to repeat or apply the corrected form before moving on.`,
    `CEFR LEVEL: ${cefrCfg.displayLabel} (${cefrCfg.level}). Vocabulary scope: ${cefrCfg.vocabularyScope}. Grammar scope: ${cefrCfg.grammarScope}. Keep replies to at most ${cefrCfg.maxAiSentencesPerTurn} sentences.`,
    `FORMALITY REGISTER: Address the learner using ${effectiveFormality}.`,
    `ACTIVE SCENARIO (#${scenario.number}): "${scenario.titleEn}" (${scenario.titleUk}). Your role: ${scenario.aiRoleEn}. Learning objectives: ${scenario.learningObjectives.join('; ')}.`,
    `Always respond in natural Ukrainian appropriate to ${cefrCfg.level}. Include stress marks where helpful for learners.`,
  ].join('\n');
}

/**
 * Generates an opening turn when starting a session in either Friendly Partner or Structured Tutor mode.
 */
export function createOpeningTurnForSession(
  state: AIConversationState
): ConversationTurn {
  const scenario = getScenarioById(state.scenarioId);
  const isTutor = state.conversationMode === 'tutor';

  let ukText = '';
  let enText = '';

  if (isTutor) {
    ukText = scenario.tutorIntroUk;
    enText = scenario.tutorIntroEn;
  } else if (state.cefrLevel === 'A0' || state.cefrLevel === 'A1') {
    ukText = scenario.openingByLevel.beginnerUk;
    enText = scenario.openingByLevel.beginnerEn;
  } else if (state.cefrLevel === 'A2' || state.cefrLevel === 'B1') {
    ukText = scenario.openingByLevel.intermediateUk;
    enText = scenario.openingByLevel.intermediateEn;
  } else {
    ukText = scenario.openingByLevel.advancedUk;
    enText = scenario.openingByLevel.advancedEn;
  }

  return {
    id: `turn_ai_open_${Date.now()}`,
    utteranceId: `utt_ai_open_${Date.now()}`,
    speaker: 'ai',
    ukrainianText: ukText,
    englishTranslation: enText,
    timestamp: Date.now(),
    modeAtTurn: state.conversationMode,
    intensityAtTurn: state.correctionIntensity,
    cefrAtTurn: state.cefrLevel,
    showTranslation: state.translationVisibility === 'always',
  };
}

/**
 * Generates a realistic, mode- and intensity-aware AI reply locally (used when offline
 * or as instant fallback if `/api/convo/turn` is unreachable).
 * Strictly honors all 10 combinations of `conversationMode` × `correctionIntensity`.
 */
export function generateLocalConversationalReply(params: {
  learnerTextUk: string;
  analysis: GrammarCorrectionCardData;
  state: AIConversationState;
}): {
  replyUk: string;
  replyEn: string;
  spokenFeedbackUk?: string;
  spokenFeedbackEn?: string;
  pronunciationTipId?: string;
} {
  const { analysis, state } = params;
  const scenario = getScenarioById(state.scenarioId);
  const surface = shouldSurfaceLiveCorrection(
    analysis,
    state.correctionIntensity,
    state.recurringErrorCategories
  );

  let spokenFeedbackUk: string | undefined;
  let spokenFeedbackEn: string | undefined;

  if (
    surface.speakCorrectionAloud &&
    (analysis.status === 'incorrect-grammar' ||
      analysis.status === 'correct-but-unnatural')
  ) {
    if (state.correctionIntensity === 'gentle') {
      spokenFeedbackUk = `До ре́чі, природні́ше сказа́ти: «${analysis.correctUkrainian}».`;
      spokenFeedbackEn = `By the way, it sounds more natural to say: "${analysis.correctUkrainian}".`;
    } else if (state.correctionIntensity === 'balanced') {
      spokenFeedbackUk = `Зверни́ ува́гу: правильні́ше сказа́ти «${analysis.correctUkrainian}» (${analysis.categoryLabelEn}).`;
      spokenFeedbackEn = `Note: it is more accurate to say "${analysis.correctUkrainian}" (${analysis.whatChangedSummary}).`;
    } else if (state.correctionIntensity === 'intensive') {
      spokenFeedbackUk = `Розбері́мо грама́тику: ти сказа́в «${analysis.youSaidUk}», а правильна фо́рма — «${analysis.correctUkrainian}». Спро́буй повтори́ти це ре́чення вго́лос!`;
      spokenFeedbackEn = `Let’s review the grammar: you said "${analysis.youSaidUk}", and the correct form is "${analysis.correctUkrainian}". ${analysis.whatChangedSummary} Try repeating the corrected sentence!`;
    }
  }

  // Pick a contextual follow-up based on mode, scenario, and turn index
  const learnerTurnCount = state.turns.filter((t) => t.speaker === 'learner').length;
  const phraseIdx = learnerTurnCount % scenario.keyPhrases.length;
  const nextPhrase = scenario.keyPhrases[phraseIdx] || scenario.keyPhrases[0];

  let replyUk = '';
  let replyEn = '';

  if (state.conversationMode === 'tutor') {
    if (
      surface.speakCorrectionAloud &&
      analysis.status === 'incorrect-grammar' &&
      (state.correctionIntensity === 'balanced' ||
        state.correctionIntensity === 'intensive')
    ) {
      replyUk = `${spokenFeedbackUk} А тепе́р руха́ймося да́лі за те́мою «${scenario.titleUk}»: як ти ска́жеш украї́нською — «${nextPhrase.en}»? (Підка́зка: «${nextPhrase.uk}»)`;
      replyEn = `${spokenFeedbackEn} Now let’s continue with "${scenario.titleEn}": how would you say in Ukrainian — "${nextPhrase.en}"? (Model: "${nextPhrase.uk}")`;
    } else {
      replyUk = `Чудо́ва відпові́дь! Продо́вжуємо наш уро́к на те́му «${scenario.titleUk}». Зверни́ ува́гу на кори́сний ви́слів: «${nextPhrase.uk}» (${nextPhrase.grammarNote}). Як ти використа́єш його́ у своє́му ре́ченні?`;
      replyEn = `Great response! Let’s continue our lesson on "${scenario.titleEn}". Notice the useful expression: "${nextPhrase.uk}" (${nextPhrase.en} — ${nextPhrase.grammarNote}). How would you use it in your own sentence?`;
    }
  } else {
    // Friendly Conversation Partner
    const prefixUk = spokenFeedbackUk ? `${spokenFeedbackUk} ` : '';
    const prefixEn = spokenFeedbackEn ? `${spokenFeedbackEn} ` : '';

    if (scenario.id === 'ordering-coffee-and-food') {
      replyUk = `${prefixUk}Чудо́вий ви́бір! За́раз приготу́ю. Чи бажа́єте ще щось до ка́ви — напри́клад, сві́жий круаса́н або́ льві́вський си́рник?`;
      replyEn = `${prefixEn}Great choice! I will prepare it right away. Would you like anything else with your coffee — for example, a fresh croissant or Lviv cheesecake?`;
    } else if (scenario.id === 'meeting-someone-new' || scenario.id === 'introducing-yourself-background') {
      replyUk = `${prefixUk}Ду́же приє́мно! Мені́ та́кож ду́же ціка́во спілкува́тися з тобо́ю. А що тобі́ найбільше подо́бається у ви́вченні украї́нської мо́ви?`;
      replyEn = `${prefixEn}Very nice to meet you! I really enjoy chatting with you too. What do you enjoy most about learning the Ukrainian language?`;
    } else {
      replyUk = `${prefixUk}Ціка́ва ду́мка! До ре́чі, ми часто ка́жемо: «${nextPhrase.uk}». А що ти ду́маєш про це?`;
      replyEn = `${prefixEn}Interesting thought! By the way, we often say: "${nextPhrase.uk}" (${nextPhrase.en}). And what do you think about that?`;
    }
  }

  // Detect relevant pronunciation tip
  let pronunciationTipId: string | undefined;
  if (/[гґ]/i.test(params.learnerTextUk)) {
    pronunciationTipId = 'h-vs-g';
  } else if (/[іїй]/i.test(params.learnerTextUk)) {
    pronunciationTipId = 'yi-and-y';
  } else if (/ться|ь/i.test(params.learnerTextUk)) {
    pronunciationTipId = 'soft-sign-palatalization';
  } else {
    pronunciationTipId = PRONUNCIATION_GUIDES[0].id;
  }

  return {
    replyUk,
    replyEn,
    spokenFeedbackUk,
    spokenFeedbackEn,
    pronunciationTipId,
  };
}

// ============================================================================
// 4. MANUAL LEARNER HELP HANDLER (PART 15 — WORKS EVEN WHEN CORRECTIONS = OFF)
// ============================================================================

export function executeManualHelpAction(
  actionId: ManualHelpActionId,
  state: AIConversationState,
  customQueryEn?: string
): {
  titleEn: string;
  responseUk: string;
  responseEn: string;
  updatedTurns?: ConversationTurn[];
  openTab?: AIConversationState['activeRightPanelTab'];
  activeUtteranceId?: string | null;
} {
  const scenario = getScenarioById(state.scenarioId);
  const lastAiTurn = [...state.turns].reverse().find((t) => t.speaker === 'ai');
  const lastLearnerTurn = [...state.turns]
    .reverse()
    .find((t) => t.speaker === 'learner');

  switch (actionId) {
    case 'translate': {
      if (!lastAiTurn) {
        return {
          titleEn: 'Translate Last Message',
          responseUk: scenario.openingByLevel.beginnerUk,
          responseEn: scenario.openingByLevel.beginnerEn,
        };
      }
      const updatedTurns = state.turns.map((t) =>
        t.id === lastAiTurn.id ? { ...t, showTranslation: true } : t
      );
      return {
        titleEn: 'English Translation',
        responseUk: lastAiTurn.ukrainianText,
        responseEn: lastAiTurn.englishTranslation,
        updatedTurns,
      };
    }

    case 'explain-english': {
      const targetUk = lastAiTurn?.ukrainianText || scenario.openingByLevel.beginnerUk;
      const targetEn = lastAiTurn?.englishTranslation || scenario.openingByLevel.beginnerEn;
      return {
        titleEn: 'Grammar & Vocabulary Explained in English',
        responseUk: targetUk,
        responseEn: `Meaning: "${targetEn}" — Key Scenario Focus: ${scenario.learningObjectives[0]}. Key model phrase: "${scenario.keyPhrases[0].uk}" (${scenario.keyPhrases[0].grammarNote}).`,
      };
    }

    case 'repeat': {
      const targetUk = lastAiTurn?.ukrainianText || scenario.openingByLevel.beginnerUk;
      return {
        titleEn: 'Replaying Ukrainian Audio',
        responseUk: targetUk,
        responseEn: 'Listening again at normal conversational speed (1.0×).',
      };
    }

    case 'slower': {
      const targetUk = lastAiTurn?.ukrainianText || scenario.openingByLevel.beginnerUk;
      return {
        titleEn: 'Speaking More Slowly (0.82×)',
        responseUk: targetUk,
        responseEn: 'Replaying clearly and slowly so you can hear every syllable and stress mark.',
      };
    }

    case 'hint': {
      const starter =
        scenario.suggestedLearnerStarters[0] || {
          uk: 'У ме́не все до́бре, дя́кую!',
          en: 'Everything is good with me, thank you!',
        };
      return {
        titleEn: 'Suggested Ukrainian Response Starter',
        responseUk: starter.uk,
        responseEn: `Try saying: "${starter.uk}" (${starter.en})`,
      };
    }

    case 'how-to-say': {
      const q = (customQueryEn || '').trim().toLowerCase();
      let ukSuggestion = scenario.keyPhrases[0].uk;
      let enMeaning = scenario.keyPhrases[0].en;
      if (q.includes('coffee') || q.includes('order')) {
        ukSuggestion = 'Мо́жна мені́, будь ла́ска, ка́ву з молоко́м?';
        enMeaning = 'May I please have a coffee with milk?';
      } else if (q.includes('live') || q.includes('from')) {
        ukSuggestion = 'Я з Амери́ки, а за́раз живу́ у Льво́ві.';
        enMeaning = 'I am from America, and right now I live in Lviv.';
      } else if (q.includes('help') || q.includes('slow')) {
        ukSuggestion = 'Говорі́ть, будь ла́ска, тро́хи повільні́ше.';
        enMeaning = 'Please speak a little more slowly.';
      } else if (q.includes('name') || q.includes('meet')) {
        ukSuggestion = 'Приві́т! Мене́ зва́ти Алекс, ду́же приє́мно познайо́митися!';
        enMeaning = 'Hi! My name is Alex, very nice to meet you!';
      }
      return {
        titleEn: 'How to Say It in Natural Ukrainian',
        responseUk: ukSuggestion,
        responseEn: `${enMeaning} — Tap the speaker icon to hear the pronunciation or click "Use Phrase" to say it.`,
      };
    }

    case 'correct-last':
    case 'explain-grammar': {
      if (!lastLearnerTurn) {
        return {
          titleEn: 'On-Demand Grammar Check',
          responseUk: 'Напиші́ть або́ скажі́ть ре́чення украї́нською!',
          responseEn:
            'Speak or type a Ukrainian sentence first, and I will analyze its grammar on demand (even when Corrections During Conversation is set to Off).',
        };
      }
      const analysis =
        lastLearnerTurn.grammarAnalysis ||
        analyzeUkrainianUtterance(
          lastLearnerTurn.ukrainianText,
          lastLearnerTurn.utteranceId,
          {
            cefrLevel: state.cefrLevel,
            formalityPreference: state.formalityPreference,
            scenarioId: state.scenarioId,
          }
        );
      const updatedTurns = attachGrammarAnalysisToTurn(state.turns, analysis);
      return {
        titleEn:
          actionId === 'correct-last'
            ? 'On-Demand Sentence Correction'
            : 'Detailed Grammar Explanation',
        responseUk: analysis.correctUkrainian,
        responseEn: `${analysis.whatChangedSummary} ${analysis.grammarRuleSummary}`,
        updatedTurns,
        openTab: 'feedback',
        activeUtteranceId: lastLearnerTurn.utteranceId,
      };
    }

    case 'more-natural': {
      if (!lastLearnerTurn) {
        return {
          titleEn: 'Say It More Naturally',
          responseUk: scenario.keyPhrases[0].uk,
          responseEn: `Model natural expression: "${scenario.keyPhrases[0].uk}" (${scenario.keyPhrases[0].en})`,
          openTab: 'alternatives',
        };
      }
      const analysis =
        lastLearnerTurn.grammarAnalysis ||
        analyzeUkrainianUtterance(
          lastLearnerTurn.ukrainianText,
          lastLearnerTurn.utteranceId,
          {
            cefrLevel: state.cefrLevel,
            formalityPreference: state.formalityPreference,
            scenarioId: state.scenarioId,
          }
        );
      const updatedTurns = attachGrammarAnalysisToTurn(state.turns, analysis);
      return {
        titleEn: 'Say It More Naturally (4 Register Options)',
        responseUk: analysis.naturalAlternatives.casualUk,
        responseEn: `Casual: "${analysis.naturalAlternatives.casualUk}" · Formal: "${analysis.naturalAlternatives.formalUk}" · Colloquial: "${analysis.naturalAlternatives.colloquialUk}"`,
        updatedTurns,
        openTab: 'alternatives',
        activeUtteranceId: lastLearnerTurn.utteranceId,
      };
    }
  }
}

// ============================================================================
// 5. END-OF-SESSION REVIEW GENERATOR (PART 16)
// ============================================================================

export function generateSessionReview(
  state: AIConversationState
): SessionReviewData {
  const scenario = getScenarioById(state.scenarioId);
  const learnerTurns = state.turns.filter((t) => t.speaker === 'learner');
  const aiTurns = state.turns.filter((t) => t.speaker === 'ai');
  const durationSeconds = Math.max(
    15,
    Math.round((Date.now() - state.sessionStartedAt) / 1000)
  );

  // Ensure every learner turn has an attached grammar analysis if includeSessionReview is enabled
  const analyzedTurns = learnerTurns.map((turn) => {
    const analysis =
      turn.grammarAnalysis ||
      analyzeUkrainianUtterance(turn.ukrainianText, turn.utteranceId, {
        cefrLevel: state.cefrLevel,
        formalityPreference: state.formalityPreference,
        scenarioId: state.scenarioId,
      });
    return { turn, analysis };
  });

  const groupedMap = new Map<
    GrammarErrorCategory,
    {
      category: GrammarErrorCategory;
      categoryLabelEn: string;
      count: number;
      summaryNoteEn: string;
      items: Array<{
        utteranceId: string;
        youSaidUk: string;
        correctedUk: string;
        ruleNoteEn: string;
      }>;
    }
  >();

  const correctedSentences: SessionReviewData['correctedSentences'] = [];
  const naturalExpressionsLearned: SessionReviewData['naturalExpressionsLearned'] = [];
  const vocabMap = new Map<
    string,
    { uk: string; en: string; pos: string; note: string }
  >();
  const moduleIdsToRecommend = new Set<string>([
    scenario.relatedCourseModuleId,
  ]);

  if (state.includeSessionReview) {
    for (const { analysis } of analyzedTurns) {
      if (
        analysis.status === 'incorrect-grammar' ||
        analysis.status === 'correct-but-unnatural'
      ) {
        const existingGroup = groupedMap.get(analysis.category);
        const item = {
          utteranceId: analysis.utteranceId,
          youSaidUk: analysis.youSaidUk,
          correctedUk: analysis.correctUkrainian,
          ruleNoteEn: analysis.whatChangedSummary,
        };
        if (existingGroup) {
          existingGroup.count += 1;
          existingGroup.items.push(item);
        } else {
          groupedMap.set(analysis.category, {
            category: analysis.category,
            categoryLabelEn: analysis.categoryLabelEn,
            count: 1,
            summaryNoteEn: analysis.grammarRuleSummary,
            items: [item],
          });
        }

        correctedSentences.push({
          utteranceId: analysis.utteranceId,
          youSaidUk: analysis.youSaidUk,
          correctedUk: analysis.correctUkrainian,
          englishMeaning: analysis.englishMeaning,
          whatChanged: analysis.whatChangedSummary,
          practicePromptEn: analysis.practicePromptEn,
        });

        moduleIdsToRecommend.add(
          analysis.explanationLevels.advanced.relatedCourseModuleId
        );
      }

      naturalExpressionsLearned.push({
        uk: analysis.naturalAlternatives.casualUk,
        en: analysis.englishMeaning,
        registerNote: analysis.naturalAlternatives.casualNoteEn,
      });

      for (const v of analysis.keyVocabularyWords) {
        if (!vocabMap.has(v.uk)) {
          vocabMap.set(v.uk, {
            uk: v.uk,
            en: v.en,
            pos: v.pos,
            note: v.caseOrGrammarNote,
          });
        }
      }
    }
  }

  // Always include key scenario phrases & vocabulary so review is rich even after short sessions
  for (const kp of scenario.keyPhrases) {
    if (naturalExpressionsLearned.length < 5) {
      naturalExpressionsLearned.push({
        uk: kp.uk,
        en: kp.en,
        registerNote: kp.grammarNote,
      });
    }
  }

  for (const kp of scenario.keyPhrases) {
    for (const v of extractVocabularyFromText(kp.uk)) {
      if (!vocabMap.has(v.uk) && vocabMap.size < 8) {
        vocabMap.set(v.uk, {
          uk: v.uk,
          en: v.en,
          pos: v.pos,
          note: v.caseOrGrammarNote,
        });
      }
    }
  }

  const recommendedCourseModules = Array.from(moduleIdsToRecommend).map(
    (modId) => {
      const verified = getVerifiedCourseModule(modId);
      return {
        moduleId: verified.id,
        moduleTitle: verified.title,
        level: verified.level,
        reasonEn:
          verified.id === scenario.relatedCourseModuleId
            ? `Directly covers the grammar and dialogues for "${scenario.titleEn}".`
            : 'Reinforces the noun case and verb patterns practiced in your session.',
      };
    }
  );

  return {
    sessionId: state.sessionId,
    generatedAt: Date.now(),
    mode: state.conversationMode,
    correctionIntensity: state.correctionIntensity,
    includeSessionReview: state.includeSessionReview,
    scenarioId: state.scenarioId,
    scenarioTitleEn: scenario.titleEn,
    cefrLevel: state.cefrLevel,
    durationSeconds,
    learnerTurnCount: learnerTurns.length,
    aiTurnCount: aiTurns.length,
    topicsPracticed: [
      scenario.titleEn,
      ...scenario.learningObjectives.slice(0, 2),
    ],
    groupedGrammarReview: Array.from(groupedMap.values()),
    correctedSentences,
    naturalExpressionsLearned,
    vocabularyToReview: Array.from(vocabMap.values()),
    recommendedCourseModules,
  };
}

// ============================================================================
// 6. PERSISTENCE HELPERS (LOCALSTORAGE)
// ============================================================================

export function loadSavedConversationPreferences(): Partial<AIConversationState> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(AI_CONVO_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      conversationMode:
        parsed.conversationMode === 'tutor' ? 'tutor' : 'friendly',
      correctionIntensity: ['off', 'discreet', 'gentle', 'balanced', 'intensive'].includes(
        parsed.correctionIntensity
      )
        ? parsed.correctionIntensity
        : undefined,
      hasUserCustomizedCorrectionIntensity: Boolean(
        parsed.hasUserCustomizedCorrectionIntensity
      ),
      includeSessionReview:
        typeof parsed.includeSessionReview === 'boolean'
          ? parsed.includeSessionReview
          : true,
      cefrLevel: ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'].includes(parsed.cefrLevel)
        ? parsed.cefrLevel
        : 'A1',
      scenarioId:
        typeof parsed.scenarioId === 'string' &&
        CONVERSATION_SCENARIOS.some((s) => s.id === parsed.scenarioId)
          ? parsed.scenarioId
          : 'free-conversation',
      formalityPreference: ['informal', 'formal', 'auto'].includes(
        parsed.formalityPreference
      )
        ? parsed.formalityPreference
        : 'auto',
      voicePreference: ['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'].includes(
        parsed.voicePreference
      )
        ? parsed.voicePreference
        : 'Zephyr',
      speakingSpeed:
        typeof parsed.speakingSpeed === 'number' ? parsed.speakingSpeed : 1.0,
      transcriptVisibility:
        typeof parsed.transcriptVisibility === 'boolean'
          ? parsed.transcriptVisibility
          : true,
      translationVisibility: ['hidden', 'on-demand', 'always'].includes(
        parsed.translationVisibility
      )
        ? parsed.translationVisibility
        : 'on-demand',
    };
  } catch {
    return {};
  }
}

export function saveConversationPreferences(state: AIConversationState): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const payload = {
      conversationMode: state.conversationMode,
      correctionIntensity: state.correctionIntensity,
      hasUserCustomizedCorrectionIntensity:
        state.hasUserCustomizedCorrectionIntensity,
      includeSessionReview: state.includeSessionReview,
      cefrLevel: state.cefrLevel,
      scenarioId: state.scenarioId,
      formalityPreference: state.formalityPreference,
      voicePreference: state.voicePreference,
      speakingSpeed: state.speakingSpeed,
      transcriptVisibility: state.transcriptVisibility,
      translationVisibility: state.translationVisibility,
    };
    window.localStorage.setItem(AI_CONVO_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearConversationHistoryAndReset(
  state: AIConversationState
): AIConversationState {
  return {
    ...state,
    sessionId: `convo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sessionStartedAt: Date.now(),
    isSessionActive: false,
    turns: [],
    recurringErrorCategories: {},
    activeCorrectionUtteranceId: null,
    lastSessionReview: null,
  };
}
