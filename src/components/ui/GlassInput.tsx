import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
            'placeholder:text-text-muted',
            'focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.04]',
            'transition-colors duration-200',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'
