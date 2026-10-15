import { useEffect, useMemo, useState } from 'react'
import { Gantt, ViewMode } from 'gantt-task-react'
import type { Task } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import GanttTaskListHeader from '@/components/common/GanttTaskListHeader'
import GanttTooltipContent from '@/components/common/GanttTooltipContent'
import DashboardCard from '@/components/common/DashboardCard'
import ProjectTable from '@/components/common/ProjectTable'
import TaskFormDrawer from '@/components/common/TaskFormDrawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { deleteTimelineTask, fetchProjectTimeline } from '@/api/timeline'
import type { TableColumn, TimelineTask } from '@/types'
import { cn } from '@/lib/utils'

const DEFAULT_COLOR = '#6366f1'
const INCOMPLETE_COLOR = '#d1d5db'

interface HealthMetric {
  id: string
  label: string
  value: string
  status: 'success' | 'warning' | 'danger' | 'muted'
  statusLabel: string
}

// TODO: 目前为模拟数据，待接入真实的进度/质量/交付/风险/资源/投入统计后替换
const HEALTH_SUMMARY: HealthMetric[] = [
  { id: 'progress', label: '进度', value: '78%', status: 'success', statusLabel: '正常' },
  { id: 'quality', label: '质量', value: 'A-', status: 'success', statusLabel: '良好' },
  { id: 'delivery', label: '交付', value: '92%', status: 'warning', statusLabel: '关注' },
  { id: 'risk', label: '风险', value: '2 项', status: 'danger', statusLabel: '预警' },
  { id: 'resource', label: '资源', value: '85%', status: 'warning', statusLabel: '紧张' },
  { id: 'investment', label: '投入', value: '120 人日', status: 'muted', statusLabel: '持平' },
]

type DisplayMode = 'timeline' | 'gantt' | 'list'

type TaskStatus = 'done' | 'overdue' | 'in-progress' | 'not-started'

const DISPLAY_MODES: { label: string; value: DisplayMode }[] = [
  { label: '任务列表', value: 'list' },
  { label: '时间线', value: 'timeline' },
  { label: '甘特图', value: 'gantt' },
]

const STATUS_META: Record<TaskStatus, { label: string; dot: string; text: string; badge: 'success' | 'warning' | 'danger' | 'muted' }> = {
  done: { label: '已完成', dot: 'bg-success', text: 'text-success', badge: 'success' },
  'in-progress': { label: '进行中', dot: 'bg-warning', text: 'text-warning', badge: 'warning' },
  overdue: { label: '延期', dot: 'bg-danger', text: 'text-danger', badge: 'danger' },
  'not-started': { label: '未开始', dot: 'bg-muted-foreground/40', text: 'text-muted-foreground', badge: 'muted' },
}

function parseDate(value: string | null): Date | null {
  if (!value) return null
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function formatDateShort(value: string | null): string {
  const date = parseDate(value)
  if (!date) return '-'
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getTaskStatus(task: TimelineTask): TaskStatus {
  if (task.done) return 'done'
  const due = parseDate(task.dueDate) ?? parseDate(task.endDate)
  if (due && due.getTime() < Date.now()) return 'overdue'
  if ((task.percentDone ?? 0) > 0) return 'in-progress'
  return 'not-started'
}

function toGanttTasks(tasks: TimelineTask[]): { ganttTasks: Task[]; unscheduledCount: number } {
  const byProject = new Map<number, { name: string; tasks: TimelineTask[] }>()
  for (const task of tasks) {
    if (!byProject.has(task.projectId)) {
      byProject.set(task.projectId, { name: task.projectName, tasks: [] })
    }
    byProject.get(task.projectId)!.tasks.push(task)
  }

  let unscheduledCount = 0
  const ganttTasks: Task[] = []

  for (const [projectId, group] of byProject) {
    const scheduled: Array<{ task: TimelineTask; start: Date; end: Date }> = []
    for (const task of group.tasks) {
      const start = parseDate(task.startDate) ?? parseDate(task.dueDate) ?? parseDate(task.endDate)
      const end = parseDate(task.endDate) ?? parseDate(task.dueDate) ?? parseDate(task.startDate)
      if (!start || !end) {
        unscheduledCount += 1
        continue
      }
      scheduled.push({ task, start: start <= end ? start : end, end: end >= start ? end : start })
    }

    if (scheduled.length === 0) continue

    const projectStart = new Date(Math.min(...scheduled.map((s) => s.start.getTime())))
    const projectEnd = new Date(Math.max(...scheduled.map((s) => s.end.getTime())))
    const avgProgress = Math.round(
      (scheduled.reduce((sum, s) => sum + (s.task.percentDone ?? 0), 0) / scheduled.length) * 100,
    )

    ganttTasks.push({
      id: `project-${projectId}`,
      type: 'project',
      name: group.name,
      start: projectStart,
      end: projectEnd,
      progress: avgProgress,
      hideChildren: false,
    })

    for (const { task, start, end } of scheduled) {
      const progressColor = task.hexColor ? `#${task.hexColor.replace(/^#/, '')}` : DEFAULT_COLOR
      ganttTasks.push({
        id: `task-${task.id}`,
        type: 'task',
        name: task.title,
        start,
        end,
        progress: Math.round((task.percentDone ?? 0) * 100),
        project: `project-${projectId}`,
        styles: {
          backgroundColor: INCOMPLETE_COLOR,
          backgroundSelectedColor: INCOMPLETE_COLOR,
          progressColor,
          progressSelectedColor: progressColor,
        },
      })
    }
  }

  return { ganttTasks, unscheduledCount }
}

interface TimelineItem {
  id: number
  name: string
  statusLabel: string
  dotClass: string
  textClass: string
  dateLabel: string
  sortDate: number
}

interface TimelineGroup {
  projectId: number
  projectName: string
  items: TimelineItem[]
}

function toTimelineGroups(tasks: TimelineTask[]): TimelineGroup[] {
  const byProject = new Map<number, { name: string; tasks: TimelineTask[] }>()
  for (const task of tasks) {
    if (!byProject.has(task.projectId)) {
      byProject.set(task.projectId, { name: task.projectName, tasks: [] })
    }
    byProject.get(task.projectId)!.tasks.push(task)
  }

  const groups: TimelineGroup[] = []
  for (const [projectId, group] of byProject) {
    const items = group.tasks
      .map((task): TimelineItem | null => {
        const anchorDate = parseDate(task.startDate) ?? parseDate(task.dueDate) ?? parseDate(task.endDate)
        if (!anchorDate) return null
        const meta = STATUS_META[getTaskStatus(task)]
        return {
          id: task.id,
          name: task.title,
          statusLabel: meta.label,
          dotClass: meta.dot,
          textClass: meta.text,
          dateLabel: formatDate(anchorDate),
          sortDate: anchorDate.getTime(),
        }
      })
      .filter((item): item is TimelineItem => item !== null)
      .sort((a, b) => a.sortDate - b.sortDate)

    if (items.length > 0) {
      groups.push({ projectId, projectName: group.name, items })
    }
  }

  return groups.sort((a, b) => a.projectName.localeCompare(b.projectName))
}

const BASE_LIST_COLUMNS: TableColumn<TimelineTask>[] = [
  { key: 'projectName', header: '项目' },
  { key: 'title', header: '任务' },
  { key: 'owner', header: '负责人', render: (row) => row.owner || '-' },
  {
    key: 'status',
    header: '状态',
    render: (row) => {
      const meta = STATUS_META[getTaskStatus(row)]
      return <Badge variant={meta.badge}>{meta.label}</Badge>
    },
  },
  { key: 'startDate', header: '开始', render: (row) => formatDateShort(row.startDate) },
  { key: 'dueDate', header: '截止', render: (row) => formatDateShort(row.dueDate ?? row.endDate) },
  {
    key: 'percentDone',
    header: '完成度',
    align: 'right',
    render: (row) => `${Math.round((row.percentDone ?? 0) * 100)}%`,
  },
]

const VIEW_MODES: { label: string; value: ViewMode }[] = [
  { label: '日', value: ViewMode.Day },
  { label: '周', value: ViewMode.Week },
  { label: '月', value: ViewMode.Month },
]

interface ProjectTimelineProps {
  projectName?: string
}

export default function ProjectTimeline({ projectName }: ProjectTimelineProps = {}) {
  const [tasks, setTasks] = useState<TimelineTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null)

  function loadTasks() {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProjectTimeline(projectName)
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '获取项目时间线失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }

  useEffect(() => {
    return loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName])

  function openCreateForm() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEditForm(task: TimelineTask) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function handleDeleteTask(task: TimelineTask) {
    if (!window.confirm(`确定删除任务「${task.title}」吗？`)) return
    deleteTimelineTask(task.id)
      .then(() => loadTasks())
      .catch((err) => {
        window.alert(err instanceof Error ? err.message : '删除失败')
      })
  }

  const { ganttTasks, unscheduledCount } = useMemo(() => toGanttTasks(tasks), [tasks])
  const timelineGroups = useMemo(() => toTimelineGroups(tasks), [tasks])
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (a.projectName !== b.projectName) return a.projectName.localeCompare(b.projectName)
        const aDate = parseDate(a.startDate) ?? parseDate(a.dueDate) ?? parseDate(a.endDate)
        const bDate = parseDate(b.startDate) ?? parseDate(b.dueDate) ?? parseDate(b.endDate)
        return (aDate?.getTime() ?? 0) - (bDate?.getTime() ?? 0)
      }),
    [tasks],
  )

  const projectCount = useMemo(() => new Set(tasks.map((t) => t.projectId)).size, [tasks])

  const listColumns = useMemo<TableColumn<TimelineTask>[]>(
    () => [
      ...BASE_LIST_COLUMNS,
      {
        key: 'actions',
        header: '操作',
        align: 'right',
        render: (row) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => openEditForm(row)}>
              编辑
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteTask(row)}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const isEmpty =
    displayMode === 'gantt'
      ? ganttTasks.length === 0
      : displayMode === 'timeline'
        ? timelineGroups.length === 0
        : sortedTasks.length === 0

  return (
    <div className="space-y-6">
      {!loading && !error && tasks.length > 0 && (
        <div className="flex justify-end">
          <Badge variant="muted">
            {projectCount} 个项目 · {tasks.length} 个任务
          </Badge>
        </div>
      )}

      <DashboardCard title="健康摘要" bodyClassName="pt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_SUMMARY.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{metric.label}</span>
                <Badge variant={metric.status}>{metric.statusLabel}</Badge>
              </div>
              <div className="mt-4 text-2xl font-semibold text-foreground">{metric.value}</div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="项目里程碑"
        headerAction={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {DISPLAY_MODES.map((mode) => (
                <Button
                  key={mode.value}
                  size="sm"
                  variant={displayMode === mode.value ? 'default' : 'outline'}
                  onClick={() => setDisplayMode(mode.value)}
                >
                  {mode.label}
                </Button>
              ))}
            </div>
            {projectName && (
              <div className="border-l border-border pl-3">
                <Button size="sm" onClick={openCreateForm}>
                  新增任务
                </Button>
              </div>
            )}
            {displayMode === 'gantt' && (
              <div className="flex items-center gap-1.5 border-l border-border pl-3">
                {VIEW_MODES.map((mode) => (
                  <Button
                    key={mode.value}
                    size="sm"
                    variant={viewMode === mode.value ? 'default' : 'outline'}
                    onClick={() => setViewMode(mode.value)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        }
        bodyClassName="pt-4"
      >
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">加载中...</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-danger">{error}</p>
        ) : isEmpty ? (
          <p className="py-6 text-center text-sm text-muted-foreground">暂无带排期的任务数据</p>
        ) : displayMode === 'gantt' ? (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Gantt
                tasks={ganttTasks}
                viewMode={viewMode}
                listCellWidth="155px"
                columnWidth={viewMode === ViewMode.Month ? 300 : 65}
                locale="zh-CN"
                TaskListHeader={GanttTaskListHeader}
                TooltipContent={GanttTooltipContent}
              />
            </div>
            {unscheduledCount > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {unscheduledCount} 个任务缺少排期（开始/结束/截止时间均为空），未在时间线中展示
              </p>
            )}
          </>
        ) : displayMode === 'timeline' ? (
          <div className="space-y-8">
            {timelineGroups.map((group) => (
              <div key={group.projectId}>
                <div className="overflow-x-auto pb-2">
                  <div className="relative min-w-[640px] px-6">
                    <div className="absolute left-6 right-6 top-[42px] h-px bg-border" />
                    <div className="relative flex">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex min-w-[140px] flex-1 flex-col items-center gap-2 px-2 text-center">
                          <span className="line-clamp-2 h-10 text-xs font-medium text-foreground" title={item.name}>
                            {item.name}
                          </span>
                          <span className={cn('h-3.5 w-3.5 rounded-full ring-4 ring-background', item.dotClass)} />
                          <span className={cn('text-xs font-medium', item.textClass)}>{item.statusLabel}</span>
                          <span className="text-xs text-muted-foreground">计划 {item.dateLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {unscheduledCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unscheduledCount} 个任务缺少排期（开始/结束/截止时间均为空），未在时间线中展示
              </p>
            )}
          </div>
        ) : (
          <ProjectTable columns={listColumns} rows={sortedTasks} />
        )}
      </DashboardCard>

      {projectName && (
        <TaskFormDrawer
          open={formOpen}
          projectName={projectName}
          task={editingTask}
          onClose={() => setFormOpen(false)}
          onSaved={loadTasks}
        />
      )}
    </div>
  )
}
