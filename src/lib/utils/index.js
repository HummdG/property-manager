import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency amount - UAE market uses AED
 */
export function formatCurrency(amount, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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
  return new Intl.DateTimeFormat('en-AE', defaultOptions).format(new Date(date))
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
 * Get status color class - Updated for light theme
 */
export function getStatusColor(status) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    assigned: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending_payment: 'bg-amber-100 text-amber-700 border-amber-200'
  }
  return statusColors[status?.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200'
}

/**
 * Get priority color class - Updated for light theme
 */
export function getPriorityColor(priority) {
  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200'
  }
  return priorityColors[priority?.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200'
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str, length = 50) {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}
