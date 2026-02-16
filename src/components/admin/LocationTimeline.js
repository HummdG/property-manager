'use client'

import { MapPin, Clock, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export function LocationTimeline({ locations = [], showDate = true }) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No location data available</p>
      </div>
    )
  }

  // Group locations by date
  const groupedLocations = locations.reduce((groups, location) => {
    const date = new Date(location.timestamp).toLocaleDateString('en-AE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(location)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedLocations).map(([date, locs]) => (
        <div key={date}>
          {showDate && (
            <h4 className="text-sm font-semibold text-slate-500 mb-3 sticky top-0 bg-white py-1">
              {date}
            </h4>
          )}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-3">
              {locs.map((location, index) => (
                <div key={location.id} className="relative flex items-start gap-4 pl-2">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-300">
                    <MapPin className="h-3 w-3 text-amber-600" />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {location.address ? (
                            <p className="text-sm font-medium text-blue-950">
                              {location.address}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-500">
                              Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(location.timestamp, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {location.accuracy && (
                              <span className="flex items-center gap-1">
                                <Navigation className="h-3 w-3" />
                                ±{Math.round(location.accuracy)}m
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          View Map
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LocationStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
        <p className="text-2xl font-bold text-amber-600">{stats?.today || 0}</p>
        <p className="text-sm text-slate-500">Today</p>
      </div>
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
        <p className="text-2xl font-bold text-blue-600">{stats?.thisWeek || 0}</p>
        <p className="text-sm text-slate-500">This Week</p>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
        <p className="text-2xl font-bold text-slate-600">{stats?.total || 0}</p>
        <p className="text-sm text-slate-500">Total</p>
      </div>
    </div>
  )
}



