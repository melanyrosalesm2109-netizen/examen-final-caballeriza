import { useEffect, useMemo, useState } from 'react';
import ModulePage from '../components/ModulePage';
import { getReservations } from '../services/reservationService';

function CalendarPage() {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getReservations();
            setReservations(Array.isArray(data) ? data : []);
        } catch {
            setError(
                'No se pudo cargar el calendario. Melany podrá probar la conexión con el backend.',
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredReservations = useMemo(() => {
        if (!selectedDate) {
            return reservations;
        }

        return reservations.filter(
            (reservation) => reservation.fecha === selectedDate,
        );
    }, [reservations, selectedDate]);

    const formatText = (value) => {
        if (!value) {
            return '-';
        }

        return value
            .toLowerCase()
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <ModulePage
            title="Calendario de reservas"
            description="Consulta las reservas programadas según su fecha y horario."
        >
            <div style={styles.toolbar}>
                <label style={styles.field}>
                    <span>Seleccionar fecha</span>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(event) =>
                            setSelectedDate(event.target.value)
                        }
                        style={styles.input}
                    />
                </label>

                <button
                    type="button"
                    onClick={() => setSelectedDate('')}
                    style={styles.secondaryButton}
                >
                    Mostrar todas
                </button>

                <button
                    type="button"
                    onClick={loadReservations}
                    style={styles.primaryButton}
                >
                    Actualizar
                </button>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {loading && <p>Cargando calendario...</p>}

            {!loading && filteredReservations.length === 0 && (
                <div className="empty-state">
                    No existen reservas para la fecha seleccionada.
                </div>
            )}

            {!loading && filteredReservations.length > 0 && (
                <div style={styles.calendarGrid}>
                    {filteredReservations.map((reservation) => (
                        <article
                            key={reservation.id}
                            style={styles.reservationCard}
                        >
                            <div style={styles.cardHeader}>
                                <strong>
                                    {reservation.fecha}
                                </strong>

                                <span style={styles.status}>
                                    {formatText(reservation.estado)}
                                </span>
                            </div>

                            <h3 style={styles.cardTitle}>
                                {reservation.hora?.substring(0, 5) ||
                                    'Sin hora'}
                                {' - '}
                                {formatText(reservation.tipo)}
                            </h3>

                            <p>
                                <strong>Cliente:</strong>{' '}
                                {reservation.cliente}
                            </p>

                            <p>
                                <strong>Caballo:</strong>{' '}
                                {reservation.horse?.nombre ||
                                    reservation.horse?.name ||
                                    reservation.horse?.id ||
                                    'Sin asignar'}
                            </p>

                            <p>
                                <strong>Cupos:</strong>{' '}
                                {reservation.cuposReservados ?? 0}
                                {' / '}
                                {reservation.cupoMaximo ?? 0}
                            </p>

                            {reservation.observaciones && (
                                <p>
                                    <strong>Observaciones:</strong>{' '}
                                    {reservation.observaciones}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </ModulePage>
    );
}

const styles = {
    toolbar: {
        display: 'flex',
        alignItems: 'end',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '22px',
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        fontWeight: 600,
    },

    input: {
        padding: '10px 12px',
        border: '1px solid #d4ddd8',
        borderRadius: '8px',
        font: 'inherit',
    },

    primaryButton: {
        padding: '10px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#164c3d',
        color: '#ffffff',
        fontWeight: 700,
    },

    secondaryButton: {
        padding: '10px 16px',
        border: '1px solid #b8c6c0',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        color: '#183a31',
        fontWeight: 700,
    },

    errorMessage: {
        marginBottom: '18px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#fff4d6',
        color: '#7b5914',
    },

    calendarGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
    },

    reservationCard: {
        padding: '18px',
        border: '1px solid #dce5e1',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
    },

    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        alignItems: 'center',
    },

    cardTitle: {
        margin: '14px 0',
    },

    status: {
        padding: '5px 9px',
        borderRadius: '20px',
        backgroundColor: '#e7f1ed',
        color: '#164c3d',
        fontSize: '13px',
        fontWeight: 700,
    },
};

export default CalendarPage;