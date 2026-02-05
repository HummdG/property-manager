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

  // Create sample properties with various listing types
  const property1 = await prisma.property.upsert({
    where: { id: 'sample-property-1' },
    update: {
      listingType: 'RENT',
      isListed: false
    },
    create: {
      id: 'sample-property-1',
      name: 'Riverside Apartment',
      address: '123 Thames Walk',
      city: 'Dubai',
      postcode: 'SE1 2AB',
      country: 'United Arab Emirates',
      type: 'APARTMENT',
      listingType: 'RENT',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      description: 'Modern apartment with stunning river views. Features include open-plan living, floor-to-ceiling windows, and a private balcony overlooking the water.',
      monthlyRent: 8500,
      isListed: false,
      ownerId: owner.id
    }
  })

  const property2 = await prisma.property.upsert({
    where: { id: 'sample-property-2' },
    update: {
      listingType: 'RENT',
      isListed: true
    },
    create: {
      id: 'sample-property-2',
      name: 'Marina View Villa',
      address: '45 Palm Jumeirah',
      city: 'Dubai',
      postcode: 'PJ 100',
      country: 'United Arab Emirates',
      type: 'HOUSE',
      listingType: 'RENT',
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 3200,
      description: 'Luxurious villa with private pool and direct beach access. This stunning property features marble flooring, smart home technology, and breathtaking marina views.',
      monthlyRent: 25000,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Property for sale
  const property3 = await prisma.property.upsert({
    where: { id: 'sample-property-3' },
    update: {
      listingType: 'SALE',
      salePrice: 2500000,
      isListed: true
    },
    create: {
      id: 'sample-property-3',
      name: 'Downtown Penthouse',
      address: '1 Burj Khalifa Boulevard',
      city: 'Dubai',
      postcode: 'DT 500',
      country: 'United Arab Emirates',
      type: 'APARTMENT',
      listingType: 'SALE',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2100,
      description: 'Exclusive penthouse in the heart of Downtown Dubai. Features panoramic city views, private elevator access, and world-class amenities including concierge service.',
      salePrice: 2500000,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Property for both rent and sale
  const property4 = await prisma.property.upsert({
    where: { id: 'sample-property-4' },
    update: {
      listingType: 'BOTH',
      monthlyRent: 12000,
      salePrice: 1800000,
      isListed: true
    },
    create: {
      id: 'sample-property-4',
      name: 'Business Bay Tower Suite',
      address: '88 Business Bay',
      city: 'Dubai',
      postcode: 'BB 200',
      country: 'United Arab Emirates',
      type: 'APARTMENT',
      listingType: 'BOTH',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1450,
      description: 'Premium apartment in the prestigious Business Bay area. Modern finishes, gym access, rooftop pool, and stunning canal views. Perfect for professionals.',
      monthlyRent: 12000,
      salePrice: 1800000,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Property for rent in Abu Dhabi
  const property5 = await prisma.property.upsert({
    where: { id: 'sample-property-5' },
    update: {
      listingType: 'RENT',
      isListed: true
    },
    create: {
      id: 'sample-property-5',
      name: 'Corniche Residence',
      address: '22 Corniche Road',
      city: 'Abu Dhabi',
      postcode: 'AD 100',
      country: 'United Arab Emirates',
      type: 'APARTMENT',
      listingType: 'RENT',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 750,
      description: 'Cozy waterfront apartment with stunning Corniche views. Walking distance to beaches, restaurants, and entertainment. Ideal for singles or couples.',
      monthlyRent: 6500,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Townhouse for sale
  const property6 = await prisma.property.upsert({
    where: { id: 'sample-property-6' },
    update: {
      listingType: 'SALE',
      salePrice: 3200000,
      isListed: true
    },
    create: {
      id: 'sample-property-6',
      name: 'Arabian Ranches Townhouse',
      address: '15 Arabian Ranches',
      city: 'Dubai',
      postcode: 'AR 300',
      country: 'United Arab Emirates',
      type: 'TOWNHOUSE',
      listingType: 'SALE',
      bedrooms: 4,
      bathrooms: 4,
      squareFeet: 3500,
      description: 'Spacious family townhouse in the sought-after Arabian Ranches community. Features private garden, maid room, study, and access to golf course and equestrian center.',
      salePrice: 3200000,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Commercial property
  const property7 = await prisma.property.upsert({
    where: { id: 'sample-property-7' },
    update: {
      listingType: 'BOTH',
      monthlyRent: 35000,
      salePrice: 5500000,
      isListed: true
    },
    create: {
      id: 'sample-property-7',
      name: 'DIFC Office Space',
      address: '50 Gate Avenue',
      city: 'Dubai',
      postcode: 'DIFC 400',
      country: 'United Arab Emirates',
      type: 'COMMERCIAL',
      listingType: 'BOTH',
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 2800,
      description: 'Premium Grade A office space in Dubai International Financial Centre. Fitted with modern amenities, meeting rooms, and stunning views of the financial district.',
      monthlyRent: 35000,
      salePrice: 5500000,
      isListed: true,
      ownerId: owner.id
    }
  })

  // Studio apartment
  const property8 = await prisma.property.upsert({
    where: { id: 'sample-property-8' },
    update: {
      listingType: 'RENT',
      isListed: true
    },
    create: {
      id: 'sample-property-8',
      name: 'JLT Modern Studio',
      address: '100 Jumeirah Lake Towers',
      city: 'Dubai',
      postcode: 'JLT 500',
      country: 'United Arab Emirates',
      type: 'APARTMENT',
      listingType: 'RENT',
      bedrooms: 0,
      bathrooms: 1,
      squareFeet: 450,
      description: 'Stylish studio apartment perfect for young professionals. Fully furnished with modern amenities, gym, pool, and excellent metro connectivity.',
      monthlyRent: 4500,
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

  // Create sample agent
  const agentPassword = await bcrypt.hash('agent123', 12)
  const agent = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      email: 'agent@example.com',
      name: 'Ahmed Agent',
      password: agentPassword,
      role: 'AGENT',
      phone: '+971 50 123 4567',
      isActive: true
    }
  })
  console.log(`Created agent user: ${agent.email}`)

  // Create agent profile
  await prisma.agentProfile.upsert({
    where: { userId: agent.id },
    update: {},
    create: {
      userId: agent.id,
      companyName: 'GoFor Properties',
      licenseNumber: 'RERA-12345',
      description: 'Experienced real estate agent specializing in luxury properties in Dubai Marina and Downtown.',
      commissionRate: 2.5,
      serviceAreas: ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay'],
      specializations: ['Luxury Properties', 'Off-Plan', 'Investment Properties'],
      rating: 4.8,
      completedDeals: 45,
      isAvailable: true,
      tcAcceptedAt: new Date()
    }
  })
  console.log('Created agent profile')

  // Create subscription plans
  const subscriptionPlans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { name: 'Basic' },
      update: {},
      create: {
        name: 'Basic',
        description: 'Perfect for individual agents starting out',
        monthlyPrice: 9900, // AED 99
        yearlyPrice: 95000, // AED 950 (save ~20%)
        maxInquiries: 50,
        maxThirdPartyPlatforms: 0,
        features: ['Up to 50 inquiries/month', 'Daily activity logging', 'Basic analytics', 'Email support'],
        isActive: true,
        sortOrder: 0
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { name: 'Professional' },
      update: {},
      create: {
        name: 'Professional',
        description: 'Best for active agents with growing client base',
        monthlyPrice: 29900, // AED 299
        yearlyPrice: 287000, // AED 2870 (save ~20%)
        maxInquiries: null, // Unlimited
        maxThirdPartyPlatforms: 3,
        features: ['Unlimited inquiries', '3 third-party platforms', 'Location tracking', 'Advanced analytics', 'Priority support', 'Client CRM'],
        isActive: true,
        sortOrder: 1
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { name: 'Enterprise' },
      update: {},
      create: {
        name: 'Enterprise',
        description: 'For agencies and top-performing agents',
        monthlyPrice: 59900, // AED 599
        yearlyPrice: 575000, // AED 5750 (save ~20%)
        maxInquiries: null, // Unlimited
        maxThirdPartyPlatforms: 10,
        features: ['Unlimited everything', 'All third-party platforms', 'Team management', 'API access', 'Custom integrations', 'Dedicated account manager', 'White-label options'],
        isActive: true,
        sortOrder: 2
      }
    })
  ])
  console.log(`Created ${subscriptionPlans.length} subscription plans`)

  // Create third-party platforms
  const platforms = await Promise.all([
    prisma.thirdPartyPlatform.upsert({
      where: { name: 'Airbnb' },
      update: {},
      create: {
        name: 'Airbnb',
        description: 'Short-term vacation rental platform',
        website: 'https://www.airbnb.com',
        baseFee: 0,
        perListingFee: 5000, // AED 50 per listing
        isActive: true
      }
    }),
    prisma.thirdPartyPlatform.upsert({
      where: { name: 'Property Finder' },
      update: {},
      create: {
        name: 'Property Finder',
        description: 'Leading property portal in UAE',
        website: 'https://www.propertyfinder.ae',
        baseFee: 0,
        perListingFee: 15000, // AED 150 per listing
        isActive: true
      }
    }),
    prisma.thirdPartyPlatform.upsert({
      where: { name: 'Dubizzle' },
      update: {},
      create: {
        name: 'Dubizzle',
        description: 'Popular classifieds platform',
        website: 'https://www.dubizzle.com',
        baseFee: 0,
        perListingFee: 10000, // AED 100 per listing
        isActive: true
      }
    }),
    prisma.thirdPartyPlatform.upsert({
      where: { name: 'Bayut' },
      update: {},
      create: {
        name: 'Bayut',
        description: 'UAE property marketplace',
        website: 'https://www.bayut.com',
        baseFee: 0,
        perListingFee: 12000, // AED 120 per listing
        isActive: true
      }
    }),
    prisma.thirdPartyPlatform.upsert({
      where: { name: 'Booking.com' },
      update: {},
      create: {
        name: 'Booking.com',
        description: 'Hotel and vacation rental platform',
        website: 'https://www.booking.com',
        baseFee: 0,
        perListingFee: 8000, // AED 80 per listing
        isActive: true
      }
    })
  ])
  console.log(`Created ${platforms.length} third-party platforms`)

  // Create sample inquiries for agent
  const agentProfile = await prisma.agentProfile.findUnique({
    where: { userId: agent.id }
  })

  if (agentProfile) {
    const inquiries = await Promise.all([
      prisma.inquiry.upsert({
        where: { id: 'sample-inquiry-1' },
        update: {},
        create: {
          id: 'sample-inquiry-1',
          type: 'RENT',
          status: 'OPEN',
          source: 'website',
          agentId: agentProfile.id,
          clientName: 'Mohammed Al Rashid',
          clientEmail: 'mohammed@example.com',
          clientPhone: '+971 55 123 4567',
          message: 'Looking for a 2-bedroom apartment in Dubai Marina, budget around AED 10,000/month.',
          budget: 10000,
          preferredArea: 'Dubai Marina'
        }
      }),
      prisma.inquiry.upsert({
        where: { id: 'sample-inquiry-2' },
        update: {},
        create: {
          id: 'sample-inquiry-2',
          type: 'SALE',
          status: 'MEETING_SCHEDULED',
          source: 'referral',
          agentId: agentProfile.id,
          propertyId: property3.id,
          clientName: 'Sarah Thompson',
          clientEmail: 'sarah.t@example.com',
          clientPhone: '+971 50 987 6543',
          message: 'Interested in the Downtown Penthouse. Would like to schedule a viewing.',
          budget: 3000000,
          preferredArea: 'Downtown Dubai',
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        }
      }),
      prisma.inquiry.upsert({
        where: { id: 'sample-inquiry-3' },
        update: {},
        create: {
          id: 'sample-inquiry-3',
          type: 'MAINTENANCE',
          status: 'CONTACTED',
          source: 'phone',
          agentId: agentProfile.id,
          propertyId: property2.id,
          clientName: 'James Wilson',
          clientEmail: 'james.w@example.com',
          clientPhone: '+971 56 111 2222',
          message: 'AC unit in the master bedroom is not cooling properly. Need maintenance.',
          notes: 'Contacted the client, will send technician next week.'
        }
      })
    ])
    console.log(`Created ${inquiries.length} sample inquiries`)

    // Create sample follow-ups
    await prisma.inquiryFollowUp.upsert({
      where: { id: 'sample-followup-1' },
      update: {},
      create: {
        id: 'sample-followup-1',
        inquiryId: inquiries[1].id,
        type: 'CALL',
        title: 'Initial call to discuss requirements',
        description: 'Discussed the client\'s requirements. They are looking for a property with a view and good investment potential.',
        outcome: 'positive',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    })
    console.log('Created sample follow-ups')
  }

  console.log('Seed completed successfully!')
  console.log('')
  console.log('Test accounts:')
  console.log('- Admin: admin@propmanager.com / admin123')
  console.log('- Owner: owner@example.com / owner123')
  console.log('- Tenant: tenant@example.com / tenant123')
  console.log('- Trader: trader@example.com / trader123')
  console.log('- Agent: agent@example.com / agent123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
