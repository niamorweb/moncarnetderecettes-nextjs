"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmer",
  variant = "danger",
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  // Prevent scroll behind modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 animate-modal-in">
        <div className="text-center">
          <div
            className={[
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
              variant === "danger"
                ? "bg-red-50 text-red-500"
                : "bg-orange-50 text-orange-500",
            ].join(" ")}
          >
            <Trash2 className="size-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-neutral-900 mb-2">
            {title}
          </h3>

          <p className="text-neutral-500 mb-8 leading-relaxed">{description}</p>

          <div className="flex flex-col md:flex-row w-full md:justify-center md:items-center gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>

            <Button
              type="button"
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
    </div>,
    document.body,
  );
}
