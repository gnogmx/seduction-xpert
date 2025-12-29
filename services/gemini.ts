import { Language } from '../types';

type HistoryItem =
  | { role: 'user' | 'assistant' | 'system'; content: string }
  | any;

export class GeminiService {
  // mantém o mesmo nome/classe pra não quebrar imports do app

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

  static getChatSession(_lang: Language) {
    // seu app pode estar usando isso; devolvemos um objeto com send()
    return {
      send: async (text: string, history: HistoryItem[] = []) =>
        GeminiService.generateMultimodalResponse(_lang, history, text),
    };
  }

  static async connectVoice(_lang: Language, callbacks: any) {
    // voz Gemini não existe mais aqui. Evita quebrar a UI.
    callbacks?.onError?.(new Error('Voice is disabled in this build'));
    callbacks?.onClose?.();
    throw new Error('Voice is disabled in this build');
  }
}

// Mantém exports usados no app (stubs)
export function decode(_base64: string) {
  throw new Error('Not used');
}
export function encode(_bytes: Uint8Array) {
  throw new Error('Not used');
}
export async function decodeAudioData() {
  throw new Error('Not used');
}
export function createPcmBlob() {
  throw new Error('Not used');
}
