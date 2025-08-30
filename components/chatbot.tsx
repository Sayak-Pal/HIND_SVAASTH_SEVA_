"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {


  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your healthcare assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // FAQ responses
    if (message.includes("book") && message.includes("appointment")) {
      return "To book an appointment, click on \"Book Appointment\" button on the homepage. You'll need to login first if you haven't already. Then select your preferred hospital, doctor, and time slot."
    }

    if (message.includes("services") || message.includes("what do you offer")) {
      return "We offer General Consultation, Specialist Care, Emergency Services, and Health Checkups. You can find detailed information on our Services page."
    }

    if (message.includes("hospital") && message.includes("location")) {
      return "We have partner hospitals across India. You can view all hospital locations and details on our Hospitals page. Each hospital listing includes address, contact information, and available specialties."
    }

    if (message.includes("emergency") || message.includes("urgent")) {
      return "For medical emergencies, please call our 24/7 helpline: +91 1800-123-4567. For non-emergency appointments, you can book through our website."
    }

    if (message.includes("payment") || message.includes("pay")) {
      return "We accept various payment methods including online payments, insurance, and cash. Payment can be made during appointment booking or at the hospital. Login to access payment options."
    }

    if (message.includes("login") || message.includes("register") || message.includes("account")) {
      return "You can register for a new account or login using the buttons in the top navigation. Registration is free and gives you access to appointment booking, payment options, and your personal dashboard."
    }

    if (message.includes("contact") || message.includes("phone") || message.includes("email")) {
      return "You can contact us at:\n📞 Phone: +91 1800-123-4567\n📧 Email: info@hindswaasthseva.com\n📍 Address: Healthcare Plaza, Sector 18, New Delhi"
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to HIND SWAASTH SEVA. I'm here to help you with any questions about our healthcare services. What would you like to know?"
    }

    if (message.includes("help") || message.includes("assist")) {
      return "I can help you with:\n• Booking appointments\n• Finding hospitals and doctors\n• Information about our services\n• Contact details\n• Account registration\n• Payment options\n\nWhat specific information do you need?"
    }

    if (message.includes("doctor") || message.includes("specialist")) {
      return "We have over 150 expert doctors across various specialties. You can browse doctors by specialty on our Hospitals page, where you'll find their qualifications, experience, and available time slots."
    }

    if (message.includes("cost") || message.includes("price") || message.includes("fee")) {
      return "Consultation fees vary by doctor and specialty. You can view specific fees during the appointment booking process. We also accept insurance and offer various payment plans."














    }

    // Default responses for unmatched queries
    const defaultResponses = [
      "I'm here to help! Could you please be more specific about what you'd like to know?",
      "I didn't quite understand that. You can ask me about appointments, services, hospitals, or contact information.",
      "Let me help you with that. Try asking about booking appointments, our services, or hospital locations.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()

    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button


          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96">
          <Card className="h-full flex flex-col shadow-xl">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>Healthcare Assistant</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}



                  >
                    <div
                        className={`max-w-[80%] p-3 rounded-lg break-words overflow-hidden ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                        >
                    <div className="flex items-start space-x-2">
                    {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                   <div className="text-sm whitespace-pre-line break-words">{message.text}</div>
                   </div>
                   </div>

                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>



















              </div>
            </CardContent>
          </Card>
        </div>






















