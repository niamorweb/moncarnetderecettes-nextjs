"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Clock, RefreshCw, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

const COOLDOWN_SECONDS = 60;

export default function ConfirmYourEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || loading || !email) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend. Please try again.");
        return;
      }

      setMessage("Verification email sent!");
      setCooldown(COOLDOWN_SECONDS);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cooldown, loading, email]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl border border-neutral-200 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-neutral-100 p-4">
              <Mail className="h-10 w-10 text-neutral-900" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Check your email
          </h1>
          <p className="text-neutral-500 mb-2">
            We&apos;ve sent a verification link to
          </p>
          {email && (
            <p className="font-medium text-neutral-900 mb-6">{email}</p>
          )}
          <p className="text-neutral-500 text-sm mb-8">
            Click the link in the email to verify your account. If you
            don&apos;t see it, check your spam folder.
          </p>

          {/* Success / Error Messages */}
          {message && (
            <p className="mb-4 text-sm text-green-600 font-medium">{message}</p>
          )}
          {error && (
            <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          {/* Resend Button */}
          <Button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-3 font-medium transition disabled:opacity-50 mb-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </span>
            ) : cooldown > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Resend in {cooldown}s
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Resend verification email
              </span>
            )}
          </Button>

          {/* Login Link */}
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
