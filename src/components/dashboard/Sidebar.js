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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

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
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-blue-950 tracking-tight">PropManager</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500 hover:text-blue-950 hover:bg-slate-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
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
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-blue-950'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section with user avatar */}
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-950 transition-all duration-200"
          >
            <Avatar className="h-8 w-8 ring-2 ring-amber-400/20">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
