"use client";

import Link from "next/link";
import Image from "next/image";
import { ForkKnife, Users, Check } from "lucide-react";

import type { Recipe } from "@/types/models/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isSelected: boolean;
  isAnySelected: boolean;
  onToggleSelect: (id: number | string) => void;
}

export default function DashboardRecipeCard({
  recipe,
  index,
  isSelected,
  isAnySelected,
  onToggleSelect,
}: RecipeCardProps) {
  const handleToggle = () => {
    onToggleSelect(recipe.id);
  };

  return (
    <div
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={[
        "group relative bg-white border-2 rounded-[2rem] overflow-hidden transition-all h-fit duration-300 cursor-pointer outline-none",
        "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
        isSelected
          ? "border-orange-500 shadow-orange-100 shadow-xl scale-[0.98]"
          : "border-transparent shadow-sm hover:border-neutral-200",
      ].join(" ")}
    >
      {/* Check icon */}
      <div
        className={[
          "absolute top-4 right-4 z-10 size-8 md:size-6 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "bg-orange-500 border-orange-500"
            : "bg-white/80 border-neutral-200 backdrop-blur-md",
        ].join(" ")}
      >
        {isSelected && <Check size={14} className="text-white" />}
      </div>

      {/* Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 transition-transform duration-700 group-hover:scale-110" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {recipe.category && (
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1 block">
            {recipe.category.name}
          </span>
        )}

        <h3 className="font-bold text-neutral-800 line-clamp-1 mb-3 group-hover:text-orange-600 transition-colors">
          {recipe.name}
        </h3>

        <div className="flex items-center gap-3 text-neutral-400">
          <div className="flex items-center gap-1 text-xs font-bold">
            <ForkKnife size={14} />
            {(recipe.prep_time || 0) + (recipe.cook_time || 0)}m
          </div>

          {recipe.servings && (
            <div className="flex items-center gap-1 text-xs font-bold">
              <Users size={14} />
              {recipe.servings}
            </div>
          )}
        </div>
      </div>

      {/* Overlay link */}
      {!isAnySelected && (
        <Link
          href={`/view-recipe/${recipe.id}`}
          className="absolute inset-0 z-0"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
