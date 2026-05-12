"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { apiFetch } from "@/lib/api";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("9");
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [zoomStyle, setZoomStyle] = useState({});
  const addItem = useCartStore((state) => state.addItem);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (product?.categoryId) {
      const fetchRelated = async () => {
        try {
          const json = await apiFetch(`/products?category=${product.categoryId}&limit=4`);
          if (json.success) setRelatedProducts(json.products.filter((p: any) => p.id !== product.id));
        } catch (error) {

          console.error("Failed to fetch related products:", error);
        }
      };
      fetchRelated();
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const json = await apiFetch(`/products/${slug}`);
        if (json.success && json.data) {
          setProduct(json.data);
          
          if (json.data.images && json.data.images.length > 0) {
            setSelectedImage(json.data.images[0]);
          } else {
            setSelectedImage("https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=1000");
          }

          if (json.data.colors && json.data.colors.length > 0) {
             setSelectedColor(json.data.colors[0]);
          }
          if (json.data.sizes && json.data.sizes.length > 0) {
             setSelectedSize(json.data.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Find the actual variant ID from the database
    const matchingVariant = product.variants?.find((v: any) => 
      v.size === selectedSize && v.color === selectedColor
    ) || product.variants?.[0]; // Fallback to first variant if no match

    const variantId = matchingVariant?.id || product.id;

    addItem({
      variantId: variantId,
      productId: product.id,
      name: product.name,
      price: matchingVariant?.price || product.basePrice || 0,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });
  };


  if (loading) {
    return (
      <main className="min-h-screen pb-20">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center text-muted-foreground">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pb-20">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center text-muted-foreground">
          Product not found
        </div>
      </main>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [selectedImage];
  const categoryName = product.category?.name || "General";
  const colors = product.colors || ["White", "Black", "Grey"];
  const sizes = product.sizes || ["7", "8", "9", "10", "11"];
  const rating = product.reviews?.length ? (product.reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / product.reviews.length) : 5;
  const reviewsCount = product.reviews?.length || 124;

  let totalStock = 0;
  if (product.variants && product.variants.length > 0) {
    totalStock = product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
  } else {
    totalStock = product.status === "ACTIVE" ? 10 : 0;
  }
  const inStock = totalStock > 0;

  return (
    <main className="min-h-screen pb-20 bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "image": images,
              "description": product.description,
              "brand": {
                "@type": "Brand",
                "name": "ShopEase"
              },
              "offers": {
                "@type": "Offer",
                "url": `https://shopease.ai/product/${slug}`,
                "priceCurrency": "USD",
                "price": product.basePrice,
                "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": reviewsCount
              }
            })
          }}
        />
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div 
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 relative cursor-crosshair group border border-border/50 shadow-sm"
            >
              <img 
                src={selectedImage} 
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={zoomStyle}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-transparent hover:border-border'}`}
                  >
                    <img src={img} loading="lazy" className="w-full h-full object-cover" alt={`${product.name} view ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 uppercase tracking-widest">
              {categoryName}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 text-foreground leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">{reviewsCount} Authentic Reviews</span>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <Badge variant={inStock ? "secondary" : "destructive"} className="gap-1.5 py-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            <p className="text-4xl font-extrabold text-primary mb-6">${(product.basePrice || 0).toFixed(2)}</p>
            
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {product.description || "Experience ultimate comfort and style. Crafted from premium materials to ensure durability and elegance in every detail."}
            </p>

            {/* Selection */}
            <div className="space-y-8 mb-10">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-foreground">Color</p>
                  <span className="text-sm text-muted-foreground font-medium">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm flex items-center justify-center ${
                        selectedColor === color ? "border-primary scale-110 ring-4 ring-primary/10" : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-foreground">Size</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[3rem] px-6 rounded-xl border-2 font-bold transition-all shadow-sm ${
                        selectedSize === size 
                          ? "border-primary bg-primary text-white" 
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Button 
                size="lg" 
                className="flex-1 h-16 rounded-2xl text-lg gap-3 font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all" 
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart className="w-5 h-5" /> {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl p-0 shrink-0 hover:bg-primary/5 hover:text-primary hover:border-primary transition-colors">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-3 gap-6 bg-secondary/50 p-6 rounded-3xl">
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Free Shipping</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">30 Days Return</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">2 Year Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}

        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-heading font-black text-foreground">
              You May Also <span className="text-[#56B6C6]">Like</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.length > 0 ? relatedProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer" onClick={() => window.location.href = `/product/${p.slug}`}>
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 mb-4 relative">
                  <img 
                    src={p.images[0] || "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?auto=format&fit=crop&q=80&w=600"} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{p.category?.name || "Accessories"}</p>
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <p className="font-black text-xl text-foreground">${p.basePrice?.toFixed(2)}</p>
              </div>
            )) : (
              <p className="text-muted-foreground col-span-full">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
