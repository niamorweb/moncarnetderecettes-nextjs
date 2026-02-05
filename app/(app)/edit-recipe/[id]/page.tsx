"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  Upload,
  Loader2,
  ChefHat,
  Clock,
  Users,
  Utensils,
  Image as ImageIcon,
  Save,
  Globe,
  Lock,
  Trash2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
import { Category } from "@/types/models/category";
import { Recipe } from "@/types/models/recipe";
import Button from "@/components/ui/Button";

// --- SCHEMA (Identique création) ---
const recipeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  prep_time: z.coerce.number().min(0, "Temps positif requis"),
  cook_time: z.coerce.number().min(0, "Temps positif requis"),
  servings: z.coerce.number().min(1, "Au moins 1 portion"),
  ingredients: z
    .array(z.string())
    .transform((a) => a.filter((s) => s.trim()))
    .refine((a) => a.length > 0, "Au moins un ingrédient requis"),
  steps: z
    .array(z.string())
    .transform((a) => a.filter((s) => s.trim()))
    .refine((a) => a.length > 0, "Au moins une étape requise"),
});

export default function EditRecipeForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Data
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState<number | string>(0);
  const [cookTime, setCookTime] = useState<number | string>(0);
  const [servings, setServings] = useState<number | string>(1);
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  // const [isPublic, setIsPublic] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  // --- FETCH DATA ---
  useEffect(() => {
    const init = async () => {
      try {
        setInitialLoading(true);

        // 1. Fetch Categories
        const catRes = await fetch(`${API_BASE}/categories`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (catRes.ok) setCategories(await catRes.json());

        // 2. Fetch Recipe
        const recipeRes = await fetch(`${API_BASE}/recipes/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!recipeRes.ok) throw new Error("Recette introuvable");

        const data: Recipe = await recipeRes.json();

        // Populate State
        setName(data.name || "");
        setPrepTime(data.prep_time || 0);
        setCookTime(data.cook_time || 0);
        setServings(data.servings || 2);
        setCategoryId(data.category_id || data.categoryId || "");
        setCurrentImageUrl(data.image_url || null);

        setIngredients(
          data.ingredients && data.ingredients.length > 0
            ? data.ingredients
            : [""],
        );
        setSteps(data.steps && data.steps.length > 0 ? data.steps : [""]);
      } catch (err) {
        console.error(err);
        setErrors({ form: "Impossible de charger la recette." });
      } finally {
        setInitialLoading(false);
      }
    };

    if (accessToken && id) init();
  }, [accessToken, id, API_BASE]);

  // --- HELPERS ---
  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return currentImageUrl;
  }, [imageFile, currentImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const updateArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removeArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      return copy.length ? copy : [""];
    });
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation Zod
    const result = recipeSchema.safeParse({
      name,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      ingredients,
      steps,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("prep_time", String(prepTime));
      formData.append("cook_time", String(cookTime));
      formData.append("servings", String(servings));
      formData.append("categoryId", categoryId || "");

      // Arrays
      ingredients
        .filter((i) => i.trim())
        .forEach((i) => formData.append("ingredients[]", i));
      steps
        .filter((s) => s.trim())
        .forEach((s) => formData.append("steps[]", s));

      // Image only if changed
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_BASE}/recipes/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur serveur");

      router.push(`/dashboard`); // Or /recipes/${id}
    } catch (err) {
      console.error(err);
      setErrors({ form: "Erreur lors de la sauvegarde." });
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex items-center justify-between gap-3 mb-10">
        <Button variant="ghost" href={"/view-recipe/" + id}>
          <ChevronLeft size={16} /> Retour
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          <span className="hidden sm:inline">Enregistrer</span>
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {errors.form && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="font-bold">Erreur :</span> {errors.form}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* --- GAUCHE (Sticky) --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Carte Principale */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                {/* Image */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-video w-full rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all group ${
                    imagePreview
                      ? "border-transparent"
                      : "border-neutral-200 hover:border-orange-400 bg-neutral-50"
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium flex items-center gap-2">
                          <Upload size={18} /> Changer la photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                      <ImageIcon size={48} className="mb-3 opacity-50" />
                      <p className="font-medium text-sm">Ajouter une photo</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Nom */}
                <div className="mt-6">
                  <label className="sr-only">Nom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de la recette"
                    className="w-full text-2xl md:text-3xl font-black placeholder:text-neutral-300 border-none p-0 focus:ring-0 text-neutral-900 bg-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Prép.
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full font-bold text-lg bg-neutral-50 rounded-lg px-2 py-1 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-0"
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        min
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Cuisson
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                        className="w-full font-bold text-lg bg-neutral-50 rounded-lg px-2 py-1 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-0"
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        min
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Users size={12} /> Parts
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="w-full font-bold text-lg bg-neutral-50 rounded-lg px-2 py-1 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-0"
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        p.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paramètres */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 space-y-6">
                <div>
                  <label className="text-sm font-bold text-neutral-900 mb-2 block">
                    Catégorie
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full appearance-none bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 font-medium"
                    >
                      <option value="">Aucune</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <Utensils
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                    />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isPublic ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}
                    >
                      {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        Visibilité
                      </p>
                      <p className="text-xs text-neutral-500">
                        {isPublic ? "Publique" : "Privée"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${isPublic ? "bg-orange-500" : "bg-neutral-200"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isPublic ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {/* --- DROITE (Contenu) --- */}
          <div className="lg:col-span-7 space-y-8">
            {/* Ingrédients */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-neutral-900">
                  Ingrédients
                </h2>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-md">
                  {ingredients.filter((i) => i.trim()).length}
                </span>
              </div>

              <div className="space-y-3">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="cursor-grab text-neutral-300 hover:text-neutral-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-current mb-1" />
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <input
                      value={ing}
                      onChange={(e) =>
                        updateArray(setIngredients, i, e.target.value)
                      }
                      placeholder={`Ingrédient ${i + 1}`}
                      className="flex-1 bg-neutral-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(setIngredients, i)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIngredients([...ingredients, ""])}
                className="mt-4 w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 font-bold text-sm hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Ajouter un ingrédient
              </button>
              {errors.ingredients && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.ingredients}
                </p>
              )}
            </div>

            {/* Étapes */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-neutral-900">
                  Préparation
                </h2>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                  {steps.filter((s) => s.trim()).length}
                </span>
              </div>

              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-sm shadow-md">
                        {i + 1}
                      </div>
                      {i !== steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-neutral-100 mt-2 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1 relative">
                      <textarea
                        value={step}
                        onChange={(e) =>
                          updateArray(setSteps, i, e.target.value)
                        }
                        placeholder={`Décrivez l'étape ${i + 1}...`}
                        rows={3}
                        className="w-full bg-neutral-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-100 focus:bg-white resize-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(setSteps, i)}
                        className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSteps([...steps, ""])}
                className="mt-6 w-full py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-neutral-800 shadow-lg shadow-neutral-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Ajouter une étape
              </button>
              {errors.steps && (
                <p className="text-red-500 text-sm mt-2">{errors.steps}</p>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
