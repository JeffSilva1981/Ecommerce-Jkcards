package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.dtos.shipping.MelhorEnvioAuthorizationStatusDto;
import com.jeffsilva.jkcards.services.MelhorEnvioOAuthStateService;
import com.jeffsilva.jkcards.services.MelhorEnvioTokenService;
import com.jeffsilva.jkcards.services.exceptions.ShippingException;
import com.jeffsilva.jkcards.services.exceptions.ShippingProviderException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/shipping/oauth")
public class MelhorEnvioOAuthController {

    private static final String SHIPPING_SCOPE = "shipping-calculate";

    private final MelhorEnvioProperties properties;
    private final MelhorEnvioOAuthStateService stateService;
    private final MelhorEnvioTokenService tokenService;
    private final String frontendUrl;

    public MelhorEnvioOAuthController(
            MelhorEnvioProperties properties,
            MelhorEnvioOAuthStateService stateService,
            MelhorEnvioTokenService tokenService,
            @Value("${app.frontend-url}") String frontendUrl) {

        this.properties = properties;
        this.stateService = stateService;
        this.tokenService = tokenService;
        this.frontendUrl = frontendUrl;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/status")
    public ResponseEntity<MelhorEnvioAuthorizationStatusDto> getAuthorizationStatus() {
        MelhorEnvioAuthorizationStatusDto result =
                new MelhorEnvioAuthorizationStatusDto(tokenService.hasStoredAuthorization());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(value = "/authorization-url", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getAuthorizationUrl() {
        validateAuthorizationConfiguration();

        String state = stateService.generateState();

        String authorizationUrl = UriComponentsBuilder
                .fromUriString(properties.getAuthorizationUrl())
                .queryParam("client_id", properties.getClientId())
                .queryParam("redirect_uri", properties.getRedirectUri())
                .queryParam("response_type", "code")
                .queryParam("state", state)
                .queryParam("scope", SHIPPING_SCOPE)
                .build()
                .encode()
                .toUriString();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(authorizationUrl);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error) {

        stateService.validateState(state);

        if (StringUtils.hasText(error)) {
            throw new ShippingException(
                    "The Melhor Envio authorization was not completed."
            );
        }

        if (!StringUtils.hasText(code)) {
            throw new ShippingException(
                    "Melhor Envio did not return the authorization code."
            );
        }

        tokenService.authorizeWithCode(code);

        URI redirect = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/admin")
                .queryParam("melhorEnvio", "authorized")
                .build()
                .encode()
                .toUri();

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(redirect)
                .cacheControl(CacheControl.noStore())
                .build();
    }

    private void validateAuthorizationConfiguration() {
        if (!StringUtils.hasText(properties.getAuthorizationUrl())) {
            throw new ShippingProviderException(
                    "The Melhor Envio authorization URL is not configured."
            );
        }

        if (!StringUtils.hasText(properties.getClientId())) {
            throw new ShippingProviderException(
                    "The Melhor Envio client ID is not configured."
            );
        }

        if (!StringUtils.hasText(properties.getRedirectUri())) {
            throw new ShippingProviderException(
                    "The Melhor Envio redirect URL is not configured."
            );
        }
    }
}