package com.jeffsilva.jkcards.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO(@NotBlank(message = "O token é obrigatório") String token,
                                      @NotBlank(message = "A nova senha é obrigatória")
                                      @Size(min = 8, max = 72, message = "A senha deve possuir entre 8 e 72 caracteres") String password) {}