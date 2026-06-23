import { useEffect, useState } from 'react';

import ModulePage from '../components/ModulePage';
import ReservationFilters from '../components/ReservationFilters';
import ReservationForm from '../components/ReservationForm';

import {
createReservation,
filterReservations,
getReservations,
} from '../services/reservationService';

function ReservationsPage() {
const [reservations, setReservations] = useState([]);
const [loadingList, setLoadingList] = useState(false);
const [saving, setSaving] = useState(false);
const [filtering, setFiltering] = useState(false);
const [error, setError] = useState('');
const [message, setMessage] = useState('');


const loadReservations = async () => {
    try {
        setLoadingList(true);
        setError('');

        const data = await getReservations();

        setReservations(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setReservations([]);

        setError(
            'No se pudo conectar con el backend. Melany podrá probar esta conexión.',
        );
    } finally {
        setLoadingList(false);
    }
};

useEffect(() => {
    loadReservations();
}, []);

const handleCreate = async (reservation) => {
    try {
        setSaving(true);
        setError('');
        setMessage('');

        await createReservation(reservation);

        setMessage(
            'Reserva registrada correctamente.',
        );

        await loadReservations();

        return true;
    } catch {
        setError(
            'No se pudo registrar la reserva. Melany podrá probarla con el backend.',
        );

        return false;
    } finally {
        setSaving(false);
    }
};

const handleFilter = async (filters) => {
    try {
        setFiltering(true);
        setError('');
        return false;
    } finally {
        setSaving(false);
    }
};



const handleClearFilters = async () => {
    setMessage('');
    setError('');

    await loadReservations();
};

const formatText = (value) => {
    if (!value) {
        return '-';
    }

    return value
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};

return (
    <ModulePage
        title="Gestión de reservas"
        description="Registro, consulta, filtros y administración de reservas."
    >
        {message && (
            <div style={styles.success}>
                {message}
            </div>
        )}

        {error && (
            <div style={styles.error}>
                {error}
            </div>
        )}

        <ReservationForm
            onSave={handleCreate}
            loading={saving}
        />

        <ReservationFilters
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={filtering}
        />

        <div style={styles.header}>
            <h2 style={styles.title}>
                Reservas registradas
            </h2>

            <button
                type="button"
                onClick={loadReservations}
                disabled={loadingList}
                style={{
                    ...styles.button,
                    opacity: loadingList ? 0.7 : 1,
                }}
            >
                {loadingList
                    ? 'Cargando...'
                    : 'Actualizar'}
            </button>
        </div>

        {loadingList && (
            <p>Cargando reservas...</p>
        )}

        {!loadingList &&
            reservations.length === 0 && (
                <div className="empty-state">
                    No existen reservas para mostrar.
                </div>
            )}

        {!loadingList &&
            reservations.length > 0 && (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.cell}>
                                    ID
                                </th>

                                <th style={styles.cell}>
                                    Tipo
                                </th>

                                <th style={styles.cell}>
                                    Caballo
                                </th>

                                <th style={styles.cell}>
                                    Fecha
                                </th>

                                <th style={styles.cell}>
                                    Hora
                                </th>

                                <th style={styles.cell}>
                                    Cliente
                                </th>

                                <th style={styles.cell}>
                                    Estado
                                </th>

                                <th style={styles.cell}>
                                    Cupos
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td style={styles.cell}>
                                        {reservation.id}
                                    </td>

                                    <td style={styles.cell}>
                                        {formatText(
                                            reservation.tipo,
                                        )}
                                    </td>

                                    <td style={styles.cell}>
                                        {reservation.horse?.nombre ||
                                            reservation.horse?.name ||
                                            reservation.horse?.id ||
                                            'Sin asignar'}
                                    </td>

                                    <td style={styles.cell}>
                                        {reservation.fecha || '-'}
                                    </td>

                                    <td style={styles.cell}>
                                        {reservation.hora?.slice(
                                            0,
                                            5,
                                        ) || '-'}
                                    </td>

                                    <td style={styles.cell}>
                                        {reservation.cliente || '-'}
                                    </td>

                                    <td style={styles.cell}>
                                        {formatText(
                                            reservation.estado,
                                        )}
                                    </td>

                                    <td style={styles.cell}>
                                        {reservation.cuposReservados ?? 0}
                                        {' / '}
                                        {reservation.cupoMaximo ?? 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    </ModulePage>
);


}

const styles = {
success: {
padding: '12px',
marginBottom: '18px',
borderRadius: '8px',
backgroundColor: '#e4f6eb',
color: '#176438',
},


error: {
    padding: '12px',
    marginBottom: '18px',
    borderRadius: '8px',
    backgroundColor: '#fff4d6',
    color: '#7b5914',
},

header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '28px',
    marginBottom: '20px',
    flexWrap: 'wrap',
},

title: {
    margin: 0,
    fontSize: '20px',
},

button: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#164c3d',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
},

tableContainer: {
    width: '100%',
    overflowX: 'auto',
},

table: {
    width: '100%',
    minWidth: '850px',
    borderCollapse: 'collapse',
},

cell: {
    padding: '12px',
    borderBottom: '1px solid #e1e7e4',
    textAlign: 'left',
    verticalAlign: 'top',
},


};

export default ReservationsPage;
