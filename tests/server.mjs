import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.heic': 'image/heic' };
const posts = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, userId: 1, title: `HTTP post ${i + 1}`, body: 'Local HTTP data' }));

async function listen(handler) {
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

export async function startServers() {
  const requests = [];
  const api = await listen(async (req, res) => {
    const request = { method: req.method, url: req.url, headers: req.headers };
    requests.push(request);
    if (req.url === '/no-cors') {
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end('No CORS headers');
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(204).end();
      return;
    }
    let body = '';
    for await (const chunk of req) body += chunk;
    request.body = body;
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/posts/999999') {
      res.writeHead(404).end('{}');
    } else if (req.method === 'GET') {
      res.end(JSON.stringify(posts));
    } else if (req.method === 'POST') {
      res.writeHead(201).end(JSON.stringify({ id: 101, ...JSON.parse(body) }));
    } else if (req.method === 'PUT') {
      res.end(JSON.stringify(JSON.parse(body)));
    } else {
      res.end('{}');
    }
  });
  let site;
  try {
    site = await listen(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/favicon.ico') {
          res.writeHead(204).end();
          return;
        }
        const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
        if (!path.startsWith(root + sep) || url.pathname.includes('/.')) {
          res.writeHead(403).end();
          return;
        }
        let body = await readFile(path);
        if (url.pathname === '/fetch-api/index.html' && !url.searchParams.has('live')) {
          // Substitute only destinations; all demo event handlers and Fetch calls remain unchanged.
          body = body.toString().replace('https://jsonplaceholder.typicode.com', api.origin)
            .replace('https://jsonplaceholder.typicode.com', api.origin)
            .replace('https://www.example.com', `${api.origin}/no-cors`);
        }
        const extension = path.slice(path.lastIndexOf('.'));
        res.writeHead(200, { 'Content-Type': mime[extension] || 'application/octet-stream' }).end(body);
      } catch (error) {
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
          res.writeHead(404).end();
        } else {
          console.error('Browser test server failed:', error);
          res.writeHead(500).end();
        }
      }
    });
  } catch (error) {
    await new Promise(resolve => api.server.close(resolve));
    throw error;
  }
  return {
    origin: site.origin,
    requests,
    close: () => Promise.all([site, api].map(({ server }) => new Promise(resolve => {
      server.close(resolve);
      server.closeAllConnections();
    }))),
  };
}
