/**
 * Customer Master enhancement import.
 *
 * Three steps, all required before anything is written:
 *   1. Column confirmation safety screen — the analyst must confirm every
 *      mapping, and destructive overwrites are called out explicitly.
 *   2. Import error report — blocked and warning rows, downloadable.
 *   3. Apply — blocked rows can never be silently imported.
 */
import { useState } from 'react'
import {
  COLUMN_MAPPINGS,
  IMPORT_ERRORS,
  IMPORT_SUMMARY,
  fmtNum,
  type ColumnMapping,
} from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  Modal,
  ProcessStrip,
  ProgressBar,
  Select,
  StatCard,
  StepList,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  ErrorCircleIcon,
  FileIcon,
  WarningIcon,
} from '../components/icons'

type Step = 'columns' | 'errors' | 'applying'

export function MasterImport() {
  const { nav, pushToast } = useApp()
  const [step, setStep] = useState<Step>('columns')
  const [mappings, setMappings] = useState<ColumnMapping[]>(COLUMN_MAPPINGS)
  const [confirmed, setConfirmed] = useState(false)
  const [destructiveAck, setDestructiveAck] = useState(false)
  const [excludeBlocked, setExcludeBlocked] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pct, setPct] = useState(0)

  const destructive = mappings.filter((m) => m.destructive && m.action === 'Update')
  const blocked = IMPORT_ERRORS.filter((e) => e.severity === 'Blocked')
  const warnings = IMPORT_ERRORS.filter((e) => e.severity === 'Warning')

  const setAction = (src: string, action: ColumnMapping['action']) => {
    setMappings((prev) => prev.map((m) => (m.sourceColumn === src ? { ...m, action } : m)))
    setConfirmed(false)
  }

  const runImport = () => {
    setConfirmOpen(false)
    setStep('applying')
    setPct(0)
    // Side effects stay outside the state updater (StrictMode double-invokes).
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 9)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      pushToast({
        tone: 'success',
        title: `${fmtNum(IMPORT_SUMMARY.ready)} customer records updated.`,
        sub: excludeBlocked
          ? `${blocked.length} blocked rows were skipped and remain in the error report.`
          : undefined,
      })
      nav('customer-master')
    }, 180)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Customer Master Enhancement Import</h1>
        <p className="page-sub">
          Enrich existing customer records with addresses, geocodes, service times and time
          windows. Nothing is written until you confirm the column mapping and review the errors.
        </p>
      </div>

      <Card className="card-pad" style={{ marginBottom: 'var(--s5)' }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s4)' }}>
          <div className="row tight">
            <FileIcon size={16} style={{ color: 'var(--accent)' }} />
            <span>
              <span className="t-med t-sm" style={{ display: 'block' }}>
                {IMPORT_SUMMARY.fileName}
              </span>
              <span className="t-xs t-ter">
                {fmtNum(IMPORT_SUMMARY.totalRows)} rows · {mappings.length} columns detected
              </span>
            </span>
          </div>
          <ProcessStrip
            nodes={[
              { label: 'Confirm Columns', state: step === 'columns' ? 'accent' : 'on' },
              { label: 'Review Errors', state: step === 'errors' ? 'accent' : undefined },
              { label: 'Apply', state: step === 'applying' ? 'accent' : undefined },
            ]}
          />
        </div>
      </Card>

      {/* ------------------------------------------------ Step 1: columns */}
      {step === 'columns' && (
        <>
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="warning" title="Confirm every column before importing">
              Column mapping is guessed from the file header. An incorrect mapping can overwrite
              good Customer Master data across every session. Review each row below.
            </Banner>
          </div>

          <div className="table-wrap">
            <div className="table-toolbar">
              <span className="t-sm t-med">Column mapping</span>
              <span className="spacer" />
              <span className="t-xs t-ter">
                {mappings.filter((m) => m.action === 'Update').length} columns will be written ·{' '}
                {mappings.filter((m) => m.action === 'Ignore').length} ignored
              </span>
            </div>
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Source Column</th>
                    <th>Sample Value</th>
                    <th>Maps To</th>
                    <th>Action</th>
                    <th className="th-num">Rows Affected</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <tr key={m.sourceColumn}>
                      <td className="mono t-med">{m.sourceColumn}</td>
                      <td className="td-muted mono t-xs">{m.sample}</td>
                      <td>{m.target}</td>
                      <td>
                        <div style={{ width: 118 }}>
                          <Select
                            value={m.action}
                            onChange={(v) => setAction(m.sourceColumn, v as ColumnMapping['action'])}
                            options={['Update', 'Ignore', 'Create']}
                          />
                        </div>
                      </td>
                      <td className="td-num">
                        {m.action === 'Ignore' ? (
                          <span className="t-ter">—</span>
                        ) : (
                          fmtNum(m.affected)
                        )}
                      </td>
                      <td>
                        {m.action === 'Ignore' ? (
                          <Badge tone="default">Skipped</Badge>
                        ) : m.destructive ? (
                          <Badge tone="warning">Overwrites existing values</Badge>
                        ) : (
                          <Badge tone="valid">Safe</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {destructive.length > 0 && (
            <div style={{ marginTop: 'var(--s4)' }}>
              <Banner tone="error" title={`${destructive.length} columns will overwrite existing Customer Master values`}>
                {destructive.map((d) => d.target).join(', ')} already hold data for some customers.
                Importing replaces those values for every session that reads Customer Master.
              </Banner>
            </div>
          )}

          <Card className="card-pad" style={{ marginTop: 'var(--s4)' }}>
            <div className="stack-3">
              <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span className="t-sm" style={{ lineHeight: 1.55 }}>
                  I have reviewed all {mappings.length} column mappings and they are correct.
                </span>
              </label>
              {destructive.length > 0 && (
                <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={destructiveAck}
                    onChange={(e) => setDestructiveAck(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <span className="t-sm" style={{ lineHeight: 1.55 }}>
                    I understand that {destructive.map((d) => d.target).join(', ')} will be
                    overwritten for {fmtNum(Math.max(...destructive.map((d) => d.affected)))}{' '}
                    customers.
                  </span>
                </label>
              )}
            </div>
            <div className="row tight" style={{ marginTop: 'var(--s5)' }}>
              <Button
                variant="primary"
                disabled={!confirmed || (destructive.length > 0 && !destructiveAck)}
                iconRight={<ArrowRightIcon size={14} />}
                onClick={() => setStep('errors')}
              >
                Validate File
              </Button>
              <Button onClick={() => nav('customer-master')}>Cancel</Button>
            </div>
          </Card>
        </>
      )}

      {/* ------------------------------------------------- Step 2: errors */}
      {step === 'errors' && (
        <>
          <div className="grid-4" style={{ marginBottom: 'var(--s5)' }}>
            <StatCard
              label="Ready to import"
              value={fmtNum(IMPORT_SUMMARY.ready)}
              sub="Rows that pass every check"
              icon={<CheckCircleIcon size={15} />}
            />
            <StatCard
              label="Warnings"
              value={fmtNum(IMPORT_SUMMARY.warnings)}
              sub="Will import with reduced data"
              icon={<WarningIcon size={15} />}
            />
            <StatCard
              label="Blocked"
              value={fmtNum(IMPORT_SUMMARY.blocked)}
              sub="Cannot be imported as-is"
              icon={<ErrorCircleIcon size={15} />}
            />
            <StatCard
              label="New customers"
              value={fmtNum(IMPORT_SUMMARY.newCustomers)}
              sub="Not currently in Customer Master"
              icon={<FileIcon size={15} />}
            />
          </div>

          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="error" title="Import error report">
              {IMPORT_SUMMARY.blocked} rows are blocked and {IMPORT_SUMMARY.warnings} carry
              warnings. Blocked rows are never imported silently — either exclude them or fix the
              source file and re-upload.
            </Banner>
          </div>

          <div className="table-wrap">
            <div className="table-toolbar">
              <span className="t-sm t-med">
                {IMPORT_ERRORS.length} of {IMPORT_SUMMARY.blocked + IMPORT_SUMMARY.warnings} issues
                shown
              </span>
              <span className="spacer" />
              <Button
                size="sm"
                icon={<DownloadIcon size={13} />}
                onClick={() =>
                  pushToast({
                    tone: 'info',
                    title: 'Error report downloaded',
                    sub: 'ImportErrors_CustomerMaster_0723.csv',
                  })
                }
              >
                Download full report
              </Button>
            </div>
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="th-num">Row</th>
                    <th>Customer ID</th>
                    <th>Column</th>
                    <th>Value</th>
                    <th>Problem</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {IMPORT_ERRORS.map((e) => (
                    <tr key={`${e.row}-${e.column}`}>
                      <td className="td-num td-muted">{e.row}</td>
                      <td className="cell-id">{e.customerId}</td>
                      <td className="mono t-xs">{e.column}</td>
                      <td className="mono t-xs td-muted">{e.value}</td>
                      <td style={{ whiteSpace: 'normal', maxWidth: 340 }}>{e.problem}</td>
                      <td>
                        <Badge tone={e.severity === 'Blocked' ? 'blocked' : 'warning'}>
                          {e.severity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-foot">
              <span>
                {blocked.length} blocked · {warnings.length} warnings in this page
              </span>
              <span className="t-xs t-ter">
                {fmtNum(IMPORT_SUMMARY.unchanged)} rows are identical to existing records and will
                be skipped.
              </span>
            </div>
          </div>

          <Card className="card-pad" style={{ marginTop: 'var(--s4)' }}>
            <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                className="checkbox"
                type="checkbox"
                checked={excludeBlocked}
                onChange={(e) => setExcludeBlocked(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span className="t-sm" style={{ lineHeight: 1.55 }}>
                Exclude the {IMPORT_SUMMARY.blocked} blocked rows and import the remaining{' '}
                {fmtNum(IMPORT_SUMMARY.ready + IMPORT_SUMMARY.warnings)} rows.
              </span>
            </label>
            <div className="row tight" style={{ marginTop: 'var(--s5)' }}>
              <Button
                variant="primary"
                disabled={!excludeBlocked}
                onClick={() => setConfirmOpen(true)}
              >
                Import {fmtNum(IMPORT_SUMMARY.ready + IMPORT_SUMMARY.warnings)} Rows
              </Button>
              <Button onClick={() => setStep('columns')}>Back to columns</Button>
              {!excludeBlocked && (
                <span className="t-xs" style={{ marginLeft: 'auto', color: 'var(--error)' }}>
                  Blocked rows must be excluded before importing.
                </span>
              )}
            </div>
          </Card>
        </>
      )}

      {/* ------------------------------------------------ Step 3: applying */}
      {step === 'applying' && (
        <Card className="card-pad">
          <div className="section-title" style={{ marginBottom: 'var(--s2)' }}>
            Importing enhancement data
          </div>
          <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)' }}>
            Customer Master is updated in a single transaction. Sessions that already exist keep
            their baseline snapshots.
          </p>
          <ProgressBar pct={pct} />
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <span className="t-sm t-med tnum">
              {fmtNum(Math.round((pct / 100) * IMPORT_SUMMARY.ready))} of{' '}
              {fmtNum(IMPORT_SUMMARY.ready)} records written
            </span>
            <span className="t-xs t-ter tnum">{Math.min(100, pct)}%</span>
          </div>
          <div style={{ marginTop: 'var(--s5)', maxWidth: 420 }}>
            <StepList
              steps={[
                { label: 'Matching on customer ID…', state: pct > 20 ? 'done' : 'active' },
                {
                  label: 'Writing address and geocode fields…',
                  state: pct > 50 ? 'done' : pct > 20 ? 'active' : 'todo',
                },
                {
                  label: 'Writing service time and time windows…',
                  state: pct > 78 ? 'done' : pct > 50 ? 'active' : 'todo',
                },
                {
                  label: 'Re-checking session route mismatches…',
                  state: pct >= 100 ? 'done' : pct > 78 ? 'active' : 'todo',
                },
              ]}
            />
          </div>
        </Card>
      )}

      {confirmOpen && (
        <Modal
          title="Import into Customer Master?"
          sub="This updates the shared customer database used by every session."
          mark={
            <span className="modal-warn-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => setConfirmOpen(false)}
          footer={
            <>
              <Button variant="primary" onClick={runImport}>
                Import Now
              </Button>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            </>
          }
        >
          <div className="callout">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>
                {fmtNum(IMPORT_SUMMARY.ready + IMPORT_SUMMARY.warnings)} records will be updated
              </li>
              <li>{IMPORT_SUMMARY.blocked} blocked rows will be skipped</li>
              <li>
                {destructive.map((d) => d.target).join(', ')} will be overwritten where the file
                provides a value
              </li>
              <li>Existing session baselines are not affected</li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  )
}
