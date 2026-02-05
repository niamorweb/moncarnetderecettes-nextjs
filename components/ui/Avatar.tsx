"use client";

import { User } from "lucide-react";
import { useMemo } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
};

export default function Avatar({
  src = null,
  alt = "Avatar",
  name = "",
  size = "md",
}: AvatarProps) {
  const initials = useMemo(() => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [name]);

  const hasImage = src && src.length > 0;

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 shrink-0 ${sizeClasses[size]}`}
    >
      {hasImage ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User size={iconSizes[size]} className="text-neutral-400" />
      )}
    </div>
  );
}
