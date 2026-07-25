package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.MelhorEnvioToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MelhorEnvioTokenRepository extends JpaRepository<MelhorEnvioToken, Long> {

    Optional<MelhorEnvioToken> findFirstByOrderByIdAsc();
}