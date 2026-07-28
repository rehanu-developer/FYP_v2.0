/**
 * Part M — Export guard and Stop List export.
 *
 * Four documented states:
 *   Not finalized  -> export disabled, tooltip explains why
 *   Missing fields -> generation blocked, 12 rows reviewable
 *   Ready          -> Preview / Generate enabled
 *   Complete       -> download, handoff link, export history
 */
import { useState } from 'react'
import { SESSION, buildStopList, fmtNum } from '../data/mock'
import { EXPORT_FILE_NAME, EXPORT_MISSING_FIELDS } from '../data/prompt2'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  CountCard,
  DL,
  DLRow,
  Modal,
  ProgressBar,
  Segmented,
  Tooltip,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  ExternalIcon,
  EyeIcon,
  FileIcon,
  LockIcon,
  WarningIcon,
} from '../components/icons'

type ExportState = 'Not finalized' | 'Missing fields' | 'Ready' | 'Complete'
const STATES: ExportState[] = ['Not finalized', 'Missing fields', 'Ready', 'Complete']

const MISSING_ROWS = [
  { customerId: '1000812', route: '970', missing: 'Service pattern' },
  { customerId: '1001536', route: '976', missing: 'Delivery day' },
  { customerId: '1000108', route: '971', missing: 'Address, service time' },
  { customerId: '1000934', route: '974', missing: 'Address, service time' },
]

export function StopList() {
  const { nav, pushToast, activeVersion } = useApp()
  const [state, setState] = useState<ExportState>('Not finalized')
  const [format, setFormat] = useState<'XLSX' | 'CSV'>('XLSX')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [pct, setPct] = useState(0)

  const stops = buildStopList()
  const canExport = state === 'Ready' || state === 'Complete'

  const generate = () => {
    setGenerating(true)
    setPct(0)
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 11)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      setGenerating(false)
      setState('Complete')
      pushToast({ tone: 'success', title: 'Stop List generated successfully.' })
    }, 160)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Stop List Export</h1>
            <p className="page-sub">
              Generate the finalized Stop List from {activeVersion.name}.
            </p>
          </div>
          <div className="row tight">
            <span className="t-xs t-ter nowrap">Export state</span>
            <Segmented value={state} onChange={setState} options={STATES} />
          </div>
        </div>
      </div>

      {/* Guard / status banner --------------------------------------------- */}
      <div style={{ marginBottom: 'var(--s5)' }}>
        {state === 'Not finalized' && (
          <Banner
            tone="locked"
            title="Finalize an option before exporting the Stop List"
            action={
              <Button size="sm" onClick={() => nav('finalize')} iconRight={<ArrowRightIcon size={13} />}>
                Go to Finalize
              </Button>
            }
          >
            {activeVersion.name} is still a draft. Exports require a finalized plan of record so
            downstream systems can always be traced back to one immutable version.
          </Banner>
        )}
        {state === 'Missing fields' && (
          <Banner
            tone="error"
            title="Stop List can’t be generated yet."
            action={
              <Button size="sm" variant="secondary" onClick={() => setReviewOpen(true)}>
                Review missing fields
              </Button>
            }
          >
            {EXPORT_MISSING_FIELDS.detail} Every stop needs a route, delivery day, delivery week
            and service pattern to be exportable.
          </Banner>
        )}
        {state === 'Ready' && (
          <Banner tone="success" title="Option 1 is finalized and ready to export">
            All {fmtNum(SESSION.customers)} customers have the required fields.{' '}
            {fmtNum(SESSION.customers * 5)} stops will be generated.
          </Banner>
        )}
        {state === 'Complete' && (
          <Banner tone="success" title="Stop List generated successfully.">
            {EXPORT_FILE_NAME} · {fmtNum(SESSION.customers * 5)} stops · generated just now.
          </Banner>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)',
          gap: 'var(--s5)',
          alignItems: 'start',
        }}
      >
        <div className="stack-4">
          {/* Summary ---------------------------------------------------- */}
          <Card>
            <div className="card-head">
              <div className="section-title">Export summary</div>
              <Badge
                tone={
                  state === 'Complete'
                    ? 'finalized'
                    : state === 'Ready'
                      ? 'valid'
                      : state === 'Missing fields'
                        ? 'blocked'
                        : 'draft'
                }
              >
                {state}
              </Badge>
            </div>
            <div className="card-body">
              <DL>
                <DLRow k="Session" v="Delivery Scenario as of 07/23/2026" />
                <DLRow k="Active Version" v={activeVersion.name} />
                <DLRow k="Routes" v={String(SESSION.routes)} />
                <DLRow k="Customers" v={fmtNum(SESSION.customers)} />
                <DLRow k="Cycle" v={SESSION.cycle} />
                <DLRow k="Estimated stops" v={fmtNum(SESSION.customers * 5)} />
              </DL>

              <div className="file-pill" style={{ marginTop: 'var(--s4)' }}>
                <FileIcon size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span className="mono t-xs t-med" style={{ display: 'block' }}>
                    {EXPORT_FILE_NAME}
                  </span>
                  <span className="t-xs t-ter">
                    {format} · one row per stop
                  </span>
                </span>
                <Segmented
                  value={format}
                  onChange={setFormat}
                  options={['XLSX', 'CSV'] as const}
                />
              </div>
            </div>

            <div className="card-foot">
              {generating ? (
                <div style={{ flex: '1 1 auto' }}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="t-sm t-med">Generating Stop List…</span>
                    <span className="t-xs t-ter tnum">{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
              ) : state === 'Complete' ? (
                <>
                  <Button
                    variant="primary"
                    icon={<DownloadIcon size={14} />}
                    onClick={() => pushToast({ tone: 'info', title: 'Download started' })}
                  >
                    Download Stop List
                  </Button>
                  <Button
                    icon={<ExternalIcon size={13} />}
                    onClick={() =>
                      pushToast({
                        tone: 'success',
                        title: 'Handoff link copied',
                        sub: 'Anyone with the link can download this export.',
                      })
                    }
                  >
                    Copy Handoff Link
                  </Button>
                  <Button variant="ghost" onClick={() => nav('exports')}>
                    View Export History
                  </Button>
                  <Button variant="ghost" onClick={() => nav('workspace')}>
                    Back to Session
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    icon={<EyeIcon size={14} />}
                    onClick={() => setPreviewOpen(true)}
                  >
                    Preview Stop List
                  </Button>
                  {canExport ? (
                    <Button
                      variant="primary"
                      icon={<DownloadIcon size={14} />}
                      onClick={generate}
                    >
                      Generate Stop List
                    </Button>
                  ) : (
                    <Tooltip
                      text={
                        state === 'Not finalized'
                          ? 'Finalize an option before exporting the Stop List.'
                          : 'Resolve the 12 rows missing required fields first.'
                      }
                    >
                      <Button variant="primary" disabled icon={<DownloadIcon size={14} />}>
                        Generate Stop List
                      </Button>
                    </Tooltip>
                  )}
                  {state === 'Missing fields' && (
                    <Button variant="ghost" onClick={() => setReviewOpen(true)}>
                      Review missing fields
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Missing field detail --------------------------------------- */}
          {state === 'Missing fields' && (
            <div className="row" style={{ gap: 'var(--s2)' }}>
              <CountCard label="Exportable" value={fmtNum(SESSION.customers - 12)} tone="valid" />
              <CountCard label="Missing fields" value={EXPORT_MISSING_FIELDS.rows} tone="blocked" />
              <CountCard label="Routes affected" value="4" tone="warning" />
            </div>
          )}
        </div>

        {/* Right column ------------------------------------------------- */}
        <div className="stack-4">
          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Export guard
            </div>
            <div className="stack-3">
              <GuardRow
                ok={state !== 'Not finalized'}
                label="An option is finalized"
                detail="Exports are always traceable to one locked version."
              />
              <GuardRow
                ok={state === 'Ready' || state === 'Complete'}
                label="All rows have required fields"
                detail="Route, delivery day, delivery week and service pattern."
              />
              <GuardRow
                ok={state === 'Complete'}
                label="Stop List generated"
                detail="Download and handoff link become available."
              />
            </div>
          </Card>

          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Handoff notes
            </div>
            <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
              The export unit is a <strong>stop</strong>, not a customer. A Mon–Fri customer
              produces five stops, which is the Option B row model flowing through to the
              downstream routing and dispatch systems.
            </p>
          </Card>
        </div>
      </div>

      {/* Preview modal ---------------------------------------------------- */}
      {previewOpen && (
        <Modal
          size="xl"
          title="Stop List preview"
          sub={`First ${stops.length} of ${fmtNum(SESSION.customers * 5)} stops from ${activeVersion.name}.`}
          onClose={() => setPreviewOpen(false)}
          footer={
            <>
              {canExport ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    setPreviewOpen(false)
                    generate()
                  }}
                >
                  Generate Stop List
                </Button>
              ) : (
                <Tooltip text="Finalize an option before exporting the Stop List.">
                  <Button variant="primary" disabled>
                    Generate Stop List
                  </Button>
                </Tooltip>
              )}
              <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            </>
          }
        >
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Missing fields review ------------------------------------------- */}
      {reviewOpen && (
        <Modal
          size="lg"
          title="Rows missing required fields"
          sub={EXPORT_MISSING_FIELDS.detail}
          mark={
            <span className="modal-danger-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => setReviewOpen(false)}
          footer={
            <>
              <Button
                variant="primary"
                onClick={() => {
                  setReviewOpen(false)
                  nav('workspace', { tab: 'customers' })
                }}
              >
                Fix in Route Workspace
              </Button>
              <Button onClick={() => setReviewOpen(false)}>Close</Button>
            </>
          }
        >
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Route</th>
                  <th>Missing field</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {MISSING_ROWS.map((r) => (
                  <tr key={r.customerId}>
                    <td className="cell-id">{r.customerId}</td>
                    <td>{r.route}</td>
                    <td>
                      <Badge tone="blocked">{r.missing}</Badge>
                    </td>
                    <td className="right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          nav('workspace', { drawer: 'customer', id: r.customerId })
                        }
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-foot">
              <span>
                Showing {MISSING_ROWS.length} of {EXPORT_MISSING_FIELDS.rows} rows
              </span>
              <span className="t-xs t-ter">
                Rows without a service pattern cannot become stops at all.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function GuardRow({
  ok,
  label,
  detail,
}: {
  ok: boolean
  label: string
  detail: string
}) {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
      <span
        className={`check-mark ${ok ? 'done' : 'todo'}`}
        style={{ marginTop: 1, flex: '0 0 auto' }}
      >
        {ok ? <CheckCircleIcon size={11} /> : <LockIcon size={10} />}
      </span>
      <span style={{ minWidth: 0 }}>
        <span className="t-sm t-med" style={{ display: 'block' }}>
          {label}
        </span>
        <span className="t-xs t-sec" style={{ lineHeight: 1.5 }}>
          {detail}
        </span>
      </span>
    </div>
  )
}
