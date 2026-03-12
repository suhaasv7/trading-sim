import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getQuote } from '@/lib/alpha-vantage'

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

export function usePortfolio() {
  const { user, profile, refreshProfile } = useAuth()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHoldings = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data } = await supabase
      .from('holdings')
      .select('*')
      .eq('user_id', user.id)

    if (!data) {
      setLoading(false)
      return
    }

    // Enrich with current prices (from cache when possible)
    const enriched: Holding[] = await Promise.all(
      data.map(async (h) => {
        try {
          const quote = await getQuote(h.ticker)
          return {
            id: h.id,
            ticker: h.ticker,
            company_name: h.company_name,
            shares: parseFloat(h.shares),
            avg_cost_basis: parseFloat(h.avg_cost_basis),
            currentPrice: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          }
        } catch {
          return {
            id: h.id,
            ticker: h.ticker,
            company_name: h.company_name,
            shares: parseFloat(h.shares),
            avg_cost_basis: parseFloat(h.avg_cost_basis),
            currentPrice: parseFloat(h.avg_cost_basis),
            change: 0,
            changePercent: 0,
          }
        }
      })
    )

    setHoldings(enriched)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchHoldings()
  }, [fetchHoldings])

  const executeTrade = async (
    ticker: string,
    companyName: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.rpc('execute_trade', {
      p_user_id: user.id,
      p_ticker: ticker,
      p_company_name: companyName,
      p_type: type,
      p_shares: shares,
      p_price: price,
    })

    if (error) throw new Error(error.message)

    await refreshProfile()
    await fetchHoldings()
  }

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0) + (profile?.cash_balance ?? 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avg_cost_basis, 0)
  const totalGain = totalValue - (profile?.initial_balance ?? 0)
  const totalGainPercent = profile?.initial_balance ? (totalGain / profile.initial_balance) * 100 : 0
  const dayGain = holdings.reduce((sum, h) => sum + h.shares * h.change, 0)
  const dayGainPercent = totalValue > 0 ? (dayGain / (totalValue - dayGain)) * 100 : 0

  return {
    holdings,
    loading,
    executeTrade,
    refetch: fetchHoldings,
    summary: {
      cashBalance: profile?.cash_balance ?? 0,
      initialBalance: profile?.initial_balance ?? 0,
      totalValue,
      totalInvested,
      totalGain,
      totalGainPercent,
      dayGain,
      dayGainPercent,
    },
  }
}
