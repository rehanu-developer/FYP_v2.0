/**
 * Part L — Route detail drawer.
 * Part M — quickest-time sequencer, including its before / calculating /
 * done / nothing-to-improve states and the helper-rule states.
 */
import { useState } from 'react'
import {
  CUSTOMERS,
  ROUTES,
  TARGET_MINUTES,
  fmtMinutes,
  fmtMoney,
  fmtNum,
} from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  DL,
  DLRow,
  Drawer,
  ProgressBar,
  Segmented,
  Select,
  StatusBadge,
  Tooltip,
} from '../../components/ui'
import {
  BoltIcon,
  CheckCircleIcon,
  LockIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  UserGroupIcon,
} from '../../components/icons'
import {
  HELPER_COPY,
  HELPER_POOL,
  ROUTE_SCENARIOS,
  type RouteScenario,
} from '../../data/prompt2'
import { COPY, ROUTE_HOURS_TARGET, isOverHours } from '../../data/rules'

type SeqPhase = 'idle' | 'calculating' | 'done' | 'nothing'

export function RouteDrawer({
  route,
  onClose,
}: {
  route: string
  onClose: () => void
}) {
  const { isBaseline, activeVersion, pushToast, setDirty, runPatch } = useApp()
  const r = ROUTES.find((x) => x.route === route)!

  const [scenario, setScenario] = useState<RouteScenario>(r.scenario as RouteScenario)
  const [helpers, setHelpers] = useState<string[]>(
    r.helperSelected ? [HELPER_POOL[0].name] : [],
  )
  const helperChanged = helpers.length > 0 !== r.helperSelected
  const [phase, setPhase] = useState<SeqPhase>('idle')
  const [saving, setSaving] = useState(0)

  const onRoute = CUSTOMERS.filter((c) => c.route === route)
    const utilisation = Math.round((r.totalMinutes / TARGET_MINUTES) * 100)

  /**
   * CONFIRMED DIRECTION: helpers are selectable on ANY route, across baseline,
   * presell and delivery scenarios. The old scenario-based block is retired.
   */
  const overHours = isOverHours(r.totalMinutes)

  const runSequencer = () => {
    if (r.potentialSavingMin === 0) {
      setPhase('nothing')
      return
    }
    setPhase('calculating')
    window.setTimeout(() => {
      setSaving(r.potentialSavingMin)
      setPhase('done')
      setDirty(true)
      pushToast({
        tone: 'success',
        title: `Route re-sequenced. ${r.potentialSavingMin} min saved.`,
        sub: `Route ${route} stop order updated.`,
        undoLabel: 'Undo',
        onUndo: () => {
          setPhase('idle')
          pushToast({ tone: 'info', title: `Route ${route} sequence restored.` })
        },
      })
    }, 1300)
  }

  return (
    <Drawer
      title={`Route ${r.route}`}
      sub={`${r.driver} · ${activeVersion.name}`}
      badge={
        <div className="row tight wrap">
          <StatusBadge status={r.status} />
          <Badge tone={isBaseline ? 'immutable' : 'editable'}>
            {isBaseline ? 'Immutable' : 'Editable'}
          </Badge>
          <Badge tone="default">{scenario}</Badge>
          {helpers.length > 0 && <Badge tone="info">Helper assigned</Badge>}
        </div>
      }
      onClose={onClose}
      footer={
        isBaseline ? (
          <>
            <Tooltip text="The baseline can’t be edited. Save as a new option to make changes.">
              <Button variant="primary" disabled icon={<SaveIcon size={14} />}>
                Save
              </Button>
            </Tooltip>
            <Button onClick={onClose}>Close</Button>
            <span className="row tight t-xs t-ter" style={{ marginLeft: 'auto' }}>
              <LockIcon size={12} />
              Read-only
            </span>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              icon={<SaveIcon size={14} />}
              onClick={() => {
                setDirty(true)
                runPatch()
                pushToast({
                  tone: 'success',
                  title: `Route ${route} updated`,
                  sub: `${scenario} · ${helpers.length} helper${helpers.length === 1 ? '' : 's'}`,
                })
                onClose()
              }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </>
        )
      }
    >
      {isBaseline && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="locked">
            The baseline can’t be edited. Save as a new option to make changes.
          </Banner>
        </div>
      )}

      {overHours && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="warning" title={COPY.routeHours}>
            Total time is {r.totalHours} against a {ROUTE_HOURS_TARGET}h target. You can
            continue planning, but review before finalizing.
          </Banner>
        </div>
      )}
      {r.balanceWarning && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="warning" title={COPY.routeBalance}>
            A recent move increased the spread between this route and its neighbours.
          </Banner>
        </div>
      )}

      <div className="stack-4">
        {/* Metrics ------------------------------------------------------- */}
        <div className="zone">
          <div className="zone-head">
            <span className="zone-title">Route metrics</span>
            <span className="t-xs t-ter tnum">{utilisation}% of target</span>
          </div>
          <div className="zone-body">
            <ProgressBar pct={Math.min(100, utilisation)} />
            <div style={{ marginTop: 'var(--s4)' }}>
              <DL>
                <DLRow k="Customer count" v={fmtNum(r.customers)} />
                <DLRow
                  k="Planning rows (Option B)"
                  v={fmtNum(r.customers * 5)}
                />
                <DLRow k="Service time" v={`${r.serviceTimeMin} min`} />
                <DLRow k="Travel time" v={`${r.travelTimeMin} min`} />
                <DLRow k="Total hours" v={r.totalHours} />
                <DLRow k="Target" v={fmtMinutes(TARGET_MINUTES)} />
                <DLRow k="Revenue" v={fmtMoney(r.revenue)} />
                <DLRow
                  k="Revenue per hour"
                  v={fmtMoney(Math.round(r.revenue / (r.totalMinutes / 60)))}
                />
              </DL>
            </div>
          </div>
        </div>

        {/* Scenario + helper assignment (updated direction) ------------- */}
        <div className="zone">
          <div className="zone-head">
            <span className="zone-title">{HELPER_COPY.sectionTitle}</span>
            <Badge tone={helpers.length ? 'valid' : 'default'}>
              {helpers.length ? HELPER_COPY.selected : HELPER_COPY.notSelected}
            </Badge>
          </div>
          <div className="zone-body stack-4">
            <div className="field">
              <label className="field-label">Scenario</label>
              <Select
                value={scenario}
                onChange={(v) => setScenario(v as RouteScenario)}
                options={[...ROUTE_SCENARIOS]}
                disabled={isBaseline}
              />
              <span className="field-help">{HELPER_COPY.scenarioNote}</span>
            </div>

            {/* Helper required Yes / No — available on every scenario. */}
            <div className="field">
              <label className="field-label">Helper required</label>
              <Segmented
                value={helpers.length ? 'Yes' : 'No'}
                onChange={(v) => {
                  if (isBaseline) return
                  if (v === 'Yes') {
                    const next = HELPER_POOL[0]
                    setHelpers([next.name])
                    setDirty(true)
                    pushToast({
                      tone: 'success',
                      title: 'Helper selected for this route.',
                      sub: `${next.name} · ${next.shift}`,
                      undoLabel: 'Undo',
                      onUndo: () => setHelpers([]),
                    })
                  } else {
                    setHelpers([])
                    setDirty(true)
                    pushToast({
                      tone: 'info',
                      title: 'Helper deselected for this route.',
                      undoLabel: 'Undo',
                      onUndo: () => setHelpers([HELPER_POOL[0].name]),
                    })
                  }
                }}
                options={['Yes', 'No'] as const}
                disabled={isBaseline}
              />
              <span className="field-help">{HELPER_COPY.instruction}</span>
            </div>

            {helpers.length > 0 && (
              <div className="stack-2">
                {helpers.map((name) => {
                  const rec = HELPER_POOL.find((h) => h.name === name)
                  return (
                    <div className="file-pill" key={name}>
                      <UserGroupIcon size={15} style={{ color: 'var(--accent)' }} />
                      <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <span className="t-med t-sm" style={{ display: 'block' }}>
                          {name}
                        </span>
                        <span className="t-xs t-ter">{rec?.shift}</span>
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<TrashIcon size={13} />}
                        disabled={isBaseline}
                        onClick={() => {
                          setHelpers((prev) => prev.filter((h) => h !== name))
                          setDirty(true)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )
                })}
                {helpers.length < HELPER_POOL.length && (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<PlusIcon size={13} />}
                    disabled={isBaseline}
                    onClick={() => {
                      const next = HELPER_POOL.find((h) => !helpers.includes(h.name))
                      if (!next) return
                      setHelpers((prev) => [...prev, next.name])
                      setDirty(true)
                    }}
                  >
                    Add another helper
                  </Button>
                )}
              </div>
            )}

            <div className="row tight">
              <span className="strip-label">Helper status</span>
              <Badge tone={helperChanged ? 'progress' : 'default'}>
                {helperChanged
                  ? HELPER_COPY.changedFromBaseline
                  : helpers.length
                    ? HELPER_COPY.fromBaseline
                    : HELPER_COPY.notSelected}
              </Badge>
            </div>
          </div>
        </div>

        {/* Sequencer ---------------------------------------------------- */}
        <div className="zone">
          <div className="zone-head">
            <span className="zone-title">Quickest-time sequencing</span>
            <span className="kbd">Ctrl+Q</span>
          </div>
          <div className="zone-body">
            {phase === 'idle' && (
              <>
                <p className="t-sm t-sec" style={{ lineHeight: 1.6, marginBottom: 'var(--s4)' }}>
                  Re-orders the stops on this route to minimise total drive time. Service times
                  and time windows are respected.
                </p>
                <Tooltip
                  text={
                    isBaseline
                      ? "The baseline can’t be edited. Save as a new option to make changes."
                      : 'Runs the quickest-time sequencer for this route'
                  }
                >
                  <Button
                    variant="dark"
                    icon={<BoltIcon size={14} />}
                    disabled={isBaseline}
                    onClick={runSequencer}
                  >
                    Sequence by Quickest Time
                  </Button>
                </Tooltip>
              </>
            )}

            {phase === 'calculating' && (
              <>
                <div className="row tight" style={{ marginBottom: 'var(--s3)' }}>
                  <span className="spinner" />
                  <span className="t-sm t-med">Optimizing stop order…</span>
                </div>
                <ProgressBar indeterminate />
                <div className="t-xs t-ter" style={{ marginTop: 8 }}>
                  Evaluating {fmtNum(r.customers)} stops across {onRoute.length || 4} clusters
                </div>
              </>
            )}

            {phase === 'done' && (
              <>
                <Banner tone="success" title={`Route re-sequenced. ${saving} min saved.`}>
                  New total time {fmtMinutes(r.totalMinutes - saving)} · was {r.totalHours}.
                </Banner>
                <div className="row tight" style={{ marginTop: 'var(--s3)' }}>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPhase('idle')
                      pushToast({ tone: 'info', title: `Route ${route} sequence restored.` })
                    }}
                  >
                    Undo re-sequence
                  </Button>
                </div>
              </>
            )}

            {phase === 'nothing' && (
              <div className="callout row tight">
                <CheckCircleIcon size={15} style={{ color: 'var(--success)', flex: '0 0 auto' }} />
                This route is already in its quickest sequence.
              </div>
            )}
          </div>
        </div>

        {/* Sample stops ------------------------------------------------- */}
        <div className="zone">
          <div className="zone-head">
            <span className="zone-title">Customers on this route</span>
            <span className="t-xs t-ter">{onRoute.length} shown</span>
          </div>
          <div className="zone-body" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Seq</th>
                  <th>Customer</th>
                  <th>Days</th>
                  <th className="th-num">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {onRoute.slice(0, 6).map((c, i) => (
                  <tr key={c.customerId}>
                    <td className="td-muted tnum">{i + 1}</td>
                    <td>
                      <span className="cell-id">{c.customerId}</span>
                      <div className="group-meta">{c.name}</div>
                    </td>
                    <td className="td-muted">{c.serviceDays.join(' ')}</td>
                    <td className="td-num">{fmtMoney(c.totalRevenue, 2)}</td>
                  </tr>
                ))}
                {!onRoute.length && (
                  <tr>
                    <td colSpan={4} className="center t-sec" style={{ padding: 'var(--s5)' }}>
                      No representative customers loaded for this route in the prototype.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
