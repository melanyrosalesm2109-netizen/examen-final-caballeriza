import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import ModulePage from '../components/ModulePage';
import ReservationFilters from '../components/ReservationFilters';
import ReservationForm from '../components/ReservationForm';

import {
  cancelReservation,
  createReservation,
  deleteReservation,
  filterReservations,
  getReservations,
  reserveSlot,
  updateReservation,
} from '../services/reservationService';

const PAGE_SIZE = 5;

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [reservationToEdit, setReservationToEdit] =
      useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [loadingList, setLoadingList] =
      useState(false);

  const [saving, setSaving] =
      useState(false);

  const [filtering, setFiltering] =
      useState(false);

  const [processingId, setProcessingId] =
      useState(null);

  const [error, setError] =
      useState('');

  const [message, setMessage] =
      useState('');

  const totalPages = Math.max(
      1,
      Math.ceil(
          reservations.length / PAGE_SIZE,
      ),
  );

  const startIndex =
      (currentPage - 1) * PAGE_SIZE;

  const endIndex =
      startIndex + PAGE_SIZE;

  const paginatedReservations = useMemo(
      () =>
          reservations.slice(
              startIndex,
              endIndex,
          ),
      [
        reservations,
        startIndex,
        endIndex,
      ],
  );

  const firstVisibleRecord =
      reservations.length === 0
          ? 0
          : startIndex + 1;

  const lastVisibleRecord = Math.min(
      endIndex,
      reservations.length,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const getErrorMessage = (
      requestError,
      defaultMessage,
  ) => {
    const responseData =
        requestError.response?.data;

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (responseData?.message) {
      return responseData.message;
    }

    return defaultMessage;
  };

  const loadReservations = async () => {
    try {
      setLoadingList(true);
      setError('');

      const data = await getReservations();

      setReservations(
          Array.isArray(data) ? data : [],
      );

      setCurrentPage(1);
    } catch (requestError) {
      setReservations([]);
      setCurrentPage(1);

      setError(
          getErrorMessage(
              requestError,
              'No se pudo cargar la lista de reservas.',
          ),
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleSave = async (reservation) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      if (reservationToEdit) {
        await updateReservation(
            reservationToEdit.id,
            reservation,
        );

        setMessage(
            'Reserva actualizada correctamente.',
        );
      } else {
        await createReservation(reservation);

        setMessage(
            'Reserva registrada correctamente.',
        );
      }

      setReservationToEdit(null);

      await loadReservations();

      return true;
    } catch (requestError) {
      setError(
          getErrorMessage(
              requestError,
              reservationToEdit
                  ? 'No se pudo actualizar la reserva.'
                  : 'No se pudo registrar la reserva.',
          ),
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
      setMessage('');

      const data =
          await filterReservations(filters);

      setReservations(
          Array.isArray(data) ? data : [],
      );

      setCurrentPage(1);

      return true;
    } catch (requestError) {
      setReservations([]);
      setCurrentPage(1);

      setError(
          getErrorMessage(
              requestError,
              'No se pudieron aplicar los filtros.',
          ),
      );

      return false;
    } finally {
      setFiltering(false);
    }
  };

  const handleClearFilters = async () => {
    setMessage('');
    setError('');
    setCurrentPage(1);

    await loadReservations();
  };

  const handleEdit = (reservation) => {
    setReservationToEdit(reservation);
    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleReserveSlot = async (
      reservation,
  ) => {
    try {
      setProcessingId(reservation.id);
      setMessage('');
      setError('');

      await reserveSlot(reservation.id);

      setMessage(
          'Cupo reservado correctamente.',
      );

      await loadReservations();
    } catch (requestError) {
      setError(
          getErrorMessage(
              requestError,
              'No se pudo reservar el cupo.',
          ),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (
      reservation,
  ) => {
    const confirmed = window.confirm(
        `¿Deseás cancelar la reserva #${reservation.id}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(reservation.id);
      setMessage('');
      setError('');

      await cancelReservation(reservation.id);

      setMessage(
          'Reserva cancelada correctamente.',
      );

      await loadReservations();
    } catch (requestError) {
      setError(
          getErrorMessage(
              requestError,
              'No se pudo cancelar la reserva.',
          ),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (
      reservation,
  ) => {
    const confirmed = window.confirm(
        `¿Deseás eliminar definitivamente la reserva #${reservation.id}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(reservation.id);
      setMessage('');
      setError('');

      await deleteReservation(reservation.id);

      if (
          reservationToEdit?.id
          === reservation.id
      ) {
        setReservationToEdit(null);
      }

      setMessage(
          'Reserva eliminada correctamente.',
      );

      await loadReservations();
    } catch (requestError) {
      setError(
          getErrorMessage(
              requestError,
              'No se pudo eliminar la reserva.',
          ),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatText = (value) => {
    if (!value) {
      return '-';
    }

    return String(value)
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase(),
        );
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
        Math.max(1, page - 1),
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
        Math.min(
            totalPages,
            page + 1,
        ),
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
            onSave={handleSave}
            loading={saving}
            reservationToEdit={
              reservationToEdit
            }
            onCancelEdit={() =>
                setReservationToEdit(null)}
        />

        <ReservationFilters
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={filtering}
        />

        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              Reservas registradas
            </h2>

            <p style={styles.totalText}>
              Total: {reservations.length}
            </p>
          </div>

          <button
              type="button"
              onClick={loadReservations}
              disabled={loadingList}
              style={{
                ...styles.button,
                opacity: loadingList ? 0.7 : 1,
                cursor: loadingList
                    ? 'not-allowed'
                    : 'pointer',
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

        {!loadingList
            && reservations.length === 0 && (
                <div className="empty-state">
                  No existen reservas para mostrar.
                </div>
            )}

        {!loadingList
            && reservations.length > 0 && (
                <>
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

                        <th style={styles.cell}>
                          Acciones
                        </th>
                      </tr>
                      </thead>

                      <tbody>
                      {paginatedReservations.map(
                          (reservation) => {
                            const isCancelled =
                                reservation.estado
                                === 'CANCELADA';

                            const isCompleted =
                                reservation.estado
                                === 'COMPLETADA';

                            const reservedSlots =
                                Number(
                                    reservation
                                        .cuposReservados
                                    ?? 0,
                                );

                            const maximumSlots =
                                Number(
                                    reservation
                                        .cupoMaximo
                                    ?? 0,
                                );

                            const isFull =
                                maximumSlots > 0
                                && reservedSlots
                                >= maximumSlots;

                            const processing =
                                processingId
                                === reservation.id;

                            return (
                                <tr
                                    key={
                                      reservation.id
                                    }
                                >
                                  <td style={styles.cell}>
                                    {reservation.id}
                                  </td>

                                  <td style={styles.cell}>
                                    {formatText(
                                        reservation.tipo,
                                    )}
                                  </td>

                                  <td style={styles.cell}>
                                    {reservation
                                            .horse?.nombre
                                        || reservation
                                            .horse?.name
                                        || reservation
                                            .horse?.id
                                        || 'Sin asignar'}
                                  </td>

                                  <td style={styles.cell}>
                                    {reservation.fecha
                                        || '-'}
                                  </td>

                                  <td style={styles.cell}>
                                    {reservation.hora
                                            ?.slice(0, 5)
                                        || '-'}
                                  </td>

                                  <td style={styles.cell}>
                                    {reservation.cliente
                                        || '-'}
                                  </td>

                                  <td style={styles.cell}>
                            <span
                                style={{
                                  ...styles.status,
                                  ...(isCancelled
                                      ? styles
                                          .cancelledStatus
                                      : {}),
                                }}
                            >
                              {formatText(
                                  reservation.estado,
                              )}
                            </span>
                                  </td>

                                  <td style={styles.cell}>
                                    {reservedSlots}
                                    {' / '}
                                    {maximumSlots}
                                  </td>

                                  <td style={styles.cell}>
                                    <div
                                        style={
                                          styles.rowActions
                                        }
                                    >
                                      <button
                                          type="button"
                                          onClick={() =>
                                              handleEdit(
                                                  reservation,
                                              )}
                                          disabled={
                                              processing
                                              || isCancelled
                                              || isCompleted
                                          }
                                          style={{
                                            ...styles
                                                .editButton,
                                            ...(processing
                                            || isCancelled
                                            || isCompleted
                                                ? styles
                                                    .disabledButton
                                                : {}),
                                          }}
                                      >
                                        Editar
                                      </button>

                                      <button
                                          type="button"
                                          onClick={() =>
                                              handleReserveSlot(
                                                  reservation,
                                              )}
                                          disabled={
                                              processing
                                              || isCancelled
                                              || isCompleted
                                              || isFull
                                          }
                                          style={{
                                            ...styles
                                                .slotButton,
                                            ...(processing
                                            || isCancelled
                                            || isCompleted
                                            || isFull
                                                ? styles
                                                    .disabledButton
                                                : {}),
                                          }}
                                      >
                                        {isFull
                                            ? 'Sin cupos'
                                            : 'Reservar cupo'}
                                      </button>

                                      <button
                                          type="button"
                                          onClick={() =>
                                              handleCancel(
                                                  reservation,
                                              )}
                                          disabled={
                                              processing
                                              || isCancelled
                                              || isCompleted
                                          }
                                          style={{
                                            ...styles
                                                .cancelButton,
                                            ...(processing
                                            || isCancelled
                                            || isCompleted
                                                ? styles
                                                    .disabledButton
                                                : {}),
                                          }}
                                      >
                                        Cancelar
                                      </button>

                                      <button
                                          type="button"
                                          onClick={() =>
                                              handleDelete(
                                                  reservation,
                                              )}
                                          disabled={
                                            processing
                                          }
                                          style={{
                                            ...styles
                                                .deleteButton,
                                            ...(processing
                                                ? styles
                                                    .disabledButton
                                                : {}),
                                          }}
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                            );
                          },
                      )}
                      </tbody>
                    </table>
                  </div>

                  <div className="pagination">
              <span className="pagination-info">
                Mostrando{' '}
                {firstVisibleRecord}{' '}
                a{' '}
                {lastVisibleRecord}{' '}
                de{' '}
                {reservations.length}
              </span>

                    <div className="pagination-controls">
                      <button
                          type="button"
                          className="pagination-button"
                          onClick={
                            goToPreviousPage
                          }
                          disabled={
                              currentPage === 1
                          }
                      >
                        <ChevronLeft
                            size={17}
                        />
                        Anterior
                      </button>

                      <span className="pagination-page">
                  Página{' '}
                        <strong>
                    {currentPage}
                  </strong>{' '}
                        de{' '}
                        <strong>
                    {totalPages}
                  </strong>
                </span>

                      <button
                          type="button"
                          className="pagination-button"
                          onClick={
                            goToNextPage
                          }
                          disabled={
                              currentPage
                              === totalPages
                          }
                      >
                        Siguiente
                        <ChevronRight
                            size={17}
                        />
                      </button>
                    </div>
                  </div>
                </>
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
    backgroundColor: '#fff0ed',
    color: '#9b382c',
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

  totalText: {
    marginTop: '5px',
    marginBottom: 0,
    color: '#69776f',
    fontSize: '14px',
  },

  button: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#164c3d',
    color: '#ffffff',
    fontWeight: 700,
  },

  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    minWidth: '1250px',
    borderCollapse: 'collapse',
  },

  cell: {
    padding: '12px',
    borderBottom:
        '1px solid #e1e7e4',
    textAlign: 'left',
    verticalAlign: 'top',
  },

  rowActions: {
    display: 'flex',
    gap: '7px',
    flexWrap: 'wrap',
  },

  status: {
    display: 'inline-flex',
    padding: '5px 9px',
    borderRadius: '999px',
    backgroundColor: '#e7f2ed',
    color: '#176047',
    fontSize: '12px',
    fontWeight: 700,
  },

  cancelledStatus: {
    backgroundColor: '#fff0ed',
    color: '#a13b2f',
  },

  editButton: {
    padding: '7px 10px',
    border: '1px solid #b8c6c0',
    borderRadius: '7px',
    backgroundColor: '#ffffff',
    color: '#164c3d',
    fontWeight: 700,
    cursor: 'pointer',
  },

  slotButton: {
    padding: '7px 10px',
    border: 'none',
    borderRadius: '7px',
    backgroundColor: '#dff0e8',
    color: '#176047',
    fontWeight: 700,
    cursor: 'pointer',
  },

  cancelButton: {
    padding: '7px 10px',
    border: 'none',
    borderRadius: '7px',
    backgroundColor: '#fff2d8',
    color: '#825a10',
    fontWeight: 700,
    cursor: 'pointer',
  },

  deleteButton: {
    padding: '7px 10px',
    border: 'none',
    borderRadius: '7px',
    backgroundColor: '#fff0ed',
    color: '#a13b2f',
    fontWeight: 700,
    cursor: 'pointer',
  },

  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default ReservationsPage;