const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo'
const BASE_URL = 'https://www.alphavantage.co/query'

export interface StockQuote {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  prevClose: number
}

export interface SearchResult {
  ticker: string
  name: string
  type: string
  region: string
  currency: string
}

export interface HistoricalPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// --- 3-layer cache ---

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const memoryCache = new Map<string, CacheEntry<unknown>>()

const QUOTE_TTL = 5 * 60 * 1000       // 5 min in-memory
const STORAGE_TTL = 15 * 60 * 1000    // 15 min localStorage
const HISTORY_TTL = 24 * 60 * 60 * 1000 // 24h

function getFromMemory<T>(key: string, ttl: number): T | null {
  const entry = memoryCache.get(key)
  if (entry && Date.now() - entry.timestamp < ttl) return entry.data as T
  return null
}

function setMemory<T>(key: string, data: T) {
  memoryCache.set(key, { data, timestamp: Date.now() })
}

function getFromStorage<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(`av_${key}`)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp < ttl) {
      setMemory(key, entry.data)
      return entry.data
    }
  } catch { /* ignore */ }
  return null
}

function setStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`av_${key}`, JSON.stringify({ data, timestamp: Date.now() }))
  } catch { /* quota exceeded, ignore */ }
}

function getDailyCallCount(): number {
  try {
    const raw = localStorage.getItem('av_daily_calls')
    if (!raw) return 0
    const entry = JSON.parse(raw)
    const today = new Date().toDateString()
    if (entry.date !== today) return 0
    return entry.count
  } catch { return 0 }
}

function incrementCallCount() {
  const today = new Date().toDateString()
  const count = getDailyCallCount() + 1
  localStorage.setItem('av_daily_calls', JSON.stringify({ date: today, count }))
}

export function getApiCallsUsed(): number {
  return getDailyCallCount()
}

export function clearQuoteCache() {
  // Clear only quote entries from memory and localStorage so next getQuote() hits the API
  for (const key of memoryCache.keys()) {
    if (key.startsWith('quote_')) memoryCache.delete(key)
  }
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i)
    if (k?.startsWith('av_quote_')) localStorage.removeItem(k)
  }
}

// --- API functions ---

async function fetchAV(params: Record<string, string>): Promise<Record<string, unknown>> {
  const callCount = getDailyCallCount()
  if (callCount >= 25) {
    throw new Error('Daily API limit reached (25 calls). Using cached data.')
  }

  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)

  incrementCallCount()
  const data = await res.json()

  if (data['Error Message']) throw new Error(data['Error Message'])
  if (data['Note']) throw new Error('API rate limit hit. Please wait.')

  return data
}

export async function getQuote(ticker: string): Promise<StockQuote> {
  const cacheKey = `quote_${ticker}`

  // Layer 1: memory
  const mem = getFromMemory<StockQuote>(cacheKey, QUOTE_TTL)
  if (mem) return mem

  // Layer 2: localStorage
  const stored = getFromStorage<StockQuote>(cacheKey, STORAGE_TTL)
  if (stored) return stored

  // Layer 3: API
  const data = await fetchAV({ function: 'GLOBAL_QUOTE', symbol: ticker })
  const gq = data['Global Quote'] as Record<string, string> | undefined

  if (!gq || !gq['05. price']) {
    throw new Error(`No quote data for ${ticker}`)
  }

  const quote: StockQuote = {
    ticker: gq['01. symbol'] || ticker,
    name: ticker.replace('.BSE', '').replace('.NSE', ''),
    price: parseFloat(gq['05. price']),
    change: parseFloat(gq['09. change']),
    changePercent: parseFloat(gq['10. change percent']?.replace('%', '') || '0'),
    volume: parseInt(gq['06. volume'] || '0'),
    high: parseFloat(gq['03. high']),
    low: parseFloat(gq['04. low']),
    open: parseFloat(gq['02. open']),
    prevClose: parseFloat(gq['08. previous close']),
  }

  setMemory(cacheKey, quote)
  setStorage(cacheKey, quote)
  return quote
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  const cacheKey = `search_${query.toLowerCase()}`

  const mem = getFromMemory<SearchResult[]>(cacheKey, STORAGE_TTL)
  if (mem) return mem

  const stored = getFromStorage<SearchResult[]>(cacheKey, STORAGE_TTL)
  if (stored) return stored

  const data = await fetchAV({ function: 'SYMBOL_SEARCH', keywords: query })
  const matches = (data['bestMatches'] || []) as Record<string, string>[]

  const results: SearchResult[] = matches
    .filter((m) => {
      const region = m['4. region'] || ''
      return region.includes('India') || m['1. symbol']?.includes('.BSE') || m['1. symbol']?.includes('.NSE')
    })
    .map((m) => ({
      ticker: m['1. symbol'],
      name: m['2. name'],
      type: m['3. type'],
      region: m['4. region'],
      currency: m['8. currency'] || 'INR',
    }))

  setMemory(cacheKey, results)
  setStorage(cacheKey, results)
  return results
}

export async function getHistory(ticker: string): Promise<HistoricalPoint[]> {
  const cacheKey = `history_${ticker}`

  const mem = getFromMemory<HistoricalPoint[]>(cacheKey, HISTORY_TTL)
  if (mem) return mem

  const stored = getFromStorage<HistoricalPoint[]>(cacheKey, HISTORY_TTL)
  if (stored) return stored

  const data = await fetchAV({
    function: 'TIME_SERIES_DAILY',
    symbol: ticker,
    outputsize: 'compact',
  })

  const timeSeries = data['Time Series (Daily)'] as Record<string, Record<string, string>> | undefined
  if (!timeSeries) throw new Error(`No historical data for ${ticker}`)

  const points: HistoricalPoint[] = Object.entries(timeSeries)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  setMemory(cacheKey, points)
  setStorage(cacheKey, points)
  return points
}
