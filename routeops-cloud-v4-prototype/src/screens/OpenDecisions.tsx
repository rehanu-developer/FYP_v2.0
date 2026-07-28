/**
 * Part N — Open Decisions.
 *
 * Internal design page capturing the decisions that block final implementation.
 * Not a production screen; badged accordingly.
 */
import { OPEN_DECISION_ROWS } from '../data/prompt2'
import { Badge, Card, CountCard } from '../components/ui'
import { BookIcon } from '../components/icons'

export function OpenDecisions() {
  const open = OPEN_DECISION_ROWS.filter((d) => d.status === 'Open').length
  const rec = OPEN_DECISION_ROWS.filter((d) => d.status === 'Recommended').length

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
          Capture design and product decisions that block final implementation. Each row names an
          owner and what it blocks, so nothing stalls silently.
        </p>
      </div>

      <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s5)' }}>
        <CountCard label="Decisions" value={OPEN_DECISION_ROWS.length} />
        <CountCard label="Recommendation ready" value={rec} tone="valid" />
        <CountCard label="Awaiting input" value={open} tone="warning" />
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 34 }}>#</th>
                <th style={{ minWidth: 260 }}>Decision</th>
                <th>Owner</th>
                <th>Blocks</th>
                <th style={{ minWidth: 280 }}>Recommended Direction</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {OPEN_DECISION_ROWS.map((d) => (
                <tr key={d.n}>
                  <td className="td-muted tnum">{d.n}</td>
                  <td className="t-med" style={{ whiteSpace: 'normal' }}>
                    {d.decision}
                  </td>
                  <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                    {d.owner}
                  </td>
                  <td className="td-muted t-xs" style={{ whiteSpace: 'normal' }}>
                    {d.blocks}
                  </td>
                  <td style={{ whiteSpace: 'normal' }}>
                    {d.recommendation ? (
                      <span className="t-sm">{d.recommendation}</span>
                    ) : (
                      <span className="t-xs t-ter">
                        No recommendation yet — needs client or product input.
                      </span>
                    )}
                  </td>
                  <td>
                    <Badge
                      tone={
                        d.status === 'Confirmed'
                          ? 'valid'
                          : d.status === 'Recommended'
                            ? 'progress'
                            : 'warning'
                      }
                    >
                      {d.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>{OPEN_DECISION_ROWS.length} decisions tracked</span>
          <span className="t-xs t-ter">
            Rows marked Recommended have a proposed direction implemented in the prototype.
          </span>
        </div>
      </div>

      <Card className="card-pad" style={{ marginTop: 'var(--s5)' }}>
        <div className="section-title" style={{ marginBottom: 'var(--s2)' }}>
          How the prototype handles unresolved decisions
        </div>
        <p className="t-sm t-sec" style={{ lineHeight: 1.65, maxWidth: 820 }}>
          Where a decision is still open, the prototype implements the recommended direction and
          says so, rather than inventing a behaviour and hiding the assumption. The clearest
          example is decision 4: the cycle-length change modal shows the full impact of dropping
          Weeks 5–8 but deliberately offers <strong>no destructive action</strong> — only Cancel
          Change or Request Product Decision.
        </p>
      </Card>
    </div>
  )
}
