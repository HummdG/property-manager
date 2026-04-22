import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'
import { createNotification } from '@/lib/notifications'
import { agentReviewSchema } from '@/lib/validators'

export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const body = await request.json()
    const result = agentReviewSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 })
    }

    const { action, rejectionNote, infoRequestNote } = result.data

    const agent = await db.agentProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    if (!['SUBMITTED', 'PENDING_INFO'].includes(agent.approvalStatus)) {
      return NextResponse.json({ error: 'Agent profile is not pending review' }, { status: 400 })
    }

    if (action === 'APPROVE') {
      const updatedProfile = await db.agentProfile.update({
        where: { id },
        data: {
          approvalStatus: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          approvalNote: null,
          infoRequestNote: null,
        }
      })

      await createNotification({
        userId: agent.user.id,
        type: 'AGENT_APPROVED',
        title: 'Profile Approved',
        message: 'Your agent profile has been approved. You can now access the full platform.',
        link: '/agent',
        metadata: { agentProfileId: id }
      })

      await logEvent({
        type: 'AGENT_PROFILE_APPROVED',
        action: 'updated',
        entity: 'agentProfile',
        entityId: id,
        userId: session.user.id,
        metadata: { agentName: agent.user.name, agentEmail: agent.user.email }
      })

      return NextResponse.json({ profile: updatedProfile })
    }

    if (action === 'REQUEST_INFO') {
      const updatedProfile = await db.agentProfile.update({
        where: { id },
        data: {
          approvalStatus: 'PENDING_INFO',
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          infoRequestNote,
          approvalNote: null,
        }
      })

      await createNotification({
        userId: agent.user.id,
        type: 'AGENT_INFO_REQUESTED',
        title: 'Additional Information Required',
        message: infoRequestNote,
        link: '/agent/setup',
        metadata: { agentProfileId: id }
      })

      await logEvent({
        type: 'AGENT_PROFILE_INFO_REQUESTED',
        action: 'updated',
        entity: 'agentProfile',
        entityId: id,
        userId: session.user.id,
        metadata: { agentName: agent.user.name, agentEmail: agent.user.email, request: infoRequestNote }
      })

      return NextResponse.json({ profile: updatedProfile })
    }

    // REJECT
    const updatedProfile = await db.agentProfile.update({
      where: { id },
      data: {
        approvalStatus: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        approvalNote: rejectionNote,
      }
    })

    await createNotification({
      userId: agent.user.id,
      type: 'AGENT_REJECTED',
      title: 'Profile Rejected',
      message: rejectionNote,
      link: '/agent/setup',
      metadata: { agentProfileId: id }
    })

    await logEvent({
      type: 'AGENT_PROFILE_REJECTED',
      action: 'updated',
      entity: 'agentProfile',
      entityId: id,
      userId: session.user.id,
      metadata: { agentName: agent.user.name, agentEmail: agent.user.email, reason: rejectionNote }
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('POST /api/admin/agents/[id]/review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
