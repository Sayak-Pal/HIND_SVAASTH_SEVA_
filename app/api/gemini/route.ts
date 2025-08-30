// app/api/chat/route.ts
import { NextResponse } from "next/server";

const FALLBACK_RESPONSES: Record<string, string> = {
  appointment:
    "📅 I can help you book an appointment. Which doctor or department would you like?",
  payment:
    "💳 For payments, please visit our billing section or ask me to generate a payment link.",
  emergency: "⚠️ This seems urgent. Please call our emergency helpline: 108 immediately.",
  medicine:
    "💊 For medicines, please provide your prescription ID so I can fetch the details.",
};

function getFallbackResponse(userInput: string | undefined): string | null {
  if (!userInput) return null;
  const lower = userInput.toLowerCase();
  for (const k of Object.keys(FALLBACK_RESPONSES)) {
    if (lower.includes(k)) return FALLBACK_RESPONSES[k];
  }
  return null;
}

/**
 * POST /api/chat
 * Body: { messages: [{ sender, text }], pdfText?: string }
 */
export async function POST(req: Request) {
  try {
    // Ensure API key is set
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("Missing GEMINI_API_KEY env var.");
      return NextResponse.json(
        { text: "Server configuration error: missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages: any[] = Array.isArray(body.messages) ? body.messages : [];
    const pdfText: string | undefined =
      typeof body.pdfText === "string" ? body.pdfText : undefined;

    if (messages.length === 0) {
      return NextResponse.json({ text: "No messages provided." }, { status: 400 });
    }

    // Build contents for the Generative Language REST API
    // Map front-end senders to roles: 'model' for ai/bot, otherwise 'user'
    const contents = messages.map((m) => {
      const role = m.sender === "ai" || m.sender === "bot" ? "model" : "user";
      return { role, parts: [{ text: String(m.text ?? "") }] };
    });

    // Append PDF text (truncated) if provided
    if (pdfText) {
      const truncated = pdfText.length > 12000 ? pdfText.slice(0, 12000) + "..." : pdfText;
      contents.push({ role: "user", parts: [{ text: `[PDF_CONTENT]\n${truncated}` }] });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
      key
    )}`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
      // optionally add timeout logic in production
    });

    if (!resp.ok) {
      // try to read body for a helpful message
      const text = await resp.text().catch(() => "");
      console.error("Gemini REST returned non-OK:", resp.status, text);
      // Return a helpful JSON message to the client
      return NextResponse.json(
        { text: `AI service returned ${resp.status}. ${text ? `Details: ${text}` : ""}`.trim() },
        { status: 502 }
      );
    }

    // Parse JSON safely
    const data = await resp.json().catch((err) => {
      console.error("Failed parsing Gemini JSON:", err);
      return null;
    });

    // Try a few common shapes to extract AI text (be permissive)
    const aiText =
      // standard candidate -> content -> parts -> text
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      // some other variant
      data?.candidates?.[0]?.content?.text ??
      // older/alternate shape
      data?.candidates?.[0]?.output ??
      // another possible shape
      data?.output?.[0]?.content?.[0]?.text ??
      // less structured fallback
      data?.text ??
      null;

    if (aiText && String(aiText).trim().length > 0) {
      return NextResponse.json({ text: String(aiText).trim() });
    }

    // If no AI text, fall back to rule-based response for critical intents
    const lastMsg = messages[messages.length - 1]?.text ?? "";
    const fallback = getFallbackResponse(lastMsg) ?? "I'm sorry — I couldn't process that. Can you rephrase?";
    console.warn("AI returned empty or unparseable response. Falling back.", { data });
    return NextResponse.json({ text: fallback });
  } catch (err: any) {
    console.error("Unhandled error in /api/chat:", err);
    const message =
      typeof err?.message === "string"
        ? `Unhandled error contacting AI service: ${err.message}`
        : "Unhandled server error contacting AI service.";
    return NextResponse.json(
      { text: `⚠️ ${message} — using fallback. You can still ask about appointments or emergencies.` },
      { status: 500 }
    );
  }
}
