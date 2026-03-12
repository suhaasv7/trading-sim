import { useState, useEffect, useRef } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { useStockSearch } from '@/hooks/useStockSearch'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { getQuote, getHistory, type StockQuote, type HistoricalPoint } from '@/lib/alpha-vantage'
import { POPULAR_STOCKS, generateChartData } from '@/lib/mock-data'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import { Search, Minus, Plus, X, Loader2 } from 'lucide-react'
import { createChart, ColorType, AreaSeries, type IChartApi } from 'lightweight-charts'

interface StockItem {
  ticker: string
  name: string
  price?: number
  change?: number
  changePercent?: number
}

export function TradePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { results: searchResults, loading: searchLoading, search } = useStockSearch()
  const { executeTrade, summary } = usePortfolioContext()
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null)
  const [stockHistory, setStockHistory] = useState<HistoricalPoint[]>([])
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY')
  const [shares, setShares] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [tradeError, setTradeError] = useState('')
  const [executing, setExecuting] = useState(false)

  const handleSearch = (val: string) => {
    setSearchQuery(val)
    search(val)
  }

  const selectStock = async (ticker: string, name: string) => {
    setLoadingQuote(true)
    try {
      const quote = await getQuote(ticker)
      quote.name = name
      setSelectedStock(quote)
      try {
        const hist = await getHistory(ticker)
        setStockHistory(hist)
      } catch {
        setStockHistory([])
      }
    } catch {
      // Use mock fallback
      const mock = POPULAR_STOCKS.find((s) => s.ticker === ticker)
      if (mock) setSelectedStock(mock)
    }
    setLoadingQuote(false)
  }

  const handleTrade = async () => {
    if (!selectedStock) return
    setExecuting(true)
    setTradeError('')
    try {
      await executeTrade(selectedStock.ticker, selectedStock.name, tradeType, shares, selectedStock.price)
      setShowConfirm(false)
      setShares(1)
    } catch (e) {
      setTradeError(e instanceof Error ? e.message : 'Trade failed')
    }
    setExecuting(false)
  }

  // Build display list: search results or popular stocks
  const displayStocks: StockItem[] = searchQuery && searchResults.length > 0
    ? searchResults.map((r) => ({ ticker: r.ticker, name: r.name }))
    : POPULAR_STOCKS.map((s) => ({ ticker: s.ticker, name: s.name, price: s.price, change: s.change, changePercent: s.changePercent }))

  const total = selectedStock ? selectedStock.price * shares : 0

  return (
    <div className="grid grid-cols-12 gap-6 max-w-[1400px]">
      {/* Search & Stock List */}
      <div className="col-span-5 flex flex-col gap-6">
        <GlassCard className="p-5">
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search Indian stocks (e.g. Reliance, TCS)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-border rounded-xl py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/[0.25] transition-colors"
            />
            {searchLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted animate-spin" />}
          </div>
          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
            {displayStocks.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => selectStock(stock.ticker, stock.name)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedStock?.ticker === stock.ticker
                    ? 'bg-white/[0.1] border border-white/[0.12]'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
                    {stock.ticker.replace('.BSE', '').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stock.ticker.replace('.BSE', '').replace('.NSE', '')}</p>
                    <p className="text-[11px] text-text-muted truncate max-w-[180px]">{stock.name}</p>
                  </div>
                </div>
                {stock.price && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(stock.price)}</p>
                    {stock.changePercent !== undefined && (
                      <p className={`text-[11px] ${(stock.change ?? 0) >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {formatPercent(stock.changePercent)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Stock Detail + Trade */}
      <div className="col-span-7 flex flex-col gap-6">
        {loadingQuote ? (
          <GlassCard className="p-12 flex items-center justify-center flex-1">
            <Loader2 size={24} className="text-white animate-spin" />
          </GlassCard>
        ) : selectedStock ? (
          <>
            <StockDetailCard stock={selectedStock} history={stockHistory} />
            <GlassCard className="p-6">
              <p className="text-sm font-semibold mb-4">Place Order</p>
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    tradeType === 'BUY' ? 'bg-gain-bg border border-gain/30 text-gain' : 'bg-white/[0.03] border border-border text-text-muted hover:text-text-secondary'
                  }`}
                >Buy</button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    tradeType === 'SELL' ? 'bg-loss-bg border border-loss/30 text-loss' : 'bg-white/[0.03] border border-border text-text-muted hover:text-text-secondary'
                  }`}
                >Sell</button>
              </div>

              <div className="mb-5">
                <label className="text-xs text-text-muted mb-2 block">Number of Shares</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShares(Math.max(1, shares - 1))} className="w-10 h-10 bg-white/[0.04] border border-border rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"><Minus size={14} /></button>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-white/[0.04] border border-border rounded-xl py-2.5 text-center text-lg font-semibold text-text-primary focus:outline-none focus:border-white/[0.25]"
                  />
                  <button onClick={() => setShares(shares + 1)} className="w-10 h-10 bg-white/[0.04] border border-border rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"><Plus size={14} /></button>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-border rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-text-muted">Price per share</span><span>{formatCurrency(selectedStock.price)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">Quantity</span><span>{shares} shares</span></div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between text-sm font-semibold"><span>Estimated Total</span><span className={tradeType === 'BUY' ? 'text-loss' : 'text-gain'}>{formatCurrency(total)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-text-muted">Cash available</span><span className="text-text-secondary">{formatCurrency(summary.cashBalance)}</span></div>
              </div>

              <GlassButton variant={tradeType === 'BUY' ? 'gain' : 'loss'} size="lg" className="w-full" onClick={() => { setTradeError(''); setShowConfirm(true) }}>
                {tradeType === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.ticker.replace('.BSE', '')}
              </GlassButton>
            </GlassCard>

            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <GlassCard elevated className="w-[420px] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-lg font-semibold">Confirm Order</p>
                    <button onClick={() => setShowConfirm(false)} className="text-text-muted hover:text-text-primary cursor-pointer"><X size={18} /></button>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm"><span className="text-text-muted">Action</span><span className={`font-medium ${tradeType === 'BUY' ? 'text-gain' : 'text-loss'}`}>{tradeType}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-text-muted">Stock</span><span>{selectedStock.ticker.replace('.BSE', '')} - {selectedStock.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-text-muted">Shares</span><span>{shares}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-text-muted">Price</span><span>{formatCurrency(selectedStock.price)}</span></div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCurrency(total)}</span></div>
                  </div>
                  {tradeError && <p className="text-sm text-loss mb-4 text-center">{tradeError}</p>}
                  <div className="flex gap-3">
                    <GlassButton className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</GlassButton>
                    <GlassButton variant={tradeType === 'BUY' ? 'gain' : 'loss'} className="flex-1" onClick={handleTrade} disabled={executing}>
                      {executing ? 'Executing...' : `Confirm ${tradeType}`}
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

function StockDetailCard({ stock, history }: { stock: StockQuote; history: HistoricalPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    const chart = createChart(containerRef.current, {
      height: 200,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#71717a', fontSize: 11 },
      grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.06)', timeVisible: false },
      crosshair: { vertLine: { color: 'rgba(255,255,255,0.3)', width: 1, style: 2 }, horzLine: { color: 'rgba(255,255,255,0.3)', width: 1, style: 2 } },
      handleScale: false,
      handleScroll: false,
    })

    const lineColor = stock.change >= 0 ? '#00D09C' : '#EB5B3C'
    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: stock.change >= 0 ? 'rgba(0,208,156,0.2)' : 'rgba(235,91,60,0.2)',
      bottomColor: 'transparent',
      lineWidth: 2,
    })

    if (history.length > 0) {
      series.setData(history.map((d) => ({ time: d.date, value: d.close })))
    } else {
      const mockData = generateChartData(60, stock.price)
      series.setData(mockData.map((d) => ({ time: d.date, value: d.price })))
    }

    chart.timeScale().fitContent()
    chartRef.current = chart

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => { ro.disconnect(); chart.remove(); chartRef.current = null }
  }, [stock.ticker, stock.change, stock.price, history])

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-lg font-bold">{stock.ticker.replace('.BSE', '')}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${stock.change >= 0 ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>
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
          <div key={stat.label} className="bg-white/[0.04] border border-border rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
            <p className="text-sm font-medium mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
