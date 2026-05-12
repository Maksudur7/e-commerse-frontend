"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, LogOut, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/useCartStore";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [showAiResults, setShowAiResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Fetch dynamic categories
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/categories");
        if (res.success) setCategories(res.data || []);
      } catch (error) {
        console.error("Navbar categories error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/auth/login";
  };

  const [aiSearchResults, setAiSearchResults] = useState<any[]>([]);
  const [aiIntent, setAiIntent] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsAiSearching(true);
    setShowAiResults(true);
    
    try {
      const res = await apiFetch("/ai/search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery })
      });
      
      if (res.success) {
        setAiIntent(res.data?.intent || `Search: ${searchQuery}`);
        // For demonstration, we'll fetch products based on the search intent or just the query
        const prodRes = await apiFetch(`/products?search=${searchQuery}&limit=3`);
        if (prodRes.success) setAiSearchResults(prodRes.products || []);
      }
    } catch (error) {
      console.error("AI Search error:", error);
    } finally {
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="text-2xl font-heading font-extrabold text-foreground group-hover:text-primary transition-colors">
            ShopEase
          </span>
        </Link>

        {/* Categories / Nav Items */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/new" className="text-sm font-medium hover:text-primary transition-colors">
            New Arrivals
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors outline-none">
              Collections <ChevronDown className="w-4 h-4 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-2xl glass-card">
              {categories.length > 0 ? categories.map((cat) => (
                <DropdownMenuItem key={cat.id} className="p-0 cursor-pointer">
                  <Link href={`/shop?category=${cat.slug}`} className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors capitalize">{cat.name}</Link>
                </DropdownMenuItem>
              )) : (
                <>
                  <DropdownMenuItem className="p-0 cursor-pointer">
                    <Link href="/shop?category=Electronics" className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Electronics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 cursor-pointer">
                    <Link href="/shop?category=Fashion" className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Fashion</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0 cursor-pointer text-primary font-medium">
                <Link href="/stylist" className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Expert Curated</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        {/* Smart Search Bar */}
        <div className="flex-1 max-w-lg relative hidden md:block">
          <form onSubmit={handleSearch} className="relative group z-50">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAiResults(false);
              }}
              placeholder="Smart Search: try 'blue running shoes under $50'"
              className="pl-10 pr-12 h-11 bg-muted/50 border-transparent hover:bg-muted/80 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full transition-all text-sm font-medium"
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1 h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
            </Button>
          </form>

          {/* Smart Search Results Dropdown */}
          <AnimatePresence>
            {showAiResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-14 left-0 w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border/50 overflow-hidden z-50"
              >
                <div className="p-3 bg-primary/5 border-b border-border/50 flex items-center gap-2 text-sm text-primary font-bold">
                  {isAiSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                  {isAiSearching ? "System is analyzing your request..." : "Smart Results"}
                </div>
                <div className="p-4">
                  {isAiSearching ? (
                    <div className="space-y-3">
                      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-3 italic">Parsed Intent: {aiIntent}</p>
                      {aiSearchResults.length > 0 ? aiSearchResults.map((prod) => (
                        <Link key={prod.id} href={`/product/${prod.slug}`} onClick={() => setShowAiResults(false)}>
                          <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors mb-1">
                            <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                              <img src={prod.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{prod.name}</p>
                              <p className="text-xs text-primary font-bold">${prod.basePrice}</p>
                            </div>
                          </div>
                        </Link>
                      )) : (
                        <p className="text-xs text-muted-foreground text-center py-2">No matching products found.</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/checkout" className="relative rounded-full hover:bg-muted h-10 w-10 flex items-center justify-center transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="bg-primary text-white h-5 w-5 flex items-center justify-center p-0 text-[10px] shadow-sm">
                    {cartCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 hidden sm:flex outline-none overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 glass-card">
                <div className="px-2 py-1.5 text-sm font-bold font-heading text-primary">{user?.name || "My Account"}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0 cursor-pointer">
                  <Link href="/dashboard?tab=profile" className="flex w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 cursor-pointer">
                  <Link href="/dashboard?tab=orders" className="flex w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 cursor-pointer">
                  <Link href="/dashboard?tab=wishlist" className="flex w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive cursor-pointer py-2 focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" className="hidden sm:block">
              <Button className="rounded-full px-6 font-bold h-10">Sign In</Button>
            </Link>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-full h-10 w-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden p-6"
            >
              <div className="flex flex-col gap-6 pt-12">
                <Link href="/new" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  New Arrivals
                </Link>
                <Link href="/shop" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Collections
                </Link>
                <Link href="/about" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  About Us
                </Link>
                <div className="h-px bg-border my-2" />
                <Link href="/dashboard?tab=profile" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  My Profile
                </Link>
                <Link href="/dashboard?tab=orders" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
                <Link href="/dashboard?tab=wishlist" className="text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Wishlist
                </Link>
                <Button 
                  variant="destructive" 
                  className="mt-4 rounded-xl font-bold justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

