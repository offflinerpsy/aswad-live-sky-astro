import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
let port = (process.argv[2] && Number(process.argv[2])) || (process.env.PORT ? Number(process.env.PORT) : 4020);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function send(res, status, content, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(content);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return send(res, 404, 'Not Found');
      return send(res, 500, 'Server Error');
    }
    send(res, 200, data, { 'Content-Type': type });
  });
}

const server = http.createServer((req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(reqUrl.pathname);

    // Normalize and prevent path traversal
    if (pathname.includes('..')) return send(res, 400, 'Bad Request');

    // default file
    let filePath = path.join(distDir, pathname);
    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (path.extname(filePath) === '' && !filePath.endsWith('.html')) {
        // route without extension -> try index.html
        filePath = path.join(distDir, pathname, 'index.html');
      }

      fs.access(filePath, fs.constants.R_OK, (accErr) => {
        if (accErr) {
          // SPA-style fallback to root index.html
          return serveFile(res, path.join(distDir, 'index.html'));
        }
        return serveFile(res, filePath);
      });
    });
  } catch (e) {
    return send(res, 500, 'Server Error');
  }
});

function listen(p){
  server.listen(p, '0.0.0.0', () => {
    console.log(`Simple preview running:`);
    console.log(`  • http://127.0.0.1:${p}/`);
    console.log(`  • http://localhost:${p}/`);
  }).on('error', (e) => {
    if (e && e.code === 'EADDRINUSE') {
      port += 1;
      listen(port);
    } else {
      console.error('Server error:', e);
      process.exit(1);
    }
  });
}

listen(port);
