/**
 * RouteOps Cloud V4 — Prompt 2 data layer.
 *
 * Kept separate from mock.ts so the Prompt 1 dataset stays readable.
 * Everything here is deterministic; no backend, no network.
 */

import type { Weekday } from './mock'

/* ==========================================================================
   Roles and permissions (Part I)
   ========================================================================== */

export type Role = 'Routing Analyst' | 'Fleet Lead' | 'Admin' | 'Ingest Admin'

export const ROLES: Role[] = ['Routing Analyst', 'Fleet Lead', 'Admin', 'Ingest Admin']

/** Only Admin and Ingest Admin may run the enhancement import. */
export function canImportEnhancements(role: Role) {
  return role === 'Admin' || role === 'Ingest Admin'
}

/** Pattern overrides need an authorised role (Part B). */
export function canOverridePattern(role: Role) {
  return role === 'Admin' || role === 'Ingest Admin'
}

export const ROLE_HOLDERS: Record<Role, string> = {
  'Routing Analyst': 'Michael Reeves',
  'Fleet Lead': 'Carla Nunez',
  Admin: 'Dana Whitfield',
  'Ingest Admin': 'Priya Raman',
}

/* ==========================================================================
   Helper assignment (CONFIRMED DIRECTION — updated)
   --------------------------------------------------------------------------
   Helpers used to be presale-only, with conventional routes hard-blocked.
   That restriction is retired: a helper can now be selected or deselected on
   ANY route, across baseline, presell and delivery routing scenarios.
   ========================================================================== */

export type RouteScenario = 'Baseline' | 'Presell' | 'Delivery' | 'Conventional'

export const ROUTE_SCENARIOS: RouteScenario[] = [
  'Baseline',
  'Presell',
  'Delivery',
  'Conventional',
]

export const HELPER_COPY = {
  sectionTitle: 'Helper',
  instruction: 'Select or deselect a helper for this route.',
  scenarioNote:
    'Helper selection can be adjusted for baseline, presell, and delivery routing scenarios.',
  selected: 'Helper selected',
  notSelected: 'No helper selected',
  changedFromBaseline: 'Changed from baseline',
  fromBaseline: 'From baseline',
}

export interface HelperRecord {
  name: string
  shift: string
}

export const HELPER_POOL: HelperRecord[] = [
  { name: 'B. Thibodeaux', shift: 'Early · 05:00 – 13:00' },
  { name: 'S. Arceneaux', shift: 'Early · 05:00 – 13:00' },
  { name: 'R. Mouton', shift: 'Mid · 07:00 – 15:00' },
]

/* ==========================================================================
   Part B — Pattern / frequency validation
   ========================================================================== */

export interface PatternRule {
  pattern: string
  /** Human copy for the "View rule" popover. */
  ruleText: string
}

export const PATTERN_RULE_COPY: Record<string, string> = {
  E4W: 'Service pattern E4W allows delivery Monday to Friday in any cycle week.',
  '4T': 'Service pattern 4T allows delivery Monday to Friday in weeks 1, 3, 5 and 7 only.',
  '2W': 'Service pattern 2W allows delivery Monday to Friday in any cycle week.',
  '2T': 'Service pattern 2T allows delivery Monday, Tuesday or Wednesday only.',
  '1W': 'Service pattern 1W allows delivery Monday to Saturday in any cycle week.',
  EOW: 'Service pattern EOW allows delivery Monday to Friday in weeks 1, 3, 5 and 7 only.',
  '8T': 'Service pattern 8T allows delivery Tuesday, Wednesday or Thursday only.',
  '3W': 'Service pattern 3W allows delivery Monday to Friday in any cycle week.',
}

export const PATTERN_COPY = {
  inlineWarning: 'This breaks the customer’s delivery pattern.',
  viewRule: 'View rule',
  popoverTitle: 'Broken rule',
  overrideBadge: 'Override applied',
  overrideTooltip: 'This pattern conflict was overridden by an authorized user.',
  decisionNote:
    'Should breaking a pattern rule fully block the change, or warn and allow override?',
  decisionRecommendation:
    'Recommended default: block by default unless override permission is confirmed.',
}

/* ==========================================================================
   Part C — Bulk reassign validation
   ========================================================================== */

export interface BlockedCustomer {
  customerId: string
  currentRoute: string
  reason: string
}

/** Blocked rows for the Reassign Route drawer. */
export const REASSIGN_BLOCKED: BlockedCustomer[] = [
  {
    customerId: '1000214',
    currentRoute: '970',
    reason: 'Service pattern does not allow the destination day.',
  },
  {
    customerId: '1000541',
    currentRoute: '970',
    reason: 'Depot eligibility does not allow this route.',
  },
]

/**
 * Lasso moves are no longer blocked. These are the WARNINGS the move review
 * surfaces; the move itself always proceeds.
 */
export interface MoveWarning {
  customerId: string
  currentRoute: string
  warning: string
}

export const LASSO_MOVE_WARNINGS: MoveWarning[] = [
  {
    customerId: '1000214',
    currentRoute: '970',
    warning: 'Preferred route differs from selected route.',
  },
  {
    customerId: '1000541',
    currentRoute: '970',
    warning: 'Route will exceed 45 hours after this move.',
  },
]

export interface MoveImpact {
  sourceRoute: string
  destinationRoute: string
  hoursBefore: string
  hoursAfter: string
  revenueBefore: number
  revenueAfter: number
}

export const MOVE_IMPACT: MoveImpact = {
  sourceRoute: '970',
  destinationRoute: '971',
  hoursBefore: '9h 15m',
  hoursAfter: '8h 32m',
  revenueBefore: 112840,
  revenueAfter: 104210,
}

/* ==========================================================================
   Part D — Map / Lasso view
   ========================================================================== */

/**
 * The four confirmed map views. Each is a lens on the same planning data:
 *   Territory -> territory/route layout, move between territories
 *   Route     -> route grouping and route-level balancing
 *   Day       -> Monday-Friday balancing after territory/route assignment
 *   Week      -> cycle-week balancing after day balancing
 */
export type MapView = 'Territory' | 'Route' | 'Day' | 'Week'

export const MAP_VIEWS: MapView[] = ['Territory', 'Route', 'Day', 'Week']

export const MAP_VIEW_COPY: Record<MapView, { title: string; purpose: string }> = {
  Territory: {
    title: 'Territory View',
    purpose:
      'Customers can be moved to any territory or route during planning. Warnings are reviewed before final output.',
  },
  Route: {
    title: 'Route View',
    purpose:
      'Lasso a group of customers and move them between routes to balance route workload.',
  },
  Day: {
    title: 'Day of Week View',
    purpose: 'Use Day View to balance delivery days after territory and route assignment.',
  },
  Week: {
    title: 'Week View',
    purpose: 'Use Week View to balance cycle weeks after day-of-week balancing is complete.',
  },
}

export type MapTool = 'Lasso' | 'Pin' | 'Recenter' | 'Measure'
export const MAP_TOOLS: MapTool[] = ['Lasso', 'Pin', 'Recenter', 'Measure']

/** Palette per colour mode. Single-hue ramps, no rainbow scales. */
export const DAY_COLORS: Record<string, string> = {
  Mon: '#c9812b',
  Tue: '#4f6b82',
  Wed: '#3f7d58',
  Thu: '#a63d3d',
  Fri: '#8a6a3a',
  Sat: '#6b6b6b',
  Sun: '#b9b4a9',
}

export const FREQUENCY_COLORS: Record<string, string> = {
  Weekly: '#c9812b',
  'Twice Weekly': '#b5711f',
  'Three Times Weekly': '#9d6119',
  'Every 2 Weeks': '#dda860',
  'Every 4 weeks': '#eccc9b',
  'Every 8 weeks': '#f5e4c8',
  '—': '#b9b4a9',
}

/** The lasso selection described in Part D state 2. */
export const LASSO_SELECTION = {
  customers: 5,
  route: '970',
  day: 'Tue' as Weekday,
  week: 3,
  suggestedDestination: '971',
}

/* ==========================================================================
   Part G — Activity feed
   ========================================================================== */

export type ActionLabel =
  | 'Saved as new option'
  | 'Moved customers'
  | 'Assigned day/week'
  | 'Updated helper assignment'
  | 'Applied service pattern override'
  | 'Acknowledged warning'
  | 'Requested customer creation'
  | 'Excluded customer from handheld'
  | 'Marked load customer'
  | 'Edited customer'
  | 'Sequenced route'
  | 'Reverted to baseline'
  | 'Applied reconcile'
  | 'Finalized option'
  | 'Exported handheld file'
  | 'Exported Stop List'
  | 'Imported Customer Master enhancements'

export const ACTION_LABELS: ActionLabel[] = [
  'Moved customers',
  'Assigned day/week',
  'Updated helper assignment',
  'Applied service pattern override',
  'Acknowledged warning',
  'Requested customer creation',
  'Excluded customer from handheld',
  'Marked load customer',
  'Saved as new option',
  'Edited customer',
  'Sequenced route',
  'Reverted to baseline',
  'Applied reconcile',
  'Finalized option',
  'Exported handheld file',
  'Exported Stop List',
  'Imported Customer Master enhancements',
]

export type UndoStatus = 'Undoable' | 'No undo' | 'Conflict' | 'Undone'

export interface AffectedRow {
  customerId: string
  route: string
  before: string
  after: string
}

export interface ActivityEntry {
  id: string
  action: ActionLabel
  user: string
  timestamp: string
  scope: string
  before: string
  after: string
  option: string
  undo: UndoStatus
  affectedCount: number
  /** Capped preview of affected rows. */
  affected: AffectedRow[]
  route?: string
}

function rows(
  ids: string[],
  route: string,
  before: string,
  after: string,
): AffectedRow[] {
  return ids.map((customerId) => ({ customerId, route, before, after }))
}

export const ACTIVITY_LOG: ActivityEntry[] = [
  {
    id: 'e1',
    action: 'Moved customers',
    user: 'Michael Reeves',
    timestamp: 'Today 4:12 PM',
    scope: '20 customers · Route 970 → Route 971 · Warnings added: 2',
    before: 'Route 970',
    after: 'Route 971',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 20,
    route: '971',
    affected: rows(
      ['1000004', '1000108', '1000297', '1000341', '1000418'],
      '971',
      'Route 970',
      'Route 971',
    ),
  },
  {
    id: 'e1b',
    action: 'Applied service pattern override',
    user: 'Michael Reeves',
    timestamp: 'Today 4:18 PM',
    scope: 'Customer 1000214 · Warning: Customer is closed on selected day',
    before: 'Tuesday',
    after: 'Friday',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 1,
    route: '972',
    affected: rows(['1000214'], '972', 'Tue', 'Fri'),
  },
  {
    id: 'e1c',
    action: 'Excluded customer from handheld',
    user: 'Michael Reeves',
    timestamp: 'Today 4:21 PM',
    scope: 'Customer 1000874 · Reason: Not in Customer Master',
    before: 'Included in handheld',
    after: 'Excluded from handheld',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 1,
    route: '970',
    affected: rows(['1000874'], '970', 'Included', 'Excluded'),
  },
  {
    id: 'e1d',
    action: 'Updated helper assignment',
    user: 'Michael Reeves',
    timestamp: 'Today 4:25 PM',
    scope: 'Route 970',
    before: 'No helper',
    after: 'Helper selected',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 1,
    route: '970',
    affected: [],
  },
  {
    id: 'e1e',
    action: 'Acknowledged warning',
    user: 'Michael Reeves',
    timestamp: 'Today 4:30 PM',
    scope: '4 warnings acknowledged before finalization',
    before: '4 unacknowledged warnings',
    after: 'Acknowledged',
    option: 'Option 1',
    undo: 'No undo',
    affectedCount: 4,
    affected: [],
  },
  {
    id: 'e1f',
    action: 'Requested customer creation',
    user: 'Michael Reeves',
    timestamp: 'Today 4:33 PM',
    scope: 'Customer 1002014 · sent to reconciliation',
    before: 'Not in Customer Master',
    after: 'Creation requested',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 1,
    affected: [],
  },
  {
    id: 'e2',
    action: 'Assigned day/week',
    user: 'Michael Reeves',
    timestamp: 'Today 4:05 PM',
    scope: '1,300 customers · Route 970 · Warnings added: 14',
    before: 'Mixed days/weeks',
    after: 'Friday, Week 3',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 1300,
    route: '970',
    affected: rows(
      ['1000603', '1000677', '1001027'],
      '970',
      'Mon, Wk 1',
      'Fri, Wk 3',
    ),
  },
  {
    id: 'e3',
    action: 'Sequenced route',
    user: 'Michael Reeves',
    timestamp: 'Today 3:58 PM',
    scope: 'Route 970 · 180 stops',
    before: 'Imported stop order',
    after: 'Quickest-time order · 12 min saved',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 180,
    route: '970',
    affected: rows(['1000004', '1000297', '1000341'], '970', 'Seq 42', 'Seq 17'),
  },
  {
    id: 'e4',
    action: 'Edited customer',
    user: 'Michael Reeves',
    timestamp: 'Today 3:41 PM',
    scope: 'Customer 1000214',
    before: 'Route 970 · Wed, Wk 2',
    after: 'Route 972 · Wed, Wk 2',
    option: 'Option 1',
    undo: 'Conflict',
    affectedCount: 1,
    route: '972',
    affected: rows(['1000214'], '972', 'Route 970', 'Route 972'),
  },
  {
    id: 'e5',
    action: 'Moved customers',
    user: 'Michael Reeves',
    timestamp: 'Today 3:22 PM',
    scope: '12 customers · Route 970 → Route 971',
    before: 'Route 970',
    after: 'Route 971',
    option: 'Option 1',
    undo: 'Undoable',
    affectedCount: 12,
    route: '971',
    affected: rows(['1000462', '1000745', '1000889'], '971', 'Route 970', 'Route 971'),
  },
  {
    id: 'e6',
    action: 'Saved as new option',
    user: 'Michael Reeves',
    timestamp: 'Today 2:44 PM',
    scope: 'Session · Baseline → Option 1',
    before: 'Baseline (immutable)',
    after: 'Option 1 (editable)',
    option: 'Option 1',
    undo: 'No undo',
    affectedCount: 1300,
    affected: [],
  },
  {
    id: 'e7',
    action: 'Imported Customer Master enhancements',
    user: 'Priya Raman',
    timestamp: 'Yesterday 9:12 AM',
    scope: 'Customer Master · 1,214 records',
    before: 'Pre-import values',
    after: 'Preferred Route, Delivery Days, Latitude/Longitude updated',
    option: '—',
    undo: 'No undo',
    affectedCount: 1214,
    affected: rows(['1000004', '1000108'], '—', 'Lat/Lon missing', 'Lat/Lon set'),
  },
  {
    id: 'e8',
    action: 'Applied reconcile',
    user: 'Dana Whitfield',
    timestamp: 'Yesterday 8:50 AM',
    scope: 'Session · 22 new customers added, 6 removed',
    before: '1,284 customers',
    after: '1,300 customers',
    option: 'Option 1',
    undo: 'No undo',
    affectedCount: 28,
    affected: [],
  },
  {
    id: 'e9',
    action: 'Reverted to baseline',
    user: 'Michael Reeves',
    timestamp: '07/22/2026 5:31 PM',
    scope: 'Option 2 · discarded',
    before: 'Option 2 edits',
    after: 'Baseline values',
    option: 'Option 2',
    undo: 'No undo',
    affectedCount: 412,
    affected: [],
  },
  {
    id: 'e10',
    action: 'Finalized option',
    user: 'Dana Whitfield',
    timestamp: 'Last Friday 3:18 PM',
    scope: 'Lafayette session · Final Plan',
    before: 'Draft',
    after: 'Finalized',
    option: 'Final Plan',
    undo: 'No undo',
    affectedCount: 980,
    affected: [],
  },
  {
    id: 'e11',
    action: 'Exported handheld file',
    user: 'Dana Whitfield',
    timestamp: 'Last Friday 3:20 PM',
    scope: 'Lafayette · 4,910 stops',
    before: '—',
    after: 'StopList_LAF_FinalPlan.csv',
    option: 'Final Plan',
    undo: 'No undo',
    affectedCount: 4910,
    affected: [],
  },
  {
    id: 'e12',
    action: 'Edited customer',
    user: 'Dana Whitfield',
    timestamp: '07/20/2026 11:02 AM',
    scope: 'Route 978 · route removed, 0 customers affected',
    before: 'Route 978 present',
    after: 'Route 978 removed',
    option: 'Option 1',
    undo: 'No undo',
    affectedCount: 0,
    affected: [],
  },
]

export const ACTIVITY_PREVIEW_CAP = 100

export const UNDO_COPY = {
  confirmTitle: 'Undo this action?',
  successToast: 'Action undone. Route metrics are recalculating.',
  unavailableBadge: 'No undo',
  unavailableTooltip: 'This action can’t be undone.',
  conflictTitle: 'This can’t be undone',
  conflictBody:
    'This customer has been edited since this action was applied, so the original change can no longer be safely reverted.',
  permanentTitle: 'This action can’t be undone',
  permanentBody:
    'Applying this reconcile will permanently remove customers from this option. You will not be able to undo this action from the activity feed.',
  permanentKeyword: 'APPLY',
}

/* ==========================================================================
   Part I — Customer Master enhancement import
   ========================================================================== */

export const IMPORT_FILE = {
  name: 'Location Sales Extension Report Brewpoint Excel (1).xlsx',
  fields: 17,
  rows: 1300,
}

export const COORD_FORMATS = ['Decimal Degrees', 'Degrees Minutes Seconds', 'UTM']
export const SERVICE_TIME_FORMATS = ['Tenths of Minutes', 'Whole Minutes', 'Seconds']
export const FILE_SOURCES = [
  'Brewpoint Extension Report',
  'Legacy RoadNet Export',
  'Manual Territory Audit',
]
export const FILE_LAYOUTS = ['Standard Layout', 'Legacy Layout', 'Custom Mapping']

export interface LayoutField {
  field: string
  example: string
  /** Colour band used to group related fields in the layout preview. */
  band: 'key' | 'pattern' | 'volume' | 'territory' | 'meta'
}

export const FILE_LAYOUT_FIELDS: LayoutField[] = [
  { field: 'Location Id', example: '1000004', band: 'key' },
  { field: 'S Pat Id', example: '4T', band: 'pattern' },
  { field: 'S Pat Set Id', example: 'E4W', band: 'pattern' },
  { field: 'Location Type', example: 'SIT', band: 'key' },
  { field: 'Total Units', example: '45.25', band: 'volume' },
  { field: 'Total Revenue', example: '372.36', band: 'volume' },
  { field: 'Total Volume', example: '4.67', band: 'volume' },
  { field: 'Day String', example: 'MTWRF', band: 'pattern' },
  { field: 'Curr Territory', example: '975', band: 'territory' },
  { field: 'Prev Delivery Days', example: 'T', band: 'pattern' },
  { field: 'Prev Weeks', example: 'X X X X X X', band: 'pattern' },
  { field: 'Prev Territory', example: '975', band: 'territory' },
  { field: 'Sales Group', example: '126', band: 'territory' },
  { field: 'Station Cnt', example: '1', band: 'meta' },
  { field: 'Rental Eqp Cnt', example: '0', band: 'meta' },
  { field: 'Last Inv Date', example: '2/10/2026', band: 'meta' },
  { field: 'Location Name', example: '— hidden in previews', band: 'meta' },
]

export const BAND_COLORS: Record<LayoutField['band'], string> = {
  key: '#c9812b',
  pattern: '#4f6b82',
  volume: '#3f7d58',
  territory: '#8a6a3a',
  meta: '#6b6b6b',
}

export const ENHANCEMENT_SUMMARY = {
  rowsRead: 1300,
  matched: 1214,
  skipped: 86,
  fieldsToUpdate: 3,
  errors: 12,
}

export const FIELDS_UPDATED = ['Preferred Route', 'Delivery Days', 'Latitude/Longitude']

export const FIELDS_UNCHANGED = [
  'Customer name',
  'Contact details',
  'Address',
  'Service time',
  'Time windows',
  'Account type',
]

export const IMPORT_STEPS = [
  'Reading rows…',
  'Matching Location IDs…',
  'Validating coordinates…',
  'Updating Customer Master fields…',
  'Preparing result report…',
]

/* ==========================================================================
   Part J — Error report
   ========================================================================== */

export interface EnhancementError {
  row: number
  locationId: string
  code: string
  message: string
  correction: string
}

export const ENHANCEMENT_ERRORS: EnhancementError[] = [
  {
    row: 34,
    locationId: '—',
    code: 'MISSING_ID',
    message: 'No Location ID in this row.',
    correction: 'Add the Location ID and re-upload.',
  },
  {
    row: 112,
    locationId: '1009911',
    code: 'UNKNOWN_LOCATION_ID',
    message: 'No customer in Master with this ID.',
    correction:
      'This import only updates existing customers. New customers are added through Extension Report reconcile.',
  },
  {
    row: 208,
    locationId: '1000603',
    code: 'NON_NUMERIC_COORD',
    message: 'Latitude or longitude isn’t a number.',
    correction: 'Check for text or symbols in the coordinate columns.',
  },
  {
    row: 341,
    locationId: '1000889',
    code: 'LAT_OUT_OF_RANGE',
    message: 'Latitude must be between -90 and 90.',
    correction: 'Verify latitude and longitude aren’t swapped.',
  },
  {
    row: 477,
    locationId: '1001027',
    code: 'LNG_OUT_OF_RANGE',
    message: 'Longitude must be between -180 and 180.',
    correction: 'Verify latitude and longitude aren’t swapped.',
  },
  {
    row: 602,
    locationId: '1001188',
    code: 'NULL_ISLAND',
    message: 'Coordinates are 0, 0.',
    correction: 'This usually means missing coordinates — leave blank instead.',
  },
  {
    row: 745,
    locationId: '1001402',
    code: 'NON_NUMERIC_COORD',
    message: 'Latitude or longitude isn’t a number.',
    correction: 'Check for text or symbols in the coordinate columns.',
  },
  {
    row: 883,
    locationId: '—',
    code: 'MISSING_ID',
    message: 'No Location ID in this row.',
    correction: 'Add the Location ID and re-upload.',
  },
]

export const ERROR_PREVIEW_CAP = 100

export const IMPORT_NOTES = {
  privacy: 'Customer contact values are hidden in import previews and error reports.',
  decision:
    'Current handling: one row equals one outcome. If coordinates are invalid, the full row is skipped.',
  neverCreates:
    'This import updates existing customers only. It never creates new customers — those arrive through the Extension Report reconcile flow.',
  geocode:
    'Coordinates will be read from the uploaded file. Address-based geocoding is not available in this version.',
  noOverwrite:
    'Columns not included in the file will not overwrite existing Customer Master values.',
}

/* ==========================================================================
   Part K — Cycle length change edge case
   ========================================================================== */

export const CYCLE_IMPACT = {
  total: 324,
  weeks: [
    { week: 5, assignments: 82 },
    { week: 6, assignments: 91 },
    { week: 7, assignments: 74 },
    { week: 8, assignments: 77 },
  ],
}

/* ==========================================================================
   Part L — Finalization checklist
   ========================================================================== */

/** The confirmed finalization checklist. */
export const FINALIZE_CHECKLIST: string[] = [
  'All included customers have a route',
  'All included customers have a delivery day',
  'All included customers have a delivery week',
  'Frequency is valid: 7, 14, 28, or 56 days',
  'Sales Group validated',
  'Customer Master status reviewed',
  'No Customer Master missing customers included in handheld output',
  'Route warnings reviewed',
  'Helper selections reviewed',
  'Activity feed synced',
]

export interface FinalizeIssue {
  count: number
  text: string
  /** Deep-link hint so the reviewer can jump to the offending rows. */
  target?: { screen: string; params?: Record<string, string> }
}

/** Blocking issues — must be resolved before handheld export. */
export const FINALIZE_BLOCKERS: FinalizeIssue[] = [
  { count: 12, text: 'customers are missing delivery week.' },
  {
    count: 5,
    text: 'customers are not in Customer Master and are still included in handheld output.',
  },
  { count: 3, text: 'customers have invalid frequency values.' },
  { count: 2, text: 'customers have a missing or unrecognised Sales Group.' },
]

/** Warnings — can ship once acknowledged. */
export const FINALIZE_WARNINGS_LIST: FinalizeIssue[] = [
  { count: 8, text: 'customers have preferred route mismatch.' },
  { count: 2, text: `routes exceed ${45} hours.` },
  { count: 4, text: 'fake/load customers will be excluded from handheld output.' },
  { count: 6, text: 'customers have a service pattern override applied.' },
  { count: 3, text: 'moves reduced route balance.' },
  { count: 2, text: 'customers need a creation request in Customer Master.' },
]

export const FINALIZE_COPY = {
  intro:
    'Review unresolved warnings and confirm the final route plan before export.',
  split:
    'Some warnings can ship acknowledged, but blocking issues must be resolved before handheld export.',
  blockedTooltip: 'Resolve blocking issues before finalizing.',
  acknowledgeHint:
    'Acknowledge the warnings above to enable finalization. Each acknowledgement is recorded in the activity feed.',
}

/* ==========================================================================
   Part M — Stop List export
   ========================================================================== */

export const EXPORT_FILE_NAME = 'Stop_List_DeliveryScenario_2026_07_Option1.xlsx'

export const EXPORT_MISSING_FIELDS = {
  rows: 12,
  detail: '12 customer rows are missing required fields.',
}

/* ==========================================================================
   Part N — Open decisions
   ========================================================================== */

export interface OpenDecisionRow {
  n: number
  decision: string
  owner: string
  blocks: string
  recommendation?: string
  status: 'Open' | 'Recommended' | 'Confirmed' | 'Needs discussion with Matt'
}

export const OPEN_DECISION_ROWS: OpenDecisionRow[] = [
  {
    n: 1,
    decision: 'One row per customer or one row per service day?',
    owner: 'Hadi',
    blocks: 'grid, drawer, bulk assign',
    recommendation:
      'Use one row per service day with grouped rows if balancing needs day-level precision.',
    status: 'Recommended',
  },
  {
    n: 2,
    decision: 'What are the actual assignment rules?',
    owner: 'Hadi and client',
    blocks: 'violation copy, picker constraints',
    status: 'Open',
  },
  {
    n: 3,
    decision: 'Are week numbers 1 to cycle length, or always 1–8?',
    owner: 'Hadi',
    blocks: 'week picker',
    recommendation: 'Show only valid weeks for the cycle.',
    status: 'Recommended',
  },
  {
    n: 4,
    decision: 'What happens to Week 5–8 assignments when session changes from 8 to 4?',
    owner: 'Product',
    blocks: 'confirmation behavior',
    status: 'Open',
  },
  {
    n: 5,
    decision: 'Bad coordinates: reject whole row or only coordinates?',
    owner: 'Hadi',
    blocks: 'import error handling',
    recommendation: 'Reject whole row.',
    status: 'Recommended',
  },
  {
    n: 6,
    decision: 'Is customer drawer one shared component or two?',
    owner: 'Zaid and engineering',
    blocks: 'component architecture',
    status: 'Open',
  },
  {
    n: 7,
    decision: 'Canonical activity feed names?',
    owner: 'Design proposes, Haasham confirms',
    blocks: 'activity feed and undo',
    status: 'Open',
  },
  {
    n: 8,
    decision:
      'Sandbox mechanics / Review Mode — is this a per-session mode the analyst switches on? What tells the system “now check me”? Is there a review button at the end? Is a background-colour change enough to show review mode?',
    owner: 'Matt and Product',
    blocks: 'review mode UI, when validation runs, finalize entry point',
    recommendation:
      'Not designed yet. Deliberately left as a draft concept pending the next meeting — do not present any sandbox behaviour as final.',
    status: 'Needs discussion with Matt',
  },
]

/* ==========================================================================
   Part O — Implementation alignment checklist
   ========================================================================== */

export interface AlignmentRow {
  expected: string
  implemented: 'Yes' | 'Partial' | 'No' | 'To verify'
  notes: string
  openQuestion?: string
}

export interface AlignmentSection {
  title: string
  rows: AlignmentRow[]
}

export const ALIGNMENT_SECTIONS: AlignmentSection[] = [
  {
    title: 'Authentication',
    rows: [
      {
        expected: 'Role determines what the user can do, not just what they see.',
        implemented: 'To verify',
        notes: 'Prototype gates visually. Server-side enforcement must be confirmed in build.',
        openQuestion: 'Are permissions enforced on the API, not only the UI?',
      },
      {
        expected: 'Analyst can view Customer Master but cannot import enhancements.',
        implemented: 'Yes',
        notes: 'Disabled CTA plus explanatory tooltip.',
      },
    ],
  },
  {
    title: 'Data Ingestion',
    rows: [
      {
        expected: 'Files are staged and never applied automatically.',
        implemented: 'Yes',
        notes: 'Upload → confirm columns → validate → review → import.',
      },
      {
        expected: 'Import never overwrites an existing session baseline.',
        implemented: 'Yes',
        notes: 'Baselines keep the snapshot they were created from.',
      },
    ],
  },
  {
    title: 'Master Dataset',
    rows: [
      {
        expected: 'Exactly one dataset is Active and seeds new baselines.',
        implemented: 'Yes',
        notes: 'Archived datasets are retained for audit but cannot seed a baseline.',
      },
    ],
  },
  {
    title: 'Sessions',
    rows: [
      {
        expected: 'Sessions list is the landing screen, not Create Session.',
        implemented: 'Yes',
        notes: 'Create Session is a child route.',
      },
      {
        expected: 'Cycle length change warns before affecting existing assignments.',
        implemented: 'Partial',
        notes: 'Warning modal exists; destructive behaviour intentionally not built.',
        openQuestion: 'Decision 4 — what happens to Week 5–8 assignments?',
      },
    ],
  },
  {
    title: 'Baseline / Option Logic',
    rows: [
      {
        expected: 'Baseline is immutable in every surface, including the map.',
        implemented: 'Yes',
        notes: 'Writes disabled, lasso disabled, explanatory tooltips throughout.',
      },
      {
        expected: 'All edits apply only to the active option.',
        implemented: 'Yes',
        notes: 'Option 1 is the working option; Save As creates further options.',
      },
    ],
  },
  {
    title: 'Route Workspace Grid',
    rows: [
      {
        expected: 'Grouped header bands for Planning / Imported / Customer Master fields.',
        implemented: 'Yes',
        notes: 'Optional columns via the Columns menu.',
      },
      {
        expected: 'One row per customer per service day, grouped so rows never read as duplicates.',
        implemented: 'Yes',
        notes: 'Group header, indent rail, explicit row count.',
        openQuestion: 'Decision 1 — confirm the row model before build.',
      },
    ],
  },
  {
    title: 'Customer Detail Drawer',
    rows: [
      {
        expected: 'Zones for session planning, derived values and Customer Master.',
        implemented: 'Yes',
        notes: 'One Save, no field-level autosave.',
      },
      {
        expected: 'Pattern conflicts warn inline and explain the rule.',
        implemented: 'Yes',
        notes: 'Inline warning plus a View rule popover.',
        openQuestion: 'Block by default, or warn and allow override?',
      },
      {
        expected: 'Is the drawer one shared component across contexts?',
        implemented: 'To verify',
        notes: 'Prototype uses one component for all entry points.',
        openQuestion: 'Decision 6 — one shared component or two?',
      },
    ],
  },
  {
    title: 'Bulk Assign Day / Week',
    rows: [
      {
        expected: 'All-or-nothing writes with no silent partial update.',
        implemented: 'Yes',
        notes: 'Partial only after explicit exclusion.',
      },
      {
        expected: 'Week picker shows only weeks valid for the cycle.',
        implemented: 'Yes',
        notes: '4-week variant hides Wk 5–8.',
        openQuestion: 'Decision 3 — confirm week numbering.',
      },
    ],
  },
  {
    title: 'Map / Lasso',
    rows: [
      {
        expected: 'Spatial selection with pre-move validation before applying.',
        implemented: 'Yes',
        notes: 'Valid / partially blocked / fully blocked states.',
      },
      {
        expected: 'No live vehicle tracking or delivery status.',
        implemented: 'Yes',
        notes: 'Static planning canvas only.',
      },
    ],
  },
  {
    title: 'Validation States',
    rows: [
      {
        expected: 'Disable, don’t reject, when the system already knows an action is blocked.',
        implemented: 'Yes',
        notes: 'Inline disabled controls with tooltips; modal only for menu/shortcut triggers.',
      },
      {
        expected: 'Every failed write states how many, which rows, why and what next.',
        implemented: 'Yes',
        notes: 'Applies to bulk assign, reassign and lasso moves.',
      },
    ],
  },
  {
    title: 'Activity Feed / Undo',
    rows: [
      {
        expected: 'A bulk action on 1,300 customers is one entry, not 1,300.',
        implemented: 'Yes',
        notes: 'Affected rows are a capped expandable preview.',
      },
      {
        expected: 'Undo states cover available, success, unavailable, conflict and permanent.',
        implemented: 'Yes',
        notes: 'Permanent actions require type-to-confirm.',
        openQuestion: 'Decision 7 — confirm canonical action names.',
      },
    ],
  },
  {
    title: 'Customer Master Enhancement Import',
    rows: [
      {
        expected: 'Updates existing customers only; never creates new ones.',
        implemented: 'Yes',
        notes: 'Stated on the form and repeated in the error report correction copy.',
      },
      {
        expected: 'Column confirmation states exactly which fields change.',
        implemented: 'Yes',
        notes: 'Fields updated and fields left unchanged are both listed.',
      },
      {
        expected: 'Invalid coordinates skip the row.',
        implemented: 'Yes',
        notes: 'One row equals one outcome.',
        openQuestion: 'Decision 5 — reject whole row or only coordinates?',
      },
    ],
  },
  {
    title: 'Finalize',
    rows: [
      {
        expected: 'Finalize is blocked while blocking rule violations remain.',
        implemented: 'Yes',
        notes: 'Disabled CTA with an explanatory tooltip and a Review warnings path.',
      },
    ],
  },
  {
    title: 'Export Stop List',
    rows: [
      {
        expected: 'Export is disabled until an option is finalized.',
        implemented: 'Yes',
        notes: 'Disabled CTA plus tooltip; guard modal explains both conditions.',
      },
      {
        expected: 'Missing required fields block generation and are reviewable.',
        implemented: 'Yes',
        notes: '12 rows missing required fields in the sample state.',
      },
    ],
  },
]

export const RN_NOTES = {
  rn111:
    'RN-111 is a review/audit ticket. It does not introduce new user-facing features.',
  rn145Title: 'RN-145 has no user-facing design.',
  rn145:
    'No product UI is required. This is an internal backend test suite to verify business rules continue to work as code changes.',
}

/* ==========================================================================
   Part Q — Validation message system
   ========================================================================== */

export interface ValidationExample {
  type: string
  purpose: string
  when: string
  copy: string
}

export const VALIDATION_EXAMPLES: ValidationExample[] = [
  {
    type: 'Inline warning',
    purpose: 'Flag a rule conflict without stopping the analyst mid-edit.',
    when: 'A field-level change breaks a pattern but the row is still editable.',
    copy: 'This breaks the customer’s delivery pattern.',
  },
  {
    type: 'Blocking modal',
    purpose: 'State clearly that nothing was written.',
    when: 'A bulk write failed validation, or an action was triggered from a menu.',
    copy: 'No changes were applied.',
  },
  {
    type: 'Disabled tooltip',
    purpose: 'Explain why a visible control cannot be used.',
    when: 'The system already knows the action is not allowed.',
    copy: 'The baseline can’t be edited. Save as a new option to make changes.',
  },
  {
    type: 'Violation list',
    purpose: 'Show exactly which rows failed and why.',
    when: 'One or more rows in a bulk action are blocked.',
    copy: 'Service pattern does not allow Tuesday.',
  },
  {
    type: 'Success toast',
    purpose: 'Confirm a write landed, and offer undo where possible.',
    when: 'A change was committed to the active option.',
    copy: 'Changes applied to Option 1.',
  },
  {
    type: 'Progress state',
    purpose: 'Show a long write is running and what stage it is at.',
    when: 'A bulk operation is processing.',
    copy: 'Applying assignment · 642 of 1,300 customers checked',
  },
  {
    type: 'Audit note',
    purpose: 'Record that protected data was revealed.',
    when: 'A user reveals a masked contact value.',
    copy: 'Name revealed and audit logged.',
  },
]
