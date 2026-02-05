export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white border-2 border-transparent rounded-[2rem] overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-neutral-200 rounded" />
        <div className="h-5 w-3/4 bg-neutral-200 rounded" />
        <div className="flex gap-3">
          <div className="h-4 w-12 bg-neutral-200 rounded" />
          <div className="h-4 w-12 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}
