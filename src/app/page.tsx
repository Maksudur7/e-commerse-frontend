"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, ArrowRight, ShieldCheck, Truck, Star, Quote, Heart, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const featuredJson = await apiFetch("/products?isFeatured=true&limit=4");
        if (featuredJson.success) setFeaturedProducts(featuredJson.products || []);

        // Fetch latest products
        const latestJson = await apiFetch("/products?limit=4");
        if (latestJson.success) setLatestProducts(latestJson.products || []);

        // Fetch popular products (sorted by review count)
        const popularJson = await apiFetch("/products?sortBy=popular&limit=4");
        if (popularJson.success) setPopularProducts(popularJson.products || []);

      } catch (error) {
        console.error("Failed to fetch dynamic content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const reviews = [
    { name: "Sarah M.", rating: 5, comment: "Absolutely love the quality. Delivered exactly as promised." },
    { name: "John D.", rating: 5, comment: "The UI is so smooth and the products are top-notch!" },
    { name: "Emily R.", rating: 4, comment: "Great customer service and fast shipping." },
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-[#170C79] selection:text-white">
      <Navbar />
      <Hero />

      {/* Trust & Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Above $100", color: "#56B6C6" },
              { icon: ShieldCheck, title: "Secure Pay", desc: "Certified gateway", color: "#170C79" },
              { icon: Heart, title: "Sustainable", desc: "100% Ethical", color: "#8ACBD0" },
              { icon: Truck, title: "Global Shipping", desc: "50+ countries", color: "#170C79" }
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#EFE3CA]/15 border border-[#170C79]/5"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#170C79]">{feature.title}</h3>
                  <p className="text-[10px] text-[#170C79]/50 font-bold uppercase tracking-tighter">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Handpicked Selections */}
      <section className="py-20 bg-[#EFE3CA]/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#56B6C6]/10 text-[#56B6C6] text-[10px] font-black uppercase tracking-widest mb-3">
                <TrendingUp className="w-3 h-3" /> Trending
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-[#170C79]">
                Featured <span className="text-[#56B6C6]">Picks</span>
              </h2>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="rounded-full font-bold group text-[#170C79]">
                Explore All <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-[350px] bg-[#EFE3CA]/40 rounded-3xl animate-pulse" />
              ))
            ) : latestProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.basePrice || 0}
                image={product.images?.[0] || "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"}
                category={product.category?.name || "General"}
                rating={5}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-[#170C79]/90 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#56B6C6]/90 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            
            <Badge className="bg-[#56B6C6] text-[#170C79] mb-6 py-1 px-4 text-[10px] font-black rounded-full border-none uppercase tracking-widest">
              Limited Sale
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 text-white">
              {featuredProducts?.[0]?.name || "Mid-Season"} <span className="text-[#8ACBD0]">40% OFF</span>
            </h2>
            
            <div className="flex justify-center gap-4 mb-10">
              {[
                { val: timeLeft.hours, label: "Hrs" },
                { val: timeLeft.minutes, label: "Mins" },
                { val: timeLeft.seconds, label: "Secs" }
              ].map((timer) => (
                <div key={timer.label} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-2">
                    <span className="text-2xl font-black text-white">{timer.val.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{timer.label}</span>
                </div>
              ))}
            </div>

            <Link 
              href={featuredProducts?.[0] ? `/product/${featuredProducts[0].slug}` : "/shop"}
              className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#170C79] h-14 px-10 text-base font-black rounded-full shadow-xl transition-all"
            >
              Shop Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#170C79]">
              Most <span className="text-[#8ACBD0]">Popular</span>
            </h2>
            <Link href="/shop">
              <Button variant="outline" className="rounded-full border-[#170C79]/10 text-[#170C79] font-bold text-xs">
                View Collection
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-[350px] bg-[#EFE3CA]/15 rounded-3xl animate-pulse" />
              ))
            ) : (popularProducts.length > 0 ? popularProducts : latestProducts).map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.basePrice || 0}
                image={product.images?.[0] || "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"}
                category={product.category?.name || "Best Seller"}
                rating={5}
              />
            ))}
          </div>


        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-[#170C79]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#170C79] mb-4">
              Our <span className="text-[#56B6C6]">Community</span>
            </h2>
            <div className="flex justify-center gap-0.5 text-[#170C79]">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div 
                key={review.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#170C79]/5 relative"
              >
                <Quote className="w-8 h-8 text-[#170C79]/5 absolute top-6 right-6" />
                <p className="text-base text-[#170C79]/80 font-medium leading-relaxed mb-8 italic">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#170C79] flex items-center justify-center font-bold text-white text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#170C79]">{review.name}</p>
                    <p className="text-[#56B6C6] font-bold text-[10px] uppercase tracking-widest">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-white border-t border-[#170C79]/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-4 lg:col-span-5">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-[#170C79] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <span className="text-xl font-heading font-black text-[#170C79]">ShopEase</span>
              </Link>
              <p className="text-sm text-[#170C79]/50 max-w-xs mb-8 font-medium">
                Elevating the standard of digital commerce through artisanal curation.
              </p>
              <div className="flex gap-3">
                {['TW', 'IG', 'FB'].map(social => (
                  <div key={social} className="w-9 h-9 rounded-full border border-[#170C79]/10 flex items-center justify-center font-bold text-xs text-[#170C79] hover:bg-[#170C79] hover:text-white transition-all cursor-pointer">
                    {social}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="text-sm font-black text-[#170C79] mb-6 uppercase tracking-widest">Links</h4>
              <ul className="space-y-3 text-sm text-[#170C79]/50 font-bold">
                <li><Link href="/shop" className="hover:text-[#170C79]">Catalog</Link></li>
                <li><Link href="/new" className="hover:text-[#170C79]">New Arrivals</Link></li>
                <li><Link href="/stylist" className="hover:text-[#170C79]">Stylist</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-4 lg:col-span-4">
              <h4 className="text-sm font-black text-[#170C79] mb-6 uppercase tracking-widest">Newsletter</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full h-14 rounded-2xl bg-[#170C79]/5 border-none px-6 text-sm font-bold text-[#170C79] outline-none" 
                />
                <button className="absolute right-2 top-2 h-10 px-4 bg-[#170C79] text-white rounded-xl font-bold text-xs uppercase transition-opacity hover:opacity-90">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#170C79]/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-[#170C79]/30 font-bold uppercase tracking-[0.2em]">
            <p>© 2026 ShopEase International.</p>
            <div className="flex gap-8">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
