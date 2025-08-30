// app/api/chat/route.ts
import { NextResponse } from "next/server";

const FALLBACK_RESPONSES: Record<string, string> = {
  appointment: "📅 I can help you book an appointment. Which doctor or department would you like?",
  payment: "💳 For payments, please visit our billing section or ask me to generate a payment link.",
  emergency: "⚠️ This seems urgent. Please call our emergency helpline: 108 immediately.",
  medicine: "💊 For medicines, please provide your prescription ID so I can fetch the details.",
};

function getFallbackResponse(userInput: string | undefined): string | null {
  if (!userInput) return null;
  const lower = userInput.toLowerCase();
  for (const k of Object.keys(FALLBACK_RESPONSES)) {
    if (lower.includes(k)) return FALLBACK_RESPONSES[k];
  }
  return null;
}

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY env var.");
      return NextResponse.json(
        { text: "Server configuration error: missing API key." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages: any[] = Array.isArray(body.messages) ? body.messages : [];
    const pdfText: string | undefined = typeof body.pdfText === "string" ? body.pdfText : undefined;

    if (messages.length === 0) {
      return NextResponse.json({ text: "No messages provided." }, { status: 400 });
    }

    const contents = messages.map((m) => {
      const role = (m.sender === "ai" || m.sender === "bot") ? "model" : "user";
      return {
        role,
        parts: [{ text: String(m.text ?? "") }],
      };
    });

    if (pdfText) {
      const truncated = pdfText.length > 12000 ? pdfText.slice(0, 12000) + "..." : pdfText;
      contents.push({
        role: "user",
        parts: [{ text: `[PDF_CONTENT]\n${truncated}` }],
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
      process.env.GEMINI_API_KEY
    )}`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (resp.ok) {
      const data = await resp.json().catch(() => null);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        data?.candidates?.[0]?.content?.text ??
        data?.candidates?.[0]?.output ??
        data?.output?.[0]?.content?.[0]?.text ??
        null;

      if (aiText && String(aiText).trim().length > 0) {
        return NextResponse.json({ text: String(aiText).trim() });
      }
    } else {
      const text = await resp.text().catch(() => "");
      console.error("Gemini REST error:", resp.status, text);
    }

    const lastMsg = messages[messages.length - 1]?.text ?? "";
    const fallback = getFallbackResponse(lastMsg) ?? "I'm sorry — I couldn't process that. Can you rephrase?";
    return NextResponse.json({ text: fallback });
  } catch (err) {
    console.error("Unhandled error in /api/chat:", err);
    return NextResponse.json(
      { text: "⚠️ My AI services are currently unavailable. I can still help with appointments or urgent issues." },
      { status: 500 }
    );
  }
}
