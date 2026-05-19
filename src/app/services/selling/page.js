import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/shared/SiteHeader'
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
  Building2,
  Search,
  Handshake,
  ShieldCheck,
} from 'lucide-react'

export const metadata = {
  title: 'Sales Brokerage — Buying & Selling | Impervia Estates',
  description:
    'Sales brokerage for the UAE: seller and buyer representation, evidence-led valuations, premium marketing, sharp negotiation, and clean DLD transfer.',
}

const FEATURES = [
  {
    Icon: BarChart2,
    title: 'Evidence-Led Valuation',
    description:
      'Comparable-market analysis grounded in DLD transaction data — defensible pricing whether you are listing or making an offer.',
  },
  {
    Icon: Camera,
    title: 'Editorial Marketing',
    description:
      'Architectural photography, drone, virtual walk-throughs, and a listing narrative written by humans — not template copy.',
  },
  {
    Icon: Star,
    title: 'Premium Portal Placement',
    description:
      'Featured positioning across Bayut, Property Finder, and Dubizzle, plus discreet outreach to our private buyer network.',
  },
  {
    Icon: Search,
    title: 'Off-Market Buyer Access',
    description:
      'Buyers: get first sight of off-market opportunities and pre-launch inventory across Downtown, Marina, Palm, DIFC, and beyond.',
  },
  {
    Icon: Users,
    title: 'Counterparty Qualification',
    description:
      'Every buyer or seller we bring you is pre-qualified — financial verification, intent assessment, and timeline confirmed.',
  },
  {
    Icon: Handshake,
    title: 'Negotiation, Both Sides',
    description:
      'Disciplined offer strategy and counter-offer management. We sit at the table, we do not just pass messages.',
  },
  {
    Icon: FileText,
    title: 'MOU, SPA & NOC',
    description:
      'Form F drafting, MOU and SPA preparation, NOC applications, and developer liaison coordinated end-to-end.',
  },
  {
    Icon: ShieldCheck,
    title: 'DLD Transfer Closing',
    description:
      'Trustee office bookings, transfer-day coordination, settlement of fees, and final handover — clean, documented, on schedule.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Brief & Valuation',
    description:
      'Sellers: a written valuation and listing strategy. Buyers: a requirements brief and target shortlist with market analysis.',
  },
  {
    number: '02',
    title: 'Marketing or Sourcing',
    description:
      'Listings live with premium creative; or, for buyers, a curated pipeline of on- and off-market opportunities.',
  },
  {
    number: '03',
    title: 'Viewings & Negotiation',
    description:
      'Qualified viewings only. Offers and counter-offers managed in writing with our written recommendation at every stage.',
  },
  {
    number: '04',
    title: 'MOU to DLD Transfer',
    description:
      'Form F, MOU, deposit, NOC, mortgage liaison if needed, and transfer-day coordination through to keys.',
  },
]

const INCLUSIONS = [
  'Evidence-led valuation (sellers)',
  'Requirements brief & shortlist (buyers)',
  'Comparable-market analysis with DLD data',
  'Architectural photography & drone',
  'Virtual tour production',
  'Premium portal placement, all platforms',
  'Off-market and pre-launch access',
  'Counterparty pre-qualification',
  'Viewing coordination & accompaniment',
  'Offer & counter-offer negotiation',
  'Form F, MOU and SPA drafting',
  'NOC application & developer liaison',
  'Mortgage and conveyancing coordination',
  'DLD trustee office booking',
  'Transfer-day attendance & closing',
  'Post-sale documentation archive',
]

const REPRESENTATION = [
  {
    Icon: Home,
    label: 'Sellers',
    desc: 'Price right, market sharp, close clean',
  },
  {
    Icon: Search,
    label: 'Buyers',
    desc: 'A partisan advocate with off-market access',
  },
  {
    Icon: Building2,
    label: 'Investors',
    desc: 'Yield-led portfolio strategy and acquisition',
  },
  {
    Icon: TrendingUp,
    label: 'Off-Plan & Resale',
    desc: 'Primary launches and secondary-market deals',
  },
]

const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function SalesBrokeragePage() {
  return (
    <div className="bg-cream font-sans antialiased">

      <SiteHeader links={NAV_LINKS} cta={{ label: 'Brief Us', href: '/register?service=selling' }} />

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
            <span className="text-bronze">Sales Brokerage</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-bronze/25 bg-bronze/5 px-3 py-[7px] mb-8">
                <Home className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
                <span className="text-[0.65rem] text-bronze tracking-[0.18em] uppercase font-medium">
                  Buyer & Seller Representation
                </span>
              </div>

              <h1
                className="font-display font-light text-cream leading-tight mb-6"
                style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
              >
                Sales Brokerage,{' '}
                <span className="text-bronze-light italic">Buy-Side</span>{' '}
                and Sell-Side.
              </h1>

              <p className="text-haze text-[1rem] leading-relaxed max-w-xl mb-10 font-light">
                We represent sellers chasing the right price and buyers chasing
                the right asset. Evidence-led valuations, premium marketing,
                off-market access, sharp negotiation, and clean DLD transfer —
                from first conversation to keys in hand.
              </p>

              <div className="flex items-center gap-6">
                <Link href="/register?service=selling"
                  className="inline-flex items-center gap-2 border border-cream/25 text-cream px-6 py-3 hover:bg-white/5 transition-colors duration-150 text-[0.8125rem] tracking-wide">
                  Brief Us
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
                  <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-3">Brokerage Fee</p>
                  <div className="font-display text-[3rem] font-light text-cream leading-none">2%</div>
                  <div className="text-[0.75rem] text-haze mt-1">of sale price · paid on DLD transfer</div>
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
              The Full Sale, Without the Theatre
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-wire">
            {FEATURES.map((feat) => {
              const Icon = feat.Icon
              return (
                <div key={feat.title} className="bg-cream p-7">
                  <div className="w-9 h-9 border border-wire flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-bronze" />
                  </div>
                  <h3 className="font-display text-[1.0625rem] font-medium text-sable mb-3">{feat.title}</h3>
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
              From Brief to DLD Transfer.
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
                The 2% brokerage fee covers every line below — from valuation
                through to DLD transfer. No surprise charges, no silent margin
                on the side. If the deal does not complete, you do not pay.
              </p>
              <Link href="/register?service=selling"
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
