/**
 * Part D — Sessions overview.
 * Landing screen for the Sessions nav item. Create Session is a child route,
 * never the landing screen.
 */
import { useMemo, useState } from 'react'
import { MARKETS, SCENARIOS, SESSIONS, TIME_PERIODS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Button,
  Chip,
  EmptyState,
  Segmented,
  StatCard,
  StatusBadge,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PlusIcon,
  RectangleStackIcon,
  SearchIcon,
  WarningIcon,
} from '../components/icons'

const STATUS_CHIPS = ['All', 'Active', 'Draft', 'Finalized', 'Exported'] as const

export function Sessions() {
  const { nav } = useApp()
  const [view, setView] = useState<'Populated' | 'Empty state'>('Populated')
  const [statusChip, setStatusChip] = useState<(typeof STATUS_CHIPS)[number]>('All')
  const [q, setQ] = useState('')
  const [market, setMarket] = useState('')
  const [cycle, setCycle] = useState('')
  const [scenario, setScenario] = useState('')
  const [period, setPeriod] = useState('')

  const rows = useMemo(() => {
    return SESSIONS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
      if (market && s.market !== market) return false
      if (cycle && s.cycle !== cycle) return false
      if (scenario && s.scenario !== scenario) return false
      if (period && s.timePeriod !== period) return false
      if (statusChip === 'All') return true
      if (statusChip === 'Draft') return s.status === 'Draft'
      if (statusChip === 'Finalized') return s.status === 'Finalized'
      if (statusChip === 'Active') return s.status === 'Draft' || s.status === 'Baseline Created'
      if (statusChip === 'Exported') return false
      return true
    })
  }, [q, market, cycle, scenario, period, statusChip])

  const empty = view === 'Empty state'

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Sessions</h1>
            <p className="page-sub">
              Manage planning workspaces for each market, cycle, scenario, and time period.
            </p>
          </div>
          <div className="row tight">
            <Segmented
              value={view}
              onChange={setView}
              options={['Populated', 'Empty state'] as const}
            />
            <Button onClick={() => nav('workspace')}>Open Latest Session</Button>
            <Button
              variant="primary"
              icon={<PlusIcon size={14} />}
              onClick={() => nav('create-session')}
            >
              Create Session
            </Button>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Active Sessions"
          value={empty ? '0' : '1'}
          sub="Sessions currently being planned"
          icon={<RectangleStackIcon size={15} />}
        />
        <StatCard
          label="Draft"
          value={empty ? '0' : '1'}
          sub="Not yet finalized"
          icon={<RectangleStackIcon size={15} />}
        />
        <StatCard
          label="Finalized"
          value="0"
          sub="Locked and ready to export"
          icon={<CheckCircleIcon size={15} />}
        />
        <StatCard
          label="Needs Review"
          value="0"
          sub="Validation issues to resolve"
          icon={<WarningIcon size={15} />}
        />
      </div>

      {!empty && (
        <>
          {/* Filters ------------------------------------------------------- */}
          <div className="row wrap" style={{ marginBottom: 'var(--s3)' }}>
            <div className="table-search" style={{ width: 230 }}>
              <span className="search-icon">
                <SearchIcon size={14} />
              </span>
              <input
                placeholder="Search sessions"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <FilterSel value={market} onChange={setMarket} label="Market" options={MARKETS} />
            <FilterSel value={cycle} onChange={setCycle} label="Cycle" options={['4 Week', '8 Week']} />
            <FilterSel value={scenario} onChange={setScenario} label="Scenario" options={SCENARIOS} />
            <FilterSel
              value={period}
              onChange={setPeriod}
              label="Time Period"
              options={TIME_PERIODS.concat(['July 2026', 'August 2026'])}
            />
            <span className="spacer" />
            <div className="chips">
              {STATUS_CHIPS.map((c) => (
                <Chip key={c} on={statusChip === c} onClick={() => setStatusChip(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          <div className="table-wrap">
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Session Name</th>
                    <th>Market</th>
                    <th>Cycle</th>
                    <th>Scenario</th>
                    <th>Time Period</th>
                    <th>Active Version</th>
                    <th className="th-num">Routes</th>
                    <th className="th-num">Customers</th>
                    <th>Status</th>
                    <th>Last Edited</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr
                      key={s.name}
                      className="clickable"
                      onClick={() => nav('workspace')}
                    >
                      <td className="t-med" style={{ maxWidth: 320, whiteSpace: 'normal' }}>
                        {s.name}
                      </td>
                      <td className="td-muted">{s.market}</td>
                      <td className="td-muted">{s.cycle}</td>
                      <td className="td-muted">{s.scenario}</td>
                      <td className="td-muted">{s.timePeriod}</td>
                      <td>
                        <Badge
                          tone={
                            s.activeVersion === 'Baseline'
                              ? 'immutable'
                              : s.activeVersion === 'Final Plan'
                                ? 'finalized'
                                : 'editable'
                          }
                        >
                          {s.activeVersion}
                        </Badge>
                      </td>
                      <td className="td-num">{s.routes}</td>
                      <td className="td-num">{fmtNum(s.customers)}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="td-muted">{s.lastEdited}</td>
                      <td className="right">
                        <Button
                          size="sm"
                          variant="ghost"
                          iconRight={<ArrowRightIcon size={13} />}
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan={11}>
                        <div className="center t-sec" style={{ padding: 'var(--s7) 0' }}>
                          No sessions match the current filters.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-foot">
              <span>
                Showing {rows.length} of {SESSIONS.length} sessions
              </span>
              <span className="t-xs t-ter">
                Finalized sessions stay readable but can no longer be edited.
              </span>
            </div>
          </div>
        </>
      )}

      {empty && (
        <div className="table-wrap">
          <EmptyState
            icon={<RectangleStackIcon size={20} />}
            title="No sessions yet"
            sub="Create your first planning session to snapshot the active master dataset and start managing routes for a market, cycle, and planning period."
            actions={
              <Button
                variant="primary"
                icon={<PlusIcon size={14} />}
                onClick={() => nav('create-session')}
              >
                Create Session
              </Button>
            }
          />
        </div>
      )}

    </div>
  )
}

function FilterSel({
  value,
  onChange,
  label,
  options,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  options: string[]
}) {
  const uniq = Array.from(new Set(options))
  return (
    <select
      className={`filter-select${value ? ' active' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      <option value="">{label}</option>
      {uniq.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
