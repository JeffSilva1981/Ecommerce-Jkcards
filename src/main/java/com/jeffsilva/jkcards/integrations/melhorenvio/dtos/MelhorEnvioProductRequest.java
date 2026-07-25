package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class MelhorEnvioProductRequest {

    private String id;
    private Double width;
    private Double height;
    private Double length;
    private Double weight;

    @JsonProperty("insurance_value")
    private BigDecimal insuranceValue;

    private Integer quantity;

    public MelhorEnvioProductRequest() {
    }

    public MelhorEnvioProductRequest(
            String id,
            Double width,
            Double height,
            Double length,
            Double weight,
            BigDecimal insuranceValue,
            Integer quantity
    ) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weight = weight;
        this.insuranceValue = insuranceValue;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }

    public Double getWidth() {
        return width;
    }

    public Double getHeight() {
        return height;
    }

    public Double getLength() {
        return length;
    }

    public Double getWeight() {
        return weight;
    }

    public BigDecimal getInsuranceValue() {
        return insuranceValue;
    }

    public Integer getQuantity() {
        return quantity;
    }
}