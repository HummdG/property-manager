'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const propertyTypes = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
  { value: 'OTHER', label: 'Other' }
]

export function PropertyForm({ property, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.address || '',
    city: property?.city || '',
    postcode: property?.postcode || '',
    country: property?.country || 'United Kingdom',
    type: property?.type || 'HOUSE',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    squareFeet: property?.squareFeet || '',
    description: property?.description || '',
    monthlyRent: property?.monthlyRent || '',
    isListed: property?.isListed || false
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name" className="text-slate-300">Property Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sunny Villa"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="address" className="text-slate-300">Street Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
            required
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-slate-300">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="London"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
            required
          />
        </div>

        <div>
          <Label htmlFor="postcode" className="text-slate-300">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="SW1A 1AA"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
            required
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-slate-300">Property Type</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1.5 flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="monthlyRent" className="text-slate-300">Monthly Rent (£)</Label>
          <Input
            id="monthlyRent"
            name="monthlyRent"
            type="number"
            value={formData.monthlyRent}
            onChange={handleChange}
            placeholder="1500"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
          />
        </div>

        <div>
          <Label htmlFor="bedrooms" className="text-slate-300">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms" className="text-slate-300">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
          />
        </div>

        <div>
          <Label htmlFor="squareFeet" className="text-slate-300">Square Feet</Label>
          <Input
            id="squareFeet"
            name="squareFeet"
            type="number"
            value={formData.squareFeet}
            onChange={handleChange}
            placeholder="1200"
            className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-100"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description" className="text-slate-300">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your property..."
            className="mt-1.5 flex w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isListed"
              checked={formData.isListed}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500/20"
            />
            <span className="text-sm text-slate-300">List this property as available</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
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

