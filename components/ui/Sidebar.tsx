import Link from 'next/link'

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center px-6 border-b border-zinc-200">
        <h1 className="text-xl font-bold text-indigo-600">HabitTracker</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        <Link href="/dashboard" className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
          Dashboard
        </Link>
        <Link href="/habits" className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
          Kelola Habit
        </Link>
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            Keluar
          </button>
        </form>
      </div>
    </div>
  )
}
