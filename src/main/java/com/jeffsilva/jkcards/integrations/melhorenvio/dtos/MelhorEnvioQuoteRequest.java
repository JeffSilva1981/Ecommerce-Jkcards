package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

import java.util.ArrayList;
import java.util.List;

public class MelhorEnvioQuoteRequest {

    private MelhorEnvioPostalCodeRequest from;
    private MelhorEnvioPostalCodeRequest to;
    private List<MelhorEnvioProductRequest> products = new ArrayList<>();
    private MelhorEnvioOptionsRequest options;

    public MelhorEnvioQuoteRequest() {
    }

    public MelhorEnvioQuoteRequest(
            MelhorEnvioPostalCodeRequest from,
            MelhorEnvioPostalCodeRequest to,
            List<MelhorEnvioProductRequest> products,
            MelhorEnvioOptionsRequest options
    ) {
        this.from = from;
        this.to = to;
        this.products = products;
        this.options = options;
    }

    public MelhorEnvioPostalCodeRequest getFrom() {
        return from;
    }

    public MelhorEnvioPostalCodeRequest getTo() {
        return to;
    }

    public List<MelhorEnvioProductRequest> getProducts() {
        return products;
    }

    public MelhorEnvioOptionsRequest getOptions() {
        return options;
    }
}