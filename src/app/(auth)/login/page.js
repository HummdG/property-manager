'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

const getDashboardByRole = (role) => {
  const dashboards = {
    OWNER: '/owner',
    AGENT: '/agent',
    TENANT: '/tenant',
    ADMIN: '/admin',
  }
  return dashboards[role] || '/owner'
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        setIsLoading(false)
        return
      }

      const session = await getSession()
      const dashboard = getDashboardByRole(session?.user?.role)
      window.location.href = dashboard
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/owner' })
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[0.75rem] text-fog hover:text-sable transition-colors duration-150 mb-10 tracking-wide"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to home
      </Link>

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
      <span className="inst-label">Client Portal</span>
      <h1 className="font-display text-[2rem] font-light text-sable leading-tight mb-2">
        Sign In
      </h1>
      <p className="text-dusk text-[0.875rem] mb-8">
        Access your Impervia Estates account
      </p>

      {/* Error */}
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="inst-label-form">Password</label>
          <input
            type="password"
            className="inst-input"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sable text-cream py-3 text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-wire" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-cream px-3 text-[0.625rem] text-fog uppercase tracking-[0.18em]">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full border border-wire bg-cream text-pewter py-2.5 text-[0.8125rem] hover:bg-linen transition-colors duration-150 flex items-center justify-center gap-2.5 disabled:opacity-60"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {/* Register link */}
      <p className="text-center text-[0.8125rem] text-fog mt-8">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-sable hover:text-bronze transition-colors font-medium"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}
