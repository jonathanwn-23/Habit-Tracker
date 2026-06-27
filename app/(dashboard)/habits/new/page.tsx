import { createHabit } from '../actions'
import Link from 'next/link'

export default function NewHabitPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Tambah Habit Baru</h1>
        <Link href="/habits" className="text-sm text-zinc-500 hover:text-zinc-900">
          Batal
        </Link>
      </div>

      <form action={createHabit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Nama Habit</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Contoh: Olahraga 30 Menit"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700">Deskripsi (Opsional)</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-xl border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Tambahkan detail jika perlu"
          />
        </div>

        {/* Input color di-hide dan default disamakan karena sekarang semua habit berwarna hijau */}
        <input type="hidden" name="color" value="#40c463" />

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Simpan Habit
        </button>
      </form>
    </div>
  )
}
