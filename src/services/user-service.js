import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const userService = {
  async findById(id) {
    return db.user.findUnique({
      where: { id },
      include: { traderProfile: true, tenantProfile: true },
    })
  },

  async findByEmail(email) {
    return db.user.findUnique({
      where: { email },
      include: { traderProfile: true, tenantProfile: true },
    })
  },

  async create(data) {
    const { password, ...rest } = data
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null
    return db.user.create({
      data: { ...rest, password: hashedPassword },
    })
  },

  async update(id, data) {
    const { password, ...rest } = data
    const updateData = { ...rest }
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }
    return db.user.update({ where: { id }, data: updateData })
  },

  async verifyPassword(user, password) {
    if (!user.password) return false
    return bcrypt.compare(password, user.password)
  },

  async findAll({ page = 1, limit = 10, role, search } = {}) {
    const where = {}
    if (role) where.role = role
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, phone: true,
          role: true, image: true, isActive: true, createdAt: true,
        },
      }),
      db.user.count({ where }),
    ])

    return { users, total, page, limit }
  },

  async toggleActive(id) {
    const user = await db.user.findUnique({ where: { id } })
    return db.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    })
  },
}



