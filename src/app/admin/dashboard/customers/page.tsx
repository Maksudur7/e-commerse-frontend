"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiFetch("/admin/customers");
        if (res.success) setCustomers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">Customer Management</h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="p-4 font-bold text-sm text-muted-foreground">Customer</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Orders</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Joined</th>
              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className="bg-green-50 text-green-700 border-none font-bold">Active</Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm font-bold">{customer._count?.orders || 0} Orders</span>
                </td>
                <td className="p-4">
                  <span className="text-xs text-muted-foreground font-medium">{new Date(customer.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
