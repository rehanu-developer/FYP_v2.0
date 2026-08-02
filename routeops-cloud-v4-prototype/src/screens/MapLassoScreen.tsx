/**
 * Map / Lasso View — UPDATED to the confirmed direction.
 *
 * Four views, each a lens on the same planning data:
 *   Territory · Route · Day of Week · Week
 *
 * Lasso moves are NO LONGER BLOCKED. An analyst may move any selected group to
 * any territory, route, Monday–Friday day, or valid cycle week. Concerns are
 * surfaced as tracked warnings in a move review, and the primary action is
 * always allowed.
 *
 * Deep links:
 *   #/map?view=territory | route | day | week
 *   #/map?version=baseline   -> read-only, lasso disabled
 */
import { useEffect, useMemo, useState } from 'react'
import {
  CUSTOMERS,
  MAP_PINS,
  MAP_PIN_SCALE,
  ROUTE_IDS,
  ROUTES,
  SERVICE_PATTERNS,
  SESSION,
  WEEKDAY_FULL,
  fmtMinutes,
  fmtMoney,
  fmtNum,
  type MapPin,
  type Weekday,
} from '../data/mock'
import {
  COPY,
  ROUTE_HOURS_TARGET,
  SCHEDULABLE_DAYS,
  WEEKEND_COPY,
  isOverHours,
  validWeeks,
  weekPairs,
} from '../data/rules'
import {
  LASSO_MOVE_WARNINGS,
  LASSO_SELECTION,
  MAP_VIEWS,
  MAP_VIEW_COPY,
  type MapView,
} from '../data/prompt2'
import { BASELINE_ID, useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  CountCard,
  DL,
  DLRow,
  Modal,
  ProgressBar,
  Select,
  StepList,
  Tabs,
  Tooltip,
} from '../components/ui'
import {
  ArrowRightIcon,
  LassoIcon,
  LockIcon,
  PlusIcon,
  RouteIcon,
  TargetIcon,
  WarningIcon,
} from '../components/icons'

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

const DAY_COLORS: Record<string, string> = {
  Mon: '#c9812b',
  Tue: '#4f6b82',
  Wed: '#3f7d58',
  Thu: '#a63d3d',
  Fri: '#8a6a3a',
}

/** Fixed lasso region in canvas percentages, sized around routes 970/971. */
const LASSO = { left: 9, top: 20, width: 33, height: 44 }

function inLasso(p: { mx: number; my: number }) {
  const cx = LASSO.left + LASSO.width / 2
  const cy = LASSO.top + LASSO.height / 2
  const dx = (p.mx - cx) / (LASSO.width / 2)
  const dy = (p.my - cy) / (LASSO.height / 2)
  return dx * dx + dy * dy <= 1
}

const VIEW_FROM_PARAM: Record<string, MapView> = {
  territory: 'Territory',
  route: 'Route',
  day: 'Day',
  week: 'Week',
}

export function MapLassoScreen() {
  const {
    isBaseline,
    activeVersion,
    setActiveVersionId,
    addOption,
    pushToast,
    setDirty,
    nav,
    runPatch,
    params,
  } = useApp()

  const [view, setView] = useState<MapView>(
    VIEW_FROM_PARAM[params.view ?? ''] ?? 'Territory',
  )
  const [lassoOn, setLassoOn] = useState(false)
  const [routeFilter, setRouteFilter] = useState('')
  const [patternFilter, setPatternFilter] = useState('')

  // Move targets, one per view.
  const [destRoute, setDestRoute] = useState(LASSO_SELECTION.suggestedDestination)
  const [destDay, setDestDay] = useState<Weekday | ''>('')
  const [destWeek, setDestWeek] = useState<number | ''>('')

  const [reviewOpen, setReviewOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const [pct, setPct] = useState(0)
  const [reviewingWarnings, setReviewingWarnings] = useState(false)

  // Deep links drive both the view and the read-only baseline state.
  useEffect(() => {
    setActiveVersionId(params.version === 'baseline' ? BASELINE_ID : 'option-1')
    if (params.view && VIEW_FROM_PARAM[params.view]) setView(VIEW_FROM_PARAM[params.view])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.version, params.view])

  /* --- pins --------------------------------------------------------------- */

  const visiblePins = useMemo(
    () =>
      MAP_PINS.filter((p) => {
        if (routeFilter && p.route !== routeFilter) return false
        if (patternFilter) {
          const c = p.customerId
            ? CUSTOMERS.find((x) => x.customerId === p.customerId)
            : undefined
          if (!c || c.servicePattern !== patternFilter) return false
        }
        return true
      }),
    [routeFilter, patternFilter],
  )

  const selectedPins = useMemo(
    () => (lassoOn && !isBaseline ? visiblePins.filter(inLasso) : []),
    [lassoOn, visiblePins, isBaseline],
  )

  function colorFor(p: MapPin) {
    const c = p.customerId ? CUSTOMERS.find((x) => x.customerId === p.customerId) : undefined
    if (view === 'Day') return DAY_COLORS[c?.serviceDays[0] ?? 'Mon'] ?? '#6b6b6b'
    if (view === 'Week') {
      const w = c?.weeks[0] ?? 1
      const ramp = ['#f5e4c8', '#eccc9b', '#dda860', '#c9812b', '#b5711f', '#9d6119', '#8a6a3a', '#55524b']
      return ramp[(w - 1) % ramp.length]
    }
    return ROUTE_COLORS[p.route] ?? '#6b6b6b'
  }

  /* --- move description per view ---------------------------------------- */

  const selectedCustomers = LASSO_SELECTION.customers
  const moveTotal = 20 // the worked example in the review panel

  const destinationLabel =
    view === 'Day'
      ? destDay
        ? WEEKDAY_FULL[destDay]
        : 'Select a day'
      : view === 'Week'
        ? destWeek !== ''
          ? `Week ${destWeek}`
          : 'Select a week'
        : `Route ${destRoute}`

  const canMove =
    view === 'Day' ? destDay !== '' : view === 'Week' ? destWeek !== '' : Boolean(destRoute)

  const warnings = LASSO_MOVE_WARNINGS

  const applyMove = () => {
    setApplying(true)
    setPct(0)
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 12)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      setApplying(false)
      setReviewOpen(false)
      setLassoOn(false)
      setDirty(true)
      runPatch()
      pushToast({
        tone: 'success',
        title:
          view === 'Day'
            ? `${moveTotal} customers moved to ${destinationLabel}.`
            : view === 'Week'
              ? `${moveTotal} customers moved to ${destinationLabel}.`
              : `${moveTotal} customers moved to Route ${destRoute}.`,
        sub: `${warnings.length} warnings added to review list.`,
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Move reverted.' }),
      })
    }, 140)
  }

  return (
    <div className="page wide">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Map / Lasso View</h1>
            <p className="page-sub">
              Select customer rows spatially and preview route changes before applying them to{' '}
              {activeVersion.name}.
            </p>
          </div>
          <Button onClick={() => nav('workspace')} iconRight={<ArrowRightIcon size={14} />}>
            Back to grid
          </Button>
        </div>
      </div>

      {/* Session pills ----------------------------------------------------- */}
      <div className="pill-row" style={{ marginBottom: 'var(--s3)' }}>
        <span className="pill">
          Session <strong>Delivery Scenario as of 07/23/2026</strong>
        </span>
        <span className="pill">
          Active Version <strong>{activeVersion.name}</strong>
        </span>
        <span className="pill">
          Cycle <strong>{SESSION.cycle}</strong>
        </span>
        <span className="pill">
          Customers visible <strong>{fmtNum(SESSION.customers)}</strong>
        </span>
      </div>

      {/* Four views -------------------------------------------------------- */}
      <div style={{ marginBottom: 'var(--s3)' }}>
        <Tabs<MapView>
          value={view}
          onChange={(v) => {
            setView(v)
            setReviewingWarnings(false)
          }}
          tabs={MAP_VIEWS.map((v) => ({ id: v, label: MAP_VIEW_COPY[v].title }))}
        />
      </div>

      <div className="callout t-xs" style={{ marginBottom: 'var(--s3)' }}>
        {MAP_VIEW_COPY[view].purpose}
      </div>

      {/* Baseline read-only ------------------------------------------------ */}
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
                  pushToast({ tone: 'success', title: `${created.name} created from Baseline` })
                }}
              >
                Save As New Option
              </Button>
            }
          >
            The baseline can’t be edited. Save as a new option to move customers.
          </Banner>
        </div>
      )}

      <div className="map-layout">
        {/* Left controls -------------------------------------------------- */}
        <div className="stack-3">
          <div className="map-panel">
            <div className="map-panel-head">{MAP_VIEW_COPY[view].title}</div>
            <div className="map-panel-body">
              {view === 'Territory' && (
                <div className="map-legend-inline">
                  {ROUTE_IDS.map((r) => (
                    <span className="legend-item" key={r}>
                      <span className="legend-swatch" style={{ background: ROUTE_COLORS[r] }} />
                      T-{r}
                    </span>
                  ))}
                </div>
              )}
              {view === 'Route' && (
                <div className="stack-2">
                  {ROUTES.map((r) => (
                    <div
                      className="row"
                      key={r.route}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <span className="row tight">
                        <span
                          className="legend-swatch"
                          style={{ background: ROUTE_COLORS[r.route] }}
                        />
                        <span className="mono t-med t-xs">{r.route}</span>
                      </span>
                      <span className="row tight">
                        <span className="t-xs t-ter tnum">{r.totalHours}</span>
                        {isOverHours(r.totalMinutes) && (
                          <Tooltip text={COPY.routeHours}>
                            <Badge tone="warning">45h</Badge>
                          </Tooltip>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {view === 'Day' && (
                <div className="map-legend-inline">
                  {SCHEDULABLE_DAYS.map((d) => (
                    <span className="legend-item" key={d}>
                      <span className="legend-swatch" style={{ background: DAY_COLORS[d] }} />
                      {WEEKDAY_FULL[d]}
                    </span>
                  ))}
                  <span className="t-xs t-ter" style={{ marginTop: 6 }}>
                    {WEEKEND_COPY.helper}
                  </span>
                </div>
              )}
              {view === 'Week' && (
                <div className="stack-2">
                  {SESSION.cycleWeeks === 8 ? (
                    weekPairs(SESSION.cycleWeeks).map(([a, b], i) => (
                      <div className="row" key={i} style={{ justifyContent: 'space-between' }}>
                        <span className="t-xs t-sec">Pair {i + 1}</span>
                        <span className="row tight">
                          <Badge tone="editable">Wk {a}</Badge>
                          <span className="t-ter">+</span>
                          <Badge tone="editable">Wk {b}</Badge>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="row wrap tight">
                      {validWeeks(SESSION.cycleWeeks).map((w) => (
                        <Badge key={w} tone="editable">
                          Wk {w}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="map-panel">
            <div className="map-panel-head">Filters</div>
            <div className="map-panel-body stack-2">
              <Select
                value={routeFilter}
                onChange={setRouteFilter}
                options={ROUTE_IDS}
                placeholder="Route"
              />
              <Select
                value={patternFilter}
                onChange={setPatternFilter}
                options={Object.keys(SERVICE_PATTERNS)}
                placeholder="Service Pattern"
              />
              {(routeFilter || patternFilter) && (
                <button
                  className="link-btn plain t-xs"
                  onClick={() => {
                    setRouteFilter('')
                    setPatternFilter('')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="map-panel">
            <div className="map-panel-head">Tools</div>
            <div className="map-panel-body" style={{ paddingTop: 'var(--s2)' }}>
              {isBaseline ? (
                <Tooltip text="The baseline can’t be edited. Save as a new option to move customers.">
                  <button className="map-tool primary" disabled>
                    <LassoIcon size={14} />
                    Lasso
                    <LockIcon size={12} style={{ marginLeft: 'auto', flex: '0 0 auto' }} />
                  </button>
                </Tooltip>
              ) : (
                <button
                  className={`map-tool primary${lassoOn ? ' on' : ''}`}
                  onClick={() => setLassoOn((v) => !v)}
                >
                  <LassoIcon size={14} />
                  Lasso
                  <span className="t-xs" style={{ marginLeft: 'auto', opacity: 0.75 }}>
                    {lassoOn ? 'on' : ''}
                  </span>
                </button>
              )}
              {['Pin', 'Recenter', 'Measure'].map((t) => (
                <button className="map-tool" key={t}>
                  <TargetIcon size={14} />
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas --------------------------------------------------------- */}
        <div>
          <div className={`map-canvas-lg${isBaseline ? ' locked' : ''}`}>
            <div className="map-road" style={{ left: 0, right: 0, top: '36%', height: 6 }} />
            <div className="map-road" style={{ left: 0, right: 0, top: '68%', height: 3 }} />
            <div className="map-road" style={{ top: 0, bottom: 0, left: '30%', width: 5 }} />
            <div className="map-road" style={{ top: 0, bottom: 0, left: '63%', width: 3 }} />

            {lassoOn && !isBaseline && (
              <div
                className="lasso-poly"
                style={{
                  left: `${LASSO.left}%`,
                  top: `${LASSO.top}%`,
                  width: `${LASSO.width}%`,
                  height: `${LASSO.height}%`,
                }}
              />
            )}

            <span className="map-depot" style={{ left: '30%', top: '36%' }}>
              Depot · BR North
            </span>

            {visiblePins.map((p) => {
              const selected = lassoOn && !isBaseline && inLasso(p)
              return (
                <span
                  key={p.id}
                  className={`map-pin${p.customerId ? '' : ' context'}${
                    selected ? ' sel-pin' : ''
                  }`}
                  style={{ left: `${p.mx}%`, top: `${p.my}%`, background: colorFor(p) }}
                  title={
                    p.customerId
                      ? `${p.customerId} · Route ${p.route}`
                      : `Route ${p.route} · ~${Math.round(MAP_PIN_SCALE)} customers`
                  }
                />
              )
            })}

            {/* Territory labels for the confirmed Territory View. */}
            {view === 'Territory' && (
              <>
                <span
                  className="pill"
                  style={{ position: 'absolute', left: '11%', top: '13%', zIndex: 4 }}
                >
                  Territory <strong>970</strong>
                </span>
                <span
                  className="pill"
                  style={{ position: 'absolute', left: '25%', top: '60%', zIndex: 4 }}
                >
                  Territory <strong>971</strong>
                </span>
                <span
                  className="pill"
                  style={{ position: 'absolute', left: '58%', top: '22%', zIndex: 4 }}
                >
                  Territory <strong>974</strong>
                </span>
              </>
            )}

            <div className="map-legend">
              <span className="legend-item">
                <span className="legend-swatch" style={{ background: '#1a1a1a' }} />
                Depot
              </span>
              <span className="legend-item">
                <span
                  className="legend-swatch"
                  style={{ background: '#fff', boxShadow: '0 0 0 2px var(--accent)' }}
                />
                In lasso
              </span>
              <span className="legend-item t-ter">Planning view · no live vehicles</span>
            </div>
            <div className="map-scale">2 mi</div>
          </div>
        </div>

        {/* Right selection panel ------------------------------------------ */}
        <div className="map-panel">
          <div className="map-panel-head">
            {selectedPins.length ? 'Selected Customers' : 'Map Selection'}
          </div>
          <div className="map-panel-body">
            {isBaseline ? (
              <div className="stack-3">
                <div className="row tight">
                  <LockIcon size={14} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="t-med t-sm">Baseline is read-only</span>
                </div>
                <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
                  The baseline can’t be edited. Save as a new option to move customers. Polygon
                  drawing is disabled while the baseline is active.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  block
                  icon={<PlusIcon size={13} />}
                  onClick={() => {
                    const created = addOption()
                    pushToast({ tone: 'success', title: `${created.name} created` })
                  }}
                >
                  Save As New Option
                </Button>
                <button
                  className="link-btn plain t-xs"
                  onClick={() => setActiveVersionId('option-1')}
                >
                  Switch to Option 1
                </button>
              </div>
            ) : !selectedPins.length ? (
              <div className="stack-3">
                <div className="row tight">
                  <TargetIcon size={14} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="t-med t-sm">Nothing selected</span>
                </div>
                <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
                  Use the Lasso tool to select customers on the map.
                </p>
                <div className="callout t-xs">{COPY.lasso}</div>
              </div>
            ) : (
              <div className="stack-4">
                <div>
                  <div className="stat-value" style={{ fontSize: 24, marginTop: 0 }}>
                    {selectedCustomers}
                  </div>
                  <div className="t-xs t-sec">customers selected</div>
                </div>

                <div>
                  <div className="strip-label" style={{ marginBottom: 6 }}>
                    Breakdown
                  </div>
                  <DL>
                    <DLRow k={`Route ${LASSO_SELECTION.route}`} v={String(selectedCustomers)} />
                    <DLRow k="Tuesday" v={String(selectedCustomers)} />
                    <DLRow k={`Week ${LASSO_SELECTION.week}`} v={String(selectedCustomers)} />
                  </DL>
                </div>

                {/* Destination depends on the active view. */}
                {(view === 'Territory' || view === 'Route') && (
                  <div className="field">
                    <label className="field-label">
                      {view === 'Territory' ? 'Move to territory / route' : 'Move to route'}
                    </label>
                    <Select
                      value={destRoute}
                      onChange={setDestRoute}
                      options={ROUTE_IDS.filter((r) => r !== LASSO_SELECTION.route)}
                    />
                    <span className="field-help">{COPY.territoryView}</span>
                  </div>
                )}

                {view === 'Day' && (
                  <div className="field">
                    <label className="field-label">Move to delivery day</label>
                    <Select
                      value={destDay}
                      onChange={(v) => setDestDay(v as Weekday)}
                      options={[...SCHEDULABLE_DAYS]}
                      placeholder="Select a day"
                    />
                    <span className="field-help">{WEEKEND_COPY.helper}</span>
                  </div>
                )}

                {view === 'Week' && (
                  <div className="field">
                    <label className="field-label">Move to cycle week</label>
                    <Select
                      value={destWeek === '' ? '' : String(destWeek)}
                      onChange={(v) => setDestWeek(v === '' ? '' : Number(v))}
                      options={validWeeks(SESSION.cycleWeeks).map(String)}
                      placeholder="Select a week"
                    />
                    <span className="field-help">
                      {SESSION.cycleWeeks === 8
                        ? 'Weeks pair as 1+5, 2+6, 3+7 and 4+8.'
                        : 'A 4-week cycle offers Weeks 1–4 only.'}
                    </span>
                  </div>
                )}

                <Button
                  variant="primary"
                  block
                  disabled={!canMove}
                  onClick={() => setReviewOpen(true)}
                >
                  Move selected customers
                </Button>
                <button
                  className="link-btn plain t-xs"
                  onClick={() => setLassoOn(false)}
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flexible move review — the move is always allowed ---------------- */}
      {reviewOpen && (
        <Modal
          size="lg"
          title="Move selected customers"
          sub={`${moveTotal} selected customers will be moved to ${destinationLabel}.`}
          mark={
            <span
              className="modal-warn-mark"
              style={
                warnings.length
                  ? undefined
                  : {
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      borderColor: 'var(--success-border)',
                    }
              }
            >
              {warnings.length ? <WarningIcon size={17} /> : <RouteIcon size={17} />}
            </span>
          }
          onClose={() => setReviewOpen(false)}
          footer={
            applying ? (
              <Button variant="primary" disabled>
                Moving…
              </Button>
            ) : (
              <>
                {/* Primary action is ALWAYS allowed. */}
                <Button variant="primary" onClick={applyMove}>
                  Apply Move
                </Button>
                {warnings.length > 0 && (
                  <Button onClick={() => setReviewingWarnings((v) => !v)}>
                    {reviewingWarnings ? 'Hide Warnings' : 'Apply and Review Warnings'}
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setReviewOpen(false)}>
                  Cancel
                </Button>
              </>
            )
          }
        >
          {applying ? (
            <div>
              <ProgressBar pct={pct} />
              <div style={{ marginTop: 'var(--s4)' }}>
                <StepList
                  steps={[
                    { label: 'Updating assignments…', state: pct > 30 ? 'done' : 'active' },
                    {
                      label: 'Recalculating route metrics…',
                      state: pct > 65 ? 'done' : pct > 30 ? 'active' : 'todo',
                    },
                    {
                      label: 'Refreshing route summary…',
                      state: pct >= 100 ? 'done' : pct > 65 ? 'active' : 'todo',
                    },
                  ]}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="row" style={{ gap: 'var(--s2)' }}>
                <CountCard label="Selected customers" value={moveTotal} tone="valid" />
                <CountCard
                  label="Warnings"
                  value={warnings.length}
                  tone={warnings.length ? 'warning' : 'default'}
                />
              </div>

              <div className="zone" style={{ marginTop: 'var(--s4)' }}>
                <div className="zone-head">
                  <span className="zone-title">Move summary</span>
                  <Badge tone="valid">Allowed</Badge>
                </div>
                <div className="zone-body">
                  <DL>
                    <DLRow k="Selected customers" v={String(moveTotal)} />
                    <DLRow
                      k="Destination route"
                      v={view === 'Territory' || view === 'Route' ? destRoute : 'Unchanged'}
                    />
                    <DLRow
                      k="Day"
                      v={view === 'Day' && destDay ? WEEKDAY_FULL[destDay] : 'Unchanged'}
                    />
                    <DLRow
                      k="Week"
                      v={view === 'Week' && destWeek !== '' ? `Week ${destWeek}` : 'Unchanged'}
                    />
                    <DLRow
                      k="Estimated hours moved"
                      v={fmtMinutes(Math.round(moveTotal * 6.2))}
                    />
                    <DLRow k="Estimated revenue moved" v={fmtMoney(moveTotal * 640)} />
                  </DL>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
                  <div className="table-toolbar">
                    <span className="t-sm t-med">Warnings</span>
                    <span className="spacer" />
                    <span className="t-xs t-ter">
                      Tracked for review · the move still applies
                    </span>
                  </div>
                  <table className="tbl">
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
                        <tr key={w.customerId}>
                          <td className="cell-id">{w.customerId}</td>
                          <td>{w.currentRoute}</td>
                          <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                            {w.warning}
                          </td>
                          <td className="right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                nav('workspace', { drawer: 'customer', id: w.customerId })
                              }
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="table-foot">
                    <span>{COPY.planningFlexibility}</span>
                    <span className="t-xs t-ter">
                      {ROUTE_HOURS_TARGET}h target · warnings only
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
