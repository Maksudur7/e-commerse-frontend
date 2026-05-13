"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, BrainCircuit } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OverviewTab({ stats, onRunAnalysis }: { stats: any; onRunAnalysis?: () => void }) {
  const handleExportReport = () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ShopEase Admin Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 40px; }
            .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { color: #170c79; margin: 0; font-size: 32px; font-weight: 800; }
            .header p { color: #64748b; margin-top: 10px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .card { padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .card:nth-child(1) { background-color: #eff6ff; border-color: #bfdbfe; }
            .card:nth-child(2) { background-color: #f0fdf4; border-color: #bbf7d0; }
            .card:nth-child(3) { background-color: #fffbeb; border-color: #fde68a; }
            .card:nth-child(4) { background-color: #fef2f2; border-color: #fecaca; }
            .label { font-size: 14px; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .value { font-size: 32px; font-weight: bold; margin: 0; color: #0f172a; }
            .section-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .insight-box { background: #1e293b; color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; }
            .insight-box h4 { color: #56B6C6; margin-top: 0; margin-bottom: 10px; font-size: 18px; }
            .insight-box p { margin: 0; line-height: 1.6; color: #cbd5e1; }
            .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 ShopEase Executive Report</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="grid">
              <div class="card">
                <div class="label">Total Revenue</div>
                <div class="value">$${(stats?.totalRevenue || 0).toLocaleString()}</div>
              </div>
              <div class="card">
                <div class="label">Total Orders</div>
                <div class="value">${stats?.totalOrders || "0"}</div>
              </div>
              <div class="card">
                <div class="label">Active Customers</div>
                <div class="value">${stats?.activeCustomers || "0"}</div>
              </div>
              <div class="card">
                <div class="label">Total Products</div>
                <div class="value">${stats?.totalProducts || "0"}</div>
              </div>
            </div>

            <h2 class="section-title">🤖 AI Market Insights</h2>
            <div class="insight-box">
              <h4>📈 Trend Prediction</h4>
              <p>${stats?.aiInsights?.prediction || "No prediction available."}</p>
            </div>
            <div class="insight-box" style="background: ${(stats?.aiInsights?.stockRisk || 0) > 0 ? '#450a0a' : '#022c22'};">
              <h4>${(stats?.aiInsights?.stockRisk || 0) > 0 ? "⚠️ Stock Alert" : "✅ Recommendation"}</h4>
              <p>${stats?.aiInsights?.recommendation || "No recommendation available."}</p>
            </div>
            
            <div class="footer">
              Confidential ShopEase Administrator Report &copy; ${new Date().getFullYear()}
            </div>
          </div>
        </body>
        </html>
      `;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Add a script to trigger print dialog after styles load
        const script = newWindow.document.createElement('script');
        script.innerHTML = "window.onload = function() { setTimeout(function() { window.print(); }, 500); }";
        newWindow.document.body.appendChild(script);
      } else {
        alert("Please allow pop-ups to view and download the report.");
      }
    } catch (err: any) {
      console.error("Export failed:", err);
      alert("Failed to export report: " + err.message);
    }
  };

  return (
    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Dashboard Overview</h1>
        <Button onClick={handleExportReport} className="gap-2 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105">
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
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={1}>
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
