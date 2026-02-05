import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <DashboardShell user={{
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role
    }}>
      {children}
    </DashboardShell>
  )
}

