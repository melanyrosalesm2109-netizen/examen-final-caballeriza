import { Route, Routes } from 'react-router';

import MainLayout from './layouts/MainLayout';
import AlertsPage from './pages/AlertsPage';
import CalendarPage from './pages/CalendarPage';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import FeedingPlansPage from './pages/FeedingPlansPage';
import HorsesPage from './pages/HorsesPage';
import InventoryPage from './pages/InventoryPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import ReservationsPage from './pages/ReservationsPage';
import ShiftsPage from './pages/ShiftsPage';
import SupplyRecordsPage from './pages/SupplyRecordsPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';

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

                <Route
                    path="usuarios"
                    element={<UsersPage />}
                />

                <Route
                    path="empleados"
                    element={<EmployeesPage />}
                />

                <Route
                    path="turnos"
                    element={<ShiftsPage />}
                />

                <Route
                    path="tareas"
                    element={<TasksPage />}
                />

                <Route
                    path="reservas"
                    element={<ReservationsPage />}
                />

                <Route
                    path="calendario"
                    element={<CalendarPage />}
                />
            </Route>
        </Routes>
    );
}

export default App;