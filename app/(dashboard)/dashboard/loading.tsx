export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-zinc-200 rounded-lg"></div>
        <div className="mt-2 h-4 w-64 bg-zinc-100 rounded-md"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100"></div>
              <div>
                <div className="h-5 w-32 bg-zinc-200 rounded-md mb-2"></div>
                <div className="h-4 w-48 bg-zinc-100 rounded-md"></div>
              </div>
            </div>
            <div className="h-8 w-16 bg-zinc-100 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
