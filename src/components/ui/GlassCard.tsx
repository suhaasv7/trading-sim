import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  hover?: boolean
  children: React.ReactNode
}

export function GlassCard({ elevated, hover, children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-colors duration-200',
        elevated ? 'card-elevated' : 'card',
        hover && 'hover:border-border-hover hover:bg-white/[0.03] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
