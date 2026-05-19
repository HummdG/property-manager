import Link from 'next/link'
import Image from 'next/image'
import MobileNav from './MobileNav'

const DEFAULT_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'About',      href: '/#about' },
  { label: 'Contact',    href: '/#contact' },
]

export default function SiteHeader({
  links = DEFAULT_LINKS,
  cta = { label: 'Get Started', href: '/register' },
}) {
  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-bronze/30">
      <nav className="inst-container h-[72px] flex items-center">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center group" aria-label="Impervia Estates">
            <Image
              src="/impervia-horizontal-logo.png"
              alt="Impervia Estates"
              width={1449}
              height={305}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-9">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150 tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
          <Link
            href="/login"
            className="hidden md:inline text-[0.8125rem] text-pewter hover:text-sable transition-colors duration-150"
          >
            Sign In
          </Link>
          <Link
            href={cta.href}
            className="text-[0.8125rem] bg-sable text-cream px-4 py-2 hover:bg-cobalt transition-colors duration-150 tracking-wide"
          >
            {cta.label}
          </Link>
          <MobileNav links={links} cta={cta} />
        </div>
      </nav>
    </header>
  )
}
