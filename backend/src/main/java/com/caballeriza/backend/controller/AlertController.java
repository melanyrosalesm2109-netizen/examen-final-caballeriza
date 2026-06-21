package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.Alert;
import com.caballeriza.backend.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public List<Alert> getAll() {
        return alertService.findAll();
    }

    @GetMapping("/unread")
    public List<Alert> getUnread() {
        return alertService.findUnread();
    }

    @PostMapping
    public Alert create(@Valid @RequestBody Alert alert) {
        return alertService.save(alert);
    }

    @PutMapping("/{id}/read")
    public Alert markAsRead(@PathVariable Long id) {
        return alertService.markAsRead(id);
    }

    @PutMapping("/{id}/unread")
    public Alert markAsUnread(@PathVariable Long id) {
        return alertService.markAsUnread(id);
    }

    @PostMapping("/generate-low-stock")
    public List<Alert> generateLowStockAlerts() {
        return alertService.generateLowStockAlerts();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alertService.delete(id);
        return ResponseEntity.noContent().build();
    }
}