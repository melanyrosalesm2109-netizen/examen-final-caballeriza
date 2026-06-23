package com.caballeriza.backend.service;

import com.caballeriza.backend.model.EstadoReserva;
import com.caballeriza.backend.model.Reservation;
import com.caballeriza.backend.model.TipoReserva;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private HorseRepository horseRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void debeReservarUnCupoEnUnPaseo() {
        Reservation reservation = Reservation.builder()
                .id(1L)
                .tipo(TipoReserva.PASEO)
                .estado(EstadoReserva.PROGRAMADA)
                .cupoMaximo(3)
                .cuposReservados(1)
                .build();

        when(reservationRepository.findById(1L))
                .thenReturn(Optional.of(reservation));

        when(reservationRepository.save(reservation))
                .thenReturn(reservation);

        Reservation result =
                reservationService.reserveSlot(1L);

        assertEquals(2, result.getCuposReservados());

        verify(reservationRepository)
                .save(reservation);
    }

    @Test
    void debeRechazarReservaCuandoPaseoEstaLleno() {
        Reservation reservation = Reservation.builder()
                .id(2L)
                .tipo(TipoReserva.PASEO)
                .estado(EstadoReserva.PROGRAMADA)
                .cupoMaximo(2)
                .cuposReservados(2)
                .build();

        when(reservationRepository.findById(2L))
                .thenReturn(Optional.of(reservation));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> reservationService.reserveSlot(2L)
                );

        assertEquals(
                "El paseo ya está lleno",
                exception.getMessage()
        );

        verify(reservationRepository, never())
                .save(any(Reservation.class));
    }

    @Test
    void debeRechazarControlDeCuposEnTipoDistintoAPaseo() {
        Reservation reservation = Reservation.builder()
                .id(3L)
                .tipo(TipoReserva.VETERINARIO)
                .estado(EstadoReserva.PROGRAMADA)
                .cupoMaximo(1)
                .cuposReservados(0)
                .build();

        when(reservationRepository.findById(3L))
                .thenReturn(Optional.of(reservation));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> reservationService.reserveSlot(3L)
                );

        assertEquals(
                "El control de cupos solo aplica para paseos",
                exception.getMessage()
        );

        verify(reservationRepository, never())
                .save(any(Reservation.class));
    }

    @Test
    void debeCancelarReservaProgramada() {
        Reservation reservation = Reservation.builder()
                .id(4L)
                .tipo(TipoReserva.PASEO)
                .estado(EstadoReserva.PROGRAMADA)
                .cupoMaximo(5)
                .cuposReservados(1)
                .build();

        when(reservationRepository.findById(4L))
                .thenReturn(Optional.of(reservation));

        when(reservationRepository.save(reservation))
                .thenReturn(reservation);

        Reservation result =
                reservationService.cancel(4L);

        assertEquals(
                EstadoReserva.CANCELADA,
                result.getEstado()
        );
    }

    @Test
    void debeRechazarCancelacionDeReservaCompletada() {
        Reservation reservation = Reservation.builder()
                .id(5L)
                .tipo(TipoReserva.PASEO)
                .estado(EstadoReserva.COMPLETADA)
                .cupoMaximo(5)
                .cuposReservados(1)
                .build();

        when(reservationRepository.findById(5L))
                .thenReturn(Optional.of(reservation));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> reservationService.cancel(5L)
                );

        assertEquals(
                "No se puede cancelar una reserva completada",
                exception.getMessage()
        );

        verify(reservationRepository, never())
                .save(any(Reservation.class));
    }
}