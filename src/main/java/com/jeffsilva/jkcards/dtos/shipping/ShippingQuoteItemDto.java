package com.jeffsilva.jkcards.dtos.shipping;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ShippingQuoteItemDto {

    @NotNull(message = "The product id must not be empty.")
    @Positive(message = "The product id must be greater than zero.")
    private Long productId;

    @NotNull(message = "The quantity must not be empty.")
    @Positive(message = "The quantity must be greater than zero.")
    private Integer quantity;

    public ShippingQuoteItemDto() {
    }

    public ShippingQuoteItemDto(
            Long productId,
            Integer quantity
    ) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public Integer getQuantity() {
        return quantity;
    }
}