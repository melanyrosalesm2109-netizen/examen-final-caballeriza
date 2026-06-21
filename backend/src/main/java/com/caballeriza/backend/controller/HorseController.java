package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.service.HorseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/horses")
@RequiredArgsConstructor
public class HorseController {

    private final HorseService horseService;

    @GetMapping
    public List<Horse> getAll() {
        return horseService.findAll();
    }

    @GetMapping("/{id}")
    public Horse getById(@PathVariable Long id) {
        return horseService.findById(id);
    }

    @PostMapping
    public Horse create(@Valid @RequestBody Horse horse) {
        return horseService.save(horse);
    }

    @PutMapping("/{id}")
    public Horse update(@PathVariable Long id, @Valid @RequestBody Horse horse) {
        return horseService.update(id, horse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        horseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}