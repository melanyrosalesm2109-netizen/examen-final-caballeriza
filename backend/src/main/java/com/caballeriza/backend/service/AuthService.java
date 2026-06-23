package com.caballeriza.backend.service;

import com.caballeriza.backend.dto.*;
import com.caballeriza.backend.model.*;
import com.caballeriza.backend.repository.AppUserRepository;
import com.caballeriza.backend.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "Ya existe un usuario con ese correo"
            );
        }

        /*
         * El primer usuario registrado será administrador.
         * Los siguientes se registrarán como clientes.
         */
        RolUsuario rol = appUserRepository.count() == 0
                ? RolUsuario.ADMINISTRADOR
                : RolUsuario.CLIENTE;

        AppUser user = AppUser.builder()
                .nombre(request.getNombre().trim())
                .email(email)
                .password(passwordEncoder.encode(
                        request.getPassword()
                ))
                .rol(rol)
                .activo(true)
                .build();

        AppUser savedUser = appUserRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        savedUser.getEmail()
                );

        String token = jwtService.generateToken(userDetails);

        return AuthResponse.from(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        AppUser user = appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuario no encontrado"
                ));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(email);

        String token = jwtService.generateToken(userDetails);

        return AuthResponse.from(user, token);
    }
}