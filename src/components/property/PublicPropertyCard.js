import Link from 'next/link'
import { Building2, MapPin, Bed, Bath, Square, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

const listingTypeConfig = {
  RENT: {
    label: 'For Rent',
    className: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  SALE: {
    label: 'For Sale',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  BOTH: {
    label: 'Rent or Buy',
    className: 'bg-purple-100 text-purple-700 border-purple-200'
  }
}

export function PublicPropertyCard({ property }) {
  const Icon = propertyTypeIcons[property.type] || Building2
  const listingConfig = listingTypeConfig[property.listingType] || listingTypeConfig.RENT

  const displayPrice = () => {
    if (property.listingType === 'SALE') {
      return {
        amount: property.salePrice,
        suffix: ''
      }
    }
    if (property.listingType === 'BOTH') {
      return {
        amount: property.monthlyRent,
        suffix: '/mo',
        secondary: property.salePrice ? `or ${formatCurrency(property.salePrice * 100)} to buy` : null
      }
    }
    return {
      amount: property.monthlyRent,
      suffix: '/mo'
    }
  }

  const price = displayPrice()

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group h-full border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-950/5 hover:border-amber-200/50 transition-all duration-300 overflow-hidden cursor-pointer">
        {/* Property image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Icon className="h-10 w-10 text-slate-300" />
            </div>
          </div>
          {/* Decorative gold accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={cn('font-medium', listingConfig.className)}>
              <Tag className="w-3 h-3 mr-1" />
              {listingConfig.label}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 text-slate-600 border-slate-200">
              {property.type}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and location */}
          <div className="mb-3">
            <h3 className="font-bold text-blue-950 truncate group-hover:text-amber-600 transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
              <span className="truncate">{property.address}, {property.city}</span>
            </div>
          </div>

          {/* Property details */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
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

          {/* Price */}
          {price.amount && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-500">
                  {property.listingType === 'SALE' ? 'Price' : 'Monthly Rent'}
                </span>
                <div className="text-right">
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    {formatCurrency(price.amount * 100)}{price.suffix}
                  </span>
                  {price.secondary && (
                    <p className="text-xs text-slate-400 mt-0.5">{price.secondary}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}



