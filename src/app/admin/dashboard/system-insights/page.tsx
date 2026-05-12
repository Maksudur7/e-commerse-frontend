"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, Server, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SystemInsightsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) return <div>Loading insights...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">AI System Insights</h1>
        <Badge className="bg-primary text-white font-bold px-4 py-1 rounded-full animate-pulse">AI ACTIVE</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="w-8 h-8 text-purple-300" />
            <h2 className="text-2xl font-bold">Predictive Intelligence</h2>
          </div>
          <p className="text-purple-100 mb-8 max-w-lg">{stats?.aiInsights?.prediction} {stats?.aiInsights?.recommendation}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-1">Stock Risk</p>
              <p className="text-xl font-bold text-amber-300">{stats?.aiInsights?.stockRisk} Items Low</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-1">Market Sentiment</p>
              <p className="text-xl font-bold text-green-300">{stats?.aiInsights?.sentiment}</p>
            </div>
          </div>
          <Button 
            className="w-full bg-white text-indigo-900 hover:bg-purple-100 font-bold rounded-xl h-12 shadow-xl"
            onClick={() => router.push("/admin/dashboard/analytics")}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Run Full Market Analysis
          </Button>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> System Health
            </h3>
            <div className="space-y-4">
              {(stats?.systemStatus || [
                { name: "API Server", status: "Online", color: "bg-green-500" },
                { name: "Database", status: "Connected", color: "bg-green-500" },
                { name: "AI Engine", status: "Active", color: "bg-green-500" },
                { name: "Storage", status: "92% Free", color: "bg-green-500" }
              ]).map((s: any) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{s.status}</span>
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-xl font-bold">View Logs</Button>
        </Card>
      </div>
    </motion.div>
  );
}
