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
  marketCap: number
}

export interface Holding {
  ticker: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  change: number
  changePercent: number
}

export interface Transaction {
  id: string
  ticker: string
  name: string
  type: 'BUY' | 'SELL'
  shares: number
  price: number
  total: number
  date: string
}

export interface WatchlistItem {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export const MOCK_PORTFOLIO = {
  cashBalance: 47_250.00,
  initialBalance: 100_000.00,
  totalValue: 134_782.50,
  totalGain: 34_782.50,
  totalGainPercent: 34.78,
  dayGain: 1_245.30,
  dayGainPercent: 0.93,
}

export const MOCK_HOLDINGS: Holding[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 178.25, currentPrice: 198.50, change: 2.35, changePercent: 1.20 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgCost: 380.00, currentPrice: 425.75, change: -1.25, changePercent: -0.29 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', shares: 20, avgCost: 650.00, currentPrice: 875.30, change: 12.50, changePercent: 1.45 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 25, avgCost: 140.50, currentPrice: 172.80, change: 0.95, changePercent: 0.55 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', shares: 15, avgCost: 178.90, currentPrice: 195.25, change: -0.75, changePercent: -0.38 },
  { ticker: 'TSLA', name: 'Tesla Inc.', shares: 10, avgCost: 245.00, currentPrice: 268.40, change: 5.60, changePercent: 2.13 },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', ticker: 'NVDA', name: 'NVIDIA Corp.', type: 'BUY', shares: 5, price: 860.00, total: 4300.00, date: '2026-03-10' },
  { id: '2', ticker: 'AAPL', name: 'Apple Inc.', type: 'BUY', shares: 10, price: 196.50, total: 1965.00, date: '2026-03-08' },
  { id: '3', ticker: 'TSLA', name: 'Tesla Inc.', type: 'SELL', shares: 5, price: 270.00, total: 1350.00, date: '2026-03-07' },
  { id: '4', ticker: 'MSFT', name: 'Microsoft Corp.', type: 'BUY', shares: 10, price: 420.00, total: 4200.00, date: '2026-03-05' },
  { id: '5', ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'BUY', shares: 15, price: 168.00, total: 2520.00, date: '2026-03-03' },
  { id: '6', ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'BUY', shares: 15, price: 178.90, total: 2683.50, date: '2026-03-01' },
  { id: '7', ticker: 'NVDA', name: 'NVIDIA Corp.', type: 'BUY', shares: 15, price: 645.00, total: 9675.00, date: '2026-02-25' },
  { id: '8', ticker: 'AAPL', name: 'Apple Inc.', type: 'BUY', shares: 40, price: 175.00, total: 7000.00, date: '2026-02-20' },
]

export const MOCK_WATCHLIST: WatchlistItem[] = [
  { ticker: 'META', name: 'Meta Platforms', price: 582.30, change: 4.50, changePercent: 0.78 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', price: 168.45, change: -2.10, changePercent: -1.23 },
  { ticker: 'NFLX', name: 'Netflix Inc.', price: 925.60, change: 8.20, changePercent: 0.89 },
  { ticker: 'CRM', name: 'Salesforce Inc.', price: 312.75, change: 1.30, changePercent: 0.42 },
]

export const MOCK_STOCK_DETAIL: StockQuote = {
  ticker: 'AAPL',
  name: 'Apple Inc.',
  price: 198.50,
  change: 2.35,
  changePercent: 1.20,
  volume: 54_320_000,
  high: 199.80,
  low: 195.20,
  open: 196.15,
  prevClose: 196.15,
  marketCap: 3_050_000_000_000,
}

// Generate mock chart data
export function generateChartData(days: number = 90): { date: string; price: number }[] {
  const data: { date: string; price: number }[] = []
  let price = 165
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    price += (Math.random() - 0.45) * 4
    price = Math.max(price, 140)
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    })
  }

  return data
}

export const POPULAR_STOCKS: StockQuote[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 198.50, change: 2.35, changePercent: 1.20, volume: 54_320_000, high: 199.80, low: 195.20, open: 196.15, prevClose: 196.15, marketCap: 3_050_000_000_000 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 425.75, change: -1.25, changePercent: -0.29, volume: 22_150_000, high: 428.90, low: 423.10, open: 427.00, prevClose: 427.00, marketCap: 3_170_000_000_000 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 12.50, changePercent: 1.45, volume: 41_800_000, high: 880.00, low: 860.50, open: 862.80, prevClose: 862.80, marketCap: 2_150_000_000_000 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 172.80, change: 0.95, changePercent: 0.55, volume: 28_600_000, high: 174.20, low: 171.00, open: 171.85, prevClose: 171.85, marketCap: 2_130_000_000_000 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 195.25, change: -0.75, changePercent: -0.38, volume: 35_200_000, high: 197.50, low: 193.80, open: 196.00, prevClose: 196.00, marketCap: 2_010_000_000_000 },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 268.40, change: 5.60, changePercent: 2.13, volume: 62_400_000, high: 272.00, low: 261.50, open: 262.80, prevClose: 262.80, marketCap: 852_000_000_000 },
  { ticker: 'META', name: 'Meta Platforms', price: 582.30, change: 4.50, changePercent: 0.78, volume: 18_900_000, high: 585.00, low: 576.20, open: 577.80, prevClose: 577.80, marketCap: 1_480_000_000_000 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', price: 168.45, change: -2.10, changePercent: -1.23, volume: 45_100_000, high: 172.30, low: 167.00, open: 170.55, prevClose: 170.55, marketCap: 272_000_000_000 },
]
