import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'TRADER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const jobs = await db.jobAssignment.findMany({
      where: { traderId: session.user.id },
      include: {
        serviceRequest: {
          include: {
            property: {
              select: { id: true, name: true, address: true, city: true, postcode: true }
            },
            category: {
              select: { id: true, name: true }
            },
            requester: {
              select: { name: true, email: true, phone: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching trader jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

