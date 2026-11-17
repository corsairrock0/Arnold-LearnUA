import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateStoryReadingMeta,
  formatCleanSummaryTag,
  formatPlainLevelBadge,
  normalizeUkLookupKey,
  resolveReaderWordLookup,
} from '../exploreReaderHelpers';
import type { ReaderPassage } from '../readerData';
import type { VocabItem } from '../vocabData';

const SAMPLE_FREQ_DB: VocabItem[] = [
  {
    rank: 12,
    ru: 'ка́ва',
    en: 'coffee',
    pos: 'NOUN',
    level: 'A1',
    exUk: 'Гаря́ча ка́ва на столі́.',
    exEn: 'Hot coffee on the table.',
  },
  {
    rank: 45,
    ru: 'стіл',
    en: 'table / desk',
    pos: 'NOUN',
    level: 'A1',
  },
  {
    rank: 88,
    ru: 'круаса́н',
    en: 'croissant',
    pos: 'NOUN',
    level: 'A1',
  },
  {
    rank: 140,
    ru: 'кни́жка',
    en: 'book',
    pos: 'NOUN',
    level: 'A1',
  },
  {
    rank: 4990,
    ru: 'україні́ст',
    en: 'Ukrainian studies scholar',
    pos: 'NOUN',
    level: 'C1',
  },
];

const SAMPLE_PASSAGE: ReaderPassage = {
  id: 'A0-cafe',
  level: 'A0',
  titleUk: 'Ра́нок і ка́ва в Ки́єві',
  titleEn: 'Morning and Coffee in Kyiv',
  genre: 'Pre-A1 Micro-Story • Everyday Greetings & Café',
  summaryEn: 'A gentle first Ukrainian reading passage.',
  sentences: [
    {
      uk: 'Приві́т! Мене́ зва́ти Оле́на, і я з Украї́ни.',
      en: 'Hello! My name is Olena, and I am from Ukraine.',
    },
    {
      uk: 'Ось мій стіл, гаря́ча ка́ва і сві́жий круаса́н.',
      en: 'Here are my table, hot coffee, and a fresh croissant.',
    },
  ],
  glossary: {
    "кав’ярні": {
      surface: 'кав’я́рні',
      lemma: 'кав’я́рня',
      pos: 'noun (fem. Loc.)',
      en: 'in a coffee shop',
      note: 'Locative singular after "у" (in).',
    },
    кава: {
      surface: 'ка́ва',
      lemma: 'ка́ва',
      pos: 'noun (fem. Nom.)',
      en: 'coffee',
      note: 'Feminine noun ending in -а.',
    },
    україни: {
      surface: 'Украї́ни',
      lemma: 'Украї́на',
      pos: 'noun (fem. Gen.)',
      en: 'of Ukraine / from Ukraine',
      note: 'Genitive singular after "з" (from).',
    },
  },
  questions: [],
};

test('formatPlainLevelBadge converts CEFR codes into plain learner labels while keeping the code', () => {
  const a0 = formatPlainLevelBadge('A0');
  assert.equal(a0.code, 'A0');
  assert.equal(a0.title, 'First steps');
  assert.equal(a0.label, 'Level A0 · First steps');

  const b2c1 = formatPlainLevelBadge('B2–C1');
  assert.equal(b2c1.code, 'B2–C1');
  assert.equal(b2c1.label, 'Level B2–C1 · Advanced');
});

test('estimateStoryReadingMeta counts Ukrainian words and estimates calm reading minutes', () => {
  const meta = estimateStoryReadingMeta(SAMPLE_PASSAGE.sentences);
  assert.equal(meta.sentenceCount, 2);
  assert.equal(meta.wordCount, 16);
  assert.equal(meta.minutes, 1);
  assert.equal(meta.readTimeLabel, '~1 min read');
});

test('normalizeUkLookupKey strips stress marks, punctuation, and unifies apostrophes', () => {
  assert.equal(normalizeUkLookupKey('«Кав’я́рні!»'), "кав'ярні");
  assert.equal(normalizeUkLookupKey("кав'я́рні,"), "кав'ярні");
});

test('resolveReaderWordLookup combines story glossary, frequency rank, and inReviews state', () => {
  const deck = new Set<number>([12]);
  const res = resolveReaderWordLookup('ка́ва,', SAMPLE_PASSAGE, SAMPLE_FREQ_DB, deck);
  assert.equal(res.lemmaUk, 'ка́ва');
  assert.equal(res.englishMeaning, 'coffee');
  assert.equal(res.matchedRank, 12);
  assert.equal(res.inReviews, true);
  assert.equal(res.levelInfo.label, 'Level A1 · Beginner');
});

test('resolveReaderWordLookup resolves apostrophe glossary keys and inflected stem fallbacks', () => {
  const deck = new Set<number>();
  const cafeRes = resolveReaderWordLookup("кав'я́рні", SAMPLE_PASSAGE, SAMPLE_FREQ_DB, deck);
  assert.equal(cafeRes.englishMeaning, 'in a coffee shop');
  assert.equal(cafeRes.lemmaUk, 'кав’я́рня');
  assert.equal(cafeRes.inReviews, false);

  // Inflected noun not in passage.glossary ('кни́жку' -> stem 'книжк' -> 'кни́жка' rank 140)
  const bookRes = resolveReaderWordLookup('кни́жку', SAMPLE_PASSAGE, SAMPLE_FREQ_DB, deck);
  assert.equal(bookRes.matchedRank, 140);
  assert.equal(bookRes.lemmaUk, 'кни́жка');
  assert.equal(bookRes.englishMeaning, 'book');
});

test('resolveReaderWordLookup never false-matches derivational stems like україніст and deduplicates summary tags', () => {
  const deck = new Set<number>();
  const ukrRes = resolveReaderWordLookup('Украї́ни.', SAMPLE_PASSAGE, SAMPLE_FREQ_DB, deck);
  assert.equal(ukrRes.lemmaUk, 'Украї́на');
  assert.equal(ukrRes.matchedRank, null);
  assert.equal(ukrRes.synthPos, 'NOUN');

  // Even without a glossary hit, 'українці' must not match derivational -іст ('україніст')
  const nonGlossDeriv = resolveReaderWordLookup('украї́нці', SAMPLE_PASSAGE, SAMPLE_FREQ_DB, deck);
  assert.equal(nonGlossDeriv.matchedRank, null);

  assert.equal(
    formatCleanSummaryTag('Feminine Noun • Feminine Noun (-а / -я pattern)'),
    'Feminine Noun (-а / -я pattern)'
  );
  assert.equal(
    formatCleanSummaryTag('Masculine Noun • Masculine Noun'),
    'Masculine Noun'
  );
});
