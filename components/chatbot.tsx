"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Local FAQ responses
  function getFAQResponse(message: string): string | null {
    message = message.toLowerCase()

    if (message.includes("book") && message.includes("appointment"))
      return "To book an appointment, click on 'Book Appointment' on the homepage. Login first, then select hospital, doctor, and slot."

    if (message.includes("services") || message.includes("offer"))
      return "We offer General Consultation, Specialist Care, Emergency Services, and Health Checkups."

    if (message.includes("hospital") && message.includes("location"))
      return "We have partner hospitals across India. Details are on our Hospitals page."

    if (message.includes("emergency") || message.includes("urgent"))
      return "For emergencies call +91 1800-123-4567. For non-emergency, book online."

    if (message.includes("payment") || message.includes("pay"))
      return "We accept online payments, insurance, and cash."

    if (message.includes("login") || message.includes("register") || message.includes("account"))
      return "Use the top navigation to register or login. Registration is free."

    if (message.includes("contact") || message.includes("phone") || message.includes("email"))
      return "📞 +91 1800-123-4567 | 📧 info@hindswaasthseva.com | 📍 Healthcare Plaza, Sector 18, New Delhi"

    if (message.includes("hello") || message.includes("hi") || message.includes("hey"))
      return "Hello! Welcome to HIND SWAASTH SEVA. How can I help?"

    if (message.includes("help") || message.includes("assist"))
      return "I can help with booking, hospitals, services, contact info, registration, or payment,book,appointment,services,offer,hospital,location,emergency,urgent,payment,pay,doctor,cost. What do you need?"

    if (message.includes("doctor") || message.includes("specialist"))
      return "We have 150+ specialists. Browse doctors by specialty on the Hospitals page."

    if (message.includes("cost") || message.includes("price") || message.includes("fee"))
      return "Consultation fees vary. View fees during booking. Insurance accepted."

    return null // Not an FAQ → let Gemini handle it
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, newMessage])

    setInput("")
    setLoading(true)

    // ✅ Check FAQ first
    const faqResponse = getFAQResponse(input)
    if (faqResponse) {
      setMessages((prev) => [...prev, { role: "model", text: faqResponse }])
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      })

      const data = await res.json()
      setMessages((prev) => [...prev, { role: "model", text: data.text }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", text: "⚠️ Error connecting to AI" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="shadow-2xl rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="h-80 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-xs ${
                  m.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500">
                Typing...
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage} disabled={loading}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
