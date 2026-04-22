import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'
import { notifyAdmins } from '@/lib/notifications'

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await db.agentProfile.findUnique({
      where: { userId: session.user.id },
      include: { documents: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    if (profile.approvalStatus === 'APPROVED') {
      return NextResponse.json({ error: 'Profile is already approved' }, { status: 400 })
    }

    if (profile.approvalStatus === 'SUBMITTED') {
      return NextResponse.json({ error: 'Profile is already pending review' }, { status: 400 })
    }

    if (profile.documents.length === 0) {
      return NextResponse.json({ error: 'Please upload at least one verification document' }, { status: 400 })
    }

    if (!profile.companyName?.trim()) {
      return NextResponse.json({ error: 'Company name is required before submitting' }, { status: 400 })
    }

    if (!profile.licenseNumber?.trim()) {
      return NextResponse.json({ error: 'License number is required before submitting' }, { status: 400 })
    }

    const updatedProfile = await db.agentProfile.update({
      where: { id: profile.id },
      data: {
        approvalStatus: 'SUBMITTED',
        submittedAt: new Date(),
        approvalNote: null,
      }
    })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    })

    await notifyAdmins({
      type: 'AGENT_SUBMITTED',
      title: 'New Agent Profile Submitted',
      message: `${user?.name || 'An agent'} (${user?.email}) has submitted their profile for review.`,
      link: `/admin/agents/${profile.id}`,
      metadata: { agentProfileId: profile.id, agentUserId: session.user.id }
    })

    await logEvent({
      type: 'AGENT_PROFILE_SUBMITTED',
      action: 'updated',
      entity: 'agentProfile',
      entityId: profile.id,
      userId: session.user.id,
      metadata: { agentName: user?.name, agentEmail: user?.email }
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('POST /api/agent/profile/submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
