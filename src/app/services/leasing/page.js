import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/shared/SiteHeader'
import {
  Key,
  FileText,
  ArrowRight,
  CheckCircle2,
  Search,
  Handshake,
  Megaphone,
  ShieldCheck,
  Users,
  Home,
  Building2,
  ClipboardList,
} from 'lucide-react'

export const metadata = {
  title: 'Leasing Brokerage | Impervia Estates',
  description:
    'A new standard for leasing brokerage in the UAE. Landlord and tenant representation, qualified introductions, sharp negotiation, and clean closings.',
}

const FEATURES = [
  {
    Icon: ClipboardList,
    title: 'Market Valuation & Strategy',
    description:
      'Evidence-led rental valuation grounded in current comparables. Asking price, term, and concession strategy mapped before we go to market.',
  },
  {
    Icon: Megaphone,
    title: 'Listing & Syndication',
    description:
      'Editorial-grade listings with professional photography, syndicated across Bayut, Property Finder, Dubizzle, and our private channels.',
  },
  {
    Icon: Search,
    title: 'Qualified Tenant Sourcing',
    description:
      'Active outreach to vetted prospects, corporate occupier desks, and relocation partners — never a passive listing-and-wait approach.',
  },
  {
    Icon: Users,
    title: 'Tenant Representation',
    description:
      'On the other side of the deal? We brief, shortlist, view, and negotiate exclusively for tenants who want a partisan advocate.',
  },
  {
    Icon: Handshake,
    title: 'Negotiation, Both Sides',
    description:
      'Disciplined commercial negotiation on rent, term, payment plan, fit-out allowance, and break clauses. We close, we do not concede.',
  },
  {
    Icon: ShieldCheck,
    title: 'Lease Drafting & Ejari',
    description:
      'Contracts drafted to current UAE tenancy law, Ejari registration handled end-to-end, deposit and cheque schedule documented.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Brief & Valuation',
    description:
      'We sit with you, understand the asset or the requirement, and produce a written valuation and go-to-market strategy.',
  },
  {
    number: '02',
    title: 'Activate the Market',
    description:
      'Listings live across every relevant channel. Direct outreach to qualified prospects. Viewings coordinated to a tight schedule.',
  },
  {
    number: '03',
    title: 'Negotiate the Deal',
    description:
      'Offers presented in writing with our recommendation. Counter-offers managed transparently. No surprises, no silent margin.',
  },
  {
    number: '04',
    title: 'Close & Hand Over',
    description:
      'Lease drafted, Ejari registered, keys exchanged, move-in inspection documented. Deal closed in days, not weeks.',
  },
]

const INCLUSIONS = [
  'Written rental valuation',
  'Go-to-market strategy',
  'Professional photography & floor plan',
  'Bayut, Property Finder & Dubizzle listings',
  'Private network & corporate desk outreach',
  'Tenant pre-qualification & background checks',
  'Viewing coordination & accompaniment',
  'Commercial negotiation, end-to-end',
  'Lease drafting (UAE tenancy law compliant)',
  'Ejari registration handling',
  'Move-in inspection report',
  'Post-closing documentation archive',
]

const REPRESENTATION = [
  {
    Icon: Home,
    label: 'Landlords',
    desc: 'Get to a signed lease, faster, with the right tenant',
  },
  {
    Icon: Users,
    label: 'Tenants',
    desc: 'A partisan advocate, finding the right home',
  },
  {
    Icon: Building2,
    label: 'Corporate Occupiers',
    desc: 'Discreet sourcing, multi-unit, relocation-ready',
  },
  {
    Icon: Key,
    label: 'Off-Plan Handover',
    desc: 'First-lease strategy for newly handed-over assets',
  },
]

const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function LeasingBrokeragePage() {
  return (
    <div className="bg-cream font-sans antialiased">

      <SiteHeader links={NAV_LINKS} cta={{ label: 'Brief Us', href: '/register?service=leasing' }} />

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
            <span className="text-bronze">Leasing Brokerage</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-bronze/25 bg-bronze/5 px-3 py-[7px] mb-8">
                <Key className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
                <span className="text-[0.65rem] text-bronze tracking-[0.18em] uppercase font-medium">
                  Landlord & Tenant Representation
                </span>
              </div>

              <h1
                className="font-display font-light text-cream leading-tight mb-6"
                style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
              >
                Leasing Brokerage,{' '}
                <span className="text-bronze-light italic">Sharper</span>{' '}
                on Every Side.
              </h1>

              <p className="text-haze text-[1rem] leading-relaxed max-w-xl mb-10 font-light">
                We represent landlords looking for the right tenant and tenants
                looking for the right home or premises. Evidence-led valuations,
                active sourcing, disciplined negotiation, and clean closings,
                end-to-end.
              </p>

              <div className="flex items-center gap-6">
                <Link href="/register?service=leasing"
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-6 py-3 hover:bg-white/5 transition-colors duration-150 text-[0.8125rem] tracking-wide">
                  Brief Us
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/#contact"
                  className="text-[0.8125rem] text-haze hover:text-cream transition-colors duration-150">
                  Request a Consultation
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-bronze/20 bg-cobalt p-8">
                <div className="border-b border-bronze/15 pb-6 mb-6">
                  <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-3">Brokerage Fee</p>
                  <div className="font-display text-[3rem] font-light text-cream leading-none">5%</div>
                  <div className="text-[0.75rem] text-haze mt-1">of one year&rsquo;s rent · paid on signature</div>
                </div>
                <ul className="space-y-3 mb-7">
                  {INCLUSIONS.slice(0, 6).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.8125rem] text-haze">
                      <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?service=leasing"
                  className="block w-full text-center bg-bronze text-sable px-5 py-3 text-[0.8125rem] font-medium tracking-wide hover:bg-bronze-light transition-colors duration-150">
                  Brief Us Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Representation ─────────────────────────────────── */}
      <section className="bg-cobalt border-t border-bronze/10">
        <div className="inst-container py-10">
          <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-6">
            Who We Represent
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-bronze/10">
            {REPRESENTATION.map(({ Icon, label, desc }) => (
              <div key={label} className="bg-cobalt px-6 py-5 flex items-start gap-3">
                <Icon className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                <div>
                  <div className="text-[0.875rem] font-medium text-cream mb-0.5">{label}</div>
                  <div className="text-[0.75rem] text-haze">{desc}</div>
                </div>
              </div>
            ))}
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
              Every Step of the Lease Deal
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
              Brief to Signed Lease, in Days.
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
                Everything in the Brokerage Fee
              </h2>
              <p className="text-dusk text-[0.9375rem] leading-relaxed mb-8">
                The 5% brokerage fee covers every line below — from valuation
                through to Ejari and move-in. No add-ons, no hidden charges.
                If we don&rsquo;t close, you don&rsquo;t pay.
              </p>
              <Link href="/register?service=leasing"
                className="inline-flex items-center gap-2 bg-sable text-cream px-6 py-3 hover:bg-cobalt transition-colors duration-150 text-[0.8125rem] tracking-wide">
                Brief Us Today
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
            <p className="text-[0.6875rem] text-fog">© {new Date().getFullYear()} RSBD Solutions FZE · Dubai, UAE</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
