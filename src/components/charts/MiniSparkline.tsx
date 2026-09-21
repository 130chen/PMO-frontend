import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const COLOR_VARS: Record<string, string> = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
}

interface MiniSparklineProps {
  data: number[]
  color?: 'primary' | 'success' | 'warning' | 'danger'
  height?: number
}

export default function MiniSparkline({ data, color = 'primary', height = 56 }: MiniSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))
  const strokeColor = COLOR_VARS[color]
  const gradientId = `sparkline-gradient-${color}`

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
