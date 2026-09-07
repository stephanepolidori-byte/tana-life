// Tana Life — server minimale (Node 18+, nessuna dipendenza)
// Serve la web app, salva le partite su disco e fa da ponte verso l'AI (OpenAI/Anthropic).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const SAVE_DIR = path.join(ROOT, 'saves');
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);

let settings = { provider: 'auto', geminiKey: process.env.GEMINI_API_KEY || '', groqKey: process.env.GROQ_API_KEY || '', openaiKey: process.env.OPENAI_API_KEY || '', anthropicKey: process.env.ANTHROPIC_API_KEY || '', model: '' };
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
function providers() {
  const all = [['gemini', settings.geminiKey], ['groq', settings.groqKey], ['openai', settings.openaiKey], ['anthropic', settings.anthropicKey]].filter(x => x[1]).map(x => x[0]);
  if (settings.provider && settings.provider !== 'auto') return all.includes(settings.provider) ? [settings.provider, ...all.filter(p => p !== settings.provider)] : all;
  return all; // auto: prima i gratuiti (Gemini, Groq), poi gli altri
}
function activeProvider() { return providers()[0] || 'none'; }
let geminiCache = null, geminiGood = null;
async function geminiModels() {
  if (geminiCache && geminiCache.t > Date.now() - 6 * 3600e3) return geminiGood ? [geminiGood, ...geminiCache.list.filter(m => m !== geminiGood)] : geminiCache.list;
  const fallback = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-2.0-flash'];
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${settings.geminiKey}`);
    const j = await r.json();
    const names = (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => m.name.replace(/^models\//, ''));
    const score = n => (/flash/i.test(n) ? 100 : /pro/i.test(n) ? 50 : 0) + (/lite/i.test(n) ? -5 : 0) - (/preview|exp|thinking|tts|image|audio|live|embedding/i.test(n) ? 60 : 0) + parseFloat((n.match(/(\d+(?:\.\d+)?)/) || [0, 0])[1]) * 3;
    const list = names.filter(n => !/embedding|tts|image|audio|live|aqa/i.test(n)).sort((a, b) => score(b) - score(a));
    if (list.length) { geminiCache = { t: Date.now(), list: [...new Set([...list.slice(0, 6), ...fallback])] }; return geminiCache.list; }
  } catch (e) { console.warn('ListModels Gemini:', e.message); }
  return fallback;
}
const cooldown = {}; // provider -> timestamp fino a cui è in pausa (rate limit)
async function callProvider(p, system, messages) {
  if (p === 'gemini') {
    // Il modello viene scoperto automaticamente da ListModels (Google ritira i vecchi nomi): preferisce i "flash" più recenti.
    const models = settings.provider === 'gemini' && settings.model ? [settings.model] : await geminiModels();
    let lastErr = null;
    for (const model of models) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), generationConfig: { maxOutputTokens: 350, temperature: 0.9 }, safetySettings: ['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT'].map(c => ({ category: c, threshold: 'BLOCK_ONLY_HIGH' })) })
      });
      const j = await r.json();
      if (r.ok) { geminiGood = model; return (j.candidates?.[0]?.content?.parts || []).map(x => x.text || '').join('').trim(); }
      lastErr = new Error(j.error?.message || 'Gemini error'); lastErr.status = r.status;
      if (r.status === 404 || /no longer available|not found|not supported/i.test(lastErr.message)) { geminiCache = null; geminiGood = null; continue; } // modello ritirato: prova il prossimo
      if (r.status === 429 || r.status === 503) { geminiGood = null; continue; } // sovraccarico/quota: prova un altro modello
      throw lastErr;
    }
    throw lastErr || new Error('Nessun modello Gemini disponibile');
  }
  if (p === 'groq') {
    const model = (settings.provider === 'groq' && settings.model) || 'llama-3.3-70b-versatile';
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + settings.groqKey },
      body: JSON.stringify({ model, max_tokens: 350, temperature: 0.9, messages: [{ role: 'system', content: system }, ...messages] })
    });
    const j = await r.json();
    if (!r.ok) { const e = new Error(j.error?.message || 'Groq error'); e.status = r.status; throw e; }
    return j.choices[0].message.content.trim();
  }
  if (p === 'openai') {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + settings.openaiKey },
      body: JSON.stringify({ model: (settings.provider === 'openai' && settings.model) || 'gpt-4o-mini', max_tokens: 350, temperature: 0.9, messages: [{ role: 'system', content: system }, ...messages] })
    });
    const j = await r.json();
    if (!r.ok) { const e = new Error(j.error?.message || 'OpenAI error'); e.status = r.status; throw e; }
    return j.choices[0].message.content.trim();
  }
  if (p === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': settings.anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: (settings.provider === 'anthropic' && settings.model) || 'claude-3-5-haiku-latest', max_tokens: 350, system, messages })
    });
    const j = await r.json();
    if (!r.ok) { const e = new Error(j.error?.message || 'Anthropic error'); e.status = r.status; throw e; }
    return j.content.map(c => c.text || '').join('').trim();
  }
  return null;
}
// Prova i provider in ordine; se uno è in rate limit (429) o in errore, passa al successivo.
async function askAI(system, messages) {
  const now = Date.now(); let lastErr = null, used = 'none';
  for (const p of providers()) {
    if (cooldown[p] && cooldown[p] > now) continue;
    try { const t = await callProvider(p, system, messages); if (t) { used = p; return { text: t, ai: p }; } }
    catch (e) { lastErr = e; if (e.status === 429 || e.status === 503) cooldown[p] = now + 60 * 1000; console.warn('AI', p, e.message); }
  }
  return { text: null, ai: 'none', error: lastErr && lastErr.message };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') return json(res, 200, {});
  try {
    if (url.pathname === '/api/health') return json(res, 200, { ok: true, ai: activeProvider(), model: geminiGood || null });

    if (url.pathname === '/api/settings' && req.method === 'GET')
      return json(res, 200, { provider: settings.provider, model: settings.model, hasGemini: !!settings.geminiKey, hasGroq: !!settings.groqKey, hasOpenai: !!settings.openaiKey, hasAnthropic: !!settings.anthropicKey, active: activeProvider() });
    if (url.pathname === '/api/settings' && req.method === 'POST') {
      const b = await body(req);
      if (process.env.ADMIN_KEY && b.adminKey !== process.env.ADMIN_KEY) return json(res, 403, { error: 'Chiave amministratore errata' });
      if (b.provider) settings.provider = b.provider;
      if (typeof b.model === 'string') settings.model = b.model;
      if (b.geminiKey !== undefined && b.geminiKey !== '••••') settings.geminiKey = b.geminiKey;
      if (b.groqKey !== undefined && b.groqKey !== '••••') settings.groqKey = b.groqKey;
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
      const out = await askAI(b.system, (b.messages || []).slice(-14));
      return json(res, 200, { text: out.text, ai: out.ai, error: out.error });
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
