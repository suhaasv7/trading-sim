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
  cashBalance: 472_500.00,
  initialBalance: 1_000_000.00,
  totalValue: 1_347_825.00,
  totalGain: 347_825.00,
  totalGainPercent: 34.78,
  dayGain: 12_453.00,
  dayGainPercent: 0.93,
}

export const MOCK_HOLDINGS: Holding[] = [
  { ticker: 'RELIANCE.BSE', name: 'Reliance Industries', shares: 50, avgCost: 2450.00, currentPrice: 2685.50, change: 23.50, changePercent: 0.88 },
  { ticker: 'TCS.BSE', name: 'Tata Consultancy Services', shares: 30, avgCost: 3800.00, currentPrice: 4125.75, change: -15.25, changePercent: -0.37 },
  { ticker: 'INFY.BSE', name: 'Infosys Ltd', shares: 100, avgCost: 1480.00, currentPrice: 1620.30, change: 12.50, changePercent: 0.78 },
  { ticker: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd', shares: 60, avgCost: 1560.00, currentPrice: 1725.80, change: 9.50, changePercent: 0.55 },
  { ticker: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd', shares: 80, avgCost: 1020.00, currentPrice: 1180.25, change: -7.50, changePercent: -0.63 },
  { ticker: 'HINDUNILVR.BSE', name: 'Hindustan Unilever', shares: 40, avgCost: 2380.00, currentPrice: 2540.40, change: 18.60, changePercent: 0.74 },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', ticker: 'RELIANCE.BSE', name: 'Reliance Industries', type: 'BUY', shares: 10, price: 2670.00, total: 26700.00, date: '2026-03-10' },
  { id: '2', ticker: 'INFY.BSE', name: 'Infosys Ltd', type: 'BUY', shares: 25, price: 1615.50, total: 40387.50, date: '2026-03-08' },
  { id: '3', ticker: 'HINDUNILVR.BSE', name: 'Hindustan Unilever', type: 'SELL', shares: 10, price: 2535.00, total: 25350.00, date: '2026-03-07' },
  { id: '4', ticker: 'TCS.BSE', name: 'Tata Consultancy Services', type: 'BUY', shares: 10, price: 4100.00, total: 41000.00, date: '2026-03-05' },
  { id: '5', ticker: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd', type: 'BUY', shares: 20, price: 1710.00, total: 34200.00, date: '2026-03-03' },
  { id: '6', ticker: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd', type: 'BUY', shares: 30, price: 1175.00, total: 35250.00, date: '2026-03-01' },
]

export const MOCK_WATCHLIST: WatchlistItem[] = [
  { ticker: 'WIPRO.BSE', name: 'Wipro Ltd', price: 485.30, change: 4.50, changePercent: 0.94 },
  { ticker: 'BHARTIARTL.BSE', name: 'Bharti Airtel Ltd', price: 1568.45, change: -12.10, changePercent: -0.77 },
  { ticker: 'SBIN.BSE', name: 'State Bank of India', price: 825.60, change: 8.20, changePercent: 1.00 },
  { ticker: 'LT.BSE', name: 'Larsen & Toubro Ltd', price: 3412.75, change: 21.30, changePercent: 0.63 },
]

// Generate mock chart data (INR price range)
export function generateChartData(days: number = 90, basePrice: number = 2400): { date: string; price: number }[] {
  const data: { date: string; price: number }[] = []
  let price = basePrice
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    price += (Math.random() - 0.45) * (basePrice * 0.015)
    price = Math.max(price, basePrice * 0.85)
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    })
  }

  return data
}

// Popular Indian stocks for browse/search fallback
export const POPULAR_STOCKS: StockQuote[] = [
  { ticker: 'RELIANCE.BSE', name: 'Reliance Industries', price: 2685.50, change: 23.50, changePercent: 0.88, volume: 12_320_000, high: 2710.00, low: 2655.20, open: 2662.00, prevClose: 2662.00 },
  { ticker: 'TCS.BSE', name: 'Tata Consultancy Services', price: 4125.75, change: -15.25, changePercent: -0.37, volume: 3_150_000, high: 4155.90, low: 4100.10, open: 4141.00, prevClose: 4141.00 },
  { ticker: 'INFY.BSE', name: 'Infosys Ltd', price: 1620.30, change: 12.50, changePercent: 0.78, volume: 8_800_000, high: 1635.00, low: 1605.50, open: 1607.80, prevClose: 1607.80 },
  { ticker: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd', price: 1725.80, change: 9.50, changePercent: 0.55, volume: 6_600_000, high: 1740.20, low: 1710.00, open: 1716.30, prevClose: 1716.30 },
  { ticker: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd', price: 1180.25, change: -7.50, changePercent: -0.63, volume: 9_200_000, high: 1195.50, low: 1172.80, open: 1187.75, prevClose: 1187.75 },
  { ticker: 'HINDUNILVR.BSE', name: 'Hindustan Unilever', price: 2540.40, change: 18.60, changePercent: 0.74, volume: 2_900_000, high: 2555.00, low: 2518.50, open: 2521.80, prevClose: 2521.80 },
  { ticker: 'SBIN.BSE', name: 'State Bank of India', price: 825.60, change: 8.20, changePercent: 1.00, volume: 18_900_000, high: 832.00, low: 815.20, open: 817.40, prevClose: 817.40 },
  { ticker: 'BHARTIARTL.BSE', name: 'Bharti Airtel Ltd', price: 1568.45, change: -12.10, changePercent: -0.77, volume: 5_100_000, high: 1585.30, low: 1560.00, open: 1580.55, prevClose: 1580.55 },
]
