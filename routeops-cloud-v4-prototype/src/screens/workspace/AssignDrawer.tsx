/**
 * Bulk Assign Day / Week — UPDATED to the confirmed direction.
 *
 * Previous behaviour: all-or-nothing, with blocked rows refusing the write.
 * New behaviour: the assignment is ALLOWED for the whole selection. Service
 * pattern concerns become tracked warnings, not a refusal.
 *
 * Hard blocks remain in exactly two cases:
 *   1. Weekend scheduling  — Sat/Sun are not offered at all; the block exists
 *                            only as a guard for deep links.
 *   2. Week outside cycle  — the picker only offers valid weeks, same reasoning.
 *
 * Deep links:
 *   #/workspace?drawer=assign&day=Fri&week=3
 *   #/workspace?drawer=assign&day=Sat        -> weekend hard block
 */
import { useEffect, useMemo, useState } from 'react'
import {
  SESSION,
  SERVICE_PATTERNS,
  WEEKDAY_FULL,
  fmtNum,
  validateScope,
  type Weekday,
} from '../../data/mock'
import {
  COPY,
  SCHEDULABLE_DAYS,
  WEEKEND_COPY,
  WEEKEND_DAYS,
  invalidWeekMessage,
  isSchedulableDay,
  isValidWeek,
  validWeeks,
  weekPairs,
} from '../../data/rules'
import { useApp } from '../../state/AppState'
import {

  Banner,
  Button,
  CountCard,
  Drawer,
  ProgressBar,
  Segmented,
  StepList,
  ToggleChip,
  Tooltip,
  type StepState,
} from '../../components/ui'
import { CheckCircleIcon, WarningIcon } from '../../components/icons'

type Phase = 'pick' | 'validating' | 'review' | 'applying' | 'weekend-blocked'

const STEP_LABELS = [
  'Validating service patterns…',
  'Checking cycle weeks…',
  'Updating selected customer rows…',
  'Recalculating route metrics…',
  'Refreshing route summary…',
]

export function AssignDrawer({
  onClose,
  initialDay,
  initialWeek,
}: {
  onClose: () => void
  initialDay?: Weekday
  initialWeek?: number
}) {
  const { selection, pushToast, clearSelection, setDirty, activeVersion, runPatch } =
    useApp()

  const [cycleWeeks, setCycleWeeks] = useState<4 | 8>(SESSION.cycleWeeks as 4 | 8)
  const [day, setDay] = useState<Weekday | null>(initialDay ?? 'Fri')
  const [week, setWeek] = useState<number | null>(initialWeek ?? 3)
  const [phase, setPhase] = useState<Phase>('pick')
  const [checked, setChecked] = useState(0)
  const [reviewing, setReviewing] = useState(false)

  const scopeCount =
    selection.mode === 'matching' ? selection.matchingCount : selection.ids.length
  const noun = scopeCount === 1 ? 'customer' : 'customers'
  const scopeLabel =
    selection.mode === 'matching'
      ? `${fmtNum(scopeCount)} ${noun} selected${
          selection.matchingLabel && selection.matchingLabel !== 'all customers'
            ? ` from ${selection.matchingLabel}`
            : ''
        }`
      : `${fmtNum(scopeCount)} ${noun} selected`

  /* --- hard blocks (the only two that remain) ---------------------------- */

  const weekendBlocked = day !== null && !isSchedulableDay(day)
  const weekBlocked = week !== null && !isValidWeek(week, cycleWeeks)
  const hardBlocked = weekendBlocked || weekBlocked

  /* --- warnings: allowed, but tracked ----------------------------------- */

  const scopeResult = useMemo(
    () => (day && week && !hardBlocked ? validateScope(day, week) : null),
    [day, week, hardBlocked],
  )

  /** Customers whose pattern may need review after this assignment. */
  const warnCount = useMemo(() => {
    if (!scopeResult || !scopeResult.failed) return 0
    if (scopeCount >= scopeResult.total) return scopeResult.failed
    return Math.max(1, Math.round((scopeResult.failed / scopeResult.total) * scopeCount))
  }, [scopeResult, scopeCount])

  const warnPatterns = scopeResult?.groups.map((g) => g.pattern) ?? []

  // Clamp the week when switching to a shorter cycle.
  useEffect(() => {
    if (week && week > cycleWeeks) setWeek(null)
  }, [cycleWeeks, week])

  // A deep link may land straight on an invalid day.
  useEffect(() => {
    if (day && !isSchedulableDay(day)) setPhase('weekend-blocked')
  }, [day])

  useEffect(() => {
    if (phase === 'applying') return
    setPhase(day && !isSchedulableDay(day) ? 'weekend-blocked' : 'pick')
    setReviewing(false)
  }, [day, week]) // eslint-disable-line react-hooks/exhaustive-deps

  /* --- transitions ------------------------------------------------------- */

  const validate = () => {
    setPhase('validating')
    window.setTimeout(() => setPhase('review'), 700)
  }

  const apply = () => {
    setPhase('applying')
    setChecked(0)
    const total = scopeCount
    const step = Math.max(1, Math.round(total / 14))
    let done = 0
    const t = window.setInterval(() => {
      done = Math.min(total, done + step)
      setChecked(done)
      if (done < total) return
      window.clearInterval(t)
      window.setTimeout(() => {
        setDirty(true)
        runPatch()
        pushToast({
          tone: 'success',
          title: `${fmtNum(total)} customers assigned to ${WEEKDAY_FULL[day!]}, Week ${week}.`,
          sub: warnCount
            ? `${warnCount} warnings added to review list.`
            : `Changes applied to ${activeVersion.name}.`,
          undoLabel: 'Undo',
          onUndo: () =>
            pushToast({
              tone: 'info',
              title: 'Assignment reverted.',
              sub: `${fmtNum(total)} customer rows restored to their previous day and week.`,
            }),
        })
        clearSelection()
        onClose()
      }, 400)
    }, 180)
  }

  const stepStates: StepState[] = STEP_LABELS.map((_, i) => {
    const pct = scopeCount ? checked / scopeCount : 0
    const boundary = (i + 1) / STEP_LABELS.length
    if (pct >= boundary) return 'done'
    if (pct >= i / STEP_LABELS.length) return 'active'
    return 'todo'
  })

  /* --- footer ------------------------------------------------------------ */

  const footer = (() => {
    if (phase === 'weekend-blocked')
      return (
        <>
          <Tooltip text={WEEKEND_COPY.blockBody}>
            <Button variant="primary" disabled>
              Apply Assignment
            </Button>
          </Tooltip>
          <Button onClick={() => setDay('Fri')}>Choose a weekday</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </>
      )

    if (phase === 'pick' || phase === 'validating')
      return (
        <>
          <Button
            variant="primary"
            disabled={!day || week === null || hardBlocked || phase === 'validating'}
            onClick={validate}
          >
            {phase === 'validating' ? 'Checking…' : 'Continue'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </>
      )

    if (phase === 'applying')
      return (
        <>
          <Button variant="primary" disabled>
            Applying…
          </Button>
          <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
            Do not close this drawer
          </span>
        </>
      )

    // review — the assignment is always allowed from here
    return (
      <>
        <Button variant="primary" onClick={apply}>
          Apply Assignment
        </Button>
        {warnCount > 0 && (
          <Button onClick={() => setReviewing((v) => !v)}>
            {reviewing ? 'Hide Warnings' : 'Review Warnings'}
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </>
    )
  })()

  return (
    <Drawer
      title="Assign Day / Week"
      sub={`Update delivery day and cycle week for the selected customers in ${activeVersion.name}.`}
      onClose={onClose}
      footer={footer}
      wide={reviewing}
    >
      {/* Scope ------------------------------------------------------------ */}
      <div className="callout" style={{ marginBottom: 'var(--s5)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="strip-label">Current cycle</span>
          <span className="t-med t-sm">{cycleWeeks} Week</span>
        </div>
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span className="strip-label">Selection scope</span>
          <span className="t-med t-sm" style={{ textAlign: 'right' }}>
            {scopeLabel}
          </span>
        </div>
      </div>

      {/* Hard block: weekend --------------------------------------------- */}
      {phase === 'weekend-blocked' && (
        <div style={{ marginBottom: 'var(--s5)' }}>
          <Banner tone="error" title={WEEKEND_COPY.blockTitle}>
            {WEEKEND_COPY.blockBody}
          </Banner>
        </div>
      )}

      {/* Hard block: week outside the cycle ------------------------------- */}
      {weekBlocked && week !== null && (
        <div style={{ marginBottom: 'var(--s5)' }}>
          <Banner tone="error" title="Week is not available">
            {invalidWeekMessage(week, cycleWeeks)}
          </Banner>
        </div>
      )}

      {phase === 'applying' ? (
        <ApplyingState
          checked={checked}
          total={scopeCount}
          steps={STEP_LABELS.map((label, i) => ({ label, state: stepStates[i] }))}
        />
      ) : (
        <>
          {/* Day picker — Monday to Friday only ----------------------- */}
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Delivery Day</label>
            <div className="day-group">
              {SCHEDULABLE_DAYS.map((d) => (
                <ToggleChip key={d} on={day === d} onClick={() => setDay(d)}>
                  {d}
                </ToggleChip>
              ))}
              {/* Weekends shown disabled so the rule is visible, not guessed. */}
              {WEEKEND_DAYS.map((d) => (
                <Tooltip key={d} text={WEEKEND_COPY.fieldHelper}>
                  <ToggleChip disabled>{d}</ToggleChip>
                </Tooltip>
              ))}
            </div>
            <span className="field-help">{WEEKEND_COPY.helper}</span>
          </div>

          {/* Week picker — only weeks that exist in the cycle --------- */}
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Delivery Week</label>
            {cycleWeeks === 8 ? (
              <>
                <span className="field-help" style={{ marginBottom: 6 }}>
                  In an 8-week cycle, weeks are planned as pairs.
                </span>
                <div className="grid-2" style={{ gap: 'var(--s2)' }}>
                  {weekPairs(cycleWeeks).map(([a, b], i) => (
                    <div
                      className={`week-pair${week === a || week === b ? ' on' : ''}`}
                      key={i}
                    >
                      <div className="week-pair-label">
                        Pair {i + 1}: Wk {a} + Wk {b}
                      </div>
                      <div className="day-group">
                        <ToggleChip on={week === a} onClick={() => setWeek(a)}>
                          Wk {a}
                        </ToggleChip>
                        <ToggleChip on={week === b} onClick={() => setWeek(b)}>
                          Wk {b}
                        </ToggleChip>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="field-help" style={{ marginBottom: 6 }}>
                  A 4-week cycle has no week pairs. Weeks 5–8 do not exist.
                </span>
                <div className="day-group">
                  {validWeeks(cycleWeeks).map((w) => (
                    <ToggleChip key={w} on={week === w} onClick={() => setWeek(w)}>
                      Wk {w}
                    </ToggleChip>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Review: the assignment is allowed, warnings are tracked --- */}
          {phase === 'review' && day && week !== null && (
            <>
              <div style={{ marginBottom: 'var(--s4)' }}>
                <Banner
                  tone={warnCount ? 'warning' : 'success'}
                  title="Apply day/week assignment"
                >
                  {fmtNum(scopeCount)} selected customers will be assigned to{' '}
                  {WEEKDAY_FULL[day]}, Week {week}.
                </Banner>
              </div>

              <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
                <CountCard
                  label="Will be assigned"
                  value={fmtNum(scopeCount)}
                  tone="valid"
                />
                <CountCard
                  label="Warnings"
                  value={fmtNum(warnCount)}
                  tone={warnCount ? 'warning' : 'default'}
                />
              </div>

              {warnCount > 0 && (
                <div className="callout" style={{ marginBottom: 'var(--s4)' }}>
                  <div className="row tight" style={{ marginBottom: 5 }}>
                    <WarningIcon size={14} style={{ color: 'var(--warning)' }} />
                    <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
                      {fmtNum(warnCount)} customers may need service pattern review after this
                      assignment.
                    </span>
                  </div>
                  {warnPatterns.length > 0 && (
                    <>
                      Patterns {warnPatterns.join(' and ')} do not currently include{' '}
                      {WEEKDAY_FULL[day]}. The assignment still applies; these rows are added to
                      the review list.
                    </>
                  )}
                </div>
              )}

              {reviewing && warnCount > 0 && (
                <div className="table-wrap">
                  <div className="table-toolbar">
                    <span className="t-sm t-med">Warnings to review</span>
                    <span className="spacer" />
                    <span className="t-xs t-ter">
                      Allowed with warning · tracked for finalize
                    </span>
                  </div>
                  <div className="table-scroll">
                    <table className="tbl" style={{ minWidth: 560 }}>
                      <thead>
                        <tr>
                          <th>Pattern</th>
                          <th className="th-num">Customers</th>
                          <th>Allowed days</th>
                          <th style={{ minWidth: 220 }}>Warning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scopeResult?.groups.map((g) => (
                          <tr key={g.pattern}>
                            <td className="mono t-med">{g.pattern}</td>
                            <td className="td-num">{fmtNum(g.count)}</td>
                            <td className="td-muted t-xs">
                              {SERVICE_PATTERNS[g.pattern]?.allowedDays.join(' ') ?? '—'}
                            </td>
                            <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                              {COPY.servicePattern}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-foot">
                    <span>Warnings do not stop the assignment.</span>
                    <span className="t-xs t-ter">Resolve or acknowledge before finalize.</span>
                  </div>
                </div>
              )}

              {warnCount === 0 && (
                <div className="callout row tight">
                  <CheckCircleIcon size={14} style={{ color: 'var(--success)' }} />
                  No pattern conflicts. Every selected customer already supports{' '}
                  {WEEKDAY_FULL[day]}.
                </div>
              )}
            </>
          )}

          {phase === 'validating' && (
            <div className="callout row tight">
              <span className="spinner" />
              Checking service patterns and cycle weeks for {fmtNum(scopeCount)} customers…
            </div>
          )}

          {phase === 'pick' && !hardBlocked && (
            <div className="callout t-xs">{COPY.dayWeek}</div>
          )}

          {/* Cycle variant is a prototype affordance, clearly labelled. */}
          <div
            style={{
              marginTop: 'var(--s6)',
              paddingTop: 'var(--s4)',
              borderTop: '1px dashed var(--border-strong)',
            }}
          >
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="t-sm t-sec">
                Cycle variant
                <span className="t-xs t-ter" style={{ display: 'block' }}>
                  Prototype control — 4-week hides Weeks 5–8 entirely
                </span>
              </span>
              <Segmented
                value={`${cycleWeeks} Week` as '4 Week' | '8 Week'}
                onChange={(v) => setCycleWeeks(v === '4 Week' ? 4 : 8)}
                options={['4 Week', '8 Week'] as const}
              />
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}

/* ==========================================================================
   Long-running apply state
   ========================================================================== */

function ApplyingState({
  checked,
  total,
  steps,
}: {
  checked: number
  total: number
  steps: { label: string; state: StepState }[]
}) {
  const pct = total ? (checked / total) * 100 : 0
  return (
    <div>
      <div className="section-title" style={{ marginBottom: 'var(--s2)' }}>
        Applying assignment
      </div>
      <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)' }}>
        The assignment applies to every selected customer. Warnings are recorded for review
        before finalization.
      </p>

      <ProgressBar pct={pct} />
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <span className="t-sm t-med tnum">
          {fmtNum(Math.min(checked, total))} of {fmtNum(total)} customers updated
        </span>
        <span className="t-xs t-ter tnum">{Math.round(pct)}%</span>
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <StepList steps={steps} />
      </div>
    </div>
  )
}

