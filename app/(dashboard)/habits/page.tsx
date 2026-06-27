import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { archiveHabit, restoreHabit } from './actions'

export default async function HabitsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const resolvedSearchParams = await searchParams
  const isArchivedView = resolvedSearchParams.archived === 'true'

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user?.id)
    .eq('is_archived', isArchivedView)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isArchivedView ? 'Arsip Habit' : 'Kelola Habit'}
          </h1>
          <p className="text-sm text-cyan-50 mt-1">
            {isArchivedView 
              ? 'Daftar habit yang telah Anda arsipkan.' 
              : 'Daftar habit aktif yang Anda pantau setiap hari.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isArchivedView ? (
            <Link
              href="/habits"
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              Kembali ke Habit Aktif
            </Link>
          ) : (
            <>
              <Link
                href="/habits?archived=true"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
              >
                Lihat Arsip
              </Link>
              <Link
                href="/habits/new"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                + Tambah Habit
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!habits || habits.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-sm text-slate-500">
              {isArchivedView 
                ? 'Tidak ada habit di dalam arsip.' 
                : 'Belum ada habit. Mulai buat sekarang!'}
            </p>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="group rounded-2xl border border-transparent bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: '#40c463' }}
                  />
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{habit.name}</h3>
                </div>
                {habit.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{habit.description}</p>
                )}
              </div>
              
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 opacity-70 transition-opacity group-hover:opacity-100">
                {!isArchivedView ? (
                  <>
                    <Link
                      href={`/habits/${habit.id}/edit`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <form action={archiveHabit.bind(null, habit.id)}>
                      <button
                        type="submit"
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        Arsipkan
                      </button>
                    </form>
                  </>
                ) : (
                  <form action={restoreHabit.bind(null, habit.id)}>
                    <button
                      type="submit"
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      Pulihkan
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
