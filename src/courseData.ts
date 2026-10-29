import {
  COURSE_MODULES_A0_A1,
  type CourseModule,
  type CourseDialogueLine,
  type CourseActiveRecallItem,
  type CourseQuestion,
  type CoursePracticeDrill,
  type CourseVocabTuple,
} from './courseDataA0A1.ts';
import { COURSE_MODULES_A2_C1 } from './courseDataA2C1.ts';
import { normalizeStructuredLesson } from './courseVisualComponents.ts';

export type {
  CourseModule,
  CourseDialogueLine,
  CourseActiveRecallItem,
  CourseQuestion,
  CoursePracticeDrill,
  CourseVocabTuple,
};

const RAW_COURSE_MODULES: CourseModule[] = [
  ...COURSE_MODULES_A0_A1,
  ...COURSE_MODULES_A2_C1,
];

export const COURSE_MODULES: CourseModule[] = RAW_COURSE_MODULES.map(
  (mod, idx, all) => ({
    ...mod,
    structuredLesson: normalizeStructuredLesson(mod, idx, all),
  })
);

