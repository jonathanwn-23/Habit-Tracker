'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || (pathname.startsWith(path) && path !== '/dashboard')
  }

  const linkClass = (path: string) => 
    `block flex-1 md:flex-none rounded-lg md:px-4 py-2 text-center md:text-left text-sm font-medium transition-colors ${
      isActive(path) 
        ? 'bg-indigo-50 text-indigo-700 md:bg-zinc-100 md:text-zinc-900' 
        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
    }`

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-zinc-200 bg-white shrink-0">
        <div className="flex h-16 items-center px-6 border-b border-zinc-200">
          <h1 className="text-xl font-bold text-indigo-600">HabitTracker</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/habits" className={linkClass('/habits')}>
            Kelola Habit
          </Link>
          <Link href="/settings" className={linkClass('/settings')}>
            Pengaturan
          </Link>
        </nav>
        <div className="border-t border-zinc-200 p-4">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <nav className="flex items-center justify-around p-2">
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">🏠</span>
              <span className="text-[10px]">Beranda</span>
            </div>
          </Link>
          <Link href="/habits" className={linkClass('/habits')}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">🎯</span>
              <span className="text-[10px]">Habit</span>
            </div>
          </Link>
          <Link href="/settings" className={linkClass('/settings')}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">⚙️</span>
              <span className="text-[10px]">Setelan</span>
            </div>
          </Link>
        </nav>
      </div>
    </>
  )
}
