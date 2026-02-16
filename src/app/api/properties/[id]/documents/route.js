import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generatePresignedUploadUrl, generateDocumentKey, getPublicUrl, deleteObject } from '@/lib/s3'
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
      select: { ownerId: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const documents = await db.propertyDocument.findMany({
      where: { propertyId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const property = await db.property.findUnique({
      where: { id },
      select: { ownerId: true, name: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type, fileName, contentType, fileSize } = body

    // Validate document type
    const validTypes = ['DEED', 'NOC']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid document type. Must be DEED or NOC.' }, { status: 400 })
    }

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing required fields: fileName, contentType' }, { status: 400 })
    }

    // Generate S3 key and presigned URL
    const fileKey = generateDocumentKey(id, type, fileName)
    const uploadUrl = await generatePresignedUploadUrl({ key: fileKey, contentType })
    const fileUrl = getPublicUrl(fileKey)

    // Delete existing document of same type if exists
    const existingDoc = await db.propertyDocument.findUnique({
      where: { propertyId_type: { propertyId: id, type } }
    })

    if (existingDoc) {
      try {
        await deleteObject(existingDoc.fileKey)
      } catch (err) {
        console.error('Failed to delete old S3 object:', err)
      }
      await db.propertyDocument.delete({
        where: { id: existingDoc.id }
      })
    }

    // Create new document record
    const document = await db.propertyDocument.create({
      data: {
        propertyId: id,
        type,
        fileName,
        fileUrl,
        fileKey,
        fileSize: fileSize || null
      }
    })

    await logEvent({
      type: 'DOCUMENT_UPLOADED',
      action: 'created',
      entity: 'propertyDocument',
      entityId: document.id,
      userId: session.user.id,
      metadata: { propertyName: property.name, documentType: type, fileName }
    })

    return NextResponse.json({
      document,
      uploadUrl
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 })
    }

    const document = await db.propertyDocument.findUnique({
      where: { id: documentId },
      include: {
        property: { select: { ownerId: true, name: true } }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (document.propertyId !== id) {
      return NextResponse.json({ error: 'Document does not belong to this property' }, { status: 400 })
    }

    if (session.user.role !== 'ADMIN' && document.property.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from S3
    try {
      await deleteObject(document.fileKey)
    } catch (err) {
      console.error('Failed to delete S3 object:', err)
    }

    // Delete from database
    await db.propertyDocument.delete({
      where: { id: documentId }
    })

    await logEvent({
      type: 'DOCUMENT_DELETED',
      action: 'deleted',
      entity: 'propertyDocument',
      entityId: documentId,
      userId: session.user.id,
      metadata: { propertyName: document.property.name, documentType: document.type, fileName: document.fileName }
    })

    return NextResponse.json({ message: 'Document deleted' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}


