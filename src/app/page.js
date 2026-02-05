import Link from 'next/link'
import {
  Building2,
  Home,
  Key,
  Wrench,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    id: 'renting',
    name: 'Renting',
    description: 'List your properties for rent and find quality tenants with ease',
    icon: Key,
    iconBg: 'from-amber-400 to-orange-500',
    buttonBg: 'bg-amber-500 hover:bg-amber-600',
    shadowColor: 'shadow-amber-500/25',
    price: 799,
    features: [
      'Tenant screening & verification',
      'Automated rent collection',
      'Lease management',
      'Maintenance coordination'
    ],
    cta: 'Learn More',
    href: '/services/renting'
  },
  {
    id: 'selling',
    name: 'Selling',
    description: 'Showcase your properties to serious buyers across the UAE',
    icon: Home,
    iconBg: 'from-emerald-400 to-teal-500',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
    shadowColor: 'shadow-emerald-500/25',
    price: 1499,
    features: [
      'Premium property listings',
      'Professional photography',
      'Market valuation tools',
      'Direct buyer connections'
    ],
    cta: 'Learn More',
    href: '/services/selling'
  },
  {
    id: 'maintaining',
    name: 'Maintaining',
    description: 'Keep your properties in top condition with our maintenance network',
    icon: Wrench,
    iconBg: 'from-sky-400 to-blue-500',
    buttonBg: 'bg-sky-500 hover:bg-sky-600',
    shadowColor: 'shadow-sky-500/25',
    price: 599,
    features: [
      'Verified contractors',
      'Service request tracking',
      'Preventive maintenance',
      '24/7 emergency support'
    ],
    cta: 'Learn More',
    href: '/services/maintaining'
  },
  {
    id: 'leasing',
    name: 'Leasing',
    description: 'Long-term lease solutions for commercial and residential properties',
    icon: FileText,
    iconBg: 'from-indigo-400 to-purple-500',
    buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
    shadowColor: 'shadow-indigo-500/25',
    price: 1299,
    features: [
      'Custom lease agreements',
      'Legal compliance',
      'Renewal automation',
      'Document management'
    ],
    cta: 'Learn More',
    href: '/services/leasing'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Bank-grade security for all your property transactions and data'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Automate routine tasks and focus on what matters most'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Dedicated team ready to assist you every step of the way'
  },
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'Luxury-grade service for discerning property owners'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20 transition-shadow group-hover:shadow-lg group-hover:shadow-amber-500/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-blue-950">GoFor</span>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Properties</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/properties"
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                Browse Properties
              </Link>
              <a
                href="#services"
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                Services
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                Why GoFor
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-950">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Premium Property Management in UAE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-950 tracking-tight leading-tight">
              Your Properties,{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Whether you're renting, selling, maintaining, or leasing — GoFor Properties provides
              the complete toolkit for modern property management.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 px-8">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 px-8">
                <Link href="/properties">
                  Browse Properties
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free to start
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950">
              Choose Your Service
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive solutions for every property need. Select what suits you best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.iconBg} shadow-lg ${service.shadowColor} mb-5`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-blue-950 mb-1">
                    {service.name}
                  </h3>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-950">AED {service.price.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full ${service.buttonBg} text-white shadow-md ${service.shadowColor} transition-colors`}
                  >
                    <Link href={service.href}>
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950">
              Why Choose GoFor Properties
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Built for modern property owners who demand excellence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 mb-5">
                    <Icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-950 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-950 to-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
            Join thousands of property owners who trust GoFor Properties for their real estate needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 px-8">
              <Link href="/register">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-blue-700 text-white hover:bg-blue-800 px-8">
              <Link href="/properties">
                Explore Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-blue-950">GoFor</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Properties</span>
                </div>
              </Link>
              <p className="mt-4 text-sm text-slate-500 max-w-md">
                Your trusted partner in property management. Renting, selling, maintaining, and leasing — all in one platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-blue-950 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/renting" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Renting
                  </Link>
                </li>
                <li>
                  <Link href="/services/selling" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Selling
                  </Link>
                </li>
                <li>
                  <Link href="/services/maintaining" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Maintaining
                  </Link>
                </li>
                <li>
                  <Link href="/services/leasing" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Leasing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-950 mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Browse Properties
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-center text-sm text-slate-400">
              &copy; {new Date().getFullYear()} GoFor Properties. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
