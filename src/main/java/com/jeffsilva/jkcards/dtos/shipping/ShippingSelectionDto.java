package com.jeffsilva.jkcards.dtos.shipping;

import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ShippingSelectionDto {

    @NotNull(message = "A delivery method must be selected.")
    private DeliveryMethod method;

    @Positive(message = "The shipping service ID must be positive.")
    private Long serviceId;

    public ShippingSelectionDto() {
    }

    public ShippingSelectionDto(DeliveryMethod method, Long serviceId) {
        this.method = method;
        this.serviceId = serviceId;
    }

    public DeliveryMethod getMethod() {
        return method;
    }

    public void setMethod(DeliveryMethod method) {
        this.method = method;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
}