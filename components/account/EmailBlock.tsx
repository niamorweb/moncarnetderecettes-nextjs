"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/useToast";
import Button from "../ui/Button";
import Input from "../ui/Input";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function EmailBlock() {
  const { accessToken, user } = useAuthStore();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("L'email est requis");
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
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { data: err };
      }
      toast.success("Email mis à jour !");
      setEmail("");
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
          <Mail className="size-5 text-neutral-600" />
        </div>
        Email
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest text-[10px]">
            E-mail de connexion
          </label>

          <div className="w-full flex flex-col gap-2">
            <label className="text-sm text-neutral-800">
              Adresse email actuelle
            </label>
            <div className="cursor-not-allowed border border-neutral-200 flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl text-sm text-neutral-500 font-medium">
              <Mail className="size-4" />
              {user?.email}
            </div>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <label className="text-sm font-bold text-neutral-700 uppercase tracking-widest text-[10px]">
            Changer d'email
          </label>
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <label className="text-sm text-neutral-800">
                Nouvelle adresse email
              </label>
              <Input
                value={email}
                onChange={setEmail}
                autoComplete="new-email"
                type="email"
                placeholder="Entrez votre nouvelle adresse email"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              disabled={loading || !email}
              variant="primary"
            >
              Changer l'email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
