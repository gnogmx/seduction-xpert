
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceGeminiService } from '../services/voiceGemini';
import { decodeAudioData, decode, createPcmBlob } from '../services/gemini';
import { LiveServerMessage } from '@google/genai';
import { AVATARS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

const VoiceCoach: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    setIsActive(false); setIsConnecting(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    for (const s of sourcesRef.current) s.stop();
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    if (audioContextRef.current) audioContextRef.current.close();
  }, []);

  const startSession = async () => {
    if (isActive || isConnecting) return;
    setIsConnecting(true);
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = VoiceGeminiService.connectVoice(language, {
        onOpen: () => {
          setIsActive(true); setIsConnecting(false);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            sessionPromise.then(s => s.sendRealtimeInput({ media: createPcmBlob(e.inputBuffer.getChannelData(0)) }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onMessage: async (m: LiveServerMessage) => {
          if (m.serverContent?.outputTranscription) setTranscription(m.serverContent.outputTranscription.text);
          const base64 = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
            const s = outputCtx.createBufferSource();
            s.buffer = buffer; s.connect(outputCtx.destination);
            s.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(s);
          }
        },
        onError: () => cleanup(),
        onClose: () => cleanup()
      });
    } catch (e) { cleanup(); }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
      <div className={`w-48 h-48 rounded-full border-2 ${isActive ? 'border-gold shadow-lg shadow-gold/20' : 'border-zinc-800'} overflow-hidden`}>
        <img src={AVATARS[0]} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-2xl font-bold text-gold">{t.voice}</h2>
      <p className="max-w-md text-zinc-400">{isActive ? transcription || '...' : 'Treine sua voz e abordagem em tempo real.'}</p>
      <button 
        onClick={isActive ? cleanup : startSession} 
        disabled={isConnecting}
        className={`px-8 py-3 rounded-full font-bold transition-all ${isActive ? 'bg-red-600' : 'bg-gold text-black hover:scale-105'}`}
      >
        {isActive ? 'Encerrar' : isConnecting ? 'Conectando...' : 'Iniciar Chamada'}
      </button>
    </div>
  );
};

export default VoiceCoach;
