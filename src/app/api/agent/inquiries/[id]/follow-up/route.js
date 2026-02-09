import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'

async function getAgentProfile(userId) {
  return db.agentProfile.findUnique({
    where: { userId }
  })
}

export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: inquiryId } = await params
    const body = await request.json()

    // Find existing inquiry
    const inquiry = await db.inquiry.findUnique({
      where: { id: inquiryId }
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Check access
    if (session.user.role !== 'ADMIN') {
      const agentProfile = await getAgentProfile(session.user.id)
      if (!agentProfile || inquiry.agentId !== agentProfile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const {
      type,
      title,
      description,
      outcome,
      scheduledAt,
      notes
    } = body

    // Validation
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['CALL', 'VIEWING', 'MEETING', 'SITE_VISIT', 'PAPERWORK', 'OTHER']
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid follow-up type' },
        { status: 400 }
      )
    }

    // Create follow-up
    const followUp = await db.inquiryFollowUp.create({
      data: {
        inquiryId,
        type: type.toUpperCase(),
        title,
        description: description || null,
        outcome: outcome || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes: notes || null
      }
    })

    // Update inquiry status if needed
    if (scheduledAt && inquiry.status === 'OPEN') {
      await db.inquiry.update({
        where: { id: inquiryId },
        data: {
          status: type.toUpperCase() === 'MEETING' ? 'MEETING_SCHEDULED' : 'FOLLOW_UP',
          scheduledAt: new Date(scheduledAt)
        }
      })
    }

    // If outcome is acceptance or rejection, update inquiry status
    if (outcome) {
      const outcomeUpper = outcome.toUpperCase()
      if (outcomeUpper === 'ACCEPTED' || outcomeUpper === 'DEAL_CLOSED') {
        await db.inquiry.update({
          where: { id: inquiryId },
          data: { status: 'ACCEPTED', closedAt: new Date() }
        })
      } else if (outcomeUpper === 'REJECTED' || outcomeUpper === 'CLIENT_DECLINED') {
        await db.inquiry.update({
          where: { id: inquiryId },
          data: { status: 'REJECTED', closedAt: new Date() }
        })
      }
    }

    await logEvent({
      type: 'FOLLOW_UP_CREATED',
      action: 'created',
      entity: 'inquiryFollowUp',
      entityId: followUp.id,
      userId: session.user.id,
      metadata: { inquiryId, title, type: type.toUpperCase(), outcome: outcome || null }
    })

    return NextResponse.json({ followUp }, { status: 201 })
  } catch (error) {
    console.error('Error creating follow-up:', error)
    return NextResponse.json({ error: 'Failed to create follow-up' }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: inquiryId } = await params

    // Find existing inquiry
    const inquiry = await db.inquiry.findUnique({
      where: { id: inquiryId }
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Check access
    if (session.user.role !== 'ADMIN') {
      const agentProfile = await getAgentProfile(session.user.id)
      if (!agentProfile || inquiry.agentId !== agentProfile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const followUps = await db.inquiryFollowUp.findMany({
      where: { inquiryId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ followUps })
  } catch (error) {
    console.error('Error fetching follow-ups:', error)
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 })
  }
}


