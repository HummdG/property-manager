import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Camera,
  Users,
  FileText,
  Star,
  BarChart2,
} from 'lucide-react'

export const metadata = {
  title: 'Property Sales Services | Impervia Estates',
  description:
    'Professional property sales management in the UAE. DLD-registered valuations, premium marketing, and full transaction support from AED 1,499/month.',
}

const FEATURES = [
  {
    Icon: BarChart2,
    title: 'Market Valuation',
    description:
      'DLD-registered comparative market analysis to establish accurate, defensible pricing for your property.',
  },
  {
    Icon: Camera,
    title: 'Professional Photography & Tours',
    description:
      'High-specification property photography and virtual walk-throughs for premium portal listings.',
  },
  {
    Icon: Star,
    title: 'Premium Portal Listings',
    description:
      'Featured listings across Bayut, Property Finder, and Dubizzle with optimised positioning.',
  },
  {
    Icon: Users,
    title: 'Buyer Qualification',
    description:
      'Rigorous pre-qualification of prospective buyers including financial verification and intent assessment.',
  },
  {
    Icon: FileText,
    title: 'Transaction Management',
    description:
      'Complete oversight from MOU drafting through to DLD transfer registration and NOC management.',
  },
  {
    Icon: TrendingUp,
    title: 'Negotiation Support',
    description:
      'Experienced negotiation support to achieve optimal pricing outcomes within your timeline.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Valuation & Strategy',
    description:
      'Comparative market analysis, pricing strategy, and marketing plan agreed before listing.',
  },
  {
    number: '02',
    title: 'Preparation & Listing',
    description:
      'Professional photography, portal listings, and outreach to our qualified buyer network.',
  },
  {
    number: '03',
    title: 'Viewings & Offers',
    description:
      'Managed viewings, buyer qualification, offer negotiation, and MOU preparation.',
  },
  {
    number: '04',
    title: 'Completion',
    description:
      'NOC management, DLD transfer coordination, and final documentation through to completion.',
  },
]

const INCLUSIONS = [
  'DLD comparative market analysis',
  'Professional photography',
  'Virtual tour production',
  'Portal listings across all major platforms',
  'Buyer enquiry management',
  'Buyer financial pre-qualification',
  'MOU & SPA preparation',
  'NOC application management',
  'DLD transfer coordination',
  'Post-sale documentation archive',
]

const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function SellingServicePage() {
  return (
    <div className="bg-cream font-sans antialiased">

      {/* ─── Navigation ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-cream border-b border-wire">
        <nav className="inst-container h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/impervia logo.png" alt="Impervia Estates" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display text-[1.1rem] font-medium text-sable tracking-tight leading-none">
              Impervia Estates
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href}
                className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150 tracking-wide">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150">
              Sign In
            </Link>
            <Link href="/register?service=selling"
              className="text-[0.8125rem] bg-sable text-cream px-4 py-2 hover:bg-cobalt transition-colors duration-150 tracking-wide">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative bg-sable overflow-hidden">
        <div className="absolute inset-0 inst-hero-grid" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-bronze/20" />

        <div className="relative z-10 inst-container py-24">
          <div className="flex items-center gap-2 mb-10 text-[0.75rem] text-haze">
            <Link href="/" className="hover:text-cream transition-colors">Home</Link>
            <span className="text-bronze/40">/</span>
            <Link href="/#services" className="hover:text-cream transition-colors">Services</Link>
            <span className="text-bronze/40">/</span>
            <span className="text-bronze">Property Sales</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-bronze/25 bg-bronze/5 px-3 py-[7px] mb-8">
                <Home className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
                <span className="text-[0.65rem] text-bronze tracking-[0.18em] uppercase font-medium">
                  Sales · Transaction Management
                </span>
              </div>

              <h1
                className="font-display font-light text-cream leading-tight mb-6"
                style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
              >
                Property Sales{' '}
                <span className="text-bronze-light">Managed</span>{' '}
                with Precision
              </h1>

              <p className="text-haze text-[1rem] leading-relaxed max-w-xl mb-10 font-light">
                From accurate market valuation to DLD transfer completion,
                our sales service is structured around delivering the optimal
                outcome for the informed vendor.
              </p>

              <div className="flex items-center gap-6">
                <Link href="/register?service=selling"
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-6 py-3 hover:bg-white/5 transition-colors duration-150 text-[0.8125rem] tracking-wide">
                  Register Interest
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/properties"
                  className="text-[0.8125rem] text-haze hover:text-cream transition-colors duration-150">
                  Browse Properties
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-bronze/20 bg-cobalt p-8">
                <div className="border-b border-bronze/15 pb-6 mb-6">
                  <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-3">Monthly Fee</p>
                  <div className="font-display text-[3rem] font-light text-cream leading-none">AED 1,499</div>
                  <div className="text-[0.75rem] text-haze mt-1">per property, per month</div>
                </div>
                <ul className="space-y-3 mb-7">
                  {INCLUSIONS.slice(0, 6).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.8125rem] text-haze">
                      <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?service=selling"
                  className="block w-full text-center bg-bronze text-sable px-5 py-3 text-[0.8125rem] font-medium tracking-wide hover:bg-bronze-light transition-colors duration-150">
                  Begin Onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section className="bg-linen inst-section border-t border-wire">
        <div className="inst-container">
          <div className="mb-12">
            <span className="inst-label">Service Scope</span>
            <h2 className="font-display font-light text-sable leading-tight max-w-xl"
              style={{ fontSize: 'clamp(1.875rem, 3vw, 2.75rem)' }}>
              Full-Service Sales Management
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-wire">
            {FEATURES.map((feat) => {
              const Icon = feat.Icon
              return (
                <div key={feat.title} className="bg-cream p-8">
                  <div className="w-9 h-9 border border-wire flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-bronze" />
                  </div>
                  <h3 className="font-display text-[1.125rem] font-medium text-sable mb-3">{feat.title}</h3>
                  <p className="text-dusk text-[0.875rem] leading-relaxed">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Process ────────────────────────────────────────── */}
      <section className="bg-sable inst-section">
        <div className="inst-container">
          <div className="mb-14">
            <span className="inst-label-light">How It Works</span>
            <h2 className="font-display font-light text-cream leading-tight max-w-lg"
              style={{ fontSize: 'clamp(1.875rem, 3vw, 2.5rem)' }}>
              From Valuation to Completion
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-bronze/10">
            {STEPS.map((step) => (
              <div key={step.number} className="bg-sable p-10">
                <div className="font-display text-[3.5rem] font-light text-bronze/20 leading-none mb-6">{step.number}</div>
                <h3 className="font-display text-[1.0625rem] font-medium text-cream mb-3">{step.title}</h3>
                <p className="text-haze text-[0.875rem] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inclusions ─────────────────────────────────────── */}
      <section className="bg-cream inst-section border-t border-wire">
        <div className="inst-container">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="inst-label">Full Inclusions</span>
              <h2 className="font-display font-light text-sable leading-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}>
                Everything in Your Monthly Fee
              </h2>
              <p className="text-dusk text-[0.9375rem] leading-relaxed mb-8">
                No hidden transaction fees. The AED 1,499 monthly fee covers
                all services listed below for your property.
              </p>
              <Link href="/register?service=selling"
                className="inline-flex items-center gap-2 bg-sable text-cream px-6 py-3 hover:bg-cobalt transition-colors duration-150 text-[0.8125rem] tracking-wide">
                Begin Onboarding
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-wire">
                {INCLUSIONS.map((item) => (
                  <div key={item} className="bg-linen px-5 py-4 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span className="text-[0.875rem] text-pewter">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="bg-sable border-t border-bronze/10">
        <div className="inst-container py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="/impervia logo.png" alt="Impervia Estates" width={28} height={28} className="w-7 h-7 object-contain" />
              </div>
              <span className="font-display text-[0.9375rem] font-medium text-cream">Impervia Estates</span>
            </Link>
            <div className="flex items-center gap-6">
              {[{ label: 'All Services', href: '/#services' }, { label: 'Properties', href: '/properties' }, { label: 'Contact', href: '/#contact' }].map((l) => (
                <Link key={l.label} href={l.href} className="text-[0.75rem] text-haze hover:text-cream transition-colors">{l.label}</Link>
              ))}
            </div>
            <p className="text-[0.6875rem] text-fog">© {new Date().getFullYear()} RSBD Solutions FZE · RERA Licensed</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
