import { NextRequest, NextResponse } from "next/server"

// Minimal Gemini API wrapper placeholder
async function callGemini(messages: { role: string; text: string }[]) {
  try {
    // Replace this with your actual Gemini API call
    const response = await fetch("YOUR_GEMINI_API_ENDPOINT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })
    const data = await response.json()

    // Return the first candidate text
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
