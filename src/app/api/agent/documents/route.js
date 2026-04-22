import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { agentDocumentUploadSchema } from '@/lib/validators'
import { generatePresignedUploadUrl, generateAgentDocumentKey, getPublicUrl } from '@/lib/s3'

const ALLOWED_CONTENT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

async function getOrCreateProfile(userId) {
  return db.agentProfile.upsert({
    where: { userId },
    create: { userId },
    update: {}
  })
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const profile = await db.agentProfile.findUnique({
      where: { userId: session.user.id },
      include: { documents: { orderBy: { uploadedAt: 'desc' } } }
    })

    return NextResponse.json({ documents: profile?.documents || [] })
  } catch (error) {
    console.error('GET /api/agent/documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const result = agentDocumentUploadSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 })
    }

    const { type, fileName, contentType, fileSize } = result.data

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json({ error: 'Only PDF, JPEG, and PNG files are allowed' }, { status: 400 })
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size must not exceed 10MB' }, { status: 400 })
    }

    const profile = await getOrCreateProfile(session.user.id)

    if (profile.approvalStatus === 'SUBMITTED') {
      return NextResponse.json({ error: 'Documents cannot be modified while your profile is under review' }, { status: 400 })
    }

    const key = generateAgentDocumentKey(profile.id, type, fileName)
    const fileUrl = getPublicUrl(key)
    const uploadUrl = await generatePresignedUploadUrl({ key, contentType })

    const document = await db.agentDocument.create({
      data: {
        agentId: profile.id,
        type,
        fileName,
        fileUrl,
        fileKey: key,
        fileSize: fileSize || null,
      }
    })

    return NextResponse.json({ document, uploadUrl }, { status: 201 })
  } catch (error) {
    console.error('POST /api/agent/documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
