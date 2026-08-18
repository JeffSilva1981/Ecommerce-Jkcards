package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.LoginRequestDTO;
import com.jeffsilva.jkcards.dtos.LoginResponseDTO;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.services.exceptions.ForbiddenException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.authenticationManager =
                authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(dto.email(), dto.password());
        Authentication authenticatedUser = authenticationManager.authenticate(authenticationRequest);
        return jwtService.generateToken(authenticatedUser);
    }

    public void validateSelfOrdAdmin(Long userId) {
        User me = userService.authenticated();

        if (!me.hasRole("ROLE_ADMIN")
                && !me.getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
    }
}