"use client";

import { Timer, Flame, Users, Clock, MapPin, ChevronLeft } from "lucide-react";
import type { Recipe } from "@/types/models/recipe";

interface InfosBlockProps {
  recipe: Recipe;
  username?: string;
}

export default function InfosBlock({ recipe, username }: InfosBlockProps) {
  return (
    <section className="lg:col-span-5 lg:sticky lg:top-12 flex flex-col items-start gap-6 w-full">
      {/* --- IMAGE CONTAINER --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] shadow-2xl group">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="object-cover w-full h-full transform transition-transform duration-[2000ms] group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <Flame className="text-neutral-300 size-12" />
          </div>
        )}

        {/* Overlay Dégradé pour le texte sur image (si besoin futur) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />

        {/* Floating Category Badge */}
        {recipe.category && (
          <div className="absolute top-5 left-5 backdrop-blur-xl bg-white/80 border border-white/20 px-4 py-2 rounded-2xl shadow-lg transition-transform group-hover:scale-95">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              {recipe.category.name}
            </span>
          </div>
        )}
      </div>

      {/* --- TEXT CONTENT --- */}
      <div className="w-full px-2 md:px-0">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 leading-[1] tracking-tighter italic-title">
            {recipe.name}
          </h1>
          {username && (
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
              Par <span className="text-orange-500">@{username}</span>
            </p>
          )}
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={`${recipe.prep_time || 0}'`}
            label="Prép."
            icon={<Clock className="size-4 text-orange-500" />}
          />
          <StatCard
            value={`${recipe.cook_time || 0}'`}
            label="Cuisson"
            icon={<Flame className="size-4 text-red-500" />}
          />
          <StatCard
            value={`${recipe.servings || 2}`}
            label="Pers."
            icon={<Users className="size-4 text-blue-500" />}
          />
        </div>
      </div>

      <style jsx>{`
        .italic-title {
          font-family: "Outfit", sans-serif;
          letter-spacing: -0.05em;
        }
      `}</style>
    </section>
  );
}

// --- SOUS-COMPOSANT POUR LES STATS ---
function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group bg-white p-3 rounded-[1.5rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="p-2 bg-neutral-50 rounded-full group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl font-black text-neutral-900 leading-none">
          {value}
        </span>
        <span className="text-[9px] uppercase font-black text-neutral-400 tracking-tighter mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
