'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'About',      href: '#about' },
  { label: 'Contact',    href: '#contact' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="md:hidden flex items-center justify-center w-9 h-9 text-pewter hover:text-sable transition-colors duration-150"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-[68px] z-40 md:hidden" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-sable/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative bg-cream border-b border-wire shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <nav className="inst-container py-2">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-4 text-[0.9375rem] text-pewter hover:text-sable transition-colors duration-150 ${
                    i < NAV_LINKS.length - 1 ? 'border-b border-wire' : ''
                  }`}
                >
                  {link.label}
                  <span className="text-bronze text-[0.65rem] tracking-[0.15em] uppercase">→</span>
                </a>
              ))}

              <div className="py-5 flex items-center gap-3 border-t border-wire mt-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2.5 border border-wire text-[0.8125rem] text-pewter hover:text-sable hover:border-sable transition-colors duration-150 tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2.5 bg-sable text-cream text-[0.8125rem] hover:bg-cobalt transition-colors duration-150 tracking-wide"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
