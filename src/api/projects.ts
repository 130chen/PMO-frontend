import { getJson } from '@/api/http'

export async function fetchProjects(): Promise<string[]> {
  const data = await getJson<string[] | { projects: string[] }>('/api/v1/projects')
  return Array.isArray(data) ? data : data.projects ?? []
}
