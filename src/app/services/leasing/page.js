import Link from 'next/link'
import {
  Building2,
  FileText,
  ArrowRight,
  CheckCircle2,
  Scale,
  RefreshCw,
  Users,
  FolderOpen,
  BarChart3,
  Bell,
  Shield,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Leasing Services | GoFor Properties',
  description: 'Professional property leasing services in UAE. Custom lease agreements, legal compliance, renewal automation, and document management.'
}

const features = [
  {
    icon: FileText,
    title: 'Custom Lease Agreements',
    description: 'Professionally drafted lease contracts tailored to your property type, whether residential, commercial, or industrial.'
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    description: 'Stay compliant with UAE tenancy laws, RERA regulations, and Ejari requirements with our expert guidance.'
  },
  {
    icon: RefreshCw,
    title: 'Renewal Automation',
    description: 'Automated renewal reminders, negotiation workflows, and seamless contract extensions to retain good tenants.'
  },
  {
    icon: FolderOpen,
    title: 'Document Management',
    description: 'Secure cloud storage for all lease documents, amendments, and correspondence with easy retrieval.'
  },
  {
    icon: Users,
    title: 'Tenant Relations',
    description: 'Professional communication tools for lease inquiries, negotiations, and ongoing tenant management.'
  },
  {
    icon: BarChart3,
    title: 'Reporting & Analytics',
    description: 'Comprehensive reports on lease performance, occupancy rates, and revenue projections.'
  }
]

const steps = [
  {
    number: '01',
    title: 'Define Terms',
    description: 'Specify your lease requirements, terms, and conditions through our intuitive setup wizard.'
  },
  {
    number: '02',
    title: 'Generate Agreement',
    description: 'We create a legally compliant lease agreement customized to your property and tenant.'
  },
  {
    number: '03',
    title: 'Execute & Register',
    description: 'Digital signatures, Ejari registration support, and secure document delivery.'
  },
  {
    number: '04',
    title: 'Manage & Renew',
    description: 'Track lease status, receive renewal alerts, and manage amendments all in one place.'
  }
]

const inclusions = [
  'Unlimited lease agreements',
  'Legal document templates',
  'E-signature integration',
  'Ejari registration support',
  'Renewal management',
  'Amendment tracking',
  'Tenant portal access',
  'Document cloud storage',
  'Compliance monitoring',
  'Financial reporting'
]

const propertyTypes = [
  { name: 'Residential', description: 'Apartments, villas, and townhouses' },
  { name: 'Commercial', description: 'Offices, retail spaces, and warehouses' },
  { name: 'Industrial', description: 'Factories, workshops, and storage facilities' },
  { name: 'Mixed-Use', description: 'Combined residential and commercial properties' }
]

export default function LeasingServicePage() {
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
              <Button size="sm" asChild className="bg-indigo-500 hover:bg-indigo-600 text-white">
                <Link href="/register?service=leasing">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Leasing Service
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-blue-950 tracking-tight leading-tight mb-6">
                Professional{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Lease Management
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                From custom contract creation to renewal automation, our leasing service
                provides everything you need to manage long-term leases for commercial
                and residential properties.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                  <Link href="/register?service=leasing">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 max-w-md">
                <div className="text-center mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg shadow-indigo-500/25 mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">Leasing Service</h3>
                  <p className="text-slate-500 text-sm mt-1">Complete lease management</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-950">AED 1,299</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {inclusions.slice(0, 6).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" size="lg">
                  <Link href="/register?service=leasing">
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

      {/* Property Types */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-blue-950 mb-2">
              Leasing Solutions for All Property Types
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypes.map((type, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-5 text-center">
                <Building className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                <h3 className="font-bold text-blue-950 mb-1">{type.name}</h3>
                <p className="text-slate-500 text-xs">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
              Comprehensive Lease Management Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and renew leases professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-md shadow-indigo-500/20 mb-4">
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
              A streamlined process from lease creation to renewal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-indigo-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-bold text-blue-950 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent -translate-x-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Everything Included in Your Plan
                </h2>
                <p className="text-indigo-100 mb-6">
                  A complete leasing solution for professional property management at scale.
                </p>
                <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-indigo-50">
                  <Link href="/register?service=leasing">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white text-sm">
                    <CheckCircle2 className="h-5 w-5 text-indigo-200 flex-shrink-0" />
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
            Ready to Streamline Your Leasing Process?
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
            Professional lease management for property owners who demand compliance and efficiency.
          </p>
          <Button size="lg" asChild className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
            <Link href="/register?service=leasing">
              Get Started for AED 1,299/month
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



