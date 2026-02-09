import { db } from '@/lib/db'

/**
 * Create a notification for a specific user
 * @param {Object} params
 * @param {string} params.userId - Target user ID
 * @param {string} params.type - Notification type (e.g. JOB_REJECTED)
 * @param {string} params.title - Short title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - URL to navigate to
 * @param {Object} [params.metadata] - Additional context
 */
export async function createNotification ({ userId, type, title, message, link, metadata }) {
  try {
    return await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
        metadata: metadata || null
      }
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

/**
 * Create a notification for all admin users
 * @param {Object} params
 * @param {string} params.type - Notification type
 * @param {string} params.title - Short title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - URL to navigate to
 * @param {Object} [params.metadata] - Additional context
 */
export async function notifyAdmins ({ type, title, message, link, metadata }) {
  try {
    const admins = await db.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true }
    })

    if (admins.length === 0) return

    await db.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        type,
        title,
        message,
        link: link || null,
        metadata: metadata || null
      }))
    })
  } catch (error) {
    // Log but don't throw - notifications should never break the main flow
    console.error('Failed to notify admins:', error)
  }
}

