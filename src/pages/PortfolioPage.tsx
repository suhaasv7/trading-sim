import { GlassCard } from '@/components/ui/GlassCard'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Briefcase, Loader2 } from 'lucide-react'

export function PortfolioPage() {
  const { holdings, loading, summary } = usePortfolioContext()

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="text-white animate-spin" /></div>
  }

  return (
    <div className="max-w-[1200px] space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Portfolio Value', value: formatCurrency(summary.totalValue) },
          { label: 'Total Invested', value: formatCurrency(summary.totalInvested) },
          {
            label: 'Total Gain/Loss',
            value: `${summary.totalGain >= 0 ? '+' : ''}${formatCurrency(summary.totalGain)}`,
            sub: formatPercent(summary.totalGainPercent),
            color: summary.totalGain >= 0 ? 'text-gain' : 'text-loss',
          },
          { label: 'Cash Balance', value: formatCurrency(summary.cashBalance) },
        ].map((card) => (
          <GlassCard key={card.label} className="p-5">
            <p className="text-xs text-text-muted mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color || ''}`}>{card.value}</p>
            {card.sub && <p className={`text-xs font-medium mt-0.5 ${card.color}`}>{card.sub}</p>}
          </GlassCard>
        ))}
      </div>

      {/* Holdings Table */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={16} className="text-white" />
          <p className="text-sm font-semibold">Your Holdings</p>
          <span className="text-xs text-text-muted ml-auto">{holdings.length} positions</span>
        </div>

        {holdings.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">No holdings yet. Go to Trade to buy your first stock!</p>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-text-muted border-b border-border mb-2">
              <span className="col-span-2">Stock</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Avg Cost</span>
              <span className="text-right">Current Price</span>
              <span className="text-right">Market Value</span>
              <span className="text-right">Gain/Loss</span>
            </div>
            <div className="space-y-1">
              {holdings.map((h) => {
                const value = h.shares * h.currentPrice
                const cost = h.shares * h.avg_cost_basis
                const gain = value - cost
                const gainPercent = cost > 0 ? ((value - cost) / cost) * 100 : 0
                const isUp = gain >= 0
                return (
                  <div key={h.ticker} className="grid grid-cols-7 gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary group-hover:border-white/[0.14] transition-colors">
                        {h.ticker.replace('.BSE', '').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{h.ticker.replace('.BSE', '')}</p>
                        <p className="text-[11px] text-text-muted">{h.company_name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-right self-center">{h.shares}</p>
                    <p className="text-sm text-right self-center text-text-secondary">{formatCurrency(h.avg_cost_basis)}</p>
                    <div className="text-right self-center">
                      <p className="text-sm">{formatCurrency(h.currentPrice)}</p>
                      <p className={`text-[11px] flex items-center gap-0.5 justify-end ${h.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {h.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {formatPercent(h.changePercent)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-right self-center">{formatCurrency(value)}</p>
                    <div className="text-right self-center">
                      <p className={`text-sm font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>{isUp ? '+' : ''}{formatCurrency(gain)}</p>
                      <p className={`text-[11px] ${isUp ? 'text-gain' : 'text-loss'}`}>{formatPercent(gainPercent)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  )
}
