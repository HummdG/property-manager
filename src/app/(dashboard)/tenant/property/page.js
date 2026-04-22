import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import {
  Home, MapPin, Calendar, Phone, Mail,
  Building2, BedDouble, Bath, Ruler
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

async function getTenantProperty(userId) {
  return db.tenantProfile.findUnique({
    where: { userId },
    include: {
      property: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } }
        }
      }
    }
  })
}

export default async function TenantPropertyPage() {
  const session = await auth()
  const tenantProfile = await getTenantProperty(session.user.id)
  const property = tenantProfile?.property

  if (!property) {
    return (
      <div className="space-y-5">
        <div className="border-b border-wire pb-5">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Tenant Portal</p>
          <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">My Property</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-haze" />
          </div>
          <h3 className="font-display text-[1.375rem] font-light text-sable mt-2">No Property Assigned</h3>
          <p className="text-[0.8125rem] text-fog mt-2 max-w-sm">
            You haven't been assigned to a property yet. Please contact your landlord or property manager to get set up.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Tenant Portal</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">My Property</h1>
      </div>

      {/* Property header */}
      <div className="border border-wire bg-cream">
        <div className="px-6 py-5 border-b border-wire bg-linen flex items-start gap-4">
          <div className="w-12 h-12 border border-wire bg-cream flex items-center justify-center flex-shrink-0">
            <Home className="h-5 w-5 text-bronze" />
          </div>
          <div>
            <h2 className="font-display text-[1.375rem] font-light text-sable">{property.name}</h2>
            <div className="flex items-center gap-2 text-[0.8125rem] text-fog mt-1">
              <MapPin className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
              <span>{property.address}, {property.city}, {property.postcode}</span>
            </div>
            <span className="inline-block mt-2 text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-cream text-pewter border border-wire">
              {property.type}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Property specs */}
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium mb-4">Property Details</p>
              {(property.bedrooms || property.bathrooms || property.squareFeet) && (
                <div className="grid gap-px grid-cols-3 bg-wire border border-wire mb-4">
                  {property.bedrooms && (
                    <div className="bg-cream p-4 flex flex-col items-center">
                      <BedDouble className="h-4 w-4 text-bronze mb-2" />
                      <p className="font-display text-[1.375rem] font-light text-sable leading-none">{property.bedrooms}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog mt-1">Beds</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="bg-cream p-4 flex flex-col items-center">
                      <Bath className="h-4 w-4 text-bronze mb-2" />
                      <p className="font-display text-[1.375rem] font-light text-sable leading-none">{property.bathrooms}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog mt-1">Baths</p>
                    </div>
                  )}
                  {property.squareFeet && (
                    <div className="bg-cream p-4 flex flex-col items-center">
                      <Ruler className="h-4 w-4 text-bronze mb-2" />
                      <p className="font-display text-[1.375rem] font-light text-sable leading-none">{property.squareFeet}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog mt-1">sq ft</p>
                    </div>
                  )}
                </div>
              )}
              {property.description && (
                <p className="text-[0.8125rem] text-fog">{property.description}</p>
              )}
            </div>

            {/* Lease info */}
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium mb-4">Lease Information</p>
              <div className="space-y-3">
                {tenantProfile.rentAmount && (
                  <div className="px-4 py-3 border border-wire bg-linen">
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium">Monthly Rent</p>
                    <p className="font-display text-[1.75rem] font-light text-bronze leading-none mt-1">
                      {formatCurrency(tenantProfile.rentAmount * 100)}
                    </p>
                  </div>
                )}
                {tenantProfile.depositPaid && (
                  <div className="flex justify-between px-4 py-3 border border-wire">
                    <span className="text-[0.8125rem] text-fog">Deposit Paid</span>
                    <span className="text-[0.8125rem] font-medium text-sable">{formatCurrency(tenantProfile.depositPaid * 100)}</span>
                  </div>
                )}
                {tenantProfile.leaseStart && (
                  <div className="flex items-center gap-3 px-4 py-3 border border-wire">
                    <Calendar className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.1em] text-fog font-medium">Lease Period</p>
                      <p className="text-[0.8125rem] font-medium text-sable mt-0.5">
                        {formatDate(tenantProfile.leaseStart)} to {tenantProfile.leaseEnd ? formatDate(tenantProfile.leaseEnd) : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Landlord info */}
      {property.owner && (
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Landlord / Property Manager</p>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-bronze/15 border border-bronze/20 flex items-center justify-center flex-shrink-0 text-[1rem] font-medium text-bronze uppercase">
              {property.owner.name?.charAt(0) || 'L'}
            </div>
            <div className="flex-1">
              <p className="font-display text-[1.125rem] font-light text-sable">{property.owner.name}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                <a href={`mailto:${property.owner.email}`} className="flex items-center gap-2 text-[0.75rem] text-fog hover:text-bronze transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  {property.owner.email}
                </a>
                {property.owner.phone && (
                  <a href={`tel:${property.owner.phone}`} className="flex items-center gap-2 text-[0.75rem] text-fog hover:text-bronze transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                    {property.owner.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
