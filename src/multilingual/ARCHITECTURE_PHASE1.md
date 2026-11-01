# Lango — Phase 1 Multilingual Foundation, Universal Course Importer, Hindi Support & Native-Language-Specific English Learning

This document provides the complete architectural reference for **Lango Phase 1**, covering all 14 required design topics.

---

## 1. How the Language Registry Works (`/src/multilingual/languageRegistry.ts`)
- Every supported language is registered in `LANGUAGE_REGISTRY` with an `ISO 639-1` code, English name, native name (`nativeName`), script system (`Latn`, `Cyrl`, `Hans`, `Hang`, `Jpan`, `Arab`, `Deva`), reading direction (`ltr` or `rtl`), Unicode normalization form (`NFC`), default regional variety (`es-419`, `fr-FR`, `pt-BR`, `zh-CN`, `hi-IN`, `en-US`, etc.), font stack, and optional language-specific grammar/pronunciation metadata.
- **14 Supported Foreign Languages**:
  1. Spanish (`es` — Español)
  2. French (`fr` — Français)
  3. Italian (`it` — Italiano)
  4. Portuguese (`pt` — Português)
  5. Russian (`ru` — Русский)
  6. Ukrainian (`uk` — Українська)
  7. Polish (`pl` — Polski)
  8. German (`de` — Deutsch)
  9. Chinese (`zh` — 中文)
  10. Vietnamese (`vi` — Tiếng Việt)
  11. Korean (`ko` — 한국어)
  12. Japanese (`ja` — 日本語)
  13. Arabic (`ar` — العربية, `dir="rtl"`)
  14. Hindi (`hi` — हिन्दी, Devanagari script `Deva`)
- **Plus English (`en`) as a Target Language**:
  - `getAllTargetLanguages()` returns all 15 target languages (14 foreign languages + English).
  - `registerAdditionalLanguage()` allows adding new languages dynamically without changing selector UI or course engine logic.

---

## 2. How Target-Language and Native-Language Selectors Work (`/src/multilingual/multilingualSelectorView.ts`)
- **Step 1 — Target Language Selection (`What language do you want to learn?`)**:
  - Displays all 15 target languages (`es`, `fr`, `it`, `pt`, `ru`, `uk`, `pl`, `de`, `zh`, `vi`, `ko`, `ja`, `ar`, `hi`, and `en`).
  - If the user selects one of the 14 foreign languages (`target !== 'en'`), the selector resolves to Direction A (`en_to_foreign`, e.g., `track:en-to-uk` or `track:en-to-hi`).
- **Step 2 — Native Language Selection When Learning English (`What is your native language?`)**:
  - If the user selects **English (`en`)** as the target language, the modal displays the second-step chooser listing all 14 supported native languages (`es`, `fr`, `it`, `pt`, `ru`, `uk`, `pl`, `de`, `zh`, `vi`, `ko`, `ja`, `ar`, `hi`).
  - Selecting a native language resolves to the corresponding Direction B track (`foreign_to_en`, e.g., `track:es-to-en`, `track:ja-to-en`, `track:hi-to-en`).

---

## 3. How Course Tracks Are Identified (`/src/multilingual/courseTrackRegistry.ts`)
- Every course in Lango is identified by a composite **Course Track** rather than a single language code:
  - `trackId`: Canonical identifier (`track:<native>-to-<target>`, e.g., `track:en-to-uk`, `track:en-to-hi`, `track:es-to-en`, `track:ja-to-en`).
  - `courseId`: Globally unique course curriculum ID (`course:en-to-uk:v1`, `course:es-to-en:v1`, `course:ja-to-en:v1`, etc.).
  - `learningDirection`: `'en_to_foreign'` (Direction A, 14 tracks) or `'foreign_to_en'` (Direction B, 14 tracks).
  - `targetLanguage`: The language being learned.
  - `nativeLanguage`: The learner's L1 base language.
  - `instructionalLanguage`: The language used for grammar rules, explanations, contrast notes, and directions.
  - `progressNamespace`: Isolated storage key (`lango_track_progress_v1:<trackId>`).
  - `vocabOverlayNamespace`: Track-specific vocabulary overlay namespace (`vocab_overlay:<native>_to_<target>`).

---

## 4. How the Ukrainian Course Is Mapped (`track:en-to-uk`)
- The existing 29-module Ukrainian curriculum (`COURSE_MODULES` from `A0.1` to `C1.1`, `1,810` course vocabulary entries, `5,510` assessment items, `FREQ_6000_DB` 6,000-word FSRS database, `100` Identify WebP scenes, and `52` Reader passages) is mapped non-destructively to:
  - `trackId`: `'track:en-to-uk'`
  - `courseId`: `'course:en-to-uk:v1'`
  - `targetLanguage`: `'uk'`
  - `nativeLanguage`: `'en'`
  - `instructionalLanguage`: `'en'`
  - `availability`: `'published'`
- Existing localStorage keys (`slovo_ua_6000_anki_v1` and `slovo_ua_course_assessments_v1`) are preserved in place via `legacyStorageKeys` so existing Ukrainian learners lose zero progress.

---

## 5. How New Courses Are Registered
- All 28 initial Course Tracks (14 `en_to_foreign` + 14 `foreign_to_en`) are pre-registered in `COURSE_TRACK_REGISTRY`.
- The 27 non-Ukrainian tracks initialize with `availability: 'coming_soon'` and `modules: []` (strictly zero fake or placeholder curriculum lessons).
- New courses can be populated either by static TypeScript curriculum bundles or via the Universal Course JSON Importer (`universalCourseImporter.ts`).

---

## 6. How Course JSON Packages Are Imported (`/src/multilingual/universalCourseImporter.ts`)
- Course packages follow the versioned `UniversalCoursePackage` schema (`schemaVersion: '1.0'`).
- The importer parses the JSON payload, normalizes all multilingual text strings to Unicode `NFC`, verifies schema version and required fields, checks language pair and track compatibility against the destination Course Track, inspects module/section/lesson/activity/vocabulary/assessment structures, and generates a `CourseImportPreviewReport` before any data can be committed.

---

## 7. How Metadata Is Validated
- `validateAndPreviewCourseImport()` validates:
  1. Valid JSON syntax and root object structure.
  2. `schemaVersion === '1.0'`.
  3. Registered `targetLanguage`, `nativeLanguage`, and `instructionalLanguage` codes.
  4. Exact match between package `(targetLanguage, nativeLanguage, courseTrackId, courseId)` and the destination `CourseTrack`.
  5. Duplicate module, section, lesson, activity, vocabulary, or assessment IDs.
  6. Missing vocabulary or media references inside lessons and activities.
  7. Unsupported activity or lesson block types: flagged in `unsupportedActivityTypes` and `warnings` while preserving all unknown fields in `preservedMetadata`.
  8. Strict non-overwrite protection for the published Ukrainian track (`track:en-to-uk`).

---

## 8. How Cross-Language Collisions Are Prevented
- Every Course Track has its own `trackId`, `courseId`, `progressNamespace` (`lango_track_progress_v1:<trackId>`), and `vocabOverlayNamespace`.
- Switching between `track:en-to-uk`, `track:en-to-hi`, `track:es-to-en`, and `track:ja-to-en` reads and writes exclusively to that track's namespace.
- Importer validation blocks any package whose `courseTrackId`, `courseId`, `targetLanguage`, or `nativeLanguage` does not match the destination track.

---

## 9. How Native-Language-Specific English Courses Are Distinguished
- Lango does **not** use a single generic English course. Instead, Direction B defines 14 distinct Course Tracks (`track:es-to-en`, `track:fr-to-en`, `track:it-to-en`, `track:pt-to-en`, `track:ru-to-en`, `track:uk-to-en`, `track:pl-to-en`, `track:de-to-en`, `track:zh-to-en`, `track:vi-to-en`, `track:ko-to-en`, `track:ja-to-en`, `track:ar-to-en`, `track:hi-to-en`).
- For example, `resolveCourseTrack('en', 'es')` resolves to `track:es-to-en` (*English for Spanish Speakers*, instructional language `es`), whereas `resolveCourseTrack('en', 'ja')` resolves to `track:ja-to-en` (*English for Japanese Speakers*, instructional language `ja`). They never share a `courseId` or progress store.

---

## 10. How Future English Curricula for Different Native Languages Will Be Added
- Each native-language-specific English curriculum is authored as a dedicated `UniversalCoursePackage` targeting its specific track (e.g., `courseTrackId: 'track:hi-to-en'`, `targetLanguage: 'en'`, `nativeLanguage: 'hi'`, `instructionalLanguage: 'hi'`).
- This allows each track to sequence grammar, false friends, article/tense contrasts, and phonetic drills around the exact L1 transfer patterns of that learner group.

---

## 11. How Canonical English Vocabulary and Native-Language Overlays Work (`/src/multilingual/courseTrackProgress.ts`)
- **Layer 1 — Canonical English Target Lexeme (`CanonicalEnglishLexeme`)**:
  - Stores shared target-English properties once per lexeme (`lexemeId`, `lemma`, `partOfSpeech`, `cefrLevel`, `ipaUs`, `ipaUk`, `audioAssetId`, `exampleSentencesEn`).
- **Layer 2 — Native-Language Pedagogical Overlay (`NativeLanguageVocabOverlay`)**:
  - Keyed by `${lexemeId}::${nativeLanguage}` (`registerNativeLanguageVocabOverlay`).
  - Stores the L1 translation/gloss, L1 grammar note, false-friend warning, and L1 pronunciation contrast note in the learner's native language.
- **Layer 3 — Track-Isolated FSRS State**:
  - `resolveEnglishVocabCardForTrack(lexemeId, trackId)` combines the shared canonical English lexeme, the learner's L1 overlay, and the learner's track-isolated FSRS scheduling state.

---

## 12. How Subscription Entitlements Will Attach Later (`/src/multilingual/courseTrackProgress.ts`)
- `evaluateCourseTrackModuleAccess(moduleIndexZeroBased, track, entitlements)` implements a clean, provider-agnostic entitlement boundary:
  - Module 1 (`moduleIndexZeroBased === 0`) is always accessible (`free_preview_module_1`).
  - Subsequent modules check `entitlements` across 3 scopes without coupling curriculum data to billing logic:
    1. `all_access` (unlocks all 28 tracks)
    2. `direction_bundle` (`en_to_foreign` or `foreign_to_en`)
    3. `single_track` (specific `trackId`, e.g., `track:es-to-en` or `track:en-to-hi`)

---

## 13. How UI Localization Is Separated from Course Track Content (`/src/multilingual/languageRegistry.ts`)
- `MultilingualContextState` explicitly separates four language dimensions:
  1. `nativeLanguage`: Learner's L1 base language.
  2. `targetLanguage`: Language being studied.
  3. `instructionalLanguage`: Language used inside lesson explanations and grammar notes.
  4. `interfaceLanguage`: Language used for UI chrome (`UI_TRANSLATION_BUNDLES`), with automatic fallback to English via `tUi(key, interfaceLanguage)`.

---

## 14. How Hindi (`hi`) Script, Normalization, and Rendering Are Supported
- Registered in `LANGUAGE_REGISTRY` with `code: 'hi'`, `nativeName: 'हिन्दी'`, `script: 'Deva'`, `direction: 'ltr'`, `unicodeNormalization: 'NFC'`, and `defaultVariety: 'hi-IN'`.
- `inspectHindiScriptMetadata()` and `normalizeMultilingualText()` ensure NFC Unicode normalization and preserve all Devanagari combining signs:
  - Dependent vowel matras (`\u093E`–`\u094C`: ा, ि, ी, ु, ू, ृ, े, ै, ो, औ)
  - Halant / Virama (`\u094D`: ्) for consonant conjuncts (`हिन्दी`, `नमस्ते`)
  - Anusvara (`\u0902`: ं), Chandrabindu (`\u0901`: ँ), Visarga (`\u0903`: ः), and Nukta (`\u093C`: ़).
