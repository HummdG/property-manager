import { z } from 'zod'

export const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamail.biz', 'guerrillamail.de',
  'tempmail.com', 'temp-mail.org', 'throwam.com', 'sharklasers.com',
  'yopmail.com', 'maildrop.cc', 'trashmail.com', 'trashmail.me',
  'trashmail.net', 'dispostable.com', 'fakeinbox.com',
  'spamgourmet.com', 'mailnull.com', 'getnada.com', 'spam4.me',
  'discard.email', '10minutemail.com', 'mintemail.com',
  'wegwerfmail.de', 'spamex.com', 'mailexpire.com', 'filzmail.com',
  'example.com', 'example.org', 'example.net', 'example.io',
  'test.com', 'test.org', 'test.net', 'localhost', 'invalid.com',
  'fake.com', 'noreply.com', 'placeholder.com',
])

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['OWNER', 'TENANT', 'AGENT']).default('OWNER'),
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

const AGENT_DOC_TYPES = ['RERA_BROKER_CARD', 'BRN', 'LABOUR_CARD', 'EMPLOYMENT_VISA', 'EMIRATES_ID']

export const updateAgentProfileSchema = z.object({
  companyName:      z.string().optional(),
  licenseNumber:    z.string().optional(),
  title:            z.string().optional(),
  description:      z.string().optional(),
  nationality:      z.string().optional(),
  spokenLanguages:  z.array(z.string()).optional(),
  experienceSince:  z.string().datetime({ offset: true }).optional().nullable(),
  serviceAreas:     z.array(z.string()).optional(),
  specializations:  z.array(z.string()).optional(),
  commissionRate:   z.number().min(0).max(100).optional(),
  isAvailable:      z.boolean().optional(),
  phone:            z.string().optional(),
})

export const agentDocumentUploadSchema = z.object({
  type:        z.enum(AGENT_DOC_TYPES),
  fileName:    z.string().min(1),
  contentType: z.string().min(1),
  fileSize:    z.number().int().positive().optional(),
})

export const agentReviewSchema = z.object({
  action:       z.enum(['APPROVE', 'REJECT']),
  rejectionNote: z.string().optional(),
}).refine(
  (d) => d.action !== 'REJECT' || (d.rejectionNote && d.rejectionNote.trim().length > 0),
  { message: 'Rejection note is required when rejecting', path: ['rejectionNote'] }
)

export const imageUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.enum(
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    { errorMap: () => ({ message: 'Only JPEG, PNG, and WebP images are allowed' }) }
  ),
  fileSize: z.number().int().positive().max(8 * 1024 * 1024, 'Image must be under 8MB').optional()
})

export const imageDeleteSchema = z.object({
  fileKey: z.string()
    .min(1, 'File key is required')
    .regex(/^properties\/[^/]+\/images\/.+$/, 'Invalid file key format')
})
