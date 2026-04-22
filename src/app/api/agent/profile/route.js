import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'
import { updateAgentProfileSchema } from '@/lib/validators'

async function getOrCreateAgentProfile(userId) {
  let profile = await db.agentProfile.findUnique({
    where: { userId },
    include: { documents: { orderBy: { uploadedAt: 'desc' } } }
  })
  if (!profile) {
    profile = await db.agentProfile.create({
      data: { userId },
      include: { documents: { orderBy: { uploadedAt: 'desc' } } }
    })
  }
  return profile
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await getOrCreateAgentProfile(session.user.id)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true, image: true }
    })

    return NextResponse.json({ profile, user })
  } catch (error) {
    console.error('GET /api/agent/profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const result = updateAgentProfileSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 })
    }

    const { phone, ...profileData } = result.data

    // Strip undefined values so we only update provided fields
    const profileUpdate = Object.fromEntries(
      Object.entries(profileData).filter(([, v]) => v !== undefined)
    )

    const [profile] = await Promise.all([
      db.agentProfile.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, ...profileUpdate },
        update: profileUpdate,
      }),
      phone !== undefined
        ? db.user.update({ where: { id: session.user.id }, data: { phone } })
        : Promise.resolve()
    ])

    await logEvent({
      type: 'AGENT_PROFILE_UPDATED',
      action: 'updated',
      entity: 'agentProfile',
      entityId: profile.id,
      userId: session.user.id,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('PATCH /api/agent/profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
