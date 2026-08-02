/** Admin — roles, permissions and session defaults. */
import { Badge, Card, SectionHead, Segmented } from '../components/ui'
import { DEPOTS, SCENARIOS, USER } from '../data/mock'
import { useState } from 'react'

interface Perm {
  capability: string
  analyst: 'Full' | 'View' | 'None'
  fleetLead: 'Full' | 'View' | 'None'
  admin: 'Full' | 'View' | 'None'
}

const PERMISSIONS: Perm[] = [
  { capability: 'Create sessions', analyst: 'Full', fleetLead: 'None', admin: 'Full' },
  { capability: 'Edit options', analyst: 'Full', fleetLead: 'None', admin: 'Full' },
  { capability: 'View baseline', analyst: 'View', fleetLead: 'View', admin: 'View' },
  { capability: 'Finalize an option', analyst: 'Full', fleetLead: 'None', admin: 'Full' },
  { capability: 'Export stop list', analyst: 'Full', fleetLead: 'View', admin: 'Full' },
  { capability: 'View reports', analyst: 'Full', fleetLead: 'View', admin: 'Full' },
  { capability: 'Edit Customer Master', analyst: 'None', fleetLead: 'None', admin: 'Full' },
  { capability: 'Upload datasets', analyst: 'None', fleetLead: 'None', admin: 'Full' },
  { capability: 'Edit Reference Data', analyst: 'None', fleetLead: 'None', admin: 'Full' },
]

export function Admin() {
  const [cycle, setCycle] = useState<'4 Week' | '8 Week'>('8 Week')

  const tone = (v: Perm['analyst']) =>
    v === 'Full' ? 'valid' : v === 'View' ? 'info' : 'default'

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Admin</h1>
        <p className="page-sub">
          Configuration, roles and session defaults. Changes here apply to every new session.
        </p>
      </div>

      <SectionHead
        title="Roles &amp; permissions"
        sub="The Routing Analyst can plan freely but cannot change shared reference or master data."
      />
      <div className="table-wrap" style={{ marginBottom: 'var(--s6)' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Capability</th>
              <th>
                Routing Analyst
                <div className="t-xs t-ter" style={{ textTransform: 'none', letterSpacing: 0 }}>
                  {USER.name}
                </div>
              </th>
              <th>Fleet Lead</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((p) => (
              <tr key={p.capability}>
                <td className="t-med">{p.capability}</td>
                <td>
                  <Badge tone={tone(p.analyst)}>{p.analyst}</Badge>
                </td>
                <td>
                  <Badge tone={tone(p.fleetLead)}>{p.fleetLead}</Badge>
                </td>
                <td>
                  <Badge tone={tone(p.admin)}>{p.admin}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">
          <span>3 roles · {PERMISSIONS.length} capabilities</span>
          <span className="t-xs t-ter">Fleet Lead is read-only reporting by design.</span>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <Card>
          <div className="card-head">
            <div className="section-title">Session defaults</div>
          </div>
          <div className="card-body stack-4">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="t-sm">Default cycle length</span>
              <Segmented value={cycle} onChange={setCycle} options={['4 Week', '8 Week'] as const} />
            </div>
            <Row k="Default scenario" v={SCENARIOS[0]} />
            <Row k="Default depot" v={DEPOTS[0]} />
            <Row k="Default starting week" v="Wk 1" />
            <Row k="Target working day" v="8h 00m" />
            <Row k="Manual selection limit" v="500 rows" />
            <Row k="Row model" v="Option B — one row per customer per service day" />
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <div className="section-title">Validation policy</div>
          </div>
          <div className="card-body stack-4">
            <Row k="Bulk assignment" v="All-or-nothing" />
            <Row k="Partial updates" v="Only after explicit exclusion" />
            <Row k="Blocked import rows" v="Never imported silently" />
            <Row k="Baseline" v="Immutable, no exceptions" />
            <Row k="Export requires" v="Finalized option, zero blockers" />
            <Row k="Undo window" v="Most recent write per option" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s4)' }}>
      <span className="t-sm t-sec">{k}</span>
      <span className="t-sm t-med right">{v}</span>
    </div>
  )
}
