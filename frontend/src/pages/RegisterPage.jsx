import {
    Eye,
    EyeOff,
    PawPrint,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import {
    Link,
    Navigate,
    useNavigate,
} from 'react-router';

import authService from '../services/authService';

const initialForm = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (responseData && typeof responseData === 'object') {
        const message = Object.values(responseData).find(
            (value) => typeof value === 'string',
        );

        if (message) {
            return message;
        }
    }

    return 'No fue posible registrar el usuario.';
}

function RegisterPage() {
    const navigate = useNavigate();

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

        if (
            !form.nombre.trim()
            || !form.email.trim()
            || !form.password
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (form.password.length < 6) {
            setError(
                'La contraseña debe tener al menos 6 caracteres.',
            );
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await authService.register({
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            navigate('/', {
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
                    <h2>Crear cuenta</h2>
                    <p>
                        Registrá tus datos para ingresar al sistema.
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
                        <span>Nombre completo</span>

                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            autoComplete="name"
                            required
                        />
                    </label>

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
                                placeholder="Mínimo 6 caracteres"
                                autoComplete="new-password"
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

                    <label className="form-field">
                        <span>Confirmar contraseña</span>

                        <input
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repetí la contraseña"
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    <button
                        className="primary-button auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        <UserPlus size={19} />

                        {loading
                            ? 'Registrando...'
                            : 'Crear cuenta'}
                    </button>
                </form>

                <p className="auth-help">
                    Los usuarios nuevos se registran como clientes.
                    El administrador puede cambiar su rol.
                </p>

                <p className="auth-footer-text">
                    ¿Ya tenés una cuenta?{' '}
                    <Link to="/login">
                        Iniciar sesión
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default RegisterPage;