import { Bell, Moon, Search, Sun } from 'lucide-react'
import AIAssistantButton from '@/components/ai/AIAssistantButton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

interface HeaderProps {
  title: string
  description?: string
  onOpenAI: () => void
}

export default function Header({ title, description, onOpenAI }: HeaderProps) {
  const { resolvedMode, setMode } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-6 px-6 py-3 lg:px-10">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="全局搜索" className="w-56 rounded-xl pl-9 pr-12" />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          <Button variant="ghost" size="icon" className="relative" aria-label="通知">
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
          </Button>

          <AIAssistantButton onClick={onOpenAI} />

          <Button
            variant="ghost"
            size="icon"
            aria-label="切换深浅主题"
            onClick={() => setMode(resolvedMode === 'dark' ? 'light' : 'dark')}
          >
            {resolvedMode === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
            ) : (
              <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
            )}
          </Button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-label="用户"
          >
            M
          </button>
        </div>
      </div>
    </header>
  )
}
