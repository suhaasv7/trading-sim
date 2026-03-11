import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { MOCK_HOLDINGS } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const COLORS = [
  '#818cf8', '#a78bfa', '#c084fc',
  '#34d399', '#22d3ee', '#fbbf24',
]

export function AllocationDonut() {
  const data = MOCK_HOLDINGS.map((h) => ({
    name: h.ticker,
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
                background: 'rgba(15,15,25,0.9)',
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
            <span className="text-text-secondary">{item.name}</span>
            <span className="text-text-muted ml-auto">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
