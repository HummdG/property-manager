import { db } from '@/lib/db'

/**
 * Log a system event for audit tracking
 * @param {Object} params
 * @param {string} params.type - Event type (e.g. USER_REGISTERED, PROPERTY_CREATED)
 * @param {string} params.action - Action performed (e.g. "created", "updated", "deleted")
 * @param {string} params.entity - Entity type (e.g. "user", "property", "jobAssignment")
 * @param {string} [params.entityId] - ID of the affected entity
 * @param {string} [params.userId] - ID of the user who performed the action
 * @param {Object} [params.metadata] - Additional context data
 */
export async function logEvent({ type, action, entity, entityId, userId, metadata }) {
  try {
    await db.systemEvent.create({
      data: {
        type,
        action,
        entity,
        entityId: entityId || null,
        userId: userId || null,
        metadata: metadata || null
      }
    })
  } catch (error) {
    // Log but don't throw - event logging should never break the main flow
    console.error('Failed to log system event:', error)
  }
}

