package com.jeffsilva.jkcards.integrations.melhorenvio.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MelhorEnvioQuoteResponse {

    private Long id;
    private String name;
    private BigDecimal price;

    @JsonProperty("custom_price")
    private BigDecimal customPrice;

    @JsonProperty("delivery_time")
    private Integer deliveryTime;

    @JsonProperty("custom_delivery_time")
    private Integer customDeliveryTime;

    private MelhorEnvioCompanyResponse company;
    private String error;

    public MelhorEnvioQuoteResponse() {
    }

    public MelhorEnvioQuoteResponse(
            Long id,
            String name,
            BigDecimal price,
            BigDecimal customPrice,
            Integer deliveryTime,
            Integer customDeliveryTime,
            MelhorEnvioCompanyResponse company,
            String error
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.customPrice = customPrice;
        this.deliveryTime = deliveryTime;
        this.customDeliveryTime = customDeliveryTime;
        this.company = company;
        this.error = error;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getCustomPrice() {
        return customPrice;
    }

    public Integer getDeliveryTime() {
        return deliveryTime;
    }

    public Integer getCustomDeliveryTime() {
        return customDeliveryTime;
    }

    public MelhorEnvioCompanyResponse getCompany() {
        return company;
    }

    public String getError() {
        return error;
    }
}