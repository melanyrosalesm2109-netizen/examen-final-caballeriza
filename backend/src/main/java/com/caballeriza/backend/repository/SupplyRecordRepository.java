package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.SupplyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplyRecordRepository extends JpaRepository<SupplyRecord, Long> {

    List<SupplyRecord> findByHorseId(Long horseId);
}