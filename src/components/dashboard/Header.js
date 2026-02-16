'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Menu, Bell, LogOut, User, Settings, CheckCheck,
  XCircle, Briefcase, ClipboardList, UserPlus, Building2, Loader2
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
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

const notificationIcons = {
  JOB_REJECTED: XCircle,
  JOB_ASSIGNED: Briefcase,
  SERVICE_REQUEST_CREATED: ClipboardList,
  USER_REGISTERED: UserPlus,
  PROPERTY_CREATED: Building2
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
    TRADER: 'Trader',
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
    // Mark as read
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

    // Navigate if there's a link
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-600 hover:text-amber-600 hover:bg-amber-50"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-blue-950">
            Welcome back, <span className="text-amber-600">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-sm text-slate-500">
            {roleLabels[user?.role] || 'User'}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        {isAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 max-h-[420px] overflow-y-auto mt-1"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span className="font-semibold text-blue-950">Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
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
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => {
                  const Icon = notificationIcons[notification.type] || Bell
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer ${
                        !notification.isRead ? 'bg-amber-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                        notification.type === 'JOB_REJECTED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-tight ${
                            !notification.isRead ? 'font-semibold text-blue-950' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
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
            className="relative text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
          >
            <Bell className="h-5 w-5" />
          </Button>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 gap-2 px-2 hover:bg-amber-50 rounded-lg"
            >
              <Avatar className="h-8 w-8 ring-2 ring-amber-400/30">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-blue-950">{user?.name}</p>
                <Badge variant="gold" className="text-[10px] px-1.5 py-0 h-4">
                  {user?.role}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 mt-1"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-blue-950">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-amber-600" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-amber-600" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
