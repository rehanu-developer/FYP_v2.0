/**
 * Part Q — Validation Message System.
 *
 * One page that defines every validation surface, when to use it, and the exact
 * copy. This is the reference the rest of the prototype is built against, and it
 * encodes the four global rules.
 */
import { useState } from 'react'
import { ROLES, VALIDATION_EXAMPLES, canOverridePattern, type Role } from '../data/prompt2'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Card,
  CountCard,
  Drawer,
  Modal,
  PatchBadge,
  ProgressBar,
  Select,
  StepList,
  Tooltip,
} from '../components/ui'
import { PatternConflictNotice, PatternDecisionNote } from '../components/PatternConflict'
import {
  ErrorCircleIcon,
  EyeIcon,
  InfoCircleIcon,
  LockIcon,

} from '../components/icons'

const GLOBAL_RULES = [
  {
    n: 1,
    title: 'Disable, don’t reject',
    body: 'If the system already knows an action is not allowed, disable the control and explain why. A blocking modal is only correct when the action came from a menu or shortcut and there is no visible disabled control to explain itself.',
    example: 'Add Helper is disabled on conventional routes, with the rule in the tooltip.',
  },
  {
    n: 2,
    title: 'No silent failure',
    body: 'Every failed write must state how many rows failed, which rows failed, why, and what the analyst can do next.',
    example: '“14 of 1,300 customers can’t be assigned to Friday, Week 3.” plus a violation table.',
  },
  {
    n: 3,
    title: 'No full page reloads',
    body: 'After changes, patch the grid, route metrics, route summary and activity feed in place. Each region shows its own updating state and settles independently.',
    example: 'Grid updating… → Metrics updating… → Summary updating… → Activity feed updating…',
  },
  {
    n: 4,
    title: 'Baseline is immutable',
    body: 'Never allow edits on Baseline, in any surface. That includes the grid, drawers, the map lasso and finalization.',
    example: 'Lasso is disabled on the map while Baseline is active.',
  },
  {
    n: 5,
    title: 'Option 1 is editable',
    body: 'All changes apply only to the active option, and every write names the option it landed in.',
    example: '“Changes applied to Option 1.”',
  },
]

export function ValidationSystem() {
  const { patch, runPatch, role, setRole } = useApp()
  const [drawer, setDrawer] = useState(false)
  const [modal, setModal] = useState(false)
  const [overridden, setOverridden] = useState(false)

  return (
    <div className="page">
      <div className="page-head">
        <div className="row tight" style={{ marginBottom: 8 }}>
          <Badge tone="info" icon={<InfoCircleIcon size={12} />}>
            Design decision · not a production screen
          </Badge>
        </div>
        <h1 className="page-title">Validation Message System</h1>
        <p className="page-sub">
          Every validation surface in RouteOps Cloud, when to use it, and the exact copy. This is
          the reference the product screens are built against.
        </p>
      </div>

      <div className="stack-6">
        {/* Global rules -------------------------------------------------- */}
        <Card>
          <div className="card-head">
            <div>
              <div className="section-title">Global rules</div>
              <div className="section-sub">
                These five rules decide which surface to reach for.
              </div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--s2)' }}>
            {GLOBAL_RULES.map((r) => (
              <div className="check-row" key={r.n}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--sidebar)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    flex: '0 0 auto',
                    marginTop: 1,
                  }}
                >
                  {r.n}
                </span>
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span className="t-sm t-med">{r.title}</span>
                  <span
                    className="t-xs t-sec"
                    style={{ display: 'block', marginTop: 3, lineHeight: 1.6 }}
                  >
                    {r.body}
                  </span>
                  <span
                    className="t-xs"
                    style={{
                      display: 'block',
                      marginTop: 5,
                      color: 'var(--accent-active)',
                    }}
                  >
                    {r.example}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Message types ------------------------------------------------- */}
        <div>
          <div className="section-title" style={{ marginBottom: 'var(--s2)' }}>
            Message types
          </div>
          <div className="table-wrap">
            <div className="table-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th style={{ minWidth: 230 }}>Purpose</th>
                    <th style={{ minWidth: 230 }}>When to use</th>
                    <th style={{ minWidth: 260 }}>Copy example</th>
                  </tr>
                </thead>
                <tbody>
                  {VALIDATION_EXAMPLES.map((v) => (
                    <tr key={v.type}>
                      <td className="t-med">{v.type}</td>
                      <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                        {v.purpose}
                      </td>
                      <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                        {v.when}
                      </td>
                      <td style={{ whiteSpace: 'normal' }}>
                        <span className="mono t-xs">{v.copy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live examples -------------------------------------------------- */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <div className="card-head">
              <div className="section-title">Inline warning</div>
              <div className="row tight">
                <span className="t-xs t-ter nowrap">Role</span>
                <div style={{ width: 132 }}>
                  <Select value={role} onChange={(v) => setRole(v as Role)} options={[...ROLES]} />
                </div>
              </div>
            </div>
            <div className="card-body stack-3">
              <PatternConflictNotice
                conflict={{ pattern: '8T', attemptedDay: 'Fri', attemptedWeek: 3 }}
                overridden={overridden}
                onOverride={() => setOverridden(true)}
              />
              {overridden && (
                <button className="link-btn plain t-xs" onClick={() => setOverridden(false)}>
                  Reset override
                </button>
              )}
              <div className="t-xs t-sec" style={{ lineHeight: 1.55 }}>
                Click <strong>View rule</strong> to see the rule popover, which names the pattern
                and the attempted change.
                {canOverridePattern(role) ? (
                  <>
                    {' '}
                    As <strong>{role}</strong> you may apply an override, which swaps the warning
                    for an audited <strong>Override applied</strong> badge.
                  </>
                ) : (
                  <>
                    {' '}
                    As <strong>{role}</strong> the override is not permitted. Switch to Admin or
                    Ingest Admin above to see the override state.
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div className="section-title">Grid variant</div>
              <Badge tone="default">Compact</Badge>
            </div>
            <div className="card-body">
              <p className="t-sm t-sec" style={{ marginBottom: 'var(--s4)', lineHeight: 1.6 }}>
                Inside a dense grid there is no room for body copy, so the same conflict collapses
                to a badge plus the rule popover.
              </p>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Day</th>
                      <th>Pattern</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-id">1001103</td>
                      <td>Fri</td>
                      <td>8T</td>
                      <td>
                        <PatternConflictNotice
                          compact
                          conflict={{ pattern: '8T', attemptedDay: 'Fri', attemptedWeek: 3 }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="cell-id">1000004</td>
                      <td>Tue</td>
                      <td>E4W</td>
                      <td>
                        <Badge tone="valid">Valid</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <PatternDecisionNote />

        {/* Banners --------------------------------------------------------- */}
        <Card>
          <div className="card-head">
            <div className="section-title">Banners and blocking states</div>
          </div>
          <div className="card-body stack-3">
            <Banner tone="error" title="No changes were applied.">
              14 of 1,300 customers can’t be assigned to Friday, Week 3.
            </Banner>
            <Banner tone="warning" title="Option has unresolved warnings">
              3 customers are not in Customer Master. 2 routes are missing helper validation.
            </Banner>
            <Banner tone="locked">
              The baseline can’t be edited. Save as a new option to make changes.
            </Banner>
            <Banner tone="success">Changes applied to Option 1.</Banner>
          </div>
        </Card>

        {/* Disabled + modal + patching ------------------------------------ */}
        <div className="grid-3" style={{ alignItems: 'start' }}>
          <Card>
            <div className="card-head">
              <div className="section-title">Disabled tooltip</div>
            </div>
            <div className="card-body">
              <p className="t-xs t-sec" style={{ marginBottom: 'var(--s3)', lineHeight: 1.55 }}>
                Rule 1. The control stays visible and explains itself.
              </p>
              <Tooltip text="Helpers are not allowed on conventional routes.">
                <Button disabled size="sm">
                  Add Helper
                </Button>
              </Tooltip>
              <div style={{ marginTop: 'var(--s3)' }}>
                <Tooltip text="Finalize an option before exporting the Stop List.">
                  <Button disabled size="sm" icon={<LockIcon size={13} />}>
                    Generate Stop List
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div className="section-title">Blocking modal</div>
            </div>
            <div className="card-body">
              <p className="t-xs t-sec" style={{ marginBottom: 'var(--s3)', lineHeight: 1.55 }}>
                Only for menu or shortcut triggers, where no disabled control is on screen.
              </p>
              <Button size="sm" variant="secondary" onClick={() => setModal(true)}>
                Trigger blocking modal
              </Button>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div className="section-title">Patching states</div>
              <PatchBadge on={patch.grid} label="Grid updating…" />
            </div>
            <div className="card-body">
              <p className="t-xs t-sec" style={{ marginBottom: 'var(--s3)', lineHeight: 1.55 }}>
                Rule 3. Four regions settle independently, no page reload.
              </p>
              <StepList
                steps={[
                  { label: 'Grid updating…', state: patch.grid ? 'active' : 'done' },
                  { label: 'Metrics updating…', state: patch.metrics ? 'active' : 'done' },
                  { label: 'Summary updating…', state: patch.summary ? 'active' : 'done' },
                  {
                    label: 'Activity feed updating…',
                    state: patch.activity ? 'active' : 'done',
                  },
                ]}
              />
              <div style={{ marginTop: 'var(--s3)' }}>
                <Button size="sm" variant="secondary" onClick={runPatch}>
                  Run patch cycle
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Violation list + progress -------------------------------------- */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <div className="card-head">
              <div className="section-title">Violation list</div>
              <Badge tone="blocked">Rule 2</Badge>
            </div>
            <div className="card-body">
              <div className="row" style={{ gap: 'var(--s2)', marginBottom: 'var(--s3)' }}>
                <CountCard label="Valid" value="18" tone="valid" />
                <CountCard label="Blocked" value="2" tone="blocked" />
              </div>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Reason</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-id">1000214</td>
                      <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                        Service pattern does not allow Tuesday.
                      </td>
                      <td className="right">
                        <Button size="sm" variant="ghost">
                          Highlight
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="cell-id">1000541</td>
                      <td className="td-muted" style={{ whiteSpace: 'normal' }}>
                        Week 3 is not valid for this customer’s pattern.
                      </td>
                      <td className="right">
                        <Button size="sm" variant="ghost">
                          Highlight
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="table-foot">
                  <span>Blocked customers will not move.</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div className="section-title">Progress state &amp; audit note</div>
            </div>
            <div className="card-body stack-4">
              <div>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="t-sm t-med">Applying assignment</span>
                  <span className="t-xs t-ter tnum">49%</span>
                </div>
                <ProgressBar pct={49} />
                <div className="t-xs t-sec" style={{ marginTop: 6 }}>
                  642 of 1,300 customers checked
                </div>
              </div>

              <div className="callout">
                <div className="row tight" style={{ marginBottom: 5 }}>
                  <EyeIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="t-med t-sm" style={{ color: 'var(--text)' }}>
                    Audit note
                  </span>
                </div>
                Name revealed and audit logged.
              </div>

              <Button size="sm" variant="secondary" onClick={() => setDrawer(true)}>
                Open drawer shell
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {modal && (
        <Modal
          title="Helpers are not allowed on conventional routes"
          sub="This route uses a conventional scenario, so helper assignment is blocked by scenario rules."
          mark={
            <span className="modal-danger-mark">
              <ErrorCircleIcon size={17} />
            </span>
          }
          onClose={() => setModal(false)}
          footer={
            <Button variant="dark" onClick={() => setModal(false)}>
              Got it
            </Button>
          }
        />
      )}

      {drawer && (
        <Drawer
          title="Drawer shell"
          sub="Sticky header, scrolling body, sticky footer with a single primary action."
          onClose={() => setDrawer(false)}
          footer={
            <>
              <Button variant="primary">Save</Button>
              <Button onClick={() => setDrawer(false)}>Cancel</Button>
            </>
          }
        >
          <div className="stack-3">
            <PatternConflictNotice
              conflict={{ pattern: '2T', attemptedDay: 'Fri', attemptedWeek: 3 }}
            />
            <div className="callout t-xs">
              Validation appears where the edit happens, not only on save.
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}

