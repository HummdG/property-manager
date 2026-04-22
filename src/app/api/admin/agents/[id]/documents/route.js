import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generatePresignedDownloadUrl } from '@/lib/s3'

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const agent = await db.agentProfile.findUnique({
      where: { id },
      include: { documents: { orderBy: { uploadedAt: 'desc' } } }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const documentsWithUrls = await Promise.all(
      agent.documents.map(async (doc) => ({
        ...doc,
        downloadUrl: await generatePresignedDownloadUrl(doc.fileKey, 3600)
      }))
    )

    return NextResponse.json({ documents: documentsWithUrls })
  } catch (error) {
    console.error('GET /api/admin/agents/[id]/documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
