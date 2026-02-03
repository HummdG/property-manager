'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Home,
  FileText,
  Wrench,
  Users,
  Settings,
  ClipboardList,
  Briefcase,
  AlertCircle,
  LayoutDashboard,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigationByRole = {
  OWNER: [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard },
    { name: 'Properties', href: '/owner/properties', icon: Building2 },
    { name: 'Service Requests', href: '/owner/requests', icon: ClipboardList },
    { name: 'Payments', href: '/owner/payments', icon: FileText }
  ],
  TENANT: [
    { name: 'Dashboard', href: '/tenant', icon: LayoutDashboard },
    { name: 'My Property', href: '/tenant/property', icon: Home },
    { name: 'Report Issue', href: '/tenant/issues', icon: AlertCircle }
  ],
  TRADER: [
    { name: 'Dashboard', href: '/trader', icon: LayoutDashboard },
    { name: 'My Jobs', href: '/trader/jobs', icon: Briefcase }
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'All Requests', href: '/admin/requests', icon: ClipboardList },
    { name: 'Traders', href: '/admin/traders', icon: Wrench }
  ]
}

export function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname()
  const navigation = navigationByRole[user?.role] || navigationByRole.OWNER

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-100">PropManager</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-slate-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-teal-500/10 text-teal-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive && 'text-teal-400')} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-800 p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  )
}
