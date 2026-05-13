"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";



interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description?: string;
  isRecommended?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  category,
  rating,
  description = "A premium artisanal selection from our latest collection.",
  isRecommended,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItemToCartStore = useCartStore((state) => state.addItem);

  const router = useRouter();
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Toggle wishlist clicked for product:", id);
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // Optimistic Update
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    try {
      console.log("Sending wishlist toggle request...");
      const res = await apiFetch("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId: id, image: image })
      });
      
      console.log("Wishlist toggle response:", res);
      if (!res.success) {
        setIsWishlisted(previousState);
      }
    } catch (error) {
      // Rollback on failure
      setIsWishlisted(previousState);
      console.error("Wishlist error:", error);
    }
  };


  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItemToCartStore({
      variantId: id, // Fallback to product id since we don't have variants in ProductCard summary
      productId: id,
      name: name,
      price: price || 0,
      image: image,
      quantity: 1,
      size: "9", // Default size
      color: "White" // Default color
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/30 shrink-0">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isRecommended && (
            <Badge className="bg-primary text-white border-none gap-1 py-1.5 px-3 shadow-md backdrop-blur-md font-bold">
              Top Match
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 z-10 backdrop-blur-md rounded-full h-10 w-10 transition-all duration-300 ${
            isWishlisted 
              ? "bg-primary text-white hover:bg-primary/90 scale-110" 
              : "bg-white/50 hover:bg-white/90 text-muted-foreground hover:text-accent"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        <Link href={`/product/${slug}`} className="block w-full h-full">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Quick Add Overlay */}
        <div className={`absolute bottom-0 left-0 w-full p-4 transition-transform duration-300 ease-out z-10 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <Button 
            onClick={handleQuickAdd}
            className="w-full gap-2 rounded-2xl h-12 bg-white/95 hover:bg-white text-black font-black shadow-xl backdrop-blur-md"
          >
            <ShoppingCart className="w-4 h-4" /> Quick Add
          </Button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">
            {category}
          </p>
          <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-amber-600">{rating}</span>
          </div>
        </div>

        <Link href={`/product/${slug}`} className="flex-1">
          <h3 className="font-heading font-black text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-xs font-medium mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-4">
          <p className="text-2xl font-black text-foreground">${price.toFixed(2)}</p>
          <Link href={`/product/${slug}`} className="flex-1">
            <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-xs gap-2 border-2 border-primary/5 hover:border-primary/20 hover:bg-primary/5 text-primary group/btn">
              View Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

