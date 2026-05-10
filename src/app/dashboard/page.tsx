"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, MapPin, Search, Edit2, Camera, CheckCircle2, Circle, Truck, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_ORDERS = [
  {
    id: "ORD-7X9P2R",
    date: "May 08, 2026",
    total: 245.0,
    status: "PROCESSING", // PENDING, PROCESSING, SHIPPED, DELIVERED
    items: [
      { name: "Minimalist Leather Sneakers", qty: 1, price: 120.0 },
      { name: "Cotton Crewneck T-Shirt", qty: 2, price: 62.5 }
    ]
  },
  {
    id: "ORD-3B8M4K",
    date: "April 22, 2026",
    total: 89.99,
    status: "SHIPPED",
    items: [
      { name: "Wireless Earbuds Pro", qty: 1, price: 89.99 }
    ]
  },
  {
    id: "ORD-9C2L5N",
    date: "March 15, 2026",
    total: 350.0,
    status: "DELIVERED",
    items: [
      { name: "Ergonomic Office Chair", qty: 1, price: 350.0 }
    ]
  }
];

const ORDER_STATUS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(MOCK_ORDERS[0].id);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesFilter = orderFilter === "ALL" || order.status === orderFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeOrderDetails = MOCK_ORDERS.find(o => o.id === selectedOrder);

  const getStepStatus = (step: string, currentStatus: string) => {
    const currentIndex = ORDER_STATUS_STEPS.indexOf(currentStatus);
    const stepIndex = ORDER_STATUS_STEPS.indexOf(step);
    if (stepIndex < currentIndex) return "COMPLETED";
    if (stepIndex === currentIndex) return "ACTIVE";
    return "PENDING";
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-4xl font-heading font-extrabold mb-10 text-foreground">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white shadow-sm overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-xl text-foreground">Sarah M.</h3>
                  <p className="text-sm text-muted-foreground">sarah.m@example.com</p>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant={activeTab === "orders" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "orders" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="w-5 h-5 mr-3" /> My Orders
                  </Button>
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "profile" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="w-5 h-5 mr-3" /> Profile Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 rounded-xl font-semibold text-muted-foreground"
                  >
                    <MapPin className="w-5 h-5 mr-3" /> Saved Addresses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border-none">
                    <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
                      {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map(status => (
                        <Button 
                          key={status}
                          variant={orderFilter === status ? "default" : "secondary"}
                          size="sm"
                          className="rounded-full px-4 font-bold text-xs shrink-0"
                          onClick={() => setOrderFilter(status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by Order ID..." 
                        className="pl-9 rounded-full bg-slate-50 dark:bg-slate-800 border-none h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-5 gap-6">
                    {/* Order List */}
                    <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground bg-white dark:bg-slate-900 rounded-3xl">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No orders found.</p>
                        </div>
                      ) : (
                        filteredOrders.map(order => (
                          <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order.id)}
                            className={`p-5 rounded-3xl cursor-pointer transition-all border-2 ${
                              selectedOrder === order.id 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-white dark:bg-slate-900 border-transparent hover:border-primary/20"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-sm">{order.id}</p>
                                <p className="text-xs text-muted-foreground">{order.date}</p>
                              </div>
                              <Badge className={`text-[10px] uppercase tracking-wider ${
                                order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" :
                                order.status === "PROCESSING" ? "bg-blue-500 hover:bg-blue-600" :
                                order.status === "SHIPPED" ? "bg-purple-500 hover:bg-purple-600" :
                                "bg-amber-500 hover:bg-amber-600"
                              }`}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="font-extrabold text-primary">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                              {order.items.map(i => i.name).join(", ")}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Order Tracker Details */}
                    <div className="lg:col-span-3">
                      {activeOrderDetails ? (
                        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden sticky top-32">
                          <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b border-border/50 pb-6">
                            <div className="flex justify-between items-center mb-2">
                              <CardTitle className="text-xl">Order Details</CardTitle>
                              <Button variant="outline" size="sm" className="rounded-full font-bold h-8 text-xs">
                                Download Invoice
                              </Button>
                            </div>
                            <CardDescription className="font-mono">{activeOrderDetails.id}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-8">
                            {/* Visual Tracking Bar */}
                            <div className="mb-12 relative">
                              <p className="text-sm font-bold mb-6 text-foreground">Tracking Status</p>
                              
                              <div className="absolute top-14 left-[10%] right-[10%] h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${(ORDER_STATUS_STEPS.indexOf(activeOrderDetails.status) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` 
                                  }}
                                />
                              </div>

                              <div className="flex justify-between relative z-10">
                                {ORDER_STATUS_STEPS.map((step, idx) => {
                                  const status = getStepStatus(step, activeOrderDetails.status);
                                  return (
                                    <div key={step} className="flex flex-col items-center gap-3">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm ${
                                        status === "COMPLETED" ? "bg-primary text-white" :
                                        status === "ACTIVE" ? "bg-primary text-white ring-4 ring-primary/20" :
                                        "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-muted-foreground"
                                      }`}>
                                        {status === "COMPLETED" ? <CheckCircle2 className="w-5 h-5" /> : 
                                         status === "ACTIVE" ? <Truck className="w-4 h-4" /> :
                                         <Circle className="w-3 h-3" />}
                                      </div>
                                      <p className={`text-[10px] font-bold tracking-wider ${
                                        status !== "PENDING" ? "text-foreground" : "text-muted-foreground"
                                      }`}>{step}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Item List */}
                            <div className="space-y-4">
                              <p className="text-sm font-bold text-foreground">Items</p>
                              {activeOrderDetails.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <div>
                                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                                  </div>
                                  <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center">
                              <p className="font-bold text-muted-foreground">Total Amount</p>
                              <p className="text-2xl font-extrabold text-foreground">${activeOrderDetails.total.toFixed(2)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground bg-white dark:bg-slate-900 rounded-3xl">
                          Select an order to view details.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-8 pt-8">
                      <CardTitle className="text-2xl">Personal Information</CardTitle>
                      <CardDescription>Update your personal details and how we can reach you.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Full Name</p>
                          <div className="relative">
                            <Input defaultValue="Sarah M." className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium pr-10" />
                            <Edit2 className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Email Address</p>
                          <Input defaultValue="sarah.m@example.com" type="email" disabled className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium opacity-70" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Phone Number</p>
                          <div className="relative">
                            <Input defaultValue="+1 234 567 8900" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium pr-10" />
                            <Edit2 className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Date of Birth</p>
                          <Input type="date" defaultValue="1995-08-15" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium" />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border">
                        <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
