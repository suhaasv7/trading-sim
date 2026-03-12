import { useEffect, useRef } from 'react'
import { createChart, ColorType, AreaSeries, type IChartApi } from 'lightweight-charts'
import { usePortfolioContext } from '@/contexts/PortfolioContext'

interface PortfolioChartProps {
  height?: number
}

export function PortfolioChart({ height = 200 }: PortfolioChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const { transactions, summary } = usePortfolioContext()

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#71717a',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.06)',
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: false,
      },
      crosshair: {
        vertLine: { color: 'rgba(255,255,255,0.3)', width: 1, style: 2 },
        horzLine: { color: 'rgba(255,255,255,0.3)', width: 1, style: 2 },
      },
      handleScale: false,
      handleScroll: false,
    })

    // Build portfolio value over time from transactions
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.executed_at).getTime() - new Date(b.executed_at).getTime()
    )

    const initialBalance = summary.initialBalance || 1000000
    const dataPoints: { time: string; value: number }[] = []

    // Start: day before first transaction (or 90 days ago), full cash
    const now = new Date()
    const startDate = sortedTx.length > 0
      ? new Date(new Date(sortedTx[0].executed_at).getTime() - 86400000)
      : new Date(now.getTime() - 90 * 86400000)

    dataPoints.push({
      time: startDate.toISOString().split('T')[0],
      value: initialBalance,
    })

    // Add a point for each transaction day showing cumulative cash flow
    let cashSpent = 0
    sortedTx.forEach((tx) => {
      if (tx.type === 'BUY') {
        cashSpent += tx.total_amount
      } else {
        cashSpent -= tx.total_amount
      }
      const date = new Date(tx.executed_at).toISOString().split('T')[0]
      // Portfolio value at that point = initial balance - cash spent on stocks + estimated holdings value
      // We approximate with a linear interpolation toward current value
      dataPoints.push({
        time: date,
        value: initialBalance - cashSpent + cashSpent, // at time of trade, value ≈ initial (bought at market price)
      })
    })

    // End: today with actual portfolio value
    const today = now.toISOString().split('T')[0]
    if (dataPoints.length === 0 || dataPoints[dataPoints.length - 1].time !== today) {
      dataPoints.push({ time: today, value: summary.totalValue })
    } else {
      dataPoints[dataPoints.length - 1].value = summary.totalValue
    }

    // Deduplicate by date (keep last value per date)
    const byDate = new Map<string, number>()
    dataPoints.forEach((d) => byDate.set(d.time, d.value))
    const finalData = Array.from(byDate.entries())
      .map(([time, value]) => ({ time, value }))
      .sort((a, b) => a.time.localeCompare(b.time))

    const isGain = summary.totalGain >= 0
    const series = chart.addSeries(AreaSeries, {
      lineColor: isGain ? '#00D09C' : '#EB5B3C',
      topColor: isGain ? 'rgba(0,208,156,0.25)' : 'rgba(235,91,60,0.25)',
      bottomColor: isGain ? 'rgba(0,208,156,0.0)' : 'rgba(235,91,60,0.0)',
      lineWidth: 2,
    })

    series.setData(finalData)
    chart.timeScale().fitContent()
    chartRef.current = chart

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [height, transactions, summary])

  return <div ref={containerRef} className="w-full" />
}
