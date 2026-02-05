import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "premium";
  size?: "sm" | "md";
  children: ReactNode;
}

const variantClasses = {
  default: "bg-neutral-100 text-neutral-600 border-neutral-200",
  primary: "bg-neutral-900 text-white border-neutral-900",
  secondary: "bg-orange-50 text-orange-700 border-orange-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  premium:
    "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

export default function Badge({
  variant = "default",
  size = "md",
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
