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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const skip = (page - 1) * limit

    const where = {}

    // Filter by agent unless admin
    if (session.user.role !== 'ADMIN') {
      where.agentId = agentProfile.id
    }

    // Type filter
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        where.date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo)
      }
    }

    const [logs, total] = await Promise.all([
      db.agentDailyLog.findMany({
        where,
        include: {
          agent: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      db.agentDailyLog.count({ where })
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
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
    const {
      type,
      title,
      description,
      location,
      duration,
      date
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
        { error: 'Invalid activity type' },
        { status: 400 }
      )
    }

    const log = await db.agentDailyLog.create({
      data: {
        agentId: agentProfile.id,
        type: type.toUpperCase(),
        title,
        description: description || null,
        location: location || null,
        duration: duration ? parseInt(duration) : null,
        date: date ? new Date(date) : new Date()
      },
      include: {
        agent: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error('Error creating log:', error)
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}


