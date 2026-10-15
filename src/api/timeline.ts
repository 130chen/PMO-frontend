import { getJson, postJson, postVoid } from '@/api/http'
import type { TimelineTask, TimelineTaskUpsertPayload } from '@/types'

export function fetchProjectTimeline(projectName?: string): Promise<TimelineTask[]> {
  const query = projectName ? `?projectName=${encodeURIComponent(projectName)}` : ''
  return getJson<TimelineTask[]>(`/api/v1/timeline/tasks${query}`)
}

export function updateTaskCompletion(taskId: number, complete: number): Promise<TimelineTask> {
  return postJson<TimelineTask>(`/api/v1/timeline/tasks/${taskId}/completion`, { complete })
}

export function createTimelineTask(payload: TimelineTaskUpsertPayload): Promise<TimelineTask> {
  return postJson<TimelineTask>('/api/v1/timeline/tasks', payload)
}

export function updateTimelineTask(taskId: number, payload: TimelineTaskUpsertPayload): Promise<TimelineTask> {
  return postJson<TimelineTask>(`/api/v1/timeline/tasks/${taskId}`, payload)
}

export function deleteTimelineTask(taskId: number): Promise<void> {
  return postVoid(`/api/v1/timeline/tasks/${taskId}/delete`, {})
}
