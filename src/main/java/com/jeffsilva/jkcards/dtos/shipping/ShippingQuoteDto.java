package com.jeffsilva.jkcards.dtos.shipping;

import java.math.BigDecimal;

public class ShippingQuoteDto {

    private Long serviceId;
    private String serviceName;
    private String carrier;
    private String carrierPicture;
    private BigDecimal price;
    private Integer deliveryDays;

    public ShippingQuoteDto() {
    }

    public ShippingQuoteDto(
            Long serviceId,
            String serviceName,
            String carrier,
            String carrierPicture,
            BigDecimal price,
            Integer deliveryDays
    ) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.carrier = carrier;
        this.carrierPicture = carrierPicture;
        this.price = price;
        this.deliveryDays = deliveryDays;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getCarrier() {
        return carrier;
    }

    public String getCarrierPicture() {
        return carrierPicture;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getDeliveryDays() {
        return deliveryDays;
    }
}