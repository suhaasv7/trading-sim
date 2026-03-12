import { cn } from '@/lib/utils'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'gain' | 'loss'
  size?: 'sm' | 'md' | 'lg'
}

export function GlassButton({ variant = 'default', size = 'md', className, children, ...props }: GlassButtonProps) {
  return (
    <button
      className={cn(
        'card rounded-lg font-medium transition-colors duration-200 cursor-pointer',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-base',
        variant === 'default' && 'hover:bg-white/[0.06] text-text-primary',
        variant === 'accent' && 'bg-white/[0.1] border-white/[0.15] text-white hover:bg-white/[0.15]',
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
