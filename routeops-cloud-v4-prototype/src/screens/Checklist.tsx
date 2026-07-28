/**
 * Implementation Alignment Checklist.
 * Maps every part of the V4 brief to what exists in this prototype, with an
 * honest status. "Prototype only" means the interaction is faked client-side
 * and still needs real engineering.
 */
import { Badge, Card } from '../components/ui'
import { useApp, type ScreenId } from '../state/AppState'
import { CheckIcon, ClipboardCheckIcon, MinusCircleIcon, WarningIcon } from '../components/icons'

type Status = 'built' | 'partial' | 'gap'

interface Item {
  part: string
  requirement: string
  status: Status
  where: string
  screen?: ScreenId
  note?: string
}

const ITEMS: Item[] = [
  // Part A
  { part: 'A', requirement: 'Buttons, inputs, dropdowns, segmented controls', status: 'built', where: 'Design Foundation', screen: 'foundation' },
  { part: 'A', requirement: 'Table header, status badges (all 12)', status: 'built', where: 'Design Foundation', screen: 'foundation' },
  { part: 'A', requirement: 'Warning / error banners, success toast, tooltip', status: 'built', where: 'Design Foundation', screen: 'foundation' },
  { part: 'A', requirement: 'Right drawer shell, confirmation modal', status: 'built', where: 'Design Foundation', screen: 'foundation' },
  { part: 'A', requirement: 'Empty state, progress state', status: 'built', where: 'Design Foundation', screen: 'foundation' },
  // Part B
  { part: 'B', requirement: 'Dashboard with four stat cards', status: 'built', where: 'Dashboard', screen: 'dashboard' },
  { part: 'B', requirement: 'Active Session card, uploads table, activity list', status: 'built', where: 'Dashboard', screen: 'dashboard' },
  // Part C
  { part: 'C', requirement: 'Master Dataset overview + four cards', status: 'built', where: 'Master Dataset', screen: 'master-dataset' },
  { part: 'C', requirement: 'Recent Datasets table + empty state', status: 'built', where: 'Master Dataset', screen: 'master-dataset', note: 'Toggle empty state from the page header.' },
  { part: 'C', requirement: 'Upload Dataset modal with progress', status: 'built', where: 'Master Dataset', screen: 'master-dataset' },
  // Part D
  { part: 'D', requirement: 'Sessions overview as the Sessions landing screen', status: 'built', where: 'Sessions', screen: 'sessions' },
  { part: 'D', requirement: 'Summary cards, filters, status chips, table', status: 'built', where: 'Sessions', screen: 'sessions' },
  { part: 'D', requirement: 'Sessions empty state', status: 'built', where: 'Sessions', screen: 'sessions' },
  // Part E
  { part: 'E', requirement: 'Create Session form with defaults + Default tags', status: 'built', where: 'Create Session', screen: 'create-session' },
  { part: 'E', requirement: 'Process strip and explanation card', status: 'built', where: 'Create Session', screen: 'create-session' },
  { part: 'E', requirement: 'Baseline Preview empty + filled states', status: 'built', where: 'Create Session', screen: 'create-session' },
  { part: 'E', requirement: 'Create CTA disabled until required fields complete', status: 'built', where: 'Create Session', screen: 'create-session' },
  // Part F
  { part: 'F', requirement: 'Row Model Decision, Option A vs B side by side', status: 'built', where: 'Row Model Decision', screen: 'row-model' },
  { part: 'F', requirement: 'Recommendation note for Option B', status: 'built', where: 'Row Model Decision', screen: 'row-model' },
  // Part G
  { part: 'G', requirement: 'Session summary strip', status: 'built', where: 'Route Workspace', screen: 'workspace' },
  { part: 'G', requirement: 'Top toolbar with all 8 actions', status: 'built', where: 'Route Workspace', screen: 'workspace' },
  { part: 'G', requirement: 'Left option rail, Baseline vs Option 1', status: 'built', where: 'Route Workspace', screen: 'workspace' },
  { part: 'G', requirement: 'Baseline read-only state with banner + disabled controls', status: 'built', where: 'Route Workspace', screen: 'workspace' },
  { part: 'G', requirement: 'Seven tabs, Customers default', status: 'built', where: 'Route Workspace', screen: 'workspace' },
  { part: 'G', requirement: 'Grouped table headers (Planning / Imported / Customer Master)', status: 'built', where: 'Customers tab', screen: 'workspace' },
  { part: 'G', requirement: 'All core columns + optional columns via Columns menu', status: 'built', where: 'Customers tab', screen: 'workspace' },
  { part: 'G', requirement: 'Filters, column visibility, density', status: 'built', where: 'Customers tab', screen: 'workspace' },
  // Part H
  { part: 'H', requirement: 'Selection state 1 — none', status: 'built', where: 'Customers tab', screen: 'workspace' },
  { part: 'H', requirement: 'Selection state 2 — manual with helper + CTA', status: 'built', where: 'Customers tab', screen: 'workspace' },
  { part: 'H', requirement: 'Selection state 3 — select all matching (visually distinct)', status: 'built', where: 'Customers tab', screen: 'workspace' },
  { part: 'H', requirement: 'Selection state 4 — over the 500-row manual limit', status: 'partial', where: 'Customers tab', screen: 'workspace', note: 'Reachable only by selecting >500 rows; the sample grid holds 26 customers.' },
  { part: 'H', requirement: 'Bulk action bar with exact scope', status: 'built', where: 'Customers tab', screen: 'workspace' },
  // Part I
  { part: 'I', requirement: 'Assign Day / Week drawer with scope + cycle', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  { part: 'I', requirement: 'Day picker, week picker, visual week pairs', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  { part: 'I', requirement: '4-week variant hides Wk 5–8', status: 'built', where: 'Assign drawer', screen: 'workspace', note: 'Switch via the prototype cycle control in the drawer.' },
  { part: 'I', requirement: 'Validation success state + Apply CTA', status: 'built', where: 'Assign drawer', screen: 'workspace', note: 'Rule-driven: Tuesday + Week 3 passes for all 1,300.' },
  { part: 'I', requirement: 'Long-running progress with 5 named steps + counter', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  { part: 'I', requirement: 'Success toast', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  // Part J
  { part: 'J', requirement: 'Failure state — "No changes were applied."', status: 'built', where: 'Assign drawer', screen: 'workspace', note: 'Rule-driven: Friday + Week 3 fails 14 rows (patterns 8T and 2T never run Friday).' },
  { part: 'J', requirement: 'Violation table with reasons + Highlight action', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  { part: 'J', requirement: 'Exclude failing rows and retry / Cancel', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  { part: 'J', requirement: 'No partial update without explicit exclusion', status: 'built', where: 'Assign drawer', screen: 'workspace' },
  // Part K
  { part: 'K', requirement: 'Customer drawer zones A / B / C', status: 'built', where: 'Customer drawer', screen: 'workspace' },
  { part: 'K', requirement: 'Derived Frequency read-only with helper text', status: 'built', where: 'Customer drawer', screen: 'workspace' },
  { part: 'K', requirement: 'Customer Master panel + permission gate', status: 'built', where: 'Customer drawer', screen: 'workspace' },
  { part: 'K', requirement: 'Single Save, no field-level autosave', status: 'built', where: 'Customer drawer', screen: 'workspace' },
  { part: 'K', requirement: 'Validation failure — nothing saved, inline error', status: 'built', where: 'Customer drawer', screen: 'workspace', note: 'Open 1001103 (pattern 8T with a Friday day), then Save.' },
  { part: 'K', requirement: 'Unsaved changes guard', status: 'built', where: 'Customer drawer', screen: 'workspace' },
  { part: 'K', requirement: 'Not in Master state', status: 'built', where: 'Customer drawer', screen: 'workspace', note: 'Open customer 1000108.' },
  { part: 'K', requirement: 'Route mismatch state', status: 'built', where: 'Customer drawer', screen: 'workspace', note: 'Open customer 1000214.' },
  // Part L
  { part: 'L', requirement: 'Routes tab with all 11 columns', status: 'built', where: 'Routes tab', screen: 'workspace' },
  { part: 'L', requirement: 'Route detail drawer with metrics + actions', status: 'built', where: 'Route drawer', screen: 'workspace' },
  { part: 'L', requirement: 'Helper rule states', status: 'built', where: 'Route drawer', screen: 'workspace', note: 'Helpers are Presale-only; changing scenario clears them.' },
  // Part M
  { part: 'M', requirement: 'Sequence by Quickest Time + Ctrl+Q shortcut', status: 'built', where: 'Toolbar / Route drawer / Routes row', screen: 'workspace' },
  { part: 'M', requirement: 'Before / calculating / done states', status: 'built', where: 'Route drawer', screen: 'workspace' },
  { part: 'M', requirement: 'Toast with Undo', status: 'built', where: 'Route drawer', screen: 'workspace' },
  { part: 'M', requirement: '"Already in its quickest sequence" state', status: 'built', where: 'Routes tab', screen: 'workspace', note: 'Try route 971 or 974.' },
  // Additional scope from Decision 5
  { part: '+', requirement: 'Map / lasso spatial planning + lasso validation', status: 'built', where: 'Open Map', screen: 'workspace' },
  { part: '+', requirement: 'Pattern / frequency validation engine', status: 'built', where: 'Reference Data + drawers', screen: 'reference-data' },
  { part: '+', requirement: 'Route balancer with proposal review', status: 'built', where: 'Metrics tab', screen: 'workspace' },
  { part: '+', requirement: 'Day / Week heat matrix', status: 'built', where: 'Day / Week Heat tab', screen: 'workspace' },
  { part: '+', requirement: 'Compare baseline vs option (review changes)', status: 'built', where: 'Compare tab', screen: 'workspace' },
  { part: '+', requirement: 'Activity feed + undo states', status: 'built', where: 'Activity Feed', screen: 'activity' },
  { part: '+', requirement: 'Customer Master enhancement import', status: 'built', where: 'Enhancement Import', screen: 'master-import' },
  { part: '+', requirement: 'Column confirmation safety screen', status: 'built', where: 'Enhancement Import', screen: 'master-import' },
  { part: '+', requirement: 'Import error report', status: 'built', where: 'Enhancement Import', screen: 'master-import' },
  { part: '+', requirement: 'Finalization warnings', status: 'built', where: 'Finalize modal', screen: 'workspace' },
  { part: '+', requirement: 'Export guard', status: 'built', where: 'Exports', screen: 'exports' },
  { part: '+', requirement: 'Stop List export + column contract', status: 'built', where: 'Stop List', screen: 'stop-list' },
  { part: '+', requirement: 'Open decisions page', status: 'built', where: 'Open Decisions', screen: 'open-decisions' },
  { part: '+', requirement: 'Implementation alignment checklist', status: 'built', where: 'This page', screen: 'checklist' },
  { part: '+', requirement: 'Internal screen navigator with deep links to every state', status: 'built', where: 'All Screens & States', screen: 'screens' },
  // Honest gaps
  { part: '!', requirement: 'Real persistence — state resets on reload', status: 'gap', where: '—', note: 'Front-end only by design. No backend in scope.' },
  { part: '!', requirement: 'Real optimisation / sequencing engine', status: 'gap', where: '—', note: 'Savings figures are fixed sample values, not computed.' },
  { part: '!', requirement: 'True 1,300-row grid virtualisation', status: 'gap', where: '—', note: '26 representative customers render; counts are shown at session scale.' },
  { part: '!', requirement: 'Real geocoding / basemap tiles', status: 'gap', where: '—', note: 'The map is a schematic canvas, not a mapping library.' },
  { part: '!', requirement: 'Authentication and real role enforcement', status: 'gap', where: '—', note: 'The analyst role is hard-coded; permission gates are visual.' },
]

export function Checklist() {
  const { nav } = useApp()
  const built = ITEMS.filter((i) => i.status === 'built').length
  const partial = ITEMS.filter((i) => i.status === 'partial').length
  const gaps = ITEMS.filter((i) => i.status === 'gap').length

  const groups = Array.from(new Set(ITEMS.map((i) => i.part)))

  const label = (p: string) =>
    p === '+' ? 'Additional V4 scope' : p === '!' ? 'Known gaps — needs engineering' : `Part ${p}`

  return (
    <div className="page">
      <div className="page-head">
        <div className="row tight" style={{ marginBottom: 8 }}>
          <Badge tone="info" icon={<ClipboardCheckIcon size={12} />}>
            Design decision · not a production screen
          </Badge>
        </div>
        <h1 className="page-title">Implementation Alignment Checklist</h1>
        <p className="page-sub">
          Every requirement in the V4 brief mapped to what exists in this prototype. The last
          group lists what is deliberately faked and still needs real engineering.
        </p>
      </div>

      <div className="row wrap" style={{ gap: 'var(--s6)', marginBottom: 'var(--s6)' }}>
        <Stat label="Requirements tracked" value={String(ITEMS.length)} />
        <Stat label="Built in prototype" value={String(built)} tone="valid" />
        <Stat label="Partial" value={String(partial)} tone="warning" />
        <Stat label="Known gaps" value={String(gaps)} tone="blocked" />
      </div>

      <div className="stack-4">
        {groups.map((g) => {
          const items = ITEMS.filter((i) => i.part === g)
          return (
            <Card key={g}>
              <div className="card-head">
                <div className="section-title">{label(g)}</div>
                <Badge tone={g === '!' ? 'blocked' : 'default'}>{items.length}</Badge>
              </div>
              <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
                {items.map((i) => (
                  <div className="check-row" key={i.requirement}>
                    <span
                      className={`check-mark ${
                        i.status === 'built' ? 'done' : i.status === 'partial' ? 'partial' : 'todo'
                      }`}
                    >
                      {i.status === 'built' ? (
                        <CheckIcon size={11} />
                      ) : i.status === 'partial' ? (
                        <WarningIcon size={11} />
                      ) : (
                        <MinusCircleIcon size={11} />
                      )}
                    </span>
                    <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                      <span className="t-sm t-med">{i.requirement}</span>
                      {i.note && (
                        <span
                          className="t-xs t-sec"
                          style={{ display: 'block', marginTop: 2, lineHeight: 1.5 }}
                        >
                          {i.note}
                        </span>
                      )}
                    </span>
                    <span className="row tight" style={{ flex: '0 0 auto' }}>
                      {i.screen ? (
                        <button className="link-btn plain t-xs" onClick={() => nav(i.screen!)}>
                          {i.where}
                        </button>
                      ) : (
                        <span className="t-xs t-ter">{i.where}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'valid' | 'warning' | 'blocked'
}) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div className="row tight" style={{ marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600 }} className="tnum">
          {value}
        </span>
        {tone && <Badge tone={tone}>{tone === 'valid' ? 'done' : tone}</Badge>}
      </div>
    </div>
  )
}
