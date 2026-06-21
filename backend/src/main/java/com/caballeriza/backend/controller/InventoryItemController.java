package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.InventoryItem;
import com.caballeriza.backend.service.InventoryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @GetMapping
    public List<InventoryItem> getAll() {
        return inventoryItemService.findAll();
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStock() {
        return inventoryItemService.findLowStock();
    }

    @GetMapping("/{id}")
    public InventoryItem getById(@PathVariable Long id) {
        return inventoryItemService.findById(id);
    }

    @PostMapping
    public InventoryItem create(@Valid @RequestBody InventoryItem inventoryItem) {
        return inventoryItemService.save(inventoryItem);
    }

    @PutMapping("/{id}")
    public InventoryItem update(@PathVariable Long id, @Valid @RequestBody InventoryItem inventoryItem) {
        return inventoryItemService.update(id, inventoryItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}