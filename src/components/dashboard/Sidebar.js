'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Home,
  Users,
  LayoutDashboard,
  X,
  MessageSquare,
  CalendarDays,
  MapPin,
  Activity,
  FileCheck,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const navigationByRole = {
  OWNER: [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard, exact: true },
    { name: 'Properties', href: '/owner/properties', icon: Building2 }
  ],
  TENANT: [
    { name: 'Dashboard', href: '/tenant', icon: LayoutDashboard, exact: true },
    { name: 'My Property', href: '/tenant/property', icon: Home }
  ],
  AGENT: [
    { name: 'Dashboard', href: '/agent', icon: LayoutDashboard, exact: true },
    { name: 'Properties', href: '/agent/properties', icon: Building2 },
    { name: 'Inquiries', href: '/agent/inquiries', icon: MessageSquare },
    { name: 'Daily Logs', href: '/agent/logs', icon: CalendarDays }
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Agents', href: '/admin/agents', icon: MapPin },
    { name: 'Agent Logs', href: '/admin/logs', icon: FileCheck },
    { name: 'System Events', href: '/admin/events', icon: Activity },
    { name: 'Agent Inquiries', href: '/admin/inquiries', icon: MessageSquare }
  ]
}

const roleLabels = {
  ADMIN: 'Administration',
  AGENT: 'Agent Portal',
  OWNER: 'Owner Portal',
  TENANT: 'Tenant Portal'
}

export function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname()

  const userRole = user?.role || 'OWNER'
  const navigation = navigationByRole[userRole] || navigationByRole.OWNER

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-sable/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:translate-x-0 overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(175deg, #121D2C 0%, #0D1A28 45%, #0A1620 100%)',
          borderRight: '1px solid rgba(184,150,90,0.1)'
        }}
      >
        {/* Architectural grid texture */}
        <div className="absolute inset-0 inst-hero-grid opacity-25 pointer-events-none" />

        {/* Ambient gold glow at top */}
        <div
          className="absolute top-0 inset-x-0 h-48 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 120% 160px at 30% -20px, rgba(184,150,90,0.09) 0%, transparent 100%)'
          }}
        />

        {/* Faint right-edge accent line */}
        <div
          className="absolute top-20 bottom-16 right-0 w-px pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(184,150,90,0.12) 25%, rgba(184,150,90,0.12) 75%, transparent)'
          }}
        />

        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between px-5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden flex-shrink-0 rounded-sm"
              style={{
                boxShadow: '0 0 0 1px rgba(184,150,90,0.22), 0 2px 12px rgba(0,0,0,0.3)'
              }}
            >
              <Image
                src="/impervia logo.png"
                alt="Impervia Estates"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
            </div>
            <div className="leading-none">
              <span className="font-display text-[1.05rem] font-medium text-cream tracking-tight">Impervia</span>
              <span className="font-display text-[1.05rem] font-medium text-bronze tracking-tight"> Estates</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-haze hover:text-cream hover:bg-white/5 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Gold hairline rule below logo */}
        <div
          className="mx-5 flex-shrink-0"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, rgba(184,150,90,0.45), rgba(184,150,90,0.08) 70%, transparent)'
          }}
        />

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-5">
          {/* Role label flanked by decorative rules */}
          <div className="flex items-center gap-2 px-2 mb-5">
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(184,150,90,0.18))' }}
            />
            <span
              className="font-display italic text-[0.625rem] text-bronze/45 tracking-[0.14em] uppercase whitespace-nowrap"
            >
              {roleLabels[userRole] || 'Portal'}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to left, transparent, rgba(184,150,90,0.18))' }}
            />
          </div>

          <ul className="space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-[0.4375rem] text-[0.8125rem] font-medium transition-all duration-200',
                      active ? 'text-cream' : 'text-haze hover:text-cream/85'
                    )}
                    style={active ? {
                      background: 'linear-gradient(90deg, rgba(184,150,90,0.13) 0%, rgba(184,150,90,0.015) 100%)',
                      boxShadow: 'inset 2px 0 0 #B8965A'
                    } : undefined}
                  >
                    {/* Hover layer */}
                    {!active && (
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{ background: 'rgba(255,255,255,0.026)', boxShadow: 'inset 2px 0 0 rgba(184,150,90,0.18)' }}
                      />
                    )}

                    {/* Icon chip */}
                    <span
                      className={cn(
                        'relative flex items-center justify-center h-[1.625rem] w-[1.625rem] rounded-sm flex-shrink-0 transition-all duration-200',
                        active ? 'text-bronze' : 'text-haze/55 group-hover:text-haze/80'
                      )}
                      style={active ? {
                        background: 'rgba(184,150,90,0.12)',
                        boxShadow: '0 0 0 1px rgba(184,150,90,0.18)'
                      } : undefined}
                    >
                      <Icon className="h-[0.875rem] w-[0.875rem]" />
                    </span>

                    <span className="relative">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div
          className="relative flex-shrink-0 p-3"
          style={{
            borderTop: '1px solid rgba(184,150,90,0.08)',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          <Link
            href="/settings"
            className="group flex items-center gap-3 px-3 py-2 transition-all duration-150 hover:bg-white/[0.03] rounded-sm"
          >
            <Avatar
              className="h-7 w-7 flex-shrink-0"
              style={{
                boxShadow: '0 0 0 1px rgba(184,150,90,0.28), 0 0 10px rgba(184,150,90,0.07)'
              }}
            >
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="bg-bronze/20 text-bronze text-[10px] font-medium">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[0.8125rem] font-medium text-haze group-hover:text-cream/85 transition-colors truncate leading-tight">
                {user?.name || 'Settings'}
              </p>
              <p className="text-[0.6rem] text-bronze/40 tracking-[0.1em] uppercase leading-tight mt-0.5">
                {userRole.charAt(0) + userRole.slice(1).toLowerCase()}
              </p>
            </div>
            <Settings className="h-3.5 w-3.5 text-haze/25 group-hover:text-bronze/45 transition-colors flex-shrink-0 flex-shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  )
}
