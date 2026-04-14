#!/usr/bin/env node
/**
 * 雪梨经营管理看板 — 本地服务
 * 
 * 功能：
 * 1. 静态文件服务（serve HTML/JS/CSS）
 * 2. /api/sync — 从 data/mgmt-data.json 重新注入数据到 HTML
 * 3. /api/status — 返回数据版本时间 + 上次同步时间
 * 
 * 用法：node serve.js [--port 8742]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--port') || '8742');
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'mgmt-data.json');
const HTML_FILE = path.join(ROOT, 'v2-full.html');
const INDEX_FILE = path.join(ROOT, 'index.html');
const SYNC_LOG = path.join(ROOT, 'data', '.sync-meta.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

let syncing = false;

function readSyncMeta() {
  try { return JSON.parse(fs.readFileSync(SYNC_LOG, 'utf8')); }
  catch { return { lastSync: null, lastResult: null, lastError: null }; }
}

function writeSyncMeta(meta) {
  fs.writeFileSync(SYNC_LOG, JSON.stringify(meta, null, 2));
}

function getDataVersion() {
  try { return fs.statSync(DATA_FILE).mtime.toISOString(); }
  catch { return null; }
}

function getHtmlVersion() {
  try { return fs.statSync(HTML_FILE).mtime.toISOString(); }
  catch { return null; }
}

async function doSync() {
  if (syncing) throw new Error('同步正在进行中');
  syncing = true;
  const startTime = new Date().toISOString();
  const steps = [];

  try {
    // Step 1: 读取新数据
    steps.push('读取数据文件...');
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('数据文件不存在: ' + DATA_FILE);
    }
    const newData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    steps.push('✓ 数据读取完成 (' + Object.keys(newData).length + ' 个字段)');

    // Step 2: 读取 HTML 并替换数据块
    steps.push('注入数据到 HTML...');
    let html = fs.readFileSync(HTML_FILE, 'utf8');
    
    // 匹配 const D={...}; 数据块并替换
    const dataPattern = /const D=\{[\s\S]*?\};/;
    if (!dataPattern.test(html)) {
      throw new Error('HTML 中未找到 const D={...}; 数据块');
    }
    
    const newDataStr = 'const D=' + JSON.stringify(newData) + ';';
    html = html.replace(dataPattern, newDataStr);
    steps.push('✓ 数据注入完成');

    // Step 3: 写回文件
    steps.push('写入文件...');
    fs.writeFileSync(HTML_FILE, html);
    fs.copyFileSync(HTML_FILE, INDEX_FILE);
    steps.push('✓ v2-full.html + index.html 已更新');

    const meta = {
      lastSync: startTime,
      lastResult: 'success',
      lastError: null,
      dataVersion: getDataVersion(),
      htmlVersion: getHtmlVersion(),
      steps,
    };
    writeSyncMeta(meta);
    return meta;
  } catch (err) {
    const meta = {
      lastSync: startTime,
      lastResult: 'error',
      lastError: err.message,
      dataVersion: getDataVersion(),
      htmlVersion: getHtmlVersion(),
      steps,
    };
    writeSyncMeta(meta);
    throw err;
  } finally {
    syncing = false;
  }
}

function sendJSON(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
  });
  res.end(JSON.stringify(data));
}

function serveStatic(res, urlPath) {
  let filePath = urlPath === '/' ? '/v2-full.html' : urlPath;
  const full = path.join(ROOT, filePath);
  if (!full.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  const ext = path.extname(full);
  const mime = MIME[ext] || 'application/octet-stream';
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'max-age=3600',
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (url.pathname === '/api/status') {
    const meta = readSyncMeta();
    sendJSON(res, 200, {
      syncing,
      dataVersion: getDataVersion(),
      htmlVersion: getHtmlVersion(),
      lastSync: meta.lastSync,
      lastResult: meta.lastResult,
      lastError: meta.lastError,
    });
    return;
  }

  if (url.pathname === '/api/sync' && req.method === 'POST') {
    try {
      const result = await doSync();
      sendJSON(res, 200, { ok: true, ...result });
    } catch (err) {
      sendJSON(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  serveStatic(res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`\n  🚀 雪梨经营管理看板`);
  console.log(`  ├─ 地址: http://localhost:${PORT}/`);
  console.log(`  ├─ 同步: POST http://localhost:${PORT}/api/sync`);
  console.log(`  ├─ 状态: GET  http://localhost:${PORT}/api/status`);
  console.log(`  └─ 数据: ${DATA_FILE}\n`);
});
