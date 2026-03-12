import { GlassCard } from '@/components/ui/GlassCard'
import { PortfolioChart } from '@/components/charts/PortfolioChart'
import { AllocationDonut } from '@/components/charts/AllocationDonut'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react'

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { holdings, summary, transactions, watchlistItems: watchlist } = usePortfolioContext()

  return (
    <div className="grid grid-cols-12 gap-6 max-w-[1400px]">
      {/* Portfolio Performance */}
      <GlassCard className="col-span-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Portfolio Performance</p>
            <p className="text-lg font-semibold">{formatCurrency(summary.totalValue)}</p>
          </div>
          <div className="flex gap-2">
            {['1W', '1M', '3M', '1Y'].map((period, i) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  i === 2
                    ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <PortfolioChart height={220} />
      </GlassCard>

      {/* Stats */}
      <div className="col-span-4 flex flex-col gap-6">
        <GlassCard className="p-6">
          <p className="text-xs text-text-muted mb-3">Total Gain/Loss</p>
          <div className="flex items-end gap-2">
            <p className={`text-2xl font-bold ${summary.totalGain >= 0 ? 'text-gain' : 'text-loss'}`}>
              {summary.totalGain >= 0 ? '+' : ''}{formatCurrency(summary.totalGain)}
            </p>
            <span className={`text-sm font-medium mb-0.5 ${summary.totalGain >= 0 ? 'text-gain' : 'text-loss'}`}>
              {formatPercent(summary.totalGainPercent)}
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-white/30 to-gain"
              style={{ width: `${Math.min(Math.max((summary.totalValue / Math.max(summary.initialBalance, 1)) * 50, 5), 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-text-muted">
            <span>Initial: {formatCurrency(summary.initialBalance)}</span>
            <span>Current: {formatCurrency(summary.totalValue)}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex-1">
          <p className="text-xs text-text-muted mb-3">Allocation</p>
          {holdings.length > 0 ? (
            <AllocationDonut />
          ) : (
            <p className="text-sm text-text-muted text-center py-6">No holdings yet</p>
          )}
        </GlassCard>
      </div>

      {/* Top Holdings */}
      <GlassCard className="col-span-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">Holdings</p>
          <button onClick={() => onNavigate('portfolio')} className="text-xs text-text-secondary hover:text-white transition-colors cursor-pointer">View All</button>
        </div>
        {holdings.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No holdings yet. Start trading!</p>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-6 gap-4 px-3 py-2 text-[10px] uppercase tracking-wider text-text-muted">
              <span className="col-span-2">Stock</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Price</span>
              <span className="text-right">Value</span>
              <span className="text-right">Gain/Loss</span>
            </div>
            {holdings.slice(0, 5).map((h) => {
              const value = h.shares * h.currentPrice
              const cost = h.shares * h.avg_cost_basis
              const gain = value - cost
              const gainPct = cost > 0 ? ((value - cost) / cost) * 100 : 0
              const isUp = gain >= 0
              return (
                <div key={h.ticker} className="grid grid-cols-6 gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
                      {h.ticker.replace('.BSE', '').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{h.ticker.replace('.BSE', '')}</p>
                      <p className="text-[11px] text-text-muted">{h.company_name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-right self-center">{h.shares}</p>
                  <div className="text-right self-center">
                    <p className="text-sm">{formatCurrency(h.currentPrice)}</p>
                    <p className={`text-[11px] ${h.currentPrice - h.avg_cost_basis >= 0 ? 'text-gain' : 'text-loss'}`}>{h.currentPrice - h.avg_cost_basis >= 0 ? '+' : ''}{(h.currentPrice - h.avg_cost_basis).toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-medium text-right self-center">{formatCurrency(value)}</p>
                  <div className="text-right self-center">
                    <p className={`text-sm font-medium ${isUp ? 'text-gain' : 'text-loss'}`}>{isUp ? '+' : ''}{formatCurrency(gain)}</p>
                    <p className={`text-[11px] ${isUp ? 'text-gain' : 'text-loss'}`}>{formatPercent(gainPct)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </GlassCard>

      {/* Watchlist + Recent Trades */}
      <div className="col-span-4 flex flex-col gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-text-muted" />
              <p className="text-sm font-semibold">Watchlist</p>
            </div>
            <button onClick={() => onNavigate('watchlist')} className="text-xs text-text-secondary hover:text-white transition-colors cursor-pointer">View All</button>
          </div>
          {watchlist.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No stocks in watchlist</p>
          ) : (
            <div className="space-y-2">
              {watchlist.slice(0, 4).map((item) => (
                <div key={item.ticker} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{item.ticker.replace('.BSE', '')}</p>
                    <p className="text-[11px] text-text-muted">{item.company_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{item.price > 0 ? formatCurrency(item.price) : '...'}</p>
                    <p className={`text-[11px] flex items-center gap-0.5 justify-end ${item.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                      {item.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {formatPercent(item.changePercent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Recent Trades</p>
            <button onClick={() => onNavigate('history')} className="text-xs text-text-secondary hover:text-white transition-colors cursor-pointer">View All</button>
          </div>
          {transactions.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No trades yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 px-2 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${tx.type === 'BUY' ? 'bg-gain-bg' : 'bg-loss-bg'}`}>
                      {tx.type === 'BUY' ? <TrendingUp size={12} className="text-gain" /> : <TrendingDown size={12} className="text-loss" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.ticker.replace('.BSE', '')}</p>
                      <p className="text-[10px] text-text-muted">{tx.shares} shares</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.type === 'BUY' ? 'text-loss' : 'text-gain'}`}>
                      {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.total_amount)}
                    </p>
                    <p className="text-[10px] text-text-muted">{new Date(tx.executed_at).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
