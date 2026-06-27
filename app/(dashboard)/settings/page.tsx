import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile, signOut } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ambil data profil publik untuk mendapatkan full_name
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name || user.user_metadata?.full_name || ''
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || ''
  const initials = fullName ? fullName.substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pengaturan</h1>
        <p className="mt-2 text-zinc-500">Kelola informasi profil dan akun Anda.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50">
            <h2 className="text-base font-semibold text-zinc-900">Profil Saya</h2>
            <p className="text-sm text-zinc-500">Informasi ini akan ditampilkan di dalam aplikasi.</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <div className="text-lg font-medium text-zinc-900">{fullName || 'Pengguna Tanpa Nama'}</div>
                <div className="text-sm text-zinc-500">{user.email}</div>
              </div>
            </div>

            <div className="mt-8">
              <form action={updateProfile} className="max-w-md">
                <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700">
                  Nama Lengkap
                </label>
                <div className="mt-2 flex gap-3">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    defaultValue={fullName}
                    className="block w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-red-100 bg-red-50">
            <h2 className="text-base font-semibold text-red-800">Zona Berbahaya</h2>
            <p className="text-sm text-red-600/80">Aksi ini akan mempengaruhi sesi login Anda saat ini.</p>
          </div>
          <div className="p-6">
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 shadow-sm"
              >
                Logout (Keluar)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
