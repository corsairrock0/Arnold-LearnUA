import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDailyNewCardCap,
  getRemainingDailyNewAllowance,
  formatGradeButtonSpecs,
  selectDeckActionableQueue,
  buildMixedActionableQueue,
  createFreshSessionTracker,
  recordSessionGrade,
  computeSessionSummaryMetrics,
  type MinimalFSRSCard,
} from '../reviewSessionHelpers.ts';

const makeCard = (
  rank: number,
  state: 'new' | 'learning' | 'review',
  due: number,
  interval = 0
): MinimalFSRSCard => ({
  rank,
  state,
  interval,
  ease: 2.5,
  due,
});

test('Phase 4 Review Helpers: daily goal caps new cards at 10 / 20 / 30 and tracks remaining allowance', () => {
  assert.equal(getDailyNewCardCap(10), 10);
  assert.equal(getDailyNewCardCap(20), 20);
  assert.equal(getDailyNewCardCap(30), 30);

  assert.equal(
    getRemainingDailyNewAllowance(
      { newCardsIntroducedToday: 6, bonusNewAllowanceToday: 0 },
      20
    ),
    14
  );
  assert.equal(
    getRemainingDailyNewAllowance(
      { newCardsIntroducedToday: 20, bonusNewAllowanceToday: 5 },
      20
    ),
    5
  );
  assert.equal(
    getRemainingDailyNewAllowance(
      { newCardsIntroducedToday: 25, bonusNewAllowanceToday: 0 },
      20
    ),
    0
  );
});

test('Phase 4 Review Helpers: 4 plain-language grading buttons show exact intervals and 1–4 shortcuts', () => {
  const specs = formatGradeButtonSpecs({ hard: 1, good: 2, easy: 5 });
  assert.equal(specs.length, 4);
  assert.equal(specs[0].label, 'Again · 1m');
  assert.equal(specs[0].shortcut, '1');
  assert.equal(specs[1].label, 'Hard · 1d');
  assert.equal(specs[1].shortcut, '2');
  assert.equal(specs[2].label, 'Good · 2d');
  assert.equal(specs[2].shortcut, '3');
  assert.equal(specs[3].label, 'Easy · 5d');
  assert.equal(specs[3].shortcut, '4');
});

test('Phase 4 Review Helpers: deck queue prioritizes due cards, caps new cards by daily goal, and rescues short-interval learning retries', () => {
  const now = 1_700_000_000_000;
  const deck: MinimalFSRSCard[] = [
    makeCard(1, 'new', now),
    makeCard(2, 'new', now),
    makeCard(3, 'new', now),
    makeCard(4, 'review', now - 5_000, 3),
    makeCard(5, 'learning', now - 1_000, 0),
  ];

  const sel = selectDeckActionableQueue(deck, now, 2);
  assert.equal(sel.dueCount, 2);
  assert.equal(sel.pacedNewCount, 2);
  assert.deepEqual(
    sel.queue.map((c) => c.rank),
    [5, 4, 1, 2]
  );

  // When only a 30s Again retry remains, it stays immediately reviewable instead of stranding the learner
  const retryDeck: MinimalFSRSCard[] = [
    makeCard(9, 'learning', now + 30_000, 0),
    makeCard(10, 'new', now),
  ];
  const retrySel = selectDeckActionableQueue(retryDeck, now, 0);
  assert.deepEqual(
    retrySel.queue.map((c) => c.rank),
    [9]
  );
});

test('Phase 4 Review Helpers: mixed queue interleaves UK->EN, EN->UK, and Sentences with distinct new-card ranks', () => {
  const now = 1_700_000_000_000;
  const srs = [1, 2, 3, 4, 5].map((r) => makeCard(r, 'new', now));
  const en2uk = [1, 2, 3, 4, 5].map((r) => makeCard(r, 'new', now));
  const correction = [1, 2, 3, 4, 5].map((r) => makeCard(r, 'new', now));

  const mixed = buildMixedActionableQueue(
    { srs, en2uk, correction },
    now,
    4
  );
  assert.equal(mixed.items.length, 4);
  assert.deepEqual(
    mixed.items.map((x) => x.deck),
    ['srs', 'en2uk', 'srs', 'correction']
  );
  const uniqueRanks = new Set(mixed.items.map((x) => x.card.rank));
  assert.equal(
    uniqueRanks.size,
    4,
    'Expected Mixed queue to avoid repeating the exact same new word rank in one batch'
  );
});

test('Phase 4 Review Helpers: session summary computes retention rate, new cards learned, XP, and calm copy', () => {
  const tracker = createFreshSessionTracker(4, 1_000_000);
  recordSessionGrade(tracker, 3, true, 15);
  recordSessionGrade(tracker, 4, true, 15);
  recordSessionGrade(tracker, 1, false, 15);
  recordSessionGrade(tracker, 3, false, 15);

  const summary = computeSessionSummaryMetrics(tracker, 1_120_000);
  assert.equal(summary.totalReviewed, 4);
  assert.equal(summary.retainedCount, 3);
  assert.equal(summary.retentionPct, 75);
  assert.equal(summary.newCardsLearned, 2);
  assert.equal(summary.xpEarned, 60);
  assert.ok(summary.minutesAdded >= 2);
});
