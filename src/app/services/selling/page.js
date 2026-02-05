import Link from 'next/link'
import {
  Building2,
  Home,
  ArrowRight,
  CheckCircle2,
  Camera,
  TrendingUp,
  Users,
  FileText,
  Handshake,
  Globe,
  BarChart3,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Selling Services | GoFor Properties',
  description: 'Premium property selling services in UAE. Professional listings, photography, market analysis, and direct buyer connections.'
}

const features = [
  {
    icon: Globe,
    title: 'Premium Property Listings',
    description: 'Get maximum exposure with featured listings on our platform and syndication to major UAE property portals.'
  },
  {
    icon: Camera,
    title: 'Professional Photography',
    description: 'High-quality photos, drone shots, and 360° virtual tours that make your property stand out from the competition.'
  },
  {
    icon: Eye,
    title: 'Virtual Tours & Videos',
    description: 'Immersive virtual property tours that let buyers explore every corner from anywhere in the world.'
  },
  {
    icon: BarChart3,
    title: 'Market Valuation Tools',
    description: 'Data-driven pricing recommendations based on comparable sales, market trends, and neighborhood analysis.'
  },
  {
    icon: Users,
    title: 'Direct Buyer Connections',
    description: 'Access our network of pre-qualified buyers actively looking for properties in the UAE market.'
  },
  {
    icon: Handshake,
    title: 'Negotiation Support',
    description: 'Expert guidance through offers, counter-offers, and closing to ensure you get the best possible price.'
  }
]

const steps = [
  {
    number: '01',
    title: 'List Your Property',
    description: 'Submit your property details and our team will create a compelling listing with professional content.'
  },
  {
    number: '02',
    title: 'Get Exposure',
    description: 'Your property gets featured across multiple platforms, reaching thousands of potential buyers.'
  },
  {
    number: '03',
    title: 'Receive Offers',
    description: 'Qualified buyers submit offers directly through our platform. Review and compare with ease.'
  },
  {
    number: '04',
    title: 'Close the Deal',
    description: 'We guide you through negotiations and paperwork to a successful sale.'
  }
]

const inclusions = [
  'Premium listing placement',
  'Professional photography session',
  '360° virtual tour',
  'Drone aerial shots',
  'Market price analysis',
  'Buyer lead generation',
  'Offer management system',
  'Document preparation',
  'Negotiation assistance',
  'Closing coordination'
]

export default function SellingServicePage() {
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
              <Button size="sm" asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/register?service=selling">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6">
                <Home className="h-4 w-4" />
                Property Sales Service
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-blue-950 tracking-tight leading-tight mb-6">
                Sell Your Property{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  at Premium Value
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Maximum exposure, professional marketing, and expert guidance to help you
                sell your property faster and at the best possible price in the UAE market.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                  <Link href="/register?service=selling">
                    List Your Property
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties?listingType=SALE">View Listings</Link>
                </Button>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 max-w-md">
                <div className="text-center mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-4">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">Selling Service</h3>
                  <p className="text-slate-500 text-sm mt-1">Premium sales package</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-950">AED 1,499</span>
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

                <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
                  <Link href="/register?service=selling">
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
              Premium Marketing for Premium Properties
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stand out from the crowd with professional marketing tools that showcase your property at its best.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20 mb-4">
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
              A simple, streamlined process from listing to closing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-emerald-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-bold text-blue-950 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent -translate-x-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Everything Included in Your Plan
                </h2>
                <p className="text-emerald-100 mb-6">
                  A complete sales package designed to get your property sold quickly and at the right price.
                </p>
                <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <Link href="/register?service=selling">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-200 flex-shrink-0" />
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
            Ready to Sell Your Property?
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
            Get premium exposure and professional support to achieve the best sale price for your property.
          </p>
          <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <Link href="/register?service=selling">
              Get Started for AED 1,499/month
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

