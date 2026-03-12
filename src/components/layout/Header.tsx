import { formatCurrency, formatPercent } from '@/lib/utils'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react'

export function Header() {
  const { summary, refreshPrices, apiCallsUsed, refreshing } = usePortfolioContext()
  const isUp = summary.totalGain >= 0
  const callsRemaining = 25 - apiCallsUsed

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-black">
      <div className="flex items-center gap-10">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Total Portfolio Value</p>
          <p className="text-2xl font-bold tracking-tight">{formatCurrency(summary.totalValue)}</p>
        </div>
        <div className="h-10 w-px bg-border" />
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
            <p className="text-xs text-text-muted">Total P&L</p>
            <p className={`text-sm font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>
              {isUp ? '+' : ''}{formatCurrency(summary.totalGain)} ({formatPercent(summary.totalGainPercent)})
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={refreshPrices}
          disabled={refreshing || callsRemaining <= 0}
          className="flex items-center gap-2 bg-white/[0.04] border border-border rounded-lg px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title={`Refresh prices (${callsRemaining}/25 API calls remaining today)`}
        >
          <RefreshCw size={14} className={`text-white ${refreshing ? 'animate-spin' : ''}`} />
          <div className="text-left">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Refresh</p>
            <p className={`text-xs font-medium ${callsRemaining <= 5 ? 'text-loss' : 'text-text-secondary'}`}>
              {callsRemaining}/25 left
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 bg-white/[0.04] border border-border rounded-lg px-4 py-2.5">
          <Wallet size={16} className="text-white" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Cash</p>
            <p className="text-sm font-semibold">{formatCurrency(summary.cashBalance)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
