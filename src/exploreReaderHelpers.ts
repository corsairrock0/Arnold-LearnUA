import type { ReaderGlossaryEntry, ReaderPassage } from './readerData';
import type { VocabItem } from './vocabData';

export interface PlainLevelInfo {
  code: string;
  title: string;
  label: string;
}

export interface StoryReadingMeta {
  sentenceCount: number;
  wordCount: number;
  minutes: number;
  readTimeLabel: string;
}

export interface ResolvedReaderWord {
  surfaceUk: string;
  lemmaUk: string;
  posLabel: string;
  synthPos: string;
  englishMeaning: string;
  contextNote: string;
  matchedRank: number | null;
  levelInfo: PlainLevelInfo;
  inReviews: boolean;
}

const PLAIN_LEVEL_MAP: Record<string, { code: string; title: string }> = {
  A0: { code: 'A0', title: 'First steps' },
  A1: { code: 'A1', title: 'Beginner' },
  A2: { code: 'A2', title: 'Elementary' },
  B1: { code: 'B1', title: 'Intermediate' },
  B2: { code: 'B2', title: 'Upper-intermediate' },
  'B2–C1': { code: 'B2–C1', title: 'Advanced' },
  'B2-C1': { code: 'B2–C1', title: 'Advanced' },
  C1: { code: 'C1', title: 'Advanced' },
};

export function formatPlainLevelBadge(rawLevel: string): PlainLevelInfo {
  const key = String(rawLevel || 'A1').trim().toUpperCase();
  const entry = PLAIN_LEVEL_MAP[key] || { code: key || 'A1', title: 'Learner' };
  return {
    code: entry.code,
    title: entry.title,
    label: `Level ${entry.code} · ${entry.title}`,
  };
}

export function formatCleanSummaryTag(rawTag: string): string {
  const parts = String(rawTag || '')
    .split(/[•·]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return parts[0] || '';
  const deduped: string[] = [];
  for (const seg of parts) {
    const prev = deduped[deduped.length - 1];
    if (!prev) {
      deduped.push(seg);
      continue;
    }
    const prevLower = prev.toLowerCase();
    const segLower = seg.toLowerCase();
    if (segLower === prevLower) {
      continue;
    }
    if (segLower.startsWith(prevLower)) {
      deduped[deduped.length - 1] = seg;
      continue;
    }
    deduped.push(seg);
  }
  return deduped.join(' · ');
}

export function estimateStoryReadingMeta(
  sentences: ReadonlyArray<{ uk: string; en: string }>
): StoryReadingMeta {
  const sentenceCount = sentences.length;
  let wordCount = 0;
  for (const s of sentences) {
    const tokens = String(s.uk || '')
      .trim()
      .split(/\s+/)
      .filter((tok) => /[а-яА-ЯіїєґІЇЄҐ]/.test(tok));
    wordCount += tokens.length;
  }
  const minutes = Math.max(1, Math.round(wordCount / 90));
  return {
    sentenceCount,
    wordCount,
    minutes,
    readTimeLabel: `~${minutes} min read`,
  };
}

export function normalizeUkLookupKey(raw: string): string {
  return String(raw || '')
    .replace(/[«»"“”.,!?;:—()[\]]/g, '')
    .replace(/\u0301/g, '')
    .replace(/[’ʼ`]/g, "'")
    .toLowerCase()
    .trim();
}

function inferSynthPos(posRaw: string): string {
  const upper = String(posRaw || '').toUpperCase();
  if (upper.includes('VERB')) {
    return upper.includes('PF') || (upper.includes('PERF') && !upper.includes('IMPERF'))
      ? 'VERB (pf)'
      : 'VERB';
  }
  if (upper.includes('ADJ')) return 'ADJ';
  if (upper.includes('PRON')) return 'PRON';
  if (upper.includes('PREP')) return 'PREP';
  if (upper.includes('ADV')) return 'ADV';
  if (upper.includes('CONJ')) return 'CONJ';
  if (upper.includes('PART')) return 'PART';
  if (upper.includes('NUM')) return 'NUM';
  if (upper.includes('INTJ') || upper.includes('PHRASE') || upper.includes('EXPR')) {
    return 'PHRASE';
  }
  return 'NOUN';
}

function formatReadablePos(posRaw: string): string {
  const trimmed = String(posRaw || '').trim();
  if (!trimmed) return 'Ukrainian word';
  const upper = trimmed.toUpperCase();
  if (upper === 'NOUN') return 'Noun';
  if (upper === 'VERB') return 'Verb';
  if (upper === 'VERB (PF)') return 'Perfective verb';
  if (upper === 'ADJ') return 'Adjective';
  if (upper === 'ADV') return 'Adverb';
  if (upper === 'PRON') return 'Pronoun';
  if (upper === 'PREP') return 'Preposition';
  if (upper === 'CONJ') return 'Conjunction';
  if (upper === 'NUM') return 'Numeral';
  if (upper === 'PART') return 'Particle';
  if (upper === 'INTJ') return 'Interjection';
  return trimmed;
}

const INFLECTION_SUFFIXES = [
  'ові',
  'еві',
  'єві',
  'ами',
  'ями',
  'ому',
  'ьому',
  'ими',
  'іми',
  'ать',
  'ють',
  'ить',
  'їть',
  'емо',
  'ємо',
  'ите',
  'їте',
  'ла',
  'ло',
  'ли',
  'ів',
  'їв',
  'ей',
  'ам',
  'ям',
  'ах',
  'ях',
  'ом',
  'ем',
  'єм',
  'ою',
  'ею',
  'єю',
  'ій',
  'ий',
  'а',
  'я',
  'у',
  'ю',
  'і',
  'ї',
  'и',
  'о',
  'е',
];

const VALID_LEMMA_ENDINGS = new Set([
  '',
  'а',
  'я',
  'о',
  'е',
  'і',
  'и',
  'ь',
  'ий',
  'ій',
  'ти',
  'тися',
]);

function findVocabMatch(
  cleanSurface: string,
  cleanLemma: string,
  hasGlossaryLemma: boolean,
  freqDb: ReadonlyArray<VocabItem>
): VocabItem | undefined {
  // 1. Exact lemma or surface match
  for (const w of freqDb) {
    const key = normalizeUkLookupKey(w.ru);
    if (key === cleanLemma || key === cleanSurface) {
      return w;
    }
  }

  // If the story glossary already gave an authoritative lemma (e.g. Украї́ни -> Украї́на),
  // never guess a derivational stem neighbor like україніст.
  if (hasGlossaryLemma) {
    return undefined;
  }

  // 2. Conservative inflection-stem match for inflected non-glossary story words >= 4 chars
  if (cleanSurface.length < 4) return undefined;

  const candidateStems = new Set<string>();
  for (const suf of INFLECTION_SUFFIXES) {
    if (cleanSurface.endsWith(suf) && cleanSurface.length - suf.length >= 3) {
      candidateStems.add(cleanSurface.slice(0, -suf.length));
    }
  }
  if (candidateStems.size === 0) return undefined;

  for (const w of freqDb) {
    const wKey = normalizeUkLookupKey(w.ru);
    if (candidateStems.has(wKey)) {
      return w;
    }
    for (const stem of candidateStems) {
      if (stem.length >= 4 && wKey.startsWith(stem)) {
        const ending = wKey.slice(stem.length);
        if (VALID_LEMMA_ENDINGS.has(ending)) {
          return w;
        }
      }
    }
  }
  return undefined;
}

function lookupPassageGlossary(
  cleanKey: string,
  rawWord: string,
  glossary: ReaderPassage['glossary']
): ReaderGlossaryEntry | undefined {
  if (!glossary) return undefined;
  const curlyKey = cleanKey.replace(/'/g, '’');
  const rawEntry =
    glossary[cleanKey] ??
    glossary[curlyKey] ??
    Object.entries(glossary).find(
      ([k]) => normalizeUkLookupKey(k) === cleanKey
    )?.[1];

  if (!rawEntry) return undefined;
  if (typeof rawEntry === 'string') {
    return {
      surface: rawWord,
      lemma: rawWord,
      pos: 'Word in context',
      en: rawEntry,
      note: '',
    };
  }
  return rawEntry;
}

export function resolveReaderWordLookup(
  rawWord: string,
  passage: ReaderPassage,
  freqDb: ReadonlyArray<VocabItem>,
  deckRanks: ReadonlySet<number>
): ResolvedReaderWord {
  const cleanSurface = normalizeUkLookupKey(rawWord);
  const gloss = lookupPassageGlossary(cleanSurface, rawWord, passage.glossary);
  const cleanLemma = gloss
    ? normalizeUkLookupKey(gloss.lemma)
    : cleanSurface;

  const matched = findVocabMatch(
    cleanSurface,
    cleanLemma,
    Boolean(gloss),
    freqDb
  );

  const surfaceUk =
    gloss?.surface ||
    rawWord.replace(/^[«»"“”()]+|[«»"“”.,!?;:()]+$/g, '') ||
    rawWord;
  const lemmaUk = gloss?.lemma || matched?.ru || surfaceUk;
  const posLabel = formatReadablePos(gloss?.pos || matched?.pos || '');
  const synthPos = inferSynthPos(gloss?.pos || matched?.pos || 'NOUN');
  const englishMeaning =
    gloss?.en ||
    matched?.en ||
    'Tap Listen or open full Word forms to explore this word in context';
  const contextNote =
    gloss?.note ||
    (matched?.exUk
      ? `${matched.exUk}${matched.exEn ? ` — ${matched.exEn}` : ''}`
      : '');
  const matchedRank = matched ? matched.rank : null;
  const levelInfo = formatPlainLevelBadge(matched?.level || passage.level);
  const inReviews = matchedRank !== null ? deckRanks.has(matchedRank) : false;

  return {
    surfaceUk,
    lemmaUk,
    posLabel,
    synthPos,
    englishMeaning,
    contextNote,
    matchedRank,
    levelInfo,
    inReviews,
  };
}
