"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Plus,
  UploadCloud,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  LogOut,
  User,
  Shield,
  CreditCard,
  Loader2,
  Cpu,
  Globe,
  Lock,
  Moon,
  Zap,
  BarChart,
  Activity,
  Server,
  Layers
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Overview" | "Products" | "Orders" | "Customers" | "Categories" | "Analytics" | "System Insights" | "Settings" | "Profile">("Overview");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    variantPrice: "",
    stock: "",
    categoryId: "",
    images: [] as string[]
  });

  const [newCategory, setNewCategory] = useState({
    name: ""
  });

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/auth/login");
        return;
      }
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "ADMIN") {
        router.push("/dashboard"); // Redirect customers to their dashboard
        return;
      }
      setUser(parsedUser);
    };

    const fetchStats = async () => {
      try {
        const res = await apiFetch("/admin/stats");
        if (res.success) setStats(res.data);
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchStats();
  }, [router]);

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Products") {
          const res = await apiFetch("/admin/products");
          if (res.success) setProducts(res.data);
          const catRes = await apiFetch("/categories");
          if (catRes.success) setCategories(catRes.data);
        } else if (activeTab === "Categories") {
          const catRes = await apiFetch("/categories");
          if (catRes.success) setCategories(catRes.data);
        } else if (activeTab === "Orders") {
          const res = await apiFetch("/admin/orders");
          if (res.success) setOrders(res.data);
        } else if (activeTab === "Customers") {
          const res = await apiFetch("/admin/customers");
          if (res.success) setCustomers(res.data);
        }
      } catch (error) {
        console.error(`${activeTab} fetch error:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== "Overview") fetchTabData();
  }, [activeTab]);

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.basePrice || !newProduct.categoryId) {
      alert("Please fill in required fields (Name, Price, Category).");
      return;
    }
    
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description || "No description provided.",
        basePrice: parseFloat(newProduct.basePrice),
        categoryId: newProduct.categoryId,
        images: newProduct.images,
        variants: {
          create: [
            {
              sku: `SKU-${Date.now()}`,
              price: parseFloat(newProduct.variantPrice) || parseFloat(newProduct.basePrice),
              stock: parseInt(newProduct.stock) || 0,
              attributes: {}
            }
          ]
        }
      };

      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setIsAddingProduct(false);
        setNewProduct({ name: "", description: "", basePrice: "", variantPrice: "", stock: "", categoryId: "", images: [] });
        // Refresh products
        const prodRes = await apiFetch("/admin/products");
        if (prodRes.success) setProducts(prodRes.data);
      } else {
        alert("Failed to add product: " + res.message);
      }
    } catch (error: any) {
      console.error("Add product error:", error);
      alert("Failed to add product: " + (error.message || "Unknown error"));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      alert("Please provide a category name.");
      return;
    }
    
    try {
      const payload = {
        name: newCategory.name,
      };

      const res = await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setIsAddingCategory(false);
        setNewCategory({ name: "" });
        // Refresh categories
        const catRes = await apiFetch("/categories");
        if (catRes.success) setCategories(catRes.data);
      } else {
        alert("Failed to add category: " + res.message);
      }
    } catch (error: any) {
      console.error("Add category error:", error);
      alert("Failed to add category: " + (error.message || "Unknown error"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-heading font-bold">ShopEase Admin</span>
          </div>
          
          <nav className="space-y-1">
            {[
              { icon: LayoutDashboard, label: "Overview" },
              { icon: Package, label: "Products" },
              { icon: Layers, label: "Categories" },
              { icon: ShoppingCart, label: "Orders" },
              { icon: Users, label: "Customers" },
              { icon: BarChart3, label: "Analytics" },
              { icon: BrainCircuit, label: "System Insights" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <Button
                key={item.label}
                variant={activeTab === item.label ? "secondary" : "ghost"}
                onClick={() => setActiveTab(item.label)}
                className={`w-full justify-start gap-3 h-11 ${activeTab === item.label ? "bg-primary/10 text-primary font-bold" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">System Tip</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory for "Leather Sneakers" is low. Reorder soon to avoid loss.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={`Search ${activeTab.toLowerCase()}...`} className="pl-10 bg-slate-100 dark:bg-slate-800 border-none rounded-full h-10" />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="w-px h-6 bg-border" />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-full transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">{user?.name || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.role === "ADMIN" ? "System Administrator" : "Staff"}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 glass-card border-none shadow-2xl">
                <DropdownMenuLabel className="font-heading font-bold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5" onClick={() => setActiveTab("Profile")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive rounded-xl cursor-pointer py-2.5 focus:bg-destructive/10 focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">Dashboard Overview</h1>
                  <Button className="gap-2 rounded-xl font-bold">
                    <TrendingUp className="w-4 h-4" /> Export Report
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString()}`, change: "+20.1%", positive: true },
                    { label: "Total Orders", value: stats?.totalOrders?.toString(), change: "+12.5%", positive: true },
                    { label: "Active Customers", value: stats?.activeCustomers?.toString(), change: "-2.4%", positive: false },
                    { label: "Total Products", value: stats?.totalProducts?.toString(), change: "+4.1%", positive: true },
                  ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm rounded-3xl overflow-hidden">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2 font-medium">{stat.label}</p>
                        <div className="flex items-end justify-between">
                          <h3 className="text-2xl font-bold">{stat.value}</h3>
                          <div className={`flex items-center text-xs font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                            {stat.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {stat.change}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Sales Chart */}
                  <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.salesData || []}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#170C79" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#170C79" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                          <Tooltip />
                          <Area type="monotone" dataKey="sales" stroke="#170C79" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* System Insights Card */}
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-slate-900 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <BrainCircuit className="w-5 h-5 text-accent" />
                        Market Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm font-bold text-accent mb-1">Trending Tomorrow</p>
                        <p className="text-sm opacity-80 leading-relaxed">
                          Search intent for "Floral Dresses" has increased by 45% in the last 24 hours. Consider pushing notifications.
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm font-bold text-accent mb-1">Price Optimization</p>
                        <p className="text-sm opacity-80 leading-relaxed">
                          Lowering "Elite Watch" price by 5% could increase volume by 20%, resulting in higher net profit.
                        </p>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-slate-900 font-bold h-12 rounded-xl mt-4 shadow-lg shadow-accent/20">
                        Run Full Market Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "Products" && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!isAddingProduct ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-3xl font-heading font-extrabold text-foreground">Product Management</h1>
                      <Button onClick={() => setIsAddingProduct(true)} className="gap-2 rounded-xl font-bold">
                        <Plus className="w-4 h-4" /> Add New Product
                      </Button>
                    </div>

                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                      <div className="p-1">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="p-4 font-bold text-sm text-muted-foreground">ID</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Product Name</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Price</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Stock</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((p, i) => (
                              <tr key={p.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="p-4 font-mono text-sm">{p.id.substring(0, 8)}</td>
                                <td className="p-4 font-bold text-sm">{p.name}</td>
                                <td className="p-4 text-sm font-medium">${p.price.toFixed(2)}</td>
                                <td className="p-4 text-sm">{p.stock} units</td>
                                <td className="p-4">
                                  <Badge className={
                                    p.status === "ACTIVE" ? "bg-green-500 hover:bg-green-600" :
                                    p.status === "OUT_OF_STOCK" ? "bg-red-500 hover:bg-red-600" :
                                    "bg-amber-500 hover:bg-amber-600"
                                  }>{p.status}</Badge>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full"><Edit className="w-4 h-4 text-blue-500" /></Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {products.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">No products found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-3xl font-heading font-extrabold text-foreground">Add New Product</h1>
                      <Button variant="outline" onClick={() => setIsAddingProduct(false)} className="rounded-xl">
                        Cancel
                      </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm rounded-3xl">
                          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm font-bold mb-1.5">Product Name</p>
                              <Input 
                                placeholder="E.g. Wireless Earbuds Pro" 
                                className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" 
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold mb-1.5">Category</p>
                              <select 
                                className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm outline-none"
                                value={newProduct.categoryId}
                                onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                              >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <p className="text-sm font-bold mb-1.5">Rich Description</p>
                              <textarea 
                                rows={6} 
                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-none p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Write a compelling product description..."
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-bold mb-1.5">Base Price ($)</p>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" 
                                  value={newProduct.basePrice}
                                  onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold mb-1.5">Stock Quantity</p>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" 
                                  value={newProduct.stock}
                                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="border-none shadow-sm rounded-3xl">
                          <CardHeader><CardTitle>Media Gallery</CardTitle></CardHeader>
                          <CardContent>
                            <label className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer group block">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                multiple
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (!files) return;
                                  
                                  const newImages: string[] = [];
                                  Array.from(files).forEach((file) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setNewProduct(prev => ({
                                          ...prev,
                                          images: [...prev.images, reader.result as string]
                                        }));
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                }}
                              />
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-primary" />
                              </div>
                              <p className="font-bold text-sm mb-1">Click to Upload Images</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                            </label>

                            {newProduct.images.length > 0 && (
                              <div className="grid grid-cols-3 gap-4 mt-6">
                                {newProduct.images.map((img, i) => (
                                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-border">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                      onClick={() => setNewProduct(prev => ({
                                        ...prev,
                                        images: prev.images.filter((_, index) => index !== i)
                                      }))}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Button 
                          className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                          onClick={handleAddProduct}
                        >
                          Save Product
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "Categories" && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!isAddingCategory ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-3xl font-heading font-extrabold text-foreground">Category Management</h1>
                      <Button onClick={() => setIsAddingCategory(true)} className="rounded-xl shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Add New Category
                      </Button>
                    </div>

                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                      <div className="p-1">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="p-4 font-bold text-sm text-muted-foreground">ID</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Category Name</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground">Created At</th>
                              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((cat) => (
                              <tr key={cat.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="p-4 font-mono text-sm">{cat.id.substring(0, 8)}</td>
                                <td className="p-4 font-bold text-sm">{cat.name}</td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(cat.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full"><Edit className="w-4 h-4 text-blue-500" /></Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {categories.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">No categories found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-3xl font-heading font-extrabold text-foreground">Add New Category</h1>
                      <Button variant="outline" onClick={() => setIsAddingCategory(false)} className="rounded-xl">
                        Cancel
                      </Button>
                    </div>

                    <div className="max-w-xl space-y-6">
                      <Card className="border-none shadow-sm rounded-3xl">
                        <CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-bold mb-1.5">Category Name</p>
                            <Input 
                              placeholder="E.g. Electronics, Fashion" 
                              className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" 
                              value={newCategory.name}
                              onChange={(e) => setNewCategory({ name: e.target.value })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Button 
                        className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                        onClick={handleAddCategory}
                      >
                        Save Category
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "Orders" && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">Order Management</h1>
                  {selectedOrders.length > 0 && (
                    <div className="flex gap-2">
                      <select className="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-border text-sm font-bold outline-none cursor-pointer">
                        <option>Update Status (Bulk)</option>
                        <option>Mark as Processing</option>
                        <option>Mark as Shipped</option>
                        <option>Mark as Delivered</option>
                      </select>
                      <Button variant="destructive" className="rounded-xl">Delete Selected</Button>
                    </div>
                  )}
                </div>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <div className="p-1">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="p-4 w-12 text-center cursor-pointer" onClick={handleSelectAll}>
                            {selectedOrders.length === orders.length && orders.length > 0 ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                          </th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Order ID</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Customer</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Date</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Total</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className={`border-b border-border/50 transition-colors ${selectedOrders.includes(order.id) ? "bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/20"}`}>
                            <td className="p-4 text-center cursor-pointer" onClick={() => toggleOrderSelection(order.id)}>
                              {selectedOrders.includes(order.id) ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                            </td>
                            <td className="p-4 font-mono text-sm font-bold">{order.id.substring(0, 8)}</td>
                            <td className="p-4 text-sm font-medium">{order.customer}</td>
                            <td className="p-4 text-sm text-muted-foreground">{order.date}</td>
                            <td className="p-4 text-sm font-bold text-primary">${order.total.toFixed(2)}</td>
                            <td className="p-4">
                              <select 
                                defaultValue={order.status}
                                className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full outline-none cursor-pointer border-2 ${
                                  order.status === "DELIVERED" ? "bg-green-100 text-green-700 border-green-200" :
                                  order.status === "PROCESSING" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  order.status === "SHIPPED" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                  "bg-amber-100 text-amber-700 border-amber-200"
                                }`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">No orders found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "Customers" && (
              <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">Customer Directory</h1>
                </div>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <div className="p-1">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="p-4 font-bold text-sm text-muted-foreground">User ID</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Name</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Email</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Role</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="p-4 font-mono text-sm">{customer.id.substring(0, 8)}</td>
                            <td className="p-4 font-bold text-sm">{customer.name}</td>
                            <td className="p-4 text-sm">{customer.email}</td>
                            <td className="p-4 text-sm">
                              <Badge variant="outline" className="font-bold">{customer.role}</Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">No customers found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "Analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">Advanced Analytics</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl font-bold">Export Report</Button>
                    <Button className="rounded-xl font-bold">Refresh Data</Button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
                    <CardHeader className="px-0">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Growth Trajectory
                      </CardTitle>
                    </CardHeader>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats?.salesData || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="sales" stroke="#170C79" strokeWidth={4} dot={{ r: 6, fill: "#170C79" }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
                    <CardHeader className="px-0">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" /> Order Velocity
                      </CardTitle>
                    </CardHeader>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.salesData || []}>
                          <XAxis dataKey="name" hide />
                          <Tooltip />
                          <Area type="step" dataKey="orders" stroke="#22C55E" fill="#22C55E33" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Conversion Rate", value: `${stats?.conversionRate}%`, icon: Zap, color: "text-amber-500" },
                    { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString()}`, icon: TrendingUp, color: "text-blue-500" },
                    { label: "Total Orders", value: stats?.totalOrders?.toString(), icon: ShoppingCart, color: "text-green-500" },
                  ].map((item) => (
                    <Card key={item.label} className="border-none shadow-sm rounded-3xl p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 ${item.color}`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                          <h4 className="text-2xl font-bold">{item.value}</h4>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                  {/* Category Distribution */}
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" /> Category Distribution
                      </CardTitle>
                    </CardHeader>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats?.categoryStats || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                          >
                            {(stats?.categoryStats || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={['#170C79', '#56B6C6', '#22C55E', '#F59E0B', '#EFE3CA'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {(stats?.categoryStats || []).map((c: any, i: number) => (
                        <div key={c.name} className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#170C79', '#56B6C6', '#22C55E', '#F59E0B', '#EFE3CA'][i % 5] }} />
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Top Selling Products */}
                  <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" /> Top Selling Products
                      </CardTitle>
                    </CardHeader>
                    <div className="space-y-4 mt-4">
                      {(stats?.topProducts || []).map((product: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{product.name}</p>
                              <p className="text-xs text-muted-foreground">${product.price.toFixed(2)} Base Price</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-bold border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            High Demand
                          </Badge>
                        </div>
                      ))}
                      {(!stats?.topProducts || stats.topProducts.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">No product data available</div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "System Insights" && (
              <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">AI System Insights</h1>
                  <Badge className="bg-primary text-white font-bold px-4 py-1 rounded-full animate-pulse">AI ACTIVE</Badge>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <BrainCircuit className="w-8 h-8 text-purple-300" />
                      <h2 className="text-2xl font-bold">Predictive Intelligence</h2>
                    </div>
                    <p className="text-purple-100 mb-8 max-w-lg">{stats?.aiInsights?.prediction} {stats?.aiInsights?.recommendation}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                        <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-1">Stock Risk</p>
                        <p className="text-xl font-bold text-amber-300">{stats?.aiInsights?.stockRisk} Items Low</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                        <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-1">Market Sentiment</p>
                        <p className="text-xl font-bold text-green-300">{stats?.aiInsights?.sentiment}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5 text-primary" /> System Health
                      </h3>
                      <div className="space-y-4">
                        {(stats?.systemStatus || []).map((s: any) => (
                          <div key={s.name} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{s.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-muted-foreground">{s.status}</span>
                              <div className={`w-2 h-2 rounded-full ${s.color}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 rounded-xl font-bold">View Logs</Button>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">System Settings</h1>
                
                <div className="grid gap-8">
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" /> General Configuration
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Store Name</label>
                        <Input defaultValue="ShopEase AI" className="rounded-xl h-12 bg-slate-50 border-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Admin Email</label>
                        <Input defaultValue="admin@shopease.ai" className="rounded-xl h-12 bg-slate-50 border-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Currency</label>
                        <select className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 text-sm font-medium outline-none">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>BDT (৳)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Maintenance Mode</label>
                        <div className="flex items-center h-12 gap-4">
                           <Button variant="outline" className="rounded-xl px-6 bg-red-50 text-red-600 border-red-100 hover:bg-red-100">Disable Site</Button>
                           <span className="text-xs text-muted-foreground font-medium">Currently: Public</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" /> Security & API
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="font-bold text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security to admin accounts.</p>
                        </div>
                        <Badge className="bg-green-500 text-white">ENABLED</Badge>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Gemini AI API Key</label>
                        <div className="flex gap-2">
                          <Input value="***************************" type="password" disabled className="rounded-xl h-12 bg-slate-100 border-none flex-1" />
                          <Button variant="outline" className="rounded-xl h-12 px-6">Update</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "Profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-heading font-extrabold text-foreground">Admin Profile</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-1 border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 h-fit">
                    <CardContent className="p-8 text-center">
                      <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                          {user?.name?.charAt(0) || "A"}
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-2xl text-foreground">{user?.name || "Admin User"}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{user?.email || "admin@shopease.ai"}</p>
                      <Badge className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">{user?.role}</Badge>
                      
                      <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Account Status</span>
                          <span className="text-green-500 font-bold">Verified</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Join Date</span>
                          <span className="font-bold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b border-border/50">
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Display Name</p>
                          <Input defaultValue={user?.name} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Email Address</p>
                          <Input defaultValue={user?.email} type="email" disabled className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium opacity-70" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Role</p>
                          <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none flex items-center px-4 font-bold text-sm text-primary">
                            <Shield className="w-4 h-4 mr-2" /> {user?.role}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Access Level</p>
                          <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none flex items-center px-4 font-bold text-sm text-primary">
                            <CreditCard className="w-4 h-4 mr-2" /> Tier 3 (Full Access)
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border flex justify-end gap-4">
                        <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">Discard</Button>
                        <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
