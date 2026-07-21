package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.ForgotPasswordRequestDTO;
import com.jeffsilva.jkcards.dtos.PasswordResetResponseDTO;
import com.jeffsilva.jkcards.dtos.RegisterDTO;
import com.jeffsilva.jkcards.dtos.ResetPasswordRequestDTO;
import com.jeffsilva.jkcards.services.PasswordResetService;
import com.jeffsilva.jkcards.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordResetService
            passwordResetService;

    public AuthController(
            UserService userService,
            PasswordResetService
                    passwordResetService
    ) {
        this.userService = userService;
        this.passwordResetService =
                passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @Valid
            @RequestBody
            RegisterDTO dto
    ) {
        userService.register(dto);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponseDTO>
    forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequestDTO dto
    ) {
        passwordResetService
                .requestPasswordReset(dto);

        PasswordResetResponseDTO response =
                new PasswordResetResponseDTO(
                        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponseDTO>
    resetPassword(
            @Valid
            @RequestBody
            ResetPasswordRequestDTO dto
    ) {
        passwordResetService
                .resetPassword(dto);

        PasswordResetResponseDTO response =
                new PasswordResetResponseDTO(
                        "Senha redefinida com sucesso."
                );

        return ResponseEntity.ok(response);
    }
}