"use client";

import { useState } from "react";
import { X, Move, Trash, ChevronUp } from "lucide-react";
import type { Category } from "@/types/models/category";

interface BulkActionsBarProps {
  selectedCount: number;
  categories: Category[];
  onClear: () => void;
  onMove: (categoryId: string | null) => void;
  onDelete: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  categories,
  onClear,
  onMove,
  onDelete,
}: BulkActionsBarProps) {
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);

  const handleMove = (categoryId: string | null) => {
    onMove(categoryId);
    setIsMoveMenuOpen(false);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-2xl shadow-2xl">
        <button onClick={onClear} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
          <X size={20} />
        </button>

        <span className="px-3 text-sm font-bold text-neutral-700">
          {selectedCount} recette{selectedCount > 1 ? "s" : ""}
        </span>

        <div className="w-px h-8 bg-neutral-200" />

        <div className="relative">
          <button
            onClick={() => setIsMoveMenuOpen(!isMoveMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 font-bold rounded-xl hover:bg-orange-100 transition-colors"
          >
            <Move size={16} />
            Déplacer
            <ChevronUp size={14} className={`transition-transform ${!isMoveMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMoveMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 min-w-[200px] bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
              <div className="py-1">
                <button onClick={() => handleMove(null)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                  Sans catégorie
                </button>
                {categories.length > 0 && <div className="h-px bg-neutral-100 my-1" />}
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => handleMove(cat.id)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}
