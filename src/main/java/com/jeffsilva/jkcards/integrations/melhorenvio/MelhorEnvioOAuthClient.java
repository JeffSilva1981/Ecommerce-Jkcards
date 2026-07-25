package com.jeffsilva.jkcards.integrations.melhorenvio;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioTokenResponse;
import com.jeffsilva.jkcards.services.exceptions.ShippingProviderException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class MelhorEnvioOAuthClient {

    private final RestClient restClient;
    private final MelhorEnvioProperties properties;

    public MelhorEnvioOAuthClient(MelhorEnvioProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.create();
    }

    public MelhorEnvioTokenResponse exchangeAuthorizationCode(String code) {
        validateOAuthConfiguration();

        if (code == null || code.isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio authorization code was not provided."
            );
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", properties.getClientId());
        formData.add("client_secret", properties.getClientSecret());
        formData.add("redirect_uri", properties.getRedirectUri());
        formData.add("code", code.trim());

        return requestToken(formData);
    }

    public MelhorEnvioTokenResponse refreshAccessToken(String refreshToken) {
        validateOAuthConfiguration();

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio refresh token was not found."
            );
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "refresh_token");
        formData.add("client_id", properties.getClientId());
        formData.add("client_secret", properties.getClientSecret());
        formData.add("refresh_token", refreshToken);

        return requestToken(formData);
    }

    private MelhorEnvioTokenResponse requestToken(
            MultiValueMap<String, String> formData) {

        try {
            MelhorEnvioTokenResponse response = restClient
                    .post()
                    .uri(properties.getTokenUrl())
                    .header("User-Agent", properties.getUserAgent())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(formData)
                    .retrieve()
                    .body(MelhorEnvioTokenResponse.class);

            validateTokenResponse(response);
            return response;
        } catch (RestClientResponseException e) {
            throw new ShippingProviderException(
                    "Melhor Envio rejected the authentication request. HTTP status: "
                            + e.getStatusCode().value(),
                    e
            );
        } catch (ResourceAccessException e) {
            throw new ShippingProviderException(
                    "It was not possible to access the Melhor Envio authentication service.",
                    e
            );
        }
    }

    private void validateOAuthConfiguration() {
        if (properties.getTokenUrl() == null
                || properties.getTokenUrl().isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio authentication URL is not configured."
            );
        }

        if (properties.getClientId() == null
                || properties.getClientId().isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio client ID is not configured."
            );
        }

        if (properties.getClientSecret() == null
                || properties.getClientSecret().isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio client secret is not configured."
            );
        }

        if (properties.getRedirectUri() == null
                || properties.getRedirectUri().isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio redirect URL is not configured."
            );
        }

        if (properties.getUserAgent() == null
                || properties.getUserAgent().isBlank()) {
            throw new ShippingProviderException(
                    "The Melhor Envio User-Agent is not configured."
            );
        }
    }

    private void validateTokenResponse(MelhorEnvioTokenResponse response) {
        if (response == null
                || response.getAccessToken() == null
                || response.getAccessToken().isBlank()
                || response.getRefreshToken() == null
                || response.getRefreshToken().isBlank()
                || response.getExpiresIn() == null
                || response.getExpiresIn() <= 0) {
            throw new ShippingProviderException(
                    "Melhor Envio returned an invalid authentication response."
            );
        }
    }
}