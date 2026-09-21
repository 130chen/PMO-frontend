import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendSeries } from '@/types'

interface TrendLineChartProps {
  data: Array<Record<string, string | number>>
  xKey: string
  series: TrendSeries[]
  height?: number
}

export default function TrendLineChart({ data, xKey, series, height = 280 }: TrendLineChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              fontSize: 13,
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
