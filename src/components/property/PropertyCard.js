'use client'

import Link from 'next/link'
import { Building2, MapPin, Bed, Bath, Square, Users, Eye, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function PropertyCard({ property, onEdit, onDelete, basePath = '/owner' }) {
  const hasTenant = property.tenantProfiles?.length > 0

  return (
    <div className="border border-wire bg-cream flex flex-col group">
      {/* Image area */}
      <div className="relative h-32 bg-linen border-b border-wire overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-wire" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-3 pt-3">
          <div className="flex gap-1.5">
            {property.isListed && (
              <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-bronze/10 text-bronze border border-bronze/40">
                Listed
              </span>
            )}
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-cream text-pewter border border-wire">
            {property.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          {hasTenant ? (
            <span className="inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-sable text-cream border border-sable/80">
              <Users className="h-2.5 w-2.5" />
              Occupied
            </span>
          ) : (
            <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-cream text-fog border border-wire">
              Vacant
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-display text-[1.0625rem] font-light text-sable leading-snug truncate">
            {property.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[0.75rem] text-fog">
            <MapPin className="h-3 w-3 text-bronze flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>
        </div>

        {(property.bedrooms || property.bathrooms || property.squareFeet) && (
          <div className="flex items-center gap-4 text-[0.75rem] pt-3 border-t border-wire">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 text-fog">
                <Bed className="h-3 w-3 text-haze" />
                <span className="font-medium text-sable">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 text-fog">
                <Bath className="h-3 w-3 text-haze" />
                <span className="font-medium text-sable">{property.bathrooms}</span>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center gap-1.5 text-fog">
                <Square className="h-3 w-3 text-haze" />
                <span className="font-medium text-sable">{property.squareFeet.toLocaleString()}</span>
                <span className="text-haze text-[0.7rem]">sqft</span>
              </div>
            )}
          </div>
        )}

        {property.monthlyRent && (
          <div className="flex items-baseline justify-between pt-3 border-t border-wire mt-auto">
            <span className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Monthly Rent</span>
            <span className="font-display text-[1.25rem] font-light text-bronze leading-none">
              {formatCurrency(property.monthlyRent * 100)}
            </span>
          </div>
        )}
      </div>

      {/* Action strip */}
      <div className="flex border-t border-wire">
        <Link
          href={`${basePath}/properties/${property.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium text-fog hover:text-sable hover:bg-linen transition-colors border-r border-wire"
        >
          <Eye className="h-3 w-3" />
          View
        </Link>
        <button
          onClick={() => onEdit?.(property)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium text-fog hover:text-sable hover:bg-linen transition-colors border-r border-wire"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete?.(property)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium text-fog hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  )
}
