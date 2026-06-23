package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.EstadoReserva;
import com.caballeriza.backend.model.Reservation;
import com.caballeriza.backend.model.TipoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    @Query("""
            SELECT r
            FROM Reservation r
            WHERE (:tipo IS NULL OR r.tipo = :tipo)
              AND (:fecha IS NULL OR r.fecha = :fecha)
              AND (:estado IS NULL OR r.estado = :estado)
            ORDER BY r.fecha ASC, r.hora ASC
            """)
    List<Reservation> findWithFilters(
            @Param("tipo") TipoReserva tipo,
            @Param("fecha") LocalDate fecha,
            @Param("estado") EstadoReserva estado
    );
}