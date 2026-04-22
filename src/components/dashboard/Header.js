'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Menu, Bell, LogOut, User, Settings, CheckCheck,
  UserPlus, Building2, Loader2, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'

const notificationIcons = {
  USER_REGISTERED: UserPlus,
  PROPERTY_CREATED: Building2,
  INQUIRY_CREATED: MessageSquare
}

function timeAgo (date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })
}

export function Header ({ user, onMenuClick }) {
  const router = useRouter()
  const isAdmin = user?.role === 'ADMIN'
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const roleLabels = {
    OWNER: 'Property Owner',
    TENANT: 'Tenant',
    AGENT: 'Real Estate Agent',
    ADMIN: 'Administrator'
  }

  const fetchNotifications = useCallback(async () => {
    if (!isAdmin) return
    try {
      const response = await fetch('/api/admin/notifications?limit=10')
      if (!response.ok) return
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchNotifications()
    if (!isAdmin) return
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, isAdmin])

  async function handleMarkAllRead () {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleNotificationClick (notification) {
    if (!notification.isRead) {
      try {
        await fetch('/api/admin/notifications/read', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notification.id })
        })
        setUnreadCount(prev => Math.max(0, prev - 1))
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        )
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wire bg-cream px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-pewter hover:text-sable hover:bg-wire/60 h-8 w-8"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="hidden lg:block">
          <h1 className="font-display text-[1.125rem] font-light text-sable tracking-tight leading-tight">
            Welcome back,{' '}
            <span className="text-bronze font-medium">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </h1>
          <p className="text-[0.7rem] uppercase tracking-[0.12em] text-fog font-medium">
            {roleLabels[user?.role] || 'User'}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        {isAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-pewter hover:text-sable hover:bg-wire/60 h-8 w-8"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-red-500 text-[9px] font-bold text-white ring-2 ring-cream">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 max-h-[420px] overflow-y-auto mt-1 border-wire bg-cream shadow-lg"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="flex items-center justify-between py-3 px-4 border-b border-wire">
                <span className="text-[0.65rem] uppercase tracking-[0.15em] font-medium text-fog">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2 text-[0.7rem] text-bronze hover:text-bronze hover:bg-bronze/10"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleMarkAllRead()
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <CheckCheck className="h-3 w-3 mr-1" />
                    )}
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="h-7 w-7 text-wire mx-auto mb-2" />
                  <p className="text-[0.75rem] text-haze">No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => {
                  const Icon = notificationIcons[notification.type] || Bell
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-4 cursor-pointer border-b border-wire/60 last:border-0 ${
                        !notification.isRead ? 'bg-bronze/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center ${
                        notification.type === 'JOB_REJECTED'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-bronze/10 text-bronze'
                      }`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[0.8125rem] leading-tight ${
                            !notification.isRead ? 'font-medium text-sable' : 'text-pewter'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 bg-bronze" />
                          )}
                        </div>
                        <p className="text-[0.75rem] text-fog mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[0.6875rem] text-haze mt-1">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  )
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="relative text-pewter hover:text-sable hover:bg-wire/60 h-8 w-8"
          >
            <Bell className="h-4 w-4" />
          </Button>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2.5 px-2 hover:bg-wire/60"
            >
              <Avatar className="h-7 w-7 ring-1 ring-bronze/30">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="bg-bronze/20 text-bronze text-[10px] font-medium">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-[0.8125rem] font-medium text-sable leading-tight">{user?.name}</p>
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-bronze">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-52 mt-1 border-wire bg-cream shadow-lg"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="px-4 py-3 border-b border-wire">
              <p className="text-[0.8125rem] font-medium text-sable">{user?.name}</p>
              <p className="text-[0.75rem] text-fog mt-0.5">{user?.email}</p>
            </DropdownMenuLabel>
            <div className="py-1">
              <DropdownMenuItem className="cursor-pointer text-[0.8125rem] text-pewter hover:text-sable hover:bg-wire/50 px-4 py-2">
                <User className="mr-2.5 h-3.5 w-3.5 text-bronze" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-[0.8125rem] text-pewter hover:text-sable hover:bg-wire/50 px-4 py-2">
                <Settings className="mr-2.5 h-3.5 w-3.5 text-bronze" />
                Settings
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-wire" />
            <div className="py-1">
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer px-4 py-2 text-[0.8125rem]"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="mr-2.5 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
