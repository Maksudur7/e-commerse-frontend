"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [dynamicSlides, setDynamicSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackSlides = [
    {
      title: "Elegance Defined",
      subtitle: "Premium Summer Collection",
      description: "Discover a curated selection of minimalist essentials designed for the modern lifestyle. Quality that speaks for itself.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
      color: "#56B6C6",
    },
    {
      title: "Urban Sophisticate",
      subtitle: "New Season Arrivals",
      description: "Bold designs meet functional craftsmanship. Elevate your everyday wardrobe with our latest limited-edition drops.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
      color: "#8ACBD0",
    },
    {
      title: "Timeless Quality",
      subtitle: "Handcrafted Accessories",
      description: "Small details that make a big statement. Explore our collection of premium accessories made to last a lifetime.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200",
      color: "#170C79",
    }
  ];

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await apiFetch("/products?isFeatured=true&limit=3");
        if (res.success && res.products.length > 0) {
          const mapped = res.products.map((p: any) => ({
            title: p.name,
            subtitle: p.category?.name || "Featured Item",
            description: p.description,
            image: p.images?.[0] || fallbackSlides[0].image,
            color: "#170C79",
            slug: p.slug
          }));
          setDynamicSlides(mapped);
        } else {
          setDynamicSlides(fallbackSlides);
        }
      } catch (error) {
        setDynamicSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (dynamicSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % dynamicSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [dynamicSlides]);

  if (loading || dynamicSlides.length === 0) {
    return <div className="h-[80vh] bg-[#EFE3CA] animate-pulse" />;
  }

  return (
    <section className="relative h-[80vh] flex items-center pt-20 overflow-hidden bg-[#EFE3CA]">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[80%] bg-[#170C79]/5 rounded-full blur-[120px]"
        />
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-[#56B6C6]/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#170C79]/10 text-[#170C79] text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  {dynamicSlides[current].subtitle}
                </div>

                <h1 className="text-4xl md:text-5xl font-heading font-black text-[#170C79] leading-[1.1] line-clamp-2">
                  {dynamicSlides[current].title}
                </h1>

                <p className="text-base text-[#170C79]/70 max-w-md leading-relaxed line-clamp-3">
                  {dynamicSlides[current].description}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href={dynamicSlides[current].slug ? `/product/${dynamicSlides[current].slug}` : "/shop"}
                    className="inline-flex items-center justify-center bg-[#170C79] hover:bg-[#170C79]/90 text-white rounded-full h-14 px-10 text-base font-bold shadow-xl shadow-[#170C79]/20 transition-all hover:-translate-y-1"
                  >
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center border-2 border-[#170C79]/20 hover:bg-[#170C79]/5 text-[#170C79] rounded-full h-14 px-10 text-base font-bold transition-all hover:-translate-y-1"
                  >
                    Explore All
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#EFE3CA] bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#EFE3CA] bg-[#170C79] flex items-center justify-center text-white text-[10px] font-bold">
                      10k+
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-0.5 text-[#170C79]">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-xs font-bold text-[#170C79]/60">Trusted by global icons</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Imagery */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-3/4 aspect-[4/3] rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={dynamicSlides[current].image}
                  initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#170C79]/40 to-transparent" />

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 -right-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 z-20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#56B6C6] rounded-xl flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#170C79]/50 uppercase tracking-wider">New Drop</p>
                    <p className="text-sm font-extrabold text-[#170C79]">Summer Silk</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Slide Navigation Dots */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
              {dynamicSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 transition-all duration-500 rounded-full ${current === i ? "w-12 bg-[#170C79]" : "w-2 bg-[#170C79]/20"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
