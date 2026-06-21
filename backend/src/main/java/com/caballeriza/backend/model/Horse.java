package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "horses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Horse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El identificador es obligatorio")
    @Column(unique = true)
    private String identificador;

    @Min(value = 0, message = "La edad no puede ser negativa")
    private Integer edad;

    @NotBlank(message = "La raza es obligatoria")
    private String raza;

    @Enumerated(EnumType.STRING)
    private SexoCaballo sexo;

    @DecimalMin(value = "0.0", message = "El peso no puede ser negativo")
    private Double peso;

    private String fotoUrl;
}