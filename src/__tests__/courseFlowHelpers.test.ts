import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_MODULES } from '../courseData';
import { FREQ_6000_DB } from '../vocabData';
import {
  computeCourseMapGroups,
  computeModuleStepStates,
  computeStickyStepActions,
  computeModuleVocabReviewStatus,
  formatPlainLevelTitle,
  LESSON_TOC_SECTIONS,
} from '../courseFlowHelpers';

test('Phase 3 Course Flow Helpers: CEFR-grouped module map groups all 29 modules without hard-locking and highlights recommended next step', () => {
  const summaries = COURSE_MODULES.map((m) => ({
    id: m.id,
    level: m.level,
    title: m.title,
    topicTag: m.topicTag,
    vocabCount: m.vocab.length,
  }));

  const overview = computeCourseMapGroups({
    modules: summaries,
    passedModIds: ['A0.1', 'A0.2'],
    activeModId: 'A0.3',
    onboardingRecommendedModId: 'A0.1',
    levelFilter: 'ALL',
  });

  assert.equal(overview.totalModules, 29);
  assert.equal(overview.completedModules, 2);
  assert.equal(overview.recommendedNextModId, 'A0.3');
  assert.equal(overview.groups.length, 6);
  assert.equal(formatPlainLevelTitle('A0'), 'Level A0 · First steps');
  assert.equal(formatPlainLevelTitle('B2'), 'Level B2 · Upper-Intermediate');

  const flattened = overview.groups.flatMap((g) => g.modules);
  assert.equal(flattened.length, 29);

  const m1 = flattened.find((m) => m.id === 'A0.1')!;
  const m3 = flattened.find((m) => m.id === 'A0.3')!;
  const c1 = flattened.find((m) => m.id === 'C1.1')!;
  assert.equal(m1.status, 'done');
  assert.equal(m3.status, 'current');
  assert.equal(c1.status, 'upcoming');
  assert.equal(c1.statusLabel, 'Available');
});

test('Phase 3 Course Flow Helpers: 5-step progress header marks completed steps with checkmarks accurately', () => {
  const freshSteps = computeModuleStepStates({
    activeStage: 0,
    modulePassed: false,
    lessonCompleted: false,
    inlineAnswered: 0,
    cfuAnswered: 0,
    cfuTotal: 20,
    practiceAnswered: 0,
    practiceTotal: 50,
    vocabTotal: 25,
    vocabInReviewsCount: 0,
    vocabMatchedTotal: 20,
    wordsStepVisited: false,
    examAnswered: 0,
    examTotal: 100,
    examSubmitted: false,
    examScorePct: 0,
  });

  assert.equal(freshSteps.length, 5);
  assert.deepEqual(
    freshSteps.map((s) => s.shortTitle),
    ['Lesson', 'Check', 'Practice', 'Words', 'Exam']
  );
  assert.equal(freshSteps[0].active, true);
  assert.equal(freshSteps.every((s) => !s.done), true);

  const midSteps = computeModuleStepStates({
    activeStage: 1,
    modulePassed: false,
    lessonCompleted: true,
    inlineAnswered: 3,
    cfuAnswered: 20,
    cfuTotal: 20,
    practiceAnswered: 10,
    practiceTotal: 50,
    vocabTotal: 25,
    vocabInReviewsCount: 20,
    vocabMatchedTotal: 20,
    wordsStepVisited: true,
    examAnswered: 0,
    examTotal: 100,
    examSubmitted: false,
    examScorePct: 0,
  });
  assert.equal(midSteps[0].done, true);
  assert.equal(midSteps[1].done, true);
  assert.equal(midSteps[2].done, false);
  assert.equal(midSteps[3].done, true);
  assert.equal(midSteps[4].done, false);
});

test('Phase 3 Course Flow Helpers: sticky bottom bar actions provide plain-language Back and Next labels on every step', () => {
  const step0 = computeStickyStepActions({
    activeStage: 0,
    modId: 'A0.1',
    cfuAnswered: 0,
    cfuTotal: 20,
    practiceAnswered: 0,
    practiceTotal: 50,
    vocabTotal: 25,
    vocabInReviewsCount: 0,
    examAnswered: 0,
    examTotal: 100,
    examSubmitted: false,
    examPassed: false,
    examScorePct: 0,
    nextModId: 'A0.2',
  });
  assert.equal(step0.backLabel, '← Module map');
  assert.equal(step0.primaryLabel, 'Next: Check your understanding →');

  const passedExam = computeStickyStepActions({
    activeStage: 4,
    modId: 'A0.1',
    cfuAnswered: 20,
    cfuTotal: 20,
    practiceAnswered: 50,
    practiceTotal: 50,
    vocabTotal: 25,
    vocabInReviewsCount: 20,
    examAnswered: 100,
    examTotal: 100,
    examSubmitted: true,
    examPassed: true,
    examScorePct: 88,
    nextModId: 'A0.2',
  });
  assert.equal(passedExam.primaryAction, 'next-module');
  assert.equal(passedExam.primaryLabel, 'Start next module: A0.2 →');
});

test('Phase 3 Course Flow Helpers: Words step generates plain-language review button copy and tracks matched words', () => {
  const a01Words = COURSE_MODULES[0].vocab.map(([uk]) => uk);
  const emptyDeck = new Set<number>();
  const initialStatus = computeModuleVocabReviewStatus(
    a01Words,
    FREQ_6000_DB,
    emptyDeck
  );
  assert.equal(
    initialStatus.buttonLabel,
    `Add these ${a01Words.length} words to my reviews`
  );
  assert.equal(initialStatus.allAdded, false);
  assert.ok(initialStatus.matchedRanks.length > 0);

  const fullDeck = new Set<number>(initialStatus.matchedRanks);
  const doneStatus = computeModuleVocabReviewStatus(
    a01Words,
    FREQ_6000_DB,
    fullDeck
  );
  assert.equal(doneStatus.allAdded, true);
  assert.match(doneStatus.buttonLabel, /^✓ All \d+ words in your reviews$/);

  assert.equal(LESSON_TOC_SECTIONS.length, 12);
  assert.equal(
    LESSON_TOC_SECTIONS.find((s) => s.id === 'sec-exceptions')?.isExpandable,
    true
  );
  assert.equal(
    LESSON_TOC_SECTIONS.find((s) => s.id === 'sec-reference')?.isExpandable,
    true
  );
});
