package com.caballeriza.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "supply_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horse_id")
    @NotNull(message = "El caballo es obligatorio")
    private Horse horse;

    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    @NotNull(message = "El insumo es obligatorio")
    private InventoryItem inventoryItem;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @DecimalMin(value = "0.1", message = "La cantidad debe ser mayor a cero")
    private Double cantidad;

    private String responsable;

    private String observaciones;
}