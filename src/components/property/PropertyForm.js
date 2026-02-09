'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DocumentUpload } from './DocumentUpload'

const propertyTypes = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
  { value: 'OTHER', label: 'Other' }
]

const listingTypes = [
  { value: 'RENT', label: 'For Rent' },
  { value: 'SALE', label: 'For Sale' },
  { value: 'BOTH', label: 'Rent or Sale' }
]

export function PropertyForm({ property, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.address || '',
    city: property?.city || '',
    postcode: property?.postcode || '',
    country: property?.country || 'United Arab Emirates',
    type: property?.type || 'APARTMENT',
    listingType: property?.listingType || 'RENT',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    squareFeet: property?.squareFeet || '',
    description: property?.description || '',
    monthlyRent: property?.monthlyRent || '',
    salePrice: property?.salePrice || '',
    isListed: property?.isListed || false
  })

  const [documents, setDocuments] = useState(property?.documents || [])
  const [listingError, setListingError] = useState('')

  // Check if both required documents are uploaded
  const hasDeed = documents.some(d => d.type === 'DEED')
  const hasNoc = documents.some(d => d.type === 'NOC')
  const hasRequiredDocs = hasDeed && hasNoc

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    if (name === 'isListed' && checked && !hasRequiredDocs) {
      const missing = []
      if (!hasDeed) missing.push('Title Deed')
      if (!hasNoc) missing.push('NOC')
      setListingError(`You must upload ${missing.join(' and ')} before listing this property.`)
      return
    }

    setListingError('')
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleDocumentsChange(docType, newDoc) {
    setDocuments(prev => {
      const filtered = prev.filter(d => d.type !== docType)
      if (newDoc) {
        return [...filtered, newDoc]
      }
      return filtered
    })
    setListingError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Check if trying to list without docs
    if (formData.isListed && !hasRequiredDocs) {
      const missing = []
      if (!hasDeed) missing.push('Title Deed')
      if (!hasNoc) missing.push('NOC')
      setListingError(`You must upload ${missing.join(' and ')} before listing this property.`)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Marina View Tower"
            className="mt-1.5"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dubai Marina Walk"
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Dubai"
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="00000"
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Property Type</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1.5 flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="listingType">Listing Type</Label>
          <select
            id="listingType"
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="mt-1.5 flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
          >
            {listingTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {(formData.listingType === 'RENT' || formData.listingType === 'BOTH') && (
          <div>
            <Label htmlFor="monthlyRent">Monthly Rent (AED)</Label>
            <Input
              id="monthlyRent"
              name="monthlyRent"
              type="number"
              value={formData.monthlyRent}
              onChange={handleChange}
              placeholder="5000"
              className="mt-1.5"
            />
          </div>
        )}

        {(formData.listingType === 'SALE' || formData.listingType === 'BOTH') && (
          <div>
            <Label htmlFor="salePrice">Sale Price (AED)</Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="1000000"
              className="mt-1.5"
            />
          </div>
        )}

        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="squareFeet">Square Feet</Label>
          <Input
            id="squareFeet"
            name="squareFeet"
            type="number"
            value={formData.squareFeet}
            onChange={handleChange}
            placeholder="1200"
            className="mt-1.5"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your property..."
            className="mt-1.5 flex w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Document upload section -- only show when editing an existing property */}
      {property?.id && (
        <div className="pt-4 border-t border-slate-200">
          <DocumentUpload
            propertyId={property.id}
            documents={documents}
            onDocumentsChange={handleDocumentsChange}
          />
        </div>
      )}

      {/* Listing toggle */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="isListed"
            checked={formData.isListed}
            onChange={handleChange}
            disabled={!hasRequiredDocs && !formData.isListed && property?.id}
            className="h-5 w-5 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
            List this property as available
          </span>
        </label>

        {/* Document requirement warning */}
        {property?.id && !hasRequiredDocs && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700">Documents required for listing</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Upload both the Title Deed and NOC above before you can list this property.
              </p>
            </div>
          </div>
        )}

        {/* Not yet saved property info */}
        {!property?.id && (
          <p className="mt-2 text-xs text-slate-400">
            Save the property first, then upload required documents (Deed & NOC) to enable listing.
          </p>
        )}

        {/* Listing error */}
        {listingError && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{listingError}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : property ? 'Update Property' : 'Add Property'}
        </Button>
      </div>
    </form>
  )
}
