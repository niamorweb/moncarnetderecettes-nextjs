import type { Recipe } from "@/types/models/recipe";
import InfosBlock from "./InfosBlock";
import IngredientsStepsContainer from "./IngredientsStepsContainer";

interface FullContainerProps {
  recipe: Recipe;
  usernameHref?: string;
  showFloatingActions?: boolean;
}

export default function FullContainer({
  recipe,
  usernameHref,
  showFloatingActions = false,
}: FullContainerProps) {
  const baseClass =
    "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start";
  const containerClass = usernameHref ? baseClass : `${baseClass} pb-32`;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className={containerClass}>
        <InfosBlock recipe={recipe} username={usernameHref} />
        <IngredientsStepsContainer recipe={recipe} />
      </div>
    </div>
  );
}
