import { GlassCard } from '@/components/ui/GlassCard'
import { MOCK_HOLDINGS, MOCK_PORTFOLIO } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react'

export function PortfolioPage() {
  const p = MOCK_PORTFOLIO
  const totalInvested = MOCK_HOLDINGS.reduce((sum, h) => sum + h.shares * h.avgCost, 0)

  return (
    <div className="max-w-[1200px] space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Value', value: formatCurrency(p.totalValue), sub: null },
          { label: 'Total Invested', value: formatCurrency(totalInvested), sub: null },
          {
            label: 'Total Gain/Loss',
            value: `${p.totalGain >= 0 ? '+' : ''}${formatCurrency(p.totalGain)}`,
            sub: formatPercent(p.totalGainPercent),
            color: p.totalGain >= 0 ? 'text-gain' : 'text-loss',
          },
          { label: 'Cash Balance', value: formatCurrency(p.cashBalance), sub: null },
        ].map((card) => (
          <GlassCard key={card.label} className="p-4">
            <p className="text-xs text-text-muted mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color || ''}`}>{card.value}</p>
            {card.sub && (
              <p className={`text-xs font-medium mt-0.5 ${card.color}`}>{card.sub}</p>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Holdings Table */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={16} className="text-accent" />
          <p className="text-sm font-semibold">Your Holdings</p>
          <span className="text-xs text-text-muted ml-auto">{MOCK_HOLDINGS.length} positions</span>
        </div>

        <div className="grid grid-cols-7 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-text-muted border-b border-glass-border mb-2">
          <span className="col-span-2">Stock</span>
          <span className="text-right">Shares</span>
          <span className="text-right">Avg Cost</span>
          <span className="text-right">Current Price</span>
          <span className="text-right">Market Value</span>
          <span className="text-right">Gain/Loss</span>
        </div>

        <div className="space-y-1">
          {MOCK_HOLDINGS.map((h) => {
            const value = h.shares * h.currentPrice
            const cost = h.shares * h.avgCost
            const gain = value - cost
            const gainPercent = ((value - cost) / cost) * 100
            const isUp = gain >= 0

            return (
              <div
                key={h.ticker}
                className="grid grid-cols-7 gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-bg border border-accent/10 flex items-center justify-center text-[10px] font-bold text-accent group-hover:border-accent/25 transition-colors">
                    {h.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{h.ticker}</p>
                    <p className="text-[11px] text-text-muted">{h.name}</p>
                  </div>
                </div>
                <p className="text-sm text-right self-center">{h.shares}</p>
                <p className="text-sm text-right self-center text-text-secondary">{formatCurrency(h.avgCost)}</p>
                <div className="text-right self-center">
                  <p className="text-sm">{formatCurrency(h.currentPrice)}</p>
                  <p className={`text-[11px] flex items-center gap-0.5 justify-end ${h.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {h.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {formatPercent(h.changePercent)}
                  </p>
                </div>
                <p className="text-sm font-medium text-right self-center">{formatCurrency(value)}</p>
                <div className="text-right self-center">
                  <p className={`text-sm font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>
                    {isUp ? '+' : ''}{formatCurrency(gain)}
                  </p>
                  <p className={`text-[11px] ${isUp ? 'text-gain' : 'text-loss'}`}>
                    {formatPercent(gainPercent)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
