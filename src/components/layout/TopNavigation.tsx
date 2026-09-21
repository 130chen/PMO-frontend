import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { navItems, THEME_NAV_ID } from '@/data/navConfig'
import MegaMenu from './MegaMenu'
import ThemeMenu from './ThemeMenu'
import { cn } from '@/lib/utils'

interface TopNavigationProps {
  activePageId: string
  onNavigate: (id: string) => void
}

export default function TopNavigation({ activePageId, onNavigate }: TopNavigationProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpenId(null), 150)
  }

  const handleEnter = (id: string) => {
    clearCloseTimer()
    setOpenId(id)
  }

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {navItems.map((item) => {
        const isActive = item.items.some((sub) => sub.id === activePageId)
        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleEnter(item.id)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className={cn(
                'flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                openId === item.id || isActive ? 'text-primary' : 'text-foreground hover:text-primary',
              )}
            >
              {item.title}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-200', openId === item.id && 'rotate-180')}
                strokeWidth={2.5}
              />
            </button>

            {openId === item.id && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-menu"
                onMouseEnter={() => handleEnter(item.id)}
                onMouseLeave={scheduleClose}
              >
                <MegaMenu
                  item={item}
                  onSelect={(id) => {
                    onNavigate(id)
                    setOpenId(null)
                  }}
                />
              </div>
            )}
          </div>
        )
      })}

      <div
        className="relative"
        onMouseEnter={() => handleEnter(THEME_NAV_ID)}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
            openId === THEME_NAV_ID ? 'text-primary' : 'text-foreground hover:text-primary',
          )}
        >
          主题模式
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform duration-200', openId === THEME_NAV_ID && 'rotate-180')}
            strokeWidth={2.5}
          />
        </button>

        {openId === THEME_NAV_ID && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-menu"
            onMouseEnter={() => handleEnter(THEME_NAV_ID)}
            onMouseLeave={scheduleClose}
          >
            <ThemeMenu />
          </div>
        )}
      </div>
    </nav>
  )
}
