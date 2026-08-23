// A static file server for the render check (node builtins only).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.md': 'text/markdown',
};

export function serveDir(root) {
  const rootAbs = resolve(root) + sep;
  const srv = createServer((req, res) => {
    let pathname, p;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      p = resolve(root, '.' + pathname);
    } catch { res.statusCode = 400; return res.end(); }
    if (pathname === '/') { res.setHeader('Content-Type', 'text/html'); return res.end('<!doctype html>'); }
    if (!p.startsWith(rootAbs) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end(); }
    res.setHeader('Content-Type', MIME[extname(p)] ?? 'application/octet-stream');
    res.end(readFileSync(p));
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port })));
}
