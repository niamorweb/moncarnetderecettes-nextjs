"use client";

import { useState } from "react";
import { Check, Utensils } from "lucide-react";
import type { Recipe } from "@/types/models/recipe";

interface IngredientsBlockProps {
  recipe?: Recipe;
}

export default function IngredientsBlock({ recipe }: IngredientsBlockProps) {
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setChecked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <section>
      <div className="flex items-center gap-2 lg:gap-4 mb-4 lg:mb-8">
        <div className="bg-orange-100 p-3 rounded-lg lg:rounded-2xl text-orange-600">
          <Utensils className="size-5 lg:size-6" />
        </div>
        <h2 className="text-xl lg:text-3xl font-black text-neutral-900 tracking-tight">
          Ingrédients
        </h2>
      </div>

      {recipe && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipe.ingredients.map((ing, index) => (
            <button
              key={index}
              onClick={() => toggle(index)}
              className={`group flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                checked.includes(index)
                  ? "bg-neutral-50 border-neutral-100 opacity-60"
                  : "bg-white border-neutral-100 hover:border-orange-200 hover:shadow-sm"
              }`}
            >
              <div
                className={`size-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked.includes(index)
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-neutral-200 group-hover:border-orange-400"
                }`}
              >
                {checked.includes(index) && <Check size={14} strokeWidth={4} />}
              </div>

              <span
                className={`font-medium text-neutral-600 transition-all ${
                  checked.includes(index) ? "line-through text-neutral-400" : ""
                }`}
              >
                {ing}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs font-bold text-neutral-400 text-center uppercase tracking-widest">
        Astuce : Cliquez pour cocher
      </p>
    </section>
  );
}
