/** Customer Master — global customer database shared across all sessions. */
import { useMemo, useState } from 'react'
import { CUSTOMERS, fmtNum } from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Badge,
  Banner,
  Button,
  Dash,
  SectionHead,
  StatCard,
  Tooltip,
} from '../components/ui'
import {
  CheckCircleIcon,
  MapIcon,
  SearchIcon,
  UploadCloudIcon,
  UserGroupIcon,
  WarningIcon,
} from '../components/icons'

export function CustomerMaster() {
  const { nav } = useApp()
  const [q, setQ] = useState('')

  const rows = useMemo(
    () =>
      CUSTOMERS.filter(
        (c) =>
          !q ||
          c.customerId.includes(q.trim()) ||
          c.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  )

  const geocoded = CUSTOMERS.filter((c) => c.geoStatus === 'Geocoded').length
  const missing = CUSTOMERS.filter((c) => c.geoStatus === 'Missing').length

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <h1 className="page-title">Customer Master</h1>
            <p className="page-sub">
              The global customer database shared across every session. Sessions read from it but
              never write to it.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<UploadCloudIcon size={14} />}
            onClick={() => nav('master-import')}
          >
            Enhancement Import
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--s5)' }}>
        <Banner tone="info" title="Read-only for the Routing Analyst role">
          You can view Customer Master data, but you don’t have permission to edit it. Contact
          an Admin to correct addresses, service times or preferred routes.
        </Banner>
      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--s6)' }}>
        <StatCard
          label="Customers"
          value={fmtNum(1246)}
          sub="Records in Customer Master"
          icon={<UserGroupIcon size={15} />}
        />
        <StatCard
          label="Geocoded"
          value="96%"
          sub={`${geocoded} of ${CUSTOMERS.length} in sample`}
          icon={<MapIcon size={15} />}
        />
        <StatCard
          label="Missing geocode"
          value={String(missing)}
          sub="Cannot be placed on the map"
          icon={<WarningIcon size={15} />}
        />
        <StatCard
          label="Last enhancement"
          value="Yesterday"
          sub="1,246 rows updated"
          icon={<CheckCircleIcon size={15} />}
        />
      </div>

      <SectionHead
        title="Customer records"
        sub="Session planning fields are not shown here. This is the shared, session-independent view."
        right={
          <div className="table-search">
            <span className="search-icon">
              <SearchIcon size={13} />
            </span>
            <input
              placeholder="Search customer"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        }
      />

      <div className="table-wrap">
        <div className="table-scroll tall">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Preferred Route</th>
                <th>Master Delivery Days</th>
                <th>Address</th>
                <th className="th-num">Service Time</th>
                <th>Time Window</th>
                <th>Lat / Lon Status</th>
                <th>Master Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.customerId}>
                  <td className="cell-id">{c.customerId}</td>
                  <td className="t-med">{c.name}</td>
                  <td>{c.preferredRoute ?? <Dash />}</td>
                  <td className="td-muted">{c.serviceDays.join(' ')}</td>
                  <td
                    className="td-muted"
                    style={{ whiteSpace: 'normal', maxWidth: 260 }}
                  >
                    {c.address ?? <Dash />}
                  </td>
                  <td className="td-num">
                    {c.serviceTimeMin ? `${c.serviceTimeMin} min` : <Dash />}
                  </td>
                  <td className="td-muted">{c.timeWindow ?? <Dash />}</td>
                  <td>
                    <Badge
                      tone={
                        c.geoStatus === 'Geocoded'
                          ? 'valid'
                          : c.geoStatus === 'Approximate'
                            ? 'warning'
                            : 'blocked'
                      }
                    >
                      {c.geoStatus}
                    </Badge>
                  </td>
                  <td>
                    {c.masterStatus === 'In Master' ? (
                      <Badge tone="match">In Master</Badge>
                    ) : (
                      <Tooltip text="This customer appears in the Extension Report but has no Customer Master record.">
                        <Badge tone="notmaster">Not in Master</Badge>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>
            Showing {rows.length} of {CUSTOMERS.length} representative records ·{' '}
            {fmtNum(1246)} total in Customer Master
          </span>
          <span className="t-xs t-ter">Editing requires the Admin role.</span>
        </div>
      </div>
    </div>
  )
}
