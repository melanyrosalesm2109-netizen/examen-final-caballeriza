package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.FeedingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedingPlanRepository extends JpaRepository<FeedingPlan, Long> {

    List<FeedingPlan> findByHorseId(Long horseId);
}