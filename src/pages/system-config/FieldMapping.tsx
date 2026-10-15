import { useEffect, useState } from 'react'
import DashboardCard from '@/components/common/DashboardCard'
import MultiSelectDropdown from '@/components/common/MultiSelectDropdown'
import ProjectTable from '@/components/common/ProjectTable'
import { Button } from '@/components/ui/button'
import { fetchProjects } from '@/api/projects'
import { fetchOptions } from '@/api/options'
import { fetchFaultRecords } from '@/api/faultRecords'
import { ExternalLink } from 'lucide-react'
import type { FaultRecord, FaultRecordFilters, FieldOptionsData, TableColumn } from '@/types'

const EMPTY_FIELDS: Omit<FaultRecordFilters, 'project'> = {
  modules: [],
  reporters: [],
  assignees: [],
  statuses: [],
  faultTypes: [],
  triggers: [],
  priorities: [],
  timeRange: '',
}

const EMPTY_FIELD_OPTIONS: FieldOptionsData = {
  modules: [],
  reporters: [],
  assignees: [],
  statuses: [],
  faultTypes: [],
  triggers: [],
  priorities: [],
  timeRanges: [],
}

const RESULT_COLUMNS: TableColumn<FaultRecord>[] = [
  { key: 'id', header: '编号' },
  { key: 'summary', header: '摘要' },
  { key: 'module', header: '模块' },
  { key: 'reporter', header: '填报人' },
  { key: 'assignee', header: '经办人' },
  { key: 'status', header: '状态' },
  { key: 'faultType', header: '故障类型' },
  { key: 'trigger', header: '触发因素' },
  { key: 'priority', header: '优先级' },
  { key: 'created', header: '创建时间' },
  {
    key: 'url',
    header: '原文',
    render: (row) =>
      row.url ? (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          查看原文
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      ) : (
        '-'
      ),
  },
]

const nativeSelectClassName =
  'flex h-10 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

export default function FieldMapping() {
  const [projectOptions, setProjectOptions] = useState<string[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const [selectedProject, setSelectedProject] = useState('')
  const [fieldOptions, setFieldOptions] = useState<FieldOptionsData>(EMPTY_FIELD_OPTIONS)
  const [fields, setFields] = useState<Omit<FaultRecordFilters, 'project'>>(EMPTY_FIELDS)
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [fieldsError, setFieldsError] = useState<string | null>(null)

  const [records, setRecords] = useState<FaultRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // 页面加载：拉取全部项目列表
  useEffect(() => {
    let cancelled = false
    setProjectsLoading(true)
    setProjectsError(null)
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjectOptions(data)
      })
      .catch((err) => {
        if (!cancelled) setProjectsError(err instanceof Error ? err.message : '获取项目列表失败')
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 选中项目后：拉取该项目下的所有可选字段
  useEffect(() => {
    if (!selectedProject) {
      setFieldOptions(EMPTY_FIELD_OPTIONS)
      setFields(EMPTY_FIELDS)
      return
    }
    let cancelled = false
    setFieldsLoading(true)
    setFieldsError(null)
    fetchOptions(selectedProject)
      .then((data) => {
        if (cancelled) return
        setFieldOptions(data)
        setFields({ ...EMPTY_FIELDS, timeRange: data.timeRanges[0] ?? '' })
      })
      .catch((err) => {
        if (!cancelled) setFieldsError(err instanceof Error ? err.message : '获取字段选项失败')
      })
      .finally(() => {
        if (!cancelled) setFieldsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedProject])

  function updateField<K extends keyof Omit<FaultRecordFilters, 'project'>>(
    key: K,
    value: Omit<FaultRecordFilters, 'project'>[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSearch() {
    setRecordsLoading(true)
    setHasSearched(true)
    try {
      const data = await fetchFaultRecords({ project: selectedProject, ...fields })
      setRecords(data)
    } finally {
      setRecordsLoading(false)
    }
  }

  function handleReset() {
    setSelectedProject('')
    setFields(EMPTY_FIELDS)
    setFieldOptions(EMPTY_FIELD_OPTIONS)
    setRecords([])
    setHasSearched(false)
  }

  const fieldsDisabled = !selectedProject || fieldsLoading

  return (
    <div className="space-y-6">
      <DashboardCard title="筛选条件" bodyClassName="space-y-4 pt-4">
        {(projectsError || fieldsError) && (
          <p className="text-sm text-danger">{projectsError ?? fieldsError}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FilterField label="项目">
            <select
              className={nativeSelectClassName}
              value={selectedProject}
              disabled={projectsLoading}
              onChange={(event) => setSelectedProject(event.target.value)}
            >
              <option value="">{projectsLoading ? '加载中...' : '请选择项目'}</option>
              {projectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="模块">
            <MultiSelectDropdown
              options={fieldOptions.modules}
              value={fields.modules}
              onChange={(value) => updateField('modules', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="填报人">
            <MultiSelectDropdown
              options={fieldOptions.reporters}
              value={fields.reporters}
              onChange={(value) => updateField('reporters', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="经办人">
            <MultiSelectDropdown
              options={fieldOptions.assignees}
              value={fields.assignees}
              onChange={(value) => updateField('assignees', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="状态">
            <MultiSelectDropdown
              options={fieldOptions.statuses}
              value={fields.statuses}
              onChange={(value) => updateField('statuses', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="故障类型">
            <MultiSelectDropdown
              options={fieldOptions.faultTypes}
              value={fields.faultTypes}
              onChange={(value) => updateField('faultTypes', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="触发因素">
            <MultiSelectDropdown
              options={fieldOptions.triggers}
              value={fields.triggers}
              onChange={(value) => updateField('triggers', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="优先级">
            <MultiSelectDropdown
              options={fieldOptions.priorities}
              value={fields.priorities}
              onChange={(value) => updateField('priorities', value)}
              disabled={fieldsDisabled}
              placeholder={selectedProject ? '请选择' : '请先选择项目'}
            />
          </FilterField>

          <FilterField label="时间范围">
            <select
              className={nativeSelectClassName}
              value={fields.timeRange}
              disabled={fieldsDisabled}
              onChange={(event) => updateField('timeRange', event.target.value)}
            >
              {fieldOptions.timeRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FilterField>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button onClick={handleSearch} disabled={!selectedProject || fieldsLoading || recordsLoading}>
            查询
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={recordsLoading}>
            重置
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard title="查询结果" bodyClassName="pt-4">
        {recordsLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">加载中...</p>
        ) : records.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {hasSearched ? '暂无符合条件的故障记录' : '请选择项目并设置筛选条件后点击查询'}
          </p>
        ) : (
          <ProjectTable columns={RESULT_COLUMNS} rows={records} />
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

