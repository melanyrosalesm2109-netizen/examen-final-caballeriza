package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.EmployeeTask;
import com.caballeriza.backend.service.EmployeeTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class EmployeeTaskController {

    private final EmployeeTaskService employeeTaskService;

    @GetMapping
    public List<EmployeeTask> getAll() {
        return employeeTaskService.findAll();
    }

    @GetMapping("/{id}")
    public EmployeeTask getById(@PathVariable Long id) {
        return employeeTaskService.findById(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeTask> getByEmployee(
            @PathVariable Long employeeId) {
        return employeeTaskService.findByEmployeeId(employeeId);
    }

    @PostMapping
    public EmployeeTask create(
            @Valid @RequestBody EmployeeTask employeeTask) {
        return employeeTaskService.save(employeeTask);
    }

    @PutMapping("/{id}")
    public EmployeeTask update(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeTask employeeTask) {
        return employeeTaskService.update(id, employeeTask);
    }

    @PutMapping("/{id}/complete")
    public EmployeeTask complete(@PathVariable Long id) {
        return employeeTaskService.complete(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeTaskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}