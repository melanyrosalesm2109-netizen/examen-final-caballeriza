package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.model.MedicalHistory;
import com.caballeriza.backend.repository.HorseRepository;
import com.caballeriza.backend.repository.MedicalHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalHistoryService {

    private final MedicalHistoryRepository medicalHistoryRepository;
    private final HorseRepository horseRepository;

    public List<MedicalHistory> findAll() {
        return medicalHistoryRepository.findAll();
    }

    public MedicalHistory findById(Long id) {
        return medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro médico no encontrado"));
    }

    public List<MedicalHistory> findByHorseId(Long horseId) {
        return medicalHistoryRepository.findByHorseId(horseId);
    }

    public MedicalHistory save(MedicalHistory medicalHistory) {
        if (medicalHistory.getHorse() != null && medicalHistory.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(medicalHistory.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            medicalHistory.setHorse(horse);
        }

        return medicalHistoryRepository.save(medicalHistory);
    }

    public MedicalHistory update(Long id, MedicalHistory medicalHistoryDetails) {
        MedicalHistory medicalHistory = findById(id);

        medicalHistory.setTipo(medicalHistoryDetails.getTipo());
        medicalHistory.setDescripcion(medicalHistoryDetails.getDescripcion());
        medicalHistory.setFecha(medicalHistoryDetails.getFecha());
        medicalHistory.setResponsable(medicalHistoryDetails.getResponsable());

        if (medicalHistoryDetails.getHorse() != null && medicalHistoryDetails.getHorse().getId() != null) {
            Horse horse = horseRepository.findById(medicalHistoryDetails.getHorse().getId())
                    .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
            medicalHistory.setHorse(horse);
        }

        return medicalHistoryRepository.save(medicalHistory);
    }

    public void delete(Long id) {
        MedicalHistory medicalHistory = findById(id);
        medicalHistoryRepository.delete(medicalHistory);
    }
}