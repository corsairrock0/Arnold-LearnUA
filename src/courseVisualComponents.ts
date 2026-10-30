export interface GrammarTableCell {
  text: string;
  audioUk?: string;
  highlight?: string;
  subtext?: string;
  badge?: string;
}

export interface GrammarTableRow {
  groupLabel?: string;
  cells: Array<string | GrammarTableCell>;
}

export interface GrammarTableProps {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: GrammarTableRow[];
  footnote?: string;
}

export interface ExampleBreakdownSegment {
  partUk: string;
  roleLabel: string;
  explanation: string;
}

export interface ExampleBreakdownProps {
  uk: string;
  highlightUk?: string;
  phoneticGuide?: string;
  en: string;
  contextLabel?: string;
  whyItWorks: string;
  segments?: ExampleBreakdownSegment[];
}

export interface RuleAndExceptionProps {
  stepNumber?: number;
  title: string;
  plainRule: string;
  formula?: string;
  examplesUk?: Array<{ uk: string; en: string; note?: string }>;
  exception?: {
    badge: 'Everyday Essential' | 'Natural Speech Detail' | 'Watch Out';
    title: string;
    explanation: string;
    examples?: Array<{ uk: string; en: string }>;
  };
}

export interface DeclensionRow {
  caseName: string;
  questionUk: string;
  questionEn: string;
  singular: string;
  plural?: string;
  endingHighlight?: string;
  usageNote: string;
}

export interface DeclensionExplorerProps {
  title: string;
  nounLemma: string;
  genderLabel: string;
  animacyLabel: string;
  stemNote?: string;
  rows: DeclensionRow[];
}

export interface ConjugationRow {
  personUk: string;
  personEn: string;
  formUk: string;
  endingHighlight: string;
  exampleUk: string;
  exampleEn: string;
}

export interface ConjugationExplorerProps {
  title: string;
  infinitiveUk: string;
  infinitiveEn: string;
  conjugationGroup: string;
  stemNote?: string;
  rows: ConjugationRow[];
}

export interface IntonationContourItem {
  id: string;
  title: string;
  patternLabel: string;
  svgPath: string;
  pitchPoints: Array<{ x: number; y: number; label: string }>;
  exampleUk: string;
  focusWordUk: string;
  exampleEn: string;
  howToSoundNatural: string;
}

export interface VowelMapItem {
  letter: string;
  ipa: string;
  soundLikeEn: string;
  mouthPosition: string;
  sampleWordUk: string;
  sampleWordEn: string;
  contrastNote: string;
}

export interface GrammarDiagramProps {
  title: string;
  subtitle: string;
  diagramType: 'vowel-grid' | 'intonation-contours' | 'flow-steps';
  vowelItems?: VowelMapItem[];
  intonationItems?: IntonationContourItem[];
  flowSteps?: Array<{ step: string; title: string; detail: string; exampleUk?: string }>;
}

export interface AspectTimelineProps {
  title: string;
  imperfectiveVerb: string;
  perfectiveVerb: string;
  englishMeaning: string;
  imperfectiveFocus: string;
  perfectiveFocus: string;
  imperfectiveExample: { uk: string; en: string };
  perfectiveExample: { uk: string; en: string };
}

export interface CommonMistakeProps {
  topic: string;
  wrongText: string;
  rightText: string;
  audioUk: string;
  whyWrong: string;
  howToRemember: string;
}

export interface LessonReferenceSection {
  heading: string;
  summary: string;
  bullets?: string[];
  table?: GrammarTableProps;
}

export interface LessonReferenceProps {
  title: string;
  subtitle: string;
  sections: LessonReferenceSection[];
}

export interface KnowledgeCheckProps {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioUk?: string;
}

export interface StructuredCourseLesson {
  prerequisites: Array<{ modId: string; label: string }>;
  relatedTopics: string[];
  bigIdea: {
    headline: string;
    plainEnglish: string;
    englishComparison: string;
    keyInsight: string;
  };
  seeItInAction: ExampleBreakdownProps[];
  patternTables: GrammarTableProps[];
  declensions?: DeclensionExplorerProps[];
  conjugations?: ConjugationExplorerProps[];
  aspectTimelines?: AspectTimelineProps[];
  diagrams?: GrammarDiagramProps[];
  stepByStep: RuleAndExceptionProps[];
  moreExamples: Array<{
    groupTitle: string;
    groupNote: string;
    items: ExampleBreakdownProps[];
  }>;
  importantExceptions: Array<{
    badge: 'Everyday Essential' | 'Natural Speech Detail' | 'Watch Out';
    title: string;
    rule: string;
    examples: Array<{ uk: string; en: string; note?: string }>;
  }>;
  commonMistakes: CommonMistakeProps[];
  embeddedChecks: KnowledgeCheckProps[];
  dialogueContextNote: string;
  completeReference: LessonReferenceProps;
  whatToRemember: string[];
}

function escapeQuote(s: string): string {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');
}

function highlightSubstring(text: string, target?: string): string {
  if (!target || !text.includes(target)) return text;
  return text.replace(
    target,
    `<mark class="vc-highlight">${target}</mark>`
  );
}

export function renderGrammarTable(props: GrammarTableProps): string {
  const headerCells = props.headers
    .map((h) => `<th class="vc-th">${h}</th>`)
    .join('');

  const bodyRows = props.rows
    .map((row) => {
      const groupBanner = row.groupLabel
        ? `<tr class="vc-group-row"><td colspan="${props.headers.length}">${row.groupLabel}</td></tr>`
        : '';
      const cellsHtml = row.cells
        .map((cell) => {
          if (typeof cell === 'string') {
            return `<td class="vc-td">${cell}</td>`;
          }
          const display = highlightSubstring(cell.text, cell.highlight);
          const audioBtn = cell.audioUk
            ? `<button type="button" class="vc-audio-mini" onclick="event.stopPropagation(); speakUkrainian('${escapeQuote(cell.audioUk)}')" title="Listen to ${cell.audioUk}">🔊</button>`
            : '';
          const inspectAttr = cell.audioUk
            ? `onclick="inspectCourseWord('${escapeQuote(cell.audioUk)}')" style="cursor:pointer;" title="Tap to hear & inspect in Grammar Panel"`
            : '';
          const badgeHtml = cell.badge
            ? `<span class="vc-cell-badge">${cell.badge}</span>`
            : '';
          const subHtml = cell.subtext
            ? `<div class="vc-cell-sub">${cell.subtext}</div>`
            : '';
          return `<td class="vc-td" ${inspectAttr}>
            <div class="vc-cell-main">${audioBtn}<span>${display}</span>${badgeHtml}</div>
            ${subHtml}
          </td>`;
        })
        .join('');
      return `${groupBanner}<tr class="vc-tr">${cellsHtml}</tr>`;
    })
    .join('');

  return `
    <div class="vc-table-card">
      <div class="vc-table-header">
        <div class="vc-table-title">${props.title}</div>
        ${props.subtitle ? `<div class="vc-table-subtitle">${props.subtitle}</div>` : ''}
      </div>
      <div class="vc-table-scroll">
        <table class="vc-table">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      ${props.footnote ? `<div class="vc-table-footnote">💡 ${props.footnote}</div>` : ''}
    </div>
  `;
}

export function renderExampleBreakdown(props: ExampleBreakdownProps): string {
  const displayUk = highlightSubstring(props.uk, props.highlightUk);
  const segmentsHtml =
    props.segments && props.segments.length > 0
      ? `<div class="vc-segments-grid">
          ${props.segments
            .map(
              (seg) => `
            <div class="vc-segment-chip" onclick="event.stopPropagation(); inspectCourseWord('${escapeQuote(seg.partUk)}')">
              <div class="vc-segment-uk">🔊 ${seg.partUk}</div>
              <div class="vc-segment-role">${seg.roleLabel}</div>
              <div class="vc-segment-exp">${seg.explanation}</div>
            </div>
          `
            )
            .join('')}
        </div>`
      : '';

  return `
    <div class="vc-example-card" onclick="speakUkrainian('${escapeQuote(props.uk)}')">
      <div class="vc-example-top">
        <div style="flex:1;">
          ${props.contextLabel ? `<span class="vc-context-tag">${props.contextLabel}</span>` : ''}
          <div class="vc-example-uk">🔊 ${displayUk}</div>
          ${props.phoneticGuide ? `<div class="vc-example-phon">Sounds like: <b>${props.phoneticGuide}</b></div>` : ''}
          <div class="vc-example-en">${props.en}</div>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; flex-shrink:0;">
          <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="event.stopPropagation(); speakUkrainian('${escapeQuote(props.uk)}')">🔊 UA</button>
          <button type="button" class="btn btn-warn" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="event.stopPropagation(); playBilingualOpenAI('${escapeQuote(`${props.uk}. ${props.en}`)}', 'uk')">🗣️ UA + EN</button>
        </div>
      </div>
      <div class="vc-example-why"><b>Why it works:</b> ${props.whyItWorks}</div>
      ${segmentsHtml}
    </div>
  `;
}

export function renderRuleAndException(props: RuleAndExceptionProps): string {
  const examplesHtml =
    props.examplesUk && props.examplesUk.length > 0
      ? `<div class="vc-rule-examples">
          ${props.examplesUk
            .map(
              (ex) => `
            <div class="vc-rule-ex-pill" onclick="event.stopPropagation(); inspectCourseWord('${escapeQuote(ex.uk)}')">
              <span class="vc-rule-ex-uk">🔊 ${ex.uk}</span>
              <span class="vc-rule-ex-en">— ${ex.en}</span>
              ${ex.note ? `<span class="vc-rule-ex-note">(${ex.note})</span>` : ''}
            </div>
          `
            )
            .join('')}
        </div>`
      : '';

  const exceptionHtml = props.exception
    ? `<div class="vc-exception-box">
        <div class="vc-exception-header">
          <span class="vc-exception-badge">${props.exception.badge}</span>
          <b>${props.exception.title}</b>
        </div>
        <div class="vc-exception-body">${props.exception.explanation}</div>
        ${
          props.exception.examples && props.exception.examples.length > 0
            ? `<div class="vc-exception-ex-list">
                ${props.exception.examples
                  .map(
                    (e) =>
                      `<button type="button" class="vc-mini-word-btn" onclick="event.stopPropagation(); inspectCourseWord('${escapeQuote(e.uk)}')">🔊 <b>${e.uk}</b> (${e.en})</button>`
                  )
                  .join('')}
              </div>`
            : ''
        }
      </div>`
    : '';

  return `
    <div class="vc-rule-card">
      <div class="vc-rule-header">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          ${props.stepNumber !== undefined ? `<span class="vc-step-num">Step ${props.stepNumber}</span>` : ''}
          <h4 class="vc-rule-title">${props.title}</h4>
        </div>
        <button type="button" class="btn btn-warn" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="event.stopPropagation(); playBilingualOpenAI('${escapeQuote(`${props.title}. ${props.plainRule}`)}', 'en')">🔊 Listen</button>
      </div>
      <div class="vc-rule-text">${props.plainRule}</div>
      ${props.formula ? `<div class="vc-formula-box"><code>${props.formula}</code></div>` : ''}
      ${examplesHtml}
      ${exceptionHtml}
    </div>
  `;
}

export function renderDeclensionExplorer(props: DeclensionExplorerProps): string {
  const rows: GrammarTableRow[] = props.rows.map((r) => ({
    cells: [
      { text: r.caseName, subtext: `${r.questionUk} (${r.questionEn})` },
      {
        text: r.singular,
        audioUk: r.singular,
        highlight: r.endingHighlight,
      },
      ...(r.plural
        ? [{ text: r.plural, audioUk: r.plural }]
        : []),
      r.usageNote,
    ],
  }));

  const headers = props.rows.some((r) => Boolean(r.plural))
    ? ['Case & Question', 'Singular', 'Plural', 'When You Use It']
    : ['Case & Question', 'Form', 'When You Use It'];

  return renderGrammarTable({
    title: `${props.title}: ${props.nounLemma}`,
    subtitle: `${props.genderLabel} • ${props.animacyLabel}${props.stemNote ? ` • ${props.stemNote}` : ''}`,
    headers,
    rows,
  });
}

export function renderConjugationExplorer(props: ConjugationExplorerProps): string {
  const rows: GrammarTableRow[] = props.rows.map((r) => ({
    cells: [
      { text: r.personUk, subtext: r.personEn },
      {
        text: r.formUk,
        audioUk: r.formUk,
        highlight: r.endingHighlight,
      },
      {
        text: r.exampleUk,
        audioUk: r.exampleUk,
        subtext: r.exampleEn,
      },
    ],
  }));

  return renderGrammarTable({
    title: `${props.title}: ${props.infinitiveUk} (${props.infinitiveEn})`,
    subtitle: `${props.conjugationGroup}${props.stemNote ? ` • ${props.stemNote}` : ''}`,
    headers: ['Person / Pronoun', 'Conjugated Verb', 'Everyday Example'],
    rows,
  });
}

export function renderGrammarDiagram(props: GrammarDiagramProps): string {
  if (props.diagramType === 'vowel-grid' && props.vowelItems) {
    const cardsHtml = props.vowelItems
      .map(
        (v) => `
        <div class="vc-vowel-card" onclick="inspectCourseWord('${escapeQuote(v.sampleWordUk)}')">
          <div class="vc-vowel-top">
            <span class="vc-vowel-letter">${v.letter}</span>
            <span class="vc-vowel-ipa">${v.ipa}</span>
          </div>
          <div class="vc-vowel-sound">Sounds like: <b>${v.soundLikeEn}</b></div>
          <div class="vc-vowel-mouth">👄 <b>Mouth tip:</b> ${v.mouthPosition}</div>
          <div class="vc-vowel-sample">
            <button type="button" class="vc-mini-word-btn" onclick="event.stopPropagation(); speakUkrainian('${escapeQuote(v.sampleWordUk)}')">
              🔊 <b>${v.sampleWordUk}</b> — ${v.sampleWordEn}
            </button>
          </div>
          <div class="vc-vowel-note">${v.contrastNote}</div>
        </div>
      `
      )
      .join('');

    return `
      <div class="vc-diagram-box">
        <div class="vc-diagram-header">
          <div class="vc-table-title">🗺️ ${props.title}</div>
          <div class="vc-table-subtitle">${props.subtitle}</div>
        </div>
        <div class="vc-vowel-grid">${cardsHtml}</div>
      </div>
    `;
  }

  if (props.diagramType === 'intonation-contours' && props.intonationItems) {
    const contoursHtml = props.intonationItems
      .map(
        (item) => `
        <div class="vc-intonation-card" onclick="speakUkrainian('${escapeQuote(item.exampleUk)}')">
          <div class="vc-intonation-top">
            <div>
              <span class="vc-step-num">${item.id}</span>
              <b style="font-size:14px; color:var(--text); margin-left:6px;">${item.title}</b>
            </div>
            <span class="vc-cell-badge">${item.patternLabel}</span>
          </div>
          <svg viewBox="0 0 260 68" class="vc-intonation-svg" role="img" aria-label="${item.title} pitch contour">
            <line x1="12" y1="34" x2="248" y2="34" stroke="var(--border-strong)" stroke-dasharray="4 4" stroke-width="1" />
            <path d="${item.svgPath}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" />
            ${item.pitchPoints
              .map(
                (pt) => `
              <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="var(--accent)" />
              <text x="${pt.x}" y="${pt.y > 38 ? pt.y + 15 : pt.y - 8}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text)">${pt.label}</text>
            `
              )
              .join('')}
          </svg>
          <div class="vc-intonation-example">
            <span>🔊 ${highlightSubstring(item.exampleUk, item.focusWordUk)}</span>
            <span style="color:var(--text-secondary); font-weight:500;">— ${item.exampleEn}</span>
          </div>
          <div class="vc-intonation-tip">${item.howToSoundNatural}</div>
        </div>
      `
      )
      .join('');

    return `
      <div class="vc-diagram-box">
        <div class="vc-diagram-header">
          <div class="vc-table-title">🎵 ${props.title}</div>
          <div class="vc-table-subtitle">${props.subtitle}</div>
        </div>
        <div class="vc-intonation-grid">${contoursHtml}</div>
      </div>
    `;
  }

  const stepsHtml = (props.flowSteps || [])
    .map(
      (s) => `
      <div class="vc-flow-card">
        <span class="vc-step-num">${s.step}</span>
        <div style="font-weight:800; font-size:14px; margin-top:4px; color:var(--text);">${s.title}</div>
        <div style="font-size:13px; color:var(--text-secondary); margin-top:3px;">${s.detail}</div>
        ${s.exampleUk ? `<div style="margin-top:6px; font-weight:700; color:var(--accent); cursor:pointer;" onclick="speakUkrainian('${escapeQuote(s.exampleUk)}')">🔊 ${s.exampleUk}</div>` : ''}
      </div>
    `
    )
    .join('');

  return `
    <div class="vc-diagram-box">
      <div class="vc-diagram-header">
        <div class="vc-table-title">${props.title}</div>
        <div class="vc-table-subtitle">${props.subtitle}</div>
      </div>
      <div class="vc-vowel-grid">${stepsHtml}</div>
    </div>
  `;
}

export function renderAspectTimeline(props: AspectTimelineProps): string {
  return `
    <div class="vc-diagram-box">
      <div class="vc-diagram-header">
        <div class="vc-table-title">⏱️ ${props.title}: ${props.englishMeaning}</div>
      </div>
      <div class="vc-aspect-grid">
        <div class="vc-aspect-card" onclick="speakUkrainian('${escapeQuote(props.imperfectiveExample.uk)}')">
          <span class="vc-context-tag">Imperfective (Process / Habit)</span>
          <div class="vc-example-uk">🔊 ${props.imperfectiveVerb}</div>
          <div class="vc-aspect-track">〰️〰️〰️〰️▶ (Ongoing or Repeated)</div>
          <div class="vc-vowel-note">${props.imperfectiveFocus}</div>
          <div style="margin-top:6px; font-size:13px;"><b>${props.imperfectiveExample.uk}</b> — ${props.imperfectiveExample.en}</div>
        </div>
        <div class="vc-aspect-card" onclick="speakUkrainian('${escapeQuote(props.perfectiveExample.uk)}')">
          <span class="vc-context-tag" style="background:var(--success-container); color:var(--success-on-container);">Perfective (Completed Result)</span>
          <div class="vc-example-uk">🔊 ${props.perfectiveVerb}</div>
          <div class="vc-aspect-track">──────●✓ (Finished Boundary)</div>
          <div class="vc-vowel-note">${props.perfectiveFocus}</div>
          <div style="margin-top:6px; font-size:13px;"><b>${props.perfectiveExample.uk}</b> — ${props.perfectiveExample.en}</div>
        </div>
      </div>
    </div>
  `;
}

export function renderCommonMistake(props: CommonMistakeProps): string {
  return `
    <div class="vc-mistake-card">
      <div class="vc-mistake-topic">⚠️ English-Speaker Watch-Out: ${props.topic}</div>
      <div class="vc-mistake-compare">
        <div class="vc-mistake-wrong">
          <div class="vc-mistake-label">❌ Common English-Speaker Trap</div>
          <div class="vc-mistake-val">${props.wrongText}</div>
        </div>
        <div class="vc-mistake-right" onclick="speakUkrainian('${escapeQuote(props.audioUk)}')" style="cursor:pointer;">
          <div class="vc-mistake-label">✅ Natural Ukrainian (Tap to Hear)</div>
          <div class="vc-mistake-val">🔊 ${props.rightText}</div>
        </div>
      </div>
      <div class="vc-mistake-exp">
        <b>Why:</b> ${props.whyWrong}<br>
        <b>Memory Shortcut:</b> ${props.howToRemember}
      </div>
    </div>
  `;
}

export function renderLessonReference(props: LessonReferenceProps): string {
  const sectionsHtml = props.sections
    .map(
      (sec) => `
      <div class="vc-ref-section">
        <h4 class="vc-ref-heading">${sec.heading}</h4>
        <p class="vc-ref-summary">${sec.summary}</p>
        ${
          sec.bullets && sec.bullets.length > 0
            ? `<ul class="vc-ref-list">${sec.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
            : ''
        }
        ${sec.table ? renderGrammarTable(sec.table) : ''}
      </div>
    `
    )
    .join('');

  return `
    <details class="vc-reference-details">
      <summary class="vc-reference-summary">
        <div>
          <span class="vc-context-tag">Complete Linguistic Reference</span>
          <div style="font-size:15px; font-weight:800; color:var(--text); margin-top:4px;">📚 ${props.title}</div>
          <div style="font-size:12.5px; color:var(--text-secondary); font-weight:500;">${props.subtitle} (Tap to expand full reference — optional deep dive)</div>
        </div>
        <span class="vc-ref-chevron">▼ Expand</span>
      </summary>
      <div class="vc-reference-body">
        ${sectionsHtml}
      </div>
    </details>
  `;
}

export function renderKnowledgeCheck(
  props: KnowledgeCheckProps,
  modId: string
): string {
  const expId = `vc-kc-exp-${modId}-${props.id}`;
  const quizKey = `${modId}:inline-kc:${props.id}`;
  return `
    <div class="vc-kc-card">
      <div class="vc-kc-question">⚡ Quick Check: ${props.question}</div>
      <div class="vc-kc-options">
        ${props.options
          .map(
            (opt, oIdx) => `
          <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === props.correctIndex}, '${expId}', '${quizKey}', '${escapeQuote(props.audioUk || '')}')">${opt}</button>
        `
          )
          .join('')}
      </div>
      <div id="${expId}" class="hidden vc-kc-exp">
        <b>💡 Why:</b> ${props.explanation}
      </div>
    </div>
  `;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function normalizeTable(tb: any): GrammarTableProps {
  const rows: GrammarTableRow[] = (tb.rows || []).map((r: any) => {
    if (Array.isArray(r)) {
      return { cells: r };
    }
    return {
      groupLabel: r.groupLabel,
      cells: r.cells || [],
    };
  });
  return {
    title: tb.title || 'Grammar Pattern Table',
    subtitle: tb.subtitle || tb.caption || undefined,
    headers: tb.headers || [],
    rows,
    footnote: tb.footnote || tb.note || undefined,
  };
}

function normalizeExampleItem(ex: any, fallbackWhy: string): ExampleBreakdownProps {
  const rawUk = String(ex.uk || '');
  const markMatch = rawUk.match(/<mark[^>]*>([^<]+)<\/mark>/i);
  const cleanUk = stripHtmlTags(rawUk);
  return {
    uk: cleanUk,
    highlightUk: ex.highlightUk || ex.highlight || (markMatch ? markMatch[1] : undefined),
    phoneticGuide: ex.phoneticGuide,
    en: ex.en || '',
    contextLabel: ex.contextLabel || ex.tag,
    whyItWorks:
      ex.whyItWorks ||
      ex.highlightNote ||
      ex.SpotlightNote ||
      ex.note ||
      fallbackWhy,
    segments: ex.segments,
  };
}

export function normalizeStructuredLesson(
  mod: any,
  modIdx = 0,
  allMods: any[] = []
): StructuredCourseLesson {
  const raw: any = mod.structuredLesson || {};
  // If already in canonical A0.1 shape with all required fields:
  if (
    raw.prerequisites &&
    raw.bigIdea?.plainEnglish &&
    raw.patternTables &&
    raw.completeReference?.sections
  ) {
    return raw as StructuredCourseLesson;
  }

  const prevMod = modIdx > 0 && allMods[modIdx - 1] ? allMods[modIdx - 1] : null;
  const prerequisites: Array<{ modId: string; label: string }> =
    raw.prerequisites ||
    (prevMod
      ? [
          {
            modId: prevMod.id,
            label: `Prerequisite: ${prevMod.id} — ${prevMod.title}`,
          },
        ]
      : [{ modId: mod.id, label: `Foundation Module (${mod.level})` }]);

  const relatedTopics: string[] = raw.relatedTopics || [
    mod.topicTag,
    `CEFR ${mod.level} Curriculum`,
    'Interactive Grammar Inspector',
  ];

  // B. Big Idea
  let bigIdea: StructuredCourseLesson['bigIdea'];
  if (typeof raw.bigIdea === 'string') {
    bigIdea = {
      headline: mod.title,
      plainEnglish: raw.bigIdea,
      englishComparison: raw.whyItMatters || mod.summary,
      keyInsight: mod.reviewSummary || mod.summary,
    };
  } else {
    const bi = raw.bigIdea || {};
    const keyTermsStr = Array.isArray(bi.keyTerms)
      ? bi.keyTerms
          .map((kt: any) => `<b>${kt.term}:</b> ${kt.plainEnglish}`)
          .join(' • ')
      : '';
    bigIdea = {
      headline: bi.headline || bi.title || mod.title,
      plainEnglish: bi.plainEnglish || bi.body || bi.explanation || mod.summary,
      englishComparison:
        bi.englishComparison || bi.whyItMatters || keyTermsStr || mod.summary,
      keyInsight:
        bi.keyInsight || bi.whyItMatters || mod.reviewSummary || mod.summary,
    };
  }

  // C. See It in Action
  const seeItInAction: ExampleBreakdownProps[] = (raw.seeItInAction || []).map(
    (ex: any) => normalizeExampleItem(ex, mod.summary)
  );

  // D. Pattern Tables, Declensions, Conjugations, Aspect Timelines, Diagrams
  const rawTables: any[] = [
    ...(raw.patternTables || []),
    ...(raw.visualTables || []),
    ...((raw.concepts || []).flatMap((c: any) => c.tables || [])),
  ];
  const patternTables: GrammarTableProps[] = rawTables.map(normalizeTable);

  const declensions: DeclensionExplorerProps[] = [];
  const conjugations: ConjugationExplorerProps[] = [];

  // From A1.4 raw.declensions
  for (const dGroup of raw.declensions || []) {
    if (dGroup.rows) {
      declensions.push(dGroup);
    } else if (Array.isArray(dGroup.nouns)) {
      const caseLabels: Array<[string, string, string, string]> = [
        ['nom', 'Nominative (Називни́й)', 'Хто? Що?', 'Who? What?'],
        ['gen', 'Genitive (Родови́й)', 'Кого́? Чого́?', 'Of whom? Of what?'],
        ['dat', 'Dative (Дава́льний)', 'Кому́? Чому́?', 'To whom? To what?'],
        ['acc', 'Accusative (Знахі́дний)', 'Кого́? Що?', 'Whom? What?'],
        ['inst', 'Instrumental (Ору́дний)', 'Ким? Чим?', 'With whom? By what?'],
        ['loc', 'Locative (Місце́вий)', 'На ко́му? У чо́му?', 'Where? On/in what?'],
        ['voc', 'Vocative (Кли́чний)', 'Зверта́ння', 'Direct address!'],
      ];
      for (const n of dGroup.nouns) {
        const rows: DeclensionRow[] = caseLabels
          .filter(([key]) => n.forms && n.forms[key])
          .map(([key, cName, qUk, qEn]) => ({
            caseName: cName,
            questionUk: qUk,
            questionEn: qEn,
            singular: n.forms[key][0] || '—',
            plural: n.forms[key][1] || undefined,
            usageNote: n.notes || '',
          }));
        declensions.push({
          title: dGroup.title || '7-Case Declension Explorer',
          nounLemma: `${n.lemma} (${n.translation})`,
          genderLabel: n.gender || '',
          animacyLabel: n.declensionGroup || '',
          stemNote: n.notes,
          rows,
        });
      }
    }
  }

  // From A1.2 raw.conjugations
  for (const cGroup of raw.conjugations || []) {
    if (cGroup.rows) {
      conjugations.push(cGroup);
    } else if (Array.isArray(cGroup.verbs)) {
      const pronouns: Array<[string, string]> = [
        ['я', 'I (1st sg.)'],
        ['ти', 'you (2nd sg. informal)'],
        ['він/вона́', 'he / she / it (3rd sg.)'],
        ['ми', 'we (1st pl.)'],
        ['ви', 'you (2nd pl. / polite)'],
        ['вони́', 'they (3rd pl.)'],
      ];
      for (const v of cGroup.verbs) {
        const rows: ConjugationRow[] = pronouns
          .filter(([pKey]) => v.forms && v.forms[pKey])
          .map(([pKey, pEn]) => ({
            personUk: pKey,
            personEn: pEn,
            formUk: v.forms[pKey],
            endingHighlight: '',
            exampleUk: `${pKey.split('/')[0]} ${v.forms[pKey]}`,
            exampleEn: v.forms.past ? `Past: ${v.forms.past}` : v.translation,
          }));
        conjugations.push({
          title: cGroup.title || 'Verb Conjugation Explorer',
          infinitiveUk: v.infinitive,
          infinitiveEn: v.translation,
          conjugationGroup: `${v.conjugationClass || ''} • ${v.aspect || ''}`,
          stemNote: v.stemNote,
          rows,
        });
      }
    }
  }

  // From A2.1–B1.5 raw.explorers
  for (const exp of raw.explorers || []) {
    for (const tab of exp.tabs || []) {
      if (tab.verb) {
        conjugations.push({
          title: exp.title || 'Interactive Conjugation Explorer',
          infinitiveUk: tab.verb,
          infinitiveEn: tab.label || tab.verb,
          conjugationGroup: tab.conjugationType || '',
          stemNote: tab.note,
          rows: (tab.forms || []).map((f: any) => ({
            personUk: f.pronoun || '',
            personEn: '',
            formUk: f.form || '',
            endingHighlight: '',
            exampleUk: `${f.pronoun || ''} ${f.form || ''}`.trim(),
            exampleEn: f.en || '',
          })),
        });
      } else if (tab.noun) {
        declensions.push({
          title: exp.title || 'Interactive Declension Explorer',
          nounLemma: tab.label || tab.noun,
          genderLabel: tab.gender || '',
          animacyLabel: exp.subtitle || '',
          rows: (tab.forms || []).map((f: any) => ({
            caseName: f.caseName || '',
            questionUk: f.question || '',
            questionEn: '',
            singular: f.sg || '—',
            plural: f.pl || undefined,
            usageNote: f.note || '',
          })),
        });
      }
    }
  }

  // From B1.6–C1.1 concepts[].declensionGroups
  for (const c of raw.concepts || []) {
    for (const dg of c.declensionGroups || []) {
      for (const item of dg.paradigms || dg.items || []) {
        declensions.push({
          title: dg.title || dg.groupTitle || c.title || 'Declension Explorer',
          nounLemma: item.noun,
          genderLabel: item.gender || '',
          animacyLabel: item.subType || '',
          rows: (item.rows || []).map((r: any) => ({
            caseName: r.caseName || '',
            questionUk: '',
            questionEn: '',
            singular: r.singular || '—',
            plural: r.plural || undefined,
            usageNote: r.note || '',
          })),
        });
      }
    }
  }

  // Aspect Timelines
  const aspectTimelines: AspectTimelineProps[] = (
    raw.aspectTimelines || []
  ).map((at: any) => {
    if (at.imperfectiveVerb) return at as AspectTimelineProps;
    return {
      title: at.pairTitle || 'Verbal Aspect Comparison',
      imperfectiveVerb: at.imperfective?.verb || '',
      perfectiveVerb: at.perfective?.verb || '',
      englishMeaning: at.pairTitle || '',
      imperfectiveFocus: at.imperfective?.label || '',
      perfectiveFocus: at.perfective?.label || '',
      imperfectiveExample: {
        uk: at.imperfective?.pastExample || at.imperfective?.presentExample || '',
        en: at.imperfective?.futureExample || '',
      },
      perfectiveExample: {
        uk: at.perfective?.pastExample || '',
        en: at.perfective?.futureExample || '',
      },
    };
  });

  // Diagrams
  const diagrams: GrammarDiagramProps[] = (raw.diagrams || []).map(
    (dg: any) => {
      if (dg.diagramType) return dg as GrammarDiagramProps;
      return {
        title: dg.title || 'Visual Grammar Map',
        subtitle: dg.subtitle || '',
        diagramType: 'flow-steps',
        flowSteps: (dg.nodes || dg.steps || []).map(
          (n: any, idx: number) => ({
            step: n.label || `Pattern ${idx + 1}`,
            title: n.value || n.title || '',
            detail: n.description || n.detail || '',
            exampleUk: n.exampleUk,
          })
        ),
      };
    }
  );

  // E. Step-by-Step Rules
  const stepByStep: RuleAndExceptionProps[] =
    raw.stepByStep && raw.stepByStep.length > 0
      ? raw.stepByStep.map((s: any, idx: number) => ({
          stepNumber: s.stepNumber ?? idx + 1,
          title: s.title || `Step ${idx + 1}`,
          plainRule: s.plainRule || s.explanation || '',
          formula: s.formula,
          examplesUk: s.examplesUk || s.examples || [],
          exception: s.exception,
        }))
      : (raw.concepts || []).map((c: any, idx: number) => ({
          stepNumber: idx + 1,
          title: c.title || `Core Concept ${idx + 1}`,
          plainRule: Array.isArray(c.explanation)
            ? c.explanation.map((p: string) => stripHtmlTags(p)).join(' ')
            : String(c.explanation || c.idea || ''),
          formula: c.idea,
          examplesUk: (c.examples || []).map((ex: any) => ({
            uk: stripHtmlTags(ex.uk || ''),
            en: ex.en || '',
            note: ex.highlight,
          })),
        }));

  // F. More Examples
  let moreExamples: StructuredCourseLesson['moreExamples'] = [];
  if (Array.isArray(raw.moreExamples) && raw.moreExamples.length > 0) {
    if (raw.moreExamples[0].groupTitle) {
      moreExamples = raw.moreExamples;
    } else {
      moreExamples = [
        {
          groupTitle: 'Worked Ukrainian Sentences in Context',
          groupNote: 'Tap any sentence to hear native pronunciation and inspect the highlighted grammar.',
          items: raw.moreExamples.map((ex: any) =>
            normalizeExampleItem(ex, mod.summary)
          ),
        },
      ];
    }
  } else if (Array.isArray(raw.concepts) && raw.concepts.length > 0) {
    moreExamples = raw.concepts
      .filter((c: any) => Array.isArray(c.examples) && c.examples.length > 0)
      .map((c: any) => ({
        groupTitle: c.title,
        groupNote: c.idea || '',
        items: c.examples.map((ex: any) =>
          normalizeExampleItem(ex, c.idea || mod.summary)
        ),
      }));
  } else {
    moreExamples = [
      {
        groupTitle: 'Additional Examples from This Module',
        groupNote: 'Tap any sentence to listen to Ukrainian audio.',
        items: (mod.examples || []).map((ex: any) =>
          normalizeExampleItem(ex, mod.summary)
        ),
      },
    ];
  }

  // G. Important Exceptions
  let importantExceptions: StructuredCourseLesson['importantExceptions'] = [];
  if (Array.isArray(raw.importantExceptions) && raw.importantExceptions.length > 0) {
    importantExceptions = raw.importantExceptions;
  } else if (
    Array.isArray(raw.exceptionsAndEdgeCases) &&
    raw.exceptionsAndEdgeCases.length > 0
  ) {
    importantExceptions = raw.exceptionsAndEdgeCases.map((ec: any) => ({
      badge: 'Watch Out' as const,
      title: ec.ruleTitle || ec.title || 'Important Pattern & Edge Case',
      rule: ec.ruleExplanation || ec.explanation || '',
      examples: (ec.exceptions || []).map((item: any) => ({
        uk: item.item ? item.item.split('(')[0].trim() : mod.examples?.[0]?.uk || '',
        en: item.item || '',
        note: item.note || '',
      })),
    }));
  } else {
    // Extract from reference or module rules so every module has rich exceptions
    const refBlocks =
      raw.referenceSections?.[0]?.blocks ||
      raw.reference?.flatMap((r: any) => r.blocks || []) ||
      [];
    if (refBlocks.length > 0) {
      importantExceptions = refBlocks.slice(0, 2).map((b: any) => ({
        badge: 'Natural Speech Detail' as const,
        title: b.heading || 'Key Linguistic Nuance',
        rule: (b.items || []).join(' '),
        examples: (mod.examples || []).slice(0, 2).map((e: any) => ({
          uk: e.uk,
          en: e.en,
        })),
      }));
    } else {
      importantExceptions = [
        {
          badge: 'Everyday Essential',
          title: `Key Nuances in ${mod.id}`,
          rule: mod.reviewSummary || mod.summary,
          examples: (mod.examples || []).slice(0, 2).map((e: any) => ({
            uk: e.uk,
            en: e.en,
          })),
        },
      ];
    }
  }

  // H. Common Mistakes
  const rawMistakes: any[] = [
    ...(raw.commonMistakes || []),
    ...((raw.concepts || []).flatMap((c: any) => c.commonMistakes || [])),
  ];
  const commonMistakes: CommonMistakeProps[] = rawMistakes.map(
    (cm: any, idx: number) => ({
      topic: cm.topic || cm.mistake || `Common Mistake #${idx + 1}`,
      wrongText: cm.wrongText || cm.wrongUk || cm.wrong || '',
      rightText: cm.rightText || cm.correctUk || cm.right || '',
      audioUk:
        cm.audioUk ||
        stripHtmlTags(cm.rightText || cm.correctUk || cm.right || '').split('(')[0].trim(),
      whyWrong: cm.whyWrong || cm.explanation || cm.why || '',
      howToRemember:
        cm.howToRemember ||
        cm.explanation ||
        cm.why ||
        'Compare the ❌ trap and ✅ natural Ukrainian form aloud.',
    })
  );
  // Ensure at least 2 commonMistakes
  if (commonMistakes.length < 2 && mod.cfu?.length >= 2) {
    for (let i = commonMistakes.length; i < 2; i++) {
      const q = mod.cfu[i];
      const wrongOpt = q.opts.find((_: string, oIdx: number) => oIdx !== q.ans) || q.opts[0];
      const rightOpt = q.opts[q.ans] || q.opts[0];
      commonMistakes.push({
        topic: q.q,
        wrongText: wrongOpt,
        rightText: rightOpt,
        audioUk: mod.examples?.[0]?.uk || '',
        whyWrong: q.exp,
        howToRemember: q.exp,
      });
    }
  }

  // I. Embedded Checks
  const rawChecks: any[] = [
    ...(raw.embeddedChecks || []),
    ...(raw.inlineChecks || []),
    ...((raw.concepts || [])
      .map((c: any) => c.microCheck)
      .filter(Boolean)),
  ];
  const embeddedChecks: KnowledgeCheckProps[] = rawChecks.map(
    (kc: any, idx: number) => ({
      id: kc.id || `kc-${idx + 1}`,
      question: kc.question || '',
      options: kc.options || [],
      correctIndex: kc.correctIndex ?? 0,
      explanation: kc.explanation || '',
      audioUk: kc.audioUk || mod.examples?.[0]?.uk,
    })
  );

  // J. Dialogue Context Note
  const dialogueContextNote: string =
    raw.dialogueContextNote ||
    `Listen to how the grammar patterns and vocabulary from ${mod.id} (${mod.title}) work naturally in "${mod.dialogue?.title || 'Everyday Conversation'}".`;

  // K. Complete Reference
  let completeReference: LessonReferenceProps;
  if (raw.completeReference && !Array.isArray(raw.completeReference) && raw.completeReference.sections) {
    completeReference = raw.completeReference;
  } else if (Array.isArray(raw.completeReference)) {
    completeReference = {
      title: `Complete Linguistic Reference for Module ${mod.id}`,
      subtitle: mod.title,
      sections: raw.completeReference.map((sec: any) => ({
        heading: sec.title || sec.heading || 'Reference Section',
        summary: `${sec.summary || ''} ${sec.contentHtml || ''}`.trim(),
        bullets: sec.bullets || [],
        table: sec.table ? normalizeTable(sec.table) : undefined,
      })),
    };
  } else {
    const refArr = raw.referenceSections || raw.reference || [];
    const sections: LessonReferenceSection[] = [];
    for (const r of refArr) {
      if (Array.isArray(r.blocks)) {
        for (const b of r.blocks) {
          sections.push({
            heading: b.heading || r.title || 'Reference Section',
            summary: r.summary || '',
            bullets: b.items || [],
          });
        }
      } else {
        sections.push({
          heading: r.title || r.heading || 'Reference Section',
          summary: r.summary || '',
          bullets: r.bullets || r.items || [],
        });
      }
    }
    completeReference = {
      title: refArr[0]?.title || `Complete Reference: ${mod.title}`,
      subtitle: refArr[0]?.summary || `Comprehensive grammatical & lexical reference for ${mod.id}`,
      sections,
    };
  }

  // L. What to Remember
  const whatToRemember: string[] =
    raw.whatToRemember ||
    raw.takeaways ||
    [
      ...(raw.concepts || []).map((c: any) => `${c.title}: ${c.idea}`),
      mod.reviewSummary,
    ].filter(Boolean);

  return {
    prerequisites,
    relatedTopics,
    bigIdea,
    seeItInAction,
    patternTables,
    declensions: declensions.length > 0 ? declensions : undefined,
    conjugations: conjugations.length > 0 ? conjugations : undefined,
    aspectTimelines: aspectTimelines.length > 0 ? aspectTimelines : undefined,
    diagrams: diagrams.length > 0 ? diagrams : undefined,
    stepByStep,
    moreExamples,
    importantExceptions,
    commonMistakes,
    embeddedChecks,
    dialogueContextNote,
    completeReference,
    whatToRemember,
  };
}
