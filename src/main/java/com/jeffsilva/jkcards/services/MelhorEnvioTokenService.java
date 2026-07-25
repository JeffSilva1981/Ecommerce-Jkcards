package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.entities.MelhorEnvioToken;
import com.jeffsilva.jkcards.integrations.melhorenvio.MelhorEnvioOAuthClient;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioTokenResponse;
import com.jeffsilva.jkcards.repositories.MelhorEnvioTokenRepository;
import com.jeffsilva.jkcards.services.exceptions.ShippingProviderException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class MelhorEnvioTokenService {

    private static final long EXPIRATION_MARGIN_MINUTES = 5L;

    private final MelhorEnvioTokenRepository repository;
    private final MelhorEnvioOAuthClient oauthClient;
    private final MelhorEnvioProperties properties;

    public MelhorEnvioTokenService(
            MelhorEnvioTokenRepository repository,
            MelhorEnvioOAuthClient oauthClient,
            MelhorEnvioProperties properties) {

        this.repository = repository;
        this.oauthClient = oauthClient;
        this.properties = properties;
    }

    @Transactional
    public synchronized void authorizeWithCode(String code) {
        MelhorEnvioTokenResponse response =
                oauthClient.exchangeAuthorizationCode(code);

        MelhorEnvioToken token = repository
                .findFirstByOrderByIdAsc()
                .orElseGet(MelhorEnvioToken::new);

        updateAndSaveToken(token, response);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String getValidAccessToken() {
        MelhorEnvioToken token = repository
                .findFirstByOrderByIdAsc()
                .orElse(null);

        if (token == null) {
            return getConfiguredFallbackToken();
        }

        if (isExpiring(token)) {
            MelhorEnvioTokenResponse response =
                    oauthClient.refreshAccessToken(token.getRefreshToken());

            updateAndSaveToken(token, response);
        }

        return token.getAccessToken();
    }

    @Transactional(readOnly = true)
    public boolean hasStoredAuthorization() {
        return repository.findFirstByOrderByIdAsc().isPresent();
    }

    private boolean isExpiring(MelhorEnvioToken token) {
        Instant renewalLimit = Instant.now()
                .plus(EXPIRATION_MARGIN_MINUTES, ChronoUnit.MINUTES);

        return token.getExpiresAt() == null
                || !token.getExpiresAt().isAfter(renewalLimit);
    }

    private void updateAndSaveToken(
            MelhorEnvioToken token,
            MelhorEnvioTokenResponse response) {

        Instant now = Instant.now();

        token.setAccessToken(response.getAccessToken());
        token.setRefreshToken(response.getRefreshToken());
        token.setTokenType(
                response.getTokenType() == null
                        || response.getTokenType().isBlank()
                        ? "Bearer"
                        : response.getTokenType()
        );

        token.setExpiresAt(now.plusSeconds(response.getExpiresIn()));

        if (token.getCreatedAt() == null) {
            token.setCreatedAt(now);
        }

        token.setUpdatedAt(now);
        repository.save(token);
    }

    private String getConfiguredFallbackToken() {
        String configuredToken = properties.getToken();

        if (configuredToken != null && !configuredToken.isBlank()) {
            return configuredToken.trim();
        }

        throw new ShippingProviderException(
                "O JKCards ainda não foi autorizado a acessar o Melhor Envio."
        );
    }
}