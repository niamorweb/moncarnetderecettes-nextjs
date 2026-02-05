"use client";

import { Crown, Zap, Check, Settings } from "lucide-react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface ProfileCardProps {
  // Tout est optionnel (?) pour éviter les crashs pendant le chargement
  user?: {
    name?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  };
  subscription?: {
    isPremium?: boolean;
    endsAt?: string | null;
    isLoading?: boolean;
  };
  actions?: {
    onUpgrade: () => void;
    onManage: () => void;
  };
}

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const premiumFeatures = ["Scanner IA", "Profil public", "PDF illimités"];

export default function ProfileCard({
  user,
  subscription,
  actions,
}: ProfileCardProps) {
  // 1. SÉCURITÉ USER
  const displayName = user?.name || user?.username || "Utilisateur";

  // 2. SÉCURITÉ SUBSCRIPTION
  // On extrait avec des valeurs par défaut au cas où subscription est undefined
  const {
    isPremium = false,
    endsAt = null,
    isLoading = false,
  } = subscription || {};

  // 3. SÉCURITÉ ACTIONS (La cause de ton erreur actuelle)
  // Si actions est undefined, on utilise un objet vide, et on fournit des fonctions vides par défaut
  const { onUpgrade = () => {}, onManage = () => {} } = actions || {};

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
      {/* SECTION 1: IDENTITÉ */}
      <div className="flex flex-col items-center p-6 pb-4 text-center">
        <div className="relative mb-4">
          <Avatar src={user?.avatarUrl} name={displayName} size="xl" />
          {isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
              <Crown size={12} fill="currentColor" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-black text-neutral-900 leading-tight">
          {displayName}
        </h2>
        <p className="text-sm text-neutral-500 font-medium mt-1">
          @{user?.username || "anonyme"}
        </p>
      </div>

      {/* SECTION 2: STATUT & ABONNEMENT */}
      <div className="px-6 pb-6 w-full flex-1 flex flex-col justify-end">
        {isPremium ? (
          // UI PREMIUM
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 mt-2">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Crown
                  size={18}
                  className="text-orange-600"
                  fill="currentColor"
                />
                <span className="font-black text-orange-900 text-sm">
                  Premium Actif
                </span>
              </div>
              <Badge variant="premium" size="sm">
                <Zap size={10} className="mr-1" /> Pro
              </Badge>
            </div>

            {endsAt && (
              <p className="text-xs text-orange-700/80 font-medium mb-4">
                Renouvellement le {formatDate(endsAt)}
              </p>
            )}

            <Button
              variant="outline"
              onClick={onManage}
              disabled={isLoading}
              className="w-full bg-white border-orange-200 hover:bg-orange-50 text-orange-900"
              size="sm"
            >
              <Settings size={14} className="mr-2" />
              Gérer l'abonnement
            </Button>
          </div>
        ) : (
          // UI GRATUITE
          <div className="mt-2 space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Plan actuel
                </span>
                <Badge variant="default" size="sm">
                  Gratuit
                </Badge>
              </div>

              <ul className="space-y-2 mb-1">
                {premiumFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-neutral-600 font-medium"
                  >
                    <Check size={14} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={onUpgrade}
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-500/10"
            >
              <Crown size={16} className="mr-2 text-orange-300" />
              Passer Premium
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
