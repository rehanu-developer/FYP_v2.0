/**
 * Part E — Create Session.
 * Defaults are pre-filled and tagged "Default". Changing a field manually
 * removes its Default tag. The Baseline Preview stays in its empty state until
 * a market is chosen, then fills in with the snapshot that will be created.
 */
import { useState } from 'react'
import {
  DEPOTS,
  MARKETS,
  SCENARIOS,
  STARTING_WEEKS,
  TIME_PERIODS,
  fmtNum,
} from '../data/mock'
import { useApp } from '../state/AppState'
import {
  Banner,
  Button,
  Card,
  DL,
  DLRow,
  DefaultTag,
  Field,
  ProcessStrip,
  Segmented,
  Select,
} from '../components/ui'
import { ArrowRightIcon, InfoCircleIcon, LockIcon } from '../components/icons'

type Cycle = '4 Week' | '8 Week'

export function CreateSession() {
  const { nav, pushToast } = useApp()

  const [name, setName] = useState('')
  const [market, setMarket] = useState('')
  const [scenario, setScenario] = useState('Delivery')
  const [cycle, setCycle] = useState<Cycle>('8 Week')
  const [startWeek, setStartWeek] = useState('Wk 1')
  const [depot, setDepot] = useState('BR North')
  const [period, setPeriod] = useState('Jul 2026')

  // Track which pre-filled fields are still untouched, so the Default tag
  // disappears the moment the analyst overrides a value.
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }))
  const isDefault = (k: string) => !touched[k]

  const previewReady = Boolean(market)
  const canCreate = Boolean(name.trim() && market && scenario && cycle && depot && period)

  const create = () => {
    pushToast({
      tone: 'success',
      title: 'Session created',
      sub: 'Baseline snapshotted from the latest active master dataset. Option 1 is ready to edit.',
    })
    nav('workspace')
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Create Planning Session</h1>
        <p className="page-sub">
          Create a planning workspace from the latest active master dataset.
        </p>
      </div>

      <Card className="card-pad" style={{ marginBottom: 'var(--s5)' }}>
        <div className="row" style={{ alignItems: 'flex-start', gap: 'var(--s3)' }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--r-md)',
              background: 'var(--accent-wash)',
              color: 'var(--accent)',
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
            }}
          >
            <InfoCircleIcon size={15} />
          </span>
          <p className="t-sm t-sec" style={{ lineHeight: 1.6, maxWidth: 780 }}>
            A session is a planning workspace for one market and cycle. The system snapshots
            the baseline when the session is created. The baseline stays locked. Any changes
            are made in an option.
          </p>
        </div>
        <div style={{ marginTop: 'var(--s4)', paddingTop: 'var(--s4)', borderTop: '1px solid var(--border-subtle)' }}>
          <ProcessStrip
            nodes={[
              { label: 'Master Dataset', state: 'on' },
              { label: 'Session' },
              { label: 'Baseline Snapshot' },
              { label: 'Option' },
              { label: 'Final Plan' },
            ]}
          />
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(340px, 0.9fr)',
          gap: 'var(--s5)',
          alignItems: 'start',
        }}
      >
        {/* Form ------------------------------------------------------------ */}
        <Card>
          <div className="card-head">
            <div className="section-title">Session Details</div>
          </div>
          <div className="card-body stack-4">
            <Field label="Session Name" required>
              <input
                className="input"
                placeholder="e.g. Baton Rouge July 2026 Restructure"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <div className="grid-2">
              <Field label="Market / Territory Scope" required>
                <Select
                  value={market}
                  onChange={(v) => {
                    setMarket(v)
                    touch('market')
                  }}
                  options={MARKETS}
                  placeholder="Choose a market or territory"
                />
              </Field>

              <Field
                label="Scenario"
                required
                tag={isDefault('scenario') ? <DefaultTag /> : undefined}
              >
                <Select
                  value={scenario}
                  onChange={(v) => {
                    setScenario(v)
                    touch('scenario')
                  }}
                  options={SCENARIOS}
                  placeholder="Choose a scenario"
                />
              </Field>
            </div>

            <Field
              label="Cycle Length"
              required
              tag={isDefault('cycle') ? <DefaultTag /> : undefined}
              help="An 8-week cycle pairs weeks as 1+5, 2+6, 3+7 and 4+8."
            >
              <Segmented
                value={cycle}
                onChange={(v) => {
                  setCycle(v)
                  touch('cycle')
                }}
                options={['4 Week', '8 Week'] as const}
              />
            </Field>

            <div className="grid-2">
              <Field
                label="Starting Week"
                required
                tag={isDefault('startWeek') ? <DefaultTag /> : undefined}
              >
                <Select
                  value={startWeek}
                  onChange={(v) => {
                    setStartWeek(v)
                    touch('startWeek')
                  }}
                  options={cycle === '4 Week' ? STARTING_WEEKS : STARTING_WEEKS.concat(['Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'])}
                  placeholder="Choose starting week"
                />
              </Field>

              <Field
                label="Depot"
                required
                tag={isDefault('depot') ? <DefaultTag /> : undefined}
              >
                <Select
                  value={depot}
                  onChange={(v) => {
                    setDepot(v)
                    touch('depot')
                  }}
                  options={DEPOTS}
                  placeholder="Choose depot"
                />
              </Field>
            </div>

            <Field
              label="Time Period"
              required
              tag={isDefault('period') ? <DefaultTag /> : undefined}
            >
              <Select
                value={period}
                onChange={(v) => {
                  setPeriod(v)
                  touch('period')
                }}
                options={TIME_PERIODS}
                placeholder="Choose planning period"
              />
            </Field>
          </div>
          <div className="card-foot">
            <Button
              variant="primary"
              disabled={!canCreate}
              onClick={create}
              iconRight={<ArrowRightIcon size={14} />}
            >
              Create Session
            </Button>
            <Button onClick={() => nav('sessions')}>Cancel</Button>
            {!canCreate && (
              <span className="t-xs t-ter" style={{ marginLeft: 'auto' }}>
                Enter a session name and choose a market to continue.
              </span>
            )}
          </div>
        </Card>

        {/* Baseline preview ------------------------------------------------ */}
        <Card>
          <div className="card-head">
            <div className="section-title">Baseline Preview</div>
          </div>
          <div className="card-body">
            {!previewReady ? (
              <div className="callout">
                Select a market, scenario, cycle, depot, and planning period to preview the
                baseline that will be created.
                <DL>
                  <div style={{ marginTop: 'var(--s3)' }}>
                    <DLRow k="Estimated customers" v="—" muted />
                    <DLRow k="Estimated rows" v="—" muted />
                    <DLRow k="Routes" v="—" muted />
                    <DLRow k="Territories" v="—" muted />
                    <DLRow k="Depots" v="—" muted />
                    <DLRow k="Cycle" v="Not selected" muted />
                    <DLRow k="Scenario" v="Not selected" muted />
                    <DLRow k="Starting week" v="Not selected" muted />
                  </div>
                </DL>
              </div>
            ) : (
              <>
                <DL>
                  <DLRow k="Estimated customers" v={fmtNum(1300)} />
                  <DLRow
                    k="Estimated planning rows"
                    v={
                      <span>
                        {fmtNum(6500)}{' '}
                        <span className="t-xs t-ter">(Option B)</span>
                      </span>
                    }
                  />
                  <DLRow k="Routes" v="8" />
                  <DLRow k="Territories" v="8" />
                  <DLRow k="Depots" v="1" />
                  <DLRow k="Cycle" v={cycle} />
                  <DLRow k="Scenario" v={scenario} />
                  <DLRow k="Starting week" v={startWeek} />
                  <DLRow k="Baseline source" v="Latest active master dataset" />
                </DL>
                <div style={{ marginTop: 'var(--s4)' }}>
                  <Banner tone="locked">
                    The system will snapshot this baseline when the session is created. The
                    baseline will remain locked, and edits will happen inside an Option.
                  </Banner>
                </div>
                <div
                  className="row tight t-xs t-ter"
                  style={{ marginTop: 'var(--s3)' }}
                >
                  <LockIcon size={12} />
                  Row count assumes one row per customer per service day.
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
