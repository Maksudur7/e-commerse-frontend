"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, Search, MessageCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const json = await apiFetch("/faqs");
        if (json.success) setFaqs(json.data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="pt-40 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
                <HelpCircle className="w-10 h-10" />
              </div>
              <h1 className="text-5xl font-heading font-black text-[#170C79] dark:text-white mb-6">
                Help <span className="text-[#56B6C6]">Center</span>
              </h1>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for answers..." 
                  className="h-16 pl-12 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-xl font-bold" 
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
                ))
              ) : faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="border-none bg-white dark:bg-slate-900 rounded-3xl px-8 shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-6 font-bold text-lg text-left text-[#170C79] dark:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground font-medium text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20 flex items-center gap-6">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Live AI Chat</h3>
                <p className="text-white/70 text-sm font-medium mb-3">Instant answers 24/7</p>
                <Button variant="secondary" size="sm" className="rounded-xl font-bold">Start Chat</Button>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Email Support</h3>
                <p className="text-muted-foreground text-sm font-medium mb-3">Response in 2h</p>
                <Button variant="outline" size="sm" className="rounded-xl font-bold border-primary/20 text-primary">Contact Us</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
