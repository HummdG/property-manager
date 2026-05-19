import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex font-sans antialiased">

      {/* ── Left branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex w-[440px] flex-shrink-0 bg-sable flex-col justify-between p-14 relative overflow-hidden">
        {/* Architectural grid */}
        <div className="absolute inset-0 inst-hero-grid" />
        {/* Right rule */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-bronze/15" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group" aria-label="Impervia Estates">
            <Image
              src="/impervia-horizontal-logo.png"
              alt="Impervia Estates"
              width={1449}
              height={305}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Central message */}
        <div className="relative z-10">
          <span className="inst-label-light">Client Portal</span>
          <h2
            className="font-display font-light text-cream leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}
          >
            A New Standard<br />for UAE Brokerage.
          </h2>
          <p className="text-haze text-sm leading-relaxed max-w-xs">
            Track leasing and sales briefs, qualified leads, viewings, and
            written offers — all in one secure deal-room.
          </p>
        </div>

        {/* Principles */}
        <div className="relative z-10 border-t border-bronze/15 pt-8 space-y-4">
          {[
            'Client-aligned on both sides of the table',
            'Written valuations, written recommendations',
            'No closing, no fee — outcomes, not retainers',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[0.8125rem] text-haze">
              <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 bg-cream overflow-y-auto flex items-start lg:items-center justify-center px-8 py-10 lg:p-14">
        <div className="w-full max-w-[420px] py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
