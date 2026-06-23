package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.EstadoTarea;
import com.caballeriza.backend.model.Task;
import com.caballeriza.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> getAll() {
        return taskService.findAll();
    }

    @GetMapping("/filter")
    public List<Task> filter(
            @RequestParam(required = false)
            Long employeeId,

            @RequestParam(required = false)
            EstadoTarea estado,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha
    ) {
        return taskService.filter(
                employeeId,
                estado,
                fecha
        );
    }

    @GetMapping("/employee/{employeeId}")
    public List<Task> getByEmployee(
            @PathVariable Long employeeId
    ) {
        return taskService.findByEmployeeId(employeeId);
    }

    @GetMapping("/{id}")
    public Task getById(
            @PathVariable Long id
    ) {
        return taskService.findById(id);
    }

    @PostMapping
    public Task create(
            @Valid @RequestBody Task task
    ) {
        return taskService.save(task);
    }

    @PutMapping("/{id}")
    public Task update(
            @PathVariable Long id,
            @Valid @RequestBody Task task
    ) {
        return taskService.update(id, task);
    }

    @PutMapping("/{id}/status")
    public Task changeStatus(
            @PathVariable Long id,
            @RequestParam EstadoTarea estado
    ) {
        return taskService.changeStatus(id, estado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
