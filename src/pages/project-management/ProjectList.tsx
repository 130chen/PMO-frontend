import { useEffect, useState } from 'react'
import { ArrowLeft, Boxes, Loader2, RefreshCw } from 'lucide-react'
import DashboardCard from '@/components/common/DashboardCard'
import ProgressBar from '@/components/common/ProgressBar'
import ProjectTable from '@/components/common/ProjectTable'
import ProjectTimeline from '@/pages/project-management/ProjectTimeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchProjectList } from '@/api/projectList'
import { fetchProjectTimeline } from '@/api/timeline'
import { parseHash, setHash } from '@/lib/route'
import type { ProjectListItem, TableColumn } from '@/types'

// 进度条颜色分档阈值，后续可按需直接调整这两个数字
const PROGRESS_COLOR_THRESHOLDS = { danger: 40, warning: 70 }

function getProgressColorClassName(percent: number): string {
  if (percent < PROGRESS_COLOR_THRESHOLDS.danger) return 'bg-danger'
  if (percent < PROGRESS_COLOR_THRESHOLDS.warning) return 'bg-warning'
  return 'bg-success'
}

function toCompletionByProject(tasks: Awaited<ReturnType<typeof fetchProjectTimeline>>): Record<string, number> {
  const byProject = new Map<string, number[]>()
  for (const task of tasks) {
    if (!byProject.has(task.projectName)) {
      byProject.set(task.projectName, [])
    }
    byProject.get(task.projectName)!.push(task.percentDone ?? 0)
  }

  const result: Record<string, number> = {}
  for (const [projectName, percents] of byProject) {
    if (percents.length === 0) continue
    result[projectName] = Math.round((percents.reduce((sum, p) => sum + p, 0) / percents.length) * 100)
  }
  return result
}

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectListItem | null>(null)
  const [completionByProject, setCompletionByProject] = useState<Record<string, number>>({})

  const columns: TableColumn<ProjectListItem>[] = [
    { key: 'name', header: '项目名称' },
    { key: 'lead', header: '负责人', render: (row) => row.lead || '—' },
    {
      key: 'completion',
      header: '实际进度',
      render: (row) =>
        row.name in completionByProject ? (
          <ProgressBar
            value={completionByProject[row.name]}
            showLabel
            className="w-32"
            colorClassName={getProgressColorClassName(completionByProject[row.name])}
          />
        ) : (
          '—'
        ),
    },
    {
      key: 'confluencePage',
      header: 'Confluence 页面',
      render: (row) =>
        row.confluencePage ? (
          <a
            href={row.confluencePage}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            查看
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      header: '操作',
      align: 'right',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => openDetail(row)}>
          详情
        </Button>
      ),
    },
  ]

  function load() {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProjectList()
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '获取项目列表失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    fetchProjectTimeline()
      .then((data) => {
        if (!cancelled) setCompletionByProject(toCompletionByProject(data))
      })
      .catch(() => {
        if (!cancelled) setCompletionByProject({})
      })
    return () => {
      cancelled = true
    }
  }

  useEffect(() => {
    return load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function syncFromHash() {
      const { pageId, param } = parseHash()
      if (pageId !== 'jira-projects') return
      if (!param) {
        setSelectedProject(null)
        return
      }
      setSelectedProject((prev) => {
        if (prev && prev.name === param) return prev
        return projects.find((p) => p.name === param) ?? prev
      })
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [projects])

  function openDetail(project: ProjectListItem) {
    setHash('jira-projects', project.name)
    setSelectedProject(project)
  }

  function closeDetail() {
    setHash('jira-projects')
    setSelectedProject(null)
  }

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={closeDetail}>
          <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={2} />
          返回项目列表
        </Button>

        <DashboardCard title={selectedProject.name} bodyClassName="pt-4">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailField label="项目名称" value={selectedProject.name} />
            <DetailField label="负责人" value={selectedProject.lead || '—'} />
            <DetailField label="Confluence 页面" value={selectedProject.confluencePage || '—'} isLink={!!selectedProject.confluencePage} />
          </dl>
        </DashboardCard>

        <ProjectTimeline projectName={selectedProject.name} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!loading && !error && (
        <div className="flex justify-end">
          <Badge variant="muted">{projects.length} 个项目</Badge>
        </div>
      )}

      <DashboardCard
        title="项目清单"
        bodyClassName="pt-4"
        headerAction={
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" strokeWidth={2} />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" strokeWidth={2} />
            )}
            刷新
          </Button>
        }
      >
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">加载中...</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-danger">{error}</p>
        ) : projects.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            <Boxes className="mx-auto mb-2 h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            暂无项目数据
          </p>
        ) : (
          <ProjectTable columns={columns} rows={projects} />
        )}
      </DashboardCard>
    </div>
  )
}

function DetailField({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-primary underline-offset-2 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
