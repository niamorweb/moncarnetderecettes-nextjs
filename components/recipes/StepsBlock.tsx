import { BookOpen } from "lucide-react";
import type { Recipe } from "@/types/models/recipe";

interface StepsBlockProps {
  recipe: Recipe;
}

export default function StepsBlock({ recipe }: StepsBlockProps) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-4 lg:mb-10">
        <div className="bg-orange-100 p-3 rounded-lg md:rounded-2xl text-orange-600">
          <BookOpen className="size-5 lg:size-6" />
        </div>
        <h2 className="text-xl lg:text-3xl font-black text-neutral-900 tracking-tight">
          Préparation
        </h2>
      </div>

      <div className="space-y-0 relative">
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-neutral-100 -z-10" />

        {recipe.steps.map((step, index) => (
          <div key={index} className="group flex gap-8 pb-12 last:pb-0">
            <div className="relative shrink-0">
              <div className="size-12 bg-white border-4 border-[#FAFAFA] rounded-2xl flex items-center justify-center text-lg font-black text-neutral-900 shadow-sm group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 z-10">
                {index + 1}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-neutral-600 font-medium leading-relaxed group-hover:text-neutral-900 transition-colors">
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
