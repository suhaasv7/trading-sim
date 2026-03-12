import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getQuote, getApiCallsUsed, clearQuoteCache } from '@/lib/alpha-vantage'

export interface Holding {
  id: string
  ticker: string
  company_name: string
  shares: number
  avg_cost_basis: number
  currentPrice: number
  change: number
  changePercent: number
}

export interface Transaction {
  id: string
  ticker: string
  company_name: string
  type: 'BUY' | 'SELL'
  shares: number
  price_per_share: number
  total_amount: number
  executed_at: string
}

export interface WatchlistItem {
  id: string
  ticker: string
  company_name: string
  price: number
  change: number
  changePercent: number
}

interface PortfolioSummary {
  cashBalance: number
  initialBalance: number
  totalValue: number
  totalInvested: number
  totalGain: number
  totalGainPercent: number
  dayGain: number
  dayGainPercent: number
}

interface PortfolioState {
  holdings: Holding[]
  transactions: Transaction[]
  watchlistItems: WatchlistItem[]
  loading: boolean
  summary: PortfolioSummary
  executeTrade: (ticker: string, companyName: string, type: 'BUY' | 'SELL', shares: number, price: number) => Promise<void>
  addToWatchlist: (ticker: string, companyName: string) => Promise<void>
  removeFromWatchlist: (ticker: string) => Promise<void>
  refetch: () => Promise<void>
  refreshPrices: () => Promise<void>
  apiCallsUsed: number
  refreshing: boolean
}

const PortfolioContext = createContext<PortfolioState | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile } = useAuth()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [apiCallsUsed, setApiCallsUsed] = useState(getApiCallsUsed())
  const [hasFetched, setHasFetched] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    if (hasFetched) return // prevent duplicate fetches
    setLoading(true)
    setHasFetched(true)

    // Fetch holdings, transactions, and watchlist in parallel
    const [holdingsRes, txRes, watchRes] = await Promise.all([
      supabase.from('holdings').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('executed_at', { ascending: false }),
      supabase.from('watchlist').select('*').eq('user_id', user.id).order('added_at', { ascending: false }),
    ])

    // Process transactions (no API calls needed)
    if (txRes.data) {
      setTransactions(
        txRes.data.map((t) => ({
          id: t.id,
          ticker: t.ticker,
          company_name: t.company_name,
          type: t.type as 'BUY' | 'SELL',
          shares: parseFloat(t.shares),
          price_per_share: parseFloat(t.price_per_share),
          total_amount: parseFloat(t.total_amount),
          executed_at: t.executed_at,
        }))
      )
    }

    // Enrich holdings with current prices
    if (holdingsRes.data) {
      const enriched = await Promise.all(
        holdingsRes.data.map(async (h) => {
          try {
            const quote = await getQuote(h.ticker)
            return {
              id: h.id, ticker: h.ticker, company_name: h.company_name,
              shares: parseFloat(h.shares), avg_cost_basis: parseFloat(h.avg_cost_basis),
              currentPrice: quote.price, change: quote.change, changePercent: quote.changePercent,
            }
          } catch {
            return {
              id: h.id, ticker: h.ticker, company_name: h.company_name,
              shares: parseFloat(h.shares), avg_cost_basis: parseFloat(h.avg_cost_basis),
              currentPrice: parseFloat(h.avg_cost_basis), change: 0, changePercent: 0,
            }
          }
        })
      )
      setHoldings(enriched)
    }

    // Enrich watchlist with current prices
    if (watchRes.data) {
      const enriched = await Promise.all(
        watchRes.data.map(async (w) => {
          try {
            const quote = await getQuote(w.ticker)
            return {
              id: w.id, ticker: w.ticker, company_name: w.company_name,
              price: quote.price, change: quote.change, changePercent: quote.changePercent,
            }
          } catch {
            return {
              id: w.id, ticker: w.ticker, company_name: w.company_name,
              price: 0, change: 0, changePercent: 0,
            }
          }
        })
      )
      setWatchlistItems(enriched)
    }

    setApiCallsUsed(getApiCallsUsed())
    setLoading(false)
    setRefreshing(false)
  }, [user, hasFetched])

  // Reset when user changes
  useEffect(() => {
    setHasFetched(false)
    setHoldings([])
    setTransactions([])
    setWatchlistItems([])
  }, [user?.id])

  useEffect(() => {
    if (user && !hasFetched) {
      fetchAll()
    }
  }, [user, hasFetched, fetchAll])

  const refetch = useCallback(async () => {
    setHasFetched(false)
  }, [])

  const refreshPrices = useCallback(async () => {
    setRefreshing(true)
    clearQuoteCache()
    setHasFetched(false)
  }, [])

  const executeTrade = async (
    ticker: string, companyName: string, type: 'BUY' | 'SELL', shares: number, price: number
  ) => {
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase.rpc('execute_trade', {
      p_user_id: user.id, p_ticker: ticker, p_company_name: companyName,
      p_type: type, p_shares: shares, p_price: price,
    })
    if (error) throw new Error(error.message)
    await refreshProfile()
    setHasFetched(false) // trigger refetch
  }

  const addToWatchlist = async (ticker: string, companyName: string) => {
    if (!user) return
    const { error } = await supabase
      .from('watchlist')
      .upsert({ user_id: user.id, ticker, company_name: companyName }, { onConflict: 'user_id,ticker' })
    if (!error) setHasFetched(false)
  }

  const removeFromWatchlist = async (ticker: string) => {
    if (!user) return
    await supabase.from('watchlist').delete().eq('user_id', user.id).eq('ticker', ticker)
    setWatchlistItems((prev) => prev.filter((i) => i.ticker !== ticker))
  }

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0) + (profile?.cash_balance ?? 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avg_cost_basis, 0)
  const totalGain = totalValue - (profile?.initial_balance ?? 0)
  const totalGainPercent = profile?.initial_balance ? (totalGain / profile.initial_balance) * 100 : 0
  const dayGain = holdings.reduce((sum, h) => sum + h.shares * h.change, 0)
  const dayGainPercent = totalValue > 0 ? (dayGain / (totalValue - dayGain)) * 100 : 0

  const summary: PortfolioSummary = {
    cashBalance: profile?.cash_balance ?? 0,
    initialBalance: profile?.initial_balance ?? 0,
    totalValue, totalInvested, totalGain, totalGainPercent, dayGain, dayGainPercent,
  }

  return (
    <PortfolioContext.Provider value={{
      holdings, transactions, watchlistItems, loading, summary,
      executeTrade, addToWatchlist, removeFromWatchlist, refetch,
      refreshPrices, apiCallsUsed, refreshing,
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolioContext(): PortfolioState {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolioContext must be used within PortfolioProvider')
  return ctx
}
