package com.jeffsilva.jkcards.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderCreateItemDto {

    @NotNull(message = "The product ID is required.")
    @Positive(message = "The product ID must be positive.")
    private Long productId;

    @NotNull(message = "The product quantity is required.")
    @Positive(message = "The product quantity must be positive.")
    private Integer quantity;

    public OrderCreateItemDto() {
    }

    public OrderCreateItemDto(
            Long productId,
            Integer quantity
    ) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}