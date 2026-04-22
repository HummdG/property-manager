'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload, X, FileText, AlertCircle, CheckCircle,
  Loader2, User, Building2, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DOC_GROUPS = [
  {
    groupLabel: 'Brokerage Companies',
    groupNote: 'Submit RERA Broker Card or BRN showing your company name',
    docs: [
      {
        type: 'RERA_BROKER_CARD',
        label: 'RERA Broker Card',
        description: 'RERA-issued card confirming your brokerage license',
      },
      {
        type: 'BRN',
        label: 'BRN — Broker Registration Number',
        description: 'BRN document showing your company name',
      },
    ],
  },
  {
    groupLabel: 'Holiday Homes / Property Management / Business Centres',
    groupNote: 'Submit Labour Card, Employment Visa, or Emirates ID showing your company name',
    docs: [
      {
        type: 'LABOUR_CARD',
        label: 'Labour Card',
        description: 'Labour card issued showing your company name',
      },
      {
        type: 'EMPLOYMENT_VISA',
        label: 'Employment Visa',
        description: 'Employment visa document',
      },
      {
        type: 'EMIRATES_ID',
        label: 'Emirates ID',
        description: 'Emirates ID showing company affiliation',
      },
    ],
  },
]

const LANGUAGE_OPTIONS = [
  'English', 'Arabic', 'French', 'Russian', 'Chinese', 'Hindi',
  'Urdu', 'Tagalog', 'German', 'Spanish', 'Italian', 'Persian'
]

function TagInput({ value = [], onChange, placeholder, suggestions = [] }) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  )

  function add(tag) {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
    setShowSuggestions(false)
  }

  function remove(tag) {
    onChange(value.filter((v) => v !== tag))
  }

  return (
    <div className="relative">
      <div className="min-h-[38px] border border-wire bg-cream px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:border-bronze/50 transition-colors">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 bg-linen border border-wire px-2 py-0.5 text-[0.75rem] text-sable">
            {tag}
            <button type="button" onClick={() => remove(tag)} className="text-fog hover:text-sable">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-[0.8125rem] text-sable placeholder:text-haze"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-10 w-full bg-cream border border-wire shadow-sm mt-0.5 max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => add(s)}
              className="w-full text-left px-3 py-1.5 text-[0.8125rem] text-sable hover:bg-linen"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-wire mb-6">
      <div className="w-8 h-8 border border-wire bg-linen flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-bronze" />
      </div>
      <div>
        <h2 className="font-display text-base font-light text-sable">{title}</h2>
        {subtitle && <p className="text-[0.7rem] text-fog mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function AgentSetupForm({ initialProfile, initialUser, isRejected, isInfoRequested }) {
  const router = useRouter()

  const [profile, setProfile] = useState({
    companyName: initialProfile?.companyName || '',
    licenseNumber: initialProfile?.licenseNumber || '',
    title: initialProfile?.title || '',
    description: initialProfile?.description || '',
    nationality: initialProfile?.nationality || '',
    spokenLanguages: initialProfile?.spokenLanguages || [],
    experienceSince: initialProfile?.experienceSince
      ? new Date(initialProfile.experienceSince).toISOString().split('T')[0]
      : '',
    serviceAreas: initialProfile?.serviceAreas || [],
    phone: initialUser?.phone || '',
  })

  const [documents, setDocuments] = useState(initialProfile?.documents || [])
  const [profilePhoto, setProfilePhoto] = useState(
    initialProfile?.profilePhoto || initialUser?.image || null
  )
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [errors, setErrors] = useState({})

  const saveTimer = useRef(null)

  const autoSave = useCallback((updatedProfile) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        const payload = {
          ...updatedProfile,
          experienceSince: updatedProfile.experienceSince
            ? new Date(updatedProfile.experienceSince).toISOString()
            : null,
        }
        const res = await fetch('/api/agent/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        setSaveStatus(res.ok ? 'saved' : 'error')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('error')
      }
    }, 600)
  }, [])

  function updateField(field, value) {
    const updated = { ...profile, [field]: value }
    setProfile(updated)
    autoSave(updated)
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const res = await fetch('/api/agent/profile/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      if (!res.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl, fileUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      setProfilePhoto(fileUrl)
    } catch {
      setErrors((e) => ({ ...e, photo: 'Photo upload failed. Please try again.' }))
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleDocumentUpload(file, type) {
    if (!file) return

    setUploadingDoc(type)
    setErrors((err) => ({ ...err, doc: null }))

    try {
      const res = await fetch('/api/agent/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }
      const { document, uploadUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      setDocuments((prev) => [...prev, document])
    } catch (err) {
      setErrors((e) => ({ ...e, doc: err.message }))
    } finally {
      setUploadingDoc(null)
    }
  }

  async function deleteDocument(docId) {
    try {
      const res = await fetch(`/api/agent/documents/${docId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
    } catch (err) {
      setErrors((e) => ({ ...e, doc: err.message }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!profile.companyName?.trim()) newErrors.companyName = 'Company name is required'
    if (!profile.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required'
    if (documents.length === 0) newErrors.doc = 'Upload at least one verification document before submitting'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/agent/profile/submit', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }
      router.push('/agent/pending')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Rejection notice */}
      {isRejected && initialProfile?.approvalNote && (
        <div className="border border-red-200 bg-red-50 p-4 flex gap-3">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.75rem] font-medium text-red-700 mb-1">Profile Rejected</p>
            <p className="text-[0.75rem] text-red-600">{initialProfile.approvalNote}</p>
            <p className="text-[0.65rem] text-red-400 mt-2">Update your details and documents below, then re-submit.</p>
          </div>
        </div>
      )}

      {/* Info request notice */}
      {isInfoRequested && initialProfile?.infoRequestNote && (
        <div className="border border-amber-200 bg-amber-50 p-4 flex gap-3">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.75rem] font-medium text-amber-700 mb-1">Additional Information Required</p>
            <p className="text-[0.75rem] text-amber-600">{initialProfile.infoRequestNote}</p>
            <p className="text-[0.65rem] text-amber-400 mt-2">Update your details or documents below, then re-submit.</p>
          </div>
        </div>
      )}

      {/* Auto-save indicator */}
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog">Profile Setup</p>
        {saveStatus === 'saving' && (
          <span className="text-[0.65rem] text-fog flex items-center gap-1">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />Saving…
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-[0.65rem] text-emerald-600 flex items-center gap-1">
            <CheckCircle className="h-2.5 w-2.5" />Saved
          </span>
        )}
      </div>

      {/* Section 1: Personal */}
      <div className="bg-cream border border-wire p-6">
        <SectionHeader icon={User} title="Personal Information" subtitle="Your contact and personal details" />

        {/* Profile photo */}
        <div className="mb-6">
          <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-wire bg-linen flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profilePhoto
                ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                : <User className="h-6 w-6 text-fog" />
              }
            </div>
            <label className={cn(
              'cursor-pointer inline-flex items-center gap-2 border border-wire px-3 py-2 text-[0.8125rem] text-sable bg-linen hover:bg-wire transition-colors',
              uploadingPhoto && 'opacity-50 pointer-events-none'
            )}>
              {uploadingPhoto
                ? <><Loader2 className="h-3 w-3 animate-spin" />Uploading…</>
                : <><Upload className="h-3 w-3" />Upload Photo</>
              }
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          {errors.photo && <p className="text-[0.75rem] text-red-500 mt-1">{errors.photo}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Full Name
            </label>
            <input
              value={initialUser?.name || ''}
              disabled
              className="w-full bg-linen border border-wire px-3 py-2 text-[0.8125rem] text-fog cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Email
            </label>
            <input
              value={initialUser?.email || ''}
              disabled
              className="w-full bg-linen border border-wire px-3 py-2 text-[0.8125rem] text-fog cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Phone
            </label>
            <input
              value={profile.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+971 50 000 0000"
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Position / Title
            </label>
            <input
              value={profile.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Senior Sales Agent"
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Nationality
            </label>
            <input
              value={profile.nationality}
              onChange={(e) => updateField('nationality', e.target.value)}
              placeholder="e.g. British"
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Agent Since
            </label>
            <input
              type="date"
              value={profile.experienceSince}
              onChange={(e) => updateField('experienceSince', e.target.value)}
              className="w-full bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
            Spoken Languages
          </label>
          <TagInput
            value={profile.spokenLanguages}
            onChange={(v) => updateField('spokenLanguages', v)}
            placeholder="Type or select languages…"
            suggestions={LANGUAGE_OPTIONS}
          />
        </div>
      </div>

      {/* Section 2: Professional */}
      <div className="bg-cream border border-wire p-6">
        <SectionHeader icon={Building2} title="Professional Details" subtitle="Your company and licensing information" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              value={profile.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Your brokerage or company"
              className={cn(
                'w-full bg-cream border px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none transition-colors',
                errors.companyName ? 'border-red-400 focus:border-red-400' : 'border-wire focus:border-bronze/50'
              )}
            />
            {errors.companyName && <p className="text-[0.75rem] text-red-500 mt-1">{errors.companyName}</p>}
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
              License Number <span className="text-red-400">*</span>
            </label>
            <input
              value={profile.licenseNumber}
              onChange={(e) => updateField('licenseNumber', e.target.value)}
              placeholder="e.g. RERA-12345"
              className={cn(
                'w-full bg-cream border px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none transition-colors',
                errors.licenseNumber ? 'border-red-400 focus:border-red-400' : 'border-wire focus:border-bronze/50'
              )}
            />
            {errors.licenseNumber && <p className="text-[0.75rem] text-red-500 mt-1">{errors.licenseNumber}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
            Biography
          </label>
          <textarea
            value={profile.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Brief professional biography…"
            rows={3}
            className="w-full border border-wire bg-cream px-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze resize-none focus:outline-none focus:border-bronze/50 transition-colors"
          />
        </div>

        <div className="mt-4">
          <label className="block text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-1.5">
            Service Areas
          </label>
          <TagInput
            value={profile.serviceAreas}
            onChange={(v) => updateField('serviceAreas', v)}
            placeholder="Type an area and press Enter…"
          />
        </div>
      </div>

      {/* Section 3: Documents */}
      <div className="bg-cream border border-wire p-6">
        <SectionHeader
          icon={Shield}
          title="Verification Documents"
          subtitle="Upload the required documents based on your company type"
        />

        <div className="space-y-6">
          {DOC_GROUPS.map((group) => (
            <div key={group.groupLabel}>
              {/* Group header */}
              <div className="mb-3">
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium">{group.groupLabel}</p>
                <p className="text-[0.7rem] text-haze mt-0.5">{group.groupNote}</p>
              </div>

              {/* Document slots */}
              <div className="divide-y divide-wire border border-wire">
                {group.docs.map((doc) => {
                  const uploaded = documents.filter((d) => d.type === doc.type)
                  const isUploading = uploadingDoc === doc.type

                  return (
                    <div key={doc.type} className="px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.8125rem] font-medium text-sable">{doc.label}</p>
                          <p className="text-[0.7rem] text-fog mt-0.5">{doc.description}</p>
                        </div>

                        {/* Upload trigger */}
                        <label className={cn(
                          'cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 border border-wire px-3 py-1.5 text-[0.75rem] text-sable bg-linen hover:bg-wire transition-colors whitespace-nowrap',
                          isUploading && 'opacity-50 pointer-events-none'
                        )}>
                          {isUploading
                            ? <><Loader2 className="h-3 w-3 animate-spin" />Uploading…</>
                            : <><Upload className="h-3 w-3" />Upload File</>
                          }
                          <input
                            type="file"
                            accept=".pdf,image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(e.target.files?.[0], doc.type)}
                            disabled={isUploading}
                          />
                        </label>
                      </div>

                      {/* Uploaded files for this type */}
                      {uploaded.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {uploaded.map((d) => (
                            <div key={d.id} className="flex items-center gap-2 bg-linen border border-wire px-3 py-2">
                              <FileText className="h-3.5 w-3.5 text-bronze flex-shrink-0" />
                              <p className="text-[0.75rem] text-sable truncate flex-1">{d.fileName}</p>
                              <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-700 flex-shrink-0">
                                Uploaded
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteDocument(d.id)}
                                className="text-fog hover:text-red-500 transition-colors flex-shrink-0"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {errors.doc && (
          <p className="text-[0.75rem] text-red-500 mt-4 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{errors.doc}
          </p>
        )}

        <p className="text-[0.65rem] text-fog mt-4">Accepted formats: PDF, JPEG, PNG — max 10 MB per file</p>
      </div>

      {/* Submit */}
      <div className="border-t border-wire pt-6">
        {submitError && (
          <div className="mb-4 flex items-center gap-2 text-[0.75rem] text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {submitError}
          </div>
        )}
        <div className="flex items-center justify-between gap-6">
          <p className="text-[0.65rem] text-fog">
            By submitting, you confirm all information is accurate and your documents are valid.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-sable text-cream text-[0.8125rem] font-medium px-8 py-2.5 hover:bg-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitLoading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
