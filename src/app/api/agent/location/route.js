import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function getAgentProfile(userId) {
  return db.agentProfile.findUnique({
    where: { userId }
  })
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentProfile = await getAgentProfile(session.user.id)
    if (!agentProfile && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where = {}

    // Filter by agent unless admin
    if (session.user.role !== 'ADMIN') {
      where.agentId = agentProfile.id
    }

    // Date filter - default to today
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    where.timestamp = {
      gte: startOfDay,
      lte: endOfDay
    }

    const locations = await db.agentLocationLog.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      take: limit
    })

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let agentProfile = await getAgentProfile(session.user.id)
    
    // Auto-create agent profile if doesn't exist
    if (!agentProfile) {
      agentProfile = await db.agentProfile.create({
        data: { userId: session.user.id }
      })
    }

    const body = await request.json()
    const { latitude, longitude, address, accuracy } = body

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude' },
        { status: 400 }
      )
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      )
    }

    const location = await db.agentLocationLog.create({
      data: {
        agentId: agentProfile.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || null,
        accuracy: accuracy ? parseFloat(accuracy) : null
      }
    })

    return NextResponse.json({ location }, { status: 201 })
  } catch (error) {
    console.error('Error recording location:', error)
    return NextResponse.json({ error: 'Failed to record location' }, { status: 500 })
  }
}

// Batch location upload
export async function PUT(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let agentProfile = await getAgentProfile(session.user.id)
    
    if (!agentProfile) {
      agentProfile = await db.agentProfile.create({
        data: { userId: session.user.id }
      })
    }

    const body = await request.json()
    const { locations } = body

    if (!Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty locations array' },
        { status: 400 }
      )
    }

    // Validate and prepare data
    const validLocations = locations.filter(loc =>
      loc.latitude !== undefined &&
      loc.longitude !== undefined &&
      loc.latitude >= -90 && loc.latitude <= 90 &&
      loc.longitude >= -180 && loc.longitude <= 180
    ).map(loc => ({
      agentId: agentProfile.id,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
      address: loc.address || null,
      accuracy: loc.accuracy ? parseFloat(loc.accuracy) : null,
      timestamp: loc.timestamp ? new Date(loc.timestamp) : new Date()
    }))

    if (validLocations.length === 0) {
      return NextResponse.json(
        { error: 'No valid locations provided' },
        { status: 400 }
      )
    }

    const result = await db.agentLocationLog.createMany({
      data: validLocations
    })

    return NextResponse.json({
      success: true,
      count: result.count
    }, { status: 201 })
  } catch (error) {
    console.error('Error batch recording locations:', error)
    return NextResponse.json({ error: 'Failed to record locations' }, { status: 500 })
  }
}

