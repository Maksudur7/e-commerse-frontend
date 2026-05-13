import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, Activity, Zap, ShoppingCart, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsTab({ stats }: { stats: any }) {
  return (
    <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Advanced Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => window.alert('Export logic coming soon to this tab!')}>Export Report</Button>
          <Button className="rounded-xl font-bold">Refresh Data</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Growth Trajectory
            </CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={1}>
              <LineChart data={stats?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#170C79" strokeWidth={4} dot={{ r: 6, fill: "#170C79" }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" /> Order Velocity
            </CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={1}>
              <AreaChart data={stats?.salesData || []}>
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Area type="step" dataKey="orders" stroke="#22C55E" fill="#22C55E33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Category Distribution
            </CardTitle>
          </CardHeader>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={1}>
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
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <div className="p-8 text-center text-muted-foreground">No product data available</div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
