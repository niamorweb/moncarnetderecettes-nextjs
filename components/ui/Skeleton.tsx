interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

const variantClasses = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "rounded-xl",
};

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width = "100%",
  height = "1rem",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}
