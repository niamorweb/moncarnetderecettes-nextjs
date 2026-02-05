"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Upload,
  Loader2,
  Clock,
  Users,
  Utensils,
  Image as ImageIcon,
  Save,
  Trash2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
import { Category } from "@/types/models/category";
import Button from "@/components/ui/Button";

// --- VALIDATION SCHEMA ---
const recipeSchema = z.object({
  name: z.string().min(1, "Le nom de la recette est requis"),
  // Changement ici : min(1) pour forcer une saisie sur le temps de prép
  prep_time: z.coerce.number().min(1, "Le temps de préparation est requis"),
  // Cook time reste min(0) mais n'est pas bloquant si 0
  cook_time: z.coerce.number().min(0).optional(),
  servings: z.coerce.number().min(1, "Au moins 1 portion requise"),
  ingredients: z
    .array(z.string().min(1))
    .min(1, "Il faut au moins un ingrédient"),
  steps: z.array(z.string().min(1)).min(1, "Il faut au moins une étape"),
});

// Petit composant pour l'astérisque
const RequiredMark = () => <span className="text-orange-500 ml-1">*</span>;

export default function NewRecipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  // On initialise prepTime à "" ou 0, mais pour le champ number contrôlé,
  // on utilise souvent une string vide pour permettre le placeholder,
  // ici on garde number pour simplifier, mais la validation bloquera 0.
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState<number | string>(0);
  const [cookTime, setCookTime] = useState<number | string>(0);
  const [servings, setServings] = useState<number | string>(2);
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  // --- LOGIQUE SCAN & FETCH ---
  useEffect(() => {
    const source = searchParams.get("source");
    if (source === "scan") {
      const storedData = localStorage.getItem("scan-data");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const scannedName = parsedData.nom || parsedData.name;
          if (scannedName) setName(scannedName);

          const scannedPrep =
            parsedData.temps_preparation || parsedData.prep_time;
          if (scannedPrep) setPrepTime(parseInt(String(scannedPrep)) || 0);

          const scannedCook = parsedData.temps_cuisson || parsedData.cook_time;
          if (scannedCook) setCookTime(parseInt(String(scannedCook)) || 0);

          const scannedServings = parsedData.portions || parsedData.servings;
          if (scannedServings)
            setServings(parseInt(String(scannedServings)) || 2);

          const scannedIngs = parsedData.ingredients;
          if (Array.isArray(scannedIngs) && scannedIngs.length > 0) {
            setIngredients([...new Set(scannedIngs as string[])]);
          }
          const scannedSteps =
            parsedData.etapes || parsedData.instructions || parsedData.steps;
          if (Array.isArray(scannedSteps) && scannedSteps.length > 0) {
            setSteps(scannedSteps);
          }
        } catch (error) {
          console.error("Erreur parsing JSON :", error);
        }
      }
    }
  }, [searchParams]);

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };
  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  // --- VALIDATION & SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const filteredIngredients = ingredients.filter((i) => i.trim() !== "");
    const filteredSteps = steps.filter((s) => s.trim() !== "");

    // Validation Zod
    const validation = recipeSchema.safeParse({
      name,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      ingredients: filteredIngredients,
      steps: filteredSteps,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("prep_time", String(prepTime));
      formData.append("cook_time", String(cookTime || 0)); // Envoie 0 si vide
      formData.append("servings", String(servings));
      formData.append("isPublic", String(isPublic));
      if (categoryId) formData.append("categoryId", categoryId);

      filteredIngredients.forEach((ing) =>
        formData.append("ingredients[]", ing),
      );
      filteredSteps.forEach((step) => formData.append("steps[]", step));
      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (res.ok) {
        if (searchParams.get("source") === "scan") {
          localStorage.removeItem("scan-data");
        }
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setErrors({ form: data.message || "Une erreur est survenue" });
      }
    } catch (error) {
      console.error("Failed to create recipe:", error);
      setErrors({ form: "Une erreur est survenue" });
    } finally {
      setLoading(false);
    }
  };

  // Helper pour le style conditionnel
  const getInputClass = (hasError: boolean) =>
    `w-full font-medium transition-colors outline-none focus:ring-2 rounded-lg ${
      hasError
        ? "bg-red-50 border border-red-500 text-red-900 placeholder:text-red-300 focus:ring-red-200"
        : "bg-neutral-50 border border-transparent text-neutral-900 focus:bg-white focus:border-orange-200 focus:ring-orange-100"
    }`;

  // Helper pour la gestion sécurisée des inputs number
  const handleNumberChange =
    (setter: (val: number | string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === "" ? "" : Number(value));
    };

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex items-center justify-between gap-3 mb-10">
        <Button variant="ghost" href="/dashboard">
          <ChevronLeft size={16} /> Retour
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          <span className="hidden sm:inline">Enregistrer</span>
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {errors.form && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <div>
              <span className="font-bold block">Erreur de sauvegarde</span>
              {errors.form}
            </div>
          </div>
        )}

        {searchParams.get("source") === "scan" && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-800">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Loader2 className="animate-spin" size={16} />
            </div>
            <div className="text-sm">
              <p className="font-bold">Recette pré-remplie par l'IA</p>
              <p className="opacity-80">
                Vérifiez les informations ci-dessous.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* --- COLONNE GAUCHE --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
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
                          <Upload size={18} /> Changer
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
                  <label className="block text-sm font-bold text-neutral-700 mb-1">
                    Nom de la recette <RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Tarte aux pommes"
                    className={`w-full text-xl md:text-2xl font-black placeholder:text-neutral-300 p-2 rounded-lg transition-all ${
                      errors.name
                        ? "bg-red-50 border border-red-500 text-red-900 focus:ring-2 focus:ring-red-200 outline-none"
                        : "bg-transparent border border-transparent focus:bg-neutral-50 focus:ring-2 focus:ring-orange-100 outline-none"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
                  {/* Préparation (OBLIGATOIRE) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Prép. <RequiredMark />
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={prepTime}
                        onChange={handleNumberChange(setPrepTime)}
                        className={`${getInputClass(!!errors.prep_time)} px-2 py-1 text-lg`}
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        min
                      </span>
                    </div>
                    {/* Message d'erreur spécifique préparation */}
                    {errors.prep_time && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.prep_time}
                      </p>
                    )}
                  </div>

                  {/* Cuisson (OPTIONNEL) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Cuisson{" "}
                      <span className="text-[10px] normal-case opacity-60">
                        (opt.)
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={cookTime}
                        onChange={handleNumberChange(setCookTime)}
                        className={`${getInputClass(false)} px-2 py-1 text-lg`} // Jamais d'erreur visuelle
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        min
                      </span>
                    </div>
                  </div>

                  {/* Portions */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Users size={12} /> Parts <RequiredMark />
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={servings}
                        onChange={handleNumberChange(setServings)}
                        className={`${getInputClass(!!errors.servings)} px-2 py-1 text-lg`}
                      />
                      <span className="text-xs font-bold text-neutral-400">
                        pers.
                      </span>
                    </div>
                    {errors.servings && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.servings}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Catégorie */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                <label className="text-sm font-bold text-neutral-900 mb-2 block">
                  Catégorie
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full appearance-none bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 font-medium cursor-pointer"
                  >
                    <option value="">Sélectionner une catégorie...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <Utensils size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- COLONNE DROITE --- */}
          <div className="lg:col-span-7 space-y-8">
            {/* INGRÉDIENTS */}
            <div
              className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-colors ${
                errors.ingredients
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-neutral-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-neutral-900">
                  Ingrédients <RequiredMark />
                </h2>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-md">
                  {ingredients.filter((i) => i.trim() !== "").length} éléments
                </span>
              </div>

              {errors.ingredients && (
                <div className="mb-4 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.ingredients}
                </div>
              )}

              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Ingrédient ${index + 1}`}
                      className="flex-1 bg-neutral-50 border-transparent border rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-100 focus:bg-white focus:border-orange-200 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      disabled={ingredients.length <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addIngredient}
                className="mt-4 w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 font-bold text-sm hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Ajouter un ingrédient
              </button>
            </div>

            {/* ÉTAPES */}
            <div
              className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-colors ${
                errors.steps
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-neutral-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-neutral-900">
                  Préparation <RequiredMark />
                </h2>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                  {steps.filter((s) => s.trim() !== "").length} étapes
                </span>
              </div>

              {errors.steps && (
                <div className="mb-4 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.steps}
                </div>
              )}

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      {index !== steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-neutral-100 mt-2 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Décrivez l'étape ${index + 1}...`}
                          rows={3}
                          className="w-full bg-neutral-50 border-transparent border rounded-2xl p-4 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-100 focus:bg-white focus:border-orange-200 resize-none transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          disabled={steps.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addStep}
                className="mt-4 w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 font-bold text-sm hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Ajouter une étape suivante
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
