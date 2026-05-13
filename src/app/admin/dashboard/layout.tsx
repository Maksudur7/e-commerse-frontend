"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  BrainCircuit, 
  Settings, 
  Bell, 
  Search, 
  User, 
  LogOut,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await apiFetch("/notifications");
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!userData || !token) {
        router.push("/auth/login");
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "ADMIN") {
        router.push("/dashboard"); 
        return;
      }
      
      setUser(parsedUser);
      setLoading(false);
      fetchNotifications();
    }
    
    checkAuth();
  }, [router, fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const markNotificationRead = async (id: string) => {
    try {
      const res = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      if (res.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await apiFetch("/notifications/read-all", { method: "PUT" });
      if (res.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
    { icon: Package, label: "Products", path: "/admin/dashboard/products" },
    { icon: Layers, label: "Categories", path: "/admin/dashboard/categories" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/dashboard/orders" },
    { icon: Users, label: "Customers", path: "/admin/dashboard/customers" },
    { icon: BarChart3, label: "Analytics", path: "/admin/dashboard/analytics" },
    { icon: BrainCircuit, label: "System Insights", path: "/admin/dashboard/system-insights" },
    { icon: Settings, label: "Settings", path: "/admin/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => router.push("/admin/dashboard")}>
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">S</div>
            <span className="text-xl font-heading font-bold">ShopEase Admin</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.label}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => router.push(item.path)}
                  className={`w-full justify-start gap-3 h-11 ${isActive ? "bg-primary/10 text-primary font-bold" : ""}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => router.push("/admin/dashboard/products")}>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">System Tip</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory for "Leather Sneakers" is low. Reorder soon to avoid loss.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search dashboard..." className="pl-10 bg-slate-100 dark:bg-slate-800 border-none rounded-full h-10" />
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 glass-card border-none shadow-2xl mt-2">
                <div className="flex items-center justify-between p-3 border-b border-border/50">
                  <span className="font-heading font-bold">Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs h-8 text-primary font-bold hover:text-primary hover:bg-primary/5" onClick={markAllNotificationsRead}>
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-auto py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`p-3 rounded-xl cursor-pointer mb-1 flex flex-col items-start gap-1 transition-all ${!notification.isRead ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        onClick={() => {
                          markNotificationRead(notification.id);
                          if (notification.link) router.push(notification.link);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            notification.type === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                            notification.type === 'ALERT' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {notification.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-bold leading-tight">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-primary font-bold py-2.5 rounded-xl cursor-pointer" onClick={() => router.push("/admin/dashboard/analytics")}>
                  View all activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px h-6 bg-border" />

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-full transition-colors cursor-pointer border-none bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "A"
                    )}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">{user?.name || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.role === "ADMIN" ? "System Administrator" : "Staff"}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 glass-card border-none shadow-2xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-heading font-bold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5" onClick={() => router.push("/admin/dashboard/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5" onClick={() => router.push("/admin/dashboard/settings")}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive rounded-xl cursor-pointer py-2.5 focus:bg-destructive/10 focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
