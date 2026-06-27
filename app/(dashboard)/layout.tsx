import { Sidebar } from '@/components/ui/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-[100dvh] flex-col md:flex-row bg-cyan-500 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
        {children}
      </main>
    </div>
  )
}
