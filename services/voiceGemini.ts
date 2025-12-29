import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { Language } from '../types';

// Vite env (client-side)
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return (import.meta as any).env?.[key] || '';
  } catch {
    return '';
  }
};

export class VoiceGeminiService {
  private static getAI() {
    // IMPORTANTE: você precisa ter VITE_GEMINI_API_KEY no Vercel
    const apiKey = getEnv('VITE_GEMINI_API_KEY');
    return new GoogleGenAI({ apiKey });
  }

  static async connectVoice(
    lang: Language,
    callbacks: {
      onOpen: () => void;
      onMessage: (message: LiveServerMessage) => void;
      onError: (e: any) => void;
      onClose: () => void;
    }
  ) {
    const ai = this.getAI();

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: callbacks.onOpen,
        onmessage: callbacks.onMessage,
        onerror: callbacks.onError,
        onclose: callbacks.onClose,
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: SYSTEM_INSTRUCTION(lang) + '\nVoice call mode enabled.',
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });

    return sessionPromise;
  }
}
