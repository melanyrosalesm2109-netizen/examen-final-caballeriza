package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employee_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull(message = "El empleado es obligatorio")
    private Employee employee;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @NotNull(message = "La fecha de asignación es obligatoria")
    private LocalDate fechaAsignacion;

    private LocalDate fechaLimite;

    @Enumerated(EnumType.STRING)
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = EstadoTarea.PENDIENTE;
        }
    }
}