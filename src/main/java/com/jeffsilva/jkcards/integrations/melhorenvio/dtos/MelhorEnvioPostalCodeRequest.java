package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MelhorEnvioPostalCodeRequest {

    @JsonProperty("postal_code")
    private String postalCode;

    public MelhorEnvioPostalCodeRequest() {
    }

    public MelhorEnvioPostalCodeRequest(
            String postalCode
    ) {
        this.postalCode = postalCode;
    }

    public String getPostalCode() {
        return postalCode;
    }
}