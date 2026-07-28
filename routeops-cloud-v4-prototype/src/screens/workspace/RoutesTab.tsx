/** Part L — Routes tab. Part M — quickest-time sequencer as a row action. */
import { ROUTES, TARGET_MINUTES, fmtMoney, fmtNum } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { Badge, Button, StatusBadge, Tooltip } from '../../components/ui'
import { BoltIcon } from '../../components/icons'

export function RoutesTab({ onOpenRoute }: { onOpenRoute: (route: string) => void }) {
  const { isBaseline, pushToast, setDirty } = useApp()

  const sequence = (route: string, saving: number) => {
    if (saving === 0) {
      pushToast({
        tone: 'info',
        title: 'This route is already in its quickest sequence.',
        sub: `Route ${route} · no improvement found.`,
      })
      return
    }
    setDirty(true)
    pushToast({
      tone: 'success',
      title: `Route re-sequenced. ${saving} min saved.`,
      sub: `Route ${route} stop order updated.`,
      undoLabel: 'Undo',
      onUndo: () =>
        pushToast({ tone: 'info', title: `Route ${route} sequence restored.` }),
    })
  }

  return (
    <div className={`table-wrap${isBaseline ? ' locked-region' : ''}`}>
      <div className="table-toolbar">
        <span className="t-sm t-sec">
          8 routes · target working day {Math.floor(TARGET_MINUTES / 60)}h 00m
        </span>
        <span className="spacer" />
        <span className="row tight t-xs t-ter">
          <span className="legend-swatch" style={{ background: 'var(--error)' }} />
          Over Target
          <span className="legend-swatch" style={{ background: 'var(--success)', marginLeft: 8 }} />
          Balanced
          <span className="legend-swatch" style={{ background: '#b9b4a9', marginLeft: 8 }} />
          Underused
        </span>
      </div>

      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Route</th>
              <th>Driver</th>
              <th className="th-num">Customers</th>
              <th className="th-num">Service Time</th>
              <th className="th-num">Travel Time</th>
              <th className="th-num">Total Hours</th>
              <th className="th-num">Revenue</th>
              <th>Helper</th>
              <th>Scenario</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ROUTES.map((r) => (
              <tr key={r.route} className="clickable" onClick={() => onOpenRoute(r.route)}>
                <td className="t-semi mono">{r.route}</td>
                <td>{r.driver}</td>
                <td className="td-num">{fmtNum(r.customers)}</td>
                <td className="td-num">{r.serviceTimeMin} min</td>
                <td className="td-num">{r.travelTimeMin} min</td>
                <td className="td-num t-semi">{r.totalHours}</td>
                <td className="td-num">{fmtMoney(r.revenue)}</td>
                <td>
                  <Badge tone={r.helper === 'Assigned' ? 'info' : 'default'}>{r.helper}</Badge>
                </td>
                <td className="td-muted">{r.scenario}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td className="right" onClick={(e) => e.stopPropagation()}>
                  <span className="row tight" style={{ justifyContent: 'flex-end' }}>
                    <Tooltip
                      text={
                        isBaseline
                          ? "The baseline can’t be edited. Save as a new option to make changes."
                          : r.sequenceOptimized
                            ? 'This route is already in its quickest sequence.'
                            : `Estimated saving: ${r.potentialSavingMin} min`
                      }
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<BoltIcon size={13} />}
                        disabled={isBaseline}
                        onClick={() => sequence(r.route, r.potentialSavingMin)}
                      >
                        Sequence
                      </Button>
                    </Tooltip>
                    <Button size="sm" variant="ghost" onClick={() => onOpenRoute(r.route)}>
                      Open
                    </Button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-foot">
        <span>
          {fmtNum(ROUTES.reduce((n, r) => n + r.customers, 0))} customers ·{' '}
          {fmtMoney(ROUTES.reduce((n, r) => n + r.revenue, 0))} total revenue
        </span>
        <span className="t-xs t-ter">2 routes over target · 2 underused</span>
      </div>
    </div>
  )
}
