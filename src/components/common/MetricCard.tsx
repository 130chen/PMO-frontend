import type { MetricCardData } from '@/types'
import MiniSparkline from '@/components/charts/MiniSparkline'

const ICON_BG: Record<string, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
}

export default function MetricCard({ data }: { data: MetricCardData }) {
  const { label, value, sublabel, icon: Icon, trend, trendColor = 'primary' } = data

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-menu/40">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ICON_BG[trendColor]}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>

      <div className="mt-5 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>

      <div className="mt-4 -mx-1">
        <MiniSparkline data={trend} color={trendColor} />
      </div>
    </div>
  )
}
