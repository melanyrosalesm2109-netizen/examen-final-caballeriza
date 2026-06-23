package com.caballeriza.backend.dto;

import com.caballeriza.backend.model.AppUser;
import com.caballeriza.backend.model.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tipo;
    private Long id;
    private String nombre;
    private String email;
    private RolUsuario rol;

    public static AuthResponse from(AppUser user, String token) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getNombre(),
                user.getEmail(),
                user.getRol()
        );
    }
}