/**
 * Part I — Bulk Assign Day / Week drawer.
 * Part J — Bulk assign failure state.
 *
 * Flow: pick -> validating -> valid -> applying -> success toast
 *                          \-> failed (nothing saved)
 *
 * Validation is genuinely rule-driven. validateScope() runs the real service
 * pattern engine across the documented 1,300-customer selection population, so
 * the outcome follows from the day and week you pick:
 *
 *   Tuesday + Week 3  -> passes for all 1,300   (success path)
 *   Friday  + Week 3  -> 14 failures            (failure path: 8T and 2T
 *                                                patterns never run Friday)
 *
 * There is no Pass/Fail override. Deep links preselect a day and week:
 *   #/workspace?drawer=assign&day=Tue&week=3   (success)
 *   #/workspace?drawer=assign&day=Fri&week=3   (failure)
 */
import { useEffect, useMemo, useState } from 'react'
import {
  SESSION,
  WEEKDAYS,
  WEEKDAY_FULL,
  WEEK_PAIRS,
  buildViolationRows,
  fmtNum,
  validateScope,
  type Weekday,
} from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Drawer,
  ProgressBar,
  Segmented,
  StepList,
  ToggleChip,
  type StepState,
} from '../../components/ui'
import { CheckCircleIcon, LockIcon } from '../../components/icons'

type Phase = 'pick' | 'validating' | 'valid' | 'applying' | 'failed'

const STEP_LABELS = [
  'Validating service patterns…',
  'Checking week rules…',
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
  const { selection, pushToast, clearSelection, setDirty, activeVersion } = useApp()

  const [cycleWeeks, setCycleWeeks] = useState<4 | 8>(SESSION.cycleWeeks as 4 | 8)
  const [day, setDay] = useState<Weekday | null>(initialDay ?? 'Tue')
  const [week, setWeek] = useState<number | null>(initialWeek ?? 3)
  const [phase, setPhase] = useState<Phase>('pick')
  const [checked, setChecked] = useState(0)
  const [excluded, setExcluded] = useState(false)

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

  /** Live rule-engine result for the currently picked day + week. */
  const scopeResult = useMemo(
    () => (day && week ? validateScope(day, week) : null),
    [day, week],
  )

  // The selection may be smaller than the documented population; scale the
  // failure count so the drawer never claims more failures than selected rows.
  const failCount = useMemo(() => {
    if (!scopeResult || !scopeResult.failed) return 0
    if (scopeCount >= scopeResult.total) return scopeResult.failed
    return Math.max(
      1,
      Math.round((scopeResult.failed / scopeResult.total) * scopeCount),
    )
  }, [scopeResult, scopeCount])

  const violationRows = useMemo(
    () => (scopeResult ? buildViolationRows(scopeResult) : []),
    [scopeResult],
  )

  const applyCount = excluded ? scopeCount - failCount : scopeCount

  // Clamp the week if the analyst switches to a 4-week cycle preview.
  useEffect(() => {
    if (week && week > cycleWeeks) setWeek(null)
  }, [cycleWeeks, week])

  // Changing the day or week invalidates a previous verdict.
  useEffect(() => {
    setPhase('pick')
    setExcluded(false)
  }, [day, week])

  /* --- transitions ------------------------------------------------------- */

  const validate = () => {
    setPhase('validating')
    window.setTimeout(() => {
      setPhase(failCount > 0 && !excluded ? 'failed' : 'valid')
    }, 850)
  }

  const apply = () => {
    setPhase('applying')
    setChecked(0)
    const total = applyCount
    const step = Math.max(1, Math.round(total / 14))
    // Progress is tracked in a local, NOT inside the state updater: React
    // double-invokes updaters in StrictMode, so side effects must stay outside.
    let done = 0
    const t = window.setInterval(() => {
      done = Math.min(total, done + step)
      setChecked(done)
      if (done < total) return
      window.clearInterval(t)
      window.setTimeout(() => {
        setDirty(true)
        pushToast({
          tone: 'success',
          title: `${fmtNum(total)} customers assigned to ${
            WEEKDAY_FULL[day!]
          }, Week ${week}.`,
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
    }, 190)
  }

  const stepStates: StepState[] = STEP_LABELS.map((_, i) => {
    const pct = applyCount ? checked / applyCount : 0
    const boundary = (i + 1) / STEP_LABELS.length
    if (pct >= boundary) return 'done'
    if (pct >= i / STEP_LABELS.length) return 'active'
    return 'todo'
  })

  const canValidate = Boolean(day && week)

  /* --- footer per phase -------------------------------------------------- */

  const footer = (() => {
    if (phase === 'pick' || phase === 'validating')
      return (
        <>
          <Button
            variant="primary"
            disabled={!canValidate || phase === 'validating'}
            onClick={validate}
          >
            {phase === 'validating' ? 'Validating…' : 'Validate Assignment'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </>
      )
    if (phase === 'valid')
      return (
        <>
          <Button variant="primary" onClick={apply}>
            Apply Assignment
          </Button>
          <Button onClick={() => setPhase('pick')}>Back</Button>
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
    // failed
    return (
      <>
        <Button
          variant="primary"
          onClick={() => {
            setExcluded(true)
            setPhase('valid')
          }}
        >
          Exclude failing rows and retry
        </Button>
        <Button variant="danger" onClick={onClose}>
          Cancel Assignment
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
      wide={phase === 'failed'}
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
        {excluded && (
          <div style={{ marginTop: 8 }}>
            <Badge tone="warning">
              {failCount} failing rows excluded · {fmtNum(applyCount)} will be updated
            </Badge>
          </div>
        )}
      </div>

      {phase === 'failed' ? (
        <FailureState
          day={day!}
          week={week!}
          scopeCount={scopeCount}
          failCount={failCount}
          rows={violationRows}
          onBack={() => setPhase('pick')}
        />
      ) : phase === 'applying' ? (
        <ApplyingState
          checked={checked}
          total={applyCount}
          steps={STEP_LABELS.map((label, i) => ({ label, state: stepStates[i] }))}
        />
      ) : (
        <>
          {/* Day picker ------------------------------------------------- */}
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Delivery Day</label>
            <div className="day-group">
              {WEEKDAYS.map((d) => (
                <ToggleChip key={d} on={day === d} onClick={() => setDay(d)}>
                  {d}
                </ToggleChip>
              ))}
            </div>
          </div>

          {/* Week picker ------------------------------------------------ */}
          <div className="field" style={{ marginBottom: 'var(--s5)' }}>
            <label className="field-label">Delivery Week</label>
            {cycleWeeks === 8 ? (
              <>
                <span className="field-help" style={{ marginBottom: 6 }}>
                  In an 8-week cycle, weeks are planned as pairs.
                </span>
                <div className="grid-2" style={{ gap: 'var(--s2)' }}>
                  {WEEK_PAIRS.map(([a, b], i) => (
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
                  A 4-week cycle has no week pairs.
                </span>
                <div className="day-group">
                  {[1, 2, 3, 4].map((w) => (
                    <ToggleChip key={w} on={week === w} onClick={() => setWeek(w)}>
                      Wk {w}
                    </ToggleChip>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Live rule preview before validating ------------------------ */}
          {phase === 'pick' && scopeResult && (
            <div className="callout" style={{ marginBottom: 'var(--s4)' }}>
              <div className="row tight" style={{ marginBottom: 4 }}>
                <Badge tone={failCount ? 'warning' : 'valid'}>
                  {failCount ? `${failCount} rows will fail` : 'No rule conflicts'}
                </Badge>
                <span className="t-xs t-ter">
                  {day} · Wk {week}
                </span>
              </div>
              {failCount
                ? `Patterns ${scopeResult.groups
                    .map((g) => g.pattern)
                    .join(' and ')} do not permit ${WEEKDAY_FULL[day!]}.`
                : `Every service pattern in this selection permits ${
                    WEEKDAY_FULL[day!]
                  } in Week ${week}.`}
            </div>
          )}

          {phase === 'valid' && (
            <Banner tone="success" title="Validation passed">
              {excluded
                ? `${fmtNum(applyCount)} customers can be assigned to ${
                    WEEKDAY_FULL[day!]
                  }, Week ${week}. ${failCount} failing rows are excluded.`
                : `All ${fmtNum(applyCount)} customers can be assigned to ${
                    WEEKDAY_FULL[day!]
                  }, Week ${week}.`}
            </Banner>
          )}

          {phase === 'validating' && (
            <div className="callout row tight">
              <span className="spinner" />
              Checking service patterns and week rules for {fmtNum(scopeCount)} customers…
            </div>
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
                  Prototype control — previews the 4-week week picker
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
        Large assignments are processed in one transaction. Nothing is saved until every row
        passes.
      </p>

      <ProgressBar pct={pct} />
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <span className="t-sm t-med tnum">
          {fmtNum(Math.min(checked, total))} of {fmtNum(total)} customers checked
        </span>
        <span className="t-xs t-ter tnum">{Math.round(pct)}%</span>
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <StepList steps={steps} />
      </div>
    </div>
  )
}

/* ==========================================================================
   Part J — failure state. Nothing was saved.
   ========================================================================== */

function FailureState({
  day,
  week,
  scopeCount,
  failCount,
  rows,
  onBack,
}: {
  day: Weekday
  week: number
  scopeCount: number
  failCount: number
  rows: ReturnType<typeof buildViolationRows>
  onBack: () => void
}) {
  const [highlighted, setHighlighted] = useState<string[]>([])

  return (
    <div>
      <Banner tone="error" title="No changes were applied.">
        {failCount} of {fmtNum(scopeCount)} customers can’t be assigned to{' '}
        {WEEKDAY_FULL[day]}, Week {week}.
      </Banner>

      <div
        className="row tight"
        style={{ marginTop: 'var(--s3)', marginBottom: 'var(--s4)' }}
      >
        <LockIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
        <span className="t-xs t-sec">
          The assignment is all-or-nothing. No partial update happens unless you explicitly
          exclude the failing rows and retry.
        </span>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="tbl" style={{ minWidth: 660 }}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Route</th>
                <th>Pattern</th>
                <th>Current Day</th>
                <th>Current Week</th>
                <th style={{ minWidth: 240 }}>Reason</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr
                  key={v.customerId}
                  className={highlighted.includes(v.customerId) ? 'highlighted' : undefined}
                >
                  <td className="cell-id">{v.customerId}</td>
                  <td>{v.route}</td>
                  <td className="mono t-xs">{v.pattern}</td>
                  <td>{v.currentDay}</td>
                  <td>{v.currentWeek}</td>
                  <td
                    style={{ whiteSpace: 'normal', minWidth: 240 }}
                    className="td-muted"
                  >
                    {v.reason}
                  </td>
                  <td className="right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setHighlighted((prev) =>
                          prev.includes(v.customerId)
                            ? prev.filter((x) => x !== v.customerId)
                            : [...prev, v.customerId],
                        )
                      }
                    >
                      {highlighted.includes(v.customerId) ? 'Clear' : 'Highlight'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>
            Showing {rows.length} of {failCount} violations
          </span>
          <button className="link-btn plain t-sm" onClick={onBack}>
            Change day or week instead
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'var(--s4)' }}>
        <div className="callout">
          <div className="row tight" style={{ marginBottom: 6 }}>
            <CheckCircleIcon size={14} style={{ color: 'var(--success)' }} />
            <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
              What happens if you exclude and retry
            </span>
          </div>
          {fmtNum(scopeCount - failCount)} customers will be assigned to{' '}
          {WEEKDAY_FULL[day]}, Week {week}. The {failCount} failing rows keep their current
          day and week and stay flagged in the grid.
        </div>
      </div>
    </div>
  )
}
