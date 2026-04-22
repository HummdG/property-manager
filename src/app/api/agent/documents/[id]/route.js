import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logEvent } from '@/lib/events'
import { deleteObject } from '@/lib/s3'

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'AGENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const profile = await db.agentProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    if (profile.approvalStatus === 'SUBMITTED') {
      return NextResponse.json({ error: 'Documents cannot be removed while your profile is under review' }, { status: 400 })
    }

    const document = await db.agentDocument.findUnique({ where: { id } })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (document.agentId !== profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteObject(document.fileKey)
    await db.agentDocument.delete({ where: { id } })

    await logEvent({
      type: 'AGENT_DOCUMENT_DELETED',
      action: 'deleted',
      entity: 'agentDocument',
      entityId: id,
      userId: session.user.id,
      metadata: { documentType: document.type, fileName: document.fileName }
    })

    return NextResponse.json({ message: 'Document deleted' })
  } catch (error) {
    console.error('DELETE /api/agent/documents/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
