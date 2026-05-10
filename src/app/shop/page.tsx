"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, ChevronDown, Check } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Products";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update selected category when URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const json = await res.json();
        if (json.success && json.data) {
          setProducts(json.data);
        }
      } catch (error) {
        console.log("Failed to fetch products (using fallback data)");
        // Fallback mock data if API fails
        setProducts([
          { id: "1", name: "Premium Leather Sneakers", basePrice: 120, images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"], category: { name: "Footwear" } },
          { id: "2", name: "Wireless Earbuds Pro", basePrice: 89, images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600"], category: { name: "Electronics" } },
          { id: "3", name: "Minimalist Watch", basePrice: 199, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"], category: { name: "Accessories" } },
          { id: "4", name: "Cotton Crewneck T-Shirt", basePrice: 35, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], category: { name: "Apparel" } },
          { id: "5", name: "Classic Denim Jacket", basePrice: 85, images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600"], category: { name: "Apparel" } },
          { id: "6", name: "Sports Smartwatch", basePrice: 250, images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600"], category: { name: "Electronics" } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = selectedCategory === "All Products"
    ? products
    : products.filter(p => p.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <>
      <Navbar />

      {/* Hero Banner for Shop */}
      <div className="bg-primary text-white pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-4">Shop All Collections</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover our premium selection of products carefully curated for you. Use the filters to find exactly what you're looking for.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-border/50">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-6 pb-4 border-b border-border/50 text-foreground">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-foreground">Categories</h3>
                <div className="space-y-3 text-sm font-medium text-muted-foreground">
                  {["All Products", "Electronics", "Apparel", "Home & Living", "Accessories"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedCategory(cat)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedCategory === cat ? "bg-primary border-primary text-white" : "border-slate-300 dark:border-slate-700 group-hover:border-primary"}`}>
                        {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={selectedCategory === cat ? "text-foreground font-bold" : "group-hover:text-foreground"}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-foreground">Price Range</h3>
                <div className="flex items-center gap-3">
                  <Input type="number" placeholder="Min" className="rounded-xl h-10 text-sm" />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" placeholder="Max" className="rounded-xl h-10 text-sm" />
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-bold mb-4 text-foreground">Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {["#000000", "#FFFFFF", "#170C79", "#EF4444", "#22C55E", "#EAB308"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-muted-foreground font-medium">Showing <span className="text-foreground font-bold">{displayedProducts.length}</span> products</p>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 h-11 rounded-full bg-white dark:bg-slate-900 border-none shadow-sm" />
                </div>
                <div className="relative hidden sm:block">
                  <select className="h-11 pl-4 pr-10 rounded-full bg-white dark:bg-slate-900 border-none shadow-sm font-medium appearance-none outline-none cursor-pointer">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 h-[400px] animate-pulse">
                    <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4" />
                    <div className="w-3/4 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2" />
                    <div className="w-1/2 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  </div>
                ))
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    slug={product.slug || product.id}
                    price={product.basePrice || 0}
                    image={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"}
                    category={product.category?.name || "General"}
                    rating={5}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {displayedProducts.length > 0 && (
              <div className="mt-16 flex justify-center gap-2">
                <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-none bg-white dark:bg-slate-900 shadow-sm" disabled>&lt;</Button>
                <Button className="w-10 h-10 rounded-full p-0 shadow-sm">1</Button>
                <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-none bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100">2</Button>
                <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-none bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100">3</Button>
                <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-none bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100">&gt;</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Shop() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
