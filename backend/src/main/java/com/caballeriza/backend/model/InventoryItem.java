package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del insumo es obligatorio")
    private String nombre;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de insumo es obligatorio")
    private TipoInsumo tipo;

    @DecimalMin(value = "0.0", message = "La cantidad actual no puede ser negativa")
    private Double cantidadActual;

    @DecimalMin(value = "0.0", message = "El stock mínimo no puede ser negativo")
    private Double stockMinimo;

    @NotBlank(message = "La unidad es obligatoria")
    private String unidad;

    public boolean isStockBajo() {
        if (cantidadActual == null || stockMinimo == null) {
            return false;
        }
        return cantidadActual <= stockMinimo;
    }
}