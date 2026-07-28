/**
 * Part C — Bulk Reassign Route validation.
 *
 * Trigger: select customer rows in the grid, then Reassign Route.
 *
 * Three validation states, driven by the destination route:
 *   A. All valid    -> confirm and move
 *   B. Some blocked -> proceed with valid only, review blocked, or cancel
 *   C. All blocked  -> review or cancel, with NO proceed button
 *
 * Global rule 2: every failed write states how many, which rows, why, and what
 * the analyst can do next.
 */
import { useMemo, useState } from 'react'
import { ROUTES, ROUTE_IDS, fmtMinutes, fmtMoney, fmtNum } from '../../data/mock'
import { REASSIGN_BLOCKED } from '../../data/prompt2'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  CountCard,
  DL,
  DLRow,
  Drawer,
  ProgressBar,
  Select,
  StepList,
  Tooltip,
} from '../../components/ui'
import { RouteIcon, WarningIcon } from '../../components/icons'

type Phase = 'pick' | 'validating' | 'result' | 'applying'

/**
 * Which destination produces which validation state. Keeping this explicit
 * makes each documented state reachable from the navigator without a toggle.
 *   971 -> all valid
 *   972 -> some blocked (2 of 12)
 *   973 -> all blocked
 */
function outcomeFor(destination: string, scopeCount: number) {
  if (destination === '973') return { valid: 0, blocked: scopeCount }
  if (destination === '972')
    return { valid: Math.max(0, scopeCount - REASSIGN_BLOCKED.length), blocked: REASSIGN_BLOCKED.length }
  return { valid: scopeCount, blocked: 0 }
}

export function ReassignRouteDrawer({
  onClose,
  initialDestination,
}: {
  onClose: () => void
  initialDestination?: string
}) {
  const { selection, activeVersion, pushToast, clearSelection, setDirty, runPatch } =
    useApp()

  const [target, setTarget] = useState(initialDestination ?? '')
  const [phase, setPhase] = useState<Phase>('pick')
  const [pct, setPct] = useState(0)
  const [highlighted, setHighlighted] = useState<string[]>([])
  const [reviewing, setReviewing] = useState(false)

  const scopeCount =
    selection.mode === 'matching' ? selection.matchingCount : selection.ids.length
  const scopeLabel =
    selection.mode === 'matching'
      ? `All ${fmtNum(scopeCount)} customers matching current filters`
      : `${fmtNum(scopeCount)} selected customers`

  const outcome = useMemo(
    () => (target ? outcomeFor(target, scopeCount) : { valid: 0, blocked: 0 }),
    [target, scopeCount],
  )

  const state: 'A' | 'B' | 'C' =
    outcome.blocked === 0 ? 'A' : outcome.valid === 0 ? 'C' : 'B'

  const targetRoute = ROUTES.find((r) => r.route === target)
  const sourceRoute = ROUTES.find((r) => r.route === '970')

  // Projected impact of moving the valid rows only.
  const movedMinutes = Math.round(outcome.valid * 0.34)
  const movedRevenue = Math.round(outcome.valid * 640)

  const validate = () => {
    setPhase('validating')
    window.setTimeout(() => setPhase('result'), 850)
  }

  const apply = () => {
    setPhase('applying')
    setPct(0)
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 14)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      setDirty(true)
      runPatch()
      pushToast({
        tone: 'success',
        title: `${fmtNum(outcome.valid)} customers reassigned to Route ${target}.`,
        sub:
          outcome.blocked > 0
            ? `${outcome.blocked} blocked customers were not moved.`
            : 'Changes applied to ' + activeVersion.name + '.',
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Route reassignment reverted.' }),
      })
      clearSelection()
      onClose()
    }, 150)
  }

  /* --- headings per state ------------------------------------------------ */

  const heading =
    state === 'A'
      ? 'Confirm route reassignment'
      : state === 'B'
        ? 'Review route reassignment'
        : 'Move blocked'

  const subtext =
    state === 'A'
      ? `All ${fmtNum(outcome.valid)} selected customers can be reassigned to Route ${target}.`
      : state === 'B'
        ? `${fmtNum(outcome.valid)} customers can be moved. ${outcome.blocked} customers are blocked by planning rules.`
        : `None of the selected customers can be reassigned to Route ${target}.`

  /* --- footer ------------------------------------------------------------ */

  const footer = (() => {
    if (phase === 'pick' || phase === 'validating')
      return (
        <>
          <Button
            variant="primary"
            disabled={!target || phase === 'validating'}
            onClick={validate}
          >
            {phase === 'validating' ? 'Validating…' : 'Validate Move'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </>
      )

    if (phase === 'applying')
      return (
        <>
          <Button variant="primary" disabled>
            Applying…
          </Button>
          <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
            Do not close this drawer
          </span>
        </>
      )

    // result
    if (state === 'A')
      return (
        <>
          <Button variant="primary" onClick={apply}>
            Move {fmtNum(outcome.valid)} customers
          </Button>
          <Button onClick={() => setPhase('pick')}>Back</Button>
        </>
      )

    if (state === 'B')
      return (
        <>
          <Button variant="primary" onClick={apply}>
            Proceed with {fmtNum(outcome.valid)} valid customers
          </Button>
          <Button onClick={() => setReviewing((v) => !v)}>
            {reviewing ? 'Hide blocked customers' : 'Review blocked customers'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel move
          </Button>
        </>
      )

    // State C — no proceed button at all.
    return (
      <>
        <Button variant="secondary" onClick={() => setReviewing((v) => !v)}>
          {reviewing ? 'Hide blocked customers' : 'Review blocked customers'}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </>
    )
  })()

  const showBlockedList = phase === 'result' && (state === 'B' || state === 'C') && reviewing

  return (
    <Drawer
      title="Reassign Route"
      sub={`Move the selected customers to a different route in ${activeVersion.name}.`}
      onClose={onClose}
      footer={footer}
      wide={showBlockedList}
    >
      {/* Selection scope -------------------------------------------------- */}
      <div className="callout" style={{ marginBottom: 'var(--s5)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="strip-label">Selection scope</span>
          <span className="t-med t-sm" style={{ textAlign: 'right' }}>
            {scopeLabel}
          </span>
        </div>
      </div>

      {phase === 'applying' ? (
        <div>
          <div className="section-title" style={{ marginBottom: 'var(--s3)' }}>
            Applying reassignment
          </div>
          <ProgressBar pct={pct} />
          <div style={{ marginTop: 'var(--s4)' }}>
            <StepList
              steps={[
                { label: 'Updating route assignments…', state: pct > 35 ? 'done' : 'active' },
                {
                  label: 'Recalculating route metrics…',
                  state: pct > 70 ? 'done' : pct > 35 ? 'active' : 'todo',
                },
                {
                  label: 'Refreshing route summary…',
                  state: pct >= 100 ? 'done' : pct > 70 ? 'active' : 'todo',
                },
              ]}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Destination ------------------------------------------------- */}
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Destination Route</label>
            <Select
              value={target}
              onChange={(v) => {
                setTarget(v)
                setPhase('pick')
                setReviewing(false)
              }}
              options={ROUTE_IDS}
              placeholder="Select destination route"
              disabled={phase === 'validating'}
            />
            <span className="field-help">
              Moving a customer away from its preferred route creates a Route Mismatch flag.
              Customer Master preferred routes are not changed by this action.
            </span>
          </div>

          {phase === 'validating' && (
            <div className="callout row tight">
              <span className="spinner" />
              Checking {fmtNum(scopeCount)} customers against pattern, depot and route rules…
            </div>
          )}

          {/* Validation result ------------------------------------------ */}
          {phase === 'result' && (
            <>
              <Banner
                tone={state === 'A' ? 'success' : state === 'B' ? 'warning' : 'error'}
                title={heading}
              >
                {subtext}
              </Banner>

              <div
                className="row"
                style={{ gap: 'var(--s2)', marginTop: 'var(--s4)' }}
              >
                <CountCard
                  label="Valid"
                  value={fmtNum(outcome.valid)}
                  tone={outcome.valid ? 'valid' : 'default'}
                />
                <CountCard
                  label="Blocked"
                  value={fmtNum(outcome.blocked)}
                  tone={outcome.blocked ? 'blocked' : 'default'}
                />
              </div>

              {/* Impact preview, only meaningful when something can move. */}
              {outcome.valid > 0 && targetRoute && (
                <div className="zone" style={{ marginTop: 'var(--s4)' }}>
                  <div className="zone-head">
                    <span className="zone-title">
                      <span className="row tight">
                        <RouteIcon size={13} />
                        Estimated impact
                      </span>
                    </span>
                    <Badge tone={targetRoute.totalMinutes + movedMinutes > 480 ? 'warning' : 'valid'}>
                      {targetRoute.totalMinutes + movedMinutes > 480
                        ? 'Over target after move'
                        : 'Within target'}
                    </Badge>
                  </div>
                  <div className="zone-body">
                    <DL>
                      <DLRow
                        k={`Route ${sourceRoute?.route} hours`}
                        v={`${sourceRoute?.totalHours} → ${fmtMinutes(
                          (sourceRoute?.totalMinutes ?? 0) - movedMinutes,
                        )}`}
                      />
                      <DLRow
                        k={`Route ${target} hours`}
                        v={`${targetRoute.totalHours} → ${fmtMinutes(
                          targetRoute.totalMinutes + movedMinutes,
                        )}`}
                      />
                      <DLRow k="Revenue moved" v={fmtMoney(movedRevenue)} />
                      <DLRow k="Customers moved" v={fmtNum(outcome.valid)} />
                    </DL>
                  </div>
                </div>
              )}

              {/* State C reason rollup -------------------------------- */}
              {state === 'C' && (
                <div className="callout" style={{ marginTop: 'var(--s4)' }}>
                  <div className="row tight" style={{ marginBottom: 6 }}>
                    <WarningIcon size={14} style={{ color: 'var(--error)' }} />
                    <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
                      Why every row is blocked
                    </span>
                  </div>
                  Route {target} is not depot-eligible for this selection, so no customer in
                  scope can be served from it. Choose a different destination route, or change
                  the depot on the session.
                </div>
              )}

              {/* Blocked list ----------------------------------------- */}
              {showBlockedList && (
                <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
                  <div className="table-toolbar">
                    <span className="t-sm t-med">Blocked customers</span>
                    <span className="spacer" />
                    <span className="t-xs t-ter">
                      Showing {Math.min(REASSIGN_BLOCKED.length, outcome.blocked)} of{' '}
                      {fmtNum(outcome.blocked)}
                    </span>
                  </div>
                  <div className="table-scroll">
                    <table className="tbl" style={{ minWidth: 620 }}>
                      <thead>
                        <tr>
                          <th>Customer ID</th>
                          <th>Current Route</th>
                          <th style={{ minWidth: 260 }}>Reason</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {REASSIGN_BLOCKED.map((b) => (
                          <tr
                            key={b.customerId}
                            className={
                              highlighted.includes(b.customerId) ? 'highlighted' : undefined
                            }
                          >
                            <td className="cell-id">{b.customerId}</td>
                            <td>{b.currentRoute}</td>
                            <td
                              className="td-muted"
                              style={{ whiteSpace: 'normal', minWidth: 260 }}
                            >
                              {b.reason}
                            </td>
                            <td className="right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setHighlighted((prev) =>
                                    prev.includes(b.customerId)
                                      ? prev.filter((x) => x !== b.customerId)
                                      : [...prev, b.customerId],
                                  )
                                }
                              >
                                {highlighted.includes(b.customerId) ? 'Clear' : 'Highlight'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-foot">
                    <span>Blocked customers will not move.</span>
                    <span className="t-xs t-ter">
                      Highlight marks the row in the grid behind this drawer.
                    </span>
                  </div>
                </div>
              )}

              {state === 'B' && !reviewing && (
                <div className="t-xs t-ter" style={{ marginTop: 'var(--s3)' }}>
                  Blocked customers will not move. Review them before proceeding if you need to
                  fix the underlying rule conflicts.
                </div>
              )}
            </>
          )}

          {/* Prototype hint so every state is reachable ----------------- */}
          {phase === 'pick' && (
            <div
              className="callout t-xs"
              style={{ marginTop: 'var(--s6)', borderStyle: 'dashed' }}
            >
              <Tooltip text="Prototype affordance so each documented validation state is reachable">
                <strong style={{ color: 'var(--text)' }}>Reviewing states:</strong>
              </Tooltip>{' '}
              Route <span className="mono">971</span> is all valid,{' '}
              <span className="mono">972</span> has 2 blocked rows, and{' '}
              <span className="mono">973</span> is fully blocked.
            </div>
          )}
        </>
      )}
    </Drawer>
  )
}
