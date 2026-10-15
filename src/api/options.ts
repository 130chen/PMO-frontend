import { getJson } from '@/api/http'
import type { FieldOptionsData } from '@/types'

export async function fetchOptions(project: string): Promise<FieldOptionsData> {
  return getJson<FieldOptionsData>(`/api/v1/options?project=${encodeURIComponent(project)}`)
}
