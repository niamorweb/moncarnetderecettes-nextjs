"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ScanRecipeSavedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 min-h-[60vh]">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Recette enregistrée !</h1>
        <p className="text-gray-500">
          Votre recette a été extraite et sauvegardée avec succès.
        </p>
      </div>

      <Button
        href="/dashboard"
        className="py-3 px-8 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
      >
        Retour au tableau de bord
      </Button>
    </div>
  );
}
