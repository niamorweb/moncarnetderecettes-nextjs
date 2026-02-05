"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import {
  Crown,
  Check,
  Zap,
  ScanText,
  ShieldCheck,
  Loader2,
  Star,
  X,
  CreditCard,
  ForkKnife,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const formatDate = (dateString: string | Date) =>
  new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const PLANS = [
  {
    id: "free",
    name: "Découverte",
    price: "Gratuit",
    period: "Pour toujours",
    description: "L'essentiel pour organiser votre quotidien culinaire.",
    features: [
      "Jusqu'à 42 recettes",
      "Profil public personnalisé",
      "Export PDF basique",
      "Catégories illimitées",
    ],
  },
  {
    id: "premium",
    name: "Chef Étoilé",
    price: "4,99 €",
    period: "par mois",
    description: "L'expérience ultime. Pour les passionnés sans limites.",
    features: [
      "Recettes illimitées",
      "Scanner IA (OCR)",
      "Support prioritaire 7j/7",
      "Badge certifié",
    ],
    highlight: true,
  },
];

export default function SubscriptionPage() {
  const { accessToken, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelEndsAt, setCancelEndsAt] = useState<string | null>(null);

  const isPremium = user?.isPremium ?? false;
  const premiumEndsAt = user?.premiumEndsAt ?? null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/webhooks/create-checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      console.error("Erreur checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`${API_BASE}/webhooks/cancel-subscription`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCancelSuccess(true);
        if (data.endsAt) setCancelEndsAt(data.endsAt);
      }
    } catch {
      console.error("Erreur annulation");
    } finally {
      setCancelLoading(false);
    }
  };

  const FeatureIcon = ({ feature }: { feature: string }) => {
    if (feature.includes("illimité"))
      return <Zap size={14} className="text-orange-600" />;
    if (feature.includes("Scan"))
      return <ScanText size={14} className="text-orange-600" />;
    return <Check size={14} className="text-[#222222]" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#222222] mb-2 flex items-center gap-3">
          Abonnement
          {isPremium && (
            <span className="px-2 py-1 rounded-md bg-[#222222] text-white text-xs font-bold uppercase tracking-wide">
              Actif
            </span>
          )}
        </h1>
        <p className="text-[#717171] text-lg">
          Gérez votre plan et libérez tout le potentiel de votre cuisine.
        </p>
      </div>

      {/* CURRENT STATUS CARD (Only if Premium or Cancelled) */}
      <AnimatePresence>
        {(isPremium || cancelSuccess) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <div className="bg-[#F7F7F7] rounded-2xl p-6 border border-[#DDDDDD] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-white border border-[#DDDDDD] flex items-center justify-center shadow-sm">
                  <Crown className="size-6 text-orange-600 fill-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#222222] text-lg">
                    Membre Premium
                  </h3>
                  <p className="text-[#717171] text-sm">
                    {cancelSuccess || cancelEndsAt
                      ? `Votre accès se terminera le ${formatDate(cancelEndsAt || premiumEndsAt!)}.`
                      : "Renouvellement automatique actif."}
                  </p>
                </div>
              </div>

              {!cancelSuccess && !cancelEndsAt && (
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="text-sm font-semibold underline text-[#717171] hover:text-red-600 transition-colors"
                >
                  {cancelLoading ? "Traitement..." : "Annuler l'abonnement"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PLANS GRID */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {PLANS.map((plan) => {
          const isCurrent =
            (plan.id === "premium" && isPremium) ||
            (plan.id === "free" && !isPremium);
          const isPro = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={clsx(
                "relative p-8 rounded-[2rem] border bg-white transition-all duration-300 flex flex-col h-full",
                // Airbnb Style: Active gets black border, Pro gets Shadow
                isPro && isCurrent
                  ? "border-black ring-1 ring-black shadow-sm"
                  : isPro
                    ? "border-[#DDDDDD] shadow-xl shadow-neutral-200/50"
                    : "border-[#DDDDDD]",
              )}
            >
              {/* Badge "Guest Favorite" Style */}
              {isPro && !isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-[#DDDDDD] px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Star size={12} fill="#222" className="text-[#222]" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#222]">
                    Recommandé
                  </span>
                </div>
              )}

              {/* Badge "Actuel" */}
              {isCurrent && (
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 rounded-md bg-[#F7F7F7] text-[#717171] text-xs font-bold uppercase tracking-wide">
                    Plan actuel
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#222222] mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#717171] min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1 pb-8 border-b border-[#F7F7F7]">
                <span className="text-4xl font-black text-[#222222] tracking-tight">
                  {plan.price}
                </span>
                <span className="text-[#717171] font-medium">
                  {plan.id !== "free" && plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#484848]"
                  >
                    <div className="mt-0.5">
                      <FeatureIcon feature={feature} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* ACTION BUTTON */}
              {isPro && !isPremium ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-br from-[#222222] to-black text-white font-bold text-base shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Mettre à niveau"
                  )}
                </motion.button>
              ) : isCurrent ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl bg-[#F7F7F7] text-[#717171] font-bold text-base cursor-default"
                >
                  Activé
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] font-bold text-base hover:bg-[#F7F7F7] transition-colors"
                >
                  Rétrograder
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-16 pt-8 border-t border-[#DDDDDD] flex flex-col md:flex-row justify-center items-center gap-6 text-[#717171] opacity-80">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
          <ShieldCheck size={16} /> Paiement Sécurisé
        </div>
        <div className="hidden md:block w-1 h-1 rounded-full bg-[#DDDDDD]" />
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
          <CreditCard size={16} /> Stripe
        </div>
      </div>
    </motion.div>
  );
}
