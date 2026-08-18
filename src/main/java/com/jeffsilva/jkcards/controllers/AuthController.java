package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.dtos.ForgotPasswordRequestDTO;
import com.jeffsilva.jkcards.dtos.LoginRequestDTO;
import com.jeffsilva.jkcards.dtos.LoginResponseDTO;
import com.jeffsilva.jkcards.dtos.PasswordResetResponseDTO;
import com.jeffsilva.jkcards.dtos.RegisterDTO;
import com.jeffsilva.jkcards.dtos.ResetPasswordRequestDTO;
import com.jeffsilva.jkcards.services.AuthService;
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

    private final AuthService authService;
    private final UserService userService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            UserService userService,
            PasswordResetService passwordResetService
    ) {
        this.authService = authService;
        this.userService = userService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterDTO dto) {
        userService.register(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponseDTO> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
        passwordResetService.requestPasswordReset(dto);
        return ResponseEntity.ok(new PasswordResetResponseDTO("If the email is registered, you will receive password reset instructions."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponseDTO> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO dto) {
        passwordResetService.resetPassword(dto);
        return ResponseEntity.ok(new PasswordResetResponseDTO("Password reset successfully."));
    }
}