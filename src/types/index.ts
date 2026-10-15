import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type HealthStatus = 'normal' | 'warning' | 'risk' | 'done'

export interface Project {
  id: string
  name: string
  owner: string
  stage: string
  plannedProgress: number
  actualProgress: number
  nextMilestone: string
  health: HealthStatus
}

export interface RiskItem {
  id: string
  project: string
  issue: string
  level: 'high' | 'medium'
}

export interface NavSubItem {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface NavItem {
  id: string
  title: string
  items: NavSubItem[]
}

export interface MetricCardData {
  id: string
  label: string
  value: string
  sublabel: string
  icon: LucideIcon
  trend: number[]
  trendColor?: 'primary' | 'success' | 'warning' | 'danger'
}

export interface TableColumn<T> {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  render?: (row: T) => ReactNode
}

export interface FocusProject {
  id: string
  name: string
  progress: number
  owner: string
  jiraUrl: string
  confluenceUrl: string
  health: HealthStatus
}

export interface JiraProject {
  key: string
  name: string
  category: string
  lead: string
}

export interface ProjectListItem {
  name: string
  lead: string
  confluencePage: string | null
}

export interface StaffLoadRow {
  id: string
  name: string
  role: string
  project: string
  allocation: number
  status: 'normal' | 'overload'
}

export interface TrendSeries {
  key: string
  name: string
  color: string
}

export interface FieldOptionsData {
  modules: string[]
  reporters: string[]
  assignees: string[]
  statuses: string[]
  faultTypes: string[]
  triggers: string[]
  priorities: string[]
  timeRanges: string[]
}

export interface FaultRecord {
  id: string
  key?: string
  url?: string
  summary: string
  module?: string
  reporter: string
  assignee: string
  status: string
  faultType?: string
  trigger?: string
  priority: string
  created?: string
}

export interface SearchResponse {
  total: number
  fetched: number
  jql: string
  rows: FaultRecord[]
}

export interface FaultRecordFilters {
  project: string
  modules: string[]
  reporters: string[]
  assignees: string[]
  statuses: string[]
  faultTypes: string[]
  triggers: string[]
  priorities: string[]
  timeRange: string
}

export interface ConfluenceSpace {
  key: string
  name: string
}

export interface ConfluenceFieldOptions {
  authors: string[]
  createTimeRanges: string[]
  updateTimeRanges: string[]
}

export interface ConfluenceSearchRequest {
  space: string
  author: string
  createTimeRange: string
  updateTimeRange: string
}

export interface ConfluenceRow {
  spaceKey: string
  spaceName: string
  id: string
  title: string
  url: string
  author: string
  created: string
  updated: string
}

export interface ConfluenceSearchResponse {
  cql: string
  fetched: number
  rows: ConfluenceRow[]
}

export interface WeeklyReportPerson {
  name: string
  user_id?: string
}

export interface WeeklyReportProgressItem {
  id: string
  title: string
  description?: string
  status?: string
  progress_percent?: number
  owners?: WeeklyReportPerson[]
  related_issue_keys?: string[]
}

export interface WeeklyReportRisk {
  id: string
  title: string
  description?: string
  level?: string
  status?: string
  impact?: string
  mitigation?: string
  owners?: WeeklyReportPerson[]
  related_issue_keys?: string[]
}

export interface WeeklyReportBlocker {
  id: string
  title: string
  description?: string
  status?: string
  impact?: string
  expected_resolve_date?: string
  owners?: WeeklyReportPerson[]
}

export interface WeeklyReportMilestone {
  id: string
  title: string
  target_date?: string
  status?: string
  progress_percent?: number
}

export interface WeeklyReportNextAction {
  id: string
  title: string
  description?: string
  due_date?: string
  status?: string
  owners?: WeeklyReportPerson[]
}

export interface WeeklyReportGoal {
  id: string
  title: string
  description?: string
  target_date?: string
  status?: string
}

export interface WeeklyReport {
  report_id?: string
  source?: {
    page_id?: string
    page_title?: string
    page_url?: string
    space_key?: string
    created_by?: string
    created_at?: string
    updated_at?: string
  }
  project?: {
    project_id?: string
    project_name?: string
    project_group?: string
    owner?: WeeklyReportPerson
  }
  report_period?: {
    year?: number
    week?: number
    start_date?: string
    end_date?: string
  }
  status?: {
    reported_status?: string
    normalized_status?: string
    reason?: string
  }
  summary?: string
  goals?: WeeklyReportGoal[]
  progress?: WeeklyReportProgressItem[]
  risks?: WeeklyReportRisk[]
  blockers?: WeeklyReportBlocker[]
  milestones?: WeeklyReportMilestone[]
  next_actions?: WeeklyReportNextAction[]
}

export interface WeeklySummaryProjectGroup {
  projectName: string
  reports: WeeklyReport[]
}

export interface WeeklySummaryFailedPage {
  pageId: string
  title: string
  reason: string
}

export interface WeeklySummaryResponse {
  projects: WeeklySummaryProjectGroup[]
  failures: WeeklySummaryFailedPage[]
}

export interface SyncResponse {
  updatedProjects: string[]
  newPageCount: number
  changedPageCount: number
  unchangedPageCount: number
  failures: WeeklySummaryFailedPage[]
}

export interface TimelineTask {
  id: number
  title: string
  projectId: number
  projectName: string
  done: boolean
  startDate: string | null
  endDate: string | null
  dueDate: string | null
  priority: number | null
  percentDone: number | null
  hexColor: string | null
  owner: string | null
}

export interface TimelineTaskUpsertPayload {
  projectName: string
  title: string
  startDate: string | null
  dueDate: string | null
  priority: number | null
  percentDone: number | null
  hexColor: string | null
  owner: string | null
}

export interface GenericPageConfig {
  id: string
  title: string
  description: string
  icon: LucideIcon
  kpis: MetricCardData[]
  trendTitle: string
  trendData: Array<Record<string, string | number>>
  trendSeries: TrendSeries[]
  tableTitle: string
  tableColumns: TableColumn<Record<string, any>>[]
  tableRows: Record<string, any>[]
}

