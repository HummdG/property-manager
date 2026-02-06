'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Building2, MapPin, Bed, Bath, Square, ArrowLeft,
  Loader2, Phone, Mail, Calendar, Home, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

const propertyTypeLabels = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  CONDO: 'Condo',
  TOWNHOUSE: 'Townhouse',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OTHER: 'Other'
}

const listingTypeLabels = {
  RENT: 'For Rent',
  SALE: 'For Sale',
  BOTH: 'Rent & Sale'
}

export default function PublicPropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/public/properties/${id}`)
        if (!response.ok) {
          setHasError(true)
          return
        }
        const data = await response.json()
        setProperty(data.property)
      } catch (error) {
        console.error('Failed to fetch property:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchProperty()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (hasError || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Building2 className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">Property not found</h3>
          <p className="mt-1 text-sm text-slate-500">
            This property may have been removed or is no longer listed.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const price = property.listingType === 'SALE'
    ? property.salePrice
    : property.monthlyRent

  const priceLabel = property.listingType === 'SALE'
    ? ''
    : '/mo'

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-950 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery / placeholder */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
            {property.images?.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Building2 className="h-12 w-12 text-slate-300" />
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-white/95 text-slate-700 border-slate-200 backdrop-blur-sm text-sm px-3 py-1">
                {propertyTypeLabels[property.type] || property.type}
              </Badge>
              <Badge className={
                property.listingType === 'SALE'
                  ? 'bg-blue-100 text-blue-700 border-blue-200 text-sm px-3 py-1'
                  : 'bg-emerald-100 text-emerald-700 border-emerald-200 text-sm px-3 py-1'
              }>
                {listingTypeLabels[property.listingType] || property.listingType}
              </Badge>
            </div>
          </div>

          {/* Additional images */}
          {property.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {property.images.slice(1, 5).map((img, i) => (
                <div key={i} className="h-24 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={img}
                    alt={`${property.name} - ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Property header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">{property.name}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>{property.address}, {property.city}, {property.postcode}</span>
            </div>
            {price && (
              <div className="mt-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  {formatCurrency(price * 100)}
                </span>
                {priceLabel && (
                  <span className="text-slate-400 ml-1">{priceLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 p-5 bg-slate-50 rounded-xl">
            {property.bedrooms && (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Bed className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bedrooms</p>
                  <p className="font-bold text-blue-950">{property.bedrooms}</p>
                </div>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Bath className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bathrooms</p>
                  <p className="font-bold text-blue-950">{property.bathrooms}</p>
                </div>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Square className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Area</p>
                  <p className="font-bold text-blue-950">{property.squareFeet.toLocaleString()} sqft</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <Home className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="font-bold text-blue-950">{propertyTypeLabels[property.type] || property.type}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h2 className="text-lg font-bold text-blue-950 mb-3">About this property</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Location */}
          <div>
            <h2 className="text-lg font-bold text-blue-950 mb-3">Location</h2>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-950">{property.address}</p>
                  <p className="text-sm text-slate-500">{property.city}, {property.postcode}, {property.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price card */}
          <Card className="border-slate-200 shadow-md sticky top-24">
            <CardContent className="p-6">
              {price && (
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 mb-1">
                    {property.listingType === 'SALE' ? 'Asking Price' : 'Monthly Rent'}
                  </p>
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    {formatCurrency(price * 100)}
                  </span>
                  {priceLabel && (
                    <span className="text-slate-400">{priceLabel}</span>
                  )}
                </div>
              )}

              {/* Both prices */}
              {property.listingType === 'BOTH' && (
                <div className="space-y-2 mb-4">
                  {property.monthlyRent && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Monthly Rent</span>
                      <span className="font-bold text-blue-950">
                        {formatCurrency(property.monthlyRent * 100)}
                      </span>
                    </div>
                  )}
                  {property.salePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Sale Price</span>
                      <span className="font-bold text-blue-950">
                        {formatCurrency(property.salePrice * 100)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-4" />

              {/* Owner info */}
              {property.owner && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-500 mb-3">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-950">{property.owner.name || 'Property Owner'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact actions */}
              <div className="space-y-3">
                {property.owner?.phone && (
                  <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20">
                    <a href={`tel:${property.owner.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Owner
                    </a>
                  </Button>
                )}
                {property.owner?.email && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={`mailto:${property.owner.email}?subject=Inquiry about ${property.name}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                )}
                {!property.owner?.phone && !property.owner?.email && (
                  <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                    <Link href="/register">
                      Sign Up to Contact Owner
                    </Link>
                  </Button>
                )}
              </div>

              {/* Listed date */}
              {property.createdAt && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Listed {new Date(property.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
