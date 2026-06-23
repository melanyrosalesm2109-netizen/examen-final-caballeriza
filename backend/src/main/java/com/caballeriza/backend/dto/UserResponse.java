package com.caballeriza.backend.dto;

import com.caballeriza.backend.model.AppUser;
import com.caballeriza.backend.model.RolUsuario;
import lombok.*;

@Getter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String nombre;
    private String email;
    private RolUsuario rol;
    private Boolean activo;

    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getNombre(),
                user.getEmail(),
                user.getRol(),
                user.getActivo()
        );
    }
}