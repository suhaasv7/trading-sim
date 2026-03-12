import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Briefcase,
  Clock,
  Eye,
  Search,
  TrendingUp,
  LogOut,
  Info,
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
  { id: 'info', label: 'Info', icon: Info },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, profile, signOut } = useAuth()

  const displayName = profile?.display_name || user?.user_metadata?.full_name || 'User'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="bg-black h-full w-[240px] flex flex-col border-r border-border p-5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-border flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
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
          className="w-full bg-white/[0.04] border border-border rounded-lg py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/[0.2] transition-colors"
          onFocus={() => onNavigate('trade')}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none',
                active
                  ? 'bg-white/[0.08] border border-white/[0.12] text-white'
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
      <div className="bg-white/[0.04] border border-border rounded-lg p-3 flex items-center gap-3 mt-6">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-semibold text-white">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
          <p className="text-[10px] text-text-muted">Paper Account</p>
        </div>
        <button onClick={signOut} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
