import { NextResponse } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing Gemini API key. Set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Format messages for Gemini API
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
          "x-goog-api-key": process.env.GEMINI_API_KEY,
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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing Gemini API key. Set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Format for Gemini
    const payload = {
      contents: messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    };

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // Debug: log the raw Gemini response
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    if (!data?.candidates?.length) {
      return NextResponse.json(
        { error: "No candidates returned from Gemini", raw: data },
        { status: 500 }
      );
    }

    // Extract the text from the first candidate
    const text =
      data.candidates[0]?.content?.parts?.[0]?.text || "No response text found.";

    return NextResponse.json({ text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
