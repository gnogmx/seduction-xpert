import OpenAI from "openai";

function extractText(resp: any): string {
  if (!resp) return "";
  if (typeof resp.output_text === "string") return resp.output_text;

  // fallback bem tolerante
  try {
    const outputs = resp.output || [];
    for (const o of outputs) {
      const content = o.content || [];
      for (const c of content) {
        if (c.type === "output_text" && typeof c.text === "string") return c.text;
      }
    }
  } catch {}
  return "";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body ?? {};
    const input = body.input;

    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing 'input' string" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5",
      input: input,
    });

    const text = extractText(response);

    return res.status(200).json({ text, raw: response });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
