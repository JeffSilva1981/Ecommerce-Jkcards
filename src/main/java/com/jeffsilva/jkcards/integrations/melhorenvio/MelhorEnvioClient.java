package com.jeffsilva.jkcards.integrations.melhorenvio;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteResponse;
import com.jeffsilva.jkcards.services.MelhorEnvioTokenService;
import com.jeffsilva.jkcards.services.exceptions.ShippingProviderException;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Component
public class MelhorEnvioClient {

    private static final String QUOTE_PATH =
            "/me/shipment/calculate";

    private final MelhorEnvioProperties properties;
    private final MelhorEnvioTokenService tokenService;
    private final RestClient restClient;

    public MelhorEnvioClient(
            MelhorEnvioProperties properties,
            MelhorEnvioTokenService tokenService
    ) {
        this.properties = properties;
        this.tokenService = tokenService;

        this.restClient = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public List<MelhorEnvioQuoteResponse> calculate(
            MelhorEnvioQuoteRequest request
    ) {
        validateConfiguration();

        String accessToken = tokenService.getValidAccessToken();

        try {
            List<MelhorEnvioQuoteResponse> response =
                    restClient.post()
                            .uri(QUOTE_PATH)
                            .header(
                                    HttpHeaders.AUTHORIZATION,
                                    "Bearer " + accessToken
                            )
                            .header(
                                    HttpHeaders.USER_AGENT,
                                    properties.getUserAgent()
                            )
                            .body(request)
                            .retrieve()
                            .body(
                                    new ParameterizedTypeReference<>() {
                                    }
                            );

            if (response == null) {
                throw new ShippingProviderException(
                        "O Melhor Envio retornou uma resposta vazia."
                );
            }

            return response;
        } catch (RestClientResponseException e) {
            throw new ShippingProviderException(
                    "O Melhor Envio recusou a solicitação de frete. "
                            + "Status HTTP: " + e.getStatusCode().value(),
                    e
            );
        } catch (ResourceAccessException e) {
            throw new ShippingProviderException(
                    "O serviço do Melhor Envio está temporariamente indisponível.",
                    e
            );
        }
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(properties.getBaseUrl())) {
            throw new ShippingProviderException(
                    "A URL da API do Melhor Envio não foi configurada."
            );
        }

        if (!StringUtils.hasText(properties.getUserAgent())) {
            throw new ShippingProviderException(
                    "O User-Agent do Melhor Envio não foi configurado."
            );
        }
    }
}