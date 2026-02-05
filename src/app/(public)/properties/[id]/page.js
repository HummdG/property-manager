import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Tag, 
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  Check
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InquiryForm } from '@/components/property'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

async function getProperty(id) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  try {
    const res = await fetch(`${baseUrl}/api/public/properties/${id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error('Failed to fetch property')
    }
    
    const data = await res.json()
    return data.property
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

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

const propertyFeatures = [
  'Air Conditioning',
  'Central Heating',
  'Parking',
  'Security System',
  'Swimming Pool',
  'Gym Access',
  'Garden',
  'Balcony'
]

export async function generateMetadata({ params }) {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    return {
      title: 'Property Not Found | GoFor Properties'
    }
  }

  return {
    title: `${property.name} | GoFor Properties`,
    description: property.description || `${property.bedrooms} bedroom ${property.type.toLowerCase()} in ${property.city}`
  }
}

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    notFound()
  }

  const Icon = propertyTypeIcons[property.type] || Building2
  const listingConfig = listingTypeConfig[property.listingType] || listingTypeConfig.RENT

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/properties" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-950 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Properties
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery Placeholder */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-lg">
                <Icon className="h-16 w-16 text-slate-300" />
              </div>
            </div>
            {/* Decorative gold accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={cn('font-medium text-sm px-3 py-1', listingConfig.className)}>
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                {listingConfig.label}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-white/90 text-slate-600 border-slate-200 text-sm px-3 py-1">
                {property.type}
              </Badge>
            </div>
          </div>

          {/* Property Details Card */}
          <Card>
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-950 mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span>{property.address}, {property.city}, {property.postcode}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Bed className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-bold text-blue-950">{property.bedrooms}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Bath className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-bold text-blue-950">{property.bathrooms}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Bathrooms</p>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Square className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-bold text-blue-950">{property.squareFeet.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Sq Ft</p>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-950 mb-3">Pricing</h2>
                <div className="flex flex-wrap gap-4">
                  {(property.listingType === 'RENT' || property.listingType === 'BOTH') && property.monthlyRent && (
                    <div className="bg-blue-50 rounded-xl px-5 py-4 flex-1 min-w-[200px]">
                      <p className="text-sm text-blue-600 mb-1">Monthly Rent</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {formatCurrency(property.monthlyRent * 100)}<span className="text-lg">/mo</span>
                      </p>
                    </div>
                  )}
                  {(property.listingType === 'SALE' || property.listingType === 'BOTH') && property.salePrice && (
                    <div className="bg-emerald-50 rounded-xl px-5 py-4 flex-1 min-w-[200px]">
                      <p className="text-sm text-emerald-600 mb-1">Sale Price</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        {formatCurrency(property.salePrice * 100)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-950 mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Features */}
              <div>
                <h2 className="text-lg font-semibold text-blue-950 mb-3">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyFeatures.map((feature, index) => (
                    <div 
                      key={feature}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        index < 4 ? "text-slate-700" : "text-slate-400"
                      )}
                    >
                      <Check className={cn(
                        "h-4 w-4",
                        index < 4 ? "text-emerald-500" : "text-slate-300"
                      )} />
                      {feature}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  * Features are illustrative. Contact owner for actual amenities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-blue-950 mb-4">Location</h2>
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">
                    {property.address}<br />
                    {property.city}, {property.postcode}<br />
                    {property.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary Card */}
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white">
            <CardContent className="p-6">
              <div className="text-center">
                {property.listingType === 'SALE' && property.salePrice ? (
                  <>
                    <p className="text-sm text-slate-500 mb-1">Sale Price</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      {formatCurrency(property.salePrice * 100)}
                    </p>
                  </>
                ) : property.monthlyRent ? (
                  <>
                    <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      {formatCurrency(property.monthlyRent * 100)}<span className="text-xl">/mo</span>
                    </p>
                  </>
                ) : null}
              </div>
              
              {property.listingType === 'BOTH' && property.salePrice && property.monthlyRent && (
                <p className="text-sm text-slate-500 text-center mt-2">
                  or buy for {formatCurrency(property.salePrice * 100)}
                </p>
              )}

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Property Type</span>
                  <span className="font-medium text-blue-950">{property.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Listed</span>
                  <span className="font-medium text-blue-950">{formatDate(property.createdAt)}</span>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bedrooms</span>
                    <span className="font-medium text-blue-950">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bathrooms</span>
                    <span className="font-medium text-blue-950">{property.bathrooms}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Owner Info Card */}
          {property.owner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-950 mb-4">Listed By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-semibold">
                    {property.owner.name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="font-medium text-blue-950">{property.owner.name || 'Property Owner'}</p>
                    <p className="text-sm text-slate-500">Property Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inquiry Form */}
          <InquiryForm property={property} />
        </div>
      </div>
    </div>
  )
}

