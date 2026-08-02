/** Reference Data — the lookup tables that drive validation. */
import { DEPOTS, ROUTES, SCENARIOS, SERVICE_PATTERNS } from '../data/mock'
import {
  ROUTE_HOURS_TARGET,
  SCHEDULABLE_DAYS as WEEKDAYS,
  WEEKEND_COPY,
  weekPairs,
} from '../data/rules'
import { Badge, Card, SectionHead } from '../components/ui'

export function ReferenceData() {
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Reference Data</h1>
        <p className="page-sub">
          The lookup tables behind every validation rule. Service patterns decide which delivery
          days and cycle weeks a customer is allowed.
        </p>
      </div>

      <SectionHead
        title="Service Patterns"
        sub="A pattern is a predefined code controlling allowed weekdays and frequency. Assignments that violate a pattern are rejected."
      />
      <div className="table-wrap" style={{ marginBottom: 'var(--s6)' }}>
        <div className="table-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Derived Frequency</th>
                <th>Allowed Days</th>
                <th>Allowed Weeks (8-week cycle)</th>
                <th className="th-num">Visits / Cycle</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(SERVICE_PATTERNS).map((p) => (
                <tr key={p.code}>
                  <td className="mono t-semi">{p.code}</td>
                  <td>{p.name}</td>
                  <td className="td-muted">{p.frequency}</td>
                  <td>
                    <span className="day-list">
                      {WEEKDAYS.map((d) => (
                        <span
                          key={d}
                          className={`day-pip${p.allowedDays.includes(d) ? ' on' : ''}`}
                        >
                          {d[0]}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className="row tight">
                      {p.allowedWeeks.map((w) => (
                        <Badge key={w} tone="default">
                          {w}
                        </Badge>
                      ))}
                    </span>
                  </td>
                  <td className="td-num">{p.visitsPerCycle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>{Object.keys(SERVICE_PATTERNS).length} patterns</span>
          <span className="t-xs t-ter">
            {WEEKEND_COPY.helper} Route target is {ROUTE_HOURS_TARGET}h weekly.
          </span>
        </div>
      </div>

      <div className="grid-3" style={{ alignItems: 'start' }}>
        <Card>
          <div className="card-head">
            <div className="section-title">Week Pairs</div>
          </div>
          <div className="card-body">
            <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)', lineHeight: 1.6 }}>
              In 8-week cycles, weeks pair up. A customer served in one week of a pair is served in
              its partner week.
            </p>
            <div className="stack-2">
              {weekPairs(8).map(([a, b], i) => (
                <div className="row" key={i} style={{ justifyContent: 'space-between' }}>
                  <span className="t-sm t-med">Pair {i + 1}</span>
                  <span className="row tight">
                    <Badge tone="editable">Wk {a}</Badge>
                    <span className="t-ter">+</span>
                    <Badge tone="editable">Wk {b}</Badge>
                  </span>
                </div>
              ))}
            </div>
            <div className="t-xs t-ter" style={{ marginTop: 'var(--s4)' }}>
              4-week cycles have no pairs — only Wk 1 to Wk 4 exist.
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <div className="section-title">Routes &amp; Drivers</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Scenario</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r) => (
                  <tr key={r.route}>
                    <td className="mono t-semi">{r.route}</td>
                    <td>{r.driver}</td>
                    <td className="td-muted">{r.scenario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <div className="section-title">Depots &amp; Scenarios</div>
          </div>
          <div className="card-body">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Depots
            </div>
            <div className="row wrap tight" style={{ marginBottom: 'var(--s5)' }}>
              {DEPOTS.map((d) => (
                <Badge key={d} tone={d === 'BR North' ? 'editable' : 'default'}>
                  {d}
                </Badge>
              ))}
            </div>

            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Scenarios
            </div>
            <div className="row wrap tight" style={{ marginBottom: 'var(--s5)' }}>
              {SCENARIOS.map((s) => (
                <Badge key={s} tone={s === 'Delivery' ? 'editable' : 'default'}>
                  {s}
                </Badge>
              ))}
            </div>

            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Helper rule
            </div>
            <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
              Helpers can be selected or deselected on <strong>any</strong> route, across
              baseline, presell and delivery routing scenarios. The old presale-only restriction
              is retired.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
