/**
 * Part O — Implementation Alignment Checklist.
 * Part P — RN-145 design note.
 *
 * Internal review page: does the build match the approved design and business
 * flow? Grouped by product area, with Expected behavior / Implemented? / Notes
 * and an explicit Open question column.
 */
import { useState } from 'react'
import { ALIGNMENT_SECTIONS, RN_NOTES, type AlignmentRow } from '../data/prompt2'
import { Badge, Card, CountCard, Chip } from '../components/ui'
import { ClipboardCheckIcon, InfoCircleIcon, WarningIcon } from '../components/icons'

const FILTERS = ['All', 'Needs verification', 'Has open question'] as const

export function Checklist() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const allRows = ALIGNMENT_SECTIONS.flatMap((s) => s.rows)
  const yes = allRows.filter((r) => r.implemented === 'Yes').length
  const partial = allRows.filter((r) => r.implemented === 'Partial').length
  const verify = allRows.filter((r) => r.implemented === 'To verify').length
  const questions = allRows.filter((r) => r.openQuestion).length

  const keep = (r: AlignmentRow) => {
    if (filter === 'Needs verification')
      return r.implemented === 'To verify' || r.implemented === 'Partial'
    if (filter === 'Has open question') return Boolean(r.openQuestion)
    return true
  }

  const sections = ALIGNMENT_SECTIONS.map((s) => ({
    ...s,
    rows: s.rows.filter(keep),
  })).filter((s) => s.rows.length > 0)

  return (
    <div className="page">
      <div className="page-head">
        <div className="row tight" style={{ marginBottom: 8 }}>
          <Badge tone="info" icon={<ClipboardCheckIcon size={12} />}>
            Design decision · not a production screen
          </Badge>
        </div>
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Implementation Alignment Checklist</h1>
            <p className="page-sub">
              Help Hadi and Hashim check whether the build matches the approved design and
              business flow. Every row states the expected behavior, whether it is implemented,
              and any open question attached to it.
            </p>
          </div>
          <div className="chips">
            {FILTERS.map((f) => (
              <Chip key={f} on={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s5)' }}>
        <CountCard label="Behaviors tracked" value={allRows.length} />
        <CountCard label="Implemented" value={yes} tone="valid" />
        <CountCard label="Partial" value={partial} tone="warning" />
        <CountCard label="To verify in build" value={verify} tone="warning" />
        <CountCard label="Open questions" value={questions} tone="blocked" />
      </div>

      {/* RN-111 scope note ------------------------------------------------- */}
      <div className="spec-note" style={{ marginBottom: 'var(--s5)' }}>
        <span style={{ flex: '0 0 auto', marginTop: 2 }}>
          <InfoCircleIcon size={15} />
        </span>
        <span>{RN_NOTES.rn111}</span>
      </div>

      <div className="stack-4">
        {sections.map((s) => (
          <Card key={s.title}>
            <div className="card-head">
              <div className="section-title">{s.title}</div>
              <Badge tone="default">{s.rows.length}</Badge>
            </div>
            <div className="card-body">
              <div className="matrix-head">
                <span>Expected behavior</span>
                <span>Implemented?</span>
                <span>Notes</span>
              </div>
              {s.rows.map((r) => (
                <div className="matrix-row" key={r.expected}>
                  <span className="t-sm" style={{ lineHeight: 1.5 }}>
                    {r.expected}
                  </span>
                  <span>
                    <Badge
                      tone={
                        r.implemented === 'Yes'
                          ? 'valid'
                          : r.implemented === 'No'
                            ? 'blocked'
                            : 'warning'
                      }
                    >
                      {r.implemented}
                    </Badge>
                  </span>
                  <span>
                    <span
                      className="t-xs t-sec"
                      style={{ display: 'block', lineHeight: 1.55 }}
                    >
                      {r.notes}
                    </span>
                    {r.openQuestion && (
                      <span
                        className="row tight t-xs"
                        style={{
                          marginTop: 6,
                          color: 'var(--warning)',
                          alignItems: 'flex-start',
                        }}
                      >
                        <WarningIcon size={11} style={{ marginTop: 2, flex: '0 0 auto' }} />
                        <span style={{ lineHeight: 1.5 }}>{r.openQuestion}</span>
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Part P — RN-145 -------------------------------------------------- */}
      <Card style={{ marginTop: 'var(--s5)' }}>
        <div className="card-head">
          <div>
            <div className="section-title">{RN_NOTES.rn145Title}</div>
            <div className="section-sub">Business Rules Test Suite — design note</div>
          </div>
          <Badge tone="default">No UI required</Badge>
        </div>
        <div className="card-body">
          <p className="t-sm t-sec" style={{ lineHeight: 1.65, maxWidth: 820 }}>
            {RN_NOTES.rn145}
          </p>
          <div className="callout" style={{ marginTop: 'var(--s4)' }}>
            Recorded here so the ticket is visibly accounted for in design review rather than
            looking like a missed screen. The rules it should cover are the ones documented on
            Reference Data and enforced in the validation states: service pattern day and week
            permissions, helper scenario eligibility, depot eligibility, cycle week validity, and
            required fields for export.
          </div>
        </div>
      </Card>
    </div>
  )
}
