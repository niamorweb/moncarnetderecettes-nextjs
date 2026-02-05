"use client";

import { ToastProvider } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import AuthGuard from "@/components/global/AuthGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
      <ToastContainer />
    </ToastProvider>
  );
}
