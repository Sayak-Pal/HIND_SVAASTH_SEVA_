import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ✅ Use the flash model for faster short replies
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a hospital receptionist assistant. Reply short, direct, and clear.",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ text: "⚠️ Invalid input format" });
    }

    // Convert to Gemini history format
    const history = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Get latest user input
    const lastUserMessage = messages
      .filter((m) => m.role === "user")
      .slice(-1)[0]?.text;

    if (!lastUserMessage) {
      return NextResponse.json({ text: "⚠️ No user message found" });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage);

    const text = result.response?.text?.() || "⚠️ No response from AI";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("Chat API Error:", err);
    return NextResponse.json({
      text: "⚠️ AI service unavailable. Please try again later.",
    });
  }
}
