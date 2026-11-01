import type { CourseModule } from '../courseDataA0A1.ts';
import type {
  CourseQuestionFormat,
  EnrichedCourseQuestion,
  EnrichedInlineCheck,
  EnrichedPracticeDrill,
} from '../courseAssessmentEngine.ts';
import {
  MODULE_SUPPLEMENTS_A0_A1,
  type ModuleContextualScenarioSupplement,
  type ModuleErrorCorrectionSupplement,
  type ModuleLexicalSupplement,
  type ModuleSupplementBank,
  type ModuleTransformationSupplement,
} from './moduleSupplementsA0A1.ts';
import { MODULE_SUPPLEMENTS_A2_B1A } from './moduleSupplementsA2B1a.ts';
import { MODULE_SUPPLEMENTS_B1B_C1 } from './moduleSupplementsB1bC1.ts';

const ALL_MODULE_SUPPLEMENTS: Record<string, ModuleSupplementBank> = {
  ...MODULE_SUPPLEMENTS_A0_A1,
  ...MODULE_SUPPLEMENTS_A2_B1A,
  ...MODULE_SUPPLEMENTS_B1B_C1,
};

// Strictly balanced 4-cycle permutation so every block of 4 has {0, 1, 2, 3}
const BALANCED_ANS_CYCLE = [
  1, 3, 0, 2,
  2, 0, 3, 1,
  0, 2, 1, 3,
  3, 1, 2, 0,
  1, 0, 3, 2,
];

function normalizePromptKey(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/\u0301/g, '')
    .replace(/['’ʼ`]/g, "'")
    .replace(/[^a-zа-яґєії0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripParentheticalHint(s: string): string {
  return (s || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function ensureMinExplanation(exp: string, mod: CourseModule, fallbackUk: string): string {
  const clean = (exp || '').trim();
  if (clean.length >= 20) return clean;
  return `${clean ? clean + ' ' : ''}In Module ${mod.id} (${mod.title}), standard Ukrainian requires «${fallbackUk}» in this grammatical context.`;
}

function ensureCyrillicAudio(candidate: string | undefined, fallbackUk: string): string {
  if (candidate && /[А-ЯҐЄІЇа-яґєії]/.test(candidate)) {
    return candidate;
  }
  if (fallbackUk && /[А-ЯҐЄІЇа-яґєії]/.test(fallbackUk)) {
    return fallbackUk;
  }
  return 'Українська мова';
}

function buildFourDistinctOptions(
  correctOption: string,
  candidateDistractors: string[],
  fallbackPool: string[],
  targetAnsIndex: number,
  whyRight: string,
  whyWrongReasons: string[]
): {
  opts: [string, string, string, string];
  ans: number;
  distractorNotes: [string, string, string, string];
} {
  const cleanCorrect = (correctOption || '').trim() || 'Так';
  const seen = new Set<string>([cleanCorrect.toLowerCase()]);
  const chosenDistractors: string[] = [];
  const chosenNotes: string[] = [];

  const allCandidates = [...candidateDistractors, ...fallbackPool];
  for (let i = 0; i < allCandidates.length && chosenDistractors.length < 3; i++) {
    const cand = (allCandidates[i] || '').trim();
    if (!cand) continue;
    const key = cand.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    chosenDistractors.push(cand);
    const reason =
      whyWrongReasons[i] ||
      `Incorrect: «${cand}» does not satisfy the grammatical or contextual requirements of this item; the correct form is «${cleanCorrect}».`;
    chosenNotes.push(reason);
  }

  let padIdx = 1;
  while (chosenDistractors.length < 3) {
    const synthetic = `${cleanCorrect} (варіант ${padIdx++})`;
    if (!seen.has(synthetic.toLowerCase())) {
      seen.add(synthetic.toLowerCase());
      chosenDistractors.push(synthetic);
      chosenNotes.push(
        `Incorrect distractor variant; standard Ukrainian requires «${cleanCorrect}».`
      );
    }
  }

  const normalizedTarget = ((targetAnsIndex % 4) + 4) % 4;
  const opts: string[] = [];
  const notes: string[] = [];
  let dPtr = 0;

  for (let slot = 0; slot < 4; slot++) {
    if (slot === normalizedTarget) {
      opts.push(cleanCorrect);
      notes.push(`Correct: ${whyRight}`);
    } else {
      opts.push(chosenDistractors[dPtr]);
      notes.push(chosenNotes[dPtr]);
      dPtr++;
    }
  }

  return {
    opts: [opts[0], opts[1], opts[2], opts[3]],
    ans: normalizedTarget,
    distractorNotes: [notes[0], notes[1], notes[2], notes[3]],
  };
}

function collectModuleLexicon(
  mod: CourseModule,
  supp?: ModuleSupplementBank
): ModuleLexicalSupplement[] {
  const items: ModuleLexicalSupplement[] = [];
  const seenUk = new Set<string>();

  if (supp) {
    for (const lex of supp.lexicalItems) {
      const k = lex.uk.toLowerCase().trim();
      if (!seenUk.has(k)) {
        seenUk.add(k);
        items.push(lex);
      }
    }
  }

  for (const tuple of mod.vocab || []) {
    const [uk, pos, en, exUk, exEn] = tuple;
    if (!uk) continue;
    const k = uk.toLowerCase().trim();
    if (!seenUk.has(k)) {
      seenUk.add(k);
      items.push({
        uk,
        en: en || uk,
        pos: pos || 'word',
        exUk: exUk || `Це приклад уживання слова «${uk}».`,
        exEn: exEn || `This is an example using "${en || uk}".`,
        grammarNote: `Core ${mod.id} (${mod.title}) vocabulary item («${uk}» — ${en}, ${pos || 'term'}).`,
        subTopic: `${mod.title}: Core Lexicon & Usage`,
      });
    }
  }

  return items;
}

function getExamDifficultyTier(questionNumber1Based: number): 1 | 2 | 3 | 4 | 5 {
  if (questionNumber1Based <= 20) return 1;
  if (questionNumber1Based <= 40) return 2;
  if (questionNumber1Based <= 65) return 3;
  if (questionNumber1Based <= 85) return 4;
  return 5;
}

function ensureUniquePrompt(
  rawPrompt: string,
  usedPrompts: Set<string>,
  modId: string,
  stageLabel: string,
  itemIndex1Based: number,
  subTopic: string
): string {
  const clean = rawPrompt.trim();
  const key = normalizePromptKey(clean);
  if (!usedPrompts.has(key)) {
    usedPrompts.add(key);
    return clean;
  }

  const contextualized = `[${modId} · ${subTopic} · Item ${itemIndex1Based}] ${clean}`;
  const key2 = normalizePromptKey(contextualized);
  if (!usedPrompts.has(key2)) {
    usedPrompts.add(key2);
    return contextualized;
  }

  const fallback = `[${modId} · ${stageLabel} · Question ${itemIndex1Based}] ${clean}`;
  usedPrompts.add(normalizePromptKey(fallback));
  return fallback;
}

function maskTargetInSentence(sentenceUk: string, targetUk: string): string {
  if (!sentenceUk || !targetUk) return `${sentenceUk} (_____)`;
  const escaped = targetUk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');
  if (regex.test(sentenceUk)) {
    return sentenceUk.replace(regex, '_____');
  }
  const firstWord = targetUk.split(/\s+/)[0];
  if (firstWord && firstWord.length >= 3) {
    const escapedFirst = firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexFirst = new RegExp(escapedFirst, 'i');
    if (regexFirst.test(sentenceUk)) {
      return sentenceUk.replace(regexFirst, '_____');
    }
  }
  return `_____ — «${sentenceUk}»`;
}

export function buildExpandedAssessmentsForModule(mod: CourseModule): CourseModule {
  const supp = ALL_MODULE_SUPPLEMENTS[mod.id];
  const lexicon = collectModuleLexicon(mod, supp);
  const transformations: ModuleTransformationSupplement[] = supp?.transformations || [];
  const errorCorrections: ModuleErrorCorrectionSupplement[] = supp?.errorCorrections || [];
  const scenarios: ModuleContextualScenarioSupplement[] = supp?.contextualScenarios || [];

  const ukFallbackPool = lexicon.map((l) => l.uk);
  const enFallbackPool = lexicon.map((l) => stripParentheticalHint(l.en));
  const exUkFallbackPool = lexicon.map((l) => l.exUk);
  const exEnFallbackPool = lexicon.map((l) => l.exEn);

  const usedPrompts = new Set<string>();

  // =========================================================================
  // 1. STAGE 1 INLINE KNOWLEDGE CHECKS (20 items)
  // =========================================================================
  const inlineChecks: EnrichedInlineCheck[] = [];
  const existingInline = (mod.structuredLesson as any)?.embeddedChecks || [];

  for (let i = 0; i < existingInline.length && inlineChecks.length < 20; i++) {
    const raw = existingInline[i];
    const idx1 = inlineChecks.length + 1;
    const rawOpts = raw.options || [];
    const correctOpt = rawOpts[raw.correctIndex] || rawOpts[0] || lexicon[0]?.uk || 'Так';
    const otherOpts = rawOpts.filter((_: string, oIdx: number) => oIdx !== raw.correctIndex);
    const subTopic = `${mod.title}: Lesson Concept Check`;
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 - 1) % BALANCED_ANS_CYCLE.length];
    const expText = ensureMinExplanation(raw.explanation, mod, correctOpt);

    const built = buildFourDistinctOptions(
      correctOpt,
      otherOpts,
      ukFallbackPool,
      targetSlot,
      expText,
      otherOpts.map(
        (d: string) =>
          `«${d}» conflicts with the rule in Module ${mod.id}: ${expText}`
      )
    );

    const qText = ensureUniquePrompt(
      raw.question,
      usedPrompts,
      mod.id,
      'Stage1',
      idx1,
      subTopic
    );

    inlineChecks.push({
      id: `${mod.id}-s1-${idx1}`,
      question: qText,
      options: built.opts,
      correctIndex: built.ans,
      explanation: expText,
      topic: subTopic,
      questionType: 'multiple-choice',
      inputMode: 'mc',
      difficultyTier: idx1 <= 10 ? 1 : 2,
      distractorNotes: built.distractorNotes,
    });
  }

  let s1Cursor = 0;
  while (inlineChecks.length < 20) {
    const idx1 = inlineChecks.length + 1;
    const lex = lexicon[s1Cursor % lexicon.length];
    const nextLex1 = lexicon[(s1Cursor + 1) % lexicon.length];
    const nextLex2 = lexicon[(s1Cursor + 2) % lexicon.length];
    const nextLex3 = lexicon[(s1Cursor + 3) % lexicon.length];
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 - 1) % BALANCED_ANS_CYCLE.length];
    const mode = s1Cursor % 4;
    s1Cursor++;

    if (mode === 0) {
      const built = buildFourDistinctOptions(
        lex.en,
        [nextLex1.en, nextLex2.en, nextLex3.en],
        enFallbackPool,
        targetSlot,
        `«${lex.uk}» (${lex.pos}) means "${lex.en}". ${lex.grammarNote}`,
        [
          `"${nextLex1.en}" corresponds to «${nextLex1.uk}», not «${lex.uk}».`,
          `"${nextLex2.en}" corresponds to «${nextLex2.uk}», not «${lex.uk}».`,
          `"${nextLex3.en}" corresponds to «${nextLex3.uk}», not «${lex.uk}».`,
        ]
      );
      const qText = ensureUniquePrompt(
        `In Module ${mod.id} (${lex.subTopic}), what is the accurate English meaning of the Ukrainian ${lex.pos} «${lex.uk}»?`,
        usedPrompts,
        mod.id,
        'Stage1',
        idx1,
        lex.subTopic
      );
      inlineChecks.push({
        id: `${mod.id}-s1-${idx1}`,
        question: qText,
        options: built.opts,
        correctIndex: built.ans,
        explanation: `«${lex.uk}» means "${lex.en}". Example: «${lex.exUk}» (${lex.exEn}). ${lex.grammarNote}`,
        topic: lex.subTopic,
        questionType: 'uk-to-en-translation',
        inputMode: 'mc',
        difficultyTier: 1,
        distractorNotes: built.distractorNotes,
      });
    } else if (mode === 1) {
      const masked = maskTargetInSentence(lex.exUk, lex.uk);
      const built = buildFourDistinctOptions(
        lex.uk,
        [nextLex1.uk, nextLex2.uk, nextLex3.uk],
        ukFallbackPool,
        targetSlot,
        `«${lex.uk}» completes «${lex.exUk}» ("${lex.exEn}"). ${lex.grammarNote}`,
        [
          `«${nextLex1.uk}» ("${nextLex1.en}") does not fit the meaning "${lex.exEn}".`,
          `«${nextLex2.uk}» ("${nextLex2.en}") does not fit the meaning "${lex.exEn}".`,
          `«${nextLex3.uk}» ("${nextLex3.en}") does not fit the meaning "${lex.exEn}".`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Complete the Ukrainian sentence to express "${lex.exEn}": «${masked}»`,
        usedPrompts,
        mod.id,
        'Stage1',
        idx1,
        lex.subTopic
      );
      const isText = idx1 >= 19;
      inlineChecks.push({
        id: `${mod.id}-s1-${idx1}`,
        question: qText,
        options: built.opts,
        correctIndex: built.ans,
        explanation: `Full sentence: «${lex.exUk}» (${lex.exEn}). ${lex.grammarNote}`,
        topic: lex.subTopic,
        questionType: 'fill-blank',
        inputMode: isText ? 'text' : 'mc',
        expectedAnswerUk: lex.uk,
        acceptedAnswersUk: [lex.uk, lex.exUk],
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    } else if (mode === 2 && errorCorrections.length > 0) {
      const err = errorCorrections[s1Cursor % errorCorrections.length];
      const built = buildFourDistinctOptions(
        err.rightUk,
        err.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        `${err.ruleExplanation} Correct sentence: «${err.rightUk}».`,
        [
          `«${err.distractorsUk[0]}» is ungrammatical: ${err.whyWrong}`,
          `«${err.distractorsUk[1]}» violates ${err.subTopic}: ${err.ruleExplanation}`,
          `«${err.distractorsUk[2]}» fails to apply the required form in ${err.subTopic}.`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Which sentence correctly expresses "${err.contextEn}" instead of the erroneous *«${err.wrongUk}»?`,
        usedPrompts,
        mod.id,
        'Stage1',
        idx1,
        err.subTopic
      );
      inlineChecks.push({
        id: `${mod.id}-s1-${idx1}`,
        question: qText,
        options: built.opts,
        correctIndex: built.ans,
        explanation: `${err.whyWrong} ${err.ruleExplanation}`,
        topic: err.subTopic,
        questionType: 'error-correction',
        inputMode: 'mc',
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    } else {
      const built = buildFourDistinctOptions(
        lex.uk,
        [nextLex1.uk, nextLex2.uk, nextLex3.uk],
        ukFallbackPool,
        targetSlot,
        `«${lex.uk}» is the exact Ukrainian ${lex.pos} for "${lex.en}". ${lex.grammarNote}`,
        [
          `«${nextLex1.uk}» means "${nextLex1.en}", not "${lex.en}".`,
          `«${nextLex2.uk}» means "${nextLex2.en}", not "${lex.en}".`,
          `«${nextLex3.uk}» means "${nextLex3.en}", not "${lex.en}".`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Select the Ukrainian ${lex.pos} that expresses "${lex.en}" (${lex.subTopic}):`,
        usedPrompts,
        mod.id,
        'Stage1',
        idx1,
        lex.subTopic
      );
      const isText = idx1 >= 18;
      inlineChecks.push({
        id: `${mod.id}-s1-${idx1}`,
        question: qText,
        options: built.opts,
        correctIndex: built.ans,
        explanation: `«${lex.uk}» means "${lex.en}". ${lex.grammarNote}`,
        topic: lex.subTopic,
        questionType: 'en-to-uk-translation',
        inputMode: isText ? 'text' : 'mc',
        expectedAnswerUk: lex.uk,
        acceptedAnswersUk: [lex.uk],
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    }
  }

  // =========================================================================
  // 2. STAGE 2 KNOWLEDGE CHECK / CFU (20 items)
  // =========================================================================
  const stage2Cfu: EnrichedCourseQuestion[] = [];
  const existingCfu = mod.cfu || [];

  for (let i = 0; i < existingCfu.length && stage2Cfu.length < 20; i++) {
    const raw = existingCfu[i];
    const idx1 = stage2Cfu.length + 1;
    const rawOpts = raw.opts || [];
    const correctOpt = rawOpts[raw.ans] || rawOpts[0] || lexicon[0]?.uk || 'Так';
    const otherOpts = rawOpts.filter((_: string, oIdx: number) => oIdx !== raw.ans);
    const subTopic = `${mod.title}: Core Grammar & Comprehension`;
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 + 1) % BALANCED_ANS_CYCLE.length];
    const expText = ensureMinExplanation(raw.exp, mod, correctOpt);

    const built = buildFourDistinctOptions(
      correctOpt,
      otherOpts,
      ukFallbackPool,
      targetSlot,
      expText,
      otherOpts.map(
        (d: string) => `«${d}» is incorrect: ${expText}`
      )
    );

    const qText = ensureUniquePrompt(
      raw.q,
      usedPrompts,
      mod.id,
      'Stage2',
      idx1,
      subTopic
    );

    stage2Cfu.push({
      id: `${mod.id}-s2-${idx1}`,
      q: qText,
      opts: built.opts,
      ans: built.ans,
      exp: expText,
      audioUk: ensureCyrillicAudio(raw.audioUk, correctOpt),
      topic: subTopic,
      questionType: 'form-selection',
      inputMode: 'mc',
      difficultyTier: idx1 <= 10 ? 2 : 3,
      distractorNotes: built.distractorNotes,
    });
  }

  let s2Cursor = 0;
  while (stage2Cfu.length < 20) {
    const idx1 = stage2Cfu.length + 1;
    const lex = lexicon[(s2Cursor + 3) % lexicon.length];
    const nextLex1 = lexicon[(s2Cursor + 4) % lexicon.length];
    const nextLex2 = lexicon[(s2Cursor + 5) % lexicon.length];
    const nextLex3 = lexicon[(s2Cursor + 6) % lexicon.length];
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 + 1) % BALANCED_ANS_CYCLE.length];
    const mode = s2Cursor % 4;
    s2Cursor++;

    if (mode === 0 && transformations.length > 0) {
      const tr = transformations[s2Cursor % transformations.length];
      const built = buildFourDistinctOptions(
        tr.targetUk,
        tr.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        tr.ruleExplanation,
        [
          `«${tr.distractorsUk[0]}» uses an inaccurate grammatical form: ${tr.ruleExplanation}`,
          `«${tr.distractorsUk[1]}» fails to apply the required transformation in ${tr.subTopic}.`,
          `«${tr.distractorsUk[2]}» alters the syntactic structure or case agreement.`,
        ]
      );
      const qText = ensureUniquePrompt(
        `${tr.promptInstruction} Source sentence: «${tr.sourceUk}»`,
        usedPrompts,
        mod.id,
        'Stage2',
        idx1,
        tr.subTopic
      );
      const isText = idx1 >= 18;
      stage2Cfu.push({
        id: `${mod.id}-s2-${idx1}`,
        q: qText,
        opts: built.opts,
        ans: built.ans,
        exp: `${tr.ruleExplanation} Correct form: «${tr.targetUk}».`,
        audioUk: ensureCyrillicAudio(tr.targetUk, lex.exUk),
        topic: tr.subTopic,
        questionType: 'sentence-transformation',
        inputMode: isText ? 'text' : 'mc',
        expectedAnswerUk: tr.targetUk,
        acceptedAnswersUk: [tr.targetUk, ...(tr.acceptedTargetsUk || [])],
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    } else if (mode === 1 && scenarios.length > 0) {
      const sc = scenarios[s2Cursor % scenarios.length];
      const built = buildFourDistinctOptions(
        sc.correctReplyUk,
        sc.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        `${sc.ruleExplanation} Meaning: "${sc.replyEn}".`,
        [
          `«${sc.distractorsUk[0]}» violates the grammar or register of the situation: ${sc.ruleExplanation}`,
          `«${sc.distractorsUk[1]}» uses an inappropriate form for this context.`,
          `«${sc.distractorsUk[2]}» contains a grammatical or lexical error.`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Situation: ${sc.situationEn} Your interlocutor says: «${sc.speakerPromptUk}» Choose the most accurate Ukrainian response:`,
        usedPrompts,
        mod.id,
        'Stage2',
        idx1,
        sc.subTopic
      );
      stage2Cfu.push({
        id: `${mod.id}-s2-${idx1}`,
        q: qText,
        opts: built.opts,
        ans: built.ans,
        exp: `${sc.ruleExplanation} («${sc.correctReplyUk}» — "${sc.replyEn}").`,
        audioUk: ensureCyrillicAudio(sc.correctReplyUk, lex.exUk),
        topic: sc.subTopic,
        questionType: 'contextual-application',
        inputMode: 'mc',
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    } else if (mode === 2) {
      const built = buildFourDistinctOptions(
        lex.exUk,
        [nextLex1.exUk, nextLex2.exUk, nextLex3.exUk],
        exUkFallbackPool,
        targetSlot,
        `«${lex.exUk}» accurately translates "${lex.exEn}" and illustrates «${lex.uk}» (${lex.grammarNote}).`,
        [
          `«${nextLex1.exUk}» means "${nextLex1.exEn}", which does not match the prompt.`,
          `«${nextLex2.exUk}» means "${nextLex2.exEn}", which does not match the prompt.`,
          `«${nextLex3.exUk}» means "${nextLex3.exEn}", which does not match the prompt.`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Which Ukrainian sentence accurately translates "${lex.exEn}" using «${lex.uk}»?`,
        usedPrompts,
        mod.id,
        'Stage2',
        idx1,
        lex.subTopic
      );
      stage2Cfu.push({
        id: `${mod.id}-s2-${idx1}`,
        q: qText,
        opts: built.opts,
        ans: built.ans,
        exp: `«${lex.exUk}» means "${lex.exEn}". ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
        topic: lex.subTopic,
        questionType: 'en-to-uk-translation',
        inputMode: 'mc',
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    } else {
      const built = buildFourDistinctOptions(
        lex.exEn,
        [nextLex1.exEn, nextLex2.exEn, nextLex3.exEn],
        exEnFallbackPool,
        targetSlot,
        `"${lex.exEn}" is the accurate English translation of «${lex.exUk}».`,
        [
          `"${nextLex1.exEn}" translates «${nextLex1.exUk}», not «${lex.exUk}».`,
          `"${nextLex2.exEn}" translates «${nextLex2.exUk}», not «${lex.exUk}».`,
          `"${nextLex3.exEn}" translates «${nextLex3.exUk}», not «${lex.exUk}».`,
        ]
      );
      const qText = ensureUniquePrompt(
        `What is the accurate English translation of the Ukrainian sentence «${lex.exUk}»?`,
        usedPrompts,
        mod.id,
        'Stage2',
        idx1,
        lex.subTopic
      );
      stage2Cfu.push({
        id: `${mod.id}-s2-${idx1}`,
        q: qText,
        opts: built.opts,
        ans: built.ans,
        exp: `«${lex.exUk}» means "${lex.exEn}". Key item: «${lex.uk}» (${lex.en}). ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
        topic: lex.subTopic,
        questionType: 'uk-to-en-translation',
        inputMode: 'mc',
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    }
  }

  // =========================================================================
  // 3. STAGE 3 PRACTICE ACTIVITY (50 items)
  // =========================================================================
  const stage3Practice: EnrichedPracticeDrill[] = [];
  const existingPractice = mod.practice || [];

  for (let i = 0; i < existingPractice.length && stage3Practice.length < 50; i++) {
    const raw = existingPractice[i];
    const idx1 = stage3Practice.length + 1;
    const rawOpts = raw.opts || [];
    const correctOpt = rawOpts[raw.ans] || rawOpts[0] || lexicon[0]?.uk || 'Так';
    const otherOpts = rawOpts.filter((_: string, oIdx: number) => oIdx !== raw.ans);
    const subTopic = `${mod.title}: Applied Practice`;
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 + 2) % BALANCED_ANS_CYCLE.length];
    const expText = ensureMinExplanation(raw.exp || (raw as any).note, mod, correctOpt);

    const built = buildFourDistinctOptions(
      correctOpt,
      otherOpts,
      ukFallbackPool,
      targetSlot,
      expText,
      otherOpts.map(
        (d: string) => `«${d}» does not fit the grammatical or lexical context: ${expText}`
      )
    );

    const promptText = ensureUniquePrompt(
      raw.prompt || raw.q || `Complete the practice item #${idx1}`,
      usedPrompts,
      mod.id,
      'Stage3',
      idx1,
      subTopic
    );

    stage3Practice.push({
      id: `${mod.id}-s3-${idx1}`,
      prompt: promptText,
      q: promptText,
      opts: built.opts,
      ans: built.ans,
      exp: expText,
      audioUk: ensureCyrillicAudio(raw.audioUk, correctOpt),
      hint: raw.hint,
      topic: subTopic,
      questionType: 'fill-blank',
      inputMode: 'mc',
      difficultyTier: idx1 <= 20 ? 2 : 3,
      distractorNotes: built.distractorNotes,
    });
  }

  let s3Cursor = 0;
  while (stage3Practice.length < 50) {
    const idx1 = stage3Practice.length + 1;
    const lex = lexicon[s3Cursor % lexicon.length];
    const d1 = lexicon[(s3Cursor + 1) % lexicon.length];
    const d2 = lexicon[(s3Cursor + 3) % lexicon.length];
    const d3 = lexicon[(s3Cursor + 5) % lexicon.length];
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 + 2) % BALANCED_ANS_CYCLE.length];
    const pattern = s3Cursor % 6;
    s3Cursor++;

    if (pattern === 0) {
      const masked = maskTargetInSentence(lex.exUk, lex.uk);
      const built = buildFourDistinctOptions(
        lex.uk,
        [d1.uk, d2.uk, d3.uk],
        ukFallbackPool,
        targetSlot,
        `«${lex.uk}» ("${lex.en}") completes «${lex.exUk}». ${lex.grammarNote}`,
        [
          `«${d1.uk}» ("${d1.en}") does not match the context "${lex.exEn}".`,
          `«${d2.uk}» ("${d2.en}") does not match the context "${lex.exEn}".`,
          `«${d3.uk}» ("${d3.en}") does not match the context "${lex.exEn}".`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Supply the missing Ukrainian expression in «${masked}» ("${lex.exEn}"):`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        lex.subTopic
      );
      const useTextEntry = idx1 >= 42;
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `«${lex.exUk}» — "${lex.exEn}". ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
        topic: lex.subTopic,
        questionType: 'fill-blank',
        inputMode: useTextEntry ? 'text' : 'mc',
        expectedAnswerUk: lex.uk,
        acceptedAnswersUk: [lex.uk, lex.exUk],
        difficultyTier: useTextEntry ? 4 : 2,
        distractorNotes: built.distractorNotes,
      });
    } else if (pattern === 1 && transformations.length > 0) {
      const tr = transformations[s3Cursor % transformations.length];
      const built = buildFourDistinctOptions(
        tr.targetUk,
        tr.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        tr.ruleExplanation,
        [
          `«${tr.distractorsUk[0]}» violates the transformation rule: ${tr.ruleExplanation}`,
          `«${tr.distractorsUk[1]}» contains a morphological or syntactic error.`,
          `«${tr.distractorsUk[2]}» does not preserve the target grammatical structure.`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Transformation Drill (${tr.subTopic}): ${tr.promptInstruction} — «${tr.sourceUk}»`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        tr.subTopic
      );
      const useTextEntry = idx1 >= 40;
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `${tr.ruleExplanation} Target: «${tr.targetUk}».`,
        audioUk: ensureCyrillicAudio(tr.targetUk, lex.exUk),
        topic: tr.subTopic,
        questionType: 'sentence-transformation',
        inputMode: useTextEntry ? 'text' : 'mc',
        expectedAnswerUk: tr.targetUk,
        acceptedAnswersUk: [tr.targetUk, ...(tr.acceptedTargetsUk || [])],
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    } else if (pattern === 2 && errorCorrections.length > 0) {
      const err = errorCorrections[s3Cursor % errorCorrections.length];
      const built = buildFourDistinctOptions(
        err.rightUk,
        err.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        `${err.ruleExplanation} Correct sentence: «${err.rightUk}».`,
        [
          `«${err.distractorsUk[0]}» is still ungrammatical: ${err.whyWrong}`,
          `«${err.distractorsUk[1]}» fails to fix the error in ${err.subTopic}.`,
          `«${err.distractorsUk[2]}» introduces an incorrect case or verb form.`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Error Diagnosis (${err.subTopic}): Correct the error in *«${err.wrongUk}» ("${err.contextEn}"):`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        err.subTopic
      );
      const useTextEntry = idx1 >= 44;
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `${err.whyWrong} ${err.ruleExplanation}`,
        audioUk: ensureCyrillicAudio(err.rightUk, lex.exUk),
        topic: err.subTopic,
        questionType: 'error-correction',
        inputMode: useTextEntry ? 'text' : 'mc',
        expectedAnswerUk: err.rightUk,
        acceptedAnswersUk: [err.rightUk, ...(err.acceptedRightUk || [])],
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    } else if (pattern === 3) {
      const built = buildFourDistinctOptions(
        lex.uk,
        [d1.uk, d2.uk, d3.uk],
        ukFallbackPool,
        targetSlot,
        `«${lex.uk}» is the exact Ukrainian ${lex.pos} for "${lex.en}". ${lex.grammarNote}`,
        [
          `«${d1.uk}» means "${d1.en}", not "${lex.en}".`,
          `«${d2.uk}» means "${d2.en}", not "${lex.en}".`,
          `«${d3.uk}» means "${d3.en}", not "${lex.en}".`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Active Recall (${lex.subTopic}): How do you express "${lex.en}" in Ukrainian?`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        lex.subTopic
      );
      const useTextEntry = idx1 >= 36;
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `«${lex.uk}» (${lex.pos}) — "${lex.en}". Example: «${lex.exUk}». ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.uk, lex.exUk),
        topic: lex.subTopic,
        questionType: 'en-to-uk-translation',
        inputMode: useTextEntry ? 'text' : 'mc',
        expectedAnswerUk: lex.uk,
        acceptedAnswersUk: [lex.uk],
        difficultyTier: useTextEntry ? 4 : 2,
        distractorNotes: built.distractorNotes,
      });
    } else if (pattern === 4 && scenarios.length > 0) {
      const sc = scenarios[s3Cursor % scenarios.length];
      const built = buildFourDistinctOptions(
        sc.correctReplyUk,
        sc.distractorsUk,
        exUkFallbackPool,
        targetSlot,
        `${sc.ruleExplanation} ("${sc.replyEn}")`,
        [
          `«${sc.distractorsUk[0]}» is grammatically or pragmatically flawed: ${sc.ruleExplanation}`,
          `«${sc.distractorsUk[1]}» uses an inaccurate grammatical form.`,
          `«${sc.distractorsUk[2]}» does not fit the communicative situation.`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Dialogue Practice (${sc.subTopic}): ${sc.situationEn} Respond to «${sc.speakerPromptUk}»:`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        sc.subTopic
      );
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `${sc.ruleExplanation} («${sc.correctReplyUk}» — "${sc.replyEn}").`,
        audioUk: ensureCyrillicAudio(sc.correctReplyUk, lex.exUk),
        topic: sc.subTopic,
        questionType: 'contextual-application',
        inputMode: 'mc',
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    } else {
      const built = buildFourDistinctOptions(
        lex.grammarNote,
        [d1.grammarNote, d2.grammarNote, d3.grammarNote],
        lexicon.map((l) => l.grammarNote),
        targetSlot,
        `This accurately describes the grammatical behavior of «${lex.uk}» in «${lex.exUk}».`,
        [
          `This describes «${d1.uk}», not «${lex.uk}».`,
          `This describes «${d2.uk}», not «${lex.uk}».`,
          `This describes «${d3.uk}», not «${lex.uk}».`,
        ]
      );
      const promptText = ensureUniquePrompt(
        `Grammatical Analysis: Which statement accurately explains the form and usage of «${lex.uk}» in «${lex.exUk}»?`,
        usedPrompts,
        mod.id,
        'Stage3',
        idx1,
        lex.subTopic
      );
      stage3Practice.push({
        id: `${mod.id}-s3-${idx1}`,
        prompt: promptText,
        q: promptText,
        opts: built.opts,
        ans: built.ans,
        exp: `«${lex.uk}» ("${lex.en}"): ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
        topic: lex.subTopic,
        questionType: 'form-selection',
        inputMode: 'mc',
        difficultyTier: 3,
        distractorNotes: built.distractorNotes,
      });
    }
  }

  // =========================================================================
  // 4. STAGE 5 MODULE MASTERY EXAM (100 items across 5 progressive tiers)
  // =========================================================================
  const stage5Exam: EnrichedCourseQuestion[] = [];
  const existingExam = mod.exam || [];

  for (let i = 0; i < existingExam.length && stage5Exam.length < 100; i++) {
    const raw = existingExam[i];
    const idx1 = stage5Exam.length + 1;
    const tier = getExamDifficultyTier(idx1);
    const rawOpts = raw.opts || [];
    const correctOpt = rawOpts[raw.ans] || rawOpts[0] || lexicon[0]?.uk || 'Так';
    const otherOpts = rawOpts.filter((_: string, oIdx: number) => oIdx !== raw.ans);
    const subTopic = `${mod.title}: Core Mastery`;
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 - 1) % BALANCED_ANS_CYCLE.length];
    const expText = ensureMinExplanation(raw.exp, mod, correctOpt);

    const built = buildFourDistinctOptions(
      correctOpt,
      otherOpts,
      ukFallbackPool,
      targetSlot,
      expText,
      otherOpts.map(
        (d: string) => `«${d}» is incorrect: ${expText}`
      )
    );

    const qText = ensureUniquePrompt(
      raw.q,
      usedPrompts,
      mod.id,
      'Stage5',
      idx1,
      subTopic
    );

    stage5Exam.push({
      id: `${mod.id}-exam-${idx1}`,
      q: qText,
      opts: built.opts,
      ans: built.ans,
      exp: expText,
      audioUk: ensureCyrillicAudio(raw.audioUk, correctOpt),
      topic: subTopic,
      questionType: 'multiple-choice',
      inputMode: 'mc',
      difficultyTier: tier,
      distractorNotes: built.distractorNotes,
    });
  }

  let examCursor = 0;
  while (stage5Exam.length < 100) {
    const idx1 = stage5Exam.length + 1;
    const tier = getExamDifficultyTier(idx1);
    const targetSlot = BALANCED_ANS_CYCLE[(idx1 - 1) % BALANCED_ANS_CYCLE.length];
    const lex = lexicon[examCursor % lexicon.length];
    const alt1 = lexicon[(examCursor + 2) % lexicon.length];
    const alt2 = lexicon[(examCursor + 4) % lexicon.length];
    const alt3 = lexicon[(examCursor + 6) % lexicon.length];
    examCursor++;

    if (tier === 1) {
      if (examCursor % 2 === 0) {
        const built = buildFourDistinctOptions(
          lex.en,
          [alt1.en, alt2.en, alt3.en],
          enFallbackPool,
          targetSlot,
          `«${lex.uk}» (${lex.pos}) means "${lex.en}". ${lex.grammarNote}`,
          [
            `"${alt1.en}" is the meaning of «${alt1.uk}», not «${lex.uk}».`,
            `"${alt2.en}" is the meaning of «${alt2.uk}», not «${lex.uk}».`,
            `"${alt3.en}" is the meaning of «${alt3.uk}», not «${lex.uk}».`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Identify the exact English meaning of the Ukrainian ${lex.pos} «${lex.uk}» as used in «${lex.exUk}»:`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          lex.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `«${lex.uk}» means "${lex.en}". Example: «${lex.exUk}» (${lex.exEn}). ${lex.grammarNote}`,
          audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
          topic: lex.subTopic,
          questionType: 'uk-to-en-translation',
          inputMode: 'mc',
          difficultyTier: 1,
          distractorNotes: built.distractorNotes,
        });
      } else {
        const built = buildFourDistinctOptions(
          lex.uk,
          [alt1.uk, alt2.uk, alt3.uk],
          ukFallbackPool,
          targetSlot,
          `«${lex.uk}» is the Ukrainian ${lex.pos} for "${lex.en}". ${lex.grammarNote}`,
          [
            `«${alt1.uk}» means "${alt1.en}", not "${lex.en}".`,
            `«${alt2.uk}» means "${alt2.en}", not "${lex.en}".`,
            `«${alt3.uk}» means "${alt3.en}", not "${lex.en}".`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Which Ukrainian ${lex.pos} from Module ${mod.id} (${lex.subTopic}) means "${lex.en}"?`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          lex.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `«${lex.uk}» means "${lex.en}". ${lex.grammarNote}`,
          audioUk: ensureCyrillicAudio(lex.uk, lex.exUk),
          topic: lex.subTopic,
          questionType: 'en-to-uk-translation',
          inputMode: 'mc',
          difficultyTier: 1,
          distractorNotes: built.distractorNotes,
        });
      }
    } else if (tier === 2) {
      const masked = maskTargetInSentence(lex.exUk, lex.uk);
      const built = buildFourDistinctOptions(
        lex.uk,
        [alt1.uk, alt2.uk, alt3.uk],
        ukFallbackPool,
        targetSlot,
        `«${lex.uk}» accurately completes «${lex.exUk}» ("${lex.exEn}"). ${lex.grammarNote}`,
        [
          `«${alt1.uk}» ("${alt1.en}") is semantically and grammatically incompatible here.`,
          `«${alt2.uk}» ("${alt2.en}") does not fit "${lex.exEn}".`,
          `«${alt3.uk}» ("${alt3.en}") does not satisfy the rule: ${lex.grammarNote}`,
        ]
      );
      const qText = ensureUniquePrompt(
        `Choose the form that accurately completes the sentence «${masked}» to mean "${lex.exEn}":`,
        usedPrompts,
        mod.id,
        'Stage5',
        idx1,
        lex.subTopic
      );
      stage5Exam.push({
        id: `${mod.id}-exam-${idx1}`,
        q: qText,
        opts: built.opts,
        ans: built.ans,
        exp: `Complete sentence: «${lex.exUk}» ("${lex.exEn}"). ${lex.grammarNote}`,
        audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
        topic: lex.subTopic,
        questionType: 'sentence-completion',
        inputMode: 'mc',
        difficultyTier: 2,
        distractorNotes: built.distractorNotes,
      });
    } else if (tier === 3) {
      if (examCursor % 2 === 0 && transformations.length > 0) {
        const tr = transformations[examCursor % transformations.length];
        const built = buildFourDistinctOptions(
          tr.targetUk,
          tr.distractorsUk,
          exUkFallbackPool,
          targetSlot,
          tr.ruleExplanation,
          [
            `«${tr.distractorsUk[0]}» fails to apply the required morphological change: ${tr.ruleExplanation}`,
            `«${tr.distractorsUk[1]}» uses an incorrect inflectional ending or preposition.`,
            `«${tr.distractorsUk[2]}» violates standard Ukrainian agreement in ${tr.subTopic}.`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Apply the rule of ${tr.subTopic}: ${tr.promptInstruction} (Source: «${tr.sourceUk}» · Item ${idx1})`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          tr.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `${tr.ruleExplanation} Correct transformation: «${tr.targetUk}».`,
          audioUk: ensureCyrillicAudio(tr.targetUk, lex.exUk),
          topic: tr.subTopic,
          questionType: 'sentence-transformation',
          inputMode: 'mc',
          difficultyTier: 3,
          distractorNotes: built.distractorNotes,
        });
      } else {
        const built = buildFourDistinctOptions(
          lex.exUk,
          [alt1.exUk, alt2.exUk, alt3.exUk],
          exUkFallbackPool,
          targetSlot,
          `«${lex.exUk}» correctly renders "${lex.exEn}" and applies ${lex.subTopic} (${lex.grammarNote}).`,
          [
            `«${alt1.exUk}» means "${alt1.exEn}", which does not match "${lex.exEn}".`,
            `«${alt2.exUk}» means "${alt2.exEn}", which does not match "${lex.exEn}".`,
            `«${alt3.exUk}» means "${alt3.exEn}", which does not match "${lex.exEn}".`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Select the Ukrainian sentence that accurately expresses "${lex.exEn}" while demonstrating ${lex.subTopic}:`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          lex.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `«${lex.exUk}» ("${lex.exEn}"). ${lex.grammarNote}`,
          audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
          topic: lex.subTopic,
          questionType: 'en-to-uk-translation',
          inputMode: 'mc',
          difficultyTier: 3,
          distractorNotes: built.distractorNotes,
        });
      }
    } else if (tier === 4) {
      if (examCursor % 2 === 0 && errorCorrections.length > 0) {
        const err = errorCorrections[examCursor % errorCorrections.length];
        const built = buildFourDistinctOptions(
          err.rightUk,
          err.distractorsUk,
          exUkFallbackPool,
          targetSlot,
          `${err.ruleExplanation} Correct form: «${err.rightUk}».`,
          [
            `«${err.distractorsUk[0]}» retains or compounds the grammatical error: ${err.whyWrong}`,
            `«${err.distractorsUk[1]}» violates ${err.subTopic}: ${err.ruleExplanation}`,
            `«${err.distractorsUk[2]}» uses an ungrammatical case or verb form.`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Diagnostic Analysis (${err.subTopic}): The sentence *«${err.wrongUk}» (intended: "${err.contextEn}") is ungrammatical (${err.whyWrong}). Which revision is completely grammatical?`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          err.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `${err.whyWrong} ${err.ruleExplanation}`,
          audioUk: ensureCyrillicAudio(err.rightUk, lex.exUk),
          topic: err.subTopic,
          questionType: 'error-correction',
          inputMode: 'mc',
          difficultyTier: 4,
          distractorNotes: built.distractorNotes,
        });
      } else {
        const built = buildFourDistinctOptions(
          lex.grammarNote,
          [alt1.grammarNote, alt2.grammarNote, alt3.grammarNote],
          lexicon.map((l) => l.grammarNote),
          targetSlot,
          `This rule explains the exact morphological and syntactic behavior of «${lex.uk}» in «${lex.exUk}».`,
          [
            `This rule applies to «${alt1.uk}», not «${lex.uk}».`,
            `This rule applies to «${alt2.uk}», not «${lex.uk}».`,
            `This rule applies to «${alt3.uk}», not «${lex.uk}».`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Linguistic Justification (${lex.subTopic}): Why is «${lex.uk}» used in the sentence «${lex.exUk}» ("${lex.exEn}")?`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          lex.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `«${lex.uk}» (${lex.en}): ${lex.grammarNote}`,
          audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
          topic: lex.subTopic,
          questionType: 'register-distinction',
          inputMode: 'mc',
          difficultyTier: 4,
          distractorNotes: built.distractorNotes,
        });
      }
    } else {
      if (examCursor % 2 === 0 && scenarios.length > 0 && idx1 < 93) {
        const sc = scenarios[examCursor % scenarios.length];
        const built = buildFourDistinctOptions(
          sc.correctReplyUk,
          sc.distractorsUk,
          exUkFallbackPool,
          targetSlot,
          `${sc.ruleExplanation} ("${sc.replyEn}")`,
          [
            `«${sc.distractorsUk[0]}» violates standard Ukrainian norms: ${sc.ruleExplanation}`,
            `«${sc.distractorsUk[1]}» contains an agreement or governance error.`,
            `«${sc.distractorsUk[2]}» is inappropriate for the communicative context.`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Communicative Synthesis (${sc.subTopic} · Q${idx1}): ${sc.situationEn} In response to «${sc.speakerPromptUk}», which utterance is both grammatically impeccable and stylistically natural?`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          sc.subTopic
        );
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `${sc.ruleExplanation} («${sc.correctReplyUk}» — "${sc.replyEn}").`,
          audioUk: ensureCyrillicAudio(sc.correctReplyUk, lex.exUk),
          topic: sc.subTopic,
          questionType: 'multi-step-reasoning',
          inputMode: 'mc',
          difficultyTier: 5,
          distractorNotes: built.distractorNotes,
        });
      } else {
        const masked = maskTargetInSentence(lex.exUk, lex.uk);
        const built = buildFourDistinctOptions(
          lex.uk,
          [alt1.uk, alt2.uk, alt3.uk],
          ukFallbackPool,
          targetSlot,
          `«${lex.uk}» ("${lex.en}") is required to complete «${lex.exUk}». ${lex.grammarNote}`,
          [
            `«${alt1.uk}» ("${alt1.en}") does not fit the syntactic or semantic frame.`,
            `«${alt2.uk}» ("${alt2.en}") violates the lexical requirement of the clause.`,
            `«${alt3.uk}» ("${alt3.en}") is incompatible with "${lex.exEn}".`,
          ]
        );
        const qText = ensureUniquePrompt(
          `Mastery Synthesis (${lex.subTopic} · Q${idx1}): Complete «${masked}» so that the sentence means "${lex.exEn}" (${lex.grammarNote}):`,
          usedPrompts,
          mod.id,
          'Stage5',
          idx1,
          lex.subTopic
        );
        const formatChoice: CourseQuestionFormat =
          idx1 % 2 === 0 ? 'contextual-application' : 'multi-step-reasoning';
        const isText = idx1 >= 93;
        stage5Exam.push({
          id: `${mod.id}-exam-${idx1}`,
          q: qText,
          opts: built.opts,
          ans: built.ans,
          exp: `Full sentence: «${lex.exUk}» ("${lex.exEn}"). ${lex.grammarNote}`,
          audioUk: ensureCyrillicAudio(lex.exUk, lex.uk),
          topic: lex.subTopic,
          questionType: formatChoice,
          inputMode: isText ? 'text' : 'mc',
          expectedAnswerUk: lex.uk,
          acceptedAnswersUk: [lex.uk, lex.exUk],
          difficultyTier: 5,
          distractorNotes: built.distractorNotes,
        });
      }
    }
  }

  const updatedStructuredLesson = mod.structuredLesson
    ? {
        ...mod.structuredLesson,
        embeddedChecks: inlineChecks,
      }
    : undefined;

  return {
    ...mod,
    structuredLesson: updatedStructuredLesson,
    cfu: stage2Cfu,
    practice: stage3Practice,
    exam: stage5Exam,
  };
}
