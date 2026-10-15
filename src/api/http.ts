const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || ''

function resolveUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${BASE_URL}${path}`
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(resolveUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : null
    const message = body?.message || body?.error
    throw new Error(message ? `${message}（HTTP ${res.status}）` : `请求失败（HTTP ${res.status}），请求地址 ${path}`)
  }
  if (!isJson) {
    throw new Error(`接口未返回 JSON（HTTP ${res.status}），请确认后端服务已启动且请求地址 ${path} 正确`)
  }
  return (await res.json()) as T
}

export function getJson<T>(path: string): Promise<T> {
  return requestJson<T>(path)
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function postVoid(path: string, body: unknown): Promise<void> {
  const res = await fetch(resolveUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const contentType = res.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')
    const responseBody = isJson ? await res.json().catch(() => null) : null
    const message = responseBody?.message || responseBody?.error
    throw new Error(message ? `${message}（HTTP ${res.status}）` : `请求失败（HTTP ${res.status}），请求地址 ${path}`)
  }
}
