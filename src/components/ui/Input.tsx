import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, label, id, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 text-slate-400 pointer-events-none">{icon}</div>}
          <input
            id={id}
            ref={ref}
            className={cn(
              'w-full h-11 rounded-xl bg-white border border-slate-300 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 shadow-xs disabled:opacity-50 disabled:bg-slate-50',
              icon && 'pl-11',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-600 pl-1">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
