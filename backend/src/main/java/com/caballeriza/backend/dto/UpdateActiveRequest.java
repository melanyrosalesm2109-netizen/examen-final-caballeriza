package com.caballeriza.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateActiveRequest {

    @NotNull(message = "El estado es obligatorio")
    private Boolean activo;
}