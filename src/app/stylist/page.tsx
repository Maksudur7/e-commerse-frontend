/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { apiFetch } from "@/lib/api";

export default function Stylist() {
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [productKeyword, setProductKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [styleKeyword, setStyleKeyword] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/categories");
        if (res.success) {
          setCategories(res.data || []);
          if (res.data?.length) {
            setSelectedCategory(res.data[0].slug || "");
          }
        }
      } catch (error) {
        console.error("Stylist categories error:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleStart = () => setStep(1);

  const handleAnalyze = async () => {
    if (!productKeyword.trim()) return;

    setIsAnalyzing(true);
    setResultsReady(false);

    try {
      const payload: Record<string, string> = {};
      if (productKeyword.trim()) payload.productName = productKeyword.trim();
      if (selectedCategory) payload.category = selectedCategory;
      if (styleKeyword.trim()) payload.style = styleKeyword.trim();

      const res = await apiFetch("/ai/stylist", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        const payload = Array.isArray(res.data) ? res.data : [{ name: "Expert Curated", description: String(res.data), price: "", image: "", why: "" }];
        setRecommendations(payload);
      }
    } catch (error) {
      console.error("AI Stylist error:", error);
      setRecommendations([{ name: "Expert Curated", description: "There was an issue generating your curated look. Please try again.", price: "", image: "", why: "" }]);
    } finally {
      setIsAnalyzing(false);
      setResultsReady(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />

      <div className="container mx-auto px-4 pt-40">
        <div className="max-w-3xl mx-auto">
          {step === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(86,182,198,0.3)]">
                <Wand2 className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 text-foreground">
                Expert Curated AI
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Tell us what you love, and our stylist AI will build a fully personalized look from your preferences.
              </p>
              <Button onClick={handleStart} className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                Start Expert Curation <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold mb-4">What are you shopping for today?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Enter a product, outfit idea, or fashion goal and our expert AI will curate the best complements.</p>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-foreground">Product / keyword</label>
                  <Input
                    value={productKeyword}
                    onChange={(event) => setProductKeyword(event.target.value)}
                    placeholder="e.g. black leather jacket, summer dress, office wear"
                    className="h-14 rounded-3xl"
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-foreground">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                      className="h-14 rounded-3xl border border-border bg-background px-4 text-sm"
                    >
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.slug}>{category.name}</option>
                        ))
                      ) : (
                        <option value="">General</option>
                      )}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-foreground">Style / Occasion</label>
                    <Input
                      value={styleKeyword}
                      onChange={(event) => setStyleKeyword(event.target.value)}
                      placeholder="e.g. streetwear, party-ready, travel-friendly"
                      className="h-14 rounded-3xl"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
                  <Button onClick={handleAnalyze} className="h-14 px-10 rounded-full font-bold w-full sm:w-auto">
                    Curate My Look
                  </Button>
                  <Button variant="outline" className="h-14 px-10 rounded-full font-bold w-full sm:w-auto" onClick={() => setStep(0)}>
                    Back to Intro
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <div className="absolute inset-0 bg-accent rounded-full animate-spin-slow opacity-30 blur-xl" />
                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold mb-4">Expert Curator is working...</h2>
              <p className="text-muted-foreground">We are generating a fully dynamic expert-curated look for your request.</p>
            </motion.div>
          )}

          {resultsReady && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Sparkles className="w-4 h-4" /> Results Generated
                </div>
                <h2 className="text-4xl font-extrabold mb-3">Expert Curated Outfit</h2>
                <p className="text-muted-foreground text-lg">Based on "{productKeyword}"{selectedCategory ? ` in ${selectedCategory}` : ''}{styleKeyword ? ` for ${styleKeyword}` : ''}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {recommendations.length > 0 ? recommendations.map((item, index) => (
                  <Card key={index} className="border-none shadow-xl rounded-3xl overflow-hidden group">
                    <div className="relative h-80 overflow-hidden bg-slate-100">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name || item.title || 'Curated pick'}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description || item.why || 'A curated recommendation from our AI stylist.'}</p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-primary">{item.price ? `$${item.price}` : 'Price on request'}</span>
                        <Button size="sm" className="rounded-full">Explore</Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground italic">We couldn't find exact matches for your criteria, but our stylist is still working on your request.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
                <Button onClick={() => { setStep(1); setResultsReady(false); }} className="h-14 px-10 rounded-full font-bold w-full sm:w-auto">
                  Refine Request
                </Button>
                <Button variant="outline" onClick={() => { setStep(0); setResultsReady(false); setProductKeyword(''); setStyleKeyword(''); }} className="h-14 px-10 rounded-full font-bold w-full sm:w-auto">
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
