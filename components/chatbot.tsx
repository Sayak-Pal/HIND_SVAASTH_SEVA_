// components/chatbot.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react"; // icons

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // toggle chat window

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await resp.json();
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.text ?? "⚠️ No response from AI",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, text: "⚠️ Error connecting to AI", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 max-h-[500px] flex flex-col shadow-2xl rounded-2xl border border-gray-200 z-50">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="text-gray-500 text-sm">Typing…</div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                placeholder="Type your message..."
              />
              <Button onClick={sendMessage} disabled={loading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
