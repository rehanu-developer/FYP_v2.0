/**
 * Screen Index — the internal navigator.
 *
 * Every screen AND every notable interaction state in one clickable list, so a
 * reviewer can jump straight to a drawer or a validation state without having
 * to reproduce the interaction by hand. Drawer states are reached via hash
 * deep links handled by RouteWorkspace, e.g.
 *   #/workspace?drawer=assign&day=Fri&week=3
 */
import { Badge, Card } from '../components/ui'
import { useApp, type RouteParams, type ScreenId } from '../state/AppState'
import { ArrowRightIcon, SquaresIcon } from '../components/icons'

interface Entry {
  label: string
  detail: string
  screen: ScreenId
  params?: RouteParams
  tone?: 'state' | 'design'
}

interface Group {
  title: string
  sub: string
  entries: Entry[]
}

const GROUPS: Group[] = [
  {
    title: 'Core screens',
    sub: 'The main product surfaces, in workflow order.',
    entries: [
      {
        label: 'Dashboard',
        detail: 'Snapshot, active session card, recent uploads and activity.',
        screen: 'dashboard',
      },
      {
        label: 'Data Ingestion',
        detail: 'File intake queue and the upload → confirm → validate → import path.',
        screen: 'ingestion',
      },
      {
        label: 'Master Dataset',
        detail: 'Active source of truth and the recent datasets table.',
        screen: 'master-dataset',
      },
      {
        label: 'Sessions',
        detail: 'Landing screen: summary cards, filters, status chips, sessions table.',
        screen: 'sessions',
      },
      {
        label: 'Create Session',
        detail: 'Form with tagged defaults, process strip and live Baseline Preview.',
        screen: 'create-session',
      },
      {
        label: 'Route Workspace',
        detail: 'The core screen. Session strip, toolbar, option rail, seven tabs.',
        screen: 'workspace',
      },
      {
        label: 'Map / Lasso View',
        detail: 'Second lens on the workspace: view modes, tools, spatial selection.',
        screen: 'map',
      },
      {
        label: 'Finalize Option',
        detail: 'Finalization checklist with clean and warning states.',
        screen: 'finalize',
      },
      {
        label: 'Customer Master',
        detail: 'Global customer database, read-only for the analyst role.',
        screen: 'customer-master',
      },
      {
        label: 'Reference Data',
        detail: 'Service patterns, week pairs, routes, depots, helper rule.',
        screen: 'reference-data',
      },
      {
        label: 'Activity Feed',
        detail: 'Cross-session audit trail with undo on recent writes.',
        screen: 'activity',
      },
      { label: 'Exports', detail: 'Export guard and export history.', screen: 'exports' },
      {
        label: 'Stop List Export',
        detail: 'The final deliverable preview plus the column contract.',
        screen: 'stop-list',
      },
      {
        label: 'Admin',
        detail: 'Roles and permissions, session defaults, validation policy.',
        screen: 'admin',
      },
    ],
  },
  {
    title: 'Route Workspace tabs',
    sub: 'All seven tabs of the core screen.',
    entries: [
      { label: 'Customers grid', detail: 'Option B grouped service-day rows.', screen: 'workspace', params: { tab: 'customers' } },
      { label: 'Routes', detail: 'Driver, times, revenue, helper, balance status.', screen: 'workspace', params: { tab: 'routes' } },
      { label: 'Territories', detail: 'Territory rollup with mismatch pressure.', screen: 'workspace', params: { tab: 'territories' } },
      { label: 'Day / Week Heat', detail: 'Planning rows per delivery day and cycle week.', screen: 'workspace', params: { tab: 'heat' } },
      { label: 'Metrics', detail: 'Route load against target, plus the balancer.', screen: 'workspace', params: { tab: 'metrics' } },
      { label: 'Compare', detail: 'Baseline vs the active option, change by change.', screen: 'workspace', params: { tab: 'compare' } },
      { label: 'Activity', detail: 'Session-scoped audit trail.', screen: 'workspace', params: { tab: 'activity' } },
    ],
  },
  {
    title: 'Bulk Assign Day / Week states',
    sub: 'Validation is rule-driven: the day and week you pick decide the outcome.',
    entries: [
      {
        label: 'Success path — Tuesday, Week 3',
        detail: 'Every pattern in the selection permits Tue + Wk 3, so all 1,300 pass.',
        screen: 'workspace',
        params: { drawer: 'assign', day: 'Tue', week: '3' },
        tone: 'state',
      },
      {
        label: 'Failure path — Friday, Week 3',
        detail: 'Patterns 8T and 2T never service Friday, so 14 rows fail and nothing saves.',
        screen: 'workspace',
        params: { drawer: 'assign', day: 'Fri', week: '3' },
        tone: 'state',
      },
      {
        label: 'Reassign Route drawer',
        detail: 'Bulk route move with projected impact on the target route.',
        screen: 'workspace',
        params: { drawer: 'reassign' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Customer Detail Drawer states',
    sub: 'Zones A / B / C, single Save, and each documented edge case.',
    entries: [
      {
        label: 'Valid customer — 1000004',
        detail: 'In Master, route matches preferred, pattern E4W, 5 service-day rows.',
        screen: 'workspace',
        params: { drawer: 'customer', id: '1000004' },
        tone: 'state',
      },
      {
        label: 'Not in Customer Master — 1000108',
        detail: 'Address, preferred route and service time unavailable. Informational.',
        screen: 'workspace',
        params: { drawer: 'customer', id: '1000108' },
        tone: 'state',
      },
      {
        label: 'Route Mismatch — 1000214',
        detail: 'Planned on 972 against a preferred route of 970.',
        screen: 'workspace',
        params: { drawer: 'customer', id: '1000214' },
        tone: 'state',
      },
      {
        label: 'Blocked, missing pattern — 1000812',
        detail: 'No service pattern, so the row cannot be planned or exported.',
        screen: 'workspace',
        params: { drawer: 'customer', id: '1000812' },
        tone: 'state',
      },
      {
        label: 'Pattern conflict — 1001103',
        detail: 'Pattern 8T with a Friday service day. Switch days to see the inline error.',
        screen: 'workspace',
        params: { drawer: 'customer', id: '1001103' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Route Detail & sequencer',
    sub: 'Route metrics, helper rule, and quickest-time sequencing.',
    entries: [
      {
        label: 'Route 970 — over target',
        detail: '9h 15m against an 8h target. Presale, helper assigned.',
        screen: 'workspace',
        params: { drawer: 'route', id: '970' },
        tone: 'state',
      },
      {
        label: 'Quickest-Time Sequencer — saving available',
        detail: 'Route 970 saves 12 min. Run it from the drawer, or press Ctrl+Q.',
        screen: 'workspace',
        params: { drawer: 'route', id: '970' },
        tone: 'state',
      },
      {
        label: 'Sequencer — already optimal',
        detail: 'Route 971 is already in its quickest sequence.',
        screen: 'workspace',
        params: { drawer: 'route', id: '971' },
        tone: 'state',
      },
      {
        label: 'Helper rule — helpers are Presale only',
        detail: 'Route 972 is Delivery, so the helper field is disabled and explained.',
        screen: 'workspace',
        params: { drawer: 'route', id: '972' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Other workspace states',
    sub: 'Spatial planning, immutability, and finalization.',
    entries: [
      {
        label: 'Baseline — immutable, read-only',
        detail: 'Every write control disabled, lock banner, hatched grid.',
        screen: 'workspace',
        params: { version: 'baseline' },
        tone: 'state',
      },
      {
        label: 'Map / lasso spatial planning',
        detail: '260 route-coloured pins, lasso selection and lasso validation.',
        screen: 'workspace',
        params: { drawer: 'map' },
        tone: 'state',
      },
      {
        label: 'Finalization warnings',
        detail: 'Blockers, warnings, passing checks and the acknowledgement gate.',
        screen: 'workspace',
        params: { drawer: 'finalize' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Import safety flow',
    sub: 'Nothing is written until the mapping is confirmed and errors reviewed.',
    entries: [
      {
        label: 'Column confirmation safety screen',
        detail: 'Per-column risk, destructive-overwrite callout, double acknowledgement.',
        screen: 'master-import',
        tone: 'state',
      },
    ],
  },
  {
    title: 'Helper scenario validation (Part A)',
    sub: 'Helpers are allowed on presale routes and blocked on conventional routes.',
    entries: [
      {
        label: 'Presale route — helpers allowed',
        detail: 'Route 970 is Presale. Add Helper is enabled and confirms with a toast.',
        screen: 'workspace',
        params: { drawer: 'route', id: '970' },
        tone: 'state',
      },
      {
        label: 'Conventional route — helpers not allowed',
        detail: 'Route 971 is Conventional. Add Helper is disabled with the rule in a tooltip.',
        screen: 'workspace',
        params: { drawer: 'route', id: '971' },
        tone: 'state',
      },
      {
        label: 'Blocking modal for menu triggers',
        detail: 'Open route 971 and use “Why is this blocked?” to see the modal variant.',
        screen: 'workspace',
        params: { drawer: 'route', id: '971' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Bulk Reassign Route validation (Part C)',
    sub: 'Destination route decides the state. Nothing is written until it passes.',
    entries: [
      {
        label: 'All valid — destination 971',
        detail: 'Every selected customer can move. Confirms with an impact summary.',
        screen: 'workspace',
        params: { drawer: 'reassign', dest: '971' },
        tone: 'state',
      },
      {
        label: 'Some blocked — destination 972',
        detail: '2 rows blocked by pattern and depot eligibility. Proceed with valid only.',
        screen: 'workspace',
        params: { drawer: 'reassign', dest: '972' },
        tone: 'state',
      },
      {
        label: 'All blocked — destination 973',
        detail: 'Nothing can move, so there is no proceed button at all.',
        screen: 'workspace',
        params: { drawer: 'reassign', dest: '973' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Map / Lasso states (Parts D, E, F)',
    sub: 'Spatial selection, pre-move validation, and the read-only baseline map.',
    entries: [
      {
        label: 'Empty selection',
        detail: 'Right panel prompts you to use the Lasso tool.',
        screen: 'map',
        tone: 'state',
      },
      {
        label: 'Lasso selection + pre-move validation',
        detail: 'Click Lasso, then Validate Move. 971 valid · 972 partly blocked · 973 all blocked.',
        screen: 'map',
        tone: 'state',
      },
      {
        label: 'Read-only baseline map',
        detail: 'Lasso disabled, polygon drawing prevented, Save As New Option offered.',
        screen: 'map',
        params: { version: 'baseline' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Activity feed & undo (Parts G, H)',
    sub: 'One entry per bulk action, and all five undo states.',
    entries: [
      {
        label: 'Activity feed with filters',
        detail: 'Expand an entry for before/after and a capped affected-rows preview.',
        screen: 'activity',
        tone: 'state',
      },
      {
        label: 'Undo available → confirm → patching',
        detail: 'Undo “Assigned day and week” for 1,300 customers, then watch regions patch.',
        screen: 'activity',
        tone: 'state',
      },
      {
        label: 'Undo conflict',
        detail: 'Undo on “Edited customer” explains that a later edit blocks the revert.',
        screen: 'activity',
        tone: 'state',
      },
      {
        label: 'No undo badge',
        detail: '“Saved as new option” and “Applied reconcile” can never be undone.',
        screen: 'activity',
        tone: 'state',
      },
      {
        label: 'Permanent action — type APPLY to continue',
        detail: 'The reconcile hard confirmation, shown before it runs, not as an undo.',
        screen: 'ingestion',
        params: { action: 'reconcile' },
        tone: 'state',
      },
    ],
  },
  {
    title: 'Customer Master import (Parts I, J)',
    sub: 'Five-screen flow. Updates existing customers only.',
    entries: [
      {
        label: 'Permission state — Analyst',
        detail: 'Disabled Import Enhancements CTA with an explanation. Switch role on the page.',
        screen: 'master-import',
        tone: 'state',
      },
      {
        label: 'Import flow — form → layout → confirm → run → result',
        detail: 'Switch role to Admin or Ingest Admin to walk the whole flow.',
        screen: 'master-import',
        tone: 'state',
      },
      {
        label: 'Column confirmation safety screen',
        detail: 'States exactly which 3 fields change and which are left unchanged.',
        screen: 'master-import',
        tone: 'state',
      },
      {
        label: 'Error report preview',
        detail: 'Six error codes with recommended corrections and a privacy note.',
        screen: 'master-import',
        tone: 'state',
      },
    ],
  },
  {
    title: 'Edge cases, finalization & export (Parts K, L, M)',
    sub: 'Cycle length change, finalization warnings, and export guards.',
    entries: [
      {
        label: 'Cycle length change — 8 to 4 weeks',
        detail: '324 assignments use Weeks 5–8. No destructive action until behaviour is defined.',
        screen: 'workspace',
        params: { drawer: 'cycle' },
        tone: 'state',
      },
      {
        label: 'Finalize — with warnings (blocked)',
        detail: 'Finalize disabled with a tooltip and a Review warnings path.',
        screen: 'finalize',
        tone: 'state',
      },
      {
        label: 'Finalize — clean state',
        detail: 'All checks passed. Toggle the state switch in the page header.',
        screen: 'finalize',
        tone: 'state',
      },
      {
        label: 'Export guard & Stop List states',
        detail: 'Not finalized · missing fields · ready · complete. Toggle in the page header.',
        screen: 'stop-list',
        tone: 'state',
      },
    ],
  },
  {
    title: 'Design & decision frames',
    sub: 'Not production screens. Badged as such in the UI.',
    entries: [
      {
        label: 'Validation Message System',
        detail: 'Every validation surface, the five global rules, and the exact copy.',
        screen: 'validation-system',
        tone: 'design',
      },
      {
        label: 'Design Foundation',
        detail: 'Every primitive, live: colour, type, buttons, badges, banners, drawers.',
        screen: 'foundation',
        tone: 'design',
      },
      {
        label: 'Row Model Decision',
        detail: 'Option A vs Option B side by side. Option B is the working model.',
        screen: 'row-model',
        tone: 'design',
      },
      {
        label: 'Open Decisions',
        detail: 'Nine questions that change the build, with options and consequences.',
        screen: 'open-decisions',
        tone: 'design',
      },
      {
        label: 'Alignment Checklist',
        detail: 'Every brief requirement mapped to what exists, including gaps.',
        screen: 'checklist',
        tone: 'design',
      },
    ],
  },
]

export function ScreenIndex() {
  const { nav } = useApp()
  const total = GROUPS.reduce((n, g) => n + g.entries.length, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div className="row tight" style={{ marginBottom: 8 }}>
          <Badge tone="info" icon={<SquaresIcon size={12} />}>
            Screen navigator
          </Badge>
        </div>
        <h1 className="page-title">RouteOps Cloud V4 — All Screens &amp; States</h1>
        <p className="page-sub">
          Every screen and every notable interaction state, clickable. Drawer and validation
          states open directly, so you do not have to reproduce the interaction by hand.
        </p>
      </div>

      <div className="row wrap" style={{ gap: 'var(--s6)', marginBottom: 'var(--s6)' }}>
        <Stat label="Entry points" value={String(total)} />
        <Stat label="Screens" value="20" />
        <Stat label="Drawer / state links" value="37" />
        <Stat label="Row model" value="Option B" />
      </div>

      <div className="stack-4">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <div className="card-head">
              <div>
                <div className="section-title">{g.title}</div>
                <div className="section-sub">{g.sub}</div>
              </div>
              <Badge tone="default">{g.entries.length}</Badge>
            </div>
            <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
              {g.entries.map((e) => (
                <button
                  key={e.label}
                  className="index-row"
                  onClick={() => nav(e.screen, e.params)}
                >
                  <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span className="row tight" style={{ marginBottom: 2 }}>
                      <span className="t-sm t-med">{e.label}</span>
                      {e.tone === 'state' && <Badge tone="editable">state</Badge>}
                      {e.tone === 'design' && <Badge tone="info">design</Badge>}
                    </span>
                    <span
                      className="t-xs t-sec"
                      style={{ display: 'block', lineHeight: 1.5 }}
                    >
                      {e.detail}
                    </span>
                  </span>
                  <span className="index-go">
                    <ArrowRightIcon size={14} />
                  </span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }} className="tnum">
        {value}
      </div>
    </div>
  )
}
