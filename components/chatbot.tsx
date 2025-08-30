// components/chatbot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      sender: "ai",
      text: "Hello! I'm your healthcare assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // helper to parse response body safely
  async function parseResponseSafely(res: Response) {
    // Attempt JSON first, fallback to text
    try {
      const json = await res.json();
      return json;
    } catch {
      try {
        const txt = await res.text();
        return { text: txt };
      } catch {
        return null;
      }
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // add user message to UI immediately
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      // Prepare lightweight messages payload (avoid sending large objects)
      const payloadMessages = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const parsed = await parseResponseSafely(res);

      // If response is JSON-like and has a text field, prefer that
      const aiText =
        parsed?.text ?? parsed?.message ?? (typeof parsed === "string" ? parsed : null);

      if (!res.ok) {
        // non-OK - show server message if present, else fallback message
        const serverMsg = aiText || `Server returned ${res.status}`;
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            sender: "ai",
            text: serverMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        // OK -> use aiText if available, else fallback text
        const finalText =
          aiText ||
          "Sorry, I didn't get a response from the AI. Try rephrasing or ask about appointments/emergency.";
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            sender: "ai",
            text: finalText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err: any) {
      console.error("Frontend fetch error:", err);
      // Use server-provided error message when available, else show a friendly message
      const errMsg =
        err?.message ??
        "Network error: could not reach server. Check your network or server logs.";
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: `⚠️ ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating widget button - very high z-index */}
      <button
        aria-label="Open chat"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window - also high z-index and positioned above other content */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-80 max-h-[560px]">
          <Card className="h-full flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
                <div className="font-semibold">Healthcare Assistant</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <CardContent className="p-3 flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-xl px-3 py-2 max-w-[78%] break-words ${
                        m.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] opacity-70 mt-1 text-right">{m.timestamp}</div>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-xl flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                      <span className="text-xs ml-2 text-gray-600">AI is typing...</span>
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Input area */}
              <div className="mt-3 pt-2 border-t border-gray-200 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="T
