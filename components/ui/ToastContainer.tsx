"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import Toast from "./Toast";

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={remove}
        />
      ))}
    </div>,
    document.body
  );
}
