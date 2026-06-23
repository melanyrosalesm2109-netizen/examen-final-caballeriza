package com.caballeriza.backend.service;

import com.caballeriza.backend.model.EstadoReserva;
import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.Reservation;
import com.caballeriza.backend.model.TipoReserva;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final HorseRepository horseRepository;

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Reserva no encontrada"
                        ));
    }

    public List<Reservation> filter(
            TipoReserva tipo,
            LocalDate fecha,
            EstadoReserva estado
    ) {
        return reservationRepository.findWithFilters(
                tipo,
                fecha,
                estado
        );
    }

    public Reservation save(Reservation reservation) {
        reservation.setHorse(resolveHorse(reservation));

        if (reservation.getEstado() == null) {
            reservation.setEstado(EstadoReserva.PROGRAMADA);
        }

        if (reservation.getCuposReservados() == null) {
            reservation.setCuposReservados(0);
        }

        validateCapacity(reservation);

        return reservationRepository.save(reservation);
    }

    public Reservation update(
            Long id,
            Reservation details
    ) {
        Reservation reservation = findById(id);

        reservation.setTipo(details.getTipo());
        reservation.setFecha(details.getFecha());
        reservation.setHora(details.getHora());
        reservation.setCliente(details.getCliente());
        reservation.setObservaciones(
                details.getObservaciones()
        );
        reservation.setCupoMaximo(
                details.getCupoMaximo()
        );
        reservation.setCuposReservados(
                details.getCuposReservados() == null
                        ? 0
                        : details.getCuposReservados()
        );

        if (details.getEstado() != null) {
            reservation.setEstado(details.getEstado());
        }

        if (details.getHorse() != null
                && details.getHorse().getId() != null) {
            reservation.setHorse(resolveHorse(details));
        }

        validateCapacity(reservation);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation cancel(Long id) {
        Reservation reservation = findById(id);

        if (reservation.getEstado()
                == EstadoReserva.COMPLETADA) {
            throw new IllegalArgumentException(
                    "No se puede cancelar una reserva completada"
            );
        }

        reservation.setEstado(EstadoReserva.CANCELADA);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation reserveSlot(Long id) {
        Reservation reservation = findById(id);

        if (reservation.getTipo() != TipoReserva.PASEO) {
            throw new IllegalArgumentException(
                    "El control de cupos solo aplica para paseos"
            );
        }

        if (reservation.getEstado()
                == EstadoReserva.CANCELADA) {
            throw new IllegalArgumentException(
                    "No se puede reservar en un paseo cancelado"
            );
        }

        if (reservation.getEstado()
                == EstadoReserva.COMPLETADA) {
            throw new IllegalArgumentException(
                    "El paseo ya fue completado"
            );
        }

        Integer cupoMaximo = reservation.getCupoMaximo();

        if (cupoMaximo == null || cupoMaximo < 1) {
            throw new IllegalArgumentException(
                    "El paseo no tiene un cupo máximo válido"
            );
        }

        int cuposReservados =
                reservation.getCuposReservados() == null
                        ? 0
                        : reservation.getCuposReservados();

        if (cuposReservados >= cupoMaximo) {
            throw new IllegalArgumentException(
                    "El paseo ya está lleno"
            );
        }

        reservation.setCuposReservados(
                cuposReservados + 1
        );

        return reservationRepository.save(reservation);
    }

    public void delete(Long id) {
        reservationRepository.delete(findById(id));
    }

    private Horse resolveHorse(Reservation reservation) {
        if (reservation.getHorse() == null
                || reservation.getHorse().getId() == null) {
            return null;
        }

        return horseRepository
                .findById(reservation.getHorse().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Caballo no encontrado"
                        ));
    }

    private void validateCapacity(
            Reservation reservation
    ) {
        int cuposReservados =
                reservation.getCuposReservados() == null
                        ? 0
                        : reservation.getCuposReservados();

        if (cuposReservados < 0) {
            throw new IllegalArgumentException(
                    "Los cupos reservados no pueden ser negativos"
            );
        }

        if (reservation.getTipo() == TipoReserva.PASEO) {
            Integer cupoMaximo =
                    reservation.getCupoMaximo();

            if (cupoMaximo == null || cupoMaximo < 1) {
                throw new IllegalArgumentException(
                        "El paseo debe tener un cupo máximo mayor a cero"
                );
            }

            if (cuposReservados > cupoMaximo) {
                throw new IllegalArgumentException(
                        "Los cupos reservados no pueden superar el máximo"
                );
            }
        }
    }
}