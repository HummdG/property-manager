import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantProfile = await db.tenantProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            postcode: true
          }
        }
      }
    })

    return NextResponse.json({
      profile: tenantProfile,
      property: tenantProfile?.property
    })
  } catch (error) {
    console.error('Error fetching tenant profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}



