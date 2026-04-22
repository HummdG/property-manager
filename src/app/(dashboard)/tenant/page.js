import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Home, Calendar, Building2, Mail, Phone, MapPin, DollarSign, Clock } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

async function getTenantData(userId) {
  return db.tenantProfile.findUnique({
    where: { userId },
    include: {
      property: {
        include: { owner: { select: { name: true, email: true, phone: true } } }
      }
    }
  })
}

export default async function TenantDashboard() {
  const session = await auth()
  const tenantProfile = await getTenantData(session.user.id)
  const property = tenantProfile?.property

  const leaseActive = tenantProfile?.leaseEnd
    ? new Date(tenantProfile.leaseEnd) >= new Date()
    : !!tenantProfile?.leaseStart

  const daysUntilEnd = tenantProfile?.leaseEnd
    ? Math.ceil((new Date(tenantProfile.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Tenant Portal</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">
          Welcome, {session.user.name?.split(' ')[0]}
        </h1>
      </div>

      {property ? (
        <>
          {/* Property hero — full width */}
          <div className="border border-wire bg-cream">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-wire">
              <Home className="h-4 w-4 text-bronze" />
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">My Property</p>
              {leaseActive && (
                <span className="ml-auto text-[0.6rem] uppercase tracking-[0.12em] border border-bronze/30 bg-bronze/5 text-bronze px-2.5 py-1">
                  Active Lease
                </span>
              )}
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-6">
              {/* Name + address */}
              <div className="md:col-span-2">
                <h2 className="font-display text-[1.5rem] font-light text-sable leading-tight mb-2">
                  {property.name}
                </h2>
                <div className="flex items-start gap-2 text-[0.8125rem] text-fog">
                  <MapPin className="h-3.5 w-3.5 text-bronze flex-shrink-0 mt-[2px]" />
                  <span>
                    {property.address}, {property.city}
                    {property.postcode ? `, ${property.postcode}` : ''}
                  </span>
                </div>
                <div className="mt-4">
                  <Link
                    href="/tenant/property"
                    className="inline-flex items-center gap-1.5 text-[0.75rem] text-bronze hover:text-sable transition-colors"
                  >
                    View full details →
                  </Link>
                </div>
              </div>

              {/* Rent */}
              {tenantProfile.rentAmount && (
                <div className="border-t md:border-t-0 md:border-l border-wire pt-4 md:pt-0 md:pl-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1">Monthly Rent</p>
                  <p className="font-display text-[2rem] font-light text-bronze leading-none">
                    {formatCurrency(tenantProfile.rentAmount * 100)}
                  </p>
                  <p className="text-[0.75rem] text-fog mt-1">per month</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats row — full width */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Lease period */}
            <div className="border border-wire bg-cream">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-wire">
                <Calendar className="h-3.5 w-3.5 text-bronze" />
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Lease Period</p>
              </div>
              <div className="p-5">
                {tenantProfile.leaseStart ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[0.8125rem]">
                      <span className="text-fog">Start</span>
                      <span className="text-sable font-medium">{formatDate(tenantProfile.leaseStart)}</span>
                    </div>
                    <div className="flex justify-between text-[0.8125rem]">
                      <span className="text-fog">End</span>
                      <span className="text-sable font-medium">
                        {tenantProfile.leaseEnd ? formatDate(tenantProfile.leaseEnd) : 'Ongoing'}
                      </span>
                    </div>
                    {daysUntilEnd !== null && daysUntilEnd > 0 && (
                      <div className="pt-2 border-t border-wire mt-2">
                        <p className="text-[0.75rem] text-fog">
                          <span className="text-sable font-medium">{daysUntilEnd} days</span> remaining
                        </p>
                      </div>
                    )}
                    {daysUntilEnd !== null && daysUntilEnd <= 0 && (
                      <div className="pt-2 border-t border-wire mt-2">
                        <p className="text-[0.75rem] text-fog">Lease has ended</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[0.8125rem] text-fog">No lease dates recorded</p>
                )}
              </div>
            </div>

            {/* Landlord */}
            {property.owner && (
              <div className="border border-wire bg-cream">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-wire">
                  <Building2 className="h-3.5 w-3.5 text-bronze" />
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Landlord</p>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-[0.9375rem] font-medium text-sable">{property.owner.name}</p>
                  {property.owner.email && (
                    <a
                      href={`mailto:${property.owner.email}`}
                      className="flex items-center gap-2 text-[0.8125rem] text-fog hover:text-sable transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
                      <span className="truncate">{property.owner.email}</span>
                    </a>
                  )}
                  {property.owner.phone && (
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="flex items-center gap-2 text-[0.8125rem] text-fog hover:text-sable transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
                      <span>{property.owner.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="border border-wire bg-cream">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-wire">
                <Clock className="h-3.5 w-3.5 text-bronze" />
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Quick Actions</p>
              </div>
              <div className="p-5 space-y-2">
                <Link
                  href="/tenant/property"
                  className="flex items-center justify-between w-full border border-wire px-4 py-2.5 text-[0.8125rem] text-pewter hover:bg-linen hover:border-sable/20 transition-colors"
                >
                  View Property Details
                  <span className="text-fog">→</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="border border-wire bg-cream p-12 text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.9375rem] font-medium text-sable">No property assigned yet</p>
          <p className="text-[0.8125rem] text-fog mt-1.5 max-w-xs mx-auto">
            Contact your landlord to get set up with a property.
          </p>
        </div>
      )}
    </div>
  )
}
