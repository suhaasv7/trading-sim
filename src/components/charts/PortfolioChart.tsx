import { useEffect, useRef } from 'react'
import { generateChartData } from '@/lib/mock-data'
import { createChart, ColorType, AreaSeries, type IChartApi } from 'lightweight-charts'

interface PortfolioChartProps {
  height?: number
}

export function PortfolioChart({ height = 200 }: PortfolioChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

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

    const data = generateChartData(90)
    const series = chart.addSeries(AreaSeries, {
      lineColor: '#00D09C',
      topColor: 'rgba(0,208,156,0.25)',
      bottomColor: 'rgba(0,208,156,0.0)',
      lineWidth: 2,
    })

    series.setData(
      data.map((d) => ({ time: d.date, value: d.price }))
    )

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
  }, [height])

  return <div ref={containerRef} className="w-full" />
}
