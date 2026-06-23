package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.WorkShift;
import com.caballeriza.backend.service.WorkShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class WorkShiftController {

    private final WorkShiftService workShiftService;

    @GetMapping
    public List<WorkShift> getAll() {
        return workShiftService.findAll();
    }

    @GetMapping("/{id}")
    public WorkShift getById(@PathVariable Long id) {
        return workShiftService.findById(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<WorkShift> getByEmployee(
            @PathVariable Long employeeId) {
        return workShiftService.findByEmployeeId(employeeId);
    }

    @PostMapping
    public WorkShift create(
            @Valid @RequestBody WorkShift workShift) {
        return workShiftService.save(workShift);
    }

    @PutMapping("/{id}")
    public WorkShift update(
            @PathVariable Long id,
            @Valid @RequestBody WorkShift workShift) {
        return workShiftService.update(id, workShift);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workShiftService.delete(id);
        return ResponseEntity.noContent().build();
    }
}