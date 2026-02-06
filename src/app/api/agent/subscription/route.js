import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function getAgentProfile(userId) {
  return db.agentProfile.findUnique({
    where: { userId },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  })
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentProfile = await getAgentProfile(session.user.id)

    // Get all available plans
    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      subscription: agentProfile?.subscription || null,
      plans,
      tcAccepted: !!agentProfile?.tcAcceptedAt
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
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

    // Check if T&C accepted
    if (!agentProfile.tcAcceptedAt) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions before subscribing' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { planId, billingPeriod = 'monthly' } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing required field: planId' },
        { status: 400 }
      )
    }

    // Get the plan
    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId }
    })

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 })
    }

    // Check for existing subscription
    const existingSubscription = await db.agentSubscription.findUnique({
      where: { agentId: agentProfile.id }
    })

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + (billingPeriod === 'yearly' ? 12 : 1))

    if (existingSubscription) {
      // Update existing subscription
      const subscription = await db.agentSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false
        },
        include: { plan: true }
      })

      return NextResponse.json({ subscription })
    }

    // Create new subscription with trial
    const trialEnd = new Date(now)
    trialEnd.setDate(trialEnd.getDate() + 14) // 14-day trial

    const subscription = await db.agentSubscription.create({
      data: {
        agentId: agentProfile.id,
        planId,
        status: 'TRIAL',
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        trialEndsAt: trialEnd
      },
      include: { plan: true }
    })

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}

// Cancel subscription
export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentProfile = await getAgentProfile(session.user.id)
    if (!agentProfile?.subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    // Mark to cancel at period end
    const subscription = await db.agentSubscription.update({
      where: { id: agentProfile.subscription.id },
      data: {
        cancelAtPeriodEnd: true
      },
      include: { plan: true }
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}


