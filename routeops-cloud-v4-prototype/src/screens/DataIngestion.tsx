/** Data Ingestion — file intake queue that feeds the Master Dataset. */
import { useState } from 'react'
import { DATASETS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  ProcessStrip,
  SectionHead,
  StatCard,
} from '../components/ui'
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
  const { nav } = useApp()
  const [dropped, setDropped] = useState(false)

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
    </div>
  )
}
