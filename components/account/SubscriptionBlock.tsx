"use client";

import { Crown, Lock, Check, Zap } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface SubscriptionBlockProps {
  onManageClick: any;
  isPremium: boolean;
  premiumEndsAt?: string | null;
  isLoading?: boolean;
  onUpgrade: () => void;
  onCancel: () => void;
}

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const premiumFeatures = [
  "Scanner des recettes avec l'IA",
  "Profil public personnalisé",
  "Exporter en PDF illimité",
  "Support prioritaire",
];

export default function SubscriptionBlock({
  onManageClick,
  isPremium,
  premiumEndsAt = null,
  isLoading = false,
  onUpgrade,
  onCancel,
}: SubscriptionBlockProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h3 className="text-xl font-black text-neutral-900">Mon Abonnement</h3>
      </div>

      <div className="p-6">
        <div
          className={`p-6 rounded-2xl mb-6 ${isPremium ? "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200" : "bg-neutral-50 border border-neutral-200"}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${isPremium ? "bg-orange-500" : "bg-neutral-200"}`}
              >
                {isPremium ? (
                  <Crown size={24} className="text-white" />
                ) : (
                  <Lock size={24} className="text-neutral-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                  Plan actuel
                </p>
                <p className="text-xl font-black text-neutral-900">
                  {isPremium ? "Premium" : "Gratuit"}
                </p>
                {isPremium && premiumEndsAt && (
                  <p className="text-sm text-orange-600 font-medium mt-1">
                    Renouvellement le {formatDate(premiumEndsAt)}
                  </p>
                )}
              </div>
            </div>
            {isPremium && (
              <Badge variant="premium">
                <Zap size={12} /> Actif
              </Badge>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className="mb-6">
            <h4 className="font-bold text-neutral-800 mb-4">
              Passez à Premium pour débloquer :
            </h4>
            <ul className="space-y-3">
              {premiumFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-neutral-600"
                >
                  <div className="p-1 bg-green-100 rounded-full">
                    <Check size={14} className="text-green-600" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {!isPremium ? (
            <Button
              onClick={onManageClick}
              disabled={isLoading}
              className="flex-1"
            >
              <Crown size={18} /> Passer à Premium
            </Button>
          ) : (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Gérer l&apos;abonnement
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
