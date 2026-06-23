package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.EstadoReserva;
import com.caballeriza.backend.model.Reservation;
import com.caballeriza.backend.model.TipoReserva;
import com.caballeriza.backend.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public List<Reservation> getAll() {
        return reservationService.findAll();
    }

    @GetMapping("/filter")
    public List<Reservation> filter(
            @RequestParam(required = false)
            TipoReserva tipo,

            @RequestParam(required = false)
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate fecha,

            @RequestParam(required = false)
            EstadoReserva estado
    ) {
        return reservationService.filter(
                tipo,
                fecha,
                estado
        );
    }

    @GetMapping("/{id}")
    public Reservation getById(@PathVariable Long id) {
        return reservationService.findById(id);
    }

    @PostMapping
    public Reservation create(
            @Valid @RequestBody Reservation reservation
    ) {
        return reservationService.save(reservation);
    }

    @PutMapping("/{id}")
    public Reservation update(
            @PathVariable Long id,
            @Valid @RequestBody Reservation reservation
    ) {
        return reservationService.update(id, reservation);
    }

    @PutMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable Long id) {
        return reservationService.cancel(id);
    }

    @PutMapping("/{id}/reserve-slot")
    public Reservation reserveSlot(
            @PathVariable Long id
    ) {
        return reservationService.reserveSlot(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}