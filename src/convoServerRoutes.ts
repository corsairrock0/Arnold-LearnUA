import 'dotenv/config';
import express from 'express';
import type http from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import {
  analyzeUkrainianUtterance,
  buildSystemInstructionForSession,
  createInitialConversationState,
  executeManualHelpAction,
  generateLocalConversationalReply,
} from './aiConversationEngine.ts';
import type {
  ConversationMode,
  CorrectionIntensity,
  ConvoCefrLevel,
  FormalityPreference,
  GeminiVoiceName,
  ManualHelpActionId,
} from './aiConversationData.ts';

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

export function createConvoApiApp(): express.Express {
  const apiApp = express();
  apiApp.use(express.json({ limit: '10mb' }));

  // 1. Server status endpoint (never exposes GEMINI_API_KEY)
  apiApp.get('/api/convo/status', (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
    );
    res.json({
      ok: true,
      liveVoiceSupported: hasKey,
      geminiConfigured: hasKey,
      liveModel: 'gemini-3.8-live',
      flashModel: 'gemini-3.8-flash',
      ttsModel: 'gemini-3.8-flash-lite-tts',
    });
  });

  // 2. Separate Grammar-Analysis Engine Endpoint (Part 8)
  apiApp.post('/api/convo/analyze', async (req, res) => {
    try {
      const {
        learnerTextUk = '',
        utteranceId = `utt_${Date.now()}`,
        cefrLevel = 'A1',
        formalityPreference = 'auto',
        scenarioId = 'free-conversation',
      } = req.body || {};

      const baseline = analyzeUkrainianUtterance(learnerTextUk, utteranceId, {
        cefrLevel,
        formalityPreference,
        scenarioId,
      });

      const ai = getGenAIClient();
      if (
        !ai ||
        baseline.status === 'incorrect-grammar' ||
        baseline.status === 'acceptable-colloquial' ||
        baseline.status === 'uncertain-transcription' ||
        baseline.isEuphonyOnly
      ) {
        res.json({ ok: true, analysis: baseline, source: 'deterministic-verified' });
        return;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this Ukrainian learner sentence from a conversation session (CEFR ${cefrLevel}, formality: ${formalityPreference}, scenario: ${scenarioId}):
"${learnerTextUk}"

Rules:
1. Distinguish between (a) 'incorrect-grammar', (b) 'correct-but-unnatural', (c) 'correct-and-natural', (d) 'acceptable-colloquial'.
2. Do NOT mark valid colloquial Ukrainian (like "О, класно! Давай зустрінемось завтра.") as a grammar mistake.
3. Verify Ukrainian cases (Nominative, Genitive, Dative, Accusative, Instrumental, Locative, Vocative), verb conjugation, aspect, and preposition governance.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                correctUkrainian: { type: Type.STRING },
                englishMeaning: { type: Type.STRING },
                whatChangedSummary: { type: Type.STRING },
                grammarRuleSummary: { type: Type.STRING },
                simpleExplanation: { type: Type.STRING },
                detailedExplanation: { type: Type.STRING },
                casualAlternativeUk: { type: Type.STRING },
                formalAlternativeUk: { type: Type.STRING },
                colloquialAlternativeUk: { type: Type.STRING },
              },
              required: [
                'status',
                'correctUkrainian',
                'englishMeaning',
                'whatChangedSummary',
                'grammarRuleSummary',
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && parsed.correctUkrainian) {
          const validStatus = [
            'incorrect-grammar',
            'correct-but-unnatural',
            'correct-and-natural',
            'acceptable-colloquial',
          ].includes(parsed.status)
            ? parsed.status
            : baseline.status;

          const merged = {
            ...baseline,
            utteranceId,
            status: validStatus,
            severity:
              validStatus === 'incorrect-grammar'
                ? ('meaning-changing' as const)
                : validStatus === 'correct-but-unnatural'
                ? ('minor-style' as const)
                : ('none' as const),
            correctUkrainian: parsed.correctUkrainian || baseline.correctUkrainian,
            englishMeaning: parsed.englishMeaning || baseline.englishMeaning,
            whatChangedSummary:
              parsed.whatChangedSummary || baseline.whatChangedSummary,
            grammarRuleSummary:
              parsed.grammarRuleSummary || baseline.grammarRuleSummary,
            explanationLevels: {
              ...baseline.explanationLevels,
              simple:
                parsed.simpleExplanation || baseline.explanationLevels.simple,
              detailed:
                parsed.detailedExplanation || baseline.explanationLevels.detailed,
            },
            naturalAlternatives: {
              ...baseline.naturalAlternatives,
              correctedGrammarUk:
                parsed.correctUkrainian || baseline.correctUkrainian,
              casualUk:
                parsed.casualAlternativeUk ||
                baseline.naturalAlternatives.casualUk,
              formalUk:
                parsed.formalAlternativeUk ||
                baseline.naturalAlternatives.formalUk,
              colloquialUk:
                parsed.colloquialAlternativeUk ||
                baseline.naturalAlternatives.colloquialUk,
            },
          };
          res.json({ ok: true, analysis: merged, source: 'gemini-3.8-flash' });
          return;
        }
      } catch {
        // Fall through
      }

      res.json({ ok: true, analysis: baseline, source: 'deterministic-fallback' });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Analysis failed',
      });
    }
  });

  // 3. Conversational Turn Endpoint (Friendly Partner or Structured Tutor)
  apiApp.post('/api/convo/turn', async (req, res) => {
    try {
      const {
        learnerTextUk = '',
        utteranceId = `utt_${Date.now()}`,
        conversationMode = 'friendly',
        correctionIntensity = 'discreet',
        cefrLevel = 'A1',
        formalityPreference = 'auto',
        scenarioId = 'free-conversation',
        history = [],
      } = req.body || {};

      const analysis = analyzeUkrainianUtterance(learnerTextUk, utteranceId, {
        cefrLevel,
        formalityPreference,
        scenarioId,
      });

      const tempState = createInitialConversationState({
        conversationMode: conversationMode as ConversationMode,
        correctionIntensity: correctionIntensity as CorrectionIntensity,
        cefrLevel: cefrLevel as ConvoCefrLevel,
        formalityPreference: formalityPreference as FormalityPreference,
        scenarioId,
      });

      const localFallback = generateLocalConversationalReply({
        learnerTextUk,
        analysis,
        state: tempState,
      });

      const ai = getGenAIClient();
      if (!ai) {
        res.json({
          ok: true,
          replyUk: localFallback.replyUk,
          replyEn: localFallback.replyEn,
          spokenFeedbackUk: localFallback.spokenFeedbackUk,
          spokenFeedbackEn: localFallback.spokenFeedbackEn,
          pronunciationTipId: localFallback.pronunciationTipId,
          analysis,
          source: 'local-engine',
        });
        return;
      }

      const systemInstruction = buildSystemInstructionForSession({
        conversationMode: conversationMode as ConversationMode,
        correctionIntensity: correctionIntensity as CorrectionIntensity,
        cefrLevel: cefrLevel as ConvoCefrLevel,
        formalityPreference: formalityPreference as FormalityPreference,
        scenarioId,
      });

      const recentHistoryText = Array.isArray(history)
        ? history
            .slice(-6)
            .map(
              (h: { speaker?: string; ukrainianText?: string }) =>
                `${h.speaker === 'ai' ? 'AI' : 'Learner'}: ${h.ukrainianText || ''}`
            )
            .join('\n')
        : '';

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${recentHistoryText ? `Recent conversation:\n${recentHistoryText}\n\n` : ''}Learner just said in Ukrainian: "${learnerTextUk}"
Grammar analysis summary of learner's turn: status=${analysis.status}, corrected="${analysis.correctUkrainian}", note="${analysis.whatChangedSummary}".

Respond according to the ACTIVE CONVERSATION MODE (${conversationMode}) and INDEPENDENT GRAMMAR CORRECTION SETTING (${correctionIntensity}).`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                replyUk: { type: Type.STRING },
                replyEn: { type: Type.STRING },
              },
              required: ['replyUk', 'replyEn'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && parsed.replyUk) {
          res.json({
            ok: true,
            replyUk: parsed.replyUk,
            replyEn: parsed.replyEn || localFallback.replyEn,
            spokenFeedbackUk: localFallback.spokenFeedbackUk,
            spokenFeedbackEn: localFallback.spokenFeedbackEn,
            pronunciationTipId: localFallback.pronunciationTipId,
            analysis,
            source: 'gemini-3.8-flash',
          });
          return;
        }
      } catch {
        // Fall through
      }

      res.json({
        ok: true,
        replyUk: localFallback.replyUk,
        replyEn: localFallback.replyEn,
        spokenFeedbackUk: localFallback.spokenFeedbackUk,
        spokenFeedbackEn: localFallback.spokenFeedbackEn,
        pronunciationTipId: localFallback.pronunciationTipId,
        analysis,
        source: 'local-fallback',
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Turn generation failed',
      });
    }
  });

  // 4. Server-Side Gemini TTS Endpoint (gemini-3.8-flash-lite-tts)
  apiApp.post('/api/convo/tts', async (req, res) => {
    try {
      const {
        textUk = '',
        voiceName = 'Zephyr',
      }: { textUk?: string; voiceName?: GeminiVoiceName } = req.body || {};

      const cleanText = (textUk || '').replace(/\u0301/g, '').trim();
      if (!cleanText) {
        res.status(400).json({ ok: false, error: 'Missing textUk' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.json({ ok: false, fallbackToBrowserSpeech: true });
        return;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [{ parts: [{ text: cleanText }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const inlinePart =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (inlinePart?.data) {
          res.json({
            ok: true,
            audioBase64: inlinePart.data,
            mimeType: inlinePart.mimeType || 'audio/wav',
          });
          return;
        }
      } catch {
        // Fall through
      }

      res.json({ ok: false, fallbackToBrowserSpeech: true });
    } catch (err) {
      res.json({
        ok: false,
        fallbackToBrowserSpeech: true,
        error: err instanceof Error ? err.message : 'TTS error',
      });
    }
  });

  // 5. Manual Help Endpoint
  apiApp.post('/api/convo/help', async (req, res) => {
    try {
      const {
        actionId = 'hint',
        customQueryEn = '',
        stateSnapshot,
      }: {
        actionId?: ManualHelpActionId;
        customQueryEn?: string;
        stateSnapshot?: Record<string, unknown>;
      } = req.body || {};

      const baseState = createInitialConversationState(stateSnapshot as never);
      const localResult = executeManualHelpAction(
        actionId,
        baseState,
        customQueryEn
      );

      const ai = getGenAIClient();
      if (ai && actionId === 'how-to-say' && customQueryEn.trim().length > 0) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `A Ukrainian language learner (CEFR ${baseState.cefrLevel}, formality: ${baseState.formalityPreference}) asks:
"How do I say this in natural Ukrainian: ${customQueryEn}"
Return a JSON object with 'ukrainianPhrase' (natural Ukrainian with stress marks) and 'englishNote' (meaning + brief grammar tip).`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  ukrainianPhrase: { type: Type.STRING },
                  englishNote: { type: Type.STRING },
                },
                required: ['ukrainianPhrase', 'englishNote'],
              },
            },
          });
          const parsed = JSON.parse(response.text || '{}');
          if (parsed?.ukrainianPhrase) {
            res.json({
              ok: true,
              titleEn: 'How to Say It in Natural Ukrainian',
              responseUk: parsed.ukrainianPhrase,
              responseEn: parsed.englishNote || localResult.responseEn,
            });
            return;
          }
        } catch {
          // Fall back
        }
      }

      res.json({
        ok: true,
        ...localResult,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Help action failed',
      });
    }
  });

  return apiApp;
}

export function attachConvoLiveWebSocket(httpServer: http.Server): void {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on(
    'upgrade',
    (request: http.IncomingMessage, socket: Duplex, head: Buffer) => {
      const pathname = new URL(
        request.url || '/',
        `http://${request.headers.host || 'localhost'}`
      ).pathname;

      if (pathname === '/api/convo/live') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    }
  );

  wss.on('connection', (clientWs: WebSocket) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let liveSession: any = null;

    clientWs.on('message', async (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());

        if (msg.type === 'start') {
          const ai = getGenAIClient();
          if (!ai) {
            clientWs.send(
              JSON.stringify({
                type: 'fallback',
                reason: 'GEMINI_API_KEY not present; using turn-based voice mode.',
              })
            );
            return;
          }

          const systemInstruction = buildSystemInstructionForSession({
            conversationMode: msg.conversationMode || 'friendly',
            correctionIntensity: msg.correctionIntensity || 'discreet',
            cefrLevel: msg.cefrLevel || 'A1',
            formalityPreference: msg.formalityPreference || 'auto',
            scenarioId: msg.scenarioId || 'free-conversation',
          });

          const voiceName: GeminiVoiceName = msg.voicePreference || 'Zephyr';

          liveSession = await ai.live.connect({
            model: 'gemini-3.8-live',
            callbacks: {
              onopen: () => {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'connected',
                      model: 'gemini-3.8-live',
                    })
                  );
                }
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onmessage: (serverMsg: any) => {
                if (clientWs.readyState !== WebSocket.OPEN) return;

                const parts = serverMsg.serverContent?.modelTurn?.parts || [];
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    clientWs.send(
                      JSON.stringify({
                        type: 'audio',
                        audioBase64: part.inlineData.data,
                        mimeType:
                          part.inlineData.mimeType || 'audio/pcm;rate=24000',
                      })
                    );
                  }
                }

                if (serverMsg.serverContent?.inputTranscription?.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'input_transcription',
                      text: serverMsg.serverContent.inputTranscription.text,
                    })
                  );
                }

                if (serverMsg.serverContent?.outputTranscription?.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'output_transcription',
                      text: serverMsg.serverContent.outputTranscription.text,
                    })
                  );
                }

                if (serverMsg.serverContent?.interrupted) {
                  clientWs.send(JSON.stringify({ type: 'interrupted' }));
                }

                if (serverMsg.serverContent?.turnComplete) {
                  clientWs.send(JSON.stringify({ type: 'turn_complete' }));
                }
              },
              onerror: (err: unknown) => {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'fallback',
                      reason:
                        err instanceof Error
                          ? err.message
                          : 'Live session switched to turn-based mode.',
                    })
                  );
                }
              },
              onclose: () => {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({ type: 'closed' }));
                }
              },
            },
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction,
            },
          });
        } else if (msg.type === 'audio_chunk' && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: msg.audioBase64,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (msg.type === 'text_turn' && liveSession) {
          liveSession.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: msg.text }],
              },
            ],
            turnComplete: true,
          });
        } else if (msg.type === 'stop' && liveSession) {
          try {
            liveSession.close();
          } catch {
            // ignore
          }
          liveSession = null;
        }
      } catch (err) {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(
            JSON.stringify({
              type: 'fallback',
              reason:
                err instanceof Error ? err.message : 'Live connection fallback',
            })
          );
        }
      }
    });

    clientWs.on('close', () => {
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
        liveSession = null;
      }
    });
  });
}
