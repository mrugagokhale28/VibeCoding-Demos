// ============================================
// CLIENT INTEL AGENT - Server (Tavily only)
// 1. Replace YOUR_TAVILY_KEY below
// 2. Run: node server.js
// 3. Open: http://localhost:3000
// ============================================

const TAVILY_KEY = ''; // ← paste your Tavily key here

const http = require('http');
const https = require('https');

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Client Intel Agent — Powered by Tavily</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #080b0f; --surface: #0e1318; --border: #1a2230;
    --accent: #00e5ff; --text: #e8edf5; --muted: #4a5568; --success: #00ffaa;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0;
    background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }
  .container { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 60px 24px 80px; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 56px; animation: fadeDown 0.6s ease both; }
  .logo-eyebrow { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px; }
  .logo-title { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
  .logo-title span { color: var(--accent); }
  .tavily-badge { display: flex; align-items: center; gap: 8px; background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2); border-radius: 6px; padding: 8px 14px; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent); }
  .tavily-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.5s infinite; }
  .search-section { margin-bottom: 40px; animation: fadeDown 0.6s 0.1s ease both; }
  .search-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .search-row { display: flex; gap: 12px; }
  .search-input { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px 18px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .search-input::placeholder { color: var(--muted); font-weight: 400; }
  .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,255,0.08); }
  .search-btn { background: var(--accent); color: #000; border: none; border-radius: 8px; padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.05em; cursor: pointer; transition: transform 0.15s, opacity 0.15s; white-space: nowrap; }
  .search-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .search-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .quick-picks { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .quick-pick { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); border: 1px solid var(--border); border-radius: 4px; padding: 4px 10px; cursor: pointer; transition: color 0.15s, border-color 0.15s; }
  .quick-pick:hover { color: var(--accent); border-color: var(--accent); }
  .loading { display: none; align-items: center; gap: 16px; padding: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 24px; }
  .loading.active { display: flex; }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  .loading-steps { display: flex; flex-direction: column; gap: 4px; }
  .loading-step { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); opacity: 0; transition: opacity 0.3s, color 0.3s; }
  .loading-step.done { opacity: 1; color: var(--success); }
  .loading-step.active-step { opacity: 1; color: var(--accent); }
  .results { display: none; }
  .results.active { display: block; animation: fadeUp 0.5s ease both; }
  .company-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .company-name { font-size: 36px; font-weight: 800; letter-spacing: -0.04em; }
  .timestamp { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px 22px; transition: border-color 0.2s; }
  .card:hover { border-color: rgba(0,229,255,0.2); }
  .card.full { grid-column: 1 / -1; }
  .card.highlight { border-color: rgba(0,229,255,0.3); background: rgba(0,229,255,0.04); }
  .card-label { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .card-label::before { content: ''; display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
  .card-content { font-size: 14px; line-height: 1.7; color: #b0bec5; }
  .talking-point { font-size: 18px; font-weight: 600; line-height: 1.5; color: var(--text); font-style: italic; }
  .news-item { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; color: #b0bec5; line-height: 1.5; }
  .news-item:last-child { border-bottom: none; padding-bottom: 0; }
  .news-item strong { color: var(--text); display: block; margin-bottom: 2px; }
  .sources { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .source-tag { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px; }
  .powered-by { text-align: center; margin-top: 40px; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); }
  .powered-by span { color: var(--accent); }
  .error-box { display: none; background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2); border-radius: 10px; padding: 20px; font-family: 'Space Mono', monospace; font-size: 12px; color: #ff8080; margin-bottom: 24px; }
  .error-box.active { display: block; }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .search-row { flex-direction: column; } .company-name { font-size: 26px; } }
</style>
</head>
<body>
<div class="container">
  <header class="header">
    <div class="logo-block">
      <div class="logo-eyebrow">Forward Deployed Agent</div>
      <h1 class="logo-title">Client Intel <span>Agent</span></h1>
    </div>
    <div class="tavily-badge"><div class="dot"></div>Tavily Search API</div>
  </header>

  <div class="search-section">
    <div class="search-label">Enter a company to research</div>
    <div class="search-row">
      <input type="text" class="search-input" id="companyInput" placeholder="e.g. Groq, Cohere, Mistral..." autocomplete="off"/>
      <button class="search-btn" id="searchBtn" onclick="runAgent()">Run Agent →</button>
    </div>
    <div class="quick-picks">
      <span class="quick-pick" onclick="quickSearch('Groq')">Groq</span>
      <span class="quick-pick" onclick="quickSearch('Cohere')">Cohere</span>
      <span class="quick-pick" onclick="quickSearch('Mistral AI')">Mistral AI</span>
      <span class="quick-pick" onclick="quickSearch('Perplexity AI')">Perplexity</span>
      <span class="quick-pick" onclick="quickSearch('Anthropic')">Anthropic</span>
    </div>
  </div>

  <div class="loading" id="loading">
    <div class="spinner"></div>
    <div class="loading-steps">
      <div class="loading-step" id="step1">→ Querying Tavily Search API...</div>
      <div class="loading-step" id="step2">→ Pulling latest news & funding signals...</div>
      <div class="loading-step" id="step3">→ Extracting key intel...</div>
      <div class="loading-step" id="step4">→ Formatting for FDE prep...</div>
    </div>
  </div>

  <div class="error-box" id="errorBox"></div>

  <div class="results" id="results">
    <div class="company-header">
      <div class="company-name" id="companyTitle"></div>
      <div class="timestamp" id="timestamp"></div>
    </div>
    <div class="grid">
      <div class="card full highlight">
        <div class="card-label">FDE Talking Point</div>
        <div class="talking-point" id="talkingPoint">—</div>
      </div>
      <div class="card full">
        <div class="card-label">What They Do</div>
        <div class="card-content" id="whatTheyDo">—</div>
      </div>
      <div class="card">
        <div class="card-label">Latest News</div>
        <div id="latestNews">—</div>
      </div>
      <div class="card">
        <div class="card-label">Key Signals</div>
        <div class="card-content" id="keySignals">—</div>
      </div>
      <div class="card full">
        <div class="card-label">Sources</div>
        <div class="sources" id="sources"></div>
      </div>
    </div>
  </div>

  <div class="powered-by">Built with <span>Tavily Search API</span> + <span>Claude</span> · Demo by Mruga Gokhale</div>
</div>

<script>
  function quickSearch(c) { document.getElementById('companyInput').value = c; runAgent(); }

  async function runAgent() {
    const company = document.getElementById('companyInput').value.trim();
    if (!company) return;
    document.getElementById('results').classList.remove('active');
    document.getElementById('errorBox').classList.remove('active');
    document.getElementById('loading').classList.add('active');
    document.getElementById('searchBtn').disabled = true;
    resetSteps();
    try {
      await animateStep('step1', 500);
      await animateStep('step2', 800);
      await animateStep('step3', 400);
      const res = await fetch('/api/intel?company=' + encodeURIComponent(company));
      if (!res.ok) throw new Error(await res.text());
      const intel = await res.json();
      await animateStep('step4', 300);
      document.getElementById('loading').classList.remove('active');
      document.getElementById('companyTitle').textContent = company;
      document.getElementById('timestamp').textContent = 'Generated ' + new Date().toLocaleTimeString() + ' · Tavily Search';
      document.getElementById('talkingPoint').textContent = '"' + intel.talkingPoint + '"';
      document.getElementById('whatTheyDo').textContent = intel.whatTheyDo;
      document.getElementById('keySignals').textContent = intel.keySignals;
      document.getElementById('latestNews').innerHTML = intel.latestNews.map(n => '<div class="news-item"><strong>' + n.headline + '</strong>' + n.detail + '</div>').join('');
      document.getElementById('sources').innerHTML = intel.sources.map(s => '<span class="source-tag">' + s + '</span>').join('');
      document.getElementById('results').classList.add('active');
    } catch(err) {
      document.getElementById('loading').classList.remove('active');
      const e = document.getElementById('errorBox');
      e.textContent = 'Error: ' + err.message;
      e.classList.add('active');
    }
    document.getElementById('searchBtn').disabled = false;
  }

  function resetSteps() {
    ['step1','step2','step3','step4'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('done','active-step');
      el.style.opacity = '0';
    });
  }

  async function animateStep(id, delay) {
    return new Promise(r => setTimeout(() => {
      const prev = document.querySelector('.loading-step.active-step');
      if (prev) { prev.classList.remove('active-step'); prev.classList.add('done'); }
      document.getElementById(id).classList.add('active-step');
      r();
    }, delay));
  }

  document.getElementById('companyInput').addEventListener('keydown', e => { if (e.key === 'Enter') runAgent(); });
</script>
</body>
</html>`;

// ── HTTP Server ──────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // Serve HTML
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(HTML);
  }

  // API route
  if (url.pathname === '/api/intel') {
    const company = url.searchParams.get('company');
    if (!company) {
      res.writeHead(400); return res.end('Missing company param');
    }

    try {
      // 1. Tavily search
      const tavilyBody = JSON.stringify({
        api_key: TAVILY_KEY,
        query: `${company} company latest news funding product 2025`,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 6,
        topic: 'news'
      });

      const tavilyData = await httpPost('api.tavily.com', '/search', tavilyBody, {
        'Content-Type': 'application/json'
      });

      // 2. Pull extra signals (funding/product search)
      const tavilyBody2 = JSON.stringify({
        api_key: TAVILY_KEY,
        query: `${company} funding valuation product launch 2024 2025`,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3
      });
      const tavilyData2 = await httpPost('api.tavily.com', '/search', tavilyBody2, {
        'Content-Type': 'application/json'
      });

      // 3. Build intel from Tavily results directly
      console.log('Tavily response:', JSON.stringify(tavilyData, null, 2));
      if (!tavilyData.results) throw new Error('Tavily returned no results: ' + JSON.stringify(tavilyData));
      const results = tavilyData.results.slice(0, 5);
      const newsItems = results.slice(0, 3).map(r => ({
        headline: r.title.length > 80 ? r.title.substring(0, 77) + '...' : r.title,
        detail: r.content ? r.content.substring(0, 120) + '...' : ''
      }));

      const intel = {
        whatTheyDo: tavilyData.answer || results[0]?.content?.substring(0, 300) || 'No summary available.',
        latestNews: newsItems,
        keySignals: tavilyData2.answer || tavilyData2.results[0]?.content?.substring(0, 250) || 'No signal data found.',
        talkingPoint: `${company} is making moves — here's what I found that's relevant to how we can help.`
      };

      intel.sources = tavilyData.results.slice(0, 5).map(r => {
        try { return new URL(r.url).hostname.replace('www.', ''); } catch { return ''; }
      }).filter(Boolean);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(intel));

    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  res.writeHead(404); res.end('Not found');
});

// ── Helper: HTTPS POST ───────────────────────────────────────
function httpPost(host, path, body, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(body) } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

server.listen(3000, () => {
  console.log('✅ Client Intel Agent running at http://localhost:3000');
});
