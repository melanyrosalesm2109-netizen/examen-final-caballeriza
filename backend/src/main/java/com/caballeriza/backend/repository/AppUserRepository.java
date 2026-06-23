package com.caballeriza.backend.repository;

import com.caballeriza.backend.model.AppUser;
import com.caballeriza.backend.model.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByRol(RolUsuario rol);
}