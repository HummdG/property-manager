import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generatePresignedUploadUrl, generateAgentPhotoKey, getPublicUrl } from '@/lib/s3'

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { fileName, contentType } = await request.json()

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 })
    }

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
    }

    const profile = await db.agentProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {}
    })

    const key = generateAgentPhotoKey(profile.id, fileName)
    const uploadUrl = await generatePresignedUploadUrl({ key, contentType })
    const fileUrl = getPublicUrl(key)

    await db.agentProfile.update({
      where: { id: profile.id },
      data: { profilePhoto: fileUrl }
    })

    return NextResponse.json({ uploadUrl, fileUrl }, { status: 201 })
  } catch (error) {
    console.error('POST /api/agent/profile/photo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
