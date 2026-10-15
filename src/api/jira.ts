import { getJson } from '@/api/http'
import type { JiraProject } from '@/types'

export function fetchJiraProjects(): Promise<JiraProject[]> {
  return getJson<JiraProject[]>('/api/v1/jira/projects')
}
