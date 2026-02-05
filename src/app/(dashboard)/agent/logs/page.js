'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Loader2, Filter, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityLogEntry, ActivityLogForm } from '@/components/agent'
import { useAgentStore } from '@/stores/agent-store'
import { cn } from '@/lib/utils'

const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'CALL', label: 'Calls' },
  { value: 'VIEWING', label: 'Viewings' },
  { value: 'MEETING', label: 'Meetings' },
  { value: 'SITE_VISIT', label: 'Site Visits' },
  { value: 'PAPERWORK', label: 'Paperwork' },
  { value: 'OTHER', label: 'Other' }
]

export default function LogsPage() {
  const {
    dailyLogs,
    logsLoading,
    logFilters,
    logsPagination,
    locations,
    isTrackingLocation,
    setDailyLogs,
    setLogsLoading,
    setLogFilters,
    setLogsPagination,
    addDailyLog,
    setLocations,
    setIsTrackingLocation,
    addLocation
  } = useAgentStore()

  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [showLocationMap, setShowLocationMap] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.set('page', logsPagination.page.toString())
      params.set('limit', logsPagination.limit.toString())

      if (logFilters.type !== 'all') {
        params.set('type', logFilters.type)
      }
      if (logFilters.dateFrom) {
        params.set('dateFrom', logFilters.dateFrom)
      }
      if (logFilters.dateTo) {
        params.set('dateTo', logFilters.dateTo)
      }

      const response = await fetch(`/api/agent/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')

      const data = await response.json()
      setDailyLogs(data.logs)
      setLogsPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLogsLoading(false)
    }
  }, [logFilters, logsPagination.page, logsPagination.limit, setDailyLogs, setLogsLoading, setLogsPagination])

  const fetchLocations = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/agent/location?date=${today}`)
      if (!response.ok) throw new Error('Failed to fetch locations')

      const data = await response.json()
      setLocations(data.locations)
    } catch (err) {
      console.error('Failed to fetch locations:', err)
    }
  }, [setLocations])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    if (showLocationMap) {
      fetchLocations()
    }
  }, [showLocationMap, fetchLocations])

  // Location tracking
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsTrackingLocation(true)

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }

        // Send to server
        try {
          const response = await fetch('/api/agent/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location)
          })

          if (response.ok) {
            const data = await response.json()
            addLocation(data.location)
          }
        } catch (err) {
          console.error('Failed to record location:', err)
        }
      },
      (err) => {
        console.error('Location error:', err)
        setIsTrackingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Update every minute
      }
    )

    // Store watchId for cleanup
    window.locationWatchId = watchId
  }

  const stopLocationTracking = () => {
    if (window.locationWatchId) {
      navigator.geolocation.clearWatch(window.locationWatchId)
      window.locationWatchId = null
    }
    setIsTrackingLocation(false)
  }

  const handleFilterChange = (filters) => {
    setLogFilters(filters)
    setLogsPagination({ ...logsPagination, page: 1 })
  }

  const handleLogCreated = (log) => {
    addDailyLog(log)
    setShowForm(false)
  }

  const handlePageChange = (newPage) => {
    setLogsPagination({ ...logsPagination, page: newPage })
  }

  // Group logs by date
  const groupedLogs = dailyLogs.reduce((groups, log) => {
    const date = new Date(log.date).toLocaleDateString('en-AE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(log)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Daily Logs</h1>
          <p className="text-slate-500 mt-1">Track your daily activities and location</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isTrackingLocation ? 'destructive' : 'outline'}
            onClick={isTrackingLocation ? stopLocationTracking : startLocationTracking}
          >
            <MapPin className={cn('h-4 w-4 mr-2', isTrackingLocation && 'animate-pulse')} />
            {isTrackingLocation ? 'Stop Tracking' : 'Start Location Tracking'}
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange({ type: type.value })}
              className={cn(
                'transition-all',
                logFilters.type === type.value
                  ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
                  : 'hover:bg-slate-100'
              )}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Date filters */}
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Input
            type="date"
            value={logFilters.dateFrom || ''}
            onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
            className="w-40"
            placeholder="From"
          />
          <span className="text-slate-400">to</span>
          <Input
            type="date"
            value={logFilters.dateTo || ''}
            onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
            className="w-40"
            placeholder="To"
          />
        </div>
      </div>

      {/* Location tracking status */}
      {isTrackingLocation && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 font-medium">
              Location tracking is active
            </span>
            <span className="text-emerald-600 text-sm">
              • {locations.length} locations recorded today
            </span>
          </CardContent>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {logsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : dailyLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No activities logged yet</p>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log your first activity
          </Button>
        </div>
      ) : (
        <>
          {/* Logs grouped by date */}
          <div className="space-y-8">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-slate-500 mb-4 sticky top-0 bg-slate-50 py-2">
                  {date}
                </h3>
                <div className="space-y-3">
                  {logs.map(log => (
                    <ActivityLogEntry key={log.id} log={log} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {logsPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(logsPagination.page - 1)}
                disabled={logsPagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {logsPagination.page} of {logsPagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(logsPagination.page + 1)}
                disabled={logsPagination.page === logsPagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Activity form */}
      <ActivityLogForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleLogCreated}
      />
    </div>
  )
}

