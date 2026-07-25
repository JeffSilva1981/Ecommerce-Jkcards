package com.jeffsilva.jkcards.services.exceptions;

public class ShippingProviderException
        extends RuntimeException {

    public ShippingProviderException(String message) {
        super(message);
    }

    public ShippingProviderException(String message, Throwable cause) {
        super(message, cause);
    }
}