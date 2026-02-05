import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export default function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] md:shadow-xl outline outline-neutral-100 ${className}`}
    >
      {children}
    </div>
  );
}
