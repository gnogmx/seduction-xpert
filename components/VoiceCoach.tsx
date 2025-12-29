import React, { useState, useRef, useCallback } from 'react';
import { LiveServerMessage } from '@google/genai';
import { AVATARS, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { VoiceGeminiService } from '../services/voiceGemini';
import { decodeAudioData, decode, createPcmBlob } from '../services/gemini';

const VoiceCoach: React.FC<{ language: Language }> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const outputCtxRef = useRef<AudioContext | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);

  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const streamRef = useRef<MediaStream | null>(null);

  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const sessionRef = useRef<any>(null); // sessão Gemini Live (evita promise.then em loop)

  const cleanup = useCallback(() => {
    setIsActive(false);
    setIsConnecting(false);
    setTranscription('');

    try {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    } catch {}

    try {
      processorRef.current?.disconnect();
      sourceNodeRef.current?.disconnect();
      processorRef.current = null;
      sourceNodeRef.current = null;
    } catch {}

    try {
      for (const s of sourcesRef.current) s.stop();
      sourcesRef.current.clear();
    } catch {}

    nextStartTimeRef.current = 0;

    try {
      outputCtxRef.current?.close();
      inputCtxRef.current?.close();
    } catch {}

    outputCtxRef.current = null;
    inputCtxRef.current = null;

    sessionRef.current = null;
  }, []);

  const startSession = async () => {
    if (isActive || isConnecting) return;
    setIsConnecting(true);
    setTranscription('');

    try {
      // Input 16k (mic), Output 24k (model)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;

      // IMPORTANT: Chrome frequentemente inicia AudioContext como "suspended"
      await inputCtx.resume();
      await outputCtx.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = VoiceGeminiService.connectVoice(language, {
        onOpen: () => {
          setIsActive(true);
          setIsConnecting(false);
          setTranscription('Listening...');

          // Cria pipeline mic -> PCM -> sendRealtimeInput
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);

          sourceNodeRef.current = source;
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            try {
              if (!sessionRef.current) return;
              const pcmBlob = createPcmBlob(e.inputBuffer.getChannelData(0));
              sessionRef.current.sendRealtimeInput({ media: pcmBlob });
            } catch (err) {
              // silencia para não quebrar loop
            }
          };

          source.connect(processor);
          // mantém processor “vivo” sem eco audível (ganho 0)
          const gain = inputCtx.createGain();
          gain.gain.value = 0;
          processor.connect(gain);
          gain.connect(inputCtx.destination);
        },

        onMessage: async (m: LiveServerMessage) => {
          // Transcrições (varia por payload)
          const inTx =
            (m as any)?.serverContent?.inputTranscription?.text ||
            (m as any)?.serverContent?.inputTranscription;

          const outTx =
            (m as any)?.serverContent?.outputTranscription?.text ||
            (m as any)?.serverContent?.outputTranscription;

          if (outTx) setTranscription(String(outTx));
          else if (inTx) setTranscription(String(inTx));

          // Áudio: varre parts e toca qualquer inlineData com data base64
          const parts = (m as any
