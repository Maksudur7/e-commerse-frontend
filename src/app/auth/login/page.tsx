"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/10 blur-3xl rounded-full" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="pt-10 pb-8 text-center bg-white dark:bg-slate-900">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-2xl font-heading font-bold">ShopEase</span>
          </Link>
          <CardTitle className="text-3xl font-heading font-extrabold mb-2">Welcome Back</CardTitle>
          <CardDescription>Experience the next generation of e-commerce</CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1.5 ml-1">Email Address</p>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5 ml-1">Password</p>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
              />
            </div>
          </div>

          <Button className="w-full h-12 rounded-xl text-lg font-bold gap-2">
            Sign In <ArrowRight className="w-5 h-5" />
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2">
              <LinkIcon className="w-5 h-5" /> External
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
