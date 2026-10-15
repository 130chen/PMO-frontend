import { useEffect, useRef, useState } from 'react'
import { CircuitBoard, Palette } from 'lucide-react'
import { navItems } from '@/data/navConfig'
import ThemeMenu from './ThemeMenu'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activePageId: string
  onNavigate: (id: string) => void
}

export default function Sidebar({ activePageId, onNavigate }: SidebarProps) {
  const [themeOpen, setThemeOpen] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!themeOpen) return
    const handleClick = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [themeOpen])

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <button
        type="button"
        onClick={() => onNavigate('overview')}
        className="flex shrink-0 items-center gap-2.5 px-5 py-6"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-soft">
          <CircuitBoard className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">研发项目管理平台</span>
      </button>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navItems.map((section) => (
          <div key={section.id}>
            <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((sub) => {
                const Icon = sub.icon
                const active = sub.id === activePageId
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onNavigate(sub.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                      active ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="truncate">{sub.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div ref={themeRef} className="relative shrink-0 border-t border-border p-3">
        <button
          type="button"
          onClick={() => setThemeOpen((open) => !open)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
            themeOpen ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-muted',
          )}
        >
          <Palette className="h-4 w-4 shrink-0" strokeWidth={2} />
          主题模式
        </button>

        {themeOpen && (
          <div className="absolute bottom-full left-3 z-50 mb-2 overflow-hidden rounded-2xl border border-border bg-card shadow-menu">
            <ThemeMenu />
          </div>
        )}
      </div>
    </aside>
  )
}
