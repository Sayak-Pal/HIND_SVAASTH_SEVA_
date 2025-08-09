import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ensure API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing Gemini API key. Set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY, // ✅ API key from env
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: messages.map((msg: any) => ({ text: msg.content })),
            },
          ],
        }),
      }
    );

    // Parse API response
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
