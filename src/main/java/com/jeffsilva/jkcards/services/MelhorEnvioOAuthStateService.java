package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.services.exceptions.ForbiddenException;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
public class MelhorEnvioOAuthStateService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final long STATE_VALIDITY_SECONDS = 600L;

    private final MelhorEnvioProperties properties;

    public MelhorEnvioOAuthStateService(
            MelhorEnvioProperties properties
    ) {
        this.properties = properties;
    }

    public String generateState() {
        validateClientSecret();

        String payload = Instant.now().getEpochSecond()
                + ":"
                + UUID.randomUUID();

        byte[] payloadBytes =
                payload.getBytes(StandardCharsets.UTF_8);

        byte[] signature = createSignature(payloadBytes);

        return encode(payloadBytes)
                + "."
                + encode(signature);
    }

    public void validateState(String state) {
        validateClientSecret();

        if (state == null || state.isBlank()) {
            throw new ForbiddenException(
                    "O estado da autorização do Melhor Envio não foi informado."
            );
        }

        String[] parts = state.split("\\.");

        if (parts.length != 2) {
            throw new ForbiddenException(
                    "O estado da autorização do Melhor Envio é inválido."
            );
        }

        try {
            byte[] payloadBytes = decode(parts[0]);
            byte[] receivedSignature = decode(parts[1]);
            byte[] expectedSignature = createSignature(payloadBytes);

            if (!MessageDigest.isEqual(
                    receivedSignature,
                    expectedSignature
            )) {
                throw new ForbiddenException(
                        "A assinatura da autorização do Melhor Envio é inválida."
                );
            }

            String payload = new String(
                    payloadBytes,
                    StandardCharsets.UTF_8
            );

            String[] payloadParts = payload.split(":");

            if (payloadParts.length != 2) {
                throw new ForbiddenException(
                        "O conteúdo da autorização do Melhor Envio é inválido."
                );
            }

            long createdAt = Long.parseLong(payloadParts[0]);
            long currentTime = Instant.now().getEpochSecond();

            if (createdAt > currentTime
                    || currentTime - createdAt > STATE_VALIDITY_SECONDS) {
                throw new ForbiddenException(
                        "A autorização do Melhor Envio expirou. "
                                + "Inicie o processo novamente."
                );
            }
        } catch (IllegalArgumentException e) {
            throw new ForbiddenException(
                    "O estado da autorização do Melhor Envio é inválido."
            );
        }
    }

    private byte[] createSignature(byte[] payload) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);

            SecretKeySpec key = new SecretKeySpec(
                    properties.getClientSecret()
                            .getBytes(StandardCharsets.UTF_8),
                    HMAC_ALGORITHM
            );

            mac.init(key);

            return mac.doFinal(payload);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Não foi possível proteger o estado OAuth "
                            + "do Melhor Envio.",
                    e
            );
        }
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value);
    }

    private byte[] decode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private void validateClientSecret() {
        if (properties.getClientSecret() == null
                || properties.getClientSecret().isBlank()) {
            throw new IllegalStateException(
                    "O Client Secret do Melhor Envio não foi configurado."
            );
        }
    }
}