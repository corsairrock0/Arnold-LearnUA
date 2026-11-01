// ============================================================================
// LANGO PHASE 1 — EXTENSIBLE LANGUAGE REGISTRY, HINDI DEVANAGARI SUPPORT,
// UNICODE NORMALIZATION & INTERFACE LOCALIZATION ARCHITECTURE
// ============================================================================

export type TextDirection = 'ltr' | 'rtl';

export type WritingScriptCode =
  | 'Latn'
  | 'Cyrl'
  | 'Deva'
  | 'Arab'
  | 'Hans'
  | 'Hani'
  | 'Hang'
  | 'Jpan';

export interface LanguageGrammarMetadata {
  hasGrammaticalGender: boolean;
  genderCategories?: string[];
  hasCaseSystem: boolean;
  caseCount?: number;
  wordOrderDefault: 'SVO' | 'SOV' | 'VSO' | 'flexible';
  adpositionType: 'prepositional' | 'postpositional' | 'mixed';
  scriptRequiresCombiningMarks: boolean;
  usesToneDiacriticsOrPitch: boolean;
  specialNotes: string[];
}

export interface LanguagePronunciationMetadata {
  defaultBcp47Locale: string;
  supportedVarieties: string[];
  defaultVariety: string;
  transliterationSystem?: string;
  phoneticNotation: 'IPA' | 'IPA+Pinyin' | 'IPA+Romaji' | 'IPA+RR' | 'IPA+IAST';
}

export interface LanguageDefinition {
  code: string; // ISO 639-1 or canonical language code
  nameEn: string;
  nativeName: string;
  scriptCode: WritingScriptCode;
  scriptNameEn: string;
  direction: TextDirection;
  isForeignLanguageTarget: boolean;
  isSupportedNativeForEnglish: boolean;
  isEnglishTarget?: boolean;
  supportsNativeSpecificCurricula?: boolean;
  sampleGreetingNative: string;
  sampleGreetingTranslit?: string;
  sampleGreetingEn: string;
  fontStackCss: string;
  grammarMetadata: LanguageGrammarMetadata;
  pronunciationMetadata: LanguagePronunciationMetadata;
}

const INITIAL_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'es',
    nameEn: 'Spanish',
    nativeName: 'Español',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: '¡Hola! ¿Cómo estás?',
    sampleGreetingEn: 'Hello! How are you?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['ser vs estar copula distinction', 'subjunctive mood', 'preterite vs imperfect aspect'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'es-ES',
      supportedVarieties: ['es-419', 'es-MX', 'es-ES'],
      defaultVariety: 'es-419',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'fr',
    nameEn: 'French',
    nativeName: 'Français',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Bonjour ! Comment allez-vous ?',
    sampleGreetingEn: 'Hello! How are you?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['liaison and elision', 'nasal vowels', 'partitive articles'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'fr-FR',
      supportedVarieties: ['fr-FR', 'fr-CA'],
      defaultVariety: 'fr-FR',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'it',
    nameEn: 'Italian',
    nativeName: 'Italiano',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Ciao! Come stai?',
    sampleGreetingEn: 'Hi! How are you?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['geminate (double) consonants', 'articulated prepositions', 'clitic pronouns'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'it-IT',
      supportedVarieties: ['it-IT'],
      defaultVariety: 'it-IT',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'pt',
    nameEn: 'Portuguese',
    nativeName: 'Português',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Olá! Tudo bem?',
    sampleGreetingEn: 'Hello! Is everything well?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['personal infinitive', 'nasal diphthongs (ão, õe)', 'future subjunctive'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'pt-BR',
      supportedVarieties: ['pt-BR', 'pt-PT'],
      defaultVariety: 'pt-BR',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'ru',
    nameEn: 'Russian',
    nativeName: 'Русский',
    scriptCode: 'Cyrl',
    scriptNameEn: 'Cyrillic',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Здравствуйте! Как дела?',
    sampleGreetingTranslit: 'Zdravstvuyte! Kak dela?',
    sampleGreetingEn: 'Hello! How are things?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine', 'neuter'],
      hasCaseSystem: true,
      caseCount: 6,
      wordOrderDefault: 'flexible',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['6 grammatical cases', 'verbal aspect pairs', 'unstressed vowel reduction (akanie)'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'ru-RU',
      supportedVarieties: ['ru-RU'],
      defaultVariety: 'ru-RU',
      transliterationSystem: 'Scientific/BGN',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'uk',
    nameEn: 'Ukrainian',
    nativeName: 'Українська',
    scriptCode: 'Cyrl',
    scriptNameEn: 'Cyrillic',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Приві́т! Як у ва́с спра́ви?',
    sampleGreetingTranslit: 'Pryvit! Yak u vas spravy?',
    sampleGreetingEn: 'Hello! How are you doing?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine', 'neuter'],
      hasCaseSystem: true,
      caseCount: 7,
      wordOrderDefault: 'flexible',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: true,
      usesToneDiacriticsOrPitch: false,
      specialNotes: [
        '7 grammatical cases including Vocative',
        'euphony rules (у/в, і/й/та)',
        'voiced pharyngeal г [ɦ] vs velar ґ [ɡ]',
      ],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'uk-UA',
      supportedVarieties: ['uk-UA'],
      defaultVariety: 'uk-UA',
      transliterationSystem: 'KMU-2010 + Phonetic Guide',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'pl',
    nameEn: 'Polish',
    nativeName: 'Polski',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Cześć! Jak się masz?',
    sampleGreetingEn: 'Hi! How are you?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine-personal', 'masculine-animate', 'masculine-inanimate', 'feminine', 'neuter'],
      hasCaseSystem: true,
      caseCount: 7,
      wordOrderDefault: 'flexible',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['7 grammatical cases', 'nasal vowels ą/ę', 'virile vs non-virile plural agreement'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'pl-PL',
      supportedVarieties: ['pl-PL'],
      defaultVariety: 'pl-PL',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'de',
    nameEn: 'German',
    nativeName: 'Deutsch',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Guten Tag! Wie geht es Ihnen?',
    sampleGreetingEn: 'Good day! How are you?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine', 'neuter'],
      hasCaseSystem: true,
      caseCount: 4,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['4 cases (Nom, Acc, Dat, Gen)', 'V2 main clause and verb-final subordinate word order', 'separable prefix verbs'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'de-DE',
      supportedVarieties: ['de-DE', 'de-AT', 'de-CH'],
      defaultVariety: 'de-DE',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'zh',
    nameEn: 'Chinese',
    nativeName: '中文',
    scriptCode: 'Hans',
    scriptNameEn: 'Simplified Chinese (Hanzi)',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: '你好！你最近怎么样？',
    sampleGreetingTranslit: 'Nǐ hǎo! Nǐ zuìjìn zěnmeyàng?',
    sampleGreetingEn: 'Hello! How have you been lately?',
    fontStackCss:
      "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: false,
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'mixed',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: true,
      specialNotes: ['4 lexical tones + neutral tone', 'measure words / classifiers', 'aspect particles (了, 过, 着)'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'zh-CN',
      supportedVarieties: ['zh-CN', 'zh-TW'],
      defaultVariety: 'zh-CN',
      transliterationSystem: 'Hanyu Pinyin',
      phoneticNotation: 'IPA+Pinyin',
    },
  },
  {
    code: 'vi',
    nameEn: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    scriptCode: 'Latn',
    scriptNameEn: 'Vietnamese Latin (Chữ Quốc ngữ)',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'Xin chào! Bạn có khỏe không?',
    sampleGreetingEn: 'Hello! Are you well?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Noto Sans', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: false,
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: true,
      usesToneDiacriticsOrPitch: true,
      specialNotes: ['6 lexical tones with stacked vowel + tone diacritics', 'kinship pronoun system', 'noun classifiers'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'vi-VN',
      supportedVarieties: ['vi-VN'],
      defaultVariety: 'vi-VN',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'ko',
    nameEn: 'Korean',
    nativeName: '한국어',
    scriptCode: 'Hang',
    scriptNameEn: 'Hangul (한글)',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: '안녕하세요! 잘 지내셨어요?',
    sampleGreetingTranslit: 'Annyeonghaseyo! Jal jinaesyeosseoyo?',
    sampleGreetingEn: 'Hello! Have you been well?',
    fontStackCss:
      "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: false,
      hasCaseSystem: true,
      wordOrderDefault: 'SOV',
      adpositionType: 'postpositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['SOV word order with topic/subject particles (은/는, 이/가)', 'speech levels and honorifics', 'agglutinative verb endings'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'ko-KR',
      supportedVarieties: ['ko-KR'],
      defaultVariety: 'ko-KR',
      transliterationSystem: 'Revised Romanization',
      phoneticNotation: 'IPA+RR',
    },
  },
  {
    code: 'ja',
    nameEn: 'Japanese',
    nativeName: '日本語',
    scriptCode: 'Jpan',
    scriptNameEn: 'Kanji, Hiragana & Katakana',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'こんにちは！お元気ですか？',
    sampleGreetingTranslit: 'Konnichiwa! O-genki desu ka?',
    sampleGreetingEn: 'Hello! How are you?',
    fontStackCss:
      "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: false,
      hasCaseSystem: true,
      wordOrderDefault: 'SOV',
      adpositionType: 'postpositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: true,
      specialNotes: ['mora-timed pitch accent', 'three integrated scripts (Hiragana, Katakana, Kanji)', 'postpositional particles (は, が, を, に, で) and keigo politeness'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'ja-JP',
      supportedVarieties: ['ja-JP'],
      defaultVariety: 'ja-JP',
      transliterationSystem: 'Hepburn Romaji',
      phoneticNotation: 'IPA+Romaji',
    },
  },
  {
    code: 'ar',
    nameEn: 'Arabic',
    nativeName: 'العربية',
    scriptCode: 'Arab',
    scriptNameEn: 'Arabic (Right-to-Left)',
    direction: 'rtl',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'مرحباً! كيف حالك؟',
    sampleGreetingTranslit: 'Marḥaban! Kayfa ḥāluka?',
    sampleGreetingEn: 'Hello! How are you?',
    fontStackCss:
      "'Geeza Pro', 'SF Arabic', 'Noto Naskh Arabic', 'Segoe UI', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: true,
      caseCount: 3,
      wordOrderDefault: 'VSO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: true,
      usesToneDiacriticsOrPitch: false,
      specialNotes: ['Right-to-Left (RTL) cursive script with contextual letter forms', 'triliteral root-and-pattern morphology', 'dual number alongside singular and plural'],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'ar-SA',
      supportedVarieties: ['ar-001', 'ar-EG', 'ar-SA'],
      defaultVariety: 'ar-001',
      transliterationSystem: 'DIN 31635 / Buckwalter',
      phoneticNotation: 'IPA',
    },
  },
  {
    code: 'hi',
    nameEn: 'Hindi',
    nativeName: 'हिन्दी',
    scriptCode: 'Deva',
    scriptNameEn: 'Devanagari (देवनागरी)',
    direction: 'ltr',
    isForeignLanguageTarget: true,
    isSupportedNativeForEnglish: true,
    sampleGreetingNative: 'नमस्ते! आप कैसे हैं?',
    sampleGreetingTranslit: 'Namaste! Āp kaise haiṅ?',
    sampleGreetingEn: 'Hello! How are you?',
    fontStackCss:
      "'Kohinoor Devanagari', 'ITF Devanagari', 'Noto Sans Devanagari', 'Mangal', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: true,
      genderCategories: ['masculine', 'feminine'],
      hasCaseSystem: true,
      caseCount: 3,
      wordOrderDefault: 'SOV',
      adpositionType: 'postpositional',
      scriptRequiresCombiningMarks: true,
      usesToneDiacriticsOrPitch: false,
      specialNotes: [
        'Devanagari abugida script with dependent vowel signs (matras: ा, ि, ी, ु, ू, ृ, े, ै, ो, ौ), halant/virama (्), anusvara (ं), chandrabindu (ँ), and nukta (़)',
        '4-way stop contrast: voiceless unaspirated vs aspirated, voiced unaspirated vs murmured/breathy-voiced (क/ख/ग/घ) plus dental vs retroflex contrast (त/ट, द/ड)',
        'Direct, Oblique, and Vocative noun cases with postpositions (में, पर, से, को, का/के/की) and split-ergative perfective construction with ने (ne)',
      ],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'hi-IN',
      supportedVarieties: ['hi-IN'],
      defaultVariety: 'hi-IN',
      transliterationSystem: 'IAST / ISO 15919 + Plain Phonetic Guide',
      phoneticNotation: 'IPA+IAST',
    },
  },
  {
    code: 'en',
    nameEn: 'English',
    nativeName: 'English',
    scriptCode: 'Latn',
    scriptNameEn: 'Latin',
    direction: 'ltr',
    isForeignLanguageTarget: false,
    isSupportedNativeForEnglish: false,
    isEnglishTarget: true,
    supportsNativeSpecificCurricula: true,
    sampleGreetingNative: 'Hello! How are you doing today?',
    sampleGreetingEn: 'Hello! How are you doing today?',
    fontStackCss:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    grammarMetadata: {
      hasGrammaticalGender: false,
      hasCaseSystem: false,
      wordOrderDefault: 'SVO',
      adpositionType: 'prepositional',
      scriptRequiresCombiningMarks: false,
      usesToneDiacriticsOrPitch: false,
      specialNotes: [
        'Supports 14 independent native-language-specific ESL/EFL curricula',
        'Stress-timed rhythm, vowel reduction to schwa [ə], dental fricatives [θ/ð], phrasal verbs, article system (a/an/the/zero), and progressive/perfect aspect combinations',
      ],
    },
    pronunciationMetadata: {
      defaultBcp47Locale: 'en-US',
      supportedVarieties: ['en-US', 'en-GB', 'en-CA', 'en-AU'],
      defaultVariety: 'en-US',
      phoneticNotation: 'IPA',
    },
  },
];

const languageRegistryMap = new Map<string, LanguageDefinition>(
  INITIAL_LANGUAGES.map((lang) => [lang.code, lang])
);

export function getAllLanguages(): LanguageDefinition[] {
  return Array.from(languageRegistryMap.values());
}

export function getForeignLanguages(): LanguageDefinition[] {
  return Array.from(languageRegistryMap.values()).filter(
    (lang) => lang.isForeignLanguageTarget
  );
}

export function getAllTargetLanguages(): LanguageDefinition[] {
  return Array.from(languageRegistryMap.values()).filter(
    (lang) => lang.isForeignLanguageTarget || lang.isEnglishTarget
  );
}

export function getSupportedNativeLanguagesForEnglish(): LanguageDefinition[] {
  return Array.from(languageRegistryMap.values()).filter(
    (lang) => lang.isSupportedNativeForEnglish
  );
}

export function getLanguageByCode(code: string): LanguageDefinition | undefined {
  if (!code) return undefined;
  return languageRegistryMap.get(code.toLowerCase().trim());
}

/**
 * Extensibility hook: allows future languages to be registered at runtime
 * without hardcoding the platform to a fixed language count.
 */
export function registerAdditionalLanguage(langDef: LanguageDefinition): void {
  const cleanCode = langDef.code.toLowerCase().trim();
  languageRegistryMap.set(cleanCode, {
    ...langDef,
    code: cleanCode,
  });
}

// ============================================================================
// HINDI DEVANAGARI & MULTILINGUAL UNICODE NORMALIZATION UTILITIES
// ============================================================================

export interface HindiDevanagariInspection {
  originalText: string;
  normalizedNfc: string;
  containsDevanagari: boolean;
  baseConsonants: string[];
  independentVowels: string[];
  dependentVowelSignsMatras: string[];
  hasHalantVirama: boolean;
  hasAnusvara: boolean;
  hasChandrabindu: boolean;
  hasVisarga: boolean;
  hasNukta: boolean;
  codePointCount: number;
}

/**
 * Normalizes multilingual strings safely while preserving:
 * - Hindi Devanagari dependent vowel signs (matras \u093E-\u094C, \u0962-\u0963),
 *   halant/virama (\u094D), chandrabindu (\u0901), anusvara (\u0902), visarga (\u0903), and nukta (\u093C)
 * - Ukrainian combining acute stress mark (\u0301) when preserveUkrainianStress=true
 * - Vietnamese stacked tone + vowel diacritics (NFC)
 * - Arabic harakat / diacritics
 * - CJK, Hangul, and Kana characters
 */
export function normalizeMultilingualText(
  text: string,
  langCode = 'en',
  options: { stripUkrainianStress?: boolean; lowercase?: boolean } = {}
): string {
  if (!text) return '';
  let result = text.normalize('NFC');
  if (options.stripUkrainianStress && (langCode === 'uk' || langCode === 'ru')) {
    result = result.replace(/\u0301/g, '');
  }
  if (options.lowercase) {
    result = result.toLowerCase();
  }
  return result.trim();
}

/**
 * Inspects Hindi Devanagari text (U+0900..U+097F) and verifies that combining marks,
 * vowel signs (matras), virama/halant, anusvara, chandrabindu, and nukta are preserved.
 */
export function inspectHindiScriptMetadata(text: string): HindiDevanagariInspection {
  const normalizedNfc = normalizeMultilingualText(text, 'hi');
  const codePoints = Array.from(normalizedNfc);

  const baseConsonants: string[] = [];
  const independentVowels: string[] = [];
  const dependentVowelSignsMatras: string[] = [];
  let containsDevanagari = false;
  let hasHalantVirama = false;
  let hasAnusvara = false;
  let hasChandrabindu = false;
  let hasVisarga = false;
  let hasNukta = false;

  for (const ch of codePoints) {
    const cp = ch.codePointAt(0) || 0;
    if (cp >= 0x0900 && cp <= 0x097f) {
      containsDevanagari = true;
    }
    if (cp >= 0x0904 && cp <= 0x0914) {
      independentVowels.push(ch);
    } else if (cp >= 0x0915 && cp <= 0x0939) {
      baseConsonants.push(ch);
    } else if (cp >= 0x0958 && cp <= 0x095f) {
      baseConsonants.push(ch);
      hasNukta = true;
    } else if (cp >= 0x093e && cp <= 0x094c) {
      dependentVowelSignsMatras.push(ch);
    } else if (cp === 0x094d) {
      hasHalantVirama = true;
    } else if (cp === 0x0902) {
      hasAnusvara = true;
    } else if (cp === 0x0901) {
      hasChandrabindu = true;
    } else if (cp === 0x0903) {
      hasVisarga = true;
    } else if (cp === 0x093c) {
      hasNukta = true;
    }
  }

  return {
    originalText: text,
    normalizedNfc,
    containsDevanagari,
    baseConsonants,
    independentVowels,
    dependentVowelSignsMatras,
    hasHalantVirama,
    hasAnusvara,
    hasChandrabindu,
    hasVisarga,
    hasNukta,
    codePointCount: codePoints.length,
  };
}

// ============================================================================
// SEPARATION OF NATIVE, TARGET, INSTRUCTIONAL & INTERFACE LANGUAGES (SECTION 9 & 22)
// ============================================================================

export interface LearnerLanguageContext {
  nativeLanguage: string; // Learner's L1 (e.g., 'en', 'es', 'vi', 'hi', 'uk')
  targetLanguage: string; // Language being learned (e.g., 'uk', 'hi', 'en')
  instructionalLanguage: string; // Language used to explain lessons (e.g., 'en', 'es', 'vi', 'hi')
  interfaceLanguage: string; // Language used for UI buttons/menus (default 'en' in Phase 1)
  courseTrackId: string; // Specific educational program ID (e.g., 'track:en-to-uk', 'track:vi-to-en')
}

export type InterfaceStringKey =
  | 'selector.whatLanguageToLearn'
  | 'selector.whatIsYourNativeLanguage'
  | 'selector.directionAHeading'
  | 'selector.directionBHeading'
  | 'course.comingSoonTitle'
  | 'course.comingSoonBody'
  | 'course.publishedStatus'
  | 'course.comingSoonStatus'
  | 'course.returnToUkrainian'
  | 'importer.openDevImporter';

const ENGLISH_UI_STRINGS: Record<InterfaceStringKey, string> = {
  'selector.whatLanguageToLearn': 'What language do you want to learn?',
  'selector.whatIsYourNativeLanguage': 'What is your native language?',
  'selector.directionAHeading': 'For English Speakers (14 Foreign Languages)',
  'selector.directionBHeading': 'Learn English (14 Native-Language-Specific Curricula)',
  'course.comingSoonTitle': 'Course Coming Soon',
  'course.comingSoonBody':
    'This course is currently being developed. Lessons will become available when the curriculum is ready.',
  'course.publishedStatus': 'Published • 29 Modules Ready',
  'course.comingSoonStatus': 'Coming Soon',
  'course.returnToUkrainian': 'Switch to Published Ukrainian Course (A0 → C1)',
  'importer.openDevImporter': 'Developer Course JSON Importer & Track Inspector',
};

const localeBundles = new Map<string, Partial<Record<InterfaceStringKey, string>>>([
  ['en', ENGLISH_UI_STRINGS],
]);

export function registerInterfaceLocaleBundle(
  localeCode: string,
  strings: Partial<Record<InterfaceStringKey, string>>
): void {
  const code = localeCode.toLowerCase().trim();
  const existing = localeBundles.get(code) || {};
  localeBundles.set(code, { ...existing, ...strings });
}

export function getInterfaceText(
  key: InterfaceStringKey,
  interfaceLanguage = 'en'
): string {
  const bundle = localeBundles.get(interfaceLanguage.toLowerCase().trim());
  if (bundle && bundle[key]) {
    return bundle[key]!;
  }
  return ENGLISH_UI_STRINGS[key];
}

export function getLanguageHtmlAttributes(langCode: string): {
  lang: string;
  dir: TextDirection;
  styleFontFamily: string;
} {
  const def = getLanguageByCode(langCode);
  return {
    lang: def ? def.code : 'en',
    dir: def ? def.direction : 'ltr',
    styleFontFamily:
      def?.fontStackCss ||
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
  };
}
