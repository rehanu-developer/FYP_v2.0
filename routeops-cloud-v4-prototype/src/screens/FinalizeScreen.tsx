/**
 * Part L — Finalization with warnings.
 *
 * Clean state: all six checks pass, Finalize is enabled.
 * Warning state: unresolved warnings are listed; if any check is a BLOCKER,
 * Finalize is disabled (global rule 1: disable, don't reject) with a tooltip
 * and a Review warnings path.
 */
import { useState } from 'react'
import {
  FINALIZE_CHECKLIST_CLEAN,
  FINALIZE_CHECKLIST_WARNING,
  FINALIZE_WARNINGS,
  type FinalizeCheckItem,
} from '../data/prompt2'
import { SESSION, fmtMoney, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  CountCard,
  DL,
  DLRow,
  Segmented,
  Tooltip,
} from '../components/ui'
import {
  ArrowRightIcon,
  CheckIcon,
  ErrorCircleIcon,
  FlagIcon,
  LockIcon,
  WarningIcon,
} from '../components/icons'

export function FinalizeScreen() {
  const { activeVersion, isBaseline, pushToast, nav } = useApp()

  // Two documented states. Reviewers need both, and they cannot coexist.
  const [view, setView] = useState<'With warnings' | 'Clean state'>('With warnings')
  const checks: FinalizeCheckItem[] =
    view === 'Clean state' ? FINALIZE_CHECKLIST_CLEAN : FINALIZE_CHECKLIST_WARNING

  const blockers = checks.filter((c) => c.state === 'block')
  const warns = checks.filter((c) => c.state === 'warn')
  const blocked = blockers.length > 0
  const [reviewing, setReviewing] = useState(false)

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Finalize {activeVersion.name}</h1>
            <p className="page-sub">
              Review unresolved warnings and confirm the final route plan before export.
            </p>
          </div>
          <div className="row tight">
            <Segmented
              value={view}
              onChange={(v) => {
                setView(v)
                setReviewing(false)
              }}
              options={['With warnings', 'Clean state'] as const}
            />
          </div>
        </div>
      </div>

      {isBaseline && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="locked" title="The baseline cannot be finalized">
            Only an editable option can become the plan of record. Switch to Option 1 in the Route
            Workspace.
          </Banner>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.85fr)',
          gap: 'var(--s5)',
          alignItems: 'start',
        }}
      >
        <div className="stack-4">
          {/* Verdict banner ------------------------------------------------ */}
          {blocked ? (
            <Banner tone="error" title="Option has unresolved warnings">
              {blockers[0].detail} Finalization is blocked until blocked rule violations are
              resolved.
            </Banner>
          ) : warns.length ? (
            <Banner tone="warning" title="Option has unresolved warnings">
              Finalization is allowed, but {warns.length} check
              {warns.length === 1 ? '' : 's'} still carry warnings.
            </Banner>
          ) : (
            <Banner tone="success" title="All checks passed.">
              {activeVersion.name} is ready to finalize and export.
            </Banner>
          )}

          {/* Checklist ------------------------------------------------------ */}
          <Card>
            <div className="card-head">
              <div>
                <div className="section-title">Finalization checklist</div>
                <div className="section-sub">
                  Every check must pass before an option can become the plan of record.
                </div>
              </div>
              <Badge tone={blocked ? 'blocked' : warns.length ? 'warning' : 'valid'}>
                {checks.filter((c) => c.state === 'pass').length} of {checks.length} passing
              </Badge>
            </div>
            <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
              {checks.map((c) => (
                <div className="check-row" key={c.label}>
                  <span
                    className={`check-mark ${
                      c.state === 'pass' ? 'done' : c.state === 'warn' ? 'partial' : 'todo'
                    }`}
                    style={
                      c.state === 'block'
                        ? {
                            background: 'var(--error-bg)',
                            color: 'var(--error)',
                            borderColor: 'var(--error-border)',
                          }
                        : undefined
                    }
                  >
                    {c.state === 'pass' ? (
                      <CheckIcon size={11} />
                    ) : c.state === 'warn' ? (
                      <WarningIcon size={11} />
                    ) : (
                      <ErrorCircleIcon size={11} />
                    )}
                  </span>
                  <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span className="t-sm t-med">{c.label}</span>
                    <span
                      className="t-xs t-sec"
                      style={{ display: 'block', marginTop: 2, lineHeight: 1.5 }}
                    >
                      {c.detail}
                    </span>
                  </span>
                  <Badge
                    tone={
                      c.state === 'pass' ? 'valid' : c.state === 'warn' ? 'warning' : 'blocked'
                    }
                  >
                    {c.state === 'pass' ? 'Passed' : c.state === 'warn' ? 'Warning' : 'Blocked'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Warning detail ------------------------------------------------- */}
          {reviewing && (
            <Card>
              <div className="card-head">
                <div className="section-title">Unresolved warnings</div>
                <Badge tone="warning">{FINALIZE_WARNINGS.length}</Badge>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th className="th-num">Count</th>
                      <th>Issue</th>
                      <th>Severity</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {FINALIZE_WARNINGS.map((w) => (
                      <tr key={w.text}>
                        <td className="td-num t-semi">{w.count}</td>
                        <td style={{ whiteSpace: 'normal' }}>{w.text}</td>
                        <td>
                          <Badge tone={w.severity === 'block' ? 'blocked' : 'warning'}>
                            {w.severity === 'block' ? 'Blocking' : 'Warning'}
                          </Badge>
                        </td>
                        <td className="right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              nav('workspace', {
                                tab: 'customers',
                                ...(w.text.includes('helper') ? { drawer: 'route', id: '970' } : {}),
                              })
                            }
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-foot">
                <span className="t-xs t-ter">
                  Blocking warnings must be resolved. Non-blocking warnings are recorded with the
                  finalized plan.
                </span>
              </div>
            </Card>
          )}

          {/* Actions -------------------------------------------------------- */}
          <Card className="card-pad">
            <div className="row tight wrap">
              {blocked || isBaseline ? (
                <Tooltip
                  text={
                    isBaseline
                      ? 'The baseline can’t be finalized. Switch to an editable option.'
                      : 'Resolve blocked rule violations before finalizing.'
                  }
                >
                  <Button variant="primary" disabled icon={<FlagIcon size={14} />}>
                    Finalize {activeVersion.name}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  variant="primary"
                  icon={<FlagIcon size={14} />}
                  onClick={() => {
                    pushToast({
                      tone: 'success',
                      title: `${activeVersion.name} finalized`,
                      sub: 'The option is locked. You can now export the Stop List.',
                    })
                    nav('stop-list')
                  }}
                >
                  Finalize {activeVersion.name}
                </Button>
              )}

              <Button
                variant={blocked ? 'secondary' : 'ghost'}
                onClick={() => setReviewing((v) => !v)}
              >
                {reviewing ? 'Hide warnings' : 'Review warnings'}
              </Button>

              <Button variant="ghost" onClick={() => nav('workspace')}>
                Back to workspace
              </Button>
            </div>

            {blocked && (
              <div
                className="row tight t-xs"
                style={{ marginTop: 'var(--s3)', color: 'var(--error)' }}
              >
                <LockIcon size={12} />
                Resolve blocked rule violations before finalizing.
              </div>
            )}
          </Card>
        </div>

        {/* Plan summary ----------------------------------------------------- */}
        <div className="stack-4">
          <Card>
            <div className="card-head">
              <div className="section-title">Plan summary</div>
            </div>
            <div className="card-body">
              <DL>
                <DLRow k="Session" v={SESSION.market} />
                <DLRow k="Scenario" v={SESSION.scenario} />
                <DLRow k="Cycle" v={SESSION.cycle} />
                <DLRow k="Active version" v={activeVersion.name} />
                <DLRow k="Routes" v={String(SESSION.routes)} />
                <DLRow k="Customers" v={fmtNum(SESSION.customers)} />
                <DLRow k="Planning rows" v={fmtNum(SESSION.customers * 5)} />
                <DLRow k="Revenue" v={fmtMoney(SESSION.revenue)} />
              </DL>
            </div>
          </Card>

          <div className="row" style={{ gap: 'var(--s2)' }}>
            <CountCard
              label="Blocking"
              value={blockers.reduce((n, b) => n + (b.state === 'block' ? 14 : 0), 0)}
              tone={blocked ? 'blocked' : 'default'}
            />
            <CountCard
              label="Warnings"
              value={view === 'Clean state' ? 0 : 5}
              tone={view === 'Clean state' ? 'default' : 'warning'}
            />
          </div>

          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              What finalizing does
            </div>
            <ul
              className="t-sm t-sec"
              style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75 }}
            >
              <li>Locks {activeVersion.name} from further editing</li>
              <li>Makes it the plan of record for this session</li>
              <li>Unlocks Stop List export</li>
              <li>Records a Finalized option entry in the activity feed</li>
            </ul>
            <div style={{ marginTop: 'var(--s4)' }}>
              <Button
                size="sm"
                variant="ghost"
                iconRight={<ArrowRightIcon size={13} />}
                onClick={() => nav('stop-list')}
              >
                Preview the export
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
