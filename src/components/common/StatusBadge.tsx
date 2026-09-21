import { Badge } from '@/components/ui/badge'
import type { HealthStatus } from '@/types'

const STATUS_CONFIG: Record<HealthStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'muted' }> = {
  normal: { label: '正常', variant: 'success' },
  warning: { label: '预警', variant: 'warning' },
  risk: { label: '风险', variant: 'danger' },
  done: { label: '已完成', variant: 'muted' },
}

export default function StatusBadge({ status }: { status: HealthStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
