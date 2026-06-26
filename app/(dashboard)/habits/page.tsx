import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { archiveHabit } from './actions'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user?.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Kelola Habit</h1>
        <Link
          href="/habits/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          + Tambah Habit
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!habits || habits.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <p className="text-sm text-zinc-500">Belum ada habit. Mulai buat sekarang!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: habit.color || '#6366f1' }}
                  />
                  <h3 className="font-semibold text-zinc-900">{habit.name}</h3>
                </div>
              </div>
              {habit.description && (
                <p className="mt-2 text-sm text-zinc-500">{habit.description}</p>
              )}
              
              <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
                <Link
                  href={`/habits/${habit.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </Link>
                <form action={archiveHabit.bind(null, habit.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Arsipkan
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
