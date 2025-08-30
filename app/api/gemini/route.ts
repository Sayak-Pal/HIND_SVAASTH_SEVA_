// app/api/chat/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { text: "⚠️ No message received" },
        { status: 400 }
      )
    }

    const prompt = messages.map((m: any) => `${m.role}: ${m.text}`).join("\n")

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Server misconfiguration: missing API key" },
        { status: 500 }
      )
    }

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200, // shorter, more direct answers
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { text: "⚠️ Error contacting AI service" },
        { status: 502 }
      )
    }

    const data = await res.json()
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ No response generated"

    return NextResponse.json({ text })
  } catch (err) {
    console.error("AI Error:", err)
    return NextResponse.json(
      { text: "⚠️ Unexpected server error" },
      { status: 500 }
    )
  }
}
