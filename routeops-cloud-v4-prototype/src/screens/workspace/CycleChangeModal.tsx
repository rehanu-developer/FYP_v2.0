/**
 * Part K — Cycle length change edge case.
 *
 * Changing an 8-week session to 4 weeks strands every Week 5–8 assignment.
 * The product behaviour for those assignments is NOT yet defined, so this modal
 * deliberately offers no destructive action: cancel, or escalate for a decision.
 */
import { useState } from 'react'
import { CYCLE_IMPACT } from '../../data/prompt2'
import { SESSION, fmtNum } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { Badge, Banner, Button, Modal, Segmented } from '../../components/ui'
import { CalendarIcon, WarningIcon } from '../../components/icons'

export function CycleChangeModal({ onClose }: { onClose: () => void }) {
  const { pushToast, isBaseline } = useApp()
  const [cycle, setCycle] = useState<'4 Week' | '8 Week'>(SESSION.cycle)

  const shrinking = cycle === '4 Week'
  const max = Math.max(...CYCLE_IMPACT.weeks.map((w) => w.assignments))

  return (
    <Modal
      size="lg"
      title={
        shrinking ? 'Changing to 4 weeks affects existing assignments' : 'Session cycle length'
      }
      sub={
        shrinking
          ? `${fmtNum(CYCLE_IMPACT.total)} customer assignments currently use Weeks 5–8. These weeks are not available in a 4-week session.`
          : 'The cycle length controls which delivery weeks exist in this session.'
      }
      mark={
        <span className={shrinking ? 'modal-warn-mark' : ''}>
          {shrinking ? <WarningIcon size={17} /> : <CalendarIcon size={17} />}
        </span>
      }
      onClose={onClose}
      footer={
        shrinking ? (
          <>
            {/* No destructive action until behaviour is confirmed. */}
            <Button variant="secondary" onClick={() => setCycle('8 Week')}>
              Cancel Change
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                pushToast({
                  tone: 'info',
                  title: 'Product decision requested',
                  sub: 'Decision 4 — Week 5–8 handling — flagged to Product on the Open Decisions page.',
                })
                onClose()
              }}
            >
              Request Product Decision
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )
      }
    >
      <div className="field" style={{ marginBottom: 'var(--s5)' }}>
        <label className="field-label">Cycle length</label>
        <Segmented
          value={cycle}
          onChange={setCycle}
          options={['4 Week', '8 Week'] as const}
          disabled={isBaseline}
        />
        <span className="field-help">
          Current session cycle is {SESSION.cycle}. An 8-week cycle pairs weeks as 1+5, 2+6, 3+7
          and 4+8.
        </span>
      </div>

      {shrinking && (
        <>
          <div className="table-wrap" style={{ marginBottom: 'var(--s4)' }}>
            <div className="table-toolbar">
              <span className="t-sm t-med">Affected assignments</span>
              <span className="spacer" />
              <Badge tone="warning">{fmtNum(CYCLE_IMPACT.total)} total</Badge>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Delivery Week</th>
                  <th className="th-num">Assignments</th>
                  <th style={{ width: '46%' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {CYCLE_IMPACT.weeks.map((w) => (
                  <tr key={w.week}>
                    <td className="t-med">Week {w.week}</td>
                    <td className="td-num">{fmtNum(w.assignments)}</td>
                    <td>
                      <span className="bar-track" style={{ height: 14 }}>
                        <span
                          className="bar-fill over"
                          style={{ width: `${(w.assignments / max) * 100}%` }}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-foot">
              <span>Weeks 5–8 do not exist in a 4-week cycle</span>
              <span className="t-xs t-ter">
                {fmtNum(CYCLE_IMPACT.total)} of {fmtNum(SESSION.customers * 5)} planning rows
              </span>
            </div>
          </div>

          <Banner tone="error" title="Open decision — behaviour is not yet defined">
            The product behavior for these assignments is not yet defined. They could be remapped
            onto their week-pair partner, cleared, or block the change entirely. No destructive
            action is offered here until that is confirmed.
          </Banner>
        </>
      )}
    </Modal>
  )
}
