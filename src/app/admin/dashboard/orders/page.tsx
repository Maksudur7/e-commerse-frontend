"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCcw,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useNotification } from "@/hooks/useNotification";

export default function OrdersPage() {
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/orders");
      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await apiFetch(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
        await notifySuccess(`Order status updated to ${status}`);
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      await notifyError("Error updating status: " + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-full font-bold"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
      case "SHIPPED": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-full font-bold"><Truck className="w-3 h-3 mr-1" /> Shipped</Badge>;
      case "PROCESSING": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 rounded-full font-bold"><RefreshCcw className="w-3 h-3 mr-1" /> Processing</Badge>;
      case "PENDING": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-3 py-1 rounded-full font-bold"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "CANCELLED": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1 rounded-full font-bold"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default: return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-3 py-1 rounded-full font-bold">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-1">Track, manage and process customer orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl font-bold" onClick={fetchOrders}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
          <Button className="gap-2 rounded-xl font-bold">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer..."
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full px-4 font-bold text-xs ${filterStatus === status ? "bg-primary/10 text-primary" : ""}`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 font-bold text-sm text-muted-foreground">Order Number</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Customer</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Date</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Total</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Payment</th>
                <th className="p-4 font-bold text-sm text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <span className="font-bold text-sm text-primary">#{order.orderNumber}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{order.customer}</span>
                      <span className="text-xs text-muted-foreground">{order.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">{order.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-sm">${order.total?.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase">{order.paymentMethod}</span>
                      <span className={`text-[10px] font-bold ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-2 outline-none cursor-pointer"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="PENDING">Set Pending</option>
                        <option value="CONFIRMED">Confirm</option>
                        <option value="PROCESSING">Process</option>
                        <option value="SHIPPED">Ship</option>
                        <option value="DELIVERED">Deliver</option>
                        <option value="CANCELLED">Cancel</option>
                      </select>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No orders found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="rounded-xl font-bold px-4"
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl font-bold ${currentPage === page ? "bg-primary shadow-lg shadow-primary/20" : ""}`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="rounded-xl font-bold px-4"
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}
