package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.WorkShift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkShiftRepository extends JpaRepository<WorkShift, Long> {

    List<WorkShift> findByEmployeeIdOrderByFechaDesc(Long employeeId);
}