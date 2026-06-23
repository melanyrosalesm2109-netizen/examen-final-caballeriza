import {
    Navigate,
    Route,
    Routes,
} from 'react-router';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AlertsPage from './pages/AlertsPage';
import CalendarPage from './pages/CalendarPage';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import FeedingPlansPage from './pages/FeedingPlansPage';
import HorsesPage from './pages/HorsesPage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import RegisterPage from './pages/RegisterPage';
import ReservationsPage from './pages/ReservationsPage';
import ShiftsPage from './pages/ShiftsPage';
import SupplyRecordsPage from './pages/SupplyRecordsPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/registro"
                element={<RegisterPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route
                        index
                        element={<Dashboard />}
                    />

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
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;