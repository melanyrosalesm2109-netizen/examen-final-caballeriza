package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    List<MedicalHistory> findByHorseId(Long horseId);
}