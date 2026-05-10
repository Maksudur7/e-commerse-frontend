"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  rating: number;
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
  isRecommended,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isRecommended && (
            <Badge className="bg-primary text-white border-none gap-1 py-1.5 px-3 shadow-md backdrop-blur-md">
              Top Match
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white/90 backdrop-blur-md rounded-full h-9 w-9 text-muted-foreground hover:text-accent transition-colors"
        >
          <Heart className="w-4 h-4" />
        </Button>

        <Link href={`/product/${slug}`} className="block w-full h-full">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Quick Add Overlay */}
        <div className={`absolute bottom-0 left-0 w-full p-4 transition-transform duration-300 ease-out ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <Button className="w-full gap-2 rounded-xl h-11 bg-white/90 hover:bg-white text-black font-semibold shadow-lg backdrop-blur-sm">
            <ShoppingCart className="w-4 h-4" /> Quick Add
          </Button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            {category}
          </p>
          <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
        </div>

        <Link href={`/product/${slug}`}>
          <h3 className="font-heading font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-extrabold text-foreground">${price.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}

