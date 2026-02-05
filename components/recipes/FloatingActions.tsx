"use client";

import Link from "next/link";
import { Trash, Pen } from "lucide-react";
import Button from "../ui/Button";

interface FloatingActionsProps {
  recipeId: string | number;
  openDeleteModal: (id: string | number) => void;
}

export function FloatingActions({
  recipeId,
  openDeleteModal,
}: FloatingActionsProps) {
  return (
    <div className="z-40 fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <Button variant="destructive" onClick={() => openDeleteModal(recipeId)}>
        <Trash size={16} />
        <span className="hidden md:flex">Supprimer</span>
      </Button>

      <Button href={`/edit-recipe/${recipeId}`} variant="primary">
        <Pen size={16} />
        <span>Modifier</span>
      </Button>
    </div>
  );
}
