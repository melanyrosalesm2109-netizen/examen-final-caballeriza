package com.caballeriza.backend.dto;

import com.caballeriza.backend.model.RolUsuario;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoleRequest {

    @NotNull(message = "El rol es obligatorio")
    private RolUsuario rol;
}