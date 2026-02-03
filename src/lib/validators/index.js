import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['OWNER', 'TENANT', 'TRADER']).default('OWNER'),
  phone: z.string().optional(),
})

export const createPropertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().default('United Kingdom'),
  type: z.enum(['HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL', 'LAND', 'OTHER']).default('HOUSE'),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().int().min(0).optional().nullable(),
  squareFeet: z.number().int().min(0).optional().nullable(),
  description: z.string().optional(),
  isListed: z.boolean().default(false),
  monthlyRent: z.number().int().min(0).optional().nullable(),
})

export const updatePropertySchema = createPropertySchema.partial()

export const createServiceRequestSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  categoryId: z.string().min(1, 'Service category is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  scheduledFor: z.string().datetime().optional(),
})

export const updateServiceRequestSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['PENDING', 'ASSIGNED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PENDING_PAYMENT', 'PAID']).optional(),
})

export const assignJobSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service request is required'),
  traderId: z.string().min(1, 'Trader is required'),
  notes: z.string().optional(),
  estimatedCost: z.number().int().min(0).optional(),
})

export const createPaymentSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service request is required'),
  amount: z.number().int().min(1, 'Amount must be greater than 0'),
  description: z.string().optional(),
})

export const createServiceCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
})

