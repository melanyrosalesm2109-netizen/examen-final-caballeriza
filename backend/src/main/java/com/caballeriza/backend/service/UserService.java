package com.caballeriza.backend.service;

import com.caballeriza.backend.dto.UserResponse;
import com.caballeriza.backend.model.*;
import com.caballeriza.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AppUserRepository appUserRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return appUserRepository
                .findAll(Sort.by("nombre").ascending())
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return UserResponse.from(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email) {
        AppUser user = appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado"
                ));

        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateRole(
            Long id,
            RolUsuario rol
    ) {
        AppUser user = findEntityById(id);
        user.setRol(rol);

        return UserResponse.from(
                appUserRepository.save(user)
        );
    }

    @Transactional
    public UserResponse updateActive(
            Long id,
            Boolean activo
    ) {
        AppUser user = findEntityById(id);
        user.setActivo(activo);

        return UserResponse.from(
                appUserRepository.save(user)
        );
    }

    @Transactional
    public void delete(Long id) {
        AppUser user = findEntityById(id);
        appUserRepository.delete(user);
    }

    private AppUser findEntityById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado"
                ));
    }
}