package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medical_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horse_id")
    @NotNull(message = "El caballo es obligatorio")
    private Horse horse;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de historial es obligatorio")
    private TipoHistorialMedico tipo;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(length = 1000)
    private String descripcion;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    /*
     * Se utiliza cuando el registro es una vacuna.
     * Permitirá generar una alerta automática.
     */
    private LocalDate fechaProxima;

    /*
     * Se utiliza cuando el registro es un tratamiento.
     * Permitirá avisar cuándo vence.
     */
    private LocalDate fechaVencimiento;

    @NotBlank(message = "El responsable es obligatorio")
    private String responsable;
}