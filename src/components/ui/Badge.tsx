import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sky' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'slate' | 'gold'
  size?: 'sm' | 'md'
}

export function Badge({ className, variant = 'sky', size = 'sm', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        {
          'text-[10px] px-2.5 py-0.5': size === 'sm',
          'text-xs px-3 py-1': size === 'md',
        },
        {
          'bg-sky-50 text-sky-700 border-sky-200': variant === 'sky',
          'bg-cyan-50 text-cyan-700 border-cyan-200': variant === 'cyan',
          'bg-purple-50 text-purple-700 border-purple-200': variant === 'purple',
          'bg-amber-50 text-amber-800 border-amber-200': variant === 'amber',
          'bg-emerald-50 text-emerald-700 border-emerald-200': variant === 'emerald',
          'bg-rose-50 text-rose-700 border-rose-200': variant === 'rose',
          'bg-slate-100 text-slate-700 border-slate-200': variant === 'slate',
          'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs': variant === 'gold',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
