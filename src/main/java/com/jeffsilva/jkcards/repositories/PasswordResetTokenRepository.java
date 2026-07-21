package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.PasswordResetToken;
import com.jeffsilva.jkcards.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken>
    findByTokenHashAndUsedAtIsNull(String tokenHash);

    Optional<PasswordResetToken>
    findFirstByUserOrderByCreatedAtDesc(User user);

    void deleteAllByUser(User user);
}