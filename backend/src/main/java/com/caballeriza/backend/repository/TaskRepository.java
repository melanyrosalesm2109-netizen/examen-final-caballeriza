package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.EstadoTarea;
import com.caballeriza.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {


    List<Task> findByEmployeeIdOrderByFechaAsc(Long employeeId);

    @Query("""
        SELECT t
        FROM Task t
        WHERE (:employeeId IS NULL OR t.employee.id = :employeeId)
          AND (:estado IS NULL OR t.estado = :estado)
          AND (:fecha IS NULL OR t.fecha = :fecha)
        ORDER BY t.fecha ASC
        """)
    List<Task> findWithFilters(
            @Param("employeeId") Long employeeId,
            @Param("estado") EstadoTarea estado,
            @Param("fecha") LocalDate fecha
    );


}
