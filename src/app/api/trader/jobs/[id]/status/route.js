import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'

export async function PATCH(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, rejectionReason } = body

    const job = await db.jobAssignment.findUnique({
      where: { id },
      include: { serviceRequest: true }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.traderId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    let jobUpdate = {}
    let requestUpdate = {}
    let eventType = ''

    switch (status) {
      case 'accept':
        jobUpdate.acceptedAt = now
        requestUpdate.status = 'ACCEPTED'
        eventType = 'JOB_ACCEPTED'
        break
      case 'reject':
        if (!rejectionReason || !rejectionReason.trim()) {
          return NextResponse.json(
            { error: 'Rejection reason is required' },
            { status: 400 }
          )
        }
        jobUpdate.rejectedAt = now
        jobUpdate.rejectionReason = rejectionReason.trim()
        requestUpdate.status = 'REJECTED'
        eventType = 'JOB_REJECTED'
        break
      case 'start':
        jobUpdate.startedAt = now
        requestUpdate.status = 'IN_PROGRESS'
        eventType = 'JOB_STARTED'
        break
      case 'complete':
        jobUpdate.completedAt = now
        requestUpdate.status = 'COMPLETED'
        eventType = 'JOB_COMPLETED'
        break
      default:
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const [updatedJob] = await Promise.all([
      db.jobAssignment.update({
        where: { id },
        data: jobUpdate
      }),
      db.serviceRequest.update({
        where: { id: job.serviceRequestId },
        data: requestUpdate
      })
    ])

    // Update trader's completed jobs count if completing
    if (status === 'complete') {
      await db.traderProfile.update({
        where: { userId: session.user.id },
        data: { completedJobs: { increment: 1 } }
      })
    }

    // Log the event
    await logEvent({
      type: eventType,
      action: status === 'reject' ? 'rejected' : status === 'accept' ? 'accepted' : status === 'start' ? 'started' : 'completed',
      entity: 'jobAssignment',
      entityId: id,
      userId: session.user.id,
      metadata: {
        serviceRequestId: job.serviceRequestId,
        serviceRequestTitle: job.serviceRequest.title,
        ...(rejectionReason && { rejectionReason: rejectionReason.trim() })
      }
    })

    return NextResponse.json({ job: updatedJob })
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}
