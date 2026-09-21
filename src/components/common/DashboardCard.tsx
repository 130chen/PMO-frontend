import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  headerAction?: ReactNode
  bodyClassName?: string
}

export default function DashboardCard({
  title,
  description,
  headerAction,
  bodyClassName,
  className,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-menu/40',
        className,
      )}
      {...props}
    >
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={cn('p-6', bodyClassName)}>{children}</div>
    </div>
  )
}
