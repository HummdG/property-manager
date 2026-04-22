import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import MobileNav from '@/components/shared/MobileNav'

const STATS = [
  { value: '12+', label: 'Years in Operation' },
  { value: '2,400+', label: 'Properties Managed' },
  { value: '98%', label: 'Client Retention' },
  { value: 'RERA', label: 'Licensed & Regulated' },
]

const CREDENTIALS = [
  'RERA Licensed (Real Estate Regulatory Agency)',
  'DLD Registered (Dubai Land Department)',
  'Adherent to RICS professional standards',
  'Annual independent compliance audit',
]

const PRESENCE = [
  'Operating since 2012 across the UAE',
  'Offices in Dubai, Abu Dhabi & Sharjah',
  'Residential and commercial expertise',
  'Dedicated account manager per client',
]

const PROCESS = [
  {
    number: '01',
    title: 'Initial Consultation',
    description:
      'A formal assessment of your property portfolio, requirements, and investment objectives.',
  },
  {
    number: '02',
    title: 'Service Agreement',
    description:
      'A transparent service agreement outlining scope, fees, timelines, and regulatory obligations.',
  },
  {
    number: '03',
    title: 'Onboarding & Audit',
    description:
      'Thorough documentation review, property inspection, and full compliance verification.',
  },
  {
    number: '04',
    title: 'Ongoing Management',
    description:
      'Regular structured reporting, proactive maintenance, and dedicated account oversight.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'Impervia Estates has managed our residential portfolio for six years. Their compliance rigour and transparent reporting give us complete confidence in our investments.',
    author: 'Ahmed Al-Mansouri',
    title: 'Portfolio Investor, Dubai',
  },
  {
    quote:
      'The professionalism is consistent, from lease drafting to maintenance coordination. Exactly what you expect from a firm of this standing.',
    author: 'Sarah Mitchell',
    title: 'Property Owner, Abu Dhabi',
  },
  {
    quote:
      'After dealing with two other agents, the difference with Impervia Estates is the attention to regulatory detail. They understand the market and they understand compliance.',
    author: 'James Thornton',
    title: 'Commercial Landlord, Sharjah',
  },
]

export default function HomePage() {
  return (
    <div className="bg-cream font-sans antialiased">

      {/* ─── Navigation ─────────────────────────────────────── */}
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
              { label: 'Properties', href: '/properties' },
              { label: 'About', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/login"
              className="hidden md:inline text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-[0.8125rem] bg-sable text-cream px-4 py-2 hover:bg-cobalt transition-colors duration-150 tracking-wide"
            >
              Get Started
            </Link>
            <MobileNav />
          </div>
        </nav>
      </header>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative bg-sable min-h-[88vh] flex items-center overflow-hidden">

        {/* Architectural grid */}
        <div className="absolute inset-0 inst-hero-grid" />

        {/* Radial gold ambient glow — gives warmth behind the left content */}
        <div
          className="absolute inset-0 hero-glow-breathe"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 28% 58%, rgba(184,150,90,0.09) 0%, transparent 72%)' }}
        />

        {/* Atmospheric background image — mobile only (desktop shows it inside the stats panel) */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=75"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.18]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sable/30 via-transparent to-sable/50 pointer-events-none" />
        </div>

        {/* Ghost watermark — giant "IMPERVIA" in faint Cormorant */}
        <div className="absolute bottom-0 right-[-2%] pointer-events-none select-none overflow-hidden leading-none">
          <span
            className="font-display font-light block"
            style={{
              fontSize: 'clamp(7rem, 20vw, 24rem)',
              color: 'rgba(184,150,90,0.032)',
              letterSpacing: '-0.03em',
              lineHeight: 0.85,
            }}
          >
            IMPERVIA
          </span>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-bronze/20" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 hero-in-5">
          <span className="text-[0.55rem] text-haze/30 tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-7 bg-haze/10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-full bg-bronze/50 hero-scroll-tick" />
          </div>
        </div>

        <div className="relative z-10 inst-container py-14 lg:py-28 w-full">
          <div className="grid lg:grid-cols-12 gap-0 items-stretch">

            {/* Main content */}
            <div className="lg:col-span-7 lg:pr-16 lg:border-r lg:border-bronze/10">

              {/* RERA badge */}
              <div className="hero-in-1 inline-flex items-center gap-2 border border-bronze/25 bg-bronze/5 px-3 py-[7px] mb-5 lg:mb-8">
                <Shield className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
                <span className="text-[0.65rem] text-bronze tracking-[0.18em] uppercase font-medium">
                  RERA Licensed · Dubai, UAE
                </span>
              </div>

              {/* Decorative ornament */}
              <div className="hero-in-2 flex items-center gap-3 mb-4 lg:mb-7">
                <div className="w-8 h-px bg-bronze/35" />
                <div className="w-[5px] h-[5px] rotate-45 border border-bronze/45" />
                <div className="w-8 h-px bg-bronze/35" />
              </div>

              {/* Heading */}
              <h1
                className="hero-in-2 font-display font-light text-cream leading-[1.06] mb-4 lg:mb-6"
                style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)' }}
              >
                Property Management
                <br />
                <span className="text-bronze-light italic">Built on Precision</span>{' '}
                <span className="text-cream/90">&amp; Trust</span>
              </h1>

              {/* Sub */}
              <p className="hero-in-3 text-haze text-[0.9375rem] lg:text-[1.0625rem] leading-relaxed max-w-lg mb-3 font-light">
                Over a decade managing residential and commercial portfolios
                across the UAE. Regulatory compliance, transparent reporting,
                and dedicated client service.
              </p>

              {/* Coordinates — editorial personality touch */}
              <div className="hero-in-3 flex items-center gap-2 mb-7 lg:mb-10">
                <span className="text-[0.6rem] text-haze/35 tracking-[0.16em] font-medium uppercase">
                  25.2048° N · 55.2708° E
                </span>
                <span className="w-3 h-px bg-haze/20" />
                <span className="text-[0.6rem] text-haze/35 tracking-[0.16em] font-medium uppercase">
                  Est. 2012
                </span>
              </div>

              {/* CTAs */}
              <div className="hero-in-4 flex flex-wrap items-center gap-4 lg:gap-6">
                <Link
                  href="/properties"
                  className="group inline-flex items-center gap-2.5 border border-cream/25 text-cream px-6 py-3 hover:border-bronze/50 hover:bg-bronze/5 transition-all duration-200 text-[0.8125rem] tracking-wide"
                >
                  Browse Properties
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                </Link>
                <a
                  href="#contact"
                  className="text-[0.8125rem] text-haze hover:text-cream transition-colors duration-150 tracking-wide underline-offset-4 hover:underline decoration-bronze/40"
                >
                  Request a Consultation
                </a>
              </div>
            </div>

            {/* Stats panel desktop */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-center pl-16 gap-0 hero-line-draw relative overflow-hidden">
              {/* Dubai Marina — atmospheric texture behind stats */}
              <Image
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=75"
                alt=""
                fill
                priority
                className="object-cover opacity-[0.18]"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sable/75 to-sable/10 pointer-events-none" />
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`group relative z-10 py-8 cursor-default ${i < STATS.length - 1 ? 'border-b border-bronze/10' : ''}`}
                >
                  <div className="font-display text-[2.5rem] font-light text-bronze leading-none mb-2 group-hover:text-bronze-light transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-[0.65rem] text-haze tracking-[0.18em] uppercase group-hover:text-haze/80 transition-colors duration-300">
                    {stat.label}
                  </div>
                  {/* Gold reveal line on hover */}
                  <div className="mt-3 h-px w-0 bg-bronze/40 group-hover:w-10 transition-all duration-400" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Stats mobile only */}
      <div className="lg:hidden bg-cobalt border-b border-bronze/10">
        <div className="inst-container py-8 grid grid-cols-2 gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 ${i % 2 === 0 ? 'border-r border-bronze/10' : ''} ${i < 2 ? 'border-b border-bronze/10' : ''} px-4`}
            >
              <div className="font-display text-3xl font-light text-bronze leading-none mb-1.5">
                {stat.value}
              </div>
              <div className="text-[0.6rem] text-haze tracking-[0.15em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── About / Credibility ────────────────────────────── */}
      <section id="about" className="bg-cream inst-section border-t border-wire">
        <div className="inst-container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Narrative */}
            <div className="lg:col-span-6">
              <span className="inst-label">About</span>
              <h2
                className="font-display font-light text-sable leading-tight mb-8"
                style={{ fontSize: 'clamp(1.875rem, 3vw, 2.75rem)' }}
              >
                Established Expertise in UAE Property Management
              </h2>
              <div className="space-y-5 text-dusk text-[0.9375rem] leading-relaxed">
                <p>
                  Impervia Estates was established to address a consistent gap in
                  the UAE market: property management that prioritises regulatory
                  compliance, transparent reporting, and genuine long-term client
                  relationships over short-term transactional volume.
                </p>
                <p>
                  Our team operates across residential and commercial sectors,
                  serving individual landlords, institutional investors, and
                  corporate occupiers. We hold full RERA licensing and maintain
                  ongoing professional development in UAE property law.
                </p>
                <p>
                  Every client relationship begins with a formal service
                  agreement. Every property is managed to a documented standard.
                  Every financial report is independently verifiable.
                </p>
              </div>
            </div>

            {/* Credentials panel */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="border border-wire divide-y divide-wire">
                <div className="p-7">
                  <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                    Regulatory Standing
                  </p>
                  <ul className="space-y-3">
                    {CREDENTIALS.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[0.875rem] text-pewter">
                        <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-7">
                  <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                    Market Presence
                  </p>
                  <ul className="space-y-3">
                    {PRESENCE.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[0.875rem] text-pewter">
                        <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Process ────────────────────────────────────────── */}
      <section className="bg-sable inst-section">
        <div className="inst-container">

          {/* Header — text left, image right */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-10 lg:mb-14">

            {/* Text */}
            <div className="lg:col-span-5">
              <span className="inst-label-light">How We Work</span>
              <h2
                className="font-display font-light text-cream leading-tight max-w-lg mt-2"
                style={{ fontSize: 'clamp(1.875rem, 3vw, 2.75rem)' }}
              >
                A Structured Onboarding &amp; Management Process
              </h2>
            </div>

            {/* Image */}
            <div className="lg:col-span-7 relative h-[190px] lg:h-[250px] overflow-hidden group border border-bronze/10">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85"
                alt="Luxury residential property"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover opacity-90 scale-[1.02] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
              />
              {/* Left-to-right fade blends into the text column */}
              <div className="absolute inset-0 bg-gradient-to-r from-sable/75 via-sable/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-sable/80 via-sable/20 to-transparent" />

              {/* Editorial caption overlay */}
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <p className="text-cream text-[0.75rem] leading-relaxed max-w-[22rem] font-light italic">
                  &ldquo;Every engagement begins with clarity on scope, obligations, and expectations.&rdquo;
                </p>
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ml-4">
                  <div className="w-4 h-px bg-bronze/45" />
                  <span className="text-[0.5rem] text-haze/40 tracking-[0.22em] uppercase">Dubai, UAE</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-step grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-bronze/10">
            {PROCESS.map((step) => (
              <div key={step.number} className="bg-sable p-6 lg:p-10">
                <div className="font-display text-[3.5rem] font-light text-bronze/20 leading-none mb-6">
                  {step.number}
                </div>
                <h3 className="font-display text-[1.125rem] font-medium text-cream mb-4">
                  {step.title}
                </h3>
                <p className="text-haze text-[0.875rem] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Dubai Showcase ─────────────────────────────────── */}
      <section className="bg-sable border-t border-bronze/10">
        <div className="inst-container py-14 lg:py-24">

          {/* Header row */}
          <div className="mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="inst-label-light">Our City</span>
              <h2
                className="font-display font-light text-cream leading-tight max-w-xl mt-2"
                style={{ fontSize: 'clamp(1.875rem, 3vw, 2.75rem)' }}
              >
                At the Heart of Dubai&rsquo;s Property Market
              </h2>
            </div>
            <p className="text-haze text-[0.875rem] leading-relaxed max-w-sm lg:text-right">
              Managing portfolios across Downtown, DIFC, Marina,{' '}
              Business Bay, and Palm Jumeirah.
            </p>
          </div>

          {/* Image grid */}
          <div className="grid lg:grid-cols-12 gap-1 h-[320px] lg:h-[480px]">

            {/* Large primary image */}
            <div className="lg:col-span-8 relative overflow-hidden group border border-bronze/10 h-[320px] lg:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85"
                alt="Dubai Marina skyline at night"
                fill
                sizes="(max-width: 1024px) 100vw, 67vw"
                className="object-cover opacity-90 scale-[1.02] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sable/50 to-transparent" />
              <div className="absolute bottom-5 left-6 flex items-center gap-2.5">
                <div className="w-5 h-px bg-bronze/55" />
                <span className="text-[0.55rem] text-haze/60 tracking-[0.25em] uppercase">Dubai Marina</span>
              </div>
            </div>

            {/* Two stacked images — desktop only */}
            <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-1">
              <div className="relative overflow-hidden group border border-bronze/10">
                <Image
                  src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=85"
                  alt="Burj Khalifa, Downtown Dubai"
                  fill
                  sizes="33vw"
                  className="object-cover opacity-85 scale-[1.02] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sable/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-px bg-bronze/50" />
                  <span className="text-[0.55rem] text-haze/80 tracking-[0.25em] uppercase">Downtown</span>
                </div>
              </div>
              <div className="relative overflow-hidden group border border-bronze/10">
                <Image
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=85"
                  alt="Business Bay, Dubai"
                  fill
                  sizes="33vw"
                  className="object-cover opacity-85 scale-[1.02] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sable/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-px bg-bronze/50" />
                  <span className="text-[0.55rem] text-haze/80 tracking-[0.25em] uppercase">Business Bay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom ornament + link */}
          <div className="mt-6 pt-6 border-t border-bronze/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-bronze/30" />
              <div className="w-[4px] h-[4px] rotate-45 border border-bronze/40" />
              <div className="w-8 h-px bg-bronze/30" />
            </div>
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2.5 text-[0.8125rem] text-haze hover:text-cream transition-colors duration-150 tracking-wide"
            >
              View Available Properties
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          </div>

        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <section className="bg-linen inst-section border-t border-wire">
        <div className="inst-container">
          <div className="mb-10 lg:mb-14">
            <span className="inst-label">Client Accounts</span>
            <h2
              className="font-display font-light text-sable"
              style={{ fontSize: 'clamp(1.875rem, 3vw, 2.5rem)' }}
            >
              What Our Clients Say
            </h2>
          </div>

<div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-cream border border-wire p-6 lg:p-8">
                <div className="font-display text-[2rem] text-bronze leading-none mb-5">
                  &ldquo;
                </div>
                <p className="text-pewter text-[0.875rem] leading-relaxed italic mb-8">
                  {t.quote}
                </p>
                <div className="border-t border-wire pt-5">
                  <div className="text-[0.875rem] font-medium text-sable">
                    {t.author}
                  </div>
                  <div className="text-[0.75rem] text-fog mt-0.5">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact ────────────────────────────────────────── */}
      <section id="contact" className="bg-cream inst-section border-t border-wire">
        <div className="inst-container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Info */}
            <div className="lg:col-span-4">
              <span className="inst-label">Contact</span>
              <h2
                className="font-display font-light text-sable leading-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}
              >
                Request a Consultation
              </h2>
              <p className="text-dusk text-[0.875rem] leading-relaxed mb-10">
                We respond to all enquiries within one business day. For urgent
                matters, please contact our office directly.
              </p>
              <div className="space-y-4">
                {[
                  { Icon: Phone, text: '+971 4 XXX XXXX' },
                  { Icon: Mail, text: 'enquiries@imperviaestates.ae' },
                  { Icon: MapPin, text: 'Business Bay, Dubai, UAE' },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 text-[0.875rem] text-pewter">
                    <Icon className="w-4 h-4 text-bronze flex-shrink-0 mt-[1px]" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="inst-label-form">Full Name</label>
                    <input
                      type="text"
                      className="inst-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="inst-label-form">Company</label>
                    <input
                      type="text"
                      className="inst-input"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="inst-label-form">Email Address</label>
                    <input
                      type="email"
                      className="inst-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="inst-label-form">Phone Number</label>
                    <input
                      type="tel"
                      className="inst-input"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="inst-label-form">Service of Interest</label>
                  <select className="inst-input">
                    <option value="">Select a service</option>
                    <option value="renting">Rental Management</option>
                    <option value="leasing">Lease Management</option>
                    <option value="maintaining">Property Maintenance</option>
                    <option value="selling">Property Sales</option>
                  </select>
                </div>
                <div>
                  <label className="inst-label-form">Message</label>
                  <textarea
                    className="inst-input h-28 resize-none"
                    placeholder="Brief description of your requirements"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sable text-cream py-3.5 text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150"
                >
                  Submit Enquiry
                </button>
                <p className="text-[0.6875rem] text-fog text-center">
                  Your enquiry is treated in strict confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="bg-sable border-t border-bronze/10">
        <div className="inst-container py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-12 lg:mb-14">

            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image src="/impervia logo.png" alt="Impervia Estates" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <span className="font-display text-[0.9375rem] font-medium text-cream">
                  Impervia Estates
                </span>
              </Link>
              <p className="text-[0.75rem] text-haze leading-relaxed">
                Licensed property management and real estate services across the
                UAE. RERA Registered.
              </p>
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
                      className="text-[0.75rem] text-haze hover:text-cream transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                Company
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'Properties', href: '/properties' },
                  { label: 'Sign In', href: '/login' },
                  { label: 'Register', href: '/register' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.75rem] text-haze hover:text-cream transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[0.6rem] text-bronze uppercase tracking-[0.18em] font-medium mb-5">
                Legal
              </p>
              <ul className="space-y-3">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Complaints Procedure',
                  'Data Protection',
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[0.75rem] text-haze hover:text-cream transition-colors duration-150"
                    >
                      {item}
                    </a>
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

          {/* Bottom bar */}
          <div className="border-t border-bronze/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-[0.6875rem] text-fog">
              © {new Date().getFullYear()} RSBD Solutions FZE. All rights reserved. RERA
              License No. XXXX
            </p>
            <p className="text-[0.6875rem] text-fog">
              Registered in Dubai, UAE · DLD No. XXXX · TRN: XXXX
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
