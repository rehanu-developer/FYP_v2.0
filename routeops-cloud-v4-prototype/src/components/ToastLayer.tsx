/** Toast stack with undo affordance (Part M / undo states). */
import { useApp } from '../state/AppState'
import { CheckCircleIcon, ErrorCircleIcon, InfoCircleIcon, UndoIcon, XIcon } from './icons'

export function ToastLayer() {
  const { toasts, dismissToast } = useApp()
  if (!toasts.length) return null

  return (
    <div className="toast-layer" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`} role="status">
          <span className="toast-icon">
            {t.tone === 'success' && <CheckCircleIcon size={16} />}
            {t.tone === 'error' && <ErrorCircleIcon size={16} />}
            {t.tone === 'info' && <InfoCircleIcon size={16} />}
          </span>
          <span className="toast-body">
            <span className="toast-title">{t.title}</span>
            {t.sub && <span className="toast-sub" style={{ display: 'block' }}>{t.sub}</span>}
          </span>
          {t.onUndo && (
            <button
              className="toast-undo"
              onClick={() => {
                t.onUndo?.()
                dismissToast(t.id)
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <UndoIcon size={13} />
                {t.undoLabel ?? 'Undo'}
              </span>
            </button>
          )}
          <button
            className="toast-close"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
          >
            <XIcon size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
