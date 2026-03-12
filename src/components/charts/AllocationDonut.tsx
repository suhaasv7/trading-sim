import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { usePortfolioContext } from '@/contexts/PortfolioContext'
import { formatCurrency } from '@/lib/utils'

const COLORS = [
  '#00D09C', '#3B82F6', '#F59E0B',
  '#EC4899', '#8B5CF6', '#06B6D4',
]

export function AllocationDonut() {
  const { holdings } = usePortfolioContext()
  const data = holdings.map((h) => ({
    name: h.ticker.replace('.BSE', ''),
    value: h.shares * h.currentPrice,
  }))

  return (
    <div className="flex items-center gap-6">
      <div style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart width={140} height={140}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#f0f0f3',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-text-secondary">{item.name.replace('.BSE', '')}</span>
            <span className="text-text-muted ml-auto">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
