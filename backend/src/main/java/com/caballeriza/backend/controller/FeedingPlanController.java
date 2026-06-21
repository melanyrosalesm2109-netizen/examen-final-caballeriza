package com.caballeriza.backend.controller;

import com.caballeriza.backend.model.FeedingPlan;
import com.caballeriza.backend.service.FeedingPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/feeding-plans")
@RequiredArgsConstructor
public class FeedingPlanController {

    private final FeedingPlanService feedingPlanService;

    @GetMapping
    public List<FeedingPlan> getAll() {
        return feedingPlanService.findAll();
    }

    @GetMapping("/horse/{horseId}")
    public List<FeedingPlan> getByHorseId(@PathVariable Long horseId) {
        return feedingPlanService.findByHorseId(horseId);
    }

    @GetMapping("/{id}")
    public FeedingPlan getById(@PathVariable Long id) {
        return feedingPlanService.findById(id);
    }

    @PostMapping
    public FeedingPlan create(@Valid @RequestBody FeedingPlan feedingPlan) {
        return feedingPlanService.save(feedingPlan);
    }

    @PutMapping("/{id}")
    public FeedingPlan update(@PathVariable Long id, @Valid @RequestBody FeedingPlan feedingPlan) {
        return feedingPlanService.update(id, feedingPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feedingPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }
}