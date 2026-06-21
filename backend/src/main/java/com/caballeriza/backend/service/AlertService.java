package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Alert;
import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.model.TipoAlerta;
import com.caballeriza.backend.repository.AlertRepository;
import com.caballeriza.backend.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public List<Alert> findAll() {
        return alertRepository.findAll();
    }

    public List<Alert> findUnread() {
        return alertRepository.findByLeidaFalse();
    }

    public Alert findById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
    }

    public Alert save(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert markAsRead(Long id) {
        Alert alert = findById(id);
        alert.setLeida(true);
        return alertRepository.save(alert);
    }

    public Alert markAsUnread(Long id) {
        Alert alert = findById(id);
        alert.setLeida(false);
        return alertRepository.save(alert);
    }

    public List<Alert> generateLowStockAlerts() {
        List<InventoryItem> lowStockItems = inventoryItemRepository.findAll()
                .stream()
                .filter(InventoryItem::isStockBajo)
                .toList();

        for (InventoryItem item : lowStockItems) {
            boolean exists = alertRepository.existsByTipoAndReferenciaTipoAndReferenciaId(
                    TipoAlerta.STOCK_BAJO,
                    "INVENTORY_ITEM",
                    item.getId()
            );

            if (!exists) {
                Alert alert = Alert.builder()
                        .tipo(TipoAlerta.STOCK_BAJO)
                        .titulo("Stock bajo: " + item.getNombre())
                        .mensaje("El insumo " + item.getNombre()
                                + " tiene stock bajo. Cantidad actual: "
                                + item.getCantidadActual() + " " + item.getUnidad()
                                + ". Stock mínimo: " + item.getStockMinimo() + " " + item.getUnidad() + ".")
                        .leida(false)
                        .referenciaTipo("INVENTORY_ITEM")
                        .referenciaId(item.getId())
                        .build();

                alertRepository.save(alert);
            }
        }

        return alertRepository.findAll();
    }

    public void delete(Long id) {
        Alert alert = findById(id);
        alertRepository.delete(alert);
    }
}