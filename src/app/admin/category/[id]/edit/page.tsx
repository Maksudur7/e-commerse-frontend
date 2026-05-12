"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });
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
      if (parsedUser.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
    };

    checkAuth();

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/categories`);
        if (res.success) {
          const foundCategory = res.data.find((cat: any) => cat.id === categoryId);
          if (foundCategory) {
            setCategory({
              name: foundCategory.name,
              image: foundCategory.image || "",
            });
          } else {
            setMessage({ type: "error", text: "Category not found" });
            setTimeout(() => router.push("/admin/dashboard?tab=categories"), 2000);
          }
        }
      } catch (error: any) {
        console.error("Fetch category error:", error);
        setMessage({ type: "error", text: "Failed to load category" });
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchCategory();
  }, [categoryId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!category.name) {
      setMessage({ type: "error", text: "Category name is required" });
      return;
    }

    try {
      setSaving(true);
      const res = await apiFetch(`/categories/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify(category),
      });

      if (res.success) {
        setMessage({ type: "success", text: "Category updated successfully!" });
        setIsEdited(false);
        setTimeout(() => router.push("/admin/dashboard?tab=categories"), 1500);
      } else {
        setMessage({ type: "error", text: res.message || "Failed to update category" });
      }
    } catch (error: any) {
      console.error("Update category error:", error);
      setMessage({ type: "error", text: error.message || "Failed to update category" });
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
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/dashboard?tab=categories")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-heading font-extrabold text-foreground">
              Edit Category
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

          {/* Form Card */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="text-sm font-bold mb-2 block">Category Name *</label>
                <Input
                  name="name"
                  value={category.name}
                  onChange={handleInputChange}
                  placeholder="E.g. Electronics, Fashion"
                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be displayed in the category list
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-sm font-bold mb-2 block">Image URL (Optional)</label>
                <Input
                  name="image"
                  value={category.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-base"
                />
                {category.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-border">
                    <img
                      src={category.image}
                      alt="Category"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+Image";
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard?tab=categories")}
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
