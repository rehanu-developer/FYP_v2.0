/**
 * Map / lasso spatial planning canvas + lasso validation.
 *
 * This is NOT live tracking. It is a static planning map used to select
 * customers spatially and move them between routes, with the same rule
 * validation the grid uses.
 */
import { useMemo, useState } from 'react'
import {
  CUSTOMERS,
  MAP_PINS,
  MAP_PIN_SCALE,
  ROUTE_IDS,
  fmtMoney,
  fmtNum,
  type MapPin,
} from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Modal,
  ProgressBar,
  Select,
  StepList,
} from '../../components/ui'
import { LassoIcon, TargetIcon } from '../../components/icons'

const ROUTE_COLORS: Record<string, string> = {
  '970': '#c9812b',
  '971': '#4f6b82',
  '972': '#3f7d58',
  '973': '#a63d3d',
  '974': '#8a6a3a',
  '975': '#6b6b6b',
  '976': '#b57614',
  '977': '#55524b',
}

type Phase = 'select' | 'validating' | 'valid' | 'invalid' | 'applying'

/** A fixed elliptical lasso region, expressed in canvas percentages. */
const LASSO = { left: 8, top: 22, width: 34, height: 46 }

function inLasso(p: { mx: number; my: number }) {
  const cx = LASSO.left + LASSO.width / 2
  const cy = LASSO.top + LASSO.height / 2
  const rx = LASSO.width / 2
  const ry = LASSO.height / 2
  const dx = (p.mx - cx) / rx
  const dy = (p.my - cy) / ry
  return dx * dx + dy * dy <= 1
}

export function MapLassoModal({ onClose }: { onClose: () => void }) {
  const { isBaseline, activeVersion, pushToast, setDirty } = useApp()
  const [lassoOn, setLassoOn] = useState(false)
  const [target, setTarget] = useState('')
  const [phase, setPhase] = useState<Phase>('select')
  const [routeFilter, setRouteFilter] = useState('')
  const [progress, setProgress] = useState(0)

  const selected = useMemo<MapPin[]>(
    () => (lassoOn ? MAP_PINS.filter(inLasso) : []),
    [lassoOn],
  )

  // Each pin stands for MAP_PIN_SCALE customers, so the copy reads at the
  // real session scale rather than at prototype-sample scale.
  const scaled = Math.round(selected.length * MAP_PIN_SCALE)
  const revenue = Math.round(
    selected.reduce((n, p) => n + p.revenue, 0) * MAP_PIN_SCALE,
  )

  /** Lasso validation: moving a customer must not break its pattern rules. */
  const blocked = useMemo(() => selected.filter((p) => p.blocked), [selected])

  const validate = () => {
    setPhase('validating')
    window.setTimeout(() => {
      setPhase(blocked.length > 0 ? 'invalid' : 'valid')
    }, 850)
  }

  const apply = () => {
    setPhase('applying')
    setProgress(0)
    // Side effects stay outside the state updater (StrictMode double-invokes).
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 12)
      setProgress(p)
      if (p < 100) return
      window.clearInterval(t)
      setDirty(true)
      pushToast({
        tone: 'success',
        title: `${fmtNum(scaled)} customers reassigned to Route ${target}.`,
        sub: 'Selected by map lasso. Route metrics recalculated.',
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Lasso reassignment reverted.' }),
      })
      onClose()
    }, 150)
  }

  const visible = routeFilter
    ? MAP_PINS.filter((p) => p.route === routeFilter)
    : MAP_PINS

  return (
    <Modal
      title="Spatial Planning Map"
      sub={`Select customers geographically and move them between routes in ${activeVersion.name}. This is a planning map, not live vehicle tracking.`}
      onClose={onClose}
      size="xl"
      footer={
        <>
          {phase === 'select' && (
            <Button
              variant="primary"
              disabled={isBaseline || !selected.length || !target}
              onClick={validate}
            >
              Validate Reassignment
            </Button>
          )}
          {phase === 'validating' && (
            <Button variant="primary" disabled>
              Validating…
            </Button>
          )}
          {phase === 'valid' && (
            <Button variant="primary" onClick={apply}>
              Apply Reassignment
            </Button>
          )}
          {phase === 'invalid' && (
            <Button
              variant="primary"
              onClick={() => {
                setPhase('valid')
              }}
            >
              Exclude {blocked.length} blocked and continue
            </Button>
          )}
          {phase === 'applying' && (
            <Button variant="primary" disabled>
              Applying…
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
            {selected.length
              ? `${fmtNum(scaled)} customers in lasso · ${fmtMoney(revenue)}`
              : 'Draw a lasso to select customers'}
          </span>
        </>
      }
    >
      {isBaseline && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="locked">
            The baseline can’t be edited. Save as a new option to make changes.
          </Banner>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 268px',
          gap: 'var(--s4)',
          alignItems: 'start',
        }}
      >
        {/* Canvas ---------------------------------------------------------- */}
        <div className="map-canvas">
          <div className="map-toolbar">
            <Button
              size="sm"
              variant={lassoOn ? 'primary' : 'secondary'}
              icon={<LassoIcon size={13} />}
              disabled={isBaseline}
              onClick={() => {
                setLassoOn((v) => !v)
                setPhase('select')
              }}
            >
              {lassoOn ? 'Clear Lasso' : 'Lasso Select'}
            </Button>
            <select
              className={`filter-select${routeFilter ? ' active' : ''}`}
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              aria-label="Show route"
            >
              <option value="">All routes</option>
              {ROUTE_IDS.map((r) => (
                <option key={r} value={r}>
                  Route {r}
                </option>
              ))}
            </select>
          </div>

          {/* Simple road hints so the canvas reads as a map, not a scatter plot. */}
          <div className="map-road" style={{ left: 0, right: 0, top: '38%', height: 5 }} />
          <div className="map-road" style={{ left: 0, right: 0, top: '69%', height: 3 }} />
          <div className="map-road" style={{ top: 0, bottom: 0, left: '31%', width: 4 }} />
          <div className="map-road" style={{ top: 0, bottom: 0, left: '62%', width: 3 }} />

          {lassoOn && (
            <div
              className="lasso-shape"
              style={{
                left: `${LASSO.left}%`,
                top: `${LASSO.top}%`,
                width: `${LASSO.width}%`,
                height: `${LASSO.height}%`,
              }}
            />
          )}

          <span className="map-depot" style={{ left: '31%', top: '38%' }}>
            Depot · BR North
          </span>

          {visible.map((p) => {
            const c = p.customerId
              ? CUSTOMERS.find((x) => x.customerId === p.customerId)
              : undefined
            return (
              <span
                key={p.id}
                className={`map-pin${lassoOn && inLasso(p) ? ' in-lasso' : ''}${
                  p.customerId ? '' : ' context'
                }`}
                style={{
                  left: `${p.mx}%`,
                  top: `${p.my}%`,
                  background: ROUTE_COLORS[p.route] ?? '#6b6b6b',
                }}
                title={
                  c
                    ? `${c.customerId} · Route ${c.route} · ${c.name}`
                    : `Route ${p.route} · ${Math.round(MAP_PIN_SCALE)} customers`
                }
              />
            )
          })}

          <div className="map-legend">
            {ROUTE_IDS.map((r) => (
              <span className="legend-item" key={r}>
                <span className="legend-swatch" style={{ background: ROUTE_COLORS[r] }} />
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel ------------------------------------------------------ */}
        <div className="stack-4">
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Lasso selection</span>
              {selected.length > 0 && <Badge tone="editable">{fmtNum(scaled)}</Badge>}
            </div>
            <div className="zone-body">
              {!selected.length ? (
                <div className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
                  <div className="row tight" style={{ marginBottom: 8 }}>
                    <TargetIcon size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="t-med" style={{ color: 'var(--text)' }}>
                      Nothing selected
                    </span>
                  </div>
                  Use Lasso Select to draw a region on the map. Customers inside the region are
                  selected for reassignment.
                </div>
              ) : (
                <>
                  <div className="dl">
                    <div className="dl-row">
                      <span className="dl-key">Customers</span>
                      <span className="dl-val tnum">{fmtNum(scaled)}</span>
                    </div>
                    <div className="dl-row">
                      <span className="dl-key">Revenue</span>
                      <span className="dl-val tnum">{fmtMoney(revenue)}</span>
                    </div>
                    <div className="dl-row">
                      <span className="dl-key">Routes touched</span>
                      <span className="dl-val">
                        {Array.from(new Set(selected.map((p) => p.route)))
                          .sort()
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="field" style={{ marginTop: 'var(--s4)' }}>
                    <label className="field-label">Reassign to route</label>
                    <Select
                      value={target}
                      onChange={setTarget}
                      options={ROUTE_IDS}
                      placeholder="Choose target route"
                      disabled={isBaseline || phase !== 'select'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Validation feedback ---------------------------------------- */}
          {phase === 'validating' && (
            <div className="callout row tight">
              <span className="spinner" />
              Checking {fmtNum(scaled)} customers against route and pattern rules…
            </div>
          )}

          {phase === 'valid' && (
            <Banner tone="success" title="Reassignment is valid">
              All {fmtNum(scaled)} selected customers can move to Route {target}.
            </Banner>
          )}

          {phase === 'invalid' && (
            <Banner tone="error" title="No changes were applied.">
              {Math.round(blocked.length * MAP_PIN_SCALE)} of {fmtNum(scaled)} selected
              customers can’t move to Route {target}.
              <ul style={{ margin: '6px 0 0', paddingLeft: 16, lineHeight: 1.6 }}>
                {blocked.slice(0, 3).map((p) => (
                  <li key={p.id}>
                    <span className="mono">{p.customerId ?? `Route ${p.route}`}</span> —
                    Missing a required service pattern.
                  </li>
                ))}
              </ul>
            </Banner>
          )}

          {phase === 'applying' && (
            <div className="callout">
              <div className="t-med t-sm" style={{ color: 'var(--text)', marginBottom: 8 }}>
                Applying reassignment
              </div>
              <ProgressBar pct={progress} />
              <div style={{ marginTop: 'var(--s3)' }}>
                <StepList
                  steps={[
                    { label: 'Updating route assignments…', state: progress > 30 ? 'done' : 'active' },
                    {
                      label: 'Recalculating route metrics…',
                      state: progress > 65 ? 'done' : progress > 30 ? 'active' : 'todo',
                    },
                    {
                      label: 'Refreshing route summary…',
                      state: progress > 90 ? 'done' : progress > 65 ? 'active' : 'todo',
                    },
                  ]}
                />
              </div>
            </div>
          )}

          <div className="callout t-xs">
            Pin positions are illustrative and each pin represents about{' '}
            {Math.round(MAP_PIN_SCALE)} customers. In production they come from Customer
            Master latitude / longitude. Customers with a Missing geocode cannot be lassoed and
            must be selected from the grid.
          </div>
        </div>
      </div>
    </Modal>
  )
}
