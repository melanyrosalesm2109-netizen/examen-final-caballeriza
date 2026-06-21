package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.MedicalHistory;
import com.caballeriza.backend.service.MedicalHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/medical-history")
@RequiredArgsConstructor
public class MedicalHistoryController {

    private final MedicalHistoryService medicalHistoryService;

    @GetMapping
    public List<MedicalHistory> getAll() {
        return medicalHistoryService.findAll();
    }

    @GetMapping("/{id}")
    public MedicalHistory getById(@PathVariable Long id) {
        return medicalHistoryService.findById(id);
    }

    @GetMapping("/horse/{horseId}")
    public List<MedicalHistory> getByHorseId(@PathVariable Long horseId) {
        return medicalHistoryService.findByHorseId(horseId);
    }

    @PostMapping
    public MedicalHistory create(@Valid @RequestBody MedicalHistory medicalHistory) {
        return medicalHistoryService.save(medicalHistory);
    }

    @PutMapping("/{id}")
    public MedicalHistory update(@PathVariable Long id, @Valid @RequestBody MedicalHistory medicalHistory) {
        return medicalHistoryService.update(id, medicalHistory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicalHistoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}