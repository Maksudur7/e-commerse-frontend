"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, Search, RefreshCcw, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/categories");
      if (res.success) setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await apiFetch("/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName })
      });
      if (res.success) {
        setIsAddingCategory(false);
        setNewCategoryName("");
        fetchCategories();
      }
    } catch (error: any) {
      alert("Error adding category: " + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will not delete products in this category.")) return;
    try {
      const res = await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
      if (res.success) fetchCategories();
    } catch (error: any) {
      alert("Error deleting category: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into collections</p>
        </div>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl font-bold bg-primary text-white hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl p-8 border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="font-bold">Category Name</Label>
                <Input 
                  placeholder="Enter category name" 
                  className="rounded-xl h-12 bg-slate-50 border-none"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsAddingCategory(false)}>Cancel</Button>
              <Button className="rounded-xl font-bold px-8 bg-primary text-white hover:bg-primary/90" onClick={handleAddCategory}>Create Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-none shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category._count?.products || 0} Products</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive focus:text-destructive cursor-pointer">
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
