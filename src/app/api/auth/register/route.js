import { NextResponse } from 'next/server'
import { resolveMx } from 'node:dns/promises'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'
import { registerSchema, DISPOSABLE_DOMAINS } from '@/lib/validators'

async function isEmailDomainValid(email) {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  if (DISPOSABLE_DOMAINS.has(domain)) return false
  try {
    const records = await resolveMx(domain)
    return records.length > 0
  } catch {
    return false
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: message }, { status: 400 })
    }
    const { name, email, password, role } = parsed.data

    const domainOk = await isEmailDomainValid(email)
    if (!domainOk) {
      return NextResponse.json(
        { error: 'Please use a real email address' },
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

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    })

    if (role === 'TENANT') {
      await db.tenantProfile.create({ data: { userId: user.id } })
    } else if (role === 'AGENT') {
      await db.agentProfile.create({ data: { userId: user.id } })
    }

    await logEvent({
      type: 'USER_REGISTERED',
      action: 'created',
      entity: 'user',
      entityId: user.id,
      userId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role }
    })

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
