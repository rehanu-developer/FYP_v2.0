/** Part B — Dashboard. Deliberately minimal: snapshot + entry points only. */
import {
  ACTIVITY,
  DATASETS,
  SESSION,
  fmtMoney,
  fmtNum,
} from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Button,
  Card,
  SectionHead,
  StatCard,
  StatusBadge,
} from '../components/ui'
import {
  ArrowRightIcon,
  CurrencyDollarIcon,
  FileIcon,
  RectangleStackIcon,
  ShareIcon,
  UserGroupIcon,
} from '../components/icons'

export function Dashboard() {
  const { nav } = useApp()

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">RouteOps Cloud</h1>
        <p className="page-sub">
          Plan route cycles, manage sessions, and prepare route data for export.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Active Session"
          value="1"
          sub="Draft planning session in progress"
          icon={<RectangleStackIcon size={15} />}
        />
        <StatCard
          label="Routes"
          value={SESSION.routes}
          sub="Routes in current scenario"
          icon={<ShareIcon size={15} />}
        />
        <StatCard
          label="Customers"
          value={fmtNum(SESSION.customers)}
          sub="Customer rows in active session"
          icon={<UserGroupIcon size={15} />}
        />
        <StatCard
          label="Revenue"
          value={fmtMoney(SESSION.revenue)}
          sub="Estimated session revenue"
          icon={<CurrencyDollarIcon size={15} />}
        />
      </div>

      {/* Active session ---------------------------------------------------- */}
      <Card style={{ marginBottom: 'var(--s6)' }}>
        <div className="card-head">
          <div>
            <div className="section-title">Active Session</div>
            <div className="section-sub">
              The planning workspace you are currently working in.
            </div>
          </div>
          <Badge tone="draft" dot>
            {SESSION.status}
          </Badge>
        </div>
        <div className="card-body">
          <div
            className="row"
            style={{ alignItems: 'flex-start', gap: 'var(--s7)', flexWrap: 'wrap' }}
          >
            <div style={{ flex: '1 1 320px', minWidth: 260 }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {SESSION.name}
              </div>
              <div className="t-sm t-sec" style={{ marginTop: 6 }}>
                {SESSION.market} · Depot {SESSION.depot} · {SESSION.timePeriod}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, auto)',
                gap: 'var(--s6)',
              }}
            >
              <Meta label="Scenario" value={SESSION.scenario} />
              <Meta label="Cycle" value={SESSION.cycle} />
              <Meta label="Status" value={<StatusBadge status={SESSION.status} />} />
              <Meta
                label="Active Option"
                value={<Badge tone="editable">{SESSION.activeOption}</Badge>}
              />
            </div>
          </div>
        </div>
        <div className="card-foot">
          <Button
            variant="primary"
            onClick={() => nav('workspace')}
            iconRight={<ArrowRightIcon size={14} />}
          >
            Open Workspace
          </Button>
          <Button onClick={() => nav('sessions')}>View Session</Button>
          <span className="spacer" />
          <span className="t-xs t-ter">
            Baseline locked · {fmtNum(SESSION.customers)} customer rows snapshotted
          </span>
        </div>
      </Card>

      {/* Uploads + activity ------------------------------------------------ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)',
          gap: 'var(--s5)',
        }}
      >
        <div>
          <SectionHead
            title="Recent Dataset Uploads"
            right={
              <Button size="sm" onClick={() => nav('master-dataset')}>
                View all
              </Button>
            }
          />
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Dataset Name</th>
                  <th>Source</th>
                  <th className="th-num">Rows</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {DATASETS.slice(0, 4).map((d) => (
                  <tr key={d.name}>
                    <td>
                      <span className="row tight">
                        <FileIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
                        <span className="t-med">{d.name}</span>
                      </span>
                    </td>
                    <td className="td-muted">{d.source}</td>
                    <td className="td-num">{fmtNum(d.rows)}</td>
                    <td>
                      <Badge tone={d.status === 'Active' ? 'valid' : 'default'}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="td-muted">{d.uploadedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHead
            title="Recent Activity"
            right={
              <Button size="sm" onClick={() => nav('activity')}>
                View all
              </Button>
            }
          />
          <Card className="card-pad">
            <div className="feed">
              {ACTIVITY.slice(0, 5).map((a) => (
                <div key={a.id} className="feed-item">
                  <div className="feed-text">
                    {a.text}
                    <div className="feed-meta">
                      {a.actor} · {a.scope}
                    </div>
                  </div>
                  <span className="feed-time">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div className="strip-value" style={{ marginTop: 5 }}>
        {value}
      </div>
    </div>
  )
}
