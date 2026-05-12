"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCcw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    variantPrice: "",
    stock: "",
    categoryId: "",
    images: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiFetch("/admin/products"),
        apiFetch("/admin/categories")
      ]);
      if (productsRes.success) setProducts(productsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddProduct = async () => {
    try {
      const res = await apiFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...newProduct,
          basePrice: parseFloat(newProduct.basePrice),
          variantPrice: parseFloat(newProduct.variantPrice),
          stock: parseInt(newProduct.stock)
        })
      });

      if (res.success) {
        setIsAddingProduct(false);
        setNewProduct({ name: "", description: "", basePrice: "", variantPrice: "", stock: "", categoryId: "", images: [] });
        fetchData();
      }
    } catch (error: any) {
      alert("Error adding product: " + error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      if (res.success) fetchData();
    } catch (error: any) {
      alert("Error deleting product: " + error.message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage your store inventory and variations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl font-bold" onClick={fetchData}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>

          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Product Name</Label>
                  <Input
                    placeholder="Enter product name"
                    className="rounded-xl h-12 bg-slate-50 border-none"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    placeholder="Product description..."
                    className="rounded-xl bg-slate-50 border-none min-h-[100px]"
                    value={newProduct.description}
                    onChange={(e: { target: { value: any; }; }) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Base Price ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="rounded-xl h-12 bg-slate-50 border-none"
                      value={newProduct.basePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Stock Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="rounded-xl h-12 bg-slate-50 border-none"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Category</Label>
                  <select
                    className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 text-sm font-medium outline-none"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Product Images</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {newProduct.images.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-xl overflow-hidden relative group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, idx) => idx !== i) })}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <Plus className="w-6 h-6 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 mt-1">Upload</span>
                      <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                <Button className="rounded-xl font-bold px-8 bg-primary hover:bg-primary/90 text-white" onClick={handleAddProduct}>Create Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              className="pl-10 rounded-xl bg-slate-50 border-none h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-none shadow-sm rounded-3xl overflow-hidden group">
            <div className="aspect-square relative overflow-hidden bg-slate-100">
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Package className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" className="rounded-full bg-white text-foreground hover:bg-slate-50 shadow-lg h-9 w-9">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full shadow-lg h-9 w-9"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{product.category?.name || 'Uncategorized'}</Badge>
                <span className="font-bold text-primary">${product.basePrice}</span>
              </div>
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-muted-foreground">{product.stock} in stock</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No products found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
