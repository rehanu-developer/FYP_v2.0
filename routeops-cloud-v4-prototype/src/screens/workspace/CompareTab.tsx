/**
 * Compare tab — Baseline vs the active option.
 * This is the "review changes" step before finalization.
 */
import { ROUTES, fmtMoney, fmtNum } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { Badge, Card, Segmented } from '../../components/ui'
import { useState } from 'react'

interface ChangedRow {
  customerId: string
  field: string
  from: string
  to: string
  kind: 'day' | 'week' | 'route' | 'pattern'
}

const CHANGED: ChangedRow[] = [
  { customerId: '1000004', field: 'Delivery Week', from: 'Wk 2', to: 'Wk 1', kind: 'week' },
  { customerId: '1000297', field: 'Route / Territory', from: '972', to: '970', kind: 'route' },
  { customerId: '1000341', field: 'Delivery Day', from: 'Tue Thu', to: 'Mon Wed Fri', kind: 'day' },
  { customerId: '1000462', field: 'Service Pattern', from: '1W', to: 'EOW', kind: 'pattern' },
  { customerId: '1000677', field: 'Route / Territory', from: '973', to: '972', kind: 'route' },
  { customerId: '1001027', field: 'Delivery Day', from: 'Tue Thu', to: 'Mon Wed Fri', kind: 'day' },
  { customerId: '1001103', field: 'Delivery Week', from: 'Wk 3', to: 'Wk 1', kind: 'week' },
  { customerId: '1001478', field: 'Route / Territory', from: '975', to: '976', kind: 'route' },
]

const ROUTE_DELTAS = [
  { route: '970', customersBefore: 164, customersAfter: 180, hoursBefore: '8h 22m', hoursAfter: '9h 15m' },
  { route: '972', customersBefore: 158, customersAfter: 142, hoursBefore: '6h 58m', hoursAfter: '6h 12m' },
  { route: '976', customersBefore: 141, customersAfter: 148, hoursBefore: '6h 18m', hoursAfter: '6h 36m' },
]

export function CompareTab() {
  const { activeVersion } = useApp()
  const [scope, setScope] = useState<'Customer rows' | 'Route summary'>('Customer rows')

  return (
    <div className="stack-4">
      <Card>
        <div className="card-head">
          <div>
            <div className="section-title">Baseline vs {activeVersion.name}</div>
            <div className="section-sub">
              Every difference introduced in this option, ready for review before finalization.
            </div>
          </div>
          <Segmented
            value={scope}
            onChange={setScope}
            options={['Customer rows', 'Route summary'] as const}
          />
        </div>
        <div className="card-body">
          <div className="row wrap" style={{ gap: 'var(--s6)' }}>
            <Sum label="Customer rows changed" value="128" tone="editable" />
            <Sum label="Route reassignments" value="47" tone="editable" />
            <Sum label="Day changes" value="63" tone="editable" />
            <Sum label="Week changes" value="18" tone="editable" />
            <Sum label="New mismatches" value="15" tone="warning" />
            <Sum label="Revenue moved" value={fmtMoney(23350)} tone="default" />
          </div>
        </div>
      </Card>

      {scope === 'Customer rows' ? (
        <div className="table-wrap">
          <div className="table-toolbar">
            <span className="t-sm t-sec">
              Showing {CHANGED.length} of 128 changed customer rows
            </span>
            <span className="spacer" />
            <span className="t-xs t-ter">Baseline values are never modified.</span>
          </div>
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Field</th>
                  <th>Baseline</th>
                  <th />
                  <th>{activeVersion.name}</th>
                  <th>Change Type</th>
                </tr>
              </thead>
              <tbody>
                {CHANGED.map((r, i) => (
                  <tr key={i}>
                    <td className="cell-id">{r.customerId}</td>
                    <td className="td-muted">{r.field}</td>
                    <td>
                      <span className="diff-remove">{r.from}</span>
                    </td>
                    <td className="diff-arrow center">→</td>
                    <td>
                      <span className="diff-add">{r.to}</span>
                    </td>
                    <td>
                      <Badge tone="info">{r.kind}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Route</th>
                  <th className="th-num">Customers (Baseline)</th>
                  <th className="th-num">Customers ({activeVersion.name})</th>
                  <th className="th-num">Δ</th>
                  <th className="th-num">Hours (Baseline)</th>
                  <th className="th-num">Hours ({activeVersion.name})</th>
                </tr>
              </thead>
              <tbody>
                {ROUTE_DELTAS.map((d) => {
                  const delta = d.customersAfter - d.customersBefore
                  return (
                    <tr key={d.route}>
                      <td className="mono t-semi">{d.route}</td>
                      <td className="td-num td-muted">{fmtNum(d.customersBefore)}</td>
                      <td className="td-num">{fmtNum(d.customersAfter)}</td>
                      <td className="td-num">
                        <span className={delta > 0 ? 'diff-add' : 'diff-remove'} style={{ textDecoration: 'none' }}>
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      </td>
                      <td className="td-num td-muted">{d.hoursBefore}</td>
                      <td className="td-num">{d.hoursAfter}</td>
                    </tr>
                  )
                })}
                {ROUTES.filter((r) => !ROUTE_DELTAS.some((d) => d.route === r.route)).map((r) => (
                  <tr key={r.route} className="dim">
                    <td className="mono">{r.route}</td>
                    <td className="td-num">{fmtNum(r.customers)}</td>
                    <td className="td-num">{fmtNum(r.customers)}</td>
                    <td className="td-num">—</td>
                    <td className="td-num">{r.totalHours}</td>
                    <td className="td-num">{r.totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <span>5 routes unchanged · 3 routes affected</span>
            <span className="t-xs t-ter">Unchanged routes are dimmed.</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Sum({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'editable' | 'warning' | 'default'
}) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div className="row tight" style={{ marginTop: 6 }}>
        <span style={{ fontSize: 19, fontWeight: 600 }} className="tnum">
          {value}
        </span>
        {tone === 'warning' && <Badge tone="warning">review</Badge>}
      </div>
    </div>
  )
}
