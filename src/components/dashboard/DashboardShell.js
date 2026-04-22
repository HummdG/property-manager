'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from './Sidebar'

const Header = dynamic(() => import('./Header').then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wire bg-cream px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-wire/50 animate-pulse lg:hidden" />
        <div className="hidden lg:block space-y-1.5">
          <div className="h-4 w-40 bg-wire/50 animate-pulse" />
          <div className="h-3 w-24 bg-wire/50 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-wire/50 animate-pulse" />
        <div className="h-9 w-9 bg-wire/50 animate-pulse" />
      </div>
    </header>
  )
})

export function DashboardShell({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-linen">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
