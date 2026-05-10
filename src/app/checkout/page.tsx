"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard, ShieldCheck, Truck, CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const subtotal = total();
  const shipping = items.length > 0 ? 15.0 : 0;
  const grandTotal = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate API Call for Checkout
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setOrderId(`ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden text-center py-12">
              <CardContent className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-heading font-extrabold mb-2 text-foreground">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">Thank you for your purchase. We've received your order and are getting it ready.</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl w-full mb-8">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Order Tracking ID</p>
                  <p className="text-xl font-mono font-bold tracking-wider">{orderId}</p>
                </div>
                <Link href="/admin/dashboard" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold">
                    View Orders in Dashboard
                  </Button>
                </Link>
                <Link href="/" className="w-full mt-4">
                  <Button variant="ghost" className="w-full h-12 rounded-xl font-bold">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-4xl font-heading font-extrabold mb-12 text-foreground">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Truck className="w-5 h-5 text-primary" /> Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-bold mb-1.5 text-foreground">Full Name</p>
                  <Input {...register("fullName")} placeholder="John Doe" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.fullName && <p className="text-xs text-destructive mt-1.5">{errors.fullName.message}</p>}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5 text-foreground">Email</p>
                  <Input {...register("email")} type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email.message}</p>}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5 text-foreground">Phone</p>
                  <Input {...register("phone")} placeholder="+1 234 567 890" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.phone && <p className="text-xs text-destructive mt-1.5">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-bold mb-1.5 text-foreground">Street Address</p>
                  <Input {...register("address")} placeholder="123 Fashion Ave" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.address && <p className="text-xs text-destructive mt-1.5">{errors.address.message}</p>}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5 text-foreground">City</p>
                  <Input {...register("city")} placeholder="New York" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.city && <p className="text-xs text-destructive mt-1.5">{errors.city.message}</p>}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5 text-foreground">Postal Code</p>
                  <Input {...register("postalCode")} placeholder="10001" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
                  {errors.postalCode && <p className="text-xs text-destructive mt-1.5">{errors.postalCode.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`h-24 flex-col gap-2 rounded-2xl border-2 transition-all ${
                      paymentMethod === "ONLINE" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-bold">Card / Online Gateway</span>
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setPaymentMethod("COD")}
                    className={`h-24 flex-col gap-2 rounded-2xl border-2 transition-all ${
                      paymentMethod === "COD" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                    <span className="font-bold">Cash on Delivery</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="border-none shadow-xl rounded-3xl sticky top-32 overflow-hidden">
              <CardHeader className="bg-primary text-white p-6">
                <CardTitle className="text-xl font-heading">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 bg-card">
                <div className="max-h-60 overflow-auto space-y-4 pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl border border-border/50 bg-slate-50 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-sm line-clamp-1 text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.color && <span className="mr-2">Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs font-bold text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground font-medium">Your cart is empty</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t border-border pt-6">
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>Shipping Fee</span>
                    <span className="text-foreground">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-border mt-2">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg font-bold gap-2 shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all" 
                  disabled={items.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Complete Purchase <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium mt-4">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure 256-bit encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
}
