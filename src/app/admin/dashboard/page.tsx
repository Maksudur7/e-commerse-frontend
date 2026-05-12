"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Package, 
  ShoppingCart,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch("/admin/stats");
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading overview...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Dashboard Overview</h1>
        <Button className="gap-2 rounded-xl font-bold">
          <TrendingUp className="w-4 h-4" /> Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString()}`, change: "+20.1%", positive: true, path: "/admin/dashboard/analytics" },
          { label: "Total Orders", value: stats?.totalOrders?.toString(), change: "+12.5%", positive: true, path: "/admin/dashboard/orders" },
          { label: "Active Customers", value: stats?.activeCustomers?.toString(), change: "-2.4%", positive: false, path: "/admin/dashboard/customers" },
          { label: "Total Products", value: stats?.totalProducts?.toString(), change: "+4.1%", positive: true, path: "/admin/dashboard/products" },
        ].map((stat) => (
          <Card 
            key={stat.label} 
            className="border-none shadow-sm rounded-3xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all active:scale-95"
            onClick={() => router.push(stat.path)}
          >
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
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#170C79" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#170C79" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#170C79" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
