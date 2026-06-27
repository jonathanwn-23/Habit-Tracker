'use client'

import Image from 'next/image'
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
        ? 'bg-cyan-500 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-slate-200 bg-white shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="HabitTracker Logo" 
              width={32} 
              height={32} 
              className="rounded-lg shadow-sm"
              priority
            />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">HabitTracker</h1>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 px-4 py-6">
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
        <div className="border-t border-slate-100 p-4 mb-4">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors">
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
