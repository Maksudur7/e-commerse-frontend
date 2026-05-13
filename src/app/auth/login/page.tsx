"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, LogIn, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useNotification } from "@/hooks/useNotification";

export default function LoginPage() {
  const { error: notifyError } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setEmail("admin@shopease.ai");
    setPassword("password123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    } catch (error: any) {
      await notifyError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/10 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="pt-10 pb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">S</div>
              <span className="text-2xl font-heading font-extrabold text-[#170C79] dark:text-white">ShopEase</span>
            </Link>
            <CardTitle className="text-3xl font-heading font-black mb-2">Welcome Back</CardTitle>
            <CardDescription className="font-medium">Experience the next generation of e-commerce</CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 ml-1 text-muted-foreground">Email Address</p>
                  <Input 
                    type="email" 
                    required
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</p>
                    <Link href="/auth/forgot-password" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <Input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-medium focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-lg font-black gap-2 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
              >
                {isLoading ? "Signing In..." : "Sign In"} <LogIn className="w-5 h-5" />
              </Button>
            </form>

            <Button 
              variant="outline" 
              onClick={handleDemoLogin}
              className="w-full h-12 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary font-black gap-2 hover:bg-primary/10 transition-all group"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> Try Demo Login
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white dark:bg-slate-900 px-4 text-muted-foreground">Social Connect</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary font-black hover:underline">
                Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
