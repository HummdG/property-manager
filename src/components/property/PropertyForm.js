'use client'

import { useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
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

const fieldClass = 'w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors'
const labelClass = 'block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5'

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
      if (newDoc) return [...filtered, newDoc]
      return filtered
    })
    setListingError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Property Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Marina View Tower"
            className={fieldClass}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Street Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dubai Marina Walk"
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Dubai"
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Postcode</label>
          <input
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="00000"
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={fieldClass}
          >
            {propertyTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Listing Type</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className={fieldClass}
          >
            {listingTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {(formData.listingType === 'RENT' || formData.listingType === 'BOTH') && (
          <div>
            <label className={labelClass}>Monthly Rent (AED)</label>
            <input
              name="monthlyRent"
              type="number"
              value={formData.monthlyRent}
              onChange={handleChange}
              placeholder="5000"
              className={fieldClass}
            />
          </div>
        )}

        {(formData.listingType === 'SALE' || formData.listingType === 'BOTH') && (
          <div>
            <label className={labelClass}>Sale Price (AED)</label>
            <input
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="1000000"
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Bedrooms</label>
          <input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Bathrooms</label>
          <input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Square Feet</label>
          <input
            name="squareFeet"
            type="number"
            value={formData.squareFeet}
            onChange={handleChange}
            placeholder="1200"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your property..."
            className={`${fieldClass} resize-none`}
          />
        </div>
      </div>

      {property?.id && (
        <div className="pt-4 border-t border-wire">
          <DocumentUpload
            propertyId={property.id}
            documents={documents}
            onDocumentsChange={handleDocumentsChange}
          />
        </div>
      )}

      <div className="pt-4 border-t border-wire space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="isListed"
            checked={formData.isListed}
            onChange={handleChange}
            disabled={!hasRequiredDocs && !formData.isListed && property?.id}
            className="h-4 w-4 border border-wire bg-cream text-bronze focus:ring-0 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed accent-bronze"
          />
          <span className="text-[0.8125rem] text-fog group-hover:text-sable transition-colors">
            List this property as available
          </span>
        </label>

        {property?.id && !hasRequiredDocs && (
          <div className="flex items-start gap-2 p-3 border border-bronze/20 bg-bronze/5">
            <AlertCircle className="h-3.5 w-3.5 text-bronze flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.75rem] font-medium text-bronze">Documents required for listing</p>
              <p className="text-[0.7rem] text-fog mt-0.5">Upload both the Title Deed and NOC above before you can list this property.</p>
            </div>
          </div>
        )}

        {!property?.id && (
          <p className="text-[0.7rem] text-haze">
            Save the property first, then upload required documents (Deed &amp; NOC) to enable listing.
          </p>
        )}

        {listingError && (
          <div className="flex items-start gap-2 p-3 border border-red-200 bg-red-50">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[0.75rem] text-red-600">{listingError}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-wire">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium border border-wire bg-cream text-fog hover:text-sable hover:bg-linen transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : property ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  )
}
