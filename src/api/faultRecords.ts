import { postJson } from '@/api/http'
import type { FaultRecord, FaultRecordFilters, SearchResponse } from '@/types'

interface SearchRequest {
  project: string
  module: string
  reporter: string
  assignee: string
  status: string
  faultType: string
  trigger: string
  priority: string
  timeRange: string
  timeStart: string
  timeEnd: string
}

// 后端每个字段只接受单个值；前端是多选数组，取第一个非“全部”的选项
function firstNonAll(values: string[]): string {
  return values.find((v) => v && v !== '全部') ?? ''
}

export async function fetchFaultRecords(filters: FaultRecordFilters): Promise<FaultRecord[]> {
  const body: SearchRequest = {
    project: filters.project,
    module: firstNonAll(filters.modules),
    reporter: firstNonAll(filters.reporters),
    assignee: firstNonAll(filters.assignees),
    status: firstNonAll(filters.statuses),
    faultType: firstNonAll(filters.faultTypes),
    trigger: firstNonAll(filters.triggers),
    priority: firstNonAll(filters.priorities),
    timeRange: filters.timeRange,
    timeStart: '',
    timeEnd: '',
  }

  const data = await postJson<SearchResponse>('/api/v1/issues/search', body)
  return data.rows.map((row) => ({
    id: row.key ?? row.id,
    key: row.key,
    url: row.url,
    summary: row.summary,
    module: row.module,
    reporter: row.reporter,
    assignee: row.assignee,
    status: row.status,
    faultType: row.faultType,
    trigger: row.trigger,
    priority: row.priority,
    created: row.created,
  }))
}
