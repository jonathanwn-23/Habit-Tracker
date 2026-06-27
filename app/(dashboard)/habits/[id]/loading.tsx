export default function HabitDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 bg-zinc-200 rounded mb-4"></div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 shadow-sm"></div>
            <div>
              <div className="h-8 w-48 bg-zinc-200 rounded-lg mb-2"></div>
              <div className="h-4 w-64 bg-zinc-100 rounded"></div>
            </div>
          </div>
        </div>
        <div className="h-10 w-24 bg-zinc-200 rounded-full"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 bg-zinc-100 rounded mb-2"></div>
            <div className="h-10 w-16 bg-zinc-200 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Calendar Heatmap Skeleton */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-64 flex flex-col">
        <div className="h-6 w-32 bg-zinc-200 rounded-lg mb-6"></div>
        <div className="flex-1 bg-zinc-50 rounded-xl border border-zinc-100"></div>
      </div>
    </div>
  )
}
