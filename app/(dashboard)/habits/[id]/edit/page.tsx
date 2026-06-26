import { updateHabit } from '../../actions'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditHabitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: habit } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single()

  if (!habit) {
    notFound()
  }

  const updateHabitWithId = updateHabit.bind(null, id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Edit Habit</h1>
        <Link href="/habits" className="text-sm text-zinc-500 hover:text-zinc-900">
          Batal
        </Link>
      </div>

      <form action={updateHabitWithId} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Nama Habit</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            defaultValue={habit.name}
            className="mt-1 block w-full rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700">Deskripsi (Opsional)</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            defaultValue={habit.description || ''}
            className="mt-1 block w-full rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-zinc-700">Warna</label>
          <input
            type="color"
            name="color"
            id="color"
            defaultValue={habit.color || '#6366f1'}
            className="mt-1 block h-10 w-full cursor-pointer rounded-xl border border-zinc-300 p-1"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
