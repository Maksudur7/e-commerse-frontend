"use client";

import { useState, useEffect } from "react";
import { User, Edit, Shield, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await apiFetch("/users/profile", {
          method: "PUT",
          body: JSON.stringify({ avatar: base64String })
        });
        if (res.success) {
          const updatedUser = { ...user, avatar: base64String };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-heading font-extrabold text-foreground mb-8">Admin Profile</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900 h-fit">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || "A"
                )}
              </div>
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <button 
                onClick={() => document.getElementById("avatar-upload")?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-2xl text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{user?.email}</p>
            <Badge className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">{user?.role}</Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b border-border/50">
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">Display Name</p>
                <Input defaultValue={user?.name} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">Email Address</p>
                <Input defaultValue={user?.email} type="email" disabled className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium opacity-70" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">Role</p>
                <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none flex items-center px-4 font-bold text-sm text-primary">
                  <Shield className="w-4 h-4 mr-2" /> {user?.role}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">Discard</Button>
              <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
