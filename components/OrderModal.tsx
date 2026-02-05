"use client";

import { useState, useMemo } from "react";
import {
  MoveRight,
  MoveLeft,
  X,
  CheckCircle2,
  Book,
  BookOpen,
  Scroll,
  Sparkles,
  Gem,
  MapPin,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import Button from "./ui/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

interface OrderModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const coverOptions = [
  { id: "hardcover", name: "Couverture Rigide", description: "Robuste et élégant.", icon: Book, price: 25 },
  { id: "softcover", name: "Couverture Souple", description: "Léger et flexible.", icon: BookOpen, price: 15 },
];

const paperOptions = [
  { id: "standard_matte", name: "Standard Mat", description: "Rendu naturel.", icon: Scroll, price: 0 },
  { id: "premium_silk", name: "Premium Silk", description: "Toucher soyeux.", icon: Gem, price: 5 },
];

const finishOptions = [
  { id: "matte", name: "Lamination Mate", description: "Moderne.", icon: Sparkles },
  { id: "glossy", name: "Lamination Brillante", description: "Éclatant.", icon: Sparkles },
];

const TOTAL_STEPS = 5;

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { accessToken } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [orderConfig, setOrderConfig] = useState({
    coverType: null as string | null,
    paperType: null as string | null,
    finishType: null as string | null,
    quantity: 1,
    format: "A5",
  });

  const [shipping, setShipping] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "FR",
  });

  const totalPrice = useMemo(() => {
    let total = 0;
    const cover = coverOptions.find((c) => c.id === orderConfig.coverType);
    if (cover) total += cover.price;
    const paper = paperOptions.find((p) => p.id === orderConfig.paperType);
    if (paper) total += paper.price;
    return total * orderConfig.quantity;
  }, [orderConfig]);

  const formattedTotalPrice = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalPrice),
    [totalPrice]
  );

  const canProceed = useMemo(() => {
    if (currentStep === 1) return !!orderConfig.coverType;
    if (currentStep === 2) return !!orderConfig.paperType;
    if (currentStep === 3) return !!orderConfig.finishType;
    if (currentStep === 4) {
      return shipping.name.length > 2 && shipping.line1.length > 5 && shipping.city.length > 2 && shipping.postalCode.length > 4;
    }
    return true;
  }, [currentStep, orderConfig, shipping]);

  const getOptionName = (options: { id: string; name: string }[], id: string | null) =>
    options.find((o) => o.id === id)?.name || "Non défini";

  const createOrder = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        amountTotal: Math.round(totalPrice * 100),
        currency: "eur",
        quantity: orderConfig.quantity,
        printOptions: { ...orderConfig },
        shippingAddress: { ...shipping },
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { data: err };
      }

      const response = await res.json();
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (err: any) {
      console.error("Erreur API Orders:", err);
      const message = err?.data?.message || "Erreur lors de la commande";
      setErrorMsg(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderOptionGrid = (
    options: { id: string; name: string; description: string; icon: any; price?: number }[],
    selectedId: string | null,
    onSelect: (id: string) => void,
    layout: "grid" | "list" = "grid"
  ) => (
    <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative ${layout === "list" ? "p-4 flex items-center gap-4" : "p-6"} text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
              isSelected
                ? "border-orange-600 bg-orange-50/50 ring-1 ring-orange-600"
                : "border-neutral-200 bg-white hover:border-orange-300"
            }`}
          >
            {layout === "list" ? (
              <>
                <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-orange-100 text-orange-700" : "bg-neutral-100 text-neutral-600"}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="font-bold text-neutral-900">{option.name}</div>
                  <p className="text-sm text-neutral-500">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 text-orange-600">
                    <CheckCircle2 size={24} />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4 mr-4">
                  <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-orange-100 text-orange-700" : "bg-neutral-100 text-neutral-600"}`}>
                    <Icon size={20} />
                  </div>
                  {option.price !== undefined && (
                    <span className="text-xs font-bold bg-neutral-100 px-2 py-1 rounded text-neutral-600">+{option.price}€</span>
                  )}
                </div>
                <div className="font-bold text-neutral-900 mb-1">{option.name}</div>
                <p className="text-sm text-neutral-500 leading-relaxed">{option.description}</p>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-orange-600">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-in">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-100 bg-white z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Finaliser la commande</h2>
              <p className="text-sm text-neutral-500">Configuration, Livraison et Paiement.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <div key={step} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step <= currentStep ? "bg-orange-600" : "bg-neutral-200"}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-neutral-400 px-1">
            <span>Couverture</span><span>Papier</span><span>Finition</span><span>Livraison</span><span>Payer</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-neutral-50">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-800">Quel type de couverture ?</h3>
              {renderOptionGrid(coverOptions, orderConfig.coverType, (id) => setOrderConfig((p) => ({ ...p, coverType: id })))}
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-800">Choix du papier</h3>
              {renderOptionGrid(paperOptions, orderConfig.paperType, (id) => setOrderConfig((p) => ({ ...p, paperType: id })))}
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-800">Finition de couverture</h3>
              {renderOptionGrid(finishOptions, orderConfig.finishType, (id) => setOrderConfig((p) => ({ ...p, finishType: id })), "list")}
            </div>
          )}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-800">Adresse de livraison</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Nom complet</label>
                  <input value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} type="text" className="w-full p-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Jean Dupont" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Adresse (Ligne 1)</label>
                  <input value={shipping.line1} onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))} type="text" className="w-full p-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="10 rue de la Paix" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Code Postal</label>
                    <input value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} type="text" className="w-full p-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="75001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Ville</label>
                    <input value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} type="text" className="w-full p-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Paris" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Pays</label>
                  <select value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} className="w-full p-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">Récapitulatif</h3>
                <p className="text-neutral-500">Un dernier coup d&apos;oeil avant l&apos;impression.</p>
              </div>
              <div className="bg-neutral-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg shadow-neutral-900/10">
                <div>
                  <p className="text-neutral-400 text-sm">Total à payer</p>
                  <p className="text-3xl font-black">{formattedTotalPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">TVA incluse</p>
                  <p className="text-xs text-neutral-500">Livraison calculée à l&apos;étape suivante</p>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 shadow-sm mt-4">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-neutral-500 flex items-center gap-2"><Book size={14} /> Couverture</span>
                  <span className="font-medium text-neutral-900">{getOptionName(coverOptions, orderConfig.coverType)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-neutral-500 flex items-center gap-2"><Scroll size={14} /> Papier</span>
                  <span className="font-medium text-neutral-900">{getOptionName(paperOptions, orderConfig.paperType)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-neutral-500 flex items-center gap-2"><MapPin size={14} /> Livraison</span>
                  <span className="font-medium text-neutral-900 text-right text-sm">
                    {shipping.name}<br />{shipping.city} ({shipping.country})
                  </span>
                </div>
              </div>
              {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{errorMsg}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 bg-white flex justify-between items-center z-10">
          {currentStep > 1 ? (
            <button onClick={() => setCurrentStep((s) => s - 1)} className="px-6 py-2.5 rounded-lg text-neutral-600 font-medium hover:bg-neutral-100 transition-colors flex items-center gap-2">
              <MoveLeft size={18} /> Retour
            </button>
          ) : <div />}

          {currentStep < TOTAL_STEPS ? (
            <button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed} className="px-6 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/20">
              Suivant <MoveRight size={18} />
            </button>
          ) : (
            <button onClick={createOrder} disabled={isLoading} className="px-8 py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-wait">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Commander & Payer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
