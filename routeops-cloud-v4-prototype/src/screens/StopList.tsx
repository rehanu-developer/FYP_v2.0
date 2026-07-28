/**
 * Stop List export preview.
 * The export unit is a STOP, derived from planning rows. This screen documents
 * the exact output contract and shows the row-model expansion at work.
 */
import { SESSION, buildStopList, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  DL,
  DLRow,
  SectionHead,
  Segmented,
} from '../components/ui'
import { DownloadIcon, LockIcon } from '../components/icons'
import { useState } from 'react'

const COLUMN_CONTRACT = [
  { col: 'STOP_ID', type: 'string', note: 'customerId-week-day, unique per stop' },
  { col: 'CUSTOMER_ID', type: 'string', note: 'Matches Customer Master key' },
  { col: 'ROUTE', type: 'string', note: 'Planned route in the finalized option' },
  { col: 'DELIVERY_DAY', type: 'enum', note: 'Mon–Sun' },
  { col: 'DELIVERY_WEEK', type: 'int', note: '1–8 for an 8-week cycle' },
  { col: 'SEQUENCE', type: 'int', note: 'Stop order within route + day + week' },
  { col: 'SERVICE_TIME_MIN', type: 'int', note: 'From Customer Master' },
  { col: 'TIME_WINDOW', type: 'string', note: 'From Customer Master, blank if unrestricted' },
  { col: 'ADDRESS', type: 'string', note: 'Blank when customer is Not in Master' },
]

export function StopList() {
  const { nav, pushToast } = useApp()
  const stops = buildStopList()
  const [format, setFormat] = useState<'CSV' | 'XLSX'>('CSV')

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Stop List Export</h1>
            <p className="page-sub">
              The final deliverable. One row per stop, ready for the downstream routing and
              dispatch systems.
            </p>
          </div>
          <div className="row tight">
            <Segmented value={format} onChange={setFormat} options={['CSV', 'XLSX'] as const} />
            <Button
              variant="primary"
              icon={<DownloadIcon size={14} />}
              disabled
              onClick={() => pushToast({ tone: 'info', title: 'Export started' })}
            >
              Download {format}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--s5)' }}>
        <Banner
          tone="locked"
          title="Preview only — the option is not finalized"
          action={
            <Button size="sm" onClick={() => nav('workspace')}>
              Open Workspace
            </Button>
          }
        >
          This screen shows the export format and a sample of the rows that would be produced.
          Download is disabled until Option 1 is finalized.
        </Banner>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 'var(--s5)',
          alignItems: 'start',
        }}
      >
        <div>
          <SectionHead
            title="Sample rows"
            sub="Note how one multi-day customer produces several stops — this is the Option B row model flowing through to export."
          />
          <div className="table-wrap">
            <div className="table-scroll tall">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>STOP_ID</th>
                    <th>CUSTOMER_ID</th>
                    <th>ROUTE</th>
                    <th>DELIVERY_DAY</th>
                    <th className="th-num">DELIVERY_WEEK</th>
                    <th className="th-num">SEQUENCE</th>
                    <th className="th-num">SERVICE_TIME_MIN</th>
                    <th>TIME_WINDOW</th>
                    <th>ADDRESS</th>
                  </tr>
                </thead>
                <tbody>
                  {stops.map((s) => (
                    <tr key={s.stopId}>
                      <td className="mono t-xs">{s.stopId}</td>
                      <td className="cell-id">{s.customerId}</td>
                      <td className="mono">{s.route}</td>
                      <td>{s.day}</td>
                      <td className="td-num">{s.week}</td>
                      <td className="td-num td-muted">{s.sequence}</td>
                      <td className="td-num">{s.serviceTime}</td>
                      <td className="td-muted">{s.window}</td>
                      <td
                        className="td-muted"
                        style={{ whiteSpace: 'normal', maxWidth: 220 }}
                      >
                        {s.address === 'Not in Customer Master' ? (
                          <span className="row tight">
                            <Badge tone="notmaster">blank</Badge>
                            <span className="t-xs">Not in Master</span>
                          </span>
                        ) : (
                          s.address
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-foot">
              <span>
                Showing {stops.length} of {fmtNum(SESSION.customers * 5)} estimated stops
              </span>
              <span className="t-xs t-ter">Sample drawn from routes 970 and 971.</span>
            </div>
          </div>
        </div>

        <div className="stack-4">
          <Card>
            <div className="card-head">
              <div className="section-title">Export summary</div>
            </div>
            <div className="card-body">
              <DL>
                <DLRow k="Session" v={SESSION.market} />
                <DLRow k="Option" v="Option 1" />
                <DLRow k="Cycle" v={SESSION.cycle} />
                <DLRow k="Routes" v={String(SESSION.routes)} />
                <DLRow k="Customers" v={fmtNum(SESSION.customers)} />
                <DLRow k="Estimated stops" v={fmtNum(SESSION.customers * 5)} />
                <DLRow k="Format" v={`Stop List ${format}`} />
                <DLRow
                  k="Status"
                  v={
                    <Badge tone="blocked" icon={<LockIcon size={11} />}>
                      Blocked
                    </Badge>
                  }
                />
              </DL>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div className="section-title">Column contract</div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {COLUMN_CONTRACT.map((c) => (
                    <tr key={c.col}>
                      <td>
                        <span className="mono t-xs t-med">{c.col}</span>
                        <div className="t-xs t-ter" style={{ whiteSpace: 'normal', marginTop: 2 }}>
                          {c.note}
                        </div>
                      </td>
                      <td className="td-muted t-xs">{c.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
