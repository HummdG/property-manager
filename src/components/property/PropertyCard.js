import Link from 'next/link'
import { Building2, MapPin, Bed, Bath, Square, Users, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn, formatCurrency } from '@/lib/utils'

const propertyTypeIcons = {
  HOUSE: Building2,
  APARTMENT: Building2,
  CONDO: Building2,
  TOWNHOUSE: Building2,
  COMMERCIAL: Building2,
  LAND: Square,
  OTHER: Building2
}

export function PropertyCard({ property, onEdit, onDelete }) {
  const Icon = propertyTypeIcons[property.type] || Building2
  const hasTenant = property.tenantProfiles?.length > 0

  return (
    <Card className="group border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300 overflow-hidden">
      {/* Property image placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Icon className="h-10 w-10 text-slate-300" />
          </div>
        </div>
        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {property.isListed && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Listed
            </Badge>
          )}
          <Badge variant="outline" className="bg-white/90 text-slate-600 border-slate-200">
            {property.type}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          {hasTenant ? (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Users className="w-3 h-3 mr-1" />
              Occupied
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-white/90 text-slate-500 border-slate-200">
              Vacant
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-blue-950 truncate">{property.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
              <span className="truncate">{property.address}, {property.city}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-blue-950 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/owner/properties/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(property)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => onDelete?.(property)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Property details */}
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Monthly rent */}
        {property.monthlyRent && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-500">Monthly Rent</span>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                {formatCurrency(property.monthlyRent * 100)}
              </span>
            </div>
          </div>
        )}

        {/* Service requests count */}
        {property._count?.serviceRequests > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Active requests</span>
            <Badge variant="warning" className="font-semibold">
              {property._count.serviceRequests}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
