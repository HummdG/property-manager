import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import SiteHeader from '@/components/shared/SiteHeader'

export const metadata = {
  title: 'Properties | Impervia Estates',
  description:
    'Browse premium residential and commercial properties for rent and sale across the UAE.',
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-linen font-sans antialiased flex flex-col">

      <SiteHeader
        links={[
          { label: 'All Properties', href: '/properties' },
          { label: 'For Rent',       href: '/properties?listingType=RENT' },
          { label: 'For Sale',       href: '/properties?listingType=SALE' },
          { label: 'Services',       href: '/#services' },
        ]}
        cta={{ label: 'List Property', href: '/register' }}
      />

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
              <Link href="/" className="inline-flex items-center mb-5" aria-label="Impervia Estates">
                <Image
                  src="/impervia-horizontal-logo.png"
                  alt="Impervia Estates"
                  width={1449}
                  height={305}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="text-[0.75rem] text-haze leading-relaxed max-w-[200px]">
                A new standard for real estate brokerage across the UAE — leasing and sales, both sides of the table.
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
                  { label: 'Leasing Brokerage', href: '/services/leasing' },
                  { label: 'Sales Brokerage', href: '/services/selling' },
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
              © {new Date().getFullYear()} RSBD Solutions FZE. All rights reserved.
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
