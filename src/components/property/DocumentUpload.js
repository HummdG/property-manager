'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Trash2, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const DOC_TYPES = [
  { type: 'DEED', label: 'Title Deed', description: 'Upload the property title deed document' },
  { type: 'NOC', label: 'NOC (No Objection Certificate)', description: 'Upload the NOC for listing' }
]

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function DocumentUpload({ propertyId, documents = [], onDocumentsChange }) {
  const [uploading, setUploading] = useState({})
  const [errors, setErrors] = useState({})
  const fileInputRefs = useRef({})

  function getDocumentByType(type) {
    return documents.find(d => d.type === type)
  }

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, Word, JPEG, or PNG files.'
    }
    if (file.size > MAX_SIZE) {
      return 'File size exceeds 10MB limit.'
    }
    return null
  }

  async function handleUpload(docType, file) {
    const validationError = validateFile(file)
    if (validationError) {
      setErrors(prev => ({ ...prev, [docType]: validationError }))
      return
    }

    setErrors(prev => ({ ...prev, [docType]: null }))
    setUploading(prev => ({ ...prev, [docType]: true }))

    try {
      // Step 1: Get presigned URL from our API
      const response = await fetch(`/api/properties/${propertyId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: docType,
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create document record')
      }

      const { document, uploadUrl } = await response.json()

      // Step 2: Upload file directly to S3 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage')
      }

      // Step 3: Notify parent of updated documents
      if (onDocumentsChange) {
        onDocumentsChange(docType, document)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(prev => ({ ...prev, [docType]: error.message }))
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }))
    }
  }

  async function handleDelete(docType, documentId) {
    setUploading(prev => ({ ...prev, [docType]: true }))
    setErrors(prev => ({ ...prev, [docType]: null }))

    try {
      const response = await fetch(`/api/properties/${propertyId}/documents?documentId=${documentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete document')
      }

      if (onDocumentsChange) {
        onDocumentsChange(docType, null)
      }
    } catch (error) {
      console.error('Delete error:', error)
      setErrors(prev => ({ ...prev, [docType]: error.message }))
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }))
    }
  }

  function handleFileSelect(docType, e) {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(docType, file)
    }
    // Reset file input
    if (fileInputRefs.current[docType]) {
      fileInputRefs.current[docType].value = ''
    }
  }

  function handleDrop(docType, e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(docType, file)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-blue-950">Required Documents</h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload title deed and NOC before listing the property. Accepted formats: PDF, Word, JPEG, PNG (max 10MB)
        </p>
      </div>

      {DOC_TYPES.map(({ type, label, description }) => {
        const existingDoc = getDocumentByType(type)
        const isUploading = uploading[type]
        const error = errors[type]

        return (
          <div
            key={type}
            className="rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${existingDoc
                    ? 'bg-emerald-100'
                    : 'bg-slate-100'
                  }`}>
                    {existingDoc ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-blue-950">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                  </div>
                </div>
                {existingDoc && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex-shrink-0">
                    Uploaded
                  </Badge>
                )}
              </div>

              {/* Existing document info */}
              {existingDoc && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-blue-950 truncate">{existingDoc.fileName}</span>
                      {existingDoc.uploadedAt && (
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {formatDate(existingDoc.uploadedAt)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() => handleDelete(type, existingDoc.id)}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload area */}
              {!existingDoc && (
                <div
                  className="mt-3 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-200"
                  onDrop={(e) => handleDrop(type, e)}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRefs.current[type]?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                      <p className="text-sm text-slate-500">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-sm text-slate-500 mt-2">
                        Drag & drop or <span className="text-amber-600 font-medium">click to browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PDF, Word, JPEG, PNG up to 10MB</p>
                    </>
                  )}
                  <input
                    ref={el => { fileInputRefs.current[type] = el }}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(type, e)}
                    className="hidden"
                  />
                </div>
              )}

              {/* Replace button for existing doc */}
              {existingDoc && !isUploading && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRefs.current[type]?.click()}
                  >
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    Replace Document
                  </Button>
                  <input
                    ref={el => { fileInputRefs.current[type] = el }}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(type, e)}
                    className="hidden"
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                  <button
                    onClick={() => setErrors(prev => ({ ...prev, [type]: null }))}
                    className="ml-auto flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}


