'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Building2, MapPin, Bed, Bath, Square, ArrowLeft,
  Loader2, Phone, Mail, Calendar, Home, User, MessageCircle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PROPERTY_TYPE_LABELS = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  CONDO: 'Condo',
  TOWNHOUSE: 'Townhouse',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OTHER: 'Other',
}

const LISTING_TYPE_LABELS = {
  RENT: 'For Rent',
  SALE: 'For Sale',
  BOTH: 'Rent & Sale',
}

export default function PublicPropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/public/properties/${id}`)
        if (!response.ok) { setHasError(true); return }
        const data = await response.json()
        setProperty(data.property)
      } catch {
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
        <Loader2 className="w-7 h-7 animate-spin text-bronze" />
      </div>
    )
  }

  if (hasError || !property) {
    return (
      <div className="inst-container py-24 text-center">
        <div className="w-16 h-16 border border-wire bg-cream flex items-center justify-center mx-auto mb-5">
          <Building2 className="w-8 h-8 text-wire" />
        </div>
        <h3 className="font-display text-xl font-medium text-sable mb-2">Property not found</h3>
        <p className="text-[0.875rem] text-fog mb-6">
          This property may have been removed or is no longer listed.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 border border-wire text-pewter text-[0.8125rem] px-5 py-2.5 hover:bg-linen transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Properties
        </Link>
      </div>
    )
  }

  const price = property.listingType === 'SALE' ? property.salePrice : property.monthlyRent
  const priceLabel = property.listingType === 'SALE' ? '' : '/ month'
  const isRent = property.listingType === 'RENT' || property.listingType === 'BOTH'
  const allImages = property.images || []
  const whatsappUrl = `https://wa.me/447948623631?text=${encodeURIComponent(
    `Hi, I'm interested in this property: ${property.name}\n${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${id}`
  )}`

  return (
    <div>
      {/* ── Breadcrumb bar ──────────────────────────────────── */}
      <div className="bg-cream border-b border-wire">
        <div className="inst-container py-4">
          <div className="flex items-center gap-2 text-[0.75rem] text-fog">
            <Link href="/properties" className="hover:text-sable transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3 h-3" />
              Properties
            </Link>
            <span className="text-bronze/40">/</span>
            <span className="text-pewter truncate max-w-xs">{property.name}</span>
          </div>
        </div>
      </div>

      {/* ── Hero image ──────────────────────────────────────── */}
      <div className="bg-sable relative overflow-hidden" style={{ height: 'clamp(240px, 45vw, 520px)' }}>
        {allImages.length > 0 ? (
          <img
            src={allImages[activeImage]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center inst-hero-grid">
            <Building2 className="w-16 h-16 text-bronze/20" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-sable/60 via-transparent to-transparent pointer-events-none" />

        {/* Tags */}
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="text-[0.6rem] border border-wire/60 bg-cream/90 text-pewter uppercase tracking-[0.12em] px-2.5 py-1.5 backdrop-blur-sm">
            {PROPERTY_TYPE_LABELS[property.type] || property.type}
          </span>
          <span className={`text-[0.6rem] border uppercase tracking-[0.12em] px-2.5 py-1.5 backdrop-blur-sm ${
            isRent ? 'border-bronze/50 bg-bronze/20 text-bronze-light' : 'border-cream/40 bg-sable/40 text-cream'
          }`}>
            {LISTING_TYPE_LABELS[property.listingType] || property.listingType}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-5 left-5">
          {price && (
            <div>
              <span className="font-display text-[2rem] font-light text-cream leading-none">
                {formatCurrency(price * 100)}
              </span>
              {priceLabel && (
                <span className="text-haze text-sm ml-2">{priceLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="bg-cobalt border-b border-bronze/10">
          <div className="inst-container py-3">
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-12 flex-shrink-0 overflow-hidden border-2 transition-all duration-150 ${
                    i === activeImage ? 'border-bronze' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────── */}
      <div className="inst-container py-12">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left: details */}
          <div className="lg:col-span-7 space-y-10">

            {/* Title + location */}
            <div>
              <h1
                className="font-display font-light text-sable leading-tight mb-3"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
              >
                {property.name}
              </h1>
              <div className="flex items-center gap-2 text-[0.9rem] text-fog">
                <MapPin className="w-4 h-4 text-bronze flex-shrink-0" />
                <span>{property.address}, {property.city}{property.postcode ? `, ${property.postcode}` : ''}</span>
              </div>
            </div>

            {/* Specs strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-wire">
              {[
                property.bedrooms && { Icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                property.bathrooms && { Icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                property.squareFeet && { Icon: Square, label: 'Area', value: `${property.squareFeet.toLocaleString()} sqft` },
                { Icon: Home, label: 'Type', value: PROPERTY_TYPE_LABELS[property.type] || property.type },
              ].filter(Boolean).map(({ Icon, label, value }) => (
                <div key={label} className="bg-linen px-5 py-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-bronze" />
                    <span className="text-[0.65rem] text-fog uppercase tracking-[0.12em]">{label}</span>
                  </div>
                  <div className="font-display text-[1.125rem] font-medium text-sable">{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <span className="inst-label">About this property</span>
                <p className="text-dusk text-[0.9375rem] leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Location */}
            <div>
              <span className="inst-label">Location</span>
              <div className="border border-wire bg-linen p-5 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                <div>
                  <p className="text-[0.9375rem] font-medium text-sable">{property.address}</p>
                  <p className="text-[0.8125rem] text-fog mt-0.5">
                    {property.city}{property.postcode ? `, ${property.postcode}` : ''}
                    {property.country ? `, ${property.country}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: sticky price card */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-wire bg-cream sticky top-24">

              {/* Price */}
              <div className="p-7 border-b border-wire">
                <p className="inst-label mb-1">
                  {property.listingType === 'SALE' ? 'Asking Price' : 'Monthly Rent'}
                </p>
                {price && (
                  <div className="font-display text-[2.5rem] font-light text-sable leading-none">
                    {formatCurrency(price * 100)}
                    {priceLabel && (
                      <span className="text-[1rem] text-fog ml-2 font-sans">{priceLabel}</span>
                    )}
                  </div>
                )}

                {/* Both prices */}
                {property.listingType === 'BOTH' && (
                  <div className="mt-4 space-y-2">
                    {property.monthlyRent && (
                      <div className="flex justify-between text-[0.875rem]">
                        <span className="text-fog">Monthly Rent</span>
                        <span className="font-medium text-sable">{formatCurrency(property.monthlyRent * 100)}</span>
                      </div>
                    )}
                    {property.salePrice && (
                      <div className="flex justify-between text-[0.875rem]">
                        <span className="text-fog">Sale Price</span>
                        <span className="font-medium text-sable">{formatCurrency(property.salePrice * 100)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Owner */}
              {property.owner && (
                <div className="p-7 border-b border-wire">
                  <p className="inst-label">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sable flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-bronze" />
                    </div>
                    <span className="text-[0.9375rem] font-medium text-sable">
                      {property.owner.name || 'Property Owner'}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="p-7 space-y-3">
                {property.owner?.phone && (
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="flex items-center justify-center gap-2.5 w-full bg-sable text-cream py-3 text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Owner
                  </a>
                )}
                {property.owner?.email && (
                  <a
                    href={`mailto:${property.owner.email}?subject=Enquiry: ${property.name}`}
                    className="flex items-center justify-center gap-2.5 w-full border border-wire text-pewter py-3 text-[0.8125rem] tracking-wide hover:bg-linen transition-colors duration-150"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send Email
                  </a>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full border border-[#25D366]/40 bg-[#25D366]/5 text-[#128C7E] py-3 text-[0.8125rem] tracking-wide hover:bg-[#25D366]/10 transition-colors duration-150"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Enquire via WhatsApp
                </a>
                {!property.owner?.phone && !property.owner?.email && (
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 w-full border border-bronze/30 bg-bronze/5 text-bronze py-3 text-[0.8125rem] tracking-wide hover:bg-bronze/10 transition-colors duration-150"
                  >
                    Sign Up to Contact Owner
                  </Link>
                )}
              </div>

              {/* Listed date */}
              {property.createdAt && (
                <div className="px-7 pb-6 border-t border-wire pt-5">
                  <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Listed{' '}
                      {new Date(property.createdAt).toLocaleDateString('en-AE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
