import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createWebsiteServer } from '../server.mjs';

let server;
let port;
before(async () => {
  server = await createWebsiteServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });
const request = (path, method = 'GET') => new Promise((resolve, reject) => {
  const req = http.request({hostname: '127.0.0.1', port, path, method}, res => {
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => resolve({status:res.statusCode, headers:res.headers, body:Buffer.concat(chunks)}));
  });
  req.on('error', reject);
  req.end();
});

test('serves the homepage and referenced assets with correct content types', async () => {
  const home = await request('/');
  assert.equal(home.status, 200);
  assert.match(home.body.toString(), /Liu Lab · 刘黔伟实验室/);
  for (const [path, type] of [
    ['/lab-assets/styles.css','text/css'], ['/lab-assets/content.js','text/javascript'],
    ['/lab-assets/main.js','text/javascript'], ['/lab-assets/hematopoietic-cells-hero.png','image/png'],
    ['/lab-assets/qianwei-liu.jpg','image/jpeg']
  ]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers['content-type'].startsWith(type), path);
    assert.equal(Number(response.headers['content-length']), response.body.length);
  }
});
test('HEAD returns GET metadata without a response body', async () => {
  const head = await request('/', 'HEAD');
  const get = await request('/');
  assert.equal(head.status, 200);
  assert.equal(head.body.length, 0);
  assert.equal(head.headers['content-length'], get.headers['content-length']);
});
test('does not expose repository files or directory listings', async () => {
  for (const path of ['/README.md', '/server.mjs', '/.git/config', '/lab-assets/', '/lab-assets/../../README.md', '/lab-assets/%2e%2e/%2e%2e/README.md', '/lab-assets/%5c..%5cREADME.md', '/lab-assets/missing.png']) {
    assert.equal((await request(path)).status, 404, path);
  }
});
test('rejects malformed URLs and unsupported methods', async () => {
  assert.equal((await request('/lab-assets/%zz')).status, 400);
  const post = await request('/', 'POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers.allow, 'GET, HEAD');
});
test('binds only to loopback and allows query strings for cache refresh', async () => {
  assert.equal(server.address().address, '127.0.0.1');
  assert.equal((await request('/?check=deployment')).status, 200);
  assert.equal((await request('/lab-assets/content.js?v=1')).status, 200);
});
