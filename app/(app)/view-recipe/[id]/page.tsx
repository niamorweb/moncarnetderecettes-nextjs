"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Edit,
  Loader2,
  Pen,
  Trash,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { Recipe } from "@/types/models/recipe";
import FullContainer from "@/components/recipes/FullContainer";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ViewRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { accessToken } = useAuthStore();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
      }
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, id, accessToken]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Recette introuvable.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-10 flex items-center justify-between gap-3 mb-10">
        <Button variant="ghost" href="/dashboard">
          <ChevronLeft size={16} /> Retour
        </Button>
        <div className="z-40 flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash size={16} />
            <span className="hidden md:flex">Supprimer</span>
          </Button>
          <Button href={`/edit-recipe/${id}`} variant="primary">
            <Pen size={16} />
            <span>Modifier</span>
          </Button>
        </div>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Supprimer la recette"
          description="Voulez-vous vraiment supprimer cette recette ? Cette action est irréversible."
        />
      </div>
      <FullContainer recipe={recipe} showFloatingActions={true}></FullContainer>
    </>
  );
}
