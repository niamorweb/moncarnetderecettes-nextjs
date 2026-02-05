"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  BookType,
  Camera,
  ChefHat,
  Loader2,
  Move,
  Plus,
  PlusCircle,
  ScanText,
  Sparkles,
  Trash,
  User,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { Recipe } from "@/types/models/recipe";
import { Category } from "@/types/models/category";
import DashboardRecipeCard from "@/components/dashboard/DashboardRecipeCard";
import CategoryFilter from "@/components/dashboard/CategoryFilter";
import BulkActionsBar from "@/components/dashboard/BulkActionsBar";
import RecipeCardSkeleton from "@/components/dashboard/RecipeCardSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Link from "next/link";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function DashboardPage() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveToCategoryId, setMoveToCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingRecipes, setDeletingRecipes] = useState(false);
  const [movingRecipes, setMovingRecipes] = useState(false);

  const isPremium = user?.isPremium;

  const loaderRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 20;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchRecipesPage = useCallback(
    async (pageNum: number, categoryId?: string | null, reset = false) => {
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(PAGE_SIZE),
        });
        if (categoryId) params.set("categoryId", categoryId);

        const res = await fetch(`${API_BASE}/recipes/all?${params}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const result = await res.json();
          // Handle both formats: paginated { data, hasMore } or plain array
          let items = Array.isArray(result) ? result : (result.data ?? []);
          const more = Array.isArray(result)
            ? false
            : (result.hasMore ?? false);
          // Fallback: client-side category filter if backend returned unfiltered array
          if (Array.isArray(result) && categoryId) {
            items = items.filter(
              (r: any) =>
                r.categoryId === categoryId || r.category?.id === categoryId,
            );
          }
          setRecipes((prev) => (reset ? items : [...prev, ...items]));
          setHasMore(more);
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    },
    [API_BASE, accessToken],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [API_BASE, accessToken]);

  // Initial load
  useEffect(() => {
    if (!accessToken) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRecipesPage(1, null, true), fetchCategories()]);
      setPage(1);
      setLoading(false);
    };
    loadData();
  }, [accessToken, fetchRecipesPage, fetchCategories]);

  // Reset when category changes
  const handleSelectCategory = useCallback(
    async (categoryId: string | null) => {
      setSelectedCategory(categoryId);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      await fetchRecipesPage(1, categoryId, true);
      setLoading(false);
    },
    [fetchRecipesPage],
  );

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchRecipesPage(nextPage, selectedCategory).then(() =>
            setLoadingMore(false),
          );
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, selectedCategory, fetchRecipesPage]);

  const toggleRecipeSelection = (id: string) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const clearSelection = () => {
    setSelectedRecipes([]);
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        setNewCategoryName("");
        await fetchCategories();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setAddingCategory(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        await fetchCategories();
        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const moveRecipes = async () => {
    if (!moveToCategoryId) return;
    setMovingRecipes(true);
    try {
      await Promise.all(
        selectedRecipes.map((id) =>
          fetch(`${API_BASE}/recipes/${id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryId: moveToCategoryId }),
          }),
        ),
      );
      setPage(1);
      await fetchRecipesPage(1, selectedCategory, true);
      clearSelection();
      setShowMoveModal(false);
      setMoveToCategoryId(null);
    } catch (error) {
      console.error("Failed to move recipes:", error);
    } finally {
      setMovingRecipes(false);
    }
  };

  const deleteSelectedRecipes = async () => {
    setDeletingRecipes(true);
    try {
      await Promise.all(
        selectedRecipes.map((id) =>
          fetch(`${API_BASE}/recipes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ),
      );
      setPage(1);
      await fetchRecipesPage(1, selectedCategory, true);
      clearSelection();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete recipes:", error);
    } finally {
      setDeletingRecipes(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          Mes recettes
        </h1>
        <div className="hidden md:flex items-center">
          {/* Container "Pillule" unifié */}
          <div
            className={clsx(
              "flex items-center p-1 rounded-full border transition-all duration-300",
              "bg-white border-neutral-200",
            )}
          >
            {/* BOUTON PRINCIPAL : NOUVELLE RECETTE */}
            <Link href="/new-recipe">
              <div
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors",
                  !isPremium
                    ? "bg-[#222222] text-white hover:bg-black"
                    : "text-[#222222] hover:bg-neutral-100",
                )}
              >
                <div
                  className={clsx(
                    "p-1 rounded-full",
                    !isPremium
                      ? "bg-white/20"
                      : "bg-orange-100 text-orange-600",
                  )}
                >
                  <Plus size={16} strokeWidth={3} />
                </div>
                <span className="font-bold text-sm tracking-tight">
                  Nouvelle recette
                </span>
              </div>
            </Link>

            {/* SEPARATEUR (Seulement si Premium) */}
            {isPremium && <div className="w-[1px] h-6 bg-neutral-200 mx-1" />}

            {/* BOUTON SECONDAIRE : SCAN (PREMIUM) */}
            {isPremium && (
              <Link href="/scan-recipe" className="relative group">
                <div className="px-4 py-2.5 rounded-full flex items-center justify-center gap-2 text-[#222222] relative overflow-hidden hover:bg-neutral-100 transition-colors">
                  <ScanText size={18} />
                </div>

                {/* Tooltip Airbnb Style */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-3 py-1.5 bg-[#222222] text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50">
                  Scanner (IA)
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#222222] rotate-45" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />

      {selectedRecipes.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedRecipes.length}
          categories={categories}
          onClear={clearSelection}
          onMove={() => setShowMoveModal(true)}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe, index) => (
              <DashboardRecipeCard
                key={recipe.id}
                index={index}
                recipe={recipe}
                isSelected={selectedRecipes.includes(recipe.id)}
                onToggleSelect={() => toggleRecipeSelection(recipe.id)}
                isAnySelected={
                  selectedCategory
                    ? selectedCategory?.length > 0
                      ? true
                      : false
                    : false
                }
              />
            ))}

            {/* Add new recipe card */}
            <Link
              href="/new-recipe"
              className="group relative bg-white border-2 border-dashed border-neutral-200 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-50 flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="flex flex-col items-center gap-3 text-neutral-400 group-hover:text-orange-500 transition-colors">
                <div className="size-14 rounded-full bg-neutral-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                  <Plus className="size-7" />
                </div>
                <span className="font-bold text-sm">Nouvelle recette</span>
              </div>
            </Link>
          </div>

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-6">
              {loadingMore && (
                <Loader2 className="size-6 animate-spin text-neutral-400" />
              )}
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteSelectedRecipes}
        title="Supprimer les recettes"
        description={`Voulez-vous vraiment supprimer ${selectedRecipes.length} recette(s) ? Cette action est irréversible.`}
      />

      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Move className="h-5 w-5" />
                Déplacer vers une catégorie
              </h2>
              <button onClick={() => setShowMoveModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMoveToCategoryId(cat.id)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    moveToCategoryId === cat.id
                      ? "bg-orange-100 border-orange-500 border"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowMoveModal(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={moveRecipes}
                disabled={!moveToCategoryId || movingRecipes}
                className="flex-1 py-2 px-4 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {movingRecipes && <Loader2 className="h-4 w-4 animate-spin" />}
                Déplacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
