import {
    Eye,
    EyeOff,
    LogIn,
    PawPrint,
} from 'lucide-react';
import { useState } from 'react';
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router';

import authService from '../services/authService';

const initialForm = {
    email: '',
    password: '',
};

function getErrorMessage(error) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string') {
        return responseData;
    }

    if (responseData?.error) {
        return responseData.error;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    return 'No fue posible iniciar sesión.';
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (authService.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.email.trim() || !form.password) {
            setError('El correo y la contraseña son obligatorios.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await authService.login({
                email: form.email.trim(),
                password: form.password,
            });

            const destination =
                location.state?.from || '/';

            navigate(destination, {
                replace: true,
            });
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <PawPrint size={31} />
                    </div>

                    <div>
                        <h1>Caballeriza</h1>
                        <p>Sistema de gestión</p>
                    </div>
                </div>

                <div className="auth-heading">
                    <h2>Iniciar sesión</h2>
                    <p>
                        Ingresá con tu correo y contraseña.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <label className="form-field">
                        <span>Correo electrónico</span>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="form-field">
                        <span>Contraseña</span>

                        <div className="password-field">
                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Tu contraseña"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (current) => !current,
                                    )}
                                aria-label={
                                    showPassword
                                        ? 'Ocultar contraseña'
                                        : 'Mostrar contraseña'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>
                        </div>
                    </label>

                    <button
                        className="primary-button auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        <LogIn size={19} />

                        {loading
                            ? 'Ingresando...'
                            : 'Iniciar sesión'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    ¿No tenés una cuenta?{' '}
                    <Link to="/registro">
                        Registrate aquí
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default LoginPage;