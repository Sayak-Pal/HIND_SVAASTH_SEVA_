import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ✅ Ensure model loads
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a hospital receptionist assistant. Answer **short and direct**. No long explanations. Always give the exact answer.",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ text: "⚠️ Invalid input format" });
    }

    // Convert frontend messages into Gemini history format
    const history = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Last user message
    const lastUserMessage = messages
      .filter((m) => m.role === "user")
      .slice(-1)[0]?.text;

    if (!lastUserMessage) {
      return NextResponse.json({ text: "⚠️ No user message found" });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage);

    // ✅ Safely extract text
    const text = result.response?.text?.() || "⚠️ AI did not return a response";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("Chat API Error:", err);
    return NextResponse.json({
      text: "⚠️ AI service unavailable. Please try again later.",
    });
  }
}
