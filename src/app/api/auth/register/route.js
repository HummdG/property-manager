import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const validRoles = ['OWNER', 'TENANT', 'TRADER']
    const userRole = validRoles.includes(role) ? role : 'OWNER'

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole
      }
    })

    // Create profile based on role
    if (userRole === 'TENANT') {
      await db.tenantProfile.create({
        data: { userId: user.id }
      })
    } else if (userRole === 'TRADER') {
      await db.traderProfile.create({
        data: { userId: user.id }
      })
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

