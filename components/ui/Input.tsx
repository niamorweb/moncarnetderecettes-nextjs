"use client";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  className?: string;
  isTextArea?: boolean;
  disabled?: boolean;
  hasIcon?: boolean;
}

const baseClass =
  "w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all";

export default function Input({
  value,
  onChange,
  placeholder = "",
  autoComplete = "",
  type = "text",
  className = "",
  isTextArea = false,
  disabled = false,
  hasIcon = false,
}: InputProps) {
  const computedClass = `${baseClass} ${className} ${hasIcon ? "pl-11" : ""}`.trim();

  if (isTextArea) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={computedClass}
        disabled={disabled}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      type={type}
      className={computedClass}
      disabled={disabled}
    />
  );
}
