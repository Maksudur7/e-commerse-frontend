"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/cart-orders/orders/me");
        console.log("Orders API Response:", res);
        if (res.success) setOrders(res.data || []);
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Order History</h1>
        <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
          {orders.length} Total Orders
        </Badge>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="border-none shadow-lg rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Order #{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`font-bold px-3 py-1 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-500' : 
                    order.status === 'CANCELLED' ? 'bg-red-500' : 
                    'bg-amber-500'
                  }`}>
                    {order.status}
                  </Badge>
                  <p className="font-extrabold text-lg">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border p-1">
                      <img 
                        src={item.variant?.product?.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"} 
                        alt="Product" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" className="rounded-xl font-bold h-11">View Details</Button>
                  <Button variant="ghost" className="rounded-xl font-bold h-11 text-primary">Track Order</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-xl rounded-3xl p-20 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8">You haven't placed any orders yet. Start shopping now!</p>
            <Button onClick={() => router.push("/shop")} className="rounded-2xl font-bold px-10 h-14">
              Explore Products
            </Button>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
