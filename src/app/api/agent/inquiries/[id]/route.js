import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function getAgentProfile(userId) {
  return db.agentProfile.findUnique({
    where: { userId }
  })
}

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const inquiry = await db.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            postcode: true,
            type: true,
            listingType: true,
            monthlyRent: true,
            salePrice: true,
            bedrooms: true,
            bathrooms: true,
            images: true
          }
        },
        agent: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        followUps: {
          orderBy: { createdAt: 'desc' }
        }
      }
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

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Find existing inquiry
    const existingInquiry = await db.inquiry.findUnique({
      where: { id }
    })

    if (!existingInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Check access
    if (session.user.role !== 'ADMIN') {
      const agentProfile = await getAgentProfile(session.user.id)
      if (!agentProfile || existingInquiry.agentId !== agentProfile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const {
      status,
      clientName,
      clientEmail,
      clientPhone,
      message,
      budget,
      preferredArea,
      notes,
      scheduledAt
    } = body

    // Build update data
    const updateData = {}

    if (status) {
      const validStatuses = ['OPEN', 'CONTACTED', 'MEETING_SCHEDULED', 'FOLLOW_UP', 'ACCEPTED', 'REJECTED', 'CLOSED']
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      updateData.status = status.toUpperCase()

      // Set closedAt when status is terminal
      if (['ACCEPTED', 'REJECTED', 'CLOSED'].includes(status.toUpperCase())) {
        updateData.closedAt = new Date()
      }
    }

    if (clientName !== undefined) updateData.clientName = clientName
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail
    if (clientPhone !== undefined) updateData.clientPhone = clientPhone
    if (message !== undefined) updateData.message = message
    if (budget !== undefined) updateData.budget = budget ? parseInt(budget) : null
    if (preferredArea !== undefined) updateData.preferredArea = preferredArea
    if (notes !== undefined) updateData.notes = notes
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null

    const inquiry = await db.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        property: {
          select: { id: true, name: true, address: true }
        },
        followUps: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Find existing inquiry
    const existingInquiry = await db.inquiry.findUnique({
      where: { id }
    })

    if (!existingInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Check access
    if (session.user.role !== 'ADMIN') {
      const agentProfile = await getAgentProfile(session.user.id)
      if (!agentProfile || existingInquiry.agentId !== agentProfile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    await db.inquiry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}


