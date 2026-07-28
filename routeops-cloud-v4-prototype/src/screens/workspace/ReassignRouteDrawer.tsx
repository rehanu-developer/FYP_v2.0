/**
 * Bulk Reassign Route drawer.
 * Same all-or-nothing validation contract as Assign Day / Week: the scope is
 * stated exactly, nothing is written until validation passes.
 */
import { useState } from 'react'
import { ROUTES, ROUTE_IDS, fmtMinutes, fmtMoney, fmtNum } from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  DL,
  DLRow,
  Drawer,
  ProgressBar,
  Select,
  StepList,
} from '../../components/ui'
import { RouteIcon } from '../../components/icons'

type Phase = 'pick' | 'validating' | 'valid' | 'applying'

export function ReassignRouteDrawer({ onClose }: { onClose: () => void }) {
  const { selection, activeVersion, pushToast, clearSelection, setDirty } = useApp()
  const [target, setTarget] = useState('')
  const [phase, setPhase] = useState<Phase>('pick')
  const [pct, setPct] = useState(0)

  const scopeCount =
    selection.mode === 'matching' ? selection.matchingCount : selection.ids.length
  const scopeLabel =
    selection.mode === 'matching'
      ? `All ${fmtNum(scopeCount)} customers matching current filters selected`
      : `${fmtNum(scopeCount)} selected`

  const targetRoute = ROUTES.find((r) => r.route === target)
  // Projected load after the move, so the analyst sees the consequence up front.
  const projectedMinutes = targetRoute
    ? targetRoute.totalMinutes + Math.round(scopeCount * 0.34)
    : 0

  const validate = () => {
    setPhase('validating')
    window.setTimeout(() => setPhase('valid'), 800)
  }

  const apply = () => {
    setPhase('applying')
    setPct(0)
    // Local counter keeps side effects out of the state updater (StrictMode
    // double-invokes updaters, which would fire the toast twice).
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 14)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      setDirty(true)
      pushToast({
        tone: 'success',
        title: `${fmtNum(scopeCount)} customers reassigned to Route ${target}.`,
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Route reassignment reverted.' }),
      })
      clearSelection()
      onClose()
    }, 160)
  }

  return (
    <Drawer
      title="Reassign Route"
      sub={`Move the selected customers to a different route in ${activeVersion.name}.`}
      onClose={onClose}
      footer={
        phase === 'pick' || phase === 'validating' ? (
          <>
            <Button
              variant="primary"
              disabled={!target || phase === 'validating'}
              onClick={validate}
            >
              {phase === 'validating' ? 'Validating…' : 'Validate Reassignment'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </>
        ) : phase === 'valid' ? (
          <>
            <Button variant="primary" onClick={apply}>
              Apply Reassignment
            </Button>
            <Button onClick={() => setPhase('pick')}>Back</Button>
          </>
        ) : (
          <>
            <Button variant="primary" disabled>
              Applying…
            </Button>
            <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
              Do not close this drawer
            </span>
          </>
        )
      }
    >
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
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Target route</label>
            <Select
              value={target}
              onChange={setTarget}
              options={ROUTE_IDS}
              placeholder="Choose target route"
              disabled={phase !== 'pick'}
            />
            <span className="field-help">
              Customer Master preferred routes are not changed by this action. Moving a customer
              away from its preferred route creates a Route Mismatch flag.
            </span>
          </div>

          {targetRoute && (
            <div className="zone" style={{ marginBottom: 'var(--s4)' }}>
              <div className="zone-head">
                <span className="zone-title">
                  <span className="row tight">
                    <RouteIcon size={13} />
                    Route {targetRoute.route} after this move
                  </span>
                </span>
                <Badge
                  tone={projectedMinutes > 480 ? 'warning' : 'valid'}
                >
                  {projectedMinutes > 480 ? 'Over target' : 'Within target'}
                </Badge>
              </div>
              <div className="zone-body">
                <DL>
                  <DLRow k="Driver" v={targetRoute.driver} />
                  <DLRow
                    k="Customers"
                    v={`${fmtNum(targetRoute.customers)} → ${fmtNum(
                      targetRoute.customers + scopeCount,
                    )}`}
                  />
                  <DLRow
                    k="Total time"
                    v={`${targetRoute.totalHours} → ${fmtMinutes(projectedMinutes)}`}
                  />
                  <DLRow k="Revenue" v={fmtMoney(targetRoute.revenue)} />
                </DL>
              </div>
            </div>
          )}

          {phase === 'validating' && (
            <div className="callout row tight">
              <span className="spinner" />
              Checking {fmtNum(scopeCount)} customers against route rules…
            </div>
          )}

          {phase === 'valid' && (
            <Banner tone="success" title="Validation passed">
              All {fmtNum(scopeCount)} customers can be moved to Route {target}.
              {projectedMinutes > 480 && (
                <div style={{ marginTop: 6 }}>
                  Note: Route {target} will exceed the 8h target after this move.
                </div>
              )}
            </Banner>
          )}
        </>
      )}
    </Drawer>
  )
}
