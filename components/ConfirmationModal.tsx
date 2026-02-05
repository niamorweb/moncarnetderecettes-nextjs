"use client";

import { Trash2 } from "lucide-react";
import Button from "./ui/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmer",
  variant = "danger",
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 animate-modal-in">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              variant === "danger"
                ? "bg-red-50 text-red-500"
                : "bg-orange-50 text-orange-500"
            }`}
          >
            <Trash2 className="size-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-neutral-900 mb-2">
            {title}
          </h3>
          <p className="text-neutral-500 mb-8 leading-relaxed">{description}</p>

          <div className="flex flex-col md:flex-row w-full md:justify-center md:items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              className={
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700 shadow-red-100"
                  : "bg-neutral-900 hover:bg-neutral-800 shadow-neutral-100"
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
