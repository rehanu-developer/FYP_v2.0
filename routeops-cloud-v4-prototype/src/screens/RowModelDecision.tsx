/**
 * Part F — Row Model Decision.
 * This is a design-decision frame for the client, NOT a production screen.
 * It puts both row models side by side with a worked example, pros, cons and
 * a recommendation.
 */
import { Badge, Banner, Card } from '../components/ui'
import { CheckIcon, MinusCircleIcon, ScaleIcon } from '../components/icons'
import { useApp } from '../state/AppState'

export function RowModelDecision() {
  const { rowModel, setRowModel, pushToast } = useApp()

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <div className="row tight" style={{ marginBottom: 8 }}>
              <Badge tone="info" icon={<ScaleIcon size={12} />}>
                Design decision · not a production screen
              </Badge>
            </div>
            <h1 className="page-title">Row Model Decision</h1>
            <p className="page-sub">
              How should the planning grid represent multi-day customers? This frame exists so
              the team can agree on the row model before the grid is built.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: 'var(--s5)' }}>
        {/* Option A ---------------------------------------------------------- */}
        <Card>
          <div className="card-head">
            <div>
              <div className="row tight">
                <span className="section-title">Option A</span>
                {rowModel === 'A' && <Badge tone="editable">Selected</Badge>}
              </div>
              <div className="section-sub">One row per customer</div>
            </div>
          </div>
          <div className="card-body">
            <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
              A customer appears once. Delivery days are edited as a multi-select chip group.
            </p>

            <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
              <div className="table-scroll">
                <table className="tbl tbl-example">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Route</th>
                      <th>Pattern</th>
                      <th>Delivery Days</th>
                      <th>Week</th>
                      <th className="th-num">Revenue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-id">1000004</td>
                      <td>970</td>
                      <td>E4W</td>
                      <td>Mon Tue Wed Thu Fri</td>
                      <td>Wk 1, Wk 5</td>
                      <td className="td-num">$372.36</td>
                      <td>
                        <Badge tone="valid">Valid</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 'var(--s5)' }}>
              <div>
                <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
                  Pros
                </div>
                <ul className="pc-list">
                  <Pro>Simpler grid</Pro>
                  <Pro>Lower row count</Pro>
                  <Pro>Closer to raw import</Pro>
                </ul>
              </div>
              <div>
                <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
                  Cons
                </div>
                <ul className="pc-list">
                  <Con>Day assignment can be ambiguous for multi-day customers</Con>
                  <Con>Less granular for week-pair balancing</Con>
                  <Con>Harder for optimization</Con>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-foot">
            <button
              className={`chip${rowModel === 'A' ? ' on' : ''}`}
              onClick={() => {
                setRowModel('A')
                pushToast({
                  tone: 'info',
                  title: 'Route Workspace now uses Option A',
                  sub: 'One row per customer. Delivery days edit as a chip group.',
                })
              }}
            >
              Preview Option A in the workspace
            </button>
          </div>
        </Card>

        {/* Option B ---------------------------------------------------------- */}
        <Card style={{ borderColor: 'var(--accent-border)' }}>
          <div className="card-head" style={{ background: 'var(--accent-wash)' }}>
            <div>
              <div className="row tight">
                <span className="section-title">Option B</span>
                <Badge tone="progress">Recommended</Badge>
                {rowModel === 'B' && <Badge tone="editable">Selected</Badge>}
              </div>
              <div className="section-sub">One row per customer per service day</div>
            </div>
          </div>
          <div className="card-body">
            <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
              A Mon–Fri customer becomes five planning rows, one for each service day.
            </p>

            <div className="table-wrap" style={{ marginTop: 'var(--s4)' }}>
              <div className="table-scroll">
                <table className="tbl tbl-example">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Group</th>
                      <th>Route</th>
                      <th>Day</th>
                      <th>Week</th>
                      <th>Pattern</th>
                      <th className="th-num">Rev. Alloc.</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Mon', 'Tue', 'Wed'].map((d, i) => (
                      <tr key={d}>
                        <td className="cell-id">1000004</td>
                        <td className="td-muted t-xs">
                          {i === 0 ? '5 service-day rows' : ''}
                        </td>
                        <td>970</td>
                        <td className="t-med">{d}</td>
                        <td>Wk 1</td>
                        <td>E4W</td>
                        <td className="td-num">$74.47</td>
                        <td>
                          <Badge tone="valid">Valid</Badge>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={8} className="td-muted t-xs center">
                        Thu and Fri rows follow · 5 rows total for this customer
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 'var(--s5)' }}>
              <div>
                <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
                  Pros
                </div>
                <ul className="pc-list">
                  <Pro>Best for day/week balancing</Pro>
                  <Pro>Clearer validation</Pro>
                  <Pro>Better for route optimization</Pro>
                </ul>
              </div>
              <div>
                <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
                  Cons
                </div>
                <ul className="pc-list">
                  <Con>More rows</Con>
                  <Con>Needs grouping</Con>
                  <Con>May look like duplicates if not designed carefully</Con>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-foot" style={{ background: 'var(--accent-wash)' }}>
            <button
              className={`chip${rowModel === 'B' ? ' on' : ''}`}
              onClick={() => {
                setRowModel('B')
                pushToast({
                  tone: 'info',
                  title: 'Route Workspace now uses Option B',
                  sub: 'Grouped service-day rows, one row per customer per service day.',
                })
              }}
            >
              Preview Option B in the workspace
            </button>
          </div>
        </Card>
      </div>

      <div className="spec-note" style={{ marginBottom: 'var(--s5)' }}>
        <span style={{ flex: '0 0 auto', marginTop: 2 }}>
          <ScaleIcon size={15} />
        </span>
        <span>
          <strong>Recommended for balancing: Option B</strong>, if grouped rows are visually
          clear. The workspace in this prototype ships with Option B as the primary working
          model and uses a group header row plus an indent rail so repeated customer records
          never read as duplicates.
        </span>
      </div>

      {/* How Option B avoids looking like duplicates ------------------------ */}
      <Card>
        <div className="card-head">
          <div>
            <div className="section-title">How Option B avoids the duplicate-row problem</div>
            <div className="section-sub">
              The mitigation for Option B’s main risk, as implemented in the Route Workspace.
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid-3">
            <Mitigation
              n="1"
              title="Group header row"
              body="Each customer gets a single shaded header row carrying the customer ID, master status, pattern and total revenue. The service-day rows sit underneath it."
            />
            <Mitigation
              n="2"
              title="Indent rail + row count"
              body="Child rows are indented behind a vertical rail and the header states “5 service-day rows”, so the repetition is explained rather than accidental."
            />
            <Mitigation
              n="3"
              title="Customer ID shown once"
              body="The ID is not repeated on every child row. Child rows lead with the delivery day, which is the value that actually differs."
            />
          </div>
          <div style={{ marginTop: 'var(--s5)' }}>
            <Banner tone="info" title="Open question for the client">
              Revenue allocation across service-day rows is currently an even split
              (total ÷ service days). If Community Coffee allocates revenue by day-of-week
              volume instead, this needs a rule before build. Tracked on the Open Decisions page.
            </Banner>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Pro({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <span className="pc-mark pro">
        <CheckIcon size={13} />
      </span>
      {children}
    </li>
  )
}

function Con({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <span className="pc-mark con">
        <MinusCircleIcon size={13} />
      </span>
      {children}
    </li>
  )
}

function Mitigation({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="row tight" style={{ marginBottom: 6 }}>
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 'var(--r-sm)',
            background: 'var(--accent)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
            fontWeight: 600,
            flex: '0 0 auto',
          }}
        >
          {n}
        </span>
        <span className="t-med t-sm">{title}</span>
      </div>
      <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
        {body}
      </p>
    </div>
  )
}
