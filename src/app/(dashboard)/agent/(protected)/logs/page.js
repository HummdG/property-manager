'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Loader2, MapPin, Calendar, FileText } from 'lucide-react'
import { ActivityLogEntry, ActivityLogForm } from '@/components/agent'
import { useAgentStore } from '@/stores/agent-store'
import { cn } from '@/lib/utils'

const activityTypes = [
  { value: 'all', label: 'All' },
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

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', logsPagination.page.toString())
      params.set('limit', logsPagination.limit.toString())
      if (logFilters.type !== 'all') params.set('type', logFilters.type)
      if (logFilters.dateFrom) params.set('dateFrom', logFilters.dateFrom)
      if (logFilters.dateTo) params.set('dateTo', logFilters.dateTo)

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

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const startLocationTracking = () => {
    if (!navigator.geolocation) { alert('Geolocation is not supported by your browser'); return }
    setIsTrackingLocation(true)
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }
        try {
          const response = await fetch('/api/agent/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location)
          })
          if (response.ok) { const data = await response.json(); addLocation(data.location) }
        } catch (err) { console.error('Failed to record location:', err) }
      },
      (err) => { console.error('Location error:', err); setIsTrackingLocation(false) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
    window.locationWatchId = watchId
  }

  const stopLocationTracking = () => {
    if (window.locationWatchId) { navigator.geolocation.clearWatch(window.locationWatchId); window.locationWatchId = null }
    setIsTrackingLocation(false)
  }

  const handleFilterChange = (filters) => {
    setLogFilters(filters)
    setLogsPagination({ ...logsPagination, page: 1 })
  }

  const handleLogCreated = (log) => { addDailyLog(log); setShowForm(false) }
  const handlePageChange = (newPage) => { setLogsPagination({ ...logsPagination, page: newPage }) }

  const groupedLogs = dailyLogs.reduce((groups, log) => {
    const date = new Date(log.date).toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(log)
    return groups
  }, {})

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
            <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Daily Logs</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={isTrackingLocation ? stopLocationTracking : startLocationTracking}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium border transition-colors',
                isTrackingLocation
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-wire bg-cream text-fog hover:text-sable hover:bg-linen'
              )}
            >
              <MapPin className={cn('h-3.5 w-3.5', isTrackingLocation && 'animate-pulse')} />
              {isTrackingLocation ? 'Stop Tracking' : 'Track Location'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Activity
            </button>
          </div>
        </div>
      </div>

      {/* Type filters + date */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-0 border border-wire overflow-x-auto">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleFilterChange({ type: type.value })}
              className={cn(
                'px-3.5 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire last:border-0 whitespace-nowrap transition-colors',
                logFilters.type === type.value ? 'bg-sable text-cream' : 'bg-cream text-fog hover:text-sable hover:bg-linen'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="h-3.5 w-3.5 text-haze" />
          <input
            type="date"
            value={logFilters.dateFrom || ''}
            onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-40"
          />
          <span className="text-[0.75rem] text-fog">to</span>
          <input
            type="date"
            value={logFilters.dateTo || ''}
            onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-40"
          />
        </div>
      </div>

      {/* Location tracking status */}
      {isTrackingLocation && (
        <div className="flex items-center gap-3 px-5 py-3.5 border border-emerald-200 bg-emerald-50">
          <div className="h-2 w-2 bg-emerald-500 animate-pulse" />
          <span className="text-[0.8125rem] font-medium text-emerald-700">Location tracking active</span>
          <span className="text-[0.75rem] text-emerald-600">· {locations.length} locations recorded today</span>
        </div>
      )}

      {error && (
        <div className="px-5 py-3 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600">{error}</div>
      )}

      {logsLoading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : dailyLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No activities logged yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium border border-wire bg-cream text-fog hover:text-sable hover:bg-linen transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Log your first activity
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date}>
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium mb-3 pb-2 border-b border-wire">
                  {date}
                </p>
                <div className="space-y-3">
                  {logs.map(log => (
                    <ActivityLogEntry key={log.id} log={log} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {logsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-[0.75rem] text-fog">
                Page {logsPagination.page} of {logsPagination.totalPages}
              </p>
              <div className="flex gap-0 border border-wire">
                <button
                  onClick={() => handlePageChange(logsPagination.page - 1)}
                  disabled={logsPagination.page === 1}
                  className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(logsPagination.page + 1)}
                  disabled={logsPagination.page === logsPagination.totalPages}
                  className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ActivityLogForm open={showForm} onOpenChange={setShowForm} onSuccess={handleLogCreated} />
    </div>
  )
}
