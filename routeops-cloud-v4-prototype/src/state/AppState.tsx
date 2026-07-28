/**
 * RouteOps Cloud V4 — client-side app state.
 *
 * Holds everything the prototype needs to fake a real workflow:
 * hash routing, the active option (Baseline vs Option N), grid selection
 * scope, density, row model, and the toast/undo stack.
 * No network calls anywhere.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SESSION } from '../data/mock'

/* ==========================================================================
   Routing — hash based so the built bundle works from any static host
   ========================================================================== */

export type ScreenId =
  | 'dashboard'
  | 'ingestion'
  | 'master-dataset'
  | 'sessions'
  | 'create-session'
  | 'workspace'
  | 'customer-master'
  | 'master-import'
  | 'reference-data'
  | 'activity'
  | 'exports'
  | 'stop-list'
  | 'admin'
  | 'foundation'
  | 'row-model'
  | 'open-decisions'
  | 'checklist'

export function useHashRoute(): [ScreenId, (s: ScreenId) => void] {
  const read = (): ScreenId => {
    const raw = window.location.hash.replace(/^#\/?/, '')
    return (raw || 'dashboard') as ScreenId
  }
  const [screen, setScreen] = useState<ScreenId>(read)

  useEffect(() => {
    const onHash = () => setScreen(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const nav = useCallback((s: ScreenId) => {
    window.location.hash = `/${s}`
    window.scrollTo({ top: 0 })
  }, [])

  return [screen, nav]
}

/* ==========================================================================
   Options / versions
   ========================================================================== */

export interface OptionVersion {
  id: string
  name: string
  locked: boolean
  sub: string
  createdAt: string
}

export const BASELINE_ID = 'baseline'

/* ==========================================================================
   Selection scope — drives Part H selection states
   ========================================================================== */

export type SelectionMode = 'none' | 'manual' | 'matching'

export interface SelectionState {
  mode: SelectionMode
  /** Individually ticked customer IDs (manual mode). */
  ids: string[]
  /** Human-readable description of the filter set in matching mode. */
  matchingLabel: string
  matchingCount: number
}

export const MANUAL_SELECT_LIMIT = 500

/* ==========================================================================
   Toasts
   ========================================================================== */

export interface ToastItem {
  id: number
  tone: 'success' | 'error' | 'info'
  title: string
  sub?: string
  undoLabel?: string
  onUndo?: () => void
}

/* ==========================================================================
   Context
   ========================================================================== */

interface Ctx {
  screen: ScreenId
  nav: (s: ScreenId) => void

  options: OptionVersion[]
  activeVersionId: string
  setActiveVersionId: (id: string) => void
  activeVersion: OptionVersion
  isBaseline: boolean
  addOption: () => OptionVersion

  selection: SelectionState
  setSelection: (s: SelectionState) => void
  clearSelection: () => void
  toggleId: (id: string) => void
  selectAllMatching: (label: string, count: number) => void
  selectedScopeLabel: string

  density: 'compact' | 'standard' | 'comfortable'
  setDensity: (d: 'compact' | 'standard' | 'comfortable') => void

  rowModel: 'A' | 'B'
  setRowModel: (m: 'A' | 'B') => void

  toasts: ToastItem[]
  pushToast: (t: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: number) => void

  /** Set true once a write action has happened in the active option. */
  dirty: boolean
  setDirty: (v: boolean) => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, nav] = useHashRoute()

  const [options, setOptions] = useState<OptionVersion[]>([
    {
      id: BASELINE_ID,
      name: 'Baseline',
      locked: true,
      sub: 'Imported original',
      createdAt: SESSION.createdAt,
    },
    {
      id: 'option-1',
      name: 'Option 1',
      locked: false,
      sub: 'Working option',
      createdAt: '07/23/2026, 4:44 PM',
    },
  ])
  const [activeVersionId, setActiveVersionId] = useState('option-1')

  const activeVersion = useMemo(
    () => options.find((o) => o.id === activeVersionId) ?? options[0],
    [options, activeVersionId],
  )
  const isBaseline = activeVersion.locked

  const [selection, setSelection] = useState<SelectionState>({
    mode: 'none',
    ids: [],
    matchingLabel: '',
    matchingCount: 0,
  })

  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>(
    'standard',
  )
  const [rowModel, setRowModel] = useState<'A' | 'B'>('B')
  const [dirty, setDirty] = useState(false)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastSeq = useRef(1)

  const pushToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = toastSeq.current++
    setToasts((prev) => [...prev, { ...t, id }])
    // Auto-dismiss. Undoable toasts linger a little longer.
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, t.onUndo ? 9000 : 5200)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clearSelection = useCallback(() => {
    setSelection({ mode: 'none', ids: [], matchingLabel: '', matchingCount: 0 })
  }, [])

  const toggleId = useCallback((id: string) => {
    setSelection((prev) => {
      const has = prev.ids.includes(id)
      const ids = has ? prev.ids.filter((x) => x !== id) : [...prev.ids, id]
      return {
        mode: ids.length ? 'manual' : 'none',
        ids,
        matchingLabel: '',
        matchingCount: 0,
      }
    })
  }, [])

  const selectAllMatching = useCallback((label: string, count: number) => {
    setSelection({ mode: 'matching', ids: [], matchingLabel: label, matchingCount: count })
  }, [])

  const addOption = useCallback((): OptionVersion => {
    const n = options.filter((o) => !o.locked).length + 1
    const created: OptionVersion = {
      id: `option-${n}`,
      name: `Option ${n}`,
      locked: false,
      sub: 'Copied from ' + (options.find((o) => o.id === activeVersionId)?.name ?? 'Baseline'),
      createdAt: 'Just now',
    }
    setOptions((prev) => [...prev, created])
    setActiveVersionId(created.id)
    return created
  }, [options, activeVersionId])

  const selectedScopeLabel = useMemo(() => {
    if (selection.mode === 'matching') {
      return `All ${selection.matchingCount.toLocaleString('en-US')} customers matching current filters selected`
    }
    if (selection.mode === 'manual') {
      return `${selection.ids.length} selected`
    }
    return ''
  }, [selection])

  // Selecting the immutable baseline must drop any pending selection, because
  // every write control is disabled in that state.
  useEffect(() => {
    if (isBaseline) clearSelection()
  }, [isBaseline, clearSelection])

  const value: Ctx = {
    screen,
    nav,
    options,
    activeVersionId,
    setActiveVersionId,
    activeVersion,
    isBaseline,
    addOption,
    selection,
    setSelection,
    clearSelection,
    toggleId,
    selectAllMatching,
    selectedScopeLabel,
    density,
    setDensity,
    rowModel,
    setRowModel,
    toasts,
    pushToast,
    dismissToast,
    dirty,
    setDirty,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp(): Ctx {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp must be used inside <AppProvider>')
  return c
}
