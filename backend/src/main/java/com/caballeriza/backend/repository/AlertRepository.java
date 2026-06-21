package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.Alert;
import com.caballeriza.backend.model.TipoAlerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByLeidaFalse();

    boolean existsByTipoAndReferenciaTipoAndReferenciaId(
            TipoAlerta tipo,
            String referenciaTipo,
            Long referenciaId
    );
}