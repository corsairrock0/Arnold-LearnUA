import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_MODULES, RAW_COURSE_MODULES } from '../courseData.ts';
import { MODULE_VOCAB_ADDITIONS } from '../vocab/moduleVocabAdditions.ts';
import { FREQ_6000_DB } from '../vocabData.ts';
import {
  generateUkrainianPhonetics,
  generateGrammarBreakdown,
} from '../morphologyAndPhonetics.ts';

const VALID_POS = new Set([
  'NOUN',
  'VERB',
  'ADJ',
  'ADV',
  'PRON',
  'PREP',
  'CONJ',
  'PART',
  'NUM',
  'PHRASE',
  'INTJ',
  'DET',
  'PRED',
]);

function normalizeLemma(raw: string): string {
  return raw
    .replace(/\u0301/g, '')
    .toLowerCase()
    .replace(/\s*\(.*?\)/g, '')
    .split(/\s*[\/,]\s*/)[0]
    .trim();
}

const ORIGINAL_A01_VOCAB: Array<[string, string, string, string, string]> = [
  ['ма́ма', 'NOUN', 'mom / mother', 'Це моя́ ма́ма.', 'This is my mom.'],
  ['та́то', 'NOUN', 'dad / father', 'Мій та́то вдо́ма.', 'My dad is at home.'],
  ['кіт', 'NOUN', 'cat', 'Ось наш кіт.', 'Here is our cat.'],
  ['дім', 'NOUN', 'house / home', 'Це вели́кий дім.', 'This is a big house.'],
  ['вода́', 'NOUN', 'water', 'Тут є сві́жа вода́.', 'There is fresh water here.'],
  ['молоко́', 'NOUN', 'milk', 'Я люблю́ молоко́.', 'I like milk.'],
  ['ка́ва', 'NOUN', 'coffee', 'Це гаря́ча ка́ва.', 'This is hot coffee.'],
  ['чай', 'NOUN', 'tea', 'Ось зелений чай.', 'Here is green tea.'],
  ['хліб', 'NOUN', 'bread', 'Хліб на столі́.', 'The bread is on the table.'],
  ['ти', 'PRON', 'you (informal singular)', 'Де ти за́раз?', 'Where are you right now?'],
  ['ми', 'PRON', 'we', 'Ми вже тут.', 'We are already here.'],
  ['так', 'PART', 'yes', 'Так, це пра́вда.', 'Yes, that is true.'],
  ['ні', 'PART', 'no', 'Ні, дя́кую.', 'No, thank you.'],
  ['тут', 'ADV', 'here', 'Я живу́ тут.', 'I live here.'],
  ['там', 'ADV', 'there', 'Кав’я́рня там.', 'The coffee shop is over there.'],
];

test('All 29 Course modules preserve 100% of their original vocabulary items in exact order', () => {
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(RAW_COURSE_MODULES.length, 29);

  for (let mIdx = 0; mIdx < COURSE_MODULES.length; mIdx++) {
    const expandedMod = COURSE_MODULES[mIdx];
    const rawMod = RAW_COURSE_MODULES[mIdx];
    assert.equal(expandedMod.id, rawMod.id);

    const origList =
      rawMod.id === 'A0.1' ? ORIGINAL_A01_VOCAB : rawMod.vocab;

    for (let i = 0; i < origList.length; i++) {
      assert.deepEqual(
        expandedMod.vocab[i],
        origList[i],
        `Original vocab item at index ${i} in module ${expandedMod.id} must be preserved untouched`
      );
    }
  }
});

test('Every single one of the 29 Course modules adds at least 50 new unique Ukrainian vocabulary items', () => {
  let totalOriginal = 0;
  let totalNew = 0;
  let totalFinal = 0;

  for (let mIdx = 0; mIdx < COURSE_MODULES.length; mIdx++) {
    const expandedMod = COURSE_MODULES[mIdx];
    const rawMod = RAW_COURSE_MODULES[mIdx];
    const origCount =
      rawMod.id === 'A0.1' ? ORIGINAL_A01_VOCAB.length : rawMod.vocab.length;
    const finalCount = expandedMod.vocab.length;
    const newCount = finalCount - origCount;

    assert.ok(
      newCount >= 50,
      `Module ${expandedMod.id} must add at least 50 new vocabulary items, got ${newCount}`
    );

    if (expandedMod.id !== 'A0.1') {
      const additions = MODULE_VOCAB_ADDITIONS[expandedMod.id];
      assert.ok(
        additions && additions.length >= 50,
        `MODULE_VOCAB_ADDITIONS[${expandedMod.id}] must have at least 50 entries`
      );
      assert.equal(
        newCount,
        additions.length,
        `All ${additions.length} additions for ${expandedMod.id} must be unique and appended`
      );
    }

    totalOriginal += origCount;
    totalNew += newCount;
    totalFinal += finalCount;
  }

  assert.equal(totalOriginal, 287);
  assert.equal(totalNew, 1523);
  assert.equal(totalFinal, 1810);
});

test('Zero internal duplicate lemmas inside any module and zero duplicate newly added lemmas across all 29 modules', () => {
  const allExistingOriginalLemmas = new Map<string, string>();
  for (const rawMod of RAW_COURSE_MODULES) {
    const origList =
      rawMod.id === 'A0.1' ? ORIGINAL_A01_VOCAB : rawMod.vocab;
    for (const [uk] of origList) {
      allExistingOriginalLemmas.set(normalizeLemma(uk), rawMod.id);
    }
  }

  const seenNewlyAddedGlobal = new Map<string, string>();

  for (let mIdx = 0; mIdx < COURSE_MODULES.length; mIdx++) {
    const expandedMod = COURSE_MODULES[mIdx];
    const rawMod = RAW_COURSE_MODULES[mIdx];
    const origCount =
      rawMod.id === 'A0.1' ? ORIGINAL_A01_VOCAB.length : rawMod.vocab.length;

    const seenInModule = new Set<string>();
    for (const [uk] of expandedMod.vocab) {
      const lemma = normalizeLemma(uk);
      assert.ok(
        !seenInModule.has(lemma),
        `Internal duplicate lemma "${lemma}" (${uk}) found inside Module ${expandedMod.id}`
      );
      seenInModule.add(lemma);
    }

    const newlyAddedSlice = expandedMod.vocab.slice(origCount);
    for (const [uk] of newlyAddedSlice) {
      const lemma = normalizeLemma(uk);
      assert.ok(
        !allExistingOriginalLemmas.has(lemma),
        `Newly added word "${uk}" in ${expandedMod.id} collides with original vocabulary in module ${allExistingOriginalLemmas.get(lemma)}`
      );
      assert.ok(
        !seenNewlyAddedGlobal.has(lemma),
        `Newly added word "${uk}" in ${expandedMod.id} duplicates newly added word in module ${seenNewlyAddedGlobal.get(lemma)}`
      );
      seenNewlyAddedGlobal.set(lemma, expandedMod.id);
    }
  }

  assert.equal(seenNewlyAddedGlobal.size, 1523);
});

test('All 1,810 vocabulary items across all 29 modules have complete fields, Cyrillic text, phonetics, morphology, and FREQ_6000_DB linkage', () => {
  const freqExactMap = new Map(
    FREQ_6000_DB.map((w) => [w.ru.replace(/\u0301/g, '').toLowerCase().trim(), w])
  );
  const freqLemmaMap = new Map(
    FREQ_6000_DB.map((w) => [normalizeLemma(w.ru), w])
  );

  for (let mIdx = 0; mIdx < COURSE_MODULES.length; mIdx++) {
    const mod = COURSE_MODULES[mIdx];
    const rawMod = RAW_COURSE_MODULES[mIdx];
    const origCount =
      rawMod.id === 'A0.1' ? ORIGINAL_A01_VOCAB.length : rawMod.vocab.length;

    for (let i = 0; i < mod.vocab.length; i++) {
      const [uk, pos, en, exUk, exEn] = mod.vocab[i];
      assert.ok(uk && uk.trim().length > 0, `Empty Ukrainian word in ${mod.id}`);
      assert.ok(
        /[а-яіїєґА-ЯІЇЄҐ]/.test(uk),
        `Ukrainian word "${uk}" in ${mod.id} must contain Cyrillic characters`
      );
      assert.ok(
        pos && pos.trim().length > 0,
        `Missing POS for word "${uk}" in ${mod.id}`
      );
      if (i >= origCount) {
        assert.ok(
          VALID_POS.has(pos),
          `Invalid POS "${pos}" for newly added word "${uk}" in ${mod.id}`
        );
      }
      assert.ok(
        en && en.trim().length > 0,
        `Missing English translation for "${uk}" in ${mod.id}`
      );
      assert.ok(
        exUk && /[а-яіїєґА-ЯІЇЄҐ]/.test(exUk),
        `Missing or non-Cyrillic Ukrainian example sentence for "${uk}" in ${mod.id}`
      );
      assert.ok(
        exEn && /[a-zA-Z]/.test(exEn),
        `Missing English example translation for "${uk}" in ${mod.id}`
      );

      const phon = generateUkrainianPhonetics(uk);
      assert.ok(phon.ipa && phon.ipa.length > 0, `IPA missing for "${uk}" in ${mod.id}`);
      assert.ok(
        phon.plainGuide && phon.plainGuide.length > 0,
        `Plain phonetic guide missing for "${uk}" in ${mod.id}`
      );

      const gram = generateGrammarBreakdown({
        rank: 1,
        ru: uk,
        pos,
        en,
        level: mod.level,
        exampleUk: exUk,
        exampleEn: exEn,
      });
      assert.ok(
        gram.tableHtml && gram.tableHtml.length > 0,
        `Grammar breakdown tableHtml missing for "${uk}" in ${mod.id}`
      );

      const cleanExact = uk.replace(/\u0301/g, '').toLowerCase().trim();
      const lemma = normalizeLemma(uk);
      const matched = freqExactMap.get(cleanExact) || freqLemmaMap.get(lemma);
      assert.ok(
        matched,
        `Word "${uk}" (lemma "${lemma}") in ${mod.id} must be linked in FREQ_6000_DB for FSRS flashcards`
      );
    }
  }
});

test('All 29 Course modules preserve intact assessment counts (20/20/50/100)', () => {
  assert.equal(COURSE_MODULES.length, 29);
  for (const m of COURSE_MODULES) {
    assert.equal(m.structuredLesson?.embeddedChecks.length, 20, `${m.id} inline checks`);
    assert.equal(m.cfu.length, 20, `${m.id} cfu`);
    assert.equal(m.practice.length, 50, `${m.id} practice`);
    assert.equal(m.exam.length, 100, `${m.id} exam`);
  }
});
