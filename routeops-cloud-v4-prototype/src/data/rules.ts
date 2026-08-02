/**
 * RouteOps Cloud V4 — validation rule engine.
 *
 * Single source of truth for the CONFIRMED business direction (Matt's answers).
 *
 * Philosophy shift
 * ----------------
 * During planning the system should NOT over-restrict. Analysts may select,
 * lasso, move between territories/routes, and change day/week/helper freely.
 * Issues are surfaced as tracked warnings instead of refusing the action.
 *
 * Hard blocks now exist in only three places:
 *   1. Weekend scheduling      — Sat/Sun are not schedulable in this version.
 *   2. Weeks outside the cycle — pickers only offer valid weeks; a hard block
 *                                exists purely as a guard for deep links.
 *   3. Final handheld output   — the export must satisfy the real output rules.
 *
 * Everything else is WARN, or BLOCK-until-overridden for service patterns.
 */

import type { Weekday } from './mock'

/* ==========================================================================
   Days — Monday to Friday only
   ========================================================================== */

/** Days an analyst may schedule. Saturday and Sunday are excluded. */
export const SCHEDULABLE_DAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

/** Kept only so existing displays can grey weekends out where useful. */
export const WEEKEND_DAYS: Weekday[] = ['Sat', 'Sun']

export function isSchedulableDay(day: Weekday) {
  return SCHEDULABLE_DAYS.includes(day)
}

export const WEEKEND_COPY = {
  helper: 'Weekend scheduling is not available in this version.',
  fieldHelper: 'Saturday and Sunday are not available for scheduling.',
  blockTitle: 'Weekend scheduling is not available',
  blockBody:
    'Customers can only be scheduled Monday through Friday in this version.',
}

/* ==========================================================================
   Weeks — only weeks that exist in the session cycle
   ========================================================================== */

/** 4-week session -> 1..4. 8-week session -> 1..8. Never offer more. */
export function validWeeks(cycleWeeks: number): number[] {
  return Array.from({ length: cycleWeeks }, (_, i) => i + 1)
}

export function isValidWeek(week: number, cycleWeeks: number) {
  return week >= 1 && week <= cycleWeeks
}

/** Week pairs only exist in an 8-week cycle: 1+5, 2+6, 3+7, 4+8. */
export function weekPairs(cycleWeeks: number): [number, number][] {
  if (cycleWeeks !== 8) return []
  return [
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 8],
  ]
}

export function invalidWeekMessage(week: number, cycleWeeks: number) {
  return `Week ${week} is not available in a ${cycleWeeks}-week session.`
}

/* ==========================================================================
   Route hours — warn above 45 hours, never block
   ========================================================================== */

export const ROUTE_HOURS_TARGET = 45
export const ROUTE_TARGET_MINUTES = ROUTE_HOURS_TARGET * 60 // 2700

export function isOverHours(totalMinutes: number) {
  return totalMinutes > ROUTE_TARGET_MINUTES
}

/* ==========================================================================
   Frequency — handheld output only accepts 7 / 14 / 28 / 56 day cycles
   ========================================================================== */

export const VALID_FREQUENCY_DAYS = [7, 14, 28, 56] as const
export type FrequencyDays = (typeof VALID_FREQUENCY_DAYS)[number]

export function isValidFrequency(days: number | null): boolean {
  return days !== null && (VALID_FREQUENCY_DAYS as readonly number[]).includes(days)
}

export function frequencyLabel(days: number | null) {
  if (days === null) return '—'
  return `Every ${days} days`
}

/* ==========================================================================
   Rule catalog
   ========================================================================== */

export type RuleSeverity =
  /** Stops the action outright. Used sparingly. */
  | 'block'
  /** Blocks the save until corrected OR explicitly overridden. */
  | 'block-override'
  /** Allowed during planning; tracked for review before output. */
  | 'warn'
  /** Blocks the final handheld/export output only, not planning. */
  | 'block-export'

export type RuleId =
  | 'service-pattern-conflict'
  | 'weekend-scheduling'
  | 'week-outside-cycle'
  | 'not-in-customer-master'
  | 'preferred-route-mismatch'
  | 'route-over-hours'
  | 'route-less-balanced'
  | 'missing-route'
  | 'missing-day'
  | 'missing-week'
  | 'invalid-frequency'
  | 'sales-group-invalid'

export interface RuleDef {
  id: RuleId
  label: string
  severity: RuleSeverity
  /** Where the rule bites: during planning, or only at export. */
  stage: 'planning' | 'export' | 'both'
  message: string
  behaviour: string
  actions: string[]
}

/**
 * The classification confirmed with Matt. Rendered verbatim on the Validation
 * Message System screen so design, product and engineering read the same table.
 *
 * Note two categories were explicitly RETIRED as blockers:
 *   - "Invalid week"        -> pickers only offer valid weeks, so this is a
 *                              deep-link guard rather than a normal category.
 *   - "Helper not allowed"  -> helpers are now selectable on any route.
 */
export const RULES: Record<RuleId, RuleDef> = {
  'service-pattern-conflict': {
    id: 'service-pattern-conflict',
    label: 'Service pattern conflict',
    severity: 'block-override',
    stage: 'planning',
    message: 'This assignment conflicts with the customer’s service pattern.',
    behaviour:
      'Flagged strongly. The save is blocked until the pattern is corrected or an override is applied. An override keeps the issue flagged for review.',
    actions: ['Adjust pattern', 'Apply override'],
  },
  'weekend-scheduling': {
    id: 'weekend-scheduling',
    label: 'Weekend scheduling',
    severity: 'block',
    stage: 'both',
    message: WEEKEND_COPY.blockBody,
    behaviour:
      'Hard block. Saturday and Sunday are removed from every scheduling control, so this only appears if an invalid state is reached by deep link.',
    actions: ['Choose Monday to Friday'],
  },
  'week-outside-cycle': {
    id: 'week-outside-cycle',
    label: 'Week outside the session cycle',
    severity: 'block',
    stage: 'both',
    message: 'The selected week does not exist in this session cycle.',
    behaviour:
      'Retired as a normal validation category: week pickers only offer weeks that exist. Retained as a deep-link guard.',
    actions: ['Choose a valid week'],
  },
  'not-in-customer-master': {
    id: 'not-in-customer-master',
    label: 'Not in Customer Master',
    severity: 'block-export',
    stage: 'export',
    message:
      'This customer does not exist in CC Customer Master and cannot be included in handheld output.',
    behaviour:
      'Warning during planning. Blocks the handheld export only while the customer is still included. Excluding it, or creating the customer, clears the block.',
    actions: ['Request customer creation', 'Mark as load customer', 'Exclude from handheld'],
  },
  'preferred-route-mismatch': {
    id: 'preferred-route-mismatch',
    label: 'Preferred route mismatch',
    severity: 'warn',
    stage: 'planning',
    message: 'Planned route differs from preferred route.',
    behaviour: 'Allowed during planning and testing. Never blocks a move.',
    actions: ['Review before finalize'],
  },
  'route-over-hours': {
    id: 'route-over-hours',
    label: 'Route over hours target',
    severity: 'warn',
    stage: 'planning',
    message: `Route exceeds ${ROUTE_HOURS_TARGET}-hour target.`,
    behaviour: `Warns once a route exceeds ${ROUTE_HOURS_TARGET} hours. Planning and editing continue.`,
    actions: ['Rebalance route', 'Acknowledge before finalize'],
  },
  'route-less-balanced': {
    id: 'route-less-balanced',
    label: 'Route becomes less balanced',
    severity: 'warn',
    stage: 'planning',
    message: 'This move may reduce route balance.',
    behaviour: 'Allowed. Flagged for review so the analyst can rebalance later.',
    actions: ['Review in Metrics', 'Acknowledge before finalize'],
  },
  'missing-route': {
    id: 'missing-route',
    label: 'Included customer missing route',
    severity: 'block-export',
    stage: 'export',
    message: 'This customer is included in handheld output but has no route.',
    behaviour:
      'Blocks export. Every included customer needs a route, unless the analyst intentionally unassigns and excludes it.',
    actions: ['Assign a route', 'Exclude from handheld'],
  },
  'missing-day': {
    id: 'missing-day',
    label: 'Included customer missing delivery day',
    severity: 'block-export',
    stage: 'export',
    message: 'This customer is included in handheld output but has no delivery day.',
    behaviour: 'Blocks export.',
    actions: ['Assign a delivery day', 'Exclude from handheld'],
  },
  'missing-week': {
    id: 'missing-week',
    label: 'Included customer missing delivery week',
    severity: 'block-export',
    stage: 'export',
    message: 'This customer is included in handheld output but has no delivery week.',
    behaviour: 'Blocks export.',
    actions: ['Assign a delivery week', 'Exclude from handheld'],
  },
  'invalid-frequency': {
    id: 'invalid-frequency',
    label: 'Invalid frequency',
    severity: 'block-export',
    stage: 'export',
    message: `Frequency must be every ${VALID_FREQUENCY_DAYS.join(', ')} days.`,
    behaviour:
      'Blocks export. No customer can be scheduled into the handheld outside these frequencies.',
    actions: ['Correct the service pattern', 'Exclude from handheld'],
  },
  'sales-group-invalid': {
    id: 'sales-group-invalid',
    label: 'Sales Group invalid or missing',
    severity: 'block-export',
    stage: 'export',
    message: 'Sales Group is missing or not recognised.',
    behaviour: 'Blocks export. Sales Group must validate against Reference Data.',
    actions: ['Set a valid Sales Group', 'Exclude from handheld'],
  },
}

export const RULE_LIST: RuleDef[] = Object.values(RULES)

/* ==========================================================================
   Status vocabulary (replaces the old "blocked during planning" language)
   ========================================================================== */

export const STATUS_COPY = {
  allowedWithWarning: 'Allowed with warning',
  needsReview: 'Needs review',
  resolveBeforeExport: 'Must be resolved before export',
  notInHandheld: 'Not included in handheld output',
  requiresMaster: 'Requires Customer Master creation',
  overrideApplied: 'Override applied',
  warningAcknowledged: 'Warning acknowledged',
  reviewBeforeFinalize: 'Review before finalize',
}

export const COPY = {
  planningFlexibility:
    'Planning changes are allowed during testing, but warnings are tracked for review before output.',
  lasso:
    'Move selected customers to any territory or route. Scheduling warnings will be flagged for review.',
  dayWeek:
    'Assign Monday–Friday delivery days and valid cycle weeks. Weekend scheduling is not available in this version.',
  servicePattern: 'This assignment conflicts with the customer’s service pattern.',
  override: 'Override applied. This issue will remain flagged for review.',
  customerMaster:
    'This customer does not exist in CC Customer Master and cannot be included in handheld output.',
  routeHours: `Route exceeds ${ROUTE_HOURS_TARGET}-hour target.`,
  routeBalance: 'This move may reduce route balance.',
  finalization:
    'Resolve blocking issues before finalizing. Warnings can be acknowledged if approved.',
  export:
    'Handheld file cannot be generated until all included customers have route, day, week, valid frequency, Sales Group, and Customer Master records.',
  territoryView:
    'Customers can be moved to any territory or route during planning. Warnings are reviewed before final output.',
  dayView: 'Use Day View to balance delivery days after territory and route assignment.',
  weekView: 'Use Week View to balance cycle weeks after day-of-week balancing is complete.',
  loadCustomerHelp:
    'New or load customers may be needed when creating a new route, transitioning a presell route to a conventional route, or adding load/time to a sales depot.',
}

/* ==========================================================================
   Warning objects produced by planning actions
   ========================================================================== */

export interface PlanningWarning {
  ruleId: RuleId
  customerId?: string
  route?: string
  message: string
  severity: RuleSeverity
}

export function makeWarning(
  ruleId: RuleId,
  extra: Partial<PlanningWarning> = {},
): PlanningWarning {
  const rule = RULES[ruleId]
  return {
    ruleId,
    message: rule.message,
    severity: rule.severity,
    ...extra,
  }
}

/* ==========================================================================
   Handheld eligibility
   ========================================================================== */

export type HandheldStatus = 'Ready' | 'Excluded' | 'Blocked' | 'Needs Review'

export interface HandheldCandidate {
  customerId: string
  route: string | null
  day: Weekday | null
  week: number | null
  frequencyDays: number | null
  salesGroup: string | null
  inMaster: boolean
  /** False when the analyst has intentionally excluded the customer. */
  includedInHandheld: boolean
  loadCustomer?: boolean
  patternOverride?: boolean
}

export interface HandheldEvaluation {
  status: HandheldStatus
  blockers: PlanningWarning[]
  warnings: PlanningWarning[]
}

/**
 * Decides whether a customer may enter the handheld upload file.
 * Excluded customers never block: they simply do not ship.
 */
export function evaluateHandheld(c: HandheldCandidate): HandheldEvaluation {
  const blockers: PlanningWarning[] = []
  const warnings: PlanningWarning[] = []
  const at = { customerId: c.customerId, route: c.route ?? undefined }

  if (!c.includedInHandheld) {
    if (!c.inMaster) warnings.push(makeWarning('not-in-customer-master', at))
    return { status: 'Excluded', blockers, warnings }
  }

  if (!c.inMaster) blockers.push(makeWarning('not-in-customer-master', at))
  if (!c.route) blockers.push(makeWarning('missing-route', at))
  if (!c.day) blockers.push(makeWarning('missing-day', at))
  if (c.week === null) blockers.push(makeWarning('missing-week', at))
  if (!isValidFrequency(c.frequencyDays)) blockers.push(makeWarning('invalid-frequency', at))
  if (!c.salesGroup) blockers.push(makeWarning('sales-group-invalid', at))
  if (c.day && !isSchedulableDay(c.day)) blockers.push(makeWarning('weekend-scheduling', at))

  if (c.patternOverride) {
    warnings.push({
      ruleId: 'service-pattern-conflict',
      message: STATUS_COPY.overrideApplied,
      severity: 'warn',
      ...at,
    })
  }

  if (blockers.length) return { status: 'Blocked', blockers, warnings }
  if (warnings.length) return { status: 'Needs Review', blockers, warnings }
  return { status: 'Ready', blockers, warnings }
}
