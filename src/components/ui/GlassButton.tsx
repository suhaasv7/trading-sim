import { cn } from '@/lib/utils'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'gain' | 'loss'
  size?: 'sm' | 'md' | 'lg'
}

export function GlassButton({ variant = 'default', size = 'md', className, children, ...props }: GlassButtonProps) {
  return (
    <button
      className={cn(
        'glass rounded-xl font-medium transition-all duration-200 cursor-pointer',
        'hover:scale-[1.02] active:scale-[0.98]',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-base',
        variant === 'default' && 'hover:bg-glass-hover text-text-primary',
        variant === 'accent' && 'bg-accent-bg border-accent/30 text-accent hover:bg-accent/20',
        variant === 'gain' && 'bg-gain-bg border-gain/30 text-gain hover:bg-gain/20',
        variant === 'loss' && 'bg-loss-bg border-loss/30 text-loss hover:bg-loss/20',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
