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
  columns: 2 | 3
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
