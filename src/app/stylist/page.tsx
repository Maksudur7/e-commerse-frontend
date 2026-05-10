"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sparkles, ArrowRight, Wand2, Shirt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function Stylist() {
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);

  const preferences = ["Casual Minimalist", "Streetwear", "Office Professional", "Athleisure"];
  const colors = ["Dark Tones", "Earth Tones", "Bright & Bold", "Pastels"];

  const handleStart = () => setStep(1);
  const handleSelect = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setResultsReady(true);
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Navbar />

      <div className="container mx-auto px-4 pt-40">
        <div className="max-w-4xl mx-auto">
          {step === 0 && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(86,182,198,0.3)]">
                <Wand2 className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 text-foreground">
                Your <br/> Personal Stylist
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Not sure what to wear? Let our advanced system analyze your style preferences and curate a perfectly tailored wardrobe just for you.
              </p>
              <Button onClick={handleStart} className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                Start Style Quiz <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center">
              <h2 className="text-3xl font-extrabold mb-8">What's your daily go-to style?</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {preferences.map((pref) => (
                  <Card key={pref} onClick={handleSelect} className="cursor-pointer hover:border-primary hover:shadow-lg transition-all rounded-3xl border-2">
                    <CardContent className="p-8 flex flex-col items-center">
                      <Shirt className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="font-bold text-lg">{pref}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && !isAnalyzing && !resultsReady && (
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center">
              <h2 className="text-3xl font-extrabold mb-8">Which color palette do you prefer?</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {colors.map((color) => (
                  <Card key={color} onClick={handleSelect} className="cursor-pointer hover:border-primary hover:shadow-lg transition-all rounded-3xl border-2">
                    <CardContent className="p-8 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 mb-4 shadow-inner" />
                      <h3 className="font-bold text-lg">{color}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <div className="absolute inset-0 bg-accent rounded-full animate-spin-slow opacity-30 blur-xl" />
                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold mb-4">Curating your look...</h2>
              <p className="text-muted-foreground">Our system is matching your preferences with thousands of products.</p>
            </motion.div>
          )}

          {resultsReady && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <CheckIcon className="w-4 h-4" /> Match Found
                </div>
                <h2 className="text-4xl font-extrabold mb-4">Your Curated Wardrobe</h2>
                <p className="text-muted-foreground text-lg">Based on "Casual Minimalist" and "Earth Tones"</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: "Beige Trench Coat", price: 150, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600" },
                  { name: "Cream Knit Sweater", price: 85, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" },
                  { name: "Khaki Chinos", price: 65, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600" },
                ].map((item, i) => (
                  <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden group">
                    <div className="relative h-80 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-primary shadow-lg">
                        #{i+1}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="font-extrabold text-primary">${item.price}</p>
                      <Button className="w-full mt-4 rounded-xl font-bold">Add to Cart</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Button variant="outline" className="h-14 px-10 rounded-full font-bold shadow-sm" onClick={() => {setStep(1); setResultsReady(false);}}>
                  Retake Quiz
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
