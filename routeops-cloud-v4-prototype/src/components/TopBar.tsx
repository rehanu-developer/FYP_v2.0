/** Top bar: breadcrumb, search, session selector, active option pill, help, avatar. */
import { useApp, type ScreenId } from '../state/AppState'
import { SESSION, USER } from '../data/mock'
import { Badge, Tooltip } from './ui'
import { ChevronDownIcon, QuestionIcon, RectangleStackIcon, SearchIcon } from './icons'

const CRUMBS: Record<ScreenId, string[]> = {
  dashboard: ['RouteOps Cloud', 'Dashboard'],
  ingestion: ['RouteOps Cloud', 'Data Ingestion'],
  'master-dataset': ['RouteOps Cloud', 'Master Dataset'],
  sessions: ['RouteOps Cloud', 'Sessions'],
  'create-session': ['RouteOps Cloud', 'Sessions', 'Create Session'],
  workspace: ['RouteOps Cloud', 'Sessions', 'Route Workspace'],
  'customer-master': ['RouteOps Cloud', 'Customer Master'],
  'master-import': ['RouteOps Cloud', 'Customer Master', 'Enhancement Import'],
  'reference-data': ['RouteOps Cloud', 'Reference Data'],
  activity: ['RouteOps Cloud', 'Activity Feed'],
  exports: ['RouteOps Cloud', 'Exports'],
  'stop-list': ['RouteOps Cloud', 'Exports', 'Stop List'],
  admin: ['RouteOps Cloud', 'Admin'],
  foundation: ['Design', 'Design Foundation'],
  'row-model': ['Design', 'Row Model Decision'],
  'open-decisions': ['Design', 'Open Decisions'],
  checklist: ['Design', 'Alignment Checklist'],
}

export function TopBar() {
  const { screen, nav, activeVersion, isBaseline } = useApp()
  const crumbs = CRUMBS[screen] ?? ['RouteOps Cloud']

  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'current' : undefined}>{c}</span>
          </span>
        ))}
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-search">
        <span className="search-icon">
          <SearchIcon size={14} />
        </span>
        <input placeholder="Search customers, routes, sessions" aria-label="Search" />
      </div>

      <button
        className="session-select"
        onClick={() => nav('sessions')}
        title="Change current session"
      >
        <RectangleStackIcon size={14} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto' }} />
        <span style={{ minWidth: 0 }}>
          <span className="label">Session</span>{' '}
          <span className="value">{SESSION.market} · 8 Week</span>
        </span>
        <ChevronDownIcon size={13} style={{ color: 'var(--text-tertiary)', flex: '0 0 auto' }} />
      </button>

      <Badge tone={isBaseline ? 'immutable' : 'editable'} lg dot>
        {activeVersion.name}
      </Badge>

      <Tooltip text="Shortcuts, glossary and workflow help" below>
        <button className="icon-btn" aria-label="Help">
          <QuestionIcon size={16} />
        </button>
      </Tooltip>

      <span className="avatar light" title={`${USER.name} — ${USER.role}`}>
        {USER.initials}
      </span>
    </header>
  )
}
