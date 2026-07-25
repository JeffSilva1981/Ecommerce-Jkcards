package com.jeffsilva.jkcards.dtos.shipping;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;

public class OrderShippingDto {

    private DeliveryMethod method;
    private Long serviceId;
    private String serviceName;
    private String carrier;
    private Double price;
    private Integer deliveryDays;

    public OrderShippingDto() {
    }

    public OrderShippingDto(DeliveryMethod method, Long serviceId, String serviceName, String carrier, Double price, Integer deliveryDays) {
        this.method = method;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.carrier = carrier;
        this.price = price;
        this.deliveryDays = deliveryDays;
    }

    public OrderShippingDto(Order entity) {
        method = entity.getDeliveryMethod();
        serviceId = entity.getShippingServiceId();
        serviceName = entity.getShippingServiceName();
        carrier = entity.getShippingCarrier();
        price = entity.getShippingPrice();
        deliveryDays = entity.getShippingDeliveryDays();
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

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getDeliveryDays() {
        return deliveryDays;
    }

    public void setDeliveryDays(Integer deliveryDays) {
        this.deliveryDays = deliveryDays;
    }
}