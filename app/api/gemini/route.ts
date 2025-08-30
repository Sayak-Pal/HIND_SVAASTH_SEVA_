import { NextRequest, NextResponse } from "next/server"

// 🔑 Hardcode your Gemini API key here
const GEMINI_API_KEY = "AIzaSyA6w_fDHsYn_XaMSoKj-NKSjsqf7qFODZs"

// Gemini API endpoint
const GEMINI_API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
  GEMINI_API_KEY

// Gemini API call
async function callGemini(messages: { role: string; text: string }[]) {
  try {
    const prompt = messages.map(m => `${m.role}: ${m.text}`).join("\n")

    const response = await fetch(GEMINI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    const data = await response.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.text ??
      data?.candidates?.[0]?.output ??
      data?.output?.[0]?.content?.[0]?.text ??
      null

    if (!text || !text.trim()) {
      return { role: "model", text: "⚠️ AI service unavailable. Try again later." }
    }

    return { role: "model", text }
  } catch (err) {
    console.error("Gemini API error:", err)
    return { role: "model", text: "⚠️ AI service unavailable. Try again later." }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages: { role: string; text: string }[] = body.messages || []

  if (!messages.length) {
    return NextResponse.json([{ role: "model", text: "⚠️ No input provided." }])
  }

  // Call Gemini API
  const aiResponse = await callGemini(messages)

  return NextResponse.json(aiResponse)
}
