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

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    // Get all platforms
    const platforms = await db.thirdPartyPlatform.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    // If propertyId provided, get listings for that property
    let listings = []
    if (propertyId) {
      listings = await db.propertyListing.findMany({
        where: { propertyId },
        include: {
          platform: true,
          property: {
            select: { id: true, name: true, address: true }
          }
        }
      })
    }

    return NextResponse.json({ platforms, listings })
  } catch (error) {
    console.error('Error fetching third-party listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentProfile = await getAgentProfile(session.user.id)
    if (!agentProfile) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    // Check subscription for third-party listing limits
    const subscription = await db.agentSubscription.findUnique({
      where: { agentId: agentProfile.id },
      include: { plan: true }
    })

    const body = await request.json()
    const { propertyId, platformId, externalId, listingUrl, monthlyFee } = body

    if (!propertyId || !platformId) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, platformId' },
        { status: 400 }
      )
    }

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Verify platform exists
    const platform = await db.thirdPartyPlatform.findUnique({
      where: { id: platformId }
    })

    if (!platform || !platform.isActive) {
      return NextResponse.json({ error: 'Platform not found or inactive' }, { status: 404 })
    }

    // Check if listing already exists
    const existingListing = await db.propertyListing.findUnique({
      where: {
        propertyId_platformId: {
          propertyId,
          platformId
        }
      }
    })

    if (existingListing) {
      return NextResponse.json(
        { error: 'Property is already listed on this platform' },
        { status: 409 }
      )
    }

    // Check subscription limits
    if (subscription?.plan) {
      const currentListingsCount = await db.propertyListing.count({
        where: {
          property: { ownerId: property.ownerId }
        }
      })

      if (subscription.plan.maxThirdPartyPlatforms > 0 &&
          currentListingsCount >= subscription.plan.maxThirdPartyPlatforms) {
        return NextResponse.json(
          { error: 'You have reached your third-party listing limit. Please upgrade your plan.' },
          { status: 403 }
        )
      }
    }

    const listing = await db.propertyListing.create({
      data: {
        propertyId,
        platformId,
        externalId: externalId || null,
        listingUrl: listingUrl || null,
        monthlyFee: monthlyFee || platform.perListingFee || 0
      },
      include: {
        platform: true,
        property: {
          select: { id: true, name: true, address: true }
        }
      }
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listing ID' }, { status: 400 })
    }

    const listing = await db.propertyListing.findUnique({
      where: { id: listingId },
      include: { property: true }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check access (owner of property or admin)
    if (session.user.role !== 'ADMIN' && listing.property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.propertyListing.delete({
      where: { id: listingId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}

