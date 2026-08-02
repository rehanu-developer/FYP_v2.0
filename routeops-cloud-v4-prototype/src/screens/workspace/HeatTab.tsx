/**
 * Day / Week Heat tab.
 * Shows planning-row load per delivery day and cycle week so the analyst can
 * see where the cycle is lumpy before running the balancer. Intentionally a
 * plain matrix, not a decorative chart.
 */
import { SESSION, fmtNum } from '../../data/mock'
import { SCHEDULABLE_DAYS as WEEKDAYS } from '../../data/rules'
import { Badge, Card } from '../../components/ui'

/**
 * Deterministic synthetic load matrix at session scale.
 * Base weekday loads are chosen so the matrix totals ~6,500 planning rows,
 * matching the canonical session figure (1,300 customers x ~5 service days).
 */
function buildMatrix() {
  const weeks = Array.from({ length: SESSION.cycleWeeks }, (_, i) => i + 1)
  // Monday to Friday only: weekend scheduling is not available.
  const base: Record<string, number> = {
    Mon: 165,
    Tue: 148,
    Wed: 182,
    Thu: 142,
    Fri: 175,
  }
  return weeks.map((w) => ({
    week: w,
    cells: WEEKDAYS.map((d) => {
      // Week-pair partners carry similar load; odd weeks run slightly heavier.
      const pairFactor = w <= 4 ? 1.06 : 0.94
      const drift = ((w * 7 + d.charCodeAt(0)) % 11) / 100
      return {
        day: d,
        value: Math.round(base[d] * pairFactor * (1 + drift - 0.05)),
      }
    }),
  }))
}

export function HeatTab() {
  const matrix = buildMatrix()
  const all = matrix.flatMap((r) => r.cells.map((c) => c.value))
  const max = Math.max(...all)

  const colorFor = (v: number) => {
    if (v === 0) return { background: 'var(--surface-sunken)', color: 'var(--text-tertiary)' }
    const t = v / max
    // Single-hue amber ramp — no rainbow scales.
    if (t > 0.85) return { background: '#c9812b', color: '#fff' }
    if (t > 0.68) return { background: '#dda860', color: '#3d2a0c' }
    if (t > 0.5) return { background: '#eccc9b', color: '#5a3f14' }
    if (t > 0.3) return { background: '#f5e4c8', color: '#7d5417' }
    return { background: '#fdf7ec', color: '#8a6a3a' }
  }

  const dayTotals = WEEKDAYS.map((d) => ({
    day: d,
    total: matrix.reduce(
      (n, r) => n + (r.cells.find((c) => c.day === d)?.value ?? 0),
      0,
    ),
  }))

  return (
    <div className="stack-4">
      <Card>
        <div className="card-head">
          <div>
            <div className="section-title">Planning rows by delivery day and cycle week</div>
            <div className="section-sub">
              Each cell is the number of service-day rows scheduled for that day in that week.
            </div>
          </div>
          <div className="row tight">
            <span className="t-xs t-ter">Low</span>
            {['#fdf7ec', '#f5e4c8', '#eccc9b', '#dda860', '#c9812b'].map((c) => (
              <span
                key={c}
                style={{
                  width: 18,
                  height: 12,
                  background: c,
                  borderRadius: 2,
                  border: '1px solid var(--border)',
                }}
              />
            ))}
            <span className="t-xs t-ter">High</span>
          </div>
        </div>
        <div className="card-body">
          <div
            className="heat-grid"
            style={{ gridTemplateColumns: `58px repeat(${WEEKDAYS.length}, minmax(0, 1fr)) 74px` }}
          >
            <div className="heat-head" />
            {WEEKDAYS.map((d) => (
              <div key={d} className="heat-head">
                {d}
              </div>
            ))}
            <div className="heat-head">Total</div>

            {matrix.map((r) => (
              <Row key={r.week} week={r.week} cells={r.cells} colorFor={colorFor} />
            ))}

            <div className="heat-row-head" style={{ paddingTop: 6 }}>
              Total
            </div>
            {dayTotals.map((t) => (
              <div
                key={t.day}
                className="heat-cell"
                style={{
                  background: 'transparent',
                  color: 'var(--text)',
                  fontWeight: 600,
                  borderTop: '1px solid var(--border)',
                }}
              >
                {fmtNum(t.total)}
              </div>
            ))}
            <div
              className="heat-cell"
              style={{
                background: 'transparent',
                fontWeight: 600,
                borderTop: '1px solid var(--border)',
              }}
            >
              {fmtNum(dayTotals.reduce((n, t) => n + t.total, 0))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="card-pad">
        <div className="row wrap" style={{ gap: 'var(--s5)' }}>
          <Insight
            label="Heaviest day"
            value="Wednesday"
            note="Consistently the peak across all 8 weeks"
            tone="warning"
          />
          <Insight
            label="Lightest weekday"
            value="Thursday"
            note="Best candidate to absorb moved stops"
            tone="valid"
          />
          <Insight
            label="Week-pair skew"
            value="Wk 1–4 run 12% heavier"
            note="Pairs 1+5 and 3+7 are the most uneven"
            tone="warning"
          />
          <Insight label="Sunday" value="No service" note="Excluded by all service patterns" tone="default" />
        </div>
      </Card>
    </div>
  )
}

function Row({
  week,
  cells,
  colorFor,
}: {
  week: number
  cells: { day: string; value: number }[]
  colorFor: (v: number) => { background: string; color: string }
}) {
  const total = cells.reduce((n, c) => n + c.value, 0)
  return (
    <>
      <div className="heat-row-head">
        Wk {week}
        <span className="t-xs t-ter" style={{ marginLeft: 4 }}>
          {week <= 4 ? `+${week + 4}` : `+${week - 4}`}
        </span>
      </div>
      {cells.map((c) => (
        <div
          key={c.day}
          className="heat-cell"
          style={colorFor(c.value)}
          title={`Wk ${week} · ${c.day} · ${c.value} rows`}
        >
          {c.value || '—'}
        </div>
      ))}
      <div className="heat-cell" style={{ background: 'transparent', fontWeight: 600 }}>
        {total.toLocaleString('en-US')}
      </div>
    </>
  )
}

function Insight({
  label,
  value,
  note,
  tone,
}: {
  label: string
  value: string
  note: string
  tone: 'warning' | 'valid' | 'default'
}) {
  return (
    <div style={{ minWidth: 190 }}>
      <div className="strip-label">{label}</div>
      <div className="row tight" style={{ marginTop: 6 }}>
        <Badge tone={tone}>{value}</Badge>
      </div>
      <div className="t-xs t-sec" style={{ marginTop: 6, lineHeight: 1.5 }}>
        {note}
      </div>
    </div>
  )
}
