/**
 * Finalize Option — UPDATED to the confirmed direction.
 *
 * The gate now enforces the real handheld output requirements:
 *   Blocking issues  -> must be resolved (missing route/day/week, invalid
 *                       frequency, not in Customer Master while still included,
 *                       invalid Sales Group, weekend scheduling)
 *   Warnings         -> can ship once acknowledged (preferred route mismatch,
 *                       route over 45h, reduced balance, excluded load
 *                       customers, service pattern overrides)
 *
 * Deep links: #/finalize?state=blockers | warnings
 */
import { useEffect, useState } from 'react'
import {
  FINALIZE_BLOCKERS,
  FINALIZE_CHECKLIST,
  FINALIZE_COPY,
  FINALIZE_WARNINGS_LIST,
} from '../data/prompt2'
import { SESSION, fmtMoney, fmtNum } from '../data/mock'
import { COPY, ROUTE_HOURS_TARGET } from '../data/rules'
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
  const { activeVersion, isBaseline, pushToast, nav, params } = useApp()

  /**
   * Two documented states. They cannot coexist, so a labelled switcher lets
   * reviewers see both. Deep-linkable via ?state=blockers | warnings.
   */
  const [view, setView] = useState<'With blocking issues' | 'Warnings only'>(
    params.state === 'warnings' ? 'Warnings only' : 'With blocking issues',
  )
  useEffect(() => {
    if (params.state === 'warnings') setView('Warnings only')
    if (params.state === 'blockers') setView('With blocking issues')
  }, [params.state])

  const [acknowledged, setAcknowledged] = useState(false)
  const [reviewing, setReviewing] = useState<'none' | 'blockers' | 'warnings'>('none')

  const hasBlockers = view === 'With blocking issues'
  const blockers = hasBlockers ? FINALIZE_BLOCKERS : []
  const warnings = FINALIZE_WARNINGS_LIST

  const blockerTotal = blockers.reduce((n, b) => n + b.count, 0)
  const warningTotal = warnings.reduce((n, w) => n + w.count, 0)

  /** Checklist items that fail while blockers exist. */
  const failingChecks = new Set(
    hasBlockers
      ? [
          'All included customers have a delivery week',
          'Frequency is valid: 7, 14, 28, or 56 days',
          'Sales Group validated',
          'No Customer Master missing customers included in handheld output',
        ]
      : [],
  )
  const warnChecks = new Set(['Route warnings reviewed', 'Helper selections reviewed'])

  const canFinalize = !hasBlockers && !isBaseline && acknowledged

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Finalize {activeVersion.name}</h1>
            <p className="page-sub">{FINALIZE_COPY.intro}</p>
          </div>
          <Segmented
            value={view}
            onChange={(v) => {
              setView(v)
              setReviewing('none')
              setAcknowledged(false)
            }}
            options={['With blocking issues', 'Warnings only'] as const}
          />
        </div>
      </div>

      {isBaseline && (
        <div style={{ marginBottom: 'var(--s4)' }}>
          <Banner tone="locked" title="The baseline cannot be finalized">
            Only an editable option can become the plan of record. Switch to Option 1 in the
            Route Workspace.
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
          {/* Verdict ------------------------------------------------------- */}
          {hasBlockers ? (
            <Banner tone="error" title="Blocking issues must be resolved">
              {FINALIZE_COPY.split}
            </Banner>
          ) : acknowledged ? (
            <Banner tone="success" title="Warnings acknowledged">
              {activeVersion.name} is ready to finalize and export.
            </Banner>
          ) : (
            <Banner tone="warning" title="Warnings to review">
              No blocking issues remain. {FINALIZE_COPY.acknowledgeHint}
            </Banner>
          )}

          {/* Counts -------------------------------------------------------- */}
          <div className="row" style={{ gap: 'var(--s2)' }}>
            <CountCard
              label="Blocking issues"
              value={fmtNum(blockerTotal)}
              tone={blockerTotal ? 'blocked' : 'valid'}
            />
            <CountCard label="Warnings" value={fmtNum(warningTotal)} tone="warning" />
            <CountCard
              label="Ready for handheld"
              value={fmtNum(SESSION.customers - blockerTotal - 4)}
              tone="valid"
            />
          </div>

          {/* Blocking Issues ---------------------------------------------- */}
          {blockers.length > 0 && (
            <Card>
              <div className="card-head">
                <div>
                  <div className="section-title">Blocking Issues</div>
                  <div className="section-sub">
                    Must be resolved before the handheld file can be generated.
                  </div>
                </div>
                <Badge tone="blocked">{fmtNum(blockerTotal)}</Badge>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th className="th-num">Count</th>
                      <th>Issue</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {blockers.map((b) => (
                      <tr key={b.text}>
                        <td className="td-num t-semi">{b.count}</td>
                        <td style={{ whiteSpace: 'normal' }}>{b.text}</td>
                        <td className="right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => nav('workspace', { tab: 'customers' })}
                          >
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-foot">
                <span className="row tight t-xs" style={{ color: 'var(--error)' }}>
                  <LockIcon size={12} />
                  {FINALIZE_COPY.blockedTooltip}
                </span>
              </div>
            </Card>
          )}

          {/* Warnings to Review ------------------------------------------- */}
          <Card>
            <div className="card-head">
              <div>
                <div className="section-title">Warnings to Review</div>
                <div className="section-sub">
                  Allowed during planning. These can ship once acknowledged.
                </div>
              </div>
              <Badge tone="warning">{fmtNum(warningTotal)}</Badge>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="th-num">Count</th>
                    <th>Warning</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {warnings.map((w) => (
                    <tr key={w.text}>
                      <td className="td-num t-semi">{w.count}</td>
                      <td style={{ whiteSpace: 'normal' }}>{w.text}</td>
                      <td className="right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            nav(
                              w.text.includes('routes exceed') ? 'workspace' : 'workspace',
                              w.text.includes('routes exceed')
                                ? { tab: 'routes' }
                                : { tab: 'customers' },
                            )
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
              {acknowledged ? (
                <span className="row tight t-xs" style={{ color: 'var(--success)' }}>
                  <CheckIcon size={12} />
                  {warningTotal} warnings acknowledged before finalization.
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={hasBlockers}
                  onClick={() => {
                    setAcknowledged(true)
                    pushToast({
                      tone: 'success',
                      title: `${warningTotal} warnings acknowledged before finalization.`,
                      sub: 'Recorded in the activity feed. Not undoable.',
                    })
                  }}
                >
                  Acknowledge Warnings
                </Button>
              )}
              {hasBlockers && !acknowledged && (
                <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
                  Resolve blocking issues before acknowledging warnings.
                </span>
              )}
            </div>
          </Card>

          {/* Checklist ---------------------------------------------------- */}
          <Card>
            <div className="card-head">
              <div className="section-title">Finalization checklist</div>
              <Badge tone={hasBlockers ? 'blocked' : 'valid'}>
                {FINALIZE_CHECKLIST.length - failingChecks.size} of{' '}
                {FINALIZE_CHECKLIST.length} passing
              </Badge>
            </div>
            <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
              {FINALIZE_CHECKLIST.map((label) => {
                const failing = failingChecks.has(label)
                const warn = !failing && warnChecks.has(label) && !acknowledged
                return (
                  <div className="check-row" key={label}>
                    <span
                      className={`check-mark ${failing ? 'todo' : warn ? 'partial' : 'done'}`}
                      style={
                        failing
                          ? {
                              background: 'var(--error-bg)',
                              color: 'var(--error)',
                              borderColor: 'var(--error-border)',
                            }
                          : undefined
                      }
                    >
                      {failing ? (
                        <ErrorCircleIcon size={11} />
                      ) : warn ? (
                        <WarningIcon size={11} />
                      ) : (
                        <CheckIcon size={11} />
                      )}
                    </span>
                    <span className="t-sm" style={{ flex: '1 1 auto' }}>
                      {label}
                    </span>
                    <Badge tone={failing ? 'blocked' : warn ? 'warning' : 'valid'}>
                      {failing ? 'Blocked' : warn ? 'Review' : 'Passed'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Actions ------------------------------------------------------- */}
          <Card className="card-pad">
            <div className="row tight wrap">
              {canFinalize ? (
                <Button
                  variant="primary"
                  icon={<FlagIcon size={14} />}
                  onClick={() => {
                    pushToast({
                      tone: 'success',
                      title: `${activeVersion.name} finalized`,
                      sub: 'The option is locked. You can now generate the handheld file.',
                    })
                    nav('stop-list', { state: 'ready' })
                  }}
                >
                  Finalize {activeVersion.name}
                </Button>
              ) : (
                <Tooltip
                  text={
                    isBaseline
                      ? 'The baseline can’t be finalized. Switch to an editable option.'
                      : hasBlockers
                        ? FINALIZE_COPY.blockedTooltip
                        : 'Acknowledge the warnings to enable finalization.'
                  }
                >
                  <Button variant="primary" disabled icon={<FlagIcon size={14} />}>
                    Finalize {activeVersion.name}
                  </Button>
                </Tooltip>
              )}

              {hasBlockers && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setReviewing(reviewing === 'blockers' ? 'none' : 'blockers')
                  }
                >
                  Review Blocking Issues
                </Button>
              )}
              <Button variant="ghost" onClick={() => nav('workspace')}>
                Back to workspace
              </Button>
            </div>

            <div className="t-xs t-ter" style={{ marginTop: 'var(--s3)', lineHeight: 1.55 }}>
              {COPY.finalization}
            </div>

            {reviewing === 'blockers' && (
              <div className="callout" style={{ marginTop: 'var(--s4)' }}>
                <strong style={{ color: 'var(--text)' }}>What to fix first:</strong> assign the
                missing delivery weeks, then either create the missing Customer Master records or
                exclude those customers from handheld output. Invalid frequencies need a service
                pattern on a 7, 14, 28 or 56 day cycle.
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
                <DLRow k="Route target" v={`${ROUTE_HOURS_TARGET}h weekly`} />
                <DLRow k="Revenue" v={fmtMoney(SESSION.revenue)} />
              </DL>
            </div>
          </Card>

          <Card className="card-pad">
            <div className="strip-label" style={{ marginBottom: 'var(--s2)' }}>
              What finalizing does
            </div>
            <ul className="t-sm t-sec" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75 }}>
              <li>Locks {activeVersion.name} from further editing</li>
              <li>Makes it the plan of record for this session</li>
              <li>Unlocks handheld file generation</li>
              <li>Records the acknowledged warnings in the activity feed</li>
            </ul>
            <div style={{ marginTop: 'var(--s4)' }}>
              <Button
                size="sm"
                variant="ghost"
                iconRight={<ArrowRightIcon size={13} />}
                onClick={() => nav('stop-list')}
              >
                Preview handheld output
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
