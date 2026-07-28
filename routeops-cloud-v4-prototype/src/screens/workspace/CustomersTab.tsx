/**
 * Part G / H — Customers grid.
 *
 * Primary working model is Option B: one row per customer per service day,
 * rendered as a grouped table so repeated customer records never read as
 * duplicates. Option A (one row per customer) can be previewed from the
 * Row Model Decision screen.
 *
 * Selection is tracked at CUSTOMER level (see README assumptions): the group
 * header checkbox owns selection and child service-day rows follow it, which
 * keeps the bulk-action scope language unambiguous.
 */
import { useMemo, useState } from 'react'
import {
  CUSTOMERS,
  ROUTE_IDS,
  SERVICE_PATTERNS,
  SESSION,
  WEEKDAYS,
  fmtMoney,
  fmtNum,
  type CustomerRecord,
} from '../../data/mock'
import { MANUAL_SELECT_LIMIT, useApp } from '../../state/AppState'
import { Badge, Button, Dash, DayPips, Segmented, Tooltip } from '../../components/ui'
import {
  ChevronRightIcon,
  ColumnsIcon,
  DensityIcon,
  LockIcon,
  SearchIcon,
} from '../../components/icons'

/* --- Optional columns ---------------------------------------------------- */

const OPTIONAL_COLUMNS = {
  totalUnits: 'Total Units',
  totalVolume: 'Total Volume',
  currTerritory: 'Curr Territory',
  prevTerritory: 'Prev Territory',
  salesGroup: 'Sales Group',
  stationCount: 'Station Count',
  rentalEquipmentCount: 'Rental Equipment Count',
  lastInvoiceDate: 'Last Invoice Date',
  serviceTime: 'Service Time',
  timeWindow: 'Time Window',
} as const

type OptionalKey = keyof typeof OPTIONAL_COLUMNS

export function CustomersTab({
  onOpenCustomer,
}: {
  onOpenCustomer: (id: string) => void
}) {
  const {
    isBaseline,
    rowModel,
    selection,
    toggleId,
    selectAllMatching,
    clearSelection,
    setSelection,
    density,
    setDensity,
  } = useApp()

  const [q, setQ] = useState('')
  const [route, setRoute] = useState('')
  const [day, setDay] = useState('')
  const [week, setWeek] = useState('')
  const [pattern, setPattern] = useState('')
  const [status, setStatus] = useState('')
  const [visible, setVisible] = useState<OptionalKey[]>([])
  const [colsOpen, setColsOpen] = useState(false)
  const [densityOpen, setDensityOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<string[]>([])

  const filtered = useMemo(() => {
    return CUSTOMERS.filter((c) => {
      if (q && !c.customerId.includes(q.trim()) && !c.name.toLowerCase().includes(q.toLowerCase()))
        return false
      if (route && c.route !== route) return false
      if (day && !c.serviceDays.includes(day as never)) return false
      if (week && !c.weeks.includes(Number(week))) return false
      if (pattern && c.servicePattern !== pattern) return false
      if (status && c.status !== status) return false
      return true
    })
  }, [q, route, day, week, pattern, status])

  const activeFilterLabel = useMemo(() => {
    const parts: string[] = []
    if (route) parts.push(`Route ${route}`)
    if (day) parts.push(day)
    if (week) parts.push(`Wk ${week}`)
    if (pattern) parts.push(pattern)
    if (status) parts.push(status)
    if (q) parts.push(`"${q}"`)
    return parts.length ? parts.join(' · ') : 'all customers'
  }, [route, day, week, pattern, status, q])

  /**
   * The prototype renders 26 representative customers but the session holds
   * 1,300. "Select all matching" therefore reports the full session-scale
   * count so the bulk-action language matches the real product.
   */
  const matchingCount = route ? Math.round(SESSION.customers / 8) * 1 : SESSION.customers
  const scaledMatching = route ? 180 : SESSION.customers

  const isSelected = (id: string) =>
    selection.mode === 'matching' || selection.ids.includes(id)

  const allOnScreenSelected =
    filtered.length > 0 && filtered.every((c) => selection.ids.includes(c.customerId))

  const toggleAllOnScreen = () => {
    if (allOnScreenSelected) clearSelection()
    else
      setSelection({
        mode: 'manual',
        ids: filtered.map((c) => c.customerId),
        matchingLabel: '',
        matchingCount: 0,
      })
  }

  const selectedRowCount = useMemo(() => {
    if (selection.mode === 'matching') return Math.round(scaledMatching * 5)
    return CUSTOMERS.filter((c) => selection.ids.includes(c.customerId)).reduce(
      (n, c) => n + c.rows.length,
      0,
    )
  }, [selection, scaledMatching])

  const showOpt = (k: OptionalKey) => visible.includes(k)

  const bandCounts = {
    planning: 4,
    imported: 2 + visible.filter((v) => v !== 'serviceTime' && v !== 'timeWindow').length,
    master: 4 + visible.filter((v) => v === 'serviceTime' || v === 'timeWindow').length,
  }

  return (
    <>
      {/* Selection states (Part H) ---------------------------------------- */}
      <SelectionBar
        selectedRowCount={selectedRowCount}
        filterLabel={activeFilterLabel}
        onSelectAllMatching={() =>
          selectAllMatching(activeFilterLabel, route ? scaledMatching : matchingCount)
        }
      />

      <div className="table-wrap">
        {/* Filters ------------------------------------------------------- */}
        <div className="table-toolbar">
          <div className="table-search">
            <span className="search-icon">
              <SearchIcon size={13} />
            </span>
            <input
              placeholder="Search customer ID"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <Sel value={route} onChange={setRoute} label="Route" options={ROUTE_IDS} />
          <Sel value={day} onChange={setDay} label="Day" options={[...WEEKDAYS]} />
          <Sel
            value={week}
            onChange={setWeek}
            label="Week"
            options={Array.from({ length: SESSION.cycleWeeks }, (_, i) => String(i + 1))}
            render={(v) => `Wk ${v}`}
          />
          <Sel
            value={pattern}
            onChange={setPattern}
            label="Pattern"
            options={Object.keys(SERVICE_PATTERNS)}
          />
          <Sel
            value={status}
            onChange={setStatus}
            label="Status"
            options={['Valid', 'Warning', 'Blocked']}
          />

          {(route || day || week || pattern || status || q) && (
            <button
              className="link-btn plain t-sm"
              onClick={() => {
                setRoute('')
                setDay('')
                setWeek('')
                setPattern('')
                setStatus('')
                setQ('')
              }}
            >
              Clear filters
            </button>
          )}

          <span className="spacer" />

          {/* Column visibility ------------------------------------------- */}
          <div className="popover-wrap">
            <Button
              size="sm"
              variant="ghost"
              icon={<ColumnsIcon size={14} />}
              onClick={() => {
                setColsOpen((o) => !o)
                setDensityOpen(false)
              }}
            >
              Columns
              {visible.length > 0 && (
                <span className="t-xs t-ter">+{visible.length}</span>
              )}
            </Button>
            {colsOpen && (
              <div className="popover">
                <div className="popover-title">Imported fields</div>
                {(
                  [
                    'totalUnits',
                    'totalVolume',
                    'currTerritory',
                    'prevTerritory',
                    'salesGroup',
                    'stationCount',
                    'rentalEquipmentCount',
                    'lastInvoiceDate',
                  ] as OptionalKey[]
                ).map((k) => (
                  <ColToggle
                    key={k}
                    k={k}
                    visible={visible}
                    setVisible={setVisible}
                  />
                ))}
                <div className="popover-title">Customer master fields</div>
                {(['serviceTime', 'timeWindow'] as OptionalKey[]).map((k) => (
                  <ColToggle key={k} k={k} visible={visible} setVisible={setVisible} />
                ))}
              </div>
            )}
          </div>

          {/* Density ------------------------------------------------------ */}
          <div className="popover-wrap">
            <Button
              size="sm"
              variant="ghost"
              icon={<DensityIcon size={14} />}
              onClick={() => {
                setDensityOpen((o) => !o)
                setColsOpen(false)
              }}
            >
              Density
            </Button>
            {densityOpen && (
              <div className="popover" style={{ minWidth: 190 }}>
                <div className="popover-title">Row density</div>
                <div style={{ padding: 'var(--s2)' }}>
                  <Segmented
                    value={density}
                    onChange={(d) => {
                      setDensity(d)
                      setDensityOpen(false)
                    }}
                    options={['compact', 'standard', 'comfortable'] as const}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid ---------------------------------------------------------- */}
        <div className={`table-scroll tall${isBaseline ? ' locked-region' : ''}`}>
          <table className="tbl">
            <thead>
              <tr className="group-band">
                <th colSpan={rowModel === 'B' ? 2 : 2} />
                <th className="band" colSpan={bandCounts.planning}>
                  Planning Fields
                </th>
                <th className="band" colSpan={bandCounts.imported}>
                  Imported Fields
                </th>
                <th className="band" colSpan={bandCounts.master}>
                  Customer Master Fields
                </th>
                <th className="band" />
              </tr>
              <tr className="col-head">
                <th style={{ width: 34 }}>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={allOnScreenSelected}
                    disabled={isBaseline}
                    onChange={toggleAllOnScreen}
                    aria-label="Select all rows on screen"
                  />
                </th>
                <th>Customer ID</th>

                <th className="band-start">Route / Territory</th>
                <th>Delivery Day</th>
                <th>Delivery Week</th>
                <th>Service Pattern</th>

                <th className="band-start">Frequency</th>
                <th className="th-num">
                  {rowModel === 'B' ? 'Revenue Alloc.' : 'Total Revenue'}
                </th>
                {showOpt('totalUnits') && <th className="th-num">Total Units</th>}
                {showOpt('totalVolume') && <th className="th-num">Total Volume</th>}
                {showOpt('currTerritory') && <th>Curr Territory</th>}
                {showOpt('prevTerritory') && <th>Prev Territory</th>}
                {showOpt('salesGroup') && <th>Sales Group</th>}
                {showOpt('stationCount') && <th className="th-num">Station Count</th>}
                {showOpt('rentalEquipmentCount') && (
                  <th className="th-num">Rental Equip.</th>
                )}
                {showOpt('lastInvoiceDate') && <th>Last Invoice Date</th>}

                <th className="band-start">Master Status</th>
                <th>Preferred Route</th>
                <th>Route Mismatch</th>
                <th>Address Status</th>
                {showOpt('serviceTime') && <th className="th-num">Service Time</th>}
                {showOpt('timeWindow') && <th>Time Window</th>}

                <th className="band-start">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) =>
                rowModel === 'B' ? (
                  <GroupedCustomer
                    key={c.customerId}
                    c={c}
                    selected={isSelected(c.customerId)}
                    collapsed={collapsed.includes(c.customerId)}
                    onToggleCollapse={() =>
                      setCollapsed((prev) =>
                        prev.includes(c.customerId)
                          ? prev.filter((x) => x !== c.customerId)
                          : [...prev, c.customerId],
                      )
                    }
                    onToggleSelect={() => toggleId(c.customerId)}
                    onOpen={() => onOpenCustomer(c.customerId)}
                    visible={visible}
                    disabled={isBaseline}
                  />
                ) : (
                  <FlatCustomer
                    key={c.customerId}
                    c={c}
                    selected={isSelected(c.customerId)}
                    onToggleSelect={() => toggleId(c.customerId)}
                    onOpen={() => onOpenCustomer(c.customerId)}
                    visible={visible}
                    disabled={isBaseline}
                  />
                ),
              )}
              {!filtered.length && (
                <tr>
                  <td colSpan={30}>
                    <div className="center t-sec" style={{ padding: 'var(--s8) 0' }}>
                      No customer rows match the current filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <span>
            Showing <strong className="tnum">{fmtNum(filtered.length)}</strong> of{' '}
            {fmtNum(CUSTOMERS.length)} representative customers
            {rowModel === 'B' && (
              <>
                {' · '}
                <strong className="tnum">
                  {fmtNum(filtered.reduce((n, c) => n + c.rows.length, 0))}
                </strong>{' '}
                service-day rows
              </>
            )}
          </span>
          <span className="row tight">
            <span className="t-xs t-ter">
              Session scale: {fmtNum(SESSION.customers)} customers ·{' '}
              {fmtNum(SESSION.customers * 5)} planning rows
            </span>
            {isBaseline && (
              <Badge tone="immutable" icon={<LockIcon size={11} />}>
                Read-only
              </Badge>
            )}
          </span>
        </div>
      </div>
    </>
  )
}

/* ==========================================================================
   Selection bar — the four Part H states
   ========================================================================== */

function SelectionBar({
  selectedRowCount,
  filterLabel,
  onSelectAllMatching,
}: {
  selectedRowCount: number
  filterLabel: string
  onSelectAllMatching: () => void
}) {
  const { selection, clearSelection, isBaseline, rowModel } = useApp()

  if (isBaseline || selection.mode === 'none') return null

  const overLimit = selection.mode === 'manual' && selection.ids.length > MANUAL_SELECT_LIMIT

  // State 4 — too many manually selected.
  if (overLimit) {
    return (
      <div className="selection-bar overflow" style={{ marginBottom: 'var(--s3)' }}>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div className="t-semi">Too many individual rows selected</div>
          <div style={{ marginTop: 3, lineHeight: 1.5 }}>
            You can select up to {fmtNum(MANUAL_SELECT_LIMIT)} rows manually. Use Select all
            matching to apply this action to all customers matching your current filters.
          </div>
        </div>
        <Button size="sm" variant="dark" onClick={onSelectAllMatching}>
          Select all matching instead
        </Button>
        <Button size="sm" onClick={clearSelection}>
          Clear Selection
        </Button>
      </div>
    )
  }

  // State 3 — select all matching filters.
  if (selection.mode === 'matching') {
    return (
      <div className="selection-bar matching" style={{ marginBottom: 'var(--s3)' }}>
        <span className="selection-count">
          All {fmtNum(selection.matchingCount)} customers
          {selection.matchingLabel !== 'all customers'
            ? ` matching ${selection.matchingLabel}`
            : ''}{' '}
          selected
        </span>
        <button className="link-btn" onClick={clearSelection}>
          Clear
        </button>
        <span className="spacer" />
        <span className="t-xs" style={{ opacity: 0.7 }}>
          Scope follows the filters, not the visible page.
        </span>
      </div>
    )
  }

  // State 2 — manual selection.
  return (
    <div className="selection-bar manual" style={{ marginBottom: 'var(--s3)' }}>
      <span className="selection-count">{selection.ids.length} selected</span>
      {rowModel === 'B' && (
        <span className="t-xs" style={{ opacity: 0.8 }}>
          {fmtNum(selectedRowCount)} service-day rows
        </span>
      )}
      <span style={{ opacity: 0.75 }}>Only selected rows on screen will be changed.</span>
      <span className="spacer" />
      <Button
        size="sm"
        variant="secondary"
        onClick={onSelectAllMatching}
        title={`Extend this action to every customer matching ${filterLabel}`}
      >
        Select all matching current filters
      </Button>
      <Button size="sm" variant="ghost" onClick={clearSelection}>
        Clear
      </Button>
    </div>
  )
}

/* ==========================================================================
   Option B — grouped customer (header row + service-day child rows)
   ========================================================================== */

function GroupedCustomer({
  c,
  selected,
  collapsed,
  onToggleCollapse,
  onToggleSelect,
  onOpen,
  visible,
  disabled,
}: {
  c: CustomerRecord
  selected: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  onToggleSelect: () => void
  onOpen: () => void
  visible: OptionalKey[]
  disabled: boolean
}) {
  const show = (k: OptionalKey) => visible.includes(k)
  const optionalImported = (
    <>
      {show('totalUnits') && <td className="td-num">{fmtNum(c.totalUnits)}</td>}
      {show('totalVolume') && <td className="td-num">{c.totalVolume.toFixed(2)}</td>}
      {show('currTerritory') && <td>{c.currTerritory}</td>}
      {show('prevTerritory') && <td>{c.prevTerritory}</td>}
      {show('salesGroup') && <td className="td-muted">{c.salesGroup}</td>}
      {show('stationCount') && <td className="td-num">{c.stationCount}</td>}
      {show('rentalEquipmentCount') && <td className="td-num">{c.rentalEquipmentCount}</td>}
      {show('lastInvoiceDate') && <td className="td-muted">{c.lastInvoiceDate}</td>}
    </>
  )

  return (
    <>
      {/* Group header — carries the customer-level facts and the checkbox. */}
      <tr className={`group-row${selected ? ' selected' : ''}`}>
        <td>
          <input
            className="checkbox"
            type="checkbox"
            checked={selected}
            disabled={disabled}
            onChange={onToggleSelect}
            aria-label={`Select customer ${c.customerId}`}
          />
        </td>
        <td>
          <button className="group-toggle" onClick={onToggleCollapse}>
            <span className={`group-caret${collapsed ? '' : ' open'}`}>
              <ChevronRightIcon size={12} />
            </span>
            <span className="cell-id">{c.customerId}</span>
          </button>
          <div className="group-meta" style={{ paddingLeft: 24 }}>
            {c.name} · {c.rows.length} service-day row{c.rows.length === 1 ? '' : 's'}
          </div>
        </td>

        <td className="band-start">{c.route}</td>
        <td>
          <DayPips days={c.serviceDays} />
        </td>
        <td>{c.weeks.map((w) => `Wk ${w}`).join(', ')}</td>
        <td>{c.servicePattern ?? <Dash />}</td>

        <td className="band-start td-muted">{c.frequency}</td>
        <td className="td-num t-semi">{fmtMoney(c.totalRevenue, 2)}</td>
        {optionalImported}

        <td className="band-start">
          <Badge tone={c.masterStatus === 'In Master' ? 'match' : 'notmaster'}>
            {c.masterStatus}
          </Badge>
        </td>
        <td>{c.preferredRoute ?? <Dash />}</td>
        <td>
          {c.routeMismatch ? (
            <Badge tone={c.routeMismatch === 'Match' ? 'match' : 'mismatch'}>
              {c.routeMismatch}
            </Badge>
          ) : (
            <Dash />
          )}
        </td>
        <td>
          <Badge tone={c.addressStatus === 'Available' ? 'default' : 'warning'}>
            {c.addressStatus}
          </Badge>
        </td>
        {show('serviceTime') && (
          <td className="td-num">{c.serviceTimeMin ? `${c.serviceTimeMin} min` : <Dash />}</td>
        )}
        {show('timeWindow') && <td className="td-muted">{c.timeWindow ?? <Dash />}</td>}

        <td className="band-start">
          <span className="row tight">
            {c.statusReason ? (
              <Tooltip text={c.statusReason}>
                <Badge
                  tone={
                    c.status === 'Valid' ? 'valid' : c.status === 'Warning' ? 'warning' : 'blocked'
                  }
                >
                  {c.status}
                </Badge>
              </Tooltip>
            ) : (
              <Badge tone="valid">Valid</Badge>
            )}
            <button className="link-btn plain t-xs" onClick={onOpen}>
              Open
            </button>
          </span>
        </td>
      </tr>

      {/* Service-day child rows — indented behind a rail. */}
      {!collapsed &&
        c.rows.map((r) => (
          <tr
            key={r.id}
            className={`child-row clickable${selected ? ' selected' : ''}`}
            onClick={onOpen}
          >
            <td className="rail" />
            <td className="rail">
              <span className="child-indent">
                <span className="child-dash" />
                <span className="t-xs t-ter">service day</span>
              </span>
            </td>

            <td className="band-start">{r.route}</td>
            <td className="t-med">{r.day}</td>
            <td>Wk {r.week}</td>
            <td className="td-muted">{c.servicePattern ?? <Dash />}</td>

            <td className="band-start td-muted t-xs">per visit</td>
            <td className="td-num">{fmtMoney(r.revenueAllocation, 2)}</td>
            {show('totalUnits') && <td className="td-num td-muted">—</td>}
            {show('totalVolume') && <td className="td-num td-muted">—</td>}
            {show('currTerritory') && <td className="td-muted">—</td>}
            {show('prevTerritory') && <td className="td-muted">—</td>}
            {show('salesGroup') && <td className="td-muted">—</td>}
            {show('stationCount') && <td className="td-num td-muted">—</td>}
            {show('rentalEquipmentCount') && <td className="td-num td-muted">—</td>}
            {show('lastInvoiceDate') && <td className="td-muted">—</td>}

            <td className="band-start td-muted">—</td>
            <td className="td-muted">—</td>
            <td className="td-muted">—</td>
            <td className="td-muted">—</td>
            {show('serviceTime') && <td className="td-num td-muted">—</td>}
            {show('timeWindow') && <td className="td-muted">—</td>}

            <td className="band-start">
              <Badge tone={r.status === 'Valid' ? 'valid' : r.status === 'Warning' ? 'warning' : 'blocked'}>
                {r.status}
              </Badge>
            </td>
          </tr>
        ))}
    </>
  )
}

/* ==========================================================================
   Option A — flat one-row-per-customer
   ========================================================================== */

function FlatCustomer({
  c,
  selected,
  onToggleSelect,
  onOpen,
  visible,
  disabled,
}: {
  c: CustomerRecord
  selected: boolean
  onToggleSelect: () => void
  onOpen: () => void
  visible: OptionalKey[]
  disabled: boolean
}) {
  const show = (k: OptionalKey) => visible.includes(k)
  return (
    <tr className={`clickable${selected ? ' selected' : ''}`} onClick={onOpen}>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          className="checkbox"
          type="checkbox"
          checked={selected}
          disabled={disabled}
          onChange={onToggleSelect}
          aria-label={`Select customer ${c.customerId}`}
        />
      </td>
      <td>
        <span className="cell-id">{c.customerId}</span>
        <div className="group-meta">{c.name}</div>
      </td>

      <td className="band-start">{c.route}</td>
      <td>
        <DayPips days={c.serviceDays} />
      </td>
      <td>{c.weeks.map((w) => `Wk ${w}`).join(', ')}</td>
      <td>{c.servicePattern ?? <Dash />}</td>

      <td className="band-start td-muted">{c.frequency}</td>
      <td className="td-num t-semi">{fmtMoney(c.totalRevenue, 2)}</td>
      {show('totalUnits') && <td className="td-num">{fmtNum(c.totalUnits)}</td>}
      {show('totalVolume') && <td className="td-num">{c.totalVolume.toFixed(2)}</td>}
      {show('currTerritory') && <td>{c.currTerritory}</td>}
      {show('prevTerritory') && <td>{c.prevTerritory}</td>}
      {show('salesGroup') && <td className="td-muted">{c.salesGroup}</td>}
      {show('stationCount') && <td className="td-num">{c.stationCount}</td>}
      {show('rentalEquipmentCount') && <td className="td-num">{c.rentalEquipmentCount}</td>}
      {show('lastInvoiceDate') && <td className="td-muted">{c.lastInvoiceDate}</td>}

      <td className="band-start">
        <Badge tone={c.masterStatus === 'In Master' ? 'match' : 'notmaster'}>
          {c.masterStatus}
        </Badge>
      </td>
      <td>{c.preferredRoute ?? <Dash />}</td>
      <td>
        {c.routeMismatch ? (
          <Badge tone={c.routeMismatch === 'Match' ? 'match' : 'mismatch'}>
            {c.routeMismatch}
          </Badge>
        ) : (
          <Dash />
        )}
      </td>
      <td>
        <Badge tone={c.addressStatus === 'Available' ? 'default' : 'warning'}>
          {c.addressStatus}
        </Badge>
      </td>
      {show('serviceTime') && (
        <td className="td-num">{c.serviceTimeMin ? `${c.serviceTimeMin} min` : <Dash />}</td>
      )}
      {show('timeWindow') && <td className="td-muted">{c.timeWindow ?? <Dash />}</td>}

      <td className="band-start">
        {c.statusReason ? (
          <Tooltip text={c.statusReason}>
            <Badge
              tone={c.status === 'Valid' ? 'valid' : c.status === 'Warning' ? 'warning' : 'blocked'}
            >
              {c.status}
            </Badge>
          </Tooltip>
        ) : (
          <Badge tone="valid">Valid</Badge>
        )}
      </td>
    </tr>
  )
}

/* ==========================================================================
   Small helpers
   ========================================================================== */

function Sel({
  value,
  onChange,
  label,
  options,
  render,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  options: string[]
  render?: (v: string) => string
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
          {render ? render(o) : o}
        </option>
      ))}
    </select>
  )
}

function ColToggle({
  k,
  visible,
  setVisible,
}: {
  k: OptionalKey
  visible: OptionalKey[]
  setVisible: (fn: (prev: OptionalKey[]) => OptionalKey[]) => void
}) {
  return (
    <button
      className="popover-item"
      onClick={() =>
        setVisible((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))
      }
    >
      <input className="checkbox" type="checkbox" checked={visible.includes(k)} readOnly />
      {OPTIONAL_COLUMNS[k]}
    </button>
  )
}
