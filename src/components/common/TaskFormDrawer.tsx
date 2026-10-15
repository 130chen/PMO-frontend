import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { createTimelineTask, updateTimelineTask } from '@/api/timeline'
import { cn } from '@/lib/utils'
import type { TimelineTask, TimelineTaskUpsertPayload } from '@/types'

const COLOR_OPTIONS = [
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#84cc16',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
]

interface TaskFormDrawerProps {
  open: boolean
  projectName: string
  task?: TimelineTask | null
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  title: string
  owner: string
  startDate: string
  dueDate: string
  priority: string
  percentDone: string
  hexColor: string
}

const EMPTY_FORM: FormState = {
  title: '',
  owner: '',
  startDate: '',
  dueDate: '',
  priority: '',
  percentDone: '0',
  hexColor: '#6366f1',
}

function toFormState(task?: TimelineTask | null): FormState {
  if (!task) return EMPTY_FORM
  return {
    title: task.title,
    owner: task.owner ?? '',
    startDate: task.startDate ?? '',
    dueDate: task.dueDate ?? '',
    priority: task.priority != null ? String(task.priority) : '',
    percentDone: String(Math.round((task.percentDone ?? 0) * 100)),
    hexColor: task.hexColor ? `#${task.hexColor.replace(/^#/, '')}` : '#6366f1',
  }
}

export default function TaskFormDrawer({ open, projectName, task, onClose, onSaved }: TaskFormDrawerProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(task))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(toFormState(task))
      setError(null)
    }
  }, [open, task])

  if (!open) return null

  const isEditing = Boolean(task)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('请填写任务标题')
      return
    }
    if (!form.startDate) {
      setError('请选择开始日期')
      return
    }
    if (!form.dueDate) {
      setError('请选择截止日期')
      return
    }
    const payload: TimelineTaskUpsertPayload = {
      projectName,
      title: form.title.trim(),
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
      priority: form.priority === '' ? null : Number(form.priority),
      percentDone: form.percentDone === '' ? null : Number(form.percentDone),
      hexColor: form.hexColor ? form.hexColor.replace(/^#/, '') : null,
      owner: form.owner.trim() || null,
    }
    setSaving(true)
    setError(null)
    const request = isEditing && task ? updateTimelineTask(task.id, payload) : createTimelineTask(payload)
    request
      .then(() => {
        onSaved()
        onClose()
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '保存失败')
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="absolute right-0 top-0 flex h-full w-[420px] max-w-full animate-drawerIn flex-col border-l border-border bg-card shadow-menu">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-[15px] font-semibold text-foreground">{isEditing ? '编辑任务' : '新增任务'}</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="关闭">
            <X className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>

        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">所属项目</label>
              <Input value={projectName} disabled />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                任务标题 <span className="text-danger">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                placeholder="请输入任务标题"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">负责人</label>
              <Input
                value={form.owner}
                onChange={(event) => update('owner', event.target.value)}
                placeholder="可选"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  开始日期 <span className="text-danger">*</span>
                </label>
                <DatePicker value={form.startDate || null} onChange={(value) => update('startDate', value ?? '')} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  截止日期 <span className="text-danger">*</span>
                </label>
                <DatePicker
                  value={form.dueDate || null}
                  onChange={(value) => update('dueDate', value ?? '')}
                  align="right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">优先级</label>
                <Input
                  type="number"
                  value={form.priority}
                  onChange={(event) => update('priority', event.target.value)}
                  placeholder="可选"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">完成度 %</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.percentDone}
                  onChange={(event) => update('percentDone', event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">颜色</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => update('hexColor', color)}
                    aria-label={color}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-transform',
                      form.hexColor.toLowerCase() === color.toLowerCase()
                        ? 'border-foreground scale-110'
                        : 'border-transparent hover:scale-105',
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              取消
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
