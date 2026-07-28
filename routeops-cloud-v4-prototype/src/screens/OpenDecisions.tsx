/**
 * Open Decisions.
 * Design-decision frame, not a production screen. Every question that must be
 * answered by Community Coffee before build, with the recommendation and the
 * consequence of each option.
 */
import { Badge, Card, SectionHead } from '../components/ui'
import { BookIcon } from '../components/icons'

interface Decision {
  n: number
  title: string
  question: string
  why: string
  options: { label: string; consequence: string; recommended?: boolean }[]
  owner: string
  status: 'Open' | 'Recommended' | 'Blocked on client'
  blocks: string
}

const DECISIONS: Decision[] = [
  {
    n: 1,
    title: 'Row model',
    question:
      'Does the planning grid use one row per customer, or one row per customer per service day?',
    why: 'Determines the grid, the validation model, the balancer input and the export row count.',
    options: [
      {
        label: 'Option A — one row per customer',
        consequence: '1,300 rows. Simpler grid, weaker day/week balancing.',
      },
      {
        label: 'Option B — one row per customer per service day',
        consequence: '~6,500 rows. Needs grouping, but enables balancing and clean validation.',
        recommended: true,
      },
    ],
    owner: 'Client + Engineering',
    status: 'Recommended',
    blocks: 'Route Workspace grid, Stop List export, balancer',
  },
  {
    n: 2,
    title: 'Revenue allocation across service days',
    question: 'How is a customer’s revenue split across its service-day rows?',
    why: 'Affects route revenue totals, balancing decisions and Fleet Lead reporting.',
    options: [
      {
        label: 'Even split (total ÷ service days)',
        consequence: 'Simple and predictable. Currently implemented in the prototype.',
        recommended: true,
      },
      {
        label: 'Weighted by day-of-week volume',
        consequence: 'More accurate but needs historical volume per weekday per customer.',
      },
      {
        label: 'No allocation — show total on the group row only',
        consequence: 'Avoids the question, but route revenue by day becomes unavailable.',
      },
    ],
    owner: 'Client',
    status: 'Open',
    blocks: 'Metrics tab, balancer, route revenue reporting',
  },
  {
    n: 3,
    title: 'Week-pair semantics',
    question:
      'In an 8-week cycle, is assigning a customer to Wk 3 the same as assigning it to Wk 3 + Wk 7?',
    why: 'Changes whether the week picker sets one week or a pair, and how many stops export.',
    options: [
      {
        label: 'Pair is implicit — picking Wk 3 also serves Wk 7',
        consequence: 'Matches how the legacy RoadNet workflow was described.',
        recommended: true,
      },
      {
        label: 'Weeks are independent — Wk 3 and Wk 7 assigned separately',
        consequence: 'More control, but doubles the assignment work for the analyst.',
      },
    ],
    owner: 'Client',
    status: 'Blocked on client',
    blocks: 'Assign Day / Week drawer, Stop List row count',
  },
  {
    n: 4,
    title: 'Selection scope semantics',
    question:
      'Does "12 selected" mean 12 customers or 12 service-day rows in the Option B grid?',
    why: 'The bulk-action scope message must be unambiguous at 1,300-customer scale.',
    options: [
      {
        label: 'Customer-level selection',
        consequence:
          'Selecting a customer selects all its service-day rows. Currently implemented.',
        recommended: true,
      },
      {
        label: 'Row-level selection',
        consequence:
          'Allows moving a single Wednesday visit, but the scope language gets much harder.',
      },
    ],
    owner: 'Client + Design',
    status: 'Recommended',
    blocks: 'Selection states, bulk action bar, Assign / Reassign drawers',
  },
  {
    n: 5,
    title: 'Manual selection limit',
    question: 'Is 500 the right ceiling for manual row selection?',
    why: 'Above the limit the analyst must switch to "Select all matching filters".',
    options: [
      { label: '500 rows', consequence: 'Current assumption. Keeps the UI responsive.', recommended: true },
      { label: '1,000 rows', consequence: 'Fewer forced switches, slower grid interactions.' },
      { label: 'No limit', consequence: 'Risk of accidental mass edits with no filter trail.' },
    ],
    owner: 'Engineering',
    status: 'Open',
    blocks: 'Selection state 4',
  },
  {
    n: 6,
    title: 'Not-in-Master customers at export',
    question:
      'Should customers missing a Customer Master record be exported with blank address fields, or excluded?',
    why: '54 rows in the current session are Not in Master.',
    options: [
      {
        label: 'Export with blanks and a warning',
        consequence: 'Downstream system must tolerate blanks. Currently implemented.',
        recommended: true,
      },
      { label: 'Exclude from export', consequence: 'Clean file, but silently drops real customers.' },
      { label: 'Block finalization entirely', consequence: 'Safest, but may stall every cycle.' },
    ],
    owner: 'Client',
    status: 'Open',
    blocks: 'Finalization warnings, export guard, Stop List',
  },
  {
    n: 7,
    title: 'Route mismatch severity',
    question: 'Is planning a customer off its preferred route a warning or a blocker?',
    why: 'Balancing inevitably creates mismatches — the balancer proposal raises them from 38 to 53.',
    options: [
      {
        label: 'Warning only',
        consequence: 'Balancing stays usable. Currently implemented.',
        recommended: true,
      },
      { label: 'Blocker', consequence: 'Preferred route becomes a hard constraint; balancing breaks.' },
      {
        label: 'Warning, with a per-session mismatch budget',
        consequence: 'Middle ground, needs a threshold from the client.',
      },
    ],
    owner: 'Client',
    status: 'Open',
    blocks: 'Grid badges, finalization warnings, balancer',
  },
  {
    n: 8,
    title: 'Undo depth',
    question: 'How far back can the analyst undo?',
    why: 'The prototype offers undo on the most recent write via toast and Activity.',
    options: [
      {
        label: 'Last action only',
        consequence: 'Simple. Matches the toast pattern. Currently implemented.',
        recommended: true,
      },
      { label: 'Full session history', consequence: 'Powerful, significantly more engineering.' },
      {
        label: 'No undo — rely on Save As options',
        consequence: 'Cheapest, but punishing at 1,300-row scale.',
      },
    ],
    owner: 'Client + Engineering',
    status: 'Open',
    blocks: 'Toasts, Activity feed',
  },
  {
    n: 9,
    title: 'Sequencing scope',
    question: 'Does "Sequence by Quickest Time" run per route, or per route + day + week?',
    why: 'A route serves different customers on different days, so one sequence per route is ambiguous.',
    options: [
      {
        label: 'Per route + day + week',
        consequence: 'Correct for a real stop list. Increases run time.',
        recommended: true,
      },
      {
        label: 'Per route only',
        consequence: 'Faster and simpler, but the resulting order is not directly drivable.',
      },
    ],
    owner: 'Engineering',
    status: 'Blocked on client',
    blocks: 'Sequencer states, Stop List SEQUENCE column',
  },
]

export function OpenDecisions() {
  const open = DECISIONS.filter((d) => d.status === 'Open').length
  const blocked = DECISIONS.filter((d) => d.status === 'Blocked on client').length
  const rec = DECISIONS.filter((d) => d.status === 'Recommended').length

  return (
    <div className="page">
      <div className="page-head">
        <div className="row tight" style={{ marginBottom: 8 }}>
          <Badge tone="info" icon={<BookIcon size={12} />}>
            Design decision · not a production screen
          </Badge>
        </div>
        <h1 className="page-title">Open Decisions</h1>
        <p className="page-sub">
          Every question that changes the build and still needs an answer. The prototype already
          implements one option for each — these are the choices being proposed, not assumed.
        </p>
      </div>

      <div className="row wrap" style={{ gap: 'var(--s6)', marginBottom: 'var(--s6)' }}>
        <Stat label="Total decisions" value={String(DECISIONS.length)} />
        <Stat label="Recommendation ready" value={String(rec)} tone="valid" />
        <Stat label="Open" value={String(open)} tone="warning" />
        <Stat label="Blocked on client" value={String(blocked)} tone="blocked" />
      </div>

      <SectionHead title="Decisions" />

      <div className="stack-4">
        {DECISIONS.map((d) => (
          <Card key={d.n}>
            <div className="card-head">
              <div style={{ minWidth: 0 }}>
                <div className="row tight">
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--sidebar)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      flex: '0 0 auto',
                    }}
                  >
                    {d.n}
                  </span>
                  <span className="section-title">{d.title}</span>
                </div>
                <div className="section-sub">{d.question}</div>
              </div>
              <Badge
                tone={
                  d.status === 'Recommended'
                    ? 'valid'
                    : d.status === 'Blocked on client'
                      ? 'blocked'
                      : 'warning'
                }
              >
                {d.status}
              </Badge>
            </div>
            <div className="card-body">
              <div className="callout" style={{ marginBottom: 'var(--s4)' }}>
                <strong style={{ color: 'var(--text)' }}>Why it matters:</strong> {d.why}
              </div>

              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th style={{ width: '34%' }}>Option</th>
                      <th>Consequence</th>
                      <th style={{ width: 130 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {d.options.map((o) => (
                      <tr key={o.label}>
                        <td className="t-med" style={{ whiteSpace: 'normal' }}>
                          {o.label}
                        </td>
                        <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                          {o.consequence}
                        </td>
                        <td className="right">
                          {o.recommended && <Badge tone="progress">Recommended</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-foot">
              <span className="t-xs t-ter">
                Owner: <strong>{d.owner}</strong>
              </span>
              <span className="t-xs t-ter">·</span>
              <span className="t-xs t-ter">Blocks: {d.blocks}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'valid' | 'warning' | 'blocked'
}) {
  return (
    <div>
      <div className="strip-label">{label}</div>
      <div className="row tight" style={{ marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600 }} className="tnum">
          {value}
        </span>
        {tone && <Badge tone={tone}>{label.toLowerCase()}</Badge>}
      </div>
    </div>
  )
}
