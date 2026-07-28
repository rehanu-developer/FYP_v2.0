/* ============================================================
   RouteOps Cloud V4 — Route Planning Workspace
   Community Coffee · strategic route planning portal
   Covers RN-150, RN-152, RN-153, RN-154, RN-170,
          RN-141, RN-142, RN-143, RN-144, RN-146
   ============================================================ */

const I = {
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
  chevUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>',
  route:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8l-3 6h6zM19 8l-3 6h6z"/><path d="M5 21h14M5 8h14"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7L3 9"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  lasso:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7c-1 0-2-.2-3-.5"/><path d="M5 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M5 18v-2"/></svg>',
  columns:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></svg>',
  density:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/></svg>',
  sheet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  db:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0 0 16 0V5"/><path d="M4 12a8 3 0 0 0 16 0"/></svg>',
  ban:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
};

/* ============================================================
   GLOBAL STATE
   ============================================================ */
const S = {
  session: {
    name: 'Delivery Scenario as of 07/23/2026, 4:42 PM',
    status: 'DRAFT',
    scenario: 'DELIVERY',
    routes: ['970','971','972','973','974','975','976','977'],
    customers: 1300,
    revenue: '$830,809',
    cycle: 8,               // 8 | 4
    depot: 'BR North',
    period: 'Jul 2026',
  },
  activeOption: 'option1',  // 'baseline' | 'option1'
  tab: 'customers',
  rowModel: 'A',            // 'A' | 'B'  (grid flexes on this)
  selection: { mode:'none', ids:[], matchingCount:0, matchingLabel:'' }, // none|explicit|matching
  drawerCustomer: null,
  drawerDirty: false,
  feedExpanded: {},
  refreshing: { grid:false, metrics:false, summary:false },
  seqState: 'idle',
};
const SEL_MAX = 500;
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_FULL = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
const dayFull = d => DAY_FULL[d]||d;
const isBaseline = () => S.activeOption === 'baseline';
const editable   = () => !isBaseline();
const lockTip    = () => `title="The baseline can't be edited. Save as a new option to make changes."`;

/* ---------- customer sample data ---------- */
const CUSTOMERS = [
  { id:'1000004', master:'in',    route:'970', days:['Mon','Tue','Wed','Thu','Fri'], weeks:['Wk 1','Wk 5'], pattern:'E4W', freq:'Weekly',
    rev:'$372.36', curr:'975', prev:'975', pref:'970', mismatch:'match', svc:'18 min', win:'8:00 AM – 11:00 AM', addr:'Available',
    updated:'Today 2:14 PM', units:412, volume:'86.4 cu ft', salesGrp:'SG-12', stations:3, rental:2, lastInv:'07/18/2026',
    masterDays:'MTWRF', address:'2140 Highland Rd, Baton Rouge, LA', geo:'Available', status:'valid' },
  { id:'1000108', master:'out',   route:'971', days:['Tue'], weeks:['Wk 3'], pattern:'4T', freq:'Every 4 weeks',
    rev:'$210.84', curr:'971', prev:'970', pref:'—', mismatch:'na', svc:'—', win:'—', addr:'Unavailable',
    updated:'Today 1:02 PM', units:96, volume:'21.0 cu ft', salesGrp:'SG-04', stations:1, rental:0, lastInv:'06/29/2026',
    masterDays:'—', address:'—', geo:'Unavailable', status:'warn' },
  { id:'1000214', master:'in',    route:'972', days:['Wed'], weeks:['Wk 2'], pattern:'2W', freq:'Twice Weekly',
    rev:'$480.20', curr:'972', prev:'972', pref:'970', mismatch:'mismatch', svc:'22 min', win:'9:00 AM – 1:00 PM', addr:'Available',
    updated:'Yesterday', units:530, volume:'104.2 cu ft', salesGrp:'SG-12', stations:4, rental:3, lastInv:'07/20/2026',
    masterDays:'MW', address:'884 Sherwood Forest Blvd, Baton Rouge, LA', geo:'Available', status:'warn' },
  { id:'1000377', master:'in',    route:'970', days:['Mon','Thu'], weeks:['Wk 1','Wk 5'], pattern:'2W', freq:'Twice Weekly',
    rev:'$298.10', curr:'970', prev:'970', pref:'970', mismatch:'match', svc:'15 min', win:'7:30 AM – 10:30 AM', addr:'Available',
    updated:'Today 11:40 AM', units:288, volume:'62.8 cu ft', salesGrp:'SG-09', stations:2, rental:1, lastInv:'07/21/2026',
    masterDays:'MTh', address:'1500 Perkins Rd, Baton Rouge, LA', geo:'Available', status:'valid' },
  { id:'1000492', master:'in',    route:'973', days:['Fri'], weeks:['Wk 4','Wk 8'], pattern:'E4W', freq:'Weekly',
    rev:'$155.72', curr:'973', prev:'974', pref:'973', mismatch:'match', svc:'12 min', win:'1:00 PM – 4:00 PM', addr:'Available',
    updated:'Jul 20', units:141, volume:'30.1 cu ft', salesGrp:'SG-07', stations:1, rental:0, lastInv:'07/17/2026',
    masterDays:'F', address:'6120 Florida Blvd, Baton Rouge, LA', geo:'Available', status:'valid' },
  { id:'1000615', master:'out',   route:'974', days:['Mon','Wed','Fri'], weeks:['Wk 2','Wk 6'], pattern:'3W', freq:'3× Weekly',
    rev:'$642.98', curr:'974', prev:'974', pref:'—', mismatch:'na', svc:'—', win:'—', addr:'Unavailable',
    updated:'Today 9:12 AM', units:701, volume:'150.6 cu ft', salesGrp:'SG-02', stations:5, rental:4, lastInv:'07/22/2026',
    masterDays:'—', address:'—', geo:'Unavailable', status:'warn' },
  { id:'1000731', master:'in',    route:'975', days:['Tue','Thu'], weeks:['Wk 3','Wk 7'], pattern:'2W', freq:'Twice Weekly',
    rev:'$389.44', curr:'975', prev:'975', pref:'976', mismatch:'mismatch', svc:'20 min', win:'8:00 AM – 12:00 PM', addr:'Available',
    updated:'Yesterday', units:355, volume:'74.9 cu ft', salesGrp:'SG-12', stations:2, rental:1, lastInv:'07/19/2026',
    masterDays:'TTh', address:'3355 Drusilla Ln, Baton Rouge, LA', geo:'Available', status:'warn' },
  { id:'1000846', master:'in',    route:'976', days:['Mon','Tue','Wed','Thu','Fri'], weeks:['Wk 1','Wk 5'], pattern:'E4W', freq:'Weekly',
    rev:'$517.63', curr:'976', prev:'976', pref:'976', mismatch:'match', svc:'25 min', win:'6:00 AM – 9:00 AM', addr:'Available',
    updated:'Today 3:31 PM', units:604, volume:'128.3 cu ft', salesGrp:'SG-05', stations:4, rental:2, lastInv:'07/23/2026',
    masterDays:'MTWRF', address:'7500 Bluebonnet Blvd, Baton Rouge, LA', geo:'Available', status:'valid' },
];

/* routes for Routes tab */
const ROUTES = [
  { id:'970', driver:'M. Daniels', depot:'BR North', terr:'East Baton Rouge', custs:186, stops:642, hours:'8h 55m', rev:'$118,420', cost:'$9,240', flag:'over',     helper:true,  edited:'Today' },
  { id:'971', driver:'A. Lewis',   depot:'BR North', terr:'Campus',           custs:158, stops:512, hours:'7h 48m', rev:'$104,110', cost:'$8,650', flag:'balanced', helper:false, edited:'Today' },
  { id:'972', driver:'R. Carter',  depot:'BR East',  terr:'Denham',           custs:141, stops:470, hours:'6h 12m', rev:'$92,840',  cost:'$7,980', flag:'under',    helper:false, edited:'Today' },
  { id:'973', driver:'T. Brooks',  depot:'BR South', terr:'River Parish',     custs:172, stops:588, hours:'7h 31m', rev:'$107,530', cost:'$8,810', flag:'balanced', helper:true,  edited:'Yesterday' },
  { id:'974', driver:'J. Alvarez', depot:'BR North', terr:'Mid City',         custs:165, stops:551, hours:'8h 22m', rev:'$110,960', cost:'$9,010', flag:'over',     helper:false, edited:'Yesterday' },
  { id:'975', driver:'D. Nguyen',  depot:'BR East',  terr:'Highland',         custs:149, stops:498, hours:'7h 05m', rev:'$96,270',  cost:'$8,190', flag:'balanced', helper:false, edited:'Jul 21' },
  { id:'976', driver:'S. Patel',   depot:'BR South', terr:'Bluebonnet',       custs:181, stops:610, hours:'8h 41m', rev:'$114,880', cost:'$9,120', flag:'over',     helper:true,  edited:'Jul 21' },
  { id:'977', driver:'K. Obi',     depot:'BR North', terr:'Zachary',          custs:148, stops:472, hours:'6h 48m', rev:'$85,799',  cost:'$7,640', flag:'under',    helper:false, edited:'Jul 20' },
];
const flagMeta = { over:['Over Target','var(--amber)'], balanced:['Balanced','var(--green)'], under:['Underused','#9aa0aa'] };

/* ============================================================
   SHARED HELPERS
   ============================================================ */
function crumbs(items){ return `<div class="crumbs">${items.map((c,i)=>i===items.length-1?`<span class="cur">${c}</span>`:`<span>${c}</span><span class="sep">/</span>`).join('')}</div>`; }
function head(t,s,a){ return `<div class="pagehead"><div><h1>${t}</h1><p>${s}</p></div>${a?`<div class="head-actions">${a}</div>`:''}</div>`; }
function rnTag(x){ return `<span class="rn-tag">${x}</span>`; }
function badge(kind,label){ return `<span class="b b-${kind}">${label}</span>`; }
function masterBadge(m){ return m==='in' ? badge('master','In Master') : badge('nomaster','Not in Master'); }
function mismatchBadge(m){ return m==='mismatch' ? badge('mismatch','Mismatch') : m==='match' ? badge('match','Match') : `<span class="muted">—</span>`; }
function statusBadge(s){ return s==='valid'?badge('valid','Valid'):s==='warn'?badge('warn','Warning'):badge('blocked','Blocked'); }
function weeksForCycle(){ return S.session.cycle===8 ? ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'] : ['Wk 1','Wk 2','Wk 3','Wk 4']; }

function toast(msg, opts){
  opts = opts || {};
  const w = document.getElementById('toastWrap');
  const t = document.createElement('div'); t.className='toast';
  t.innerHTML = `<div class="ti">${I.check}</div><span>${msg}</span>` +
    (opts.undo ? `<span class="link-y" style="margin-left:10px;color:var(--yellow);font-weight:700;cursor:pointer" onclick="${opts.undo}">Undo</span>` : '');
  w.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='.3s'; }, opts.long?5200:3000);
  setTimeout(()=>t.remove(), opts.long?5600:3400);
}
function openModal(html, wide){
  const b=document.getElementById('modalBody'); b.innerHTML=html;
  b.style.width = wide ? '720px' : '460px';
  document.getElementById('modalHost').classList.add('open');
}
function closeModal(){ document.getElementById('modalHost').classList.remove('open'); }
function openDrawer(html){
  document.getElementById('drawer').innerHTML=html;
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  S.drawerDirty=false;
}
/* unsaved-changes guard (RN-152 §4.3) */
function tryCloseDrawer(){
  if(!S.drawerDirty){ closeDrawer(); return; }
  openModal(`
    <h2>You have unsaved changes</h2>
    <p class="msub">Leave without saving? Your edits to this customer will be discarded.</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Keep Editing</button>
      <button class="btn btn-danger" onclick="closeModal(); closeDrawer()">Discard Changes</button>
    </div>`);
}
function markDirty(){ S.drawerDirty=true; const s=document.getElementById('drSaveBtn'); if(s) s.disabled=false; }

/* ============================================================
   ROUTE WORKSPACE (RN-154) — the core screen
   ============================================================ */
function workspace(){
  const ed = editable();
  const dis = ed ? '' : `disabled ${lockTip()}`;
  return `<div class="screen active"><div class="ws">
    <div class="ws-head">
      ${crumbs(['Dashboard','Sessions','Delivery Scenario 07/23/2026','Route Workspace'])}
      <div class="ws-titlebar">
        <div>
          <h1>Route Workspace</h1>
          <div class="sub">Manage customer rows, route assignments, delivery days, delivery weeks, and planning options for the current session.</div>
        </div>
        <div class="head-actions">
          ${rnTag('RN-154')}
          <button class="btn btn-secondary btn-sm" onclick="go('rowModel')">${I.columns}Row Model</button>
        </div>
      </div>
      <div class="ws-summary">
        <div class="ws-sum"><div class="l">Routes</div><div class="v">8</div></div>
        <div class="ws-sum"><div class="l">Customers</div><div class="v" id="sumCust">1,300</div></div>
        <div class="ws-sum"><div class="l">Revenue</div><div class="v">$830,809</div></div>
        <div class="ws-sum"><div class="l">Cycle</div><div class="v">${S.session.cycle} Week</div></div>
        <div class="ws-sum accent"><div class="l">Active Option</div><div class="v">${isBaseline()?'Baseline':'Option 1'}</div></div>
        <div class="ws-sum"><div class="l">Status</div><div class="v">Draft</div></div>
      </div>
    </div>

    <div class="ws-toolbar">
      <button class="btn btn-secondary btn-sm" ${dis} onclick="${ed?"toast('Option 1 saved')":''}">${I.save}Save Option</button>
      <button class="btn btn-secondary btn-sm" onclick="saveAsDialog()">${I.copy}Save As</button>
      <span style="width:1px;height:22px;background:var(--border);margin:0 3px"></span>
      <button class="btn btn-secondary btn-sm" ${dis} onclick="${ed?'openAssignPanel()':''}">${I.cal}Assign Day / Week</button>
      <button class="btn btn-secondary btn-sm" ${dis} onclick="${ed?'openReassignPanel()':''}">${I.route}Reassign Route</button>
      <button class="btn btn-secondary btn-sm" ${dis} onclick="${ed?'runSequencer()':''}">${I.bolt}Sequence by Quickest Time<span class="kbd-chip">Ctrl+Q</span></button>
      <span style="width:1px;height:22px;background:var(--border);margin:0 3px"></span>
      <button class="btn btn-secondary btn-sm" onclick="go('map')">${I.map}Open Map</button>
      <button class="btn btn-secondary btn-sm" ${dis} onclick="${ed?"toast('Balancer queued for Option 1')":''}">${I.scale}Run Balancer</button>
      <div class="toolbar-spacer" style="flex:1"></div>
      <button class="btn btn-primary btn-sm" ${dis} onclick="${ed?'finalizeDialog()':''}">${I.lock}Finalize</button>
      <button class="btn btn-secondary btn-sm" onclick="toast('More actions')">${I.more}</button>
    </div>

    <div class="ws-body with-rail">
      <!-- OPTION RAIL -->
      <div class="opt-rail">
        <div class="rail-title">Session Versions</div>
        <div class="opt-item ${isBaseline()?'active':''}" onclick="switchOption('baseline')">
          <div class="oi-top"><span class="oi-name">${I.lock}Baseline</span>${badge('immutable','Immutable')}</div>
          <div class="oi-sub">Imported original</div>
        </div>
        <div class="opt-item ${!isBaseline()?'active':''}" onclick="switchOption('option1')">
          <div class="oi-top"><span class="oi-name">${I.route}Option 1</span>${badge('editable','Editable')}</div>
          <div class="oi-sub">Working plan</div>
        </div>
        <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;margin-top:6px" onclick="saveAsDialog()">${I.plus}Save As New Option</button>
        <div class="rail-title" style="margin-top:18px">Cycle</div>
        <div class="segmented" style="width:100%">
          <button class="${S.session.cycle===4?'active':''}" style="flex:1" onclick="setCycle(4)">4 Wk</button>
          <button class="${S.session.cycle===8?'active':''}" style="flex:1" onclick="setCycle(8)">8 Wk</button>
        </div>
        <div class="rail-title" style="margin-top:18px">Row Model</div>
        <div class="segmented" style="width:100%">
          <button class="${S.rowModel==='A'?'active':''}" style="flex:1" onclick="setRowModel('A')">A</button>
          <button class="${S.rowModel==='B'?'active':''}" style="flex:1" onclick="setRowModel('B')">B</button>
        </div>
        <div class="perm-tip">${I.info}<span>Row model is an open decision (Hadi). Switch to preview both grids.</span></div>
      </div>

      <!-- MAIN -->
      <div class="ws-main">
        <div class="session-tabs" id="wsTabs">
          ${wsTab('customers','Customers')}${wsTab('routes','Routes')}${wsTab('territories','Territories')}${wsTab('heat','Day / Week Heat')}${wsTab('metrics','Metrics')}${wsTab('compare','Compare')}${wsTab('activity','Activity')}
        </div>
        <div id="wsContent" style="flex:1;display:flex;flex-direction:column;overflow:hidden">${wsContent()}</div>
      </div>

      <!-- ACTIVITY MINI -->
      <div class="feed-mini">
        <div class="feed-mini-head"><h4>Activity</h4><span class="reveal-btn" onclick="go('activity')">View all</span></div>
        <div class="feed">${FEED.slice(0,4).map(f=>feedItem(f,true)).join('')}</div>
      </div>
    </div>
  </div></div>`;
}
function wsTab(id,label){ return `<button class="tab-btn ${S.tab===id?'active':''}" onclick="setWsTab('${id}')">${label}</button>`; }
function setWsTab(t){ S.tab=t; document.getElementById('wsContent').innerHTML=wsContent();
  document.querySelectorAll('#wsTabs .tab-btn').forEach(b=>b.classList.remove('active'));
  event&&event.target&&event.target.closest('.tab-btn')?.classList.add('active'); }
function wsContent(){
  if(S.tab==='customers')   return customersTab();
  if(S.tab==='routes')      return routesTab();
  if(S.tab==='territories') return territoriesTab();
  if(S.tab==='heat')        return heatTab();
  if(S.tab==='metrics')     return metricsTab();
  if(S.tab==='compare')     return compareTab();
  if(S.tab==='activity')    return `<div class="grid-scroll-v4"><div class="grid-panel"><div class="feed">${FEED.map(f=>feedItem(f)).join('')}</div></div></div>`;
  return '';
}
function rerenderWs(){ document.getElementById('main').innerHTML=workspace(); }
function switchOption(o){ S.activeOption=o; S.selection={mode:'none',ids:[],matchingCount:0,matchingLabel:''};
  document.getElementById('tpOption').innerHTML = `<span class="tp-dot"></span>${o==='baseline'?'Baseline':'Option 1'}`;
  rerenderWs(); }
function setRowModel(m){ S.rowModel=m; rerenderWs(); }

/* ---------- CUSTOMERS GRID ---------- */
function customersTab(){
  return `${isBaseline()?baselineBanner():''}
    ${selectionStrip()}
    ${refreshRow()}
    <div class="grid-toolbar">
      <div class="toolbar-search">${I.search}<input placeholder="Search customer ID" /></div>
      <button class="mini-filter">Route: 970 ${I.chevron}</button>
      <button class="mini-filter">Day ${I.chevron}</button>
      <button class="mini-filter">Week ${I.chevron}</button>
      <button class="mini-filter">Pattern ${I.chevron}</button>
      <button class="mini-filter">Master Status ${I.chevron}</button>
      <div class="toolbar-spacer"></div>
      <button class="mini-filter">${I.columns} Columns</button>
      <button class="mini-filter">${I.density} Density</button>
    </div>
    <div class="grid-scroll-v4"><div class="grid-panel"><div class="table-wrap">
      ${S.rowModel==='A' ? gridModelA() : gridModelB()}
    </div>
    <div class="scroll-sentinel"><span class="spin-xs"></span>Loading more rows… showing ${S.rowModel==='A'?'8 of 1,300 customers':'12 of ~6,500 planning rows'} · infinite scroll</div>
    </div></div>`;
}
function baselineBanner(){
  return `<div class="lock-banner">
    <div class="lb-ic">${I.lock}</div>
    <div>
      <div class="lb-t">The baseline can't be edited.</div>
      <div class="lb-d">Save as a new option to make changes. All write controls are disabled while the baseline is active.</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="saveAsDialog()">${I.copy}Save As New Option</button>
  </div>`;
}
function refreshRow(){
  const r=S.refreshing;
  if(!r.grid && !r.metrics && !r.summary) return '';
  return `<div class="refresh-row">
    ${r.grid?`<span class="refresh-chip"><span class="spin-xs"></span>Grid updating…</span>`:''}
    ${r.metrics?`<span class="refresh-chip"><span class="spin-xs"></span>Route metrics recalculating…</span>`:''}
    ${r.summary?`<span class="refresh-chip"><span class="spin-xs"></span>Route summary refreshing…</span>`:''}
  </div>`;
}

/* field-group header bands + columns */
const COLS_A = [
  ['sel',''],
  ['imp','Customer ID'],['imp','Master Status'],
  ['pl','Route / Territory'],['pl','Delivery Day'],['pl','Delivery Week'],['pl','Service Pattern'],
  ['der','Frequency'],
  ['imp','Revenue'],['imp','Curr Territory'],['imp','Prev Territory'],
  ['mst','Preferred Route'],['mst','Route Mismatch'],['mst','Service Time'],['mst','Time Window'],['mst','Address'],
  ['imp','Last Updated'],['imp','Status']
];
function bandRow(){
  return `<tr class="fieldband-row">
    <th class="fb-sel"></th>
    <th class="fb-imported" colspan="2">Imported</th>
    <th class="fb-planning" colspan="4">Planning Fields</th>
    <th class="fb-imported">Derived</th>
    <th class="fb-imported" colspan="3">Imported Fields</th>
    <th class="fb-master" colspan="5">Customer Master Fields</th>
    <th class="fb-imported" colspan="2">Imported</th>
  </tr>`;
}
function headRow(){
  return `<tr>${COLS_A.map(([g,l])=>`<th class="${g==='pl'?'col-planning':''} ${g==='sel'?'check-col':''}">${l}</th>`).join('')}</tr>`;
}
function dayChips(days){ return `<span style="display:inline-flex;gap:3px;flex-wrap:wrap">${DAYS.filter(d=>days.includes(d)).map(d=>`<span style="background:var(--yellow-soft);border:1px solid #f0d9a8;color:#8a6a2a;font-size:10px;font-weight:700;padding:1px 5px;border-radius:5px">${d}</span>`).join('')}</span>`; }

function gridModelA(){
  return `<table class="tbl-dense"><thead>${bandRow()}${headRow()}</thead><tbody>
    ${CUSTOMERS.map(c=>{
      const on = S.selection.mode==='matching' || S.selection.ids.includes(c.id);
      return `<tr class="row-click ${on?'selected':''}" onclick="openCustomer('${c.id}')">
        <td class="check-col"><span class="check-box" style="${on?'background:var(--yellow);border-color:var(--yellow)':''}" onclick="event.stopPropagation();toggleRow('${c.id}')"></span></td>
        <td class="mono strong">${c.id}</td>
        <td>${masterBadge(c.master)}</td>
        <td class="cell-planning mono strong">${c.route}</td>
        <td class="cell-planning">${dayChips(c.days)}</td>
        <td class="cell-planning">${c.weeks.join(', ')}</td>
        <td class="cell-planning mono">${c.pattern}</td>
        <td class="muted">${c.freq}</td>
        <td>${c.rev}</td><td class="muted">${c.curr}</td><td class="muted">${c.prev}</td>
        <td class="cell-master mono">${c.pref}</td>
        <td class="cell-master">${mismatchBadge(c.mismatch)}</td>
        <td class="cell-master muted">${c.svc}</td>
        <td class="cell-master muted">${c.win}</td>
        <td class="cell-master muted">${c.addr}</td>
        <td class="muted">${c.updated}</td>
        <td>${statusBadge(c.status)}</td>
      </tr>`;}).join('')}
  </tbody></table>`;
}
/* Model B: one row per customer per service day, with grouping */
function gridModelB(){
  let rows='';
  CUSTOMERS.slice(0,4).forEach(c=>{
    const per = (c.rev.replace(/[$,]/g,'')/c.days.length).toFixed(2);
    rows += `<tr class="grp-header"><td colspan="12">Customer <b class="mono">${c.id}</b> · Route ${c.route} · ${c.pattern}
      <span class="grp-badge">${c.days.length} service-day row${c.days.length>1?'s':''}</span></td></tr>`;
    c.days.forEach((d,i)=>{
      const on = S.selection.mode==='matching' || S.selection.ids.includes(c.id+'-'+d);
      rows += `<tr class="grp-child row-click ${on?'selected':''}" onclick="openCustomer('${c.id}')">
        <td class="check-col"><span class="check-box" style="${on?'background:var(--yellow);border-color:var(--yellow)':''}" onclick="event.stopPropagation();toggleRow('${c.id}-${d}')"></span></td>
        <td class="mono">${c.id}</td>
        <td><span class="b b-default">Group ${String.fromCharCode(65+i%3)}</span></td>
        <td class="cell-planning mono strong">${c.route}</td>
        <td class="cell-planning"><span style="background:var(--yellow-soft);border:1px solid #f0d9a8;color:#8a6a2a;font-size:10px;font-weight:700;padding:1px 6px;border-radius:5px">${d}</span></td>
        <td class="cell-planning">${c.weeks[0]}</td>
        <td class="cell-planning mono">${c.pattern}</td>
        <td class="muted">${c.freq}</td>
        <td>$${per}</td>
        <td class="cell-master">${mismatchBadge(c.mismatch)}</td>
        <td class="muted">${c.updated}</td>
        <td>${statusBadge(c.status)}</td>
      </tr>`;
    });
  });
  return `<table class="tbl-dense"><thead>
    <tr class="fieldband-row"><th class="fb-sel"></th><th class="fb-imported" colspan="2">Imported</th>
      <th class="fb-planning" colspan="4">Planning Fields</th><th class="fb-imported">Derived</th>
      <th class="fb-imported">Revenue Alloc.</th><th class="fb-master">Master</th><th class="fb-imported" colspan="2">Imported</th></tr>
    <tr><th class="check-col"></th><th>Customer ID</th><th>Group</th>
      <th class="col-planning">Route</th><th class="col-planning">Delivery Day</th><th class="col-planning">Delivery Week</th><th class="col-planning">Service Pattern</th>
      <th>Frequency</th><th>Revenue Allocation</th><th>Route Mismatch</th><th>Last Updated</th><th>Status</th></tr>
  </thead><tbody>${rows}</tbody></table>`;
}

/* ---------- SELECTION (RN-154 §2.2) ---------- */
function selectionStrip(){
  const s=S.selection;
  if(s.mode==='none') return '';
  if(s.mode==='over') return `<div class="sel-warn">
      <div class="sw-ic">${I.warn}</div>
      <div style="flex:1">
        <div class="sw-t">Too many individual rows selected</div>
        <div class="sw-d">You can select up to ${SEL_MAX} rows manually. Use <b>Select all matching</b> to apply an action to all customers matching your current filters.</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="selectAllMatching()">Select all matching instead</button>
      <button class="btn btn-secondary btn-sm" onclick="clearSelection()">Clear</button>
    </div>${bulkBar()}`;
  if(s.mode==='matching') return `<div class="sel-strip matching">
      <span class="ss-count">All ${s.matchingCount.toLocaleString()} customers on Route 970 selected</span>
      <span class="link-y" onclick="clearSelection()">Clear</span>
      <span class="ss-note">Includes rows not yet loaded on screen.</span>
      <span class="ss-spacer"></span>${bulkActions()}
    </div>`;
  return `<div class="sel-strip">
      <span class="ss-count">${s.ids.length} selected</span>
      <span class="ss-note">Only selected rows on screen will be changed.</span>
      <span class="link-y" onclick="selectAllMatching()">Select all matching current filters</span>
      <span class="ss-spacer"></span>${bulkActions()}
    </div>`;
}
function bulkActions(){
  return `<div class="bulk-actions">
    <button class="btn btn-sm" onclick="openAssignPanel()">${I.cal}Assign Day / Week</button>
    <button class="btn btn-sm" onclick="openReassignPanel()">${I.route}Reassign Route</button>
    <button class="btn btn-sm danger" onclick="confirmDelete()">${I.trash}Delete</button>
    <button class="btn btn-sm" onclick="clearSelection()">Clear Selection</button>
  </div>`;
}
function bulkBar(){ return ''; }
function scopeLabel(){
  const s=S.selection;
  if(s.mode==='matching') return `All ${s.matchingCount.toLocaleString()} customers matching current filters`;
  return `${s.ids.length} selected customer${s.ids.length===1?'':'s'}`;
}
function scopeCount(){ const s=S.selection; return s.mode==='matching'? s.matchingCount : s.ids.length; }
function toggleRow(id){
  if(!editable()) return;
  const s=S.selection;
  if(s.mode==='matching'){ s.mode='explicit'; s.ids=[id]; }
  else { s.mode='explicit'; s.ids = s.ids.includes(id) ? s.ids.filter(x=>x!==id) : [...s.ids,id]; }
  if(s.ids.length===0) s.mode='none';
  rerenderWs();
}
function simulateOverSelect(){ S.selection={mode:'over',ids:new Array(512).fill(0).map((_,i)=>'x'+i),matchingCount:1300}; rerenderWs(); }
function selectAllMatching(){ S.selection={mode:'matching',ids:[],matchingCount:1300,matchingLabel:'Route 970'}; rerenderWs(); }
function clearSelection(){ S.selection={mode:'none',ids:[],matchingCount:0,matchingLabel:''}; rerenderWs(); }

/* ============================================================
   BULK ASSIGN DAY / WEEK (RN-150)
   ============================================================ */
let ASSIGN = { day:'Tue', week:'Wk 3' };

function openAssignPanel(){
  if(!editable()) return;
  if(S.selection.mode==='none'){ selectAllMatching(); }
  openDrawer(assignPanel());
}
function assignPanel(){
  const c8 = S.session.cycle===8;
  return `
  <div class="dr-head">
    <div><h3>Assign Day / Week</h3>
      <div class="dh-sub">Update delivery day and cycle week for the selected customers in Option 1.</div></div>
    <button class="dr-close" onclick="closeDrawer()">${I.x}</button>
  </div>
  <div class="dr-body">
    <div class="cycle-banner" style="margin-bottom:14px">${I.cal}<span class="cb-k">Current cycle:</span><span class="cb-v">${S.session.cycle} Week</span>
      <span style="margin-left:auto">${rnTag('RN-150')}</span></div>

    <div class="scope-box" style="margin-bottom:16px">
      <div class="sb-l">Selection scope</div>
      <div class="sb-v">${S.selection.mode==='matching'
        ? `${S.selection.matchingCount.toLocaleString()} customers selected from Route 970`
        : `${S.selection.ids.length} customers selected from Route 970`}</div>
    </div>

    <div class="detail-sec-title">Delivery day</div>
    <div class="chip-days" style="margin-bottom:18px">
      ${DAYS.map(d=>`<button class="chip-day ${ASSIGN.day===d?'on':''}" onclick="setAssignDay('${d}')">${d}</button>`).join('')}
    </div>

    <div class="detail-sec-title">Delivery week</div>
    ${c8 ? `
      <div class="wk-grid">
        ${[1,2,3,4].map(p=>`
          <div class="wk-pair">
            <div class="wp-l">Pair ${p}</div>
            <div class="wp-btns">
              <button class="wk-btn ${ASSIGN.week==='Wk '+p?'on':''}" onclick="setAssignWeek('Wk ${p}')">Wk ${p}</button>
              <button class="wk-btn ${ASSIGN.week==='Wk '+(p+4)?'on':''}" onclick="setAssignWeek('Wk ${p+4}')">Wk ${p+4}</button>
            </div>
          </div>`).join('')}
      </div>
      <div class="pair-hint">${I.info}<span>On an 8-week cycle, weeks pair up (1+5, 2+6, 3+7, 4+8). Balancing works across the pair, so assignments are usually reviewed pair-by-pair.</span></div>
    ` : `
      <div class="wk-flat">
        ${[1,2,3,4].map(w=>`<button class="wk-btn ${ASSIGN.week==='Wk '+w?'on':''}" onclick="setAssignWeek('Wk ${w}')">Wk ${w}</button>`).join('')}
      </div>
      <div class="pair-hint">${I.info}<span>This is a 4-week session, so weeks 5–8 are not available.</span></div>
    `}

    <div class="section-note" style="margin-top:18px">${I.warn}
      <span><b>All-or-nothing.</b> The whole selection is validated against the rules gate before anything is written. If any row fails, no changes are applied.</span></div>
  </div>
  <div class="dr-foot">
    <button class="btn btn-secondary" onclick="closeDrawer()">Cancel</button>
    <button class="btn btn-primary" onclick="validateAssignment()">Validate Assignment</button>
  </div>`;
}
function setAssignDay(d){ ASSIGN.day=d; openDrawer(assignPanel()); }
function setAssignWeek(w){ ASSIGN.week=w; openDrawer(assignPanel()); }

/* validation → pass or all-or-nothing failure */
function validateAssignment(){
  // Tue + Wk 3 is the scripted failure case (14 of 1,300); anything else passes.
  const fails = (ASSIGN.day==='Tue' && ASSIGN.week==='Wk 3');
  openDrawer(fails ? assignFailure() : assignPass());
}
function assignPass(){
  const n = scopeCount();
  return `
  <div class="dr-head">
    <div><h3>Validation passed</h3><div class="dh-sub">Ready to apply to Option 1.</div></div>
    <button class="dr-close" onclick="closeDrawer()">${I.x}</button>
  </div>
  <div class="dr-body">
    <div class="banner" style="margin-bottom:16px"><div class="bi">${I.check}</div>
      <div><div class="bt">All ${n.toLocaleString()} customers can be assigned to ${dayFull(ASSIGN.day)}, ${ASSIGN.week}.</div>
      <div class="bd">No rule violations found. Nothing has been written yet.</div></div></div>
    <div class="detail-metric"><span class="l">Scope</span><span class="v">${scopeLabel()}</span></div>
    <div class="detail-metric"><span class="l">New delivery day</span><span class="v">${dayFull(ASSIGN.day)}</span></div>
    <div class="detail-metric"><span class="l">New delivery week</span><span class="v">${ASSIGN.week}${S.session.cycle===8?` <span class="muted" style="font-weight:500">(pairs with ${pairOf(ASSIGN.week)})</span>`:''}</span></div>
    <div class="detail-metric"><span class="l">Applies to</span><span class="v">Option 1 only</span></div>
    <div class="section-note" style="margin-top:16px">${I.info}<span>The baseline is unaffected. This action will appear in the Activity Feed as a single entry.</span></div>
  </div>
  <div class="dr-foot">
    <button class="btn btn-secondary" onclick="openDrawer(assignPanel())">Back</button>
    <button class="btn btn-primary" onclick="applyAssignment()">Apply Assignment</button>
  </div>`;
}
function pairOf(w){ const n=parseInt(w.replace('Wk ','')); return 'Wk '+(n<=4?n+4:n-4); }

const VIOLATIONS = [
  { id:'1000108', route:'971', day:'Tue', week:'Wk 3', reason:'Service pattern does not allow Tuesday.', code:'PATTERN_DAY_NOT_ALLOWED' },
  { id:'1000615', route:'974', day:'Mon', week:'Wk 2', reason:'Week 3 is not valid for this customer’s pattern.', code:'PATTERN_WEEK_NOT_ALLOWED' },
  { id:'1000982', route:'970', day:'Wed', week:'Wk 1', reason:'Customer is missing a required service pattern.', code:'PATTERN_MISSING' },
  { id:'1001044', route:'970', day:'Thu', week:'Wk 4', reason:'Customer is not in Customer Master.', code:'NOT_IN_MASTER' },
  { id:'1001120', route:'972', day:'Fri', week:'Wk 2', reason:'Delivery day conflicts with master delivery days.', code:'MASTER_DAY_CONFLICT' },
  { id:'1001233', route:'975', day:'Tue', week:'Wk 7', reason:'Service pattern does not allow Tuesday.', code:'PATTERN_DAY_NOT_ALLOWED' },
  { id:'1001318', route:'976', day:'Mon', week:'Wk 5', reason:'Week 3 is not valid for this customer’s pattern.', code:'PATTERN_WEEK_NOT_ALLOWED' },
];
function assignFailure(){
  const n = scopeCount();
  return `
  <div class="dr-head">
    <div><h3>Assignment blocked</h3><div class="dh-sub">Nothing was written to Option 1.</div></div>
    <button class="dr-close" onclick="closeDrawer()">${I.x}</button>
  </div>
  <div class="dr-body">
    <div class="viol-head">
      <div class="vh-ic">${I.ban}</div>
      <div><div class="vh-t">No changes were applied.</div>
        <div class="vh-d">14 of ${n.toLocaleString()} customers can’t be assigned to ${dayFull(ASSIGN.day)}, ${ASSIGN.week}. The whole selection is validated before writing, so nothing was saved.</div></div>
    </div>
    <div class="detail-sec-title">Violations (14)</div>
    <div class="viol-scroll">
      <table class="tbl-dense"><thead><tr><th>Customer</th><th>Route</th><th>Day</th><th>Wk</th><th>Reason</th><th></th></tr></thead><tbody>
        ${VIOLATIONS.map(v=>`<tr>
          <td class="mono strong">${v.id}</td><td class="mono">${v.route}</td><td class="muted">${v.day}</td><td class="muted">${v.week}</td>
          <td style="white-space:normal;min-width:190px">${v.reason}</td>
          <td><span class="reveal-btn" onclick="highlightInGrid('${v.id}')">Highlight in Grid</span></td>
        </tr>`).join('')}
        <tr><td colspan="6" class="muted" style="text-align:center">…7 more violations</td></tr>
      </tbody></table>
    </div>
    <div class="open-q" style="margin-top:14px"><b>Open decision · Hadi + client</b>
      The rules gate is a container: reason wording is owned by design, stable rule codes by engineering. Copy shown here is provisional.</div>
  </div>
  <div class="dr-foot">
    <button class="btn btn-secondary" onclick="closeDrawer()">Cancel Assignment</button>
    <button class="btn btn-primary" onclick="excludeAndRetry()">Exclude failing rows and retry</button>
  </div>`;
}
function highlightInGrid(id){ toast(`Row ${id} highlighted in the grid`); }
function excludeAndRetry(){
  const n = scopeCount()-14;
  openDrawer(`
    <div class="dr-head"><div><h3>Retry without failing rows</h3>
      <div class="dh-sub">14 customers excluded from this assignment.</div></div>
      <button class="dr-close" onclick="closeDrawer()">${I.x}</button></div>
    <div class="dr-body">
      <div class="banner" style="margin-bottom:16px"><div class="bi">${I.check}</div>
        <div><div class="bt">${n.toLocaleString()} customers can be assigned to ${dayFull(ASSIGN.day)}, ${ASSIGN.week}.</div>
        <div class="bd">The 14 failing rows will be left exactly as they are.</div></div></div>
      <div class="detail-metric"><span class="l">Will be updated</span><span class="v">${n.toLocaleString()} customers</span></div>
      <div class="detail-metric"><span class="l">Excluded (unchanged)</span><span class="v">14 customers</span></div>
      <div class="detail-metric"><span class="l">Applies to</span><span class="v">Option 1 only</span></div>
    </div>
    <div class="dr-foot">
      <button class="btn btn-secondary" onclick="openDrawer(assignFailure())">Back</button>
      <button class="btn btn-primary" onclick="applyAssignment(${n})">Apply to ${n.toLocaleString()} customers</button>
    </div>`);
}

/* long-running progress (RN-150 §3.3) */
const ASSIGN_STEPS = ['Validating service patterns…','Checking week rules…','Updating selected customer rows…','Recalculating route metrics…','Refreshing route summary…'];
function applyAssignment(nOverride){
  const total = nOverride || scopeCount();
  openDrawer(`
    <div class="dr-head"><div><h3>Applying assignment</h3>
      <div class="dh-sub">The workspace stays available while this runs.</div></div></div>
    <div class="dr-body">
      <div class="op-progress">
        <h4>Assigning ${total.toLocaleString()} customers</h4>
        <div class="op-count" id="opCount">0 of ${total.toLocaleString()} customers checked</div>
        <div class="op-bar"><div class="op-fill" id="opFill" style="width:4%"></div></div>
        <div class="op-steps" id="opSteps">${ASSIGN_STEPS.map(s=>`<div class="op-step"><span class="os-ic"></span>${s}</div>`).join('')}</div>
      </div>
      <div class="section-note" style="margin-top:14px">${I.info}<span>Affected controls are temporarily disabled. The grid is not reloaded — changed rows are patched in place when this finishes.</span></div>
    </div>`);
  const steps=document.querySelectorAll('#opSteps .op-step');
  const fill=document.getElementById('opFill'), cnt=document.getElementById('opCount');
  let i=0; const pct=[22,44,64,84,100];
  const tick=()=>{
    if(i<steps.length){
      if(i>0){ steps[i-1].classList.remove('active'); steps[i-1].classList.add('done'); steps[i-1].querySelector('.os-ic').innerHTML=I.check; }
      steps[i].classList.add('active'); steps[i].querySelector('.os-ic').innerHTML='<span class="spin-xs"></span>';
      fill.style.width=pct[i]+'%';
      cnt.textContent = `${Math.round(total*pct[i]/100).toLocaleString()} of ${total.toLocaleString()} customers checked`;
      i++; setTimeout(tick,700);
    } else { setTimeout(()=>finishAssignment(total),450); }
  };
  setTimeout(tick,400);
}
/* patch-in-place + 3 independent refresh indicators (RN-154 §2.4) */
function finishAssignment(total){
  closeDrawer();
  CUSTOMERS.forEach(c=>{ if(S.selection.mode==='matching'||S.selection.ids.includes(c.id)){ c.days=[ASSIGN.day]; c.weeks=[ASSIGN.week]; c.updated='Just now'; } });
  S.refreshing={grid:true,metrics:true,summary:true}; rerenderWs();
  setTimeout(()=>{ S.refreshing.grid=false; rerenderWs(); },700);
  setTimeout(()=>{ S.refreshing.metrics=false; rerenderWs(); },1300);
  setTimeout(()=>{
    S.refreshing.summary=false;
    FEED.unshift({ type:'assign', label:'Assigned day and week', who:'Michael Reeves', when:'Just now',
      scope:`${total.toLocaleString()} customers · Route 970 · Option 1`, undo:true,
      diff:[['Delivery Day','Mon Tue Wed Thu Fri',ASSIGN.day],['Delivery Week','Wk 1, Wk 5',ASSIGN.week]], rows:total });
    S.selection={mode:'none',ids:[],matchingCount:0,matchingLabel:''};
    rerenderWs();
    toast(`${total.toLocaleString()} customers assigned to ${dayFull(ASSIGN.day)}, ${ASSIGN.week}.`, {undo:"undoEntry(0)"});
  },1900);
}

/* reassign route + delete confirmations (scope repeated) */
function openReassignPanel(){
  if(!editable()) return;
  if(S.selection.mode==='none') S.selection={mode:'explicit',ids:CUSTOMERS.slice(0,12).map(c=>c.id),matchingCount:0};
  const n=scopeCount();
  openDrawer(`
    <div class="dr-head"><div><h3>Reassign Route</h3>
      <div class="dh-sub">Move the selected customers to a different route in Option 1.</div></div>
      <button class="dr-close" onclick="closeDrawer()">${I.x}</button></div>
    <div class="dr-body">
      <div class="scope-box" style="margin-bottom:16px"><div class="sb-l">Selection scope</div><div class="sb-v">${scopeLabel()}</div></div>
      <div class="field"><label class="field-label">Destination route / territory</label>
        <select class="select"><option>971 — Campus (A. Lewis)</option><option>972 — Denham (R. Carter)</option><option>977 — Zachary (K. Obi)</option></select></div>
      <div class="section-note">${I.warn}<span>Validated as one batch. If any row breaks a pattern or depot rule, nothing is written.</span></div>
    </div>
    <div class="dr-foot">
      <button class="btn btn-secondary" onclick="closeDrawer()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmReassign(${n})">Validate Reassignment</button>
    </div>`);
}
function confirmReassign(n){
  openModal(`
    <h2>Reassign ${n.toLocaleString()} ${n===1?'customer':'customers'} to Route 971?</h2>
    <p class="msub">${scopeLabel()} will move from Route 970 to Route 971 in <b>Option 1</b>. The baseline is unchanged.</p>
    <div class="kv"><span class="k">Scope</span><span class="v">${scopeLabel()}</span></div>
    <div class="kv"><span class="k">Destination</span><span class="v">Route 971 — Campus</span></div>
    <div class="kv"><span class="k">Rule violations</span><span class="v" style="color:var(--green)">0</span></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="doReassign(${n})">Reassign ${n.toLocaleString()}</button>
    </div>`);
}
function doReassign(n){
  closeModal(); closeDrawer();
  CUSTOMERS.forEach(c=>{ if(S.selection.mode==='matching'||S.selection.ids.includes(c.id)){ c.route='971'; c.updated='Just now'; }});
  S.refreshing={grid:true,metrics:true,summary:true}; rerenderWs();
  setTimeout(()=>{S.refreshing.grid=false;rerenderWs();},600);
  setTimeout(()=>{S.refreshing.metrics=false;rerenderWs();},1100);
  setTimeout(()=>{ S.refreshing.summary=false;
    FEED.unshift({type:'route',label:'Reassigned route',who:'Michael Reeves',when:'Just now',
      scope:`${n.toLocaleString()} customers · Route 970 → 971 · Option 1`,undo:true,
      diff:[['Route / Territory','970','971']],rows:n});
    S.selection={mode:'none',ids:[],matchingCount:0}; rerenderWs();
    toast(`${n.toLocaleString()} customers reassigned to Route 971.`,{undo:"undoEntry(0)"});
  },1600);
}
function confirmDelete(){
  const n=scopeCount();
  openModal(`
    <h2>Delete ${n.toLocaleString()} customer row${n===1?'':'s'}?</h2>
    <p class="msub">${scopeLabel()} will be removed from <b>Option 1</b>. Customer Master records are not affected.</p>
    <div class="blocked-inline" style="margin-bottom:4px"><div class="bi-ic">${I.warn}</div>
      <div><div class="bi-t">This cannot be undone</div><div class="bi-d">Deleting planning rows permanently removes them from this option. You would need to revert to the baseline or re-import.</div></div></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="closeModal(); doDelete(${n})">Delete ${n.toLocaleString()} rows</button>
    </div>`);
}
function doDelete(n){
  FEED.unshift({type:'delete',label:'Deleted customer rows',who:'Michael Reeves',when:'Just now',
    scope:`${n.toLocaleString()} customer rows · Option 1`,undo:false,noUndoReason:'Deletes permanently remove planning rows.',rows:n});
  S.selection={mode:'none',ids:[],matchingCount:0}; rerenderWs();
  toast(`${n.toLocaleString()} customer rows deleted.`);
}

/* Save As (creates working option) */
function saveAsDialog(){
  openModal(`
    <h2>Save As New Option</h2>
    <p class="msub">Create an editable working option from the current version. The baseline always stays locked.</p>
    <div class="field"><label class="field-label">Option name</label><input class="text-input" value="Option 2" /></div>
    <div class="field"><label class="field-label">Create from</label><select class="select"><option>Baseline — imported original</option><option selected>Option 1 — working plan</option></select></div>
    <div class="section-note">${I.info}<span>Changes are always written to an option, never to the baseline.</span></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); switchOption('option1'); FEED.unshift({type:'option',label:'Saved as new option',who:'Michael Reeves',when:'Just now',scope:'Option 2 created from Option 1',undo:true,rows:1}); rerenderWs(); toast('Option 2 created. Changes apply to the new option.')">Create Option</button>
    </div>`);
}
function finalizeDialog(){
  openModal(`
    <h2>Finalize Option 1?</h2>
    <p class="msub">Locks the approved plan for <b>${S.session.name}</b> and makes it available for export. Further edits require a new option.</p>
    <div class="kv"><span class="k">Routes</span><span class="v">8</span></div>
    <div class="kv"><span class="k">Customers</span><span class="v">1,300</span></div>
    <div class="kv"><span class="k">Revenue</span><span class="v">$830,809</span></div>
    <div class="kv"><span class="k">Cycle</span><span class="v">${S.session.cycle} Week</span></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); go('exports'); toast('Option 1 finalized. Ready to export.')">Finalize Route Plan</button>
    </div>`);
}

/* cycle change (RN-150 §3.4) */
function setCycle(n){
  if(n===S.session.cycle) return;
  if(n===4 && S.session.cycle===8){
    openModal(`
      <h2>Change cycle from 8 weeks to 4?</h2>
      <p class="msub">Weeks 5–8 do not exist on a 4-week cycle. Assignments in those weeks would become invalid.</p>
      <div class="blocked-inline" style="margin-bottom:12px"><div class="bi-ic">${I.warn}</div>
        <div><div class="bi-t">418 assignments are in weeks 5–8</div>
          <div class="bi-d">They will be remapped to their paired week (5→1, 6→2, 7→3, 8→4) in Option 1. The baseline is unchanged.</div></div></div>
      <div class="open-q"><b>Open decision · Product</b>What should happen to weeks 5–8 assignments on cycle change is currently undefined. Remap-to-pair is the design's proposed default.</div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Keep 8 Week</button>
        <button class="btn btn-primary" onclick="closeModal(); applyCycle(4)">Change to 4 Week</button>
      </div>`);
  } else { applyCycle(n); }
}
function applyCycle(n){
  S.session.cycle=n;
  document.getElementById('tpCycle').innerHTML=`<span class="tp-k">Cycle</span> ${n} Week`;
  if(n===4){ CUSTOMERS.forEach(c=>{ c.weeks=c.weeks.map(w=>{const k=parseInt(w.replace('Wk ',''));return 'Wk '+(k>4?k-4:k);}).filter((v,i,a)=>a.indexOf(v)===i); }); }
  ASSIGN.week = 'Wk 3';
  rerenderWs(); toast(`Session cycle changed to ${n} Week.`);
}

/* ============================================================
   CUSTOMER DETAIL DRAWER (RN-152)
   ============================================================ */
let DRAFT = null;   // proposed state, saved atomically

function openCustomer(id){
  const c = CUSTOMERS.find(x=>x.id===id); if(!c) return;
  DRAFT = { route:c.route, days:[...c.days], weeks:[...c.weeks], pattern:c.pattern, errors:{} };
  S.drawerCustomer = id; S.drawerDirty=false;
  openDrawer(customerDrawer(c));
}
/* frequency is derived from pattern — never an input (Zone B) */
const PATTERN_FREQ = { 'E4W':'Weekly', '2W':'Twice Weekly', '3W':'3× Weekly', '4T':'Every 4 weeks', 'E8W':'Every 8 weeks' };
const PATTERN_DAYS = { 'E4W':['Mon','Tue','Wed','Thu','Fri'], '2W':['Mon','Wed','Thu'], '3W':['Mon','Wed','Fri'], '4T':['Tue'], 'E8W':['Mon','Fri'] };

function customerDrawer(c){
  const ed = editable();
  const notInMaster = c.master==='out';
  const err = DRAFT.errors || {};
  return `
  <div class="dr-head">
    <div>
      <h3>Customer ${c.id}</h3>
      <div class="dh-sub">Route ${DRAFT.route} · ${isBaseline()?'Baseline':'Option 1'}
        ${notInMaster?' · '+badge('nomaster','Not in Master'):''}
        ${c.mismatch==='mismatch'?' · '+badge('mismatch','Route Mismatch'):''}</div>
    </div>
    <button class="dr-close" onclick="tryCloseDrawer()">${I.x}</button>
  </div>
  <div class="dr-body">
    ${!ed ? `<div class="lock-banner" style="margin:0 0 14px">
        <div class="lb-ic">${I.lock}</div>
        <div><div class="lb-t">The baseline can't be edited.</div>
        <div class="lb-d">Save as a new option to make changes.</div></div>
        <button class="btn btn-primary btn-sm" onclick="saveAsDialog()">Save As New Option</button>
      </div>` : ''}

    ${err.summary ? `<div class="viol-head" style="margin-bottom:14px">
      <div class="vh-ic">${I.ban}</div>
      <div><div class="vh-t">No changes were saved.</div><div class="vh-d">${err.summary}</div></div></div>` : ''}

    <!-- ZONE A -->
    <div class="zone zone-a">
      <div class="zone-head">${I.cal} Session Planning <span class="zone-tag">${ed?'Editable in Option 1':'Read-only'}</span></div>
      <div class="zone-body">
        <div class="field">
          <label class="field-label">Route / Territory</label>
          <select class="select" ${ed?'':'disabled '+lockTip()} onchange="DRAFT.route=this.value; markDirty()">
            ${S.session.routes.map(r=>`<option ${r===DRAFT.route?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field-label">Service Pattern</label>
          <select class="select" ${ed?'':'disabled '+lockTip()} onchange="changePattern(this.value)">
            ${Object.keys(PATTERN_FREQ).map(p=>`<option ${p===DRAFT.pattern?'selected':''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field-label">Delivery Days</label>
          <div class="chip-days">
            ${DAYS.map(d=>`<button class="chip-day ${DRAFT.days.includes(d)?'on':''} ${err.days&&err.day===d?'err':''}"
              ${ed?'':'disabled'} onclick="${ed?`toggleDraftDay('${d}')`:''}">${d}</button>`).join('')}
          </div>
          ${err.days?`<div class="field-err">${I.warn}<span>${err.days}</span></div>`:''}
        </div>
        <div class="field" style="margin-bottom:0">
          <label class="field-label">Delivery Week</label>
          <div class="chip-days">
            ${weeksForCycle().map(w=>`<button class="chip-day ${DRAFT.weeks.includes(w)?'on':''}" ${ed?'':'disabled'}
              onclick="${ed?`toggleDraftWeek('${w}')`:''}">${w}</button>`).join('')}
          </div>
          ${err.weeks?`<div class="field-err">${I.warn}<span>${err.weeks}</span></div>`:''}
          ${S.session.cycle===8?`<div class="perm-tip">${I.info}<span>8-week cycle — weeks pair 1+5, 2+6, 3+7, 4+8.</span></div>`:''}
        </div>
      </div>
    </div>

    <!-- ZONE B -->
    <div class="zone zone-b">
      <div class="zone-head">${I.target} Derived <span class="zone-tag">Read-only</span></div>
      <div class="zone-body">
        <div class="field-label">Frequency</div>
        <div class="derived-val" id="freqVal">${PATTERN_FREQ[DRAFT.pattern]||'—'}</div>
        <div class="zone-note">Calculated from the selected service pattern. This value cannot be edited directly.</div>
      </div>
    </div>

    <!-- ZONE C -->
    <div class="zone zone-c">
      <div class="zone-head">${I.db} Customer Master <span class="zone-tag">Read-only</span></div>
      <div class="zone-body">
        ${notInMaster ? `
          <div class="section-note" style="background:#fff">${I.info}
            <span><b>This customer isn’t in the Customer Master.</b><br>Address, preferred route, and service time are unavailable. This is informational — session planning above still works normally.</span></div>
          <div class="perm-tip">${I.info}<span>About 6.5% of imported customers (roughly 85 of 1,300) have no Master record.</span></div>
        ` : `
          <div style="font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px">From Customer Master — shared across all sessions</div>
          <div class="kv"><span class="k">Preferred Route</span><span class="v mono">${c.pref}</span></div>
          ${c.mismatch==='mismatch'?`
            <div class="blocked-inline" style="margin:10px 0;background:var(--amber-soft);border-color:#f6dcae">
              <div class="bi-ic" style="background:var(--amber)">${I.warn}</div>
              <div><div class="bi-t" style="color:#b56a00">Planned Route ${DRAFT.route} · Preferred Route ${c.pref}</div>
              <div class="bi-d" style="color:#8a6a2a">This customer is planned on a different route than its Customer Master preferred route.</div></div>
            </div>`:''}
          <div class="kv"><span class="k">Master Delivery Days</span><span class="v mono">${c.masterDays}</span></div>
          <div class="kv"><span class="k">Address</span><span class="v" style="max-width:220px;text-align:right;font-size:11.5px">${c.address}</span></div>
          <div class="kv"><span class="k">Service Time</span><span class="v">${c.svc}</span></div>
          <div class="kv"><span class="k">Time Window</span><span class="v">${c.win}</span></div>
          <div class="kv"><span class="k">Latitude / Longitude</span><span class="v">${c.geo}</span></div>
          <div style="margin-top:12px"><span class="link-gate" title="You can view Customer Master data, but you don’t have permission to edit it.">${I.ext}Edit in Customer Master</span></div>
          <div class="perm-tip">${I.lock}<span>You can view Customer Master data, but you don’t have permission to edit it. Editing is limited to Admin and Ingest Admin.</span></div>
        `}
      </div>
    </div>

    <div class="section-note">${I.info}<span>Pattern and days are only valid together, so this drawer saves as one atomic change. Nothing is written until you press Save.</span></div>
  </div>
  ${ed ? `<div class="dr-foot">
      <button class="btn btn-secondary" onclick="tryCloseDrawer()">Cancel</button>
      <button class="btn btn-primary" id="drSaveBtn" disabled onclick="saveCustomer('${c.id}')">${I.save}Save Changes</button>
    </div>` : `<div class="dr-foot"><button class="btn btn-secondary" style="flex:1;justify-content:center" onclick="closeDrawer()">Close</button></div>`}`;
}
function changePattern(p){
  DRAFT.pattern=p; DRAFT.errors={}; markDirty();
  const f=document.getElementById('freqVal');
  if(f){ f.textContent = PATTERN_FREQ[p]||'—'; f.classList.remove('dv-flash'); void f.offsetWidth; f.classList.add('dv-flash'); }
}
function toggleDraftDay(d){
  DRAFT.days = DRAFT.days.includes(d) ? DRAFT.days.filter(x=>x!==d) : [...DRAFT.days,d];
  DRAFT.errors={}; markDirty();
  openDrawer(customerDrawer(CUSTOMERS.find(c=>c.id===S.drawerCustomer)));
}
function toggleDraftWeek(w){
  DRAFT.weeks = DRAFT.weeks.includes(w) ? DRAFT.weeks.filter(x=>x!==w) : [...DRAFT.weeks,w];
  DRAFT.errors={}; markDirty();
  openDrawer(customerDrawer(CUSTOMERS.find(c=>c.id===S.drawerCustomer)));
}
/* atomic save — validate complete proposed state (RN-152 §4.3) */
function saveCustomer(id){
  const c = CUSTOMERS.find(x=>x.id===id);
  const allowed = PATTERN_DAYS[DRAFT.pattern]||[];
  const bad = DRAFT.days.find(d=>!allowed.includes(d));
  if(bad){
    DRAFT.errors = {
      summary:`This service pattern does not allow the selected delivery day.`,
      days:`${dayFull(bad)} is not allowed by service pattern ${DRAFT.pattern}. Allowed days: ${allowed.join(', ')}.`,
      day:bad };
    openDrawer(customerDrawer(c)); return;   // nothing saved
  }
  if(DRAFT.days.length===0){
    DRAFT.errors={ summary:'At least one delivery day is required.', days:'Select at least one delivery day.' };
    openDrawer(customerDrawer(c)); return;
  }
  c.route=DRAFT.route; c.days=[...DRAFT.days]; c.weeks=[...DRAFT.weeks];
  c.pattern=DRAFT.pattern; c.freq=PATTERN_FREQ[DRAFT.pattern]; c.updated='Just now';
  FEED.unshift({type:'customer',label:'Edited customer',who:'Michael Reeves',when:'Just now',
    scope:`Customer ${id} · Route ${c.route} · Option 1`,undo:true,
    diff:[['Service Pattern',DRAFT.pattern===c.pattern?c.pattern:c.pattern,DRAFT.pattern],['Delivery Days','—',DRAFT.days.join(' ')]],rows:1});
  S.drawerDirty=false; closeDrawer(); rerenderWs();
  toast(`Customer ${id} updated.`, {undo:"undoEntry(0)"});
}

/* ============================================================
   ACTIVITY FEED + UNDO (RN-153)
   Canonical action labels (design owns this set — source of truth)
   ============================================================ */
const ACTION_LABELS = {
  assign:   'Assigned day and week',
  route:    'Reassigned route',
  delete:   'Deleted route',
  customer: 'Edited customer',
  move:     'Moved stop',
  option:   'Saved as new option',
  revert:   'Reverted to baseline',
  sequence: 'Re-sequenced route',
  reconcile:'Applied reconcile',
  import:   'Imported customer enhancements',
};
const ACTION_ICON = {
  assign:['accent',I.cal], route:['accent',I.route], delete:['danger',I.trash], customer:['',I.user],
  move:['',I.pin], option:['green',I.copy], revert:['',I.undo], sequence:['accent',I.bolt],
  reconcile:['danger',I.warn], import:['green',I.upload],
};
let FEED = [
  { type:'assign', label:'Assigned day and week', who:'Michael Reeves', when:'Today 4:38 PM',
    scope:'1,300 customers · Route 970 · Option 1', undo:true, rows:1300,
    diff:[['Delivery Day','Mon Tue Wed Thu Fri','Tue'],['Delivery Week','Wk 1, Wk 5','Wk 3']] },
  { type:'sequence', label:'Re-sequenced route', who:'Michael Reeves', when:'Today 4:21 PM',
    scope:'Route 970 · 642 stops · Option 1', undo:true, rows:642,
    diff:[['Sequence','Original order','Quickest time'],['Drive time','8h 55m','8h 43m']] },
  { type:'customer', label:'Edited customer', who:'Michael Reeves', when:'Today 3:52 PM',
    scope:'Customer 1000214 · Route 972 · Option 1', undo:false, rows:1,
    conflict:'This can’t be undone — the customer has been edited since.',
    diff:[['Service Pattern','E4W','2W'],['Delivery Days','Mon Wed Fri','Wed']] },
  { type:'option', label:'Saved as new option', who:'Michael Reeves', when:'Today 2:44 PM',
    scope:'Option 1 created from Baseline', undo:true, rows:1 },
  { type:'reconcile', label:'Applied reconcile', who:'Ingest Admin', when:'Today 2:31 PM',
    scope:'43 customers removed · Master dataset', undo:false, rows:43,
    noUndoReason:'Applying a reconcile permanently removes customers. There is no undo.' },
  { type:'import', label:'Imported customer enhancements', who:'Ingest Admin', when:'Jul 22 9:05 AM',
    scope:'1,214 customers · 3 fields updated', undo:false, rows:1214,
    noUndoReason:'Master imports are audited and cannot be rolled back from the feed.' },
];

function feedItem(f, mini){
  const idx = FEED.indexOf(f);
  const [cls,ic] = ACTION_ICON[f.type]||['',I.info];
  const open = S.feedExpanded[idx];
  return `<div class="feed-item">
    <div class="fi-top">
      <div class="fi-ic ${cls}">${ic}</div>
      <div class="fi-main">
        <div class="fi-label">${f.label}</div>
        <div class="fi-meta">${f.who} · ${f.when}</div>
        <div class="fi-scope">${f.scope}</div>
        ${!mini && f.diff ? `<div class="fi-expand" onclick="toggleFeed(${idx})">${open?I.chevUp:I.chevron} ${open?'Hide':'Show'} what changed${f.rows>1?` · ${f.rows.toLocaleString()} rows`:''}</div>`:''}
        ${!mini && open && f.diff ? `<div class="fi-diff">
          ${f.diff.map(d=>`<div class="fi-diff-row"><span class="k">${d[0]}</span><span class="fi-before">${d[1]}</span>${I.arrow}<span class="fi-after">${d[2]}</span></div>`).join('')}
          ${f.rows>1?`<div class="fi-diff-row"><span class="k">Affected rows</span><span>${f.rows.toLocaleString()} customer rows — one feed entry, not ${f.rows.toLocaleString()} lines</span></div>`:''}
        </div>`:''}
        ${!mini && f.conflict ? `<div class="field-err" style="margin-top:8px">${I.warn}<span>${f.conflict}</span></div>`:''}
        ${!mini && f.noUndoReason ? `<div class="perm-tip">${I.ban}<span>${f.noUndoReason}</span></div>`:''}
      </div>
      ${!mini?`<div class="fi-actions">
        ${f.undo
          ? `<button class="btn btn-secondary btn-sm" onclick="undoEntry(${idx})">${I.undo}Undo</button>`
          : `<span class="undo-no">${I.ban}No undo</span>`}
      </div>`:''}
    </div>
  </div>`;
}
function toggleFeed(i){ S.feedExpanded[i]=!S.feedExpanded[i]; rerenderCurrent(); }
function undoEntry(i){
  const f=FEED[i]; if(!f) return;
  if(f.conflict){ openModal(`<h2>Can’t undo this change</h2><p class="msub">${f.conflict}</p>
      <div class="section-note">${I.info}<span>Re-open the customer to review the current state before making another change.</span></div>
      <div class="modal-actions"><button class="btn btn-primary" style="flex:1;justify-content:center" onclick="closeModal()">Close</button></div>`); return; }
  if(!f.undo){ openModal(`<h2>This action can’t be undone</h2><p class="msub">${f.noUndoReason||'No undo is available for this action type.'}</p>
      <div class="modal-actions"><button class="btn btn-primary" style="flex:1;justify-content:center" onclick="closeModal()">Close</button></div>`); return; }
  openModal(`
    <h2>Undo “${f.label}”?</h2>
    <p class="msub">This reverts ${f.rows>1?f.rows.toLocaleString()+' rows':'this change'} in Option 1 back to the previous values. The baseline is unaffected.</p>
    <div class="kv"><span class="k">Scope</span><span class="v" style="max-width:230px;text-align:right;font-size:11.5px">${f.scope}</span></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal(); FEED.splice(${i},1); FEED.unshift({type:'revert',label:'Reverted to baseline',who:'Michael Reeves',when:'Just now',scope:'Undo of “${f.label}” · Option 1',undo:false,noUndoReason:'Undo entries cannot themselves be undone.',rows:${f.rows||1}}); rerenderCurrent(); toast('Change undone.')">Undo change</button>
    </div>`);
}
function activityScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Activity Feed'])}
    ${head('Activity Feed','Every change in this session, who made it, what changed, and whether it can be undone.',rnTag('RN-153'))}
    <div class="two-col">
      <div class="card"><div class="feed">${FEED.map(f=>feedItem(f)).join('')}</div></div>
      <div>
        <div class="card card-pad">
          <div class="card-h">Canonical action labels</div>
          <div class="card-sub">Design owns this label set — it is the source of truth for the feed and undo.</div>
          ${Object.entries(ACTION_LABELS).map(([k,v])=>`<div class="kv"><span class="k mono" style="font-size:11px">${k}</span><span class="v">${v}</span></div>`).join('')}
        </div>
        <div class="card card-pad" style="margin-top:14px">
          <div class="card-h">Undo rules</div>
          <div class="constraint-line">${I.check}Bulk edits collapse to one entry, expandable to affected rows</div>
          <div class="constraint-line">${I.check}Entries show who, when, before/after, and scope</div>
          <div class="perm-tip">${I.ban}<span>Applying a reconcile permanently removes customers and has no undo — it uses a hard confirmation before it runs.</span></div>
          <div class="perm-tip">${I.warn}<span>Conflict state: “This can’t be undone — the customer has been edited since.”</span></div>
        </div>
        <div class="open-q" style="margin-top:14px"><b>Open decision · Haasham</b>Engineering has three competing internal names per event. This label set is proposed as canonical.</div>
      </div>
    </div>
  </div></div>`;
}

/* ============================================================
   REMAINING WORKSPACE TABS
   ============================================================ */
function routesTab(){
  const ed=editable();
  return `${isBaseline()?baselineBanner():''}
  <div class="grid-toolbar">
    <div class="toolbar-search">${I.search}<input placeholder="Search route or driver" /></div>
    <button class="mini-filter">Depot ${I.chevron}</button><button class="mini-filter">Balance Flag ${I.chevron}</button>
    <div class="toolbar-spacer"></div><button class="mini-filter">${I.columns} Columns</button>
  </div>
  <div class="grid-scroll-v4"><div class="grid-panel"><div class="table-wrap"><table class="tbl-dense">
    <thead><tr><th class="check-col"></th><th>Route</th><th>Driver</th><th>Depot</th><th>Territory</th><th>Customers</th><th>Stops</th><th>Total Hours</th><th>Revenue</th><th>Cost</th><th>Helper</th><th>Balance Flag</th><th>Last Edited</th><th></th></tr></thead>
    <tbody>${ROUTES.map(r=>`<tr class="row-click" onclick="openRouteDrawer('${r.id}')">
      <td class="check-col"><span class="check-box"></span></td>
      <td class="mono strong">${r.id}</td><td>${r.driver}</td><td class="muted">${r.depot}</td><td class="muted">${r.terr}</td>
      <td>${r.custs}</td><td>${r.stops}</td><td class="strong">${r.hours}</td><td>${r.rev}</td><td class="muted">${r.cost}</td>
      <td>${r.helper?badge('valid','Helper'):'<span class="muted">—</span>'}</td>
      <td><span class="balance-flag"><span class="bf-dot" style="background:${flagMeta[r.flag][1]}"></span>${flagMeta[r.flag][0]}</span></td>
      <td class="muted">${r.edited}</td>
      <td><span class="reveal-btn" onclick="event.stopPropagation();${ed?`runSequencer('${r.id}')`:''}">Sequence</span></td>
    </tr>`).join('')}</tbody>
  </table></div><div class="grid-foot"><span>8 routes · ${S.session.customers.toLocaleString()} customers</span></div></div></div>`;
}
function territoriesTab(){
  const rows=[['East Baton Rouge',2,344,'8h 12m','$118,420','Needs review','over'],['Campus',1,158,'7h 48m','$104,110','Balanced','balanced'],
    ['Denham',1,141,'6h 12m','$92,840','Underused','under'],['River Parish',1,172,'7h 31m','$107,530','Balanced','balanced'],
    ['Mid City',1,165,'8h 22m','$110,960','Needs review','over'],['Highland',1,149,'7h 05m','$96,270','Balanced','balanced'],
    ['Bluebonnet',1,181,'8h 41m','$114,880','Needs review','over'],['Zachary',1,148,'6h 48m','$85,799','Underused','under']];
  return `<div class="grid-scroll-v4"><div class="grid-panel"><div class="table-wrap"><table class="tbl-dense">
    <thead><tr><th>Territory</th><th>Routes</th><th>Customers</th><th>Avg Hours</th><th>Revenue</th><th>Balance Status</th></tr></thead>
    <tbody>${rows.map(r=>`<tr><td class="strong">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>
      <td><span class="balance-flag"><span class="bf-dot" style="background:${flagMeta[r[6]][1]}"></span>${r[5]}</span></td></tr>`).join('')}</tbody>
  </table></div><div class="grid-foot"><span>8 territories</span></div></div></div>`;
}
function heatTab(){
  const days=['Mon','Tue','Wed','Thu','Fri','Sat'];
  const wk = weeksForCycle();
  const base={Mon:[218,206,212,221,214,203,209,216],Tue:[256,311,272,240,262,248,258,244],Wed:[232,240,238,225,229,236,231,227],
    Thu:[208,216,219,211,205,213,210,214],Fri:[194,188,191,190,186,193,189,192],Sat:[62,58,65,60,61,59,63,57]};
  const max=311; const hc=v=>`hsl(35 88% ${100-Math.round((v/max)*52)}%)`;
  return `<div class="grid-scroll-v4"><div class="grid-panel" style="padding:18px">
    <div class="card-h">Stop distribution — Day × Week</div>
    <div class="card-sub">${S.session.cycle}-week cycle. ${S.session.cycle===8?'Week pairs (1+5, 2+6, 3+7, 4+8) are what balancing works across.':'4-week cycle — weeks 5–8 do not exist.'}</div>
    <table class="heatmap"><thead><tr><th></th>${wk.map(w=>`<th>${w}</th>`).join('')}</tr></thead>
    <tbody>${days.map(d=>`<tr><td class="heat-label">${d}</td>${wk.map((w,i)=>`<td><div class="heat-cell" style="background:${hc(base[d][i])}">${base[d][i]}<div class="heat-sub">stops</div></div></td>`).join('')}</tr>`).join('')}</tbody></table>
    ${S.session.cycle===8?`<div class="pair-hint" style="margin-top:14px">${I.info}<span>Tuesday Wk 2 is the heaviest cell (311 stops). Its pair, Tuesday Wk 6 (248), has capacity — a candidate for week-pair balancing.</span></div>`:''}
  </div></div>`;
}
function metricsTab(){
  return `<div class="grid-scroll-v4" style="padding:14px 18px">
    <div class="grid grid-4">
      <div class="stat"><div class="stat-label">Customers</div><div class="stat-value">1,300</div></div>
      <div class="stat"><div class="stat-label">Planning Rows</div><div class="stat-value">${S.rowModel==='A'?'1,300':'~6,500'}</div><div class="stat-meta">Row model ${S.rowModel}</div></div>
      <div class="stat"><div class="stat-label">Routes</div><div class="stat-value">8</div></div>
      <div class="stat"><div class="stat-label">Revenue</div><div class="stat-value" style="font-size:19px">$830,809</div></div>
      <div class="stat"><div class="stat-label">Avg Route Hours</div><div class="stat-value">7h 40m</div></div>
      <div class="stat"><div class="stat-label">Over Target</div><div class="stat-value" style="color:var(--amber)">3</div></div>
      <div class="stat"><div class="stat-label">Underused</div><div class="stat-value">2</div></div>
      <div class="stat"><div class="stat-label">Not in Master</div><div class="stat-value">85</div><div class="stat-meta">6.5% of imported customers</div></div>
    </div>
    <div class="section-note" style="margin-top:16px">${I.info}<span>Route metrics and route summary counts refresh independently of the grid, so a bulk edit never forces a full workspace reload.</span></div>
  </div>`;
}
function compareTab(){
  const rows=[['970','8h 55m','8h 12m','−43 min','Improved','$0'],['971','7h 48m','7h 48m','0','Unchanged','$0'],
    ['972','6h 12m','7h 04m','+52 min','Improved','$0'],['974','8h 22m','8h 05m','−17 min','Improved','$0']];
  return `<div class="grid-scroll-v4"><div class="grid-panel">
    <div style="padding:14px 18px;border-bottom:1px solid var(--border)"><div class="card-h" style="margin:0">Baseline vs Option 1</div>
      <div class="card-sub" style="margin:2px 0 0">Route mismatch uses the same backend flag as the customer drawer, so the two can never disagree.</div></div>
    <div class="table-wrap"><table class="tbl-dense">
      <thead><tr><th>Route</th><th>Baseline Hours</th><th>Option 1 Hours</th><th>Delta</th><th>Status</th><th>Revenue Impact</th></tr></thead>
      <tbody>${rows.map(r=>`<tr><td class="mono strong">${r[0]}</td><td class="muted">${r[1]}</td><td class="strong">${r[2]}</td>
        <td class="${r[3].includes('−')?'delta-neg':''}">${r[3]}</td><td>${r[4]==='Improved'?badge('valid','Improved'):badge('default','Unchanged')}</td><td class="muted">${r[5]}</td></tr>`).join('')}</tbody>
    </table></div><div class="grid-foot"><span>4 of 8 routes changed in Option 1</span></div>
  </div></div>`;
}

/* route drawer + quickest-time sequencer (RN-146) */
function openRouteDrawer(id){
  const r=ROUTES.find(x=>x.id===id); const ed=editable();
  openDrawer(`
    <div class="dr-head"><div><h3>Route ${r.id}</h3><div class="dh-sub">${r.driver} · ${r.depot} · ${isBaseline()?'Baseline':'Option 1'}</div></div>
      <button class="dr-close" onclick="closeDrawer()">${I.x}</button></div>
    <div class="dr-body">
      ${!ed?`<div class="lock-banner" style="margin:0 0 14px"><div class="lb-ic">${I.lock}</div>
        <div><div class="lb-t">The baseline can't be edited.</div><div class="lb-d">Save as a new option to make changes.</div></div>
        <button class="btn btn-primary btn-sm" onclick="saveAsDialog()">Save As</button></div>`:''}
      <div class="zone zone-a"><div class="zone-head">${I.route} Route Summary <span class="zone-tag">${ed?'Editable':'Read-only'}</span></div>
        <div class="zone-body">
          <div class="kv"><span class="k">Territory</span><span class="v">${r.terr}</span></div>
          <div class="kv"><span class="k">Customers</span><span class="v">${r.custs}</span></div>
          <div class="kv"><span class="k">Stops</span><span class="v">${r.stops}</span></div>
          <div class="kv"><span class="k">Total Hours</span><span class="v">${r.hours}</span></div>
          <div class="kv"><span class="k">Revenue / Cost</span><span class="v">${r.rev} · ${r.cost}</span></div>
          <div class="kv"><span class="k">Balance Flag</span><span class="v">${flagMeta[r.flag][0]}</span></div>
        </div></div>
      ${helperZone(r)}
      <div class="detail-sec-title" style="margin-top:14px">Sequencing ${rnTag('RN-146')}</div>
      <div id="seqZone">${seqIdle(r.id)}</div>
    </div>
    <div class="dr-foot"><button class="btn btn-secondary" style="flex:1;justify-content:center" onclick="closeDrawer()">Close</button></div>`);
}
function seqIdle(id){
  const ed=editable();
  return `<button class="btn btn-secondary" style="width:100%;justify-content:center" ${ed?'':'disabled '+lockTip()}
    onclick="${ed?`runSequencer('${id}',true)`:''}">${I.bolt}Sequence by Quickest Time<span class="kbd-chip">Ctrl+Q</span></button>
    <div class="perm-tip">${I.info}<span>Re-orders stops on this route into the fastest sequence. One click, undoable from the toast or Activity Feed.</span></div>`;
}
function runSequencer(id, inDrawer){
  id = id || '970';
  const zone = inDrawer ? document.getElementById('seqZone') : null;
  const already = (id==='971');   // scripted "nothing to improve"
  const setZone = html => { if(zone) zone.innerHTML=html; };
  setZone(`<div class="op-progress"><h4>Optimizing stop order…</h4>
    <div class="op-count">Evaluating drive time across ${ROUTES.find(r=>r.id===id).stops} stops</div>
    <div class="op-bar"><div class="op-fill" style="width:60%"></div></div></div>`);
  if(!inDrawer) toast('Optimizing stop order…');
  setTimeout(()=>{
    if(already){
      setZone(`<div class="section-note">${I.check}<span>This route is already in its quickest sequence. No changes were made.</span></div>${seqIdle(id)}`);
      if(!inDrawer) toast(`Route ${id} is already in its quickest sequence.`);
      return;
    }
    setZone(`<div class="seq-result"><div class="sr-ic">${I.check}</div>
        <div><div style="font-size:13px;font-weight:700;color:#157a41">Route re-sequenced. 12 min saved.</div>
        <div style="font-size:11.5px;color:#2f7d52;margin-top:2px">Stop order updated in Option 1.</div></div>
        <button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="undoSeq('${id}')">${I.undo}Undo</button></div>
      <div style="margin-top:10px">${seqIdle(id)}</div>`);
    FEED.unshift({type:'sequence',label:'Re-sequenced route',who:'Michael Reeves',when:'Just now',
      scope:`Route ${id} · ${ROUTES.find(r=>r.id===id).stops} stops · Option 1`,undo:true,rows:ROUTES.find(r=>r.id===id).stops,
      diff:[['Sequence','Original order','Quickest time'],['Drive time',ROUTES.find(r=>r.id===id).hours,'−12 min']]});
    if(!inDrawer){ rerenderWs(); toast(`Route ${id} re-sequenced. 12 min saved.`, {undo:`undoSeq('${id}')`}); }
  },1500);
}
function undoSeq(id){ toast(`Sequence for Route ${id} restored to the previous order.`); if(FEED[0]&&FEED[0].type==='sequence') FEED.shift(); }

/* helper rules — RN-141 */
function helperZone(r){
  const presale = S.session.scenario==='PRESALE';
  return `<div class="zone zone-b" style="border-color:var(--border)">
    <div class="zone-head">${I.user} Helpers <span class="zone-tag">${rnTag('RN-141').replace(/<[^>]*>/g,'')}</span></div>
    <div class="zone-body">
      <div class="kv" style="border-bottom:none;padding-top:0"><span class="k">Scenario</span><span class="v">${S.session.scenario}</span></div>
      ${r.helper?`<div class="helper-row"><div class="hr-av">JD</div>
        <div style="flex:1"><div style="font-size:12.5px;font-weight:600">J. Doucet</div><div style="font-size:11px;color:var(--text-mute)">Helper · assigned</div></div>
        ${badge('valid','Allowed')}</div>`:''}
      ${presale
        ? `<button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center" onclick="toast('Helper added to Route ${r.id}')">${I.plus}Add Helper</button>
           <div class="perm-tip">${I.check}<span>Helpers are allowed on presale routes.</span></div>`
        : `<button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center" disabled title="Helpers are not allowed on conventional routes">${I.plus}Add Helper</button>
           <div class="blocked-inline" style="margin-top:10px"><div class="bi-ic">${I.ban}</div>
             <div><div class="bi-t">Helpers are not allowed on conventional routes</div>
             <div class="bi-d">This session runs the ${S.session.scenario} (conventional) scenario. Switch the session scenario to presale to assign helpers.</div></div></div>
           <div class="open-q" style="margin-top:10px"><b>Open question · designer</b>Shown as a disabled control with an inline explanation rather than a blocking popup, per “disable, don’t reject”.</div>`}
    </div></div>`;
}

/* ============================================================
   ROW MODEL DECISION (blocking decision §1)
   ============================================================ */
function rowModelScreen(){
  return `<div class="screen active"><div class="page">
    ${crumbs(['Dashboard','Row Model Decision'])}
    ${head('Row Model Decision','How should a multi-day customer be represented in the planning grid? Nothing downstream can be finalised until this is answered.',
      `${rnTag('Blocks RN-150 / 152 / 154')}<button class="btn btn-secondary btn-sm" onclick="go('workspace')">Open Workspace</button>`)}
    <div class="section-note" style="margin-bottom:18px">${I.info}
      <span><b>Owner: Hadi.</b> In the real client data almost every customer is served Monday–Friday. Today the system holds one record per customer, which makes “assign this customer to Tuesday” meaningless. Both models are sketched below against real screens so the decision can be made concretely.</span></div>

    <div class="rm-grid">
      <!-- OPTION A -->
      <div class="rm-card ${S.rowModel==='A'?'pick':''}">
        <div class="rm-head">
          <div class="rm-opt">Option A</div>
          <h3>One row per customer</h3>
          <p>A customer appears once. Delivery Day is a multi-select chip group (MTWRF). Closest to the raw import.</p>
        </div>
        <div class="table-wrap"><table class="tbl-dense">
          <thead><tr><th>Customer ID</th><th>Route</th><th>Pattern</th><th class="col-planning">Delivery Days</th><th class="col-planning">Delivery Week</th><th>Revenue</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td class="mono strong">1000004</td><td class="mono">970</td><td class="mono">E4W</td>
              <td class="cell-planning">${dayChips(['Mon','Tue','Wed','Thu','Fri'])}</td><td class="cell-planning">Wk 1, Wk 5</td><td>$372.36</td><td>${badge('valid','Valid')}</td></tr>
            <tr><td class="mono strong">1000377</td><td class="mono">970</td><td class="mono">2W</td>
              <td class="cell-planning">${dayChips(['Mon','Thu'])}</td><td class="cell-planning">Wk 1, Wk 5</td><td>$298.10</td><td>${badge('valid','Valid')}</td></tr>
            <tr><td class="mono strong">1000108</td><td class="mono">971</td><td class="mono">4T</td>
              <td class="cell-planning">${dayChips(['Tue'])}</td><td class="cell-planning">Wk 3</td><td>$210.84</td><td>${badge('warn','Warning')}</td></tr>
          </tbody>
        </table></div>
        <div class="rm-sec"><div class="rm-sec-t">Row count</div>
          <div class="rowcount-note">${I.info}<span>1,300 customers → <b>1,300 rows</b>. Select-all means what the analyst expects.</span></div></div>
        <div class="rm-sec"><div class="rm-sec-t">Pros</div>
          <ul class="pc-list pc-pro">
            <li>${I.check}Simpler grid, lower row count</li>
            <li>${I.check}Closest to the raw Extension Report import</li>
            <li>${I.check}“Select all matching” is unambiguous</li>
          </ul></div>
        <div class="rm-sec"><div class="rm-sec-t">Cons</div>
          <ul class="pc-list pc-con">
            <li>${I.warn}Week-pair balancing has nothing granular to balance</li>
            <li>${I.warn}“Assign to Tuesday” is ambiguous for a Mon–Fri customer</li>
            <li>${I.warn}Less granular for route optimisation</li>
          </ul></div>
        <div class="rm-sec"><button class="btn ${S.rowModel==='A'?'btn-primary':'btn-secondary'}" style="width:100%;justify-content:center" onclick="pickRowModel('A')">${S.rowModel==='A'?'Previewing Option A':'Preview Option A in grid'}</button></div>
      </div>

      <!-- OPTION B -->
      <div class="rm-card ${S.rowModel==='B'?'pick':''}">
        <div class="rm-head">
          <div class="rm-opt">Option B</div>
          <h3>One row per customer per service day</h3>
          <p>A Mon–Fri customer becomes 5 planning rows. Each row carries its own day and week, and validates separately.</p>
        </div>
        <div class="table-wrap"><table class="tbl-dense">
          <thead><tr><th>Customer ID</th><th>Group</th><th>Route</th><th class="col-planning">Day</th><th class="col-planning">Week</th><th>Pattern</th><th>Revenue Alloc.</th><th>Status</th></tr></thead>
          <tbody>
            <tr class="grp-header"><td colspan="8">Customer <b class="mono">1000004</b> · Route 970 · E4W<span class="grp-badge">5 service-day rows</span></td></tr>
            ${['Mon','Tue','Wed'].map((d,i)=>`<tr class="grp-child"><td class="mono">1000004</td><td>${badge('default','Group A')}</td><td class="mono">970</td>
              <td class="cell-planning">${dayChips([d])}</td><td class="cell-planning">Wk 1</td><td class="mono">E4W</td><td>$74.47</td><td>${badge('valid','Valid')}</td></tr>`).join('')}
            <tr class="grp-child"><td colspan="8" class="muted" style="border-left:3px solid var(--yellow)">…Thu and Fri rows</td></tr>
          </tbody>
        </table></div>
        <div class="rm-sec"><div class="rm-sec-t">Row count</div>
          <div class="rowcount-note">${I.warn}<span>1,300 customers → <b>~6,500 rows</b>. Changes what “select all” means and needs grouping so rows don’t read as duplicates.</span></div></div>
        <div class="rm-sec"><div class="rm-sec-t">Pros</div>
          <ul class="pc-list pc-pro">
            <li>${I.check}Best fit for day and week-pair balancing</li>
            <li>${I.check}Clear bulk assignment logic per service day</li>
            <li>${I.check}Each service day validates independently</li>
          </ul></div>
        <div class="rm-sec"><div class="rm-sec-t">Cons</div>
          <ul class="pc-list pc-con">
            <li>${I.warn}~5× more rows to load and scroll</li>
            <li>${I.warn}Needs grouped-row treatment to avoid looking like duplicates</li>
            <li>${I.warn}Selection maximums and scope copy get harder</li>
          </ul></div>
        <div class="rm-sec"><button class="btn ${S.rowModel==='B'?'btn-primary':'btn-secondary'}" style="width:100%;justify-content:center" onclick="pickRowModel('B')">${S.rowModel==='B'?'Previewing Option B':'Preview Option B in grid'}</button></div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:18px">
      <div class="card-h">Recommended treatment if Option B is chosen</div>
      <div class="card-sub">Grouped rows under a customer header with an explicit service-day count badge, and a left accent rail on child rows.</div>
      <div class="table-wrap" style="border:1px solid var(--border);border-radius:12px"><table class="tbl-dense">
        <thead><tr><th>Customer / Row</th><th class="col-planning">Day</th><th class="col-planning">Week</th><th>Revenue Alloc.</th><th>Status</th></tr></thead>
        <tbody>
          <tr class="grp-header"><td colspan="5">Customer <b class="mono">1000846</b> · Route 976 · E4W<span class="grp-badge">5 service-day rows</span></td></tr>
          ${['Mon','Tue','Wed','Thu','Fri'].map(d=>`<tr class="grp-child"><td class="muted">Service day row</td><td class="cell-planning">${dayChips([d])}</td>
            <td class="cell-planning">Wk 1</td><td>$103.53</td><td>${badge('valid','Valid')}</td></tr>`).join('')}
        </tbody></table></div>
    </div>
  </div></div>`;
}
function pickRowModel(m){ S.rowModel=m; go('rowModel'); toast(`Grid now previews row model ${m}.`); }

/* ============================================================
   MAP / LASSO + PRE-MOVE VALIDATION (RN-143)
   ============================================================ */
let MAP_SEL = 0;
const MAP_PTS = [[22,30],[27,25],[32,34],[26,40],[36,29],[31,45],[21,47],[41,40],[45,44],[43,50],[48,42],[46,51],[55,56],[60,61],[57,67],[63,55],[66,64],[52,63],[70,31],[78,39],[82,49],[68,73],[60,79],[40,73],[30,67],[20,63],[74,73],[85,65],[50,35],[62,41]];
function mapScreen(){
  return `<div class="screen active"><div class="ws">
    <div class="ws-head">
      ${crumbs(['Dashboard','Sessions','Delivery Scenario 07/23/2026','Session Map'])}
      <div class="ws-titlebar">
        <div><h1>Session Map</h1><div class="sub">Spatial lens on the same session data. Lasso stops for bulk reassignment — every move is pre-validated before it is written.</div></div>
        <div class="head-actions">${rnTag('RN-143')}
          <button class="btn btn-secondary btn-sm" onclick="go('workspace')">${I.columns}Back to Grid</button></div>
      </div>
      <div class="metadata-strip" style="margin:12px 0 0">
        <span class="meta-chip"><span class="mk">Active Version:</span> <b>${isBaseline()?'Baseline':'Option 1'}</b></span>
        <span class="meta-chip"><span class="mk">Cycle:</span> <b>${S.session.cycle} Week</b></span>
        <span class="meta-chip"><span class="mk">Filters:</span> <b>Shared with grid</b></span>
        <span class="meta-chip"><span class="mk">Stops visible:</span> <b>4,343</b></span>
      </div>
    </div>
    <div class="ws-toolbar">
      <button class="btn ${MAP_SEL?'btn-accent':'btn-secondary'} btn-sm" onclick="doLasso()">${I.lasso}Lasso Tool</button>
      <button class="btn btn-secondary btn-sm">${I.pin}Pin</button>
      <button class="btn btn-secondary btn-sm">${I.target}Recenter</button>
      <div style="flex:1"></div>
      <button class="btn btn-secondary btn-sm" onclick="go('workspace')">Back to Grid</button>
    </div>
    <div class="ws-body">
      <div class="opt-rail">
        <div class="rail-title">Colour by</div>
        <div class="radio-group">
          <div class="radio-row active"><span class="radio-dot"></span>Route</div>
          <div class="radio-row"><span class="radio-dot"></span>Territory</div>
          <div class="radio-row"><span class="radio-dot"></span>Delivery Day</div>
          <div class="radio-row"><span class="radio-dot"></span>Frequency</div>
        </div>
        <div class="rail-title">Filters</div>
        <div class="filter-mini"><label class="field-label">Route</label><select class="select"><option>970</option><option>All routes</option></select></div>
        <div class="filter-mini"><label class="field-label">Delivery Day</label><select class="select"><option>All days</option><option>Tue</option></select></div>
        <div class="filter-mini"><label class="field-label">Week of Cycle</label><select class="select">${weeksForCycle().map(w=>`<option>${w}</option>`).join('')}</select></div>
        <div class="help-card">${I.info}<span>Lasso selects planned customer stops for bulk reassignment. This is planning, not live tracking — no vehicle positions are shown.</span></div>
      </div>
      <div class="map-canvas-wrap" style="position:relative">
        <svg class="map-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="100" fill="#f2f3f4"/>
          <path d="M-5 60 Q 25 52 45 62 T 100 64 L 105 105 L -5 105 Z" fill="#dfeaf2"/>
          <g stroke="#f6df9a" stroke-width=".9" opacity=".7" fill="none"><path d="M0 38 H100"/><path d="M0 68 H100"/><path d="M20 0 V100"/><path d="M74 0 V100"/></g>
          <g stroke="#fff" stroke-width=".8" opacity=".95" fill="none"><path d="M0 22 H100"/><path d="M0 52 H100"/><path d="M0 82 H100"/><path d="M36 0 V100"/><path d="M56 0 V100"/></g>
        </svg>
        ${MAP_SEL?`<svg class="map-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="38,36 51,38 50,54 40,53" fill="rgba(227,154,43,.15)" stroke="#c8801a" stroke-width=".5" stroke-dasharray="1.2 1"/></svg>`:''}
        <div class="map-marker" style="left:16%;top:34%"><div class="mm-depot">${I.pin}</div></div>
        ${MAP_PTS.map(([x,y],i)=>{
          const inLasso = MAP_SEL && x>=38&&x<=51&&y>=36&&y<=54;
          return `<div class="map-marker" style="left:${x}%;top:${y}%"><div class="mm-dot ${inLasso?'sel':''}" style="background:${inLasso?'#e39a2b':(i%5===0?'#2f6bff':'#171717')}"></div></div>`;
        }).join('')}
        <div class="map-ctl-tr"><div class="map-seg"><button class="active">Map</button><button>Satellite</button></div></div>
        <div class="map-ctl-br"><div class="map-zoom"><button>+</button><button>−</button></div></div>
        <div class="map-legend"><div class="lt">Legend</div>
          <div class="legend-row"><span class="legend-dot" style="background:#171717"></span>Planned stop</div>
          <div class="legend-row"><span class="legend-dot" style="background:#2f6bff"></span>Route 972 (destination)</div>
          <div class="legend-row"><span class="legend-dot" style="background:#e39a2b"></span>Lasso selection</div>
          <div class="legend-row"><span class="legend-dot sq"></span>Depot</div></div>
      </div>
      <div class="sel-rail">
        ${MAP_SEL ? mapSelPanel() : `<div class="sel-head"><h3>Map Selection</h3></div>
          <div class="sel-empty">${I.lasso}<p>Use the Lasso tool to select stops on the map.</p></div>`}
      </div>
    </div>
  </div></div>`;
}
function mapSelPanel(){
  return `<div class="sel-head"><h3>Lasso Selection</h3><div class="ss">20 stops selected</div></div>
    <div class="sel-cards">
      <div class="sel-card"><div class="l">Stops</div><div class="v">20</div></div>
      <div class="sel-card"><div class="l">Customers</div><div class="v">14</div></div>
      <div class="sel-card"><div class="l">Source Route</div><div class="v mono" style="font-size:14px">970</div></div>
      <div class="sel-card"><div class="l">Territory</div><div class="v" style="font-size:12px">East Baton Rouge</div></div>
    </div>
    <div class="detail-sec-title">Bulk reassign to</div>
    <select class="select" style="margin-bottom:14px"><option>972 — Denham (R. Carter)</option><option>977 — Zachary (K. Obi)</option></select>
    <div class="section-note">${I.warn}<span>Every selected stop is checked against the rules gate <b>before</b> anything moves.</span></div>
    <div class="sel-actions"><button class="btn btn-secondary" onclick="MAP_SEL=0;go('map')">Clear</button>
      <button class="btn btn-primary" onclick="preMoveValidate()">Validate Move</button></div>`;
}
function doLasso(){ MAP_SEL=1; go('map'); toast('20 stops selected with Lasso'); }
/* RN-143 mixed-result confirmation */
function preMoveValidate(){
  openModal(`
    <h2>Reassign 20 stops to Route 972?</h2>
    <p class="msub">Pre-move validation complete. Blocked stops will not move.</p>
    <div class="premove-sum">
      <div class="pm-card ok"><div class="pm-v">18</div><div class="pm-l">Stops OK</div></div>
      <div class="pm-card bad"><div class="pm-v">2</div><div class="pm-l">Stops blocked</div></div>
    </div>
    <div class="detail-sec-title">Blocked stops</div>
    <div class="viol-scroll" style="max-height:180px">
      <table class="tbl-dense"><thead><tr><th>Customer</th><th>Stop</th><th>Reason</th></tr></thead><tbody>
        <tr><td class="mono strong">1000108</td><td class="mono">ST-4419</td><td style="white-space:normal">Service pattern does not allow the destination route’s delivery day.</td></tr>
        <tr><td class="mono strong">1000615</td><td class="mono">ST-4482</td><td style="white-space:normal">Destination route is served from a different depot.</td></tr>
      </tbody></table>
    </div>
    <div class="open-q" style="margin-top:12px"><b>Open question · designer</b>Proceeding with only the valid stops is offered here rather than forcing a full fix first — the blocked rows stay exactly as they are.</div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel Move</button>
      <button class="btn btn-primary" onclick="closeModal(); applyLassoMove()">Move 18 valid stops</button>
    </div>`, true);
}
function applyLassoMove(){
  MAP_SEL=0;
  FEED.unshift({type:'move',label:'Moved stop',who:'Michael Reeves',when:'Just now',
    scope:'18 stops · Route 970 → 972 · Option 1',undo:true,rows:18,
    diff:[['Route / Territory','970','972'],['Blocked (unchanged)','—','2 stops']]});
  go('map'); toast('18 stops moved to Route 972. 2 blocked stops were left unchanged.', {undo:"undoEntry(0)"});
}

/* ============================================================
   CUSTOMER MASTER + ENHANCEMENT IMPORT (RN-170)
   ============================================================ */
function customerMasterScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Customer Master'])}
    ${head('Customer Master','The global customer database, shared by every session. Editing is limited to Admin and Ingest Admin.',
      `${rnTag('RN-170')}<button class="btn btn-primary btn-sm" onclick="go('masterImport')">${I.upload}Enhancement Import</button>`)}
    <div class="grid grid-4">
      <div class="stat"><div class="stat-top"><div class="stat-icon">${I.db}</div></div><div class="stat-label">Customers in Master</div><div class="stat-value">34,918</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon">${I.user}</div></div><div class="stat-label">In current session</div><div class="stat-value">1,215</div><div class="stat-meta">of 1,300 imported</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon amber">${I.warn}</div></div><div class="stat-label">Not in Master</div><div class="stat-value">85</div><div class="stat-meta">6.5% — no address or preferred route</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon">${I.pin}</div></div><div class="stat-label">Missing coordinates</div><div class="stat-value">312</div></div>
    </div>
    <div class="sec-title"><h2>Browse Customer Master</h2></div>
    <div class="card">
      <div class="grid-toolbar"><div class="toolbar-search">${I.search}<input placeholder="Search Location ID or name" /></div>
        <button class="mini-filter">Market ${I.chevron}</button><div class="toolbar-spacer"></div><button class="mini-filter">${I.columns} Columns</button></div>
      <div class="table-wrap"><table class="tbl-dense">
        <thead><tr><th>Location ID</th><th>Preferred Route</th><th>Master Delivery Days</th><th>Address</th><th>Service Time</th><th>Lat / Lng</th><th>Last Updated</th><th></th></tr></thead>
        <tbody>${CUSTOMERS.filter(c=>c.master==='in').map(c=>`<tr>
          <td class="mono strong">${c.id}</td><td class="mono">${c.pref}</td><td class="mono">${c.masterDays}</td>
          <td class="muted" style="max-width:250px;overflow:hidden;text-overflow:ellipsis">${c.address}</td>
          <td>${c.svc}</td><td>${c.geo==='Available'?badge('valid','Available'):badge('nomaster','Missing')}</td>
          <td class="muted">Jul 22</td>
          <td><span class="link-gate" title="You can view Customer Master data, but you don’t have permission to edit it.">${I.lock}Edit</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div class="grid-foot"><span>Showing 6 of 34,918 · paginated</span>
        <div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>…</button><button>1,455</button><button>›</button></div></div>
    </div>
    <div class="section-note" style="margin-top:16px">${I.lock}<span><b>Permissions.</b> Analysts can view Master data but never write it. This matches the read-only Customer Master zone in the customer drawer — one plan's decision must never leak into every other session.</span></div>
  </div></div>`;
}

const IMPORT_COLS = ['Preferred Route','Delivery Days','Latitude / Longitude'];
const UNTOUCHED_COLS = ['Address','Service Time','Time Window','Sales Group','Contact Name','Contact Phone','Station Count','Rental Equipment'];
function masterImportScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Customer Master','Enhancement Import'])}
    ${head('Customer Master Enhancement Import','Updates existing customers only. New customers arrive through the Extension Report reconcile flow.',rnTag('RN-170'))}
    <div class="stepper">
      <div class="step complete"><span class="step-num">${I.check}</span><span class="step-txt">Upload</span></div><span class="step-sep">›</span>
      <div class="step active"><span class="step-num">2</span><span class="step-txt">Confirm columns</span></div><span class="step-sep">›</span>
      <div class="step"><span class="step-num">3</span><span class="step-txt">Result</span></div>
    </div>
    <div class="two-col">
      <div>
        <div class="file-row" style="margin-top:0">
          <div class="file-ic">${I.sheet}</div>
          <div style="flex:1"><div class="file-name">Master_Enhancement_BatonRouge_Jul2026.xlsx</div>
            <div class="file-meta">4.2 MB · 1,214 rows read · uploaded just now</div></div>
          ${badge('valid','Parsed')}
        </div>

        <!-- THE safety screen -->
        <div class="confirm-card" style="margin-top:16px">
          <div class="cc-t">This file will update 3 fields for 1,214 customers</div>
          <div class="col-list">${IMPORT_COLS.map(c=>`<span class="col-chip">${c}</span>`).join('')}</div>
          <div class="cc-d"><b>All other customer fields will be left unchanged.</b> Columns absent from the file are never written, so an incomplete file cannot wipe existing data.</div>
          <div class="detail-sec-title" style="margin-top:14px">Left untouched (${UNTOUCHED_COLS.length})</div>
          <div class="col-list">${UNTOUCHED_COLS.map(c=>`<span class="col-chip untouched">${c}</span>`).join('')}</div>
          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-secondary" onclick="go('customerMaster')">Cancel</button>
            <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="runImport()">Confirm import</button>
          </div>
        </div>

        <div class="sec-title"><h2>Geocoding</h2></div>
        <div class="geo-lock">
          <span class="check-on">${I.check}</span>
          <div><div style="font-size:12.5px;font-weight:700">Do NOT Geocode — use coordinates from the file</div>
            <div style="font-size:11.5px;color:var(--text-soft);margin-top:3px;line-height:1.5">There is no geocoding service in the product. Coordinates are taken exactly as supplied in the file. This option is fixed for version 1.</div></div>
        </div>
      </div>
      <div>
        <div class="card card-pad">
          <div class="card-h">What this import does</div>
          <ul class="list-plain">
            <li>${I.check}Updates existing customers only</li>
            <li>${I.check}Never creates new customers</li>
            <li>${I.check}Only writes columns present in the file</li>
          </ul>
          <div class="perm-tip">${I.lock}<span>Import is Admin and Ingest Admin only.</span></div>
        </div>
        <div class="pii-note" style="margin-top:14px">${I.lock}
          <span><b>Privacy.</b> Customer contact details are PII. If a contact column is present, its value never appears in the error report or any preview — errors reference the row and column only.</span></div>
        <div class="open-q" style="margin-top:14px"><b>Open decision · Hadi</b>If a row has bad coordinates but valid non-geographic values, reject the whole row or only the coordinates? Design assumes <b>reject the whole row</b> — one row equals one outcome.</div>
      </div>
    </div>
  </div></div>`;
}
function runImport(){
  openModal(`<div style="text-align:center;padding:8px 0">
    <div class="load-spin" style="margin:0 auto 16px"></div>
    <h2>Importing enhancements</h2>
    <p class="msub">Updating 3 fields for 1,214 customers…</p></div>`);
  setTimeout(()=>{ closeModal(); go('masterImportResult'); },1800);
}
const IMPORT_ERRORS = [
  { row:14,  id:'—',       code:'MISSING_ID',          msg:'No Location ID in this row',            fix:'Add the Location ID and re-upload' },
  { row:52,  id:'9900412', code:'UNKNOWN_LOCATION_ID', msg:'No customer in Master with this ID',    fix:'This import only updates existing customers. New customers are added through Extension Report reconcile.' },
  { row:118, id:'1000377', code:'NON_NUMERIC_COORD',   msg:'Latitude or longitude isn’t a number',  fix:'Check for text or symbols in the coordinate columns' },
  { row:206, id:'1000492', code:'LAT_OUT_OF_RANGE',    msg:'Latitude must be between -90 and 90',   fix:'Verify latitude and longitude aren’t swapped' },
  { row:341, id:'1000731', code:'LNG_OUT_OF_RANGE',    msg:'Longitude must be between -180 and 180',fix:'Verify latitude and longitude aren’t swapped' },
  { row:512, id:'1000846', code:'NULL_ISLAND',         msg:'Coordinates are 0, 0',                  fix:'This usually means missing coordinates — leave blank instead' },
];
function masterImportResult(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Customer Master','Enhancement Import','Result'])}
    ${head('Import complete','1,214 rows read. Only the three confirmed fields were written; every other field was left unchanged.',rnTag('RN-170'))}
    <div class="stepper">
      <div class="step complete"><span class="step-num">${I.check}</span><span class="step-txt">Upload</span></div><span class="step-sep">›</span>
      <div class="step complete"><span class="step-num">${I.check}</span><span class="step-txt">Confirm columns</span></div><span class="step-sep">›</span>
      <div class="step active"><span class="step-num">3</span><span class="step-txt">Result</span></div>
    </div>
    <div class="grid grid-3">
      <div class="stat"><div class="stat-label">Rows read</div><div class="stat-value">1,214</div></div>
      <div class="stat"><div class="stat-label">Rows updated</div><div class="stat-value" style="color:var(--green)">1,208</div></div>
      <div class="stat"><div class="stat-label">Rows skipped</div><div class="stat-value" style="color:var(--amber)">6</div></div>
    </div>
    <div class="sec-title"><h2>Error report</h2>
      <span class="link" onclick="toast('errors_Master_Enhancement_Jul2026.csv downloaded')">${I.download} Download full report</span></div>
    <div class="card">
      <div class="table-wrap"><table class="tbl-dense">
        <thead><tr><th>Row</th><th>Location ID</th><th>Error</th><th>Message</th><th>Recommended correction</th></tr></thead>
        <tbody>${IMPORT_ERRORS.map(e=>`<tr>
          <td class="err-row-num">${e.row}</td><td class="mono">${e.id}</td>
          <td><span class="err-code">${e.code}</span></td>
          <td style="white-space:normal;min-width:180px">${e.msg}</td>
          <td class="muted" style="white-space:normal;min-width:230px">${e.fix}</td>
        </tr>`).join('')}</tbody>
      </table></div>
      <div class="grid-foot"><span>Showing all 6 errors · inline preview capped at 200 rows</span></div>
    </div>
    <div class="pii-note" style="margin-top:14px">${I.lock}<span>No contact details appear in this report. Errors reference the row and column only.</span></div>
    <div class="cta-row" style="justify-content:flex-start;margin-top:18px">
      <button class="btn btn-secondary" onclick="go('customerMaster')">Back to Customer Master</button>
      <button class="btn btn-primary" onclick="go('workspace')">Open Route Workspace ${I.arrow}</button>
    </div>
  </div></div>`;
}

/* ============================================================
   CREATE SESSION — defaults + progressive baseline preview (RN-144)
   ============================================================ */
let CS = { market:'', scenario:'DELIVERY', cycle:8, week:'Wk 1', depot:'BR North', period:'Jul 2026',
           touched:{}, name:'Delivery Scenario as of 07/23/2026, 4:42 PM' };
function createSessionScreen(){
  const t=CS.touched;
  const dflt = k => t[k] ? '' : `<span class="dflt-tag">Default</span>`;
  const reset = k => t[k] ? `<span class="reset-dflt" onclick="resetField('${k}')">Reset to default</span>` : '';
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions','Create Planning Session'])}
    ${head('Create Planning Session','Create a planning workspace from the latest committed master dataset. The baseline is snapshotted and locked when the session is created.',rnTag('RN-144'))}
    <div class="card card-pad" style="margin-bottom:18px">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div class="stat-icon" style="flex-shrink:0">${I.info}</div>
        <div style="flex:1">
          <div class="card-h">Master Dataset → Session → Baseline → Option</div>
          <div class="card-sub" style="margin-bottom:0">A session is one planning exercise for a market with a fixed cycle. The system snapshots the baseline at creation. The baseline stays locked; all edits happen inside an Option.</div>
          <div class="flow">
            <span class="flow-node">Master Dataset</span><span class="flow-arrow">→</span>
            <span class="flow-node hi">Session</span><span class="flow-arrow">→</span>
            <span class="flow-node">Baseline Snapshot</span><span class="flow-arrow">→</span>
            <span class="flow-node">Working Option</span><span class="flow-arrow">→</span>
            <span class="flow-node">Final Plan</span>
          </div>
        </div>
      </div>
    </div>
    <div class="two-col">
      <div class="card card-pad">
        <div class="card-h">Session Configuration</div>
        <div class="card-sub">Defaults are pre-filled from clarified rules and remain editable.</div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Session Name ${dflt('name')}</label>${reset('name')}</div>
          <input class="text-input" value="${CS.name}" oninput="touchField('name')" /></div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Market / Territory Scope</label></div>
          <select class="select" onchange="setCS('market',this.value)">
            <option value="" ${CS.market===''?'selected':''}>Select a market…</option>
            <option ${CS.market==='Baton Rouge'?'selected':''}>Baton Rouge</option>
            <option ${CS.market==='New Orleans'?'selected':''}>New Orleans</option>
            <option ${CS.market==='Lafayette'?'selected':''}>Lafayette</option>
          </select></div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Scenario ${dflt('scenario')}</label>${reset('scenario')}</div>
          <select class="select" onchange="setCS('scenario',this.value); touchField('scenario')">
            <option ${CS.scenario==='DELIVERY'?'selected':''}>DELIVERY</option>
            <option ${CS.scenario==='BASELINE'?'selected':''}>BASELINE</option>
            <option ${CS.scenario==='PRESALE'?'selected':''}>PRESALE</option>
          </select>
          ${CS.scenario==='PRESALE'?`<div class="perm-tip">${I.check}<span>Presale routes allow helpers to be assigned.</span></div>`
            :`<div class="perm-tip">${I.info}<span>Conventional scenario — helpers are not allowed on these routes (RN-141).</span></div>`}</div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Cycle Length ${dflt('cycle')}</label>${reset('cycle')}</div>
          <div class="segmented"><button class="${CS.cycle===4?'active':''}" onclick="setCS('cycle',4); touchField('cycle')">4 Week</button>
            <button class="${CS.cycle===8?'active':''}" onclick="setCS('cycle',8); touchField('cycle')">8 Week</button></div></div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Starting Week ${dflt('week')}</label>${reset('week')}</div>
          <select class="select" onchange="setCS('week',this.value); touchField('week')">
            ${(CS.cycle===8?['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8']:['Wk 1','Wk 2','Wk 3','Wk 4']).map(w=>`<option ${CS.week===w?'selected':''}>${w}</option>`).join('')}
          </select></div>
        <div class="field"><div class="field-label-row"><label class="field-label" style="margin:0">Depot ${dflt('depot')}</label>${reset('depot')}</div>
          <select class="select" onchange="setCS('depot',this.value); touchField('depot')">
            <option ${CS.depot==='BR North'?'selected':''}>BR North</option><option ${CS.depot==='BR East'?'selected':''}>BR East</option><option ${CS.depot==='BR South'?'selected':''}>BR South</option>
          </select></div>
        <div class="field" style="margin-bottom:0"><div class="field-label-row"><label class="field-label" style="margin:0">Time Period ${dflt('period')}</label>${reset('period')}</div>
          <select class="select" onchange="setCS('period',this.value); touchField('period')">
            <option ${CS.period==='Jul 2026'?'selected':''}>Jul 2026</option><option ${CS.period==='Aug 2026'?'selected':''}>Aug 2026</option>
          </select></div>
      </div>
      <div>
        <div class="card card-pad">
          <div class="card-h">Baseline Preview</div>
          <div class="card-sub">${CS.market? `Baseline that will be snapshotted for <b>${CS.market}</b>.` : 'Select a market, scenario, cycle, depot, and planning period to preview the baseline that will be created.'}</div>
          <div class="detail-metric"><span class="l">Estimated customers</span><span class="v ${CS.market?'':'preview-empty-v'}">${CS.market?'1,300':'—'}</span></div>
          <div class="detail-metric"><span class="l">Estimated planning rows</span><span class="v ${CS.market?'':'preview-empty-v'}">${CS.market?(S.rowModel==='A'?'1,300':'~6,500'):'—'}</span></div>
          <div class="detail-metric"><span class="l">Routes</span><span class="v ${CS.market?'':'preview-empty-v'}">${CS.market?'8':'—'}</span></div>
          <div class="detail-metric"><span class="l">Territories</span><span class="v ${CS.market?'':'preview-empty-v'}">${CS.market?'8':'—'}</span></div>
          <div class="detail-metric"><span class="l">Depots</span><span class="v ${CS.touched.depot||CS.market?'':'preview-empty-v'}">${CS.market?CS.depot:'—'}</span></div>
          <div class="detail-metric"><span class="l">Cycle</span><span class="v">${CS.cycle} Week <span class="muted" style="font-weight:500">(weeks 1–${CS.cycle})</span></span></div>
          <div class="detail-metric"><span class="l">Scenario</span><span class="v">${CS.scenario}</span></div>
          <div class="detail-metric"><span class="l">Starting week</span><span class="v">${CS.week}</span></div>
          <div class="detail-metric"><span class="l">Baseline source</span><span class="v" style="font-size:11.5px">Latest committed master dataset</span></div>
          ${CS.cycle===8?`<div class="pair-hint">${I.info}<span>8-week cycle — weeks pair 1+5, 2+6, 3+7, 4+8 for balancing.</span></div>`:''}
          ${CS.scenario==='PRESALE'?`<div class="perm-tip">${I.check}<span>Scenario rules: helpers allowed.</span></div>`:`<div class="perm-tip">${I.ban}<span>Scenario rules: helpers not allowed (conventional).</span></div>`}
          <div class="section-note" style="margin-top:14px">${I.lock}<span>The system will snapshot this baseline when the session is created. The baseline will remain locked, and edits will happen inside an Option.</span></div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px" ${CS.market?'':'disabled title="Select a market to continue"'}
            onclick="${CS.market?'createSession()':''}">Create Session ${I.arrow}</button>
        </div>
        <div class="card card-pad" style="margin-top:14px">
          <div class="card-h">Configuration pulled automatically</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
            ${['Vehicle counts','Helper rules','Cost model','Depot defaults','Service time rules','Route templates'].map(x=>`<span class="col-chip untouched">${x}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div></div>`;
}
function setCS(k,v){ CS[k]=v; if(k==='cycle'&&v===4&&['Wk 5','Wk 6','Wk 7','Wk 8'].includes(CS.week)) CS.week='Wk 1'; go('createSession'); }
function touchField(k){ CS.touched[k]=true; }
function resetField(k){ const d={name:'Delivery Scenario as of 07/23/2026, 4:42 PM',scenario:'DELIVERY',cycle:8,week:'Wk 1',depot:'BR North',period:'Jul 2026'};
  CS[k]=d[k]; delete CS.touched[k]; go('createSession'); }
function createSession(){
  S.session.cycle=CS.cycle; S.session.scenario=CS.scenario; S.session.depot=CS.depot;
  document.getElementById('tpCycle').innerHTML=`<span class="tp-k">Cycle</span> ${CS.cycle} Week`;
  openModal(`<div style="text-align:center;padding:8px 0"><div class="load-spin" style="margin:0 auto 16px"></div>
    <h2>Snapshotting baseline…</h2><p class="msub">Building session workspace and applying scenario rules.</p></div>`);
  setTimeout(()=>{ closeModal(); switchOption('option1'); go('workspace');
    FEED.unshift({type:'option',label:'Saved as new option',who:'Michael Reeves',when:'Just now',scope:'Option 1 created from Baseline',undo:true,rows:1});
    toast('Session created. Baseline snapshotted and locked.'); },1600);
}

/* ============================================================
   DASHBOARD + SUPPORTING SCREENS
   ============================================================ */
function dashboard(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard'])}
    ${head('Route Planning Portal','Plan market-level route cycles from an immutable baseline, work in options, validate business rules, and export finalized route data.',
      `<button class="btn btn-secondary btn-sm" onclick="go('createSession')">${I.plus}New Session</button>
       <button class="btn btn-primary btn-sm" onclick="go('workspace')">Open Route Workspace ${I.arrow}</button>`)}
    <div class="grid grid-4">
      <div class="stat"><div class="stat-top"><div class="stat-icon">${I.sheet}</div><span class="pill ready"><span class="pill-dot"></span>Ready</span></div>
        <div class="stat-label">Extension Report</div><div class="stat-value">1,300</div>
        <div class="stat-meta">customers · 8 routes · $830,809 revenue</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon blue">${I.db}</div></div>
        <div class="stat-label">Planning Sessions</div><div class="stat-value">4 open</div><div class="stat-meta">1 draft edited today</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon">${I.clock}</div></div>
        <div class="stat-label">Current Session</div><div class="stat-value" style="font-size:15px">Delivery Scenario 07/23</div>
        <div class="stat-meta">${S.session.cycle} Week cycle · DRAFT</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon amber">${I.warn}</div><span class="pill over"><span class="pill-dot"></span>Attention</span></div>
        <div class="stat-label">Not in Customer Master</div><div class="stat-value">85</div><div class="stat-meta">6.5% — no address or preferred route</div></div>
    </div>
    <div class="two-col-even" style="margin-top:22px">
      <div>
        <div class="sec-title"><h2>Open Sessions</h2><span class="link" onclick="go('sessions')">Manage</span></div>
        <div class="card table-wrap"><table class="tbl-dense">
          <thead><tr><th>Session</th><th>Scenario</th><th>Cycle</th><th>Routes</th><th>Customers</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr class="row-click" onclick="go('workspace')"><td class="strong">Delivery Scenario as of 07/23/2026</td><td><span class="pill scenario">DELIVERY</span></td>
              <td>${S.session.cycle} Week</td><td>8</td><td>1,300</td><td>${badge('warn','Draft')}</td><td><span class="reveal-btn">Open</span></td></tr>
            <tr class="row-click" onclick="go('workspace')"><td class="strong">Baton Rouge 4 Week Delivery</td><td><span class="pill scenario">DELIVERY</span></td>
              <td>4 Week</td><td>6</td><td>942</td><td>${badge('default','Baseline only')}</td><td><span class="reveal-btn">Open</span></td></tr>
            <tr class="row-click" onclick="go('workspace')"><td class="strong">New Orleans Presale Pilot</td><td><span class="pill scenario">PRESALE</span></td>
              <td>8 Week</td><td>7</td><td>1,088</td><td>${badge('valid','In review')}</td><td><span class="reveal-btn">Open</span></td></tr>
          </tbody></table></div>
        <div class="sec-title"><h2>Route Health · current session</h2></div>
        <div class="card card-pad">
          ${ROUTES.slice(0,4).map(r=>`<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border)">
            <span class="mono strong" style="width:44px">${r.id}</span>
            <div style="flex:1"><div class="workload-bar"><div class="workload-fill ${r.flag}" style="width:${Math.min(100,(parseInt(r.hours)/10)*100)}%"></div></div></div>
            <span style="font-size:12px;font-weight:600;width:58px;text-align:right">${r.hours}</span>
            <span class="balance-flag" style="width:96px"><span class="bf-dot" style="background:${flagMeta[r.flag][1]}"></span>${flagMeta[r.flag][0]}</span>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-title"><h2>Recent Activity</h2><span class="link" onclick="go('activity')">View all</span></div>
        <div class="card"><div class="feed">${FEED.slice(0,5).map(f=>feedItem(f,true)).join('')}</div></div>
        <div class="sec-title"><h2>Open decisions blocking design</h2></div>
        <div class="card card-pad">
          ${[['Row model — one row per customer or per service day?','Hadi','rowModel'],
             ['What are the actual assignment rules?','Hadi + client at pilot',''],
             ['Week numbers 1–cycle, or always 1–8 with 5–8 rejected?','Hadi',''],
             ['Weeks 5–8 when a session changes 8 → 4?','Product',''],
             ['Bad coordinates — reject row or just coordinates?','Hadi',''],
             ['Customer drawer — one shared component or two?','Zaid + engineering',''],
             ['Canonical action names for the activity feed','Design → Haasham','activity']].map(([q,o,nav])=>`
            <div style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
              <span class="b b-warn" style="flex-shrink:0;margin-top:1px">Open</span>
              <div style="flex:1"><div style="font-size:12.5px;font-weight:600;line-height:1.4">${q}</div>
                <div style="font-size:11px;color:var(--text-mute);margin-top:2px">Owner: ${o}</div></div>
              ${nav?`<span class="reveal-btn" onclick="go('${nav}')">View</span>`:''}
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div></div>`;
}
function sessionsScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Sessions'])}
    ${head('Sessions','One planning exercise per client market, with a fixed 4-week or 8-week cycle.',
      `<button class="btn btn-primary btn-sm" onclick="go('createSession')">${I.plus}Create Planning Session</button>`)}
    <div class="card table-wrap"><table class="tbl-dense">
      <thead><tr><th>Session</th><th>Market</th><th>Scenario</th><th>Cycle</th><th>Routes</th><th>Customers</th><th>Revenue</th><th>Baseline</th><th>Options</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr class="row-click" onclick="go('workspace')"><td class="strong">Delivery Scenario as of 07/23/2026, 4:42 PM</td><td class="muted">Baton Rouge</td>
          <td><span class="pill scenario">DELIVERY</span></td><td>${S.session.cycle} Week</td><td>8</td><td>1,300</td><td>$830,809</td>
          <td>${badge('immutable','Locked')}</td><td>Option 1</td><td>${badge('warn','Draft')}</td><td><span class="reveal-btn">Open</span></td></tr>
        <tr class="row-click" onclick="go('workspace')"><td class="strong">Baton Rouge 4 Week Delivery</td><td class="muted">Baton Rouge</td>
          <td><span class="pill scenario">DELIVERY</span></td><td>4 Week</td><td>6</td><td>942</td><td>$612,400</td>
          <td>${badge('immutable','Locked')}</td><td class="muted">None</td><td>${badge('default','Baseline only')}</td><td><span class="reveal-btn">Open</span></td></tr>
        <tr class="row-click" onclick="go('workspace')"><td class="strong">New Orleans Presale Pilot</td><td class="muted">New Orleans</td>
          <td><span class="pill scenario">PRESALE</span></td><td>8 Week</td><td>7</td><td>1,088</td><td>$704,150</td>
          <td>${badge('immutable','Locked')}</td><td>Option 1, Option 2</td><td>${badge('valid','In review')}</td><td><span class="reveal-btn">Open</span></td></tr>
      </tbody></table></div>
    <div class="section-note" style="margin-top:16px">${I.info}<span>Clicking a session opens the <b>Route Workspace</b>. The baseline is always locked — analysts work in options created through Save As.</span></div>
  </div></div>`;
}
function ingestionScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Data Ingestion'])}
    ${head('Data Ingestion','Bring the Extension Report into the master dataset. New customers arrive here through reconcile.')}
    <div class="two-col">
      <div>
        <div class="card card-pad">
          <div class="card-h">Extension Report</div>
          <div class="card-sub">One line per customer. This is the source of the planning rows the analyst edits.</div>
          <div class="upload-zone"><div class="upload-icon">${I.upload}</div>
            <h3>Drop PRN or Excel file here</h3><p>or browse from your computer</p></div>
          <div class="file-row"><div class="file-ic">${I.sheet}</div>
            <div style="flex:1"><div class="file-name">Extension_Report_BatonRouge_07232026.xlsx</div>
              <div class="file-meta">6.1 MB · 1,300 rows · uploaded just now</div></div>${badge('valid','Parsed')}</div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn btn-primary" onclick="go('masterDataset')">Review Reconcile ${I.arrow}</button>
            <button class="btn btn-secondary" onclick="toast('File replaced')">Replace File</button></div>
        </div>
        <div class="sec-title"><h2>Recent Ingest Runs</h2></div>
        <div class="card table-wrap"><table class="tbl-dense">
          <thead><tr><th>Run</th><th>Source</th><th>Rows</th><th>New</th><th>Removed</th><th>Status</th><th>Started</th></tr></thead>
          <tbody>
            <tr><td class="mono strong">ING-3104</td><td>Extension Report</td><td>1,300</td><td class="tag-new">17</td><td class="tag-rem">43</td><td>${badge('warn','Ready')}</td><td class="muted">Today 2:31 PM</td></tr>
            <tr><td class="mono strong">ING-3098</td><td>Extension Report</td><td>1,286</td><td class="tag-new">9</td><td class="tag-rem">12</td><td>${badge('valid','Committed')}</td><td class="muted">Jul 22</td></tr>
          </tbody></table></div>
      </div>
      <div class="card card-pad">
        <div class="card-h">Two separate import paths</div>
        <ul class="list-plain">
          <li>${I.check}<b>Extension Report reconcile</b> — creates and removes customers</li>
          <li>${I.check}<b>Customer Master enhancement</b> — updates existing customers only, never creates</li>
        </ul>
        <div class="section-note" style="margin-top:12px">${I.warn}<span>Applying a reconcile permanently removes customers and has <b>no undo</b>. It uses a hard confirmation before it runs.</span></div>
        <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:12px" onclick="go('masterImport')">${I.upload}Customer Master Enhancement Import</button>
      </div>
    </div>
  </div></div>`;
}
function masterDatasetScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Master Dataset'])}
    ${head('Master Dataset','The committed routing dataset every session is created from. Sessions snapshot a baseline out of this.')}
    <div class="grid grid-4">
      <div class="stat"><div class="stat-label">Customers</div><div class="stat-value">1,300</div></div>
      <div class="stat"><div class="stat-label">Routes / Territories</div><div class="stat-value">8</div></div>
      <div class="stat"><div class="stat-label">Revenue</div><div class="stat-value" style="font-size:19px">$830,809</div></div>
      <div class="stat"><div class="stat-label">Last commit</div><div class="stat-value" style="font-size:15px">Today 2:31 PM</div></div>
    </div>
    <div class="sec-title"><h2>Pending reconcile</h2></div>
    <div class="card card-pad">
      <div class="grid grid-3" style="margin-bottom:14px">
        <div class="stat"><div class="stat-label">New customers</div><div class="stat-value" style="color:var(--green)">17</div></div>
        <div class="stat"><div class="stat-label">Updated</div><div class="stat-value" style="color:var(--blue)">142</div></div>
        <div class="stat"><div class="stat-label">Removed</div><div class="stat-value" style="color:var(--red)">43</div></div>
      </div>
      <div class="blocked-inline"><div class="bi-ic">${I.warn}</div>
        <div><div class="bi-t">Applying a reconcile cannot be undone</div>
          <div class="bi-d">43 customers will be permanently removed from the master dataset. This action has no undo and is recorded in the Activity Feed.</div></div></div>
      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn btn-secondary" onclick="toast('Reconcile preview opened')">${I.eye}Preview changes</button>
        <button class="btn btn-primary" onclick="hardConfirmReconcile()">Apply Reconcile</button></div>
    </div>
    <div class="sec-title"><h2>Sessions created from this dataset</h2></div>
    <div class="card table-wrap"><table class="tbl-dense">
      <thead><tr><th>Session</th><th>Snapshotted</th><th>Baseline</th><th>Cycle</th></tr></thead>
      <tbody><tr><td class="strong">Delivery Scenario as of 07/23/2026</td><td class="muted">Today 2:44 PM</td><td>${badge('immutable','Locked')}</td><td>${S.session.cycle} Week</td></tr>
      <tr><td class="strong">Baton Rouge 4 Week Delivery</td><td class="muted">Jul 22</td><td>${badge('immutable','Locked')}</td><td>4 Week</td></tr></tbody></table></div>
  </div></div>`;
}
function hardConfirmReconcile(){
  openModal(`
    <h2>Permanently remove 43 customers?</h2>
    <p class="msub">Applying this reconcile removes 43 customers from the master dataset. <b>This cannot be undone</b> — not from the Activity Feed, and not by reverting an option.</p>
    <div class="blocked-inline" style="margin-bottom:12px"><div class="bi-ic">${I.ban}</div>
      <div><div class="bi-t">No undo is available for this action</div>
        <div class="bi-d">Existing sessions keep their locked baselines. New sessions created after this will not contain the removed customers.</div></div></div>
    <div class="field"><label class="field-label">Type APPLY to confirm</label><input class="text-input" placeholder="APPLY" /></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="closeModal(); FEED.unshift({type:'reconcile',label:'Applied reconcile',who:'Michael Reeves',when:'Just now',scope:'43 customers removed · Master dataset',undo:false,noUndoReason:'Applying a reconcile permanently removes customers. There is no undo.',rows:43}); toast('Reconcile applied. 43 customers removed.')">Apply and remove</button>
    </div>`);
}
function referenceDataScreen(){
  const pats=[['E4W','Weekly','Mon Tue Wed Thu Fri','Every week','4 / 8'],['2W','Twice Weekly','Mon Wed Thu','Every week','4 / 8'],
    ['3W','3× Weekly','Mon Wed Fri','Every week','4 / 8'],['4T','Every 4 weeks','Tue','Every 4th week','4 / 8'],['E8W','Every 8 weeks','Mon Fri','Every 8th week','8 only']];
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Reference Data'])}
    ${head('Reference Data','Service patterns and cycle rules. Reference data is read-only inside a session — patterns control which days and weeks a customer may be served.')}
    <div class="card table-wrap"><table class="tbl-dense">
      <thead><tr><th>Pattern</th><th>Derived Frequency</th><th>Allowed Delivery Days</th><th>Week Rule</th><th>Valid Cycles</th><th></th></tr></thead>
      <tbody>${pats.map(p=>`<tr><td class="mono strong">${p[0]}</td><td>${p[1]}</td><td class="mono">${p[2]}</td><td class="muted">${p[3]}</td><td class="muted">${p[4]}</td>
        <td>${badge('readonly','Read-only')}</td></tr>`).join('')}</tbody></table>
      <div class="grid-foot"><span>Showing 5 of 34 service patterns</span>
        <div class="pager"><button>‹</button><button class="active">1</button><button>2</button><button>›</button></div></div></div>
    <div class="section-note" style="margin-top:16px">${I.info}<span><b>Frequency is derived.</b> It is calculated from the service pattern and is never an editable field — in the grid, in the drawer, or here.</span></div>
    <div class="sec-title"><h2>Cycle rules</h2></div>
    <div class="two-col-even">
      <div class="card card-pad"><div class="card-h">8-week cycle</div>
        <div class="card-sub">Weeks pair for balancing.</div>
        <div class="wk-grid">${[1,2,3,4].map(p=>`<div class="wk-pair"><div class="wp-l">Pair ${p}</div>
          <div class="wp-btns"><span class="wk-btn">Wk ${p}</span><span class="wk-btn">Wk ${p+4}</span></div></div>`).join('')}</div></div>
      <div class="card card-pad"><div class="card-h">4-week cycle</div>
        <div class="card-sub">Weeks 5–8 are never offered.</div>
        <div class="wk-flat">${[1,2,3,4].map(w=>`<span class="wk-btn">Wk ${w}</span>`).join('')}</div>
        <div class="open-q" style="margin-top:12px"><b>Open decision · Hadi</b>Are week numbers 1–cycle length, or always 1–8 with 5–8 rejected on 4-week sessions?</div></div>
    </div>
  </div></div>`;
}
function exportsScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Exports'])}
    ${head('Exports','Generate route data from a finalized option.')}
    <div class="two-col">
      <div class="card card-pad">
        <div class="card-h">Route Data Export</div>
        <div class="card-sub">Finalized Option 1 · ${S.session.name}</div>
        <div class="field-chips">${['Route ID','Customer ID','Delivery Day','Delivery Week','Service Pattern','Sequence','Service Time','Time Window','Territory','Depot','Revenue','Cost'].map(f=>`<span class="col-chip untouched">${f}</span>`).join('')}</div>
        <div class="export-filename" style="margin-top:12px">${I.sheet}Route_Data_BatonRouge_2026_07_Option1.xlsx</div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-secondary" onclick="toast('Preview opened')">${I.eye}Preview</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="toast('Export generated. EXP-9042')">Generate Export</button></div>
      </div>
      <div class="card card-pad"><div class="card-h">Export history</div>
        <div class="kv"><span class="k mono">EXP-9038</span><span class="v">Jul 22 · Option 1</span></div>
        <div class="kv"><span class="k mono">EXP-9021</span><span class="v">Jul 20 · Baseline</span></div>
      </div>
    </div>
  </div></div>`;
}
function adminScreen(){
  return `<div class="screen active"><div class="page page-narrow">
    ${crumbs(['Dashboard','Admin'])}
    ${head('Admin','Roles and permissions. One editable flag drives read-only mode across the grid, bulk bar, and drawer.')}
    <div class="card table-wrap"><table class="tbl-dense">
      <thead><tr><th>Capability</th><th>Analyst</th><th>Ingest Admin</th><th>Admin</th></tr></thead>
      <tbody>
        ${[['View session data',1,1,1],['Edit options (day/week/route)',1,1,1],['Edit the baseline',0,0,0],
           ['View Customer Master',1,1,1],['Edit Customer Master',0,1,1],['Run enhancement import',0,1,1],
           ['Apply reconcile',0,1,1],['Finalize an option',1,0,1]].map(r=>`<tr><td class="strong">${r[0]}</td>
          ${r.slice(1).map(v=>`<td>${v?`<span style="color:var(--green)">${I.check}</span>`:`<span class="muted">${I.ban}</span>`}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div>
    <div class="section-note" style="margin-top:16px">${I.lock}<span>The baseline is immutable for every role — it is a snapshot, not a permission level.</span></div>
  </div></div>`;
}

/* ============================================================
   NAV ENGINE
   ============================================================ */
const SCREENS = { dashboard, ingestion:ingestionScreen, masterDataset:masterDatasetScreen, sessions:sessionsScreen,
  createSession:createSessionScreen, workspace, rowModel:rowModelScreen, map:mapScreen,
  referenceData:referenceDataScreen, customerMaster:customerMasterScreen, masterImport:masterImportScreen,
  masterImportResult, activity:activityScreen, exports:exportsScreen, admin:adminScreen };
const NAV_MAP = { dashboard:'dashboard', ingestion:'ingestion', masterDataset:'masterDataset', sessions:'sessions',
  createSession:'sessions', workspace:'workspace', map:'workspace', rowModel:'rowModel',
  referenceData:'referenceData', customerMaster:'customerMaster', masterImport:'customerMaster',
  masterImportResult:'customerMaster', activity:'activity', exports:'exports', admin:'admin' };
let CURRENT = 'dashboard';
const main = document.getElementById('main');
function go(name){
  CURRENT = name;
  main.innerHTML = SCREENS[name]();
  main.scrollTop = 0;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===NAV_MAP[name]));
}
function rerenderCurrent(){ if(CURRENT==='workspace') rerenderWs(); else go(CURRENT); }
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>go(n.dataset.nav)));

/* Ctrl+Q — quickest-time sequencer (RN-146) */
document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='q'){ e.preventDefault(); if(editable()) runSequencer('970'); }
});

go('dashboard');
