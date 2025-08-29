"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as pdfjsLib from "pdfjs-dist";

// Load PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Extract PDF text
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((s: any) => s.str).join(" ") + "\n";
      }
      setPdfText(text);
    };
    reader.readAsArrayBuffer(file);
  };

  // Send to Gemini API
  const handleSend = async () => {
    if (!input.trim() && !pdfText.trim()) return;

    const userMessage = input.trim() + (pdfText ? `\n\n[PDF Content]: ${pdfText}` : "");

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setPdfText("");
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <Button
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </Button>

      {/* Fullscreen Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white shadow-2xl flex flex-col"
          >
            <Card className="w-full h-full flex flex-col rounded-none">
              <CardHeader className="flex justify-between items-center p-4 bg-blue-600 text-white">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5" /> AI Assistant
                </h2>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <Bot className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[75%] shadow ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <User className="w-6 h-6 text-gray-600 mt-1 shrink-0" />
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Bot className="w-5 h-5" />
                    <span className="animate-pulse">Typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-4 border-t flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  class
