'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const activityTypes = [
  { value: 'CALL', label: 'Phone Call', description: 'Client calls, follow-up calls' },
  { value: 'VIEWING', label: 'Property Viewing', description: 'Showing property to clients' },
  { value: 'MEETING', label: 'Meeting', description: 'Client meetings, negotiations' },
  { value: 'SITE_VISIT', label: 'Site Visit', description: 'Property inspections, assessments' },
  { value: 'PAPERWORK', label: 'Paperwork', description: 'Documentation, contracts' },
  { value: 'OTHER', label: 'Other', description: 'Other work activities' }
]

export default function NewLogPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    type: 'CALL',
    title: '',
    description: '',
    location: '',
    duration: '',
    date: new Date().toISOString().slice(0, 16)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation is not supported by your browser'); return }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setFormData(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }))
        } catch (err) {
          console.error('Geocoding error:', err)
        } finally {
          setIsGettingLocation(false)
        }
      },
      (err) => { console.error('Location error:', err); setError('Failed to get current location'); setIsGettingLocation(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title) { setError('Please enter a title'); return }
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/agent/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Failed to create log') }
      router.push('/agent/logs')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link href="/agent/logs" className="inline-flex items-center gap-2 text-[0.75rem] text-fog hover:text-sable transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to logs
      </Link>

      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Log Activity</h1>
      </div>

      <div className="border border-wire bg-cream">
        <div className="px-5 py-4 border-b border-wire">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Activity Details</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Activity type */}
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-3">Activity Type</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activityTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={cn(
                    'p-3.5 border text-left transition-all',
                    formData.type === type.value
                      ? 'border-bronze bg-bronze/5'
                      : 'border-wire bg-cream hover:border-bronze/40 hover:bg-linen'
                  )}
                >
                  <p className="text-[0.8125rem] font-medium text-sable">{type.label}</p>
                  <p className="text-[0.7rem] text-fog mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Client meeting at Marina Tower"
              required
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>

          {/* Date and duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
                Date & Time
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Location
            </label>
            <div className="flex gap-2">
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Marina Tower, Dubai"
                className="flex-1 bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-10 h-10 border border-wire bg-cream flex items-center justify-center text-fog hover:text-bronze hover:border-bronze/40 disabled:opacity-40 transition-colors flex-shrink-0"
              >
                {isGettingLocation ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What did you do during this activity..."
              rows={5}
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-[0.8125rem] text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 text-[0.75rem] uppercase tracking-[0.1em] font-medium border border-wire bg-cream text-fog hover:text-sable hover:bg-linen transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
