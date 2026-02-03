import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

/**
 * Prisma client singleton
 * Prevents multiple instances during development hot reload
 */
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

export default db

