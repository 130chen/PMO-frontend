import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MultiSelectDropdownProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled,
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOption(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
    } else {
      onChange([...value, option])
    }
  }

  const summary =
    value.length === 0
      ? disabled
        ? placeholder
        : '全部'
      : value.length <= 2
        ? value.join('、')
        : `${value.slice(0, 2).join('、')} 等 ${value.length} 项`

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          value.length === 0 && 'text-muted-foreground',
        )}
      >
        <span className="truncate">{summary}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-menu">
          {options.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">暂无可选项</p>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border px-2.5 pb-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onChange(options)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  全选
                </button>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-xs font-medium text-muted-foreground hover:underline"
                >
                  清空
                </button>
              </div>
              <ul className="mt-1 space-y-0.5">
                {options.map((option) => (
                  <li key={option}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/60">
                      <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={() => toggleOption(option)}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span className="truncate">{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

