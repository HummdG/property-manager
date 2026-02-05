'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Try to get address from coordinates (reverse geocoding)
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Use a free geocoding service or just show coordinates
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          setFormData(prev => ({ ...prev, location: locationString }))
        } catch (err) {
          console.error('Geocoding error:', err)
        } finally {
          setIsGettingLocation(false)
        }
      },
      (err) => {
        console.error('Location error:', err)
        setError('Failed to get current location')
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title) {
      setError('Please enter a title')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/agent/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create log')
      }

      router.push('/agent/logs')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/agent/logs"
        className="inline-flex items-center text-slate-500 hover:text-blue-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to logs
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Log Activity</h1>
        <p className="text-slate-500 mt-1">Record your daily work activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity type selection */}
            <div>
              <Label>Activity Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {activityTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.type === type.value
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <p className="font-medium text-blue-950">{type.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Client meeting at Marina Tower"
                className="mt-1"
                required
              />
            </div>

            {/* Date and duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Marina Tower, Dubai"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What did you do during this activity..."
                rows={5}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Activity'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

