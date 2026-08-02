/** Activity tab — session-scoped audit trail with undo on recent writes. */
import { ACTIVITY } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { Badge, Button, Card } from '../../components/ui'
import { BoltIcon, LockIcon, PencilIcon, WarningIcon } from '../../components/icons'

export function ActivityTab() {
  const { pushToast, isBaseline } = useApp()

  return (
    <Card>
      <div className="card-head">
        <div>
          <div className="section-title">Session Activity</div>
          <div className="section-sub">
            Every write in this session, newest first. Recent changes can be undone.
          </div>
        </div>
        <Badge tone="default">{ACTIVITY.length} events</Badge>
      </div>
      <div className="card-body">
        <div className="feed">
          {ACTIVITY.map((a) => (
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
                  {a.actor} · {a.scope}
                </span>
              </span>
              <span className="row tight" style={{ flex: '0 0 auto' }}>
                {a.undoable && !isBaseline && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      pushToast({
                        tone: 'info',
                        title: 'Change reverted.',
                        sub: a.text,
                      })
                    }
                  >
                    Undo
                  </Button>
                )}
                <span className="feed-time">{a.time}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
