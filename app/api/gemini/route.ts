import { NextResponse } from "next/server";

const GEMINI_API_KEY = "AIzaSyDJ9ZXD4a6IhPamYP3DtJ28BUbBfKzj3JE"; // 🔴 Replace with your actual Gemini API key

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    // Convert messages into Gemini format
    const payload = {
      contents: messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    };

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    if (!data?.candidates?.length) {
      return NextResponse.json(
        { error: "No candidates returned from Gemini", raw: data },
        { status: 500 }
      );
    }

    const text =
      data.candidates[0]?.content?.parts?.[0]?.text || "No response text found.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
