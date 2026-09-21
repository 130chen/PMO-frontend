import { Check, Laptop, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemeAccent, type ThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const MODE_OPTIONS: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: '浅色模式', icon: Sun },
  { id: 'dark', label: '深色模式', icon: Moon },
  { id: 'system', label: '跟随系统', icon: Laptop },
]

const ACCENT_OPTIONS: { id: ThemeAccent; label: string; swatch: string }[] = [
  { id: 'blue', label: '蓝色', swatch: 'hsl(217 91% 60%)' },
  { id: 'purple', label: '紫色', swatch: 'hsl(262 83% 58%)' },
  { id: 'cyan', label: '青色', swatch: 'hsl(189 90% 40%)' },
]

export default function ThemeMenu() {
  const { mode, accent, setMode, setAccent } = useTheme()

  return (
    <div className="w-72 p-3">
      <p className="px-2 pb-1.5 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        显示模式
      </p>
      <div className="space-y-0.5">
        {MODE_OPTIONS.map((option) => {
          const Icon = option.icon
          const active = mode === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary-soft',
                active ? 'bg-primary-soft text-primary' : 'text-foreground',
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span className="flex-1 font-medium">{option.label}</span>
              {active && <Check className="h-4 w-4" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>

      <div className="my-3 h-px bg-border" />

      <p className="px-2 pb-1.5 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        主题色
      </p>
      <div className="flex items-center gap-2 px-2 pb-1">
        {ACCENT_OPTIONS.map((option) => {
          const active = accent === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setAccent(option.id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition-colors',
                active ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: option.swatch }}
              >
                {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
