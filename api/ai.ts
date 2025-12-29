import { SYSTEM_INSTRUCTION } from '../constants';

type HistoryItem =
  | { role?: string; content?: string }
  | { role?: string; parts?: any[] }
  | any;

function pickEnv(key: string) {
  // Node runtime (Vercel Function)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (process as any)?.env?.[key];
  return typeof v === 'string' ? v : '';
}

function normalizeTextFromParts(parts: any[]): string {
  if (!Array.isArray(parts)) return '';
  let out = '';
  for (const p of parts) {
    if (!p) continue;
    if (typeof p.text === 'string') out += p.text;
    // ignora inlineData aqui (imagem) — imagem vai no message atual
  }
  return out.trim();
}

function toOpenAIRole(role: any): 'user' | 'assistant' | 'system' {
  const r = String(role || '').toLowerCase();
  if (r === 'assistant') return 'assistant';
  if (r === 'system') return 'system';
  if (r === 'model') return 'assistant';
  return 'user';
}

function normalizeHistory(history: HistoryItem[]) {
  if (!Array.isArray(history)) return [];

  const msgs: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
  for (const h of history) {
    if (!h) continue;

    const role = toOpenAIRole(h.role);

    // formato { role, content }
    if (typeof h.content === 'string' && h.content.trim()) {
      msgs.push({ role, content: h.content.trim() });
      continue;
    }

    // formato Gemini { role, parts:[{text:...}, ...] }
    if (Array.isArray(h.parts)) {
      const text = normalizeTextFromParts(h.parts);
      if (text) msgs.push({ role, content: text });
      continue;
    }
  }
  return msgs;
}

function ensureDataUrl(imageBase64?: string) {
  if (!imageBase64) return undefined;
  const s = String(imageBase64).trim();
  if (!s) return undefined;
  if (s.startsWith('data:image/')) return s;
  // se vier só base64 puro
  return `data:image/jpeg;base64,${s}`;
}

// Vercel Function (Node)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const body = req.body || {};
    const input = String(body.input || '').trim();
    const lang = (body.lang || 'pt') as 'pt' | 'en' | 'es';
    const history = normalizeHistory(body.history || []);
    const imageBase64 = ensureDataUrl(body.imageBase64);

    if (!input && !imageBase64) {
      res.status(400).json({ error: 'Missing input' });
      return;
    }

    // aceita os 2 nomes pra não quebrar teu setup atual
    const apiKey = pickEnv('OPENAI_API_KEY') || pickEnv('VITE_OPENAI_API_KEY');
    if (!apiKey) {
      res.status(500).json({
        error: 'Missing OpenAI API key (set OPENAI_API_KEY or VITE_OPENAI_API_KEY in Vercel env)',
      });
      return;
    }

    const model = pickEnv('OPENAI_MODEL') || 'gpt-4o-mini';

    const system = SYSTEM_INSTRUCTION ? SYSTEM_INSTRUCTION(lang) : 'You are Seduction Xpert.';

    // monta o message final (texto + imagem opcional)
    const userContent = imageBase64
      ? [
          { type: 'text', text: input || (lang === 'pt' ? 'Analise esta imagem.' : 'Analyze this image.') },
          { type: 'image_url', image_url: { url: imageBase64 } },
        ]
      : input;

    const messages: any[] = [{ role: 'system', content: system }, ...history, { role: 'user', content: userContent }];

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      res.status(r.status).json({
        error: data?.error?.message || `OpenAI error (${r.status})`,
        detail: data?.error || data,
      });
      return;
    }

    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.message?.content?.[0]?.text ??
      '';

    res.status(200).json({ text: String(text || '').trim() });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ? String(e.message) : 'Server error' });
  }
}
