package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.model.SupplyRecord;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.InventoryItemRepository;
import com.caballeriza.backend.repository.SupplyRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplyRecordService {

    private final SupplyRecordRepository supplyRecordRepository;
    private final HorseRepository horseRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public List<SupplyRecord> findAll() {
        return supplyRecordRepository.findAll();
    }

    public List<SupplyRecord> findByHorseId(Long horseId) {
        return supplyRecordRepository.findByHorseId(horseId);
    }

    public SupplyRecord findById(Long id) {
        return supplyRecordRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Registro de suministro no encontrado"
                        )
                );
    }

    public SupplyRecord save(SupplyRecord supplyRecord) {
        Horse horse = obtenerCaballo(supplyRecord);
        InventoryItem inventoryItem =
                obtenerInsumo(supplyRecord);

        double cantidad = validarCantidad(
                supplyRecord.getCantidad()
        );

        double stockActual = obtenerStockActual(
                inventoryItem
        );

        if (cantidad > stockActual) {
            throw new RuntimeException(
                    "No hay suficiente stock disponible. "
                            + "Stock actual: "
                            + stockActual
                            + " "
                            + inventoryItem.getUnidad()
            );
        }

        inventoryItem.setCantidadActual(
                stockActual - cantidad
        );

        inventoryItemRepository.save(inventoryItem);

        supplyRecord.setHorse(horse);
        supplyRecord.setInventoryItem(inventoryItem);

        return supplyRecordRepository.save(supplyRecord);
    }

    public SupplyRecord update(
            Long id,
            SupplyRecord details
    ) {
        SupplyRecord record = findById(id);

        Horse horse = obtenerCaballo(details);
        InventoryItem newInventoryItem =
                obtenerInsumo(details);

        InventoryItem oldInventoryItem =
                record.getInventoryItem();

        double oldQuantity =
                record.getCantidad() == null
                        ? 0.0
                        : record.getCantidad();

        double newQuantity =
                validarCantidad(details.getCantidad());

        boolean sameInventoryItem =
                oldInventoryItem != null
                        && Objects.equals(
                        oldInventoryItem.getId(),
                        newInventoryItem.getId()
                );

        if (sameInventoryItem) {
            double availableStock =
                    obtenerStockActual(oldInventoryItem)
                            + oldQuantity;

            if (newQuantity > availableStock) {
                throw new RuntimeException(
                        "No hay suficiente stock disponible. "
                                + "Stock disponible: "
                                + availableStock
                                + " "
                                + oldInventoryItem.getUnidad()
                );
            }

            oldInventoryItem.setCantidadActual(
                    availableStock - newQuantity
            );

            inventoryItemRepository.save(
                    oldInventoryItem
            );

            newInventoryItem = oldInventoryItem;
        } else {
            if (oldInventoryItem != null) {
                oldInventoryItem.setCantidadActual(
                        obtenerStockActual(
                                oldInventoryItem
                        ) + oldQuantity
                );

                inventoryItemRepository.save(
                        oldInventoryItem
                );
            }

            double newItemStock =
                    obtenerStockActual(newInventoryItem);

            if (newQuantity > newItemStock) {
                throw new RuntimeException(
                        "No hay suficiente stock disponible. "
                                + "Stock actual: "
                                + newItemStock
                                + " "
                                + newInventoryItem.getUnidad()
                );
            }

            newInventoryItem.setCantidadActual(
                    newItemStock - newQuantity
            );

            inventoryItemRepository.save(
                    newInventoryItem
            );
        }

        record.setHorse(horse);
        record.setInventoryItem(newInventoryItem);
        record.setFecha(details.getFecha());
        record.setCantidad(newQuantity);
        record.setResponsable(
                details.getResponsable()
        );
        record.setObservaciones(
                details.getObservaciones()
        );

        return supplyRecordRepository.save(record);
    }

    public void delete(Long id) {
        SupplyRecord record = findById(id);

        InventoryItem inventoryItem =
                record.getInventoryItem();

        if (
                inventoryItem != null
                        && record.getCantidad() != null
        ) {
            double restoredStock =
                    obtenerStockActual(inventoryItem)
                            + record.getCantidad();

            inventoryItem.setCantidadActual(
                    restoredStock
            );

            inventoryItemRepository.save(
                    inventoryItem
            );
        }

        supplyRecordRepository.delete(record);
    }

    private Horse obtenerCaballo(
            SupplyRecord supplyRecord
    ) {
        if (
                supplyRecord.getHorse() == null
                        || supplyRecord
                        .getHorse()
                        .getId() == null
        ) {
            throw new RuntimeException(
                    "El caballo es obligatorio"
            );
        }

        return horseRepository.findById(
                        supplyRecord
                                .getHorse()
                                .getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Caballo no encontrado"
                        )
                );
    }

    private InventoryItem obtenerInsumo(
            SupplyRecord supplyRecord
    ) {
        if (
                supplyRecord.getInventoryItem() == null
                        || supplyRecord
                        .getInventoryItem()
                        .getId() == null
        ) {
            throw new RuntimeException(
                    "El insumo es obligatorio"
            );
        }

        return inventoryItemRepository.findById(
                        supplyRecord
                                .getInventoryItem()
                                .getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Insumo no encontrado"
                        )
                );
    }

    private double validarCantidad(Double cantidad) {
        if (cantidad == null || cantidad < 0.1) {
            throw new RuntimeException(
                    "La cantidad debe ser mayor a cero"
            );
        }

        return cantidad;
    }

    private double obtenerStockActual(
            InventoryItem inventoryItem
    ) {
        return inventoryItem.getCantidadActual() == null
                ? 0.0
                : inventoryItem.getCantidadActual();
    }
}