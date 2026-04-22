import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Building2, Users, ArrowRight } from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import Link from 'next/link'

async function getOwnerStats(userId) {
  const [properties, tenants, listed] = await Promise.all([
    db.property.count({ where: { ownerId: userId } }),
    db.tenantProfile.count({ where: { property: { ownerId: userId } } }),
    db.property.count({ where: { ownerId: userId, isListed: true } })
  ])
  return { properties, tenants, listed }
}

async function getRecentProperties(userId) {
  return db.property.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

export default async function OwnerDashboard() {
  const session = await auth()
  const [stats, recentProperties] = await Promise.all([
    getOwnerStats(session.user.id),
    getRecentProperties(session.user.id)
  ])

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Owner Portal</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Portfolio Overview</h1>
      </div>

      <div className="grid gap-px sm:grid-cols-3 bg-wire border border-wire">
        <StatsCard title="Total Properties" value={stats.properties} icon={Building2} subtitle="In your portfolio" />
        <StatsCard title="Listed Properties" value={stats.listed} icon={Building2} subtitle="Currently active" />
        <StatsCard title="Tenants" value={stats.tenants} icon={Users} subtitle="Currently housed" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent properties */}
        <div className="border border-wire bg-cream">
          <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent Properties</p>
            <Link href="/owner/properties" className="text-[0.75rem] text-bronze hover:text-sable transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-wire/60">
            {recentProperties.length === 0 ? (
              <p className="text-[0.8125rem] text-haze py-8 text-center">No properties yet</p>
            ) : (
              recentProperties.map(property => (
                <div key={property.id} className="flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-linen transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8125rem] font-medium text-sable truncate">{property.name}</p>
                    <p className="text-[0.75rem] text-fog mt-0.5">{property.address}, {property.city}</p>
                  </div>
                  <span className={`text-[0.6rem] px-2 py-0.5 border font-medium uppercase tracking-wide ${property.isListed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-linen text-haze border-wire'}`}>
                    {property.isListed ? 'Listed' : 'Unlisted'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Quick Actions</p>
          </div>
          <div className="divide-y divide-wire/60">
            {[
              { href: '/owner/properties?action=add', label: 'Add New Property', sub: 'Register a property to your portfolio', Icon: Building2 },
              { href: '/owner/properties', label: 'Manage Properties', sub: 'View and edit your listings', Icon: Building2 },
            ].map(({ href, label, sub, Icon }) => (
              <Link key={label} href={href} className="flex items-center gap-4 px-5 py-4 hover:bg-linen transition-colors group">
                <div className="w-9 h-9 border border-wire bg-linen group-hover:border-bronze/30 group-hover:bg-bronze/5 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="h-4 w-4 text-bronze" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] font-medium text-sable">{label}</p>
                  <p className="text-[0.7rem] text-fog mt-0.5">{sub}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-haze group-hover:text-bronze transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
