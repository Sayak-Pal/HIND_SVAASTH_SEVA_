// app/api/gemini/route.ts
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Simple rule-based fallback responses
function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("book") && lower.includes("appointment")) {
    return "✅ I can help you book an appointment. Please provide the patient's name, preferred date, and department.";
  }
  if (lower.includes("payment") || lower.includes("bill")) {
    return "💳 You can pay your bills at the hospital counter or through our secure online payment portal.";
  }
  if (lower.includes("lab") || lower.includes("test")) {
    return "🧪 Lab tests can be scheduled. Please share the test name and preferred date.";
  }
  if (lower.includes("medicine") || lower.includes("pharmacy")) {
    return "💊 Medicines can be collected from our pharmacy counter. Do you want me to check availability?";
  }
  if (lower.includes("emergency")) {
    return "🚨 If this is a medical emergency, please call 102 immediately or rush to the nearest emergency ward.";
  }

  return "⚠️ Sorry, I couldn’t connect to the AI service right now. Please try again later.";
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages into Gemini format
    const formattedMessages = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const resp = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedMessages }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Gemini API Error:", errorText);

      // Return fallback if Gemini fails
      const lastMsg = messages[messages.length - 1]?.text || "";
      return NextResponse.json({
        text: getFallbackResponse(lastMsg),
        role: "model",
      });
    }

    const data = await resp.json();

    // Safely extract AI response
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.text ??
      data?.candidates?.[0]?.output ??
      null;

    if (!aiText) {
      const lastMsg = messages[messages.length - 1]?.text || "";
      return NextResponse.json({
        text: getFallbackResponse(lastMsg),
        role: "model",
      });
    }

    return NextResponse.json({ text: aiText, role: "model" });
  } catch (err: any) {
    console.error("API route error:", err);

    const fallback =
      "⚠️ Something went wrong on our end. Please try again in a moment.";
    return NextResponse.json({ text: fallback, role: "model" }, { status: 500 });
  }
}
