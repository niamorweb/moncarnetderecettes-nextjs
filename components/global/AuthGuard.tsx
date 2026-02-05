"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const PUBLIC_PAGES = ["/login", "/signup", "/", "/forgot-password"];

function isPublicPath(path: string): boolean {
  const normalized = path.replace(/\/$/, "") || "/";
  if (PUBLIC_PAGES.includes(normalized)) return true;
  if (path.startsWith("/u/")) return true;
  if (path.startsWith("/auth/verify")) return true;
  if (path.startsWith("/confirm-your-email")) return true;
  return false;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const path = pathname.replace(/\/$/, "") || "/";

      if (isAuthenticated) {
        if (user?.isEmailVerified === false) {
          router.replace("/confirm-your-email");
          setIsChecking(false);
          return;
        }
        if (path === "/login" || path === "/signup") {
          router.replace("/dashboard");
          setIsChecking(false);
          return;
        }
        setIsChecking(false);
        return;
      }

      // Try refresh
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();
        const decoded: any = jwtDecode(data.access_token);

        setAuth(data.access_token, {
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          isEmailVerified: decoded.isEmailVerified,
          isPremium: decoded.isPremium,
          premiumEndsAt: decoded.premiumEndsAt ?? null,
        });

        if (decoded.isEmailVerified === false) {
          router.replace("/confirm-your-email");
          setIsChecking(false);
          return;
        }

        if (path === "/login" || path === "/signup") {
          router.replace("/dashboard");
          setIsChecking(false);
          return;
        }
      } catch {
        logout();
        if (!isPublicPath(pathname)) {
          router.replace("/login");
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname]);

  if (isChecking && !isPublicPath(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return <>{children}</>;
}
