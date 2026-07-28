/**
 * Part A — Design system foundation.
 * Deliberately compact: one screen that shows every primitive the product
 * actually uses, with live drawer / modal / toast triggers. Not an exhaustive
 * design-system site.
 */
import { useState } from 'react'
import {
  Badge,
  Banner,
  Button,
  DL,
  DLRow,
  Drawer,
  EmptyState,
  Field,
  Modal,
  ProgressBar,
  Segmented,
  Select,
  StepList,
  ToggleChip,
  Tooltip,
} from '../components/ui'
import { useApp } from '../state/AppState'
import {
  CircleStackIcon,
  LockIcon,
  PlusIcon,
  QuestionIcon,
  SaveIcon,
  TrashIcon,
  WarningIcon,
} from '../components/icons'

const BADGES: { label: string; tone: Parameters<typeof Badge>[0]['tone'] }[] = [
  { label: 'Draft', tone: 'draft' },
  { label: 'Baseline', tone: 'baseline' },
  { label: 'Immutable', tone: 'immutable' },
  { label: 'Editable', tone: 'editable' },
  { label: 'In Progress', tone: 'progress' },
  { label: 'Finalized', tone: 'finalized' },
  { label: 'Warning', tone: 'warning' },
  { label: 'Blocked', tone: 'blocked' },
  { label: 'Valid', tone: 'valid' },
  { label: 'Not in Master', tone: 'notmaster' },
  { label: 'Route Mismatch', tone: 'mismatch' },
  { label: 'Default', tone: 'default' },
]

const SWATCHES = [
  { name: 'Sidebar', hex: '#111111' },
  { name: 'Canvas', hex: '#F6F5F2' },
  { name: 'Surface', hex: '#FFFFFF' },
  { name: 'Text primary', hex: '#151515' },
  { name: 'Text secondary', hex: '#6B6B6B' },
  { name: 'Border', hex: '#E8E4DC' },
  { name: 'Accent', hex: '#C9812B' },
  { name: 'Accent bright', hex: '#D4933A' },
  { name: 'Accent light', hex: '#F5E4C8' },
  { name: 'Warning', hex: '#B57614' },
  { name: 'Error', hex: '#A63D3D' },
  { name: 'Success', hex: '#3F7D58' },
  { name: 'Info', hex: '#4F6B82' },
]

const TYPE_SCALE = [
  { name: 'Page title', spec: '26px / 600', style: { fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' } },
  { name: 'Section heading', spec: '17px / 600', style: { fontSize: 17, fontWeight: 600 } },
  { name: 'Body', spec: '13.5px / 400', style: { fontSize: 13.5 } },
  { name: 'Table text', spec: '12.5px / 400', style: { fontSize: 12.5 } },
  { name: 'Badge', spec: '11px / 500', style: { fontSize: 11, fontWeight: 500 } },
  { name: 'Button', spec: '13px / 500', style: { fontSize: 13, fontWeight: 500 } },
]

export function DesignFoundation() {
  const { pushToast } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [seg, setSeg] = useState<'4 Week' | '8 Week'>('8 Week')
  const [sel, setSel] = useState('Delivery')
  const [days, setDays] = useState<string[]>(['Mon', 'Wed'])
  const [pct, setPct] = useState(48)

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Design Foundation</h1>
        <p className="page-sub">
          The compact style foundation for RouteOps Cloud V4. Every primitive here is the same
          component used on the product screens.
        </p>
      </div>

      <div className="stack-6">
        {/* Colour + type ---------------------------------------------------- */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Block title="Colour">
            <div className="swatch-grid">
              {SWATCHES.map((s) => (
                <div className="swatch" key={s.name}>
                  <div
                    className="swatch-chip"
                    style={{
                      background: s.hex,
                      borderBottom: s.hex === '#FFFFFF' ? '1px solid var(--border)' : undefined,
                    }}
                  />
                  <div className="swatch-meta">
                    <div className="swatch-name">{s.name}</div>
                    <div className="swatch-hex">{s.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Typography">
            <div className="stack-3">
              {TYPE_SCALE.map((t) => (
                <div
                  key={t.name}
                  className="row"
                  style={{
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: 'var(--s3)',
                  }}
                >
                  <span style={t.style}>{t.name}</span>
                  <span className="t-xs t-ter mono nowrap">{t.spec}</span>
                </div>
              ))}
              <div className="t-xs t-ter">
                Inter for all UI text. JetBrains Mono for customer IDs and numeric keys.
              </div>
            </div>
          </Block>
        </div>

        {/* Buttons ---------------------------------------------------------- */}
        <Block title="Buttons">
          <div className="row wrap" style={{ gap: 'var(--s3)' }}>
            <Button variant="primary" icon={<PlusIcon size={14} />}>
              Primary amber
            </Button>
            <Button variant="dark" icon={<SaveIcon size={14} />}>
              Primary dark
            </Button>
            <Button variant="secondary">Secondary outlined</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="danger" icon={<TrashIcon size={14} />}>
              Danger subtle
            </Button>
            <Button variant="ghost">Ghost / toolbar</Button>
          </div>
          <div className="row wrap" style={{ gap: 'var(--s3)', marginTop: 'var(--s4)' }}>
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button variant="secondary">Default</Button>
            <Button size="lg" variant="secondary">
              Large
            </Button>
            <Button variant="dark">
              Sequence by Quickest Time <span className="kbd">Ctrl+Q</span>
            </Button>
          </div>
        </Block>

        {/* Inputs ----------------------------------------------------------- */}
        <Block title="Inputs, dropdowns and segmented controls">
          <div className="grid-3" style={{ alignItems: 'start' }}>
            <Field label="Text input" help="Standard single-line field.">
              <input className="input" placeholder="e.g. Baton Rouge July 2026" />
            </Field>
            <Field label="Dropdown">
              <Select value={sel} onChange={setSel} options={['Delivery', 'Presale', 'Conventional']} />
            </Field>
            <Field label="Input with error" error="Tuesday is not allowed by service pattern E4W.">
              <input className="input has-error" defaultValue="Tue" />
            </Field>
          </div>
          <div className="row wrap" style={{ gap: 'var(--s6)', marginTop: 'var(--s5)' }}>
            <Field label="Segmented control">
              <Segmented value={seg} onChange={setSeg} options={['4 Week', '8 Week'] as const} />
            </Field>
            <Field label="Toggle chips (day picker)">
              <div className="day-group">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <ToggleChip
                    key={d}
                    on={days.includes(d)}
                    disabled={d === 'Sun'}
                    title={d === 'Sun' ? 'Not allowed by service pattern' : undefined}
                    onClick={() =>
                      setDays((prev) =>
                        prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
                      )
                    }
                  >
                    {d}
                  </ToggleChip>
                ))}
              </div>
            </Field>
            <Field label="Checkbox">
              <div className="row tight" style={{ height: 32 }}>
                <input className="checkbox" type="checkbox" defaultChecked />
                <input className="checkbox" type="checkbox" />
                <input className="checkbox" type="checkbox" disabled />
                <span className="t-xs t-ter">on / off / disabled</span>
              </div>
            </Field>
          </div>
        </Block>

        {/* Table header + badges -------------------------------------------- */}
        <Block title="Table header and status badges">
          <div className="table-wrap" style={{ marginBottom: 'var(--s5)' }}>
            <table className="tbl">
              <thead>
                <tr className="group-band">
                  <th colSpan={2} />
                  <th className="band" colSpan={3}>
                    Planning Fields
                  </th>
                  <th className="band" colSpan={2}>
                    Imported Fields
                  </th>
                </tr>
                <tr className="col-head">
                  <th style={{ width: 34 }}>
                    <input className="checkbox" type="checkbox" />
                  </th>
                  <th>Customer ID</th>
                  <th className="band-start">Route</th>
                  <th>Delivery Day</th>
                  <th>Delivery Week</th>
                  <th className="band-start th-num">Total Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input className="checkbox" type="checkbox" />
                  </td>
                  <td className="cell-id">1000004</td>
                  <td className="band-start">970</td>
                  <td>Mon</td>
                  <td>Wk 1</td>
                  <td className="band-start td-num">$372.36</td>
                  <td>
                    <Badge tone="valid">Valid</Badge>
                  </td>
                </tr>
                <tr className="selected">
                  <td>
                    <input className="checkbox" type="checkbox" defaultChecked />
                  </td>
                  <td className="cell-id">1000108</td>
                  <td className="band-start">971</td>
                  <td>Tue</td>
                  <td>Wk 3</td>
                  <td className="band-start td-num">$210.84</td>
                  <td>
                    <Badge tone="warning">Warning</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="row wrap" style={{ gap: 'var(--s2)' }}>
            {BADGES.map((b) => (
              <Badge key={b.label} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </div>
        </Block>

        {/* Banners + toast + tooltip ---------------------------------------- */}
        <Block title="Banners, toast and tooltip">
          <div className="stack-3">
            <Banner
              tone="warning"
              title="Route 970 is over the 8h target"
              action={<Button size="sm">Run Balancer</Button>}
            >
              Total time is 9h 15m against a 8h 00m target. Consider moving stops to Route 972.
            </Banner>
            <Banner tone="error" title="No changes were applied.">
              14 of 1,300 customers can’t be assigned to Tuesday, Week 3.
            </Banner>
            <Banner tone="success">
              All 1,300 customers can be assigned to Tuesday, Week 3.
            </Banner>
            <Banner tone="locked">
              The baseline can’t be edited. Save as a new option to make changes.
            </Banner>
          </div>

          <div className="row wrap" style={{ gap: 'var(--s3)', marginTop: 'var(--s5)' }}>
            <Button
              variant="secondary"
              onClick={() =>
                pushToast({
                  tone: 'success',
                  title: '1,300 customers assigned to Tuesday, Week 3.',
                })
              }
            >
              Show success toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                pushToast({
                  tone: 'info',
                  title: 'Route re-sequenced. 12 min saved.',
                  undoLabel: 'Undo',
                  onUndo: () =>
                    pushToast({ tone: 'info', title: 'Re-sequence reverted.' }),
                })
              }
            >
              Show toast with undo
            </Button>
            <Tooltip text="The baseline can’t be edited. Save as a new option to make changes.">
              <Button variant="secondary" icon={<QuestionIcon size={14} />}>
                Hover for tooltip
              </Button>
            </Tooltip>
          </div>
        </Block>

        {/* Drawer + modal shells -------------------------------------------- */}
        <Block title="Right drawer shell and confirmation modal">
          <div className="row wrap" style={{ gap: 'var(--s3)' }}>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open right drawer
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open confirmation modal
            </Button>
          </div>
        </Block>

        {/* Empty + progress ------------------------------------------------- */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Block title="Empty state">
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
              <EmptyState
                icon={<CircleStackIcon size={20} />}
                title="No datasets uploaded yet"
                sub="Uploaded or ingested datasets will appear here once customer and routing data has been added to the system."
                actions={
                  <Button variant="primary" size="sm">
                    Upload Dataset
                  </Button>
                }
              />
            </div>
          </Block>

          <Block title="Progress state">
            <div className="stack-4">
              <div>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 7 }}>
                  <span className="t-sm t-med">Applying assignment</span>
                  <span className="t-xs t-ter tnum">{pct}%</span>
                </div>
                <ProgressBar pct={pct} />
                <div className="t-xs t-sec" style={{ marginTop: 7 }}>
                  {Math.round((pct / 100) * 1300).toLocaleString('en-US')} of 1,300 customers checked
                </div>
              </div>

              <StepList
                steps={[
                  { label: 'Validating service patterns…', state: 'done' },
                  { label: 'Checking week rules…', state: 'done' },
                  { label: 'Updating selected customer rows…', state: 'active' },
                  { label: 'Recalculating route metrics…', state: 'todo' },
                  { label: 'Refreshing route summary…', state: 'todo' },
                ]}
              />

              <div className="row tight">
                <Button size="sm" onClick={() => setPct((p) => Math.max(0, p - 12))}>
                  −
                </Button>
                <Button size="sm" onClick={() => setPct((p) => Math.min(100, p + 12))}>
                  +
                </Button>
                <span className="t-xs t-ter">Adjust to preview progress</span>
              </div>

              <div>
                <div className="t-xs t-ter" style={{ marginBottom: 6 }}>
                  Indeterminate
                </div>
                <ProgressBar indeterminate />
              </div>
            </div>
          </Block>
        </div>
      </div>

      {drawerOpen && (
        <Drawer
          title="Customer 1000004"
          sub="Route 970 · Option 1"
          badge={<Badge tone="editable">Editable</Badge>}
          onClose={() => setDrawerOpen(false)}
          footer={
            <>
              <Button variant="primary" icon={<SaveIcon size={14} />}>
                Save
              </Button>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            </>
          }
        >
          <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)', lineHeight: 1.6 }}>
            This is the drawer shell: sticky header with title, subtitle and badge, a scrolling
            body, and a sticky footer holding a single Save action.
          </p>
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Example zone</span>
              <Badge tone="immutable" icon={<LockIcon size={11} />}>
                Read-only
              </Badge>
            </div>
            <div className="zone-body readonly">
              <DL>
                <DLRow k="Preferred Route" v="970" />
                <DLRow k="Service Time" v="14 min" />
                <DLRow k="Time Window" v="06:00 – 11:00" />
              </DL>
            </div>
          </div>
        </Drawer>
      )}

      {modalOpen && (
        <Modal
          title="Discard unsaved changes?"
          sub="You have unsaved changes. Leave without saving?"
          mark={
            <span className="modal-warn-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="dark" onClick={() => setModalOpen(false)}>
                Keep Editing
              </Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>
                Discard Changes
              </Button>
            </>
          }
        />
      )}
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="foundation-block">
      <div className="foundation-head">{title}</div>
      <div className="foundation-body">{children}</div>
    </div>
  )
}
