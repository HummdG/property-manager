import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const property = await db.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        tenantProfiles: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true }
            }
          }
        },
        serviceRequests: {
          include: {
            category: true,
            requester: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        documents: {
          select: { id: true, type: true, fileName: true, fileUrl: true, fileSize: true, uploadedAt: true }
        }
      }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check access
    if (session.user.role !== 'ADMIN' && property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await db.property.findUnique({
      where: { id },
      include: {
        documents: { select: { type: true } }
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, address, city, postcode, country, type, listingType, bedrooms, bathrooms, squareFeet, description, monthlyRent, salePrice, isListed } = body

    // Enforce document upload before listing
    if (isListed === true && !existing.isListed) {
      const docTypes = existing.documents.map(d => d.type)
      const hasDeed = docTypes.includes('DEED')
      const hasNoc = docTypes.includes('NOC')

      if (!hasDeed || !hasNoc) {
        const missing = []
        if (!hasDeed) missing.push('Title Deed')
        if (!hasNoc) missing.push('NOC')
        return NextResponse.json(
          { error: `Cannot list property without uploading: ${missing.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const property = await db.property.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(city && { city }),
        ...(postcode && { postcode }),
        ...(country && { country }),
        ...(type && { type }),
        ...(listingType && { listingType }),
        ...(bedrooms !== undefined && { bedrooms: bedrooms ? parseInt(bedrooms) : null }),
        ...(bathrooms !== undefined && { bathrooms: bathrooms ? parseInt(bathrooms) : null }),
        ...(squareFeet !== undefined && { squareFeet: squareFeet ? parseInt(squareFeet) : null }),
        ...(description !== undefined && { description }),
        ...(monthlyRent !== undefined && { monthlyRent: monthlyRent ? parseInt(monthlyRent) : null }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseInt(salePrice) : null }),
        ...(isListed !== undefined && { isListed })
      }
    })

    // Log appropriate event
    if (isListed === true && !existing.isListed) {
      await logEvent({
        type: 'PROPERTY_LISTED',
        action: 'listed',
        entity: 'property',
        entityId: id,
        userId: session.user.id,
        metadata: { name: property.name }
      })
    } else {
      await logEvent({
        type: 'PROPERTY_UPDATED',
        action: 'updated',
        entity: 'property',
        entityId: id,
        userId: session.user.id,
        metadata: { name: property.name }
      })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await db.property.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.property.delete({
      where: { id }
    })

    await logEvent({
      type: 'PROPERTY_DELETED',
      action: 'deleted',
      entity: 'property',
      entityId: id,
      userId: session.user.id,
      metadata: { name: existing.name }
    })

    return NextResponse.json({ message: 'Property deleted' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
