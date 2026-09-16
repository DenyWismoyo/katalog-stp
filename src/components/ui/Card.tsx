import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean
}

export function Card({ className, isHoverable = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300',
        isHoverable &&
          'hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
