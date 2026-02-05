'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, User, Loader2, Home, Wrench, Users, ArrowRight, Check, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

const roles = [
  {
    id: 'OWNER',
    label: 'Property Owner',
    description: 'Manage your properties and tenants',
    icon: Home
  },
  {
    id: 'TENANT',
    label: 'Tenant',
    description: 'Report issues and view your lease',
    icon: Users
  },
  {
    id: 'TRADER',
    label: 'Trader/Contractor',
    description: 'Accept jobs and complete repairs',
    icon: Wrench
  },
  {
    id: 'AGENT',
    label: 'Real Estate Agent',
    description: 'List properties and manage client inquiries',
    icon: Briefcase
  }
]

const termsContent = {
  OWNER: {
    title: 'Property Owner Terms and Conditions',
    content: `Welcome to GoFor Properties. By registering as a Property Owner, you agree to the following terms:

1. PROPERTY LISTINGS
You are responsible for ensuring all property information you provide is accurate, complete, and up-to-date. Misleading or false information may result in account suspension.

2. TENANT MANAGEMENT
You agree to comply with all applicable landlord-tenant laws and regulations in your jurisdiction. GoFor Properties is not responsible for disputes between you and your tenants.

3. SERVICE FEES
You acknowledge that certain services on the platform may incur fees. All applicable fees will be clearly disclosed before you commit to any paid service.

4. MAINTENANCE REQUESTS
You agree to respond to tenant maintenance requests in a timely manner. Failure to address urgent maintenance issues may affect your account standing.

5. DATA PROTECTION
You agree to handle tenant personal information in accordance with applicable data protection laws and our Privacy Policy.

6. TERMINATION
We reserve the right to terminate your account for violation of these terms or for any other reason at our discretion.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`
  },
  TENANT: {
    title: 'Tenant Terms and Conditions',
    content: `Welcome to GoFor Properties. By registering as a Tenant, you agree to the following terms:

1. ACCOUNT ACCURACY
You agree to provide accurate personal information and keep your account details up-to-date.

2. LEASE AGREEMENTS
Your tenancy is governed by the lease agreement between you and your landlord. GoFor Properties facilitates communication but is not a party to your lease.

3. ISSUE REPORTING
You agree to report maintenance issues promptly and accurately through the platform. False or frivolous reports may affect your account standing.

4. COMMUNICATION
You consent to receiving communications from your landlord and service providers through the platform.

5. PRIVACY
Your personal information will be shared with your landlord and relevant service providers as necessary for property management. See our Privacy Policy for details.

6. CONDUCT
You agree to use the platform respectfully and not to harass or abuse other users.

7. TERMINATION
We reserve the right to terminate your account for violation of these terms.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`
  },
  TRADER: {
    title: 'Trader/Contractor Terms and Conditions',
    content: `Welcome to GoFor Properties. By registering as a Trader/Contractor, you agree to the following terms:

1. QUALIFICATIONS
You represent that you have all necessary licenses, certifications, and insurance required to perform the services you offer.

2. JOB ACCEPTANCE
When you accept a job, you commit to completing it according to the specified requirements and timeline. Repeated cancellations or no-shows may result in account suspension.

3. QUALITY STANDARDS
You agree to perform all work to professional standards and in compliance with applicable building codes and regulations.

4. PRICING
You agree to provide accurate cost estimates and to charge fair and competitive rates. Hidden fees or price gouging is prohibited.

5. PAYMENTS
Payment terms and methods will be as agreed with property owners. GoFor Properties may facilitate payments but is not responsible for payment disputes.

6. INSURANCE AND LIABILITY
You are responsible for maintaining adequate insurance coverage. You agree to indemnify GoFor Properties against claims arising from your work.

7. REVIEWS AND RATINGS
You acknowledge that clients may rate and review your services. You agree not to manipulate or falsify reviews.

8. TERMINATION
We reserve the right to terminate your account for violation of these terms, poor service quality, or customer complaints.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`
  },
  AGENT: {
    title: 'Real Estate Agent Terms and Conditions',
    content: `Welcome to GoFor Properties. By registering as a Real Estate Agent, you agree to the following terms:

1. LICENSING
You represent that you hold a valid real estate license in your jurisdiction and will maintain it throughout your use of the platform.

2. PROFESSIONAL CONDUCT
You agree to conduct all business in accordance with real estate industry standards and applicable laws, including fair housing regulations.

3. CLIENT RELATIONSHIPS
You are responsible for managing client relationships professionally. GoFor Properties facilitates connections but is not responsible for agent-client disputes.

4. PROPERTY LISTINGS
You agree to ensure all property listings are accurate and comply with advertising regulations. You must have proper authorization to list any property.

5. COMMISSION AND FEES
Commission arrangements are between you and your clients/brokerages. Platform usage fees, if any, will be clearly disclosed.

6. INQUIRIES AND LEADS
You agree to respond to client inquiries promptly and professionally. Lead information must be handled in accordance with our Privacy Policy.

7. DATA PROTECTION
You agree to handle client personal information in accordance with applicable data protection laws and only use it for legitimate real estate purposes.

8. SUBSCRIPTION TERMS
If you subscribe to premium services, you agree to the associated payment terms. Cancellation policies will be clearly stated at the time of subscription.

9. TERMINATION
We reserve the right to terminate your account for violation of these terms, unprofessional conduct, or regulatory issues.

By checking the acceptance box, you confirm that you have read, understood, and agree to these terms.`
  }
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
    role: 'OWNER'
  })
  const [hasViewedTerms, setHasViewedTerms] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  function handleRoleChange(roleId) {
    setFormData({ ...formData, role: roleId })
    setHasViewedTerms(false)
    setAcceptedTerms(false)
  }

  function handleOpenTerms() {
    setShowTermsModal(true)
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
      setError('You must accept the terms and conditions')
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
          role: formData.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setIsLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-2xl shadow-blue-950/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/30">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-blue-950">Create an account</CardTitle>
        <CardDescription className="text-slate-500">
          Join GoFor Properties to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>I am a...</Label>
            <div className="grid gap-2">
              {roles.map((role) => {
                const Icon = role.icon
                const isSelected = formData.role === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 shadow-sm shadow-amber-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isSelected ? 'text-amber-700' : 'text-blue-950'}`}>
                        {role.label}
                      </p>
                      <p className="text-xs text-slate-500">{role.description}</p>
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={setAcceptedTerms}
              disabled={!hasViewedTerms}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className={`text-sm ${hasViewedTerms ? 'text-slate-700 cursor-pointer' : 'text-slate-400 cursor-not-allowed'}`}
              >
                I accept the{' '}
                <button
                  type="button"
                  onClick={handleOpenTerms}
                  className="font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
                >
                  terms and conditions
                </button>
              </label>
              {!hasViewedTerms && (
                <p className="text-xs text-slate-400 mt-1">
                  Please read the terms and conditions first
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full group"
            disabled={isLoading || !acceptedTerms}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            Sign in
          </Link>
        </p>
      </CardFooter>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{termsContent[formData.role].title}</DialogTitle>
            <DialogDescription>
              Please read these terms carefully before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
              {termsContent[formData.role].content}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Button onClick={handleCloseTerms} className="w-full">
              I have read the terms
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
