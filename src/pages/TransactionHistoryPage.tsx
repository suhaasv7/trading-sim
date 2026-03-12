import { GlassCard } from '@/components/ui/GlassCard'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Clock, Loader2 } from 'lucide-react'

export function TransactionHistoryPage() {
  const { transactions, loading } = usePortfolioContext()

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="text-white animate-spin" /></div>
  }

  return (
    <div className="max-w-[1000px] space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-white" />
          <p className="text-sm font-semibold">Transaction History</p>
          <span className="text-xs text-text-muted ml-auto">{transactions.length} trades</span>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">No trades yet. Start trading to see your history here.</p>
        ) : (
          <>
            <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-text-muted border-b border-border mb-2">
              <span className="col-span-2">Stock</span>
              <span className="text-center">Type</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            <div className="space-y-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-6 gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'BUY' ? 'bg-gain-bg' : 'bg-loss-bg'}`}>
                      {tx.type === 'BUY' ? <TrendingUp size={14} className="text-gain" /> : <TrendingDown size={14} className="text-loss" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.ticker.replace('.BSE', '')}</p>
                      <p className="text-[11px] text-text-muted">{new Date(tx.executed_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${tx.type === 'BUY' ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>{tx.type}</span>
                  </div>
                  <p className="text-sm text-right self-center">{tx.shares}</p>
                  <p className="text-sm text-right self-center">{formatCurrency(tx.price_per_share)}</p>
                  <p className={`text-sm font-semibold text-right self-center ${tx.type === 'BUY' ? 'text-loss' : 'text-gain'}`}>
                    {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  )
}
