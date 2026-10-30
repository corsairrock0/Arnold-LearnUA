// ============================================================================
// LangoUA — AI Ukrainian Conversation & Language Tutor UI View
// ============================================================================

import {
  CONVERSATION_MODES,
  CORRECTION_INTENSITY_OPTIONS,
  CORRECTION_INTENSITY_ORDER,
  CEFR_LEVEL_CONFIGS,
  CEFR_LEVEL_ORDER,
  FORMALITY_OPTIONS,
  GEMINI_VOICE_OPTIONS,
  SPEAKING_SPEED_OPTIONS,
  MANUAL_HELP_ACTIONS,
  PRONUNCIATION_GUIDES,
  CONVERSATION_SCENARIOS,
  getScenarioById,
  type AIConversationState,
  type ConversationMode,
  type CorrectionIntensity,
  type ConvoCefrLevel,
  type FormalityPreference,
  type GeminiVoiceName,
  type GrammarCorrectionCardData,
  type ConversationTurn,
  type ManualHelpActionId,
} from './aiConversationData.ts';
import {
  analyzeUkrainianUtterance,
  attachGrammarAnalysisToTurn,
  clearConversationHistoryAndReset,
  createInitialConversationState,
  createOpeningTurnForSession,
  executeManualHelpAction,
  generateLocalConversationalReply,
  generateSessionReview,
  loadSavedConversationPreferences,
  saveConversationPreferences,
  setConversationMode,
  setCorrectionIntensity,
  setIncludeSessionReview,
  shouldSurfaceLiveCorrection,
} from './aiConversationEngine.ts';

export interface ConvoHostCallbacks {
  speakUkText: (textUk: string, rate?: number) => void;
  inspectWordIn7Cases: (wordUk: string) => void;
  addWordToFlashcards: (wordUk: string, buttonEl?: HTMLElement | null) => void;
  openCourseModuleById: (moduleId: string) => void;
}

let convoState: AIConversationState = createInitialConversationState(
  loadSavedConversationPreferences()
);
let hostCallbacks: ConvoHostCallbacks | null = null;
let scenarioSearchQuery = '';
let scenarioCategoryFilter = 'all';
let activePronunciationGuideId = PRONUNCIATION_GUIDES[0].id;
let manualHelpToast: {
  titleEn: string;
  responseUk: string;
  responseEn: string;
} | null = null;
let showHowToSayModal = false;
let showSessionReviewModal = false;
let editingUtteranceId: string | null = null;
let retryFeedbackMessage: { ok: boolean; text: string } | null = null;

// Browser SpeechRecognition & Gemini Live WebSocket state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let speechRecognitionInstance: any = null;
let liveWebSocket: WebSocket | null = null;
let liveAudioContext: AudioContext | null = null;
let liveMediaStream: MediaStream | null = null;
let nextLiveAudioPlayTime = 0;

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderClickableUkrainianWords(textUk: string): string {
  const tokens = String(textUk || '').split(/(\s+)/);
  return tokens
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const cleanWord = tok
        .replace(/^[.,!?;:«»"()—\-]+|[.,!?;:«»"()—\-]+$/g, '')
        .replace(/\u0301/g, '');
      if (cleanWord.length < 2 || !/[а-яіїєґА-ЯІЇЄҐ]/.test(cleanWord)) {
        return escapeHtml(tok);
      }
      return `<span class="convo-clickable-word" onclick="convoInspectWord('${escapeHtml(
        cleanWord
      )}')" title="Click to inspect 7 cases of «${escapeHtml(cleanWord)}»">${escapeHtml(
        tok
      )}</span>`;
    })
    .join('');
}

async function playConvoAudio(textUk: string, customRate?: number): Promise<void> {
  const rate = customRate ?? convoState.speakingSpeed ?? 1.0;
  const cleanText = textUk.replace(/\u0301/g, '').trim();
  if (!cleanText) return;

  convoState = { ...convoState, aiSpeakingState: 'speaking' };
  renderAIConversationTab();

  try {
    const res = await fetch('/api/convo/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textUk: cleanText,
        voiceName: convoState.voicePreference,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        audio.playbackRate = rate;
        audio.onended = () => {
          convoState = { ...convoState, aiSpeakingState: 'idle' };
          renderAIConversationTab();
        };
        audio.onerror = () => {
          convoState = { ...convoState, aiSpeakingState: 'idle' };
          hostCallbacks?.speakUkText(cleanText, rate);
          renderAIConversationTab();
        };
        await audio.play();
        return;
      }
    }
  } catch {
    // Fall back to host speech synthesis
  }

  hostCallbacks?.speakUkText(cleanText, rate);
  setTimeout(() => {
    convoState = { ...convoState, aiSpeakingState: 'idle' };
    renderAIConversationTab();
  }, Math.min(3500, Math.max(1200, cleanText.length * 65)));
}

function stopLiveVoiceStream(): void {
  if (speechRecognitionInstance) {
    try {
      speechRecognitionInstance.stop();
    } catch {
      // ignore
    }
    speechRecognitionInstance = null;
  }
  if (liveWebSocket) {
    try {
      liveWebSocket.send(JSON.stringify({ type: 'stop' }));
      liveWebSocket.close();
    } catch {
      // ignore
    }
    liveWebSocket = null;
  }
  if (liveMediaStream) {
    for (const track of liveMediaStream.getTracks()) {
      track.stop();
    }
    liveMediaStream = null;
  }
  if (liveAudioContext) {
    try {
      liveAudioContext.close();
    } catch {
      // ignore
    }
    liveAudioContext = null;
  }
}

async function connectGeminiLiveWebSocketIfAvailable(): Promise<void> {
  try {
    const statusRes = await fetch('/api/convo/status');
    const statusJson = await statusRes.json();
    if (!statusJson.liveVoiceSupported) {
      convoState = { ...convoState, connectionState: 'turn-voice' };
      renderAIConversationTab();
      return;
    }

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${proto}//${window.location.host}/api/convo/live`;
    const ws = new WebSocket(wsUrl);
    liveWebSocket = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'start',
          conversationMode: convoState.conversationMode,
          correctionIntensity: convoState.correctionIntensity,
          cefrLevel: convoState.cefrLevel,
          formalityPreference: convoState.formalityPreference,
          scenarioId: convoState.scenarioId,
          voicePreference: convoState.voicePreference,
        })
      );
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'connected') {
          convoState = { ...convoState, connectionState: 'live-voice' };
          renderAIConversationTab();
        } else if (msg.type === 'fallback') {
          convoState = { ...convoState, connectionState: 'turn-voice' };
          renderAIConversationTab();
        } else if (msg.type === 'audio' && msg.audioBase64) {
          playPcm24kAudioChunk(msg.audioBase64);
        } else if (msg.type === 'input_transcription' && msg.text) {
          const textUk = String(msg.text).trim();
          if (textUk.length > 1) {
            await handleLearnerSubmittedUtterance(textUk, true);
          }
        } else if (msg.type === 'output_transcription' && msg.text) {
          const aiText = String(msg.text).trim();
          if (aiText.length > 1) {
            const newAiTurn: ConversationTurn = {
              id: `turn_ai_${Date.now()}`,
              utteranceId: `utt_ai_${Date.now()}`,
              speaker: 'ai',
              ukrainianText: aiText,
              englishTranslation: 'Live spoken Ukrainian response (tap Translate for English)',
              timestamp: Date.now(),
              modeAtTurn: convoState.conversationMode,
              intensityAtTurn: convoState.correctionIntensity,
              cefrAtTurn: convoState.cefrLevel,
              showTranslation: convoState.translationVisibility === 'always',
            };
            convoState = {
              ...convoState,
              turns: [...convoState.turns, newAiTurn],
            };
            renderAIConversationTab();
          }
        }
      } catch {
        // ignore malformed ws message
      }
    };

    ws.onerror = () => {
      convoState = { ...convoState, connectionState: 'turn-voice' };
      renderAIConversationTab();
    };
  } catch {
    convoState = { ...convoState, connectionState: 'turn-voice' };
    renderAIConversationTab();
  }
}

function playPcm24kAudioChunk(base64Pcm: string): void {
  try {
    if (!liveAudioContext) {
      liveAudioContext = new AudioContext({ sampleRate: 24000 });
      nextLiveAudioPlayTime = liveAudioContext.currentTime;
    }
    const binary = atob(base64Pcm);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    const buffer = liveAudioContext.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = liveAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(liveAudioContext.destination);

    const startTime = Math.max(
      liveAudioContext.currentTime,
      nextLiveAudioPlayTime
    );
    source.start(startTime);
    nextLiveAudioPlayTime = startTime + buffer.duration;
  } catch {
    // ignore audio decode error
  }
}

async function handleLearnerSubmittedUtterance(
  rawTextUk: string,
  fromLiveTranscription = false
): Promise<void> {
  const trimmed = (rawTextUk || '').trim();
  if (!trimmed) return;

  const utteranceId = `utt_learner_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  // 1. Run local deterministic grammar analysis immediately so utteranceId is bound right away
  const initialAnalysis = analyzeUkrainianUtterance(trimmed, utteranceId, {
    cefrLevel: convoState.cefrLevel,
    formalityPreference: convoState.formalityPreference,
    scenarioId: convoState.scenarioId,
  });

  // Update recurring error count if this turn had an error
  const updatedRecurring = { ...convoState.recurringErrorCategories };
  if (
    initialAnalysis.status === 'incorrect-grammar' ||
    initialAnalysis.status === 'correct-but-unnatural'
  ) {
    updatedRecurring[initialAnalysis.category] =
      (updatedRecurring[initialAnalysis.category] || 0) + 1;
  }

  const surface = shouldSurfaceLiveCorrection(
    initialAnalysis,
    convoState.correctionIntensity,
    updatedRecurring
  );

  const learnerTurn: ConversationTurn = {
    id: `turn_learner_${Date.now()}`,
    utteranceId,
    speaker: 'learner',
    ukrainianText: trimmed,
    englishTranslation: initialAnalysis.englishMeaning,
    timestamp: Date.now(),
    modeAtTurn: convoState.conversationMode,
    intensityAtTurn: convoState.correctionIntensity,
    cefrAtTurn: convoState.cefrLevel,
    showTranslation: convoState.translationVisibility === 'always',
    grammarAnalysis: initialAnalysis,
  };

  convoState = {
    ...convoState,
    turns: [...convoState.turns, learnerTurn],
    recurringErrorCategories: updatedRecurring,
    activeCorrectionUtteranceId: surface.autoOpenCard
      ? utteranceId
      : convoState.activeCorrectionUtteranceId,
    activeRightPanelTab: surface.autoOpenCard
      ? 'feedback'
      : convoState.activeRightPanelTab,
    aiSpeakingState: fromLiveTranscription ? 'idle' : 'thinking',
  };
  retryFeedbackMessage = null;
  renderAIConversationTab();

  if (fromLiveTranscription) {
    return;
  }

  // 2. Request AI conversational turn from server (/api/convo/turn) with seamless local fallback
  let replyUk = '';
  let replyEn = '';
  let spokenFeedbackUk: string | undefined;
  let spokenFeedbackEn: string | undefined;
  let pronunciationTipId: string | undefined;
  let finalAnalysis: GrammarCorrectionCardData = initialAnalysis;

  try {
    const res = await fetch('/api/convo/turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        learnerTextUk: trimmed,
        utteranceId,
        conversationMode: convoState.conversationMode,
        correctionIntensity: convoState.correctionIntensity,
        cefrLevel: convoState.cefrLevel,
        formalityPreference: convoState.formalityPreference,
        scenarioId: convoState.scenarioId,
        history: convoState.turns.slice(-6).map((t) => ({
          speaker: t.speaker,
          ukrainianText: t.ukrainianText,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.replyUk) {
        replyUk = data.replyUk;
        replyEn = data.replyEn || '';
        spokenFeedbackUk = data.spokenFeedbackUk;
        spokenFeedbackEn = data.spokenFeedbackEn;
        pronunciationTipId = data.pronunciationTipId;
        if (data.analysis && data.analysis.utteranceId === utteranceId) {
          finalAnalysis = data.analysis;
        }
      }
    }
  } catch {
    // Fall back to local engine
  }

  if (!replyUk) {
    const fallback = generateLocalConversationalReply({
      learnerTextUk: trimmed,
      analysis: finalAnalysis,
      state: convoState,
    });
    replyUk = fallback.replyUk;
    replyEn = fallback.replyEn;
    spokenFeedbackUk = fallback.spokenFeedbackUk;
    spokenFeedbackEn = fallback.spokenFeedbackEn;
    pronunciationTipId = fallback.pronunciationTipId;
  }

  // Attach enriched analysis strictly to the matching utteranceId
  const updatedTurnsWithAnalysis = attachGrammarAnalysisToTurn(
    convoState.turns,
    finalAnalysis
  );

  const aiTurn: ConversationTurn = {
    id: `turn_ai_${Date.now()}`,
    utteranceId: `utt_ai_${Date.now()}`,
    speaker: 'ai',
    ukrainianText: replyUk,
    englishTranslation: replyEn,
    timestamp: Date.now(),
    modeAtTurn: convoState.conversationMode,
    intensityAtTurn: convoState.correctionIntensity,
    cefrAtTurn: convoState.cefrLevel,
    showTranslation: convoState.translationVisibility === 'always',
    spokenFeedbackUk,
    spokenFeedbackEn,
    pronunciationTipId,
  };

  if (pronunciationTipId) {
    activePronunciationGuideId = pronunciationTipId;
  }

  convoState = {
    ...convoState,
    turns: [...updatedTurnsWithAnalysis, aiTurn],
    aiSpeakingState: 'idle',
  };
  renderAIConversationTab();

  // Speak AI reply aloud
  await playConvoAudio(replyUk, convoState.speakingSpeed);
}

// ============================================================================
// MAIN RENDER FUNCTION FOR #convo-workspace-root
// ============================================================================

export function renderAIConversationTab(): void {
  const root = document.getElementById('convo-workspace-root');
  if (!root) return;

  const activeScenario = getScenarioById(convoState.scenarioId);
  const activeModeCfg = CONVERSATION_MODES[convoState.conversationMode];
  const activeIntensityCfg =
    CORRECTION_INTENSITY_OPTIONS[convoState.correctionIntensity];
  const activeCefrCfg = CEFR_LEVEL_CONFIGS[convoState.cefrLevel];

  // Find active correction card to show in the right-hand panel
  const learnerTurnsWithAnalysis = convoState.turns.filter(
    (t) => t.speaker === 'learner' && t.grammarAnalysis
  );
  const selectedTurnForCard =
    learnerTurnsWithAnalysis.find(
      (t) => t.utteranceId === convoState.activeCorrectionUtteranceId
    ) ||
    (convoState.correctionIntensity !== 'off'
      ? learnerTurnsWithAnalysis[learnerTurnsWithAnalysis.length - 1]
      : null);
  const activeCard: GrammarCorrectionCardData | null =
    selectedTurnForCard?.grammarAnalysis || null;

  const filteredScenarios = CONVERSATION_SCENARIOS.filter((s) => {
    const matchesCat =
      scenarioCategoryFilter === 'all' || s.category === scenarioCategoryFilter;
    const q = scenarioSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.titleEn.toLowerCase().includes(q) ||
      s.titleUk.toLowerCase().includes(q) ||
      s.descriptionEn.toLowerCase().includes(q) ||
      s.suggestedLevel.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const activePronGuide =
    PRONUNCIATION_GUIDES.find((g) => g.id === activePronunciationGuideId) ||
    PRONUNCIATION_GUIDES[0];

  root.innerHTML = `
    <div class="convo-shell">
      <!-- 1. TOP HEADER & PRIVACY / AI TRANSPARENCY BADGE -->
      <header class="convo-header-card">
        <div class="convo-header-top">
          <div>
            <div class="convo-eyebrow">
              <span class="convo-ai-badge">🎙️ AI Ukrainian Speaking Studio</span>
              <span class="convo-conn-pill conn-${convoState.connectionState}">
                ${
                  convoState.connectionState === 'live-voice'
                    ? '● Live 24kHz Voice Active'
                    : convoState.connectionState === 'turn-voice'
                    ? '● AI Voice & Grammar Engine Ready'
                    : '● Ready to Speak Ukrainian'
                }
              </span>
            </div>
            <h1 class="convo-main-title">AI Conversation</h1>
            <p class="convo-main-subtitle">Speak Ukrainian naturally and improve with personalized AI feedback.</p>
          </div>
          <div class="convo-header-actions">
            ${
              convoState.turns.length > 0
                ? `<button class="convo-btn-secondary" onclick="convoOpenSessionReview()" title="View post-session grammar & vocabulary summary">
                    📊 Session Review (${convoState.turns.filter((t) => t.speaker === 'learner').length} turns)
                  </button>`
                : ''
            }
            <button class="convo-btn-primary ${convoState.isSessionActive ? 'btn-end-session' : ''}" onclick="${
              convoState.isSessionActive
                ? 'convoEndSession()'
                : 'convoStartSession()'
            }">
              ${
                convoState.isSessionActive
                  ? '⏹️ End Conversation & Review'
                  : '▶️ Start Conversation'
              }
            </button>
          </div>
        </div>

        <!-- 2. TWO DISTINCT CONVERSATION MODES (PART 1) -->
        <div class="convo-section-label">
          <span>1. Choose Your AI Conversation Mode</span>
          <span class="convo-label-hint">Mode and grammar correction intensity are configured independently</span>
        </div>
        <div class="convo-mode-grid" role="radiogroup" aria-label="Conversation Mode">
          ${(['friendly', 'tutor'] as ConversationMode[])
            .map((modeId) => {
              const m = CONVERSATION_MODES[modeId];
              const isSelected = convoState.conversationMode === modeId;
              return `
                <button
                  type="button"
                  class="convo-mode-card ${isSelected ? 'active' : ''}"
                  onclick="convoSelectMode('${modeId}')"
                  aria-pressed="${isSelected}"
                  data-testid="mode-card-${modeId}"
                >
                  <div class="convo-mode-card-head">
                    <span class="convo-mode-icon">${modeId === 'friendly' ? '☕' : '🎓'}</span>
                    <div class="convo-mode-titles">
                      <div class="convo-mode-title-row">
                        <strong>${escapeHtml(m.titleEn)}</strong>
                        <span class="convo-mode-pill">${escapeHtml(m.badgeText)}</span>
                      </div>
                      <span class="convo-mode-uk">${escapeHtml(m.titleUk)}</span>
                    </div>
                    <span class="convo-radio-dot ${isSelected ? 'checked' : ''}"></span>
                  </div>
                  <p class="convo-mode-desc">${escapeHtml(m.description)}</p>
                  <div class="convo-mode-meta">
                    <span>Recommended default feedback: <strong>${escapeHtml(
                      CORRECTION_INTENSITY_OPTIONS[m.defaultCorrectionIntensity].shortLabel
                    )}</strong> (works with any setting below)</span>
                  </div>
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- 3. INDEPENDENT GRAMMAR FEEDBACK CONTROLS (PARTS 2, 3, 23) -->
        <div class="convo-feedback-config-box">
          <div class="convo-feedback-config-head">
            <div>
              <span class="convo-section-kicker">Grammar Feedback</span>
              <h2 class="convo-subhead">2. Corrections During Conversation</h2>
            </div>
            <label class="convo-review-toggle" title="Collect grammar notes and show a structured summary when the conversation ends">
              <input
                type="checkbox"
                ${convoState.includeSessionReview ? 'checked' : ''}
                onchange="convoToggleIncludeSessionReview(this.checked)"
                data-testid="toggle-include-session-review"
              />
              <span>Include Grammar Review After Session</span>
            </label>
          </div>

          <div class="convo-intensity-segmented" role="radiogroup" aria-label="Corrections During Conversation">
            ${CORRECTION_INTENSITY_ORDER.map((intId) => {
              const opt = CORRECTION_INTENSITY_OPTIONS[intId];
              const isSelected = convoState.correctionIntensity === intId;
              return `
                <button
                  type="button"
                  class="convo-intensity-btn ${isSelected ? 'active' : ''}"
                  onclick="convoSelectIntensity('${intId}')"
                  aria-pressed="${isSelected}"
                  data-testid="intensity-btn-${intId}"
                >
                  <span class="int-short">${escapeHtml(opt.shortLabel)}</span>
                  ${
                    opt.defaultForMode === convoState.conversationMode
                      ? `<span class="int-rec-dot" title="Recommended default for ${escapeHtml(
                          activeModeCfg.titleEn
                        )}">★</span>`
                      : ''
                  }
                </button>
              `;
            }).join('')}
          </div>

          <div class="convo-intensity-explain-bar" data-testid="active-intensity-explanation">
            <div class="convo-intensity-explain-main">
              <strong>${escapeHtml(activeIntensityCfg.fullLabel)}:</strong>
              <span>${escapeHtml(activeIntensityCfg.detailedBehavior)}</span>
            </div>
            <div class="convo-active-combo-badge">
              Active Pair: <strong>${escapeHtml(activeModeCfg.titleEn)}</strong> × <strong>${escapeHtml(
                activeIntensityCfg.shortLabel
              )}</strong>
            </div>
          </div>
        </div>

        <!-- 4. CEFR LEVEL, FORMALITY, SCENARIO, VOICE & SPEED CONTROLS (PARTS 5, 6, 7) -->
        <div class="convo-settings-bar">
          <div class="convo-setting-group">
            <label class="convo-field-label" for="convo-cefr-select">CEFR Level</label>
            <select
              id="convo-cefr-select"
              class="convo-select"
              onchange="convoSelectCefr(this.value)"
              data-testid="select-cefr-level"
            >
              ${CEFR_LEVEL_ORDER.map(
                (lvl) => `
                  <option value="${lvl}" ${convoState.cefrLevel === lvl ? 'selected' : ''}>
                    ${escapeHtml(CEFR_LEVEL_CONFIGS[lvl].displayLabel)} — ${escapeHtml(
                      CEFR_LEVEL_CONFIGS[lvl].titleEn
                    )}
                  </option>
                `
              ).join('')}
            </select>
          </div>

          <div class="convo-setting-group">
            <label class="convo-field-label" for="convo-formality-select">Formality («ти» vs «Ви»)</label>
            <select
              id="convo-formality-select"
              class="convo-select"
              onchange="convoSelectFormality(this.value)"
              data-testid="select-formality"
            >
              ${FORMALITY_OPTIONS.map(
                (f) => `
                  <option value="${f.id}" ${
                    convoState.formalityPreference === f.id ? 'selected' : ''
                  }>
                    ${escapeHtml(f.labelEn)}
                  </option>
                `
              ).join('')}
            </select>
          </div>

          <div class="convo-setting-group convo-scenario-select-group">
            <label class="convo-field-label" for="convo-scenario-select">Conversation Scenario (29 Topics)</label>
            <select
              id="convo-scenario-select"
              class="convo-select"
              onchange="convoSelectScenario(this.value)"
              data-testid="select-scenario"
            >
              ${CONVERSATION_SCENARIOS.map(
                (sc) => `
                  <option value="${sc.id}" ${
                    convoState.scenarioId === sc.id ? 'selected' : ''
                  }>
                    ${sc.number === 0 ? '★ ' : `${sc.number}. `}${escapeHtml(
                      sc.titleEn
                    )} (${escapeHtml(sc.suggestedLevel)})
                  </option>
                `
              ).join('')}
            </select>
          </div>

          <div class="convo-setting-group">
            <label class="convo-field-label" for="convo-voice-select">AI Voice</label>
            <select
              id="convo-voice-select"
              class="convo-select"
              onchange="convoSelectVoice(this.value)"
            >
              ${GEMINI_VOICE_OPTIONS.map(
                (v) => `
                  <option value="${v.id}" ${
                    convoState.voicePreference === v.id ? 'selected' : ''
                  }>
                    ${escapeHtml(v.label)}
                  </option>
                `
              ).join('')}
            </select>
          </div>

          <div class="convo-setting-group">
            <label class="convo-field-label" for="convo-speed-select">Speaking Speed</label>
            <select
              id="convo-speed-select"
              class="convo-select"
              onchange="convoSelectSpeed(this.value)"
            >
              ${SPEAKING_SPEED_OPTIONS.map(
                (sp) => `
                  <option value="${sp.value}" ${
                    Math.abs(convoState.speakingSpeed - sp.value) < 0.02
                      ? 'selected'
                      : ''
                  }>
                    ${escapeHtml(sp.label)}
                  </option>
                `
              ).join('')}
            </select>
          </div>
        </div>
      </header>

      <!-- 5. MAIN TWO-COLUMN CONVERSATION WORKSPACE -->
      <div class="convo-workspace-grid">
        <!-- LEFT COLUMN: LIVE CONVERSATION STAGE, TRANSCRIPT, VOICE & TEXT INPUT, QUICK HELP -->
        <div class="convo-left-stage">
          <!-- Active Scenario Banner -->
          <div class="convo-scenario-banner">
            <div class="convo-scenario-banner-main">
              <span class="convo-scenario-num-badge">
                ${activeScenario.number === 0 ? 'Free Topic' : `Scenario #${activeScenario.number}`}
              </span>
              <strong>${escapeHtml(activeScenario.titleEn)}</strong>
              <span class="convo-scenario-uk-sub">(${escapeHtml(activeScenario.titleUk)})</span>
              <span class="convo-cefr-pill">${escapeHtml(activeCefrCfg.displayLabel)}</span>
            </div>
            <div class="convo-scenario-role-row">
              <span>🎭 <strong>AI Role:</strong> ${escapeHtml(activeScenario.aiRoleEn)}</span>
              <div class="convo-transcript-controls">
                <button
                  type="button"
                  class="convo-mini-btn"
                  onclick="convoToggleTranscriptVisibility()"
                >
                  ${convoState.transcriptVisibility ? '👁️ Hide Transcript' : '👁️ Show Transcript'}
                </button>
                <button
                  type="button"
                  class="convo-mini-btn"
                  onclick="convoCycleTranslationMode()"
                >
                  🌐 Translations: ${
                    convoState.translationVisibility === 'always'
                      ? 'Always Shown'
                      : convoState.translationVisibility === 'on-demand'
                      ? 'On Demand'
                      : 'Hidden'
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Manual Help Toast if active -->
          ${
            manualHelpToast
              ? `
                <div class="convo-help-toast" role="status">
                  <div class="convo-help-toast-head">
                    <strong>💡 ${escapeHtml(manualHelpToast.titleEn)}</strong>
                    <div class="convo-help-toast-actions">
                      <button type="button" class="convo-mini-btn" onclick="convoPlayText('${escapeHtml(
                        manualHelpToast.responseUk
                      )}')">🔊 Hear Ukrainian</button>
                      <button type="button" class="convo-mini-btn" onclick="convoUseSuggestedStarter('${escapeHtml(
                        manualHelpToast.responseUk
                      )}')">💬 Use in Chat</button>
                      <button type="button" class="convo-mini-btn" onclick="convoDismissHelpToast()">✕</button>
                    </div>
                  </div>
                  <div class="convo-help-toast-uk">${escapeHtml(manualHelpToast.responseUk)}</div>
                  <div class="convo-help-toast-en">${escapeHtml(manualHelpToast.responseEn)}</div>
                </div>
              `
              : ''
          }

          <!-- Synchronized Live Transcript -->
          <div class="convo-transcript-container ${
            convoState.transcriptVisibility ? '' : 'transcript-collapsed'
          }" id="convo-transcript-scroll">
            ${
              !convoState.transcriptVisibility
                ? `<div class="convo-transcript-hidden-placeholder">
                    <p>🎧 Live transcript is hidden so you can focus purely on listening and speaking.</p>
                    <button type="button" class="convo-btn-secondary" onclick="convoToggleTranscriptVisibility()">Show Transcript</button>
                  </div>`
                : convoState.turns.length === 0
                ? `<div class="convo-empty-stage">
                    <div class="convo-empty-icon">${
                      convoState.conversationMode === 'tutor' ? '🎓' : '🎙️'
                    }</div>
                    <h3>Ready to Practice Ukrainian in <strong>${escapeHtml(
                      activeModeCfg.titleEn
                    )}</strong> Mode</h3>
                    <p>${escapeHtml(activeScenario.descriptionEn)}</p>
                    <div class="convo-starter-chips">
                      <span class="convo-chips-label">Try starting with one of these Ukrainian phrases:</span>
                      ${activeScenario.suggestedLearnerStarters
                        .map(
                          (st) => `
                            <button
                              type="button"
                              class="convo-starter-chip"
                              onclick="convoSubmitStarter('${escapeHtml(st.uk)}')"
                            >
                              <span class="chip-uk">«${escapeHtml(st.uk)}»</span>
                              <span class="chip-en">${escapeHtml(st.en)}</span>
                            </button>
                          `
                        )
                        .join('')}
                    </div>
                  </div>`
                : convoState.turns
                    .map((turn) => renderTranscriptTurn(turn))
                    .join('')
            }
          </div>

          <!-- Voice & Text Input Bar -->
          <div class="convo-input-dock">
            <div class="convo-voice-controls-row">
              <button
                type="button"
                class="convo-mic-btn mic-${convoState.microphoneState}"
                onclick="convoToggleMicrophone()"
                data-testid="btn-microphone"
              >
                <span class="mic-icon">${
                  convoState.microphoneState === 'listening'
                    ? '🔴'
                    : convoState.microphoneState === 'muted'
                    ? '🔇'
                    : '🎙️'
                }</span>
                <span>${
                  convoState.microphoneState === 'listening'
                    ? 'Listening in Ukrainian... (Tap to Stop)'
                    : 'Speak Ukrainian (Mic)'
                }</span>
              </button>

              <div class="convo-text-input-wrap">
                <input
                  type="text"
                  id="convo-text-input"
                  class="convo-text-input"
                  placeholder="Speak with mic or type in Ukrainian here (e.g., Привіт! Я живу у Львові)..."
                  onkeydown="if(event.key==='Enter'){event.preventDefault();convoSubmitTextInput();}"
                  data-testid="input-ukrainian-turn"
                />
                <button
                  type="button"
                  class="convo-send-btn"
                  onclick="convoSubmitTextInput()"
                  data-testid="btn-send-turn"
                >
                  Send ↵
                </button>
              </div>
            </div>

            <!-- 9 Manual Learner Help Actions (Part 15 — Always Available Even When Corrections = Off) -->
            <div class="convo-quick-help-bar" aria-label="Learner Help Actions">
              <span class="convo-help-bar-label">Need Help?</span>
              <div class="convo-help-buttons-row">
                ${MANUAL_HELP_ACTIONS.map(
                  (act) => `
                    <button
                      type="button"
                      class="convo-help-chip"
                      onclick="convoTriggerHelpAction('${act.id}')"
                      title="${escapeHtml(act.tooltipEn)}"
                      data-testid="help-btn-${act.id}"
                    >
                      <span>${act.icon}</span>
                      <span>${escapeHtml(act.labelEn)}</span>
                    </button>
                  `
                ).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: GRAMMAR CORRECTION CARD, 3-LEVEL BREAKDOWN, NATURAL ALTERNATIVES, PRONUNCIATION & SCENARIOS -->
        <aside class="convo-right-coach" aria-label="Grammar Coaching & Scenarios">
          <div class="convo-coach-tabs" role="tablist">
            <button
              type="button"
              class="convo-coach-tab ${
                convoState.activeRightPanelTab === 'feedback' ? 'active' : ''
              }"
              onclick="convoSelectRightTab('feedback')"
              data-testid="right-tab-feedback"
            >
              📐 Grammar Card
            </button>
            <button
              type="button"
              class="convo-coach-tab ${
                convoState.activeRightPanelTab === 'alternatives' ? 'active' : ''
              }"
              onclick="convoSelectRightTab('alternatives')"
              data-testid="right-tab-alternatives"
            >
              ✨ More Natural
            </button>
            <button
              type="button"
              class="convo-coach-tab ${
                convoState.activeRightPanelTab === 'pronunciation' ? 'active' : ''
              }"
              onclick="convoSelectRightTab('pronunciation')"
              data-testid="right-tab-pronunciation"
            >
              🗣️ Pronunciation
            </button>
            <button
              type="button"
              class="convo-coach-tab ${
                convoState.activeRightPanelTab === 'scenario' ? 'active' : ''
              }"
              onclick="convoSelectRightTab('scenario')"
              data-testid="right-tab-scenario"
            >
              🗺️ 29 Scenarios
            </button>
          </div>

          <div class="convo-coach-body">
            ${
              convoState.activeRightPanelTab === 'feedback'
                ? renderGrammarCorrectionCardPanel(activeCard)
                : convoState.activeRightPanelTab === 'alternatives'
                ? renderMoreNaturalAlternativesPanel(activeCard, activeScenario)
                : convoState.activeRightPanelTab === 'pronunciation'
                ? renderPronunciationCoachPanel(activePronGuide)
                : renderScenarioBrowserPanel(filteredScenarios, activeScenario)
            }
          </div>
        </aside>
      </div>

      <!-- 6. FOOTER PRIVACY, MICROPHONE & AI DISCLOSURE -->
      <footer class="convo-privacy-footer">
        <div class="convo-privacy-text">
          <strong>🔒 Privacy & AI Transparency:</strong> You are speaking with LangoUA’s AI Ukrainian partner/tutor powered by server-side Gemini models. Microphone audio is used strictly for live Ukrainian transcription and conversation, and your preferences are saved locally in your browser.
        </div>
        <button
          type="button"
          class="convo-mini-btn danger-text"
          onclick="convoDeleteHistory()"
          data-testid="btn-clear-convo-history"
        >
          🗑️ Delete Conversation History
        </button>
      </footer>

      <!-- 7. MODALS: "HOW DO I SAY THIS?" & END-OF-SESSION REVIEW -->
      ${showHowToSayModal ? renderHowToSayModal() : ''}
      ${showSessionReviewModal ? renderSessionReviewModal() : ''}
    </div>
  `;
}

// ============================================================================
// SUB-RENDERERS FOR TRANSCRIPT TURNS & RIGHT-HAND COACHING PANELS
// ============================================================================

function renderTranscriptTurn(turn: ConversationTurn): string {
  const isAi = turn.speaker === 'ai';
  const analysis = turn.grammarAnalysis;
  const surface = analysis
    ? shouldSurfaceLiveCorrection(
        analysis,
        convoState.correctionIntensity,
        convoState.recurringErrorCategories
      )
    : { showInlineBadge: false, autoOpenCard: false, speakCorrectionAloud: false };

  const shouldShowTranslation =
    convoState.translationVisibility === 'always' || turn.showTranslation;

  let badgeHtml = '';
  if (!isAi && analysis && surface.showInlineBadge) {
    const isSelected =
      convoState.activeCorrectionUtteranceId === turn.utteranceId;
    if (analysis.status === 'incorrect-grammar') {
      badgeHtml = `
        <button
          type="button"
          class="convo-turn-badge badge-fix ${isSelected ? 'selected' : ''}"
          onclick="convoInspectTurnCorrection('${turn.utteranceId}')"
          data-testid="correction-badge-${turn.utteranceId}"
        >
          📐 Grammar Correction: «${escapeHtml(analysis.correctUkrainian)}» — Inspect
        </button>
      `;
    } else if (analysis.status === 'correct-but-unnatural') {
      badgeHtml = `
        <button
          type="button"
          class="convo-turn-badge badge-style ${isSelected ? 'selected' : ''}"
          onclick="convoInspectTurnCorrection('${turn.utteranceId}')"
          data-testid="correction-badge-${turn.utteranceId}"
        >
          💡 Natural Phrasing Tip: «${escapeHtml(analysis.correctUkrainian)}»
        </button>
      `;
    }
  } else if (
    !isAi &&
    analysis &&
    convoState.correctionIntensity !== 'off' &&
    (analysis.status === 'correct-and-natural' ||
      analysis.status === 'acceptable-colloquial')
  ) {
    badgeHtml = `
      <button
        type="button"
        class="convo-turn-badge badge-ok"
        onclick="convoInspectTurnCorrection('${turn.utteranceId}')"
      >
        ✓ ${
          analysis.status === 'acceptable-colloquial'
            ? 'Natural Spoken Ukrainian'
            : 'Accurate Ukrainian'
        }
      </button>
    `;
  }

  return `
    <article class="convo-turn-bubble ${isAi ? 'turn-ai' : 'turn-learner'}" data-utterance-id="${
      turn.utteranceId
    }">
      <div class="convo-turn-header">
        <span class="convo-speaker-tag">
          ${
            isAi
              ? convoState.conversationMode === 'tutor'
                ? '🎓 AI Ukrainian Tutor'
                : '☕ AI Conversation Partner'
              : '🗣️ You (Ukrainian)'
          }
        </span>
        <div class="convo-turn-tools">
          <button
            type="button"
            class="convo-icon-btn"
            onclick="convoPlayText('${escapeHtml(turn.ukrainianText)}', 1.0)"
            title="Replay Ukrainian audio"
          >🔊</button>
          <button
            type="button"
            class="convo-icon-btn"
            onclick="convoPlayText('${escapeHtml(turn.ukrainianText)}', 0.82)"
            title="Replay slowly (0.82×)"
          >🐢</button>
          <button
            type="button"
            class="convo-icon-btn"
            onclick="convoToggleTurnTranslation('${turn.id}')"
            title="Show or hide English translation"
          >🌐</button>
          ${
            !isAi
              ? `<button
                  type="button"
                  class="convo-icon-btn"
                  onclick="convoStartEditingTurn('${turn.utteranceId}')"
                  title="Edit speech transcription text"
                >✏️</button>`
              : ''
          }
        </div>
      </div>

      ${
        editingUtteranceId === turn.utteranceId
          ? `<div class="convo-edit-turn-box">
              <input
                type="text"
                id="edit-input-${turn.utteranceId}"
                class="convo-text-input"
                value="${escapeHtml(turn.ukrainianText)}"
              />
              <button type="button" class="convo-mini-btn" onclick="convoSaveEditedTurn('${
                turn.utteranceId
              }')">Save & Re-Analyze</button>
              <button type="button" class="convo-mini-btn" onclick="convoCancelEditTurn()">Cancel</button>
            </div>`
          : `<div class="convo-turn-uk">${renderClickableUkrainianWords(
              turn.ukrainianText
            )}</div>`
      }

      ${
        shouldShowTranslation && turn.englishTranslation
          ? `<div class="convo-turn-en">${escapeHtml(turn.englishTranslation)}</div>`
          : ''
      }

      ${badgeHtml ? `<div class="convo-turn-badge-row">${badgeHtml}</div>` : ''}
    </article>
  `;
}

function renderGrammarCorrectionCardPanel(
  card: GrammarCorrectionCardData | null
): string {
  if (!card) {
    return `
      <div class="convo-coach-empty">
        <div class="convo-coach-empty-icon">📐</div>
        <h4>Interactive Grammar Correction Card</h4>
        <p>
          ${
            convoState.correctionIntensity === 'off'
              ? 'Corrections During Conversation is set to <strong>Off</strong> so you can speak without live interruptions. You can still click <strong>"✅ Correct My Last Sentence"</strong> or <strong>"📐 Explain My Grammar"</strong> below the chat anytime!'
              : 'Speak or type a sentence in Ukrainian (or click any turn badge in the transcript) to inspect its grammar, 3-level explanation, and retry exercise here.'
          }
        </p>
      </div>
    `;
  }

  const adv = card.explanationLevels.advanced;

  return `
    <div class="convo-grammar-card" data-testid="grammar-correction-card">
      <div class="convo-gcard-status status-${card.status}">
        <span class="gcard-status-pill">
          ${
            card.status === 'incorrect-grammar'
              ? '⚠️ Grammar Correction'
              : card.status === 'correct-but-unnatural'
              ? '💡 Phrasing & Euphony Refinement'
              : card.status === 'acceptable-colloquial'
              ? '✨ Authentic Colloquial Ukrainian'
              : card.status === 'uncertain-transcription'
              ? '🎙️ Transcription Check'
              : '✅ Accurate & Natural Ukrainian'
          }
        </span>
        <span class="gcard-cat-label">${escapeHtml(card.categoryLabelEn)}</span>
      </div>

      <!-- PART 10 REQUIRED FIELDS: YOU SAID, CORRECT UKRAINIAN, ENGLISH, WHAT CHANGED, GRAMMAR, ADDITIONAL EXAMPLE, PRACTICE -->
      <div class="convo-gcard-rows">
        <div class="convo-gcard-row">
          <span class="gcard-field-tag">YOU SAID</span>
          <div class="gcard-field-val gcard-you-said">${escapeHtml(card.youSaidUk)}</div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">CORRECT UKRAINIAN</span>
          <div class="gcard-field-val gcard-correct-uk">
            <span>${renderClickableUkrainianWords(card.correctUkrainian)}</span>
            <button
              type="button"
              class="convo-mini-btn"
              onclick="convoPlayText('${escapeHtml(card.correctUkrainian)}', 0.92)"
            >🔊 Hear Correct Pronunciation</button>
          </div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">ENGLISH</span>
          <div class="gcard-field-val">${escapeHtml(card.englishMeaning)}</div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">WHAT CHANGED</span>
          <div class="gcard-field-val">${escapeHtml(card.whatChangedSummary)}</div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">GRAMMAR</span>
          <div class="gcard-field-val">${escapeHtml(card.grammarRuleSummary)}</div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">ADDITIONAL EXAMPLE</span>
          <div class="gcard-field-val">
            <div class="gcard-ex-uk">${escapeHtml(card.additionalExampleUk)}</div>
            <div class="gcard-ex-en">${escapeHtml(card.additionalExampleEn)}</div>
          </div>
        </div>

        <div class="convo-gcard-row">
          <span class="gcard-field-tag">PRACTICE</span>
          <div class="gcard-field-val">
            <div>${escapeHtml(card.practicePromptEn)}</div>
            <div class="gcard-practice-target">«${escapeHtml(card.practiceTargetUk)}»</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Required by Part 10 -->
      <div class="convo-gcard-actions">
        <button
          type="button"
          class="convo-mini-btn"
          onclick="convoPlayText('${escapeHtml(card.correctUkrainian)}', 0.9)"
        >🔊 Hear Correct Pronunciation</button>
        <button
          type="button"
          class="convo-mini-btn"
          onclick="convoFocusRetryInput('${escapeHtml(card.correctUkrainian)}')"
        >🔁 Try Again</button>
        <button
          type="button"
          class="convo-mini-btn"
          onclick="convoSelectExplanationLevel('detailed')"
        >📖 Detailed Grammar</button>
        <button
          type="button"
          class="convo-mini-btn"
          onclick="convoSelectRightTab('alternatives')"
        >✨ More Natural Alternatives</button>
      </div>

      <!-- PART 11: 3-LEVEL GRAMMAR EXPLANATION SYSTEM (SIMPLE / DETAILED / ADVANCED) -->
      <div class="convo-exp-levels-box">
        <div class="convo-exp-tabs" role="tablist" aria-label="Grammar Explanation Depth">
          <button
            type="button"
            class="convo-exp-tab ${
              convoState.activeExplanationLevel === 'simple' ? 'active' : ''
            }"
            onclick="convoSelectExplanationLevel('simple')"
            data-testid="exp-level-simple"
          >Level 1: Simple</button>
          <button
            type="button"
            class="convo-exp-tab ${
              convoState.activeExplanationLevel === 'detailed' ? 'active' : ''
            }"
            onclick="convoSelectExplanationLevel('detailed')"
            data-testid="exp-level-detailed"
          >Level 2: Detailed</button>
          <button
            type="button"
            class="convo-exp-tab ${
              convoState.activeExplanationLevel === 'advanced' ? 'active' : ''
            }"
            onclick="convoSelectExplanationLevel('advanced')"
            data-testid="exp-level-advanced"
          >Level 3: Advanced Table</button>
        </div>

        <div class="convo-exp-content">
          ${
            convoState.activeExplanationLevel === 'simple'
              ? `<p>${escapeHtml(card.explanationLevels.simple)}</p>`
              : convoState.activeExplanationLevel === 'detailed'
              ? `<p>${escapeHtml(card.explanationLevels.detailed)}</p>`
              : `
                <div class="convo-adv-box">
                  <p><strong>Linguistic Rule:</strong> ${escapeHtml(
                    adv.linguisticSummary
                  )}</p>
                  <p><strong>Morphology:</strong> ${escapeHtml(
                    adv.morphologicalNote
                  )}</p>
                  <p><strong>Notes & Exceptions:</strong> ${escapeHtml(
                    adv.exceptionsNote
                  )}</p>
                  <div class="convo-adv-table-wrap">
                    <div class="convo-adv-table-title">${escapeHtml(
                      adv.tableTitle
                    )}</div>
                    <table class="convo-adv-table">
                      <thead>
                        <tr>
                          <th>Case / Form</th>
                          <th>Ukrainian</th>
                          <th>Function</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${adv.tableRows
                          .map(
                            (r) => `
                              <tr class="${r.isTargetForm ? 'target-row' : ''}">
                                <td>${escapeHtml(r.formLabel)}</td>
                                <td><strong>${escapeHtml(r.ukrainianForm)}</strong></td>
                                <td>${escapeHtml(r.englishNote)}</td>
                              </tr>
                            `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                  <div class="convo-adv-links">
                    <button
                      type="button"
                      class="convo-mini-btn"
                      onclick="convoOpenCourseModule('${escapeHtml(
                        adv.relatedCourseModuleId
                      )}')"
                    >
                      📚 Open Course Module ${escapeHtml(
                        adv.relatedCourseModuleId
                      )}: ${escapeHtml(adv.relatedCourseModuleTitle)}
                    </button>
                    ${
                      adv.inspectWordUk
                        ? `<button
                            type="button"
                            class="convo-mini-btn"
                            onclick="convoInspectWord('${escapeHtml(
                              adv.inspectWordUk
                            )}')"
                          >🔍 Open 7-Case Inspector («${escapeHtml(
                            adv.inspectWordUk
                          )}»)</button>`
                        : ''
                    }
                  </div>
                </div>
              `
          }
        </div>
      </div>

      <!-- PART 14: TUTOR PRACTICE EXERCISE / RETRY DRILL -->
      <div class="convo-retry-drill-box">
        <div class="convo-retry-head">
          <strong>🎯 ${escapeHtml(card.tutorExercise.titleEn)}</strong>
          <span class="convo-retry-focus">${escapeHtml(
            card.tutorExercise.grammarFocus
          )}</span>
        </div>
        <p class="convo-retry-prompt">${escapeHtml(card.tutorExercise.promptEn)}</p>
        <div class="convo-retry-model">Model: «${escapeHtml(
          card.tutorExercise.promptUk
        )}»</div>
        <div class="convo-retry-input-row">
          <input
            type="text"
            id="convo-retry-input"
            class="convo-text-input"
            placeholder="Type or speak the practiced Ukrainian sentence..."
            value="${escapeHtml(card.tutorExercise.expectedAnswerUk)}"
          />
          <button
            type="button"
            class="convo-mini-btn"
            onclick="convoCheckRetryDrill('${card.utteranceId}')"
          >✓ Check Retry</button>
        </div>
        ${
          retryFeedbackMessage
            ? `<div class="convo-retry-feedback ${
                retryFeedbackMessage.ok ? 'ok' : 'hint'
              }">${escapeHtml(retryFeedbackMessage.text)}</div>`
            : ''
        }
      </div>

      <!-- PART 18: KEY VOCABULARY WITH + ADD TO FLASHCARDS & 7-CASE INSPECTOR -->
      ${
        card.keyVocabularyWords.length > 0
          ? `<div class="convo-card-vocab-box">
              <div class="convo-card-vocab-title">Key Vocabulary in This Turn</div>
              <div class="convo-card-vocab-list">
                ${card.keyVocabularyWords
                  .map(
                    (v) => `
                      <div class="convo-vocab-item">
                        <div>
                          <strong>${escapeHtml(v.uk)}</strong> — <span>${escapeHtml(
                            v.en
                          )}</span>
                          <small>(${escapeHtml(v.pos)})</small>
                        </div>
                        <div class="convo-vocab-btns">
                          <button
                            type="button"
                            class="convo-mini-btn"
                            onclick="convoInspectWord('${escapeHtml(v.uk)}')"
                          >7 Cases</button>
                          <button
                            type="button"
                            class="convo-mini-btn"
                            onclick="convoAddWordToFlashcards('${escapeHtml(
                              v.uk
                            )}', this)"
                          >+ Add to Flashcards</button>
                        </div>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>`
          : ''
      }
    </div>
  `;
}

function renderMoreNaturalAlternativesPanel(
  card: GrammarCorrectionCardData | null,
  scenario: ReturnType<typeof getScenarioById>
): string {
  const alt = card?.naturalAlternatives || {
    originalSentenceUk: scenario.keyPhrases[0].uk,
    correctedGrammarUk: scenario.keyPhrases[0].uk,
    casualUk: scenario.keyPhrases[0].uk,
    casualNoteEn: 'Friendly everyday phrasing.',
    neutralUk: scenario.keyPhrases[1]?.uk || scenario.keyPhrases[0].uk,
    neutralNoteEn: 'Standard neutral Ukrainian.',
    formalUk: scenario.keyPhrases[2]?.uk || scenario.keyPhrases[0].uk,
    formalNoteEn: 'Polite formal Ukrainian.',
    colloquialUk: 'О, кла́сно! Дава́й так і зро́бимо!',
    colloquialNoteEn: 'Relaxed spoken Ukrainian among close friends.',
  };

  const registers = [
    {
      badge: 'Casual (Дру́жній)',
      uk: alt.casualUk,
      note: alt.casualNoteEn,
    },
    {
      badge: 'Neutral Standard (Нейтра́льний)',
      uk: alt.neutralUk,
      note: alt.neutralNoteEn,
    },
    {
      badge: 'Formal / Polite (Офіці́йний «Ви»)',
      uk: alt.formalUk,
      note: alt.formalNoteEn,
    },
    {
      badge: 'Colloquial Spoken (Живи́й розмо́вний)',
      uk: alt.colloquialUk,
      note: alt.colloquialNoteEn,
    },
  ];

  return `
    <div class="convo-alternatives-panel" data-testid="more-natural-panel">
      <h4>✨ Say It More Naturally</h4>
      <p class="convo-panel-sub">
        Compare how native Ukrainian speakers express this thought across casual, neutral, formal, and colloquial registers:
      </p>
      <div class="convo-alt-base">
        <span>Your / Base Sentence:</span>
        <strong>«${escapeHtml(alt.originalSentenceUk)}»</strong>
      </div>
      <div class="convo-alt-list">
        ${registers
          .map(
            (r) => `
              <div class="convo-alt-card">
                <div class="convo-alt-card-head">
                  <span class="convo-alt-badge">${escapeHtml(r.badge)}</span>
                  <div class="convo-alt-btns">
                    <button
                      type="button"
                      class="convo-mini-btn"
                      onclick="convoPlayText('${escapeHtml(r.uk)}', 0.95)"
                    >🔊 Hear</button>
                    <button
                      type="button"
                      class="convo-mini-btn"
                      onclick="convoUseSuggestedStarter('${escapeHtml(r.uk)}')"
                    >💬 Use</button>
                  </div>
                </div>
                <div class="convo-alt-uk">«${escapeHtml(r.uk)}»</div>
                <div class="convo-alt-note">${escapeHtml(r.note)}</div>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderPronunciationCoachPanel(
  activeGuide: (typeof PRONUNCIATION_GUIDES)[number]
): string {
  return `
    <div class="convo-pronunciation-panel" data-testid="pronunciation-coach-panel">
      <h4>🗣️ Ukrainian Pronunciation & Stress Coach</h4>
      <div class="convo-pron-pills">
        ${PRONUNCIATION_GUIDES.map(
          (g) => `
            <button
              type="button"
              class="convo-pron-pill ${g.id === activeGuide.id ? 'active' : ''}"
              onclick="convoSelectPronGuide('${g.id}')"
            >
              ${escapeHtml(g.contrastLabelUk)}
            </button>
          `
        ).join('')}
      </div>

      <div class="convo-pron-card">
        <h5>${escapeHtml(activeGuide.titleEn)}</h5>
        <p><strong>How to Articulate:</strong> ${escapeHtml(
          activeGuide.articulationEn
        )}</p>
        <p><strong>Common Learner Habit to Avoid:</strong> ${escapeHtml(
          activeGuide.commonLearnerHabitEn
        )}</p>

        <div class="convo-pron-pairs">
          ${activeGuide.minimalPairs
            .map(
              (mp) => `
                <div class="convo-pron-pair-item">
                  <div class="convo-pron-pair-words">
                    <button
                      type="button"
                      class="convo-mini-btn"
                      onclick="convoPlayText('${escapeHtml(mp.wordUk)}', 0.85)"
                    >🔊 ${escapeHtml(mp.wordUk)}</button>
                    <span>(${escapeHtml(mp.wordEn)})</span>
                    <span>↔</span>
                    <button
                      type="button"
                      class="convo-mini-btn"
                      onclick="convoPlayText('${escapeHtml(
                        mp.contrastWordUk
                      )}', 0.85)"
                    >🔊 ${escapeHtml(mp.contrastWordUk)}</button>
                    <span>(${escapeHtml(mp.contrastWordEn)})</span>
                  </div>
                  <div class="convo-pron-pair-note">${escapeHtml(mp.noteEn)}</div>
                </div>
              `
            )
            .join('')}
        </div>

        <div class="convo-pron-sentence-box">
          <div class="convo-pron-sentence-head">
            <strong>Repeat After Me (Practice Sentence):</strong>
            <div>
              <button
                type="button"
                class="convo-mini-btn"
                onclick="convoPlayText('${escapeHtml(
                  activeGuide.practiceSentenceUk
                )}', 1.0)"
              >🔊 Normal (1.0×)</button>
              <button
                type="button"
                class="convo-mini-btn"
                onclick="convoPlayText('${escapeHtml(
                  activeGuide.practiceSentenceUk
                )}', 0.82)"
              >🐢 Slow (0.82×)</button>
            </div>
          </div>
          <div class="convo-pron-uk">«${escapeHtml(
            activeGuide.practiceSentenceUk
          )}»</div>
          <div class="convo-pron-en">${escapeHtml(
            activeGuide.practiceSentenceEn
          )}</div>
        </div>
      </div>
    </div>
  `;
}

function renderScenarioBrowserPanel(
  scenarios: typeof CONVERSATION_SCENARIOS,
  activeScenario: ReturnType<typeof getScenarioById>
): string {
  return `
    <div class="convo-scenarios-panel" data-testid="scenarios-browser-panel">
      <div class="convo-active-scenario-summary">
        <div class="convo-asc-head">
          <strong>Active: ${escapeHtml(activeScenario.titleEn)}</strong>
          <button
            type="button"
            class="convo-mini-btn"
            onclick="convoOpenCourseModule('${escapeHtml(
              activeScenario.relatedCourseModuleId
            )}')"
          >📚 Course ${escapeHtml(activeScenario.relatedCourseModuleId)}</button>
        </div>
        <ul class="convo-asc-objectives">
          ${activeScenario.learningObjectives
            .map((obj) => `<li>${escapeHtml(obj)}</li>`)
            .join('')}
        </ul>
        <div class="convo-asc-phrases">
          ${activeScenario.keyPhrases
            .map(
              (kp) => `
                <div class="convo-asc-phrase">
                  <div class="convo-asc-phrase-top">
                    <strong>«${escapeHtml(kp.uk)}»</strong>
                    <div>
                      <button type="button" class="convo-mini-btn" onclick="convoPlayText('${escapeHtml(
                        kp.uk
                      )}', 0.92)">🔊</button>
                      <button type="button" class="convo-mini-btn" onclick="convoUseSuggestedStarter('${escapeHtml(
                        kp.uk
                      )}')">💬 Use</button>
                    </div>
                  </div>
                  <div>${escapeHtml(kp.en)} · <em>${escapeHtml(kp.grammarNote)}</em></div>
                </div>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="convo-scenario-filter-row">
        <input
          type="text"
          class="convo-text-input"
          placeholder="Search all 29 scenarios..."
          value="${escapeHtml(scenarioSearchQuery)}"
          oninput="convoFilterScenarioSearch(this.value)"
        />
      </div>

      <div class="convo-scenario-cards-list">
        ${scenarios
          .map(
            (sc) => `
              <button
                type="button"
                class="convo-scenario-item ${
                  sc.id === activeScenario.id ? 'active' : ''
                }"
                onclick="convoSelectScenario('${sc.id}')"
              >
                <div class="convo-sc-item-top">
                  <strong>${
                    sc.number === 0 ? '★ ' : `${sc.number}. `
                  }${escapeHtml(sc.titleEn)}</strong>
                  <span class="convo-cefr-pill">${escapeHtml(
                    sc.suggestedLevel
                  )}</span>
                </div>
                <div class="convo-sc-item-uk">${escapeHtml(sc.titleUk)} · Role: ${escapeHtml(
                  sc.aiRoleEn
                )}</div>
              </button>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderHowToSayModal(): string {
  return `
    <div class="convo-modal-backdrop" onclick="convoCloseHowToSayModal()">
      <div class="convo-modal-card" onclick="event.stopPropagation()">
        <div class="convo-modal-head">
          <h3>🗣️ How Do I Say This in Ukrainian?</h3>
          <button type="button" class="convo-mini-btn" onclick="convoCloseHowToSayModal()">✕</button>
        </div>
        <p>Type an English sentence or idea below, and LangoUA will show you how to say it naturally in Ukrainian at your current CEFR level (${escapeHtml(
          convoState.cefrLevel
        )}):</p>
        <div class="convo-modal-input-row">
          <input
            type="text"
            id="convo-how-to-say-input"
            class="convo-text-input"
            placeholder="e.g., May I please have a coffee with milk?"
            onkeydown="if(event.key==='Enter'){event.preventDefault();convoSubmitHowToSay();}"
          />
          <button type="button" class="convo-btn-primary" onclick="convoSubmitHowToSay()">
            Translate & Explain
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSessionReviewModal(): string {
  const review =
    convoState.lastSessionReview || generateSessionReview(convoState);

  return `
    <div class="convo-modal-backdrop" onclick="convoCloseSessionReviewModal()">
      <div class="convo-modal-card convo-review-modal" onclick="event.stopPropagation()" data-testid="session-review-modal">
        <div class="convo-modal-head">
          <div>
            <span class="convo-section-kicker">Post-Conversation Summary</span>
            <h3>📊 End-of-Session Ukrainian Review</h3>
          </div>
          <button type="button" class="convo-mini-btn" onclick="convoCloseSessionReviewModal()">✕ Close</button>
        </div>

        <!-- 1. Session Overview -->
        <div class="convo-review-stats-grid">
          <div class="convo-stat-box">
            <span class="stat-label">Mode</span>
            <strong>${escapeHtml(CONVERSATION_MODES[review.mode].titleEn)}</strong>
          </div>
          <div class="convo-stat-box">
            <span class="stat-label">Live Corrections Setting</span>
            <strong>${escapeHtml(
              CORRECTION_INTENSITY_OPTIONS[review.correctionIntensity].shortLabel
            )}</strong>
          </div>
          <div class="convo-stat-box">
            <span class="stat-label">Scenario & CEFR</span>
            <strong>${escapeHtml(review.scenarioTitleEn)} (${escapeHtml(
              review.cefrLevel
            )})</strong>
          </div>
          <div class="convo-stat-box">
            <span class="stat-label">Learner Turns</span>
            <strong>${review.learnerTurnCount} turns (${review.durationSeconds}s)</strong>
          </div>
        </div>

        <!-- 2. Grammar Review (Respects includeSessionReview) -->
        ${
          !review.includeSessionReview
            ? `<div class="convo-review-section">
                <h4>Grammar Review Disabled for This Session</h4>
                <p>You turned off "Include Grammar Review After Session". Turn it back on anytime if you would like a post-session grammar breakdown.</p>
              </div>`
            : review.correctedSentences.length === 0
            ? `<div class="convo-review-section">
                <h4>✅ Zero Grammar Errors Detected!</h4>
                <p>Every Ukrainian turn in this session was grammatically accurate or natural colloquial Ukrainian.</p>
              </div>`
            : `
              <div class="convo-review-section">
                <h4>📐 Grammar Review by Topic (${review.groupedGrammarReview.length} Categories)</h4>
                ${review.groupedGrammarReview
                  .map(
                    (grp) => `
                      <div class="convo-review-group-card">
                        <div class="convo-review-group-head">
                          <strong>${escapeHtml(grp.categoryLabelEn)}</strong>
                          <span class="convo-cefr-pill">${grp.count}×</span>
                        </div>
                        <p>${escapeHtml(grp.summaryNoteEn)}</p>
                        ${grp.items
                          .map(
                            (it) => `
                              <div class="convo-review-corr-item">
                                <div><span class="bad-uk">✗ «${escapeHtml(
                                  it.youSaidUk
                                )}»</span> → <strong class="good-uk">✓ «${escapeHtml(
                                  it.correctedUk
                                )}»</strong></div>
                                <div class="corr-note">${escapeHtml(
                                  it.ruleNoteEn
                                )}</div>
                              </div>
                            `
                          )
                          .join('')}
                      </div>
                    `
                  )
                  .join('')}
              </div>
            `
        }

        <!-- 3. Natural Ukrainian Expressions Practiced -->
        <div class="convo-review-section">
          <h4>✨ Natural Ukrainian Expressions</h4>
          <div class="convo-review-expr-list">
            ${review.naturalExpressionsLearned
              .map(
                (ex) => `
                  <div class="convo-review-expr-item">
                    <div>
                      <strong>«${escapeHtml(ex.uk)}»</strong> — <span>${escapeHtml(
                        ex.en
                      )}</span>
                    </div>
                    <button type="button" class="convo-mini-btn" onclick="convoPlayText('${escapeHtml(
                      ex.uk
                    )}', 0.95)">🔊 Hear</button>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>

        <!-- 4. Vocabulary to Add to Flashcards -->
        <div class="convo-review-section">
          <h4>🗂️ Session Vocabulary (Save to FSRS Flashcards)</h4>
          <div class="convo-card-vocab-list">
            ${review.vocabularyToReview
              .map(
                (v) => `
                  <div class="convo-vocab-item">
                    <div>
                      <strong>${escapeHtml(v.uk)}</strong> — <span>${escapeHtml(
                        v.en
                      )}</span>
                    </div>
                    <div class="convo-vocab-btns">
                      <button type="button" class="convo-mini-btn" onclick="convoInspectWord('${escapeHtml(
                        v.uk
                      )}')">7 Cases</button>
                      <button type="button" class="convo-mini-btn" onclick="convoAddWordToFlashcards('${escapeHtml(
                        v.uk
                      )}', this)">+ Add to Flashcards</button>
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>

        <!-- 5. Recommended LangoUA Course Modules -->
        <div class="convo-review-section">
          <h4>📚 Recommended LangoUA Course Modules</h4>
          <div class="convo-review-modules-list">
            ${review.recommendedCourseModules
              .map(
                (m) => `
                  <div class="convo-review-module-card">
                    <div>
                      <strong>${escapeHtml(m.moduleId)}: ${escapeHtml(
                        m.moduleTitle
                      )}</strong>
                      <div class="corr-note">${escapeHtml(m.reasonEn)}</div>
                    </div>
                    <button
                      type="button"
                      class="convo-btn-secondary"
                      onclick="convoCloseSessionReviewModal();convoOpenCourseModule('${escapeHtml(
                        m.moduleId
                      )}')"
                    >Open Module →</button>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// INITIALIZATION & GLOBAL WINDOW HANDLERS FOR INLINE ONCLICK EVENTS
// ============================================================================

export function initAIConversationTab(callbacks: ConvoHostCallbacks): void {
  hostCallbacks = callbacks;
  convoState = createInitialConversationState(loadSavedConversationPreferences());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  win.convoSelectMode = (modeId: ConversationMode) => {
    // CRITICAL: Switching conversationMode NEVER overwrites user-customized correctionIntensity or clears transcript
    convoState = setConversationMode(convoState, modeId, {
      applyModeDefaultIntensity: !convoState.hasUserCustomizedCorrectionIntensity,
    });
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectIntensity = (intensityId: CorrectionIntensity) => {
    // CRITICAL: Switching correctionIntensity NEVER alters conversationMode or clears transcript
    convoState = setCorrectionIntensity(convoState, intensityId);
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoToggleIncludeSessionReview = (checked: boolean) => {
    convoState = setIncludeSessionReview(convoState, Boolean(checked));
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectCefr = (level: ConvoCefrLevel) => {
    const cfg = CEFR_LEVEL_CONFIGS[level] || CEFR_LEVEL_CONFIGS.A1;
    convoState = {
      ...convoState,
      cefrLevel: cfg.level,
      speakingSpeed: cfg.recommendedSpeed,
    };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectFormality = (formality: FormalityPreference) => {
    convoState = { ...convoState, formalityPreference: formality };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectScenario = (scenarioId: string) => {
    const sc = getScenarioById(scenarioId);
    convoState = {
      ...convoState,
      scenarioId: sc.id,
    };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectVoice = (voiceName: GeminiVoiceName) => {
    convoState = { ...convoState, voicePreference: voiceName };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoSelectSpeed = (speedStr: string) => {
    const val = parseFloat(speedStr) || 1.0;
    convoState = { ...convoState, speakingSpeed: val };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoStartSession = async () => {
    const openingTurn = createOpeningTurnForSession(convoState);
    convoState = {
      ...convoState,
      isSessionActive: true,
      sessionStartedAt: Date.now(),
      turns:
        convoState.turns.length === 0 ? [openingTurn] : convoState.turns,
    };
    renderAIConversationTab();
    await connectGeminiLiveWebSocketIfAvailable();
    if (convoState.turns.length === 1) {
      await playConvoAudio(openingTurn.ukrainianText, convoState.speakingSpeed);
    }
  };

  win.convoEndSession = () => {
    stopLiveVoiceStream();
    const review = generateSessionReview(convoState);
    convoState = {
      ...convoState,
      isSessionActive: false,
      microphoneState: 'idle',
      connectionState: 'ready',
      lastSessionReview: review,
    };
    showSessionReviewModal = true;
    renderAIConversationTab();
  };

  win.convoOpenSessionReview = () => {
    const review = generateSessionReview(convoState);
    convoState = { ...convoState, lastSessionReview: review };
    showSessionReviewModal = true;
    renderAIConversationTab();
  };

  win.convoCloseSessionReviewModal = () => {
    showSessionReviewModal = false;
    renderAIConversationTab();
  };

  win.convoToggleTranscriptVisibility = () => {
    convoState = {
      ...convoState,
      transcriptVisibility: !convoState.transcriptVisibility,
    };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoCycleTranslationMode = () => {
    const nextMap: Record<
      AIConversationState['translationVisibility'],
      AIConversationState['translationVisibility']
    > = {
      'on-demand': 'always',
      always: 'hidden',
      hidden: 'on-demand',
    };
    convoState = {
      ...convoState,
      translationVisibility: nextMap[convoState.translationVisibility],
    };
    saveConversationPreferences(convoState);
    renderAIConversationTab();
  };

  win.convoToggleTurnTranslation = (turnId: string) => {
    convoState = {
      ...convoState,
      turns: convoState.turns.map((t) =>
        t.id === turnId ? { ...t, showTranslation: !t.showTranslation } : t
      ),
    };
    renderAIConversationTab();
  };

  win.convoPlayText = (textUk: string, rate?: number) => {
    void playConvoAudio(textUk, rate);
  };

  win.convoSubmitStarter = (textUk: string) => {
    if (!convoState.isSessionActive) {
      const openingTurn = createOpeningTurnForSession(convoState);
      convoState = {
        ...convoState,
        isSessionActive: true,
        sessionStartedAt: Date.now(),
        turns: [openingTurn],
      };
    }
    void handleLearnerSubmittedUtterance(textUk, false);
  };

  win.convoUseSuggestedStarter = (textUk: string) => {
    const input = document.getElementById(
      'convo-text-input'
    ) as HTMLInputElement | null;
    if (input) {
      input.value = textUk;
      input.focus();
    } else {
      void handleLearnerSubmittedUtterance(textUk, false);
    }
  };

  win.convoSubmitTextInput = () => {
    const input = document.getElementById(
      'convo-text-input'
    ) as HTMLInputElement | null;
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    if (!convoState.isSessionActive && convoState.turns.length === 0) {
      const openingTurn = createOpeningTurnForSession(convoState);
      convoState = {
        ...convoState,
        isSessionActive: true,
        sessionStartedAt: Date.now(),
        turns: [openingTurn],
      };
    }
    void handleLearnerSubmittedUtterance(text, false);
  };

  win.convoToggleMicrophone = () => {
    if (convoState.microphoneState === 'listening') {
      if (speechRecognitionInstance) {
        try {
          speechRecognitionInstance.stop();
        } catch {
          // ignore
        }
        speechRecognitionInstance = null;
      }
      convoState = { ...convoState, microphoneState: 'idle' };
      renderAIConversationTab();
      return;
    }

    const SpeechRec =
      win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      manualHelpToast = {
        titleEn: 'Browser Voice Input Tip',
        responseUk: 'Введі́ть ва́шу відпові́дь украї́нською в по́лі ни́жче!',
        responseEn:
          'Your current browser does not expose Web Speech recognition in this frame. You can type your Ukrainian response directly in the input bar below and hear full AI spoken Ukrainian replies!',
      };
      renderAIConversationTab();
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'uk-UA';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      speechRecognitionInstance = rec;

      convoState = { ...convoState, microphoneState: 'listening' };
      renderAIConversationTab();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || '';
        convoState = { ...convoState, microphoneState: 'idle' };
        if (transcript.trim()) {
          void handleLearnerSubmittedUtterance(transcript.trim(), false);
        } else {
          renderAIConversationTab();
        }
      };

      rec.onerror = () => {
        convoState = { ...convoState, microphoneState: 'idle' };
        renderAIConversationTab();
      };

      rec.onend = () => {
        if (convoState.microphoneState === 'listening') {
          convoState = { ...convoState, microphoneState: 'idle' };
          renderAIConversationTab();
        }
      };

      rec.start();
    } catch {
      convoState = { ...convoState, microphoneState: 'idle' };
      renderAIConversationTab();
    }
  };

  win.convoInspectTurnCorrection = (utteranceId: string) => {
    convoState = {
      ...convoState,
      activeCorrectionUtteranceId: utteranceId,
      activeRightPanelTab: 'feedback',
    };
    retryFeedbackMessage = null;
    renderAIConversationTab();
  };

  win.convoStartEditingTurn = (utteranceId: string) => {
    editingUtteranceId = utteranceId;
    renderAIConversationTab();
  };

  win.convoCancelEditTurn = () => {
    editingUtteranceId = null;
    renderAIConversationTab();
  };

  win.convoSaveEditedTurn = (utteranceId: string) => {
    const input = document.getElementById(
      `edit-input-${utteranceId}`
    ) as HTMLInputElement | null;
    if (!input) return;
    const updatedText = input.value.trim();
    editingUtteranceId = null;
    if (!updatedText) {
      renderAIConversationTab();
      return;
    }

    const reAnalysis = analyzeUkrainianUtterance(updatedText, utteranceId, {
      cefrLevel: convoState.cefrLevel,
      formalityPreference: convoState.formalityPreference,
      scenarioId: convoState.scenarioId,
    });

    convoState = {
      ...convoState,
      turns: convoState.turns.map((t) =>
        t.utteranceId === utteranceId
          ? {
              ...t,
              ukrainianText: updatedText,
              englishTranslation: reAnalysis.englishMeaning,
              isEditedByLearner: true,
              grammarAnalysis: reAnalysis,
            }
          : t
      ),
      activeCorrectionUtteranceId: utteranceId,
    };
    renderAIConversationTab();
  };

  win.convoTriggerHelpAction = (actionId: ManualHelpActionId) => {
    if (actionId === 'how-to-say') {
      showHowToSayModal = true;
      renderAIConversationTab();
      return;
    }

    const res = executeManualHelpAction(actionId, convoState);
    if (res.updatedTurns) {
      convoState = { ...convoState, turns: res.updatedTurns };
    }
    if (res.openTab) {
      convoState = { ...convoState, activeRightPanelTab: res.openTab };
    }
    if (res.activeUtteranceId !== undefined) {
      convoState = {
        ...convoState,
        activeCorrectionUtteranceId: res.activeUtteranceId,
      };
    }

    if (actionId === 'repeat') {
      void playConvoAudio(res.responseUk, 1.0);
    } else if (actionId === 'slower') {
      void playConvoAudio(res.responseUk, 0.82);
    }

    manualHelpToast = {
      titleEn: res.titleEn,
      responseUk: res.responseUk,
      responseEn: res.responseEn,
    };
    renderAIConversationTab();
  };

  win.convoDismissHelpToast = () => {
    manualHelpToast = null;
    renderAIConversationTab();
  };

  win.convoCloseHowToSayModal = () => {
    showHowToSayModal = false;
    renderAIConversationTab();
  };

  win.convoSubmitHowToSay = async () => {
    const input = document.getElementById(
      'convo-how-to-say-input'
    ) as HTMLInputElement | null;
    const queryEn = input?.value.trim() || '';
    showHowToSayModal = false;

    try {
      const apiRes = await fetch('/api/convo/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: 'how-to-say',
          customQueryEn: queryEn,
          stateSnapshot: {
            cefrLevel: convoState.cefrLevel,
            formalityPreference: convoState.formalityPreference,
            scenarioId: convoState.scenarioId,
          },
        }),
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.ok && data.responseUk) {
          manualHelpToast = {
            titleEn: data.titleEn || 'How to Say It in Natural Ukrainian',
            responseUk: data.responseUk,
            responseEn: data.responseEn,
          };
          renderAIConversationTab();
          return;
        }
      }
    } catch {
      // fall through
    }

    const localRes = executeManualHelpAction('how-to-say', convoState, queryEn);
    manualHelpToast = {
      titleEn: localRes.titleEn,
      responseUk: localRes.responseUk,
      responseEn: localRes.responseEn,
    };
    renderAIConversationTab();
  };

  win.convoSelectRightTab = (
    tab: AIConversationState['activeRightPanelTab']
  ) => {
    convoState = { ...convoState, activeRightPanelTab: tab };
    renderAIConversationTab();
  };

  win.convoSelectExplanationLevel = (
    lvl: AIConversationState['activeExplanationLevel']
  ) => {
    convoState = { ...convoState, activeExplanationLevel: lvl };
    renderAIConversationTab();
  };

  win.convoFocusRetryInput = (targetUk: string) => {
    const retryInput = document.getElementById(
      'convo-retry-input'
    ) as HTMLInputElement | null;
    if (retryInput) {
      retryInput.value = targetUk;
      retryInput.focus();
    }
  };

  win.convoCheckRetryDrill = (utteranceId: string) => {
    const retryInput = document.getElementById(
      'convo-retry-input'
    ) as HTMLInputElement | null;
    const attempt = (retryInput?.value || '')
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:«»"()\u0301]/g, '');
    const turn = convoState.turns.find((t) => t.utteranceId === utteranceId);
    const ex = turn?.grammarAnalysis?.tutorExercise;
    if (!ex) return;

    const expected = ex.expectedAnswerUk
      .toLowerCase()
      .replace(/[.,!?;:«»"()\u0301]/g, '');
    const variants = ex.acceptedVariantsUk.map((v) =>
      v.toLowerCase().replace(/[.,!?;:«»"()\u0301]/g, '')
    );

    if (attempt === expected || variants.includes(attempt)) {
      retryFeedbackMessage = {
        ok: true,
        text: `Чудо́во! (Excellent!) You mastered «${ex.promptUk}».`,
      };
    } else {
      retryFeedbackMessage = {
        ok: false,
        text: `Almost! Hint: ${ex.hintEn} — Model: «${ex.promptUk}»`,
      };
    }
    renderAIConversationTab();
  };

  win.convoSelectPronGuide = (guideId: string) => {
    activePronunciationGuideId = guideId;
    renderAIConversationTab();
  };

  win.convoFilterScenarioSearch = (q: string) => {
    scenarioSearchQuery = q;
    renderAIConversationTab();
  };

  win.convoInspectWord = (wordUk: string) => {
    hostCallbacks?.inspectWordIn7Cases(wordUk);
  };

  win.convoAddWordToFlashcards = (wordUk: string, btnEl?: HTMLElement) => {
    hostCallbacks?.addWordToFlashcards(wordUk, btnEl);
  };

  win.convoOpenCourseModule = (moduleId: string) => {
    hostCallbacks?.openCourseModuleById(moduleId);
  };

  win.convoDeleteHistory = () => {
    stopLiveVoiceStream();
    convoState = clearConversationHistoryAndReset(convoState);
    manualHelpToast = null;
    showSessionReviewModal = false;
    renderAIConversationTab();
  };

  renderAIConversationTab();
}
