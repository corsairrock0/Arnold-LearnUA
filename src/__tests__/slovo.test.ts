import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { FREQ_6000_DB } from '../vocabData.ts';
import {
    generateUkrainianPhonetics,
    generateGrammarBreakdown,
    generateSentenceCorrection
} from '../morphologyAndPhonetics.ts';
import { COURSE_MODULES } from '../courseData.ts';
import { READER_PASSAGES } from '../readerData.ts';
import {
    EVERYDAY_CATEGORIES,
    getCategoryVocabItems,
    validateUkrainianAnswer,
    FILL_BLANK_EXERCISES,
    SENTENCE_CONSTRUCTION_EXERCISES,
    CONTEXTUAL_CHOICE_EXERCISES,
    GRAMMAR_AWARE_EXERCISES
} from '../everydayVocabData.ts';

const stripStress = (s: string): string => s.replace(/\u0301/g, '');

test('1. Zero textbook references (Pugh, Press, Routledge, §) across all source and HTML files', () => {
    const filesToCheck = [
        'index.html',
        'metadata.json',
        'src/vocabData.ts',
        'src/everydayVocabData.ts',
        'src/morphologyAndPhonetics.ts',
        'src/courseDataA0A1.ts',
        'src/courseDataA2C1.ts',
        'src/courseData.ts',
        'src/courseVisualComponents.ts',
        'src/readerData.ts',
        'src/readerExtraData.ts',
        'src/identifyData.ts',
        'src/identifyEngine.ts',
        'src/identifyView.ts',
        'src/main.ts'
    ];
    const forbidden = [/pugh/i, /ian\s+press/i, /pugh\s*&\s*press/i, /routledge/i, /poulard/i, /yurchenko/i, /shevchuk/i, /hippocrene/i, /roma\s+franko/i, /detselig/i, /bekh/i, /dingley/i, /hodder/i, /john\s+murray/i, /teach\s+yourself/i, /pavlyshyn/i, /lonely\s+planet/i, /kandybko/i, /§\s*\d/];
    for (const rel of filesToCheck) {
        const content = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
        for (const regex of forbidden) {
            assert.equal(
                regex.test(content),
                false,
                `Found forbidden textbook reference matching ${regex} in ${rel}`
            );
        }
    }
});

test('2. FREQ_6000_DB vocabulary integrity: authentic words, stress marks, no filler rows, natural examples', () => {
    assert.ok(FREQ_6000_DB.length >= 1400, `Expected at least 1400 curated vocabulary items after Books 1–12 integration, got ${FREQ_6000_DB.length}`);
    for (const item of FREQ_6000_DB) {
        assert.ok(item.ru && item.ru.length > 0, `Rank ${item.rank} missing ru`);
        assert.ok(item.en && item.en.length > 0, `Rank ${item.rank} missing en`);
        assert.ok(!/\(variant\s+\d+/i.test(item.en), `Rank ${item.rank} has mechanical '(variant N)' filler: ${item.en}`);
        assert.ok(!item.en.includes('aspectual pair'), `Rank ${item.rank} has mechanical 'aspectual pair' filler: ${item.en}`);
        assert.ok(item.exampleUk && item.exampleUk.length > 5, `Rank ${item.rank} (${item.ru}) missing authentic exampleUk`);
        assert.ok(item.exampleEn && item.exampleEn.length > 5, `Rank ${item.rank} (${item.ru}) missing authentic exampleEn`);
    }
});

test('3. Phonetics & G2P analyzer: IPA, plain-English guide, [ɦ] vs [ɡ], bilabial [w], apostrophe', () => {
    const hory = generateUkrainianPhonetics('гори́');
    assert.ok(hory.ipa.includes('ɦ'), `Expected voiced glottal [ɦ] in гори́ IPA, got ${hory.ipa}`);
    assert.ok(hory.approxEn.length > 2, 'Expected non-empty approxEn plain-English guide for гори́');
    assert.ok(hory.notes.includes('ɦ'), 'Expected note explaining г [ɦ]');

    const gudz = generateUkrainianPhonetics('ґа́нок');
    assert.ok(gudz.ipa.includes('ɡ'), `Expected velar plosive [ɡ] in ґа́нок IPA, got ${gudz.ipa}`);

    const lviv = generateUkrainianPhonetics('Львів');
    assert.ok(lviv.ipa.includes('w'), `Expected bilabial [w] for final в in Львів, got ${lviv.ipa}`);
    assert.ok(lviv.ipa.includes('ʲ'), `Expected palatalization [ʲ] for ль in Львів, got ${lviv.ipa}`);

    const simya = generateUkrainianPhonetics("сім'я́");
    assert.ok(simya.ipa.includes('j'), `Expected [j] glide after apostrophe in сім'я́, got ${simya.ipa}`);
});

test('4. Morphology & 7-Case Declension Engine: fleeting vowels, consonant mutations, animate accusative, verbs', () => {
    // Fleeting vowel in хлопець -> хлопця (animate masculine accusative = genitive)
    const khlopets = generateGrammarBreakdown({
        rank: 101,
        ru: 'хло́пець',
        en: 'boy / young man',
        pos: 'NOUN',
        level: 'A1',
        gender: 'm',
        animacy: 'animate'
    });
    const cleanKhlopetsHtml = stripStress(khlopets.tableHtml);
    assert.ok(cleanKhlopetsHtml.includes('хлопця'), 'Expected fleeting vowel хлопець -> хлопця in declension table');
    assert.ok(cleanKhlopetsHtml.includes('хлопче'), 'Expected Vocative хлопче in declension table');

    // Fleeting vowel in день -> дня
    const den = generateGrammarBreakdown({
        rank: 45,
        ru: 'день',
        en: 'day',
        pos: 'NOUN',
        level: 'A1',
        gender: 'm',
        animacy: 'inanimate'
    });
    assert.ok(stripStress(den.tableHtml).includes('дня'), 'Expected день -> дня in Genitive');

    // Consonant mutation к -> ц in книжка -> книжці (Dative / Locative)
    const knyzhka = generateGrammarBreakdown({
        rank: 77,
        ru: 'кни́жка',
        en: 'book',
        pos: 'NOUN',
        level: 'A1',
        gender: 'f',
        animacy: 'inanimate'
    });
    assert.ok(stripStress(knyzhka.tableHtml).includes('книжці'), 'Expected к -> ц mutation in книжка -> книжці');

    // Verb conjugation: читати -> читаю, читаєш, читають
    const chytaty = generateGrammarBreakdown({
        rank: 52,
        ru: 'чита́ти',
        en: 'to read',
        pos: 'VERB',
        level: 'A1'
    });
    const cleanChytatyHtml = stripStress(chytaty.tableHtml);
    assert.ok(cleanChytatyHtml.includes('читаю'), 'Expected 1st sg. читаю');
    assert.ok(cleanChytatyHtml.includes('читаєш'), 'Expected 2nd sg. читаєш');
    assert.ok(cleanChytatyHtml.includes('читають'), 'Expected 3rd pl. читають');

    // Sentence correction generator produces valid contrast without textbook citations
    const corr = generateSentenceCorrection({
        rank: 77,
        ru: 'кни́жка',
        en: 'book',
        pos: 'NOUN',
        level: 'A1',
        gender: 'f',
        animacy: 'inanimate'
    });
    assert.notEqual(corr.wrongWord, corr.rightWord);
    assert.ok(!/\bpugh\b|\bpress\b|§/i.test(corr.explanation));
});

test('5. Course Curriculum (29 modules A0.1-C1.1): structure, dialogues, recall prompts, audio matching, varied answer indices', () => {
    assert.equal(COURSE_MODULES.length, 29, 'Expected 29 CEFR modules from A0.1 to C1.1 (including A2.4, A2.5, B1.4, B1.5, B1.6, B1.7, B1.8, B1.9, B1.10, B2.2, B2.3, B2.4, and B2.5)');

    const cfuAnswerIndices = new Set<number>();
    const examAnswerIndices = new Set<number>();

    for (const mod of COURSE_MODULES) {
        assert.ok(mod.objectives.length >= 2, `Module ${mod.id} should have at least 2 learning objectives`);
        assert.ok(mod.rules && mod.rules.length >= 3, `Module ${mod.id} should have at least 3 step-by-step core concepts`);
        for (const r of mod.rules) {
            assert.ok(r && r.trim().length > 10, `Module ${mod.id} has an empty core concept rule`);
        }
        assert.ok(mod.dialogue && mod.dialogue.lines.length >= 2, `Module ${mod.id} should have a real-life dialogue`);
        assert.ok(mod.activeRecall && mod.activeRecall.length >= 2, `Module ${mod.id} should have active recall prompts`);
        for (const ar of mod.activeRecall) {
            assert.ok(ar.answerUk && /[А-ЯҐЄІЇа-яґєії]/.test(ar.answerUk), `Module ${mod.id} activeRecall answerUk must be Ukrainian Cyrillic, got: ${ar.answerUk}`);
        }
        assert.ok(mod.cfu.length >= 2, `Module ${mod.id} should have at least 2 CFU questions`);
        assert.ok(mod.practice.length >= 3, `Module ${mod.id} should have at least 3 practice drills`);
        for (const pr of mod.practice) {
            assert.ok(pr.audioUk && pr.audioUk !== 'undefined' && /[А-ЯҐЄІЇа-яґєії]/.test(pr.audioUk), `Module ${mod.id} practice item missing valid Ukrainian audioUk: ${pr.q}`);
        }
        for (const [uk, pos, en, exUk, exEn] of mod.vocab) {
            const gData = generateGrammarBreakdown({
                rank: 0,
                ru: uk,
                en,
                pos,
                level: mod.level,
                exampleUk: exUk,
                exampleEn: exEn
            });
            assert.equal(gData.exampleRu, exUk, `Module ${mod.id} vocab ${uk} exampleRu mismatch`);
            assert.equal(gData.exampleEn, exEn, `Module ${mod.id} vocab ${uk} exampleEn mismatch`);
            assert.ok(gData.spokenSummary.includes(exUk || ''), `Module ${mod.id} vocab ${uk} spokenSummary does not include its exact card example '${exUk}'`);
        }
        assert.equal(mod.exam.length, 6, `Module ${mod.id} should have 6 mastery exam questions`);

        for (const q of mod.cfu) {
            assert.ok(q.ans >= 0 && q.ans < q.opts.length, `Invalid CFU answer index in ${mod.id}`);
            cfuAnswerIndices.add(q.ans);
        }
        for (const q of mod.exam) {
            assert.ok(q.ans >= 0 && q.ans < q.opts.length, `Invalid Exam answer index in ${mod.id}`);
            examAnswerIndices.add(q.ans);
        }
    }

    assert.ok(cfuAnswerIndices.has(0) && cfuAnswerIndices.has(1) && cfuAnswerIndices.has(2), 'CFU correct answers must vary across indices 0, 1, and 2');
    assert.ok(examAnswerIndices.has(0) && examAnswerIndices.has(1) && examAnswerIndices.has(2), 'Exam correct answers must vary across indices 0, 1, and 2');
});

test('6. Graded Comprehensible Reader: 52 passages across CEFR levels A0 to B2-C1 with glossaries and comprehension checks', () => {
    assert.equal(READER_PASSAGES.length, 52, 'Expected 52 graded reader passages');
    const levels: Array<'A0' | 'A1' | 'A2' | 'B1' | 'B2–C1'> = ['A0', 'A1', 'A2', 'B1', 'B2–C1'];
    for (const lvl of levels) {
        const count = READER_PASSAGES.filter((p) => p.level === lvl).length;
        assert.ok(count >= 6, `Expected at least 6 passages for CEFR level ${lvl}, found ${count}`);
    }
    const answerIndices = new Set<number>();
    for (const p of READER_PASSAGES) {
        assert.ok(p.sentences.length >= 4, `Passage ${p.id} should have at least 4 coherent sentences`);
        assert.ok(Object.keys(p.glossary).length >= 5, `Passage ${p.id} should have a word glossary`);
        assert.ok(p.questions.length >= 3, `Passage ${p.id} should have comprehension questions`);
        for (const q of p.questions) {
            answerIndices.add(q.ans);
        }
    }
    assert.ok(answerIndices.has(0) && answerIndices.has(1) && answerIndices.has(2), 'Reader quiz answers must vary across indices 0, 1, 2');
});

test('7. Everyday Vocabulary & Memory Lab: 27 categories, tolerant Ukrainian answer validation, and multi-modal exercise sets', () => {
    assert.equal(EVERYDAY_CATEGORIES.length, 27, 'Expected 27 practical everyday vocabulary categories');
    for (const cat of EVERYDAY_CATEGORIES) {
        const items = getCategoryVocabItems(cat.id);
        assert.ok(items.length >= 5, `Category ${cat.id} (${cat.title}) should have at least 5 mapped vocabulary items, got ${items.length}`);
    }

    // Verify tolerant Ukrainian validation (stress marks, capitalization, apostrophe normalization)
    const res1 = validateUkrainianAnswer('кам’яний', 'кам’яни́й');
    assert.equal(res1.isCorrect, true, 'Expected unstressed input to be accepted');
    const res2 = validateUkrainianAnswer("КАМ'ЯНИЙ", 'кам’яни́й');
    assert.equal(res2.isCorrect, true, 'Expected uppercase and straight apostrophe to be normalized and accepted');
    const resWrongEnding = validateUkrainianAnswer('мамин', 'ма́мина');
    assert.equal(resWrongEnding.isCorrect, false, 'Expected gender ending mismatch to be marked incorrect');
    assert.ok(resWrongEnding.feedbackMessage.includes('ending'), 'Expected specific ending feedback on inflection mismatch');

    assert.ok(FILL_BLANK_EXERCISES.length >= 52, 'Expected at least 52 fill-in-the-blank exercises');
    assert.ok(SENTENCE_CONSTRUCTION_EXERCISES.length >= 37, 'Expected at least 37 sentence construction exercises');
    assert.ok(CONTEXTUAL_CHOICE_EXERCISES.length >= 37, 'Expected at least 37 contextual choice exercises');
    assert.ok(GRAMMAR_AWARE_EXERCISES.length >= 37, 'Expected at least 37 grammar-aware exercises');
});

test('8. Visual Course Redesign (All 29 Modules A0.1–C1.1): structuredLesson sections, visual components, and zero Module Title placeholders', async () => {
    const {
        renderGrammarTable,
        renderGrammarDiagram,
        renderLessonReference,
        renderExampleBreakdown,
        renderRuleAndException,
        renderCommonMistake,
        renderKnowledgeCheck
    } = await import('../courseVisualComponents.ts');

    for (const mod of COURSE_MODULES) {
        assert.ok(mod.structuredLesson, `Expected module ${mod.id} (${mod.title}) to have a structuredLesson`);
        const sl = mod.structuredLesson;
        assert.ok(sl.bigIdea && sl.bigIdea.headline && sl.bigIdea.plainEnglish, `Module ${mod.id} missing bigIdea`);
        assert.ok(sl.seeItInAction && sl.seeItInAction.length >= 2, `Module ${mod.id} should have at least 2 seeItInAction examples`);
        assert.ok(sl.patternTables && sl.patternTables.length >= 1, `Module ${mod.id} should have at least 1 patternTable`);
        assert.ok(sl.stepByStep && sl.stepByStep.length >= 2, `Module ${mod.id} should have at least 2 stepByStep cards`);
        assert.ok(sl.moreExamples && sl.moreExamples.length >= 1, `Module ${mod.id} should have at least 1 moreExamples group`);
        assert.ok(sl.importantExceptions && sl.importantExceptions.length >= 1, `Module ${mod.id} should have at least 1 importantException`);
        assert.ok(sl.commonMistakes && sl.commonMistakes.length >= 2, `Module ${mod.id} should have at least 2 commonMistakes`);
        assert.ok(sl.embeddedChecks && sl.embeddedChecks.length >= 2, `Module ${mod.id} should have at least 2 embeddedChecks`);
        assert.ok(sl.completeReference && sl.completeReference.sections.length >= 1, `Module ${mod.id} should have completeReference sections`);
        assert.ok(sl.whatToRemember && sl.whatToRemember.length >= 3, `Module ${mod.id} should have at least 3 whatToRemember takeaways`);

        // Verify component rendering for each module's visual data
        assert.ok(renderGrammarTable(sl.patternTables[0]).includes('vc-table'), `Module ${mod.id} patternTable failed to render`);
        assert.ok(renderExampleBreakdown(sl.seeItInAction[0]).includes('vc-example-card'), `Module ${mod.id} seeItInAction failed to render`);
        assert.ok(renderRuleAndException(sl.stepByStep[0]).includes('vc-rule-card'), `Module ${mod.id} stepByStep failed to render`);
        assert.ok(renderCommonMistake(sl.commonMistakes[0]).includes('vc-mistake-card'), `Module ${mod.id} commonMistake failed to render`);
        assert.ok(renderLessonReference(sl.completeReference).includes('vc-reference-details'), `Module ${mod.id} completeReference failed to render`);
        assert.ok(renderKnowledgeCheck(sl.embeddedChecks[0], mod.id).includes('vc-kc-card'), `Module ${mod.id} embeddedCheck failed to render`);
    }

    const a01 = COURSE_MODULES.find((m) => m.id === 'A0.1')!;
    const sl = a01.structuredLesson!;
    const tableHtml = renderGrammarTable(sl.patternTables[0]);
    assert.ok(tableHtml.includes('ма́ма') && tableHtml.includes('vc-table'), 'Expected GrammarTable to render ма́ма');

    const diagramHtml = renderGrammarDiagram(sl.diagrams![1]);
    assert.ok(diagramHtml.includes('svg') && diagramHtml.includes('Це ка́ва?'), 'Expected Intonation Diagram to render SVG contour and Це ка́ва?');

    const refHtml = renderLessonReference(sl.completeReference);
    assert.ok(refHtml.includes('село́') && refHtml.includes('голу́бка'), 'Expected Complete Reference to preserve unstressed vowel harmony examples');

    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    assert.equal(indexHtml.includes('>Module Title<'), false, 'index.html must not contain static >Module Title< placeholder');

    const progressJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'course_rewrite_progress.json'), 'utf8'));
    assert.equal(progressJson.totalModules, 29);
    assert.equal(progressJson.completedModulesCount, 29);
    assert.equal(progressJson.remainingModulesCount, 0);
    assert.equal(progressJson.completedModules.length, 29);
});

test('9. Identify Visual Vocabulary Feature: 20 categories, 100 real photographic scenes, hotspot bounds, MC generator, Fill-in-Blank validator, and Show Answer tracking', async () => {
    const { IDENTIFY_CATEGORIES, renderIdentifySceneSvgDataUri } = await import('../identifyData.ts');
    const {
        generateIdentifyMultipleChoiceOptions,
        validateIdentifyTypedAnswer,
        createDefaultIdentifyProgress,
        recordIdentifyAttempt,
        recordIdentifyShowAnswer,
        computeIdentifySceneSummary,
        normalizeIdentifyUk
    } = await import('../identifyEngine.ts');

    assert.equal(IDENTIFY_CATEGORIES.length, 20, 'Expected 20 everyday Identify categories');
    let totalScenes = 0;
    const uniqueAssetPaths = new Set<string>();
    for (const cat of IDENTIFY_CATEGORIES) {
        assert.equal(cat.scenes.length, 5, `Category ${cat.id} must have 5 unique scenes`);
        for (const sc of cat.scenes) {
            totalScenes++;
            assert.ok(sc.targets.length >= 6 && sc.targets.length <= 12, `Scene ${sc.id} must have 6–12 targets, got ${sc.targets.length}`);
            assert.equal(sc.assetSourceType, 'photograph', `Scene ${sc.id} must use photograph assetSourceType`);
            const assetUri = renderIdentifySceneSvgDataUri(sc);
            assert.ok(assetUri.startsWith(`/assets/identify/${cat.id}/`) && assetUri.endsWith('.webp'), `Scene ${sc.id} must point to a real .webp photograph asset, got ${assetUri}`);
            assert.equal(assetUri.includes('linearGradient'), false, `Scene ${sc.id} must not use gradient backgrounds`);
            uniqueAssetPaths.add(assetUri);

            const diskPath = path.join(process.cwd(), 'public', assetUri);
            assert.ok(fs.existsSync(diskPath), `Photograph file missing on disk for ${sc.id}: ${diskPath}`);
            const stat = fs.statSync(diskPath);
            assert.ok(stat.size > 5000, `Photograph file for ${sc.id} is too small (${stat.size} bytes)`);

            for (const t of sc.targets) {
                assert.ok(t.x >= 0 && t.x <= 1 && t.y >= 0 && t.y <= 1, `Invalid normalized x/y in ${t.id}`);
                assert.ok(t.width > 0 && t.x + t.width <= 1.01, `Invalid normalized width in ${t.id}`);
                assert.ok(t.height > 0 && t.y + t.height <= 1.01, `Invalid normalized height in ${t.id}`);
                assert.ok(t.uk.length > 0 && t.en.length > 0, `Missing uk/en in ${t.id}`);
                assert.ok(t.exampleUk.length > 5 && t.exampleEn.length > 5, `Missing example sentence in ${t.id}`);

                const opts = generateIdentifyMultipleChoiceOptions(t, cat);
                assert.equal(opts.length, 4, `Expected 4 MC options for ${t.id}`);
                assert.ok(opts.includes(t.uk), `MC options must contain correct answer ${t.uk}`);
                const uniqueNorm = new Set(opts.map(normalizeIdentifyUk));
                assert.equal(uniqueNorm.size, 4, `MC options must be 4 distinct words for ${t.id}`);
            }
        }
    }
    assert.equal(uniqueAssetPaths.size, 100, 'Expected 100 distinct photographic asset paths across all 100 scenes');
    assert.equal(totalScenes, 100, 'Expected 100 total scenes across 20 categories');

    // Verify Fill-in-the-Blank normalization, synonyms, and Ukrainian letter checks
    const sinkTarget = IDENTIFY_CATEGORIES[0].scenes[0].targets.find((t) => t.vocabularyId === 'k-sink')!;
    assert.equal(validateIdentifyTypedAnswer('мийка', sinkTarget).isCorrect, true, 'Should accept unstressed мийка');
    assert.equal(validateIdentifyTypedAnswer('  МИ́ЙКА ', sinkTarget).isCorrect, true, 'Should accept stressed uppercase with spaces');
    assert.equal(validateIdentifyTypedAnswer('раковина', sinkTarget).isCorrect, true, 'Should accept valid synonym раковина');

    const fridgeTarget = IDENTIFY_CATEGORIES[0].scenes[0].targets.find((t) => t.vocabularyId === 'k-fridge')!;
    const letterConf = validateIdentifyTypedAnswer('холодільнік', fridgeTarget);
    assert.equal(letterConf.isCorrect, false, 'Should reject и/і letter confusion');
    assert.equal(letterConf.errorType, 'ukrainian-letter-confusion');

    // Verify Show Answer tracking never counts as independent mastery
    const prog = createDefaultIdentifyProgress();
    const kitchenScene1 = IDENTIFY_CATEGORIES[0].scenes[0];
    recordIdentifyShowAnswer(prog, kitchenScene1, fridgeTarget);
    recordIdentifyAttempt(prog, kitchenScene1, sinkTarget, 'mc', true, sinkTarget.uk, 'ok');

    const summary = computeIdentifySceneSummary(prog, kitchenScene1);
    assert.equal(summary.revealedCount, 1, 'Expected 1 revealed target');
    assert.equal(summary.correctMCCount, 1, 'Expected 1 correct MC target (Show Answer must not increment correctMCCount)');
    assert.ok(summary.needsPracticeTargets.some((t) => t.id === fridgeTarget.id), 'Revealed target must be included in needsPracticeTargets');

    const progressRecord = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'identify_implementation_progress.json'), 'utf8'));
    assert.equal(progressRecord.totals.categoriesDefined, 20);
    assert.equal(progressRecord.totals.totalScenesDefined, 100);
});


