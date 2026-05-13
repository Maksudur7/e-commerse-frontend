"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Loader2, Trash2, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

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
    setRemoving(productId);
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
    } finally {
      setRemoving(null);
    }
  };

  const getImage = (item: any) => {
    const img = item.images?.[0];
    if (img && (img.startsWith("http") || img.startsWith("/"))) return img;
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200";
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </span>
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-1 ml-[52px]">Items you love, saved for later</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold text-sm">
          {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
        </Badge>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : wishlist.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all border border-border/40 group"
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer bg-slate-100 dark:bg-slate-800"
                  onClick={() => router.push(`/product/${item.slug}`)}
                >
                  <img
                    src={getImage(item)}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4
                        className="font-bold text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => router.push(`/product/${item.slug}`)}
                      >
                        {item.name}
                      </h4>
                      {item.category?.name && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <Tag className="w-3 h-3" /> {item.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-extrabold text-base flex-shrink-0">
                      ${Number(item.basePrice).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="h-8 px-4 rounded-xl font-bold text-xs gap-1.5 flex-1 max-w-[140px]"
                      onClick={() => router.push(`/product/${item.slug}`)}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> View Product
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center shadow-sm border border-border/40"
        >
          <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Browse our shop and save items you love to find them easily later.
          </p>
          <Button
            onClick={() => router.push("/shop")}
            className="rounded-2xl font-bold px-10 h-12 gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Go Shopping
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
