// Tana Life — server minimale (Node 18+, nessuna dipendenza)
// Serve la web app, salva le partite su disco e fa da ponte verso l'AI (OpenAI/Anthropic).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const SAVE_DIR = path.join(ROOT, 'saves');
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);

let settings = { provider: 'auto', openaiKey: process.env.OPENAI_API_KEY || '', anthropicKey: process.env.ANTHROPIC_API_KEY || '', model: '' };
const SETTINGS_FILE = path.join(ROOT, 'settings.json');
try { settings = { ...settings, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) }; } catch {}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webm': 'video/webm', '.webp': 'image/webp' };

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}
function body(req) {
  return new Promise((ok, ko) => { let d = ''; req.on('data', c => { d += c; if (d.length > 5e6) req.destroy(); }); req.on('end', () => { try { ok(d ? JSON.parse(d) : {}); } catch (e) { ko(e); } }); });
}
function safeId(s) { return String(s || 'default').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 40) || 'DEFAULT'; }

// ---------- AI ----------
function activeProvider() {
  if (settings.provider === 'openai' && settings.openaiKey) return 'openai';
  if (settings.provider === 'anthropic' && settings.anthropicKey) return 'anthropic';
  if (settings.provider === 'auto') { if (settings.openaiKey) return 'openai'; if (settings.anthropicKey) return 'anthropic'; }
  return 'none';
}
async function askAI(system, messages) {
  const p = activeProvider();
  if (p === 'openai') {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + settings.openaiKey },
      body: JSON.stringify({ model: settings.model || 'gpt-4o-mini', max_tokens: 300, temperature: 0.9, messages: [{ role: 'system', content: system }, ...messages] })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || 'OpenAI error');
    return j.choices[0].message.content.trim();
  }
  if (p === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': settings.anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: settings.model || 'claude-3-5-haiku-latest', max_tokens: 300, system, messages })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || 'Anthropic error');
    return j.content.map(c => c.text || '').join('').trim();
  }
  return null; // nessuna AI: il client usa il motore interno
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') return json(res, 200, {});
  try {
    if (url.pathname === '/api/health') return json(res, 200, { ok: true, ai: activeProvider() });

    if (url.pathname === '/api/settings' && req.method === 'GET')
      return json(res, 200, { provider: settings.provider, model: settings.model, hasOpenai: !!settings.openaiKey, hasAnthropic: !!settings.anthropicKey, active: activeProvider() });
    if (url.pathname === '/api/settings' && req.method === 'POST') {
      const b = await body(req);
      if (process.env.ADMIN_KEY && b.adminKey !== process.env.ADMIN_KEY) return json(res, 403, { error: 'Chiave amministratore errata' });
      if (b.provider) settings.provider = b.provider;
      if (typeof b.model === 'string') settings.model = b.model;
      if (b.openaiKey !== undefined && b.openaiKey !== '••••') settings.openaiKey = b.openaiKey;
      if (b.anthropicKey !== undefined && b.anthropicKey !== '••••') settings.anthropicKey = b.anthropicKey;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return json(res, 200, { ok: true, active: activeProvider() });
    }

    if (url.pathname === '/api/save' && req.method === 'POST') {
      const b = await body(req);
      fs.writeFileSync(path.join(SAVE_DIR, safeId(b.slot) + '.json'), JSON.stringify(b.state));
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/delete' && req.method === 'POST') {
      const b = await body(req); const f = path.join(SAVE_DIR, safeId(b.slot) + '.json'); if (fs.existsSync(f)) fs.unlinkSync(f);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/load') {
      const f = path.join(SAVE_DIR, safeId(url.searchParams.get('slot')) + '.json');
      if (!fs.existsSync(f)) return json(res, 404, { error: 'no save' });
      return json(res, 200, { state: JSON.parse(fs.readFileSync(f, 'utf8')) });
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      const b = await body(req);
      const text = await askAI(b.system, b.messages);
      return json(res, 200, { text, ai: activeProvider() });
    }

    // static
    let p = url.pathname === '/' ? '/index.html' : url.pathname;
    if (p === '/fr' || p === '/fr/') p = '/fr/index.html';
    const file = path.join(ROOT, 'public', path.normalize(p));
    if (!file.startsWith(path.join(ROOT, 'public')) || !fs.existsSync(file)) { res.writeHead(404); return res.end('404'); }
    const type = MIME[path.extname(file)] || 'application/octet-stream'; const size = fs.statSync(file).size; const range = req.headers.range;
    if (range) { // Range requests: indispensabili per i video su iOS/Safari
      const m = /bytes=(\d*)-(\d*)/.exec(range); let start = m && m[1] ? parseInt(m[1]) : 0; let end = m && m[2] ? parseInt(m[2]) : size - 1; if (end >= size) end = size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});
server.listen(PORT, '0.0.0.0', () => console.log('Tana Life su http://0.0.0.0:' + PORT + ' — AI: ' + activeProvider()));
