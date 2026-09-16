import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          'inline-flex items-center justify-center rounded-xl font-semibold',
          'transition-all duration-150 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-[0.97]',

          // Variants
          variant === 'primary' && [
            'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white',
            'shadow-sm shadow-sky-600/20 hover:shadow-md hover:shadow-sky-600/25',
          ],
          variant === 'secondary' && [
            'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700',
            'border border-slate-200 hover:border-slate-300',
            'shadow-xs hover:shadow-sm',
          ],
          variant === 'outline' && [
            'border border-slate-300 hover:border-sky-500',
            'bg-transparent hover:bg-sky-50',
            'text-slate-700 hover:text-sky-700',
          ],
          variant === 'ghost' && [
            'bg-transparent hover:bg-slate-100 active:bg-slate-200',
            'text-slate-600 hover:text-slate-900',
          ],
          variant === 'danger' && [
            'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white',
            'shadow-sm shadow-rose-600/20 hover:shadow-md hover:shadow-rose-600/25',
          ],

          // Sizes
          size === 'sm' && 'h-9 px-3.5 text-xs gap-1.5',
          size === 'md' && 'h-11 px-5 text-sm gap-2',
          size === 'lg' && 'h-13 px-7 text-base gap-2.5',

          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
