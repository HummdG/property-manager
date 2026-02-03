import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ArrowLeft, Building2, MapPin, Bed, Bath, Square, Users, Calendar, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

async function getProperty(id, userId) {
  const property = await db.property.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      tenantProfiles: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } }
        }
      },
      serviceRequests: {
        include: {
          category: { select: { name: true } },
          requester: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!property || property.ownerId !== userId) {
    return null
  }

  return property
}

export default async function PropertyDetailPage({ params }) {
  const session = await auth()
  const { id } = await params
  const property = await getProperty(id, session.user.id)

  if (!property) {
    notFound()
  }

  const tenant = property.tenantProfiles[0]?.user

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-start gap-4">
        <Link href="/owner/properties">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-950">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-blue-950">{property.name}</h1>
            {property.isListed && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Listed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-slate-500">
            <MapPin className="h-4 w-4 text-amber-500" />
            <span>{property.address}, {property.city}, {property.postcode}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Building2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-semibold text-blue-950">{property.type}</p>
                  </div>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Bed className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bedrooms</p>
                      <p className="font-semibold text-blue-950">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Bath className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bathrooms</p>
                      <p className="font-semibold text-blue-950">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Square className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Area</p>
                      <p className="font-semibold text-blue-950">{property.squareFeet.toLocaleString()} sqft</p>
                    </div>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-blue-950 mb-2">Description</h3>
                  <p className="text-slate-500">{property.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Service Requests</CardTitle>
              <Link href={`/owner/requests?property=${property.id}`}>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {property.serviceRequests.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center">No service requests</p>
              ) : (
                <div className="space-y-3">
                  {property.serviceRequests.map(request => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-blue-950 truncate">{request.title}</p>
                        <p className="text-sm text-slate-500">
                          {request.category?.name} • {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rent info */}
          {property.monthlyRent && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500">Monthly Rent</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mt-1">
                  {formatCurrency(property.monthlyRent * 100)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tenant info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tenant ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-950">{tenant.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                      <Mail className="h-4 w-4" />
                      <span>{tenant.email}</span>
                    </div>
                    {tenant.phone && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <Phone className="h-4 w-4" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                  </div>
                  {property.tenantProfiles[0]?.leaseStart && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        <span>Lease: {formatDate(property.tenantProfiles[0].leaseStart)} - {property.tenantProfiles[0].leaseEnd ? formatDate(property.tenantProfiles[0].leaseEnd) : 'Ongoing'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No tenant assigned</p>
                  <Badge variant="outline" className="mt-2">
                    Vacant
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property info */}
          <Card>
            <CardContent className="pt-6 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Added</span>
                <span className="font-medium text-blue-950">{formatDate(property.createdAt)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Last updated</span>
                <span className="font-medium text-blue-950">{formatDate(property.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
