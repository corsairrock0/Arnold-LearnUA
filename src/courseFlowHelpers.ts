// ============================================================================
// COURSE FLOW HELPERS — PURE STATE & COPY LOGIC FOR LEARN (PHASE 3)
// ============================================================================

export interface CourseModuleSummaryInput {
  id: string;
  level: string;
  title: string;
  topicTag: string;
  vocabCount: number;
}

export type ModuleMapStatus = 'done' | 'current' | 'recommended' | 'upcoming';

export interface CourseMapModuleItem extends CourseModuleSummaryInput {
  index: number;
  cleanTopic: string;
  status: ModuleMapStatus;
  statusLabel: string;
}

export interface CourseLevelGroup {
  levelCode: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  plainTitle: string;
  cefrBadge: string;
  description: string;
  completedCount: number;
  totalCount: number;
  modules: CourseMapModuleItem[];
}

export interface CourseMapOverview {
  totalModules: number;
  completedModules: number;
  percentCompleted: number;
  recommendedNextModId: string;
  groups: CourseLevelGroup[];
}

export const COURSE_LEVEL_METADATA: ReadonlyArray<{
  levelCode: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  plainName: string;
  description: string;
}> = [
  {
    levelCode: 'A0',
    plainName: 'First steps',
    description: 'Read Cyrillic with confidence, hear clear vowels and stress, and exchange everyday greetings.',
  },
  {
    levelCode: 'A1',
    plainName: 'Beginner',
    description: 'Build core sentences, recognize noun gender, use present and past verbs, and express basic cases.',
  },
  {
    levelCode: 'A2',
    plainName: 'Elementary',
    description: 'Use all 7 Ukrainian cases naturally, choose verb aspect pairs, and talk about travel, plans, and daily life.',
  },
  {
    levelCode: 'B1',
    plainName: 'Intermediate',
    description: 'Connect complex ideas, express conditions and opinions, and handle authentic conversations smoothly.',
  },
  {
    levelCode: 'B2',
    plainName: 'Upper-Intermediate',
    description: 'Navigate nuanced register, idioms, professional Ukrainian, and structured arguments.',
  },
  {
    levelCode: 'C1',
    plainName: 'Advanced',
    description: 'Command near-native stylistic range, rhetorical precision, and literary Ukrainian.',
  },
];

export function formatPlainLevelTitle(levelCode: string): string {
  const found = COURSE_LEVEL_METADATA.find((m) => m.levelCode === levelCode);
  return found
    ? `Level ${found.levelCode} · ${found.plainName}`
    : `Level ${levelCode}`;
}

export function extractCleanTopicSubtitle(topicTag: string, fallbackLevel: string): string {
  const raw = String(topicTag || '').trim();
  if (!raw) return formatPlainLevelTitle(fallbackLevel);
  const parts = raw
    .split(/[•·]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return parts.slice(1).join(' · ');
  }
  return raw;
}

export function computeCourseMapGroups(params: {
  modules: CourseModuleSummaryInput[];
  passedModIds: string[];
  activeModId: string;
  onboardingRecommendedModId?: string;
  levelFilter?: string;
}): CourseMapOverview {
  const {
    modules,
    passedModIds,
    activeModId,
    onboardingRecommendedModId,
    levelFilter = 'ALL',
  } = params;

  const passedSet = new Set(passedModIds);
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => passedSet.has(m.id)).length;
  const percentCompleted =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  let recommendedNextModId = modules[0]?.id || 'A0.1';
  if (
    passedSet.size === 0 &&
    onboardingRecommendedModId &&
    modules.some((m) => m.id === onboardingRecommendedModId)
  ) {
    recommendedNextModId = onboardingRecommendedModId;
  } else {
    const firstUnpassed = modules.find((m) => !passedSet.has(m.id));
    recommendedNextModId =
      firstUnpassed?.id || modules[modules.length - 1]?.id || 'A0.1';
  }

  const filterUpper = String(levelFilter || 'ALL').toUpperCase();
  const matchesFilter = (lvl: string): boolean => {
    if (filterUpper === 'ALL') return true;
    if (filterUpper === 'B2-C1') return lvl === 'B2' || lvl === 'C1';
    return lvl === filterUpper;
  };

  const groups: CourseLevelGroup[] = [];
  for (const meta of COURSE_LEVEL_METADATA) {
    if (!matchesFilter(meta.levelCode)) continue;
    const levelMods = modules
      .map((m, index) => ({ m, index }))
      .filter(({ m }) => m.level === meta.levelCode);
    if (levelMods.length === 0) continue;

    const completedInLevel = levelMods.filter(({ m }) =>
      passedSet.has(m.id)
    ).length;

    const mappedItems: CourseMapModuleItem[] = levelMods.map(({ m, index }) => {
      const isDone = passedSet.has(m.id);
      const isCurrent = m.id === activeModId;
      const isRecommended = !isDone && m.id === recommendedNextModId;

      let status: ModuleMapStatus = 'upcoming';
      let statusLabel = 'Available';
      if (isDone) {
        status = 'done';
        statusLabel = isCurrent ? 'Completed · Viewing' : 'Completed';
      } else if (isCurrent && isRecommended) {
        status = 'current';
        statusLabel = 'Studying now · Recommended';
      } else if (isCurrent) {
        status = 'current';
        statusLabel = 'Studying now';
      } else if (isRecommended) {
        status = 'recommended';
        statusLabel = 'Recommended next';
      }

      return {
        ...m,
        index: index + 1,
        cleanTopic: extractCleanTopicSubtitle(m.topicTag, m.level),
        status,
        statusLabel,
      };
    });

    groups.push({
      levelCode: meta.levelCode,
      plainTitle: `Level ${meta.levelCode} · ${meta.plainName}`,
      cefrBadge: `CEFR ${meta.levelCode}`,
      description: meta.description,
      completedCount: completedInLevel,
      totalCount: levelMods.length,
      modules: mappedItems,
    });
  }

  return {
    totalModules,
    completedModules,
    percentCompleted,
    recommendedNextModId,
    groups,
  };
}

export interface ModuleStepDescriptor {
  index: number;
  shortTitle: string;
  metaLabel: string;
  done: boolean;
  active: boolean;
}

export function computeModuleStepStates(params: {
  activeStage: number;
  modulePassed: boolean;
  lessonCompleted: boolean;
  inlineAnswered: number;
  cfuAnswered: number;
  cfuTotal: number;
  practiceAnswered: number;
  practiceTotal: number;
  vocabTotal: number;
  vocabInReviewsCount: number;
  vocabMatchedTotal: number;
  wordsStepVisited: boolean;
  examAnswered: number;
  examTotal: number;
  examSubmitted: boolean;
  examScorePct: number;
}): ModuleStepDescriptor[] {
  const {
    activeStage,
    modulePassed,
    lessonCompleted,
    inlineAnswered,
    cfuAnswered,
    cfuTotal,
    practiceAnswered,
    practiceTotal,
    vocabTotal,
    vocabInReviewsCount,
    vocabMatchedTotal,
    wordsStepVisited,
    examAnswered,
    examTotal,
    examSubmitted,
    examScorePct,
  } = params;

  const lessonDone =
    modulePassed || lessonCompleted || inlineAnswered > 0 || activeStage > 0;
  const checkDone =
    modulePassed || (cfuTotal > 0 && cfuAnswered >= cfuTotal);
  const practiceDone =
    modulePassed || (practiceTotal > 0 && practiceAnswered >= practiceTotal);
  const wordsDone =
    modulePassed ||
    wordsStepVisited ||
    (vocabMatchedTotal > 0 && vocabInReviewsCount >= vocabMatchedTotal);
  const examDone = modulePassed;

  return [
    {
      index: 0,
      shortTitle: 'Lesson',
      metaLabel: lessonDone ? 'Read' : '12 sections',
      done: lessonDone,
      active: activeStage === 0,
    },
    {
      index: 1,
      shortTitle: 'Check',
      metaLabel:
        cfuAnswered > 0 ? `${cfuAnswered}/${cfuTotal}` : `${cfuTotal} items`,
      done: checkDone,
      active: activeStage === 1,
    },
    {
      index: 2,
      shortTitle: 'Practice',
      metaLabel:
        practiceAnswered > 0
          ? `${practiceAnswered}/${practiceTotal}`
          : `${practiceTotal} drills`,
      done: practiceDone,
      active: activeStage === 2,
    },
    {
      index: 3,
      shortTitle: 'Words',
      metaLabel:
        vocabInReviewsCount > 0
          ? `${vocabInReviewsCount}/${vocabTotal} saved`
          : `${vocabTotal} words`,
      done: wordsDone,
      active: activeStage === 3,
    },
    {
      index: 4,
      shortTitle: 'Exam',
      metaLabel: modulePassed
        ? examSubmitted
          ? `${examScorePct}% · Passed`
          : 'Passed'
        : examSubmitted
          ? `${examScorePct}%`
          : examAnswered > 0
            ? `${examAnswered}/${examTotal}`
            : `${examTotal} items`,
      done: examDone,
      active: activeStage === 4,
    },
  ];
}

export type StickyBackAction = 'open-map' | 'prev-stage';
export type StickyPrimaryAction =
  | 'next-stage'
  | 'submit-exam'
  | 'retake-exam'
  | 'next-module'
  | 'go-today';

export interface StickyStepActionConfig {
  backLabel: string;
  backAction: StickyBackAction;
  statusText: string;
  primaryLabel: string;
  primaryAction: StickyPrimaryAction;
}

export function computeStickyStepActions(params: {
  activeStage: number;
  modId: string;
  cfuAnswered: number;
  cfuTotal: number;
  practiceAnswered: number;
  practiceTotal: number;
  vocabTotal: number;
  vocabInReviewsCount: number;
  examAnswered: number;
  examTotal: number;
  examSubmitted: boolean;
  examPassed: boolean;
  examScorePct: number;
  nextModId?: string | null;
}): StickyStepActionConfig {
  const {
    activeStage,
    modId,
    cfuAnswered,
    cfuTotal,
    practiceAnswered,
    practiceTotal,
    vocabTotal,
    vocabInReviewsCount,
    examAnswered,
    examTotal,
    examSubmitted,
    examPassed,
    examScorePct,
    nextModId,
  } = params;

  if (activeStage === 0) {
    return {
      backLabel: '← Module map',
      backAction: 'open-map',
      statusText: `Step 1 of 5 · ${modId} Lesson`,
      primaryLabel: 'Next: Check your understanding →',
      primaryAction: 'next-stage',
    };
  }

  if (activeStage === 1) {
    return {
      backLabel: '← Back: Lesson',
      backAction: 'prev-stage',
      statusText: `Step 2 of 5 · ${cfuAnswered} of ${cfuTotal} checked`,
      primaryLabel: 'Next: Practice drills →',
      primaryAction: 'next-stage',
    };
  }

  if (activeStage === 2) {
    return {
      backLabel: '← Back: Check',
      backAction: 'prev-stage',
      statusText: `Step 3 of 5 · ${practiceAnswered} of ${practiceTotal} practiced`,
      primaryLabel: 'Next: Module words →',
      primaryAction: 'next-stage',
    };
  }

  if (activeStage === 3) {
    return {
      backLabel: '← Back: Practice',
      backAction: 'prev-stage',
      statusText: `Step 4 of 5 · ${vocabInReviewsCount} of ${vocabTotal} words in reviews`,
      primaryLabel: 'Next: Module exam →',
      primaryAction: 'next-stage',
    };
  }

  if (!examSubmitted) {
    return {
      backLabel: '← Back: Words',
      backAction: 'prev-stage',
      statusText: `Step 5 of 5 · ${examAnswered} of ${examTotal} answered (80% to complete)`,
      primaryLabel: `Finish & grade exam (${examAnswered}/${examTotal}) →`,
      primaryAction: 'submit-exam',
    };
  }

  if (examPassed) {
    if (nextModId) {
      return {
        backLabel: '← Back: Words',
        backAction: 'prev-stage',
        statusText: `Module ${modId} complete · Score ${examScorePct}%`,
        primaryLabel: `Start next module: ${nextModId} →`,
        primaryAction: 'next-module',
      };
    }
    return {
      backLabel: '← Module map',
      backAction: 'open-map',
      statusText: `Course complete · Score ${examScorePct}%`,
      primaryLabel: 'Return to Today →',
      primaryAction: 'go-today',
    };
  }

  return {
    backLabel: '← Back: Words',
    backAction: 'prev-stage',
    statusText: `Scored ${examScorePct}% · 80% needed to complete ${modId}`,
    primaryLabel: 'Try exam again',
    primaryAction: 'retake-exam',
  };
}

export interface ModuleVocabReviewStatus {
  totalModuleWords: number;
  matchedRanks: number[];
  inDeckRanks: number[];
  missingRanks: number[];
  allAdded: boolean;
  buttonLabel: string;
}

export function normalizeUkHeadwordForMatch(rawUk: string): {
  cleanTarget: string;
  lemmaTarget: string;
} {
  const cleanTarget = String(rawUk || '')
    .replace(/\u0301/g, '')
    .toLowerCase()
    .trim();
  const lemmaTarget = cleanTarget
    .replace(/\s*\(.*?\)/g, '')
    .split(/\s*[\/,]\s*/)[0]
    .trim();
  return { cleanTarget, lemmaTarget };
}

export function computeModuleVocabReviewStatus(
  modVocabHeadwords: string[],
  freqLexicon: ReadonlyArray<{ rank: number; ru: string }>,
  existingDeckRanks: ReadonlySet<number>
): ModuleVocabReviewStatus {
  const totalModuleWords = modVocabHeadwords.length;
  const matchedRanksSet = new Set<number>();

  for (const uk of modVocabHeadwords) {
    const { cleanTarget, lemmaTarget } = normalizeUkHeadwordForMatch(uk);
    if (!cleanTarget) continue;
    const exact = freqLexicon.find(
      (w) =>
        w.ru.replace(/\u0301/g, '').toLowerCase().trim() === cleanTarget
    );
    const matched =
      exact ||
      freqLexicon.find((w) => {
        const { cleanTarget: wClean, lemmaTarget: wLemma } =
          normalizeUkHeadwordForMatch(w.ru);
        return wClean === lemmaTarget || wLemma === lemmaTarget;
      });
    if (matched) {
      matchedRanksSet.add(matched.rank);
    }
  }

  const matchedRanks = Array.from(matchedRanksSet);
  const inDeckRanks = matchedRanks.filter((r) => existingDeckRanks.has(r));
  const missingRanks = matchedRanks.filter((r) => !existingDeckRanks.has(r));
  const allAdded = matchedRanks.length > 0 && missingRanks.length === 0;

  let buttonLabel: string;
  if (allAdded) {
    buttonLabel = `✓ All ${inDeckRanks.length} words in your reviews`;
  } else if (inDeckRanks.length === 0) {
    buttonLabel = `Add these ${totalModuleWords} words to my reviews`;
  } else {
    buttonLabel = `Add remaining ${missingRanks.length} words to my reviews`;
  }

  return {
    totalModuleWords,
    matchedRanks,
    inDeckRanks,
    missingRanks,
    allAdded,
    buttonLabel,
  };
}

export interface LessonTocSectionItem {
  id: string;
  letter: string;
  shortLabel: string;
  isExpandable?: boolean;
}

export const LESSON_TOC_SECTIONS: ReadonlyArray<LessonTocSectionItem> = [
  { id: 'sec-learn', letter: 'A', shortLabel: "What you'll learn" },
  { id: 'sec-big-idea', letter: 'B', shortLabel: 'The big idea' },
  { id: 'sec-action', letter: 'C', shortLabel: 'See it in action' },
  { id: 'sec-pattern', letter: 'D', shortLabel: 'Visual patterns' },
  { id: 'sec-steps', letter: 'E', shortLabel: 'Step-by-step rules' },
  { id: 'sec-more-ex', letter: 'F', shortLabel: 'More examples' },
  {
    id: 'sec-exceptions',
    letter: 'G',
    shortLabel: 'Exceptions',
    isExpandable: true,
  },
  { id: 'sec-mistakes', letter: 'H', shortLabel: 'Common mistakes' },
  { id: 'sec-inline-check', letter: 'I', shortLabel: 'Quick check' },
  { id: 'sec-dialogue', letter: 'J', shortLabel: 'In real life' },
  {
    id: 'sec-reference',
    letter: 'K',
    shortLabel: 'Complete reference',
    isExpandable: true,
  },
  { id: 'sec-remember', letter: 'L', shortLabel: 'What to remember' },
];
