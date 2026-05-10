"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/home/ProductCard";
import { Sparkles, ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function NewArrivals() {
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackSlides = [
    {
      title: "Fresh Arrivals",
      highlight: "Spring 2026",
      description: "Experience the pinnacle of seasonal fashion with our just-landed collection.",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600",
      color: "#170C79"
    },
    {
      title: "Limited Drops",
      highlight: "Exclusive Edition",
      description: "Unique pieces designed for those who dare to stand out from the crowd.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
      color: "#56B6C6"
    }
  ];

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await apiFetch("/products?limit=8");
        if (res.success) {
          setProducts(res.products);
        }
      } catch (error) {
        console.log("Failed to fetch new arrivals");
      } finally {
        setLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % fallbackSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white selection:bg-[#170C79] selection:text-white pb-32">
      <Navbar />

      {/* Dynamic Fluid Hero Slider */}
      <section className="relative h-[65vh] flex items-center mt-20 overflow-hidden bg-[#EFE3CA]/20">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[120%] bg-[#56B6C6]/10 rounded-full blur-[120px] pointer-events-none"
        />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="bg-[#170C79] rounded-[3.5rem] overflow-hidden relative p-8 md:p-14 shadow-2xl">
            <div className="grid md:grid-cols-2 items-center gap-12">
              
              <div className="text-white space-y-6 order-2 md:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-[#56B6C6]" /> 
                      <span>{fallbackSlides[current].highlight}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black leading-tight mb-4">
                      {fallbackSlides[current].title}
                    </h1>
                    <p className="text-base text-white/70 max-w-sm leading-relaxed mb-8">
                      {fallbackSlides[current].description}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link 
                        href="#collection" 
                        className="inline-flex items-center justify-center bg-[#56B6C6] text-[#170C79] hover:bg-[#56B6C6]/90 rounded-full h-12 px-8 font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-1"
                      >
                        Discover More <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative flex justify-center order-1 md:order-2">
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full"
                    >
                      <div className="absolute inset-0 bg-[#56B6C6]/20 rounded-full blur-[40px] animate-pulse" />
                      <img 
                        src={fallbackSlides[current].image} 
                        alt={fallbackSlides[current].title} 
                        className="w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl relative z-10"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>

            <div className="absolute bottom-6 right-10 flex gap-2 z-20">
              <button 
                onClick={() => setCurrent((prev) => (prev - 1 + fallbackSlides.length) % fallbackSlides.length)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setCurrent((prev) => (prev + 1) % fallbackSlides.length)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section id="collection" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-[#56B6C6] font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <TrendingUp className="w-3 h-3" /> Latest Additions
              </div>
              <h2 className="text-3xl font-heading font-black text-[#170C79]">
                Spring <span className="text-[#8ACBD0]">New Arrivals</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-[350px] bg-[#EFE3CA]/15 rounded-3xl animate-pulse" />
              ))
            ) : products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute top-4 left-4 z-20 bg-[#56B6C6] text-[#170C79] font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                  New
                </div>
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.basePrice || 0}
                  image={product.images?.[0] || "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"}
                  category={product.category?.name || "New Arrival"}
                  rating={5}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
