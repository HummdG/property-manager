import Link from 'next/link'
import { Building2, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Browse Properties | GoFor Properties',
  description: 'Find your dream property - browse homes, apartments, and commercial spaces for rent or sale'
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20 transition-shadow group-hover:shadow-lg group-hover:shadow-amber-500/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-blue-950">GoFor</span>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Properties</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/properties" 
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                All Properties
              </Link>
              <Link 
                href="/properties?listingType=RENT" 
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                For Rent
              </Link>
              <Link 
                href="/properties?listingType=SALE" 
                className="text-sm font-medium text-slate-600 hover:text-blue-950 transition-colors"
              >
                For Sale
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-950">
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20">
                <Link href="/register">
                  List Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
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
                Your trusted partner in finding the perfect property. Browse premium listings for rent or sale across the UAE.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-blue-950 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/properties" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link href="/properties?listingType=RENT" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Properties for Rent
                  </Link>
                </li>
                <li>
                  <Link href="/properties?listingType=SALE" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    Properties for Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
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
                  <Link href="/register" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
                    List Your Property
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
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

