/**
 * Metrics tab — route load against target, plus the route balancer.
 * Deliberately uses plain bars against a target marker rather than decorative
 * charts. The balancer runs a proposal -> review -> apply flow so nothing
 * changes without the analyst seeing the moves first.
 */
import { useState } from 'react'
import { ROUTES, TARGET_MINUTES, fmtMinutes, fmtMoney, fmtNum } from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  ProgressBar,
  StatusBadge,
  StepList,
  Tooltip,
} from '../../components/ui'
import { ScaleIcon } from '../../components/icons'

type Phase = 'idle' | 'running' | 'proposal'

interface Move {
  customers: number
  from: string
  to: string
  minutes: number
  revenue: number
}

const PROPOSED_MOVES: Move[] = [
  { customers: 18, from: '970', to: '972', minutes: 62, revenue: 11240 },
  { customers: 11, from: '977', to: '976', minutes: 48, revenue: 8130 },
  { customers: 6, from: '970', to: '976', minutes: 21, revenue: 3980 },
]

export function MetricsTab() {
  const { isBaseline, pushToast, setDirty } = useApp()
  const [phase, setPhase] = useState<Phase>('idle')

  const totalRevenue = ROUTES.reduce((n, r) => n + r.revenue, 0)
  const totalCustomers = ROUTES.reduce((n, r) => n + r.customers, 0)
  const overTarget = ROUTES.filter((r) => r.totalMinutes > TARGET_MINUTES)
  const spread =
    Math.max(...ROUTES.map((r) => r.totalMinutes)) -
    Math.min(...ROUTES.map((r) => r.totalMinutes))

  const run = () => {
    setPhase('running')
    window.setTimeout(() => setPhase('proposal'), 1600)
  }

  const applyBalance = () => {
    setDirty(true)
    setPhase('idle')
    pushToast({
      tone: 'success',
      title: '35 customers moved across 3 routes.',
      sub: 'Route spread reduced from 3h 03m to 1h 12m.',
      undoLabel: 'Undo',
      onUndo: () =>
        pushToast({ tone: 'info', title: 'Balancer changes reverted.' }),
    })
  }

  return (
    <div className="stack-4">
      {/* Summary ---------------------------------------------------------- */}
      <div className="grid-4">
        <Metric label="Total customers" value={fmtNum(totalCustomers)} sub="Across 8 routes" />
        <Metric label="Total revenue" value={fmtMoney(totalRevenue)} sub="Session estimate" />
        <Metric
          label="Routes over 45h"
          value={String(overTarget.length)}
          sub={overTarget.map((r) => r.route).join(', ') || 'None'}
          tone={overTarget.length ? 'warning' : 'valid'}
        />
        <Metric
          label="Load spread"
          value={fmtMinutes(spread)}
          sub="Longest minus shortest route"
          tone={spread > 120 ? 'warning' : 'valid'}
        />
      </div>

      {/* Load bars -------------------------------------------------------- */}
      <Card>
        <div className="card-head">
          <div>
            <div className="section-title">Route load against target</div>
            <div className="section-sub">
              Weekly target is {fmtMinutes(TARGET_MINUTES)}. Exceeding it warns, it never blocks planning.
            </div>
          </div>
          <Tooltip
            text={
              isBaseline
                ? "The baseline can’t be edited. Save as a new option to make changes."
                : 'Proposes stop moves to even out route workload'
            }
          >
            <Button
              variant="dark"
              icon={<ScaleIcon size={14} />}
              disabled={isBaseline || phase === 'running'}
              onClick={run}
            >
              {phase === 'running' ? 'Balancing…' : 'Run Balancer'}
            </Button>
          </Tooltip>
        </div>
        <div className="card-body">
          <div className="stack-2">
            {ROUTES.map((r) => {
              const pct = (r.totalMinutes / (TARGET_MINUTES * 1.35)) * 100
              const cls =
                r.status === 'Over 45h' ? 'over' : r.status === 'Underused' ? 'under' : 'ok'
              return (
                <div className="bar-row" key={r.route}>
                  <span className="mono t-med">{r.route}</span>
                  <span className="bar-track">
                    <span className={`bar-fill ${cls}`} style={{ width: `${pct}%` }} />
                    <span
                      className="bar-target"
                      style={{ left: `${(TARGET_MINUTES / (TARGET_MINUTES * 1.35)) * 100}%` }}
                    />
                  </span>
                  <span className="row tight" style={{ justifyContent: 'flex-end' }}>
                    <span className="tnum t-xs">{r.totalHours}</span>
                    <StatusBadge status={r.status} />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Balancer states -------------------------------------------------- */}
      {phase === 'running' && (
        <Card className="card-pad">
          <div className="row tight" style={{ marginBottom: 'var(--s3)' }}>
            <span className="spinner" />
            <span className="t-med t-sm">Running route balancer</span>
          </div>
          <ProgressBar indeterminate />
          <div style={{ marginTop: 'var(--s4)' }}>
            <StepList
              steps={[
                { label: 'Reading route workloads…', state: 'done' },
                { label: 'Finding movable customers near route boundaries…', state: 'active' },
                { label: 'Checking service pattern and week rules…', state: 'todo' },
                { label: 'Building move proposal…', state: 'todo' },
              ]}
            />
          </div>
        </Card>
      )}

      {phase === 'proposal' && (
        <Card>
          <div className="card-head">
            <div>
              <div className="section-title">Balancer proposal</div>
              <div className="section-sub">
                Nothing has been applied yet. Review the moves before committing.
              </div>
            </div>
            <Badge tone="progress">3 moves · 35 customers</Badge>
          </div>
          <div className="card-body">
            <Banner tone="info" title="Every proposed move passes pattern and week validation.">
              Customers that would violate their service pattern were excluded from the proposal.
            </Banner>

            <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="th-num">Customers</th>
                    <th>From Route</th>
                    <th>To Route</th>
                    <th className="th-num">Time Moved</th>
                    <th className="th-num">Revenue Moved</th>
                  </tr>
                </thead>
                <tbody>
                  {PROPOSED_MOVES.map((m, i) => (
                    <tr key={i}>
                      <td className="td-num t-semi">{m.customers}</td>
                      <td className="mono">{m.from}</td>
                      <td className="mono">{m.to}</td>
                      <td className="td-num">{m.minutes} min</td>
                      <td className="td-num">{fmtMoney(m.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid-3" style={{ marginTop: 'var(--s4)' }}>
              <Delta label="Routes over 45h" before="2" after="0" good />
              <Delta label="Load spread" before="3h 03m" after="1h 12m" good />
              <Delta label="Route mismatches" before="38" after="53" good={false} />
            </div>
          </div>
          <div className="card-foot">
            <Button variant="primary" onClick={applyBalance}>
              Apply 3 Moves
            </Button>
            <Button onClick={() => setPhase('idle')}>Discard Proposal</Button>
            <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
              Applying creates a single undoable change in Activity.
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub: string
  tone?: 'warning' | 'valid'
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: 22, marginTop: 8 }}>
        {value}
      </div>
      <div className="row tight" style={{ marginTop: 6 }}>
        {tone ? <Badge tone={tone}>{sub}</Badge> : <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  )
}

function Delta({
  label,
  before,
  after,
  good,
}: {
  label: string
  before: string
  after: string
  good: boolean
}) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div className="row tight" style={{ marginTop: 6 }}>
        <span className="diff-remove">{before}</span>
        <span className="diff-arrow">→</span>
        <span className={good ? 'diff-add' : 'diff-remove'} style={good ? undefined : { textDecoration: 'none' }}>
          {after}
        </span>
      </div>
    </div>
  )
}
