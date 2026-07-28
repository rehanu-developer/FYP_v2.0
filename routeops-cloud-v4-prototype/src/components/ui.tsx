/**
 * RouteOps Cloud V4 — UI primitives.
 * Hand-built, no UI kit. Every primitive maps 1:1 to an entry in the
 * Design Foundation screen so the prototype documents its own system.
 */
import type { CSSProperties, ReactNode } from 'react'
import { useEffect } from 'react'
import {
  CheckIcon,
  ChevronRightIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  LockIcon,
  WarningIcon,
  XIcon,
} from './icons'

/* ==========================================================================
   Button
   ========================================================================== */

export type ButtonVariant =
  | 'primary'
  | 'dark'
  | 'secondary'
  | 'ghost'
  | 'danger'

export function Button({
  variant = 'secondary',
  size,
  icon,
  iconRight,
  children,
  disabled,
  block,
  onClick,
  title,
  style,
  type = 'button',
}: {
  variant?: ButtonVariant
  size?: 'sm' | 'lg'
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  disabled?: boolean
  block?: boolean
  onClick?: () => void
  title?: string
  style?: CSSProperties
  type?: 'button' | 'submit'
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    block ? 'btn-block' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={style}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}

/* ==========================================================================
   Badge — the full V4 status vocabulary
   ========================================================================== */

export type BadgeTone =
  | 'default'
  | 'draft'
  | 'baseline'
  | 'immutable'
  | 'editable'
  | 'progress'
  | 'finalized'
  | 'warning'
  | 'blocked'
  | 'valid'
  | 'notmaster'
  | 'mismatch'
  | 'match'
  | 'info'

export function Badge({
  tone = 'default',
  children,
  dot,
  icon,
  lg,
}: {
  tone?: BadgeTone
  children: ReactNode
  dot?: boolean
  icon?: ReactNode
  lg?: boolean
}) {
  return (
    <span className={`badge badge-${tone}${lg ? ' badge-lg' : ''}`}>
      {dot && <span className="dot" />}
      {icon}
      {children}
    </span>
  )
}

/** Maps a row's validation status string onto the right badge tone. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeTone> = {
    Valid: 'valid',
    Warning: 'warning',
    Blocked: 'blocked',
    Draft: 'draft',
    Baseline: 'baseline',
    'Baseline Created': 'baseline',
    Immutable: 'immutable',
    Editable: 'editable',
    'In Progress': 'progress',
    Finalized: 'finalized',
    Exported: 'finalized',
    'In Master': 'match',
    'Not in Master': 'notmaster',
    Match: 'match',
    Mismatch: 'mismatch',
    Active: 'valid',
    Available: 'match',
    Unavailable: 'warning',
    'Over Target': 'blocked',
    Balanced: 'valid',
    Underused: 'warning',
    Assigned: 'info',
  }
  return <Badge tone={map[status] ?? 'default'}>{status}</Badge>
}

/* ==========================================================================
   Cards
   ========================================================================== */

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: ReactNode
  sub: string
  icon: ReactNode
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  )
}

/* ==========================================================================
   Form controls
   ========================================================================== */

export function Field({
  label,
  required,
  help,
  error,
  tag,
  children,
}: {
  label: string
  required?: boolean
  help?: string
  error?: string
  tag?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-req">*</span>}
        {tag}
      </label>
      {children}
      {help && !error && <span className="field-help">{help}</span>}
      {error && (
        <span className="field-error">
          <ErrorCircleIcon size={13} style={{ marginTop: 1, flex: '0 0 auto' }} />
          {error}
        </span>
      )}
    </div>
  )
}

export function DefaultTag() {
  return <span className="default-tag">Default</span>
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  hasError,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
}) {
  return (
    <select
      className={`select${hasError ? ' has-error' : ''}`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  disabled,
}: {
  value: T
  onChange: (v: T) => void
  options: readonly T[]
  disabled?: boolean
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={value === o}
          className={value === o ? 'on' : ''}
          disabled={disabled}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function ToggleChip({
  on,
  onClick,
  disabled,
  children,
  title,
}: {
  on?: boolean
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  title?: string
}) {
  return (
    <button
      type="button"
      className={`toggle-chip${on ? ' on' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={!!on}
    >
      {children}
    </button>
  )
}

export function Chip({
  on,
  onClick,
  children,
  count,
}: {
  on?: boolean
  onClick?: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button type="button" className={`chip${on ? ' on' : ''}`} onClick={onClick}>
      {children}
      {count !== undefined && <span className="chip-count">{count}</span>}
    </button>
  )
}

/* ==========================================================================
   Banners / callouts
   ========================================================================== */

export type BannerTone =
  | 'warning'
  | 'error'
  | 'success'
  | 'info'
  | 'locked'
  | 'accent'

export function Banner({
  tone,
  title,
  children,
  action,
}: {
  tone: BannerTone
  title?: string
  children?: ReactNode
  action?: ReactNode
}) {
  const icons: Record<BannerTone, ReactNode> = {
    warning: <WarningIcon size={15} />,
    error: <ErrorCircleIcon size={15} />,
    success: <CheckCircleIcon size={15} />,
    info: <InfoCircleIcon size={15} />,
    locked: <LockIcon size={15} />,
    accent: <InfoCircleIcon size={15} />,
  }
  return (
    <div className={`banner banner-${tone}`}>
      <span className="banner-icon">{icons[tone]}</span>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        {title && <div className="banner-title">{title}</div>}
        {children}
      </div>
      {action && <div style={{ flex: '0 0 auto' }}>{action}</div>}
    </div>
  )
}

/* ==========================================================================
   Tooltip
   ========================================================================== */

export function Tooltip({
  text,
  below,
  children,
}: {
  text: string
  below?: boolean
  children: ReactNode
}) {
  return (
    <span className="tip" tabIndex={0}>
      {children}
      <span className={`tip-bubble${below ? ' below' : ''}`} role="tooltip">
        {text}
      </span>
    </span>
  )
}

/* ==========================================================================
   Drawer + Modal
   ========================================================================== */

export function Drawer({
  title,
  sub,
  badge,
  onClose,
  children,
  footer,
  wide,
  flush,
}: {
  title: ReactNode
  sub?: ReactNode
  badge?: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
  flush?: boolean
}) {
  useEscape(onClose)
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className={`drawer${wide ? ' wide' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div className="drawer-title">{title}</div>
            {sub && <div className="drawer-sub">{sub}</div>}
            {badge && <div style={{ marginTop: 8 }}>{badge}</div>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <XIcon size={16} />
          </button>
        </div>
        <div className={`drawer-body${flush ? ' flush' : ''}`}>{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </>
  )
}

export function Modal({
  title,
  sub,
  mark,
  onClose,
  children,
  footer,
  size,
}: {
  title: ReactNode
  sub?: ReactNode
  mark?: ReactNode
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  size?: 'lg' | 'xl'
}) {
  useEscape(onClose)
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal-wrap">
        <div
          className={`modal${size ? ` ${size}` : ''}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-head">
            {mark}
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <div className="modal-title">{title}</div>
              {sub && <div className="modal-sub">{sub}</div>}
            </div>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <XIcon size={16} />
            </button>
          </div>
          {children && <div className="modal-body">{children}</div>}
          {footer && <div className="modal-foot">{footer}</div>}
        </div>
      </div>
    </>
  )
}

function useEscape(fn: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fn()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fn])
}

/* ==========================================================================
   Empty + progress
   ========================================================================== */

export function EmptyState({
  icon,
  title,
  sub,
  actions,
}: {
  icon: ReactNode
  title: string
  sub: string
  actions?: ReactNode
}) {
  return (
    <div className="empty">
      <div className="empty-mark">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
      {actions && <div className="empty-actions">{actions}</div>}
    </div>
  )
}

export function ProgressBar({
  pct,
  indeterminate,
}: {
  pct?: number
  indeterminate?: boolean
}) {
  return (
    <div className="progress-track">
      <div
        className={`progress-fill${indeterminate ? ' indeterminate' : ''}`}
        style={indeterminate ? undefined : { width: `${Math.min(100, pct ?? 0)}%` }}
      />
    </div>
  )
}

export type StepState = 'done' | 'active' | 'todo'

export function StepList({
  steps,
}: {
  steps: { label: string; state: StepState }[]
}) {
  return (
    <div className="step-list">
      {steps.map((s) => (
        <div key={s.label} className={`step ${s.state}`}>
          <span className="step-mark">
            {s.state === 'done' && <CheckIcon size={10} />}
          </span>
          {s.label}
        </div>
      ))}
    </div>
  )
}

/** Master Dataset -> Session -> Baseline -> Option -> Final Plan */
export function ProcessStrip({
  nodes,
}: {
  nodes: { label: string; state?: 'on' | 'accent' }[]
}) {
  return (
    <div className="process-strip">
      {nodes.map((n, i) => (
        <span key={n.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className={`process-node${n.state ? ` ${n.state}` : ''}`}>{n.label}</span>
          {i < nodes.length - 1 && (
            <span className="process-arrow">
              <ChevronRightIcon size={13} />
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/* ==========================================================================
   Tabs
   ========================================================================== */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; count?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          className={`tab${value === t.id ? ' on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.count && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ==========================================================================
   Definition list (drawer detail rows)
   ========================================================================== */

export function DL({ children }: { children: ReactNode }) {
  return <div className="dl">{children}</div>
}

export function DLRow({
  k,
  v,
  muted,
}: {
  k: string
  v: ReactNode
  muted?: boolean
}) {
  return (
    <div className="dl-row">
      <span className="dl-key">{k}</span>
      <span className={`dl-val${muted ? ' muted' : ''}`}>{v}</span>
    </div>
  )
}

/* ==========================================================================
   Small display helpers
   ========================================================================== */

/** Renders the Mon..Sun pip row used throughout the grid and drawers. */
export function DayPips({ days }: { days: string[] }) {
  const all = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <span className="day-list">
      {all.map((d) => (
        <span key={d} className={`day-pip${days.includes(d) ? ' on' : ''}`}>
          {d[0]}
          {d === 'Thu' || d === 'Sun' || d === 'Sat' ? d[1].toLowerCase() : ''}
        </span>
      ))}
    </span>
  )
}

export function Dash() {
  return <span className="cell-empty">—</span>
}

export function SectionHead({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  right?: ReactNode
}) {
  return (
    <div className="row" style={{ alignItems: 'flex-end', marginBottom: 'var(--s4)' }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div className="section-title">{title}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
      {right && <div className="row tight">{right}</div>}
    </div>
  )
}
