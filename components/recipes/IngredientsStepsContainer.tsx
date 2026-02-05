import type { Recipe } from "@/types/models/recipe";
import IngredientsBlock from "./IngredientsBlock";
import StepsBlock from "./StepsBlock";

interface IngredientsStepsContainerProps {
  recipe: Recipe;
}

export default function IngredientsStepsContainer({
  recipe,
}: IngredientsStepsContainerProps) {
  return (
    <div className="lg:col-span-7 space-y-10">
      <IngredientsBlock recipe={recipe} />
      <StepsBlock recipe={recipe} />
    </div>
  );
}
