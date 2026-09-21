import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
