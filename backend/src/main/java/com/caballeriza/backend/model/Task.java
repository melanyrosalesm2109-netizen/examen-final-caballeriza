package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(
            max = 120,
            message = "El título no puede superar los 120 caracteres"
    )
    private String titulo;

    @Size(
            max = 500,
            message = "La descripción no puede superar los 500 caracteres"
    )
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull(message = "El empleado es obligatorio")
    private Employee employee;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El estado es obligatorio")
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = EstadoTarea.PENDIENTE;
        }
    }


}
