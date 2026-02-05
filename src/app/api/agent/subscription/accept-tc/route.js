import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { accepted } = body

    if (!accepted) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Get or create agent profile
    let agentProfile = await db.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!agentProfile) {
      agentProfile = await db.agentProfile.create({
        data: {
          userId: session.user.id,
          tcAcceptedAt: new Date()
        }
      })
    } else {
      agentProfile = await db.agentProfile.update({
        where: { userId: session.user.id },
        data: {
          tcAcceptedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      tcAcceptedAt: agentProfile.tcAcceptedAt
    })
  } catch (error) {
    console.error('Error accepting T&C:', error)
    return NextResponse.json({ error: 'Failed to accept terms and conditions' }, { status: 500 })
  }
}

