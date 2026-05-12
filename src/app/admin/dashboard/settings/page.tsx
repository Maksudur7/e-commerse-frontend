"use client";

import { Globe, Lock, Shield, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">System Settings</h1>
      
      <div className="grid gap-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> General Configuration
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold">Store Name</label>
              <Input defaultValue="ShopEase AI" className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Admin Email</label>
              <Input defaultValue="admin@shopease.ai" className="rounded-xl h-12 bg-slate-50 border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Currency</label>
              <select className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 text-sm font-medium outline-none">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>BDT (৳)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Maintenance Mode</label>
              <div className="flex items-center h-12 gap-4">
                 <Button variant="outline" className="rounded-xl px-6 bg-red-50 text-red-600 border-red-100 hover:bg-red-100">Disable Site</Button>
                 <span className="text-xs text-muted-foreground font-medium">Currently: Public</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Security & API
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to admin accounts.</p>
              </div>
              <Badge className="bg-green-500 text-white">ENABLED</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Gemini AI API Key</label>
              <div className="flex gap-2">
                <Input value="***************************" type="password" disabled className="rounded-xl h-12 bg-slate-100 border-none flex-1" />
                <Button variant="outline" className="rounded-xl h-12 px-6">Update</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
