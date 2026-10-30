// ============================================================================
// LangoUA — IDENTIFY QUIZ ENGINE, PROGRESS TRACKER & WORKSPACE RENDERER
// Supports Free Exploration, Guided Practice, Multiple Choice, Fill in Blank,
// Mandatory Show Answer, 7-Case Inspector Link, Audio, and Flashcard Export.
// ============================================================================

import {
  IDENTIFY_CATEGORIES,
  renderIdentifySceneSvgDataUri,
  type IdentifyCategory,
  type IdentifyHotspot,
  type IdentifyScene,
} from './identifyData.ts';

export type IdentifyExplorationMode = 'free' | 'guided';
export type IdentifyQuizMode = 'mc' | 'fill';
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
}

export interface IdentifySceneProgress {
  sceneId: string;
  targets: Record<string, IdentifyTargetProgress>;
  completedAt?: number;
}

export interface IdentifyPersistentProgress {
  version: 1;
  activeCategoryId: string;
  activeSceneId: string;
  explorationMode: IdentifyExplorationMode;
  quizMode: IdentifyQuizMode;
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
    activeSceneId: 'kitchen-scene-1',
    explorationMode: 'free',
    quizMode: 'mc',
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
  const sp = ensureSceneProgress(prog, scene.id);
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
      // Only upgrade to correct-mc if it wasn't previously revealed
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
  return existing;
}

export function recordIdentifyShowAnswer(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene,
  target: IdentifyHotspot
): IdentifyTargetProgress {
  const sp = ensureSceneProgress(prog, scene.id);
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
  return existing;
}

export interface IdentifySceneSummaryMetrics {
  totalTargets: number;
  attemptedCount: number;
  resolvedCount: number; // answered correctly or revealed
  correctMCCount: number;
  correctTypedCount: number;
  incorrectAttemptsTotal: number;
  revealedCount: number;
  isSceneComplete: boolean;
  needsPracticeTargets: IdentifyHotspot[];
}

export function computeIdentifySceneSummary(
  prog: IdentifyPersistentProgress,
  scene: IdentifyScene
): IdentifySceneSummaryMetrics {
  const sp = prog.scenes[scene.id];
  let attemptedCount = 0;
  let resolvedCount = 0;
  let correctMCCount = 0;
  let correctTypedCount = 0;
  let incorrectAttemptsTotal = 0;
  let revealedCount = 0;
  const needsPracticeTargets: IdentifyHotspot[] = [];

  for (const t of scene.targets) {
    const tp = sp?.targets[t.id];
    if (!tp || tp.status === 'unanswered') continue;
    attemptedCount += 1;
    incorrectAttemptsTotal += tp.incorrectAttempts;

    if (tp.status === 'correct-mc') {
      resolvedCount += 1;
      correctMCCount += 1;
    } else if (tp.status === 'correct-fill') {
      resolvedCount += 1;
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

  return {
    totalTargets: scene.targets.length,
    attemptedCount,
    resolvedCount,
    correctMCCount,
    correctTypedCount,
    incorrectAttemptsTotal,
    revealedCount,
    isSceneComplete: resolvedCount === scene.targets.length && scene.targets.length > 0,
    needsPracticeTargets,
  };
}
