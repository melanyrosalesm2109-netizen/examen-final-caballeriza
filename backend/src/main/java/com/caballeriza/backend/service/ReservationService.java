package com.caballeriza.backend.service;

import com.caballeriza.backend.model.EstadoReserva;
import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.Reservation;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public Reservation save(Reservation reservation) {

        if (reservation.getHorse() != null && reservation.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(reservation.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            reservation.setHorse(horse);
        }

        if (reservation.getEstado() == null) {
            reservation.setEstado(EstadoReserva.PROGRAMADA);
        }

        if (reservation.getCuposReservados() == null) {
            reservation.setCuposReservados(0);
        }

        return reservationRepository.save(reservation);
    }

    public Reservation update(Long id, Reservation reservationDetails) {
        Reservation reservation = findById(id);

        reservation.setTipo(reservationDetails.getTipo());
        reservation.setFecha(reservationDetails.getFecha());
        reservation.setHora(reservationDetails.getHora());
        reservation.setCliente(reservationDetails.getCliente());
        reservation.setEstado(reservationDetails.getEstado());
        reservation.setObservaciones(reservationDetails.getObservaciones());
        reservation.setCupoMaximo(reservationDetails.getCupoMaximo());
        reservation.setCuposReservados(reservationDetails.getCuposReservados());

        if (reservationDetails.getHorse() != null && reservationDetails.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(reservationDetails.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            reservation.setHorse(horse);
        }

        return reservationRepository.save(reservation);
    }

    public Reservation cancel(Long id) {
        Reservation reservation = findById(id);
        reservation.setEstado(EstadoReserva.CANCELADA);
        return reservationRepository.save(reservation);
    }

    public void delete(Long id) {
        Reservation reservation = findById(id);
        reservationRepository.delete(reservation);
    }
}