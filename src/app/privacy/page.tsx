"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <div className="pt-40 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="w-20 h-20 bg-[#56B6C6]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#56B6C6]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-5xl font-heading font-black text-[#170C79] dark:text-white mb-6">
                Privacy <span className="text-[#56B6C6]">Matters</span>
              </h1>
              <p className="text-xl text-[#170C79]/60 dark:text-slate-400 font-medium">
                Last updated: May 12, 2026. We believe transparency is the foundation of digital trust.
              </p>
            </motion.div>

            <div className="space-y-12">
              {[
                { 
                  icon: Eye, 
                  title: "Information We Collect", 
                  text: "We collect information to provide better services to all our users. This includes basic info like your name and email, and more complex info like your style preferences for AI recommendations." 
                },
                { 
                  icon: Lock, 
                  title: "Data Security", 
                  text: "We implement advanced encryption and security protocols to protect your data. Your payment information is processed through PCI-compliant gateways and never stored on our servers." 
                },
                { 
                  icon: FileText, 
                  title: "How We Use Data", 
                  text: "Your data is used primarily to process orders, personalize your experience via our AI stylist, and improve the functionality of the ShopEase platform." 
                }
              ].map((section, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 items-start p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 text-primary">
                    <section.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black text-[#170C79] dark:text-white mb-4">{section.title}</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">{section.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-10 rounded-3xl bg-[#170C79] text-white">
              <h2 className="text-2xl font-heading font-black mb-4">Your Rights</h2>
              <p className="text-lg opacity-80 font-medium leading-relaxed mb-6">
                Under GDPR and CCPA, you have the right to access, correct, or delete your personal data. You can exercise these rights directly through your dashboard settings or by contacting our privacy team.
              </p>
              <div className="flex gap-4">
                <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">GDPR Compliant</span>
                <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest">CCPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
