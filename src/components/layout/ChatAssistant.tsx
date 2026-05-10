"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI shopping assistant. Looking for something specific? Like 'blue running shoes under $50'?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response (In a real app, this calls your AI API backend)
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "I can definitely help you find that. Let me check our catalog.";
      if (userMessage.content.toLowerCase().includes("shoe") || userMessage.content.toLowerCase().includes("sneaker")) {
        aiResponse = "We have some great Premium Leather Sneakers that just arrived! They are currently highly rated by our customers. Would you like me to show you?";
      } else if (userMessage.content.toLowerCase().includes("price") || userMessage.content.toLowerCase().includes("cheap")) {
        aiResponse = "I've filtered the products. We have several options under your budget in the 'Best Sellers' section right now.";
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse
      }]);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border/50 overflow-hidden z-50 flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1">ShopEase AI <Sparkles className="w-3 h-3 text-amber-300" /></h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-auto">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`px-4 py-2.5 max-w-[75%] text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-[20px] rounded-br-sm" 
                      : "bg-white dark:bg-slate-800 text-foreground border border-border/50 rounded-[20px] rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-auto">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-slate-800 border border-border/50 rounded-[20px] rounded-bl-sm shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-border/50">
              <div className="relative flex items-center">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="pr-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] shadow-primary/30 hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageCircle className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
        <X className={`w-6 h-6 absolute transition-transform duration-300 ${isOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
      </button>
    </>
  );
}
