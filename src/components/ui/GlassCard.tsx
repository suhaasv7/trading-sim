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
        'rounded-2xl transition-all duration-300',
        elevated ? 'glass-elevated' : 'glass',
        hover && 'hover:bg-glass-hover hover:border-glass-highlight hover:scale-[1.01] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
