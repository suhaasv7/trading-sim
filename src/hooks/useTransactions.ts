import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('executed_at', { ascending: false })

    if (data) {
      setTransactions(
        data.map((t) => ({
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
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, loading, refetch: fetchTransactions }
}
