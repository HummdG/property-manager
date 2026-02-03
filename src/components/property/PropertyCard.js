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
    <Card className="group bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors overflow-hidden">
      {/* Property image placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-16 w-16 text-slate-700" />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {property.isListed && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Listed
            </Badge>
          )}
          <Badge variant="outline" className="bg-slate-900/80 text-slate-300 border-slate-700">
            {property.type}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          {hasTenant ? (
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
              <Users className="w-3 h-3 mr-1" />
              Occupied
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-900/80 text-slate-400 border-slate-700">
              Vacant
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">{property.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{property.address}, {property.city}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer">
                <Link href={`/owner/properties/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
                onClick={() => onEdit?.(property)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                onClick={() => onDelete?.(property)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Property details */}
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Monthly rent */}
        {property.monthlyRent && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-400">Monthly Rent</span>
              <span className="text-lg font-semibold text-teal-400">
                {formatCurrency(property.monthlyRent * 100)}
              </span>
            </div>
          </div>
        )}

        {/* Service requests count */}
        {property._count?.serviceRequests > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Active requests</span>
            <Badge variant="outline" className="text-amber-400 border-amber-500/30">
              {property._count.serviceRequests}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

