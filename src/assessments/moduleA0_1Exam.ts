import type { CourseModule } from '../courseDataA0A1.ts';
import type {
  EnrichedCourseQuestion,
  EnrichedInlineCheck,
  EnrichedPracticeDrill,
} from '../courseAssessmentEngine.ts';
import {
  A0_1_INLINE_KNOWLEDGE_CHECK,
  A0_1_STAGE2_KNOWLEDGE_CHECK,
  A0_1_PRACTICE_DRILLS,
} from './moduleA0_1ChecksAndPractice.ts';
import { A0_1_EXAM_PART_1 } from './moduleA0_1ExamPart1.ts';
import { A0_1_EXAM_PART_2 } from './moduleA0_1ExamPart2.ts';
import { buildExpandedAssessmentsForModule } from './curriculumAssessmentBuilder.ts';

/**
 * Deterministic option rotation so correct answer positions (0, 1, 2, 3) are
 * balanced across assessments without any predictable pattern, while keeping
 * distractorNotes aligned with their corresponding option.
 */
function rotateOptions<
  T extends {
    opts?: string[];
    options?: string[];
    ans?: number;
    correctIndex?: number;
    distractorNotes?: string[];
  }
>(item: T, targetAnsIndex: number): T {
  const opts = item.opts ? [...item.opts] : item.options ? [...item.options] : [];
  const currentAns =
    typeof item.ans === 'number'
      ? item.ans
      : typeof item.correctIndex === 'number'
        ? item.correctIndex
        : 0;

  if (opts.length < 2) return item;
  const normalizedTarget = ((targetAnsIndex % opts.length) + opts.length) % opts.length;
  if (normalizedTarget === currentAns) return item;

  const notes =
    item.distractorNotes && item.distractorNotes.length === opts.length
      ? [...item.distractorNotes]
      : undefined;

  // Swap currentAns and normalizedTarget deterministically
  const tmpOpt = opts[currentAns];
  opts[currentAns] = opts[normalizedTarget];
  opts[normalizedTarget] = tmpOpt;

  if (notes) {
    const tmpNote = notes[currentAns];
    notes[currentAns] = notes[normalizedTarget];
    notes[normalizedTarget] = tmpNote;
  }

  const copy = { ...item };
  if (copy.opts) copy.opts = opts;
  if (copy.options) copy.options = opts;
  if (typeof copy.ans === 'number') copy.ans = normalizedTarget;
  if (typeof copy.correctIndex === 'number') copy.correctIndex = normalizedTarget;
  if (notes) copy.distractorNotes = notes;
  return copy;
}

// Non-repeating balanced sequence of answer indices (0, 1, 2, 3)
const ANSWER_PATTERN_20 = [
  1, 3, 0, 2, 2, 0, 3, 1, 0, 3,
  2, 1, 3, 0, 1, 2, 0, 2, 1, 3,
];

export const A0_1_BALANCED_INLINE_CHECKS: EnrichedInlineCheck[] =
  A0_1_INLINE_KNOWLEDGE_CHECK.map((item, idx) =>
    rotateOptions(item, ANSWER_PATTERN_20[(idx + 2) % ANSWER_PATTERN_20.length])
  );

export const A0_1_BALANCED_STAGE2_CHECKS: EnrichedCourseQuestion[] =
  A0_1_STAGE2_KNOWLEDGE_CHECK.map((item, idx) =>
    rotateOptions(item, ANSWER_PATTERN_20[idx % ANSWER_PATTERN_20.length])
  );

export const A0_1_BALANCED_PRACTICE: EnrichedPracticeDrill[] =
  A0_1_PRACTICE_DRILLS.map((item, idx) =>
    rotateOptions(item, ANSWER_PATTERN_20[(idx * 3 + 1) % ANSWER_PATTERN_20.length])
  );

export const A0_1_MASTERY_EXAM: EnrichedCourseQuestion[] = [
  ...A0_1_EXAM_PART_1,
  ...A0_1_EXAM_PART_2,
].map((item, idx) =>
  rotateOptions(item, ANSWER_PATTERN_20[(idx * 7 + 3) % ANSWER_PATTERN_20.length])
);

export function applyExpandedAssessmentsToModule(mod: CourseModule): CourseModule {
  if (mod.id === 'A0.1') {
    const updatedLesson = mod.structuredLesson
      ? {
          ...mod.structuredLesson,
          embeddedChecks: A0_1_BALANCED_INLINE_CHECKS,
        }
      : mod.structuredLesson;

    return {
      ...mod,
      cfu: A0_1_BALANCED_STAGE2_CHECKS,
      practice: A0_1_BALANCED_PRACTICE,
      exam: A0_1_MASTERY_EXAM,
      structuredLesson: updatedLesson,
    };
  }
  return buildExpandedAssessmentsForModule(mod);
}
