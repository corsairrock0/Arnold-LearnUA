import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  auditThemeContrastPairs,
  clearAllFocusTrapsForTesting,
  computeWcagContrastRatio,
  getActiveTrappedContainerId,
  handleFocusTrapKeydown,
  releaseFocusTrap,
  trapFocusInModal,
  type FocusableLike,
  type FocusContainerLike,
} from '../a11yHelpers';

function makeMockButton(
  name: string,
  opts?: { disabled?: boolean; hidden?: boolean }
): FocusableLike & { name: string; focusedCount: number } {
  return {
    name,
    focusedCount: 0,
    disabled: Boolean(opts?.disabled),
    focus() {
      this.focusedCount += 1;
    },
    hasAttribute(attr: string) {
      return attr === 'disabled' && Boolean(opts?.disabled);
    },
    getAttribute(attr: string) {
      if (attr === 'aria-hidden' && opts?.hidden) return 'true';
      return null;
    },
    getClientRects() {
      return { length: opts?.hidden ? 0 : 1 };
    },
  };
}

test('Phase 6 WCAG AA audit: all 36 Light & Dark semantic token pairs achieve >= 4.5:1 contrast', () => {
  const auditResults = auditThemeContrastPairs();
  assert.equal(auditResults.length, 36);
  for (const r of auditResults) {
    assert.ok(
      r.passes,
      `[${r.theme}] ${r.label} failed WCAG AA: ${r.ratio}:1 < ${r.minRequired}:1 (${r.fgToken} on ${r.bgToken})`
    );
  }
});

test('Phase 6 WCAG contrast calculator matches pure black/white 21:1 baseline', () => {
  const ratio = computeWcagContrastRatio('oklch(0 0 0)', 'oklch(1 0 0)');
  assert.equal(ratio, 21);
});

test('Phase 6 Focus Trap cycles Tab and Shift+Tab within modal and restores focus on release', () => {
  clearAllFocusTrapsForTesting();
  const triggerBtn = makeMockButton('open-settings');
  const firstBtn = makeMockButton('done-btn');
  const disabledBtn = makeMockButton('disabled-btn', { disabled: true });
  const hiddenBtn = makeMockButton('hidden-btn', { hidden: true });
  const lastBtn = makeMockButton('docker-btn');

  const container: FocusContainerLike & { id: string } = {
    id: 'lango-settings-modal',
    querySelectorAll() {
      return [firstBtn, disabledBtn, hiddenBtn, lastBtn];
    },
  };

  trapFocusInModal(container, triggerBtn);
  assert.equal(getActiveTrappedContainerId(), 'lango-settings-modal');
  assert.equal(firstBtn.focusedCount, 1);

  let prevented = false;
  const wrappedToFirst = handleFocusTrapKeydown(
    {
      key: 'Tab',
      shiftKey: false,
      preventDefault() {
        prevented = true;
      },
    },
    container,
    lastBtn
  );
  assert.equal(prevented, true);
  assert.equal(wrappedToFirst, firstBtn);
  assert.equal(firstBtn.focusedCount, 2);

  prevented = false;
  const wrappedToLast = handleFocusTrapKeydown(
    {
      key: 'Tab',
      shiftKey: true,
      preventDefault() {
        prevented = true;
      },
    },
    container,
    firstBtn
  );
  assert.equal(prevented, true);
  assert.equal(wrappedToLast, lastBtn);
  assert.equal(lastBtn.focusedCount, 1);

  releaseFocusTrap('lango-settings-modal', true);
  assert.equal(getActiveTrappedContainerId(), null);
  assert.equal(triggerBtn.focusedCount, 1);
});

test('Phase 6 Inline Style Discipline: zero inline style attributes in index.html, main.ts, morphologyAndPhonetics.ts, and aiConversationView.ts', () => {
  const repoRoot = path.resolve(process.cwd());
  const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
  const mainTs = fs.readFileSync(path.join(repoRoot, 'src/main.ts'), 'utf8');
  const morphTs = fs.readFileSync(
    path.join(repoRoot, 'src/morphologyAndPhonetics.ts'),
    'utf8'
  );
  const convoTs = fs.readFileSync(
    path.join(repoRoot, 'src/aiConversationView.ts'),
    'utf8'
  );

  assert.equal(
    (indexHtml.match(/\sstyle="/g) || []).length,
    0,
    'index.html should contain 0 inline style attributes'
  );
  assert.equal(
    (mainTs.match(/\sstyle="/g) || []).length,
    0,
    'src/main.ts should contain 0 inline style attributes'
  );
  assert.equal(
    (morphTs.match(/\sstyle="/g) || []).length,
    0,
    'src/morphologyAndPhonetics.ts should contain 0 inline style attributes'
  );
  assert.equal(
    (convoTs.match(/\sstyle="/g) || []).length,
    0,
    'src/aiConversationView.ts should contain 0 inline style attributes'
  );

  // Verify skip link and main landmark tabindex exist in index.html
  assert.ok(
    indexHtml.includes('class="skip-link"'),
    'index.html must include a keyboard skip-to-content link'
  );
  assert.ok(
    indexHtml.includes('id="main-scroll-container" tabindex="-1"'),
    'main scroll container must be programmatically focusable for skip link'
  );
});
