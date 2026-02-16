import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const property = await db.property.findUnique({
      where: { 
        id,
        isListed: true 
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        postcode: true,
        country: true,
        type: true,
        listingType: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        description: true,
        images: true,
        monthlyRent: true,
        salePrice: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}



