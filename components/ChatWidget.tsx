"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot" | "assistant";
  content: string;
  timestamp: Date;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to Ascend Properties! Are you looking to Buy, Sell, or Rent today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsChatLoading(true);
      setTimeout(() => setIsChatLoading(false), 1500);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isChatLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsApiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }), // Send history if API supports it, or just content
      });

      if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't understand that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Ascend Assistant</h3>
              <p className="text-xs text-gray-300">
                Typically replies instantly
              </p>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-gray-800 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {isChatLoading ? (
               <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            ) : (
                <>
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                    "max-w-[85%] p-3 rounded-lg text-sm",
                    msg.role === "user"
                        ? "ml-auto bg-black text-white rounded-br-none"
                        : "bg-white border border-gray-100 shadow-sm rounded-bl-none text-gray-800"
                    )}
                >
                    {msg.content}
                </div>
                ))}
            </>
            )}
            {isApiLoading && (
              <div className="bg-white border border-gray-100 shadow-sm rounded-lg rounded-bl-none p-3 w-fit">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none min-h-[44px] max-h-[120px]"
              />
              <button
                type="submit"
                disabled={isApiLoading || !inputValue.trim()}
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "w-14 h-14 rounded-full bg-black text-white shadow-lg flex items-center justify-center transition-all hover:scale-110",
          isOpen ? "rotate-90" : "hover:bg-gray-800"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
