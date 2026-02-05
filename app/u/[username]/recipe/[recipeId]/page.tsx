"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Timer,
  Search,
  XCircle,
  ChevronRight,
  ChefHat,
  MapPin,
  Link as LinkIcon,
  ChevronLeft,
} from "lucide-react";
import FullContainer from "@/components/recipes/FullContainer";
import { Recipe } from "@/types/models/recipe";
import Button from "@/components/ui/Button";

export default function PublicProfilePage() {
  const { username, recipeId } = useParams<{
    username: string;
    recipeId: string;
  }>();

  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("pending");

  /* -------------------------------------------------------------------------- */
  /*                                   FETCH                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setStatus("pending");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/profiles/public/${username}/recipe/${recipeId}`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("404");

        const data = await res.json();
        if (!data) throw new Error("404");

        setRecipeData(data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    fetchRecipe();
  }, [username, recipeId]);

  if (status === "error") {
    notFound();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-10 flex items-center justify-between gap-3 mb-10">
        <Button variant="ghost" to={`/u/${username}`}>
          <ChevronLeft size={16} /> Retour
        </Button>
      </div>
      {recipeData && <FullContainer recipe={recipeData} />}
    </>
  );
}
