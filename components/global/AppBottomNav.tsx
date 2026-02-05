"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BookType,
  Plus,
  ScanText,
  User,
  Settings,
  PenTool,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function AppBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // État pour le menu Premium
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isPremium = user?.isPremium || false;
  const isActive = (path: string) => pathname === path;

  // Gestion du clic sur le bouton central
  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation immédiate

    if (isPremium) {
      // Si Premium : on ouvre/ferme le menu
      setIsMenuOpen(!isMenuOpen);
    } else {
      // Si Gratuit : redirection directe
      router.push("/new-recipe");
    }
  };

  const navItems = [
    { to: "/dashboard", icon: BookOpen, label: "Carnet" },
    { to: "/pdf-viewer", icon: BookType, label: "Livre" },
    { to: "ACTION", icon: Plus, label: "Créer", isAction: true }, // Placeholder pour le bouton central
    { to: "/profile", icon: User, label: "Profil" },
    { to: "/settings", icon: Settings, label: "Réglages" }, // Retour des paramètres
  ];

  return (
    <>
      {/* OVERLAY FERMETURE MENU (Si menu ouvert) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MENU PREMIUM POP-UP */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 md:hidden"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-3 py-2">
                Ajouter une recette
              </p>

              {/* Option 1: Scan IA */}
              <Link
                href="/scan-recipe"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group"
              >
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <ScanText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">
                      Scanner (IA)
                    </span>
                    <Sparkles
                      size={12}
                      className="text-orange-500 fill-orange-500"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">Depuis une photo</p>
                </div>
              </Link>

              {/* Option 2: Manuel */}
              <Link
                href="/new-recipe"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
              >
                <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                  <PenTool size={20} />
                </div>
                <div>
                  <span className="font-bold text-neutral-900">
                    Manuellement
                  </span>
                  <p className="text-xs text-neutral-500">
                    Écrire étape par étape
                  </p>
                </div>
              </Link>
            </div>

            {/* Petite flèche en bas du menu */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-neutral-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARRE DE NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-neutral-200 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-1 h-16">
          {navItems.map((item) => {
            // RENDU DU BOUTON CENTRAL (ACTION)
            if (item.isAction) {
              return (
                <div
                  key="action-btn"
                  className="flex-1 flex justify-center items-center relative -top-5"
                >
                  <motion.button
                    onClick={handleCreateClick}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: isMenuOpen ? 45 : 0 }} // Rotation en croix si menu ouvert
                    className={clsx(
                      "flex items-center justify-center size-14 rounded-full shadow-lg shadow-neutral-300 transition-all",
                      isMenuOpen
                        ? "bg-neutral-900 text-white"
                        : "bg-[#222222] text-white",
                    )}
                  >
                    <Plus size={28} />
                  </motion.button>
                </div>
              );
            }

            // RENDU DES AUTRES ONGLETS
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                href={item.to}
                className={clsx(
                  "flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-transform",
                  active ? "text-orange-600" : "text-neutral-400",
                )}
              >
                <Icon
                  size={24}
                  strokeWidth={active ? 2.5 : 2}
                  className={clsx("transition-all", active && "scale-105")}
                />
                <span
                  className={clsx(
                    "text-[10px]",
                    active ? "font-bold" : "font-medium",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
