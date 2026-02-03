import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gradient-to-r from-amber-400 to-amber-500 text-white',
        secondary: 'border-transparent bg-blue-900 text-white',
        destructive: 'border-transparent bg-red-100 text-red-700 border-red-200',
        outline: 'border-slate-300 text-slate-700 bg-white',
        success: 'border-transparent bg-emerald-100 text-emerald-700 border-emerald-200',
        warning: 'border-transparent bg-amber-100 text-amber-700 border-amber-200',
        info: 'border-transparent bg-blue-100 text-blue-700 border-blue-200',
        gold: 'border-transparent bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200',
        navy: 'border-transparent bg-blue-950 text-white'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
