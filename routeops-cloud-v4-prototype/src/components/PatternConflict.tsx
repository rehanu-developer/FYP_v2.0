/**
 * Part B — Pattern and frequency validation, shared across every surface that
 * can break a customer's service pattern: the customer drawer, the bulk assign
 * drawer, the Route Workspace grid and the map/lasso move preview.
 *
 * Three states:
 *   1. No conflict      -> nothing rendered
 *   2. Conflict found   -> inline warning + "View rule" popover
 *   3. Override applied -> badge + audit tooltip
 */
import { Badge, Popover, Tooltip } from './ui'
import { WarningIcon } from './icons'
import { PATTERN_COPY, PATTERN_RULE_COPY, canOverridePattern } from '../data/prompt2'
import { WEEKDAY_FULL, type Weekday } from '../data/mock'
import { useApp } from '../state/AppState'

export interface PatternConflict {
  pattern: string
  attemptedDay: Weekday
  attemptedWeek: number
}

/**
 * Inline conflict warning with a rule explanation popover.
 * `compact` renders the grid variant, which has no room for body copy.
 */
export function PatternConflictNotice({
  conflict,
  overridden,
  compact,
  onOverride,
}: {
  conflict: PatternConflict
  overridden?: boolean
  compact?: boolean
  onOverride?: () => void
}) {
  const { role } = useApp()
  const mayOverride = canOverridePattern(role)

  if (overridden) {
    return (
      <Tooltip text={PATTERN_COPY.overrideTooltip}>
        <Badge tone="progress">{PATTERN_COPY.overrideBadge}</Badge>
      </Tooltip>
    )
  }

  const rule =
    PATTERN_RULE_COPY[conflict.pattern] ??
    'This customer has no service pattern, so no delivery day is valid.'

  const ruleBody = (
    <>
      {rule}
      <br />
      <br />
      <span style={{ color: 'var(--text)' }}>Attempted change:</span>{' '}
      {WEEKDAY_FULL[conflict.attemptedDay]}, Week {conflict.attemptedWeek}.
    </>
  )

  if (compact) {
    return (
      <span className="row tight nowrap">
        <Tooltip text={PATTERN_COPY.inlineWarning}>
          <Badge tone="warning" icon={<WarningIcon size={11} />}>
            Pattern
          </Badge>
        </Tooltip>
        <Popover label={PATTERN_COPY.viewRule} title={PATTERN_COPY.popoverTitle}>
          {ruleBody}
        </Popover>
      </span>
    )
  }

  return (
    <div className="banner banner-warning" style={{ alignItems: 'flex-start' }}>
      <span className="banner-icon">
        <WarningIcon size={15} />
      </span>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div className="banner-title">{PATTERN_COPY.inlineWarning}</div>
        <div className="row tight wrap" style={{ marginTop: 4 }}>
          <Popover label={PATTERN_COPY.viewRule} title={PATTERN_COPY.popoverTitle}>
            {ruleBody}
          </Popover>
          {onOverride && (
            <>
              <span className="t-ter">·</span>
              {mayOverride ? (
                <button className="link-btn plain t-xs" onClick={onOverride}>
                  Apply override
                </button>
              ) : (
                <Tooltip
                  text={`Overrides require Admin or Ingest Admin. You are signed in as ${role}.`}
                >
                  <span className="t-xs t-ter" style={{ textDecoration: 'underline dotted' }}>
                    Override not permitted
                  </span>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * The open design decision that sits behind this component. Rendered on the
 * design frames rather than in production surfaces.
 */
export function PatternDecisionNote() {
  return (
    <div className="spec-note">
      <span style={{ flex: '0 0 auto', marginTop: 2 }}>
        <WarningIcon size={15} />
      </span>
      <span>
        <strong>Open decision:</strong> {PATTERN_COPY.decisionNote}
        <br />
        {PATTERN_COPY.decisionRecommendation}
      </span>
    </div>
  )
}
