import { useState, useCallback, useRef } from 'react'
import { searchStocks, type SearchResult } from '@/lib/alpha-vantage'

export function useStockSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = useCallback((query: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchStocks(query)
        setResults(data)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 400)
  }, [])

  return { results, loading, search }
}
