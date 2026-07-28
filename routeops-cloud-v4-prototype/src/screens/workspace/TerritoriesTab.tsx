/** Territories tab — route/territory rollup with mismatch pressure. */
import { CUSTOMERS, ROUTES, fmtMoney, fmtNum } from '../../data/mock'
import { Badge, StatusBadge } from '../../components/ui'

export function TerritoriesTab() {
  const rows = ROUTES.map((r) => {
    const sample = CUSTOMERS.filter((c) => c.route === r.route)
    const mismatches = sample.filter((c) => c.routeMismatch === 'Mismatch').length
    const notInMaster = sample.filter((c) => c.masterStatus === 'Not in Master').length
    return { r, sample, mismatches, notInMaster }
  })

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <span className="t-sm t-sec">
          8 territories · one territory maps to one route in this session
        </span>
        <span className="spacer" />
        <span className="t-xs t-ter">
          Territory boundaries are inherited from the baseline snapshot.
        </span>
      </div>

      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Territory</th>
              <th>Mapped Route</th>
              <th>Depot</th>
              <th className="th-num">Customers</th>
              <th className="th-num">Revenue</th>
              <th className="th-num">Rev / Customer</th>
              <th className="th-num">Route Mismatches</th>
              <th className="th-num">Not in Master</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ r, mismatches, notInMaster }) => (
              <tr key={r.route}>
                <td className="t-semi mono">T-{r.route}</td>
                <td className="mono">{r.route}</td>
                <td className="td-muted">BR North</td>
                <td className="td-num">{fmtNum(r.customers)}</td>
                <td className="td-num">{fmtMoney(r.revenue)}</td>
                <td className="td-num">{fmtMoney(Math.round(r.revenue / r.customers))}</td>
                <td className="td-num">
                  {mismatches ? (
                    <Badge tone="mismatch">{mismatches}</Badge>
                  ) : (
                    <span className="t-ter">0</span>
                  )}
                </td>
                <td className="td-num">
                  {notInMaster ? (
                    <Badge tone="notmaster">{notInMaster}</Badge>
                  ) : (
                    <span className="t-ter">0</span>
                  )}
                </td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-foot">
        <span>8 of 8 territories</span>
        <span className="t-xs t-ter">
          Mismatch and master counts are from the representative customer sample.
        </span>
      </div>
    </div>
  )
}
