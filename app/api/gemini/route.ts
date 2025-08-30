import { NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  role: "user" | "model" | "system"
  text: string
}

// Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

// Minimal fallback response
const FALLBACK_RESPONSE = "⚠️ AI service unavailable. Try again later."

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    // Format messages for Gemini
    const formattedMessages = messages.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }],
    }))

    // Call Gemini API
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Use conversation context + system instructions
        prompt: {
          messages: formattedMessages,
        },
        // optional parameters for shorter responses
        temperature: 0.2,
        maxOutputTokens: 200,
      }),
    })

    const data = await res.json()

    // Parse Gemini response safely
    const aiText =
      data?.candidates?.[0]?.content?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.output?.[0]?.content?.[0]?.text ??
      FALLBACK_RESPONSE

    return NextResponse.json({
      text: aiText,
      role: "model",
    })
  } catch (err) {
    console.error("Gemini API error:", err)
    return NextResponse.json({
      text: FALLBACK_RESPONSE,
      role: "model",
    })
  }
}
