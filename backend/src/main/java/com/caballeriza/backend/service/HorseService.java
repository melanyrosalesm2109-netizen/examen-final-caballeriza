package com.caballeriza.backend.service;

import com.caballeriza.backend.model.Horse;
import com.caballeriza.backend.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorseService {

    private final HorseRepository horseRepository;

    public List<Horse> findAll() {
        return horseRepository.findAll();
    }

    public Horse findById(Long id) {
        return horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caballo no encontrado"));
    }

    public Horse save(Horse horse) {
        return horseRepository.save(horse);
    }

    public Horse update(Long id, Horse horseDetails) {
        Horse horse = findById(id);

        horse.setNombre(horseDetails.getNombre());
        horse.setIdentificador(horseDetails.getIdentificador());
        horse.setEdad(horseDetails.getEdad());
        horse.setRaza(horseDetails.getRaza());
        horse.setSexo(horseDetails.getSexo());
        horse.setPeso(horseDetails.getPeso());
        horse.setFotoUrl(horseDetails.getFotoUrl());

        return horseRepository.save(horse);
    }

    public void delete(Long id) {
        Horse horse = findById(id);
        horseRepository.delete(horse);
    }
}