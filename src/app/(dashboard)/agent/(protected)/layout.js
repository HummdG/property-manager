import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AgentProtectedLayout({ children }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // ADMINs can browse /agent/* freely
  if (session.user.role !== 'AGENT') {
    return <>{children}</>
  }

  const profile = await db.agentProfile.findUnique({
    where: { userId: session.user.id },
    select: { approvalStatus: true }
  })

  if (!profile || profile.approvalStatus === 'DRAFT') {
    redirect('/agent/setup')
  }

  if (profile.approvalStatus === 'SUBMITTED') {
    redirect('/agent/pending')
  }

  if (profile.approvalStatus === 'REJECTED') {
    redirect('/agent/setup?rejected=true')
  }

  return <>{children}</>
}
