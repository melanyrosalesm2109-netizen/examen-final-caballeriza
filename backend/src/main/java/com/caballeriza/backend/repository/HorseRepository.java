package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.Horse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorseRepository extends JpaRepository<Horse, Long> {
}