import { getJson } from '@/api/http'
import type { JiraProject } from '@/types'

export interface HomeOverviewResponse {
  totalProjects: number
  projects: JiraProject[]
}

export function fetchHomeOverview(): Promise<HomeOverviewResponse> {
  return getJson<HomeOverviewResponse>('/api/v1/home-overview')
}
