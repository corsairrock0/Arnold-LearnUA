import type { CourseModule, CourseVocabTuple } from '../courseTypes';
import { MODULE_VOCAB_ADDITIONS_A0_A2 } from './moduleVocabAdditionsA0A2';
import { MODULE_VOCAB_ADDITIONS_B1 } from './moduleVocabAdditionsB1';
import { MODULE_VOCAB_ADDITIONS_B2_C1 } from './moduleVocabAdditionsB2C1';

export const MODULE_VOCAB_ADDITIONS: Record<string, CourseVocabTuple[]> = {
  ...MODULE_VOCAB_ADDITIONS_A0_A2,
  ...MODULE_VOCAB_ADDITIONS_B1,
  ...MODULE_VOCAB_ADDITIONS_B2_C1,
};

function normalizeLemmaKey(uk: string): string {
  return uk
    .replace(/\u0301/g, '')
    .toLowerCase()
    .replace(/\s*\(.*?\)/g, '')
    .split(/\s*[\/,]\s*/)[0]
    .trim();
}

/**
 * Preserves 100% of existing module vocabulary entries in their original order
 * and appends the verified module-specific vocabulary expansion entries without
 * creating internal duplicate lemmas.
 */
export function applyExpandedVocabToModule(mod: CourseModule): CourseModule {
  const additions = MODULE_VOCAB_ADDITIONS[mod.id];
  if (!additions || additions.length === 0) {
    return mod;
  }

  const seenLemmas = new Set<string>();
  const combined: CourseVocabTuple[] = [];

  for (const entry of mod.vocab) {
    combined.push(entry);
    seenLemmas.add(normalizeLemmaKey(entry[0]));
  }

  for (const entry of additions) {
    const key = normalizeLemmaKey(entry[0]);
    if (!seenLemmas.has(key)) {
      seenLemmas.add(key);
      combined.push(entry);
    }
  }

  return {
    ...mod,
    vocab: combined,
  };
}
