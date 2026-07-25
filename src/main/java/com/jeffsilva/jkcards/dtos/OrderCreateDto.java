package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.dtos.shipping.ShippingAddressDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingSelectionDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class OrderCreateDto {

    @Valid
    @NotEmpty(
            message = "The order must contain at least one item."
    )
    private List<OrderCreateItemDto> items =
            new ArrayList<>();

    @Valid
    @NotNull(
            message = "The shipping address is required."
    )
    private ShippingAddressDto shippingAddress;

    @Valid
    @NotNull(
            message = "The shipping option is required."
    )
    private ShippingSelectionDto shipping;

    public OrderCreateDto() {
    }

    public OrderCreateDto(
            List<OrderCreateItemDto> items,
            ShippingAddressDto shippingAddress,
            ShippingSelectionDto shipping
    ) {
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.shipping = shipping;
    }

    public List<OrderCreateItemDto> getItems() {
        return items;
    }

    public void setItems(
            List<OrderCreateItemDto> items
    ) {
        this.items = items;
    }

    public ShippingAddressDto getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(
            ShippingAddressDto shippingAddress
    ) {
        this.shippingAddress = shippingAddress;
    }

    public ShippingSelectionDto getShipping() {
        return shipping;
    }

    public void setShipping(
            ShippingSelectionDto shipping
    ) {
        this.shipping = shipping;
    }
}