"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MapPin, Mail, Phone, Users, Globe, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-40 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 text-foreground">
            Redefining Your <br/> <span className="text-primary">Shopping Experience</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            At ShopEase, we believe that buying online shouldn't just be convenient—it should be an experience tailored to you. We blend advanced technology with premium curation to bring you exactly what you need.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="h-14 px-8 rounded-full text-lg shadow-lg font-bold">Contact Us</Button>
            <Button variant="outline" className="h-14 px-8 rounded-full text-lg font-bold border-2">Meet the Team</Button>
          </div>
        </div>
      </div>

      {/* Stats/Values */}
      <div className="container mx-auto px-4 py-20 border-y border-border/50 my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">50+</h3>
            <p className="text-muted-foreground font-medium">Countries Served</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">2M+</h3>
            <p className="text-muted-foreground font-medium">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">99%</h3>
            <p className="text-muted-foreground font-medium">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="Our Team" 
              className="rounded-[3rem] shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-heading font-extrabold text-foreground">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Founded in 2024, ShopEase started with a simple idea: what if your favorite store actually knew your style? We started as a small team of engineers and designers who were frustrated with endless scrolling and generic recommendations.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Today, we use advanced technology to personalize your shopping journey, ensuring that every product you see is something you'll love. But despite the technology, our core remains human—we prioritize quality, ethical sourcing, and customer satisfaction above all else.
            </p>
            <div className="pt-6 grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <MapPin className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Global HQ</h4>
                  <p className="text-sm text-muted-foreground">123 Innovation Drive, Tech District, CA 94043</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Support</h4>
                  <p className="text-sm text-muted-foreground">support@shopease.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
