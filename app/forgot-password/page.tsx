"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import {
  BookOpen,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: result.data.email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.message || "Something went wrong. Please try again.",
        );
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl border border-neutral-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-neutral-900">
              <BookOpen className="h-8 w-8" />
              <span className="text-2xl font-bold">MyCook</span>
            </Link>
          </div>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Check your email
              </h1>
              <p className="text-neutral-500 mb-8">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-neutral-700">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-900 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
                Forgot your password?
              </h1>
              <p className="text-neutral-500 text-center mb-8">
                Enter your email and we&apos;ll send you a reset link
              </p>

              {/* Server Error */}
              {serverError && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setServerError("");
                      }}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border ${
                        error ? "border-red-400" : "border-neutral-300"
                      } bg-white py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition`}
                    />
                  </div>
                  {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-3 font-medium transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <p className="mt-8 text-center text-sm text-neutral-500">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-neutral-900 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
