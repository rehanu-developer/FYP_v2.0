/**
 * Bulk Reassign Route — UPDATED to the confirmed direction.
 *
 * Route/territory movement is no longer restricted during planning. Every
 * selected customer moves. Concerns (preferred route mismatch, route over the
 * 45-hour target, reduced balance) become tracked warnings, and the primary
 * action stays enabled.
 */
import { useMemo, useState } from 'react'
import { ROUTES, ROUTE_IDS, fmtMinutes, fmtMoney, fmtNum } from '../../data/mock'
import { LASSO_MOVE_WARNINGS } from '../../data/prompt2'
import { COPY, ROUTE_HOURS_TARGET, isOverHours } from '../../data/rules'
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
import { RouteIcon } from '../../components/icons'

type Phase = 'pick' | 'validating' | 'result' | 'applying'

/**
 * Every customer moves. This only decides how many WARNINGS the destination
 * produces, so reviewers can see both the clean and the flagged variant:
 *   971 -> no warnings
 *   972 -> preferred-route + over-hours warnings
 *   973 -> the same warnings plus a route-balance warning
 */
function warningsFor(destination: string) {
  if (destination === '971') return []
  if (destination === '972') return LASSO_MOVE_WARNINGS
  return [
    ...LASSO_MOVE_WARNINGS,
    {
      customerId: '1000297',
      currentRoute: '970',
      warning: 'This move may reduce route balance.',
    },
  ]
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

  const warnings = useMemo(() => (target ? warningsFor(target) : []), [target])
  const movedCount = scopeCount

  const targetRoute = ROUTES.find((r) => r.route === target)
  const sourceRoute = ROUTES.find((r) => r.route === '970')

  const movedMinutes = Math.round(movedCount * 6.2)
  const movedRevenue = Math.round(movedCount * 640)

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
        title: `${fmtNum(movedCount)} customers moved to Route ${target}.`,
        sub:
          warnings.length > 0
            ? `${warnings.length} warnings added to review list.`
            : 'Changes applied to ' + activeVersion.name + '.',
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Route reassignment reverted.' }),
      })
      clearSelection()
      onClose()
    }, 150)
  }

  const heading = 'Move selected customers'
  const subtext = `${fmtNum(movedCount)} selected customers will be moved to Route ${target}.`

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
            {phase === 'validating' ? 'Checking…' : 'Continue'}
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

    // result — the move is always allowed
    return (
      <>
        <Button variant="primary" onClick={apply}>
          Apply Move
        </Button>
        {warnings.length > 0 && (
          <Button onClick={() => setReviewing((v) => !v)}>
            {reviewing ? 'Hide Warnings' : 'Apply and Review Warnings'}
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </>
    )
  })()

  const showWarningList = phase === 'result' && warnings.length > 0 && reviewing

  return (
    <Drawer
      title="Reassign Route"
      sub={`Move the selected customers to a different route in ${activeVersion.name}.`}
      onClose={onClose}
      footer={footer}
      wide={showWarningList}
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

          {/* Move review — always allowed --------------------------------- */}
          {phase === 'result' && (
            <>
              <Banner tone={warnings.length ? 'warning' : 'success'} title={heading}>
                {subtext}
              </Banner>

              <div className="row" style={{ gap: 'var(--s2)', marginTop: 'var(--s4)' }}>
                <CountCard
                  label="Selected customers"
                  value={fmtNum(movedCount)}
                  tone="valid"
                />
                <CountCard
                  label="Warnings"
                  value={fmtNum(warnings.length)}
                  tone={warnings.length ? 'warning' : 'default'}
                />
              </div>

              {targetRoute && (
                <div className="zone" style={{ marginTop: 'var(--s4)' }}>
                  <div className="zone-head">
                    <span className="zone-title">
                      <span className="row tight">
                        <RouteIcon size={13} />
                        Route {targetRoute.route} after this move
                      </span>
                    </span>
                    <Badge
                      tone={
                        isOverHours(targetRoute.totalMinutes + movedMinutes)
                          ? 'warning'
                          : 'valid'
                      }
                    >
                      {isOverHours(targetRoute.totalMinutes + movedMinutes)
                        ? `Over ${ROUTE_HOURS_TARGET}h after move`
                        : 'Within target'}
                    </Badge>
                  </div>
                  <div className="zone-body">
                    <DL>
                      <DLRow k="Driver" v={targetRoute.driver} />
                      <DLRow
                        k="Customers"
                        v={`${fmtNum(targetRoute.customers)} → ${fmtNum(
                          targetRoute.customers + movedCount,
                        )}`}
                      />
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
                    </DL>
                  </div>
                </div>
              )}

              {showWarningList && (
                <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
                  <div className="table-toolbar">
                    <span className="t-sm t-med">Warnings</span>
                    <span className="spacer" />
                    <span className="t-xs t-ter">
                      Tracked for review · the move still applies
                    </span>
                  </div>
                  <div className="table-scroll">
                    <table className="tbl" style={{ minWidth: 620 }}>
                      <thead>
                        <tr>
                          <th>Customer ID</th>
                          <th>Current Route</th>
                          <th style={{ minWidth: 260 }}>Warning</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {warnings.map((w) => (
                          <tr
                            key={w.customerId}
                            className={
                              highlighted.includes(w.customerId) ? 'highlighted' : undefined
                            }
                          >
                            <td className="cell-id">{w.customerId}</td>
                            <td>{w.currentRoute}</td>
                            <td
                              className="td-muted"
                              style={{ whiteSpace: 'normal', minWidth: 260 }}
                            >
                              {w.warning}
                            </td>
                            <td className="right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setHighlighted((prev) =>
                                    prev.includes(w.customerId)
                                      ? prev.filter((x) => x !== w.customerId)
                                      : [...prev, w.customerId],
                                  )
                                }
                              >
                                {highlighted.includes(w.customerId) ? 'Clear' : 'Review'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-foot">
                    <span>{COPY.planningFlexibility}</span>
                    <span className="t-xs t-ter">Resolve or acknowledge before finalize.</span>
                  </div>
                </div>
              )}

              {warnings.length > 0 && !reviewing && (
                <div className="t-xs t-ter" style={{ marginTop: 'var(--s3)' }}>
                  {warnings.length} warnings will be added to the review list. The move still
                  applies to all {fmtNum(movedCount)} customers.
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
              <Tooltip text="Prototype affordance so both the clean and flagged variants are reachable">
                <strong style={{ color: 'var(--text)' }}>Reviewing warnings:</strong>
              </Tooltip>{' '}
              Route <span className="mono">971</span> moves cleanly,{' '}
              <span className="mono">972</span> adds 2 warnings, and{' '}
              <span className="mono">973</span> adds a route-balance warning too. All three
              moves are allowed.
            </div>
          )}
        </>
      )}
    </Drawer>
  )
}
