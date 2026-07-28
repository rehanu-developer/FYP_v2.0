/**
 * Part D — Map / Lasso View screen.
 * Part E — Lasso pre-move validation (all valid / some blocked / all blocked).
 * Part F — Read-only baseline map state.
 *
 * A second lens on the same route workspace, used for spatial selection and
 * bulk moves. This is planning only: no live trucks, no moving vehicles, no
 * delivery statuses.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  CUSTOMERS,
  MAP_PINS,
  MAP_PIN_SCALE,
  ROUTE_IDS,
  SERVICE_PATTERNS,
  SESSION,
  WEEKDAYS,
  fmtMinutes,
  fmtMoney,
  fmtNum,
  type MapPin,
} from '../data/mock'
import {
  DAY_COLORS,
  FREQUENCY_COLORS,
  LASSO_ALL_BLOCKED_REASONS,
  LASSO_BLOCKED,
  LASSO_SELECTION,
  MAP_COLOR_MODES,
  MAP_TOOLS,
  MOVE_IMPACT,
  type MapColorMode,
  type MapTool,
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

/** Fixed lasso region in canvas percentages, sized around routes 970/971. */
const LASSO = { left: 9, top: 20, width: 33, height: 44 }

function inLasso(p: { mx: number; my: number }) {
  const cx = LASSO.left + LASSO.width / 2
  const cy = LASSO.top + LASSO.height / 2
  const dx = (p.mx - cx) / (LASSO.width / 2)
  const dy = (p.my - cy) / (LASSO.height / 2)
  return dx * dx + dy * dy <= 1
}

/** Which destination produces which Part E state. */
type MoveState = 'A' | 'B' | 'C'
function moveStateFor(destination: string): MoveState {
  if (destination === '973') return 'C'
  if (destination === '972') return 'B'
  return 'A'
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

  // Deep link support: #/map?version=baseline shows the read-only state (Part F).
  useEffect(() => {
    setActiveVersionId(params.version === 'baseline' ? BASELINE_ID : 'option-1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.version])

  const [tool, setTool] = useState<MapTool | null>(null)
  const [colorMode, setColorMode] = useState<MapColorMode>('Color by Route')
  const [routeFilter, setRouteFilter] = useState('')
  const [dayFilter, setDayFilter] = useState('')
  const [weekFilter, setWeekFilter] = useState('')
  const [patternFilter, setPatternFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [lassoOn, setLassoOn] = useState(false)
  const [destination, setDestination] = useState(LASSO_SELECTION.suggestedDestination)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const [pct, setPct] = useState(0)
  const [highlighted, setHighlighted] = useState<string[]>([])
  const [reviewingBlocked, setReviewingBlocked] = useState(false)

  /* --- pins --------------------------------------------------------------- */

  const visiblePins = useMemo(() => {
    return MAP_PINS.filter((p) => {
      if (routeFilter && p.route !== routeFilter) return false
      const c = p.customerId
        ? CUSTOMERS.find((x) => x.customerId === p.customerId)
        : undefined
      if (dayFilter && (!c || !c.serviceDays.includes(dayFilter as never))) return false
      if (weekFilter && (!c || !c.weeks.includes(Number(weekFilter)))) return false
      if (patternFilter && (!c || c.servicePattern !== patternFilter)) return false
      if (statusFilter && (!c || c.status !== statusFilter)) return false
      return true
    })
  }, [routeFilter, dayFilter, weekFilter, patternFilter, statusFilter])

  const selectedPins = useMemo(
    () => (lassoOn && !isBaseline ? visiblePins.filter(inLasso) : []),
    [lassoOn, visiblePins, isBaseline],
  )

  /** Blocked pins are the ones whose customer has a hard rule problem. */
  const blockedPinIds = useMemo(() => {
    const ids = new Set(LASSO_BLOCKED.map((b) => b.customerId))
    return new Set(
      selectedPins.filter((p) => p.customerId && ids.has(p.customerId)).map((p) => p.id),
    )
  }, [selectedPins])

  function colorFor(p: MapPin) {
    const c = p.customerId ? CUSTOMERS.find((x) => x.customerId === p.customerId) : undefined
    switch (colorMode) {
      case 'Color by Territory':
        return ROUTE_COLORS[p.route] ?? '#6b6b6b'
      case 'Color by Day':
        return DAY_COLORS[c?.serviceDays[0] ?? 'Mon'] ?? '#6b6b6b'
      case 'Color by Frequency':
        return FREQUENCY_COLORS[c?.frequency ?? '—'] ?? '#6b6b6b'
      default:
        return ROUTE_COLORS[p.route] ?? '#6b6b6b'
    }
  }

  /* --- selection copy ----------------------------------------------------- */

  // Selection is reported at session scale, as everywhere else.
  const selectedCustomers = LASSO_SELECTION.customers
  const moveState = moveStateFor(destination)
  const totalForMove = 20 // Part E works in a 20-customer example
  const blockedCount =
    moveState === 'A' ? 0 : moveState === 'B' ? LASSO_BLOCKED.length : totalForMove
  const validCount = totalForMove - blockedCount

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
        title: `${fmtNum(validCount)} customers moved to Route ${destination}.`,
        sub:
          blockedCount > 0
            ? `${blockedCount} blocked customers were not moved.`
            : `Changes applied to ${activeVersion.name}.`,
        undoLabel: 'Undo',
        onUndo: () => pushToast({ tone: 'info', title: 'Bulk move reverted.' }),
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

      {/* Part F — baseline read-only banner -------------------------------- */}
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
            The baseline can’t be edited. Save as a new option to move customers.
          </Banner>
        </div>
      )}

      <div className="map-layout">
        {/* Left controls -------------------------------------------------- */}
        <div className="stack-3">
          <div className="map-panel">
            <div className="map-panel-head">View mode</div>
            <div className="map-panel-body">
              <Select
                value={colorMode}
                onChange={(v) => setColorMode(v as MapColorMode)}
                options={MAP_COLOR_MODES}
              />
              <div className="map-legend-inline" style={{ marginTop: 'var(--s3)' }}>
                {colorMode === 'Color by Day'
                  ? WEEKDAYS.map((d) => (
                      <span className="legend-item" key={d}>
                        <span
                          className="legend-swatch"
                          style={{ background: DAY_COLORS[d] }}
                        />
                        {d}
                      </span>
                    ))
                  : colorMode === 'Color by Frequency'
                    ? Object.keys(FREQUENCY_COLORS)
                        .slice(0, 5)
                        .map((f) => (
                          <span className="legend-item" key={f}>
                            <span
                              className="legend-swatch"
                              style={{ background: FREQUENCY_COLORS[f] }}
                            />
                            {f}
                          </span>
                        ))
                    : ROUTE_IDS.map((r) => (
                        <span className="legend-item" key={r}>
                          <span
                            className="legend-swatch"
                            style={{ background: ROUTE_COLORS[r] }}
                          />
                          {colorMode === 'Color by Territory' ? `T-${r}` : r}
                        </span>
                      ))}
              </div>
            </div>
          </div>

          <div className="map-panel">
            <div className="map-panel-head">Filters</div>
            <div className="map-panel-body stack-2">
              <Select value={routeFilter} onChange={setRouteFilter} options={ROUTE_IDS} placeholder="Route" />
              <Select value={dayFilter} onChange={setDayFilter} options={[...WEEKDAYS]} placeholder="Day" />
              <Select
                value={weekFilter}
                onChange={setWeekFilter}
                options={Array.from({ length: SESSION.cycleWeeks }, (_, i) => String(i + 1))}
                placeholder="Week"
              />
              <Select
                value={patternFilter}
                onChange={setPatternFilter}
                options={Object.keys(SERVICE_PATTERNS)}
                placeholder="Service Pattern"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={['Valid', 'Warning', 'Blocked']}
                placeholder="Status"
              />
              {(routeFilter || dayFilter || weekFilter || patternFilter || statusFilter) && (
                <button
                  className="link-btn plain t-xs"
                  onClick={() => {
                    setRouteFilter('')
                    setDayFilter('')
                    setWeekFilter('')
                    setPatternFilter('')
                    setStatusFilter('')
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
              {MAP_TOOLS.map((t) => {
                const isLasso = t === 'Lasso'
                const disabled = isLasso && isBaseline
                const btn = (
                  <button
                    key={t}
                    className={`map-tool${tool === t ? ' on' : ''}${
                      isLasso ? ' primary' : ''
                    }`}
                    disabled={disabled}
                    onClick={() => {
                      setTool(t)
                      if (isLasso) {
                        setLassoOn((v) => !v)
                        setReviewingBlocked(false)
                      }
                    }}
                  >
                    {isLasso ? <LassoIcon size={14} /> : <TargetIcon size={14} />}
                    {t}
                    {isLasso && !isBaseline && (
                      <span className="t-xs" style={{ marginLeft: 'auto', opacity: 0.7 }}>
                        {lassoOn ? 'on' : ''}
                      </span>
                    )}
                    {disabled && (
                      <LockIcon size={12} style={{ marginLeft: 'auto', flex: '0 0 auto' }} />
                    )}
                  </button>
                )
                return disabled ? (
                  <Tooltip
                    key={t}
                    text="The baseline can’t be edited. Save as a new option to move customers."
                  >
                    {btn}
                  </Tooltip>
                ) : (
                  btn
                )
              })}
            </div>
          </div>
        </div>

        {/* Canvas --------------------------------------------------------- */}
        <div>
          <div className={`map-canvas-lg${isBaseline ? ' locked' : ''}`}>
            {/* Road hints so this reads as a map, not a scatter plot. */}
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
              const blocked = selected && blockedPinIds.has(p.id)
              return (
                <span
                  key={p.id}
                  className={`map-pin${p.customerId ? '' : ' context'}${
                    selected ? (blocked ? ' blocked-pin' : ' sel-pin') : ''
                  }`}
                  style={{
                    left: `${p.mx}%`,
                    top: `${p.my}%`,
                    background: colorFor(p),
                  }}
                  title={
                    p.customerId
                      ? `${p.customerId} · Route ${p.route}`
                      : `Route ${p.route} · ~${Math.round(MAP_PIN_SCALE)} customers`
                  }
                />
              )
            })}

            {/* Route labels near each other, as specified. */}
            <span
              className="pill"
              style={{ position: 'absolute', left: '11%', top: '13%', zIndex: 4 }}
            >
              Route <strong>970</strong>
            </span>
            <span
              className="pill"
              style={{ position: 'absolute', left: '25%', top: '60%', zIndex: 4 }}
            >
              Route <strong>971</strong>
            </span>

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
              <span className="legend-item">
                <span
                  className="legend-swatch"
                  style={{ background: '#fff', boxShadow: '0 0 0 2px var(--error)' }}
                />
                Blocked
              </span>
              <span className="legend-item t-ter">Planning view · no live vehicles</span>
            </div>
            <div className="map-scale">2 mi</div>
          </div>
        </div>

        {/* Right selection panel ------------------------------------------ */}
        <div className="map-panel">
          <div className="map-panel-head">
            {selectedPins.length ? 'Lasso Selection' : 'Map Selection'}
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

                <div className="callout t-xs">
                  <strong style={{ color: 'var(--text)' }}>Suggested action:</strong> move
                  selected customers to Route {LASSO_SELECTION.suggestedDestination}.
                </div>

                <div className="field">
                  <label className="field-label">Destination route</label>
                  <Select
                    value={destination}
                    onChange={setDestination}
                    options={ROUTE_IDS.filter((r) => r !== LASSO_SELECTION.route)}
                  />
                  <span className="field-help">
                    971 is all valid · 972 has blocked rows · 973 is fully blocked.
                  </span>
                </div>

                <Button variant="primary" block onClick={() => setReviewOpen(true)}>
                  Validate Move
                </Button>
                <button
                  className="link-btn plain t-xs"
                  onClick={() => {
                    setLassoOn(false)
                    setTool(null)
                  }}
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part E — pre-move validation ------------------------------------- */}
      {reviewOpen && (
        <Modal
          size="lg"
          title={
            moveState === 'A'
              ? 'Confirm bulk move'
              : moveState === 'B'
                ? 'Review bulk move'
                : 'Move blocked'
          }
          sub={
            moveState === 'A'
              ? `All ${totalForMove} selected customers can be moved to Route ${destination}.`
              : moveState === 'B'
                ? `${validCount} customers can be moved. ${blockedCount} customers are blocked by planning rules.`
                : `None of the ${totalForMove} selected customers can be moved to Route ${destination}.`
          }
          mark={
            <span
              className={moveState === 'C' ? 'modal-danger-mark' : 'modal-warn-mark'}
              style={
                moveState === 'A'
                  ? {
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      borderColor: 'var(--success-border)',
                    }
                  : undefined
              }
            >
              {moveState === 'A' ? <RouteIcon size={17} /> : <WarningIcon size={17} />}
            </span>
          }
          onClose={() => setReviewOpen(false)}
          footer={
            applying ? (
              <Button variant="primary" disabled>
                Moving…
              </Button>
            ) : moveState === 'A' ? (
              <>
                <Button variant="primary" onClick={applyMove}>
                  Move {totalForMove} customers
                </Button>
                <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
              </>
            ) : moveState === 'B' ? (
              <>
                <Button variant="primary" onClick={applyMove}>
                  Proceed with {validCount} valid customers
                </Button>
                <Button onClick={() => setReviewingBlocked((v) => !v)}>
                  {reviewingBlocked ? 'Hide blocked customers' : 'Review blocked customers'}
                </Button>
                <Button variant="ghost" onClick={() => setReviewOpen(false)}>
                  Cancel move
                </Button>
              </>
            ) : (
              // State C — no proceed button.
              <>
                <Button variant="secondary" onClick={() => setReviewingBlocked((v) => !v)}>
                  {reviewingBlocked ? 'Hide blocked customers' : 'Review blocked customers'}
                </Button>
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
                    { label: 'Updating route assignments…', state: pct > 30 ? 'done' : 'active' },
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
                <CountCard
                  label="Valid"
                  value={validCount}
                  tone={validCount ? 'valid' : 'default'}
                />
                <CountCard
                  label="Blocked"
                  value={blockedCount}
                  tone={blockedCount ? 'blocked' : 'default'}
                />
              </div>

              {/* Before / after --------------------------------------- */}
              {moveState !== 'C' && (
                <div className="zone" style={{ marginTop: 'var(--s4)' }}>
                  <div className="zone-head">
                    <span className="zone-title">Before and after</span>
                    <Badge tone="valid">Constraint status: Passed</Badge>
                  </div>
                  <div className="zone-body">
                    <DL>
                      <DLRow k="Source route" v={MOVE_IMPACT.sourceRoute} />
                      <DLRow k="Destination route" v={destination} />
                      <DLRow
                        k="Estimated hours impact"
                        v={`${MOVE_IMPACT.hoursBefore} → ${MOVE_IMPACT.hoursAfter} on route ${MOVE_IMPACT.sourceRoute}`}
                      />
                      <DLRow
                        k="Estimated revenue impact"
                        v={`${fmtMoney(MOVE_IMPACT.revenueBefore)} → ${fmtMoney(
                          MOVE_IMPACT.revenueAfter,
                        )}`}
                      />
                      <DLRow
                        k="Time moved"
                        v={fmtMinutes(Math.round(validCount * 2.1))}
                      />
                    </DL>
                  </div>
                </div>
              )}

              {/* State C reason rollup -------------------------------- */}
              {moveState === 'C' && (
                <div style={{ marginTop: 'var(--s4)' }}>
                  <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
                    Reason summary
                  </div>
                  <div className="row" style={{ gap: 'var(--s2)' }}>
                    {LASSO_ALL_BLOCKED_REASONS.map((r) => (
                      <CountCard
                        key={r.label}
                        label={r.label}
                        value={r.count}
                        tone="blocked"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Blocked list ---------------------------------------- */}
              {(moveState === 'B' || moveState === 'C') && reviewingBlocked && (
                <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Customer ID</th>
                        <th>Current Route</th>
                        <th style={{ minWidth: 260 }}>Reason</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {LASSO_BLOCKED.map((b) => (
                        <tr
                          key={b.customerId}
                          className={
                            highlighted.includes(b.customerId) ? 'highlighted' : undefined
                          }
                        >
                          <td className="cell-id">{b.customerId}</td>
                          <td>{b.currentRoute}</td>
                          <td className="td-muted" style={{ whiteSpace: 'normal' }}>
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
                  <div className="table-foot">
                    <span>Blocked customers will not move.</span>
                    <span className="t-xs t-ter">
                      Showing {LASSO_BLOCKED.length} of {blockedCount}
                    </span>
                  </div>
                </div>
              )}

              {moveState === 'B' && !reviewingBlocked && (
                <div className="t-xs t-ter" style={{ marginTop: 'var(--s3)' }}>
                  Blocked customers will not move.
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
