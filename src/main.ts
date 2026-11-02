import { FREQ_6000_DB, VocabItem } from './vocabData';
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
} from './multilingual/multilingualSelectorView.ts';
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
export function triggerHaptic(style: 'light' | 'heavy' = 'light'): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(style === 'heavy' ? 18 : 8);
  }
}

let currentThemeMode: string =
  localStorage.getItem('slovo_ua_theme_mode') || 'system';

export function applyColorTheme(mode: string): void {
  currentThemeMode = mode;
  localStorage.setItem('slovo_ua_theme_mode', mode);
  const root = document.documentElement;
  const iconEl = document.getElementById('theme-toggle-icon');
  if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
    if (iconEl) iconEl.innerText = '☀️';
  } else if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (iconEl) iconEl.innerText = '🌙';
  } else {
    root.removeAttribute('data-theme');
    if (iconEl) iconEl.innerText = '🌗';
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

export function openInspectorSheet(): void {
  triggerHaptic('light');
  document.getElementById('grammar-inspector')?.classList.add('sheet-open');
  document.getElementById('inspector-backdrop')?.classList.add('open');
}

export function closeInspectorSheet(): void {
  document.getElementById('grammar-inspector')?.classList.remove('sheet-open');
  document.getElementById('inspector-backdrop')?.classList.remove('open');
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
  modal.className = 'hidden';
  modal.style.cssText =
    'position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:18px;';
  modal.innerHTML = `
    <div class="card" style="max-width:420px; width:100%; background:var(--surface-1); border:1px solid var(--border-strong); box-shadow:var(--shadow-theater); margin:0;">
      <h3 style="margin-top:0; font-size:19px; color:var(--accent);">🎙️ Dual-Accent Ukrainian/English Voice</h3>
      <p style="font-size:13px; color:var(--text-secondary); margin-top:0; line-height:1.45;">
        Built-in browser pronunciation works automatically. Optional: enter an OpenAI API key to enable <b>Studio Dual-Accent Neural TTS</b> (native American English + native literary Ukrainian).
      </p>
      <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px;">OpenAI API Key (optional, sk-...):</label>
      <input id="vc-oa-key" type="password" class="input-box" style="width:100%; margin-bottom:12px;" placeholder="sk-proj-... (leave blank for built-in browser voice)">
      <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px;">OpenAI TTS Model:</label>
      <select id="vc-oa-model" class="input-box" style="width:100%; margin-bottom:12px;">
        <option value="gpt-4o-mini-tts">gpt-4o-mini-tts (Recommended — Native Dual-Accent Control)</option>
        <option value="tts-1-hd">tts-1-hd (Studio HD)</option>
      </select>
      <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px;">Speaker Voice:</label>
      <select id="vc-oa-voice" class="input-box" style="width:100%; margin-bottom:12px;">
        <option value="nova">Nova (Default — Warm, Clear Bilingual Female)</option>
        <option value="coral">Coral (Expressive, Articulate Female)</option>
        <option value="sage">Sage (Calm, Natural Instructor)</option>
        <option value="onyx">Onyx (Deep, Authoritative Bilingual Male)</option>
        <option value="shimmer">Shimmer (Clear Studio Female)</option>
        <option value="echo">Echo (Smooth, Natural Male)</option>
        <option value="alloy">Alloy (Balanced Studio Neutral)</option>
      </select>
      <label style="font-size:13px; font-weight:700; display:block; margin-bottom:4px;">Speaking Speed:</label>
      <select id="vc-oa-speed" class="input-box" style="width:100%; margin-bottom:18px;">
        <option value="0.85">0.85x (Slower — Clear Phonetic Study)</option>
        <option value="0.92">0.92x (Default — Natural Learner Pace)</option>
        <option value="1.0">1.00x (Full Native Speed)</option>
      </select>
      <div style="display:flex; gap:8px;">
        <button class="btn" style="flex:1;" onclick="saveVoiceModal()">💾 Save & Test Voice</button>
        <button class="btn btn-sec" onclick="closeVoiceModal()">Cancel</button>
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
  document.getElementById('voice-settings-modal')?.classList.remove('hidden');
}

export function closeVoiceModal(): void {
  document.getElementById('voice-settings-modal')?.classList.add('hidden');
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

function saveDB(): void {
  localStorage.setItem('slovo_ua_6000_anki_v1', JSON.stringify(db));
  updateSidebarStats();
}

function applyFSRSGrade(card: FSRSCard | null, grade: 1 | 2 | 3 | 4): void {
  if (!card) return;
  triggerHaptic('heavy');
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
  db.xp += 15;
  db.drills += 1;
  saveDB();
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

// DECK 1: UK -> EN
export function renderAnkiStage(): void {
  const now = Date.now();
  const newC = db.cards.filter((c) => c.state === 'new');
  const learnC = db.cards.filter((c) => c.state === 'learning' && c.due <= now);
  const revC = db.cards.filter((c) => c.state === 'review' && c.due <= now);

  const newEl = document.getElementById('anki-new-count');
  const learnEl = document.getElementById('anki-learn-count');
  const revEl = document.getElementById('anki-rev-count');
  if (newEl) newEl.innerText = String(newC.length);
  if (learnEl) learnEl.innerText = String(learnC.length);
  if (revEl) revEl.innerText = String(revC.length);

  const queue = [...learnC, ...revC, ...newC];
  const bodyEl = document.getElementById('anki-card-body');
  const actionEl = document.getElementById('anki-action-area');
  if (!bodyEl || !actionEl) return;

  if (!queue.length) {
    bodyEl.innerHTML = `<div style="padding:24px 12px;"><h2 style="color:var(--success); margin:0 0 8px 0;">🎉 UA → EN Queue Complete!</h2><p style="color:var(--text-secondary); margin:0;">Add more verified words from the lexicon below or review another deck.</p></div>`;
    actionEl.innerHTML = `<button class="btn btn-success" style="width:100%;" onclick="batchAddNextFrequencyWords(25)">+ Add Next 25 Words</button>`;
    return;
  }

  currentAnkiCard = queue[0];
  const item = FREQ_6000_DB[currentAnkiCard.rank - 1] || FREQ_6000_DB[0];
  const phon = generateUkrainianPhonetics(item.ru);
  const gram = generateGrammarBreakdown(item);

  if (!ankiFlipped) {
    bodyEl.innerHTML = `
      <div style="margin:auto 0;">
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">Entry #${item.rank} / ${MAX_RANK} • ${item.level} • ${item.pos}</span>
        <div class="anki-front-word" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">${item.ru}</div>
        <div style="font-size:13.5px; color:var(--text-secondary); margin-bottom:10px;">Pronunciation guide: <b>${phon.plainGuide}</b> <span style="font-family:ui-monospace, SFMono-Regular, monospace; color:var(--accent);">${phon.ipa}</span></div>
        <button class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">🔊 Hear Ukrainian Pronunciation</button>
      </div>`;
    actionEl.innerHTML = `<button class="btn anki-reveal-btn" onclick="flipAnkiCard()">Show English Meaning & Example</button>`;
  } else {
    const iv = getNextIntervals(currentAnkiCard);
    bodyEl.innerHTML = `
      <div style="text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">#${item.rank} • ${item.level}</span>
            <b style="font-size:26px; color:var(--text); margin-left:6px;">${item.ru}</b>
            <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:15px; margin-left:6px;">${phon.ipa}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">🔊 Word</button>
            <button class="btn btn-warn" onclick="speakExplanation(${item.rank})">🗣️ Explain</button>
          </div>
        </div>
        <div style="font-size:21px; font-weight:800; color:var(--success); margin:6px 0 4px 0;">${item.en}</div>
        <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:6px;"><b>Sounds like:</b> <span style="color:var(--text); font-weight:700;">${phon.plainGuide}</span> • <span style="color:var(--warn); font-weight:600;">${phon.notes}</span></div>
        <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:8px;"><b>Grammar:</b> ${gram.summaryTag} — ${gram.usageNote}</div>
        <div style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-md); font-size:13.5px; margin-bottom:10px; cursor:pointer; border:1px solid var(--border-subtle);" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
          <b>🔊 Example in Context:</b> <span style="color:var(--accent); font-weight:700;">${gram.exampleRu}</span><br><span style="color:var(--text-secondary)">${gram.exampleEn}</span>
        </div>
        <details style="background:var(--surface-2); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--accent);">📐 View Full Inflection Table (Optional)</summary>
          <div style="margin-top:8px;">${gram.tableHtml}</div>
        </details>
      </div>`;
    actionEl.innerHTML = `
      <div class="anki-grade-bar">
        <button class="anki-btn anki-again" onclick="gradeAnkiCard(1)"><small>&lt; 1m</small>Again</button>
        <button class="anki-btn anki-hard" onclick="gradeAnkiCard(2)"><small>${iv.hard}d</small>Hard</button>
        <button class="anki-btn anki-good" onclick="gradeAnkiCard(3)"><small>${iv.good}d</small>Good</button>
        <button class="anki-btn anki-easy" onclick="gradeAnkiCard(4)"><small>${iv.easy}d</small>Easy</button>
      </div>`;
  }
}

export function flipAnkiCard(): void {
  triggerHaptic('light');
  ankiFlipped = true;
  renderAnkiStage();
  if (currentAnkiCard) inspectWordDeep(currentAnkiCard.rank, true, false);
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
  const newC = db.en2ukCards.filter((c) => c.state === 'new');
  const learnC = db.en2ukCards.filter(
    (c) => c.state === 'learning' && c.due <= now
  );
  const revC = db.en2ukCards.filter(
    (c) => c.state === 'review' && c.due <= now
  );

  const newEl = document.getElementById('en2uk-new-count');
  const learnEl = document.getElementById('en2uk-learn-count');
  const revEl = document.getElementById('en2uk-rev-count');
  if (newEl) newEl.innerText = String(newC.length);
  if (learnEl) learnEl.innerText = String(learnC.length);
  if (revEl) revEl.innerText = String(revC.length);

  const queue = [...learnC, ...revC, ...newC];
  const bodyEl = document.getElementById('en2uk-card-body');
  const actionEl = document.getElementById('en2uk-action-area');
  if (!bodyEl || !actionEl) return;

  if (!queue.length) {
    bodyEl.innerHTML = `<div style="padding:24px 12px;"><h2 style="color:var(--success); margin:0 0 8px 0;">🎉 EN → UA Recall Queue Complete!</h2></div>`;
    actionEl.innerHTML = `<button class="btn btn-success" style="width:100%;" onclick="batchAddNextFrequencyWords(25)">+ Add Next 25 Words</button>`;
    return;
  }

  currentEn2UkCard = queue[0];
  const item = FREQ_6000_DB[currentEn2UkCard.rank - 1] || FREQ_6000_DB[0];
  const phon = generateUkrainianPhonetics(item.ru);
  const gram = generateGrammarBreakdown(item);

  if (!en2ukFlipped) {
    bodyEl.innerHTML = `
      <div style="margin:auto 0;">
        <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container);">EN → UA Recall • #${item.rank} (${item.level})</span>
        <div class="anki-front-word" style="color:var(--text); font-size:clamp(24px, 6.5vw, 36px);">"${item.en}"</div>
        <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">Part of Speech: <b>${item.pos}</b> — Recall or type the Ukrainian word:</div>
        <input id="en2uk-user-guess" class="input-box" style="max-width:340px; width:100%; text-align:center;" placeholder="Optional: Type Ukrainian word..." onkeydown="if(event.key==='Enter') flipEn2UkCard()">
      </div>`;
    actionEl.innerHTML = `<button class="btn anki-reveal-btn" onclick="flipEn2UkCard()">Show Ukrainian Answer</button>`;
  } else {
    const iv = getNextIntervals(currentEn2UkCard);
    const cleanTarget = item.ru.replace(/\u0301/g, '').toLowerCase().trim();
    const cleanGuess = lastEn2UkUserGuess
      .replace(/\u0301/g, '')
      .toLowerCase()
      .trim();
    const guessFeedbackHtml = cleanGuess
      ? cleanGuess === cleanTarget
        ? `<div style="padding:6px 10px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700; margin-bottom:6px;">✅ Exact match! You typed «${lastEn2UkUserGuess}».</div>`
        : `<div style="padding:6px 10px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700; margin-bottom:6px;">You typed «${lastEn2UkUserGuess}» → Target: «${item.ru}».</div>`
      : '';

    bodyEl.innerHTML = `
      <div style="text-align:left;">
        ${guessFeedbackHtml}
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container);">#${item.rank} • ${item.en}</span>
            <b style="font-size:26px; color:var(--text); margin-left:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">🔊 ${item.ru}</b>
            <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:15px; margin-left:6px;">${phon.ipa}</span>
          </div>
          <button class="btn btn-warn" onclick="speakExplanation(${item.rank})">🗣️ Hear Explanation</button>
        </div>
        <div style="font-size:12.5px; color:var(--text-secondary); margin:6px 0;"><b>Sounds like:</b> <b>${phon.plainGuide}</b> • <b>Grammar:</b> ${gram.summaryTag} — ${gram.usageNote}</div>
        <div style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-md); font-size:13.5px; margin-bottom:8px; cursor:pointer; border:1px solid var(--border-subtle);" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
          <b>🔊 Context Sentence:</b> <span style="color:var(--accent); font-weight:700;">${gram.exampleRu}</span><br><span style="color:var(--text-secondary)">${gram.exampleEn}</span>
        </div>
        <details style="background:var(--surface-2); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--accent);">📐 View Full Inflection Table (Optional)</summary>
          <div style="margin-top:8px;">${gram.tableHtml}</div>
        </details>
      </div>`;
    actionEl.innerHTML = `
      <div class="anki-grade-bar">
        <button class="anki-btn anki-again" onclick="gradeEn2UkCard(1)"><small>&lt; 1m</small>Again</button>
        <button class="anki-btn anki-hard" onclick="gradeEn2UkCard(2)"><small>${iv.hard}d</small>Hard</button>
        <button class="anki-btn anki-good" onclick="gradeEn2UkCard(3)"><small>${iv.good}d</small>Good</button>
        <button class="anki-btn anki-easy" onclick="gradeEn2UkCard(4)"><small>${iv.easy}d</small>Easy</button>
      </div>`;
  }
}

export function flipEn2UkCard(): void {
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
    if (item) speakUkrainian(item.ru);
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
  const newC = db.corrCards.filter((c) => c.state === 'new');
  const learnC = db.corrCards.filter(
    (c) => c.state === 'learning' && c.due <= now
  );
  const revC = db.corrCards.filter((c) => c.state === 'review' && c.due <= now);

  const newEl = document.getElementById('corr-new-count');
  const learnEl = document.getElementById('corr-learn-count');
  const revEl = document.getElementById('corr-rev-count');
  if (newEl) newEl.innerText = String(newC.length);
  if (learnEl) learnEl.innerText = String(learnC.length);
  if (revEl) revEl.innerText = String(revC.length);

  const queue = [...learnC, ...revC, ...newC];
  const bodyEl = document.getElementById('corr-card-body');
  const actionEl = document.getElementById('corr-action-area');
  if (!bodyEl || !actionEl) return;

  if (!queue.length) {
    bodyEl.innerHTML = `<div style="padding:24px 12px;"><h2 style="color:var(--success); margin:0 0 8px 0;">🎉 Sentence Correction Queue Complete!</h2></div>`;
    actionEl.innerHTML = `<button class="btn btn-success" style="width:100%;" onclick="batchAddNextFrequencyWords(25)">+ Add Next 25 Sentence Cards</button>`;
    return;
  }

  currentCorrCard = queue[0];
  const item = FREQ_6000_DB[currentCorrCard.rank - 1] || FREQ_6000_DB[0];
  const corr = generateSentenceCorrection(item);
  const gram = generateGrammarBreakdown(item);

  if (!corrFlipped) {
    const highlightedWrong = corr.wrongRu.replace(
      /\*([^*]+)\*/,
      `<span style="color:var(--danger); text-decoration:underline wavy var(--danger); font-weight:800;">$1</span>`
    );
    bodyEl.innerHTML = `
      <div style="margin:auto 0;">
        <span class="tag" style="background:var(--danger-container); color:var(--danger-on-container);">🛠️ Fix the Grammar • #${item.rank} (${item.ru} = ${item.en})</span>
        <div style="font-size:clamp(20px, 5.2vw, 26px); font-weight:700; color:var(--text); margin:14px 0 8px 0; line-height:1.4;">❌ ${highlightedWrong}</div>
        <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">Intended meaning: <i>"${corr.enMeaning}"</i></div>
        <input id="corr-user-input" class="input-box" style="max-width:340px; width:100%; text-align:center;" placeholder="Optional: Type corrected form (${corr.wrongWord} → ?)..." onkeydown="if(event.key==='Enter') flipCorrectionCard()">
      </div>`;
    actionEl.innerHTML = `<button class="btn anki-reveal-btn" onclick="flipCorrectionCard()">Show Corrected Ukrainian Sentence</button>`;
  } else {
    const iv = getNextIntervals(currentCorrCard);
    const cleanTarget = corr.rightWord
      .replace(/\u0301/g, '')
      .toLowerCase()
      .trim();
    const cleanGuess = lastCorrUserGuess
      .replace(/\u0301/g, '')
      .toLowerCase()
      .trim();
    const guessBanner = cleanGuess
      ? cleanGuess === cleanTarget
        ? `<div style="padding:6px 10px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700; margin-bottom:6px;">✅ Spot on! You typed «${lastCorrUserGuess}».</div>`
        : `<div style="padding:6px 10px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700; margin-bottom:6px;">You typed «${lastCorrUserGuess}» → Correct form: «${corr.rightWord}».</div>`
      : '';

    bodyEl.innerHTML = `
      <div style="text-align:left;">
        ${guessBanner}
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
          <span class="tag" style="background:var(--success-container); color:var(--success-on-container);">✓ ${corr.ruleTitle}</span>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(corr.rightRu)}')">🔊 Sentence</button>
            <button class="btn btn-warn" onclick="speakCorrectionExplanation(${item.rank})">🗣️ Explain</button>
          </div>
        </div>
        <div style="font-size:13.5px; color:var(--danger); text-decoration:line-through; opacity:0.85;">❌ ${corr.wrongRu.replace(/\*/g, '')}</div>
        <div style="font-size:19.5px; font-weight:800; color:var(--success); margin:4px 0 8px 0; cursor:pointer; line-height:1.35;" onclick="speakUkrainian('${escapeSingleQuotes(corr.rightRu)}')">
          ✅ ${corr.rightRu.replace(corr.rightWord, `<u style="color:var(--accent)">${corr.rightWord}</u>`)}
        </div>
        <div style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-md); border-left:4px solid var(--warn); font-size:12.5px; line-height:1.45; margin-bottom:8px;">
          <b style="color:var(--warn);">Why (${corr.wrongWord} → ${corr.rightWord}):</b><br>${corr.explanation}
        </div>
        <details style="background:var(--surface-2); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--accent);">📐 View Full Inflection Table (Optional)</summary>
          <div style="margin-top:8px;">${gram.tableHtml}</div>
        </details>
      </div>`;
    actionEl.innerHTML = `
      <div class="anki-grade-bar">
        <button class="anki-btn anki-again" onclick="gradeCorrectionCard(1)"><small>&lt; 1m</small>Again</button>
        <button class="anki-btn anki-hard" onclick="gradeCorrectionCard(2)"><small>${iv.hard}d</small>Hard</button>
        <button class="anki-btn anki-good" onclick="gradeCorrectionCard(3)"><small>${iv.good}d</small>Good</button>
        <button class="anki-btn anki-easy" onclick="gradeCorrectionCard(4)"><small>${iv.easy}d</small>Easy</button>
      </div>`;
  }
}

export function flipCorrectionCard(): void {
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
    if (item) {
      const corr = generateSentenceCorrection(item);
      speakUkrainian(corr.rightRu);
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
  db.xp += added * 5;
  saveDB();
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  renderSrsCatalog6000();
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

  const inspectorBody = document.getElementById('inspector-body');
  if (inspectorBody) {
    inspectorBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">Entry #${item.rank} / ${MAX_RANK} • ${item.level}</span>
        <button class="btn btn-warn" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="speakExplanation(${item.rank})">🗣️ Hear Explanation</button>
      </div>
      <div style="font-size:30px; font-weight:800; color:var(--text); margin-top:8px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">🔊 ${item.ru}</div>
      <div style="font-size:13.5px; color:var(--text-secondary); margin-top:2px;">Sounds like: <b style="color:var(--text);">${phon.plainGuide}</b> <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:15px; margin-left:4px;">${phon.ipa}</span></div>
      <div style="font-size:19px; font-weight:800; color:var(--success); margin:6px 0;">${item.en}</div>
      <div style="font-size:12.5px; color:var(--warn); margin-bottom:8px; font-weight:600;">${phon.notes}</div>
      <div style="font-size:13px; color:var(--text); margin-bottom:8px;"><b>${gram.summaryTag}</b><br><span style="color:var(--text-secondary)">${gram.usageNote}</span></div>
      <div style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-md); font-size:13px; margin-bottom:10px; cursor:pointer; border:1px solid var(--border-subtle);" onclick="speakUkrainian('${escapeSingleQuotes(gram.exampleRu)}')">
        <b>🔊 Context:</b> <span style="color:var(--accent); font-weight:600;">${gram.exampleRu}</span><br><span style="color:var(--text-secondary)">${gram.exampleEn}</span>
      </div>
      ${gram.tableHtml}
    `;
  }

  const cTarget = document.getElementById('cursive-target');
  if (cTarget) cTarget.innerText = item.ru;
  const pOut = document.getElementById('phonetic-output');
  if (pOut) {
    pOut.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">#${item.rank} • ${item.level}</span>
          <b style="font-size:24px; color:var(--text); margin-left:6px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(item.ru)}')">🔊 ${item.ru}</b>
          <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:16px; margin-left:8px;">${phon.ipa}</span>
          <span style="color:var(--success); font-weight:700; margin-left:8px;">— ${item.en}</span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="btn btn-warn" onclick="speakExplanation(${item.rank})">🗣️ Hear Explanation</button>
          <button class="btn" onclick="addSingleWordFrom6000(${item.rank})">+ Add to Anki</button>
        </div>
      </div>
      <div style="margin-top:6px; font-size:13.5px; color:var(--text);"><b>Plain-English Pronunciation Guide:</b> <span style="color:var(--accent); font-weight:700;">${phon.plainGuide}</span></div>
      <div style="margin-top:4px; font-size:13px; color:var(--warn); font-weight:600;"><b>Pronunciation Tips:</b> ${phon.notes}</div>
      <div style="margin-top:4px; font-size:13px; color:var(--text-secondary);"><b>Grammar:</b> ${gram.summaryTag} — ${gram.usageNote}</div>
    `;
  }

  if (openSheetOnMobile && window.innerWidth <= 960) {
    openInspectorSheet();
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
    .replace(/\u0301/g, '');
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
      ? `Entries ${srsCatPage * pageSize + 1}–${Math.min(filtered.length, (srsCatPage + 1) * pageSize)} of ${filtered.length} verified words`
      : 'No matching entries';
  }

  const catalogEl = document.getElementById('srs-6000-catalog');
  if (!catalogEl) return;
  catalogEl.innerHTML = slice
    .map((w) => {
      const saved = inDeck.has(w.rank);
      const p = generateUkrainianPhonetics(w.ru);
      return `<div class="freq-row">
        <div onclick="inspectWordDeep(${w.rank}, true, true)" style="cursor:pointer; flex:1; min-width:190px;">
          <span class="tag">#${w.rank} • ${w.level}</span>
          <b style="font-size:17px; color:var(--text); margin-left:4px;">🔊 ${w.ru}</b>
          <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:13.5px; margin-left:6px;">${p.ipa}</span>
          <div style="color:var(--text-secondary); font-size:13.5px; margin-top:2px;"><b>${w.en}</b> <span style="opacity:0.8;">(${w.pos})</span></div>
          ${w.exUk ? `<div onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(w.exUk)}')" style="color:var(--text-secondary); font-size:12.5px; margin-top:3px; cursor:pointer;"><b>🔊 Example:</b> <span style="color:var(--accent); font-weight:600;">${w.exUk}</span>${w.exEn ? ` — <i>${w.exEn}</i>` : ''}</div>` : ''}
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${w.exUk ? `<button class="btn btn-sec" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(w.exUk)}')">🔊 Example</button>` : ''}
          <button class="btn btn-sec" onclick="inspectWordDeep(${w.rank}, true, true)">🔍 Grammar</button>
          <button class="btn btn-warn" onclick="speakExplanation(${w.rank})">🗣️ Explain</button>
          <button class="btn ${saved ? 'btn-sec' : ''}" onclick="addSingleWordFrom6000(${w.rank})" ${saved ? 'disabled' : ''}>${saved ? '✓ In Anki' : '+ Anki'}</button>
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

  const pageInfo = document.getElementById('phon-page-info');
  if (pageInfo) {
    pageInfo.innerText = filtered.length
      ? `Entries ${phonPage * pageSize + 1}–${Math.min(filtered.length, (phonPage + 1) * pageSize)} of ${filtered.length}`
      : 'No matching entries';
  }

  const listEl = document.getElementById('phon-6000-list');
  if (!listEl) return;
  listEl.innerHTML = slice
    .map((w) => {
      const p = generateUkrainianPhonetics(w.ru);
      return `<div class="freq-row" onclick="inspectWordDeep(${w.rank}, true, false)" style="cursor:pointer;">
        <div style="flex:1; min-width:190px;">
          <span class="tag">#${w.rank} • ${w.level}</span>
          <b style="font-size:17px; color:var(--text); margin-left:4px;">🔊 ${w.ru}</b>
          <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:13.5px; margin-left:6px;">${p.ipa}</span>
          <div style="color:var(--text-secondary); font-size:13px; margin-top:2px;"><b>${w.en}</b> — Sounds like: <b>${p.plainGuide}</b></div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-warn" onclick="event.stopPropagation(); speakExplanation(${w.rank})">🗣️ Explain</button>
          <button class="btn btn-sec" onclick="event.stopPropagation(); inspectWordDeep(${w.rank}, true, true)">🔍 Grammar</button>
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
// 4. CEFR UKRAINIAN COURSE (A0–C1, 16 STANDARDIZED MODULES)
// ============================================================================
let activeModId = COURSE_MODULES[0].id;
let activeStage = 0;
let activeCourseLevelFilter = 'ALL';

// Track answered questions so users cannot farm duplicate XP by clicking the same correct option repeatedly
const completedQuizKeys = new Set<string>();
const moduleExamAnswers = new Map<string, Map<number, boolean>>();

export function filterCourseByLevel(level: string): void {
  triggerHaptic('light');
  activeCourseLevelFilter = level;
  const visible = COURSE_MODULES.filter((m) =>
    level === 'ALL'
      ? true
      : level === 'B2-C1'
        ? m.level === 'B2' || m.level === 'C1'
        : m.level === level
  );
  if (visible.length && !visible.some((m) => m.id === activeModId)) {
    activeModId = visible[0].id;
    activeStage = 0;
  }
  renderCourseSyllabus();
  renderActiveModule();
}

export function selectCourseModule(modId: string): void {
  triggerHaptic('light');
  activeModId = modId;
  activeStage = 0;
  renderCourseSyllabus();
  renderActiveModule();
}

export function selectCourseStage(stageIdx: number): void {
  triggerHaptic('light');
  activeStage = stageIdx;
  renderActiveModule();
}

export function renderCourseSyllabus(): void {
  const gridEl = document.getElementById('module-grid');
  if (!gridEl) return;

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
      { id: 'ALL', label: `All ${COURSE_MODULES.length} Modules` },
      { id: 'A0', label: `A0 Foundations (${countA0})` },
      { id: 'A1', label: `A1 Beginner (${countA1})` },
      { id: 'A2', label: `A2 Elementary (${countA2})` },
      { id: 'B1', label: `B1 Intermediate (${countB1})` },
      { id: 'B2-C1', label: `B2–C1 Advanced (${countB2C1})` },
    ];
    filterBarEl.innerHTML = levels
      .map(
        (lvl) =>
          `<button class="stage-pill ${activeCourseLevelFilter === lvl.id ? 'active' : ''}" onclick="filterCourseByLevel('${lvl.id}')">${lvl.label}</button>`
      )
      .join('');
  }

  const visibleModules = COURSE_MODULES.filter((m) =>
    activeCourseLevelFilter === 'ALL'
      ? true
      : activeCourseLevelFilter === 'B2-C1'
        ? m.level === 'B2' || m.level === 'C1'
        : m.level === activeCourseLevelFilter
  );

  gridEl.innerHTML = visibleModules
    .map((m) => {
      const passed = db.passedMods.includes(m.id);
      return `
      <div class="module-card ${m.id === activeModId ? 'active' : ''}" onclick="selectCourseModule('${m.id}')">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:4px; flex-wrap:wrap;">
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">${m.id} • ${m.level}</span>
          ${
            passed
              ? `<span class="tag" style="background:var(--success-container); color:var(--success-on-container);">✓ Mastered</span>`
              : `<span style="font-size:11px; color:var(--muted); font-weight:700;">${m.topicTag.split('•')[1]?.trim() || m.level}</span>`
          }
        </div>
        <div style="font-weight:700; font-size:13.5px; margin-top:6px; line-height:1.3;">${m.title}</div>
      </div>
    `;
    })
    .join('');
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
    en: modVocabTuple ? modVocabTuple[2] : 'Course Vocabulary Item',
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
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">Course Inspector • ${m.id}</span>
      </div>
      <div style="font-size:28px; font-weight:800; color:var(--text); margin-top:8px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(synthItem.ru)}')">🔊 ${synthItem.ru}</div>
      <div style="font-size:13.5px; color:var(--text-secondary);">Sounds like: <b>${phon.plainGuide}</b> <span style="color:var(--accent); font-family:ui-monospace, monospace;">${phon.ipa}</span></div>
      <div style="font-size:18px; font-weight:800; color:var(--success); margin:6px 0;">${synthItem.en}</div>
      ${gram.tableHtml}
    `;
  }
  if (typeof window !== 'undefined' && window.innerWidth <= 960) {
    openInspectorSheet();
  }
  speakUkrainian(rawWord);
}

export function jumpToLessonSection(sectionId: string): void {
  triggerHaptic('light');
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

export function addModuleVocabToFSRS(modId: string): void {
  triggerHaptic('heavy');
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  let added = 0;
  for (const [uk] of m.vocab) {
    const cleanTarget = uk.replace(/\u0301/g, '').toLowerCase().trim();
    const lemmaTarget = cleanTarget
      .replace(/\s*\(.*?\)/g, '')
      .split(/\s*[\/,]\s*/)[0]
      .trim();
    const matched =
      FREQ_6000_DB.find(
        (w) => w.ru.replace(/\u0301/g, '').toLowerCase().trim() === cleanTarget
      ) ||
      FREQ_6000_DB.find((w) => {
        const wClean = w.ru.replace(/\u0301/g, '').toLowerCase().trim();
        const wLemma = wClean
          .replace(/\s*\(.*?\)/g, '')
          .split(/\s*[\/,]\s*/)[0]
          .trim();
        return wClean === lemmaTarget || wLemma === lemmaTarget;
      });
    if (matched && !db.cards.some((c) => c.rank === matched.rank)) {
      db.cards.push(createCardRecord(matched.rank));
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
  renderActiveModule();
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

export function renderActiveModule(): void {
  const modIndex = COURSE_MODULES.findIndex((x) => x.id === activeModId);
  const m: CourseModule =
    modIndex >= 0 ? COURSE_MODULES[modIndex] : COURSE_MODULES[0];
  const prevMod = modIndex > 0 ? COURSE_MODULES[modIndex - 1] : null;
  const nextMod =
    modIndex >= 0 && modIndex < COURSE_MODULES.length - 1
      ? COURSE_MODULES[modIndex + 1]
      : null;

  const levelEl = document.getElementById('active-mod-level');
  const refEl = document.getElementById('active-mod-ref');
  const titleEl = document.getElementById('active-mod-title');
  if (levelEl) levelEl.innerText = `${m.id} • CEFR ${m.level}`;
  if (refEl) refEl.innerText = m.topicTag;
  if (titleEl) titleEl.innerText = m.title;

  const stages = [
    '1. Lesson & Dialogue',
    `2. Check (${m.cfu.length})`,
    `3. Practice (${m.practice.length})`,
    `4. Vocab (${m.vocab.length})`,
    `5. Mastery Exam (${m.exam.length})`,
  ];
  const stageBar = document.getElementById('stage-bar');
  if (stageBar) {
    stageBar.innerHTML = stages
      .map(
        (s, i) => `
      <div class="stage-pill ${i === activeStage ? 'active' : ''}" onclick="selectCourseStage(${i})">${s}</div>
    `
      )
      .join('');
  }

  const box = document.getElementById('stage-content');
  if (!box) return;

  const modNavFooter = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-top:16px; padding-top:12px; border-top:1px solid var(--border-subtle);">
      ${
        prevMod
          ? `<button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="selectCourseModule('${prevMod.id}')">← Prev: ${prevMod.id} (${prevMod.title})</button>`
          : `<span style="font-size:12px; color:var(--muted); font-weight:700;">Start of Course (Module 1 of ${COURSE_MODULES.length})</span>`
      }
      ${
        nextMod
          ? `<button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="selectCourseModule('${nextMod.id}')">Next Module: ${nextMod.id} (${nextMod.title}) →</button>`
          : `<span style="font-size:12px; color:var(--muted); font-weight:700;">Final Module (${COURSE_MODULES.length} of ${COURSE_MODULES.length})</span>`
      }
    </div>
  `;

  if (activeStage === 0) {
    if (m.structuredLesson) {
      const sl = m.structuredLesson as StructuredCourseLesson;
      const jumpSections = [
        { id: 'sec-learn', label: "A. What You'll Learn" },
        { id: 'sec-big-idea', label: 'B. The Big Idea' },
        { id: 'sec-action', label: 'C. See It in Action' },
        { id: 'sec-pattern', label: 'D. Visual Patterns & Tables' },
        { id: 'sec-steps', label: 'E. Step-by-Step Rules' },
        { id: 'sec-more-ex', label: 'F. More Examples' },
        { id: 'sec-exceptions', label: 'G. Exceptions' },
        { id: 'sec-mistakes', label: 'H. Common Mistakes' },
        { id: 'sec-inline-check', label: 'I. Practice It' },
        { id: 'sec-dialogue', label: 'J. In Real Life' },
        { id: 'sec-reference', label: 'K. Complete Reference' },
        { id: 'sec-remember', label: 'L. What to Remember' },
      ];

      box.innerHTML = `
        <div style="line-height:1.65; font-size:14.5px;">
          <div class="vc-jump-bar" aria-label="Lesson Section Outline">
            <span style="font-size:11.5px; font-weight:800; color:var(--text); align-self:center; margin-right:4px;">📑 Jump to Section:</span>
            ${jumpSections
              .map(
                (sec) =>
                  `<button type="button" class="vc-jump-btn" onclick="jumpToLessonSection('${sec.id}')">${sec.label}</button>`
              )
              .join('')}
          </div>

          <!-- A. WHAT YOU'LL LEARN -->
          <div id="sec-learn" class="vc-section-block" style="background:var(--surface-2); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <b style="color:var(--accent); font-size:15.5px;">🎯 A. What You’ll Learn in ${m.id}</b>
              <button type="button" class="btn btn-warn" style="min-height:34px; padding:4px 12px; font-size:12px;" onclick="speakCourseOverview('${m.id}')">🗣️ Listen to Overview</button>
            </div>
            <div style="font-size:12.5px; color:var(--text-secondary); font-weight:700; margin-bottom:6px;">By the end of this lesson, you will be able to:</div>
            <ul style="margin:0 0 10px 18px; padding:0; color:var(--text); font-size:13.8px;">
              ${m.objectives.map((obj) => `<li style="margin-bottom:5px;">${obj}</li>`).join('')}
            </ul>
            <p style="margin:0 0 10px 0; color:var(--text-secondary); font-size:13.8px;">${m.summary}</p>
            <div style="display:flex; flex-wrap:wrap; gap:6px; padding-top:8px; border-top:1px solid var(--border-subtle); font-size:12px;">
              ${sl.prerequisites
                .map(
                  (pr) =>
                    `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary);">🧭 ${pr.label}</span>`
                )
                .join('')}
              ${sl.relatedTopics
                .map(
                  (rt) =>
                    `<span class="tag" style="background:var(--surface-1); color:var(--accent);">${rt}</span>`
                )
                .join('')}
            </div>
          </div>

          <!-- B. THE BIG IDEA -->
          <div id="sec-big-idea" class="vc-section-block">
            <div class="vc-section-heading">
              <span>💡 B. The Big Idea: ${sl.bigIdea.headline}</span>
            </div>
            <div style="background:var(--surface-2); border:1px solid var(--border-subtle); border-left:4px solid var(--accent); border-radius:var(--radius-md); padding:13px 15px;">
              <p style="margin:0 0 8px 0; font-size:14px; color:var(--text);">${sl.bigIdea.plainEnglish}</p>
              <p style="margin:0 0 8px 0; font-size:13.5px; color:var(--text-secondary);"><b>🇺🇸 How It Compares to English:</b> ${sl.bigIdea.englishComparison}</p>
              <div style="background:var(--surface-1); padding:9px 12px; border-radius:var(--radius-sm); font-size:13px; color:var(--accent); font-weight:700;">
                🔑 Study Strategy: ${sl.bigIdea.keyInsight}
              </div>
            </div>
          </div>

          <!-- C. SEE IT IN ACTION -->
          <div id="sec-action" class="vc-section-block">
            <div class="vc-section-heading">
              <span>👀 C. See It in Action (Tap Any Sentence or Word to Hear & Inspect)</span>
            </div>
            ${sl.seeItInAction.map((ex) => renderExampleBreakdown(ex)).join('')}
          </div>

          <!-- D. UNDERSTAND THE PATTERN (TABLES & DIAGRAMS) -->
          <div id="sec-pattern" class="vc-section-block">
            <div class="vc-section-heading">
              <span>📊 D. Understand the Pattern (Visual Tables & Sound Maps)</span>
            </div>
            ${sl.patternTables.map((tb) => renderGrammarTable(tb)).join('')}
            ${(sl.declensions || []).map((dc) => renderDeclensionExplorer(dc)).join('')}
            ${(sl.conjugations || []).map((cj) => renderConjugationExplorer(cj)).join('')}
            ${(sl.aspectTimelines || []).map((at) => renderAspectTimeline(at)).join('')}
            ${(sl.diagrams || []).map((dg) => renderGrammarDiagram(dg)).join('')}
          </div>

          <!-- E. STEP-BY-STEP EXPLANATION -->
          <div id="sec-steps" class="vc-section-block">
            <div class="vc-section-heading">
              <span>🪜 E. Step-by-Step Explanation</span>
              <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="speakAllCourseRules('${m.id}')">🔊 Listen to All Steps</button>
            </div>
            ${sl.stepByStep.map((step) => renderRuleAndException(step)).join('')}
          </div>

          <!-- F. MORE EXAMPLES -->
          <div id="sec-more-ex" class="vc-section-block">
            <div class="vc-section-heading">
              <span>🔍 F. More Examples by Pattern</span>
            </div>
            ${sl.moreExamples
              .map(
                (grp) => `
              <div style="margin-bottom:12px;">
                <div style="font-weight:800; font-size:14px; color:var(--text); margin-bottom:2px;">${grp.groupTitle}</div>
                <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:8px;">${grp.groupNote}</div>
                ${grp.items.map((item) => renderExampleBreakdown(item)).join('')}
              </div>
            `
              )
              .join('')}
          </div>

          <!-- G. IMPORTANT EXCEPTIONS -->
          <div id="sec-exceptions" class="vc-section-block">
            <div class="vc-section-heading">
              <span>⚡ G. Important Exceptions & Natural Speech Details</span>
            </div>
            ${sl.importantExceptions
              .map(
                (exc) => `
              <div class="vc-exception-box" style="margin-bottom:10px;">
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

          <!-- H. COMMON ENGLISH-SPEAKER MISTAKES -->
          <div id="sec-mistakes" class="vc-section-block">
            <div class="vc-section-heading">
              <span>🛠️ H. Common English-Speaker Mistakes (And How to Avoid Them)</span>
            </div>
            ${sl.commonMistakes.map((cm) => renderCommonMistake(cm)).join('')}
          </div>

          <!-- I. PRACTICE IT (INLINE KNOWLEDGE CHECKS) -->
          <div id="sec-inline-check" class="vc-section-block">
            ${renderInlineKnowledgeCheckSection(m, sl)}
          </div>

          <!-- J. IN REAL LIFE (DIALOGUE) -->
          <div id="sec-dialogue" class="vc-section-block">
            <div class="vc-section-heading">
              <span>💬 J. In Real Life: ${m.dialogue.title}</span>
              <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="speakCourseDialogue('${m.id}')">🔊 Listen to Full Dialogue</button>
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">${sl.dialogueContextNote}</div>
            <div style="background:var(--surface-2); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
              ${m.dialogue.lines
                .map(
                  (line) => `
                <div style="padding:9px 11px; border-radius:var(--radius-sm); background:var(--surface-1); margin-bottom:8px; cursor:pointer; border:1px solid var(--border-subtle);" onclick="speakUkrainian('${escapeSingleQuotes(line.uk)}')">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:0.03em;">${line.speaker}</span>
                    <button type="button" class="vc-audio-mini" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(line.uk)}')">🔊 Hear Line</button>
                  </div>
                  <div style="font-weight:800; font-size:15.5px; color:var(--text); margin-top:3px;">${line.uk}</div>
                  <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">${line.en}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- K. COMPLETE REFERENCE (EXPANDABLE DEEP DIVE) -->
          <div id="sec-reference" class="vc-section-block">
            <div class="vc-section-heading">
              <span>📚 K. Complete Linguistic Reference</span>
            </div>
            ${renderLessonReference(sl.completeReference)}
          </div>

          <!-- L. WHAT TO REMEMBER & ACTIVE RECALL -->
          <div id="sec-remember" class="vc-section-block">
            <div class="vc-section-heading">
              <span>📌 L. What to Remember & Active Recall</span>
              <button type="button" class="btn btn-warn" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="playBilingualOpenAI('${escapeSingleQuotes(m.reviewSummary)}', 'en')">🔊 Listen Summary</button>
            </div>
            <div style="background:var(--accent-container); color:var(--accent-on-container); padding:13px 15px; border-radius:var(--radius-md); margin-bottom:12px;">
              <ul style="margin:0 0 0 18px; padding:0; font-size:13.5px; font-weight:600;">
                ${sl.whatToRemember.map((item) => `<li style="margin-bottom:5px;">${item}</li>`).join('')}
              </ul>
            </div>

            <div style="font-weight:800; font-size:14px; color:var(--text); margin-bottom:8px;">⚡ Self-Test Flashcards (Tap to Reveal Ukrainian):</div>
            <div style="display:grid; gap:8px; margin-bottom:14px;">
              ${m.activeRecall
                .map(
                  (ar) => `
                <details style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                  <summary style="cursor:pointer; font-weight:700; font-size:13.5px; color:var(--text);">❓ How do you say "${ar.promptEn}" in Ukrainian? <span style="color:var(--muted); font-weight:500; font-size:12px;">(Hint: ${ar.hint})</span></summary>
                  <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <b style="color:var(--success); font-size:15px;">✅ ${ar.answerUk}</b>
                    <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="inspectCourseWord('${escapeSingleQuotes(ar.answerUk)}')">🔊 Hear & Inspect</button>
                  </div>
                </details>
              `
                )
                .join('')}
            </div>

            <button class="btn" style="width:100%;" onclick="selectCourseStage(1)">Continue to Stage 2 — Knowledge Check (${m.cfu.length} Questions) →</button>
            ${modNavFooter}
          </div>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div style="line-height:1.65; font-size:14.5px;">
          <div style="background:var(--surface-2); padding:14px; border-radius:var(--radius-md); margin-bottom:14px; border:1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
              <b style="color:var(--accent); font-size:15px;">🎯 Learning Objectives & Overview</b>
              <button class="btn btn-warn" style="min-height:34px; padding:4px 12px; font-size:12px;" onclick="speakCourseOverview('${m.id}')">🗣️ Listen to Overview</button>
            </div>
            <ul style="margin:0 0 10px 18px; padding:0; color:var(--text); font-size:13.5px;">
              ${m.objectives.map((obj) => `<li style="margin-bottom:4px;">${obj}</li>`).join('')}
            </ul>
            <p style="margin:0; color:var(--text-secondary); font-size:14px;">${m.summary}</p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin:14px 0 8px 0;">
            <h3 style="font-size:16px; margin:0; color:var(--text);">Step-by-Step Core Concepts:</h3>
            <button class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12px;" onclick="speakAllCourseRules('${m.id}')">🔊 Listen to All Concepts</button>
          </div>
          ${m.rules
            .map(
              (r, idx) =>
                `<div style="padding:11px 13px; background:var(--surface-2); border-radius:var(--radius-sm); margin-bottom:8px; border-left:3px solid var(--accent); font-size:13.8px; cursor:pointer;" onclick="speakCourseRule('${m.id}', ${idx})">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                    <div style="flex:1;">${r}</div>
                    <button type="button" class="btn btn-warn" style="min-height:32px; padding:4px 10px; font-size:11.5px; flex-shrink:0;" onclick="event.stopPropagation(); speakCourseRule('${m.id}', ${idx})">🔊 Listen</button>
                  </div>
                </div>`
            )
            .join('')}

          <h3 style="font-size:16px; margin:16px 0 8px 0; color:var(--text);">Worked Examples (Tap to Hear Ukrainian Audio):</h3>
          ${m.examples
            .map(
              (ex) => `
            <div class="example-chip" onclick="speakUkrainian('${escapeSingleQuotes(ex.uk)}')">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div style="flex:1;">
                  <div style="font-weight:800; font-size:15.5px; color:var(--text);">🔊 ${ex.uk}</div>
                  <div style="color:var(--text-secondary); font-size:13px; margin-top:3px;">${ex.en}</div>
                </div>
                <button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px; flex-shrink:0;" onclick="event.stopPropagation(); playBilingualOpenAI('${escapeSingleQuotes(`${ex.uk} ${ex.en}`)}', 'uk')">🗣️ UK + EN</button>
              </div>
            </div>
          `
            )
            .join('')}

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin:18px 0 8px 0;">
            <h3 style="font-size:16px; margin:0; color:var(--text);">💬 Real-Life Dialogue: ${m.dialogue.title}</h3>
            <button type="button" class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12px;" onclick="speakCourseDialogue('${m.id}')">🔊 Listen to Dialogue</button>
          </div>
          <div style="background:var(--surface-2); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:14px;">
            ${m.dialogue.lines
              .map(
                (line) => `
              <div style="padding:8px 10px; border-radius:var(--radius-sm); background:var(--surface-1); margin-bottom:8px; cursor:pointer; border:1px solid var(--border-subtle);" onclick="speakUkrainian('${escapeSingleQuotes(line.uk)}')">
                <div style="font-size:12px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:0.03em;">${line.speaker}</div>
                <div style="font-weight:700; font-size:15px; color:var(--text); margin-top:2px;">🔊 ${line.uk}</div>
                <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">${line.en}</div>
              </div>
            `
              )
              .join('')}
          </div>

          <h3 style="font-size:16px; margin:16px 0 8px 0; color:var(--text);">⚡ Quick Active Recall Check (Tap to Reveal):</h3>
          <div style="display:grid; gap:8px; margin-bottom:14px;">
            ${m.activeRecall
              .map(
                (ar) => `
              <details style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <summary style="cursor:pointer; font-weight:700; font-size:13.5px; color:var(--text);">❓ ${ar.promptEn} <span style="color:var(--muted); font-weight:500; font-size:12px;">(Hint: ${ar.hint})</span></summary>
                <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <b style="color:var(--success); font-size:15px;">✅ ${ar.answerUk}</b>
                  <button class="btn btn-sec" style="min-height:32px; padding:4px 10px; font-size:12px;" onclick="speakUkrainian('${escapeSingleQuotes(ar.answerUk)}')">🔊 Hear</button>
                </div>
              </details>
            `
              )
              .join('')}
          </div>

          <div style="background:var(--accent-container); color:var(--accent-on-container); padding:12px 14px; border-radius:var(--radius-md); font-size:13.5px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="flex:1;"><b>📌 Key Takeaway:</b> ${m.reviewSummary}</div>
            <button type="button" class="btn btn-warn" style="min-height:32px; padding:4px 10px; font-size:11.5px; flex-shrink:0;" onclick="playBilingualOpenAI('${escapeSingleQuotes(m.reviewSummary)}', 'en')">🔊 Listen</button>
          </div>

          <button class="btn" style="width:100%;" onclick="selectCourseStage(1)">Next: Stage 2 — Knowledge Check →</button>
          ${modNavFooter}
        </div>`;
    }
  } else if (activeStage === 1) {
    box.innerHTML = renderStage2CheckView(m);
  } else if (activeStage === 2) {
    box.innerHTML = renderStage3PracticeView(m);
  } else if (activeStage === 3) {
    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
        <p style="margin:0; font-size:13.5px; color:var(--text-secondary);">Tap any vocabulary word from <b>${m.id} (${m.title})</b> to hear its Ukrainian pronunciation or inspect its 7-case forms:</p>
        <button type="button" class="btn btn-success" style="min-height:34px; padding:5px 12px; font-size:12px;" onclick="addModuleVocabToFSRS('${m.id}')">+ Add Module Words to FSRS Deck</button>
      </div>
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
          <div class="freq-row" onclick="inspectCourseWord('${escapeSingleQuotes(uk)}')" style="cursor:pointer;">
            <div style="flex:1; min-width:190px;">
              <span class="tag">${pos}</span>
              <b style="font-size:17px; color:var(--text); margin-left:4px;">🔊 ${uk}</b>
              <span style="color:var(--accent); font-family:ui-monospace, SFMono-Regular, monospace; font-size:13.5px; margin-left:6px;">${p.ipa}</span>
              <div style="color:var(--success); font-weight:700; font-size:14px; margin-top:2px;">${en} <span style="color:var(--text-secondary); font-weight:500; font-size:12.5px;">(Sounds like: ${p.plainGuide})</span></div>
              ${
                exUk
                  ? `<div onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(exUk)}')" style="color:var(--text-secondary); font-size:12.5px; margin-top:4px; padding:4px 8px; background:var(--surface-2); border-radius:var(--radius-xs); display:inline-block; border:1px solid var(--border-subtle);" title="Tap to hear Ukrainian example sentence"><b>🔊 Example:</b> <span style="color:var(--text); font-weight:600;">${exUk}</span> — <i>${exEn || ''}</i></div>`
                  : ''
              }
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="event.stopPropagation(); inspectCourseWord('${escapeSingleQuotes(uk)}')">🔍 7-Case</button>
              ${
                exUk
                  ? `<button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(exUk)}')">🔊 Example</button>`
                  : ''
              }
              <button type="button" class="btn btn-warn" style="min-height:36px; padding:6px 12px; font-size:12px;" onclick="event.stopPropagation(); playBilingualOpenAI('${escapeSingleQuotes(gram.spokenSummary)}', 'en')">🗣️ Explain</button>
            </div>
          </div>`;
        })
        .join('')}
      <button class="btn" style="width:100%; margin-top:12px;" onclick="selectCourseStage(4)">Start Stage 5 — Module Mastery Exam (${m.exam.length} Questions) →</button>
    `;
  } else {
    box.innerHTML = renderStage5ExamView(m);
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

      let bg = 'var(--surface-1)';
      let color = 'var(--text-secondary)';
      let border = isCurrent ? '2px solid var(--accent)' : '1px solid var(--border-subtle)';
      let suffix = '';

      if (isAnswered) {
        if (revealCorrectness) {
          if (sel === ans) {
            bg = 'var(--success-container)';
            color = 'var(--success-on-container)';
            suffix = '✓';
          } else {
            bg = 'var(--danger-container, #fee2e2)';
            color = 'var(--danger, #dc2626)';
            suffix = '✗';
          }
        } else {
          bg = 'var(--accent-container)';
          color = 'var(--accent-on-container)';
          suffix = '•';
        }
      }

      return `<button type="button" onclick="jumpToAssessmentQuestion('${modId}', '${stageKey}', ${idx})" style="min-width:34px; height:28px; padding:0 6px; border-radius:var(--radius-xs); font-size:11.5px; font-weight:800; cursor:pointer; background:${bg}; color:${color}; border:${border};">${idx + 1}${suffix}</button>`;
    })
    .join('');

  return `
    <div style="display:flex; flex-wrap:wrap; gap:5px; max-height:132px; overflow-y:auto; padding:8px; background:var(--surface-1); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-top:8px;">
      ${buttons}
    </div>
  `;
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
    <div class="vc-section-heading" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span>✏️ I. Practice It Right Now (Quick Interactive Checks — ${checks.length} Questions)</span>
      <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
        Answered: ${stats.answered} / ${stats.total} • Correct: ${stats.correct} / ${stats.total}
      </span>
    </div>
    <div style="background:var(--surface-2); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="stage-pill ${attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'inlineChecks', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'inlineChecks', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'inlineChecks', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        ${
          pendingResetConfirmKey === resetKey
            ? `<div style="display:flex; gap:6px; align-items:center;">
                <span style="font-size:12px; color:var(--danger); font-weight:700;">Clear all ${stats.answered} answers?</span>
                <button type="button" class="btn btn-warn" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="confirmResetAssessmentStage('${m.id}', 'inlineChecks')">Yes, Reset</button>
                <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="cancelResetAssessmentStage()">Cancel</button>
              </div>`
            : `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="requestResetAssessmentStage('${m.id}', 'inlineChecks')">🔄 Reset Checks</button>`
        }
      </div>
    </div>
    ${
      visibleIndices.length === 0
        ? `<div class="card" style="background:var(--surface-2); box-shadow:none; text-align:center; padding:16px; font-weight:700; color:var(--text-secondary);">No questions match the current filter (${attempt.filterMode}). <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px; margin-left:8px;" onclick="setAssessmentFilter('${m.id}', 'inlineChecks', 'all')">Show All ${stats.total} Questions</button></div>`
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
  const curIdx = Math.min(Math.max(0, attempt.currentIndex || 0), Math.max(0, questions.length - 1));
  attempt.currentIndex = curIdx;

  let visibleIndices = questions.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter((idx) => typeof attempt.selectedOptions[idx] !== 'number');
  } else if (attempt.filterMode === 'incorrect') {
    visibleIndices = visibleIndices.filter(
      (idx) =>
        typeof attempt.selectedOptions[idx] === 'number' &&
        attempt.selectedOptions[idx] !== questions[idx].ans
    );
  }

  const headerHtml = `
    <div style="background:var(--surface-2); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
        <div>
          <b style="font-size:15px; color:var(--text);">Stage 2 — Knowledge Check (${stats.total} Questions)</b>
          <div style="font-size:12.5px; color:var(--text-secondary);">Question ${curIdx + 1} of ${stats.total} • Answered: <b>${stats.answered}/${stats.total}</b> • Unanswered: <b>${stats.unanswered}</b></div>
        </div>
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
          Correct: ${stats.correct} / ${stats.total} (${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
        </span>
      </div>
      <div style="height:7px; background:var(--surface-1); border-radius:999px; overflow:hidden; margin-bottom:10px;">
        <div style="height:100%; width:${stats.percentAnswered}%; background:var(--accent); transition:width 0.2s ease;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'cfu', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${m.id}', 'cfu')">Single Focus (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'cfu', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'cfu', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'cfu', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'cfu', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            pendingResetConfirmKey === resetKey
              ? `<span style="font-size:12px; color:var(--danger); font-weight:700;">Reset ${stats.answered} answers?</span>
                 <button type="button" class="btn btn-warn" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="confirmResetAssessmentStage('${m.id}', 'cfu')">Confirm Reset</button>
                 <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="requestResetAssessmentStage('${m.id}', 'cfu')">🔄 Reset</button>`
          }
        </div>
      </div>
      ${renderQuestionJumpStrip(m.id, 'cfu', questions, attempt, true)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="card" style="background:var(--surface-2); box-shadow:none; text-align:center; padding:18px; font-weight:700; color:var(--text-secondary);">No questions match this filter. <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px; margin-left:8px;" onclick="setAssessmentFilter('${m.id}', 'cfu', 'all')">Show All ${stats.total} Questions</button></div>`
      : visibleIndices
          .map((idx) => {
            const c = questions[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === c.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              c.inputMode === 'text'
                ? `<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:8px 0 10px 0;">
                    <input
                      type="text"
                      id="cfu-text-input-${m.id}-${idx}"
                      class="input-box"
                      style="flex:1; min-width:190px; margin:0; padding:8px 11px; font-size:13.5px;"
                      placeholder="${escapeSingleQuotes(c.hintUk ? `Type answer (Hint: ${c.hintUk})...` : 'Type your Ukrainian or phonetic answer...')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${m.id}', 'cfu', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="submitStageAssessmentText('${m.id}', 'cfu', ${idx})">✍️ Check Typed Answer</button>
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

            return `
              <div class="card" id="cfu-card-${m.id}-${idx}" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                  <span class="tag" style="background:var(--surface-1); color:var(--accent); font-weight:800;">Check ${idx + 1} of ${stats.total}</span>
                  <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    ${c.topic ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">${c.topic}</span>` : ''}
                    ${c.difficultyTier ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">Tier ${c.difficultyTier}/5</span>` : ''}
                    ${c.audioUk ? `<button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(c.audioUk)}')">🔊 Audio</button>` : ''}
                  </div>
                </div>
                <div style="font-weight:700; margin-bottom:8px;">Check ${idx + 1}: ${c.q}</div>
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
                    return `
                      <button class="option-btn ${stateClass}" onclick="handleCourseOptionTap(this, ${oIdx === c.ans}, 'cfu-exp-${idx}', '${m.id}:cfu:${idx}', ${oIdx})">${opt}</button>
                    `;
                  })
                  .join('')}
                <div id="cfu-exp-${idx}" class="${hasSaved ? '' : 'hidden'}" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
                  <div id="cfu-exp-body-${idx}">${feedbackHtml}</div>
                  <div style="margin-top:6px; display:flex; gap:8px; flex-wrap:wrap;">
                    ${c.audioUk ? `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(c.audioUk)}')">🔊 Hear Ukrainian</button>` : ''}
                    <button type="button" class="btn btn-warn" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="playBilingualOpenAI('${escapeSingleQuotes(c.exp)}', 'en')">🗣️ Hear Explanation</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');

  return (
    headerHtml +
    cardsHtml +
    `<button class="btn" style="width:100%;" onclick="selectCourseStage(2)">Next: Stage 3 — Guided Practice Drills (${m.practice.length} Questions) →</button>`
  );
}

function renderStage3PracticeView(m: CourseModule): string {
  const attempt = getStageAttempt(m.id, 'practice');
  const drills = m.practice as EnrichedPracticeDrill[];
  const stats = computeStageStats(drills, attempt);
  const focusKey = `${m.id}:practice`;
  const isSingleFocus = Boolean(singleFocusModeByKey[focusKey]);
  const resetKey = `${m.id}:practice`;
  const curIdx = Math.min(Math.max(0, attempt.currentIndex || 0), Math.max(0, drills.length - 1));
  attempt.currentIndex = curIdx;

  let visibleIndices = drills.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter((idx) => typeof attempt.selectedOptions[idx] !== 'number');
  } else if (attempt.filterMode === 'incorrect') {
    visibleIndices = visibleIndices.filter(
      (idx) =>
        typeof attempt.selectedOptions[idx] === 'number' &&
        attempt.selectedOptions[idx] !== drills[idx].ans
    );
  }

  const headerHtml = `
    <div style="background:var(--surface-2); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
        <div>
          <b style="font-size:15px; color:var(--text);">Stage 3 — Guided Practice Drills (${stats.total} Questions)</b>
          <div style="font-size:12.5px; color:var(--text-secondary);">Question ${curIdx + 1} of ${stats.total} • Answered: <b>${stats.answered}/${stats.total}</b> • Unanswered: <b>${stats.unanswered}</b></div>
        </div>
        <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
          Correct: ${stats.correct} / ${stats.total} (${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
        </span>
      </div>
      <div style="height:7px; background:var(--surface-1); border-radius:999px; overflow:hidden; margin-bottom:10px;">
        <div style="height:100%; width:${stats.percentAnswered}%; background:var(--accent); transition:width 0.2s ease;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'practice', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${m.id}', 'practice')">Single Focus (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'practice', 'unanswered')">Unanswered (${stats.unanswered})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'practice', 'incorrect')">Missed (${stats.incorrect})</button>
        </div>
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'practice', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'practice', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            pendingResetConfirmKey === resetKey
              ? `<span style="font-size:12px; color:var(--danger); font-weight:700;">Reset ${stats.answered} answers?</span>
                 <button type="button" class="btn btn-warn" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="confirmResetAssessmentStage('${m.id}', 'practice')">Confirm Reset</button>
                 <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="requestResetAssessmentStage('${m.id}', 'practice')">🔄 Reset</button>`
          }
        </div>
      </div>
      ${renderQuestionJumpStrip(m.id, 'practice', drills, attempt, true)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="card" style="background:var(--surface-2); box-shadow:none; text-align:center; padding:18px; font-weight:700; color:var(--text-secondary);">No practice drills match this filter. <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px; margin-left:8px;" onclick="setAssessmentFilter('${m.id}', 'practice', 'all')">Show All ${stats.total} Drills</button></div>`
      : visibleIndices
          .map((idx) => {
            const p = drills[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === p.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              p.inputMode === 'text'
                ? `<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:8px 0 10px 0;">
                    <input
                      type="text"
                      id="prac-text-input-${m.id}-${idx}"
                      class="input-box"
                      style="flex:1; min-width:190px; margin:0; padding:8px 11px; font-size:13.5px;"
                      placeholder="${escapeSingleQuotes(p.hintUk ? `Type answer (Hint: ${p.hintUk})...` : 'Type your Ukrainian or phonetic answer...')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${m.id}', 'practice', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="submitStageAssessmentText('${m.id}', 'practice', ${idx})">✍️ Check Typed Answer</button>
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

            return `
              <div class="card" id="prac-card-${m.id}-${idx}" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                  <span class="tag" style="background:var(--surface-1); color:var(--accent); font-weight:800;">Practice ${idx + 1} of ${stats.total}</span>
                  <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    ${p.topic ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">${p.topic}</span>` : ''}
                    ${p.difficultyTier ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">Tier ${p.difficultyTier}/5</span>` : ''}
                    ${p.audioUk ? `<button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(p.audioUk)}')">🔊 Audio</button>` : ''}
                  </div>
                </div>
                <div style="font-weight:700; margin-bottom:8px;">Practice ${idx + 1}: ${p.prompt}</div>
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
                    return `
                      <button class="option-btn ${stateClass}" onclick="handlePracticeOptionTap(this, ${oIdx === p.ans}, 'prac-exp-${idx}', '${m.id}:prac:${idx}', '${escapeSingleQuotes(p.audioUk)}', ${oIdx})">${opt}</button>
                    `;
                  })
                  .join('')}
                <div id="prac-exp-${idx}" class="${hasSaved ? '' : 'hidden'}" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--accent);">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                    <div style="font-weight:700; color:var(--accent); cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(p.audioUk)}')">🔊 ${p.audioUk}</div>
                    <button type="button" class="btn btn-warn" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="playBilingualOpenAI('${escapeSingleQuotes(`${p.audioUk}. ${p.exp}`)}', 'uk')">🗣️ Hear Explanation</button>
                  </div>
                  <div id="prac-exp-body-${idx}">${feedbackHtml}</div>
                </div>
              </div>
            `;
          })
          .join('');

  return (
    headerHtml +
    cardsHtml +
    `<button class="btn" style="width:100%;" onclick="selectCourseStage(3)">Next: Stage 4 — Essential Vocabulary (${m.vocab.length} Words) →</button>`
  );
}

function renderStage5ExamView(m: CourseModule): string {
  const attempt = getStageAttempt(m.id, 'exam');
  const examQuestions = m.exam as EnrichedCourseQuestion[];
  const stats = computeStageStats(examQuestions, attempt);
  const scoreSummary = calculateExamScore(examQuestions, attempt.selectedOptions);
  const isSubmitted = Boolean(attempt.submitted);
  const isPassed = db.passedMods.includes(m.id) || (isSubmitted && scoreSummary.passed);
  const focusKey = `${m.id}:exam`;
  const isSingleFocus = Boolean(singleFocusModeByKey[focusKey]);
  const resetKey = `${m.id}:exam`;
  const curIdx = Math.min(Math.max(0, attempt.currentIndex || 0), Math.max(0, examQuestions.length - 1));
  attempt.currentIndex = curIdx;

  let visibleIndices = examQuestions.map((_, idx) => idx);
  if (isSingleFocus) {
    visibleIndices = [curIdx];
  } else if (attempt.filterMode === 'unanswered') {
    visibleIndices = visibleIndices.filter((idx) => typeof attempt.selectedOptions[idx] !== 'number');
  } else if (attempt.filterMode === 'incorrect' && isSubmitted) {
    visibleIndices = visibleIndices.filter(
      (idx) => attempt.selectedOptions[idx] !== examQuestions[idx].ans
    );
  }

  const submitConfirmBanner =
    pendingExamSubmitModId === m.id && !isSubmitted
      ? `<div style="margin-top:10px; padding:12px; background:var(--surface-1); border:2px solid var(--accent); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="font-size:13px; font-weight:700; color:var(--text);">
            ⚠️ You have <b>${stats.unanswered} unanswered question(s)</b> out of ${stats.total}. Submit now and grade all ${stats.total} questions?
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-success" style="min-height:34px; padding:5px 12px; font-size:12.5px;" onclick="submitModuleExam('${m.id}', true)">✅ Confirm & Grade Exam</button>
            <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:12.5px;" onclick="setAssessmentFilter('${m.id}', 'exam', 'unanswered')">🔍 Review Unanswered (${stats.unanswered})</button>
            <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:12.5px;" onclick="cancelSubmitModuleExam()">Cancel</button>
          </div>
        </div>`
      : '';

  const postSubmitSummaryBanner = isSubmitted
    ? `<div style="margin-top:10px; padding:12px 14px; background:${scoreSummary.passed ? 'var(--success-container)' : 'var(--surface-1)'}; color:${scoreSummary.passed ? 'var(--success-on-container)' : 'var(--text)'}; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-size:15px; font-weight:800;">
            ${scoreSummary.passed ? '🏆 Module Exam Passed & Mastered!' : '📋 Exam Completed — Review Missed Questions Below'}
          </div>
          <div style="font-size:13px; margin-top:2px;">
            Final Score: <b>${scoreSummary.correctCount} / ${scoreSummary.totalQuestions} (${scoreSummary.percentage}%)</b> • Required for Mastery: <b>${scoreSummary.passThreshold} / ${scoreSummary.totalQuestions} (80%)</b> • Missed/Unanswered: <b>${scoreSummary.totalQuestions - scoreSummary.correctCount}</b>
          </div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:12px;" onclick="setAssessmentFilter('${m.id}', 'exam', 'incorrect')">🔍 Review Incorrect Only (${scoreSummary.totalQuestions - scoreSummary.correctCount})</button>
          <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:12px;" onclick="setAssessmentFilter('${m.id}', 'exam', 'all')">Show All (${scoreSummary.totalQuestions})</button>
        </div>
      </div>`
    : '';

  const headerHtml = `
    <div style="background:var(--surface-2); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
        <div>
          <b style="font-size:15px; color:var(--text);">Stage 5 — Module ${m.id} Mastery Exam (${stats.total} Questions)</b>
          <div style="font-size:12.5px; color:var(--text-secondary);">
            Answer at least <b>${scoreSummary.passThreshold} / ${stats.total} (80%)</b> to master <b>Module ${m.id}</b> • Question ${curIdx + 1} of ${stats.total} • Answered: <b id="exam-answered-count">${stats.answered}/${stats.total}</b> (Unanswered: <b id="exam-unanswered-count">${stats.unanswered}</b>)
          </div>
        </div>
        <span class="tag" id="exam-score-pill" style="background:${isPassed ? 'var(--success-container)' : 'var(--accent-container)'}; color:${isPassed ? 'var(--success-on-container)' : 'var(--accent-on-container)'}; font-weight:800;">
          ${
            isSubmitted
              ? `Score: ${scoreSummary.correctCount} / ${stats.total} (${scoreSummary.percentage}%) ${isPassed ? '• ✓ Mastered' : ''}`
              : `Answered: ${stats.answered} / ${stats.total} ${isPassed ? '• ✓ Mastered' : '• In Progress'}`
          }
        </span>
      </div>
      <div style="height:7px; background:var(--surface-1); border-radius:999px; overflow:hidden; margin-bottom:10px;">
        <div id="exam-progress-fill" style="height:100%; width:${stats.percentAnswered}%; background:${isSubmitted && scoreSummary.passed ? 'var(--success)' : 'var(--accent)'}; transition:width 0.2s ease;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'all' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'exam', 'all')">All (${stats.total})</button>
          <button type="button" class="stage-pill ${isSingleFocus ? 'active' : ''}" onclick="toggleAssessmentSingleFocus('${m.id}', 'exam')">Single Focus (${curIdx + 1}/${stats.total})</button>
          <button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'unanswered' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'exam', 'unanswered')">Unanswered (${stats.unanswered})</button>
          ${
            isSubmitted
              ? `<button type="button" class="stage-pill ${!isSingleFocus && attempt.filterMode === 'incorrect' ? 'active' : ''}" onclick="setAssessmentFilter('${m.id}', 'exam', 'incorrect')">Missed (${stats.total - scoreSummary.correctCount})</button>`
              : ''
          }
        </div>
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'exam', -1)" ${curIdx <= 0 ? 'disabled' : ''}>← Prev</button>
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="stepAssessmentQuestion('${m.id}', 'exam', 1)" ${curIdx >= stats.total - 1 ? 'disabled' : ''}>Next →</button>
          ${
            !isSubmitted
              ? `<button type="button" class="btn btn-success" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="submitModuleExam('${m.id}', false)">✅ Submit Exam (${stats.answered}/${stats.total})</button>`
              : ''
          }
          ${
            pendingResetConfirmKey === resetKey
              ? `<span style="font-size:12px; color:var(--danger); font-weight:700;">Reset entire ${stats.total}-question exam attempt?</span>
                 <button type="button" class="btn btn-warn" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="confirmResetAssessmentStage('${m.id}', 'exam')">Yes, Reset Exam</button>
                 <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="cancelResetAssessmentStage()">Cancel</button>`
              : `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="requestResetAssessmentStage('${m.id}', 'exam')">🔄 ${isSubmitted ? 'Retake Exam' : 'Reset Exam'}</button>`
          }
        </div>
      </div>
      ${submitConfirmBanner}
      ${postSubmitSummaryBanner}
      ${renderQuestionJumpStrip(m.id, 'exam', examQuestions, attempt, isSubmitted)}
    </div>
  `;

  const cardsHtml =
    visibleIndices.length === 0
      ? `<div class="card" style="background:var(--surface-2); box-shadow:none; text-align:center; padding:18px; font-weight:700; color:var(--text-secondary);">No exam questions match this filter. <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px; margin-left:8px;" onclick="setAssessmentFilter('${m.id}', 'exam', 'all')">Show All ${stats.total} Questions</button></div>`
      : visibleIndices
          .map((idx) => {
            const qItem = examQuestions[idx];
            const savedSel = attempt.selectedOptions[idx];
            const hasSaved = typeof savedSel === 'number';
            const isCorrect = hasSaved && savedSel === qItem.ans;
            const savedText = attempt.textAnswers?.[idx] || '';

            const textBoxHtml =
              qItem.inputMode === 'text' && !isSubmitted
                ? `<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:8px 0 10px 0;">
                    <input
                      type="text"
                      id="exam-text-input-${m.id}-${idx}"
                      class="input-box"
                      style="flex:1; min-width:190px; margin:0; padding:8px 11px; font-size:13.5px;"
                      placeholder="${escapeSingleQuotes(qItem.hintUk ? `Type answer (Hint: ${qItem.hintUk})...` : 'Type your Ukrainian or phonetic answer...')}"
                      value="${escapeSingleQuotes(savedText)}"
                      onkeydown="if(event.key==='Enter'){event.preventDefault();submitStageAssessmentText('${m.id}', 'exam', ${idx});}"
                    />
                    <button type="button" class="btn btn-sec" style="min-height:36px; padding:6px 12px; font-size:12.5px;" onclick="submitStageAssessmentText('${m.id}', 'exam', ${idx})">✍️ Record Typed Answer</button>
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

            return `
              <div class="card" id="exam-card-${m.id}-${idx}" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                  <span class="tag" style="background:var(--surface-1); color:var(--accent); font-weight:800;">Question ${idx + 1} of ${stats.total}</span>
                  <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    ${qItem.topic ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">${qItem.topic}</span>` : ''}
                    ${qItem.difficultyTier ? `<span class="tag" style="background:var(--surface-1); color:var(--text-secondary); font-size:11px;">Tier ${qItem.difficultyTier}/5</span>` : ''}
                    ${qItem.audioUk ? `<button type="button" class="btn btn-sec" style="min-height:28px; padding:2px 8px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(qItem.audioUk)}')">🔊 Audio</button>` : ''}
                  </div>
                </div>
                <div style="font-weight:700; margin-bottom:8px;">Question ${idx + 1}: ${qItem.q}</div>
                ${textBoxHtml}
                ${qItem.opts
                  .map((opt, oIdx) => {
                    let stateClass = '';
                    let extraStyle = '';
                    if (isSubmitted) {
                      if (oIdx === qItem.ans) stateClass = 'correct';
                      else if (hasSaved && oIdx === savedSel) stateClass = 'wrong';
                    } else if (hasSaved && oIdx === savedSel) {
                      extraStyle =
                        'border:2px solid var(--accent); background:var(--accent-container); color:var(--accent-on-container); font-weight:800;';
                    }
                    return `
                      <button class="option-btn ${stateClass}" style="${extraStyle}" onclick="handleExamAnswer(this, ${oIdx === qItem.ans}, '${m.id}', ${idx}, 'exam-exp-${idx}', ${oIdx})">${opt}</button>
                    `;
                  })
                  .join('')}
                <div id="exam-exp-${idx}" class="${isSubmitted ? '' : 'hidden'}" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid ${isCorrect ? 'var(--success)' : 'var(--danger, #dc2626)'};">
                  ${
                    !hasSaved && isSubmitted
                      ? `<div style="margin-bottom:5px; color:var(--danger, #dc2626); font-weight:700;">⚠️ Unanswered Question</div>`
                      : ''
                  }
                  <div id="exam-exp-body-${idx}">${feedbackHtml}</div>
                  <div style="margin-top:6px; display:flex; gap:8px; flex-wrap:wrap;">
                    ${qItem.audioUk ? `<button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(qItem.audioUk)}')">🔊 Hear Ukrainian</button>` : ''}
                    <button type="button" class="btn btn-warn" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="playBilingualOpenAI('${escapeSingleQuotes(qItem.exp)}', 'en')">🗣️ Hear Explanation</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');

  const footerSubmitHtml = !isSubmitted
    ? `<div style="margin-top:14px; padding:14px; background:var(--surface-2); border-radius:var(--radius-md); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="font-size:13.5px; color:var(--text);">
          Answered <b>${stats.answered} of ${stats.total}</b> questions (${stats.unanswered} remaining). Ready to grade your Module ${m.id} Exam?
        </div>
        <button type="button" class="btn btn-success" style="min-height:40px; padding:8px 18px; font-size:14px;" onclick="submitModuleExam('${m.id}', false)">✅ Submit & Grade Module ${m.id} Exam (${stats.answered}/${stats.total})</button>
      </div>`
    : '';

  return headerHtml + cardsHtml + footerSubmitHtml;
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
  const nextIdx = Math.min(Math.max(0, (attempt.currentIndex || 0) + delta), Math.max(0, total - 1));
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
  const checks = (m.structuredLesson?.embeddedChecks || []) as EnrichedInlineCheck[];
  const kc = checks[qIdx];
  if (!kc) return;

  const isCorrect = optIdx === kc.correctIndex;
  const attempt = getStageAttempt(modId, 'inlineChecks');
  attempt.selectedOptions[qIdx] = optIdx;
  attempt.currentIndex = qIdx;
  persistAssessmentStore();

  const expId = `vc-kc-exp-${modId}-${kc.id}`;
  const quizKey = `${modId}:inline-kc:${kc.id}`;
  handlePracticeOptionTap(btnEl, isCorrect, expId, quizKey, kc.audioUk || '', optIdx);
  renderActiveModule();
}

export function submitInlineCheckText(modId: string, qIdx: number): void {
  const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
  const checks = (m.structuredLesson?.embeddedChecks || []) as EnrichedInlineCheck[];
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
  const prefix = stageKey === 'cfu' ? 'cfu' : stageKey === 'practice' ? 'prac' : 'exam';
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
  if (quizKey) {
    const parts = quizKey.split(':');
    if (parts.length >= 3) {
      const [modId, kind, rawIdx] = parts;
      const qIdx = Number(rawIdx);
      if (!Number.isNaN(qIdx) && (kind === 'cfu' || kind === 'prac')) {
        const stageKey = kind === 'cfu' ? 'cfu' : 'practice';
        const m = COURSE_MODULES.find((x) => x.id === modId) || COURSE_MODULES[0];
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
    const cardEl = btnEl.closest('.card');
    if (cardEl) {
      const allBtns = cardEl.querySelectorAll('.option-btn');
      allBtns.forEach((b) => {
        (b as HTMLElement).style.border = '';
        (b as HTMLElement).style.background = '';
        (b as HTMLElement).style.color = '';
        (b as HTMLElement).style.fontWeight = '';
      });
    }
    btnEl.style.border = '2px solid var(--accent)';
    btnEl.style.background = 'var(--accent-container)';
    btnEl.style.color = 'var(--accent-on-container)';
    btnEl.style.fontWeight = '800';

    const stats = computeStageStats(m.exam, attempt);
    const ansCountEl = document.getElementById('exam-answered-count');
    if (ansCountEl) ansCountEl.innerText = `${stats.answered}/${stats.total}`;
    const unansCountEl = document.getElementById('exam-unanswered-count');
    if (unansCountEl) unansCountEl.innerText = `${stats.unanswered}`;
    const fillEl = document.getElementById('exam-progress-fill');
    if (fillEl) fillEl.style.width = `${stats.percentAnswered}%`;
    const scorePill = document.getElementById('exam-score-pill');
    if (scorePill) {
      const isPassed = db.passedMods.includes(modId);
      scorePill.innerText = `Answered: ${stats.answered} / ${m.exam.length} ${isPassed ? '• ✓ Mastered' : '• In Progress'}`;
    }
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

  if (scoreSummary.passed && !db.passedMods.includes(modId)) {
    db.passedMods.push(modId);
    renderCourseSyllabus();
  }

  persistAssessmentStore();
  saveDB();
  renderActiveModule();
}

// ============================================================================
// 5. GRADED COMPREHENSIBLE INPUT READER (A0 TO B2–C1)
// ============================================================================
let activeReaderLevelFilter: string = 'A0';
let activePassageId = READER_PASSAGES[0].id;
let showReaderTranslations = true;

export function filterReaderByLevel(level: string): void {
  triggerHaptic('light');
  activeReaderLevelFilter = level;
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

export function inspectReaderWord(
  rawWord: string,
  passageId: string
): void {
  triggerHaptic('light');
  const cleanLower = rawWord
    .replace(/[«»"“”.,!?;:—()]/g, '')
    .replace(/\u0301/g, '')
    .toLowerCase()
    .trim();

  const passage =
    READER_PASSAGES.find((p) => p.id === passageId) || READER_PASSAGES[0];
  const rawGloss = passage.glossary[cleanLower];
  const gloss =
    typeof rawGloss === 'string'
      ? {
          surface: rawWord,
          lemma: rawWord,
          pos: 'NOUN',
          en: rawGloss,
          note: rawGloss,
        }
      : rawGloss;

  // Look up matching lemma or surface form in FREQ_6000_DB
  const targetLemma = gloss
    ? gloss.lemma.replace(/\u0301/g, '').toLowerCase()
    : cleanLower;

  const matchedVocab =
    FREQ_6000_DB.find(
      (w) => w.ru.replace(/\u0301/g, '').toLowerCase() === targetLemma
    ) ||
    FREQ_6000_DB.find(
      (w) => w.ru.replace(/\u0301/g, '').toLowerCase() === cleanLower
    );

  if (matchedVocab) {
    inspectWordDeep(matchedVocab.rank, false, true);
  } else if (gloss) {
    const synthItem: VocabItem = {
      rank: 1,
      ru: gloss.lemma,
      pos: gloss.pos.toUpperCase().includes('VERB')
        ? 'VERB'
        : gloss.pos.toUpperCase().includes('ADJ')
          ? 'ADJ'
          : 'NOUN',
      en: gloss.en,
      level: 'A2',
      exUk: rawWord,
      exEn: gloss.note,
    };
    const phon = generateUkrainianPhonetics(gloss.surface);
    const gram = generateGrammarBreakdown(synthItem);
    const inspectorBody = document.getElementById('inspector-body');
    if (inspectorBody) {
      inspectorBody.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container);">Reader Token • ${gloss.pos}</span>
        </div>
        <div style="font-size:28px; font-weight:800; color:var(--text); margin-top:8px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(gloss.surface)}')">🔊 ${gloss.surface}</div>
        <div style="font-size:13.5px; color:var(--text-secondary);">Dictionary form (lemma): <b>${gloss.lemma}</b> • Sounds like: <b>${phon.plainGuide}</b> <span style="color:var(--accent); font-family:ui-monospace, monospace;">${phon.ipa}</span></div>
        <div style="font-size:19px; font-weight:800; color:var(--success); margin:6px 0;">${gloss.en}</div>
        <div style="font-size:13px; color:var(--text); margin-bottom:10px;"><b>Context Note:</b> ${gloss.note}</div>
        ${gram.tableHtml}
      `;
    }
    if (window.innerWidth <= 960) openInspectorSheet();
  }

  speakUkrainian(rawWord);
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
      return `${leading}<span class="word-token" onclick="inspectReaderWord('${escapeSingleQuotes(core)}', '${passageId}')">${core}</span>${trailing}`;
    })
    .join('');
}

export function initReader(): void {
  const container = document.getElementById('story-container');
  if (!container) return;

  const passage: ReaderPassage =
    READER_PASSAGES.find((p) => p.id === activePassageId) || READER_PASSAGES[0];

  const readerLevels: Array<{ id: string; label: string }> = [
    { id: 'A0', label: `A0 (${READER_PASSAGES.filter((p) => p.level === 'A0').length})` },
    { id: 'A1', label: `A1 (${READER_PASSAGES.filter((p) => p.level === 'A1').length})` },
    { id: 'A2', label: `A2 (${READER_PASSAGES.filter((p) => p.level === 'A2').length})` },
    { id: 'B1', label: `B1 (${READER_PASSAGES.filter((p) => p.level === 'B1').length})` },
    { id: 'B2–C1', label: `B2–C1 (${READER_PASSAGES.filter((p) => p.level === 'B2–C1').length})` },
    { id: 'ALL', label: `All (${READER_PASSAGES.length})` },
  ];

  const visiblePassages =
    activeReaderLevelFilter === 'ALL'
      ? READER_PASSAGES
      : READER_PASSAGES.filter((p) => p.level === activeReaderLevelFilter);

  const selectorHtml = `
    <div style="margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <div class="stage-bar" id="reader-level-filter-bar" style="display:flex; flex-wrap:wrap; gap:6px; width:100%; margin-bottom:10px; overflow:visible;">
        ${readerLevels
          .map(
            (lvl) => `
          <button class="stage-pill ${activeReaderLevelFilter === lvl.id ? 'active' : ''}" onclick="filterReaderByLevel('${lvl.id}')">
            ${lvl.label}
          </button>
        `
          )
          .join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
        <span style="font-size:12px; font-weight:700; color:var(--text-secondary);">Select a story (${visiblePassages.length} shown):</span>
        <button class="btn btn-sec" style="min-height:34px; padding:4px 12px; font-size:12px; flex-shrink:0;" onclick="toggleReaderTranslations()">
          ${showReaderTranslations ? '🙈 Hide English Translations' : '👀 Show English Translations'}
        </button>
      </div>
      <div class="reader-passage-grid">
        ${visiblePassages
          .map((p) => {
            const isAct = p.id === passage.id;
            const genreStr = p.genre || '';
            const shortTopic = genreStr.split('•')[1]?.trim() || genreStr;
            return `
            <button type="button" class="reader-passage-card ${isAct ? 'active' : ''}" onclick="selectReaderPassage('${p.id}')">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:3px;">
                <span class="tag" style="margin:0; font-size:10px; padding:2px 7px; background:${isAct ? 'var(--accent)' : 'var(--accent-container)'}; color:${isAct ? '#fff' : 'var(--accent-on-container)'}; font-weight:800;">${p.level}</span>
                <span style="font-size:10.5px; color:var(--muted); font-weight:700; text-align:right;">${shortTopic}</span>
              </div>
              <div style="font-weight:800; font-size:13.5px; color:var(--text); line-height:1.3;">${p.titleUk}</div>
              <div style="font-size:11.5px; color:var(--text-secondary); line-height:1.25; margin-top:2px;">${p.titleEn}</div>
            </button>
          `;
          })
          .join('')}
      </div>
    </div>
  `;

  const headerHtml = `
    <div style="margin-bottom:14px;">
      <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">CEFR ${passage.level} • ${passage.genre}</span>
      <h2 style="margin:6px 0 2px 0; font-size:21px; color:var(--text);">${passage.titleUk}</h2>
      <div style="font-size:14px; font-weight:700; color:var(--text-secondary);">${passage.titleEn}</div>
      <p style="font-size:13px; color:var(--muted); margin:4px 0 0 0; line-height:1.45;">${passage.summaryEn}</p>
    </div>
  `;

  const sentencesHtml = passage.sentences
    .map(
      (s) => `
      <div style="padding:12px 14px; background:var(--surface-2); border-radius:var(--radius-md); margin-bottom:10px; border:1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
          <div style="font-size:18px; font-weight:700; line-height:1.75; color:var(--text); flex:1;">
            ${tokenizeSentenceHtml(s.uk, passage.id)}
          </div>
          <button class="btn btn-sec" style="min-height:34px; padding:4px 10px; font-size:12px; flex-shrink:0;" onclick="speakUkrainian('${escapeSingleQuotes(s.uk)}')" title="Listen to sentence">🔊</button>
        </div>
        ${
          showReaderTranslations
            ? `<div style="font-size:13.5px; color:var(--text-secondary); margin-top:6px; line-height:1.45; border-top:1px solid var(--border-subtle); padding-top:6px;">${s.en}</div>`
            : ''
        }
      </div>
    `
    )
    .join('');

  const questionsHtml = `
    <div style="margin-top:20px; padding-top:14px; border-top:1px solid var(--border-subtle);">
      <h3 style="font-size:16px; margin:0 0 10px 0; color:var(--text);">📋 Reading Comprehension Check</h3>
      ${passage.questions
        .map(
          (qItem, idx) => `
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px; line-height:1.5;">
          <div style="font-weight:700; font-size:14px; margin-bottom:8px;">${idx + 1}. ${qItem.q}</div>
          ${qItem.opts
            .map(
              (opt, oIdx) => `
            <button class="option-btn" onclick="handleCourseOptionTap(this, ${oIdx === qItem.ans}, 'reader-exp-${passage.id}-${idx}', 'reader:${passage.id}:${idx}')">${opt}</button>
          `
            )
            .join('')}
          <div id="reader-exp-${passage.id}-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
            <b>💡 Why:</b> ${qItem.exp}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;

  container.innerHTML =
    selectorHtml + headerHtml + sentencesHtml + questionsHtml;
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
    fbEl.style.borderLeft = '4px solid var(--success)';
    fbEl.innerHTML = `<div style="color:var(--success); font-weight:800;">${result.feedbackMessage}</div>
      <div style="font-size:12.5px; color:var(--text-secondary); margin-top:4px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(exampleUk)}')">🔊 Example: <b>${exampleUk}</b></div>`;
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
    fbEl.style.borderLeft = '4px solid var(--danger)';
    fbEl.innerHTML = `<div style="color:var(--danger); font-weight:700;">${result.feedbackMessage}</div>
      <button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px; margin-top:6px;" onclick="speakUkrainian('${escapeSingleQuotes(expectedUk)}')">🔊 Hear Correct Form</button>`;
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
    { id: 'browse', label: '1. Browse & FSRS Cards' },
    { id: 'uk2en', label: '2. UK → EN Recognition' },
    { id: 'en2uk', label: '3. EN → UK Active Recall' },
    { id: 'fillblank', label: '4. Fill in the Blank' },
    { id: 'sentence', label: '5. Build Sentence' },
    { id: 'listening', label: '6. Listening Lab' },
    { id: 'context', label: '7. Context Selection' },
    { id: 'grammar', label: '8. Grammar-Aware Practice' },
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
  const query = (searchEl?.value || '').trim().toLowerCase();

  const rawItems = getCategoryVocabItems(cat.id);
  const items = query
    ? rawItems.filter(
        (w) =>
          w.ru.toLowerCase().includes(query) ||
          w.ru.replace(/\u0301/g, '').toLowerCase().includes(query) ||
          w.en.toLowerCase().includes(query)
      )
    : rawItems;

  const headerBanner = `
    <div style="background:var(--surface-2); padding:14px; border-radius:var(--radius-md); margin-bottom:14px; border:1px solid var(--border-subtle);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">${cat.icon} ${cat.title}</span>
          <span class="tag" style="margin-left:6px;">${items.length} Curated Words</span>
        </div>
        <button type="button" class="btn btn-warn" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="speakCategoryGuide()">🗣️ Audio Tip</button>
      </div>
      <p style="margin:6px 0; font-size:13.5px; color:var(--text-secondary);">${cat.description}</p>
      <div style="font-size:13px; color:var(--text); padding:8px 10px; background:var(--surface-1); border-left:3px solid var(--accent); border-radius:var(--radius-xs);">
        <b>💡 Ukrainian Grammar & Usage Note:</b> ${cat.grammarTip}
      </div>
    </div>
  `;

  if (activeVocabMode === 'browse') {
    const rowsHtml = items
      .map((w) => {
        const inDeck = db.cards.some((c) => c.rank === w.rank);
        const phon = generateUkrainianPhonetics(w.ru);
        const exUk = w.exampleUk || w.exUk || w.ru;
        const exEn = w.exampleEn || w.exEn || w.en;
        return `
        <div class="freq-row" onclick="inspectWordDeep(${w.rank}, true, true)" style="cursor:pointer;">
          <div style="flex:1; min-width:200px;">
            <span class="tag">#${w.rank} • ${w.level} • ${w.pos}</span>
            <b style="font-size:17.5px; color:var(--text); margin-left:6px;">🔊 ${w.ru}</b>
            <span style="color:var(--accent); font-family:ui-monospace, monospace; font-size:13px; margin-left:6px;">${phon.ipa}</span>
            <div style="color:var(--success); font-weight:700; font-size:14px; margin-top:2px;">${w.en} <span style="color:var(--text-secondary); font-weight:500; font-size:12px;">(Sounds like: ${phon.plainGuide})</span></div>
            <div onclick="event.stopPropagation(); speakUkrainian('${escapeSingleQuotes(exUk)}')" style="color:var(--text-secondary); font-size:12.5px; margin-top:4px; padding:4px 8px; background:var(--surface-2); border-radius:var(--radius-xs); display:inline-block; border:1px solid var(--border-subtle);">
              <b>🔊 Context:</b> <span style="color:var(--text); font-weight:600;">${exUk}</span> — <i>${exEn}</i>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 10px; font-size:12px;" onclick="event.stopPropagation(); inspectWordDeep(${w.rank}, true, true)">🔍 7-Case</button>
            ${
              inDeck
                ? `<span class="tag" style="background:var(--success-container); color:var(--success-on-container); font-weight:800;">✓ In FSRS</span>`
                : `<button type="button" class="btn btn-success" style="min-height:34px; padding:5px 10px; font-size:12px;" onclick="event.stopPropagation(); addSingleWordFrom6000(${w.rank}); renderEverydayVocabWorkspace();">+ Add FSRS</button>`
            }
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
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:800; font-size:17px; cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">${idx + 1}. 🔊 ${w.ru} <span class="tag">${w.pos}</span></div>
            <button type="button" class="btn btn-sec" style="min-height:30px; padding:3px 10px; font-size:11.5px;" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">🔊 Hear</button>
          </div>
          ${opts
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === ansIdx}, 'uk2en-exp-${idx}', 'uk2en:${w.rank}', '${escapeSingleQuotes(w.ru)}')">${opt}</button>
          `
            )
            .join('')}
          <div id="uk2en-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
            <b>✅ Meaning:</b> ${w.ru} = <b>${w.en}</b>.<br>
            <span style="cursor:pointer;" onclick="speakUkrainian('${escapeSingleQuotes(exUk)}')">🔊 Example: <b>${exUk}</b> (${w.exampleEn || w.exEn || ''})</span>
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
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
          <div style="font-weight:700; font-size:14.5px; margin-bottom:6px;">
            ${idx + 1}. Type the Ukrainian word for: <b style="color:var(--accent); font-size:16px;">"${w.en}"</b> <span class="tag">${w.pos}</span>
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
            Capitalization and stress marks are optional; apostrophes (' / ’) are normalized automatically.
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input id="voc-recall-in-${idx}" type="text" class="input-box" style="flex:1; min-width:180px;" placeholder="Type in Ukrainian..." onkeydown="if(event.key==='Enter') checkVocabActiveRecall('voc-recall-in-${idx}', 'voc-recall-fb-${idx}', '${escapeSingleQuotes(w.ru)}', '${escapeSingleQuotes(exUk)}')">
            <button type="button" class="btn" onclick="checkVocabActiveRecall('voc-recall-in-${idx}', 'voc-recall-fb-${idx}', '${escapeSingleQuotes(w.ru)}', '${escapeSingleQuotes(exUk)}')">Check Answer</button>
            <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">🔊 Audio Hint</button>
          </div>
          <div id="voc-recall-fb-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px;"></div>
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
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
          <div style="font-weight:800; font-size:15.5px; margin-bottom:4px;">${idx + 1}. ${fb.sentenceWithBlank}</div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:6px;"><i>"${fb.englishTranslation}"</i> • <span style="color:var(--accent);">${fb.grammarHint}</span></div>
          ${rotated
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === correctIdx}, 'fb-exp-${idx}', 'fb:${fb.id}', '${escapeSingleQuotes(fullSentence)}')">${opt}</button>
          `
            )
            .join('')}
          <div id="fb-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
            <b>✅ Complete Sentence:</b> <span style="cursor:pointer; font-weight:700;" onclick="speakUkrainian('${escapeSingleQuotes(fullSentence)}')">🔊 ${fullSentence}</span><br>
            <b>💡 Why:</b> ${fb.grammarHint}
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
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
          <div style="font-weight:700; font-size:14.5px; margin-bottom:6px;">${idx + 1}. Build the Ukrainian sentence for: <b style="color:var(--accent);">"${sc.promptEn}"</b></div>
          <div style="min-height:42px; padding:10px; background:var(--surface-1); border:1px dashed var(--border-strong); border-radius:var(--radius-sm); margin-bottom:8px; font-weight:800; font-size:15.5px; color:var(--text);">
            ${chosen.length > 0 ? chosen.join(' ') : '<span style="color:var(--muted); font-weight:500; font-size:13px;">Tap word tiles below in order...</span>'}
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
            ${sc.scrambledWords
              .map(
                (w) => `
              <button type="button" class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:13.5px;" onclick="addSentenceTile('${sc.id}', '${escapeSingleQuotes(w)}')">${w}</button>
            `
              )
              .join('')}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" onclick="checkSentenceBuilder('${sc.id}', '${escapeSingleQuotes(sc.targetUk)}', 'sc-exp-${idx}')">Check Sentence</button>
            <button type="button" class="btn btn-sec" onclick="resetSentenceBuilder('${sc.id}')">Reset Tiles</button>
            <button type="button" class="btn btn-warn" onclick="speakUkrainian('${escapeSingleQuotes(sc.targetUk)}')">🔊 Hear Target</button>
          </div>
          <div id="sc-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
            <b>✅ Target Sentence:</b> <span style="cursor:pointer; font-weight:800;" onclick="speakUkrainian('${escapeSingleQuotes(sc.targetUk)}')">🔊 ${sc.targetUk}</span><br>
            <b>💡 Contrastive Grammar Note:</b> ${sc.grammarExplanation}
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
        <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <div style="font-weight:700; font-size:14.5px;">${idx + 1}. Tap to listen, then choose the matching Ukrainian word:</div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn" onclick="speakUkrainian('${escapeSingleQuotes(w.ru)}')">🔊 Play Word Audio</button>
              <button type="button" class="btn btn-sec" onclick="speakUkrainian('${escapeSingleQuotes(exUk)}')">🔊 Play Example</button>
            </div>
          </div>
          ${opts
            .map(
              (opt, oIdx) => `
            <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${oIdx === ansIdx}, 'listen-exp-${idx}', 'listen:${w.rank}', '${escapeSingleQuotes(w.ru)}')">${opt}</button>
          `
            )
            .join('')}
          <div id="listen-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
            <b>✅ Spoken Word:</b> <b>${w.ru}</b> (${w.en}) • <i>${exUk}</i>
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
      <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
        <div style="font-size:13px; font-weight:700; color:var(--accent); margin-bottom:4px;">Situation ${idx + 1}: ${cc.situationEn}</div>
        <div style="font-weight:800; font-size:16px; margin-bottom:8px;">${cc.sentenceUk}</div>
        ${cc.options
          .map(
            (opt, oIdx) => `
          <button type="button" class="option-btn" onclick="handleCourseOptionTap(this, ${oIdx === cc.correctIndex}, 'ctx-exp-${idx}', 'ctx:${cc.id}')">${opt}</button>
        `
          )
          .join('')}
        <div id="ctx-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
          <b>💡 Contrastive Usage Explanation:</b> ${cc.explanation}
        </div>
      </div>
    `
      )
      .join('');
    box.innerHTML = headerBanner + html;
    return;
  }

  // Mode 8: Grammar-Aware Vocabulary Practice
  const catGram = GRAMMAR_AWARE_EXERCISES.filter(
    (g) => g.categoryId === cat.id
  );
  const pool = catGram.length > 0 ? catGram : GRAMMAR_AWARE_EXERCISES;
  const html = pool
    .map((ga, idx) => {
      const fullSentence = ga.promptUk.replace('___', ga.answerUk);
      return `
      <div class="card" style="background:var(--surface-2); box-shadow:none; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:4px;">
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">Base word: ${ga.baseWordUk}</span>
          <span class="tag">${ga.targetGrammarForm}</span>
        </div>
        <div style="font-weight:800; font-size:16px; margin:6px 0 4px 0;">${idx + 1}. ${ga.promptUk}</div>
        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;"><i>"${ga.promptEn}"</i> (${ga.baseWordEn})</div>
        ${ga.options
          .map(
            (opt) => `
          <button type="button" class="option-btn" onclick="handlePracticeOptionTap(this, ${opt === ga.answerUk}, 'ga-exp-${idx}', 'ga:${ga.id}', '${escapeSingleQuotes(fullSentence)}')">${opt}</button>
        `
          )
          .join('')}
        <div id="ga-exp-${idx}" class="hidden" style="margin-top:8px; padding:10px; background:var(--surface-1); border-radius:var(--radius-sm); font-size:13px; border-left:4px solid var(--success);">
          <b>✅ Inflected Form in Context:</b> <span style="cursor:pointer; font-weight:800;" onclick="speakUkrainian('${escapeSingleQuotes(fullSentence)}')">🔊 ${fullSentence}</span><br>
          <b>💡 Why:</b> ${ga.explanation}
        </div>
      </div>
    `;
    })
    .join('');
  box.innerHTML = headerBanner + html;
}

// ============================================================================
// 6. NAVIGATION & INITIALIZATION
// ============================================================================
export function switchTab(tab: string, btn?: HTMLElement): void {
  triggerHaptic('light');
  ['srs', 'en2uk', 'correction', 'phonetics', 'course', 'vocab', 'identify', 'reader'].forEach(
    (t) => {
      const el = document.getElementById('tab-' + t);
      if (el) el.classList.add('hidden');
    }
  );
  document.getElementById('tab-' + tab)?.classList.remove('hidden');
  document
    .querySelectorAll('.nav-btn')
    .forEach((b) => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    document
      .querySelector(`.nav-btn[onclick*="switchTab('${tab}'"]`)
      ?.classList.add('active');
  }
  if (tab === 'vocab') {
    renderEverydayVocabTab();
  } else if (tab === 'identify') {
    renderIdentifyTab();
  }
  syncMultilingualTrackUI();
  const mainEl = document.getElementById('main-scroll-container');
  if (mainEl) mainEl.scrollTop = 0;
}

function addWordByUkToFSRS(uk: string): boolean {
  const cleanTarget = uk.replace(/\u0301/g, '').toLowerCase().trim();
  const matched = FREQ_6000_DB.find(
    (w) => w.ru.replace(/\u0301/g, '').toLowerCase().trim() === cleanTarget
  );
  const rank = matched ? matched.rank : 1;
  if (!db.cards.some((c) => c.rank === rank)) {
    db.cards.push(createCardRecord(rank));
    db.xp += 3;
    saveDB();
    renderAnkiStage();
    renderEn2UkStage();
    renderCorrectionStage();
    renderSrsCatalog6000();
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
}

// Bind all interactive handlers to global window so HTML onclick attributes work seamlessly
declare global {
  interface Window {
    triggerHaptic: typeof triggerHaptic;
    applyColorTheme: typeof applyColorTheme;
    cycleColorTheme: typeof cycleColorTheme;
    openInspectorSheet: typeof openInspectorSheet;
    closeInspectorSheet: typeof closeInspectorSheet;
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
    speakCategoryGuide: typeof speakCategoryGuide;
    addCategoryToFSRS: typeof addCategoryToFSRS;
    checkVocabActiveRecall: typeof checkVocabActiveRecall;
    addSentenceTile: typeof addSentenceTile;
    resetSentenceBuilder: typeof resetSentenceBuilder;
    checkSentenceBuilder: typeof checkSentenceBuilder;
    renderEverydayVocabTab: typeof renderEverydayVocabTab;
    renderEverydayVocabWorkspace: typeof renderEverydayVocabWorkspace;
    filterReaderByLevel: typeof filterReaderByLevel;
    selectReaderPassage: typeof selectReaderPassage;
    toggleReaderTranslations: typeof toggleReaderTranslations;
    inspectReaderWord: typeof inspectReaderWord;
    initReader: typeof initReader;
    speakStory: typeof speakStory;
    switchTab: typeof switchTab;
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
    currentInspectedRank: number;
    srsCatPage: number;
    phonPage: number;
  }
}

if (typeof window !== 'undefined') {
  window.triggerHaptic = triggerHaptic;
  window.applyColorTheme = applyColorTheme;
  window.cycleColorTheme = cycleColorTheme;
  window.openInspectorSheet = openInspectorSheet;
  window.closeInspectorSheet = closeInspectorSheet;
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
  window.selectVocabCategory = selectVocabCategory;
  window.selectVocabMode = selectVocabMode;
  window.speakCategoryGuide = speakCategoryGuide;
  window.addCategoryToFSRS = addCategoryToFSRS;
  window.checkVocabActiveRecall = checkVocabActiveRecall;
  window.addSentenceTile = addSentenceTile;
  window.resetSentenceBuilder = resetSentenceBuilder;
  window.checkSentenceBuilder = checkSentenceBuilder;
  window.renderEverydayVocabTab = renderEverydayVocabTab;
  window.renderEverydayVocabWorkspace = renderEverydayVocabWorkspace;
  window.filterReaderByLevel = filterReaderByLevel;
  window.selectReaderPassage = selectReaderPassage;
  window.toggleReaderTranslations = toggleReaderTranslations;
  window.inspectReaderWord = inspectReaderWord;
  window.initReader = initReader;
  window.speakStory = speakStory;
  window.switchTab = switchTab;
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
  injectOpenAIVoiceModal();
  initCursivePad();
  updateSidebarStats();
  renderAnkiStage();
  renderEn2UkStage();
  renderCorrectionStage();
  renderSrsCatalog6000();
  renderPhonetics6000();
  renderCourseSyllabus();
  renderActiveModule();
  syncMultilingualTrackUI();
  renderEverydayVocabTab();
  registerIdentifyHooks({
    triggerHaptic: (t) => triggerHaptic(t === 'heavy' ? 'heavy' : 'light'),
    speakUkrainian,
    inspectCourseWord,
    addWordByUkToFSRS: (uk) => addWordByUkToFSRS(uk),
  });
  renderIdentifyTab();
  initReader();
  const initialBookWord =
    FREQ_6000_DB.find((w) => w.ru === 'кни́жка')?.rank || 1;
  inspectWordDeep(initialBookWord, false, false);
  bootCmsStudioRouteIfRequested();
}
