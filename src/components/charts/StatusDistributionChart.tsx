import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface StatusDistributionDatum {
  name: string
  value: number
  color: string
}

interface StatusDistributionChartProps {
  data: StatusDistributionDatum[]
  height?: number
}

export default function StatusDistributionChart({ data, height = 220 }: StatusDistributionChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
            contentStyle={{
              borderRadius: 16,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              fontSize: 13,
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive={false} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
