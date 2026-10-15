import { getJson } from '@/api/http'
import type { ProjectListItem } from '@/types'

export function fetchProjectList(): Promise<ProjectListItem[]> {
  return getJson<ProjectListItem[]>('/api/v1/project-list/projects')
}
