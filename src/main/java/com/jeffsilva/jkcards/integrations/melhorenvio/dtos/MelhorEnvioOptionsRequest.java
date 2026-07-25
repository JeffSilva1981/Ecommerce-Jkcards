package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MelhorEnvioOptionsRequest {

    private Boolean receipt;

    @JsonProperty("own_hand")
    private Boolean ownHand;

    public MelhorEnvioOptionsRequest() {
    }

    public MelhorEnvioOptionsRequest(
            Boolean receipt,
            Boolean ownHand
    ) {
        this.receipt = receipt;
        this.ownHand = ownHand;
    }

    public Boolean getReceipt() {
        return receipt;
    }

    public Boolean getOwnHand() {
        return ownHand;
    }
}