import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  colorClassName?: string
  trackClassName?: string
  showLabel?: boolean
}

export default function ProgressBar({
  value,
  className,
  colorClassName = 'bg-primary',
  trackClassName = 'bg-muted',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('h-2 w-full overflow-hidden rounded-full', trackClassName)} title={`${clamped}%`}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-medium text-muted-foreground">
          {clamped}%
        </span>
      )}
    </div>
  )
}
