import type { CourseModule, CourseQuestion, CoursePracticeDrill } from './courseDataA0A1.ts';
import type { KnowledgeCheckProps, StructuredCourseLesson } from './courseVisualComponents.ts';

export type CourseQuestionFormat =
  | 'multiple-choice'
  | 'fill-blank'
  | 'sentence-completion'
  | 'en-to-uk-translation'
  | 'uk-to-en-translation'
  | 'form-selection'
  | 'word-order'
  | 'sentence-transformation'
  | 'error-correction'
  | 'contextual-application'
  | 'register-distinction'
  | 'multi-step-reasoning';

export interface EnrichedCourseQuestion extends CourseQuestion {
  id: string;
  questionType: CourseQuestionFormat;
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  topic: string;
  inputMode?: 'mc' | 'text' | 'multiple-choice';
  expectedAnswerUk?: string;
  acceptedAnswersUk?: string[];
  acceptedTextAnswers?: string[];
  hintUk?: string;
  audioUk?: string;
  distractorNotes?: string[];
}

export interface EnrichedPracticeDrill extends CoursePracticeDrill {
  id: string;
  prompt: string;
  q: string;
  questionType: CourseQuestionFormat;
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  topic: string;
  inputMode?: 'mc' | 'text' | 'multiple-choice';
  expectedAnswerUk?: string;
  acceptedAnswersUk?: string[];
  acceptedTextAnswers?: string[];
  hintUk?: string;
  distractorNotes?: string[];
}

export interface EnrichedInlineCheck extends KnowledgeCheckProps {
  questionType?: CourseQuestionFormat;
  difficultyTier?: 1 | 2 | 3 | 4 | 5;
  topic?: string;
  inputMode?: 'mc' | 'text' | 'multiple-choice';
  expectedAnswerUk?: string;
  acceptedAnswersUk?: string[];
  acceptedTextAnswers?: string[];
  hintUk?: string;
  distractorNotes?: string[];
}

export interface StageAttemptState {
  selectedOptions: Record<number, number>;
  textAnswers: Record<number, string>;
  submitted: boolean;
  currentIndex: number;
  filterMode: 'all' | 'unanswered' | 'incorrect';
  lastScore?: number;
}

export interface ModuleAssessmentState {
  inlineChecks: StageAttemptState;
  cfu: StageAttemptState;
  practice: StageAttemptState;
  exam: StageAttemptState;
}

export type CourseAssessmentStore = Record<string, ModuleAssessmentState>;

export const COURSE_ASSESSMENT_STORAGE_KEY = 'slovo_ua_course_assessments_v1';

export function createDefaultStageAttemptState(): StageAttemptState {
  return {
    selectedOptions: {},
    textAnswers: {},
    submitted: false,
    currentIndex: 0,
    filterMode: 'all',
  };
}

export function createDefaultModuleAssessmentState(): ModuleAssessmentState {
  return {
    inlineChecks: createDefaultStageAttemptState(),
    cfu: createDefaultStageAttemptState(),
    practice: createDefaultStageAttemptState(),
    exam: createDefaultStageAttemptState(),
  };
}

export function loadCourseAssessmentStore(): CourseAssessmentStore {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(COURSE_ASSESSMENT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as CourseAssessmentStore;
  } catch {
    return {};
  }
}

export function saveCourseAssessmentStore(store: CourseAssessmentStore): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(COURSE_ASSESSMENT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function getModuleAssessmentState(
  store: CourseAssessmentStore,
  modId: string
): ModuleAssessmentState {
  if (!store[modId]) {
    store[modId] = createDefaultModuleAssessmentState();
  }
  const entry = store[modId];
  const normalizeStage = (st?: Partial<StageAttemptState>): StageAttemptState => ({
    selectedOptions: st?.selectedOptions || {},
    textAnswers: st?.textAnswers || {},
    submitted: Boolean(st?.submitted),
    currentIndex: typeof st?.currentIndex === 'number' ? st.currentIndex : 0,
    filterMode: st?.filterMode || 'all',
    lastScore: st?.lastScore,
  });

  store[modId] = {
    inlineChecks: normalizeStage(entry.inlineChecks),
    cfu: normalizeStage(entry.cfu),
    practice: normalizeStage(entry.practice),
    exam: normalizeStage(entry.exam),
  };
  return store[modId];
}

/**
 * Normalizes Ukrainian/English learner text input for deterministic grading:
 * - Normalizes Unicode NFC + strips acute stress marks (\u0301) unless preserveStress is true
 * - Normalizes curly/straight apostrophes (' ’ ʼ `) to standard ’
 * - Collapses extra whitespace and trims surrounding punctuation
 */
export function normalizeConstructedResponse(
  raw: string,
  preserveStress = false
): string {
  let s = String(raw || '').normalize('NFD');
  if (!preserveStress) {
    s = s.replace(/\u0301/g, '');
  }
  s = s
    .normalize('NFC')
    .replace(/['’ʼ`՚]/g, '’')
    .replace(/[«»"“”]/g, '')
    .trim()
    .replace(/[.!?,;:—–-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return s;
}

export function validateCourseConstructedAnswer(
  userInput: string,
  acceptedOrQuestion:
    | string[]
    | {
        opts: string[];
        ans: number;
        expectedAnswerUk?: string;
        acceptedAnswersUk?: string[];
        acceptedTextAnswers?: string[];
      },
  preserveStress = false
): boolean {
  const normUser = normalizeConstructedResponse(userInput, preserveStress);
  if (!normUser) return false;

  const candidates: string[] = Array.isArray(acceptedOrQuestion)
    ? acceptedOrQuestion
    : [
        ...(acceptedOrQuestion.expectedAnswerUk ? [acceptedOrQuestion.expectedAnswerUk] : []),
        ...(acceptedOrQuestion.acceptedAnswersUk || []),
        ...(acceptedOrQuestion.acceptedTextAnswers || []),
        acceptedOrQuestion.opts[acceptedOrQuestion.ans] || '',
      ].filter(Boolean);

  for (const cand of candidates) {
    const normCand = normalizeConstructedResponse(cand, preserveStress);
    const candWithoutParens = normalizeConstructedResponse(
      cand.replace(/\([^)]*\)/g, ''),
      preserveStress
    );
    if (
      normUser === normCand ||
      (candWithoutParens.length > 0 && normUser === candWithoutParens)
    ) {
      return true;
    }
  }
  return false;
}

export function buildDetailedFeedbackHtml(params: {
  isCorrect: boolean;
  chosenIndex?: number;
  selectedIdx?: number;
  correctIndex?: number;
  correctIdx?: number;
  options?: string[];
  opts?: string[];
  distractorNotes?: string[];
  explanation: string;
  audioUk?: string;
  typedText?: string;
}): string {
  const isCorrect = params.isCorrect;
  const opts = params.options || params.opts || [];
  const correctIdx =
    typeof params.correctIndex === 'number'
      ? params.correctIndex
      : typeof params.correctIdx === 'number'
        ? params.correctIdx
        : 0;
  const chosenIdx =
    typeof params.chosenIndex === 'number'
      ? params.chosenIndex
      : typeof params.selectedIdx === 'number'
        ? params.selectedIdx
        : -1;
  const correctOpt = opts[correctIdx] || '';
  const chosenOpt =
    chosenIdx >= 0 && chosenIdx < opts.length ? opts[chosenIdx] : params.typedText || '';

  if (isCorrect) {
    return `
      <div style="margin-bottom:4px; color:var(--success); font-weight:800;">
        ✅ <b>Correct Answer:</b> ${correctOpt}
      </div>
      <div><b>💡 Core Rule & Explanation:</b> ${params.explanation}</div>
    `;
  }

  const specificDistractorReason =
    params.distractorNotes &&
    chosenIdx >= 0 &&
    chosenIdx < params.distractorNotes.length &&
    params.distractorNotes[chosenIdx]
      ? params.distractorNotes[chosenIdx]
      : chosenOpt
        ? `"${chosenOpt}" does not satisfy the Ukrainian phonetic, orthographic, or grammatical requirement in this context.`
        : 'This question was left unanswered.';

  return `
    <div style="margin-bottom:5px; color:var(--danger, #dc2626); font-weight:700;">
      ❌ <b>Why Incorrect:</b> ${specificDistractorReason}
    </div>
    <div style="margin-bottom:5px; color:var(--success); font-weight:800;">
      ✅ <b>Correct Answer:</b> ${correctOpt}
    </div>
    <div><b>💡 Core Rule & Explanation:</b> ${params.explanation}</div>
  `;
}

export interface ExamScoreSummary {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  passThreshold: number;
  passed: boolean;
  isPassed: boolean;
}

export function calculateExamScore(
  examQuestions: CourseQuestion[],
  selections: Record<number, number | { selectedIdx: number; typedText?: string }>
): ExamScoreSummary {
  const totalQuestions = examQuestions.length;
  let answeredCount = 0;
  let correctCount = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const rawSel = selections[i];
    if (rawSel === undefined || rawSel === null) continue;

    const selectedIdx =
      typeof rawSel === 'number' ? rawSel : rawSel.selectedIdx;
    const hasSelection = typeof selectedIdx === 'number' && selectedIdx >= 0;
    if (!hasSelection) continue;

    answeredCount++;
    const q = examQuestions[i];
    if (selectedIdx === q.ans) {
      correctCount++;
    }
  }

  const unansweredCount = totalQuestions - answeredCount;
  const incorrectCount = totalQuestions - correctCount;
  const passThreshold = Math.ceil(totalQuestions * 0.8);
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = correctCount >= passThreshold;

  return {
    totalQuestions,
    answeredCount,
    unansweredCount,
    correctCount,
    incorrectCount,
    percentage,
    passThreshold,
    passed,
    isPassed: passed,
  };
}

export interface ModuleAssessmentValidationReport {
  valid: boolean;
  moduleId: string;
  inlineKnowledgeCheckCount: number;
  stage2KnowledgeCheckCount: number;
  practiceCount: number;
  examCount: number;
  uniqueIdPass: boolean;
  answerBoundsPass: boolean;
  explanationsPass: boolean;
  duplicatePrompts: string[];
  questionTypesUsed: string[];
  errors: string[];
}

export function normalizePromptForDedup(prompt: string): string {
  return String(prompt || '')
    .toLowerCase()
    .replace(/\u0301/g, '')
    .replace(/[^a-zа-яґєії0-9]+/gi, ' ')
    .trim();
}

export function validateExpandedModuleAssessments(
  mod: CourseModule
): ModuleAssessmentValidationReport {
  const errors: string[] = [];
  const sl = mod.structuredLesson as StructuredCourseLesson | undefined;
  const inlineChecks = sl?.embeddedChecks || [];
  const cfu = mod.cfu || [];
  const practice = mod.practice || [];
  const exam = mod.exam || [];

  if (inlineChecks.length < 20) {
    errors.push(
      `Module ${mod.id}: structuredLesson.embeddedChecks has ${inlineChecks.length} questions (expected >= 20)`
    );
  }
  if (cfu.length < 20) {
    errors.push(
      `Module ${mod.id}: cfu (Stage 2 Knowledge Check) has ${cfu.length} questions (expected >= 20)`
    );
  }
  if (practice.length !== 50) {
    errors.push(
      `Module ${mod.id}: practice (Stage 3 Practice) has ${practice.length} questions (expected 50)`
    );
  }
  if (exam.length !== 100) {
    errors.push(
      `Module ${mod.id}: exam (Stage 5 Mastery Exam) has ${exam.length} questions (expected 100)`
    );
  }

  const seenIds = new Set<string>();
  const seenPrompts = new Map<string, string>();
  const duplicatePrompts: string[] = [];
  const questionTypesSet = new Set<string>();
  let uniqueIdPass = true;
  let answerBoundsPass = true;
  let explanationsPass = true;

  // 1. Validate Inline Knowledge Checks
  inlineChecks.forEach((kc: any, idx) => {
    const id = kc.id || `inline-${idx}`;
    if (seenIds.has(id)) {
      uniqueIdPass = false;
      errors.push(`Duplicate ID '${id}' in ${mod.id} inlineChecks`);
    }
    seenIds.add(id);

    if (!kc.question || kc.question.trim().length < 8) {
      errors.push(`Empty/short question prompt at ${mod.id} inlineChecks[${idx}]`);
    }
    if (!Array.isArray(kc.options) || kc.options.length < 3) {
      answerBoundsPass = false;
      errors.push(`Invalid options array at ${mod.id} inlineChecks[${idx}]`);
    }
    if (
      typeof kc.correctIndex !== 'number' ||
      kc.correctIndex < 0 ||
      kc.correctIndex >= (kc.options?.length || 0)
    ) {
      answerBoundsPass = false;
      errors.push(`Invalid correctIndex at ${mod.id} inlineChecks[${idx}]`);
    }
    if (!kc.explanation || kc.explanation.trim().length < 15) {
      explanationsPass = false;
      errors.push(`Explanation too short at ${mod.id} inlineChecks[${idx}]`);
    }
    if (kc.questionType) questionTypesSet.add(kc.questionType);

    const norm = normalizePromptForDedup(kc.question);
    if (seenPrompts.has(norm)) {
      duplicatePrompts.push(`inlineChecks[${idx}] duplicates ${seenPrompts.get(norm)}`);
    } else {
      seenPrompts.set(norm, `inlineChecks[${idx}]`);
    }
  });

  // 2. Validate Stage 2 Knowledge Check (cfu)
  cfu.forEach((q: any, idx) => {
    const id = q.id || `cfu-${idx}`;
    if (seenIds.has(id)) {
      uniqueIdPass = false;
      errors.push(`Duplicate ID '${id}' in ${mod.id} cfu`);
    }
    seenIds.add(id);

    if (!q.q || q.q.trim().length < 8) {
      errors.push(`Empty/short question prompt at ${mod.id} cfu[${idx}]`);
    }
    if (!Array.isArray(q.opts) || q.opts.length < 3) {
      answerBoundsPass = false;
      errors.push(`Invalid opts array at ${mod.id} cfu[${idx}]`);
    }
    if (typeof q.ans !== 'number' || q.ans < 0 || q.ans >= (q.opts?.length || 0)) {
      answerBoundsPass = false;
      errors.push(`Invalid ans index at ${mod.id} cfu[${idx}]`);
    }
    if (!q.exp || q.exp.trim().length < 15) {
      explanationsPass = false;
      errors.push(`Explanation too short at ${mod.id} cfu[${idx}]`);
    }
    if (q.questionType) questionTypesSet.add(q.questionType);

    const norm = normalizePromptForDedup(q.q);
    if (seenPrompts.has(norm)) {
      duplicatePrompts.push(`cfu[${idx}] duplicates ${seenPrompts.get(norm)}`);
    } else {
      seenPrompts.set(norm, `cfu[${idx}]`);
    }
  });

  // 3. Validate Stage 3 Practice
  practice.forEach((p: any, idx) => {
    const id = p.id || `prac-${idx}`;
    if (seenIds.has(id)) {
      uniqueIdPass = false;
      errors.push(`Duplicate ID '${id}' in ${mod.id} practice`);
    }
    seenIds.add(id);

    const promptText = p.prompt || p.q || '';
    if (!promptText || promptText.trim().length < 8) {
      errors.push(`Empty/short prompt at ${mod.id} practice[${idx}]`);
    }
    if (!Array.isArray(p.opts) || p.opts.length < 3) {
      answerBoundsPass = false;
      errors.push(`Invalid opts array at ${mod.id} practice[${idx}]`);
    }
    if (typeof p.ans !== 'number' || p.ans < 0 || p.ans >= (p.opts?.length || 0)) {
      answerBoundsPass = false;
      errors.push(`Invalid ans index at ${mod.id} practice[${idx}]`);
    }
    if (!p.audioUk || !/[А-ЯҐЄІЇа-яґєії]/.test(p.audioUk)) {
      errors.push(`Missing Cyrillic audioUk at ${mod.id} practice[${idx}]`);
    }
    if (!p.exp || p.exp.trim().length < 15) {
      explanationsPass = false;
      errors.push(`Explanation too short at ${mod.id} practice[${idx}]`);
    }
    if (p.questionType) questionTypesSet.add(p.questionType);

    const norm = normalizePromptForDedup(promptText);
    if (seenPrompts.has(norm)) {
      duplicatePrompts.push(`practice[${idx}] duplicates ${seenPrompts.get(norm)}`);
    } else {
      seenPrompts.set(norm, `practice[${idx}]`);
    }
  });

  // 4. Validate Stage 5 Exam
  exam.forEach((q: any, idx) => {
    const id = q.id || `exam-${idx}`;
    if (seenIds.has(id)) {
      uniqueIdPass = false;
      errors.push(`Duplicate ID '${id}' in ${mod.id} exam`);
    }
    seenIds.add(id);

    if (!q.q || q.q.trim().length < 8) {
      errors.push(`Empty/short question prompt at ${mod.id} exam[${idx}]`);
    }
    if (!Array.isArray(q.opts) || q.opts.length < 3) {
      answerBoundsPass = false;
      errors.push(`Invalid opts array at ${mod.id} exam[${idx}]`);
    }
    if (typeof q.ans !== 'number' || q.ans < 0 || q.ans >= (q.opts?.length || 0)) {
      answerBoundsPass = false;
      errors.push(`Invalid ans index at ${mod.id} exam[${idx}]`);
    }
    if (!q.exp || q.exp.trim().length < 15) {
      explanationsPass = false;
      errors.push(`Explanation too short at ${mod.id} exam[${idx}]`);
    }
    if (q.questionType) questionTypesSet.add(q.questionType);

    const norm = normalizePromptForDedup(q.q);
    if (seenPrompts.has(norm)) {
      duplicatePrompts.push(`exam[${idx}] duplicates ${seenPrompts.get(norm)}`);
    } else {
      seenPrompts.set(norm, `exam[${idx}]`);
    }
  });

  if (duplicatePrompts.length > 0) {
    errors.push(`Duplicate prompts detected: ${duplicatePrompts.join('; ')}`);
  }

  return {
    valid: errors.length === 0,
    moduleId: mod.id,
    inlineKnowledgeCheckCount: inlineChecks.length,
    stage2KnowledgeCheckCount: cfu.length,
    practiceCount: practice.length,
    examCount: exam.length,
    uniqueIdPass,
    answerBoundsPass,
    explanationsPass,
    duplicatePrompts,
    questionTypesUsed: Array.from(questionTypesSet),
    errors,
  };
}
