'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, AlertCircle, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 8 * 1024 * 1024 // 8MB

export function ImageUpload({ propertyId, images = [], onImagesChange, maxImages = 20, disabled = false }) {
  const [uploading, setUploading] = useState(false)
  const [deletingKey, setDeletingKey] = useState(null)
  const [localPreviews, setLocalPreviews] = useState([])
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const totalCount = images.length + localPreviews.length
  const canUploadMore = totalCount < maxImages

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed.'
    }
    if (file.size > MAX_SIZE) {
      return 'Image must be under 8MB.'
    }
    return null
  }

  async function handleFiles(files) {
    const fileArray = Array.from(files)
    setError(null)

    const remaining = maxImages - images.length - localPreviews.length
    if (fileArray.length > remaining) {
      setError(`You can only upload ${remaining} more image${remaining === 1 ? '' : 's'}.`)
      return
    }

    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setUploading(true)

    for (const file of fileArray) {
      const objectUrl = URL.createObjectURL(file)
      const tempId = `temp_${Date.now()}_${Math.random()}`

      setLocalPreviews(prev => [...prev, { objectUrl, tempId }])

      try {
        const response = await fetch(`/api/properties/${propertyId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size
          })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to prepare upload')
        }

        const { uploadUrl, images: updatedImages } = await response.json()

        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to storage')
        }

        setLocalPreviews(prev => prev.filter(p => p.tempId !== tempId))
        URL.revokeObjectURL(objectUrl)

        if (onImagesChange) {
          onImagesChange(updatedImages)
        }
      } catch (err) {
        console.error('Image upload error:', err)
        setLocalPreviews(prev => prev.filter(p => p.tempId !== tempId))
        URL.revokeObjectURL(objectUrl)
        setError(err.message)
        break
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleDelete(fileUrl) {
    const key = fileUrl.replace(/^https?:\/\/[^/]+\//, '')
    setDeletingKey(key)
    setError(null)

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images?fileKey=${encodeURIComponent(key)}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete image')
      }

      const { images: updatedImages } = await response.json()

      if (onImagesChange) {
        onImagesChange(updatedImages)
      }
    } catch (err) {
      console.error('Image delete error:', err)
      setError(err.message)
    } finally {
      setDeletingKey(null)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    if (disabled || uploading) return
    const files = e.dataTransfer.files
    if (files?.length) handleFiles(files)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleFileSelect(e) {
    const files = e.target.files
    if (files?.length) handleFiles(files)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-blue-950">Property Photos</h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload photos to showcase your property. Accepted formats: JPEG, PNG, WebP (max 8MB each, up to {maxImages} photos)
        </p>
      </div>

      {/* Thumbnail grid */}
      {(images.length > 0 || localPreviews.length > 0) && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url) => {
            const key = url.replace(/^https?:\/\/[^/]+\//, '')
            const isDeleting = deletingKey === key
            return (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
                <img
                  src={url}
                  alt="Property photo"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                {isDeleting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(url)}
                    disabled={disabled || uploading || !!deletingKey}
                    className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:pointer-events-none"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}

          {/* Optimistic previews while uploading */}
          {localPreviews.map(({ objectUrl, tempId }) => (
            <div key={tempId} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
              <img
                src={objectUrl}
                alt="Uploading..."
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {canUploadMore && (
        <div
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-200"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500 mt-2">
                Drag & drop or <span className="text-amber-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPEG, PNG, WebP up to 8MB · {maxImages - totalCount} remaining
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
        </div>
      )}

      {totalCount >= maxImages && (
        <p className="text-xs text-slate-400 text-center">
          Maximum of {maxImages} photos reached. Delete a photo to upload a new one.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="flex-shrink-0">
            <X className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      )}
    </div>
  )
}
