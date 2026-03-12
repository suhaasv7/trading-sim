import { GlassCard } from '@/components/ui/GlassCard'
import { Calculator, TrendingUp, ArrowLeftRight, Database, Rocket } from 'lucide-react'

export function InfoPage() {
  return (
    <div className="max-w-[900px] space-y-6">
      {/* Portfolio Value */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center">
            <Calculator size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold">How Portfolio Value Works</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Your portfolio value is the total worth of all your holdings plus your remaining cash balance.
        </p>
        <div className="bg-white/[0.04] border border-border rounded-lg p-4 mb-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Formula</p>
          <p className="text-sm font-mono text-text-primary">
            Portfolio Value = Sum(shares x current price) + cash balance
          </p>
        </div>
        <div className="bg-white/[0.04] border border-border rounded-lg p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Example</p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>You own 10 shares of RELIANCE at current price of Rs 2,500</p>
            <p>You own 5 shares of TCS at current price of Rs 3,400</p>
            <p>Cash remaining: Rs 9,50,000</p>
            <div className="h-px bg-border my-2" />
            <p className="text-text-primary font-medium">
              Portfolio Value = (10 x 2,500) + (5 x 3,400) + 9,50,000 = Rs 9,92,000
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Gain/Loss */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold">How Gain/Loss is Calculated</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Gain or loss is calculated by comparing the current market value of your holdings against what you originally paid for them.
        </p>
        <div className="bg-white/[0.04] border border-border rounded-lg p-4 mb-4 space-y-3">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Gain/Loss</p>
            <p className="text-sm font-mono text-text-primary">Total Gain = (current value of all holdings) - (total amount invested)</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Per-Stock Gain/Loss</p>
            <p className="text-sm font-mono text-text-primary">Stock Gain = (shares x current price) - (shares x avg cost basis)</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Gain Percentage</p>
            <p className="text-sm font-mono text-text-primary">Gain % = ((current value - cost) / cost) x 100</p>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-border rounded-lg p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Example</p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>You bought 10 shares of RELIANCE at Rs 2,400 each (cost = Rs 24,000)</p>
            <p>Current price is Rs 2,500</p>
            <p>Current value = 10 x 2,500 = Rs 25,000</p>
            <div className="h-px bg-border my-2" />
            <p className="text-text-primary font-medium">Gain = 25,000 - 24,000 = <span className="text-gain">+Rs 1,000</span></p>
            <p className="text-text-primary font-medium">Gain % = (1,000 / 24,000) x 100 = <span className="text-gain">+4.17%</span></p>
          </div>
        </div>
      </GlassCard>

      {/* How Trades Work */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center">
            <ArrowLeftRight size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold">How Trades Work</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Each trade is executed atomically — your cash balance, holdings, and transaction log are all updated together in a single database operation.
        </p>
        <div className="space-y-3 mb-4">
          <div className="bg-white/[0.04] border border-border rounded-lg p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">When you BUY</p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li>1. Cash balance is reduced by (shares x price)</li>
              <li>2. Shares are added to your holdings</li>
              <li>3. Average cost basis is recalculated using weighted average</li>
              <li>4. Transaction is logged</li>
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-border rounded-lg p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">When you SELL</p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li>1. Cash balance is increased by (shares x price)</li>
              <li>2. Shares are deducted from your holdings</li>
              <li>3. If all shares sold, the holding is removed</li>
              <li>4. Transaction is logged</li>
            </ul>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-border rounded-lg p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Weighted Average Cost Basis</p>
          <p className="text-sm font-mono text-text-primary mb-3">
            New Avg Cost = (old shares x old avg cost + new shares x new price) / total shares
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>Buy 10 RELIANCE at Rs 2,400 → Avg cost = Rs 2,400</p>
            <p>Buy 5 more RELIANCE at Rs 2,600 → Avg cost = (10x2400 + 5x2600) / 15 = Rs 2,467</p>
          </div>
        </div>
      </GlassCard>

      {/* Market Data */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center">
            <Database size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold">Market Data & API</h2>
        </div>
        <div className="space-y-3 text-sm text-text-secondary">
          <p>Stock prices are fetched from <span className="text-text-primary font-medium">Alpha Vantage API</span> using BSE (Bombay Stock Exchange) tickers.</p>
          <div className="bg-white/[0.04] border border-border rounded-lg p-4 space-y-2">
            <div className="flex justify-between"><span className="text-text-muted">API Limit</span><span className="text-text-primary">25 calls per day</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Memory Cache</span><span className="text-text-primary">5 minutes</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Local Storage Cache</span><span className="text-text-primary">15 minutes</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Ticker Format</span><span className="text-text-primary font-mono">SYMBOL.BSE</span></div>
          </div>
          <p>Prices are cached in 3 layers (memory → localStorage → API) to minimize API usage. Use the Refresh button in the header to force-fetch fresh prices (clears cache).</p>
        </div>
      </GlassCard>

      {/* Getting Started */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center">
            <Rocket size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold">Getting Started Example</h2>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-sm font-medium text-text-primary">Start with Rs 10,00,000</p>
              <p className="text-sm text-text-secondary">You begin with Rs 10,00,000 in virtual cash. This is your starting capital.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-sm font-medium text-text-primary">Buy a stock</p>
              <p className="text-sm text-text-secondary">Go to Trade → Search "Reliance" → Buy 10 shares at Rs 2,500 each. This costs Rs 25,000. Your cash becomes Rs 9,75,000.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-sm font-medium text-text-primary">Price changes</p>
              <p className="text-sm text-text-secondary">Next day, Reliance price rises to Rs 2,550. Your 10 shares are now worth Rs 25,500. You have a gain of Rs 500 (+2%).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">4</div>
            <div>
              <p className="text-sm font-medium text-text-primary">Check your dashboard</p>
              <p className="text-sm text-text-secondary">Portfolio value = Rs 25,500 (holdings) + Rs 9,75,000 (cash) = Rs 10,00,500. Total gain: +Rs 500.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-border flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">5</div>
            <div>
              <p className="text-sm font-medium text-text-primary">Sell to book profit</p>
              <p className="text-sm text-text-secondary">Go to Trade → Sell 10 shares of Reliance at Rs 2,550. You get Rs 25,500 back. Cash becomes Rs 10,00,500. Profit booked!</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
