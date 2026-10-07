import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServers } from './server.mjs';

let browser;
let servers;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN });
  try { servers = await startServers(); }
  catch (error) { await browser.close(); throw error; }
});
after(async () => {
  await browser?.close();
  await servers?.close();
});

async function open(t, path, allowedConsoleErrors = []) {
  const context = await browser.newContext();
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = [];
  const consoleErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  t.after(() => {
    assert.deepEqual(errors, [], 'no uncaught browser exceptions');
    assert.deepEqual(consoleErrors.filter(error => !allowedConsoleErrors.some(pattern => pattern.test(error))), [],
      'no unexpected console errors');
  });
  await page.goto(`${servers.origin}/${path}`);
  return page;
}

async function waitStatus(page, section, expected) {
  await page.waitForFunction(({ section, expected }) =>
    document.getElementById(`${section}-status`).textContent.includes(expected), { section, expected });
  return page.locator(`#${section}-status`).innerText();
}

test('DOM: editing, adding/removing, delegation, event phases, classes, form and observers', async t => {
  const page = await open(t, 'dom-manipulation/index.html');
  await page.locator('#select-btn').click();
  assert.equal(await page.locator('#demo-text').innerText(), '文字已被 JavaScript 修改！');
  await page.locator('#add-btn').click();
  assert.equal(await page.locator('#list-area .box').count(), 1);
  await page.waitForFunction(() => document.querySelector('#mutation-log').textContent.includes('新增 1 / 刪除 0'));
  await page.locator('#list-area button').click();
  assert.equal(await page.locator('#list-area .box').count(), 0);
  await page.waitForFunction(() => document.querySelector('#mutation-log').textContent.includes('新增 0 / 刪除 1'));
  await page.locator('#delegate-list .remove').first().click();
  assert.equal(await page.locator('#delegate-list li').count(), 1);
  await page.locator('#inner').click();
  assert.equal(await page.locator('#phase-log').innerText(), 'outer (capture) → inner (target) → outer (bubble)');
  await page.locator('#toggle-btn').click();
  assert.match(await page.locator('#cls-box').getAttribute('class'), /highlight/);
  await page.locator('#toggle-btn').click();
  assert.doesNotMatch(await page.locator('#cls-box').getAttribute('class'), /highlight/);
  await page.locator('#signup-form button').click();
  assert.equal(await page.locator('#form-msg').innerText(), '請輸入姓名');
  await page.locator('#name-input').fill('Ian');
  await page.locator('#email-input').fill('a@b');
  await page.locator('#signup-form button').click();
  assert.equal(await page.locator('#form-msg').innerText(), 'Email 格式不正確');
  await page.locator('#email-input').fill('ian@example.test');
  await page.locator('#signup-form button').click();
  assert.equal(await page.locator('#form-msg').innerText(), '送出成功！歡迎 Ian（ian@example.test）');
  for (const box of await page.locator('#io-targets .box').all()) {
    await box.scrollIntoViewIfNeeded();
    await page.waitForFunction(index => document.querySelector(`[data-index="${index}"]`).classList.contains('highlight'),
      await box.getAttribute('data-index'));
    assert.match(await box.innerText(), /已進入視窗/);
  }
  await page.locator('#add-observer-btn').click();
  assert.equal(await page.locator('#list-area .box').count(), 1);
  assert.match(await page.locator('#mutation-log').innerText(), /新增 1 \/ 刪除 0/);
});

async function exerciseCrud(page, offline) {
  for (const [section, status] of [['get', 'HTTP 200'], ['post', 'HTTP 201'], ['put', 'HTTP 200'], ['delete', 'HTTP 200']]) {
    await page.locator(`#${section}-btn`).click();
    const text = await waitStatus(page, section, status);
    assert.equal(text.includes('〔離線〕'), offline);
  }
  const posts = JSON.parse(await page.locator('#get-result').innerText());
  assert.equal(posts.length, 5);
  assert.equal(posts[0].id, 1);
  assert.equal(JSON.parse(await page.locator('#post-result').innerText()).id, 101);
  assert.equal(JSON.parse(await page.locator('#put-result').innerText()).title, '已更新的標題');
  assert.deepEqual(JSON.parse(await page.locator('#delete-result').innerText()), {});
  await page.locator('#error-btn').click();
  assert.match(await waitStatus(page, 'error', 'HTTP 404'), /找不到資源/);
  assert.match(await page.locator('#error-result').innerText(), /res.ok/);
}

test('Fetch online path: real local cross-origin HTTP CRUD, JSON headers, preflight and 404', async t => {
  const page = await open(t, 'fetch-api/index.html', [/404 \((?:Not Found)?\)/]);
  const start = servers.requests.length;
  await exerciseCrud(page, false);
  const requests = servers.requests.slice(start);
  const post = requests.find(request => request.method === 'POST');
  assert.equal(post.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(post.body), { title: '我的新文章', body: '這是文章內容', userId: 1 });
  assert.ok(requests.some(request => request.method === 'OPTIONS'));
  assert.ok(requests.some(request => request.method === 'PUT'));
  assert.ok(requests.some(request => request.method === 'DELETE'));
});

test('Fetch offline mode: CRUD and HTTP error demonstration with browser network disabled', async t => {
  const page = await open(t, 'fetch-api/index.html');
  await page.locator('#offline-toggle').check();
  const start = servers.requests.length;
  await page.context().setOffline(true);
  await exerciseCrud(page, true);
  assert.equal(servers.requests.length, start);
});

test('Fetch transport errors are caught without uncaught exceptions', async t => {
  const page = await open(t, 'fetch-api/index.html', [/ERR_INTERNET_DISCONNECTED/]);
  await page.context().setOffline(true);
  for (const section of ['get', 'post', 'put', 'delete', 'error']) {
    await page.locator(`#${section}-btn`).click();
    assert.match(await waitStatus(page, section, '❌'), /Failed to fetch/);
    assert.match(await page.locator(`#${section}-status`).getAttribute('class'), /error/);
  }
});

test('AbortController: cancellation remains cancelled after the delay; completion and re-start work', async t => {
  const page = await open(t, 'fetch-api/index.html');
  await page.locator('#cancel-btn').click();
  await page.locator('#start-btn').click();
  await page.locator('#cancel-btn').click();
  await waitStatus(page, 'abort', '請求已取消');
  await page.waitForTimeout(2100);
  assert.equal(await page.locator('#abort-status').innerText(), '🛑 請求已取消');
  await page.locator('#start-btn').click();
  await waitStatus(page, 'abort', '模擬請求完成');
  await page.locator('#cancel-btn').click();
  assert.match(await page.locator('#abort-status').innerText(), /模擬請求完成/);
});

test('CORS: a real HTTP 200 without ACAO is rejected by browser security (also in demo offline mode)', async t => {
  const page = await open(t, 'fetch-api/index.html', [/CORS policy/, /ERR_FAILED/]);
  const messages = [];
  page.on('console', message => messages.push(message.text()));
  for (const offline of [false, true]) {
    await page.locator('#offline-toggle').setChecked(offline);
    await page.locator('#cors-btn').click();
    await waitStatus(page, 'cors', '請求被瀏覽器擋下');
  }
  assert.ok(messages.some(message => /CORS policy/.test(message)), 'must be CORS, not just a generic network failure');
  assert.ok(servers.requests.some(request => request.url === '/no-cors'));
});

test('HEIC: actual vendor/worker conversion produces a decodable JPEG with expected dimensions and pixels', async t => {
  const page = await open(t, 'image-processing/heic2any/index.html');
  await page.locator('#fileInput').setInputFiles(fileURLToPath(new URL('./fixtures/generated.heic', import.meta.url)));
  await page.waitForFunction(() => document.querySelector('#status').textContent === '轉換成功！', null, { timeout: 30000 });
  const image = await page.evaluate(async () => {
    const img = document.querySelector('#showImage');
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    return {
      width: img.naturalWidth, height: img.naturalHeight,
      jpeg: img.src.startsWith('data:image/jpeg;base64,'),
      pixel: [...context.getImageData(4, 4, 1, 1).data],
    };
  });
  assert.equal(image.width, 32);
  assert.equal(image.height, 24);
  assert.equal(image.jpeg, true);
  assert.ok(Math.abs(image.pixel[0] - 220) < 25 && Math.abs(image.pixel[1] - 180) < 25 && Math.abs(image.pixel[2] - 100) < 25);
  assert.equal(await page.locator('#showImage').isVisible(), true);
  await page.locator('#fileInput').setInputFiles({ name: 'not-heic.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  assert.equal(await page.locator('#error-msg').innerText(), '請選擇 .heic 格式的圖片檔案。');
  assert.equal(await page.locator('#status').innerText(), '');
  assert.equal(await page.locator('#showImage').isVisible(), false);
});

test('HEIC: corrupt input reports a controlled conversion failure', async t => {
  const page = await open(t, 'image-processing/heic2any/index.html', [/heic2any conversion error:/]);
  await page.locator('#fileInput').setInputFiles({ name: 'corrupt.heic', mimeType: 'image/heic', buffer: Buffer.from('not HEIC') });
  await page.waitForFunction(() => document.querySelector('#error-msg').textContent.startsWith('轉換失敗：'));
  assert.equal(await page.locator('#status').innerText(), '');
  assert.equal(await page.locator('#showImage').isVisible(), false);
});

test('live JSONPlaceholder CRUD and real public CORS demonstration', { skip: !process.env.LIVE_NETWORK }, async t => {
  const page = await open(t, 'fetch-api/index.html?live', [/404 \((?:Not Found)?\)/, /CORS policy/, /ERR_FAILED/]);
  await exerciseCrud(page, false);
  const messages = [];
  page.on('console', message => messages.push(message.text()));
  await page.locator('#cors-btn').click();
  await waitStatus(page, 'cors', '請求被瀏覽器擋下');
  assert.ok(messages.some(message => /CORS policy/.test(message)), 'public endpoint must fail specifically due to CORS');
});
