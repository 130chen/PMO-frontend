import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, 'dist')
const port = Number(process.env.PORT || 8080)
const host = process.env.HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname)
    if (urlPath === '/') urlPath = '/index.html'

    const filePath = normalize(join(root, urlPath))
    if (!filePath.startsWith(root)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    let target = filePath
    try {
      const info = await stat(target)
      if (info.isDirectory()) target = join(target, 'index.html')
    } catch {
      target = join(root, 'index.html')
    }

    const data = await readFile(target)
    const ext = extname(target)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(500)
    res.end('Internal Server Error')
  }
})

server.listen(port, host, () => {
  console.log(`PMO frontend serving ${root} at http://${host}:${port}`)
  console.log(`Access from LAN e.g. http://10.11.19.62:${port}/ or http://10.11.16.153:${port}/`)
})
