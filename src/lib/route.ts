export interface HashRoute {
  pageId: string
  param: string | null
}

export function parseHash(): HashRoute {
  const raw = window.location.hash.replace(/^#\/?/, '')
  if (!raw) return { pageId: 'overview', param: null }
  const [pageId, param] = raw.split('/')
  return { pageId: pageId || 'overview', param: param ? decodeURIComponent(param) : null }
}

export function setHash(pageId: string, param?: string | null): void {
  const path = param ? `/${pageId}/${encodeURIComponent(param)}` : `/${pageId}`
  if (window.location.hash !== `#${path}`) {
    window.location.hash = path
  }
}
