import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth'
import { db } from '@/lib/db'
import { LogOut } from 'lucide-react'
import AgentSetupForm from '@/components/agent/AgentSetupForm'

export const metadata = { title: 'Profile Setup — GoFor Properties' }

export default async function AgentSetupPage({ searchParams }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'AGENT') redirect('/login')

  const resolvedParams = await searchParams

  const profile = await db.agentProfile.findUnique({
    where: { userId: session.user.id },
    include: { documents: { orderBy: { uploadedAt: 'desc' } } }
  })

  // Already approved — send them to the dashboard
  if (profile?.approvalStatus === 'APPROVED') {
    redirect('/agent')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, image: true }
  })

  const isRejected = resolvedParams?.rejected === 'true' || profile?.approvalStatus === 'REJECTED'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      <div className="border-b border-wire pb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
          <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">
            Profile Setup
          </h1>
          <p className="text-[0.75rem] text-fog mt-1">
            Complete your profile and upload the required documents to submit for admin approval.
          </p>
        </div>
        <form action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}>
          <button
            type="submit"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium text-fog hover:text-sable border border-wire bg-cream hover:bg-linen transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </form>
      </div>

      <AgentSetupForm
        initialProfile={profile ? {
          ...profile,
          documents: profile.documents,
          experienceSince: profile.experienceSince?.toISOString() ?? null,
        } : null}
        initialUser={user}
        isRejected={isRejected}
      />
    </div>
  )
}
