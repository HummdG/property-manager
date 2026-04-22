'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Loader2, Home, Users,
  ArrowRight, Check, Briefcase,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const ROLES = [
  {
    id: 'OWNER',
    label: 'Property Owner',
    description: 'Manage your properties and tenants',
    Icon: Home,
  },
  {
    id: 'TENANT',
    label: 'Tenant',
    description: 'View your lease and property details',
    Icon: Users,
  },
  {
    id: 'AGENT',
    label: 'Real Estate Agent',
    description: 'List properties and manage inquiries',
    Icon: Briefcase,
  },
]

const TERMS = {
  OWNER: {
    title: 'Property Owner Terms and Conditions',
    content: `Welcome to Impervia Estates. By registering as a Property Owner, you agree to the following terms:

1. PROPERTY LISTINGS
You are responsible for ensuring all property information you provide is accurate, complete, and up-to-date. Misleading or false information may result in account suspension.

2. TENANT MANAGEMENT
You agree to comply with all applicable landlord-tenant laws and regulations in your jurisdiction. Impervia Estates is not responsible for disputes between you and your tenants.

3. DATA PROTECTION
You agree to handle tenant personal information in accordance with applicable data protection laws and our Privacy Policy.

6. TERMINATION
We reserve the right to terminate your account for violation of these terms or for any other reason at our discretion.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`,
  },
  TENANT: {
    title: 'Tenant Terms and Conditions',
    content: `Welcome to Impervia Estates. By registering as a Tenant, you agree to the following terms:

1. ACCOUNT ACCURACY
You agree to provide accurate personal information and keep your account details up-to-date.

2. LEASE AGREEMENTS
Your tenancy is governed by the lease agreement between you and your landlord. Impervia Estates facilitates communication but is not a party to your lease.

3. COMMUNICATION
You consent to receiving communications from your landlord through the platform.

5. PRIVACY
Your personal information will be shared with your landlord and relevant service providers as necessary for property management.

6. CONDUCT
You agree to use the platform respectfully and not to harass or abuse other users.

7. TERMINATION
We reserve the right to terminate your account for violation of these terms.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`,
  },
  AGENT: {
    title: 'Real Estate Agent Terms and Conditions',
    content: `Welcome to Impervia Estates. By registering as a Real Estate Agent, you agree to the following terms:

1. LICENSING
You represent that you hold a valid real estate license and will maintain it throughout your use of the platform.

2. PROFESSIONAL CONDUCT
You agree to conduct all business in accordance with real estate industry standards and applicable laws.

3. PROPERTY LISTINGS
You agree to ensure all property listings are accurate and comply with advertising regulations.

4. DATA PROTECTION
You agree to handle client personal information in accordance with applicable data protection laws.

5. TERMINATION
We reserve the right to terminate your account for violation of these terms or unprofessional conduct.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`,
  },
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OWNER',
  })
  const [hasViewedTerms, setHasViewedTerms] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  function handleRoleChange(roleId) {
    setFormData({ ...formData, role: roleId })
    setHasViewedTerms(false)
    setAcceptedTerms(false)
  }

  function handleCloseTerms() {
    setShowTermsModal(false)
    setHasViewedTerms(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!acceptedTerms) {
      setError('Please read and accept the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <Image src="/impervia logo.png" alt="Impervia Estates" width={28} height={28} className="w-7 h-7 object-contain" />
        </div>
        <span className="font-display text-[1rem] font-medium text-sable">
          Impervia Estates
        </span>
      </div>

      {/* Heading */}
      <span className="inst-label">New Account</span>
      <h1 className="font-display text-[2rem] font-light text-sable leading-tight mb-2">
        Create Account
      </h1>
      <p className="text-dusk text-[0.875rem] mb-8">
        Join Impervia Estates and manage your assets
      </p>

      {/* Error */}
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="inst-label-form">Full Name</label>
            <input
              type="text"
              className="inst-input"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="inst-label-form">Email Address</label>
            <input
              type="email"
              className="inst-input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="inst-label-form">Password</label>
            <input
              type="password"
              className="inst-input"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="inst-label-form">Confirm Password</label>
            <input
              type="password"
              className="inst-input"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Role selection */}
        <div>
          <label className="inst-label-form mb-3 block">I am registering as</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => {
              const Icon = role.Icon
              const selected = formData.role === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`
                    flex items-start gap-3 p-3.5 text-left transition-all duration-150 border
                    ${selected
                      ? 'border-sable bg-sable/5 border-l-2 border-l-bronze'
                      : 'border-wire bg-cream hover:bg-linen hover:border-sable/20'
                    }
                  `}
                >
                  <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${selected ? 'bg-sable' : 'bg-linen'}`}>
                    <Icon className={`w-4 h-4 ${selected ? 'text-bronze' : 'text-fog'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.8125rem] font-medium leading-tight ${selected ? 'text-sable' : 'text-pewter'}`}>
                      {role.label}
                    </p>
                    <p className="text-[0.6875rem] text-fog mt-0.5 leading-tight">{role.description}</p>
                  </div>
                  {selected && (
                    <div className="w-4 h-4 bg-bronze flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-sable" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Terms */}
        <div className="border border-wire bg-linen p-4">
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => hasViewedTerms && setAcceptedTerms(e.target.checked)}
              disabled={!hasViewedTerms}
              className="mt-0.5 w-3.5 h-3.5 border-wire accent-sable cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
            />
            <div>
              <label
                htmlFor="terms"
                className={`text-[0.8125rem] leading-snug ${hasViewedTerms ? 'text-pewter cursor-pointer' : 'text-fog cursor-not-allowed'}`}
              >
                I have read and accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-sable hover:text-bronze underline underline-offset-2 transition-colors"
                >
                  terms and conditions
                </button>
              </label>
              {!hasViewedTerms && (
                <p className="text-[0.6875rem] text-fog mt-1">
                  Please read the terms before accepting
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !acceptedTerms}
          className="w-full bg-sable text-cream py-3 text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-[0.8125rem] text-fog mt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-sable hover:text-bronze transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>

      {/* Terms modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-cream border border-wire rounded-none shadow-xl">
          <DialogHeader className="border-b border-wire pb-4">
            <DialogTitle className="font-display text-[1.25rem] font-medium text-sable">
              {TERMS[formData.role]?.title}
            </DialogTitle>
            <DialogDescription className="text-[0.8125rem] text-fog">
              Please read these terms carefully before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-1 py-4">
            <div className="whitespace-pre-wrap text-[0.8125rem] text-dusk leading-relaxed">
              {TERMS[formData.role]?.content}
            </div>
          </div>
          <div className="border-t border-wire pt-4">
            <button
              onClick={handleCloseTerms}
              className="w-full bg-sable text-cream py-3 text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150"
            >
              I have read the terms
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
