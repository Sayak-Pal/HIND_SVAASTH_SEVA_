// /pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  try {
    const { prompt, history } = req.body
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const chat = model.startChat({ history })
    const result = await chat.sendMessage(prompt)
    const text = result.response.text()
    res.status(200).json({ response: text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ response: "Error fetching Gemini response." })
  }
}
