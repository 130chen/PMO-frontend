import type { TableColumn } from '@/types'
import { cn } from '@/lib/utils'

interface ProjectTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[]
  rows: T[]
  className?: string
}

export default function ProjectTable<T extends Record<string, any>>({
  columns,
  rows,
  className,
}: ProjectTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-border', className)}>
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/40"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'whitespace-nowrap px-4 py-3.5 text-foreground',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
