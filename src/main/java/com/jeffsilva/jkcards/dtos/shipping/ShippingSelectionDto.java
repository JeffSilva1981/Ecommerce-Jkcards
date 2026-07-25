package com.jeffsilva.jkcards.dtos.shipping;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ShippingSelectionDto {

    @NotNull(message = "A shipping option must be selected.")
    @Positive(message = "The shipping service ID must be positive.")
    private Long serviceId;

    public ShippingSelectionDto() {
    }

    public ShippingSelectionDto(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
}