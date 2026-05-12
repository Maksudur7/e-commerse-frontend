"use client";

import { CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">Account Settings</h1>

      <div className="space-y-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b border-border/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password regularly.</p>
              </div>
              <Button variant="outline" className="rounded-xl font-bold">Update</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div>
                <p className="font-bold text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b border-border/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-muted-foreground mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive" className="rounded-2xl font-bold px-8 h-12">
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
