/** Exports — export guard plus export history. */
import { useState } from 'react'
import { EXPORTS, FINALIZE_CHECKS, SESSION, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Modal,
  SectionHead,
  StatCard,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  ErrorCircleIcon,
  FileIcon,
  LockIcon,
  WarningIcon,
} from '../components/icons'

export function Exports() {
  const { nav, activeVersion, isBaseline, pushToast } = useApp()
  const [guardOpen, setGuardOpen] = useState(false)

  const blockers = FINALIZE_CHECKS.filter((c) => c.severity === 'blocker')
  const blockerTotal = blockers.reduce((n, c) => n + c.count, 0)
  // Export requires a finalized option. The active option here is still Draft.
  const finalized = false

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Exports</h1>
            <p className="page-sub">
              Generate route data for downstream systems. Only finalized options can be exported.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<DownloadIcon size={14} />}
            onClick={() => setGuardOpen(true)}
          >
            Export Stop List
          </Button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Exportable options"
          value="0"
          sub="Finalized options in this session"
          icon={<CheckCircleIcon size={15} />}
        />
        <StatCard
          label="Blocking issues"
          value={fmtNum(blockerTotal)}
          sub="Must be resolved before export"
          icon={<ErrorCircleIcon size={15} />}
        />
        <StatCard
          label="Stop rows"
          value={fmtNum(SESSION.customers * 5)}
          sub="Estimated stops in Option 1"
          icon={<FileIcon size={15} />}
        />
        <StatCard
          label="Last export"
          value="Last Friday"
          sub="Lafayette Final Plan"
          icon={<DownloadIcon size={15} />}
        />
      </div>

      {/* Export guard ----------------------------------------------------- */}
      <div style={{ marginBottom: 'var(--s5)' }}>
        <Banner
          tone="error"
          title={`${activeVersion.name} can’t be exported yet`}
          action={
            <Button size="sm" onClick={() => nav('workspace')} iconRight={<ArrowRightIcon size={13} />}>
              Open Workspace
            </Button>
          }
        >
          Exports require a finalized option. {activeVersion.name} is still{' '}
          {isBaseline ? 'the immutable baseline' : 'a draft'} and has {fmtNum(blockerTotal)}{' '}
          blocking validation issues.
        </Banner>
      </div>

      <SectionHead
        title="Export history"
        sub="Every export is recorded with the option it came from, so downstream data can always be traced back."
      />

      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Export Name</th>
              <th>Source Option</th>
              <th>Format</th>
              <th className="th-num">Rows</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {EXPORTS.map((e) => (
              <tr key={e.name}>
                <td>
                  <span className="row tight">
                    <FileIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="t-med">{e.name}</span>
                  </span>
                </td>
                <td>
                  <Badge tone={e.option === 'Final Plan' ? 'finalized' : 'editable'}>
                    {e.option}
                  </Badge>
                </td>
                <td className="td-muted">{e.format}</td>
                <td className="td-num">{fmtNum(e.rows)}</td>
                <td>
                  <Badge tone={e.status === 'Exported' ? 'valid' : 'blocked'}>{e.status}</Badge>
                </td>
                <td className="td-muted">{e.createdBy}</td>
                <td className="td-muted">{e.createdAt}</td>
                <td className="right">
                  {e.status === 'Exported' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<DownloadIcon size={13} />}
                      onClick={() =>
                        pushToast({ tone: 'info', title: `${e.name} downloaded` })
                      }
                    >
                      Download
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setGuardOpen(true)}>
                      Why blocked?
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>{EXPORTS.length} exports</span>
          <button className="link-btn plain t-sm" onClick={() => nav('stop-list')}>
            Preview the Stop List format
          </button>
        </div>
      </div>

      {guardOpen && (
        <Modal
          title="Export blocked"
          sub={`${activeVersion.name} must be finalized before its stop list can be exported.`}
          mark={
            <span className="modal-danger-mark">
              <LockIcon size={17} />
            </span>
          }
          onClose={() => setGuardOpen(false)}
          footer={
            <>
              <Button
                variant="primary"
                disabled={!finalized}
                onClick={() => setGuardOpen(false)}
              >
                Export Stop List
              </Button>
              <Button onClick={() => nav('workspace')}>Go to Workspace</Button>
              <Button variant="ghost" onClick={() => nav('stop-list')}>
                Preview format
              </Button>
            </>
          }
        >
          <Banner tone="error" title="Two conditions are not met">
            <ol style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.7 }}>
              <li>The option is not finalized.</li>
              <li>{fmtNum(blockerTotal)} customer rows fail validation.</li>
            </ol>
          </Banner>

          <div style={{ marginTop: 'var(--s4)' }}>
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              Blocking issues
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 var(--s4)' }}>
              {blockers.map((b) => (
                <div className="check-row" key={b.label}>
                  <span
                    className="check-mark"
                    style={{
                      background: 'var(--error-bg)',
                      color: 'var(--error)',
                      border: '1px solid var(--error-border)',
                    }}
                  >
                    <WarningIcon size={11} />
                  </span>
                  <span style={{ flex: '1 1 auto' }}>
                    <span className="t-sm t-med">{b.label}</span>
                    <span className="t-xs t-sec" style={{ display: 'block', marginTop: 2 }}>
                      {b.detail}
                    </span>
                  </span>
                  <Badge tone="blocked">{b.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
