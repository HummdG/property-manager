'use client'

import { useState, useEffect } from 'react'
import { Wrench, Search, Loader2, MoreVertical, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export default function AdminTradersPage() {
  const [traders, setTraders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrader, setSelectedTrader] = useState(null)

  useEffect(() => {
    fetchTraders()
  }, [])

  async function fetchTraders() {
    try {
      const response = await fetch('/api/admin/traders')
      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data.error)
        return
      }

      setTraders(data.traders || [])
    } catch (error) {
      console.error('Failed to fetch traders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTraders = traders.filter(trader =>
    trader.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const traderCounts = {
    total: traders.length,
    available: traders.filter(t => t.isAvailable).length,
    unavailable: traders.filter(t => !t.isAvailable).length
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Traders Management</h1>
        <p className="text-slate-500 mt-1">Manage service providers and traders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Traders</p>
          <p className="text-2xl font-bold text-blue-950">{traderCounts.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Available</p>
          <p className="text-2xl font-bold text-emerald-600">{traderCounts.available}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Unavailable</p>
          <p className="text-2xl font-bold text-amber-600">{traderCounts.unavailable}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Traders list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredTraders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Wrench className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">No traders found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'No traders registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTraders.map(trader => (
            <Card key={trader.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white font-semibold">
                      {trader.user?.name?.charAt(0) || trader.user?.email?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">
                        {trader.companyName || trader.user?.name || 'Unknown Trader'}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{trader.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {trader.categories?.length > 0 && (
                      <div className="hidden sm:flex gap-1">
                        {trader.categories.slice(0, 2).map(cat => (
                          <Badge key={cat.id} variant="outline">
                            {cat.name}
                          </Badge>
                        ))}
                        {trader.categories.length > 2 && (
                          <Badge variant="outline">
                            +{trader.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Badge className={trader.isAvailable
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                    }>
                      {trader.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                    {!trader.user?.isActive && (
                      <Badge variant="destructive">
                        Inactive
                      </Badge>
                    )}
                    {trader.rating && (
                      <div className="hidden sm:flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{trader.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-950">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setSelectedTrader(trader)}
                        >
                          <Wrench className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Trader details dialog */}
      <Dialog open={!!selectedTrader} onOpenChange={() => setSelectedTrader(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trader Details</DialogTitle>
          </DialogHeader>
          {selectedTrader && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-semibold">
                  {selectedTrader.user?.name?.charAt(0) || selectedTrader.user?.email?.charAt(0)?.toUpperCase() || 'T'}
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-lg">
                    {selectedTrader.companyName || selectedTrader.user?.name || 'Unknown Trader'}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedTrader.user?.email}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={selectedTrader.isAvailable
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border-amber-200'
                }>
                  {selectedTrader.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
                {selectedTrader.rating && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    {selectedTrader.rating.toFixed(1)} rating
                  </Badge>
                )}
              </div>

              {selectedTrader.categories?.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-blue-950 mb-2">Service Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrader.categories.map(cat => (
                      <Badge key={cat.id} variant="outline">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTrader.description && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-blue-950 mb-2">Description</p>
                  <p className="text-sm text-slate-500">{selectedTrader.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
                {selectedTrader.phone && (
                  <p className="text-slate-500">
                    <strong className="text-blue-950">Phone:</strong> {selectedTrader.phone}
                  </p>
                )}
                {selectedTrader.hourlyRate && (
                  <p className="text-slate-500">
                    <strong className="text-blue-950">Hourly Rate:</strong> AED {selectedTrader.hourlyRate}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
