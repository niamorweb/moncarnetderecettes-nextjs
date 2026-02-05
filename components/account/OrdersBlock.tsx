"use client";

import { useState, useEffect } from "react";
import { Package, Truck, Clock, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  amountTotal: number;
  currency: string;
  status: string;
  quantity: number;
  printOptions: {
    coverType?: string;
    paperType?: string;
    finishType?: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "En attente de paiement",
    color: "text-yellow-600 bg-yellow-50",
    icon: <Clock className="size-4" />,
  },
  PAID: {
    label: "Payée",
    color: "text-blue-600 bg-blue-50",
    icon: <CheckCircle2 className="size-4" />,
  },
  IN_PRODUCTION: {
    label: "En production",
    color: "text-orange-600 bg-orange-50",
    icon: <Package className="size-4" />,
  },
  SHIPPED: {
    label: "Expédiée",
    color: "text-green-600 bg-green-50",
    icon: <Truck className="size-4" />,
  },
  DELIVERED: {
    label: "Livrée",
    color: "text-green-700 bg-green-50",
    icon: <CheckCircle2 className="size-4" />,
  },
  CANCELLED: {
    label: "Annulée",
    color: "text-red-600 bg-red-50",
    icon: <XCircle className="size-4" />,
  },
  REFUNDED: {
    label: "Remboursée",
    color: "text-neutral-600 bg-neutral-50",
    icon: <XCircle className="size-4" />,
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function getCoverLabel(coverType?: string) {
  if (coverType === "hardcover") return "Couverture rigide";
  if (coverType === "softcover") return "Couverture souple";
  return coverType || "—";
}

export default function OrdersBlock() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    const fetchOrders = async () => {
      try {
        const url = `${API_BASE}/orders`;
        console.log("[OrdersBlock] Fetching orders from:", url);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("[OrdersBlock] Response status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("[OrdersBlock] Orders received:", data);
          setOrders(data);
        } else {
          console.error("[OrdersBlock] Error response:", res.status, await res.text());
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  const statusInfo = (status: string) =>
    STATUS_CONFIG[status] || {
      label: status,
      color: "text-neutral-600 bg-neutral-50",
      icon: <Clock className="size-4" />,
    };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[1rem] outline outline-neutral-100">
      <h2 className="text-xl font-black pb-4 mb-8 text-neutral-900 flex items-center gap-3 border-b border-neutral-100">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Package className="size-5 text-orange-600" />
        </div>
        Mes Carnets Commandés
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="size-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-medium">
            Aucune commande pour le moment.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Rendez-vous sur &quot;Mon Livre&quot; pour commander votre carnet de recettes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const si = statusInfo(order.status);
            return (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${si.color}`}
                    >
                      {si.icon}
                      {si.label}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className="text-sm font-black text-neutral-900">
                    {formatPrice(order.amountTotal, order.currency)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="text-neutral-500">
                    <span className="font-medium text-neutral-700">Couverture :</span>{" "}
                    {getCoverLabel(order.printOptions?.coverType)}
                  </div>
                  <div className="text-neutral-500">
                    <span className="font-medium text-neutral-700">Quantité :</span>{" "}
                    {order.quantity}
                  </div>
                  {order.shippingAddress && (
                    <div className="text-neutral-500 sm:col-span-2">
                      <span className="font-medium text-neutral-700">Livraison :</span>{" "}
                      {order.shippingAddress.name}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </div>
                  )}
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <Truck className="size-3.5" />
                    Suivre mon colis
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
