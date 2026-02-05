import { Package, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon = Package,
  title,
  description = "",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="p-6 bg-neutral-100 rounded-3xl mb-6">
        <Icon size={48} className="text-neutral-400" />
      </div>

      <h3 className="text-2xl font-black text-neutral-800 mb-2">{title}</h3>

      {description && (
        <p className="text-neutral-500 max-w-md mb-8">{description}</p>
      )}

      {action}
    </div>
  );
}
