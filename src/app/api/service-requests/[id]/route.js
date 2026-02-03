import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const serviceRequest = await db.serviceRequest.findUnique({
      where: { id },
      include: {
        property: {
          select: { id: true, name: true, address: true, city: true, ownerId: true }
        },
        category: true,
        requester: {
          select: { id: true, name: true, email: true, phone: true }
        },
        jobAssignment: {
          include: {
            trader: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        payments: true
      }
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    return NextResponse.json({ serviceRequest })
  } catch (error) {
    console.error('Error fetching service request:', error)
    return NextResponse.json({ error: 'Failed to fetch service request' }, { status: 500 })
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
    const { status, priority, notes, traderId } = body

    const existing = await db.serviceRequest.findUnique({
      where: { id },
      include: {
        property: true,
        jobAssignment: true
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    // Check permissions
    const isOwner = existing.property.ownerId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    const isAssignedTrader = existing.jobAssignment?.traderId === session.user.id

    if (!isOwner && !isAdmin && !isAssignedTrader) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update the service request
    const updateData = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (notes !== undefined) updateData.notes = notes

    // Handle trader assignment
    if (traderId && (isOwner || isAdmin)) {
      // Create or update job assignment
      if (existing.jobAssignment) {
        await db.jobAssignment.update({
          where: { serviceRequestId: id },
          data: { traderId }
        })
      } else {
        await db.jobAssignment.create({
          data: {
            serviceRequestId: id,
            traderId
          }
        })
      }
      updateData.status = 'ASSIGNED'
    }

    const serviceRequest = await db.serviceRequest.update({
      where: { id },
      data: updateData,
      include: {
        property: { select: { name: true } },
        category: { select: { name: true } },
        jobAssignment: {
          include: {
            trader: { select: { name: true, email: true } }
          }
        }
      }
    })

    return NextResponse.json({ serviceRequest })
  } catch (error) {
    console.error('Error updating service request:', error)
    return NextResponse.json({ error: 'Failed to update service request' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await db.serviceRequest.findUnique({
      where: { id },
      include: { property: true }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    const isOwner = existing.property.ownerId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    const isRequester = existing.requesterId === session.user.id

    if (!isOwner && !isAdmin && !isRequester) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.serviceRequest.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Service request deleted' })
  } catch (error) {
    console.error('Error deleting service request:', error)
    return NextResponse.json({ error: 'Failed to delete service request' }, { status: 500 })
  }
}

