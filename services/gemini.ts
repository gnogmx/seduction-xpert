import { Language } from '../types';

type HistoryItem =
  | { role: 'user' | 'assistant' | 'system'; content: string }
  | any;

export type PcmBlob = {
  data: string;      // base64
  mimeType: string;  // ex: 'audio/pcm;rate=16000'
};

export class GeminiService {
  // Mantém o mesmo nome/classe pra não quebrar imports do app

  static async generateMultimodalResponse(
    lang: Language,
    history: HistoryItem[],
    text: string,
    imageBase64?: string
  ) {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: text,
        history,
        lang,
        imageBase64,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error || `API error (${r.status})`);
    }

    return r.json();
  }

  static getChatSession(lang: Language) {
    return {
      send: async (text: string, history: HistoryItem[] = []) =>
        GeminiService.generateMultimodalResponse(lang, history, text),
    };
  }

  // NÃO usado (voz agora está em VoiceGeminiService)
  static async connectVoice(_lang: Language, callbacks: any) {
    callbacks?.onError?.(new Error('Voice is not handled by GeminiService'));
    callbacks?.onClose?.();
    throw new Error('Voice is not handled by GeminiService');
  }
}

// --------------------
// Audio utils (PCM16 <-> base64)
// --------------------

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Converte PCM16 (little-endian) para AudioBuffer
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = Math.floor(dataInt16.length / numChannels);
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Converte Float32 PCM do microfone para PCM16 base64 no formato esperado pelo Gemini Live
export function createPcmBlob(data: Float32Array): PcmBlob {
  const l = data.length;
  const int16 = new Int16Array(l);

  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
