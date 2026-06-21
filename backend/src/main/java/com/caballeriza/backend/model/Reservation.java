package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de reserva es obligatorio")
    private TipoReserva tipo;

    @ManyToOne
    @JoinColumn(name = "horse_id")
    private Horse horse;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "La hora es obligatoria")
    private LocalTime hora;

    @NotBlank(message = "El cliente o responsable es obligatorio")
    private String cliente;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estado = EstadoReserva.PROGRAMADA;

    private String observaciones;

    @Min(value = 1, message = "El cupo máximo debe ser mayor a cero")
    private Integer cupoMaximo;

    @Min(value = 0, message = "Los cupos reservados no pueden ser negativos")
    private Integer cuposReservados;
}