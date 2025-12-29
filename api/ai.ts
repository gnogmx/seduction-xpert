// api/ai.ts
// Vercel Serverless Function: POST /api/ai
// Usa OpenAI Responses API (texto + opcional imagem base64)

import { SYSTEM_INSTRUCTION } from '../constants';
import type { Language } from '../types';

type HistoryItem =
  | { role: 'user' | 'assistant' | 'system'; content: string }
  | any;

function toRole(r: any): 'user' | 'assistant' | 'system' {
  if (r === 'assistant' || r === 'system' || r === 'user') return r;
  return 'user';
}

function safeText(x: any): string {
  if (typeof x === 'string') return x;
  if (x?.text && typeof x.text === 'string') return x.text;
  if (x?.content && typeof x.content === 'string') return x.content;
  return '';
}

export default async function handler(req: any, res: any) {
  try {
    // CORS básico
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });
    }

    const body = req.body || {};
    const input = safeText(body.input);
    const history: HistoryItem[] = Array.isArray(body.history) ? body.history : [];
    const lang: Language = (body.lang || 'pt') as Language;
    const imageBase64: string | undefined = typeof body.imageBase64 === 'string' ? body.imageBase64 : undefined;

    if (!input) {
      return res.status(400).json({ error: 'Missing input' });
    }

    // Monta mensagens no formato do Responses API
    const messages: any[] = [];

    // system instruction
    const sys = SYSTEM_INSTRUCTION(lang);
    if (sys) {
      messages.push({
        role: 'system',
        content: [{ type: 'input_text', text: sys }],
      });
    }

    // history
    for (const h of history) {
      const role = toRole(h?.role);
      const text = safeText(h?.content) || safeText(h);
      if (!text) continue;

      messages.push({
        role,
        content: [{ type: 'input_text', text }],
      });
    }

    // current user input (text + optional image)
    const userContent: any[] = [{ type: 'input_text', text: input }];

    if (imageBase64) {
      const base64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      // assumimos jpeg; se você mandar png também funciona se trocar o mime abaixo
      userContent.push({
        type: 'input_image',
        image_url: `data:image/jpeg;base64,${base64}`,
      });
    }

    messages.push({ role: 'user', content: userContent });

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: messages,
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        `OpenAI API error (${r.status})`;
      return res.status(500).json({ error: msg, status: r.status });
    }

    // `output_text` costuma vir pronto; fallback pra varrer output
    let text: string = data?.output_text || '';

    if (!text && Array.isArray(data?.output)) {
      // tenta achar texto no output
      for (const item of data.output) {
        const content = item?.content;
        if (Array.isArray(content)) {
          for (const c of content) {
            if (typeof c?.text === 'string') {
              text += c.text;
            }
          }
        }
      }
    }

    return res.status(200).json({ text: text || '', raw: data });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ? String(e.message) : 'Internal error' });
  }
}
