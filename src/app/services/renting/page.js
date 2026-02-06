import Link from 'next/link'
import {
  Building2,
  Key,
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  FileText,
  Wrench,
  Shield,
  Clock,
  TrendingUp,
  Megaphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Renting Services | GoFor Properties',
  description: 'Professional property rental management services in UAE. Tenant screening, rent collection, lease management, and more.'
}

const features = [
  {
    icon: Users,
    title: 'Tenant Screening & Verification',
    description: 'Comprehensive background checks, employment verification, and rental history analysis to ensure you get reliable tenants.'
  },
  {
    icon: CreditCard,
    title: 'Automated Rent Collection',
    description: 'Seamless online rent payments with automatic reminders, receipts, and tracking. Never chase payments again.'
  },
  {
    icon: FileText,
    title: 'Lease Management',
    description: 'Digital lease creation, e-signatures, renewal tracking, and secure document storage all in one place.'
  },
  {
    icon: Wrench,
    title: 'Maintenance Coordination',
    description: 'Connect with our verified contractor network for quick repairs. Track all service requests from submission to completion.'
  },
  {
    icon: Megaphone,
    title: 'Vacancy Marketing',
    description: 'Professional property listings with photography, virtual tours, and syndication across major UAE property portals.'
  },
  {
    icon: Shield,
    title: 'Legal Compliance',
    description: 'Stay compliant with UAE rental laws. Get Ejari registration support and standardized RERA contracts.'
  }
]

const steps = [
  {
    number: '01',
    title: 'List Your Property',
    description: 'Add your property details, upload photos, and set your rental preferences and price.'
  },
  {
    number: '02',
    title: 'Find Tenants',
    description: 'We market your property and screen potential tenants with thorough background checks.'
  },
  {
    number: '03',
    title: 'Sign & Collect',
    description: 'Execute digital leases and start collecting rent automatically through our platform.'
  },
  {
    number: '04',
    title: 'Manage & Grow',
    description: 'Handle maintenance, track finances, and scale your rental portfolio effortlessly.'
  }
]

const inclusions = [
  'Unlimited property listings',
  'Tenant screening reports',
  'Digital lease agreements',
  'Online rent collection',
  'Maintenance request system',
  'Financial reporting',
  'Document storage',
  'Email & chat support',
  'Ejari registration assistance',
  'Tenant communication portal'
]

export default function RentingServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-blue-950">GoFor</span>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Properties</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-950">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/register?service=renting">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
                <Key className="h-4 w-4" />
                Rental Management Service
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-blue-950 tracking-tight leading-tight mb-6">
                Effortless Property{' '}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Rental Management
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                From finding quality tenants to collecting rent automatically, our comprehensive
                rental management service handles everything so you can enjoy passive income
                without the hassle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25">
                  <Link href="/register?service=renting">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties">Browse Rentals</Link>
                </Button>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 max-w-md">
                <div className="text-center mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 mb-4">
                    <Key className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">Renting Service</h3>
                  <p className="text-slate-500 text-sm mt-1">Complete rental management</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-950">AED 799</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {inclusions.slice(0, 6).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-white" size="lg">
                  <Link href="/register?service=renting">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
              Everything You Need to Rent Successfully
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools and services to maximize your rental income and minimize your workload.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20 mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-950 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and begin managing your rentals like a pro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-amber-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-bold text-blue-950 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-amber-200 to-transparent -translate-x-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Everything Included in Your Plan
                </h2>
                <p className="text-amber-100 mb-6">
                  No hidden fees, no surprises. Get full access to all features with your monthly subscription.
                </p>
                <Button size="lg" asChild className="bg-white text-amber-600 hover:bg-amber-50">
                  <Link href="/register?service=renting">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white text-sm">
                    <CheckCircle2 className="h-5 w-5 text-amber-200 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 to-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Simplify Your Rental Business?
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
            Join thousands of property owners in the UAE who trust GoFor Properties for hassle-free rental management.
          </p>
          <Button size="lg" asChild className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25">
            <Link href="/register?service=renting">
              Get Started for AED 799/month
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-blue-950">GoFor Properties</span>
            </Link>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} GoFor Properties. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


