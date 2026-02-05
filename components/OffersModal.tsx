"use client";

import {
  Check,
  X,
  Crown,
  Globe,
  Zap,
  Search,
  ScanText,
  type LucideIcon,
} from "lucide-react";
import Button from "./ui/Button";

interface OffersModalProps {
  isOpen: boolean;
  isPremium: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
}

interface Feature {
  text: string;
  active: boolean;
  icon?: LucideIcon;
}

export default function OffersModal({
  isOpen,
  isPremium,
  onClose,
  onUpgrade,
  onCancelSubscription,
}: OffersModalProps) {
  if (!isOpen) return null;

  const plans = [
    {
      name: "Premium",
      price: "4.99",
      description: "Partagez votre passion avec le monde entier.",
      features: [
        { text: "Tout de l'offre gratuite", active: true },
        { text: "Outil IA permettant d'importer des recettes via des scans de photo", active: true, icon: ScanText },
        { text: "Profil Public Personnalisé", active: true, icon: Globe },
        { text: "SEO (Indexation Google)", active: true, icon: Search },
        { text: "Lien court moncarnet.app/u/toi", active: true, icon: Zap },
      ] as Feature[],
      variant: "premium" as const,
      button: isPremium ? "Plan actuel" : "Devenir Premium",
    },
    {
      name: "Gratuit",
      price: "0",
      description: "L'essentiel pour cuisiner sereinement.",
      features: [
        { text: "Recettes illimitées", active: true },
        { text: "Espace personnel sécurisé", active: true },
        { text: "Export Carnet Physique (Payant)", active: true },
      ] as Feature[],
      variant: "ghost" as const,
      button: isPremium ? "Revenir au plan gratuit" : "Plan actuel",
    },
  ];

  return (
    <div className="fixed overflow-hidden inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="fixed inset-0 bg-neutral-900/60 overflow-hidden backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative h-[80vh] overflow-auto bg-neutral-50 rounded-[3rem] shadow-2xl max-w-4xl w-full animate-modal-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-200 text-neutral-400 transition-colors z-20"
        >
          <X className="size-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-8 lg:p-12 bg-white flex flex-col justify-center">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl w-fit mb-6">
              <Crown className="size-8" />
            </div>
            <h3 className="text-3xl font-black text-neutral-900 mb-4 leading-tight">
              Passez au niveau <span className="text-orange-500">supérieur.</span>
            </h3>
            <p className="text-neutral-500 font-medium">
              Débloquez le plein potentiel de votre cuisine et rejoignez notre
              communauté de passionnés.
            </p>
          </div>

          <div className="lg:col-span-8 p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-[2rem] flex flex-col transition-all ${
                  plan.variant === "premium"
                    ? "bg-white shadow-xl ring-2 ring-orange-500"
                    : "bg-neutral-100/50 border border-neutral-200"
                }`}
              >
                {plan.variant === "premium" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Recommandé
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xl font-black text-neutral-900">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black">{plan.price}€</span>
                    {plan.price !== "0" && (
                      <span className="text-neutral-400 text-sm font-bold">/ mois</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => {
                    const FeatureIcon = feature.active
                      ? feature.icon || Check
                      : X;
                    return (
                      <li key={feature.text} className="flex items-start gap-3 text-sm">
                        <FeatureIcon
                          className={`size-5 shrink-0 mt-0.5 ${
                            feature.active ? "text-orange-500" : "text-neutral-300"
                          }`}
                        />
                        <span
                          className={
                            feature.active
                              ? "text-neutral-700 font-bold"
                              : "text-neutral-400 font-medium line-through"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  onClick={() => {
                    if (plan.variant === "premium") {
                      isPremium ? onClose() : onUpgrade();
                    } else {
                      isPremium ? onCancelSubscription() : onClose();
                    }
                  }}
                  variant={
                    plan.variant === "premium"
                      ? isPremium
                        ? "outline"
                        : "primary"
                      : "outline"
                  }
                  className="w-full !rounded-2xl !py-4"
                >
                  {plan.button}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
