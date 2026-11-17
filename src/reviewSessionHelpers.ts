export type ReviewModeId = 'mixed' | 'srs' | 'en2uk' | 'correction' | 'topics';

export type TopicDrillSubMode =
  | 'all'
  | 'fillblank'
  | 'context'
  | 'grammar'
  | 'sentence'
  | 'listening';

export interface ReviewPrefsV1 {
  version: 1;
  preferredMode: ReviewModeId;
  topicSubMode: TopicDrillSubMode;
  topicCategoryId: string;
  autoPlayAudio: boolean;
  focusDimChrome: boolean;
  dateKey: string;
  newCardsIntroducedToday: number;
  bonusNewAllowanceToday: number;
}

export interface MinimalFSRSCard {
  rank: number;
  state: 'new' | 'learning' | 'review';
  interval: number;
  ease: number;
  due: number;
}

export interface GradeButtonSpec {
  grade: 1 | 2 | 3 | 4;
  label: string;
  intervalText: string;
  hint: string;
  shortcut: '1' | '2' | '3' | '4';
  toneClass: 'anki-again' | 'anki-hard' | 'anki-good' | 'anki-easy';
}

export interface DeckQueueSelection<T extends MinimalFSRSCard> {
  queue: T[];
  dueCount: number;
  learningCount: number;
  reviewCount: number;
  totalNewInDeck: number;
  pacedNewCount: number;
}

export interface MixedQueueEntry<T extends MinimalFSRSCard> {
  deck: 'srs' | 'en2uk' | 'correction';
  card: T;
}

export interface MixedQueueSelection<T extends MinimalFSRSCard> {
  items: Array<MixedQueueEntry<T>>;
  dueCount: number;
  pacedNewCount: number;
}

export interface ReviewSessionTracker {
  startedAtMs: number;
  cardsReviewed: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  newCardsLearned: number;
  xpEarned: number;
  completed: boolean;
  initialTargetCount: number;
}

export interface ReviewSessionSummaryMetrics {
  totalReviewed: number;
  retainedCount: number;
  retentionPct: number;
  xpEarned: number;
  newCardsLearned: number;
  minutesAdded: number;
  headline: string;
  subheadline: string;
}

export const REVIEW_MODE_META: ReadonlyArray<{
  id: ReviewModeId;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'mixed',
    label: 'Mixed (recommended)',
    shortLabel: 'Mixed',
    description:
      'Balances Ukrainian recognition, English-to-Ukrainian recall, and sentence endings in one calm session.',
  },
  {
    id: 'srs',
    label: 'UK→EN',
    shortLabel: 'UK→EN',
    description:
      'See and hear the Ukrainian word first, then recall its English meaning.',
  },
  {
    id: 'en2uk',
    label: 'EN→UK',
    shortLabel: 'EN→UK',
    description:
      'Produce the Ukrainian word from English, with optional spelling check.',
  },
  {
    id: 'correction',
    label: 'Sentences',
    shortLabel: 'Sentences',
    description:
      'Spot and repair Ukrainian case endings and verb forms inside full sentences.',
  },
  {
    id: 'topics',
    label: 'Topic drills',
    shortLabel: 'Topics',
    description:
      'Practice fill-in-the-blank, listening, context choice, and sentence building by everyday topic.',
  },
];

export const TOPIC_DRILL_SUBMODES: ReadonlyArray<{
  id: TopicDrillSubMode;
  label: string;
}> = [
  { id: 'all', label: 'Mixed topic drills' },
  { id: 'fillblank', label: 'Fill in the blank' },
  { id: 'context', label: 'Context choice' },
  { id: 'grammar', label: 'Word forms' },
  { id: 'listening', label: 'Listening' },
  { id: 'sentence', label: 'Build sentence' },
];

export function getDailyNewCardCap(dailyGoalMinutes: number): number {
  if (dailyGoalMinutes <= 10) return 10;
  if (dailyGoalMinutes >= 30) return 30;
  return 20;
}

export function getRemainingDailyNewAllowance(
  prefs: Pick<
    ReviewPrefsV1,
    'newCardsIntroducedToday' | 'bonusNewAllowanceToday'
  >,
  dailyGoalMinutes: number
): number {
  const cap =
    getDailyNewCardCap(dailyGoalMinutes) +
    Math.max(0, prefs.bonusNewAllowanceToday || 0);
  const used = Math.max(0, prefs.newCardsIntroducedToday || 0);
  return Math.max(0, cap - used);
}

export function formatGradeButtonSpecs(intervals: {
  hard: number;
  good: number;
  easy: number;
}): GradeButtonSpec[] {
  const hardDays = Math.max(1, Math.round(intervals.hard));
  const goodDays = Math.max(1, Math.round(intervals.good));
  const easyDays = Math.max(2, Math.round(intervals.easy));

  return [
    {
      grade: 1,
      label: 'Again · 1m',
      intervalText: '1m',
      hint: 'Review again soon',
      shortcut: '1',
      toneClass: 'anki-again',
    },
    {
      grade: 2,
      label: `Hard · ${hardDays}d`,
      intervalText: `${hardDays}d`,
      hint: 'Took effort',
      shortcut: '2',
      toneClass: 'anki-hard',
    },
    {
      grade: 3,
      label: `Good · ${goodDays}d`,
      intervalText: `${goodDays}d`,
      hint: 'Remembered',
      shortcut: '3',
      toneClass: 'anki-good',
    },
    {
      grade: 4,
      label: `Easy · ${easyDays}d`,
      intervalText: `${easyDays}d`,
      hint: 'Effortless',
      shortcut: '4',
      toneClass: 'anki-easy',
    },
  ];
}

export function selectDeckActionableQueue<T extends MinimalFSRSCard>(
  cards: T[],
  now: number,
  remainingNewAllowance: number
): DeckQueueSelection<T> {
  const learningDue = cards
    .filter((c) => c.state === 'learning' && c.due <= now)
    .sort((a, b) => a.due - b.due);
  const reviewDue = cards
    .filter((c) => c.state === 'review' && c.due <= now)
    .sort((a, b) => a.due - b.due);
  const newAll = cards.filter((c) => c.state === 'new');
  const safeAllowance = Math.max(0, remainingNewAllowance);
  const pacedNew = newAll.slice(0, safeAllowance);

  const learningSoon = cards
    .filter(
      (c) => c.state === 'learning' && c.due > now && c.due <= now + 300_000
    )
    .sort((a, b) => a.due - b.due);

  const primaryQueue = [...learningDue, ...reviewDue, ...pacedNew];
  const queue = primaryQueue.length > 0 ? primaryQueue : learningSoon;

  return {
    queue,
    dueCount: learningDue.length + reviewDue.length,
    learningCount: learningDue.length + learningSoon.length,
    reviewCount: reviewDue.length,
    totalNewInDeck: newAll.length,
    pacedNewCount: pacedNew.length,
  };
}

export function buildMixedActionableQueue<T extends MinimalFSRSCard>(
  decks: {
    srs: T[];
    en2uk: T[];
    correction: T[];
  },
  now: number,
  remainingNewAllowance: number
): MixedQueueSelection<T> {
  const srsLearnDue = decks.srs
    .filter((c) => c.state === 'learning' && c.due <= now)
    .map((card) => ({ deck: 'srs' as const, card }));
  const en2ukLearnDue = decks.en2uk
    .filter((c) => c.state === 'learning' && c.due <= now)
    .map((card) => ({ deck: 'en2uk' as const, card }));
  const corrLearnDue = decks.correction
    .filter((c) => c.state === 'learning' && c.due <= now)
    .map((card) => ({ deck: 'correction' as const, card }));

  const learningDueAll = [...srsLearnDue, ...en2ukLearnDue, ...corrLearnDue].sort(
    (a, b) => a.card.due - b.card.due
  );

  const srsRevDue = decks.srs
    .filter((c) => c.state === 'review' && c.due <= now)
    .sort((a, b) => a.due - b.due);
  const en2ukRevDue = decks.en2uk
    .filter((c) => c.state === 'review' && c.due <= now)
    .sort((a, b) => a.due - b.due);
  const corrRevDue = decks.correction
    .filter((c) => c.state === 'review' && c.due <= now)
    .sort((a, b) => a.due - b.due);

  const interleavedReviews: Array<MixedQueueEntry<T>> = [];
  const maxRevLen = Math.max(
    srsRevDue.length,
    en2ukRevDue.length,
    corrRevDue.length
  );
  for (let i = 0; i < maxRevLen; i++) {
    if (i < srsRevDue.length) {
      interleavedReviews.push({ deck: 'srs', card: srsRevDue[i] });
    }
    if (i < en2ukRevDue.length) {
      interleavedReviews.push({ deck: 'en2uk', card: en2ukRevDue[i] });
    }
    if (i < corrRevDue.length) {
      interleavedReviews.push({ deck: 'correction', card: corrRevDue[i] });
    }
  }

  const dueCount = learningDueAll.length + interleavedReviews.length;

  const srsNew = decks.srs.filter((c) => c.state === 'new');
  const en2ukNew = decks.en2uk.filter((c) => c.state === 'new');
  const corrNew = decks.correction.filter((c) => c.state === 'new');

  const cursors = { srs: 0, en2uk: 0, correction: 0 };
  const pattern: Array<'srs' | 'en2uk' | 'correction'> = [
    'srs',
    'en2uk',
    'srs',
    'correction',
  ];
  const pacedNewItems: Array<MixedQueueEntry<T>> = [];
  const targetNew = Math.max(0, remainingNewAllowance);
  // Avoid showing the exact same rank twice in the same new-card batch when possible
  const usedNewRanks = new Set<number>();

  let patternIdx = 0;
  let guard = 0;
  const maxGuard =
    (srsNew.length + en2ukNew.length + corrNew.length) * 3 + 12;

  while (pacedNewItems.length < targetNew && guard < maxGuard) {
    guard += 1;
    const preferredDeck = pattern[patternIdx % pattern.length];
    patternIdx += 1;

    const pool =
      preferredDeck === 'srs'
        ? srsNew
        : preferredDeck === 'en2uk'
          ? en2ukNew
          : corrNew;

    let picked: T | undefined;
    while (cursors[preferredDeck] < pool.length) {
      const candidate = pool[cursors[preferredDeck]];
      cursors[preferredDeck] += 1;
      if (!usedNewRanks.has(candidate.rank)) {
        picked = candidate;
        usedNewRanks.add(candidate.rank);
        break;
      }
    }

    if (picked) {
      pacedNewItems.push({ deck: preferredDeck, card: picked });
      continue;
    }

    // If preferred deck has no distinct rank left, check any other deck with remaining distinct ranks
    let fallbackPicked = false;
    for (const altDeck of ['srs', 'en2uk', 'correction'] as const) {
      const altPool =
        altDeck === 'srs'
          ? srsNew
          : altDeck === 'en2uk'
            ? en2ukNew
            : corrNew;
      while (cursors[altDeck] < altPool.length) {
        const candidate = altPool[cursors[altDeck]];
        cursors[altDeck] += 1;
        if (!usedNewRanks.has(candidate.rank)) {
          pacedNewItems.push({ deck: altDeck, card: candidate });
          usedNewRanks.add(candidate.rank);
          fallbackPicked = true;
          break;
        }
      }
      if (fallbackPicked) break;
    }

    if (!fallbackPicked) {
      break;
    }
  }

  const primaryItems = [
    ...learningDueAll,
    ...interleavedReviews,
    ...pacedNewItems,
  ];

  if (primaryItems.length > 0) {
    return {
      items: primaryItems,
      dueCount,
      pacedNewCount: pacedNewItems.length,
    };
  }

  const learningSoonAll: Array<MixedQueueEntry<T>> = [
    ...decks.srs
      .filter(
        (c) => c.state === 'learning' && c.due > now && c.due <= now + 300_000
      )
      .map((card) => ({ deck: 'srs' as const, card })),
    ...decks.en2uk
      .filter(
        (c) => c.state === 'learning' && c.due > now && c.due <= now + 300_000
      )
      .map((card) => ({ deck: 'en2uk' as const, card })),
    ...decks.correction
      .filter(
        (c) => c.state === 'learning' && c.due > now && c.due <= now + 300_000
      )
      .map((card) => ({ deck: 'correction' as const, card })),
  ].sort((a, b) => a.card.due - b.card.due);

  return {
    items: learningSoonAll,
    dueCount: 0,
    pacedNewCount: 0,
  };
}

export function createFreshSessionTracker(
  initialTargetCount = 0,
  nowMs = Date.now()
): ReviewSessionTracker {
  return {
    startedAtMs: nowMs,
    cardsReviewed: 0,
    againCount: 0,
    hardCount: 0,
    goodCount: 0,
    easyCount: 0,
    newCardsLearned: 0,
    xpEarned: 0,
    completed: false,
    initialTargetCount: Math.max(0, initialTargetCount),
  };
}

export function recordSessionGrade(
  tracker: ReviewSessionTracker,
  grade: 1 | 2 | 3 | 4,
  wasNewCard: boolean,
  xpDelta = 15
): ReviewSessionTracker {
  tracker.cardsReviewed += 1;
  if (grade === 1) tracker.againCount += 1;
  else if (grade === 2) tracker.hardCount += 1;
  else if (grade === 3) tracker.goodCount += 1;
  else tracker.easyCount += 1;

  if (wasNewCard) {
    tracker.newCardsLearned += 1;
  }
  tracker.xpEarned += Math.max(0, xpDelta);
  if (tracker.initialTargetCount < tracker.cardsReviewed) {
    tracker.initialTargetCount = tracker.cardsReviewed;
  }
  return tracker;
}

export function computeSessionSummaryMetrics(
  tracker: ReviewSessionTracker,
  nowMs = Date.now()
): ReviewSessionSummaryMetrics {
  const totalReviewed = Math.max(0, tracker.cardsReviewed);
  const retainedCount = tracker.goodCount + tracker.easyCount;
  const retentionPct =
    totalReviewed > 0 ? Math.round((retainedCount / totalReviewed) * 100) : 100;
  const elapsedMin = Math.max(0, (nowMs - tracker.startedAtMs) / 60_000);
  const minutesAdded =
    totalReviewed > 0
      ? Math.max(1, Math.round(Math.max(totalReviewed * 0.25, elapsedMin)))
      : 0;

  let headline = 'You are all caught up for today';
  let subheadline =
    'Your spaced-repetition reviews are clear. Continue your next course step or read a short story.';

  if (totalReviewed > 0 && retentionPct >= 85) {
    headline = 'Calm, steady recall — session complete';
    subheadline = `You remembered ${retentionPct}% of your cards cleanly and scheduled every word for its ideal next day.`;
  } else if (totalReviewed > 0) {
    headline = 'Good practice — tricky words scheduled closer';
    subheadline =
      'Cards marked Again or Hard will return sooner so they settle naturally without cramming.';
  }

  return {
    totalReviewed,
    retainedCount,
    retentionPct,
    xpEarned: tracker.xpEarned,
    newCardsLearned: tracker.newCardsLearned,
    minutesAdded,
    headline,
    subheadline,
  };
}
