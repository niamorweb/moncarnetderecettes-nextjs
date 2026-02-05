"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/useToast";
import Button from "../ui/Button";
import Input from "../ui/Input";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function SecurityBlock() {
  const { accessToken, user } = useAuthStore();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { data: err };
      }
      toast.success("Mot de passe mis à jour !");
      setNewPassword("");
      setOldPassword("");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erreur lors du changement.";
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[1rem] outline outline-neutral-100">
      <h2 className="text-xl font-black pb-4 mb-8 text-neutral-900 flex items-center gap-3 border-b border-neutral-100">
        <div className="p-2 bg-neutral-100 rounded-lg">
          <Lock className="size-5 text-neutral-600" />
        </div>
        Sécurité & Accès
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest text-[10px]">
            Mot de passe de connexion
          </label>
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm text-neutral-800">
              Mot de passe actuel
            </label>
            <Input
              value={oldPassword}
              onChange={setOldPassword}
              autoComplete="current-password"
              type="password"
              placeholder="Min. 6 caractères"
            />
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest text-[10px]">
            Changer de mot de passe
          </label>
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <label className="text-sm text-neutral-800">
                Nouveau mot de passe
              </label>
              <Input
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
                type="password"
                placeholder="Min. 6 caractères"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              disabled={loading || !oldPassword || newPassword.length < 6}
              variant="primary"
            >
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
