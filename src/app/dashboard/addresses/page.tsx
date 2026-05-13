"use client";

import { useState } from "react";
import { MapPin, Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import dynamic from "next/dynamic";
import { useNotification } from "@/hooks/useNotification";

type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
};

type UserWithAddresses = {
  address?: Address[];
  [key: string]: unknown;
};
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const LocationPicker = dynamic(() => import("@/components/dashboard/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-62.5 w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground font-medium">Loading Map...</div>
});

export default function AddressesPage() {
  const { success: notifySuccess, error: notifyError, confirm } = useNotification();
  const [user, setUser] = useState<UserWithAddresses | null>(() => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user");
    return userData ? (JSON.parse(userData) as UserWithAddresses) : null;
  });
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    zipCode: "",
    country: "Bangladesh"
  });

  const handleAddAddress = async () => {
    try {
      const res = await apiFetch("/users/addresses", {
        method: "POST",
        body: JSON.stringify(newAddress)
      });

      if (res.success) {
        const updatedUser = { ...user, address: res.addresses };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsAddAddressOpen(false);
        setNewAddress({
          label: "Home",
          street: "",
          city: "",
          zipCode: "",
          country: "Bangladesh"
        });
        await notifySuccess("Address added successfully!");
      }
    } catch (error: unknown) {
      console.error("Add address error:", error);
      const message = error instanceof Error ? error.message : String(error);
      await notifyError("Failed to add address: " + (message || "Unknown error"));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = await confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;
    try {
      const res = await apiFetch(`/users/addresses/${id}`, {
        method: "DELETE"
      });

      if (res.success) {
        const updatedUser = { ...user, address: res.addresses };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        await notifySuccess("Address deleted successfully!");
      }
    } catch (error: unknown) {
      console.error("Delete address error:", error);
      const message = error instanceof Error ? error.message : String(error);
      await notifyError("Failed to delete address: " + (message || "Unknown error"));
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-foreground">Shipping Addresses</h1>
        <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-130 max-h-[90vh] w-full rounded-4xl p-0 overflow-hidden border-none shadow-2xl">
            <div className="flex flex-col max-h-[85vh] overflow-hidden">
              <DialogHeader className="p-8 bg-primary text-white">
                <DialogTitle className="text-2xl font-black flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Add Shipping Address
                </DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Address Label</label>
                  <Input
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="e.g. Home, Work"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Country</label>
                  <Input
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    placeholder="Bangladesh"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Street Address</label>
                <Input
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  placeholder="123 Fashion Street"
                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">City</label>
                  <Input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Dhaka"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Zip Code</label>
                  <Input
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    placeholder="1212"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Pick Location on Map</label>
                <LocationPicker onLocationSelect={(data) => {
                  setNewAddress({
                    ...newAddress,
                    street: data.address,
                    city: data.city,
                    zipCode: data.zip
                  });
                }} />
              </div>
            </div>
            <DialogFooter className="p-8 pt-0">
              <Button onClick={handleAddAddress} className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                Save Address
              </Button>
            </DialogFooter>
          </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {user?.address?.length ?? 0 > 0 ? (
          user.address?.map((addr: Address, index: number) => (
            <Card key={index} className="border-none shadow-lg rounded-3xl bg-white dark:bg-slate-900 p-6 relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    onClick={() => {
                      setNewAddress(addr);
                      setIsAddAddressOpen(true);
                    }}
                    variant="ghost" size="icon" className="h-8 w-8 rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h4 className="font-bold mb-1">{addr.label || 'Default Address'}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {addr.street}<br />
                {addr.city}, {addr.state || ''} {addr.zipCode}<br />
                {addr.country}
              </p>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-none shadow-xl rounded-3xl p-20 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-8">Save your shipping addresses to speed up the checkout process.</p>
            <Button onClick={() => setIsAddAddressOpen(true)} variant="outline" className="rounded-2xl font-bold px-10 h-14">
              Add First Address
            </Button>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
