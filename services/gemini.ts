import { Language } from '../types';

type ApiHistoryItem = { role: 'user' | 'assistant' | 'system'; content: string } | any;

export class GeminiService {
  static async generateMultimodalResponse(
    lang: Language,
    history: ApiHistoryItem[],
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

  static getChatSession(_lang: Language) {
    return {
      send: async (text: string, history: ApiHistoryItem[] = []) =>
        GeminiService.generateMultimodalResponse(_lang, history, text),
    };
  }

  // chat-only; voz fica no VoiceGeminiService
  static async connectVoice(_lang: Language, callbacks: any) {
    callbacks?.onError?.(new Error('Voice is handled by VoiceGeminiService'));
    callbacks?.onClose?.();
    throw new Error('Voice is handled by VoiceGeminiService');
  }
}

// ===== Audio Utils (usado pelo VoiceCoach) =====

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

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }

  return buffer;
}

export function createPcmBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    let s = data[i];
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    int16[i] = s * 32767;
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
