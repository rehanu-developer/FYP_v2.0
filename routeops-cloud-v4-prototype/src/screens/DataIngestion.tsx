/** Data Ingestion — file intake queue that feeds the Master Dataset. */
import { useEffect, useState } from 'react'
import { DATASETS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  Modal,
  ProcessStrip,
  SectionHead,
  StatCard,
  TypeToConfirm,
} from '../components/ui'
import { UNDO_COPY } from '../data/prompt2'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  FileIcon,
  UploadCloudIcon,
  WarningIcon,
} from '../components/icons'

interface QueueItem {
  file: string
  kind: string
  rows: number
  stage: 'Uploaded' | 'Columns confirmed' | 'Validated' | 'Imported' | 'Needs attention'
  detail: string
}

const QUEUE: QueueItem[] = [
  {
    file: 'ExtensionReport_BR_2026-07-23.xlsx',
    kind: 'Extension Report',
    rows: 1300,
    stage: 'Imported',
    detail: 'Active master dataset. Used for all new session baselines.',
  },
  {
    file: 'CustomerMaster_Enhancement_0723.xlsx',
    kind: 'Customer Master Enhancement',
    rows: 1246,
    stage: 'Needs attention',
    detail: '14 rows blocked. Review the import error report before continuing.',
  },
  {
    file: 'RoadNet_Export_BR.prn',
    kind: 'Legacy RoadNet',
    rows: 1298,
    stage: 'Imported',
    detail: 'Archived after the July restructure.',
  },
]

export function DataIngestion() {
  const { nav, params, pushToast, runPatch } = useApp()
  const [dropped, setDropped] = useState(false)
  const [reconcileOpen, setReconcileOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  // Deep link: #/ingestion?action=reconcile opens the hard confirmation.
  useEffect(() => {
    if (params.action === 'reconcile') setReconcileOpen(true)
  }, [params.action])

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Data Ingestion</h1>
        <p className="page-sub">
          Bring routing and customer data into RouteOps Cloud. Every file passes column
          confirmation and validation before it can change the master dataset.
        </p>
      </div>

      <Card className="card-pad" style={{ marginBottom: 'var(--s5)' }}>
        <ProcessStrip
          nodes={[
            { label: 'Upload', state: 'on' },
            { label: 'Confirm Columns' },
            { label: 'Validate' },
            { label: 'Review Errors' },
            { label: 'Import' },
          ]}
        />
      </Card>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Files this week"
          value="3"
          sub="Uploaded across all sources"
          icon={<FileIcon size={15} />}
        />
        <StatCard
          label="Imported"
          value="2"
          sub="Successfully applied"
          icon={<CheckCircleIcon size={15} />}
        />
        <StatCard
          label="Needs attention"
          value="1"
          sub="Blocked rows to resolve"
          icon={<WarningIcon size={15} />}
        />
        <StatCard
          label="Last activity"
          value="Today"
          sub="4:38 PM by Michael Reeves"
          icon={<ClockIcon size={15} />}
        />
      </div>

      <div style={{ marginBottom: 'var(--s6)' }}>
        <SectionHead
          title="Upload a file"
          sub="Supported formats: .xlsx and .prn. Files are staged for review and never applied automatically."
        />
        {dropped ? (
          <Card className="card-pad">
            <div className="file-pill">
              <FileIcon size={16} style={{ color: 'var(--accent)' }} />
              <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                <span className="t-med t-sm" style={{ display: 'block' }}>
                  CustomerMaster_Enhancement_0723.xlsx
                </span>
                <span className="t-xs t-ter">1,246 rows · 8 columns detected</span>
              </span>
              <Badge tone="progress">Staged</Badge>
            </div>
            <div className="row tight" style={{ marginTop: 'var(--s4)' }}>
              <Button
                variant="primary"
                iconRight={<ArrowRightIcon size={14} />}
                onClick={() => nav('master-import')}
              >
                Confirm Columns
              </Button>
              <Button onClick={() => setDropped(false)}>Remove</Button>
            </div>
          </Card>
        ) : (
          <button
            className="dropzone"
            style={{ width: '100%', font: 'inherit' }}
            onClick={() => setDropped(true)}
          >
            <div className="dropzone-icon">
              <UploadCloudIcon size={26} />
            </div>
            <div className="dropzone-title">
              Drop file here or <em>browse</em>
            </div>
            <div className="dropzone-help">Supported formats: .xlsx and .prn</div>
          </button>
        )}
      </div>

      <SectionHead title="Ingestion queue" />
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>File</th>
              <th>Type</th>
              <th className="th-num">Rows</th>
              <th>Stage</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {QUEUE.map((q) => (
              <tr key={q.file}>
                <td>
                  <span className="row tight">
                    <FileIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="t-med">{q.file}</span>
                  </span>
                </td>
                <td className="td-muted">{q.kind}</td>
                <td className="td-num">{fmtNum(q.rows)}</td>
                <td>
                  <Badge
                    tone={
                      q.stage === 'Imported'
                        ? 'valid'
                        : q.stage === 'Needs attention'
                          ? 'warning'
                          : 'progress'
                    }
                  >
                    {q.stage}
                  </Badge>
                </td>
                <td className="td-muted" style={{ whiteSpace: 'normal', maxWidth: 340 }}>
                  {q.detail}
                </td>
                <td className="right">
                  {q.stage === 'Needs attention' ? (
                    <Button size="sm" onClick={() => nav('master-import')}>
                      Review
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => nav('master-dataset')}>
                      View
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>{QUEUE.length} files · {DATASETS.length} datasets total</span>
          <span className="t-xs t-ter">Files are retained for audit after import.</span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <Banner tone="info" title="Imports never overwrite a session">
          Importing a dataset changes the master dataset only. Existing session baselines keep the
          snapshot they were created from.
        </Banner>
      </div>

      {/* Extension Report reconcile — the only path that creates or removes
          customers, and a permanent, non-undoable action. */}
      <div style={{ marginTop: 'var(--s6)' }}>
        <SectionHead
          title="Extension Report reconcile"
          sub="The only flow that adds new customers to a session or removes departed ones. Customer Master enhancement imports never create customers."
        />
        <Card className="card-pad">
          <div className="row wrap" style={{ gap: 'var(--s6)', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 320px', minWidth: 260 }}>
              <div className="row tight" style={{ marginBottom: 8 }}>
                <Badge tone="warning">22 new customers</Badge>
                <Badge tone="blocked">6 removed customers</Badge>
              </div>
              <p className="t-sm t-sec" style={{ lineHeight: 1.6 }}>
                The latest Extension Report differs from Option 1. Applying the reconcile brings
                the option in line with the report.
              </p>
            </div>
            <div className="row tight">
              <Button variant="danger" onClick={() => setReconcileOpen(true)}>
                Apply reconcile
              </Button>
              <span className="t-xs t-ter" style={{ maxWidth: 200, lineHeight: 1.5 }}>
                Permanent action. Cannot be undone from the activity feed.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Part H state 5 — permanent action hard confirmation --------------- */}
      {reconcileOpen && (
        <Modal
          title={UNDO_COPY.permanentTitle}
          sub={UNDO_COPY.permanentBody}
          mark={
            <span className="modal-danger-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => {
            setReconcileOpen(false)
            setConfirmText('')
          }}
          footer={
            <>
              <Button
                variant="danger"
                disabled={confirmText.trim().toUpperCase() !== UNDO_COPY.permanentKeyword}
                onClick={() => {
                  setReconcileOpen(false)
                  setConfirmText('')
                  runPatch()
                  pushToast({
                    tone: 'success',
                    title: 'Reconcile applied.',
                    sub: '22 customers added, 6 removed. This action cannot be undone.',
                  })
                }}
              >
                Apply reconcile
              </Button>
              <Button
                onClick={() => {
                  setReconcileOpen(false)
                  setConfirmText('')
                }}
              >
                Cancel
              </Button>
            </>
          }
        >
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="error" title="This cannot be reversed from the activity feed">
              6 customers will be permanently removed from Option 1. 22 new customers will be
              added. The activity feed will record the reconcile with a No undo badge.
            </Banner>
          </div>
          <TypeToConfirm
            keyword={UNDO_COPY.permanentKeyword}
            value={confirmText}
            onChange={setConfirmText}
          />
        </Modal>
      )}
    </div>
  )
}
