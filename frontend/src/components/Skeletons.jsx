export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-10 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-8 w-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
