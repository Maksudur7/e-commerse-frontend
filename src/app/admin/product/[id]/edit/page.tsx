"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check, Trash2, UploadCloud } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    images: [] as string[],
    isFeatured: false,
    status: "ACTIVE",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/auth/login");
        return;
      }
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "ADMIN" && parsedUser.role !== "VENDOR") {
        router.push("/dashboard");
        return;
      }
    };

    checkAuth();

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product
        const prodRes = await apiFetch(`/admin/products`);
        if (prodRes.success) {
          const foundProduct = prodRes.data.find((p: any) => p.id === productId);
          if (foundProduct) {
            setProduct({
              name: foundProduct.name,
              description: foundProduct.description || "",
              basePrice: foundProduct.basePrice?.toString() || "",
              categoryId: foundProduct.categoryId || "",
              images: foundProduct.images || [],
              isFeatured: foundProduct.isFeatured || false,
              status: foundProduct.status || "ACTIVE",
            });
          } else {
            setMessage({ type: "error", text: "Product not found" });
            setTimeout(() => router.push("/admin/dashboard?tab=products"), 2000);
          }
        }

        // Fetch categories
        const catRes = await apiFetch(`/categories`);
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (error: any) {
        console.error("Fetch data error:", error);
        setMessage({ type: "error", text: "Failed to load product" });
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setIsEdited(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
          setIsEdited(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!product.name || !product.basePrice || !product.categoryId) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: product.name,
        description: product.description,
        basePrice: parseFloat(product.basePrice),
        categoryId: product.categoryId,
        images: product.images,
        isFeatured: product.isFeatured,
        status: product.status,
      };

      const res = await apiFetch(`/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setMessage({ type: "success", text: "Product updated successfully!" });
        setIsEdited(false);
        setTimeout(() => router.push("/admin/dashboard?tab=products"), 1500);
      } else {
        setMessage({ type: "error", text: res.message || "Failed to update product" });
      }
    } catch (error: any) {
      console.error("Update product error:", error);
      setMessage({ type: "error", text: error.message || "Failed to update product" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/dashboard?tab=products")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-heading font-extrabold text-foreground">
              Edit Product
            </h1>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900"
                  : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900"
              }`}
            >
              <Check className="w-5 h-5" />
              <p className="font-semibold">{message.text}</p>
            </motion.div>
          )}

          {/* Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Product Name *</label>
                    <Input
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      placeholder="E.g. Wireless Earbuds Pro"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 block">Category *</label>
                    <select
                      name="categoryId"
                      value={product.categoryId}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 block">Description</label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Write a compelling product description..."
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-none p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block">Base Price ($) *</label>
                      <Input
                        name="basePrice"
                        type="number"
                        value={product.basePrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block">Status</label>
                      <select
                        name="status"
                        value={product.status}
                        onChange={handleInputChange}
                        className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm outline-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={product.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <label className="font-semibold cursor-pointer">
                      Mark as Featured Product
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Media Gallery */}
            <div>
              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle>Media Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer group block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-bold text-sm mb-1">Click to Upload</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </label>

                  {product.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {product.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative group rounded-xl overflow-hidden aspect-square border border-border"
                        >
                          <img
                            src={img}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            onClick={() => removeImage(i)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 text-xs text-muted-foreground">
                    <p className="font-semibold mb-2">Images uploaded: {product.images.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard?tab=products")}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !isEdited}
              className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
