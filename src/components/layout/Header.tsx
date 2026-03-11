import { formatCurrency, formatPercent } from '@/lib/utils'
import { MOCK_PORTFOLIO } from '@/lib/mock-data'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export function Header() {
  const p = MOCK_PORTFOLIO
  const isUp = p.dayGain >= 0

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-glass-border bg-white/[0.02]">
      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Total Portfolio Value</p>
          <p className="text-2xl font-bold tracking-tight">{formatCurrency(p.totalValue)}</p>
        </div>
        <div className="h-10 w-px bg-glass-border" />
        <div className="flex items-center gap-2">
          {isUp ? (
            <div className="w-7 h-7 rounded-lg bg-gain-bg flex items-center justify-center">
              <TrendingUp size={14} className="text-gain" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-loss-bg flex items-center justify-center">
              <TrendingDown size={14} className="text-loss" />
            </div>
          )}
          <div>
            <p className="text-xs text-text-muted">Today</p>
            <p className={`text-sm font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>
              {isUp ? '+' : ''}{formatCurrency(p.dayGain)} ({formatPercent(p.dayGainPercent)})
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5">
        <Wallet size={16} className="text-accent" />
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Cash</p>
          <p className="text-sm font-semibold">{formatCurrency(p.cashBalance)}</p>
        </div>
      </div>
    </header>
  )
}
