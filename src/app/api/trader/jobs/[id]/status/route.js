import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

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

    switch (status) {
      case 'accept':
        jobUpdate.acceptedAt = now
        requestUpdate.status = 'ACCEPTED'
        break
      case 'reject':
        // Delete the job assignment and reset request status
        await db.jobAssignment.delete({ where: { id } })
        await db.serviceRequest.update({
          where: { id: job.serviceRequestId },
          data: { status: 'PENDING' }
        })
        return NextResponse.json({ message: 'Job declined' })
      case 'start':
        jobUpdate.startedAt = now
        requestUpdate.status = 'IN_PROGRESS'
        break
      case 'complete':
        jobUpdate.completedAt = now
        requestUpdate.status = 'COMPLETED'
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

    return NextResponse.json({ job: updatedJob })
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}


