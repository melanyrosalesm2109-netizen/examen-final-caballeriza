package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.model.SupplyRecord;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.InventoryItemRepository;
import com.caballeriza.backend.repository.SupplyRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
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
                .orElseThrow(() -> new RuntimeException("Registro de suministro no encontrado"));
    }

    public SupplyRecord save(SupplyRecord supplyRecord) {
        if (supplyRecord.getHorse() != null && supplyRecord.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(supplyRecord.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            supplyRecord.setHorse(horse);
        }

        if (supplyRecord.getInventoryItem() != null && supplyRecord.getInventoryItem().getId() != null) {
            InventoryItem item = inventoryItemRepository.findById(supplyRecord.getInventoryItem().getId())
                    .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
            supplyRecord.setInventoryItem(item);
        }

        return supplyRecordRepository.save(supplyRecord);
    }

    public SupplyRecord update(Long id, SupplyRecord details) {
        SupplyRecord record = findById(id);

        record.setFecha(details.getFecha());
        record.setCantidad(details.getCantidad());
        record.setResponsable(details.getResponsable());
        record.setObservaciones(details.getObservaciones());

        if (details.getHorse() != null && details.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(details.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            record.setHorse(horse);
        }

        if (details.getInventoryItem() != null && details.getInventoryItem().getId() != null) {
            InventoryItem item = inventoryItemRepository.findById(details.getInventoryItem().getId())
                    .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
            record.setInventoryItem(item);
        }

        return supplyRecordRepository.save(record);
    }

    public void delete(Long id) {
        SupplyRecord record = findById(id);
        supplyRecordRepository.delete(record);
    }
}