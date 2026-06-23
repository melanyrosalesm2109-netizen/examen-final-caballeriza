package com.caballeriza.backend.service;

import com.caballeriza.backend.dto.AuthResponse;
import com.caballeriza.backend.dto.RegisterRequest;
import com.caballeriza.backend.model.AppUser;
import com.caballeriza.backend.model.RolUsuario;
import com.caballeriza.backend.repository.AppUserRepository;
import com.caballeriza.backend.security.CustomUserDetailsService;
import com.caballeriza.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void debeRegistrarPrimerUsuarioComoAdministrador() {
        RegisterRequest request = new RegisterRequest(
                "Melany Rosales",
                "ADMIN@CABALLERIZA.COM",
                "123456"
        );

        UserDetails userDetails = mock(UserDetails.class);

        when(appUserRepository.existsByEmailIgnoreCase(
                "admin@caballeriza.com"
        )).thenReturn(false);

        when(appUserRepository.count()).thenReturn(0L);

        when(passwordEncoder.encode("123456"))
                .thenReturn("password-codificada");

        when(appUserRepository.save(any(AppUser.class)))
                .thenAnswer(invocation -> {
                    AppUser user = invocation.getArgument(0);
                    user.setId(1L);
                    return user;
                });

        when(userDetailsService.loadUserByUsername(
                "admin@caballeriza.com"
        )).thenReturn(userDetails);

        when(jwtService.generateToken(userDetails))
                .thenReturn("token-prueba");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("token-prueba", response.getToken());
        assertEquals("Melany Rosales", response.getNombre());
        assertEquals(
                "admin@caballeriza.com",
                response.getEmail()
        );
        assertEquals(
                RolUsuario.ADMINISTRADOR,
                response.getRol()
        );

        ArgumentCaptor<AppUser> captor =
                ArgumentCaptor.forClass(AppUser.class);

        verify(appUserRepository).save(captor.capture());

        AppUser savedUser = captor.getValue();

        assertEquals(
                "admin@caballeriza.com",
                savedUser.getEmail()
        );
        assertEquals(
                "password-codificada",
                savedUser.getPassword()
        );
        assertEquals(
                RolUsuario.ADMINISTRADOR,
                savedUser.getRol()
        );
        assertTrue(savedUser.getActivo());
    }

    @Test
    void debeRechazarCorreoDuplicado() {
        RegisterRequest request = new RegisterRequest(
                "Usuario repetido",
                "usuario@correo.com",
                "123456"
        );

        when(appUserRepository.existsByEmailIgnoreCase(
                "usuario@correo.com"
        )).thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> authService.register(request)
                );

        assertEquals(
                "Ya existe un usuario con ese correo",
                exception.getMessage()
        );

        verify(appUserRepository, never())
                .save(any(AppUser.class));

        verify(passwordEncoder, never())
                .encode(anyString());
    }
}