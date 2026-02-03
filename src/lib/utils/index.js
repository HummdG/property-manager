import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency amount
 */
export function formatCurrency(amount, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

/**
 * Format date to locale string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }
  return new Intl.DateTimeFormat('en-GB', defaultOptions).format(new Date(date))
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending_payment: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }
  return statusColors[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority) {
  const priorityColors = {
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return priorityColors[priority?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str, length = 50) {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

