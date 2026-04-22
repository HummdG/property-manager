'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Building2, Loader2 } from 'lucide-react'
import { PropertyCard, PropertyForm } from '@/components/property'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { fetchProperties() }, [])

  async function fetchProperties() {
    try {
      const response = await fetch('/api/properties', { credentials: 'include' })
      const data = await response.json()
      if (!response.ok) { console.error('API Error:', data.error); return }
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true)
    try {
      const url = editingProperty ? `/api/properties/${editingProperty.id}` : '/api/properties'
      const method = editingProperty ? 'PATCH' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) { setDialogOpen(false); setEditingProperty(null); fetchProperties() }
    } catch (error) {
      console.error('Failed to save property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(property) {
    try {
      const response = await fetch(`/api/properties/${property.id}`, { method: 'DELETE' })
      if (response.ok) { setDeleteConfirm(null); fetchProperties() }
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  function handleEdit(property) { setEditingProperty(property); setDialogOpen(true) }
  function handleAddNew() { setEditingProperty(null); setDialogOpen(true) }

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Owner Portal</p>
            <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Properties</h1>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors flex-shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Property
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No properties found</p>
          <p className="text-[0.75rem] text-fog mt-1">
            {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first property'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddNew}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={(p) => setDeleteConfirm(p)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-wire bg-cream p-0 gap-0">
          <DialogHeader className="px-6 py-5 border-b border-wire">
            <DialogTitle className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <PropertyForm
              property={editingProperty}
              onSubmit={handleSubmit}
              onCancel={() => { setDialogOpen(false); setEditingProperty(null) }}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md border-wire bg-cream p-0 gap-0">
          <DialogHeader className="px-6 py-5 border-b border-wire">
            <DialogTitle className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">
              Delete Property
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <p className="text-[0.8125rem] text-fog">
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium border border-wire bg-cream text-fog hover:text-sable hover:bg-linen transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
