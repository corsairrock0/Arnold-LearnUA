// ============================================================================
// LANGO PHASE 1 — INDEPENDENT COURSE-TRACK PROGRESS, CANONICAL ENGLISH
// VOCABULARY OVERLAYS & FUTURE SUBSCRIPTION ENTITLEMENT ARCHITECTURE
// ============================================================================

import {
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
  type CourseTrack,
  type EntitlementScope,
} from './courseTrackRegistry.ts';

// ============================================================================
// 1. INDEPENDENT PROGRESS BY COURSE TRACK (SECTION 20)
// ============================================================================

export interface TrackFsrsItemState {
  vocabularyItemId: string;
  state: 'new' | 'learning' | 'review';
  interval: number;
  ease: number;
  due: number;
}

export interface CourseTrackProgressRecord {
  userId: string; // 'local_anonymous_learner' in Phase 1 (future account ready)
  courseTrackId: string; // e.g., 'track:en-to-uk', 'track:es-to-en', 'track:ja-to-en'
  xp: number;
  reviewsCompleted: number;
  completedModuleIds: string[];
  completedLessonIds: string[];
  completedAssessmentIds: string[];
  fsrsItems: Record<string, TrackFsrsItemState>;
  lastUpdatedAt: number;
}

const SELECTED_TRACK_STORAGE_KEY = 'lango_selected_course_track_v1';
const INTERFACE_LANG_STORAGE_KEY = 'lango_interface_language_v1';

const inMemoryTrackProgressFallback = new Map<string, CourseTrackProgressRecord>();
let inMemorySelectedTrackId = PUBLISHED_UKRAINIAN_TRACK_ID;
let inMemoryInterfaceLanguage = 'en';

function hasLocalStorage(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { localStorage?: Storage }).localStorage !== 'undefined'
  );
}

export function getSelectedCourseTrackId(): string {
  if (hasLocalStorage()) {
    const saved = localStorage.getItem(SELECTED_TRACK_STORAGE_KEY);
    if (saved && getCourseTrackById(saved)) {
      return saved;
    }
  }
  if (getCourseTrackById(inMemorySelectedTrackId)) {
    return inMemorySelectedTrackId;
  }
  return PUBLISHED_UKRAINIAN_TRACK_ID;
}

export function setSelectedCourseTrackId(trackId: string): CourseTrack {
  const track =
    getCourseTrackById(trackId) ||
    getCourseTrackById(PUBLISHED_UKRAINIAN_TRACK_ID)!;
  inMemorySelectedTrackId = track.trackId;
  if (hasLocalStorage()) {
    localStorage.setItem(SELECTED_TRACK_STORAGE_KEY, track.trackId);
  }
  return track;
}

export function getSelectedInterfaceLanguage(): string {
  if (hasLocalStorage()) {
    const saved = localStorage.getItem(INTERFACE_LANG_STORAGE_KEY);
    if (saved) return saved;
  }
  return inMemoryInterfaceLanguage;
}

export function setSelectedInterfaceLanguage(langCode: string): void {
  const clean = (langCode || 'en').toLowerCase().trim();
  inMemoryInterfaceLanguage = clean;
  if (hasLocalStorage()) {
    localStorage.setItem(INTERFACE_LANG_STORAGE_KEY, clean);
  }
}

/**
 * Migration-compatible progress loader:
 * - For 'track:en-to-uk' (Ukrainian), reads directly from the existing 'slovo_ua_6000_anki_v1'
 *   namespace without modifying or resetting existing Ukrainian progress.
 * - For every other Course Track (e.g., 'track:es-to-en', 'track:ja-to-en', 'track:en-to-hi'),
 *   maintains a completely isolated progress record under its own track-specific namespace.
 */
export function getCourseTrackProgress(
  courseTrackId: string
): CourseTrackProgressRecord {
  const track = getCourseTrackById(courseTrackId);
  if (!track) {
    throw new Error(`Cannot load progress for unknown track ID: ${courseTrackId}`);
  }

  // Non-destructive adapter for existing Ukrainian progress
  if (track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    if (hasLocalStorage()) {
      const rawUk = localStorage.getItem('slovo_ua_6000_anki_v1');
      if (rawUk) {
        try {
          const parsed = JSON.parse(rawUk);
          const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
          const fsrsItems: Record<string, TrackFsrsItemState> = {};
          for (const c of cards) {
            if (c && typeof c.rank === 'number') {
              const id = `uk_rank_${c.rank}`;
              fsrsItems[id] = {
                vocabularyItemId: id,
                state: c.state || 'new',
                interval: typeof c.interval === 'number' ? c.interval : 0,
                ease: typeof c.ease === 'number' ? c.ease : 2.5,
                due: typeof c.due === 'number' ? c.due : 0,
              };
            }
          }
          return {
            userId: 'local_anonymous_learner',
            courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            reviewsCompleted:
              typeof parsed.drills === 'number' ? parsed.drills : 0,
            completedModuleIds: Array.isArray(parsed.passedMods)
              ? [...parsed.passedMods]
              : [],
            completedLessonIds: [],
            completedAssessmentIds: Array.isArray(parsed.passedMods)
              ? parsed.passedMods.map((m: string) => `${m}:exam`)
              : [],
            fsrsItems,
            lastUpdatedAt: Date.now(),
          };
        } catch {
          // Fall through to default record if malformed
        }
      }
    }
  }

  const storageKey = track.progressNamespace;
  if (hasLocalStorage()) {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CourseTrackProgressRecord;
        if (parsed && parsed.courseTrackId === track.trackId) {
          return parsed;
        }
      } catch {
        // Ignore malformed
      }
    }
  }

  if (inMemoryTrackProgressFallback.has(track.trackId)) {
    return inMemoryTrackProgressFallback.get(track.trackId)!;
  }

  return {
    userId: 'local_anonymous_learner',
    courseTrackId: track.trackId,
    xp: 0,
    reviewsCompleted: 0,
    completedModuleIds: [],
    completedLessonIds: [],
    completedAssessmentIds: [],
    fsrsItems: {},
    lastUpdatedAt: Date.now(),
  };
}

/**
 * Updates progress for a non-Ukrainian Course Track in its isolated namespace.
 * Never overwrites 'slovo_ua_6000_anki_v1' from another track.
 */
export function saveIsolatedTrackProgress(
  courseTrackId: string,
  update: Partial<
    Pick<
      CourseTrackProgressRecord,
      | 'xp'
      | 'reviewsCompleted'
      | 'completedModuleIds'
      | 'completedLessonIds'
      | 'completedAssessmentIds'
      | 'fsrsItems'
    >
  >
): CourseTrackProgressRecord {
  const track = getCourseTrackById(courseTrackId);
  if (!track) {
    throw new Error(`Unknown course track ID: ${courseTrackId}`);
  }
  if (track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    throw new Error(
      'Ukrainian progress is managed directly by the native SlovoDB adapter (slovo_ua_6000_anki_v1).'
    );
  }

  const current = getCourseTrackProgress(courseTrackId);
  const next: CourseTrackProgressRecord = {
    ...current,
    ...update,
    courseTrackId: track.trackId,
    lastUpdatedAt: Date.now(),
  };

  inMemoryTrackProgressFallback.set(track.trackId, next);
  if (hasLocalStorage()) {
    localStorage.setItem(track.progressNamespace, JSON.stringify(next));
  }
  return next;
}

// ============================================================================
// 2. SHARED CANONICAL ENGLISH VOCABULARY & L1 OVERLAY ARCHITECTURE (SECTION 19)
// ============================================================================

export interface CanonicalEnglishLexeme {
  lexemeId: string; // Stable canonical ID, e.g., 'en_lex_0001'
  headwordEn: string;
  pos: string;
  ipaUs: string;
  ipaGb?: string;
  coreMeaningEn: string;
  canonicalExamplesEn: string[];
}

export interface NativeLanguageEnglishVocabOverlay {
  overlayId: string; // e.g., 'vocab-overlay:en:for-es'
  courseTrackId: string; // e.g., 'track:es-to-en'
  nativeLanguage: string; // e.g., 'es', 'ja', 'ar', 'hi'
  lexemeId: string; // References CanonicalEnglishLexeme.lexemeId
  translationNative: string;
  explanationNative: string;
  pronunciationTipForNativeSpeaker: string;
  l1TransferOrFalseFriendNote?: string;
  bilingualExamples: Array<{ en: string; native: string }>;
  pedagogicalSequenceOrder: number;
}

/**
 * Architectural registry for future canonical English vocabulary items and
 * per-native-language teaching overlays. Demonstrates how a single English lexical
 * identity is shared across all 14 English tracks while preserving completely
 * distinct native-language translations, explanations, pronunciation coaching,
 * teaching sequences, and FSRS review progress per CourseTrack.
 */
const canonicalEnglishLexemeRegistry = new Map<string, CanonicalEnglishLexeme>();
const nativeLanguageOverlayRegistry = new Map<
  string,
  Map<string, NativeLanguageEnglishVocabOverlay>
>();

export function registerCanonicalEnglishLexeme(
  lexeme: CanonicalEnglishLexeme
): void {
  canonicalEnglishLexemeRegistry.set(lexeme.lexemeId, lexeme);
}

export function registerNativeLanguageVocabOverlay(
  overlay: NativeLanguageEnglishVocabOverlay
): void {
  if (!nativeLanguageOverlayRegistry.has(overlay.courseTrackId)) {
    nativeLanguageOverlayRegistry.set(overlay.courseTrackId, new Map());
  }
  nativeLanguageOverlayRegistry
    .get(overlay.courseTrackId)!
    .set(overlay.lexemeId, overlay);
}

export function resolveEnglishVocabCardForTrack(
  lexemeId: string,
  courseTrackId: string
): {
  canonical: CanonicalEnglishLexeme | undefined;
  overlay: NativeLanguageEnglishVocabOverlay | undefined;
  trackProgressState: TrackFsrsItemState | undefined;
} {
  const canonical = canonicalEnglishLexemeRegistry.get(lexemeId);
  const overlay = nativeLanguageOverlayRegistry
    .get(courseTrackId)
    ?.get(lexemeId);
  const progress = getCourseTrackProgress(courseTrackId);
  return {
    canonical,
    overlay,
    trackProgressState: progress.fsrsItems[lexemeId],
  };
}

// ============================================================================
// 3. FUTURE SUBSCRIPTION ENTITLEMENT ARCHITECTURE (SECTION 21)
// ============================================================================

export interface EntitlementGrant {
  grantId: string;
  scopeType: EntitlementScope;
  scopeValue: string; // e.g., 'track:es-to-en' OR 'lang:en' OR 'collection:english_esl_tracks'
  billingCycle?: 'monthly' | 'annual';
  active: boolean;
}

export interface ModuleAccessDecision {
  courseTrackId: string;
  moduleIndexZeroBased: number;
  isFreeTierModule: boolean;
  isUnlocked: boolean;
  matchedGrantScope?: EntitlementScope;
}

/**
 * Evaluates module access under the future Lango entitlement architecture without
 * hardcoding subscriptions exclusively to a target-language string.
 * Supports:
 * - 4 free published modules per course (indices 0..3)
 * - Track-specific entitlements ('course_track', e.g., unlocking only 'track:es-to-en')
 * - Language-wide entitlements ('target_language', e.g., unlocking all 'lang:en' tracks)
 * - Collection entitlements ('course_collection')
 * Note: In Phase 1, all 29 published Ukrainian modules remain 100% unlocked for the user.
 */
export function evaluateCourseTrackModuleAccess(
  courseTrackId: string,
  moduleIndexZeroBased: number,
  activeGrants: EntitlementGrant[] = [],
  enforcePaywallInPhase1 = false
): ModuleAccessDecision {
  const track = getCourseTrackById(courseTrackId);
  const freeLimit = track?.entitlementConfig.freePublishedModuleLimit ?? 4;
  const isFreeTierModule = moduleIndexZeroBased < freeLimit;

  // Phase 1 preservation rule: never lock existing Ukrainian modules or activate billing
  if (!enforcePaywallInPhase1) {
    return {
      courseTrackId,
      moduleIndexZeroBased,
      isFreeTierModule,
      isUnlocked: true,
    };
  }

  if (isFreeTierModule) {
    return {
      courseTrackId,
      moduleIndexZeroBased,
      isFreeTierModule: true,
      isUnlocked: true,
    };
  }

  if (!track) {
    return {
      courseTrackId,
      moduleIndexZeroBased,
      isFreeTierModule: false,
      isUnlocked: false,
    };
  }

  for (const grant of activeGrants) {
    if (!grant.active) continue;
    if (
      grant.scopeType === 'course_track' &&
      (grant.scopeValue === track.trackId ||
        grant.scopeValue === track.entitlementConfig.trackScopeKey)
    ) {
      return {
        courseTrackId,
        moduleIndexZeroBased,
        isFreeTierModule: false,
        isUnlocked: true,
        matchedGrantScope: 'course_track',
      };
    }
    if (
      grant.scopeType === 'target_language' &&
      (grant.scopeValue === track.targetLanguage ||
        grant.scopeValue === track.entitlementConfig.targetLanguageScopeKey)
    ) {
      return {
        courseTrackId,
        moduleIndexZeroBased,
        isFreeTierModule: false,
        isUnlocked: true,
        matchedGrantScope: 'target_language',
      };
    }
    if (
      grant.scopeType === 'course_collection' &&
      grant.scopeValue === track.entitlementConfig.collectionScopeKey
    ) {
      return {
        courseTrackId,
        moduleIndexZeroBased,
        isFreeTierModule: false,
        isUnlocked: true,
        matchedGrantScope: 'course_collection',
      };
    }
  }

  return {
    courseTrackId,
    moduleIndexZeroBased,
    isFreeTierModule: false,
    isUnlocked: false,
  };
}
