"use client";

import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  variant?: "primary" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  isIcon?: boolean;
  children: ReactNode;
  href?: string;
}

const baseStyles =
  "font-semibold transition-all active:scale-95 inline-flex items-center justify-center gap-2 shrink-0 focus:outline-none";

const sizeStyles = {
  sm: "px-4 h-10 flex items-center justify-center text-sm rounded-lg gap-1.5",
  md: "px-6 h-12 flex items-center justify-center text-sm rounded-xl gap-2",
  lg: "px-8 h-16 flex items-center justify-center text-base rounded-xl gap-3",
};

const iconSizeStyles = {
  sm: "size-8 rounded-full !p-0",
  md: "size-10 rounded-full !p-0",
  lg: "size-12 rounded-full !p-0",
};

const variantStyles = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:bg-neutral-400 disabled:text-white disabled:cursor-not-allowed",
  outline:
    "bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-white focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 disabled:text-neutral-300 disabled:hover:bg-transparent disabled:cursor-not-allowed",
  secondary:
    "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:bg-orange-50 disabled:text-orange-300 disabled:border-orange-100 disabled:cursor-not-allowed",
  destructive:
    "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:bg-red-50 disabled:text-red-300 disabled:border-red-200 disabled:cursor-not-allowed",
};

export default function Button({
  to,
  variant = "primary",
  size = "md",
  isIcon = false,
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    baseStyles,
    isIcon ? iconSizeStyles[size] : sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
