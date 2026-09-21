import { Bell, CircuitBoard, Moon, Search, Sun } from 'lucide-react'
import TopNavigation from './TopNavigation'
import AIAssistantButton from '@/components/ai/AIAssistantButton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

interface HeaderProps {
  activePageId: string
  onNavigate: (id: string) => void
  onOpenAI: () => void
}

export default function Header({ activePageId, onNavigate, onOpenAI }: HeaderProps) {
  const { resolvedMode, setMode } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-content items-center justify-between gap-6 px-6 lg:px-10">
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-soft">
            <CircuitBoard className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">研发项目管理平台</span>
        </button>

        <div className="flex flex-1 justify-center">
          <TopNavigation activePageId={activePageId} onNavigate={onNavigate} />
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
