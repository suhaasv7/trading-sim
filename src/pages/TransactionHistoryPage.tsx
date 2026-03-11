import { GlassCard } from '@/components/ui/GlassCard'
import { MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'

export function TransactionHistoryPage() {
  return (
    <div className="max-w-[1000px] space-y-4">
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-accent" />
          <p className="text-sm font-semibold">Transaction History</p>
          <span className="text-xs text-text-muted ml-auto">{MOCK_TRANSACTIONS.length} trades</span>
        </div>

        <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-text-muted border-b border-glass-border mb-2">
          <span className="col-span-2">Stock</span>
          <span className="text-center">Type</span>
          <span className="text-right">Shares</span>
          <span className="text-right">Price</span>
          <span className="text-right">Total</span>
        </div>

        <div className="space-y-1">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-6 gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type === 'BUY' ? 'bg-gain-bg' : 'bg-loss-bg'
                }`}>
                  {tx.type === 'BUY' ? (
                    <TrendingUp size={14} className="text-gain" />
                  ) : (
                    <TrendingDown size={14} className="text-loss" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.ticker}</p>
                  <p className="text-[11px] text-text-muted">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  tx.type === 'BUY'
                    ? 'bg-gain-bg text-gain'
                    : 'bg-loss-bg text-loss'
                }`}>
                  {tx.type}
                </span>
              </div>
              <p className="text-sm text-right self-center">{tx.shares}</p>
              <p className="text-sm text-right self-center">{formatCurrency(tx.price)}</p>
              <p className={`text-sm font-semibold text-right self-center ${
                tx.type === 'BUY' ? 'text-loss' : 'text-gain'
              }`}>
                {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.total)}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
