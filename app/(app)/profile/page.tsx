"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import ProfileBlock from "@/components/account/ProfileBlock";
import { Check, Copy, Share, User } from "lucide-react";
import SocialLinksBlock from "@/components/account/SocialLinksBlock";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async () => {
    const url = `https://moncarnetderecettes.vercel.app/u/${user?.username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

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
          <User className="h-6 w-6" />
          Mon profil
        </h1>
        <Button variant="outline" onClick={() => copyToClipboard()}>
          {copied ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copied ? "Url copiée !" : "Copier mon url"}
        </Button>
      </div>
      <div className="flex flex-col xl:grid xl:grid-cols-5 gap-6 ">
        <div className="xl:col-span-3">
          <ProfileBlock isPremium={user?.isPremium ? true : false} />
        </div>

        <div className="xl:col-span-2">
          <SocialLinksBlock />
        </div>
      </div>
    </div>
  );
}
