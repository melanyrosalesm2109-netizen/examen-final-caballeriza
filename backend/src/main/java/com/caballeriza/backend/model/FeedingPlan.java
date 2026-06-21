package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "feeding_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horse_id")
    @NotNull(message = "El caballo es obligatorio")
    private Horse horse;

    @NotBlank(message = "El tipo de alimento es obligatorio")
    private String tipoAlimento;

    @NotBlank(message = "La cantidad es obligatoria")
    private String cantidad;

    @NotBlank(message = "La frecuencia es obligatoria")
    private String frecuencia;

    private String observaciones;
}