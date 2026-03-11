import { useState, useEffect, useRef } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { POPULAR_STOCKS, MOCK_PORTFOLIO, generateChartData, type StockQuote } from '@/lib/mock-data'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import { Search, ArrowUpRight, ArrowDownRight, Minus, Plus, X } from 'lucide-react'
import { createChart, ColorType, AreaSeries, type IChartApi } from 'lightweight-charts'

export function TradePage() {
  const [search, setSearch] = useState('')
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null)
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY')
  const [shares, setShares] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  const filtered = search
    ? POPULAR_STOCKS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase())
      )
    : POPULAR_STOCKS

  const total = selectedStock ? selectedStock.price * shares : 0

  return (
    <div className="grid grid-cols-12 gap-4 max-w-[1400px]">
      {/* Search & Stock List */}
      <div className="col-span-5 flex flex-col gap-4">
        <GlassCard className="p-4">
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by ticker or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-glass-border rounded-xl py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>
          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filtered.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => setSelectedStock(stock)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedStock?.ticker === stock.ticker
                    ? 'bg-accent-bg border border-accent/20'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-glass-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stock.ticker}</p>
                    <p className="text-[11px] text-text-muted">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(stock.price)}</p>
                  <p className={`text-[11px] flex items-center gap-0.5 justify-end ${stock.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {stock.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {formatPercent(stock.changePercent)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Stock Detail + Trade */}
      <div className="col-span-7 flex flex-col gap-4">
        {selectedStock ? (
          <>
            <StockDetailCard stock={selectedStock} />
            <GlassCard className="p-5">
              <p className="text-sm font-semibold mb-4">Place Order</p>
              {/* Buy/Sell Toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    tradeType === 'BUY'
                      ? 'bg-gain-bg border border-gain/30 text-gain'
                      : 'bg-white/[0.03] border border-glass-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    tradeType === 'SELL'
                      ? 'bg-loss-bg border border-loss/30 text-loss'
                      : 'bg-white/[0.03] border border-glass-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Shares Input */}
              <div className="mb-5">
                <label className="text-xs text-text-muted mb-2 block">Number of Shares</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShares(Math.max(1, shares - 1))}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-glass-hover transition-colors cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-white/[0.04] border border-glass-border rounded-xl py-2.5 text-center text-lg font-semibold text-text-primary focus:outline-none focus:border-accent/30"
                  />
                  <button
                    onClick={() => setShares(shares + 1)}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-glass-hover transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Price per share</span>
                  <span>{formatCurrency(selectedStock.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Quantity</span>
                  <span>{shares} shares</span>
                </div>
                <div className="h-px bg-glass-border my-1" />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Estimated Total</span>
                  <span className={tradeType === 'BUY' ? 'text-loss' : 'text-gain'}>
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Cash available</span>
                  <span className="text-text-secondary">{formatCurrency(MOCK_PORTFOLIO.cashBalance)}</span>
                </div>
              </div>

              <GlassButton
                variant={tradeType === 'BUY' ? 'gain' : 'loss'}
                size="lg"
                className="w-full"
                onClick={() => setShowConfirm(true)}
              >
                {tradeType === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.ticker}
              </GlassButton>
            </GlassCard>

            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <GlassCard elevated className="w-[420px] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-lg font-semibold">Confirm Order</p>
                    <button onClick={() => setShowConfirm(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Action</span>
                      <span className={`font-medium ${tradeType === 'BUY' ? 'text-gain' : 'text-loss'}`}>
                        {tradeType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Stock</span>
                      <span>{selectedStock.ticker} - {selectedStock.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Shares</span>
                      <span>{shares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Price</span>
                      <span>{formatCurrency(selectedStock.price)}</span>
                    </div>
                    <div className="h-px bg-glass-border" />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GlassButton className="flex-1" onClick={() => setShowConfirm(false)}>
                      Cancel
                    </GlassButton>
                    <GlassButton
                      variant={tradeType === 'BUY' ? 'gain' : 'loss'}
                      className="flex-1"
                      onClick={() => {
                        setShowConfirm(false)
                        alert(`${tradeType} order confirmed! (Demo mode)`)
                      }}
                    >
                      Confirm {tradeType}
                    </GlassButton>
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        ) : (
          <GlassCard className="p-12 flex flex-col items-center justify-center text-center flex-1">
            <Search size={40} className="text-text-muted mb-4 opacity-40" />
            <p className="text-lg font-semibold text-text-secondary mb-1">Select a stock to trade</p>
            <p className="text-sm text-text-muted">Search or pick from the list on the left</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

function StockDetailCard({ stock }: { stock: StockQuote }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (chartRef.current) {
      chartRef.current.remove()
    }

    const chart = createChart(containerRef.current, {
      height: 200,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#71717a',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.06)', timeVisible: false },
      crosshair: {
        vertLine: { color: 'rgba(129,140,248,0.3)', width: 1, style: 2 },
        horzLine: { color: 'rgba(129,140,248,0.3)', width: 1, style: 2 },
      },
      handleScale: false,
      handleScroll: false,
    })

    const data = generateChartData(60)
    const lineColor = stock.change >= 0 ? '#34d399' : '#f87171'
    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: stock.change >= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)',
      bottomColor: 'transparent',
      lineWidth: 2,
    })

    series.setData(data.map((d) => ({ time: d.date, value: d.price })))
    chart.timeScale().fitContent()
    chartRef.current = chart

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [stock.ticker, stock.change])

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-lg font-bold">{stock.ticker}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              stock.change >= 0 ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'
            }`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
            </span>
          </div>
          <p className="text-sm text-text-muted">{stock.name}</p>
        </div>
        <p className="text-2xl font-bold">{formatCurrency(stock.price)}</p>
      </div>
      <div ref={containerRef} className="w-full mb-4" />
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Open', value: formatCurrency(stock.open) },
          { label: 'High', value: formatCurrency(stock.high) },
          { label: 'Low', value: formatCurrency(stock.low) },
          { label: 'Volume', value: formatNumber(stock.volume) },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
            <p className="text-sm font-medium mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
