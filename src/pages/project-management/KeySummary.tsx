import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, FileText, FolderKanban, Loader2, RefreshCw, Search, XCircle } from 'lucide-react'
import DashboardCard from '@/components/common/DashboardCard'
import MetricCard from '@/components/common/MetricCard'
import StatusDistributionChart from '@/components/charts/StatusDistributionChart'
import WeeklyReportCard from '@/components/project-management/WeeklyReportCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchConfluenceOptions, fetchConfluenceSpaces, fetchWeeklySummary, syncWeeklySummary } from '@/api/confluence'
import type {
  ConfluenceFieldOptions,
  ConfluenceSearchRequest,
  ConfluenceSpace,
  MetricCardData,
  SyncResponse,
  WeeklySummaryFailedPage,
  WeeklySummaryProjectGroup,
} from '@/types'

type SearchFields = Omit<ConfluenceSearchRequest, 'space'>

const EMPTY_FIELDS: SearchFields = {
  author: '',
  createTimeRange: '',
  updateTimeRange: '',
}

const nativeSelectClassName =
  'flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

export default function KeySummary() {
  const [spaceOptions, setSpaceOptions] = useState<ConfluenceSpace[]>([])
  const [spacesLoading, setSpacesLoading] = useState(true)
  const [spacesError, setSpacesError] = useState<string | null>(null)

  const [selectedSpace, setSelectedSpace] = useState('')
  const [fields, setFields] = useState<SearchFields>(EMPTY_FIELDS)

  const [fieldOptions, setFieldOptions] = useState<ConfluenceFieldOptions | null>(null)
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [optionsError, setOptionsError] = useState<string | null>(null)

  const [projects, setProjects] = useState<WeeklySummaryProjectGroup[]>([])
  const [failures, setFailures] = useState<WeeklySummaryFailedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasQueried, setHasQueried] = useState(false)

  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [syncResult, setSyncResult] = useState<SyncResponse | null>(null)

  const reportCount = projects.reduce((sum, group) => sum + group.reports.length, 0)

  const statusCounts = useMemo(() => {
    const counts = { green: 0, yellow: 0, red: 0, unknown: 0 }
    for (const group of projects) {
      for (const report of group.reports) {
        const status = report.status?.normalized_status
        if (status === 'green' || status === 'yellow' || status === 'red') {
          counts[status] += 1
        } else {
          counts.unknown += 1
        }
      }
    }
    return counts
  }, [projects])

  const riskProjectCount = useMemo(
    () => projects.filter((group) => group.reports.some((r) => r.status?.normalized_status === 'red')).length,
    [projects],
  )

  const kpis = useMemo<MetricCardData[]>(
    () => [
      {
        id: 'project-count',
        label: '项目总数',
        value: String(projects.length),
        sublabel: '当前库内数据',
        icon: FolderKanban,
        trend: [projects.length, projects.length],
        trendColor: 'primary',
      },
      {
        id: 'report-count',
        label: '周报总数',
        value: String(reportCount),
        sublabel: '当前库内数据',
        icon: FileText,
        trend: [reportCount, reportCount],
        trendColor: 'primary',
      },
      {
        id: 'risk-project-count',
        label: '风险项目',
        value: String(riskProjectCount),
        sublabel: '存在风险状态周报',
        icon: AlertTriangle,
        trend: [riskProjectCount, riskProjectCount],
        trendColor: 'danger',
      },
      {
        id: 'failure-count',
        label: '解析失败页面',
        value: String(failures.length),
        sublabel: '需人工核查',
        icon: XCircle,
        trend: [failures.length, failures.length],
        trendColor: 'warning',
      },
    ],
    [projects.length, reportCount, riskProjectCount, failures.length],
  )

  const statusChartData = useMemo(
    () => [
      { name: '正常', value: statusCounts.green, color: 'hsl(var(--success))' },
      { name: '预警', value: statusCounts.yellow, color: 'hsl(var(--warning))' },
      { name: '风险', value: statusCounts.red, color: 'hsl(var(--danger))' },
      { name: '未知', value: statusCounts.unknown, color: 'hsl(var(--muted-foreground))' },
    ],
    [statusCounts],
  )

  const showDashboard = !loading && !error && projects.length > 0

  function loadSummary(space: string) {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchWeeklySummary(space)
      .then((data) => {
        if (cancelled) return
        setProjects(data.projects ?? [])
        setFailures(data.failures ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '获取重点总结失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }

  // 切换空间后，之前查出来的结果就不再适用，清空等待用户重新点"查询"
  useEffect(() => {
    setProjects([])
    setFailures([])
    setError(null)
    setLoading(false)
    setHasQueried(false)
  }, [selectedSpace])

  // 页面加载：拉取全部可选空间（供下方"同步"筛选条件使用）
  useEffect(() => {
    let cancelled = false
    setSpacesLoading(true)
    setSpacesError(null)
    fetchConfluenceSpaces()
      .then((data) => {
        if (!cancelled) setSpaceOptions(data)
      })
      .catch((err) => {
        if (!cancelled) setSpacesError(err instanceof Error ? err.message : '获取空间列表失败')
      })
      .finally(() => {
        if (!cancelled) setSpacesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 切换空间后，拉取该空间下可选的作者/时间范围
  useEffect(() => {
    setSyncResult(null)
    setSyncError(null)

    if (!selectedSpace) {
      setFieldOptions(null)
      setOptionsError(null)
      setFields(EMPTY_FIELDS)
      return
    }

    let cancelled = false
    setOptionsLoading(true)
    setOptionsError(null)
    fetchConfluenceOptions(selectedSpace)
      .then((data) => {
        if (cancelled) return
        setFieldOptions(data)
        setFields({
          author: data.authors[0] ?? '',
          createTimeRange: data.createTimeRanges[0] ?? '',
          updateTimeRange: data.updateTimeRanges[0] ?? '',
        })
      })
      .catch((err) => {
        if (!cancelled) setOptionsError(err instanceof Error ? err.message : '获取筛选选项失败')
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedSpace])

  function updateField<K extends keyof SearchFields>(key: K, value: SearchFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function handleQuery() {
    if (!selectedSpace) return
    setHasQueried(true)
    loadSummary(selectedSpace)
  }

  function handleSync() {
    setSyncing(true)
    setSyncError(null)
    setSyncResult(null)
    syncWeeklySummary({ space: selectedSpace, ...fields })
      .then((data) => {
        setSyncResult(data)
        setHasQueried(true)
        loadSummary(selectedSpace)
      })
      .catch((err) => {
        setSyncError(err instanceof Error ? err.message : '同步失败')
      })
      .finally(() => {
        setSyncing(false)
      })
  }

  function handleReset() {
    setSelectedSpace('')
    setFieldOptions(null)
    setFields(EMPTY_FIELDS)
    setSyncResult(null)
    setSyncError(null)
  }

  const fieldsDisabled = spacesLoading || !selectedSpace || optionsLoading

  return (
    <div className="space-y-6">
      {hasQueried && !loading && !error && (
        <div className="flex justify-end">
          <Badge variant="muted">
            {projects.length} 个项目 · 共 {reportCount.toLocaleString()} 份周报
          </Badge>
        </div>
      )}

      <DashboardCard title="增量同步" bodyClassName="space-y-4 pt-4">
        <p className="text-xs text-muted-foreground">
          选择 Confluence 空间与筛选条件后，点击"查询"从库中查看已落库的重点总结；点击"同步"则对新增或变化的周报页面重新分析并落库，再自动刷新展示。
        </p>
        {spacesError && <p className="text-sm text-danger">{spacesError}</p>}
        {optionsError && <p className="text-sm text-danger">{optionsError}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="空间">
            <select
              className={nativeSelectClassName}
              value={selectedSpace}
              disabled={spacesLoading}
              onChange={(event) => setSelectedSpace(event.target.value)}
            >
              <option value="">{spacesLoading ? '加载中...' : '请选择空间'}</option>
              {spaceOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="作者">
            <select
              className={nativeSelectClassName}
              value={fields.author}
              disabled={fieldsDisabled}
              onChange={(event) => updateField('author', event.target.value)}
            >
              {fieldOptions?.authors.length ? (
                fieldOptions.authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))
              ) : (
                <option value="">{optionsLoading ? '加载中...' : '请先选择空间'}</option>
              )}
            </select>
          </FilterField>

          <FilterField label="创建时间">
            <select
              className={nativeSelectClassName}
              value={fields.createTimeRange}
              disabled={fieldsDisabled}
              onChange={(event) => updateField('createTimeRange', event.target.value)}
            >
              {fieldOptions?.createTimeRanges.length ? (
                fieldOptions.createTimeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))
              ) : (
                <option value="">{optionsLoading ? '加载中...' : '请先选择空间'}</option>
              )}
            </select>
          </FilterField>

          <FilterField label="更新时间">
            <select
              className={nativeSelectClassName}
              value={fields.updateTimeRange}
              disabled={fieldsDisabled}
              onChange={(event) => updateField('updateTimeRange', event.target.value)}
            >
              {fieldOptions?.updateTimeRanges.length ? (
                fieldOptions.updateTimeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))
              ) : (
                <option value="">{optionsLoading ? '加载中...' : '请先选择空间'}</option>
              )}
            </select>
          </FilterField>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button onClick={handleQuery} disabled={!selectedSpace || loading}>
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" strokeWidth={2} />
            ) : (
              <Search className="mr-1.5 h-4 w-4" strokeWidth={2} />
            )}
            查询
          </Button>
          <Button variant="outline" onClick={handleSync} disabled={fieldsDisabled || syncing}>
            {syncing ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" strokeWidth={2} />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" strokeWidth={2} />
            )}
            同步
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={syncing}>
            重置
          </Button>
        </div>

        {syncError && <p className="text-sm text-danger">{syncError}</p>}
        {syncResult && (
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            同步完成：新增 {syncResult.newPageCount} 页，变更 {syncResult.changedPageCount} 页，未变化{' '}
            {syncResult.unchangedPageCount} 页
            {syncResult.updatedProjects.length > 0
              ? `，已更新项目：${syncResult.updatedProjects.join('、')}`
              : '，没有项目需要更新'}
            {syncResult.failures.length > 0 && `，${syncResult.failures.length} 个页面解析失败`}
          </div>
        )}
      </DashboardCard>

      {showDashboard && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <MetricCard key={kpi.id} data={kpi} />
            ))}
          </div>

          <DashboardCard title="状态分布" description="按周报归一化状态统计" bodyClassName="pt-4">
            <StatusDistributionChart data={statusChartData} />
          </DashboardCard>
        </>
      )}

      <DashboardCard title="重点总结" bodyClassName="pt-4">
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">加载中...</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-danger">{error}</p>
        ) : !hasQueried ? (
          <p className="py-6 text-center text-sm text-muted-foreground">请选择空间与筛选条件后点击"查询"</p>
        ) : projects.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">该空间暂无重点总结数据，可点击"同步"获取</p>
        ) : (
          <div className="space-y-8">
            {projects.map((group) => (
              <div key={group.projectName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{group.projectName}</h3>
                  <Badge>{group.reports.length} 份周报</Badge>
                </div>
                <div className="space-y-4">
                  {group.reports.map((report) => (
                    <WeeklyReportCard
                      key={report.source?.page_id ?? report.report_id ?? `${group.projectName}-${report.summary}`}
                      report={report}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && failures.length > 0 && (
          <div className="mt-8 rounded-2xl border border-warning/40 bg-warning-soft p-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning">{failures.length} 个页面解析失败</Badge>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {failures.map((failure) => (
                <li key={failure.pageId}>
                  {failure.title || failure.pageId}：{failure.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
