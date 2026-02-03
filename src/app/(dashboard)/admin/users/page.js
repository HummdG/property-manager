'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Loader2, MoreVertical, UserCheck, UserX, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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

const roleFilters = [
  { value: '', label: 'All Roles' },
  { value: 'OWNER', label: 'Owners' },
  { value: 'TENANT', label: 'Tenants' },
  { value: 'TRADER', label: 'Traders' },
  { value: 'ADMIN', label: 'Admins' }
]

const roleColors = {
  OWNER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  TENANT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  TRADER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20'
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
    try {
      const params = new URLSearchParams()
      if (roleFilter) params.set('role', roleFilter)

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
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

      if (response.ok) {
        fetchUsers()
        setSelectedUser(null)
      }
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
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
        <p className="text-slate-400 mt-1">Manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="text-2xl font-bold text-slate-100">{userCounts.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{userCounts.active}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Inactive</p>
          <p className="text-2xl font-bold text-red-400">{userCounts.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {roleFilters.map(filter => (
            <Button
              key={filter.value}
              variant={roleFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(filter.value)}
              className={roleFilter === filter.value
                ? 'bg-teal-600 hover:bg-teal-700'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Users list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <Users className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-200">No users found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || roleFilter ? 'Try adjusting your filters' : 'No users registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredUsers.map(user => (
            <Card key={user.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-semibold">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200 truncate">{user.name || 'No name'}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                    {!user.isActive && (
                      <Badge variant="outline" className="text-red-400 border-red-500/30">
                        Inactive
                      </Badge>
                    )}
                    <p className="text-sm text-slate-500 hidden sm:block">
                      {formatDate(user.createdAt)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                        <DropdownMenuItem
                          className="text-slate-300 focus:bg-slate-800 cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={user.isActive
                            ? 'text-red-400 focus:bg-red-500/10 cursor-pointer'
                            : 'text-emerald-400 focus:bg-emerald-500/10 cursor-pointer'
                          }
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* User details dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-2xl font-semibold">
                  {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 text-lg">{selectedUser.name || 'No name'}</h3>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge className={roleColors[selectedUser.role]}>
                  {selectedUser.role}
                </Badge>
                <Badge className={selectedUser.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                }>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-sm">
                {selectedUser.phone && (
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Phone:</strong> {selectedUser.phone}
                  </p>
                )}
                <p className="text-slate-400">
                  <strong className="text-slate-300">Joined:</strong> {formatDate(selectedUser.createdAt)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button
                  className={selectedUser.isActive
                    ? 'w-full bg-red-600 hover:bg-red-700'
                    : 'w-full bg-emerald-600 hover:bg-emerald-700'
                  }
                  onClick={() => toggleUserStatus(selectedUser.id, selectedUser.isActive)}
                >
                  {selectedUser.isActive ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

