"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Tabs from "@/components/ui/Tabs";
import AccountHeader from "@/components/account/AccountHeader";
import ProfileBlock from "@/components/account/ProfileBlock";
import SecurityBlock from "@/components/account/SecurityBlock";
import OrdersBlock from "@/components/account/OrdersBlock";
import SubscriptionBlock from "@/components/account/SubscriptionBlock";
import OffersModal from "@/components/account/OffersModal";
import { LogOut, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import EmailBlock from "@/components/account/EmailBlock";

export default function AccountPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/profiles/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, accessToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Paramètres
        </h1>
        <Button
          variant="destructive"
          onClick={async () => {
            try {
              await fetch(`${API_BASE}/auth/logout`, {
                method: "POST",
                credentials: "include",
              });
            } catch {}
            logout();
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Me déconnecter
        </Button>
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="flex flex-col col-span-3 gap-4 max-w-4xl">
          <EmailBlock />
          <SecurityBlock />
        </div>

        <div className="flex flex-col col-span-2 gap-4 max-w-4xl">
          <OrdersBlock />
        </div>
      </div>
    </div>
  );
}
