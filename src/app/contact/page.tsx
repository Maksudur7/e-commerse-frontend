"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <div className="pt-40 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-heading font-black text-[#170C79] dark:text-white mb-6">
                Let's <span className="text-[#56B6C6]">Connect</span>
              </h1>
              <p className="text-xl text-[#170C79]/60 dark:text-slate-400 font-medium">
                Have a question about our curated collections? Our team is here to provide artisanal support.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              {[
                { icon: Mail, title: "Email Us", detail: "concierge@shopease.ai", color: "#170C79" },
                { icon: Phone, title: "Call Us", detail: "+1 (800) SHOP-AI", color: "#56B6C6" },
                { icon: MapPin, title: "Visit Us", detail: "123 Innovation Way, NY", color: "#8ACBD0" }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-6"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#170C79] dark:text-white">{item.title}</h3>
                    <p className="text-muted-foreground font-medium">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                <CardContent className="p-10 md:p-16">
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Your Name</p>
                      <Input placeholder="John Doe" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Email Address</p>
                      <Input type="email" placeholder="john@example.com" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Subject</p>
                    <Input placeholder="Inquiry about collections" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                  <div className="space-y-2 mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Message</p>
                    <textarea 
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-none p-6 font-bold text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <Button className="w-full h-16 rounded-2xl text-lg font-black gap-2 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                    Send Message <Send className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-[#170C79]/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-heading font-black text-[#170C79] dark:text-white mb-4">Chat with AI Support</h2>
            <p className="text-muted-foreground font-medium mb-8">
              Get instant answers to your questions using our context-aware AI chat assistant.
            </p>
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-2 border-primary/20 text-primary hover:bg-primary/5">
              Launch Assistant
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
