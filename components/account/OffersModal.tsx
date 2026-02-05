"use client";

import { useEffect, useMemo, useState } from "react";
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
import { createPortal } from "react-dom";
import { useAuthStore } from "@/stores/auth";

interface OrderWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OrderConfig = {
  coverType: string | null;
  paperType: string | null;
  finishType: string | null;
  quantity: number;
  format: string;
};

type Shipping = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

const TOTAL_STEPS = 5;

export default function OrderModal({ isOpen, onClose }: OrderWizardModalProps) {
  const auth = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [orderConfig, setOrderConfig] = useState<OrderConfig>({
    coverType: null,
    paperType: null,
    finishType: null,
    quantity: 1,
    format: "A5",
  });

  const [shipping, setShipping] = useState<Shipping>({
    name: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "FR",
  });

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // OPTIONS ------------------------------------------------------------------

  const coverOptions = [
    {
      id: "hardcover",
      name: "Couverture Rigide",
      description: "Robuste et élégant.",
      icon: Book,
      price: 25,
    },
    {
      id: "softcover",
      name: "Couverture Souple",
      description: "Léger et flexible.",
      icon: BookOpen,
      price: 15,
    },
  ];

  const paperOptions = [
    {
      id: "standard_matte",
      name: "Standard Mat",
      description: "Rendu naturel.",
      icon: Scroll,
      price: 0,
    },
    {
      id: "premium_silk",
      name: "Premium Silk",
      description: "Toucher soyeux.",
      icon: Gem,
      price: 5,
    },
  ];

  const finishOptions = [
    {
      id: "matte",
      name: "Lamination Mate",
      description: "Moderne.",
      icon: Sparkles,
    },
    {
      id: "glossy",
      name: "Lamination Brillante",
      description: "Éclatant.",
      icon: Sparkles,
    },
  ];

  // COMPUTED -----------------------------------------------------------------

  const totalPrice = useMemo(() => {
    let total = 0;
    const cover = coverOptions.find((c) => c.id === orderConfig.coverType);
    const paper = paperOptions.find((p) => p.id === orderConfig.paperType);

    if (cover) total += cover.price;
    if (paper) total += paper.price;

    return total * orderConfig.quantity;
  }, [orderConfig]);

  const formattedTotalPrice = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(totalPrice),
    [totalPrice],
  );

  const canProceed = useMemo(() => {
    if (currentStep === 1) return !!orderConfig.coverType;
    if (currentStep === 2) return !!orderConfig.paperType;
    if (currentStep === 3) return !!orderConfig.finishType;
    if (currentStep === 4) {
      return (
        shipping.name.length > 2 &&
        shipping.line1.length > 5 &&
        shipping.city.length > 2 &&
        shipping.postalCode.length > 4
      );
    }
    return true;
  }, [currentStep, orderConfig, shipping]);

  // API ----------------------------------------------------------------------

  const createOrder = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        amountTotal: Math.round(totalPrice * 100),
        currency: "eur",
        quantity: orderConfig.quantity,
        printOptions: orderConfig,
        shippingAddress: shipping,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setErrorMsg("Erreur lors de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  // RENDER -------------------------------------------------------------------

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Finaliser la commande</h2>
              <p className="text-sm text-neutral-500">
                Configuration, Livraison et Paiement
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i + 1 <= currentStep ? "bg-orange-600" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 bg-neutral-50">
          {currentStep === 5 && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-center">
                Récapitulatif
              </h3>

              <div className="bg-neutral-900 text-white p-6 rounded-2xl flex justify-between">
                <div>
                  <p className="text-neutral-400 text-sm">Total</p>
                  <p className="text-3xl font-black">{formattedTotalPrice}</p>
                </div>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {errorMsg}
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-white flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-6 py-2 rounded-lg hover:bg-neutral-100 flex gap-2"
            >
              <MoveLeft size={18} /> Retour
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed}
              className="px-6 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50 flex gap-2"
            >
              Suivant <MoveRight size={18} />
            </button>
          ) : (
            <button
              onClick={createOrder}
              disabled={isLoading}
              className="px-8 py-2 rounded-lg bg-orange-600 text-white font-bold flex gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Commander & Payer"
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
