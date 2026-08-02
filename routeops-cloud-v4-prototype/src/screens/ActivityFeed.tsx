/**
 * Part G — Activity Feed.
 * Part H — Undo states (available, success, unavailable, conflict, permanent).
 *
 * A bulk action affecting 1,300 customers is ONE entry, never 1,300. Affected
 * rows are a capped, expandable preview with a download for the full list.
 */
import { useMemo, useState } from 'react'
import {
  ACTION_LABELS,
  ACTIVITY_LOG,
  ACTIVITY_PREVIEW_CAP,
  UNDO_COPY,
  type ActivityEntry,
} from '../data/prompt2'
import { ROUTE_IDS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Button,
  Card,
  Chip,
  Modal,
  PatchBadge,
  StepList,
  Tooltip,
} from '../components/ui'
import {
  BoltIcon,
  ChevronRightIcon,
  DownloadIcon,
  ErrorCircleIcon,
  EyeIcon,
  LockIcon,
  PencilIcon,
  SearchIcon,
  UndoIcon,
} from '../components/icons'

const UNDOABLE_FILTER = ['All', 'Undoable only', 'Not undoable'] as const

export function ActivityFeed() {
  const { pushToast, patch, runPatch, nav } = useApp()

  const [q, setQ] = useState('')
  const [action, setAction] = useState('')
  const [user, setUser] = useState('')
  const [option, setOption] = useState('')
  const [route, setRoute] = useState('')
  const [range, setRange] = useState('')
  const [undoable, setUndoable] = useState<(typeof UNDOABLE_FILTER)[number]>('All')
  const [open, setOpen] = useState<string | null>('e1')

  // Undo modals
  const [undoTarget, setUndoTarget] = useState<ActivityEntry | null>(null)
  const [conflictTarget, setConflictTarget] = useState<ActivityEntry | null>(null)

  const users = useMemo(
    () => Array.from(new Set(ACTIVITY_LOG.map((e) => e.user))),
    [],
  )
  const options = useMemo(
    () => Array.from(new Set(ACTIVITY_LOG.map((e) => e.option))),
    [],
  )

  const rows = useMemo(
    () =>
      ACTIVITY_LOG.filter((e) => {
        if (q) {
          const hay = `${e.action} ${e.scope} ${e.before} ${e.after} ${e.user}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        if (action && e.action !== action) return false
        if (user && e.user !== user) return false
        if (option && e.option !== option) return false
        if (route && e.route !== route) return false
        if (range === 'Today' && !e.timestamp.startsWith('Today')) return false
        if (range === 'Yesterday' && !e.timestamp.startsWith('Yesterday')) return false
        if (range === 'Earlier' && /Today|Yesterday/.test(e.timestamp)) return false
        if (undoable === 'Undoable only' && e.undo !== 'Undoable') return false
        if (undoable === 'Not undoable' && e.undo === 'Undoable') return false
        return true
      }),
    [q, action, user, option, route, range, undoable],
  )

  const clearAll = () => {
    setQ('')
    setAction('')
    setUser('')
    setOption('')
    setRoute('')
    setRange('')
    setUndoable('All')
  }
  const anyFilter = q || action || user || option || route || range || undoable !== 'All'

  /**
   * Route the Undo click to the right state (Part H).
   * Note: "Applied reconcile" is permanently non-undoable, so its Undo button is
   * disabled. Its hard confirmation happens BEFORE it runs, in the reconcile
   * flow on Data Ingestion, not here.
   */
  const startUndo = (e: ActivityEntry) => {
    if (e.undo === 'Conflict') return setConflictTarget(e)
    setUndoTarget(e)
  }

  const commitUndo = () => {
    setUndoTarget(null)
    // Global rule 3: patch the affected regions in place, no page reload.
    runPatch()
    pushToast({ tone: 'success', title: UNDO_COPY.successToast })
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Activity Feed</h1>
            <p className="page-sub">
              Review planning changes, bulk actions, option saves, route moves, sequencing
              actions, imports, finalization, and exports.
            </p>
          </div>
          <PatchBadge on={patch.activity} label="Activity feed updating…" />
        </div>
      </div>

      {/* Filters ----------------------------------------------------------- */}
      <Card className="card-pad" style={{ marginBottom: 'var(--s4)' }}>
        <div className="row wrap" style={{ gap: 'var(--s2)' }}>
          <div className="table-search" style={{ width: 210 }}>
            <span className="search-icon">
              <SearchIcon size={13} />
            </span>
            <input
              placeholder="Search activity"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Sel value={action} onChange={setAction} label="Action Type" options={[...ACTION_LABELS]} />
          <Sel value={user} onChange={setUser} label="User" options={users} />
          <Sel value={option} onChange={setOption} label="Option" options={options} />
          <Sel value={route} onChange={setRoute} label="Route" options={ROUTE_IDS} />
          <Sel
            value={range}
            onChange={setRange}
            label="Date Range"
            options={['Today', 'Yesterday', 'Earlier']}
          />
          <span className="spacer" />
          <div className="chips">
            {UNDOABLE_FILTER.map((u) => (
              <Chip key={u} on={undoable === u} onClick={() => setUndoable(u)}>
                {u}
              </Chip>
            ))}
          </div>
          {anyFilter && (
            <button className="link-btn plain t-sm" onClick={clearAll}>
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Entries ----------------------------------------------------------- */}
      <div>
        {rows.map((e) => (
          <EntryCard
            key={e.id}
            entry={e}
            open={open === e.id}
            onToggle={() => setOpen(open === e.id ? null : e.id)}
            onUndo={() => startUndo(e)}
            onDownload={() =>
              pushToast({
                tone: 'info',
                title: 'Change list downloaded',
                sub: `${fmtNum(e.affectedCount)} rows · ${e.action}.csv`,
              })
            }
            onViewRows={() => nav('workspace', { tab: 'customers' })}
          />
        ))}
        {!rows.length && (
          <Card className="card-pad">
            <div className="center t-sec" style={{ padding: 'var(--s7) 0' }}>
              No activity matches these filters.
            </div>
          </Card>
        )}
      </div>

      <div className="t-xs t-ter" style={{ marginTop: 'var(--s4)', lineHeight: 1.6 }}>
        A bulk action affecting 1,300 customers appears as one entry, not 1,300 entries. Undo is
        available on recent writes in an editable option. Baseline events can never be undone
        because the baseline is immutable.
      </div>

      {/* Part H state 1 — undo confirmation -------------------------------- */}
      {undoTarget && (
        <Modal
          title={UNDO_COPY.confirmTitle}
          sub={`This will revert “${undoTarget.action}” for ${fmtNum(
            undoTarget.affectedCount,
          )} customers in ${undoTarget.option}.`}
          mark={
            <span className="modal-warn-mark">
              <UndoIcon size={17} />
            </span>
          }
          onClose={() => setUndoTarget(null)}
          footer={
            <>
              <Button variant="primary" onClick={commitUndo}>
                Undo action
              </Button>
              <Button onClick={() => setUndoTarget(null)}>Cancel</Button>
            </>
          }
        >
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">What will change</span>
            </div>
            <div className="zone-body">
              <div className="act-ba">
                <span className="t-xs t-ter">Current</span>
                <span className="act-after">{undoTarget.after}</span>
                <ChevronRightIcon size={12} />
                <span className="t-xs t-ter">Reverts to</span>
                <span className="act-before">{undoTarget.before}</span>
              </div>
              <div className="t-xs t-sec" style={{ marginTop: 'var(--s3)', lineHeight: 1.55 }}>
                Route metrics and the route summary will recalculate after the revert. The
                activity feed will record the undo as its own entry.
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Part H state 4 — undo conflict ------------------------------------ */}
      {conflictTarget && (
        <Modal
          title={UNDO_COPY.conflictTitle}
          sub={UNDO_COPY.conflictBody}
          mark={
            <span className="modal-danger-mark">
              <ErrorCircleIcon size={17} />
            </span>
          }
          onClose={() => setConflictTarget(null)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setConflictTarget(null)
                  nav('workspace', { drawer: 'customer', id: '1000214' })
                }}
              >
                View conflict
              </Button>
              <Button variant="ghost" onClick={() => setConflictTarget(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>This action set</th>
                  <th>Current value</th>
                  <th>Changed by</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlighted">
                  <td className="cell-id">1000214</td>
                  <td>
                    <span className="act-before">{conflictTarget.after}</span>
                  </td>
                  <td>
                    <span className="act-after">Route 972 · Wed, Wk 2 · pattern 2T</span>
                  </td>
                  <td className="td-muted">Michael Reeves · 4:31 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}

    </div>
  )
}

/* ==========================================================================
   Entry card
   ========================================================================== */

function EntryCard({
  entry,
  open,
  onToggle,
  onUndo,
  onDownload,
  onViewRows,
}: {
  entry: ActivityEntry
  open: boolean
  onToggle: () => void
  onUndo: () => void
  onDownload: () => void
  onViewRows: () => void
}) {
  const icon =
    entry.action === 'Sequenced route' ? (
      <BoltIcon size={13} />
    ) : entry.action === 'Imported Customer Master enhancements' ||
      entry.action === 'Applied reconcile' ? (
      <DownloadIcon size={13} />
    ) : entry.undo === 'No undo' ? (
      <LockIcon size={13} />
    ) : (
      <PencilIcon size={13} />
    )

  const undoBadge =
    entry.undo === 'Undoable' ? (
      <Badge tone="editable">Undoable</Badge>
    ) : entry.undo === 'Conflict' ? (
      <Tooltip text="This action conflicts with a later edit.">
        <Badge tone="warning">Undo conflict</Badge>
      </Tooltip>
    ) : (
      <Tooltip text={UNDO_COPY.unavailableTooltip}>
        <Badge tone="default">{UNDO_COPY.unavailableBadge}</Badge>
      </Tooltip>
    )

  return (
    <div className={`act-card${open ? ' open' : ''}`}>
      <button className="act-head" onClick={onToggle} aria-expanded={open}>
        <span className={`feed-mark${entry.undo === 'Undoable' ? ' accent' : ''}`}>{icon}</span>

        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span className="row tight wrap" style={{ marginBottom: 3 }}>
            <span className="t-med t-sm">{entry.action}</span>
            {undoBadge}
            <Badge tone="default">{entry.option}</Badge>
          </span>
          <span className="t-xs t-sec" style={{ display: 'block' }}>
            {entry.user} · {entry.timestamp}
          </span>
          <span className="t-xs t-ter" style={{ display: 'block', marginTop: 2 }}>
            Scope: {entry.scope}
          </span>
          {!open && (
            <span className="act-ba" style={{ marginTop: 6 }}>
              <span className="act-before">{entry.before}</span>
              <ChevronRightIcon size={11} />
              <span className="act-after">{entry.after}</span>
            </span>
          )}
        </span>

        <span
          className={`group-caret${open ? ' open' : ''}`}
          style={{ flex: '0 0 auto', marginTop: 4 }}
        >
          <ChevronRightIcon size={13} />
        </span>
      </button>

      {open && (
        <div className="act-body">
          <div className="grid-2" style={{ marginTop: 'var(--s3)', marginBottom: 'var(--s4)' }}>
            <div>
              <div className="strip-label" style={{ marginBottom: 5 }}>
                Before
              </div>
              <span className="act-before">{entry.before}</span>
            </div>
            <div>
              <div className="strip-label" style={{ marginBottom: 5 }}>
                After
              </div>
              <span className="act-after">{entry.after}</span>
            </div>
          </div>

          {entry.affected.length > 0 ? (
            <div className="table-wrap">
              <div className="table-toolbar">
                <span className="t-sm t-med">Affected rows preview</span>
                <span className="spacer" />
                <span className="t-xs t-ter">
                  Showing first {Math.min(ACTIVITY_PREVIEW_CAP, entry.affectedCount)} of{' '}
                  {fmtNum(entry.affectedCount)} affected rows.
                </span>
              </div>
              <div className="table-scroll">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Route</th>
                      <th>Before</th>
                      <th>After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.affected.map((r) => (
                      <tr key={r.customerId}>
                        <td className="cell-id">{r.customerId}</td>
                        <td>{r.route}</td>
                        <td className="td-muted">{r.before}</td>
                        <td className="t-med">{r.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-foot">
                <span>{fmtNum(entry.affectedCount)} rows affected by this single entry</span>
                <button className="link-btn plain t-sm" onClick={onDownload}>
                  Download full change list
                </button>
              </div>
            </div>
          ) : (
            <div className="callout t-xs">
              This entry has no per-customer row detail. It records a session-level or
              option-level change.
            </div>
          )}

          <div className="row tight wrap" style={{ marginTop: 'var(--s4)' }}>
            <Button size="sm" variant="secondary" icon={<EyeIcon size={13} />} onClick={onViewRows}>
              View affected rows
            </Button>
            {entry.undo === 'No undo' ? (
              <Tooltip text={UNDO_COPY.unavailableTooltip}>
                <Button size="sm" disabled icon={<UndoIcon size={13} />}>
                  Undo
                </Button>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                variant={entry.undo === 'Conflict' ? 'secondary' : 'primary'}
                icon={<UndoIcon size={13} />}
                onClick={onUndo}
              >
                Undo
              </Button>
            )}
            {entry.action === 'Applied reconcile' && (
              <span className="t-xs t-ter">
                Permanent action. Its hard confirmation is shown before it runs, in the
                reconcile flow.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   Patching demo strip used by the workspace after an undo
   ========================================================================== */

export function PatchingSteps({ patch }: { patch: { grid: boolean; metrics: boolean; summary: boolean; activity: boolean } }) {
  return (
    <StepList
      steps={[
        { label: 'Grid updating…', state: patch.grid ? 'active' : 'done' },
        { label: 'Metrics updating…', state: patch.metrics ? 'active' : 'done' },
        { label: 'Summary updating…', state: patch.summary ? 'active' : 'done' },
        { label: 'Activity feed updating…', state: patch.activity ? 'active' : 'done' },
      ]}
    />
  )
}

function Sel({
  value,
  onChange,
  label,
  options,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  options: string[]
}) {
  return (
    <select
      className={`filter-select${value ? ' active' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

