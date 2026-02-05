"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Camera,
  User,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/useToast";
import Button from "../ui/Button";
import Input from "../ui/Input";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

interface ProfileBlockProps {
  isPremium: boolean;
}

export default function ProfileBlock({ isPremium }: ProfileBlockProps) {
  const { accessToken, user, setAuth } = useAuthStore();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [publicName, setPublicName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [dbAvatarUrl, setDbAvatarUrl] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });
        const data = await res.json();
        if (data) {
          setUsername(user?.username || "");
          setPublicName(data.profile?.name || "");
          setDbAvatarUrl(data.profile?.avatar_url || "");
          setBio(data.profile?.bio || "");
          setIsPublic(data.profile?.isPublic || false);
        }
      } catch (err) {
        console.error("Erreur lors du fetch profil:", err);
      }
    };
    loadProfile();
  }, [accessToken, user?.username]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("public_name", publicName);
      formData.append("isPublic", String(isPublic));

      if (avatar) formData.append("avatar", avatar);

      await fetch(`${API_BASE}/profiles/me`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
        credentials: "include",
      });

      toast.success("Profil mis à jour !");
      if (user) {
        setAuth(accessToken!, { ...user, username: username.trim() });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureUrl(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[1rem] outline outline-neutral-100">
      <h2 className="text-xl font-black pb-4 mb-8 text-neutral-900 flex items-center gap-3 border-b border-neutral-100">
        <div className="p-2 bg-orange-100 rounded-lg">
          <ExternalLink className="size-5 text-orange-600" />
        </div>
        Informations Publiques
      </h2>

      <form onSubmit={handleProfileUpdate} className="space-y-8">
        <div className="flex flex-col md:grid gap-6">
          {/* Photo de profil */}
          <div className="flex flex-col items-center gap-4 mb-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="size-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-neutral-100 flex items-center justify-center">
                {profilePictureUrl || dbAvatarUrl ? (
                  <img
                    src={profilePictureUrl || dbAvatarUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <User className="size-10 z-30 relative text-neutral-400" />
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Cliquez pour modifier la photo
            </p>
          </div>

          {/* Champs texte */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-700">
              Nom d&apos;affichage
            </label>
            <Input
              value={publicName}
              onChange={setPublicName}
              placeholder="Nom d'affichage public"
              autoComplete="name"
              type="text"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-700">Bio</label>
            <Input
              value={bio}
              onChange={setBio}
              placeholder="Une petite bio"
              isTextArea
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-700">
              Nom d&apos;utilisateur (identifiant URL)
            </label>
            <Input
              value={username}
              onChange={setUsername}
              placeholder="Nom d'utilisateur"
              autoComplete="username"
              type="text"
            />
          </div>

          {/* --- NOUVEAU BLOC : VISIBILITÉ --- */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between mt-2">
            <div className="space-y-1">
              <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                Visibilité du profil
              </label>
              <p
                className={`text-xs font-medium transition-colors ${
                  isPublic ? "text-green-600" : "text-neutral-500"
                }`}
              >
                {isPublic
                  ? "Votre profil est accessible publiquement."
                  : "Votre profil est privé (seul vous le voyez)."}
              </p>
            </div>

            {/* Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>

        {/* Bloc Lien Public */}
        {/* <div className="relative group mt-4">
          <div
            className={`group relative p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between gap-4 overflow-hidden transition-colors hover:border-orange-200`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium mb-2 text-neutral-700">
                Votre lien public :
              </p>
              <p className={`text-sm font-medium truncate text-orange-600`}>
                https://moncarnetderecettes.vercel.app/u/
                {user?.username || "..."}
              </p>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className={`shrink-0 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white text-neutral-600 shadow-sm border border-neutral-200 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-xs font-black uppercase tracking-tight hidden sm:block">
                {copied ? "Copié !" : "Copier"}
              </span>
            </button>
          </div>
        </div> */}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} variant="primary">
            {loading && <Loader2 className="animate-spin" size={18} />}
            Mettre à jour le profil
          </Button>
        </div>
      </form>
    </div>
  );
}
