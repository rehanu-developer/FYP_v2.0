/**
 * Part G — Route Workspace. The core screen of V4.
 *
 * Layout: session summary strip · toolbar · left option rail · tabbed main
 * surface · right drawers. Selecting the immutable Baseline disables every
 * write control; selecting an Option enables editing.
 */
import { useEffect, useState } from 'react'
import {
  FINALIZE_CHECKS,
  SESSION,
  fmtMoney,
  fmtNum,
  type Weekday,
} from '../data/mock'
import { BASELINE_ID, useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Modal,
  StatusBadge,
  PatchBadge,
  Tabs,
  Tooltip,
} from '../components/ui'
import {
  BoltIcon,
  CheckIcon,
  CopyIcon,
  FlagIcon,
  LassoIcon,
  LockIcon,
  MapIcon,
  PlusIcon,
  RouteIcon,
  SaveIcon,
  ScaleIcon,
  CalendarIcon,
  WarningIcon,
  ErrorCircleIcon,
} from '../components/icons'

import { CustomersTab } from './workspace/CustomersTab'
import { RoutesTab } from './workspace/RoutesTab'
import { TerritoriesTab } from './workspace/TerritoriesTab'
import { HeatTab } from './workspace/HeatTab'
import { MetricsTab } from './workspace/MetricsTab'
import { CompareTab } from './workspace/CompareTab'
import { ActivityTab } from './workspace/ActivityTab'
import { AssignDrawer } from './workspace/AssignDrawer'
import { CustomerDrawer } from './workspace/CustomerDrawer'
import { RouteDrawer } from './workspace/RouteDrawer'
import { ReassignRouteDrawer } from './workspace/ReassignRouteDrawer'
import { MapLassoModal } from './workspace/MapLassoModal'
import { CycleChangeModal } from './workspace/CycleChangeModal'

type TabId =
  | 'customers'
  | 'routes'
  | 'territories'
  | 'heat'
  | 'metrics'
  | 'compare'
  | 'activity'

const LOCK_MSG = "The baseline can’t be edited. Save as a new option to make changes."

export function RouteWorkspace() {
  const {
    options,
    activeVersion,
    activeVersionId,
    setActiveVersionId,
    isBaseline,
    addOption,
    selection,
    pushToast,
    nav,
    dirty,
    setDirty,
    rowModel,
    params,
    selectAllMatching,
    patch,
  } = useApp()

  const [tab, setTab] = useState<TabId>('customers')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [routeId, setRouteId] = useState<string | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [reassignOpen, setReassignOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [finalizeOpen, setFinalizeOpen] = useState(false)
  const [cycleOpen, setCycleOpen] = useState(false)

  const hasSelection = selection.mode !== 'none'

  /**
   * Deep links let the Screen Index open any drawer state directly, e.g.
   *   #/workspace?drawer=assign&day=Fri&week=3
   *   #/workspace?drawer=customer&id=1000214
   *   #/workspace?tab=metrics
   * Applied whenever the hash changes.
   */
  useEffect(() => {
    // Bare #/workspace returns to the documented default tab rather than
    // keeping whatever a previous deep link selected.
    setTab((params.tab as TabId) || 'customers')

    // A deep-linked bulk drawer needs a selection to act on.
    if (params.drawer === 'assign' || params.drawer === 'reassign') {
      if (selection.mode === 'none') {
        selectAllMatching('Route 970', 1300)
      }
    }

    // Reset drawers first so consecutive deep links do not stack.
    setCustomerId(null)
    setRouteId(null)
    setAssignOpen(false)
    setReassignOpen(false)
    setMapOpen(false)
    setFinalizeOpen(false)
    setCycleOpen(false)

    switch (params.drawer) {
      case 'customer':
        setCustomerId(params.id || '1000004')
        break
      case 'route':
        setRouteId(params.id || '970')
        break
      case 'assign':
        setAssignOpen(true)
        break
      case 'reassign':
        setReassignOpen(true)
        break
      case 'map':
        setMapOpen(true)
        break
      case 'finalize':
        setFinalizeOpen(true)
        break
      case 'cycle':
        setCycleOpen(true)
        break
      default:
        break
    }

    // Likewise, only an explicit ?version=baseline shows the immutable
    // baseline; any other workspace link returns to the editable option.
    setActiveVersionId(params.version === 'baseline' ? BASELINE_ID : 'option-1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // Ctrl+Q — Sequence by Quickest Time (Part M).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
        e.preventDefault()
        if (isBaseline) {
          pushToast({ tone: 'error', title: LOCK_MSG })
          return
        }
        setDirty(true)
        pushToast({
          tone: 'success',
          title: 'Route re-sequenced. 12 min saved.',
          sub: 'Route 970 stop order updated.',
          undoLabel: 'Undo',
          onUndo: () => pushToast({ tone: 'info', title: 'Route 970 sequence restored.' }),
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isBaseline, pushToast, setDirty])

  /** Wraps a write control so the baseline state explains itself on hover. */
  const Guarded = ({
    children,
    reason,
  }: {
    children: React.ReactNode
    reason?: string
  }) =>
    isBaseline || reason ? (
      <Tooltip text={isBaseline ? LOCK_MSG : reason!}>{children}</Tooltip>
    ) : (
      <>{children}</>
    )

  return (
    <div className="page wide">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Route Workspace</h1>
            <p className="page-sub">
              Manage customer rows, route assignments, delivery days, delivery weeks, and
              planning options.
            </p>
          </div>
          <div className="row tight">
            <Badge tone={rowModel === 'B' ? 'progress' : 'default'}>
              Row model: Option {rowModel}
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => nav('row-model')}>
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Session summary strip -------------------------------------------- */}
      <div className="session-strip" style={{ marginBottom: 'var(--s3)' }}>
        <div className="strip-cell grow">
          <div className="strip-label">Session</div>
          <div className="strip-value" title={SESSION.name}>
            {SESSION.name}
          </div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Scenario</div>
          <div className="strip-value">{SESSION.scenario}</div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Cycle</div>
          <div className="strip-value">
            <button
              className="link-btn plain"
              style={{ fontWeight: 500, fontSize: '12.5px' }}
              onClick={() => setCycleOpen(true)}
              title="Change the session cycle length"
            >
              {SESSION.cycle}
            </button>
          </div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Status</div>
          <div className="strip-value">
            <StatusBadge status={SESSION.status} />
          </div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Active Version</div>
          <div className="strip-value">
            <Badge tone={isBaseline ? 'immutable' : 'editable'}>{activeVersion.name}</Badge>
          </div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Customers</div>
          <div className="strip-value tnum">{fmtNum(SESSION.customers)}</div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Routes</div>
          <div className="strip-value tnum">{SESSION.routes}</div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Revenue</div>
          <div className="strip-value tnum">{fmtMoney(SESSION.revenue)}</div>
        </div>
        {(patch.summary || patch.metrics) && (
          <div className="strip-cell">
            <div className="strip-label">Status</div>
            <div className="strip-value">
              <PatchBadge on={patch.summary} label="Summary updating…" />
              {!patch.summary && <PatchBadge on={patch.metrics} label="Metrics updating…" />}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar ---------------------------------------------------------- */}
      <div className="ws-toolbar" style={{ marginBottom: 'var(--s3)' }}>
        <Guarded>
          <Button
            variant="primary"
            size="sm"
            icon={<SaveIcon size={13} />}
            disabled={isBaseline || !dirty}
            onClick={() => {
              setDirty(false)
              pushToast({
                tone: 'success',
                title: `${activeVersion.name} saved`,
                sub: 'All pending changes committed to this option.',
              })
            }}
          >
            Save Option
          </Button>
        </Guarded>

        <Button
          size="sm"
          icon={<CopyIcon size={13} />}
          onClick={() => {
            const created = addOption()
            pushToast({
              tone: 'success',
              title: `${created.name} created`,
              sub: 'The baseline stays locked. You are now editing the new option.',
            })
          }}
        >
          Save As
        </Button>

        <span className="toolbar-sep" />

        <Guarded reason={!hasSelection && !isBaseline ? 'Select customers first' : undefined}>
          <Button
            size="sm"
            icon={<CalendarIcon size={13} />}
            disabled={isBaseline || !hasSelection}
            onClick={() => setAssignOpen(true)}
          >
            Assign Day / Week
          </Button>
        </Guarded>

        <Guarded reason={!hasSelection && !isBaseline ? 'Select customers first' : undefined}>
          <Button
            size="sm"
            icon={<RouteIcon size={13} />}
            disabled={isBaseline || !hasSelection}
            onClick={() => setReassignOpen(true)}
          >
            Reassign Route
          </Button>
        </Guarded>

        <Guarded>
          <Button
            size="sm"
            icon={<BoltIcon size={13} />}
            disabled={isBaseline}
            onClick={() => {
              setDirty(true)
              pushToast({
                tone: 'success',
                title: 'Route re-sequenced. 12 min saved.',
                sub: 'Route 970 stop order updated.',
                undoLabel: 'Undo',
                onUndo: () =>
                  pushToast({ tone: 'info', title: 'Route 970 sequence restored.' }),
              })
            }}
          >
            Sequence by Quickest Time
            <span className="kbd">Ctrl+Q</span>
          </Button>
        </Guarded>

        <span className="toolbar-sep" />

        <Button size="sm" icon={<MapIcon size={13} />} onClick={() => nav('map')}>
          Open Map
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setMapOpen(true)}>
          Quick lasso
        </Button>

        <Guarded>
          <Button
            size="sm"
            icon={<ScaleIcon size={13} />}
            disabled={isBaseline}
            onClick={() => {
              setTab('metrics')
              pushToast({
                tone: 'info',
                title: 'Balancer opened on the Metrics tab',
                sub: 'Run Balancer to generate a move proposal.',
              })
            }}
          >
            Run Balancer
          </Button>
        </Guarded>

        <span className="spacer" />

        <Guarded>
          <Button
            size="sm"
            variant="dark"
            icon={<FlagIcon size={13} />}
            disabled={isBaseline}
            onClick={() => nav('finalize')}
          >
            Finalize
          </Button>
        </Guarded>
      </div>

      {/* Baseline lock banner --------------------------------------------- */}
      {isBaseline && (
        <div style={{ marginBottom: 'var(--s3)' }}>
          <Banner
            tone="locked"
            title="You are viewing the immutable baseline"
            action={
              <Button
                size="sm"
                variant="primary"
                icon={<PlusIcon size={13} />}
                onClick={() => {
                  const created = addOption()
                  pushToast({
                    tone: 'success',
                    title: `${created.name} created from Baseline`,
                  })
                }}
              >
                Save As New Option
              </Button>
            }
          >
            {LOCK_MSG}
          </Banner>
        </div>
      )}

      {/* Rail + main ------------------------------------------------------ */}
      <div className="ws-layout">
        <aside className="option-rail">
          <div className="rail-label">Versions</div>
          {options.map((o) => (
            <button
              key={o.id}
              className={`option-card${activeVersionId === o.id ? ' on' : ''}${
                activeVersionId === o.id && o.locked ? ' locked' : ''
              }`}
              onClick={() => setActiveVersionId(o.id)}
            >
              <span className="option-name">
                {o.name}
                {o.locked && <LockIcon size={12} style={{ color: 'var(--text-tertiary)' }} />}
              </span>
              <span className="option-sub">{o.sub}</span>
              <span className="option-badges">
                <Badge tone={o.locked ? 'immutable' : 'editable'}>
                  {o.locked ? 'Immutable' : 'Editable'}
                </Badge>
                {!o.locked && activeVersionId === o.id && dirty && (
                  <Badge tone="warning">Unsaved</Badge>
                )}
              </span>
            </button>
          ))}

          <Button
            size="sm"
            block
            icon={<PlusIcon size={13} />}
            style={{ marginTop: 'var(--s2)' }}
            onClick={() => {
              const created = addOption()
              pushToast({ tone: 'success', title: `${created.name} created` })
            }}
          >
            Save As New Option
          </Button>

          <div className="rail-label" style={{ marginTop: 'var(--s4)' }}>
            Shortcuts
          </div>
          <Button
            size="sm"
            block
            variant="ghost"
            icon={<LassoIcon size={13} />}
            onClick={() => nav('map')}
          >
            Map &amp; lasso
          </Button>
          <Button
            size="sm"
            block
            variant="ghost"
            icon={<CheckIcon size={13} />}
            onClick={() => setTab('activity')}
          >
            Activity
          </Button>
        </aside>

        <main style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 'var(--s3)' }}>
            <Tabs<TabId>
              value={tab}
              onChange={setTab}
              tabs={[
                { id: 'customers', label: 'Customers', count: fmtNum(SESSION.customers) },
                { id: 'routes', label: 'Routes', count: '8' },
                { id: 'territories', label: 'Territories', count: '8' },
                { id: 'heat', label: 'Day / Week Heat' },
                { id: 'metrics', label: 'Metrics' },
                { id: 'compare', label: 'Compare', count: '128' },
                { id: 'activity', label: 'Activity' },
              ]}
            />
          </div>

          {tab === 'customers' && <CustomersTab onOpenCustomer={setCustomerId} />}
          {tab === 'routes' && <RoutesTab onOpenRoute={setRouteId} />}
          {tab === 'territories' && <TerritoriesTab />}
          {tab === 'heat' && <HeatTab />}
          {tab === 'metrics' && <MetricsTab />}
          {tab === 'compare' && <CompareTab />}
          {tab === 'activity' && <ActivityTab />}
        </main>
      </div>

      {/* Drawers / modals ------------------------------------------------- */}
      {/* Keyed on id so following a deep link to a different customer/route
          remounts the drawer with fresh internal state. */}
      {customerId && (
        <CustomerDrawer
          key={`customer-${customerId}`}
          customerId={customerId}
          onClose={() => setCustomerId(null)}
        />
      )}
      {routeId && (
        <RouteDrawer key={`route-${routeId}`} route={routeId} onClose={() => setRouteId(null)} />
      )}
      {assignOpen && (
        <AssignDrawer
          // Keyed on the deep-linked day/week so following a new link
          // (e.g. success -> failure path) remounts with fresh state instead
          // of keeping the previous verdict.
          key={`assign-${params.day ?? 'Tue'}-${params.week ?? '3'}`}
          onClose={() => setAssignOpen(false)}
          initialDay={(params.day as Weekday) || undefined}
          initialWeek={params.week ? Number(params.week) : undefined}
        />
      )}
      {reassignOpen && (
        <ReassignRouteDrawer
          key={`reassign-${params.dest ?? 'none'}`}
          onClose={() => setReassignOpen(false)}
          initialDestination={params.dest}
        />
      )}
      {mapOpen && <MapLassoModal onClose={() => setMapOpen(false)} />}
      {finalizeOpen && <FinalizeModal onClose={() => setFinalizeOpen(false)} />}
      {cycleOpen && <CycleChangeModal onClose={() => setCycleOpen(false)} />}
    </div>
  )
}

/* ==========================================================================
   Finalization warnings
   ========================================================================== */

function FinalizeModal({ onClose }: { onClose: () => void }) {
  const { activeVersion, pushToast, nav } = useApp()
  const [acknowledged, setAcknowledged] = useState(false)

  const blockers = FINALIZE_CHECKS.filter((c) => c.severity === 'blocker')
  const warnings = FINALIZE_CHECKS.filter((c) => c.severity === 'warning')
  const passes = FINALIZE_CHECKS.filter((c) => c.severity === 'pass')
  const blockerTotal = blockers.reduce((n, c) => n + c.count, 0)

  return (
    <Modal
      title={`Finalize ${activeVersion.name}?`}
      sub="Finalizing locks this option and makes it the plan of record. It can no longer be edited."
      mark={
        <span className={blockerTotal ? 'modal-danger-mark' : 'modal-warn-mark'}>
          {blockerTotal ? <ErrorCircleIcon size={17} /> : <WarningIcon size={17} />}
        </span>
      }
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button
            variant="primary"
            disabled={blockerTotal > 0 || !acknowledged}
            onClick={() => {
              pushToast({
                tone: 'success',
                title: `${activeVersion.name} finalized`,
                sub: 'The option is locked. You can now export the stop list.',
              })
              onClose()
              nav('exports')
            }}
          >
            Finalize Option
          </Button>
          <Button onClick={onClose}>Cancel</Button>
          {blockerTotal > 0 && (
            <span className="t-xs" style={{ marginLeft: 'auto', color: 'var(--error)' }}>
              {blockerTotal} blocking issues must be resolved first.
            </span>
          )}
        </>
      }
    >
      {blockerTotal > 0 && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="error" title="This option can't be finalized yet.">
            {blockerTotal} customer rows fail validation. Finalization is blocked until they are
            fixed or removed.
          </Banner>
        </div>
      )}

      <div className="stack-3">
        <CheckGroup title="Blocking issues" checks={blockers} />
        <CheckGroup title="Warnings — finalization is still allowed" checks={warnings} />
        <CheckGroup title="Passing checks" checks={passes} />
      </div>

      <div
        style={{
          marginTop: 'var(--s5)',
          paddingTop: 'var(--s4)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            className="checkbox"
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span className="t-sm t-sec" style={{ lineHeight: 1.55 }}>
            I understand that {warnings.reduce((n, c) => n + c.count, 0)} rows carry warnings and
            that finalizing locks {activeVersion.name} from further editing.
          </span>
        </label>
      </div>
    </Modal>
  )
}

function CheckGroup({
  title,
  checks,
}: {
  title: string
  checks: typeof FINALIZE_CHECKS
}) {
  if (!checks.length) return null
  return (
    <div>
      <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
        {title}
      </div>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 var(--s4)' }}>
        {checks.map((c) => (
          <div className="check-row" key={c.label}>
            <span
              className={`check-mark ${
                c.severity === 'pass' ? 'done' : c.severity === 'warning' ? 'partial' : 'todo'
              }`}
              style={
                c.severity === 'blocker'
                  ? {
                      background: 'var(--error-bg)',
                      color: 'var(--error)',
                      borderColor: 'var(--error-border)',
                    }
                  : undefined
              }
            >
              {c.severity === 'pass' ? (
                <CheckIcon size={11} />
              ) : c.severity === 'warning' ? (
                <WarningIcon size={11} />
              ) : (
                <ErrorCircleIcon size={11} />
              )}
            </span>
            <span style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span className="t-sm t-med">{c.label}</span>
              <span className="t-xs t-sec" style={{ display: 'block', marginTop: 2, lineHeight: 1.5 }}>
                {c.detail}
              </span>
            </span>
            <Badge
              tone={
                c.severity === 'pass' ? 'valid' : c.severity === 'warning' ? 'warning' : 'blocked'
              }
            >
              {fmtNum(c.count)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
