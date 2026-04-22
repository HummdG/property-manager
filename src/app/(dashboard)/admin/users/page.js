'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Loader2, MoreVertical, UserCheck, UserX, Shield } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const roleFilters = [
  { value: '', label: 'All Roles' },
  { value: 'OWNER', label: 'Owners' },
  { value: 'TENANT', label: 'Tenants' },
  { value: 'AGENT', label: 'Agents' },
  { value: 'ADMIN', label: 'Admins' }
]

const rolePills = {
  OWNER: 'bg-bronze/10 text-bronze border border-bronze/20',
  TENANT: 'bg-sable/5 text-pewter border border-wire',
  AGENT: 'bg-sable/8 text-pewter border border-wire',
  ADMIN: 'bg-red-50 text-red-600 border border-red-100'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  async function fetchUsers() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter) params.set('role', roleFilter)
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      if (!response.ok) { console.error('API Error:', data.error); return }
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleUserStatus(userId, currentStatus) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (response.ok) { fetchUsers(); setSelectedUser(null) }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const userCounts = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Administration</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">User Management</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-px sm:grid-cols-3 bg-wire border border-wire">
        <div className="bg-cream p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">Total Users</p>
          <p className="font-display text-[2.25rem] font-light text-sable leading-none">{userCounts.total}</p>
        </div>
        <div className="bg-cream p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">Active</p>
          <p className="font-display text-[2.25rem] font-light text-sable leading-none">{userCounts.active}</p>
        </div>
        <div className="bg-cream p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">Inactive</p>
          <p className="font-display text-[2.25rem] font-light text-sable leading-none">{userCounts.inactive}</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
          />
        </div>

        {/* Role filters */}
        <div className="flex gap-0 border border-wire overflow-x-auto">
          {roleFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setRoleFilter(filter.value)}
              className={cn(
                'px-3.5 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium transition-colors border-r border-wire last:border-0 whitespace-nowrap',
                roleFilter === filter.value
                  ? 'bg-sable text-cream'
                  : 'bg-cream text-fog hover:text-sable hover:bg-linen'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No users found</p>
          <p className="text-[0.75rem] text-fog mt-1">
            {searchQuery || roleFilter ? 'Try adjusting your filters' : 'No users registered yet'}
          </p>
        </div>
      ) : (
        <div className="border border-wire bg-cream">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-wire bg-linen">
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-fog font-medium">User</p>
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-fog font-medium">Role</p>
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-fog font-medium">Joined</p>
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-fog font-medium w-8" />
          </div>

          <div className="divide-y divide-wire/60">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-linen transition-colors"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-bronze/15 border border-bronze/20 flex items-center justify-center flex-shrink-0 text-[0.75rem] font-medium text-bronze uppercase">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-medium text-sable truncate">
                      {user.name || 'No name'}
                    </p>
                    <p className="text-[0.75rem] text-fog truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role + status */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className={cn(
                    'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5',
                    rolePills[user.role]
                  )}>
                    {user.role}
                  </span>
                  {!user.isActive && (
                    <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-red-50 text-red-500 border border-red-100">
                      Inactive
                    </span>
                  )}
                  <p className="text-[0.7rem] text-haze hidden sm:block w-20 text-right">
                    {formatDate(user.createdAt)}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-7 h-7 flex items-center justify-center text-haze hover:text-sable hover:bg-wire/60 transition-colors">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-wire bg-cream shadow-lg text-[0.8125rem]"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer text-pewter hover:text-sable hover:bg-wire/50 px-4 py-2"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Shield className="mr-2.5 h-3.5 w-3.5 text-bronze" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          'cursor-pointer px-4 py-2',
                          user.isActive
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                        )}
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                      >
                        {user.isActive ? (
                          <><UserX className="mr-2.5 h-3.5 w-3.5" />Deactivate</>
                        ) : (
                          <><UserCheck className="mr-2.5 h-3.5 w-3.5" />Activate</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User details dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md border-wire bg-cream p-0 gap-0">
          <DialogHeader className="px-6 py-5 border-b border-wire">
            <DialogTitle className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="p-6 space-y-5">
              {/* User identity */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bronze/15 border border-bronze/20 flex items-center justify-center flex-shrink-0 text-[1rem] font-medium text-bronze uppercase">
                  {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-[1.25rem] font-light text-sable leading-tight">
                    {selectedUser.name || 'No name'}
                  </h3>
                  <p className="text-[0.75rem] text-fog">{selectedUser.email}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <span className={cn(
                  'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2.5 py-1',
                  rolePills[selectedUser.role]
                )}>
                  {selectedUser.role}
                </span>
                <span className={cn(
                  'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2.5 py-1',
                  selectedUser.isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                )}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Details */}
              <div className="border-t border-wire pt-4 space-y-3">
                {selectedUser.phone && (
                  <div className="flex justify-between">
                    <p className="text-[0.7rem] uppercase tracking-[0.1em] text-fog font-medium">Phone</p>
                    <p className="text-[0.8125rem] text-sable">{selectedUser.phone}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-[0.7rem] uppercase tracking-[0.1em] text-fog font-medium">Joined</p>
                  <p className="text-[0.8125rem] text-sable">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-wire pt-4">
                <button
                  className={cn(
                    'w-full py-2.5 text-[0.75rem] uppercase tracking-[0.1em] font-medium transition-colors',
                    selectedUser.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-sable text-cream hover:bg-cobalt'
                  )}
                  onClick={() => toggleUserStatus(selectedUser.id, selectedUser.isActive)}
                >
                  {selectedUser.isActive ? (
                    <span className="flex items-center justify-center gap-2">
                      <UserX className="h-3.5 w-3.5" /> Deactivate User
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserCheck className="h-3.5 w-3.5" /> Activate User
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
