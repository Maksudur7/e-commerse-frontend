"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await apiFetch("/wishlist");
        if (res.success) setWishlist(res.data || []);
      } catch (error) {
        console.error("Wishlist fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await apiFetch("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId })
      });
      if (res.success) {
        setWishlist(wishlist.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error("Wishlist remove error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">My Wishlist</h1>
        <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
          {wishlist.length} Items
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : wishlist.length > 0 ? (
          wishlist.map((item) => (
            <Card key={item.id} className="border-none shadow-lg rounded-3xl bg-white dark:bg-slate-900 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={item.images?.[0] && item.images[0].startsWith('http') ? item.images[0] : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"} 
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"; }}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Button 
                  onClick={() => removeFromWishlist(item.id)}
                  variant="destructive" size="icon" className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
              <CardContent className="p-5">
                <h4 className="font-bold text-sm mb-1 truncate">{item.name}</h4>
                <p className="text-primary font-extrabold mb-4">${item.basePrice.toFixed(2)}</p>
                <Button 
                  onClick={() => router.push(`/product/${item.slug}`)}
                  className="w-full rounded-xl font-bold h-10 gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> View Product
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-none shadow-xl rounded-3xl p-20 text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-xl font-bold mb-2">Wishlist is empty</h3>
            <p className="text-muted-foreground mb-8">Save items you love to your wishlist to find them easily later.</p>
            <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-2xl font-bold px-10 h-14">
              Go Shopping
            </Button>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
