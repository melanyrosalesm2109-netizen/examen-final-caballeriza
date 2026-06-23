package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.EmployeeTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeTaskRepository
        extends JpaRepository<EmployeeTask, Long> {

    List<EmployeeTask>
    findByEmployeeIdOrderByFechaAsignacionDesc(Long employeeId);
}