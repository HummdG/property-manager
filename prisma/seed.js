const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { name: 'Plumbing' },
      update: {},
      create: { name: 'Plumbing', description: 'Water, pipes, drains, and fixtures', icon: 'droplet', sortOrder: 1 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Electrical' },
      update: {},
      create: { name: 'Electrical', description: 'Wiring, outlets, and electrical systems', icon: 'zap', sortOrder: 2 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'HVAC' },
      update: {},
      create: { name: 'HVAC', description: 'Heating, ventilation, and air conditioning', icon: 'thermometer', sortOrder: 3 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Appliances' },
      update: {},
      create: { name: 'Appliances', description: 'Kitchen and laundry appliances', icon: 'microwave', sortOrder: 4 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'General Maintenance' },
      update: {},
      create: { name: 'General Maintenance', description: 'General repairs and maintenance', icon: 'wrench', sortOrder: 5 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Landscaping' },
      update: {},
      create: { name: 'Landscaping', description: 'Garden and outdoor maintenance', icon: 'trees', sortOrder: 6 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Pest Control' },
      update: {},
      create: { name: 'Pest Control', description: 'Pest and vermin control', icon: 'bug', sortOrder: 7 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Cleaning' },
      update: {},
      create: { name: 'Cleaning', description: 'Deep cleaning and sanitation', icon: 'sparkles', sortOrder: 8 }
    })
  ])

  console.log(`Created ${categories.length} service categories`)

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@propmanager.com' },
    update: {},
    create: {
      email: 'admin@propmanager.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create sample owner
  const ownerPassword = await bcrypt.hash('owner123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'John Owner',
      password: ownerPassword,
      role: 'OWNER',
      phone: '+44 7700 900123',
      isActive: true
    }
  })
  console.log(`Created owner user: ${owner.email}`)

  // Create sample tenant
  const tenantPassword = await bcrypt.hash('tenant123', 12)
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@example.com' },
    update: {},
    create: {
      email: 'tenant@example.com',
      name: 'Sarah Tenant',
      password: tenantPassword,
      role: 'TENANT',
      phone: '+44 7700 900456',
      isActive: true
    }
  })
  console.log(`Created tenant user: ${tenant.email}`)

  // Create sample trader
  const traderPassword = await bcrypt.hash('trader123', 12)
  const trader = await prisma.user.upsert({
    where: { email: 'trader@example.com' },
    update: {},
    create: {
      email: 'trader@example.com',
      name: 'Mike Plumber',
      password: traderPassword,
      role: 'TRADER',
      phone: '+44 7700 900789',
      isActive: true
    }
  })
  console.log(`Created trader user: ${trader.email}`)

  // Create trader profile
  await prisma.traderProfile.upsert({
    where: { userId: trader.id },
    update: {},
    create: {
      userId: trader.id,
      companyName: 'Quick Fix Plumbing',
      description: 'Professional plumbing services with 10+ years experience',
      hourlyRate: 50,
      isAvailable: true,
      categories: {
        connect: [{ id: categories[0].id }] // Plumbing
      }
    }
  })
  console.log('Created trader profile')

  // Create sample properties
  const property1 = await prisma.property.upsert({
    where: { id: 'sample-property-1' },
    update: {},
    create: {
      id: 'sample-property-1',
      name: 'Riverside Apartment',
      address: '123 Thames Walk',
      city: 'London',
      postcode: 'SE1 2AB',
      type: 'APARTMENT',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      description: 'Modern apartment with river views',
      monthlyRent: 1800,
      isListed: false,
      ownerId: owner.id
    }
  })

  const property2 = await prisma.property.upsert({
    where: { id: 'sample-property-2' },
    update: {},
    create: {
      id: 'sample-property-2',
      name: 'Garden House',
      address: '45 Oak Street',
      city: 'Manchester',
      postcode: 'M1 4BT',
      type: 'HOUSE',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1400,
      description: 'Spacious family home with large garden',
      monthlyRent: 1500,
      isListed: true,
      ownerId: owner.id
    }
  })
  console.log('Created sample properties')

  // Create tenant profile and assign to property
  await prisma.tenantProfile.upsert({
    where: { userId: tenant.id },
    update: {},
    create: {
      userId: tenant.id,
      propertyId: property1.id,
      leaseStart: new Date('2024-01-01'),
      leaseEnd: new Date('2025-12-31'),
      rentAmount: 1800,
      depositPaid: 3600
    }
  })
  console.log('Created tenant profile')

  // Create sample service request
  const request = await prisma.serviceRequest.upsert({
    where: { id: 'sample-request-1' },
    update: {},
    create: {
      id: 'sample-request-1',
      title: 'Leaking tap in bathroom',
      description: 'The bathroom sink tap has been dripping for a few days. Need it fixed.',
      status: 'PENDING',
      priority: 'MEDIUM',
      propertyId: property1.id,
      categoryId: categories[0].id, // Plumbing
      requesterId: tenant.id
    }
  })
  console.log('Created sample service request')

  console.log('Seed completed successfully!')
  console.log('')
  console.log('Test accounts:')
  console.log('- Admin: admin@propmanager.com / admin123')
  console.log('- Owner: owner@example.com / owner123')
  console.log('- Tenant: tenant@example.com / tenant123')
  console.log('- Trader: trader@example.com / trader123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
