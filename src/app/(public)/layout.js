import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Properties | Impervia Estates',
  description:
    'Browse premium residential and commercial properties for rent and sale across the UAE.',
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-linen font-sans antialiased flex flex-col">

      {/* ── Navigation ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-cream border-b border-wire">
        <nav className="inst-container h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/impervia logo.png" alt="Impervia Estates" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display text-[1.1rem] font-medium text-sable tracking-tight leading-none">
              Impervia Estates
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-9">
            {[
              { label: 'All Properties', href: '/properties' },
              { label: 'For Rent', href: '/properties?listingType=RENT' },
              { label: 'For Sale', href: '/properties?listingType=SALE' },
              { label: 'Services', href: '/#services' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-[0.8125rem] bg-sable text-cream px-4 py-2 hover:bg-cobalt transition-colors duration-150 tracking-wide"
            >
              List Property
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-sable border-t border-bronze/10">
        <div className="inst-container py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image src="/impervia logo.png" alt="Impervia Estates" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <span className="font-display text-[0.9375rem] font-medium text-cream">
                  Impervia Estates
                </span>
              </Link>
              <p className="text-[0.75rem] text-haze leading-relaxed max-w-[200px]">
                RERA-licensed property management and real estate services across the UAE.
              </p>
            </div>

            {/* Browse */}
            <div>
              <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                Browse
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'All Properties', href: '/properties' },
                  { label: 'For Rent', href: '/properties?listingType=RENT' },
                  { label: 'For Sale', href: '/properties?listingType=SALE' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.75rem] text-haze hover:text-cream transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                Services
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'Rental Management', href: '/services/renting' },
                  { label: 'Lease Management', href: '/services/leasing' },
                  { label: 'Maintenance', href: '/services/maintaining' },
                  { label: 'Property Sales', href: '/services/selling' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.75rem] text-haze hover:text-cream transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                Contact
              </p>
              <div className="space-y-3">
                {[
                  { Icon: Phone, text: '+971 4 XXX XXXX' },
                  { Icon: Mail, text: 'enquiries@imperviaestates.ae' },
                  { Icon: MapPin, text: 'Business Bay, Dubai' },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-bronze flex-shrink-0 mt-[1px]" />
                    <span className="text-[0.75rem] text-haze">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-bronze/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-[0.6875rem] text-fog">
              © {new Date().getFullYear()} RSBD Solutions FZE. All rights reserved. RERA License No. XXXX
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Service', 'Sign In', 'Register'].map((l) => (
                <Link
                  key={l}
                  href={l === 'Sign In' ? '/login' : l === 'Register' ? '/register' : '#'}
                  className="text-[0.6875rem] text-fog hover:text-haze transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
