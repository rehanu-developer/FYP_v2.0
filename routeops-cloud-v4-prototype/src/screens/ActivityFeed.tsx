/** Activity Feed — cross-session audit trail. */
import { useState } from 'react'
import { ACTIVITY } from '../data/mock'
import { useApp } from '../state/AppState'
import { Badge, Button, Card, Chip, SectionHead } from '../components/ui'
import { BoltIcon, LockIcon, PencilIcon, WarningIcon } from '../components/icons'

const SCOPES = ['All', 'Option 1', 'Session', 'Master Dataset'] as const

export function ActivityFeed() {
  const { pushToast } = useApp()
  const [scope, setScope] = useState<(typeof SCOPES)[number]>('All')

  const rows = ACTIVITY.filter((a) => scope === 'All' || a.scope === scope)

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Activity Feed</h1>
        <p className="page-sub">
          A complete audit trail of every change across sessions, options, and the master dataset.
        </p>
      </div>

      <SectionHead
        title="Recent activity"
        right={
          <div className="chips">
            {SCOPES.map((s) => (
              <Chip key={s} on={scope === s} onClick={() => setScope(s)}>
                {s}
              </Chip>
            ))}
          </div>
        }
      />

      <Card className="card-pad">
        <div className="feed">
          {rows.map((a) => (
            <div className="feed-item" key={a.id}>
              <span
                className={`feed-mark ${
                  a.kind === 'success'
                    ? 'success'
                    : a.kind === 'warning'
                      ? 'warning'
                      : a.kind === 'edit'
                        ? 'accent'
                        : ''
                }`}
              >
                {a.kind === 'edit' && <PencilIcon size={13} />}
                {a.kind === 'success' && <BoltIcon size={13} />}
                {a.kind === 'warning' && <WarningIcon size={13} />}
                {a.kind === 'system' && <LockIcon size={13} />}
              </span>
              <span className="feed-text">
                <span className="t-med">{a.text}</span>
                {a.detail && (
                  <span className="t-sm t-sec" style={{ display: 'block', marginTop: 2 }}>
                    {a.detail}
                  </span>
                )}
                <span className="feed-meta">
                  {a.actor} · <Badge tone="default">{a.scope}</Badge>
                </span>
              </span>
              <span className="row tight" style={{ flex: '0 0 auto' }}>
                {a.undoable && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      pushToast({ tone: 'info', title: 'Change reverted.', sub: a.text })
                    }
                  >
                    Undo
                  </Button>
                )}
                <span className="feed-time">{a.time}</span>
              </span>
            </div>
          ))}
          {!rows.length && (
            <div className="center t-sec" style={{ padding: 'var(--s7) 0' }}>
              No activity for this scope.
            </div>
          )}
        </div>
      </Card>

      <div className="t-xs t-ter" style={{ marginTop: 'var(--s4)' }}>
        Undo is available for the most recent writes in an editable option. Baseline events can
        never be undone because the baseline is immutable.
      </div>
    </div>
  )
}
