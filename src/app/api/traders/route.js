import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where = {
      user: { isActive: true },
      isAvailable: true
    }

    if (categoryId) {
      where.categories = {
        some: { id: categoryId }
      }
    }

    const traders = await db.traderProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        categories: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({ traders })
  } catch (error) {
    console.error('Error fetching traders:', error)
    return NextResponse.json({ error: 'Failed to fetch traders' }, { status: 500 })
  }
}

