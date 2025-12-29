import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { input, history } = req.body || {};
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing 'input' string" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        ...(Array.isArray(history) ? history : []),
        { role: "user", content: input },
      ],
    });

    // The SDK returns structured output; easiest is to send the whole thing and parse on client.
    return res.status(200).json({ response });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
