package com.caballeriza.backend.service;

import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;

    public List<InventoryItem> findAll() {
        return inventoryItemRepository.findAll();
    }

    public List<InventoryItem> findLowStock() {
        return inventoryItemRepository.findAll()
                .stream()
                .filter(InventoryItem::isStockBajo)
                .toList();
    }

    public InventoryItem findById(Long id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
    }

    public InventoryItem save(InventoryItem inventoryItem) {
        return inventoryItemRepository.save(inventoryItem);
    }

    public InventoryItem update(Long id, InventoryItem details) {
        InventoryItem item = findById(id);

        item.setNombre(details.getNombre());
        item.setTipo(details.getTipo());
        item.setCantidadActual(details.getCantidadActual());
        item.setStockMinimo(details.getStockMinimo());
        item.setUnidad(details.getUnidad());

        return inventoryItemRepository.save(item);
    }

    public void delete(Long id) {
        InventoryItem item = findById(id);
        inventoryItemRepository.delete(item);
    }
}