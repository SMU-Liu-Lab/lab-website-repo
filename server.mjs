import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = fileURLToPath(new URL('./dist/', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

export async function createWebsiteServer(directory = defaultRoot) {
  const root = await realpath(directory);
  return http.createServer(async (req, res) => {
    const reply = (status, message, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
      res.end(req.method === 'HEAD' ? undefined : message);
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      reply(405, 'Method not allowed', { Allow: 'GET, HEAD' });
      return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { reply(400, 'Bad request'); return; }
    if (pathname.includes('\\') || /[\u0000-\u001f]/.test(pathname) || pathname.split('/').some(s => s.startsWith('.'))) {
      reply(404, 'Not found'); return;
    }
    if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/lab-assets/')) {
      reply(404, 'Not found'); return;
    }
    try {
      const file = await realpath(resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`));
      if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) {
        reply(404, 'Not found'); return;
      }
      // Read before writing headers so read failures cannot yield partial 200 responses.
      const content = await readFile(file);
      res.writeHead(200, {
        'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': content.length,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code)) reply(404, 'Not found');
      else { console.error('Static file read failed:', error.code || error.name); reply(500, 'Internal server error'); }
    }
  });
}

export async function startWebsite(port = 8507) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
  const server = await createWebsiteServer();
  server.on('error', error => { console.error(`Liu Lab could not start: ${error.code || error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Liu Lab listening on http://127.0.0.1:${port}`));
  const stop = () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections?.();
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.once('SIGTERM', stop);
  process.once('SIGINT', stop);
  return server;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await startWebsite(Number(process.env.PORT ?? 8507));
}
