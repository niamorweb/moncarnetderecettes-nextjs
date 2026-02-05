"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BookType,
  User,
  Settings,
  Crown,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { clsx } from "clsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const navItems = [
  { to: "/dashboard", icon: BookOpen, label: "Mes Recettes" },
  { to: "/profile", icon: User, label: "Mon Profil" },
  { to: "/pdf-viewer", icon: BookType, label: "Mon Carnet" },
  { to: "/subscription", icon: Crown, label: "Abonnement" },
];

const bottomItems = [{ to: "/settings", icon: Settings, label: "Paramètres" }];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col z-40 hidden md:flex">
      {/* LOGO AREA */}
      <div className="p-6 border-b border-neutral-100">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-neutral-900 rounded-lg shadow-lg shadow-neutral-200"
          >
            <BookOpen className="size-5 text-white" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-orange-600 transition-colors">
            Mon carnet
          </span>
        </Link>
      </div>

      {/* NAV WRAPPER (LayoutGroup permet de partager l'animation entre les listes) */}
      <LayoutGroup>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {/* Main Items */}
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                isActive={pathname === item.to}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-neutral-100 space-y-1">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                isActive={pathname === item.to}
              />
            ))}
          </ul>
        </div>
      </LayoutGroup>
    </aside>
  );
}

// --- SUB-COMPONENT FOR MOTION ITEMS ---

function NavItem({ item, isActive }: { item: any; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <li>
      <Link href={item.to} className="relative block">
        {/* L'élément LIEN complet */}
        <motion.div
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative z-10",
            isActive
              ? "text-orange-700"
              : "text-neutral-600 hover:text-neutral-900",
          )}
        >
          {/* BACKGROUND SLIDING PILL (Magie ici) */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-pill"
              className="absolute inset-0 bg-orange-50 border border-orange-100/50 rounded-xl z-[-1]"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}

          {/* ICON (Animation subtile au survol) */}
          <motion.div
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            className={clsx(
              isActive
                ? "text-orange-600"
                : "text-neutral-400 group-hover:text-neutral-600",
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
          </motion.div>

          <span>{item.label}</span>

          {/* Petite flèche ou indicateur optionnel à droite si actif */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"
            />
          )}
        </motion.div>
      </Link>
    </li>
  );
}
