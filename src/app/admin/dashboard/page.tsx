"use client";

import { useState } from "react";
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
  Square
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
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_SALES_DATA = [
  { name: "Mon", sales: 4000, orders: 240 },
  { name: "Tue", sales: 3000, orders: 139 },
  { name: "Wed", sales: 2000, orders: 980 },
  { name: "Thu", sales: 2780, orders: 390 },
  { name: "Fri", sales: 1890, orders: 480 },
  { name: "Sat", sales: 2390, orders: 380 },
  { name: "Sun", sales: 3490, orders: 430 },
];

const MOCK_PRODUCTS = [
  { id: "P-101", name: "Premium Leather Sneakers", price: 120, stock: 45, status: "Active" },
  { id: "P-102", name: "Wireless Earbuds Pro", price: 89, stock: 12, status: "Low Stock" },
  { id: "P-103", name: "Ergonomic Office Chair", price: 350, stock: 0, status: "Out of Stock" },
];

const MOCK_ORDERS = [
  { id: "ORD-7X9P2R", customer: "Sarah M.", date: "May 08", total: 245.0, status: "PROCESSING" },
  { id: "ORD-3B8M4K", customer: "John D.", date: "May 07", total: 89.99, status: "PENDING" },
  { id: "ORD-9C2L5N", customer: "Emily R.", date: "May 05", total: 350.0, status: "SHIPPED" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === MOCK_ORDERS.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(MOCK_ORDERS.map(o => o.id));
    }
  };

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
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-muted-foreground">System Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">A</div>
            </div>
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
                    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", positive: true },
                    { label: "Total Orders", value: "1,205", change: "+12.5%", positive: true },
                    { label: "Active Customers", value: "573", change: "-2.4%", positive: false },
                    { label: "System Optimization", value: "94.2%", change: "+4.1%", positive: true },
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
                        <AreaChart data={MOCK_SALES_DATA}>
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
                            {MOCK_PRODUCTS.map((p, i) => (
                              <tr key={p.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="p-4 font-mono text-sm">{p.id}</td>
                                <td className="p-4 font-bold text-sm">{p.name}</td>
                                <td className="p-4 text-sm font-medium">${p.price.toFixed(2)}</td>
                                <td className="p-4 text-sm">{p.stock} units</td>
                                <td className="p-4">
                                  <Badge className={
                                    p.status === "Active" ? "bg-green-500 hover:bg-green-600" :
                                    p.status === "Out of Stock" ? "bg-red-500 hover:bg-red-600" :
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
                              <Input placeholder="E.g. Wireless Earbuds Pro" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                            </div>
                            <div>
                              <p className="text-sm font-bold mb-1.5">Rich Description</p>
                              <textarea 
                                rows={6} 
                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-none p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Write a compelling product description..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-bold mb-1.5">Base Price ($)</p>
                                <Input type="number" placeholder="0.00" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                              </div>
                              <div>
                                <p className="text-sm font-bold mb-1.5">Stock Quantity</p>
                                <Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="border-none shadow-sm rounded-3xl">
                          <CardHeader><CardTitle>Media Gallery</CardTitle></CardHeader>
                          <CardContent>
                            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer group">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-primary" />
                              </div>
                              <p className="font-bold text-sm mb-1">Drag & Drop Images</p>
                              <p className="text-xs text-muted-foreground">or click to browse from your computer</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
                          Save Product
                        </Button>
                      </div>
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
                            {selectedOrders.length === MOCK_ORDERS.length ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                          </th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Order ID</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Customer</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Date</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Total</th>
                          <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ORDERS.map((order) => (
                          <tr key={order.id} className={`border-b border-border/50 transition-colors ${selectedOrders.includes(order.id) ? "bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/20"}`}>
                            <td className="p-4 text-center cursor-pointer" onClick={() => toggleOrderSelection(order.id)}>
                              {selectedOrders.includes(order.id) ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                            </td>
                            <td className="p-4 font-mono text-sm font-bold">{order.id}</td>
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
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
