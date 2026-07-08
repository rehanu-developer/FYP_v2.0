/* ============================================================
   RouteOps Cloud — Part 1 prototype
   Grid-first Route Planning Portal — Community Coffee
   ============================================================ */

const I = {
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/></svg>',
  sheet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  db:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0 0 16 0V5"/><path d="M4 12a8 3 0 0 0 16 0"/></svg>',
  route:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 8v5l-4 2v-7z"/></svg>',
  columns:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></svg>',
  density:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8l-3 6h6zM19 8l-3 6h6z"/><path d="M5 21h14M5 8h14"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-ic" width="11" height="11"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  lasso:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7c-1 0-2-.2-3-.5"/><path d="M5 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M5 18v-2"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7L3 9"/></svg>',
  redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-3-7l3 3"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  center:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M8 14a5 5 0 1 1 8 0c-.6.8-1 1.4-1 2.5H9c0-1.1-.4-1.7-1-2.5z"/></svg>',
  ruler:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l13 13 5-5L8 3z"/><path d="M8 8l2 2M12 6l2 2M6 12l2 2"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
};

function crumbs(items) {
  return `<div class="crumbs">${items.map((c,i)=>{
    const last = i===items.length-1;
    return `${last?`<span class="cur">${c}</span>`:`<span>${c}</span><span class="sep">/</span>`}`;
  }).join('')}</div>`;
}
function head(title, sub, actions) {
  return `<div class="pagehead"><div><h1>${title}</h1><p>${sub}</p></div>${actions?`<div class="head-actions">${actions}</div>`:''}</div>`;
}
function stepper(active) {
  const steps=[['1','Ingest'],['2','Preview'],['3','Commit'],['4','Create Session']];
  return `<div class="stepper">${steps.map((s,i)=>{
    const idx=i+1; const cls=idx<active?'complete':idx===active?'active':'';
    const sep=i<steps.length-1?'<span class="step-sep">›</span>':'';
    const num=idx<active?I.check:s[0];
    return `<div class="step ${cls}"><span class="step-num">${num}</span><span class="step-txt">${s[1]}</span></div>${sep}`;
  }).join('')}</div>`;
}

/* ============================================================
   STEP 1 — DASHBOARD / PORTAL OVERVIEW
   ============================================================ */
function dashboard() {
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard'])}
    ${head('Route Planning Portal',
      'Plan market-level route cycles, compare incoming customer changes, and manage baseline-to-option route planning.',
      `<button class="btn btn-secondary" onclick="go('createSession')">${I.plus}Create New Session</button>
       <button class="btn btn-primary" onclick="go('ingestion')">Review Latest Ingest ${I.arrow}</button>`)}

    <div class="grid grid-4">
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${I.sheet}</div><span class="pill ready"><span class="pill-dot"></span>Ready for review</span></div>
        <div class="stat-label">Brewpoint Feed</div>
        <div class="stat-value">36,214</div>
        <div class="stat-meta">records · last run Today, 2:14 AM<br>Delta: <b class="tag-new">17 new</b>, <b class="tag-up">142 updated</b>, <b class="tag-rem">3 removed</b></div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon blue">${I.db}</div></div>
        <div class="stat-label">Planning Sessions</div>
        <div class="stat-value">4 open</div>
        <div class="stat-meta">2 edited today</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${I.clock}</div></div>
        <div class="stat-label">Next Planning Cycle</div>
        <div class="stat-value" style="font-size:19px">Baton Rouge 4 Week</div>
        <div class="stat-meta">Starts Wk 1, July 2026</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon amber">${I.users}</div><span class="pill over"><span class="pill-dot"></span>Attention</span></div>
        <div class="stat-label">Attention Needed</div>
        <div class="stat-value">17 new</div>
        <div class="stat-meta">customers · review before session creation</div>
      </div>
    </div>

    <div class="two-col-even" style="margin-top:24px">
      <div>
        <div class="sec-title"><h2>Recent Ingest Runs</h2><span class="link" onclick="go('ingestion')">View all</span></div>
        <div class="card table-wrap">
          <table class="tbl-dense">
            <thead><tr><th>Run ID</th><th>Source</th><th>Market</th><th>Records</th><th>New</th><th>Upd</th><th>Rem</th><th>Status</th><th>Run Time</th><th></th></tr></thead>
            <tbody>
              <tr><td class="mono strong">ING-2048</td><td>Brewpoint Feed</td><td class="muted">All Markets</td><td>36,214</td><td class="tag-new">17</td><td class="tag-up">142</td><td class="tag-rem">3</td><td><span class="pill ready"><span class="pill-dot"></span>Ready</span></td><td class="muted">Today 2:14 AM</td><td><span class="reveal-btn" onclick="go('preview')">Preview</span></td></tr>
              <tr><td class="mono strong">ING-2047</td><td>Manual Upload</td><td class="muted">Baton Rouge</td><td>2,846</td><td class="tag-new">12</td><td class="tag-up">88</td><td class="tag-rem">1</td><td><span class="pill committed"><span class="pill-dot"></span>Committed</span></td><td class="muted">Yest 4:11 PM</td><td><span class="reveal-btn" onclick="go('preview')">Open</span></td></tr>
              <tr><td class="mono strong">ING-2046</td><td>Brewpoint Feed</td><td class="muted">New Orleans</td><td>3,104</td><td class="tag-new">4</td><td class="tag-up">52</td><td class="tag-rem">0</td><td><span class="pill committed"><span class="pill-dot"></span>Committed</span></td><td class="muted">Jul 03 1:58 AM</td><td><span class="reveal-btn" onclick="go('preview')">Open</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="sec-title"><h2>Open Sessions</h2><span class="link" onclick="go('createSession')">Manage</span></div>
        ${sessionCard('Baton Rouge 2026-07 Restructure','Baton Rouge','4 Week','BASELINE','progress','In Progress','Option 1','Today', true)}
        ${sessionCard('New Orleans 2026-07 Cycle','New Orleans','4 Week','DELIVERY','neutral','Baseline Created','None','Yesterday', false)}
        ${sessionCard('Lafayette 2026-08 Cycle','Lafayette','8 Week','BASELINE','done','Finalized','Final Plan','Last Friday', false)}
      </div>
    </div>
  </div></div>`;
}
function sessionCard(name, market, cycle, scenario, statusCls, status, option, edited, open) {
  return `<div class="session-card" onclick="${open?"openSession()":"toast('Session opened')"}">
    <div class="sc-head"><span class="sc-name">${name}</span><span class="pill ${statusCls}"><span class="pill-dot"></span>${status}</span></div>
    <div class="sc-meta">
      <span class="mk">Market: <b>${market}</b></span>
      <span class="mk">Cycle: <b>${cycle}</b></span>
      <span class="mk">Scenario: <b>${scenario}</b></span>
      <span class="mk">Active option: <b>${option}</b></span>
      <span class="mk">Last edited: <b>${edited}</b></span>
    </div>
  </div>`;
}

/* ============================================================
   STEP 2 — UPLOAD / DATA INGESTION
   ============================================================ */
function ingestion() {
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Data Ingestion'])}
    ${head('Upload / Ingest Data','Bring fresh Brewpoint customer and sales data into the routing portal.')}
    <div class="two-col">
      <div>
        <div class="card card-pad">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div><div class="card-h">Brewpoint Feed</div><div class="card-sub" style="margin:0">Automated scheduled data feed</div></div>
            <span class="pill committed"><span class="pill-dot"></span>Last result: Success</span>
          </div>
          <div class="grid grid-2" style="gap:0 24px">
            <div class="kv"><span class="k">Last run</span><span class="v">Today, 2:14 AM</span></div>
            <div class="kv"><span class="k">Next scheduled</span><span class="v">Tomorrow, 2:00 AM</span></div>
            <div class="kv"><span class="k">Records processed</span><span class="v">36,214</span></div>
            <div class="kv"><span class="k">Delta found</span><span class="v"><span class="tag-new">17</span> / <span class="tag-up">142</span> / <span class="tag-rem">3</span></span></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn btn-primary btn-sm" onclick="toast('Feed pull triggered — parsing in background')">Trigger Feed Pull</button>
            <button class="btn btn-secondary btn-sm" onclick="toast('Feed settings')">View Feed Settings</button>
          </div>
          <div class="note">${I.info}<span>Automated feed support can be enabled when Brewpoint endpoint access is available.</span></div>
        </div>

        <div class="card card-pad" style="margin-top:16px">
          <div class="card-h">Manual File Upload</div>
          <div class="card-sub">Upload a Location Sales Extension Report as a fallback when the automated feed is unavailable. Accepted formats: <b>.prn</b>, <b>.xlsx</b></div>
          <div class="upload-zone">
            <div class="upload-icon">${I.upload}</div>
            <h3>Drop PRN or Excel file here</h3>
            <p>or browse from your computer</p>
          </div>
          <div class="file-row">
            <div class="file-ic">${I.sheet}</div>
            <div style="flex:1">
              <div class="file-name">Location_Sales_Extension_AllMarkets_2026_07.xlsx</div>
              <div class="file-meta">30 MB · Uploaded just now</div>
              <div class="progress-bar"><div class="progress-fill" style="width:100%"></div></div>
            </div>
            <span class="pill committed"><span class="pill-dot"></span>Upload complete</span>
          </div>
          <div class="note" style="background:var(--green-soft);border-color:#bfe7cf;color:#157a41">${I.check}<span><b>Upload complete.</b> Parsing in background.</span></div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn btn-primary" onclick="go('preview')">Open Data Preview ${I.arrow}</button>
            <button class="btn btn-secondary" onclick="toast('Choose a replacement file')">Replace File</button>
          </div>
        </div>

        <div class="sec-title"><h2>Recent Ingest History</h2></div>
        <div class="card table-wrap">
          <table class="tbl-dense">
            <thead><tr><th>Run ID</th><th>Source</th><th>File / Feed</th><th>Records</th><th>New</th><th>Upd</th><th>Rem</th><th>Status</th><th>Started</th><th>Duration</th><th></th></tr></thead>
            <tbody>
              <tr><td class="mono strong">ING-2048</td><td>Brewpoint Feed</td><td class="muted">Scheduled pull</td><td>36,214</td><td class="tag-new">17</td><td class="tag-up">142</td><td class="tag-rem">3</td><td><span class="pill ready"><span class="pill-dot"></span>Ready for Preview</span></td><td class="muted">Today 2:14 AM</td><td class="muted">4m 12s</td><td><span class="reveal-btn" onclick="go('preview')">Open</span></td></tr>
              <tr><td class="mono strong">ING-2047</td><td>Manual Upload</td><td class="muted">Location_Sales_Extension_BatonRouge.xlsx</td><td>2,846</td><td class="tag-new">12</td><td class="tag-up">88</td><td class="tag-rem">1</td><td><span class="pill committed"><span class="pill-dot"></span>Committed</span></td><td class="muted">Yesterday</td><td class="muted">1m 08s</td><td><span class="reveal-btn" onclick="go('preview')">Open</span></td></tr>
              <tr><td class="mono strong">ING-2046</td><td>Brewpoint Feed</td><td class="muted">Scheduled pull</td><td>35,984</td><td class="tag-new">9</td><td class="tag-up">110</td><td class="tag-rem">5</td><td><span class="pill committed"><span class="pill-dot"></span>Committed</span></td><td class="muted">Jul 03</td><td class="muted">3m 48s</td><td><span class="reveal-btn" onclick="go('preview')">Open</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-h">What happens during ingest?</div>
        <div class="card-sub" style="margin-bottom:10px">The portal replaces the manual VLOOKUP comparison grind.</div>
        <ul class="list-plain">
          <li><span class="num">1</span><span>The system reads the Brewpoint report.</span></li>
          <li><span class="num">2</span><span>Customer and sales records are parsed.</span></li>
          <li><span class="num">3</span><span>The system compares the file against the current master dataset.</span></li>
          <li><span class="num">4</span><span>New, updated, and removed customers are identified.</span></li>
          <li><span class="num">5</span><span>The analyst reviews the Data Preview before committing.</span></li>
        </ul>
        <div class="note">${I.info}<span>Ingest runs in the background. You can leave this screen while parsing continues.</span></div>
        <div class="note" style="margin-top:8px">${I.warn}<span>If parsing fails, the system will show the row number and field issue.</span></div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   STEP 3 — DATA PREVIEW + COMPARE SUMMARY
   ============================================================ */
let previewTab = 'new';
function preview() {
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Data Preview'])}
    ${head('Data Preview + Compare Summary','Review incoming customer and sales changes before committing this ingest to the live routing dataset.')}
    ${stepper(2)}
    <div class="metadata-strip">
      <div class="meta-chip"><span class="mk">Run ID:</span> <b class="mono">ING-2048</b></div>
      <div class="meta-chip"><span class="mk">Source:</span> <b>Brewpoint Feed</b></div>
      <div class="meta-chip"><span class="mk">File:</span> <b>Location_Sales_Extension_AllMarkets_2026_07.xlsx</b></div>
      <div class="meta-chip"><span class="mk">Records:</span> <b>36,214</b></div>
      <div class="meta-chip"><span class="mk">Detected:</span> <b><span class="tag-new">17 new</span>, <span class="tag-up">142 updated</span>, <span class="tag-rem">3 removed</span></b></div>
      <div class="meta-chip"><span class="pill ready"><span class="pill-dot"></span>Ready for review</span></div>
    </div>

    <div class="grid grid-5">
      <div class="stat"><div class="stat-label">Total Customers in File</div><div class="stat-value">36,214</div></div>
      <div class="stat"><div class="stat-label">New Customers</div><div class="stat-value tag-new">17</div><div class="stat-meta">Not found in current master data</div></div>
      <div class="stat"><div class="stat-label">Updated Customers</div><div class="stat-value tag-up">142</div><div class="stat-meta">Address, time window, pattern, or sales fields changed</div></div>
      <div class="stat"><div class="stat-label">Removed / Missing</div><div class="stat-value tag-rem">3</div><div class="stat-meta">Present before, absent in latest file</div></div>
      <div class="stat"><div class="stat-label">Parse Quality</div><div class="stat-value" style="color:var(--green)">99.9%</div><div class="stat-meta">File structure recognized</div></div>
    </div>

    <div class="two-col" style="margin-top:22px">
      <div class="card">
        <div class="tabs-bar" style="padding:0 16px;margin-bottom:0" id="previewTabs">
          <button class="tab-btn ${previewTab==='all'?'active':''}" onclick="setPreviewTab('all')">All <span class="cnt">36,214</span></button>
          <button class="tab-btn ${previewTab==='new'?'active':''}" onclick="setPreviewTab('new')">New <span class="cnt">17</span></button>
          <button class="tab-btn ${previewTab==='updated'?'active':''}" onclick="setPreviewTab('updated')">Updated <span class="cnt">142</span></button>
          <button class="tab-btn ${previewTab==='removed'?'active':''}" onclick="setPreviewTab('removed')">Removed <span class="cnt">3</span></button>
          <button class="tab-btn ${previewTab==='raw'?'active':''}" onclick="setPreviewTab('raw')">Raw Preview <span class="cnt">100</span></button>
        </div>
        <div style="padding:11px 16px;font-size:11.5px;color:var(--text-mute);border-bottom:1px solid var(--border);background:var(--panel-soft)">
          ${I.lock.replace('width="16" height="16"','')} Customer names are masked by default. Revealing a name is audit logged.
        </div>
        <div id="previewGrid" class="table-wrap">${previewGrid()}</div>
      </div>

      <div class="card card-pad">
        <div class="card-h">Commit Summary</div>
        <div class="card-sub">This ingest will update the live master routing dataset.</div>
        <div class="detail-sec-title">Detected changes</div>
        <div class="detail-metric"><span class="l"><span class="tag-new">17 new</span> customers</span><span class="v">will be added</span></div>
        <div class="detail-metric"><span class="l"><span class="tag-up">142 existing</span> customers</span><span class="v">will be updated</span></div>
        <div class="detail-metric"><span class="l"><span class="tag-rem">3 missing</span> customers</span><span class="v">inactive / removed</span></div>
        <div class="detail-metric"><span class="l">Suggested placements</span><span class="v">available in session</span></div>
        <div class="note" style="margin-top:14px">${I.info}<span><b>No route planning changes are committed yet.</b> This only updates the master dataset. Sessions will snapshot the baseline after this commit.</span></div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
          <button class="btn btn-primary" style="justify-content:center" onclick="go('committed')">Commit Ingest ${I.arrow}</button>
          <button class="btn btn-danger" style="justify-content:center" onclick="go('dashboard')">Reject Ingest</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

function setPreviewTab(t){ previewTab=t; document.getElementById('previewGrid').innerHTML=previewGrid(); document.querySelectorAll('#previewTabs .tab-btn').forEach(b=>b.classList.remove('active')); event.target.closest('.tab-btn').classList.add('active'); }

function maskCell(id){ return `<span class="masked" id="mask-${id}">••••••••</span> <span class="reveal-btn" id="rev-${id}" onclick="revealName('${id}','${SAMPLE_NAMES[id]||'Riverside Market'}')">Reveal</span>`; }
const SAMPLE_NAMES = {'1045821':'Riverside Market','1045822':'Campus Grocery','1045823':'Northline Foods','1045824':'Bayou Provisions','1029441':'Oak Avenue Grocery','1030188':'Highland Corner Store','1034022':'Central Market Express','1019820':'River Parish Foods','1031882':'Levee Road Deli'};
function revealName(id,name){ const m=document.getElementById('mask-'+id); const r=document.getElementById('rev-'+id); if(m){ m.outerHTML=`<span class="revealed">${name}</span>`; } if(r){ r.outerHTML=`<span class="audit-note">${I.check} Name revealed and audit logged.</span>`; } }

function previewGrid() {
  if (previewTab==='updated') {
    return `<table class="tbl-dense"><thead><tr><th>Customer ID</th><th>Field Changed</th><th>Before</th><th>After</th><th>Market</th><th>Route Impact</th><th>Action</th></tr></thead><tbody>
      <tr><td class="mono strong">1029441</td><td>Time Window</td><td class="delta-before">8:00–11:00 AM</td><td class="delta-after">9:00 AM–12:00 PM</td><td class="muted">Baton Rouge</td><td>Review route timing</td><td>${maskCell('1029441r')}</td></tr>
      <tr><td class="mono strong">1030188</td><td>Service Pattern</td><td class="delta-before">Weekly</td><td class="delta-after">Twice Weekly</td><td class="muted">New Orleans</td><td>Adds 4 stops per cycle</td><td>${maskCell('1030188r')}</td></tr>
      <tr><td class="mono strong">1034022</td><td>Sales Volume</td><td class="delta-before">$2,880</td><td class="delta-after">$4,120</td><td class="muted">Lafayette</td><td>Route revenue changed</td><td>${maskCell('1034022r')}</td></tr>
    </tbody></table>`;
  }
  if (previewTab==='removed') {
    return `<table class="tbl-dense"><thead><tr><th>Customer ID</th><th>Last Known Market</th><th>Last Route</th><th>Last Service Pattern</th><th>Reason</th><th>Action</th></tr></thead><tbody>
      <tr><td class="mono strong">1019820</td><td>Baton Rouge</td><td class="mono">BR-012</td><td>Weekly</td><td class="muted">Missing from latest Brewpoint file</td><td>${maskCell('1019820r')}</td></tr>
      <tr><td class="mono strong">1021044</td><td>New Orleans</td><td class="mono">NO-004</td><td>Weekly</td><td class="muted">Missing from latest Brewpoint file</td><td>${maskCell('1021044r')}</td></tr>
      <tr><td class="mono strong">1022910</td><td>Lafayette</td><td class="mono">LAF-008</td><td>Twice Weekly</td><td class="muted">Missing from latest Brewpoint file</td><td>${maskCell('1022910r')}</td></tr>
    </tbody></table>`;
  }
  if (previewTab==='raw') {
    const cols=['Customer ID','Name','Addr1','City','State','Zip','Market','Territory','Route','Day','Wk','Freq','Svc Min','Window','Seq','Volume','Depot'];
    let rows='';
    const cities=['Baton Rouge','Denham Springs','New Orleans','Lafayette'];
    for(let i=0;i<40;i++){ const id=1045820+i;
      rows+=`<tr><td class="mono">${id}</td><td>${maskCell('raw'+i)}</td><td class="muted">•••• hidden</td><td class="muted">${cities[i%4]}</td><td class="muted">LA</td><td class="muted">708${(i%9)}0</td><td class="muted">Baton Rouge</td><td class="muted">East BR</td><td class="mono">BR-0${10+(i%9)}</td><td class="muted">${['Mon','Tue','Wed','Thu','Fri'][i%5]}</td><td>Wk ${1+(i%4)}</td><td>Weekly</td><td>${16+(i%12)}</td><td class="muted">08–11 AM</td><td>${i+1}</td><td>$${(2000+i*37).toLocaleString()}</td><td class="muted">BR North</td></tr>`;
    }
    return `<div style="max-height:440px;overflow:auto"><table class="tbl-dense"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
      <div class="grid-foot"><span>Showing 40 of first 100 rows · 65 columns available</span></div>`;
  }
  // new (default) + all
  return `<table class="tbl-dense"><thead><tr><th>Customer ID</th><th>Customer Name</th><th>Market</th><th>Territory</th><th>City</th><th>Sales Volume</th><th>Suggested Route</th><th>Day</th><th>Week</th><th>Confidence</th><th>Action</th></tr></thead><tbody>
    <tr><td class="mono strong">1045821</td><td>${maskCell('1045821')}</td><td class="muted">Baton Rouge</td><td class="muted">East Baton Rouge</td><td class="muted">Baton Rouge</td><td>$4,820</td><td class="mono">BR-014</td><td>Tuesday</td><td>Wk 2</td><td><span class="pill high">High</span></td><td></td></tr>
    <tr><td class="mono strong">1045822</td><td>${maskCell('1045822')}</td><td class="muted">Baton Rouge</td><td class="muted">Campus</td><td class="muted">Baton Rouge</td><td>$3,940</td><td class="mono">BR-009</td><td>Thursday</td><td>Wk 1</td><td><span class="pill high">High</span></td><td></td></tr>
    <tr><td class="mono strong">1045823</td><td>${maskCell('1045823')}</td><td class="muted">Baton Rouge</td><td class="muted">Denham</td><td class="muted">Denham Springs</td><td>$2,760</td><td class="mono">BR-021</td><td>Monday</td><td>Wk 3</td><td><span class="pill medium">Medium</span></td><td></td></tr>
    <tr><td class="mono strong">1045824</td><td>${maskCell('1045824')}</td><td class="muted">New Orleans</td><td class="muted">Uptown</td><td class="muted">New Orleans</td><td>$5,110</td><td class="mono">NO-006</td><td>Wednesday</td><td>Wk 1</td><td><span class="pill high">High</span></td><td></td></tr>
  </tbody></table>`;
}

/* commit success */
function committed() {
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Data Preview','Commit'])}
    ${head('Ingest Committed','The latest Brewpoint data has been committed to the live master routing dataset.')}
    ${stepper(3)}
    <div class="center-card">
      <div class="big-check">${I.check}</div>
      <h2>ING-2048 has been committed</h2>
      <p class="lead">The master routing dataset has been updated. You can now create a scoped planning session, which will snapshot an immutable baseline.</p>
      <div class="detail-list">
        <div class="drow"><span class="dk">Total records processed</span><span class="dv">36,214</span></div>
        <div class="drow"><span class="dk">New customers added</span><span class="dv tag-new">17</span></div>
        <div class="drow"><span class="dk">Customers updated</span><span class="dv tag-up">142</span></div>
        <div class="drow"><span class="dk">Customers marked removed</span><span class="dv tag-rem">3</span></div>
        <div class="drow"><span class="dk">Master dataset updated</span><span class="dv">Today at 2:31 PM</span></div>
      </div>
      <div class="cta-row">
        <button class="btn btn-secondary" onclick="go('dashboard')">Back to Dashboard</button>
        <button class="btn btn-primary" onclick="go('createSession')">Create Session ${I.arrow}</button>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   STEP 4 — CREATE SESSION
   ============================================================ */
function createSession() {
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Create Session'])}
    ${head('Create Session','Create a planning workspace from the latest committed master routing dataset.')}

    <div class="card card-pad" style="margin-bottom:20px">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div class="stat-icon" style="width:38px;height:38px;flex-shrink:0">${I.info}</div>
        <div style="flex:1">
          <div class="card-h">What is a session?</div>
          <div class="card-sub" style="margin-bottom:0">A session is a planning workspace for one market's routes during one cycle. The system snapshots the <b>baseline</b> when the session is created. The baseline stays locked. Any route changes are made in an <b>Option</b>.</div>
          <div class="flow">
            <span class="flow-node">Master Dataset</span><span class="flow-arrow">→</span>
            <span class="flow-node hi">Session</span><span class="flow-arrow">→</span>
            <span class="flow-node">Baseline Snapshot</span><span class="flow-arrow">→</span>
            <span class="flow-node">Option</span><span class="flow-arrow">→</span>
            <span class="flow-node">Final Plan</span>
          </div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="card card-pad">
        <div class="card-h">Session Configuration</div>
        <div class="card-sub">Scope the workspace. Rulebook values are pulled automatically.</div>
        <div class="field"><label class="field-label">Session Name</label><input class="text-input" value="Baton Rouge 2026-07 Restructure" /></div>
        <div class="field"><label class="field-label">Market / Territory Scope</label><select class="select"><option>Baton Rouge</option><option>New Orleans</option><option>Lafayette</option><option>Shreveport</option></select></div>
        <div class="field">
          <label class="field-label">Scenario</label>
          <select class="select" id="scenarioSel" onchange="scenarioChange()"><option>BASELINE</option><option>DELIVERY</option><option>MERCHANDISER (deprecated)</option><option>SERVICE (deprecated)</option></select>
          <div id="scenarioWarn"></div>
        </div>
        <div class="field"><label class="field-label">Cycle Length</label><div class="segmented"><button class="active" onclick="segToggle(this)">4 Week</button><button onclick="segToggle(this)">8 Week</button></div></div>
        <div class="field"><label class="field-label">Starting Week</label><select class="select"><option>Wk 1</option><option>Wk 2</option><option>Wk 3</option><option>Wk 4</option></select></div>
        <div class="field"><label class="field-label">Depot</label><select class="select"><option>Baton Rouge North Depot</option><option>Baton Rouge East Depot</option><option>Baton Rouge South Depot</option></select></div>
        <div class="field" style="margin-bottom:0"><label class="field-label">Time Period</label><select class="select"><option>July 2026 Cycle</option><option>August 2026 Cycle</option></select></div>
      </div>

      <div>
        <div class="card card-pad">
          <div class="card-h">Baseline Preview</div>
          <div class="card-sub">You are about to create a session for <b>Baton Rouge</b> using the latest committed master dataset.</div>
          <div class="detail-metric"><span class="l">Estimated customers</span><span class="v">2,846</span></div>
          <div class="detail-metric"><span class="l">Estimated stops</span><span class="v">1,612</span></div>
          <div class="detail-metric"><span class="l">Routes</span><span class="v">42</span></div>
          <div class="detail-metric"><span class="l">Territories</span><span class="v">6</span></div>
          <div class="detail-metric"><span class="l">Depots</span><span class="v">3</span></div>
          <div class="detail-metric"><span class="l">Cycle</span><span class="v">4 Week</span></div>
          <div class="detail-metric"><span class="l">Scenario</span><span class="v">BASELINE</span></div>
          <div class="detail-metric"><span class="l">Starting week</span><span class="v">Wk 1</span></div>
          <div class="detail-sec-title" style="margin-top:14px">Configuration pulled automatically</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${['Vehicle counts','Helper rules','Cost model','Depot defaults','Service time rules','Route templates'].map(x=>`<span class="pill neutral">${x}</span>`).join('')}
          </div>
          <div class="note" style="margin-top:12px">${I.info}<span>These values come from configuration tables and do not need to be manually set per session.</span></div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
            <button class="btn btn-primary" style="justify-content:center" onclick="startSessionCreate()">Create Session ${I.arrow}</button>
            <button class="btn btn-secondary" style="justify-content:center" onclick="go('dashboard')">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="sec-title"><h2>Existing Sessions</h2></div>
    <div class="card table-wrap">
      <table class="tbl-dense">
        <thead><tr><th>Session</th><th>Market</th><th>Cycle</th><th>Scenario</th><th>Status</th><th>Last Edited</th><th></th></tr></thead>
        <tbody>
          <tr><td class="strong">Baton Rouge 2026-07 Restructure</td><td class="muted">Baton Rouge</td><td>4 Week</td><td><span class="pill scenario">BASELINE</span></td><td><span class="pill progress"><span class="pill-dot"></span>In Progress</span></td><td class="muted">Today</td><td><span class="reveal-btn" onclick="openSession()">Open</span></td></tr>
          <tr><td class="strong">New Orleans 2026-07 Cycle</td><td class="muted">New Orleans</td><td>4 Week</td><td><span class="pill scenario">DELIVERY</span></td><td><span class="pill neutral">Baseline Created</span></td><td class="muted">Yesterday</td><td><span class="reveal-btn" onclick="toast('Session opened')">Open</span></td></tr>
          <tr><td class="strong">Lafayette 2026-08 Planning</td><td class="muted">Lafayette</td><td>8 Week</td><td><span class="pill scenario">BASELINE</span></td><td><span class="pill done"><span class="pill-dot"></span>Finalized</span></td><td class="muted">Last Friday</td><td><span class="reveal-btn" onclick="toast('Session opened')">Open</span></td></tr>
        </tbody>
      </table>
    </div>
  </div></div>`;
}
function segToggle(el){ el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active')); el.classList.add('active'); }
function scenarioChange(){ const v=document.getElementById('scenarioSel').value; const w=document.getElementById('scenarioWarn');
  if(v.includes('deprecated')){ w.innerHTML=`<div class="warn-box">${I.warn}<span>This scenario is deprecated. Use only for historical planning needs.</span></div>`; } else { w.innerHTML=''; } }

const LOAD_STEPS=['Snapshotting baseline…','Building session workspace…','Applying market rulebook…'];
function startSessionCreate(){
  const modal=document.getElementById('loadingModal'); modal.classList.add('open');
  const stepsEl=document.getElementById('loadSteps'); const titleEl=document.getElementById('loadTitle');
  stepsEl.innerHTML=LOAD_STEPS.map(s=>`<div class="load-step"><span class="ls-ic"></span>${s}</div>`).join('');
  let i=0; const items=stepsEl.querySelectorAll('.load-step');
  const tick=()=>{ if(i<items.length){ items[i].classList.add('done'); items[i].querySelector('.ls-ic').innerHTML=I.check; titleEl.textContent=LOAD_STEPS[Math.min(i+1,LOAD_STEPS.length-1)]; i++; setTimeout(tick,650);} else { setTimeout(()=>{ modal.classList.remove('open'); openSession(); },500);} };
  setTimeout(tick,500);
}

/* ============================================================
   STEP 5 — SESSION MANAGEMENT GRID VIEW
   ============================================================ */
const STATE = {
  activeVersion: 'baseline',   // 'baseline' | 'option1'
  hasOption: false,
  tab: 'routes',
  selectedRoute: null,
  selectedStop: null,
  stopsFilterRoute: null,
  lassoMoveApplied: false,     // Part 2: BR-014 -> BR-021 lasso move
  balancerAccepted: false,     // Part 2: 3 balancer moves accepted
  finalized: false,            // Part 2: Option 1 finalized
};

// Base route metrics (Baseline / start of Option 1)
const ROUTES_BASE = [
  {id:'BR-014',driver:'M. Daniels',depot:'Baton Rouge North',terr:'East Baton Rouge',day:'Tuesday',wk:'Wk 2',stops:68,svc:310,travel:245,hours:'9h 15m',rev:'$12,840',cost:'$1,420',rpm:'$18.20',flag:'over',edited:'Today'},
  {id:'BR-009',driver:'A. Lewis',depot:'Baton Rouge North',terr:'Campus',day:'Thursday',wk:'Wk 1',stops:54,svc:260,travel:208,hours:'7h 48m',rev:'$10,520',cost:'$1,190',rpm:'$19.05',flag:'balanced',edited:'Today'},
  {id:'BR-021',driver:'R. Carter',depot:'Baton Rouge East',terr:'Denham',day:'Monday',wk:'Wk 3',stops:39,svc:190,travel:182,hours:'6h 12m',rev:'$7,420',cost:'$960',rpm:'$17.80',flag:'under',edited:'Today'},
  {id:'BR-033',driver:'T. Brooks',depot:'Baton Rouge South',terr:'River Parish',day:'Wednesday',wk:'Wk 1',stops:47,svc:230,travel:221,hours:'7h 31m',rev:'$8,940',cost:'$1,050',rpm:'$18.60',flag:'balanced',edited:'Yesterday'},
];
// After lasso move (5 stops BR-014 -> BR-021)
const ROUTES_AFTER_LASSO = {
  'BR-014':{stops:63,svc:285,travel:230,hours:'8h 05m',flag:'balanced',edited:'Just now'},
  'BR-021':{stops:44,svc:214,travel:194,hours:'7h 18m',flag:'balanced',edited:'Just now'},
};
// After balancer accepted (final Option 1 state)
const ROUTES_AFTER_BALANCE = {
  'BR-014':{stops:60,svc:272,travel:222,hours:'7h 54m',flag:'balanced',edited:'Just now'},
  'BR-021':{stops:49,svc:236,travel:206,hours:'7h 42m',flag:'balanced',edited:'Just now'},
  'BR-033':{stops:45,svc:222,travel:214,hours:'7h 19m',flag:'balanced',edited:'Just now'},
};
function getRoutes(){
  return ROUTES_BASE.map(r=>{
    let o={...r};
    if(STATE.lassoMoveApplied && ROUTES_AFTER_LASSO[r.id]) o={...o,...ROUTES_AFTER_LASSO[r.id]};
    if(STATE.balancerAccepted && ROUTES_AFTER_BALANCE[r.id]) o={...o,...ROUTES_AFTER_BALANCE[r.id]};
    return o;
  });
}
// Legacy reference name kept for existing tab code
Object.defineProperty(globalThis,'ROUTES',{ get:getRoutes });
const flagMeta={over:['Over Target','var(--amber)'],balanced:['Balanced','var(--green)'],under:['Underused','#9aa0aa']};

const STOPS = [
  {id:'ST-44902',cust:'1045821',terr:'East Baton Rouge',route:'BR-014',day:'Tuesday',wk:'Wk 2',freq:'Weekly',svc:'18 min',arr:'08:40 AM',win:'08:00 AM – 11:00 AM',seq:12,impact:'Normal'},
  {id:'ST-44903',cust:'1031882',terr:'East Baton Rouge',route:'BR-014',day:'Tuesday',wk:'Wk 2',freq:'Weekly',svc:'22 min',arr:'09:05 AM',win:'08:00 AM – 12:00 PM',seq:13,impact:'Normal'},
  {id:'ST-44904',cust:'1029441',terr:'East Baton Rouge',route:'BR-014',day:'Tuesday',wk:'Wk 2',freq:'Twice Weekly',svc:'25 min',arr:'09:35 AM',win:'09:00 AM – 12:00 PM',seq:14,impact:'High'},
];

function editingLocked(){ return STATE.activeVersion==='baseline'; }
function lockTip(){ return editingLocked() ? 'title="Create an Option to make changes."' : ''; }

function sessionGrid() {
  return `<div class="screen active"><div class="session-view">
    <div class="session-head">
      ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure'])}
      <div class="session-titlebar">
        <div>
          <h1>Baton Rouge 2026-07 Restructure</h1>
          <div class="sub">Session Management</div>
        </div>
        <div class="session-actions">
          <div class="active-version-pill"><span class="avp-dot"></span>Active Version: <span id="avpName">${STATE.activeVersion==='baseline'?'Baseline':'Option 1'}</span></div>
          <button class="btn btn-secondary btn-sm" id="saveAsBtn" onclick="openModal('optionModal')">${I.plus}Save-As Option</button>
          <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled '+lockTip():''} onclick="${editingLocked()?'':'goMap()'}">${I.map}Switch to Map View</button>
          <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled '+lockTip():''} onclick="${editingLocked()?'':`go('balancer')`}">${I.scale}Run Balancer</button>
          <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled '+lockTip():''} onclick="${editingLocked()?'':`go('finalMetrics')`}">${I.lock}Finalize</button>
          <button class="btn btn-secondary btn-sm" onclick="toast('More actions')">${I.more}</button>
        </div>
      </div>
      <div class="session-meta">
        <span class="meta-chip"><span class="mk">Market:</span> <b>Baton Rouge</b></span>
        <span class="meta-chip"><span class="mk">Cycle:</span> <b>4 Week</b></span>
        <span class="meta-chip"><span class="mk">Scenario:</span> <b>BASELINE</b></span>
        <span class="meta-chip" id="statusChip"><span class="mk">Status:</span> <b>${STATE.finalized?'Finalized':'In Progress'}</b></span>
        <span class="meta-chip"><span class="mk">Customers:</span> <b>2,846</b></span>
        <span class="meta-chip"><span class="mk">Stops:</span> <b>1,612</b></span>
        <span class="meta-chip"><span class="mk">Routes:</span> <b>42</b></span>
      </div>
    </div>

    <div class="session-body">
      <!-- LEFT RAIL -->
      <div class="session-rail">
        <div class="rail-title">Session Versions</div>
        <div class="version-item ${STATE.activeVersion==='baseline'?'active':''}" onclick="switchVersion('baseline')">
          <div class="vi-top"><span class="vi-name">${I.pin}Baseline</span><span class="pill locked">Immutable</span></div>
          <div class="vi-meta">Current snapshot · locked</div>
        </div>
        <div class="rail-title" style="margin-top:16px">Options</div>
        <div id="optionsList">${STATE.hasOption ? optionItem() : `<div class="rail-empty">No option yet. Create a Save-As Option to make what-if changes.</div>`}</div>
        <button class="btn btn-secondary btn-sm rail-saveas" style="justify-content:center;margin-top:10px" onclick="openModal('optionModal')">${I.plus}Save-As Option</button>
      </div>

      <!-- MAIN -->
      <div class="session-main">
        <div class="session-tabs" id="sessionTabs">
          ${tabBtn('routes','Routes')}${tabBtn('stops','Stops')}${tabBtn('territory','Territory')}${tabBtn('dayheat','Day Heat')}${tabBtn('metrics','Metrics')}${tabBtn('compare','Compare')}
        </div>
        <div id="tabContent" style="flex:1;display:flex;flex-direction:column;overflow:hidden">${tabContent()}</div>
        ${STATE.hasOption ? `<div class="next-cta-bar">
          <div><div class="nc-text">Option 1 is ready for spatial planning</div><div class="nc-sub">Balance routes on the map, lasso stops, then finalize and export the Stop List.</div></div>
          <button class="btn btn-primary btn-sm" onclick="goMap()">${I.map}Continue to Map / Lasso View ${I.arrow}</button>
        </div>` : ''}
      </div>

      <!-- RIGHT RAIL -->
      <div class="detail-rail" id="detailRail">${detailRailContent()}</div>
    </div>
  </div></div>`;
}

function tabBtn(id,label){ return `<button class="tab-btn ${STATE.tab===id?'active':''}" onclick="setSessionTab('${id}')">${label}</button>`; }

function setSessionTab(t){ STATE.tab=t; STATE.selectedStop=null; if(t!=='routes'&&t!=='stops'){STATE.selectedRoute=null;}
  document.getElementById('tabContent').innerHTML=tabContent();
  document.querySelectorAll('#sessionTabs .tab-btn').forEach(b=>b.classList.remove('active'));
  event&&event.target&&event.target.closest('.tab-btn')?.classList.add('active');
  document.getElementById('detailRail').innerHTML=detailRailContent();
}

function tabContent(){
  if(STATE.tab==='routes') return routesTab();
  if(STATE.tab==='stops') return stopsTab();
  if(STATE.tab==='territory') return territoryTab();
  if(STATE.tab==='dayheat') return dayHeatTab();
  if(STATE.tab==='metrics') return metricsTab();
  if(STATE.tab==='compare') return compareTab();
  return '';
}

/* ---- Routes tab ---- */
function routesTab(){
  return `<div class="grid-toolbar">
      <div class="toolbar-search">${I.search}<input placeholder="Search by route, customer ID, or masked name" /></div>
      <button class="mini-filter">Route ${I.chevron}</button>
      <button class="mini-filter">Day ${I.chevron}</button>
      <button class="mini-filter">Week ${I.chevron}</button>
      <button class="mini-filter">Territory ${I.chevron}</button>
      <button class="mini-filter">Balance Flag ${I.chevron}</button>
      <div class="toolbar-spacer"></div>
      <button class="mini-filter">${I.columns} Columns</button>
      <button class="mini-filter">${I.density} Density</button>
      <button class="btn btn-secondary btn-sm" onclick="toast('Exporting visible table…')">${I.download}Export</button>
    </div>
    <div class="kbd-hint">${I.info}<span>Keyboard:</span> <kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>Enter</kbd> open details · <kbd>F</kbd> focus filters · <kbd>M</kbd> switch to map</div>
    <div class="grid-scroll"><div class="grid-panel"><div class="table-wrap"><table class="tbl-dense">
      <thead><tr>
        <th class="check-col"></th>
        ${['Route ID','Driver','Depot','Territory','Day','Week','Stops','Svc Min','Travel Min','Total Hours','Revenue','Cost','Rev/Mile','Balance Flag','Last Edited'].map(c=>`<th class="sortable">${c}${I.sort}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${ROUTES.map(r=>`<tr class="row-click ${STATE.selectedRoute===r.id?'selected':''}" onclick="selectRoute('${r.id}')">
          <td class="check-col"><span class="check-box"></span></td>
          <td class="mono strong">${r.id}</td><td>${r.driver}</td><td class="muted">${r.depot}</td><td class="muted">${r.terr}</td>
          <td>${r.day}</td><td>${r.wk}</td><td>${r.stops}</td><td class="muted">${r.svc}</td><td class="muted">${r.travel}</td>
          <td class="strong">${r.hours}</td><td>${r.rev}</td><td class="muted">${r.cost}</td><td>${r.rpm}</td>
          <td><span class="balance-flag"><span class="bf-dot" style="background:${flagMeta[r.flag][1]}"></span>${flagMeta[r.flag][0]}</span></td>
          <td class="muted">${r.edited}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="grid-foot"><span>Showing 4 of 42 routes · virtualized grid</span>
      <div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>…</button><button>11</button><button>›</button></div>
    </div></div></div>`;
}

/* ---- Stops tab ---- */
function stopsTab(){
  const filt = STATE.stopsFilterRoute ? `<span class="pill ready" style="margin-left:8px"><span class="pill-dot"></span>Filtered: Route ${STATE.stopsFilterRoute} <span class="reveal-btn" style="margin-left:4px" onclick="clearStopFilter()">clear</span></span>` : '';
  return `<div class="grid-toolbar">
      <div class="toolbar-search">${I.search}<input placeholder="Search customer ID" /></div>
      <button class="mini-filter">Route ${I.chevron}</button>
      <button class="mini-filter">Day ${I.chevron}</button>
      <button class="mini-filter">Week ${I.chevron}</button>
      <button class="mini-filter">Frequency ${I.chevron}</button>
      <button class="mini-filter">Territory ${I.chevron}</button>
      ${filt}
      <div class="toolbar-spacer"></div>
      <button class="mini-filter">${I.columns} Columns</button>
      <button class="btn btn-secondary btn-sm" onclick="toast('Exporting visible table…')">${I.download}Export</button>
    </div>
    <div style="padding:9px 18px;font-size:11px;color:var(--text-mute);background:var(--panel);border-bottom:1px solid var(--border)">Customer names are masked by default. Revealing a name is audit logged.</div>
    <div class="grid-scroll"><div class="grid-panel"><div class="table-wrap"><table class="tbl-dense">
      <thead><tr>${['Stop ID','Customer ID','Customer Name','Territory','Route','Day','Week','Frequency','Service Time','Arrival Time','Time Window','Seq','Balance Impact','Action'].map(c=>`<th class="sortable">${c}</th>`).join('')}</tr></thead>
      <tbody>
        ${STOPS.map(s=>`<tr class="row-click ${STATE.selectedStop===s.id?'selected':''}" onclick="selectStop('${s.id}')">
          <td class="mono strong">${s.id}</td><td class="mono">${s.cust}</td><td>${maskCell('stop'+s.id)}</td>
          <td class="muted">${s.terr}</td><td class="mono">${s.route}</td><td>${s.day}</td><td>${s.wk}</td>
          <td>${s.freq}</td><td>${s.svc}</td><td class="muted">${s.arr}</td><td class="muted">${s.win}</td><td>${s.seq}</td>
          <td>${s.impact==='High'?'<span class="pill medium">High</span>':'<span class="pill under">Normal</span>'}</td>
          <td></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="grid-foot"><span>Showing 3 of 68 stops for Route BR-014 · 1,612 stops in session</span>
      <div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>…</button><button>23</button><button>›</button></div>
    </div></div></div>`;
}
function clearStopFilter(){ STATE.stopsFilterRoute=null; document.getElementById('tabContent').innerHTML=tabContent(); }

/* ---- Territory tab ---- */
function territoryTab(){
  const rows=[['East Baton Rouge',8,312,'8h 12m','$68,400','$7,820','review','Needs review'],
    ['Campus',6,244,'7h 35m','$52,120','$5,910','balanced','Balanced'],
    ['Denham',5,188,'6h 58m','$38,440','$4,280','under','Underused']];
  return `<div class="grid-scroll"><div class="grid-panel"><div class="table-wrap"><table>
    <thead><tr><th>Territory</th><th>Routes</th><th>Stops</th><th>Avg Hours</th><th>Revenue</th><th>Cost</th><th>Balance Status</th></tr></thead>
    <tbody>${rows.map(r=>{const cls=r[6]==='review'?'over':r[6]==='under'?'under':'balanced';const dot=r[6]==='review'?'var(--amber)':r[6]==='under'?'#9aa0aa':'var(--green)';
      return `<tr><td class="strong">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td class="muted">${r[5]}</td><td><span class="balance-flag"><span class="bf-dot" style="background:${dot}"></span>${r[7]}</span></td></tr>`;}).join('')}</tbody>
  </table></div><div class="grid-foot"><span>6 territories in session · showing 3</span></div></div></div>`;
}

/* ---- Day Heat tab ---- */
function dayHeatTab(){
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const data={ Monday:[298,286,286,301], Tuesday:[356,411,372,340], Wednesday:[312,330,318,305], Thursday:[288,276,299,281], Friday:[264,258,271,260], Saturday:[92,88,95,90] };
  const max=411;
  const heatColor=v=>{ const t=v/max; const light=100-Math.round(t*55); return `hsl(45 100% ${light}%)`; };
  return `<div class="grid-scroll"><div class="grid-panel" style="padding:18px">
    <div class="card-h">Stop Distribution — Day × Week</div>
    <div class="card-sub">Cell color intensity reflects stop volume. Heavier cells indicate day/week combinations that may need balancing.</div>
    <table class="heatmap"><thead><tr><th></th><th>Wk 1</th><th>Wk 2</th><th>Wk 3</th><th>Wk 4</th></tr></thead>
    <tbody>${days.map(d=>`<tr><td class="heat-label">${d}</td>${data[d].map(v=>`<td><div class="heat-cell" style="background:${heatColor(v)}">${v}<div class="heat-sub">stops</div></div></td>`).join('')}</tr>`).join('')}</tbody></table>
    <div class="note" style="margin-top:14px">${I.info}<span>Tuesday Wk 2 carries the heaviest load (411 stops). Monday Wk 3 is lighter (286 stops).</span></div>
  </div></div>`;
}

/* ---- Metrics tab ---- */
function metricsTab(){
  const hours=[3,6,9,14,10,8,5,3]; const hLabels=['5h','6h','7h','8h','9h','10h','11h','12h'];
  const dayStops=[264,411,330,299,271,90]; const dLabels=['Mon','Tue','Wed','Thu','Fri','Sat'];
  const terrRev=[68,52,38,44,30,26]; const tLabels=['E.BR','Cmp','Dnh','Rvr','Sth','Wst'];
  const bar=(arr,labels,cls)=>{const mx=Math.max(...arr);return `<div class="barchart">${arr.map((v,i)=>`<div class="bar ${cls}" style="height:${(v/mx)*100}%"><span class="bar-val">${v}</span><span class="bar-label">${labels[i]}</span></div>`).join('')}</div>`;};
  return `<div class="grid-scroll" style="padding:14px 18px">
    <div class="grid grid-4" style="margin-bottom:16px">
      <div class="stat"><div class="stat-label">Total Stops</div><div class="stat-value">1,612</div></div>
      <div class="stat"><div class="stat-label">Total Routes</div><div class="stat-value">42</div></div>
      <div class="stat"><div class="stat-label">Average Route Hours</div><div class="stat-value">7h 42m</div></div>
      <div class="stat"><div class="stat-label">Over Target Routes</div><div class="stat-value" style="color:var(--amber)">8</div></div>
      <div class="stat"><div class="stat-label">Balanced Routes</div><div class="stat-value" style="color:var(--green)">31</div></div>
      <div class="stat"><div class="stat-label">Underused Routes</div><div class="stat-value">3</div></div>
      <div class="stat"><div class="stat-label">Estimated Revenue</div><div class="stat-value">$428,950</div></div>
      <div class="stat"><div class="stat-label">Estimated Cost</div><div class="stat-value">$38,420</div></div>
    </div>
    <div class="grid grid-3">
      <div class="card card-pad chart-wrap"><div class="card-h">Route Hours Distribution</div><div class="card-sub">Routes by total hours</div>${bar(hours,hLabels,'')}</div>
      <div class="card card-pad chart-wrap"><div class="card-h">Stops by Day</div><div class="card-sub">Total stops per delivery day</div>${bar(dayStops,dLabels,'blue')}</div>
      <div class="card card-pad chart-wrap"><div class="card-h">Revenue by Territory</div><div class="card-sub">Weekly revenue ($K)</div>${bar(terrRev,tLabels,'')}</div>
    </div>
  </div>`;
}

/* ---- Compare tab ---- */
function compareTab(){
  if(STATE.activeVersion==='baseline'){
    return `<div class="grid-scroll"><div class="grid-panel"><div class="compare-empty">${I.scale}<p>Create or select an Option to compare changes against the Baseline.</p><button class="btn btn-primary btn-sm" style="margin-top:16px" onclick="openModal('optionModal')">${I.plus}Save-As Option</button></div></div></div>`;
  }
  return `<div class="grid-scroll" style="padding:14px 18px">
    <div class="card-h" style="margin-bottom:12px">Baseline vs Option 1</div>
    <div class="grid grid-5">
      <div class="stat"><div class="stat-label">Routes changed</div><div class="stat-value">0</div></div>
      <div class="stat"><div class="stat-label">Stops moved</div><div class="stat-value">0</div></div>
      <div class="stat"><div class="stat-label">Revenue delta</div><div class="stat-value">$0</div></div>
      <div class="stat"><div class="stat-label">Cost delta</div><div class="stat-value">$0</div></div>
      <div class="stat"><div class="stat-label">Hours delta</div><div class="stat-value">0</div></div>
    </div>
    <div class="note" style="margin-top:16px">${I.info}<span>No changes have been made to Option 1 yet. Route balancing and stop moves arrive in Part 2 — deltas will populate here as you edit the Option.</span></div>
  </div>`;
}

/* ---- Detail rail ---- */
function detailRailContent(){
  if(STATE.tab==='stops' && STATE.selectedStop){ return stopDetail(STATE.selectedStop); }
  if(STATE.selectedRoute && (STATE.tab==='routes'||STATE.tab==='stops')){ return routeDetail(STATE.selectedRoute); }
  return `<div class="rail-empty-detail">${I.info}<p>Select a route or stop to view details.</p></div>`;
}
function routeDetail(id){
  const r=ROUTES.find(x=>x.id===id); if(!r) return '';
  const over = r.flag==='over';
  return `<div class="detail-head">
    <h3>Route ${r.id}</h3><div class="dh-sub">${r.day}, ${r.wk}</div>
    <span class="pill ${r.flag}"><span class="pill-dot"></span>${flagMeta[r.flag][0]}</span>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Route Summary</div>
    <div class="detail-metric"><span class="l">Driver</span><span class="v">${r.driver}</span></div>
    <div class="detail-metric"><span class="l">Depot</span><span class="v">${r.depot}</span></div>
    <div class="detail-metric"><span class="l">Territory</span><span class="v">${r.terr}</span></div>
    <div class="detail-metric"><span class="l">Stops</span><span class="v">${r.stops}</span></div>
    <div class="detail-metric"><span class="l">Total Hours</span><span class="v ${over?'over':''}">${r.hours}</span></div>
    <div class="detail-metric"><span class="l">Target Hours</span><span class="v">8h 00m</span></div>
    ${over?`<div class="detail-metric"><span class="l">Over Target By</span><span class="v over">1h 15m</span></div>`:''}
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Metrics</div>
    <div class="detail-metric"><span class="l">Service Time</span><span class="v">${r.svc} min</span></div>
    <div class="detail-metric"><span class="l">Travel Time</span><span class="v">${r.travel} min</span></div>
    <div class="detail-metric"><span class="l">Revenue</span><span class="v">${r.rev}</span></div>
    <div class="detail-metric"><span class="l">Cost</span><span class="v">${r.cost}</span></div>
    <div class="detail-metric"><span class="l">Revenue / Mile</span><span class="v">${r.rpm}</span></div>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Actions</div>
    <div class="detail-actions">
      <button class="btn btn-secondary btn-sm" onclick="part2('Map view will be updated in Part 2.')">${I.map}Show on Map</button>
      <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled':''} ${lockTip()} onclick="${editingLocked()?'':`part2('Stop moves arrive in Part 2.')`}">Move Stops</button>
      <button class="btn btn-secondary btn-sm" onclick="openStops('${r.id}')">Open Stops</button>
      <button class="btn btn-secondary btn-sm" onclick="toast('Note added to Route ${r.id}')">Create Note</button>
    </div>
    ${editingLocked()?`<div class="note" style="margin-top:10px">${I.lock}<span>Baseline is locked. Create an Option to make changes.</span></div>`:''}
  </div>`;
}
function stopDetail(id){
  const s=STOPS.find(x=>x.id===id); if(!s) return '';
  return `<div class="detail-head"><h3>Stop ${s.id}</h3><div class="dh-sub">${s.route} · ${s.day}, ${s.wk}</div></div>
  <div class="detail-sec"><div class="detail-sec-title">Customer</div>
    <div class="detail-metric"><span class="l">Customer ID</span><span class="v mono">${s.cust}</span></div>
    <div class="detail-metric"><span class="l">Customer Name</span><span class="v" id="stopMaskWrap"><span class="masked" id="mask-sd${s.id}">Masked</span></span></div>
    <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;margin-top:8px" id="rev-sd${s.id}" onclick="revealName('sd${s.id}','${SAMPLE_NAMES[s.cust]||'Riverside Market'}')">Reveal name</button>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Route Assignment</div>
    <div class="detail-metric"><span class="l">Route</span><span class="v mono">${s.route}</span></div>
    <div class="detail-metric"><span class="l">Day</span><span class="v">${s.day}</span></div>
    <div class="detail-metric"><span class="l">Week</span><span class="v">${s.wk}</span></div>
    <div class="detail-metric"><span class="l">Sequence</span><span class="v">${s.seq}</span></div>
    <div class="detail-metric"><span class="l">Frequency</span><span class="v">${s.freq}</span></div>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Service Details</div>
    <div class="detail-metric"><span class="l">Service Time</span><span class="v">${s.svc}</span></div>
    <div class="detail-metric"><span class="l">Time Window</span><span class="v">${s.win}</span></div>
    <div class="detail-metric"><span class="l">Estimated Arrival</span><span class="v">${s.arr}</span></div>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Nearby Context</div>
    <div class="detail-metric"><span class="l">Previous Stop</span><span class="v mono">ST-44901</span></div>
    <div class="detail-metric"><span class="l">Next Stop</span><span class="v mono">ST-44903</span></div>
    <div class="detail-metric"><span class="l">Nearest Route</span><span class="v mono">BR-021</span></div>
  </div>
  <div class="detail-sec"><div class="detail-sec-title">Actions</div>
    <div class="detail-actions">
      <button class="btn btn-secondary btn-sm" onclick="part2('Map view will be updated in Part 2.')">${I.map}Show on Map</button>
      <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled':''} ${lockTip()}>Move Stop</button>
      <button class="btn btn-secondary btn-sm" ${editingLocked()?'disabled':''} ${lockTip()}>Shift Day/Week</button>
    </div>
    ${editingLocked()?`<div class="note" style="margin-top:10px">${I.lock}<span>Baseline is locked. Create an Option to make changes.</span></div>`:''}
  </div>`;
}

/* session interactions */
function selectRoute(id){ STATE.selectedRoute=id; STATE.selectedStop=null; document.getElementById('tabContent').innerHTML=tabContent(); document.getElementById('detailRail').innerHTML=detailRailContent(); }
function selectStop(id){ STATE.selectedStop=id; document.getElementById('tabContent').innerHTML=tabContent(); document.getElementById('detailRail').innerHTML=detailRailContent(); }
function openStops(routeId){ STATE.tab='stops'; STATE.stopsFilterRoute=routeId; STATE.selectedStop=null; rerenderSession(); }
function rerenderSession(){ document.getElementById('main').innerHTML=sessionGrid(); }
function switchVersion(v){ STATE.activeVersion=v; rerenderSession(); }

function createOption(){
  const name=document.getElementById('optName').value||'Option 1';
  STATE.hasOption=true; STATE.activeVersion='option1'; STATE.optionName=name;
  closeModal('optionModal'); rerenderSession();
  toast(`${name} created from Baseline. Changes will apply only to this option.`);
}
function optionItem(){ const name=STATE.optionName||'Option 1';
  return `<div class="version-item ${STATE.activeVersion==='option1'?'active':''}" onclick="switchVersion('option1')">
    <div class="vi-top"><span class="vi-name">${I.route}${name}</span>${STATE.activeVersion==='option1'?'<span class="pill ready" style="font-size:10px"><span class="pill-dot"></span>Editing</span>':''}</div>
    <div class="vi-meta">From Baseline · working copy</div>
  </div>`; }

function openSession(){ STATE.tab='routes'; STATE.selectedRoute=null; STATE.selectedStop=null; STATE.stopsFilterRoute=null;
  document.getElementById('main').innerHTML=sessionGrid(); setActiveNav('sessionGrid'); document.getElementById('main').scrollTop=0; }

/* ============================================================
   PART 2 — MAP / LASSO VIEW
   ============================================================ */
let MAP_STATE = 'empty'; // 'empty' | 'selected' | 'preview' | 'applied'

// Marker layout in % of canvas. Groups: br014, br021, others, depots, new, move(the 5 selected)
const MAP_DEPOTS = [ {x:16,y:34,label:'Baton Rouge North'}, {x:74,y:58,label:'Baton Rouge East'} ];
const MAP_BR014 = [[24,28],[29,24],[33,33],[27,38],[36,29],[31,44],[22,46]];
const MAP_MOVE  = [[41,40],[45,44],[43,49],[48,42],[46,50]]; // 5 stops near BR-021 edge
const MAP_BR021 = [[55,55],[60,60],[57,66],[63,54],[66,63],[52,62]];
const MAP_OTHER = [[70,30],[78,38],[82,48],[68,72],[60,78],[40,72],[30,66],[20,62],[74,72],[85,64],[50,34],[62,40],[38,58],[26,56]];
const MAP_NEW   = [[47,36],[58,48],[33,52]];

function markerColor(role){
  if(role==='br014') return '#f59a1f';      // amber = over target
  if(role==='br021') return '#2f6bff';       // blue = destination/underused
  if(role==='move')  return MAP_STATE==='applied' ? '#2f6bff' : '#f59a1f';
  return '#9aa0aa';                           // muted others
}
function renderMarkers(){
  let h='';
  MAP_DEPOTS.forEach(d=>{ h+=`<div class="map-marker" style="left:${d.x}%;top:${d.y}%"><div class="mm-depot">${I.pin}</div></div>`; });
  const muteOthers = MAP_STATE!=='empty';
  MAP_OTHER.forEach(([x,y])=>{ h+=`<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-dot muted" style="background:${markerColor('other')}"></div></div>`; });
  MAP_BR021.forEach(([x,y])=>{ h+=`<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-dot ${muteOthers&&MAP_STATE==='empty'?'':''}" style="background:${markerColor('br021')}"></div></div>`; });
  MAP_BR014.forEach(([x,y])=>{ h+=`<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-dot" style="background:${markerColor('br014')}"></div></div>`; });
  MAP_MOVE.forEach(([x,y])=>{ const sel = (MAP_STATE==='selected'||MAP_STATE==='preview'); h+=`<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-dot ${sel?'sel':''}" style="background:${markerColor('move')}"></div></div>`; });
  MAP_NEW.forEach(([x,y])=>{ h+=`<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-new"></div></div>`; });
  return h;
}
function renderMapBg(){
  return `<svg class="map-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <rect width="100" height="100" fill="#e9edf2"/>
    <path d="M-5 60 Q 25 52 45 62 T 100 64 L 105 105 L -5 105 Z" fill="#dbe6ee"/>
    <path d="M62 -5 Q 68 25 58 45 T 64 100" fill="none" stroke="#c3d6e6" stroke-width="3" opacity=".85"/>
    <circle cx="24" cy="22" r="8" fill="#dfeadb"/><circle cx="80" cy="28" r="6" fill="#dfeadb"/><circle cx="38" cy="80" r="7" fill="#dfeadb"/>
    <g stroke="#f4d98a" stroke-width="1" opacity=".8" fill="none"><path d="M0 38 H100"/><path d="M0 68 H100"/><path d="M20 0 V100"/><path d="M74 0 V100"/></g>
    <g stroke="#ffffff" stroke-width=".7" opacity=".9" fill="none"><path d="M0 22 H100"/><path d="M0 52 H100"/><path d="M0 82 H100"/><path d="M36 0 V100"/><path d="M56 0 V100"/><path d="M88 0 V100"/></g>
  </svg>`;
}
function renderMapOverlay(){
  // lasso polygon + dotted line to destination
  if(MAP_STATE==='empty' || MAP_STATE==='applied') return '';
  const poly = '38,36 51,38 50,54 40,53';
  const cx=44, cy=45, dx=59, dy=60;
  return `<svg class="map-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polygon points="${poly}" fill="rgba(255,205,41,.14)" stroke="#f5b800" stroke-width=".5" stroke-dasharray="1.2 1" />
    ${MAP_STATE==='preview'?`<line x1="${cx}" y1="${cy}" x2="${dx}" y2="${dy}" stroke="#2f6bff" stroke-width=".5" stroke-dasharray="1.4 1.2" stroke-linecap="round"/>`:''}
  </svg>`;
}

function goMap(){ MAP_STATE='empty'; document.getElementById('main').innerHTML=mapView(); setActiveNav('sessionGrid'); document.getElementById('main').scrollTop=0; }

function mapView(){
  return `<div class="screen active"><div class="map-view">
    <div class="map-head">
      ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Map / Lasso'])}
      <div class="session-titlebar">
        <div><h1>Baton Rouge 2026-07 Restructure</h1><div class="sub">Map / Lasso View</div></div>
        <div class="session-actions">
          <div class="active-version-pill"><span class="avp-dot"></span>Active Version: Option 1</div>
          <button class="btn btn-secondary btn-sm" onclick="openSession()">${I.grid}Back to Grid</button>
          <button class="btn btn-secondary btn-sm" onclick="go('balancer')">${I.scale}Run Balancer</button>
          <button class="btn btn-secondary btn-sm" onclick="toast('Option 1 saved')">${I.save}Save Option</button>
        </div>
      </div>
      <div class="session-meta">
        <span class="meta-chip"><span class="mk">Active Version:</span> <b>Option 1</b></span>
        <span class="meta-chip"><span class="mk">View:</span> <b>Routes</b></span>
        <span class="meta-chip"><span class="mk">Stops visible:</span> <b>1,612</b></span>
        <span class="meta-chip"><span class="mk">Routes visible:</span> <b>42</b></span>
        <span class="meta-chip"><span class="mk">Filters:</span> <b>Shared with grid</b></span>
      </div>
    </div>
    <div class="map-toolbar">
      <button class="mini-filter" onclick="openSession()">${I.arrow}Back to Grid</button>
      <span style="width:1px;height:20px;background:var(--border);margin:0 4px"></span>
      <button class="mini-filter" style="background:var(--yellow);border-color:var(--yellow);color:#14161a">Route View</button>
      <button class="mini-filter">Territory View</button>
      <button class="mini-filter">Day View</button>
      <button class="mini-filter">Frequency View</button>
      <span style="width:1px;height:20px;background:var(--border);margin:0 4px"></span>
      <button class="mini-filter ${MAP_STATE!=='empty'?'':''}" onclick="doLasso()" style="${MAP_STATE!=='empty'?'background:var(--yellow);border-color:var(--yellow);color:#14161a':''}">${I.lasso}Lasso Tool</button>
      <button class="mini-filter" onclick="toast('Undo')">${I.undo}</button>
      <button class="mini-filter" onclick="toast('Redo')">${I.redo}</button>
      <div class="toolbar-spacer"></div>
      <button class="btn btn-secondary btn-sm" onclick="go('balancer')">${I.scale}Run Balancer</button>
    </div>

    <div class="map-body">
      <!-- LEFT CONTROL RAIL -->
      <div class="map-rail">
        <div class="rail-title">Map Controls</div>
        <div class="radio-group">
          <div class="radio-row active"><span class="radio-dot"></span>Color by Route</div>
          <div class="radio-row"><span class="radio-dot"></span>Color by Territory</div>
          <div class="radio-row"><span class="radio-dot"></span>Color by Day</div>
          <div class="radio-row"><span class="radio-dot"></span>Color by Frequency</div>
        </div>
        <div class="rail-title">Filters</div>
        <div class="filter-mini"><label class="field-label">Route</label><select class="select"><option>All routes</option><option>BR-014</option><option>BR-021</option></select></div>
        <div class="filter-mini"><label class="field-label">Day of Week</label><select class="select"><option>All days</option><option>Tuesday</option><option>Monday</option></select></div>
        <div class="filter-mini"><label class="field-label">Week of Cycle</label><select class="select"><option>All weeks</option><option>Wk 2</option><option>Wk 3</option></select></div>
        <div class="filter-mini"><label class="field-label">Territory</label><select class="select"><option>All territories</option><option>East Baton Rouge</option><option>Denham</option></select></div>
        <div class="filter-mini"><label class="field-label">Balance Flag</label><select class="select"><option>All</option><option>Over Target</option><option>Underused</option></select></div>
        <div class="rail-title">Tools</div>
        <div class="tool-grid">
          <button class="tool-btn active" onclick="doLasso()">${I.lasso}Lasso</button>
          <button class="tool-btn" onclick="toast('Pin tool')">${I.pin}Pin</button>
          <button class="tool-btn" onclick="toast('Recentered')">${I.center}Recenter</button>
          <button class="tool-btn" onclick="toast('Measure tool')">${I.ruler}Measure</button>
        </div>
        <div class="help-card">${I.info}<span>Lasso stops to preview a bulk move. Changes apply only to Option 1.</span></div>
      </div>

      <!-- MAP CANVAS -->
      <div class="map-canvas-wrap" id="mapCanvas">
        ${renderMapBg()}
        ${renderMapOverlay()}
        ${renderMarkers()}
        ${(MAP_STATE==='preview')?`<div class="preview-badge"><span class="pb-dot"></span>Preview only — not committed</div>`:''}
        <div class="map-ctl-tr">
          <div class="map-seg"><button class="active">Map</button><button>Satellite</button></div>
          <button class="map-round-btn" title="Layers">${I.layers}</button>
        </div>
        <div class="map-ctl-br">
          <div class="map-zoom"><button>+</button><button>−</button></div>
          <button class="map-round-btn" onclick="toast('Recentered')">${I.center}</button>
        </div>
        <div class="map-legend">
          <div class="lt">Legend</div>
          <div class="legend-row"><span class="legend-dot" style="background:#f59a1f"></span>BR-014 · Over Target</div>
          <div class="legend-row"><span class="legend-dot" style="background:#2f6bff"></span>BR-021 · Underused</div>
          <div class="legend-row"><span class="legend-dot" style="background:#9aa0aa"></span>Balanced Routes</div>
          <div class="legend-row"><span class="legend-dot sq"></span>Depot</div>
          <div class="legend-row"><span class="legend-dot ring"></span>New Customer</div>
        </div>
      </div>

      <!-- RIGHT SELECTION RAIL -->
      <div class="sel-rail" id="selRail">${mapSelRail()}</div>
    </div>
  </div></div>`;
}

function mapSelRail(){
  if(MAP_STATE==='empty'){
    return `<div class="sel-head"><h3>Map Selection</h3></div>
      <div class="sel-empty">${I.lasso}<p>Use the Lasso tool to select stops on the map.</p></div>
      <div class="rail-title" style="margin-top:8px">Route Health</div>
      <div class="constraint-line" style="justify-content:space-between"><span><span class="legend-dot" style="display:inline-block;background:var(--amber);margin-right:6px"></span>Over Target</span><b>8 routes</b></div>
      <div class="constraint-line" style="justify-content:space-between"><span><span class="legend-dot" style="display:inline-block;background:var(--green);margin-right:6px"></span>Balanced</span><b>31 routes</b></div>
      <div class="constraint-line" style="justify-content:space-between"><span><span class="legend-dot" style="display:inline-block;background:#9aa0aa;margin-right:6px"></span>Underused</span><b>3 routes</b></div>`;
  }
  if(MAP_STATE==='selected'){
    return `<div class="sel-head"><h3>Lasso Selection</h3><div class="ss">5 stops selected</div></div>
      <div class="sel-cards">
        <div class="sel-card"><div class="l">Selected Stops</div><div class="v">5</div></div>
        <div class="sel-card"><div class="l">Current Route</div><div class="v mono" style="font-size:14px">BR-014</div></div>
        <div class="sel-card"><div class="l">Current Day</div><div class="v" style="font-size:13px">Tuesday</div></div>
        <div class="sel-card"><div class="l">Current Week</div><div class="v" style="font-size:13px">Wk 2</div></div>
      </div>
      <div class="rail-title">Selection Breakdown</div>
      <div class="detail-metric"><span class="l">By Route</span><span class="v">BR-014: 5</span></div>
      <div class="detail-metric"><span class="l">By Day</span><span class="v">Tuesday: 5</span></div>
      <div class="detail-metric"><span class="l">By Week</span><span class="v">Wk 2: 5</span></div>
      <div class="detail-metric"><span class="l">By Territory</span><span class="v">East Baton Rouge: 5</span></div>
      <div class="suggest">
        <div class="st">${I.bulb} Suggested Action</div>
        <p><b>Move selected stops to Route BR-021.</b><br>BR-014 is over target by 1h 15m. BR-021 is underused and geographically near this selected cluster.</p>
      </div>
      <div class="impact-box"><div class="it">Impact Preview</div>
        <div class="impact-line"><span>BR-014</span><span><span class="l">9h 15m</span><span class="arrow">→</span><span class="aft">8h 05m</span></span></div>
        <div class="impact-line"><span>BR-021</span><span><span class="l">6h 12m</span><span class="arrow">→</span><span class="aft">7h 18m</span></span></div>
      </div>
      <div class="rail-title">Constraint Checks</div>
      <div class="constraint-line">${I.check}Time windows preserved</div>
      <div class="constraint-line">${I.check}Same depot group</div>
      <div class="constraint-line">${I.check}No sequence conflicts</div>
      <div class="constraint-line">${I.check}Revenue preserved</div>
      <div class="sel-actions">
        <button class="btn btn-secondary" onclick="clearLasso()">Clear Selection</button>
        <button class="btn btn-primary" onclick="setMapState('preview')">Preview Move</button>
      </div>`;
  }
  if(MAP_STATE==='preview'){
    return `<div class="sel-head"><h3>Preview Bulk Move</h3><div class="ss">Move 5 selected stops</div></div>
      <div class="impact-box" style="margin-top:14px"><div class="it">From → To</div>
        <div class="impact-line"><span class="l">From</span><span style="text-align:right"><b class="mono">BR-014</b><br><span style="font-size:11px;color:var(--text-mute)">Tuesday · Wk 2</span></span></div>
        <div class="impact-line"><span class="l">To</span><span style="text-align:right"><b class="mono">BR-021</b><br><span style="font-size:11px;color:var(--text-mute)">Monday · Wk 3</span></span></div>
      </div>
      <div class="rail-title">Before / After</div>
      <div class="detail-metric"><span class="l">BR-014 stops</span><span class="v">68 <span class="arrow" style="color:var(--text-mute)">→</span> 63</span></div>
      <div class="detail-metric"><span class="l">BR-014 hours</span><span class="v"><span style="color:var(--text-mute);font-weight:500">9h 15m</span> → <span style="color:var(--green)">8h 05m</span></span></div>
      <div class="detail-metric"><span class="l">BR-014 status</span><span class="v"><span class="status-change"><span class="pill over" style="padding:1px 7px">Over</span><span class="arrow">→</span><span class="pill balanced" style="padding:1px 7px">Balanced</span></span></span></div>
      <div class="detail-metric"><span class="l">BR-021 stops</span><span class="v">39 <span class="arrow" style="color:var(--text-mute)">→</span> 44</span></div>
      <div class="detail-metric"><span class="l">BR-021 hours</span><span class="v"><span style="color:var(--text-mute);font-weight:500">6h 12m</span> → <span style="color:var(--green)">7h 18m</span></span></div>
      <div class="detail-metric"><span class="l">BR-021 status</span><span class="v"><span class="status-change"><span class="pill under" style="padding:1px 7px">Under</span><span class="arrow">→</span><span class="pill balanced" style="padding:1px 7px">Balanced</span></span></span></div>
      <div class="rail-title">Estimated Impact</div>
      <div class="constraint-line">${I.check}Route balance improves</div>
      <div class="constraint-line">${I.check}Overtime risk reduced</div>
      <div class="constraint-line">${I.check}No revenue loss</div>
      <div class="constraint-line">${I.check}All stops remain within service windows</div>
      <div class="option-warn">${I.info}<span>This change will be committed to <b>Option 1</b>. Baseline will remain unchanged.</span></div>
      <div class="sel-actions">
        <button class="btn btn-secondary" onclick="setMapState('selected')">Cancel Preview</button>
        <button class="btn btn-primary" onclick="applyLassoMove()">Apply Move</button>
      </div>`;
  }
  // applied
  return `<div class="sel-head"><h3>Move Applied</h3><div class="ss">The selected stops have been moved successfully.</div></div>
    <div class="rail-title" style="margin-top:14px">Updated Route Metrics</div>
    <div class="impact-box" style="margin-top:0">
      <div class="impact-line"><span><b class="mono">BR-014</b></span><span class="aft">63 stops · 8h 05m</span></div>
      <div class="impact-line"><span class="l">Status</span><span><span class="pill balanced" style="padding:1px 8px">Balanced</span></span></div>
    </div>
    <div class="impact-box">
      <div class="impact-line"><span><b class="mono">BR-021</b></span><span class="aft">44 stops · 7h 18m</span></div>
      <div class="impact-line"><span class="l">Status</span><span><span class="pill balanced" style="padding:1px 8px">Balanced</span></span></div>
    </div>
    <div class="rail-title">Option Delta</div>
    <div class="detail-metric"><span class="l">Stops moved</span><span class="v">5</span></div>
    <div class="detail-metric"><span class="l">Routes changed</span><span class="v">2</span></div>
    <div class="detail-metric"><span class="l">Revenue delta</span><span class="v">$0</span></div>
    <div class="detail-metric"><span class="l">Est. cost delta</span><span class="v delta-neg">−$180</span></div>
    <div class="sel-actions" style="flex-direction:column">
      <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="go('balancer')">${I.scale}Run Balancer ${I.arrow}</button>
      <div style="display:flex;gap:8px;width:100%">
        <button class="btn btn-secondary" style="flex:1;justify-content:center" onclick="openSession()">Review in Grid</button>
        <button class="btn btn-secondary" style="flex:1;justify-content:center" onclick="undoLasso()">Undo Move</button>
      </div>
    </div>`;
}

function setMapState(s){ MAP_STATE=s; document.getElementById('main').innerHTML=mapView(); }
function doLasso(){ setMapState('selected'); toast('5 stops selected with Lasso'); }
function clearLasso(){ setMapState('empty'); }
function applyLassoMove(){ STATE.lassoMoveApplied=true; setMapState('applied'); toast('5 stops moved from BR-014 to BR-021 in Option 1.'); }
function undoLasso(){ STATE.lassoMoveApplied=false; setMapState('empty'); toast('Move undone'); }

/* ============================================================
   PART 2 — ROUTE BALANCING
   ============================================================ */
function balStepper(active){
  const steps=[['1','Objective'],['2','Run Balancer'],['3','Review Moves'],['4','Accept Changes']];
  return `<div class="stepper">${steps.map((s,i)=>{const idx=i+1;const cls=idx<active?'complete':idx===active?'active':'';const sep=i<steps.length-1?'<span class="step-sep">›</span>':'';const num=idx<active?I.check:s[0];
    return `<div class="step ${cls}"><span class="step-num">${num}</span><span class="step-txt">${s[1]}</span></div>${sep}`;}).join('')}</div>`;
}
function balMeta(){
  return `<div class="metadata-strip">
    <div class="meta-chip"><span class="mk">Session:</span> <b>Baton Rouge 2026-07 Restructure</b></div>
    <div class="meta-chip"><span class="mk">Active Version:</span> <b>Option 1</b></div>
    <div class="meta-chip"><span class="mk">Baseline:</span> <b>Locked</b></div>
    <div class="meta-chip"><span class="mk">Stops:</span> <b>1,612</b></div>
    <div class="meta-chip"><span class="mk">Routes:</span> <b>42</b></div>
  </div>`;
}

function balancer(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Route Balancing'])}
    ${head('Route Balancing','Choose an objective, review active constraints, and generate proposed moves for Option 1.')}
    ${balStepper(1)}
    ${balMeta()}
    <div class="two-col-even">
      <div class="card card-pad">
        <div class="card-h">Choose Balancing Objective</div>
        <div class="card-sub">The analyst is the decision-maker — the balancer only proposes moves.</div>
        <div class="radio-group">
          <div class="radio-row active"><span class="radio-dot"></span>Balance Route Hours</div>
          <div class="radio-row"><span class="radio-dot"></span>Minimize Travel Time</div>
          <div class="radio-row"><span class="radio-dot"></span>Reduce Over Target Routes</div>
          <div class="radio-row"><span class="radio-dot"></span>Balance Stops by Day</div>
          <div class="radio-row"><span class="radio-dot"></span>Balance Weeks</div>
          <div class="radio-row"><span class="radio-dot"></span>Improve Territory Compactness</div>
        </div>
        <div class="note" style="margin-top:14px">${I.info}<span><b>Balance Route Hours</b> will reduce workload differences across routes while preserving route rules and service windows.</span></div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Active Constraints</div>
        <div class="card-sub">Hard constraints are always enforced.</div>
        <div class="detail-sec-title">Hard constraints</div>
        ${['Preserve customer service windows','Preserve cycle pattern','Preserve scenario rules','Preserve depot eligibility'].map(c=>`<div class="constraint-line" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:8px">${I.lock}${c}</span><span class="pill locked">Hard</span></div>`).join('')}
        <div class="detail-sec-title" style="margin-top:14px">Optional constraints</div>
        <div class="constraint-line" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:8px"><span class="check-box" style="background:var(--yellow);border-color:var(--yellow);display:grid;place-items:center">${I.check.replace('width="','width="10" data-w="')}</span>Minimize day changes</span></div>
        <div class="constraint-line" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:8px"><span class="check-box"></span>Minimize week changes</span></div>
        <div class="constraint-line" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:8px"><span class="check-box" style="background:var(--yellow);border-color:var(--yellow);display:grid;place-items:center">${I.check.replace('width="','width="10" data-w="')}</span>Keep territory boundaries where possible</span></div>
      </div>
    </div>
    <div class="card card-pad" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:20px">
      <div style="display:flex;gap:12px;align-items:flex-start"><div class="stat-icon" style="flex-shrink:0">${I.scale}</div>
      <div><div class="card-h" style="margin:0">Ready to run</div><div class="card-sub" style="margin:2px 0 0">The balancer will evaluate route assignments inside Option 1 and produce proposed moves. Nothing will be committed until accepted.</div></div></div>
      <div style="display:flex;gap:10px;flex-shrink:0">
        <button class="btn btn-secondary" onclick="goMap()">Back to Map</button>
        <button class="btn btn-primary" onclick="runBalancer()">${I.scale}Run Balancer ${I.arrow}</button>
      </div>
    </div>
  </div></div>`;
}

const BAL_STEPS=['Considering 12,847 possible moves…','Checking service windows…','Evaluating route hour balance…','Scoring territory compactness…','Generating proposed moves…'];
function runBalancer(){
  document.getElementById('main').innerHTML=`<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Route Balancing'])}
    ${head('Route Balancing','Choose an objective, review active constraints, and generate proposed moves for Option 1.')}
    ${balStepper(2)}
    <div class="progress-panel">
      <h2>Running balancer for Option 1</h2>
      <div class="big-progress-bar"><div class="big-progress-fill" id="balFill" style="width:8%"></div></div>
      <div class="progress-pct" id="balPct">8%</div>
      <div class="progress-steps" id="balSteps">${BAL_STEPS.map(s=>`<div class="pstep"><span class="ps-ic"></span>${s}</div>`).join('')}</div>
      <div class="note" style="margin-top:18px">${I.info}<span>This may take 30 to 90 seconds. You can leave this screen while the job runs.</span></div>
    </div>
  </div></div>`;
  const steps=document.querySelectorAll('#balSteps .pstep');
  const fill=document.getElementById('balFill'); const pct=document.getElementById('balPct');
  let i=0; const pcts=[22,43,64,82,100];
  const tick=()=>{ if(i<steps.length){ if(i>0){steps[i-1].classList.remove('active');steps[i-1].classList.add('done');steps[i-1].querySelector('.ps-ic').innerHTML=I.check;}
      steps[i].classList.add('active'); steps[i].querySelector('.ps-ic').innerHTML='<span class="spin-sm"></span>';
      fill.style.width=pcts[i]+'%'; pct.textContent=pcts[i]+'%'; i++; setTimeout(tick,620);
    } else { setTimeout(()=>go('proposedMoves'),450); } };
  setTimeout(tick,400);
}

const PROPOSED = [
  {sel:true, name:'Move cluster near Highland Road', src:'BR-018', dst:'BR-024', stops:4, dayCh:'No', wkCh:'No', hrs:'−42 min', cost:'−$120', reason:'Reduces overload', conf:'high'},
  {sel:true, name:'Move campus grocery cluster', src:'BR-014', dst:'BR-021', stops:3, dayCh:'No', wkCh:'Yes', hrs:'−31 min', cost:'−$80', reason:'Balances week load', conf:'high'},
  {sel:true, name:'Move Denham edge stops', src:'BR-033', dst:'BR-021', stops:2, dayCh:'Yes', wkCh:'No', hrs:'−18 min', cost:'−$40', reason:'Improves compactness', conf:'medium'},
  {sel:false, name:'Move River Parish stops', src:'BR-027', dst:'BR-031', stops:5, dayCh:'Yes', wkCh:'Yes', hrs:'−26 min', cost:'−$55', reason:'Improves route hours', conf:'medium'},
];
let SELECTED_MOVE = 0;

function proposedMoves(){
  const selCount = PROPOSED.filter(m=>m.sel).length;
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Route Balancing'])}
    ${head('Review Proposed Moves','Inspect balancing suggestions before committing any changes to Option 1.')}
    ${balStepper(3)}
    <div class="grid grid-5" style="grid-template-columns:repeat(6,1fr)">
      <div class="stat"><div class="stat-label">Proposed Moves</div><div class="stat-value">14</div></div>
      <div class="stat"><div class="stat-label">Over Target Routes</div><div class="stat-value">7 <span style="font-size:14px;color:var(--text-mute)">→</span> <span style="color:var(--green)">4</span></div></div>
      <div class="stat"><div class="stat-label">Avg Route Hours</div><div class="stat-value" style="font-size:17px">7h 36m <span style="font-size:12px;color:var(--text-mute)">→</span> <span style="color:var(--green)">7h 28m</span></div></div>
      <div class="stat"><div class="stat-label">Estimated Cost</div><div class="stat-value" style="font-size:15px">$37,880 <span style="font-size:11px;color:var(--text-mute)">→</span> <span style="color:var(--green)">$37,420</span></div></div>
      <div class="stat"><div class="stat-label">Revenue Impact</div><div class="stat-value">$0</div></div>
      <div class="stat"><div class="stat-label">Constraint Violations</div><div class="stat-value" style="color:var(--green)">0</div></div>
    </div>
    <div class="two-col" style="margin-top:20px">
      <div class="card">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border)"><div class="card-h" style="margin:0">Proposed Moves</div></div>
        <div class="table-wrap"><table class="tbl-dense" id="propTable">
          <thead><tr><th class="check-col"></th><th>Move</th><th>Source</th><th>Dest</th><th>Stops</th><th>Day Δ</th><th>Wk Δ</th><th>Hours Δ</th><th>Cost Δ</th><th>Reason</th><th>Conf.</th><th></th></tr></thead>
          <tbody>
            ${PROPOSED.map((m,i)=>`<tr class="row-click ${SELECTED_MOVE===i?'selected':''}" onclick="selectMove(${i})">
              <td class="check-col"><span class="check-box" style="${m.sel?'background:var(--yellow);border-color:var(--yellow)':''}" onclick="event.stopPropagation();toggleMove(${i})"></span></td>
              <td class="strong">${m.name}</td><td class="mono">${m.src}</td><td class="mono">${m.dst}</td><td>${m.stops}</td>
              <td class="${m.dayCh==='Yes'?'':'muted'}">${m.dayCh}</td><td class="${m.wkCh==='Yes'?'':'muted'}">${m.wkCh}</td>
              <td class="delta-neg">${m.hrs}</td><td class="delta-neg">${m.cost}</td><td class="muted">${m.reason}</td>
              <td><span class="conf ${m.conf}">${m.conf==='high'?'High':'Medium'}</span></td>
              <td><span class="reveal-btn" onclick="event.stopPropagation();viewMoveOnMap(${i})">View on Map</span></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
      <div class="card card-pad" id="moveDetail">${moveDetail(SELECTED_MOVE)}</div>
    </div>
    <div class="card card-pad" style="margin-top:14px;display:flex;align-items:center;justify-content:space-between">
      <div class="bb-info">Selected moves: <b id="selMoveCount">${selCount}</b> of 14</div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-secondary" onclick="go('balancer')">Back to Objective</button>
        <button class="btn btn-danger" onclick="openSession(); toast('All proposed moves discarded')">Discard All</button>
        <button class="btn btn-primary" onclick="openModal('acceptModal')">Accept Selected Moves</button>
      </div>
    </div>
  </div></div>`;
}
function moveDetail(i){
  const m=PROPOSED[i];
  const ba = {0:['BR-018','8h 55m → 8h 13m','BR-024','6h 48m → 7h 30m','Thursday, Wk 2','Thursday, Wk 2'],
    1:['BR-014','8h 05m → 7h 34m','BR-021','7h 18m → 7h 49m','Tuesday, Wk 2','Monday, Wk 3'],
    2:['BR-033','7h 31m → 7h 13m','BR-021','7h 49m → 8h 07m','Wednesday, Wk 1','Monday, Wk 3'],
    3:['BR-027','8h 40m → 8h 14m','BR-031','6h 30m → 6h 56m','Friday, Wk 1','Thursday, Wk 4']}[i];
  return `<div class="card-h">${m.name}</div>
    <div class="impact-box" style="margin-top:10px"><div class="it">From → To</div>
      <div class="impact-line"><span class="l">From</span><span style="text-align:right"><b class="mono">${m.src}</b><br><span style="font-size:11px;color:var(--text-mute)">${ba[4]}</span></span></div>
      <div class="impact-line"><span class="l">To</span><span style="text-align:right"><b class="mono">${m.dst}</b><br><span style="font-size:11px;color:var(--text-mute)">${ba[5]}</span></span></div>
      <div class="impact-line"><span class="l">Stops</span><span class="v">${m.stops}</span></div>
    </div>
    <div class="detail-sec-title" style="margin-top:14px">Why this move</div>
    <div class="constraint-line">${I.check}${m.src} is over target</div>
    <div class="constraint-line">${I.check}${m.dst} has available capacity</div>
    <div class="constraint-line">${I.check}Stops are geographically closer to ${m.dst}</div>
    <div class="constraint-line">${I.check}No service windows are missed</div>
    <div class="detail-sec-title" style="margin-top:14px">Before / After</div>
    <div class="detail-metric"><span class="l">${m.src}</span><span class="v good">${ba[1]}</span></div>
    <div class="detail-metric"><span class="l">${m.dst}</span><span class="v good">${ba[3]}</span></div>
    <div class="mini-map">${renderMapBg().replace('map-svg-bg','')}</div>
    <div class="detail-actions">
      <button class="btn btn-secondary btn-sm" onclick="viewMoveOnMap(${i})">${I.map}View on Map</button>
      <button class="btn btn-secondary btn-sm" onclick="toggleMove(${i})">${PROPOSED[i].sel?'Exclude Move':'Include Move'}</button>
    </div>`;
}
function selectMove(i){ SELECTED_MOVE=i; document.getElementById('moveDetail').innerHTML=moveDetail(i);
  document.querySelectorAll('#propTable tbody tr').forEach((tr,idx)=>tr.classList.toggle('selected',idx===i)); }
function toggleMove(i){ PROPOSED[i].sel=!PROPOSED[i].sel; document.getElementById('main').innerHTML=proposedMoves(); }
function viewMoveOnMap(i){ toast(`Showing ${PROPOSED[i].src} → ${PROPOSED[i].dst} on map preview`); }

function acceptMoves(){ STATE.balancerAccepted=true; closeModal('acceptModal'); go('movesAccepted'); }

function movesAccepted(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Route Balancing'])}
    ${head('Route Balancing Complete','Accepted moves have been committed to Option 1. Baseline remains unchanged.')}
    ${balStepper(4)}
    <div class="banner"><div class="bi">${I.check}</div><div><div class="bt">3 moves accepted and committed to Option 1</div><div class="bd">Baseline remains immutable. Route metrics recalculated.</div></div></div>
    <div class="grid grid-5" style="grid-template-columns:repeat(6,1fr)">
      <div class="stat"><div class="stat-label">Stops moved</div><div class="stat-value">9</div></div>
      <div class="stat"><div class="stat-label">Routes improved</div><div class="stat-value">6</div></div>
      <div class="stat"><div class="stat-label">Over Target Routes</div><div class="stat-value">7 <span style="font-size:14px;color:var(--text-mute)">→</span> <span style="color:var(--green)">4</span></div></div>
      <div class="stat"><div class="stat-label">Underused Routes</div><div class="stat-value">2 <span style="font-size:14px;color:var(--text-mute)">→</span> <span style="color:var(--green)">1</span></div></div>
      <div class="stat"><div class="stat-label">Estimated Cost</div><div class="stat-value" style="font-size:15px">$37,880 <span style="font-size:11px;color:var(--text-mute)">→</span> <span style="color:var(--green)">$37,420</span></div></div>
      <div class="stat"><div class="stat-label">Revenue Impact</div><div class="stat-value">$0</div></div>
    </div>
    <div class="sec-title"><h2>Accepted Moves</h2></div>
    <div class="card table-wrap"><table class="tbl-dense">
      <thead><tr><th>Move</th><th>Route Change</th><th>Stops</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td class="strong">Move cluster near Highland Road</td><td class="mono">BR-018 → BR-024</td><td>4 stops</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
        <tr><td class="strong">Move campus grocery cluster</td><td class="mono">BR-014 → BR-021</td><td>3 stops</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
        <tr><td class="strong">Move Denham edge stops</td><td class="mono">BR-033 → BR-021</td><td>2 stops</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
      </tbody>
    </table></div>
    <div style="display:flex;gap:10px;margin-top:20px">
      <button class="btn btn-secondary" onclick="openSession()">Back to Planner</button>
      <button class="btn btn-primary" onclick="go('finalMetrics')">Review Final Metrics ${I.arrow}</button>
    </div>
  </div></div>`;
}

/* ============================================================
   PART 2 — FINAL METRICS REVIEW
   ============================================================ */
let FINAL_TAB='health';
function finalMetrics(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Final Metrics'])}
    ${head('Final Metrics Review','Review Option 1 against the immutable baseline before finalizing the route plan.')}
    <div class="metadata-strip"><div class="meta-chip"><span class="mk">Comparison:</span> <b>Baseline vs Option 1</b></div></div>
    <div class="grid grid-4">
      <div class="stat"><div class="stat-label">Total Routes</div><div class="stat-value">42 <span style="font-size:14px;color:var(--text-mute)">→</span> 42</div></div>
      <div class="stat"><div class="stat-label">Total Stops</div><div class="stat-value">1,612 <span style="font-size:14px;color:var(--text-mute)">→</span> 1,612</div></div>
      <div class="stat"><div class="stat-label">Average Route Hours</div><div class="stat-value" style="font-size:17px">7h 42m <span style="font-size:12px;color:var(--text-mute)">→</span> <span style="color:var(--green)">7h 28m</span></div></div>
      <div class="stat"><div class="stat-label">Over Target Routes</div><div class="stat-value">8 <span style="font-size:14px;color:var(--text-mute)">→</span> <span style="color:var(--green)">4</span></div></div>
      <div class="stat"><div class="stat-label">Underused Routes</div><div class="stat-value">3 <span style="font-size:14px;color:var(--text-mute)">→</span> <span style="color:var(--green)">1</span></div></div>
      <div class="stat"><div class="stat-label">Estimated Weekly Cost</div><div class="stat-value" style="font-size:15px">$38,420 <span style="font-size:11px;color:var(--text-mute)">→</span> <span style="color:var(--green)">$37,420</span></div></div>
      <div class="stat"><div class="stat-label">Estimated Revenue</div><div class="stat-value" style="font-size:16px">$428,950</div></div>
      <div class="stat"><div class="stat-label">Net Revenue Impact</div><div class="stat-value">$0</div></div>
    </div>
    <div class="two-col" style="margin-top:20px">
      <div class="card">
        <div class="tabs-bar" style="padding:0 16px;margin-bottom:0" id="finalTabs">
          ${['health:Route Health','moves:Moves Applied','heat:Day Heat','terr:Territory Rollup','stoplist:Stop List Preview'].map(t=>{const[k,l]=t.split(':');return `<button class="tab-btn ${FINAL_TAB===k?'active':''}" onclick="setFinalTab('${k}')">${l}</button>`;}).join('')}
        </div>
        <div id="finalTabContent" class="table-wrap">${finalTabContent()}</div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Finalization Checklist</div>
        <div class="card-sub">All items are ready.</div>
        <div class="checklist">
          ${['Latest ingest committed','Session baseline snapshot exists','Option 1 saved','All accepted moves committed','Baseline remains unchanged','Route metrics recalculated','Stop List preview generated'].map(t=>`<div class="ci"><div class="check-ic">${I.check}</div><span>${t}</span></div>`).join('')}
        </div>
        <div class="note" style="margin-top:14px">${I.info}<span>Stop List export will include the finalized Option 1 route state for Baton Rouge 2026-07 Restructure.</span></div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
          <button class="btn btn-primary" style="justify-content:center" onclick="go('finalize')">Finalize Option 1 ${I.arrow}</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="go('balancer')">Back to Balancer</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="openSession()">Back to Planner</button>
        </div>
      </div>
    </div>
  </div></div>`;
}
function setFinalTab(t){ FINAL_TAB=t; document.getElementById('finalTabContent').innerHTML=finalTabContent();
  document.querySelectorAll('#finalTabs .tab-btn').forEach(b=>b.classList.remove('active')); event.target.closest('.tab-btn').classList.add('active'); }
function finalTabContent(){
  if(FINAL_TAB==='health'){
    const rows=[['BR-014','9h 15m','7h 54m','-8','Over Target → Balanced','−$160','$0'],
      ['BR-021','6h 12m','7h 42m','+10','Underused → Balanced','+$110','$0'],
      ['BR-018','8h 55m','8h 13m','-4','Over Target → Balanced','−$120','$0'],
      ['BR-024','6h 48m','7h 30m','+4','Underused → Balanced','+$90','$0']];
    return `<table class="tbl-dense"><thead><tr><th>Route</th><th>Baseline Hours</th><th>Option 1 Hours</th><th>Stops Δ</th><th>Status Change</th><th>Cost Δ</th><th>Revenue Δ</th></tr></thead>
      <tbody>${rows.map(r=>`<tr><td class="mono strong">${r[0]}</td><td class="muted">${r[1]}</td><td class="strong" style="color:var(--green)">${r[2]}</td><td>${r[3]}</td><td><span class="status-change"><span style="color:var(--text-mute)">${r[4].split('→')[0]}</span><span class="arrow">→</span><span class="pill balanced" style="padding:1px 7px">Balanced</span></span></td><td class="${r[5].includes('−')?'delta-neg':'delta-pos'}">${r[5]}</td><td class="muted">${r[6]}</td></tr>`).join('')}</tbody></table>`;
  }
  if(FINAL_TAB==='moves'){
    return `<table class="tbl-dense"><thead><tr><th>Move</th><th>Source</th><th>Dest</th><th>Stops</th><th>Type</th><th>Status</th></tr></thead><tbody>
      <tr><td class="strong">Lasso move (campus edge)</td><td class="mono">BR-014</td><td class="mono">BR-021</td><td>5</td><td>Manual Lasso</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
      <tr><td class="strong">Cluster near Highland Road</td><td class="mono">BR-018</td><td class="mono">BR-024</td><td>4</td><td>Balancer</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
      <tr><td class="strong">Campus grocery cluster</td><td class="mono">BR-014</td><td class="mono">BR-021</td><td>3</td><td>Balancer</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
      <tr><td class="strong">Denham edge stops</td><td class="mono">BR-033</td><td class="mono">BR-021</td><td>2</td><td>Balancer</td><td><span class="pill committed"><span class="pill-dot"></span>Applied</span></td></tr>
    </tbody></table>`;
  }
  if(FINAL_TAB==='heat'){ FINAL_TAB='heat'; return `<div style="padding:18px">${dayHeatInner()}</div>`; }
  if(FINAL_TAB==='terr'){
    const rows=[['East Baton Rouge',8,307,'7h 58m','$68,400','Balanced'],['Campus',6,241,'7h 30m','$52,120','Balanced'],['Denham',6,201,'7h 24m','$41,200','Balanced']];
    return `<table class="tbl-dense"><thead><tr><th>Territory</th><th>Routes</th><th>Stops</th><th>Avg Hours</th><th>Revenue</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="strong">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="pill balanced"><span class="pill-dot"></span>${r[5]}</span></td></tr>`).join('')}</tbody></table>`;
  }
  // stoplist preview mini
  return `<table class="tbl-dense"><thead><tr><th>Route</th><th>Stop</th><th>Customer</th><th>Day</th><th>Wk</th><th>Seq</th><th>Svc</th><th>Window</th></tr></thead><tbody>
    <tr><td class="mono">BR-001</td><td class="mono">ST-44001</td><td class="mono">1045821</td><td>Monday</td><td>Wk 1</td><td>1</td><td>18 min</td><td class="muted">08:00–11:00 AM</td></tr>
    <tr><td class="mono">BR-001</td><td class="mono">ST-44002</td><td class="mono">1031882</td><td>Monday</td><td>Wk 1</td><td>2</td><td>22 min</td><td class="muted">08:00–12:00 PM</td></tr>
    <tr><td class="mono">BR-014</td><td class="mono">ST-44902</td><td class="mono">1045823</td><td>Tuesday</td><td>Wk 2</td><td>12</td><td>18 min</td><td class="muted">08:00–11:00 AM</td></tr>
  </tbody></table><div class="grid-foot"><span>Preview · full Stop List available at export</span></div>`;
}
function dayHeatInner(){
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const data={Monday:[298,286,286,301],Tuesday:[340,352,348,336],Wednesday:[312,320,318,305],Thursday:[288,296,299,291],Friday:[274,268,271,270],Saturday:[92,88,95,90]};
  const max=352; const hc=v=>`hsl(45 100% ${100-Math.round((v/max)*55)}%)`;
  return `<div class="card-h">Stop Distribution — Day × Week (Option 1)</div><div class="card-sub">More balanced after route balancing.</div>
  <table class="heatmap"><thead><tr><th></th><th>Wk 1</th><th>Wk 2</th><th>Wk 3</th><th>Wk 4</th></tr></thead>
  <tbody>${days.map(d=>`<tr><td class="heat-label">${d}</td>${data[d].map(v=>`<td><div class="heat-cell" style="background:${hc(v)}">${v}<div class="heat-sub">stops</div></div></td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/* ============================================================
   PART 2 — FINALIZE OPTION
   ============================================================ */
function finalize(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Finalize'])}
    ${head('Finalize Option 1','Lock the approved route plan and prepare the Stop List export.')}
    <div class="center-card" style="max-width:600px">
      <div class="big-check" style="background:var(--yellow-soft);color:var(--yellow-strong)">${I.lock}</div>
      <h2>Option 1 is ready to finalize</h2>
      <div class="detail-list" style="text-align:left">
        <div class="drow"><span class="dk">Session</span><span class="dv">Baton Rouge 2026-07 Restructure</span></div>
        <div class="drow"><span class="dk">Market · Cycle</span><span class="dv">Baton Rouge · 4 Week</span></div>
        <div class="drow"><span class="dk">Scenario · Period</span><span class="dv">BASELINE · July 2026 Cycle</span></div>
        <div class="drow"><span class="dk">Routes · Stops · Customers</span><span class="dv">42 · 1,612 · 2,846</span></div>
        <div class="drow"><span class="dk">Moves applied (total)</span><span class="dv">14</span></div>
        <div class="drow"><span class="dk">Accepted balancer moves</span><span class="dv">3</span></div>
        <div class="drow"><span class="dk">Manual lasso move</span><span class="dv">1</span></div>
      </div>
      <div class="route-id-box">
        <div class="rl">Sequential Route IDs</div>
        <p>Route IDs will be assigned and locked during finalization.</p>
        <span class="example">BR-001 → BR-042</span>
      </div>
      <div class="option-warn" style="text-align:left;margin-top:14px">${I.info}<span>After finalization, this option becomes the official route plan for this session. Further edits require creating a new option or reopening the plan with permission.</span></div>
      <div class="cta-row">
        <button class="btn btn-secondary" onclick="go('finalMetrics')">Cancel</button>
        <button class="btn btn-primary" onclick="finalizeNow()">${I.lock}Finalize Route Plan</button>
      </div>
    </div>
  </div></div>`;
}
function finalizeNow(){ STATE.finalized=true; go('finalized'); }

function finalized(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Finalized'])}
    ${head('Route Plan Finalized','Option 1 has been finalized for Baton Rouge 2026-07 Restructure.')}
    <div class="center-card">
      <div class="big-check">${I.check}</div>
      <h2>Option 1 has been finalized</h2>
      <p class="lead">The approved route plan is locked. You can now export the Stop List for downstream route processing.</p>
      <div class="grid grid-4" style="margin-top:22px;text-align:left">
        <div class="stat"><div class="stat-label">Finalized Version</div><div class="stat-value" style="font-size:16px">Option 1</div></div>
        <div class="stat"><div class="stat-label">Routes</div><div class="stat-value">42</div></div>
        <div class="stat"><div class="stat-label">Stops</div><div class="stat-value">1,612</div></div>
        <div class="stat"><div class="stat-label">Route IDs</div><div class="stat-value" style="font-size:14px">BR-001 → BR-042</div></div>
      </div>
      <div class="cta-row">
        <button class="btn btn-secondary" onclick="openSession()">Back to Sessions</button>
        <button class="btn btn-secondary" onclick="openSession()">View Finalized Plan</button>
        <button class="btn btn-primary" onclick="go('exportStopList')">Export Stop List ${I.arrow}</button>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   PART 2 — EXPORT STOP LIST
   ============================================================ */
const STOPLIST_FIELDS=['Route ID','Stop ID','Customer ID','Territory','Depot','Driver','Day','Week','Sequence','Service Time','Travel Time','Arrival Time','Time Window','Service Pattern','Location Extension','Revenue','Cost'];
function exportStopList(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Export'])}
    ${head('Export Stop List','Generate the finalized Stop List for Tech Sales Support and downstream route processing.')}
    <div class="metadata-strip">
      <div class="meta-chip"><span class="mk">Session:</span> <b>Baton Rouge 2026-07 Restructure</b></div>
      <div class="meta-chip"><span class="mk">Finalized Version:</span> <b>Option 1</b></div>
      <div class="meta-chip"><span class="mk">Market · Cycle:</span> <b>Baton Rouge · 4 Week</b></div>
      <div class="meta-chip"><span class="mk">Scenario:</span> <b>BASELINE</b></div>
      <div class="meta-chip"><span class="mk">Routes · Stops:</span> <b>42 · 1,612</b></div>
    </div>
    <div class="two-col">
      <div class="card card-pad">
        <div class="card-h">Stop List Export</div>
        <div class="card-sub">The Stop List contains the finalized route, stop, day, week, sequence, service time, and customer extension data for the approved route plan.</div>
        <div class="detail-sec-title">Included fields</div>
        <div class="field-chips">${STOPLIST_FIELDS.map(f=>`<span class="field-chip">${f}</span>`).join('')}</div>
        <div class="detail-sec-title" style="margin-top:16px">Export format</div>
        <div style="font-size:12.5px;color:var(--text-soft)">Excel <b>.xlsx</b></div>
        <div class="export-filename">${I.sheet}Stop_List_BatonRouge_2026_07_Option1.xlsx</div>
        <div style="display:flex;gap:10px;margin-top:18px">
          <button class="btn btn-secondary" onclick="go('stopListPreview')">${I.eye||I.search}Preview Stop List</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="generateStopList()">Generate Stop List ${I.arrow}</button>
        </div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Downstream Notes</div>
        <div class="detail-sec-title" style="margin-top:8px">After Stop List Export</div>
        <div class="card-sub" style="margin:0">The Stop List can be handed off for downstream processing. The current manual step of converting the Stop List into the cleaned handheld upload workbook is still marked as TBD for this phase.</div>
        <div class="tbd-item">
          <div class="tbd-ic">${I.sheet}</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600">Cleaned Sheet / Handheld Upload Workbook</div><div style="font-size:11.5px;color:var(--text-mute)">Scope TBD for this phase</div></div>
          <span class="pill tbd">TBD</span>
        </div>
        <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" disabled title="Scope TBD for this phase">Generate Cleaned Sheet</button>
      </div>
    </div>
  </div></div>`;
}

const STOPLIST_PREVIEW_COLS=['Route ID','Stop ID','Customer ID','Customer Name','Depot','Territory','Day','Week','Seq','Service','Arrival','Time Window','Pattern','Location Ext','Revenue','Cost'];
function stopListPreview(){
  const rows=[
    ['BR-001','ST-44001','1045821','Baton Rouge North','East Baton Rouge','Monday','Wk 1','1','18 min','08:10 AM','08:00 AM – 11:00 AM','Weekly','EXT-1045821','$420','$28'],
    ['BR-001','ST-44002','1031882','Baton Rouge North','East Baton Rouge','Monday','Wk 1','2','22 min','08:35 AM','08:00 AM – 12:00 PM','Weekly','EXT-1031882','$380','$31'],
    ['BR-014','ST-44902','1045823','Baton Rouge North','East Baton Rouge','Tuesday','Wk 2','12','18 min','08:40 AM','08:00 AM – 11:00 AM','Weekly','EXT-1045823','$510','$36'],
  ];
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Export','Preview'])}
    ${head('Stop List Preview','Review the finalized stop list fields before export.')}
    <div class="two-col">
      <div class="card">
        <div class="grid-toolbar">
          <div class="toolbar-search">${I.search}<input placeholder="Search route, stop, or customer ID" /></div>
          <button class="mini-filter">Route ${I.chevron}</button>
          <div class="toolbar-spacer"></div>
          <button class="mini-filter">${I.columns} Columns (16)</button>
        </div>
        <div style="padding:9px 18px;font-size:11px;color:var(--text-mute);background:var(--panel);border-bottom:1px solid var(--border)">Customer names are masked by default. Export permissions determine whether names are included in generated files.</div>
        <div class="table-wrap"><table class="tbl-dense">
          <thead><tr>${STOPLIST_PREVIEW_COLS.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r=>`<tr><td class="mono strong">${r[0]}</td><td class="mono">${r[1]}</td><td class="mono">${r[2]}</td><td class="masked">Name hidden</td><td class="muted">${r[3]}</td><td class="muted">${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${r[8]}</td><td class="muted">${r[9]}</td><td class="muted">${r[10]}</td><td>${r[11]}</td><td class="mono muted">${r[12]}</td><td>${r[13]}</td><td class="muted">${r[14]}</td></tr>`).join('')}</tbody>
        </table></div>
        <div class="grid-foot"><span>Showing 3 of 1,612 stops · 17 columns · scroll horizontally for all fields</span>
          <div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>…</button><button>538</button><button>›</button></div></div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Export Readiness</div>
        <div class="card-sub">All checks passed.</div>
        <div class="checklist">
          ${['Route plan finalized','Route IDs assigned','Stop sequence generated','Service times included','Time windows included','Location extensions included','Export file name ready'].map(t=>`<div class="ci"><div class="check-ic">${I.check}</div><span>${t}</span></div>`).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
          <button class="btn btn-primary" style="justify-content:center" onclick="generateStopList()">Generate Stop List ${I.arrow}</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="go('exportStopList')">Back to Export Setup</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

const EXPORT_STEPS=['Preparing finalized route data','Building Excel workbook','Applying Stop List column order','Masking preview-only fields','Saving export record'];
function generateStopList(){
  document.getElementById('main').innerHTML=`<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Export'])}
    ${head('Export Stop List','Generating the finalized Stop List…')}
    <div class="progress-panel">
      <h2>Generating Stop List</h2>
      <div class="big-progress-bar"><div class="big-progress-fill" id="expFill" style="width:10%"></div></div>
      <div class="progress-pct" id="expPct">10%</div>
      <div class="progress-steps" id="expSteps">${EXPORT_STEPS.map(s=>`<div class="pstep"><span class="ps-ic"></span>${s}</div>`).join('')}</div>
    </div>
  </div></div>`;
  const steps=document.querySelectorAll('#expSteps .pstep'); const fill=document.getElementById('expFill'); const pct=document.getElementById('expPct');
  let i=0; const pcts=[28,52,72,82,100];
  const tick=()=>{ if(i<steps.length){ if(i>0){steps[i-1].classList.remove('active');steps[i-1].classList.add('done');steps[i-1].querySelector('.ps-ic').innerHTML=I.check;}
      steps[i].classList.add('active'); steps[i].querySelector('.ps-ic').innerHTML='<span class="spin-sm"></span>'; fill.style.width=pcts[i]+'%'; pct.textContent=pcts[i]+'%'; i++; setTimeout(tick,560);
    } else { setTimeout(()=>go('exportComplete'),400); } };
  setTimeout(tick,350);
}

function exportComplete(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Baton Rouge 2026-07 Restructure','Export','Complete'])}
    ${head('Export Complete','The finalized Stop List has been generated successfully.')}
    <div class="two-col">
      <div class="card card-pad">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div class="big-check" style="width:50px;height:50px;margin:0">${I.check}</div>
          <div><div class="card-h" style="margin:0">Stop List generated</div><div class="card-sub" style="margin:2px 0 0">Ready for Tech Sales Support handoff.</div></div>
        </div>
        <div class="export-filename" style="margin-bottom:14px">${I.sheet}Stop_List_BatonRouge_2026_07_Option1.xlsx</div>
        <div class="kv"><span class="k">Generated</span><span class="v">Today, 2:48 PM</span></div>
        <div class="kv"><span class="k">Export ID</span><span class="v mono">EXP-8831</span></div>
        <div class="kv"><span class="k">Session</span><span class="v">Baton Rouge 2026-07 Restructure</span></div>
        <div class="kv"><span class="k">Finalized Version</span><span class="v">Option 1</span></div>
        <div class="detail-sec-title" style="margin-top:14px">Contents</div>
        <div class="field-chips"><span class="field-chip">42 routes</span><span class="field-chip">1,612 stops</span><span class="field-chip">2,846 customers</span><span class="field-chip">4-week cycle</span><span class="field-chip">July 2026</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">
          <button class="btn btn-primary" onclick="toast('Download started.')">${I.download}Download Stop List</button>
          <button class="btn btn-secondary" onclick="toast('Handoff link copied')">Copy Handoff Link</button>
          <button class="btn btn-secondary" onclick="toast('Export history')">View Export History</button>
          <button class="btn btn-secondary" onclick="openSession()">Back to Session</button>
        </div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Next Step</div>
        <div class="detail-sec-title" style="margin-top:8px">Cleaned Sheet / Handheld Upload Workbook</div>
        <div class="card-sub" style="margin:0">The current manual conversion from Stop List to the cleaned handheld-ready workbook is still marked TBD for this phase. Once scoped, this export can be extended to generate the downstream workbook automatically.</div>
        <div class="tbd-item">
          <div class="tbd-ic">${I.sheet}</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600">Cleaned Sheet / Handheld Upload Workbook</div><div style="font-size:11.5px;color:var(--text-mute)">Downstream artifact</div></div>
          <span class="pill tbd">TBD</span>
        </div>
        <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" disabled title="Scope TBD for this phase">Generate Cleaned Sheet</button>
        <div class="banner" style="margin-top:16px;margin-bottom:0"><div class="bi">${I.check}</div><div><div class="bt" style="font-size:13px">Main route planning flow complete</div><div class="bd">Stop List is ready for Tech Sales Support handoff.</div></div></div>
      </div>
    </div>
  </div></div>`;
}





/* ============================================================
   NAV ENGINE
   ============================================================ */
const SCREENS={ dashboard, ingestion, preview, committed, createSession, sessionGrid:openSessionScreen,
  balancer, proposedMoves, movesAccepted, finalMetrics, finalize, finalized,
  exportStopList, stopListPreview, exportComplete };
const NAV_MAP={ dashboard:'dashboard', ingestion:'ingestion', preview:'ingestion', committed:'ingestion', createSession:'createSession', sessionGrid:'sessionGrid',
  balancer:'sessionGrid', proposedMoves:'sessionGrid', movesAccepted:'sessionGrid', finalMetrics:'sessionGrid', finalize:'sessionGrid', finalized:'sessionGrid',
  exportStopList:'export', stopListPreview:'export', exportComplete:'export' };
const main=document.getElementById('main');
function openSessionScreen(){ return sessionGrid(); }
function go(name){
  if(name==='sessionGrid'){ openSession(); return; }
  if(name==='export'){ name='exportStopList'; }
  main.innerHTML=SCREENS[name]();
  main.scrollTop=0; setActiveNav(NAV_MAP[name]);
}
function setActiveNav(key){ document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===key)); }

/* modals */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
function part2(msg){ document.getElementById('part2Text').textContent=msg||'Part 2 will add Map/Lasso, Route Balancing, Finalize, and Stop List Export.'; openModal('part2Modal'); }

/* toast */
function toast(msg){ const w=document.getElementById('toastWrap'); const t=document.createElement('div'); t.className='toast';
  t.innerHTML=`<div class="ti">${I.check}</div><span>${msg}</span>`; w.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(10px)';t.style.transition='.3s';},2800);
  setTimeout(()=>t.remove(),3200); }

/* sidebar clicks */
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>go(n.dataset.nav)));

/* boot */
go('dashboard');
