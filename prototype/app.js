/* ============================================================
   RouteOps Cloud — clickable prototype
   Community Coffee — Strategic Route Planning Platform
   ============================================================ */

/* ---------- tiny icon helpers ---------- */
const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/></svg>',
  sheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h13v11H1z"/><path d="M14 8h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7L3 9"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-3-7l3 3"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  lasso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7c-1 0-2-.2-3-.5"/><path d="M5 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M5 18v-2"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M8 14a5 5 0 1 1 8 0c-.6.8-1 1.4-1 2.5H9c0-1.1-.4-1.7-1-2.5z"/></svg>',
  compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 8L2 11l3 3M19 8l3 3-3 3"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
  center: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
};

/* ---------- header helper ---------- */
function head(title, sub, pills) {
  return `<div class="pagehead">
    <div><h1>${title}</h1><p>${sub}</p></div>
    ${pills ? `<div class="head-pills">${pills}</div>` : ''}
  </div>`;
}

/* ============================================================
   SCREEN 1 — DASHBOARD
   ============================================================ */
function dashboard() {
  const pills = `
    <div class="info-pill"><div class="k">Market Cycle</div><div class="v">4 Week</div></div>
    <div class="info-pill"><div class="k">Last Sync</div><div class="v">Today, 2:14 AM</div></div>`;
  return `<div class="screen active"><div class="page">
    ${head('Strategic Route Planning', 'Manage customer data, create routing sessions, balance territories, and export handheld-ready route packages.', pills)}

    <div class="grid grid-4">
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${I.sheet}</div><span class="pill ready"><span class="pill-dot"></span>Ready to Import</span></div>
        <div class="stat-label">Latest Brewpoint Feed</div>
        <div class="stat-value">2,846</div>
        <div class="stat-meta">customers · 8 markets · updated today</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon blue">${I.route}</div></div>
        <div class="stat-label">Open Routing Sessions</div>
        <div class="stat-value">3</div>
        <div class="stat-meta">active sessions · 1 ready for review</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon amber">${I.users}</div></div>
        <div class="stat-label">Customers Needing Placement</div>
        <div class="stat-value">12</div>
        <div class="stat-meta">new customers detected · suggested routes available</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${I.clock}</div></div>
        <div class="stat-label">Next @Work Upload</div>
        <div class="stat-value">Friday EOD</div>
        <div class="stat-meta">handheld package due in 3 days</div>
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-top:22px">
      <button class="btn btn-primary" onclick="go('ingestion')">${I.plus}Start New Import</button>
      <button class="btn btn-secondary" onclick="go('session')">View Active Sessions</button>
    </div>

    <div class="sec-title"><h2>Recent Routing Activity</h2><a class="link" href="#">View all</a></div>
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Session</th><th>Activity</th><th>Scope</th><th>Status</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="strong">Baton Rouge 4 Week Baseline</span></td>
            <td><span class="muted">Imported Today</span></td>
            <td>2,846 customers</td>
            <td><span class="pill ready"><span class="pill-dot"></span>Ready</span></td>
          </tr>
          <tr>
            <td><span class="strong">New Orleans Delivery Option 1</span></td>
            <td><span class="muted">Updated Yesterday</span></td>
            <td>42 routes</td>
            <td><span class="pill progress"><span class="pill-dot"></span>In Progress</span></td>
          </tr>
          <tr>
            <td><span class="strong">Lafayette 8 Week Planning</span></td>
            <td><span class="muted">Finalized Last Friday</span></td>
            <td>38 routes</td>
            <td><span class="pill done"><span class="pill-dot"></span>Exported</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 2 — DATA INGESTION
   ============================================================ */
function ingestion() {
  return `<div class="screen active"><div class="page">
    ${head('Import Brewpoint Data', 'Upload the Location Sales Extension Report to update customer, sales, and routing baseline data.')}
    <div class="two-col">
      <div class="card card-pad">
        <div class="upload-zone">
          <div class="upload-icon">${I.upload}</div>
          <h3>Drop Brewpoint report here or browse files</h3>
          <p>Accepted format: XLSX · The system will validate customer records, sales history, service patterns, and location extensions before committing data.</p>
        </div>
        <div class="file-row">
          <div class="file-ic">${I.sheet}</div>
          <div style="flex:1">
            <div class="file-name">Location_Sales_Extension_BatonRouge_4Week.xlsx</div>
            <div class="file-meta">2.8 MB · Baton Rouge Market · Generated Today, 1:58 AM</div>
          </div>
          <span class="pill done"><span class="pill-dot"></span>Validated</span>
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-h">Import Settings</div>
        <div class="card-sub">Confirm the target scope for this import.</div>
        <div class="field"><label class="field-label">Market</label><select class="select"><option>Baton Rouge</option><option>New Orleans</option><option>Lafayette</option><option>Shreveport</option></select></div>
        <div class="field"><label class="field-label">Cycle</label><select class="select"><option>4 Week</option><option>8 Week</option></select></div>
        <div class="field"><label class="field-label">Scenario Template</label><select class="select"><option>Baseline</option><option>Baseline Delivery</option></select></div>
        <div class="toggle-row"><span class="tl">Auto-detect new and lost customers</span><span class="switch" onclick="this.classList.toggle('off')"></span></div>
        <div class="toggle-row"><span class="tl">Build baseline after commit</span><span class="switch" onclick="this.classList.toggle('off')"></span></div>
        <div style="display:flex;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="go('dashboard')">Cancel</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="go('preview')">Preview Import ${I.arrow}</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 3 — DATA PREVIEW
   ============================================================ */
function stepper(active) {
  const steps = [['1','Upload'],['2','Preview'],['3','Commit'],['4','Session Created']];
  return `<div class="stepper">${steps.map((s,i)=>{
    const idx=i+1; let cls = idx<active?'complete':idx===active?'active':'';
    const sep = i<steps.length-1?'<span class="step-sep">›</span>':'';
    const num = idx<active?I.check:s[0];
    return `<div class="step ${cls}"><span class="step-num">${num}</span><span class="step-txt">${s[1]}</span></div>${sep}`;
  }).join('')}</div>`;
}

function preview() {
  return `<div class="screen active"><div class="page">
    ${head('Preview Import', 'Review customer and sales changes detected from the latest Brewpoint report.')}
    ${stepper(2)}
    <div class="two-col-wide">
      <div>
        <div class="grid grid-3">
          <div class="stat"><div class="stat-label">Total Customers</div><div class="stat-value">2,846</div></div>
          <div class="stat"><div class="stat-label">Existing Updated</div><div class="stat-value">2,791</div></div>
          <div class="stat"><div class="stat-label">New Customers Found</div><div class="stat-value" style="color:var(--yellow-strong)">12</div></div>
          <div class="stat"><div class="stat-label">Lost Customers Removed</div><div class="stat-value">43</div></div>
          <div class="stat"><div class="stat-label">Sales Records Updated</div><div class="stat-value">8,432</div></div>
          <div class="stat"><div class="stat-label">Route Suggestions</div><div class="stat-value">12</div></div>
        </div>

        <div class="sec-title"><h2>Customer Changes</h2></div>
        <div class="card">
          <div class="tabs-bar" style="padding:0 18px;margin-bottom:0">
            <button class="tab-btn active">New Customers</button>
            <button class="tab-btn">Updated Customers</button>
            <button class="tab-btn">Removed Customers</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Customer #</th><th>Customer Name</th><th>City</th><th>Current Sales</th><th>Suggested Route</th><th>Day</th><th>Week</th><th>Confidence</th></tr></thead>
              <tbody>
                <tr><td class="strong">1045821</td><td>Riverside Market</td><td class="muted">Baton Rouge, LA</td><td>$4,820</td><td class="strong">BR-014</td><td>Tuesday</td><td>Week 2</td><td><span class="pill high">High</span></td></tr>
                <tr><td class="strong">1045822</td><td>Campus Grocery</td><td class="muted">Baton Rouge, LA</td><td>$3,940</td><td class="strong">BR-009</td><td>Thursday</td><td>Week 1</td><td><span class="pill high">High</span></td></tr>
                <tr><td class="strong">1045823</td><td>Northline Foods</td><td class="muted">Denham Springs, LA</td><td>$2,760</td><td class="strong">BR-021</td><td>Monday</td><td>Week 3</td><td><span class="pill medium">Medium</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-h">Import Summary</div>
        <div class="card-sub">This import updates the Baton Rouge baseline.</div>
        <div class="kv"><span class="k">File</span><span class="v" style="font-size:11.5px;text-align:right">Location_Sales_Extension_<br>BatonRouge_4Week.xlsx</span></div>
        <div class="kv"><span class="k">Market</span><span class="v">Baton Rouge</span></div>
        <div class="kv"><span class="k">Cycle</span><span class="v">4 Week</span></div>
        <div class="kv"><span class="k">Scenario</span><span class="v">Baseline</span></div>
        <div class="kv"><span class="k">Baseline Action</span><span class="v" style="font-size:11.5px;text-align:right;max-width:150px">Create new baseline from latest committed data</span></div>
        <div class="fp-block-title" style="margin-top:18px">Routing Impact</div>
        <div class="move-note">${I.check}<span>12 new customers will be placed using nearest-neighbor route suggestions</span></div>
        <div class="move-note">${I.check}<span>43 inactive customers will be removed</span></div>
        <div class="move-note">${I.check}<span>Existing route assignments preserved where possible</span></div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px">
          <button class="btn btn-primary" style="justify-content:center" onclick="go('committed')">Commit Import ${I.arrow}</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="go('ingestion')">Back to Upload</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 4 — IMPORT COMMITTED / SESSION CREATED
   ============================================================ */
function committed() {
  return `<div class="screen active"><div class="page">
    ${head('Import Committed', 'The latest Brewpoint data has been validated and committed successfully.')}
    ${stepper(4)}
    <div class="center-card">
      <div class="big-check">${I.check}</div>
      <h2>Baton Rouge baseline is ready</h2>
      <p class="lead">2,846 customers were committed to the routing database. 12 new customers were automatically matched to suggested routes. 43 lost customers were removed from the active baseline.</p>
      <div class="detail-list">
        <div class="drow"><span class="dk">Session Name</span><span class="dv">Baton Rouge 4 Week Baseline</span></div>
        <div class="drow"><span class="dk">Market</span><span class="dv">Baton Rouge</span></div>
        <div class="drow"><span class="dk">Cycle</span><span class="dv">4 Week</span></div>
        <div class="drow"><span class="dk">Scenario</span><span class="dv">Baseline</span></div>
        <div class="drow"><span class="dk">Created From</span><span class="dv">Location Sales Extension Report</span></div>
        <div class="drow"><span class="dk">Created</span><span class="dv">Today, 2:21 PM</span></div>
      </div>
      <div class="cta-row">
        <button class="btn btn-secondary" onclick="go('preview')">View Import Details</button>
        <button class="btn btn-primary" onclick="go('session')">Open Routing Session ${I.arrow}</button>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 5 — ROUTING SESSION OVERVIEW
   ============================================================ */
function session() {
  const meta = ['Baton Rouge','4 Week','Baseline','2,846','42','3'];
  const metaLabels = ['Market','Cycle','Scenario','Customers','Routes','Depots'];
  return `<div class="screen active"><div class="page">
    ${head('Baton Rouge 4 Week Baseline', 'Review the current baseline and create route planning options before making changes.')}
    <div class="meta-row">
      ${metaLabels.map((l,i)=>`<div class="meta-chip"><span class="mk">${l}:</span> <b>${meta[i]}</b></div>`).join('')}
    </div>

    <div class="two-col-wide">
      <div>
        <div class="grid grid-3" style="margin-bottom:20px">
          <div class="stat"><div class="stat-icon blue">${I.route}</div><div class="stat-label">Total Routes</div><div class="stat-value">42</div></div>
          <div class="stat"><div class="stat-icon">${I.users}</div><div class="stat-label">Total Stops</div><div class="stat-value">2,846</div></div>
          <div class="stat"><div class="stat-icon">${I.clock}</div><div class="stat-label">Avg Route Duration</div><div class="stat-value">7h 42m</div></div>
          <div class="stat"><div class="stat-icon green">${I.route}</div><div class="stat-label">Total Weekly Revenue</div><div class="stat-value">$428,950</div></div>
          <div class="stat"><div class="stat-icon amber">${I.users}</div><div class="stat-label">New Customers Placed</div><div class="stat-value">12</div></div>
          <div class="stat" style="display:flex;flex-direction:column;justify-content:center"><div class="stat-label">Baseline Status</div><div style="margin-top:8px"><span class="pill balanced"><span class="pill-dot"></span>Clean and ready for planning</span></div></div>
        </div>

        <div class="sec-title"><h2>Routing Options</h2></div>
        <div class="grid grid-2">
          <div class="option-card baseline">
            <div class="option-head"><h3>Baseline</h3><span class="pill locked"><span style="display:inline-flex;width:12px;height:12px">${I.lock}</span> Locked</span></div>
            <div class="option-desc">Original committed routing state. No manual changes.</div>
            <div class="option-stats">
              <div class="os"><div class="v">42</div><div class="l">Routes</div></div>
              <div class="os"><div class="v">2,846</div><div class="l">Stops</div></div>
              <div class="os"><div class="v">0</div><div class="l">Changes</div></div>
            </div>
          </div>
          <div class="option-card create">
            <div class="stat-icon" style="margin:0 auto">${I.plus}</div>
            <div class="option-desc" style="max-width:240px">Create a working copy to test route changes without modifying the baseline.</div>
            <button class="btn btn-primary" onclick="openModal()">${I.plus}Create Option 1</button>
          </div>
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-h">Route Health</div>
        <div class="card-sub">Baseline balance snapshot.</div>
        <div class="health-row"><span class="health-dot" style="background:var(--green)"></span>Balanced routes<span class="health-count">31</span></div>
        <div class="health-row"><span class="health-dot" style="background:var(--amber)"></span>Slightly overloaded<span class="health-count">8</span></div>
        <div class="health-row"><span class="health-dot" style="background:#9aa0aa"></span>Underloaded routes<span class="health-count">3</span></div>
        <div style="margin-top:14px;height:10px;border-radius:999px;overflow:hidden;display:flex">
          <div style="flex:31;background:var(--green)"></div><div style="flex:8;background:var(--amber)"></div><div style="flex:3;background:#9aa0aa"></div>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   MAP — shared canvas builder for the planner
   markers positioned in % of the map area
   ============================================================ */

// customer marker positions (%) grouped
const MAP_DOTS = [
  [22,30],[28,24],[33,38],[19,45],[40,28],[46,40],[52,25],[57,48],
  [63,33],[68,52],[35,60],[42,68],[50,62],[26,70],[60,66],[71,42],
  [30,52],[48,54],[38,45],[55,58],[66,74],[24,58],[44,36],[58,38]
];
// the 5 candidate stops near East Baton Rouge that get moved
const MOVE_DOTS = [[64,58],[68,62],[71,55],[62,64],[67,68]];
const NEW_DOTS = [[45,72],[53,44],[31,66]]; // new customers (yellow ring)
const DEPOT = [16,40];
const TARGET_ROUTE = [30,74]; // BR-021 cluster center

function mapMarkers(mode) {
  let html = '';
  // depot
  html += `<div class="marker marker-depot-wrap" style="left:${DEPOT[0]}%;top:${DEPOT[1]}%">
    <div class="marker-depot">${I.truck}</div>
    <div class="marker-label">Baton Rouge North Depot</div></div>`;
  // regular dots
  MAP_DOTS.forEach(([x,y],i)=>{
    const sel = i<7 ? 'marker-sel' : 'marker-dot';
    html += `<div class="marker" style="left:${x}%;top:${y}%"><div class="${sel}"></div></div>`;
  });
  // new customers
  NEW_DOTS.forEach(([x,y])=>{
    html += `<div class="marker" style="left:${x}%;top:${y}%"><div class="marker-new"></div></div>`;
  });
  // move candidates (highlighted in preview / applied)
  MOVE_DOTS.forEach(([x,y])=>{
    const c = (mode==='preview'||mode==='applied') ? 'marker-move' : 'marker-dot';
    html += `<div class="marker" style="left:${x}%;top:${y}%"><div class="${c}"></div></div>`;
  });
  return html;
}

function mapPaths(mode) {
  // blue route path for selected BR-014 (curved polyline through selected dots)
  const bluePts = MAP_DOTS.slice(0,7).map(([x,y])=>`${x}% ${y}%`);
  const bluePoly = MAP_DOTS.slice(0,7).map(([x,y])=>`${x},${y}`).join(' ');
  let dashed = '';
  if (mode==='preview' || mode==='applied') {
    // dotted line from move group centroid to target route BR-021
    const cx = MOVE_DOTS.reduce((s,d)=>s+d[0],0)/MOVE_DOTS.length;
    const cy = MOVE_DOTS.reduce((s,d)=>s+d[1],0)/MOVE_DOTS.length;
    dashed = `<line x1="${cx}" y1="${cy}" x2="${TARGET_ROUTE[0]}" y2="${TARGET_ROUTE[1]}"
      stroke="${mode==='applied'?'#1faa5a':'#f5b800'}" stroke-width="0.55" stroke-dasharray="1.4 1.4" stroke-linecap="round"/>`;
  }
  return `<svg class="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="${bluePoly}" fill="none" stroke="#2f6bff" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>
    <line x1="${DEPOT[0]}" y1="${DEPOT[1]}" x2="${MAP_DOTS[0][0]}" y2="${MAP_DOTS[0][1]}" stroke="#2f6bff" stroke-width="0.7" opacity="0.9" stroke-linecap="round"/>
    ${dashed}
  </svg>`;
}

// decorative "map" background (soft streets, water, parks)
function mapBackground() {
  return `<svg class="map-canvas" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <rect width="100" height="100" fill="#e9edf2"/>
    <path d="M-5 55 Q 20 48 40 58 T 90 60 L 105 68 L 105 105 L -5 105 Z" fill="#dbe6ee"/>
    <path d="M60 -5 Q 66 20 58 40 T 62 90" fill="none" stroke="#c3d6e6" stroke-width="3.4" opacity="0.9"/>
    <circle cx="25" cy="24" r="9" fill="#dfeadb"/>
    <circle cx="78" cy="30" r="7" fill="#dfeadb"/>
    <circle cx="40" cy="78" r="8" fill="#dfeadb"/>
    <g stroke="#f4d98a" stroke-width="1.1" opacity="0.85" fill="none">
      <path d="M0 35 H100"/><path d="M0 66 H100"/><path d="M18 0 V100"/><path d="M72 0 V100"/>
    </g>
    <g stroke="#ffffff" stroke-width="0.8" opacity="0.9" fill="none">
      <path d="M0 20 H100"/><path d="M0 50 H100"/><path d="M0 82 H100"/>
      <path d="M35 0 V100"/><path d="M55 0 V100"/><path d="M88 0 V100"/>
      <path d="M8 8 L 92 92" opacity="0.5"/>
    </g>
  </svg>`;
}

/* ---------- floating panel variants ---------- */
function panelBalancing() {
  return `<div class="float-panel" id="floatPanel">
    <div class="fp-head">
      <div class="fp-title"><div class="rc-icon">${I.route}</div><h3>Route BR-014</h3></div>
      <button class="fp-close">✕</button>
    </div>
    <div class="fp-tabs">
      <div class="fp-tab" onclick="setFpTab(this)">Route Info</div>
      <div class="fp-tab" onclick="setFpTab(this)">Customers</div>
      <div class="fp-tab active">Balancing</div>
    </div>
    <div class="fp-body">
      <div class="fp-block-title">Route Health</div>
      <div class="fp-metric"><span class="l">Current duration</span><span class="v over">9h 15m</span></div>
      <div class="fp-metric"><span class="l">Target duration</span><span class="v">8h 00m</span></div>
      <div class="fp-metric"><span class="l">Over target by</span><span class="v over">1h 15m</span></div>
      <div class="fp-metric"><span class="l">Stops</span><span class="v">68</span></div>
      <div class="fp-metric"><span class="l">Revenue</span><span class="v">$12,840</span></div>
      <div class="suggest-box">
        <div class="st">${I.bulb} Suggested move</div>
        <p>Move 5 stops near East Baton Rouge from <b>BR-014</b> to <b>BR-021</b>.</p>
      </div>
      <div class="impact-box">
        <div class="st">Estimated impact</div>
        <div class="impact-line"><span>BR-014</span><span><span class="l">9h 15m</span><span class="arrow">→</span><span class="after">8h 05m</span></span></div>
        <div class="impact-line"><span>BR-021</span><span><span class="l">6h 12m</span><span class="arrow">→</span><span class="after">7h 18m</span></span></div>
      </div>
      <div class="fp-actions">
        <button class="btn btn-secondary" onclick="renderPlanner('preview')">${I.eye}Preview Move</button>
        <button class="btn btn-primary" onclick="applyMove()">Apply Move</button>
      </div>
    </div>
  </div>`;
}

function panelPreview() {
  return `<div class="float-panel" id="floatPanel">
    <div class="fp-head">
      <div class="fp-title"><div class="rc-icon" style="background:var(--yellow);color:#14161a">${I.lasso}</div><h3>Preview Customer Move</h3></div>
      <button class="fp-close">✕</button>
    </div>
    <div class="fp-body" style="padding-top:14px">
      <div class="impact-box" style="margin-top:0">
        <div class="impact-line" style="padding-bottom:8px;border-bottom:1px solid var(--border)"><span class="l">Selected customers</span><span class="v" style="font-weight:700;font-size:15px">5</span></div>
        <div class="impact-line" style="padding-top:10px"><span class="l">From</span><span style="text-align:right"><b>Route BR-014</b><br><span style="font-size:11px;color:var(--text-mute)">Tuesday, Week 2</span></span></div>
        <div class="impact-line"><span class="l">To</span><span style="text-align:right"><b>Route BR-021</b><br><span style="font-size:11px;color:var(--text-mute)">Monday, Week 3</span></span></div>
      </div>
      <div class="fp-block-title" style="margin-top:16px">Estimated before → after</div>
      <div class="fp-metric"><span class="l">BR-014</span><span class="v"><span style="color:var(--text-mute);font-weight:500">9h 15m</span> → <span class="good">8h 05m</span></span></div>
      <div class="fp-metric"><span class="l">BR-021</span><span class="v"><span style="color:var(--text-mute);font-weight:500">6h 12m</span> → <span class="good">7h 18m</span></span></div>
      <div class="fp-block-title" style="margin-top:16px">Net effect</div>
      <div class="move-note">${I.check}<span>Improves route balance</span></div>
      <div class="move-note">${I.check}<span>Keeps all customers within service window</span></div>
      <div class="move-note">${I.check}<span>Reduces overtime risk</span></div>
      <div class="fp-actions">
        <button class="btn btn-secondary" onclick="renderPlanner('balancing')">Cancel Preview</button>
        <button class="btn btn-primary" onclick="applyMove()">Apply Move</button>
      </div>
    </div>
  </div>`;
}

function panelApplied() {
  return `<div class="float-panel" id="floatPanel">
    <div class="fp-head">
      <div class="fp-title"><div class="rc-icon" style="background:var(--green);color:#fff">${I.check}</div><h3>Move Applied</h3></div>
      <button class="fp-close">✕</button>
    </div>
    <div class="fp-body" style="padding-top:14px">
      <div class="banner" style="margin-bottom:16px;padding:12px 14px">
        <div class="bi">${I.check}</div>
        <div><div class="bt" style="font-size:13px">Route balance improved</div><div class="bd">5 customers moved successfully</div></div>
      </div>
      <div class="fp-block-title">Updated route metrics</div>
      <div class="fp-metric"><span class="l">BR-014</span><span class="v good">8h 05m · 63 stops</span></div>
      <div class="fp-metric"><span class="l">BR-021</span><span class="v good">7h 18m · 44 stops</span></div>
      <div class="suggest-box" style="background:var(--blue-soft);border-color:#c3d4ff">
        <div class="st" style="color:var(--blue)">${I.bulb} Next suggested action</div>
        <p style="color:#2148a8">Review final route metrics before finalizing this option.</p>
      </div>
      <div class="fp-actions">
        <button class="btn btn-primary" style="flex:1" onclick="go('metrics')">Review Metrics ${I.arrow}</button>
      </div>
    </div>
  </div>`;
}

/* ---------- route cards ---------- */
function routeCard(r) {
  const fillPct = Math.min(100, (r.hours/10)*100);
  const targetPct = 80;
  return `<div class="route-card ${r.sel?'selected':''} ${r.hl?'highlight':''}" onclick="selectRoute(this)">
    <div class="rc-head">
      <div class="rc-title"><div class="rc-icon">${I.route}</div><span class="rc-name">Route ${r.id}</span></div>
      <span class="pill ${r.statusClass}"><span class="pill-dot"></span>${r.status}</span>
    </div>
    <div class="rc-body">
      <div class="rc-stat"><div class="l">Stops</div><div class="v">${r.stops}</div></div>
      <div class="rc-stat"><div class="l">Duration</div><div class="v">${r.dur}</div></div>
      <div class="rc-stat"><div class="l">Revenue</div><div class="v">${r.rev}</div></div>
    </div>
    <div class="rc-foot"><span>${r.depot}</span><span class="dot"></span><span>${r.day}</span><span class="dot"></span><span>${r.week}</span></div>
    <div class="workload">
      <div class="workload-label"><span>Target 8h</span><span>Current ${r.dur}</span></div>
      <div class="workload-bar"><div class="workload-fill ${r.statusClass}" style="width:${fillPct}%"></div><div class="workload-target" style="left:${targetPct}%"></div></div>
    </div>
  </div>`;
}

/* route data per state */
function routeData(applied) {
  return [
    { id:'BR-014', status: applied?'Balanced':'Over Target', statusClass: applied?'balanced':'over',
      stops: applied?63:68, dur: applied?'8h 05m':'9h 15m', hours: applied?8.08:9.25, rev:'$12,840',
      depot:'Baton Rouge North', day:'Tuesday', week:'Week 2', sel:true, hl:true },
    { id:'BR-009', status:'Balanced', statusClass:'balanced', stops:54, dur:'7h 48m', hours:7.8, rev:'$10,520',
      depot:'Baton Rouge North', day:'Thursday', week:'Week 1' },
    { id:'BR-021', status: applied?'Balanced':'Underused', statusClass: applied?'balanced':'under',
      stops: applied?44:39, dur: applied?'7h 18m':'6h 12m', hours: applied?7.3:6.2, rev:'$7,420',
      depot:'Baton Rouge East', day:'Monday', week:'Week 3', hl:true },
  ];
}

/* ============================================================
   SCREENS 6-8 — ROUTE PLANNER WORKSPACE (three states)
   mode: 'balancing' | 'preview' | 'applied'
   ============================================================ */
function planner(mode) {
  mode = mode || 'balancing';
  const applied = mode === 'applied';
  const chips = applied
    ? [['All Routes',42,false],['Over Target',7,false],['Balanced',33,true],['Underused',2,false]]
    : [['All Routes',42,true],['Over Target',8,false],['Balanced',31,false],['Underused',3,false]];
  const panel = mode==='preview' ? panelPreview() : mode==='applied' ? panelApplied() : panelBalancing();

  return `<div class="screen active"><div class="planner">
    <div class="planner-list">
      <div class="planner-top">
        <h1>Option 1: Baton Rouge 4 Week Planning</h1>
        <p>Balance customer assignments, review route metrics, and finalize the routing option.</p>
      </div>
      <div class="planner-controls">
        <button class="ctrl-btn" onclick="toast('Baseline comparison opened')">${I.compare}Baseline Comparison</button>
        <button class="ctrl-btn" onclick="go('metrics')">${I.target}Route Metrics</button>
        <button class="ctrl-btn icon" onclick="toast('Undo')">${I.undo}</button>
        <button class="ctrl-btn icon" onclick="toast('Redo')">${I.redo}</button>
        <button class="ctrl-btn" onclick="toast('Option saved')">${I.save}Save</button>
        <button class="ctrl-btn dark" onclick="go('metrics')">${I.lock}Finalize</button>
      </div>
      <div class="search-box">${I.search}<input placeholder="Search route, customer, or location" /></div>
      <div class="filter-chips">
        ${chips.map(c=>`<span class="chip ${c[2]?'active':''}"><span>${c[0]}</span><span class="cnt">${c[1]}</span></span>`).join('')}
      </div>
      <div class="route-scroll">
        ${routeData(applied).map(routeCard).join('')}
      </div>
      <button class="btn btn-secondary route-add" onclick="toast('Mock customer added to BR-021')">${I.plus}Add Mock Customer</button>
    </div>

    <div class="map-wrap">
      ${mapBackground()}
      ${mapPaths(mode)}
      ${mapMarkers(mode)}
      ${panel}
      <div class="map-controls-top">
        <div class="map-seg"><button class="active">Map</button><button>Satellite</button></div>
        <div class="map-layers">${I.layers}Layers</div>
      </div>
      <div class="map-controls-btm">
        <div class="map-zoom"><button>+</button><button>−</button></div>
        <button class="map-center-btn">${I.center}</button>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 9 — ROUTE METRICS REVIEW
   ============================================================ */
function metrics() {
  return `<div class="screen active"><div class="page">
    ${head('Review Route Metrics', 'Compare Option 1 against the original baseline before finalizing.')}
    <div class="two-col-wide">
      <div>
        <div class="grid grid-3">
          <div class="stat"><div class="stat-label">Baseline Avg Duration</div><div class="stat-value">7h 42m</div></div>
          <div class="stat"><div class="stat-label">Option 1 Avg Duration</div><div class="stat-value" style="color:var(--green)">7h 36m</div></div>
          <div class="stat"><div class="stat-label">Over Target Routes</div><div class="compare-cell"><span class="base">Baseline 8</span><span class="opt">7</span><span class="delta good">Option 1 ↓</span></div></div>
          <div class="stat"><div class="stat-label">Underused Routes</div><div class="compare-cell"><span class="base">Baseline 3</span><span class="opt">2</span><span class="delta good">Option 1 ↓</span></div></div>
          <div class="stat"><div class="stat-label">Estimated Weekly Cost</div><div class="compare-cell"><span class="base">Baseline $38,420</span><span class="opt">$37,880</span><span class="delta good">−$540</span></div></div>
          <div class="stat"><div class="stat-label">Estimated Revenue</div><div class="stat-value">$428,950</div></div>
        </div>

        <div class="sec-title"><h2>Route Changes</h2></div>
        <div class="card table-wrap">
          <table>
            <thead><tr><th>Route</th><th>Baseline Duration</th><th>Option Duration</th><th>Stops Changed</th><th>Status</th><th>Revenue Impact</th></tr></thead>
            <tbody>
              <tr><td class="strong">BR-014</td><td class="muted">9h 15m</td><td class="strong" style="color:var(--green)">8h 05m</td><td>−5</td><td><span class="pill balanced"><span class="pill-dot"></span>Improved</span></td><td class="muted">No revenue loss</td></tr>
              <tr><td class="strong">BR-021</td><td class="muted">6h 12m</td><td class="strong" style="color:var(--green)">7h 18m</td><td>+5</td><td><span class="pill balanced"><span class="pill-dot"></span>Improved</span></td><td class="muted">No revenue loss</td></tr>
              <tr><td class="strong">BR-009</td><td class="muted">7h 48m</td><td>7h 48m</td><td>0</td><td><span class="pill under"><span class="pill-dot"></span>Unchanged</span></td><td class="muted">No change</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-h">Finalization Checklist</div>
        <div class="card-sub">All items are ready.</div>
        <div class="checklist">
          ${['Customer data committed','Baseline preserved','Option changes saved','New customers placed','Route IDs available','Stop List ready','Handheld workbook ready to generate'].map(t=>`<div class="ci"><div class="check-ic">${I.check}</div><span>${t}</span></div>`).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px">
          <button class="btn btn-primary" style="justify-content:center" onclick="go('finalize')">Finalize Option ${I.arrow}</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="go('planner')">Back to Planner</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 10 — FINALIZE ROUTES
   ============================================================ */
function finalize() {
  return `<div class="screen active"><div class="page">
    ${head('Finalize Option 1', 'Lock the approved route plan and prepare export files for Tech Sales Support.')}
    <div class="center-card" style="max-width:600px">
      <div class="big-check" style="background:var(--yellow-soft);color:var(--yellow-strong)">${I.lock}</div>
      <h2>Option 1 is ready to finalize</h2>
      <div class="detail-list" style="text-align:left">
        <div class="drow"><span class="dk">Routes</span><span class="dv">42</span></div>
        <div class="drow"><span class="dk">Customers</span><span class="dv">2,846</span></div>
        <div class="drow"><span class="dk">New customers placed</span><span class="dv">12</span></div>
        <div class="drow"><span class="dk">Over-target routes remaining</span><span class="dv">7</span></div>
        <div class="drow"><span class="dk">Unresolved placement items</span><span class="dv" style="color:var(--green)">None</span></div>
        <div class="drow"><span class="dk">Stop List</span><span class="dv" style="color:var(--green)">Can be generated</span></div>
        <div class="drow"><span class="dk">Handheld package</span><span class="dv" style="color:var(--green)">Can be generated</span></div>
      </div>
      <div class="route-id-box">
        <div class="rl">Sequential Route IDs</div>
        <p>Route IDs will be assigned automatically during finalization.</p>
        <span class="example">BR-001 → BR-042</span>
      </div>
      <div class="cta-row">
        <button class="btn btn-secondary" onclick="go('metrics')">Back to Metrics</button>
        <button class="btn btn-primary" onclick="go('export'); toast('Option 1 finalized successfully')">${I.lock}Finalize Routes</button>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 11 — EXPORT CENTER
   ============================================================ */
function exportCenter() {
  return `<div class="screen active"><div class="page">
    ${head('Export Handheld Package', 'Generate the final route files needed for Tech Sales Support and the @Work handheld system.')}
    <div class="banner">
      <div class="bi">${I.check}</div>
      <div><div class="bt">Option 1 finalized successfully</div><div class="bd">Route IDs BR-001 → BR-042 assigned. Ready to generate export package.</div></div>
    </div>
    <div class="two-col-wide">
      <div class="card card-pad">
        <div class="card-h">Baton Rouge 4 Week Handheld Package</div>
        <div class="card-sub">Includes all files required by Tech Sales Support and @Work.</div>
        <ul class="list-plain">
          <li>${I.check}Stop List export</li>
          <li>${I.check}13-tab Handheld Upload workbook</li>
          <li>${I.check}Change Forms</li>
          <li>${I.check}Location Extension files</li>
        </ul>
        <div class="fp-block-title" style="margin-top:18px">Output destination</div>
        <div class="move-note">${I.check}<span>Download package</span></div>
        <div class="move-note">${I.check}<span>Save to export history</span></div>
        <div class="move-note">${I.check}<span>Prepare handoff for Tech Sales Support</span></div>
        <div style="display:flex;gap:10px;margin-top:22px">
          <button class="btn btn-secondary" onclick="toast('Stop List preview opened')">${I.eye}Preview Stop List</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="go('complete')">Generate Export Package ${I.arrow}</button>
        </div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Export Settings</div>
        <div class="card-sub" style="margin-bottom:8px">Confirm scope before generating.</div>
        <div class="kv"><span class="k">Market</span><span class="v">Baton Rouge</span></div>
        <div class="kv"><span class="k">Cycle</span><span class="v">4 Week</span></div>
        <div class="kv"><span class="k">Scenario</span><span class="v">Baseline Delivery</span></div>
        <div class="kv"><span class="k">Finalized Option</span><span class="v">Option 1</span></div>
        <div class="kv"><span class="k">Upload target</span><span class="v">@Work handheld</span></div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   SCREEN 12 — EXPORT COMPLETE
   ============================================================ */
function complete() {
  return `<div class="screen active"><div class="page">
    ${head('Export Complete', 'Your route package has been generated and is ready for Tech Sales Support.')}
    <div class="two-col-wide">
      <div class="card card-pad">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
          <div class="big-check" style="width:52px;height:52px;margin:0">${I.check}</div>
          <div><div class="card-h" style="margin:0">Handheld package generated successfully</div>
          <div class="card-sub" style="margin:2px 0 0">BatonRouge_4Week_Option1_HandheldPackage.xlsx · Generated Today, 2:48 PM</div></div>
        </div>
        <div class="fp-block-title">Included files</div>
        <div style="margin-top:10px">
          ${['Stop_List_BatonRouge_4Week.xlsx','Handheld_Upload_13_Tab_Workbook.xlsx','Change_Forms.xlsx','Location_Extensions.xlsx'].map(f=>`
            <div class="export-file"><div class="ef-ic">${I.sheet}</div><div><div class="ef-name">${f}</div><div class="ef-meta">Generated Today, 2:48 PM</div></div><div class="ef-check">${I.check}</div></div>`).join('')}
        </div>
      </div>

      <div class="card card-pad" id="handoffCard">
        <div class="card-h">Send to Tech Sales Support</div>
        <div class="card-sub">Hand off the finalized package for the Friday EOD @Work upload.</div>
        <div class="kv"><span class="k">Recipient</span><span class="v">Tech Sales Support</span></div>
        <div class="field" style="margin-top:14px"><label class="field-label">Message</label>
          <textarea class="text-input" rows="3" style="resize:none">Baton Rouge 4 Week route package is finalized and ready for Friday EOD @Work upload.</textarea></div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
          <button class="btn btn-primary" style="justify-content:center" onclick="sendHandoff()">${I.send}Send Handoff Link</button>
          <button class="btn btn-secondary" style="justify-content:center" onclick="toast('Package downloaded')">${I.download}Download Package</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   NAVIGATION ENGINE
   ============================================================ */
const SCREENS = {
  dashboard, ingestion, preview, committed, session,
  planner: ()=>planner('balancing'), metrics, finalize,
  export: exportCenter, complete
};
// map screen -> sidebar nav key
const NAV_MAP = {
  dashboard:'dashboard', ingestion:'ingestion', preview:'ingestion', committed:'ingestion',
  session:'session', planner:'planner', metrics:'planner', finalize:'planner',
  export:'export', complete:'export'
};

const main = document.getElementById('main');

function go(name) {
  main.innerHTML = SCREENS[name]();
  main.scrollTop = 0;
  setActiveNav(NAV_MAP[name]);
}

function renderPlanner(mode) {
  main.innerHTML = planner(mode);
  setActiveNav('planner');
}

function setActiveNav(key) {
  document.querySelectorAll('.nav-item').forEach(n=>{
    n.classList.toggle('active', n.dataset.nav===key);
  });
}

/* planner interactions */
function selectRoute(el) {
  document.querySelectorAll('.route-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
}
function setFpTab(el) {
  el.parentElement.querySelectorAll('.fp-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}
function applyMove() {
  renderPlanner('applied');
  toast('5 customers moved from BR-014 to BR-021');
}

/* modal */
function openModal(){ document.getElementById('optionModal').classList.add('open'); }
function closeModal(){ document.getElementById('optionModal').classList.remove('open'); }

/* handoff final */
function sendHandoff() {
  const card = document.getElementById('handoffCard');
  card.innerHTML = `
    <div style="text-align:center;padding:14px 4px">
      <div class="big-check" style="margin:0 auto 16px">${I.check}</div>
      <div class="card-h">Package sent to Tech Sales Support</div>
      <div class="card-sub" style="margin-top:8px;max-width:280px;margin-left:auto;margin-right:auto">Routes will be available for @Work upload on Friday and field handheld sync before Monday morning.</div>
      <button class="btn btn-secondary" style="margin-top:8px" onclick="go('dashboard')">Back to Dashboard</button>
    </div>`;
  toast('Handoff link sent to Tech Sales Support');
}

/* toast */
function toast(msg) {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="ti">${I.check}</div><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='0.3s'; }, 2600);
  setTimeout(()=>t.remove(), 3000);
}

/* sidebar nav clicks */
document.querySelectorAll('.nav-item').forEach(n=>{
  n.addEventListener('click', ()=>go(n.dataset.nav));
});

/* boot */
go('dashboard');

