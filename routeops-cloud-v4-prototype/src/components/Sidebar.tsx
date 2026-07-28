/** Persistent dark sidebar: product nav + design-doc nav + analyst profile. */
import { useApp, type ScreenId } from '../state/AppState'
import { USER } from '../data/mock'
import {
  BookIcon,
  CircleStackIcon,
  ClipboardCheckIcon,
  CogIcon,
  DownloadIcon,
  InboxArrowIcon,
  MapIcon,
  PulseIcon,
  RectangleStackIcon,
  ScaleIcon,
  SquaresIcon,
  TableIcon,
  UserGroupIcon,
} from './icons'

interface NavEntry {
  id: ScreenId
  label: string
  icon: JSX.Element
  count?: string
}

const PRODUCT_NAV: NavEntry[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <SquaresIcon size={16} /> },
  { id: 'ingestion', label: 'Data Ingestion', icon: <InboxArrowIcon size={16} /> },
  { id: 'master-dataset', label: 'Master Dataset', icon: <CircleStackIcon size={16} /> },
  { id: 'sessions', label: 'Sessions', icon: <RectangleStackIcon size={16} />, count: '1' },
  { id: 'workspace', label: 'Route Workspace', icon: <MapIcon size={16} /> },
  { id: 'customer-master', label: 'Customer Master', icon: <UserGroupIcon size={16} /> },
  { id: 'reference-data', label: 'Reference Data', icon: <BookIcon size={16} /> },
  { id: 'activity', label: 'Activity Feed', icon: <PulseIcon size={16} /> },
  { id: 'exports', label: 'Exports', icon: <DownloadIcon size={16} /> },
  { id: 'admin', label: 'Admin', icon: <CogIcon size={16} /> },
]

/**
 * The V4 deliverable also carries design-decision frames. They are kept in a
 * separate nav group so they never read as production product screens.
 */
const DESIGN_NAV: NavEntry[] = [
  { id: 'foundation', label: 'Design Foundation', icon: <TableIcon size={16} /> },
  { id: 'row-model', label: 'Row Model Decision', icon: <ScaleIcon size={16} /> },
  { id: 'open-decisions', label: 'Open Decisions', icon: <BookIcon size={16} />, count: '9' },
  { id: 'checklist', label: 'Alignment Checklist', icon: <ClipboardCheckIcon size={16} /> },
]

export function Sidebar() {
  const { screen, nav } = useApp()

  // Sub-screens keep their parent nav item lit.
  const activeFor = (id: ScreenId) => {
    if (screen === id) return true
    if (id === 'sessions' && screen === 'create-session') return true
    if (id === 'customer-master' && screen === 'master-import') return true
    if (id === 'exports' && screen === 'stop-list') return true
    return false
  }

  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar-brand">
        <span className="sidebar-mark">
          <MapIcon size={15} style={{ color: '#fff' }} />
        </span>
        <span>
          <span className="sidebar-brand-name">RouteOps Cloud</span>
          <span className="sidebar-brand-sub">V4 · Community Coffee</span>
        </span>
      </div>

      <div className="sidebar-scroll">
        <div className="nav-group-label">Workspace</div>
        {PRODUCT_NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item${activeFor(n.id) ? ' active' : ''}`}
            onClick={() => nav(n.id)}
            aria-current={activeFor(n.id) ? 'page' : undefined}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
            {n.count && <span className="nav-count">{n.count}</span>}
          </button>
        ))}

        <div className="nav-group-label">Design &amp; Decisions</div>
        {DESIGN_NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item${activeFor(n.id) ? ' active' : ''}`}
            onClick={() => nav(n.id)}
            aria-current={activeFor(n.id) ? 'page' : undefined}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
            {n.count && <span className="nav-count">{n.count}</span>}
          </button>
        ))}
      </div>

      <div className="sidebar-profile">
        <span className="avatar">{USER.initials}</span>
        <span style={{ minWidth: 0 }}>
          <span className="profile-name">{USER.name}</span>
          <span className="profile-role">{USER.role}</span>
          <span className="profile-role">{USER.org}</span>
        </span>
      </div>
    </nav>
  )
}
