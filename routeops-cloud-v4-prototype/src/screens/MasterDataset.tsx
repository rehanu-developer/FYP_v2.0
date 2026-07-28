/**
 * Part C — Master Dataset overview.
 * Includes the populated table, the documented empty state, and the
 * Upload Dataset modal. Toggle the empty state from the header to review it.
 */
import { useState } from 'react'
import { DATASETS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  ProgressBar,
  SectionHead,
  StatCard,
  Segmented,
} from '../components/ui'
import {
  CircleStackIcon,
  ClockIcon,
  CheckCircleIcon,
  FileIcon,
  PlusIcon,
  ShareIcon,
  UploadCloudIcon,
  UserGroupIcon,
  XIcon,
} from '../components/icons'

export function MasterDataset() {
  const { pushToast } = useApp()
  const [view, setView] = useState<'Populated' | 'Empty state'>('Populated')
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Active Master Dataset</h1>
            <p className="page-sub">
              Review the current source of truth used to create new session baselines.
            </p>
          </div>
          <div className="row tight">
            {/* Prototype affordance so reviewers can see both states. */}
            <Segmented
              value={view}
              onChange={setView}
              options={['Populated', 'Empty state'] as const}
            />
            <Button
              variant="primary"
              icon={<PlusIcon size={14} />}
              onClick={() => setUploadOpen(true)}
            >
              Upload Dataset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Customers"
          value={view === 'Empty state' ? '—' : fmtNum(1300)}
          sub="Unique customer records"
          icon={<UserGroupIcon size={15} />}
        />
        <StatCard
          label="Routes"
          value={view === 'Empty state' ? '—' : '8'}
          sub="Distinct routes in dataset"
          icon={<ShareIcon size={15} />}
        />
        <StatCard
          label="Last Upload"
          value={view === 'Empty state' ? '—' : 'Today'}
          sub={view === 'Empty state' ? 'No uploads recorded' : '4:38 PM by Michael Reeves'}
          icon={<ClockIcon size={15} />}
        />
        <StatCard
          label="Dataset Status"
          value={
            view === 'Empty state' ? (
              <span className="t-ter">—</span>
            ) : (
              <Badge tone="valid" lg dot>
                Active
              </Badge>
            )
          }
          sub={
            view === 'Empty state'
              ? 'Awaiting first dataset'
              : 'Used for all new session baselines'
          }
          icon={<CheckCircleIcon size={15} />}
        />
      </div>

      <SectionHead
        title="Recent Datasets"
        sub="Only one dataset can be Active at a time. New sessions always snapshot the Active dataset."
      />

      <div className="table-wrap">
        {view === 'Empty state' ? (
          <EmptyState
            icon={<CircleStackIcon size={20} />}
            title="No datasets uploaded yet"
            sub="Uploaded or ingested datasets will appear here once customer and routing data has been added to the system."
            actions={
              <Button
                variant="primary"
                icon={<UploadCloudIcon size={14} />}
                onClick={() => setUploadOpen(true)}
              >
                Upload Dataset
              </Button>
            }
          />
        ) : (
          <>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Dataset Name</th>
                  <th>Source</th>
                  <th className="th-num">Rows</th>
                  <th>Status</th>
                  <th>Uploaded By</th>
                  <th>Uploaded At</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {DATASETS.map((d) => (
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
                      <Badge
                        tone={
                          d.status === 'Active'
                            ? 'valid'
                            : d.status === 'Imported'
                              ? 'info'
                              : 'default'
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="td-muted">{d.uploadedBy}</td>
                    <td className="td-muted">{d.uploadedAt}</td>
                    <td className="right">
                      <Button size="sm" variant="ghost">
                        {d.status === 'Active' ? 'View' : 'Set Active'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-foot">
              <span>Showing {DATASETS.length} of {DATASETS.length} datasets</span>
              <span className="t-xs t-ter">
                Archived datasets are retained for audit but cannot seed a new baseline.
              </span>
            </div>
          </>
        )}
      </div>

      {uploadOpen && (
        <UploadDatasetModal
          onClose={() => setUploadOpen(false)}
          onDone={() => {
            setUploadOpen(false)
            setView('Populated')
            pushToast({
              tone: 'success',
              title: 'Dataset uploaded',
              sub: '1,300 rows staged for review. Set it Active to use it for new baselines.',
            })
          }}
        />
      )}
    </div>
  )
}

/* ==========================================================================
   Upload Dataset modal — includes the in-flight progress state
   ========================================================================== */

function UploadDatasetModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [file, setFile] = useState<string | null>(null)
  const [phase, setPhase] = useState<'pick' | 'uploading'>('pick')
  const [pct, setPct] = useState(0)

  const start = () => {
    setPhase('uploading')
    let p = 0
    const t = window.setInterval(() => {
      p += 9 + Math.random() * 11
      if (p >= 100) {
        window.clearInterval(t)
        setPct(100)
        window.setTimeout(onDone, 320)
      } else {
        setPct(p)
      }
    }, 170)
  }

  return (
    <Modal
      title="Upload Dataset"
      sub="Add a new dataset to review and import into the system."
      onClose={onClose}
      footer={
        phase === 'pick' ? (
          <>
            <Button variant="primary" disabled={!file} onClick={start}>
              Upload
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </>
        ) : (
          <>
            <Button variant="primary" disabled>
              Uploading…
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </>
        )
      }
    >
      <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)', lineHeight: 1.55 }}>
        Upload a supported file to preview its records and check changes before saving it.
      </p>

      {phase === 'pick' ? (
        file ? (
          <div className="file-pill">
            <FileIcon size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span className="t-med t-sm" style={{ display: 'block' }}>
                {file}
              </span>
              <span className="t-xs t-ter">1,300 rows detected · 2.4 MB</span>
            </span>
            <button className="icon-btn" onClick={() => setFile(null)} aria-label="Remove file">
              <XIcon size={14} />
            </button>
          </div>
        ) : (
          <button
            className="dropzone"
            style={{ width: '100%', font: 'inherit' }}
            onClick={() => setFile('ExtensionReport_BR_2026-07-24.xlsx')}
          >
            <div className="dropzone-icon">
              <UploadCloudIcon size={26} />
            </div>
            <div className="dropzone-title">
              Drop file here or <em>browse</em>
            </div>
            <div className="dropzone-help">Supported formats: .xlsx and .prn</div>
          </button>
        )
      ) : (
        <Card className="card-pad">
          <div className="row" style={{ marginBottom: 'var(--s3)' }}>
            <FileIcon size={15} style={{ color: 'var(--accent)' }} />
            <span className="t-med t-sm" style={{ flex: '1 1 auto' }}>
              {file}
            </span>
            <span className="t-xs t-ter tnum">{Math.round(pct)}%</span>
          </div>
          <ProgressBar pct={pct} />
          <div className="t-xs t-sec" style={{ marginTop: 'var(--s3)' }}>
            {pct < 45
              ? 'Uploading file…'
              : pct < 80
                ? 'Reading rows and detecting columns…'
                : 'Validating against Reference Data…'}
          </div>
        </Card>
      )}
    </Modal>
  )
}
