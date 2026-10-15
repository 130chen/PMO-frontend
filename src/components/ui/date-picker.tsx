import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  align?: 'left' | 'right'
}

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

function parseISO(value: string | null): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - startOffset)
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

export function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  disabled,
  className,
  align = 'left',
}: DatePickerProps) {
  const selected = parseISO(value)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => selected ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggleOpen() {
    if (disabled) return
    setCursor(selected ?? new Date())
    setOpen((prev) => !prev)
  }

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const days = buildMonthGrid(year, month)
  const today = new Date()

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? toISO(selected) : placeholder}
        </span>
        <CalendarDays className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-1.5 w-64 rounded-xl border border-border bg-card p-3 shadow-menu',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-foreground">
              {year}年{month + 1}月
            </span>
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="py-1">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const inMonth = day.getMonth() === month
              const isSelected = selected !== null && isSameDay(day, selected)
              const isToday = isSameDay(day, today)
              return (
                <button
                  key={toISO(day)}
                  type="button"
                  onClick={() => {
                    onChange(toISO(day))
                    setOpen(false)
                  }}
                  className={cn(
                    'rounded-lg py-1.5 text-xs',
                    inMonth ? 'text-foreground' : 'text-muted-foreground/40',
                    isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                    isToday && !isSelected ? 'ring-1 ring-inset ring-primary/50' : '',
                  )}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
          {selected && (
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-center text-xs text-muted-foreground hover:bg-muted"
            >
              清除
            </button>
          )}
        </div>
      )}
    </div>
  )
}
