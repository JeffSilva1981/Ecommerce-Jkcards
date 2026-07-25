package com.jeffsilva.jkcards.dtos.shipping;

public class MelhorEnvioAuthorizationStatusDto {

    private boolean authorized;

    public MelhorEnvioAuthorizationStatusDto() {
    }

    public MelhorEnvioAuthorizationStatusDto(boolean authorized) {
        this.authorized = authorized;
    }

    public boolean isAuthorized() {
        return authorized;
    }

    public void setAuthorized(boolean authorized) {
        this.authorized = authorized;
    }
}