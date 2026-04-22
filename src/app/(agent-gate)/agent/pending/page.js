import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Clock, Mail, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth'

export const metadata = { title: 'Profile Under Review — GoFor Properties' }

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(date))
}

export default async function AgentPendingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'AGENT') redirect('/login')

  const profile = await db.agentProfile.findUnique({
    where: { userId: session.user.id },
    select: { approvalStatus: true, submittedAt: true }
  })

  if (!profile || profile.approvalStatus === 'DRAFT') redirect('/agent/setup')
  if (profile.approvalStatus === 'APPROVED') redirect('/agent')
  if (profile.approvalStatus === 'REJECTED') redirect('/agent/setup?rejected=true')

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-4 bg-cream border border-wire p-8 text-center space-y-6">
        <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mx-auto">
          <Clock className="h-6 w-6 text-bronze" />
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog mb-1">Agent Portal</p>
          <h1 className="font-display text-2xl font-light text-sable">Profile Under Review</h1>
        </div>

        <div className="border-t border-b border-wire py-4 space-y-1">
          <p className="text-[0.65rem] uppercase tracking-wide text-fog">Submitted on</p>
          <p className="text-[0.8125rem] text-sable">{formatDate(profile.submittedAt)}</p>
        </div>

        <p className="text-[0.75rem] text-fog leading-relaxed">
          Your agent profile is being reviewed by our admin team. This typically takes 1–2 business days.
          You will receive a notification once a decision has been made.
        </p>

        <div className="flex items-center gap-2 bg-linen border border-wire p-3 text-left">
          <Mail className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
          <p className="text-[0.7rem] text-fog">
            Questions? Contact us at{' '}
            <a href="mailto:support@goforproperties.com" className="text-bronze hover:underline">
              support@goforproperties.com
            </a>
          </p>
        </div>

        <form action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[0.75rem] uppercase tracking-[0.1em] font-medium text-fog hover:text-sable border border-wire bg-cream hover:bg-linen transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
