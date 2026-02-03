import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import {
  Home,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'

async function getTenantProperty(userId) {
  const tenantProfile = await db.tenantProfile.findUnique({
    where: { userId },
    include: {
      property: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: { serviceRequests: true }
          }
        }
      }
    }
  })

  return tenantProfile
}

export default async function TenantPropertyPage() {
  const session = await auth()
  const tenantProfile = await getTenantProperty(session.user.id)
  const property = tenantProfile?.property

  if (!property) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">My Property</h1>
          <p className="text-slate-500 mt-1">View your rental property details</p>
        </div>

        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                <Building2 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-blue-950">No Property Assigned</h3>
              <p className="mt-2 text-slate-500 max-w-sm">
                You haven't been assigned to a property yet. Please contact your landlord or property manager to get set up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">My Property</h1>
          <p className="text-slate-500 mt-1">View your rental property details</p>
        </div>
        <Link href="/tenant/issues?action=new">
          <Button>
            <AlertCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </Link>
      </div>

      {/* Property details */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-6 border-b border-amber-200/50">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/20">
              <Home className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-950">{property.name}</h2>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>{property.address}, {property.city}, {property.postcode}</span>
              </div>
              <Badge className="mt-3" variant="outline">
                {property.type}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Property specs */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-950">Property Details</h3>
              <div className="grid gap-4 grid-cols-3">
                {property.bedrooms && (
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <BedDouble className="h-5 w-5 text-amber-500 mb-2" />
                    <span className="text-lg font-bold text-blue-950">{property.bedrooms}</span>
                    <span className="text-xs text-slate-500">Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <Bath className="h-5 w-5 text-amber-500 mb-2" />
                    <span className="text-lg font-bold text-blue-950">{property.bathrooms}</span>
                    <span className="text-xs text-slate-500">Bathrooms</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <Ruler className="h-5 w-5 text-amber-500 mb-2" />
                    <span className="text-lg font-bold text-blue-950">{property.squareFeet}</span>
                    <span className="text-xs text-slate-500">sq ft</span>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="pt-4">
                  <p className="text-sm text-slate-500">{property.description}</p>
                </div>
              )}
            </div>

            {/* Lease info */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-950">Lease Information</h3>
              <div className="space-y-3">
                {tenantProfile.rentAmount && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-sm text-slate-500">Monthly Rent</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      {formatCurrency(tenantProfile.rentAmount * 100)}
                    </p>
                  </div>
                )}

                {tenantProfile.depositPaid && (
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Deposit Paid</span>
                    <span className="font-semibold text-blue-950">
                      {formatCurrency(tenantProfile.depositPaid * 100)}
                    </span>
                  </div>
                )}

                {tenantProfile.leaseStart && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm text-slate-500">Lease Period</p>
                      <p className="font-semibold text-blue-950">
                        {formatDate(tenantProfile.leaseStart)} - {tenantProfile.leaseEnd ? formatDate(tenantProfile.leaseEnd) : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Landlord info */}
      {property.owner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500" />
              Landlord / Property Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xl font-semibold">
                {property.owner.name?.charAt(0) || 'L'}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-blue-950 text-lg">{property.owner.name}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {property.owner.email}
                  </a>
                  {property.owner.phone && (
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {property.owner.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick action */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-blue-950">Something not working?</h3>
              <p className="text-slate-600 mt-1">Report a maintenance issue and we'll get it fixed</p>
            </div>
            <Link href="/tenant/issues?action=new">
              <Button>
                <AlertCircle className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
