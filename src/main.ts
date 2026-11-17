import { FREQ_6000_DB, VocabItem } from './vocabData';
import { trapFocusInModal, releaseFocusTrap } from './a11yHelpers';
import {
  generateUkrainianPhonetics,
  generateGrammarBreakdown,
  generateSentenceCorrection,
} from './morphologyAndPhonetics';
import { COURSE_MODULES, CourseModule } from './courseData';
import { READER_PASSAGES, ReaderPassage } from './readerData';
import {
  EVERYDAY_CATEGORIES,
  getCategoryVocabItems,
  validateUkrainianAnswer,
  FILL_BLANK_EXERCISES,
  SENTENCE_CONSTRUCTION_EXERCISES,
  CONTEXTUAL_CHOICE_EXERCISES,
  GRAMMAR_AWARE_EXERCISES,
} from './everydayVocabData';
import {
  renderGrammarTable,
  renderExampleBreakdown,
  renderRuleAndException,
  renderDeclensionExplorer,
  renderConjugationExplorer,
  renderAspectTimeline,
  renderGrammarDiagram,
  renderCommonMistake,
  renderLessonReference,
  renderKnowledgeCheck,
  type StructuredCourseLesson,
} from './courseVisualComponents';
import {
  loadCourseAssessmentStore,
  saveCourseAssessmentStore,
  getModuleAssessmentState,
  validateCourseConstructedAnswer,
  buildDetailedFeedbackHtml,
  calculateExamScore,
  type EnrichedCourseQuestion,
  type EnrichedPracticeDrill,
  type EnrichedInlineCheck,
  type StageAttemptState,
} from './courseAssessmentEngine';
import {
  computeCourseMapGroups,
  computeModuleStepStates,
  computeStickyStepActions,
  computeModuleVocabReviewStatus,
  extractCleanTopicSubtitle,
  formatPlainLevelTitle,
  LESSON_TOC_SECTIONS,
} from './courseFlowHelpers';
import {
  formatGradeButtonSpecs,
  getDailyNewCardCap,
  getRemainingDailyNewAllowance,
  selectDeckActionableQueue,
  buildMixedActionableQueue,
  createFreshSessionTracker,
  recordSessionGrade,
  computeSessionSummaryMetrics,
  TOPIC_DRILL_SUBMODES,
  type ReviewModeId,
  type TopicDrillSubMode,
  type ReviewPrefsV1,
  type MixedQueueEntry,
  type ReviewSessionTracker,
} from './reviewSessionHelpers';
import {
  estimateStoryReadingMeta,
  formatCleanSummaryTag,
  formatPlainLevelBadge,
  normalizeUkLookupKey,
  resolveReaderWordLookup,
} from './exploreReaderHelpers';
import {
  registerIdentifyHooks,
  renderIdentifyTab,
  selectIdentifyCategory,
  selectIdentifyScene,
  setIdentifyExplorationMode,
  setIdentifyQuizMode,
  selectIdentifyHotspot,
  handleIdentifyMCOption,
  submitIdentifyTypedAnswer,
  insertIdentifyChar,
  revealIdentifyAnswer,
  advanceIdentifyNextTarget,
  toggleIdentifyCategoryDrawer,
  toggleIdentifySummaryView,
  filterIdentifyCategories,
  retryIdentifyMistakes,
  resetIdentifyScene,
  goIdentifyNextScene,
  addIdentifyWordToFSRS,
  addIdentifySceneWordsToFSRS,
  switchIdentifyPilotVariant,
  setIdentifySceneFitMode,
  toggleIdentifyBoundingBoxes,
} from './identifyView';
import {
  openLanguageSelectorModal,
  closeLanguageSelectorModal,
  selectTargetLanguageInModal,
  selectNativeLanguageForEnglishInModal,
  selectCourseTrackById,
  changeInterfaceLanguageInModal,
  openDevCourseImporterModal,
  closeDevCourseImporterModal,
  loadSyntheticCourseJsonFixture,
  loadSyntheticHindiCourseJsonFixture,
  runDevImportPreview,
  confirmDevPilotImport,
  resetDevPilotCourseTrack,
  syncMultilingualTrackUI,
  getActiveCourseTrack,
  registerOnCourseTrackChanged,
} from './multilingual/multilingualSelectorView.ts';
import { PUBLISHED_UKRAINIAN_TRACK_ID } from './multilingual/courseTrackRegistry.ts';
import {
  initAIConversationTab,
  renderAIConversationTab,
} from './aiConversationView';
import {
  selectUniversalCourseModule,
  selectUniversalCourseLesson,
  answerUniversalCourseActivity,
  markUniversalLessonComplete,
  addTrackVocabItemToIsolatedFsrs,
  gradeTrackIsolatedFsrsItem,
  speakMultilingualText,
} from './multilingual/universalCoursePlayer.ts';
import {
  openLangoContentStudio,
  closeLangoContentStudio,
  renderLangoContentStudio,
  switchCmsWorkspaceTab,
  selectCmsActiveTrack,
  dismissCmsBanner,
  handleCmsGlobalSearchInput,
  handleSearchResultClick,
  setCmsCourseManagerFilter,
  selectCmsEditorModule,
  selectCmsEditorLesson,
  selectCmsEditorActivity,
  toggleCmsSourceJsonDrawer,
  toggleCmsDraftVsPublishedDiffDrawer,
  setCmsPreviewMode,
  openCmsPreviewWithMode,
  handleDiscardCmsDraftOverlay,
  handleAddCmsModulePrompt,
  handleMoveCmsModule,
  handleDuplicateCmsModule,
  handleSaveCmsLessonEdits,
  handleSaveCmsActivityEdits,
  handleCreateManualSnapshot,
  handleCmsLifecycleTransition,
  setCmsImportMode,
  loadCmsSampleFixture,
  handleExecuteCmsDraftImport,
  setCmsVocabSearch,
  selectCmsVocabLexeme,
  selectCmsOverlayLanguage,
  handleSaveCanonicalLexeme,
  handleSaveNativeOverlay,
  handleRunCmsBulkAudit,
  handleAddCmsReviewerNote,
  handleRestoreCmsSnapshot,
  setCmsDiffSelection,
  setCmsMediaSearch,
  handleVerifyCmsExportRoundTrip,
  handleDownloadCmsExportJson,
  openCmsAdvancedSubTab,
  startCmsGuidedTour,
  stepCmsGuidedTour,
  closeCmsGuidedTour,
  setCmsMobileEditorPanel,
  toggleCmsOutlineSection,
  markCmsEditorUnsavedChanges,
  syncFriendlyMcChoicesToUnderlyingInputs,
  handleQuickAddLessonFromHome,
  handleStartFirstModuleForTrack,
  resumeLastEditedCmsLesson,
  jumpToCmsValidationProblem,
  handleAddCmsActivityToLesson,
  togglePendingPublishConfirmation,
  handleCmsImportFileSelected,
  handleCheckCmsImportContents,
  toggleCmsRemovedItemsDrawer,
  toggleCmsUnpublishedChangesDrawer,
  requestCmsItemRemoval,
  confirmPendingCmsRemoval,
  cancelPendingCmsRemoval,
  handleUndoCmsEditorAction,
  handleRedoCmsEditorAction,
  handleRestoreRemovedCmsItem,
  handleRequestRemoveModule,
  handleAddCmsSection,
  handleRequestRemoveSection,
  handleAddCmsLesson,
  handleDuplicateCmsLesson,
  handleRequestRemoveLesson,
  handleRemoveLessonParagraph,
  handleRemoveLessonVocabRef,
  handleAddLessonVocabRefFromInput,
  handleRemoveLessonMediaRef,
  handleAddLessonMediaRefFromInput,
  handleDuplicateActiveCmsActivity,
  handleRequestRemoveActiveActivity,
  handleAddCmsAnswerOption,
  handleRequestRemoveAnswerOption,
  handleRemoveQuestionExplanation,
  handleRemoveGrammarRule,
  handleRemoveExampleSentence,
  handleRequestRemoveGrammarTable,
  handleRemoveGrammarTableRow,
  bootCmsStudioRouteIfRequested,
  selectCmsIdentifyScene,
  selectCmsIdentifyTarget,
  setCmsIdentifyFilter,
  toggleCmsIdentifyBulkAuditPanel,
  toggleCmsIdentifyScenePlannerPanel,
  handleCmsIdentifyCanvasClick,
  handleCmsIdentifySaveGeometryInputs,
  handleCmsIdentifyNudgeTarget,
  handleCmsIdentifyMarkTargetMissing,
  handleCmsIdentifyAddTarget,
  handleCmsIdentifyChangeAssetPath,
  handleCmsIdentifyUndoDraft,
  handleCmsIdentifyRestoreBaseline,
  handleCmsIdentifyCheckScene,
  handleCmsIdentifyPublishScene,
  handleCmsIdentifyPreviewInLearnerApp,
} from './multilingual/cmsContentStudioView.ts';

// ============================================================================
// 0. iOS HAPTIC FEEDBACK, THEME APPEARANCE & BOTTOM SHEET CONTROLLER
// ============================================================================
let hasUserGestureActivated = false;
if (typeof window !== 'undefined') {
  const markActivated = () => {
    hasUserGestureActivated = true;
  };
  window.addEventListener('pointerdown', markActivated, {
    once: true,
    passive: true,
  });
  window.addEventListener('keydown', markActivated, {
    once: true,
    passive: true,
  });
}

export function triggerHaptic(style: 'light' | 'heavy' = 'light'): void {
  if (
    hasUserGestureActivated &&
    typeof navigator !== 'undefined' &&
    navigator.vibrate
  ) {
    navigator.vibrate(style === 'heavy' ? 18 : 8);
  }
}

let currentThemeMode: string =
  localStorage.getItem('slovo_ua_theme_mode') || 'system';

export function applyColorTheme(mode: string): void {
  currentThemeMode = mode;
  localStorage.setItem('slovo_ua_theme_mode', mode);
  const root = document.documentElement;
  root.classList.add('theme-switching');
  const iconEl = document.getElementById('theme-toggle-icon');
  if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
    if (iconEl) iconEl.innerText = 'Light';
  } else if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (iconEl) iconEl.innerText = 'Dark';
  } else {
    root.removeAttribute('data-theme');
    if (iconEl) iconEl.innerText = 'Auto';
  }
  document.querySelectorAll('[data-theme-opt]').forEach((btn) => {
    const val = btn.getAttribute('data-theme-opt');
    const isAct = val === mode;
    btn.classList.toggle('active', isAct);
    btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
  });
  // Force synchronous style recalculation while transitions are suppressed so buttons never flash
  void root.offsetHeight;
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching');
      });
    });
  } else {
    root.classList.remove('theme-switching');
  }
}

export function cycleColorTheme(): void {
  triggerHaptic('light');
  const next =
    currentThemeMode === 'system'
      ? 'light'
      : currentThemeMode === 'light'
        ? 'dark'
        : 'system';
  applyColorTheme(next);
}

export function openSettingsModal(): void {
  triggerHaptic('light');
  const modal = document.getElementById('lango-settings-modal');
  modal?.classList.remove('hidden');
  applyColorTheme(currentThemeMode);
  syncDailyGoalButtonsUI();
  syncReviewControlsUI();
  if (modal) {
    trapFocusInModal('lango-settings-modal');
  }
}

export function closeSettingsModal(): void {
  const modal = document.getElementById('lango-settings-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    releaseFocusTrap('lango-settings-modal');
  }
}

export function openInspectorSheet(): void {
  triggerHaptic('light');
  const insp = document.getElementById('grammar-inspector');
  insp?.classList.remove('desktop-collapsed');
  insp?.classList.add('sheet-open');
  document.getElementById('inspector-backdrop')?.classList.add('open');
  document.getElementById('top-inspector-toggle-btn')?.classList.add('inspector-active');
  if (typeof window !== 'undefined' && window.innerWidth <= 960 && insp) {
    trapFocusInModal('grammar-inspector');
  }
}

export function closeInspectorSheet(): void {
  const insp = document.getElementById('grammar-inspector');
  const wasSheetOpen = Boolean(insp?.classList.contains('sheet-open'));
  insp?.classList.remove('sheet-open');
  document.getElementById('inspector-backdrop')?.classList.remove('open');
  if (wasSheetOpen) {
    releaseFocusTrap('grammar-inspector');
  }
}

export function toggleGrammarInspector(forceOpen?: boolean): void {
  triggerHaptic('light');
  const insp = document.getElementById('grammar-inspector');
  const btn = document.getElementById('top-inspector-toggle-btn');
  if (!insp) return;
  if (typeof window !== 'undefined' && window.innerWidth <= 960) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !insp.classList.contains('sheet-open');
    if (shouldOpen) openInspectorSheet();
    else closeInspectorSheet();
    return;
  }
  const currentlyCollapsed = insp.classList.contains('desktop-collapsed');
  const nextShow = typeof forceOpen === 'boolean' ? forceOpen : currentlyCollapsed;
  if (nextShow) {
    insp.classList.remove('desktop-collapsed');
    btn?.classList.add('inspector-active');
  } else {
    insp.classList.add('desktop-collapsed');
    btn?.classList.remove('inspector-active');
  }
}

function ensureActionButtonsVisible(actionElId: string): void {
  requestAnimationFrame(() => {
    const el = document.getElementById(actionElId);
    if (el && window.innerWidth <= 960) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// ============================================================================
// 1. DUAL-ACCENT OPENAI TTS + WEB SPEECH API FALLBACK ENGINE
// ============================================================================
interface VoiceConfig {
  openaiKey: string;
  openaiModel: string;
  openaiVoice: string;
  speed: number;
}

const savedVoiceCfg = JSON.parse(
  localStorage.getItem('slovo_openai_hd_cfg') || '{}'
);
const voiceConfig: VoiceConfig = {
  openaiKey: savedVoiceCfg.openaiKey || '',
  openaiModel: savedVoiceCfg.openaiModel || 'gpt-4o-mini-tts',
  openaiVoice: savedVoiceCfg.openaiVoice || 'nova',
  speed: Number(savedVoiceCfg.speed) || 0.92,
};

const aiAudioCache = new Map<string, string>();
const segmentBufferCache = new Map<string, ArrayBuffer>();
const globalAudioPlayer = new Audio();
const SILENT_WAV_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

let sharedAudioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtx) sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function saveVoiceConfig(): void {
  localStorage.setItem('slovo_openai_hd_cfg', JSON.stringify(voiceConfig));
}

function injectOpenAIVoiceModal(): void {
  const lbl = document.getElementById('voice-label-pill');
  if (lbl) {
    lbl.innerText = 'Choose Voice';
  }
  if (document.getElementById('voice-settings-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'voice-settings-modal';
  modal.className = 'modal-backdrop hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'voice-modal-title');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVoiceModal();
  });
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog--sm">
      <div class="modal-header">
        <div>
          <div class="modal-kicker">Audio &amp; Pronunciation</div>
          <h3 id="voice-modal-title" class="modal-title">Dual-Accent Ukrainian &amp; English Voice</h3>
        </div>
        <button type="button" class="btn btn-sec btn--sm" onclick="closeVoiceModal()">Close</button>
      </div>
      <p class="hint hint--body">
        Built-in browser pronunciation works automatically. Optional: enter an OpenAI API key to enable <b>Studio Dual-Accent Neural TTS</b> (native American English + native literary Ukrainian).
      </p>
      <div class="form-field">
        <label class="form-label" for="vc-oa-key">OpenAI API Key (optional, sk-…)</label>
        <input id="vc-oa-key" type="password" class="input-box" placeholder="sk-proj-… (leave blank for built-in browser voice)">
      </div>
      <div class="form-field">
        <label class="form-label" for="vc-oa-model">OpenAI TTS Model</label>
        <select id="vc-oa-model" class="input-box">
          <option value="gpt-4o-mini-tts">gpt-4o-mini-tts (Recommended — Native Dual-Accent Control)</option>
          <option value="tts-1-hd">tts-1-hd (Studio HD)</option>
        </select>
      </div>
      <div class="form-field">
        <label class="form-label" for="vc-oa-voice">Speaker Voice</label>
        <select id="vc-oa-voice" class="input-box">
          <option value="nova">Nova (Default — Warm, Clear Bilingual Female)</option>
          <option value="coral">Coral (Expressive, Articulate Female)</option>
          <option value="sage">Sage (Calm, Natural Instructor)</option>
          <option value="onyx">Onyx (Deep, Authoritative Bilingual Male)</option>
          <option value="shimmer">Shimmer (Clear Studio Female)</option>
          <option value="echo">Echo (Smooth, Natural Male)</option>
          <option value="alloy">Alloy (Balanced Studio Neutral)</option>
        </select>
      </div>
      <div class="form-field">
        <label class="form-label" for="vc-oa-speed">Speaking Speed</label>
        <select id="vc-oa-speed" class="input-box">
          <option value="0.85">0.85x (Slower — Clear Phonetic Study)</option>
          <option value="0.92">0.92x (Default — Natural Learner Pace)</option>
          <option value="1.0">1.00x (Full Native Speed)</option>
        </select>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sec" onclick="closeVoiceModal()">Cancel</button>
        <button type="button" class="btn flex-1-min" onclick="saveVoiceModal()">Save &amp; Test Voice</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

export function openVoiceModal(): void {
  triggerHaptic('light');
  injectOpenAIVoiceModal();
  const keyInput = document.getElementById('vc-oa-key') as HTMLInputElement | null;
  const modelSelect = document.getElementById('vc-oa-model') as HTMLSelectElement | null;
  const voiceSelect = document.getElementById('vc-oa-voice') as HTMLSelectElement | null;
  const speedSelect = document.getElementById('vc-oa-speed') as HTMLSelectElement | null;
  if (keyInput) keyInput.value = voiceConfig.openaiKey;
  if (modelSelect) modelSelect.value = voiceConfig.openaiModel || 'gpt-4o-mini-tts';
  if (voiceSelect) voiceSelect.value = voiceConfig.openaiVoice || 'nova';
  if (speedSelect) speedSelect.value = String(voiceConfig.speed || 0.92);
  const modal = document.getElementById('voice-settings-modal');
  modal?.classList.remove('hidden');
  if (modal) {
    trapFocusInModal('voice-settings-modal');
  }
}

export function closeVoiceModal(): void {
  const modal = document.getElementById('voice-settings-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    releaseFocusTrap('voice-settings-modal');
  }
}

export function saveVoiceModal(): void {
  const keyInput = document.getElementById('vc-oa-key') as HTMLInputElement | null;
  const modelSelect = document.getElementById('vc-oa-model') as HTMLSelectElement | null;
  const voiceSelect = document.getElementById('vc-oa-voice') as HTMLSelectElement | null;
  const speedSelect = document.getElementById('vc-oa-speed') as HTMLSelectElement | null;

  voiceConfig.openaiKey = keyInput ? keyInput.value.trim() : '';
  voiceConfig.openaiModel = modelSelect ? modelSelect.value : 'gpt-4o-mini-tts';
  voiceConfig.openaiVoice = voiceSelect ? voiceSelect.value : 'nova';
  voiceConfig.speed = speedSelect ? parseFloat(speedSelect.value) || 0.92 : 0.92;
  saveVoiceConfig();
  const lbl = document.getElementById('voice-label-pill');
  if (lbl) {
    lbl.innerText = 'Choose Voice';
  }
  closeVoiceModal();
  playBilingualOpenAI(
    'Hello! Ukrainian and English audio is ready: Приві́т! Украї́нський го́лос налашто́вано.',
    'en'
  );
}

interface SpeechSegment {
  lang: 'uk' | 'en';
  text: string;
}

export function formatHtmlRuleForSpeech(htmlText: string): string {
  return htmlText
    .replace(/<\/li>/gi, '. ')
    .replace(/<li[^>]*>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^[\]]+\]/g, ' ')
    .replace(/→/g, ' becomes ')
    .replace(/=/g, ' means ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitBilingualSegments(
  text: string,
  defaultLang: 'uk' | 'en' = 'en'
): SpeechSegment[] {
  const cleanedHtml = formatHtmlRuleForSpeech(text);
  const normalized = cleanedHtml
    .replace(/[«»"“”()]/g, ' ')
    .replace(/\s+—\s+/g, '. ')
    .trim();
  const tokens = normalized.match(/\S+/g) || [];
  const segments: SpeechSegment[] = [];

  for (const tok of tokens) {
    const hasCyr = /[а-яА-ЯіїєґІЇЄҐ]/.test(tok);
    const hasLat = /[a-zA-Z]/.test(tok);
    let lang: 'uk' | 'en';
    if (hasCyr && !hasLat) {
      lang = 'uk';
    } else if (hasLat && !hasCyr) {
      lang = 'en';
    } else {
      lang = segments.length > 0 ? segments[segments.length - 1].lang : defaultLang;
    }

    if (segments.length > 0 && segments[segments.length - 1].lang === lang) {
      segments[segments.length - 1].text += ' ' + tok;
    } else {
      segments.push({ lang, text: tok });
    }
  }

  for (const seg of segments) {
    let t = seg.text.trim();
    if (!/[.!?…:;]$/.test(t)) {
      t = t.replace(/[,;:-]+$/, '').trim() + '.';
    }
    seg.text = t;
  }

  return segments;
}

function playWithBrowserSpeechFallback(
  text: string,
  defaultLang: 'uk' | 'en' = 'uk'
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.webdriver &&
      window.speechSynthesis.getVoices().length === 0
    ) {
      return;
    }
    window.speechSynthesis.cancel();
    const segments = splitBilingualSegments(text, defaultLang);
    for (const seg of segments) {
      const cleanText = seg.text.replace(/\u0301/g, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = seg.lang === 'uk' ? 'uk-UA' : 'en-US';
      utter.rate = voiceConfig.speed || 0.92;
      window.speechSynthesis.speak(utter);
    }
  } catch {
    // Ignore browser speech synthesis errors in headless environments
  }
}

async function fetchSegmentMp3Buffer(seg: SpeechSegment): Promise<ArrayBuffer> {
  const model = voiceConfig.openaiModel || 'gpt-4o-mini-tts';
  const voice = voiceConfig.openaiVoice || 'nova';
  const speed = voiceConfig.speed || 0.92;

  const inputText = seg.text.replace(/\u0301/g, '').trim();
  const segKey = `v2:${model}:${voice}:${speed}:${seg.lang}:${inputText}`;

  const cached = segmentBufferCache.get(segKey);
  if (cached) return cached;

  const instructions =
    seg.lang === 'uk'
      ? "Read ONLY the exact Ukrainian text provided in the input verbatim. Do not add, translate, reply to, or invent any extra words. Speak in a 100% native standard Ukrainian accent (Kyiv/Lviv literary pronunciation) with voiced glottal 'г', clear unreduced 'о', high-mid 'и', and bilabial 'в' at syllable ends."
      : 'Read ONLY the exact text provided in the input verbatim. Do not add, reply to, or invent any extra words. Speak in a warm, clear, natural American English accent.';

  const payload: Record<string, unknown> = {
    model,
    voice,
    input: inputText,
    speed,
  };
  if (model === 'gpt-4o-mini-tts') {
    payload.instructions = instructions;
  }

  let res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${voiceConfig.openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok && model === 'gpt-4o-mini-tts') {
    res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${voiceConfig.openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        voice,
        input: seg.text.replace(/\u0301/g, ''),
        speed,
      }),
    });
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `HTTP ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  segmentBufferCache.set(segKey, arrayBuffer);
  return arrayBuffer;
}

function stitchAudioBuffersToWavBlob(
  audioBuffers: AudioBuffer[],
  sampleRate: number,
  pauseSeconds = 0.085
): Blob {
  const pauseSamples = Math.round(sampleRate * pauseSeconds);
  let totalSamples = 0;
  for (let i = 0; i < audioBuffers.length; i++) {
    totalSamples += audioBuffers[i].length;
    if (i < audioBuffers.length - 1) totalSamples += pauseSamples;
  }

  const merged = new Float32Array(totalSamples);
  let offset = 0;
  for (let i = 0; i < audioBuffers.length; i++) {
    const channelData = audioBuffers[i].getChannelData(0);
    merged.set(channelData, offset);
    offset += channelData.length + pauseSamples;
  }

  const dataByteLength = totalSamples * 2;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  function writeStr(pos: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos + i, str.charCodeAt(i));
    }
  }

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataByteLength, true);

  let bytePos = 44;
  for (let i = 0; i < totalSamples; i++) {
    const s = Math.max(-1, Math.min(1, merged[i]));
    view.setInt16(bytePos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    bytePos += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

let activePlaybackToken = 0;

export async function playBilingualOpenAI(
  text: string,
  defaultLang: 'uk' | 'en' = 'en'
): Promise<void> {
  triggerHaptic('light');
  if (!voiceConfig.openaiKey) {
    playWithBrowserSpeechFallback(text, defaultLang);
    return;
  }

  const myToken = ++activePlaybackToken;
  const model = voiceConfig.openaiModel || 'gpt-4o-mini-tts';
  const fullCacheKey = `v2:${model}:${voiceConfig.openaiVoice}:${voiceConfig.speed}:${defaultLang}:${text}`;

  const cachedUrl = aiAudioCache.get(fullCacheKey);
  if (cachedUrl) {
    globalAudioPlayer.pause();
    globalAudioPlayer.src = cachedUrl;
    await globalAudioPlayer.play().catch(() => {});
    return;
  }

  const ctx = getAudioContext();
  globalAudioPlayer.pause();
  globalAudioPlayer.src = SILENT_WAV_URI;
  globalAudioPlayer.play().catch(() => {});

  const pillEl = document.getElementById('voice-label-pill');
  if (pillEl) pillEl.innerText = 'Loading...';

  try {
    const segments = splitBilingualSegments(text, defaultLang);
    if (!segments.length) return;

    const mp3Buffers = await Promise.all(
      segments.map((seg) => fetchSegmentMp3Buffer(seg))
    );
    if (myToken !== activePlaybackToken) return;

    let finalBlobUrl: string;
    if (mp3Buffers.length === 1) {
      const singleBlob = new Blob([mp3Buffers[0]], { type: 'audio/mpeg' });
      finalBlobUrl = URL.createObjectURL(singleBlob);
    } else if (ctx) {
      const decodedBuffers = await Promise.all(
        mp3Buffers.map((buf) => ctx.decodeAudioData(buf.slice(0)))
      );
      const wavBlob = stitchAudioBuffersToWavBlob(
        decodedBuffers,
        ctx.sampleRate,
        0.085
      );
      finalBlobUrl = URL.createObjectURL(wavBlob);
    } else {
      const fallbackBlob = new Blob(mp3Buffers, { type: 'audio/mpeg' });
      finalBlobUrl = URL.createObjectURL(fallbackBlob);
    }

    aiAudioCache.set(fullCacheKey, finalBlobUrl);
    if (myToken !== activePlaybackToken) return;

    globalAudioPlayer.src = finalBlobUrl;
    await globalAudioPlayer.play();
  } catch {
    playWithBrowserSpeechFallback(text, defaultLang);
  } finally {
    if (pillEl && myToken === activePlaybackToken) {
      pillEl.innerText = 'Choose Voice';
    }
  }
}

export async function speakUkrainian(text: string): Promise<void> {
  await playBilingualOpenAI(text, 'uk');
}

export async function speakEnglish(text: string): Promise<void> {
  await playBilingualOpenAI(text, 'en');
}

export async function speakExplanation(rank: number): Promise<void> {
  const item = FREQ_6000_DB[(rank || 1) - 1] || FREQ_6000_DB[0];
  if (!item) return;
  const gram = generateGrammarBreakdown(item);
  await playBilingualOpenAI(gram.spokenSummary, 'en');
}

export async function speakCorrectionExplanation(rank: number): Promise<void> {
  const item = FREQ_6000_DB[(rank || 1) - 1] || FREQ_6000_DB[0];
  if (!item) return;
  const corr = generateSentenceCorrection(item);
  await playBilingualOpenAI(
    `Correct Ukrainian sentence: ${corr.rightRu} ${corr.spokenExplanation}`,
    'en'
  );
}

// ============================================================================
// 2. TRIPLE ANKI FSRS ENGINE (UK->EN, EN->UK & SENTENCE CORRECTION)
// ============================================================================
interface FSRSCard {
  rank: number;
  state: 'new' | 'learning' | 'review';
  interval: number;
  ease: number;
  due: number;
}

interface SlovoDB {
  xp: number;
  drills: number;
  cards: FSRSCard[];
  en2ukCards: FSRSCard[];
  corrCards: FSRSCard[];
  unlockedMods: string[];
  passedMods: string[];
}

const MAX_RANK = FREQ_6000_DB.length;

function loadAndNormalizeDB(): SlovoDB {
  const raw = localStorage.getItem('slovo_ua_6000_anki_v1');
  let parsed: Partial<SlovoDB> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  const normalizeDeck = (arr: FSRSCard[] | undefined): FSRSCard[] => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set<number>();
    const valid: FSRSCard[] = [];
    for (const c of arr) {
      if (
        c &&
        typeof c.rank === 'number' &&
        c.rank >= 1 &&
        c.rank <= MAX_RANK &&
        !seen.has(c.rank)
      ) {
        seen.add(c.rank);
        valid.push(c);
      }
    }
    return valid;
  };

  const dbObj: SlovoDB = {
    xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
    drills: typeof parsed.drills === 'number' ? parsed.drills : 0,
    cards: normalizeDeck(parsed.cards),
    en2ukCards: normalizeDeck(parsed.en2ukCards),
    corrCards: normalizeDeck(parsed.corrCards),
    unlockedMods: Array.isArray(parsed.unlockedMods)
      ? parsed.unlockedMods
      : ['A0.1'],
    passedMods: Array.isArray(parsed.passedMods) ? parsed.passedMods : [],
  };

  if (dbObj.cards.length === 0) {
    const initialCount = Math.min(20, MAX_RANK);
    for (let r = 1; r <= initialCount; r++) {
      dbObj.cards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      dbObj.en2ukCards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      dbObj.corrCards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
    }
  }

  return dbObj;
}

const db: SlovoDB = loadAndNormalizeDB();

let currentAnkiCard: FSRSCard | null = null;
let ankiFlipped = false;

let currentEn2UkCard: FSRSCard | null = null;
let en2ukFlipped = false;
let lastEn2UkUserGuess = '';

let currentCorrCard: FSRSCard | null = null;
let corrFlipped = false;
let lastCorrUserGuess = '';

let currentInspectedRank = 1;

let lastObservedDbXp: number = db.xp;

const LANGO_REVIEW_PREFS_STORAGE_KEY = 'slovo_ua_review_prefs_v1';

function getTodayDateKeyForReview(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadReviewPrefs(): ReviewPrefsV1 {
  const todayKey = getTodayDateKeyForReview();
  const raw = localStorage.getItem(LANGO_REVIEW_PREFS_STORAGE_KEY);
  let parsed: Partial<ReviewPrefsV1> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }
  const validMode: ReviewModeId =
    parsed.preferredMode === 'srs' ||
    parsed.preferredMode === 'en2uk' ||
    parsed.preferredMode === 'correction' ||
    parsed.preferredMode === 'topics'
      ? parsed.preferredMode
      : 'mixed';
  const validSubMode: TopicDrillSubMode =
    parsed.topicSubMode === 'fillblank' ||
    parsed.topicSubMode === 'context' ||
    parsed.topicSubMode === 'grammar' ||
    parsed.topicSubMode === 'sentence' ||
    parsed.topicSubMode === 'listening'
      ? parsed.topicSubMode
      : 'all';
  const sameDay = parsed.dateKey === todayKey;

  return {
    version: 1,
    preferredMode: validMode,
    topicSubMode: validSubMode,
    topicCategoryId:
      typeof parsed.topicCategoryId === 'string' && parsed.topicCategoryId
        ? parsed.topicCategoryId
        : 'ALL',
    autoPlayAudio:
      typeof parsed.autoPlayAudio === 'boolean' ? parsed.autoPlayAudio : true,
    focusDimChrome: Boolean(parsed.focusDimChrome),
    dateKey: todayKey,
    newCardsIntroducedToday:
      sameDay && typeof parsed.newCardsIntroducedToday === 'number'
        ? Math.max(0, parsed.newCardsIntroducedToday)
        : 0,
    bonusNewAllowanceToday:
      sameDay && typeof parsed.bonusNewAllowanceToday === 'number'
        ? Math.max(0, parsed.bonusNewAllowanceToday)
        : 0,
  };
}

const reviewPrefs: ReviewPrefsV1 = loadReviewPrefs();

function ensureFreshReviewPrefsDay(): void {
  const todayKey = getTodayDateKeyForReview();
  if (reviewPrefs.dateKey !== todayKey) {
    reviewPrefs.dateKey = todayKey;
    reviewPrefs.newCardsIntroducedToday = 0;
    reviewPrefs.bonusNewAllowanceToday = 0;
    saveReviewPrefs();
  }
}

function saveReviewPrefs(): void {
  localStorage.setItem(
    LANGO_REVIEW_PREFS_STORAGE_KEY,
    JSON.stringify(reviewPrefs)
  );
}

function getSafeDailyGoalMinutesForReview(): number {
  try {
    return dailyGoalTracker?.dailyGoalMinutes || 20;
  } catch {
    return 20;
  }
}

function getActiveRemainingNewAllowance(): number {
  ensureFreshReviewPrefsDay();
  return getRemainingDailyNewAllowance(
    reviewPrefs,
    getSafeDailyGoalMinutesForReview()
  );
}

let activeReviewMode: ReviewModeId = reviewPrefs.preferredMode;
let activeReviewSession: ReviewSessionTracker = createFreshSessionTracker(0);
let isReviewBootReady = false;
let lastAutoSpokenCardKey = '';

let currentMixedEntry: MixedQueueEntry<FSRSCard> | null = null;
let mixedFlipped = false;
let lastMixedUserGuess = '';

interface TopicReviewDrillItem {
  id: string;
  kind: 'fillblank' | 'context' | 'grammar' | 'listening' | 'sentence';
  categoryTitle: string;
  promptLabel: string;
  promptUk?: string;
  promptEn: string;
  audioUk: string;
  options?: string[];
  correctOptionIdx?: number;
  scrambledWords?: string[];
  targetUk: string;
  explanation: string;
  vocabRank?: number;
}

let topicDrillCursor = 0;
let topicDrillRevealed = false;
let topicDrillChosenOptionIdx: number | null = null;
let topicDrillBuiltTiles: string[] = [];
let currentTopicDrillItem: TopicReviewDrillItem | null = null;

function isUserCurrentlyViewingReview(): boolean {
  if (!isReviewBootReady || typeof document === 'undefined') return false;
  if (lexiconExploreMode) return false;
  const srsOpen = !document
    .getElementById('tab-srs')
    ?.classList.contains('hidden');
  const en2ukOpen = !document
    .getElementById('tab-en2uk')
    ?.classList.contains('hidden');
  const corrOpen = !document
    .getElementById('tab-correction')
    ?.classList.contains('hidden');
  return Boolean(srsOpen || en2ukOpen || corrOpen);
}

function maybeAutoPlayReviewUk(cardKey: string, ukText: string): void {
  if (!reviewPrefs.autoPlayAudio) return;
  if (!isUserCurrentlyViewingReview()) return;
  if (!ukText || lastAutoSpokenCardKey === cardKey) return;
  lastAutoSpokenCardKey = cardKey;
  void speakUkrainian(ukText);
}

function ensureDailyGoalNewCardsSeeded(): void {
  const allowance = getActiveRemainingNewAllowance();
  if (allowance <= 0) return;
  const currentNewInSrs = db.cards.filter((c) => c.state === 'new').length;
  if (currentNewInSrs >= allowance) return;

  const needed = allowance - currentNewInSrs;
  let added = 0;
  const existingSrs = new Set(db.cards.map((c) => c.rank));
  const existingEn = new Set(db.en2ukCards.map((c) => c.rank));
  const existingCorr = new Set(db.corrCards.map((c) => c.rank));

  for (let r = 1; r <= MAX_RANK && added < needed; r++) {
    if (!existingSrs.has(r)) {
      db.cards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      if (!existingEn.has(r)) {
        db.en2ukCards.push({
          rank: r,
          state: 'new',
          interval: 0,
          ease: 2.5,
          due: Date.now(),
        });
      }
      if (!existingCorr.has(r)) {
        db.corrCards.push({
          rank: r,
          state: 'new',
          interval: 0,
          ease: 2.5,
          due: Date.now(),
        });
      }
      added += 1;
    }
  }

  if (added > 0) {
    saveDB();
    renderSrsCatalog6000();
  }
}

function saveDB(): void {
  localStorage.setItem('slovo_ua_6000_anki_v1', JSON.stringify(db));
  if (db.xp > lastObservedDbXp) {
    const deltaXp = db.xp - lastObservedDbXp;
    lastObservedDbXp = db.xp;
    recordDailyStudyActivity(Math.min(4, Math.max(0.35, deltaXp / 30)));
  } else {
    lastObservedDbXp = db.xp;
  }
  updateSidebarStats();
}

function applyFSRSGrade(card: FSRSCard | null, grade: 1 | 2 | 3 | 4): void {
  if (!card) return;
  triggerHaptic('heavy');
  const wasNew = card.state === 'new';
  const now = Date.now();
  const DAY_MS = 86400000;
  if (grade === 1) {
    card.state = 'learning';
    card.interval = 0;
    card.ease = Math.max(1.3, card.ease - 0.2);
    card.due = now + 30000;
  } else if (grade === 2) {
    card.state = 'review';
    card.interval =
      card.interval === 0 ? 1 : Math.max(1, Math.round(card.interval * 1.2));
    card.ease = Math.max(1.3, card.ease - 0.15);
    card.due = now + card.interval * DAY_MS;
  } else if (grade === 3) {
    card.state = 'review';
    card.interval =
      card.interval === 0
        ? 1
        : Math.max(1, Math.round(card.interval * card.ease));
    card.due = now + card.interval * DAY_MS;
  } else if (grade === 4) {
    card.state = 'review';
    card.interval =
      card.interval === 0
        ? 4
        : Math.max(2, Math.round(card.interval * card.ease * 1.3));
    card.ease += 0.15;
    card.due = now + card.interval * DAY_MS;
  }

  ensureFreshReviewPrefsDay();
  if (wasNew) {
    reviewPrefs.newCardsIntroducedToday += 1;
    saveReviewPrefs();
  }
  recordSessionGrade(activeReviewSession, grade, wasNew, 15);
  lastAutoSpokenCardKey = '';

  db.xp += 15;
  db.drills += 1;
  saveDB();
  syncReviewControlsUI();
}

function getNextIntervals(card: FSRSCard): {
  hard: number;
  good: number;
  easy: number;
} {
  return {
    hard:
      card.interval === 0 ? 1 : Math.max(1, Math.round(card.interval * 1.2)),
    good:
      card.interval === 0
        ? 1
        : Math.max(1, Math.round(card.interval * card.ease)),
    easy:
      card.interval === 0
        ? 4
        : Math.max(2, Math.round(card.interval * card.ease * 1.3)),
  };
}

function escapeSingleQuotes(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeAttrHtml(raw: string): string {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtml(raw: string): string {
  return escapeAttrHtml(raw);
}

function renderCardTopProgressHtml(
  modeBadge: string,
  metaDetail: string,
  remainingQueueCount: number
): string {
  const done = activeReviewSession.cardsReviewed;
  const total = Math.max(1, done + remainingQueueCount);
  const currentNum = Math.min(total, done + 1);
  const pct = Math.min(100, Math.max(4, Math.round((done / total) * 100)));
  const remNew = getActiveRemainingNewAllowance();

  return `
    <div class="review-card-topbar">
      <div class="review-card-meta-row">
        <div class="review-card-kicker">
          <span class="review-card-kicker-mode">${escapeAttrHtml(modeBadge)}</span>
          <span aria-hidden="true">·</span>
          <span>${metaDetail}</span>
        </div>
        <span>Card ${currentNum} of ${total} · ${remNew} new left today</span>
      </div>
      <div class="review-progress-thin" aria-hidden="true">
        <svg class="review-progress-svg" viewBox="0 0 100 4" preserveAspectRatio="none">
          <rect class="review-progress-svg-rect" width="${pct}" height="4" rx="2" />
        </svg>
      </div>
    </div>
  `;
}

function renderPlainGradeButtonsHtml(
  intervals: { hard: number; good: number; easy: number },
  handlerName: string
): string {
  const specs = formatGradeButtonSpecs(intervals);
  return `
    <div class="review-grade-prompt">
      <span>How well did you remember?</span>
      <span>Keys 1–4 · R to replay audio</span>
    </div>
    <div class="anki-grade-bar">
      ${specs
        .map(
          (sp) => `
            <button type="button" class="anki-btn ${sp.toneClass}" onclick="${handlerName}(${sp.grade})">
              <span class="review-grade-btn-main">${escapeAttrHtml(sp.label)}</span>
              <small class="review-grade-btn-sub"><span>${escapeAttrHtml(sp.hint)}</span><kbd data-slot="kbd">${sp.shortcut}</kbd></small>
            </button>
          `
        )
        .join('')}
    </div>
  `;
}

function renderReviewSessionSummaryHtml(): string {
  const summary = computeSessionSummaryMetrics(activeReviewSession);
  const dailyCap = getDailyNewCardCap(getSafeDailyGoalMinutesForReview());
  const introducedToday = reviewPrefs.newCardsIntroducedToday;
  const otherModeTarget = activeReviewMode === 'topics' ? 'mixed' : 'topics';
  const otherModeLabel =
    activeReviewMode === 'topics'
      ? 'Practice Mixed cards'
      : 'Practice Topic drills';

  return `
    <section class="review-summary-card" aria-label="Review Session Summary">
      <div>
        <div class="review-summary-kicker">
          <span>Session summary</span>
          <span aria-hidden="true">·</span>
          <span>Paced by your ${getSafeDailyGoalMinutesForReview()}-min daily goal</span>
        </div>
        <h2 class="review-summary-title">${escapeAttrHtml(summary.headline)}</h2>
        <p class="review-summary-desc">${escapeAttrHtml(summary.subheadline)}</p>
      </div>

      <div class="review-summary-stats">
        <div>
          <div class="review-summary-stat-val">${summary.totalReviewed}</div>
          <div class="review-summary-stat-lbl">Cards reviewed</div>
        </div>
        <div>
          <div class="review-summary-stat-val">${summary.retentionPct}%</div>
          <div class="review-summary-stat-lbl">Remembered cleanly</div>
        </div>
        <div>
          <div class="review-summary-stat-val">${introducedToday}/${dailyCap}</div>
          <div class="review-summary-stat-lbl">New words today</div>
        </div>
        <div>
          <div class="review-summary-stat-val">+${summary.xpEarned} XP</div>
          <div class="review-summary-stat-lbl">${summary.minutesAdded > 0 ? `~${summary.minutesAdded} min added` : 'Up to date'}</div>
        </div>
      </div>

      ${
        summary.totalReviewed > 0
          ? `
            <div class="review-summary-breakdown">
              <span>Breakdown:</span>
              <span>Again ${activeReviewSession.againCount}</span>
              <span aria-hidden="true">·</span>
              <span>Hard ${activeReviewSession.hardCount}</span>
              <span aria-hidden="true">·</span>
              <span>Good ${activeReviewSession.goodCount}</span>
              <span aria-hidden="true">·</span>
              <span>Easy ${activeReviewSession.easyCount}</span>
            </div>
          `
          : ''
      }

      <div class="cluster">
        <button type="button" class="btn" onclick="continueCurrentCourseModule()">Continue course →</button>
        <button type="button" class="btn btn-sec" onclick="unlockBonusNewCards(5)">+ Study 5 bonus new words</button>
        <button type="button" class="btn btn-sec" onclick="selectReviewMode('${otherModeTarget}')">${otherModeLabel}</button>
        <button type="button" class="btn btn--ghost" onclick="switchTab('today')">Back to Today</button>
      </div>
    </section>
  `;
}

function renderUk2EnCardFaces(
  card: FSRSCard,
  isFlipped: boolean,
  modeLabel: string,
  remainingQueueCount: number,
  flipFnName: string,
  gradeFnName: string
): { bodyHtml: string; actionHtml: string } {
  const item = FREQ_6000_DB[card.rank - 1] || FREQ_6000_DB[0];
  const phon = generateUkrainianPhonetics(item.ru);
  const gram = generateGrammarBreakdown(item);
  const metaDetail = `#${item.rank} · Level ${escapeAttrHtml(item.level)} · ${escapeAttrHtml(item.pos)}`;
  const topBar = renderCardTopProgressHtml(
    modeLabel,
    metaDetail,
    remainingQueueCount
  );

  if (!isFlipped) {
    if (activeReviewMode === 'srs' || activeReviewMode === 'mixed') {
      maybeAutoPlayReviewUk(`front-srs-${card.rank}-${activeReviewSession.cardsReviewed}`, item.ru);
    }
    return {
      bodyHtml: `
        ${topBar}
        <div class="review-front-surface review-front-surface--tappable" onclick="${flipFnName}()" role="button" tabindex="0" aria-label="Tap or press Space to reveal meaning">
          <div class="review-uk-hero word">${item.ru}</div>
          <div class="review-phonetic-line">
            Sounds like <b>${escapeAttrHtml(phon.plainGuide)}</b>
            <span aria-hidden="true"> · </span>
            <span class="review-ipa">${escapeAttrHtml(phon.ipa)}</span>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(item.ru)}')">Listen</button>
            <button type="button" class="btn btn--ghost btn--sm" onclick="event.stopPropagation(); inspectWordDeep(${item.rank}, false, true)">Word forms</button>
          </div>
          <div class="review-tap-hint">Tap card or press Space to reveal</div>
        </div>
      `,
      actionHtml: `
        <button type="button" class="btn anki-reveal-btn" onclick="${flipFnName}()">
          Show answer <kbd class="vb-kbd review-kbd-on-primary" data-slot="kbd">Space</kbd>
        </button>
      `,
    };
  }

  const iv = getNextIntervals(card);
  return {
    bodyHtml: `
      ${topBar}
      <div class="review-back-surface">
        <div class="review-back-header">
          <div>
            <div class="review-back-uk word" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">${item.ru}</div>
            <div class="review-back-en">${escapeAttrHtml(item.en)}</div>
            <div class="review-phonetic-line">
              Sounds like <b>${escapeAttrHtml(phon.plainGuide)}</b>
              <span aria-hidden="true"> · </span>
              <span class="review-ipa">${escapeAttrHtml(phon.ipa)}</span>
            </div>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">Listen</button>
            <button type="button" class="btn btn-sec btn--sm" onclick="speakExplanation(${item.rank})">Explain</button>
            <button type="button" class="btn btn--ghost btn--sm" onclick="inspectWordDeep(${item.rank}, false, true)">Word forms</button>
          </div>
        </div>

        <div class="hint"><b>${escapeAttrHtml(gram.summaryTag)}</b> — ${escapeAttrHtml(gram.usageNote)}</div>

        <div class="example-chip" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
          <div class="word">${gram.exampleRu}</div>
          <div class="hint">${escapeAttrHtml(gram.exampleEn)}</div>
        </div>

        <details class="review-forms-details">
          <summary class="review-forms-summary">Word forms &amp; cases</summary>
          <div class="review-forms-body">${gram.tableHtml}</div>
        </details>
      </div>
    `,
    actionHtml: renderPlainGradeButtonsHtml(iv, gradeFnName),
  };
}

function renderEn2UkCardFaces(
  card: FSRSCard,
  isFlipped: boolean,
  userGuess: string,
  inputId: string,
  modeLabel: string,
  remainingQueueCount: number,
  flipFnName: string,
  gradeFnName: string
): { bodyHtml: string; actionHtml: string } {
  const item = FREQ_6000_DB[card.rank - 1] || FREQ_6000_DB[0];
  const phon = generateUkrainianPhonetics(item.ru);
  const gram = generateGrammarBreakdown(item);
  const metaDetail = `#${item.rank} · Level ${escapeAttrHtml(item.level)} · ${escapeAttrHtml(item.pos)}`;
  const topBar = renderCardTopProgressHtml(
    modeLabel,
    metaDetail,
    remainingQueueCount
  );

  if (!isFlipped) {
    return {
      bodyHtml: `
        ${topBar}
        <div class="review-front-surface review-front-surface--tappable" onclick="if(event.target.tagName!=='INPUT') ${flipFnName}()">
          <div class="review-en-hero">${escapeAttrHtml(item.en)}</div>
          <div class="hint">Say it aloud in Ukrainian, or type below to check spelling</div>
          <div class="review-input-wrap" onclick="event.stopPropagation()">
            <input id="${inputId}" class="answer-line" placeholder="Type in Ukrainian (optional)…" autocomplete="off" autocapitalize="none" spellcheck="false" onkeydown="if(event.key==='Enter'){event.preventDefault(); ${flipFnName}();}">
          </div>
          <div class="review-tap-hint">Tap card or press Space to reveal · Enter checks spelling</div>
        </div>
      `,
      actionHtml: `
        <button type="button" class="btn anki-reveal-btn" onclick="${flipFnName}()">
          Show Ukrainian answer <kbd class="vb-kbd review-kbd-on-primary" data-slot="kbd">Space</kbd>
        </button>
      `,
    };
  }

  const iv = getNextIntervals(card);
  const cleanGuestTrim = userGuess.trim();
  const validation = cleanGuestTrim
    ? validateUkrainianAnswer(cleanGuestTrim, item.ru)
    : null;
  const guessBannerHtml = validation
    ? validation.isCorrect
      ? `<div class="review-guess-banner review-guess-banner--right">Right — you wrote «${escapeAttrHtml(cleanGuestTrim)}»</div>`
      : `<div class="review-guess-banner review-guess-banner--check">You wrote «${escapeAttrHtml(cleanGuestTrim)}» · Expected <span class="word">${item.ru}</span></div>`
    : '';

  return {
    bodyHtml: `
      ${topBar}
      <div class="review-back-surface">
        ${guessBannerHtml}
        <div class="review-back-header">
          <div>
            <div class="review-back-uk word" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">${item.ru}</div>
            <div class="review-back-en">${escapeAttrHtml(item.en)}</div>
            <div class="review-phonetic-line">
              Sounds like <b>${escapeAttrHtml(phon.plainGuide)}</b>
              <span aria-hidden="true"> · </span>
              <span class="review-ipa">${escapeAttrHtml(phon.ipa)}</span>
            </div>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">Listen</button>
            <button type="button" class="btn btn-sec btn--sm" onclick="speakExplanation(${item.rank})">Explain</button>
            <button type="button" class="btn btn--ghost btn--sm" onclick="inspectWordDeep(${item.rank}, false, true)">Word forms</button>
          </div>
        </div>

        <div class="example-chip" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
          <div class="word">${gram.exampleRu}</div>
          <div class="hint">${escapeAttrHtml(gram.exampleEn)}</div>
        </div>

        <details class="review-forms-details">
          <summary class="review-forms-summary">Word forms &amp; cases</summary>
          <div class="review-forms-body">${gram.tableHtml}</div>
        </details>
      </div>
    `,
    actionHtml: renderPlainGradeButtonsHtml(iv, gradeFnName),
  };
}

function renderCorrectionCardFaces(
  card: FSRSCard,
  isFlipped: boolean,
  userGuess: string,
  inputId: string,
  modeLabel: string,
  remainingQueueCount: number,
  flipFnName: string,
  gradeFnName: string
): { bodyHtml: string; actionHtml: string; rightSentenceUk: string } {
  const item = FREQ_6000_DB[card.rank - 1] || FREQ_6000_DB[0];
  const corr = generateSentenceCorrection(item);
  const gram = generateGrammarBreakdown(item);
  const metaDetail = `#${item.rank} · <span class="word">${item.ru}</span> (${escapeAttrHtml(item.en)})`;
  const topBar = renderCardTopProgressHtml(
    modeLabel,
    metaDetail,
    remainingQueueCount
  );

  if (!isFlipped) {
    const highlightedWrong = corr.wrongRu.replace(
      /\*([^*]+)\*/,
      `<span class="review-wrong-token">$1</span>`
    );
    return {
      rightSentenceUk: corr.rightRu,
      bodyHtml: `
        ${topBar}
        <div class="review-front-surface review-front-surface--tappable" onclick="if(event.target.tagName!=='INPUT') ${flipFnName}()">
          <div class="review-sentence-hero word">${highlightedWrong}</div>
          <div class="hint">“${escapeAttrHtml(corr.enMeaning)}”</div>
          <div class="review-input-wrap" onclick="event.stopPropagation()">
            <input id="${inputId}" class="answer-line" placeholder="Repair «${escapeAttrHtml(corr.wrongWord)}» (optional)…" autocomplete="off" autocapitalize="none" spellcheck="false" onkeydown="if(event.key==='Enter'){event.preventDefault(); ${flipFnName}();}">
          </div>
          <div class="review-tap-hint">Tap card or press Space to reveal corrected sentence</div>
        </div>
      `,
      actionHtml: `
        <button type="button" class="btn anki-reveal-btn" onclick="${flipFnName}()">
          Show corrected sentence <kbd class="vb-kbd review-kbd-on-primary" data-slot="kbd">Space</kbd>
        </button>
      `,
    };
  }

  const iv = getNextIntervals(card);
  const cleanGuessTrim = userGuess.trim();
  const validation = cleanGuessTrim
    ? validateUkrainianAnswer(cleanGuessTrim, corr.rightWord)
    : null;
  const guessBannerHtml = validation
    ? validation.isCorrect
      ? `<div class="review-guess-banner review-guess-banner--right">Right — «${escapeAttrHtml(cleanGuessTrim)}»</div>`
      : `<div class="review-guess-banner review-guess-banner--check">You wrote «${escapeAttrHtml(cleanGuessTrim)}» · Correct form: <span class="word">${corr.rightWord}</span></div>`
    : '';

  return {
    rightSentenceUk: corr.rightRu,
    bodyHtml: `
      ${topBar}
      <div class="review-back-surface">
        ${guessBannerHtml}
        <div class="review-back-header">
          <div>
            <div class="hint">${escapeAttrHtml(corr.ruleTitle)}</div>
            <div class="review-sentence-hero word" onclick="speakUkrainian('${escapeSingleQuotes(corr.rightRu)}')">
              ${corr.rightRu.replace(corr.rightWord, `<mark class="mark">${corr.rightWord}</mark>`)}
            </div>
            <div class="hint">“${escapeAttrHtml(corr.enMeaning)}”</div>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(corr.rightRu)}')">Listen</button>
            <button type="button" class="btn btn-sec btn--sm" onclick="speakCorrectionExplanation(${item.rank})">Explain</button>
            <button type="button" class="btn btn--ghost btn--sm" onclick="inspectWordDeep(${item.rank}, false, true)">Word forms</button>
          </div>
        </div>

        <div class="review-rule-note">
          <b>${escapeAttrHtml(corr.wrongWord)} → <span class="word">${corr.rightWord}</span>:</b> ${escapeAttrHtml(corr.explanation)}
        </div>

        <details class="review-forms-details">
          <summary class="review-forms-summary">Word forms &amp; cases</summary>
          <div class="review-forms-body">${gram.tableHtml}</div>
        </details>
      </div>
    `,
    actionHtml: renderPlainGradeButtonsHtml(iv, gradeFnName),
  };
}

// UNIFIED MIXED MODE & TOPIC DRILLS WORKSPACE
function buildTopicReviewDrillPool(): TopicReviewDrillItem[] {
  const catFilter = reviewPrefs.topicCategoryId;
  const subMode = reviewPrefs.topicSubMode;
  const catLookup = new Map(EVERYDAY_CATEGORIES.map((c) => [c.id, c.title]));

  const fbItems: TopicReviewDrillItem[] = FILL_BLANK_EXERCISES.filter(
    (x) => catFilter === 'ALL' || x.categoryId === catFilter
  ).map((fb, idx) => {
    const opts = [fb.answerUk, ...fb.distractors];
    const rot = idx % opts.length;
    const rotated = opts.map((_, i) => opts[(i + rot) % opts.length]);
    const fullSentence = fb.sentenceWithBlank.replace('___', fb.answerUk);
    return {
      id: `fb-${fb.id}`,
      kind: 'fillblank',
      categoryTitle: catLookup.get(fb.categoryId) || 'Everyday Ukrainian',
      promptLabel: 'Fill in the blank',
      promptUk: fb.sentenceWithBlank,
      promptEn: fb.englishTranslation,
      audioUk: fullSentence,
      options: rotated,
      correctOptionIdx: rotated.indexOf(fb.answerUk),
      targetUk: fullSentence,
      explanation: fb.grammarHint,
    };
  });

  const ctxItems: TopicReviewDrillItem[] = CONTEXTUAL_CHOICE_EXERCISES.filter(
    (x) => catFilter === 'ALL' || x.categoryId === catFilter
  ).map((cx) => ({
    id: `ctx-${cx.id}`,
    kind: 'context',
    categoryTitle: catLookup.get(cx.categoryId) || 'Everyday Ukrainian',
    promptLabel: 'Natural response in context',
    promptUk: cx.sentenceUk,
    promptEn: cx.situationEn,
    audioUk: cx.options[cx.correctIndex] || cx.sentenceUk,
    options: cx.options,
    correctOptionIdx: cx.correctIndex,
    targetUk: cx.sentenceUk.includes('___')
      ? cx.sentenceUk.replace('___', cx.options[cx.correctIndex] || '')
      : `${cx.sentenceUk} — ${cx.options[cx.correctIndex] || ''}`,
    explanation: cx.explanation,
  }));

  const gramItems: TopicReviewDrillItem[] = GRAMMAR_AWARE_EXERCISES.filter(
    (x) => catFilter === 'ALL' || x.categoryId === catFilter
  ).map((gr) => ({
    id: `gr-${gr.id}`,
    kind: 'grammar',
    categoryTitle: catLookup.get(gr.categoryId) || 'Everyday Ukrainian',
    promptLabel: `${gr.baseWordUk} (${gr.baseWordEn}) · ${gr.targetGrammarForm}`,
    promptUk: gr.promptUk,
    promptEn: gr.promptEn,
    audioUk: gr.promptUk.replace('___', gr.answerUk),
    options: gr.options,
    correctOptionIdx: Math.max(0, gr.options.indexOf(gr.answerUk)),
    targetUk: gr.promptUk.replace('___', gr.answerUk),
    explanation: gr.explanation,
  }));

  const sentItems: TopicReviewDrillItem[] =
    SENTENCE_CONSTRUCTION_EXERCISES.filter(
      (x) => catFilter === 'ALL' || x.categoryId === catFilter
    ).map((sc) => ({
      id: `sc-${sc.id}`,
      kind: 'sentence',
      categoryTitle: catLookup.get(sc.categoryId) || 'Everyday Ukrainian',
      promptLabel: 'Build the Ukrainian sentence',
      promptEn: sc.promptEn,
      audioUk: sc.targetUk,
      scrambledWords: sc.scrambledWords,
      targetUk: sc.targetUk,
      explanation: sc.grammarExplanation,
    }));

  const listenCatIds =
    catFilter === 'ALL'
      ? EVERYDAY_CATEGORIES.slice(0, 6).map((c) => c.id)
      : [catFilter];
  const listenItems: TopicReviewDrillItem[] = [];
  listenCatIds.forEach((cid) => {
    const words = getCategoryVocabItems(cid).slice(0, 4);
    words.forEach((w, idx) => {
      const distractors = FREQ_6000_DB.filter(
        (d) => d.rank !== w.rank && d.pos === w.pos
      )
        .slice(idx * 3, idx * 3 + 3)
        .map((d) => d.en);
      const rawOpts = [
        w.en,
        ...(distractors.length >= 3
          ? distractors
          : ['morning', 'water', 'street']),
      ].slice(0, 4);
      const rot = idx % rawOpts.length;
      const rotated = rawOpts.map((_, i) => rawOpts[(i + rot) % rawOpts.length]);
      const exUk = w.exampleUk || w.exUk || w.ru;
      const exEn = w.exampleEn || w.exEn || w.en;
      listenItems.push({
        id: `lis-${cid}-${w.rank}`,
        kind: 'listening',
        categoryTitle: catLookup.get(cid) || 'Everyday Ukrainian',
        promptLabel: 'Listen & choose meaning',
        promptEn: 'Listen to the Ukrainian word and choose its English meaning',
        audioUk: w.ru,
        options: rotated,
        correctOptionIdx: rotated.indexOf(w.en),
        targetUk: `${w.ru} — ${w.en}`,
        explanation: `Example: ${exUk} (${exEn})`,
        vocabRank: w.rank,
      });
    });
  });

  if (subMode === 'fillblank') return fbItems.length ? fbItems : FILL_BLANK_EXERCISES.slice(0, 12).map((fb) => ({
    id: `fb-${fb.id}`,
    kind: 'fillblank',
    categoryTitle: catLookup.get(fb.categoryId) || 'Everyday Ukrainian',
    promptLabel: 'Fill in the blank',
    promptUk: fb.sentenceWithBlank,
    promptEn: fb.englishTranslation,
    audioUk: fb.sentenceWithBlank.replace('___', fb.answerUk),
    options: [fb.answerUk, ...fb.distractors],
    correctOptionIdx: 0,
    targetUk: fb.sentenceWithBlank.replace('___', fb.answerUk),
    explanation: fb.grammarHint,
  }));
  if (subMode === 'context') return ctxItems;
  if (subMode === 'grammar') return gramItems;
  if (subMode === 'sentence') return sentItems;
  if (subMode === 'listening') return listenItems;

  const combined: TopicReviewDrillItem[] = [];
  const maxLen = Math.max(
    fbItems.length,
    ctxItems.length,
    gramItems.length,
    listenItems.length,
    sentItems.length
  );
  for (let i = 0; i < maxLen && combined.length < 36; i++) {
    if (i < fbItems.length) combined.push(fbItems[i]);
    if (i < ctxItems.length) combined.push(ctxItems[i]);
    if (i < gramItems.length) combined.push(gramItems[i]);
    if (i < listenItems.length) combined.push(listenItems[i]);
    if (i < sentItems.length) combined.push(sentItems[i]);
  }
  return combined;
}

function renderTopicReviewStage(): void {
  const mount = document.getElementById('review-unified-mount');
  const stageSrs = document.getElementById('stage-srs');
  if (!mount || !stageSrs) return;

  stageSrs.classList.add('hidden');
  mount.classList.remove('hidden');

  if (activeReviewSession.completed) {
    mount.innerHTML = renderReviewSessionSummaryHtml();
    return;
  }

  const pool = buildTopicReviewDrillPool();
  const sessionTarget = Math.min(12, Math.max(1, pool.length));
  if (!pool.length || activeReviewSession.cardsReviewed >= sessionTarget) {
    activeReviewSession.completed = true;
    syncReviewControlsUI();
    mount.innerHTML = renderReviewSessionSummaryHtml();
    return;
  }

  const item = pool[topicDrillCursor % pool.length];
  currentTopicDrillItem = item;
  const remaining = Math.max(1, sessionTarget - activeReviewSession.cardsReviewed);
  const topBar = renderCardTopProgressHtml(
    `Topic drill · ${item.promptLabel}`,
    item.categoryTitle,
    remaining
  );

  const toolbarHtml = `
    <div class="review-topic-toolbar">
      <div class="review-topic-pills" role="group" aria-label="Topic Drill Type">
        ${TOPIC_DRILL_SUBMODES.map(
          (sm) => `
            <button type="button" class="review-topic-pill ${reviewPrefs.topicSubMode === sm.id ? 'active' : ''}" onclick="selectReviewTopicSubMode('${sm.id}')">${escapeAttrHtml(sm.label)}</button>
          `
        ).join('')}
      </div>
      <div class="cluster">
        <select class="input-box input-filter" aria-label="Filter Topic Category" onchange="selectReviewTopicCategory(this.value)">
          <option value="ALL" ${reviewPrefs.topicCategoryId === 'ALL' ? 'selected' : ''}>All 27 topics</option>
          ${EVERYDAY_CATEGORIES.map(
            (cat) => `
              <option value="${cat.id}" ${reviewPrefs.topicCategoryId === cat.id ? 'selected' : ''}>${escapeAttrHtml(cat.title)}</option>
            `
          ).join('')}
        </select>
        <button type="button" class="btn btn--ghost btn--sm" onclick="switchTab('vocab')">Browse catalog →</button>
      </div>
    </div>
  `;

  if (!topicDrillRevealed) {
    if (item.kind === 'listening') {
      maybeAutoPlayReviewUk(`topic-listen-${item.id}-${topicDrillCursor}`, item.audioUk);
    }

    const mcHtml = item.options
      ? `
        <div class="review-mc-list">
          ${item.options
            .map(
              (opt, idx) => `
                <button type="button" class="option-btn" onclick="answerReviewTopicMc(${idx})">
                  <span>${idx + 1}. ${escapeAttrHtml(opt)}</span>
                </button>
              `
            )
            .join('')}
        </div>
      `
      : '';

    const tilesHtml =
      item.kind === 'sentence' && item.scrambledWords
        ? `
          <div class="review-tile-well">
            ${
              topicDrillBuiltTiles.length > 0
                ? escapeAttrHtml(topicDrillBuiltTiles.join(' '))
                : '<span class="hint">Tap Ukrainian words below in order…</span>'
            }
          </div>
          <div class="review-tile-bank">
            ${item.scrambledWords
              .map(
                (w) => `
                  <button type="button" class="btn btn-sec btn--sm" onclick="addReviewTopicTile('${escapeSingleQuotes(w)}')">${escapeAttrHtml(w)}</button>
                `
              )
              .join('')}
          </div>
          ${
            topicDrillBuiltTiles.length > 0
              ? `<button type="button" class="btn btn--ghost btn--sm" onclick="resetReviewTopicTiles()">Reset words</button>`
              : ''
          }
        `
        : '';

    mount.innerHTML = `
      ${toolbarHtml}
      <div class="anki-stage review-stage-card">
        ${topBar}
        <div class="review-front-surface">
          ${
            item.kind === 'listening'
              ? `
                <button type="button" class="btn" onclick="speakUkrainian('${escapeSingleQuotes(item.audioUk)}')">Listen to Ukrainian audio</button>
                <div class="hint">${escapeAttrHtml(item.promptEn)}</div>
              `
              : item.promptUk
                ? `
                  <div class="review-sentence-hero word">${escapeAttrHtml(item.promptUk)}</div>
                  <div class="hint">“${escapeAttrHtml(item.promptEn)}”</div>
                `
                : `<div class="review-en-hero">${escapeAttrHtml(item.promptEn)}</div>`
          }
          ${mcHtml}
          ${tilesHtml}
        </div>
        <div class="anki-action-sticky">
          <button type="button" class="btn anki-reveal-btn" onclick="revealReviewTopicCard()">
            ${item.kind === 'sentence' ? 'Check sentence' : 'Show answer'}
            <kbd class="vb-kbd review-kbd-on-primary" data-slot="kbd">Space</kbd>
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Revealed state for Topic drill
  let outcomeBanner = '';
  if (
    typeof topicDrillChosenOptionIdx === 'number' &&
    typeof item.correctOptionIdx === 'number' &&
    item.options
  ) {
    const pickedText = item.options[topicDrillChosenOptionIdx] || '';
    const rightText = item.options[item.correctOptionIdx] || '';
    outcomeBanner =
      topicDrillChosenOptionIdx === item.correctOptionIdx
        ? `<div class="review-guess-banner review-guess-banner--right">Right — «${escapeAttrHtml(pickedText)}»</div>`
        : `<div class="review-guess-banner review-guess-banner--check">You chose «${escapeAttrHtml(pickedText)}» · Answer: <b>${escapeAttrHtml(rightText)}</b></div>`;
  } else if (item.kind === 'sentence' && topicDrillBuiltTiles.length > 0) {
    const builtStr = topicDrillBuiltTiles.join(' ');
    const check = validateUkrainianAnswer(builtStr, item.targetUk);
    outcomeBanner = check.isCorrect
      ? `<div class="review-guess-banner review-guess-banner--right">Right — «${escapeAttrHtml(builtStr)}»</div>`
      : `<div class="review-guess-banner review-guess-banner--check">You built «${escapeAttrHtml(builtStr)}»</div>`;
  }

  mount.innerHTML = `
    ${toolbarHtml}
    <div class="anki-stage review-stage-card">
      ${topBar}
      <div class="review-back-surface">
        ${outcomeBanner}
        <div class="review-back-header">
          <div>
            <div class="hint">${escapeAttrHtml(item.categoryTitle)} · ${escapeAttrHtml(item.promptLabel)}</div>
            <div class="review-sentence-hero word" onclick="speakUkrainian('${escapeSingleQuotes(item.audioUk)}')">${escapeAttrHtml(item.targetUk)}</div>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(item.audioUk)}')">Listen</button>
            ${
              item.vocabRank
                ? `<button type="button" class="btn btn--ghost btn--sm" onclick="inspectWordDeep(${item.vocabRank}, false, true)">Word forms</button>`
                : ''
            }
          </div>
        </div>
        <div class="review-rule-note">${escapeAttrHtml(item.explanation)}</div>
      </div>
      <div class="anki-action-sticky">
        ${renderPlainGradeButtonsHtml({ hard: 1, good: 3, easy: 5 }, 'gradeReviewTopicCard')}
      </div>
    </div>
  `;
}

export function renderMixedReviewStage(): void {
  const mount = document.getElementById('review-unified-mount');
  const stageSrs = document.getElementById('stage-srs');
  if (!mount || !stageSrs) return;

  stageSrs.classList.add('hidden');
  mount.classList.remove('hidden');

  if (activeReviewSession.completed) {
    currentMixedEntry = null;
    mount.innerHTML = renderReviewSessionSummaryHtml();
    return;
  }

  const now = Date.now();
  const mixedSel = buildMixedActionableQueue(
    {
      srs: db.cards,
      en2uk: db.en2ukCards,
      correction: db.corrCards,
    },
    now,
    getActiveRemainingNewAllowance()
  );

  if (!mixedSel.items.length) {
    currentMixedEntry = null;
    mount.innerHTML = renderReviewSessionSummaryHtml();
    return;
  }

  currentMixedEntry = mixedSel.items[0];
  const remCount = mixedSel.items.length;

  let faces: { bodyHtml: string; actionHtml: string };
  if (currentMixedEntry.deck === 'srs') {
    faces = renderUk2EnCardFaces(
      currentMixedEntry.card,
      mixedFlipped,
      'Mixed · UK→EN',
      remCount,
      'flipMixedCard',
      'gradeMixedCard'
    );
  } else if (currentMixedEntry.deck === 'en2uk') {
    faces = renderEn2UkCardFaces(
      currentMixedEntry.card,
      mixedFlipped,
      lastMixedUserGuess,
      'mixed-en2uk-guess',
      'Mixed · EN→UK',
      remCount,
      'flipMixedCard',
      'gradeMixedCard'
    );
  } else {
    faces = renderCorrectionCardFaces(
      currentMixedEntry.card,
      mixedFlipped,
      lastMixedUserGuess,
      'mixed-corr-guess',
      'Mixed · Sentences',
      remCount,
      'flipMixedCard',
      'gradeMixedCard'
    );
  }

  mount.innerHTML = `
    <div class="anki-stage review-stage-card">
      <div>${faces.bodyHtml}</div>
      <div id="mixed-action-area" class="anki-action-sticky">${faces.actionHtml}</div>
    </div>
  `;
}

export function flipMixedCard(): void {
  if (!currentMixedEntry || mixedFlipped) return;
  triggerHaptic('light');
  if (currentMixedEntry.deck === 'en2uk') {
    const inp = document.getElementById(
      'mixed-en2uk-guess'
    ) as HTMLInputElement | null;
    lastMixedUserGuess = inp ? inp.value.trim() : '';
  } else if (currentMixedEntry.deck === 'correction') {
    const inp = document.getElementById(
      'mixed-corr-guess'
    ) as HTMLInputElement | null;
    lastMixedUserGuess = inp ? inp.value.trim() : '';
  }

  mixedFlipped = true;
  renderMixedReviewStage();

  const item = FREQ_6000_DB[currentMixedEntry.card.rank - 1];
  inspectWordDeep(currentMixedEntry.card.rank, false, false);
  if (item && reviewPrefs.autoPlayAudio) {
    if (currentMixedEntry.deck === 'en2uk') {
      void speakUkrainian(item.ru);
    } else if (currentMixedEntry.deck === 'correction') {
      const corr = generateSentenceCorrection(item);
      void speakUkrainian(corr.rightRu);
    }
  }
  ensureActionButtonsVisible('mixed-action-area');
}

export function gradeMixedCard(g: 1 | 2 | 3 | 4): void {
  if (!currentMixedEntry) return;
  applyFSRSGrade(currentMixedEntry.card, g);
  mixedFlipped = false;
  lastMixedUserGuess = '';
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  renderMixedReviewStage();
}

export function selectReviewTopicSubMode(subMode: TopicDrillSubMode): void {
  triggerHaptic('light');
  reviewPrefs.topicSubMode = subMode;
  saveReviewPrefs();
  topicDrillCursor = 0;
  topicDrillRevealed = false;
  topicDrillChosenOptionIdx = null;
  topicDrillBuiltTiles = [];
  activeReviewSession.completed = false;
  renderTopicReviewStage();
}

export function selectReviewTopicCategory(catId: string): void {
  triggerHaptic('light');
  reviewPrefs.topicCategoryId = catId || 'ALL';
  saveReviewPrefs();
  topicDrillCursor = 0;
  topicDrillRevealed = false;
  topicDrillChosenOptionIdx = null;
  topicDrillBuiltTiles = [];
  activeReviewSession.completed = false;
  renderTopicReviewStage();
}

export function answerReviewTopicMc(optIdx: number): void {
  triggerHaptic('light');
  topicDrillChosenOptionIdx = optIdx;
  revealReviewTopicCard();
}

export function addReviewTopicTile(word: string): void {
  triggerHaptic('light');
  topicDrillBuiltTiles.push(word);
  renderTopicReviewStage();
}

export function resetReviewTopicTiles(): void {
  triggerHaptic('light');
  topicDrillBuiltTiles = [];
  renderTopicReviewStage();
}

export function revealReviewTopicCard(): void {
  if (topicDrillRevealed) return;
  triggerHaptic('light');
  topicDrillRevealed = true;
  renderTopicReviewStage();
  if (currentTopicDrillItem && reviewPrefs.autoPlayAudio) {
    void speakUkrainian(currentTopicDrillItem.audioUk);
  }
}

export function gradeReviewTopicCard(g: 1 | 2 | 3 | 4): void {
  triggerHaptic('heavy');
  recordSessionGrade(activeReviewSession, g, false, 15);
  db.xp += 15;
  db.drills += 1;
  saveDB();

  topicDrillCursor += 1;
  topicDrillRevealed = false;
  topicDrillChosenOptionIdx = null;
  topicDrillBuiltTiles = [];
  lastAutoSpokenCardKey = '';
  syncReviewControlsUI();
  renderTopicReviewStage();
}

// DECK 1: UK -> EN
export function renderAnkiStage(): void {
  const now = Date.now();
  const sel = selectDeckActionableQueue(
    db.cards,
    now,
    getActiveRemainingNewAllowance()
  );

  const newEl = document.getElementById('anki-new-count');
  const learnEl = document.getElementById('anki-learn-count');
  const revEl = document.getElementById('anki-rev-count');
  if (newEl) newEl.innerText = String(sel.pacedNewCount);
  if (learnEl) learnEl.innerText = String(sel.learningCount);
  if (revEl) revEl.innerText = String(sel.reviewCount);

  const mount = document.getElementById('review-unified-mount');
  const stageSrs = document.getElementById('stage-srs');
  const bodyEl = document.getElementById('anki-card-body');
  const actionEl = document.getElementById('anki-action-area');
  if (!bodyEl || !actionEl) return;

  if (
    !lexiconExploreMode &&
    activeReviewMode === 'srs' &&
    mount &&
    stageSrs
  ) {
    if (activeReviewSession.completed || !sel.queue.length) {
      currentAnkiCard = null;
      stageSrs.classList.add('hidden');
      mount.classList.remove('hidden');
      mount.innerHTML = renderReviewSessionSummaryHtml();
      return;
    }
    mount.classList.add('hidden');
    stageSrs.classList.remove('hidden');
  }

  if (!sel.queue.length) {
    currentAnkiCard = null;
    bodyEl.innerHTML = `<div class="review-front-surface"><h2 class="card-heading">All caught up for today</h2><p class="hint">Your daily UK→EN reviews are complete.</p></div>`;
    actionEl.innerHTML = `<button type="button" class="btn anki-reveal-btn" onclick="unlockBonusNewCards(5)">+ Study 5 bonus new words</button>`;
    return;
  }

  currentAnkiCard = sel.queue[0];
  const faces = renderUk2EnCardFaces(
    currentAnkiCard,
    ankiFlipped,
    'UK→EN · Recognition',
    sel.queue.length,
    'flipAnkiCard',
    'gradeAnkiCard'
  );
  bodyEl.innerHTML = faces.bodyHtml;
  actionEl.innerHTML = faces.actionHtml;
}

export function flipAnkiCard(): void {
  if (!currentAnkiCard || ankiFlipped) return;
  triggerHaptic('light');
  ankiFlipped = true;
  renderAnkiStage();
  if (currentAnkiCard) {
    inspectWordDeep(currentAnkiCard.rank, reviewPrefs.autoPlayAudio, false);
  }
  ensureActionButtonsVisible('anki-action-area');
}

export function gradeAnkiCard(g: 1 | 2 | 3 | 4): void {
  applyFSRSGrade(currentAnkiCard, g);
  ankiFlipped = false;
  renderAnkiStage();
}

// DECK 2: EN -> UK
export function renderEn2UkStage(): void {
  const now = Date.now();
  const sel = selectDeckActionableQueue(
    db.en2ukCards,
    now,
    getActiveRemainingNewAllowance()
  );

  const newEl = document.getElementById('en2uk-new-count');
  const learnEl = document.getElementById('en2uk-learn-count');
  const revEl = document.getElementById('en2uk-rev-count');
  if (newEl) newEl.innerText = String(sel.pacedNewCount);
  if (learnEl) learnEl.innerText = String(sel.learningCount);
  if (revEl) revEl.innerText = String(sel.reviewCount);

  const sumMount = document.getElementById('en2uk-summary-mount');
  const stageEl = document.getElementById('stage-en2uk');
  const bodyEl = document.getElementById('en2uk-card-body');
  const actionEl = document.getElementById('en2uk-action-area');
  if (!bodyEl || !actionEl) return;

  if (sumMount && stageEl) {
    if (activeReviewSession.completed || !sel.queue.length) {
      currentEn2UkCard = null;
      stageEl.classList.add('hidden');
      sumMount.classList.remove('hidden');
      sumMount.innerHTML = renderReviewSessionSummaryHtml();
      return;
    }
    sumMount.classList.add('hidden');
    stageEl.classList.remove('hidden');
  }

  if (!sel.queue.length) {
    currentEn2UkCard = null;
    return;
  }

  currentEn2UkCard = sel.queue[0];
  const faces = renderEn2UkCardFaces(
    currentEn2UkCard,
    en2ukFlipped,
    lastEn2UkUserGuess,
    'en2uk-user-guess',
    'EN→UK · Active recall',
    sel.queue.length,
    'flipEn2UkCard',
    'gradeEn2UkCard'
  );
  bodyEl.innerHTML = faces.bodyHtml;
  actionEl.innerHTML = faces.actionHtml;
}

export function flipEn2UkCard(): void {
  if (!currentEn2UkCard || en2ukFlipped) return;
  triggerHaptic('light');
  const guessInput = document.getElementById(
    'en2uk-user-guess'
  ) as HTMLInputElement | null;
  lastEn2UkUserGuess = guessInput ? guessInput.value.trim() : '';
  en2ukFlipped = true;
  renderEn2UkStage();
  if (currentEn2UkCard) {
    inspectWordDeep(currentEn2UkCard.rank, false, false);
    const item = FREQ_6000_DB[currentEn2UkCard.rank - 1];
    if (item && reviewPrefs.autoPlayAudio) {
      void speakUkrainian(item.ru);
    }
  }
  ensureActionButtonsVisible('en2uk-action-area');
}

export function gradeEn2UkCard(g: 1 | 2 | 3 | 4): void {
  applyFSRSGrade(currentEn2UkCard, g);
  en2ukFlipped = false;
  lastEn2UkUserGuess = '';
  renderEn2UkStage();
}

// DECK 3: SENTENCE CORRECTION
export function renderCorrectionStage(): void {
  const now = Date.now();
  const sel = selectDeckActionableQueue(
    db.corrCards,
    now,
    getActiveRemainingNewAllowance()
  );

  const newEl = document.getElementById('corr-new-count');
  const learnEl = document.getElementById('corr-learn-count');
  const revEl = document.getElementById('corr-rev-count');
  if (newEl) newEl.innerText = String(sel.pacedNewCount);
  if (learnEl) learnEl.innerText = String(sel.learningCount);
  if (revEl) revEl.innerText = String(sel.reviewCount);

  const sumMount = document.getElementById('corr-summary-mount');
  const stageEl = document.getElementById('stage-corr');
  const bodyEl = document.getElementById('corr-card-body');
  const actionEl = document.getElementById('corr-action-area');
  if (!bodyEl || !actionEl) return;

  if (sumMount && stageEl) {
    if (activeReviewSession.completed || !sel.queue.length) {
      currentCorrCard = null;
      stageEl.classList.add('hidden');
      sumMount.classList.remove('hidden');
      sumMount.innerHTML = renderReviewSessionSummaryHtml();
      return;
    }
    sumMount.classList.add('hidden');
    stageEl.classList.remove('hidden');
  }

  if (!sel.queue.length) {
    currentCorrCard = null;
    return;
  }

  currentCorrCard = sel.queue[0];
  const faces = renderCorrectionCardFaces(
    currentCorrCard,
    corrFlipped,
    lastCorrUserGuess,
    'corr-user-input',
    'Sentences · Case repair',
    sel.queue.length,
    'flipCorrectionCard',
    'gradeCorrectionCard'
  );
  bodyEl.innerHTML = faces.bodyHtml;
  actionEl.innerHTML = faces.actionHtml;
}

export function flipCorrectionCard(): void {
  if (!currentCorrCard || corrFlipped) return;
  triggerHaptic('light');
  const guessInput = document.getElementById(
    'corr-user-input'
  ) as HTMLInputElement | null;
  lastCorrUserGuess = guessInput ? guessInput.value.trim() : '';
  corrFlipped = true;
  renderCorrectionStage();
  if (currentCorrCard) {
    inspectWordDeep(currentCorrCard.rank, false, false);
    const item = FREQ_6000_DB[currentCorrCard.rank - 1];
    if (item && reviewPrefs.autoPlayAudio) {
      const corr = generateSentenceCorrection(item);
      void speakUkrainian(corr.rightRu);
    }
  }
  ensureActionButtonsVisible('corr-action-area');
}

export function gradeCorrectionCard(g: 1 | 2 | 3 | 4): void {
  applyFSRSGrade(currentCorrCard, g);
  corrFlipped = false;
  lastCorrUserGuess = '';
  renderCorrectionStage();
}

export function addSingleWordFrom6000(rank: number): void {
  triggerHaptic('heavy');
  if (rank < 1 || rank > MAX_RANK) return;
  if (!db.cards.some((c) => c.rank === rank)) {
    db.cards.push({
      rank,
      state: 'new',
      interval: 0,
      ease: 2.5,
      due: Date.now(),
    });
  }
  if (!db.en2ukCards.some((c) => c.rank === rank)) {
    db.en2ukCards.push({
      rank,
      state: 'new',
      interval: 0,
      ease: 2.5,
      due: Date.now(),
    });
  }
  if (!db.corrCards.some((c) => c.rank === rank)) {
    db.corrCards.push({
      rank,
      state: 'new',
      interval: 0,
      ease: 2.5,
      due: Date.now(),
    });
  }
  db.xp += 5;
  saveDB();
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  renderSrsCatalog6000();
  inspectWordDeep(rank, true, false);
}

export function batchAddNextFrequencyWords(count: number): void {
  triggerHaptic('heavy');
  let added = 0;
  const existing = new Set(db.cards.map((c) => c.rank));
  for (let r = 1; r <= MAX_RANK && added < count; r++) {
    if (!existing.has(r)) {
      db.cards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      db.en2ukCards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      db.corrCards.push({
        rank: r,
        state: 'new',
        interval: 0,
        ease: 2.5,
        due: Date.now(),
      });
      added++;
    }
  }
  ensureFreshReviewPrefsDay();
  reviewPrefs.bonusNewAllowanceToday += Math.max(count, added);
  saveReviewPrefs();
  activeReviewSession.completed = false;
  db.xp += added * 5;
  saveDB();
  renderActiveReviewWorkspace();
  renderSrsCatalog6000();
}

export function unlockBonusNewCards(bonusCount = 5): void {
  triggerHaptic('light');
  ensureFreshReviewPrefsDay();
  reviewPrefs.bonusNewAllowanceToday += Math.max(1, bonusCount);
  saveReviewPrefs();
  activeReviewSession = createFreshSessionTracker(0);
  ensureDailyGoalNewCardsSeeded();
  syncReviewControlsUI();
  renderActiveReviewWorkspace();
}

export function closeReviewAdvancedMenu(): void {
  const detailsEl = document.getElementById(
    'review-advanced-menu'
  ) as HTMLDetailsElement | null;
  if (detailsEl) detailsEl.open = false;
}

export function setReviewAutoPlayAudio(enabled: boolean): void {
  triggerHaptic('light');
  reviewPrefs.autoPlayAudio = Boolean(enabled);
  saveReviewPrefs();
  syncReviewControlsUI();
}

export function toggleReviewAutoAudio(): void {
  setReviewAutoPlayAudio(!reviewPrefs.autoPlayAudio);
}

export function toggleReviewFocusMode(): void {
  triggerHaptic('light');
  reviewPrefs.focusDimChrome = !reviewPrefs.focusDimChrome;
  saveReviewPrefs();
  syncReviewControlsUI();
}

export function finishActiveReviewSession(): void {
  triggerHaptic('light');
  activeReviewSession.completed = true;
  syncReviewControlsUI();
  renderActiveReviewWorkspace();
}

function syncReviewSrsVsLexiconDOM(): void {
  const tabSrs = document.getElementById('tab-srs');
  const srsWorkspace = document.getElementById('review-srs-workspace');
  const lexCard = document.getElementById('lexicon-6000-card');
  tabSrs?.classList.toggle('is-lexicon-mode', lexiconExploreMode);
  if (lexiconExploreMode) {
    srsWorkspace?.classList.add('hidden');
    lexCard?.classList.remove('hidden');
  } else {
    srsWorkspace?.classList.remove('hidden');
    lexCard?.classList.add('hidden');
  }
}

function syncReviewControlsUI(): void {
  if (typeof document === 'undefined') return;
  const audioBtn = document.getElementById('review-auto-audio-btn');
  const audioLbl = document.getElementById('review-auto-audio-label');
  if (audioBtn) {
    audioBtn.classList.toggle('is-active', reviewPrefs.autoPlayAudio);
    audioBtn.setAttribute('aria-pressed', reviewPrefs.autoPlayAudio ? 'true' : 'false');
  }
  if (audioLbl) {
    audioLbl.textContent = reviewPrefs.autoPlayAudio
      ? 'Auto-audio: On'
      : 'Auto-audio: Off';
  }

  document.querySelectorAll('[data-review-audio-opt]').forEach((btn) => {
    const opt = btn.getAttribute('data-review-audio-opt');
    const isAct =
      (opt === 'on' && reviewPrefs.autoPlayAudio) ||
      (opt === 'off' && !reviewPrefs.autoPlayAudio);
    btn.classList.toggle('active', isAct);
    btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
  });

  const focusBtn = document.getElementById('review-focus-btn');
  const focusLbl = document.getElementById('review-focus-label');
  if (focusBtn) {
    focusBtn.classList.toggle('is-active', reviewPrefs.focusDimChrome);
    focusBtn.setAttribute('aria-pressed', reviewPrefs.focusDimChrome ? 'true' : 'false');
  }
  if (focusLbl) {
    focusLbl.textContent = reviewPrefs.focusDimChrome
      ? 'Exit focus'
      : 'Full focus';
  }

  const finishBtn = document.getElementById('review-finish-btn');
  if (finishBtn) {
    const showFinish =
      activeReviewSession.cardsReviewed >= 1 && !activeReviewSession.completed;
    finishBtn.classList.toggle('hidden', !showFinish);
  }

  const appShell = document.querySelector('.app-shell');
  const inReview = isUserCurrentlyViewingReview();
  const activelyStudying = inReview && !activeReviewSession.completed;
  if (appShell) {
    appShell.classList.toggle(
      'review-chrome-dimmed',
      activelyStudying && !reviewPrefs.focusDimChrome
    );
    appShell.classList.toggle(
      'review-chrome-hidden',
      activelyStudying && reviewPrefs.focusDimChrome
    );
  }
  document.body.classList.toggle(
    'review-mobile-focus',
    activelyStudying && reviewPrefs.focusDimChrome
  );
}

function renderActiveReviewWorkspace(): void {
  syncReviewSrsVsLexiconDOM();
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  if (!lexiconExploreMode && activeReviewMode === 'mixed') {
    renderMixedReviewStage();
  } else if (!lexiconExploreMode && activeReviewMode === 'topics') {
    renderTopicReviewStage();
  }
  syncReviewControlsUI();
}

// ============================================================================
// 3. VERIFIED UKRAINIAN LEXICON, PHONETICS & DEEP INSPECTOR
// ============================================================================
let srsCatPage = 0;
let phonPage = 0;

export function inspectWordDeep(
  rank: number,
  playAudio = true,
  openSheetOnMobile = false
): void {
  const safeRank = Math.max(1, Math.min(MAX_RANK, rank || 1));
  currentInspectedRank = safeRank;
  const item = FREQ_6000_DB[safeRank - 1];
  if (!item) return;
  const phon = generateUkrainianPhonetics(item.ru);
  const gram = generateGrammarBreakdown(item);
  const lvlInfo = formatPlainLevelBadge(item.level);
  const inReviews = db.cards.some((c) => c.rank === item.rank);

  const inspectorBody = document.getElementById('inspector-body');
  if (inspectorBody) {
    inspectorBody.innerHTML = `
      <div class="inspector-top-row">
        <span class="hint">${lvlInfo.label} · #${item.rank} · ${item.pos}</span>
        <div class="inspector-actions-row">
          <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">Listen</button>
          <button type="button" class="btn ${inReviews ? 'btn-sec' : ''} btn--sm" onclick="addSingleWordFrom6000(${item.rank})" ${inReviews ? 'disabled' : ''}>${inReviews ? '✓ In reviews' : '+ Add to reviews'}</button>
        </div>
      </div>
      <div class="word inspector-headword" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">${item.ru}</div>
      <div class="hint inspector-phonetic-line">Sounds like <b class="text-strong-ink">${phon.plainGuide}</b> · <span class="inspector-ipa">${phon.ipa}</span></div>
      <div class="inspector-meaning">${item.en}</div>
      <div class="hint inspector-notes">${phon.notes}</div>
      <div class="inspector-gram-summary"><b>${gram.summaryTag}</b><div class="hint inspector-gram-note">${gram.usageNote}</div></div>
      <div class="example-chip" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
        <div class="word inspector-example-uk">${gram.exampleRu}</div>
        <div class="hint inspector-gram-note">${gram.exampleEn}</div>
      </div>
      ${gram.tableHtml}
    `;
  }

  const cTarget = document.getElementById('cursive-target');
  if (cTarget) cTarget.innerText = item.ru;
  const pOut = document.getElementById('phonetic-output');
  if (pOut) {
    pOut.innerHTML = `
      <div class="phonetic-top-row">
        <div class="phonetic-head-group">
          <span class="word phonetic-headword" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">${item.ru}</span>
          <span class="inspector-ipa--muted">${phon.ipa}</span>
          <span class="phonetic-gloss">— ${item.en}</span>
        </div>
        <div class="inspector-actions-row">
          <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">Listen</button>
          <button type="button" class="btn btn-sec btn--sm" onclick="speakExplanation(${item.rank})">Explain</button>
          <button type="button" class="btn ${inReviews ? 'btn-sec' : ''} btn--sm" onclick="addSingleWordFrom6000(${item.rank})" ${inReviews ? 'disabled' : ''}>${inReviews ? '✓ In reviews' : '+ Add to reviews'}</button>
        </div>
      </div>
      <div class="hint phonetic-guide-line">Sounds like <b class="text-strong-ink">${phon.plainGuide}</b> · ${phon.notes}</div>
      <div class="hint phonetic-meta-line">${lvlInfo.label} · ${gram.summaryTag} — ${gram.usageNote}</div>
    `;
  }

  if (openSheetOnMobile) {
    if (window.innerWidth <= 960) {
      openInspectorSheet();
    } else {
      document.getElementById('grammar-inspector')?.classList.remove('desktop-collapsed');
      document.getElementById('top-inspector-toggle-btn')?.classList.add('inspector-active');
    }
  }
  if (playAudio) speakUkrainian(item.ru);
}

function getFilteredVocabulary(
  searchId: string,
  levelId: string
): VocabItem[] {
  const searchInput = document.getElementById(
    searchId
  ) as HTMLInputElement | null;
  const levelSelect = document.getElementById(
    levelId
  ) as HTMLSelectElement | null;
  const q = (searchInput?.value || '')
    .trim()
    .toLowerCase()
    .replace(/\u0301/g, '')
    .replace(/^#/, '');
  const lvl = levelSelect?.value || 'ALL';

  return FREQ_6000_DB.filter((w) => {
    if (lvl !== 'ALL' && w.level !== lvl) return false;
    if (!q) return true;
    return (
      w.ru.toLowerCase().replace(/\u0301/g, '').includes(q) ||
      w.en.toLowerCase().includes(q) ||
      String(w.rank) === q
    );
  });
}

export function clearLexiconSearch(): void {
  const searchInput = document.getElementById(
    'srs-cat-search'
  ) as HTMLInputElement | null;
  const levelSelect = document.getElementById(
    'srs-cat-level'
  ) as HTMLSelectElement | null;
  if (searchInput) searchInput.value = '';
  if (levelSelect) levelSelect.value = 'ALL';
  srsCatPage = 0;
  renderSrsCatalog6000();
}

export function clearPhoneticsSearch(): void {
  const searchInput = document.getElementById(
    'phon-search'
  ) as HTMLInputElement | null;
  const levelSelect = document.getElementById(
    'phon-level'
  ) as HTMLSelectElement | null;
  if (searchInput) searchInput.value = '';
  if (levelSelect) levelSelect.value = 'ALL';
  phonPage = 0;
  renderPhonetics6000();
}

export function renderSrsCatalog6000(): void {
  const filtered = getFilteredVocabulary('srs-cat-search', 'srs-cat-level');
  const pageSize = 25;
  const maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  if (srsCatPage > maxPage) srsCatPage = maxPage;
  const slice = filtered.slice(
    srsCatPage * pageSize,
    (srsCatPage + 1) * pageSize
  );
  const inDeck = new Set(db.cards.map((c) => c.rank));

  const pageInfo = document.getElementById('srs-cat-page-info');
  if (pageInfo) {
    pageInfo.innerText = filtered.length
      ? `${srsCatPage * pageSize + 1}–${Math.min(filtered.length, (srsCatPage + 1) * pageSize)} of ${filtered.length.toLocaleString('en')} words`
      : '0 matching words';
  }

  const catalogEl = document.getElementById('srs-6000-catalog');
  if (!catalogEl) return;

  if (slice.length === 0) {
    catalogEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-state-title">No words match your search</h3>
        <p class="empty-state-desc">Try searching in Ukrainian, English, or by frequency rank (1–6000), or reset your filters to browse all 6,000 words.</p>
        <div class="empty-state-actions">
          <button type="button" class="btn btn-sec btn--sm" onclick="clearLexiconSearch()">Reset filters</button>
        </div>
      </div>
    `;
    return;
  }

  catalogEl.innerHTML = slice
    .map((w) => {
      const saved = inDeck.has(w.rank);
      const p = generateUkrainianPhonetics(w.ru);
      const lvlInfo = formatPlainLevelBadge(w.level);
      return `<div class="freq-row">
        <div class="freq-row-main--clickable" onclick="inspectWordDeep(${w.rank}, true, true)">
          <div class="freq-row-head">
            <span class="word freq-row-uk">${w.ru}</span>
            <span class="freq-row-ipa">${p.ipa}</span>
            <span class="hint">#${w.rank} · ${lvlInfo.label}${saved ? ' · In reviews' : ''}</span>
          </div>
          <div class="hint freq-row-sub"><span class="freq-row-en">${w.en}</span> · ${w.pos}</div>
          ${w.exUk ? `<div onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(w.exUk)}')" class="hint freq-row-ex"><span class="word freq-row-ex-uk">${w.exUk}</span>${w.exEn ? ` — ${w.exEn}` : ''}</div>` : ''}
        </div>
        <div class="freq-row-actions">
          <button type="button" class="btn btn-sec btn--sm" onclick="inspectWordDeep(${w.rank}, true, true)">Word forms</button>
          <button type="button" class="btn ${saved ? 'btn-sec' : ''} btn--sm" onclick="addSingleWordFrom6000(${w.rank})" ${saved ? 'disabled' : ''}>${saved ? '✓ In reviews' : '+ Add to reviews'}</button>
        </div>
      </div>`;
    })
    .join('');
}

export function changeSrsCatPage(d: number): void {
  triggerHaptic('light');
  srsCatPage = Math.max(0, srsCatPage + d);
  renderSrsCatalog6000();
}

export function renderPhonetics6000(): void {
  const filtered = getFilteredVocabulary('phon-search', 'phon-level');
  const pageSize = 25;
  const maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  if (phonPage > maxPage) phonPage = maxPage;
  const slice = filtered.slice(phonPage * pageSize, (phonPage + 1) * pageSize);
  const inDeck = new Set(db.cards.map((c) => c.rank));

  const pageInfo = document.getElementById('phon-page-info');
  if (pageInfo) {
    pageInfo.innerText = filtered.length
      ? `${phonPage * pageSize + 1}–${Math.min(filtered.length, (phonPage + 1) * pageSize)} of ${filtered.length.toLocaleString('en')} words`
      : '0 matching words';
  }

  const listEl = document.getElementById('phon-6000-list');
  if (!listEl) return;

  if (slice.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state-box">
        <h3 class="empty-state-title">No words match your search</h3>
        <p class="empty-state-desc">Try searching by Ukrainian word, English translation, or #rank, or clear the level filter to see all 6,000 entries.</p>
        <div class="empty-state-actions">
          <button type="button" class="btn btn-sec btn--sm" onclick="clearPhoneticsSearch()">Reset filters</button>
        </div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = slice
    .map((w) => {
      const saved = inDeck.has(w.rank);
      const p = generateUkrainianPhonetics(w.ru);
      const lvlInfo = formatPlainLevelBadge(w.level);
      return `<div class="freq-row freq-row--interactive" onclick="inspectWordDeep(${w.rank}, true, false)">
        <div class="freq-row-main">
          <div class="freq-row-head">
            <span class="word freq-row-uk">${w.ru}</span>
            <span class="freq-row-ipa">${p.ipa}</span>
            <span class="hint">#${w.rank} · ${lvlInfo.label}</span>
          </div>
          <div class="hint freq-row-sub"><span class="freq-row-en">${w.en}</span> · Sounds like <b class="text-strong-ink">${p.plainGuide}</b></div>
        </div>
        <div class="freq-row-actions">
          <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); speakExplanation(${w.rank})">Explain</button>
          <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); inspectWordDeep(${w.rank}, true, true)">Word forms</button>
          <button type="button" class="btn ${saved ? 'btn-sec' : ''} btn--sm" onclick="event.stopPropagation(); addSingleWordFrom6000(${w.rank})" ${saved ? 'disabled' : ''}>${saved ? '✓ In reviews' : '+ Add to reviews'}</button>
        </div>
      </div>`;
    })
    .join('');
}

export function changePhonPage(d: number): void {
  triggerHaptic('light');
  phonPage = Math.max(0, phonPage + d);
  renderPhonetics6000();
}

// Multi-Touch Cursive Pad
function initCursivePad(): void {
  const canvas = document.getElementById(
    'cursive-pad'
  ) as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let drawing = false;
  ctx.strokeStyle = '#1D4ED8';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const r = canvas.getBoundingClientRect();
    const clientX =
      'touches' in e && e.touches.length > 0
        ? e.touches[0].clientX
        : (e as MouseEvent).clientX;
    const clientY =
      'touches' in e && e.touches.length > 0
        ? e.touches[0].clientY
        : (e as MouseEvent).clientY;
    return {
      x: (clientX - r.left) * (canvas.width / r.width),
      y: (clientY - r.top) * (canvas.height / r.height),
    };
  };

  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });
  window.addEventListener('mouseup', () => {
    drawing = false;
  });
  canvas.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      drawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    },
    { passive: false }
  );
  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      if (drawing) {
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    },
    { passive: false }
  );
  canvas.addEventListener('touchend', () => {
    drawing = false;
  });
}

export function clearCanvas(): void {
  triggerHaptic('light');
  const canvas = document.getElementById(
    'cursive-pad'
  ) as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ============================================================================
// 4. UKRAINIAN COURSE WORKSPACE (A0–C1, 29 MODULES — PHASE 3 FLOW)
// ============================================================================
let activeModId = COURSE_MODULES[0].id;
let activeStage = 0;
let activeCourseLevelFilter = 'ALL';
let activeLessonTocSectionId = 'sec-learn';
let lessonScrollRafPending = false;

const LANGO_COURSE_FLOW_STORAGE_KEY = 'slovo_ua_course_flow_v1';

interface ModFlowProgressRecord {
  lessonCompleted?: boolean;
  wordsVisited?: boolean;
  celebrationAddedCount?: number;
  lastWordsFeedback?: string;
}

function loadCourseFlowMap(): Record<string, ModFlowProgressRecord> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LANGO_COURSE_FLOW_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

let courseFlowMap: Record<string, ModFlowProgressRecord> = loadCourseFlowMap();

function saveCourseFlowMap(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      LANGO_COURSE_FLOW_STORAGE_KEY,
      JSON.stringify(courseFlowMap)
    );
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

function getModFlowRecord(modId: string): ModFlowProgressRecord {
  if (!courseFlowMap[modId]) {
    courseFlowMap[modId] = {};
  }
  return courseFlowMap[modId];
}

function syncCourseMeterWidths(scopeEl?: ParentNode | null): void {
  const root = scopeEl || (typeof document !== 'undefined' ? document : null);
  if (!root) return;
  root.querySelectorAll<HTMLElement>('[data-meter-pct]').forEach((el) => {
    const pct = Math.max(0, Math.min(100, Number(el.dataset.meterPct || 0)));
    el.style.width = `${pct}%`;
  });
}

// Track answered questions so users cannot farm duplicate XP by clicking the same correct option repeatedly
const completedQuizKeys = new Set<string>();
const moduleExamAnswers = new Map<string, Map<number, boolean>>();

export function filterCourseByLevel(level: string): void {
  triggerHaptic('light');
  activeCourseLevelFilter = level;
  renderCourseSyllabus();
}

let isCourseSyllabusOpen = false;

function syncCourseDrawerAndWorkspaceDOM(): void {
  if (typeof document === 'undefined') return;
  const drawer = document.getElementById('course-syllabus-drawer');
  const workspace = document.getElementById('module-workspace');
  const lbl = document.getElementById('toggle-course-syllabus-label');
  const isUkrainianTrack =
    getActiveCourseTrack().trackId === PUBLISHED_UKRAINIAN_TRACK_ID;

  if (drawer) {
    drawer.classList.toggle('hidden', !isCourseSyllabusOpen || !isUkrainianTrack);
  }
  if (workspace && isUkrainianTrack) {
    workspace.classList.toggle('hidden', isCourseSyllabusOpen);
  }
  if (lbl) {
    lbl.textContent = isCourseSyllabusOpen
      ? 'Back to module'
      : `Module map (${COURSE_MODULES.length})`;
  }
}

export function toggleCourseSyllabusDrawer(
  force?: boolean,
  options?: { skipHashUpdate?: boolean }
): void {
  triggerHaptic('light');
  isCourseSyllabusOpen =
    typeof force === 'boolean' ? force : !isCourseSyllabusOpen;
  if (isCourseSyllabusOpen) {
    renderCourseSyllabus();
  }
  syncCourseDrawerAndWorkspaceDOM();

  const mainScroll = document.getElementById('main-scroll-container');
  if (mainScroll) {
    mainScroll.scrollTop = 0;
  }

  if (
    !options?.skipHashUpdate &&
    typeof document !== 'undefined' &&
    !document.getElementById('tab-course')?.classList.contains('hidden')
  ) {
    syncHashForCurrentView('course');
  }

  if (!isCourseSyllabusOpen) {
    scheduleLessonScrollspySync();
  }
}

export function selectCourseModule(
  modId: string,
  options?: { skipHashUpdate?: boolean }
): void {
  triggerHaptic('light');
  const matched = COURSE_MODULES.find(
    (m) => m.id.toLowerCase() === String(modId || '').toLowerCase()
  );
  activeModId = matched ? matched.id : modId;
  activeStage = 0;
  activeLessonTocSectionId = 'sec-learn';
  saveCourseResumeBookmark(activeModId, activeStage, 'sec-learn');
  isCourseSyllabusOpen = false;
  syncCourseDrawerAndWorkspaceDOM();
  renderCourseSyllabus();
  renderActiveModule();

  const mainScroll = document.getElementById('main-scroll-container');
  if (mainScroll) {
    mainScroll.scrollTop = 0;
  }

  if (
    !options?.skipHashUpdate &&
    typeof document !== 'undefined' &&
    !document.getElementById('tab-course')?.classList.contains('hidden')
  ) {
    syncHashForCurrentView('course');
  }
  refreshTodayIfVisible();
}

export function selectCourseStage(stageIdx: number): void {
  triggerHaptic('light');
  if (activeStage === 0 && stageIdx > 0) {
    const rec = getModFlowRecord(activeModId);
    if (!rec.lessonCompleted) {
      rec.lessonCompleted = true;
      saveCourseFlowMap();
    }
  }
  activeStage = Math.max(0, Math.min(4, stageIdx));
  saveCourseResumeBookmark(activeModId, activeStage);
  isCourseSyllabusOpen = false;
  syncCourseDrawerAndWorkspaceDOM();
  renderActiveModule();

  const mainScroll = document.getElementById('main-scroll-container');
  if (mainScroll) {
    mainScroll.scrollTop = 0;
  }
  refreshTodayIfVisible();
}

export function renderCourseSyllabus(): void {
  const gridEl = document.getElementById('module-grid');
  if (!gridEl) return;

  const overview = computeCourseMapGroups({
    modules: COURSE_MODULES.map((m) => ({
      id: m.id,
      level: m.level,
      title: m.title,
      topicTag: m.topicTag,
      vocabCount: m.vocab.length,
    })),
    passedModIds: db.passedMods,
    activeModId,
    onboardingRecommendedModId: onboardingState.recommendedModId,
    levelFilter: activeCourseLevelFilter,
  });

  const summaryEl = document.getElementById('course-map-summary');
  if (summaryEl) {
    const recMod =
      COURSE_MODULES.find((x) => x.id === overview.recommendedNextModId) ||
      COURSE_MODULES[0];
    summaryEl.innerHTML = `
      <div class="course-map-progress-box">
        <div class="course-map-progress-row">
          <div>
            <span class="course-map-progress-counts">${overview.completedModules} of ${overview.totalModules} modules completed · ${overview.percentCompleted}%</span>
            <span class="hint"> · Recommended next: <b>${escapeHtmlSafe(recMod.id)} · ${escapeHtmlSafe(recMod.title)}</b></span>
          </div>
          <button type="button" class="btn btn--sm" onclick="selectCourseModule('${escapeSingleQuotes(recMod.id)}')">Continue ${escapeHtmlSafe(recMod.id)} →</button>
        </div>
        <div class="course-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${overview.percentCompleted}" aria-label="Overall course progress">
          <div class="course-meter-fill ${overview.completedModules === overview.totalModules ? 'course-meter-fill--success' : ''}" data-meter-pct="${overview.percentCompleted}"></div>
        </div>
      </div>
    `;
  }

  const filterBarEl = document.getElementById('course-level-filter-bar');
  if (filterBarEl) {
    const countA0 = COURSE_MODULES.filter((m) => m.level === 'A0').length;
    const countA1 = COURSE_MODULES.filter((m) => m.level === 'A1').length;
    const countA2 = COURSE_MODULES.filter((m) => m.level === 'A2').length;
    const countB1 = COURSE_MODULES.filter((m) => m.level === 'B1').length;
    const countB2C1 = COURSE_MODULES.filter(
      (m) => m.level === 'B2' || m.level === 'C1'
    ).length;

    const levels = [
      { id: 'ALL', label: `All ${COURSE_MODULES.length}` },
      { id: 'A0', label: `Level A0 (${countA0})` },
      { id: 'A1', label: `Level A1 (${countA1})` },
      { id: 'A2', label: `Level A2 (${countA2})` },
      { id: 'B1', label: `Level B1 (${countB1})` },
      { id: 'B2-C1', label: `Level B2–C1 (${countB2C1})` },
    ];
    filterBarEl.innerHTML = levels
      .map(
        (lvl) =>
          `<button type="button" role="tab" aria-selected="${activeCourseLevelFilter === lvl.id ? 'true' : 'false'}" class="stage-pill ${activeCourseLevelFilter === lvl.id ? 'active' : ''}" onclick="filterCourseByLevel('${lvl.id}')">${lvl.label}</button>`
      )
      .join('');
  }

  gridEl.innerHTML = overview.groups
    .map(
      (group) => `
      <section class="course-level-group" aria-label="${escapeHtmlSafe(group.plainTitle)}">
        <div class="course-level-group-header">
          <h2 class="course-level-group-title">
            <span>${escapeHtmlSafe(group.plainTitle)}</span>
            <span class="course-cefr-code">${escapeHtmlSafe(group.cefrBadge)}</span>
          </h2>
          <span class="course-level-group-count">${group.completedCount} of ${group.totalCount} completed</span>
        </div>
        <p class="course-level-group-desc">${escapeHtmlSafe(group.description)}</p>
        <div class="course-level-grid">
          ${group.modules
            .map((item) => {
              const statusModClass =
                item.status === 'done'
                  ? 'module-card--done'
                  : item.status === 'current'
                    ? 'module-card--current'
                    : item.status === 'recommended'
                      ? 'module-card--recommended'
                      : '';
              const statusPrefix = item.status === 'done' ? '✓ ' : '';
              return `
                <button
                  type="button"
                  class="module-card ${statusModClass} ${item.id === activeModId ? 'active' : ''}"
                  onclick="selectCourseModule('${escapeSingleQuotes(item.id)}')"
                >
                  <div class="module-card-meta">
                    <span class="module-card-id">${escapeHtmlSafe(item.id)}</span>
                    <span class="module-card-status">${statusPrefix}${escapeHtmlSafe(item.statusLabel)}</span>
                  </div>
                  <div class="module-card-title">${escapeHtmlSafe(item.title)}</div>
                  <div class="module-card-sub">${escapeHtmlSafe(item.cleanTopic)} · ${item.vocabCount} words</div>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>
    `
    )
    .join('');

  syncCourseMeterWidths(document.getElementById('course-syllabus-drawer'));
}

export function inspectCourseWord(rawWord: string): void {
  triggerHaptic('light');
  const firstToken = rawWord
    .split(/[,/—()]/)[0]
    .replace(/[«»"“”.!?;:]/g, '')
    .trim();
  const cleanLower = firstToken.replace(/\u0301/g, '').toLowerCase().trim();
  const cleanFull = rawWord.replace(/\u0301/g, '').toLowerCase().trim();

  const matchedVocab =
    FREQ_6000_DB.find(
      (w) => w.ru.replace(/\u0301/g, '').toLowerCase().trim() === cleanFull
    ) ||
    FREQ_6000_DB.find((w) => {
      const wClean = w.ru.replace(/\u0301/g, '').toLowerCase().trim();
      const wLemma = wClean
        .replace(/\s*\(.*?\)/g, '')
        .split(/\s*[\/,]\s*/)[0]
        .trim();
      return wClean === cleanLower || wLemma === cleanLower;
    });

  if (matchedVocab) {
    inspectWordDeep(matchedVocab.rank, true, true);
    return;
  }

  const m = COURSE_MODULES.find((x) => x.id === activeModId) || COURSE_MODULES[0];
  const modVocabTuple = m.vocab.find(([uk]) => {
    const uClean = uk.replace(/\u0301/g, '').toLowerCase().trim();
    const uLemma = uClean
      .replace(/\s*\(.*?\)/g, '')
      .split(/\s*[\/,]\s*/)[0]
      .trim();
    return uClean === cleanFull || uClean === cleanLower || uLemma === cleanLower;
  });

  const synthItem: VocabItem = {
    rank: 1,
    ru: modVocabTuple ? modVocabTuple[0] : firstToken,
    pos: modVocabTuple ? modVocabTuple[1] : 'NOUN',
    en: modVocabTuple ? modVocabTuple[2] : 'Course vocabulary word',
    level: m.level === 'A0' ? 'A1' : m.level,
    exampleUk: modVocabTuple?.[3] || firstToken,
    exampleEn: modVocabTuple?.[4] || '',
    exUk: modVocabTuple?.[3] || firstToken,
    exEn: modVocabTuple?.[4] || '',
  };

  const phon = generateUkrainianPhonetics(synthItem.ru);
  const gram = generateGrammarBreakdown(synthItem);
  const inspectorBody = document.getElementById('inspector-body');
  if (inspectorBody) {
    inspectorBody.innerHTML = `
      <div class="hint">Module ${escapeHtmlSafe(m.id)} · Word forms</div>
      <div class="course-word-headword" onclick="speakUkrainian('${escapeSingleQuotes(synthItem.ru)}')">🔊 ${escapeHtmlSafe(synthItem.ru)}</div>
      <div class="hint">Sounds like <b>${escapeHtmlSafe(phon.plainGuide)}</b> · <span class="course-word-ipa">${escapeHtmlSafe(phon.ipa)}</span></div>
      <div class="course-word-gloss">${escapeHtmlSafe(synthItem.en)}</div>
      ${gram.tableHtml}
    `;
  }
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 960) {
      openInspectorSheet();
    } else {
      document.getElementById('grammar-inspector')?.classList.remove('desktop-collapsed');
      document.getElementById('top-inspector-toggle-btn')?.classList.add('inspector-active');
    }
  }
  speakUkrainian(rawWord);
}

export function jumpToLessonSection(sectionId: string): void {
  triggerHaptic('light');
  activeLessonTocSectionId = sectionId;
  saveCourseResumeBookmark(activeModId, activeStage, sectionId);

  if (sectionId === 'sec-exceptions') {
    const det = document.getElementById(
      'details-sec-exceptions'
    ) as HTMLDetailsElement | null;
    if (det) det.open = true;
  } else if (sectionId === 'sec-reference') {
    const det = document.getElementById(
      'details-sec-reference'
    ) as HTMLDetailsElement | null;
    if (det) det.open = true;
  }

  const mobileToc = document.getElementById(
    'lesson-mobile-toc'
  ) as HTMLDetailsElement | null;
  if (mobileToc && mobileToc.open) {
    mobileToc.open = false;
  }

  syncActiveTocHighlightDOM(sectionId);

  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function createCardRecord(rank: number) {
  return {
    rank,
    state: 'new' as const,
    interval: 0,
    ease: 2.5,
    due: Date.now(),
  };
}

function addMissingModuleRanksToDeck(modId: string): {
  addedCount: number;
  totalInDeck: number;
} {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const existingRanks = new Set(db.cards.map((c) => c.rank));
  const status = computeModuleVocabReviewStatus(
    m.vocab.map(([uk]) => uk),
    FREQ_6000_DB,
    existingRanks
  );
  let addedCount = 0;
  for (const rank of status.missingRanks) {
    if (!existingRanks.has(rank)) {
      db.cards.push(createCardRecord(rank));
      existingRanks.add(rank);
      addedCount += 1;
    }
  }
  return {
    addedCount,
    totalInDeck: status.inDeckRanks.length + addedCount,
  };
}

export function addModuleVocabToFSRS(modId: string): void {
  triggerHaptic('heavy');
  const { addedCount, totalInDeck } = addMissingModuleRanksToDeck(modId);
  const rec = getModFlowRecord(modId);
  rec.wordsVisited = true;
  rec.lastWordsFeedback =
    addedCount > 0
      ? `Added ${addedCount} ${addedCount === 1 ? 'word' : 'words'} to your daily reviews (${totalInDeck} ready).`
      : `All ${totalInDeck} matched words from ${modId} are already in your reviews.`;
  saveCourseFlowMap();

  if (addedCount > 0) {
    db.xp += addedCount * 2;
    recordDailyStudyActivity(1);
    saveDB();
    renderAnkiStage();
    renderEn2UkStage();
    renderCorrectionStage();
    renderSrsCatalog6000();
  }
  syncSubnavAndBadgesUI();
  renderActiveModule();
  refreshTodayIfVisible();
}

export function speakCourseOverview(modId: string): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const objs = m.objectives.map((o, i) => `Objective ${i + 1}: ${o}`).join(' ');
  playBilingualOpenAI(`${m.title}. ${objs} ${m.summary}`, 'en');
}

export function speakCourseRule(modId: string, ruleIdx: number): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const rawRule = m.rules[ruleIdx];
  if (!rawRule) return;
  const spoken = formatHtmlRuleForSpeech(rawRule);
  playBilingualOpenAI(spoken, 'en');
}

export function speakAllCourseRules(modId: string): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const allSpoken = m.rules
    .map((r) => formatHtmlRuleForSpeech(r))
    .join(' ');
  playBilingualOpenAI(allSpoken, 'en');
}

export function speakCourseDialogue(modId: string): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const text = m.dialogue.lines.map((l) => l.uk).join(' ');
  speakUkrainian(text);
}

function getCurrentStickyStepConfig() {
  const modIndex = COURSE_MODULES.findIndex((x) => x.id === activeModId);
  const m: CourseModule =
    modIndex >= 0 ? COURSE_MODULES[modIndex] : COURSE_MODULES[0];
  const nextMod =
    modIndex >= 0 && modIndex < COURSE_MODULES.length - 1
      ? COURSE_MODULES[modIndex + 1]
      : null;

  const cfuStats = computeStageStats(m.cfu, getStageAttempt(m.id, 'cfu'));
  const pracStats = computeStageStats(
    m.practice,
    getStageAttempt(m.id, 'practice')
  );
  const examAttempt = getStageAttempt(m.id, 'exam');
  const examStats = computeStageStats(m.exam, examAttempt);
  const examScore = calculateExamScore(m.exam, examAttempt.selectedOptions);
  const existingRanks = new Set(db.cards.map((c) => c.rank));
  const vocabStatus = computeModuleVocabReviewStatus(
    m.vocab.map(([uk]) => uk),
    FREQ_6000_DB,
    existingRanks
  );

  return {
    mod: m,
    nextMod,
    sticky: computeStickyStepActions({
      activeStage,
      modId: m.id,
      cfuAnswered: cfuStats.answered,
      cfuTotal: cfuStats.total,
      practiceAnswered: pracStats.answered,
      practiceTotal: pracStats.total,
      vocabTotal: m.vocab.length,
      vocabInReviewsCount: vocabStatus.inDeckRanks.length,
      examAnswered: examStats.answered,
      examTotal: examStats.total,
      examSubmitted: Boolean(examAttempt.submitted),
      examPassed: Boolean(examAttempt.submitted && examScore.passed),
      examScorePct: examScore.percentage,
      nextModId: nextMod ? nextMod.id : null,
    }),
  };
}

export function handleCourseStickyBack(): void {
  const { sticky } = getCurrentStickyStepConfig();
  if (sticky.backAction === 'open-map') {
    toggleCourseSyllabusDrawer(true);
    return;
  }
  if (activeStage > 0) {
    selectCourseStage(activeStage - 1);
  }
}

export function handleCourseStickyPrimary(): void {
  const { mod, nextMod, sticky } = getCurrentStickyStepConfig();
  if (sticky.primaryAction === 'next-stage') {
    if (activeStage === 0) {
      const rec = getModFlowRecord(mod.id);
      rec.lessonCompleted = true;
      saveCourseFlowMap();
      recordDailyStudyActivity(2);
    }
    selectCourseStage(Math.min(4, activeStage + 1));
    return;
  }
  if (sticky.primaryAction === 'submit-exam') {
    submitModuleExam(mod.id, false);
    return;
  }
  if (sticky.primaryAction === 'retake-exam') {
    confirmResetAssessmentStage(mod.id, 'exam');
    return;
  }
  if (sticky.primaryAction === 'next-module' && nextMod) {
    selectCourseModule(nextMod.id);
    return;
  }
  switchTab('today');
}

function syncActiveTocHighlightDOM(sectionId: string): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLElement>('[data-toc-sec]').forEach((btn) => {
    const isMatch = btn.dataset.tocSec === sectionId;
    btn.classList.toggle('active', isMatch);
    if (isMatch) {
      btn.setAttribute('aria-current', 'location');
    } else {
      btn.removeAttribute('aria-current');
    }
  });
  const secMeta = LESSON_TOC_SECTIONS.find((s) => s.id === sectionId);
  const lblEl = document.getElementById('lesson-reading-section-label');
  if (lblEl && secMeta) {
    lblEl.textContent = `${secMeta.letter}. ${secMeta.shortLabel}`;
  }
}

function updateLessonReadingAndScrollspy(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const tabCourse = document.getElementById('tab-course');
  if (
    !tabCourse ||
    tabCourse.classList.contains('hidden') ||
    isCourseSyllabusOpen ||
    activeStage !== 0
  ) {
    return;
  }

  const scrollEl = document.getElementById('main-scroll-container');
  const flowEl = document.getElementById('lesson-flow-article');
  if (!scrollEl || !flowEl) return;

  const scrollRect = scrollEl.getBoundingClientRect();
  const flowRect = flowEl.getBoundingClientRect();
  const viewportHeight = scrollRect.height || window.innerHeight || 800;

  const totalScrollable = Math.max(1, flowRect.height - viewportHeight * 0.55);
  const scrolledAmount = Math.max(0, scrollRect.top - flowRect.top + 80);
  const pct = Math.max(
    0,
    Math.min(100, Math.round((scrolledAmount / totalScrollable) * 100))
  );

  const fillEl = document.getElementById('lesson-reading-fill');
  if (fillEl) {
    fillEl.style.width = `${pct}%`;
  }
  const pctEl = document.getElementById('lesson-reading-pct');
  if (pctEl) {
    pctEl.textContent = `${pct}% read`;
  }

  if (pct >= 90) {
    const rec = getModFlowRecord(activeModId);
    if (!rec.lessonCompleted) {
      rec.lessonCompleted = true;
      saveCourseFlowMap();
    }
  }

  let currentSecId = LESSON_TOC_SECTIONS[0].id;
  const activationThreshold = scrollRect.top + 150;
  for (const sec of LESSON_TOC_SECTIONS) {
    const secEl = document.getElementById(sec.id);
    if (!secEl) continue;
    const rect = secEl.getBoundingClientRect();
    if (rect.top <= activationThreshold) {
      currentSecId = sec.id;
    }
  }

  if (currentSecId !== activeLessonTocSectionId) {
    activeLessonTocSectionId = currentSecId;
    syncActiveTocHighlightDOM(currentSecId);
    saveCourseResumeBookmark(activeModId, 0, currentSecId);
  }
}

function scheduleLessonScrollspySync(): void {
  if (typeof window === 'undefined') return;
  if (lessonScrollRafPending) return;
  lessonScrollRafPending = true;
  window.requestAnimationFrame(() => {
    lessonScrollRafPending = false;
    updateLessonReadingAndScrollspy();
  });
}

function initCourseScrollspyListener(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const scrollEl = document.getElementById('main-scroll-container');
  if (scrollEl) {
    scrollEl.addEventListener('scroll', scheduleLessonScrollspySync, {
      passive: true,
    });
  }
  window.addEventListener('scroll', scheduleLessonScrollspySync, {
    passive: true,
  });
}

function renderStepHeaderHtml(m: CourseModule): string {
  const modFlow = getModFlowRecord(m.id);
  const inlineChecks = (m.structuredLesson?.embeddedChecks ||
    []) as EnrichedInlineCheck[];
  const inlineStats = computeStageStats(
    inlineChecks,
    getStageAttempt(m.id, 'inlineChecks')
  );
  const cfuStats = computeStageStats(m.cfu, getStageAttempt(m.id, 'cfu'));
  const pracStats = computeStageStats(
    m.practice,
    getStageAttempt(m.id, 'practice')
  );
  const examAttempt = getStageAttempt(m.id, 'exam');
  const examStats = computeStageStats(m.exam, examAttempt);
  const examScore = calculateExamScore(m.exam, examAttempt.selectedOptions);
  const existingRanks = new Set(db.cards.map((c) => c.rank));
  const vocabStatus = computeModuleVocabReviewStatus(
    m.vocab.map(([uk]) => uk),
    FREQ_6000_DB,
    existingRanks
  );

  const steps = computeModuleStepStates({
    activeStage,
    modulePassed: db.passedMods.includes(m.id),
    lessonCompleted: Boolean(modFlow.lessonCompleted),
    inlineAnswered: inlineStats.answered,
    cfuAnswered: cfuStats.answered,
    cfuTotal: cfuStats.total,
    practiceAnswered: pracStats.answered,
    practiceTotal: pracStats.total,
    vocabTotal: m.vocab.length,
    vocabInReviewsCount: vocabStatus.inDeckRanks.length,
    vocabMatchedTotal: vocabStatus.matchedRanks.length,
    wordsStepVisited: Boolean(modFlow.wordsVisited),
    examAnswered: examStats.answered,
    examTotal: examStats.total,
    examSubmitted: Boolean(examAttempt.submitted),
    examScorePct: examScore.percentage,
  });

  const checkSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

  return steps
    .map(
      (step) => `
      <button
        type="button"
        class="course-step-btn ${step.active ? 'active' : ''} ${step.done ? 'is-done' : ''}"
        ${step.active ? 'aria-current="step"' : ''}
        onclick="selectCourseStage(${step.index})"
      >
        <span class="course-step-indicator" aria-hidden="true">${step.done ? checkSvg : step.index + 1}</span>
        <span class="course-step-copy">
          <span class="course-step-name">${escapeHtmlSafe(step.shortTitle)}</span>
          <span class="course-step-meta">${escapeHtmlSafe(step.metaLabel)}</span>
        </span>
      </button>
    `
    )
    .join('');
}

function renderStickyStepBarHtml(): string {
  const { sticky } = getCurrentStickyStepConfig();
  return `
    <div class="course-sticky-actions" role="region" aria-label="Step navigation">
      <button type="button" class="btn btn-sec" onclick="handleCourseStickyBack()">${escapeHtmlSafe(sticky.backLabel)}</button>
      <span class="course-sticky-status" id="course-sticky-status-text">${escapeHtmlSafe(sticky.statusText)}</span>
      <button type="button" class="btn" id="course-sticky-primary-btn" onclick="handleCourseStickyPrimary()">${escapeHtmlSafe(sticky.primaryLabel)}</button>
    </div>
  `;
}

export function renderActiveModule(): void {
  const modIndex = COURSE_MODULES.findIndex((x) => x.id === activeModId);
  const m: CourseModule =
    modIndex >= 0 ? COURSE_MODULES[modIndex] : COURSE_MODULES[0];
  const prevMod = modIndex > 0 ? COURSE_MODULES[modIndex - 1] : null;
  const nextMod =
    modIndex >= 0 && modIndex < COURSE_MODULES.length - 1
      ? COURSE_MODULES[modIndex + 1]
      : null;

  if (activeStage === 3) {
    const rec = getModFlowRecord(m.id);
    if (!rec.wordsVisited) {
      rec.wordsVisited = true;
      saveCourseFlowMap();
    }
  }

  const levelEl = document.getElementById('active-mod-level');
  const refEl = document.getElementById('active-mod-ref');
  const titleEl = document.getElementById('active-mod-title');
  if (levelEl) levelEl.textContent = formatPlainLevelTitle(m.level);
  if (refEl) {
    refEl.textContent = `Module ${m.id} · ${extractCleanTopicSubtitle(m.topicTag, m.level)}`;
  }
  if (titleEl) titleEl.textContent = m.title;

  const stageBar = document.getElementById('stage-bar');
  if (stageBar) {
    stageBar.innerHTML = renderStepHeaderHtml(m);
  }

  const box = document.getElementById('stage-content');
  if (!box) return;

  const modSwitcherHtml = `
    <div class="course-mod-switcher">
      ${
        prevMod
          ? `<button type="button" class="btn btn--ghost btn--sm" onclick="selectCourseModule('${escapeSingleQuotes(prevMod.id)}')">← Previous module: ${escapeHtmlSafe(prevMod.id)}</button>`
          : `<span>Module 1 of ${COURSE_MODULES.length}</span>`
      }
      ${
        nextMod
          ? `<button type="button" class="btn btn--ghost btn--sm" onclick="selectCourseModule('${escapeSingleQuotes(nextMod.id)}')">Skip to ${escapeHtmlSafe(nextMod.id)}: ${escapeHtmlSafe(nextMod.title)} →</button>`
          : `<span>Final module (${COURSE_MODULES.length} of ${COURSE_MODULES.length})</span>`
      }
    </div>
  `;

  if (activeStage === 0) {
    if (m.structuredLesson) {
      const sl = m.structuredLesson as StructuredCourseLesson;
      const tocLinksHtml = LESSON_TOC_SECTIONS.map(
        (sec) => `
          <button
            type="button"
            class="lesson-toc-link ${activeLessonTocSectionId === sec.id ? 'active' : ''}"
            data-toc-sec="${sec.id}"
            onclick="jumpToLessonSection('${sec.id}')"
          >
            <span class="lesson-toc-letter">${sec.letter}</span>
            <span>${escapeHtmlSafe(sec.shortLabel)}</span>
            ${sec.isExpandable ? '<span class="lesson-toc-Sub">optional</span>' : ''}
          </button>
        `
      ).join('');

      const prereqAndRelatedItems = [
        ...sl.prerequisites.map((pr) => pr.label),
        ...sl.relatedTopics,
      ].filter(Boolean);

      box.innerHTML = `
        <div class="lesson-progress-strip">
          <div class="lesson-progress-meta">
            <span id="lesson-reading-section-label">A. What you'll learn</span>
            <span id="lesson-reading-pct">0% read</span>
          </div>
          <div class="course-meter course-meter--thin" aria-hidden="true">
            <div class="course-meter-fill" id="lesson-reading-fill"></div>
          </div>
        </div>

        <details class="lesson-mobile-toc" id="lesson-mobile-toc">
          <summary>
            <span>Lesson contents (A–L)</span>
            <span class="hint">Jump to section</span>
          </summary>
          <div class="lesson-mobile-toc-grid">
            ${tocLinksHtml}
          </div>
        </details>

        <div class="lesson-editorial-grid">
          <article class="lesson-flow-col" id="lesson-flow-article">
            <!-- A. WHAT YOU'LL LEARN -->
            <section id="sec-learn" class="lesson-section lesson-section--first">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">A</span>What you’ll learn</h2>
                <button type="button" class="btn btn-sec btn--sm" onclick="speakCourseOverview('${escapeSingleQuotes(m.id)}')">Listen to overview</button>
              </div>
              <p class="lesson-muted-prose">${escapeHtmlSafe(m.summary)}</p>
              <ul class="lesson-objectives-list">
                ${m.objectives.map((obj) => `<li>${obj}</li>`).join('')}
              </ul>
              ${
                prereqAndRelatedItems.length > 0
                  ? `<div class="lesson-meta-line">${prereqAndRelatedItems
                      .map((item) => `<span>${escapeHtmlSafe(item)}</span>`)
                      .join('<span aria-hidden="true">·</span>')}</div>`
                  : ''
              }
            </section>

            <!-- B. THE BIG IDEA -->
            <section id="sec-big-idea" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">B</span>The big idea · ${sl.bigIdea.headline}</h2>
              </div>
              <p class="lesson-lead-prose">${sl.bigIdea.plainEnglish}</p>
              <p class="lesson-muted-prose"><b>Compared with English:</b> ${sl.bigIdea.englishComparison}</p>
              <div class="lesson-study-tip">
                <b>How to approach this:</b> ${sl.bigIdea.keyInsight}
              </div>
            </section>

            <!-- C. SEE IT IN ACTION -->
            <section id="sec-action" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">C</span>See it in action</h2>
                <span class="hint">Tap any Ukrainian phrase to hear audio or inspect forms</span>
              </div>
              ${sl.seeItInAction.map((ex) => renderExampleBreakdown(ex)).join('')}
            </section>

            <!-- D. VISUAL PATTERNS & TABLES -->
            <section id="sec-pattern" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">D</span>Visual patterns &amp; tables</h2>
              </div>
              ${sl.patternTables.map((tb) => renderGrammarTable(tb)).join('')}
              ${(sl.declensions || []).map((dc) => renderDeclensionExplorer(dc)).join('')}
              ${(sl.conjugations || []).map((cj) => renderConjugationExplorer(cj)).join('')}
              ${(sl.aspectTimelines || []).map((at) => renderAspectTimeline(at)).join('')}
              ${(sl.diagrams || []).map((dg) => renderGrammarDiagram(dg)).join('')}
            </section>

            <!-- E. STEP-BY-STEP RULES -->
            <section id="sec-steps" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">E</span>Step-by-step rules</h2>
                <button type="button" class="btn btn-sec btn--sm" onclick="speakAllCourseRules('${escapeSingleQuotes(m.id)}')">Listen to all rules</button>
              </div>
              ${sl.stepByStep.map((step) => renderRuleAndException(step)).join('')}
            </section>

            <!-- F. MORE EXAMPLES -->
            <section id="sec-more-ex" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">F</span>More examples in context</h2>
              </div>
              ${sl.moreExamples
                .map(
                  (grp) => `
                  <div class="lesson-group-block">
                    <div class="lesson-group-title">${grp.groupTitle}</div>
                    <div class="lesson-group-note">${grp.groupNote}</div>
                    ${grp.items.map((item) => renderExampleBreakdown(item)).join('')}
                  </div>
                `
                )
                .join('')}
            </section>

            <!-- G. EXCEPTIONS (COLLAPSED BY DEFAULT) -->
            <section id="sec-exceptions" class="lesson-section">
              <details class="lesson-expandable" id="details-sec-exceptions">
                <summary>
                  <div>
                    <div class="lesson-expandable-title"><span class="lesson-section-kicker">G</span>Exceptions &amp; natural speech details</div>
                    <div class="lesson-expandable-sub">${sl.importantExceptions.length} ${sl.importantExceptions.length === 1 ? 'note' : 'notes'} on special cases and everyday speech — expand anytime</div>
                  </div>
                  <span class="lesson-expandable-toggle">exceptions</span>
                </summary>
                <div class="lesson-expandable-body">
                  ${sl.importantExceptions
                    .map(
                      (exc) => `
                      <div class="vc-exception-box">
                        <div class="vc-exception-header">
                          <span class="vc-exception-badge">${exc.badge}</span>
                          <b>${exc.title}</b>
                        </div>
                        <div class="vc-exception-body">${exc.rule}</div>
                        <div class="vc-exception-ex-list">
                          ${exc.examples
                            .map(
                              (e) =>
                                `<button type="button" class="vc-mini-word-btn" onclick="inspectCourseWord('${escapeSingleQuotes(e.uk)}')">🔊 <b>${e.uk}</b> — ${e.en}${e.note ? ` <i>(${e.note})</i>` : ''}</button>`
                            )
                            .join('')}
                        </div>
                      </div>
                    `
                    )
                    .join('')}
                </div>
              </details>
            </section>

            <!-- H. COMMON MISTAKES -->
            <section id="sec-mistakes" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">H</span>Common English-speaker mistakes</h2>
              </div>
              ${sl.commonMistakes.map((cm) => renderCommonMistake(cm)).join('')}
            </section>

            <!-- I. QUICK CHECK -->
            <section id="sec-inline-check" class="lesson-section">
              ${renderInlineKnowledgeCheckSection(m, sl)}
            </section>

            <!-- J. IN REAL LIFE (DIALOGUE) -->
            <section id="sec-dialogue" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">J</span>In real life · ${escapeHtmlSafe(m.dialogue.title)}</h2>
                <button type="button" class="btn btn-sec btn--sm" onclick="speakCourseDialogue('${escapeSingleQuotes(m.id)}')">Listen to full dialogue</button>
              </div>
              <p class="lesson-muted-prose">${sl.dialogueContextNote}</p>
              <div class="lesson-dialogue-list">
                ${m.dialogue.lines
                  .map(
                    (line) => `
                    <div class="lesson-dialogue-line" onclick="speakUkrainian('${escapeSingleQuotes(line.uk)}')">
                      <div class="lesson-dialogue-top">
                        <span class="lesson-dialogue-speaker">${escapeHtmlSafe(line.speaker)}</span>
                        <button type="button" class="vc-audio-mini" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(line.uk)}')">Listen</button>
                      </div>
                      <div class="lesson-dialogue-uk">${escapeHtmlSafe(line.uk)}</div>
                      <div class="lesson-dialogue-en">${escapeHtmlSafe(line.en)}</div>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </section>

            <!-- K. COMPLETE REFERENCE (COLLAPSED BY DEFAULT) -->
            <section id="sec-reference" class="lesson-section">
              ${renderLessonReference(sl.completeReference)}
            </section>

            <!-- L. WHAT TO REMEMBER & SELF-TEST -->
            <section id="sec-remember" class="lesson-section">
              <div class="lesson-section-head">
                <h2 class="lesson-section-title"><span class="lesson-section-kicker">L</span>What to remember</h2>
                <button type="button" class="btn btn-sec btn--sm" onclick="playBilingualOpenAI('${escapeSingleQuotes(m.reviewSummary)}', 'en')">Listen to summary</button>
              </div>
              <div class="lesson-takeaway-box">
                <ul class="lesson-takeaway-list">
                  ${sl.whatToRemember.map((item) => `<li>${item}</li>`).join('')}
                </ul>
              </div>
              <div class="lesson-group-title">Quick self-test (tap to reveal Ukrainian)</div>
              <div class="lesson-group-note">Say the phrase aloud before revealing the answer.</div>
              <div class="lesson-recall-stack">
                ${m.activeRecall
                  .map(
                    (ar) => `
                    <details class="lesson-recall-card">
                      <summary>How do you say “${escapeHtmlSafe(ar.promptEn)}”? <span class="hint">· Hint: ${escapeHtmlSafe(ar.hint)}</span></summary>
                      <div class="lesson-recall-answer">
                        <span class="lesson-recall-uk">${escapeHtmlSafe(ar.answerUk)}</span>
                        <button type="button" class="btn btn-sec btn--sm" onclick="inspectCourseWord('${escapeSingleQuotes(ar.answerUk)}')">Listen &amp; word forms</button>
                      </div>
                    </details>
                  `
                  )
                  .join('')}
              </div>
            </section>

            ${modSwitcherHtml}
          </article>

          <aside class="lesson-toc-aside" aria-label="On this page">
            <div class="lesson-toc-heading">On this page</div>
            ${tocLinksHtml}
          </aside>
        </div>
      `;
    } else {
      box.innerHTML = `
        <article class="lesson-flow-col" id="lesson-flow-article">
          <section id="sec-learn" class="lesson-section lesson-section--first">
            <div class="lesson-section-head">
              <h2 class="lesson-section-title">What you’ll learn</h2>
              <button type="button" class="btn btn-sec btn--sm" onclick="speakCourseOverview('${escapeSingleQuotes(m.id)}')">Listen to overview</button>
            </div>
            <p class="lesson-muted-prose">${escapeHtmlSafe(m.summary)}</p>
            <ul class="lesson-objectives-list">
              ${m.objectives.map((obj) => `<li>${obj}</li>`).join('')}
            </ul>
          </section>
          <section class="lesson-section">
            <div class="lesson-section-head">
              <h2 class="lesson-section-title">Core rules</h2>
              <button type="button" class="btn btn-sec btn--sm" onclick="speakAllCourseRules('${escapeSingleQuotes(m.id)}')">Listen to all</button>
            </div>
            ${m.rules
              .map(
                (r, idx) => `
                <div class="question-card" onclick="speakCourseRule('${escapeSingleQuotes(m.id)}', ${idx})">
                  <div>${r}</div>
                </div>
              `
              )
              .join('')}
          </section>
          ${modSwitcherHtml}
        </article>
      `;
    }
  } else if (activeStage === 1) {
    box.innerHTML = renderStage2CheckView(m);
  } else if (activeStage === 2) {
    box.innerHTML = renderStage3PracticeView(m);
  } else if (activeStage === 3) {
    const existingRanks = new Set(db.cards.map((c) => c.rank));
    const vocabStatus = computeModuleVocabReviewStatus(
      m.vocab.map(([uk]) => uk),
      FREQ_6000_DB,
      existingRanks
    );
    const modFlow = getModFlowRecord(m.id);

    box.innerHTML = `
      <div class="course-words-head">
        <div class="flex-1-min">
          <h2 class="card-heading">Words from Module ${escapeHtmlSafe(m.id)}</h2>
          <p class="section-subtitle section-subtitle--tight">Tap any Ukrainian word to hear native pronunciation or open its word forms in the side panel.</p>
          ${
            modFlow.lastWordsFeedback
              ? `<div class="course-words-feedback">${escapeHtmlSafe(modFlow.lastWordsFeedback)}</div>`
              : ''
          }
        </div>
        <div class="cluster">
          <button
            type="button"
            id="add-module-words-btn"
            class="btn ${vocabStatus.allAdded ? 'btn-sec' : ''}"
            onclick="addModuleVocabToFSRS('${escapeSingleQuotes(m.id)}')"
          >${escapeHtmlSafe(vocabStatus.buttonLabel)}</button>
          ${
            vocabStatus.inDeckRanks.length > 0
              ? `<button type="button" class="btn btn-sec" onclick="switchTab('review')">Review now →</button>`
              : ''
          }
        </div>
      </div>

      <div class="course-word-list">
        ${m.vocab
          .map(([uk, pos, en, exUk, exEn], idx) => {
            const p = generateUkrainianPhonetics(uk);
            const tempItem: VocabItem = {
              rank: idx + 1,
              ru: uk,
              pos,
              en,
              level: m.level === 'A0' ? 'A1' : m.level,
              exampleUk: exUk || `${uk}`,
              exampleEn: exEn || `${en}`,
              exUk: exUk || `${uk}`,
              exEn: exEn || `${en}`,
            };
            const gram = generateGrammarBreakdown(tempItem);
            return `
              <div class="course-word-row" onclick="inspectCourseWord('${escapeSingleQuotes(uk)}')">
                <div class="course-word-main">
                  <div class="course-word-top">
                    <span class="course-word-headword">${escapeHtmlSafe(uk)}</span>
                    <span class="course-word-ipa">${escapeHtmlSafe(p.ipa)}</span>
                    <span class="course-word-pos">${escapeHtmlSafe(pos)}</span>
                  </div>
                  <div class="course-word-gloss">
                    ${escapeHtmlSafe(en)}
                    <span class="course-word-sound"> · sounds like ${escapeHtmlSafe(p.plainGuide)}</span>
                  </div>
                  ${
                    exUk
                      ? `<div class="course-word-example" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(exUk)}')">
                          <span class="course-word-example-uk">${escapeHtmlSafe(exUk)}</span>
                          ${exEn ? ` — <span>${escapeHtmlSafe(exEn)}</span>` : ''}
                        </div>`
                      : ''
                  }
                </div>
                <div class="cluster">
                  <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(uk)}')">Listen</button>
                  <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); inspectCourseWord('${escapeSingleQuotes(uk)}')">Word forms</button>
                  <button type="button" class="btn btn--ghost btn--sm" onclick="event.stopPropagation(); playBilingualOpenAI('${escapeSingleQuotes(gram.spokenSummary)}', 'en')">Explain</button>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  } else {
    box.innerHTML = renderStage5ExamView(m, nextMod);
  }

  const stickyBarEl = document.getElementById('course-sticky-bar');
  if (stickyBarEl) {
    stickyBarEl.innerHTML = renderStickyStepBarHtml();
  }

  syncCourseMeterWidths(document.getElementById('tab-course'));
  if (activeStage === 0) {
    scheduleLessonScrollspySync();
  }
}

// ============================================================================
// 4B. COURSE ASSESSMENT ENGINE UI, NAVIGATION, PERSISTENCE & GRADING
// ============================================================================
let courseAssessmentStore = loadCourseAssessmentStore();
let singleFocusModeByKey: Record<string, boolean> = {};
let pendingResetConfirmKey: string | null = null;
let pendingExamSubmitModId: string | null = null;

function persistAssessmentStore(): void {
  saveCourseAssessmentStore(courseAssessmentStore);
}

function getStageAttempt(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam'
): StageAttemptState {
  const modState = getModuleAssessmentState(courseAssessmentStore, modId);
  return modState[stageKey];
}

function computeStageStats(
  items: Array<{ ans?: number; correctIndex?: number }>,
  attempt: StageAttemptState
) {
  const total = items.length;
  let answered = 0;
  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < total; i++) {
    const sel = attempt.selectedOptions[i];
    const ans =
      typeof items[i].ans === 'number'
        ? items[i].ans!
        : typeof items[i].correctIndex === 'number'
          ? items[i].correctIndex!
          : 0;
    if (typeof sel === 'number') {
      answered++;
      if (sel === ans) {
        correct++;
      } else {
        incorrect++;
      }
    }
  }

  return {
    total,
    answered,
    unanswered: total - answered,
    correct,
    incorrect,
    percentAnswered: total > 0 ? Math.round((answered / total) * 100) : 0,
  };
}

function renderQuestionJumpStrip(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam',
  items: Array<{ ans?: number; correctIndex?: number }>,
  attempt: StageAttemptState,
  revealCorrectness: boolean
): string {
  const buttons = items
    .map((item, idx) => {
      const sel = attempt.selectedOptions[idx];
      const isAnswered = typeof sel === 'number';
      const ans =
        typeof item.ans === 'number'
          ? item.ans!
          : typeof item.correctIndex === 'number'
            ? item.correctIndex!
            : 0;
      const isCurrent = attempt.currentIndex === idx;

      let stateClass = '';
      let suffix = '';

      if (isAnswered) {
        if (revealCorrectness) {
          if (sel === ans) {
            stateClass = 'is-correct';
            suffix = '✓';
          } else {
            stateClass = 'is-wrong';
            suffix = '✗';
          }
        } else {
          stateClass = 'is-answered';
          suffix = '•';
        }
      }

      return `<button type="button" class="q-jump-btn ${isCurrent ? 'is-current' : ''} ${stateClass}" onclick="jumpToAssessmentQuestion('${escapeSingleQuotes(modId)}', '${stageKey}', ${idx})">${idx + 1}${suffix}</button>`;
    })
    .join('');

  return `<div class="q-jump-strip" aria-label="Question navigator">${buttons}</div>`;
}

function renderInlineKnowledgeCheckSection(
  m: CourseModule,
  sl: StructuredCourseLesson
): string {
  const attempt = getStageAttempt(m.id, 'inlineChecks');
  const checks = sl.embeddedChecks as EnrichedInlineCheck[];
  const stats = computeStageStats(checks, attempt);
  const resetKey = `${m.id}:inlineChecks`;

  const visibleIndices = checks
    .map((_, idx) => idx)
    .filter((idx) => {
      const sel = attempt.selectedOptions[idx];
      if (attempt.filterMode === 'unanswered') return typeof sel !== 'number';
      if (attempt.filterMode === 'incorrect')
        return typeof sel === 'number' && sel !== checks[idx].correctIndex;
      return true;
    });

  return `
    <div class="lesson-section-head">
      <h2 class="lesson-section-title"><span class="lesson-section-kicker">I</span>Quick check (${checks.length} questions)</h2>
      <span class="assessment-score-readout">${stats.answered} of ${stats.total} answered · ${stats.correct} correct</span>
    </div>
    <div class="assessment-panel">
      <div class="assessment-controls">
        <div class="cluster">
          <button type="button" class="stage-pill ${attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'inlineChecks', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'inlineChecks', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'inlineChecks', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        ${
          pendingResetConfirmKey === resetKey
            ? `<div class="cluster">
                <span class="hint">Clear ${stats.answered} answers?</span>
                <button type="button" class="btn btn-warn btn--sm" onclick="confirmResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'inlineChecks')">Yes, clear</button>
                <button type="button" class="btn btn-sec btn--sm" onclick="cancelResetAssessmentStage()">Cancel</button>
              </div>`
            : `<button type="button" class="btn btn--ghost btn--sm" onclick="requestResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'inlineChecks')">Reset checks</button>`
        }
      </div>
    </div>
    ${
      visibleIndices.length === 0
        ? `<div class="question-card"><span class="hint">No questions match this filter.</span> <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'inlineChecks', 'all')">Show all ${stats.total}</button></div>`
        : visibleIndices
            .map((idx) =>
              renderKnowledgeCheck(
                checks[idx],
                m.id,
                idx,
                checks.length,
                attempt.selectedOptions[idx],
                attempt.textAnswers?.[idx]
              )
            )
            .join('')
    }
  `;
}

function renderStage2CheckView(m: CourseModule): string {
  const attempt = getStageAttempt(m.id, 'cfu');
  const questions = m.cfu as EnrichedCourseQuestion[];
  const stats = computeStageStats(questions, attempt);
  const focusKey = `${m.id}:cfu`;
  const isSingleFocus = Boolean(singleFocusModeByKey[focusKey]);
  const resetKey = `${m.id}:cfu`;
  const curIdx = Math.min(
    Math.max(0, attempt.currentIndex || 0),
    Math.max(0, questions.length - 1)
  );
  attempt.currentIndex = curIdx;

  let visibleIndices = questions.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter(
      (idx) => typeof attempt.selectedOptions[idx] !== 'number'
    );
  } else if (attempt.filterMode === 'incorrect') {
    visibleIndices = visibleIndices.filter(
      (idx) =>
        typeof attempt.selectedOptions[idx] === 'number' &&
        attempt.selectedOptions[idx] !== questions[idx].ans
    );
  }

  const headerHtml = `
    <div class="assessment-panel">
      <div class="assessment-top">
        <div>
          <div class="assessment-title">Check your understanding · Module ${escapeHtmlSafe(m.id)}</div>
          <div class="assessment-sub">Question ${curIdx + 1} of ${stats.total} · ${stats.answered} answered · ${stats.unanswered} remaining</div>
        </div>
        <span class="assessment-score-readout">
          ${stats.correct} / ${stats.total} correct (${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
        </span>
      </div>
      <div class="course-meter" aria-hidden="true">
        <div class="course-meter-fill" data-meter-pct="${stats.percentAnswered}"></div>
      </div>
      <div class="assessment-controls">
        <div class="cluster">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'cfu', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${escapeSingleQuotes(m.id)}', 'cfu')">One by one (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'cfu', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'cfu', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        <div class="cluster">
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'cfu', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'cfu', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            pendingResetConfirmKey === resetKey
              ? `<span class="hint">Reset ${stats.answered} answers?</span>
                 <button type="button" class="btn btn-warn btn--sm" onclick="confirmResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'cfu')">Confirm reset</button>
                 <button type="button" class="btn btn-sec btn--sm" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn--ghost btn--sm" onclick="requestResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'cfu')">Reset</button>`
          }
        </div>
      </div>
      ${renderQuestionJumpStrip(m.id, 'cfu', questions, attempt, true)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="question-card"><span class="hint">No questions match this filter.</span> <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'cfu', 'all')">Show all ${stats.total} questions</button></div>`
      : visibleIndices
          .map((idx) => {
            const c = questions[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === c.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              c.inputMode === 'text'
                ? `<div class="question-text-entry">
                    <input
                      type="text"
                      id="cfu-text-input-${m.id}-${idx}"
                      class="input-box"
                      placeholder="${escapeSingleQuotes(c.hintUk ? `Type answer (Hint: ${c.hintUk})…` : 'Type your Ukrainian answer…')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'cfu', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec btn--sm" onclick="submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'cfu', ${idx})">Check typed answer</button>
                  </div>`
                : '';

            const feedbackHtml = buildDetailedFeedbackHtml({
              isCorrect: Boolean(isCorrect),
              chosenIndex: hasSaved ? savedSel! : c.ans,
              correctIndex: c.ans,
              options: c.opts,
              distractorNotes: c.distractorNotes,
              explanation: c.exp,
              audioUk: c.audioUk,
            });

            const metaBits = [
              `Question ${idx + 1} of ${stats.total}`,
              c.topic || '',
            ].filter(Boolean);

            return `
              <div class="question-card" id="cfu-card-${m.id}-${idx}">
                <div class="question-card-head">
                  <span>${metaBits.map((b) => escapeHtmlSafe(b)).join(' · ')}</span>
                  ${c.audioUk ? `<button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(c.audioUk)}')">Listen</button>` : ''}
                </div>
                <div class="question-prompt">${c.q}</div>
                ${textBoxHtml}
                ${c.opts
                  .map((opt, oIdx) => {
                    const stateClass = hasSaved
                      ? oIdx === c.ans
                        ? 'correct'
                        : oIdx === savedSel
                          ? 'wrong'
                          : ''
                      : '';
                    return `<button type="button" class="option-btn ${stateClass}" onclick="handleCourseOptionTap(this, ${oIdx === c.ans}, 'cfu-exp-${idx}', '${escapeSingleQuotes(m.id)}:cfu:${idx}', ${oIdx})">${opt}</button>`;
                  })
                  .join('')}
                <div id="cfu-exp-${idx}" class="${hasSaved ? '' : 'hidden '}question-feedback">
                  <div id="cfu-exp-body-${idx}">${feedbackHtml}</div>
                  <div class="question-feedback-actions">
                    ${c.audioUk ? `<button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(c.audioUk)}')">Hear Ukrainian</button>` : ''}
                    <button type="button" class="btn btn--ghost btn--sm" onclick="playBilingualOpenAI('${escapeSingleQuotes(c.exp)}', 'en')">Hear explanation</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');

  return headerHtml + cardsHtml;
}

function renderStage3PracticeView(m: CourseModule): string {
  const attempt = getStageAttempt(m.id, 'practice');
  const drills = m.practice as EnrichedPracticeDrill[];
  const stats = computeStageStats(drills, attempt);
  const focusKey = `${m.id}:practice`;
  const isSingleFocus = Boolean(singleFocusModeByKey[focusKey]);
  const resetKey = `${m.id}:practice`;
  const curIdx = Math.min(
    Math.max(0, attempt.currentIndex || 0),
    Math.max(0, drills.length - 1)
  );
  attempt.currentIndex = curIdx;

  let visibleIndices = drills.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter(
      (idx) => typeof attempt.selectedOptions[idx] !== 'number'
    );
  } else if (attempt.filterMode === 'incorrect') {
    visibleIndices = visibleIndices.filter(
      (idx) =>
        typeof attempt.selectedOptions[idx] === 'number' &&
        attempt.selectedOptions[idx] !== drills[idx].ans
    );
  }

  const headerHtml = `
    <div class="assessment-panel">
      <div class="assessment-top">
        <div>
          <div class="assessment-title">Practice drills · Module ${escapeHtmlSafe(m.id)}</div>
          <div class="assessment-sub">Drill ${curIdx + 1} of ${stats.total} · ${stats.answered} practiced · ${stats.unanswered} remaining</div>
        </div>
        <span class="assessment-score-readout">
          ${stats.correct} / ${stats.total} correct (${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
        </span>
      </div>
      <div class="course-meter" aria-hidden="true">
        <div class="course-meter-fill" data-meter-pct="${stats.percentAnswered}"></div>
      </div>
      <div class="assessment-controls">
        <div class="cluster">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'practice', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${escapeSingleQuotes(m.id)}', 'practice')">One by one (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'practice', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'practice', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        <div class="cluster">
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'practice', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'practice', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            pendingResetConfirmKey === resetKey
              ? `<span class="hint">Reset ${stats.answered} drills?</span>
                 <button type="button" class="btn btn-warn btn--sm" onclick="confirmResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'practice')">Confirm reset</button>
                 <button type="button" class="btn btn-sec btn--sm" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn--ghost btn--sm" onclick="requestResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'practice')">Reset</button>`
          }
        </div>
      </div>
      ${renderQuestionJumpStrip(m.id, 'practice', drills, attempt, true)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="question-card"><span class="hint">No practice drills match this filter.</span> <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'practice', 'all')">Show all ${stats.total} drills</button></div>`
      : visibleIndices
          .map((idx) => {
            const p = drills[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === p.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              p.inputMode === 'text'
                ? `<div class="question-text-entry">
                    <input
                      type="text"
                      id="prac-text-input-${m.id}-${idx}"
                      class="input-box"
                      placeholder="${escapeSingleQuotes(p.hintUk ? `Type answer (Hint: ${p.hintUk})…` : 'Type your Ukrainian answer…')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'practice', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec btn--sm" onclick="submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'practice', ${idx})">Check typed answer</button>
                  </div>`
                : '';

            const feedbackHtml = buildDetailedFeedbackHtml({
              isCorrect: Boolean(isCorrect),
              chosenIndex: hasSaved ? savedSel! : p.ans,
              correctIndex: p.ans,
              options: p.opts,
              distractorNotes: p.distractorNotes,
              explanation: p.exp,
              audioUk: p.audioUk,
            });

            const metaBits = [
              `Practice ${idx + 1} of ${stats.total}`,
              p.topic || '',
            ].filter(Boolean);

            return `
              <div class="question-card" id="prac-card-${m.id}-${idx}">
                <div class="question-card-head">
                  <span>${metaBits.map((b) => escapeHtmlSafe(b)).join(' · ')}</span>
                  ${p.audioUk ? `<button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(p.audioUk)}')">Listen</button>` : ''}
                </div>
                <div class="question-prompt">${p.prompt}</div>
                ${textBoxHtml}
                ${p.opts
                  .map((opt, oIdx) => {
                    const stateClass = hasSaved
                      ? oIdx === p.ans
                        ? 'correct'
                        : oIdx === savedSel
                          ? 'wrong'
                          : ''
                      : '';
                    return `<button type="button" class="option-btn ${stateClass}" onclick="handlePracticeOptionTap(this, ${oIdx === p.ans}, 'prac-exp-${idx}', '${escapeSingleQuotes(m.id)}:prac:${idx}', '${escapeSingleQuotes(p.audioUk)}', ${oIdx})">${opt}</button>`;
                  })
                  .join('')}
                <div id="prac-exp-${idx}" class="${hasSaved ? '' : 'hidden '}question-feedback">
                  <div class="question-feedback-actions">
                    <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(p.audioUk)}')">🔊 ${escapeHtmlSafe(p.audioUk)}</button>
                    <button type="button" class="btn btn--ghost btn--sm" onclick="playBilingualOpenAI('${escapeSingleQuotes(`${p.audioUk}. ${p.exp}`)}', 'uk')">Hear explanation</button>
                  </div>
                  <div id="prac-exp-body-${idx}">${feedbackHtml}</div>
                </div>
              </div>
            `;
          })
          .join('');

  return headerHtml + cardsHtml;
}

function renderStage5ExamView(
  m: CourseModule,
  nextMod: CourseModule | null
): string {
  const attempt = getStageAttempt(m.id, 'exam');
  const examQuestions = m.exam as EnrichedCourseQuestion[];
  const stats = computeStageStats(examQuestions, attempt);
  const scoreSummary = calculateExamScore(
    examQuestions,
    attempt.selectedOptions
  );
  const isSubmitted = Boolean(attempt.submitted);
  const isPassed =
    db.passedMods.includes(m.id) || (isSubmitted && scoreSummary.passed);
  const focusKey = `${m.id}:exam`;
  const isSingleFocus = Boolean(singleFocusModeByKey[focusKey]);
  const resetKey = `${m.id}:exam`;
  const curIdx = Math.min(
    Math.max(0, attempt.currentIndex || 0),
    Math.max(0, examQuestions.length - 1)
  );
  attempt.currentIndex = curIdx;

  let visibleIndices = examQuestions.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter(
      (idx) => typeof attempt.selectedOptions[idx] !== 'number'
    );
  } else if (attempt.filterMode === 'incorrect' && isSubmitted) {
    visibleIndices = visibleIndices.filter(
      (idx) => attempt.selectedOptions[idx] !== examQuestions[idx].ans
    );
  }

  const existingRanks = new Set(db.cards.map((c) => c.rank));
  const vocabStatus = computeModuleVocabReviewStatus(
    m.vocab.map(([uk]) => uk),
    FREQ_6000_DB,
    existingRanks
  );
  const modFlow = getModFlowRecord(m.id);

  const celebrationHtml =
    isSubmitted && scoreSummary.passed
      ? `
      <section class="module-celebration-card" aria-label="Module completed">
        <div>
          <div class="module-celebration-kicker">Module ${escapeHtmlSafe(m.id)} completed · ${escapeHtmlSafe(formatPlainLevelTitle(m.level))}</div>
          <h2 class="module-celebration-title">Віта́ємо! You completed ${escapeHtmlSafe(m.title)}.</h2>
          <p class="module-celebration-sub">
            Your module words are queued in your daily reviews so you keep what you learned today as you move forward.
          </p>
        </div>
        <div class="module-celebration-stats">
          <div class="module-celebration-stat">
            <div class="module-celebration-val">${scoreSummary.percentage}%</div>
            <div class="module-celebration-lbl">Exam score (${scoreSummary.correctCount}/${scoreSummary.totalQuestions})</div>
          </div>
          <div class="module-celebration-stat">
            <div class="module-celebration-val">${
              modFlow.celebrationAddedCount && modFlow.celebrationAddedCount > 0
                ? `+${modFlow.celebrationAddedCount} added`
                : `${vocabStatus.inDeckRanks.length} in deck`
            }</div>
            <div class="module-celebration-lbl">Module words in Review</div>
          </div>
          <div class="module-celebration-stat">
            <div class="module-celebration-val">${db.passedMods.length} / ${COURSE_MODULES.length}</div>
            <div class="module-celebration-lbl">Course modules completed</div>
          </div>
        </div>
        <div class="module-celebration-actions">
          ${
            nextMod
              ? `<button type="button" class="btn" onclick="selectCourseModule('${escapeSingleQuotes(nextMod.id)}')">Start next module: ${escapeHtmlSafe(nextMod.id)} · ${escapeHtmlSafe(nextMod.title)} →</button>`
              : `<button type="button" class="btn" onclick="switchTab('today')">Return to Today →</button>`
          }
          <button type="button" class="btn btn-sec" onclick="switchTab('review')">Review now</button>
          <button type="button" class="btn btn--ghost btn--sm" onclick="toggleCourseSyllabusDrawer(true)">View module map</button>
        </div>
      </section>
    `
      : '';

  const submitConfirmBanner =
    pendingExamSubmitModId === m.id && !isSubmitted
      ? `<div class="exam-confirm-banner">
          <div>
            You have <b>${stats.unanswered} unanswered ${stats.unanswered === 1 ? 'question' : 'questions'}</b> out of ${stats.total}. Grade your exam now?
          </div>
          <div class="cluster">
            <button type="button" class="btn btn--sm" onclick="submitModuleExam('${escapeSingleQuotes(m.id)}', true)">Confirm &amp; grade exam</button>
            <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'unanswered')">Review unanswered (${stats.unanswered})</button>
            <button type="button" class="btn btn--ghost btn--sm" onclick="cancelSubmitModuleExam()">Cancel</button>
          </div>
        </div>`
      : '';

  const missedBanner =
    isSubmitted && !scoreSummary.passed
      ? `<div class="exam-confirm-banner">
          <div>
            <b>Scored ${scoreSummary.percentage}% (${scoreSummary.correctCount}/${scoreSummary.totalQuestions}).</b> You need 80% (${scoreSummary.passThreshold}/${scoreSummary.totalQuestions}) to complete Module ${escapeHtmlSafe(m.id)}. Review the missed items below, then try again when ready.
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'incorrect')">Show missed (${scoreSummary.totalQuestions - scoreSummary.correctCount})</button>
            <button type="button" class="btn btn--sm" onclick="confirmResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'exam')">Try exam again</button>
          </div>
        </div>`
      : '';

  const headerHtml = `
    <div class="assessment-panel">
      <div class="assessment-top">
        <div>
          <div class="assessment-title">Module ${escapeHtmlSafe(m.id)} exam (${stats.total} questions)</div>
          <div class="assessment-sub">
            Score 80% (${scoreSummary.passThreshold}/${stats.total}) to complete Module ${escapeHtmlSafe(m.id)} · Answered <b id="exam-answered-count">${stats.answered}/${stats.total}</b> · Remaining <b id="exam-unanswered-count">${stats.unanswered}</b>
          </div>
        </div>
        <span class="assessment-score-readout ${isPassed ? 'assessment-score-readout--passed' : ''}" id="exam-score-pill">
          ${
            isSubmitted
              ? `Score: ${scoreSummary.correctCount}/${stats.total} (${scoreSummary.percentage}%)${isPassed ? ' · Completed' : ''}`
              : `${stats.answered}/${stats.total} answered${isPassed ? ' · Completed' : ''}`
          }
        </span>
      </div>
      <div class="course-meter" aria-hidden="true">
        <div id="exam-progress-fill" class="course-meter-fill ${isSubmitted && scoreSummary.passed ? 'course-meter-fill--success' : ''}" data-meter-pct="${stats.percentAnswered}"></div>
      </div>
      <div class="assessment-controls">
        <div class="cluster">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${escapeSingleQuotes(m.id)}', 'exam')">One by one (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'unanswered')">Unanswered (${stats.unanswered})</button>
          ${
            isSubmitted
              ? `<button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'incorrect')">Missed (${stats.total - scoreSummary.correctCount})</button>`
              : ''
          }
        </div>
        <div class="cluster">
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'exam', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec btn--sm" onclick="stepAssessmentQuestion('${escapeSingleQuotes(m.id)}', 'exam', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            !isSubmitted
              ? `<button type="button" class="btn btn--sm" onclick="submitModuleExam('${escapeSingleQuotes(m.id)}', false)">Finish &amp; grade (${stats.answered}/${stats.total})</button>`
              : ''
          }
          ${
            pendingResetConfirmKey === resetKey
              ? `<span class="hint">Reset all ${stats.total} exam answers?</span>
                 <button type="button" class="btn btn-warn btn--sm" onclick="confirmResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'exam')">Yes, reset</button>
                 <button type="button" class="btn btn-sec btn--sm" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn--ghost btn--sm" onclick="requestResetAssessmentStage('${escapeSingleQuotes(m.id)}', 'exam')">${isSubmitted ? 'Retake exam' : 'Reset'}</button>`
          }
        </div>
      </div>
      ${submitConfirmBanner}
      ${missedBanner}
      ${renderQuestionJumpStrip(m.id, 'exam', examQuestions, attempt, isSubmitted)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="question-card"><span class="hint">No exam questions match this filter.</span> <button type="button" class="btn btn-sec btn--sm" onclick="setAssessmentFilter('${escapeSingleQuotes(m.id)}', 'exam', 'all')">Show all ${stats.total} questions</button></div>`
      : visibleIndices
          .map((idx) => {
            const qItem = examQuestions[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === qItem.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              qItem.inputMode === 'text' && !isSubmitted
                ? `<div class="question-text-entry">
                    <input
                      type="text"
                      id="exam-text-input-${m.id}-${idx}"
                      class="input-box"
                      placeholder="${escapeSingleQuotes(qItem.hintUk ? `Type answer (Hint: ${qItem.hintUk})…` : 'Type your Ukrainian answer…')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'exam', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec btn--sm" onclick="submitStageAssessmentText('${escapeSingleQuotes(m.id)}', 'exam', ${idx})">Record answer</button>
                  </div>`
                : '';

            const feedbackHtml = buildDetailedFeedbackHtml({
              isCorrect: Boolean(isCorrect),
              chosenIndex: hasSaved ? savedSel! : -1,
              correctIndex: qItem.ans,
              options: qItem.opts,
              distractorNotes: qItem.distractorNotes,
              explanation: qItem.exp,
              audioUk: qItem.audioUk,
            });

            const metaBits = [
              `Question ${idx + 1} of ${stats.total}`,
              qItem.topic || '',
            ].filter(Boolean);

            return `
              <div class="question-card" id="exam-card-${m.id}-${idx}">
                <div class="question-card-head">
                  <span>${metaBits.map((b) => escapeHtmlSafe(b)).join(' · ')}</span>
                  ${qItem.audioUk ? `<button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(qItem.audioUk)}')">Listen</button>` : ''}
                </div>
                <div class="question-prompt">${qItem.q}</div>
                ${textBoxHtml}
                ${qItem.opts
                  .map((opt, oIdx) => {
                    let stateClass = '';
                    if (isSubmitted) {
                      if (oIdx === qItem.ans) stateClass = 'correct';
                      else if (hasSaved && oIdx === savedSel) stateClass = 'wrong';
                    } else if (hasSaved && oIdx === savedSel) {
                      stateClass = 'selected-pending';
                    }
                    return `<button type="button" class="option-btn ${stateClass}" onclick="handleExamAnswer(this, ${oIdx === qItem.ans}, '${escapeSingleQuotes(m.id)}', ${idx}, 'exam-exp-${idx}', ${oIdx})">${opt}</button>`;
                  })
                  .join('')}
                <div id="exam-exp-${idx}" class="${isSubmitted ? '' : 'hidden '}question-feedback">
                  ${
                    !hasSaved && isSubmitted
                      ? `<div class="hint">Unanswered question</div>`
                      : ''
                  }
                  <div id="exam-exp-body-${idx}">${feedbackHtml}</div>
                  <div class="question-feedback-actions">
                    ${qItem.audioUk ? `<button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(qItem.audioUk)}')">Hear Ukrainian</button>` : ''}
                    <button type="button" class="btn btn--ghost btn--sm" onclick="playBilingualOpenAI('${escapeSingleQuotes(qItem.exp)}', 'en')">Hear explanation</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');

  if (isSubmitted && scoreSummary.passed) {
    const missedCount = scoreSummary.totalQuestions - scoreSummary.correctCount;
    const shouldAutoOpenReview = attempt.filterMode === 'incorrect' || isSingleFocus;
    return `
      ${celebrationHtml}
      <details class="lesson-expandable" id="exam-graded-review-details" ${shouldAutoOpenReview ? 'open' : ''}>
        <summary>
          <div>
            <div class="lesson-expandable-title">Review graded exam answers (${scoreSummary.correctCount}/${scoreSummary.totalQuestions} correct)</div>
            <div class="lesson-expandable-sub">${missedCount === 0 ? 'Perfect score — inspect explanations anytime' : `${missedCount} missed ${missedCount === 1 ? 'question' : 'questions'} with explanations`}</div>
          </div>
          <span class="lesson-expandable-toggle">answers</span>
        </summary>
        <div class="lesson-expandable-body">
          ${headerHtml}
          ${cardsHtml}
        </div>
      </details>
    `;
  }

  return headerHtml + cardsHtml;
}

export function setAssessmentFilter(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam',
  filterMode: 'all' | 'unanswered' | 'incorrect'
): void {
  triggerHaptic('light');
  const attempt = getStageAttempt(modId, stageKey);
  attempt.filterMode = filterMode;
  singleFocusModeByKey[`${modId}:${stageKey}`] = false;
  pendingExamSubmitModId = null;
  persistAssessmentStore();
  renderActiveModule();
}

export function toggleAssessmentSingleFocus(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam'
): void {
  triggerHaptic('light');
  const key = `${modId}:${stageKey}`;
  singleFocusModeByKey[key] = !singleFocusModeByKey[key];
  persistAssessmentStore();
  renderActiveModule();
}

export function jumpToAssessmentQuestion(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam',
  qIdx: number
): void {
  triggerHaptic('light');
  const attempt = getStageAttempt(modId, stageKey);
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  const key = `${modId}:${stageKey}`;
  if (singleFocusModeByKey[key]) {
    renderActiveModule();
    return;
  }

  renderActiveModule();
  const prefix =
    stageKey === 'cfu'
      ? 'cfu-card'
      : stageKey === 'practice'
        ? 'prac-card'
        : stageKey === 'exam'
          ? 'exam-card'
          : 'inline-kc-card';
  const cardEl = document.getElementById(`${prefix}-${modId}-${qIdx}`);
  if (cardEl) {
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

export function stepAssessmentQuestion(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam',
  delta: number
): void {
  triggerHaptic('light');
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const total =
    stageKey === 'cfu'
      ? m.cfu.length
      : stageKey === 'practice'
        ? m.practice.length
        : stageKey === 'exam'
          ? m.exam.length
          : m.structuredLesson?.embeddedChecks.length || 0;
  const attempt = getStageAttempt(modId, stageKey);
  const nextIdx = Math.min(
    Math.max(0, (attempt.currentIndex || 0) + delta),
    Math.max(0, total - 1)
  );
  jumpToAssessmentQuestion(modId, stageKey, nextIdx);
}

export function requestResetAssessmentStage(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam'
): void {
  triggerHaptic('light');
  pendingResetConfirmKey = `${modId}:${stageKey}`;
  renderActiveModule();
}

export function cancelResetAssessmentStage(): void {
  triggerHaptic('light');
  pendingResetConfirmKey = null;
  renderActiveModule();
}

export function confirmResetAssessmentStage(
  modId: string,
  stageKey: 'inlineChecks' | 'cfu' | 'practice' | 'exam'
): void {
  triggerHaptic('heavy');
  const modState = getModuleAssessmentState(courseAssessmentStore, modId);
  modState[stageKey] = {
    selectedOptions: {},
    textAnswers: {},
    submitted: false,
    currentIndex: 0,
    filterMode: 'all',
  };
  if (stageKey === 'exam') {
    moduleExamAnswers.delete(modId);
  }
  pendingResetConfirmKey = null;
  pendingExamSubmitModId = null;
  persistAssessmentStore();
  renderActiveModule();
}

export function handleInlineCheckOption(
  btnEl: HTMLElement,
  modId: string,
  qIdx: number,
  optIdx: number
): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const checks = (m.structuredLesson?.embeddedChecks ||
    []) as EnrichedInlineCheck[];
  const kc = checks[qIdx];
  if (!kc) return;

  const isCorrect = optIdx === kc.correctIndex;
  const attempt = getStageAttempt(modId, 'inlineChecks');
  attempt.selectedOptions[qIdx] = optIdx;
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  const expId = `vc-kc-exp-${modId}-${kc.id}`;
  const quizKey = `${modId}:inline-kc:${kc.id}`;
  handlePracticeOptionTap(
    btnEl,
    isCorrect,
    expId,
    quizKey,
    kc.audioUk || '',
    optIdx
  );
  renderActiveModule();
}

export function submitInlineCheckText(modId: string, qIdx: number): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const checks = (m.structuredLesson?.embeddedChecks ||
    []) as EnrichedInlineCheck[];
  const kc = checks[qIdx];
  if (!kc) return;

  const inputEl = document.getElementById(
    `inline-kc-input-${modId}-${qIdx}`
  ) as HTMLInputElement | null;
  const typed = inputEl ? inputEl.value.trim() : '';
  if (!typed) return;

  const accepted = [
    ...(kc.acceptedTextAnswers || []),
    ...(kc.acceptedAnswersUk || []),
    ...(kc.expectedAnswerUk ? [kc.expectedAnswerUk] : []),
    kc.options[kc.correctIndex],
  ].filter(Boolean);
  const isCorrect = validateCourseConstructedAnswer(typed, accepted);
  const attempt = getStageAttempt(modId, 'inlineChecks');
  if (!attempt.textAnswers) attempt.textAnswers = {};
  attempt.textAnswers[qIdx] = typed;
  attempt.selectedOptions[qIdx] = isCorrect
    ? kc.correctIndex
    : (kc.correctIndex + 1) % kc.options.length;
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  if (isCorrect) {
    triggerHaptic('heavy');
    const quizKey = `${modId}:inline-kc:${kc.id}`;
    if (!completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 10;
      saveDB();
    }
    if (kc.audioUk) speakUkrainian(kc.audioUk);
  } else {
    triggerHaptic('light');
  }
  renderActiveModule();
}

export function submitStageAssessmentText(
  modId: string,
  stageKey: 'cfu' | 'practice' | 'exam',
  qIdx: number
): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const prefix =
    stageKey === 'cfu' ? 'cfu' : stageKey === 'practice' ? 'prac' : 'exam';
  const inputEl = document.getElementById(
    `${prefix}-text-input-${modId}-${qIdx}`
  ) as HTMLInputElement | null;
  const typed = inputEl ? inputEl.value.trim() : '';
  if (!typed) return;

  const list =
    stageKey === 'cfu'
      ? (m.cfu as EnrichedCourseQuestion[])
      : stageKey === 'practice'
        ? (m.practice as EnrichedPracticeDrill[])
        : (m.exam as EnrichedCourseQuestion[]);
  const item = list[qIdx];
  if (!item) return;

  const isCorrect = validateCourseConstructedAnswer(typed, item);
  const chosenIdx = isCorrect ? item.ans : (item.ans + 1) % item.opts.length;

  const attempt = getStageAttempt(modId, stageKey);
  if (!attempt.textAnswers) attempt.textAnswers = {};
  attempt.textAnswers[qIdx] = typed;
  attempt.selectedOptions[qIdx] = chosenIdx;
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  if (stageKey === 'exam') {
    let modMap = moduleExamAnswers.get(modId);
    if (!modMap) {
      modMap = new Map<number, boolean>();
      moduleExamAnswers.set(modId, modMap);
    }
    modMap.set(qIdx, isCorrect);
    triggerHaptic('light');
    renderActiveModule();
    return;
  }

  if (isCorrect) {
    triggerHaptic('heavy');
    const quizKey = `${modId}:${stageKey === 'cfu' ? 'cfu' : 'prac'}:${qIdx}`;
    if (!completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 10;
      saveDB();
    }
    if (item.audioUk) speakUkrainian(item.audioUk);
  } else {
    triggerHaptic('light');
  }
  renderActiveModule();
}

export function handleCourseOptionTap(
  btnEl: HTMLElement,
  isCorrect: boolean,
  expId: string | null,
  quizKey?: string,
  optIdx?: number
): void {
  let targetModId: string | null = null;
  if (quizKey) {
    const parts = quizKey.split(':');
    if (parts.length >= 3) {
      const [modId, kind, rawIdx] = parts;
      targetModId = modId;
      const qIdx = Number(rawIdx);
      if (!Number.isNaN(qIdx) && (kind === 'cfu' || kind === 'prac')) {
        const stageKey = kind === 'cfu' ? 'cfu' : 'practice';
        const m =
          COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
        const items =
          stageKey === 'cfu'
            ? (m.cfu as EnrichedCourseQuestion[])
            : (m.practice as EnrichedPracticeDrill[]);
        const item = items[qIdx];
        if (item) {
          const resolvedOptIdx =
            typeof optIdx === 'number'
              ? optIdx
              : isCorrect
                ? item.ans
                : (item.ans + 1) % item.opts.length;
          const attempt = getStageAttempt(modId, stageKey);
          attempt.selectedOptions[qIdx] = resolvedOptIdx;
          attempt.currentIndex = qIdx;
          persistAssessmentStore();

          const bodyEl = document.getElementById(
            `${kind === 'cfu' ? 'cfu' : 'prac'}-exp-body-${qIdx}`
          );
          if (bodyEl) {
            bodyEl.innerHTML = buildDetailedFeedbackHtml({
              isCorrect,
              chosenIndex: resolvedOptIdx,
              correctIndex: item.ans,
              options: item.opts,
              distractorNotes: item.distractorNotes,
              explanation: item.exp,
              audioUk: item.audioUk,
            });
          }
        }
      }
    }
  }

  if (isCorrect) {
    triggerHaptic('heavy');
    btnEl.classList.add('correct');
    if (quizKey && !completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 10;
      recordDailyStudyActivity(0.5);
      saveDB();
    }
  } else {
    triggerHaptic('light');
    btnEl.classList.add('wrong');
  }
  if (expId) {
    const expEl = document.getElementById(expId);
    if (expEl) expEl.classList.remove('hidden');
  }

  if (targetModId && targetModId === activeModId) {
    const m =
      COURSE_MODULES.find((x) => x.id === activeModId) || COURSE_MODULES[0];
    const stageBar = document.getElementById('stage-bar');
    if (stageBar) stageBar.innerHTML = renderStepHeaderHtml(m);
    const stickyBarEl = document.getElementById('course-sticky-bar');
    if (stickyBarEl) stickyBarEl.innerHTML = renderStickyStepBarHtml();
  }
}

export function handlePracticeOptionTap(
  btnEl: HTMLElement,
  isCorrect: boolean,
  expId: string,
  quizKey: string,
  audioUk: string,
  optIdx?: number
): void {
  handleCourseOptionTap(btnEl, isCorrect, expId, quizKey, optIdx);
  if (isCorrect && audioUk) {
    speakUkrainian(audioUk);
  }
}

export function handleExamAnswer(
  btnEl: HTMLElement,
  isCorrect: boolean,
  modId: string,
  qIdx: number,
  expId: string,
  optIdx?: number
): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const qItem = m.exam[qIdx] as EnrichedCourseQuestion | undefined;
  let modMap = moduleExamAnswers.get(modId);
  if (!modMap) {
    modMap = new Map<number, boolean>();
    moduleExamAnswers.set(modId, modMap);
  }

  const resolvedOptIdx =
    typeof optIdx === 'number'
      ? optIdx
      : qItem
        ? isCorrect
          ? qItem.ans
          : (qItem.ans + 1) % qItem.opts.length
        : isCorrect
          ? 0
          : 1;

  const attempt = getStageAttempt(modId, 'exam');
  attempt.selectedOptions[qIdx] = resolvedOptIdx;
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  modMap.set(qIdx, isCorrect);

  // During an active unsubmitted exam attempt, do NOT reveal right/wrong or explanations early.
  if (!attempt.submitted) {
    triggerHaptic('light');
    const cardEl = btnEl.closest('.question-card, .card');
    if (cardEl) {
      cardEl.querySelectorAll('.option-btn').forEach((b) => {
        b.classList.remove('selected-pending');
      });
    }
    btnEl.classList.add('selected-pending');

    const stats = computeStageStats(m.exam, attempt);
    const ansCountEl = document.getElementById('exam-answered-count');
    if (ansCountEl) ansCountEl.textContent = `${stats.answered}/${stats.total}`;
    const unansCountEl = document.getElementById('exam-unanswered-count');
    if (unansCountEl) unansCountEl.textContent = `${stats.unanswered}`;
    const fillEl = document.getElementById('exam-progress-fill');
    if (fillEl) fillEl.style.width = `${stats.percentAnswered}%`;
    const scorePill = document.getElementById('exam-score-pill');
    if (scorePill) {
      const isPassed = db.passedMods.includes(modId);
      scorePill.textContent = `${stats.answered}/${m.exam.length} answered${isPassed ? ' · Completed' : ''}`;
    }
    const stageBar = document.getElementById('stage-bar');
    if (stageBar) stageBar.innerHTML = renderStepHeaderHtml(m);
    const stickyBarEl = document.getElementById('course-sticky-bar');
    if (stickyBarEl) stickyBarEl.innerHTML = renderStickyStepBarHtml();
    return;
  }

  // If already submitted (review mode interaction), show immediate feedback
  const quizKey = `${modId}:exam:${qIdx}`;
  if (isCorrect) {
    triggerHaptic('heavy');
    btnEl.classList.add('correct');
    if (!completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 15;
    }
  } else {
    triggerHaptic('light');
    btnEl.classList.add('wrong');
  }

  const expEl = document.getElementById(expId);
  if (expEl) expEl.classList.remove('hidden');
  saveDB();
}

export function cancelSubmitModuleExam(): void {
  triggerHaptic('light');
  pendingExamSubmitModId = null;
  renderActiveModule();
}

export function submitModuleExam(modId: string, forceConfirm = false): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const attempt = getStageAttempt(modId, 'exam');
  const stats = computeStageStats(m.exam, attempt);

  if (stats.unanswered > 0 && !forceConfirm) {
    triggerHaptic('light');
    pendingExamSubmitModId = modId;
    renderActiveModule();
    return;
  }

  triggerHaptic('heavy');
  pendingExamSubmitModId = null;
  attempt.submitted = true;
  attempt.filterMode = 'all';

  let modMap = moduleExamAnswers.get(modId);
  if (!modMap) {
    modMap = new Map<number, boolean>();
    moduleExamAnswers.set(modId, modMap);
  }

  let newlyEarnedXp = 0;
  m.exam.forEach((qItem, idx) => {
    const sel = attempt.selectedOptions[idx];
    const isCorrect = typeof sel === 'number' && sel === qItem.ans;
    modMap!.set(idx, isCorrect);
    const quizKey = `${modId}:exam:${idx}`;
    if (isCorrect && !completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      newlyEarnedXp += 15;
    }
  });

  db.xp += newlyEarnedXp;
  const scoreSummary = calculateExamScore(m.exam, attempt.selectedOptions);
  attempt.lastScore = scoreSummary.correctCount;

  if (scoreSummary.passed) {
    if (!db.passedMods.includes(modId)) {
      db.passedMods.push(modId);
    }
    const { addedCount } = addMissingModuleRanksToDeck(modId);
    const modFlow = getModFlowRecord(modId);
    modFlow.lessonCompleted = true;
    modFlow.wordsVisited = true;
    modFlow.celebrationAddedCount = addedCount;
    saveCourseFlowMap();

    if (addedCount > 0) {
      db.xp += addedCount * 2;
      renderAnkiStage();
      renderEn2UkStage();
      renderCorrectionStage();
      renderSrsCatalog6000();
    }
    recordDailyStudyActivity(5);
    renderCourseSyllabus();
  } else {
    recordDailyStudyActivity(2);
  }

  persistAssessmentStore();
  saveDB();
  syncSubnavAndBadgesUI();
  renderActiveModule();
  refreshTodayIfVisible();

  const mainScroll = document.getElementById('main-scroll-container');
  if (mainScroll) {
    mainScroll.scrollTop = 0;
  }
}

// ============================================================================
// 5. GRADED COMPREHENSIBLE INPUT READER (A0 TO B2–C1)
// ============================================================================
let activeReaderLevelFilter: string = 'A0';
let activePassageId = READER_PASSAGES[0].id;
let showReaderTranslations = true;

let showReaderStoryDrawer = false;

export function toggleReaderStoryDrawer(force?: boolean): void {
  triggerHaptic('light');
  showReaderStoryDrawer = typeof force === 'boolean' ? force : !showReaderStoryDrawer;
  initReader();
}

export function filterReaderByLevel(level: string): void {
  triggerHaptic('light');
  activeReaderLevelFilter = level;
  showReaderStoryDrawer = true;
  const matching =
    level === 'ALL'
      ? READER_PASSAGES
      : READER_PASSAGES.filter((p) => p.level === level);
  if (matching.length > 0 && !matching.some((p) => p.id === activePassageId)) {
    activePassageId = matching[0].id;
  }
  initReader();
}

export function selectReaderPassage(passageId: string): void {
  triggerHaptic('light');
  activePassageId = passageId;
  showReaderStoryDrawer = false;
  const found = READER_PASSAGES.find((p) => p.id === passageId);
  if (
    found &&
    activeReaderLevelFilter !== 'ALL' &&
    activeReaderLevelFilter !== found.level
  ) {
    activeReaderLevelFilter = found.level;
  }
  initReader();
}

export function toggleReaderTranslations(): void {
  triggerHaptic('light');
  showReaderTranslations = !showReaderTranslations;
  initReader();
}

let activeReaderSheetContext: { rawWord: string; passageId: string } | null =
  null;
const customSavedReaderWords = new Set<string>();

export function closeReaderWordSheet(): void {
  const sheet = document.getElementById('reader-word-sheet');
  const wasOpen = Boolean(sheet?.classList.contains('is-open'));
  document
    .getElementById('reader-word-sheet-backdrop')
    ?.classList.remove('is-open');
  sheet?.classList.remove('is-open');
  if (wasOpen) {
    releaseFocusTrap('reader-word-sheet');
  }
}

export function openFullInspectorFromReaderSheet(): void {
  if (!activeReaderSheetContext) {
    closeReaderWordSheet();
    openInspectorSheet();
    return;
  }
  const { rawWord, passageId } = activeReaderSheetContext;
  const passage =
    READER_PASSAGES.find((p) => p.id === passageId) || READER_PASSAGES[0];
  const deckSet = new Set(db.cards.map((c) => c.rank));
  const resolved = resolveReaderWordLookup(
    rawWord,
    passage,
    FREQ_6000_DB,
    deckSet
  );
  closeReaderWordSheet();
  if (resolved.matchedRank !== null) {
    inspectWordDeep(resolved.matchedRank, false, true);
  } else {
    inspectCourseWord(resolved.lemmaUk);
  }
}

export function addReaderSheetWordToReviews(): void {
  if (!activeReaderSheetContext) return;
  const { rawWord, passageId } = activeReaderSheetContext;
  const passage =
    READER_PASSAGES.find((p) => p.id === passageId) || READER_PASSAGES[0];
  const deckSet = new Set(db.cards.map((c) => c.rank));
  const resolved = resolveReaderWordLookup(
    rawWord,
    passage,
    FREQ_6000_DB,
    deckSet
  );

  if (resolved.matchedRank !== null) {
    addSingleWordFrom6000(resolved.matchedRank);
  } else {
    triggerHaptic('heavy');
    addWordByUkToFSRS(resolved.lemmaUk);
    customSavedReaderWords.add(normalizeUkLookupKey(resolved.lemmaUk));
  }
  openReaderWordSheet(rawWord, passageId, false);
}

export function openReaderWordSheet(
  rawWord: string,
  passageId: string,
  playAudio = true
): void {
  activeReaderSheetContext = { rawWord, passageId };
  const passage =
    READER_PASSAGES.find((p) => p.id === passageId) || READER_PASSAGES[0];
  const deckSet = new Set(db.cards.map((c) => c.rank));
  const resolved = resolveReaderWordLookup(
    rawWord,
    passage,
    FREQ_6000_DB,
    deckSet
  );
  const isSaved =
    resolved.inReviews ||
    customSavedReaderWords.has(normalizeUkLookupKey(resolved.lemmaUk));

  const matchedItem =
    resolved.matchedRank !== null
      ? FREQ_6000_DB[resolved.matchedRank - 1]
      : undefined;
  const synthItem: VocabItem = matchedItem || {
    rank: 1,
    ru: resolved.lemmaUk,
    pos: resolved.synthPos,
    en: resolved.englishMeaning,
    level: 'A2',
    exUk: resolved.surfaceUk,
    exEn: resolved.contextNote,
  };

  const phon = generateUkrainianPhonetics(resolved.surfaceUk);
  const gram = generateGrammarBreakdown(synthItem);

  // Keep side Word forms panel synced in background if user opens it
  if (matchedItem) {
    inspectWordDeep(matchedItem.rank, false, false);
  }

  const sheetBody = document.getElementById('reader-word-sheet-body');
  if (sheetBody) {
    sheetBody.innerHTML = `
      <div class="reader-sheet-top">
        <div>
          <div class="reader-meta-line">
            <span class="reader-meta-level">${escapeHtml(resolved.levelInfo.label)}</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtml(resolved.posLabel)}</span>
            ${
              normalizeUkLookupKey(resolved.lemmaUk) !==
              normalizeUkLookupKey(resolved.surfaceUk)
                ? `<span aria-hidden="true">·</span><span>Dictionary form: <strong class="word">${escapeHtml(resolved.lemmaUk)}</strong></span>`
                : ''
            }
          </div>
          <div class="reader-sheet-word-uk" onclick="speakUkrainian('${escapeSingleQuotes(resolved.surfaceUk)}')">${escapeHtml(resolved.surfaceUk)}</div>
          <div class="reader-sheet-phonetics">
            Sounds like <strong class="reader-sheet-guide">${escapeHtml(phon.plainGuide)}</strong>
            <span aria-hidden="true">·</span>
            <span class="reader-sheet-ipa">${escapeHtml(phon.ipa)}</span>
          </div>
        </div>
        <button type="button" class="btn btn-sec btn--sm" onclick="closeReaderWordSheet()" aria-label="Close word details">Close</button>
      </div>

      <div class="reader-sheet-meaning">${escapeHtml(resolved.englishMeaning)}</div>
      ${
        resolved.contextNote
          ? `<div class="reader-sheet-note">${escapeHtml(resolved.contextNote)}</div>`
          : ''
      }

      <div class="reader-sheet-actions">
        <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(resolved.surfaceUk)}')">Listen</button>
        <button type="button" id="reader-sheet-add-review-btn" class="btn ${isSaved ? 'btn-sec' : ''}" onclick="addReaderSheetWordToReviews()" ${isSaved ? 'disabled' : ''}>
          ${isSaved ? '✓ In your reviews' : '+ Add to reviews'}
        </button>
        <button type="button" class="btn btn-sec" onclick="openFullInspectorFromReaderSheet()">Full Word forms</button>
      </div>

      <div class="reader-sheet-forms">
        <div class="reader-sheet-forms-title">Word forms · ${escapeHtml(formatCleanSummaryTag(gram.summaryTag))}</div>
        ${gram.tableHtml}
      </div>
    `;
  }

  document
    .getElementById('reader-word-sheet-backdrop')
    ?.classList.add('is-open');
  const sheetEl = document.getElementById('reader-word-sheet');
  sheetEl?.classList.add('is-open');
  if (sheetEl) {
    trapFocusInModal('reader-word-sheet');
  }

  if (playAudio) {
    speakUkrainian(resolved.surfaceUk);
  }
}

export function inspectReaderWord(
  rawWord: string,
  passageId: string
): void {
  triggerHaptic('light');
  openReaderWordSheet(rawWord, passageId, true);
}

function tokenizeSentenceHtml(sentenceUk: string, passageId: string): string {
  const parts = sentenceUk.split(/(\s+)/);
  return parts
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      const match = part.match(/^([«"“”()]*)(.+?)([»"“”.,!?;:()]*)$/);
      if (!match) return part;
      const [, leading, core, trailing] = match;
      if (!/[а-яА-ЯіїєґІЇЄҐ]/.test(core)) return part;
      return `${leading}<button type="button" class="word-token" onclick="inspectReaderWord('${escapeSingleQuotes(core)}', '${passageId}')">${core}</button>${trailing}`;
    })
    .join('');
}

export function initReader(): void {
  const container = document.getElementById('story-container');
  if (!container) return;

  const passage: ReaderPassage =
    READER_PASSAGES.find((p) => p.id === activePassageId) || READER_PASSAGES[0];
  const passageLevelInfo = formatPlainLevelBadge(passage.level);
  const passageReadMeta = estimateStoryReadingMeta(passage.sentences);
  const rawGenre = passage.genre || '';
  const cleanTopic = rawGenre.includes('•')
    ? rawGenre.split('•').slice(1).join('·').trim()
    : rawGenre;

  const readerLevels: Array<{ id: string; label: string }> = [
    { id: 'ALL', label: `All stories (${READER_PASSAGES.length})` },
    {
      id: 'A0',
      label: `Level A0 · First steps (${READER_PASSAGES.filter((p) => p.level === 'A0').length})`,
    },
    {
      id: 'A1',
      label: `Level A1 · Beginner (${READER_PASSAGES.filter((p) => p.level === 'A1').length})`,
    },
    {
      id: 'A2',
      label: `Level A2 · Elementary (${READER_PASSAGES.filter((p) => p.level === 'A2').length})`,
    },
    {
      id: 'B1',
      label: `Level B1 · Intermediate (${READER_PASSAGES.filter((p) => p.level === 'B1').length})`,
    },
    {
      id: 'B2–C1',
      label: `Level B2–C1 · Advanced (${READER_PASSAGES.filter((p) => p.level === 'B2–C1').length})`,
    },
  ];

  const visiblePassages =
    activeReaderLevelFilter === 'ALL'
      ? READER_PASSAGES
      : READER_PASSAGES.filter((p) => p.level === activeReaderLevelFilter);

  const selectorHtml = `
    <div class="reader-toolbar">
      <div class="reader-meta-line">
        <span class="reader-meta-level">${escapeHtml(passageLevelInfo.label)}</span>
        <span class="reader-meta-code">(${escapeHtml(passageLevelInfo.code)})</span>
        ${cleanTopic ? `<span aria-hidden="true">·</span><span>${escapeHtml(cleanTopic)}</span>` : ''}
        <span aria-hidden="true">·</span>
        <span>${passageReadMeta.readTimeLabel}</span>
        <span aria-hidden="true">·</span>
        <span>${passageReadMeta.sentenceCount} sentences</span>
      </div>
      <div class="cluster">
        <button type="button" class="btn btn-sec btn--sm" onclick="toggleReaderTranslations()">
          ${showReaderTranslations ? 'Hide English' : 'Show English'}
        </button>
        <button type="button" class="btn btn-sec btn--sm" aria-expanded="${showReaderStoryDrawer ? 'true' : 'false'}" onclick="toggleReaderStoryDrawer()">
          ${showReaderStoryDrawer ? 'Close story library' : `Choose story (${READER_PASSAGES.length})`}
        </button>
      </div>
    </div>

    ${
      showReaderStoryDrawer
        ? `
      <div class="reader-library-drawer" id="reader-library-drawer">
        <div class="reader-library-head">
          <div>
            <strong class="card-heading--flush">Graded Ukrainian story library</strong>
            <div class="hint">Pick a story at your comfortable reading level from A0 to C1.</div>
          </div>
          <button type="button" class="btn btn-sec btn--sm" onclick="toggleReaderStoryDrawer()">Done</button>
        </div>
        <div class="stage-bar" id="reader-level-filter-bar" role="tablist" aria-label="Filter stories by level">
          ${readerLevels
            .map(
              (lvl) => `
            <button type="button" class="stage-pill ${activeReaderLevelFilter === lvl.id ? 'active' : ''}" onclick="filterReaderByLevel('${lvl.id}')">
              ${escapeHtml(lvl.label)}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="reader-passage-grid">
          ${visiblePassages
            .map((p) => {
              const isAct = p.id === passage.id;
              const pLevel = formatPlainLevelBadge(p.level);
              const pMeta = estimateStoryReadingMeta(p.sentences);
              const genreStr = p.genre || '';
              const shortTopic = genreStr.split('•')[1]?.trim() || genreStr;
              return `
              <button type="button" class="reader-passage-card ${isAct ? 'active' : ''}" onclick="selectReaderPassage('${p.id}')">
                <div class="reader-story-card-kicker">
                  <span class="reader-story-card-level">${escapeHtml(pLevel.label)}</span>
                  <span aria-hidden="true">·</span>
                  <span>${pMeta.readTimeLabel}</span>
                </div>
                <div class="reader-story-card-uk">${escapeHtml(p.titleUk || p.title || '')}</div>
                <div class="reader-story-card-en">${escapeHtml(p.titleEn || p.subtitle || '')}</div>
                ${shortTopic ? `<div class="reader-story-card-topic">${escapeHtml(shortTopic)} · ${pMeta.sentenceCount} sentences</div>` : ''}
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    `
        : ''
    }
  `;

  const articleHtml = `
    <article class="reader-article">
      <header class="reader-story-head">
        <h2 class="reader-story-title-uk">${escapeHtml(passage.titleUk || passage.title || '')}</h2>
        <div class="reader-story-title-en">${escapeHtml(passage.titleEn || passage.subtitle || '')}</div>
        ${passage.summaryEn ? `<p class="reader-story-summary">${escapeHtml(passage.summaryEn)}</p>` : ''}
        <div class="reader-tap-hint">Tap any dotted Ukrainian word for its translation, audio, case forms, and to save it to your reviews.</div>
      </header>

      <div class="reader-prose-flow">
        ${passage.sentences
          .map(
            (s) => `
          <div class="reader-sentence-row">
            <div class="reader-sentence-main">
              <div class="reader-sentence-uk">
                ${tokenizeSentenceHtml(s.uk, passage.id)}
              </div>
              <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(s.uk)}')" aria-label="Listen to sentence">Listen</button>
            </div>
            ${
              showReaderTranslations
                ? `<div class="reader-sentence-en">${escapeHtml(s.en)}</div>`
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>

      <section class="reader-check-section" aria-label="Reading comprehension check">
        <h3 class="reader-check-heading">Check your understanding</h3>
        ${passage.questions
          .map(
            (qItem, idx) => `
          <div class="reader-question-block">
            <div class="reader-question-prompt">${idx + 1}. ${escapeHtml(qItem.q)}</div>
            ${qItem.opts
              .map(
                (opt, oIdx) => `
              <button type="button" class="option-btn" onclick="handleCourseOptionTap(this, ${oIdx === qItem.ans}, 'reader-exp-${passage.id}-${idx}', 'reader:${passage.id}:${idx}')">${escapeHtml(opt)}</button>
            `
              )
              .join('')}
            <div id="reader-exp-${passage.id}-${idx}" class="reader-question-exp hidden">
              <strong>Why:</strong> ${escapeHtml(qItem.exp)}
            </div>
          </div>
        `
          )
          .join('')}
      </section>
    </article>
  `;

  container.innerHTML = selectorHtml + articleHtml;
}

export function speakStory(): void {
  const passage =
    READER_PASSAGES.find((p) => p.id === activePassageId) || READER_PASSAGES[0];
  const fullText = passage.sentences.map((s) => s.uk).join(' ');
  speakUkrainian(fullText);
}

// ============================================================================
// 5B. EVERYDAY VOCABULARY & MEMORY LAB (27 CATEGORIES & 8 EXERCISE MODES)
// ============================================================================
let activeVocabCategoryId: string = EVERYDAY_CATEGORIES[0].id;
let activeVocabMode:
  | 'browse'
  | 'uk2en'
  | 'en2uk'
  | 'fillblank'
  | 'sentence'
  | 'listening'
  | 'context'
  | 'grammar' = 'browse';
let activeSentenceBuilderState: Map<string, string[]> = new Map();

export function selectVocabCategory(categoryId: string): void {
  triggerHaptic('light');
  activeVocabCategoryId = categoryId;
  renderEverydayVocabTab();
}

export function selectVocabMode(
  mode:
    | 'browse'
    | 'uk2en'
    | 'en2uk'
    | 'fillblank'
    | 'sentence'
    | 'listening'
    | 'context'
    | 'grammar'
): void {
  triggerHaptic('light');
  activeVocabMode = mode;
  renderEverydayVocabTab();
}

export function clearVocabTopicSearch(): void {
  const searchEl = document.getElementById(
    'vocab-search-input'
  ) as HTMLInputElement | null;
  if (searchEl) searchEl.value = '';
  renderEverydayVocabWorkspace();
}

export function practiceActiveTopicInReview(): void {
  triggerHaptic('light');
  selectReviewTopicCategory(activeVocabCategoryId);
  selectReviewMode('topics');
}

export function speakCategoryGuide(): void {
  const cat =
    EVERYDAY_CATEGORIES.find((c) => c.id === activeVocabCategoryId) ||
    EVERYDAY_CATEGORIES[0];
  playBilingualOpenAI(
    `${cat.title}. ${cat.description} Grammar tip: ${cat.grammarTip}`,
    'en'
  );
}

export function addCategoryToFSRS(): void {
  triggerHaptic('heavy');
  const items = getCategoryVocabItems(activeVocabCategoryId);
  let added = 0;
  for (const item of items) {
    if (!db.cards.some((c) => c.rank === item.rank)) {
      db.cards.push(createCardRecord(item.rank));
      added++;
    }
  }
  if (added > 0) {
    db.xp += added * 2;
    saveDB();
    renderAnkiStage();
    renderEn2UkStage();
    renderCorrectionStage();
    renderSrsCatalog6000();
  }
  renderEverydayVocabWorkspace();
}

export function checkVocabActiveRecall(
  inputId: string,
  feedbackId: string,
  expectedUk: string,
  exampleUk: string
): void {
  const inputEl = document.getElementById(inputId) as HTMLInputElement | null;
  const fbEl = document.getElementById(feedbackId);
  if (!inputEl || !fbEl) return;

  const result = validateUkrainianAnswer(inputEl.value, expectedUk);
  fbEl.classList.remove('hidden');
  if (result.isCorrect) {
    triggerHaptic('heavy');
    fbEl.className = 'identify-feedback-banner identify-feedback-banner--right';
    fbEl.innerHTML = `<span class="identify-feedback-icon" aria-hidden="true">✓</span><div><strong>Right</strong> — ${escapeHtml(result.feedbackMessage)}
      <div class="topic-feedback-ex" onclick="speakUkrainian('${escapeSingleQuotes(exampleUk)}')">Example: <strong class="word">${escapeHtml(exampleUk)}</strong></div></div>`;
    speakUkrainian(expectedUk);
    const quizKey = `vocab-recall:${expectedUk}`;
    if (!completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 12;
      db.drills += 1;
      saveDB();
    }
  } else {
    triggerHaptic('light');
    fbEl.className = 'identify-feedback-banner identify-feedback-banner--wrong';
    fbEl.innerHTML = `<span class="identify-feedback-icon" aria-hidden="true">✗</span><div><strong>Not quite</strong> — ${escapeHtml(result.feedbackMessage)}
      <div class="topic-feedback-actions"><button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(expectedUk)}')">Listen to answer</button></div></div>`;
  }
}

export function addSentenceTile(
  exerciseId: string,
  word: string
): void {
  triggerHaptic('light');
  const current = activeSentenceBuilderState.get(exerciseId) || [];
  current.push(word);
  activeSentenceBuilderState.set(exerciseId, current);
  renderEverydayVocabWorkspace();
}

export function resetSentenceBuilder(exerciseId: string): void {
  triggerHaptic('light');
  activeSentenceBuilderState.set(exerciseId, []);
  renderEverydayVocabWorkspace();
}

export function checkSentenceBuilder(
  exerciseId: string,
  targetUk: string,
  expId: string
): void {
  const built = (activeSentenceBuilderState.get(exerciseId) || []).join(' ');
  const res = validateUkrainianAnswer(built, targetUk);
  const expEl = document.getElementById(expId);
  if (!expEl) return;
  expEl.classList.remove('hidden');
  if (res.isCorrect) {
    triggerHaptic('heavy');
    speakUkrainian(targetUk);
    const quizKey = `sent-build:${exerciseId}`;
    if (!completedQuizKeys.has(quizKey)) {
      completedQuizKeys.add(quizKey);
      db.xp += 15;
      db.drills += 1;
      saveDB();
    }
  } else {
    triggerHaptic('light');
  }
}

export function renderEverydayVocabTab(): void {
  const catBar = document.getElementById('vocab-category-bar');
  const modeBar = document.getElementById('vocab-mode-bar');
  if (!catBar || !modeBar) return;

  catBar.innerHTML = EVERYDAY_CATEGORIES.map((cat) => {
    const isAct = cat.id === activeVocabCategoryId;
    return `<button type="button" class="stage-pill ${isAct ? 'active' : ''}" onclick="selectVocabCategory('${cat.id}')">${cat.icon} ${cat.title}</button>`;
  }).join('');

  const modes: Array<{
    id:
      | 'browse'
      | 'uk2en'
      | 'en2uk'
      | 'fillblank'
      | 'sentence'
      | 'listening'
      | 'context'
      | 'grammar';
    label: string;
  }> = [
    { id: 'browse', label: 'Browse words' },
    { id: 'uk2en', label: 'UK → EN' },
    { id: 'en2uk', label: 'EN → UK' },
    { id: 'fillblank', label: 'Fill in the blank' },
    { id: 'sentence', label: 'Build sentence' },
    { id: 'listening', label: 'Listening' },
    { id: 'context', label: 'Context choice' },
    { id: 'grammar', label: 'Word forms in context' },
  ];

  modeBar.innerHTML = modes
    .map(
      (m) =>
        `<button type="button" class="stage-pill ${activeVocabMode === m.id ? 'active' : ''}" onclick="selectVocabMode('${m.id}')">${m.label}</button>`
    )
    .join('');

  renderEverydayVocabWorkspace();
}

export function renderEverydayVocabWorkspace(): void {
  const box = document.getElementById('vocab-lab-workspace');
  if (!box) return;

  const cat =
    EVERYDAY_CATEGORIES.find((c) => c.id === activeVocabCategoryId) ||
    EVERYDAY_CATEGORIES[0];
  const searchEl = document.getElementById(
    'vocab-search-input'
  ) as HTMLInputElement | null;
  const rawQuery = (searchEl?.value || '').trim();
  const query = rawQuery.toLowerCase().replace(/\u0301/g, '');

  const rawItems = getCategoryVocabItems(cat.id);
  const items = query
    ? rawItems.filter(
        (w) =>
          w.ru.toLowerCase().includes(query) ||
          w.ru.replace(/\u0301/g, '').toLowerCase().includes(query) ||
          w.en.toLowerCase().includes(query)
      )
    : rawItems;

  const inReviewsCount = rawItems.filter((w) =>
    db.cards.some((c) => c.rank === w.rank)
  ).length;

  const headerBanner = `
    <div class="topic-overview-bar">
      <div class="topic-overview-top">
        <div class="topic-overview-meta">
          <span class="topic-overview-title">${cat.icon} ${escapeHtml(cat.title)}</span>
          <span aria-hidden="true">·</span>
          <span>${rawItems.length} curated words</span>
          <span aria-hidden="true">·</span>
          <span>${inReviewsCount} in your reviews</span>
        </div>
        <button type="button" class="btn btn-sec btn--sm" onclick="speakCategoryGuide()">Listen to topic guide</button>
      </div>
      <p class="topic-overview-desc">${escapeHtml(cat.description)}</p>
      <div class="topic-grammar-note">
        <strong>Usage tip:</strong> ${escapeHtml(cat.grammarTip)}
      </div>
    </div>
  `;

  if (
    query &&
    items.length === 0 &&
    (activeVocabMode === 'browse' ||
      activeVocabMode === 'uk2en' ||
      activeVocabMode === 'en2uk' ||
      activeVocabMode === 'listening')
  ) {
    box.innerHTML =
      headerBanner +
      `
      <div class="empty-state-box">
        <h3 class="empty-state-title">No words in ${escapeHtml(cat.title)} match “${escapeHtml(rawQuery)}”</h3>
        <p class="empty-state-desc">Try searching in Ukrainian or English without punctuation, or clear the filter to view all ${rawItems.length} words in this topic.</p>
        <div class="empty-state-actions">
          <button type="button" class="btn btn-sec btn--sm" onclick="clearVocabTopicSearch()">Clear filter</button>
        </div>
      </div>
    `;
    return;
  }

  if (activeVocabMode === 'browse') {
    const rowsHtml = items
      .map((w) => {
        const inDeck = db.cards.some((c) => c.rank === w.rank);
        const phon = generateUkrainianPhonetics(w.ru);
        const lvlInfo = formatPlainLevelBadge(w.level);
        const exUk = w.exampleUk || w.exUk || w.ru;
        const exEn = w.exampleEn || w.exEn || w.en;
        return `
        <div class="freq-row freq-row--interactive" onclick="inspectWordDeep(${w.rank}, true, true)">
          <div class="freq-row-main">
            <div class="freq-row-head">
              <span class="word freq-row-uk">${w.ru}</span>
              <span class="freq-row-ipa">${phon.ipa}</span>
              <span class="hint">#${w.rank} · ${lvlInfo.label} · ${w.pos}</span>
            </div>
            <div class="freq-row-en--strong">${w.en} <span class="hint">· Sounds like ${phon.plainGuide}</span></div>
            <div onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(exUk)}')" class="hint freq-row-ex">
              <span class="word freq-row-ex-uk">${exUk}</span> — ${exEn}
            </div>
          </div>
          <div class="freq-row-actions">
            <button type="button" class="btn btn-sec btn--sm" onclick="event.stopPropagation(); inspectWordDeep(${w.rank}, true, true)">Word forms</button>
            <button type="button" class="btn ${inDeck ? 'btn-sec' : ''} btn--sm" onclick="event.stopPropagation(); addSingleWordFrom6000(${w.rank}); renderEverydayVocabWorkspace();" ${inDeck ? 'disabled' : ''}>
              ${inDeck ? '✓ In reviews' : '+ Add to reviews'}
            </button>
          </div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + rowsHtml;
    return;
  }

  if (activeVocabMode === 'uk2en') {
    const quizPool = items.slice(0, 12);
    const cardsHtml = quizPool
      .map((w, idx) => {
        const distractors = FREQ_6000_DB.filter(
          (x) => x.rank !== w.rank && x.pos === w.pos
        )
          .slice(idx * 2, idx * 2 + 2)
          .map((x) => x.en);
        const rawOpts = [w.en, ...(distractors.length >= 2 ? distractors : ['house', 'morning'])];
        const ansIdx = idx % 3;
        const opts = [...rawOpts];
        const temp = opts[0];
        opts[0] = opts[ansIdx];
        opts[ansIdx] = temp;
        const exUk = w.exampleUk || w.exUk || w.ru;
        return `
        <div class="card card--flat topic-drill-card">
          <div class="topic-drill-header">
            <div class="topic-drill-title-uk" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">${idx + 1}. <span class="word">${w.ru}</span> <span class="hint">· ${w.pos}</span></div>
            <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">Listen</button>
          </div>
          ${opts
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === ansIdx}, 'uk2en-exp-${idx}', 'uk2en:${w.rank}', '${escapeSingleQuotes(w.ru)}')">${opt}</button>
          `
            )
            .join('')}
          <div id="uk2en-exp-${idx}" class="reader-question-exp hidden">
            <strong>Meaning:</strong> <span class="word">${w.ru}</span> = <strong>${w.en}</strong>.<br>
            <span class="topic-clickable-ex" onclick="speakUkrainian('${escapeSingleQuotes(exUk)}')">Example: <strong class="word">${exUk}</strong> (${w.exampleEn || w.exEn || ''})</span>
          </div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + cardsHtml;
    return;
  }

  if (activeVocabMode === 'en2uk') {
    const recallPool = items.slice(0, 10);
    const recallHtml = recallPool
      .map((w, idx) => {
        const exUk = w.exampleUk || w.exUk || w.ru;
        return `
        <div class="card card--flat topic-drill-card">
          <div class="topic-drill-prompt">
            ${idx + 1}. Type the Ukrainian word for <strong class="text-accent-strong">“${w.en}”</strong> <span class="hint">· ${w.pos}</span>
          </div>
          <div class="hint topic-drill-hint">
            Stress marks and capitalization are optional; apostrophes (' / ’) are matched automatically.
          </div>
          <div class="topic-drill-input-row">
            <input id="voc-recall-in-${idx}" type="text" class="input-box topic-drill-input" placeholder="Type in Ukrainian…" onkeydown="if(event.key==='Enter') checkVocabActiveRecall('voc-recall-in-${idx}', 'voc-recall-fb-${idx}', '${escapeSingleQuotes(w.ru)}', '${escapeSingleQuotes(exUk)}')">
            <button type="button" class="btn" onclick="checkVocabActiveRecall('voc-recall-in-${idx}', 'voc-recall-fb-${idx}', '${escapeSingleQuotes(w.ru)}', '${escapeSingleQuotes(exUk)}')">Check</button>
            <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">Listen hint</button>
          </div>
          <div id="voc-recall-fb-${idx}" class="hidden topic-drill-feedback"></div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + recallHtml;
    return;
  }

  if (activeVocabMode === 'fillblank') {
    const catBlanks = FILL_BLANK_EXERCISES.filter(
      (x) => x.categoryId === cat.id
    );
    const activeBlanks =
      catBlanks.length > 0 ? catBlanks : FILL_BLANK_EXERCISES;
    const html = activeBlanks
      .map((fb, idx) => {
        const opts = [fb.answerUk, ...fb.distractors];
        const rot = idx % opts.length;
        const rotated = opts.map((_, i) => opts[(i + rot) % opts.length]);
        const correctIdx = rotated.indexOf(fb.answerUk);
        const fullSentence = fb.sentenceWithBlank.replace('___', fb.answerUk);
        return `
        <div class="card card--flat topic-drill-card">
          <div class="word topic-drill-sentence">${idx + 1}. ${fb.sentenceWithBlank}</div>
          <div class="hint topic-drill-hint">“${fb.englishTranslation}” · <span class="text-accent-strong">${fb.grammarHint}</span></div>
          ${rotated
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === correctIdx}, 'fb-exp-${idx}', 'fb:${fb.id}', '${escapeSingleQuotes(fullSentence)}')"><span class="word">${opt}</span></button>
          `
            )
            .join('')}
          <div id="fb-exp-${idx}" class="reader-question-exp hidden">
            <strong>Complete sentence:</strong> <span class="word word--clickable-strong" onclick="speakUkrainian('${escapeSingleQuotes(fullSentence)}')">${fullSentence}</span><br>
            <strong>Why:</strong> ${fb.grammarHint}
          </div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + html;
    return;
  }

  if (activeVocabMode === 'sentence') {
    const catSentences = SENTENCE_CONSTRUCTION_EXERCISES.filter(
      (s) => s.categoryId === cat.id
    );
    const pool =
      catSentences.length > 0 ? catSentences : SENTENCE_CONSTRUCTION_EXERCISES;
    const html = pool
      .map((sc, idx) => {
        const chosen = activeSentenceBuilderState.get(sc.id) || [];
        return `
        <div class="card card--flat topic-drill-card">
          <div class="topic-drill-prompt">${idx + 1}. Build the Ukrainian sentence for: <strong class="text-accent-strong">“${sc.promptEn}”</strong></div>
          <div class="review-tile-well topic-tile-well">
            ${chosen.length > 0 ? chosen.join(' ') : '<span class="hint">Tap word tiles below in order…</span>'}
          </div>
          <div class="topic-tile-bank">
            ${sc.scrambledWords
              .map(
                (w) => `
              <button type="button" class="btn btn-sec btn--sm" onclick="addSentenceTile('${sc.id}', '${escapeSingleQuotes(w)}')"><span class="word">${w}</span></button>
            `
              )
              .join('')}
          </div>
          <div class="topic-drill-input-row">
            <button type="button" class="btn" onclick="checkSentenceBuilder('${sc.id}', '${escapeSingleQuotes(sc.targetUk)}', 'sc-exp-${idx}')">Check sentence</button>
            <button type="button" class="btn btn-sec" onclick="resetSentenceBuilder('${sc.id}')">Reset tiles</button>
            <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(sc.targetUk)}')">Listen to target</button>
          </div>
          <div id="sc-exp-${idx}" class="reader-question-exp hidden">
            <strong>Target sentence:</strong> <span class="word word--clickable-strong" onclick="speakUkrainian('${escapeSingleQuotes(sc.targetUk)}')">${sc.targetUk}</span><br>
            <strong>Grammar note:</strong> ${sc.grammarExplanation}
          </div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + html;
    return;
  }

  if (activeVocabMode === 'listening') {
    const listenPool = items.slice(0, 10);
    const html = listenPool
      .map((w, idx) => {
        const distractors = FREQ_6000_DB.filter(
          (x) => x.rank !== w.rank
        )
          .slice(idx * 3, idx * 3 + 2)
          .map((x) => `${x.ru} — ${x.en}`);
        const correctLabel = `${w.ru} — ${w.en}`;
        const rawOpts = [correctLabel, ...distractors];
        const ansIdx = idx % rawOpts.length;
        const opts = [...rawOpts];
        const tmp = opts[0];
        opts[0] = opts[ansIdx];
        opts[ansIdx] = tmp;
        const exUk = w.exampleUk || w.exUk || w.ru;
        return `
        <div class="card card--flat topic-drill-card">
          <div class="topic-drill-header">
            <div class="topic-drill-prompt">${idx + 1}. Listen first, then pick the matching Ukrainian word:</div>
            <div class="freq-row-actions">
              <button type="button" class="btn btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">Play word</button>
              <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(exUk)}')">Play example</button>
            </div>
          </div>
          ${opts
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === ansIdx}, 'listen-exp-${idx}', 'listen:${w.rank}', '${escapeSingleQuotes(w.ru)}')">${opt}</button>
          `
            )
            .join('')}
          <div id="listen-exp-${idx}" class="reader-question-exp hidden">
            <strong>Spoken word:</strong> <strong class="word">${w.ru}</strong> (${w.en}) · <span class="word">${exUk}</span>
          </div>
        </div>
      `;
      })
      .join('');
    box.innerHTML = headerBanner + html;
    return;
  }

  if (activeVocabMode === 'context') {
    const catCtx = CONTEXTUAL_CHOICE_EXERCISES.filter(
      (c) => c.categoryId === cat.id
    );
    const pool = catCtx.length > 0 ? catCtx : CONTEXTUAL_CHOICE_EXERCISES;
    const html = pool
      .map(
        (cc, idx) => `
      <div class="card card--flat topic-drill-card">
        <div class="hint topic-drill-situation">Situation ${idx + 1}: ${cc.situationEn}</div>
        <div class="word topic-drill-sentence">${cc.sentenceUk}</div>
        ${cc.options
          .map(
            (opt, oIdx) => `
          <button type="button" class="option-btn" onclick="handleCourseOptionTap(this, ${oIdx === cc.correctIndex}, 'ctx-exp-${idx}', 'ctx:${cc.id}')"><span class="word">${opt}</span></button>
        `
          )
          .join('')}
        <div id="ctx-exp-${idx}" class="reader-question-exp hidden">
          <strong>Why this fits:</strong> ${cc.explanation}
        </div>
      </div>
    `
      )
      .join('');
    box.innerHTML = headerBanner + html;
    return;
  }

  // Mode 8: Word forms in context
  const catGram = GRAMMAR_AWARE_EXERCISES.filter(
    (g) => g.categoryId === cat.id
  );
  const pool = catGram.length > 0 ? catGram : GRAMMAR_AWARE_EXERCISES;
  const html = pool
    .map((ga, idx) => {
      const fullSentence = ga.promptUk.replace('___', ga.answerUk);
      return `
      <div class="card card--flat topic-drill-card">
        <div class="hint">
          Base word: <strong class="word text-strong-ink">${ga.baseWordUk}</strong> (${ga.baseWordEn}) · ${ga.targetGrammarForm}
        </div>
        <div class="word topic-drill-sentence">${idx + 1}. ${ga.promptUk}</div>
        <div class="hint topic-drill-hint">“${ga.promptEn}”</div>
        ${ga.options
          .map(
            (opt) => `
          <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${opt === ga.answerUk}, 'ga-exp-${idx}', 'ga:${ga.id}', '${escapeSingleQuotes(fullSentence)}')"><span class="word">${opt}</span></button>
        `
          )
          .join('')}
        <div id="ga-exp-${idx}" class="reader-question-exp hidden">
          <strong>In context:</strong> <span class="word word--clickable-strong" onclick="speakUkrainian('${escapeSingleQuotes(fullSentence)}')">${fullSentence}</span><br>
          <strong>Why:</strong> ${ga.explanation}
        </div>
      </div>
    `;
    })
    .join('');
  box.innerHTML = headerBanner + html;
}

// ============================================================================
// 6. PHASE 2 — TODAY STUDY HOME, 3-STEP ONBOARDING, 5-DESTINATION IA & ROUTER
// ============================================================================
const LANGO_ONBOARDING_STORAGE_KEY = 'slovo_ua_onboarding_v1';
const LANGO_DAILY_GOAL_STORAGE_KEY = 'slovo_ua_daily_goal_v1';

type OnboardingStartChoice = 'new' | 'alphabet' | 'place';
type DailyGoalMinutes = 10 | 20 | 30;

interface OnboardingStateV1 {
  completed: boolean;
  startingChoice: OnboardingStartChoice;
  recommendedModId: string;
  dailyGoalMinutes: DailyGoalMinutes;
  lastModId: string;
  lastStage: number;
  lastSectionId: string;
  completedAt?: string;
}

interface DailyGoalTrackerV1 {
  dailyGoalMinutes: DailyGoalMinutes;
  lastActiveDate: string;
  streakDays: number;
  todayDate: string;
  minutesToday: number;
  actionsToday: number;
}

function getLocalIsoDate(d: Date = new Date()): string {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

function getYesterdayIsoDate(d: Date = new Date()): string {
  const prev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  return getLocalIsoDate(prev);
}

function normalizeDailyGoalMinutes(val: unknown): DailyGoalMinutes {
  if (val === 10 || val === '10') return 10;
  if (val === 30 || val === '30') return 30;
  return 20;
}

function loadOnboardingState(): OnboardingStateV1 {
  const raw = localStorage.getItem(LANGO_ONBOARDING_STORAGE_KEY);
  let parsed: Partial<OnboardingStateV1> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }
  const validMod = COURSE_MODULES.some((m) => m.id === parsed.lastModId)
    ? (parsed.lastModId as string)
    : COURSE_MODULES[0].id;
  const validRec = COURSE_MODULES.some((m) => m.id === parsed.recommendedModId)
    ? (parsed.recommendedModId as string)
    : COURSE_MODULES[0].id;

  return {
    completed: Boolean(parsed.completed),
    startingChoice:
      parsed.startingChoice === 'alphabet' || parsed.startingChoice === 'place'
        ? parsed.startingChoice
        : 'new',
    recommendedModId: validRec,
    dailyGoalMinutes: normalizeDailyGoalMinutes(parsed.dailyGoalMinutes),
    lastModId: validMod,
    lastStage:
      typeof parsed.lastStage === 'number' &&
      parsed.lastStage >= 0 &&
      parsed.lastStage <= 4
        ? parsed.lastStage
        : 0,
    lastSectionId:
      typeof parsed.lastSectionId === 'string' && parsed.lastSectionId
        ? parsed.lastSectionId
        : 'sec-learn',
    completedAt: parsed.completedAt,
  };
}

function saveOnboardingState(): void {
  localStorage.setItem(
    LANGO_ONBOARDING_STORAGE_KEY,
    JSON.stringify(onboardingState)
  );
}

function loadDailyGoalTracker(fallbackGoal: DailyGoalMinutes): DailyGoalTrackerV1 {
  const today = getLocalIsoDate();
  const yesterday = getYesterdayIsoDate();
  const raw = localStorage.getItem(LANGO_DAILY_GOAL_STORAGE_KEY);
  let parsed: Partial<DailyGoalTrackerV1> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }
  const goal = parsed.dailyGoalMinutes
    ? normalizeDailyGoalMinutes(parsed.dailyGoalMinutes)
    : fallbackGoal;
  const savedToday = parsed.todayDate === today;
  const lastActive =
    typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : '';
  let streak =
    typeof parsed.streakDays === 'number' && parsed.streakDays >= 0
      ? parsed.streakDays
      : 0;
  if (lastActive && lastActive !== today && lastActive !== yesterday) {
    streak = 0;
  }

  return {
    dailyGoalMinutes: goal,
    lastActiveDate: lastActive,
    streakDays: streak,
    todayDate: today,
    minutesToday:
      savedToday && typeof parsed.minutesToday === 'number'
        ? Math.max(0, parsed.minutesToday)
        : 0,
    actionsToday:
      savedToday && typeof parsed.actionsToday === 'number'
        ? Math.max(0, parsed.actionsToday)
        : 0,
  };
}

const onboardingState: OnboardingStateV1 = loadOnboardingState();
const dailyGoalTracker: DailyGoalTrackerV1 = loadDailyGoalTracker(
  onboardingState.dailyGoalMinutes
);

if (
  COURSE_MODULES.some((m) => m.id === onboardingState.lastModId) &&
  onboardingState.lastModId
) {
  activeModId = onboardingState.lastModId;
  activeStage = onboardingState.lastStage;
}

let onboardingStep: 1 | 2 | 3 = 1;
let forceShowOnboarding = false;
const placementQuizSelections: Array<number | null> = [null, null, null];

interface PlacementQuestion {
  prompt: string;
  options: string[];
  correctIdx: number;
}

const ONBOARDING_PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    prompt: '1. Can you read this aloud? «Добрий день, кава будь ласка»',
    options: ['Not yet — teach me the letters', 'Yes: Dobryi den, kava bud laska'],
    correctIdx: 1,
  },
  {
    prompt: '2. Choose the natural form: «Я живу в ___» (in Kyiv)',
    options: ['Київ', 'Києві', 'Києва'],
    correctIdx: 1,
  },
  {
    prompt: '3. Completed action yesterday: «Вчора я ___ листа другу»',
    options: ['писав', 'написав', 'пишу'],
    correctIdx: 1,
  },
];

function computePlacementRecommendation(): string {
  let score = 0;
  ONBOARDING_PLACEMENT_QUESTIONS.forEach((q, idx) => {
    if (placementQuizSelections[idx] === q.correctIdx) score += 1;
  });
  if (score <= 0) return 'A0.1';
  if (score === 1) return 'A1.1';
  if (score === 2) return 'A2.1';
  return 'B1.1';
}

function saveDailyGoalTracker(): void {
  localStorage.setItem(
    LANGO_DAILY_GOAL_STORAGE_KEY,
    JSON.stringify(dailyGoalTracker)
  );
}

function recordDailyStudyActivity(minutesDelta: number): void {
  const today = getLocalIsoDate();
  const yesterday = getYesterdayIsoDate();
  if (dailyGoalTracker.todayDate !== today) {
    dailyGoalTracker.todayDate = today;
    dailyGoalTracker.minutesToday = 0;
    dailyGoalTracker.actionsToday = 0;
  }
  if (dailyGoalTracker.lastActiveDate !== today) {
    if (dailyGoalTracker.lastActiveDate === yesterday) {
      dailyGoalTracker.streakDays += 1;
    } else {
      dailyGoalTracker.streakDays = Math.max(1, dailyGoalTracker.streakDays);
    }
    dailyGoalTracker.lastActiveDate = today;
  }
  dailyGoalTracker.minutesToday = Math.min(
    180,
    Math.round((dailyGoalTracker.minutesToday + minutesDelta) * 10) / 10
  );
  dailyGoalTracker.actionsToday += 1;
  saveDailyGoalTracker();
}

function syncDailyGoalButtonsUI(): void {
  document.querySelectorAll('[data-daily-goal-opt]').forEach((btn) => {
    const val = Number(btn.getAttribute('data-daily-goal-opt'));
    const isAct = val === dailyGoalTracker.dailyGoalMinutes;
    btn.classList.toggle('active', isAct);
    btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
  });
}

export function setDailyGoalMinutes(minutes: number): void {
  triggerHaptic('light');
  const clean = normalizeDailyGoalMinutes(minutes);
  dailyGoalTracker.dailyGoalMinutes = clean;
  onboardingState.dailyGoalMinutes = clean;
  saveDailyGoalTracker();
  saveOnboardingState();
  syncDailyGoalButtonsUI();
  renderActiveReviewWorkspace();
  renderTodayTab();
  updateSidebarStats();
}

function saveCourseResumeBookmark(
  modId: string,
  stageIdx: number,
  sectionId?: string
): void {
  onboardingState.lastModId = modId;
  onboardingState.lastStage = stageIdx;
  if (sectionId) {
    onboardingState.lastSectionId = sectionId;
  }
  saveOnboardingState();
}

function refreshTodayIfVisible(): void {
  if (typeof document === 'undefined') return;
  const todaySection = document.getElementById('tab-today');
  if (todaySection && !todaySection.classList.contains('hidden')) {
    renderTodayTab();
  }
}

export function reopenOnboardingSetup(): void {
  triggerHaptic('light');
  forceShowOnboarding = true;
  onboardingStep = 1;
  switchTab('today');
  renderTodayTab();
}

export function skipOnboardingSetup(): void {
  triggerHaptic('light');
  onboardingState.completed = true;
  onboardingState.completedAt = new Date().toISOString();
  forceShowOnboarding = false;
  saveOnboardingState();
  renderTodayTab();
}

export function setOnboardingStep(step: number): void {
  triggerHaptic('light');
  if (step === 1 || step === 2 || step === 3) {
    onboardingStep = step;
    renderTodayTab();
  }
}

export function selectOnboardingStartChoice(choice: string): void {
  triggerHaptic('light');
  if (choice === 'alphabet') {
    onboardingState.startingChoice = 'alphabet';
    onboardingState.recommendedModId = 'A1.1';
  } else if (choice === 'place') {
    onboardingState.startingChoice = 'place';
    onboardingState.recommendedModId = computePlacementRecommendation();
  } else {
    onboardingState.startingChoice = 'new';
    onboardingState.recommendedModId = 'A0.1';
  }
  saveOnboardingState();
  renderTodayTab();
}

export function answerOnboardingPlacement(qIdx: number, optIdx: number): void {
  triggerHaptic('light');
  if (qIdx >= 0 && qIdx < placementQuizSelections.length) {
    placementQuizSelections[qIdx] = optIdx;
    onboardingState.startingChoice = 'place';
    onboardingState.recommendedModId = computePlacementRecommendation();
    saveOnboardingState();
    renderTodayTab();
  }
}

export function completeOnboardingSetup(openLessonNow = false): void {
  triggerHaptic('heavy');
  onboardingState.completed = true;
  onboardingState.completedAt = new Date().toISOString();
  forceShowOnboarding = false;
  const targetMod = COURSE_MODULES.some(
    (m) => m.id === onboardingState.recommendedModId
  )
    ? onboardingState.recommendedModId
    : COURSE_MODULES[0].id;
  activeModId = targetMod;
  activeStage = 0;
  onboardingState.lastModId = targetMod;
  onboardingState.lastStage = 0;
  onboardingState.lastSectionId = 'sec-learn';
  saveOnboardingState();
  renderCourseSyllabus();
  renderActiveModule();
  if (openLessonNow) {
    switchTab('course');
  } else {
    renderTodayTab();
  }
}

const LESSON_SECTION_SHORT_NAMES: Record<string, string> = {
  'sec-learn': 'section A',
  'sec-big-idea': 'section B',
  'sec-action': 'section C',
  'sec-pattern': 'section D',
  'sec-steps': 'section E',
  'sec-more-ex': 'section F',
  'sec-exceptions': 'section G',
  'sec-mistakes': 'section H',
  'sec-inline-check': 'section I',
  'sec-dialogue': 'section J',
  'sec-reference': 'section K',
  'sec-remember': 'section L',
};

const PLAIN_LEVEL_NAMES: Record<string, string> = {
  A0: 'First steps',
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
};

function escapeHtmlSafe(raw?: string): string {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface ReviewSummaryCounts {
  srsDue: number;
  en2ukDue: number;
  corrDue: number;
  totalDueNow: number;
  srsNewAllowance: number;
  totalActionable: number;
  estimatedMinutes: number;
  recommendedDeck: 'srs' | 'en2uk' | 'correction';
}

function getReviewSummaryCounts(): ReviewSummaryCounts {
  const now = Date.now();
  const srsDue = db.cards.filter(
    (c) => (c.state === 'learning' || c.state === 'review') && c.due <= now
  ).length;
  const en2ukDue = db.en2ukCards.filter(
    (c) => (c.state === 'learning' || c.state === 'review') && c.due <= now
  ).length;
  const corrDue = db.corrCards.filter(
    (c) => (c.state === 'learning' || c.state === 'review') && c.due <= now
  ).length;
  const totalDueNow = srsDue + en2ukDue + corrDue;

  const remAllowance = getActiveRemainingNewAllowance();
  const mixedSel = buildMixedActionableQueue(
    { srs: db.cards, en2uk: db.en2ukCards, correction: db.corrCards },
    now,
    remAllowance
  );
  const srsNewAllowance = mixedSel.pacedNewCount;

  const totalActionable = mixedSel.items.length;
  const estimatedMinutes =
    totalActionable > 0
      ? Math.max(1, Math.ceil(totalActionable * 0.25))
      : 0;

  let recommendedDeck: 'srs' | 'en2uk' | 'correction' = 'srs';
  if (srsDue > 0) recommendedDeck = 'srs';
  else if (en2ukDue > 0) recommendedDeck = 'en2uk';
  else if (corrDue > 0) recommendedDeck = 'correction';

  return {
    srsDue,
    en2ukDue,
    corrDue,
    totalDueNow,
    srsNewAllowance,
    totalActionable,
    estimatedMinutes,
    recommendedDeck,
  };
}

export function continueCurrentCourseModule(): void {
  triggerHaptic('light');
  isCourseSyllabusOpen = false;
  const sectionToRestore = onboardingState.lastSectionId;
  const shouldScrollSection =
    activeStage === 0 &&
    sectionToRestore &&
    sectionToRestore !== 'sec-learn';
  switchTab('course');
  if (shouldScrollSection) {
    requestAnimationFrame(() => {
      jumpToLessonSection(sectionToRestore);
    });
  }
}

export function openCourseModuleMapFromToday(): void {
  triggerHaptic('light');
  switchTab('course');
  toggleCourseSyllabusDrawer(true);
}

export function openCourseLevelFromToday(levelCode: string): void {
  triggerHaptic('light');
  filterCourseByLevel(levelCode);
  switchTab('course');
  toggleCourseSyllabusDrawer(true);
}

export function startRecommendedReviewFromToday(): void {
  triggerHaptic('light');
  selectReviewMode('mixed');
}

export function openSuggestedStoryFromToday(passageId: string): void {
  triggerHaptic('light');
  selectReaderPassage(passageId);
  switchTab('reader');
}

function renderOnboardingCardHtml(): string {
  const recMod =
    COURSE_MODULES.find((m) => m.id === onboardingState.recommendedModId) ||
    COURSE_MODULES[0];

  if (onboardingStep === 1) {
    const placementHtml =
      onboardingState.startingChoice === 'place'
        ? `
          <div class="onboard-placement-quiz">
            ${ONBOARDING_PLACEMENT_QUESTIONS.map(
              (q, qIdx) => `
                <div class="onboard-placement-q">
                  <div class="hint hint--medium">${escapeHtmlSafe(q.prompt)}</div>
                  <div class="onboard-placement-opts">
                    ${q.options
                      .map(
                        (opt, oIdx) => `
                          <button
                            type="button"
                            class="btn ${placementQuizSelections[qIdx] === oIdx ? '' : 'btn-sec'} btn--sm"
                            onclick="answerOnboardingPlacement(${qIdx}, ${oIdx})"
                          >${escapeHtmlSafe(opt)}</button>
                        `
                      )
                      .join('')}
                  </div>
                </div>
              `
            ).join('')}
            <div class="hint">
              Recommended start: <b>${escapeHtmlSafe(recMod.id)} · ${escapeHtmlSafe(recMod.title)}</b> (Level ${escapeHtmlSafe(recMod.level)} · ${escapeHtmlSafe(PLAIN_LEVEL_NAMES[recMod.level] || recMod.level)})
            </div>
          </div>
        `
        : '';

    return `
      <section class="onboard-card" aria-label="Personalize Your Study Plan">
        <div class="onboard-top">
          <div>
            <div class="onboard-steps-indicator">Step 1 of 3 · Starting point</div>
            <h2 class="card-heading">Where should we start your Ukrainian path?</h2>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" onclick="skipOnboardingSetup()">Skip</button>
        </div>

        <div class="onboard-choices">
          <button
            type="button"
            class="onboard-choice ${onboardingState.startingChoice === 'new' ? 'selected' : ''}"
            onclick="selectOnboardingStartChoice('new')"
          >
            <span class="onboard-choice-title">I’m new to Ukrainian</span>
            <span class="onboard-choice-desc">Begin at A0.1 with the Cyrillic alphabet, clear vowels, and first phrases.</span>
          </button>

          <button
            type="button"
            class="onboard-choice ${onboardingState.startingChoice === 'alphabet' ? 'selected' : ''}"
            onclick="selectOnboardingStartChoice('alphabet')"
          >
            <span class="onboard-choice-title">I know the alphabet</span>
            <span class="onboard-choice-desc">Start at A1.1 with everyday sentences, noun gender, and core verbs.</span>
          </button>

          <button
            type="button"
            class="onboard-choice ${onboardingState.startingChoice === 'place' ? 'selected' : ''}"
            onclick="selectOnboardingStartChoice('place')"
          >
            <span class="onboard-choice-title">Place me</span>
            <span class="onboard-choice-desc">Answer 3 quick questions to get a recommended starting module.</span>
          </button>
        </div>

        ${placementHtml}

        <div class="cluster--between">
          <span class="hint">Nothing is locked — you can jump to any of the 29 modules anytime.</span>
          <button type="button" class="btn" onclick="setOnboardingStep(2)">Next: Daily goal →</button>
        </div>
      </section>
    `;
  }

  if (onboardingStep === 2) {
    const goal = dailyGoalTracker.dailyGoalMinutes;
    return `
      <section class="onboard-card" aria-label="Daily Study Goal">
        <div class="onboard-top">
          <div>
            <div class="onboard-steps-indicator">Step 2 of 3 · Daily pace</div>
            <h2 class="card-heading">How much time feels sustainable most days?</h2>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" onclick="skipOnboardingSetup()">Skip</button>
        </div>

        <div class="onboard-choices">
          <button
            type="button"
            class="onboard-choice ${goal === 10 ? 'selected' : ''}"
            onclick="setDailyGoalMinutes(10)"
          >
            <span class="onboard-choice-title">10 min / day · Gentle</span>
            <span class="onboard-choice-desc">Up to 10 new review words a day plus one short lesson section.</span>
          </button>

          <button
            type="button"
            class="onboard-choice ${goal === 20 ? 'selected' : ''}"
            onclick="setDailyGoalMinutes(20)"
          >
            <span class="onboard-choice-title">20 min / day · Steady (Recommended)</span>
            <span class="onboard-choice-desc">Up to 20 new review words a day plus steady module progress.</span>
          </button>

          <button
            type="button"
            class="onboard-choice ${goal === 30 ? 'selected' : ''}"
            onclick="setDailyGoalMinutes(30)"
          >
            <span class="onboard-choice-title">30 min / day · Focused</span>
            <span class="onboard-choice-desc">Up to 30 new review words a day plus reading and speaking practice.</span>
          </button>
        </div>

        <div class="cluster--between">
          <button type="button" class="btn btn-sec" onclick="setOnboardingStep(1)">← Back</button>
          <button type="button" class="btn" onclick="setOnboardingStep(3)">Next: Audio check →</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="onboard-card" aria-label="Audio Check">
      <div class="onboard-top">
        <div>
          <div class="onboard-steps-indicator">Step 3 of 3 · Audio check</div>
          <h2 class="card-heading">Test your Ukrainian pronunciation playback</h2>
        </div>
        <button type="button" class="btn btn--ghost btn--sm" onclick="skipOnboardingSetup()">Skip</button>
      </div>

      <div class="onboard-audio-sample">
        <div>
          <div class="onboard-audio-uk">Приві́т! Ласка́во про́симо.</div>
          <div class="hint">Sounds like <b>pry-VIT! las-KA-vo PRO-sy-mo</b> — Hello! Welcome.</div>
        </div>
        <div class="cluster">
          <button type="button" class="btn btn-sec" onclick="speakUkrainian('Приві́т! Ласка́во про́симо.')">Listen</button>
          <button type="button" class="btn btn--ghost btn--sm" onclick="openVoiceModal()">Voice options</button>
        </div>
      </div>

      <div class="cluster--between">
        <button type="button" class="btn btn-sec" onclick="setOnboardingStep(2)">← Back</button>
        <div class="cluster">
          <button type="button" class="btn btn-sec" onclick="completeOnboardingSetup(false)">Save for Today</button>
          <button type="button" class="btn" onclick="completeOnboardingSetup(true)">Start ${escapeHtmlSafe(recMod.id)} →</button>
        </div>
      </div>
    </section>
  `;
}

export function renderTodayTab(): void {
  const root = document.getElementById('today-workspace-root');
  if (!root) return;

  const activeTrack = getActiveCourseTrack();
  if (activeTrack.trackId !== PUBLISHED_UKRAINIAN_TRACK_ID) {
    root.innerHTML = `
      <div class="today-shell">
        <div class="today-hero">
          <div class="today-kicker">
            <span class="today-kicker-accent">Selected track</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtmlSafe(activeTrack.trackId)}</span>
          </div>
          <h1 class="today-hero-title">${escapeHtmlSafe(activeTrack.courseTitle)}</h1>
          <p class="today-hero-desc">${escapeHtmlSafe(activeTrack.comingSoonMessage)}</p>
          <div class="cluster">
            <button type="button" class="btn" onclick="switchTab('learn')">Open track workspace →</button>
            <button type="button" class="btn btn-sec" onclick="selectCourseTrackById('${PUBLISHED_UKRAINIAN_TRACK_ID}')">Switch to Ukrainian (29 modules)</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const mod =
    COURSE_MODULES.find((m) => m.id === activeModId) || COURSE_MODULES[0];
  const stageNames = [
    'Lesson',
    'Check',
    'Practice',
    'Words',
    'Mastery exam',
  ];
  const currentStageName = stageNames[activeStage] || 'Lesson';
  const sectionSuffix =
    activeStage === 0
      ? `, ${LESSON_SECTION_SHORT_NAMES[onboardingState.lastSectionId] || 'section A'}`
      : '';
  const stepDescriptor = `${currentStageName}${sectionSuffix}`;

  const hour = new Date().getHours();
  const greetingUk =
    hour < 12
      ? 'Доброго ранку'
      : hour < 18
        ? 'Добрий день'
        : 'Добрий вечір';

  const today = getLocalIsoDate();
  const minutesToday =
    dailyGoalTracker.todayDate === today ? dailyGoalTracker.minutesToday : 0;
  const goalMinutes = dailyGoalTracker.dailyGoalMinutes;
  const ringCircumference = 169.65;
  const ratio = Math.min(1, Math.max(0, minutesToday / goalMinutes));
  const dashOffset = (ringCircumference * (1 - ratio)).toFixed(2);
  const goalDone = minutesToday >= goalMinutes;

  const showOnboarding =
    forceShowOnboarding ||
    (!onboardingState.completed &&
      db.xp === 0 &&
      db.passedMods.length === 0);

  const coursePct = Math.max(
    4,
    Math.round((db.passedMods.length / COURSE_MODULES.length) * 100)
  );

  const rev = getReviewSummaryCounts();
  const reviewHeading =
    rev.totalDueNow > 0
      ? `Reviews due: ${rev.totalDueNow}`
      : rev.srsNewAllowance > 0
        ? `Reviews due: ${rev.srsNewAllowance} new`
        : 'All caught up for today';
  const reviewSubtext =
    rev.totalDueNow > 0
      ? `Estimated ~${rev.estimatedMinutes} min · UK→EN ${rev.srsDue} · EN→UK ${rev.en2ukDue} · Sentences ${rev.corrDue}`
      : rev.srsNewAllowance > 0
        ? `Estimated ~${rev.estimatedMinutes} min · Paced by your ${goalMinutes}-min daily goal`
        : 'Every scheduled card is reviewed. Explore a short story or practice speaking.';

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const wotdPool = FREQ_6000_DB.slice(0, Math.min(250, FREQ_6000_DB.length));
  const wotd = wotdPool[dayOfYear % wotdPool.length] || FREQ_6000_DB[0];
  const wotdPhon = generateUkrainianPhonetics(wotd.ru);

  const levelPassages = READER_PASSAGES.filter((p) => p.level === mod.level);
  const suggestedPassage: ReaderPassage =
    levelPassages[0] || READER_PASSAGES[0];

  const levelDefs = [
    { code: 'A0', filter: 'A0', name: 'First steps' },
    { code: 'A1', filter: 'A1', name: 'Beginner' },
    { code: 'A2', filter: 'A2', name: 'Elementary' },
    { code: 'B1', filter: 'B1', name: 'Intermediate' },
    { code: 'B2', filter: 'B2-C1', name: 'Upper-Int.' },
    { code: 'C1', filter: 'B2-C1', name: 'Advanced' },
  ];

  const levelStripHtml = levelDefs
    .map((lvl) => {
      const modsInLvl = COURSE_MODULES.filter((m) => m.level === lvl.code);
      const doneInLvl = modsInLvl.filter((m) =>
        db.passedMods.includes(m.id)
      ).length;
      const isCurrent = mod.level === lvl.code;
      const isComplete =
        modsInLvl.length > 0 && doneInLvl === modsInLvl.length;
      const stateClass = isComplete
        ? 'is-complete'
        : isCurrent
          ? 'is-current'
          : '';
      return `
        <button
          type="button"
          class="today-level-step ${stateClass}"
          onclick="openCourseLevelFromToday('${lvl.filter}')"
        >
          <span class="today-level-code">
            <span>${lvl.code}</span>
            <span>${doneInLvl}/${modsInLvl.length}</span>
          </span>
          <span class="today-level-name">${lvl.name}</span>
        </button>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="today-shell">
      ${showOnboarding ? renderOnboardingCardHtml() : ''}

      <header class="today-header">
        <div>
          <div class="today-greeting-kicker">${greetingUk}</div>
          <h1 class="today-title">Today’s study plan</h1>
          <div class="today-meta-line">
            <span>Level ${escapeHtmlSafe(mod.level)} · ${escapeHtmlSafe(PLAIN_LEVEL_NAMES[mod.level] || mod.level)}</span>
            <span aria-hidden="true">·</span>
            <span>${db.passedMods.length} of ${COURSE_MODULES.length} modules mastered</span>
            <span aria-hidden="true">·</span>
            <button type="button" class="today-link-btn" onclick="reopenOnboardingSetup()">Personalize plan</button>
          </div>
        </div>

        <div class="today-goal-cluster">
          <div class="today-ring-wrap" role="img" aria-label="Daily study goal: ${Math.round(minutesToday)} of ${goalMinutes} minutes">
            <svg class="today-ring-svg" viewBox="0 0 68 68" aria-hidden="true">
              <circle class="today-ring-track" cx="34" cy="34" r="27"></circle>
              <circle
                class="today-ring-progress ${goalDone ? 'is-complete' : ''}"
                cx="34"
                cy="34"
                r="27"
                stroke-dasharray="${ringCircumference}"
                stroke-dashoffset="${dashOffset}"
              ></circle>
            </svg>
            <div class="today-ring-label">
              <span>${Math.round(minutesToday)}/${goalMinutes}</span>
              <span class="today-ring-sub">min</span>
            </div>
          </div>

          <div class="today-goal-stats">
            <span class="today-goal-headline">${
              goalDone
                ? 'Daily goal complete'
                : `${Math.max(1, Math.ceil(goalMinutes - minutesToday))} min to daily goal`
            }</span>
            <span>
              <span class="today-streak-text">${dailyGoalTracker.streakDays} day streak</span>
              <span aria-hidden="true"> · </span>
              <b>${db.xp}</b> XP
            </span>
          </div>
        </div>
      </header>

      <article class="today-hero">
        <div>
          <div class="today-kicker">
            <span class="today-kicker-accent">Recommended next step</span>
            <span aria-hidden="true">·</span>
            <span>Level ${escapeHtmlSafe(mod.level)} · ${escapeHtmlSafe(PLAIN_LEVEL_NAMES[mod.level] || mod.level)}</span>
          </div>
          <h2 class="today-hero-title">Continue: ${escapeHtmlSafe(mod.id)} · ${escapeHtmlSafe(stepDescriptor)}</h2>
        </div>

        <p class="today-hero-desc">
          <strong>${escapeHtmlSafe(mod.title)}</strong> — ${escapeHtmlSafe(mod.summary)}
        </p>

        <div class="today-hero-footer">
          <div class="today-hero-progress">
            <div class="today-hero-progress-meta">
              <span>Course completion</span>
              <span>${db.passedMods.length}/${COURSE_MODULES.length} modules</span>
            </div>
            <svg width="100%" height="6" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
              <rect width="100" height="6" rx="3" fill="var(--surface-3)"></rect>
              <rect width="${coursePct}" height="6" rx="3" fill="var(--lang)"></rect>
            </svg>
          </div>

          <div class="cluster">
            <button type="button" class="btn btn--lg" onclick="continueCurrentCourseModule()">
              Continue ${escapeHtmlSafe(mod.id)} →
            </button>
            <button type="button" class="btn btn-sec" onclick="openCourseModuleMapFromToday()">
              All 29 modules
            </button>
          </div>
        </div>
      </article>

      <div class="today-secondary-grid">
        <article class="today-panel">
          <div>
            <div class="today-kicker">
              <span class="today-kicker-accent">Spaced repetition</span>
              <span aria-hidden="true">·</span>
              <span>${db.cards.length} words in reviews</span>
            </div>
            <div class="today-review-number">${escapeHtmlSafe(reviewHeading)}</div>
            <p class="hint hint--body">${escapeHtmlSafe(reviewSubtext)}</p>
          </div>

          <div class="cluster">
            <button type="button" class="btn" onclick="startRecommendedReviewFromToday()">
              ${rev.estimatedMinutes > 0 ? `Start review (~${rev.estimatedMinutes} min)` : 'Open reviews'}
            </button>
            <button type="button" class="btn btn-sec" onclick="switchTab('speak')">
              Practice speaking
            </button>
          </div>
        </article>

        <article class="today-panel">
          <div>
            <div class="today-kicker">
              <span class="today-kicker-accent">Word of the day</span>
              <span aria-hidden="true">·</span>
              <span>#${wotd.rank} · Level ${escapeHtmlSafe(wotd.level)}</span>
            </div>
            <div
              class="today-wotd-word"
              onclick="speakUkrainian('${escapeSingleQuotes(wotd.ru)}')"
              title="Tap to hear Ukrainian pronunciation"
            >${escapeHtmlSafe(wotd.ru)}</div>
            <div class="today-wotd-gloss">${escapeHtmlSafe(wotd.en)}</div>
            <div class="hint">Sounds like <b>${escapeHtmlSafe(wotdPhon.plainGuide)}</b></div>
            <div class="cluster section-divider-top">
              <button type="button" class="btn btn-sec btn--sm" onclick="speakUkrainian('${escapeSingleQuotes(wotd.ru)}')">Listen</button>
              <button type="button" class="btn btn-sec btn--sm" onclick="inspectWordDeep(${wotd.rank}, true, true)">Word forms</button>
            </div>
          </div>

          <div class="today-story-row">
            <div>
              <div class="hint">Suggested story · Level ${escapeHtmlSafe(suggestedPassage.level)}</div>
              <div class="today-story-title">${escapeHtmlSafe(suggestedPassage.titleEn || suggestedPassage.title)}</div>
            </div>
            <button
              type="button"
              class="btn btn-sec btn--sm"
              onclick="openSuggestedStoryFromToday('${escapeSingleQuotes(suggestedPassage.id)}')"
            >Read →</button>
          </div>
        </article>
      </div>

      <section class="today-path-section" aria-label="Course Level Path A0 to C1">
        <div class="today-path-header">
          <h2 class="card-heading">Course path · A0 to C1</h2>
          <span class="hint">Choose any level to browse modules — recommended next is ${escapeHtmlSafe(mod.id)}</span>
        </div>
        <div class="today-level-strip">
          ${levelStripHtml}
        </div>
      </section>
    </div>
  `;
}

// ============================================================================
// 5-DESTINATION NAVIGATION, SUB-NAVIGATION & URL HASH ROUTER
// ============================================================================
const ALL_TAB_SECTION_IDS = [
  'today',
  'course',
  'srs',
  'en2uk',
  'correction',
  'reader',
  'identify',
  'vocab',
  'phonetics',
  'speak',
] as const;

type CanonicalTabId = (typeof ALL_TAB_SECTION_IDS)[number];
type TopDestinationId = 'today' | 'learn' | 'review' | 'explore' | 'speak';

const WORKSPACE_BREADCRUMBS: Record<string, string> = {
  today: 'Today · Study Home',
  course: 'Learn · Structured Course (A0–C1)',
  reader: 'Explore · Graded Stories (A0–C1)',
  identify: 'Explore · Visual Vocabulary (67 Scenes)',
  vocab: 'Explore · Everyday Topics (27 Categories)',
  srs: 'Review · UK → EN Recognition',
  en2uk: 'Review · EN → UK Active Recall',
  correction: 'Review · Sentence & Case Repair',
  phonetics: 'Speak · Sounds & Script',
  speak: 'Speak · AI Ukrainian Conversation',
};

let activeCanonicalTab: CanonicalTabId = 'today';
let lastExploreSubTab: 'reader' | 'identify' | 'vocab' = 'reader';
let lastSpeakSubTab: 'speak' | 'phonetics' = 'speak';
let lexiconExploreMode = false;
let currentRenderedHash = '';

function getDestinationForTab(tab: CanonicalTabId): TopDestinationId {
  if (tab === 'today') return 'today';
  if (tab === 'course') return 'learn';
  if (tab === 'srs' && lexiconExploreMode) return 'explore';
  if (tab === 'srs' || tab === 'en2uk' || tab === 'correction') return 'review';
  if (tab === 'reader' || tab === 'identify' || tab === 'vocab') return 'explore';
  return 'speak';
}

function getCanonicalSectionForReviewMode(mode: ReviewModeId): CanonicalTabId {
  if (mode === 'en2uk') return 'en2uk';
  if (mode === 'correction') return 'correction';
  return 'srs';
}

function resolveCanonicalTab(rawTab: string): CanonicalTabId {
  const clean = String(rawTab || '').trim().toLowerCase();
  const currentDest = getDestinationForTab(activeCanonicalTab);

  if (clean === 'today' || clean === 'home') {
    lexiconExploreMode = false;
    return 'today';
  }
  if (clean === 'learn' || clean === 'course') {
    lexiconExploreMode = false;
    return 'course';
  }
  if (clean === 'review' || clean === 'mixed') {
    lexiconExploreMode = false;
    if (clean === 'mixed') {
      activeReviewMode = 'mixed';
      reviewPrefs.preferredMode = 'mixed';
      saveReviewPrefs();
    } else if (currentDest === 'review') {
      activeReviewMode = 'mixed';
    } else {
      activeReviewMode = reviewPrefs.preferredMode || 'mixed';
    }
    return getCanonicalSectionForReviewMode(activeReviewMode);
  }
  if (clean === 'explore') {
    if (currentDest === 'explore') {
      lexiconExploreMode = false;
      return 'reader';
    }
    return lastExploreSubTab;
  }
  if (clean === 'speak') {
    lexiconExploreMode = false;
    return currentDest === 'speak' && activeCanonicalTab !== 'speak'
      ? 'speak'
      : lastSpeakSubTab;
  }
  if (clean === 'convo') {
    lexiconExploreMode = false;
    lastSpeakSubTab = 'speak';
    return 'speak';
  }
  if (clean === 'sounds' || clean === 'phonetics') {
    lexiconExploreMode = false;
    lastSpeakSubTab = 'phonetics';
    return 'phonetics';
  }
  if (clean === 'srs' || clean === 'en2uk' || clean === 'correction') {
    lexiconExploreMode = false;
    activeReviewMode = clean;
    reviewPrefs.preferredMode = clean;
    saveReviewPrefs();
    return clean;
  }
  if (clean === 'reader' || clean === 'identify' || clean === 'vocab') {
    lexiconExploreMode = false;
    lastExploreSubTab = clean;
    return clean;
  }
  return 'today';
}

function computeHashForTab(tab: CanonicalTabId): string {
  if (tab === 'today') return '#/today';
  if (tab === 'course') {
    return isCourseSyllabusOpen ? '#/learn/map' : `#/learn/${activeModId}`;
  }
  if (tab === 'srs') {
    if (lexiconExploreMode) return '#/explore/lexicon';
    if (activeReviewMode === 'mixed') return '#/review';
    if (activeReviewMode === 'topics') return '#/review/topics';
    return '#/review/srs';
  }
  if (tab === 'en2uk') return '#/review/en2uk';
  if (tab === 'correction') return '#/review/correction';
  if (tab === 'reader') return '#/explore/reader';
  if (tab === 'identify') return '#/explore/identify';
  if (tab === 'vocab') return '#/explore/vocab';
  if (tab === 'phonetics') return '#/speak/sounds';
  return '#/speak';
}

function syncHashForCurrentView(
  tab: CanonicalTabId,
  replaceOnly = false
): void {
  if (typeof window === 'undefined') return;
  if (
    window.location.hash.startsWith('#cms') ||
    window.location.search.includes('cms=1')
  ) {
    return;
  }
  const targetHash = computeHashForTab(tab);
  currentRenderedHash = targetHash;
  if (window.location.hash === targetHash) return;

  if (replaceOnly && window.history?.replaceState) {
    window.history.replaceState(null, '', targetHash);
  } else {
    window.location.hash = targetHash;
  }
}

function syncSubnavAndBadgesUI(): void {
  if (typeof document === 'undefined') return;
  const now = Date.now();
  const remAllowance = getActiveRemainingNewAllowance();
  const counts = getReviewSummaryCounts();

  const srsSel = selectDeckActionableQueue(db.cards, now, remAllowance);
  const en2ukSel = selectDeckActionableQueue(db.en2ukCards, now, remAllowance);
  const corrSel = selectDeckActionableQueue(db.corrCards, now, remAllowance);

  const badgeEl = document.getElementById('nav-review-badge');
  if (badgeEl) {
    const badgeTotal = counts.totalActionable;
    badgeEl.textContent = String(badgeTotal);
    badgeEl.classList.toggle('hidden', badgeTotal <= 0);
  }

  const mixedSubEl = document.getElementById('subnav-mixed-due');
  const srsSubEl = document.getElementById('subnav-srs-due');
  const en2ukSubEl = document.getElementById('subnav-en2uk-due');
  const corrSubEl = document.getElementById('subnav-corr-due');
  if (mixedSubEl) mixedSubEl.textContent = String(counts.totalActionable);
  if (srsSubEl) srsSubEl.textContent = String(srsSel.queue.length);
  if (en2ukSubEl) en2ukSubEl.textContent = String(en2ukSel.queue.length);
  if (corrSubEl) corrSubEl.textContent = String(corrSel.queue.length);

  const dest = getDestinationForTab(activeCanonicalTab);
  const reviewSubnav = document.getElementById('review-subnav');
  const exploreSubnav = document.getElementById('explore-subnav');
  const speakSubnav = document.getElementById('speak-subnav');

  reviewSubnav?.classList.toggle('hidden', dest !== 'review');
  exploreSubnav?.classList.toggle('hidden', dest !== 'explore');
  speakSubnav?.classList.toggle('hidden', dest !== 'speak');

  document.querySelectorAll('.subnav-btn').forEach((btn) => {
    const reviewModeAttr = btn.getAttribute('data-review-mode');
    const subtab = btn.getAttribute('data-subtab');
    const isLexBtn =
      btn.getAttribute('onclick')?.includes('openLexiconFromExplore') || false;

    let isActive = false;
    if (dest === 'review' && reviewModeAttr) {
      isActive = reviewModeAttr === activeReviewMode;
    } else if (lexiconExploreMode) {
      isActive = isLexBtn;
    } else if (!reviewModeAttr) {
      isActive = Boolean(subtab && subtab === activeCanonicalTab);
    }

    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.removeAttribute('aria-selected');
    }
  });

  syncReviewControlsUI();
}

export function selectReviewMode(
  mode: ReviewModeId,
  options?: { skipHashUpdate?: boolean }
): void {
  triggerHaptic('light');
  lexiconExploreMode = false;
  if (activeReviewSession.completed) {
    activeReviewSession = createFreshSessionTracker(0);
  }
  activeReviewMode = mode;
  reviewPrefs.preferredMode = mode;
  saveReviewPrefs();

  ankiFlipped = false;
  en2ukFlipped = false;
  corrFlipped = false;
  mixedFlipped = false;
  topicDrillRevealed = false;
  topicDrillChosenOptionIdx = null;
  topicDrillBuiltTiles = [];
  lastAutoSpokenCardKey = '';

  ensureDailyGoalNewCardsSeeded();
  const targetCanonical = getCanonicalSectionForReviewMode(mode);
  activeCanonicalTab = targetCanonical;

  ALL_TAB_SECTION_IDS.forEach((t) => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('tab-' + targetCanonical)?.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach((b) => {
    const isRev = b.getAttribute('data-nav-dest') === 'review';
    b.classList.toggle('active', isRev);
    if (isRev) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });

  renderActiveReviewWorkspace();
  syncSubnavAndBadgesUI();
  syncMultilingualTrackUI();
  syncReviewSrsVsLexiconDOM();

  if (!options?.skipHashUpdate) {
    syncHashForCurrentView(targetCanonical);
  }

  const mainEl = document.getElementById('main-scroll-container');
  if (mainEl) mainEl.scrollTop = 0;
}

export function switchTab(
  tab: string,
  btn?: HTMLElement,
  options?: { skipHashUpdate?: boolean; preserveScroll?: boolean }
): void {
  triggerHaptic('light');
  const canonical = resolveCanonicalTab(tab);
  activeCanonicalTab = canonical;
  const dest = getDestinationForTab(canonical);

  if (dest === 'review') {
    if (activeReviewSession.completed) {
      activeReviewSession = createFreshSessionTracker(0);
    }
    ensureDailyGoalNewCardsSeeded();
  } else {
    closeReviewAdvancedMenu();
  }

  ALL_TAB_SECTION_IDS.forEach((t) => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('tab-' + canonical)?.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });

  const matchingBtns = document.querySelectorAll(
    `.nav-btn[data-nav-dest="${dest}"]`
  );
  if (matchingBtns.length) {
    matchingBtns.forEach((el) => {
      el.classList.add('active');
      el.setAttribute('aria-current', 'page');
    });
  } else if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');
  }

  const bcEl = document.getElementById('active-workspace-breadcrumb');
  if (bcEl) {
    bcEl.textContent =
      WORKSPACE_BREADCRUMBS[canonical] || 'Ukrainian Workspace';
  }

  closeReaderWordSheet();

  if (canonical === 'today') {
    renderTodayTab();
  } else if (dest === 'review') {
    renderActiveReviewWorkspace();
  } else if (canonical === 'vocab') {
    renderEverydayVocabTab();
  } else if (canonical === 'identify') {
    renderIdentifyTab();
  } else if (canonical === 'speak') {
    renderAIConversationTab();
  }

  syncSubnavAndBadgesUI();
  syncMultilingualTrackUI();
  syncReviewSrsVsLexiconDOM();
  if (canonical === 'course') {
    syncCourseDrawerAndWorkspaceDOM();
    if (activeStage === 0 && !isCourseSyllabusOpen) {
      scheduleLessonScrollspySync();
    }
  }

  if (!options?.skipHashUpdate) {
    syncHashForCurrentView(canonical);
  }

  if (!options?.preserveScroll) {
    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl) mainEl.scrollTop = 0;
  }
}

export function openLexiconFromExplore(options?: {
  skipHashUpdate?: boolean;
}): void {
  triggerHaptic('light');
  lexiconExploreMode = true;
  activeCanonicalTab = 'srs';

  ALL_TAB_SECTION_IDS.forEach((t) => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('tab-srs')?.classList.remove('hidden');
  syncReviewSrsVsLexiconDOM();
  renderSrsCatalog6000();

  document.querySelectorAll('.nav-btn').forEach((b) => {
    const isExplore = b.getAttribute('data-nav-dest') === 'explore';
    b.classList.toggle('active', isExplore);
    if (isExplore) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });

  syncSubnavAndBadgesUI();
  syncMultilingualTrackUI();
  syncReviewSrsVsLexiconDOM();

  if (!options?.skipHashUpdate) {
    syncHashForCurrentView('srs');
  }

  const mainEl = document.getElementById('main-scroll-container');
  if (mainEl) mainEl.scrollTop = 0;
}

function syncRouteFromHash(isInitialBoot = false): void {
  if (typeof window === 'undefined') return;
  const rawHash = window.location.hash || '';
  if (
    rawHash.startsWith('#cms') ||
    window.location.search.includes('cms=1')
  ) {
    return;
  }

  if (!isInitialBoot && rawHash && rawHash === currentRenderedHash) {
    return;
  }

  const cleaned = rawHash.replace(/^#\/?/, '').trim();
  if (!cleaned || cleaned.toLowerCase() === 'today') {
    switchTab('today', undefined, { skipHashUpdate: true });
    syncHashForCurrentView('today', true);
    return;
  }

  const parts = cleaned.split('/').filter(Boolean);
  const head = (parts[0] || '').toLowerCase();
  const sub = parts[1] || '';
  const subLower = sub.toLowerCase();

  if (head === 'learn' || head === 'course') {
    if (subLower === 'map') {
      switchTab('course', undefined, { skipHashUpdate: true });
      toggleCourseSyllabusDrawer(true, { skipHashUpdate: true });
      currentRenderedHash = window.location.hash;
      return;
    }
    isCourseSyllabusOpen = false;
    if (sub) {
      const matchedMod = COURSE_MODULES.find(
        (m) => m.id.toLowerCase() === subLower
      );
      if (matchedMod && matchedMod.id !== activeModId) {
        selectCourseModule(matchedMod.id, { skipHashUpdate: true });
      }
    }
    switchTab('course', undefined, { skipHashUpdate: true });
    currentRenderedHash = window.location.hash;
    return;
  }

  if (head === 'review') {
    if (subLower === 'srs' || subLower === 'uk2en') {
      selectReviewMode('srs', { skipHashUpdate: true });
    } else if (subLower === 'en2uk' || subLower === 'recall') {
      selectReviewMode('en2uk', { skipHashUpdate: true });
    } else if (subLower === 'correction' || subLower === 'sentences') {
      selectReviewMode('correction', { skipHashUpdate: true });
    } else if (subLower === 'topics') {
      selectReviewMode('topics', { skipHashUpdate: true });
    } else {
      selectReviewMode('mixed', { skipHashUpdate: true });
    }
    currentRenderedHash = window.location.hash;
    return;
  }

  if (head === 'explore') {
    if (subLower === 'identify' || subLower === 'pictures') {
      switchTab('identify', undefined, { skipHashUpdate: true });
    } else if (subLower === 'vocab' || subLower === 'topics') {
      switchTab('vocab', undefined, { skipHashUpdate: true });
    } else if (subLower === 'lexicon') {
      openLexiconFromExplore({ skipHashUpdate: true });
    } else {
      switchTab('reader', undefined, { skipHashUpdate: true });
    }
    currentRenderedHash = window.location.hash;
    return;
  }

  if (head === 'speak') {
    if (subLower === 'sounds' || subLower === 'phonetics') {
      switchTab('phonetics', undefined, { skipHashUpdate: true });
    } else {
      switchTab('speak', undefined, { skipHashUpdate: true });
    }
    currentRenderedHash = window.location.hash;
    return;
  }

  // Direct legacy hashes (#srs, #reader, #identify, etc.)
  switchTab(head, undefined, { skipHashUpdate: true });
  currentRenderedHash = window.location.hash;
}

function addWordByUkToFSRS(uk: string): boolean {
  const cleanTarget = normalizeUkLookupKey(uk);
  const headCandidate = cleanTarget.split('/')[0]?.trim() || cleanTarget;
  const matched =
    FREQ_6000_DB.find((w) => normalizeUkLookupKey(w.ru) === cleanTarget) ||
    FREQ_6000_DB.find((w) => normalizeUkLookupKey(w.ru) === headCandidate);
  const rank = matched ? matched.rank : 1;
  if (!db.cards.some((c) => c.rank === rank)) {
    addSingleWordFrom6000(rank);
    return true;
  }
  return false;
}

export function updateSidebarStats(): void {
  const xpEl = document.getElementById('xp-display');
  const deckEl = document.getElementById('deck-count');
  const drillsEl = document.getElementById('drills-display');
  const modsEl = document.getElementById('mods-display');
  const xpTop = document.getElementById('xp-top-display');
  const deckTop = document.getElementById('deck-top-count');
  const totalLexEl = document.getElementById('total-lexicon-count');

  if (xpEl) xpEl.innerText = String(db.xp);
  if (deckEl) deckEl.innerText = String(db.cards.length);
  if (drillsEl) drillsEl.innerText = String(db.drills);
  if (modsEl) modsEl.innerText = String(db.passedMods.length);
  if (xpTop) xpTop.innerText = String(db.xp);
  if (deckTop) deckTop.innerText = String(db.cards.length);
  if (totalLexEl) totalLexEl.innerText = String(MAX_RANK);

  syncSubnavAndBadgesUI();
  refreshTodayIfVisible();
}

// Bind all interactive handlers to global window so HTML onclick attributes work seamlessly
declare global {
  interface Window {
    triggerHaptic: typeof triggerHaptic;
    applyColorTheme: typeof applyColorTheme;
    cycleColorTheme: typeof cycleColorTheme;
    openSettingsModal: typeof openSettingsModal;
    closeSettingsModal: typeof closeSettingsModal;
    openInspectorSheet: typeof openInspectorSheet;
    closeInspectorSheet: typeof closeInspectorSheet;
    toggleGrammarInspector: typeof toggleGrammarInspector;
    toggleCourseSyllabusDrawer: typeof toggleCourseSyllabusDrawer;
    toggleReaderStoryDrawer: typeof toggleReaderStoryDrawer;
    openVoiceModal: typeof openVoiceModal;
    closeVoiceModal: typeof closeVoiceModal;
    saveVoiceModal: typeof saveVoiceModal;
    playBilingualOpenAI: typeof playBilingualOpenAI;
    speakUkrainian: typeof speakUkrainian;
    speakEnglish: typeof speakEnglish;
    speakExplanation: typeof speakExplanation;
    speakCorrectionExplanation: typeof speakCorrectionExplanation;
    renderAnkiStage: typeof renderAnkiStage;
    flipAnkiCard: typeof flipAnkiCard;
    gradeAnkiCard: typeof gradeAnkiCard;
    renderEn2UkStage: typeof renderEn2UkStage;
    flipEn2UkCard: typeof flipEn2UkCard;
    gradeEn2UkCard: typeof gradeEn2UkCard;
    renderCorrectionStage: typeof renderCorrectionStage;
    flipCorrectionCard: typeof flipCorrectionCard;
    gradeCorrectionCard: typeof gradeCorrectionCard;
    addSingleWordFrom6000: typeof addSingleWordFrom6000;
    batchAddNextFrequencyWords: typeof batchAddNextFrequencyWords;
    inspectWordDeep: typeof inspectWordDeep;
    renderSrsCatalog6000: typeof renderSrsCatalog6000;
    changeSrsCatPage: typeof changeSrsCatPage;
    renderPhonetics6000: typeof renderPhonetics6000;
    changePhonPage: typeof changePhonPage;
    clearCanvas: typeof clearCanvas;
    filterCourseByLevel: typeof filterCourseByLevel;
    selectCourseModule: typeof selectCourseModule;
    selectCourseStage: typeof selectCourseStage;
    renderCourseSyllabus: typeof renderCourseSyllabus;
    inspectCourseWord: typeof inspectCourseWord;
    jumpToLessonSection: typeof jumpToLessonSection;
    addModuleVocabToFSRS: typeof addModuleVocabToFSRS;
    speakCourseOverview: typeof speakCourseOverview;
    speakCourseRule: typeof speakCourseRule;
    speakAllCourseRules: typeof speakAllCourseRules;
    speakCourseDialogue: typeof speakCourseDialogue;
    renderActiveModule: typeof renderActiveModule;
    handleCourseOptionTap: typeof handleCourseOptionTap;
    handlePracticeOptionTap: typeof handlePracticeOptionTap;
    handleExamAnswer: typeof handleExamAnswer;
    setAssessmentFilter: typeof setAssessmentFilter;
    toggleAssessmentSingleFocus: typeof toggleAssessmentSingleFocus;
    jumpToAssessmentQuestion: typeof jumpToAssessmentQuestion;
    stepAssessmentQuestion: typeof stepAssessmentQuestion;
    requestResetAssessmentStage: typeof requestResetAssessmentStage;
    cancelResetAssessmentStage: typeof cancelResetAssessmentStage;
    confirmResetAssessmentStage: typeof confirmResetAssessmentStage;
    handleInlineCheckOption: typeof handleInlineCheckOption;
    submitInlineCheckText: typeof submitInlineCheckText;
    submitStageAssessmentText: typeof submitStageAssessmentText;
    cancelSubmitModuleExam: typeof cancelSubmitModuleExam;
    submitModuleExam: typeof submitModuleExam;
    selectVocabCategory: typeof selectVocabCategory;
    selectVocabMode: typeof selectVocabMode;
    clearVocabTopicSearch: typeof clearVocabTopicSearch;
    practiceActiveTopicInReview: typeof practiceActiveTopicInReview;
    speakCategoryGuide: typeof speakCategoryGuide;
    addCategoryToFSRS: typeof addCategoryToFSRS;
    checkVocabActiveRecall: typeof checkVocabActiveRecall;
    addSentenceTile: typeof addSentenceTile;
    resetSentenceBuilder: typeof resetSentenceBuilder;
    checkSentenceBuilder: typeof checkSentenceBuilder;
    renderEverydayVocabTab: typeof renderEverydayVocabTab;
    renderEverydayVocabWorkspace: typeof renderEverydayVocabWorkspace;
    clearLexiconSearch: typeof clearLexiconSearch;
    clearPhoneticsSearch: typeof clearPhoneticsSearch;
    filterReaderByLevel: typeof filterReaderByLevel;
    selectReaderPassage: typeof selectReaderPassage;
    toggleReaderTranslations: typeof toggleReaderTranslations;
    openReaderWordSheet: typeof openReaderWordSheet;
    closeReaderWordSheet: typeof closeReaderWordSheet;
    addReaderSheetWordToReviews: typeof addReaderSheetWordToReviews;
    openFullInspectorFromReaderSheet: typeof openFullInspectorFromReaderSheet;
    inspectReaderWord: typeof inspectReaderWord;
    initReader: typeof initReader;
    speakStory: typeof speakStory;
    switchTab: typeof switchTab;
    openLexiconFromExplore: typeof openLexiconFromExplore;
    renderTodayTab: typeof renderTodayTab;
    setDailyGoalMinutes: typeof setDailyGoalMinutes;
    reopenOnboardingSetup: typeof reopenOnboardingSetup;
    skipOnboardingSetup: typeof skipOnboardingSetup;
    setOnboardingStep: typeof setOnboardingStep;
    selectOnboardingStartChoice: typeof selectOnboardingStartChoice;
    answerOnboardingPlacement: typeof answerOnboardingPlacement;
    completeOnboardingSetup: typeof completeOnboardingSetup;
    continueCurrentCourseModule: typeof continueCurrentCourseModule;
    openCourseModuleMapFromToday: typeof openCourseModuleMapFromToday;
    openCourseLevelFromToday: typeof openCourseLevelFromToday;
    startRecommendedReviewFromToday: typeof startRecommendedReviewFromToday;
    openSuggestedStoryFromToday: typeof openSuggestedStoryFromToday;
    renderIdentifyTab: typeof renderIdentifyTab;
    selectIdentifyCategory: typeof selectIdentifyCategory;
    selectIdentifyScene: typeof selectIdentifyScene;
    setIdentifyExplorationMode: typeof setIdentifyExplorationMode;
    setIdentifyQuizMode: typeof setIdentifyQuizMode;
    selectIdentifyHotspot: typeof selectIdentifyHotspot;
    handleIdentifyMCOption: typeof handleIdentifyMCOption;
    submitIdentifyTypedAnswer: typeof submitIdentifyTypedAnswer;
    insertIdentifyChar: typeof insertIdentifyChar;
    revealIdentifyAnswer: typeof revealIdentifyAnswer;
    advanceIdentifyNextTarget: typeof advanceIdentifyNextTarget;
    toggleIdentifyCategoryDrawer: typeof toggleIdentifyCategoryDrawer;
    toggleIdentifySummaryView: typeof toggleIdentifySummaryView;
    filterIdentifyCategories: typeof filterIdentifyCategories;
    retryIdentifyMistakes: typeof retryIdentifyMistakes;
    resetIdentifyScene: typeof resetIdentifyScene;
    goIdentifyNextScene: typeof goIdentifyNextScene;
    addIdentifyWordToFSRS: typeof addIdentifyWordToFSRS;
    addIdentifySceneWordsToFSRS: typeof addIdentifySceneWordsToFSRS;
    switchIdentifyPilotVariant: typeof switchIdentifyPilotVariant;
    setIdentifySceneFitMode: typeof setIdentifySceneFitMode;
    toggleIdentifyBoundingBoxes: typeof toggleIdentifyBoundingBoxes;
    openLanguageSelectorModal: typeof openLanguageSelectorModal;
    closeLanguageSelectorModal: typeof closeLanguageSelectorModal;
    selectTargetLanguageInModal: typeof selectTargetLanguageInModal;
    selectNativeLanguageForEnglishInModal: typeof selectNativeLanguageForEnglishInModal;
    selectCourseTrackById: typeof selectCourseTrackById;
    changeInterfaceLanguageInModal: typeof changeInterfaceLanguageInModal;
    openDevCourseImporterModal: typeof openDevCourseImporterModal;
    closeDevCourseImporterModal: typeof closeDevCourseImporterModal;
    loadSyntheticCourseJsonFixture: typeof loadSyntheticCourseJsonFixture;
    loadSyntheticHindiCourseJsonFixture: typeof loadSyntheticHindiCourseJsonFixture;
    runDevImportPreview: typeof runDevImportPreview;
    confirmDevPilotImport: typeof confirmDevPilotImport;
    resetDevPilotCourseTrack: typeof resetDevPilotCourseTrack;
    syncMultilingualTrackUI: typeof syncMultilingualTrackUI;
    selectUniversalCourseModule: typeof selectUniversalCourseModule;
    selectUniversalCourseLesson: typeof selectUniversalCourseLesson;
    answerUniversalCourseActivity: typeof answerUniversalCourseActivity;
    markUniversalLessonComplete: typeof markUniversalLessonComplete;
    addTrackVocabItemToIsolatedFsrs: typeof addTrackVocabItemToIsolatedFsrs;
    gradeTrackIsolatedFsrsItem: typeof gradeTrackIsolatedFsrsItem;
    speakMultilingualText: typeof speakMultilingualText;
    updateSidebarStats: typeof updateSidebarStats;
    openLangoContentStudio: typeof openLangoContentStudio;
    closeLangoContentStudio: typeof closeLangoContentStudio;
    renderLangoContentStudio: typeof renderLangoContentStudio;
    switchCmsWorkspaceTab: typeof switchCmsWorkspaceTab;
    selectCmsActiveTrack: typeof selectCmsActiveTrack;
    dismissCmsBanner: typeof dismissCmsBanner;
    handleCmsGlobalSearchInput: typeof handleCmsGlobalSearchInput;
    handleSearchResultClick: typeof handleSearchResultClick;
    setCmsCourseManagerFilter: typeof setCmsCourseManagerFilter;
    selectCmsEditorModule: typeof selectCmsEditorModule;
    selectCmsEditorLesson: typeof selectCmsEditorLesson;
    selectCmsEditorActivity: typeof selectCmsEditorActivity;
    toggleCmsSourceJsonDrawer: typeof toggleCmsSourceJsonDrawer;
    toggleCmsDraftVsPublishedDiffDrawer: typeof toggleCmsDraftVsPublishedDiffDrawer;
    setCmsPreviewMode: typeof setCmsPreviewMode;
    openCmsPreviewWithMode: typeof openCmsPreviewWithMode;
    handleDiscardCmsDraftOverlay: typeof handleDiscardCmsDraftOverlay;
    handleAddCmsModulePrompt: typeof handleAddCmsModulePrompt;
    handleMoveCmsModule: typeof handleMoveCmsModule;
    handleDuplicateCmsModule: typeof handleDuplicateCmsModule;
    handleSaveCmsLessonEdits: typeof handleSaveCmsLessonEdits;
    handleSaveCmsActivityEdits: typeof handleSaveCmsActivityEdits;
    handleCreateManualSnapshot: typeof handleCreateManualSnapshot;
    handleCmsLifecycleTransition: typeof handleCmsLifecycleTransition;
    setCmsImportMode: typeof setCmsImportMode;
    loadCmsSampleFixture: typeof loadCmsSampleFixture;
    handleExecuteCmsDraftImport: typeof handleExecuteCmsDraftImport;
    setCmsVocabSearch: typeof setCmsVocabSearch;
    selectCmsVocabLexeme: typeof selectCmsVocabLexeme;
    selectCmsOverlayLanguage: typeof selectCmsOverlayLanguage;
    handleSaveCanonicalLexeme: typeof handleSaveCanonicalLexeme;
    handleSaveNativeOverlay: typeof handleSaveNativeOverlay;
    handleRunCmsBulkAudit: typeof handleRunCmsBulkAudit;
    handleAddCmsReviewerNote: typeof handleAddCmsReviewerNote;
    handleRestoreCmsSnapshot: typeof handleRestoreCmsSnapshot;
    setCmsDiffSelection: typeof setCmsDiffSelection;
    setCmsMediaSearch: typeof setCmsMediaSearch;
    handleVerifyCmsExportRoundTrip: typeof handleVerifyCmsExportRoundTrip;
    handleDownloadCmsExportJson: typeof handleDownloadCmsExportJson;
    openCmsAdvancedSubTab: typeof openCmsAdvancedSubTab;
    startCmsGuidedTour: typeof startCmsGuidedTour;
    stepCmsGuidedTour: typeof stepCmsGuidedTour;
    closeCmsGuidedTour: typeof closeCmsGuidedTour;
    setCmsMobileEditorPanel: typeof setCmsMobileEditorPanel;
    toggleCmsOutlineSection: typeof toggleCmsOutlineSection;
    markCmsEditorUnsavedChanges: typeof markCmsEditorUnsavedChanges;
    syncFriendlyMcChoicesToUnderlyingInputs: typeof syncFriendlyMcChoicesToUnderlyingInputs;
    handleQuickAddLessonFromHome: typeof handleQuickAddLessonFromHome;
    handleStartFirstModuleForTrack: typeof handleStartFirstModuleForTrack;
    resumeLastEditedCmsLesson: typeof resumeLastEditedCmsLesson;
    jumpToCmsValidationProblem: typeof jumpToCmsValidationProblem;
    handleAddCmsActivityToLesson: typeof handleAddCmsActivityToLesson;
    togglePendingPublishConfirmation: typeof togglePendingPublishConfirmation;
    handleCmsImportFileSelected: typeof handleCmsImportFileSelected;
    handleCheckCmsImportContents: typeof handleCheckCmsImportContents;
    toggleCmsRemovedItemsDrawer: typeof toggleCmsRemovedItemsDrawer;
    toggleCmsUnpublishedChangesDrawer: typeof toggleCmsUnpublishedChangesDrawer;
    requestCmsItemRemoval: typeof requestCmsItemRemoval;
    confirmPendingCmsRemoval: typeof confirmPendingCmsRemoval;
    cancelPendingCmsRemoval: typeof cancelPendingCmsRemoval;
    handleUndoCmsEditorAction: typeof handleUndoCmsEditorAction;
    handleRedoCmsEditorAction: typeof handleRedoCmsEditorAction;
    handleRestoreRemovedCmsItem: typeof handleRestoreRemovedCmsItem;
    handleRequestRemoveModule: typeof handleRequestRemoveModule;
    handleAddCmsSection: typeof handleAddCmsSection;
    handleRequestRemoveSection: typeof handleRequestRemoveSection;
    handleAddCmsLesson: typeof handleAddCmsLesson;
    handleDuplicateCmsLesson: typeof handleDuplicateCmsLesson;
    handleRequestRemoveLesson: typeof handleRequestRemoveLesson;
    handleRemoveLessonParagraph: typeof handleRemoveLessonParagraph;
    handleRemoveLessonVocabRef: typeof handleRemoveLessonVocabRef;
    handleAddLessonVocabRefFromInput: typeof handleAddLessonVocabRefFromInput;
    handleRemoveLessonMediaRef: typeof handleRemoveLessonMediaRef;
    handleAddLessonMediaRefFromInput: typeof handleAddLessonMediaRefFromInput;
    handleDuplicateActiveCmsActivity: typeof handleDuplicateActiveCmsActivity;
    handleRequestRemoveActiveActivity: typeof handleRequestRemoveActiveActivity;
    handleAddCmsAnswerOption: typeof handleAddCmsAnswerOption;
    handleRequestRemoveAnswerOption: typeof handleRequestRemoveAnswerOption;
    handleRemoveQuestionExplanation: typeof handleRemoveQuestionExplanation;
    handleRemoveGrammarRule: typeof handleRemoveGrammarRule;
    handleRemoveExampleSentence: typeof handleRemoveExampleSentence;
    handleRequestRemoveGrammarTable: typeof handleRequestRemoveGrammarTable;
    handleRemoveGrammarTableRow: typeof handleRemoveGrammarTableRow;
    selectCmsIdentifyScene: typeof selectCmsIdentifyScene;
    selectCmsIdentifyTarget: typeof selectCmsIdentifyTarget;
    setCmsIdentifyFilter: typeof setCmsIdentifyFilter;
    toggleCmsIdentifyBulkAuditPanel: typeof toggleCmsIdentifyBulkAuditPanel;
    toggleCmsIdentifyScenePlannerPanel: typeof toggleCmsIdentifyScenePlannerPanel;
    handleCmsIdentifyCanvasClick: typeof handleCmsIdentifyCanvasClick;
    handleCmsIdentifySaveGeometryInputs: typeof handleCmsIdentifySaveGeometryInputs;
    handleCmsIdentifyNudgeTarget: typeof handleCmsIdentifyNudgeTarget;
    handleCmsIdentifyMarkTargetMissing: typeof handleCmsIdentifyMarkTargetMissing;
    handleCmsIdentifyAddTarget: typeof handleCmsIdentifyAddTarget;
    handleCmsIdentifyChangeAssetPath: typeof handleCmsIdentifyChangeAssetPath;
    handleCmsIdentifyUndoDraft: typeof handleCmsIdentifyUndoDraft;
    handleCmsIdentifyRestoreBaseline: typeof handleCmsIdentifyRestoreBaseline;
    handleCmsIdentifyCheckScene: typeof handleCmsIdentifyCheckScene;
    handleCmsIdentifyPublishScene: typeof handleCmsIdentifyPublishScene;
    handleCmsIdentifyPreviewInLearnerApp: typeof handleCmsIdentifyPreviewInLearnerApp;
    handleCourseStickyBack: typeof handleCourseStickyBack;
    trapFocusInModal: typeof trapFocusInModal;
    releaseFocusTrap: typeof releaseFocusTrap;
    handleCourseStickyPrimary: typeof handleCourseStickyPrimary;
    selectReviewMode: typeof selectReviewMode;
    toggleReviewAutoAudio: typeof toggleReviewAutoAudio;
    setReviewAutoPlayAudio: typeof setReviewAutoPlayAudio;
    toggleReviewFocusMode: typeof toggleReviewFocusMode;
    finishActiveReviewSession: typeof finishActiveReviewSession;
    unlockBonusNewCards: typeof unlockBonusNewCards;
    closeReviewAdvancedMenu: typeof closeReviewAdvancedMenu;
    flipMixedCard: typeof flipMixedCard;
    gradeMixedCard: typeof gradeMixedCard;
    selectReviewTopicSubMode: typeof selectReviewTopicSubMode;
    selectReviewTopicCategory: typeof selectReviewTopicCategory;
    answerReviewTopicMc: typeof answerReviewTopicMc;
    addReviewTopicTile: typeof addReviewTopicTile;
    resetReviewTopicTiles: typeof resetReviewTopicTiles;
    revealReviewTopicCard: typeof revealReviewTopicCard;
    gradeReviewTopicCard: typeof gradeReviewTopicCard;
    currentInspectedRank: number;
    srsCatPage: number;
    phonPage: number;
  }
}

if (typeof window !== 'undefined') {
  window.triggerHaptic = triggerHaptic;
  window.applyColorTheme = applyColorTheme;
  window.cycleColorTheme = cycleColorTheme;
  window.openSettingsModal = openSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.openInspectorSheet = openInspectorSheet;
  window.closeInspectorSheet = closeInspectorSheet;
  window.toggleGrammarInspector = toggleGrammarInspector;
  window.toggleCourseSyllabusDrawer = toggleCourseSyllabusDrawer;
  window.toggleReaderStoryDrawer = toggleReaderStoryDrawer;
  window.openVoiceModal = openVoiceModal;
  window.closeVoiceModal = closeVoiceModal;
  window.saveVoiceModal = saveVoiceModal;
  window.playBilingualOpenAI = playBilingualOpenAI;
  window.speakUkrainian = speakUkrainian;
  window.speakEnglish = speakEnglish;
  window.speakExplanation = speakExplanation;
  window.speakCorrectionExplanation = speakCorrectionExplanation;
  window.renderAnkiStage = renderAnkiStage;
  window.flipAnkiCard = flipAnkiCard;
  window.gradeAnkiCard = gradeAnkiCard;
  window.renderEn2UkStage = renderEn2UkStage;
  window.flipEn2UkCard = flipEn2UkCard;
  window.gradeEn2UkCard = gradeEn2UkCard;
  window.renderCorrectionStage = renderCorrectionStage;
  window.flipCorrectionCard = flipCorrectionCard;
  window.gradeCorrectionCard = gradeCorrectionCard;
  window.addSingleWordFrom6000 = addSingleWordFrom6000;
  window.batchAddNextFrequencyWords = batchAddNextFrequencyWords;
  window.inspectWordDeep = inspectWordDeep;
  window.renderSrsCatalog6000 = renderSrsCatalog6000;
  window.changeSrsCatPage = changeSrsCatPage;
  window.renderPhonetics6000 = renderPhonetics6000;
  window.changePhonPage = changePhonPage;
  window.clearCanvas = clearCanvas;
  window.filterCourseByLevel = filterCourseByLevel;
  window.selectCourseModule = selectCourseModule;
  window.selectCourseStage = selectCourseStage;
  window.renderCourseSyllabus = renderCourseSyllabus;
  window.inspectCourseWord = inspectCourseWord;
  window.jumpToLessonSection = jumpToLessonSection;
  window.addModuleVocabToFSRS = addModuleVocabToFSRS;
  window.speakCourseOverview = speakCourseOverview;
  window.speakCourseRule = speakCourseRule;
  window.speakAllCourseRules = speakAllCourseRules;
  window.speakCourseDialogue = speakCourseDialogue;
  window.renderActiveModule = renderActiveModule;
  window.handleCourseOptionTap = handleCourseOptionTap;
  window.handlePracticeOptionTap = handlePracticeOptionTap;
  window.handleExamAnswer = handleExamAnswer;
  window.setAssessmentFilter = setAssessmentFilter;
  window.toggleAssessmentSingleFocus = toggleAssessmentSingleFocus;
  window.jumpToAssessmentQuestion = jumpToAssessmentQuestion;
  window.stepAssessmentQuestion = stepAssessmentQuestion;
  window.requestResetAssessmentStage = requestResetAssessmentStage;
  window.cancelResetAssessmentStage = cancelResetAssessmentStage;
  window.confirmResetAssessmentStage = confirmResetAssessmentStage;
  window.handleInlineCheckOption = handleInlineCheckOption;
  window.submitInlineCheckText = submitInlineCheckText;
  window.submitStageAssessmentText = submitStageAssessmentText;
  window.cancelSubmitModuleExam = cancelSubmitModuleExam;
  window.submitModuleExam = submitModuleExam;
  window.handleCourseStickyBack = handleCourseStickyBack;
  window.handleCourseStickyPrimary = handleCourseStickyPrimary;
  window.selectReviewMode = selectReviewMode;
  window.toggleReviewAutoAudio = toggleReviewAutoAudio;
  window.setReviewAutoPlayAudio = setReviewAutoPlayAudio;
  window.toggleReviewFocusMode = toggleReviewFocusMode;
  window.finishActiveReviewSession = finishActiveReviewSession;
  window.unlockBonusNewCards = unlockBonusNewCards;
  window.closeReviewAdvancedMenu = closeReviewAdvancedMenu;
  window.flipMixedCard = flipMixedCard;
  window.gradeMixedCard = gradeMixedCard;
  window.selectReviewTopicSubMode = selectReviewTopicSubMode;
  window.selectReviewTopicCategory = selectReviewTopicCategory;
  window.answerReviewTopicMc = answerReviewTopicMc;
  window.addReviewTopicTile = addReviewTopicTile;
  window.resetReviewTopicTiles = resetReviewTopicTiles;
  window.revealReviewTopicCard = revealReviewTopicCard;
  window.gradeReviewTopicCard = gradeReviewTopicCard;
  window.selectVocabCategory = selectVocabCategory;
  window.selectVocabMode = selectVocabMode;
  window.clearVocabTopicSearch = clearVocabTopicSearch;
  window.practiceActiveTopicInReview = practiceActiveTopicInReview;
  window.speakCategoryGuide = speakCategoryGuide;
  window.addCategoryToFSRS = addCategoryToFSRS;
  window.checkVocabActiveRecall = checkVocabActiveRecall;
  window.addSentenceTile = addSentenceTile;
  window.resetSentenceBuilder = resetSentenceBuilder;
  window.checkSentenceBuilder = checkSentenceBuilder;
  window.renderEverydayVocabTab = renderEverydayVocabTab;
  window.renderEverydayVocabWorkspace = renderEverydayVocabWorkspace;
  window.clearLexiconSearch = clearLexiconSearch;
  window.clearPhoneticsSearch = clearPhoneticsSearch;
  window.filterReaderByLevel = filterReaderByLevel;
  window.selectReaderPassage = selectReaderPassage;
  window.toggleReaderTranslations = toggleReaderTranslations;
  window.openReaderWordSheet = openReaderWordSheet;
  window.closeReaderWordSheet = closeReaderWordSheet;
  window.addReaderSheetWordToReviews = addReaderSheetWordToReviews;
  window.openFullInspectorFromReaderSheet = openFullInspectorFromReaderSheet;
  window.inspectReaderWord = inspectReaderWord;
  window.initReader = initReader;
  window.speakStory = speakStory;
  window.switchTab = switchTab;
  window.openLexiconFromExplore = openLexiconFromExplore;
  window.renderTodayTab = renderTodayTab;
  window.setDailyGoalMinutes = setDailyGoalMinutes;
  window.reopenOnboardingSetup = reopenOnboardingSetup;
  window.skipOnboardingSetup = skipOnboardingSetup;
  window.setOnboardingStep = setOnboardingStep;
  window.selectOnboardingStartChoice = selectOnboardingStartChoice;
  window.answerOnboardingPlacement = answerOnboardingPlacement;
  window.completeOnboardingSetup = completeOnboardingSetup;
  window.continueCurrentCourseModule = continueCurrentCourseModule;
  window.openCourseModuleMapFromToday = openCourseModuleMapFromToday;
  window.openCourseLevelFromToday = openCourseLevelFromToday;
  window.startRecommendedReviewFromToday = startRecommendedReviewFromToday;
  window.openSuggestedStoryFromToday = openSuggestedStoryFromToday;
  window.renderIdentifyTab = renderIdentifyTab;
  window.selectIdentifyCategory = selectIdentifyCategory;
  window.selectIdentifyScene = selectIdentifyScene;
  window.setIdentifyExplorationMode = setIdentifyExplorationMode;
  window.setIdentifyQuizMode = setIdentifyQuizMode;
  window.selectIdentifyHotspot = selectIdentifyHotspot;
  window.handleIdentifyMCOption = handleIdentifyMCOption;
  window.submitIdentifyTypedAnswer = submitIdentifyTypedAnswer;
  window.insertIdentifyChar = insertIdentifyChar;
  window.revealIdentifyAnswer = revealIdentifyAnswer;
  window.advanceIdentifyNextTarget = advanceIdentifyNextTarget;
  window.toggleIdentifyCategoryDrawer = toggleIdentifyCategoryDrawer;
  window.toggleIdentifySummaryView = toggleIdentifySummaryView;
  window.filterIdentifyCategories = filterIdentifyCategories;
  window.retryIdentifyMistakes = retryIdentifyMistakes;
  window.resetIdentifyScene = resetIdentifyScene;
  window.goIdentifyNextScene = goIdentifyNextScene;
  window.addIdentifyWordToFSRS = addIdentifyWordToFSRS;
  window.addIdentifySceneWordsToFSRS = addIdentifySceneWordsToFSRS;
  window.switchIdentifyPilotVariant = switchIdentifyPilotVariant;
  window.setIdentifySceneFitMode = setIdentifySceneFitMode;
  window.toggleIdentifyBoundingBoxes = toggleIdentifyBoundingBoxes;
  window.openLanguageSelectorModal = openLanguageSelectorModal;
  window.closeLanguageSelectorModal = closeLanguageSelectorModal;
  window.selectTargetLanguageInModal = selectTargetLanguageInModal;
  window.selectNativeLanguageForEnglishInModal =
    selectNativeLanguageForEnglishInModal;
  window.selectCourseTrackById = selectCourseTrackById;
  window.changeInterfaceLanguageInModal = changeInterfaceLanguageInModal;
  window.openDevCourseImporterModal = openDevCourseImporterModal;
  window.closeDevCourseImporterModal = closeDevCourseImporterModal;
  window.loadSyntheticCourseJsonFixture = loadSyntheticCourseJsonFixture;
  window.loadSyntheticHindiCourseJsonFixture =
    loadSyntheticHindiCourseJsonFixture;
  window.runDevImportPreview = runDevImportPreview;
  window.confirmDevPilotImport = confirmDevPilotImport;
  window.resetDevPilotCourseTrack = resetDevPilotCourseTrack;
  window.syncMultilingualTrackUI = syncMultilingualTrackUI;
  window.selectUniversalCourseModule = selectUniversalCourseModule;
  window.selectUniversalCourseLesson = selectUniversalCourseLesson;
  window.answerUniversalCourseActivity = answerUniversalCourseActivity;
  window.markUniversalLessonComplete = markUniversalLessonComplete;
  window.addTrackVocabItemToIsolatedFsrs = addTrackVocabItemToIsolatedFsrs;
  window.gradeTrackIsolatedFsrsItem = gradeTrackIsolatedFsrsItem;
  window.speakMultilingualText = speakMultilingualText;
  window.updateSidebarStats = updateSidebarStats;
  window.openLangoContentStudio = openLangoContentStudio;
  window.closeLangoContentStudio = closeLangoContentStudio;
  window.renderLangoContentStudio = renderLangoContentStudio;
  window.switchCmsWorkspaceTab = switchCmsWorkspaceTab;
  window.selectCmsActiveTrack = selectCmsActiveTrack;
  window.dismissCmsBanner = dismissCmsBanner;
  window.handleCmsGlobalSearchInput = handleCmsGlobalSearchInput;
  window.handleSearchResultClick = handleSearchResultClick;
  window.setCmsCourseManagerFilter = setCmsCourseManagerFilter;
  window.selectCmsEditorModule = selectCmsEditorModule;
  window.selectCmsEditorLesson = selectCmsEditorLesson;
  window.selectCmsEditorActivity = selectCmsEditorActivity;
  window.toggleCmsSourceJsonDrawer = toggleCmsSourceJsonDrawer;
  window.toggleCmsDraftVsPublishedDiffDrawer =
    toggleCmsDraftVsPublishedDiffDrawer;
  window.setCmsPreviewMode = setCmsPreviewMode;
  window.openCmsPreviewWithMode = openCmsPreviewWithMode;
  window.handleDiscardCmsDraftOverlay = handleDiscardCmsDraftOverlay;
  window.handleAddCmsModulePrompt = handleAddCmsModulePrompt;
  window.handleMoveCmsModule = handleMoveCmsModule;
  window.handleDuplicateCmsModule = handleDuplicateCmsModule;
  window.handleSaveCmsLessonEdits = handleSaveCmsLessonEdits;
  window.handleSaveCmsActivityEdits = handleSaveCmsActivityEdits;
  window.handleCreateManualSnapshot = handleCreateManualSnapshot;
  window.handleCmsLifecycleTransition = handleCmsLifecycleTransition;
  window.setCmsImportMode = setCmsImportMode;
  window.loadCmsSampleFixture = loadCmsSampleFixture;
  window.handleExecuteCmsDraftImport = handleExecuteCmsDraftImport;
  window.setCmsVocabSearch = setCmsVocabSearch;
  window.selectCmsVocabLexeme = selectCmsVocabLexeme;
  window.selectCmsOverlayLanguage = selectCmsOverlayLanguage;
  window.handleSaveCanonicalLexeme = handleSaveCanonicalLexeme;
  window.handleSaveNativeOverlay = handleSaveNativeOverlay;
  window.handleRunCmsBulkAudit = handleRunCmsBulkAudit;
  window.handleAddCmsReviewerNote = handleAddCmsReviewerNote;
  window.handleRestoreCmsSnapshot = handleRestoreCmsSnapshot;
  window.setCmsDiffSelection = setCmsDiffSelection;
  window.setCmsMediaSearch = setCmsMediaSearch;
  window.handleVerifyCmsExportRoundTrip = handleVerifyCmsExportRoundTrip;
  window.handleDownloadCmsExportJson = handleDownloadCmsExportJson;
  window.openCmsAdvancedSubTab = openCmsAdvancedSubTab;
  window.startCmsGuidedTour = startCmsGuidedTour;
  window.stepCmsGuidedTour = stepCmsGuidedTour;
  window.closeCmsGuidedTour = closeCmsGuidedTour;
  window.setCmsMobileEditorPanel = setCmsMobileEditorPanel;
  window.toggleCmsOutlineSection = toggleCmsOutlineSection;
  window.markCmsEditorUnsavedChanges = markCmsEditorUnsavedChanges;
  window.syncFriendlyMcChoicesToUnderlyingInputs =
    syncFriendlyMcChoicesToUnderlyingInputs;
  window.handleQuickAddLessonFromHome = handleQuickAddLessonFromHome;
  window.handleStartFirstModuleForTrack = handleStartFirstModuleForTrack;
  window.resumeLastEditedCmsLesson = resumeLastEditedCmsLesson;
  window.jumpToCmsValidationProblem = jumpToCmsValidationProblem;
  window.handleAddCmsActivityToLesson = handleAddCmsActivityToLesson;
  window.togglePendingPublishConfirmation = togglePendingPublishConfirmation;
  window.handleCmsImportFileSelected = handleCmsImportFileSelected;
  window.handleCheckCmsImportContents = handleCheckCmsImportContents;
  window.toggleCmsRemovedItemsDrawer = toggleCmsRemovedItemsDrawer;
  window.toggleCmsUnpublishedChangesDrawer = toggleCmsUnpublishedChangesDrawer;
  window.requestCmsItemRemoval = requestCmsItemRemoval;
  window.confirmPendingCmsRemoval = confirmPendingCmsRemoval;
  window.cancelPendingCmsRemoval = cancelPendingCmsRemoval;
  window.handleUndoCmsEditorAction = handleUndoCmsEditorAction;
  window.handleRedoCmsEditorAction = handleRedoCmsEditorAction;
  window.handleRestoreRemovedCmsItem = handleRestoreRemovedCmsItem;
  window.handleRequestRemoveModule = handleRequestRemoveModule;
  window.handleAddCmsSection = handleAddCmsSection;
  window.handleRequestRemoveSection = handleRequestRemoveSection;
  window.handleAddCmsLesson = handleAddCmsLesson;
  window.handleDuplicateCmsLesson = handleDuplicateCmsLesson;
  window.handleRequestRemoveLesson = handleRequestRemoveLesson;
  window.handleRemoveLessonParagraph = handleRemoveLessonParagraph;
  window.handleRemoveLessonVocabRef = handleRemoveLessonVocabRef;
  window.handleAddLessonVocabRefFromInput = handleAddLessonVocabRefFromInput;
  window.handleRemoveLessonMediaRef = handleRemoveLessonMediaRef;
  window.handleAddLessonMediaRefFromInput = handleAddLessonMediaRefFromInput;
  window.handleDuplicateActiveCmsActivity = handleDuplicateActiveCmsActivity;
  window.handleRequestRemoveActiveActivity = handleRequestRemoveActiveActivity;
  window.handleAddCmsAnswerOption = handleAddCmsAnswerOption;
  window.handleRequestRemoveAnswerOption = handleRequestRemoveAnswerOption;
  window.handleRemoveQuestionExplanation = handleRemoveQuestionExplanation;
  window.handleRemoveGrammarRule = handleRemoveGrammarRule;
  window.handleRemoveExampleSentence = handleRemoveExampleSentence;
  window.handleRequestRemoveGrammarTable = handleRequestRemoveGrammarTable;
  window.handleRemoveGrammarTableRow = handleRemoveGrammarTableRow;
  window.selectCmsIdentifyScene = selectCmsIdentifyScene;
  window.selectCmsIdentifyTarget = selectCmsIdentifyTarget;
  window.setCmsIdentifyFilter = setCmsIdentifyFilter;
  window.toggleCmsIdentifyBulkAuditPanel = toggleCmsIdentifyBulkAuditPanel;
  window.toggleCmsIdentifyScenePlannerPanel = toggleCmsIdentifyScenePlannerPanel;
  window.handleCmsIdentifyCanvasClick = handleCmsIdentifyCanvasClick;
  window.handleCmsIdentifySaveGeometryInputs = handleCmsIdentifySaveGeometryInputs;
  window.handleCmsIdentifyNudgeTarget = handleCmsIdentifyNudgeTarget;
  window.handleCmsIdentifyMarkTargetMissing = handleCmsIdentifyMarkTargetMissing;
  window.handleCmsIdentifyAddTarget = handleCmsIdentifyAddTarget;
  window.handleCmsIdentifyChangeAssetPath = handleCmsIdentifyChangeAssetPath;
  window.handleCmsIdentifyUndoDraft = handleCmsIdentifyUndoDraft;
  window.handleCmsIdentifyRestoreBaseline = handleCmsIdentifyRestoreBaseline;
  window.handleCmsIdentifyCheckScene = handleCmsIdentifyCheckScene;
  window.handleCmsIdentifyPublishScene = handleCmsIdentifyPublishScene;
  window.handleCmsIdentifyPreviewInLearnerApp = handleCmsIdentifyPreviewInLearnerApp;
  window.trapFocusInModal = trapFocusInModal;
  window.releaseFocusTrap = releaseFocusTrap;

  Object.defineProperty(window, 'currentInspectedRank', {
    get: () => currentInspectedRank,
    set: (v: number) => {
      currentInspectedRank = v;
    },
  });
  Object.defineProperty(window, 'srsCatPage', {
    get: () => srsCatPage,
    set: (v: number) => {
      srsCatPage = v;
    },
  });
  Object.defineProperty(window, 'phonPage', {
    get: () => phonPage,
    set: (v: number) => {
      phonPage = v;
    },
  });

  // Boot application
  applyColorTheme(currentThemeMode);
  syncDailyGoalButtonsUI();
  injectOpenAIVoiceModal();
  initCursivePad();
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  renderSrsCatalog6000();
  renderPhonetics6000();
  renderCourseSyllabus();
  renderActiveModule();
  initCourseScrollspyListener();
  registerOnCourseTrackChanged(() => {
    syncCourseDrawerAndWorkspaceDOM();
    syncReviewSrsVsLexiconDOM();
    renderTodayTab();
  });
  syncMultilingualTrackUI();
  syncCourseDrawerAndWorkspaceDOM();
  syncReviewSrsVsLexiconDOM();
  renderEverydayVocabTab();
  registerIdentifyHooks({
    triggerHaptic: (t) => triggerHaptic(t === 'heavy' ? 'heavy' : 'light'),
    speakUkrainian,
    inspectCourseWord,
    addWordByUkToFSRS: (uk) => addWordByUkToFSRS(uk),
  });
  renderIdentifyTab();
  initAIConversationTab({
    speakUkText: (textUk) => {
      void speakUkrainian(textUk);
    },
    inspectWordIn7Cases: (wordUk) => inspectCourseWord(wordUk),
    addWordToFlashcards: (wordUk, buttonEl) => {
      const added = addWordByUkToFSRS(wordUk);
      if (buttonEl) {
        buttonEl.textContent = added ? '✓ Added to reviews' : '✓ In reviews';
      }
    },
    openCourseModuleById: (moduleId) => {
      selectCourseModule(moduleId);
      switchTab('course');
    },
  });
  initReader();
  const initialBookWord =
    FREQ_6000_DB.find((w) => w.ru === 'кни́жка')?.rank || 1;
  inspectWordDeep(initialBookWord, false, false);
  updateSidebarStats();
  isReviewBootReady = true;
  syncReviewControlsUI();
  syncRouteFromHash(true);
  bootCmsStudioRouteIfRequested();

  window.addEventListener('hashchange', () => {
    syncRouteFromHash(false);
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeReaderWordSheet();
      closeReviewAdvancedMenu();
      closeSettingsModal();
      closeVoiceModal();
      closeLanguageSelectorModal();
      closeDevCourseImporterModal();
      closeInspectorSheet();
      const dockerModal = document.getElementById('lango-docker-zip-modal');
      if (dockerModal && !dockerModal.classList.contains('hidden')) {
        dockerModal.classList.add('hidden');
        releaseFocusTrap('lango-docker-zip-modal');
      }
      if (reviewPrefs.focusDimChrome && isUserCurrentlyViewingReview()) {
        reviewPrefs.focusDimChrome = false;
        saveReviewPrefs();
        syncReviewControlsUI();
      }
      return;
    }

    const target = e.target as HTMLElement | null;
    const tag = target?.tagName || '';
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target?.isContentEditable
    ) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const inReview = isUserCurrentlyViewingReview();
    const identifyVisible = !document
      .getElementById('tab-identify')
      ?.classList.contains('hidden');

    if (
      inReview &&
      !activeReviewSession.completed &&
      (e.key === 'r' || e.key === 'R')
    ) {
      e.preventDefault();
      if (activeReviewMode === 'mixed' && currentMixedEntry) {
        const item = FREQ_6000_DB[currentMixedEntry.card.rank - 1];
        if (item) {
          if (currentMixedEntry.deck === 'correction' && mixedFlipped) {
            void speakUkrainian(generateSentenceCorrection(item).rightRu);
          } else {
            void speakUkrainian(item.ru);
          }
        }
      } else if (activeReviewMode === 'srs' && currentAnkiCard) {
        const item = FREQ_6000_DB[currentAnkiCard.rank - 1];
        if (item) void speakUkrainian(item.ru);
      } else if (
        activeReviewMode === 'en2uk' &&
        en2ukFlipped &&
        currentEn2UkCard
      ) {
        const item = FREQ_6000_DB[currentEn2UkCard.rank - 1];
        if (item) void speakUkrainian(item.ru);
      } else if (
        activeReviewMode === 'correction' &&
        corrFlipped &&
        currentCorrCard
      ) {
        const item = FREQ_6000_DB[currentCorrCard.rank - 1];
        if (item) void speakUkrainian(generateSentenceCorrection(item).rightRu);
      } else if (activeReviewMode === 'topics' && currentTopicDrillItem) {
        void speakUkrainian(currentTopicDrillItem.audioUk);
      }
      return;
    }

    if (e.code === 'Space' && inReview && !activeReviewSession.completed) {
      if (activeReviewMode === 'mixed' && !mixedFlipped && currentMixedEntry) {
        e.preventDefault();
        flipMixedCard();
        return;
      }
      if (activeReviewMode === 'srs' && !ankiFlipped && currentAnkiCard) {
        e.preventDefault();
        flipAnkiCard();
        return;
      }
      if (activeReviewMode === 'en2uk' && !en2ukFlipped && currentEn2UkCard) {
        e.preventDefault();
        flipEn2UkCard();
        return;
      }
      if (
        activeReviewMode === 'correction' &&
        !corrFlipped &&
        currentCorrCard
      ) {
        e.preventDefault();
        flipCorrectionCard();
        return;
      }
      if (
        activeReviewMode === 'topics' &&
        !topicDrillRevealed &&
        currentTopicDrillItem
      ) {
        e.preventDefault();
        revealReviewTopicCard();
        return;
      }
    }

    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
      const g = Number(e.key) as 1 | 2 | 3 | 4;
      if (inReview && !activeReviewSession.completed) {
        if (activeReviewMode === 'mixed' && mixedFlipped && currentMixedEntry) {
          e.preventDefault();
          gradeMixedCard(g);
          return;
        }
        if (activeReviewMode === 'srs' && ankiFlipped && currentAnkiCard) {
          e.preventDefault();
          gradeAnkiCard(g);
          return;
        }
        if (activeReviewMode === 'en2uk' && en2ukFlipped && currentEn2UkCard) {
          e.preventDefault();
          gradeEn2UkCard(g);
          return;
        }
        if (
          activeReviewMode === 'correction' &&
          corrFlipped &&
          currentCorrCard
        ) {
          e.preventDefault();
          gradeCorrectionCard(g);
          return;
        }
        if (activeReviewMode === 'topics' && currentTopicDrillItem) {
          e.preventDefault();
          if (topicDrillRevealed) {
            gradeReviewTopicCard(g);
          } else if (
            currentTopicDrillItem.options &&
            g - 1 < currentTopicDrillItem.options.length
          ) {
            answerReviewTopicMc(g - 1);
          }
          return;
        }
      }

      if (identifyVisible) {
        const mcBtns = document.querySelectorAll<HTMLButtonElement>(
          '#tab-identify .identify-options-grid .option-btn:not(:disabled)'
        );
        const btnToClick = mcBtns[g - 1];
        if (btnToClick) {
          e.preventDefault();
          btnToClick.click();
        }
      }
    }
  });
}
