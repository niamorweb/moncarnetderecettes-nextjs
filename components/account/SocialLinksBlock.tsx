"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Loader2,
  Share2,
  MapPin,
} from "lucide-react";
import {
  IconInstagram,
  IconTikTok,
  IconYouTube,
  IconPinterest,
  IconThreads,
  IconFacebook,
  IconX,
  IconTwitch,
} from "@/components/icons/SocialIcons";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function SocialLinksBlock() {
  const { accessToken } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [links, setLinks] = useState({
    location: "",
    website: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    pinterest: "",
    threads: "",
    facebook: "",
    twitter: "",
    twitch: "",
  });

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (data && data.profile) {
          setLinks({
            location: data.profile.location || "",
            website: data.profile.website || "",
            instagram: data.profile.instagram || "",
            youtube: data.profile.youtube || "",
            tiktok: data.profile.tiktok || "",
            pinterest: data.profile.pinterest || "",
            threads: data.profile.threads || "",
            facebook: data.profile.facebook || "",
            twitter: data.profile.twitter || "",
            twitch: data.profile.twitch || "",
          });
        }
      } catch (err) {
        console.error("Erreur chargement profil social:", err);
      }
    };
    loadLinks();
  }, [accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profiles/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(links),
      });
      if (!res.ok) throw new Error();
      toast.success("Informations mises à jour !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[1rem] outline outline-neutral-100 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Share2 className="size-5 text-orange-600" />
          </div>
          Présence & Localisation
        </h2>
        <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full uppercase tracking-tighter">
          Infos Publiques
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Section: Localisation - Pleine largeur */}
          <div className="md:col-span-2 space-y-1.5 mb-2">
            <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1">
              Localisation
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 group-focus-within:scale-110 transition-transform">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                name="location"
                value={links.location}
                onChange={handleChange}
                placeholder="Ex: Paris, France ou Lyon"
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all text-sm font-semibold placeholder:font-normal"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 mb-1">
            <div className="h-px bg-neutral-100 flex-1"></div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              Liens & Réseaux
            </span>
            <div className="h-px bg-neutral-100 flex-1"></div>
          </div>
          <div className="md:col-span-2">
            <SocialInput
              icon={<Globe className="text-blue-500 size-5" />}
              label="Site Web"
              name="website"
              value={links.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
          <SocialInput
            icon={<IconInstagram className="text-pink-600 size-5" />}
            label="Instagram"
            name="instagram"
            value={links.instagram}
            onChange={handleChange}
            placeholder="@pseudo"
          />
          <SocialInput
            icon={<IconTikTok className="text-zinc-900 size-5" />}
            label="TikTok"
            name="tiktok"
            value={links.tiktok}
            onChange={handleChange}
            placeholder="@pseudo"
          />
          <SocialInput
            icon={<IconYouTube className="text-red-600 size-5" />}
            label="YouTube"
            name="youtube"
            value={links.youtube}
            onChange={handleChange}
            placeholder="Lien chaîne"
          />
          <SocialInput
            icon={<IconPinterest className="text-red-500 size-5" />}
            label="Pinterest"
            name="pinterest"
            value={links.pinterest}
            onChange={handleChange}
            placeholder="Utilisateur"
          />
          <SocialInput
            icon={<IconThreads className="text-zinc-900 size-5" />}
            label="Threads"
            name="threads"
            value={links.threads}
            onChange={handleChange}
            placeholder="@pseudo"
          />
          <SocialInput
            icon={<IconX className="text-zinc-900 size-5" />}
            label="X (Twitter)"
            name="twitter"
            value={links.twitter}
            onChange={handleChange}
            placeholder="@pseudo"
          />
          <SocialInput
            icon={<IconFacebook className="text-blue-600 size-5" />}
            label="Facebook"
            name="facebook"
            value={links.facebook}
            onChange={handleChange}
            placeholder="@pseudo"
          />
          <SocialInput
            icon={<IconTwitch className="text-purple-500 size-5" />}
            label="Twitch"
            name="twitch"
            value={links.twitch}
            onChange={handleChange}
            placeholder="@pseudo"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading && <Loader2 className="animate-spin mr-2" size={18} />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}

function SocialInput({ icon, label, name, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-transform group-focus-within:scale-110">
          {icon}
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all text-sm font-medium placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}
