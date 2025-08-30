"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  // ✅ Local FAQ responses
  function getFAQResponse(message: string): string | null {
    const msg = message.toLowerCase()
    if (msg.includes("book") && msg.includes("appointment"))
      return "To book an appointment, click 'Book Appointment' on homepage. Login first, then select hospital, doctor, and slot."
    if (msg.includes("services") || msg.includes("offer"))
      return "We offer General Consultation, Specialist Care, Emergency Services, and Health Checkups."
    if (msg.includes("hospital") && msg.includes("location"))
      return "We have partner hospitals across India. Details on our Hospitals page."
    if (msg.includes("emergency") || msg.includes("urgent"))
      return "For emergencies call +91 1800-123-4567. Non-emergency: book online."
    if (msg.includes("payment") || msg.includes("pay"))
      return "We accept online payments, insurance, and cash."
    if (msg.includes("login") || msg.includes("register") || msg.includes("account"))
      return "Use top navigation to register or login. Registration is free."
    if (msg.includes("contact") || msg.includes("phone") || msg.includes("email"))
      return "📞 +91 1800-123-4567 | 📧 info@hindswaasthseva.com | 📍 Healthcare Plaza, Sector 18, New Delhi"
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey"))
      return "Hello! Welcome to HIND SWAASTH SEVA. How can I help?"
    if (msg.includes("help") || msg.includes("assist"))
      return "I can help with booking, hospitals, services, contact info, registration, or payment. What do you need?"
    if (msg.includes("doctor") || msg.includes("specialist"))
      return "We have 150+ specialists. Browse doctors by specialty on the Hospitals page."
    if (msg.includes("cost") || msg.includes("price") || msg.includes("fee"))
      return "Consultation fees vary. View fees during booking. Insurance accepted."
    return null
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setLoading(true)

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
        body: JSON.stringify({
          messages: [
            ...messages,
            newMessage,
            { role: "system", text: "Answer briefly and precisely." },
          ],
        }),
      })
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.text || "⚠️ AI service unavailable. Try again later." },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "⚠️ AI service unavailable. Try again later." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Widget Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg text-white"
        >
          {isOpen ? "✕" : "💬"}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 z-[9999]">
          <Card className="shadow-2xl rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="h-80 overflow-y-auto space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-start ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar */}
                    {m.role === "model" && (
                      <Image
                        src={`https://api.dicebear.com/6.x/bottts/svg?seed=AI${i}`}
                        width={32}
                        height={32}
                        alt="AI"
                        className="rounded-full mr-2"
                      />
                    )}
                    {m.role === "user" && (
                      <Image
                        src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=User${i}`}
                        width={32}
                        height={32}
                        alt="User"
                        className="rounded-full ml-2"
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-2"
                          : "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-black mr-2"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm text-gray-500">Typing...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
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
      )}
    </>
  )
}
