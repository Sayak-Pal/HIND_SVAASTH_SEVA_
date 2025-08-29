"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, MessageCircle } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "bot", content: data.text || "No response from Gemini." },
      ]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setMessages([
        ...newMessages,
        { role: "bot", content: "Error: Could not fetch response." },
      ]);
    }

    setIsTyping(false);
  };

  // 🔽 Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <Button
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Fullscreen Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <Card className="w-full h-full max-w-3xl flex flex-col">
              <CardContent className="flex flex-col h-full p-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg max-w-xs ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-200 text-black self-start"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-gray-500 text-sm">Bot is typing...</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <Button onClick={handleSend} className="bg-blue-600 text-white">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
