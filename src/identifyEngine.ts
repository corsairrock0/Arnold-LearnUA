// ============================================================================
// LangoUA — IDENTIFY QUIZ ENGINE, PROGRESS TRACKER & WORKSPACE RENDERER
// Supports Free Exploration, Guided Practice, Multiple Choice, Fill in Blank,
// Mandatory Show Answer, 7-Case Inspector Link, Audio, and Flashcard Export.
// ============================================================================

import {
  getApprovedLearnerTargets,
  getPlayableIdentifyCategories,
  IDENTIFY_CATEGORIES,
  IDENTIFY_MASTER_2000_NOUNS,
  isApprovedVerifiedLearnerTarget,
  isScenePlayableForStudents,
  isSynthetic5x5GridBox,
  renderIdentifySceneSvgDataUri,
  type IdentifyCategory,
  type IdentifyHotspot,
  type IdentifyScene,
} from './identifyData.ts';

export {
  getApprovedLearnerTargets,
  getPlayableIdentifyCategories,
  isApprovedVerifiedLearnerTarget,
  isScenePlayableForStudents,
  isSynthetic5x5GridBox,
};

export type IdentifyExplorationMode = 'explore' | 'free' | 'guided';
export type IdentifyQuizMode = 'mc' | 'fill';
export type IdentifyRoundLength = 5 | 8 | 10;
export type IdentifyTargetStatus = 'unanswered' | 'correct-mc' | 'correct-fill' | 'incorrect' | 'revealed';

export interface IdentifyTargetProgress {
  status: IdentifyTargetStatus;
  attempts: number;
  correctMC: number;
  correctTyped: number;
  incorrectAttempts: number;
  revealed: boolean;
  lastUserAnswer?: string;
  lastFeedback?: string;
  lastPracticedRound?: number;
}

export interface IdentifyActiveRoundState {
  roundId: string;
  sceneId: string;
  roundNumber: number;
  roundLength: IdentifyRoundLength;
  requestedRoundLength?: IdentifyRoundLength;
  shortenedDueToVerifiedLimit?: boolean;
  shortenedExplanationEn?: string;
  targetIds: string[];
  initialUnseenTargetIds: string[];
  completedInRoundTargetIds: string[];
  correctInRoundTargetIds: string[];
  incorrectOrRevealedInRoundTargetIds: string[];
  isMistakeReviewRound: boolean;
  xpAwarded: boolean;
}

export interface IdentifySceneProgress {
  sceneId: string;
  targets: Record<string, IdentifyTargetProgress>;
  roundsCompleted?: number;
  activeRound?: IdentifyActiveRoundState;
  awardedRoundIds?: string[];
  exploredTargetIds?: string[];
  completedAt?: number;
}

export interface IdentifyPersistentProgress {
  version: 1;
  activeCategoryId: string;
  activeSceneId: string;
  explorationMode: IdentifyExplorationMode;
  quizMode: IdentifyQuizMode;
  roundLength: IdentifyRoundLength;
  scenes: Record<string, IdentifySceneProgress>;
  wordsNeedingPractice: string[]; // vocabularyIds revealed or missed
}


export interface IdentifyValidationResult {
  isCorrect: boolean;
  matchedForm: string;
  errorType?: 'empty' | 'ukrainian-letter-confusion' | 'near-miss' | 'wrong';
  feedback: string;
}

export const IDENTIFY_STORAGE_KEY = 'slovo_ua_identify_progress_v1';

// ============================================================================
// 1. PURE NORMALIZATION & VALIDATION FUNCTIONS
// ============================================================================
export function normalizeIdentifyUk(str: string): string {
  return str
    .replace(/\u0301/g, '') // strip combining acute accent
    .replace(/['’ʼ`]/g, '’') // unify Ukrainian apostrophe
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function collapseUkrainianConfusables(s: string): string {
  return s
    .replace(/ґ/g, 'г')
    .replace(/ї/g, 'і')
    .replace(/и/g, 'і')
    .replace(/є/g, 'е');
}

export function validateIdentifyTypedAnswer(
  userInput: string,
  target: Pick<IdentifyHotspot, 'uk' | 'acceptedSynonyms' | 'en'>
): IdentifyValidationResult {
  const normUser = normalizeIdentifyUk(userInput);
  if (!normUser) {
    return {
      isCorrect: false,
      matchedForm: target.uk,
      errorType: 'empty',
      feedback: 'Please type a Ukrainian word or click "Show Answer" to learn it.',
    };
  }

  const allAccepted = [target.uk, ...(target.acceptedSynonyms || [])];
  for (const form of allAccepted) {
    if (normalizeIdentifyUk(form) === normUser) {
      return {
        isCorrect: true,
        matchedForm: form,
        feedback:
          form === target.uk
            ? `✅ Правильно! "${target.uk}" means "${target.en}".`
            : `✅ Правильно! "${form}" is an accepted synonym for "${target.uk}" (${target.en}).`,
      };
    }
  }

  // Check for specific Ukrainian letter confusion (г/ґ, і/ї, и/і, е/є)
  const primaryNorm = normalizeIdentifyUk(target.uk);
  if (collapseUkrainianConfusables(normUser) === collapseUkrainianConfusables(primaryNorm)) {
    return {
      isCorrect: false,
      matchedForm: target.uk,
      errorType: 'ukrainian-letter-confusion',
      feedback: `⚠️ Check Ukrainian letters (и/і, е/є, і/ї, г/ґ)! You wrote "${userInput.trim()}", but the correct spelling is "${target.uk}".`,
    };
  }

  const dist = editDistance(normUser, primaryNorm);
  if (dist <= 2) {
    return {
      isCorrect: false,
      matchedForm: target.uk,
      errorType: 'near-miss',
      feedback: `🤏 Very close! Check your spelling: you wrote "${userInput.trim()}", expected "${target.uk}".`,
    };
  }

  return {
    isCorrect: false,
    matchedForm: target.uk,
    errorType: 'wrong',
    feedback: `❌ Not quite. Try again or click "👁️ Show Answer" to reveal the Ukrainian word for "${target.en}".`,
  };
}

// ============================================================================
// 2. MULTIPLE-CHOICE OPTION GENERATOR
// ============================================================================
export function generateIdentifyMultipleChoiceOptions(
  target: IdentifyHotspot,
  category: IdentifyCategory
): string[] {
  const forbiddenNormalized = new Set<string>([
    normalizeIdentifyUk(target.uk),
    ...(target.acceptedSynonyms || []).map(normalizeIdentifyUk),
  ]);

  const candidates: string[] = [];
  for (const item of category.coreVocab) {
    const norm = normalizeIdentifyUk(item.uk);
    if (!forbiddenNormalized.has(norm) && !candidates.some((c) => normalizeIdentifyUk(c) === norm)) {
      candidates.push(item.uk);
    }
  }

  // Fallback across other categories if needed
  if (candidates.length < 3) {
    for (const cat of IDENTIFY_CATEGORIES) {
      for (const item of cat.coreVocab) {
        const norm = normalizeIdentifyUk(item.uk);
        if (!forbiddenNormalized.has(norm) && !candidates.some((c) => normalizeIdentifyUk(c) === norm)) {
          candidates.push(item.uk);
        }
        if (candidates.length >= 6) break;
      }
      if (candidates.length >= 6) break;
    }
  }

  // Deterministic rotation based on target id so options don't jump on re-render,
  // while placing the correct answer in varying slots (0..3) across targets.
  let hash = 0;
  for (let i = 0; i < target.id.length; i++) {
    hash = (hash * 31 + target.id.charCodeAt(i)) >>> 0;
  }

  const distractors: string[] = [];
  for (let i = 0; i < candidates.length && distractors.length < 3; i++) {
    const pick = candidates[(hash + i * 3) % candidates.length];
    if (!distractors.includes(pick)) {
      distractors.push(pick);
    }
  }
  for (const c of candidates) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(c)) distractors.push(c);
  }

  const options = [...distractors.slice(0, 3)];
  const insertPos = hash % 4;
  options.splice(insertPos, 0, target.uk);
  return options;
}

// ============================================================================
// 3. PROGRESS STATE MANAGEMENT & METRICS
// ============================================================================
export function createDefaultIdentifyProgress(): IdentifyPersistentProgress {
  return {
    version: 1,
    activeCategoryId: 'kitchen',
    activeSceneId: 'kitchen-scene-2',
    explorationMode: 'free',
    quizMode: 'mc',
    roundLength: 8,
    scenes: {},
    wordsNeedingPractice: [],
  };
}


export function loadIdentifyProgress(): IdentifyPersistentProgress {
  if (typeof localStorage === 'undefined') {
    return createDefaultIdentifyProgress();
  }
  try {
    const raw = localStorage.getItem(IDENTIFY_STORAGE_KEY);
    if (!raw) return createDefaultIdentifyProgress();
    const parsed = JSON.parse(raw) as IdentifyPersistentProgress;
    if (!parsed || typeof parsed !== 'object' || !parsed.scenes) {
      return createDefaultIdentifyProgress();
    }
    return {
      ...createDefaultIdentifyProgress(),
      ...parsed,
    };
  } catch {
    return createDefaultIdentifyProgress();
  }
}

export function saveIdentifyProgress(prog: IdentifyPersistentProgress): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(IDENTIFY_STORAGE_KEY, JSON.stringify(prog));
  } catch {
    // ignore storage quota errors
  }
}

export function ensureSceneProgress(
  prog: IdentifyPersistentProgress,
  sceneId: string
): IdentifySceneProgress {
  if (!prog.scenes[sceneId]) {
    prog.scenes[sceneId] = {
      sceneId,
      targets: {},
    };
  }
  return prog.scenes[sceneId];
}

export function recordIdentifyAttempt(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene,
  target: IdentifyHotspot,
  quizMode: IdentifyQuizMode,
  isCorrect: boolean,
  userAnswer: string,
  feedback: string
): IdentifyTargetProgress {
  if (!isApprovedVerifiedLearnerTarget(target)) {
    return {
      status: 'unanswered',
      attempts: 0,
      correctMC: 0,
      correctTyped: 0,
      incorrectAttempts: 0,
      revealed: false,
      lastFeedback: 'Unverified object cannot be scored in learner practice.',
    };
  }

  const sp = ensureSceneProgress(prog, scene.id);
  ensureActiveIdentifyRound(prog, scene);
  const existing: IdentifyTargetProgress = sp.targets[target.id] || {
    status: 'unanswered',
    attempts: 0,
    correctMC: 0,
    correctTyped: 0,
    incorrectAttempts: 0,
    revealed: false,
  };

  existing.attempts += 1;
  existing.lastUserAnswer = userAnswer;
  existing.lastFeedback = feedback;

  if (isCorrect) {
    if (quizMode === 'mc') {
      existing.correctMC += 1;
      if (!existing.revealed) {
        existing.status = 'correct-mc';
      }
    } else {
      existing.correctTyped += 1;
      if (!existing.revealed) {
        existing.status = 'correct-fill';
      }
    }
  } else {
    existing.incorrectAttempts += 1;
    if (existing.status === 'unanswered') {
      existing.status = 'incorrect';
    }
    if (!prog.wordsNeedingPractice.includes(target.vocabularyId)) {
      prog.wordsNeedingPractice.push(target.vocabularyId);
    }
  }

  sp.targets[target.id] = existing;

  // Update active round progress if this target belongs to the active round
  if (sp.activeRound && sp.activeRound.targetIds.includes(target.id)) {
    const ar = sp.activeRound;
    if (isCorrect) {
      if (!ar.completedInRoundTargetIds.includes(target.id)) {
        ar.completedInRoundTargetIds.push(target.id);
      }
      if (
        !ar.incorrectOrRevealedInRoundTargetIds.includes(target.id) &&
        !ar.correctInRoundTargetIds.includes(target.id)
      ) {
        ar.correctInRoundTargetIds.push(target.id);
      }
    } else {
      if (!ar.incorrectOrRevealedInRoundTargetIds.includes(target.id)) {
        ar.incorrectOrRevealedInRoundTargetIds.push(target.id);
      }
    }
  }

  return existing;
}

export function recordIdentifyShowAnswer(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene,
  target: IdentifyHotspot
): IdentifyTargetProgress {
  if (!isApprovedVerifiedLearnerTarget(target)) {
    return {
      status: 'unanswered',
      attempts: 0,
      correctMC: 0,
      correctTyped: 0,
      incorrectAttempts: 0,
      revealed: false,
      lastFeedback: 'Unverified object cannot be revealed in learner practice.',
    };
  }

  const sp = ensureSceneProgress(prog, scene.id);
  ensureActiveIdentifyRound(prog, scene);
  const existing: IdentifyTargetProgress = sp.targets[target.id] || {
    status: 'unanswered',
    attempts: 0,
    correctMC: 0,
    correctTyped: 0,
    incorrectAttempts: 0,
    revealed: false,
  };

  existing.revealed = true;
  existing.status = 'revealed';
  existing.lastFeedback = `👁️ Answer revealed: "${target.uk}" (${target.en}). Marked for extra practice.`;

  if (!prog.wordsNeedingPractice.includes(target.vocabularyId)) {
    prog.wordsNeedingPractice.push(target.vocabularyId);
  }

  sp.targets[target.id] = existing;

  if (sp.activeRound && sp.activeRound.targetIds.includes(target.id)) {
    const ar = sp.activeRound;
    if (!ar.completedInRoundTargetIds.includes(target.id)) {
      ar.completedInRoundTargetIds.push(target.id);
    }
    if (!ar.incorrectOrRevealedInRoundTargetIds.includes(target.id)) {
      ar.incorrectOrRevealedInRoundTargetIds.push(target.id);
    }
  }

  return existing;
}

export function recordIdentifyExploreInspection(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene,
  target: IdentifyHotspot
): void {
  if (!isApprovedVerifiedLearnerTarget(target)) {
    return;
  }
  const sp = ensureSceneProgress(prog, scene.id);
  if (!sp.exploredTargetIds) {
    sp.exploredTargetIds = [];
  }
  if (!sp.exploredTargetIds.includes(target.id)) {
    sp.exploredTargetIds.push(target.id);
  }
}

const masterPriorityMap = new Map<string, string>();
for (const m of IDENTIFY_MASTER_2000_NOUNS) {
  masterPriorityMap.set(m.vocabularyId, m.priorityTier);
  masterPriorityMap.set(m.conceptId, m.priorityTier);
}

/**
 * Intelligent adaptive question selection for a 5-, 8-, or 10-question practice round.
 * FAIL-CLOSED SAFETY RULE: Only selects genuinely visually verified targets (`getApprovedLearnerTargets`).
 * If fewer verified targets exist than `roundLength`, returns only the verified targets.
 * If 0 verified targets exist, returns `[]`.
 */
export function selectAdaptiveIdentifyRoundTargets(
  scene: IdentifyScene,
  prog: IdentifyPersistentProgress,
  roundLength: IdentifyRoundLength = prog.roundLength || 8,
  options?: {
    mistakeReviewOnly?: boolean;
    dueVocabularyIds?: string[];
    roundIndexOverride?: number;
  }
): IdentifyHotspot[] {
  const sp = ensureSceneProgress(prog, scene.id);
  const allTargets = getApprovedLearnerTargets(scene);
  if (allTargets.length === 0) return [];

  const desiredCount = Math.min(allTargets.length, roundLength);
  const dueSet = new Set(options?.dueVocabularyIds || []);
  const roundIdx = options?.roundIndexOverride ?? (sp.roundsCompleted || 0);

  // Rotate starting offset by roundIdx so consecutive rounds naturally cover all verified objects
  const rotatedTargets: IdentifyHotspot[] = [];
  const shift = (roundIdx * desiredCount) % allTargets.length;
  for (let i = 0; i < allTargets.length; i++) {
    rotatedTargets.push(allTargets[(i + shift) % allTargets.length]);
  }

  const scoreTarget = (t: IdentifyHotspot): number => {
    const tp = sp.targets[t.id];
    const isMissedOrRevealed =
      tp?.status === 'incorrect' ||
      tp?.status === 'revealed' ||
      (tp?.incorrectAttempts || 0) > 0 ||
      prog.wordsNeedingPractice.includes(t.vocabularyId);

    const isUnseen = !tp || tp.status === 'unanswered';
    const isDue = dueSet.has(t.vocabularyId) || dueSet.has(t.uk);
    const tier =
      masterPriorityMap.get(t.conceptId || '') ||
      masterPriorityMap.get(t.vocabularyId) ||
      'foundational';
    const tierBonus = tier === 'foundational' ? 30 : tier === 'intermediate' ? 15 : 0;

    if (options?.mistakeReviewOnly) {
      return isMissedOrRevealed ? 1000 + tierBonus : isUnseen ? 200 + tierBonus : tierBonus;
    }

    if (isMissedOrRevealed) return 400 + tierBonus;
    if (isUnseen) return 300 + tierBonus;
    if (isDue) return 200 + tierBonus;
    return 50 + tierBonus;
  };

  const scored = rotatedTargets.map((target, rotationOrder) => ({
    target,
    score: scoreTarget(target),
    rotationOrder,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.rotationOrder - b.rotationOrder;
  });

  const selected = scored.slice(0, desiredCount).map((s) => s.target);
  // Sort selected in ascending targetNumber order so guided navigation feels natural
  selected.sort((a, b) => a.targetNumber - b.targetNumber);
  return selected;
}

/**
 * Starts or resets an adaptive practice round of 5, 8, or 10 questions on a scene.
 * Safely shortens the round if fewer verified targets exist than `roundLength`,
 * and marks the round empty if 0 verified targets exist.
 */
export function startIdentifyPracticeRound(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene,
  options?: {
    roundLength?: IdentifyRoundLength;
    mistakeReviewOnly?: boolean;
    dueVocabularyIds?: string[];
    advanceRoundCounter?: boolean;
  }
): IdentifyActiveRoundState {
  const sp = ensureSceneProgress(prog, scene.id);
  const roundLength: IdentifyRoundLength = options?.roundLength || prog.roundLength || 8;
  prog.roundLength = roundLength;

  if (options?.advanceRoundCounter) {
    sp.roundsCompleted = (sp.roundsCompleted || 0) + 1;
  }
  const roundNumber = (sp.roundsCompleted || 0) + 1;

  const verifiedTargets = getApprovedLearnerTargets(scene);
  const selectedTargets = selectAdaptiveIdentifyRoundTargets(scene, prog, roundLength, {
    mistakeReviewOnly: options?.mistakeReviewOnly,
    dueVocabularyIds: options?.dueVocabularyIds,
    roundIndexOverride: sp.roundsCompleted || 0,
  });

  const shortenedDueToVerifiedLimit =
    verifiedTargets.length > 0 && verifiedTargets.length < roundLength;
  const shortenedExplanationEn =
    verifiedTargets.length === 0
      ? 'This scene currently has 0 visually verified objects and is unavailable for student practice until AI image generation and human hotspot verification are completed.'
      : shortenedDueToVerifiedLimit
      ? `This scene currently has ${verifiedTargets.length} visually verified objects, so your ${roundLength}-question round has been safely adjusted to ${verifiedTargets.length} verified questions.`
      : undefined;

  const initialUnseenTargetIds = selectedTargets
    .filter((t) => {
      const tp = sp.targets[t.id];
      return !tp || tp.status === 'unanswered';
    })
    .map((t) => t.id);

  const completedInRoundTargetIds: string[] = [];
  const correctInRoundTargetIds: string[] = [];
  const incorrectOrRevealedInRoundTargetIds: string[] = [];

  for (const t of selectedTargets) {
    const tp = sp.targets[t.id];
    if (tp && (options?.advanceRoundCounter || options?.mistakeReviewOnly)) {
      if (tp.status === 'revealed' || tp.status === 'incorrect') {
        tp.status = 'unanswered';
        tp.revealed = false;
      }
    }
  }

  const activeRound: IdentifyActiveRoundState = {
    roundId: `${scene.id}-r${roundNumber}-len${roundLength}`,
    sceneId: scene.id,
    roundNumber,
    roundLength,
    requestedRoundLength: roundLength,
    shortenedDueToVerifiedLimit,
    shortenedExplanationEn,
    targetIds: selectedTargets.map((t) => t.id),
    initialUnseenTargetIds,
    completedInRoundTargetIds,
    correctInRoundTargetIds,
    incorrectOrRevealedInRoundTargetIds,
    isMistakeReviewRound: Boolean(options?.mistakeReviewOnly),
    xpAwarded: false,
  };

  sp.activeRound = activeRound;
  return activeRound;
}

export function ensureActiveIdentifyRound(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene
): IdentifyActiveRoundState {
  const sp = ensureSceneProgress(prog, scene.id);
  const desiredLen: IdentifyRoundLength = prog.roundLength || 8;
  const approvedTargets = getApprovedLearnerTargets(scene);
  const validIds = new Set(approvedTargets.map((t) => t.id));

  if (
    sp.activeRound &&
    sp.activeRound.sceneId === scene.id &&
    sp.activeRound.roundLength === desiredLen &&
    ((approvedTargets.length === 0 && sp.activeRound.targetIds.length === 0) ||
      (sp.activeRound.targetIds.length > 0 &&
        sp.activeRound.targetIds.every((id) => validIds.has(id))))
  ) {
    return sp.activeRound;
  }

  return startIdentifyPracticeRound(prog, scene, { roundLength: desiredLen });
}

export interface IdentifyRoundSummary {
  roundId: string;
  roundNumber: number;
  roundLength: IdentifyRoundLength;
  requestedRoundLength?: IdentifyRoundLength;
  shortenedDueToVerifiedLimit?: boolean;
  shortenedExplanationEn?: string;
  totalQuestionsInRound: number;
  questionsAttemptedInRound: number;
  questionsCompletedInRound: number;
  correctCountInRound: number;
  incorrectOrRevealedCountInRound: number;
  accuracyPercent: number;
  isRoundComplete: boolean;
  newlyIntroducedWords: IdentifyHotspot[];
  previouslyStudiedWords: IdentifyHotspot[];
  wordsNeedingReview: IdentifyHotspot[];
  sceneTotalObjects: number;
  scenePracticedObjectsCount: number;
  sceneMasteredObjectsCount: number;
  sceneCoveragePercent: number;
  isSceneMastered: boolean;
  xpEarnedThisRound: number;
  xpAlreadyAwarded: boolean;
}

export function computeIdentifyRoundSummary(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene
): IdentifyRoundSummary {
  const sp = ensureSceneProgress(prog, scene.id);
  const ar = ensureActiveIdentifyRound(prog, scene);
  const approvedTargets = getApprovedLearnerTargets(scene);

  const roundTargets = ar.targetIds
    .map((id) => approvedTargets.find((t) => t.id === id))
    .filter((t): t is IdentifyHotspot => Boolean(t));

  let questionsAttemptedInRound = 0;
  let questionsCompletedInRound = 0;
  let correctCountInRound = 0;
  let incorrectOrRevealedCountInRound = 0;
  const newlyIntroducedWords: IdentifyHotspot[] = [];
  const previouslyStudiedWords: IdentifyHotspot[] = [];
  const wordsNeedingReview: IdentifyHotspot[] = [];

  for (const t of roundTargets) {
    const tp = sp.targets[t.id];
    const inCompletedList = ar.completedInRoundTargetIds.includes(t.id);
    const inCorrectList = ar.correctInRoundTargetIds.includes(t.id);
    const inIncorrectList = ar.incorrectOrRevealedInRoundTargetIds.includes(t.id);

    const isResolvedByTargetStatus =
      ar.roundNumber === 1 &&
      (tp?.status === 'correct-mc' || tp?.status === 'correct-fill' || tp?.status === 'revealed');

    if (inCompletedList || inIncorrectList || isResolvedByTargetStatus) {
      questionsAttemptedInRound += 1;
    }

    if (inCompletedList || isResolvedByTargetStatus) {
      questionsCompletedInRound += 1;
      if (
        inCorrectList ||
        ((tp?.status === 'correct-mc' || tp?.status === 'correct-fill') &&
          !inIncorrectList &&
          !tp.revealed)
      ) {
        correctCountInRound += 1;
      } else {
        incorrectOrRevealedCountInRound += 1;
        wordsNeedingReview.push(t);
      }
    } else if (inIncorrectList || tp?.status === 'incorrect') {
      wordsNeedingReview.push(t);
    }

    if (ar.initialUnseenTargetIds.includes(t.id)) {
      newlyIntroducedWords.push(t);
    } else {
      previouslyStudiedWords.push(t);
    }
  }

  const totalQuestionsInRound = roundTargets.length;
  const isRoundComplete =
    totalQuestionsInRound > 0 && questionsCompletedInRound >= totalQuestionsInRound;

  const accuracyPercent =
    questionsCompletedInRound > 0
      ? Math.round((correctCountInRound / questionsCompletedInRound) * 100)
      : 0;

  let scenePracticedObjectsCount = 0;
  let sceneMasteredObjectsCount = 0;
  for (const t of approvedTargets) {
    const tp = sp.targets[t.id];
    if (!tp || tp.status === 'unanswered') continue;
    scenePracticedObjectsCount += 1;
    if (
      (tp.status === 'correct-mc' || tp.status === 'correct-fill') &&
      !tp.revealed
    ) {
      sceneMasteredObjectsCount += 1;
    }
  }

  const sceneTotalObjects = approvedTargets.length;
  const sceneCoveragePercent =
    sceneTotalObjects > 0
      ? Math.round((scenePracticedObjectsCount / sceneTotalObjects) * 100)
      : 0;

  const isSceneMastered =
    sceneTotalObjects > 0 && sceneMasteredObjectsCount >= sceneTotalObjects;

  const awardedRoundIds = sp.awardedRoundIds || [];
  const xpAlreadyAwarded = Boolean(ar.xpAwarded || awardedRoundIds.includes(ar.roundId));
  const xpEarnedThisRound =
    sceneTotalObjects > 0 ? correctCountInRound * 5 + (isRoundComplete ? 15 : 0) : 0;

  return {
    roundId: ar.roundId,
    roundNumber: ar.roundNumber,
    roundLength: ar.roundLength,
    requestedRoundLength: ar.requestedRoundLength ?? ar.roundLength,
    shortenedDueToVerifiedLimit: ar.shortenedDueToVerifiedLimit,
    shortenedExplanationEn: ar.shortenedExplanationEn,
    totalQuestionsInRound,
    questionsAttemptedInRound,
    questionsCompletedInRound,
    correctCountInRound,
    incorrectOrRevealedCountInRound,
    accuracyPercent,
    isRoundComplete,
    newlyIntroducedWords,
    previouslyStudiedWords,
    wordsNeedingReview,
    sceneTotalObjects,
    scenePracticedObjectsCount,
    sceneMasteredObjectsCount,
    sceneCoveragePercent,
    isSceneMastered,
    xpEarnedThisRound,
    xpAlreadyAwarded,
  };
}

/**
 * Idempotently marks a completed round's XP as awarded so re-rendering or
 * clicking round summary actions never duplicates XP.
 */
export function claimIdentifyRoundXpIfEligible(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene
): number {
  const summary = computeIdentifyRoundSummary(prog, scene);
  if (!summary.isRoundComplete || summary.xpAlreadyAwarded || summary.sceneTotalObjects === 0) {
    return 0;
  }
  const sp = ensureSceneProgress(prog, scene.id);
  if (sp.activeRound) {
    sp.activeRound.xpAwarded = true;
  }
  if (!sp.awardedRoundIds) {
    sp.awardedRoundIds = [];
  }
  if (!sp.awardedRoundIds.includes(summary.roundId)) {
    sp.awardedRoundIds.push(summary.roundId);
  }
  saveIdentifyProgress(prog);
  return summary.xpEarnedThisRound;
}

/**
 * Generates a learner-friendly phonetic pronunciation guide for Ukrainian words
 * in Explore Mode (Section 20).
 */
export function transliterateUkToPronunciation(uk: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: 'ʲ',
    ю: 'yu', я: 'ya', '’': '', "'": '',
  };
  let out = '';
  const lower = uk.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    if (ch === '\u0301') {
      out += '́';
    } else if (map[ch] !== undefined) {
      out += map[ch];
    } else {
      out += ch;
    }
  }
  return `[${out}]`;
}

export interface IdentifySceneSummaryMetrics {
  totalTargets: number;
  attemptedCount: number;
  resolvedCount: number; // answered correctly or revealed across the scene
  masteredCount: number; // answered correctly without reveal
  correctMCCount: number;
  correctTypedCount: number;
  incorrectAttemptsTotal: number;
  revealedCount: number;
  isSceneComplete: boolean; // true ONLY when all verified targets in the scene are resolved
  isSceneMastered: boolean; // true ONLY when all verified targets in the scene are mastered
  needsPracticeTargets: IdentifyHotspot[];
  activeRoundSummary: IdentifyRoundSummary;
}

export function computeIdentifySceneSummary(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene
): IdentifySceneSummaryMetrics {
  const sp = prog.scenes[scene.id];
  const approvedTargets = getApprovedLearnerTargets(scene);
  let attemptedCount = 0;
  let resolvedCount = 0;
  let masteredCount = 0;
  let correctMCCount = 0;
  let correctTypedCount = 0;
  let incorrectAttemptsTotal = 0;
  let revealedCount = 0;
  const needsPracticeTargets: IdentifyHotspot[] = [];

  for (const t of approvedTargets) {
    const tp = sp?.targets[t.id];
    if (!tp || tp.status === 'unanswered') continue;
    attemptedCount += 1;
    incorrectAttemptsTotal += tp.incorrectAttempts;

    if (tp.status === 'correct-mc') {
      resolvedCount += 1;
      masteredCount += 1;
      correctMCCount += 1;
    } else if (tp.status === 'correct-fill') {
      resolvedCount += 1;
      masteredCount += 1;
      correctTypedCount += 1;
    } else if (tp.status === 'revealed') {
      resolvedCount += 1;
      revealedCount += 1;
      needsPracticeTargets.push(t);
    } else if (tp.status === 'incorrect') {
      needsPracticeTargets.push(t);
    }

    if (tp.incorrectAttempts > 0 && !needsPracticeTargets.some((x) => x.id === t.id)) {
      needsPracticeTargets.push(t);
    }
  }

  const activeRoundSummary = computeIdentifyRoundSummary(prog, scene);

  return {
    totalTargets: approvedTargets.length,
    attemptedCount,
    resolvedCount,
    masteredCount,
    correctMCCount,
    correctTypedCount,
    incorrectAttemptsTotal,
    revealedCount,
    isSceneComplete: resolvedCount === approvedTargets.length && approvedTargets.length > 0,
    isSceneMastered: masteredCount === approvedTargets.length && approvedTargets.length > 0,
    needsPracticeTargets,
    activeRoundSummary,
  };
}


