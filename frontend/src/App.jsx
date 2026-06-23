import { Route, Routes } from 'react-router';

import MainLayout from './layouts/MainLayout';
import AlertsPage from './pages/AlertsPage';
import Dashboard from './pages/Dashboard';
import FeedingPlansPage from './pages/FeedingPlansPage';
import HorsesPage from './pages/HorsesPage';
import InventoryPage from './pages/InventoryPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import SupplyRecordsPage from './pages/SupplyRecordsPage';

function App() {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route
              path="caballos"
              element={<HorsesPage />}
          />

          <Route
              path="historial-medico"
              element={<MedicalHistoryPage />}
          />

          <Route
              path="alimentacion"
              element={<FeedingPlansPage />}
          />

          <Route
              path="suministros"
              element={<SupplyRecordsPage />}
          />

          <Route
              path="inventario"
              element={<InventoryPage />}
          />

          <Route
              path="alertas"
              element={<AlertsPage />}
          />
        </Route>
      </Routes>
  );
}

export default App;