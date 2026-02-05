"use client";

import { useState } from "react";
import { Settings, Plus, Trash, X, Loader2 } from "lucide-react";
import type { Category } from "@/types/models/category";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  isLoading?: boolean;
  onSelectCategory: (value: string | null) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  setNewCategoryName: any;
  newCategoryName: any;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  isLoading = false,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  newCategoryName,
  setNewCategoryName,
}: CategoryFilterProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    onAddCategory(newCategoryName.trim());
    setTimeout(() => {
      setNewCategoryName("");
      setIsAdding(false);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="overflow-x-auto flex-1">
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                !selectedCategory
                  ? "bg-neutral-900 text-white shadow-lg"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Toutes
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white "
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {isAdding ? (
              <form
                onSubmit={handleAddCategory}
                className="flex items-center relative"
              >
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  disabled={isSubmitting}
                  onBlur={() =>
                    !newCategoryName && !isSubmitting && setIsAdding(false)
                  }
                  className="bg-white border-2 border-orange-400 px-4 py-2 rounded-full text-sm outline-none transition-all disabled:bg-neutral-50"
                  placeholder="Nom..."
                />
                {isSubmitting && (
                  <div className="absolute right-3 flex items-center justify-center">
                    <Loader2
                      size={16}
                      className="animate-spin text-orange-500"
                    />
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="size-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsManaging(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shrink-0"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Gérer</span>
        </button>
      </div>

      {/* Category Manager Modal */}
      {isManaging && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setIsManaging(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h3 className="text-xl font-black text-neutral-900">
                Gérer les catégories
              </h3>
              <button
                onClick={() => setIsManaging(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-500">Aucune catégorie créée</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl group"
                    >
                      <span className="font-semibold text-neutral-800">
                        {cat.name}
                      </span>
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-3 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer rounded-lg transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50">
              <button
                onClick={() => {
                  setIsManaging(false);
                  setIsAdding(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <Plus size={18} /> Ajouter une catégorie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
