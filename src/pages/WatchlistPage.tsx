import { GlassCard } from '@/components/ui/GlassCard'
import { MOCK_WATCHLIST, POPULAR_STOCKS } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Eye, ArrowUpRight, ArrowDownRight, Plus, Trash2 } from 'lucide-react'

export function WatchlistPage() {
  return (
    <div className="max-w-[1200px] space-y-4">
      {/* Watchlist */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <Eye size={16} className="text-accent" />
          <p className="text-sm font-semibold">Your Watchlist</p>
          <span className="text-xs text-text-muted ml-auto">{MOCK_WATCHLIST.length} stocks</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_WATCHLIST.map((item) => (
            <GlassCard
              key={item.ticker}
              hover
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-bg border border-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                  {item.ticker.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.ticker}</p>
                  <p className="text-xs text-text-muted">{item.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-base font-bold">{formatCurrency(item.price)}</p>
                  <p className={`text-xs flex items-center gap-0.5 justify-end font-medium ${
                    item.change >= 0 ? 'text-gain' : 'text-loss'
                  }`}>
                    {item.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {formatPercent(item.changePercent)}
                  </p>
                </div>
                <button className="text-text-muted hover:text-loss transition-colors cursor-pointer p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      {/* Discover */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold">Discover Stocks</p>
          <p className="text-xs text-text-muted">Popular tickers</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {POPULAR_STOCKS.filter((s) => !MOCK_WATCHLIST.find((w) => w.ticker === s.ticker)).map((stock) => (
            <GlassCard key={stock.ticker} hover className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center text-[9px] font-bold text-text-secondary">
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <p className="text-sm font-semibold">{stock.ticker}</p>
                </div>
                <button className="text-text-muted hover:text-accent transition-colors cursor-pointer">
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs text-text-muted mb-2 truncate">{stock.name}</p>
              <div className="flex items-end justify-between">
                <p className="text-base font-bold">{formatCurrency(stock.price)}</p>
                <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {formatPercent(stock.changePercent)}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
