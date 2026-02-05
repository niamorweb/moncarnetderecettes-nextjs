import Link from "next/link";
import Button from "../ui/Button";

interface EmptyStateProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Votre carnet est vide",
  ctaLabel = "Ajouter ma première recette →",
  ctaHref = "/new-recipe",
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-neutral-200">
      <h3 className="text-2xl font-black mb-2">{title}</h3>

      <Link href={ctaHref} className="inline-block mt-6">
        <Button size="lg">{ctaLabel}</Button>
      </Link>
    </div>
  );
}
