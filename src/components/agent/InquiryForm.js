'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'

const inquiryTypes = [
  { value: 'RENT', label: 'Rent Inquiry' },
  { value: 'SALE', label: 'Sale Inquiry' },
  { value: 'MAINTENANCE', label: 'Maintenance Inquiry' }
]

const sourceOptions = [
  { value: 'direct', label: 'Direct Contact' },
  { value: 'website', label: 'Website' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'property_portal', label: 'Property Portal' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'other', label: 'Other' }
]

export function InquiryForm({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'RENT',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
    budget: '',
    preferredArea: '',
    source: 'direct'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.clientName || !formData.clientEmail) {
      setError('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.clientEmail)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/agent/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create inquiry')
      }

      const data = await response.json()
      onSuccess?.(data.inquiry)
      onOpenChange(false)
      setFormData({
        type: 'RENT',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        message: '',
        budget: '',
        preferredArea: '',
        source: 'direct'
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Inquiry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Inquiry Type <span className="text-red-500">*</span></Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
              >
                {inquiryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientEmail">Email <span className="text-red-500">*</span></Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+971 50 123 4567"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget (AED)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="500000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preferredArea">Preferred Area</Label>
              <Input
                id="preferredArea"
                name="preferredArea"
                value={formData.preferredArea}
                onChange={handleChange}
                placeholder="e.g., Downtown, Marina"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message / Requirements</Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Client's requirements, preferences, notes..."
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Inquiry'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

