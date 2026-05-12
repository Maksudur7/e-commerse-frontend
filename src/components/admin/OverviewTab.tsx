import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, BrainCircuit } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OverviewTab({ stats, onRunAnalysis }: { stats: any; onRunAnalysis?: () => void }) {
  return (
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
              AI Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm font-bold text-accent mb-1">Trend Prediction</p>
              <p className="text-sm opacity-80 leading-relaxed">
                {stats?.aiInsights?.prediction || "Loading predictions..."}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm font-bold text-accent mb-1">
                {stats?.aiInsights?.stockRisk > 0 ? "⚠️ Stock Alert" : "✅ Recommendation"}
              </p>
              <p className="text-sm opacity-80 leading-relaxed">
                {stats?.aiInsights?.recommendation || "Analyzing inventory..."}
              </p>
            </div>
            {stats?.aiInsights?.stockRisk > 0 && (
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="text-xs font-bold text-red-400">
                  {stats.aiInsights.stockRisk} variant(s) have stock below 5 units
                </p>
              </div>
            )}
            <Button 
              onClick={onRunAnalysis}
              className="w-full bg-accent hover:bg-accent/90 text-slate-900 font-bold h-12 rounded-xl mt-4 shadow-lg shadow-accent/20">
              Run Full Market Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
