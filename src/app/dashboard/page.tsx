"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, MapPin, Search, Edit2, Camera, CheckCircle2, Circle, Truck, Clock, Heart, Trash2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";



const ORDER_STATUS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function CustomerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as any;
  
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "wishlist" | "addresses">("orders");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        // Fetch Profile
        const profileJson = await apiFetch("/users/profile");
        if (profileJson.success) setUser(profileJson.user);

        // Fetch Orders
        const ordersJson = await apiFetch("/cart-orders/orders/me");
        if (ordersJson.status === 'success' || ordersJson.success) {
          const orderList = ordersJson.data || ordersJson.orders || [];
          setOrders(orderList);
          if (orderList.length > 0) setSelectedOrder(orderList[0].id);
        }

        // Fetch Addresses
        const addressesJson = await apiFetch("/users/addresses");
        if (addressesJson.success) setAddresses(addressesJson.addresses || []);

        // Fetch Wishlist
        const wishlistJson = await apiFetch("/wishlist");
        if (wishlistJson.success) {
          setWishlist(wishlistJson.data || []);
        }

      } catch (error) {

        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    if (tabParam && ["orders", "profile", "wishlist", "addresses"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [isUpdating, setIsUpdating] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    address: "",
    city: "",
    zip: "",
    isDefault: false
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await apiFetch("/users/addresses", {
        method: "POST",
        body: JSON.stringify(newAddress)
      });
      if (res.success) {
        setAddresses(res.addresses);
        setIsAddressModalOpen(false);
        setNewAddress({ type: "Home", address: "", city: "", zip: "", isDefault: false });
        alert("Address added successfully!");
      }
    } catch (error: any) {
      alert(error.message || "Failed to add address");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {

    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
        })
      });
      if (res.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    } catch (error: any) {
      alert(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };


  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === "ALL" || order.status === orderFilter;
    const matchesSearch = (order.orderNumber || order.id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeOrderDetails = orders.find(o => o.id === selectedOrder);

  const getStepStatus = (step: string, currentStatus: string) => {
    const currentIndex = ORDER_STATUS_STEPS.indexOf(currentStatus);
    const stepIndex = ORDER_STATUS_STEPS.indexOf(step);
    if (stepIndex < currentIndex) return "COMPLETED";
    if (stepIndex === currentIndex) return "ACTIVE";
    return "PENDING";
  };

  const addItem = useCartStore((state) => state.addItem);

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await apiFetch("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId })
      });
      if (res.success) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
    }
  };

  const handleWishlistAddToCart = (product: any) => {
    if (!product.variants || product.variants.length === 0) {
      alert("This product is currently unavailable.");
      return;
    }
    
    // Pick the first variant as default
    const variant = product.variants[0];
    addItem({
      id: variant.id,
      productId: product.id,
      name: product.name,
      price: variant.price,
      image: product.images?.[0] || "",
      quantity: 1,
      variantId: variant.id,
      color: variant.color,
      size: variant.size,
    });
    alert(`${product.name} added to cart!`);
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
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-xl text-foreground">{user?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                <div className="space-y-2">
                  <Button 
                    variant={activeTab === "orders" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "orders" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => handleTabChange("orders")}
                  >
                    <Package className="w-5 h-5 mr-3" /> My Orders
                  </Button>
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "profile" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => handleTabChange("profile")}
                  >
                    <User className="w-5 h-5 mr-3" /> Profile Details
                  </Button>
                  <Button 
                    variant={activeTab === "wishlist" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "wishlist" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => handleTabChange("wishlist")}
                  >
                    <Heart className="w-5 h-5 mr-3" /> Wishlist
                  </Button>
                  <Button 
                    variant={activeTab === "addresses" ? "default" : "ghost"} 
                    className={`w-full justify-start h-12 rounded-xl font-semibold ${activeTab === "addresses" ? "bg-primary text-white shadow-md shadow-primary/20" : ""}`}
                    onClick={() => handleTabChange("addresses")}
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
                            <p className="font-extrabold text-primary">${(order.totalAmount || 0).toFixed(2)}</p>

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
                        <Card className="border-none shadow-xl rounded-2xl overflow-hidden sticky top-32">
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
                              {activeOrderDetails?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <div>
                                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity || item.qty}</p>

                                  </div>
                                  <p className="font-bold text-primary">${(item.price || 0).toFixed(2)}</p>

                                </div>
                              ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center">
                              <p className="font-bold text-muted-foreground">Total Amount</p>
                              <p className="text-2xl font-extrabold text-foreground">${(activeOrderDetails.totalAmount || 0).toFixed(2)}</p>

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
                            <Input value={user?.name || ""} onChange={(e) => setUser({...user, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium pr-10" />
                            <Edit2 className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Email Address</p>
                          <Input value={user?.email || ""} type="email" disabled className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium opacity-70" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Phone Number</p>
                          <div className="relative">
                            <Input value={user?.phone || ""} onChange={(e) => setUser({...user, phone: e.target.value})} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium pr-10" />
                            <Edit2 className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Registration Date</p>
                          <Input type="text" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} disabled className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium opacity-70" />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border">
                        <Button 
                          className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform"
                          onClick={handleUpdateProfile}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div 
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-bold">My Wishlist ({wishlist.length})</h2>
                    <Button variant="outline" className="rounded-xl font-bold" disabled={wishlist.length === 0}>Add All to Cart</Button>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    {wishlist.length > 0 ? wishlist.map(item => (
                      <Card key={item.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 group">
                        <CardContent className="p-4 flex gap-4">
                          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0">
                            <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col justify-between py-1 flex-1">
                            <div>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{item.category?.name || item.category}</p>
                              <h3 className="font-bold text-sm text-foreground line-clamp-1">{item.name}</h3>
                              <p className="font-extrabold text-lg mt-1">${(item.basePrice || item.price || 0).toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="h-8 rounded-lg text-[10px] font-bold flex-1"
                                onClick={() => handleWishlistAddToCart(item)}
                              >
                                Add to Cart
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="col-span-2 text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-medium">Your wishlist is empty. Start exploring!</p>
                        <Button className="mt-6 rounded-xl font-bold" onClick={() => router.push("/shop")}>Go to Shop</Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-2xl font-bold">Saved Addresses</h2>
                    <Button 
                      className="rounded-xl font-bold gap-2"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" /> Add New Address
                    </Button>
                  </div>


                  <div className="grid sm:grid-cols-2 gap-6">
                    {loading ? (
                      Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
                      ))
                    ) : addresses.length === 0 ? (
                      <div className="col-span-2 text-center py-10 bg-white dark:bg-slate-900 rounded-3xl text-muted-foreground">
                        No addresses saved.
                      </div>
                    ) : addresses.map((addr: any) => (
                      <Card key={addr.id} className={`border-2 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 ${addr.isDefault ? "border-primary" : "border-transparent"}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${addr.isDefault ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"}`}>
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold">{addr.type}</h3>
                                {addr.isDefault && <Badge variant="secondary" className="text-[9px] font-bold uppercase bg-primary/10 text-primary border-none">Default</Badge>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground font-medium">
                            <p>{addr.address}</p>
                            <p>{addr.city}, {addr.zip}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="font-bold">Address Type</Label>
              <div className="flex gap-2">
                {["Home", "Office", "Other"].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={newAddress.type === t ? "default" : "outline"}
                    className="rounded-xl font-bold flex-1"
                    onClick={() => setNewAddress({ ...newAddress, type: t })}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Street Address</Label>
              <Input
                required
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                placeholder="123 Street Name"
                className="rounded-xl h-12 bg-slate-50 border-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">City</Label>
                <Input
                  required
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="New York"
                  className="rounded-xl h-12 bg-slate-50 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Zip Code</Label>
                <Input
                  required
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  placeholder="10001"
                  className="rounded-xl h-12 bg-slate-50 border-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                Set as default address
              </label>
            </div>
            <DialogFooter className="pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>

  );
}
