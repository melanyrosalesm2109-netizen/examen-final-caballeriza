import {
    Search,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserRoundCog,
    UserX,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Navigate } from 'react-router';

import PageHeader from '../components/PageHeader';
import authService from '../services/authService';
import userService from '../services/userService';

const roleOptions = [
    {
        value: 'ADMINISTRADOR',
        label: 'Administrador',
    },
    {
        value: 'CUIDADOR',
        label: 'Cuidador',
    },
    {
        value: 'VETERINARIO',
        label: 'Veterinario',
    },
    {
        value: 'CLIENTE',
        label: 'Cliente',
    },
];

function getErrorMessage(error, defaultMessage) {
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
        const firstMessage = Object.values(responseData).find(
            (value) => typeof value === 'string',
        );

        if (firstMessage) {
            return firstMessage;
        }
    }

    return defaultMessage;
}

function formatRole(role) {
    const option = roleOptions.find(
        (currentOption) => currentOption.value === role,
    );

    return option?.label || role || 'Sin rol';
}

function UsersPage() {
    const currentUser = authService.getStoredUser();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const filteredUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return users;
        }

        return users.filter((user) =>
            [
                user.nombre,
                user.email,
                user.rol,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchValue),
                ),
        );
    }, [users, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await userService.getAll();

            setUsers(
                Array.isArray(data) ? data : [],
            );
        } catch (requestError) {
            setUsers([]);

            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar los usuarios.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.rol === 'ADMINISTRADOR') {
            loadUsers();
        } else {
            setLoading(false);
        }
    }, []);

    if (currentUser?.rol !== 'ADMINISTRADOR') {
        return <Navigate to="/" replace />;
    }

    const handleRoleChange = async (user, newRole) => {
        if (user.id === currentUser?.id) {
            setError(
                'No podés cambiar el rol de tu propia cuenta.',
            );
            return;
        }

        try {
            setProcessingId(user.id);
            setError('');
            setMessage('');

            const updatedUser =
                await userService.updateRole(
                    user.id,
                    newRole,
                );

            setUsers((currentUsers) =>
                currentUsers.map((current) =>
                    current.id === user.id
                        ? updatedUser
                        : current,
                ),
            );

            setMessage(
                `El rol de ${user.nombre} fue actualizado.`,
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible actualizar el rol.',
                ),
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleToggleActive = async (user) => {
        if (user.id === currentUser?.id) {
            setError(
                'No podés desactivar tu propia cuenta.',
            );
            return;
        }

        const newActiveStatus = !user.activo;

        try {
            setProcessingId(user.id);
            setError('');
            setMessage('');

            const updatedUser =
                await userService.updateActive(
                    user.id,
                    newActiveStatus,
                );

            setUsers((currentUsers) =>
                currentUsers.map((current) =>
                    current.id === user.id
                        ? updatedUser
                        : current,
                ),
            );

            setMessage(
                newActiveStatus
                    ? `La cuenta de ${user.nombre} fue activada.`
                    : `La cuenta de ${user.nombre} fue desactivada.`,
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cambiar el estado del usuario.',
                ),
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (user) => {
        if (user.id === currentUser?.id) {
            setError(
                'No podés eliminar tu propia cuenta.',
            );
            return;
        }

        const confirmed = window.confirm(
            `¿Deseás eliminar definitivamente al usuario ${user.nombre}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(user.id);
            setError('');
            setMessage('');

            await userService.remove(user.id);

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (current) => current.id !== user.id,
                ),
            );

            setMessage(
                `El usuario ${user.nombre} fue eliminado.`,
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el usuario.',
                ),
            );
        } finally {
            setProcessingId(null);
        }
    };

    const activeUsers = users.filter(
        (user) => user.activo,
    ).length;

    const administratorUsers = users.filter(
        (user) => user.rol === 'ADMINISTRADOR',
    ).length;

    return (
        <>
            <PageHeader
                title="Usuarios y roles"
                description="Administración de usuarios, permisos y acceso al sistema."
            />

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="users-stats-grid">
                <article className="users-stat-card">
                    <div className="users-stat-icon">
                        <UserRoundCog size={23} />
                    </div>

                    <div>
                        <span>Total de usuarios</span>
                        <strong>{users.length}</strong>
                    </div>
                </article>

                <article className="users-stat-card">
                    <div className="users-stat-icon">
                        <UserCheck size={23} />
                    </div>

                    <div>
                        <span>Usuarios activos</span>
                        <strong>{activeUsers}</strong>
                    </div>
                </article>

                <article className="users-stat-card">
                    <div className="users-stat-icon">
                        <ShieldCheck size={23} />
                    </div>

                    <div>
                        <span>Administradores</span>
                        <strong>{administratorUsers}</strong>
                    </div>
                </article>
            </div>

            <section className="content-card">
                <div className="table-toolbar">
                    <div>
                        <h3>Usuarios registrados</h3>

                        <p>
                            Cambiá roles y controlá el acceso de
                            cada usuario.
                        </p>
                    </div>

                    <label className="search-field">
                        <Search size={18} />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)}
                            placeholder="Buscar por nombre, correo o rol"
                        />
                    </label>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando usuarios...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        No hay usuarios para mostrar.
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table users-table">
                            <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredUsers.map((user) => {
                                const isCurrentUser =
                                    user.id
                                    === currentUser?.id;

                                const processing =
                                    processingId
                                    === user.id;

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {user.nombre
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                        || 'U'}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.nombre}
                                                    </strong>

                                                    {isCurrentUser && (
                                                        <small>
                                                            Tu cuenta
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            <select
                                                className="role-select"
                                                value={user.rol}
                                                disabled={
                                                    processing
                                                    || isCurrentUser
                                                }
                                                onChange={(event) =>
                                                    handleRoleChange(
                                                        user,
                                                        event.target.value,
                                                    )}
                                            >
                                                {roleOptions.map(
                                                    (option) => (
                                                        <option
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </td>

                                        <td>
                                                <span
                                                    className={
                                                        user.activo
                                                            ? 'user-status user-status-active'
                                                            : 'user-status user-status-inactive'
                                                    }
                                                >
                                                    {user.activo
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </span>
                                        </td>

                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className={
                                                        user.activo
                                                            ? 'user-action-button deactivate'
                                                            : 'user-action-button activate'
                                                    }
                                                    disabled={
                                                        processing
                                                        || isCurrentUser
                                                    }
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            user,
                                                        )}
                                                    title={
                                                        user.activo
                                                            ? 'Desactivar usuario'
                                                            : 'Activar usuario'
                                                    }
                                                >
                                                    {user.activo ? (
                                                        <UserX
                                                            size={17}
                                                        />
                                                    ) : (
                                                        <UserCheck
                                                            size={17}
                                                        />
                                                    )}

                                                    <span>
                                                            {user.activo
                                                                ? 'Desactivar'
                                                                : 'Activar'}
                                                        </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="user-action-button delete"
                                                    disabled={
                                                        processing
                                                        || isCurrentUser
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            user,
                                                        )}
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2
                                                        size={17}
                                                    />

                                                    <span>
                                                            Eliminar
                                                        </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default UsersPage;