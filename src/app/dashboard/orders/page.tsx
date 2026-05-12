"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Download, Package, Loader2, CheckCircle2, Circle, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

const STATUS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  PROCESSING: "bg-blue-600 text-white",
  SHIPPED: "bg-purple-500 text-white",
  DELIVERED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

function TrackingProgress({ status }: { status: string }) {
  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 w-full">
      {STATUS_STEPS.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                    ? "bg-indigo-900 border-indigo-900 text-white"
                    : isCurrent
                      ? "bg-indigo-900 border-indigo-900 text-white"
                      : "bg-white border-slate-300 text-slate-300"
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Truck className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide ${isCompleted || isCurrent ? "text-indigo-900" : "text-slate-400"
                  }`}
              >
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${i < currentStep ? "bg-indigo-900" : "bg-slate-200"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/cart-orders/orders/me");
      console.log("Orders API Response:", res);
      if (res.success && res.data?.length > 0) {
        setOrders(res.data);
        setSelectedOrder(res.data[0]);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filters = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = activeFilter === "ALL" || o.status === activeFilter;
    const matchesSearch = search === "" || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  // Format a short order ID display like "ORD-7X9P2R"
  const formatOrderId = (orderNumber: string) =>
    `ORD-${orderNumber.substring(0, 7).toUpperCase()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold mb-2">No orders found</h3>
        <p className="text-muted-foreground mb-8 max-w-xs">
          If you just placed an order, click Refresh. Otherwise start shopping!
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="rounded-2xl font-bold px-8 h-12 gap-2"
          >
            <Loader2 className="w-4 h-4" /> Refresh Orders
          </Button>
          <Button
            onClick={() => router.push("/shop")}
            className="rounded-2xl font-bold px-8 h-12 bg-indigo-900 hover:bg-indigo-800"
          >
            Explore Products
          </Button>
        </div>
      </motion.div>
    );
  }


  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          className="rounded-xl font-bold gap-2 h-9"
          disabled={loading}
        >
          <Loader2 className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${activeFilter === f
                  ? "bg-indigo-900 text-white border-indigo-900"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID..."
            className="pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Left — Order List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {paginatedOrders.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground text-sm">No orders match your filter.</p>
            ) : (
              paginatedOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const productNames = order.items
                  ?.map((i: any) => i.variant?.product?.name)
                  .filter(Boolean)
                  .join(", ");
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                        ? "border-indigo-900 bg-white dark:bg-slate-800 shadow-md"
                        : "border-transparent bg-white dark:bg-slate-800 hover:border-slate-200 shadow-sm"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        {formatOrderId(order.orderNumber)}
                      </p>
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-none ${STATUS_COLORS[order.status] || "bg-slate-500 text-white"}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}
                    </p>
                    <p className="text-lg font-extrabold text-indigo-900 dark:text-indigo-400 mb-1">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                    {productNames && (
                      <p className="text-xs text-slate-500 truncate">{productNames}</p>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="rounded-xl h-8 px-3 font-bold"
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === page
                      ? "bg-indigo-900 text-white shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50"
                    }`}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="rounded-xl h-8 px-3 font-bold"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Right — Order Details */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Order Details</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold gap-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                </div>
                <p className="text-sm text-slate-400 mb-8">{formatOrderId(selectedOrder.orderNumber)}</p>

                {/* Tracking */}
                <div className="mb-8">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-6">Tracking Status</h3>
                  {selectedOrder.status !== "CANCELLED" ? (
                    <TrackingProgress status={selectedOrder.status} />
                  ) : (
                    <Badge className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-full border-none">
                      Order Cancelled
                    </Badge>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">
                            {item.variant?.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-extrabold text-indigo-900 dark:text-indigo-400 text-sm">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <p className="font-bold text-slate-600 dark:text-slate-300">Total Amount</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    ${Number(selectedOrder.totalAmount).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 dark:border-slate-700 min-h-[400px]"
              >
                <Package className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">Select an order to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
