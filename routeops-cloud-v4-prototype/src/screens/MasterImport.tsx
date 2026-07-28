/**
 * Part I — Customer Master Enhancement Import.
 * Part J — Error Report Preview.
 *
 * Five screens in one flow:
 *   1. Import Location Enhancements (form)
 *   2. File Layout
 *   3. Column Confirmation Safety Screen
 *   4. Import Running
 *   5. Import Result Summary  (-> Error Report Preview)
 *
 * This import UPDATES EXISTING CUSTOMERS ONLY. It never creates new customers;
 * those arrive through the Extension Report reconcile flow.
 *
 * Permissions: only Admin and Ingest Admin can run it. The Routing Analyst sees
 * a disabled CTA with an explanation (global rule 1: disable, don't reject).
 */
import { useState } from 'react'
import {
  BAND_COLORS,
  COORD_FORMATS,
  ENHANCEMENT_ERRORS,
  ENHANCEMENT_SUMMARY,
  ERROR_PREVIEW_CAP,
  FIELDS_UNCHANGED,
  FIELDS_UPDATED,
  FILE_LAYOUTS,
  FILE_LAYOUT_FIELDS,
  FILE_SOURCES,
  IMPORT_FILE,
  IMPORT_NOTES,
  IMPORT_STEPS,
  ROLES,
  SERVICE_TIME_FORMATS,
  canImportEnhancements,
  type Role,
} from '../data/prompt2'
import { fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  CountCard,
  Drawer,
  EmptyState,
  Field,
  Modal,
  ProgressBar,
  Select,
  StepList,
  Tooltip,
} from '../components/ui'
import {
  ArrowRightIcon,
  CalendarIcon,

  DownloadIcon,
  ErrorCircleIcon,
  EyeIcon,
  FileIcon,
  LockIcon,
  UploadCloudIcon,
  WarningIcon,
  XIcon,
} from '../components/icons'

type Step = 1 | 2 | 3 | 4 | 5

const STEP_NAMES = [
  'Location Enhancements',
  'File Layout',
  'Confirm Fields',
  'Running',
  'Result',
]

export function MasterImport() {
  const { nav, pushToast, role, setRole } = useApp()
  const allowed = canImportEnhancements(role)

  const [step, setStep] = useState<Step>(1)
  const [file, setFile] = useState<string | null>(null)
  const [source, setSource] = useState('')
  const [coordFormat, setCoordFormat] = useState(COORD_FORMATS[0])
  const [svcFormat, setSvcFormat] = useState(SERVICE_TIME_FORMATS[0])
  const [updateOnly, setUpdateOnly] = useState(true)
  const [layout, setLayout] = useState(FILE_LAYOUTS[0])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pct, setPct] = useState(0)
  const [errorOpen, setErrorOpen] = useState(false)

  const run = () => {
    setConfirmOpen(false)
    setStep(4)
    setPct(0)
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 7)
      setPct(p)
      if (p < 100) return
      window.clearInterval(t)
      window.setTimeout(() => setStep(5), 350)
    }, 170)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Customer Master Enhancement Import</h1>
            <p className="page-sub">{IMPORT_NOTES.neverCreates}</p>
          </div>
          {/* Prototype role switcher: permission states are the point here. */}
          <div className="row tight">
            <span className="t-xs t-ter nowrap">Viewing as</span>
            <div style={{ width: 150 }}>
              <Select
                value={role}
                onChange={(v) => setRole(v as Role)}
                options={[...ROLES]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permission gate (Part I) ------------------------------------------ */}
      {!allowed && (
        <div style={{ marginBottom: 'var(--s5)' }}>
          <Banner
            tone="info"
            title="You can view Customer Master data, but you don’t have permission to import enhancements."
            action={
              <Tooltip text="Only Admin and Ingest Admin can import Customer Master enhancements.">
                <Button size="sm" variant="primary" disabled icon={<UploadCloudIcon size={13} />}>
                  Import Enhancements
                </Button>
              </Tooltip>
            }
          >
            You are signed in as <strong>{role}</strong>. Only Admin and Ingest Admin can import
            Customer Master enhancements. Switch role above to review the import flow.
          </Banner>
        </div>
      )}

      {allowed && (
        <>
          {/* Stepper ------------------------------------------------------ */}
          <div className="stepper" style={{ marginBottom: 'var(--s5)' }}>
            {STEP_NAMES.map((name, i) => {
              const n = (i + 1) as Step
              return (
                <span
                  key={name}
                  className={`step-pill${step === n ? ' on' : step > n ? ' done' : ''}`}
                >
                  <span className="step-num">{step > n ? '✓' : n}</span>
                  {name}
                </span>
              )
            })}
          </div>

          {step === 1 && (
            <Screen1
              file={file}
              setFile={setFile}
              source={source}
              setSource={setSource}
              coordFormat={coordFormat}
              setCoordFormat={setCoordFormat}
              svcFormat={svcFormat}
              setSvcFormat={setSvcFormat}
              updateOnly={updateOnly}
              setUpdateOnly={setUpdateOnly}
              layout={layout}
              setLayout={setLayout}
              onContinue={() => setStep(2)}
              onCancel={() => nav('customer-master')}
            />
          )}

          {step === 2 && (
            <Screen2 onBack={() => setStep(1)} onContinue={() => setStep(3)} />
          )}

          {step === 3 && (
            <Screen3
              onBack={() => setStep(2)}
              onConfirm={() => setConfirmOpen(true)}
              onCancel={() => nav('customer-master')}
            />
          )}

          {step === 4 && <Screen4 pct={pct} />}

          {step === 5 && (
            <Screen5
              onPreview={() => setErrorOpen(true)}
              onDownload={() =>
                pushToast({
                  tone: 'info',
                  title: 'Error report downloaded',
                  sub: 'Enhancement_Errors_2026_07_23.csv',
                })
              }
              onBack={() => nav('customer-master')}
            />
          )}
        </>
      )}

      {/* Confirm modal ----------------------------------------------------- */}
      {confirmOpen && (
        <Modal
          title="Confirm import into Customer Master?"
          sub="This updates the shared customer database used by every session."
          mark={
            <span className="modal-warn-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => setConfirmOpen(false)}
          footer={
            <>
              <Button variant="primary" onClick={run}>
                Confirm Import
              </Button>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            </>
          }
        >
          <div className="callout">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>
                {fmtNum(ENHANCEMENT_SUMMARY.matched)} existing customers will be updated
              </li>
              <li>{FIELDS_UPDATED.join(', ')} will change where the file provides a value</li>
              <li>{ENHANCEMENT_SUMMARY.skipped} rows will be skipped</li>
              <li>No new customers will be created</li>
              <li>Existing session baselines are not affected</li>
            </ul>
          </div>
        </Modal>
      )}

      {/* Part J — error report preview -------------------------------------- */}
      {errorOpen && <ErrorReportDrawer onClose={() => setErrorOpen(false)} />}
    </div>
  )
}

/* ==========================================================================
   Screen 1 — Import Location Enhancements
   ========================================================================== */

function Screen1({
  file,
  setFile,
  source,
  setSource,
  coordFormat,
  setCoordFormat,
  svcFormat,
  setSvcFormat,
  updateOnly,
  setUpdateOnly,
  layout,
  setLayout,
  onContinue,
  onCancel,
}: {
  file: string | null
  setFile: (v: string | null) => void
  source: string
  setSource: (v: string) => void
  coordFormat: string
  setCoordFormat: (v: string) => void
  svcFormat: string
  setSvcFormat: (v: string) => void
  updateOnly: boolean
  setUpdateOnly: (v: boolean) => void
  layout: string
  setLayout: (v: string) => void
  onContinue: () => void
  onCancel: () => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 0.9fr)',
        gap: 'var(--s5)',
        alignItems: 'start',
      }}
    >
      <Card>
        <div className="card-head">
          <div className="section-title">Import Location Enhancements</div>
        </div>
        <div className="card-body stack-5">
          <Field label="Location File" required>
            {file ? (
              <div className="file-pill">
                <FileIcon size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span className="t-med t-sm" style={{ display: 'block' }}>
                    {file}
                  </span>
                  <span className="t-xs t-ter">
                    {IMPORT_FILE.fields} fields · {fmtNum(IMPORT_FILE.rows)} rows
                  </span>
                </span>
                <button className="icon-btn" onClick={() => setFile(null)} aria-label="Remove">
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <button
                className="dropzone"
                style={{ width: '100%', font: 'inherit' }}
                onClick={() => setFile(IMPORT_FILE.name)}
              >
                <div className="dropzone-icon">
                  <UploadCloudIcon size={24} />
                </div>
                <div className="dropzone-title">
                  Click to upload or <em>drag an Excel file</em>
                </div>
                <div className="dropzone-help">Supported format: .xlsx</div>
              </button>
            )}
          </Field>

          <div className="grid-2">
            <Field label="File Source" required>
              <Select
                value={source}
                onChange={setSource}
                options={FILE_SOURCES}
                placeholder="Select file source"
              />
            </Field>
            <Field label="Latitude/Longitude Coordinate Format">
              <Select value={coordFormat} onChange={setCoordFormat} options={COORD_FORMATS} />
            </Field>
          </div>

          <Field label="Variable Service Time Format">
            <Select value={svcFormat} onChange={setSvcFormat} options={SERVICE_TIME_FORMATS} />
          </Field>

          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Import options</span>
            </div>
            <div className="zone-body stack-3">
              <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={updateOnly}
                  onChange={(e) => setUpdateOnly(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span>
                  <span className="t-sm t-med" style={{ display: 'block' }}>
                    Update Existing Locations Only
                  </span>
                  <span className="t-xs t-sec">
                    New customers are added through the Extension Report reconcile flow, never
                    here.
                  </span>
                </span>
              </label>

              {/* Checked AND disabled, as specified. */}
              <Tooltip text={IMPORT_NOTES.geocode}>
                <label
                  className="row"
                  style={{ alignItems: 'flex-start', gap: 10, cursor: 'not-allowed' }}
                >
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked
                    disabled
                    style={{ marginTop: 2 }}
                  />
                  <span>
                    <span className="t-sm t-med" style={{ display: 'block' }}>
                      Do NOT Geocode
                      <Badge tone="immutable">
                        <LockIcon size={10} /> Locked
                      </Badge>
                    </span>
                    <span className="t-xs t-sec">{IMPORT_NOTES.geocode}</span>
                  </span>
                </label>
              </Tooltip>
            </div>
          </div>

          <Field label="File Layout">
            <Select value={layout} onChange={setLayout} options={FILE_LAYOUTS} />
          </Field>
        </div>
        <div className="card-foot">
          <Button
            variant="primary"
            disabled={!file || !source}
            iconRight={<ArrowRightIcon size={14} />}
            onClick={onContinue}
          >
            Continue
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
          {(!file || !source) && (
            <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
              Upload a file and choose a source to continue.
            </span>
          )}
        </div>
      </Card>

      {/* Planning sessions ------------------------------------------------ */}
      <Card>
        <div className="card-head">
          <div>
            <div className="section-title">Planning Sessions</div>
            <div className="section-sub">
              Sessions that already consumed a Customer Master enhancement.
            </div>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <EmptyState
            icon={<CalendarIcon size={20} />}
            title="No planning sessions yet."
            sub="Once an enhancement import has been applied and a session created from it, that session will be listed here with its date and description."
          />
        </div>
      </Card>
    </div>
  )
}

/* ==========================================================================
   Screen 2 — File Layout
   ========================================================================== */

function Screen2({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <Card>
      <div className="card-head">
        <div>
          <div className="section-title">File Layout</div>
          <div className="section-sub">
            Confirm the file parses into the expected fields before mapping columns.
          </div>
        </div>
        <Badge tone="info">Standard Layout</Badge>
      </div>
      <div className="card-body">
        <div className="file-pill" style={{ marginBottom: 'var(--s4)' }}>
          <FileIcon size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ flex: '1 1 auto', minWidth: 0 }}>
            <span className="t-med t-sm" style={{ display: 'block' }}>
              {IMPORT_FILE.name}
            </span>
            <span className="t-xs t-ter">
              {IMPORT_FILE.fields} fields · {fmtNum(IMPORT_FILE.rows)} rows
            </span>
          </span>
        </div>

        <div className="table-wrap">
          <div className="table-scroll tall">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 34 }} />
                  <th>Field Name</th>
                  <th>Example</th>
                  <th>Group</th>
                </tr>
              </thead>
              <tbody>
                {FILE_LAYOUT_FIELDS.map((f) => (
                  <tr key={f.field}>
                    <td>
                      <span
                        className="band-dot"
                        style={{ background: BAND_COLORS[f.band], display: 'block' }}
                      />
                    </td>
                    <td className="t-med">{f.field}</td>
                    <td className="mono t-xs td-muted">{f.example}</td>
                    <td className="td-muted t-xs" style={{ textTransform: 'capitalize' }}>
                      {f.band}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <span>
              {FILE_LAYOUT_FIELDS.length} of {IMPORT_FILE.fields} fields recognised
            </span>
            <span className="t-xs t-ter">{IMPORT_NOTES.privacy}</span>
          </div>
        </div>
      </div>
      <div className="card-foot">
        <Button variant="primary" iconRight={<ArrowRightIcon size={14} />} onClick={onContinue}>
          Continue to Column Confirmation
        </Button>
        <Button onClick={onBack}>Back</Button>
      </div>
    </Card>
  )
}

/* ==========================================================================
   Screen 3 — Column confirmation safety screen
   ========================================================================== */

function Screen3({
  onBack,
  onConfirm,
  onCancel,
}: {
  onBack: () => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const [ack, setAck] = useState(false)

  return (
    <div className="stack-4">
      <div>
        <h2 className="section-title" style={{ fontSize: 20 }}>
          Confirm fields to update
        </h2>
        <p className="section-sub">
          Review exactly which Customer Master fields this file will update before committing.
        </p>
      </div>

      {/* The single most important sentence on the screen. */}
      <Banner tone="accent" title="This file will update 3 fields for 1,214 customers">
        <strong>{FIELDS_UPDATED.join(', ')}.</strong> All other customer fields will be left
        unchanged.
      </Banner>

      <div className="row" style={{ gap: 'var(--s2)' }}>
        <CountCard label="Rows read" value={fmtNum(ENHANCEMENT_SUMMARY.rowsRead)} />
        <CountCard
          label="Matched customers"
          value={fmtNum(ENHANCEMENT_SUMMARY.matched)}
          tone="valid"
        />
        <CountCard
          label="Skipped rows"
          value={fmtNum(ENHANCEMENT_SUMMARY.skipped)}
          tone="warning"
        />
        <CountCard label="Fields to update" value={ENHANCEMENT_SUMMARY.fieldsToUpdate} />
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <Card>
          <div className="card-head">
            <div className="section-title">Fields being updated</div>
            <Badge tone="warning">Will change</Badge>
          </div>
          <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
            {FIELDS_UPDATED.map((f) => (
              <div className="check-row" key={f}>
                <span
                  className="check-mark"
                  style={{
                    background: 'var(--warning-bg)',
                    color: 'var(--warning)',
                    border: '1px solid var(--warning-border)',
                  }}
                >
                  <WarningIcon size={11} />
                </span>
                <span className="t-sm t-med" style={{ flex: '1 1 auto' }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <div className="section-title">Fields left unchanged</div>
            <Badge tone="valid">Protected</Badge>
          </div>
          <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
            {FIELDS_UNCHANGED.map((f) => (
              <div className="check-row" key={f}>
                <span className="check-mark done">
                  <LockIcon size={10} />
                </span>
                <span className="t-sm" style={{ flex: '1 1 auto' }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="callout">
        <strong style={{ color: 'var(--text)' }}>Important:</strong>{' '}
        {IMPORT_NOTES.noOverwrite}
      </div>

      <Card className="card-pad">
        <label className="row" style={{ alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            className="checkbox"
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span className="t-sm" style={{ lineHeight: 1.55 }}>
            I have reviewed the fields above and understand that {FIELDS_UPDATED.join(', ')} will
            be overwritten for {fmtNum(ENHANCEMENT_SUMMARY.matched)} customers across every
            session that reads Customer Master.
          </span>
        </label>
        <div className="row tight" style={{ marginTop: 'var(--s5)' }}>
          <Button variant="primary" disabled={!ack} onClick={onConfirm}>
            Confirm Import
          </Button>
          <Button onClick={onBack}>Back</Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}

/* ==========================================================================
   Screen 4 — Import running
   ========================================================================== */

function Screen4({ pct }: { pct: number }) {
  const per = 100 / IMPORT_STEPS.length
  return (
    <Card className="card-pad">
      <div className="section-title" style={{ marginBottom: 'var(--s2)' }}>
        Import running
      </div>
      <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)' }}>
        Customer Master is updated in a single transaction. Existing session baselines keep the
        snapshot they were created from.
      </p>
      <ProgressBar pct={pct} />
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <span className="t-sm t-med tnum">
          {fmtNum(Math.round((pct / 100) * ENHANCEMENT_SUMMARY.matched))} of{' '}
          {fmtNum(ENHANCEMENT_SUMMARY.matched)} records written
        </span>
        <span className="t-xs t-ter tnum">{pct}%</span>
      </div>
      <div style={{ marginTop: 'var(--s5)', maxWidth: 420 }}>
        <StepList
          steps={IMPORT_STEPS.map((label, i) => ({
            label,
            state:
              pct >= (i + 1) * per ? 'done' : pct >= i * per ? 'active' : 'todo',
          }))}
        />
      </div>
    </Card>
  )
}

/* ==========================================================================
   Screen 5 — Result summary
   ========================================================================== */

function Screen5({
  onPreview,
  onDownload,
  onBack,
}: {
  onPreview: () => void
  onDownload: () => void
  onBack: () => void
}) {
  return (
    <div className="stack-4">
      <Banner tone="success" title="Import complete">
        {fmtNum(ENHANCEMENT_SUMMARY.matched)} existing customers were updated. No new customers
        were created.
      </Banner>

      <div className="row" style={{ gap: 'var(--s2)' }}>
        <CountCard label="Rows read" value={fmtNum(ENHANCEMENT_SUMMARY.rowsRead)} />
        <CountCard
          label="Rows updated"
          value={fmtNum(ENHANCEMENT_SUMMARY.matched)}
          tone="valid"
        />
        <CountCard
          label="Rows skipped"
          value={fmtNum(ENHANCEMENT_SUMMARY.skipped)}
          tone="warning"
        />
        <CountCard label="Errors" value={ENHANCEMENT_SUMMARY.errors} tone="blocked" />
      </div>

      <Card className="card-pad">
        <div className="row tight wrap">
          <Button variant="primary" icon={<EyeIcon size={14} />} onClick={onPreview}>
            Preview Error Report
          </Button>
          <Button icon={<DownloadIcon size={14} />} onClick={onDownload}>
            Download Error Report
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Back to Customer Master
          </Button>
        </div>
        <div className="t-xs t-ter" style={{ marginTop: 'var(--s4)', lineHeight: 1.6 }}>
          {IMPORT_NOTES.decision}
        </div>
      </Card>
    </div>
  )
}

/* ==========================================================================
   Part J — Error Report Preview
   ========================================================================== */

function ErrorReportDrawer({ onClose }: { onClose: () => void }) {
  const { pushToast } = useApp()

  return (
    <Drawer
      wide
      title="Error Report Preview"
      sub="Review skipped rows and recommended corrections."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="primary"
            icon={<DownloadIcon size={14} />}
            onClick={() =>
              pushToast({
                tone: 'info',
                title: 'Error report downloaded',
                sub: 'Enhancement_Errors_2026_07_23.csv',
              })
            }
          >
            Download Error Report
          </Button>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    >
      <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
        <CountCard label="Errors" value={ENHANCEMENT_SUMMARY.errors} tone="blocked" />
        <CountCard
          label="Rows skipped"
          value={fmtNum(ENHANCEMENT_SUMMARY.skipped)}
          tone="warning"
        />
        <CountCard
          label="Rows updated"
          value={fmtNum(ENHANCEMENT_SUMMARY.matched)}
          tone="valid"
        />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <span className="t-sm t-med">
            Showing first {Math.min(ERROR_PREVIEW_CAP, ENHANCEMENT_ERRORS.length)} errors
          </span>
          <span className="spacer" />
          <span className="t-xs t-ter">Sorted by row number</span>
        </div>
        <div className="table-scroll tall">
          <table className="tbl" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th className="th-num">Row</th>
                <th>Location ID</th>
                <th>Error Code</th>
                <th style={{ minWidth: 190 }}>Message</th>
                <th style={{ minWidth: 240 }}>Recommended Correction</th>
              </tr>
            </thead>
            <tbody>
              {ENHANCEMENT_ERRORS.map((e, i) => (
                <tr key={`${e.row}-${i}`}>
                  <td className="td-num td-muted">{e.row}</td>
                  <td className="cell-id">{e.locationId}</td>
                  <td>
                    <Badge tone="blocked">{e.code}</Badge>
                  </td>
                  <td style={{ whiteSpace: 'normal' }}>{e.message}</td>
                  <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                    {e.correction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>
            {ENHANCEMENT_ERRORS.length} shown of {ENHANCEMENT_SUMMARY.errors} errors
          </span>
          <span className="t-xs t-ter">Full list available in the download</span>
        </div>
      </div>

      <div className="stack-3" style={{ marginTop: 'var(--s4)' }}>
        <div className="callout">
          <div className="row tight" style={{ marginBottom: 5 }}>
            <LockIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
            <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
              Privacy
            </span>
          </div>
          {IMPORT_NOTES.privacy}
        </div>
        <div className="callout">
          <div className="row tight" style={{ marginBottom: 5 }}>
            <ErrorCircleIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
            <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
              Decision note
            </span>
          </div>
          {IMPORT_NOTES.decision}
        </div>
      </div>
    </Drawer>
  )
}

