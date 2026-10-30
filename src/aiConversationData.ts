// ============================================================================
// LangoUA — AI Ukrainian Conversation & Language Tutor Dataset & Types
// ============================================================================

export type ConversationMode = 'friendly' | 'tutor';

export type CorrectionIntensity =
  | 'off'
  | 'discreet'
  | 'gentle'
  | 'balanced'
  | 'intensive';

export type ConvoCefrLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type FormalityPreference = 'informal' | 'formal' | 'auto';

export type GeminiVoiceName = 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';

export type UtteranceStatus =
  | 'incorrect-grammar'
  | 'correct-but-unnatural'
  | 'correct-and-natural'
  | 'acceptable-colloquial'
  | 'uncertain-transcription';

export type GrammarErrorCategory =
  | 'cases'
  | 'prepositions'
  | 'verb-conjugation'
  | 'verb-aspect'
  | 'agreement'
  | 'sentence-structure'
  | 'vocabulary'
  | 'formality'
  | 'euphony';

export type ManualHelpActionId =
  | 'translate'
  | 'explain-english'
  | 'repeat'
  | 'slower'
  | 'hint'
  | 'how-to-say'
  | 'correct-last'
  | 'explain-grammar'
  | 'more-natural';

export interface DeclensionOrConjugationRow {
  formLabel: string;
  ukrainianForm: string;
  englishNote: string;
  isTargetForm?: boolean;
}

export interface GrammarExplanationLevels {
  simple: string;
  detailed: string;
  advanced: {
    linguisticSummary: string;
    morphologicalNote: string;
    exceptionsNote: string;
    tableTitle: string;
    tableRows: DeclensionOrConjugationRow[];
    relatedCourseModuleId: string;
    relatedCourseModuleTitle: string;
    inspectWordUk?: string;
  };
}

export interface MoreNaturalAlternativesData {
  originalSentenceUk: string;
  correctedGrammarUk: string;
  casualUk: string;
  casualNoteEn: string;
  neutralUk: string;
  neutralNoteEn: string;
  formalUk: string;
  formalNoteEn: string;
  colloquialUk: string;
  colloquialNoteEn: string;
}

export interface TutorPracticeExercise {
  id: string;
  exerciseType:
    | 'repeat-corrected'
    | 'change-tense'
    | 'apply-case'
    | 'verb-aspect'
    | 'expand-sentence';
  titleEn: string;
  promptEn: string;
  promptUk: string;
  expectedAnswerUk: string;
  acceptedVariantsUk: string[];
  hintEn: string;
  grammarFocus: string;
}

export interface GrammarCorrectionCardData {
  utteranceId: string;
  status: UtteranceStatus;
  severity: 'none' | 'minor-style' | 'moderate' | 'meaning-changing';
  category: GrammarErrorCategory;
  categoryLabelEn: string;
  youSaidUk: string;
  correctUkrainian: string;
  englishMeaning: string;
  whatChangedSummary: string;
  grammarRuleSummary: string;
  additionalExampleUk: string;
  additionalExampleEn: string;
  practicePromptEn: string;
  practiceTargetUk: string;
  isEuphonyOnly: boolean;
  isColloquialAcceptable: boolean;
  explanationLevels: GrammarExplanationLevels;
  naturalAlternatives: MoreNaturalAlternativesData;
  tutorExercise: TutorPracticeExercise;
  keyVocabularyWords: Array<{
    uk: string;
    en: string;
    pos: string;
    caseOrGrammarNote: string;
  }>;
}

export interface ConversationTurn {
  id: string;
  utteranceId: string;
  speaker: 'ai' | 'learner' | 'system';
  ukrainianText: string;
  englishTranslation: string;
  timestamp: number;
  modeAtTurn: ConversationMode;
  intensityAtTurn: CorrectionIntensity;
  cefrAtTurn: ConvoCefrLevel;
  showTranslation: boolean;
  isEditedByLearner?: boolean;
  spokenFeedbackUk?: string;
  spokenFeedbackEn?: string;
  grammarAnalysis?: GrammarCorrectionCardData;
  pronunciationTipId?: string;
}

export interface ConversationModeConfig {
  id: ConversationMode;
  titleEn: string;
  titleUk: string;
  badgeText: string;
  description: string;
  defaultCorrectionIntensity: CorrectionIntensity;
  characteristics: string[];
  aiPersonaSummary: string;
  teachingSequence?: string[];
}

export interface CorrectionIntensityConfig {
  id: CorrectionIntensity;
  shortLabel: string;
  fullLabel: string;
  summary: string;
  detailedBehavior: string;
  defaultForMode?: ConversationMode;
  analyzeInBackground: boolean;
  showInlineBadge: boolean;
  autoExpandCard: boolean;
  includeSpokenCorrectionInReply: boolean;
  onlyMeaningChangingOrRecurring: boolean;
  offerImmediateRetryPrompt: boolean;
  collectForSessionReview: boolean;
}

export interface CefrLevelConfig {
  level: ConvoCefrLevel;
  displayLabel: string;
  titleEn: string;
  descriptionEn: string;
  recommendedSpeed: number;
  vocabularyScope: string;
  grammarScope: string;
  maxAiSentencesPerTurn: number;
  englishSupportAllowed: boolean;
}

export interface ConversationScenarioPhrase {
  uk: string;
  en: string;
  grammarNote: string;
}

export interface ConversationScenario {
  id: string;
  number: number; // 0 for Free Conversation, 1..28 for structured scenarios
  titleEn: string;
  titleUk: string;
  category:
    | 'free'
    | 'everyday'
    | 'travel'
    | 'social'
    | 'practical'
    | 'professional'
    | 'culture';
  suggestedLevel: ConvoCefrLevel;
  aiRoleEn: string;
  aiRoleUk: string;
  defaultFormality: FormalityPreference;
  descriptionEn: string;
  learningObjectives: string[];
  relatedCourseModuleId: string;
  openingByLevel: {
    beginnerUk: string;
    beginnerEn: string;
    intermediateUk: string;
    intermediateEn: string;
    advancedUk: string;
    advancedEn: string;
  };
  tutorIntroUk: string;
  tutorIntroEn: string;
  keyPhrases: ConversationScenarioPhrase[];
  suggestedLearnerStarters: Array<{
    uk: string;
    en: string;
  }>;
}

export interface PronunciationGuideItem {
  id: string;
  titleEn: string;
  contrastLabelUk: string;
  articulationEn: string;
  commonLearnerHabitEn: string;
  minimalPairs: Array<{
    wordUk: string;
    wordEn: string;
    contrastWordUk: string;
    contrastWordEn: string;
    noteEn: string;
  }>;
  practiceSentenceUk: string;
  practiceSentenceEn: string;
}

export interface ManualHelpActionConfig {
  id: ManualHelpActionId;
  labelEn: string;
  icon: string;
  tooltipEn: string;
  scope: 'ai-turn' | 'learner-turn' | 'session';
}

export interface SessionReviewData {
  sessionId: string;
  generatedAt: number;
  mode: ConversationMode;
  correctionIntensity: CorrectionIntensity;
  includeSessionReview: boolean;
  scenarioId: string;
  scenarioTitleEn: string;
  cefrLevel: ConvoCefrLevel;
  durationSeconds: number;
  learnerTurnCount: number;
  aiTurnCount: number;
  topicsPracticed: string[];
  groupedGrammarReview: Array<{
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
  }>;
  correctedSentences: Array<{
    utteranceId: string;
    youSaidUk: string;
    correctedUk: string;
    englishMeaning: string;
    whatChanged: string;
    practicePromptEn: string;
  }>;
  naturalExpressionsLearned: Array<{
    uk: string;
    en: string;
    registerNote: string;
  }>;
  vocabularyToReview: Array<{
    uk: string;
    en: string;
    pos: string;
    note: string;
  }>;
  recommendedCourseModules: Array<{
    moduleId: string;
    moduleTitle: string;
    level: string;
    reasonEn: string;
  }>;
}

export interface AIConversationState {
  sessionId: string;
  sessionStartedAt: number;
  isSessionActive: boolean;
  conversationMode: ConversationMode;
  correctionIntensity: CorrectionIntensity;
  hasUserCustomizedCorrectionIntensity: boolean;
  includeSessionReview: boolean;
  cefrLevel: ConvoCefrLevel;
  scenarioId: string;
  formalityPreference: FormalityPreference;
  voicePreference: GeminiVoiceName;
  speakingSpeed: number;
  transcriptVisibility: boolean;
  translationVisibility: 'hidden' | 'on-demand' | 'always';
  microphoneState: 'idle' | 'listening' | 'muted' | 'processing' | 'error';
  connectionState: 'ready' | 'connecting' | 'live-voice' | 'turn-voice' | 'fallback-local';
  aiSpeakingState: 'idle' | 'thinking' | 'speaking';
  activeCorrectionUtteranceId: string | null;
  activeExplanationLevel: 'simple' | 'detailed' | 'advanced';
  activeRightPanelTab: 'feedback' | 'alternatives' | 'pronunciation' | 'scenario';
  turns: ConversationTurn[];
  recurringErrorCategories: Record<string, number>;
  lastSessionReview: SessionReviewData | null;
}

// ============================================================================
// PART 1: TWO DISTINCT CONVERSATION MODES
// ============================================================================

export const CONVERSATION_MODES: Record<ConversationMode, ConversationModeConfig> = {
  friendly: {
    id: 'friendly',
    titleEn: 'Friendly Conversation Partner',
    titleUk: 'Дру́жній співрозмо́вник',
    badgeText: 'Natural Fluency & Confidence',
    description:
      'Practice natural Ukrainian with a friendly conversation partner. Build confidence, discuss everyday life, and improve your fluency.',
    defaultCorrectionIntensity: 'discreet',
    characteristics: [
      'Feels like speaking with a patient, friendly, intelligent Ukrainian conversation partner',
      'Keeps the dialogue flowing naturally with authentic follow-up questions',
      'Uses everyday Ukrainian expressions appropriate to your selected CEFR level',
      'Clearly identifies as an AI conversation partner (never pretends to be human)',
      'Adapts grammar feedback strictly to your chosen Corrections During Conversation setting',
    ],
    aiPersonaSummary:
      'Warm, supportive AI Ukrainian conversation partner focused on real-life communication, natural rhythm, and building speaking confidence.',
  },
  tutor: {
    id: 'tutor',
    titleEn: 'Structured Language Tutor',
    titleUk: 'Структуро́ваний виклада́ч',
    badgeText: 'Guided Grammar & Active Drilling',
    description:
      'Practice Ukrainian with an AI language tutor who teaches grammar, corrects mistakes, and guides your speaking development.',
    defaultCorrectionIntensity: 'balanced',
    characteristics: [
      'Guides conversation systematically around clear Ukrainian grammar and vocabulary goals',
      'Prompts you to use specific noun cases, verb tenses, verb aspects, and sentence structures',
      'Provides targeted coaching and structured retry exercises according to your feedback setting',
      'Adapts explanations from simple high-school clarity to full 7-case morphological tables',
      'Works with any Corrections During Conversation level — including Off for uninterrupted oral testing',
    ],
    aiPersonaSummary:
      'Experienced AI Ukrainian language instructor who scaffolds speaking tasks, models target structures, and coaches accuracy step by step.',
    teachingSequence: [
      '1. Introduce or model a useful Ukrainian phrase or grammatical structure',
      '2. Demonstrate a clear, natural Ukrainian example with stress and meaning',
      '3. Ask the learner to respond in Ukrainian using the target pattern',
      '4. Evaluate the learner’s spoken or written response',
      '5. Correct and explain mistakes according to the selected correction setting',
      '6. Invite the learner to try again when helpful',
      '7. Reinforce the correct form in a fresh context',
      '8. Continue the guided conversation naturally',
    ],
  },
};

// ============================================================================
// PART 2 & 3: INDEPENDENT GRAMMAR CORRECTION INTENSITY OPTIONS
// ============================================================================

export const CORRECTION_INTENSITY_OPTIONS: Record<
  CorrectionIntensity,
  CorrectionIntensityConfig
> = {
  off: {
    id: 'off',
    shortLabel: 'Off',
    fullLabel: 'Off — Review After Conversation',
    summary:
      'No live grammar interruptions during conversation. Speak freely and review corrections after your session if post-session review is enabled.',
    detailedBehavior:
      'Does not interrupt or display unsolicited grammar corrections during live turns. The AI continues the conversation naturally. Manual help buttons ("Correct My Last Sentence", "Explain My Grammar") remain fully available on demand.',
    analyzeInBackground: true,
    showInlineBadge: false,
    autoExpandCard: false,
    includeSpokenCorrectionInReply: false,
    onlyMeaningChangingOrRecurring: false,
    offerImmediateRetryPrompt: false,
    collectForSessionReview: true,
  },
  discreet: {
    id: 'discreet',
    shortLabel: 'Discreet',
    fullLabel: 'Discreet — Subtle Corrections',
    summary:
      'Recommended default for Friendly Conversation Partner. Keeps speech flowing while placing a quiet correction badge beside your message.',
    detailedBehavior:
      'The AI responds naturally without lecturing aloud. A subtle badge appears beside your transcript turn whenever a grammar fix or more natural phrasing is available. Tap the badge anytime to inspect the full correction card.',
    defaultForMode: 'friendly',
    analyzeInBackground: true,
    showInlineBadge: true,
    autoExpandCard: false,
    includeSpokenCorrectionInReply: false,
    onlyMeaningChangingOrRecurring: false,
    offerImmediateRetryPrompt: false,
    collectForSessionReview: true,
  },
  gentle: {
    id: 'gentle',
    shortLabel: 'Gentle',
    fullLabel: 'Gentle — Important Corrections Only',
    summary:
      'Corrects only mistakes that change meaning, sound confusing, or repeat across turns. Minor stylistic details stay out of the way.',
    detailedBehavior:
      'Provides brief, encouraging feedback only when an error affects comprehension or repeats. Keeps explanations concise and immediately returns to the conversation topic.',
    analyzeInBackground: true,
    showInlineBadge: true,
    autoExpandCard: false,
    includeSpokenCorrectionInReply: true,
    onlyMeaningChangingOrRecurring: true,
    offerImmediateRetryPrompt: false,
    collectForSessionReview: true,
  },
  balanced: {
    id: 'balanced',
    shortLabel: 'Balanced',
    fullLabel: 'Balanced — Active Learning',
    summary:
      'Recommended default for Structured Language Tutor. Clearly corrects grammar, case endings, and unnatural phrasing while keeping momentum.',
    detailedBehavior:
      'Highlights significant grammar and vocabulary mistakes, models the corrected Ukrainian sentence clearly, explains the core rule in plain English, and offers a quick retry prompt when helpful.',
    defaultForMode: 'tutor',
    analyzeInBackground: true,
    showInlineBadge: true,
    autoExpandCard: true,
    includeSpokenCorrectionInReply: true,
    onlyMeaningChangingOrRecurring: false,
    offerImmediateRetryPrompt: true,
    collectForSessionReview: true,
  },
  intensive: {
    id: 'intensive',
    shortLabel: 'Intensive',
    fullLabel: 'Intensive — Detailed Correction',
    summary:
      'Comprehensive coaching after every completed learner turn: corrected sentence, case/verb breakdown, natural register options, and retry drill.',
    detailedBehavior:
      'Delivers thorough feedback between completed turns (never cutting off your microphone mid-sentence). Opens the full correction card with morphological patterns, natural alternatives, and an active retry exercise.',
    analyzeInBackground: true,
    showInlineBadge: true,
    autoExpandCard: true,
    includeSpokenCorrectionInReply: true,
    onlyMeaningChangingOrRecurring: false,
    offerImmediateRetryPrompt: true,
    collectForSessionReview: true,
  },
};

export const CORRECTION_INTENSITY_ORDER: CorrectionIntensity[] = [
  'off',
  'discreet',
  'gentle',
  'balanced',
  'intensive',
];

// ============================================================================
// PART 5: CEFR LEVEL ADAPTATION CONFIGS (A0 -> C1)
// ============================================================================

export const CEFR_LEVEL_CONFIGS: Record<ConvoCefrLevel, CefrLevelConfig> = {
  A0: {
    level: 'A0',
    displayLabel: 'A0 / Pre-A1',
    titleEn: 'First Words & Phrases',
    descriptionEn:
      'Very short, slow, clear Ukrainian phrases (1–4 words) with supportive English guidance, greetings, and survival expressions.',
    recommendedSpeed: 0.85,
    vocabularyScope: 'Top 200 survival words, greetings, yes/no, numbers 1–10, basic nouns',
    grammarScope: 'Simple Nominative statements, Приві́т / Мене́ зва́ти / Це..., basic questions',
    maxAiSentencesPerTurn: 2,
    englishSupportAllowed: true,
  },
  A1: {
    level: 'A1',
    displayLabel: 'A1 Beginner',
    titleEn: 'Everyday Basics',
    descriptionEn:
      'Simple present-tense sentences, ordering in a café, family, locations, and essential Accusative & Locative endings.',
    recommendedSpeed: 0.88,
    vocabularyScope: 'Core 600 everyday words (food, family, city, time, daily verbs)',
    grammarScope: 'Present tense Class I/II verbs, noun gender, Accusative object, Locative after у/в/на',
    maxAiSentencesPerTurn: 2,
    englishSupportAllowed: true,
  },
  A2: {
    level: 'A2',
    displayLabel: 'A2 Elementary',
    titleEn: 'Routine & Past/Future',
    descriptionEn:
      'Connected sentences about past experiences, future plans, shopping, travel, and Dative/Instrumental cases.',
    recommendedSpeed: 0.92,
    vocabularyScope: 'Core 1,500 words (travel, health, routines, hobbies, emotions)',
    grammarScope: 'Past & future tenses, verb aspect basics, Genitive negation, Dative & Instrumental cases',
    maxAiSentencesPerTurn: 3,
    englishSupportAllowed: false,
  },
  B1: {
    level: 'B1',
    displayLabel: 'B1 Intermediate',
    titleEn: 'Independent Speaker',
    descriptionEn:
      'Natural multi-sentence conversation, expressing opinions, motion verbs, Vocative address, and all 7 cases in context.',
    recommendedSpeed: 1.0,
    vocabularyScope: '3,000+ words (work, society, regions of Ukraine, storytelling, opinions)',
    grammarScope: 'All 7 cases with adjectives/numerals, prefixed motion verbs, якщо́ vs якби́ conditionals',
    maxAiSentencesPerTurn: 3,
    englishSupportAllowed: false,
  },
  B2: {
    level: 'B2',
    displayLabel: 'B2 Upper-Intermediate',
    titleEn: 'Fluent & Nuanced Discussion',
    descriptionEn:
      'Complex arguments, professional communication, impersonal constructions, idioms, and subtle aspectual contrasts.',
    recommendedSpeed: 1.0,
    vocabularyScope: '4,500+ words (business, media, abstract debates, cultural analysis)',
    grammarScope: 'Impersonal -но/-то forms, verbal adverbs, correlatives (чим... тим), register shifts',
    maxAiSentencesPerTurn: 4,
    englishSupportAllowed: false,
  },
  C1: {
    level: 'C1',
    displayLabel: 'C1 Advanced',
    titleEn: 'Near-Native Mastery',
    titleUk: 'Вільне володіння',
    descriptionEn:
      'Full idiomatic richness, Ukrainian euphony (милозву́чність у/в, і/й/та), rhetoric, humor, and philosophical depth.',
    recommendedSpeed: 1.0,
    vocabularyScope: '6,000+ words including idioms, literary expressions, and nuanced register',
    grammarScope: 'Full stylistic mastery, euphony, advanced syntax, subtle pragmatic register control',
    maxAiSentencesPerTurn: 4,
    englishSupportAllowed: false,
  } as CefrLevelConfig & { titleUk?: string },
};

export const CEFR_LEVEL_ORDER: ConvoCefrLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

// ============================================================================
// PART 6: FORMALITY, VOICE & SPEED SETTINGS
// ============================================================================

export const FORMALITY_OPTIONS: Array<{
  id: FormalityPreference;
  labelEn: string;
  badgeUk: string;
  descriptionEn: string;
}> = [
  {
    id: 'informal',
    labelEn: 'Informal (ти)',
    badgeUk: 'ти',
    descriptionEn: 'Use singular informal «ти» (friends, peers, casual practice).',
  },
  {
    id: 'formal',
    labelEn: 'Formal / Polite (Ви)',
    badgeUk: 'Ви',
    descriptionEn: 'Use polite plural/formal «Ви» (strangers, service staff, professional settings).',
  },
  {
    id: 'auto',
    labelEn: 'Automatic (Context-Appropriate)',
    badgeUk: 'Авто',
    descriptionEn: 'Adapts «ти» or «Ви» automatically based on the selected scenario and roleplay.',
  },
];

export const GEMINI_VOICE_OPTIONS: Array<{
  id: GeminiVoiceName;
  label: string;
  toneDescription: string;
}> = [
  { id: 'Zephyr', label: 'Zephyr (Warm & Clear)', toneDescription: 'Warm, articulate conversational voice' },
  { id: 'Kore', label: 'Kore (Calm & Tutor-like)', toneDescription: 'Clear, measured instructional cadence' },
  { id: 'Puck', label: 'Puck (Lively & Friendly)', toneDescription: 'Energetic, upbeat everyday speaker' },
  { id: 'Charon', label: 'Charon (Deep & Steady)', toneDescription: 'Resonant, composed voice' },
  { id: 'Fenrir', label: 'Fenrir (Expressive)', toneDescription: 'Dynamic, natural inflection' },
];

export const SPEAKING_SPEED_OPTIONS: Array<{
  value: number;
  label: string;
}> = [
  { value: 0.85, label: '0.85× (Slow & Clear)' },
  { value: 0.92, label: '0.92× (Measured)' },
  { value: 1.0, label: '1.0× (Natural Pace)' },
];

// ============================================================================
// PART 15: 9 MANUAL LEARNER HELP ACTIONS
// ============================================================================

export const MANUAL_HELP_ACTIONS: ManualHelpActionConfig[] = [
  {
    id: 'translate',
    labelEn: 'Translate',
    icon: '🌐',
    tooltipEn: 'Translate the latest Ukrainian message into clear English',
    scope: 'ai-turn',
  },
  {
    id: 'explain-english',
    labelEn: 'Explain in English',
    icon: '💡',
    tooltipEn: 'Explain the grammar and vocabulary of the AI’s message in English',
    scope: 'ai-turn',
  },
  {
    id: 'repeat',
    labelEn: 'Repeat That',
    icon: '🔁',
    tooltipEn: 'Replay the AI’s last Ukrainian response aloud',
    scope: 'ai-turn',
  },
  {
    id: 'slower',
    labelEn: 'Speak More Slowly',
    icon: '🐢',
    tooltipEn: 'Replay the last Ukrainian sentence slowly and clearly (0.82×)',
    scope: 'ai-turn',
  },
  {
    id: 'hint',
    labelEn: 'Give Me a Hint',
    icon: '🧭',
    tooltipEn: 'Get a suggested Ukrainian response starter with English translation',
    scope: 'session',
  },
  {
    id: 'how-to-say',
    labelEn: 'How Do I Say This?',
    icon: '🗣️',
    tooltipEn: 'Type an English idea and learn how to say it naturally in Ukrainian',
    scope: 'session',
  },
  {
    id: 'correct-last',
    labelEn: 'Correct My Last Sentence',
    icon: '✅',
    tooltipEn: 'Analyze and correct your most recent Ukrainian turn (works even when Corrections = Off)',
    scope: 'learner-turn',
  },
  {
    id: 'explain-grammar',
    labelEn: 'Explain My Grammar',
    icon: '📐',
    tooltipEn: 'Open the 3-level grammar breakdown for your most recent Ukrainian turn',
    scope: 'learner-turn',
  },
  {
    id: 'more-natural',
    labelEn: 'Say It More Naturally',
    icon: '✨',
    tooltipEn: 'See casual, neutral, formal, and colloquial ways a native speaker would phrase your sentence',
    scope: 'learner-turn',
  },
];

// ============================================================================
// PART 13: PRONUNCIATION & SPEAKING GUIDES (UKRAINIAN PHONETICS)
// ============================================================================

export const PRONUNCIATION_GUIDES: PronunciationGuideItem[] = [
  {
    id: 'h-vs-g',
    titleEn: 'Ukrainian «г» [ɦ] vs. «ґ» [g]',
    contrastLabelUk: 'г [ɦ] ↔ ґ [g]',
    articulationEn:
      'Ukrainian «г» is a voiced glottal/pharyngeal fricative [ɦ] — like a breathy English "h" with vibrating vocal cords (as in "aha!"). The rare letter «ґ» is a hard velar stop [g] like English "go".',
    commonLearnerHabitEn:
      'English and Russian speakers often pronounce Ukrainian «г» as a hard [g]. Keep the back of your tongue relaxed so air flows smoothly with voice.',
    minimalPairs: [
      {
        wordUk: 'га́нок / ґа́нок',
        wordEn: 'porch (spelled with ґа́нок [g])',
        contrastWordUk: 'голова́',
        contrastWordEn: 'head (voiced breathy [ɦ])',
        noteEn: 'Practice feeling the open throat in «голова́» vs. the tongue closure in «ґа́нок».',
      },
      {
        wordUk: 'гра́ти',
        wordEn: 'to play [ɦraty]',
        contrastWordUk: 'ґра́ти',
        contrastWordEn: 'metal bars / grate [graty]',
        noteEn: 'A classic minimal pair where «г» vs «ґ» changes the meaning completely!',
      },
    ],
    practiceSentenceUk: 'У на́шому мі́сті гарна пого́да, а на ґа́нку сиди́ть кіт.',
    practiceSentenceEn: 'In our city the weather is nice, and a cat is sitting on the porch.',
  },
  {
    id: 'y-vs-i',
    titleEn: 'Ukrainian «и» [ɪ] vs. «і» [i]',
    contrastLabelUk: 'и [ɪ] ↔ і [i]',
    articulationEn:
      '«и» represents the high-mid central-front vowel [ɪ], very close to the short vowel in English "bit" or "sit". «і» is a pure high front vowel [i] like "meet", and it softens the consonant before it.',
    commonLearnerHabitEn:
      'Avoid pronouncing «и» deep in the throat like Russian «ы», and avoid merging «и» and «і» into the same sound.',
    minimalPairs: [
      {
        wordUk: 'ми',
        wordEn: 'we [mɪ]',
        contrastWordUk: 'мій',
        contrastWordEn: 'my [mʲij]',
        noteEn: 'Notice how «м» stays hard before «и» in «ми», and softens before «і» in «мій».',
      },
      {
        wordUk: 'жи́ти',
        wordEn: 'to live [ʒɪtɪ]',
        contrastWordUk: 'жі́нка',
        contrastWordEn: 'woman / wife [ʒinka]',
        noteEn: 'Keep both «и» vowels in «жи́ти» crisp like English "bit".',
      },
    ],
    practiceSentenceUk: 'Ми живемо́ в Украї́ні і вивча́ємо но́ві слова́.',
    practiceSentenceEn: 'We live in Ukraine and learn new words.',
  },
  {
    id: 'yi-and-y',
    titleEn: 'Dotted «ї» [ji] vs. Semivowel «й» [j]',
    contrastLabelUk: 'ї [ji] ↔ й [j]',
    articulationEn:
      '«ї» always begins with a distinct [j] ("y") glide followed by pure [i]: [ji], like English "yeast". «й» is a short consonant glide [j] as in "boy" or "yes".',
    commonLearnerHabitEn:
      'Learners sometimes drop the [j] glide inside words like «Украї́на» (which has 4 syllables: У-кра-ї́-на) or «Ки́їв» [Kɪ-jiv].',
    minimalPairs: [
      {
        wordUk: 'ї́хати',
        wordEn: 'to go by vehicle [jixatɪ]',
        contrastWordUk: 'йти',
        contrastWordEn: 'to go on foot [jtɪ]',
        noteEn: 'Both motion verbs start with a glide, but «ї́хати» has the full syllable [ji-].',
      },
      {
        wordUk: 'її́',
        wordEn: 'her / hers [jiji]',
        contrastWordUk: 'мій',
        contrastWordEn: 'my [mij]',
        noteEn: 'Pronounce both glides clearly in «її́» [ji-jí].',
      },
    ],
    practiceSentenceUk: 'По́їзд ї́де до Ки́єва, бо це столи́ця Украї́ни.',
    practiceSentenceEn: 'The train is going to Kyiv, because it is the capital of Ukraine.',
  },
  {
    id: 'soft-sign-palatalization',
    titleEn: 'Soft Consonants («ь» & Palatalization)',
    contrastLabelUk: 'т/ть, д/дь, н/нь, л/ль, с/сь',
    articulationEn:
      'The soft sign «ь» (м’яки́й знак) and vowels «я, ю, є, і» raise the middle of the tongue toward the hard palate, softening dental consonants (д, т, з, с, ц, л, н, дз).',
    commonLearnerHabitEn:
      'In third-person verbs ending in «-ться» (e.g., «подо́бається», «навча́ється»), pronounce «-ться» smoothly as a soft geminate [tʲsʲa], not a hard [t-sya].',
    minimalPairs: [
      {
        wordUk: 'бага́то',
        wordEn: 'many / much (hard [t])',
        contrastWordUk: 'ба́тько',
        contrastWordEn: 'father (soft [tʲ])',
        noteEn: 'Raise the blade of your tongue against the ridge behind your upper teeth for «ть».',
      },
      {
        wordUk: 'був',
        wordEn: 'was [buw] (hard bilabial glide)',
        contrastWordUk: 'любо́в',
        contrastWordEn: 'love [lʲubɔw]',
        noteEn: 'Notice the soft initial «лю-» [lʲu] followed by the rounded [w] at the end of a syllable.',
      },
    ],
    practiceSentenceUk: 'Сього́дні мені́ ду́же подо́бається розмовля́ти украї́нською.',
    practiceSentenceEn: 'Today I really enjoy speaking Ukrainian.',
  },
  {
    id: 'word-stress',
    titleEn: 'Ukrainian Dynamic Word Stress (На́голос)',
    contrastLabelUk: 'за́мок ↔ замо́к · мука́ ↔ му́ка',
    articulationEn:
      'Ukrainian stress is dynamic and free: stressed vowels are pronounced slightly longer and clearer, while unstressed vowels remain distinct (unstressed «о» NEVER turns into «а» as in Russian!).',
    commonLearnerHabitEn:
      'Never reduce unstressed «о» to [a] in words like «молоко́» [mɔlɔkɔ́] or «голова́» [ɦɔlɔvá]. Keep every «о» rounded!',
    minimalPairs: [
      {
        wordUk: 'за́мок',
        wordEn: 'castle (stress on 1st syllable)',
        contrastWordUk: 'замо́к',
        contrastWordEn: 'lock (stress on 2nd syllable)',
        noteEn: 'Stress alone distinguishes castle from lock!',
      },
      {
        wordUk: 'доро́га',
        wordEn: 'road (stress on 2nd syllable)',
        contrastWordUk: 'дорога́',
        contrastWordEn: 'dear / expensive (feminine, stress on last syllable)',
        noteEn: 'Pay close attention to stress marks in LangoUA transcripts.',
      },
    ],
    practiceSentenceUk: 'Молоко́ на столі́, а старода́вній за́мок стої́ть на горі́.',
    practiceSentenceEn: 'The milk is on the table, and the ancient castle stands on the hill.',
  },
];

// ============================================================================
// PART 7: COMPLETE 29 CONVERSATION SCENARIO LIBRARY (Free + 28 Required Scenarios)
// ============================================================================

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'free-conversation',
    number: 0,
    titleEn: 'Free Conversation',
    titleUk: 'Ві́льна розмо́ва',
    category: 'free',
    suggestedLevel: 'A1',
    aiRoleEn: 'Open AI Ukrainian Conversation Partner / Tutor',
    aiRoleUk: 'Відкри́тий співрозмо́вник або́ виклада́ч',
    defaultFormality: 'informal',
    descriptionEn:
      'Speak freely about any topic you like — your day, interests, Ukrainian grammar questions, or spontaneous stories.',
    learningObjectives: [
      'Maintain natural turn-taking on open-ended topics',
      'Ask and answer spontaneous follow-up questions in Ukrainian',
      'Practice target cases and verbs at your chosen CEFR level',
    ],
    relatedCourseModuleId: 'A0.3',
    openingByLevel: {
      beginnerUk: 'Приві́т! Я твій ШІ-співрозмо́вник. Як у те́бе спра́ви сього́дні? Про що ти хо́чеш поговори́ти?',
      beginnerEn: 'Hi! I am your AI conversation partner. How are you today? What would you like to talk about?',
      intermediateUk: 'Віта́ю! Ра́дий на́шій розмо́ві. Як мина́є твій день і яку́ те́му тобі́ ціка́во обговори́ти сього́дні?',
      intermediateEn: 'Greetings! Glad we are chatting. How is your day going, and what topic would you like to discuss today?',
      advancedUk: 'Віта́ю! Сього́дні мо́жемо поспілкува́тися на будь-яку́ те́му — від щоде́нних вра́жень до культу́ри чи філосо́фії. Що в те́бе на ду́мці?',
      advancedEn: 'Greetings! Today we can talk about any topic — from daily impressions to culture or philosophy. What is on your mind?',
    },
    tutorIntroUk:
      'Віта́ю на уро́ці! Я твій ШІ-виклада́ч украї́нської мо́ви. Дава́й почнемо́ з просто́го запита́ння: розкажи́ в одно́му-двох ре́ченнях, як мина́є твій день і чим ти за́раз займа́єшся.',
    tutorIntroEn:
      'Welcome to our lesson! I am your AI Ukrainian language tutor. Let’s start with a warm-up question: tell me in one or two sentences how your day is going and what you are doing right now.',
    keyPhrases: [
      { uk: 'У ме́не все до́бре, дя́кую!', en: 'Everything is good with me, thank you!', grammarNote: 'У + Genitive pronoun (ме́не)' },
      { uk: 'Я хо́чу поговори́ти про...', en: 'I want to talk about...', grammarNote: 'про + Accusative case' },
      { uk: 'Сього́дні я вивча́ю украї́нську мо́ву.', en: 'Today I am studying the Ukrainian language.', grammarNote: 'Accusative feminine adjective + noun (-у)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Приві́т! У ме́не все чу́дово. Сього́дні я вивча́ю украї́нську.', en: 'Hi! Everything is great with me. Today I am studying Ukrainian.' },
      { uk: 'Я хо́чу попрактикува́ти мину́лий час і відмі́нки.', en: 'I want to practice the past tense and noun cases.' },
    ],
  },
  {
    id: 'meeting-someone-new',
    number: 1,
    titleEn: 'Meeting Someone New',
    titleUk: 'Но́ве знайо́мство',
    category: 'everyday',
    suggestedLevel: 'A0',
    aiRoleEn: 'Friendly Ukrainian acquaintance at a language exchange',
    aiRoleUk: 'Но́вий знайо́мий на мо́вній зу́стрічі',
    defaultFormality: 'informal',
    descriptionEn:
      'Exchange greetings, learn each other’s names, ask how things are going, and make a warm first impression.',
    learningObjectives: [
      'Use natural Ukrainian greetings (Приві́т, Віта́ю, До́брий день)',
      'Introduce yourself with «Мене́ зва́ти...» and «Ду́же приє́мно»',
      'Ask and answer how things are going («Як спра́ви?») naturally',
    ],
    relatedCourseModuleId: 'A0.3',
    openingByLevel: {
      beginnerUk: 'Приві́т! Мене́ зва́ти Оле́на, я твій ШІ-співрозмо́вник. А як те́бе зва́ти?',
      beginnerEn: 'Hi! My name is Olena, I am your AI conversation partner. And what is your name?',
      intermediateUk: 'Приві́т! Ду́же ра́да познайо́митися на на́шій розмо́вній зу́стрічі. Як те́бе зва́ти і звідки ти?',
      intermediateEn: 'Hi! Very glad to meet you at our conversation meetup. What is your name and where are you from?',
      advancedUk: 'Віта́ю! Завжди́ ціка́во знайо́митися з людьми́, які́ вивча́ють украї́нську. Як до те́бе кра́ще зверта́тися і що надихну́ло те́бе вчи́ти на́шу мо́ву?',
      advancedEn: 'Greetings! It is always interesting to meet people learning Ukrainian. How should I address you, and what inspired you to study our language?',
    },
    tutorIntroUk:
      'Сього́дні ми відпрацьо́вуємо знайо́мство. Зверни́ ува́гу на конструкцію «Мене́ зва́ти [ім’я́]. Ду́же приє́мно!». Спро́буй привіта́тися і назва́ти своє́ ім’я́ украї́нською!',
    tutorIntroEn:
      'Today we are practicing introductions. Notice the pattern "Мене́ зва́ти [Name]. Ду́же приє́мно!" Try greeting me and saying your name in Ukrainian!',
    keyPhrases: [
      { uk: 'Мене́ зва́ти...', en: 'My name is...', grammarNote: 'Idiomatic construction with Accusative «мене́»' },
      { uk: 'Ду́же приє́мно познайо́митися!', en: 'Very nice to meet you!', grammarNote: 'Impersonal adverbial expression + reflexive infinitive' },
      { uk: 'Як у те́бе спра́ви?', en: 'How are things with you?', grammarNote: 'Informal «у те́бе» (Genitive of ти)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Приві́т! Мене́ зва́ти Алекс. Ду́же приє́мно!', en: 'Hi! My name is Alex. Very nice to meet you!' },
      { uk: 'До́брий день! Мене́ зва́ти Марі́я, я вивча́ю украї́нську мо́ву.', en: 'Good day! My name is Maria, I am learning Ukrainian.' },
    ],
  },
  {
    id: 'introducing-yourself-background',
    number: 2,
    titleEn: 'Introducing Yourself and Your Background',
    titleUk: 'Розпо́відь про се́бе та похо́дження',
    category: 'everyday',
    suggestedLevel: 'A1',
    aiRoleEn: 'Friendly Ukrainian host getting to know you',
    aiRoleUk: 'Гости́нний співрозмо́вник',
    defaultFormality: 'informal',
    descriptionEn:
      'Share where you are from, where you live now, what languages you speak, and what you do.',
    learningObjectives: [
      'Use «Я з + Genitive» for origin and «Я живу́ у/в + Locative» for residence',
      'Talk about languages with «Я розмовля́ю украї́нською / англі́йською» (Instrumental)',
      'Describe your occupation or studies in the Nominative/Instrumental',
    ],
    relatedCourseModuleId: 'A1.4',
    openingByLevel: {
      beginnerUk: 'Розкажи́ тро́хи про се́бе! Звідки ти і в яко́му мі́сті ти за́раз живе́ш?',
      beginnerEn: 'Tell me a little about yourself! Where are you from and in what city do you live now?',
      intermediateUk: 'Мені́ ціка́во дізна́тися бі́льше про те́бе. З якої́ ти краї́ни, де живе́ш за́раз і яки́ми мо́вами розмовля́єш?',
      intermediateEn: 'I am curious to learn more about you. What country are you from, where do you live now, and what languages do you speak?',
      advancedUk: 'Розкажи́ про своє́ похо́дження та життє́вий шлях: звідки ти ро́дом, де ме́шкаєш за́раз і як украї́нська мо́ва увійшла́ у твоє́ життя́?',
      advancedEn: 'Tell me about your background and life path: where are you originally from, where do you reside now, and how did Ukrainian enter your life?',
    },
    tutorIntroUk:
      'У цьо́му діало́зі ми трену́ємо Місце́вий відмі́нок (Locative) пі́сля «у/в» для мі́сця прожива́ння: напри́клад, «Я живу́ в Нью-Йо́рку / у Льво́ві / в Ки́єві». Скажи́ украї́нською, звідки ти і де ти живе́ш!',
    tutorIntroEn:
      'In this dialogue we practice the Locative case after "у/в" for where you live: e.g., "Я живу́ в Нью-Йо́рку / у Льво́ві / в Ки́єві". Tell me in Ukrainian where you are from and where you live!',
    keyPhrases: [
      { uk: 'Я з Амери́ки / Кана́ди / Вели́кої Брита́нії.', en: 'I am from America / Canada / Great Britain.', grammarNote: 'Preposition з + Genitive case' },
      { uk: 'За́раз я живу́ у Льво́ві / в Ки́єві.', en: 'Right now I live in Lviv / in Kyiv.', grammarNote: 'Preposition у/в + Locative case (-і)' },
      { uk: 'Я тро́хи розмовля́ю украї́нською мо́вою.', en: 'I speak Ukrainian a little.', grammarNote: 'розмовля́ти + Instrumental case (-ою)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я з Амери́ки, але́ за́раз я живу́ в Чика́го.', en: 'I am from America, but right now I live in Chicago.' },
      { uk: 'Я розмовля́ю англі́йською і вивча́ю украї́нську мо́ву.', en: 'I speak English and am learning the Ukrainian language.' },
    ],
  },
  {
    id: 'ordering-coffee-and-food',
    number: 3,
    titleEn: 'Ordering Coffee and Food',
    titleUk: 'Замо́влення ка́ви та ї́жі в кав’я́рні',
    category: 'everyday',
    suggestedLevel: 'A1',
    aiRoleEn: 'Barista and waiter at a Lviv coffeehouse',
    aiRoleUk: 'Бари́ста у льві́вській кав’я́рні',
    defaultFormality: 'formal',
    descriptionEn:
      'Order coffee, pastries, and traditional Ukrainian dishes politely, ask about ingredients, and request the bill.',
    learningObjectives: [
      'Use the Accusative case after «Мо́жна мені́...» and «Я візьму́...» (ка́ву, воду́, си́рник)',
      'Use the Instrumental case after «з/із» (ка́ва з молоко́м, варе́ники з ви́шнями)',
      'Address service staff politely with «Ви» and «Будь ла́ска»',
    ],
    relatedCourseModuleId: 'A1.3',
    openingByLevel: {
      beginnerUk: 'До́брий день! Ласка́во про́симо до на́шої кав’я́рні. Що Ви ба́жаєте замо́вити — ка́ву чи чай?',
      beginnerEn: 'Good day! Welcome to our coffeehouse. What would you like to order — coffee or tea?',
      intermediateUk: 'Віта́ю у льві́вській кав’я́рні! У нас є сві́жа ви́пічка, льві́вський си́рник і чудова ка́ва. Що для Вас приготува́ти?',
      intermediateEn: 'Welcome to our Lviv coffeehouse! We have fresh pastries, Lviv cheesecake, and great coffee. What can I prepare for you?',
      advancedUk: 'До́брого дня! Сього́дні ма́ємо свіжообсма́жену ара́біку та дома́шній льві́вський си́рник із родзи́нками. Що бажа́єте скуштува́ти?',
      advancedEn: 'Good day! Today we have freshly roasted arabica and homemade Lviv cheesecake with raisins. What would you like to taste?',
    },
    tutorIntroUk:
      'У кав’я́рні ми вжива́ємо Знахі́дний відмі́нок (Accusative) для замо́влення: «ка́ва → ка́ву», «вода́ → во́ду», а для дода́тків — Ору́дний відмі́нок (Instrumental) пі́сля «з»: «з молоко́м», «з лимо́ном». Спро́буй замо́вити напі́й та десе́рт!',
    tutorIntroEn:
      'In a café we use the Accusative case to order: "ка́ва → ка́ву", "вода́ → во́ду", and the Instrumental case after "з": "з молоко́м", "з лимо́ном". Try ordering a drink and a dessert!',
    keyPhrases: [
      { uk: 'Мо́жна мені́, будь ла́ска, ка́ву з молоко́м?', en: 'May I please have a coffee with milk?', grammarNote: 'ка́ву (Accusative) + з молоко́м (Instrumental)' },
      { uk: 'Я візьму́ льві́вський си́рник і зелений чай.', en: 'I will take Lviv cheesecake and green tea.', grammarNote: 'Inanimate masculine Accusative matches Nominative' },
      { uk: 'Принесі́ть, будь ла́ска, раху́нок.', en: 'Please bring the bill.', grammarNote: 'Polite plural imperative «принесі́ть»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Мо́жна мені́, будь ла́ска, ка́ву з молоко́м і си́рник?', en: 'Good day! May I please have a coffee with milk and a cheesecake?' },
      { uk: 'Я хо́чу замо́вити борщ зі смета́ною і узва́р, будь ла́ска.', en: 'I would like to order borshch with sour cream and uzvar, please.' },
    ],
  },
  {
    id: 'grocery-shopping-and-markets',
    number: 4,
    titleEn: 'Grocery Shopping and Markets',
    titleUk: 'Поку́пки на ри́нку та в суперма́ркеті',
    category: 'everyday',
    suggestedLevel: 'A1',
    aiRoleEn: 'Vendor at a fresh Ukrainian farmers’ market (база́р)',
    aiRoleUk: 'Продаве́ць на фермерському ри́нку',
    defaultFormality: 'formal',
    descriptionEn:
      'Ask for prices, weights (kilograms/grams), fresh fruits, vegetables, cheese, and pay by card or cash.',
    learningObjectives: [
      'Ask prices with «Скі́льки ко́штує...?» and «Скі́льки ко́штують...?»',
      'Use Genitive quantities after «кілогра́м», «пів кіло́», and «бага́то»',
      'Specify payment method: «ка́рткою» or «готі́вкою» (Instrumental)',
    ],
    relatedCourseModuleId: 'A1.4',
    openingByLevel: {
      beginnerUk: 'До́брий день! Подиві́ться, які́ сві́жі я́блука, помідо́ри і дома́шній сир! Що Вам зва́жити?',
      beginnerEn: 'Good day! Look what fresh apples, tomatoes, and cottage cheese we have! What can I weigh for you?',
      intermediateUk: 'Віта́ю на на́шому ри́нку! Сього́дні все сві́же з горо́ду: полуни́ця, огірки́, зе́лень і мед. Що бажа́єте купи́ти?',
      intermediateEn: 'Welcome to our market! Today everything is fresh from the garden: strawberries, cucumbers, herbs, and honey. What would you like to buy?',
      advancedUk: 'Підхо́дьте, будь ла́ска! Ма́ємо чудови́й карпа́тський сир, сві́жі бі́лі гриби́ та сокови́ті чере́шні. Чим мо́жу Вас сьогодні пора́дувати?',
      advancedEn: 'Come on up, please! We have wonderful Carpathian cheese, fresh porcini mushrooms, and juicy sweet cherries. What can I treat you to today?',
    },
    tutorIntroUk:
      'На ри́нку пі́сля слів «кілогра́м», «літр» та «бага́то» ми вжива́ємо Родови́й відмі́нок (Genitive): «кілогра́м я́блук», «пів кіло́ си́ру». Запита́й ціну́ і попроси́ зва́жити проду́кти!',
    tutorIntroEn:
      'At the market, after words like "кілогра́м", "літр", and "бага́то" we use the Genitive case: "кілогра́м я́блук", "пів кіло́ си́ру". Ask the price and ask to weigh some groceries!',
    keyPhrases: [
      { uk: 'Скі́льки ко́штує кілогра́м я́блук?', en: 'How much does a kilogram of apples cost?', grammarNote: 'кілогра́м + Genitive plural «я́блук»' },
      { uk: 'Да́йте, будь ла́ска, пів кіло́ дома́шнього си́ру.', en: 'Please give me half a kilo of cottage cheese.', grammarNote: 'Partitive/Genitive «дома́шнього си́ру»' },
      { uk: 'Я мо́жу заплати́ти ка́рткою?', en: 'Can I pay by card?', grammarNote: 'Instrumental of means «ка́рткою»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Скі́льки ко́штують ці черво́ні помідо́ри?', en: 'Good day! How much do these red tomatoes cost?' },
      { uk: 'Зва́жте мені́, будь ла́ска, кілогра́м я́блук і пів кіло́ си́ру.', en: 'Please weigh for me a kilogram of apples and half a kilo of cheese.' },
    ],
  },
  {
    id: 'asking-for-directions',
    number: 5,
    titleEn: 'Asking for Directions',
    titleUk: 'Як знайти́ доро́гу в мі́сті',
    category: 'travel',
    suggestedLevel: 'A1',
    aiRoleEn: 'Helpful local resident in central Kyiv',
    aiRoleUk: 'Ме́шканець Ки́єва',
    defaultFormality: 'formal',
    descriptionEn:
      'Ask politely how to get to the metro station, museum, pharmacy, or square, and understand directions.',
    learningObjectives: [
      'Ask «Перепро́шую, як діста́тися до + Genitive?» or «Де знахо́диться + Nominative?»',
      'Use spatial prepositions «бі́ля», «навпро́ти», «за ро́гом», «пря́мо і ліво́руч»',
      'Practice basic motion verbs «іти́ пі́шки» vs «ї́хати метро́»',
    ],
    relatedCourseModuleId: 'B1.1',
    openingByLevel: {
      beginnerUk: 'До́брий день! Ви шука́єте яку́сь ву́лицю чи ста́нцію метро́? Я мо́жу підказа́ти доро́гу!',
      beginnerEn: 'Good day! Are you looking for a street or metro station? I can show you the way!',
      intermediateUk: 'Віта́ю! Вигляда́є так, ні́би Ви шука́єте доро́гу в це́нтрі Ки́єва. Куди́ Вам потрі́бно діста́тися?',
      intermediateEn: 'Hello! It looks like you are looking for directions in central Kyiv. Where do you need to get to?',
      advancedUk: 'До́брого дня! Якщо́ зорієнтува́тися в старому́ це́нтрі непро́сто, з ра́дістю підкажу́ найкоротший маршру́т. Куди́ са́ме Ви пряму́єте?',
      advancedEn: 'Good day! If finding your way around the old center is tricky, I’d gladly point out the shortest route. Where exactly are you heading?',
    },
    tutorIntroUk:
      'Коли́ ми запи́туємо доро́гу, прийме́нник «до» завжди́ вимага́є Родово́го відмі́нка (Genitive): «до вокза́лу», «до ста́нції метро́», «до апте́ки». Запита́й, як діста́тися до потрібного мі́сця!',
    tutorIntroEn:
      'When asking for directions, the preposition "до" always requires the Genitive case: "до вокза́лу", "до ста́нції метро́", "до апте́ки". Ask how to get to a place in the city!',
    keyPhrases: [
      { uk: 'Перепро́шую, де знахо́диться найбли́жча ста́нція метро́?', en: 'Excuse me, where is the nearest metro station located?', grammarNote: 'знахо́диться + Nominative subject' },
      { uk: 'Як мені́ діста́тися до О́перного теа́тру?', en: 'How do I get to the Opera Theater?', grammarNote: 'до + Genitive masculine (-у)' },
      { uk: 'Туди́ кра́ще йти пі́шки чи ї́хати авто́бусом?', en: 'Is it better to walk there or go by bus?', grammarNote: 'йти (on foot) vs ї́хати + Instrumental (авто́бусом)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Перепро́шую, підкажі́ть, будь ла́ска, як діста́тися до ста́нції метро́?', en: 'Excuse me, could you please tell me how to get to the metro station?' },
      { uk: 'Чи далеко́ звідси йти пі́шки до центра́льної пло́щі?', en: 'Is it far from here to walk to the central square?' },
    ],
  },
  {
    id: 'taking-taxis-trains-and-buses',
    number: 6,
    titleEn: 'Taking Taxis, Trains, and Buses',
    titleUk: 'Пої́здка по́їздом, авто́бусом і таксі́',
    category: 'travel',
    suggestedLevel: 'A2',
    aiRoleEn: 'Train ticket clerk at Ukrzaliznytsia station',
    aiRoleUk: 'Каси́р на залізни́чному вокза́лі',
    defaultFormality: 'formal',
    descriptionEn:
      'Buy train or bus tickets, ask about departure times, platform numbers, and seat preferences.',
    learningObjectives: [
      'Buy tickets with «Мені́ потрі́бен квито́к до + Genitive на + Accusative time/date»',
      'Understand platform («ко́лія / перо́н») and carriage («ваго́н») numbers',
      'Distinguish one-way («в оди́н бік») and round-trip («туди́ й наза́д») tickets',
    ],
    relatedCourseModuleId: 'B1.1',
    openingByLevel: {
      beginnerUk: 'До́брий день! Залізни́чна ка́са. Куди́ Ви хо́чете пої́хати сього́дні?',
      beginnerEn: 'Good day! Train ticket desk. Where would you like to travel today?',
      intermediateUk: 'Віта́ю! Ка́са «Укрзалізни́ці». До яко́го мі́ста та на яку́ да́ту Вам потрі́бен квито́к?',
      intermediateEn: 'Greetings! Ukrzaliznytsia ticket counter. To which city and for what date do you need a ticket?',
      advancedUk: 'До́брого дня! Віта́ю на Центра́льному вокза́лі. Яки́й на́прямок, клас ваго́на та час відпра́влення Вас ціка́влять?',
      advancedEn: 'Good day! Welcome to the Central Station. Which destination, carriage class, and departure time interest you?',
    },
    tutorIntroUk:
      'Сього́дні купу́ємо квито́к на по́їзд. Зверни́ ува́гу: «квито́к до Льво́ва / до Оде́си» (Родови́й відмі́нок пі́сля «до»). Запита́й про квито́к, час відпра́влення та но́мер ко́лії!',
    tutorIntroEn:
      'Today we are buying a train ticket. Notice: "квито́к до Льво́ва / до Оде́си" (Genitive case after "до"). Ask for a ticket, departure time, and track number!',
    keyPhrases: [
      { uk: 'Мені́ потрі́бен оди́н квито́к до Льво́ва на за́втра.', en: 'I need one ticket to Lviv for tomorrow.', grammarNote: 'до + Genitive (Льво́ва), на + Accusative (за́втра)' },
      { uk: 'О котрі́й годи́ні відправля́ється швидкі́сний по́їзд?', en: 'At what time does the express train depart?', grammarNote: 'О котрі́й годи́ні (Locative time expression)' },
      { uk: 'З якої́ ко́лії відправля́ється наш по́їзд?', en: 'From which track does our train depart?', grammarNote: 'З + Genitive feminine (якої́ ко́лії)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Мені́ потрі́бен квито́к до Льво́ва в оди́н бік, будь ла́ска.', en: 'Good day! I need a one-way ticket to Lviv, please.' },
      { uk: 'О котрі́й годи́ні відправля́ється насту́пний по́їзд до Ки́єва?', en: 'At what time does the next train to Kyiv depart?' },
    ],
  },
  {
    id: 'checking-into-hotel-or-apartment',
    number: 7,
    titleEn: 'Checking into a Hotel or Apartment',
    titleUk: 'Засе́лення в готе́ль або́ кварти́ру',
    category: 'travel',
    suggestedLevel: 'A2',
    aiRoleEn: 'Hotel receptionist in Odesa',
    aiRoleUk: 'Адміністра́тор готе́лю',
    defaultFormality: 'formal',
    descriptionEn:
      'Confirm your reservation, ask about breakfast hours, Wi-Fi password, and room amenities.',
    learningObjectives: [
      'Confirm bookings with «У ме́не заброньо́ваний но́мер на ім’я́...»',
      'Ask about duration with «на скі́льки ноче́й» and facilities in the Locative case',
      'Make polite requests for keys, towels, or late check-out',
    ],
    relatedCourseModuleId: 'A2.5',
    openingByLevel: {
      beginnerUk: 'До́брий день! Ласка́во про́симо до на́шого готе́лю. У Вас є бронюва́ння?',
      beginnerEn: 'Good day! Welcome to our hotel. Do you have a reservation?',
      intermediateUk: 'Віта́ю в на́шому готе́лі! На чиє́ ім’я́ заброньо́вано но́мер і на скі́льки діб Ви зупиня́єтеся?',
      intermediateEn: 'Welcome to our hotel! Under whose name is the room reserved, and for how many nights are you staying?',
      advancedUk: 'До́брого дня! Ра́ді віта́ти Вас у на́шому готе́лі. Підкажі́ть, будь ла́ска, прі́звище для реєстра́ції та чи ма́єте особли́ві побажа́ння що́до но́мера?',
      advancedEn: 'Good day! Glad to welcome you to our hotel. Could you please give your last name for check-in and let me know if you have special room preferences?',
    },
    tutorIntroUk:
      'Заселя́ємося в готе́ль! Відпрацю́ймо фразу «У ме́не заброньо́ваний но́мер на три но́чі» та запита́ння про сніда́нок і інтерне́т.',
    tutorIntroEn:
      'Let’s check into a hotel! Practice the phrase "У ме́не заброньо́ваний но́мер на три но́чі" and questions about breakfast and Wi-Fi.',
    keyPhrases: [
      { uk: 'У ме́не заброньо́ваний но́мер на ім’я́...', en: 'I have a room reserved under the name...', grammarNote: 'Passive participle «заброньо́ваний»' },
      { uk: 'О котрі́й годи́ні у Вас сніда́нок?', en: 'What time is breakfast here?', grammarNote: 'О котрі́й годи́ні (Locative time)' },
      { uk: 'Підкажі́ть, будь ла́ска, паро́ль від вайфа́ю.', en: 'Could you please tell me the Wi-Fi password?', grammarNote: 'від + Genitive' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! У ме́не заброньо́ваний но́мер на дві но́чі.', en: 'Good day! I have a room reserved for two nights.' },
      { uk: 'Чи вхо́дить сніда́нок у ва́ртість но́мера?', en: 'Is breakfast included in the room price?' },
    ],
  },
  {
    id: 'talking-about-daily-routine',
    number: 8,
    titleEn: 'Talking About Daily Routine',
    titleUk: 'Розпоря́док дня та звича́йні спра́ви',
    category: 'everyday',
    suggestedLevel: 'A2',
    aiRoleEn: 'Friendly Ukrainian conversation partner',
    aiRoleUk: 'Дру́жній співрозмо́вник',
    defaultFormality: 'informal',
    descriptionEn:
      'Describe when you wake up, what you eat for breakfast, how you spend your workday, and how you relax in the evening.',
    learningObjectives: [
      'Conjugate reflexive daily routine verbs in «-ся» (прокида́тися, вмива́тися, одяга́тися)',
      'Use time expressions («о сьо́мій ра́нку», «вве́чері», «пі́сля робо́ти»)',
      'Sequence events with «споча́тку», «поті́м», «після цьо́го»',
    ],
    relatedCourseModuleId: 'A2.4',
    openingByLevel: {
      beginnerUk: 'О котрі́й годи́ні ти зазвича́й прокида́єшся вранці і що ти ро́биш споча́тку?',
      beginnerEn: 'What time do you usually wake up in the morning and what do you do first?',
      intermediateUk: 'Розкажи́ про свій звича́йний день! Коли́ ти прокида́єшся, як мина́є твій ра́нок і чим займа́єшся вве́чері?',
      intermediateEn: 'Tell me about your typical day! When do you wake up, how does your morning go, and what do you do in the evening?',
      advancedUk: 'Як вигляда́є твій ідеа́льний робо́чий ритм? Чи вдається тобі́ поєднувати інтенси́вну робо́ту з ча́сом для ви́вчення мов і відпочи́нку?',
      advancedEn: 'What does your ideal daily rhythm look like? Do you manage to balance intensive work with time for language learning and rest?',
    },
    tutorIntroUk:
      'Сього́дні ми трену́ємо зворотні дієслова́ на «-ся» (прокида́тися → я прокида́юся, ти прокида́єшся). Розкажи́, коли́ ти прокида́єшся і що ро́биш уранці!',
    tutorIntroEn:
      'Today we are practicing reflexive verbs in "-ся" (прокида́тися → я прокида́юся, ти прокида́єшся). Tell me when you wake up and what you do in the morning!',
    keyPhrases: [
      { uk: 'Зазвича́й я прокида́юся о сьо́мій годи́ні ра́нку.', en: 'Usually I wake up at seven o’clock in the morning.', grammarNote: 'Reflexive verb «прокида́юся» + о + Locative feminine ordinal' },
      { uk: 'Споча́тку я п’ю ка́ву і сні́даю, а поті́м працю́ю.', en: 'First I drink coffee and have breakfast, and then I work.', grammarNote: 'Imperfective present for habitual actions' },
      { uk: 'Уве́чері я відпочива́ю і чита́ю украї́нські книжки́.', en: 'In the evening I rest and read Ukrainian books.', grammarNote: 'Accusative plural «украї́нські книжки́»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я прокида́юся о сьо́мій ра́нку, вмива́юся і готу́ю сніда́нок.', en: 'I wake up at seven in the morning, wash up, and make breakfast.' },
      { uk: 'Удень я ба́гато працю́ю, а вве́чері вивча́ю украї́нську мо́ву.', en: 'During the day I work a lot, and in the evening I study Ukrainian.' },
    ],
  },
  {
    id: 'talking-about-family-and-friends',
    number: 9,
    titleEn: 'Talking About Family and Friends',
    titleUk: 'Ро́зповідь про роди́ну та дру́зів',
    category: 'social',
    suggestedLevel: 'A1',
    aiRoleEn: 'Warm Ukrainian friend sharing family stories',
    aiRoleUk: 'Близьки́й друг',
    defaultFormality: 'informal',
    descriptionEn:
      'Talk about your family members, close friends, what they are like, and what you enjoy doing together.',
    learningObjectives: [
      'Use «У ме́не є + Nominative» and «У ме́не нема́є + Genitive» for siblings and relatives',
      'Describe personality and interests with adjectives and «ми ра́зом + verb»',
      'Use the Instrumental case after «з/із» («з бра́том», «з по́другою»)',
    ],
    relatedCourseModuleId: 'A1.4',
    openingByLevel: {
      beginnerUk: 'Розкажи́ про свою́ роди́ну або́ дру́зів! У те́бе є брат, сестра́ чи дома́шній улю́бленець?',
      beginnerEn: 'Tell me about your family or friends! Do you have a brother, sister, or pet?',
      intermediateUk: 'Мені́ ду́же ціка́во почу́ти про твою́ сім’ю́ та дру́зів. З ким ти найчасті́ше спілку́єшся і як ви прово́дите час ра́зом?',
      intermediateEn: 'I would love to hear about your family and friends. Who do you talk with most often, and how do you spend time together?',
      advancedUk: 'Родинні тради́ції та бли́зькі дру́зі відіграю́ть величе́зну роль у житті́. Розкажи́ про люде́й, які́ ма́ють найбільший вплив на те́бе.',
      advancedEn: 'Family traditions and close friends play a huge role in life. Tell me about the people who have the greatest influence on you.',
    },
    tutorIntroUk:
      'Зверни́ ува́гу на різни́цю: «У ме́не є ста́рший брат» (Називни́й відмі́нок), але́ при запере́ченні — «У ме́не нема́є ста́ршого бра́та» (Родови́й відмі́нок). Розкажи́ про свою́ роди́ну!',
    tutorIntroEn:
      'Notice the contrast: "У ме́не є ста́рший брат" (Nominative), but in negation — "У ме́не нема́є ста́ршого бра́та" (Genitive). Tell me about your family!',
    keyPhrases: [
      { uk: 'У ме́не вели́ка і дру́жня роди́на.', en: 'I have a big and friendly family.', grammarNote: 'Nominative feminine adjectives + noun' },
      { uk: 'Ми ча́сто зуcтріча́ємося з дру́зями на вихідни́х.', en: 'We often meet up with friends on the weekends.', grammarNote: 'з + Instrumental plural «дру́зями»' },
      { uk: 'Моя́ сестра́ працю́є лі́карем і живе́ в іншому мі́сті.', en: 'My sister works as a doctor and lives in another city.', grammarNote: 'працю́є + Instrumental profession' },
    ],
    suggestedLearnerStarters: [
      { uk: 'У ме́не є ста́рша сестра́ і моло́дший брат.', en: 'I have an older sister and a younger brother.' },
      { uk: 'На вихідни́х я люблю́ гуля́ти в па́рку з мої́ми дру́зями.', en: 'On weekends I like walking in the park with my friends.' },
    ],
  },
  {
    id: 'hobbies-music-books-and-films',
    number: 10,
    titleEn: 'Hobbies, Music, Books, and Films',
    titleUk: 'Хо́бі, му́зика, книжки́ та кіно́',
    category: 'social',
    suggestedLevel: 'A2',
    aiRoleEn: 'Ukrainian culture & arts enthusiast',
    aiRoleUk: 'Поціно́вувач му́зики, книг і кіно́',
    defaultFormality: 'informal',
    descriptionEn:
      'Discuss your favorite hobbies, Ukrainian and world music, books you are reading, and films you recommend.',
    learningObjectives: [
      'Express likes with «Мені́ подо́бається + infinitive/noun» (Dative experiencer)',
      'Use «захо́плюватися / ціка́витися + Instrumental» for hobbies',
      'Describe impressions of books, songs, and movies',
    ],
    relatedCourseModuleId: 'A2.2',
    openingByLevel: {
      beginnerUk: 'Що ти лю́биш роби́ти у вільний час? Яку́ му́зику чи фільми ти лю́биш?',
      beginnerEn: 'What do you like doing in your free time? What music or movies do you like?',
      intermediateUk: 'Чим ти захо́плюєшся у вільний час? Яку́ ціка́ву кни́гу чи фі́льм ти нещода́вно прочита́в або́ подиви́вся?',
      intermediateEn: 'What are your hobbies in your free time? What interesting book or film have you read or watched recently?',
      advancedUk: 'Які́ книжки́, музи́чні гурти́ чи кінофільми оста́ннім ча́сом спра́вили на те́бе найсильні́ше вра́ження? Чи знайо́мий ти з суча́сною украї́нською сце́ною?',
      advancedEn: 'Which books, bands, or films have made the strongest impression on you lately? Are you familiar with the contemporary Ukrainian scene?',
    },
    tutorIntroUk:
      'У цьо́му сцена́рії практику́ємо конструкцію «Мені́ подо́бається...» (Дава́льний відмі́нок «мені́») та дієслово́ «ціка́витися + Ору́дний відмі́нок» (му́зикою, істо́рією, кіно́). Розкажи́ про свої́ захо́плення!',
    tutorIntroEn:
      'In this scenario we practice "Мені́ подо́бається..." (Dative "мені́") and "ціка́витися + Instrumental" (му́зикою, істо́рією, кіно́). Tell me about your interests!',
    keyPhrases: [
      { uk: 'Мені́ ду́же подо́бається слу́хати суча́сну украї́нську му́зику.', en: 'I really like listening to modern Ukrainian music.', grammarNote: 'Мені́ (Dative) + подо́бається + infinitive' },
      { uk: 'Я ціка́влюся істо́рією, літерату́рою та фотогра́фією.', en: 'I am interested in history, literature, and photography.', grammarNote: 'ціка́витися + Instrumental (-єю, -ою)' },
      { uk: 'Нещода́вно я подиви́вся ду́же ціка́вий фі́льм.', en: 'Recently I watched a very interesting film.', grammarNote: 'Perfective past «подиви́вся»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'У вільний час мені́ подо́бається чита́ти книжки́ і слу́хати му́зику.', en: 'In my free time I like reading books and listening to music.' },
      { uk: 'Я ціка́влюся кіно́ і спортом, а також люблю́ готува́ти.', en: 'I am interested in cinema and sports, and I also like cooking.' },
    ],
  },
  {
    id: 'making-plans-with-friends',
    number: 11,
    titleEn: 'Making Plans with Friends',
    titleUk: 'Плани з дру́зями на вихідні́',
    category: 'social',
    suggestedLevel: 'A2',
    aiRoleEn: 'Ukrainian friend planning a weekend outing',
    aiRoleUk: 'Друг, з яки́м ви плану́єте зу́стріч',
    defaultFormality: 'informal',
    descriptionEn:
      'Suggest a time and place to meet, negotiate schedules, and agree on weekend activities.',
    learningObjectives: [
      'Invite with «Дава́й зустрі́немося...» and «Ході́мо до/в...»',
      'Use days of the week with «у/в + Accusative» (у субо́ту, в неді́лю)',
      'Use future tense forms (synthetic «робити́му» and analytic «бу́ду роби́ти» / perfective «зустрі́немося»)',
    ],
    relatedCourseModuleId: 'A2.1',
    openingByLevel: {
      beginnerUk: 'Приві́т! Що ти ро́биш у субо́ту? Дава́й зустрі́немося і ви́п’ємо ка́ви!',
      beginnerEn: 'Hi! What are you doing on Saturday? Let’s meet up and grab a coffee!',
      intermediateUk: 'Приві́т! Ско́ро вихідні́. Які́ в те́бе пла́ни на субо́ту чи неді́лю? Мо́же, пі́демо куди́сь ра́зом?',
      intermediateEn: 'Hi! The weekend is coming up. What are your plans for Saturday or Sunday? Maybe we can go somewhere together?',
      advancedUk: 'Приві́т! Давно́ не ба́чилися наживо. Як ди́вишся на те, щоб вибратися куди́сь ци́ми вихідни́ми — на ви́ставку, у кав’я́рню чи про́сто прогуля́тися мі́стом?',
      advancedEn: 'Hi! Long time no see in person. How do you feel about heading out this weekend — to an exhibition, a café, or just for a stroll around town?',
    },
    tutorIntroUk:
      'Плану́ємо зу́стріч! Для днів ти́жня з прийме́нником «у/в» вжива́ємо Знахі́дний відмі́нок: «у п’я́тницю», «в субо́ту», «у неді́лю». Запропону́й час і мі́сце зу́стрічі!',
    tutorIntroEn:
      'Let’s plan a meetup! For days of the week with "у/в" we use the Accusative case: "у п’я́тницю", "в субо́ту", "у неді́лю". Suggest a time and place to meet!',
    keyPhrases: [
      { uk: 'Дава́й зустрі́немося в субо́ту о дру́гій годи́ні бі́ля па́рку!', en: 'Let’s meet on Saturday at two o’clock near the park!', grammarNote: 'в субо́ту (Accusative) + о дру́гій (Locative) + бі́ля па́рку (Genitive)' },
      { uk: 'У неді́лю вве́чері я ві́льний / ві́льна.', en: 'On Sunday evening I am free.', grammarNote: 'Gender agreement on adjective «ві́льний / ві́льна»' },
      { uk: 'Чудо́ва іде́я! Домо́вилися!', en: 'Great idea! It’s a deal!', grammarNote: 'Natural conversational agreement' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Із задово́ленням! Дава́й зустрі́немося в субо́ту вранці у кав’я́рні.', en: 'With pleasure! Let’s meet on Saturday morning at the coffeehouse.' },
      { uk: 'У субо́ту я зайняти́й, але́ в неді́лю я ві́льний ці́лий день.', en: 'On Saturday I am busy, but on Sunday I am free all day.' },
    ],
  },
  {
    id: 'weather-and-seasons',
    number: 12,
    titleEn: 'Weather and Seasons',
    titleUk: 'Пого́да та по́ри ро́ку',
    category: 'everyday',
    suggestedLevel: 'A2',
    aiRoleEn: 'Ukrainian neighbor chatting about the weather and seasonal plans',
    aiRoleUk: 'Приві́тний сусі́д',
    defaultFormality: 'informal',
    descriptionEn:
      'Describe today’s weather, compare the four seasons in Ukraine and your home country, and discuss clothing.',
    learningObjectives: [
      'Use impersonal weather expressions («Сього́дні те́пло, со́нячно, прохоло́дно, па́дає дощ/сніг»)',
      'Use seasonal adverbs («навесні́, влі́тку, восени́, взи́мку»)',
      'Compare climates using comparative adjectives («теплі́ше, холодні́ше»)',
    ],
    relatedCourseModuleId: 'A2.5',
    openingByLevel: {
      beginnerUk: 'Яка́ сього́дні пого́да у твоє́му мі́сті — те́пло чи хо́лодно? Яку́ пору́ ро́ку ти лю́биш?',
      beginnerEn: 'What is the weather like today in your city — warm or cold? Which season do you like?',
      intermediateUk: 'Погля́нь у вікно́! Яка́ за́раз пого́да там, де ти живе́ш, і яка́ твоя́ улю́блена пора́ ро́ку?',
      intermediateEn: 'Look out the window! What is the weather like right now where you live, and what is your favorite season?',
      advancedUk: 'Кліма́тичні контра́сти між рі́зними регіо́нами завжди́ диву́ють. Яка́ за́раз пого́да у твої́х кра́ях і яки́й сезо́н дає́ тобі́ найбільше енергії?',
      advancedEn: 'Climatic contrasts between regions are always fascinating. What is the weather like in your area right now, and which season gives you the most energy?',
    },
    tutorIntroUk:
      'В украї́нській мо́ві про пого́ду ка́жуть безособо́во: «Сього́дні со́нячно і те́пло» та «Йде дощ» або́ «Па́дає сніг», а по́ри ро́ку вжива́ють як прислі́вники: «навесні́, влі́тку, восени́, взи́мку». Опиши́ пого́ду сього́дні!',
    tutorIntroEn:
      'In Ukrainian, weather is described impersonally: "Сього́дні со́нячно і те́пло" and "Йде дощ" or "Па́дає сніг", and seasons use adverbs: "навесні́, влі́тку, восени́, взи́мку". Describe today’s weather!',
    keyPhrases: [
      { uk: 'Сього́дні на вулиці со́нячно і до́сить те́пло.', en: 'Today outside it is sunny and quite warm.', grammarNote: 'Impersonal adverbs «со́нячно, те́пло»' },
      { uk: 'Найбі́льше я люблю́ весну́ та зо́лоту о́сінь.', en: 'Most of all I love spring and golden autumn.', grammarNote: 'Accusative feminine «весну́, о́сінь»' },
      { uk: 'Узи́мку в Карпа́тах па́дає густи́й сніг.', en: 'In winter heavy snow falls in the Carpathians.', grammarNote: 'Adverb «узи́мку» + Locative plural «в Карпа́тах»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Сього́дні у на́шому мі́сті со́нячно, але́ тро́хи вітряно.', en: 'Today in our city it is sunny, but a little windy.' },
      { uk: 'Я ду́же люблю́ лі́то і весну́, тому́ що я не люблю́ хо́лод.', en: 'I really love summer and spring because I do not like the cold.' },
    ],
  },
  {
    id: 'shopping-for-clothes-and-gifts',
    number: 13,
    titleEn: 'Shopping for Clothes and Gifts',
    titleUk: 'Купі́вля о́дягу та подару́нків',
    category: 'practical',
    suggestedLevel: 'A2',
    aiRoleEn: 'Shop assistant in a Ukrainian boutique and vyshyvanka shop',
    aiRoleUk: 'Продаве́ць-консульта́нт у магази́ні о́дягу',
    defaultFormality: 'formal',
    descriptionEn:
      'Look for clothing or a Ukrainian gift (such as a vyshyvanka), ask to try on sizes, compare colors, and discuss fit.',
    learningObjectives: [
      'Use demonstratives «цей, ця, це, ці» across genders and cases',
      'Use Dative with «Мені́ пасу́є / підхо́дить...» (It suits / fits me)',
      'Compare sizes and prices with comparative adjectives («бі́льший, ме́нший, деше́вший»)',
    ],
    relatedCourseModuleId: 'A2.3',
    openingByLevel: {
      beginnerUk: 'До́брий день! Чим я мо́жу Вам допомогти́? Ви шука́єте о́дяг для се́бе чи подару́нок?',
      beginnerEn: 'Good day! How can I help you? Are you looking for clothes for yourself or a gift?',
      intermediateUk: 'Віта́ю в на́шому магази́ні! Ми ма́ємо чудови́й ви́бір суча́сного о́дягу та вишива́нок. Що са́ме Ви шука́єте і яки́й у Вас ро́змір?',
      intermediateEn: 'Welcome to our shop! We have a great selection of modern clothing and vyshyvankas. What exactly are you looking for, and what is your size?',
      advancedUk: 'До́брого дня! Ласка́во про́симо до на́шої крамни́ці украї́нських брендів. Шука́єте щось особли́ве для се́бе чи автенти́чний подару́нок для близьки́х?',
      advancedEn: 'Good day! Welcome to our Ukrainian brands boutique. Are you looking for something special for yourself or an authentic gift for loved ones?',
    },
    tutorIntroUk:
      'У магази́ні ми трену́ємо конструкції «Я шука́ю + Знахі́дний відмі́нок», «Де мо́жна примі́ряти?» та «Ця соро́чка мені́ пасу́є» (Дава́льний відмі́нок). Скажи́, що ти хо́чеш купи́ти!',
    tutorIntroEn:
      'In the clothing shop we practice "Я шука́ю + Accusative", "Де мо́жна примі́ряти?", and "Ця соро́чка мені́ пасу́є" (Dative). Tell me what you would like to buy!',
    keyPhrases: [
      { uk: 'Я шука́ю вишива́нку або́ те́плий све́тр на подару́нок.', en: 'I am looking for a vyshyvanka or a warm sweater as a gift.', grammarNote: 'Accusative feminine «вишива́нку»' },
      { uk: 'Чи є у Вас такий са́мий, але́ на ро́змір бі́льший?', en: 'Do you have the same one, but one size larger?', grammarNote: 'Comparative adjective «бі́льший»' },
      { uk: 'Де у Вас приме́рочна? Я хо́чу це примі́ряти.', en: 'Where is your fitting room? I want to try this on.', grammarNote: 'Perfective infinitive «примі́ряти»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Я шука́ю бі́лу вишива́нку середнього ро́зміру.', en: 'Good day! I am looking for a medium-sized white vyshyvanka.' },
      { uk: 'Мо́жна примі́ряти цю си́ню ку́ртку? Вона́ ду́же гарна.', en: 'May I try on this blue jacket? It is very nice.' },
    ],
  },
  {
    id: 'visiting-doctor-or-pharmacy',
    number: 14,
    titleEn: 'Visiting a Doctor or Pharmacy',
    titleUk: 'Візи́т до лі́каря або́ в апте́ку',
    category: 'practical',
    suggestedLevel: 'B1',
    aiRoleEn: 'Caring Ukrainian family doctor / pharmacist',
    aiRoleUk: 'Сіме́йний лі́кар / фармаце́вт',
    defaultFormality: 'formal',
    descriptionEn:
      'Describe symptoms (headache, sore throat, fever), understand medical advice, and ask for medicine at a pharmacy.',
    learningObjectives: [
      'Describe pain with «У ме́не боли́ть + singular noun» / «боля́ть + plural noun»',
      'Describe states with «Мені́ зле / хо́лодно» and «У ме́не температу́ра / ка́шель»',
      'Ask for remedies with «Що Ви пора́дите від + Genitive?»',
    ],
    relatedCourseModuleId: 'B1.9',
    openingByLevel: {
      beginnerUk: 'До́брий день! Я лі́кар. Як Ви себе́ почува́єте? Що у Вас боли́ть?',
      beginnerEn: 'Good day! I am the doctor. How do you feel? What hurts?',
      intermediateUk: 'Добро́го дня! Прохо́дьте, сіда́йте, будь ла́ска. На що ска́ржитеся і відко́ли Ви себе́ пога́но почува́єте?',
      intermediateEn: 'Good day! Come in, have a seat, please. What are your symptoms, and since when have you been feeling unwell?',
      advancedUk: 'Віта́ю! Розкажі́ть дета́льно про Ва́ше самопочуття́: які́ симпто́ми Вас турбу́ють, чи підніма́лася температу́ра та чи прийма́ли вже які́сь лі́ки?',
      advancedEn: 'Greetings! Tell me in detail about how you feel: what symptoms are bothering you, have you had a fever, and have you taken any medication yet?',
    },
    tutorIntroUk:
      'У кабіне́ті лі́каря вжива́ємо конструкцію «У ме́не боли́ть голова́ / го́рло» та «лі́ки від ка́шлю / від бі́лю» (Родови́й відмі́нок пі́сля «від»). Опиши́ свої́ симпто́ми!',
    tutorIntroEn:
      'At the doctor’s office we use "У ме́не боли́ть голова́ / го́рло" and "лі́ки від ка́шлю / від бо́лю" (Genitive after "від"). Describe your symptoms!',
    keyPhrases: [
      { uk: 'У ме́не вже два дні боли́ть го́рло і голова́.', en: 'My throat and head have been hurting for two days already.', grammarNote: 'У + Genitive + боли́ть + Nominative subject' },
      { uk: 'Пора́дьте, будь ла́ска, щось діє́ве від засту́ди та ка́шлю.', en: 'Please recommend something effective for a cold and cough.', grammarNote: 'від + Genitive (від засту́ди, від ка́шлю)' },
      { uk: 'Як ча́сто потрі́бно прийма́ти ці лі́ки — до чи пі́сля ї́жі?', en: 'How often should I take this medicine — before or after food?', grammarNote: 'до/пі́сля + Genitive feminine (ї́жі)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Я пога́но себе́ почува́ю, у ме́не боли́ть го́рло і є невели́ка температу́ра.', en: 'Good day! I feel unwell, my throat hurts and I have a slight fever.' },
      { uk: 'Що Ви мо́жете пора́дити від си́льного головного́ бо́лю?', en: 'What can you recommend for a strong headache?' },
    ],
  },
  {
    id: 'handling-travel-or-booking-problem',
    number: 15,
    titleEn: 'Handling a Travel or Booking Problem',
    titleUk: 'Ви́рішення пробле́ми з пої́здкою чи бронюва́нням',
    category: 'travel',
    suggestedLevel: 'B1',
    aiRoleEn: 'Customer service representative at a hotel / transport desk',
    aiRoleUk: 'Представни́к слу́жби підтри́мки',
    defaultFormality: 'formal',
    descriptionEn:
      'Explain a delayed train, missing luggage, or room booking mistake calmly and negotiate a solution.',
    learningObjectives: [
      'Explain problems clearly using past perfective verbs («запізни́вся», «загуби́вся», «скасува́ли»)',
      'Use conditional and polite request structures («Чи могли́ б Ви...», «Як нам ви́рішити...»)',
      'Express cause and result with «тому́ що», «че́рез те, що», and «тож»',
    ],
    relatedCourseModuleId: 'B1.10',
    openingByLevel: {
      beginnerUk: 'До́брий день! Слу́жба підтри́мки. Яка́ пробле́ма у Вас ста́лася? Як я мо́жу допомогти́?',
      beginnerEn: 'Good day! Customer support. What problem happened? How can I help?',
      intermediateUk: 'Віта́ю! Я адміністра́тор слу́жби підтри́мки. Розкажі́ть, будь ла́ска, що ста́лося з Ва́шим бронюва́нням чи пої́здкою?',
      intermediateEn: 'Greetings! I am the customer support manager. Please tell me what happened with your booking or trip?',
      advancedUk: 'До́брого дня! Приймі́ть на́ші вибачення за незру́чності. Опиші́ть ситуа́цію якнайдета́льніше, щоб ми могли́ нега́йно запропонува́ти Вам рі́шення чи компенса́цію.',
      advancedEn: 'Good day! Please accept our apologies for the inconvenience. Describe the situation in detail so we can immediately offer you a solution or compensation.',
    },
    tutorIntroUk:
      'Вчи́мося вві́чливо ви́рішувати пробле́ми: використовуй вві́чливий умо́вний спо́сіб «Чи могли́ б Ви переві́рити / заміни́ти...?» та поясни́ причи́ну че́рез «тому́ що» або́ «че́рез запі́знення».',
    tutorIntroEn:
      'Let’s practice solving travel problems politely: use the polite conditional "Чи могли́ б Ви переві́рити / заміни́ти...?" and explain the cause with "тому́ що" or "че́рез запі́знення".',
    keyPhrases: [
      { uk: 'Ви́бачте, але́ в моє́му но́мері не працю́є опа́лення.', en: 'Excuse me, but the heating is not working in my room.', grammarNote: 'в + Locative («в моє́му но́мері»)' },
      { uk: 'Мій по́їзд запізни́вся на дві годи́ни че́рез него́ду.', en: 'My train was delayed by two hours due to bad weather.', grammarNote: 'че́рез + Accusative («че́рез него́ду»)' },
      { uk: 'Чи могли́ б Ви, будь ла́ска, змі́нити мій квито́к на насту́пний рейс?', en: 'Could you please change my ticket to the next departure?', grammarNote: 'Polite conditional «Чи могли́ б Ви»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Перепро́шую, я забронюва́в ти́хий но́мер, але́ вікна вихо́дять на гучну́ ву́лицю.', en: 'Excuse me, I booked a quiet room, but the windows face a noisy street.' },
      { uk: 'Мій авто́бус запізни́вся, і я пропусти́в свій по́їзд. Чи мо́жна обміня́ти квито́к?', en: 'My bus was late and I missed my train. Is it possible to exchange the ticket?' },
    ],
  },
  {
    id: 'talking-about-past-experiences-and-memories',
    number: 16,
    titleEn: 'Talking About Past Experiences and Memories',
    titleUk: 'Спо́гади та життє́вий до́свід',
    category: 'social',
    suggestedLevel: 'A2',
    aiRoleEn: 'Thoughtful Ukrainian friend swapping travel and life memories',
    aiRoleUk: 'Ува́жний співрозмо́вник',
    defaultFormality: 'informal',
    descriptionEn:
      'Share a memorable trip, childhood story, or milestone from your past using accurate past-tense forms.',
    learningObjectives: [
      'Form past tense correctly by gender and number (-в, -ла, -ло, -ли)',
      'Contrast imperfective process («ми гуля́ли») with perfective result («ми поба́чили»)',
      'Use time markers («мину́лого ро́ку», «в дити́нстві», «колись»)',
    ],
    relatedCourseModuleId: 'A2.1',
    openingByLevel: {
      beginnerUk: 'Що ціка́вого ти роби́в або́ роби́ла мину́лого лі́та? Куди́ ти ї́здив у подо́рож?',
      beginnerEn: 'What interesting things did you do last summer? Where did you travel?',
      intermediateUk: 'Розкажи́ про яку́сь незабу́тню пої́здку або́ теплий спо́гад із мину́лого ро́ку! Що тобі́ найбільше запам’ята́лося?',
      intermediateEn: 'Tell me about an unforgettable trip or a warm memory from last year! What stood out to you the most?',
      advancedUk: 'Яка́ поді́я чи мандрі́вка з мину́лого найсильні́ше змі́нила твій по́гляд на світ? Поділи́ся цим спо́гадом.',
      advancedEn: 'Which event or journey from the past changed your perspective on the world the most? Share that memory.',
    },
    tutorIntroUk:
      'У мину́лому ча́сі украї́нські дієслова́ змі́нюються за ро́дом: чолові́чий «я бу́в / ба́чив», жіно́чий «я була́ / ба́чила», множина́ «ми були́ / ба́чили». Розкажи́ про свою́ улю́блену пої́здку!',
    tutorIntroEn:
      'In the past tense, Ukrainian verbs agree in gender: masculine "я був / ба́чив", feminine "я була́ / ба́чила", plural "ми були́ / ба́чили". Tell me about a favorite trip!',
    keyPhrases: [
      { uk: 'Мину́лого лі́та ми ї́здили в го́ри і ба́чили неймові́рні краєви́ди.', en: 'Last summer we traveled to the mountains and saw incredible views.', grammarNote: 'Genitive of time «мину́лого лі́та» + multidirectional past «ї́здили»' },
      { uk: 'Це була́ одна́ з найкра́щих по́дорожей у моє́му житті́.', en: 'It was one of the best trips in my life.', grammarNote: 'Superlative Genitive plural «найкра́щих по́дорожей»' },
      { uk: 'Мені́ найбільше запам’ята́лася гости́нність місце́вих люде́й.', en: 'What I remembered most was the hospitality of the local people.', grammarNote: 'Reflexive perfective «запам’ята́лася»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Мину́лого ро́ку я ї́здив до Євро́пи і відві́дав ба́гато ціка́вих міст.', en: 'Last year I traveled to Europe and visited many interesting cities.' },
      { uk: 'Коли́ я була́ мале́нькою, ми ко́жного лі́та відпочива́ли бі́ля мо́ря.', en: 'When I was little, we vacationed by the sea every summer.' },
    ],
  },
  {
    id: 'talking-about-future-plans-and-goals',
    number: 17,
    titleEn: 'Talking About Future Plans and Goals',
    titleUk: 'Майбу́тні пла́ни, мрі́ї та ці́лі',
    category: 'social',
    suggestedLevel: 'A2',
    aiRoleEn: 'Supportive Ukrainian friend discussing goals and ambitions',
    aiRoleUk: 'Натхне́нний співрозмо́вник',
    defaultFormality: 'informal',
    descriptionEn:
      'Talk about your goals for the coming year, places in Ukraine you want to visit, and skills you plan to master.',
    learningObjectives: [
      'Use all three Ukrainian future patterns: perfective («пої́ду»), analytic («бу́ду вчи́ти»), and synthetic («вчити́му»)',
      'Express purpose with «щоб + infinitive»',
      'Talk about dreams with «Я мрі́ю про + Accusative»',
    ],
    relatedCourseModuleId: 'A2.1',
    openingByLevel: {
      beginnerUk: 'Які́ в те́бе пла́ни на насту́пний рік? Яке́ мі́сто в Украї́ні ти хо́чеш поба́чити?',
      beginnerEn: 'What are your plans for next year? Which city in Ukraine do you want to see?',
      intermediateUk: 'Про що ти мрі́єш і які́ ці́лі ста́виш пе́ред собо́ю на найбли́жчий рік? Як плану́єш продовжувати ви́вчення украї́нської?',
      intermediateEn: 'What do you dream about, and what goals are you setting for the coming year? How do you plan to continue learning Ukrainian?',
      advancedUk: 'Які́ довгостроко́ві проє́кти та особи́сті ці́лі надиха́ють те́бе за́раз? Як ти ба́чиш свій ро́звиток че́рез кі́лька ро́ків?',
      advancedEn: 'What long-term projects and personal goals inspire you right now? How do you envision your growth in a few years?',
    },
    tutorIntroUk:
      'В украї́нській мо́ві є особл́ива синтети́чна фо́рма майбутнього ча́су на «-му, -меш, -мемо»: «я працювати́му», «я вивчати́му украї́нську», а для результа́ту — доко́наний вид «я пої́ду до Ки́єва». Розкажи́ про свої́ пла́ни!',
    tutorIntroEn:
      'Ukrainian has a special synthetic future tense in "-му, -меш, -мемо": "я працювати́му", "я вивчати́му украї́нську", and for completed results — perfective "я пої́ду до Ки́єва". Tell me about your plans!',
    keyPhrases: [
      { uk: 'Насту́пного ро́ку я обов’язко́во пої́ду до Ки́єва та Льво́ва.', en: 'Next year I will definitely travel to Kyiv and Lviv.', grammarNote: 'Genitive of time «насту́пного ро́ку» + perfective future «пої́ду»' },
      { uk: 'Я щодня́ практикувати́му украї́нську, щоб ві́льно розмовля́ти.', en: 'I will practice Ukrainian every day in order to speak fluently.', grammarNote: 'Synthetic future «практикувати́му» + purpose clause «щоб»' },
      { uk: 'Я мрі́ю підня́тися на Гове́рлу в Карпа́тах.', en: 'I dream of climbing Hoverla in the Carpathians.', grammarNote: 'підня́тися на + Accusative («на Гове́рлу»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я плану́ю щодня́ чита́ти і слу́хати подка́сти украї́нською мо́вою.', en: 'I plan to read and listen to podcasts in Ukrainian every day.' },
      { uk: 'Коли́ я ві́льно розмовляти́му украї́нською, я пої́ду в подо́рож Карпа́тами.', en: 'When I speak Ukrainian fluently, I will take a trip through the Carpathians.' },
    ],
  },
  {
    id: 'work-study-and-career',
    number: 18,
    titleEn: 'Work, Study, and Career',
    titleUk: 'Робо́та, навча́ння та кар’є́ра',
    category: 'professional',
    suggestedLevel: 'B1',
    aiRoleEn: 'Ukrainian colleague at an international coworking space',
    aiRoleUk: 'Коле́га у ково́ркінгу',
    defaultFormality: 'auto',
    descriptionEn:
      'Discuss your profession, university studies, remote work habits, and career path.',
    learningObjectives: [
      'Use «працюва́ти + Instrumental» for professions («працю́ю інжене́ром, викладаче́м, диза́йнером»)',
      'Discuss fields of study with «вивча́ти + Accusative» and «навча́тися в університе́ті»',
      'Describe responsibilities and work-life balance',
    ],
    relatedCourseModuleId: 'B2.5',
    openingByLevel: {
      beginnerUk: 'Ким ти працю́єш або́ що ти вивча́єш? Тобі́ подо́бається твоя́ робо́та?',
      beginnerEn: 'What do you do for work or what do you study? Do you like your job?',
      intermediateUk: 'Розкажи́ про свою́ профе́сію чи навча́ння! У які́й сфе́рі ти працю́єш і що тобі́ найбільше подо́бається у твої́й спра́ві?',
      intermediateEn: 'Tell me about your profession or studies! What field do you work in, and what do you enjoy most about your work?',
      advancedUk: 'Як змінюється твоя́ професі́йна сфе́ра оста́нніми рока́ми? Що для те́бе найважливі́ше в робо́ті — творча свобо́да, кома́нда чи суспі́льна ко́ристь?',
      advancedEn: 'How has your professional field been changing in recent years? What matters most to you at work — creative freedom, the team, or social impact?',
    },
    tutorIntroUk:
      'Зверни́ ува́гу: з дієслово́м «працюва́ти» назва профе́сії завжди́ стої́ть в Ору́дному відмі́нку (Instrumental): «Я працю́ю програмі́стом / менеджеркою / лі́карем». Розкажи́ про свою́ робо́ту чи навча́ння!',
    tutorIntroEn:
      'Notice: with the verb "працюва́ти", the profession always takes the Instrumental case: "Я працю́ю програмі́стом / менеджеркою / лі́карем". Tell me about your work or studies!',
    keyPhrases: [
      { uk: 'Я працю́ю програмі́стом у міжнаро́дній компа́нії.', en: 'I work as a programmer at an international company.', grammarNote: 'Instrumental «програмі́стом» + Locative «у міжнаро́дній компа́нії»' },
      { uk: 'За́раз я працю́ю дистанці́йно з до́му.', en: 'Right now I work remotely from home.', grammarNote: 'Adverb «дистанці́йно» + з до́му (Genitive)' },
      { uk: 'У мої́й робо́ті мені́ найбільше подо́бається вирі́шувати складні́ за́вдання.', en: 'In my job what I like most is solving complex problems.', grammarNote: 'Dative «мені́» + подо́бається + infinitive' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я працю́ю інжене́ром і мені́ ду́же подо́бається моя́ кома́нда.', en: 'I work as an engineer and I really like my team.' },
      { uk: 'Я навча́юся в університе́ті та вивча́ю міжнаро́дні відно́сини.', en: 'I study at the university and major in international relations.' },
    ],
  },
  {
    id: 'ukrainian-food-and-cooking',
    number: 19,
    titleEn: 'Ukrainian Food and Cooking',
    titleUk: 'Украї́нська ку́хня та куліна́рія',
    category: 'culture',
    suggestedLevel: 'A2',
    aiRoleEn: 'Ukrainian home chef sharing traditional family recipes',
    aiRoleUk: 'Куліна́р та знаве́ць украї́нської ку́хні',
    defaultFormality: 'informal',
    descriptionEn:
      'Talk about Ukrainian culinary classics (borshch, varenyky, deruny, syrnyky) and explain how to cook a dish.',
    learningObjectives: [
      'Discuss ingredients using «з/із + Instrumental» and «без + Genitive»',
      'Use culinary verbs («вари́ти, сма́жити, пекти́, наріза́ти, додава́ти»)',
      'Describe flavors («смачни́й, запашни́й, соло́дкий, го́стрий, солони́й»)',
    ],
    relatedCourseModuleId: 'A1.3',
    openingByLevel: {
      beginnerUk: 'Які́ украї́нські стра́ви ти вже куштува́в? Ти лю́биш борщ чи варе́ники?',
      beginnerEn: 'Which Ukrainian dishes have you already tasted? Do you like borshch or varenyky?',
      intermediateUk: 'Украї́нська ку́хня ду́же різномані́тна! Які́ на́ші стра́ви ти вже куштува́в і що ти лю́биш готува́ти вдо́ма?',
      intermediateEn: 'Ukrainian cuisine is very diverse! Which of our dishes have you tried, and what do you enjoy cooking at home?',
      advancedUk: 'Куліна́рні тради́ції ко́жного регіо́ну Украї́ни — від полта́вських галушо́к до гуцу́льського баношу — ма́ють свій хара́ктер. Які́ смаки́ тобі́ найбли́жчі?',
      advancedEn: 'The culinary traditions of each region of Ukraine — from Poltava halushky to Hutsul banosh — have their own character. Which flavors are closest to your heart?',
    },
    tutorIntroUk:
      'Поговорі́мо про ї́жу! Трену́ємо Ору́дний відмі́нок для начи́нок і дода́тків: «варе́ники з карто́плею / з ви́шнями», «борщ зі смета́ною та пампу́шками». Розкажи́ про свою́ улю́блену стра́ву!',
    tutorIntroEn:
      'Let’s talk about food! We practice the Instrumental case for fillings and toppings: "варе́ники з карто́плею / з ви́шнями", "борщ зі смета́ною та пампу́шками". Tell me about your favorite dish!',
    keyPhrases: [
      { uk: 'Я обо́жнюю гаря́чий украї́нський борщ зі смета́ною та часнико́м.', en: 'I adore hot Ukrainian borshch with sour cream and garlic.', grammarNote: 'зі + Instrumental («зі смета́ною та часнико́м»)' },
      { uk: 'На десе́рт ми приготува́ли варе́ники з ви́шнями.', en: 'For dessert we prepared varenyky with sour cherries.', grammarNote: 'з + Instrumental plural («з ви́шнями»)' },
      { uk: 'Ця стра́ва готу́ється зі сві́жих овочі́в та арома́тних спе́цій.', en: 'This dish is prepared from fresh vegetables and aromatic spices.', grammarNote: 'зі + Genitive plural («зі сві́жих овочі́в»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Мені́ ду́же подо́баються варе́ники з карто́плею і деруни́ зі смета́ною.', en: 'I really like varenyky with potatoes and potato pancakes with sour cream.' },
      { uk: 'Вдо́ма я люблю́ готува́ти супи́, па́сту і сві́жі сала́ти.', en: 'At home I like cooking soups, pasta, and fresh salads.' },
    ],
  },
  {
    id: 'ukrainian-cities-travel-and-culture',
    number: 20,
    titleEn: 'Ukrainian Cities, Travel, and Culture',
    titleUk: 'Міста́ Украї́ни, мандрі́вки та культу́ра',
    category: 'culture',
    suggestedLevel: 'B1',
    aiRoleEn: 'Ukrainian cultural guide and travel storyteller',
    aiRoleUk: 'Культу́рний гід Украї́ною',
    defaultFormality: 'informal',
    descriptionEn:
      'Explore Kyiv, Lviv, Odesa, Kharkiv, and the Carpathian Mountains, comparing architecture, history, and atmosphere.',
    learningObjectives: [
      'Decline Ukrainian geographic names properly («у Ки́єві, у Льво́ві, в Оде́сі, у Харкові, в Карпа́тах»)',
      'Describe cultural landmarks and historical traditions',
      'Express admiration and cultural curiosity with rich adjectives',
    ],
    relatedCourseModuleId: 'B1.8',
    openingByLevel: {
      beginnerUk: 'Які́ міста́ Украї́ни ти зна́єш? Куди́ ти хо́чеш пої́хати — у Ки́їв, у Львів чи в Карпа́ти?',
      beginnerEn: 'Which cities of Ukraine do you know? Where do you want to travel — to Kyiv, Lviv, or the Carpathians?',
      intermediateUk: 'Ко́жне украї́нське мі́сто ма́є свою́ неповто́рну атмосфе́ру. Які́ куто́чки Украї́ни тебе́ найбільше прива́блюють і чому́?',
      intermediateEn: 'Every Ukrainian city has its own unique atmosphere. Which corners of Ukraine attract you the most and why?',
      advancedUk: 'Від золотоверхого Ки́єва та кавового Льво́ва до чорноморської Оде́си й високогі́рних Карпа́т — які́ культу́рні та істори́чні пласти́ Украї́ни тобі́ найціка́віше досліджувати?',
      advancedEn: 'From golden-domed Kyiv and coffee-scented Lviv to Black Sea Odesa and the high Carpathians — which cultural and historical layers of Ukraine are you most interested in exploring?',
    },
    tutorIntroUk:
      'Зверни́ ува́гу на чергува́ння голосни́х у назвах украї́нських міст: «Ки́їв → до Ки́єва / у Ки́єві», «Львів → до Льво́ва / у Льво́ві», «Харків → до Харкова / у Харкові». Розкажи́, які́ міста́ ти хо́чеш відві́дати!',
    tutorIntroEn:
      'Pay attention to vowel alternation in Ukrainian city names: "Ки́їв → до Ки́єва / у Ки́єві", "Львів → до Льво́ва / у Льво́ві", "Харків → до Харкова / у Харкові". Tell me which cities you want to visit!',
    keyPhrases: [
      { uk: 'Я ду́же хо́чу погуля́ти старови́нними ву́личками Льво́ва.', en: 'I really want to walk through the ancient streets of Lviv.', grammarNote: 'Instrumental of path «старови́нними ву́личками» + Genitive «Льво́ва»' },
      { uk: 'У Ки́єві обов’язко́во ва́рто поба́чити Софі́йський собо́р і Поді́л.', en: 'In Kyiv it is definitely worth seeing St. Sophia Cathedral and Podil.', grammarNote: 'у Ки́єві (Locative with є-stem)' },
      { uk: 'Карпа́тські полони́ни вража́ють своєю́ приро́дою.', en: 'The Carpathian mountain meadows impress with their nature.', grammarNote: 'Instrumental «своєю́ приро́дою»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я ду́же хо́чу побува́ти у Ки́єві та у Льво́ві, бо мені́ подо́бається архітекту́ра.', en: 'I really want to visit Kyiv and Lviv because I like the architecture.' },
      { uk: 'Мені́ ціка́во пої́хати в Карпа́ти і поба́чити гірські́ полони́ни.', en: 'I am interested in going to the Carpathians and seeing the mountain meadows.' },
    ],
  },
  {
    id: 'renting-an-apartment-or-discussing-housing',
    number: 21,
    titleEn: 'Renting an Apartment or Discussing Housing',
    titleUk: 'Оре́нда кварти́ри та о́пис житла́',
    category: 'practical',
    suggestedLevel: 'B1',
    aiRoleEn: 'Apartment owner / real estate agent in Kyiv',
    aiRoleUk: 'Вла́сник кварти́ри / ріє́лтор',
    defaultFormality: 'formal',
    descriptionEn:
      'Ask about rent, utilities, neighborhood transport, furniture, and describe your own home or apartment.',
    learningObjectives: [
      'Use ordinal numerals in the Locative case («на тре́тьому по́версі»)',
      'Discuss rooms, furniture, and monthly expenses («комуна́льні по́слуги», «оре́ндна пла́та»)',
      'Ask conditional questions about lease terms',
    ],
    relatedCourseModuleId: 'B1.7',
    openingByLevel: {
      beginnerUk: 'До́брий день! Ви шука́єте кварти́ру в оре́нду? Скі́льки кімна́т Вам потрі́бно?',
      beginnerEn: 'Good day! Are you looking for an apartment to rent? How many rooms do you need?',
      intermediateUk: 'Віта́ю! Ви телефонува́ли що́до оголо́шення про оре́нду двокімна́тної кварти́ри в це́нтрі. Які́ умо́ви для Вас найважливі́ші?',
      intermediateEn: 'Greetings! You called regarding the listing for a two-room apartment in the center. What conditions are most important for you?',
      advancedUk: 'До́брого дня! Кварти́ра на Подо́лі ві́льна до перегля́ду. Розкажі́ть, на яки́й термі́н Ви плану́єте оре́нду та які́ Ва́ші головні́ вимо́ги до житла́?',
      advancedEn: 'Good day! The apartment in Podil is available for viewing. Tell me for what term you plan to rent and what your main housing requirements are.',
    },
    tutorIntroUk:
      'Обгово́рюємо житло́! Зверни́ ува́гу: з по́верхами завжди́ вжива́ємо прийме́нник «на»: «на п’я́тому по́версі», а про розташува́ння — «по́руч із метро́ / бі́ля па́рку». Запита́й про кварти́ру!',
    tutorIntroEn:
      'Let’s discuss housing! Notice: with floors we always use the preposition "на": "на п’я́тому по́версі", and for proximity — "по́руч із метро́ / бі́ля па́рку". Ask about the apartment!',
    keyPhrases: [
      { uk: 'На яко́му по́версі знахо́диться кварти́ра і чи є там балко́н?', en: 'On which floor is the apartment located, and is there a balcony?', grammarNote: 'На яко́му по́версі (Locative masculine with х → с alternation)' },
      { uk: 'Чи вхо́дять комуна́льні по́слуги у ва́ртість оре́нди?', en: 'Are utilities included in the rent price?', grammarNote: 'вхо́дити в/у + Accusative' },
      { uk: 'Мені́ важливо, щоб кварти́ра була́ світлою і по́руч із метро́.', en: 'It is important to me that the apartment be bright and close to the metro.', grammarNote: 'щоб + past tense subjunctive («щоб була́»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'До́брий день! Я шука́ю світлу однокімна́тну кварти́ру недале́ко від метро́.', en: 'Good day! I am looking for a bright one-room apartment not far from the metro.' },
      { uk: 'Підкажі́ть, будь ла́ска, на яко́му по́версі кварти́ра і які́ там ме́блі?', en: 'Could you please tell me what floor the apartment is on and what furniture is there?' },
    ],
  },
  {
    id: 'expressing-opinions-and-preferences',
    number: 22,
    titleEn: 'Expressing Opinions and Preferences',
    titleUk: 'Висло́влення вла́сної ду́мки та вподоба́нь',
    category: 'social',
    suggestedLevel: 'B1',
    aiRoleEn: 'Engaging Ukrainian discussion partner',
    aiRoleUk: 'Дискусі́йний партне́р',
    defaultFormality: 'informal',
    descriptionEn:
      'Use natural Ukrainian discourse markers to express your viewpoint, weigh pros and cons, and compare lifestyle choices.',
    learningObjectives: [
      'Introduce opinions with «На мою́ ду́мку», «Як на ме́не», «Я вважа́ю, що...»',
      'Compare options using «кра́ще... ніж» and «чим... тим...»',
      'Support arguments with «по-пе́рше», «по-дру́ге», «крім то́го»',
    ],
    relatedCourseModuleId: 'B1.9',
    openingByLevel: {
      beginnerUk: 'Як ти ду́маєш, де кра́ще жи́ти — у вели́кому мі́сті чи на приро́ді?',
      beginnerEn: 'What do you think, where is it better to live — in a big city or in nature?',
      intermediateUk: 'На твою́ ду́мку, що кра́ще — працюва́ти вдо́ма чи в о́фісі з коле́гами? Які́ плю́си та мі́нуси ти ба́чиш?',
      intermediateEn: 'In your opinion, which is better — working from home or in an office with colleagues? What pros and cons do you see?',
      advancedUk: 'Диску́сія про бала́нс між цифрово́ю зру́чністю та живи́м спілкува́нням стає́ деда́лі гострі́шою. Яка́ твоя́ пози́ція: технології більше збли́жують чи віддаля́ють люде́й?',
      advancedEn: 'The debate over balancing digital convenience and face-to-face communication is growing sharper. What is your view: does technology bring people closer or push them apart?',
    },
    tutorIntroUk:
      'Вчи́мося аргументува́ти свою́ пози́цію украї́нською! Використо́вуй всту́пні зворо́ти «На мою́ ду́мку,...», «Як на ме́не,...» та «З одно́го бо́ку..., а з іншого бо́ку...». Ви́слови свою́ ду́мку!',
    tutorIntroEn:
      'Let’s practice arguing a point in Ukrainian! Use discourse phrases like "На мою́ ду́мку,...", "Як на ме́не,..." and "З одно́го бо́ку..., а з іншого бо́ку...". Share your viewpoint!',
    keyPhrases: [
      { uk: 'На мою́ ду́мку, у ко́жного варіа́нта є свої́ перева́ги та недоліки.', en: 'In my opinion, each option has its own advantages and disadvantages.', grammarNote: 'На + Accusative («На мою́ ду́мку»)' },
      { uk: 'Як на ме́не, живе́ спілкува́ння ніщо́ не замі́нить.', en: 'As for me, nothing can replace live face-to-face communication.', grammarNote: 'Idiomatic discourse marker «Як на ме́не»' },
      { uk: 'З одно́го бо́ку це зру́чно, але́ з іншого бо́ку браку́є ру́ху.', en: 'On the one hand it is convenient, but on the other hand there is a lack of movement.', grammarNote: 'браку́є + Genitive («браку́є ру́ху»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'На мою́ ду́мку, жи́ти у вели́кому мі́сті ціка́віше, але́ на приро́ді спокійні́ше.', en: 'In my opinion, living in a big city is more interesting, but in nature it is calmer.' },
      { uk: 'Я вважа́ю, що дистанці́йна робо́та допомага́є заоща́джувати ба́гато ча́су.', en: 'I believe that remote work helps save a lot of time.' },
    ],
  },
  {
    id: 'telling-a-story-or-explaining-what-happened',
    number: 23,
    titleEn: 'Telling a Story or Explaining What Happened',
    titleUk: 'Розпо́відь істо́рії або́ неочі́куваного ви́падку',
    category: 'social',
    suggestedLevel: 'B1',
    aiRoleEn: 'Curious Ukrainian listener who loves good stories',
    aiRoleUk: 'Заціка́влений слуха́ч',
    defaultFormality: 'informal',
    descriptionEn:
      'Narrate an unexpected, funny, or memorable event from start to finish using vivid verbs and time connectors.',
    learningObjectives: [
      'Combine imperfective background actions («коли́ я йшов...») with perfective events («ра́птом я поба́чив...»)',
      'Use narrative connectors («одно́го ра́зу», «несподі́вано», «на ща́стя», «вре́шті-решт»)',
      'Maintain natural emotional reactions in dialogue',
    ],
    relatedCourseModuleId: 'B1.3',
    openingByLevel: {
      beginnerUk: 'Розкажи́ яку́сь ціка́ву або́ смішну́ істо́рію! Що ста́лося і чим усе́ закінчи́лося?',
      beginnerEn: 'Tell an interesting or funny story! What happened and how did it all end?',
      intermediateUk: 'Чи трапля́вся з тобо́ю яки́йсь куме́дний або́ несподі́ваний ви́падок під час по́дорожі чи в повсякде́нному житті́? Розкажи́!',
      intermediateEn: 'Has a funny or unexpected incident ever happened to you while traveling or in everyday life? Tell me about it!',
      advancedUk: 'Найкра́щі розмо́ви часто склада́ються з реальних життє́вих пригод. Пригада́й ви́падок, коли́ все пішло́ не за пла́ном, але́ перетвори́лося на чудо́ву істо́рію!',
      advancedEn: 'The best conversations are often made of real-life adventures. Recall a time when everything went off script, yet turned into a great story!',
    },
    tutorIntroUk:
      'Буду́ємо захопливу ро́зповідь! Для фону вжива́й недоко́наний вид («Коли́ я гуля́в мі́стом...»), а для рапто́вої ді́ї — доко́наний вид («...ра́птом підійшо́в / ста́лося...»). Розкажи́ свою́ істо́рію!',
    tutorIntroEn:
      'Let’s build an engaging narrative! For background setting use the imperfective ("Коли́ я гуля́в мі́стом..."), and for the sudden event use the perfective ("...ра́птом підійшо́в / ста́лося..."). Tell your story!',
    keyPhrases: [
      { uk: 'Одно́го ра́зу зі мно́ю тра́пилася ду́же несподі́вана істо́рія.', en: 'Once a very unexpected story happened to me.', grammarNote: 'зі мно́ю (Instrumental of я)' },
      { uk: 'Коли́ ми вже збира́лися вихо́дити, ра́птом почала́ся си́льна гроза́.', en: 'When we were already getting ready to leave, a strong thunderstorm suddenly began.', grammarNote: 'Imperfective «збира́лися» + perfective «почала́ся»' },
      { uk: 'На ща́стя, все закінчи́лося ду́же до́бре!', en: 'Fortunately, everything ended very well!', grammarNote: 'Parenthetical «На ща́стя» + perfective «закінчи́лося»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Одно́го ра́зу під час по́дорожі я переплу́тав по́їзд, але́ познайо́мився з чудовими людьми́.', en: 'Once during a trip I mixed up the train, but met wonderful people.' },
      { uk: 'Учо́ра зі мно́ю ста́вся куме́дний ви́падок у кав’я́рні.', en: 'Yesterday a funny incident happened to me at a coffeehouse.' },
    ],
  },
  {
    id: 'polite-disagreement-and-persuasion',
    number: 24,
    titleEn: 'Polite Disagreement and Persuasion',
    titleUk: 'Вві́члива незго́да та перекона́ння',
    category: 'professional',
    suggestedLevel: 'B2',
    aiRoleEn: 'Thoughtful Ukrainian debate partner',
    aiRoleUk: 'Дипломати́чний опоне́нт у диску́сії',
    defaultFormality: 'auto',
    descriptionEn:
      'Acknowledge another person’s point, disagree diplomatically without sounding blunt, and persuade them with clear evidence.',
    learningObjectives: [
      'Use diplomatic softening phrases («Я розумі́ю Ва́шу ду́мку, проте́...», «Дозво́льте не пого́дитися»)',
      'Construct conditional and concession clauses («Хоча́..., все ж таки́...»)',
      'Persuade politely with modal verbs and impersonal predicates («ва́рто врахува́ти», «слід заува́жити»)',
    ],
    relatedCourseModuleId: 'B2.5',
    openingByLevel: {
      beginnerUk: 'Дехто ка́же, що паперо́ві книжки́ бі́льше не потрі́бні. Ти зго́ден чи ні? Чому́?',
      beginnerEn: 'Some say paper books are no longer needed. Do you agree or not? Why?',
      intermediateUk: 'Бага́то хто вважа́є, що вивча́ти інозе́мні мо́ви в епо́ху перекладачі́в уже́ не обов’язко́во. Спро́буй вві́чливо запере́чити цю ду́мку!',
      intermediateEn: 'Many believe that learning foreign languages in the age of translators is no longer necessary. Try politely disagreeing with this view!',
      advancedUk: 'Уяві́мо диску́сію: я стверджую, що шту́чний інтеле́кт невдовзі повністю замі́нить потребу у ви́вченні інозе́мних мов. Спро́буй дипломати́чно перекона́ти ме́не в протиле́жному!',
      advancedEn: 'Let’s imagine a debate: I claim that artificial intelligence will soon completely replace the need to learn foreign languages. Try diplomatically persuading me otherwise!',
    },
    tutorIntroUk:
      'Трену́ємо культу́ру диску́сії! Замість різко́го «Ти не правий» вжива́ємо: «Я розумі́ю твою́ ло́гіку, проте́ ва́рто врахува́ти, що...» або́ «Ва́жко повністю пого́дитися з цим, оскі́льки...».',
    tutorIntroEn:
      'Let’s practice debate etiquette! Instead of a blunt "You are wrong", use: "Я розумі́ю твою́ ло́гіку, проте́ ва́рто врахува́ти, що..." or "Ва́жко повністю пого́дитися з цим, оскі́льки...".',
    keyPhrases: [
      { uk: 'Я розумі́ю Ваш аргуме́нт, проте́ дивлю́ся на це де́що іна́кше.', en: 'I understand your argument, however I look at this somewhat differently.', grammarNote: 'Adversative conjunction «проте́»' },
      { uk: 'Ва́рто врахува́ти, що мо́ва — це не ли́ше пере́клад слів, а й культу́ра.', en: 'It is worth considering that language is not merely word translation, but also culture.', grammarNote: 'Impersonal modal «ва́рто» + infinitive' },
      { uk: 'Чи не здає́ться Вам, що живи́й діало́г створює зна́чно більшу дові́ру?', en: 'Does it not seem to you that live dialogue creates much greater trust?', grammarNote: 'Polite rhetorical question «Чи не здає́ться Вам»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Я розумі́ю цю ду́мку, проте́ живо́го спілкува́ння без перекладача́ ніщо́ не замі́нить.', en: 'I understand this view, however nothing can replace live communication without a translator.' },
      { uk: 'Дозво́льте частко́во не пого́дитися, оскі́льки ви́вчення мо́ви відкрива́є культу́ру країни.', en: 'Allow me to partially disagree, since learning a language unlocks a country’s culture.' },
    ],
  },
  {
    id: 'professional-or-academic-introduction',
    number: 25,
    titleEn: 'Professional or Academic Introduction',
    titleUk: 'Професі́йна або́ академі́чна самопрезента́ція',
    category: 'professional',
    suggestedLevel: 'B2',
    aiRoleEn: 'Conference moderator / hiring lead in Kyiv',
    aiRoleUk: 'Модера́тор конфере́нції / керівни́к проє́кту',
    defaultFormality: 'formal',
    descriptionEn:
      'Present your professional background, research or project focus, and goals at a Ukrainian conference or interview.',
    learningObjectives: [
      'Use formal «Ви» register and business Ukrainian vocabulary effortlessly',
      'Use «спеціалізува́тися на + Locative» and «відповіда́ти за + Accusative»',
      'Deliver a structured, polished professional pitch',
    ],
    relatedCourseModuleId: 'B2.5',
    openingByLevel: {
      beginnerUk: 'До́брий день! Предста́втеся, будь ла́ска, для учасників зу́стрічі: хто Ви і чим Ви займа́єтеся?',
      beginnerEn: 'Good day! Please introduce yourself to the meeting participants: who are you and what do you do?',
      intermediateUk: 'Віта́ю на на́шій професі́йній зу́стрічі! Розкажі́ть, будь ла́ска, про Ваш до́свід, сфе́ру діяльності та над яки́ми проє́ктами Ви за́раз працю́єте.',
      intermediateEn: 'Welcome to our professional meeting! Please tell us about your experience, field of activity, and what projects you are currently working on.',
      advancedUk: 'Шано́вні коле́ги, віта́ю на на́шому фо́румі! Прошу́ коротко представити Ва́шу експерти́зу, ключові́ дося́гнення та на́прямки, у яки́х Ви заціка́влені співпрацюва́ти з украї́нськими партне́рами.',
      advancedEn: 'Dear colleagues, welcome to our forum! Please briefly present your expertise, key achievements, and the areas in which you are interested in collaborating with Ukrainian partners.',
    },
    tutorIntroUk:
      'У ділово́му сти́лі зверта́ємося на «Ви» та вжива́ємо то́чні конструкції: «Я спеціалізу́юся на + Місце́вий відмі́нок», «Я відповіда́ю за + Знахі́дний відмі́нок». Предста́вте себе́ професі́йно!',
    tutorIntroEn:
      'In formal business Ukrainian we use "Ви" and precise structures: "Я спеціалізу́юся на + Locative", "Я відповіда́ю за + Accusative". Introduce yourself professionally!',
    keyPhrases: [
      { uk: 'Добро́го дня, шано́вні коле́ги! Я очо́люю на́прямок міжнаро́дних проє́ктів.', en: 'Good day, respected colleagues! I head the international projects division.', grammarNote: 'Vocative plural «шано́вні коле́ги»' },
      { uk: 'Я спеціалізу́юся на ана́лізі да́них та ро́звитку освітніх платфо́рм.', en: 'I specialize in data analysis and the development of educational platforms.', grammarNote: 'спеціалізу́ватися на + Locative («на ана́лізі, ро́звитку»)' },
      { uk: 'Ми відкри́ті до співпра́ці з украї́нськими фахівця́ми.', en: 'We are open to collaboration with Ukrainian specialists.', grammarNote: 'відкри́ті до + Genitive («до співпра́ці»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Віта́ю, шано́вні коле́ги! Я працю́ю у сфе́рі технологій і відповіда́ю за ро́звиток проду́кту.', en: 'Greetings, dear colleagues! I work in the technology sector and am responsible for product development.' },
      { uk: 'Ма́ю за честь представити наш дослі́дницький проє́кт та обговори́ти можли́ву співпра́цю.', en: 'I am honored to present our research project and discuss potential collaboration.' },
    ],
  },
  {
    id: 'discussing-news-society-and-technology',
    number: 26,
    titleEn: 'Discussing News, Society, and Technology',
    titleUk: 'Обгово́рення суспі́льства, іннова́цій та технологій',
    category: 'professional',
    suggestedLevel: 'B2',
    aiRoleEn: 'Ukrainian tech & civic journalist',
    aiRoleUk: 'Огляда́ч технологій та суспі́льних змі́н',
    defaultFormality: 'auto',
    descriptionEn:
      'Analyze digital transformation (such as Ukraine’s Diia ecosystem), renewable energy, education reform, and civic trends.',
    learningObjectives: [
      'Use impersonal passive forms in «-но / -то» («запрова́джено», «ство́рено»)',
      'Use abstract nouns and complex relative clauses («яки́й / чий»)',
      'Discuss societal impact with «вплива́ти на + Accusative» and «сприя́ти + Dative»',
    ],
    relatedCourseModuleId: 'B2.1',
    openingByLevel: {
      beginnerUk: 'Як технології та інтерне́т допомага́ють тобі́ щодня́ у житті́ та навча́нні?',
      beginnerEn: 'How do technology and the internet help you every day in life and study?',
      intermediateUk: 'Украї́на відо́ма швидкою цифровіза́цією держа́вних послуг. Як ти оці́нюєш вплив суча́сних технологій на повсякде́нне життя́ та осві́ту?',
      intermediateEn: 'Ukraine is known for rapid digitalization of public services. How do you evaluate the impact of modern technology on everyday life and education?',
      advancedUk: 'Цифрова́ трансформа́ція суспі́льства змі́нює все — від держа́вного управлі́ння до медици́ни й осві́ти. Які́ технологі́чні змі́ни ти вважа́єш найкорисні́шими, а де ба́чиш ри́зики?',
      advancedEn: 'The digital transformation of society is changing everything — from governance to medicine and education. Which technological shifts do you consider most beneficial, and where do you see risks?',
    },
    tutorIntroUk:
      'У публіцисти́чному та аналіти́чному мо́вленні важливо розрізня́ти керува́ння дієслі́в: «вплива́ти на + Знахі́дний відмі́нок», але́ «сприя́ти + Дава́льний відмі́нок» (сприя́ти ро́звитку). Поділи́ся думка́ми!',
    tutorIntroEn:
      'In analytical speech it is important to distinguish verb governance: "вплива́ти на + Accusative", vs. "сприя́ти + Dative" (сприя́ти ро́звитку). Share your thoughts!',
    keyPhrases: [
      { uk: 'Новітні технології суттє́во вплива́ють на я́кість осві́ти.', en: 'Modern technologies significantly impact the quality of education.', grammarNote: 'вплива́ти на + Accusative («на я́кість»)' },
      { uk: 'Цифрові́ се́рвіси сприя́ють прозо́рості та еконо́мії ча́су.', en: 'Digital services contribute to transparency and time savings.', grammarNote: 'сприя́ти + Dative («прозо́рості, еконо́мії»)' },
      { uk: 'За оста́нні ро́ки в Украї́ні ство́рено зру́чну екосисте́му електро́нних послуг.', en: 'In recent years a convenient ecosystem of e-services has been created in Ukraine.', grammarNote: 'Impersonal passive predicate «ство́рено» + Accusative object' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Суча́сні технології допомага́ють лю́дям навча́тися та працюва́ти з будь-яко́ї то́чки сві́ту.', en: 'Modern technologies help people study and work from anywhere in the world.' },
      { uk: 'На мою́ ду́мку, цифровіза́ція сприя́є швидкому ро́звитку суспі́льства, але́ важливо захища́ти персона́льні да́ні.', en: 'In my opinion, digitalization promotes rapid societal development, but it is important to protect personal data.' },
    ],
  },
  {
    id: 'idioms-humor-and-natural-expressions',
    number: 27,
    titleEn: 'Idioms, Humor, and Natural Expressions',
    titleUk: 'Фразеологі́зми, гу́мор і жива́ розмо́вна мо́ва',
    category: 'culture',
    suggestedLevel: 'C1',
    aiRoleEn: 'Witty Ukrainian linguist and storyteller',
    aiRoleUk: 'Знаве́ць украї́нської фразеоло́гії та гу́мору',
    defaultFormality: 'informal',
    descriptionEn:
      'Master colorful Ukrainian idioms, proverbs, euphony (милозву́чність), and warm conversational humor.',
    learningObjectives: [
      'Understand and use authentic Ukrainian idioms («бра́ти но́ги в ру́ки», «як сніг на го́лову», «пекти́ ра́ків»)',
      'Apply Ukrainian euphony rules («у/в», «і/й/та», «з/із/зі») naturally',
      'Distinguish literal vs. figurative meanings and playful register',
    ],
    relatedCourseModuleId: 'C1.1',
    openingByLevel: {
      beginnerUk: 'Ти любиш украї́нські прислі́в’я? Напри́клад: «Без труда́ нема́ плода́». Зна́єш ще які́сь ціка́ві ви́слови?',
      beginnerEn: 'Do you like Ukrainian proverbs? For example: "Without work there is no fruit." Do you know any other interesting sayings?',
      intermediateUk: 'Украї́нська мо́ва надзвича́йно бага́та на о́бразні ви́слови! Чи чу́в ти ви́слів «як сніг на го́лову» або́ «лови́ти ґав»? Як ти їх розумі́єш?',
      intermediateEn: 'The Ukrainian language is extraordinarily rich in vivid expressions! Have you heard "like snow on one’s head" or "catching crows"? How do you understand them?',
      advancedUk: 'Ка́жуть, що душу мо́ви найкра́ще чу́ти в її́ ідіо́мах та доброму гу́морі. Які́ украї́нські фразеологі́зми здаю́ться тобі́ найколоритні́шими, і коли́ ти сам «не лі́зеш за сло́вом у кишеню»?',
      advancedEn: 'They say the soul of a language is best heard in its idioms and good humor. Which Ukrainian idioms strike you as most colorful, and when are you yourself "never at a loss for words"?',
    },
    tutorIntroUk:
      'Зану́рюємося в о́бразну украї́нську! Фразеологі́зм «як сніг на го́лову» означа́є «зовсім несподі́вано», а «лови́ти ґав» — «бу́ти неува́жним». Спро́буй вжи́ти оди́н із ви́словів у вла́сному ре́ченні!',
    tutorIntroEn:
      'Let’s dive into figurative Ukrainian! The idiom "як сніг на го́лову" means "completely unexpectedly", and "лови́ти ґав" means "to daydream / be inattentive". Try using one in your own sentence!',
    keyPhrases: [
      { uk: 'Ця новина́ впа́ла на нас як сніг на го́лову!', en: 'This news fell on us out of the blue (lit. like snow on our head)!', grammarNote: 'Idiom «як сніг на го́лову» (Accusative with stress shift на го́лову)' },
      { uk: 'На уро́ці не ва́рто лови́ти ґав — кра́ще бра́тися до ді́ла!', en: 'In class one shouldn’t daydream — better to get down to business!', grammarNote: 'Idiom «лови́ти ґав» (animate-style Accusative plural)' },
      { uk: 'Він зна́є цю спра́ву як свої́ п’ять па́льців.', en: 'He knows this craft like the back of his hand (lit. like his five fingers).', grammarNote: 'Idiom «як свої́ п’ять па́льців»' },
    ],
    suggestedLearnerStarters: [
      { uk: 'Мені́ ду́же подо́бається ви́слів «як сніг на го́лову», коли́ щось стає́ться ра́птом.', en: 'I really like the expression "like snow on the head" when something happens suddenly.' },
      { uk: 'Коли́ я вивча́ю украї́нську, я стара́юся не лови́ти ґав і слу́хати ува́жно.', en: 'When I study Ukrainian, I try not to daydream and to listen carefully.' },
    ],
  },
  {
    id: 'discussing-philosophy-and-ideas',
    number: 28,
    titleEn: 'Discussing Philosophy and Ideas',
    titleUk: 'Філосо́фські роздуми, ці́нності та іде́ї',
    category: 'culture',
    suggestedLevel: 'C1',
    aiRoleEn: 'Reflective Ukrainian philosopher and essayist',
    aiRoleUk: 'Співрозмо́вник-мисли́тель',
    defaultFormality: 'auto',
    descriptionEn:
      'Engage in deep reflection on human freedom, Hryhorii Skovoroda’s concept of “congenial labor” (сродна пра́ця), language, and meaning.',
    learningObjectives: [
      'Use elevated abstract vocabulary, participles, and correlative syntax («чим гли́бше..., тим ясні́ше...»)',
      'Discuss philosophical concepts such as Skovoroda’s «сродна пра́ця» (congenial work) and human resilience',
      'Maintain C1 stylistic elegance and euphonic harmony',
    ],
    relatedCourseModuleId: 'C1.1',
    openingByLevel: {
      beginnerUk: 'Що ро́бить люди́ну щасли́вою в житті́? Що для те́бе найважливі́ше?',
      beginnerEn: 'What makes a person happy in life? What is most important for you?',
      intermediateUk: 'Украї́нський філо́соф Григо́рій Сковорода́ писа́в про «сро́дну пра́цю» — спра́ву за покли́канням серця. Як ти розумі́єш ща́стя та самореаліза́цію?',
      intermediateEn: 'The Ukrainian philosopher Hryhorii Skovoroda wrote about "congenial work" — a calling of the heart. How do you understand happiness and self-realization?',
      advancedUk: 'Григо́рій Сковорода́ вбача́в осно́ву людського ща́стя у «сро́дній пра́ці» та вну́трішній свобо́ді. Як, на твою́ ду́мку, людина в суча́сному буремному сві́ті знахо́дить своє́ справжнє покли́кання та зберіга́є гідність?',
      advancedEn: 'Hryhorii Skovoroda saw the foundation of human happiness in "congenial labor" and inner freedom. In your view, how does a person in today’s turbulent world find their true calling and preserve dignity?',
    },
    tutorIntroUk:
      'На рі́вні C1 попрацю́ймо над вишуканим синтаксисом: використовуй співвідно́сні конструкції «Чим бі́льше людина пізнає́ себе́, тим...» та дієприслі́вникові зворо́ти («розмірковуючи про...»).',
    tutorIntroEn:
      'At level C1 let’s practice elevated syntax: use correlative structures "Чим бі́льше людина пізнає́ себе́, тим..." and verbal adverbial phrases ("розмірковуючи про...").',
    keyPhrases: [
      { uk: 'Іде́я «сро́дної пра́ці» Сковороди́ нага́дує нам про важли́вість внутрішньої гармо́нії.', en: 'Skovoroda’s idea of "congenial labor" reminds us of the importance of inner harmony.', grammarNote: 'нага́дувати про + Accusative («про важли́вість»)' },
      { uk: 'Чим гли́бше ми вивча́ємо іншу мо́ву, тим ши́ршим стає́ наш світо́гляд.', en: 'The deeper we study another language, the broader our worldview becomes.', grammarNote: 'Correlative «Чим... тим...» + Instrumental predicate «ши́ршим стає́»' },
      { uk: 'Свобо́да і відповіда́льність нерозри́вно пов’я́зані між собо́ю.', en: 'Freedom and responsibility are inextricably linked with one another.', grammarNote: 'між + Instrumental («між собо́ю»)' },
    ],
    suggestedLearnerStarters: [
      { uk: 'На моє́ глибо́ке перекона́ння, ща́стя народжується тоді́, коли́ людина займа́ється улю́бленою спра́вою.', en: 'In my deep conviction, happiness is born when a person engages in work they love.' },
      { uk: 'Розмірковуючи про слова́ Сковороди́, я ба́чу, як ті́сно пов’я́зані свобо́да, пра́ця і самопізна́ння.', en: 'Reflecting on Skovoroda’s words, I see how closely connected freedom, labor, and self-knowledge are.' },
    ],
  },
];

export function getScenarioById(scenarioId: string): ConversationScenario {
  return (
    CONVERSATION_SCENARIOS.find((s) => s.id === scenarioId) ||
    CONVERSATION_SCENARIOS[0]
  );
}
