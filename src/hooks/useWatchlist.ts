import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getQuote } from '@/lib/alpha-vantage'

export interface WatchlistItem {
  id: string
  ticker: string
  company_name: string
  price: number
  change: number
  changePercent: number
}

export function useWatchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWatchlist = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (!data) {
      setLoading(false)
      return
    }

    const enriched: WatchlistItem[] = await Promise.all(
      data.map(async (w) => {
        try {
          const quote = await getQuote(w.ticker)
          return {
            id: w.id,
            ticker: w.ticker,
            company_name: w.company_name,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          }
        } catch {
          return {
            id: w.id,
            ticker: w.ticker,
            company_name: w.company_name,
            price: 0,
            change: 0,
            changePercent: 0,
          }
        }
      })
    )

    setItems(enriched)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  const addToWatchlist = async (ticker: string, companyName: string) => {
    if (!user) return
    const { error } = await supabase
      .from('watchlist')
      .upsert({ user_id: user.id, ticker, company_name: companyName }, { onConflict: 'user_id,ticker' })
    if (!error) await fetchWatchlist()
  }

  const removeFromWatchlist = async (ticker: string) => {
    if (!user) return
    await supabase.from('watchlist').delete().eq('user_id', user.id).eq('ticker', ticker)
    setItems((prev) => prev.filter((i) => i.ticker !== ticker))
  }

  return { items, loading, addToWatchlist, removeFromWatchlist, refetch: fetchWatchlist }
}
