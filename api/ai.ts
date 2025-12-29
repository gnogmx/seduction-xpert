// api/ai.ts
// Serverless Function (Vercel) - não importa arquivos do projeto (evita ERR_MODULE_NOT_FOUND)

const SYSTEM_INSTRUCTION = (lang: 'pt' | 'en' | 'es') => `
Você é o "Seduction Xpert", um consultor de elite, carismático e sofisticado.
Idioma atual: ${lang === 'pt' ? 'Português do Brasil' : lang === 'en' ? 'English' : 'Español'}.
Responda SEMPRE no idioma: ${lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}.

Diretrizes:
- Você é um mestre em psicologia social e carisma.
- Ajude homens a superarem a timidez com dicas práticas de abordagem, conversa e linguagem corporal.
- Responda de forma elegante, curta e direta.
- Ao analisar fotos, foque em: ambiente, linguagem corporal sugerida e "abridores" de conversa adequados ao contexto.
`;

function normalizeHistoryItem(item: any) {
  // Aceita {role, content} OU {role, parts:[{text}]}
  const roleRaw = item?.role;
  const role =
    roleRaw === 'assistant' || roleRaw === 'model'
      ? 'assistant'
      : roleRaw === 'system'
      ? 'system'
      : 'user';

  if (typeof item?.content === 'string') {
    return { role, content: item.content };
  }

  const parts = Array.isArray(item?.parts) ? item.parts : [];
  const text = parts
    .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
    .filter(Boolean)
    .join('\n');

  return { role, content: text };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const input: string = body?.input ?? '';
    const history: any[] = Array.isArray(body?.history) ? body.history : [];
    const lang: 'pt' | 'en' | 'es' = body?.lang === 'en' || body?.lang === 'es' ? body.lang : 'pt';
    const imageBase64: string | undefined = body?.imageBase64;

    const systemMsg = { role: 'system', content: SYSTEM_INSTRUCTION(lang) };

    const mappedHistory = history
      .map(normalizeHistoryItem)
      .filter((m: any) => typeof m?.content === 'string' && m.content.trim().length > 0);

    const userContent = imageBase64
      ? [
          { type: 'text', text: input },
          { type: 'image_url', image_url: { url: imageBase64 } },
        ]
      : input;

    const messages = [
      systemMsg,
      ...mappedHistory,
      { role: 'user', content: userContent },
    ];

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

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
        details: data,
      });
      return;
    }

    const text = data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json({ text });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ? String(e.message) : 'Internal error' });
  }
}
