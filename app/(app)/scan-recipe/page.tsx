"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  MoveRight,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/ui/Button"; // Ton composant Button
// J'assume que tu as un composant Card ou une div stylisée, je mets les classes directes ici
import { useToast } from "@/hooks/useToast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function ScanRecipePage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const toast = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Protection de la route (Premium Only)
  useEffect(() => {
    // Petit délai pour laisser le temps au user de charger si besoin
    if (user && !user.isPremium) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const resetScan = () => {
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startAnalysis = async () => {
    if (!previewUrl || !file) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Appel API
      const response = await fetch(`${API_BASE}/gemini/extract`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Ne pas mettre 'Content-Type' header manuellement avec FormData, fetch le fait
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'analyse");
      }

      // Sauvegarde temporaire pour la page suivante
      localStorage.setItem("scan-data", data.data); // On stringify si c'est un objet

      toast.success("Recette analysée avec succès !");
      router.push("/new-recipe?source=scan");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Si l'utilisateur n'est pas chargé ou non premium, on peut retourner null ou un loader
  if (!user || !user.isPremium) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col justify-start">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <Button
            href="/dashboard"
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-neutral-900"
          >
            <ChevronLeft size={20} className="mr-1" /> Retour
          </Button>
          <div className="w-10"></div>
        </div>

        <div className="flex gap-4 h-[calc(100vh-12rem)] md:h-auto">
          {/* Bloc Gauche : Upload */}
          <div
            className={`flex flex-col gap-2 w-full md:w-auto transition-all ${
              previewUrl ? "hidden md:flex" : "flex"
            }`}
          >
            {/* UiCard équivalent */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 w-full md:w-fit h-fit overflow-hidden">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="h-full w-full flex flex-col items-start justify-start p-8 text-center space-y-6">
                <div className="w-full flex flex-col justify-start items-start gap-3">
                  {/* Icône animée */}
                  <div className="size-24 bg-orange-50 rounded-full flex items-center justify-center mb-2 animate-pulse">
                    <Download size={40} className="text-orange-500" />
                  </div>

                  <div className="flex flex-col text-left mb-6 max-w-sm">
                    <h2 className="text-3xl font-black text-neutral-900 mb-2">
                      Importez une photo
                    </h2>
                    <p className="text-neutral-500 font-medium leading-relaxed">
                      Assurez-vous que le texte de la recette soit bien lisible
                      et éclairé pour que l'IA puisse le lire.
                    </p>
                  </div>

                  {/* Actions Desktop */}
                  {!previewUrl ? (
                    <Button
                      onClick={triggerCamera}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      <span className="mr-2">Choisir la photo</span>
                      <MoveRight size={20} />
                    </Button>
                  ) : (
                    <div className="hidden md:flex items-center gap-3">
                      <Button variant="outline" onClick={resetScan}>
                        <X size={24} />
                      </Button>

                      <Button
                        size="lg"
                        onClick={startAnalysis}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <>
                            <span className="mr-2">Scanner</span>
                            <ArrowRight size={20} />
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-neutral-400 font-medium mt-4">
                    Cela ouvrira votre galerie d'image
                  </p>
                  <p className="mt-3 text-neutral-400 text-xs font-medium text-left max-w-xs">
                    Nous utilisons Gemini 1.5 Flash pour extraire les
                    ingrédients et les instructions automatiquement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc Droit : Preview */}
          {previewUrl && (
            <div className="relative w-full md:w-[500px] h-full md:h-[600px] bg-black rounded-[2rem] overflow-hidden group shadow-2xl">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Overlay Loading */}
              {isAnalyzing && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2
                    size={48}
                    className="animate-spin text-orange-500 mb-4"
                  />
                  <p className="font-bold text-lg animate-pulse">
                    Lecture de la recette...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Sticky Footer Actions */}
        {previewUrl && (
          <div className="fixed md:hidden bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-12 flex items-center justify-between z-50">
            <Button
              variant="outline"
              onClick={resetScan}
              className="rounded-full h-12 w-12 p-0 flex items-center justify-center"
            >
              <X size={24} />
            </Button>

            <Button
              size="lg"
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="shadow-xl shadow-orange-200"
            >
              {isAnalyzing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span className="mr-2">Lancer l'analyse</span>
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
