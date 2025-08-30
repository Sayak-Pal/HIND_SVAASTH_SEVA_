import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rule-based fallback responses
const fallbackResponses: Record<string, string> = {
  appointment: "I can help you book an appointment. Which doctor or department?",
  payment: "For payments, please visit our billing section or ask me to generate a payment link.",
  emergency: "⚠️ This seems urgent. Please call our emergency helpline: 108 immediately.",
  medicine: "For medicines, please provide your prescription ID so I can fetch the details."
};

function getFallbackResponse(userInput: string): string | null {
  const lowerInput = userInput.toLowerCase();
  for (const key in fallbackResponses) {
    if (lowerInput.includes(key)) {
      return fallbackResponses[key];
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages, pdfText } = await req.json();

    // Prepare conversation context
    const history = messages.map((msg: any) => `${msg.sender}: ${msg.text}`).join("\n");
    const combinedInput = pdfText
      ? `${history}\n[User uploaded PDF content: ${pdfText.slice(0, 1000)}...]`
      : history;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(combinedInput);
    const responseText = result.response.text();

    if (responseText && responseText.trim().length > 0) {
      return NextResponse.json({ text: responseText });
    }

    // Empty response → fallback
    const lastMsg = messages[messages.length - 1]?.text || "";
    const fallback = getFallbackResponse(lastMsg) || "I'm sorry, I couldn’t process that.";
    return NextResponse.json({ text: fallback });

  } catch (error) {
    console.error("Error in chat API:", error);

    // API failure → fallback
    return NextResponse.json({
      text: "⚠️ My AI services are down. But I can still help you with appointments, payments, or emergencies manually."
    });
  }
}
