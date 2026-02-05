"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
import { useState, useRef, useEffect, type ReactNode } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  label?: string;
  align?: "left" | "right";
  onSelect: (item: DropdownItem) => void;
  trigger?: ReactNode;
}

export default function Dropdown({
  items,
  label = "Options",
  align = "left",
  onSelect,
  trigger,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
      >
        {trigger || label}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 min-w-[180px] bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="py-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
