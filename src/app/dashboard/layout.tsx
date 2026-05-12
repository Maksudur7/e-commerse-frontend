"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Edit,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/auth/login");
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

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
          alert("Profile picture updated successfully!");
        }
      } catch (error: any) {
        console.error("Avatar upload error:", error);
        alert("Failed to update profile picture: " + (error.message || "Unknown error"));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { id: "profile", icon: User, label: "My Profile", path: "/dashboard/profile" },
    { id: "orders", icon: ShoppingBag, label: "My Orders", path: "/dashboard/orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist", path: "/dashboard/wishlist" },
    { id: "addresses", icon: MapPin, label: "Shipping Addresses", path: "/dashboard/addresses" },
    { id: "settings", icon: Settings, label: "Account Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-28 pb-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-8 text-center border-b border-border/50">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                    />
                    <button 
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{user?.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path || (pathname === "/dashboard" && item.id === "profile");
                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                          isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                          <span className="font-bold text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? "hidden" : "block"}`} />
                      </button>
                    );
                  })}
                  
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold text-sm">Logout</span>
                    </button>
                  </div>
                </nav>
              </Card>
            </aside>

            {/* Content Area */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
