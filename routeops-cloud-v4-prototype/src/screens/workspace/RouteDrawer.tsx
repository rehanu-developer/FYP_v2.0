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
  Modal,
  ProgressBar,
  Select,
  StatusBadge,
  Tooltip,
} from '../../components/ui'
import {
  BoltIcon,
  CheckCircleIcon,
  LockIcon,
  MinusCircleIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  UserGroupIcon,
} from '../../components/icons'
import {
  HELPER_BLOCKED_COPY,
  HELPER_POOL,
  helpersAllowed,
  type RouteScenario,
} from '../../data/prompt2'

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
    r.helper === 'Assigned' ? [HELPER_POOL[0].name] : [],
  )
  const [blockModal, setBlockModal] = useState(false)
  const [phase, setPhase] = useState<SeqPhase>('idle')
  const [saving, setSaving] = useState(0)

  const onRoute = CUSTOMERS.filter((c) => c.route === route)
  const overTarget = r.totalMinutes > TARGET_MINUTES
  const utilisation = Math.round((r.totalMinutes / TARGET_MINUTES) * 100)

  /**
   * Part A business rule: helpers are allowed on presale routes and are not
   * allowed on conventional routes. Disable inline, explain why; the blocking
   * modal is only for menu/shortcut triggers where no inline control is visible.
   */
  const allowHelpers = helpersAllowed(scenario)

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

      {overTarget && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="warning" title={`Route ${route} is over the target working day`}>
            Total time is {r.totalHours} against a {fmtMinutes(TARGET_MINUTES)} target.
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

        {/* Scenario + helper assignment (Part A) ----------------------- */}
        <div className="zone">
          <div className="zone-head">
            <span className="zone-title">Scenario &amp; helper assignment</span>
            <Badge tone={allowHelpers ? 'valid' : 'blocked'}>
              {allowHelpers ? 'Helpers allowed' : 'Helpers not allowed'}
            </Badge>
          </div>
          <div className="zone-body stack-4">
            <div className="field">
              <label className="field-label">Scenario</label>
              <Select
                value={scenario}
                onChange={(v) => {
                  const next = v as RouteScenario
                  setScenario(next)
                  // Switching away from presale clears any assigned helpers.
                  if (!helpersAllowed(next)) setHelpers([])
                }}
                options={['Presale', 'Conventional', 'Delivery']}
                disabled={isBaseline}
              />
              <span className="field-help">
                Helpers are allowed on presale routes only.
              </span>
            </div>

            {/* Assigned helpers */}
            <div>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="field-label" style={{ margin: 0 }}>
                  Helpers
                </span>
                <span className="t-xs t-ter">
                  {helpers.length} assigned
                </span>
              </div>

              {helpers.length > 0 ? (
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
                            pushToast({
                              tone: 'info',
                              title: `Helper removed from route ${route}.`,
                            })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="callout t-xs">
                  {allowHelpers
                    ? 'No helper assigned to this presale route yet.'
                    : `This route uses a ${scenario.toLowerCase()} scenario, so helper assignment is blocked by scenario rules.`}
                </div>
              )}

              {/* Rule 1: disable, don't reject. */}
              <div className="row tight" style={{ marginTop: 'var(--s3)' }}>
                {allowHelpers ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<PlusIcon size={13} />}
                    disabled={isBaseline || helpers.length >= HELPER_POOL.length}
                    onClick={() => {
                      const next = HELPER_POOL.find((h) => !helpers.includes(h.name))
                      if (!next) return
                      setHelpers((prev) => [...prev, next.name])
                      setDirty(true)
                      pushToast({
                        tone: 'success',
                        title: 'Helper added to this presale route.',
                        sub: `${next.name} · ${next.shift}`,
                        undoLabel: 'Undo',
                        onUndo: () =>
                          setHelpers((prev) => prev.filter((h) => h !== next.name)),
                      })
                    }}
                  >
                    Add Helper
                  </Button>
                ) : (
                  <Tooltip text={HELPER_BLOCKED_COPY.tooltip}>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<PlusIcon size={13} />}
                      disabled
                    >
                      Add Helper
                    </Button>
                  </Tooltip>
                )}

                {/* Same action from a menu must explain via a blocking modal. */}
                {!allowHelpers && (
                  <button className="link-btn plain t-xs" onClick={() => setBlockModal(true)}>
                    Why is this blocked?
                  </button>
                )}
              </div>

              {!allowHelpers && (
                <div
                  className="row tight t-xs t-ter"
                  style={{ marginTop: 8, lineHeight: 1.5 }}
                >
                  <MinusCircleIcon size={12} style={{ flex: '0 0 auto' }} />
                  {HELPER_BLOCKED_COPY.tooltip}
                </div>
              )}
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
      {/* Part A: blocking modal for menu/shortcut triggers ---------------- */}
      {blockModal && (
        <Modal
          title={HELPER_BLOCKED_COPY.modalTitle}
          sub={HELPER_BLOCKED_COPY.modalBody}
          mark={
            <span className="modal-danger-mark">
              <MinusCircleIcon size={17} />
            </span>
          }
          onClose={() => setBlockModal(false)}
          footer={
            <Button variant="dark" onClick={() => setBlockModal(false)}>
              {HELPER_BLOCKED_COPY.cta}
            </Button>
          }
        >
          <div className="callout">
            <strong style={{ color: 'var(--text)' }}>Design note:</strong> the inline control
            above is disabled with a tooltip. This modal is only shown when the action is
            triggered from a menu or a keyboard shortcut, where there is no visible disabled
            control to explain itself.
          </div>
        </Modal>
      )}
    </Drawer>
  )
}
