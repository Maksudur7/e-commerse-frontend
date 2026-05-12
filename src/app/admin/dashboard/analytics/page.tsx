"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch("/admin/stats");
        if (res.success) setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">Business Analytics</h1>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Revenue Growth
            </CardTitle>
          </CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#170C79" fill="#170C7911" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" /> Sales Targets
            </CardTitle>
          </CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#56B6C6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Conversion Rate", value: `${stats?.conversionRate}%`, change: "+2.4%", icon: Zap },
          { label: "Avg Order Value", value: "$124.50", change: "+12.1%", icon: TrendingUp },
          { label: "Customer LTV", value: "$1,240", change: "+5.2%", icon: Target },
          { label: "Bounce Rate", value: "24.2%", change: "-4.1%", icon: TrendingDown },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className={`text-xs font-bold ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
            <h4 className="text-2xl font-bold mt-1">{item.value}</h4>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
