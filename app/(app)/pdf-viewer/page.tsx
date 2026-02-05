"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Download,
  Layers,
  Search,
  Loader2,
  ChevronLeft,
  Menu,
  BookText,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useAuthStore } from "@/stores/auth";
import { Recipe } from "@/types/models/recipe";
import RecipePrint from "@/components/RecipePrint";
import OrderModal from "@/components/OrderModal";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function PdfViewerPage() {
  const { accessToken } = useAuthStore();
  const [, setRecipes] = useState<Recipe[]>([]);
  const [orderedRecipes, setOrderedRecipes] = useState<Recipe[]>([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/recipes/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
        setOrderedRecipes(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(orderedRecipes);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setOrderedRecipes(items);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedRecipes.length) return;

    const items = Array.from(orderedRecipes);
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    setOrderedRecipes(items);

    if (activeRecipeIndex === index) setActiveRecipeIndex(newIndex);
    else if (activeRecipeIndex === newIndex) setActiveRecipeIndex(index);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${API_BASE}/recipes/pdf/print-all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mes-recettes.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const activeRecipe = orderedRecipes[activeRecipeIndex];
  const filteredRecipes = orderedRecipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-900 text-zinc-100">
      {/* --- Sidebar --- */}
      <aside
        className={`flex-shrink-0 fixed bg-white text-zinc-900 border-r border-zinc-200 transition-all duration-300 ease-in-out flex flex-col h-screen z-20 ${
          isSidebarOpen
            ? "w-80 translate-x-0"
            : "w-0 -translate-x-full opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" /> Sommaire
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50 flex flex-col justify-between">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="recipes">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredRecipes.map((recipe) => {
                    const originalIndex = orderedRecipes.findIndex(
                      (r) => r.id === recipe.id,
                    );
                    return (
                      <Draggable
                        key={recipe.id}
                        draggableId={recipe.id}
                        index={originalIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            onClick={() => setActiveRecipeIndex(originalIndex)}
                            className={`group flex items-center gap-3 p-2 rounded-lg mb-1 cursor-pointer transition-all border-2 ${
                              activeRecipeIndex === originalIndex
                                ? "bg-white border-orange-400 shadow-md"
                                : "bg-white border-transparent hover:border-gray-200"
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                              {recipe.image_url && (
                                <Image
                                  src={recipe.image_url}
                                  width={32}
                                  height={32}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="text-sm font-medium truncate flex-1">
                              {recipe.name}
                            </span>

                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveItem(originalIndex, "up");
                                }}
                                className="text-gray-400 hover:text-orange-500"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveItem(originalIndex, "down");
                                }}
                                className="text-gray-400 hover:text-orange-500"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="p-4 border-t border-gray-200 bg-white flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="w-full justify-center"
            >
              {downloading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Télécharger le PDF
            </Button>
            <Button
              onClick={() => setShowOrderModal(true)}
              className="w-full justify-center"
            >
              <BookText className="w-4 h-4 mr-2" /> Commander mon carnet
            </Button>
          </div>
        </div>
      </aside>

      {/* --- Main Viewport --- */}
      <main className="flex-1 relative h-full flex flex-col min-w-0">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 bg-zinc-800 text-white p-2 rounded-full shadow-lg hover:bg-zinc-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="h-full overflow-auto bg-zinc-900 custom-scrollbar">
          <div className="flex items-center justify-center p-6 w-full h-full">
            <div className="scale-[40%] lg:scale-[60%]">
              {activeRecipe ? (
                <RecipePrint
                  recipe={activeRecipe}
                  startIndex={activeRecipeIndex + 1}
                />
              ) : (
                <div className="text-zinc-500 italic">
                  Sélectionnez une recette
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showOrderModal && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}
