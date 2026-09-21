import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts'

interface ProgressRingProps {
  value: number
  size?: number
  label?: string
  sublabel?: string
}

export default function ProgressRing({ value, size = 200, label, sublabel }: ProgressRingProps) {
  const data = [{ name: 'progress', value, fill: 'hsl(var(--primary))' }]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius="78%"
        outerRadius="100%"
        barSize={14}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: 'hsl(var(--muted))' }}
          dataKey="value"
          cornerRadius={999}
          isAnimationActive={false}
        />
      </RadialBarChart>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-foreground">{label ?? `${value}%`}</span>
        {sublabel && <span className="mt-1 text-xs text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
