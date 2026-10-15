import { getJson, postJson } from '@/api/http'
import type {
  ConfluenceFieldOptions,
  ConfluenceSearchRequest,
  ConfluenceSearchResponse,
  ConfluenceSpace,
  SyncResponse,
  WeeklySummaryResponse,
} from '@/types'

export async function fetchConfluenceSpaces(): Promise<ConfluenceSpace[]> {
  const data = await getJson<ConfluenceSpace[] | string[] | { spaces: ConfluenceSpace[] | string[] }>(
    '/api/v1/confluence/spaces',
  )
  const list = Array.isArray(data) ? data : data.spaces ?? []
  return list.map((item) => (typeof item === 'string' ? { key: item, name: item } : item))
}

export function fetchConfluenceOptions(space: string): Promise<ConfluenceFieldOptions> {
  const params = new URLSearchParams({ space })
  return getJson<ConfluenceFieldOptions>(`/api/v1/confluence/options?${params.toString()}`)
}

export function fetchConfluenceSearch(request: ConfluenceSearchRequest): Promise<ConfluenceSearchResponse> {
  return postJson<ConfluenceSearchResponse>('/api/v1/confluence/search', request)
}

export function fetchWeeklySummary(space: string): Promise<WeeklySummaryResponse> {
  const params = new URLSearchParams({ space })
  return getJson<WeeklySummaryResponse>(`/api/v1/confluence/weekly-summary?${params.toString()}`)
}

export function syncWeeklySummary(request: ConfluenceSearchRequest): Promise<SyncResponse> {
  return postJson<SyncResponse>('/api/v1/confluence/weekly-summary/sync', request)
}
