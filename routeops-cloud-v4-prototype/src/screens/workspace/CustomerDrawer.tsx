/**
 * Part K — Customer Detail Drawer.
 *
 * Zone A  Session Planning   editable in the active option
 * Zone B  Derived            read-only, calculated from service pattern
 * Zone C  Customer Master    read-only, shared across sessions, permission-gated
 *
 * One Save button, no field-level autosave. Validation failure saves nothing.
 * Leaving with pending edits raises the unsaved-changes guard.
 */
import { useMemo, useState } from 'react'
import {
  CUSTOMERS,
  ROUTE_IDS,
  SERVICE_PATTERNS,
  SESSION,
  WEEKDAYS,
  WEEKDAY_FULL,
  fmtMoney,
  validateAssignment,
  type Weekday,
} from '../../data/mock'
import { useApp } from '../../state/AppState'
import {
  Badge,
  Banner,
  Button,
  DL,
  DLRow,
  Drawer,
  Modal,
  Select,
  Tooltip,
  ToggleChip,
} from '../../components/ui'
import {
  ExternalIcon,
  InfoCircleIcon,
  LockIcon,
  SaveIcon,
  WarningIcon,
} from '../../components/icons'

export function CustomerDrawer({
  customerId,
  onClose,
}: {
  customerId: string
  onClose: () => void
}) {
  const { isBaseline, activeVersion, pushToast, setDirty } = useApp()
  const c = CUSTOMERS.find((x) => x.customerId === customerId)!

  const [route, setRoute] = useState(c.route)
  const [days, setDays] = useState<Weekday[]>(c.serviceDays)
  const [week, setWeek] = useState(String(c.weeks[0] ?? 1))
  const [pattern, setPattern] = useState(c.servicePattern ?? '')
  const [errors, setErrors] = useState<string[]>([])
  const [saveBlocked, setSaveBlocked] = useState(false)
  const [guardOpen, setGuardOpen] = useState(false)

  const dirty =
    route !== c.route ||
    pattern !== (c.servicePattern ?? '') ||
    week !== String(c.weeks[0] ?? 1) ||
    days.join() !== c.serviceDays.join()

  const derivedFrequency = pattern ? SERVICE_PATTERNS[pattern].frequency : '—'

  // Day chips are disabled when the chosen service pattern forbids them.
  const allowedDays = pattern ? SERVICE_PATTERNS[pattern].allowedDays : WEEKDAYS

  const inMaster = c.masterStatus === 'In Master'
  const mismatch = c.routeMismatch === 'Mismatch'

  const perVisit = useMemo(
    () => (days.length ? c.totalRevenue / days.length : 0),
    [days.length, c.totalRevenue],
  )

  const attemptClose = () => {
    if (dirty) setGuardOpen(true)
    else onClose()
  }

  const save = () => {
    const found: string[] = []
    if (!pattern) found.push('A service pattern is required before this customer can be planned.')
    days.forEach((d) => {
      const r = validateAssignment(pattern || null, d, Number(week))
      if (!r.ok && r.reason) {
        const msg =
          r.reason.startsWith('Service pattern')
            ? `${WEEKDAY_FULL[d]} is not allowed by service pattern ${pattern}.`
            : r.reason
        if (!found.includes(msg)) found.push(msg)
      }
    })
    if (!days.length) found.push('Select at least one delivery day.')

    if (found.length) {
      setErrors(found)
      setSaveBlocked(true)
      return
    }

    setErrors([])
    setSaveBlocked(false)
    setDirty(true)
    pushToast({
      tone: 'success',
      title: `Customer ${c.customerId} updated`,
      sub: `Route ${route} · ${days.join(', ')} · Wk ${week}`,
      undoLabel: 'Undo',
      onUndo: () =>
        pushToast({ tone: 'info', title: `Customer ${c.customerId} reverted.` }),
    })
    onClose()
  }

  return (
    <>
      <Drawer
        title={`Customer ${c.customerId}`}
        sub={`Route ${c.route} · ${activeVersion.name}`}
        badge={
          <div className="row tight wrap">
            <Badge tone={isBaseline ? 'immutable' : 'editable'}>
              {isBaseline ? 'Immutable' : 'Editable'}
            </Badge>
            <Badge tone={inMaster ? 'match' : 'notmaster'}>{c.masterStatus}</Badge>
            {mismatch && <Badge tone="mismatch">Route Mismatch</Badge>}
            <Badge
              tone={c.status === 'Valid' ? 'valid' : c.status === 'Warning' ? 'warning' : 'blocked'}
            >
              {c.status}
            </Badge>
          </div>
        }
        onClose={attemptClose}
        footer={
          isBaseline ? (
            <>
              <Tooltip text="The baseline can’t be edited. Save as a new option to make changes.">
                <Button variant="primary" disabled icon={<SaveIcon size={14} />}>
                  Save
                </Button>
              </Tooltip>
              <Button onClick={onClose}>Close</Button>
              <span className="row tight t-xs t-ter" style={{ marginLeft: 'auto' }}>
                <LockIcon size={12} />
                Read-only
              </span>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={save} icon={<SaveIcon size={14} />}>
                Save
              </Button>
              <Button onClick={attemptClose}>Cancel</Button>
              {dirty && (
                <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
                  Unsaved changes
                </span>
              )}
            </>
          )
        }
      >
        <div className="t-sm t-sec" style={{ marginBottom: 'var(--s4)' }}>
          {c.name} · {c.salesGroup}
        </div>

        {isBaseline && (
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="locked">
              The baseline can’t be edited. Save as a new option to make changes.
            </Banner>
          </div>
        )}

        {saveBlocked && (
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="error" title="No changes were saved.">
              <ul style={{ margin: '4px 0 0', paddingLeft: 16, lineHeight: 1.6 }}>
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Banner>
          </div>
        )}

        {!inMaster && (
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="info" title="Not in Customer Master">
              This customer isn’t in the Customer Master. Address, preferred route, and
              service time are unavailable.
            </Banner>
          </div>
        )}

        {mismatch && (
          <div style={{ marginBottom: 'var(--s4)' }}>
            <Banner tone="warning" title="Route mismatch">
              This customer is planned on a different route than its Customer Master preferred
              route.
              <div className="row tight" style={{ marginTop: 8 }}>
                <Badge tone="editable">Planned Route: {c.route}</Badge>
                <Badge tone="default">Preferred Route: {c.preferredRoute}</Badge>
              </div>
            </Banner>
          </div>
        )}

        <div className="stack-4">
          {/* Zone A — Session Planning ---------------------------------- */}
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Session Planning</span>
              <Badge tone={isBaseline ? 'immutable' : 'editable'}>
                {isBaseline ? 'Locked' : `Editable in ${activeVersion.name}`}
              </Badge>
            </div>
            <div className="zone-body stack-4">
              <div className="field">
                <label className="field-label">Route / Territory</label>
                <Select
                  value={route}
                  onChange={setRoute}
                  options={ROUTE_IDS}
                  disabled={isBaseline}
                />
              </div>

              <div className="field">
                <label className="field-label">Delivery Days</label>
                <div className="day-group">
                  {WEEKDAYS.map((d) => {
                    const blocked = !allowedDays.includes(d)
                    return (
                      <ToggleChip
                        key={d}
                        on={days.includes(d)}
                        disabled={isBaseline || blocked}
                        title={
                          blocked
                            ? `${WEEKDAY_FULL[d]} is not allowed by service pattern ${pattern || '—'}.`
                            : undefined
                        }
                        onClick={() =>
                          setDays((prev) =>
                            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
                          )
                        }
                      >
                        {d}
                      </ToggleChip>
                    )
                  })}
                </div>
                <span className="field-help">
                  Days blocked by the selected service pattern are disabled.
                </span>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Delivery Week</label>
                  <Select
                    value={week}
                    onChange={setWeek}
                    options={Array.from({ length: SESSION.cycleWeeks }, (_, i) => String(i + 1))}
                    disabled={isBaseline}
                  />
                  <span className="field-help">
                    Week pair:{' '}
                    {Number(week) <= 4
                      ? `Wk ${week} + Wk ${Number(week) + 4}`
                      : `Wk ${Number(week) - 4} + Wk ${week}`}
                  </span>
                </div>
                <div className="field">
                  <label className="field-label">Service Pattern</label>
                  <Select
                    value={pattern}
                    onChange={setPattern}
                    options={Object.keys(SERVICE_PATTERNS)}
                    placeholder="No pattern"
                    disabled={isBaseline}
                    hasError={saveBlocked && !pattern}
                  />
                </div>
              </div>

              {/* Inline validation example from the spec. */}
              {saveBlocked && errors.length > 0 && (
                <span className="field-error">
                  <WarningIcon size={13} style={{ marginTop: 1, flex: '0 0 auto' }} />
                  {errors[0]}
                </span>
              )}
            </div>
          </div>

          {/* Zone B — Derived ------------------------------------------- */}
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Derived</span>
              <Badge tone="immutable" icon={<LockIcon size={11} />}>
                Read-only
              </Badge>
            </div>
            <div className="zone-body readonly">
              <DL>
                <DLRow k="Frequency" v={derivedFrequency} />
                <DLRow
                  k="Revenue allocation per service day"
                  v={days.length ? fmtMoney(perVisit, 2) : '—'}
                />
                <DLRow k="Planning rows generated" v={`${days.length} (Option B)`} />
              </DL>
              <div className="t-xs t-sec" style={{ marginTop: 'var(--s3)', lineHeight: 1.55 }}>
                Calculated from selected service pattern. This value cannot be edited directly.
              </div>
            </div>
          </div>

          {/* Zone C — Customer Master ----------------------------------- */}
          <div className="zone">
            <div className="zone-head">
              <span className="zone-title">Customer Master</span>
              <Badge tone="immutable" icon={<LockIcon size={11} />}>
                Read-only
              </Badge>
            </div>
            <div className="zone-body readonly">
              <div
                className="row tight t-xs t-ter"
                style={{ marginBottom: 'var(--s3)' }}
              >
                <InfoCircleIcon size={12} />
                From Customer Master — shared across all sessions
              </div>

              {inMaster ? (
                <DL>
                  <DLRow k="Preferred Route" v={c.preferredRoute ?? '—'} />
                  <DLRow k="Master Delivery Days" v={c.serviceDays.join(', ')} />
                  <DLRow
                    k="Address"
                    v={
                      <span style={{ display: 'inline-block', maxWidth: 240, whiteSpace: 'normal' }}>
                        {c.address}
                      </span>
                    }
                  />
                  <DLRow
                    k="Service Time"
                    v={c.serviceTimeMin ? `${c.serviceTimeMin} min` : '—'}
                  />
                  <DLRow k="Time Window" v={c.timeWindow ?? '—'} />
                  <DLRow
                    k="Latitude / Longitude Status"
                    v={
                      <Badge tone={c.geoStatus === 'Geocoded' ? 'valid' : 'warning'}>
                        {c.geoStatus}
                      </Badge>
                    }
                  />
                </DL>
              ) : (
                <DL>
                  <DLRow k="Preferred Route" v="Unavailable" muted />
                  <DLRow k="Master Delivery Days" v="Unavailable" muted />
                  <DLRow k="Address" v="Unavailable" muted />
                  <DLRow k="Service Time" v="Unavailable" muted />
                  <DLRow k="Time Window" v="Unavailable" muted />
                  <DLRow k="Latitude / Longitude Status" v="Missing" muted />
                </DL>
              )}

              {/* Permission gate for the Routing Analyst role. */}
              <div
                style={{
                  marginTop: 'var(--s4)',
                  paddingTop: 'var(--s3)',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <div className="row tight">
                  <Tooltip text="You can view Customer Master data, but you don’t have permission to edit it.">
                    <Button size="sm" disabled iconRight={<ExternalIcon size={12} />}>
                      Edit in Customer Master
                    </Button>
                  </Tooltip>
                  <span className="t-xs t-ter" style={{ lineHeight: 1.5 }}>
                    You can view Customer Master data, but you don’t have permission to edit
                    it.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Unsaved changes guard --------------------------------------------- */}
      {guardOpen && (
        <Modal
          title="You have unsaved changes."
          sub="Leave without saving?"
          mark={
            <span className="modal-warn-mark">
              <WarningIcon size={17} />
            </span>
          }
          onClose={() => setGuardOpen(false)}
          footer={
            <>
              <Button variant="dark" onClick={() => setGuardOpen(false)}>
                Keep Editing
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setGuardOpen(false)
                  onClose()
                }}
              >
                Discard Changes
              </Button>
            </>
          }
        />
      )}
    </>
  )
}
