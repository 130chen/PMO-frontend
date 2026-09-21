import type { NavItem } from '@/types'
import { cn } from '@/lib/utils'

interface MegaMenuProps {
  item: NavItem
  onSelect: (id: string) => void
}

export default function MegaMenu({ item, onSelect }: MegaMenuProps) {
  return (
    <div
      className={cn(
        'grid gap-1 p-3',
        item.columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
      )}
      style={{ width: item.columns === 3 ? 640 : 460 }}
    >
      {item.items.map((sub) => {
        const Icon = sub.icon
        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelect(sub.id)}
            className="group flex items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-primary-soft"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {sub.title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                {sub.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
