import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Briefcase,
  Clock,
  Eye,
  Search,
  TrendingUp,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trade', label: 'Trade', icon: ArrowLeftRight },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'watchlist', label: 'Watchlist', icon: Eye },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="glass h-full w-[240px] flex flex-col border-r border-glass-border p-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-accent-bg border border-accent/30 flex items-center justify-center">
          <TrendingUp size={18} className="text-accent" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-text-primary tracking-tight">TradeSim</h1>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">Paper Trading</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full bg-white/[0.04] border border-glass-border rounded-xl py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
          onFocus={() => onNavigate('trade')}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                active
                  ? 'bg-accent-bg border border-accent/20 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent'
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="glass rounded-xl p-3 flex items-center gap-3 mt-4">
        <div className="w-8 h-8 rounded-full bg-accent-bg border border-accent/20 flex items-center justify-center text-xs font-semibold text-accent">
          SV
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">Suhaas V</p>
          <p className="text-[10px] text-text-muted">Paper Account</p>
        </div>
        <button className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
