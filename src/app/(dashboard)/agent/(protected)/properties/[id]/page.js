import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  ArrowLeft, Building2, MapPin, Bed, Bath, Square,
  FileText, CheckCircle, Calendar
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

async function getProperty(id, userId) {
  const property = await db.property.findUnique({
    where: { id },
    include: {
      documents: {
        select: { id: true, type: true, fileName: true, fileUrl: true, uploadedAt: true }
      }
    }
  })

  if (!property || property.ownerId !== userId) return null
  return property
}

export default async function AgentPropertyDetailPage({ params }) {
  const session = await auth()
  const { id } = await params
  const property = await getProperty(id, session.user.id)

  if (!property) notFound()

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/agent/properties"
            className="flex items-center justify-center w-8 h-8 border border-wire bg-cream hover:bg-linen transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-fog" />
          </Link>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
            <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">{property.name}</h1>
          </div>
          {property.isListed && (
            <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-bronze/10 text-bronze border border-bronze/40 self-end mb-1">
              Listed
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Property Details</p>
            </div>
            <div className="p-5 grid gap-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-4 w-4 text-haze" />
                </div>
                <div>
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Type</p>
                  <p className="text-[0.8125rem] font-medium text-sable">{property.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-bronze" />
                </div>
                <div>
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Location</p>
                  <p className="text-[0.8125rem] font-medium text-sable">{property.city}, {property.postcode}</p>
                </div>
              </div>

              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                    <Bed className="h-4 w-4 text-haze" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Bedrooms</p>
                    <p className="text-[0.8125rem] font-medium text-sable">{property.bedrooms}</p>
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                    <Bath className="h-4 w-4 text-haze" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Bathrooms</p>
                    <p className="text-[0.8125rem] font-medium text-sable">{property.bathrooms}</p>
                  </div>
                </div>
              )}

              {property.squareFeet && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                    <Square className="h-4 w-4 text-haze" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Area</p>
                    <p className="text-[0.8125rem] font-medium text-sable">{property.squareFeet.toLocaleString()} sqft</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-haze" />
                </div>
                <div>
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Added</p>
                  <p className="text-[0.8125rem] font-medium text-sable">{formatDate(property.createdAt)}</p>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="px-5 pb-5 pt-0">
                <div className="pt-4 border-t border-wire">
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em] mb-2">Description</p>
                  <p className="text-[0.8125rem] text-fog leading-relaxed">{property.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Pricing */}
          {(property.monthlyRent || property.salePrice) && (
            <div className="border border-wire bg-cream p-5 space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Pricing</p>
              {property.monthlyRent && (
                <div>
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Monthly Rent</p>
                  <p className="font-display text-[1.75rem] font-light text-bronze leading-none mt-0.5">
                    {formatCurrency(property.monthlyRent * 100)}
                  </p>
                </div>
              )}
              {property.salePrice && (
                <div>
                  <p className="text-[0.7rem] text-fog uppercase tracking-[0.08em]">Sale Price</p>
                  <p className="font-display text-[1.75rem] font-light text-bronze leading-none mt-0.5">
                    {formatCurrency(property.salePrice * 100)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-bronze" />
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Documents</p>
            </div>
            <div className="p-5">
              {property.documents?.length > 0 ? (
                <div className="space-y-3">
                  {property.documents.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 border border-wire bg-linen"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.8125rem] font-medium text-sable">
                          {doc.type === 'DEED' ? 'Title Deed' : 'NOC'}
                        </p>
                        <p className="text-[0.7rem] text-fog truncate">{doc.fileName}</p>
                      </div>
                      <span className="text-[0.65rem] text-haze flex-shrink-0">{formatDate(doc.uploadedAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="h-6 w-6 text-wire mx-auto mb-2" />
                  <p className="text-[0.8125rem] text-fog">No documents uploaded</p>
                  <p className="text-[0.75rem] text-haze mt-1">Edit the property to upload Deed &amp; NOC</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
