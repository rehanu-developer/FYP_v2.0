/** App shell + screen switch. */
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ToastLayer } from './components/ToastLayer'
import { useApp } from './state/AppState'

import { ScreenIndex } from './screens/ScreenIndex'
import { Dashboard } from './screens/Dashboard'
import { DataIngestion } from './screens/DataIngestion'
import { MasterDataset } from './screens/MasterDataset'
import { Sessions } from './screens/Sessions'
import { CreateSession } from './screens/CreateSession'
import { RouteWorkspace } from './screens/RouteWorkspace'
import { MapLassoScreen } from './screens/MapLassoScreen'
import { FinalizeScreen } from './screens/FinalizeScreen'
import { ValidationSystem } from './screens/ValidationSystem'
import { CustomerMaster } from './screens/CustomerMaster'
import { MasterImport } from './screens/MasterImport'
import { ReferenceData } from './screens/ReferenceData'
import { ActivityFeed } from './screens/ActivityFeed'
import { Exports } from './screens/Exports'
import { StopList } from './screens/StopList'
import { Admin } from './screens/Admin'
import { DesignFoundation } from './screens/DesignFoundation'
import { RowModelDecision } from './screens/RowModelDecision'
import { OpenDecisions } from './screens/OpenDecisions'
import { Checklist } from './screens/Checklist'

export function App() {
  const { screen, density } = useApp()

  return (
    <div className={`app density-${density}`}>
      <Sidebar />
      <div className="main">
        <TopBar />
        {screen === 'screens' && <ScreenIndex />}
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'ingestion' && <DataIngestion />}
        {screen === 'master-dataset' && <MasterDataset />}
        {screen === 'sessions' && <Sessions />}
        {screen === 'create-session' && <CreateSession />}
        {screen === 'workspace' && <RouteWorkspace />}
        {screen === 'map' && <MapLassoScreen />}
        {screen === 'finalize' && <FinalizeScreen />}
        {screen === 'validation-system' && <ValidationSystem />}
        {screen === 'customer-master' && <CustomerMaster />}
        {screen === 'master-import' && <MasterImport />}
        {screen === 'reference-data' && <ReferenceData />}
        {screen === 'activity' && <ActivityFeed />}
        {screen === 'exports' && <Exports />}
        {screen === 'stop-list' && <StopList />}
        {screen === 'admin' && <Admin />}
        {screen === 'foundation' && <DesignFoundation />}
        {screen === 'row-model' && <RowModelDecision />}
        {screen === 'open-decisions' && <OpenDecisions />}
        {screen === 'checklist' && <Checklist />}
      </div>
      <ToastLayer />
    </div>
  )
}
