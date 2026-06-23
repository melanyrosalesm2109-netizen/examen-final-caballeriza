package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.MedicalHistory;
import com.caballeriza.backend.model.TipoHistorialMedico;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.MedicalHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalHistoryService {

    private final MedicalHistoryRepository
            medicalHistoryRepository;

    private final HorseRepository horseRepository;
    private final AlertService alertService;

    @Transactional(readOnly = true)
    public List<MedicalHistory> findAll() {
        return medicalHistoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public MedicalHistory findById(Long id) {
        return medicalHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Registro médico no encontrado"
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<MedicalHistory> findByHorseId(
            Long horseId
    ) {
        return medicalHistoryRepository
                .findByHorseId(horseId);
    }

    @Transactional
    public MedicalHistory save(
            MedicalHistory medicalHistory
    ) {
        medicalHistory.setHorse(
                resolveHorse(medicalHistory)
        );

        validateMedicalDates(medicalHistory);

        MedicalHistory saved =
                medicalHistoryRepository.save(
                        medicalHistory
                );

        alertService.syncMedicalAlert(saved);

        return saved;
    }

    @Transactional
    public MedicalHistory update(
            Long id,
            MedicalHistory details
    ) {
        MedicalHistory medicalHistory =
                findById(id);

        medicalHistory.setHorse(
                resolveHorse(details)
        );

        medicalHistory.setTipo(
                details.getTipo()
        );

        medicalHistory.setDescripcion(
                details.getDescripcion()
        );

        medicalHistory.setFecha(
                details.getFecha()
        );

        medicalHistory.setFechaProxima(
                details.getFechaProxima()
        );

        medicalHistory.setFechaVencimiento(
                details.getFechaVencimiento()
        );

        medicalHistory.setResponsable(
                details.getResponsable()
        );

        validateMedicalDates(medicalHistory);

        MedicalHistory saved =
                medicalHistoryRepository.save(
                        medicalHistory
                );

        alertService.syncMedicalAlert(saved);

        return saved;
    }

    @Transactional
    public void delete(Long id) {
        MedicalHistory medicalHistory =
                findById(id);

        alertService.deleteMedicalAlert(id);
        medicalHistoryRepository.delete(
                medicalHistory
        );
    }

    private Horse resolveHorse(
            MedicalHistory medicalHistory
    ) {
        if (
                medicalHistory.getHorse() == null
                        || medicalHistory
                        .getHorse()
                        .getId() == null
        ) {
            throw new IllegalArgumentException(
                    "Debe seleccionar un caballo"
            );
        }

        return horseRepository.findById(
                        medicalHistory
                                .getHorse()
                                .getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Caballo no encontrado"
                        )
                );
    }

    private void validateMedicalDates(
            MedicalHistory medicalHistory
    ) {
        if (
                medicalHistory.getTipo()
                        == TipoHistorialMedico.VACUNA
        ) {
            medicalHistory.setFechaVencimiento(
                    null
            );

            if (
                    medicalHistory.getFechaProxima()
                            == null
            ) {
                throw new IllegalArgumentException(
                        "La fecha de próxima vacunación es obligatoria"
                );
            }

            validateFutureDate(
                    medicalHistory.getFecha(),
                    medicalHistory.getFechaProxima(),
                    "La próxima vacunación"
            );

            return;
        }

        if (
                medicalHistory.getTipo()
                        == TipoHistorialMedico.TRATAMIENTO
        ) {
            medicalHistory.setFechaProxima(null);

            if (
                    medicalHistory
                            .getFechaVencimiento()
                            == null
            ) {
                throw new IllegalArgumentException(
                        "La fecha de vencimiento del tratamiento es obligatoria"
                );
            }

            validateFutureDate(
                    medicalHistory.getFecha(),
                    medicalHistory
                            .getFechaVencimiento(),
                    "El vencimiento del tratamiento"
            );

            return;
        }

        medicalHistory.setFechaProxima(null);
        medicalHistory.setFechaVencimiento(null);
    }

    private void validateFutureDate(
            LocalDate recordDate,
            LocalDate alertDate,
            String fieldName
    ) {
        if (
                recordDate != null
                        && alertDate.isBefore(
                        recordDate
                )
        ) {
            throw new IllegalArgumentException(
                    fieldName
                            + " no puede ser anterior a la fecha del registro"
            );
        }
    }
}