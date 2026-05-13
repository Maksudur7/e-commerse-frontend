"use client";

import { useState, useEffect } from "react";
import { User, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useNotification } from "@/hooks/useNotification";

export default function ProfilePage() {
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const name = (document.getElementById("profile-name") as HTMLInputElement).value;
      const phone = (document.getElementById("profile-phone") as HTMLInputElement).value;

      const res = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ name, phone })
      });

      if (res.success) {
        const updatedUser = { ...user, name, phone };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        await notifySuccess("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      await notifyError("Failed to update profile: " + (error.message || "Unknown error"));
    }
  };

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [wishRes, orderRes] = await Promise.all([
          apiFetch("/wishlist"),
          apiFetch("/cart-orders/orders/me")
        ]);
        if (wishRes.success) setWishlist(wishRes.data || []);
        if (orderRes.success) setRecentOrders(orderRes.data?.slice(0, 3) || []);
      } catch (error) {
        console.error("Profile data fetch error:", error);
      }
    };
    fetchProfileData();
  }, []);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <Card className="border-none shadow-xl rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-8 border-b border-border/50">
          <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Full Name</label>
              <Input id="profile-name" defaultValue={user?.name} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Email Address</label>
              <Input defaultValue={user?.email} disabled className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold opacity-60" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Phone Number</label>
              <Input id="profile-phone" defaultValue={user?.phone || ""} placeholder="+1 (555) 000-0000" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Member Since</label>
              <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center px-4 font-bold text-sm text-primary">
                <Clock className="w-4 h-4 mr-2" /> {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <Button 
              onClick={handleUpdateProfile}
              className="h-14 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 gap-2"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Wishlist Preview */}
        <Card className="border-none shadow-xl rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Wishlist Preview</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/dashboard/wishlist")} className="text-primary font-bold">View All</Button>
          </CardHeader>
          <CardContent className="p-6">
            {wishlist.length > 0 ? (
              <div className="space-y-4">
                {wishlist.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer" onClick={() => (window.location.href = `/product/${item.slug}`)}>
                    <img src={item.images?.[0]} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold truncate w-40">{item.name}</p>
                      <p className="text-xs text-primary font-bold">${item.basePrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground text-sm">Your wishlist is empty</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-none shadow-xl rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/dashboard/orders")} className="text-primary font-bold">View History</Button>
          </CardHeader>
          <CardContent className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <p className="text-xs font-bold font-mono">#{order.orderNumber.substring(0, 8)}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">${order.totalAmount}</p>
                      <Badge variant="outline" className="text-[9px] h-4 uppercase">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground text-sm">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
