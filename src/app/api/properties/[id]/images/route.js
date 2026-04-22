import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generatePresignedUploadUrl, generateImageKey, getPublicUrl, deleteObject } from '@/lib/s3'
import { logEvent } from '@/lib/events'
import { imageUploadSchema, imageDeleteSchema } from '@/lib/validators'

const MAX_IMAGES = 20

export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const property = await db.property.findUnique({
      where: { id },
      select: { ownerId: true, name: true, images: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const canManage =
      session.user.role === 'ADMIN' ||
      property.ownerId === session.user.id ||
      session.user.role === 'AGENT'

    if (!canManage) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (property.images.length >= MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_IMAGES} images allowed per property` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = imageUploadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { fileName, contentType, fileSize } = parsed.data

    const fileKey = generateImageKey(id, fileName)
    const uploadUrl = await generatePresignedUploadUrl({ key: fileKey, contentType })
    const fileUrl = getPublicUrl(fileKey)

    const updatedProperty = await db.property.update({
      where: { id },
      data: { images: { push: fileUrl } },
      select: { images: true }
    })

    await logEvent({
      type: 'PROPERTY_UPDATED',
      action: 'updated',
      entity: 'property',
      entityId: id,
      userId: session.user.id,
      metadata: { propertyName: property.name, action: 'IMAGE_UPLOADED', fileName }
    })

    return NextResponse.json(
      { uploadUrl, fileUrl, fileKey, images: updatedProperty.images },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
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
    const fileKey = searchParams.get('fileKey')

    const parsed = imageDeleteSchema.safeParse({ fileKey })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const property = await db.property.findUnique({
      where: { id },
      select: { ownerId: true, name: true, images: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const canManage =
      session.user.role === 'ADMIN' ||
      property.ownerId === session.user.id ||
      session.user.role === 'AGENT'

    if (!canManage) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const fileUrl = getPublicUrl(fileKey)

    if (!property.images.includes(fileUrl)) {
      return NextResponse.json({ error: 'Image not found on this property' }, { status: 404 })
    }

    try {
      await deleteObject(fileKey)
    } catch (err) {
      console.error('Failed to delete S3 object:', err)
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: { images: { set: property.images.filter(url => url !== fileUrl) } },
      select: { images: true }
    })

    await logEvent({
      type: 'PROPERTY_UPDATED',
      action: 'updated',
      entity: 'property',
      entityId: id,
      userId: session.user.id,
      metadata: { propertyName: property.name, action: 'IMAGE_DELETED', fileKey }
    })

    return NextResponse.json({ message: 'Image deleted', images: updatedProperty.images })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
