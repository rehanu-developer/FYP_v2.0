/**
 * RouteOps Cloud V4 — mock data layer.
 *
 * Everything the prototype renders comes from this file. There is no backend.
 * All figures are deterministic so screenshots are reproducible.
 *
 * Headline sample data (fixed by the V4 spec):
 *   Session   Delivery Scenario as of 07/23/2026, 4:42 PM
 *   Status    Draft          Scenario  Delivery      Cycle  8 Week
 *   Routes    970 - 977 (8)  Customers 1,300         Revenue $830,809
 *   Baseline  Immutable      Active option  Option 1
 */

/* ==========================================================================
   Types
   ========================================================================== */

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
/**
 * All seven days exist as a TYPE, but only Monday-Friday are schedulable.
 * Use SCHEDULABLE_DAYS from data/rules.ts for any picker or control.
 */
export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const WEEKDAY_FULL: Record<Weekday, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
}

export type ValidationStatus = 'Valid' | 'Warning' | 'Blocked'
export type MasterStatus = 'In Master' | 'Not in Master'
export type MismatchStatus = 'Match' | 'Mismatch' | null

/** One planning row in the Option B row model: customer x service day. */
export interface ServiceDayRow {
  id: string
  customerId: string
  day: Weekday
  week: number
  route: string
  revenueAllocation: number
  sequence: number
  status: ValidationStatus
}

export interface CustomerRecord {
  customerId: string
  name: string
  masterStatus: MasterStatus
  route: string
  servicePattern: string | null
  frequency: string
  serviceDays: Weekday[]
  weeks: number[]
  totalRevenue: number
  totalUnits: number
  totalVolume: number
  currTerritory: string
  prevTerritory: string
  salesGroup: string
  stationCount: number
  rentalEquipmentCount: number
  lastInvoiceDate: string
  preferredRoute: string | null
  routeMismatch: MismatchStatus
  addressStatus: 'Available' | 'Unavailable'
  address: string | null
  serviceTimeMin: number | null
  timeWindow: string | null
  geoStatus: 'Geocoded' | 'Approximate' | 'Missing'
  status: ValidationStatus
  statusReason?: string
  /** Handheld output eligibility (confirmed direction). */
  frequencyDays: number | null
  salesGroupValid: boolean
  /** False when the analyst has intentionally excluded the customer. */
  includedInHandheld: boolean
  /** Customer created purely to carry load / structure, not a real account. */
  loadCustomer: boolean
  /** A service pattern conflict was accepted via override. */
  patternOverride: boolean
  /** Option B rows, derived from serviceDays. */
  rows: ServiceDayRow[]
  /** Normalised 0-100 map position for the spatial planning canvas. */
  mx: number
  my: number
}

/* ==========================================================================
   Session / scenario constants
   ========================================================================== */

export const SESSION = {
  name: 'Delivery Scenario as of 07/23/2026, 4:42 PM',
  market: 'Baton Rouge',
  scenario: 'Delivery',
  cycle: '8 Week' as '4 Week' | '8 Week',
  cycleWeeks: 8,
  startingWeek: 'Wk 1',
  depot: 'BR North',
  timePeriod: 'July 2026',
  status: 'Draft',
  activeOption: 'Option 1',
  customers: 1300,
  routes: 8,
  revenue: 830809,
  createdAt: '07/23/2026, 4:42 PM',
}

export const ROUTE_IDS = ['970', '971', '972', '973', '974', '975', '976', '977']

/** Week pairs for an 8-week cycle: 1+5, 2+6, 3+7, 4+8. */
export const WEEK_PAIRS: [number, number][] = [
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
]

export const USER = {
  name: 'Michael Reeves',
  role: 'Routing Analyst',
  org: 'Community Coffee',
  initials: 'MR',
}

/* ==========================================================================
   Service patterns — drive real validation in the prototype
   ========================================================================== */

export interface ServicePattern {
  code: string
  name: string
  frequency: string
  /** Handheld output accepts 7 / 14 / 28 / 56 only. null = non-conforming. */
  frequencyDays: number | null
  allowedDays: Weekday[]
  allowedWeeks: number[]
  visitsPerCycle: number
}

export const SERVICE_PATTERNS: Record<string, ServicePattern> = {
  E4W: {
    code: 'E4W',
    name: 'Established weekly',
    frequency: 'Every 7 days',
    frequencyDays: 7,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 8,
  },
  '1W': {
    code: '1W',
    name: 'Weekly',
    frequency: 'Every 7 days',
    frequencyDays: 7,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 8,
  },
  EOW: {
    code: 'EOW',
    name: 'Every other week',
    frequency: 'Every 14 days',
    frequencyDays: 14,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 3, 5, 7],
    visitsPerCycle: 4,
  },
  '4T': {
    code: '4T',
    name: 'Every fourth week',
    frequency: 'Every 28 days',
    frequencyDays: 28,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 5],
    visitsPerCycle: 2,
  },
  '8T': {
    code: '8T',
    name: 'Every eighth week',
    frequency: 'Every 56 days',
    frequencyDays: 56,
    // Mid-week only: this pattern never services Monday or Friday.
    allowedDays: ['Tue', 'Wed', 'Thu'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 1,
  },
  '2T': {
    code: '2T',
    name: 'Early-week weekly',
    frequency: 'Every 7 days',
    frequencyDays: 7,
    // Early-week only: no Thursday or Friday service.
    allowedDays: ['Mon', 'Tue', 'Wed'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 8,
  },
  '3W': {
    code: '3W',
    name: 'Three times weekly',
    frequency: 'Every 7 days',
    frequencyDays: 7,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 24,
  },
  // Retained to demonstrate the invalid-frequency export blocker: twice weekly
  // is not one of the permitted 7/14/28/56 day cycles.
  '2W': {
    code: '2W',
    name: 'Twice weekly (non-conforming)',
    frequency: 'Twice weekly',
    frequencyDays: null,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    allowedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    visitsPerCycle: 16,
  },
}

/** Shared rule engine used by the drawer, the grid and the bulk assign flow. */
export function validateAssignment(
  pattern: string | null,
  day: Weekday,
  week: number,
): { ok: boolean; reason?: string } {
  if (!pattern || !SERVICE_PATTERNS[pattern]) {
    return { ok: false, reason: 'Customer is missing a required service pattern.' }
  }
  const p = SERVICE_PATTERNS[pattern]
  if (!p.allowedDays.includes(day)) {
    return {
      ok: false,
      reason: `Service pattern does not allow ${WEEKDAY_FULL[day]}.`,
    }
  }
  if (!p.allowedWeeks.includes(week)) {
    return {
      ok: false,
      reason: `Week ${week} is not valid for this customer’s pattern.`,
    }
  }
  return { ok: true }
}

/* ==========================================================================
   Customer rows
   ========================================================================== */

/** Tiny deterministic PRNG so map pins and filler metrics never shift. */
function lcg(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

function money(n: number) {
  return Math.round(n * 100) / 100
}

/** Expands a customer into Option B rows: one row per customer per service day. */
function buildRows(c: Omit<CustomerRecord, 'rows'>): ServiceDayRow[] {
  const per = c.serviceDays.length ? money(c.totalRevenue / c.serviceDays.length) : 0
  const primaryWeek = c.weeks[0] ?? 1
  return c.serviceDays.map((day, i) => {
    const v = validateAssignment(c.servicePattern, day, primaryWeek)
    return {
      id: `${c.customerId}-${day}-${primaryWeek}`,
      customerId: c.customerId,
      day,
      week: primaryWeek,
      route: c.route,
      revenueAllocation: per,
      sequence: i + 1,
      status: v.ok ? c.status : c.status === 'Valid' ? 'Warning' : c.status,
    }
  })
}

type Seed = {
  customerId: string
  name: string
  route: string
  pattern: string | null
  days: Weekday[]
  weeks: number[]
  revenue: number
  master: MasterStatus
  preferred: string | null
  addressAvailable?: boolean
  status: ValidationStatus
  statusReason?: string
  includedInHandheld?: boolean
  loadCustomer?: boolean
  salesGroupValid?: boolean
  patternOverride?: boolean
}

/**
 * The three rows called out explicitly in the V4 spec come first and use the
 * exact spec values. The remaining rows give the grid realistic density.
 */
const SEEDS: Seed[] = [
  {
    customerId: '1000004',
    name: 'Magnolia Diner',
    route: '970',
    pattern: 'E4W',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    weeks: [1, 5],
    revenue: 372.36,
    master: 'In Master',
    preferred: '970',
    status: 'Valid',
  },
  {
    customerId: '1000108',
    name: 'Riverbend Fuel & Go',
    route: '971',
    pattern: '4T',
    days: ['Tue'],
    weeks: [3],
    revenue: 210.84,
    master: 'Not in Master',
    preferred: null,
    addressAvailable: false,
    status: 'Warning',
    statusReason: 'Customer is not present in the Customer Master.',
  },
  {
    customerId: '1000214',
    name: 'Perkins Road Bistro',
    route: '972',
    pattern: '2W',
    days: ['Wed'],
    weeks: [2],
    revenue: 480.2,
    master: 'In Master',
    preferred: '970',
    status: 'Warning',
    statusReason:
      'Planned route 972 differs from the Customer Master preferred route 970.',
  },
  {
    customerId: '1000297',
    name: 'Highland Market Café',
    route: '970',
    pattern: '2W',
    days: ['Mon', 'Thu'],
    weeks: [1, 5],
    revenue: 641.5,
    master: 'In Master',
    preferred: '970',
    status: 'Valid',
  },
  {
    customerId: '1000341',
    name: 'Sherwood Forest Hotel',
    route: '970',
    pattern: '3W',
    days: ['Mon', 'Wed', 'Fri'],
    weeks: [1, 5],
    revenue: 1284.9,
    master: 'In Master',
    preferred: '970',
    status: 'Valid',
  },
  {
    customerId: '1000418',
    name: 'Bluebonnet Office Park',
    route: '971',
    pattern: '1W',
    days: ['Tue'],
    weeks: [2, 6],
    revenue: 318.75,
    master: 'In Master',
    preferred: '971',
    status: 'Valid',
  },
  {
    customerId: '1000462',
    name: 'Coursey Blvd Grocery',
    route: '971',
    pattern: 'EOW',
    days: ['Wed'],
    weeks: [1, 5],
    revenue: 224.4,
    master: 'In Master',
    preferred: '971',
    status: 'Valid',
  },
  {
    customerId: '1000541',
    name: 'Gonzales Travel Plaza',
    route: '970',
    pattern: '8T',
    days: ['Wed'],
    weeks: [2],
    revenue: 156.8,
    master: 'In Master',
    preferred: '970',
    status: 'Valid',
  },
  {
    customerId: '1000603',
    name: 'Old Hammond Deli',
    route: '972',
    pattern: '1W',
    days: ['Thu'],
    weeks: [3, 7],
    revenue: 402.15,
    master: 'In Master',
    preferred: '972',
    status: 'Valid',
  },
  {
    customerId: '1000677',
    name: 'Jefferson Hwy Bakery',
    route: '972',
    pattern: '2W',
    days: ['Mon', 'Fri'],
    weeks: [2, 6],
    revenue: 738.6,
    master: 'In Master',
    preferred: '973',
    status: 'Warning',
    statusReason:
      'Planned route 972 differs from the Customer Master preferred route 973.',
  },
  {
    customerId: '1000745',
    name: 'Airline Hwy Truck Stop',
    route: '973',
    pattern: '1W',
    days: ['Fri'],
    weeks: [4, 8],
    revenue: 512.3,
    master: 'In Master',
    preferred: '973',
    status: 'Valid',
  },
  {
    customerId: '1000812',
    name: 'Denham Springs Grill',
    route: '970',
    pattern: null,
    days: ['Fri'],
    weeks: [5],
    revenue: 289.05,
    master: 'In Master',
    preferred: '970',
    status: 'Blocked',
    statusReason: 'Customer is missing a required service pattern.',
  },
  {
    customerId: '1000889',
    name: 'Zachary Corner Store',
    route: '973',
    pattern: 'EOW',
    days: ['Tue'],
    weeks: [3, 7],
    revenue: 198.4,
    master: 'In Master',
    preferred: '973',
    status: 'Valid',
  },
  {
    customerId: '1000934',
    name: 'Baker Community Center',
    route: '974',
    pattern: '1W',
    days: ['Mon'],
    weeks: [1, 5],
    revenue: 176.2,
    master: 'Not in Master',
    preferred: null,
    addressAvailable: false,
    status: 'Warning',
    statusReason: 'Customer is not present in the Customer Master.',
  },
  {
    customerId: '1001027',
    name: 'Mid City Roastery',
    route: '974',
    pattern: '3W',
    days: ['Mon', 'Wed', 'Fri'],
    weeks: [2, 6],
    revenue: 1420.75,
    master: 'In Master',
    preferred: '974',
    status: 'Valid',
  },
  {
    customerId: '1001103',
    name: 'Government St Diner',
    route: '974',
    pattern: '8T',
    days: ['Tue', 'Fri'],
    weeks: [1, 5],
    revenue: 604.9,
    master: 'In Master',
    preferred: '974',
    status: 'Warning',
    statusReason: 'Service pattern 8T does not allow Friday.',
  },
  {
    customerId: '1001188',
    name: 'Siegen Lane Cafeteria',
    route: '975',
    pattern: '1W',
    days: ['Wed'],
    weeks: [3, 7],
    revenue: 388.45,
    master: 'In Master',
    preferred: '975',
    status: 'Valid',
  },
  {
    customerId: '1001254',
    name: 'Prairieville Market',
    route: '975',
    pattern: 'EOW',
    days: ['Thu'],
    weeks: [1, 5],
    revenue: 245.6,
    master: 'In Master',
    preferred: '975',
    status: 'Valid',
  },
  {
    customerId: '1001319',
    name: 'Burbank Student Union',
    route: '975',
    pattern: 'E4W',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    weeks: [1, 5],
    revenue: 1892.4,
    master: 'In Master',
    preferred: '975',
    status: 'Valid',
  },
  {
    customerId: '1001402',
    name: 'Plank Road Wholesale',
    route: '976',
    pattern: '1W',
    days: ['Fri'],
    weeks: [2, 6],
    revenue: 466.8,
    master: 'In Master',
    preferred: '976',
    status: 'Valid',
  },
  {
    customerId: '1001478',
    name: 'Central Thruway Depot',
    route: '976',
    pattern: '2W',
    days: ['Mon', 'Wed'],
    weeks: [4, 8],
    revenue: 852.35,
    master: 'In Master',
    preferred: '976',
    status: 'Valid',
  },
  {
    customerId: '1001536',
    name: 'Greenwell Springs Clinic',
    route: '976',
    pattern: '8T',
    days: ['Thu'],
    weeks: [4],
    revenue: 132.9,
    master: 'In Master',
    preferred: '976',
    status: 'Valid',
  },
  {
    customerId: '1001611',
    name: 'Port Allen Refinery Canteen',
    route: '977',
    pattern: '3W',
    days: ['Tue', 'Wed', 'Thu'],
    weeks: [1, 5],
    revenue: 1655.2,
    master: 'In Master',
    preferred: '977',
    status: 'Valid',
  },
  {
    customerId: '1001689',
    name: 'Brusly Feed & Supply',
    route: '977',
    pattern: 'EOW',
    days: ['Mon'],
    weeks: [3, 7],
    revenue: 208.15,
    master: 'In Master',
    preferred: '977',
    status: 'Valid',
  },
  {
    customerId: '1001744',
    name: 'Addis Family Restaurant',
    route: '977',
    pattern: '1W',
    days: ['Mon'],
    weeks: [2, 6],
    revenue: 342.7,
    master: 'In Master',
    preferred: '977',
    status: 'Valid',
  },
  {
    // Not in Customer Master AND still included -> blocks handheld export.
    customerId: '1000874',
    name: 'Coliseum Load Point',
    route: '970',
    pattern: '1W',
    days: ['Wed'],
    weeks: [2, 6],
    revenue: 0,
    master: 'Not in Master',
    preferred: null,
    addressAvailable: false,
    status: 'Warning',
    statusReason:
      'Not in CC Customer Master. Cannot be included in handheld output.',
    loadCustomer: true,
  },
  {
    // Sales Group fails validation -> blocks handheld export.
    customerId: '1001960',
    name: 'Westside Depot Overflow',
    route: '976',
    pattern: '1W',
    days: ['Thu'],
    weeks: [1, 5],
    revenue: 143.2,
    master: 'In Master',
    preferred: '976',
    status: 'Warning',
    statusReason: 'Sales Group is missing or not recognised.',
    salesGroupValid: false,
  },
  {
    // Intentionally excluded by the analyst -> never blocks, just does not ship.
    customerId: '1002014',
    name: 'Baker Yard Staging',
    route: '974',
    pattern: '1W',
    days: ['Tue'],
    weeks: [3, 7],
    revenue: 0,
    master: 'Not in Master',
    preferred: null,
    addressAvailable: false,
    status: 'Warning',
    statusReason: 'Excluded from handheld output by the analyst.',
    loadCustomer: true,
    includedInHandheld: false,
  },
  {
    customerId: '1001820',
    name: 'Livonia Quick Mart',
    route: '973',
    pattern: '1W',
    days: ['Thu'],
    weeks: [1, 5],
    revenue: 289.9,
    master: 'In Master',
    preferred: '971',
    status: 'Warning',
    statusReason:
      'Planned route 973 differs from the Customer Master preferred route 971.',
  },
]

const STREETS = [
  'Perkins Rd',
  'Highland Rd',
  'Coursey Blvd',
  'Airline Hwy',
  'Jefferson Hwy',
  'Government St',
  'Plank Rd',
  'Burbank Dr',
  'Siegen Ln',
  'Greenwell Springs Rd',
]
const SALES_GROUPS = ['Foodservice', 'C-Store', 'Office Coffee', 'Grocery', 'Institutional']

function buildCustomers(): CustomerRecord[] {
  const rnd = lcg(20260723)
  return SEEDS.map((s, i) => {
    const routeIdx = ROUTE_IDS.indexOf(s.route)
    const inMaster = s.master === 'In Master'
    const addressAvailable = s.addressAvailable !== false && inMaster
    const visits = s.pattern ? (SERVICE_PATTERNS[s.pattern]?.visitsPerCycle ?? 0) : 0
    const base: Omit<CustomerRecord, 'rows'> = {
      customerId: s.customerId,
      name: s.name,
      masterStatus: s.master,
      route: s.route,
      servicePattern: s.pattern,
      frequency: s.pattern ? (SERVICE_PATTERNS[s.pattern]?.frequency ?? '—') : '—',
      serviceDays: s.days,
      weeks: s.weeks,
      totalRevenue: s.revenue,
      totalUnits: Math.round(s.revenue / 8.4),
      totalVolume: money(s.revenue / 46.5),
      currTerritory: s.route,
      prevTerritory: i % 5 === 0 ? ROUTE_IDS[(routeIdx + 1) % 8] : s.route,
      salesGroup: SALES_GROUPS[i % SALES_GROUPS.length],
      stationCount: 1 + Math.floor(rnd() * 4),
      rentalEquipmentCount: Math.floor(rnd() * 3),
      lastInvoiceDate: `07/${String(8 + (i % 15)).padStart(2, '0')}/2026`,
      preferredRoute: s.preferred,
      routeMismatch: !inMaster || !s.preferred ? null : s.preferred === s.route ? 'Match' : 'Mismatch',
      addressStatus: addressAvailable ? 'Available' : 'Unavailable',
      address: addressAvailable
        ? `${1200 + i * 37} ${STREETS[i % STREETS.length]}, Baton Rouge, LA 708${String(10 + (i % 80)).padStart(2, '0')}`
        : null,
      serviceTimeMin: addressAvailable ? 8 + Math.floor(rnd() * 18) : null,
      timeWindow: addressAvailable
        ? ['06:00 – 11:00', '07:00 – 14:00', '08:00 – 12:00', 'No restriction'][i % 4]
        : null,
      geoStatus: addressAvailable ? (i % 9 === 0 ? 'Approximate' : 'Geocoded') : 'Missing',
      status: s.status,
      statusReason: s.statusReason,
      frequencyDays: s.pattern ? (SERVICE_PATTERNS[s.pattern]?.frequencyDays ?? null) : null,
      salesGroupValid: s.salesGroupValid !== false,
      includedInHandheld: s.includedInHandheld !== false,
      loadCustomer: s.loadCustomer === true,
      patternOverride: s.patternOverride === true,
      // Cluster pins by route so lasso selection reads as spatially coherent.
      mx: 12 + routeIdx * 10.5 + rnd() * 9,
      my: 16 + ((routeIdx * 37) % 60) + rnd() * 18,
    }
    void visits
    return { ...base, rows: buildRows(base) }
  })
}

export const CUSTOMERS: CustomerRecord[] = buildCustomers()

/** Flat Option B row list. */
export const SERVICE_DAY_ROWS: ServiceDayRow[] = CUSTOMERS.flatMap((c) => c.rows)

/* ==========================================================================
   Map pins
   --------------------------------------------------------------------------
   The grid renders 26 representative customers, but a planning map has to
   look like the whole market or spatial decisions make no sense. So the map
   renders 260 pins clustered by route: the 26 real customers plus synthetic
   context pins. Each pin stands for MAP_PIN_SCALE customers, which is how the
   lasso converts a pin count into a session-scale customer count.
   ========================================================================== */

export interface MapPin {
  id: string
  route: string
  mx: number
  my: number
  revenue: number
  /** Set only for the representative customers that exist in the grid. */
  customerId?: string
  blocked?: boolean
}

export const MAP_PIN_TOTAL = 260
export const MAP_PIN_SCALE = SESSION.customers / MAP_PIN_TOTAL // = 5

function buildMapPins(): MapPin[] {
  const pins: MapPin[] = CUSTOMERS.map((c) => ({
    id: `real-${c.customerId}`,
    route: c.route,
    mx: c.mx,
    my: c.my,
    revenue: c.totalRevenue,
    customerId: c.customerId,
    blocked: !c.servicePattern,
  }))

  const rnd = lcg(776411)
  const perRoute = Math.round((MAP_PIN_TOTAL - pins.length) / ROUTE_IDS.length)

  ROUTE_IDS.forEach((route, routeIdx) => {
    for (let i = 0; i < perRoute; i++) {
      pins.push({
        id: `ctx-${route}-${i}`,
        route,
        // Same cluster geometry as the representative customers.
        mx: 12 + routeIdx * 10.5 + rnd() * 9,
        my: 16 + ((routeIdx * 37) % 60) + rnd() * 18,
        revenue: money(140 + rnd() * 900),
      })
    }
  })

  return pins
}

export const MAP_PINS: MapPin[] = buildMapPins()

/* ==========================================================================
   Routes
   ========================================================================== */

export interface RouteRecord {
  route: string
  driver: string
  customers: number
  serviceTimeMin: number
  travelTimeMin: number
  totalHours: string
  /** Weekly total. The 45-hour target is a weekly figure. */
  totalMinutes: number
  revenue: number
  /** Helper is now selectable on ANY scenario (confirmed direction). */
  helperSelected: boolean
  /** Whether the current helper state differs from the baseline snapshot. */
  helperFromBaseline: boolean
  scenario: RouteScenarioName
  status: 'Over 45h' | 'Balanced' | 'Underused'
  /** Set when a planning move made this route less balanced. */
  balanceWarning: boolean
  sequenceOptimized: boolean
  potentialSavingMin: number
}

/** Baseline / Presell / Delivery all support helpers now. */
export type RouteScenarioName = 'Baseline' | 'Presell' | 'Delivery' | 'Conventional'

export const ROUTES: RouteRecord[] = [
  {
    route: '970',
    driver: 'M. Daniels',
    customers: 180,
    serviceTimeMin: 1560,
    travelTimeMin: 1220,
    totalHours: '46h 20m',
    totalMinutes: 2780,
    revenue: 112840,
    helperSelected: true,
    helperFromBaseline: false,
    scenario: 'Delivery',
    status: 'Over 45h',
    balanceWarning: true,
    sequenceOptimized: false,
    potentialSavingMin: 12,
  },
  {
    route: '971',
    driver: 'R. Carter',
    customers: 160,
    serviceTimeMin: 1320,
    travelTimeMin: 1055,
    totalHours: '39h 35m',
    totalMinutes: 2375,
    revenue: 95520,
    helperSelected: false,
    helperFromBaseline: true,
    scenario: 'Presell',
    status: 'Balanced',
    balanceWarning: false,
    sequenceOptimized: true,
    potentialSavingMin: 0,
  },
  {
    route: '972',
    driver: 'A. Lewis',
    customers: 142,
    serviceTimeMin: 1080,
    travelTimeMin: 900,
    totalHours: '33h 00m',
    totalMinutes: 1980,
    revenue: 84420,
    helperSelected: true,
    helperFromBaseline: true,
    scenario: 'Baseline',
    status: 'Underused',
    balanceWarning: false,
    sequenceOptimized: false,
    potentialSavingMin: 7,
  },
  {
    route: '973',
    driver: 'T. Boudreaux',
    customers: 172,
    serviceTimeMin: 1425,
    travelTimeMin: 1200,
    totalHours: '43h 45m',
    totalMinutes: 2625,
    revenue: 108940,
    helperSelected: false,
    helperFromBaseline: true,
    scenario: 'Delivery',
    status: 'Balanced',
    balanceWarning: false,
    sequenceOptimized: false,
    potentialSavingMin: 5,
  },
  {
    route: '974',
    driver: 'J. Ellison',
    customers: 158,
    serviceTimeMin: 1350,
    travelTimeMin: 1130,
    totalHours: '41h 20m',
    totalMinutes: 2480,
    revenue: 101220,
    helperSelected: true,
    helperFromBaseline: false,
    scenario: 'Presell',
    status: 'Balanced',
    balanceWarning: false,
    sequenceOptimized: true,
    potentialSavingMin: 0,
  },
  {
    route: '975',
    driver: 'D. Fontenot',
    customers: 166,
    serviceTimeMin: 1400,
    travelTimeMin: 1170,
    totalHours: '42h 50m',
    totalMinutes: 2570,
    revenue: 106480,
    helperSelected: false,
    helperFromBaseline: true,
    scenario: 'Delivery',
    status: 'Balanced',
    balanceWarning: false,
    sequenceOptimized: false,
    potentialSavingMin: 9,
  },
  {
    route: '976',
    driver: 'K. Sonnier',
    customers: 148,
    serviceTimeMin: 1130,
    travelTimeMin: 940,
    totalHours: '34h 30m',
    totalMinutes: 2070,
    revenue: 96330,
    helperSelected: false,
    helperFromBaseline: true,
    scenario: 'Conventional',
    status: 'Underused',
    balanceWarning: false,
    sequenceOptimized: false,
    potentialSavingMin: 4,
  },
  {
    route: '977',
    driver: 'L. Guidry',
    customers: 174,
    serviceTimeMin: 1545,
    travelTimeMin: 1225,
    totalHours: '46h 10m',
    totalMinutes: 2770,
    revenue: 125059,
    helperSelected: true,
    helperFromBaseline: false,
    scenario: 'Presell',
    status: 'Over 45h',
    balanceWarning: false,
    sequenceOptimized: false,
    potentialSavingMin: 15,
  },
]

/**
 * Weekly route target used by the balancer, the metrics tab and the route
 * warnings. 45 hours, per the confirmed direction. Exceeding it WARNS, never
 * blocks planning.
 */
export const TARGET_MINUTES = 45 * 60

/* ==========================================================================
   Sessions
   ========================================================================== */

export interface SessionRecord {
  name: string
  market: string
  cycle: string
  scenario: string
  timePeriod: string
  activeVersion: string
  routes: number
  customers: number
  status: string
  lastEdited: string
}

export const SESSIONS: SessionRecord[] = [
  {
    name: 'Delivery Scenario as of 07/23/2026, 4:42 PM',
    market: 'Baton Rouge',
    cycle: '8 Week',
    scenario: 'Delivery',
    timePeriod: 'July 2026',
    activeVersion: 'Option 1',
    routes: 8,
    customers: 1300,
    status: 'Draft',
    lastEdited: 'Today',
  },
  {
    name: 'Baton Rouge Baseline Review',
    market: 'Baton Rouge',
    cycle: '4 Week',
    scenario: 'Baseline',
    timePeriod: 'July 2026',
    activeVersion: 'Baseline',
    routes: 8,
    customers: 1300,
    status: 'Baseline Created',
    lastEdited: 'Yesterday',
  },
  {
    name: 'Lafayette 2026-08 Planning',
    market: 'Lafayette',
    cycle: '8 Week',
    scenario: 'Delivery',
    timePeriod: 'August 2026',
    activeVersion: 'Final Plan',
    routes: 6,
    customers: 980,
    status: 'Finalized',
    lastEdited: 'Last Friday',
  },
]

/* ==========================================================================
   Datasets
   ========================================================================== */

export interface DatasetRecord {
  name: string
  source: string
  rows: number
  status: string
  uploadedBy: string
  uploadedAt: string
}

export const DATASETS: DatasetRecord[] = [
  {
    name: 'ExtensionReport_BR_2026-07-23.xlsx',
    source: 'Extension Report',
    rows: 1300,
    status: 'Active',
    uploadedBy: 'Michael Reeves',
    uploadedAt: 'Today, 4:38 PM',
  },
  {
    name: 'CustomerMaster_Enhancement_0722.xlsx',
    source: 'Customer Master',
    rows: 1246,
    status: 'Imported',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: 'Yesterday, 9:12 AM',
  },
  {
    name: 'RoadNet_Export_BR.prn',
    source: 'Legacy RoadNet',
    rows: 1298,
    status: 'Archived',
    uploadedBy: 'Michael Reeves',
    uploadedAt: '07/18/2026, 2:04 PM',
  },
  {
    name: 'ExtensionReport_LAF_2026-07-15.xlsx',
    source: 'Extension Report',
    rows: 980,
    status: 'Archived',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '07/15/2026, 11:47 AM',
  },
]

/* ==========================================================================
   Activity feed
   ========================================================================== */

export interface ActivityRecord {
  id: string
  text: string
  detail?: string
  actor: string
  time: string
  kind: 'edit' | 'system' | 'success' | 'warning'
  undoable?: boolean
  scope?: string
}

export const ACTIVITY: ActivityRecord[] = [
  {
    id: 'a1',
    text: 'Assigned 1,300 customers to Tuesday, Week 3',
    detail: 'Bulk assignment applied to all customers matching Route 970 filter.',
    actor: 'Michael Reeves',
    time: '4:58 PM',
    kind: 'edit',
    undoable: true,
    scope: 'Option 1',
  },
  {
    id: 'a2',
    text: 'Route 970 re-sequenced by quickest time',
    detail: '12 minutes saved. Stop order updated for 180 customers.',
    actor: 'Michael Reeves',
    time: '4:51 PM',
    kind: 'success',
    undoable: true,
    scope: 'Option 1',
  },
  {
    id: 'a3',
    text: 'Reassigned 34 customers from Route 972 to Route 976',
    detail: 'Selected via map lasso on the spatial planning canvas.',
    actor: 'Michael Reeves',
    time: '4:47 PM',
    kind: 'edit',
    undoable: true,
    scope: 'Option 1',
  },
  {
    id: 'a4',
    text: 'Option 1 created from Baseline',
    detail: 'Save As created an editable option. Baseline remains locked.',
    actor: 'Michael Reeves',
    time: '4:44 PM',
    kind: 'system',
    scope: 'Session',
  },
  {
    id: 'a5',
    text: 'Baseline snapshot created',
    detail: '1,300 customer rows captured from the active master dataset.',
    actor: 'System',
    time: '4:42 PM',
    kind: 'system',
    scope: 'Session',
  },
  {
    id: 'a6',
    text: 'Session created — Delivery Scenario as of 07/23/2026',
    detail: 'Baton Rouge · 8 Week · Delivery · Depot BR North',
    actor: 'Michael Reeves',
    time: '4:42 PM',
    kind: 'system',
    scope: 'Session',
  },
  {
    id: 'a7',
    text: '54 customer rows flagged Not in Master',
    detail: 'Address, preferred route and service time are unavailable for these rows.',
    actor: 'System',
    time: '4:42 PM',
    kind: 'warning',
    scope: 'Session',
  },
  {
    id: 'a8',
    text: 'Dataset ExtensionReport_BR_2026-07-23.xlsx set to Active',
    actor: 'Michael Reeves',
    time: '4:38 PM',
    kind: 'system',
    scope: 'Master Dataset',
  },
]


/* ==========================================================================
   Bulk-assign scope population + real scope validation
   --------------------------------------------------------------------------
   The bulk assign flow operates on the full 1,300-customer selection, not on
   the 26 rows the grid renders. This is the documented pattern mix of that
   selection, and validateScope() runs the real rule engine across it.

   Consequence of this mix, which is what drives the two demo paths:
     Tuesday + Week 3  -> 0 failures   ("All 1,300 customers can be assigned")
     Friday   + Week 3  -> 14 failures (8T and 2T never service Friday)

   Every pattern here allows Tuesday and Week 3, so the success path is
   genuinely true rather than asserted. Nothing in this selection is missing a
   service pattern; the 6 pattern-less rows counted in FINALIZE_CHECKS are a
   session-wide data-quality blocker outside this filtered selection.
   ========================================================================== */

export interface ScopeGroup {
  pattern: string
  customers: number
  /** Representative customer IDs surfaced in the violation table. */
  sampleIds: string[]
}

export const SCOPE_POPULATION: ScopeGroup[] = [
  { pattern: 'E4W', customers: 430, sampleIds: [] },
  { pattern: '1W', customers: 338, sampleIds: [] },
  { pattern: '2W', customers: 210, sampleIds: [] },
  { pattern: '3W', customers: 142, sampleIds: [] },
  { pattern: 'EOW', customers: 102, sampleIds: [] },
  { pattern: '4T', customers: 64, sampleIds: [] },
  {
    pattern: '8T',
    customers: 9,
    sampleIds: ['1000541', '1001536', '1001742', '1000318', '1001188'],
  },
  { pattern: '2T', customers: 5, sampleIds: ['1000214', '1000812', '1001103'] },
]

/** Sanity: the documented mix must total the session customer count. */
export const SCOPE_TOTAL = SCOPE_POPULATION.reduce((n, g) => n + g.customers, 0)

export interface ScopeViolationGroup {
  pattern: string
  count: number
  reason: string
  sampleIds: string[]
}

export interface ScopeValidation {
  total: number
  failed: number
  passed: number
  groups: ScopeViolationGroup[]
}

/**
 * Runs validateAssignment() across the whole selection population.
 * Returns aggregate counts plus a per-pattern breakdown for the violation table.
 */
export function validateScope(day: Weekday, week: number): ScopeValidation {
  const groups: ScopeViolationGroup[] = []
  let failed = 0

  for (const g of SCOPE_POPULATION) {
    const result = validateAssignment(g.pattern, day, week)
    if (result.ok) continue
    failed += g.customers
    groups.push({
      pattern: g.pattern,
      count: g.customers,
      reason: result.reason!,
      sampleIds: g.sampleIds,
    })
  }

  return { total: SCOPE_TOTAL, failed, passed: SCOPE_TOTAL - failed, groups }
}

/** Row shape for the failure-state violation table. */
export interface ViolationRow {
  customerId: string
  route: string
  currentDay: string
  currentWeek: string
  pattern: string
  reason: string
}

/**
 * Expands a scope validation into individual violation rows for display.
 * Current day/week values are deterministic so screenshots stay stable.
 */
export function buildViolationRows(v: ScopeValidation, limit = 6): ViolationRow[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu']
  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 5']
  const rows: ViolationRow[] = []
  let i = 0
  for (const g of v.groups) {
    for (const id of g.sampleIds) {
      if (rows.length >= limit) return rows
      rows.push({
        customerId: id,
        route: '970',
        currentDay: days[i % days.length],
        currentWeek: weeks[i % weeks.length],
        pattern: g.pattern,
        reason: g.reason,
      })
      i++
    }
  }
  return rows
}

/* ==========================================================================
   Customer Master enhancement import (column mapping + error report)
   ========================================================================== */

export interface ColumnMapping {
  sourceColumn: string
  sample: string
  target: string
  action: 'Update' | 'Ignore' | 'Create'
  affected: number
  destructive?: boolean
}

export const COLUMN_MAPPINGS: ColumnMapping[] = [
  {
    sourceColumn: 'CUST_ID',
    sample: '1000004',
    target: 'Customer ID (match key)',
    action: 'Update',
    affected: 1246,
  },
  {
    sourceColumn: 'ADDR_LINE1',
    sample: '1200 Perkins Rd',
    target: 'Address',
    action: 'Update',
    affected: 1198,
  },
  {
    sourceColumn: 'LAT',
    sample: '30.4213',
    target: 'Latitude',
    action: 'Update',
    affected: 1204,
  },
  {
    sourceColumn: 'LON',
    sample: '-91.1871',
    target: 'Longitude',
    action: 'Update',
    affected: 1204,
  },
  {
    sourceColumn: 'SVC_MINS',
    sample: '14',
    target: 'Service Time',
    action: 'Update',
    affected: 1120,
  },
  {
    sourceColumn: 'WINDOW',
    sample: '06:00-11:00',
    target: 'Time Window',
    action: 'Update',
    affected: 942,
    destructive: true,
  },
  {
    sourceColumn: 'PREF_RTE',
    sample: '970',
    target: 'Preferred Route',
    action: 'Update',
    affected: 1246,
    destructive: true,
  },
  {
    sourceColumn: 'LEGACY_SEQ',
    sample: '0042',
    target: 'Not mapped',
    action: 'Ignore',
    affected: 0,
  },
]

export interface ImportError {
  row: number
  customerId: string
  column: string
  value: string
  problem: string
  severity: 'Blocked' | 'Warning'
}

export const IMPORT_ERRORS: ImportError[] = [
  {
    row: 47,
    customerId: '1000418',
    column: 'LAT',
    value: '—',
    problem: 'Latitude is empty. Customer cannot be placed on the map.',
    severity: 'Blocked',
  },
  {
    row: 112,
    customerId: '1000603',
    column: 'SVC_MINS',
    value: '-6',
    problem: 'Service time must be a positive number of minutes.',
    severity: 'Blocked',
  },
  {
    row: 205,
    customerId: '1000889',
    column: 'PREF_RTE',
    value: '9A1',
    problem: 'Preferred route 9A1 does not exist in Reference Data.',
    severity: 'Blocked',
  },
  {
    row: 318,
    customerId: '1001027',
    column: 'WINDOW',
    value: '25:00-31:00',
    problem: 'Time window is not a valid 24-hour range.',
    severity: 'Blocked',
  },
  {
    row: 402,
    customerId: '1001188',
    column: 'ADDR_LINE1',
    value: 'PO BOX 4471',
    problem: 'PO Box cannot be geocoded. Address will stay unverified.',
    severity: 'Warning',
  },
  {
    row: 559,
    customerId: '1001402',
    column: 'CUST_ID',
    value: '1001402',
    problem: 'Duplicate customer ID appears on rows 559 and 1032.',
    severity: 'Blocked',
  },
  {
    row: 774,
    customerId: '1001611',
    column: 'LON',
    value: '91.1871',
    problem: 'Longitude is positive. Expected a negative value for Louisiana.',
    severity: 'Warning',
  },
]

export const IMPORT_SUMMARY = {
  fileName: 'CustomerMaster_Enhancement_0723.xlsx',
  totalRows: 1246,
  ready: 1198,
  warnings: 34,
  blocked: 14,
  newCustomers: 22,
  unchanged: 890,
}

/* ==========================================================================
   Finalization + export
   ========================================================================== */

export interface FinalizeCheck {
  label: string
  detail: string
  severity: 'blocker' | 'warning' | 'pass'
  count: number
}

export const FINALIZE_CHECKS: FinalizeCheck[] = [
  {
    label: 'Customers missing a service pattern',
    detail: 'These rows cannot be converted into stops and will not export.',
    severity: 'blocker',
    count: 6,
  },
  {
    label: 'Customers with no delivery day assigned',
    detail: 'Every planning row needs a delivery day before finalization.',
    severity: 'blocker',
    count: 3,
  },
  {
    label: 'Routes over the 8h target',
    detail: 'Routes 970 and 977 exceed the target working day.',
    severity: 'warning',
    count: 2,
  },
  {
    label: 'Customers not in Customer Master',
    detail: 'These rows will export without address or service time data.',
    severity: 'warning',
    count: 54,
  },
  {
    label: 'Route mismatches against preferred route',
    detail: 'Planned route differs from the Customer Master preferred route.',
    severity: 'warning',
    count: 38,
  },
  {
    label: 'Service pattern and delivery day agree',
    detail: 'All remaining rows pass day and week pattern validation.',
    severity: 'pass',
    count: 1291,
  },
  {
    label: 'Every route has a driver assigned',
    detail: 'All 8 routes have a named driver.',
    severity: 'pass',
    count: 8,
  },
]

export interface ExportRecord {
  name: string
  option: string
  format: string
  rows: number
  status: string
  createdBy: string
  createdAt: string
}

export const EXPORTS: ExportRecord[] = [
  {
    name: 'StopList_BR_Option1_draft.csv',
    option: 'Option 1',
    format: 'Stop List CSV',
    rows: 6482,
    status: 'Blocked',
    createdBy: 'Michael Reeves',
    createdAt: 'Today, 5:02 PM',
  },
  {
    name: 'StopList_LAF_FinalPlan.csv',
    option: 'Final Plan',
    format: 'Stop List CSV',
    rows: 4910,
    status: 'Exported',
    createdBy: 'Dana Whitfield',
    createdAt: 'Last Friday, 3:20 PM',
  },
  {
    name: 'RouteSummary_LAF_FinalPlan.xlsx',
    option: 'Final Plan',
    format: 'Route Summary',
    rows: 6,
    status: 'Exported',
    createdBy: 'Dana Whitfield',
    createdAt: 'Last Friday, 3:21 PM',
  },
]

/** Stop List preview — the export unit is a stop, derived from planning rows. */
export interface StopRow {
  stopId: string
  customerId: string
  route: string
  day: Weekday
  week: number
  sequence: number
  serviceTime: number
  window: string
  address: string
}

export function buildStopList(): StopRow[] {
  const out: StopRow[] = []
  CUSTOMERS.filter((c) => c.route === '970' || c.route === '971').forEach((c) => {
    c.rows.forEach((r, i) => {
      out.push({
        stopId: `${c.customerId}-${r.week}-${r.day}`,
        customerId: c.customerId,
        route: r.route,
        day: r.day,
        week: r.week,
        sequence: i + 1,
        serviceTime: c.serviceTimeMin ?? 12,
        window: c.timeWindow ?? 'No restriction',
        address: c.address ?? 'Not in Customer Master',
      })
    })
  })
  return out.slice(0, 14)
}

/* ==========================================================================
   Reference data
   ========================================================================== */

export const MARKETS = ['Baton Rouge', 'Lafayette', 'New Orleans', 'Hammond', 'Alexandria']
export const SCENARIOS = ['Delivery', 'Presale', 'Conventional', 'Baseline']
export const DEPOTS = ['BR North', 'BR South', 'Lafayette Central', 'Hammond Yard']
export const TIME_PERIODS = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Q4 2026']
export const STARTING_WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']

/* ==========================================================================
   Formatting helpers
   ========================================================================== */

export function fmtMoney(n: number, decimals = 0) {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function fmtNum(n: number) {
  return n.toLocaleString('en-US')
}

export function fmtMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function weekLabels(cycleWeeks: number) {
  return Array.from({ length: cycleWeeks }, (_, i) => i + 1)
}
