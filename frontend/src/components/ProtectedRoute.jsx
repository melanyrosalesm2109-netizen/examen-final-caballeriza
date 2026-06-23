import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router';

import authService from '../services/authService';

function ProtectedRoute() {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;