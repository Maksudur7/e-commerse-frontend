"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const json = await apiFetch("/blogs");
        if (json.success) setBlogs(json.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <div className="pt-40 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-heading font-black text-[#170C79] dark:text-white mb-6">
                ShopEase <span className="text-[#56B6C6]">Journal</span>
              </h1>
              <p className="text-xl text-[#170C79]/60 dark:text-slate-400 font-medium">
                Insights, stories, and the philosophy behind our curated artisanal world.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
              ))
            ) : blogs.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group h-full flex flex-col bg-white dark:bg-slate-900">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <Badge className="w-fit bg-[#56B6C6]/10 text-[#56B6C6] border-none mb-4 font-black uppercase tracking-widest text-[9px]">
                        {post.category}
                      </Badge>
                      <h2 className="text-2xl font-heading font-black text-[#170C79] dark:text-white mb-4 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm font-medium mb-6 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> {post.author}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                          <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black gap-2 border-2 border-primary/10 text-primary">
              View Older Posts <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
