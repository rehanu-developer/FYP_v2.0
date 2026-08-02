/**
 * Handheld Output / Stop List Export — UPDATED to the confirmed direction.
 *
 * The output is now explicitly tied to HANDHELD ELIGIBILITY. Every included
 * customer must have a route, a delivery day, a delivery week, a valid
 * frequency (7 / 14 / 28 / 56 days), a valid Sales Group, and a Customer Master
 * record. Fake / load customers and intentionally excluded customers simply do
 * not ship, and never block.
 *
 * Deep links: #/exports?state=blocked | ready  (and #/stop-list)
 */
import { useEffect, useMemo, useState } from 'react'
import { CUSTOMERS, SESSION, fmtNum } from '../data/mock'
import { EXPORT_FILE_NAME } from '../data/prompt2'
import {
  COPY,
  evaluateHandheld,
  frequencyLabel,
  type HandheldStatus,
} from '../data/rules'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  CountCard,
  DL,
  DLRow,
  ProgressBar,
  Segmented,
  Tooltip,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  ExternalIcon,
  FileIcon,
  LockIcon,
} from '../components/icons'

type ExportState = 'Blocked' | 'Ready' | 'Complete'
const STATES: ExportState[] = ['Blocked', 'Ready', 'Complete']

const FILTERS = ['All', 'Ready', 'Excluded', 'Blocked', 'Needs Review'] as const

/** Rows for the handheld eligibility table, computed by the rule engine. */
function buildRows(forceReady: boolean) {
  return CUSTOMERS.map((c) => {
    const evaluation = evaluateHandheld({
      customerId: c.customerId,
      route: c.route,
      day: c.serviceDays[0] ?? null,
      week: c.weeks[0] ?? null,
      frequencyDays: c.frequencyDays,
      salesGroup: c.salesGroupValid ? c.salesGroup : null,
      inMaster: c.masterStatus === 'In Master',
      // In the Ready state the analyst has resolved every blocker by excluding
      // or creating the offending customers.
      includedInHandheld: forceReady
        ? c.masterStatus === 'In Master' && c.salesGroupValid && c.frequencyDays !== null
        : c.includedInHandheld,
      loadCustomer: c.loadCustomer,
      patternOverride: c.patternOverride,
    })
    return {
      customerId: c.customerId,
      route: c.route,
      day: c.serviceDays[0] ?? null,
      week: c.weeks[0] ?? null,
      frequency: frequencyLabel(c.frequencyDays),
      inMaster: c.masterStatus === 'In Master',
      loadCustomer: c.loadCustomer,
      status: evaluation.status,
      reason:
        evaluation.blockers[0]?.message ?? evaluation.warnings[0]?.message ?? '',
    }
  })
}

export function StopList() {
  const { nav, pushToast, activeVersion, params } = useApp()

  const [state, setState] = useState<ExportState>(
    params.state === 'ready' ? 'Ready' : 'Blocked',
  )
  useEffect(() => {
    if (params.state === 'ready') setState('Ready')
    if (params.state === 'blocked') setState('Blocked')
  }, [params.state])

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [generating, setGenerating] = useState(false)
  const [pct, setPct] = useState(0)
  const [acknowledged, setAcknowledged] = useState(false)

  const rows = useMemo(() => buildRows(state !== 'Blocked'), [state])
  const counts = useMemo(() => {
    const c: Record<HandheldStatus, number> = {
      Ready: 0,
      Excluded: 0,
      Blocked: 0,
      'Needs Review': 0,
    }
    rows.forEach((r) => (c[r.status] += 1))
    return c
  }, [rows])

  const shown = rows.filter((r) => filter === 'All' || r.status === filter)
  const hasBlockers = counts.Blocked > 0
  const canGenerate = !hasBlockers && (acknowledged || state === 'Complete')

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
      pushToast({ tone: 'success', title: 'Handheld file generated successfully.' })
    }, 160)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Handheld Output / Stop List Export</h1>
            <p className="page-sub">
              Generate the export only after all required scheduling and Customer Master checks
              pass.
            </p>
          </div>
          <div className="row tight">
            <span className="t-xs t-ter nowrap">Export state</span>
            <Segmented
              value={state}
              onChange={(v) => {
                setState(v)
                setAcknowledged(false)
              }}
              options={STATES}
            />
          </div>
        </div>
      </div>

      {/* Guard banner ------------------------------------------------------ */}
      <div style={{ marginBottom: 'var(--s5)' }}>
        {hasBlockers && (
          <Banner
            tone="error"
            title="Handheld file cannot be generated until blocking issues are resolved."
            action={
              <Button size="sm" onClick={() => nav('finalize', { state: 'blockers' })}>
                Review blocking issues
              </Button>
            }
          >
            {COPY.export}
          </Banner>
        )}
        {!hasBlockers && state !== 'Complete' && (
          <Banner tone={acknowledged ? 'success' : 'warning'} title="Ready to generate">
            {counts.Ready + counts['Needs Review']} customers are eligible for handheld output.{' '}
            {counts.Excluded} are excluded and will not ship.
            {!acknowledged && ' Acknowledge the warnings to enable generation.'}
          </Banner>
        )}
        {state === 'Complete' && (
          <Banner tone="success" title="Handheld file generated successfully.">
            {EXPORT_FILE_NAME} · {fmtNum(counts.Ready + counts['Needs Review'])} customers
            included.
          </Banner>
        )}
      </div>

      {/* Four sections as counts ------------------------------------------ */}
      <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s5)' }}>
        <CountCard label="Included in handheld" value={counts.Ready} tone="valid" />
        <CountCard label="Needs review" value={counts['Needs Review']} tone="warning" />
        <CountCard label="Excluded from handheld" value={counts.Excluded} tone="default" />
        <CountCard label="Blocking issues" value={counts.Blocked} tone="blocked" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(300px, 0.85fr)',
          gap: 'var(--s5)',
          alignItems: 'start',
        }}
      >
        <div className="stack-4">
          {/* Eligibility table -------------------------------------------- */}
          <div className="table-wrap">
            <div className="table-toolbar">
              <span className="t-sm t-med">Handheld eligibility</span>
              <span className="spacer" />
              <div className="chips">
                {FILTERS.map((f) => (
                  <Chip key={f} on={filter === f} onClick={() => setFilter(f)}>
                    {f}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="table-scroll tall">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Route</th>
                    <th>Day</th>
                    <th className="th-num">Week</th>
                    <th>Frequency</th>
                    <th>Customer Master</th>
                    <th>Handheld Status</th>
                    <th style={{ minWidth: 200 }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.customerId}>
                      <td className="cell-id">{r.customerId}</td>
                      <td className="mono">{r.route ?? '—'}</td>
                      <td>{r.day ?? '—'}</td>
                      <td className="td-num">{r.week ?? '—'}</td>
                      <td className="td-muted">{r.frequency}</td>
                      <td>
                        {r.inMaster ? (
                          <Badge tone="match">In Master</Badge>
                        ) : (
                          <Badge tone="notmaster">
                            {r.loadCustomer ? 'Load customer' : 'Not in Master'}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge
                          tone={
                            r.status === 'Ready'
                              ? 'valid'
                              : r.status === 'Blocked'
                                ? 'blocked'
                                : r.status === 'Needs Review'
                                  ? 'warning'
                                  : 'default'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="td-muted t-xs" style={{ whiteSpace: 'normal' }}>
                        {r.reason || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-foot">
              <span>
                Showing {shown.length} of {rows.length} representative customers
              </span>
              <span className="t-xs t-ter">
                Session scale: {fmtNum(SESSION.customers)} customers
              </span>
            </div>
          </div>

          {/* Actions ------------------------------------------------------ */}
          <Card className="card-pad">
            {generating ? (
              <>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="t-sm t-med">Generating handheld file…</span>
                  <span className="t-xs t-ter tnum">{pct}%</span>
                </div>
                <ProgressBar pct={pct} />
              </>
            ) : state === 'Complete' ? (
              <div className="row tight wrap">
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
                    pushToast({ tone: 'success', title: 'Handoff link copied' })
                  }
                >
                  Copy Handoff Link
                </Button>
                <Button variant="ghost" onClick={() => nav('exports')}>
                  Export History
                </Button>
                <Button variant="ghost" onClick={() => nav('workspace')}>
                  Back to Session
                </Button>
              </div>
            ) : (
              <div className="row tight wrap">
                {canGenerate ? (
                  <Button
                    variant="primary"
                    icon={<DownloadIcon size={14} />}
                    onClick={generate}
                  >
                    Generate Handheld File
                  </Button>
                ) : (
                  <Tooltip
                    text={
                      hasBlockers
                        ? 'Handheld file cannot be generated until blocking issues are resolved.'
                        : 'Acknowledge the warnings to enable generation.'
                    }
                  >
                    <Button variant="primary" disabled icon={<DownloadIcon size={14} />}>
                      Generate Handheld File
                    </Button>
                  </Tooltip>
                )}

                {!hasBlockers && !acknowledged && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setAcknowledged(true)
                      pushToast({
                        tone: 'success',
                        title: 'Warnings acknowledged',
                        sub: `${counts['Needs Review']} rows need review, ${counts.Excluded} excluded.`,
                      })
                    }}
                  >
                    Acknowledge Warnings
                  </Button>
                )}

                {hasBlockers && (
                  <Button
                    variant="secondary"
                    onClick={() => nav('finalize', { state: 'blockers' })}
                  >
                    Review Blocking Issues
                  </Button>
                )}
                <Button variant="ghost" onClick={() => nav('exports')}>
                  Export History
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right column ------------------------------------------------- */}
        <div className="stack-4">
          <Card>
            <div className="card-head">
              <div className="section-title">Export summary</div>
              <Badge
                tone={
                  state === 'Complete' ? 'finalized' : hasBlockers ? 'blocked' : 'valid'
                }
              >
                {hasBlockers ? 'Blocked' : state}
              </Badge>
            </div>
            <div className="card-body">
              <DL>
                <DLRow k="Session" v="Delivery Scenario as of 07/23/2026" />
                <DLRow k="Active Version" v={activeVersion.name} />
                <DLRow k="Routes" v={String(SESSION.routes)} />
                <DLRow k="Cycle" v={SESSION.cycle} />
                <DLRow k="Included" v={fmtNum(counts.Ready + counts['Needs Review'])} />
                <DLRow k="Excluded" v={fmtNum(counts.Excluded)} />
              </DL>
              <div className="file-pill" style={{ marginTop: 'var(--s4)' }}>
                <FileIcon size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span className="mono t-xs t-med" style={{ display: 'block' }}>
                    {EXPORT_FILE_NAME}
                  </span>
                  <span className="t-xs t-ter">One row per stop</span>
                </span>
              </div>
            </div>
          </Card>

          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Handheld requirements
            </div>
            <div className="stack-3">
              {[
                'Route assigned',
                'Delivery day assigned (Mon–Fri)',
                'Delivery week assigned',
                'Frequency is 7, 14, 28 or 56 days',
                'Sales Group validated',
                'Customer Master record exists',
              ].map((req) => (
                <div className="row tight" key={req} style={{ alignItems: 'flex-start' }}>
                  <span
                    className={`check-mark ${hasBlockers ? 'todo' : 'done'}`}
                    style={{ marginTop: 1, flex: '0 0 auto' }}
                  >
                    {hasBlockers ? <LockIcon size={10} /> : <CheckCircleIcon size={11} />}
                  </span>
                  <span className="t-sm">{req}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Excluded from handheld
            </div>
            <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
              Fake / load customers, customers without a Customer Master record, unassigned
              customers, and anything the analyst intentionally excluded. Excluded rows never
              block the export — they simply do not ship.
            </p>
            <div style={{ marginTop: 'var(--s4)' }}>
              <Button
                size="sm"
                variant="ghost"
                iconRight={<ArrowRightIcon size={13} />}
                onClick={() => setFilter('Excluded')}
              >
                Show excluded rows
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
