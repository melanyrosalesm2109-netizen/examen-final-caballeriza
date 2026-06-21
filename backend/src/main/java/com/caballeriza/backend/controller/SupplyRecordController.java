package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.SupplyRecord;
import com.caballeriza.backend.service.SupplyRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/supply-records")
@RequiredArgsConstructor
public class SupplyRecordController {

    private final SupplyRecordService supplyRecordService;

    @GetMapping
    public List<SupplyRecord> getAll() {
        return supplyRecordService.findAll();
    }

    @GetMapping("/horse/{horseId}")
    public List<SupplyRecord> getByHorseId(@PathVariable Long horseId) {
        return supplyRecordService.findByHorseId(horseId);
    }

    @GetMapping("/{id}")
    public SupplyRecord getById(@PathVariable Long id) {
        return supplyRecordService.findById(id);
    }

    @PostMapping
    public SupplyRecord create(@Valid @RequestBody SupplyRecord supplyRecord) {
        return supplyRecordService.save(supplyRecord);
    }

    @PutMapping("/{id}")
    public SupplyRecord update(@PathVariable Long id, @Valid @RequestBody SupplyRecord supplyRecord) {
        return supplyRecordService.update(id, supplyRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplyRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }
}