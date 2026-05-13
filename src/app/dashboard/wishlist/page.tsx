"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Loader2, Trash2, ShoppingCart, Tag, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("not_logged_in");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await apiFetch("/wishlist");
        console.log("Wishlist API response:", res);
        if (res.success) {
          setWishlist(res.data || []);
        } else {
          setError("fetch_failed");
        }
      } catch (err: any) {
        console.error("Wishlist fetch error:", err);
        setError(err.message || "fetch_failed");
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
        setWishlist(prev => prev.filter(item => item.id !== productId));
      }
    } catch (err) {
      console.error("Wishlist remove error:", err);
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (item: any) => {
    const variantId = item.variants?.[0]?.id;
    if (!variantId) {
      // No variant — go to product page to select one
      router.push(`/product/${item.slug}`);
      return;
    }

    setAddingToCart(item.id);
    try {
      const res = await apiFetch("/cart-orders/cart/add", {
        method: "POST",
        body: JSON.stringify({ variantId, quantity: 1 })
      });
      console.log("Add to cart response:", res);
      if (res.success) {
        setCartSuccess(item.id);
        setTimeout(() => setCartSuccess(null), 2500);
      }
    } catch (err: any) {
      console.error("Add to cart error:", err.message);
      // Fallback: navigate to product page
      router.push(`/product/${item.slug}`);
    } finally {
      setAddingToCart(null);
    }
  };

  const getImage = (item: any) => {
    // 1. Check if we saved an image when adding to wishlist
    // 2. Check if the product has images directly
    // 3. Fallback placeholder
    const img = item.wishlistImage || item.images?.[0];
    if (img && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:"))) return img;
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200";
  };

  // — Not logged in
  if (error === "not_logged_in") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Please log in</h3>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your wishlist.</p>
        <Button onClick={() => router.push("/auth/login")} className="rounded-2xl px-8 h-12 font-bold">
          Go to Login
        </Button>
      </div>
    );
  }

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
        {!loading && (
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold text-sm">
            {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
          </Badge>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your wishlist...</p>
        </div>
      ) : error ? (
        /* Generic error */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-border/40 shadow-sm">
          <p className="text-destructive font-bold mb-2">Could not load wishlist</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-2xl px-8">
            Retry
          </Button>
        </div>
      ) : wishlist.length > 0 ? (
        /* Wishlist Cards */
        <div className="space-y-3">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
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
                  <div className="flex items-start justify-between gap-2 mb-2">
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Add to Cart */}
                    <Button
                      size="sm"
                      variant={cartSuccess === item.id ? "default" : "outline"}
                      className={`h-8 px-3 rounded-xl font-bold text-xs gap-1.5 flex-1 max-w-[150px] transition-all ${
                        cartSuccess === item.id
                          ? "bg-green-500 hover:bg-green-500 text-white border-green-500"
                          : ""
                      }`}
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart === item.id}
                    >
                      {addingToCart === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : cartSuccess === item.id ? (
                        "✓ Added!"
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </>
                      )}
                    </Button>

                    {/* View Product */}
                    <Button
                      size="sm"
                      className="h-8 px-3 rounded-xl font-bold text-xs gap-1.5 flex-1 max-w-[130px]"
                      onClick={() => router.push(`/product/${item.slug}`)}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> View Product
                    </Button>

                    {/* Remove */}
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
        /* Empty State */
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
