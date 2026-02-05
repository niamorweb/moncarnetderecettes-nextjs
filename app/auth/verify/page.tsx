"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/auth/verify?token=${encodeURIComponent(token)}`,
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(
            data.message || "Verification failed. The link may have expired.",
          );
          return;
        }

        setStatus("success");
        setMessage(
          data.message || "Your email has been verified successfully!",
        );
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl border border-neutral-200 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <Loader2 className="h-12 w-12 text-neutral-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Verifying your email
              </h1>
              <p className="text-neutral-500">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Email verified!
              </h1>
              <p className="text-neutral-500 mb-8">{message}</p>
              <Button
                href="/dashboard"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-3 font-medium transition"
              >
                Go to dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Verification failed
              </h1>
              <p className="text-neutral-500 mb-8">{message}</p>
              <Button
                href="/login"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-3 font-medium transition"
              >
                Go to sign in
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
