package com.caballeriza.backend.service;

import com.caballeriza.backend.model.FeedingPlan;
import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.repository.FeedingPlanRepository;
import com.caballeriza.backend.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedingPlanService {

    private final FeedingPlanRepository feedingPlanRepository;
    private final HorseRepository horseRepository;

    public List<FeedingPlan> findAll() {
        return feedingPlanRepository.findAll();
    }

    public List<FeedingPlan> findByHorseId(Long horseId) {
        return feedingPlanRepository.findByHorseId(horseId);
    }

    public FeedingPlan findById(Long id) {
        return feedingPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan de alimentación no encontrado"));
    }

    public FeedingPlan save(FeedingPlan feedingPlan) {
        if (feedingPlan.getHorse() != null && feedingPlan.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(feedingPlan.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            feedingPlan.setHorse(horse);
        }

        return feedingPlanRepository.save(feedingPlan);
    }

    public FeedingPlan update(Long id, FeedingPlan details) {
        FeedingPlan plan = findById(id);

        plan.setTipoAlimento(details.getTipoAlimento());
        plan.setCantidad(details.getCantidad());
        plan.setFrecuencia(details.getFrecuencia());
        plan.setObservaciones(details.getObservaciones());

        if (details.getHorse() != null && details.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(details.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            plan.setHorse(horse);
        }

        return feedingPlanRepository.save(plan);
    }

    public void delete(Long id) {
        FeedingPlan plan = findById(id);
        feedingPlanRepository.delete(plan);
    }
}