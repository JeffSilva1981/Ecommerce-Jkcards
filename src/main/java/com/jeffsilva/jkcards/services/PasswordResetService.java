package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.ForgotPasswordRequestDTO;
import com.jeffsilva.jkcards.dtos.ResetPasswordRequestDTO;
import com.jeffsilva.jkcards.entities.PasswordResetToken;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.repositories.PasswordResetTokenRepository;
import com.jeffsilva.jkcards.repositories.UserRepository;
import com.jeffsilva.jkcards.services.exceptions.InvalidPasswordResetTokenException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final Duration TOKEN_DURATION =
            Duration.ofMinutes(30);

    private static final Duration REQUEST_INTERVAL =
            Duration.ofMinutes(2);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository
            tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository
                    tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequestDTO dto) {
        String normalizedEmail = dto.email().trim().toLowerCase(Locale.ROOT);

        Optional<User> optionalUser = userRepository.findByEmail(normalizedEmail);

        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();
        Instant now = Instant.now();

        Optional<PasswordResetToken> latestToken = tokenRepository.findFirstByUserOrderByCreatedAtDesc(user);

        if (latestToken.isPresent() && latestToken.get().getCreatedAt().plus(REQUEST_INTERVAL).isAfter(now)) {
            return;
        }

        tokenRepository.deleteAllByUser(user);

        String rawToken = generateSecureToken();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setTokenHash(tokenHash);
        resetToken.setCreatedAt(now);
        resetToken.setExpiresAt(
                now.plus(TOKEN_DURATION)
        );
        resetToken.setUser(user);

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(
                user,
                rawToken
        );
    }

    @Transactional
    public void resetPassword(
            ResetPasswordRequestDTO dto
    ) {
        String tokenHash =
                hashToken(dto.token().trim());

        PasswordResetToken resetToken =
                tokenRepository
                        .findByTokenHashAndUsedAtIsNull(
                                tokenHash
                        )
                        .orElseThrow(
                                () ->
                                        new InvalidPasswordResetTokenException(
                                                "Token inválido ou já utilizado"
                                        )
                        );

        if (resetToken.isExpired()) {
            throw new InvalidPasswordResetTokenException(
                    "O link de recuperação expirou"
            );
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        dto.password()
                )
        );

        resetToken.markAsUsed();

        userRepository.save(user);
        tokenRepository.save(resetToken);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];

        secureRandom.nextBytes(bytes);

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash = digest.digest(
                    rawToken.getBytes(
                            StandardCharsets.UTF_8
                    )
            );

            return HexFormat
                    .of()
                    .formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "Não foi possível gerar o hash do token",
                    exception
            );
        }
    }
}