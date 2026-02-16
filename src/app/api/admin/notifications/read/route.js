import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH (request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id } = body

    if (id) {
      // Mark single notification as read
      await db.notification.update({
        where: { id, userId: session.user.id },
        data: { isRead: true }
      })
    } else {
      // Mark all as read
      await db.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
      })
    }

    const unreadCount = await db.notification.count({
      where: { userId: session.user.id, isRead: false }
    })

    return NextResponse.json({ success: true, unreadCount })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}


