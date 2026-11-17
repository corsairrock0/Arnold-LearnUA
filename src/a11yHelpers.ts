// ============================================================================
// PHASE 6 — ACCESSIBILITY (FOCUS TRAP, RESTORATION, ARIA) & WCAG AA CONTRAST
// Pure TypeScript helpers with zero external dependencies.
// ============================================================================

export interface FocusableLike {
  focus: () => void;
  hasAttribute?: (name: string) => boolean;
  getAttribute?: (name: string) => string | null;
  disabled?: boolean;
  tabIndex?: number;
  offsetParent?: unknown;
  getClientRects?: () => { length: number };
}

export interface FocusContainerLike {
  id?: string;
  querySelectorAll: (selector: string) => ArrayLike<FocusableLike>;
  contains?: (node: unknown) => boolean;
}

interface ActiveTrapEntry {
  containerId: string;
  container: FocusContainerLike;
  returnFocusEl: FocusableLike | null;
}

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const activeTrapStack: ActiveTrapEntry[] = [];
let keydownListenerBound = false;

export function isElementFocusableAndVisible(el: FocusableLike): boolean {
  if (!el) return false;
  if (el.disabled) return false;
  if (el.hasAttribute?.('disabled')) return false;
  if (el.getAttribute?.('aria-hidden') === 'true') return false;
  const tabIdxAttr = el.getAttribute?.('tabindex');
  if (tabIdxAttr === '-1' || el.tabIndex === -1) return false;
  if (typeof el.getClientRects === 'function') {
    const rects = el.getClientRects();
    if (rects && rects.length === 0) return false;
  }
  return true;
}

export function getFocusableElements(
  container: FocusContainerLike | null | undefined
): FocusableLike[] {
  if (!container) return [];
  const raw = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  return raw.filter(isElementFocusableAndVisible);
}

export function handleFocusTrapKeydown(
  event: {
    key: string;
    shiftKey?: boolean;
    preventDefault: () => void;
  },
  container: FocusContainerLike,
  activeElement: FocusableLike | null
): FocusableLike | null {
  if (event.key !== 'Tab') return null;
  const focusables = getFocusableElements(container);
  if (focusables.length === 0) {
    event.preventDefault();
    return null;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const currentIdx = activeElement ? focusables.indexOf(activeElement) : -1;

  if (event.shiftKey) {
    if (currentIdx <= 0) {
      event.preventDefault();
      last.focus();
      return last;
    }
    return null;
  }

  if (currentIdx === -1 || currentIdx === focusables.length - 1) {
    event.preventDefault();
    first.focus();
    return first;
  }

  return null;
}

function ensureGlobalTrapKeydownListener(): void {
  if (keydownListenerBound || typeof window === 'undefined') return;
  keydownListenerBound = true;
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || activeTrapStack.length === 0) return;
    const top = activeTrapStack[activeTrapStack.length - 1];
    const activeEl = (
      typeof document !== 'undefined' ? document.activeElement : null
    ) as unknown as FocusableLike | null;
    handleFocusTrapKeydown(e, top.container, activeEl);
  });
}

export function trapFocusInModal(
  containerOrId: string | (FocusContainerLike & { id?: string }),
  explicitTrigger?: FocusableLike | null
): void {
  ensureGlobalTrapKeydownListener();

  let container: FocusContainerLike | null = null;
  let containerId = '';

  if (typeof containerOrId === 'string') {
    containerId = containerOrId;
    if (typeof document !== 'undefined') {
      container = document.getElementById(
        containerOrId
      ) as unknown as FocusContainerLike | null;
    }
  } else if (containerOrId) {
    container = containerOrId;
    containerId = containerOrId.id || 'modal-trap';
  }

  if (!container) return;

  const currentActive =
    explicitTrigger !== undefined
      ? explicitTrigger
      : ((typeof document !== 'undefined'
          ? document.activeElement
          : null) as unknown as FocusableLike | null);

  const existingIdx = activeTrapStack.findIndex(
    (entry) => entry.containerId === containerId
  );
  const preservedReturnEl =
    existingIdx >= 0
      ? activeTrapStack[existingIdx].returnFocusEl
      : currentActive;

  if (existingIdx >= 0) {
    activeTrapStack.splice(existingIdx, 1);
  }

  activeTrapStack.push({
    containerId,
    container,
    returnFocusEl: preservedReturnEl,
  });

  const focusInitial = () => {
    const focusables = getFocusableElements(container!);
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(focusInitial);
  } else {
    focusInitial();
  }
}

export function releaseFocusTrap(
  containerId?: string,
  restoreFocus = true
): void {
  if (activeTrapStack.length === 0) return;

  let removed: ActiveTrapEntry | undefined;
  if (containerId) {
    const idx = activeTrapStack.findIndex(
      (entry) => entry.containerId === containerId
    );
    if (idx === -1) return;
    [removed] = activeTrapStack.splice(idx, 1);
  } else {
    removed = activeTrapStack.pop();
  }

  if (
    restoreFocus &&
    removed?.returnFocusEl &&
    activeTrapStack.length === 0 &&
    typeof removed.returnFocusEl.focus === 'function'
  ) {
    const target = removed.returnFocusEl;
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        if (isElementFocusableAndVisible(target)) {
          target.focus();
        }
      });
    } else if (isElementFocusableAndVisible(target)) {
      target.focus();
    }
  }
}

export function getActiveTrappedContainerId(): string | null {
  if (activeTrapStack.length === 0) return null;
  return activeTrapStack[activeTrapStack.length - 1].containerId;
}

export function clearAllFocusTrapsForTesting(): void {
  activeTrapStack.length = 0;
}

// ============================================================================
// OKLCH -> LINEAR sRGB -> WCAG 2.1 CONTRAST VERIFICATION
// ============================================================================

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export interface RgbColor {
  r: number; // 0..1 sRGB
  g: number; // 0..1 sRGB
  b: number; // 0..1 sRGB
}

export function parseOklchToken(spec: string): OklchColor {
  const match = spec
    .trim()
    .match(
      /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*[0-9.%]+)?\s*\)$/i
    );
  if (!match) {
    throw new Error(`Invalid OKLCH color token: ${spec}`);
  }
  return {
    l: Number(match[1]),
    c: Number(match[2]),
    h: Number(match[3]),
  };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function linearToSrgbChannel(c: number): number {
  const clamped = clamp01(c);
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function srgbChannelToLinear(c: number): number {
  const clamped = clamp01(c);
  return clamped <= 0.04045
    ? clamped / 12.92
    : Math.pow((clamped + 0.055) / 1.055, 2.4);
}

/**
 * Converts an OKLCH color to clamped 0..1 sRGB using the standard OKLab matrices.
 */
export function oklchToSrgb(color: OklchColor): RgbColor {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  const l_ = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = color.l - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    r: linearToSrgbChannel(rLin),
    g: linearToSrgbChannel(gLin),
    b: linearToSrgbChannel(bLin),
  };
}

export function srgbRelativeLuminance(rgb: RgbColor): number {
  const r = srgbChannelToLinear(rgb.r);
  const g = srgbChannelToLinear(rgb.g);
  const b = srgbChannelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function computeWcagContrastRatio(
  fgOklch: string,
  bgOklch: string
): number {
  const fgLum = srgbRelativeLuminance(oklchToSrgb(parseOklchToken(fgOklch)));
  const bgLum = srgbRelativeLuminance(oklchToSrgb(parseOklchToken(bgOklch)));
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export interface ContrastPairAuditResult {
  theme: 'light' | 'dark';
  label: string;
  fgToken: string;
  bgToken: string;
  ratio: number;
  minRequired: number;
  passes: boolean;
}

export const LANGO_THEME_TOKENS = {
  light: {
    bg: 'oklch(0.991 0.004 85)',
    surface1: 'oklch(1 0 0)',
    surface2: 'oklch(0.968 0.005 85)',
    surface3: 'oklch(0.936 0.007 85)',
    text: 'oklch(0.18 0.012 260)',
    textSecondary: 'oklch(0.41 0.014 260)',
    muted: 'oklch(0.46 0.015 260)',
    lang: 'oklch(0.49 0.14 260)',
    langSoft: 'oklch(0.958 0.024 260)',
    langForeground: 'oklch(0.995 0 0)',
    goldInk: 'oklch(0.45 0.115 74)',
    goldSoft: 'oklch(0.968 0.038 86)',
    successContainer: 'oklch(0.968 0.038 152)',
    successOnContainer: 'oklch(0.36 0.115 152)',
    warnContainer: 'oklch(0.972 0.048 88)',
    warnOnContainer: 'oklch(0.41 0.11 75)',
    dangerContainer: 'oklch(0.968 0.026 25)',
    dangerOnContainer: 'oklch(0.44 0.18 27)',
  },
  dark: {
    bg: 'oklch(0.155 0.012 260)',
    surface1: 'oklch(0.205 0.014 260)',
    surface2: 'oklch(0.255 0.016 260)',
    surface3: 'oklch(0.31 0.018 260)',
    text: 'oklch(0.965 0.005 85)',
    textSecondary: 'oklch(0.79 0.01 260)',
    muted: 'oklch(0.745 0.012 260)',
    lang: 'oklch(0.77 0.11 260)',
    langSoft: 'oklch(0.285 0.05 260)',
    langForeground: 'oklch(0.155 0.015 260)',
    goldInk: 'oklch(0.85 0.115 84)',
    goldSoft: 'oklch(0.285 0.048 80)',
    successContainer: 'oklch(0.285 0.05 150)',
    successOnContainer: 'oklch(0.88 0.11 150)',
    warnContainer: 'oklch(0.3 0.05 88)',
    warnOnContainer: 'oklch(0.9 0.1 88)',
    dangerContainer: 'oklch(0.29 0.065 25)',
    dangerOnContainer: 'oklch(0.88 0.1 25)',
  },
} as const;

export function auditThemeContrastPairs(): ContrastPairAuditResult[] {
  const results: ContrastPairAuditResult[] = [];

  for (const theme of ['light', 'dark'] as const) {
    const t = LANGO_THEME_TOKENS[theme];
    const pairs: Array<[string, string, string, number]> = [
      ['Primary text on bg', t.text, t.bg, 4.5],
      ['Primary text on surface-1', t.text, t.surface1, 4.5],
      ['Primary text on surface-2', t.text, t.surface2, 4.5],
      ['Secondary text on bg', t.textSecondary, t.bg, 4.5],
      ['Secondary text on surface-1', t.textSecondary, t.surface1, 4.5],
      ['Secondary text on surface-2', t.textSecondary, t.surface2, 4.5],
      ['Muted text on bg', t.muted, t.bg, 4.5],
      ['Muted text on surface-1', t.muted, t.surface1, 4.5],
      ['Muted text on surface-2', t.muted, t.surface2, 4.5],
      ['Muted text on surface-3', t.muted, t.surface3, 4.5],
      ['Primary CTA foreground on --lang', t.langForeground, t.lang, 4.5],
      ['Accent --lang text on --lang-soft', t.lang, t.langSoft, 4.5],
      ['Accent --lang text on surface-1', t.lang, t.surface1, 4.5],
      ['Crest gold ink on --gold-soft', t.goldInk, t.goldSoft, 4.5],
      ['Crest gold ink on surface-1', t.goldInk, t.surface1, 4.5],
      [
        'Success verdict on container',
        t.successOnContainer,
        t.successContainer,
        4.5,
      ],
      ['Warn verdict on container', t.warnOnContainer, t.warnContainer, 4.5],
      [
        'Danger verdict on container',
        t.dangerOnContainer,
        t.dangerContainer,
        4.5,
      ],
    ];

    for (const [label, fg, bg, minRequired] of pairs) {
      const ratio = computeWcagContrastRatio(fg, bg);
      results.push({
        theme,
        label,
        fgToken: fg,
        bgToken: bg,
        ratio,
        minRequired,
        passes: ratio >= minRequired,
      });
    }
  }

  return results;
}
